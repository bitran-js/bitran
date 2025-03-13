<script lang="ts" setup>
import { ref, shallowRef, watch } from 'vue';
import { RootNode } from '@bitran-js/core';
import { defineBitranTranspiler } from '@bitran-js/transpiler';
import { Bitran } from '@bitran-js/renderer-vue';

import Theme from './components/Theme.vue';

const inputValue = ref('Sample Text!\n\nHello World!');
const biCode = ref(inputValue.value);
const root = shallowRef<RootNode>(new RootNode());
const editMode = ref(false);
const renderKey = ref(0);

const transpiler = defineBitranTranspiler({});
const renderers = {};

let inputTimeout: any;

watch(
    inputValue,
    (newValue) => {
        clearTimeout(inputTimeout);
        inputTimeout = setTimeout(async () => {
            biCode.value = newValue;
            root.value = await transpiler.parser.parse(newValue);
            renderKey.value++;
        }, 300);
    },
    { immediate: true },
);

watch(editMode, () => {
    renderKey.value++;
});
</script>

<template>
    <Suspense>
        <div class="content-area">
            <header>
                <div>
                    <Theme />
                    <input type="checkbox" v-model="editMode" /> Edit Mode
                </div>
                <textarea v-model="inputValue"></textarea>
            </header>
            <main>
                <Bitran
                    :transpiler
                    :renderers
                    :content="{ root }"
                    :key="renderKey"
                    :editMode
                />
            </main>
        </div>
    </Suspense>
</template>

<style lang="scss">
html,
body {
    margin: 0;
    padding: 0;
    background: light-dark(#eaeaea, #212121);
}

.content-area {
    width: min(900px, 100%);
    min-height: 100dvh;
    margin: 0 auto;
    background: light-dark(white, #282828);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

header {
    padding: 10px;
    background: light-dark(rgb(243, 243, 243), #313131);
    border-bottom: 1px solid light-dark(#ebebeb, #444);
    display: flex;
    flex-direction: column;
    gap: 10px;

    textarea {
        height: 150px;
        resize: vertical;
    }
}
</style>
