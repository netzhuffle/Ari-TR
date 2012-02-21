var Calculator = {
	calculate: function(operation, firstBigInt, secondBigInt) {
		if (typeOf(firstBigInt) != "array" || typeOf(secondBigInt) != "array") {
			return;
		}
		
		if (operation == "+") {
			return this._add(firstBigInt, secondBigInt);
		}
		
		if (operation == "-") {
			return this._substract(firstBigInt, secondBigInt);
		}
		
		return; // unsupported operation
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
};