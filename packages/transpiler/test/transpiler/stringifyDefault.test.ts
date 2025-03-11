import {
    type ElementMeta,
    ParagraphNode,
    TextNode,
    RootNode,
    InlinersNode,
    BlockErrorNode,
    InlinerErrorNode,
} from '@bitran-js/core';

import { Stringifier } from '../../src/stringify/stringifier';

function createParagraph(text: string, meta?: ElementMeta) {
    const textNode = new TextNode();
    textNode.parseData = text;

    const paragraph = new ParagraphNode();
    const paragraphInliners = new InlinersNode(paragraph);
    paragraphInliners.setNodes(textNode);
    paragraph.parseData = paragraphInliners;

    if (meta) paragraph.meta = meta;

    return paragraph;
}

//
//
//

describe('Stringifier. No transpilers', () => {
    const stringifier = new Stringifier({});
    let root: RootNode;
    let stepFn: jest.Mock;

    beforeEach(() => {
        root = new RootNode();
        stepFn = jest.fn();
    });

    it('should stringify empty root and return empty string', async () => {
        const result = await stringifier.stringify(root, { step: stepFn });
        expect(result).toBe('');

        // No element nodes => no calls
        expect(stepFn).toHaveBeenCalledTimes(0);
    });

    it('should stringify a few paragraphs', async () => {
        root.setNodes(
            createParagraph('First Paragraph'),
            createParagraph('Second,\nParagraph!', {
                id: 'p2',
                classes: ['foo', 'bar'],
                toc: true,
            }),
            createParagraph('Third Paragraph', { foo: { baz: 'bar' } }),
        );

        const result = await stringifier.stringify(root, { step: stepFn });
        expect(result).toBe(
            `
First Paragraph

{ #p2 .foo .bar +toc }
Second,
Paragraph!

{
    foo:
        baz: bar
}
Third Paragraph`.trim(),
        );

        // 3 calls for ParagraphNodes, 3 calls for TextNodes => 6 calls
        expect(stepFn).toHaveBeenCalledTimes(6);
    });

    it('should stringify error block', async () => {
        const blockError = new BlockErrorNode();
        blockError.strBlock = 'Error block source text.';
        root.setNodes(blockError);

        const result = await stringifier.stringify(root, { step: stepFn });
        expect(result).toBe('Error block source text.');
        expect(stepFn).toHaveBeenCalledTimes(1);
    });

    it('should stringify error inliner', async () => {
        const inlinerError = new InlinerErrorNode();
        inlinerError.strInliner = 'Error inliner source text.';
        root.setNodes(inlinerError);

        const result = await stringifier.stringify(root, { step: stepFn });
        expect(result).toBe('Error inliner source text.');
        expect(stepFn).toHaveBeenCalledTimes(1);
    });
});
