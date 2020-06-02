import * as React from 'react';
import { Main, PageHeader, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import {
    Breadcrumb,
    BreadcrumbItem,
    Button,
    ButtonVariant,
    Split,
    SplitItem,
    Stack,
    StackItem,
    Title
} from '@patternfly/react-core';
import { useParams } from 'react-router-dom';
import { linkTo } from '../../Routes';
import { BreadcrumbLinkItem } from '../../components/Wrappers/BreadcrumbLinkItem';
import { useGetPolicyQuery } from '../../services/useGetPolicy';
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

const recentTriggerVersionTitleClassname = style({
    paddingBottom: 8,
    paddingTop: 16
});

export const PolicyDetail: React.FunctionComponent = () => {

    const { policyId } = useParams<{
        policyId: string;
    }>();
    const appContext = useContext(AppContext);
    const { canWriteAll, canReadAll } = appContext.rbac;

    const getPolicyQuery = useGetPolicyQuery(policyId, policyId !== undefined);
    const getTriggers = useGetPolicyTriggersParametrizedQuery();
    const triggerFilter = useTriggerFilter();

    const sort = useSort();
    const {
        page,
        onPaginationChanged
    } = useTriggerPage(sort.sortBy, triggerFilter.debouncedFilters);

    const { count, pagedTriggers } = usePagedTriggers(getTriggers.payload, page);

    const [ isEditing, setEditing ] = React.useState(false);
    const [ policy, setPolicy ] = React.useState<Policy>();

    React.useEffect(() => {
        const query = getTriggers.query;
        if (policyId) {
            query(policyId);
        }
    }, [ policyId, getTriggers.query ]);

    React.useEffect(() => {
        if (!getPolicyQuery.error && getPolicyQuery.payload) {
            setPolicy(getPolicyQuery.payload);
        }
    }, [ getPolicyQuery.payload, getPolicyQuery.error ]);

    const closePolicyWizard = React.useCallback((created: boolean) => {
        const query = getPolicyQuery.query;
        setEditing(false);
        if (created) {
            setPolicy(undefined);
            query();
        }
    }, [ setEditing, getPolicyQuery.query ]);

    const openPolicyWizard = React.useCallback(() => {
        setEditing(true);
    }, [ setEditing ]);

    const statusChanged = React.useCallback((newStatus: boolean) => {
        setPolicy(oldPolicy => oldPolicy ? { ...oldPolicy, isEnabled: newStatus } : undefined);
        getPolicyQuery.query();
    }, [ getPolicyQuery, setPolicy ]);

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
                getPolicyQuery.query();
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
                                <Button
                                    variant={ ButtonVariant.secondary }
                                    onClick={ openPolicyWizard }
                                    disabled={ !canWriteAll }
                                >
                                    Edit policy
                                </Button>
                            </SplitItem>
                        </Split>
                    </StackItem>
                </Stack>
            </PageHeader>
            <Main>
                <Section style={ { paddingBottom: '4px' } } className='pf-l-page__main-section pf-c-page__main-section pf-m-light'>
                    <PolicyDetailIsEnabled
                        policyId={ policy.id }
                        isEnabled={ policy.isEnabled }
                        statusChanged={ statusChanged }
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
                    <TriggerTableToolbar
                        count={ count }
                        page={ page }
                        onPaginationChanged={ onPaginationChanged }
                        pageCount={ pagedTriggers.length }
                        filters={ triggerFilter.filters }
                        setFilters={ triggerFilter.setFilters }
                        clearFilters={ triggerFilter.clearFilter }
                    />
                    <TriggerTable
                        rows={ pagedTriggers }
                        onSort={ sort.onSort }
                        sortBy={ sort.sortBy }
                        loading={ getTriggers.loading }
                    />
                </Section>
            </Main>
            { isEditing && <CreatePolicyWizard
                isOpen={ true }
                close={ closePolicyWizard }
                initialValue={ policy }
                showCreateStep={ false }
                policiesExist={ false }
                isEditing={ true }
            /> }
        </>
    );
};
