import * as React from 'react';
import { PaginationProps, PaginationVariant } from '@patternfly/react-core';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import { Page } from '../../types/Page';
import {
    ClearFilters,
    SetTriggerFilters,
    TriggerFilterColumn,
    TriggerFilters
} from '../../pages/PolicyDetail/hooks/useTriggerFilter';
import { ExporterType, exporterTypeFromString } from '../../utils/exporters/Type';

type OnPaginationPageChangedHandler = (
    event: React.SyntheticEvent<HTMLButtonElement> | React.MouseEvent | React.KeyboardEvent | MouseEvent, page: number) => void;

export interface TriggerTableToolbarProps {
    count?: number;
    onPaginationChanged?: OnPaginationPageChangedHandler;
    page: Page;
    pageCount?: number;

    filters: TriggerFilters;
    setFilters: SetTriggerFilters;
    clearFilters: ClearFilters;
    onExport: (type: ExporterType) => void;
}

const FilterColumnToLabel: Record<TriggerFilterColumn, string> = {
    [TriggerFilterColumn.SYSTEM]: 'System'
};

const getFilterConfig = (filters: TriggerFilters, filter: TriggerFilterColumn) => {
    const value = filters[filter].trim();
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

export const TriggerTableToolbar: React.FunctionComponent<TriggerTableToolbarProps> = (props) => {

    const paginationProps = React.useMemo<PaginationProps>(() => ({
        itemCount: props.count || 0,
        page: props.page.index,
        perPage: props.page.size,
        perPageOptions: [],
        onSetPage: props.onPaginationChanged,
        onFirstClick: props.onPaginationChanged,
        onPreviousClick: props.onPaginationChanged,
        onNextClick: props.onPaginationChanged,
        onLastClick: props.onPaginationChanged,
        onPageInput: props.onPaginationChanged,
        isCompact: true,
        variant: PaginationVariant.right
    }), [ props.onPaginationChanged, props.page, props.count ]);

    const filterConfigProps = React.useMemo(() => {
        const filters = props.filters;
        const setFilters = props.setFilters;
        return {
            items: [
                {
                    label: 'System',
                    type: 'text',
                    filterValues: {
                        id: 'filter-system',
                        value: filters[TriggerFilterColumn.SYSTEM],
                        placeholder: 'Filter by system',
                        onChange: (_event, value: string) => setFilters[TriggerFilterColumn.SYSTEM](value)
                    }
                }
            ]
        };
    }, [ props.filters, props.setFilters ]);

    const onFilterDelete = React.useCallback((_event, rawFilterConfigs: any[]) => {
        const clearFilters = props.clearFilters;
        const filtersToClear: Array<TriggerFilterColumn> = [];
        for (const element of rawFilterConfigs) {
            if (element.category === FilterColumnToLabel[TriggerFilterColumn.SYSTEM]) {
                filtersToClear.push(TriggerFilterColumn.SYSTEM);
            } else {
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
                pagination={ paginationProps }
                filterConfig={ filterConfigProps }
                activeFiltersConfig={ activeFiltersConfigProps }
                exportConfig={ exportConfig }
            />
        </>
    );
};
