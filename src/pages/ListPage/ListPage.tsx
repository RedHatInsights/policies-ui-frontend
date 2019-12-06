import * as React from 'react';
import { Table, TableHeader, TableBody, IRow, IActions } from '@patternfly/react-table';
import { CheckCircleIcon,  PlusCircleIcon } from '@patternfly/react-icons';

import { PageHeader, Main, Section, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { Policy } from '../../types/Policy';
import { Link } from 'react-router-dom';
import { deletePolicy, getPolicies } from '../../services/Api';
import CpContext from '../../utils/CPContext';

type ListPageProps = {};
type ListPageState = {
    columns: string[];
    rows: IRow[];
    actions: IActions;
    rawData: Policy[];
    needsUpdate: boolean;
};

class ListPage extends React.Component<ListPageProps, ListPageState> {

    static contextType = CpContext;

    constructor(props: ListPageProps) {
        super(props);

        this.state = {
            columns: [
                'id', 'Name', 'Description', 'Conditions', 'Actions', 'Is active?'
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
                    onClick: (event, rowId, rowData) => {
                        alert('Delete ' + rowId + ' : ' + rowData.cells);
                        if (rowData.cells) {
                            this.deletePolicy(rowData.cells[0]);
                        }
                    }
                }
            ],
            rawData: [],
            needsUpdate: false
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
                        value.id,
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
        const customerId = this.context.accountNumber;
        getPolicies(customerId)
        .then(response => response.data)
        .then(data => this.setState({ rawData: data, needsUpdate: false }));
    }

    deletePolicy(cell: any) {
        const customerId = this.context.accountNumber;
        deletePolicy(customerId, cell)
        .then(response => response.status)
        .then(data => {
            alert('Code: ' + data);
            this.setState ({ needsUpdate: true });
        });
    }
}

export default ListPage;
