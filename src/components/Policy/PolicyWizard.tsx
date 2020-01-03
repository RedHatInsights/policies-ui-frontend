import * as React from 'react';
import { Form, Wizard, WizardStepFunctionType } from '@patternfly/react-core';
import { Formik, FormikHelpers, FormikProps } from 'formik';
import { DeepPartial } from 'ts-essentials';

import { Policy } from '../../types/Policy';
import { WizardStepExtended } from './WizardSteps/WizardStepExtended';
import { createCustomPolicyStep } from './WizardSteps/CreateCustomPolicyStep';
import { createDetailsStep } from './WizardSteps/DetailsStep';
import { createConditionsStep } from './WizardSteps/ConditionsStep';
import { createActionsStep } from './WizardSteps/ActionsStep';
import { createReviewStep } from './WizardSteps/ReviewStep';
import { PolicyFormSchema } from '../../schemas/CreatePolicy/PolicySchema';

type FormType = DeepPartial<Policy>;

enum SubmitActionEnum {
    CREATE = 'CREATE',
    VERIFY = 'VERIFY',
    NONE = 'NONE'
}

interface PolicyWizardProps {
    initialValue: FormType;
    onClose: () => void;
    onCreate: (policy: FormType) => void;
}

const buildSteps: () => WizardStepExtended[] = () => {
    return [
        createCustomPolicyStep({
            hideBackButton: true
        }),
        createDetailsStep(),
        createConditionsStep(),
        createActionsStep(),
        createReviewStep({
            nextButtonText: 'Finish'
        })
    ].map((step, index) => ({
        ... step,
        id: index,
        canJumpTo: true
    }));
};

export const PolicyWizard: React.FunctionComponent<PolicyWizardProps> = (props: PolicyWizardProps) => {

    const [ currentStep, setCurrentStep ] = React.useState<number>(0);
    const [ maxStep, setMaxStep ] = React.useState<number>(0);
    const [ submitAction, setSubmitAction ] = React.useState<SubmitActionEnum>(SubmitActionEnum.NONE);

    const onMove: WizardStepFunctionType = (current, _previous) => {
        const currentStep = current.id as number;
        setCurrentStep(currentStep);
        if (currentStep > maxStep) {
            setMaxStep(currentStep);
        }
    };

    const steps: WizardStepExtended[] = buildSteps();

    const onSubmit = (policy: FormType, formikHelpers: FormikHelpers<FormType>) => {
        formikHelpers.setSubmitting(false);

        switch (submitAction) {
            case SubmitActionEnum.CREATE:
                props.onCreate(PolicyFormSchema.cast(policy));
                break;
            case SubmitActionEnum.VERIFY:
                console.log('Nothing hooked to VERIFY yet...');
                break;
            default:
                throw new Error('Unexpected action');
        }

        setSubmitAction(SubmitActionEnum.NONE);
    };

    const FormikBinding = (formikProps: FormikProps<FormType>) => {
        React.useEffect(() => {
            formikProps.validateForm();
        }, [ currentStep ]);

        React.useEffect(() => {
            if (submitAction !== SubmitActionEnum.NONE) {
                formikProps.handleSubmit();
            }
        }, [ submitAction ]);

        const stepsValidated = steps.map(step => ({
            ...step,
            enableNext: formikProps.isValid
        }));

        const onSave = () => {
            setSubmitAction(SubmitActionEnum.CREATE);
        };

        return (
            <Form isHorizontal id="my-form-id">
                <Wizard
                    isOpen={ true }
                    onSave={ onSave }
                    onClose={ props.onClose }
                    steps={ stepsValidated }
                    startAtStep={ currentStep + 1 } // Wizard steps starts at 1
                    onNext={ onMove }
                    onBack={ onMove }
                    onGoToStep={ onMove }
                    title="Add Custom Policy"
                    description={ 'Custom policies are processed on reception of system profile messages. ' +
                    'If condition(s) are met, defined action(s) are triggered.' }
                />
            </Form>
        );
    };

    return (
        <>
            <Formik<FormType>
                initialValues={ props.initialValue }
                component={ FormikBinding }
                validateOnMount={ true }
                validationSchema={ steps[currentStep].validationSchema }
                onSubmit={ onSubmit }
            />
        </>
    );
};
