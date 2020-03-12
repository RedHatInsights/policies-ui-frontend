import * as React from 'react';
import { Title } from '@patternfly/react-core';

import { FormTextArea, FormTextInput } from '../../Formik/Patternfly';
import { WizardStepExtended } from '../PolicyWizardTypes';
import { PolicyFormDetails } from '../../../schemas/CreatePolicy/PolicySchema';
import { Messages } from '../../../properties/Messages';
import { Form } from '../../Formik/Patternfly/Form';

const DetailsStep = () => {
    return (
        <Form>
            <Title headingLevel="h4" size="xl">{ Messages.wizards.policy.details.title }</Title>
            <FormTextInput isRequired={ true } label="Name" type="text" name="name" id="name"/>
            <FormTextArea label="Description" type="text" id="description" name="description" resizeOrientation="vertical"/>
        </Form>
    );
};

export const createDetailsStep: (stepOverrides?: Partial<WizardStepExtended>) => WizardStepExtended = (stepOverrides) => ({
    name: Messages.wizards.policy.details.title,
    component: <DetailsStep/>,
    validationSchema: PolicyFormDetails,
    ...stepOverrides
});
