<script lang="ts" setup>
import {
    InlinersNode,
    TextNode,
    walkForward,
    type GroupNode,
} from '@bitran-js/core';

import Render from './Render.vue';
import { injectFormatText } from '../front/bitranProps';

const props = defineProps<{ node: GroupNode }>();

// Create proxy around all DOM group operations (swap, delete, move)
// When proxy is triggered, just make corresponding array operations without rerendering the whole array!

//
// Formatting text in Text nodes
//

const pretty = injectFormatText();

if (props.node instanceof InlinersNode && props.node.hasChildren()) {
    const formatState: object = {};
    for (const childNode of props.node.children!) {
        if (childNode instanceof TextNode) {
            childNode.parseData = pretty(childNode.parseData, formatState);
        }
    }
}
</script>

<template>
    <Render v-for="childNode of node.children ?? []" :node="childNode" />
</template>
