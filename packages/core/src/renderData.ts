import type { ElementNode } from './dom/element';
import type { GenericElementSchema } from './schema';

export interface RenderValueBase {
    type: 'success' | 'error';
}

export interface RenderValueSuccess extends RenderValueBase {
    type: 'success';
    data: any;
}

export interface RenderValueError extends RenderValueBase {
    type: 'error';
    message: string;
}

export type RenderValue = RenderValueSuccess | RenderValueError;

export type RenderDataStorage = Record<string, RenderValue>;

export interface RenderDataArgs<
    T extends GenericElementSchema = GenericElementSchema,
> {
    storage: RenderDataStorage;
    node: ElementNode<T>;
    extra?: any;
}

export type RenderDataGenerator<
    T extends GenericElementSchema = GenericElementSchema,
> = {
    createKey?: (
        args: RenderDataArgs<T>,
    ) => string | Promise<string> | undefined | Promise<undefined>;
    createValue?: (
        args: RenderDataArgs<T>,
    ) =>
        | T['RenderData']
        | Promise<T['RenderData']>
        | undefined
        | Promise<undefined>;
};

export async function createRenderData(
    args: RenderDataArgs & {
        generator?: RenderDataGenerator;
    },
) {
    const { storage, node, extra, generator } = args;

    if (!generator) {
        return undefined;
    }

    const { createKey, createValue } = generator;

    const key = createKey
        ? await createKey({ storage, node, extra })
        : undefined;

    if (key) {
        const storageValue = storage[key];

        if (storageValue) {
            return storageValue;
        }
    }

    if (!createValue) {
        if (key) {
            throw new Error(
                `Render data is already expected for node "${node.name}" but not found!`,
            );
        } else {
            return undefined;
        }
    }

    let newValue: RenderValue;

    try {
        const valueData = await createValue({ storage, node, extra });

        if (valueData === undefined) {
            return undefined;
        }

        newValue = {
            type: 'success',
            data: valueData,
        };
    } catch (error) {
        newValue = {
            type: 'error',
            message: String(error),
        };
    }

    if (key) {
        storage[key] = newValue;
    }

    return newValue;
}
