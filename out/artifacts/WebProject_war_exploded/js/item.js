
var shopid;
var name;

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
	AddOrBuy('buy','购买');
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
	AddOrBuy('add','加入购物车');
}

function AddOrBuy(action,infomation){
	var shopname = $("#ff-title").text();
	var count = $("#iptAmount").val();
	var json = {
		method:'post',
		body:JSON.stringify({
			'action':action,
			'shopId':shopid,
			'userName':name,
			'count':count
		})
	};
	sendJson(json,function(){
		alert(infomation + "成功！\n物品：" + shopname + "\n数量：" + count);
		onLoad();
	},function(){
		alert(infomation + "失败！\n物品：" + shopname + "\n数量：" + count);
	});
}

function onLoad() {
	// body...
	shopid = getQueryString('shopId');
    name = window.localStorage.getItem('loginName');
	var json = {
		method:'post',
		body:JSON.stringify({
			'action':'initialize',
			'shopId':shopid
		})
	};
	sendJson(json,loadItem,function(){
		alert('加载失败，请检查网络状况！');
	});
    name = window.localStorage.getItem("loginName");
    if(name == null){
        /*<a href="login.html" class="navbar-brand">登录</a>
        <a href="signup.html" class="navbar-brand">注册</a>*/
        var navLeft = document.getElementById('navLeft');
        var loginLi = document.createElement('li');
        var signupLi = document.createElement('li');
        var aLogin = document.createElement('a');
        var aSignup = document.createElement('a');
        aLogin.href = 'login.html';
        aLogin.innerHTML = '登录';
        aSignup.href = 'signup.html';
        aSignup.innerHTML = '注册';
        navLeft.appendChild(loginLi);
        loginLi.appendChild(aLogin);
        navLeft.appendChild(signupLi);
        signupLi.appendChild(aSignup);
    }
    else{
    	cartNum(name);
        var navLeft = document.getElementById('navLeft');
        var loginLi = document.createElement('li');
        var signupLi = document.createElement('li');
        var aLogin = document.createElement('a');
        var aSignup = document.createElement('a');
        aLogin.href = 'personal.html';
        aLogin.innerHTML = name;
        aSignup.href = 'javascript:void(0);';
        aSignup.onclick = function(){
            onClickQuit();
        };
        aSignup.innerHTML = '退出';
        navLeft.appendChild(loginLi);
        loginLi.appendChild(aLogin);
        navLeft.appendChild(signupLi);
        signupLi.appendChild(aSignup);
    }
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
	});
}

function loadItem(json) {
	// body...
	var img = document.getElementById('ff-item-pic');
	var title = document.getElementById('ff-title');
	var subTitle = document.getElementById('ff-subtitle');
	//两个价格相等就隐藏
	var priceBox = document.getElementById('priceBox');
	var detailPrice = document.getElementById('detailPrice');
	var shopPrice = document.getElementById('promoPrice');
	var stock = document.getElementById('SpanStock');
	img.src = json.img;
	title.innerHTML = json.title;
	subTitle.innerHTML = json.subTitle;
	detailPrice.innerHTML = json.marketPrice;
	shopPrice.innerHTML = json.shopPrice;
	if(json.marketPrice == json.shopPrice)
		priceBox.style='display: none;';
	stock.innerHTML = json.stocks;
}


//发送一个商品id
function sendJson(argument,fun1,fun2) {
	// body...
	var url = '/OnDetailLoad';
	fetch(url,argument)
	.then((response)=>{
		return response.json();
	})
	.then((json)=>{
		//物品详情处理
		if(json.load == 'false')
		{
            fun2();
		}
		else
		{
            fun1(json);
		}
	});
}

//地址栏的参数
function getQueryString(name) { 
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = window.location.search.substr(1).match(reg); 
	if (r != null)
		return unescape(r[2]);
	return null; 
}

function onClickQuit() {
    // body...
    var tag = confirm("是否退出");
    if(tag){
        window.localStorage.clear();
        window.location.reload();
    }
}