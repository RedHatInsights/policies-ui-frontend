import * as React from 'react';
import { useContext } from 'react';
import { IActions, IRowData } from '@patternfly/react-table';
import { Main, PageHeader, PageHeaderTitle, Section } from '@redhat-cloud-services/frontend-components';

import { PolicyTable } from '../../components/Policy/Table/PolicyTable';
import { useGetPoliciesQuery } from '../../services/Api';
import { PolicyToolbar } from '../../components/Policy/TableToolbar/PolicyTableToolbar';
import { CreatePolicyWizard } from './CreatePolicyWizard';
import { RbacContext } from '../../components/RbacContext';
import { policyTableError } from './PolicyTableError';
import { Policy } from '../../types/Policy';
import { DeletePolicy } from './DeletePolicy';
import { NewPolicy } from '../../types/Policy/Policy';
import { usePolicyFilter } from '../../hooks/usePolicyFilter';
import { usePolicyPage } from '../../hooks/usePolicyPage';
import { useSort } from '../../hooks/useSort';
import { usePolicyRows } from '../../hooks/usePolicyRows';
import { makeCopyOfPolicy } from '../../utils/PolicyAdapter';
import { PolicyFilterColumn } from '../../types/Policy/PolicyPaging';

type ListPageProps = {};

type PolicyWizardStateBase = {
    template: NewPolicy | undefined;
    showCreateStep: boolean;
};

type PolicyWizardStateOpen = {
    isOpen: true;
} & PolicyWizardStateBase;

type PolicyWizardStateClosed = {
    isOpen: false;
} & Partial<PolicyWizardStateBase>;

type PolicyWizardState = PolicyWizardStateClosed | PolicyWizardStateOpen;

