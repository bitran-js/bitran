import type {
    ClassOf,
    ElementNode,
    GenericElementSchema,
    Node,
} from '@bitran-js/core';

import type { Stringifier } from './stringifier';
import type { StringifyOptions } from './stringifyOptions';
import { toStrObjectBlock } from '../utils/str';

export abstract class StringifyFactory<
    T extends GenericElementSchema = GenericElementSchema,
> {
    stringifier!: Stringifier;
    stringifyOptions!: StringifyOptions;
    elementNode!: ElementNode<T>;

    abstract stringifyElement(): Promise<string>;

    async stringify(node: Node) {
        return this.stringifier.stringify(node, this.stringifyOptions);
    }

    payload() {
        return {
            node: this.elementNode,
            parseData: this.elementNode.parseData,
            meta: this.elementNode.meta,
        } as const;
    }
}

export abstract class ObjStringifyFactory<
    T extends GenericElementSchema = GenericElementSchema,
> extends StringifyFactory<T> {
    abstract objName: string;

    abstract createStrData(): Promise<any>;

    async stringifyElement() {
        const strData = await this.createStrData();
        return toStrObjectBlock(this.objName, strData);
    }
}

export type ElementStringifyFactoryClass<
    T extends GenericElementSchema = GenericElementSchema,
> = ClassOf<StringifyFactory<T>>;
