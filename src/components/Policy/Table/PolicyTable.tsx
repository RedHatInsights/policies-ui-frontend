import * as React from 'react';
import {
    expandable,
    IActions, IActionsResolver,
    ICell,
    IRow, IRowData,
    ISortBy,
    sortable,
    SortByDirection,
    Table,
    TableBody,
    TableHeader
} from '@patternfly/react-table';
import {
    Bullseye,
    Button,
    ButtonVariant,
    EmptyState,
    EmptyStateBody,
    EmptyStateIcon,
    EmptyStateVariant,
    Radio,
    Title
} from '@patternfly/react-core';
import { SkeletonTable } from '@redhat-cloud-services/frontend-components';

import { Policy } from '../../../types/Policy';
import { CheckCircleIcon, OffIcon } from '@patternfly/react-icons';
import { Direction, Sort } from '../../../types/Page';
import { ExpandedContent } from './ExpandedContent';
import { IconType } from '@patternfly/react-icons/dist/js/createIcon';
import { Messages } from '../../../properties/Messages';
import { assertNever } from '../../../utils/Assert';
import { ActionsCell } from './ActionsCell';

type OnSelectHandlerType = (policy: PolicyRow, index: number, isSelected: boolean) => void;

interface PolicyTableProps {
    actions?: IActions;
    error?: ErrorContentProps;
    loading?: boolean;
    loadingRowCount?: number;
    onSort?: (index: number, column: string, direction: Direction) => void;
    onCollapse?: (policy: PolicyRow, index: number, isOpen: boolean) => void;
    onSelect?: OnSelectHandlerType;
    policies?: PolicyRow[];
    sortBy?: Sort;
    httpStatus?: number;
    columnsToShow?: ValidColumns[];
}

export interface ErrorContentProps {
    icon: IconType;
    iconColor?: string;
    title: string;
    content: string;
    action?: () => void;
    actionLabel?: string;
}

export type PolicyRow = Policy & {
    isOpen: boolean;
    isSelected: boolean;
};

export type ValidColumns = 'name' | 'actions' | 'is_enabled' | 'radioSelect';

const defaultColumnsToShow: ValidColumns[] = [ 'name', 'actions', 'is_enabled' ];

const ErrorContent: React.FunctionComponent<ErrorContentProps> = (props) => {
    return (
        <>
            <EmptyStateIcon icon={ props.icon } color={ props.iconColor }/>
            <Title headingLevel="h2" size="lg">{ props.title }</Title>
            <EmptyStateBody>{ props.content }</EmptyStateBody>
            { props.action && props.actionLabel && (
                <Button variant={ ButtonVariant.primary } onClick={ props.action }>{ props.actionLabel } </Button>
            ) }
        </>
    );
};

const errorRow = (props: ErrorContentProps): IRow[] => [{
    heightAuto: true,
    showSelect: false,
    cells: [
        {
            props: { colSpan: 8 },
            title: (
                <Bullseye>
                    <EmptyState variant={ EmptyStateVariant.small }>
                        <ErrorContent { ...props }/>
                    </EmptyState>
                </Bullseye>
            )
        }
    ]
}];

const policiesToRows = (policies: PolicyRow[] | undefined, columnsToShow: ValidColumns[], onSelect?: OnSelectHandlerType): IRow[] => {
    if (policies) {
        return policies.reduce((rows, policy, idx) => {
            rows.push({
                id: policy.id,
                key: policy.id,
                isOpen: policy.isOpen,
                selected: policy.isSelected,
                cells: columnsToShow.map(column => {
                    switch (column) {
                        case 'actions':
                            return  <><ActionsCell actions={ policy.actions }/></>;
                        case 'is_enabled':
                            return policy.isEnabled ? <><CheckCircleIcon color="green"/></> : <><OffIcon /></>;
                        case 'name':
                            return policy.name;
                        case 'radioSelect':
                            return <>
                                <Radio
                                    id={ `${policy.id}-table-radio-id` }
                                    aria-label={ `Radio select for policy ${policy.name}` }
                                    name={ `policy-table-radio-select` }
                                    isChecked={ policy.isSelected }

                                    onChange={ !onSelect ? undefined : () => {
                                        const selectedIndex = policies.findIndex(policy => policy.isSelected);
                                        onSelect(policies[selectedIndex], selectedIndex, false);
                                        onSelect(policy, idx, true);
                                    } }
                                />
                            </>;
                    }

                    assertNever(column);
                })
            });
            rows.push({
                parent: idx * 2, // Every policy has two rows, the "row" and the "expanded row"
                fullWidth: true,
                showSelect: false,
                cells: [
                    <>
                        <ExpandedContent
                            key={ policy.id + '-content' }
                            description={ policy.description ? policy.description : Messages.tables.policy.emptyState.noDescription }
                            conditions={ policy.conditions ? policy.conditions : Messages.tables.policy.emptyState.noConditions }
                            actions={ policy.actions }
                            created={ new Date(2020, 1, 19) }
                            updated={ policy.mtime }
                        />
                    </>
                ]
            });
            return rows;
        }, [] as IRow[]);
    }

    return [];
};

