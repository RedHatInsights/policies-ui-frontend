import * as React from 'react';
import { Form, Radio } from '@patternfly/react-core';
import { Policy } from '../../../types/Policy';
import { AlwaysValid, WizardStepExtended } from './WizardStepExtended';

interface CreateCustomPolicyState {
    copyPolicy: boolean;
    copyFrom?: Policy;
}

const CreateCustomPolicyStep: React.FunctionComponent = () => {
    const [ state, setState ] = React.useState<CreateCustomPolicyState>({
        copyPolicy: false
    });

    const createFromScratch = () => {
        setState({ copyPolicy: false });
    };

    const copyExisting = () => {
        setState({ copyPolicy: true });
    };

    return (
        <>
            <Form>
                <span>Define a new custom policy:</span>
                <Radio
                    isChecked={ !state.copyPolicy }
                    name="from-scratch"
                    id="create-new-custom-policy-from-scratch"
                    onChange={ createFromScratch }
                    label="From scratch"
                />
                <Radio
                    isChecked={ state.copyPolicy }
                    name="as-copy"
                    id="create-new-custom-policy-as-copy"
                    onChange={ copyExisting }
                    label="As a copy of existing Custom Policy"
                />
            </Form>
        </>
    );
};

export const createCustomPolicyStep: (stepOverrides?: Partial<WizardStepExtended>) => WizardStepExtended = (stepOverrides) => ({
    name: 'Create Custom Policy',
    component: <CreateCustomPolicyStep/>,
    validationSchema: AlwaysValid,
    ...stepOverrides
});
