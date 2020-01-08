import * as React from 'react';
import { FieldArray, FieldArrayRenderProps } from 'formik';

import { WizardStepExtended } from './WizardStepExtended';
import { FormTextInput, Switch } from '../../Formik/Patternfly';
import { Form } from '@patternfly/react-core';
import { ActionsForm } from '../ActionsForm';
import { PolicyFormSchema } from '../../../schemas/CreatePolicy/PolicySchema';

const ReviewStep = () => {

    return (
        <>
            <Form isHorizontal>
                <FormTextInput isReadOnly label="Name" type="text" name="name" id="name"/>
                <FormTextInput isReadOnly label="Description" type="text" id="description" name="description"/>
                <Switch isDisabled type="checkbox" id="isEnabled" name="isEnabled" labelOff="Disabled" labelOn="Enabled" label="Enabled?"/>
                <FormTextInput isReadOnly label="Condition text" type="text" id="conditions" name="conditions"/>
                <FieldArray name="actions">
                    { (helpers: FieldArrayRenderProps) => {
                        return <ActionsForm isReadOnly actions={ helpers.form.values.actions } arrayHelpers={ helpers }/>;
                    } }
                </FieldArray>
            </Form>
        </>
    );
};

export const createReviewStep: (stepOverrides?: Partial<WizardStepExtended>) => WizardStepExtended = (stepOverrides) => ({
    name: 'Review',
    component: <ReviewStep/>,
    validationSchema: PolicyFormSchema,
    ...stepOverrides
});
