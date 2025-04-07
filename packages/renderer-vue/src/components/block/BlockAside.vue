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
        <div class="bitran-blockAsideInner">
            <TransitionFade>
                <div
                    v-if="hovered || error"
                    class="bitran-blockAsideIcon"
                    v-html="iconSvg"
                ></div>
            </TransitionFade>
        </div>
    </div>
</template>

<style lang="scss">
@use '../../scss/utils' as bitranUtils;
@use '../../scss/bp';

.bitran-blockAside {
    position: absolute;
    left: 0;
    width: var(--_bitran_asideWidth);
    height: 100%;
    padding: 0 2px;

    &:hover,
    &:active {
        > .bitran-blockAsideInner {
            background: var(--bitran_colorShade1);

            .bitran-blockAsideIcon {
                opacity: 1;
            }
        }
    }

    .bitran-blockAsideInner {
        position: relative;
        width: 100%;
        height: 100%;
        border-radius: 3px;
        @include bitranUtils.transition(background);
    }

    @include bp.g-below('mobile') {
        padding: 0;
        .bitran-blockAsideInner {
            border-radius: 0;
        }
    }

    .bitran-blockAsideIcon {
        position: sticky;
        top: 0;
        width: 100%;
        text-align: center;
        color: var(--bitran_text);
        opacity: 0.375;
        @include bitranUtils.transition(opacity);

        svg {
            display: block;
            margin: 0 auto;
            padding: 3px 0;
            fill: currentColor;
            width: 64%;
        }
    }
}
</style>
