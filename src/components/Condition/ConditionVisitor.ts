import { AbstractParseTreeVisitor, ErrorNode, TerminalNode } from 'antlr4ts/tree';

import { ExpressionVisitor } from '../../utils/Expression/ExpressionVisitor';
import {
    ArrayContext, ExprContext,
    // eslint-disable-next-line @typescript-eslint/camelcase
    KeyContext, Logical_operatorContext,
    ValueContext
} from '../../utils/Expression/ExpressionParser';

export enum SuggestionType {
    FACT = 'FACT',
    VALUE = 'VALUE',
    LOGICAL_OPERATOR = 'LOGICAL_OPERATOR',
    BOOLEAN_OPERATOR = 'BOOLEAN_OPERATOR',
    ARRAY_OPERATOR = 'ARRAY_OPERATOR',
    NONE = 'NO_SUGGESTION'
}

interface SuggestionFact {
    type: SuggestionType.FACT;
}

interface SuggestionValue {
    type: SuggestionType.VALUE;
    fact: string;
}

interface SuggestionLogicalOperator {
    type: SuggestionType.LOGICAL_OPERATOR;
}

interface SuggestionNone {
    type: SuggestionType.NONE;
}

type Suggestion = SuggestionFact | SuggestionValue | SuggestionLogicalOperator | SuggestionNone;

const makeSuggestionFact = (): SuggestionFact => ({ type: SuggestionType.FACT });
const makeSuggestionValue = (fact: string): SuggestionValue => ({ type: SuggestionType.VALUE, fact });
const makeSuggestionLogicalOperator = (): SuggestionLogicalOperator => ({ type: SuggestionType.LOGICAL_OPERATOR });
const makeSuggestionNone = (): SuggestionNone => ({ type: SuggestionType.NONE });

export class ConditionVisitorResult {
    readonly suggestion: Suggestion;
    readonly value: string | undefined;

    constructor(suggestion: Suggestion, value?: string) {
        this.suggestion = suggestion;
        this.value = value;
    }

}

type ReturnValue = ConditionVisitorResult | undefined;

/**
 * Condition visitors returns a list of suggestions based on where we currently are.
 */
export class ConditionVisitor extends AbstractParseTreeVisitor<ReturnValue> implements ExpressionVisitor<ReturnValue> {

    protected defaultResult() {
        return new ConditionVisitorResult(makeSuggestionFact());
    }

    protected aggregateResult(aggregate, nextResult) {
        if (nextResult) {
            return nextResult;
        }

        return aggregate;
    }

    visitTerminal(_node: TerminalNode) {
        return undefined;
    }

    visitErrorNode(_node: ErrorNode): ReturnValue {
        return undefined;
    }

    // eslint-disable-next-line @typescript-eslint/camelcase
    visitLogical_operator(ctx: Logical_operatorContext) {
        // eslint-disable-next-line new-cap
        const operator = ctx.AND() || ctx.OR();
        if (!operator) {
            new ConditionVisitorResult(makeSuggestionLogicalOperator());
        }

        return new ConditionVisitorResult(makeSuggestionFact());
    }

    visitKey(ctx: KeyContext) {
        // eslint-disable-next-line new-cap
        return new ConditionVisitorResult(makeSuggestionFact(), ctx.SIMPLETEXT().text);
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

            return new ConditionVisitorResult(makeSuggestionNone());
        }

        return new ConditionVisitorResult(makeSuggestionValue(''), nodeValue ? nodeValue.text : ctx.text);
    }

}
