import * as React from 'react';
import { ConditionField, ConditionFieldProps } from './ConditionField';
import { useField } from 'formik';
import { FormGroup, Text, TextVariants } from '@patternfly/react-core';

type ConditionFieldWithFormikProp = Omit<ConditionFieldProps, 'onSelect' | 'value'> & {
    isRequired?: boolean;
    hint?: string;
};

export const ConditionFieldWithForkmik: React.FunctionComponent<ConditionFieldWithFormikProp> = (props) => {
    const { hint, ...otherProps } = props;
    const [ field, meta, { setValue }] = useField({ ...otherProps });
    const isValid = !meta.error || !meta.touched;

    const onSelect = React.useCallback((selected) => {
        setValue(selected);
    }, [ setValue ]);

    return (
        <FormGroup
            fieldId={ props.id }
            helperTextInvalid={ meta.error }
            isRequired={ props.isRequired }
            isValid={ isValid }
            label={ props.label }
        >
            <ConditionField
                { ...otherProps }
                { ...field }
                value={ field.value ? field.value.toString() : field.value }
                onSelect={ onSelect }
            />
            { hint && <Text component={ TextVariants.small }>{ hint }</Text> }
        </FormGroup>
    );
};
