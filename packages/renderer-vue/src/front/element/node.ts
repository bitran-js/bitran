import { getCurrentInstance } from 'vue';
import type { ElementNode, GenericElementSchema } from '@bitran-js/core';

import { ensureElementComponent } from './ensureComponent';

export function useElementNode<
    T extends GenericElementSchema = GenericElementSchema,
>() {
    ensureElementComponent();
    return getCurrentInstance()!.props.node as ElementNode<T>;
}
