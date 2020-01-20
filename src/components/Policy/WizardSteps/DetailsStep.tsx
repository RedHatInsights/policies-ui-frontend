import * as React from 'react';
import { Form } from '@patternfly/react-core';

import { FormTextInput } from '../../Formik/Patternfly';
import { WizardStepExtended } from './WizardStepExtended';
import { PolicyFormDetails } from '../../../schemas/CreatePolicy/PolicySchema';

const DetailsStep = () => {
    return (
        <Form>
            <FormTextInput isRequired={ true } label="Name" type="text" name="name" id="name"/>
            <FormTextInput label="Description" type="text" id="description" name="description"/>
        </Form>
    );
};

export const createDetailsStep: (stepOverrides?: Partial<WizardStepExtended>) => WizardStepExtended = (stepOverrides) => ({
    name: 'Details',
    component: <DetailsStep/>,
    validationSchema: PolicyFormDetails,
    ...stepOverrides
});
