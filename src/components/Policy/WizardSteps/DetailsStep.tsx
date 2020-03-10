import * as React from 'react';
import { Form, Title } from '@patternfly/react-core';

import { FormTextInput } from '../../Formik/Patternfly';
import { WizardStepExtended } from '../PolicyWizardTypes';
import { PolicyFormDetails } from '../../../schemas/CreatePolicy/PolicySchema';
import { Messages } from '../../../properties/Messages';

const DetailsStep = () => {
    return (
        <Form>
            <Title headingLevel="h4" size="xl">{ Messages.wizards.policy.details.title }</Title>
            <FormTextInput isRequired={ true } label="Name" type="text" name="name" id="name"/>
            <FormTextInput label="Description" type="text" id="description" name="description"/>
        </Form>
    );
};

export const createDetailsStep: (stepOverrides?: Partial<WizardStepExtended>) => WizardStepExtended = (stepOverrides) => ({
    name: Messages.wizards.policy.details.title,
    component: <DetailsStep/>,
    validationSchema: PolicyFormDetails,
    ...stepOverrides
});
