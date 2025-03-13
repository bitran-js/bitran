import type { Component } from 'vue';
import { BlockErrorNode, InlinerErrorNode } from '@bitran-js/core';

import { useElementRenderer } from './renderer';
import { ensureElementComponent } from './ensureComponent';
import { useElementNode } from './node';
import { injectContent } from '../bitranProps';

export interface ElementSetupResult {
    ElementComponent?: Component;
    error?: Error;
}

export async function setupAppElement(): Promise<ElementSetupResult> {
    ensureElementComponent();

    const node = useElementNode();

    if (node instanceof BlockErrorNode || node instanceof InlinerErrorNode)
        return { error: node.error };

    const renderer = useElementRenderer();

    try {
        node.renderData = await getOrCreateRenderData();
        return {
            ElementComponent: await renderer.component(),
        };
    } catch (_error) {
        return {
            error: _error instanceof Error ? _error : new Error(String(_error)),
        };
    }
}

export async function getOrCreateRenderData() {
    const node = useElementNode();
    const content = injectContent();

    const preRenderData = content.preRenderData?.[node.autoId];
    if (preRenderData) {
        if (preRenderData.type === 'error')
            throw new Error(preRenderData.message);

        return preRenderData.data;
    }

    const renderer = useElementRenderer();
    const createRenderData = renderer.createRenderData;

    return (
        // @ts-ignore
        createRenderData ? createRenderData(node) : undefined
    );
}
