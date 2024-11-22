import { Node } from './node';
import type { GenericElementSchema } from '../schema';

export interface ElementMeta {
    id?: string;
    classes?: string[];
    [key: string]: any;
}

export abstract class ElementNode<
    TSchema extends GenericElementSchema = GenericElementSchema,
> extends Node {
    name!: string;
    autoId!: string;
    meta: ElementMeta & Partial<TSchema['Meta']> = {};
    parseData!: TSchema['ParseData'];
    renderData!: TSchema['RenderData'];

    get id() {
        return this.meta.id ?? this.autoId ?? undefined;
    }
}

export abstract class BlockNode<
    TSchema extends GenericElementSchema = GenericElementSchema,
> extends ElementNode<TSchema> {}

export abstract class InlinerNode<
    TSchema extends GenericElementSchema = GenericElementSchema,
> extends ElementNode<TSchema> {}
