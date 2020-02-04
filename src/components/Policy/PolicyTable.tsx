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
import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { Direction, Sort } from '../../types/Page';

interface PolicyTableProps {
    actions?: IActions;
    hasError?: boolean;
    errorType?: PolicyTableError;
    loading?: boolean;
    onSelect?: OnSelect;
    onSort?: (index: number, column: string, direction: Direction) => void;
    policies?: Policy[];
    sortBy?: Sort;
    httpStatus?: number;
}

export enum PolicyTableError {
    HTTP_ERROR,
    NO_PERMISSION_ERROR
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

interface ErrorContentProps {
    title: string;
    content: string;
}

const ErrorContent: React.FunctionComponent<ErrorContentProps> = (props) => {
    return (
        <>
            <EmptyStateIcon icon={ ExclamationCircleIcon }/>
            <Title size="lg">{ props.title }</Title>
            <EmptyStateBody>{ props.content }</EmptyStateBody>
        </>
    );
};

const httpErrorContent = (httpStatus?: number) => {
    switch (httpStatus) {
        case 404:
            return <ErrorContent
                title="Not found"
                content="The request did not provide any results, try to remove some filters and try again"
            />;
        case 500:
            return <ErrorContent
                title="Internal server error"
                content="The server was unable to process the request, please try again."
            />;
        case undefined:
        case null:
            return <ErrorContent
                title="Unable to connect"
                content="There was an error retrieving data. Check your connection and try again."
            />;
    }
};

const errorContent = (errorType: PolicyTableError, httpStatus?: number) => {
    switch (errorType) {
        case PolicyTableError.HTTP_ERROR:
            return httpErrorContent(httpStatus);
        case PolicyTableError.NO_PERMISSION_ERROR:
            return <ErrorContent
                title="No permission to view this page"
                content="You do not have permission to view this page"
            />;
    }
};

const error = (errorType?: PolicyTableError, httpStatus?: number): IRow[] => [{
    heightAuto: true,
    showSelect: false,
    cells: [
        {
            props: { colSpan: 8 },
            title: (
                <Bullseye>
                    <EmptyState variant={ EmptyStateVariant.small }>
                        { errorType ? errorContent(errorType, httpStatus) : (
                            <ErrorContent title="Unknown error" content="Unknown error when trying to access"/>
                        ) }
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

    const rows = props.hasError ? error(props.errorType, props.httpStatus) : props.loading ? loading() : policiesToRows(props.policies);
    const actions = props.hasError || props.loading ? undefined : props.actions;
    const onSelect = props.hasError || props.loading ? undefined : props.onSelect;

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
