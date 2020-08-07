import * as React from 'react';
import { PaginationProps, PaginationVariant } from '@patternfly/react-core';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import {
    Page,
    ExporterType,
    exporterTypeFromString, ColumnsMetada, usePrimaryToolbarFilterConfig
} from '@redhat-cloud-services/insights-common-typescript';
import { ClearTriggerFilters, SetTriggerFilters, TriggerFilterColumn, TriggerFilters } from './Filters';

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
    clearFilters: ClearTriggerFilters;
}

const filterMetadata: ColumnsMetada<typeof TriggerFilterColumn> = {
    [TriggerFilterColumn.NAME]: {
        label: 'System',
        placeholder: 'Filter by System'
    }
};

export const TriggerTableToolbar: React.FunctionComponent<TriggerTableToolbarProps> = (props) => {

    const primaryToolbarFilterConfig = usePrimaryToolbarFilterConfig(
        TriggerFilterColumn,
        props.filters,
        props.setFilters,
        props.clearFilters,
        filterMetadata
    );

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
                filterConfig={ primaryToolbarFilterConfig.filterConfig }
                activeFiltersConfig={ primaryToolbarFilterConfig.activeFiltersConfig }
            />
            { props.children }
            <PrimaryToolbar
                pagination={ bottomPaginationProps }
            />
        </>
    );
};
