import * as React from 'react';
import { ActionGroup, Button, ButtonVariant, Form } from '@patternfly/react-core';
import { ExclamationCircleIcon, CheckCircleIcon } from '@patternfly/react-icons';

import { FormTextInput } from '../../Formik/Patternfly';
import { FormType, WizardActionType, WizardContext, WizardStepExtended } from '../PolicyWizardTypes';
import { PolicyFormConditions } from '../../../schemas/CreatePolicy/PolicySchema';
import { useFormikContext } from 'formik';
import { style } from 'typestyle';
import { GlobalDangerColor100, GlobalSuccessColor200 } from '../../../utils/PFColors';

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
    const { values } = useFormikContext<FormType>();

    const triggerTestCondition = () => {
        context.triggerAction(WizardActionType.VERIFY);
    };

    return (
        <Form>
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
                            changed={ context.verifyResponse.conditions !== values.conditions }
                        />
                    </>
                )}
            </ActionGroup>
        </Form>
    );
};

export const createConditionsStep: (stepOverrides?: Partial<WizardStepExtended>) => WizardStepExtended = (stepOverrides) => ({
    name: 'Conditions',
    component: <ConditionsStep/>,
    validationSchema: PolicyFormConditions,
    isContextValid: (context, values) => {
        if (values.conditions === context.verifyResponse.conditions) {
            return context.verifyResponse.isValid;
        }

        return false;
    },
    ...stepOverrides
});
