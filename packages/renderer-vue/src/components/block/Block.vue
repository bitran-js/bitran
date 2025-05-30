<script lang="ts" setup>
import { onMounted, ref, useTemplateRef } from 'vue';
import { BlockErrorNode, type BlockNode } from '@bitran-js/core';

import { injectPrefixId } from '../../front/bitranProps';
import { setupAppElement } from '../../front/element/setup';
import { useElementRenderer } from '../../front/element/renderer';

import BlockFloat from './BlockFloat.vue';
import BlockAside from './BlockAside.vue';

const props = defineProps<{ node: BlockNode }>();
const renderer = useElementRenderer();
const blockElement = useTemplateRef('block');
const prefixId = ''; //injectPrefixId();

const hovered = ref(false);
//const dragTarget = ref(false);

const blockId = (() => {
    if (props.node instanceof BlockErrorNode) return undefined;
    return (prefixId ? prefixId + ':' : '') + props.node.id;
})();

const { ElementComponent, error } = await setupAppElement();

onMounted(() => {
    blockElement.value!.addEventListener('mouseenter', () => {
        hovered.value = true;
    });

    blockElement.value!.addEventListener('mouseleave', () => {
        hovered.value = false;
    });
});
</script>

<template>
    <div
        ref="block"
        :id="blockId"
        :class="{
            'bitran-blockContainer': true,
            'bitran-blockContainer--hover': hovered,
            'bitran-error': error,
        }"
    >
        <BlockFloat position="above" />

        <ElementComponent v-if="renderer.customLayout && !error" :node />
        <div v-else class="bitran-block">
            <BlockAside :node :hovered :error />
            <div class="bitran-blockMain">
                <div v-if="error">{{ error }}</div>
                <ElementComponent v-else :node :class="node.meta.classes" />
            </div>
        </div>

        <BlockFloat position="below" />
    </div>
</template>

<style lang="scss">
@use '../../scss/bp';

.bitran-blockContainer {
    position: relative;

    &:hover {
        z-index: 10;
    }

    .bitran-block {
        position: relative;
        padding-left: var(--_bitran_asideWidth);
    }

    //
    // Error
    //

    &.bitran-error {
        .bitran-blockAsideInner,
        .bitran-blockMain {
            background: color-mix(
                in srgb,
                var(--bitran_colorError),
                transparent 85%
            );
        }

        .bitran-blockMain {
            padding: 8px;
            color: var(--bitran_colorError);
            border-radius: 3px;
        }

        .bitran-blockAsideIcon {
            opacity: 1;
            color: var(--bitran_colorError);
        }

        @include bp.g-below('mobile') {
            .bitran-blockMain {
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
            }
        }
    }
}
</style>
