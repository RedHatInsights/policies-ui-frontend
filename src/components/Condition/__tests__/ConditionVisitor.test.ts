import { CharStreams, CommonTokenStream } from 'antlr4ts';

import { ExpressionLexer } from '../../../utils/Expression/ExpressionLexer';
import { ExpressionContext, ExpressionParser } from '../../../utils/Expression/ExpressionParser';
import { ConditionVisitor, ElementType } from '../ConditionVisitor';

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
                type: ElementType.FACT,
                value: 'ar'
            }
        ]);
    });

    it('Detects last fact on condition', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition = 'facts.arch = "x86_64" and cpu';
        const result = conditionVisitor.visit(treeForCondition(condition));
        expect(result).toEqual([
            {
                type: ElementType.FACT,
                value: 'facts.arch'
            },
            {
                type: ElementType.BOOLEAN_OPERATOR,
                value: '='
            },
            {
                type: ElementType.VALUE,
                value: '"x86_64"'
            },
            {
                type: ElementType.LOGICAL_OPERATOR,
                value: 'and'
            },
            {
                type: ElementType.FACT,
                value: 'cpu'
            }
        ]);
    });

    it('Detects when a value is being written using String', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition = 'facts.arch = "my-value" ';
        const result = conditionVisitor.visit(treeForCondition(condition));
        expect(result).toEqual([
            {
                type: ElementType.FACT,
                value: 'facts.arch'
            },
            {
                type: ElementType.BOOLEAN_OPERATOR,
                value: '='
            },
            {
                type: ElementType.VALUE,
                value: '"my-value"'
            }
        ]);
    });

    it('Detects when a value is being written using broken String with double quote', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition = 'facts.arch = "my-val ';
        const result = conditionVisitor.visit(treeForCondition(condition));
        expect(result).toEqual([
            {
                type: ElementType.FACT,
                value: 'facts.arch'
            },
            {
                type: ElementType.BOOLEAN_OPERATOR,
                value: '='
            },
            {
                type: ElementType.VALUE,
                value: '"my-val "'
            }
        ]);
    });

    it('Detects when a value is being written using broken String with double quote using !=', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition = 'facts.arch != "my-val ';
        const result = conditionVisitor.visit(treeForCondition(condition));
        expect(result).toEqual([
            {
                type: ElementType.FACT,
                value: 'facts.arch'
            },
            {
                type: ElementType.BOOLEAN_OPERATOR,
                value: '!='
            },
            {
                type: ElementType.VALUE,
                value: '"my-val "'
            }
        ]);
    });

    it('Detects when a value is being written using broken String with single quote', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition = 'facts.arch = \'my-val ';
        const result = conditionVisitor.visit(treeForCondition(condition));
        expect(result).toEqual([
            {
                type: ElementType.FACT,
                value: 'facts.arch'
            },
            {
                type: ElementType.BOOLEAN_OPERATOR,
                value: '='
            },
            {
                type: ElementType.VALUE,
                value: '\'my-val \''
            }
        ]);
    });

    it('Detects when a value is being written using broken String without quotes', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition = 'facts.arch = my-val ';
        const result = conditionVisitor.visit(treeForCondition(condition));
        expect(result).toEqual([
            {
                type: ElementType.FACT,
                value: 'facts.arch'
            },
            {
                type: ElementType.BOOLEAN_OPERATOR,
                value: '='
            },
            {
                type: ElementType.VALUE,
                value: '"my-val"'
            }
        ]);
    });

    it('Detects when a value is being written using broken String without quotes and spaces', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition = 'facts.arch = my-val    your-val';
        const result = conditionVisitor.visit(treeForCondition(condition));
        expect(result).toEqual([
            {
                type: ElementType.FACT,
                value: 'facts.arch'
            },
            {
                type: ElementType.BOOLEAN_OPERATOR,
                value: '='
            },
            {
                type: ElementType.VALUE,
                value: '"my-val    your-val"'
            }
        ]);
    });

    it('Detects when a value is being written using number', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition = 'facts.arch = 5';
        const result = conditionVisitor.visit(treeForCondition(condition));
        expect(result).toEqual([
            {
                type: ElementType.FACT,
                value: 'facts.arch'
            },
            {
                type: ElementType.BOOLEAN_OPERATOR,
                value: '='
            },
            {
                type: ElementType.VALUE,
                value: '5'
            }
        ]);
    });

    it('Detects a logical operator', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition = 'facts.arch = 5 and ';
        const result = conditionVisitor.visit(treeForCondition(condition));
        expect(result).toEqual([
            {
                type: ElementType.FACT,
                value: 'facts.arch'
            },
            {
                type: ElementType.BOOLEAN_OPERATOR,
                value: '='
            },
            {
                type: ElementType.VALUE,
                value: '5'
            },
            {
                type: ElementType.LOGICAL_OPERATOR,
                value: 'and'
            }
        ]);
    });

    it('Detects incomplete logical operator as error', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition = 'facts.arch = 5 an ';
        const result = conditionVisitor.visit(treeForCondition(condition));
        expect(result).toEqual([
            {
                type: ElementType.FACT,
                value: 'facts.arch'
            },
            {
                type: ElementType.BOOLEAN_OPERATOR,
                value: '='
            },
            {
                type: ElementType.VALUE,
                value: '5'
            },
            {
                type: ElementType.ERROR,
                value: 'an'
            }
        ]);
    });

    it('Detects invalid fact with no key-characters, provides error', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition = '1234 ';
        const result = conditionVisitor.visit(treeForCondition(condition));
        expect(result).toEqual([
            {
                type: ElementType.ERROR,
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
                type: ElementType.ERROR,
                value: '1234'
            },
            {
                type: ElementType.FACT,
                value: 'facts'
            }
        ]);
    });

    it('Detects numeric values', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition =  'facts >= 5';
        const tree = treeForCondition(condition);
        const result = conditionVisitor.visit(tree);
        expect(result).toEqual([
            {
                type: ElementType.FACT,
                value: 'facts'
            },
            {
                type: ElementType.NUMERIC_COMPARE_OPERATOR,
                value: '>='
            },
            {
                type: ElementType.VALUE,
                value: '5'
            }
        ]);
    });

    it('Detects missing round brackets', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition =  'facts >= 5 and (f > 1 or f = 1';
        const tree = treeForCondition(condition);
        const result = conditionVisitor.visit(tree);
        expect(result).toEqual([
            {
                type: ElementType.FACT,
                value: 'facts'
            },
            {
                type: ElementType.NUMERIC_COMPARE_OPERATOR,
                value: '>='
            },
            {
                type: ElementType.VALUE,
                value: '5'
            },
            {
                type: ElementType.LOGICAL_OPERATOR,
                value: 'and'
            },
            {
                type: ElementType.OPEN_ROUND_BRACKET,
                value: '('
            },
            {
                type: ElementType.FACT,
                value: 'f'
            },
            {
                type: ElementType.NUMERIC_COMPARE_OPERATOR,
                value: '>'
            },
            {
                type: ElementType.VALUE,
                value: '1'
            },
            {
                type: ElementType.LOGICAL_OPERATOR,
                value: 'or'
            },
            {
                type: ElementType.FACT,
                value: 'f'
            },
            {
                type: ElementType.BOOLEAN_OPERATOR,
                value: '='
            },
            {
                type: ElementType.VALUE,
                value: '1'
            },
            {
                type: ElementType.CLOSE_ROUND_BRACKET,
                value: ')'
            }
        ]);
    });

    it('Detects missing close round bracket with only fact', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition =  '( f ';
        const tree = treeForCondition(condition);
        const result = conditionVisitor.visit(tree);
        expect(result).toEqual([
            {
                type: ElementType.OPEN_ROUND_BRACKET,
                value: '('
            },
            {
                type: ElementType.FACT,
                value: 'f'
            },
            {
                type: ElementType.CLOSE_ROUND_BRACKET,
                value: ')'
            }
        ]);
    });

    it('Can not detect missing open round bracket with only fact', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition =  ' f )';
        const tree = treeForCondition(condition);
        const result = conditionVisitor.visit(tree);
        expect(result).toEqual([
            {
                type: ElementType.FACT,
                value: 'f'
            },
            {
                type: ElementType.ERROR,
                value: ')'
            }
        ]);
    });

    it('Detect logic operator (as error) inside a round bracket', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition =  '( facts = 1 an';
        const tree = treeForCondition(condition);
        const result = conditionVisitor.visit(tree);
        expect(result).toEqual([
            {
                type: ElementType.OPEN_ROUND_BRACKET,
                value: '('
            },
            {
                type: ElementType.FACT,
                value: 'facts'
            },
            {
                type: ElementType.BOOLEAN_OPERATOR,
                value: '='
            },
            {
                type: ElementType.VALUE,
                value: '1'
            },
            {
                type: ElementType.ERROR,
                value: 'an'
            }
        ]);
    });

    it('Multiple logical operators are errors', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition =  'facts = 1 and and';
        const tree = treeForCondition(condition);
        const result = conditionVisitor.visit(tree);
        expect(result).toEqual([
            {
                type: ElementType.FACT,
                value: 'facts'
            },
            {
                type: ElementType.BOOLEAN_OPERATOR,
                value: '='
            },
            {
                type: ElementType.VALUE,
                value: '1'
            },
            {
                type: ElementType.LOGICAL_OPERATOR,
                value: 'and'
            },
            {
                type: ElementType.ERROR,
                value: 'and'
            }
        ]);
    });

    it('Detect fact inside a round bracket (and closes the bracket) ', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition =  '( facts = 1 and myfac';
        const tree = treeForCondition(condition);
        const result = conditionVisitor.visit(tree);
        expect(result).toEqual([
            {
                type: ElementType.OPEN_ROUND_BRACKET,
                value: '('
            },
            {
                type: ElementType.FACT,
                value: 'facts'
            },
            {
                type: ElementType.BOOLEAN_OPERATOR,
                value: '='
            },
            {
                type: ElementType.VALUE,
                value: '1'
            },
            {
                type: ElementType.LOGICAL_OPERATOR,
                value: 'and'
            },
            {
                type: ElementType.FACT,
                value: 'myfac'
            },
            {
                type: ElementType.CLOSE_ROUND_BRACKET,
                value: ')'
            }
        ]);
    });

    it('Detect nested round brackets', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition =  '( (facts = 1) and myfac';
        const tree = treeForCondition(condition);
        const result = conditionVisitor.visit(tree);
        expect(result).toEqual([
            {
                type: ElementType.OPEN_ROUND_BRACKET,
                value: '('
            },
            {
                type: ElementType.OPEN_ROUND_BRACKET,
                value: '('
            },
            {
                type: ElementType.FACT,
                value: 'facts'
            },
            {
                type: ElementType.BOOLEAN_OPERATOR,
                value: '='
            },
            {
                type: ElementType.VALUE,
                value: '1'
            },
            {
                type: ElementType.CLOSE_ROUND_BRACKET,
                value: ')'
            },
            {
                type: ElementType.LOGICAL_OPERATOR,
                value: 'and'
            },
            {
                type: ElementType.FACT,
                value: 'myfac'
            },
            {
                type: ElementType.CLOSE_ROUND_BRACKET,
                value: ')'
            }
        ]);
    });

    it('Detect nested non closing round brackets', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition =  '( (facts = 1 and myfac';
        const tree = treeForCondition(condition);
        const result = conditionVisitor.visit(tree);
        expect(result).toEqual([
            {
                type: ElementType.OPEN_ROUND_BRACKET,
                value: '('
            },
            {
                type: ElementType.OPEN_ROUND_BRACKET,
                value: '('
            },
            {
                type: ElementType.FACT,
                value: 'facts'
            },
            {
                type: ElementType.BOOLEAN_OPERATOR,
                value: '='
            },
            {
                type: ElementType.VALUE,
                value: '1'
            },
            {
                type: ElementType.LOGICAL_OPERATOR,
                value: 'and'
            },
            {
                type: ElementType.FACT,
                value: 'myfac'
            },
            {
                type: ElementType.CLOSE_ROUND_BRACKET,
                value: ')'
            },
            {
                type: ElementType.CLOSE_ROUND_BRACKET,
                value: ')'
            }
        ]);
    });

    it('Detect negative expression "!"', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition =  '!';
        const tree = treeForCondition(condition);
        const result = conditionVisitor.visit(tree);
        expect(result).toEqual([
            {
                type: ElementType.UNKNOWN,
                value: '!'
            }
        ]);
    });

    it('Detect negative expression "NOT"', () => {
        const conditionVisitor = new ConditionVisitor();
        const condition =  'NOT';
        const tree = treeForCondition(condition);
        const result = conditionVisitor.visit(tree);
        expect(result).toEqual([
            {
                type: ElementType.UNKNOWN,
                value: 'NOT'
            }
        ]);
    });
});
