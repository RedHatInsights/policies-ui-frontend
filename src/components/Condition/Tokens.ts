import { ExpressionParser } from '../../utils/Expression/ExpressionParser';

type LiteralToken = {
    type: number;
    value: string;
};

export const addIfMissing: Array<LiteralToken> = [
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

export const logicalOperators: Array<LiteralToken> = [
    {
        type: ExpressionParser.AND,
        value: 'AND'
    },
    {
        type: ExpressionParser.OR,
        value: 'OR'
    }
];

export const exprCompareOperators: Array<LiteralToken> = [
    {
        type: ExpressionParser.IN,
        value: 'IN'
    },
    {
        type: ExpressionParser.CONTAINS,
        value: 'CONTAINS'
    }
];

export const negationOperator: Array<LiteralToken> = [
    {
        type: ExpressionParser.NOT,
        value: 'NOT'
    }
];

export const partialMatchAdd: Array<LiteralToken> = exprCompareOperators.concat(logicalOperators).concat(negationOperator);
