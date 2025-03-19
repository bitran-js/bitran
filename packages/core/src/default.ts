import type { DefineElementSchema } from './schema';
import type { InlinersNode } from './dom/group';
import { BlockNode, InlinerNode } from './dom/element';

//
// Paragraph
//

export const paragraphName = 'paragraph';

export type ParagraphSchema = DefineElementSchema<{
    ParseData: InlinersNode;
}>;

export class ParagraphNode extends BlockNode<ParagraphSchema> {
    override name = paragraphName;

    override get children() {
        return this.parseData ? [this.parseData] : undefined;
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
