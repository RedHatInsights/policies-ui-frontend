import * as React from 'react';
import {
    ActionGroup,
    Button,
    Checkbox,
    Dropdown,
    DropdownItem,
    DropdownPosition,
    DropdownToggle,
    Form,
    FormGroup,
    TextInput
} from '@patternfly/react-core';
import { PageHeader, Main, Section, PageHeaderTitle } from '@redhat-cloud-services/frontend-components';

import { Policy } from '../types/Policy';
import { Link } from 'react-router-dom';
import { createPolicy, verifyPolicy } from '../services/Api';
import CpContext from '../utils/CPContext';

type AddPageProps = {};
type AddPageState = {
    policy: Policy;
    isValid: boolean;
    filled: boolean;
    messages: string;
    ddOpen: boolean;
    checkStates: boolean[];
    actionProps: string[];
};

class AddCustomPolicyPage extends React.Component<AddPageProps, AddPageState> {

    //    possibleActions = [ 'email', 'webhook', 'sms', 'slack' ];
    possibleActions = [ 'email', 'webhook', 'sms' ];
    actionHints = [ 'email address', 'target URL', 'phone number' ];

    static contextType = CpContext;

    constructor(props: AddPageProps) {
        super(props);
        this.state = {
            isValid: false,
            policy: {
                customerid: this.context.accountNumber,
                conditions: '',
                name: '',
                isEnabled: false },
            ddOpen: false,
            filled: false,
            messages: '',
            checkStates: new Array(this.possibleActions.length),
            actionProps: new Array(this.possibleActions.length)
        };
    }

    render() {
        const actionCheck = this.possibleActions.map((action, key) =>

            <>
                <Checkbox id={ 'check-' + key } label={ action }
                    onChange={ value => this.toggleAction(action, value, key) }
                    isChecked={ this.state.checkStates[key] } />
                <TextInput id={ 'action-ti-' + key }
                    value={ this.state.actionProps[key] }
                    isDisabled={ !this.state.checkStates[key] }
                    placeholder={ ' Put the ' + this.actionHints[key] + ' here.' }
                    onChange= { value => this.actionsOnChangeHandler(key, value) }/>
            </>
        );

        return (
            <>
                <PageHeader>
                    <PageHeaderTitle title="Add new Policy"/>
                </PageHeader>
                <Main>
                    <Section>
                        <Form about='Add a new policy' isHorizontal={ true }>
                            <FormGroup
                                fieldId='name'
                                label='Name'
                                isRequired={ true }>
                                <TextInput
                                    id={ 'name' }
                                    value={ this.state.policy.name }
                                    onChange={ value => this.onChangeHandler(-1, 'name', value) }
                                    placeholder='Name of the policy'/>
                            </FormGroup>
                            <FormGroup
                                fieldId='description'
                                label='Description'>
                                <TextInput id={ 'description' }
                                    onChange={ value => this.onChangeHandler(-1, 'description', value) }
                                    placeholder='A short description'/>
                            </FormGroup>
                            <FormGroup
                                fieldId='conditions'
                                label='Condition text'
                                isRequired={ true }
                            >
                                <TextInput id={ 'conditions' }
                                    placeholder='"a"== "b"'
                                    onChange={ value => this.onChangeHandler(-1, 'conditions', value) }/>
                            </FormGroup>
                            <FormGroup fieldId={ 'isActive' } label={ 'Enabled?' }>
                                <Checkbox id={ 'isActive' } default={ false }
                                    onChange={ value => this.onChangeHandler(-1, 'enabled', '' + value) }/>
                            </FormGroup>
                            <FormGroup fieldId={ 'actions-group'  } label={ 'Actions' } isRequired={ true }  >
                                { actionCheck }
                            </FormGroup>
                            <FormGroup fieldId={ 'severity' } label={ 'Severity' } disabled={ true }>
                                <Dropdown
                                    toggle={ <DropdownToggle onToggle={ this.onToggle }>Severity</DropdownToggle> }
                                    position={ DropdownPosition.right }
                                    isOpen={ this.state.ddOpen }
                                    label={ 'Severity' }
                                    defaultValue={ 'Low' }
                                    onSelect={ this.openCloseDropDown }
                                    dropdownItems={ [
                                        <DropdownItem key='low' selected={ true }>Low</DropdownItem>,
                                        <DropdownItem key='medium' >Medium</DropdownItem>,
                                        <DropdownItem key='high' >High</DropdownItem>
                                    ] }
                                />
                            </FormGroup>
                            <FormGroup fieldId={ 'msg' } label={ 'Messages' }>
                                <TextInput isDisabled={ true } id={ 'msg' } value={ this.state.messages } type={ 'text' }/>
                            </FormGroup>
                            <ActionGroup>
                                <Link to='/list' className={ 'btn btn-secondary' }>Back</Link>
                                {/*<Button key={ 'back' } variant={ 'link' } onClick={ this.cancel }>Cancel</Button>*/}
                                <Button key={ 'create' } variant={ 'secondary' }
                                    isDisabled={ !this.state.isValid }
                                    onClick={ this.storePolicy }>Create</Button>
                                <Button key={ 'verify' } variant={ 'primary' }
                                    isDisabled={ !this.state.filled }
                                    onClick={ this.testPolicy }>Verify</Button>
                            </ActionGroup>
                        </Form>
                    </Section>
                </Main>
            </>
        );
    }

