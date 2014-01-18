var Calculator = {
	calculate: function(operation, first, second) {
		if (first === undefined || first.constructor != BigNumber || second === undefined || second.constructor != BigNumber) {
			return;
		}
		
		if (operation == "+") {
			return first.plus(second);
		}
		
		if (operation == "-") {
			return first.minus(second);
		}
		
		if (operation == "*") {
			return first.times(second);
		}
	}
};