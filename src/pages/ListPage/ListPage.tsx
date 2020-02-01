import * as React from 'react';
import { IActions } from '@patternfly/react-table';
import { Main, PageHeader, PageHeaderTitle, Section } from '@redhat-cloud-services/frontend-components';

import { PolicyTable } from '../../components/Policy/PolicyTable';
import { useGetPoliciesQuery } from '../../services/Api';
import { Direction, Page, Sort } from '../../types/Page';
import { PolicyToolbar } from '../../components/Policy/TableToolbar/PolicyTableToolbar';
import { CreatePolicyWizard } from './CreatePolicyWizard';
import { useContext } from 'react';
import { RbacContext } from '../../components/RbacContext';

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

    const [ currentPage, setCurrentPage ] = React.useState<number>(1);
    const [ itemsPerPage, setItemsPerPage ] = React.useState<number>(Page.defaultPage().size);
    const [ sort, setSort ] = React.useState<Sort>();
    const [ isCustomPolicyWizardOpen, setCustomPolicyWizardOpen ] = React.useState<boolean>(false);

    const getPoliciesQuery = useGetPoliciesQuery(Page.of(currentPage, itemsPerPage, sort), false);

    const { canReadAll, canWriteAll } = useContext(RbacContext);

    React.useEffect(() => {
        if (canReadAll) {
            getPoliciesQuery.query();
        }
    }, [ canReadAll, getPoliciesQuery.query ]);

    const openCustomPolicyWizard = () => {
        setCustomPolicyWizardOpen(true);
    };

    const closeCustomPolicyWizard = (policyCreated: boolean) => {
        if (policyCreated) {
            getPoliciesQuery.query();
        }

        setCustomPolicyWizardOpen(false);
    };

    const changePage = (event, page: number) => {
        setCurrentPage(page);
    };

    const changeItemsPerPage = (event, perPage: number) => {
        setCurrentPage(1);
        setItemsPerPage(perPage);
    };

    const onSort = (index: number, column: string, direction: Direction) => {
        setSort(Sort.by(column, direction));
    };

    console.log('read,write', canReadAll, canWriteAll);

    return (
        <>
            <PageHeader>
                <PageHeaderTitle title="Custom policies"/>
            </PageHeader>
            <Main>
                <Section>
                    <PolicyToolbar
                        onCreatePolicy={ canWriteAll ? openCustomPolicyWizard : undefined }
                        onPaginationChanged={ changePage }
                        onPaginationSizeChanged={ changeItemsPerPage }
                        page={ currentPage }
                        perPage={ itemsPerPage }
                        count={ getPoliciesQuery.count }
                    />
                    <PolicyTable
                        policies={ getPoliciesQuery.payload }
                        actions={ tableActions }
                        loading={ getPoliciesQuery.loading }
                        hasError={ canReadAll ? getPoliciesQuery.error : true }
                        onSelect={ () => console.log('selected') }
                        onSort={ onSort }
                        sortBy={ sort }
                        httpStatus={ getPoliciesQuery.status }
                    />
                </Section>
            </Main>
            <CreatePolicyWizard
                close={ closeCustomPolicyWizard }
                isOpen={ isCustomPolicyWizardOpen }
            />
        </>
    );
};

export default ListPage;
