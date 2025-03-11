import type { Node } from './node';

export type StepFunction = (
    node: Node,
) => (void | false) | Promise<void | false>;

export async function walk(
    from: Node,
    next: (current: Node) => Node | undefined,
    step: StepFunction,
) {
    let current: Node | undefined = from;
    while ((current = next(current))) {
        const stepResult = await step(current);
        if (stepResult === false) return;
    }
}

export async function walkDown(
    from: Node,
    step: StepFunction,
): Promise<void | false> {
    for (const child of from.children || []) {
        if (
            (await step(child)) === false ||
            (await walkDown(child, step)) === false
        ) {
            return false;
        }
    }
}

export async function walkUp(from: Node, step: StepFunction) {
    await walk(from, (node) => node.parent, step);
}

export function next(from: Node): Node | undefined {
    const parentChildren = from.parent?.children;
    if (!parentChildren) return undefined;

    const fromIndex = parentChildren.indexOf(from);
    return parentChildren[fromIndex + 1];
}

export function previous(from: Node): Node | undefined {
    const parentChildren = from.parent?.children;
    if (!parentChildren) return undefined;

    const fromIndex = parentChildren.indexOf(from);
    return parentChildren[fromIndex - 1];
}

export async function walkForward(
    from: Node,
    step: StepFunction,
): Promise<void> {
    await walk(from, next, step);
}

export async function walkBackward(
    from: Node,
    step: StepFunction,
): Promise<void> {
    await walk(from, previous, step);
}
