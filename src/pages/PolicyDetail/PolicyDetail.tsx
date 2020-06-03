import * as React from 'react';
import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import {
    Breadcrumb,
    BreadcrumbItem,
    Split,
    SplitItem,
    Stack,
    StackItem,
    Title
} from '@patternfly/react-core';
import { useParams, useHistory } from 'react-router-dom';
import inBrowserDownload from 'in-browser-download';
import { linkTo } from '../../Routes';
import { BreadcrumbLinkItem } from '../../components/Wrappers/BreadcrumbLinkItem';
import { useGetPolicyParametrizedQuery } from '../../services/useGetPolicy';
import { ExpandedContent } from '../../components/Policy/Table/ExpandedContent';
import { Section } from '../../components/FrontendComponents/Section';
import { style } from 'typestyle';
import { useGetPolicyTriggersParametrizedQuery } from '../../services/useGetPolicyTriggers';
import { TriggerTable } from '../../components/Trigger/Table';
import { useSort } from '../../hooks/useSort';
import { TriggerTableToolbar } from '../../components/Trigger/TableToolbar';
import { CreatePolicyWizard } from '../CreatePolicyWizard/CreatePolicyWizard';
import { useContext } from 'react';
import { AppContext } from '../../app/AppContext';
import { PolicyDetailSkeleton } from './Skeleton';
import { PolicyDetailEmptyState } from './EmptyState';
import { PolicyDetailErrorState } from './ErrorState';
import { PolicyDetailIsEnabled } from './IsEnabled';
import { Policy } from '../../types/Policy';
import { NoPermissionsPage } from '../NoPermissions/NoPermissionsPage';
import { usePagedTriggers } from './hooks/usePagedTriggers';
import { useTriggerPage } from './hooks/useTriggerPage';
import { useTriggerFilter } from './hooks/useTriggerFilter';
import { ExporterType, exporterTypeFromString } from '../../utils/exporters/Type';
import { format } from 'date-fns';
import { triggerExporterFactory } from '../../utils/exporters/Trigger/Factory';
import { PolicyDetailTriggerEmptyState } from './TriggerEmptyState';
import { PolicyDetailActions } from './Actions';
import { useMassChangePolicyEnabledMutation } from '../../services/useMassChangePolicyEnabled';
import { assertNever } from '../../utils/Assert';
import { makeCopyOfPolicy } from '../../types/adapters/PolicyAdapter';
import { NewPolicy, Uuid } from '../../types/Policy/Policy';

const recentTriggerVersionTitleClassname = style({
    paddingBottom: 8,
    paddingTop: 16
});

type PolicyDetailWizardState = {
    isOpen: boolean;
    initialValue: NewPolicy | undefined;
    isEditing: boolean;
};

enum PolicyDetailWizardAction {
    EDIT,
    DUPLICATE,
    CLOSE
}

const closeState: PolicyDetailWizardState = {
    isEditing: false,
    initialValue: undefined,
    isOpen: false
};

type PolicyState = {
    policyId: Uuid;
    policy: Policy | undefined;
};

