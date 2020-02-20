import * as React from 'react';
import { useContext } from 'react';
import { IActions, IRowData } from '@patternfly/react-table';
import { Main, PageHeader, PageHeaderTitle, Section } from '@redhat-cloud-services/frontend-components';

import { PolicyRow, PolicyTable } from '../../components/Policy/Table/PolicyTable';
import { useGetPoliciesQuery } from '../../services/Api';
import { Direction, Filter, Operator, Page, Sort } from '../../types/Page';
import {
    ClearFilterCommand,
    FilterColumn,
    IsActiveFilter,
    PolicyToolbar,
    SelectionCommand
} from '../../components/Policy/TableToolbar/PolicyTableToolbar';
import { CreatePolicyWizard } from './CreatePolicyWizard';
import { RbacContext } from '../../components/RbacContext';
import { policyTableError } from './PolicyTableError';
import { Policy } from '../../types/Policy';
import { DeletePolicy } from './DeletePolicy';
import { useDebouncedState } from '../../hooks';
import { SavingMode } from '../../components/Policy/PolicyWizard';
import { PolicyWithOptionalId } from '../../types/Policy/Policy';
import { assertNever } from '../../utils/Assert';

type ListPageProps = {};

const DEBOUNCE_MS = 250;

type PolicyWizardStateBase = {
    template: PolicyWithOptionalId | undefined;
    savingMode: SavingMode;
};

type PolicyWizardStateOpen = {
    isOpen: true;
} & PolicyWizardStateBase;

type PolicyWizardStateClosed = {
    isOpen: false;
} & Partial<PolicyWizardStateBase>;

type PolicyWizardState = PolicyWizardStateClosed | PolicyWizardStateOpen;

const ListPage: React.FunctionComponent<ListPageProps> = (_props) => {

    const [ currentPage, setCurrentPage ] = React.useState<number>(1);
    const [ itemsPerPage, setItemsPerPage ] = React.useState<number>(Page.defaultPage().size);
    const [ sort, setSort ] = React.useState<Sort>();
    const [ policyWizardState, setPolicyWizardState ] = React.useState<PolicyWizardState>({
        isOpen: false
    });
    const [ policyToDelete, setPolicyToDelete ] = React.useState<Policy[] | undefined>(undefined);
    const [ filterName, setFilterName, debouncedFilterName ] = useDebouncedState<string>('', DEBOUNCE_MS);
    const [ filterDescription, setFilterDescription, debouncedFilterDescription ] = useDebouncedState<string>('', DEBOUNCE_MS);
    const [ filterIsActive, setFilterIsActive, debouncedFilterIsActive ] = useDebouncedState<IsActiveFilter>({
        enabled: false,
        disabled: false
    }, DEBOUNCE_MS);

    const page = React.useMemo(() => {
        const filter = new Filter();

        if (debouncedFilterName.trim() !== '') {
            filter.and(FilterColumn.NAME, Operator.ILIKE, `%${debouncedFilterName.trim()}%`);
        }

        if (debouncedFilterDescription.trim() !== '') {
            filter.and(FilterColumn.DESCRIPTION, Operator.ILIKE, `%${debouncedFilterDescription.trim()}%`);
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

    const tableActions: IActions = React.useMemo<IActions>(() => {
        if (!canWriteAll) {
            return [];
        }

        return [
            {
                title: 'Edit',
                onClick: (_event: React.MouseEvent, _rowIndex: number, rowData: IRowData) => {
                    const policy = getPolicyFromPayload(rowData.id);
                    if (policy) {
                        setPolicyWizardState({
                            isOpen: true,
                            template: policy,
                            savingMode: SavingMode.UPDATE
                        });
                    }
                }
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
                        setPolicyToDelete([ policy ]);
                    }
                }
            }
        ];
    }, [ canWriteAll, setPolicyToDelete, getPolicyFromPayload ]);

    React.useEffect(() => {
        if (canReadAll) {
            getPoliciesQueryReload();
        }
    }, [ canReadAll, getPoliciesQueryReload ]);

    const createCustomPolicy = React.useCallback(() => {
        setPolicyWizardState({
            isOpen: true,
            savingMode: SavingMode.CREATE,
            template: undefined
        });
    }, [ setPolicyWizardState ]);

    const closeCustomPolicyWizard = React.useCallback((policyCreated: boolean) => {
        if (policyCreated) {
            getPoliciesQueryReload();
        }

        setPolicyWizardState({
            isOpen: false
        });
    }, [ setPolicyWizardState, getPoliciesQueryReload ]);

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

    const [ policyRows, setPolicyRows ] = React.useState<PolicyRow[]>([]);

    React.useEffect(() => {
        if (getPoliciesQuery.payload) {
            setPolicyRows(getPoliciesQuery.payload?.map(policy => ({ ...policy, isOpen: false, isSelected: false })));
        }
    }, [ getPoliciesQuery.payload ]);

    const onCollapse = (policy: PolicyRow, index: number, isOpen: boolean) => {
        setPolicyRows(prevRows => {
            const newPolicyRows = [ ...prevRows ];
            newPolicyRows[index] = { ...policy, isOpen };
            return newPolicyRows;
        });
    };

    const onSelect = (policy: PolicyRow, index: number, isSelected: boolean) => {
        setPolicyRows(prevRows => {
            const newPolicyRows = [ ...prevRows ];
            newPolicyRows[index] = { ...policy, isSelected };
            return newPolicyRows;
        });
    };

    const onSelectionChanged = (command: SelectionCommand) => {
        if (command === SelectionCommand.NONE) {
            setPolicyRows(prevState => prevState.map(policy => ({ ...policy, isSelected: false })));
        } else if (command === SelectionCommand.PAGE) {
            setPolicyRows(prevState => prevState.map(policy => ({ ...policy, isSelected: true })));
        } else {
            assertNever(command);
        }
    };

    const selectedCount = policyRows.filter(policy => policy.isSelected).length;

    const onDeletePolicies = () => setPolicyToDelete(policyRows.filter(policy => policy.isSelected));

    return (
        <>
            <PageHeader>
                <PageHeaderTitle title="Custom policies"/>
            </PageHeader>
            <Main>
                <Section>
                    <PolicyToolbar
                        onCreatePolicy={ canWriteAll ? createCustomPolicy : undefined }
                        onDeletePolicy={ canWriteAll ? onDeletePolicies : undefined }
                        onPaginationChanged={ changePage }
                        onPaginationSizeChanged={ changeItemsPerPage }
                        onSelectionChanged={ onSelectionChanged }
                        selectedCount={ selectedCount }
                        page={ currentPage }
                        pageCount={ getPoliciesQuery.payload?.length }
                        perPage={ itemsPerPage }
                        filters={ filters }
                        clearFilters={ clearFilters }
                        count={ getPoliciesQuery.count }
                    />
                    <PolicyTable
                        policies={ policyRows }
                        onCollapse={ onCollapse }
                        onSelect={ onSelect }
                        actions={ tableActions }
                        loading={ getPoliciesQuery.loading }
                        error={ policyTableErrorValue }
                        onSort={ onSort }
                        sortBy={ sort }
                    />
                </Section>
            </Main>
            { policyWizardState.isOpen && <CreatePolicyWizard
                isOpen={ policyWizardState.isOpen }
                close={ closeCustomPolicyWizard }
                initialValue={ policyWizardState.template }
                savingMode={ policyWizardState.savingMode }
            /> }
            <DeletePolicy onClose={ onCloseDeletePolicy } policies={ policyToDelete }/>
        </>
    );
};

export default ListPage;
