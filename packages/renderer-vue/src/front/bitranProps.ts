import { computed, inject, type Component, type InjectionKey } from 'vue';
import type { BitranTranspiler } from '@bitran-js/transpiler';

import type { BitranContent } from '../content';
import type { ElementVueRenderers } from '../renderer';
import { default as DefaultRenderWrapper } from '../components/RenderWrapper.vue';

export interface BitranProps {
    transpiler: BitranTranspiler;
    renderers: ElementVueRenderers;
    content: BitranContent;
    prefixId?: string;
    editMode?: boolean;
    formatText?: (text: string) => string;
    RenderWrapper?: Component<{ mode: 'hybrid' | 'client' }>;
}

//
//
//

export const bitranPropsKey = Symbol() as InjectionKey<BitranProps>;

export function injectBitranProps() {
    const props = inject(bitranPropsKey);

    if (!props) {
        throw new Error(
            'Failed to inject Bitran props! This function must be called only inside a Bitran component!',
        );
    }

    return props;
}

export function injectBitranTranspiler() {
    const props = injectBitranProps();
    return props.transpiler;
}

export function injectRenderers() {
    const props = injectBitranProps();
    return props.renderers;
}

export function injectContent() {
    const props = injectBitranProps();
    return props.content;
}

export function injectPrefixId() {
    const props = injectBitranProps();
    return props.prefixId;
}

export function injectEditMode() {
    const props = injectBitranProps();
    return computed(() => Boolean(props.editMode));
}

export function injectFormatText() {
    const props = injectBitranProps();
    return props.formatText ?? ((text: string) => text);
}

export function injectRenderWrapper() {
    const props = injectBitranProps();
    return props.RenderWrapper ?? DefaultRenderWrapper;
}
