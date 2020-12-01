import { renderHook } from '@testing-library/react-hooks';
import inBrowserDownload from 'in-browser-download';
import { useToolbarActions } from '../useToolbarActions';
import { PolicyRow } from '../../../../components/Policy/Table/PolicyTable';
import { addDangerNotification, ImmutableContainerSet, ExporterType } from '@redhat-cloud-services/insights-common-typescript';
import { Uuid } from '../../../../types/Policy/Policy';

jest.mock('in-browser-download');
jest.mock('@redhat-cloud-services/insights-common-typescript', () => {
    const real = jest.requireActual('@redhat-cloud-services/insights-common-typescript');
    return {
        ...real,
        addDangerNotification: jest.fn()
    };
});

const mockParams = () => ({
    setPolicyWizardState: jest.fn(),
    exportAllPoliciesQuery: jest.fn(),
    mutateChangePolicyEnabled: jest.fn(),
    policyRows: {
        rows: [] as Array<PolicyRow>,
        onCollapse: jest.fn(),
        onSelect: jest.fn(),
        onSelectionChanged: jest.fn(),
        selectionCount: 0,
        clearSelection: jest.fn(),
        getSelected: jest.fn(),
        loadingSelected: false,
        selected: ImmutableContainerSet.include<string>(),
        removeSelection: jest.fn()
    },
    openPolicyToDelete: jest.fn()
});

const mockPolicy = (id: Uuid): PolicyRow => ({
    id,
    actions: [],
    conditions: '',
    ctime: new Date(),
    lastTriggered: new Date(),
    mtime: new Date(),
    isEnabled: false,
    name: 'etc',
    description: '',
    isOpen: false,
    isSelected: true
});

