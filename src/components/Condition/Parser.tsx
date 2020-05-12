import { ExpressionParser } from '../../utils/Expression/ExpressionParser';
import { CharStreams, CommonTokenStream, TokenStream } from 'antlr4ts';
import { ConditionParserATNSimulator } from './Parser/ATNSimulator';
import { ConditionParserErrorHandler } from './Parser/ErrorHandler';
import { ExpressionLexer } from '../../utils/Expression/ExpressionLexer';

export class ConditionParser extends ExpressionParser {

    constructor(input: TokenStream) {
        super(input);
        this._interp = new ConditionParserATNSimulator(this);
        this._errHandler = new ConditionParserErrorHandler();
        this.removeErrorListeners();
    }

    static fromString(condition: string) {
        const inputStream = CharStreams.fromString(condition);
        const lexer = new ExpressionLexer(inputStream);
        lexer.removeErrorListeners();
        const tokenStream = new CommonTokenStream(lexer);
        return new ConditionParser(tokenStream);
    }
}
