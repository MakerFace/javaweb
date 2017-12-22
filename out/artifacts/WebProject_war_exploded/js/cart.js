
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
	var name = window.localStorage.getItem('loginName');
	if(name == null){
		//跳转到登录
		window.location.href = 'login.html';
	}
	else{
		fetch('/Cart',{
			method:'post',
			body:JSON.stringify({
				'action':'initialize',
				'name':name
			})
		}).then((response)=>{
			return response.json();
		}).then((json)=>{
			//初始化所有的节点
			var user = document.getElementById('userName');
			user.innerHTML = name;
			user.href='javascript:void(0);';
			user.onclick=function(){
				window.location.href='personal.html';
			}
			var cartMain = document.getElementById('orderHolder');
			var length = json.length - 1;
			for(var i = 0;i < length; i++){
				cartMain.innerHTML += createShop(json[i]);
			}
			document.getElementById('shopNum').innerHTML = length;
		});
		cartNum(name);
	}
}

function createShop(shopItem){
	let shopId=shopItem.shopId;
	let shopName = shopItem.name;
	let shopPrice = shopItem.shopPrice;
	let shopTitle = shopItem.title;
	let shopImg = shopItem.img;
	let goodNum = shopItem.goodNum;
	let node=`
	<div id="orderItem" class="row">
	<div class="ff ff-chk col-sm-1">
	<div class="ff-inner">
	<input class="checkBoxItem" id="${shopId}chk" type="checkbox" name="items[]" value="${shopId}" onchange="selectItem(this)">
	</div>
	</div>
	<div class="ff ff-item col-sm-3">
	<div class="ff-inner">
	<div class="item-pic">
	<a href="javascript:void(0);" onclick="onClickItemDetail(${shopId})" target="_blank" class="makePoint">
	<img src="${shopImg}" style="width: 80px; height: 80px;" alt="" class="itempic">
	</a>
	</div>
	<div class="item-base-info">
	<a href="javascript:void(0);" onclick="onClickItemDetail(${shopId})" target="_blank" title="${shopTitle}" class="item-title" id="${shopId}name">${shopName}</a>
	</div>
	</div>
	</div>
	<div class="ff ff-info col-sm-1">
	<div class="item-props">

	</div>
	</div>
	<div class="ff ff-price col-sm-2">
	<div class="ff-inner">
	<div class="item-price">
	<div class="price-content">
	<div class="price-line"><em class="price-now">￥<span id="${shopId}pri">${shopPrice}</span></em></div>
	</div>
	</div>
	</div>
	</div>
	<div class="ff ff-amount col-sm-3">
	<div class="ff-inner">
	<div class="item-amount" data-id="${shopId}">
	<a href="javascript:void(0);" onclick="onclickMinus(this)">-</a>
	<input type="text" value="${goodNum}" id="${shopId}ipt" class="text text-amount" onchange="onItemChange(${shopId})">
	<a href="javascript:void(0);" onclick="onclickPlus(this)">+</a>
	</div>
	</div>
	</div>
	<div class="ff ff-sum col-sm-1">
	<div class="ff-inner">
	<em tabindex="0" class="itemSum number">￥<span id="${shopId}sum">${parseInt(goodNum)*parseInt(shopPrice)}</span></em>
	<div class="itemLottery"></div>
	</div>
	</div>
	<div class="ff ff-op col-sm-1">
	<div class="ff-inner" data-id="${shopId}">
	<a href="javascript:void(0)" class="makePoint" onclick="delOrder(this)">删除</a>
	</div>
	</div>
	</div>`;
	return node;
}

function cartNum(userName) {
	// body...
	var url = '/Personal';
	fetch(url,{
		method:'post',
		body:JSON.stringify({
			'action':'cartNum',
			'name':userName
		})
	}).then((response)=>{
		return response.json();
	}).then((json)=>{
		var num = document.getElementById('cartCount');
		num.innerHTML = json.cartCount;
		num.style='color: red;';
	});
}

function onClickQuit() {
	// body...	
	var tag = confirm("是否退出");
	if(tag){
		window.localStorage.clear();
		window.location.reload();
	}
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

function onChangeItemNum(id){
	var ipt = document.getElementById(id + 'ipt');
	fetch('/Cart',{
		method:'post',
		body:JSON.stringify({
			'shopId':id,
			'num':ipt.value
		})
	}).then((response)=>{
		return response.json();
	}).then((json)=>{

	});
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


/*这里要写一个json数据，id=商品id的货物要从购物车中删除{
	action:del
	id:id
}*/
function delOrder(argument) {
	// body...
	var id = argument.parentNode.dataset.id;
	var name = document.getElementById(id + 'name').innerHTML;
	var sure = confirm('确定要删除：' + name + '吗？');
	name = window.localStorage.getItem('loginName');
	if(sure){
		//提交删除表单
		var jsonData = {
			'action' : 'del',
			'name':name,
			'id' : id
		}
		subJson(jsonData);
	}
	else{
		//什么都不做
		alert('T_T吓死宝宝了！');
	}
}

//提交删除表单
function delAll() {
	// body...
	var items = document.getElementsByName('items[]');
	var total = 0;
	var name = window.localStorage.getItem('loginName');
	var jsonData = {
		'action':'del',
		'name':name,
		'id':''
	}
	for(var i = 0;i < items.length; i++){
		if(items[i].checked){
			total += sum(total,document.getElementById(items[i].value+'sum').innerHTML);
			jsonData['id'] += items[i].value + ',';
		}
	}
	if(total == 0)
	{
		alert('请至少选择一件商品！');
	}
	else{
		subJson(jsonData);
	}
}

function buy() {
	// body...
	var items = document.getElementsByName('items[]');
	name = window.localStorage.getItem('loginName');
	var total = 0;
	var jsonData = {
		'action' : 'buy',
		'name':name,
		'id':''
	}
	for(var i = 0;i < items.length;i++){
		if(items[i].checked){
			total++;
			jsonData['id'] += items[i].value + ',';
		}
	}
	if(total > 0){
		subJson(jsonData);
	}
	else
	{
		alert('nothing');
	}
}

function subJson(argument) {
	// body...
	alert(JSON.stringify(argument));
	var url = '/Cart';
	fetch(url,{
		method:'post',
		body:JSON.stringify(argument)
	}).then((response)=>{
		return response.json();
	}).then((json)=>{
		if(json.action == 'true')
			window.location.reload();
	});
}