var Term = new Class({
	initialize: function(input) {
		this._input = this._parse(input);
	},
	
	isValid: function() {
		return typeOf(this._input) != "null";
	},
	
	getHtml: function() {
		if (!this.isValid()) {
			return;
		}
		
		return "(html)";
	},
	
	calculate: function() {
		if (!this.isValid()) {
			return;
		}
		
		return this._input.calculate(36); // result in base 36
	},
	
	_parse: function(input) {
		input = input || "0";
		if (!input.test(new RegExp("^" + Term.pattern + "$"))) {
			return;
		}
		
		var element = "";
		var hierarchy = [];
		for (var i = 0; i < input.length; i++) {
			var c = input.charAt(i);
			// ignore spaces
			if (c == " ") {
				continue;
			}
			
			// number
			if (c != "+" && c != "-") {
				element += c;
			// operators
			} else {
				var termElement;
				if (!hierarchy.length) {
					termElement = new TermElement(element, c);
				} else {
					var lastElement = hierarchy[hierarchy.length-1];
					lastElement.setSecond(element);
					termElement = new TermElement(lastElement, c);
				}
				hierarchy.push(termElement);
				element = "";
			}
		}
		if (element) {
			if (hierarchy.length) {
				hierarchy[hierarchy.length-1].setSecond(element);
			} else {
				return new TermElement(element);
			}
		}
		
		return hierarchy[hierarchy.length-1];
	}
});

Term.extend({
	pattern: "[-+ 0-9A-Za-z]*"
});