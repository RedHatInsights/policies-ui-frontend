import * as React from 'react';
import { IActions } from '@patternfly/react-table';
import { PageHeader, Main, Section, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';

import { PolicyWizard } from '../../components/Policy/PolicyWizard';
import { PolicyTable } from '../../components/Policy/PolicyTable';
import { useGetPoliciesQuery } from '../../services/Api';
import { Page } from '../../services/Page';
import { PolicyToolbar } from '../../components/Policy/TableToolbar/PolicyTableToolbar';

type ListPageProps = {};

const tableActions: IActions = [
    {
        title: 'Edit',
        onClick: () => alert('Edit')
    },
    {
        title: 'Clone',
        onClick: () => alert('Clone')
    },
    {
        title: 'Delete',
        onClick: () => alert('Delete')
    }
];

const ListPage: React.FunctionComponent<ListPageProps> = (_props) => {

    const [ isCustomPolicyWizardOpen, setCustomPolicyWizardOpen ] = React.useState<boolean>(false);
    const [ currentPage, setCurrentPage ] = React.useState<number>(1);

    const { loading, payload: policies, error } = useGetPoliciesQuery(Page.of(currentPage));

    const openCustomPolicyWizard = () => {
        setCustomPolicyWizardOpen(true);
    };

    const closeCustomPolicyWizard = () => {
        setCustomPolicyWizardOpen(false);
    };

    const onCreate = () => {
        console.log('Create');
        setCustomPolicyWizardOpen(false);
    };

    const changePage = (event, page: number) => {
        setCurrentPage(page);
    };

    return (
        <>
            <PageHeader>
                <PageHeaderTitle title="Custom policies"/>
            </PageHeader>
            <Main>
                <Section>
                    <PolicyToolbar
                        onCreatePolicy={ openCustomPolicyWizard }
                        onPaginationChanged={ changePage }
                        page={ currentPage }
                    />
                    <PolicyTable
                        policies={ policies }
                        actions={ tableActions }
                        loading={ loading }
                        hasError={ error }
                        onSelect={ () => console.log('selected') }
                    />
                </Section>
            </Main>
            { isCustomPolicyWizardOpen &&
            <PolicyWizard
                onCreate={ onCreate }
                onClose={ closeCustomPolicyWizard }
                initialValue={ { actions: [{}]} }/> }
        </>
    );
};

export default ListPage;
