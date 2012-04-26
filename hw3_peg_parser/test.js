var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs'); // for loading files

// Read file contents
var data = fs.readFileSync('scheem.peg', 'utf-8');
// Show the PEG grammar file
//console.log(data);
// Create my parser
var parser = PEG.buildParser(data);
// Do a test

var code01 = fs.readFileSync('01.scheem', 'utf-8');
var code02 = fs.readFileSync('02.scheem', 'utf-8');
var code03 = fs.readFileSync('03.scheem', 'utf-8');
var code04 = fs.readFileSync('04.scheem', 'utf-8');
var code05 = fs.readFileSync('05.scheem', 'utf-8');
var code06 = fs.readFileSync('06.scheem', 'utf-8');

var expected01 = ["+", "1", ["*", "x", "3"]];
var expected02 = ["*", "n", ["factorial", ["-", "n", "1"]]];

assert.deepEqual( parser.parse(code01), expected01 );
assert.deepEqual( parser.parse(code02), expected02 );

//whitespaces
assert.deepEqual( parser.parse(code03), expected01 );
assert.deepEqual( parser.parse(code04), expected02 );
//tabs and returns
assert.deepEqual( parser.parse(code05), expected01 );
assert.deepEqual( parser.parse(code06), expected02 );

