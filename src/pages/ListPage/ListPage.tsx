import * as React from 'react';
import { useContext } from 'react';
import { PageSection } from '@patternfly/react-core';
import { Main, PageHeader, PageHeaderTitle, Section } from '@redhat-cloud-services/frontend-components';

import { PolicyTable } from '../../components/Policy/Table/PolicyTable';
import { PolicyToolbar } from '../../components/Policy/TableToolbar/PolicyTableToolbar';
import { CreatePolicyWizard } from '../CreatePolicyWizard/CreatePolicyWizard';
import { AppContext } from '../../app/AppContext';
import { policyTableError } from './PolicyTableError';
import { ActionType, Policy } from '../../types/Policy';
import { DeletePolicy } from './DeletePolicy';
import { NewPolicy } from '../../types/Policy/Policy';
import { usePolicyFilter, usePolicyPage, usePolicyRows } from '../../hooks';
import { useSort, Page, InsightsEmailOptIn, getInsights } from '@redhat-cloud-services/insights-common-typescript';
import { Messages } from '../../properties/Messages';
import { style } from 'typestyle';
import { ListPageEmptyState } from './EmptyState';
import { usePrevious } from 'react-use';
import { useGetPoliciesQuery } from '../../services/useGetPolicies';
import { usePolicyToDelete } from '../../hooks/usePolicyToDelete';
import { useMassChangePolicyEnabledMutation } from '../../services/useMassChangePolicyEnabled';
import { useGetListPagePolicies } from './useGetListPagePolicies';
import { useTableActionResolverCallback } from './hooks/useTableActionResolverCallback';
import { useListPageDelete } from './hooks/useListPageDelete';
import { useToolbarActions } from './hooks/useToolbarActions';
import Config from '../../config/Config';

type ListPageProps = {};

type PolicyWizardStateBase = {
    template: NewPolicy | undefined;
    showCreateStep: boolean;
    isEditing: boolean;
};

type PolicyWizardStateOpen = {
    isOpen: true;
} & PolicyWizardStateBase;

type PolicyWizardStateClosed = {
    isOpen: false;
} & Partial<PolicyWizardStateBase>;

export type PolicyWizardState = PolicyWizardStateClosed | PolicyWizardStateOpen;

const emailOptinPageClassName = style({
    paddingBottom: 0
});

const getPoliciesFromPayload = (payload: unknown, status: number | undefined): Array<Policy> | undefined => {
    if (status === 200 || status === 404) {
        return payload as Array<Policy>;
    }

    return undefined;
};