export const PolicyDetail: React.FunctionComponent = () => {

    const { policyId: policyIdFromUrl } = useParams<{
        policyId: string;
    }>();
    const history = useHistory();
    const [ policyState, setPolicyState ] = React.useState<PolicyState>({
        policyId: policyIdFromUrl,
        policy: undefined
    });

    const { policyId, policy } = policyState;

    const appContext = useContext(AppContext);
    const { canWriteAll, canReadAll } = appContext.rbac;

    const getPolicyQuery = useGetPolicyParametrizedQuery();
    const getTriggers = useGetPolicyTriggersParametrizedQuery();
    const triggerFilter = useTriggerFilter();
    const changePolicyEnabled = useMassChangePolicyEnabledMutation();

    const sort = useSort();
    const {
        page,
        onPaginationChanged
    } = useTriggerPage(sort.sortBy, triggerFilter.debouncedFilters);

    const { count, pagedTriggers, processedTriggers, rawCount } = usePagedTriggers(getTriggers.payload, page);

    const [ policyWizardState, policyWizardDispatch ] = React.useReducer((_prev, action: PolicyDetailWizardAction): PolicyDetailWizardState => {
        if (!policy) {
            return closeState;
        }

        switch (action) {
            case PolicyDetailWizardAction.CLOSE:
                return closeState;
            case PolicyDetailWizardAction.DUPLICATE:
                return {
                    isEditing: false,
                    initialValue: makeCopyOfPolicy(policy),
                    isOpen: true
                };
            case PolicyDetailWizardAction.EDIT:
                return {
                    isEditing: true,
                    initialValue: policy,
                    isOpen: true
                };
            default:
                assertNever(action);
        }

        return closeState;
    }, closeState);

    React.useEffect(() => {
        const query = getTriggers.query;
        if (policyId) {
            query(policyId);
        }
    }, [ policyId, getTriggers.query ]);

    React.useEffect(() => {
        history.push(linkTo.policyDetail(policyId));
    }, [ history, policyId ]);

    React.useEffect(() => {
        const query = getPolicyQuery.query;
        if (policyId !== policy?.id) {
            query(policyId);
        }
    }, [ policyId, getPolicyQuery.query, policy ]);

    React.useEffect(() => {
        if (!getPolicyQuery.error && getPolicyQuery.payload) {
            setPolicyState({
                policyId: getPolicyQuery.payload.id,
                policy: getPolicyQuery.payload
            });
        }
    }, [ getPolicyQuery.payload, getPolicyQuery.error ]);

    const closePolicyWizard = React.useCallback((policy: Policy | undefined) => {
        if (policy) {
            setPolicyState({
                policyId: policy.id,
                policy
            });
        }

        policyWizardDispatch(PolicyDetailWizardAction.CLOSE);
    }, [ policyWizardState.isEditing ]);

    const editPolicy = React.useCallback(() => {
        policyWizardDispatch(PolicyDetailWizardAction.EDIT);
    }, [ policyWizardDispatch ]);

    const duplicatePolicy = React.useCallback(() => {
        policyWizardDispatch(PolicyDetailWizardAction.DUPLICATE);
    }, [ policyWizardDispatch ]);

    const statusChanged = React.useCallback((newStatus: boolean) => {
        setPolicyState(oldState => {
            if (oldState.policy) {
                return {
                    policyId: oldState.policyId,
                    policy: { ...oldState.policy, isEnabled: newStatus }
                };
            }

            return oldState;
        });
        getPolicyQuery.query(policyId);
    }, [ getPolicyQuery, setPolicyState, policyId ]);

    const onChangeStatus = React.useCallback(newStatus => {
        const mutate = changePolicyEnabled.mutate;
        mutate({
            policyIds: [ policyId ],
            shouldBeEnabled: newStatus
        }).then(() => statusChanged(newStatus));
    }, [ policyId, changePolicyEnabled.mutate, statusChanged ]);

    const onExport = React.useCallback((type: ExporterType) => {
        const exporter = triggerExporterFactory(exporterTypeFromString(type));
        if (processedTriggers.length > 0) {
            inBrowserDownload(
                exporter.export(processedTriggers),
                `policy-${policyId}-triggers-${format(new Date(), 'y-dd-MM')}.${exporter.type}`
            );
        }
    }, [ processedTriggers, policyId ]);

    const loading = policy === undefined && getPolicyQuery.loading;

    if (!canReadAll) {
        return <NoPermissionsPage/>;
    }

    if (loading) {
        return <PolicyDetailSkeleton/>;
    }

    if (policy === undefined) {
        if (getPolicyQuery.status === 404) {
            return <PolicyDetailEmptyState policyId={ policyId || '' }/>;
        }

        const error = (getPolicyQuery.payload as any)?.msg || `code: ${getPolicyQuery.status}`;

        return <PolicyDetailErrorState
            action={ () => {
                getTriggers.query(policyId);
                getPolicyQuery.query(policyId);
            } }
            policyId={ policyId }
            error={ error }
        />;
    }

    return (
        <>
            <PageHeader>
                <Stack>
                    <StackItem>
                        <Breadcrumb>
                            <BreadcrumbLinkItem to={ linkTo.listPage() }>
                                Policies
                            </BreadcrumbLinkItem>
                            <BreadcrumbItem to='#' isActive>
                                { policy.name }
                            </BreadcrumbItem>
                        </Breadcrumb>
                    </StackItem>
                    <StackItem>
                        <Split>
                            <SplitItem isFilled>
                                <PageHeaderTitle title={ policy.name } />
                            </SplitItem>
                            <SplitItem>
                                <PolicyDetailActions
                                    isEnabled={ policy.isEnabled }
                                    disabled={ !canWriteAll }
                                    edit={ editPolicy }
                                    duplicate={ duplicatePolicy }
                                    changeEnabled={ onChangeStatus }
                                    loadingEnabledChange={ changePolicyEnabled.loading }
                                />
                            </SplitItem>
                        </Split>
                    </StackItem>
                </Stack>
            </PageHeader>
            <Main>
                <Section style={ { paddingBottom: '4px' } } className='pf-l-page__main-section pf-c-page__main-section pf-m-light'>
                    <PolicyDetailIsEnabled
                        isEnabled={ policy.isEnabled }
                        loading={ changePolicyEnabled.loading }
                    />
                    <ExpandedContent
                        actions={ policy.actions }
                        description={ policy.description }
                        created={ policy.ctime }
                        updated={ policy.mtime }
                        conditions={ policy.conditions }
                    />
                </Section>
                <div className={ recentTriggerVersionTitleClassname }>
                    <Title size="lg">Recent trigger history</Title>
                </div>
                <Section>
                    { rawCount > 0 ? (
                        <>
                            <TriggerTableToolbar
                                count={ count }
                                page={ page }
                                onPaginationChanged={ onPaginationChanged }
                                pageCount={ pagedTriggers.length }
                                filters={ triggerFilter.filters }
                                setFilters={ triggerFilter.setFilters }
                                clearFilters={ triggerFilter.clearFilter }
                                onExport={ onExport }
                            />
                            <TriggerTable
                                rows={ pagedTriggers }
                                onSort={ sort.onSort }
                                sortBy={ sort.sortBy }
                                loading={ getTriggers.loading }
                            />
                        </>
                    ) : (
                        <PolicyDetailTriggerEmptyState/>
                    ) }
                </Section>
            </Main>
            { policyWizardState.isOpen && <CreatePolicyWizard
                isOpen={ true }
                close={ closePolicyWizard }
                showCreateStep={ false }
                policiesExist={ false }
                initialValue={ policyWizardState.initialValue }
                isEditing={ policyWizardState.isEditing }
            /> }
        </>
    );
};
