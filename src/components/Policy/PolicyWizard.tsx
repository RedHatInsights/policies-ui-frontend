import {
    Form
} from '@patternfly/react-core';
import {
    Wizard,
    WizardStepFunctionType
} from '@patternfly/react-core/deprecated';
import { assertNever } from 'assert-never';
import { Formik, FormikHelpers, useFormikContext } from 'formik';
import * as React from 'react';
import { useMountedState } from 'react-use';

import { Messages } from '../../properties/Messages';
import { PolicyFormSchema } from '../../schemas/CreatePolicy/PolicySchema';
import { Fact } from '../../types/Fact';
import { NewPolicy, Policy } from '../../types/Policy/Policy';
import { PolicyWizardFooter } from './PolicyWizardFooter';
import {
    CreatePolicyResponse,
    PartialPolicy,
    VerifyPolicyResponse,
    WizardActionType,
    WizardContext,
    WizardStepExtended
} from './PolicyWizardTypes';
import { createActionsStep } from './WizardSteps/ActionsStep';
import { createConditionsStep } from './WizardSteps/ConditionsStep';
import { CreatePolicyStepContextProvider } from './WizardSteps/CreatePolicyPolicyStep/Provider';
import { createPolicyStep } from './WizardSteps/CreatePolicyStep';
import { createDetailsStep } from './WizardSteps/DetailsStep';
import { createReviewStep } from './WizardSteps/ReviewStep';

export interface PolicyWizardProps {
    initialValue: PartialPolicy;
    onClose: () => void;
    onSave: (policy: NewPolicy) => Promise<CreatePolicyResponse>;
    onVerify: (policy: Partial<Policy>) => Promise<VerifyPolicyResponse>;
    onValidateName: (policy: Partial<Policy>) => Promise<CreatePolicyResponse>;
    isLoading: boolean;
    showCreateStep: boolean;
    facts?: Fact[];
    isEditing: boolean;
}

const buildSteps: (showCreateStep: boolean) => WizardStepExtended[] = (showCreateStep) => {
    const steps = [] as WizardStepExtended[];

    if (showCreateStep) {
        steps.push(createPolicyStep());
    }

    steps.push(
        createDetailsStep(),
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
    triggerAction: (action: WizardActionType) => Promise<unknown>;
    steps: WizardStepExtended[];
    verifyResponse: VerifyPolicyResponse;
    createResponse: CreatePolicyResponse;
    setVerifyResponse: (response: VerifyPolicyResponse) => void;
    onMove: WizardStepFunctionType;
    onClose: () => void;
    showCreateStep: boolean;
    facts?: Fact[];
    isEditing: boolean;
    setMaxStep: (maxStep: number) => void;
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
        setVerifyResponse: props.setVerifyResponse,
        facts: props.facts,
        setMaxStep: props.setMaxStep
    };

    const currentStep = props.steps[props.currentStep];

    const isValid = isStepValid(currentStep, wizardContext, formikProps.values);
    wizardContext.isValid = isValid;

    const stepsValidated = props.steps.map(step => ({
        ...step,
        enableNext: enableNext(isValid, props.isLoading),
        canJumpTo: canJumpTo(step.id as number, isValid, props.currentStep, props.maxStep, props.isLoading)
    }));

    const onSave = () => {
        props.triggerAction(WizardActionType.SAVE);
    };

    return (
        <Form>
            <WizardContext.Provider value={ wizardContext }>
                <Wizard
                    data-ouia-component-id={ 'pendo-policy-wizard' }
                    isOpen={ true }
                    onSave={ onSave }
                    onClose={ props.onClose }
                    steps={ stepsValidated }
                    startAtStep={ props.currentStep + 1 } // Wizard steps starts at 1
                    onNext={ props.onMove }
                    onBack={ props.onMove }
                    onGoToStep={ props.onMove }
                    title={ props.isEditing ? Messages.wizards.policy.titleEdit : Messages.wizards.policy.titleNew }
                    description={ Messages.wizards.policy.description }
                    footer={ <PolicyWizardFooter
                        onNext={ currentStep.onNext }
                        loadingText="Loading"
                        isLoading={ props.isLoading }
                        error={ props.createResponse.error }
                    /> }
                />
            </WizardContext.Provider>
        </Form>
    );
};

