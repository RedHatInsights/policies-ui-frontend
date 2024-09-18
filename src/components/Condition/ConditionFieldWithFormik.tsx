import { FormGroup, FormHelperText, HelperText, HelperTextItem, Text, TextVariants } from '@patternfly/react-core';
import { useField } from 'formik';
import * as React from 'react';

import { ConditionField, ConditionFieldProps } from './ConditionField';

type ConditionFieldWithFormikProp = Omit<ConditionFieldProps, 'onSelect' | 'value'> & {
    isRequired?: boolean;
    hint?: string;
};

export const ConditionFieldWithFormik: React.FunctionComponent<ConditionFieldWithFormikProp> = (props) => {
    const { hint, ...otherProps } = props;
    const [ field, meta, { setValue }] = useField({ ...otherProps });
    const isValid = !meta.error || !meta.touched;

    const onSelect = React.useCallback((selected) => {
        setValue(selected);
    }, [ setValue ]);

    return (
        <FormGroup
            fieldId={ props.id }
            isRequired={ props.isRequired }
            label={ props.label }
        >
            <ConditionField
                { ...otherProps }
                { ...field }
                value={ field.value ? field.value.toString() : '' }
                onSelect={ onSelect }
            />
            { hint && <Text component={ TextVariants.small }>{ hint }</Text> }
            {isValid ||
                <FormHelperText>
                    <HelperText>
                        <HelperTextItem variant='error'>
                            {meta.error}
                        </HelperTextItem>
                    </HelperText>
                </FormHelperText>
            }
        </FormGroup>
    );
};
