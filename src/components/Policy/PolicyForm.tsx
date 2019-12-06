import * as React from 'react';
import {
    ActionGroup,
    Button,
    capitalize,
    Form,
    FormGroup,
    FormSelectOption
} from '@patternfly/react-core';
import { Formik, FormikProps, FormikHelpers, FieldArray, ArrayHelpers } from 'formik';
import { Link } from 'react-router-dom';
import { DeepPartial } from 'ts-essentials';

import { TextInput, FormSelect, Switch } from '../Formik/Patternfly';
import { Policy, Severity } from '../../types/Policy';
import { ActionsForm } from './ActionsForm';

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
        switch (state.action) {
            case 'create':
                props.create(policy);
                break;
            case 'verify':
                props.verify(policy);
                setState(prevState => ({ ...prevState, isVerified: true }));
                break;
            default:
                throw new Error('Unexpected action');
        }

        setState(prevState => ({ ...prevState, action: undefined  }));
    };

    return (
        <Formik<DeepPartial<Policy>> initialValues={ props.initialValue } onSubmit={ onSubmit }>
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

                return (
                    <Form onSubmit={ props.handleSubmit } isHorizontal>
                        <FormGroup fieldId="name" label="Name" isRequired>
                            <TextInput type="text" name="name" id="name" placeholder="Name of the policy"/>
                            {props.errors.name && props.touched.name && props.errors.name}
                        </FormGroup>
                        <FormGroup fieldId="description" label="Description">
                            <TextInput type="text" id="description" name="description" placeholder="A short description"/>
                        </FormGroup>
                        <FormGroup fieldId="condition" label="Condition text">
                            <TextInput type="text" id="condition" name="condition" placeholder={ '"a" == "b"' }/>
                        </FormGroup>
                        <FormGroup fieldId="isEnabled" label="Enabled?">
                            <Switch type="checkbox" id="isEnabled" name="isEnabled" labelOff="Disabled" label="Enabled" />
                        </FormGroup>
                        <FormGroup fieldId="severity" label="Severity">
                            <FormSelect id="severity" name="severity">
                                { Object.values(Severity).map(severity => <FormSelectOption
                                    key={ severity }
                                    label={ capitalize(severity) }
                                    value={ severity }/>)}
                            </FormSelect>
                        </FormGroup>
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