type WizardAction = {
    type: WizardActionType;
    resolver?: () => void;
    rejecter?: () => void;
}

export const PolicyWizard: React.FunctionComponent<PolicyWizardProps> = (props: PolicyWizardProps) => {

    const [ currentStep, setCurrentStep ] = React.useState<number>(0);
    const [ maxStep, setMaxStep ] = React.useState<number>(0);
    const [ wizardAction, setWizardAction ] = React.useState<WizardAction>({
        type: WizardActionType.NONE
    });
    const [ verifyResponse, setVerifyResponse ] =
    React.useState<VerifyPolicyResponse>({
        isValid: false
    });
    const isMounted = useMountedState();

    const [ createResponse, setCreateResponse ] =
    React.useState<CreatePolicyResponse>({
        created: false
    });

    const triggerAction = React.useCallback((actionType: WizardActionType): Promise<unknown> => {
        let resolver;
        let rejecter;
        const actionPromise = new Promise<unknown>(((resolve, reject) => {
            resolver = resolve;
            rejecter = reject;
        }));
        setWizardAction(prev => {
            if (prev.rejecter) {
                prev.rejecter();
            }

            return {
                type: actionType,
                resolver,
                rejecter
            };
        });

        return actionPromise;
    }, [ setWizardAction ]);

    const resolveAction = React.useCallback((resolve: boolean) => {
        setWizardAction(prev => {
            if (resolve && prev.resolver) {
                prev.resolver();
            } else if (prev.rejecter) {
                prev.rejecter();
            }

            return {
                type: WizardActionType.NONE
            };
        });
    }, [ setWizardAction ]);

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
        setWizardAction(prev => ({
            ...prev,
            type: WizardActionType.NONE
        }));
        const transformedPolicy = PolicyFormSchema.cast(policy) as NewPolicy;
        formikHelpers.setValues(transformedPolicy);
        switch (wizardAction.type) {
            case WizardActionType.SAVE:
                props.onSave(transformedPolicy).then(response => {
                    if (isMounted()) {
                        setCreateResponse(response);
                        resolveAction(response.created);
                    }
                });
                break;
            case WizardActionType.VALIDATE_CONDITION:
            case WizardActionType.NONE:
            case WizardActionType.VALIDATE_NAME:
                // Ignore these actions, they will be handled in the validateForm
                break;
            default:
                assertNever(wizardAction.type);
        }
    };

    const onValidateForm = (policy: PartialPolicy) => {
        const transformedPolicy = PolicyFormSchema.cast(policy) as Partial<Policy>;
        switch (wizardAction.type) {
            case WizardActionType.SAVE:
            case WizardActionType.NONE:
                // Ignore this action, it will be handled on submit.
                break;
            case WizardActionType.VALIDATE_CONDITION:
                props.onVerify(transformedPolicy).then(response => {
                    setVerifyResponse(response);
                    resolveAction(response.isValid);
                });
                break;
            case WizardActionType.VALIDATE_NAME:
                props.onValidateName(transformedPolicy).then(response => {
                    setCreateResponse(response);
                    resolveAction(!response.error);
                });
                break;
            default:
                assertNever(wizardAction.type);
        }
    };

    return (
        <>
            <CreatePolicyStepContextProvider showCreateStep={ props.showCreateStep }>
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
                        triggeredAction={ wizardAction.type }
                        triggerAction={ triggerAction }
                        steps={ steps }
                        verifyResponse={ verifyResponse }
                        createResponse={ createResponse }
                        setVerifyResponse={ setVerifyResponse }
                        onClose={ props.onClose }
                        onMove={ onMove }
                        showCreateStep={ props.showCreateStep }
                        facts={ props.facts }
                        setMaxStep={ setMaxStep }
                        isEditing={ props.isEditing }
                    />
                </Formik>
            </CreatePolicyStepContextProvider>
        </>
    );
};
