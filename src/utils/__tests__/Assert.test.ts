import { assertNever } from '../Assert';

describe('src/utils/Assert', () => {
    it('assertNever represents unreachable code because the received value is "never"', () => {
        const test = true;

        if (test === true) {
            return;
        }

        expect(assertNever(test)).toBe(test);
    });

    it('assertNever should throw if for some reason it reach that point', () => {
        expect(() => {
            type FooType = 'foo';
            const fooed: FooType = 'foobar' as FooType;
            if (fooed === 'foo') {
                return;
            }

            assertNever(fooed);
        }).toThrowError('Invalid value received [foobar]');
    });
});
