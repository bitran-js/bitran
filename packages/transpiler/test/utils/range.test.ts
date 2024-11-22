import {
    getIntersection,
    range,
    tryRange,
    RangeIntersection,
} from '../../src/utils/range';

describe('getIntersection', () => {
    describe('RangeIntersection.None', () => {
        it('should return None when ranges do not intersect', () => {
            expect(getIntersection(range(4, 20), range(21, 80))).toBe(
                RangeIntersection.None,
            );
            expect(getIntersection(range(21, 80), range(4, 20))).toBe(
                RangeIntersection.None,
            );
            expect(getIntersection(range(4, 20), range(69, 80))).toBe(
                RangeIntersection.None,
            );
        });
    });

    describe('RangeIntersection.Partial', () => {
        it('should return Partial when ranges partially intersect', () => {
            expect(getIntersection(range(4, 20), range(5, 21))).toBe(
                RangeIntersection.Partial,
            );
            expect(getIntersection(range(5, 21), range(4, 20))).toBe(
                RangeIntersection.Partial,
            );

            expect(getIntersection(range(4, 20), range(20, 21))).toBe(
                RangeIntersection.Partial,
            );
            expect(getIntersection(range(4, 20), range(1, 4))).toBe(
                RangeIntersection.Partial,
            );
        });
    });

    describe('RangeIntersection.Inside', () => {
        it('should return Inside when one range is inside another', () => {
            expect(getIntersection(range(4, 20), range(3, 21))).toBe(
                RangeIntersection.Inside,
            );
            expect(getIntersection(range(4, 20), range(4, 21))).toBe(
                RangeIntersection.Inside,
            );
            expect(getIntersection(range(5, 21), range(4, 21))).toBe(
                RangeIntersection.Inside,
            );
        });
    });

    describe('RangeIntersection.Contain', () => {
        it('should return Contain when one range contains another', () => {
            expect(getIntersection(range(3, 21), range(4, 20))).toBe(
                RangeIntersection.Contain,
            );
            expect(getIntersection(range(4, 21), range(4, 20))).toBe(
                RangeIntersection.Contain,
            );
            expect(getIntersection(range(4, 21), range(5, 21))).toBe(
                RangeIntersection.Contain,
            );
        });
    });
});

describe('range', () => {
    it('should create a valid range for valid inputs', () => {
        const r = range(1, 10);
        expect(r.start).toBe(1);
        expect(r.end).toBe(10);
    });
    it('should throw an error for invalid inputs', () => {
        expect(() => range(10, 1)).toThrow();
        expect(() => range(-1, 10)).toThrow();
    });
});

describe('tryRange', () => {
    it('should return a valid range for valid inputs', () => {
        const r = tryRange(1, 10);
        expect(r).toBeDefined();
        expect(r!.start).toBe(1);
        expect(r!.end).toBe(10);
    });
    it('should return undefined for invalid inputs', () => {
        expect(tryRange(10, 1)).toBeUndefined();
        expect(tryRange(-1, 10)).toBeUndefined();
    });
});
