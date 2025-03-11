<script lang="ts" setup>
import { provide } from 'vue';

import { bitranPropsKey, type BitranProps } from '../front/bitranProps';
import { domStateKey } from '../front/domState';

import Render from './Render.vue';

//
// TODO: Accept parsed DOM directly, not content!
// Then use DOM Patches system to make changes
//

const props = defineProps<BitranProps>();
provide(bitranPropsKey, props);

const root = await props.transpiler.parser.parse(props.content.biCode);
provide(domStateKey, {
    root,
});
</script>

<template>
    <section
        :class="{
            'bitran-component': true,
            'bitran-editMode': editMode,
        }"
    >
        <Render v-if="root" :node="root" />
    </section>
</template>

<style lang="scss">
@use '../public/scss/def';

//
// Variables to customize Bitran
//

.bitran-component {
    --bitran_gap: 30px;
    --bitran_gapSmall: 15px;
    --bitran_gapBig: 45px;
    --bitran_gapBlocks: var(--bitran_gap);

    --bitran_transitionSpeed: 200ms;
    --bitran_transitionFunction: ease-out;

    --bitran_text: light-dark(#333333, #c8c8c8);
    --bitran_textStrong: light-dark(#232323, #e1e1e1);
    --bitran_textMuted: light-dark(#696969, #7f7f7f);
    --bitran_textDimmed: light-dark(#969696, #616161);
    --bitran_textDisabled: light-dark(#b9b9b9, #4f4f4f);

    --bitran_colorShade1: light-dark(#e1e1e1, #383838);
    --bitran_colorBrand: light-dark(#118fe7, #3da1e7);
    --bitran_colorError: light-dark(#cf2f2f, #e95c5e);

    --bitran_fontMain: sans-serif;
    --bitran_fontAlt: serif;

    // Internal variables

    --_bitran_asideBody: #{def.$asideBody};
    --_bitran_asideGap: #{def.$asideGap};
    --_bitran_asideWidth: #{def.$asideWidth};
}

//
//
//

.bitran-component,
.bitran-component * {
    box-sizing: border-box;
}

.bitran-component {
    container: bitran / inline-size;
    font-family: var(--bitran_fontMain);
    color: var(--bitran_text);
}
</style>
