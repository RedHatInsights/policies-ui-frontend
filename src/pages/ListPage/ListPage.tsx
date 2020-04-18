import * as React from 'react';
import { useContext } from 'react';
import { PageSection } from '@patternfly/react-core';
import { Main, PageHeader, PageHeaderTitle, Section } from '@redhat-cloud-services/frontend-components';

import { PolicyRow, PolicyTable } from '../../components/Policy/Table/PolicyTable';
import { useGetPoliciesQuery } from '../../services/Api';
import { PolicyToolbar } from '../../components/Policy/TableToolbar/PolicyTableToolbar';
import { CreatePolicyWizard } from './CreatePolicyWizard';
import { AppContext } from '../../app/AppContext';
import { policyTableError } from './PolicyTableError';
import { ActionType, Policy } from '../../types/Policy';
import { DeletePolicy } from './DeletePolicy';
import { NewPolicy } from '../../types/Policy/Policy';
import { usePolicyFilter } from '../../hooks/usePolicyFilter';
import { usePolicyPage } from '../../hooks/usePolicyPage';
import { useSort } from '../../hooks/useSort';
import { usePolicyRows } from '../../hooks/usePolicyRows';
import { makeCopyOfPolicy } from '../../utils/PolicyAdapter';
import { PolicyFilterColumn } from '../../types/Policy/PolicyPaging';
import { EmailOptIn } from '../../components/EmailOptIn/EmailOptIn';
import { Messages } from '../../properties/Messages';
import { useBulkChangePolicyEnabledMutation } from '../../services/useChangePolicyEnabled';
import { style } from 'typestyle';
import { useFacts } from '../../hooks/useFacts';
import { ListPageEmptyState } from './EmptyState';
import { usePrevious } from 'react-use';

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

const emailOptinPageClassName = style({
    paddingBottom: 0
});

