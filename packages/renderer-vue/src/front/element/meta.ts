import type { GenericElementSchema } from '@bitran-js/core';
import { ensureElementComponent } from './ensureComponent';
import { useElementNode } from './node';

export function useElementMeta<
    T extends GenericElementSchema = GenericElementSchema,
>() {
    ensureElementComponent();
    const node = useElementNode<T>();
    return node.meta;
}
