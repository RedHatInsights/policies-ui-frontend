import { actionBuilder } from '../ActionBuilder';

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
});
