import type { ElementNode } from '@bitran-js/core';

export interface StringifyOptions {
    step?: (elementNode: ElementNode, strNode: string) => void | Promise<void>;
}

export function resolveStringifyOptions(
    options?: Partial<StringifyOptions>,
): StringifyOptions {
    return {
        step: options?.step,
    };
}
