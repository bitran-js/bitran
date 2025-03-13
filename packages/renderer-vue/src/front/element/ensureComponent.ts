import { getCurrentInstance } from 'vue';
import { ElementNode } from '@bitran-js/core';

export function ensureElementComponent() {
    const sfcInstance = getCurrentInstance();
    if (sfcInstance && sfcInstance.props?.node instanceof ElementNode) return;
    throw new Error(`Bitran element SFC context is not detected!`);
}
