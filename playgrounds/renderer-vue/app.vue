<script lang="ts" setup>
import { Bitran } from '@renderer';

import Theme from './components/Theme.vue';
import { ref, watch } from 'vue';
import { defineBitranTranspiler } from '@bitran-js/transpiler';

const inputValue = ref('Sample Text!\n\nHello World!');
const biCode = ref(inputValue.value);
const editMode = ref(false);

const renderKey = ref(0);

let inputTimeout: any;

watch(inputValue, (newValue) => {
    clearTimeout(inputTimeout);
    inputTimeout = setTimeout(() => {
        biCode.value = newValue;
        renderKey.value++;
    }, 300);
});

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
                    :transpiler="defineBitranTranspiler({})"
                    :renderers="{}"
                    :content="{ biCode }"
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
