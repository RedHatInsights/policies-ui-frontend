import {
    ANTLRErrorStrategy,
    CharStreams, CommonToken,
    CommonTokenStream, DefaultErrorStrategy,
    InputMismatchException,
    Parser, ParserRuleContext,
    RecognitionException,
    Token, TokenStream, TokenStreamRewriter
} from 'antlr4ts';
import { ExpressionLexer } from '../../utils/Expression/ExpressionLexer';
import { ExprContext, ExpressionParser, ObjectContext } from '../../utils/Expression/ExpressionParser';
import { ConditionVisitor, ConditionVisitorResult, ElementType } from './ConditionVisitor';
import { Fact } from '../../types/Fact';
import { ErrorNode, ParseTreeListener, TerminalNode } from 'antlr4ts/tree';
import { node } from 'prop-types';
import { IntervalSet } from 'antlr4ts/misc';
import { ParserATNSimulator } from 'antlr4ts/atn';

const flattenResult = (result: ConditionVisitorResult): string => {
    return result.map(e => e.value).join(' ');
};

type ComputeOptionsResponse = undefined | {
    prefix: string;
    options: Array<string>;
    postfix: string;
}

// Todo: This could be useful to detect the next tokens.
// The problem is that if we get "facts.x = 1 AN" the missing 'D' in 'AND' won't allow to properly
// identify the token (simpletext vs AND), we need to fix this and re-parse to get a correct next token
// Could be fixed by extending DefaultErrorStrategy error handler and implement the recoveryInline
// try to fix e.g. convert "an" to "and" when expecting AND|OR and use that suggestion.
// Other ideas would be to make the lexer a bit smarter to transform "an" to AND when prev is an "object"
// class ConditionParseTreeListener implements ParseTreeListener {
//     readonly parser: Parser;
//     private expectation;
//
//     constructor(parser: Parser) {
//         this.parser = parser;
//     }
//
//     exitEveryRule(_ctx: ParserRuleContext) {
//         this.expectation = this.parser.getExpectedTokensWithinCurrentRule();
//         console.log('exit rule', this.parser.getExpectedTokensWithinCurrentRule());
//     }
//
//     visitErrorNode(_node: ErrorNode) {
//         console.log('error in listener', this.parser.getExpectedTokensWithinCurrentRule());
//     }
// }

type LiteralToken = {
    type: number;
    value: string;
};

// Specific tokens that could be omit by accident.
const alwaysAdd: Array<LiteralToken> = [
    {
        type: ExpressionParser.T__1,
        value: ')'
    },
    {
        type: ExpressionParser.T__3,
        value: ','
    },
    {
        type: ExpressionParser.T__4,
        value: ']'
    }
];

const logicalOperators: Array<LiteralToken> = [
    {
        type: ExpressionParser.AND,
        value: 'AND'
    },
    {
        type: ExpressionParser.OR,
        value: 'OR'
    }
];

const exprCompareOperators: Array<LiteralToken> = [
    {
        type: ExpressionParser.IN,
        value: 'IN'
    },
    {
        type: ExpressionParser.CONTAINS,
        value: 'CONTAINS'
    }
];

const partialMatchAdd: Array<LiteralToken> = [
    {
        type: ExpressionParser.NOT,
        value: 'NOT'
    }
].concat(exprCompareOperators).concat(logicalOperators);

const constructToken = (tokenSource, expectedTokenType, tokenText, current) => {
    const factory = tokenSource.tokenFactory;
    const x = current.tokenSource;
    const stream = x ? x.inputStream : undefined;
    return factory.create(
        { source: tokenSource, stream }, expectedTokenType, tokenText, Token.DEFAULT_CHANNEL, -1, -1, current.line, current.charPositionInLine
    );
};

const createToken = (recognizer: Parser, type: number, value: string) => {
    const prev = recognizer.inputStream.tryLT(-1);
    let current = recognizer.currentToken;
    if (current.type === Token.EOF && prev) {
        current = prev;
    }

    return constructToken(
        recognizer.inputStream.tokenSource,
        type,
        value,
        current
    );
};

