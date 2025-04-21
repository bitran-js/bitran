<script lang="ts" setup>
import type { ParagraphSchema } from '@bitran-js/core';

import type { ElementProps } from '../../front/element/props';
import Render from '../../components/Render.vue';
import { useElementParseData } from '../../front/element/parseData';

defineProps<ElementProps<ParagraphSchema>>();
const parseData = useElementParseData<ParagraphSchema>();

const paragraphStyle = (() => {
    const style: Record<string, string> = {};

    if (parseData.alignment) {
        style['text-align'] = parseData.alignment;
    }

    if (parseData.font) {
        style['font-family'] =
            parseData.font === 'main'
                ? 'var(--bitran_fontMain)'
                : 'var(--bitran_fontAlt)';
    }

    return Object.keys(style).length === 0 ? undefined : style;
})();
</script>

<template>
    <p
        class="bitran-paragraph"
        v-bind="paragraphStyle ? { style: paragraphStyle } : {}"
    >
        <Render :node="parseData.content" />
    </p>
</template>

<style lang="scss">
@use '../../scss/bp' as bitranBp;

.bitran-paragraph {
    margin: 0;
    text-align: justify;

    @include bitranBp.below('mobile') {
        text-align: left;
    }
}
</style>
