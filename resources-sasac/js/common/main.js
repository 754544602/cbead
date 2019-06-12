var main={
	pageIndex: 1, //当前页码
	userData:{},
	menuStr:'',
	ytAclCookieKey:'yitianSSODynamicKey',//动态key
	init:function (){
		var me = this;
		//调用获取用户信息方法
		$yt_common.getUserInfo();
		me.getMenuList();
		$(".logo-user-name").text($yt_common.user_info.userName);
		//干教系统获取用户信息
//		main.getUserDataByDynamicKey();
		
		$(".change-password-button").click(function (){
			$("#change-password-box").show();
			//获取弹框对象
			$('#pop-modle-alert').show();
		});
		$("#change-password-box .alert-cancel").click(function (){
			$('#change-password-box').hide();
			$('#pop-modle-alert').hide();
			$("#change-password-box input").val("");
		});
		$("#change-password-box .alert-confirm").click(function (){
			var oldPwd= $(".login-password").val();
			var newPwd= $(".new-password").val();
			var redoNewPwd= $(".redo-new-password").val();
			var validOldPwdResult = main.validOldPwd();
			var validNewPwdResult = main.validNewPwd();
			var validRedoNewPwdResult = main.validRedoNewPwd();
			if(validOldPwdResult&&validNewPwdResult&&validRedoNewPwdResult){
				$.ajax({
					type:"post",
					url: "user/userInfo/updatePassword",
					async:false,
					data:{
						passwordNew:newPwd,
						passwordOld:oldPwd,
					},
					success:function(data){
						if(data.data.success=="0"){
							$yt_alert_Model.prompt("密码修改成功");
							
							$("#change-password-box").hide();
							$("#change-password-box input").val("");
						}else{
							$yt_alert_Model.prompt(data.data.msg);
						}
					}
				});
			}
			
		});
		
		//初始化a跳转事件
		main.toDetail();
		//退出
		main.logout();
		main.getMyToDoInfoListPageByParams(main.pageIndex, '', false, function(total){
			//首次加载调用总数
			$('.backlog-num').text(total);
			//赋值总数
			$yt_controlElement.bubbleFun($('.backlog-num'), true);
		});
	},
	//跳转链接
	toDetail:function(){
		var me = this;
		var pageUrl = '';
		var goPageUrl = '';
		$(".shortcut-div .to-class").on("click",function(){
			if(me.checkMenuState(301)){
				return false;
			}
			
			//我要开班
			goPageUrl ="website/pc/view/manage/theTrainingClass.html";//左侧菜单指定选中的页面路径
			pageUrl = "http://jsh.yitian-tech.com:15656/sasac-train/website/pc/index.html";
			window.open(pageUrl+"?pageUrl="+encodeURIComponent(goPageUrl)+'&goPageUrl='+ goPageUrl);
		});
		$(".shortcut-div .to-apply").on("click",function(){
			//我要审批
			goPageUrl = "view/system-sasac/expensesReim/module/approval/beforehandAppoveList.html";//左侧菜单指定选中的页面路径
			//关闭本窗口
//			window.close();
			//调用公用的打开新页面方法传输参数不需要左侧菜单
			$yt_baseElement.openNewPage(1,goPageUrl,goPageUrl);
		});
		$(".shortcut-div .to-audit").on("click",function(){
			//我的申请
			goPageUrl = "view/system-sasac/expensesReim/module/approval/myApplyList.html";//左侧菜单指定选中的页面路径
			//关闭本窗口
//			window.close();
			//调用公用的打开新页面方法传输参数不需要左侧菜单
			$yt_baseElement.openNewPage(1,goPageUrl,goPageUrl);
		});
		$(".shortcut-div .to-stat").on("click",function(){
			if(me.checkMenuState(379)){
				return false;
			}
			//我的项目
			goPageUrl = "view/projectManagement-sasac/expensesReim/module/approval/myApplyList.html";//左侧菜单指定选中的页面路径
			//调用公用的打开新页面方法传输参数不需要左侧菜单
			$yt_baseElement.openNewPage(1,goPageUrl,goPageUrl);
		});
		$(".memu-div .to-classManagement").on("click",function(){
			if(me.checkMenuState(301)){
				return false;
			}
			//班级管理
			goPageUrl ="website/pc/view/manage/theTrainingClass.html";//左侧菜单指定选中的页面路径
			pageUrl = "http://jsh.yitian-tech.com:15656/sasac-train/website/pc/index.html";
			window.open(pageUrl+"?pageUrl="+encodeURIComponent(goPageUrl)+'&goPageUrl='+ goPageUrl);
		});
		$(".memu-div .to-report").on("click",function(){
			if(me.checkMenuState(305)){
				return false;
			}
			//报道管理
			goPageUrl ="website/pc/view/manage/registerClass.html";//左侧菜单指定选中的页面路径
			pageUrl = "http://jsh.yitian-tech.com:15656/sasac-train/website/pc/index.html";
			window.open(pageUrl+"?pageUrl="+encodeURIComponent(goPageUrl)+'&goPageUrl='+ goPageUrl);
		});
		$(".memu-div .to-attendance").on("click",function(){
			if(me.checkMenuState(308)){
				return false;
			}
			//考勤管理
			goPageUrl ="website/pc/view/manage/attendanceManager.html";//左侧菜单指定选中的页面路径
			pageUrl = "http://jsh.yitian-tech.com:15656/sasac-train/website/pc/index.html";
			window.open(pageUrl+"?pageUrl="+encodeURIComponent(goPageUrl)+'&goPageUrl='+ goPageUrl);
		});
		$(".memu-div .to-charge").on("click",function(){
			if(me.checkMenuState(306)){
				return false;
			}
			//收费管理
			goPageUrl ="website/pc/view/manage/chargeClass.html";//左侧菜单指定选中的页面路径
			pageUrl = "http://jsh.yitian-tech.com:15656/sasac-train/website/pc/index.html";
			window.open(pageUrl+"?pageUrl="+encodeURIComponent(goPageUrl)+'&goPageUrl='+ goPageUrl);
		});
		$(".memu-div .to-scavenging").on("click",function(){
			if(me.checkMenuState(333)){
				return false;
			}
			//扫码管理
			goPageUrl ="website/pc/view/manage/scanCodeManager.html";//左侧菜单指定选中的页面路径
			pageUrl = "http://jsh.yitian-tech.com:15656/sasac-train/website/pc/index.html";
			window.open(pageUrl+"?pageUrl="+encodeURIComponent(goPageUrl)+'&goPageUrl='+ goPageUrl);
		});
		$(".memu-div .to-ticket").on("click",function(){
			if(me.checkMenuState(307)){
				return false;
			}
			//开票管理
			goPageUrl ="website/pc/view/manage/invoiceClass.html";//左侧菜单指定选中的页面路径
			pageUrl = "http://jsh.yitian-tech.com:15656/sasac-train/website/pc/index.html";
			window.open(pageUrl+"?pageUrl="+encodeURIComponent(goPageUrl)+'&goPageUrl='+ goPageUrl);
		});
		$(".memu-div .to-teacher").on("click",function(){
			if(me.checkMenuState(303)){
				return false;
			}
			//教师管理
			goPageUrl ="website/pc/view/manage/lecturerManager.html";//左侧菜单指定选中的页面路径
			pageUrl = "http://jsh.yitian-tech.com:15656/sasac-train/website/pc/index.html";
			window.open(pageUrl+"?pageUrl="+encodeURIComponent(goPageUrl)+'&goPageUrl='+ goPageUrl);
		});
		$(".memu-div .to-curriculum").on("click",function(){
			if(me.checkMenuState(302)){
				return false;
			}
			//课程管理
			goPageUrl ="website/pc/view/manage/courseManager.html";//左侧菜单指定选中的页面路径
			pageUrl = "http://jsh.yitian-tech.com:15656/sasac-train/website/pc/index.html";
			window.open(pageUrl+"?pageUrl="+encodeURIComponent(goPageUrl)+'&goPageUrl='+ goPageUrl);
		});
		$(".memu-div .to-statistics").on("click",function(){
			if(me.checkMenuState(311)){
				return false;
			}
			//统计分析
			goPageUrl ="website/pc/view/manage/statisticsManger.html";//左侧菜单指定选中的页面路径
			pageUrl = "http://jsh.yitian-tech.com:15656/sasac-train/website/pc/index.html";
			window.open(pageUrl+"?pageUrl="+encodeURIComponent(goPageUrl)+'&goPageUrl='+ goPageUrl);
		});
		$(".menu-finance .to-beforehand").on("click",function(){
			if(me.checkMenuState(358)){
				return false;
			}
			//事前申请
			goPageUrl = "view/system-sasac/expensesReim/module/busiTripApply/serveApply.html";//左侧菜单指定选中的页面路径
			//调用公用的打开新页面方法传输参数不需要左侧菜单
			$yt_baseElement.openNewPage(1,goPageUrl,goPageUrl);
		});
		$(".menu-finance .to-expenditure").on("click",function(){
			if(me.checkMenuState(359)){
				return false;
			}
			//支出申请
			goPageUrl = "view/system-sasac/expensesReim/module/reimApply/expenseAccount.html";//左侧菜单指定选中的页面路径
			//调用公用的打开新页面方法传输参数不需要左侧菜单
			$yt_baseElement.openNewPage(1,goPageUrl,goPageUrl);
		});
		$(".menu-finance .to-loan").on("click",function(){
			if(me.checkMenuState(360)){
				return false;
			}
			//借款申请
			goPageUrl = "view/system-sasac/expensesReim/module/loanApply/loanApply.html";//左侧菜单指定选中的页面路径
			//调用公用的打开新页面方法传输参数不需要左侧菜单
			$yt_baseElement.openNewPage(1,goPageUrl,goPageUrl);
		});
		$(".menu-finance .to-budget").on("click",function(){
			if(me.checkMenuState(380)){
				return false;
			}
			//项目预算
			goPageUrl = "view/projectManagement-sasac/expensesReim/module/busiTripApply/serveApply.html";//左侧菜单指定选中的页面路径
			//调用公用的打开新页面方法传输参数不需要左侧菜单
			$yt_baseElement.openNewPage(1,goPageUrl,goPageUrl);
		});
		$(".menu-finance .to-fianl").on("click",function(){
			if(me.checkMenuState(382)){
				return false;
			}
			//项目决算
			goPageUrl = "view/projectManagement-sasac/expensesReim/module/finalApply/finalAccount.html";//左侧菜单指定选中的页面路径
			//调用公用的打开新页面方法传输参数不需要左侧菜单
			$yt_baseElement.openNewPage(1,goPageUrl,goPageUrl);
		});
		$(".menu-finance .to-query").on("click",function(){
			if(me.checkMenuState(389)){
				return false;
			}
			//项目查询
			goPageUrl = "view/projectManagement-sasac/expensesReim/module/query/trainingProQuery.html";//左侧菜单指定选中的页面路径
			//调用公用的打开新页面方法传输参数不需要左侧菜单
			$yt_baseElement.openNewPage(1,goPageUrl,goPageUrl);
		});
		$(".menu-finance .to-budgeting").on("click",function(){
			if(me.checkMenuState(336)){
				return false;
			}
			//预算编制
			goPageUrl = "view/system-sasac/budget/module/expenditure/budgetTableManager.html";//左侧菜单指定选中的页面路径
			//调用公用的打开新页面方法传输参数不需要左侧菜单
			$yt_baseElement.openNewPage(1,goPageUrl,goPageUrl);
		});
		$(".menu-finance .to-adjustment").on("click",function(){
			if(me.checkMenuState(343)){
				return false;
			}
			//预算调整
			goPageUrl = "view/system-sasac/budget/module/approval/budgetApproveList.html";//左侧菜单指定选中的页面路径
			//调用公用的打开新页面方法传输参数不需要左侧菜单
			$yt_baseElement.openNewPage(1,goPageUrl,goPageUrl);
		});
		$(".menu-finance .to-budgetQuery").on("click",function(){
			if(me.checkMenuState(351)){
				return false;
			}
			//预算查询
			goPageUrl = "view/system-sasac/budget/module/expenditure/budgetExecuteQuery.html";//左侧菜单指定选中的页面路径
			//调用公用的打开新页面方法传输参数不需要左侧菜单
			$yt_baseElement.openNewPage(1,goPageUrl,goPageUrl);
		});
	},
	logout:function(){
		//直接退出路径
		$(".logout-button").off().on("click",function(){
//			window.location.href=$yt_option.logoutUrl;
			 
			main.setCookie($yt_common.ytAclCookieKey, "", 1000); 
			
				window.location.href= "http://jsh.yitian-tech.com:15656/acl/website/acl/sso/sasacTrainLoginPC/manageLogin.html?systemCode=t70EgQ2344&systemIndex=http://baoxiao.tcsasac.com/sasac-business/website/main.html";
		});
//		$(".logout-button").click(function() {
//		    $yt_common.clearCookie($yt_common.ytAclCookieKey);
//          $.ajax({
//              type: "post",
//              url: $yt_option.cas_path + "api/sso/loginOut",
//              async: true,
//              data: {
//                  dynamicKey: $yt_common.getToken()
//              },
//              success: function(data) {
//                  $yt_common.prompt(data.msg);
//                  if(data.success == 0) {
//                      setTimeout(function() {
//                          window.location.reload();
//                      }, 500);
//                  }
//              },
//              error: function(data) {
//                  $.$yt_common.prompt("网络问题 ,请稍后重试");
//              }
//          });
//      });
	},
	setCookie: function(key, value, t) { 
		//存cookie
		
		var oDate = new Date();
		
			oDate.setDate(oDate.getDate() + t);
		
			document.cookie = key + '=' + encodeURIComponent(value) + ';expires=' + oDate.toGMTString()+';path=/;domain=.tcsasac.com';
	
			},
	validOldPwd:function(){
		var result = true;
		var oldPwd= $(".login-password").val();
		
		if(oldPwd==""||oldPwd.length>16){
			$(".login-password").next(".error-text").text("请输入十六位以内的原密码").show();
			result = false;
		}
		if(result){
			$(".login-password").next(".error-text").hide();
		}
		return result;
	},
	validNewPwd:function(){
		var result = true;
		var newPwd= $(".new-password").val();
		if(newPwd==""||newPwd.length>16){
			$(".new-password").next(".error-text").text("请输入十六位以内的新密码").show();
			result = false;
		}
		
		if(result){
			$(".new-password").next(".error-text").hide();
		}
		return result;
	},
	validRedoNewPwd:function(){
		var result = true;
		var newPwd= $(".new-password").val();
		var redoNewPwd= $(".redo-new-password").val();
		if(redoNewPwd==""||redoNewPwd.length>16){
			$(".redo-new-password").next(".error-text").text("请输入十六位以内的确认密码").show();
			result = false;
			return  false;
		}
		
		if(newPwd!=redoNewPwd){
			$(".redo-new-password").next(".error-text").text("两次新密码不一致").show();
			result = false;
		}
		
		if(result){
			$(".redo-new-password").next(".error-text").hide();
		}
		return result;
	},getMenuList:function (){
		var me = this;
		$.ajax({
			type:"post",
			url: "/index/getChildMenus",
			async:false,
			success:function(data){
				if(data.flag == 0){
					var menuStr = '';
					$.each(data.data,function (i,n){
						if(menuStr == ''){
							menuStr = ','
						}
						menuStr += n.pkId+',';
					});
					console.log(menuStr);
					me.menuStr = menuStr;
				}else{
					$yt_alert_Model.prompt(data.msg);
				}
				
			}
		});
	},checkMenuState:function (menuId){
		var me = this;
		menuId = ',' + menuId + ',';
		if(me.menuStr.indexOf(menuId) != -1){
			return false;
		}else{
			$yt_alert_Model.prompt('您没有此功能权限');
			return true;
		}
	},
	getMyToDoInfoListPageByParams:function(pageIndex, direction, newLoad, fun){
		//默认倒序排列
		direction = $('.backlog-order input:checked').val();
		$.ajax({
			type:"post",
			url:"index/getMyToDoInfoListPageByParams",
			data:{
				property:'handleTime',
				direction:direction,
				pageIndex:pageIndex,
				pageNum:10
			},
			success:function(data){
				if(data.flag == 0){
					//每成功查询一次更新一次当前页
					main.pageIndex += 1;
					//总条数
					var total = data.data.total;
					if(fun){
						//回调存在时执行
						fun(total); 
					}
				}  
			},
			error:function(){
			}
		});
	}
}
$(function (){
	main.init();
})
