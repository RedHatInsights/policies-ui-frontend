import * as React from 'react';
import { Form, Title } from '@patternfly/react-core';

import { PartialPolicy, WizardStepExtended } from '../PolicyWizardTypes';
import { PolicyFormActions } from '../../../schemas/CreatePolicy/PolicySchema';
import { FieldArray, FieldArrayRenderProps, useFormikContext } from 'formik';
import { ActionsForm } from '../ActionsForm';
import { Messages } from '../../../properties/Messages';

const ActionsStep = () => {

    const { validateForm, values } = useFormikContext<PartialPolicy>();
    const actionsLength = values.actions?.length;

    // I should not need this. Might be a bug or I'm doing something wrong.
    // Quick debugging turns out that "formik.errors" has an empty action array
    // https://github.com/jaredpalmer/formik/issues/2279
    React.useEffect(() => {
        validateForm();
    }, [ validateForm, actionsLength ]);

    return (
        <Form>
            <Title headingLevel="h4" size="xl">{ Messages.wizards.policy.actions.title }</Title>
            <FieldArray name="actions">
                { (helpers: FieldArrayRenderProps) => {
                    return <ActionsForm id="actions" name="actions" actions={ helpers.form.values.actions } arrayHelpers={ helpers }/>;
                } }
            </FieldArray>
        </Form>
    );
};

export const createActionsStep: (stepOverrides?: Partial<WizardStepExtended>) => WizardStepExtended = (stepOverrides) => ({
    name: Messages.wizards.policy.actions.title,
    component: <ActionsStep/>,
    validationSchema: PolicyFormActions,
    ...stepOverrides
});
