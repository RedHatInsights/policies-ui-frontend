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

const makePlaceholderFact = (value: string): Placeholder => ({ type: PlaceholderType.FACT, value });
const makePlaceholderValue = (value: string): Placeholder => ({ type: PlaceholderType.VALUE, value });
const makePlaceholderLogicalOperator = (value: string): Placeholder => ({ type: PlaceholderType.LOGICAL_OPERATOR, value });
const makePlaceholderBooleanOperator = (value: string): Placeholder => ({ type: PlaceholderType.BOOLEAN_OPERATOR, value });
const makePlaceholderOpenRoundBracket = (value: string): Placeholder => ({ type: PlaceholderType.OPEN_ROUND_BRACKET, value });
const makePlaceholderCloseRoundBracket = (value: string): Placeholder => ({ type: PlaceholderType.CLOSE_ROUND_BRACKET, value });
const makePlaceholderNumericCompareOperator = (value: string): Placeholder => ({ type: PlaceholderType.NUMERIC_COMPARE_OPERATOR, value });
const makePlaceholderError = (value: string): Placeholder => ({ type: PlaceholderType.ERROR, value });
const makePlaceholderUnknown = (value: string): Placeholder => ({ type: PlaceholderType.UNKNOWN, value });

type ReturnValue = ConditionVisitorResult;

const logicalOperators = [ 'AND', 'OR' ];

/**
 * Condition visitors returns a list of suggestions based on where we currently are.
 */
export class ConditionVisitor extends AbstractParseTreeVisitor<ReturnValue> implements ExpressionVisitor<ReturnValue> {

    protected defaultResult() {
        return [];
    }

    /*
    private static readonly actionablePlaceholderTypes = [
        PlaceholderType.FACT, PlaceholderType.ARRAY_OPERATOR, PlaceholderType.BOOLEAN_OPERATOR, PlaceholderType.LOGICAL_OPERATOR,
        PlaceholderType.VALUE
    ] as Readonly<Array<PlaceholderType>>;

    private static readonly ignoreWhenFlattening = [
        PlaceholderType.ERROR
    ] as Readonly<Array<PlaceholderType>>;

    private static flattenPlaceholders(value: ReturnValue): ReturnValue {
        return value.map(element => {
            if (typeof element !== 'string' && !ConditionVisitor.ignoreWhenFlattening.includes(element.type)) {
                return element.value as string; // Filtering this 'undefined' out in later step
            }

            return element;
        }).filter(e => e !== undefined);
    }

    private static hasActionablePlaceholders(value: ReturnValue) {
        return value.some(element => typeof element !== 'string' && ConditionVisitor.actionablePlaceholderTypes.includes(element.type));
    }

    private static computeNextPlaceholder(value: ReturnValue): ReturnValue {
        value = value.slice(0, value.length - 1);

        const valuesWithoutError = value.filter(element => typeof element === 'string' || element.type !== PlaceholderType.ERROR);
        let nextPlaceholder: Placeholder | undefined;
        if (valuesWithoutError.length === 0) {
            nextPlaceholder = makePlaceholderFact();
        } else {
            const last = value[value.length - 1];
            if (typeof last !== 'string') {
                if (last.type === PlaceholderType.LOGICAL_OPERATOR) {
                    nextPlaceholder = makePlaceholderFact();
                }
            }
        }

        if (nextPlaceholder) {
            return ConditionVisitor.flattenPlaceholders(value).concat([ nextPlaceholder ]);
        }

        return value;
    }*/

    protected aggregateResult(aggregate: ReturnValue, nextResult: ReturnValue) {
        let aggregated: ReturnValue;
        /*if (ConditionVisitor.hasActionablePlaceholders(nextResult)) {
            aggregated = [ ...ConditionVisitor.flattenPlaceholders(aggregate), ...nextResult ];
        } else {
            aggregated = [ ...aggregate, ...nextResult ];
        }*/
        aggregated = [ ...aggregate, ...nextResult ];

        /*if (aggregated.length > 0) {
            const lastElement = aggregated[aggregated.length - 1];
            if (typeof lastElement !== 'string' && lastElement.type === PlaceholderType.EOF) {
                aggregated = ConditionVisitor.computeNextPlaceholder(aggregated);
            }
        }*/

        return aggregated;
    }

    visitTerminal(node: TerminalNode) {
        if (node.symbol.type === Token.EOF) {
            return [ ];
        }

        if (node.text === '(') {
            return [ makePlaceholderOpenRoundBracket('(') ];
        } else if (node.text === ')') {
            return [ makePlaceholderCloseRoundBracket(')') ];
        }

        return [ makePlaceholderUnknown(node.text) ];
    }

    visitErrorNode(node: ErrorNode): ReturnValue {
        if (node.text === '<missing \')\'>') {
            return [ makePlaceholderCloseRoundBracket(')') ];
        }

        const parent = node.parent;
        if (parent && (parent instanceof ObjectContext || parent instanceof ExpressionContext) && parent.children) {
            const index = parent.children.indexOf(node);
            if (index > 0 && parent.children[index - 1] instanceof ObjectContext) {
            //if (parent.childCount === 3 && parent.children.indexOf(node) === 1 && ConditionVisitor.isEOF(parent.children[2])) {
                if (logicalOperators.some(op => op.includes(node.text.toUpperCase()))) {
                    return [ makePlaceholderLogicalOperator(node.text) ];
                }
            }
        }

        return [ makePlaceholderError(node.text) ];
    }

    // eslint-disable-next-line @typescript-eslint/camelcase
    visitLogical_operator(ctx: Logical_operatorContext) {
        return [ makePlaceholderLogicalOperator(ctx.text) ];
    }

    // eslint-disable-next-line @typescript-eslint/camelcase
    visitBoolean_operator(ctx: Boolean_operatorContext) {
        return [ makePlaceholderBooleanOperator(ctx.text) ];
    }

    // eslint-disable-next-line @typescript-eslint/camelcase
    visitNumeric_compare_operator(ctx: Numeric_compare_operatorContext) {
        return [ makePlaceholderNumericCompareOperator(ctx.text) ];
    }

    visitKey(ctx: KeyContext) {
        // eslint-disable-next-line new-cap
        return [ makePlaceholderFact(ctx.SIMPLETEXT().text) ];
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
                    return [ makePlaceholderValue(`"${ctx.start.inputStream.toString().slice(ctx.start.startIndex, ctx.stop.stopIndex + 1)}"`) ];
                }

                return [ makePlaceholderValue(`"${ctx.text}"`) ];
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

                return [ makePlaceholderValue(possibleValue) ];
            }

            return this.visitChildren(ctx);
        }

        return [ makePlaceholderValue(nodeValue.text) ];
    }

    // eslint-disable-next-line @typescript-eslint/camelcase
    visitNumerical_value(ctx: Numerical_valueContext) {
        return [ makePlaceholderValue(ctx.text) ];
    }

    private static isEOF(element: ParseTree) {
        if (element instanceof TerminalNode) {
            return element.symbol.type === ExpressionParser.EOF;
        }

        return false;
    }

}
