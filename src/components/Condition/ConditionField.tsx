import * as React from 'react';
import { ChangeEvent, useEffect } from 'react';
import { Select, SelectOption, SelectVariant } from '@patternfly/react-core';
import { Fact } from '../../types/Fact';
import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { ExpressionLexer } from '../../utils/Expression/ExpressionLexer';
import { ExpressionParser } from '../../utils/Expression/ExpressionParser';
import { ConditionVisitor, PlaceholderType } from './ConditionVisitor';
import { style } from 'typestyle';
import { useEffectOnce, useUpdateEffect } from 'react-use';

const selectOptionClassName = style({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
});

export const factToOptions = (base: string, facts: Fact[]): JSX.Element[] => {
    base = base.trim();
    if (base.length > 0) {
        base += ' ';
    }

    return facts.map(o => (
        <SelectOption
            className={ selectOptionClassName }
            key={ base + o.id }
            value={ base + o.name }
        >{ base }<b>{ o.name  }</b></SelectOption>
    ));
};

const maxDisplayedElements = 10;

export const buildOptionList = (condition: string, facts: Fact[]) => {
    try {
        const inputStream = CharStreams.fromString(condition);
        const lexer = new ExpressionLexer(inputStream);
        lexer.removeErrorListeners();
        const tokenStream = new CommonTokenStream(lexer);
        const parser = new ExpressionParser(tokenStream);
        parser.removeErrorListeners();
        const tree = parser.expression();

        const visitor = new ConditionVisitor();
        const result = visitor.visit(tree);

        if (result && result.suggestion.type === PlaceholderType.FACT) {
            const resultValue = result.value;
            if (resultValue) {
                const updatedSelection = condition.slice(0, condition.lastIndexOf(resultValue));
                const filteredFacts = facts.filter(f => f.name && f.name.includes(resultValue)).slice(0, maxDisplayedElements);
                return factToOptions(updatedSelection, filteredFacts);
            } else {
                return factToOptions(condition, facts.slice(0, maxDisplayedElements));
            }
        } else {
            return [];
        }
    } catch (ex) {
        return [];
    }
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
