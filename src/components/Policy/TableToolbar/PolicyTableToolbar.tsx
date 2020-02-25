import * as React from 'react';
import { PaginationProps, PaginationVariant } from '@patternfly/react-core';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';

type OnPaginationPageChangedHandler = (
    event: React.SyntheticEvent<HTMLButtonElement> | React.MouseEvent | React.KeyboardEvent | MouseEvent, page: number) => void;
type OnPaginationSizeChangedHandler = (event: React.MouseEvent | React.KeyboardEvent | MouseEvent, perPage: number) => void;

export enum FilterColumn {
    NAME = 'name',
    DESCRIPTION = 'description',
    IS_ACTIVE = 'is_enabled'
}

export enum SelectionCommand {
    NONE,
    PAGE
}

export interface IsActiveFilter {
    enabled: boolean;
    disabled: boolean;
}

export interface FilterElement<T> {
    value: T;
    setter: (value: T) => void;
}

export interface Filters {
    [FilterColumn.NAME]: string;
    [FilterColumn.DESCRIPTION]: string;
    [FilterColumn.IS_ACTIVE]: IsActiveFilter;
}

export interface SetFilters {
    [FilterColumn.NAME]: (data: string) => void;
    [FilterColumn.DESCRIPTION]: (data: string) => void;
    [FilterColumn.IS_ACTIVE]: (data: IsActiveFilter) => void;
}

export interface ClearFilterCommand {
    filter: FilterColumn;
    data: unknown;
}

interface TablePolicyToolbarProps {
    count?: number;
    filterElements: Filters;
    setFilterElements: SetFilters;
    clearFilters: (filters: ClearFilterCommand[]) => void;
    onCreatePolicy?: () => void;
    onDeletePolicy?: () => void;
    onPaginationChanged?: OnPaginationPageChangedHandler;
    onPaginationSizeChanged?: OnPaginationSizeChangedHandler;
    onSelectionChanged?: (command: SelectionCommand) => void;
    selectedCount?: number;
    page: number;
    pageCount?: number;
    perPage: number;
}

const FilterColumnToLabel: Record<FilterColumn, string> = {
    [FilterColumn.NAME]: 'Name',
    [FilterColumn.DESCRIPTION]: 'Description',
    [FilterColumn.IS_ACTIVE]: 'Is Active?'
};

const IsActiveKeyToLabel: Record<keyof IsActiveFilter, string> = {
    enabled: 'Active',
    disabled: 'Inactive'
};

