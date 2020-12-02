import { Radio, Text, TextVariants, Title } from '@patternfly/react-core';
import { Form, joinClasses } from '@redhat-cloud-services/insights-common-typescript';
import { useFormikContext } from 'formik';
import * as React from 'react';
import { useContext } from 'react';
import { useUpdateEffect } from 'react-use';
import * as Yup from 'yup';

import { Messages } from '../../../properties/Messages';
import { makeCopyOfPolicy } from '../../../types/adapters/PolicyAdapter';
import { Policy } from '../../../types/Policy';
import { NewPolicy } from '../../../types/Policy/Policy';
import { WizardContext, WizardStepExtended } from '../PolicyWizardTypes';
import { CopyFromPolicy } from './CopyFromPolicy';
import { CreatePolicyStepContext } from './CreatePolicyPolicyStep/Context';

type CreateCustomPolicyFormType = NewPolicy & {
    isValid?: boolean;
};

const smallVerticalMargin = 'pf-u-mb-sm'; //SpacingMarginBottomSm
const titleSmall = 'pf-c-title pf-m-sm'; //TitleMedium
const radioButton = 'pf-c-radio';//Radio

export const useCreatePolicyStep = () => {
    const context = React.useContext(CreatePolicyStepContext);
    if (context === undefined) {
        throw Error('Invalid usage of CreatePolicyStep without valid context');
    }

    const {
        copyPolicy, setCopyPolicy,
        copiedPolicy, setCopiedPolicy,
        ...rest
    } = context;

    const { clearSelection } = rest.policyRows;

    const { validate, validateField, setValues, setFieldValue } = useFormikContext<CreateCustomPolicyFormType>();
    const { setVerifyResponse, setMaxStep } = useContext(WizardContext);

    const createFromScratch = React.useCallback(() => {
        setCopyPolicy(false);
        setCopiedPolicy({} as NewPolicy);
    }, [ setCopyPolicy, setCopiedPolicy ]);

    const copyExisting = React.useCallback(() => {
        setCopyPolicy(true);
        setCopiedPolicy(undefined);
    }, [ setCopyPolicy, setCopiedPolicy ]);

    useUpdateEffect(() => {
        if (copiedPolicy) {
            setValues(copiedPolicy);
            if (copyPolicy) {
                setVerifyResponse({
                    policy: copiedPolicy,
                    isValid: true
                });
            }
        }

        setMaxStep(0);

        setFieldValue('isValid', !!copiedPolicy);
        validate && validateField('isValid');
    }, [ copyPolicy, copiedPolicy, validate, validateField, setFieldValue, setValues, setVerifyResponse ]);

    React.useEffect(() => {
        if (!copyPolicy) {
            clearSelection();
        }
    }, [ copyPolicy, clearSelection ]);

    const copyFromPolicyHandler = React.useCallback((policy: Policy) => {
        setCopiedPolicy(makeCopyOfPolicy(policy));
    }, [ setCopiedPolicy ]);

    return {
        copyPolicy,
        createFromScratch,
        copyExisting,
        copyFromPolicyHandler,
        copyFromPolicyProps: rest
    };
};

export const CreatePolicyStep: React.FunctionComponent = () => {
    const {
        copyPolicy,
        createFromScratch,
        copyExisting,
        copyFromPolicyHandler,
        copyFromPolicyProps
    } = useCreatePolicyStep();

    return (
        <>
            <Form ouiaId="create-policy-step" className="pf-c-form">
                <div className="pf-c-form__group">
                    <Title headingLevel="h4" size="xl" className={ smallVerticalMargin }>{ Messages.wizards.policy.createPolicy.title }</Title>
                    <Text className={ joinClasses(smallVerticalMargin, titleSmall) } component={ TextVariants.h6 }>Define a new policy:</Text>
                    <Radio
                        isChecked={ !copyPolicy }
                        name="new-policy"
                        value="from-scratch"
                        id="create-new-custom-policy-from-scratch"
                        onChange={ createFromScratch }
                        label="From scratch"
                        className={ joinClasses(smallVerticalMargin, radioButton) }
                    />
                    <Radio
                        isChecked={ copyPolicy }
                        name="new-policy"
                        value="as-copy"
                        id="create-new-custom-policy-as-copy"
                        onChange={ copyExisting }
                        label="As a copy of existing Policy"
                        className={ joinClasses(smallVerticalMargin, radioButton) }
                    />
                    {copyPolicy && <>
                        <CopyFromPolicy onSelect={ copyFromPolicyHandler } { ...copyFromPolicyProps } />
                    </>
                    }
                </div>
            </Form>
        </>
    );
};

export const createPolicyStep = (stepOverrides?: Partial<WizardStepExtended>): WizardStepExtended => ({
    name: Messages.wizards.policy.createPolicy.title,
    component: <CreatePolicyStep />,
    validationSchema: Yup.object().shape({
        isValid: Yup.boolean().oneOf([ true ])
    }),
    ...stepOverrides
});
