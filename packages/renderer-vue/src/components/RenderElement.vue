<script lang="ts" setup>
import { h, onMounted, ref, type Component } from 'vue';
import {
    BlockNode,
    ParagraphNode,
    TextNode,
    type ElementNode,
} from '@bitran-js/core';

import {
    injectEditMode,
    injectEnvironment,
    injectRenderWrapper,
} from '../front/bitranProps';
import { useElementRenderer } from '../front/element/renderer';

import Block from './block/Block.vue';
import BlockLoading from './block/BlockLoading.vue';
import Inliner from './inliner/Inliner.vue';
import InlinerLoading from './inliner/InlinerLoading.vue';

const props = defineProps<{ node: ElementNode }>();
const isBlock = props.node instanceof BlockNode;
const env = injectEnvironment();
const RenderWrapper = injectRenderWrapper();
const editMode = injectEditMode();
const elementRenderer = useElementRenderer();

const renderMode: 'hybrid' | 'client' = (() => {
    if (editMode.value) return 'client';

    if (props.node instanceof ParagraphNode || props.node instanceof TextNode) {
        return 'hybrid';
    } else {
        return elementRenderer.ssr ? 'hybrid' : 'client';
    }
})();

const createComponentWithNode = (component: Component) =>
    h(component, { node: props.node });

const ElementWrapper = createComponentWithNode(isBlock ? Block : Inliner);
const ElementLoading = createComponentWithNode(
    isBlock ? BlockLoading : InlinerLoading,
);

let canRender = true;
const canRenderFn = elementRenderer.canRender;
if (!editMode.value && canRenderFn) {
    canRender = await canRenderFn({
        isDev: env.isDev,
        isProd: env.isDev === undefined ? undefined : !env.isDev,
        isServer: env.isServer,
        isClient: env.isServer === undefined ? undefined : !env.isServer,
        node: props.node,
    });
}

const loadingVisible = ref(false);
onMounted(() => setTimeout(() => (loadingVisible.value = true), 500));
</script>

<template>
    <RenderWrapper v-if="canRender" :mode="renderMode">
        <ElementWrapper v-if="renderMode === 'hybrid'" />
        <Suspense v-else>
            <ElementWrapper />
            <template #fallback>
                <ElementLoading v-if="loadingVisible" />
                <component v-else :is="isBlock ? 'div' : 'span'" />
            </template>
        </Suspense>
    </RenderWrapper>
</template>
