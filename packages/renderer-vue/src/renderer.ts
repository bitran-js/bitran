import type { Component } from 'vue';
import {
    type ClassOf,
    type ElementNode,
    type GenericElementSchema,
} from '@bitran-js/core';

import type { ElementPhrases, CustomPhrases } from './language';

type ElementVueRendererBase<
    T extends GenericElementSchema = GenericElementSchema,
    K extends CustomPhrases = {},
> = {
    Node: ClassOf<ElementNode<T>>;
    component: () => Promise<Component>;
    customLayout?: boolean;
    ssr?: boolean;
    icon?: () => Promise<string>;
    languages?: Record<string, () => Promise<ElementPhrases<K>>>;
    canRender?: (ctx: {
        isDev?: boolean;
        isProd?: boolean;
        isClient?: boolean;
        isServer?: boolean;
        node: ElementNode<T>;
    }) => Promise<boolean> | boolean;
};

export type ElementVueRenderer<
    T extends GenericElementSchema = GenericElementSchema,
    K extends CustomPhrases = {},
> = ElementVueRendererBase<T, K> &
    (T extends { RenderData: any }
        ? {
              createRenderData: (
                  node: ElementNode<T>,
              ) => Promise<T['RenderData']>;
          }
        : {});

export type ElementVueRenderers = Record<string, ElementVueRenderer>;

export function defineElementVueRenderer<T extends GenericElementSchema>(
    renderer: ElementVueRenderer<T>,
) {
    renderer.ssr =
        typeof renderer.ssr === 'undefined' ? true : Boolean(renderer.ssr);
    return renderer;
}
