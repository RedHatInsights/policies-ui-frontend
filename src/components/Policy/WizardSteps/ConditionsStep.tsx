import {
    Button,
    ButtonVariant,
    Icon,
    Spinner,
    Split,
    SplitItem,
    Stack,
    StackItem,
    Title
} from '@patternfly/react-core';
import { CheckCircleIcon, ExclamationCircleIcon } from '@patternfly/react-icons';
import { global_danger_color_100, global_success_color_200 } from '@patternfly/react-tokens';
import { Form, joinClasses } from '@redhat-cloud-services/insights-common-typescript';
import { useFormikContext } from 'formik';
import * as React from 'react';
import { style } from 'typestyle';

import { Messages } from '../../../properties/Messages';
import { PolicyFormConditions } from '../../../schemas/CreatePolicy/PolicySchema';
import { ConditionFieldWithFormik } from '../../Condition/ConditionFieldWithFormik';
import { PartialPolicy, WizardActionType, WizardContext, WizardStepExtended } from '../PolicyWizardTypes';
import Usage from '../Wizard/Usage';

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
    color: global_danger_color_100.var
});

const fontGreenColor = style({
    color: global_success_color_200.var
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
                    <Icon className={ elementClassName } color={ global_success_color_200.value }>
                        <CheckCircleIcon />
                    </Icon>
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
                            <Icon className={ elementClassName } color={ global_danger_color_100.value }>
                                <ExclamationCircleIcon />
                            </Icon>
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
        <Form ouiaId="condition-step">
            <Title className={ titleClassName } headingLevel="h4" size="xl">{ Messages.wizards.policy.conditions.title }</Title>
            { Messages.wizards.policy.conditions.summaryDesc }
            <ConditionFieldWithFormik ouiaId="conditions" label="Condition text"
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
            <Usage />
        </Form>
    );
};

export const createConditionsStep: (stepOverrides?: Partial<WizardStepExtended>) => WizardStepExtended = (stepOverrides) => ({
    name: Messages.wizards.policy.conditions.title,
    component: <ConditionsStep />,
    validationSchema: PolicyFormConditions,
    isValid: (context, values) => {
        if (values.conditions === context.verifyResponse.policy?.conditions) {
            return context.verifyResponse.isValid;
        }

        return false;
    },
    ...stepOverrides
});
