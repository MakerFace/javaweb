

function sendPost(args) {
	// body...
	var turnForm = document.createElement("form");
	document.body.appendChild(turnForm);
	turnForm.method = 'post';
	turnForm.action = '/Test';

	var first = document.createElement("input");
	first.name = "RequestBegin";
	first.type="text";
	first.value = "Request";
	turnForm.appendChild(first);


	turnForm.submit();
}

function buy() {
	// body...
	alert("购买了");
}