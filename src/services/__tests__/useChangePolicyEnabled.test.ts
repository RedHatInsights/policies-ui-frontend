import { actionCreator } from '../useChangePolicyEnabled';

describe('src/services/useSavePolicy', () => {
    it('Sets the policyId on the url', () => {
        const action = actionCreator({
            policyId: 'abc-foo-bar',
            shouldBeEnabled: true
        });

        expect(action.endpoint).toEqual('/api/policies/v1.0/policies/abc-foo-bar/enabled?enabled=true');
        expect(action.method).toEqual('POST');
    });

    it('Enabled is false', () => {
        const action = actionCreator({
            policyId: 'abc-foo-bar',
            shouldBeEnabled: false
        });

        expect(action.endpoint).toEqual('/api/policies/v1.0/policies/abc-foo-bar/enabled?enabled=false');
        expect(action.method).toEqual('POST');
    });
});
