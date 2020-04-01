grammar Expression;

//lexer
expression
  : object EOF
  ;

object
  : negative_expr object
  | expr
  | '(' object ')'
  | object logical_operator object
  ;

expr
  : key
  | key boolean_operator value
  | key numeric_compare_operator numerical_value
  | key string_compare_operator array
  | key string_compare_operator value
  | key array_operator array
  ;

logical_operator
  : AND
  | OR
  ;

boolean_operator
  : EQUAL
  | NOTEQUAL
  ;

numeric_compare_operator
  : GT
  | GTE
  | LT
  | LTE
  ;

string_compare_operator
  : CONTAINS
  ;

array_operator
  : IN
  | CONTAINS
  ;

array
  : '[' value (',' value)* ']'
  | '[' ']' // empty array
  ;

numerical_value
  : NUMBER
  ;

value
 : NUMBER
 | STRING
 ;

negative_expr
  : NEG
  | NOT
  ;

key
 : SIMPLETEXT
 ;

//parser
OR: O R;
AND: A N D;
NOT: N O T;
EQUAL: '=';
NOTEQUAL: '!=';
CONTAINS: C O N T A I N S;
NEG: NEG_OP;

// Allow only for numbers
GT: '>';
GTE: '>=';
LT: '<';
LTE: '<=';

// Allow only for array?
IN: I N;

// Needs maybe INTEGER OR FLOAT? Use fragments?
NUMBER : INTEGER ('.' INTEGER)? ;

FLOAT : INTEGER '.' INTEGER ;
INTEGER : [0-9]+ ;

SIMPLETEXT  : [a-zA-Z_0-9.]([\-a-zA-Z_0-9.] | ESC_DOT)* ;
STRING :  '\'' ( ESC | ~('\\'|'\'') )* '\''
          |'"' ( ESC | ~('\\'|'"') )* '"';
//COMPLEXTEXT :  '\'' (ESC | ~['\\])* '\'' ;

WS  :   [ \t\n\r]+ -> skip ;


//fragments
fragment ESC : '\\' (['\\/bfnrt] | UNICODE | NEG_OP) ;
fragment UNICODE : 'u' HEX HEX HEX HEX ;
fragment HEX : [0-9a-fA-F] ;

fragment ESC_DOT : '\\.';

fragment A: [aA];
fragment B: [bB];
fragment C: [cC];
fragment D: [dD];
fragment E: [eE];
fragment F: [fF];
fragment G: [gG];
fragment H: [hH];
fragment I: [iI];
fragment J: [jJ];
fragment K: [kK];
fragment L: [lL];
fragment M: [mM];
fragment N: [nN];
fragment O: [oO];
fragment P: [pP];
fragment Q: [qQ];
fragment R: [rR];
fragment S: [sS];
fragment T: [tT];
fragment U: [uU];
fragment V: [vV];
fragment W: [wW];
fragment X: [xX];
fragment Y: [yY];
fragment Z: [zZ];

fragment NEG_OP: '!';