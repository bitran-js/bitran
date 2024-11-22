import { BlockNode } from '@bitran-js/core';

import type { ElementVueRenderer } from './renderer';

export function defineIcon(loader: () => Promise<{ default: string }>) {
    return async () => (await loader()).default;
}

export async function getElementIcon(renderer: ElementVueRenderer) {
    if (renderer.icon) {
        return renderer.icon();
    }

    const iconLoader =
        renderer.Node.prototype instanceof BlockNode
            ? () => import('./assets/block.svg?raw')
            : () => import('./assets/inliner.svg?raw');

    return defineIcon(iconLoader)();
}
