var first_menu_data='';
var first_menu_data_bak='';
$(function() {
	$yt_common.ytAclCookieKey = 'yitianSSODynamicKey';
	//$yt_common.getUserDataByDynamicKey();
	//调用获取用户信息方法
	$yt_common.getUserInfo();
	//调用获取用户详细信息
	$yt_common.getUsersPositions();
	$yt_common.init();
	//调用顶部导航操作事件
	$yt_common.navFunEvent();
	//调用顶部导航操作
	$yt_common.heardFunEvent();
	/**
	 * 调用显示loading方法
	 */
	//$yt_baseElement.showLoading();
	/**
	 * 调用隐藏loading方法
	 */
	//$yt_baseElement.hideLoading();
	//获取页面跳转传输的参数对象
	var requerParameter = $yt_common.GetRequest();
	if(requerParameter && requerParameter.childId !=undefined && requerParameter.childId!="" && requerParameter.systemId != undefined && requerParameter.systemId !=null){
		//调用获取权限控制方法
		$left_menu.accessControlFun(requerParameter.systemId,requerParameter.childId);
	}
	//禁止后退键 作用于Firefox、Opera
	document.onkeypress = forbidBackSpace;
	//禁止后退键  作用于IE、Chrome
	document.onkeydown = forbidBackSpace;
});
//按钮权限存储全局变量
var commonFuncAuth = "";
var $yt_common={
	user_info:{},
	getUsersPositions:{},
	setCookie:{},
	request_params:{},
	common_width:0,//公用宽
	left_width:0,  //左菜单宽度
	html_width:0,  //页面宽度
	/**
	 * 
	 * 计算框架整体间距
	 * 
	 */
	setMainWidth : function (){
		if($(window).width()<this.common_width){
		this.html_width = this.common_width;
		}else{
			this.html_width = $(window).width();
		}
		var left = (this.html_width-1200)/2;
		if(left<0){
			left=0;
		}
		var main_left = this.left_width + left;
		var main_width = this.html_width - main_left;
		console.log("left"+left);
		$(".left-nav").css("left",left);
		$(".main-nav").css({width:main_width,left:main_left,"min-width":main_width});
		$(".head-nav").css({"min-width":this.common_width});
	},
	/**
	 * 
	 * 
	 * 顶部导航操作事件
	 * 
	 * 
	 */
	navFunEvent:function(){
		//鼠标悬浮事件
		$("#nav-fun-list li").mouseover(function(){
			//1.获取隐藏的值
			var navHidVal = $(this).find(".nav-fun-hid").val();
			//2.修改图标
			switch(navHidVal)
			{
			case "index":
			  $(this).find(".nav-fun-icon").attr("src","./resources/images/common/index-icon2.png");
			  break;
			case "address":
			  $(this).find(".nav-fun-icon").attr("src","./resources/images/common/address-list-icon2.png");
			  break;
			case "msg":
			  $(this).find(".nav-fun-icon").attr("src","./resources/images/common/msg-icon2.png");
			break;
			case "set":
			  $(this).find(".nav-fun-icon").attr("src","./resources/images/common/set-icon2.png");
			break;
			case "out":
			 $(this).find(".nav-fun-icon").attr("src","./resources/images/common/logo-out-icon2.png");
			break;
			default:
			 
			}
			//3.添加样式
			$(this).addClass("nav-fun-check");
		});
		//鼠标悬浮事件
		$("#nav-fun-list li").mouseout(function(){
			//1.获取隐藏的值
			var navHidVal = $(this).find(".nav-fun-hid").val();
			//判断是否被点击选中
			if(!$(this).find("div").hasClass("nav-check")){
				//2.修改图标
				switch(navHidVal)
				{
				case "index":
				  $(this).find(".nav-fun-icon").attr("src","./resources/images/common/index-icon1.png");
				  break;
				case "address":
				  $(this).find(".nav-fun-icon").attr("src","./resources/images/common/address-list-icon1.png");
				  break;
				case "msg":
				  $(this).find(".nav-fun-icon").attr("src","./resources/images/common/msg-icon1.png");
				break;
				case "set":
				  $(this).find(".nav-fun-icon").attr("src","./resources/images/common/set-icon1.png");
				break;
				case "out":
				 $(this).find(".nav-fun-icon").attr("src","./resources/images/common/logo-out-icon1.png");
				break;
				default:
				 
				}
				//3.删除样式
				$("#nav-fun-list li").removeClass("nav-fun-check");
			}
		});
		/**
		 * 点击事件
		 */
		$("#nav-fun-list li:not(.users-info-li)").off("click").click(function(){
			$("#nav-fun-list li div").removeClass("nav-check nav-fun-check");
			$(this).find("div").addClass("nav-check nav-fun-check");
			//1.获取隐藏的值
			var navHidVal = $(this).find(".nav-fun-hid").val();
			//2.修改图标
			switch(navHidVal)
			{
			case "index":
			  $(this).find(".nav-fun-icon").attr("src","./resources/images/common/index-icon2.png");
			  break;
			case "address":
			  $(this).find(".nav-fun-icon").attr("src","./resources/images/common/address-list-icon2.png");
			  break;
			case "saosao":
			   //跳转到扫码页面
			   window.open($yt_option.websit_path+"barCode/barCodeBase.html");
			   break;
			case "msg":
			  $(this).find(".nav-fun-icon").attr("src","./resources/images/common/msg-icon2.png");
			break;
			case "set":
			  $(this).find(".nav-fun-icon").attr("src","./resources/images/common/set-icon2.png");
			break;
			case "out":
			 $(this).find(".nav-fun-icon").attr("src","./resources/images/common/logo-out-icon2.png");
			break;
			default:
			}
			//判断移动线是否显示
			/*if($(".li-bak").css("display") == "none"){
				//获取当前li标签偏移左,减去边距60
				var left = $(this).offset().left+30;
				$(".li-bak").css({"left":left,"display":"inline-block"});
			}else{
				var left = $(this).offset().left+30;
				//动画
				$(".li-bak").stop().animate({
					"left" : left + "px"
				},100);
			}*/
		});
	},
	/**
	 * 
	 * 初始加载方法
	 * 
	 */
	init:function (){
		$("body").append('<div id="pop-modle-alert"></div>');
		/*
		 * 
		 * 调用左侧菜单初始化方法
		 * 
		 */
		//$left_menu.init();
		
		/**
		 * 
		 * 头部导航横向滚动监听事件
		 * 
		 */
		$(window).scroll(function (){
			$("#yt-index-head-nav").css("left",$(window).scrollLeft()*-1);
			$("#frame-right-model").css("left",$(window).scrollLeft()*-1+160);
			$(".top-button-list").css("top",$(window).scrollTop()+ 80);
			$(".peoper-list-model").css("top",$(window).scrollTop());
			//选取左侧菜单固定,left值,右侧内容距左的距离减去窗体横向滚动条距离减去左菜单的宽度,减去左菜单的宽度减去左侧菜单与右侧内容间距17像素
			//$("#left-menu-cnt").css("left",$("#yt-index-main-nav").offset().left-$(window).scrollLeft()-$("#left-menu-cnt").width()-17);	
			
		});
		$(window).resize(function(){
			//选取左侧菜单固定,left值,右侧内容距左的距离减去窗体横向滚动条距离减去左菜单的宽度,减去左菜单的宽度减去左侧菜单与右侧内容间距17像素
			//$("#left-menu-cnt").css("left",$("#yt-index-main-nav").offset().left-$(window).scrollLeft()-$("#left-menu-cnt").width()-17);	
		});
	}
	 ,eventStopPageaction:function(){//阻止冒泡
			var e=arguments.callee.caller.arguments[0]||event; 
		     if (e && e.stopPropagation) { 
			  // this code is for Mozilla and Opera
			  e.stopPropagation(); 
			 } else if (window.event) { 
			  // this code is for IE 
			  window.event.cancelBubble = true; 
			 } 
		},
		getToken: function() {
			var cookies = document.cookie.split(";");
			var dynamicKey = "";
			if(cookies.length > 0) {
				for(var i = 0; i < cookies.length; i++) {
					var cookie = cookies[i].split("=");

					if($.trim(cookie[0]) == $yt_common.ytAclCookieKey)
						dynamicKey = unescape(cookie[1]);
				}
			}
			return dynamicKey;
		},
		/**
		 * 根据Token获取当前登录用户信息
		 */
		getUserDataByDynamicKey: function() {
			var userInfo = {};
			var token = $yt_common.getToken();
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "api/index/getUserInfoByDynamicKey",
				async: false,
				data: {
					dynamicKey: token
				},
				success: function(data) {
					$yt_common.user_info = data.data;
					//获取当前登录用户,并赋值
					$("#nav-fun-list .logo-user-name").text(data.data.userRealName);
					//用户头像
					var userPhoto = "./resources/images/common/user-photo-def.png";
					//判断是否有头像
					if(data.data.userHeadPictureToCol3!=undefined && data.data.userHeadPictureToCol3!=""){
						userPhoto = data.data.userHeadPictureToCol3;
						$("#user-photo").attr("src",userPhoto);	
					}else{
						//没有给默认
						$("#user-photo").attr("src",userPhoto);
					}
				}
			});
		},
		/**
		 * 
		 * 获取用户信息
		 * 
		 */
		getUserInfo:function(){
			var userInfo = {};
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "uniform/user/getUsersDetails",
				async: false,
				success: function(data) {
					$yt_common.user_info = data.data;
					//获取当前登录用户,并赋值
					$("#nav-fun-list .logo-user-name").text(data.data.userRealName);
					//用户头像
					/*var userPhoto = "./resources/images/common/user-photo-def.png";
					//判断是否有头像
					if(data.data.userHeadPictureToCol3!=undefined && data.data.userHeadPictureToCol3!=""){
						userPhoto = data.data.userHeadPictureToCol3;
						$("#user-photo").attr("src",userPhoto);	
					}else{
						//没有给默认
						$("#user-photo").attr("src",userPhoto);
					}*/
				}
			});
		},
		/**
		 * 
		 * 调用获取用户详细信息
		 * 
		 */
		getUsersPositions:function(){
			 
//			$.ajax({
//				type: "post",
//					url: "/user/userInfo/getUsersByCompIdToPage",
//				data: {
//					userIds: $yt_common.user_info.userId
//				},
//				async: false,
//				success: function(data) {
//					$yt_common.getUsersPositions = data.data;
//				}
//			});
		},
		setCookie: function(key, value, t) { 
		//存cookie
		
		var oDate = new Date();
		
			oDate.setDate(oDate.getDate() + t);
		
			document.cookie = key + '=' + encodeURIComponent(value) + ';expires=' + oDate.toGMTString()+';path=/;domain=.tcsasac.com';
	
			},
	getParameter: function(name) {
		return $yt_common.request_params[name];
	},
	GetQueryString:function(name){
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = window.location.search.substr(1).match(reg);
	     if(r!=null)return  unescape(r[2]); return null;
	},
	GetRequest:function() {
	   var url = location.search; //获取url中"?"符后的字串   
	   var theRequest = new Object();   
	   if(url !="" && url !=null){
		   	if (url.indexOf("?") != -1) {   
		      var str = url.substr(1);   
		      strs = str.split("&");   
		      for(var i = 0; i < strs.length; i ++) {   
		         theRequest[strs[i].split("=")[0]]=unescape(strs[i].split("=")[1]);   
		      }   
		   }  
	   }
	   return theRequest;   
	},
	/**
	 * 
	 *顶部导航操作
	 * 
	 */
	heardFunEvent:function(){
		/**
		 * 点击首页操作
		 */
		$(".home-model").off().on("click",function(){
			//刷新页面
			window.location.href="index.html";
		});
		/**
		 * 点击退出按钮操作
		 */
		$(".logout-model").off().on("click",function(){
		$yt_common.setCookie($yt_common.ytAclCookieKey, "", 1000); 
			window.location.href=$yt_option.logoutUrl;
		});
	},parentAction :function (param){
		if(param.url && param.funName){
			var dataStr = JSON.stringify(param.data);
			var url = param.url+'?funName='+param.funName+'&param='+dataStr;
			var iframes = document.getElementById('myfarme');
			if(iframes){
				document.getElementsByTagName("body")[0].removeChild(iframes);	
			}
		
			var iframe = document.createElement("iframe");
			iframe.id = "myfarme";
			iframe.style.display = 'none';
			document.getElementsByTagName("body")[0].appendChild(iframe);
			document.getElementById('myfarme').src=url; 
		}
	}
}
/**
 * 
 * 左侧菜单数据显示
 * 
 */