const ListPage: React.FunctionComponent<ListPageProps> = (_props) => {

    const [ policyWizardState, setPolicyWizardState ] = React.useState<PolicyWizardState>({
        isOpen: false
    });
    const [ policyToDelete, setPolicyToDelete ] = React.useState<Policy[]>();
    const bulkChangePolicyEnabledMutation = useBulkChangePolicyEnabledMutation();
    const policyFilters = usePolicyFilter();
    const sort = useSort();
    const policyPage = usePolicyPage(policyFilters.debouncedFilters, undefined, sort.sortBy);
    const getPoliciesQuery = useGetPoliciesQuery(policyPage.page, false);
    const appContext = useContext(AppContext);

    const isLoading = getPoliciesQuery.loading || bulkChangePolicyEnabledMutation.loading;

    const policyRows = usePolicyRows(getPoliciesQuery.payload, isLoading);
    const facts = useFacts();

    const { canWriteAll, canReadAll } = appContext.rbac;

    const { query: getPoliciesQueryReload } = getPoliciesQuery;
    const { mutate: mutateChangePolicyEnabled, loading: loadingChangePolicyEnabled } = bulkChangePolicyEnabledMutation;

    const { changePage, currentPage } = policyPage;

    React.useEffect(() => {
        if (loadingChangePolicyEnabled === false) {
            getPoliciesQueryReload();
        }
    }, [ loadingChangePolicyEnabled, getPoliciesQueryReload ]);

    const onCloseDeletePolicy = React.useCallback((deleted: boolean) => {
        if (deleted) {
            getPoliciesQueryReload();
            if (policyToDelete?.length === getPoliciesQuery.payload?.length) {
                changePage(undefined, currentPage === 1 ? 1 : currentPage - 1);
            }
        }

        setPolicyToDelete(undefined);
    }, [ getPoliciesQueryReload, setPolicyToDelete, changePage, currentPage, policyToDelete, getPoliciesQuery.payload ]);

    const switchPolicyEnabled = (policy: Policy) => ({ policyId: policy.id, shouldBeEnabled: !policy.isEnabled });

    const tableActionsResolver = React.useCallback((policy: PolicyRow) => {
        if (!canWriteAll) {
            return [];
        }

        return [
            {
                title: `${policy.isEnabled ? 'Disable' : 'Enable'} policy`,
                onClick: () => {
                    mutateChangePolicyEnabled([ policy ].map(switchPolicyEnabled));
                }
            },
            {
                title: 'Edit',
                onClick: () => {
                    setPolicyWizardState({
                        isOpen: true,
                        template: policy,
                        showCreateStep: false
                    });
                }
            },
            {
                title: 'Duplicate',
                onClick: () => {
                    setPolicyWizardState({
                        isOpen: true,
                        template: makeCopyOfPolicy(policy),
                        showCreateStep: false
                    });
                }
            },
            {
                title: 'Delete',
                onClick: () => {
                    setPolicyToDelete([ policy ]);
                }
            }
        ];
    }, [ canWriteAll, setPolicyToDelete, mutateChangePolicyEnabled ]);

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

    const selectedPolicies = React.useCallback(() => policyRows.rows.filter(policy => policy.isSelected), [ policyRows ]);

    const onDeletePolicies = React.useCallback(
        () => setPolicyToDelete(selectedPolicies()),
        [ selectedPolicies, setPolicyToDelete ]
    );

    const onDisablePolicies = React.useCallback(
        () => mutateChangePolicyEnabled(selectedPolicies().map(p => ({ policyId: p.id, shouldBeEnabled: false }))),
        [ selectedPolicies, mutateChangePolicyEnabled ]
    );

    const onEnablePolicies = React.useCallback(
        () => mutateChangePolicyEnabled(selectedPolicies().map(p => ({ policyId: p.id, shouldBeEnabled: true }))),
        [ selectedPolicies, mutateChangePolicyEnabled ]
    );

    const prevIsClear = usePrevious(policyFilters.isClear);
    const prevPage = usePrevious(policyPage.currentPage);
    const willLoad = React.useMemo<boolean>(() => {
        // Just cleared the filters, the query will trigger in next step assume we are loading now.
        if (!getPoliciesQuery.loading && (prevIsClear !== policyFilters.isClear || prevPage !== policyPage.currentPage)) {
            return true;
        }

        return getPoliciesQuery.loading;
    }, [ getPoliciesQuery.loading, policyFilters.isClear, policyPage.currentPage, prevIsClear, prevPage ]);

    const onFirstPageWithNoFilter = policyFilters.isClear && policyPage.currentPage === 1;
    const noPolicies = onFirstPageWithNoFilter && !willLoad && getPoliciesQuery.status === 404;

    return (
        <>
            <PageHeader>
                <PageHeaderTitle title={ Messages.pages.listPage.title }/>
            </PageHeader>
            { appContext.userSettings &&
            !appContext.userSettings.dailyEmail &&
            getPoliciesQuery.payload &&
            getPoliciesQuery.payload.find(p => p.actions.find(a => a.type === ActionType.EMAIL)) && (
                <PageSection className={ emailOptinPageClassName }>
                    <EmailOptIn content={ Messages.pages.listPage.emailOptIn } />
                </PageSection>
            )}
            <Main>
                { noPolicies ? (
                    <ListPageEmptyState
                        createPolicy={ canWriteAll ? createCustomPolicy : undefined }
                    />
                ) : (
                    <Section>
                        <PolicyToolbar
                            onCreatePolicy={ canWriteAll ? createCustomPolicy : undefined }
                            onDeletePolicy={ canWriteAll ? onDeletePolicies : undefined }
                            onEnablePolicy={ canWriteAll ? onEnablePolicies : undefined }
                            onDisablePolicy={ canWriteAll ? onDisablePolicies : undefined }
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
                            actionResolver={ tableActionsResolver }
                            loading={ isLoading || willLoad }
                            error={ policyTableErrorValue }
                            onSort={ sort.onSort }
                            sortBy={ sort.sortBy }
                        />
                    </Section>
                )}
            </Main>
            { policyWizardState.isOpen && <CreatePolicyWizard
                isOpen={ policyWizardState.isOpen }
                close={ closeCustomPolicyWizard }
                initialValue={ policyWizardState.template }
                showCreateStep={ policyWizardState.showCreateStep }
                policiesExist={ getPoliciesQuery.count > 0 ? true : false }
                facts={ facts }
            /> }
            <DeletePolicy onClose={ onCloseDeletePolicy } policies={ policyToDelete }/>
        </>
    );
};

export default ListPage;
