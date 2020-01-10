import * as React from 'react';
import { Table, TableHeader, TableBody, IRow, IActions, ICell, sortable, OnSelect } from '@patternfly/react-table';
import {
    Bullseye,
    EmptyState,
    EmptyStateBody,
    EmptyStateIcon,
    EmptyStateVariant,
    Title
} from '@patternfly/react-core';
import { Spinner } from '@patternfly/react-core/dist/js/experimental';
import { Policy } from '../../types/Policy';
import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';

interface PolicyTableProps {
    policies?: Policy[];
    actions?: IActions;
    loading?: boolean;
    hasError?: boolean;
    onSelect?: OnSelect;
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

const error = (): IRow[] => [{
    heightAuto: true,
    showSelect: false,
    cells: [
        {
            props: { colSpan: 8 },
            title: (
                <Bullseye>
                    <EmptyState variant={ EmptyStateVariant.small }>
                        <EmptyStateIcon icon={ ExclamationCircleIcon }/>
                        <Title size="lg">Unable to connect</Title>
                        <EmptyStateBody>
                            There was an error retrieving data. Check your connection and try again.
                        </EmptyStateBody>
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

export const PolicyTable: React.FunctionComponent<PolicyTableProps> = (props) => {

    const columns: ICell[] = [
        {
            title: 'Name',
            transforms: [ sortable ]
        },
        {
            title: 'Description',
            transforms: [ sortable ]

        },
        {
            title: 'Conditions',
            transforms: [ sortable ]

        },
        {
            title: 'Actions',
            transforms: [ sortable ]

        },
        {
            title: 'Is active?',
            transforms: [ sortable ]

        }
    ];

    const rows = props.hasError ? error() : props.loading ? loading() : policiesToRows(props.policies);
    const actions = props.hasError || props.loading ? undefined : props.actions;
    const onSelect = props.hasError || props.loading ? undefined : props.onSelect;

    return (
        <Table
            aria-label="Custom policies"
            cells={ columns }
            rows={ rows }
            actions={ actions }
            onSelect={ onSelect }
        >
            <TableHeader/>
            <TableBody/>
        </Table>
    );
};
