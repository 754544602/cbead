var logoEle  = {
	init:function(){
		//调用登录方法
		logoEle.loginEvent();
	},
	/**
	 * 
	 * 
	 * 登录操作
	 * 
	 */
	loginEvent:function(){
		$("#loginBtn").off().on("click",function(){
			logoEle.loginAction();
		});
		//回车事件
		$('#password').keydown(function(e){
			if(e.keyCode==13){
			 logoEle.loginAction();
			}
		});
		
	},loginAction:function (){
			//验证标识
			var validFlag = true;
			//用户名对象
			var userEle = $("#userName");
			//密码对象
			var pwdEle = $("#password");
			//验证用户名和密码是否为空
			if(userEle.val() == ""){
				userEle.next(".valid-msg").text("请输入用户名");
				$(".users-pwd-valid").text("");
				validFlag = false;
			}else{
				userEle.next(".valid-msg").text("");
			}
			if(pwdEle.val() == ""){
				pwdEle.next(".valid-msg").text("请输入密码");
				$(".users-pwd-valid").text("");
				validFlag = false;
			}else{
				pwdEle.next(".valid-msg").text("");
			}
			if((userEle.val() !="" && userEle.val() != "zhaoxin") || (pwdEle.val() != "" && pwdEle.val() !="000000")){
				$(".users-pwd-valid").text("用户名或密码不正确");
				validFlag = false;
			}else{
				$(".users-pwd-valid").text("");
			}
			//判断验证是否通过
			if(validFlag){
				var pageUrl = 'index.html';
			    window.location.href= $yt_option.websit_path+pageUrl;
			}
		
	}
}
$(function(){
	logoEle.init();
});
