


function samePassword() {
	// body...
	signuform = document.getElementById('signupform');
	if(signuform.signupname.value === ""){
		alert("用户名不能为空");
		signuform.signupname.focus();
		return false;
	}
	else if(signuform.signuppassfirst.value === ""){
		alert("密码不能为空");
		signuform.signuppassfirst.focus();
		return false;
	}
	else if(signuform.signuppassfirst.value !== signuform.signuppasssecond.value){
		alert("两次密码不一致");
		signuform.signuppassfirst.focus();
		return false;
	}
	var url = "/SignUp";
	fetch(url,{
		method:'post',
		body:JSON.stringify({
			name:signuform.signupname.value,
			password:signupform.signuppassfirst.value
		})
	})
	.then((response)=>{
		return response.json();
	})
	.then((jsonfile)=>{
		var result = JSON.stringify(jsonfile);
		alert(result);
	});
}