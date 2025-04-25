<script lang="ts" setup>
import { Text, Fragment, h, type VNode } from 'vue';
import type { TextSchema } from '@bitran-js/core';

import type { ElementProps } from '../../front/element/props';
import { injectFormatText } from '../../front/bitranProps';
import { useElementParseData } from '../../front/element/parseData';

defineProps<ElementProps<TextSchema>>();
const text = useElementParseData<TextSchema>();
const pretty = injectFormatText();

const SubNodes: VNode[] = [];

for (const textFragment of text.split(/\\$/gm)) {
    if (!textFragment) {
        SubNodes.push(h('br'));
        continue;
    }

    SubNodes.push(h(Text, pretty(textFragment)));
    SubNodes.push(h('br'));
}

SubNodes.pop(); // Remove last <br>

const TextContent = h(Fragment, SubNodes);
</script>

<template>
    <component :is="TextContent" />
</template>
