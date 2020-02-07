import * as React from 'react';
import { Form } from '@patternfly/react-core';

import { FormType, WizardStepExtended } from '../PolicyWizardTypes';
import { PolicyFormActions } from '../../../schemas/CreatePolicy/PolicySchema';
import { FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import { ActionsForm } from '../ActionsForm';

const ActionsStep = () => {

    const { validateForm, values } = useFormikContext<FormType>();
    const actionsLength = values.actions?.length;

    // I should not need this. Might be a bug or I'm doing something wrong.
    // Quick debugging turns out that "formik.errors" has an empty action array
    // Todo: Check if this is a bug or i'm doing something wrong
    React.useEffect(() => {
        validateForm();
    }, [ validateForm, actionsLength ]);

    return (
        <Form>
            <FieldArray name="actions">
                { (helpers: FieldArrayRenderProps) => {
                    return <ActionsForm actions={ helpers.form.values.actions } arrayHelpers={ helpers }/>;
                } }
            </FieldArray>
        </Form>
    );
};

export const createActionsStep: (stepOverrides?: Partial<WizardStepExtended>) => WizardStepExtended = (stepOverrides) => ({
    name: 'Actions',
    component: <ActionsStep/>,
    validationSchema: PolicyFormActions,
    ...stepOverrides
});
