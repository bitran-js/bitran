import { Node, GroupNode, detachNode } from '../../src';

class TestNode extends Node {
    name: string;

    constructor(name: string, parent?: Node) {
        super();
        this.name = name;
        this.parent = parent;
    }

    override toString() {
        return `N: ${this.name}${this.parent ? ` ${this.parent}` : ''}`;
    }
}

class TestGroupNode extends GroupNode {
    name: string;

    constructor(name: string) {
        super(undefined);
        this.name = name;
    }

    override toString() {
        return `G: ${this.name}`;
    }
}

function expectDetached(...nodes: Node[]) {
    nodes.forEach((node) => {
        expect(node.parent).toBeUndefined();
    });
}

function getChildrenStrings(group: TestGroupNode): string[] {
    return group.children?.map((child) => child.toString()) ?? [];
}

function expectChildren(group: TestGroupNode, children: TestNode[]) {
    expect(getChildrenStrings(group)).toEqual(
        children.map((child) => child.toString()),
    );
}

//
//
//

describe('hasChildren', () => {
    it('should return false when there are no children', () => {
        const group = new TestGroupNode('group1');
        expect(group.hasChildren()).toBe(false);
    });

    it('should return true when children exist', () => {
        const group = new TestGroupNode('group1');
        const child = new TestNode('child1', group);
        group._children = [child];
        expect(group.hasChildren()).toBe(true);
    });
});

describe('isEmpty', () => {
    it('should return true when there are no children', () => {
        const group = new TestGroupNode('group1');
        expect(group.isEmpty()).toBe(true);
    });

    it('should return false when there are children', () => {
        const group = new TestGroupNode('group1');
        const child = new TestNode('child1', group);
        group._children = [child];
        expect(group.isEmpty()).toBe(false);
    });
});

describe('detachNode', () => {
    it('should detach a node from its parent', () => {
        const group = new TestGroupNode('parent1');
        const child1 = new TestNode('child1', group);
        const child2 = new TestNode('child2', group);
        group._children = [child1, child2];
        child1.parent = group;
        detachNode(child1);
        expectDetached(child1);
        expectChildren(group, [child2]);
        expect(child2.parent).toBe(group);
    });

    it('should do nothing if the node has no parent', () => {
        const child = new TestNode('child1');
        expect(() => detachNode(child)).not.toThrow();
        expect(child.parent).toBeUndefined();
    });
});

//
// Low level operations
//

describe('__indexOf', () => {
    it('should return -1 when the node is not found', () => {
        const group = new TestGroupNode('group1');
        const child = new TestNode('child1');
        expect(group.__indexOf(child)).toBe(-1);
    });

    it('should return the correct index when the node is present', () => {
        const group = new TestGroupNode('group1');
        const child1 = new TestNode('child1', group);
        const child2 = new TestNode('child2', group);
        group._children = [child1, child2];
        expect(group.__indexOf(child2)).toBe(1);
    });
});

describe('__detachAt', () => {
    it('should remove the node at the given index', () => {
        const group = new TestGroupNode('group1');
        const child1 = new TestNode('child1', group);
        const child2 = new TestNode('child2', group);
        const child3 = new TestNode('child3', group);
        group._children = [child1, child2, child3];
        group.__detachAt(1);
        expectChildren(group, [child1, child3]);
    });

    it('should not throw if there are no children', () => {
        const group = new TestGroupNode('group1');
        expect(() => group.__detachAt(0)).not.toThrow();
    });
});

describe('__insertAt', () => {
    it('should insert nodes in empty group', () => {
        const group = new TestGroupNode('group1');
        const child1 = new TestNode('child1');
        const child2 = new TestNode('child2');
        group.__insertAt(100, child1, child2);
        expectChildren(group, [child1, child2]);
    });

    it('should not insert nodes if none are provided', () => {
        const group = new TestGroupNode('group1');
        group.__insertAt(0);
        expect(group.children).toBeUndefined();
    });

    it('should insert nodes at the given index', () => {
        const group = new TestGroupNode('group1');
        const child1 = new TestNode('child1', group);
        const child2 = new TestNode('child2', group);
        const child3 = new TestNode('child3', group);
        group._children = [child1, child3];
        group.__insertAt(1, child2);
        expectChildren(group, [child1, child2, child3]);
    });

    it('should detach inserted nodes from their previous parent', () => {
        const parent1 = new TestGroupNode('parent1');
        const parent2 = new TestGroupNode('parent2');
        // Attach child to parent1.
        const child1 = new TestNode('child1', parent1);
        parent1._children = [child1];

        // Insert child into parent2.
        parent2.__insertAt(0, child1);
        expect(child1.parent).toBe(parent2);
        expectChildren(parent2, [child1]);
        // Also check that child was removed from parent1.
        expect(parent1.children).toEqual([]);
    });
});

describe('__swap', () => {
    it('should swap two nodes when both indices are valid', () => {
        const group = new TestGroupNode('group1');
        const child1 = new TestNode('child1', group);
        const child2 = new TestNode('child2', group);
        const child3 = new TestNode('child3', group);
        group._children = [child1, child2, child3];
        group.__swap(0, 2);
        expectChildren(group, [child3, child2, child1]);
    });

    it('should not swap if any index is out of bounds', () => {
        const group = new TestGroupNode('group1');
        const child1 = new TestNode('child1', group);
        const child2 = new TestNode('child2', group);
        group._children = [child1, child2];
        group.__swap(0, 5); // invalid index
        expectChildren(group, [child1, child2]);
    });
});

