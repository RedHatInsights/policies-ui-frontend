import * as React from 'react';
import {
    IActions,
    ICell,
    IRow,
    ISortBy,
    OnSelect,
    sortable,
    SortByDirection,
    Table,
    TableBody,
    TableHeader
} from '@patternfly/react-table';
import { Bullseye, EmptyState, EmptyStateBody, EmptyStateIcon, EmptyStateVariant, Title } from '@patternfly/react-core';
import { Spinner } from '@patternfly/react-core/dist/js/experimental';
import { Policy } from '../../types/Policy';
import { CheckCircleIcon } from '@patternfly/react-icons';
import { Direction, Sort } from '../../types/Page';
import { IconType } from '@patternfly/react-icons/dist/js/createIcon';

interface PolicyTableProps {
    actions?: IActions;
    error?: ErrorContentProps;
    loading?: boolean;
    onSelect?: OnSelect;
    onSort?: (index: number, column: string, direction: Direction) => void;
    policies?: Policy[];
    sortBy?: Sort;
}

export interface ErrorContentProps {
    icon: IconType;
    title: string;
    content: string;
}

const loading = (): IRow[] => [{
    heightAuto: true,
    cells: [
        {
            props: { colSpan: 8 },
            title: (
                <Bullseye>
                    <EmptyState variant={ EmptyStateVariant.small }>
                        <EmptyStateIcon variant="container" component={ Spinner }/>
                        <Title size="lg">Loading</Title>
                    </EmptyState>
                </Bullseye>
            )
        }
    ]
}];

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

const policiesToRows = (policies?: Policy[]): IRow[] => {
    if (policies) {
        return policies.map(policy => ({
            showSelect: false,
            cells: [
                policy.name,
                policy.description,
                policy.conditions,
                policy.actions,
                policy.isEnabled ? <><CheckCircleIcon color="green"/></> : null
            ]
        }));
    }

    return [];
};

type Cell = ICell & {
    column?: string;
};

export const PolicyTable: React.FunctionComponent<PolicyTableProps> = (props) => {

    const transformSortable = props.onSort ? [ sortable ] : [];

    const namedColumns: Record<string, Cell> = {
        name: {
            title: 'Name',
            transforms: transformSortable,
            column: 'name'
        },
        description: {
            title: 'Description',
            transforms: transformSortable,
            column: 'description'
        },
        conditions: {
            title: 'Conditions',
            transforms: [ ]
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

    const onSort = (_event, index: number, direction: SortByDirection) => {
        if (props.onSort) {
            const column = columns[index - 1].column;
            if (column) {
                props.onSort(index, column, direction === SortByDirection.asc ? Direction.ASCENDING : Direction.DESCENDING);
            }
        }
    };

    const toISortBy = (sort?: Sort): ISortBy | undefined => {
        let iSortBy: ISortBy | undefined = undefined;
        if (sort) {
            iSortBy = {
                index: columns.indexOf(namedColumns[sort.column]) + 1, // sort index are 1-based
                direction: sort.direction === Direction.ASCENDING ? 'asc' : 'desc'
            };
        }

        return iSortBy;
    };

    const rows = props.error ? errorRow(props.error) : props.loading ? loading() : policiesToRows(props.policies);
    // Do not show actions or checkboxes if there is any error or is loading;
    const actions = props.error || props.loading ? undefined : props.actions;
    const onSelect = props.error || props.loading ? undefined : props.onSelect;

    return (
        <Table
            aria-label="Custom policies"
            cells={ columns }
            rows={ rows }
            actions={ actions }
            onSelect={ onSelect }
            onSort={ onSort }
            sortBy={ toISortBy(props.sortBy) }
        >
            <TableHeader/>
            <TableBody/>
        </Table>
    );
};
