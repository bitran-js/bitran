import {
    indent,
    normalizeLineEndings,
    splitFirstLine,
    textToObj,
    textToStrBlocks,
    tryParseInt,
    dedent,
} from '../../src/utils/str';

describe('normalizeLineEndings', () => {
    it('should normalize text with \\r\\n to \\n', () => {
        const text = `This\r\nis raw\r\ntext!`;
        const result = `This\nis raw\ntext!`;

        expect(normalizeLineEndings(text)).toBe(result);
    });
});

describe('textToStrBlocks', () => {
    type TestSet = { name: string; input: string; out: string[] }[];

    const testSet: TestSet = [
        {
            name: 'Empty string',
            input: '',
            out: [],
        },
        {
            name: 'Simple string',
            input: 'Hello world!',
            out: ['Hello world!'],
        },
        {
            name: 'One block with multiple lines',
            input: 'My first line\nMy second line',
            out: ['My first line\nMy second line'],
        },
        {
            name: 'Complex string with line breaks and string objects',
            input: '\n\n   \n \nHello World!\n\n@objBlock\n    property1\n\n    property2\n\n  \n\n   \nLast line\n   \n\n  ',
            out: [
                'Hello World!',
                '@objBlock\n    property1\n\n    property2',
                'Last line',
            ],
        },
    ];

    for (const setItem of testSet) {
        it(setItem.name, () => {
            expect(textToStrBlocks(setItem.input)).toMatchObject(setItem.out);
        });
    }
});

describe('textToObj', () => {
    it('should handle empty line', () =>
        expect(textToObj('')).toMatchObject({}));
    it('should handle non-object string', () =>
        expect(textToObj('[5, 3, 2]')).toMatchObject({}));
    it('should handle literal object', () =>
        expect(textToObj('a: b\nfoo: 5\nbar: [1, 2, 3]')).toMatchObject({
            a: 'b',
            foo: 5,
            bar: [1, 2, 3],
        }));
});

describe('splitFirstLine', () => {
    const cases: [string, string, ReturnType<typeof splitFirstLine>][] = [
        ['Empty line', '', { firstLine: '', restText: '' }],
        [
            'One line',
            'My first line!',
            { firstLine: 'My first line!', restText: '' },
        ],
        [
            'Empty first line',
            '\n\nMy third line!',
            { firstLine: '', restText: '\nMy third line!' },
        ],
        ['Many lines', 'a\n\nb\nc', { firstLine: 'a', restText: '\nb\nc' }],
    ];

    it.each(cases)('%s', (testName, text, result) =>
        expect(splitFirstLine(text)).toMatchObject(result),
    );
});

describe('indent', () => {
    it('should indent single line', () => {
        expect(indent('')).toBe('');
        expect(indent('Line')).toBe('    Line');
    });

    it('should indent multiple lines', () => {
        expect(indent('First line\nSecond line\nThird line')).toBe(
            '    First line\n    Second line\n    Third line',
        );
    });

    it('should indent text with empty lines and space symbols', () => {
        expect(
            indent('\n   \n\nFirst line\n  \n\nSecond line\nThird line\n'),
        ).toBe(
            '\n   \n\n    First line\n  \n\n    Second line\n    Third line\n',
        );
    });

    it('should handle different indent sizes', () => {
        expect(indent('a', 0)).toBe('a');
        expect(indent('a', 1)).toBe(' a');
        expect(indent('a', 5)).toBe('     a');
    });
});

describe('dedent', () => {
    it('should handle empty string', () => {
        expect(dedent('')).toBe('');
    });

    it('should not change string with no indentation', () => {
        const text = 'First line\nSecond line';
        expect(dedent(text)).toBe(text);
    });

    it('should remove consistent indentation', () => {
        const text = '    First line\n    Second line\n    Third line';
        const expected = 'First line\nSecond line\nThird line';
        expect(dedent(text)).toBe(expected);
    });

    it('should remove indentation based on first non-empty line', () => {
        const text = '\n    First line\n        Second line\n    Third line';
        const expected = '\nFirst line\n    Second line\nThird line';
        expect(dedent(text)).toBe(expected);
    });

    it('should preserve empty lines', () => {
        const text = '    First line\n\n    Second line';
        const expected = 'First line\n\nSecond line';
        expect(dedent(text)).toBe(expected);
    });

    it('should handle lines with less indentation than first line', () => {
        const text = '      First line\n    Second line\n  Third line';
        const expected = 'First line\nSecond line\nThird line';
        expect(dedent(text)).toBe(expected);
    });
});

describe('tryParseInt', () => {
    it('should handle empty text', () => {
        expect(tryParseInt('')).toBe('');
    });

    it('should remain string if parse fails', () => {
        expect(tryParseInt('')).toBe('');
        expect(tryParseInt('test')).toBe('test');
    });

    it('should convert valid numeric text', () => {
        expect(tryParseInt('0')).toBe(0);
        expect(tryParseInt('123')).toBe(123);
        expect(tryParseInt('-123')).toBe(-123);
    });
});
