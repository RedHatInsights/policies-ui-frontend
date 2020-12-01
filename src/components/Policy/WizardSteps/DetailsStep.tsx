import { Title } from '@patternfly/react-core';
import { Form, FormTextArea, FormTextInput } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';

import { Messages } from '../../../properties/Messages';
import { PolicyFormDetails } from '../../../schemas/CreatePolicy/PolicySchema';
import { maxPolicyNameLength } from '../../../types/Policy/Policy';
import { WizardActionType, WizardStepExtended } from '../PolicyWizardTypes';

export const DetailsStep = () => {
    return (
        <Form ouiaId="detail-step">
            <Title headingLevel="h4" size="xl">{ Messages.wizards.policy.details.title }</Title>
            <FormTextInput ouiaId="name" maxLength={ maxPolicyNameLength } isRequired={ true } label="Name" type="text" name="name" id="name" />
            <FormTextArea ouiaId="description" label="Description" type="text" id="description" name="description" resizeOrientation="vertical" />
        </Form>
    );
};

export const createDetailsStep: (stepOverrides?: Partial<WizardStepExtended>) => WizardStepExtended = (stepOverrides) => ({
    name: Messages.wizards.policy.details.title,
    component: <DetailsStep />,
    validationSchema: PolicyFormDetails,
    onNext: (context, onNext) => {
        context.triggerAction(WizardActionType.VALIDATE_NAME).then(onNext).catch(error => {
            console.error('Error when validating:', error);
        });
    },
    ...stepOverrides
});
