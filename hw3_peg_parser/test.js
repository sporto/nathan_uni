var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

// Read file contents
var data = fs.readFileSync('scheem.peg', 'utf-8');
// Show the PEG grammar file
console.log(data);
// Create my parser
var parser = PEG.buildParser(data);
// Do a test

var input1 = "(+ 1 (* x 3))";
var parsed1 = ["+", "1", ["*", "x", "3"]];
var input2 = "(* n (factorial (- n 1)))";
var parsed2 = ["*", "n", ["factorial", ["-", "n", "1"]]];

assert.deepEqual( parser.parse(input1), parsed1 );
assert.deepEqual( parser.parse(input2), parsed2 );

//whitespaces
var input3 = "(+   1  ( *  x  3) )";
var input4 = "(*   n ( factorial     ( - n    1))   )";
assert.deepEqual( parser.parse(input3), parsed1 );
assert.deepEqual( parser.parse(input4), parsed2 );

