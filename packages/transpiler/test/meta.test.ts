import type { ElementMeta } from '@bitran-js/core';

import {
    detachMeta,
    parseLineMeta,
    parseMeta,
    stringifyMeta,
} from '../src/meta';

describe('parseLineMeta', () => {
    it('should parse basic inline meta (id, classes, flags, key-value)', () => {
        const meta = parseLineMeta(
            '#myId .classOne +flag -otherKey numberKey=42',
        );
        expect(meta.id).toBe('myId');
        expect(meta.classes).toEqual(['classOne']);
        expect(meta.flag).toBe(true);
        expect(meta.otherKey).toBe(false);
        expect(meta.numberKey).toBe(42);
    });

    it('should parse strings with double quotes', () => {
        const meta = parseLineMeta('#foo title="My Title"');
        expect(meta.id).toBe('foo');
        expect(meta.title).toBe('My Title');
    });

    it('should handle empty classes array properly', () => {
        const meta = parseLineMeta('#id +flag');
        expect(meta.id).toBe('id');
        expect(meta.classes).toBeUndefined();
        expect(meta.flag).toBe(true);
    });

    it('should treat empty properties as null', () => {
        const meta = parseLineMeta('foo bar baz');
        expect(meta).toEqual({ foo: null, bar: null, baz: null });
    });
});

describe('parseMeta', () => {
    it('should parse single-line meta as inline', () => {
        const meta = parseMeta('#myId .classOne key=123');
        expect(meta).toEqual({
            id: 'myId',
            classes: ['classOne'],
            key: 123,
        });
    });

    it('should parse multi-line meta as YAML-like object', () => {
        const multilineMeta = `
foo: bar
num: 42
bar:
    baz: |-
        This is string
flag: true
`;
        const meta = parseMeta(multilineMeta);
        expect(meta).toEqual({
            foo: 'bar',
            num: 42,
            bar: { baz: 'This is string' },
            flag: true,
        });
    });
});

describe('stringifyMeta', () => {
    it('should stringify inline meta without complex objects', () => {
        const meta: ElementMeta = {
            id: 'myId',
            classes: ['classOne', 'classTwo'],
            flag: true,
            disabled: false,
            title: 'Hello',
        };
        const result = stringifyMeta(meta, false);
        expect(result).toBe(
            '{ #myId .classOne .classTwo +flag -disabled title=Hello }',
        );
    });

    it('should produce an empty string if meta is undefined', () => {
        expect(stringifyMeta(undefined as unknown as ElementMeta, true)).toBe(
            '',
        );
    });

    it('should produce a complex YAML-like string if complexMetaAllowed and meta has object', () => {
        const meta: ElementMeta = {
            id: 'complexId',
            data: { nestedKey: 'nestedValue', nestedFlag: true },
        };
        const result = stringifyMeta(meta, true);
        expect(result).toBe(`{
    id: complexId
    data:
        nestedKey: nestedValue
        nestedFlag: true
}`);
    });

    it('should inline only properties it can inline and ignore complex ones', () => {
        const meta: ElementMeta = {
            id: 'testId',
            classes: ['classOne'],
            flag: true,
            title: 'My Title',
            data: { test: true },
        };
        const result = stringifyMeta(meta, false);
        expect(result).toBe('{ #testId .classOne +flag title="My Title" }');
    });
});

describe('detachMeta', () => {
    it('should detach single-line meta from text', () => {
        const textWithMeta = '{#myId .classOne key=123}\nThis is a paragraph.';
        const result = detachMeta(textWithMeta);
        expect(result.meta).toEqual({
            id: 'myId',
            classes: ['classOne'],
            key: 123,
        });
        expect(result.restText).toBe('This is a paragraph.');
    });

    it('should detach multi-line meta from text', () => {
        const textWithMeta = `{
foo: bar
num: 42
bar:
    baz: |-
        This is string
flag: true
}
This is a paragraph.`;
        const result = detachMeta(textWithMeta);
        expect(result.meta).toEqual({
            foo: 'bar',
            num: 42,
            bar: { baz: 'This is string' },
            flag: true,
        });
        expect(result.restText).toBe('This is a paragraph.');
    });

    it('should return the whole text as restText if no meta is found', () => {
        const textWithMeta = 'This is a paragraph without meta.';
        const result = detachMeta(textWithMeta);
        expect(result.meta).toEqual({});
        expect(result.restText).toBe('This is a paragraph without meta.');
    });

    it('should handle empty meta correctly', () => {
        const textWithMeta = '{}\nThis is a paragraph.';
        const result = detachMeta(textWithMeta);
        expect(result.meta).toEqual({});
        expect(result.restText).toBe('This is a paragraph.');
    });

    it('should handle meta with only id and classes', () => {
        const textWithMeta = '{#id .classOne .classTwo}\nThis is a paragraph.';
        const result = detachMeta(textWithMeta);
        expect(result.meta).toEqual({
            id: 'id',
            classes: ['classOne', 'classTwo'],
        });
        expect(result.restText).toBe('This is a paragraph.');
    });
});
