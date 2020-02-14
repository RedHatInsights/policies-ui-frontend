import * as React from 'react';
import { Button, capitalize, PaginationProps, PaginationVariant } from '@patternfly/react-core';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';

type OnPaginationPageChangedHandler = (
    event: React.SyntheticEvent<HTMLButtonElement> | React.MouseEvent | React.KeyboardEvent | MouseEvent, page: number) => void;
type OnPaginationSizeChangedHandler = (event: React.MouseEvent | React.KeyboardEvent | MouseEvent, perPage: number) => void;

export enum Filter {
    NAME = 'Name',
    DESCRIPTION = 'Description',
    IS_ACTIVE = 'Is Active?'
}

export interface IsActiveFilter {
    enabled: boolean;
    disabled: boolean;
}

export interface FilterElement<T> {
    value: T;
    setter: (value: T) => void;
}

interface Filters {
    [Filter.NAME]: FilterElement<string>;
    [Filter.DESCRIPTION]: FilterElement<string>;
    [Filter.IS_ACTIVE]: FilterElement<IsActiveFilter>;
}

export interface ClearFilterCommand {
    filter: Filter;
    data: unknown;
}

interface TablePolicyToolbarProps {
    count?: number;
    filters: Filters;
    clearFilters: (filters: ClearFilterCommand[]) => void;
    onCreatePolicy?: () => void;
    onPaginationChanged?: OnPaginationPageChangedHandler;
    onPaginationSizeChanged?: OnPaginationSizeChangedHandler;
    page: number;
    pageCount?: number;
    perPage: number;
}

const getFilterConfigString = (rawValue: string, filter: Filter) => {
    const value = rawValue.trim();
    if (value === '') {
        return undefined;
    }

    return {
        category: filter,
        chips: [
            {
                name: value,
                isRead: true
            }
        ]
    };
};

const getFilterConfigIsActiveFilter = (value: IsActiveFilter, filter: Filter) => {
    if (!value.enabled && !value.disabled) {
        return undefined;
    }

    return {
        category: filter,
        chips: Object.keys(value).filter(key => value[key]).map(key => ({
            name: capitalize(key),
            isRead: true,
            key
        }))
    };
};

const getFilterConfig = (filters: Filters, filter: Filter) => {
    const rawValue: string | IsActiveFilter = filters[filter].value;

    if (typeof rawValue === 'string') {
        return getFilterConfigString(rawValue, filter);
    }

    return getFilterConfigIsActiveFilter(rawValue, filter);
};

const placeholderFn = (event, x) => console.log('placeholder', x, event);

export const PolicyToolbar: React.FunctionComponent<TablePolicyToolbarProps> = (props) => {

    const { clearFilters, filters, pageCount, count, page, perPage, onPaginationChanged, onPaginationSizeChanged, onCreatePolicy } = props;

    const clearFiltersCallback = React.useCallback((_event, rawFilterConfigs: any[]) => {
        const filtersToClear: ClearFilterCommand[] = [];
        for (const element of rawFilterConfigs) {
            switch (element.category) {
                case Filter.NAME:
                case Filter.DESCRIPTION:
                    filtersToClear.push({ filter: element.category as Filter, data: '' });
                    break;
                case Filter.IS_ACTIVE:
                    filtersToClear.push({
                        filter: element.category as Filter,
                        data: {
                            ...filters[Filter.IS_ACTIVE].value,
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
    }, [ clearFilters, filters ]);

    const bulkSelectProps = React.useMemo(() => ({
        count: 0,
        items: [
            {
                title: 'Select none (0)',
                onClick: placeholderFn
            },
            {
                title: `Select all (${pageCount})`,
                onClick: placeholderFn
            }
        ],
        checked: false,
        onSelect: placeholderFn
    }), [ pageCount ]);

    const filterConfigProps = React.useMemo(() => ({
        items: [
            {
                label: 'Name',
                type: 'text',
                filterValues: {
                    id: 'filter-name',
                    value: filters[Filter.NAME].value,
                    placeholder: 'Filter by name',
                    onChange: (_event, value: string) => filters[Filter.NAME].setter(value)
                }
            },
            {
                label: 'Description',
                type: 'text',
                filterValues: {
                    id: 'filter-description',
                    value: filters[Filter.DESCRIPTION].value,
                    placeholder: 'Filter by description',
                    onChange: (_event, value: string) => filters[Filter.DESCRIPTION].setter(value)
                }
            },
            {
                label: 'Is Active?',
                type: 'checkbox',
                filterValues: {
                    id: 'filter-active',
                    value: Object.keys(filters[Filter.IS_ACTIVE].value).reduce(
                        (val, key) => {
                            if (filters[Filter.IS_ACTIVE].value[key]) {
                                val.push(key);
                            }

                            return val;
                        }, [] as string[]),
                    items: Object.keys(filters[Filter.IS_ACTIVE].value).map(key => ({
                        label: capitalize(key),
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

                        filters[Filter.IS_ACTIVE].setter(newValue);
                    }
                }
            }
        ]
    }), [ filters ]);

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
        for (const filter of Object.values(Filter)) {
            const config = getFilterConfig(filters, filter);
            if (config) {
                filterConfig.push(config);
            }
        }

        return {
            filters: filterConfig,
            onDelete: clearFiltersCallback
        };
    }, [ filters, clearFiltersCallback ]);

    const actionsConfigProps = React.useMemo(() => ({
        actions: [
            <Button key="create-policy" onClick={ onCreatePolicy } isDisabled={ !onCreatePolicy }>Create policy</Button>
        ]
    }), [ onCreatePolicy ]);

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
