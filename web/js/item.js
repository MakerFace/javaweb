
function compare(value1, value2) {
	// body...
	if(parseInt(value1) > parseInt(value2))
		return 1;
	else if(parseInt(value1) == parseInt(value2))
		return 0;
	else
		return -1;
}

function minusClick() {
	// body...
	var count = document.getElementById('iptAmount');
	//小等1
	if(compare(count.value,1) <= 0){
		return false;
	}
	count.value--;
	//等于1
	if(compare(count.value,1) == 0)	{
		disabled("countMinus");
	}
	else
	{
		enabled('countPlus');
	}
}

function plusClick() {
	//body...
	var count = document.getElementById('iptAmount');
	var max = document.getElementById('SpanStock').innerText;
	//大等max
	if(compare(count.value,max) >= 0){
		disabled('countPlus')
		return false;
	}
	count.value++;
	//大等2
	if(compare(count.value, 2) >= 0){
		enabled("countMinus")
	}
	if(compare(count.value,max) == 0){
		disabled('countPlus')
	}
}

function disabled(argument) {
	// body...
	var btn = document.getElementById(argument);
	btn.className += " ff-disable";
}

function enabled(argument) {
	// body...
	var btn = document.getElementById(argument);
	//移除所有id等于argument的a链接的这个属性
	$("a#"+argument).removeClass("ff-disable");
}

function countInput() {
	// body...
	var count = document.getElementById('iptAmount');
	var max = document.getElementById('SpanStock').innerText;

	//大于max，小于1
	if(compare(count.value,max) > 0){
		count.value = max;
	}
	else if(compare(count.value,1) < 0){
		count.value = 1;
	}
}

function buy() {
	// body...
	/*提交一个buy的json数据：
	{
		shopid:id,
		shopnum:num,
		action:buy
	}
	*/
}

function add() {
	// body...
	/*提交一个add的json数据
	{
		shopid:id,
		shopnum:num,
		acition:add
	}
	*/
	var shopname = $("#ff-title").text();
	var count = $("#iptAmount").val();
	alert("加入购物车成功！\n物品：" + shopname + "\n数量：" + count);
}