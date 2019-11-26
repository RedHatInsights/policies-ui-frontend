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
import { Policy } from '../types/Policy';
import { Link } from 'react-router-dom';

type AddPageProps = {};
type AddPageState = {
    policy: Policy;
    isValid: boolean;
    ddOpen : any;
};

class AddCustomPolicyPage extends React.Component<AddPageProps, AddPageState> {

    API = 'http://localhost:8080/api/v1/policies/';

    constructor(props: AddPageProps) {
        super(props);
        this.state = {
            isValid: false,
            policy: {
                id: 'na',
                description: '',
                conditions: '',
                name: '',
                actions: '',
                isEnabled: false },
            ddOpen: false
        };
    }

    render() {
        return (
            <>
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
                        <TextInput id={ 'description' } placeholder='A short description'/>
                    </FormGroup>
                    <FormGroup
                        fieldId='rule'
                        label='Rule text'
                        isRequired={ true }
                    >
                        <TextInput id={ 'rule' } placeholder='"a"== "b"'/>
                    </FormGroup>
                    <FormGroup fieldId={ 'isActive' } label={ 'Enabled?' }>
                        <Checkbox id={ 'isActive' } default={ false }/>
                    </FormGroup>
                    <FormGroup fieldId={ 'action' } label='Actions' >
                        <Checkbox id='check-email' label={ 'Email' }/>
                        <Checkbox id={ 'check-webhook' } label={ 'Webhook' }/>
                        <Checkbox id={ 'check-sms' } label={ 'SMS' }/>
                        <Checkbox id={ 'check-slack' } label={ 'Slack' }/>
                        <TextInput id={ 'action param' }/>
                    </FormGroup>
                    <FormGroup fieldId={ 'severity' } label={ 'Severity' } >
                        <Dropdown
                            toggle={ <DropdownToggle onToggle={ this.onToggle }>Actions</DropdownToggle> }
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
                    <ActionGroup>
                        <Link to='/list' className={ 'btn btn-secondary' }>Back</Link>
                        {/*<Button key={ 'back' } variant={ 'link' } onClick={ this.cancel }>Cancel</Button>*/}
                        <Button key={ 'create' } variant={ 'secondary' } isDisabled={ !this.state.isValid }>Create</Button>
                        <Button key={ 'test' } variant={ 'primary' } onClick={ this.testPolicy }>Test</Button>
                    </ActionGroup>
                </Form>
            </>
        );
    }

    openCloseDropDown = () => {
        this.setState({
            ddOpen: !this.state.ddOpen
        });
    };

    testPolicy = () => {
        let d = JSON.stringify(this.state.policy);
        fetch(this.API + '' + '1', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: d
        })
        .then(response => response.json())
        .then(() => this.setState({ isValid: true }))
        .catch(reason  => console.log(reason));

    };

    onChangeHandler(selectedId: number, field: string, value: string) {
        this.setState(prevState => {
            const tmp = prevState.policy;
            if (selectedId === -1) {
                switch (field) {
                    case 'name':
                        tmp.name = value.trim();
                        break;
                    default:
                        console.log('TODO');
                }
            }

            return {
                policy: tmp
            };
        });
    }

    onToggle = (ddState: boolean) => {
        this.setState({
            ddOpen: ddState
        });
    }

};

export default AddCustomPolicyPage;
