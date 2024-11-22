import { paragraphName, textName } from '@bitran-js/core';

import { paragraphRenderer } from './paragraph/renderer';
import { textRenderer } from './text/renderer';
import type { ElementVueRenderers } from '../renderer';

export function getDefaultRenderers(): ElementVueRenderers {
    return {
        [paragraphName]: paragraphRenderer,
        [textName]: textRenderer,
    };
}
