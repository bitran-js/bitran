import type { GenericElementSchema } from '@bitran-js/core';
import type { ElementTranspiler } from '@bitran-js/transpiler';

import { injectBitranTranspiler } from '../bitranProps';
import { ensureElementComponent } from './ensureComponent';
import { useElementNode } from './node';

export function useElementTranspiler<T extends GenericElementSchema>() {
    ensureElementComponent();
    const node = useElementNode<T>();

    const elementName = node.name;
    const bitranTranspiler = injectBitranTranspiler();
    const elementTranspiler = bitranTranspiler.transpilers?.[elementName];

    if (!elementTranspiler)
        throw new Error(
            `Failed to find transpiler for element "${elementName}"!`,
        );

    return elementTranspiler as ElementTranspiler<T>;
}
