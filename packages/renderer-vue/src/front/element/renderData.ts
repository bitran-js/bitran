import type { ElementNode } from '@bitran-js/core';

import { injectContent } from '../bitranProps';
import { useElementRenderer } from './renderer';

export async function useElementRenderData(node: ElementNode) {
    const content = injectContent();

    const preRenderData = content.preRenderData?.[node.autoId];
    if (preRenderData) {
        if (preRenderData.type === 'error')
            throw new Error(preRenderData.message);

        return preRenderData.data;
    }

    const renderer = useElementRenderer(node);
    const createRenderData = renderer.createRenderData;

    // @ts-ignore
    return createRenderData ? createRenderData(node) : undefined;
}
