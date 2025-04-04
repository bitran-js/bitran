import type { ElementNode } from '@bitran-js/core';
import type { ElementTranspiler } from './transpiler';

export type PreRenderDataType = 'success' | 'error';

export interface PreRenderDataBase {
    type: PreRenderDataType;
}

export interface PreRenderDataSuccess extends PreRenderDataBase {
    type: 'success';
    data: any;
}

export interface PreRenderDataError extends PreRenderDataBase {
    type: 'error';
    message: string;
}

export type PreRenderData = PreRenderDataSuccess | PreRenderDataError;

export async function createPreRenderData(
    node: ElementNode,
    transpiler: ElementTranspiler,
    extra?: any,
): Promise<PreRenderData | undefined> {
    if (!transpiler?.createPreRenderData) return undefined;

    try {
        return {
            type: 'success',
            data: await transpiler.createPreRenderData(node, extra),
        };
    } catch (error) {
        return {
            type: 'error',
            message: String(error),
        };
    }
}
