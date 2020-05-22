import { actionCreator } from '../useGetPoliciesIds';
import { Page } from '../../types/Page';

describe('src/services/useGetPoliciesIds', () => {
    it('is a get request', () => {
        const action = actionCreator(Page.of(1, 1));
        expect(action.method).toEqual('GET');
    });

    it('endpoint is /api/policies/v1.0/policies/ids', () => {
        const action = actionCreator(Page.of(1, 1));
        expect(action.endpoint).toEqual('/api/policies/v1.0/policies/ids');
    });
});
