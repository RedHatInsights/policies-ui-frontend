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
import { Direction } from '../../types/Page';
import { Trigger } from '../../types/Trigger';
import { useSort } from '../../hooks/useSort';
import { TriggerTableToolbar } from '../../components/Trigger/TableToolbar';
import { AppSkeleton } from '../../components/AppSkeleton/AppSkeleton';
import { CreatePolicyWizard } from '../CreatePolicyWizard/CreatePolicyWizard';

const recentTriggerVersionTitleClassname = style({
    paddingBottom: 8,
    paddingTop: 16
});

const elementsPerPage = 50;

export const PolicyDetail: React.FunctionComponent = () => {

    const { policyId } = useParams();
    const [ triggers, setTriggers ] = React.useState<Trigger[]>([]);
    const sort = useSort();

    const getPolicyQuery = useGetPolicyQuery(policyId || '', policyId !== undefined);
    const getTriggers = useGetPolicyTriggersParametrizedQuery();

    const [ count, setCount ] = React.useState<number>(0);
    const [ page, setPage ] = React.useState<number>(1);

    const [ isEditing, setEditing ] = React.useState(false);

    React.useEffect(() => {
        const query = getTriggers.query;
        const policy = getPolicyQuery.payload;
        if (policy) {
            query(policy.id);
        }
    }, [ getPolicyQuery.payload, getTriggers.query ]);

    const closePolicyWizard = React.useCallback((created: boolean) => {
        const query = getPolicyQuery.query;
        setEditing(false);
        if (created) {
            query();
        }
    }, [ setEditing, getPolicyQuery.query ]);

    const openPolicyWizard = React.useCallback(() => {
        setEditing(true);
    }, [ setEditing ]);

    const updateTriggers = React.useCallback((triggers: Trigger[]) => {
        let sortedTriggers = triggers;
        const sortBy = sort.sortBy;
        if (sortBy) {
            sortedTriggers = [ ...triggers ].sort((a, b) => {
                let ret = 0;
                if (sortBy.column === 'date') {
                    ret = a.created < b.created ? -1 : a.created > b.created ? 1 : 0;
                } else if (sortBy.column === 'system') {
                    ret = a.hostName < b.hostName ? -1 : a.hostName > b.hostName ? 1 : 0;
                }

                if (sortBy.direction === Direction.DESCENDING) {
                    ret *= -1;
                }

                return ret;
            });
        }

        setCount(sortedTriggers.length);

        const start = (page - 1) * elementsPerPage;
        sortedTriggers = sortedTriggers.slice(start, start + elementsPerPage);

        setTriggers(sortedTriggers);
    }, [ setTriggers, sort.sortBy, page ]);

    React.useEffect(() => {
        updateTriggers(getTriggers.payload || []);
    }, [ updateTriggers, getTriggers.payload, sort.sortBy, page ]);

    const onPaginationChanged = React.useCallback((_event, page) => {
        setPage(page);
    }, [ ]);

    if (getPolicyQuery.loading) {
        return <AppSkeleton/>;
    }

    const policy = getPolicyQuery.error ? undefined : getPolicyQuery.payload;
    if (policy === undefined) {
        if (getPolicyQuery.status === 404) {
            return <div>Policy not found.</div>;
        }

        return <div>An error occurred while loading the policy</div>;
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
                                <Button variant={ ButtonVariant.secondary } onClick={ openPolicyWizard }>Edit policy</Button>
                            </SplitItem>
                        </Split>
                    </StackItem>
                </Stack>
            </PageHeader>
            <Main>
                <Section style={ { paddingBottom: '4px' } } className='pf-l-page__main-section pf-c-page__main-section pf-m-light'>
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
                        perPage={ elementsPerPage }
                        count={ count }
                        page={ page }
                        onPaginationChanged={ onPaginationChanged }
                        pageCount={ triggers.length }
                    />
                    <TriggerTable
                        rows={ triggers }
                        onSort={ sort.onSort }
                        sortBy={ sort.sortBy }
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
