import { actionBuilder, pageToQuery } from '../ActionBuilder';
import { Direction, Filter, Operator, Page, Sort } from '../../../types/Page';

describe('src/services/Api/ActionBuilder', () => {

    it('sets the method', () => {
        const action = actionBuilder('PUT', 'http://redhat.com').build();
        expect(action.method).toEqual('PUT');
    });

    it('builds an absolute url', () => {
        const action = actionBuilder('GET', 'http://redhat.com').build();
        expect(action.endpoint).toEqual('http://redhat.com');
    });

    it('builds relative urls', () => {
        const action = actionBuilder('GET', '/api/v1.0/policies').build();
        expect(action.endpoint).toEqual('/api/v1.0/policies');
    });

    it('parse relative urls and adds query params', () => {
        const action = actionBuilder('GET', '/api/v1.0/policies').queryParams({ foo: 'max' }).build();
        expect(action.endpoint).toEqual('/api/v1.0/policies?foo=max');
    });

    it('parse relative urls and handle empty query params', () => {
        const action = actionBuilder('GET', '/api/v1.0/policies').queryParams({}).build();
        expect(action.endpoint).toEqual('/api/v1.0/policies');
    });

    it('builds urls with query params', () => {
        const action = actionBuilder('GET', '/api/v1.0/policies?search=foo').build();
        expect(action.endpoint).toEqual('/api/v1.0/policies?search=foo');
    });

    it('builds urls with query params and adds query params', () => {
        const action = actionBuilder('GET', '/api/v1.0/policies?search=foo').queryParams({ foo: 'max' }).build();
        expect(action.endpoint).toEqual('/api/v1.0/policies?search=foo&foo=max');
    });

    it('sets the body as the passed data', () => {
        const action = actionBuilder('POST', '/api/v1.0/policies').data({
            foo: 'im the data',
            bar: {
                baz: 'just passed along'
            }
        }).build();
        expect(action.body).toEqual({
            foo: 'im the data',
            bar: {
                baz: 'just passed along'
            }
        });
    });

    it('empty query yields no params in the url', () => {
        const action = actionBuilder('GET', '/foo').queryParams({}).build();
        expect(action.endpoint).toEqual('/foo');
    });

    describe('pageToQuery', () => {

        it('If page is undefined, uses Page.defaultPage', () => {
            const query = pageToQuery();
            const defaultPage = Page.defaultPage();
            expect(query).toEqual({
                offset: 0,
                limit: defaultPage.size
            });
        });

        it('sets page values on the query', () => {
            const query = pageToQuery(Page.of(1, 10));
            expect(query).toEqual({
                offset: 0,
                limit: 10
            });
        });

        it('sets complex page values on the query', () => {
            const query = pageToQuery(Page.of(
                20,
                30,
                new Filter()
                .and('foo-column', Operator.EQUAL, 'foo-value')
                .and('bar-column', Operator.LIKE, 'bar-value'),
                Sort.by('sort-column', Direction.DESCENDING)
            ));
            expect(query).toEqual({
                offset: 570,
                limit: 30,
                filterFooColumn: 'foo-value',
                filterOpFooColumn: 'EQUAL',
                filterBarColumn: 'bar-value',
                filterOpBarColumn: 'LIKE',
                sortColumn: 'sort-column',
                sortDirection: 'DESC'
            });
        });

        it('Asking for index = 0 and size = Page.NO_SIZE sets offset to 0 and limit to -1', () => {
            const query = pageToQuery(Page.of(
                0,
                Page.NO_SIZE
            ));
            expect(query).toEqual({
                offset: 0,
                limit: -1
            });
        });

        it('Asking for index = 20 and size = Page.NO_SIZE size offset to 20 and limit to -1', () => {
            const query = pageToQuery(Page.of(
                20,
                Page.NO_SIZE
            ));
            expect(query).toEqual({
                offset: 20,
                limit: -1
            });
        });
    });
});
