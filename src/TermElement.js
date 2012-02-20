var TermElement = new Class({
	bases: {
		z: 36,
		x: 16,
		m: 10,
		o: 8,
		b: 2
	},
	
	initialize: function(first, operator, second) {
		this.setFirst(first);
		this.setOperator(operator);
		this.setSecond(second);
	},
	
	getFirst: function() {
		return this._first;
	},
	setFirst: function(element) {
		this._first = this._parse(element);
		
		return this._first;
	},
	
	getSecond: function() {
		return this._second;
	},
	setSecond: function(element) {
		this._second = this._parse(element);
		
		return this._second;
	},
	
	getOperator: function() {
		return this._operator;
	},
	setOperator: function(operator) {
		this._operator = operator;
		
		return this._operator;
	},
	
	calculate: function(base) {
		base = base || 10;
		var result = this.calculateBigInt();
		if(!result) {
			return;
		}
		
		return (result && result.negative ? "-" : "") + bigInt2str(result, base);
	},
	
	calculateBigInt: function() {
		if (!this._first || this._operator && !this._second || this._second && !this._operator) {
			return;
		}
		
		var first = this._first;
		if (typeOf(first.calculateBigInt) == "function") {
			first = first.calculateBigInt();
			if(!first) {
				return;
			}
		}
		var second = this._second;
		if (second && typeOf(second.calculateBigInt) == "function") {
			second = second.calculateBigInt();
			if(!second) {
				return;
			}
		}
		
		var result;
		if (!this._operator) {
			result = this._first;
		} else if (this._operator == "+") {
			result = this._add(first, second);
		} else if (this._operator == "-") {
			result = this._substract(first, second);
		} else {
			return;
		}
		if (isZero(result)) {
			result.negative = false;
		}
		
		return result;
	},
	
	_parse: function(element) {
		// bigInt = array
		if(typeOf(element) == "array" || typeOf(element) == "object" && typeOf(element.calculateBigInt) == "function") {
			return element;
		} else if(typeOf(element) == "string") {
			// check base
			var base = 36;
			if (element.length >= 2 && element.charAt(0) == 0 && this.bases[element.charAt(1)]) {
				base = this.bases[element.charAt(1)];
				element = element.slice(2);
			}
			// create bigint
			element = str2bigInt(element, base);
			
			return element;
		} else {
			return;
		}
		
	},
	
	_add: function(first, second) {
		if (second.negative) {
			second.negative = false;
			return this._substract(first, second);
		}
		if (first.negative) {
			first.negative = false;
			return this._substract(second, first);
		}
		
		return add(first, second);
	},
	
	_substract: function(first, second) {
		if (second.negative) {
			second.negative = false;
			return this._add(first, second);
		}
		if (first.negative) {
			first.negative = false;
			var result = this._add(first, second);
			result.negative = true;
			
			return result;
		}
	
		var result;
		if (greater(first, second)) {
			result = sub(first, second);
		} else {
			result = sub(second, first);
			result.negative = true;
		}
		
		return result;
	}
});