import { ATN, ParserATNSimulator } from 'antlr4ts/atn';
import { ParserRuleContext, TokenStream } from 'antlr4ts';
import { ArrayContext, ExprContext, ExpressionParser, ObjectContext } from '../../../utils/Expression/ExpressionParser';
import { exprCompareOperators, logicalOperators } from '../Tokens';

/**
 * This class is used to predict the token consumption for typeahead, we want to ensure to suggest partial operators
 * (e.g. AND for 'an' or CONTAINS for 'con') when possible, the default implementation prevents this because:
 *  1) Partial operators are SIMPLETEXT, not the operator itself
 *  2) If the full tree is not found, this option is discarded
 *  To solve this, we detect if we are right next to the end (EOF) and if we have the operator or a partial SIMPLETEXT
 *  We then proceed to add the token and consume (marking as error) the invalid output.
 *  This logic is coupled to the Expression.g4, a change in the file there could mean a change here.
 */
export class ConditionParserATNSimulator extends ParserATNSimulator {

    constructor(parser: ExpressionParser) {
        super(ExpressionParser._ATN, parser);
    }

    private static isKey(tokenType: number) {
        return tokenType === ExpressionParser.SIMPLETEXT;
    }

    private static isEOF(tokenType: number) {
        return tokenType === ExpressionParser.EOF;
    }

    private static isSimpleText(tokenType: number) {
        return tokenType === ExpressionParser.SIMPLETEXT;
    }

    private static isStringOperator(tokenType: number) {
        return tokenType === ExpressionParser.CONTAINS;
    }

    private static isArrayOperator(tokenType: number) {
        return [ ExpressionParser.CONTAINS, ExpressionParser.IN ].includes(tokenType);
    }

    private static isLogicalOperator(tokenType: number) {
        return [ ExpressionParser.AND, ExpressionParser.OR ].includes(tokenType);
    }

    private static isValue(tokenType: number) {
        return [ ExpressionParser.NUMBER, ExpressionParser.STRING ].includes(tokenType);
    }

    private static isComma(tokenType: number) {
        return tokenType === ExpressionParser.T__3;
    }

    adaptivePredict(input: TokenStream, decision: number, outerContext: ParserRuleContext | undefined, useContext?: boolean): number {

        const superCall = () => {
            return super.adaptivePredict(input, decision, outerContext, useContext || false);
        };

        if (outerContext) {
            if (outerContext instanceof ExprContext) {
                const key = input.tryLT(1);
                const operator = input.tryLT(2);
                const squareBracketOrEOF = input.tryLT(3);

                if (
                    key && operator && operator.text && squareBracketOrEOF &&
                    ConditionParserATNSimulator.isKey(key.type)
                ) {
                    let branch = ATN.INVALID_ALT_NUMBER;
                    if (ConditionParserATNSimulator.isEOF(squareBracketOrEOF.type)) {
                        if (ConditionParserATNSimulator.isSimpleText(operator.type)) {
                            for (const possibleOperator of exprCompareOperators) {
                                if (possibleOperator.value.includes(operator.text.toUpperCase())) {
                                    if (ConditionParserATNSimulator.isStringOperator(possibleOperator.type)) {
                                        branch = 5; // Uses string_compare_operator
                                        break;
                                    } else if (ConditionParserATNSimulator.isArrayOperator(possibleOperator.type)) {
                                        branch = 6; // Uses array_operator
                                        break;
                                    }
                                }
                            }
                        } else if (ConditionParserATNSimulator.isStringOperator(operator.type)) {
                            branch = 5;
                        } else if (ConditionParserATNSimulator.isArrayOperator(operator.type)) {
                            branch = 6;
                        }
                    } else if (squareBracketOrEOF.text === '[') {
                        let tokenIndex = 4;
                        while (true) {
                            const nextToken = input.tryLT(tokenIndex);
                            const expectedType = tokenIndex % 2 === 0 ? ConditionParserATNSimulator.isValue : ConditionParserATNSimulator.isComma;
                            ++tokenIndex;
                            if (nextToken) {
                                if (ConditionParserATNSimulator.isEOF(nextToken.type)) {
                                    branch = 6;
                                    break;
                                } else if (!expectedType(nextToken.type)) {
                                    break;
                                }
                            }
                        }
                    }

                    if (branch !== ATN.INVALID_ALT_NUMBER) {
                        return branch;
                    }
                }
            } else if (outerContext instanceof ObjectContext) {
                const operator = input.tryLT(1);
                const EOF = input.tryLT(2);
                if (
                    operator && operator.text && EOF &&
                    ConditionParserATNSimulator.isEOF(EOF.type)
                ) {
                    if (ConditionParserATNSimulator.isSimpleText(operator.type)) {
                        for (const possibleOperator of logicalOperators) {
                            if (possibleOperator.value.includes(operator.text.toUpperCase())) {

                                // See object() code in ExpressionParser
                                const precped = this.parser.precpred(outerContext, 1);
                                if (!precped) {
                                    return superCall();
                                }

                                return 1; // Uses logical_operator
                            }
                        }
                    } else if (ConditionParserATNSimulator.isLogicalOperator(operator.type)) {
                        return 1;
                    }
                }
            } else if (outerContext instanceof ArrayContext) {
                const operator = input.tryLT(1);
                const EOF = input.tryLT(2);
                if (operator && EOF && operator.text === '[' && ConditionParserATNSimulator.isEOF(EOF.type)) {
                    return 2; // Empty array
                }
            }
        }

        return superCall();
    }

}
