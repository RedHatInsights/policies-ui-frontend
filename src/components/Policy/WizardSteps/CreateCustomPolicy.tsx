import * as React from 'react';
import { Form, Radio, WizardStep } from '@patternfly/react-core';
import { Policy } from '../../../types/Policy';

interface CreateCustomPolicyState {
    copyPolicy: boolean;
    copyFrom?: Policy;
}

const CreateCustomPolicy: React.FunctionComponent = () => {
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

export const createCustomPolicyStep: (stepOverrides: Partial<WizardStep>) => WizardStep = (stepOverrides) => ({
    name: 'Create Custom Policy',
    component: <CreateCustomPolicy/>,
    ...stepOverrides
});