class DecoratedExpressionParser extends ExpressionParser implements ParseTreeListener {

    constructor(tokenStream: CommonTokenStream) {
        super(tokenStream);
        this.addParseListener(this);
    }

    visitTerminal(_node: TerminalNode) {
        // no-op
    }

    visitErrorNode(_node: ErrorNode) {
        // no-op
    }

    enterEveryRule(_ctx: ParserRuleContext) {
        /*const next = this.inputStream.tryLT(1);
        //if (this.currentToken.type === ExpressionParser.SIMPLETEXT && !this.getExpectedTokens().contains(ExpressionParser.SIMPLETEXT)) {
        if (next && next.type === ExpressionParser.SIMPLETEXT && next.text === 'an') {
            console.log('received simple with text', next.text);
            console.log('expected', this.getExpectedTokens());
            // Houston we have a problem.
        }*/
    }

    match(ttype: number): Token {
        //console.log('-------> match called with', ttype);
        const token = super.match(ttype);
        //console.log('... and returned type and text', token.type, token.text);
        return token;
    }

    matchWildcard(): Token {
        const token = super.matchWildcard();
        //console.log('-------> matchWildcard called and returned type and text', token.type, token.text);
        return token;
    }

}

// class ConditionParseTreeListener implements ParseTreeListener {
//     readonly parser: Parser;
//     private expectation;
//
//     constructor(parser: Parser) {
//         this.parser = parser;
//     }
//
//     visitTerminal(_node: TerminalNode) {
//         console.log('visit terminal', _node.symbol.type, this.parser.getExpectedTokens());
//     }
//
//     enterEveryRule(_ctx: ParserRuleContext) {
//         console.log('enter rule', this.parser.getExpectedTokensWithinCurrentRule());
//     }
//
//     exitEveryRule(_ctx: ParserRuleContext) {
//         this.expectation = this.parser.getExpectedTokensWithinCurrentRule();
//         console.log('exit rule', this.parser.getExpectedTokensWithinCurrentRule());
//     }
//
//     visitErrorNode(_node: ErrorNode) {
//         console.log('error in listener', this.parser.getExpectedTokensWithinCurrentRule());
//     }
// }

class ExpressionParserATNSimulator extends ParserATNSimulator {

    // Copied from antlr4ts/Parser.ts
    // isExpectedToken(symbol: number, stateNumber: number, context: ParserRuleContext | undefined) {
    //     const state = this.atn.states[stateNumber];
    //     let following = this.atn.nextTokens(state);
    //     console.log('following:', following);
    //     if (following.contains(symbol)) {
    //         return true;
    //     }
    //
    //     if (!following.contains(Token.EPSILON)) {
    //         return false;
    //     }
    //
    //     let ctx = context;
    //
    //     while (ctx && ctx.invokingState >= 0 && following.contains(Token.EPSILON)) {
    //         const invokingState = this.atn.states[ctx.invokingState];
    //         const rt = invokingState.transition(0);
    //         following = this.atn.nextTokens(rt.target);
    //         if (following.contains(symbol)) {
    //             return true;
    //         }
    //
    //         ctx = ctx.parent;
    //     }
    //
    //     if (following.contains(Token.EPSILON) && symbol === Token.EOF) {
    //         return true;
    //     }
    //
    //     return false;
    // }

