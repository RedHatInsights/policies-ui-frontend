import * as React from 'react';
import { TextInput, FormSelect, FormSelectOption, Flex, FlexItem } from '@patternfly/react-core';

type KeyValue = {
    [key: string]: string;
};

interface ConditionProps {
    fact: KeyValue;  // Todo: Use `fact` model.
    operator: KeyValue;
    value?: string | null; // This can be several things and we could tie it with the fact type.

    children?: undefined;
}

interface SelectWithValuesProps {
    'aria-label': string;
    values: KeyValue;
}

const SelectWithValues: React.FunctionComponent<SelectWithValuesProps> = (props: SelectWithValuesProps) => {
    return (
        <FormSelect aria-label={ props['aria-label'] }>
            { Object.keys(props.values).map(key => <FormSelectOption key={ key } label={ props.values[key] }/>) }
        </FormSelect>
    );
};

export const Condition: React.FunctionComponent<ConditionProps> = (props: ConditionProps) => {
    return (
        <Flex>
            <FlexItem>
                <SelectWithValues aria-label="Field" values={ props.fact }/>
            </FlexItem>
            <FlexItem>
                <SelectWithValues aria-label="Operator" values={ props.operator }/>
            </FlexItem>
            <FlexItem>
                <TextInput
                    isDisabled={ props.value === null }
                    aria-label="Value"
                    value={ props.value !== null ? props.value : '' }/>
            </FlexItem>
        </Flex>
    );
};
