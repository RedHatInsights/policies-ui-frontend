import {
    Select,
    SelectOption,
    SelectVariant
} from '@patternfly/react-core/deprecated';
import { OuiaComponentProps } from '@redhat-cloud-services/insights-common-typescript';
import * as React from 'react';
import { ChangeEvent } from 'react';
import { useEffectOnce, useUpdateEffect } from 'react-use';
import { style } from 'typestyle';

import { Fact } from '../../types/Fact';
import { getOuiaProps } from '../../utils/getOuiaProps';
import { computeOptions } from './ComputeOptions';

const selectOptionClassName = style({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
});

export const factToOptions = (prefix: string, options: string[], postfix: string): Array<React.ReactElement> => {
    prefix = prefix.trim();
    if (prefix.length > 0 && options.length > 0) {
        prefix += ' ';
    }

    if (postfix.length > 0 && options.length > 0) {
        postfix = ' ' + postfix;
    }

    return (options || [ ' ' ]).map(o => (
        <SelectOption
            className={ selectOptionClassName }
            key={ prefix + o + postfix }
            value={ prefix + o + postfix }
        >{ prefix }<b>{ o }</b>{ postfix }</SelectOption>
    ));
};

export const buildOptionList = (condition: string, facts: Fact[]) => {
    try {

        const response = computeOptions(condition, facts);
        if (response) {
            return factToOptions(response.prefix, response.options, response.postfix);
        }
    } catch (ex) {
        console.log(`Exception when computing options for condition [${condition}]`, ex);
    }

    return [];
};

export interface ConditionFieldProps extends OuiaComponentProps {
    label: string;
    id: string;
    name: string;
    facts: Fact[];
    value: string;
    onSelect: (selected: string) => void;
}

export const ConditionField: React.FunctionComponent<ConditionFieldProps> = (props) => {

    const { facts, onSelect, value } = props;
    const [ isOpen, setOpen ] = React.useState<boolean>(false);
    const [ options, setOptions ] = React.useState<Array<React.ReactElement> | undefined>();

    const buildOptionsWithCondition = React.useCallback((condition: string) => {
        return buildOptionList(condition, facts);
    }, [ facts ]);

    const processUpdate = React.useCallback((tryToOpen: boolean) => {
        const options = buildOptionsWithCondition(value);

        if (tryToOpen) {
            let isOpen = options.length > 0;
            if (options.length === 1 && options[0]?.props?.value === value) {
                isOpen = false;
            }

            setOpen(isOpen);
        }

        setOptions(options);
    }, [ value, buildOptionsWithCondition, setOptions ]);

    useUpdateEffect(() => {
        processUpdate(true);
    }, [ processUpdate ]);

    useEffectOnce(() => {
        processUpdate(false);
    });

    const onFilter = React.useCallback((event: ChangeEvent<HTMLInputElement>, value: string) => {
        if (event) {
            onSelect(value);
        }

        return undefined;
    }, [ onSelect ]);

    const onSelectCallback = React.useCallback((event, selected) => {
        onSelect(selected.toString());
        setOptions(prevOptions => {
            if (prevOptions && prevOptions.length === 1 && prevOptions[0].props.value === selected) {
                setOpen(false);
            }

            return prevOptions;
        });
    }, [ onSelect ]);

    const onClear = React.useCallback(() => {
        onSelect('');
    }, [ onSelect ]);

    const onToggle = React.useCallback((shouldBeOpen) => {
        setOpen(shouldBeOpen);
    }, [ ]);

    return (
        <Select
            { ...getOuiaProps('ConditionField', props) }
            label={ props.label }
            toggleId={ props.id }
            name={ props.name }
            onToggle={ onToggle }
            isOpen={ isOpen }
            selections={ value }
            variant={ SelectVariant.typeahead }
            onSelect={ onSelectCallback }
            onFilter={ onFilter as any } // Todo: Remove `as any` if https://github.com/patternfly/patternfly-react/pull/6073 gets released
            onClear={ onClear }
            typeAheadAriaLabel="Condition writer"
            style={ {
                maxWidth: '100%'
            } }
        >
            { options }
        </Select>
    );
};
