document.addEvent("domready", function() {
	var input = $("input");
	var styledInput = $("styledinput");
	var output = $("output");
	
	var action = function() {
		var term = new Term(input.get("value"));
		if (!term.isValid()) {
			input.addClass("invalid");
		} else {
			input.removeClass("invalid");
			styledInput.set("html", term.getHtml() || "");
			output.set("html", term.calculate() || "");
		}
	};

	input.set("pattern", Term.pattern);
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