import {
    type ClassOf,
    type ElementNode,
    type GenericElementSchema,
    type ProvideElementSchema,
    type RenderDataGenerator,
} from '@bitran-js/core';

import type { ElementParseFactoryClass } from './parse/parseFactory';
import { Parser } from './parse/parser';
import { Stringifier } from './stringify/stringifier';
import type { ElementStringifyFactoryClass } from './stringify/stringifyFactory';

export type ElementTranspiler<
    T extends GenericElementSchema = GenericElementSchema,
> = {
    Node: ClassOf<ElementNode<T>>;
    Parsers: ElementParseFactoryClass<T>[];
    Stringifier: ElementStringifyFactoryClass;
    renderDataGenerator?: RenderDataGenerator<T>;
} & (T extends { Provide: any }
    ? { provide: T['Provide'] }
    : { provide?: never });

export type ElementTranspilers = Record<string, ElementTranspiler>;

export function defineElementTranspiler<T extends GenericElementSchema>(
    transpiler: ElementTranspiler<T>,
) {
    return transpiler;
}

export function defineProvideElementTranspiler<T extends ProvideElementSchema>(
    transpiler: Omit<ElementTranspiler<T>, 'provide'>,
) {
    return (provide: T['Provide']) =>
        defineElementTranspiler({
            ...transpiler,
            provide,
        } as ElementTranspiler<T>);
}

export interface BitranTranspiler {
    transpilers: ElementTranspilers;
    parser: Parser;
    stringifier: Stringifier;
}

export function defineBitranTranspiler(
    transpilers: ElementTranspilers,
): BitranTranspiler {
    return {
        transpilers,
        parser: new Parser(transpilers),
        stringifier: new Stringifier(transpilers),
    };
}
