import { ImmutableContainerSet, ImmutableContainerSetMode } from '../ImmutableContainerSet';

describe('src/types/ImmutableContainerSet', () => {

    it('Default is empty set with include mode', () => {
        const set = new ImmutableContainerSet<string>();
        expect(set.mode).toEqual(ImmutableContainerSetMode.INCLUDE);
        expect(set.size()).toEqual(0);
    });

    it('After add/remove the mode is the same', () => {
        const set = ImmutableContainerSet.include();
        const set2 = set.add('1234');
        const set3 = ImmutableContainerSet.exclude();
        const set4 = set3.add('1234');
        expect(set.mode).toEqual(ImmutableContainerSetMode.INCLUDE);
        expect(set2.mode).toEqual(ImmutableContainerSetMode.INCLUDE);
        expect(set3.mode).toEqual(ImmutableContainerSetMode.EXCLUDE);
        expect(set4.mode).toEqual(ImmutableContainerSetMode.EXCLUDE);
    });

    it('add returns a new set', () => {
        const set = new ImmutableContainerSet<string>();
        const set2 = set.add('55');
        expect(set).not.toBe(set2);
    });

    it('remove returns a new set', () => {
        const set = new ImmutableContainerSet<string>([ '33' ]);
        const set2 = set.remove('55');
        expect(set).not.toBe(set2);
    });

    it('values returns the inner set container', () => {
        const set = new ImmutableContainerSet<string>([ '33', '44', '55' ]);
        expect(set.values()).toEqual([ '33', '44', '55' ]);
    });

    describe('Mode is INCLUDE', () => {
        it('adds new elements to the set', () => {
            const set = ImmutableContainerSet.include<string>();
            const set2 = set.add('11');
            const set3 = set2.add('22');
            const set4 = set.add('33');

            expect(set.size()).toEqual(0);
            expect(set2.size()).toEqual(1);
            expect(set3.size()).toEqual(2);
            expect(set4.size()).toEqual(1);
        });

        it('adds new elements to the set using iterables', () => {
            const set = ImmutableContainerSet.include<string>();
            const set2 = set.addIterable([ '11', '22' ]);

            expect(set.size()).toEqual(0);
            expect(set2.size()).toEqual(2);
        });

        it('removes elements from the set', () => {
            const set = ImmutableContainerSet.include<string>([ '11', '22', '33', '44', '55' ]);
            const set2 = set.remove('11');
            const set3 = set2.remove('22');
            const set4 = set.remove('33');

            expect(set.size()).toEqual(5);
            expect(set2.size()).toEqual(4);
            expect(set3.size()).toEqual(3);
            expect(set4.size()).toEqual(4);
        });

        it('removes elements from the set using iterables', () => {
            const set = ImmutableContainerSet.include([ '11', '22', '33', '44', '55' ]);
            const set2 = set.removeIterable([ '11', '55', 'foo-bar' ]);

            expect(set.size()).toEqual(5);
            expect(set2.size()).toEqual(3);
        });

        it('adding included elements keeps the size', () => {
            const set = ImmutableContainerSet.include<string>([ '11', '22', '33', '44' ]);
            const set2 = set.addIterable([ '11', '22' ]);

            expect(set.size()).toEqual(4);
            expect(set2.size()).toEqual(4);
        });

        it('tells if the set contains the element', () => {
            const set = ImmutableContainerSet.include([ '11', '22', '33', '44', '55' ]);
            const set2 = set.removeIterable([ '11', '55', 'foo-bar' ]);

            expect(set.contains('11')).toBe(true);
            expect(set.contains('44')).toBe(true);
            expect(set.contains('foo-bar')).toBe(false);

            expect(set2.contains('11')).toBe(false);
            expect(set2.contains('55')).toBe(false);
            expect(set2.contains('foo-bar')).toBe(false);
        });
    });

    describe('Mode is EXCLUDE', () => {

        it('fails when trying to get size without max', () => {
            const set = ImmutableContainerSet.exclude([ '11', '22', '33', '44', '55' ]);
            expect(() => set.size()).toThrowError();
        });

        it('size of exclude is max - contents', () => {
            const set = ImmutableContainerSet.exclude([ '11', '22', '33', '44', '55' ]);
            expect(set.size(8)).toEqual(3);
        });

        it('adds new elements to the set', () => {
            const set = ImmutableContainerSet.exclude([ '11', '22', '33' ]);
            const set2 = set.add('11');
            const set3 = set2.add('22');
            const set4 = set.add('33');
            const max = 10;

            expect(set.size(max)).toEqual(7);
            expect(set2.size(max)).toEqual(8);
            expect(set3.size(max)).toEqual(9);
            expect(set4.size(max)).toEqual(8);
        });

        it('adds new elements to the set using iterables', () => {
            const set = ImmutableContainerSet.exclude([ '11', '33' ]);
            const set2 = set.addIterable([ '11', '22' ]);
            const max = 10;

            expect(set.size(max)).toEqual(8);
            expect(set2.size(max)).toEqual(9);
        });

        it('removes elements from the set', () => {
            const set = ImmutableContainerSet.exclude([ '66', '77', '88', '99', '111' ]);
            const set2 = set.remove('11');
            const set3 = set2.remove('22');
            const set4 = set.remove('33');
            const max = 10;

            expect(set.size(max)).toEqual(5);
            expect(set2.size(max)).toEqual(4);
            expect(set3.size(max)).toEqual(3);
            expect(set4.size(max)).toEqual(4);
        });

        it('removes elements from the set using iterables', () => {
            const set = ImmutableContainerSet.exclude([ '11', '22', '33', '44', '55' ]);
            const set2 = set.removeIterable([ '11', '55', 'foo-bar' ]);
            const max = 10;

            expect(set.size(max)).toEqual(5);
            expect(set2.size(max)).toEqual(4);
        });

        it('removing excluded elements keeps the size', () => {
            const set = ImmutableContainerSet.exclude<string>([ '11', '22', '33', '44' ]);
            const set2 = set.removeIterable([ '11', '22' ]);
            const max = 10;

            expect(set.size(max)).toEqual(6);
            expect(set2.size(max)).toEqual(6);
        });

        it('tells if the set contains the element', () => {
            const set = ImmutableContainerSet.exclude([ '11', '22', '33', '44', '55' ]);
            const set2 = set.removeIterable([ '11', '55', 'foo-bar' ]);

            expect(set.contains('11')).toBe(false);
            expect(set.contains('44')).toBe(false);
            expect(set.contains('foo-bar')).toBe(true);

            expect(set2.contains('11')).toBe(false);
            expect(set2.contains('55')).toBe(false);
            expect(set2.contains('foo-bar')).toBe(false);
        });
    });
});

