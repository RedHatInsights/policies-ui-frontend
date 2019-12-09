import * as React from 'react';
import { ActionGroup, Button, Form } from '@patternfly/react-core';
import { ArrayHelpers, FieldArray, Formik, FormikHelpers, FormikProps } from 'formik';
import { Link } from 'react-router-dom';
import { DeepPartial } from 'ts-essentials';

import { FormTextInput, Switch } from '../Formik/Patternfly';
import { Policy } from '../../types/Policy';
import { ActionsForm } from './ActionsForm';
import { PolicyFormSchema } from '../../schemas/CreatePolicy/PolicySchema';

type FormType = DeepPartial<Policy>;

interface PolicyFormProps {
  initialValue: FormType;
  create: (policy: FormType) => Promise<boolean>;
  verify: (policy: FormType) => Promise<boolean>;
}

interface PolicyFormState {
    isVerified: boolean;
    action: 'verify' | 'create' | undefined;
}

export const PolicyForm: React.FunctionComponent<PolicyFormProps> = (props: PolicyFormProps) => {

    const [ state, setState ] = React.useState<PolicyFormState>({
        isVerified: false,
        action: undefined
    });

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

                const verify = () => {
                    setState(prevState => ({ ...prevState, action: 'verify' }));
                };

                const create = () => {
                    setState(prevState => ({ ...prevState, action: 'create' }));
                };

                console.log('props.isValid', props.isValid);
                console.log('props.values', props.values);
                console.log('props.errors', props.errors);

                return (
                    <Form onSubmit={ props.handleSubmit } isHorizontal>
                        <FormTextInput isRequired={ true } label="Name" type="text" name="name" id="name" placeholder="Name of the policy"/>
                        <FormTextInput label="Description" type="text" id="description" name="description" placeholder="A short description"/>
                        <FormTextInput label="Condition text" type="text" id="condition" name="condition" placeholder={ '"a" == "b"' }/>
                        <Switch type="checkbox" id="isEnabled" name="isEnabled" labelOff="Disabled" labelOn="Enabled" label="Enabled?"/>
                        <FieldArray name="actions">
                            { (helpers: ArrayHelpers) => {
                                return <ActionsForm actions={ props.values.actions } arrayHelpers={ helpers }/>;
                            } }
                        </FieldArray>
                        <ActionGroup>
                            <Link to='/list' className={ 'btn btn-secondary' }>
                                <Button variant="secondary">Back</Button>
                            </Link>
                            <Button
                                key={ 'create' } variant={ 'secondary' }
                                isDisabled={ !state.isVerified || props.isSubmitting }
                                onClick={ create }>Create</Button>
                            <Button
                                key={ 'verify' } variant={ 'primary' }
                                isDisabled={ !props.isValid || props.isSubmitting }
                                onClick={ verify }>Verify</Button>
                        </ActionGroup>
                    </Form>
                );}}

        </Formik>
    );
};
