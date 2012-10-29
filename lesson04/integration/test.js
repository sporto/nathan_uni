var assert = require('assert');
var PEG = require('pegjs');
var fs = require('fs'); // for loading files

var data = fs.readFileSync('scheem.peg', 'utf-8');
var parser = PEG.buildParser(data);

var evalScheem = require('./interpreter').evalScheem;

function evalScheemString(code, env) {
	var parsed = parser.parse(code);
	console.log(parsed)
	return evalScheem(parsed, env);
};

describe('parser', function() {
	it('parses a number', function() {
		assert.deepEqual(
			parser.parse('42'), 
			42);
	});
	it('parses a variable', function() {
		assert.deepEqual(
			parser.parse('x'), 
			'x');
	});
	it('parses', function() {
		var code = "(+ 1 (* x 3))";
		assert.deepEqual(
			parser.parse(code), 
			["+", 1, ["*", "x", 3]]);
		});
	it('handles too many spaces', function() {
		var code = "(+  1     (*   x    3   ))";
		assert.deepEqual(
			parser.parse(code),
			["+", 1, ["*", "x", 3]]);
	});
	it('handles tabs', function() {
		var code = "(+	1  	(*	x 			3   ))";
		assert.deepEqual(
			parser.parse(code),
			["+", 1, ["*", "x", 3]]
			);
	});
	it('parses factorial', function() {
		var code = "(* n (factorial (- n 1)))";
		assert.deepEqual(
		parser.parse(code),
		["*", "n", ["factorial", ["-", "n", 1]]]);
	});
	it('parses quote', function() {
		var code = "'(1 2 3)";
		assert.deepEqual(
		parser.parse(code), 
		["quote", [1, 2, 3]]);
	});
});

describe('interpreter', function() {
	var env = {};
	var res;

	// Some unit it
	describe('define', function() {
		it('a number', function() {
			env = {};
			evalScheem(['define', 'a', 1], env)
			assert.deepEqual(
			env, {
				a: 1
			});
		});
		it('a atom', function() {
			env = {};
			evalScheem(['define', 'a', ['quote', 'dog']], env)
			assert.deepEqual(
			env, {
				a: 'dog'
			});
		});
	});

	describe('set!', function() {
		it('a number', function() {
			env = {
				a: 0
			};
			evalScheem(['set!', 'a', 1], env)
			assert.deepEqual(
			env, {
				a: 1
			});
		});
		it('not set', function() {
			assert.throws(function() {
				evalScheem(['set!', 'b', 3], {});
			});
		});
	});

	describe('begin', function() {
		it('returns the last instruction', function() {
			res = evalScheem(['begin', ['+', 3, 3],
				['+', 2, 3]
			], env);
			assert.deepEqual(
			res, 5)
		});
		it('evals all instruction', function() {
			env = {};
			evalScheem(['begin', ['define', 'a', 3],
				['define', 'b', 2]
			], env);
			assert.deepEqual(
			env, {
				a: 3,
				b: 2
			})
		});
	});

	describe('quote', function() {
		it('a number', function() {
			assert.deepEqual(
			evalScheem(['quote', 3], {}), 3);
		});
		it('an atom', function() {
			assert.deepEqual(
			evalScheem(['quote', 'dog'], {}), 'dog');
		});
		it('a list', function() {
			assert.deepEqual(
			evalScheem(['quote', [1, 2, 3]], {}), [1, 2, 3]);
		});
	});

	describe('add', function() {
		it('two numbers', function() {
			assert.deepEqual(
			evalScheem(['+', 3, 5], {}), 8);
		});
		it('a number and an expression', function() {
			assert.deepEqual(
			evalScheem(['+', 3, ['+', 2, 2]], {}), 7);
		});
		// it('a dog and a cat', function() {
		//    assert.throws(function () {
		//        evalScheem(['+', 'dog', 'cat'], {});
		//    });
		// });
	});

	describe('=', function() {
		it('numbers', function() {
			res = evalScheem(['=', 3, 3]);
			assert.deepEqual(
			res, '#t');
		});
		it('numbers dif', function() {
			res = evalScheem(['=', 4, 3]);
			assert.deepEqual(
			res, '#f');
		});
	});

	describe('<', function() {
		it('numbers', function() {
			res = evalScheem(['<', 2, 3]);
			assert.deepEqual(
			res, '#t');
		});
		it('numbers =', function() {
			res = evalScheem(['<', 2, 2]);
			assert.deepEqual(
			res, '#f');
		});
		it('numbers >', function() {
			res = evalScheem(['<', 4, 3]);
			assert.deepEqual(
			res, '#f');
		});
	});

	describe('cons', function() {
		it('adds', function() {
			res = evalScheem(['cons', 2, ['quote', [3, 4]]]);
			assert.deepEqual(
			res, [2, 3, 4]);
		});
	});

	describe('car', function() {
		it('returns the first element', function() {
			res = evalScheem(['car', ['quote', [3, 4, 5]]]);
			assert.deepEqual(
			res, 3);
		});
	});

	describe('cdr', function() {
		it('returns the rest', function() {
			res = evalScheem(['cdr', ['quote', [3, 4, 5]]]);
			assert.deepEqual(
			res, [4, 5]);
		});
	});

	describe('if', function() {
		it('evals the first if true', function() {
			env = {};
			res = evalScheem(['if', ['=', 1, 1],
				['define', 'x', 8],
				['define', 'y', 9]
			], env);
			assert.deepEqual(
			env, {
				x: 8
			});
		});
		it('evals the first if true', function() {
			env = {};
			res = evalScheem(['if', ['=', 1, 2],
				['define', 'x', 8],
				['define', 'y', 9]
			], env);
			assert.deepEqual(
			env, {
				y: 9
			});
		});
	});
});

describe('evalScheemString', function() {
	var env = {};
	var res;
	it('works', function() {
		res = evalScheemString("(+ 3 5)", env);
		assert.deepEqual(
			res,
			8
		);
	});
});