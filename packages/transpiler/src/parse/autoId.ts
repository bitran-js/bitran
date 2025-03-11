import { ElementNode } from '@bitran-js/core';

import { hashString } from '../utils/hash';
import type { ParseFactory } from './parseFactory';

export abstract class AutoId {
    ids: Record<string, null> = {};

    abstract generate(elementNode: ElementNode, strNode: string): string;
    abstract finalize(id: string): string;

    exists(id: string) {
        return id in this.ids;
    }

    push(id: string) {
        if (id in this.ids) throw new Error(`Duplicate auto id "${id}"!`);
        this.ids[id] = null;
    }
}

export class HashAutoId extends AutoId {
    override generate(elementNode: ElementNode, strNode: string): string {
        return elementNode.name + ':' + hashString(strNode, 6);
    }

    override finalize(id: string): string {
        let finalId = id;
        while (this.exists(finalId)) finalId += '-'; // Keep adding '-' until we get a unique id
        return finalId;
    }
}

export async function createAutoId(
    autoId: AutoId,
    factory: ParseFactory | undefined,
    elementNode: ElementNode,
    strNode: string,
): Promise<string> {
    let id = autoId.generate(elementNode, strNode);

    if (factory) {
        id = await factory.alterAutoId(id, elementNode, strNode);
    }

    id = autoId.finalize(id);
    autoId.push(id);
    return id;
}
