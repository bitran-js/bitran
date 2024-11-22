import type {
    ClassOf,
    ElementNode,
    GenericElementSchema,
    Node,
} from '@bitran-js/core';

import type { Stringifier } from './stringifier';
import type { StringifyOptions } from './stringifyOptions';
import type { RawObject } from '../utils/RawObject';
import { objToText } from '../utils/str';

export abstract class StringifyFactory<
    T extends GenericElementSchema = GenericElementSchema,
> {
    stringifier!: Stringifier;
    stringifyOptions!: StringifyOptions;
    elementNode!: ElementNode<T>;

    abstract stringifyElement(elementNode: ElementNode<T>): Promise<string>;

    async stringify(node: Node) {
        return this.stringifier.stringify(node, this.stringifyOptions);
    }
}

export abstract class ObjStringifyFactory<
    T extends GenericElementSchema = GenericElementSchema,
> extends StringifyFactory<T> {
    abstract objName: string;

    abstract createRawObject(elementNode: ElementNode<T>): Promise<RawObject>;

    async stringifyElement(elementNode: ElementNode<T>) {
        const obj = await this.createRawObject(elementNode);
        return objToText(this.objName, obj);
    }
}

export type ElementStringifyFactoryClass<
    T extends GenericElementSchema = GenericElementSchema,
> = ClassOf<StringifyFactory<T>>;
