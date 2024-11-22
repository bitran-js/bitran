import {
    type StepFunction,
    Node,
    walk,
    walkDown,
    walkUp,
    next,
    previous,
    walkBackward,
    walkForward,
} from '../../src';

class TestNode extends Node {
    id: string;
    _children: TestNode[] = [];

    constructor(id: string, children: TestNode[] = []) {
        super();
        this.id = id;
        // Automatically set parent pointers for the children.
        this._children = children;
        for (const child of children) {
            child.parent = this;
        }
    }

    override get children(): TestNode[] {
        return this._children;
    }
}

//
//
//

describe('walkDown', () => {
    it('should traverse all children in a depth-first manner', async () => {
        // Build a tree:
        //          root
        //         /    \
        //  root.child1  root.child2
        //     /      \
        // root.child1.grandchild1  root.child1.grandchild2
        const grandchild1 = new TestNode('root.child1.grandchild1');
        const grandchild2 = new TestNode('root.child1.grandchild2');
        const child1 = new TestNode('root.child1', [grandchild1, grandchild2]);
        const child2 = new TestNode('root.child2');
        const root = new TestNode('root', [child1, child2]);

        const visited: string[] = [];
        const step: StepFunction = (node: Node) => {
            visited.push((node as TestNode).id);
        };

        await walkDown(root, step);

        expect(visited).toEqual([
            'root.child1',
            'root.child1.grandchild1',
            'root.child1.grandchild2',
            'root.child2',
        ]);
    });

    it('should stop traversal when the step returns false', async () => {
        // Build a tree where stopping happens at root.child1.
        const grandchild1 = new TestNode('root.child1.grandchild1');
        const child1 = new TestNode('root.child1', [grandchild1]);
        const child2 = new TestNode('root.child2');
        const root = new TestNode('root', [child1, child2]);

        const visited: string[] = [];
        const step: StepFunction = (node: Node) => {
            visited.push((node as TestNode).id);
            // Stop the walk when we hit 'root.child1'
            if ((node as TestNode).id === 'root.child1') {
                return false;
            }
        };

        const result = await walkDown(root, step);
        expect(result).toBe(false);
        // Since step returned false for 'root.child1', none of its children (or later siblings) are visited.
        expect(visited).toEqual(['root.child1']);
    });
});

describe('walkUp', () => {
    it('should traverse upward through the parent chain', async () => {
        // Build a chain: foo -> foo.bar -> foo.bar.baz.
        const root = new TestNode('foo');
        const child = new TestNode('foo.bar');
        child.parent = root;
        const leaf = new TestNode('foo.bar.baz');
        leaf.parent = child;

        const visited: string[] = [];
        const step: StepFunction = (node: Node) => {
            visited.push((node as TestNode).id);
        };

        await walkUp(leaf, step);
        // Expected order: first the immediate parent ('foo.bar'), then its parent ('foo')
        expect(visited).toEqual(['foo.bar', 'foo']);
    });

    it('should stop upward traversal when the step returns false', async () => {
        // Build a chain: foo -> foo.bar -> foo.bar.baz.
        const root = new TestNode('foo');
        const child = new TestNode('foo.bar');
        child.parent = root;
        const leaf = new TestNode('foo.bar.baz');
        leaf.parent = child;

        const visited: string[] = [];
        const step: StepFunction = (node: Node) => {
            visited.push((node as TestNode).id);
            // Stop traversal when we hit 'foo.bar'
            if ((node as TestNode).id === 'foo.bar') {
                return false;
            }
        };

        await walkUp(leaf, step);
        // Only 'foo.bar' is processed.
        expect(visited).toEqual(['foo.bar']);
    });
});

