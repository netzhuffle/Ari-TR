document.addEvent("domready", function() {
	var input = $("input");
	var output = $("output");
	var styledMath = null;
	MathJax.Hub.Queue(function() {
		styledMath = MathJax.Hub.getAllJax("styledInput")[0];
	});
	
	var action = function() {
		var expression = new Expression(input.get("value"));
		if (!expression.isValid()) {
			input.addClass("invalid");
		} else {
			input.removeClass("invalid");
			var result = expression.calculate();
			if (result) {
				MathJax.Hub.Queue(["Text", styledMath, expression.getTeX() || "\( \)"]);
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