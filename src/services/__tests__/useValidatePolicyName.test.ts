import { actionCreator } from '../useValidatePolicyName';

describe('src/services/useValidatePolicyName', () => {
    it('Creates an action with validate-name endpoint, name on body and POST', () => {
        const action = actionCreator({
            name: 'my name',
            description: 'my description',
            actions: [],
            conditions: 'foo',
            isEnabled: true
        });

        expect(action.endpoint).toEqual('/api/policies/v1.0/policies/validate-name');
        expect(action.method).toEqual('POST');
        expect(action.body).toEqual('my name');
    });

    it('Sets query param id when the policy has an id', () => {
        const action = actionCreator({
            name: 'my name',
            description: 'my description',
            actions: [],
            conditions: 'foo',
            isEnabled: true,
            id: 'super-foo'
        });

        expect(action.endpoint).toContain('id=super-foo');
    });

    it('Does not set query param id when the policy does not have an id', () => {
        const action = actionCreator({
            name: 'my name',
            description: 'my description',
            actions: [],
            conditions: 'foo',
            isEnabled: true
        });

        expect(action.endpoint).not.toContain('id=');
    });
});
