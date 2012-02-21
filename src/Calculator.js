var Calculator = {
	calculate: function(operation, firstBigInt, secondBigInt) {
		if (typeOf(firstBigInt) != "array" || typeOf(secondBigInt) != "array") {
			return;
		}
		
		var result;
		if (operation == "+") {
			result = this._add(firstBigInt, secondBigInt);
		}
		
		if (operation == "-") {
			result = this._substract(firstBigInt, secondBigInt);
		}
		
		if(result && isZero(result)) {
			result.negative = false;
		}
		
		return result;
	},
	
	_add: function(first, second) {
		if (second.negative) {
			second = Array.clone(second); // clone to not destroy reference (need negative = false)
			
			return this._substract(first, second);
		}
		
		if (first.negative) {
			first = Array.clone(first); // clone to not destroy reference (need negative = false)
			
			return this._substract(second, first);
		}
		
		return add(first, second);
	},
	
	_substract: function(first, second) {
		if (second.negative) {
			second = Array.clone(second); // clone to not destroy reference (need negative = false)
			//second.negative = false;
			
			return this._add(first, second);
		}
		
		if (first.negative) {
			first = Array.clone(first); // clone to not destroy reference (need negative = false)
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