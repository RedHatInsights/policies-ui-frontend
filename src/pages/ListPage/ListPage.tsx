import * as React from 'react';
import { Table, TableHeader, TableBody, IRow, IActions } from '@patternfly/react-table';
import { CheckCircleIcon, PlusCircleIcon, TimesIcon } from '@patternfly/react-icons';

import { PageHeader, Main, Section, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';
import { Policy } from '../../types/Policy/Policy';
import { getPolicies } from '../../services/Api';
import { PolicyWizard } from '../../components/Policy/PolicyWizard';
import { Button } from '@patternfly/react-core';

type ListPageProps = {};
type ListPageState = {
    columns: string[];
    rows: IRow[];
    actions: IActions;
    rawData: Policy[];
    customPolicyWizardIsOpen: boolean;
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
            rawData: [],
            customPolicyWizardIsOpen: false
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

    openCustomPolicyWizard = () => {
        this.setState({
            customPolicyWizardIsOpen: true
        });
    };

    closeCustomPolicyWizard = () => {
        this.setState({
            customPolicyWizardIsOpen: false
        });
    }

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
                        <Button onClick={ this.openCustomPolicyWizard } variant="link" icon={ <PlusCircleIcon /> }>Add new Policy</Button>
                    </Section>
                </Main>
                <PolicyWizard
                    isOpen={ this.state.customPolicyWizardIsOpen }
                    onClose={ this.closeCustomPolicyWizard }
                    initialValue={ { actions: [{}]} }/>
            </>
        );
    }

    componentDidMount() {
        getPolicies()
        .then(response => response.data)
        .then(data => this.setState({ rawData: data }));
    }

}

export default ListPage;
