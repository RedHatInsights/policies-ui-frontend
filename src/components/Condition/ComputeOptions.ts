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
import { ExpressionParser, ObjectContext } from '../../utils/Expression/ExpressionParser';
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

const partialMatchAdd: Array<LiteralToken> = [
    {
        type: ExpressionParser.AND,
        value: 'AND'
    },
    {
        type: ExpressionParser.OR,
        value: 'OR'
    },
    {
        type: ExpressionParser.NOT,
        value: 'NOT'
    },
    {
        type: ExpressionParser.CONTAINS,
        value: 'CONTAINS'
    },
    {
        type: ExpressionParser.IN,
        value: 'IN'
    }
];

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
    public lastExpectedRule: IntervalSet;

    constructor(tokenStream: CommonTokenStream) {
        super(tokenStream);
        this.lastExpectedRule = new IntervalSet();
        this.addParseListener(this);
    }

    visitTerminal(node: TerminalNode) {
        if (node.text === 'an') {
            console.log('visint terminal node', node.text);
            throw new Error('yep');
        }
    }

    visitErrorNode(node: ErrorNode) {
        if (node.text === 'an') {
            console.log('visint error node', node.text);
        }
        //console.log('visint error node', node.text);
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

    isExpectedToken(symbol: number) {
        const expected = super.isExpectedToken(symbol);
        console.log('--------------called');
        if (!expected && symbol === ExpressionParser.SIMPLETEXT) {
            throw new Error('haha');
            // Could be a partial AND, OR, etc
            // for (const token of partialMatchAdd) {
            //     if (next.text && expected.contains(token.type) && token.value.includes(next.text.toUpperCase())) {
            //         console.log('Adding token', token.value);
            //         addToken(this, token.type, token.value, 1);
            //         this.consume();
            //         console.log('tryLT(-2)', this.inputStream.tryLT(-2)?.type);
            //         console.log('tryLT(-1)', this.inputStream.tryLT(-1)?.type);
            //         console.log('tryLT(1)', this.inputStream.tryLT(1)?.type);
            //         console.log('tryLT(2)', this.inputStream.tryLT(2)?.type);
            //     }
            // }
        }

        return expected;
    }

    match(ttype: number): Token {
        console.log('-------> match called with', ttype);
        const token = super.match(ttype);
        console.log('... and returned type and text', token.type, token.text);
        return token;
    }

    matchWildcard(): Token {
        const token = super.matchWildcard();
        console.log('-------> matchWildcard called and returned type and text', token.type, token.text);
        return token;
    }

    exitEveryRule(ctx: ParserRuleContext) {
        this.lastExpectedRule = this.getExpectedTokens();
        // const next = this.currentToken; // this.inputStream.tryLT(1);
        // const expected = this.getExpectedTokens();
        // console.log('rule', ctx.ruleIndex);
        // if (next && next.type === ExpressionParser.SIMPLETEXT && !expected.contains(ExpressionParser.SIMPLETEXT)) {
        //     //console.log('received simple with text', next.text);
        //     //console.log('expected', this.getExpectedTokens());
        //     // Houston we have a problem.
        //
        //     for (const token of partialMatchAdd) {
        //         if (next.text && expected.contains(token.type) && token.value.includes(next.text.toUpperCase())) {
        //             console.log('Adding token', token.value);
        //             addToken(this, token.type, token.value, 1);
        //             this.consume();
        //             console.log('tryLT(-2)', this.inputStream.tryLT(-2)?.type);
        //             console.log('tryLT(-1)', this.inputStream.tryLT(-1)?.type);
        //             console.log('tryLT(1)', this.inputStream.tryLT(1)?.type);
        //             console.log('tryLT(2)', this.inputStream.tryLT(2)?.type);
        //         }
        //     }
        //}

        // console.log('changing expected to', this.lastExpectedRule);
    }

}

class ConditionParseTreeListener implements ParseTreeListener {
    readonly parser: Parser;
    private expectation;

    constructor(parser: Parser) {
        this.parser = parser;
    }

    visitTerminal(_node: TerminalNode) {
        console.log('visit terminal', _node.symbol.type, this.parser.getExpectedTokens());
    }

    enterEveryRule(_ctx: ParserRuleContext) {
        console.log('enter rule', this.parser.getExpectedTokensWithinCurrentRule());
    }

    exitEveryRule(_ctx: ParserRuleContext) {
        this.expectation = this.parser.getExpectedTokensWithinCurrentRule();
        console.log('exit rule', this.parser.getExpectedTokensWithinCurrentRule());
    }

    visitErrorNode(_node: ErrorNode) {
        console.log('error in listener', this.parser.getExpectedTokensWithinCurrentRule());
    }
}

class ExpressionParserATNSimulator extends ParserATNSimulator {

    adaptivePredict(input: TokenStream, decision: number, outerContext: ParserRuleContext | undefined): number {
        if (outerContext instanceof ObjectContext) {
            const next = input.tryLT(1);
            if (next && next.text && next.type === ExpressionParser.SIMPLETEXT) {
                if ('AND'.includes(next.text.toLocaleUpperCase())) {
                    return 1;
                }
            }
        }

        return super.adaptivePredict(input, decision, outerContext);
    }

}

export class ParserErrorHandler extends DefaultErrorStrategy {

    private rewriter: TokenStreamRewriter;

    constructor(rewriter: TokenStreamRewriter) {
        super();
        this.rewriter = rewriter;
    }

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

        // return super.recoverInline(recognizer);
        throw new InputMismatchException(recognizer);
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
    parser.errorHandler = new ParserErrorHandler(rewriter);
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
