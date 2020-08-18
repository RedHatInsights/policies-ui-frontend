import * as React from 'react';
import { PolicyToolbar } from '../TableToolbar/PolicyTableToolbar';
import { PolicyRow, PolicyTable } from '../Table/PolicyTable';
import { Policy } from '../../../types/Policy';
import { useEffectOnce } from 'react-use';
import { CreatePolicyStepContextType } from './CreatePolicyPolicyStep/Context';

type UsedAttributes = 'policyFilter' | 'policyPage' | 'policySort' | 'policyQuery' | 'policyRows';
export interface CopyFromPolicyProps extends Pick<CreatePolicyStepContextType, UsedAttributes>{
    onSelect: (policy: Policy) => void;
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
                ouiaId="copy-from-policy-toolbar"
                onPaginationChanged={ policyPage.changePage }
                page={ policyPage.page.index }
                pageCount={ getPoliciesQuery.payload?.length }
                perPage={ policyPage.page.size }
                showPerPageOptions={ false }
                hideActions={ true }
                hideBulkSelect={ true }
                filters={ policyFilter.filters }
                setFilters={ policyFilter.setFilters }
                clearFilters={ policyFilter.clearFilter }
                count={ getPoliciesQuery.count }
            >
                <PolicyTable
                    ouiaId="copy-from-policy-table"
                    columnsToShow={ [ 'radioSelect', 'name', 'actions' ] }
                    policies={ policyRows.rows }
                    onSelect={ onSelectHandler }
                    loading={ getPoliciesQuery.loading }
                    loadingRowCount={ 5 }
                    onSort={ policySort.onSort }
                    sortBy={ policySort.sortBy }
                    linkToDetailPolicy={ false }
                />
            </PolicyToolbar>
        </>
    );
};