const getFilterConfigString = (rawValue: string, filter: FilterColumn) => {
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

const getFilterConfigIsActiveFilter = (value: IsActiveFilter, filter: FilterColumn) => {
    if (!value.enabled && !value.disabled) {
        return undefined;
    }

    return {
        category: FilterColumnToLabel[filter],
        chips: Object.keys(value).filter(key => value[key]).map(key => ({
            name: IsActiveKeyToLabel[key],
            isRead: true,
            key
        }))
    };
};

const getFilterConfig = (filters: Filters, filter: FilterColumn) => {
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
        onPaginationChanged,
        onPaginationSizeChanged,
        onCreatePolicy,
        onDeletePolicy,
        onSelectionChanged,
        selectedCount
    } = props;

    const clearFiltersCallback = React.useCallback((_event, rawFilterConfigs: any[]) => {
        const filtersToClear: ClearFilterCommand[] = [];
        for (const element of rawFilterConfigs) {
            switch (element.category) {
                case FilterColumnToLabel[FilterColumn.NAME]:
                    filtersToClear.push({ filter: FilterColumn.NAME, data: '' });
                    break;
                case FilterColumnToLabel[FilterColumn.DESCRIPTION]:
                    filtersToClear.push({ filter: FilterColumn.DESCRIPTION, data: '' });
                    break;
                case FilterColumnToLabel[FilterColumn.IS_ACTIVE]:
                    filtersToClear.push({
                        filter: FilterColumn.IS_ACTIVE,
                        data: {
                            ...filterElements[FilterColumn.IS_ACTIVE],
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
        const selectNone = () => onSelectionChanged && onSelectionChanged(SelectionCommand.NONE);
        const selectPage = () => onSelectionChanged && onSelectionChanged(SelectionCommand.PAGE);

        return {
            count: selectedCount || 0,
            items: [
                {
                    title: 'Select none (0)',
                    onClick: selectNone
                },
                {
                    title: `Select page (${pageCount})`,
                    onClick: selectPage
                }
            ],
            checked: selectedCount === pageCount,
            onSelect: (isChecked: boolean) => isChecked ? selectPage() : selectNone()
        };
    }, [ selectedCount, pageCount, onSelectionChanged ]);

    const filterConfigProps = React.useMemo(() => ({
        items: [
            {
                label: 'Name',
                type: 'text',
                filterValues: {
                    id: 'filter-name',
                    value: filterElements[FilterColumn.NAME],
                    placeholder: 'Filter by name',
                    onChange: (_event, value: string) => setFilterElements[FilterColumn.NAME](value)
                }
            },
            {
                label: 'Description',
                type: 'text',
                filterValues: {
                    id: 'filter-description',
                    value: filterElements[FilterColumn.DESCRIPTION],
                    placeholder: 'Filter by description',
                    onChange: (_event, value: string) => setFilterElements[FilterColumn.DESCRIPTION](value)
                }
            },
            {
                label: 'Is Active?',
                type: 'checkbox',
                filterValues: {
                    id: 'filter-active',
                    value: Object.keys(filterElements[FilterColumn.IS_ACTIVE]).reduce(
                        (val, key) => {
                            if (filterElements[FilterColumn.IS_ACTIVE][key]) {
                                val.push(key);
                            }

                            return val;
                        }, [] as string[]),
                    items: Object.keys(filterElements[FilterColumn.IS_ACTIVE]).map(key => ({
                        label: IsActiveKeyToLabel[key],
                        value: key
                    })),
                    placeholder: 'Filter by Active status',
                    onChange: (_event, values: string) => {
                        const newValue = {
                            enabled: false,
                            disabled: false
                        };
                        for (const value of values) {
                            switch (value) {
                                case 'enabled':
                                    newValue.enabled = true;
                                    break;
                                case 'disabled':
                                    newValue.disabled = true;
                                    break;
                                default:
                                    throw new Error(`Invalid filter active status found: ${value}`);
                            }
                        }

                        setFilterElements[FilterColumn.IS_ACTIVE](newValue);
                    }
                }
            }
        ]
    }), [ filterElements, setFilterElements ]);

    const paginationProps = React.useMemo<PaginationProps>(() => ({
        itemCount: count || 0,
        page,
        perPage,
        onSetPage: onPaginationChanged,
        onFirstClick: onPaginationChanged,
        onPreviousClick: onPaginationChanged,
        onNextClick: onPaginationChanged,
        onLastClick: onPaginationChanged,
        onPageInput: onPaginationChanged,
        onPerPageSelect: onPaginationSizeChanged,
        isCompact: true,
        variant: PaginationVariant.right
    }), [ count, page, perPage, onPaginationChanged, onPaginationSizeChanged ]);

    const activeFiltersConfigProps = React.useMemo(() => {
        const filterConfig: ReturnType<typeof getFilterConfig>[] = [];
        for (const filter of Object.values(FilterColumn)) {
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
        const actions = [
            {
                key: 'create-policy',
                label: 'Create policy',
                onClick: onCreatePolicy,
                props: {
                    // Todo: Remove from here if https://github.com/RedHatInsights/frontend-components/pull/376 is merged
                    onClick: onCreatePolicy,
                    isDisabled: !onCreatePolicy
                }
            },
            {
                key: 'delete-policy',
                label: selectedCount === 1 ? 'Delete policy' : 'Delete policies',
                onClick: onDeletePolicy,
                props: {
                    isDisabled: !(selectedCount && onDeletePolicy)
                }
            }
        ];

        return {
            actions,
            kebabToggleProps: {
                isDisabled: !(selectedCount && onDeletePolicy)
            }
        };
    }, [ onCreatePolicy, onDeletePolicy, selectedCount ]);

    return (
        <>
            <PrimaryToolbar
                bulkSelect={ bulkSelectProps }
                filterConfig={ filterConfigProps }
                pagination={ paginationProps }
                actionsConfig={ actionsConfigProps }
                activeFiltersConfig={ activeFiltersConfigProps }
            />
        </>
    );
};
