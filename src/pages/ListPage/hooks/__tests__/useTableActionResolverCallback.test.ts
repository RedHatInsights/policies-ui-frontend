import { renderHook } from '@testing-library/react-hooks';

import { PolicyRow } from '../../../../components/Policy/Table/PolicyTable';
import { makeCopyOfPolicy } from '../../../../types/adapters/PolicyAdapter';
import { useTableActionResolverCallback } from '../useTableActionResolverCallback';

describe('src/pages/ListPage/hooks/useTableActionResolverCallback', () => {
    it('Returns a callback', () => {
        const { result } = renderHook(() => useTableActionResolverCallback({
            canWriteAll: false,
            mutateChangePolicyEnabled: jest.fn(),
            openPolicyToDelete: jest.fn(),
            setPolicyWizardState: jest.fn()
        }));

        expect(result.current).toBeInstanceOf(Function);
    });

    it('Resolves to nothing if canWriteAll is false', () => {
        const policy: PolicyRow = {
            isOpen: false,
            isSelected: false,
            id: 'ab',
            actions: [],
            conditions: '',
            description: '',
            name: '',
            isEnabled: true,
            mtime: new Date(),
            lastTriggered: new Date(),
            ctime: new Date()
        };

        const { result } = renderHook(() => useTableActionResolverCallback({
            canWriteAll: false,
            mutateChangePolicyEnabled: jest.fn(),
            openPolicyToDelete: jest.fn(),
            setPolicyWizardState: jest.fn()
        }));

        expect(result.current(policy)).toEqual([]);
    });

    it('Should have 4 actions', () => {
        const policy: PolicyRow = {
            isOpen: false,
            isSelected: false,
            id: 'ab',
            actions: [],
            conditions: '',
            description: '',
            name: '',
            isEnabled: true,
            mtime: new Date(),
            lastTriggered: new Date(),
            ctime: new Date()
        };

        const params = {
            canWriteAll: true,
            mutateChangePolicyEnabled: jest.fn(),
            openPolicyToDelete: jest.fn(),
            setPolicyWizardState: jest.fn()
        };

        const { result } = renderHook(() => useTableActionResolverCallback(params));

        expect(result.current(policy).length).toEqual(4);
    });

    it('First action title should be "Disable" if policy isEnabled = true', () => {
        const policy: PolicyRow = {
            isOpen: false,
            isSelected: false,
            id: 'ab',
            actions: [],
            conditions: '',
            description: '',
            name: '',
            isEnabled: true,
            mtime: new Date(),
            lastTriggered: new Date(),
            ctime: new Date()
        };

        const params = {
            canWriteAll: true,
            mutateChangePolicyEnabled: jest.fn(),
            openPolicyToDelete: jest.fn(),
            setPolicyWizardState: jest.fn()
        };

        const { result } = renderHook(() => useTableActionResolverCallback(params));

        expect(result.current(policy)[0].title).toEqual('Disable');
    });

    it('First action title should be "Enable" if policy isEnabled = false', () => {
        const policy: PolicyRow = {
            isOpen: false,
            isSelected: false,
            id: 'ab',
            actions: [],
            conditions: '',
            description: '',
            name: '',
            isEnabled: false,
            mtime: new Date(),
            lastTriggered: new Date(),
            ctime: new Date()
        };

        const params = {
            canWriteAll: true,
            mutateChangePolicyEnabled: jest.fn(),
            openPolicyToDelete: jest.fn(),
            setPolicyWizardState: jest.fn()
        };

        const { result } = renderHook(() => useTableActionResolverCallback(params));

        expect(result.current(policy)[0].title).toEqual('Enable');
    });

    it('First action onClick should call mutateChangePolicyEnabled', () => {
        const policy: PolicyRow = {
            isOpen: false,
            isSelected: false,
            id: 'ab',
            actions: [],
            conditions: '',
            description: '',
            name: '',
            isEnabled: false,
            mtime: new Date(),
            lastTriggered: new Date(),
            ctime: new Date()
        };

        const params = {
            canWriteAll: true,
            mutateChangePolicyEnabled: jest.fn(),
            openPolicyToDelete: jest.fn(),
            setPolicyWizardState: jest.fn()
        };

        const { result } = renderHook(() => useTableActionResolverCallback(params));
        expect(params.mutateChangePolicyEnabled).toHaveBeenCalledTimes(0);
        result.current(policy)[0].onClick();
        expect(params.mutateChangePolicyEnabled).toHaveBeenCalledTimes(1);
    });

    it('Edit action is always present', () => {
        const policy: PolicyRow = {
            isOpen: false,
            isSelected: false,
            id: 'ab',
            actions: [],
            conditions: '',
            description: '',
            name: '',
            isEnabled: false,
            mtime: new Date(),
            lastTriggered: new Date(),
            ctime: new Date()
        };

        const params = {
            canWriteAll: true,
            mutateChangePolicyEnabled: jest.fn(),
            openPolicyToDelete: jest.fn(),
            setPolicyWizardState: jest.fn()
        };

        const { result } = renderHook(() => useTableActionResolverCallback(params));
        const edit = result.current(policy).find(action => action.title === 'Edit');
        expect(edit).toBeTruthy();
    });

    it('Edit action on Click calls setPolicyWizard', () => {
        const policy: PolicyRow = {
            isOpen: false,
            isSelected: false,
            id: 'ab',
            actions: [],
            conditions: '',
            description: '',
            name: '',
            isEnabled: false,
            mtime: new Date(),
            lastTriggered: new Date(),
            ctime: new Date()
        };

        const params = {
            canWriteAll: true,
            mutateChangePolicyEnabled: jest.fn(),
            openPolicyToDelete: jest.fn(),
            setPolicyWizardState: jest.fn()
        };

        const { result } = renderHook(() => useTableActionResolverCallback(params));
        const edit = result.current(policy).find(action => action.title === 'Edit');
        expect(params.setPolicyWizardState).toHaveBeenCalledTimes(0);
        edit?.onClick();
        expect(params.setPolicyWizardState).toHaveBeenCalledWith({
            isOpen: true,
            template: policy,
            showCreateStep: false,
            isEditing: true
        });
    });

    it('Duplicate action is always present', () => {
        const policy: PolicyRow = {
            isOpen: false,
            isSelected: false,
            id: 'ab',
            actions: [],
            conditions: '',
            description: '',
            name: '',
            isEnabled: false,
            mtime: new Date(),
            lastTriggered: new Date(),
            ctime: new Date()
        };

        const params = {
            canWriteAll: true,
            mutateChangePolicyEnabled: jest.fn(),
            openPolicyToDelete: jest.fn(),
            setPolicyWizardState: jest.fn()
        };

        const { result } = renderHook(() => useTableActionResolverCallback(params));
        const edit = result.current(policy).find(action => action.title === 'Duplicate');
        expect(edit).toBeTruthy();
    });

    it('Duplicate action on Click calls setPolicyWizard', () => {
        const policy: PolicyRow = {
            isOpen: false,
            isSelected: false,
            id: 'ab',
            actions: [],
            conditions: '',
            description: '',
            name: '',
            isEnabled: false,
            mtime: new Date(),
            lastTriggered: new Date(),
            ctime: new Date()
        };

        const params = {
            canWriteAll: true,
            mutateChangePolicyEnabled: jest.fn(),
            openPolicyToDelete: jest.fn(),
            setPolicyWizardState: jest.fn()
        };

        const { result } = renderHook(() => useTableActionResolverCallback(params));
        const edit = result.current(policy).find(action => action.title === 'Duplicate');
        expect(params.setPolicyWizardState).toHaveBeenCalledTimes(0);
        edit?.onClick();
        expect(params.setPolicyWizardState).toHaveBeenCalledWith({
            isOpen: true,
            template: makeCopyOfPolicy(policy),
            showCreateStep: false,
            isEditing: false
        });
    });

    it('Delete action is always present', () => {
        const policy: PolicyRow = {
            isOpen: false,
            isSelected: false,
            id: 'ab',
            actions: [],
            conditions: '',
            description: '',
            name: '',
            isEnabled: false,
            mtime: new Date(),
            lastTriggered: new Date(),
            ctime: new Date()
        };

        const params = {
            canWriteAll: true,
            mutateChangePolicyEnabled: jest.fn(),
            openPolicyToDelete: jest.fn(),
            setPolicyWizardState: jest.fn()
        };

        const { result } = renderHook(() => useTableActionResolverCallback(params));
        const edit = result.current(policy).find(action => action.title === 'Delete');
        expect(edit).toBeTruthy();
    });

    it('Delete action on Click calls openPolicyToDelete', () => {
        const policy: PolicyRow = {
            isOpen: false,
            isSelected: false,
            id: 'ab',
            actions: [],
            conditions: '',
            description: '',
            name: '',
            isEnabled: false,
            mtime: new Date(),
            lastTriggered: new Date(),
            ctime: new Date()
        };

        const params = {
            canWriteAll: true,
            mutateChangePolicyEnabled: jest.fn(),
            openPolicyToDelete: jest.fn(),
            setPolicyWizardState: jest.fn()
        };

        const { result } = renderHook(() => useTableActionResolverCallback(params));
        const edit = result.current(policy).find(action => action.title === 'Delete');
        expect(params.openPolicyToDelete).toHaveBeenCalledTimes(0);
        edit?.onClick();
        expect(params.openPolicyToDelete).toHaveBeenCalledWith(policy);
    });
});
