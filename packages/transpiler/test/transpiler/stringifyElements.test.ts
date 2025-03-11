import {
    InlinersNode,
    ParagraphNode,
    RootNode,
    TextNode,
    type ElementMeta,
    type InlinerNode,
} from '@bitran-js/core';

import { Stringifier } from '../../src';

import {
    BoldNode,
    boldTranspiler,
    DashNode,
    dashTranspiler,
    HeadingNode,
    headingTranspiler,
    type BoldSchema,
    type HeadingSchema,
} from './elements';

function createHeading(
    parseData: HeadingSchema['ParseData'],
    meta?: ElementMeta,
) {
    const headingNode = new HeadingNode();
    headingNode.name = 'heading';
    headingNode.parseData = parseData;
    headingNode.meta = meta ?? {};
    return headingNode;
}

function createDash() {
    const dashNode = new DashNode();
    dashNode.name = 'dash';
    return dashNode;
}

function createBold(parseData: BoldSchema['ParseData'], meta?: ElementMeta) {
    const boldNode = new BoldNode();
    boldNode.name = 'bold';
    boldNode.parseData = parseData;
    boldNode.meta = meta ?? {};
    return boldNode;
}

function createParagraph(...inliners: InlinerNode[]) {
    const paragraph = new ParagraphNode();
    const paragraphInliners = new InlinersNode(paragraph);
    paragraphInliners.setNodes(...inliners);
    paragraph.parseData = paragraphInliners;
    return paragraph;
}

function createText(text: string) {
    const textNode = new TextNode();
    textNode.parseData = text;
    return textNode;
}

//
//
//

describe('Stringifier. Custom transpilers', () => {
    let stringifier = new Stringifier({
        heading: headingTranspiler,
        dash: dashTranspiler,
        bold: boldTranspiler,
    });

    const root = new RootNode();

    const heading1 = createHeading({
        level: 1,
        title: 'Heading 1',
    });

    const text1 = createText('This is a paragraph with ');
    const bold = createBold('bold text', { id: 'bold', classes: ['foo'] });
    const text2 = createText(' and a');
    const dash = createDash();
    const text3 = createText('dash --.');

    const paragraph = createParagraph(text1, bold, text2, dash, text3);

    const heading2 = createHeading({
        level: 2,
        title: 'Object Heading',
        obj: true,
    });

    const heading3 = createHeading(
        {
            level: 3,
            title: 'This heading should throw',
        },
        { throw: true },
    );

    root.setNodes(heading1, paragraph, heading2, heading3);

    it('should stringify DOM with custom elements', async () => {
        const result = await stringifier.stringify(root);

        const text = `
# Heading 1

This is a paragraph with **bold text**{ #bold .foo } and a -- dash --.

@heading
    level: 2
    title: Object Heading

{ +throw }
### This heading should throw
        `.trim();

        expect(result).toBe(text);
    });
});
