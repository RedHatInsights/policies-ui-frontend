import * as React from 'react';
import { useContext } from 'react';
import { IActions } from '@patternfly/react-table';
import { Main, PageHeader, PageHeaderTitle, Section } from '@redhat-cloud-services/frontend-components';

import { PolicyTable } from '../../components/Policy/Table/PolicyTable';
import { useGetPoliciesQuery } from '../../services/Api';
import { Direction, Page, Sort } from '../../types/Page';
import { PolicyToolbar } from '../../components/Policy/TableToolbar/PolicyTableToolbar';
import { CreatePolicyWizard } from './CreatePolicyWizard';
import { RbacContext } from '../../components/RbacContext';
import { policyTableError } from './PolicyTableError';
import { Policy } from '../../types/Policy';
import { DeletePolicy } from './DeletePolicy';
import { IRowData } from '@patternfly/react-table';

type ListPageProps = {};

const ListPage: React.FunctionComponent<ListPageProps> = (_props) => {

    const [ currentPage, setCurrentPage ] = React.useState<number>(1);
    const [ itemsPerPage, setItemsPerPage ] = React.useState<number>(Page.defaultPage().size);
    const [ sort, setSort ] = React.useState<Sort>();
    const [ isCustomPolicyWizardOpen, setCustomPolicyWizardOpen ] = React.useState<boolean>(false);
    const [ policyToDelete, setPolicyToDelete ] = React.useState<Policy | undefined>(undefined);

    const getPoliciesQuery = useGetPoliciesQuery(Page.of(currentPage, itemsPerPage, sort), false);

    const { canReadAll, canWriteAll } = useContext(RbacContext);

    const { query: getPoliciesQueryReload } = getPoliciesQuery;

    const onCloseDeletePolicy = React.useCallback((deleted: boolean) => {
        if (deleted) {
            getPoliciesQueryReload();
        }

        setPolicyToDelete(undefined);
    }, [ getPoliciesQueryReload, setPolicyToDelete ]);

    const getPolicyFromPayload =  React.useCallback(
        (id: number) => getPoliciesQuery.payload?.find(policy => policy.id === id),
        [ getPoliciesQuery.payload ]);

    const tableActions: IActions = React.useMemo<IActions>(() => [
        {
            title: 'Edit',
            onClick: () => alert('Edit')
        },
        {
            title: 'Duplicate',
            onClick: () => alert('Duplicate')
        },
        {
            title: 'Delete',
            onClick: (_event: React.MouseEvent, _rowIndex: number, rowData: IRowData) => {
                const policy = getPolicyFromPayload(rowData.id);
                if (policy) {
                    setPolicyToDelete(policy);
                }
            }
        }
    ], [ setPolicyToDelete, getPolicyFromPayload ]);

    React.useEffect(() => {
        if (canReadAll) {
            getPoliciesQueryReload();
        }
    }, [ canReadAll, getPoliciesQueryReload ]);

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
                        error={ policyTableError(canReadAll, getPoliciesQuery.error, getPoliciesQuery.status) }
                        onSort={ onSort }
                        sortBy={ sort }
                    />
                </Section>
            </Main>
            <CreatePolicyWizard
                close={ closeCustomPolicyWizard }
                isOpen={ isCustomPolicyWizardOpen }
            />
            <DeletePolicy onClose={ onCloseDeletePolicy } policy={ policyToDelete }/>
        </>
    );
};

export default ListPage;
