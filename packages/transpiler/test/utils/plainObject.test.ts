import { isPlainObject } from '../../src/utils/plainObject';

describe('isPlainObject', () => {
    it('should return true for plain objects', () => {
        expect(isPlainObject({})).toBe(true);
        expect(isPlainObject({ a: 1, b: 2 })).toBe(true);
        expect(isPlainObject(Object.create(null))).toBe(false); // Not a plain object, has null prototype
    });

    it('should return false for null and undefined', () => {
        expect(isPlainObject(null)).toBe(false);
        expect(isPlainObject(undefined)).toBe(false);
    });

    it('should return false for arrays', () => {
        expect(isPlainObject([])).toBe(false);
        expect(isPlainObject([1, 2, 3])).toBe(false);
    });

    it('should return false for primitive values', () => {
        expect(isPlainObject(42)).toBe(false);
        expect(isPlainObject('string')).toBe(false);
        expect(isPlainObject(true)).toBe(false);
        expect(isPlainObject(Symbol())).toBe(false);
    });

    it('should return false for functions', () => {
        expect(isPlainObject(() => {})).toBe(false);
        expect(isPlainObject(function () {})).toBe(false);
    });

    it('should return false for objects with custom prototypes', () => {
        class TestClass {}
        expect(isPlainObject(new TestClass())).toBe(false);
        expect(isPlainObject(new Date())).toBe(false);
        expect(isPlainObject(new Map())).toBe(false);
    });
});
