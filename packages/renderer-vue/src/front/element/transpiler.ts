import type { GenericElementSchema, ElementNode } from '@bitran-js/core';
import type { ElementTranspiler } from '@bitran-js/transpiler';

import { injectBitranTranspiler } from '../bitranProps';

export function useElementTranspiler<T extends GenericElementSchema>(
    node: ElementNode<T>,
) {
    const elementName = node.name;
    const bitranTranspiler = injectBitranTranspiler();
    const elementTranspiler = bitranTranspiler.transpilers?.[elementName];

    if (!elementTranspiler)
        throw new Error(
            `Failed to find transpiler for element "${elementName}"!`,
        );

    return elementTranspiler as ElementTranspiler<T>;
}
