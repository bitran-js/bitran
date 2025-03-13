import { Node } from './node';
import { ElementNode } from './element';
import { RootNode } from './group';
import { walkDown, walkUp } from './walk';

function stringifyNode(node: Node) {
    return node instanceof ElementNode
        ? node.constructor.name
        : `<${node.constructor.name}>`;
}

export async function traceNodeUp(node: Node): Promise<string> {
    if (!node || !(node instanceof Node)) return '';

    const nodes: Node[] = [node];

    await walkUp(node, (currentNode) => {
        nodes.push(currentNode);
    });

    nodes.reverse();

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

export async function traceNodeDown(node: Node): Promise<string> {
    if (!node || !(node instanceof Node)) return '';

    const result: string[] = [stringifyNode(node)];
    const levels = new Map<Node, number>();
    levels.set(node, 0);

    await walkDown(node, (child) => {
        const parentLevel = levels.get(child.parent!) || 0;
        const childLevel = parentLevel + 1;
        levels.set(child, childLevel);

        const indent = ' '.repeat(childLevel * 2);
        result.push(`${indent}${stringifyNode(child)}`);
    });

    return result.join('\n');
}
