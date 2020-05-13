// Generated from utils/expression/Expression.g4 by ANTLR 4.7.3-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

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
 * This interface defines a complete generic visitor for a parse tree produced
 * by `ExpressionParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface ExpressionVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `ExpressionParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpression?: (ctx: ExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `ExpressionParser.object`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitObject?: (ctx: ObjectContext) => Result;

	/**
	 * Visit a parse tree produced by `ExpressionParser.expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpr?: (ctx: ExprContext) => Result;

	/**
	 * Visit a parse tree produced by `ExpressionParser.logical_operator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitLogical_operator?: (ctx: Logical_operatorContext) => Result;

	/**
	 * Visit a parse tree produced by `ExpressionParser.boolean_operator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBoolean_operator?: (ctx: Boolean_operatorContext) => Result;

	/**
	 * Visit a parse tree produced by `ExpressionParser.numeric_compare_operator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNumeric_compare_operator?: (ctx: Numeric_compare_operatorContext) => Result;

	/**
	 * Visit a parse tree produced by `ExpressionParser.string_compare_operator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitString_compare_operator?: (ctx: String_compare_operatorContext) => Result;

	/**
	 * Visit a parse tree produced by `ExpressionParser.array_operator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArray_operator?: (ctx: Array_operatorContext) => Result;

	/**
	 * Visit a parse tree produced by `ExpressionParser.array`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArray?: (ctx: ArrayContext) => Result;

	/**
	 * Visit a parse tree produced by `ExpressionParser.numerical_value`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNumerical_value?: (ctx: Numerical_valueContext) => Result;

	/**
	 * Visit a parse tree produced by `ExpressionParser.value`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitValue?: (ctx: ValueContext) => Result;

	/**
	 * Visit a parse tree produced by `ExpressionParser.negative_expr`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNegative_expr?: (ctx: Negative_exprContext) => Result;

	/**
	 * Visit a parse tree produced by `ExpressionParser.key`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitKey?: (ctx: KeyContext) => Result;
}

