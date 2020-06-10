import { renderHook } from '@testing-library/react-hooks';
import { useListPageDelete } from '../useListPageDelete';
import { ImmutableContainerSet } from '../../../../types/ImmutableContainerSet';
import { Page } from '../../../../types/Page';
import { PolicyRow } from '../../../../components/Policy/Table/PolicyTable';
import { Uuid } from '../../../../types/Policy/Policy';
import { UsePolicyToDeleteResponse } from '../../../../hooks/usePolicyToDelete';
import { UsePolicyPageReturn } from '../../../../hooks';

const mockParams = () => ({
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
    policyPage: {
        changePage: jest.fn(),
        changeItemsPerPage: jest.fn(),
        page: Page.defaultPage()
    } as UsePolicyPageReturn,
    policyToDelete: {
        open: jest.fn(),
        close: jest.fn(),
        isOpen: true,
        count: 0
    } as UsePolicyToDeleteResponse,
    reload: jest.fn(),
    count: 0
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

describe('src/pages/ListPage/hooks/useTableActionResolverCallback', () => {
    it('Should return callback onCloseDeletePolicy', () => {
        const params = mockParams();
        const { result } = renderHook(() => useListPageDelete(params));
        expect(result.current.onCloseDeletePolicy).toBeInstanceOf(Function);
    });

    it('Should return callback onDeleted', () => {
        const params = mockParams();
        const { result } = renderHook(() => useListPageDelete(params));
        expect(result.current.onDeleted).toBeInstanceOf(Function);
    });

    it('onDeleted should call removeSelection if the given policy is not found in rows', () => {
        const params = mockParams();
        const { result } = renderHook(() => useListPageDelete(params));
        expect(params.policyRows.removeSelection).toHaveBeenCalledTimes(0);
        result.current.onDeleted('foobar');
        expect(params.policyRows.removeSelection).toHaveBeenCalledWith('foobar');
    });

    it('onDeleted should call onSelect if the given policy is found in rows', () => {
        const params = mockParams();
        params.policyRows.rows = [
            mockPolicy('foobar')
        ];
        const { result } = renderHook(() => useListPageDelete(params));
        expect(params.policyRows.onSelect).toHaveBeenCalledTimes(0);
        result.current.onDeleted('foobar');
        expect(params.policyRows.onSelect).toHaveBeenCalledWith(params.policyRows.rows[0], 0, false);
    });

    it('onCloseDeletePolicy should call close all the times', () => {
        const params = mockParams();
        const { result } = renderHook(() => useListPageDelete(params));
        expect(params.policyToDelete.close).toHaveBeenCalledTimes(0);
        result.current.onCloseDeletePolicy(false);
        expect(params.policyToDelete.close).toHaveBeenCalledTimes(1);
        result.current.onCloseDeletePolicy(true);
        expect(params.policyToDelete.close).toHaveBeenCalledTimes(2);
        result.current.onCloseDeletePolicy(false);
        expect(params.policyToDelete.close).toHaveBeenCalledTimes(3);
    });

    it('onCloseDeletePolicy should call reload only when delete is true', () => {
        const params = mockParams();
        const { result } = renderHook(() => useListPageDelete(params));
        expect(params.reload).toHaveBeenCalledTimes(0);
        result.current.onCloseDeletePolicy(false);
        expect(params.reload).toHaveBeenCalledTimes(0);
        result.current.onCloseDeletePolicy(true);
        expect(params.reload).toHaveBeenCalledTimes(1);
        result.current.onCloseDeletePolicy(false);
        expect(params.reload).toHaveBeenCalledTimes(1);
    });

    it('onCloseDeletePolicy should call clearSelection only when delete is true', () => {
        const params = mockParams();
        const { result } = renderHook(() => useListPageDelete(params));
        expect(params.policyRows.clearSelection).toHaveBeenCalledTimes(0);
        result.current.onCloseDeletePolicy(false);
        expect(params.policyRows.clearSelection).toHaveBeenCalledTimes(0);
        result.current.onCloseDeletePolicy(true);
        expect(params.policyRows.clearSelection).toHaveBeenCalledTimes(1);
        result.current.onCloseDeletePolicy(false);
        expect(params.policyRows.clearSelection).toHaveBeenCalledTimes(1);
    });

    it('onCloseDeletePolicy should call changePage when we are on a no longer valid page (single delete)', () => {
        const params = mockParams();
        params.policyToDelete = {
            ...params.policyToDelete,
            policy: mockPolicy('foo')
        };
        params.policyPage = {
            ...params.policyPage,
            page: Page.of(3, 5)
        };
        params.count = 11;

        const { result } = renderHook(() => useListPageDelete(params));
        expect(params.policyPage.changePage).toHaveBeenCalledTimes(0);
        result.current.onCloseDeletePolicy(true);
        expect(params.policyPage.changePage).toHaveBeenCalledWith(undefined, 2);
    });

    it('onCloseDeletePolicy should call changePage when we are on a no longer valid page (multiple delete)', () => {
        const params = mockParams();
        params.policyRows = {
            ...params.policyRows,
            selectionCount: 10
        };
        params.policyPage = {
            ...params.policyPage,
            page: Page.of(5, 5)
        };
        params.count = 25;

        const { result } = renderHook(() => useListPageDelete(params));
        expect(params.policyPage.changePage).toHaveBeenCalledTimes(0);
        result.current.onCloseDeletePolicy(true);
        expect(params.policyPage.changePage).toHaveBeenCalledWith(undefined, 3);
    });

    it('onCloseDeletePolicy should not call changePage when we are still on a valid page', () => {
        const params = mockParams();
        params.policyRows = {
            ...params.policyRows,
            selectionCount: 2
        };
        params.policyPage = {
            ...params.policyPage,
            page: Page.of(5, 5)
        };
        params.count = 25;

        const { result } = renderHook(() => useListPageDelete(params));
        expect(params.policyPage.changePage).toHaveBeenCalledTimes(0);
        result.current.onCloseDeletePolicy(true);
        expect(params.policyPage.changePage).toHaveBeenCalledTimes(0);
    });
});
