import * as React from 'react';
import { ChangeEvent } from 'react';
import { Select, SelectOption, SelectVariant } from '@patternfly/react-core';
import { Fact } from '../../types/Fact';
import { style } from 'typestyle';
import { useEffectOnce, useUpdateEffect } from 'react-use';
import { computeOptions } from './ComputeOptions';

const selectOptionClassName = style({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
});

export const factToOptions = (prefix: string, options: string[], postfix: string): JSX.Element[] => {
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
            key={ prefix + o }
            value={ prefix + o }
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

export interface ConditionFieldProps {
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
    const [ options, setOptions ] = React.useState<JSX.Element[] | undefined>();

    const buildOptionsWithCondition = React.useCallback((condition: string) => {
        return buildOptionList(condition, facts);
    }, [ facts ]);

    const processUpdate = React.useCallback((tryToOpen: boolean) => {
        const options = buildOptionsWithCondition(value);

        if (tryToOpen) {
            let isOpen = options.length > 0;
            if (options.length === 1 && options[0].props.value === value) {
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

    const onFilter = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const localSelection = event.target.value;
        onSelect(localSelection);
        return [];
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

    return (
        <Select
            label={ props.label }
            toggleId={ props.id }
            name={ props.name }
            onToggle={ () => setOpen(() => !isOpen) }
            isExpanded={ isOpen }
            selections={ value }
            variant={ SelectVariant.typeahead }
            onSelect={ onSelectCallback }
            onFilter={ onFilter }
            onClear={ onClear }
            ariaLabelTypeAhead="Condition writer"
            style={ {
                maxWidth: '100%'
            } }
        >
            { options }
        </Select>
    );
};
