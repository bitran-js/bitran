<template>
    <Transition name="bitran-transition--fade">
        <slot></slot>
    </Transition>
</template>

<style lang="scss">
.bitran-transition--fade {
    &-enter-active,
    &-leave-active {
        transition: opacity var(--bitran_transitionSpeed)
            var(--bitran_transitionFunction);
    }

    &-enter-from,
    &-leave-to {
        opacity: 0 !important;
    }
}
</style>
