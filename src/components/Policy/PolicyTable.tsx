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
    actions?: IActions;
    hasError?: boolean;
    loading?: boolean;
    onSelect?: OnSelect;
    policies?: Policy[];
    httpStatus?: number;
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

const errorContent = (httpStatus?: number) => {
    console.log(httpStatus);
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

const error = (httpStatus?: number): IRow[] => [{
    heightAuto: true,
    showSelect: false,
    cells: [
        {
            props: { colSpan: 8 },
            title: (
                <Bullseye>
                    <EmptyState variant={ EmptyStateVariant.small }>
                        { errorContent(httpStatus) }
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
            transforms: [ ]

        },
        {
            title: 'Actions',
            transforms: [ ]

        },
        {
            title: 'Is active?',
            transforms: [ sortable ]

        }
    ];

    const rows = props.hasError ? error(props.httpStatus) : props.loading ? loading() : policiesToRows(props.policies);
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