describe('src/pages/ListPage/hooks/useToolbarActions', () => {

    beforeEach(() => {
        inBrowserDownload.mockReset();
        (addDangerNotification as jest.Mock).mockReset();
    });

    it('createCustomPolicy calls setPolicyWizardState with new policy params', () => {
        const params = mockParams();
        const { result } = renderHook(() => useToolbarActions(params));
        expect(params.setPolicyWizardState).toHaveBeenCalledTimes(0);
        result.current.createCustomPolicy();
        expect(params.setPolicyWizardState).toHaveBeenCalledWith({
            isOpen: true,
            showCreateStep: true,
            template: undefined,
            isEditing: false
        });
    });

    it('onDeletePolicies calls openPolicyToDelete with the selection count', () => {
        const params = mockParams();
        params.policyRows.selectionCount = 33;
        const { result } = renderHook(() => useToolbarActions(params));
        expect(params.openPolicyToDelete).toHaveBeenCalledTimes(0);
        result.current.onDeletePolicies();
        expect(params.openPolicyToDelete).toHaveBeenCalledWith(33);
    });

    it('onDeletePolicies calls openPolicyToDelete with the policy when selection count is 1 and the selected policy is in the rows', () => {
        const params = mockParams();
        const policy = mockPolicy('foobar');
        params.policyRows.rows.push(policy);
        params.policyRows.selected = ImmutableContainerSet.include<string>().add('foobar');
        params.policyRows.selectionCount = 1;
        const { result } = renderHook(() => useToolbarActions(params));
        expect(params.openPolicyToDelete).toHaveBeenCalledTimes(0);
        result.current.onDeletePolicies();
        expect(params.openPolicyToDelete).toHaveBeenCalledWith(policy);
    });

    it('onDeletePolicies calls openPolicyToDelete with 1 when selection count is 1 and the selected policy is not in the rows', () => {
        const params = mockParams();
        params.policyRows.rows.push(mockPolicy('foobar'));
        params.policyRows.selected = ImmutableContainerSet.include('baz');
        params.policyRows.selectionCount = 1;
        const { result } = renderHook(() => useToolbarActions(params));
        expect(params.openPolicyToDelete).toHaveBeenCalledTimes(0);
        result.current.onDeletePolicies();
        expect(params.openPolicyToDelete).toHaveBeenCalledWith(1);
    });

    it('onDisablePolicies calls mutateChangePolicyEnabled with policies returned by getSelected', async () => {
        const params = mockParams();
        params.policyRows.getSelected.mockImplementation(() => Promise.resolve([
            'abc', 'def', 'foo', 'bar'
        ]));
        const { result } = renderHook(() => useToolbarActions(params));
        expect(params.mutateChangePolicyEnabled).toHaveBeenCalledTimes(0);
        expect(params.policyRows.getSelected).toHaveBeenCalledTimes(0);
        await result.current.onDisablePolicies();
        expect(params.policyRows.getSelected).toHaveBeenCalledTimes(1);
        expect(params.mutateChangePolicyEnabled).toHaveBeenCalledWith({
            shouldBeEnabled: false,
            policyIds: [ 'abc', 'def', 'foo', 'bar' ]
        });
    });

    it('onEnablePolicies calls mutateChangePolicyEnabled with policies returned by getSelected', async () => {
        const params = mockParams();
        params.policyRows.getSelected.mockImplementation(() => Promise.resolve([
            'abc', 'ret', 'foo', 'bax'
        ]));
        const { result } = renderHook(() => useToolbarActions(params));
        expect(params.mutateChangePolicyEnabled).toHaveBeenCalledTimes(0);
        expect(params.policyRows.getSelected).toHaveBeenCalledTimes(0);
        await result.current.onEnablePolicies();
        expect(params.policyRows.getSelected).toHaveBeenCalledTimes(1);
        expect(params.mutateChangePolicyEnabled).toHaveBeenCalledWith({
            shouldBeEnabled: true,
            policyIds: [ 'abc', 'ret', 'foo', 'bax' ]
        });
    });

    it('onExport calls exportAllPoliciesQuery', () => {
        const params = mockParams();
        params.exportAllPoliciesQuery.mockImplementation(() => Promise.resolve([]));
        const { result } = renderHook(() => useToolbarActions(params));

        expect(params.exportAllPoliciesQuery).toHaveBeenCalledTimes(0);
        result.current.onExport(undefined, ExporterType.JSON);
        expect(params.exportAllPoliciesQuery).toHaveBeenCalledTimes(1);
    });

    it('onExport calls inBrowserDownload with policies-date.json', async () => {
        const now = new Date('2020-02-12T06:06:06.000Z').getTime();
        jest.spyOn(Date, 'now').mockImplementation(() => now);
        const params = mockParams();
        params.exportAllPoliciesQuery.mockImplementation(() => Promise.resolve({
            payload: {
                type: 'PagedResponseOfPolicy',
                value: [
                    mockPolicy('foo'),
                    mockPolicy('faa'),
                    mockPolicy('fee')
                ],
                status: 200,
                errors: []
            }
        }));
        const { result } = renderHook(() => useToolbarActions(params));

        expect(params.exportAllPoliciesQuery).toHaveBeenCalledTimes(0);
        expect(inBrowserDownload).toHaveBeenCalledTimes(0);
        await result.current.onExport(undefined, ExporterType.JSON);
        expect(params.exportAllPoliciesQuery).toHaveBeenCalledTimes(1);
        expect(inBrowserDownload.mock.calls[0][1]).toEqual('policies-2020-12-02.json');
    });

    it('onExport calls addDangerNotification when no payload is found', async () => {
        const now = new Date('2020-02-12T06:06:06.000Z').getTime();
        jest.spyOn(Date, 'now').mockImplementation(() => now);
        const params = mockParams();
        params.exportAllPoliciesQuery.mockImplementation(() => Promise.resolve({}));
        const { result } = renderHook(() => useToolbarActions(params));

        expect(params.exportAllPoliciesQuery).toHaveBeenCalledTimes(0);
        expect(inBrowserDownload).toHaveBeenCalledTimes(0);
        expect(addDangerNotification).toHaveBeenCalledTimes(0);
        await result.current.onExport(undefined, ExporterType.JSON);
        expect(params.exportAllPoliciesQuery).toHaveBeenCalledTimes(1);
        expect(inBrowserDownload).toHaveBeenCalledTimes(0);
        expect(addDangerNotification).toHaveBeenCalledTimes(1);
    });
});
