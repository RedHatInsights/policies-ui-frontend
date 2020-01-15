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
    const [ itemsPerPage, setItemsPerPage ] = React.useState<number>(Page.defaultPage().size);

    const { loading, payload: policies, error, status, count } = useGetPoliciesQuery(Page.of(currentPage, itemsPerPage));

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

    const changeItemsPerPage = (event, perPage: number) => {
        setCurrentPage(1);
        setItemsPerPage(perPage);
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
                        onPaginationSizeChanged={ changeItemsPerPage }
                        page={ currentPage }
                        perPage={ itemsPerPage }
                        count={ count }
                    />
                    <PolicyTable
                        policies={ policies }
                        actions={ tableActions }
                        loading={ loading }
                        hasError={ error }
                        onSelect={ () => console.log('selected') }
                        httpStatus={ status }
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
