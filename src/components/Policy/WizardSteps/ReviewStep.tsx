import * as React from 'react';
import { FieldArray, FieldArrayRenderProps } from 'formik';

import { WizardContext, WizardStepExtended } from '../PolicyWizardTypes';
import { FormTextInput, Switch } from '../../Formik/Patternfly';
import { Form, Label, Split, SplitItem } from '@patternfly/react-core';
import { ActionsForm } from '../ActionsForm';
import { PolicyFormSchema } from '../../../schemas/CreatePolicy/PolicySchema';
import { useContext } from 'react';
import { GlobalDangerColor100 } from '../../../utils/PFColors';
import { ExclamationCircleIcon } from '@patternfly/react-icons';
import { style } from 'typestyle';
import { Messages } from '../../../properties/Messages';

const exclamationClassName = style({
    marginRight: 5
});

const ReviewStep: React.FunctionComponent = () => {
    const context = useContext(WizardContext);

    return (
        <>
            <Form>
                <Label>{Messages.wizardReview}</Label>
                <Switch isDisabled={ context.isLoading } type="checkbox" id="isEnabled" name="isEnabled" label="Activate Policy?"/>
                <FormTextInput isReadOnly label="Name" type="text" name="name" id="name"/>
                <FormTextInput isReadOnly label="Description" type="text" id="description" name="description"/>
                <FormTextInput isReadOnly label="Condition text" type="text" id="conditions" name="conditions"/>
                <FieldArray name="actions">
                    { (helpers: FieldArrayRenderProps) => {
                        return <ActionsForm id="actions" name="actions" isReadOnly actions={ helpers.form.values.actions } arrayHelpers={ helpers }/>;
                    } }
                </FieldArray>
                { context.createResponse.error && (
                    <Split>
                        <SplitItem>
                            <ExclamationCircleIcon className={ exclamationClassName } color={ GlobalDangerColor100 }/>
                        </SplitItem>
                        <SplitItem> { context.createResponse.error } </SplitItem>
                    </Split>
                ) }
            </Form>
        </>
    );
};

export const createReviewStep: (stepOverrides?: Partial<WizardStepExtended>) => WizardStepExtended = (stepOverrides) => ({
    name: Messages.wizardReview,
    component: <ReviewStep/>,
    validationSchema: PolicyFormSchema,
    ...stepOverrides
});
