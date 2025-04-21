import type { ParagraphSchema, TextSchema } from '@bitran-js/core';

import { StringifyFactory } from './stringifyFactory';

export class ParagraphStringifier extends StringifyFactory<ParagraphSchema> {
    override async stringifyElement() {
        const { parseData } = this.payload();
        return await this.stringify(parseData.content);
    }
}

export class TextStringifier extends StringifyFactory<TextSchema> {
    override async stringifyElement() {
        const { parseData } = this.payload();
        return parseData;
    }
}
