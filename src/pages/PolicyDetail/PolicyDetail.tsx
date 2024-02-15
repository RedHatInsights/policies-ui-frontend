import {
    Breadcrumb,
    BreadcrumbItem,
    Split,
    SplitItem,
    Stack,
    StackItem,
    Title
} from '@patternfly/react-core';
import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { addDangerNotification, BreadcrumbLinkItem, Section } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { useContext } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import { style } from 'typestyle';

import { AppContext } from '../../app/AppContext';
import { ExpandedContent } from '../../components/Policy/Table/ExpandedContent';
import { usePolicyToDelete } from '../../hooks/usePolicyToDelete';
import { linkTo } from '../../InsightsRoutes';
import { Messages } from '../../properties/Messages';
import { useGetPolicyParametrizedQuery } from '../../services/useGetPolicy';
import { useMassChangePolicyEnabledMutation } from '../../services/useMassChangePolicyEnabled';
import { Policy } from '../../types/Policy';
import { CreatePolicyWizard } from '../CreatePolicyWizard/CreatePolicyWizard';
import { DeletePolicy } from '../ListPage/DeletePolicy';
import { NoPermissionsPage } from '../NoPermissions/NoPermissionsPage';
import { PolicyDetailActions } from './Actions';
import { PolicyDetailEmptyState } from './EmptyState';
import { PolicyDetailErrorState } from './ErrorState';
import { usePolicy } from './hooks/usePolicy';
import { useWizardState } from './hooks/useWizardState';
import { PolicyDetailIsEnabled } from './IsEnabled';
import { PolicyDetailSkeleton } from './Skeleton';
import { TriggerDetailAPI, TriggerDetailSection } from './TriggerDetailSection';

const recentTriggerVersionTitleClassname = style({
    paddingBottom: 8,
    paddingTop: 16
});

type PolicyQueryResponse = ReturnType<ReturnType<typeof useGetPolicyParametrizedQuery>['query']> extends Promise<infer U> ? U : never

export const PolicyDetail: React.FunctionComponent = () => {
    const { policyId, policy, setPolicy } = usePolicy();

    const appContext = useContext(AppContext);
    const { canReadPolicies, canWritePolicies } = appContext.rbac;
    const navigate = useNavigate();

    const policyToDelete = usePolicyToDelete();

    const getPolicyQuery = useGetPolicyParametrizedQuery();
    const changePolicyEnabled = useMassChangePolicyEnabledMutation();

    const wizardState = useWizardState(policy);
    const triggerDetailRef = React.useRef<TriggerDetailAPI>(null);

    const processGetPolicyResponse = React.useCallback((response: PolicyQueryResponse) => {
        if (response.payload?.type === 'Policy') {
            setPolicy(response.payload.value);
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
            navigate(linkTo.listPage());
        } else {
            close();
        }
    }, [ navigate, policyToDelete.close ]);

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
        }).then((result) => {
            if (result.payload?.status === 200) {
                if (result.payload.value.includes(policyId)) {
                    statusChanged(newStatus);
                } else {
                    addDangerNotification(
                        Messages.pages.policyDetail.errorChangingEnabledStatus.notFound.title,
                        Messages.pages.policyDetail.errorChangingEnabledStatus.notFound.text
                    );
                }
            } else {
                addDangerNotification(
                    Messages.pages.policyDetail.errorChangingEnabledStatus.else.title,
                    Messages.pages.policyDetail.errorChangingEnabledStatus.else.text
                );
            }
        });
    }, [ policyId, changePolicyEnabled.mutate, statusChanged ]);

    if (!canReadPolicies) {
        return <NoPermissionsPage />;
    }

    if (policy === undefined) {
        if (getPolicyQuery.status === 404) {
            return <PolicyDetailEmptyState policyId={ policyId || '' } />;
        }

        if (!getPolicyQuery.loading && getPolicyQuery.payload?.type !== 'Policy') {

            let error = `code: ${getPolicyQuery.status}`;
            if (getPolicyQuery.payload?.type === 'Msg' && getPolicyQuery.payload.value.msg) {
                error = getPolicyQuery.payload.value.msg;
            }

            return <PolicyDetailErrorState
                action={ () => {
                    triggerDetailRef.current?.refresh();
                    getPolicyQuery.query(policyId).then(processGetPolicyResponse);
                } }
                error={ error }
            />;
        }

        return <PolicyDetailSkeleton />;
    }

    return (
        <>
            <Helmet>
                <title>{ policy.name } - Policies | Red Hat Insights</title>
            </Helmet>
            <PageHeader>
                <Stack>
                    <StackItem>
                        <Breadcrumb>
                            <BreadcrumbLinkItem ouiaId="to-list-page" to={ linkTo.listPage() }>
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
                                    disabled={ !canWritePolicies }
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
                <Section ouiaId="policy-detail" style={ { paddingBottom: '4px' } }>
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
                <TriggerDetailSection
                    policyId={ policyId }
                    ref={ triggerDetailRef }
                />
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
