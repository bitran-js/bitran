<script lang="ts" setup>
import { Text, Fragment, h, type VNode } from 'vue';
import type { TextSchema } from '@bitran-js/core';

import type { ElementProps } from '../../front/element/props';
import { useElementParseData } from '../../front/element/parseData';

defineProps<ElementProps<TextSchema>>();
const text = useElementParseData<TextSchema>();

const SubNodes: VNode[] = [];

for (const textFragment of text.split(/\\$/gm)) {
    if (!textFragment) {
        SubNodes.push(h('br'));
        continue;
    }

    SubNodes.push(h(Text, textFragment));
    SubNodes.push(h('br'));
}

SubNodes.pop(); // Remove last <br>

const TextContent = h(Fragment, SubNodes);
</script>

<template>
    <component :is="TextContent" />
</template>
