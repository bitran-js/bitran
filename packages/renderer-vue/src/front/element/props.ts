import type { ElementNode, GenericElementSchema } from '@bitran-js/core';

export interface ElementProps<
    T extends GenericElementSchema = GenericElementSchema,
> {
    node: ElementNode<T>;
}
