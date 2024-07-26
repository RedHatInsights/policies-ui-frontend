import {
    breakWord,     ICell,
    IRow,
    ISortBy, nowrap, sortable,     SortByDirection,
    Table,
    TableBody,
    TableHeader,
    TableText,
    wrappable } from '@patternfly/react-table';
import { SkeletonTable } from '@redhat-cloud-services/frontend-components';
import {
    Direction,
    OuiaComponentProps,
    Sort,
    toUtc } from '@redhat-cloud-services/insights-common-typescript';
import format from 'date-fns/format';
import * as React from 'react';

import { Messages } from '../../properties/Messages';
import { Trigger } from '../../types/Trigger';
import { getOuiaProps } from '../../utils/getOuiaProps';
import { TriggerTableEmptyState } from './Table/EmptyState';

interface TriggerTableProps extends OuiaComponentProps {
    rows?: Trigger[];
    sortBy?: Sort;
    onSort?: (index: number, column: string, direction: Direction) => void;
    loading?: boolean;
}

const cells: ICell[] = [
    {
        title: Messages.tables.trigger.columns.date,
        transforms: [ sortable ],
        cellTransforms: [ nowrap ]
    },
    {
        title: Messages.tables.trigger.columns.system,
        transforms: [ sortable ],
        cellTransforms: [ wrappable, breakWord ]
    }
];

const dateFormatString = 'dd MMM yyyy HH:mm:ss';

const linkToHost = (id: string) => `/insights/inventory/${id}/`;

export const TriggerTable: React.FunctionComponent<TriggerTableProps> = (props) => {

    const rows = React.useMemo((): IRow[] => {
        const triggers = props.rows;
        if (triggers) {
            return triggers.map((t, index) => ({
                id: `${t.id}-${index}`,
                key: `${t.id}-${index}`,
                cells: [
                    {
                        title: <TableText>{ format(toUtc(t.created), dateFormatString) } UTC</TableText>
                    },
                    {
                        title: t.id ? (
                            <TableText><a href={ linkToHost(t.id) }>{ t.hostName }</a></TableText>
                        ) : (
                            <TableText>{ t.hostName }</TableText>
                        )
                    }
                ]
            }));
        }

        return [];
    }, [ props.rows ]);

    const onSortHandler = React.useCallback((_event, index: number, direction: SortByDirection) => {
        const onSort = props.onSort;
        if (onSort) {
            const column = index === 0 ? 'ctime' : 'name';
            onSort(index, column, direction === SortByDirection.asc ? Direction.ASCENDING : Direction.DESCENDING);
        }
    }, [ props.onSort ]);

    const sortBy = React.useMemo<ISortBy | undefined>(() => {
        if (props.sortBy) {
            return {
                index: props.sortBy.column === 'ctime' ? 0 : 1,
                direction: props.sortBy.direction === Direction.ASCENDING ? 'asc' : 'desc'
            };
        }

        return undefined;
    }, [ props.sortBy ]);

    if (props.loading) {
        return (
            <SkeletonTable
                testID="trigger-table-loading"
                rowSize={ 10 }
                columns={ cells }
                sortBy={ sortBy }
            />
        );
    }

    if (rows.length === 0) {
        return (
            <TriggerTableEmptyState />
        );
    }

    return (
        <div { ...getOuiaProps('Trigger/Table', props) }>
            <Table
                aria-label={ Messages.tables.trigger.title }
                rows={ rows }
                cells={ cells }
                onSort={ onSortHandler }
                sortBy={ sortBy }
                isStickyHeader={ true }
            >
                <TableHeader />
                <TableBody />
            </Table>
        </div>
    );
};
