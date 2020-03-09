import * as React from 'react';
import { Form as PFForm, FormProps } from '@patternfly/react-core';

const preventDefaultHandler = (e: React.FormEvent) => e.preventDefault();

export const Form: React.FunctionComponent<FormProps> = (props) => {
    return (
        <PFForm onSubmit={ preventDefaultHandler } { ...props }>
            { props.children }
        </PFForm>
    );
};
