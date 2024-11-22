<script lang="ts" setup>
import type { GroupNode } from '@bitran-js/core';

import Render from './Render.vue';

defineProps<{ node: GroupNode }>();

// Create proxy around all DOM group operations (swap, delete, move)
// When proxy is triggered, just make corresponding array operations without rerendering the whole array!
</script>

<template>
    <Render v-for="childNode of node.children ?? []" :node="childNode" />
</template>
