import { paginatedActionBuilder } from '../PaginatedActionBuilder';
import { Direction, Filter, Operator, Page, Sort } from '../../../types/Page';

describe('src/services/Api/PaginatedActionBuilder', () => {

    it('sets page values on the query', () => {
        const action = paginatedActionBuilder('GET', '/policies').page(
            Page.of(1, 10)
        ).build();
        expect(action.endpoint).toEqual('/policies?offset=0&limit=10');
    });

    it('sets complex page values on the query', () => {
        const action = paginatedActionBuilder('GET', '/policies').page(
            Page.of(
                20,
                30,
                new Filter()
                .and('foo-column', Operator.EQUAL, 'foo-value')
                .and('bar-column', Operator.LIKE, 'bar-value'),
                Sort.by('sort-column', Direction.DESCENDING)
            )
        ).build();
        expect(action.endpoint).toEqual(
            `/policies?offset=570&limit=30&` +
            `${encodeURIComponent('filter[foo-column]')}=foo-value&` +
            `${encodeURIComponent('filter:op[foo-column]')}=EQUAL&` +
            `${encodeURIComponent('filter[bar-column]')}=bar-value&` +
            `${encodeURIComponent('filter:op[bar-column]')}=LIKE&` +
            'sortColumn=sort-column&sortDirection=DESC'
        );
    });

    it('Asking for index = 0 and size = Page.NO_SIZE size offset to 0 and limit to -1', () => {
        const action = paginatedActionBuilder('GET', '/policies').page(
            Page.of(
                0,
                Page.NO_SIZE
            )
        ).build();
        expect(action.endpoint).toEqual(
            '/policies?offset=0&limit=-1'
        );
    });

    it('Asking for index = 20 and size = Page.NO_SIZE size offset to 20 and limit to -1', () => {
        const action = paginatedActionBuilder('GET', '/policies').page(
            Page.of(
                20,
                Page.NO_SIZE
            )
        ).build();
        expect(action.endpoint).toEqual(
            '/policies?offset=20&limit=-1'
        );
    });
});
