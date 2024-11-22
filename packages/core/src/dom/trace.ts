import { Node } from './node';
import { ElementNode } from './element';
import { RootNode } from './group';
import { walkUp } from './walk';

export async function traceNode(node: Node): Promise<string> {
    if (!node || !(node instanceof Node)) return '';

    const nodes: Node[] = [node];

    await walkUp(node, (currentNode) => {
        nodes.push(currentNode);
    });

    nodes.reverse();

    const stringifyNode = (node: Node) =>
        node instanceof ElementNode
            ? node.constructor.name
            : `<${node.constructor.name}>`;

    const rootNode = nodes.shift()!;

    const indent = 2;
    const traceLines: string[] = [];

    if (rootNode instanceof RootNode) {
        traceLines.push(stringifyNode(rootNode));
    } else {
        traceLines.push(
            `!NO_PARENT!`,
            `${' '.repeat(indent)}${stringifyNode(rootNode)}`,
        );
    }

    nodes.forEach((node, i) => {
        const currentIndent =
            rootNode instanceof RootNode ? indent * (i + 1) : indent * (i + 2);
        traceLines.push(`${' '.repeat(currentIndent)}${stringifyNode(node)}`);
    });

    return traceLines.join('\n').trim();
}
