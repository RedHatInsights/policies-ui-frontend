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

import { FormTextInput } from '../../Formik/Patternfly';
import { PartialPolicy, WizardActionType, WizardContext, WizardStepExtended } from '../PolicyWizardTypes';
import { PolicyFormConditions } from '../../../schemas/CreatePolicy/PolicySchema';
import { useFormikContext } from 'formik';
import { style } from 'typestyle';
import { GlobalDangerColor100, GlobalSuccessColor200 } from '../../../utils/PFColors';
import { Messages } from '../../../properties/Messages';
import { joinClasses } from '../../../utils/ComponentUtils';
import { Form } from '../../Formik/Patternfly/Form';
import Usage from '../Table/ExpandedContent/Usage';

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
    color: GlobalDangerColor100
});

const fontGreenColor = style({
    color: GlobalSuccessColor200
});

const fontWeightBold = style({
    fontWeight: 'bold'
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
                    <CheckCircleIcon className={ elementClassName } color={ GlobalSuccessColor200 }/>
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
                            <ExclamationCircleIcon className={ elementClassName } color={ GlobalDangerColor100 }/>
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
            <Title headingLevel="h4" size="xl">{ Messages.wizards.policy.conditions.title }</Title>
            { Messages.wizards.policy.conditions.summaryDesc }
            <Usage showHint={ false } hint={ Messages.wizards.policy.hints.hintValue } hintTitle={ Messages.wizards.policy.hints.hintTitle }/>
            <FormTextInput isRequired={ true } label="Condition text"
                type="text" id="conditions" name="conditions"
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