var  $left_menu={
	menuId:"",
	twoMenuId:"",
	init:function (){
		var me = this;
		/**
		 * 判断当前浏览器
		 */
		var contentType ="application/x-www-form-urlencoded; charset=utf-8";
		if(window.XDomainRequest){
			contentType = "text/plain";
		} //for IE8,IE9
   		var systemId = $("#yt-index-head-sys select").val();
   		/**
   		 * 
   		 * 判断当前是自定义的菜单数据;还是访问后台获取
   		 * $yt_option.is_test   值为true代表自定义数据
   		 * $yt_option.is_test   值为false代表请求后台数据
   		 * 
   		 */
   		var paramObj =  $yt_common.GetRequest();
   		$.ajax({
   			type:"get",
   			url:$yt_option.menu_path,
   			async:true,
   			success:function(data){
   				var sysMenu = '';
   				var menuImgUrl = "";
   				//清空左侧菜单内容,追加ul标签
   				$("#nav-resource").empty().append('<ul id="system-menu"></ul>');
   				//遍历返回数据
   				$.each(data.data.children, function(i,n) {
   					//判断菜单图标是否有值,没有赋值默认图标
   					if(n.logoUrl == "" || n.logoUrl == undefined || n.logoUrl == null){
   						menuImgUrl = $yt_option.websit_path+"resources/images/test/menu-test.png";
   					}else{
   						menuImgUrl = n.logoUrl;
   					}
   					//判断是系统还是菜单,menu:菜单   system:系统
   					/*if(n.type == "system"){
   						sysMenu = $('<li class="system-menu-li"><div class="menu-fun-element"></div>'+
	   					'<div class="system-menu menu-element"><div class="system-menu-img-model">'+
	   					'<img src="'+menuImgUrl+'">'+
	   					'</div>'+
	   					'<div class="system-menu-name" title="'+n.menuName+'">'+n.menuName+'</div>'+
	   					'<div class="system-open"><img src="./resources/images/common/one-menu-open-icon.png" class="mCS_img_loaded"></div></div>'+
	   					'</li>');
	   					//存储数据
	   					sysMenu.find(".menu-element").data("menuData",n);
	   					//判断是否包含子节点
	   					if(n.leaf == "false"){
	   						me.getMenuData(n.children,sysMenu);
	   					}
	   					$("#system-menu").append(sysMenu);
   					}*/
   					//拼接一级菜单
   					sysMenu = $('<li class="system-menu-li"><div class="menu-fun-element"></div>'+
	   					'<div class="system-menu menu-element"><div class="system-menu-img-model">'+
	   					'<img src="'+menuImgUrl+'">'+
	   					'</div>'+
	   					'<div class="system-menu-name" title="'+n.menuName+'">'+n.menuName+'</div>'+
	   					'<div class="system-open"><img src="./resources/images/common/one-menu-open-icon.png" class="mCS_img_loaded"></div></div>'+
	   					'</li>');
	   					//存储菜单信息数据
	   					sysMenu.find(".menu-element").data("menuData",n);
	   					//判断是否是根节点,true是,false不是
	   					if(n.leaf == "false"){
	   						//调用获取子级方法,传输子级数据信息和当前拼接的一级菜单对象
	   						me.getMenuData(n.children,sysMenu);
	   					}
	   					//追加拼接的一级菜单对象
	   					$("#system-menu").append(sysMenu);
   				});
   				/**
   				 * 
   				 * 菜单点击事件
   				 * 
   				 */
   				$(".menu-element").click(function (){
   					//获取当前菜单的数据信息
   					var menuInfo = $(this).data("menuData");
   					//判断是否是根节点
   					if(menuInfo.leaf == "true"){
   						//删除子级选中效果
   						$(".menu-element,.leaf-menu").removeClass("child-check");
   						//给子级菜单添加选中样式
   						$(this).parent().siblings().removeClass("child-check");
   						$(this).parent().addClass("child-check");
   						//判断地址不为空进行页面跳转
   						/*if(menuInfo.menuUrl != "" && menuInfo.menuUrl !=" " && menuInfo.menuUrl !=null && menuInfo.menuUrl !=undefined){
   							$left_menu.switchTab(menuInfo.parentId,menuInfo.menuUrl,menuInfo.pkId,menuInfo.openType,menuInfo.implateType,menuInfo.systemId);
   						}else{
   							$left_menu.switchTab(menuInfo.parentId,$yt_option.websit_path+"resources/images/common/develop-page.png",menuInfo.pkId,menuInfo.openType,menuInfo.implateType,menuInfo.systemId);
   						}*/
   						
   						$left_menu.switchTab(menuInfo.parentId,menuInfo.menuUrl,menuInfo.pkId,menuInfo.openType,menuInfo.implateType,menuInfo.systemId);
   					}else{
   						//删除子级菜单选中的效果
   						$(this).parent().siblings().removeClass("child-check");
   						//给一级菜单添加选中样式
   						$(this).parent().siblings().removeClass("system-men-check")
	   					$(this).parent().toggleClass("system-men-check");
   					}
   				});
   				/*取详情页面传过来的参数*/
				if(paramObj.pageUrl != "" && paramObj.pageUrl!=null && paramObj.pageUrl != undefined){
					//获取跳转后指定菜单的url
					var goPageUrl = paramObj.goPageUrl;
					//根据跳转页面路径查找到对应菜单
					var menuEle = $('[menuurl="'+goPageUrl+'"]');
					//得到菜单数据对象
					var menuInfo = menuEle.data("menuData");
					//给子级菜单添加样式
					menuEle.parent().siblings().removeClass("child-check");
					menuEle.parent().addClass("child-check");
					console.log(menuInfo);
					//调用跳转页面方法
					$left_menu.switchTab(menuInfo.parentId,decodeURIComponent(paramObj.pageUrl),menuInfo.pkId,1,menuInfo.implateType,menuInfo.systemId);
					//找到对应子级的一级添加选中样式
					$('.menu'+menuInfo.id).addClass("child-check").parents(".one-menu,.system-menu-li").addClass("system-men-check");
				 }else if(paramObj.menuId !="" && paramObj.menuId !=undefined && paramObj.systemId !="" && paramObj.systemId !=undefined && paramObj.childId !="" && paramObj.childId !=undefined){
				 	//特殊情况展开指定的菜单项,获取传输的参数menuId和systemId,childId,找到指定的菜单对象数据
   					var menuInfo;
   					//是否检测到标识
   					var isCheck = false;
   					//遍历所有的菜单
   					$(".menu-element").each(function(){
   						//得到数据对象
   						menuInfo = $(this).data("menuData");
   						//比对找到对应的菜单对象
   						if(menuInfo.pkId == paramObj.childId && menuInfo.systemId == paramObj.systemId){
   							//调用跳转页面方法
	   						$left_menu.switchTab(menuInfo.parentId,menuInfo.menuUrl,menuInfo.pkId,menuInfo.openType,menuInfo.implateType,menuInfo.systemId);
	   						//设置菜单选中
	   						$('.menu'+paramObj.childId).siblings().removeClass("child-check");
	   						//清除一级菜单样式
	   						$("li.system-menu-li").removeClass("system-men-check");
	   						$('.menu'+paramObj.childId).addClass("child-check").parents(".one-menu,.system-menu-li").addClass("system-men-check");
	   						
	   						//设置滚动条滚动到指定的菜单位置
	   						//调用滚动条方法
	   						$("#left-menu-cnt").mCustomScrollbar({
								autoHideScrollbar: true,
								theme: "square"
							});
	   						var  scrollTopVal =0;
	   						//获取当前菜单父级菜单距离顶部的距离减去顶部导航高度
							scrollTopVal = $('.menu'+paramObj.childId).parents(".system-menu-li").offset().top-82;
							$("#left-menu-cnt .mCSB_container").css("top","-"+scrollTopVal+"px");
	   						isCheck = true;
	   						return false;
   					 	}else{
   					 		//未检测到,赋值标识为false
   					 		isCheck = false;
   					 	}
   					 	//如果没有检测到则,默认显示第一个模块下的第一个菜单
   					 	if(!isCheck){
   					 		if(first_menu_data==""){
						 		first_menu_data = first_menu_data_bak;
						 	}
						 	$left_menu.switchTab(first_menu_data.parentId,first_menu_data.menuUrl,first_menu_data.pkId,first_menu_data.openType,first_menu_data.implateType,first_menu_data.systemId);
		   					$('.menu'+first_menu_data.id).addClass("child-check").parents(".one-menu,.system-menu-li").addClass("system-men-check");
   					 	}
   					});
				 }else{
				 	//默认显示第一个模块下的第一个菜单
				 	/*if(first_menu_data==""){
				 		first_menu_data = first_menu_data_bak;
				 	}*/
				 	//$left_menu.switchTab(first_menu_data.parentId,first_menu_data.menuUrl,first_menu_data.pkId,first_menu_data.openType,first_menu_data.implateType,first_menu_data.systemId);
   					//$('.menu'+first_menu_data.id).addClass("child-check").parents(".one-menu,.system-menu-li").addClass("system-men-check");
				    
				    //先阶段给出默认选中的是收支模块里申请,事前申请,差旅费报销申请
				   // $left_menu.switchTab(558,$yt_option.websit_path+"view/system-sasac/expensesReim/module/busiTripApply/busiTripApply.html",511,1,2,55);
					//$('.menu511').addClass("child-check").parents(".one-menu,.one-menu-text,.system-menu-li").addClass("system-men-check");
				 }
   			},error:function(data){
   				console.log('菜单获取失败');
   			}
   		});
   		
	},
	/**
	 * 递归生成菜单
	 * @param {Object} menuData 菜单数据
	 * @param {Object} sysMenu  拼接的一级菜单html
	 */
	getMenuData:function(menuData,sysMenu){
		var me = this;
		var className = '';
		//创建一个ul对象
		var menuUl = $('<ul class="menu-list""></ul>');
		var menuNameClass='';
		var paramObj =  $yt_common.GetRequest();
		//遍历菜单数据
		$.each(menuData, function(i,n) {
			//二级菜单样式
			menuNameClass='one-menu-text menu-element';
			//二级菜单初始默认类样式
			className = 'one-menu no-border';
			//判断是不是根节点
			if(n.leaf == "true"){
				className = 'two-menu leaf-menu menu'+n.id;
				menuNameClass='menu-element';
				/*if(first_menu_data==""){
					first_menu_data = n;
				}*/
				if(first_menu_data == ""){
					if(paramObj.defaultSysCode == undefined || paramObj.defaultSysCode == ''){
						first_menu_data = n;	
					}else if(n.systemCode == paramObj.defaultSysCode){
						first_menu_data = n;
					}
					
				}
			}
			if(first_menu_data_bak==""){
				first_menu_data_bak = n;
			}
			//拼接子级菜单
			var childMenu = $('<li class="'+className+'"><div class="menu-fun-element"></div>'+
						'<div class="'+menuNameClass+'" menuUrl="'+n.menuUrl+'" title="'+n.menuName+'">'+n.menuName+'</div>'+
					'</li>'
				);
				childMenu.find(".menu-element").data("menuData",n);
				//判断当前对象是否是根节点
				if(n.leaf == "false"){
					me.getMenuData(n.children,childMenu);
				}
				menuUl.append(childMenu);
		});
		sysMenu.append(menuUl);
	},
	/**
	 * 左侧菜单点击切换页面方法
	 * @param {Object} menuId   一级菜单ID
	 * @param {Object} url      页面路径
	 * @param {Object} twoMenuId  二级菜单ID
	 * @param {Object} openType    打开页面方式 (1:本页面打开 2:新建页面打开)
	 * @param {Object} implateType    页面嵌套方式 (1:div  2:iframe)
	 * @param {Object} systemId    系统Id
	 */
	switchTab:function (menuId,url,twoMenuId,openType,implateType,systemId){
		/**
		 * 删除导航栏,选中的效果
		 */
		$("#yt-index-head-nav #nav-fun-list li div").removeClass("nav-check");
		//改变首页导航的图标
		$("#yt-index-head-nav #nav-fun-list li:eq(0) div img").attr("src","./resources/images/common/index-icon1.png");
		
		//判断url是否为空
		if(url == "" || $.trim(url).length <=0 || url == undefined || url == null){
			url = $yt_option.websit_path + "resources/images/common/develop-page.png";
		    var  iframeStr = '<iframe name="right" id="rightMain" src="" frameborder="no" scrolling="auto" width="100%" height="100%" allowtransparency="true" style="display: block;">'
			               + '</iframe>';
			$("#frame-right-model").addClass("iframe-flow").html(iframeStr);
			//拼接div存放截图
			$("#rightMain").contents().find("body").css("background","#FFFFFF").html('<div style="text-align: center;padding-top:150px;"><img src="'+url+'" /></div>');
		   //调用获取权限控制方法
			$left_menu.accessControlFun(systemId,twoMenuId);
		   return false;
		}
		/**
		 * 调用显示loading方法
		 */
		$yt_baseElement.showLoading();
		$left_menu.menuId = menuId;
		$left_menu.twoMenuId = twoMenuId;
		/**
		 * 调用隐藏loading方法
		 */
		$yt_baseElement.hideLoading();
		
		//给跳转路径拼接参数menuId父级菜单id,systemId系统id,childId当前菜单id,isMenu是否是菜单1是2不是
		//调用ajax,存入当前访问菜单信息
		$.ajax({
			type:"post",
			url:$yt_option.base_path + "login/recordMenu",
			async:false,
			data:{menuUrl:url,menuId:menuId,systemId:systemId,childId:twoMenuId,isMenu:1},
			success:function (data){
			}
		});
		
		if(url.indexOf("?") > -1){
			url = url + "&menuId="+menuId+"&systemId="+systemId+"&childId="+twoMenuId+"&isMenu=1"+"&CDT="+new Date().getTime();
		}else{
			url = url + "?menuId="+menuId+"&systemId="+systemId+"&childId="+twoMenuId+"&isMenu=1"+"&CDT="+new Date().getTime();
		}
		
		
		/**
		 * 检索判断是否是上传的原型截图,拼接新的内容
		 */
		if(url.indexOf("imgFlag") > -1){
			var  iframeStr = '<iframe name="right" id="rightMain" src="" frameborder="no" scrolling="auto" width="100%" height="100%" allowtransparency="true" style="display: block;">'
			               + '</iframe>';
			$("#frame-right-model").addClass("iframe-flow").html(iframeStr);
			//拼接div存放截图
			$("#rightMain").contents().find("body").css("background","#FFFFFF").html('<div style="min-width:1280px;"><img style="width:100%" src="'+url+'" /></div>');
			return false;
		}
		
		
		//判断系统或菜单的打开方式1:本页面打开  2:新建页面打开
		if(openType=="2"){
			window.open(url);
			return false;
		}else if(implateType == "2"){//判断菜单或系统的嵌入方式,1:div 2:iframe
			$("#frame-right-model").addClass("iframe-flow").html('<iframe src="'+url+'" name="right" id="rightMain" src="" frameborder="no" scrolling="auto" width="100%" height="100%" allowtransparency="true" style="display: block;"></iframe>');
			return false;
		}
		
		//判断传输的url路径
		if(url.indexOf("http://")!=0){
			url = $yt_option.websit_path+url;
		}
		 $yt_common.request_params = new Object();
		//截取url路径
		if (url.indexOf("?") != -1) {
	        var str = url.substr(url.indexOf("?")+1);
	        strs = str.split("&");
	        for(var i = 0; i < strs.length; i ++) {
	            $yt_common.request_params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
	        }
	    }else{
	    	$yt_common.request_params = {};
	    }
		$("#frame-right-model").html("");
		
		//走ajax跳转页面
		$.ajax({
			type:"get",
			url:url,
			async:false,
			success:function (data){
				data = data.replace(/YTVERSIONCODE/g,'versionCode='+$yt_option.version_code)
				$("#frame-right-model").removeClass("iframe-flow").html('<div id="yt-index-main-nav" style="">'+data+'</div>');
				$(window).scrollTop(0);
			}
		});
		//算取页面高度
		var divMinHei = $(window).height();
		$(".web-criterion-model").css("min-height", divMinHei);
		//调用获取权限控制方法
		$left_menu.accessControlFun(systemId,twoMenuId);
	},
	/**
	 * 获取权限方法
	 * @param {Object} systemId
	 * @param {Object} menuId
	 */
	accessControlFun:function(systemId,menuId){
		var  getParmaObj = $yt_common.GetRequest();
		if(systemId == undefined){
			systemId = getParmaObj.systemId;
		}
		if(menuId == undefined){
			menuId = getParmaObj.menuId;
		}
		//调用权限控制接口
		$.ajax({
			type:"post",
			url:$yt_option.base_path+'api/index/getFuncListByMenuId',
			async:false,
			data:{
				"dynamicKey":$yt_common.user_info.dynamicKey,
				"systemId":systemId,
				"menuId":menuId
			},
			success:function (data){
				var resultData = ",";
				$.each(data.data,function (i,n){
					resultData+=n.funcCode+',';
				});
				commonFuncAuth = resultData;
				//调用权限判断,清除按钮方法
				$left_menu.removeAuth();
			}
		});
	},
	locationToMenu:function (param){
		var url = JSON.parse(param).url;
		//进入列表页面
		var menuEle = $('[menuurl="'+url+'"]');
		var menuInfo = menuEle.data("menuData");
		$(".child-check").removeClass("child-check");
		$(".system-men-check").removeClass("system-men-check");
		menuEle.parent().addClass("child-check").parents(".one-menu,.system-menu-li").addClass("system-men-check");
		$left_menu.switchTab(menuInfo.parentId,menuInfo.menuUrl+"?"+$.param(JSON.parse(param)),menuInfo.pkId,menuInfo.openType,menuInfo.implateType,menuInfo.systemId);
	},
	/**
	 * 权限判断,清除按钮方法
	 */
	removeAuth:function(){
		$("[acl-code]").each(function (i,n){
			var acl_code = ","+$(n).attr("acl-code")+",";
			if(commonFuncAuth.indexOf(acl_code)==-1){
				$(n).remove();
			}
		});
	}
}

