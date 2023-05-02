import { PageSection } from '@patternfly/react-core';
import { ErrorState, Main, PageHeader, PageHeaderTitle, Section } from '@redhat-cloud-services/frontend-components';
import AsynComponent from '@redhat-cloud-services/frontend-components/AsyncComponent';
import { getInsights, InsightsEmailOptIn, Page, useSort } from '@redhat-cloud-services/insights-common-typescript';
import axios from 'axios';
import * as React from 'react';
import { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { usePrevious } from 'react-use';
import { style } from 'typestyle';

import { AppContext } from '../../app/AppContext';
import { PolicyTable } from '../../components/Policy/Table/PolicyTable';
import { PolicyToolbar } from '../../components/Policy/TableToolbar/PolicyTableToolbar';
import Config from '../../config/Config';
import { usePolicyFilter, usePolicyPage, usePolicyRows } from '../../hooks';
import { usePolicyToDelete } from '../../hooks/usePolicyToDelete';
import { Messages } from '../../properties/Messages';
import { useGetPoliciesQuery } from '../../services/useGetPolicies';
import { useMassChangePolicyEnabledMutation } from '../../services/useMassChangePolicyEnabled';
import { ActionType, Policy } from '../../types/Policy';
import { NewPolicy } from '../../types/Policy/Policy';
import { CreatePolicyWizard } from '../CreatePolicyWizard/CreatePolicyWizard';
import { DeletePolicy } from './DeletePolicy';
import { useListPageDelete } from './hooks/useListPageDelete';
import { useTableActionResolverCallback } from './hooks/useTableActionResolverCallback';
import { useToolbarActions } from './hooks/useToolbarActions';
import { policyTableError } from './PolicyTableError';
import { useGetListPagePolicies } from './useGetListPagePolicies';

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

const getPoliciesFromPayload = (payload: ReturnType<typeof useGetListPagePolicies>['payload']): Array<Policy> | undefined => {
    if (payload?.status === 200) {
        return payload.value.data;
    }

    return undefined;
};

const INVENTORY_TOTAL_FETCH_URL = '/api/inventory/v1/hosts';

const ListPage: React.FunctionComponent<unknown> = () => {

    const [ policyWizardState, setPolicyWizardState ] = React.useState<PolicyWizardState>({
        isOpen: false
    });

    const [ hasSystems, setHasSystems ] = React.useState(true);

    React.useEffect(() => {
        try {
            axios
            .get(`${INVENTORY_TOTAL_FETCH_URL}?page=1&per_page=1`)
            .then(({ data }) => {
                setHasSystems(data.total > 0);
            });
        } catch (e) {
            console.log(e);
        }
    }, [ hasSystems ]);

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

    const getPoliciesQueryCount = getPoliciesQuery.payload?.type === 'PagedResponseOfPolicy' ? getPoliciesQuery.payload.value.count : 0;

    const policyRows = usePolicyRows(
        getPoliciesFromPayload(getPoliciesQuery.payload),
        isLoading,
        getPoliciesQueryCount,
        policyPage.page
    );
    const {
        clearSelection,
        loadingSelected
    } = policyRows;

    isLoading = isLoading || loadingSelected;

    const { canReadPolicies, canWritePolicies } = appContext.rbac;

    const { query: getPoliciesQueryReload } = getPoliciesQuery;
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
        canWrite: canWritePolicies,
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
        if (canReadPolicies) {
            getPoliciesQueryReload();
        }
    }, [ canReadPolicies, getPoliciesQueryReload ]);

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
            <Helmet>
                <title>Policies | Red Hat Insights</title>
            </Helmet>
            <PageHeader>
                <PageHeaderTitle title={ Messages.pages.listPage.title } />
            </PageHeader>
            { !appContext.userSettings.isSubscribedForNotifications &&
            policyRows.rows.find(p => p.actions.find(a => a.type === ActionType.NOTIFICATION)) && (
                <PageSection className={ emailOptinPageClassName }>
                    <InsightsEmailOptIn
                        ouiaId="list-email-required"
                        content={ Messages.pages.listPage.emailOptIn }
                        insights={ getInsights() }
                        bundle="rhel"
                    />
                </PageSection>
            )}
            <Main>
                { getPoliciesQuery.hasPolicies === false || !hasSystems ? (
                    <AsynComponent
                        appName="dashboard"
                        module="./AppZeroState"
                        scope="dashboard"
                        ErrorComponent={ <ErrorState /> }
                        app="Policies"
                    />
                ) : (
                    <Section>
                        <PolicyToolbar
                            ouiaId="main-toolbar"
                            onCreatePolicy={ canWritePolicies ? toolbarActions.createCustomPolicy : undefined }
                            onDeletePolicy={ canWritePolicies ? toolbarActions.onDeletePolicies : undefined }
                            onEnablePolicy={ canWritePolicies ? toolbarActions.onEnablePolicies : undefined }
                            onDisablePolicy={ canWritePolicies ? toolbarActions.onDisablePolicies : undefined }
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
                            count={ getPoliciesQueryCount }
                            onExport={ toolbarActions.onExport }
                            showBottomPagination={ true }
                        >
                            <PolicyTable
                                ouiaId="main-table"
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
