import {
    BlocksNode,
    InlinersNode,
    type BlockNode,
    type ClassOf,
    type ElementNode,
    type GenericElementSchema,
    type InlinerNode,
    type ProvideElementSchema,
} from '@bitran-js/core';

import type { Parser } from './parser';
import type { ParseOptions } from './parseOptions';
import type { ElementTranspiler } from '../transpiler';
import { parseYAML, splitFirstLine } from '../utils/str';
import { tryRange, type Range } from '../utils/range';
import { isPlainObject } from '../utils/plainObject';

export abstract class ParseFactory<
    T extends GenericElementSchema = GenericElementSchema,
> {
    parser!: Parser;
    parseOptions!: ParseOptions;
    elementNode!: ElementNode<T>;

    abstract createParseData(strElement: string): Promise<T['ParseData']>;

    payload() {
        if (!this.elementNode)
            throw new Error(
                `Can't call payload() before element node is created!`,
            );

        const node = this.elementNode;
        const meta = node.meta;
        const transpiler = this.parser.transpilers[
            node.name
        ]! as ElementTranspiler<T>;
        const provide = transpiler.provide as T extends ProvideElementSchema
            ? T['Provide']
            : never;

        return {
            transpiler,
            node,
            meta,
            provide,
        };
    }

    async alterAutoId(
        id: string,
        elementNode: ElementNode,
        strNode: string,
    ): Promise<string> {
        return id;
    }

    async parseBlocks(text: string) {
        const blocksNode = new BlocksNode(this.elementNode);
        blocksNode.setNodes(
            await this.parser.parseBlocks(text, this.parseOptions),
        );
        return blocksNode;
    }

    async parseInliners(text: string) {
        const inlinersNode = new InlinersNode(this.elementNode);
        inlinersNode.setNodes(
            await this.parser.parseInliners(text, this.parseOptions),
        );
        return inlinersNode;
    }
}

export abstract class BlockParseFactory<
    T extends GenericElementSchema = GenericElementSchema,
> extends ParseFactory<T> {
    declare elementNode: BlockNode<T>;

    abstract canParse(strBlock: string): boolean;

    abstract override createParseData(
        strBlock: string,
    ): Promise<T['ParseData']>;
}

export abstract class ObjBlockParseFactory<
    T extends GenericElementSchema = GenericElementSchema,
> extends BlockParseFactory<T> {
    abstract objName: string;

    abstract parseDataFromObj(
        obj: any,
        strBlock: string,
    ): Promise<T['ParseData']>;

    override canParse(strBlock: string): boolean {
        return strBlock.match(/^@(\S+)$/m)?.[1] === this.objName;
    }

    override async createParseData(strBlock: string): Promise<T['ParseData']> {
        const { restText } = splitFirstLine(strBlock);
        const parseMode = this.getParseMode(restText);

        if (parseMode === 'string') {
            return this.parseDataFromObj(restText, strBlock);
        }

        const parsedContent = parseYAML(restText);

        if (parseMode === 'object') {
            if (!isPlainObject(parsedContent)) {
                throw new Error(
                    `Block "${this.objName}" content must be a plain object!`,
                );
            }
        }

        return this.parseDataFromObj(parsedContent, strBlock);
    }

    getParseMode(content: string): 'string' | 'object' | 'any' {
        return 'object';
    }
}

export abstract class InlinerParseFactory<
    T extends GenericElementSchema = GenericElementSchema,
> extends ParseFactory<T> {
    declare elementNode: InlinerNode<T>;

    abstract outlineRanges(text: string): Range[];

    abstract override createParseData(
        strInliner: string,
    ): Promise<T['ParseData']>;
}

export abstract class RegexpInlinerParseFactory<
    T extends GenericElementSchema = GenericElementSchema,
> extends InlinerParseFactory<T> {
    abstract regexp: RegExp;

    abstract parseDataFromRegexp(
        match: RegExpExecArray,
    ): Promise<T['ParseData']>;

    override outlineRanges(text: string) {
        const ranges: Range[] = [];
        const matches = text.matchAll(new RegExp(this.regexp));

        for (const match of matches) {
            const range = tryRange(match.index, match.index + match[0].length);
            if (range) ranges.push(range);
        }

        return ranges;
    }

    override async createParseData(
        strInliner: string,
    ): Promise<T['ParseData']> {
        return this.parseDataFromRegexp(
            new RegExp(this.regexp).exec(strInliner)!,
        );
    }
}

export type ElementParseFactoryClass<
    T extends GenericElementSchema = GenericElementSchema,
> = ClassOf<BlockParseFactory<T> | InlinerParseFactory<T>>;
