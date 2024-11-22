import { ParagraphNode, TextNode } from '@bitran-js/core';

import { Parser } from '../../src/parse/parser';

describe('Parser. No transpilers', () => {
    let parser: Parser;

    beforeEach(() => {
        parser = new Parser({});
    });

    describe('parse', () => {
        it('should parse empty text and return empty root', async () => {
            const root = await parser.parse('');
            expect(root.isEmpty()).toBe(true);
        });

        it('should parse non-empty text as a paragraph', async () => {
            const root = await parser.parse('Hello world');
            expect(root.children).toHaveLength(1);
            const blockNode = root.children![0] as ParagraphNode;
            expect(blockNode).toBeInstanceOf(ParagraphNode);
            expect(blockNode.parseData).toBeDefined();
        });
    });

    describe('parseBlocks', () => {
        it('should return empty array for empty text', async () => {
            const blocks = await parser.parseBlocks('');
            expect(blocks).toHaveLength(0);
        });

        it('should return single paragraph with single text node', async () => {
            const [paragraph] = await parser.parseBlocks('Hello world');
            const inliners = (paragraph as ParagraphNode).parseData;
            expect(inliners?.children).toHaveLength(1);
            const textNode = inliners?.children?.[0] as TextNode;
            expect(textNode).toBeInstanceOf(TextNode);
            expect(textNode.parseData).toBe('Hello world');
        });
    });

    describe('parseInliners', () => {
        it('should return empty array for empty text', async () => {
            const inliners = await parser.parseInliners('');
            expect(inliners).toHaveLength(0);
        });

        it('should return single text node', async () => {
            const inliners = await parser.parseInliners('Hello world');
            expect(inliners).toHaveLength(1);
            const textNode = inliners[0] as TextNode;
            expect(textNode).toBeInstanceOf(TextNode);
            expect(textNode.parseData).toBe('Hello world');
        });
    });

    describe('Step function', () => {
        let stepFn: jest.Mock;

        beforeEach(() => {
            stepFn = jest.fn();
        });

        it('should be called 2 times', async () => {
            await parser.parse('Hello world', { step: stepFn });
            // 1 call for the ParagraphNode, 1 call for the TextNode
            expect(stepFn).toHaveBeenCalledTimes(2);
        });

        it('should be called 4 times', async () => {
            await parser.parseBlocks('Hello\n\nWorld', { step: stepFn });
            // 2 paragraphs each containing a text node => 4 calls
            expect(stepFn).toHaveBeenCalledTimes(4);
        });

        it('should be called once', async () => {
            await parser.parseInliners('Hello world', { step: stepFn });
            // Only one TextNode => 1 call
            expect(stepFn).toHaveBeenCalledTimes(1);
        });
    });
});