/**
 * @author yeyuling
 * Date 2019-03-13
 * @method 处理键盘事件 禁止后退键（Backspace）密码或单行、多行文本框除外
 * @param {Object} e
 */
function forbidBackSpace(e) {
    var ev = e || window.event; //获取event对象 
    var obj = ev.target || ev.srcElement; //获取事件源 
    var t = obj.type || obj.getAttribute('type'); //获取事件源类型 
    //获取作为判断条件的事件类型 
    var vReadOnly = obj.readOnly;
    var vDisabled = obj.disabled;
    //处理undefined值情况 
    vReadOnly = (vReadOnly == undefined) ? false : vReadOnly;
    vDisabled = (vDisabled == undefined) ? true : vDisabled;
    //当敲Backspace键时，事件源类型为密码或单行、多行文本的， 
    //并且readOnly属性为true或disabled属性为true的，则退格键失效 
    var flag1 = ev.keyCode == 8 && (t == "password" || t == "text" || t == "textarea" || t == "number") && (vReadOnly == true || vDisabled == true);
    //当敲Backspace键时，事件源类型非密码或单行、多行文本的，则退格键失效 
    var flag2 = ev.keyCode == 8 && t != "password" && t != "text" && t != "textarea" && t != "number";
    //判断 
    if (flag2 || flag1) return false;
}
