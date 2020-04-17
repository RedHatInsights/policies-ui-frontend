// Generated from /home/josejulio/Documentos/redhat/insights/custom-policies-ui-frontend/utils/Expression.g4 by ANTLR 4.7.3-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { ExpressionListener } from "./ExpressionListener";
import { ExpressionVisitor } from "./ExpressionVisitor";


export class ExpressionParser extends Parser {
	public static readonly T__0 = 1;
	public static readonly T__1 = 2;
	public static readonly T__2 = 3;
	public static readonly T__3 = 4;
	public static readonly T__4 = 5;
	public static readonly OR = 6;
	public static readonly AND = 7;
	public static readonly NOT = 8;
	public static readonly EQUAL = 9;
	public static readonly NOTEQUAL = 10;
	public static readonly CONTAINS = 11;
	public static readonly NEG = 12;
	public static readonly GT = 13;
	public static readonly GTE = 14;
	public static readonly LT = 15;
	public static readonly LTE = 16;
	public static readonly IN = 17;
	public static readonly NUMBER = 18;
	public static readonly FLOAT = 19;
	public static readonly INTEGER = 20;
	public static readonly SIMPLETEXT = 21;
	public static readonly STRING = 22;
	public static readonly WS = 23;
	public static readonly RULE_expression = 0;
	public static readonly RULE_object = 1;
	public static readonly RULE_expr = 2;
	public static readonly RULE_logical_operator = 3;
	public static readonly RULE_boolean_operator = 4;
	public static readonly RULE_numeric_compare_operator = 5;
	public static readonly RULE_string_compare_operator = 6;
	public static readonly RULE_array_operator = 7;
	public static readonly RULE_array = 8;
	public static readonly RULE_numerical_value = 9;
	public static readonly RULE_value = 10;
	public static readonly RULE_negative_expr = 11;
	public static readonly RULE_key = 12;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"expression", "object", "expr", "logical_operator", "boolean_operator", 
		"numeric_compare_operator", "string_compare_operator", "array_operator", 
		"array", "numerical_value", "value", "negative_expr", "key",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'('", "')'", "'['", "','", "']'", undefined, undefined, undefined, 
		"'='", "'!='", undefined, undefined, "'>'", "'>='", "'<'", "'<='",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, undefined, undefined, undefined, undefined, undefined, "OR", 
		"AND", "NOT", "EQUAL", "NOTEQUAL", "CONTAINS", "NEG", "GT", "GTE", "LT", 
		"LTE", "IN", "NUMBER", "FLOAT", "INTEGER", "SIMPLETEXT", "STRING", "WS",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(ExpressionParser._LITERAL_NAMES, ExpressionParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return ExpressionParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "Expression.g4"; }

