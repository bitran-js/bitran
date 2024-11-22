import type { PreRenderData } from '@bitran-js/transpiler';

export interface BitranContent {
    biCode: string;
    preRenderData?: Record<string, PreRenderData>;
}
