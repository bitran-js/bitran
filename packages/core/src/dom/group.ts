import { Node } from './node';

export abstract class GroupNode extends Node {
    _children?: Node[];
    override get children() {
        return this._children;
    }

    constructor(parent: Node | undefined) {
        super();
        this.parent = parent;
    }

    hasChildren() {
        return !!this.children?.length;
    }

    isEmpty() {
        return !this.hasChildren();
    }

    //
    // Low level operations
    //

    __indexOf(node: Node) {
        return this._children?.indexOf(node) ?? -1;
    }

    __detachAt(index: number) {
        this._children?.splice(index, 1);
    }

    __insertAt(index: number, ...nodes: Node[]) {
        for (const node of nodes) {
            this._children ||= [];
            const toDeleteIndex = this.__indexOf(node);
            if (toDeleteIndex !== -1 && toDeleteIndex < index) index--;
            detachNode(node);
            node.parent = this;
            this._children.splice(index, 0, node);
            index++;
        }
    }

    __swap(indexA: number, indexB: number) {
        if (!this._children) return;

        if (
            indexA < 0 ||
            indexA >= this._children.length ||
            indexB < 0 ||
            indexB >= this._children.length
        ) {
            return;
        }

        [this._children[indexA], this._children[indexB]] = [
            this._children[indexB]!,
            this._children[indexA]!,
        ];
    }

    __move(indexFrom: number, indexTo: number) {
        const movingNode = this._children?.[indexFrom];
        if (!movingNode) return;

        this._children?.splice(indexFrom, 1);
        this._children?.splice(indexTo, 0, movingNode);
    }

    //
    // Operations
    //

    clear() {
        const children = [...(this._children ?? [])];
        for (const child of children) detachNode(child);
        this._children = undefined;
    }

    setNodes(...nodes: Node[]): void;
    setNodes(nodes: Node[]): void;
    setNodes(firstArg: Node[] | Node, ...rest: Node[]): void {
        this.clear();
        if (!firstArg) return;

        const nodes: Node[] = Array.isArray(firstArg)
            ? firstArg
            : [firstArg, ...rest];

        this.__insertAt(0, ...nodes);
    }

    swap(nodeA: Node, nodeB: Node) {
        this.__swap(this.__indexOf(nodeA), this.__indexOf(nodeB));
    }

    prepend(...nodes: Node[]) {
        this.__insertAt(0, ...nodes);
    }

    append(...nodes: Node[]) {
        this.__insertAt(this._children?.length ?? 0, ...nodes);
    }

    before(node: Node, ...nodes: Node[]) {
        const index = this.__indexOf(node);
        if (index === -1) return;

        this.__insertAt(index, ...nodes);
    }

    after(node: Node, ...nodes: Node[]) {
        const index = this.__indexOf(node);
        if (index === -1) return;

        this.__insertAt(index + 1, ...nodes);
    }

    replace(node: Node, ...withNodes: Node[]) {
        const index = this.__indexOf(node);
        if (index === -1) return;

        detachNode(node);
        this.__insertAt(index, ...withNodes);
    }

    moveBefore(node: Node, before: Node) {
        let movingIndex = this.__indexOf(node);
        let beforeIndex = this.__indexOf(before);
        if (
            movingIndex === -1 ||
            beforeIndex === -1 ||
            movingIndex === beforeIndex - 1
        )
            return;
        this.__move(movingIndex, beforeIndex);
    }

    moveAfter(node: Node, after: Node) {
        let movingIndex = this.__indexOf(node);
        let afterIndex = this.__indexOf(after);
        if (movingIndex === -1 || afterIndex === -1) return;
        this.__move(movingIndex, afterIndex + 1);
    }
}

export function detachNode(node: Node) {
    const parent = node.parent;

    if (parent instanceof GroupNode) {
        const index = parent.__indexOf(node);
        if (index !== -1) parent.__detachAt(index);
    }

    node.parent = undefined;
}

export class BlocksNode extends GroupNode {}
export class InlinersNode extends GroupNode {}

export class RootNode extends BlocksNode {
    constructor() {
        super(undefined);
    }
}
