var Expression = new Class({
	bases: {
		z: 36,
		x: 16,
		m: 10,
		o: 8,
		b: 2
	},
	
	initialize: function(input) {
		this._expression = this._parse(input);
	},
	
	isValid: function() {
		return typeOf(this._expression) != "null";
	},
	
	getHtml: function() {
		if (!this.isValid()) {
			return;
		}
		
		return this._getHtml(this._expression);
	},
	
	calculate: function(base) {
		if (!this.isValid()) {
			return;
		}
		base = base || 36;
		var bigInt = this._calculateBigInt(this._expression);
		if (!bigInt) {
			return;
		}
		
		return (bigInt && bigInt.negative ? "-" : "") + bigInt2str(bigInt, base);
	},
	
	_getHtml: function(expression) {
		if (typeOf(expression) != "array" || !expression.bigInt && !expression.operator) {
			return;
		}
		
		if (expression.bigInt) {
			var baseString = expression.base;
			if (baseString == 36) {
				baseString = "ZA";
			} else if (baseString == 10) {
				baseString = "MU";
			}
			return bigInt2str(expression, expression.base) + "<sub>" + baseString + "</sub>";
		}
		
		var result = "";
		for (var i = 0; i < expression.length; i++) {
			result += this._getHtml(expression[i]);
			if(expression[i+1]) {
				if (expression.operator == "+") {
					result += " + ";
				} else if (expression.operator == "-") {
					result += " - ";
				} else {
					return;
				}
			}
		}
		
		return result;
	},
	
	_calculateBigInt: function(expression) {
		if (typeOf(expression) != "array" || !expression.bigInt && !expression.operator) {
			return;
		}
		
		if (expression.bigInt) {
			return expression;
		}
		
		var result;
		for (var i = 0; i < expression.length; i++) {
			var bigInt = this._calculateBigInt(expression[i]);
			if (i > 0) {
				bigInt = Calculator.calculate(expression.operator, result, bigInt);
			}
			if (!bigInt) {
				return;
			}
			result = bigInt;
		}
		
		return result;
	},
	
	_parse: function(input) {
		input = input.replace(/ /g, ""); // strip spaces
		input = input || "0";
		if (!input.test(new RegExp("^" + Expression.pattern + "$"))) {
			return;
		}
		
		if (input.test(/^[0-9A-Za-z]+$/)) { // number
			// check base
			var base = 36;
			if (input.length >= 2 && input.charAt(0) == 0 && this.bases[input.charAt(1)]) {
				base = this.bases[input.charAt(1)];
				input = input.slice(2);
			}
			
			// create bigint
			var bigInt = str2bigInt(input, base);
			bigInt.bigInt = true;
			bigInt.base = base;
			
			return bigInt;
		}
		
		// else: calculation
		// 1. +
		var expression = input.split("+");
		if (expression.length > 1) {
			expression.operator = "+";
			for (var i = 0; i < expression.length; i++) {
				expression[i] = this._parse(expression[i]);
			}
			
			return expression;
		}
		
		// 2. -
		expression = input.split("-");
		if (expression.length > 1) {
			expression.operator = "-";
			for (var i = 0; i < expression.length; i++) {
				expression[i] = this._parse(expression[i]);
			}
			
			return expression;
		}
		
		return; // error
	}
});

Expression.extend({
	pattern: " *([0-9A-Za-z]+ *([+-] *[0-9A-Za-z]+ *)*[+-]? *)?"
});