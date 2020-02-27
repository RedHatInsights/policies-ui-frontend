import * as React from 'react';
import { Form, Wizard, WizardStepFunctionType } from '@patternfly/react-core';
import { Formik, FormikHelpers, useFormikContext } from 'formik';
import {
    CreatePolicyResponse,
    PartialPolicy,
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
import { Policy, NewPolicy } from '../../types/Policy/Policy';

interface PolicyWizardProps {
    initialValue: PartialPolicy;
    onClose: () => void;
    onSave: (policy: NewPolicy) => Promise<CreatePolicyResponse>;
    onVerify: (policy: Partial<Policy>) => Promise<VerifyPolicyResponse>;
    isLoading: boolean;
    showCreateStep: boolean;
}

const buildSteps: (showCreateStep: boolean) => WizardStepExtended[] = (showCreateStep) => {
    const steps = [] as WizardStepExtended[];

    if (showCreateStep) {
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

const canJumpTo = (id: number, isValid: boolean, currentStep: number, maxStep: number, isLoading: boolean, showCreateStep: boolean) => {
    if (isLoading) {
        return false;
    }

    if (id === currentStep) {
        return true;
    }

    if (id === 0 && showCreateStep) {
        return false;
    }

    return isValid ? id <= maxStep : id <= currentStep;
};

const enableNext = (isValid: boolean, isLoading: boolean) => {
    return !isLoading && isValid;
};

const isStepValid = (step: WizardStepExtended, wizardContext: Omit<WizardContext, 'isValid'>, values: PartialPolicy) => {
    if (step.isValid) {
        return step.isValid(wizardContext, values);
    }

    return wizardContext.isFormValid;
};

interface FormikBindingProps {
    currentStep: number;
    maxStep: number;
    isLoading: boolean;
    triggeredAction: WizardActionType;
    triggerAction: (action: WizardActionType) => void;
    steps: WizardStepExtended[];
    verifyResponse: VerifyPolicyResponse;
    createResponse: CreatePolicyResponse;
    setVerifyResponse: (response: VerifyPolicyResponse) => void;
    onMove: WizardStepFunctionType;
    onClose: () => void;
    showCreateStep: boolean;
}

const FormikBinding: React.FunctionComponent<FormikBindingProps> = (props) => {

    const formikProps = useFormikContext<PartialPolicy>();
    const formikValidateForm = formikProps.validateForm;
    const formikHandleSubmit = formikProps.handleSubmit;

    React.useEffect(() => {
        formikValidateForm();
    }, [ props.currentStep, formikValidateForm ]);

    React.useEffect(() => {
        if (props.triggeredAction !== WizardActionType.NONE) {
            formikHandleSubmit();
        }
    }, [ props.triggeredAction, formikHandleSubmit ]);

    const wizardContext: WizardContext = {
        isLoading: props.isLoading,
        isFormValid: formikProps.isValid,
        triggerAction: props.triggerAction,
        verifyResponse: props.verifyResponse,
        createResponse: props.createResponse,
        setVerifyResponse: props.setVerifyResponse
    };

    const isValid = isStepValid(props.steps[props.currentStep], wizardContext, formikProps.values);
    wizardContext.isValid = isValid;

    const stepsValidated = props.steps.map(step => ({
        ...step,
        enableNext: enableNext(isValid, props.isLoading),
        canJumpTo: canJumpTo(step.id as number, isValid, props.currentStep, props.maxStep, props.isLoading, props.showCreateStep)
    }));

    const onSave = () => {
        props.triggerAction(WizardActionType.SAVE);
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
    const [ wizardAction, setWizardAction ] = React.useState<WizardActionType>(WizardActionType.NONE);
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
                policy: props.initialValue
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

    const steps: WizardStepExtended[] = buildSteps(props.showCreateStep);

    const onSubmit = (policy: PartialPolicy, formikHelpers: FormikHelpers<PartialPolicy>) => {
        formikHelpers.setSubmitting(false);
        setWizardAction(WizardActionType.NONE);

        const transformedPolicy = PolicyFormSchema.cast(policy) as NewPolicy;
        formikHelpers.setValues(transformedPolicy);
        switch (wizardAction) {
            case WizardActionType.SAVE:
                props.onSave(transformedPolicy).then(setCreateResponse);
                break;
            case WizardActionType.VALIDATE_CONDITION:
            case WizardActionType.NONE:
                // Ignore these actions, they will be handled in the validateForm
                break;
            default:
                throw new Error('Unexpected action');
        }
    };

    const onValidateForm = (policy: PartialPolicy) => {
        const transformedPolicy = PolicyFormSchema.cast(policy) as Partial<Policy>;
        switch (wizardAction) {
            case WizardActionType.SAVE:
            case WizardActionType.NONE:
                // Ignore this action, it will be handled on submit.
                break;
            case WizardActionType.VALIDATE_CONDITION:
                setWizardAction(WizardActionType.NONE);
                props.onVerify(transformedPolicy).then(setVerifyResponse);
                break;
        }
    };

    return (
        <>
            <Formik<PartialPolicy>
                initialValues={ props.initialValue }
                initialStatus={ {} }
                validateOnMount={ false }
                validationSchema={ steps[currentStep].validationSchema }
                onSubmit={ onSubmit }
                validate={ onValidateForm }
            >
                <FormikBinding
                    currentStep={ currentStep }
                    maxStep={ maxStep }
                    isLoading={ props.isLoading }
                    triggeredAction={ wizardAction }
                    triggerAction={ setWizardAction }
                    steps={ steps }
                    verifyResponse={ verifyResponse }
                    createResponse={ createResponse }
                    setVerifyResponse={ setVerifyResponse }
                    onClose={ props.onClose }
                    onMove={ onMove }
                    showCreateStep={ props.showCreateStep }
                />
            </Formik>
        </>
    );
};
