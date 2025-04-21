export type PlainObject = Record<string, any>;

export function isPlainObject(value: any): value is PlainObject {
    return (
        value !== null &&
        typeof value === 'object' &&
        !Array.isArray(value) &&
        Object.getPrototypeOf(value) === Object.prototype
    );
}