describe('walk', () => {
    it('should traverse a chain using a provided next function', async () => {
        // Create a simple chain of nodes:
        // node1 -> node2 -> node3
        const node1 = new TestNode('node1');
        const node2 = new TestNode('node2');
        const node3 = new TestNode('node3');

        // Use a Map to define the "next" pointers.
        const nextMap = new Map<Node, TestNode>([
            [node1, node2],
            [node2, node3],
        ]);

        const visited: string[] = [];
        const step: StepFunction = (node: Node) => {
            visited.push((node as TestNode).id);
        };

        // The next function looks up the next node in the chain.
        const next = (node: Node): TestNode | undefined => nextMap.get(node);

        // Note: walk() starts from node1 and immediately calls next(node1) → node2.
        await walk(node1, next, step);
        expect(visited).toEqual(['node2', 'node3']);
    });

    it('should stop chain traversal when the step returns false', async () => {
        // Create a chain: node1 -> node2 -> node3.
        const node1 = new TestNode('node1');
        const node2 = new TestNode('node2');
        const node3 = new TestNode('node3');

        const nextMap = new Map<Node, TestNode>([
            [node1, node2],
            [node2, node3],
        ]);

        const visited: string[] = [];
        const step: StepFunction = (node: Node) => {
            visited.push((node as TestNode).id);
            // Stop traversal when we hit node2.
            if ((node as TestNode).id === 'node2') {
                return false;
            }
        };

        const next = (node: Node): TestNode | undefined => nextMap.get(node);

        await walk(node1, next, step);
        // Expect that after node2, the walk stops (node3 is not visited).
        expect(visited).toEqual(['node2']);
    });
});

describe('', () => {
    let child1: TestNode;
    let child2: TestNode;
    let root: TestNode;

    beforeEach(() => {
        child1 = new TestNode('child1');
        child2 = new TestNode('child2');
        root = new TestNode('root', [child1, child2]);
    });

    describe('next', () => {
        it('should return the next sibling of a node', () => {
            expect((next(child1) as TestNode)?.id).toBe('child2');
            expect(next(child2)).toBeUndefined();
        });

        it('should return undefined if the node has no parent', () => {
            const node = new TestNode('node');
            expect(next(node)).toBeUndefined();
        });

        it('should return undefined if the parent has no children', () => {
            const parent = new TestNode('parent');
            const node = new TestNode('node');
            node.parent = parent;
            expect(next(node)).toBeUndefined();
        });
    });

    describe('previous', () => {
        it('should return the previous sibling of a node', () => {
            expect((previous(child2) as TestNode)?.id).toBe('child1');
            expect(previous(child1)).toBeUndefined();
        });

        it('should return undefined if the node has no parent', () => {
            const node = new TestNode('node');
            expect(previous(node)).toBeUndefined();
        });

        it('should return undefined if the parent has no children', () => {
            const parent = new TestNode('parent');
            const node = new TestNode('node');
            node.parent = parent;
            expect(previous(node)).toBeUndefined();
        });
    });
});

describe('', () => {
    let child1: TestNode;
    let child2: TestNode;
    let child3: TestNode;
    let root: TestNode;

    beforeEach(() => {
        child1 = new TestNode('child1');
        child2 = new TestNode('child2');
        child3 = new TestNode('child3');
        root = new TestNode('root', [child1, child2, child3]);
    });

    describe('walkForward', () => {
        it('should traverse nodes in a forward manner', async () => {
            const visited: string[] = [];
            const step: StepFunction = (node: Node) => {
                visited.push((node as TestNode).id);
            };

            await walkForward(child1, step);
            expect(visited).toEqual(['child2', 'child3']);
        });

        it('should stop traversal when the step returns false', async () => {
            const visited: string[] = [];
            const step: StepFunction = (node: Node) => {
                visited.push((node as TestNode).id);
                if ((node as TestNode).id === 'child2') {
                    return false;
                }
            };

            await walkForward(child1, step);
            expect(visited).toEqual(['child2']);
        });
    });

    describe('walkBackward', () => {
        it('should traverse nodes in a backward manner', async () => {
            const visited: string[] = [];
            const step: StepFunction = (node: Node) => {
                visited.push((node as TestNode).id);
            };

            await walkBackward(child3, step);
            expect(visited).toEqual(['child2', 'child1']);
        });

        it('should stop traversal when the step returns false', async () => {
            const visited: string[] = [];
            const step: StepFunction = (node: Node) => {
                visited.push((node as TestNode).id);
                if ((node as TestNode).id === 'child2') {
                    return false;
                }
            };

            await walkBackward(child3, step);
            expect(visited).toEqual(['child2']);
        });
    });
});
