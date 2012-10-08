document.addEvent("domready", function() {
	var input = $("input");
	var styledInput = $("styledinput");
	var output = $("output");
	
	var action = function() {
		var expression = new Expression(input.get("value"));
		if (!expression.isValid()) {
			input.addClass("invalid");
		} else {
			input.removeClass("invalid");
			var result = expression.calculate();
			if (result) {
				styledInput.set("html", expression.getHtml() || "");
				output.set("html", expression.calculate() || "");
			}
		}
	};

	input.set("pattern", Expression.pattern);
	input.addEvent("keyup", action);
	$("form").addEvent("submit", function(e) {
		e.preventDefault();
		action();
		if(!input.hasClass("invalid")) {
			output.getParent().highlight();
		} else {
			input.highlight("#e00");
		}
	});
	
	document.body.addClass("js");
});