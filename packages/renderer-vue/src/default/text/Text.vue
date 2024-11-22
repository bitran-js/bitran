<script lang="ts" setup>
import { Text, Fragment, h, type VNode } from 'vue';
import type { TextSchema } from '@bitran-js/core';

import type { ElementProps } from '../../front/element/props';
import { injectFormatText } from '../../front/bitranProps';

const { node } = defineProps<ElementProps<TextSchema>>();
const text = node.parseData;
const pretty = injectFormatText();

const SubNodes: VNode[] = [];
for (const textFragment of text.split(/\\$/gm)) {
    if (!textFragment) continue;

    SubNodes.push(h(Text, pretty(textFragment)));
    SubNodes.push(h('br'));
}

SubNodes.pop(); // Remove last <br>

const TextContent = h(Fragment, SubNodes);
</script>

<template>
    <component :is="TextContent" />
</template>
