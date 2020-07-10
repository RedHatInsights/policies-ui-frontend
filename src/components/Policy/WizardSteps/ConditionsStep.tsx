import * as React from 'react';
import {
    Button,
    ButtonVariant,
    Spinner, Split,
    SplitItem,
    Stack,
    StackItem,
    Title
} from '@patternfly/react-core';
import { ExclamationCircleIcon, CheckCircleIcon } from '@patternfly/react-icons';
import { joinClasses, PFColors, Form } from '@redhat-cloud-services/insights-common-typescript';

import { PartialPolicy, WizardActionType, WizardContext, WizardStepExtended } from '../PolicyWizardTypes';
import { PolicyFormConditions } from '../../../schemas/CreatePolicy/PolicySchema';
import { useFormikContext } from 'formik';
import { style } from 'typestyle';
import { Messages } from '../../../properties/Messages';
import Usage from '../Table/ExpandedContent/Usage';
import { ConditionFieldWithForkmik } from '../../Condition/ConditionFieldWithFormik';

const elementClassName = style({
    marginTop: 'auto',
    marginBottom: 'auto',
    marginLeft: 8
});

const width100ClassName = style({
    width: '100%'
});

const marginTopClassName = style({
    marginTop: 12
});

const fontRedColor = style({
    color: PFColors.GlobalDangerColor100
});

const fontGreenColor = style({
    color: PFColors.GlobalSuccessColor200
});

const fontWeightBold = style({
    fontWeight: 'bold'
});

const titleClassName = style({
    marginBottom: 5
});

interface ConditionStatusProps {
    isValid?: boolean;
    error?: string;
    changed?: boolean;
    loading: boolean;
}

const ConditionStatus: React.FunctionComponent<ConditionStatusProps> = (props) => {
    if (props.loading) {
        return (
            <Split>
                <SplitItem>
                    <span className={ elementClassName }><Spinner size="md" /></span>
                    <span className={ elementClassName }> { Messages.wizards.policy.conditions.validating } </span>
                </SplitItem>
            </Split>
        );
    }

    if (props.changed) {
        return null;
    }

    if (props.isValid) {
        return (
            <Split>
                <SplitItem>
                    <CheckCircleIcon className={ elementClassName } color={ PFColors.GlobalSuccessColor200 }/>
                </SplitItem>
                <SplitItem>
                    <div className={ joinClasses(elementClassName, fontGreenColor, fontWeightBold) }>
                        { Messages.wizards.policy.conditions.valid }
                    </div>
                </SplitItem>
            </Split>
        );
    }

    if (props.error) {
        return (
            <Stack>
                <StackItem>
                    <Split>
                        <SplitItem>
                            <ExclamationCircleIcon className={ elementClassName } color={ PFColors.GlobalDangerColor100 }/>
                        </SplitItem>
                        <SplitItem>
                            <div className={ joinClasses(elementClassName, fontRedColor, fontWeightBold) }>
                                { Messages.wizards.policy.conditions.invalid }
                            </div>
                        </SplitItem>
                    </Split>
                </StackItem>
                <StackItem>
                    <div className={ joinClasses(elementClassName, fontRedColor) }> { props.error } </div>
                </StackItem>
            </Stack>
        );
    }

    return null;
};

const ConditionsStep: React.FunctionComponent = () => {
    const context = React.useContext(WizardContext);
    const { values } = useFormikContext<PartialPolicy>();

    const triggerTestCondition = () => {
        context.triggerAction(WizardActionType.VALIDATE_CONDITION);
    };

    const validIsDisabled = !values.conditions || values.conditions === '' || context.isLoading;

    return (
        <Form>
            <Title className={ titleClassName } headingLevel="h4" size="xl">{ Messages.wizards.policy.conditions.title }</Title>
            { Messages.wizards.policy.conditions.summaryDesc }
            <ConditionFieldWithForkmik label="Condition text"
                id="conditions" name="conditions" facts={ context.facts || [] }
                hint={ Messages.wizards.policy.conditions.hint }
            />
            <Stack className={ width100ClassName }>
                <StackItem>
                    <Button onClick={ triggerTestCondition } isDisabled={ validIsDisabled } variant={ ButtonVariant.secondary }>
                        Validate condition
                    </Button>
                </StackItem>
                <StackItem className={ marginTopClassName }>
                    <ConditionStatus
                        loading={ context.isLoading }
                        { ...context.verifyResponse }
                        changed={ context.verifyResponse.policy?.conditions !== values.conditions }
                    />
                </StackItem>
            </Stack>
            <Usage/>
        </Form>
    );
};

export const createConditionsStep: (stepOverrides?: Partial<WizardStepExtended>) => WizardStepExtended = (stepOverrides) => ({
    name: Messages.wizards.policy.conditions.title,
    component: <ConditionsStep/>,
    validationSchema: PolicyFormConditions,
    isValid: (context, values) => {
        if (values.conditions === context.verifyResponse.policy?.conditions) {
            return context.verifyResponse.isValid;
        }

        return false;
    },
    ...stepOverrides
});