    adaptivePredict(input: TokenStream, decision: number, outerContext: ParserRuleContext | undefined): number {
        // eslint-disable-next-line new-cap
        const token = input.tryLT(1);

        if (token && token.type === ExpressionParser.SIMPLETEXT && outerContext) {
            if (outerContext instanceof ExprContext) {
                console.log('in ExprContext');
                const key = input.tryLT(1);
                const comparator = input.tryLT(2);
                const value = input.tryLT(3);

                console.log(key?.text, comparator?.text);
                // The expression path isn't visited because of a lack of params, force it to be visited so we can autocomplete
                if (key && comparator && key.type === ExpressionParser.SIMPLETEXT && (comparator.type === ExpressionParser.SIMPLETEXT ||
                comparator.type === ExpressionParser.CONTAINS || comparator.type === ExpressionParser.IN)) { // Check if is part of the operators
                    let valueText;
                    if (value === undefined || value.type === Token.EOF) {
                        valueText = '"placeholder"';
                    } else if (value.text === '[') {
                        valueText = '[ ]';
                    } else {
                        valueText = value.text;
                    }

                    console.log('they match, something is bad');
                    for (const operator of exprCompareOperators) {
                        console.log('starting to compare', comparator.text, 'with', operator.value);
                        if (comparator.text && operator.value.includes(comparator.text.toUpperCase())) {
                            console.log('found a match with ', operator.value);

                            const inputStream = CharStreams.fromString([ key.text, operator.value, valueText ].join(' '));
                            const lexer = new ExpressionLexer(inputStream);
                            lexer.removeErrorListeners();
                            const tokenStream = new CommonTokenStream(lexer);
                            tokenStream.tryLT(1);
                            console.log('calling super');
                            try {
                                const returnValue = super.adaptivePredict(tokenStream, decision, outerContext);
                                console.log('returned', returnValue);
                                return returnValue;
                            } catch (ex) {
                                console.log(ex);
                            }
                        }
                    }
                }

            } else if (outerContext instanceof ObjectContext) {
                const expected = this.parser.getExpectedTokens();
                if (!expected.contains(token.type)) {
                    for (const logicalOperator of logicalOperators) {
                        if (token.text && logicalOperator.value.includes(token.text.toUpperCase())) {
                            if (expected.contains(logicalOperator.type)) {
                                const inputStream = CharStreams.fromString(logicalOperator.value);
                                const lexer = new ExpressionLexer(inputStream);
                                lexer.removeErrorListeners();
                                const tokenStream = new CommonTokenStream(lexer);
                                tokenStream.tryLT(1);
                                const returnValue = super.adaptivePredict(tokenStream, decision, outerContext);
                                console.log('returned', returnValue);
                                return returnValue;
                            }
                        }
                    }
                }
            }
        }

        // const context = outerContext || ParserRuleContext.emptyContext();
        // let state = this.getStartState(dfa, input, context, false);
        // if (state === null) {
        //     state = this.computeStartState(dfa, context, false);
        // }
        //
        // console.log('expected', this.parser.getExpectedTokens());

        // if (state) {
        //     const s0 = state.s0;
        //     console.log('okay....', token?.text, s0.stateNumber, token?.type);
        //     if (token && s0 && s0.stateNumber >= 0 && token.type === ExpressionParser.SIMPLETEXT) {
        //         console.log('Testing if token is expected', token.type, token.text);
        //         if (!this.isExpectedToken(token.type, s0.stateNumber, outerContext)) {
        //             console.log('Token not expected, trying...');
        //             for (const partialToken of partialMatchAdd) {
        //                 if (token.text && partialToken.value.includes(token.text?.toUpperCase())) {
        //                     if (this.isExpectedToken(partialToken.type, s0.stateNumber, outerContext)) {
        //                         return 1;
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // }

        // if (outerContext instanceof ObjectContext) {
        //     // Has 1 branch, object logical_operator object
        //     // This detects if we have a partial logical_operator and tries to go with that.
        //     const next = input.tryLT(1);
        //     if (next && next.text && next.type === ExpressionParser.SIMPLETEXT) {
        //         if ('AND'.includes(next.text.toLocaleUpperCase())) {
        //             return 1;
        //         }
        //     }
        // }

        return super.adaptivePredict(input, decision, outerContext);
    }

}

export class ParserErrorHandler extends DefaultErrorStrategy {

    reset(_recognizer: Parser) {
        // nothing to do
        console.log('reset');
        super.reset(_recognizer);
    }

