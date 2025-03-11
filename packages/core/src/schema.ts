export type ElementSchemaKey = 'Meta' | 'ParseData' | 'RenderData' | 'Provide';

export type DefineElementSchema<
    T extends Partial<Record<ElementSchemaKey, any>>,
> = T;

export interface SimpleElementSchema {
    Meta?: any;
    ParseData?: any;
    RenderData?: any;
}

export interface ProvideElementSchema extends SimpleElementSchema {
    Provide: any;
}

export type GenericElementSchema = SimpleElementSchema | ProvideElementSchema;
