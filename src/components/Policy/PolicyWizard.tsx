import * as React from 'react';
import { Form, Wizard, WizardStepFunctionType } from '@patternfly/react-core';
import { Formik, FormikHelpers, useFormikContext } from 'formik';

import { Policy } from '../../types/Policy';
import {
    CreatePolicyResponse,
    FormType,
    VerifyPolicyResponse,
    WizardActionType,
    WizardContext,
    WizardStepExtended
} from './PolicyWizardTypes';
import { createCustomPolicyStep } from './WizardSteps/CreateCustomPolicyStep';
import { createDetailsStep } from './WizardSteps/DetailsStep';
import { createConditionsStep } from './WizardSteps/ConditionsStep';
import { createActionsStep } from './WizardSteps/ActionsStep';
import { createReviewStep } from './WizardSteps/ReviewStep';
import { PolicyFormSchema } from '../../schemas/CreatePolicy/PolicySchema';
import { PolicyWizardFooter } from './PolicyWizardFooter';
import { PolicyWithOptionalId } from '../../types/Policy/Policy';

export enum SavingMode {
    CREATE,
    UPDATE
}

interface PolicyWizardProps {
    initialValue: FormType;
    onClose: () => void;
    onSave: (policy: PolicyWithOptionalId) => Promise<CreatePolicyResponse>;
    onVerify: (policy: PolicyWithOptionalId) => Promise<VerifyPolicyResponse>;
    isLoading: boolean;
    savingMode: SavingMode;
}

const buildSteps: (savingMode: SavingMode) => WizardStepExtended[] = (savingMode) => {
    const steps = [] as WizardStepExtended[];

    if (savingMode === SavingMode.CREATE) {
        steps.push(createCustomPolicyStep({
            hideBackButton: true
        }));
    }

    steps.push(
        createDetailsStep({
            hideBackButton: true
        }),
        createConditionsStep(),
        createActionsStep(),
        createReviewStep({
            nextButtonText: 'Finish'
        })
    );

    return steps.map((step, index) => ({
        ... step,
        id: index
    }));
};

const canJumpTo = (id: number, isValid: boolean, currentStep: number, maxStep: number, isLoading: boolean) => {
    if (isLoading) {
        return false;
    }

    if (id === currentStep) {
        return true;
    }

    if (id === 0) {
        return false;
    }

    return isValid ? id <= maxStep : id <= currentStep;
};

const enableNext = (isValid: boolean, isLoading: boolean) => {
    return !isLoading && isValid;
};

const isStepValid = (step: WizardStepExtended, wizardContext: Omit<WizardContext, 'isValid'>, values: FormType) => {
    if (step.isValid) {
        return step.isValid(wizardContext, values);
    }

    return wizardContext.isFormValid;
};

interface FormikBindingProps {
    currentStep: number;
    maxStep: number;
    isLoading: boolean;
    submitAction: WizardActionType;
    setSubmitAction: (action: WizardActionType) => void;
    steps: WizardStepExtended[];
    verifyResponse: VerifyPolicyResponse;
    createResponse: CreatePolicyResponse;
    onMove: WizardStepFunctionType;
    onClose: () => void;
}

const FormikBinding: React.FunctionComponent<FormikBindingProps> = (props) => {

    const formikProps = useFormikContext<FormType>();
    const formikValidateForm = formikProps.validateForm;
    const formikHandleSubmit = formikProps.handleSubmit;

    React.useEffect(() => {
        formikValidateForm();
    }, [ props.currentStep, formikValidateForm ]);

    React.useEffect(() => {
        if (props.submitAction !== WizardActionType.NONE) {
            formikHandleSubmit();
        }
    }, [ props.submitAction, formikHandleSubmit ]);

    const wizardContext: WizardContext = {
        isLoading: props.isLoading,
        isFormValid: formikProps.isValid,
        triggerAction: props.setSubmitAction,
        verifyResponse: props.verifyResponse,
        createResponse: props.createResponse
    };

    const isValid = isStepValid(props.steps[props.currentStep], wizardContext, formikProps.values);
    wizardContext.isValid = isValid;

    const stepsValidated = props.steps.map(step => ({
        ...step,
        enableNext: enableNext(isValid, props.isLoading),
        canJumpTo: canJumpTo(step.id as number, isValid, props.currentStep, props.maxStep, props.isLoading)
    }));

    const onSave = () => {
        props.setSubmitAction(WizardActionType.SAVE);
    };

    return (
        <Form>
            <WizardContext.Provider value={ wizardContext }>
                <Wizard
                    isOpen={ true }
                    onSave={ onSave }
                    onClose={ props.onClose }
                    steps={ stepsValidated }
                    startAtStep={ props.currentStep + 1 } // Wizard steps starts at 1
                    onNext={ props.onMove }
                    onBack={ props.onMove }
                    onGoToStep={ props.onMove }
                    title="Add Custom Policy"
                    description={ 'Custom policies are processed on reception of system profile messages. ' +
                    'If condition(s) are met, defined action(s) are triggered.' }
                    footer={ <PolicyWizardFooter loadingText="Loading"  isLoading={ props.isLoading }/> }
                />
            </WizardContext.Provider>
        </Form>
    );
};

export const PolicyWizard: React.FunctionComponent<PolicyWizardProps> = (props: PolicyWizardProps) => {

    const [ currentStep, setCurrentStep ] = React.useState<number>(0);
    const [ maxStep, setMaxStep ] = React.useState<number>(0);
    const [ submitAction, setSubmitAction ] = React.useState<WizardActionType>(WizardActionType.NONE);
    const [ verifyResponse, setVerifyResponse ] =
    React.useState<VerifyPolicyResponse>({
        isValid: false
    });

    const [ createResponse, setCreateResponse ] =
    React.useState<CreatePolicyResponse>({
        created: false
    });

    React.useEffect(() => {
        if (props.initialValue?.conditions) {
            setVerifyResponse({
                isValid: true,
                conditions: props.initialValue.conditions
            });
        }
    }, [ props.initialValue ]);

    const onMove: WizardStepFunctionType = (current, _previous) => {
        const currentStep = current.id as number;
        setCurrentStep(currentStep);
        if (currentStep > maxStep) {
            setMaxStep(currentStep);
        }
    };

    const steps: WizardStepExtended[] = buildSteps(props.savingMode);

    const onSubmit = (policy: FormType, formikHelpers: FormikHelpers<FormType>) => {
        formikHelpers.setSubmitting(false);

        setSubmitAction(WizardActionType.NONE);
        const transformedPolicy = PolicyFormSchema.cast(policy) as Policy;
        formikHelpers.setValues(transformedPolicy);
        switch (submitAction) {
            case WizardActionType.SAVE:
                props.onSave(transformedPolicy).then(setCreateResponse);
                break;
            case WizardActionType.VERIFY:
                props.onVerify(transformedPolicy).then(setVerifyResponse);
                break;
            default:
                throw new Error('Unexpected action');
        }
    };

    return (
        <>
            <Formik<FormType>
                initialValues={ props.initialValue }
                initialStatus={ {} }
                validateOnMount={ false }
                validationSchema={ steps[currentStep].validationSchema }
                onSubmit={ onSubmit }
            >
                <FormikBinding
                    currentStep={ currentStep }
                    maxStep={ maxStep }
                    isLoading={ props.isLoading }
                    submitAction={ submitAction }
                    setSubmitAction={ setSubmitAction }
                    steps={ steps }
                    verifyResponse={ verifyResponse }
                    createResponse={ createResponse }
                    onClose={ props.onClose }
                    onMove={ onMove }
                />
            </Formik>
        </>
    );
};
