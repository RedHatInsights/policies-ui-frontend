import * as React from 'react';
import { ChangeEvent } from 'react';
import { Select, SelectOption, SelectVariant } from '@patternfly/react-core';
import { Fact } from '../../types/Fact';
import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { ExpressionLexer } from '../../utils/Expression/ExpressionLexer';
import { ExpressionParser } from '../../utils/Expression/ExpressionParser';
import { ConditionVisitor, SuggestionType } from './ConditionVisitor';
import { style } from 'typestyle';

const selectOptionClassName = style({
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    direction: 'rtl'
});

const factToOptions = (base: string, facts: Fact[]): JSX.Element[] => {
    return facts.map(o => (
        <SelectOption
            className={ selectOptionClassName }
            key={ base + o.id }
            value={ base + o.name }
        >{ base } <b> { o.name  } </b> </SelectOption>
    ));
};

export interface ConditionFieldProps {
    label: string;
    id: string;
    name: string;
    facts: Fact[];
    selected: string;
    onSelect: (selected: string) => void;
}

export const ConditionField: React.FunctionComponent<ConditionFieldProps> = (props) => {

    const { facts, onSelect, selected } = props;
    const [ isOpen, setOpen ] = React.useState<boolean>(false);
    const [ options, setOptions ] = React.useState<JSX.Element[] | undefined>(
        factToOptions('', facts.slice(0, 10))
    );

    const onFilter = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const localSelection = event.target.value;
        onSelect(localSelection);

        const inputStream = CharStreams.fromString(localSelection);
        const lexer = new ExpressionLexer(inputStream);
        const tokenStream = new CommonTokenStream(lexer);
        const parser = new ExpressionParser(tokenStream);
        const tree = parser.expression();

        const visitor = new ConditionVisitor();
        const result = visitor.visit(tree);

        if (result && result.suggestion.type === SuggestionType.FACT) {
            const resultValue = result.value;
            if (resultValue) {
                setOpen(true);
                const updatedSelection = localSelection.slice(0, localSelection.lastIndexOf(resultValue)).trim() + ' ';
                setOptions(factToOptions(updatedSelection, facts.filter(f => f.name && f.name.includes(resultValue)).slice(0, 10)));
            } else {
                setOptions(factToOptions(localSelection.trim() + ' ', facts.slice(0, 10)));
            }

            setOpen(true);
        } else {
            setOptions([]);
            setOpen(false);
        }

        return [];
    }, [ facts, onSelect ]);

    const onSelectCallback = React.useCallback((event, selected) => {
        onSelect(selected.toString());
        setOpen(false);
    }, [ setOpen, onSelect ]);

    const onClear = React.useCallback(() => {
        onSelect('');
    }, [ onSelect ]);

    return (
        <Select
            label={ props.label }
            id={ props.id }
            name={ props.name }
            onToggle={ () => setOpen(() => !isOpen) }
            isExpanded={ isOpen }
            selections={ selected }
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
