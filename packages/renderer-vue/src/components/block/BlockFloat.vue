<script lang="ts" setup>
defineProps<{ position: 'above' | 'below' }>();
</script>

<template>
    <div
        :class="{
            'bitran-blockFloat': true,
            [`bitran-blockFloat--${position}`]: true,
        }"
    ></div>
</template>

<style lang="scss">
.bitran-blockFloat {
    --_floatHeight: var(--bitran_gapBlocks);

    width: 100%;
    height: var(--_floatHeight);

    //background: green;
    opacity: 0.75;

    // Default behaviour: next block's above float is hidden
    .bitran-blockContainer + .bitran-blockContainer > &--above {
        display: none;
    }

    // Hover behaviour: show current block's both floats and hide adjacent blocks floats
    .bitran-blockContainer:hover + .bitran-blockContainer > &--above,
    .bitran-blockContainer:has(+ .bitran-blockContainer:hover) > &--below {
        display: none;
    }

    .bitran-blockContainer:hover > & {
        //background: pink;
        display: block;
    }

    // Hide edge floats when not in edit mode
    .bitran-component:not(.bitran-editMode)
        .bitran-blockContainer:first-child
        > &--above,
    .bitran-component:not(.bitran-editMode)
        .bitran-blockContainer:last-child
        > &--below {
        display: none;
    }
}
</style>
