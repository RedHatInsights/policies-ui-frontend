import * as React from 'react';
import { Form, Radio, Title } from '@patternfly/react-core';
import { WizardContext, WizardStepExtended } from '../PolicyWizardTypes';
import { Messages } from '../../../properties/Messages';
import { CopyFromPolicy } from './CopyFromPolicy';
import { Policy } from '../../../types/Policy';
import { useFormikContext } from 'formik';
import * as Yup from 'yup';
import { useContext } from 'react';
import { makeCopyOfPolicy } from '../../../utils/PolicyAdapter';
import { NewPolicy } from '../../../types/Policy/Policy';

type CreateCustomPolicyFormType = NewPolicy & {
    isValid?: boolean;
};

const CreateCustomPolicyStep: React.FunctionComponent = () => {
    const [ copyPolicy, setCopyPolicy ] = React.useState<boolean>(false);
    const [ copiedPolicy, setCopiedPolicy ] = React.useState<NewPolicy>();
    const { validate, validateField, setValues, setFieldValue } = useFormikContext<CreateCustomPolicyFormType>();
    const { setVerifyResponse } = useContext(WizardContext);

    const createFromScratch = React.useCallback(() => {
        setCopyPolicy(false);
        setCopiedPolicy(undefined);
    }, [ setCopyPolicy, setCopiedPolicy ]);

    const copyExisting = React.useCallback(() => {
        setCopyPolicy(true);
    }, [ setCopyPolicy ]);

    React.useEffect(() => {
        if (copiedPolicy) {
            setValues(copiedPolicy);
            setVerifyResponse({
                policy: copiedPolicy,
                isValid: true
            });
        }

        setFieldValue('isValid', !copyPolicy || !!copiedPolicy);
        validate && validateField('isValid');
    }, [ copyPolicy, copiedPolicy, validate, validateField, setFieldValue, setValues, setVerifyResponse ]);

    const copyFromPolicyHandler = React.useCallback((policy: Policy) => {
        setCopiedPolicy(makeCopyOfPolicy(policy));
    }, [ setCopiedPolicy ]);

    return (
        <>
            <Form>
                <Title headingLevel="h4" size="xl">{Messages.wizardCreatePolicy}</Title>
                <span>Define a new custom policy:</span>
                <Radio
                    isChecked={ !copyPolicy }
                    name="new-custom-policy"
                    value="from-scratch"
                    id="create-new-custom-policy-from-scratch"
                    onChange={ createFromScratch }
                    label="From scratch"
                />
                <Radio
                    isChecked={ copyPolicy }
                    name="new-custom-policy"
                    value="as-copy"
                    id="create-new-custom-policy-as-copy"
                    onChange={ copyExisting }
                    label="As a copy of existing Custom Policy"
                />
                {copyPolicy && <>
                    <CopyFromPolicy onSelect={ copyFromPolicyHandler }/>
                </>
                }
            </Form>
        </>
    );
};

export const createCustomPolicyStep: (stepOverrides?: Partial<WizardStepExtended>) => WizardStepExtended = (stepOverrides) => ({
    name: Messages.wizardCreatePolicy,
    component: <CreateCustomPolicyStep/>,
    validationSchema: Yup.object().shape({
        isValid: Yup.boolean().oneOf([ true ])
    }),
    ...stepOverrides
});
