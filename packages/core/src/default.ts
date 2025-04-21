import type { DefineElementSchema } from './schema';
import type { InlinersNode } from './dom/group';
import { BlockNode, InlinerNode } from './dom/element';

//
// Paragraph
//

export const paragraphName = 'paragraph';

export const paragraphAligments = [
    'left',
    'center',
    'right',
    'justify',
] as const;

export const paragraphFonts = ['main', 'alt'] as const;

export type ParagraphAlignment = (typeof paragraphAligments)[number];
export type ParagraphFont = (typeof paragraphFonts)[number];

export interface ParagraphParseData {
    content: InlinersNode;
    alignment?: ParagraphAlignment;
    font?: ParagraphFont;
}

type ParagraphMeta = {
    [K in ParagraphAlignment as `text-${K}`]?: null;
} & {
    [K in ParagraphFont as `font-${K}`]?: null;
};

export type ParagraphSchema = DefineElementSchema<{
    ParseData: ParagraphParseData;
    Meta: ParagraphMeta;
}>;

export class ParagraphNode extends BlockNode<ParagraphSchema> {
    override name = paragraphName;

    override get children() {
        return this?.parseData?.content ? [this.parseData.content] : undefined;
    }
}

//
// Text
//

export const textName = 'text';

export type TextSchema = DefineElementSchema<{
    ParseData: string;
}>;

export class TextNode extends InlinerNode<TextSchema> {
    override name = textName;
}
