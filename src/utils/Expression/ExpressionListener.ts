// Generated from /home/josejulio/Documentos/redhat/insights/custom-policies-ui-frontend/utils/Expression.g4 by ANTLR 4.7.3-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

import { ExpressionContext } from "./ExpressionParser";
import { ObjectContext } from "./ExpressionParser";
import { ExprContext } from "./ExpressionParser";
import { Logical_operatorContext } from "./ExpressionParser";
import { Boolean_operatorContext } from "./ExpressionParser";
import { Numeric_compare_operatorContext } from "./ExpressionParser";
import { String_compare_operatorContext } from "./ExpressionParser";
import { Array_operatorContext } from "./ExpressionParser";
import { ArrayContext } from "./ExpressionParser";
import { Numerical_valueContext } from "./ExpressionParser";
import { ValueContext } from "./ExpressionParser";
import { Negative_exprContext } from "./ExpressionParser";
import { KeyContext } from "./ExpressionParser";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `ExpressionParser`.
 */
export interface ExpressionListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `ExpressionParser.expression`.
	 * @param ctx the parse tree
	 */
	enterExpression?: (ctx: ExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `ExpressionParser.expression`.
	 * @param ctx the parse tree
	 */
	exitExpression?: (ctx: ExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `ExpressionParser.object`.
	 * @param ctx the parse tree
	 */
	enterObject?: (ctx: ObjectContext) => void;
	/**
	 * Exit a parse tree produced by `ExpressionParser.object`.
	 * @param ctx the parse tree
	 */
	exitObject?: (ctx: ObjectContext) => void;

	/**
	 * Enter a parse tree produced by `ExpressionParser.expr`.
	 * @param ctx the parse tree
	 */
	enterExpr?: (ctx: ExprContext) => void;
	/**
	 * Exit a parse tree produced by `ExpressionParser.expr`.
	 * @param ctx the parse tree
	 */
	exitExpr?: (ctx: ExprContext) => void;

	/**
	 * Enter a parse tree produced by `ExpressionParser.logical_operator`.
	 * @param ctx the parse tree
	 */
	enterLogical_operator?: (ctx: Logical_operatorContext) => void;
	/**
	 * Exit a parse tree produced by `ExpressionParser.logical_operator`.
	 * @param ctx the parse tree
	 */
	exitLogical_operator?: (ctx: Logical_operatorContext) => void;

	/**
	 * Enter a parse tree produced by `ExpressionParser.boolean_operator`.
	 * @param ctx the parse tree
	 */
	enterBoolean_operator?: (ctx: Boolean_operatorContext) => void;
	/**
	 * Exit a parse tree produced by `ExpressionParser.boolean_operator`.
	 * @param ctx the parse tree
	 */
	exitBoolean_operator?: (ctx: Boolean_operatorContext) => void;

	/**
	 * Enter a parse tree produced by `ExpressionParser.numeric_compare_operator`.
	 * @param ctx the parse tree
	 */
	enterNumeric_compare_operator?: (ctx: Numeric_compare_operatorContext) => void;
	/**
	 * Exit a parse tree produced by `ExpressionParser.numeric_compare_operator`.
	 * @param ctx the parse tree
	 */
	exitNumeric_compare_operator?: (ctx: Numeric_compare_operatorContext) => void;

	/**
	 * Enter a parse tree produced by `ExpressionParser.string_compare_operator`.
	 * @param ctx the parse tree
	 */
	enterString_compare_operator?: (ctx: String_compare_operatorContext) => void;
	/**
	 * Exit a parse tree produced by `ExpressionParser.string_compare_operator`.
	 * @param ctx the parse tree
	 */
	exitString_compare_operator?: (ctx: String_compare_operatorContext) => void;

	/**
	 * Enter a parse tree produced by `ExpressionParser.array_operator`.
	 * @param ctx the parse tree
	 */
	enterArray_operator?: (ctx: Array_operatorContext) => void;
	/**
	 * Exit a parse tree produced by `ExpressionParser.array_operator`.
	 * @param ctx the parse tree
	 */
	exitArray_operator?: (ctx: Array_operatorContext) => void;

	/**
	 * Enter a parse tree produced by `ExpressionParser.array`.
	 * @param ctx the parse tree
	 */
	enterArray?: (ctx: ArrayContext) => void;
	/**
	 * Exit a parse tree produced by `ExpressionParser.array`.
	 * @param ctx the parse tree
	 */
	exitArray?: (ctx: ArrayContext) => void;

	/**
	 * Enter a parse tree produced by `ExpressionParser.numerical_value`.
	 * @param ctx the parse tree
	 */
	enterNumerical_value?: (ctx: Numerical_valueContext) => void;
	/**
	 * Exit a parse tree produced by `ExpressionParser.numerical_value`.
	 * @param ctx the parse tree
	 */
	exitNumerical_value?: (ctx: Numerical_valueContext) => void;

	/**
	 * Enter a parse tree produced by `ExpressionParser.value`.
	 * @param ctx the parse tree
	 */
	enterValue?: (ctx: ValueContext) => void;
	/**
	 * Exit a parse tree produced by `ExpressionParser.value`.
	 * @param ctx the parse tree
	 */
	exitValue?: (ctx: ValueContext) => void;

	/**
	 * Enter a parse tree produced by `ExpressionParser.negative_expr`.
	 * @param ctx the parse tree
	 */
	enterNegative_expr?: (ctx: Negative_exprContext) => void;
	/**
	 * Exit a parse tree produced by `ExpressionParser.negative_expr`.
	 * @param ctx the parse tree
	 */
	exitNegative_expr?: (ctx: Negative_exprContext) => void;

	/**
	 * Enter a parse tree produced by `ExpressionParser.key`.
	 * @param ctx the parse tree
	 */
	enterKey?: (ctx: KeyContext) => void;
	/**
	 * Exit a parse tree produced by `ExpressionParser.key`.
	 * @param ctx the parse tree
	 */
	exitKey?: (ctx: KeyContext) => void;
}

