import * as React from 'react';
import { FieldArray, FieldArrayRenderProps } from 'formik';

import { WizardStepExtended } from './WizardStepExtended';
import { FormTextInput, Switch } from '../../Formik/Patternfly';
import { Form } from '@patternfly/react-core';
import { ActionsForm } from '../ActionsForm';
import { PolicyFormSchema } from '../../../schemas/CreatePolicy/PolicySchema';

export interface ReviewStepProps {
    loading: boolean;
}

const ReviewStep: React.FunctionComponent<ReviewStepProps> = (props) => {

    return (
        <>
            <Form>
                <FormTextInput isReadOnly label="Name" type="text" name="name" id="name"/>
                <FormTextInput isReadOnly label="Description" type="text" id="description" name="description"/>
                <FormTextInput isReadOnly label="Condition text" type="text" id="conditions" name="conditions"/>
                <FieldArray name="actions">
                    { (helpers: FieldArrayRenderProps) => {
                        return <ActionsForm isReadOnly actions={ helpers.form.values.actions } arrayHelpers={ helpers }/>;
                    } }
                </FieldArray>
                <Switch isDisabled={ props.loading } type="checkbox" id="isEnabled" name="isEnabled" label="Activate Policy?"/>
            </Form>
        </>
    );
};

export const createReviewStep: (loading: boolean, stepOverrides?: Partial<WizardStepExtended>) => WizardStepExtended = (loading, stepOverrides) => ({
    name: 'Review',
    component: <ReviewStep loading={ loading }/>,
    validationSchema: PolicyFormSchema,
    ...stepOverrides
});
