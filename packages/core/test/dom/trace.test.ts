import { InlinersNode, ParagraphNode, RootNode, TextNode } from '../../src';
import { traceNode } from '../../src/dom/trace';

describe('traceNode', () => {
    it('should return the trace for a single root node', async () => {
        const rootNode = new RootNode();
        expect(await traceNode(rootNode)).toBe('<RootNode>');
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

        const trace = await traceNode(textNode);

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

        const trace = await traceNode(textNode);

        expect(trace).toBe(
            `
!NO_PARENT!
  ParagraphNode
    <InlinersNode>
      TextNode
        `.trim(),
        );
    });

    // it('should return the trace for a node with a parent', async () => {
    //     const rootNode = new TestNode('root');
    //     const childNode = new TestNode('child', rootNode);
    //     const trace = await traceNode(childNode);
    //     expect(trace).toBe('<TestNode>\n    <TestNode>\n');
    // });

    // it('should return the trace for a node with multiple parents', async () => {
    //     const rootNode = new TestNode('root');
    //     const parentNode = new TestNode('parent', rootNode);
    //     const childNode = new TestNode('child', parentNode);
    //     const trace = await traceNode(childNode);
    //     expect(trace).toBe('<TestNode>\n    <TestNode>\n        <TestNode>\n');
    // });

    // it('should return "!undefined!" if the root node is not a root node', async () => {
    //     const node = new TestNode('node');
    //     const trace = await traceNode(node);
    //     expect(trace).toBe('!undefined!\n<TestNode>\n');
    // });

    // it('should handle different node types', async () => {
    //     const rootNode = new RootNode();
    //     const blockNode = new BlockNode();
    //     blockNode.parent = rootNode;
    //     const inlinerNode = new InlinerNode();
    //     inlinerNode.parent = blockNode;
    //     const trace = await traceNode(inlinerNode);
    //     expect(trace).toBe(
    //         '<InlinerNode>\n    <BlockNode>\n        <RootNode>\n',
    //     );
    // });
});
