import { actionCreator } from '../useVerifyPolicy';

describe('src/services/useValidatePolicyName', () => {
    it('Creates an action with validate-name endpoint, name on body and POST', () => {
        const action = actionCreator({
            name: 'my name',
            description: 'my description',
            actions: [],
            conditions: 'foo',
            isEnabled: true
        });

        expect(action.endpoint).toEqual('/api/policies/v1.0/policies/validate');
        expect(action.method).toEqual('POST');
        expect(action.body).toEqual({
            name: 'my name',
            description: 'my description',
            actions: '',
            conditions: 'foo',
            isEnabled: true
        });
    });
});
