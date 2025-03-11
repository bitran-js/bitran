import { defineAsyncComponent, type Component } from 'vue';

export function defineComponent(loader: () => Promise<{ default: Component }>) {
    return async () => defineAsyncComponent(loader);
}
