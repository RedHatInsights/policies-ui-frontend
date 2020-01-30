import * as React from 'react';
import { FieldArray, FieldArrayRenderProps } from 'formik';

import { WizardContext, WizardStepExtended } from '../PolicyWizardTypes';
import { FormTextInput, Switch } from '../../Formik/Patternfly';
import { Form } from '@patternfly/react-core';
import { ActionsForm } from '../ActionsForm';
import { PolicyFormSchema } from '../../../schemas/CreatePolicy/PolicySchema';
import { useContext } from 'react';

const ReviewStep: React.FunctionComponent = () => {
    const context = useContext(WizardContext);

    return (
        <>
            <Form>
                <Switch isDisabled={ context.isLoading } type="checkbox" id="isEnabled" name="isEnabled" label="Activate Policy?"/>
                <FormTextInput isReadOnly label="Name" type="text" name="name" id="name"/>
                <FormTextInput isReadOnly label="Description" type="text" id="description" name="description"/>
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
