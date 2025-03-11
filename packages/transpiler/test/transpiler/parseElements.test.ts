import {
    RootNode,
    ParagraphNode,
    TextNode,
    BlockErrorNode,
    ElementNode,
    textName,
} from '@bitran-js/core';

import { Parser } from '../../src/parse/parser';

import {
    headingTranspiler,
    dashTranspiler,
    boldTranspiler,
    HeadingNode,
    BoldNode,
    DashNode,
} from './elements';

describe('Parser. Custom transpilers', () => {
    let parser: Parser;
    let root: RootNode;

    beforeAll(async () => {
        parser = new Parser({
            heading: headingTranspiler,
            dash: dashTranspiler,
            bold: boldTranspiler,
        });

        const text = `
# Heading 1

This is a paragraph with **bold text**{ #bold .foo } and a -- dash --.

@heading
    level: 2
    title: Object Heading

{ +throw }
### This heading should throw
`;

        root = await parser.parse(text);
    });

    it('should parse root node correctly', () => {
        expect(root).toBeInstanceOf(RootNode);
        expect(root.children).toHaveLength(4);
    });

    it('should parse first heading correctly', () => {
        const heading = root.children![0] as HeadingNode;
        expect(heading).toBeInstanceOf(HeadingNode);
        expect(heading.name).toBe('heading');
        expect(heading.parseData).toEqual({
            level: 1,
            obj: false,
            title: '[default prefix] Heading 1 [default postfix]',
        });
    });

    it('should parse first paragraph correctly', () => {
        const paragraph = root.children![1] as ParagraphNode;
        expect(paragraph).toBeInstanceOf(ParagraphNode);
        const inliners = paragraph.parseData.children!;

        expect(
            inliners.map((inliner) => (inliner as ElementNode).name),
        ).toEqual([textName, 'bold', textName, 'dash', textName]);

        const textNode1 = inliners[0] as TextNode;
        expect(textNode1.parseData).toBe('This is a paragraph with ');

        const boldNode = inliners[1] as BoldNode;
        expect(boldNode).toBeInstanceOf(BoldNode);
        expect(boldNode.name).toBe('bold');
        expect(boldNode.parseData).toBe('bold text');

        const textNode2 = inliners[2] as TextNode;
        expect(textNode2.parseData).toBe(' and a');

        const dashNode = inliners[3] as DashNode;
        expect(dashNode).toBeInstanceOf(DashNode);
        expect(dashNode.name).toBe('dash');

        const textNode3 = inliners[4] as TextNode;
        expect(textNode3.parseData).toBe('dash --.');
    });

    it('should parse object heading correctly', () => {
        const heading = root.children![2] as HeadingNode;
        expect(heading).toBeInstanceOf(HeadingNode);
        expect(heading.name).toBe('heading');
        expect(heading.parseData).toEqual({
            level: 2,
            obj: true,
            title: '[default prefix] Object Heading [default postfix]',
        });
    });

    it('should create error heading', () => {
        const heading = root.children![3] as BlockErrorNode;
        expect(heading).toBeInstanceOf(BlockErrorNode);
        expect(heading.name).toBe('heading');
        expect(heading.strBlock).toBe(
            '{ +throw }\n### This heading should throw',
        );
        expect(heading.error).toBeDefined();
    });

    it('should parse inline bold meta', () => {
        const bold = (root.children![1] as ParagraphNode).parseData
            .children![1] as BoldNode;

        expect(bold.meta).toEqual({ id: 'bold', classes: ['foo'] });
    });

    describe('Step function', () => {
        let stepFn: jest.Mock;

        beforeEach(() => {
            stepFn = jest.fn();
        });

        it('should be called 7 times for "parse"', async () => {
            await parser.parse(
                `
{ +throw }
# Heading 1

This is a paragraph with **bold text** and a -- dash --.
`,
                { step: stepFn },
            );
            // 1 call for errored HeadingNode, 1 call for the ParagraphNode, 3 calls for TextNodes, 1 for BoldNode and 1 for DashNode => 7 calls
            expect(stepFn).toHaveBeenCalledTimes(7);
        });

        it('should be called 7 times fro "parseBlocks"', async () => {
            await parser.parseBlocks(
                `
# Heading 1

This is a paragraph with **bold text** and a -- dash --.
`,
                { step: stepFn },
            );
            // 1 call for errored HeadingNode, 1 call for the ParagraphNode, 3 calls for TextNodes, 1 for BoldNode and 1 for DashNode => 7 calls
            expect(stepFn).toHaveBeenCalledTimes(7);
        });

        it('should be called 5 times for "parseInliners"', async () => {
            await parser.parseInliners(
                'This is a paragraph with **bold text** and a -- dash --.',
                { step: stepFn },
            );
            // 1 call for each TextNode, BoldNode, and DashNode => 5 calls
            expect(stepFn).toHaveBeenCalledTimes(5);
        });
    });
});