const ListPage: React.FunctionComponent<ListPageProps> = (_props) => {

    const [ policyWizardState, setPolicyWizardState ] = React.useState<PolicyWizardState>({
        isOpen: false
    });

    const changePolicyEnabledMutation = useMassChangePolicyEnabledMutation();
    const policyFilters = usePolicyFilter();
    const sort = useSort();
    const policyPage = usePolicyPage(policyFilters.debouncedFilters, Config.defaultElementsPerPage, sort.sortBy);
    const getPoliciesQuery = useGetListPagePolicies(policyPage.page);
    const { query: exportAllPoliciesQuery } = useGetPoliciesQuery(Page.of(
        0,
        Page.NO_SIZE,
        policyPage.page.filter,
        policyPage.page.sort
    ), false);
    const policyToDelete = usePolicyToDelete();
    const appContext = useContext(AppContext);

    let isLoading = getPoliciesQuery.loading || changePolicyEnabledMutation.loading;

    const policyRows = usePolicyRows(
        getPoliciesFromPayload(getPoliciesQuery.payload, getPoliciesQuery.status),
        isLoading,
        getPoliciesQuery.count,
        policyPage.page
    );
    const {
        clearSelection,
        loadingSelected
    } = policyRows;

    isLoading = isLoading || loadingSelected;

    const { canWriteAll, canReadAll } = appContext.rbac;

    const { query: getPoliciesQueryReload, count: getPoliciesQueryCount } = getPoliciesQuery;
    const { mutate: mutateChangePolicyEnabled, loading: loadingChangePolicyEnabled } = changePolicyEnabledMutation;

    const { open: openPolicyToDelete } = policyToDelete;

    const prevLoadingChangePolicyEnabled = usePrevious(loadingChangePolicyEnabled);

    React.useEffect(() => {
        clearSelection();
    }, [ policyFilters.debouncedFilters, clearSelection ]);

    React.useEffect(() => {
        if (prevLoadingChangePolicyEnabled === true && !loadingChangePolicyEnabled) {
            getPoliciesQueryReload();
        }
    }, [ loadingChangePolicyEnabled, getPoliciesQueryReload, prevLoadingChangePolicyEnabled ]);

    const listPageDelete = useListPageDelete({
        policyPage,
        policyRows,
        policyToDelete,
        reload: getPoliciesQueryReload,
        count: getPoliciesQueryCount
    });

    const tableActionsResolver = useTableActionResolverCallback({
        canWriteAll,
        openPolicyToDelete,
        mutateChangePolicyEnabled,
        setPolicyWizardState
    });

    const toolbarActions = useToolbarActions({
        setPolicyWizardState,
        policyRows,
        openPolicyToDelete,
        mutateChangePolicyEnabled,
        exportAllPoliciesQuery
    });

    React.useEffect(() => {
        if (canReadAll) {
            getPoliciesQueryReload();
        }
    }, [ canReadAll, getPoliciesQueryReload ]);

    const closePolicyWizard = React.useCallback((policy: NewPolicy | undefined) => {
        const refreshUserSettings = appContext.userSettings.refresh;
        if (policy) {
            getPoliciesQueryReload();
            refreshUserSettings();
        }

        setPolicyWizardState({
            isOpen: false
        });
    }, [ appContext.userSettings.refresh, setPolicyWizardState, getPoliciesQueryReload ]);

    const policyTableErrorValue = React.useMemo(
        () => {
            return policyTableError(
                {
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
            getPoliciesQuery.error,
            getPoliciesQuery.status,
            getPoliciesQueryReload
        ]
    );

    return (
        <>
            <PageHeader>
                <PageHeaderTitle title={ Messages.pages.listPage.title }/>
            </PageHeader>
            { !appContext.userSettings.isSubscribedForNotifications &&
            policyRows.rows.find(p => p.actions.find(a => a.type === ActionType.EMAIL)) && (
                <PageSection className={ emailOptinPageClassName }>
                    <InsightsEmailOptIn content={ Messages.pages.listPage.emailOptIn } insights={ getInsights() } />
                </PageSection>
            )}
            <Main>
                { getPoliciesQuery.hasPolicies === false ? (
                    <ListPageEmptyState
                        createPolicy={ canWriteAll ? toolbarActions.createCustomPolicy : undefined }
                    />
                ) : (
                    <Section>
                        <PolicyToolbar
                            onCreatePolicy={ canWriteAll ? toolbarActions.createCustomPolicy : undefined }
                            onDeletePolicy={ canWriteAll ? toolbarActions.onDeletePolicies : undefined }
                            onEnablePolicy={ canWriteAll ? toolbarActions.onEnablePolicies : undefined }
                            onDisablePolicy={ canWriteAll ? toolbarActions.onDisablePolicies : undefined }
                            onPaginationChanged={ policyPage.changePage }
                            onPaginationSizeChanged={ policyPage.changeItemsPerPage }
                            onSelectionChanged={ policyRows.onSelectionChanged }
                            selectedCount={ policyRows.selectionCount }
                            page={ policyPage.page.index }
                            pageCount={ policyRows.rows.length }
                            perPage={ policyPage.page.size }
                            showPerPageOptions={ true }
                            filters={ policyFilters.filters }
                            setFilters= { policyFilters.setFilters }
                            clearFilters={ policyFilters.clearFilter }
                            count={ getPoliciesQuery.count }
                            onExport={ toolbarActions.onExport }
                            showBottomPagination={ true }
                        >
                            <PolicyTable
                                policies={ policyRows.rows }
                                onCollapse={ policyRows.onCollapse }
                                onSelect={ policyRows.onSelect }
                                actionResolver={ tableActionsResolver }
                                loading={ isLoading }
                                error={ policyTableErrorValue }
                                onSort={ sort.onSort }
                                sortBy={ sort.sortBy }
                                linkToDetailPolicy={ true }
                            />
                        </PolicyToolbar>
                    </Section>
                )}
            </Main>
            { policyWizardState.isOpen && <CreatePolicyWizard
                isOpen={ policyWizardState.isOpen }
                close={ closePolicyWizard }
                initialValue={ policyWizardState.template }
                showCreateStep={ policyWizardState.showCreateStep }
                policiesExist={ getPoliciesQuery.hasPolicies === true }
                isEditing={ policyWizardState.isEditing }
            /> }
            { policyToDelete.isOpen && <DeletePolicy
                onClose={ listPageDelete.onCloseDeletePolicy }
                onDeleted={ listPageDelete.onDeleted }
                loading={ policyRows.loadingSelected }
                count={ policyToDelete.count }
                getPolicies={ policyRows.getSelected }
                policy={ policyToDelete.policy }
            />
            }
        </>
    );
};

export default ListPage;
