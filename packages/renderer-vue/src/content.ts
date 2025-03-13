import type { RootNode } from '@bitran-js/core';
import type { PreRenderData } from '@bitran-js/transpiler';

export interface BitranContent {
    root: RootNode;
    preRenderData?: Record<string, PreRenderData>;
}