type Cell = ICell & {
    column?: string;
};

const indexForColumn = (column: string, columns: Cell[], namedColumns: Record<string, Cell>, columnOffset: number) => {
    return columns.indexOf(namedColumns[column]) + columnOffset;
};

const columnNameForIndex = (index: number, columns: Cell[], columnOffset: number) => {
    return columns[index - columnOffset].column;
};

export const PolicyTable: React.FunctionComponent<PolicyTableProps> = (props) => {

    const { onSort, error, policies, onCollapse, onSelect } = props;
    const columnsToShow = props.columnsToShow || defaultColumnsToShow;

    const usesRadioSelect = columnsToShow.includes('radioSelect');

    if (usesRadioSelect && !onSelect) {
        throw Error('RadioSelect requires an onSelect');
    }

    const namedColumns: Record<ValidColumns, Cell> = React.useMemo(() => {
        const transformSortable = onSort ? [ sortable ] : [];

        return {
            radioSelect: {
                title: '',
                transforms: [ ]
            },
            name: {
                title: Messages.tables.policy.columns.name,
                transforms: transformSortable,
                cellFormatters: [ expandable ],
                column: 'name'
            },
            actions: {
                title: Messages.tables.policy.columns.triggerActions,
                transforms: [ ]
            },
            is_enabled: {
                title: Messages.tables.policy.columns.lastTriggered,
                transforms: transformSortable,
                column: 'is_enabled'
            }
        };
    }, [ onSort ]);

    const columnOffset = React.useMemo(
        () => [ onCollapse, onSelect || columnsToShow.includes('radioSelect') ].filter(element => element).length,
        [ onCollapse, onSelect, columnsToShow ]
    );

    const columns: Cell[] = React.useMemo(() => columnsToShow.map(column => namedColumns[column]), [ namedColumns, columnsToShow ]);

    const onSortHandler = React.useCallback((_event, index: number, direction: SortByDirection) => {
        if (onSort) {
            const column = columnNameForIndex(index, columns, columnOffset);
            if (column) {
                onSort(index, column, direction === SortByDirection.asc ? Direction.ASCENDING : Direction.DESCENDING);
            }
        }
    }, [ onSort, columns, columnOffset ]);

    const onCollapseHandler = React.useCallback((_event, _index: number, isOpen: boolean, data: IRowData) => {
        const index = policies?.findIndex(policy => policy.id === data.id);
        if (onCollapse && policies && index !== undefined && index !== -1) {
            const policy = policies[index];
            onCollapse(policy, index, isOpen);
        }
    }, [ policies, onCollapse ]);

    const onSelectHandler = React.useCallback((_event, isSelected: boolean, _index: number, data: IRowData) => {
        const index = policies?.findIndex(policy => policy.id === data.id);
        if (onSelect && policies && index !== undefined && index !== -1) {
            const policy = policies[index];
            onSelect(policy, index, isSelected);
        }
    }, [ policies, onSelect ]);

    const sortBy = React.useMemo<ISortBy | undefined>(() => {
        if (props.sortBy) {
            return {
                index: indexForColumn(props.sortBy.column, columns, namedColumns, columnOffset),
                direction: props.sortBy.direction === Direction.ASCENDING ? 'asc' : 'desc'
            };
        }

        return undefined;
    }, [ props.sortBy, columns, namedColumns, columnOffset ]);

    const actions = React.useMemo(() => props.error || props.loading ? [] : props.actions || [],
        [ props.error, props.loading, props.actions ]);

    const actionsResolver: IActionsResolver = React.useCallback((rowData) => {
        if (rowData.parent === undefined) {
            return actions;
        }

        return [];
    }, [ actions ]);

    const rows = React.useMemo(
        () => error ? errorRow(error) : policiesToRows(policies, columnsToShow, onSelect),
        [ error, policies, columnsToShow, onSelect ]
    );

    if (props.loading) {
        return (
            <SkeletonTable
                rowSize={ props.loadingRowCount || 10 }
                columns={ columns }
            />
        );
    }

    return (
        <Table
            aria-label={ Messages.tables.policy.title }
            cells={ columns }
            rows={ rows }
            actionResolver={ actionsResolver }
            onSort={ onSort ? onSortHandler : undefined }
            onCollapse={ onCollapse ? onCollapseHandler : undefined }
            onSelect={  !props.error && onSelect && !usesRadioSelect ? onSelectHandler : undefined }
            sortBy={ sortBy }
            canSelectAll={ false }
        >
            <TableHeader/>
            <TableBody/>
        </Table>
    );
};
