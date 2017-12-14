
function onInitialize(){
	// body...
	var name = window.localStorage.getItem('loginName');
	var items = document.querySelectorAll(".aside .sidebar .nav li");
	[].forEach.call(items, function(item){
		item.addEventListener("click",function(){
			var content = document.querySelector(".content");
			content.innerHTML = this.textContent;
		});
	});
	items = document.querySelectorAll('.aside .sidebar .nav li');
	[].forEach.call(items,function(item){
		item.addEventListener('click',function(){
			Array.prototype.forEach.call(this.parentNode.children,function(child){
				child.classList.remove('active');
			});
			this.classList.add('active');
			var content = document.querySelector('.content');
			content.innerHTML = this.textContent;
		});
	});
	if(name == null){
		window.location.href = 'login.html';
	}
	else{
		//首先查询历史信息，点击了个人信息在进行查询
		queryHistory(name);
		cartNum(name);
	}
}

function createItem(item){
	let orderId = item.orderId;
	let shopId = item.shopId;
	let src = item.img;
	let title = item.title;
	let price = item.shopPrice;
	let num = item.num;
	let total = item.totalMoney;
	let node=`
	<span>订单号: ${orderId}&nbsp;&nbsp;&nbsp;&nbsp;订单时间:暂无记录</span>
	<div class="item">
		<div class="item-body container-fluid">
			<div class="row">
				<div class="col-md-4" style="line-height: 81.82px;">
					<a href="item.detail.html?shopId=${shopId}">
						<img src="${src}" style="width: auto; max-height: 81.82px;" class="col-md-4">
						<span style="display: block;line-height:100%;margin-top:25px;">${title}</span>
					</a>
				</div>
				<div class="col-md-4" style="line-height: 81.82px;">
					<span>￥<span>${price}</span></span>
				</div>
				<div class="col-md-2" style="line-height: 81.82px;">
					<span>${parseInt(total)/parseInt(price)}</span>							
				</div>
				<div class="col-md-2" style="line-height: 81.82px;">
					<span>￥<span>${total}</span></span>
				</div>
			</div>
		</div>
	</div>`;
	return node;
}

function queryHistory(name) {
	// body...
	var url = '/Personal';
	fetch(url,{
		method:'post',
		body:JSON.stringify({
			'action':'history',
			'name':name
		})
	}).then((response)=>{
		return response.json();
	}).then((json)=>{
		var user = document.getElementById('userName');
		user.innerHTML = name;
		var itemBody = document.getElementById('body');
		itemBody.innerHTML = "";
		for(var i = 0;i < json.length - 1; i++){
			itemBody.innerHTML += createItem(json[i]);
		}
	});
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

function createPersonal(item) {
	// body...
}

function queryPersonal(name) {
	// body...
	var url = '/Personal';
	fetch(url,{
		method:'post',
		body:JSON.stringify({
			'action':'personal',
			'name':name
		})
	}).then((response)=>{
		return response.json();
	}).then((json)=>{
		var user = document.getElementById('userName');
		user.innerHTML = name;
		var itemTitle = document.getElementById('title');
		itemTitle.style.display = "none";
		var itemBody = document.getElementById('body');
		itemBody.innerHTML = "";
		for(var i = 0;i < json.length - 1; i++){
			itemBody.innerHTML += createPersonal(json[i]);
		}
	});
}