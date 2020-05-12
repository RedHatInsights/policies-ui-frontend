import { ConditionVisitor, ConditionVisitorResult, ElementType } from './ConditionVisitor';
import { Fact } from '../../types/Fact';
import { ConditionParser } from './Parser';

const flattenResult = (result: ConditionVisitorResult): string => {
    return result.reduce((condition, next) => {
        if (next.value === ',' || condition === '') {
            condition += next.value;
        } else {
            condition += ' ' + next.value;
        }

        return condition;
    }, '');
};

type ComputeOptionsResponse = undefined | {
    prefix: string;
    options: Array<string>;
    postfix: string;
}

const maxOptions = 10;

export const computeOptions = (condition: string, facts: Fact[]): ComputeOptionsResponse => {
    const parser = ConditionParser.fromString(condition);
    const tree = parser.expression();

    const visitor = new ConditionVisitor();
    const result = visitor.visit(tree).filter(e => e.type !== ElementType.ERROR);

    let lastElement = result.pop();
    const postfixElements: typeof result = [];

    if (lastElement === undefined) {
        return {
            prefix: '',
            options: facts.slice(0, maxOptions).map(f => f.name || ''),
            postfix: ''
        };
    }

    while (lastElement.type === ElementType.CLOSE_ROUND_BRACKET) {
        const next = result.pop();
        if (next === undefined) {
            break;
        }

        postfixElements.unshift(lastElement);
        lastElement = next;
    }

    const base = flattenResult(result);
    const postfix = flattenResult(postfixElements);

    const placeholderElement = lastElement;

    if (placeholderElement.type === ElementType.FACT) {
        return {
            prefix: base,
            options: facts.filter(
                f => f.name && f.name.toUpperCase().includes(placeholderElement.value.toUpperCase())).slice(0, maxOptions).map(f => f.name || ''
            ),
            postfix
        };
    } else {
        postfixElements.unshift(placeholderElement);
        return {
            prefix: base,
            options: [],
            postfix: flattenResult(postfixElements)
        };
    }
};
