

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

function readJSON(){
	var json = {
		"arrayTools" : [
		{
			"name": "站长工具",
			"url": "http://tool.chinaz.com",
			"address": {
				"city": "厦门",
				"country": "中国"
			},
		},
		{
			"name": "站长工具2",
			"url": "http://tool.chinaz2.com",
			"address": {
				"city": "厦门2",
				"country": "中国2"
			},
		}
		]
	};
	var par = document.getElementById('parent');
	var resTools = json.arrayTools;
	var resBrowser = json.arrayBrowser;
	for(var i = 0;i < resTools.length;i++){
		var p = document.createElement("p");
		var name = document.createTextNode("name:" + resTools[i].name);
		var url = document.createTextNode("url:" + resTools[i].url);
		var addressCity = document.createTextNode("address:city:" + resTools[i].address.city);
		var addressCounty = document.createTextNode("country:" + resTools[i].address.city);
		p.appendChild(name);
		var p1 = document.createElement("p");
		p1.appendChild(url);
		var p2 = document.createElement("p");
		p2.appendChild(addressCity);
		var p3 = document.createElement("p");
		p3.appendChild(addressCounty);
		par.appendChild(p);
		par.appendChild(p1);
		par.appendChild(p2);
		par.appendChild(p3);
	}
}