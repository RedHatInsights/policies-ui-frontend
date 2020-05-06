import { ANTLRErrorListener, CharStreams, CommonTokenStream } from 'antlr4ts';
import { ExpressionLexer } from '../../utils/Expression/ExpressionLexer';
import { ExpressionParser } from '../../utils/Expression/ExpressionParser';
import { ConditionVisitor, ConditionVisitorResult, PlaceholderType } from './ConditionVisitor';
import { Fact } from '../../types/Fact';
import { ErrorNode, ParseTreeListener } from 'antlr4ts/tree';
import { assertNever } from '../../utils/Assert';

const flattenResult = (result: ConditionVisitorResult): string => {
    return result.map(e => e.value).join(' ');
};

type ComputeOptionsResponse = undefined | {
    prefix: string;
    options: Array<string>;
    postfix: string;
}

const logicalOperators = [ 'AND', 'OR' ];

class ConditionParseTreeListener implements ParseTreeListener {

    readonly parser;

    constructor(parser) {
        this.parser = parser;
    }

    /*visitTerminal?: (node: TerminalNode) => void;
    visitErrorNode?: (node: ErrorNode) => void;
    enterEveryRule?: (ctx: ParserRuleContext) => void;
    exitEveryRule?: (ctx: ParserRuleContext) => void;*/

    visitErrorNode(node: ErrorNode) {
        // console.log(node);
    }
}

class ErrorListener implements ANTLRErrorListener<any> {
    syntaxError(recognizer, offendingSymbol, line, charPositionInLine, msg, e) {
        // console.log('error');
    }
}

export const computeOptions = (condition: string, facts: Fact[]): ComputeOptionsResponse => {
    const inputStream = CharStreams.fromString(condition);
    const lexer = new ExpressionLexer(inputStream);
    lexer.removeErrorListeners();
    const tokenStream = new CommonTokenStream(lexer);
    const parser = new ExpressionParser(tokenStream);
    parser.removeErrorListeners();
    parser.addParseListener(new ConditionParseTreeListener(parser));
    parser.addErrorListener(new ErrorListener());
    const tree = parser.expression();

    const visitor = new ConditionVisitor();
    const result = visitor.visit(tree).filter(e => e.type !== PlaceholderType.ERROR);

    let lastElement = result.pop();
    const postfixElements: typeof result = [];

    if (lastElement === undefined) {
        return {
            prefix: '',
            options: facts.slice(0, 10).map(f => f.name || ''),
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
                f => f.name && f.name.toUpperCase().includes(placeholderElement.value.toUpperCase())).slice(0, 10).map(f => f.name || ''
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
