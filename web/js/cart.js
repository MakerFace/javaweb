
var totalOrder;
var totalMoney;

function sum(a,b) {
	// body...
	return parseInt(a) + parseInt(b);
}

function initialize() {
	// body...
	totalOrder = document.getElementById('selectItemsCount');
	totalMoney = document.getElementById('total');
	totalMoney.innerHTML = '0.00';

	//初始化所有的节点
}

//获取格式：input.value存商品号，在ff-sum的span加入001sum
function selectAll(argument) {
	// body...
	var tag = argument.checked;
	var items = document.getElementsByName('items[]');
	var total = 0;
	for(var i = 0; i < items.length; i++){
		items[i].checked = tag;
		total = sum(total,document.getElementById(items[i].value+'sum').innerHTML);
	}
	document.getElementsByName('select-all')[0].checked = tag;
	document.getElementsByName('select-all')[1].checked = tag;
	if(tag){
		setTotal(items.length,total);
	}
	else{
		setTotal('0','0.00');
	}
}

function checkAllSelect() {
	// body...
	var items = document.getElementsByName('items[]');
	for(var i = 0;i < items.length; i++)
		if(!items[i].checked)
			break;
	if(i == items.length)
	{
		document.getElementsByName('select-all')[0].checked = true;
		document.getElementsByName('select-all')[1].checked = true;
	}
	else{
		document.getElementsByName('select-all')[0].checked = false;
		document.getElementsByName('select-all')[1].checked = false;
	}
}

function selectItem(argument) {
	// body...
	var id = argument.value;
	var ipt = document.getElementById(id + 'ipt');
	var pri = document.getElementById(id + 'pri');
	var val = parseInt(pri.innerHTML)*parseInt(ipt.value);
	if(argument.checked){
		addToTotal(1,val);
	}
	else{
		addToTotal(-1,-val);
	}
	checkAllSelect();
}

function onItemChange(id,opt) {
	// body...
	var ipt = document.getElementById(id + 'ipt');
	var pri = document.getElementById(id + 'pri');
	var Sum = document.getElementById(id + 'sum');
	var chk = document.getElementById(id + 'chk');
	var val = parseInt(pri.innerHTML)*parseInt(ipt.value);
	Sum.innerHTML = val;
	if(chk.checked){
		addToTotal(0,opt+pri.innerHTML);
	}
}

function onclickMinus(argument){
	var id = argument.parentNode.dataset.id;
	var ipt = document.getElementById(id + 'ipt');
	if(ipt.value<=1){
		return;
	}
	ipt.value--;
	onItemChange(id,'-');
}

function onclickPlus(argument) {
	// body...
	var id = argument.parentNode.dataset.id;
	var ipt = document.getElementById(id + 'ipt');
	ipt.value++;
	onItemChange(id,'+');
}

function setTotal(to,tm) {
	// body...
	totalOrder.innerHTML = to;
	totalMoney.innerHTML = tm;
}

//只有选择框才改变数量，其它只改变金额
function addToTotal(to,tm) {
	// body...
	totalOrder.innerHTML = sum(totalOrder.innerHTML,to);
	totalMoney.innerHTML = sum(totalMoney.innerHTML,tm);
}