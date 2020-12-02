import {
    CharStreams,
    CommonTokenStream
} from 'antlr4ts';

import { Fact } from '../../types/Fact';
import { ExpressionLexer } from '../../utils/Expression/ExpressionLexer';
import { ExpressionParser } from '../../utils/Expression/ExpressionParser';
import { ConditionVisitor, ConditionVisitorResult, ElementType } from './ConditionVisitor';

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

const maxOptions = 10;

const buildParserFromInput = (condition: string) => {
    const inputStream = CharStreams.fromString(condition);
    const lexer = new ExpressionLexer(inputStream);
    lexer.removeErrorListeners();
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new ExpressionParser(tokenStream);
    parser.removeErrorListeners();
    return parser;
};

export const computeOptions = (condition: string, facts: Fact[]): ComputeOptionsResponse => {
    const parser = buildParserFromInput(condition);
    // Todo: Continue working on autocomplete
    // parser.addParseListener(new ConditionParseTreeListener(parser));
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
