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
import { Bullseye, EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant, Title } from '@patternfly/react-core';
import { SkeletonTable } from '@redhat-cloud-services/frontend-components';

import { Policy } from '../../../types/Policy';
import { CheckCircleIcon, OffIcon } from '@patternfly/react-icons';
import { Direction, Sort } from '../../../types/Page';
import { ExpandedContent } from './ExpandedContent';
import { IconType } from '@patternfly/react-icons/dist/js/createIcon';
import { Messages } from '../../../properties/Messages';

interface PolicyTableProps {
    actions?: IActions;
    error?: ErrorContentProps;
    loading?: boolean;
    onSort?: (index: number, column: string, direction: Direction) => void;
    onCollapse?: (policy: PolicyRow, index: number, isOpen: boolean) => void;
    onSelect?: (policy: PolicyRow, index: number, isSelected: boolean) => void;
    policies?: PolicyRow[];
    sortBy?: Sort;
    httpStatus?: number;
}

export interface ErrorContentProps {
    icon: IconType;
    title: string;
    content: string;
}

export type PolicyRow = Policy & {
    isOpen: boolean;
    isSelected: boolean;
};

const ErrorContent: React.FunctionComponent<ErrorContentProps> = (props) => {
    return (
        <>
            <EmptyStateIcon icon={ props.icon }/>
            <Title size="lg">{ props.title }</Title>
            <EmptyStateBody>{ props.content }</EmptyStateBody>
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

const policiesToRows = (policies: PolicyRow[] | undefined): IRow[] => {
    if (policies) {
        return policies.reduce((rows, policy, idx) => {
            rows.push({
                id: policy.id,
                key: policy.id,
                isOpen: policy.isOpen,
                selected: policy.isSelected,
                cells: [
                    policy.name,
                    policy.actions,
                    policy.isEnabled ? <><CheckCircleIcon color="green"/></> : <><OffIcon /></>
                ]
            });
            rows.push({
                parent: idx * 2, // Every policy has two rows, the "row" and the "expanded row"
                fullWidth: true,
                showSelect: false,
                cells: [
                    <>
                        <ExpandedContent
                            key={ policy.id + '-content' }
                            description={ policy.description ? policy.description : Messages.tableDoubleDash + ' ' + Messages.tableNoDescription }
                            conditions={ policy.conditions ? policy.conditions : Messages.tableNoConditions }
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

const indexForColumn = (column: string, columns: Cell[], namedColumns: Record<string, Cell>) => {
    // sort index are 0-based but the expandable and the selection takes space (each one).
    return columns.indexOf(namedColumns[column]) + 2;
};

const columnNameForIndex = (index: number, columns: Cell[]) => {
    // index are 0-based but the expandable and selection takes space in the index (apparently)
    return columns[index - 2].column;
};

export const PolicyTable: React.FunctionComponent<PolicyTableProps> = (props) => {

    const { onSort, error, policies, onCollapse, onSelect } = props;

    const namedColumns: Record<string, Cell> = React.useMemo(() => {
        const transformSortable = onSort ? [ sortable ] : [];

        return {
            name: {
                title: 'Name',
                transforms: transformSortable,
                cellFormatters: [ expandable ],
                column: 'name'
            },
            actions: {
                title: 'Actions',
                transforms: [ ]
            },
            is_enabled: { // eslint-disable-line @typescript-eslint/camelcase
                title: 'Is active?',
                transforms: transformSortable,
                column: 'is_enabled'
            }
        };
    }, [ onSort ]);

    const columns: Cell[] = React.useMemo(() => Object.values(namedColumns), [ namedColumns ]);

    const onSortHandler = React.useCallback((_event, index: number, direction: SortByDirection) => {
        if (onSort) {
            const column = columnNameForIndex(index, columns);
            if (column) {
                onSort(index, column, direction === SortByDirection.asc ? Direction.ASCENDING : Direction.DESCENDING);
            }
        }
    }, [ onSort, columns ]);

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
                index: indexForColumn(props.sortBy.column, columns, namedColumns),
                direction: props.sortBy.direction === Direction.ASCENDING ? 'asc' : 'desc'
            };
        }

        return undefined;
    }, [ props.sortBy, columns, namedColumns ]);

    const actions = React.useMemo(() => props.error || props.loading ? [] : props.actions || [],
        [ props.error, props.loading, props.actions ]);

    const actionsResolver: IActionsResolver = React.useCallback((rowData) => {
        if (rowData.parent === undefined) {
            return actions;
        }

        return [];
    }, [ actions ]);

    const rows = React.useMemo(() => error ? errorRow(error) : policiesToRows(policies), [ error, policies ]);

    if (props.loading) {
        return (
            <SkeletonTable
                rowSize={ 10 }
                columns={ columns }
            />
        );
    }

    return (
        <Table
            aria-label={ Messages.tableTitle }
            cells={ columns }
            rows={ rows }
            actionResolver={ actionsResolver }
            onSort={ onSort ? onSortHandler : undefined }
            onCollapse={ onCollapse ? onCollapseHandler : undefined }
            onSelect={ !props.error && onSelect ? onSelectHandler : undefined }
            sortBy={ sortBy }
            canSelectAll={ false }
        >
            <TableHeader/>
            <TableBody/>
        </Table>
    );
};
