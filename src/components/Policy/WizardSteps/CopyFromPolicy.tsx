import * as React from 'react';
import { PolicyToolbar } from '../TableToolbar/PolicyTableToolbar';
import { usePolicyFilter, usePolicyPage } from '../../../hooks';
import { PolicyRow, PolicyTable } from '../Table/PolicyTable';
import { useGetPoliciesQuery } from '../../../services/Api';
import { useSort } from '../../../hooks/useSort';
import { usePolicyRows } from '../../../hooks/usePolicyRows';
import { Policy } from '../../../types/Policy';

interface CopyFromPolicyProps {
    onSelect: (policy: Policy) => void;
}

export const CopyFromPolicy: React.FunctionComponent<CopyFromPolicyProps> = (props) => {

    const policyFilter = usePolicyFilter();
    const policyPage = usePolicyPage(policyFilter.debouncedFilters, 5);
    const policySort = useSort();
    const getPoliciesQuery = useGetPoliciesQuery(policyPage.page, true);
    const policyRows = usePolicyRows(getPoliciesQuery.payload, getPoliciesQuery.loading);

    const propsOnSelect = props.onSelect;
    const payload = getPoliciesQuery.payload;
    const policyRowsOnSelect = policyRows.onSelect;

    const onSelectHandler = React.useCallback((policyRow: PolicyRow, index: number, isSelected: boolean) => {
        policyRowsOnSelect(policyRow, index, isSelected);
        if (payload && isSelected) {
            propsOnSelect(payload[index]);
        }
    }, [ propsOnSelect, policyRowsOnSelect, payload ]);

    return (
        <>
            <PolicyToolbar
                onPaginationChanged={ policyPage.changePage }
                page={ policyPage.currentPage }
                pageCount={ getPoliciesQuery.payload?.length }
                perPage={ policyPage.itemsPerPage }
                showPerPageOptions={ false }
                hideActions={ true }
                hideBulkSelect={ true }
                filterElements={ policyFilter.filters }
                setFilterElements={ policyFilter.setFilters }
                clearFilters={ policyFilter.clearFilterHandler }
                count={ getPoliciesQuery.count }
            />
            <PolicyTable
                columnsToShow={ [ 'radioSelect', 'name', 'actions' ] }
                policies={ policyRows.rows }
                onSelect={ onSelectHandler }
                loading={ getPoliciesQuery.loading }
                loadingRowCount={ 5 }
                onSort={ policySort.onSort }
                sortBy={ policySort.sortBy }
            />
        </>
    );
};
