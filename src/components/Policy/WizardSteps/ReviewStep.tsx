import { Title } from '@patternfly/react-core';
import { global_BackgroundColor_light_300 } from '@patternfly/react-tokens';
import { Form, FormText, Switch } from '@redhat-cloud-services/insights-common-typescript';
import { padding } from 'csstips';
import { useFormikContext } from 'formik';
import * as React from 'react';
import { useContext } from 'react';
import { style } from 'typestyle';

import { Messages } from '../../../properties/Messages';
import { PolicyFormSchema } from '../../../schemas/CreatePolicy/PolicySchema';
import { Action } from '../../../types/Policy/Actions';
import { PartialPolicy, WizardContext, WizardStepExtended } from '../PolicyWizardTypes';
import { Actions } from '../Table/ExpandedContent/Actions';
import { Conditions } from '../Table/ExpandedContent/Conditions';

const conditionsAndActionsBlockClassName = style({
    backgroundColor: global_BackgroundColor_light_300.var,
    ...padding(18, 14),
    margin: 5
});

const ReviewStep: React.FunctionComponent = () => {
    const context = useContext(WizardContext);
    const { values } = useFormikContext<PartialPolicy>();

    return (
        <>
            <Form ouiaId="review-step">
                <Title headingLevel="h2" size="xl">{ Messages.wizards.policy.review.title }</Title>
                <Switch
                    ouiaId="is-enabled"
                    isDisabled={ context.isLoading }
                    id="isEnabled"
                    name="isEnabled"
                    labelOn={ Messages.wizards.policy.review.policyIsEnabled }
                    labelOff={ Messages.wizards.policy.review.policyIsDisabled }
                    label={ Messages.wizards.policy.review.enableThisPolicy }
                />
                <Title headingLevel="h2" size="md">{ Messages.wizards.policy.review.policy.details }</Title>
                <FormText ouiaId="name" label={ Messages.wizards.policy.review.policy.name } name="name" id="name" />
                <FormText ouiaId="description" label={ Messages.wizards.policy.review.policy.description } name="description" id="description" />
                <div className={ conditionsAndActionsBlockClassName }>
                    <Conditions ouiaId="review-step.conditions" conditions={ values.conditions } />
                </div>
                <div className={ conditionsAndActionsBlockClassName }>
                    <Actions ouiaId="review-step.actions" actions={ (values.actions || []) as Action[] } />
                </div>
            </Form>
        </>
    );
};

export const createReviewStep: (stepOverrides?: Partial<WizardStepExtended>) => WizardStepExtended = (stepOverrides) => ({
    name: Messages.wizards.policy.review.title,
    component: <ReviewStep />,
    validationSchema: PolicyFormSchema,
    ...stepOverrides
});
