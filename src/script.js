document.addEvent("domready", function() {
	var input = $("input");
	var styledInput = $("styledinput");
	var output = $("output");
	var action = function() {
		var term = new Term(input.get("value"));
		if (term.isError()) {
			input.addClass("error");
		} else {
			input.removeClass("error");
			styledInput.set("html", term.getHtml() || "");
			output.set("html", term.calculate() || "");
		}
	};
	input.addEvent("keyup", action);
	$("form").addEvent("submit", action);
	document.body.addClass("js");
});