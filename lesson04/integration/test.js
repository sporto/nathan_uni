var assert = require('assert');
var PEG = require('pegjs');
var fs = require('fs'); // for loading files

var data = fs.readFileSync('scheem.peg', 'utf-8');
var parser = PEG.buildParser(data);

describe('parser', function () {
	it('parses a number', function () {
		assert.deepEqual(
			parser.parse('42'),
			42
		);
	});
	it('parses a variable', function () {
		assert.deepEqual(
			parser.parse('x'),
			'x'
		);
	});
	it('parses', function () {
		var code = "(+ 1 (* x 3))";
		assert.deepEqual(
			parser.parse(code)
			["+", "1", ["*", "x", "3"]]
		);
	});
	it('handles too many spaces', function () {
		var code = "(+  1     (*   x    3   ))";
		assert.deepEqual(
			parser.parse(code)
			["+", "1", ["*", "x", "3"]]
		);
	});
	it('handles tabs', function () {
		var code = "(+	1  	(*	x 			3   ))";
		assert.deepEqual(
			parser.parse(code)
			["+", "1", ["*", "x", "3"]]
		);
	});
	it('parses factorial', function () {
		var code = "(* n (factorial (- n 1)))";
		assert.deepEqual(
			parser.parse(code)
			["*", "n", ["factorial", ["-", "n", "1"]]]
		);
	});
	it('parses quote', function () {
		var code = "'(1 2 3)";
		assert.deepEqual(
			parser.parse(code),
			["quote", ["1", "2", "3"] ]
		);
	});
});