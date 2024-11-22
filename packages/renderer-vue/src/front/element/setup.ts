import type { Component } from 'vue';
import {
    BlockErrorNode,
    InlinerErrorNode,
    type ElementNode,
} from '@bitran-js/core';

import { useElementRenderData } from './renderData';
import { useElementRenderer } from './renderer';

export interface ElementSetupResult {
    ElementComponent?: Component;
    error?: Error;
}

export async function setupAppElement(
    node: ElementNode,
): Promise<ElementSetupResult> {
    if (node instanceof BlockErrorNode || node instanceof InlinerErrorNode)
        return { error: node.error };

    const renderer = useElementRenderer(node);

    try {
        node.renderData = await useElementRenderData(node);
        return {
            ElementComponent: await renderer.component(),
        };
    } catch (_error) {
        return {
            error: _error instanceof Error ? _error : new Error(String(_error)),
        };
    }
}
