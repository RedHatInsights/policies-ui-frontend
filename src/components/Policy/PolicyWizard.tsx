import * as React from 'react';
import { Form, Wizard, WizardStepFunctionType } from '@patternfly/react-core';
import { Formik, FormikProps } from 'formik';
import { DeepPartial } from 'ts-essentials';

import { Policy } from '../../types/Policy';
import { WizardStepExtended } from './WizardSteps/WizardStepExtended';
import { createCustomPolicyStep } from './WizardSteps/CreateCustomPolicyStep';
import { createDetailsStep } from './WizardSteps/DetailsStep';
import { createConditionsStep } from './WizardSteps/ConditionsStep';
import { createActionsStep } from './WizardSteps/ActionsStep';
import { createReviewStep } from './WizardSteps/ReviewStep';

type FormType = DeepPartial<Policy>;

interface PolicyWizardProps {
    initialValue: FormType;
    isOpen: boolean;
    onClose: () => void;
}

const buildSteps: () => WizardStepExtended[] = () => {
    return [
        createCustomPolicyStep(),
        createDetailsStep(),
        createConditionsStep(),
        createActionsStep(),
        createReviewStep()
    ].map((step, index) => ({
        ... step,
        id: index,
        canJumpTo: true
    }));
};

export const PolicyWizard: React.FunctionComponent<PolicyWizardProps> = (props: PolicyWizardProps) => {

    if (!props.isOpen) {
        return null;
    }

    const [ currentStep, setCurrentStep ] = React.useState<number>(0);
    const [ maxStep, setMaxStep ] = React.useState<number>(0);

    const onMove: WizardStepFunctionType = (current, _previous) => {
        const currentStep = current.id as number;
        setCurrentStep(currentStep);
        if (currentStep > maxStep) {
            setMaxStep(currentStep);
        }
    };

    const steps: WizardStepExtended[] = buildSteps();

    return (
        <>
            <Formik<FormType>
                initialValues={ props.initialValue }
                validateOnMount={ true }
                validationSchema={ steps[currentStep].validationSchema }
                onSubmit={ () => console.log('great') }
            >
                {(formikProps: FormikProps<FormType>) => {

                    (global as any).validate = formikProps;
                    React.useEffect(() => {
                        formikProps.validateForm();
                    }, [ currentStep ]);

                    const stepsValidated = steps.map(step => ({
                        ...step,
                        enableNext: formikProps.isValid
                    }));

                    return (
                        <Form onSubmit={ formikProps.handleSubmit } isHorizontal id="my-form-id">
                            <Wizard
                                isOpen={ true }
                                onClose={ props.onClose }
                                steps={ stepsValidated }
                                onNext={ onMove }
                                onBack={ onMove }
                                onGoToStep={ onMove }
                                title="Add Custom Policy"
                                description={ 'Custom policies are processed on reception of system profile messages. ' +
                                'If condition(s) are met, defined action(s) are triggered.' }
                            />
                        </Form>
                    );
                }}
            </Formik>
        </>
    );
};
