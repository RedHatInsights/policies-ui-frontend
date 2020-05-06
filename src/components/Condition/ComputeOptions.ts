import {
    ANTLRErrorListener,
    CharStreams,
    CommonTokenStream,
    Parser,
    RecognitionException, Recognizer, Token
} from 'antlr4ts';
import { ExpressionLexer } from '../../utils/Expression/ExpressionLexer';
import { ExpressionParser } from '../../utils/Expression/ExpressionParser';
import { ConditionVisitor, ConditionVisitorResult, PlaceholderType } from './ConditionVisitor';
import { Fact } from '../../types/Fact';
import { logicalOperators } from './Tokens';

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
class ErrorListener implements ANTLRErrorListener<Token> {
    syntaxError(
        recognizer: Recognizer<Token, any>, _offendingSymbol: Token | undefined, _line: number, _charPositionInLine: number,
        _msg: string, _e: RecognitionException | undefined) {
        if (recognizer instanceof Parser) {
            // console.log('error', recognizer.getExpectedTokensWithinCurrentRule());
        }
    }
}

const maxOptions = 10;

export const computeOptions = (condition: string, facts: Fact[]): ComputeOptionsResponse => {
    const inputStream = CharStreams.fromString(condition);
    const lexer = new ExpressionLexer(inputStream);
    lexer.removeErrorListeners();
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new ExpressionParser(tokenStream);
    parser.removeErrorListeners();
    parser.addErrorListener(new ErrorListener());
    const tree = parser.expression();

    const visitor = new ConditionVisitor();
    const result = visitor.visit(tree).filter(e => e.type !== PlaceholderType.ERROR);

    let lastElement = result.pop();
    const postfixElements: typeof result = [];

    if (lastElement === undefined) {
        return {
            prefix: '',
            options: facts.slice(0, maxOptions).map(f => f.name || ''),
            postfix: ''
        };
    }

    while (lastElement.type === PlaceholderType.CLOSE_ROUND_BRACKET) {
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

    if (placeholderElement.type === PlaceholderType.FACT) {
        return {
            prefix: base,
            options: facts.filter(
                f => f.name && f.name.toUpperCase().includes(placeholderElement.value.toUpperCase())).slice(0, maxOptions).map(f => f.name || ''
            ),
            postfix
        };
    } else if (placeholderElement.type === PlaceholderType.LOGICAL_OPERATOR) {
        return {
            prefix: base,
            options: logicalOperators.filter(o => o.includes(placeholderElement.value.toUpperCase())),
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