const ListPage: React.FunctionComponent<ListPageProps> = (_props) => {

    const [ policyWizardState, setPolicyWizardState ] = React.useState<PolicyWizardState>({
        isOpen: false
    });
    const [ policyToDelete, setPolicyToDelete ] = React.useState<Policy[] | undefined>(undefined);
    const policyFilters = usePolicyFilter();
    const sort = useSort();
    const policyPage = usePolicyPage(policyFilters.debouncedFilters, undefined, sort.sortBy);
    const getPoliciesQuery = useGetPoliciesQuery(policyPage.page, false);
    const { canReadAll, canWriteAll } = useContext(RbacContext);
    const policyRows = usePolicyRows(getPoliciesQuery.payload);

    const { query: getPoliciesQueryReload } = getPoliciesQuery;

    const { changePage, currentPage } = policyPage;

    const onCloseDeletePolicy = React.useCallback((deleted: boolean) => {
        if (deleted) {
            getPoliciesQueryReload();
            if (policyToDelete?.length === getPoliciesQuery.payload?.length) {
                changePage(undefined, currentPage === 1 ? 1 : currentPage - 1);
            }
        }

        setPolicyToDelete(undefined);
    }, [ getPoliciesQueryReload, setPolicyToDelete, changePage, currentPage, policyToDelete, getPoliciesQuery.payload ]);

    const getPolicyFromPayload =  React.useCallback(
        (id: string) => getPoliciesQuery.payload?.find(policy => policy.id === id),
        [ getPoliciesQuery.payload ]);

    const tableActions: IActions = React.useMemo<IActions>(() => {
        if (!canWriteAll) {
            return [];
        }

        return [
            {
                title: 'Edit',
                onClick: (_event: React.MouseEvent, _rowIndex: number, rowData: IRowData) => {
                    const policy = getPolicyFromPayload(rowData.id);
                    if (policy) {
                        setPolicyWizardState({
                            isOpen: true,
                            template: policy,
                            showCreateStep: false
                        });
                    }
                }
            },
            {
                title: 'Duplicate',
                onClick: (_event: React.MouseEvent, _rowIndex: number, rowData: IRowData) => {
                    const policy = getPolicyFromPayload(rowData.id);
                    if (policy) {
                        setPolicyWizardState({
                            isOpen: true,
                            template: makeCopyOfPolicy(policy),
                            showCreateStep: false
                        });
                    }
                }
            },
            {
                title: 'Delete',
                onClick: (_event: React.MouseEvent, _rowIndex: number, rowData: IRowData) => {
                    const policy = getPolicyFromPayload(rowData.id);
                    if (policy) {
                        setPolicyToDelete([ policy ]);
                    }
                }
            }
        ];
    }, [ canWriteAll, setPolicyToDelete, getPolicyFromPayload ]);

    React.useEffect(() => {
        if (canReadAll) {
            getPoliciesQueryReload();
        }
    }, [ canReadAll, getPoliciesQueryReload ]);

    const createCustomPolicy = React.useCallback(() => {
        setPolicyWizardState({
            isOpen: true,
            showCreateStep: true,
            template: undefined
        });
    }, [ setPolicyWizardState ]);

    const closeCustomPolicyWizard = React.useCallback((policyCreated: boolean) => {
        if (policyCreated) {
            getPoliciesQueryReload();
        }

        setPolicyWizardState({
            isOpen: false
        });
    }, [ setPolicyWizardState, getPoliciesQueryReload ]);

    const policyTableErrorValue = React.useMemo(
        () => {
            return policyTableError(
                canReadAll,
                {
                    clearAllFiltersAndTryAgain: () => {
                        policyFilters.setFilters[PolicyFilterColumn.NAME]('');
                        policyFilters.setFilters[PolicyFilterColumn.DESCRIPTION]('');
                        policyFilters.setFilters[PolicyFilterColumn.IS_ACTIVE]({
                            disabled: false,
                            enabled: false
                        });
                        changePage(undefined, 1);
                    },
                    refreshPage: () => {
                        window.location.reload();
                    },
                    tryAgain: () => {
                        getPoliciesQueryReload();
                    }
                },
                getPoliciesQuery.error,
                getPoliciesQuery.status
            );
        },
        [
            canReadAll,
            getPoliciesQuery.error,
            getPoliciesQuery.status,
            policyFilters.setFilters,
            changePage,
            getPoliciesQueryReload
        ]
    );

    const onDeletePolicies = React.useCallback(
        () => setPolicyToDelete(policyRows.rows.filter(policy => policy.isSelected)),
        [ policyRows, setPolicyToDelete ]
    );

    return (
        <>
            <PageHeader>
                <PageHeaderTitle title="Custom policies"/>
            </PageHeader>
            <Main>
                <Section>
                    <PolicyToolbar
                        onCreatePolicy={ canWriteAll ? createCustomPolicy : undefined }
                        onDeletePolicy={ canWriteAll ? onDeletePolicies : undefined }
                        onPaginationChanged={ policyPage.changePage }
                        onPaginationSizeChanged={ policyPage.changeItemsPerPage }
                        onSelectionChanged={ policyRows.onSelectionChanged }
                        selectedCount={ policyRows.selectionCount }
                        page={ policyPage.currentPage }
                        pageCount={ getPoliciesQuery.payload?.length }
                        perPage={ policyPage.itemsPerPage }
                        showPerPageOptions={ true }
                        filterElements={ policyFilters.filters }
                        setFilterElements = { policyFilters.setFilters }
                        clearFilters={ policyFilters.clearFilterHandler }
                        count={ getPoliciesQuery.count }
                    />
                    <PolicyTable
                        policies={ policyRows.rows }
                        onCollapse={ policyRows.onCollapse }
                        onSelect={ policyRows.onSelect }
                        actions={ tableActions }
                        loading={ getPoliciesQuery.loading }
                        error={ policyTableErrorValue }
                        onSort={ sort.onSort }
                        sortBy={ sort.sortBy }
                    />
                </Section>
            </Main>
            { policyWizardState.isOpen && <CreatePolicyWizard
                isOpen={ policyWizardState.isOpen }
                close={ closeCustomPolicyWizard }
                initialValue={ policyWizardState.template }
                showCreateStep={ policyWizardState.showCreateStep }
            /> }
            <DeletePolicy onClose={ onCloseDeletePolicy } policies={ policyToDelete }/>
        </>
    );
};

export default ListPage;
