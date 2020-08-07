import * as React from 'react';
import { PaginationProps, PaginationVariant } from '@patternfly/react-core';
import { PrimaryToolbar } from '@redhat-cloud-services/frontend-components';
import {
    ColumnsMetada,
    usePrimaryToolbarFilterConfig
} from '@redhat-cloud-services/insights-common-typescript';
import {
    ClearPolicyFilters,
    PolicyFilterColumn,
    PolicyFilters,
    SetPolicyFilters
} from '../../../types/Policy/Filters';
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
    filters: PolicyFilters;
    setFilters: SetPolicyFilters;
    clearFilters: ClearPolicyFilters;
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

const enabledTextClassName = style({
    marginLeft: 4
});

const filterMetadata: ColumnsMetada<typeof PolicyFilterColumn> = {
    [PolicyFilterColumn.NAME]: {
        label: 'Name',
        placeholder: 'Filter by name'
    },
    [PolicyFilterColumn.IS_ACTIVE]: {
        label: 'Enabled',
        placeholder: 'Filter by Enable status',
        options: {
            default: 'all',
            exclude: [ 'all' ],
            exclusive: true,
            items: [
                {
                    value: 'all',
                    label: <>All</>
                },
                {
                    value: 'Enabled',
                    label: <><EnabledPolicyIcon/> <span className={ enabledTextClassName }>Enabled</span></>
                },
                {
                    value: 'Disabled',
                    label: <><DisabledPolicyIcon/> <span className={ enabledTextClassName }>Disabled</span></>
                }
            ]
        }
    }
};

export const PolicyToolbar: React.FunctionComponent<TablePolicyToolbarProps> = (props) => {

    const {
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

    const primaryToolbarFilterConfig = usePrimaryToolbarFilterConfig(
        PolicyFilterColumn,
        props.filters,
        props.setFilters,
        props.clearFilters,
        filterMetadata
    );

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
                filterConfig={ primaryToolbarFilterConfig.filterConfig }
                pagination={ topPaginationProps }
                actionsConfig={ actionsConfigProps }
                activeFiltersConfig={ primaryToolbarFilterConfig.activeFiltersConfig }
                exportConfig={ exportConfig }
            />
            { props.children }
            { props.showBottomPagination && <PrimaryToolbar
                pagination={ bottomPaginationProps }
            /> }
        </>
    );
};
