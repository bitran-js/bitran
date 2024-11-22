<script setup>
import { ref, onMounted } from 'vue';

const currentTheme = ref('light');

const toggleTheme = () => {
    currentTheme.value = currentTheme.value === 'light' ? 'dark' : 'light';
    localStorage.setItem('theme', currentTheme.value);
    document.documentElement.setAttribute('data-theme', currentTheme.value);
};

onMounted(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme) {
        currentTheme.value = savedTheme;
        document.documentElement.setAttribute('data-theme', currentTheme.value);
    }
});
</script>

<template>
    <button @click="toggleTheme">Theme</button>
</template>

<style lang="scss">
html {
    &[data-theme='light'] {
        color-scheme: light;
    }

    &[data-theme='dark'] {
        color-scheme: dark;
    }
}
</style>
