import * as React from 'react';
import { Form, Radio, Title } from '@patternfly/react-core';
import { Policy } from '../../../types/Policy';
import { AlwaysValid, WizardStepExtended } from '../PolicyWizardTypes';
import { Messages } from '../../../properties/Messages';
import { CopyFromPolicy } from './CopyFromPolicy';

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
                    <CopyFromPolicy/>
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
