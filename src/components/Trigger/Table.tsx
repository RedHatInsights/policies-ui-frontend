import * as React from 'react';
import {
    Table,
    TableHeader,
    TableBody,
    ICell,
    sortable,
    IRow,
    SortByDirection,
    ISortBy
} from '@patternfly/react-table';
import { Messages } from '../../properties/Messages';
import { Trigger } from '../../types/Trigger';
import formatRFC7231 from 'date-fns/formatRFC7231';
import { Direction, Sort } from '../../types/Page';

interface TriggerTableProps {
    rows?: Trigger[];
    sortBy?: Sort;
    onSort?: (index: number, column: string, direction: Direction) => void;
}

const cells: ICell[] = [
    {
        title: Messages.tables.trigger.columns.date,
        transforms: [ sortable ]
    },
    {
        title: Messages.tables.trigger.columns.system,
        transforms: [ sortable ]
    }
];

export const TriggerTable: React.FunctionComponent<TriggerTableProps> = (props) => {

    const rows = React.useMemo((): IRow[] => {
        const triggers = props.rows;
        if (triggers) {
            return triggers.map(t => ({
                cells: [
                    <>{ formatRFC7231(t.created) }</>,
                    t.hostName
                ]
            }));
        }

        return [];
    }, [ props.rows ]);

    const onSortHandler = React.useCallback((_event, index: number, direction: SortByDirection) => {
        const onSort = props.onSort;
        if (onSort) {
            const column = index === 0 ? 'date' : 'system';
            onSort(index, column, direction === SortByDirection.asc ? Direction.ASCENDING : Direction.DESCENDING);
        }
    }, [ props.onSort ]);

    const sortBy = React.useMemo<ISortBy | undefined>(() => {
        if (props.sortBy) {
            return {
                index: props.sortBy.column === 'date' ? 0 : 1,
                direction: props.sortBy.direction === Direction.ASCENDING ? 'asc' : 'desc'
            };
        }

        return undefined;
    }, [ props.sortBy ]);

    return (
        <Table
            aria-label={ Messages.tables.trigger.title }
            rows={ rows }
            cells={ cells }
            onSort={ onSortHandler }
            sortBy={ sortBy }
        >
            <TableHeader/>
            <TableBody/>
        </Table>
    );
};
