import * as React from 'react';
import {
    expandable,
    IActions, IActionsResolver,
    ICell,
    IRow,
    IRowData,
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

interface PolicyTableProps {
    actions?: IActions;
    error?: ErrorContentProps;
    loading?: boolean;
    onSort?: (index: number, column: string, direction: Direction) => void;
    policies?: Policy[];
    sortBy?: Sort;
    httpStatus?: number;
}

export interface ErrorContentProps {
    icon: IconType;
    title: string;
    content: string;
}

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

const defaultRowState = (): RowState => {
    return { isOpen: true, isSelected: false };
};

const policiesToRows = (policies: Policy[] | undefined, rowState: Record<string, RowState>): IRow[] => {
    if (policies) {

        return policies.reduce((rows, policy, idx) => {
            const state = policy.id && rowState[policy.id] || defaultRowState();
            rows.push({
                id: policy.id,
                isOpen: state.isOpen,
                selected: state.isSelected,
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
                            key={ policy.id }
                            description={ policy.description }
                            conditions={ policy.conditions }
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

interface RowState {
    isOpen: boolean;
    isSelected: boolean;
}

const indexForColumn = (column: string, columns: Cell[], namedColumns: Record<string, Cell>) => {
    // sort index are 1-based and the expandable takes 1 space.
    return columns.indexOf(namedColumns[column]) + 2;
};

const columnNameForIndex = (index: number, columns: Cell[]) => {
    // index are 1-based and The expandable takes space in the index (apparently)
    return columns[index - 2].column;
};

export const PolicyTable: React.FunctionComponent<PolicyTableProps> = (props) => {

    const [ rowState, setRowState ] = React.useState<Record<string, RowState>>({});

    React.useEffect(() => {
        if (props.policies) {
            setRowState(props.policies.reduce((newRowState, policy) => {
                if (policy.id) {
                    newRowState[policy.id] = {
                        isOpen: false,
                        isSelected: false
                    };
                }

                return newRowState;
            }, {} as Record<string, RowState>));
        } else {
            setRowState({} as Record<string, RowState>);
        }
    }, [ props.policies ]);

    const transformSortable = props.onSort ? [ sortable ] : [];

    const namedColumns: Record<string, Cell> = {
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

    const columns: Cell[] = Object.values(namedColumns);

    const onSortProp = props.onSort;

    const onSort = React.useCallback((_event, index: number, direction: SortByDirection) => {
        if (onSortProp) {
            const column = columnNameForIndex(index, columns);
            if (column) {
                onSortProp(index, column, direction === SortByDirection.asc ? Direction.ASCENDING : Direction.DESCENDING);
            }
        }
    }, [ onSortProp, columns ]);

    const onCollapse = React.useCallback((_event, index: number, isOpen: boolean, data: IRowData) => {
        if (rowState[data.id].isOpen !== isOpen) {
            const newRowState = { ...rowState };
            newRowState[data.id] = { ...newRowState[data.id], isOpen };
            setRowState(newRowState);
        }
    }, [ rowState, setRowState ]);

    const onSelect = (_event, isSelected: boolean, index: number, data: IRowData) => {
        if (rowState[data.id].isSelected !== isSelected) {
            const newRowState = { ...rowState };
            newRowState[data.id] = { ...newRowState[data.id], isSelected };
            setRowState(newRowState);
        }
    };

    const sortBy = React.useMemo<ISortBy | undefined>(() => {
        if (props.sortBy) {
            return {
                index: indexForColumn(props.sortBy.column, columns, namedColumns),
                direction: props.sortBy.direction === Direction.ASCENDING ? 'asc' : 'desc'
            };
        }

        return undefined;
    }, [ props.sortBy, columns, namedColumns ]);

    const actions = props.error || props.loading ? [] : props.actions || [];

    const actionsResolver: IActionsResolver = (rowData) => {
        if (rowData.parent === undefined) {
            return actions;
        }

        return [];
    };

    const rows = props.error ? errorRow(props.error) : policiesToRows(props.policies, rowState);

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
            aria-label="Custom policies"
            cells={ columns }
            rows={ rows }
            actionResolver={ actionsResolver }
            onSelect={ props.error ? undefined : onSelect }
            onSort={ onSort }
            onCollapse={ onCollapse }
            sortBy={ sortBy }
            canSelectAll={ false }
        >
            <TableHeader/>
            <TableBody/>
        </Table>
    );
};
