// challenge 1- Egg Language
//  data structure = syntax tree

// Everything in Egg is an ((expression)).
// An expression can be the name of a binding, a number, a string, or an application.
 // Applications are used for function calls but also for constructs such as if or while.

// types properties
// value = literal string or numbers
// word = identifiers(names=strings) --> have a name property
// apply = applications --> have an operator property/ ref. the expression being applied
// --> has an args property --> holds an array of argument expressions

// first part of the parser(given in chapter)
// takes a string as input
function parseExpression(program) {
  program = skipSpace(program);
  let match, expr;
  // using 3 regex to spot either strings, #s or words
  if (match = /^"([^"]*)"/.exec(program)) {
    expr = {type: "value", value: match[1]};
  } else if (match = /^\d+\b/.exec(program)) {
    expr = {type: "value", value: Number(match[0])};
  } else if (match = /^[^\s(),#"]+/.exec(program)) {
    expr = {type: "word", name: match[0]};
  } else {
    // if the input does not match any of the above 3 forms, it's not a valid expression
    // throw an error, specifically Syntax Error
    throw new SyntaxError("Unexpected syntax: " + program);
  }
// return what is matched and pass it along w/ the object for the expression to parseApply
  return parseApply(expr, program.slice(match[0].length));
}

// Egg, allows any amount of ((whitespace)) between its elements,
// we have to repeatedly cut the whitespace off the start of the program string.
function skipSpace(string) {
  let first = string.search(/\S/);
  if (first == -1) return "";
  return string.slice(first);
}
//this checks whether the expression passed in is an application,
// if it is, a list of arguments is parsed
function parseApply(expr, program) {
  program = skipSpace(program);
  // If the next character in the program is not an opening parenthesis,
  // this is not an application, and parseApply returns the expression it was given.
  if (program[0] != "(") {
    return {expr: expr, rest: program};
  }
// otherwise skip opening () & create syntax tree object for the application expression
  program = skipSpace(program.slice(1));
  expr = {type: "apply", operator: expr, args: []};
  while (program[0] != ")") {
    let arg = parseExpression(program);
    expr.args.push(arg.expr);
    program = skipSpace(arg.rest);
    if (program[0] == ",") {
      program = skipSpace(program.slice(1));
    } else if (program[0] != ")") {
      throw new SyntaxError("Expected ',' or ')'");
    }
  }
  // parseApply and parseExpression call each other-> this is indirect recursion(?)
  return parseApply(expr, program.slice(1));
}

// this parse function verifies that it has reached the end of the input
// after parsing the expression( the Egg program is a single expression)
function parse(program) {
  let {expr, rest} = parseExpression(program);
  if (skipSpace(rest).length > 0) {
    throw new SyntaxError("Unexpected text after program");
  }
  return expr;
}
//    ======      =======          =======

// → 6
