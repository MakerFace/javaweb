
function onLoad() {
	// body...
	var url = '/OnMainLoad';
	fetch(url,{
		method:'post'
	}).then((response)=>{
		return response.json();
	}).then((json)=>{
		//最后一个数据是load:bool
		var length = json.length - 1;
		var num = 1;
		if(json[length].loginName == null){
				/*<a href="login.html" class="navbar-brand">登录</a>
				<a href="signup.html" class="navbar-brand">注册</a>*/
				var navLeft = document.getElementById('navLeft');
				var aLogin = document.createElement('a');
				var aSignup = document.createElement('a');
				aLogin.href = 'login.html';
				aLogin.className = 'navbar-brand';
				aLogin.innerHTML = '登录';
				aSignup.href = 'signup.html';
				aSignup.className = 'navbar-brand';
				aSignup.innerHTML = '注册';
				navLeft.appendChild(aLogin);
				navLeft.appendChild(aSignup);
			}
			else{
				var navLeft = document.getElementById('navLeft');
				var aLogin = document.createElement('a');
				var aSignup = document.createElement('a');
				aLogin.href = '#';
				aLogin.className = 'navbar-brand';
				aLogin.innerHTML = json[length].loginName;
				aSignup.href = 'javascript:void(0);';
				aSignup.className = 'navbar-brand';
				aSignup.innerHTML = '退出';
				navLeft.appendChild(aLogin);
				navLeft.appendChild(aSignup);
			}
		//添加分类：<a href="#" target="_blank" class="pull-left listitem">松子</a>
		for (var i = 0; i < length;i++) {
			if(json[i].catId == num){
				var p = document.getElementById('class'+num);
				num++;
				
				p.appendChild(addA('_blank','pull-left listitem',json[i].shopId,json[i].name));
				i++;
				p.appendChild(addA('_blank','pull-left listitem',json[i].shopId,json[i].name));				
			}
		}
		//添加轮播图图片 <img src="img/杨幂2.jpg" style="width: 500px;height: auto">
		//<div class="carousel-caption"> 杨幂2 </div>
		var counter = 1;
		for (var i = 0;i < length;i++){
			if(json[i].carousel == 1){
				if(counter > 4)
					break;
				var div = document.getElementById('carousel' + counter);
				counter++;

				div.appendChild(new addImg(json[i].img,'width: 500px;height: auto'));
				div.appendChild(new addDiv('carousel-caption',json[i].name));
			}
		}

		//<a href="#" target="_top" class="thumbnail part">
		//<img src="img/杨幂40.jpg"></a>

		counter = 1;
		var div = document.getElementById('mainRight');
		var j = 0;
		for (;j<length;j++){
			if(json[j].carousel == 0){
				if(counter > 2)
					break;
				counter ++;
				var node = new addA('_target','thumbnail part',json[j].shopId,'');
				node.appendChild(new addImg(json[j].img,'','',''));
				div.appendChild(node);
			}
		}

		/*
		<div class="panel-body">
			<a href="#" class="col-md-3 shadow">
				<img src="img/background.jpg" class="part img-responsive center-block">
				<span class="item">热销中，小伙伴快来购买吧！以下商品简介：</span>
			</a>
		</div>
		*/
		counter = 0;
		var panel = document.getElementById('panelshop');
		for(;j < length;j++){
			if(json[j].carousel == 1)
				continue;
			if(counter%3 == 0)
			{
				var panelHead = addDiv('panel-heading','有好货');
				var panelBody = addDiv('panel-body','');
				panel.appendChild(panelHead);
				panel.appendChild(panelBody);
			}
			counter++;
			var node = addA('_blank','col-md-3 shadow',json[j].shopId,'');
			var img = addImg(json[j].img,'','part img-responsive center-block','');
			var span = document.createElement('span');
			span.className='item';
			span.innerHTML = json[j].name;
			node.appendChild(img);
			node.appendChild(span);
			panelBody.appendChild(node);
		}
	});
}

function addA(target,className,id,name){
	var node = document.createElement('a');
	node.href = 'javascript:void(0);';
	node.target = target;
	node.className = className;
	node.onclick = function () {
		// body...
		onClickItem(id);
	};
	node.innerHTML = name;
	return node;
}

function addImg(url,style,className,name){
	var node = document.createElement('img');
	node.src = url;
	node.style = style;
	node.className = className;
	return node;
}

function addDiv(className,text){
	var node = document.createElement('div');
	node.innerHTML = text;
	node.className = className;
	return node;
}

function onClickItem(argument) {
	// body...
	url = "/Detail";
	fetch(url,{
		method:'post',
		body:JSON.stringify({
			'shopId':argument
		})
	}).then((response)=>{
		return response.json();
	}).then((json)=>{
		var url = json.detailURL;
		window.location = url;
	});
}