import { Direction, Filter, Operator, Page, Sort } from '../Page';

describe('src/types/Page', () => {

    it('Default page size is 50', () => {
        const page = Page.defaultPage();
        expect(page.size).toEqual(50);
    });

    it('Default page index is 1', () => {
        const page = Page.defaultPage();
        expect(page.index).toEqual(1);
    });

    it('Default page sort is undefined', () => {
        const page = Page.defaultPage();
        expect(page.sort).toEqual(undefined);
    });

    it('Default page filter is undefined', () => {
        const page = Page.defaultPage();
        expect(page.filter).toEqual(undefined);
    });

    it('Page.of creates a Page', () => {
        const filter = new Filter().and('foo', Operator.ILIKE, 'bar');
        const sort = Sort.by('baz', Direction.DESCENDING);
        const page = Page.of(
            33,
            55,
            filter,
            sort
        );
        expect(page.index).toEqual(33);
        expect(page.size).toEqual(55);
        expect(page.filter).toEqual(filter);
        expect(page.sort).toEqual(sort);
    });

    it('Page.of without size is the same as the defaultPage.size', () => {
        const page = Page.of(90);
        expect(page.size).toEqual(Page.defaultPage().size);
    });

    it('hasFilter checks if we have any filter', () => {
        expect(Page.defaultPage().hasFilter()).toBeFalsy();
        expect(Page.of(
            1,
            1,
            new Filter().and('col', Operator.EQUAL, 'foo')
        ).hasFilter()).toBeTruthy();
    });

    describe('lastPageForElements', () => {
        it('last page is 1 for 0 elements', () => {
            expect(Page.lastPageForElements(0, 10).index).toEqual(1);
        });

        it('last page is 1 for 10 elements and 10 per page', () => {
            expect(Page.lastPageForElements(10, 10).index).toEqual(1);
        });

        it('last page is 2 for 11 elements and 10 per page', () => {
            expect(Page.lastPageForElements(11, 10).index).toEqual(2);
        });

        it('last page is 2 for 15 elements and 10 per page', () => {
            expect(Page.lastPageForElements(15, 10).index).toEqual(2);
        });

        it('last page is 1 for 15 elements and 20 per page', () => {
            expect(Page.lastPageForElements(15, 20).index).toEqual(1);
        });
    });

});
