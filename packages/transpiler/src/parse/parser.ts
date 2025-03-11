import {
    BlockErrorNode,
    BlockNode,
    InlinerErrorNode,
    InlinerNode,
    InlinersNode,
    ParagraphNode,
    RootNode,
    TextNode,
    type ClassOf,
} from '@bitran-js/core';

import { BlockParseFactory, InlinerParseFactory } from './parseFactory';
import { resolveParseOptions, type ParseOptions } from './parseOptions';
import { createAutoId } from './autoId';
import { detachMeta, parseMeta } from '../meta';
import type { ElementTranspilers } from '../transpiler';
import { normalizeLineEndings, textToStrBlocks } from '../utils/str';
import { getIntersection, RangeIntersection, type Range } from '../utils/range';

export class Parser {
    transpilers: ElementTranspilers;
    private blockFactories: [string, ClassOf<BlockParseFactory>][] = [];
    private inlinerFactories: [string, ClassOf<InlinerParseFactory>][] = [];

    constructor(transpilers: ElementTranspilers) {
        this.transpilers = transpilers;
        for (const [elementName, transpiler] of Object.entries(transpilers)) {
            for (const Parser of transpiler.Parsers) {
                const factories =
                    this[
                        Parser.prototype instanceof BlockParseFactory
                            ? 'blockFactories'
                            : 'inlinerFactories'
                    ];

                factories.push([elementName, Parser as any]);
            }
        }
    }

    //
    // Blocks
    //

    async parse(
        text: string,
        options?: Partial<ParseOptions>,
    ): Promise<RootNode> {
        const resolvedOptions = resolveParseOptions(options);
        const root = new RootNode();
        root.setNodes(await this.parseBlocks(text, resolvedOptions));
        return root;
    }

    async parseBlocks(
        text: string,
        options?: Partial<ParseOptions>,
    ): Promise<BlockNode[]> {
        if (!text) return [];
        text = normalizeLineEndings(text);
        const resolvedOptions = resolveParseOptions(options);

        const blocks: BlockNode[] = [];
        for (const strBlock of textToStrBlocks(text)) {
            const block = await this.parseBlock(strBlock, resolvedOptions);
            if (block) blocks.push(block);
        }

        return blocks;
    }

    private async parseBlock(
        strBlock: string,
        options: ParseOptions,
    ): Promise<BlockNode> {
        const { meta, restText } = detachMeta(strBlock);

        for (const [blockName, BlockFactory] of this.blockFactories) {
            const BlockNode = this.transpilers[blockName]!.Node;
            const block = new BlockNode();
            block.name = blockName;
            block.meta = meta;

            const factory = new BlockFactory();
            factory.parser = this;
            factory.parseOptions = options;
            factory.elementNode = block;

            if (!factory.canParse(restText)) continue;

            try {
                block.parseData = await factory.createParseData(restText);
                block.autoId = createAutoId(
                    options.autoId,
                    factory,
                    block,
                    strBlock,
                );
                options.step && (await options.step(block, strBlock));
                return block;
            } catch (error) {
                const blockError = new BlockErrorNode();
                blockError.name = blockName;
                blockError.strBlock = strBlock;
                blockError.error = error;
                options.step && (await options.step(blockError, strBlock));
                return blockError;
            }
        }

        // If no block factory can parse the block, fallback to paragraph

        const paragraph = new ParagraphNode();
        paragraph.meta = meta;
        paragraph.autoId = createAutoId(
            options.autoId,
            undefined,
            paragraph,
            strBlock,
        );

        const inliners = await this.parseInliners(restText, options);
        const inlinersNode = new InlinersNode(paragraph);
        inlinersNode.setNodes(inliners);
        paragraph.parseData = inlinersNode;
        options.step && (await options.step(paragraph, strBlock));

        return paragraph;
    }

    //
    // Inliners
    //

    async parseInliners(
        text: string,
        options?: Partial<ParseOptions>,
    ): Promise<InlinerNode[]> {
        if (!text) return [];
        text = normalizeLineEndings(text);

        const resolvedOptions = resolveParseOptions(options);

        //
        // Resolving ranges
        //

        let rangeFactories: { name: string; factory: InlinerParseFactory }[] =
            [];
        let ranges: Range[] = [];

        for (const [inlinerName, InlinerFactory] of this.inlinerFactories) {
            const factory = new InlinerFactory();
            factory.parser = this;
            factory.parseOptions = resolvedOptions;

            const newRanges: Range[] = factory.outlineRanges(text);

            for (const newRange of newRanges) {
                let rangeIndex = 0;
                let removeIndexes: number[] = [];
                let approved = true;

                for (const toCompareWithRange of ranges) {
                    switch (getIntersection(newRange, toCompareWithRange)) {
                        case RangeIntersection.Partial:
                        case RangeIntersection.Inside:
                            approved = false;
                            break;
                        case RangeIntersection.Contain:
                            removeIndexes.push(rangeIndex);
                            break;
                    }

                    if (!approved) {
                        removeIndexes = [];
                        break;
                    }

                    rangeIndex += 1;
                }

                if (approved) {
                    removeIndexes.forEach((index) => {
                        rangeFactories.splice(index, 1);
                        ranges.splice(index, 1);
                    });

                    // Find the correct position to insert the new range
                    let insertIndex = ranges.findIndex(
                        (r) => r.start > newRange.start,
                    );
                    if (insertIndex === -1) insertIndex = ranges.length;

                    ranges.splice(insertIndex, 0, newRange);
                    rangeFactories.splice(insertIndex, 0, {
                        name: inlinerName,
                        factory,
                    });
                }
            }
        }

        //
        // Parsing ranges
        //

        const inliners: InlinerNode[] = [];

        const pushTextNode = async (text: string) => {
            const textNode = new TextNode();
            textNode.parseData = text;
            textNode.autoId = createAutoId(
                resolvedOptions.autoId,
                undefined,
                textNode,
                text,
            );
            resolvedOptions.step &&
                (await resolvedOptions.step(textNode, text));
            inliners.push(textNode);
        };

        let startText = text.slice(0, ranges[0]?.start ?? text.length);

        if (startText) await pushTextNode(startText);

        for (let i = 0; i < ranges.length; i++) {
            const { name: inlinerName, factory } = rangeFactories[i]!;
            const InlinerNode = this.transpilers[inlinerName]!.Node;
            const inliner = new InlinerNode();
            inliner.name = inlinerName;
            factory.elementNode = inliner;

            const range = ranges[i]!;

            let afterText = text.slice(
                range.end,
                ranges[i + 1]?.start ?? text.length,
            );
            afterText = afterText.replace(/^{(.+)}/, (match, lineMeta) => {
                inliner.meta = parseMeta(lineMeta);
                return '';
            });

            const parseText = text.slice(range.start, range.end);

            try {
                inliner.parseData = await factory.createParseData(parseText);
                inliner.autoId = createAutoId(
                    resolvedOptions.autoId,
                    factory,
                    inliner,
                    parseText,
                );
                resolvedOptions.step &&
                    (await resolvedOptions.step(inliner, parseText));
                inliners.push(inliner);
            } catch (error) {
                const inlinerError = new InlinerErrorNode();
                inlinerError.name = inlinerName;
                inlinerError.strInliner = parseText;
                inlinerError.error = error;
                resolvedOptions.step &&
                    (await resolvedOptions.step(inlinerError, parseText));
                inliners.push(inlinerError);
            }

            if (afterText) await pushTextNode(afterText);
        }

        return inliners;
    }
}
