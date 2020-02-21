import * as React from 'react';
import { ActionGroup, Button, ButtonVariant, Form, Title } from '@patternfly/react-core';
import { ExclamationCircleIcon, CheckCircleIcon } from '@patternfly/react-icons';

import { FormTextInput } from '../../Formik/Patternfly';
import { PartialPolicy, WizardActionType, WizardContext, WizardStepExtended } from '../PolicyWizardTypes';
import { PolicyFormConditions } from '../../../schemas/CreatePolicy/PolicySchema';
import { useFormikContext } from 'formik';
import { style } from 'typestyle';
import { GlobalDangerColor100, GlobalSuccessColor200 } from '../../../utils/PFColors';
import { Messages } from '../../../properties/Messages';

const centerClassName = style({
    marginTop: 'auto',
    marginBottom: 'auto'
});

interface ConditionStatusProps {
    isValid?: boolean;
    error?: string;
    changed?: boolean;
}

const ConditionStatus: React.FunctionComponent<ConditionStatusProps> = (props) => {
    if (props.changed) {
        return null;
    }

    if (props.isValid) {
        return (
            <>
                <CheckCircleIcon className={ centerClassName } color={ GlobalSuccessColor200 }/>
                <div className={ centerClassName }>Condition is valid</div>
            </>
        );
    }

    if (props.error) {
        return (
            <>
                <ExclamationCircleIcon className={ centerClassName } color={ GlobalDangerColor100 }/>
                <div className={ centerClassName }>Invalid condition</div>
                <div className={ centerClassName }> { props.error } </div>
            </>
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

    return (
        <Form>
            <Title headingLevel="h4" size="xl">{Messages.wizardConditions}</Title>
            <FormTextInput isRequired={ true } label="Condition text"
                type="text" id="conditions" name="conditions"
                placeholder={ 'arch = "x86_64"' }
            />
            <ActionGroup>
                { values.conditions && values.conditions !== '' && (
                    <>
                        <Button onClick={ triggerTestCondition } variant={ ButtonVariant.secondary }>
                            Test condition
                        </Button>
                        <ConditionStatus
                            { ...context.verifyResponse }
                            changed={ context.verifyResponse.policy?.conditions !== values.conditions }
                        />
                    </>
                )}
            </ActionGroup>
        </Form>
    );
};

export const createConditionsStep: (stepOverrides?: Partial<WizardStepExtended>) => WizardStepExtended = (stepOverrides) => ({
    name: Messages.wizardConditions,
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
