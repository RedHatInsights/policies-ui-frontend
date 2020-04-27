import * as React from 'react';
import { Radio, Title } from '@patternfly/react-core';
import { WizardContext, WizardStepExtended } from '../PolicyWizardTypes';
import { Messages } from '../../../properties/Messages';
import { CopyFromPolicy, CopyFromPolicyProps } from './CopyFromPolicy';
import { Policy } from '../../../types/Policy';
import { useFormikContext } from 'formik';
import * as Yup from 'yup';
import { useContext } from 'react';
import { makeCopyOfPolicy } from '../../../utils/PolicyAdapter';
import { NewPolicy } from '../../../types/Policy/Policy';
import { Form } from '../../Formik/Patternfly/Form';
import { usePolicyFilter, usePolicyPage, usePolicyRows } from '../../../hooks';
import { useSort } from '../../../hooks/useSort';
import { useGetPoliciesQuery } from '../../../services/useGetPolicies';
import { useUpdateEffect } from 'react-use';

type CreateCustomPolicyFormType = NewPolicy & {
    isValid?: boolean;
};

interface CreateCustomPolicyContextType extends Omit<CopyFromPolicyProps, 'onSelect'> {
    copyPolicy: boolean;
    setCopyPolicy: (param: boolean) => void;
    copiedPolicy: NewPolicy | undefined;
    setCopiedPolicy: (param: NewPolicy | undefined) => void;
}

export interface PolicyStepContextProps {
    showCreateStep: boolean;
}

const CreatePolicyStepContext = React.createContext<CreateCustomPolicyContextType | undefined>(undefined);

export const PolicyStepContext: React.FunctionComponent<PolicyStepContextProps> = (props) => {
    const [ copyPolicy, setCopyPolicy ] = React.useState<boolean>(false);
    const [ copiedPolicy, setCopiedPolicy ] = React.useState<NewPolicy | undefined>({} as NewPolicy);
    const policyFilter = usePolicyFilter();
    const policySort = useSort();
    const policyPage = usePolicyPage(policyFilter.debouncedFilters, 5, policySort.sortBy);
    const policyQuery = useGetPoliciesQuery(policyPage.page, false);
    const policyRows = usePolicyRows(policyQuery.payload, policyQuery.loading, policyQuery.count, policyPage.page);

    const { query } = policyQuery;

    useUpdateEffect(() => {
        query();
    }, [ query, policyPage.page, policyFilter.debouncedFilters ]);

    if (props.showCreateStep) {
        return (
            <CreatePolicyStepContext.Provider value={ {
                copyPolicy,
                setCopyPolicy,
                copiedPolicy,
                setCopiedPolicy,
                policyFilter,
                policyPage,
                policySort,
                policyQuery,
                policyRows
            } }>
                { props.children }
            </CreatePolicyStepContext.Provider>
        );
    }

    return (
        <>
            { props.children }
        </>
    );
};

const CreateCustomPolicyStep: React.FunctionComponent = () => {
    const context = React.useContext(CreatePolicyStepContext);
    if (context === undefined) {
        throw Error('Invalid usage of CreateCustomPolicyStep without valid context');
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
            setVerifyResponse({
                policy: copiedPolicy,
                isValid: true
            });
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

    return (
        <>
            <Form>
                <Title headingLevel="h4" size="xl">{ Messages.wizards.policy.createPolicy.title }</Title>
                <span>Define a new policy:</span>
                <Radio
                    isChecked={ !copyPolicy }
                    name="new-policy"
                    value="from-scratch"
                    id="create-new-custom-policy-from-scratch"
                    onChange={ createFromScratch }
                    label="From scratch"
                />
                <Radio
                    isChecked={ copyPolicy }
                    name="new-policy"
                    value="as-copy"
                    id="create-new-custom-policy-as-copy"
                    onChange={ copyExisting }
                    label="As a copy of existing Policy"
                />
                {copyPolicy && <>
                    <CopyFromPolicy onSelect={ copyFromPolicyHandler } { ...rest } />
                </>
                }
            </Form>
        </>
    );
};

export const createCustomPolicyStep = (stepOverrides?: Partial<WizardStepExtended>): WizardStepExtended => ({
    name: Messages.wizards.policy.createPolicy.title,
    component: <CreateCustomPolicyStep/>,
    validationSchema: Yup.object().shape({
        isValid: Yup.boolean().oneOf([ true ])
    }),
    ...stepOverrides
});
