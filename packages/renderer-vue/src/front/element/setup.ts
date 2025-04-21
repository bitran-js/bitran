import type { Component } from 'vue';
import {
    BlockErrorNode,
    createRenderData,
    InlinerErrorNode,
} from '@bitran-js/core';

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
    const renderer = useElementRenderer();
    const generator = renderer.renderDataGenerator;

    const renderData = await createRenderData({
        node,
        storage: content.renderDataStorage,
        generator,
    });

    if (!renderData) {
        return undefined;
    }

    if (renderData.type === 'error') {
        throw new Error(renderData.message);
    }

    return renderData.data;
}
