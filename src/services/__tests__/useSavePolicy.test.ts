import { savePolicyActionCreator } from '../useSavePolicy';

describe('src/services/useSavePolicy', () => {
    it('Creates new when no id is set', () => {
        const action = savePolicyActionCreator({
            name: 'my name',
            description: 'my description',
            actions: [],
            conditions: 'foo',
            isEnabled: true
        });

        expect(action.endpoint).toEqual('/api/policies/v1.0/policies?alsoStore=true');
        expect(action.method).toEqual('POST');
    });

    it('Edits policy when id is set', () => {
        const action = savePolicyActionCreator({
            id: 'foo-bar',
            name: 'my name',
            description: 'my description',
            actions: [],
            conditions: 'foo',
            isEnabled: true
        });

        expect(action.endpoint).toEqual('/api/policies/v1.0/policies/foo-bar');
        expect(action.method).toEqual('PUT');
    });
});
