import { ExpressionContext, ExpressionParser } from '../../../utils/Expression/ExpressionParser';
import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { ExpressionLexer } from '../../../utils/Expression/ExpressionLexer';
import { ConditionVisitor, ConditionVisitorResult, SuggestionType } from '../ConditionVisitor';

describe('src/components/Condition/ConditionVisitor', () => {

    const treeForCondition = (condition: string): ExpressionContext => {
        const lexer = new ExpressionLexer(
            CharStreams.fromString(condition)
        );
        const tokenStream = new CommonTokenStream(lexer);
        lexer.removeErrorListeners();
        const parser = new ExpressionParser(tokenStream);
        parser.removeErrorListeners();
        return parser.expression();
    };

    it('Provides facts on empty condition', () => {
        const conditionVisitor = new ConditionVisitor();
        const result = conditionVisitor.visit(treeForCondition(''));
        const expectedResult = new ConditionVisitorResult({ type: SuggestionType.FACT });
        expect(result).toEqual(expectedResult);
    });

    it('Provides facts on initial param', () => {
        const conditionVisitor = new ConditionVisitor();
        const result = conditionVisitor.visit(treeForCondition('ar'));
        const expectedResult = new ConditionVisitorResult({ type: SuggestionType.FACT }, 'ar');
        expect(result).toEqual(expectedResult);
    });

    it('Detects last fact on condition', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition = 'facts.arch = "x86_64" and cpu';
        const result = conditionVisitor.visit(treeForCondition(condition));
        const expectedResult = new ConditionVisitorResult({ type: SuggestionType.FACT }, 'cpu');
        expect(result).toEqual(expectedResult);
    });

    it('Detects when a value is being written using String', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition = 'facts.arch = "my-value" ';
        const result = conditionVisitor.visit(treeForCondition(condition));
        const expectedResult = new ConditionVisitorResult({ type: SuggestionType.VALUE, fact: '' }, '"my-value"');
        expect(result).toEqual(expectedResult);
    });

    it('Detects when a value is being written using number', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition = 'facts.arch = 5';
        const result = conditionVisitor.visit(treeForCondition(condition));
        const expectedResult = new ConditionVisitorResult({ type: SuggestionType.VALUE, fact: '' }, '5');
        expect(result).toEqual(expectedResult);
    });

    it('Detects a fact is after a logical operator', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition = 'facts.arch = 5 and ';
        const result = conditionVisitor.visit(treeForCondition(condition));
        const expectedResult = new ConditionVisitorResult({ type: SuggestionType.FACT });
        expect(result).toEqual(expectedResult);
    });

});
