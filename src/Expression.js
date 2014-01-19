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
			html: "+",
			tex: "+"
		},
		"-": {
			precedence: 1,
			html: "&minus;",
			tex: "-"
		},
		"*": {
			precedence: 2,
			html: "&times;",
			tex: "\\times"
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
	
	getTeX: function() {
		if (!this.isValid()) {
			return;
		}
		
		var stack = [];
		for (var i = 0; i < this._expression.length; i++) {
			stack[i] = this._expression[i];
		}
		return this._getTeX(stack);
	},
	
	calculate: function(base) {
		if (!this.isValid()) {
			return;
		}
		
		base = base || 36;
		var result = this._calculateResult();
		
		if (!result) {
			return;
		}
		
		return result.toString(base).toUpperCase();
	},
	
	_getHtml: function(stack) {
		if (!stack.length) {
			return "";
		}
		
		var element = stack.pop();
		
		if (!this.operators[element]) {
			var baseString = element.base;
			if (baseString == 36) {
				baseString = "ZA";
			} else if (baseString == 10) {
				baseString = "MU";
			}
			return element.toString(element.base).toUpperCase() + "<sub>" + baseString + "</sub>";
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
	
	_getTeX: function(stack) {
		if (!stack.length) {
			return "";
		}
		
		var element = stack.pop();
		
		if (!this.operators[element]) {
			var baseString = element.base;
			if (baseString == 36) {
				baseString = "\\mathrm{ZA}";
			} else if (baseString == 10) {
				baseString = "\\mathrm{MU}";
			} else if (baseString > 9) {
				baseString = "{" + baseString + "}";
			}
			
			var number = element.toString(element.base).toUpperCase();
			if (element.base > 10) {
				number = "\\mathrm{" + number + "}";
			}
			return  number + "_" + baseString;
		}
		
		var operator = this.operators[element];
		
		var rightOperator = this.operators[stack.peek()];
		var right = this._getTeX(stack);
		if (rightOperator && operator.precedence > rightOperator.precedence) {
			right = "\\left( " + right + " \\right)";
		}
		var leftOperator = this.operators[stack.peek()];
		var left = this._getTeX(stack);
		if (leftOperator && operator.precedence > leftOperator.precedence) {
			left = "\\left( " + left + " \\right)";
		}
		
		return [left, operator.tex, right].join(" ");
	},
	
	_calculateResult: function() {
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
		var numberExp = /^[0-9A-Z]+/ig;
		while (input.length > 0) {
			var stripSize = 0;
			var number = numberExp.exec(input);
			if (number && number.length) { // number
				stripSize = number[0].length;
				var bigNumber = this._parseNumber(number[0]);
				expression.push(bigNumber);
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
		var base = 36;
		if (number.length >= 2 && number.charAt(0) == 0 && this.bases[number.charAt(1)]) {
			base = this.bases[number.charAt(1)];
			number = number.slice(2);
		}
		
		if (number.length == 0) {
			number = "0";
		}
		
		var bigNumber = new BigNumber(number, base);
		bigNumber.base = base;
		
		return bigNumber;
	}
});

Expression.extend({
	pattern: "([\\( ]*[0-9A-Za-z][ 0-9A-Za-z]*[\\) ]*([-+*][\\( ]*[0-9A-Za-z][ 0-9A-Za-z]*[\\) ]*)*[-+*]?[ \\(]*)?"
});