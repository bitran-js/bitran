import type {
    ParagraphNode,
    ParagraphSchema,
    TextNode,
    TextSchema,
} from '@bitran-js/core';

import { StringifyFactory } from './stringifyFactory';

export class ParagraphStringifier extends StringifyFactory<ParagraphSchema> {
    override async stringifyElement(elementNode: ParagraphNode) {
        return await this.stringify(elementNode.parseData);
    }
}

export class TextStringifier extends StringifyFactory<TextSchema> {
    override async stringifyElement(elementNode: TextNode) {
        return elementNode.parseData;
    }
}