	// @Override
	public get ruleNames(): string[] { return ExpressionParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return ExpressionParser._serializedATN; }

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(ExpressionParser._ATN, this);
	}
	// @RuleVersion(0)
	public expression(): ExpressionContext {
		let _localctx: ExpressionContext = new ExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, ExpressionParser.RULE_expression);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 26;
			this.object(0);
			this.state = 27;
			this.match(ExpressionParser.EOF);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public object(): ObjectContext;
	public object(_p: number): ObjectContext;
	// @RuleVersion(0)
	public object(_p?: number): ObjectContext {
		if (_p === undefined) {
			_p = 0;
		}

		let _parentctx: ParserRuleContext = this._ctx;
		let _parentState: number = this.state;
		let _localctx: ObjectContext = new ObjectContext(this._ctx, _parentState);
		let _prevctx: ObjectContext = _localctx;
		let _startState: number = 2;
		this.enterRecursionRule(_localctx, 2, ExpressionParser.RULE_object, _p);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 38;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case ExpressionParser.NOT:
			case ExpressionParser.NEG:
				{
				this.state = 30;
				this.negative_expr();
				this.state = 31;
				this.object(4);
				}
				break;
			case ExpressionParser.SIMPLETEXT:
				{
				this.state = 33;
				this.expr();
				}
				break;
			case ExpressionParser.T__0:
				{
				this.state = 34;
				this.match(ExpressionParser.T__0);
				this.state = 35;
				this.object(0);
				this.state = 36;
				this.match(ExpressionParser.T__1);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
			this._ctx._stop = this._input.tryLT(-1);
			this.state = 46;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 1, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					if (this._parseListeners != null) {
						this.triggerExitRuleEvent();
					}
					_prevctx = _localctx;
					{
					{
					_localctx = new ObjectContext(_parentctx, _parentState);
					this.pushNewRecursionContext(_localctx, _startState, ExpressionParser.RULE_object);
					this.state = 40;
					if (!(this.precpred(this._ctx, 1))) {
						throw new FailedPredicateException(this, "this.precpred(this._ctx, 1)");
					}
					this.state = 41;
					this.logical_operator();
					this.state = 42;
					this.object(2);
					}
					}
				}
				this.state = 48;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 1, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.unrollRecursionContexts(_parentctx);
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public expr(): ExprContext {
		let _localctx: ExprContext = new ExprContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, ExpressionParser.RULE_expr);
		try {
			this.state = 70;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 2, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 49;
				this.key();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 50;
				this.key();
				this.state = 51;
				this.boolean_operator();
				this.state = 52;
				this.value();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 54;
				this.key();
				this.state = 55;
				this.numeric_compare_operator();
				this.state = 56;
				this.numerical_value();
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 58;
				this.key();
				this.state = 59;
				this.string_compare_operator();
				this.state = 60;
				this.array();
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 62;
				this.key();
				this.state = 63;
				this.string_compare_operator();
				this.state = 64;
				this.value();
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 66;
				this.key();
				this.state = 67;
				this.array_operator();
				this.state = 68;
				this.array();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public logical_operator(): Logical_operatorContext {
		let _localctx: Logical_operatorContext = new Logical_operatorContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, ExpressionParser.RULE_logical_operator);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 72;
			_la = this._input.LA(1);
			if (!(_la === ExpressionParser.OR || _la === ExpressionParser.AND)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public boolean_operator(): Boolean_operatorContext {
		let _localctx: Boolean_operatorContext = new Boolean_operatorContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, ExpressionParser.RULE_boolean_operator);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 74;
			_la = this._input.LA(1);
			if (!(_la === ExpressionParser.EQUAL || _la === ExpressionParser.NOTEQUAL)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public numeric_compare_operator(): Numeric_compare_operatorContext {
		let _localctx: Numeric_compare_operatorContext = new Numeric_compare_operatorContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, ExpressionParser.RULE_numeric_compare_operator);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 76;
			_la = this._input.LA(1);
			if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << ExpressionParser.GT) | (1 << ExpressionParser.GTE) | (1 << ExpressionParser.LT) | (1 << ExpressionParser.LTE))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public string_compare_operator(): String_compare_operatorContext {
		let _localctx: String_compare_operatorContext = new String_compare_operatorContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, ExpressionParser.RULE_string_compare_operator);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 78;
			this.match(ExpressionParser.CONTAINS);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public array_operator(): Array_operatorContext {
		let _localctx: Array_operatorContext = new Array_operatorContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, ExpressionParser.RULE_array_operator);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 80;
			_la = this._input.LA(1);
			if (!(_la === ExpressionParser.CONTAINS || _la === ExpressionParser.IN)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public array(): ArrayContext {
		let _localctx: ArrayContext = new ArrayContext(this._ctx, this.state);
		this.enterRule(_localctx, 16, ExpressionParser.RULE_array);
		let _la: number;
		try {
			this.state = 95;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 4, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 82;
				this.match(ExpressionParser.T__2);
				this.state = 83;
				this.value();
				this.state = 88;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === ExpressionParser.T__3) {
					{
					{
					this.state = 84;
					this.match(ExpressionParser.T__3);
					this.state = 85;
					this.value();
					}
					}
					this.state = 90;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 91;
				this.match(ExpressionParser.T__4);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 93;
				this.match(ExpressionParser.T__2);
				this.state = 94;
				this.match(ExpressionParser.T__4);
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public numerical_value(): Numerical_valueContext {
		let _localctx: Numerical_valueContext = new Numerical_valueContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, ExpressionParser.RULE_numerical_value);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 97;
			this.match(ExpressionParser.NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public value(): ValueContext {
		let _localctx: ValueContext = new ValueContext(this._ctx, this.state);
		this.enterRule(_localctx, 20, ExpressionParser.RULE_value);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 99;
			_la = this._input.LA(1);
			if (!(_la === ExpressionParser.NUMBER || _la === ExpressionParser.STRING)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public negative_expr(): Negative_exprContext {
		let _localctx: Negative_exprContext = new Negative_exprContext(this._ctx, this.state);
		this.enterRule(_localctx, 22, ExpressionParser.RULE_negative_expr);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 101;
			_la = this._input.LA(1);
			if (!(_la === ExpressionParser.NOT || _la === ExpressionParser.NEG)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public key(): KeyContext {
		let _localctx: KeyContext = new KeyContext(this._ctx, this.state);
		this.enterRule(_localctx, 24, ExpressionParser.RULE_key);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 103;
			this.match(ExpressionParser.SIMPLETEXT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public sempred(_localctx: RuleContext, ruleIndex: number, predIndex: number): boolean {
		switch (ruleIndex) {
		case 1:
			return this.object_sempred(_localctx as ObjectContext, predIndex);
		}
		return true;
	}
	private object_sempred(_localctx: ObjectContext, predIndex: number): boolean {
		switch (predIndex) {
		case 0:
			return this.precpred(this._ctx, 1);
		}
		return true;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03\x19l\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
		"\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x04" +
		"\x0E\t\x0E\x03\x02\x03\x02\x03\x02\x03\x03\x03\x03\x03\x03\x03\x03\x03" +
		"\x03\x03\x03\x03\x03\x03\x03\x03\x03\x05\x03)\n\x03\x03\x03\x03\x03\x03" +
		"\x03\x03\x03\x07\x03/\n\x03\f\x03\x0E\x032\v\x03\x03\x04\x03\x04\x03\x04" +
		"\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04" +
		"\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04\x03\x04" +
		"\x05\x04I\n\x04\x03\x05\x03\x05\x03\x06\x03\x06\x03\x07\x03\x07\x03\b" +
		"\x03\b\x03\t\x03\t\x03\n\x03\n\x03\n\x03\n\x07\nY\n\n\f\n\x0E\n\\\v\n" +
		"\x03\n\x03\n\x03\n\x03\n\x05\nb\n\n\x03\v\x03\v\x03\f\x03\f\x03\r\x03" +
		"\r\x03\x0E\x03\x0E\x03\x0E\x02\x02\x03\x04\x0F\x02\x02\x04\x02\x06\x02" +
		"\b\x02\n\x02\f\x02\x0E\x02\x10\x02\x12\x02\x14\x02\x16\x02\x18\x02\x1A" +
		"\x02\x02\b\x03\x02\b\t\x03\x02\v\f\x03\x02\x0F\x12\x04\x02\r\r\x13\x13" +
		"\x04\x02\x14\x14\x18\x18\x04\x02\n\n\x0E\x0E\x02h\x02\x1C\x03\x02\x02" +
		"\x02\x04(\x03\x02\x02\x02\x06H\x03\x02\x02\x02\bJ\x03\x02\x02\x02\nL\x03" +
		"\x02\x02\x02\fN\x03\x02\x02\x02\x0EP\x03\x02\x02\x02\x10R\x03\x02\x02" +
		"\x02\x12a\x03\x02\x02\x02\x14c\x03\x02\x02\x02\x16e\x03\x02\x02\x02\x18" +
		"g\x03\x02\x02\x02\x1Ai\x03\x02\x02\x02\x1C\x1D\x05\x04\x03\x02\x1D\x1E" +
		"\x07\x02\x02\x03\x1E\x03\x03\x02\x02\x02\x1F \b\x03\x01\x02 !\x05\x18" +
		"\r\x02!\"\x05\x04\x03\x06\")\x03\x02\x02\x02#)\x05\x06\x04\x02$%\x07\x03" +
		"\x02\x02%&\x05\x04\x03\x02&\'\x07\x04\x02\x02\')\x03\x02\x02\x02(\x1F" +
		"\x03\x02\x02\x02(#\x03\x02\x02\x02($\x03\x02\x02\x02)0\x03\x02\x02\x02" +
		"*+\f\x03\x02\x02+,\x05\b\x05\x02,-\x05\x04\x03\x04-/\x03\x02\x02\x02." +
		"*\x03\x02\x02\x02/2\x03\x02\x02\x020.\x03\x02\x02\x0201\x03\x02\x02\x02" +
		"1\x05\x03\x02\x02\x0220\x03\x02\x02\x023I\x05\x1A\x0E\x0245\x05\x1A\x0E" +
		"\x0256\x05\n\x06\x0267\x05\x16\f\x027I\x03\x02\x02\x0289\x05\x1A\x0E\x02" +
		"9:\x05\f\x07\x02:;\x05\x14\v\x02;I\x03\x02\x02\x02<=\x05\x1A\x0E\x02=" +
		">\x05\x0E\b\x02>?\x05\x12\n\x02?I\x03\x02\x02\x02@A\x05\x1A\x0E\x02AB" +
		"\x05\x0E\b\x02BC\x05\x16\f\x02CI\x03\x02\x02\x02DE\x05\x1A\x0E\x02EF\x05" +
		"\x10\t\x02FG\x05\x12\n\x02GI\x03\x02\x02\x02H3\x03\x02\x02\x02H4\x03\x02" +
		"\x02\x02H8\x03\x02\x02\x02H<\x03\x02\x02\x02H@\x03\x02\x02\x02HD\x03\x02" +
		"\x02\x02I\x07\x03\x02\x02\x02JK\t\x02\x02\x02K\t\x03\x02\x02\x02LM\t\x03" +
		"\x02\x02M\v\x03\x02\x02\x02NO\t\x04\x02\x02O\r\x03\x02\x02\x02PQ\x07\r" +
		"\x02\x02Q\x0F\x03\x02\x02\x02RS\t\x05\x02\x02S\x11\x03\x02\x02\x02TU\x07" +
		"\x05\x02\x02UZ\x05\x16\f\x02VW\x07\x06\x02\x02WY\x05\x16\f\x02XV\x03\x02" +
		"\x02\x02Y\\\x03\x02\x02\x02ZX\x03\x02\x02\x02Z[\x03\x02\x02\x02[]\x03" +
		"\x02\x02\x02\\Z\x03\x02\x02\x02]^\x07\x07\x02\x02^b\x03\x02\x02\x02_`" +
		"\x07\x05\x02\x02`b\x07\x07\x02\x02aT\x03\x02\x02\x02a_\x03\x02\x02\x02" +
		"b\x13\x03\x02\x02\x02cd\x07\x14\x02\x02d\x15\x03\x02\x02\x02ef\t\x06\x02" +
		"\x02f\x17\x03\x02\x02\x02gh\t\x07\x02\x02h\x19\x03\x02\x02\x02ij\x07\x17" +
		"\x02\x02j\x1B\x03\x02\x02\x02\x07(0HZa";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!ExpressionParser.__ATN) {
			ExpressionParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(ExpressionParser._serializedATN));
		}

		return ExpressionParser.__ATN;
	}

}

export class ExpressionContext extends ParserRuleContext {
	public object(): ObjectContext {
		return this.getRuleContext(0, ObjectContext);
	}
	public EOF(): TerminalNode { return this.getToken(ExpressionParser.EOF, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ExpressionParser.RULE_expression; }
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterExpression) {
			listener.enterExpression(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitExpression) {
			listener.exitExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: ExpressionVisitor<Result>): Result {
		if (visitor.visitExpression) {
			return visitor.visitExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ObjectContext extends ParserRuleContext {
	public negative_expr(): Negative_exprContext | undefined {
		return this.tryGetRuleContext(0, Negative_exprContext);
	}
	public object(): ObjectContext[];
	public object(i: number): ObjectContext;
	public object(i?: number): ObjectContext | ObjectContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ObjectContext);
		} else {
			return this.getRuleContext(i, ObjectContext);
		}
	}
	public expr(): ExprContext | undefined {
		return this.tryGetRuleContext(0, ExprContext);
	}
	public logical_operator(): Logical_operatorContext | undefined {
		return this.tryGetRuleContext(0, Logical_operatorContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ExpressionParser.RULE_object; }
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterObject) {
			listener.enterObject(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitObject) {
			listener.exitObject(this);
		}
	}
	// @Override
	public accept<Result>(visitor: ExpressionVisitor<Result>): Result {
		if (visitor.visitObject) {
			return visitor.visitObject(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExprContext extends ParserRuleContext {
	public key(): KeyContext {
		return this.getRuleContext(0, KeyContext);
	}
	public boolean_operator(): Boolean_operatorContext | undefined {
		return this.tryGetRuleContext(0, Boolean_operatorContext);
	}
	public value(): ValueContext | undefined {
		return this.tryGetRuleContext(0, ValueContext);
	}
	public numeric_compare_operator(): Numeric_compare_operatorContext | undefined {
		return this.tryGetRuleContext(0, Numeric_compare_operatorContext);
	}
	public numerical_value(): Numerical_valueContext | undefined {
		return this.tryGetRuleContext(0, Numerical_valueContext);
	}
	public string_compare_operator(): String_compare_operatorContext | undefined {
		return this.tryGetRuleContext(0, String_compare_operatorContext);
	}
	public array(): ArrayContext | undefined {
		return this.tryGetRuleContext(0, ArrayContext);
	}
	public array_operator(): Array_operatorContext | undefined {
		return this.tryGetRuleContext(0, Array_operatorContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ExpressionParser.RULE_expr; }
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterExpr) {
			listener.enterExpr(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitExpr) {
			listener.exitExpr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: ExpressionVisitor<Result>): Result {
		if (visitor.visitExpr) {
			return visitor.visitExpr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Logical_operatorContext extends ParserRuleContext {
	public AND(): TerminalNode | undefined { return this.tryGetToken(ExpressionParser.AND, 0); }
	public OR(): TerminalNode | undefined { return this.tryGetToken(ExpressionParser.OR, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ExpressionParser.RULE_logical_operator; }
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterLogical_operator) {
			listener.enterLogical_operator(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitLogical_operator) {
			listener.exitLogical_operator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: ExpressionVisitor<Result>): Result {
		if (visitor.visitLogical_operator) {
			return visitor.visitLogical_operator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Boolean_operatorContext extends ParserRuleContext {
	public EQUAL(): TerminalNode | undefined { return this.tryGetToken(ExpressionParser.EQUAL, 0); }
	public NOTEQUAL(): TerminalNode | undefined { return this.tryGetToken(ExpressionParser.NOTEQUAL, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ExpressionParser.RULE_boolean_operator; }
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterBoolean_operator) {
			listener.enterBoolean_operator(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitBoolean_operator) {
			listener.exitBoolean_operator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: ExpressionVisitor<Result>): Result {
		if (visitor.visitBoolean_operator) {
			return visitor.visitBoolean_operator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Numeric_compare_operatorContext extends ParserRuleContext {
	public GT(): TerminalNode | undefined { return this.tryGetToken(ExpressionParser.GT, 0); }
	public GTE(): TerminalNode | undefined { return this.tryGetToken(ExpressionParser.GTE, 0); }
	public LT(): TerminalNode | undefined { return this.tryGetToken(ExpressionParser.LT, 0); }
	public LTE(): TerminalNode | undefined { return this.tryGetToken(ExpressionParser.LTE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ExpressionParser.RULE_numeric_compare_operator; }
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterNumeric_compare_operator) {
			listener.enterNumeric_compare_operator(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitNumeric_compare_operator) {
			listener.exitNumeric_compare_operator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: ExpressionVisitor<Result>): Result {
		if (visitor.visitNumeric_compare_operator) {
			return visitor.visitNumeric_compare_operator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class String_compare_operatorContext extends ParserRuleContext {
	public CONTAINS(): TerminalNode { return this.getToken(ExpressionParser.CONTAINS, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ExpressionParser.RULE_string_compare_operator; }
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterString_compare_operator) {
			listener.enterString_compare_operator(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitString_compare_operator) {
			listener.exitString_compare_operator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: ExpressionVisitor<Result>): Result {
		if (visitor.visitString_compare_operator) {
			return visitor.visitString_compare_operator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Array_operatorContext extends ParserRuleContext {
	public IN(): TerminalNode | undefined { return this.tryGetToken(ExpressionParser.IN, 0); }
	public CONTAINS(): TerminalNode | undefined { return this.tryGetToken(ExpressionParser.CONTAINS, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ExpressionParser.RULE_array_operator; }
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterArray_operator) {
			listener.enterArray_operator(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitArray_operator) {
			listener.exitArray_operator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: ExpressionVisitor<Result>): Result {
		if (visitor.visitArray_operator) {
			return visitor.visitArray_operator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ArrayContext extends ParserRuleContext {
	public value(): ValueContext[];
	public value(i: number): ValueContext;
	public value(i?: number): ValueContext | ValueContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ValueContext);
		} else {
			return this.getRuleContext(i, ValueContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ExpressionParser.RULE_array; }
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterArray) {
			listener.enterArray(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitArray) {
			listener.exitArray(this);
		}
	}
	// @Override
	public accept<Result>(visitor: ExpressionVisitor<Result>): Result {
		if (visitor.visitArray) {
			return visitor.visitArray(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Numerical_valueContext extends ParserRuleContext {
	public NUMBER(): TerminalNode { return this.getToken(ExpressionParser.NUMBER, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ExpressionParser.RULE_numerical_value; }
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterNumerical_value) {
			listener.enterNumerical_value(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitNumerical_value) {
			listener.exitNumerical_value(this);
		}
	}
	// @Override
	public accept<Result>(visitor: ExpressionVisitor<Result>): Result {
		if (visitor.visitNumerical_value) {
			return visitor.visitNumerical_value(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ValueContext extends ParserRuleContext {
	public NUMBER(): TerminalNode | undefined { return this.tryGetToken(ExpressionParser.NUMBER, 0); }
	public STRING(): TerminalNode | undefined { return this.tryGetToken(ExpressionParser.STRING, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ExpressionParser.RULE_value; }
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterValue) {
			listener.enterValue(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitValue) {
			listener.exitValue(this);
		}
	}
	// @Override
	public accept<Result>(visitor: ExpressionVisitor<Result>): Result {
		if (visitor.visitValue) {
			return visitor.visitValue(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Negative_exprContext extends ParserRuleContext {
	public NEG(): TerminalNode | undefined { return this.tryGetToken(ExpressionParser.NEG, 0); }
	public NOT(): TerminalNode | undefined { return this.tryGetToken(ExpressionParser.NOT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ExpressionParser.RULE_negative_expr; }
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterNegative_expr) {
			listener.enterNegative_expr(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitNegative_expr) {
			listener.exitNegative_expr(this);
		}
	}
	// @Override
	public accept<Result>(visitor: ExpressionVisitor<Result>): Result {
		if (visitor.visitNegative_expr) {
			return visitor.visitNegative_expr(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class KeyContext extends ParserRuleContext {
	public SIMPLETEXT(): TerminalNode { return this.getToken(ExpressionParser.SIMPLETEXT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return ExpressionParser.RULE_key; }
	// @Override
	public enterRule(listener: ExpressionListener): void {
		if (listener.enterKey) {
			listener.enterKey(this);
		}
	}
	// @Override
	public exitRule(listener: ExpressionListener): void {
		if (listener.exitKey) {
			listener.exitKey(this);
		}
	}
	// @Override
	public accept<Result>(visitor: ExpressionVisitor<Result>): Result {
		if (visitor.visitKey) {
			return visitor.visitKey(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


