import {
    BlockErrorNode,
    BlockNode,
    BlocksNode,
    ElementNode,
    GroupNode,
    InlinerErrorNode,
    paragraphName,
    textName,
    traceNode,
    type ClassOf,
    type Node,
} from '@bitran-js/core';

import type { StringifyFactory } from './stringifyFactory';
import {
    resolveStringifyOptions,
    type StringifyOptions,
} from './stringifyOptions';
import type { ElementTranspilers } from '../transpiler';
import { stringifyMeta } from '../meta';
import { ParagraphStringifier, TextStringifier } from './stringifyDefault';

export class Stringifier {
    private factories: Record<string, ClassOf<StringifyFactory>> = {};

    constructor(transpilers: ElementTranspilers) {
        for (const [elementName, transpiler] of Object.entries(transpilers)) {
            this.factories[elementName] = transpiler.Stringifier;
        }

        this.factories[paragraphName] = ParagraphStringifier;
        this.factories[textName] = TextStringifier;
    }

    async stringify(node: Node, options?: Partial<StringifyOptions>) {
        const resolvedOptions = resolveStringifyOptions(options);

        //
        // Technical nodes
        //

        if (node instanceof BlockErrorNode) {
            resolvedOptions.step &&
                (await resolvedOptions.step(node, node.strBlock));
            return node.strBlock;
        }

        if (node instanceof InlinerErrorNode) {
            resolvedOptions.step &&
                (await resolvedOptions.step(node, node.strInliner));
            return node.strInliner;
        }

        if (node instanceof GroupNode) {
            const areBlocks = node instanceof BlocksNode;
            const children = node.children;

            if (!children || children.length === 0) return '';

            let result = '';
            for (const child of children) {
                result += await this.stringify(child, resolvedOptions);
                if (areBlocks) {
                    result += '\n\n';
                }
            }

            return areBlocks ? result.trim() : result;
        }

        //
        // User defined elements
        //

        if (node instanceof ElementNode) {
            const Factory = this.factories[node.name];
            if (!Factory) {
                console.error(traceNode(node));
                throw new Error(
                    `No stringifier found for element "${node?.name || node.constructor.name}"!`,
                );
            }

            const factory = new Factory();
            factory.stringifier = this;
            factory.stringifyOptions = resolvedOptions;
            factory.elementNode = node;

            let result = await factory.stringifyElement();

            if (Object.keys(node.meta).length > 0) {
                const isBlock = node instanceof BlockNode;
                const meta = stringifyMeta(node.meta, isBlock);
                if (meta) {
                    if (isBlock) {
                        result = `${meta}\n${result}`;
                    } else {
                        result += meta;
                    }
                }
            }

            resolvedOptions.step && (await resolvedOptions.step(node, result));

            return result;
        }

        //
        // ?!
        //

        console.error(traceNode(node));
        throw new Error(
            `Unknown node type "${node?.constructor?.name || node?.toString() || node}"!`,
        );
    }
}
