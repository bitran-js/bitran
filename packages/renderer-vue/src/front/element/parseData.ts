import type { GenericElementSchema } from '@bitran-js/core';

import { ensureElementComponent } from './ensureComponent';
import { useElementNode } from './node';

export function useElementParseData<T extends GenericElementSchema>() {
    ensureElementComponent();
    const node = useElementNode<T>();
    return node.parseData;
}