    recoverInline(recognizer: DecoratedExpressionParser): Token {

        // ExpressionParser.VOCABULARY.getLiteralName()
        // throw new Error('where are you?');

        const current = recognizer.currentToken;
        console.log('Received', current.text);
        console.log('Expected', recognizer.getExpectedTokens());

        // User was probably writing AND, OR, etc, but instead it got recognized as SIMPLETEXT, we need to step back and
        // verify one of these tokens wasn't expected.
        if (current.type === ExpressionParser.SIMPLETEXT) {
            const next = recognizer.getExpectedTokens();

            for (const token of partialMatchAdd) {
                if (current.text && next.contains(token.type) && token.value.includes(current.text.toUpperCase())) {
                    console.log('Adding token', token.value);
                    const newToken = createToken(recognizer, token.type, token.value);
                    const parent = recognizer.context.parent;
                    if (parent) {
                        parent.addChild(recognizer.createTerminalNode(parent, newToken));
                    }

                    this.beginErrorCondition(recognizer);
                    recognizer.consume();
                    this.endErrorCondition(recognizer);

                    console.log('returning', newToken.text);

                    return newToken;
                    // const newToken = CommonToken.fromToken(current);
                    // newToken.type = token.type;
                    // newToken.text = token.value;
                    //
                    // console.log('tryLT(-2)', recognizer.inputStream.tryLT(-2)?.type);
                    // console.log('tryLT(-1)', recognizer.inputStream.tryLT(-1)?.type);
                    // console.log('tryLT(1)', recognizer.inputStream.tryLT(1)?.type);
                    // console.log('tryLT(2)', recognizer.inputStream.tryLT(2)?.type);
                    // return newToken;
                    /*
                    this.rewriter.replaceSingle(current, token.value);

                    console.log('tryLT(-2)', recognizer.inputStream.tryLT(-2)?.type);
                    console.log('tryLT(-1)', recognizer.inputStream.tryLT(-1)?.type);
                    console.log('tryLT(1)', recognizer.inputStream.tryLT(1)?.type);
                    console.log('tryLT(2)', recognizer.inputStream.tryLT(2)?.type);
                    */

                }
            }
        }

        for (const token of alwaysAdd) {
            if (recognizer.getExpectedTokens().contains(token.type)) {
                console.log('Adding token', token.value);
                return createToken(recognizer, token.type, token.value);
            }
        }

        return super.recoverInline(recognizer);
    }

    recover(_recognizer: Parser, _e: RecognitionException) {
        // nothing to do
        // console.log('recover', _recognizer.getExpectedTokens());
    }

    sync(_recognizer: Parser) {
        // console.log('sync');
        super.sync(_recognizer);
        // Nothing to do here
    }

    inErrorRecoveryMode(recognizer: Parser) {
        const ret = super.inErrorRecoveryMode(recognizer);
        // console.log('inErrorRecoveryMode', ret);
        return ret;
    }

    reportMatch(_recognizer: Parser) {
        // console.log('report match');
        // super.reportMatch(_recognizer);
        // nothing to do here
    }

    reportError(_recognizer: Parser, _e: RecognitionException) {
        // console.log('report error');
        // super.reportError(_recognizer, _e);
        // nothing to do here
    }

}

const maxOptions = 10;

const buildParserFromInput = (condition: string) => {
    const inputStream = CharStreams.fromString(condition);
    const lexer = new ExpressionLexer(inputStream);
    lexer.removeErrorListeners();
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new DecoratedExpressionParser(tokenStream);
    const rewriter = new TokenStreamRewriter(tokenStream);
    parser.removeErrorListeners();
    parser.interpreter = new ExpressionParserATNSimulator(ExpressionParser._ATN, parser);
    return {
        parser,
        rewriter
    };
};

export const computeOptions = (condition: string, facts: Fact[]): ComputeOptionsResponse => {
    const { parser, rewriter } = buildParserFromInput(condition);
    // Todo: Continue working on autocomplete
    // parser.addParseListener(new ConditionParseTreeListener(parser));
    parser.errorHandler = new ParserErrorHandler();
    const tree = parser.expression();

    const visitor = new ConditionVisitor();
    console.log(rewriter.getText());
    const result = visitor.visit(tree).filter(e => e.type !== ElementType.ERROR);

    console.log(result);

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
