import { InlinersNode, ParagraphNode, RootNode, TextNode } from '../../src';
import { traceNodeDown, traceNodeUp } from '../../src/dom/trace';

describe('traceNodeUp', () => {
    it('should return the trace for a single root node', async () => {
        const rootNode = new RootNode();
        expect(await traceNodeUp(rootNode)).toBe('<RootNode>');
    });

    it('should return the trace for deep nested node', async () => {
        const textNode = new TextNode();
        textNode.parseData = 'Hello, World!';

        const paragraph = new ParagraphNode();
        const paragraphInliners = new InlinersNode(paragraph);
        paragraphInliners.setNodes(textNode);
        paragraph.parseData = paragraphInliners;

        const rootNode = new RootNode();
        rootNode.setNodes(paragraph);

        const trace = await traceNodeUp(textNode);

        expect(trace).toBe(
            `
<RootNode>
  ParagraphNode
    <InlinersNode>
      TextNode
        `.trim(),
        );
    });

    it('should detect missing parent if no root node is found', async () => {
        const textNode = new TextNode();
        textNode.parseData = 'Hello, World!';

        const paragraph = new ParagraphNode();
        const paragraphInliners = new InlinersNode(paragraph);
        paragraphInliners.setNodes(textNode);
        paragraph.parseData = paragraphInliners;

        const trace = await traceNodeUp(textNode);

        expect(trace).toBe(
            `
!NO_PARENT!
  ParagraphNode
    <InlinersNode>
      TextNode
        `.trim(),
        );
    });
});

describe('traceNodeDown', () => {
    it('should return the trace for a single root node', async () => {
        const rootNode = new RootNode();
        expect(await traceNodeDown(rootNode)).toBe('<RootNode>');
    });

    it('should return the trace for a root node with one child', async () => {
        const rootNode = new RootNode();
        const paragraph = new ParagraphNode();
        rootNode.setNodes(paragraph);

        const trace = await traceNodeDown(rootNode);

        expect(trace).toBe(
            `
<RootNode>
  ParagraphNode
        `.trim(),
        );
    });

    it('should return the trace for a deep nested structure', async () => {
        const textNode = new TextNode();
        textNode.parseData = 'Hello, World!';

        const paragraph = new ParagraphNode();
        const paragraphInliners = new InlinersNode(paragraph);
        paragraphInliners.setNodes(textNode);
        paragraph.parseData = paragraphInliners;

        const rootNode = new RootNode();
        rootNode.setNodes(paragraph);

        const trace = await traceNodeDown(rootNode);

        expect(trace).toBe(
            `
<RootNode>
  ParagraphNode
    <InlinersNode>
      TextNode
        `.trim(),
        );
    });
});
