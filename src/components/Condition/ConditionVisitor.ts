import { AbstractParseTreeVisitor, ErrorNode, ParseTree, TerminalNode } from 'antlr4ts/tree';

import { ExpressionVisitor } from '../../utils/Expression/ExpressionVisitor';
import {
    // eslint-disable-next-line @typescript-eslint/camelcase
    ArrayContext, Boolean_operatorContext, ExprContext, ExpressionContext, ExpressionParser,
    // eslint-disable-next-line @typescript-eslint/camelcase
    KeyContext, Logical_operatorContext, Numeric_compare_operatorContext, Numerical_valueContext, ObjectContext,
    ValueContext
} from '../../utils/Expression/ExpressionParser';
import { Token } from 'antlr4ts';
import { logicalOperators } from './Tokens';

export enum PlaceholderType {
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
    type: PlaceholderType;
    value: string;
}

export type ConditionVisitorResult = Array<Placeholder>;

const makeFact = (value: string): Placeholder => ({ type: PlaceholderType.FACT, value });
const makeValue = (value: string): Placeholder => ({ type: PlaceholderType.VALUE, value });
const makeLogicalOperator = (value: string): Placeholder => ({ type: PlaceholderType.LOGICAL_OPERATOR, value });
const makeBooleanOperator = (value: string): Placeholder => ({ type: PlaceholderType.BOOLEAN_OPERATOR, value });
const makeOpenBracket = (value: string): Placeholder => ({ type: PlaceholderType.OPEN_ROUND_BRACKET, value });
const makeCloseBracket = (value: string): Placeholder => ({ type: PlaceholderType.CLOSE_ROUND_BRACKET, value });
const makeNumericCompareOperator = (value: string): Placeholder => ({ type: PlaceholderType.NUMERIC_COMPARE_OPERATOR, value });
const makeError = (value: string): Placeholder => ({ type: PlaceholderType.ERROR, value });
const makeUnknown = (value: string): Placeholder => ({ type: PlaceholderType.UNKNOWN, value });

type ReturnValue = ConditionVisitorResult;

/**
 * Condition visitors returns a list of suggestions based on where we currently are.
 */
export class ConditionVisitor extends AbstractParseTreeVisitor<ReturnValue> implements ExpressionVisitor<ReturnValue> {

    protected defaultResult() {
        return [];
    }

    protected aggregateResult(aggregate: ReturnValue, nextResult: ReturnValue) {
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

        const parent = node.parent;
        if (parent && (parent instanceof ObjectContext || parent instanceof ExpressionContext) && parent.children) {
            const index = parent.children.indexOf(node);
            if (index > 0 && parent.children[index - 1] instanceof ObjectContext) {
                if (logicalOperators.some(op => op.includes(node.text.toUpperCase()))) {
                    return [ makeLogicalOperator(node.text) ];
                }
            }
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
        return [ makeFact(ctx.SIMPLETEXT().text) ];
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
