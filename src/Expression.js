Array.implement("peek", Array.prototype.getLast);

var Expression = new Class({
	bases: {
		z: 36,
		x: 16,
		m: 10,
		o: 8,
		b: 2
	},
	
	operators: {
		"+": {
			precedence: 1,
			html: "+"
		},
		"-": {
			precedence: 1,
			html: "&minus;"
		},
		"*": {
			precedence: 2,
			html: "&middot;"
		}
	},
	
	initialize: function(input) {
		this._expression = this._parse(input);
	},
	
	isValid: function() {
		return typeOf(this._expression) == "array";
	},
	
	getHtml: function() {
		if (!this.isValid()) {
			return;
		}
		
		var stack = [];
		for (var i = 0; i < this._expression.length; i++) {
			stack[i] = this._expression[i];
		}
		return this._getHtml(stack);
	},
	
	calculate: function(base) {
		if (!this.isValid()) {
			return;
		}
		
		base = base || 36;
		var bigInt = this._calculateBigInt();
		
		return (bigInt && bigInt.negative ? "-" : "") + bigInt2str(bigInt, base);
	},
	
	_getHtml: function(stack) {
		var element = stack.pop();
		
		if (!this.operators[element]) {
			var baseString = element.base;
			if (baseString == 36) {
				baseString = "ZA";
			} else if (baseString == 10) {
				baseString = "MU";
			}
			return bigInt2str(element, element.base) + "<sub>" + baseString + "</sub>";
		}
		
		var operator = this.operators[element];
		
		var rightOperator = this.operators[stack.peek()];
		var right = this._getHtml(stack);
		if (rightOperator && operator.precedence > rightOperator.precedence) {
			right = "(" + right + ")";
		}
		var leftOperator = this.operators[stack.peek()];
		var left = this._getHtml(stack);
		if (leftOperator && operator.precedence > leftOperator.precedence) {
			left = "(" + left + ")";
		}
		
		return [left, operator.html, right].join(" ");
	},
	
	_calculateBigInt: function() {
		var stack = [];
		for (var i = 0; i < this._expression.length; i++) {
			var element = this._expression[i];
			if (!this.operators[element]) {
				stack.push(element);
			} else {
				var second = stack.pop();
				var first = stack.pop();
				var result = Calculator.calculate(element, first, second);
				stack.push(result);
			}
		}
		
		return stack.pop();
	},
	
	_parse: function(input) {
		input = input.replace(/ /g, ""); // strip spaces
		input = input || "0";
		if (!input.test(new RegExp("^" + Expression.pattern + "$"))) {
			return;
		}
		
		/* shunting-yard algorithm */
		var expression = []; // Reverse Polish notation
		var stack = [];
		while (input.length > 0) {
			var stripSize = 0;
			var number = (/^[0-9A-Z]+/ig).exec(input);
			if (number && number.length) { // number
				stripSize = number[0].length;
				var bigInt = this._parseNumber(number[0]);
				expression.push(bigInt);
			} else {
				var operator = input.charAt(0);
				stripSize = 1;
				if (operator == ")") {
					while (stack.length && stack.peek() != "(") {
						expression.push(stack.pop());
					}
					if (stack.pop() != "(") {
						return; // error: missmatching parentheses
					}
				} else {
					if(operator != "(") {
						while (stack.length && stack.peek() != "(" && this.operators[operator].precedence <= this.operators[stack.peek()].precedence) {
							expression.push(stack.pop());
						}
					}
					stack.push(operator);
				}
			}
			input = input.substring(stripSize, input.length); // remaining expression
		}
		while (stack.length) {
			var operator = stack.pop();
			if (operator == "(") {
				return; // error: missmatching parentheses
			}
			expression.push(operator);
		}
		
		return expression;
	},
	
	_parseNumber: function(number) {
		/* check base */
		var base = 36;
		if (number.length >= 2 && number.charAt(0) == 0 && this.bases[number.charAt(1)]) {
			base = this.bases[number.charAt(1)];
			number = number.slice(2);
		}
		
		/* create bigint */
		var bigInt = str2bigInt(number, base);
		bigInt.base = base;
		
		return bigInt;
	}
});

Expression.extend({
	pattern: "([\\( ]*[0-9A-Za-z][ 0-9A-Za-z]*[\\) ]*([-+*][\\( ]*[0-9A-Za-z][ 0-9A-Za-z]*[\\) ]*)*[-+*]?[ \\(]*)?"
});