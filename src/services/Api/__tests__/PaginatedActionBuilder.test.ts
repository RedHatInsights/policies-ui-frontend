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
});
