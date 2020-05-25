import * as React from 'react';
import { Uuid } from '../../../types/Policy/Policy';
import { Page } from '../../../types/Page';
import { UsePolicyPageReturn, UsePolicyRowsReturn } from '../../../hooks';
import { UsePolicyToDeleteResponse } from '../../../hooks/usePolicyToDelete';

type Params = {
    policyRows: UsePolicyRowsReturn;
    policyPage: UsePolicyPageReturn;
    policyToDelete: UsePolicyToDeleteResponse;
    reload: () => void;
    count: number;
};

export const useListPageDelete = (params: Params) => {

    const {
        rows, onSelect, removeSelection, clearSelection, selectionCount
    } = params.policyRows;

    const { changePage } = params.policyPage;
    const { index: currentPage, size: itemsPerPage } = params.policyPage.page;

    const { close, policy: singlePolicyToDelete } = params.policyToDelete;
    const { reload, count } = params;

    const onDeleted = React.useCallback((policyId: Uuid) => {
        const index = rows.findIndex(p => p.id === policyId);
        if (index === -1) {
            // The policy was not found on this page, but could be on other pages
            removeSelection(policyId);
        } else {
            onSelect(rows[index], index, false);
        }
    }, [ rows, onSelect, removeSelection ]);

    const onCloseDeletePolicy = React.useCallback((deleted: boolean) => {
        if (deleted) {
            reload();

            const deletePolicyCount = singlePolicyToDelete ? 1 : selectionCount;

            const lastPage = Page.lastPageForElements(
                count - deletePolicyCount,
                itemsPerPage
            );

            if (lastPage.index < currentPage) {
                changePage(undefined, lastPage.index);
            }

            clearSelection();
        }

        close();
    }, [
        reload, count, close, clearSelection, changePage,
        currentPage, selectionCount, itemsPerPage, singlePolicyToDelete
    ]);

    return {
        onDeleted,
        onCloseDeletePolicy
    };
};
