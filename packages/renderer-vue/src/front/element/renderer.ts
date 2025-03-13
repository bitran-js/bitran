import {
    type GenericElementSchema,
    paragraphName,
    textName,
} from '@bitran-js/core';

import type { ElementVueRenderer, ElementVueRenderers } from '../../renderer';
import { injectRenderers } from '../bitranProps';
import { textRenderer } from '../../default/text/renderer';
import { paragraphRenderer } from '../../default/paragraph/renderer';
import { ensureElementComponent } from './ensureComponent';
import { useElementNode } from './node';

export function useElementRenderer<T extends GenericElementSchema>() {
    ensureElementComponent();

    const node = useElementNode<T>();
    const elementName = node.name;

    const renderers = {
        ...injectRenderers(),
        [paragraphName]: paragraphRenderer,
        [textName]: textRenderer,
    } as ElementVueRenderers;

    const elementRenderer = renderers[elementName];

    if (!elementRenderer)
        throw new Error(
            `Failed to find renderer for element "${elementName}"!`,
        );

    return elementRenderer as ElementVueRenderer<T>;
}
