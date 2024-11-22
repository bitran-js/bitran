import { defineBitranTranspiler } from '../../src';

import {
    boldTranspiler,
    dashTranspiler,
    defineHeadingTranspiler,
} from './elements';

const bitranTranspiler = defineBitranTranspiler({
    heading: defineHeadingTranspiler({ prefix: '', postfix: '' }),
    dash: dashTranspiler,
    bold: boldTranspiler,
});

describe('Invertibility', () => {
    it('should reverse empty text', async () => {
        const text = '';

        const parsedText = await bitranTranspiler.parser.parse(text);
        const stringifiedText =
            await bitranTranspiler.stringifier.stringify(parsedText);

        expect(stringifiedText).toBe(text);
    });

    it('should reverse simple text', async () => {
        const text = `
{ #p1 .foo .bar }
First paragraph.

{
    foo:
        bar:
            baz: 42
}
Second paragraph
        `.trim();

        const parsedText = await bitranTranspiler.parser.parse(text);
        const stringifiedText =
            await bitranTranspiler.stringifier.stringify(parsedText);

        expect(stringifiedText).toBe(text);
    });

    it('should reverse text with custom elements', async () => {
        const text = `
# Heading 1

This is a paragraph with **bold text**{ #bold .foo } and a -- dash --.

@heading
    level: 2
    title: Object Heading

{ +throw }
### This heading should throw
        `.trim();

        const parsedText = await bitranTranspiler.parser.parse(text);
        const stringifiedText =
            await bitranTranspiler.stringifier.stringify(parsedText);

        expect(stringifiedText).toBe(text);
    });
});
