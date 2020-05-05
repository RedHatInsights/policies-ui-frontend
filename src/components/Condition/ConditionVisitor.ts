import { AbstractParseTreeVisitor, ErrorNode, TerminalNode } from 'antlr4ts/tree';

import { ExpressionVisitor } from '../../utils/Expression/ExpressionVisitor';
import {
    ArrayContext, ExprContext,
    // eslint-disable-next-line @typescript-eslint/camelcase
    KeyContext, Logical_operatorContext,
    ValueContext
} from '../../utils/Expression/ExpressionParser';
import { Token } from 'antlr4ts';

export enum PlaceholderType {
    FACT = 'FACT',
    VALUE = 'VALUE',
    LOGICAL_OPERATOR = 'LOGICAL_OPERATOR',
    BOOLEAN_OPERATOR = 'BOOLEAN_OPERATOR',
    ARRAY_OPERATOR = 'ARRAY_OPERATOR',
    NONE = 'NO_SUGGESTION',
    UNKNOWN = 'UNKNOWN',
    EOF = 'EOF',
    ERROR = 'ERROR'
}

interface Placeholder {
    type: PlaceholderType;
    value?: string;
}

export type ConditionVisitorResult = Array<Placeholder | string>;

const makePlaceholderFact = (value?: string): Placeholder => ({ type: PlaceholderType.FACT, value });
const makePlaceholderValue = (value?: string): Placeholder => ({ type: PlaceholderType.VALUE, value });
const makePlaceholderLogicalOperator = (value?: string): Placeholder => ({ type: PlaceholderType.LOGICAL_OPERATOR, value });
const makePlaceholderNone = (): Placeholder => ({ type: PlaceholderType.NONE });
const makePlaceholderUnknown = (): Placeholder => ({ type: PlaceholderType.UNKNOWN });
const makePlaceholderEOF = (): Placeholder => ({ type: PlaceholderType.EOF });
const makePlaceholderError = (value: string): Placeholder => ({ type: PlaceholderType.ERROR, value });

type ReturnValue = ConditionVisitorResult;

//Todo: probably make a query structure that holds all the tokens, will be useful to make suggestions and format the query.

/**
 * Condition visitors returns a list of suggestions based on where we currently are.
 */
export class ConditionVisitor extends AbstractParseTreeVisitor<ReturnValue> implements ExpressionVisitor<ReturnValue> {

    protected defaultResult() {
        return [];
    }

    private static readonly actionablePlaceholderTypes = [
        PlaceholderType.FACT, PlaceholderType.ARRAY_OPERATOR, PlaceholderType.BOOLEAN_OPERATOR, PlaceholderType.LOGICAL_OPERATOR,
        PlaceholderType.VALUE
    ] as Readonly<Array<PlaceholderType>>;

    private static readonly ignoreWhenFlattening = [
        PlaceholderType.ERROR, PlaceholderType.EOF
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
    }

    protected aggregateResult(aggregate: ReturnValue, nextResult: ReturnValue) {
        console.log('aggregate', aggregate, 'next', nextResult);
        let aggregated: ReturnValue;
        if (ConditionVisitor.hasActionablePlaceholders(nextResult)) {
            aggregated = [ ...ConditionVisitor.flattenPlaceholders(aggregate), ...nextResult ];
        } else {
            aggregated = [ ...aggregate, ...nextResult ];
        }

        if (aggregated.length > 0) {
            const lastElement = aggregated[aggregated.length - 1];
            if (typeof lastElement !== 'string' && lastElement.type === PlaceholderType.EOF) {
                aggregated = ConditionVisitor.computeNextPlaceholder(aggregated);
            }
        }

        return aggregated;
    }

    visitTerminal(node: TerminalNode) {
        console.log('visit terminal node', node.text);
        if (node._symbol.type === Token.EOF) {
            return [ makePlaceholderEOF() ];
        }

        return [ node.text ];
    }

    visitErrorNode(node: ErrorNode): ReturnValue {
        console.log('visit error node', node.text);
        return [ makePlaceholderError(node.text) ];
    }

    // eslint-disable-next-line @typescript-eslint/camelcase
    visitLogical_operator(ctx: Logical_operatorContext) {
        console.log('visit logical operator', ctx.text);
        // eslint-disable-next-line new-cap
        const operator = ctx.AND() || ctx.OR();
        if (!operator) {
            return [ makePlaceholderLogicalOperator(ctx.text) ];
        }

        return [ makePlaceholderLogicalOperator(ctx.text) ];
    }

    visitKey(ctx: KeyContext) {
        console.log('visit key', ctx.text);
        // eslint-disable-next-line new-cap
        return [ makePlaceholderFact(ctx.SIMPLETEXT().text) ];
    }

    visitValue(ctx: ValueContext) {
        console.log('visit value [-', ctx.text, '-]');
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

}
