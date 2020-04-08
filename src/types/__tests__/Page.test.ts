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

});
