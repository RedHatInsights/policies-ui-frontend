import * as React from 'react';
import { PolicyToolbar } from '../TableToolbar/PolicyTableToolbar';
import {
    UsePaginatedQueryResponse,
    UsePolicyFilterReturn,
    UsePolicyPageReturn,
    UsePolicyRowsReturn
} from '../../../hooks';
import { PolicyRow, PolicyTable } from '../Table/PolicyTable';
import { UsePolicySortReturn } from '../../../hooks/useSort';
import { Policy } from '../../../types/Policy';
import { useEffectOnce } from 'react-use';

export interface CopyFromPolicyProps {
    onSelect: (policy: Policy) => void;
    policyFilter: UsePolicyFilterReturn;
    policyPage: UsePolicyPageReturn;
    policySort: UsePolicySortReturn;
    policyQuery: UsePaginatedQueryResponse<Policy[]>;
    policyRows: UsePolicyRowsReturn;
}

export const CopyFromPolicy: React.FunctionComponent<CopyFromPolicyProps> = (props) => {

    const {
        policyFilter,
        policyPage,
        policySort,
        policyQuery: getPoliciesQuery,
        policyRows
    } = props;

    useEffectOnce(() => {
        if (!getPoliciesQuery.payload) {
            getPoliciesQuery.query();
        }
    });

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
                page={ policyPage.page.index }
                pageCount={ getPoliciesQuery.payload?.length }
                perPage={ policyPage.page.size }
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
