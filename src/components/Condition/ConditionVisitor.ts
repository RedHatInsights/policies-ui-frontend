import { Token } from 'antlr4ts';
import { AbstractParseTreeVisitor, ErrorNode, TerminalNode } from 'antlr4ts/tree';

import {
    // eslint-disable-next-line @typescript-eslint/camelcase
    ArrayContext, Boolean_operatorContext, ExprContext,
    // eslint-disable-next-line @typescript-eslint/camelcase
    KeyContext, Logical_operatorContext, Numeric_compare_operatorContext, Numerical_valueContext,
    ValueContext
} from '../../utils/Expression/ExpressionParser';
import { ExpressionVisitor } from '../../utils/Expression/ExpressionVisitor';

export enum ElementType {
    FACT = 'FACT',
    VALUE = 'VALUE',
    LOGICAL_OPERATOR = 'LOGICAL_OPERATOR',
    BOOLEAN_OPERATOR = 'BOOLEAN_OPERATOR',
    NUMERIC_COMPARE_OPERATOR = 'NUMERIC_COMPARE_OPERATOR',
    OPEN_ROUND_BRACKET = 'OPEN_ROUND_BRACKET',
    CLOSE_ROUND_BRACKET = 'CLOSE_ROUND_BRACKET',
    UNKNOWN = 'UNKNOWN',
    ERROR = 'ERROR'
}

interface Placeholder {
    type: ElementType;
    value: string;
}

export type ConditionVisitorResult = Array<Placeholder>;

const makeFact = (value: string): Placeholder => ({ type: ElementType.FACT, value });
const makeValue = (value: string): Placeholder => ({ type: ElementType.VALUE, value });
const makeLogicalOperator = (value: string): Placeholder => ({ type: ElementType.LOGICAL_OPERATOR, value });
const makeBooleanOperator = (value: string): Placeholder => ({ type: ElementType.BOOLEAN_OPERATOR, value });
const makeOpenBracket = (value: string): Placeholder => ({ type: ElementType.OPEN_ROUND_BRACKET, value });
const makeCloseBracket = (value: string): Placeholder => ({ type: ElementType.CLOSE_ROUND_BRACKET, value });
const makeNumericCompareOperator = (value: string): Placeholder => ({ type: ElementType.NUMERIC_COMPARE_OPERATOR, value });
const makeError = (value: string): Placeholder => ({ type: ElementType.ERROR, value });
const makeUnknown = (value: string): Placeholder => ({ type: ElementType.UNKNOWN, value });

type ReturnValue = ConditionVisitorResult;

const first = <T>(array: Array<T>): T | undefined => {
    return array.length === 0 ? undefined : array[0];
};

const last = <T>(array: Array<T>): T | undefined => {
    return array.length === 0 ? undefined : array[ array.length - 1];
};

/**
 * Condition visitors returns a list of suggestions based on where we currently are.
 */
export class ConditionVisitor extends AbstractParseTreeVisitor<ReturnValue> implements ExpressionVisitor<ReturnValue> {

    protected defaultResult() {
        return [];
    }

    protected aggregateResult(aggregate: ReturnValue, nextResult: ReturnValue) {

        const lastAggregatedWithoutError = last(aggregate.filter(e => e.type !== ElementType.ERROR));
        const firstNextWithouterror = first(nextResult.filter(e => e.type !== ElementType.ERROR));

        if (lastAggregatedWithoutError && firstNextWithouterror &&
            lastAggregatedWithoutError.type === ElementType.LOGICAL_OPERATOR &&
            firstNextWithouterror.type === ElementType.LOGICAL_OPERATOR) {
            firstNextWithouterror.type = ElementType.ERROR;
        }

        return [ ...aggregate, ...nextResult ];
    }

    visitTerminal(node: TerminalNode) {
        if (node.symbol.type === Token.EOF) {
            return [ ];
        }

        if (node.text === '(') {
            return [ makeOpenBracket('(') ];
        } else if (node.text === ')') {
            return [ makeCloseBracket(')') ];
        }

        return [ makeUnknown(node.text) ];
    }

    visitErrorNode(node: ErrorNode): ReturnValue {
        if (node.text === '<missing \')\'>') {
            return [ makeCloseBracket(')') ];
        }

        return [ makeError(node.text) ];
    }

    // eslint-disable-next-line @typescript-eslint/camelcase
    visitLogical_operator(ctx: Logical_operatorContext) {
        return [ makeLogicalOperator(ctx.text) ];
    }

    // eslint-disable-next-line @typescript-eslint/camelcase
    visitBoolean_operator(ctx: Boolean_operatorContext) {
        return [ makeBooleanOperator(ctx.text) ];
    }

    // eslint-disable-next-line @typescript-eslint/camelcase
    visitNumeric_compare_operator(ctx: Numeric_compare_operatorContext) {
        return [ makeNumericCompareOperator(ctx.text) ];
    }

    visitKey(ctx: KeyContext) {
        // eslint-disable-next-line new-cap
        const simpleText = ctx.SIMPLETEXT();
        if (simpleText) {
            return [ makeFact(simpleText.text) ];
        }

        // eslint-disable-next-line new-cap
        const text = ctx.STRING()?.text;
        if (text && text.length >= 2) {
            return [ makeFact(text.substr(1, text.length - 2)) ];
        }

        return [ makeFact('') ];
    }

    visitValue(ctx: ValueContext) {
        // eslint-disable-next-line new-cap
        const nodeValue = ctx.NUMBER() || ctx.STRING();

        if (!nodeValue) {
            if (ctx.parent instanceof ExprContext) {
                // Todo: Expected value inside ExprContext
            } else if (ctx.parent instanceof ArrayContext) {
                // Todo: Expected value inside ArrayContext
            }

            if (ctx.text) {
                if (ctx.childCount > 1 && ctx.start.inputStream && ctx.stop) {
                    return [ makeValue(`"${ctx.start.inputStream.toString().slice(ctx.start.startIndex, ctx.stop.stopIndex + 1)}"`) ];
                }

                return [ makeValue(`"${ctx.text}"`) ];
            } else if (ctx.start.inputStream && ctx.stop && ctx.stop.text) {
                // We reach up to this point when we have a STRING without a closing (double)quote
                // That part doesn't seem to trigger an error on the current setup, so i manually extract it from the input
                let possibleValue = ctx.start.inputStream.toString()
                .slice(ctx.stop.stopIndex + 1, ctx.start.startIndex).trimLeft();
                if (possibleValue.startsWith('"') && !possibleValue.endsWith('"')) {
                    possibleValue += '"';
                } else if (possibleValue.startsWith('\'') && !possibleValue.endsWith('\'')) {
                    possibleValue += '\'';
                }

                return [ makeValue(possibleValue) ];
            }

            return this.visitChildren(ctx);
        }

        return [ makeValue(nodeValue.text) ];
    }

    // eslint-disable-next-line @typescript-eslint/camelcase
    visitNumerical_value(ctx: Numerical_valueContext) {
        return [ makeValue(ctx.text) ];
    }
}
