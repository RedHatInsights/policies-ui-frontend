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
import { useHistory } from 'react-router-dom';
import inBrowserDownload from 'in-browser-download';
import { linkTo } from '../../Routes';
import { BreadcrumbLinkItem, Section, useSort } from 'common-code-ui';
import { useGetPolicyParametrizedQuery } from '../../services/useGetPolicy';
import { ExpandedContent } from '../../components/Policy/Table/ExpandedContent';
import { style } from 'typestyle';
import { useGetPolicyTriggersParametrizedQuery } from '../../services/useGetPolicyTriggers';
import { TriggerTable } from '../../components/Trigger/Table';
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
import { useTriggerPage } from './hooks/useTriggerPage';
import { useTriggerFilter } from './hooks/useTriggerFilter';
import { ExporterType, exporterTypeFromString, Direction, Sort } from 'common-code-ui';
import { format } from 'date-fns';
import { triggerExporterFactory } from '../../utils/exporters/Trigger/Factory';
import { PolicyDetailTriggerEmptyState } from './TriggerEmptyState';
import { PolicyDetailActions } from './Actions';
import { useMassChangePolicyEnabledMutation } from '../../services/useMassChangePolicyEnabled';
import { usePolicyToDelete } from '../../hooks/usePolicyToDelete';
import { DeletePolicy } from '../ListPage/DeletePolicy';
import { useWizardState } from './hooks/useWizardState';
import { usePolicy } from './hooks/usePolicy';
import { useGetAllTriggers } from './hooks/useGetAllTriggers';

const recentTriggerVersionTitleClassname = style({
    paddingBottom: 8,
    paddingTop: 16
});

const defaultSort = Sort.by('date', Direction.DESCENDING);

type PolicyQueryResponse = ReturnType<ReturnType<typeof useGetPolicyParametrizedQuery>['query']> extends Promise<infer U> ? U : never

export const PolicyDetail: React.FunctionComponent = () => {
    const { policyId, policy, setPolicy } = usePolicy();

    const appContext = useContext(AppContext);
    const { canWriteAll, canReadAll } = appContext.rbac;
    const history = useHistory();

    const policyToDelete = usePolicyToDelete();

    const getPolicyQuery = useGetPolicyParametrizedQuery();
    const getTriggers = useGetPolicyTriggersParametrizedQuery();
    const getAllTriggers = useGetAllTriggers(policyId);
    const triggerFilter = useTriggerFilter();
    const changePolicyEnabled = useMassChangePolicyEnabledMutation();

    const sort = useSort(defaultSort);
    const {
        page,
        onPaginationChanged
    } = useTriggerPage(sort.sortBy, triggerFilter.debouncedFilters);

    const wizardState = useWizardState(policy);

    React.useEffect(() => {
        const query = getTriggers.query;
        if (policyId) {
            query({
                policyId,
                page
            });
        }
    }, [ policyId, getTriggers.query, page ]);

    const processGetPolicyResponse = React.useCallback((response: PolicyQueryResponse) => {
        if (response.status === 200 && response.payload) {
            setPolicy(response.payload);
        }
    }, [ setPolicy ]);

    React.useEffect(() => {
        const query = getPolicyQuery.query;
        if (policyId !== policy?.id) {
            query(policyId).then(processGetPolicyResponse);
        }
    }, [ policyId, getPolicyQuery.query, policy, setPolicy, processGetPolicyResponse ]);

    const closePolicyWizard = React.useCallback((policy: Policy | undefined) => {
        const close = wizardState.close;
        if (policy) {
            setPolicy(policy);
        }

        close();
    }, [ setPolicy, wizardState.close ]);

    const deletePolicy = React.useCallback(() => {
        const open = policyToDelete.open;
        if (policy) {
            open(policy);
        }
    }, [ policy, policyToDelete.open ]);

    const onCloseDeletePolicy = React.useCallback((deleted: boolean) => {
        const close = policyToDelete.close;

        if (deleted) {
            history.push(linkTo.listPage());
        } else {
            close();
        }
    }, [ history, policyToDelete.close ]);

    const statusChanged = React.useCallback((newStatus: boolean) => {
        if (policy) {
            setPolicy({ ...policy, isEnabled: newStatus });
        }
    }, [ policy, setPolicy ]);

    const onChangeStatus = React.useCallback(newStatus => {
        const mutate = changePolicyEnabled.mutate;
        mutate({
            policyIds: [ policyId ],
            shouldBeEnabled: newStatus
        }).then(() => statusChanged(newStatus));
    }, [ policyId, changePolicyEnabled.mutate, statusChanged ]);

    const onExport = React.useCallback((type: ExporterType) => {
        const exporter = triggerExporterFactory(exporterTypeFromString(type));
        getAllTriggers().then(triggers => {
            if (triggers.length > 0) {
                inBrowserDownload(
                    exporter.export(triggers),
                    `policy-${policyId}-triggers-${format(new Date(Date.now()), 'y-dd-MM')}.${exporter.type}`
                );
            }
        });
    }, [ getAllTriggers, policyId ]);

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
                getTriggers.query({
                    policyId,
                    page
                });
                getPolicyQuery.query(policyId).then(processGetPolicyResponse);
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
                                    edit={ wizardState.edit }
                                    duplicate={ wizardState.duplicate }
                                    delete={ deletePolicy }
                                    changeEnabled={ onChangeStatus }
                                    loadingEnabledChange={ changePolicyEnabled.loading }
                                />
                            </SplitItem>
                        </Split>
                    </StackItem>
                </Stack>
            </PageHeader>
            <Main>
                <Section style={ { paddingBottom: '4px' } }>
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
                    <Title headingLevel="h2" size="lg">Recent trigger history</Title>
                </div>
                <Section>
                    { (getTriggers.payload && getTriggers.payload.count > 0) || getTriggers.loading ? (
                        <>
                            <TriggerTableToolbar
                                count={ getTriggers.payload?.count }
                                page={ page }
                                onPaginationChanged={ onPaginationChanged }
                                pageCount={ getTriggers.payload?.data.length }
                                onExport={ onExport }
                            />
                            <TriggerTable
                                rows={ getTriggers.payload?.data }
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
            { wizardState.data.isOpen && <CreatePolicyWizard
                isOpen={ true }
                close={ closePolicyWizard }
                showCreateStep={ false }
                policiesExist={ false }
                initialValue={ wizardState.data.initialValue }
                isEditing={ wizardState.data.isEditing }
            /> }
            { policyToDelete.isOpen && <DeletePolicy
                onClose={ onCloseDeletePolicy }
                loading={ false }
                count={ policyToDelete.count }
                policy={ policyToDelete.policy }
            /> }
        </>
    );
};
