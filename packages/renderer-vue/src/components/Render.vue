<script lang="ts" setup>
import type { Component } from 'vue';
import { ElementNode, GroupNode, type Node } from '@bitran-js/core';

import RenderGroup from './RenderGroup.vue';
import RenderElement from './RenderElement.vue';

const props = defineProps<{ node: Node }>();

const RenderComponent: Component<{ node: Node }> = (() => {
    switch (true) {
        case props.node instanceof GroupNode:
            return RenderGroup;
        case props.node instanceof ElementNode:
            return RenderElement;
        default:
            throw new Error(
                `Unsupported node "${props.node.constructor.name}"!`,
            );
    }
})();
</script>

<template>
    <RenderComponent :node />
</template>
