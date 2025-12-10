import { Alert, Flex, Icon, PageSection, Popover, Text, TextContent, TextVariants } from '@patternfly/react-core';
import { ExternalLinkAltIcon, OutlinedQuestionCircleIcon } from '@patternfly/react-icons';
import { ErrorState, PageHeader, PageHeaderTitle, Section } from '@redhat-cloud-services/frontend-components';
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
import { Messages, useFeatureFlag } from '../../properties/Messages';
import { useGetPoliciesQuery } from '../../services/useGetPolicies';
import { useMassChangePolicyEnabledMutation } from '../../services/useMassChangePolicyEnabled';
import { ActionType, Policy } from '../../types/Policy';
import { NewPolicy } from '../../types/Policy/Policy';
import { CreatePolicyWizard } from '../CreatePolicyWizard/CreatePolicyWizard';
import { DeletePolicy } from './DeletePolicy';
import { ListPageEmptyState } from './EmptyState';
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
const RHEL_ONLY_FILTER = '?filter[system_profile][operating_system][RHEL][version][gte]=0';

const ListPage: React.FunctionComponent<unknown> = () => {

    const [ policyWizardState, setPolicyWizardState ] = React.useState<PolicyWizardState>({
        isOpen: false
    });

    const [ hasSystems, setHasSystems ] = React.useState(true);

    React.useEffect(() => {
        try {
            axios
            .get(`${INVENTORY_TOTAL_FETCH_URL}${RHEL_ONLY_FILTER}&page=1&per_page=1`)
            .then(({ data }) => {
                setHasSystems(data.total > 0);
            });
        } catch (e) {
            console.log(e);
        }
    }, [ setHasSystems ]);

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
    const isLightspeedEnabled = useFeatureFlag('platform.lightspeed-rebrand');

    return (
        <>
            {!hasSystems ?
                <AsynComponent
                    appId="policies_zero_state"
                    appName="dashboard"
                    module="./AppZeroState"
                    scope="dashboard"
                    ErrorComponent={ <ErrorState /> }
                    app="Policies"
                />
                :
                <>
                    <Helmet>
                        <title>Policies - Operations</title>
                    </Helmet>
                    <PageHeader>
                        <PageHeaderTitle title={ (
                            <React.Fragment>
                                {Messages.pages.listPage.title}
                                <Popover
                                    headerContent="About policies"
                                    bodyContent={ (
                                        <TextContent>
                                            <Flex direction={ { default: 'column' } }>
                                                <Text component={ TextVariants.p }>
                                                    Policies evaluate system configurations in your environment,
                                                    detect inventory changes, and can send notifications when changes occur.
                                                </Text>
                                                <Text component={ TextVariants.p }>
                                                    <a
                                                        rel="noreferrer"
                                                        target="_blank"
                                                        href={ 'https://docs.redhat.com/en/documentation/red_hat_insights/1-latest/html/' +
                                                            'monitoring_and_reacting_to_configuration_changes_using_policies' }
                                                    >
                                                        Monitoring and Reacting to Configuration Changes Using Policies
                                                        <Icon className="pf-v5-u-ml-xs">
                                                            <ExternalLinkAltIcon />
                                                        </Icon>
                                                    </a>
                                                </Text>
                                            </Flex>
                                        </TextContent>
                                    ) }
                                >
                                    <Icon>
                                        <OutlinedQuestionCircleIcon
                                            className="pf-v5-u-ml-sm"
                                            color="var(--pf-v5-global--secondary-color--100)"
                                            style={ { verticalAlign: '0', fontSize: 16, cursor: 'pointer' } }
                                        />
                                    </Icon>
                                </Popover>
                            </React.Fragment>
                        ) } />
                    </PageHeader>
                    <PageSection>
                        <Alert
                            variant="warning"
                            title="Application Decommissioning Notice"
                            isInline
                        >
                            <p>
                                This application will be decommissioned on <strong>December 12th, 2025</strong>. 
                                Please ensure you have exported any necessary data and transitioned to alternative solutions before this date.
                            </p>
                        </Alert>
                    </PageSection>
                    { !appContext.userSettings.isSubscribedForNotifications &&
                        policyRows.rows.find(p => p.actions.find(a => a.type === ActionType.NOTIFICATION)) && (
                        <PageSection className={ emailOptinPageClassName }>
                            <InsightsEmailOptIn
                                ouiaId="list-email-required"
                                content={ isLightspeedEnabled ? Messages.pages.listPage.emailOptInLightspeed : Messages.pages.listPage.emailOptIn }
                                insights={ getInsights() }
                                bundle="rhel"
                            />
                        </PageSection>
                    )}
                    <section className="pf-v5-l-page__main-section pf-v5-c-page__main-section">
                        {getPoliciesQuery.hasPolicies === false ?
                            (
                                <ListPageEmptyState
                                    createPolicy={ canWritePolicies ? toolbarActions.createCustomPolicy : undefined }
                                />
                            )
                            : (
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
                    </section>
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
            }

        </>
    );
};

export default ListPage;
