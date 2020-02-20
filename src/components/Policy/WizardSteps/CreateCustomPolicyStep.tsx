import * as React from 'react';
import { Button, Form, InputGroup, Radio, TextInput, Title } from '@patternfly/react-core';
import { Policy } from '../../../types/Policy';
import { AlwaysValid, WizardStepExtended } from '../PolicyWizardTypes';
import { Messages } from '../../../properties/Messages';

interface CreateCustomPolicyState {
    copyPolicy: boolean;
    copyFrom?: Policy;
}

const CreateCustomPolicyStep: React.FunctionComponent = () => {
    const [ copyPolicy, setCopyPolicy ] = React.useState<boolean>(false);

    const createFromScratch = () => {
        setCopyPolicy(false);
    };

    const copyExisting = () => {
        setCopyPolicy(true);
    };

    return (
        <>
            <Form>
                <Title headingLevel="h4" size="xl">{Messages.wizardCreatePolicy}</Title>
                <span>Define a new custom policy:</span>
                <Radio
                    isChecked={ !copyPolicy }
                    name="from-scratch"
                    id="create-new-custom-policy-from-scratch"
                    onChange={ createFromScratch }
                    label="From scratch"
                />
                <Radio
                    isChecked={ copyPolicy }
                    name="as-copy"
                    id="create-new-custom-policy-as-copy"
                    onChange={ copyExisting }
                    label="As a copy of existing Custom Policy"
                />
                {copyPolicy && <>
                    <InputGroup>
                        <TextInput aria-label="Filter by name" placeholder="Filter by name"/>
                        <Button aria-label="Filter">Filter</Button>
                    </InputGroup>
                </>
                }
            </Form>
        </>
    );
};

export const createCustomPolicyStep: (stepOverrides?: Partial<WizardStepExtended>) => WizardStepExtended = (stepOverrides) => ({
    name: Messages.wizardCreatePolicy,
    component: <CreateCustomPolicyStep/>,
    validationSchema: AlwaysValid,
    ...stepOverrides
});
