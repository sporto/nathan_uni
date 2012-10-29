var evalScheem = function(expr, env) {
	var one, two;
	// Numbers evaluate to themselves
	if(typeof expr === 'number') {
		return expr;
	}
	// Look at head of list for operation
	switch(expr[0]) {
	case 'define':
		env[expr[1]] = evalScheem(expr[2], env);
		return 0;
	case 'set!':
		if(env[expr[1]] == null) {
			throw new Error(expr[1] + ' is not defined');
		}
		env[expr[1]] = evalScheem(expr[2], env);
		return 0;
	case 'begin':
		var res;
		for(var a = 1; a < expr.length; a++) {
			res = evalScheem(expr[a], env);
		}
		return res;
	case '<':
		var res = (evalScheem(expr[1], env) < evalScheem(expr[2], env));
		if(res) return '#t';
		return '#f';
	case '=':
		var eq = (evalScheem(expr[1], env) === evalScheem(expr[2], env));
		if(eq) return '#t';
		return '#f';
	case '+':
		return evalScheem(expr[1], env) + evalScheem(expr[2], env);
	case 'cons':
		one = evalScheem(expr[1], env);
		two = evalScheem(expr[2], env);
		return [one].concat(two);
	case 'car':
		one = evalScheem(expr[1], env);
		return one[0];
	case 'cdr':
		one = evalScheem(expr[1], env);
		one.shift();
		return one;
	case 'quote':
		return expr[1];
	case 'if':
		if(evalScheem(expr[1]) === '#t') {
			return evalScheem(expr[2], env);
		} else {
			return evalScheem(expr[3], env);
		}

	}
};

exports.evalScheem = evalScheem;