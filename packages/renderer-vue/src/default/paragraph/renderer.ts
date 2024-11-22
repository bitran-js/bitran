import { ParagraphNode, type ParagraphSchema } from '@bitran-js/core';

import { defineElementVueRenderer } from '../../renderer';
import { defineComponent } from '../../component';
import { defineIcon } from '../../icon';
import { defineLanguages } from '../../language';

export const paragraphRenderer = defineElementVueRenderer<ParagraphSchema>({
    Node: ParagraphNode,
    component: defineComponent(() => import('./Paragraph.vue')),
    languages: defineLanguages({
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    }),
    icon: defineIcon(() => import('./icon.svg?raw')),
});
