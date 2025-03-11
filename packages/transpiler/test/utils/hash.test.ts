import { hashString } from '../../src/utils/hash';

describe('hashString', () => {
    it('should return a string of the specified length', () => {
        expect(hashString('test', 10)).toHaveLength(10);
    });

    it('should return different hashes for different inputs', () => {
        expect(hashString('test1', 10)).not.toBe(hashString('test2', 10));
    });

    it('should return the same hash for the same input and length', () => {
        expect(hashString('test', 10)).toBe(hashString('test', 10));
    });

    it('should handle empty input string', () => {
        expect(hashString('', 10)).toHaveLength(10);
    });

    it('should handle length of 0', () => {
        expect(hashString('test', 0)).toBe('');
    });

    it('should handle negative length', () => {
        expect(hashString('test', -5)).toBe('');
    });

    it('should return a URL-safe hash', () => {
        expect(hashString('test', 10)).toMatch(/^[A-Za-z0-9]+$/);
    });

    it('should handle very large length', () => {
        expect(hashString('test', 1000)).toHaveLength(1000);
    });

    it('should handle special characters in input', () => {
        expect(hashString('!@#$%^&*()_+', 10)).toHaveLength(10);
    });

    it('should handle non-ASCII characters in input', () => {
        expect(hashString('测试', 10)).toHaveLength(10);
    });
});
