import * as React from 'react';
import { useContext } from 'react';
import { IActions } from '@patternfly/react-table';
import { Main, PageHeader, PageHeaderTitle, Section } from '@redhat-cloud-services/frontend-components';

import { PolicyTable } from '../../components/Policy/Table/PolicyTable';
import { useGetPoliciesQuery } from '../../services/Api';
import { Direction, Filter, Operator, Page, Sort } from '../../types/Page';
import {
    ClearFilterCommand,
    FilterColumn,
    IsActiveFilter,
    PolicyToolbar
} from '../../components/Policy/TableToolbar/PolicyTableToolbar';
import { CreatePolicyWizard } from './CreatePolicyWizard';
import { RbacContext } from '../../components/RbacContext';
import { policyTableError } from './PolicyTableError';
import { Policy } from '../../types/Policy';
import { DeletePolicy } from './DeletePolicy';
import { IRowData } from '@patternfly/react-table';
import { useDebouncedState } from '../../hooks';

type ListPageProps = {};

const DEBOUNCE_MS = 250;

const ListPage: React.FunctionComponent<ListPageProps> = (_props) => {

    const [ currentPage, setCurrentPage ] = React.useState<number>(1);
    const [ itemsPerPage, setItemsPerPage ] = React.useState<number>(Page.defaultPage().size);
    const [ sort, setSort ] = React.useState<Sort>();
    const [ isCustomPolicyWizardOpen, setCustomPolicyWizardOpen ] = React.useState<boolean>(false);
    const [ policyToDelete, setPolicyToDelete ] = React.useState<Policy | undefined>(undefined);
    const [ filterName, setFilterName, debouncedFilterName ] = useDebouncedState<string>('', DEBOUNCE_MS);
    const [ filterDescription, setFilterDescription, debouncedFilterDescription ] = useDebouncedState<string>('', DEBOUNCE_MS);
    const [ filterIsActive, setFilterIsActive, debouncedFilterIsActive ] = useDebouncedState<IsActiveFilter>({
        enabled: false,
        disabled: false
    }, DEBOUNCE_MS);

    const page = React.useMemo(() => {
        const filter = new Filter();

        if (debouncedFilterName.trim() !== '') {
            filter.and(FilterColumn.NAME, Operator.ILIKE, `%${debouncedFilterName}%`);
        }

        if (debouncedFilterDescription.trim() !== '') {
            filter.and(FilterColumn.DESCRIPTION, Operator.ILIKE, `%${debouncedFilterDescription}%`);
        }

        if (debouncedFilterIsActive.disabled !== debouncedFilterIsActive.enabled) {
            filter.and(FilterColumn.IS_ACTIVE, Operator.BOOLEAN_IS, debouncedFilterIsActive.enabled ? 'true' : 'false');
        }

        return Page.of(currentPage, itemsPerPage, filter, sort);
    }, [ currentPage, itemsPerPage, sort, debouncedFilterName, debouncedFilterDescription, debouncedFilterIsActive ]);

    const getPoliciesQuery = useGetPoliciesQuery(page, false);

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

    const openCustomPolicyWizard = React.useCallback(() => {
        setCustomPolicyWizardOpen(true);
    }, [ setCustomPolicyWizardOpen ]);

    const closeCustomPolicyWizard = React.useCallback((policyCreated: boolean) => {
        if (policyCreated) {
            getPoliciesQueryReload();
        }

        setCustomPolicyWizardOpen(false);
    }, [ setCustomPolicyWizardOpen, getPoliciesQueryReload ]);

    const changePage = React.useCallback((event, page: number) => {
        setCurrentPage(page);
    }, [ setCurrentPage ]);

    const changeItemsPerPage = React.useCallback((event, perPage: number) => {
        setCurrentPage(1);
        setItemsPerPage(perPage);
    }, [ setCurrentPage, setItemsPerPage ]);

    const onSort = React.useCallback((index: number, column: string, direction: Direction) => {
        setSort(Sort.by(column, direction));
    }, [ setSort ]);

    const clearFilters = React.useCallback((clearFilterCommands: ClearFilterCommand[]) => {
        for (const clearFilterCommand of clearFilterCommands) {
            switch (clearFilterCommand.filter) {
                case FilterColumn.NAME:
                    console.log('Clearing filterName with', clearFilterCommand.data);
                    setFilterName(clearFilterCommand.data as string);
                    break;
                case FilterColumn.DESCRIPTION:
                    setFilterDescription(clearFilterCommand.data as string);
                    break;
                case FilterColumn.IS_ACTIVE:
                    setFilterIsActive(clearFilterCommand.data as IsActiveFilter);
                    break;
            }
        }
    }, [ setFilterName, setFilterDescription, setFilterIsActive ]);

    const filters = React.useMemo(() => ({
        [FilterColumn.NAME]: {
            value: filterName,
            setter: (data: string) => {
                console.log('calling setter with data', data);
                setFilterName(data);
            }
        },
        [FilterColumn.DESCRIPTION]: {
            value: filterDescription,
            setter: setFilterDescription
        },
        [FilterColumn.IS_ACTIVE]: {
            value: filterIsActive,
            setter: setFilterIsActive
        }
    }), [ filterName, setFilterName, filterDescription, setFilterDescription, filterIsActive, setFilterIsActive ]);

    const policyTableErrorValue = React.useMemo(
        () => policyTableError(canReadAll, getPoliciesQuery.error, getPoliciesQuery.status),
        [ canReadAll, getPoliciesQuery.error, getPoliciesQuery.status ]
    );

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
                        pageCount={ getPoliciesQuery.payload?.length }
                        perPage={ itemsPerPage }
                        filters={ filters }
                        clearFilters={ clearFilters }
                        count={ getPoliciesQuery.count }
                    />
                    <PolicyTable
                        policies={ getPoliciesQuery.payload }
                        actions={ tableActions }
                        loading={ getPoliciesQuery.loading }
                        error={ policyTableErrorValue }
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