    openCloseDropDown = () => {
        this.setState({
            ddOpen: !this.state.ddOpen
        });
    };

    testPolicy = () => {
        this.fillActions();
        verifyPolicy(this.state.policy)
        .then(() => this.setState({ isValid: true, messages: 'Policy is valid' }))
        .catch(reason  => {
            console.log(reason.response.status + ' => ' + reason.response.data.msg);
            this.setState({ isValid: false, messages: reason.response.data.msg });
        });

    };

    storePolicy = () => {
        this.fillActions();
        createPolicy(this.state.policy)
        .then(() => this.setState({ isValid: false, messages: 'Policy stored' }))
        .catch(reason  => {
            this.setState({ isValid: false, messages: reason.response.data.msg });
        });

    };

    onChangeHandler(selectedId: number, field: string, value: string) {
        this.setState(prevState => {
            const tmp = prevState.policy;
            let fill = prevState.filled;
            if (selectedId === -1) {
                switch (field) {
                    case 'name':
                        tmp.name = value.trim();
                        break;
                    case 'description':
                        tmp.description = value.trim();
                        break;
                    case 'conditions':
                        tmp.conditions = value.trim();
                        break;
                    case 'enabled':
                        tmp.isEnabled = value.trim() === 'true';
                        break;
                    default:
                        console.log('TODO');
                }
            }

            if (tmp.name && tmp.conditions) {
                fill = true;
            } else {
                fill = false;
            }

            return {
                policy: tmp,
                filled: fill
            };
        });
    }

    onToggle = (ddState: boolean) => {
        this.setState({
            ddOpen: ddState
        });
    };

    toggleAction(name: string, value: boolean, key: number) {
        console.log(name + ' - ' + value + ' - ' + key);
        this.setState(prevState => {
            const tmp = prevState.checkStates;
            tmp[key] = !tmp[key];

            return { checkStates: tmp };
        });
    }

    actionsOnChangeHandler(key: number, value: string) {
        this.setState(prevState => {
            const tmp = prevState.actionProps;
            tmp[key] = value.trim();

            return { actionProps: tmp };
        })    ;
    }

    fillActions() {
        this.setState(prevState => {
            let tmp = '';
            const oldPol = prevState.policy;
            this.possibleActions.map ((action, key) =>
            {
                if (this.state.checkStates[key]) {
                    tmp = tmp + action.toUpperCase() + ' ' + this.state.actionProps[key] + ';';
                }
            });

            if (tmp.endsWith(';')) {
                tmp = tmp.substr(0, tmp.length - 1);
            }

            oldPol.actions = tmp;
            return { policy: oldPol };
        });
    };

};

export default AddCustomPolicyPage;
