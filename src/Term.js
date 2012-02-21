var Term = new Class({
	bases: {
		z: 36,
		x: 16,
		m: 10,
		o: 8,
		b: 2
	},
	
	initialize: function(input) {
		this._term = this._parse(input);
	},
	
	isValid: function() {
		return typeOf(this._term) != "null";
	},
	
	getHtml: function() {
		if (!this.isValid()) {
			return;
		}
		
		// TODO
		return "(html)";
	},
	
	calculate: function(base) {
		if (!this.isValid()) {
			return;
		}
		base = base || 36;
		var bigInt = this._calculateBigInt(this._term);
		if (!bigInt) {
			return;
		}
		
		return (bigInt && bigInt.negative ? "-" : "") + bigInt2str(bigInt, base);
	},
	
	_calculateBigInt: function(term) {
		if (typeOf(term) != "array" || !term.bigInt && !term.operator) {
			return;
		}
		
		if (term.bigInt) {
			return term;
		}
		
		var result;
		for (var i = 0; i < term.length; i++) {
			var bigInt = this._calculateBigInt(term[i]);
			if (i > 0) {
				bigInt = Calculator.calculate(term.operator, result, bigInt);
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
		if (!input.test(new RegExp("^" + Term.pattern + "$"))) {
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
			
			return bigInt;
		}
		
		// else: calculation
		// 1. +
		var term = input.split("+");
		if (term.length > 1) {
			term.operator = "+";
			for (var i = 0; i < term.length; i++) {
				term[i] = this._parse(term[i]);
			}
			
			return term;
		}
		
		// 2. -
		term = input.split("-");
		if (term.length > 1) {
			term.operator = "-";
			for (var i = 0; i < term.length; i++) {
				term[i] = this._parse(term[i]);
			}
			
			return term;
		}
		
		return; // error
	}
});

Term.extend({
	pattern: " *([0-9A-Za-z]+ *([+-] *[0-9A-Za-z]+ *)*[+-]? *)?"
});