import { actionCreator } from '../useMassDeletePolicies';

describe('src/services/useMassDeletePolicies', () => {
    it('is a DELETE request', () => {
        const action = actionCreator([]);
        expect(action.method).toEqual('DELETE');
    });

    it('endpoint is /api/policies/v1.0/policies/ids', () => {
        const action = actionCreator([]);
        expect(action.endpoint).toEqual('/api/policies/v1.0/policies/ids');
    });

    it('sets array of ids as the sent body', () => {
        const action = actionCreator([ 'arr', 'foo', 'bar', 'scurvy' ]);
        expect(action.body).toEqual([ 'arr', 'foo', 'bar', 'scurvy' ]);
    });
});
