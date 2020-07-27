import * as React from 'react';
import { PaginationProps, PaginationVariant } from '@patternfly/react-core';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import {
    Page,
    ExporterType,
    exporterTypeFromString
} from '@redhat-cloud-services/insights-common-typescript';
import {
    ClearFilters,
    SetTriggerFilters,
    TriggerFilterColumn,
    TriggerFilters
} from '../../pages/PolicyDetail/hooks/useTriggerFilter';

type OnPaginationPageChangedHandler = (
    event: React.SyntheticEvent<HTMLButtonElement> | React.MouseEvent | React.KeyboardEvent | MouseEvent, page: number) => void;
type OnPaginationSizeChangedHandler = (event: React.MouseEvent | React.KeyboardEvent | MouseEvent, perPage: number) => void;

export interface TriggerTableToolbarProps {
    count?: number;
    onPaginationChanged?: OnPaginationPageChangedHandler;
    onPaginationSizeChanged?: OnPaginationSizeChangedHandler;
    page: Page;
    pageCount?: number;
    onExport: (type: ExporterType) => void;
    filters: TriggerFilters;
    setFilters: SetTriggerFilters;
    clearFilters: ClearFilters;
}

const filterColumnToLabel: Record<TriggerFilterColumn, string> = {
    [TriggerFilterColumn.NAME]: 'Name',
    [TriggerFilterColumn.ID]: 'Id'
};

const getFilterConfig = (filters: TriggerFilters, filter: TriggerFilterColumn) => {
    const value = filters[filter].trim();
    if (value === '') {
        return undefined;
    }

    return {
        category: filterColumnToLabel[filter],
        chips: [
            {
                name: value,
                isRead: true
            }
        ]
    };
};

export const TriggerTableToolbar: React.FunctionComponent<TriggerTableToolbarProps> = (props) => {

    const topPaginationProps = React.useMemo<PaginationProps>(() => ({
        itemCount: props.count || 0,
        page: props.page.index,
        perPage: props.page.size,
        perPageOptions: undefined,
        onSetPage: props.onPaginationChanged,
        onFirstClick: props.onPaginationChanged,
        onPreviousClick: props.onPaginationChanged,
        onNextClick: props.onPaginationChanged,
        onLastClick: props.onPaginationChanged,
        onPageInput: props.onPaginationChanged,
        onPerPageSelect: props.onPaginationSizeChanged,
        isCompact: true,
        variant: PaginationVariant.top
    }), [ props.onPaginationChanged, props.page, props.count, props.onPaginationSizeChanged ]);

    const bottomPaginationProps = React.useMemo<PaginationProps>(() => ({
        itemCount: props.count || 0,
        page: props.page.index,
        perPage: props.page.size,
        perPageOptions: undefined,
        onSetPage: props.onPaginationChanged,
        onFirstClick: props.onPaginationChanged,
        onPreviousClick: props.onPaginationChanged,
        onNextClick: props.onPaginationChanged,
        onLastClick: props.onPaginationChanged,
        onPageInput: props.onPaginationChanged,
        onPerPageSelect: props.onPaginationSizeChanged,
        isCompact: false,
        variant: PaginationVariant.bottom
    }), [ props.onPaginationChanged, props.page, props.count, props.onPaginationSizeChanged ]);

    const filterConfigProps = React.useMemo(() => {
        const filters = props.filters;
        const setFilters = props.setFilters;
        return {
            items: [
                {
                    label: filterColumnToLabel[TriggerFilterColumn.NAME],
                    type: 'text',
                    filterValues: {
                        id: 'filter-name',
                        value: filters[TriggerFilterColumn.NAME],
                        placeholder: 'Filter by System name',
                        onChange: (_event, value: string) => setFilters[TriggerFilterColumn.NAME](value)
                    }
                },
                {
                    label: filterColumnToLabel[TriggerFilterColumn.ID],
                    type: 'text',
                    filterValues: {
                        id: 'filter-id',
                        value: filters[TriggerFilterColumn.ID],
                        placeholder: 'Filter by System id',
                        onChange: (_event, value: string) => setFilters[TriggerFilterColumn.ID](value)
                    }
                }
            ]
        };
    }, [ props.filters, props.setFilters ]);

    const onFilterDelete = React.useCallback((_event, rawFilterConfigs: any[]) => {
        const clearFilters = props.clearFilters;
        const filtersToClear: Array<TriggerFilterColumn> = [];
        for (const element of rawFilterConfigs) {
            const key = Object.keys(filterColumnToLabel).find(key => filterColumnToLabel[key] === element.category);
            switch (key) {
                case TriggerFilterColumn.NAME:
                    filtersToClear.push(TriggerFilterColumn.NAME);
                    break;
                case TriggerFilterColumn.ID:
                    filtersToClear.push(TriggerFilterColumn.ID);
                    break;
                default:
                    throw new Error(`Unknown filter found: ${element.category}`);
            }
        }

        clearFilters(filtersToClear);
    }, [ props.clearFilters ]);

    const activeFiltersConfigProps = React.useMemo(() => {
        const filters = props.filters;
        const filterConfig: ReturnType<typeof getFilterConfig>[] = [];
        for (const filter of Object.values(TriggerFilterColumn)) {
            const config = getFilterConfig(filters, filter);
            if (config) {
                filterConfig.push(config);
            }
        }

        return {
            filters: filterConfig,
            onDelete: onFilterDelete
        };
    }, [ props.filters, onFilterDelete ]);

    const exportConfig = React.useMemo(() => {
        const onExport = props.onExport;
        return {
            extraItems: [],
            onSelect: (_event, type: string) => {
                onExport(exporterTypeFromString(type));
            },
            'data-testid': 'trigger-toolbar-export-container'
        };
    }, [ props.onExport ]);

    return (
        <>
            <PrimaryToolbar
                pagination={ topPaginationProps }
                exportConfig={ exportConfig }
                filterConfig={ filterConfigProps }
                activeFiltersConfig={ activeFiltersConfigProps }
            />
            { props.children }
            <PrimaryToolbar
                pagination={ bottomPaginationProps }
            />
        </>
    );
};
