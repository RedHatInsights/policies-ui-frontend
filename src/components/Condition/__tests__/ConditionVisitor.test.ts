import { ExpressionContext, ExpressionParser } from '../../../utils/Expression/ExpressionParser';
import { CharStreams, CommonTokenStream } from 'antlr4ts';
import { ExpressionLexer } from '../../../utils/Expression/ExpressionLexer';
import { ConditionVisitor, PlaceholderType } from '../ConditionVisitor';

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

    it('Works on empty condition', () => {
        const conditionVisitor = new ConditionVisitor();
        const result = conditionVisitor.visit(treeForCondition(''));
        expect(result).toEqual([]);
    });

    it('Detects partial facts', () => {
        const conditionVisitor = new ConditionVisitor();
        const result = conditionVisitor.visit(treeForCondition('ar'));
        expect(result).toEqual([
            {
                type: PlaceholderType.FACT,
                value: 'ar'
            }
        ]);
    });

    it('Detects last fact on condition', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition = 'facts.arch = "x86_64" and cpu';
        const result = conditionVisitor.visit(treeForCondition(condition));
        expect(result).toEqual([
            'facts.arch',
            '=',
            '"x86_64"',
            'and',
            {
                type: PlaceholderType.FACT,
                value: 'cpu'
            }
        ]);
    });

    it('Detects when a value is being written using String', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition = 'facts.arch = "my-value" ';
        const result = conditionVisitor.visit(treeForCondition(condition));
        expect(result).toEqual([
            'facts.arch',
            '=',
            {
                type: PlaceholderType.VALUE,
                value: '"my-value"'
            }
        ]);
    });

    it('Detects when a value is being written using broken String with double quote', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition = 'facts.arch = "my-val ';
        const result = conditionVisitor.visit(treeForCondition(condition));
        expect(result).toEqual([
            'facts.arch',
            '=',
            {
                type: PlaceholderType.VALUE,
                value: '"my-val "'
            }
        ]);
    });

    it('Detects when a value is being written using broken String with double quote using !=', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition = 'facts.arch != "my-val ';
        const result = conditionVisitor.visit(treeForCondition(condition));
        expect(result).toEqual([
            'facts.arch',
            '!=',
            {
                type: PlaceholderType.VALUE,
                value: '"my-val "'
            }
        ]);
    });

    it('Detects when a value is being written using broken String with single quote', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition = 'facts.arch = \'my-val ';
        const result = conditionVisitor.visit(treeForCondition(condition));
        expect(result).toEqual([
            'facts.arch',
            '=',
            {
                type: PlaceholderType.VALUE,
                value: '\'my-val \''
            }
        ]);
    });

    it('Detects when a value is being written using broken String without quotes', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition = 'facts.arch = my-val ';
        const result = conditionVisitor.visit(treeForCondition(condition));
        expect(result).toEqual([
            'facts.arch',
            '=',
            {
                type: PlaceholderType.VALUE,
                value: '"my-val"'
            }
        ]);
    });

    it('Detects when a value is being written using broken String without quotes and spaces', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition = 'facts.arch = my-val    your-val';
        const result = conditionVisitor.visit(treeForCondition(condition));
        expect(result).toEqual([
            'facts.arch',
            '=',
            {
                type: PlaceholderType.VALUE,
                value: '"my-val    your-val"'
            }
        ]);
    });

    it('Detects when a value is being written using number', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition = 'facts.arch = 5';
        const result = conditionVisitor.visit(treeForCondition(condition));
        expect(result).toEqual([
            'facts.arch',
            '=',
            {
                type: PlaceholderType.VALUE,
                value: '5'
            }
        ]);
    });

    it('Detects a fact is after a logical operator', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition = 'facts.arch = 5 and ';
        const result = conditionVisitor.visit(treeForCondition(condition));
        expect(result).toEqual([
            'facts.arch',
            '=',
            '5',
            {
                type: PlaceholderType.LOGICAL_OPERATOR,
                value: 'and'
            }
        ]);
    });

    it('Detects invalid fact with no key-characters, provides error', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition = '1234 ';
        const result = conditionVisitor.visit(treeForCondition(condition));
        expect(result).toEqual([
            {
                type: PlaceholderType.ERROR,
                value: '1234'
            }
        ]);
    });

    it('Detects invalid fact with no key-characters followed by a space and key-characters', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition =  '1234 facts';
        const tree = treeForCondition(condition);
        const result = conditionVisitor.visit(tree);
        expect(result).toEqual([
            {
                type: PlaceholderType.ERROR,
                value: '1234'
            },
            {
                type: PlaceholderType.FACT,
                value: 'facts'
            }
        ]);
    });
});
