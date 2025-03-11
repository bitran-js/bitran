import type { ElementNode } from '@bitran-js/core';

import { HashAutoId, type AutoId } from './autoId';

export interface ParseOptions {
    autoId: AutoId;
    step?: (elementNode: ElementNode, strNode: string) => void | Promise<void>;
}

export function resolveParseOptions(
    options?: Partial<ParseOptions>,
): ParseOptions {
    return {
        autoId: options?.autoId || new HashAutoId(),
        step: options?.step,
    };
}
