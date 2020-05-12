import { DefaultErrorStrategy, Parser, Token } from 'antlr4ts';
import { ExpressionParser } from '../../../utils/Expression/ExpressionParser';
import { addIfMissing, partialMatchAdd } from '../Tokens';

const createToken = (recognizer: Parser, type: number, value: string) => {
    const prev = recognizer.inputStream.tryLT(-1);
    let current = recognizer.currentToken;
    if (current.type === Token.EOF && prev) {
        current = prev;
    }

    const factory = recognizer.inputStream.tokenSource.tokenFactory;
    const x = current.tokenSource;
    const stream = x ? x.inputStream : undefined;
    return factory.create(
        { source: recognizer.inputStream.tokenSource, stream }, type, value, Token.DEFAULT_CHANNEL, -1, -1, current.line, current.charPositionInLine
    );
};

/**
 * This is other piece in the process of detecting input, ConditionParserATNSimulator will helps us to go to a path we can use
 * for the typeahead.
 * This code attempts to detect & fix the errors that happened in that path (e.g. an instead of AND) and.
 * To do so, it checks the tokens that failed the parsing. Since we do some manipulation we are also going to have
 * tokens with no text, we will remove these in a latter phase (the tree visitor).
 * At this point we detect the tokens, mark them as errors and its place add a node with the correct token.
 */
export class ConditionParserErrorHandler extends DefaultErrorStrategy {
    recoverInline(recognizer: ExpressionParser): Token {
        const currentToken = recognizer.currentToken;
        if (currentToken.type === ExpressionParser.SIMPLETEXT) {
            const expectedTokens = recognizer.getExpectedTokens();
            for (const possibleToken of partialMatchAdd) {
                if (currentToken.text && expectedTokens.contains(possibleToken.type) &&
                    possibleToken.value.includes(currentToken.text.toUpperCase())) {
                    const newToken = createToken(recognizer, possibleToken.type, possibleToken.value);
                    const parent = recognizer.context.parent || recognizer.context;

                    // Add a new token
                    parent.addChild(recognizer.createTerminalNode(parent, newToken));

                    // Consume the bad token inside an error condition
                    this.beginErrorCondition(recognizer);
                    recognizer.consume();
                    this.endErrorCondition(recognizer);

                    return newToken;
                }
            }
        }

        for (const token of addIfMissing) {
            if (recognizer.getExpectedTokens().contains(token.type)) {
                return createToken(recognizer, token.type, token.value);
            }
        }

        return super.recoverInline(recognizer);
    }

}
