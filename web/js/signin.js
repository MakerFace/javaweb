
function onClickSubmit() {
    var logFrom = document.getElementById("loginForm");
    var url = "/SignIn";
    fetch(url,{
        method:'post',
        body:JSON.stringify({
            name:logFrom.logname.value,
            password:logFrom.logpass.value
        })
    }).then((response)=>{
        return response.json();
    })
    .then((jsonfile)=>{
        if(jsonfile.login == 'false')
        {
            alert('登录失败，账号、密码错误！');
        }
        else
        {
            window.location.href = jsonfile.login;
            return false;
        }
    });
}