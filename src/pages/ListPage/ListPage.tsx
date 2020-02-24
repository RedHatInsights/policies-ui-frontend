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
import { SavingMode } from '../../components/Policy/PolicyWizard';
import { NewPolicy } from '../../types/Policy/Policy';
import { usePolicyFilter } from '../../hooks/usePolicyFilter';
import { usePolicyPage } from '../../hooks/usePolicyPage';
import { useSort } from '../../hooks/useSort';
import { usePolicyRows } from '../../hooks/usePolicyRows';

type ListPageProps = {};

type PolicyWizardStateBase = {
    template: NewPolicy | undefined;
    savingMode: SavingMode;
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

    const onCloseDeletePolicy = React.useCallback((deleted: boolean) => {
        if (deleted) {
            getPoliciesQueryReload();
            if (policyToDelete?.length === getPoliciesQuery.payload?.length) {
                setCurrentPage(prevPage => prevPage === 1 ? prevPage : prevPage - 1);
            }
        }

        setPolicyToDelete(undefined);
    }, [ getPoliciesQueryReload, setPolicyToDelete, setCurrentPage, policyToDelete, getPoliciesQuery.payload ]);

    const getPolicyFromPayload =  React.useCallback(
        (id: number) => getPoliciesQuery.payload?.find(policy => policy.id === id),
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
                            savingMode: SavingMode.UPDATE
                        });
                    }
                }
            },
            {
                title: 'Duplicate',
                onClick: () => alert('Duplicate')
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
            savingMode: SavingMode.CREATE,
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
        () => policyTableError(canReadAll, getPoliciesQuery.error, getPoliciesQuery.status),
        [ canReadAll, getPoliciesQuery.error, getPoliciesQuery.status ]
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
                savingMode={ policyWizardState.savingMode }
            /> }
            <DeletePolicy onClose={ onCloseDeletePolicy } policies={ policyToDelete }/>
        </>
    );
};

export default ListPage;
