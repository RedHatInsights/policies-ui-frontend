import { actionCreator } from '../useDeletePolicies';

describe('src/services/useDeletePolicies', () => {
    it('is a DELETE request', () => {
        const action = actionCreator('foo');
        expect(action.method).toEqual('DELETE');
    });

    it('endpoint is /api/policies/v1.0/policies/[the-id]', () => {
        const action = actionCreator('my-foo-bar-id');
        expect(action.endpoint).toEqual('/api/policies/v1.0/policies/my-foo-bar-id');
    });
});
