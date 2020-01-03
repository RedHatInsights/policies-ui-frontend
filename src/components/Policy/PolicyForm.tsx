import * as React from 'react';
import { Form, Wizard } from '@patternfly/react-core';
import { FieldArray, FieldArrayRenderProps, Formik, FormikHelpers, FormikProps } from 'formik';
import { DeepPartial } from 'ts-essentials';

import { FormTextInput, Switch } from '../Formik/Patternfly';
import { Policy } from '../../types/Policy';
import { ActionsForm } from './ActionsForm';
import { PolicyFormSchema } from '../../schemas/CreatePolicy/PolicySchema';
import { WizardStep } from '@patternfly/react-core';
import { createCustomPolicyStep } from './WizardSteps/CreateCustomPolicyStep';

type FormType = DeepPartial<Policy>;

interface PolicyFormProps {
    initialValue: FormType;
    create: (policy: FormType) => Promise<boolean>;
    verify: (policy: FormType) => Promise<boolean>;
    isOpen: boolean;
    close: () => void;
}

interface PolicyFormState {
    isVerified: boolean;
    action: 'verify' | 'create' | undefined;
}

const DetailsComponent = () => {
    return (
        <Form isHorizontal>
            <FormTextInput isRequired={ true } label="Name" type="text" name="name" id="name" placeholder="Name of the policy"/>
            <FormTextInput label="Description" type="text" id="description" name="description" placeholder="A short description"/>
            <Switch type="checkbox" id="isEnabled" name="isEnabled" labelOff="Disabled" labelOn="Enabled" label="Enabled?"/>
        </Form>
    );
};

const ConditionComponent = () => {
    return (
        <Form isHorizontal>
            <FormTextInput isRequired={ true } label="Condition text" type="text" id="conditions" name="conditions" placeholder={ '"a" == "b"' }/>
        </Form>
    );
};

const ActionsComponent = () => {
    return (
        <Form isHorizontal>
            <FieldArray name="actions">
                { (helpers: FieldArrayRenderProps) => {
                    return <ActionsForm actions={ helpers.form.values.actions } arrayHelpers={ helpers }/>;
                } }
            </FieldArray>
        </Form>
    );
};

export const PolicyForm: React.FunctionComponent<PolicyFormProps> = (props: PolicyFormProps) => {

    const [ state, setState ] = React.useState<PolicyFormState>({
        isVerified: false,
        action: undefined
    });

    const steps: WizardStep[] = [
        createCustomPolicyStep({
            id: 1,
            canJumpTo: false
        }),
        {
            id: 2,
            name: 'Details',
            component: <DetailsComponent/>
        },
        {
            id: 3,
            name: 'Conditions',
            component: <ConditionComponent/>
        },
        {
            id: 4,
            name: 'Actions',
            component: <ActionsComponent/>
        },
        {
            id: 5,
            name: 'Review',
            component: <div>Hello world</div>
        }
    ];

    const onSubmit = (policy: FormType, formikHelpers: FormikHelpers<FormType>) => {
        formikHelpers.setSubmitting(false);
        const transformedPolicy = PolicyFormSchema.cast(policy);
        switch (state.action) {
            case 'create':
                props.create(transformedPolicy);
                break;
            case 'verify':
                props.verify(transformedPolicy);
                setState(prevState => ({ ...prevState, isVerified: true }));
                break;
            default:
                throw new Error('Unexpected action');
        }

        setState(prevState => ({ ...prevState, action: undefined  }));
    };

    return (
        <Formik<DeepPartial<Policy>>
            initialValues={ props.initialValue }
            validateOnMount={ true }
            onSubmit={ onSubmit }
            validationSchema={ PolicyFormSchema }
        >
            {(props: FormikProps<FormType>) => {

                React.useEffect(() => {
                    if (state.action) {
                        props.handleSubmit();
                    }
                }, [ state.action ]);

                /*const verify = () => {
                    setState(prevState => ({ ...prevState, action: 'verify' }));
                };

                const create = () => {
                    setState(prevState => ({ ...prevState, action: 'create' }));
                };*/

                console.log('props.isValid', props.isValid);
                console.log('props.values', props.values);
                console.log('props.errors', props.errors);

                return (
                    <Form onSubmit={ props.handleSubmit } isHorizontal id="my-form-id">
                        <Wizard
                            isOpen={ true }
                            onClose={ () => console.log('close') }
                            title="Add Custom Policy"
                            description={ 'Custom policies are processed on reception of system profile messages. ' +
                            'If condition(s) are met, defined action(s) are triggered·' }
                            steps={ steps }
                        />
                    </Form>
                );}}

        </Formik>
    );
};
