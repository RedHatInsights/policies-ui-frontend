import * as React from 'react';
import { Form } from '@patternfly/react-core';

import { FormTextInput } from '../../Formik/Patternfly';
import { WizardStepExtended } from './WizardStepExtended';
import { PolicyFormConditions } from '../../../schemas/CreatePolicy/PolicySchema';

const ConditionsStep = () => {
    return (
        <Form isHorizontal>
            <FormTextInput isRequired={ true } label="Condition text" type="text" id="conditions" name="conditions" placeholder={ '"a" == "b"' }/>
        </Form>
    );
};

export const createConditionsStep: (stepOverrides?: Partial<WizardStepExtended>) => WizardStepExtended = (stepOverrides) => ({
    name: 'Conditions',
    component: <ConditionsStep/>,
    validationSchema: PolicyFormConditions,
    ...stepOverrides
});
