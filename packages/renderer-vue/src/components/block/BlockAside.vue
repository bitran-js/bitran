<script lang="ts" setup>
import type { BlockNode } from '@bitran-js/core';

import { getElementIcon } from '../../icon';
import { useElementRenderer } from '../../front/element/renderer';

import TransitionFade from '../transition/TransitionFade.vue';

defineProps<{
    node: BlockNode;
    hovered: boolean;
    error?: any;
}>();

const renderer = useElementRenderer();
const iconSvg = await getElementIcon(renderer);
</script>

<template>
    <div class="bitran-blockAside">
        <TransitionFade>
            <div
                v-if="hovered || error"
                class="bitran-blockAsideIcon"
                v-html="iconSvg"
            ></div>
        </TransitionFade>
    </div>
</template>

<style lang="scss">
@use '../../styles/utils' as bitranUtils;

.bitran-blockAside {
    flex-shrink: 0;
    width: var(--_bitran_asideBody);
    margin-right: var(--_bitran_asideGap);
    border-top-left-radius: 5px;
    border-bottom-left-radius: 5px;
    min-height: 30px;

    @include bitranUtils.transition(background);

    &:hover,
    &:active {
        background: var(--bitran_colorShade1);

        .bitran-blockAsideIcon {
            opacity: 1;
        }
    }

    .bitran-blockAsideIcon {
        position: sticky;
        top: 0;
        display: flex;
        justify-content: center;
        padding: 6px 0;
        color: var(--bitran_text);
        opacity: 0.375;

        @include bitranUtils.transition(opacity);

        svg {
            fill: currentColor;
            --_iconSize: 64%;
            width: var(--_iconSize);
            height: var(--_iconSize);
        }
    }
}
</style>
