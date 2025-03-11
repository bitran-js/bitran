import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
    cacheDir: './.cache',
    resolve: {
        alias: {
            '@renderer': '../../packages/renderer-vue/dist/index',
        },
    },
    plugins: [vue()],
});
