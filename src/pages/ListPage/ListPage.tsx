import * as React from 'react';
import { Table, TableHeader, TableBody, IRow, IActions } from '@patternfly/react-table';
import { CheckCircleIcon,  PlusCircleIcon } from '@patternfly/react-icons';

import { PageHeader, Main, Section, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { Policy } from '../../types/Policy';
import { Link } from 'react-router-dom';
import { getPolicies } from '../../services/Api';

type ListPageProps = {};
type ListPageState = {
    columns: string[];
    rows: IRow[];
    actions: IActions;
    rawData: Policy[];
};

class ListPage extends React.Component<ListPageProps, ListPageState> {

    constructor(props: ListPageProps) {
        super(props);

        this.state = {
            columns: [
                'Name', 'Description', 'Conditions', 'Actions', 'Is active?'
            ],
            rows: [],
            actions: [
                {
                    title: 'Edit',
                    onClick: () => alert('Edit')
                },
                {
                    title: 'Clone',
                    onClick: () => alert('Clone')
                },
                {
                    title: 'Delete',
                    onClick: () => alert('Delete')
                }
            ],
            rawData: []
        };
    }

    rows = (): IRow[] => {
        if (!this.state.rawData) {
            return this.state.rows;
        }
        else {
            const rows: IRow[] = [];
            this.state.rawData.map(value =>
                rows.push({
                    cells: [
                        value.name,
                        value.description,
                        value.conditions,
                        value.actions,
                        value.isEnabled ? <><CheckCircleIcon color={ 'green' } size={ 'md' }/></> : <></>
                    ]
                })
            );
            return rows;
        }
    };

    render() {
        return (
            <>
                <PageHeader>
                    <PageHeaderTitle title="Custom policies"/>
                </PageHeader>
                <Main>
                    <Section>
                        <Table aria-label="Custom policies list" cells={ this.state.columns } rows={ this.rows() } actions={ this.state.actions }>
                            <TableHeader/>
                            <TableBody/>
                        </Table>
                    </Section>
                    <Section>
                        <div/>
                        <Link to="/add" className="btn btn-primary"><PlusCircleIcon size={ 'lg' }/>Add new Policy</Link>
                    </Section>
                </Main>
            </>
        );
    }

    componentDidMount() {
        const customerId = '1';
        getPolicies(customerId)
        .then(response => response.data)
        .then(data => this.setState({ rawData: data }));
    }

}

export default ListPage;
