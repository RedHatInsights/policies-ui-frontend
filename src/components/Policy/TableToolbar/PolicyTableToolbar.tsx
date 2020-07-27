import * as React from 'react';
import { PaginationProps, PaginationVariant } from '@patternfly/react-core';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import {
    ClearFilterCommand,
    IsActiveFilter,
    PolicyFilterColumn,
    PolicyFilters,
    SetPolicyFilters
} from '../../../types/Policy/PolicyPaging';
import { EnabledPolicyIcon, DisabledPolicyIcon } from '../../Icons';
import { style } from 'typestyle';

type OnPaginationPageChangedHandler = (
    event: React.SyntheticEvent<HTMLButtonElement> | React.MouseEvent | React.KeyboardEvent | MouseEvent, page: number) => void;
type OnPaginationSizeChangedHandler = (event: React.MouseEvent | React.KeyboardEvent | MouseEvent, perPage: number) => void;

export enum SelectionCommand {
    NONE,
    PAGE,
    ALL
}

interface TablePolicyToolbarProps {
    count?: number;
    filterElements: PolicyFilters;
    setFilterElements: SetPolicyFilters;
    clearFilters: (filters: ClearFilterCommand[]) => void;
    onCreatePolicy?: () => void;
    onDeletePolicy?: () => void;
    onEnablePolicy?: () => void;
    onDisablePolicy?: () => void;
    hideActions?: boolean;
    onPaginationChanged?: OnPaginationPageChangedHandler;
    onPaginationSizeChanged?: OnPaginationSizeChangedHandler;
    onSelectionChanged?: (command: SelectionCommand) => void;
    selectedCount?: number;
    hideBulkSelect?: boolean;
    page: number;
    pageCount?: number;
    perPage: number;
    showPerPageOptions: boolean;
    onExport?: (event: Event, type: string) => void;
    showBottomPagination?: boolean;
}

const FilterColumnToLabel: Record<PolicyFilterColumn, string> = {
    [PolicyFilterColumn.NAME]: 'Name',
    [PolicyFilterColumn.IS_ACTIVE]: 'Enabled'
};

const IsActiveKeyToChipLabel: Record<keyof IsActiveFilter, string> = {
    enabled: 'Enabled',
    disabled: 'Disabled'
};

const enabledTextClassName = style({
    marginLeft: 4
});

const IsActiveLabel = (props: { isActiveFilter: string }) => {
    if (props.isActiveFilter === 'enabled') {
        return (
            <>
                <EnabledPolicyIcon/> <span className={ enabledTextClassName }>Enabled</span>
            </>
        );
    } else if (props.isActiveFilter === 'disabled') {
        return (
            <>
                <DisabledPolicyIcon/> <span className={ enabledTextClassName }>Disabled</span>
            </>
        );
    }

    return null;
};

const getFilterConfigString = (rawValue: string, filter: PolicyFilterColumn) => {
    const value = rawValue.trim();
    if (value === '') {
        return undefined;
    }

    return {
        category: FilterColumnToLabel[filter],
        chips: [
            {
                name: value,
                isRead: true
            }
        ]
    };
};

const getFilterConfigIsActiveFilter = (value: IsActiveFilter, filter: PolicyFilterColumn) => {
    if (!value.enabled && !value.disabled) {
        return undefined;
    }

    return {
        category: FilterColumnToLabel[filter],
        chips: Object.keys(value).filter(key => value[key]).map(key => ({
            name: IsActiveKeyToChipLabel[key],
            isRead: true,
            key
        }))
    };
};

const getFilterConfig = (filters: PolicyFilters, filter: PolicyFilterColumn) => {
    const rawValue: string | IsActiveFilter = filters[filter];

    if (typeof rawValue === 'string') {
        return getFilterConfigString(rawValue, filter);
    }

    return getFilterConfigIsActiveFilter(rawValue, filter);
};

