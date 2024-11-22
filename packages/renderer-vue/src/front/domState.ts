import { inject, type InjectionKey } from 'vue';

import type { RootNode } from '@bitran-js/core';

export interface DomState {
    root: RootNode;
}

export const domStateKey = Symbol() as InjectionKey<DomState>;

export function injectDomState() {
    const state = inject(domStateKey);

    if (!state) {
        throw new Error(
            'Failed to inject DOM state! This function must be called only inside a Bitran component!',
        );
    }

    return state;
}
