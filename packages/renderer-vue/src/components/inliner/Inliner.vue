<script lang="ts" setup>
import { type InlinerNode } from '@bitran-js/core';

import { setupAppElement } from '../../front/element/setup';
import { useElementRenderer } from '../../front/element/renderer';
import { getElementIcon } from '../../icon';

defineProps<{ node: InlinerNode }>();

const { ElementComponent, error } = await setupAppElement();

const renderer = useElementRenderer();
const iconSvg = await getElementIcon(renderer);
</script>

<template>
    <span
        v-if="error"
        :class="{
            'bitran-inliner': true,
            'bitran-error': true,
        }"
    >
        <span class="bitran-inlinerErrorIcon" v-html="iconSvg"></span>
        <span>{{ error }}</span>
    </span>
    <ElementComponent v-else :node />
</template>

<style lang="scss">
.bitran-inliner.bitran-error {
    padding: 2px 8px;
    color: var(--bitran_colorError);
    border-radius: 3px;
    background: color-mix(in srgb, var(--bitran_colorError), transparent 85%);
    font-size: 0.85em;

    .bitran-inlinerErrorIcon {
        margin-right: 8px;
        svg {
            display: inline;
            fill: currentColor;
            width: 0.8em;
            height: 0.8em;
        }
    }
}
</style>
