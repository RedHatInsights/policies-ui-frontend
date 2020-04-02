import { createAction } from '../Api';

describe('src/services/Api', () => {

    it('createAction sets the method', () => {
        const action = createAction('PUT', 'http://redhat.com');
        expect(action.method).toEqual('PUT');
    });

    it('createAction builds an absolute url', () => {
        const action = createAction('GET', 'http://redhat.com');
        expect(action.endpoint).toEqual('http://redhat.com');
    });

    it('createAction builds relative urls', () => {
        const action = createAction('GET', '/api/v1.0/policies');
        expect(action.endpoint).toEqual('/api/v1.0/policies');
    });

    it('createAction parse relative urls and adds query params', () => {
        const action = createAction('GET', '/api/v1.0/policies', { foo: 'max' });
        expect(action.endpoint).toEqual('/api/v1.0/policies?foo=max');
    });

    it('createAction parse relative urls and handle empty query params', () => {
        const action = createAction('GET', '/api/v1.0/policies', { });
        expect(action.endpoint).toEqual('/api/v1.0/policies');
    });

    it('createAction builds urls with query params', () => {
        const action = createAction('GET', '/api/v1.0/policies?search=foo');
        expect(action.endpoint).toEqual('/api/v1.0/policies?search=foo');
    });

    it('createAction builds urls with query params and adds query params', () => {
        const action = createAction('GET', '/api/v1.0/policies?search=foo', { foo: 'max' });
        expect(action.endpoint).toEqual('/api/v1.0/policies?search=foo&foo=max');
    });

    it('createAction sets the body as the passed data', () => {
        const action = createAction('POST', '/api/v1.0/policies', {}, {
            foo: 'im the data',
            bar: {
                baz: 'just passed along'
            }
        });
        expect(action.body).toEqual({
            foo: 'im the data',
            bar: {
                baz: 'just passed along'
            }
        });
    });
});