describe('__move', () => {
    it('should move a node from one index to another', () => {
        const group = new TestGroupNode('group1');
        const child1 = new TestNode('child1', group);
        const child2 = new TestNode('child2', group);
        const child3 = new TestNode('child3', group);
        group._children = [child1, child2, child3];
        group.__move(0, 2);
        expectChildren(group, [child2, child3, child1]);
    });

    it('should do nothing if the indexFrom is out of bounds', () => {
        const group = new TestGroupNode('group1');
        const child1 = new TestNode('child1', group);
        group._children = [child1];
        expect(() => group.__move(5, 0)).not.toThrow();
        expectChildren(group, [child1]);
    });
});

//
// Operations
//

describe('clear', () => {
    it('should remove all children', () => {
        const group = new TestGroupNode('group1');
        const child1 = new TestNode('child1', group);
        const child2 = new TestNode('child2', group);
        group._children = [child1, child2];
        group.clear();
        expectDetached(child1, child2);
        expect(group.children).toBeUndefined();
    });
});

describe('setNodes', () => {
    let group: TestGroupNode;
    let child1: TestNode;
    let child2: TestNode;

    beforeEach(() => {
        group = new TestGroupNode('group1');
        child1 = new TestNode('child1');
        child2 = new TestNode('child2');
    });

    it('should set the nodes from an array', () => {
        group.setNodes([child1, child2]);
        expectChildren(group, [child1, child2]);
        expect(child1.parent).toBe(group);
        expect(child2.parent).toBe(group);
    });

    it('should set the nodes from multiple arguments', () => {
        group.setNodes(child1, child2);
        expectChildren(group, [child1, child2]);
        expect(child1.parent).toBe(group);
        expect(child2.parent).toBe(group);
    });

    it('should be undefined if no nodes provided', () => {
        group.setNodes();
        expect(group.children).toBeUndefined();
    });
});

describe('', () => {
    let child1: TestNode;
    let child2: TestNode;
    let child3: TestNode;
    let group: TestGroupNode;

    beforeEach(() => {
        child1 = new TestNode('child1');
        child2 = new TestNode('child2');
        child3 = new TestNode('child3');
        group = new TestGroupNode('group1');
        group.setNodes(child1, child2, child3);
    });

    describe('swap', () => {
        it('should swap "child1" and "child3"', () => {
            group.swap(child1, child3);
            expectChildren(group, [child3, child2, child1]);
            group.swap(child2, child1);
            expectChildren(group, [child3, child1, child2]);
        });
    });

    describe('moveAfter', () => {
        it('should move "child1" after "child3"', () => {
            group.moveAfter(child1, child3);
            expectChildren(group, [child2, child3, child1]);
        });

        it('should not change "child3" being after "child2"', () => {
            group.moveAfter(child3, child2);
            expectChildren(group, [child1, child2, child3]);
        });
    });

    describe('moveBefore', () => {
        it('should move "child3" before "child1"', () => {
            group.moveBefore(child3, child1);
            expectChildren(group, [child3, child1, child2]);
        });

        it('should not change "child1" being before "child2"', () => {
            group.moveBefore(child1, child2);
            expectChildren(group, [child1, child2, child3]);
        });
    });

    describe('before', () => {
        it('should keep group children order when moving children', () => {
            group.before(child3, child1, child2);
            expectChildren(group, [child1, child2, child3]);
        });
    });

    describe('after', () => {
        it('should keep group children order when moving children', () => {
            group.after(child1, child2, child3);
            expectChildren(group, [child1, child2, child3]);
        });
    });
});

describe('prepend', () => {
    it('should add "child1" and "child2" to the beginning', () => {
        const group = new TestGroupNode('group1');
        const child1 = new TestNode('child1');
        const child2 = new TestNode('child2');
        const child3 = new TestNode('child3');
        group.setNodes(child3);
        group.prepend(child1, child2);
        expectChildren(group, [child1, child2, child3]);
    });
});

describe('append', () => {
    it('should add "child2" and "child3" to the end', () => {
        const group = new TestGroupNode('group1');
        const child1 = new TestNode('child1');
        const child2 = new TestNode('child2');
        const child3 = new TestNode('child3');
        group.setNodes(child1);
        group.append(child2, child3);
        expectChildren(group, [child1, child2, child3]);
    });
});

describe('before', () => {
    it('should insert "child2" before "child3"', () => {
        const group = new TestGroupNode('group1');
        const child1 = new TestNode('child1');
        const child2 = new TestNode('child2');
        const child3 = new TestNode('child3');
        group.setNodes(child1, child3);
        group.before(child3, child2);
        expectChildren(group, [child1, child2, child3]);
    });
});

describe('after', () => {
    it('should insert "child2" after "child1"', () => {
        const group = new TestGroupNode('group1');
        const child1 = new TestNode('child1');
        const child2 = new TestNode('child2');
        const child3 = new TestNode('child3');
        group.setNodes(child1, child3);
        group.after(child1, child2);
        expectChildren(group, [child1, child2, child3]);
    });
});

describe('replace', () => {
    it('should replace "child1" with "child2" and "child3"', () => {
        const group = new TestGroupNode('group1');
        const child1 = new TestNode('child1');
        const child2 = new TestNode('child2');
        const child3 = new TestNode('child3');
        group.setNodes(child1);
        group.replace(child1, child2, child3);
        expectChildren(group, [child2, child3]);
        expectDetached(child1);
    });
});
