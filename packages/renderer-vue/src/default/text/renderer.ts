import { TextNode, type TextSchema } from '@bitran-js/core';

import { defineElementVueRenderer } from '../../renderer';
import { defineComponent } from '../../component';
import { defineLanguages } from '../../language';
import { defineIcon } from '../../icon';

export const textRenderer = defineElementVueRenderer<TextSchema>({
    Node: TextNode,
    component: defineComponent(() => import('./Text.vue')),
    languages: defineLanguages({
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    }),
    icon: defineIcon(() => import('./icon.svg?raw')),
});