export const PolicyToolbar: React.FunctionComponent<TablePolicyToolbarProps> = (props) => {

    const {
        clearFilters,
        filterElements,
        setFilterElements,
        pageCount,
        count,
        page,
        perPage,
        showPerPageOptions,
        onPaginationChanged,
        onPaginationSizeChanged,
        onCreatePolicy,
        onDeletePolicy,
        hideActions,
        onSelectionChanged,
        selectedCount,
        hideBulkSelect,
        onEnablePolicy,
        onDisablePolicy,
        onExport
    } = props;

    const clearFiltersCallback = React.useCallback((_event, rawFilterConfigs: any[]) => {
        const filtersToClear: ClearFilterCommand[] = [];
        for (const element of rawFilterConfigs) {
            switch (element.category) {
                case FilterColumnToLabel[PolicyFilterColumn.NAME]:
                    filtersToClear.push({ filter: PolicyFilterColumn.NAME, data: '' });
                    break;
                case FilterColumnToLabel[PolicyFilterColumn.IS_ACTIVE]:
                    filtersToClear.push({
                        filter: PolicyFilterColumn.IS_ACTIVE,
                        data: {
                            ...filterElements[PolicyFilterColumn.IS_ACTIVE],
                            ...element.chips.reduce(
                                (result, chip) => {
                                    result[chip.key] = false;
                                    return result;
                                },
                                {})
                        }});
                    break;
                default:
                    throw new Error(`Unknown filter found: ${element.category}`);
            }
        }

        clearFilters(filtersToClear);
    }, [ clearFilters, filterElements ]);

    const bulkSelectProps = React.useMemo(() => {
        if (hideBulkSelect) {
            return undefined;
        }

        const selectNone = () => onSelectionChanged && onSelectionChanged(SelectionCommand.NONE);
        const selectPage = () => onSelectionChanged && onSelectionChanged(SelectionCommand.PAGE);
        const selectAll = () => onSelectionChanged && onSelectionChanged(SelectionCommand.ALL);

        return {
            count: selectedCount || 0,
            items: [
                {
                    title: 'Select none (0)',
                    onClick: selectNone
                },
                {
                    title: `Select page (${pageCount || 0})`,
                    onClick: selectPage
                },
                {
                    title: `Select all (${count || 0})`,
                    onClick: selectAll
                }
            ],
            checked: selectedCount === count,
            onSelect: (isChecked: boolean) => isChecked ? selectAll() : selectNone()
        };
    }, [ selectedCount, pageCount, onSelectionChanged, hideBulkSelect, count ]);

    const filterConfigProps = React.useMemo(() => ({
        items: [
            {
                label: 'Name',
                type: 'text',
                filterValues: {
                    id: 'filter-name',
                    value: filterElements[PolicyFilterColumn.NAME],
                    placeholder: 'Filter by name',
                    onChange: (_event, value: string) => setFilterElements[PolicyFilterColumn.NAME](value)
                }
            },
            {
                label: FilterColumnToLabel[PolicyFilterColumn.IS_ACTIVE],
                type: 'radio',
                filterValues: {
                    id: 'filter-active',
                    value: Object.keys(filterElements[PolicyFilterColumn.IS_ACTIVE]).reduce(
                        (val, key) => {
                            if (filterElements[PolicyFilterColumn.IS_ACTIVE][key]) {
                                val = key;
                            }

                            return val;
                        }, 'all'),
                    items: [{
                        label: <>All</>,
                        value: 'all'
                    }].concat(Object.keys(filterElements[PolicyFilterColumn.IS_ACTIVE]).map(key => ({
                        label: <IsActiveLabel key={ key } isActiveFilter={ key }/>,
                        value: key
                    }))),
                    placeholder: 'Filter by Enable status',
                    onChange: (_event, key: string) => {
                        const newValue = {
                            enabled: false,
                            disabled: false
                        };
                        const validKeys: (keyof IsActiveFilter)[] = [ 'enabled', 'disabled' ];
                        if ((validKeys as string[]).includes(key)) {
                            newValue[key] = true;
                        }

                        setFilterElements[PolicyFilterColumn.IS_ACTIVE](newValue);
                    }
                }
            }
        ]
    }), [ filterElements, setFilterElements ]);

    const topPaginationProps = React.useMemo<PaginationProps>(() => ({
        itemCount: count || 0,
        page,
        perPage,
        perPageOptions: showPerPageOptions ? undefined : [],
        onSetPage: onPaginationChanged,
        onFirstClick: onPaginationChanged,
        onPreviousClick: onPaginationChanged,
        onNextClick: onPaginationChanged,
        onLastClick: onPaginationChanged,
        onPageInput: onPaginationChanged,
        onPerPageSelect: onPaginationSizeChanged,
        isCompact: true,
        variant: PaginationVariant.top
    }), [ showPerPageOptions, count, page, perPage, onPaginationChanged, onPaginationSizeChanged ]);

    const bottomPaginationProps = React.useMemo<PaginationProps>(() => ({
        itemCount: count || 0,
        page,
        perPage,
        perPageOptions: showPerPageOptions ? undefined : [],
        onSetPage: onPaginationChanged,
        onFirstClick: onPaginationChanged,
        onPreviousClick: onPaginationChanged,
        onNextClick: onPaginationChanged,
        onLastClick: onPaginationChanged,
        onPageInput: onPaginationChanged,
        onPerPageSelect: onPaginationSizeChanged,
        isCompact: false,
        variant: PaginationVariant.bottom
    }), [ showPerPageOptions, count, page, perPage, onPaginationChanged, onPaginationSizeChanged ]);

    const activeFiltersConfigProps = React.useMemo(() => {
        const filterConfig: ReturnType<typeof getFilterConfig>[] = [];
        for (const filter of Object.values(PolicyFilterColumn)) {
            const config = getFilterConfig(filterElements, filter);
            if (config) {
                filterConfig.push(config);
            }
        }

        return {
            filters: filterConfig,
            onDelete: clearFiltersCallback
        };
    }, [ filterElements, clearFiltersCallback ]);

    const actionsConfigProps = React.useMemo(() => {
        if (hideActions) {
            return undefined;
        }

        const actions = [
            {
                key: 'create-policy',
                label: 'Create policy',
                onClick: onCreatePolicy,
                props: {
                    isDisabled: !onCreatePolicy
                }
            },
            {
                key: 'delete-policy',
                label: 'Delete',
                onClick: onDeletePolicy,
                props: {
                    isDisabled: !(selectedCount && onDeletePolicy)
                }
            },
            {
                key: 'enable-policy',
                label: 'Enable',
                onClick: onEnablePolicy,
                props: {
                    isDisabled: !(selectedCount && onEnablePolicy)
                }
            },
            {
                key: 'disable-policy',
                label: 'Disable',
                onClick: onDisablePolicy,
                props: {
                    isDisabled: !(selectedCount && onDisablePolicy)
                }
            }
        ];

        return {
            actions,
            kebabToggleProps: {
                isDisabled: false
            }
        };
    }, [ onCreatePolicy, onDeletePolicy, selectedCount, hideActions, onDisablePolicy, onEnablePolicy ]);

    const exportConfig = React.useMemo(() => {
        if (onExport) {
            return {
                extraItems: [],
                onSelect: onExport
            };
        }

        return undefined;
    }, [ onExport ]);

    return (
        <>
            <PrimaryToolbar
                bulkSelect={ bulkSelectProps }
                filterConfig={ filterConfigProps }
                pagination={ topPaginationProps }
                actionsConfig={ actionsConfigProps }
                activeFiltersConfig={ activeFiltersConfigProps }
                exportConfig={ exportConfig }
            />
            { props.children }
            { props.showBottomPagination && <PrimaryToolbar
                pagination={ bottomPaginationProps }
            /> }
        </>
    );
};
