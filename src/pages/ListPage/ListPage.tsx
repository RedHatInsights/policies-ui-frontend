import * as React from 'react';
import { Table, TableHeader, TableBody, IRow, IActions } from '@patternfly/react-table';
import { OutlinedCheckCircleIcon, OutlinedCircleIcon } from '@patternfly/react-icons';

import { PageHeader, Main, Section, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';

type ListPageProps = {};
type ListPageState = {
    columns: string[];
    rows: IRow[];
    actions: IActions;
};

class ListPage extends React.Component<ListPageProps, ListPageState> {

    constructor(props: ListPageProps) {
        super(props);
        this.state = {
            columns: [
                'Name', 'Conditions', 'Actions', 'Is Active?'
            ],
            rows: [
                {
                    cells: [
                        'Etiam sollicitudin diam id lectus mollis tempor.',
                        'Donec at magna ac augue sollicitudin tempus.',
                        'N/A',
                        <><OutlinedCheckCircleIcon/></>
                    ]
                },
                {
                    cells: [
                        'Proin vehicula ex sit amet iaculis sagittis.',
                        'Etiam at quam ut velit ornare vestibulum.',
                        'N/A',
                        <><OutlinedCircleIcon/></>
                    ]
                },
                {
                    cells: [
                        'Maecenas a ipsum at metus vulputate eleifend et at justo.',
                        'Integer scelerisque purus tempus tellus gravida dictum.',
                        'N/A',
                        <><OutlinedCheckCircleIcon/></>
                    ]
                },
                {
                    cells: [
                        'Etiam dignissim lectus non tellus mattis, eu mattis dolor mattis.',
                        'Donec suscipit lorem eu erat vestibulum, at hendrerit tellus feugiat.',
                        'N/A',
                        <><OutlinedCheckCircleIcon/></>
                    ]
                },
                {
                    cells: [
                        'Donec venenatis ex sit amet massa porta sagittis.',
                        'Vestibulum imperdiet orci vel mauris aliquet dictum.',
                        'N/A',
                        <><OutlinedCircleIcon/></>
                    ]
                }
            ],
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
            ]
        };
    }

    render() {
        return (
            <>
                <PageHeader>
                    <PageHeaderTitle title="Custom policies"/>
                </PageHeader>
                <Main>
                    <Section>
                        <Table aria-label="Custom policies list" cells={ this.state.columns } rows={ this.state.rows } actions={ this.state.actions }>
                            <TableHeader/>
                            <TableBody/>
                        </Table>
                    </Section>
                </Main>
            </>
        );
    }
}


export default ListPage;
