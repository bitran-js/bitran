<script lang="ts" setup>
import type { ParagraphSchema } from '@bitran-js/core';

import type { ElementProps } from '../../front/element/props';
import Render from '../../components/Render.vue';

const { node } = defineProps<ElementProps<ParagraphSchema>>();
const inliners = node.parseData;
</script>

<template>
    <p class="bitran-paragraph">
        <Render :node="inliners" />
    </p>
</template>

<style lang="scss">
@use '../../public/scss/bp' as bitranBp;

.bitran-paragraph {
    margin: 0;
    text-align: justify;

    @include bitranBp.below('mobile') {
        text-align: left;
    }
}
</style>
