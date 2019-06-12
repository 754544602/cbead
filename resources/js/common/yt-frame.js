var first_menu_data='';
var first_menu_data_bak='';
$(function() {
	$yt_common.ytAclCookieKey = 'dynamicKey';
	$yt_common.getUserDataByDynamicKey();
	$yt_common.init();
	//调用顶部导航操作事件
	$yt_common.navFunEvent();
	//调用顶部导航操作
	$yt_common.heardFunEvent();
	
});
//按钮权限存储全局变量
var commonFuncAuth = "";
var $yt_common={
	user_info:{},
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
		});
		/**
		 * 点击事件
		 */
		$("#nav-fun-list li:not(.users-info-li)").off("click").click(function(){
			//判断移动线是否显示
			if($(".li-bak").css("display") == "none"){
				//获取当前li标签偏移左,减去边距60
				var left = $(this).offset().left+30;
				$(".li-bak").css({"left":left,"display":"inline-block"});
			}else{
				var left = $(this).offset().left+30;
				//动画
				$(".li-bak").stop().animate({
					"left" : left + "px"
				},100);
			}
		});
	},
	/**
	 * 
	 * 初始加载方法
	 * 
	 */
	init:function (){
		$("body").append('<div id="pop-modle-alert"></div><div id="pop-modle-bg"></div>');
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
			$("#frame-right-model").css("left",$(window).scrollLeft()*-1+220);
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
		getyitianSSODynamicKey: function() {
			var cookies = document.cookie.split(";");
			var dynamicKey = "";
			if(cookies.length > 0) {
				for(var i = 0; i < cookies.length; i++) {
					var cookie = cookies[i].split("=");
					if($.trim(cookie[0]) == 'yitianSSODynamicKey')
						dynamicKey = unescape(cookie[1]);
				}
			}
			return dynamicKey;
		},
		clearCookie:function(){
		  var date=new Date();
			    date.setTime(date.getTime()-10000);
			    var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
			    if (keys) {
			        for (var i = 0; i < keys.length; i++)
			          document.cookie=keys[i]+"=; expire="+date.toGMTString();
			    }
		},
		/**
		 * 根据Token获取当前登录用户信息
		 */
		getUserDataByDynamicKey: function() {
			var userInfo = {};
			var token = $yt_common.getToken();
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "uniform/user/getUsersDetails",
				async: false,
				success: function(data) {
					console.log(data);
					$yt_common.user_info = data.data;
					//获取当前登录用户,并赋值
					if(data.flag==1){
						window.top.location.href=data.data.ssoVerifyAddress;
					}
					$("#nav-fun-list .logo-user-name").text(data.data.userRealName);
					/*if(data.data.userHeadPictureToCol3!=undefined && data.data.userHeadPictureToCol3!=""){
						$(".users-info-li img").attr("src",data.data.userHeadPictureToCol3)	
					}*/
				}
			});
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
			//window.open($yt_option.indexUrl);
			window.location.href = $yt_option.indexUrl;
		});
		/**
		 * 点击退出按钮操作
		 */
		$(".logout-model").off().on("click",function(){
//			var yitianSSODynamicKey = ;
//			$.ajax({
//				type:"post",
//				url:$yt_option.logoutUrl,
//				data:{
//				},
//				async:true,
//				success:function(){
//					$yt_common.clearCookie();
//					window.location.href = $yt_option.websit_index
//				},
//				error:function(){
//				}
//			});
			$('#frame-right-model').css('z-index','90');
			$yt_alert_Model.alertOne({  
		        alertMsg: "是否注销用户？", //提示信息  
		        confirmFunction: function() { //点击确定按钮执行方法  
					$('.frame-right-model').css('z-index','1000');
					window.location.href = $yt_option.logoutUrl+'?yitianSSODynamicKey='+$yt_common.getyitianSSODynamicKey();
        		}
			 });
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
	},getTreeData :function (data,parentId){
		var me = this;
	    var result = [] , temp;
	    for(var i in data){
	        if(data[i].parentId==parentId){
	            result.push(data[i]);
	            temp = me.getTreeData(data,data[i].pkId);           
	            if(temp.length>0){
	                data[i].children=temp;
	            }           
	        }       
	    }
	    return result;
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
   				$("#nav-resource").empty().append('<ul id="system-menu"></ul>');
   				$.each(data.data.children, function(i,n) {
   					//判断是系统还是菜单,menu:菜单   system:系统
   					if(n.type == "system"){
   						sysMenu = $('<li class="system-menu-li"><div class="menu-fun-element"></div>'+
	   					'<div class="system-menu menu-element"><div class="system-menu-img-model">'+
	   					'<img src="'+(n.logoUrl == undefined ? "" : n.logoUrl)+'">'+
	   					'</div>'+
	   					'<div class="system-menu-name" title="'+n.menuName+'">'+n.menuName+'</div>'+
	   					'</div>'+
	   					'</li>');
	   					//存储数据
	   					if(n.systemCode=='AGNcysi4B8'){
	   						n.leaf = "true"
	   					}
	   					sysMenu.find(".menu-element").data("menuData",n);
	   					//判断是否包含子节点
	   					if(n.leaf == "false"){
							me.getMenuData(n.children,sysMenu);
	   					}
	   					$("#system-menu").append(sysMenu);
	   					
   					}
   				});
   				/**
   				 * 
   				 * 一级菜单点击事件
   				 * 
   				 */
   				$(".menu-element").click(function (){
   					//获取循环中存储的数据
   					var menuInfo = $(this).data("menuData");
   					//判断是否包含子节点
   					if(menuInfo.leaf == "true"){
   						$(this).parent().siblings().removeClass("child-check")
   						$(".child-check").removeClass("child-check");
   						$(this).parent().addClass("child-check");
   						$left_menu.switchTab(menuInfo.parentId,menuInfo.menuUrl,menuInfo.pkId,menuInfo.openType,menuInfo.implateType,menuInfo.systemId,menuInfo.systemCode,menuInfo);
   					}else{
   						$(this).parent().siblings().removeClass("system-men-check")
	   					$(this).parent().toggleClass("system-men-check");
   					}
   					
   				});
   				
   				
   				/*取详情页面传过来的参数*/
				if(paramObj.pageUrl != "" && paramObj.pageUrl!=null && paramObj.pageUrl != undefined){
					//获取跳转后指定菜单的url
					var goPageUrl = paramObj.goPageUrl;
					var menuEle = $('[menuurl="'+goPageUrl+'"]');
					var menuInfo = menuEle.data("menuData");
					menuEle.parent().siblings().removeClass("child-check");
					menuEle.parent().addClass("child-check");
					console.log(menuInfo);
					$left_menu.switchTab(menuInfo.parentId,decodeURIComponent(paramObj.pageUrl),menuInfo.pkId,1,menuInfo.implateType,menuInfo.systemId,menuInfo);
					$('.menu'+menuInfo.id).addClass("child-check").parents(".one-menu,.system-menu-li").addClass("system-men-check"); 
				 }else{
				 	/*if (first_menu_data==""){
				 		first_menu_data = first_menu_data_bak;
				 	}*/
				 	
				 	//$left_menu.switchTab(first_menu_data.parentId,first_menu_data.menuUrl,first_menu_data.pkId,first_menu_data.openType,first_menu_data.implateType,first_menu_data.systemId);
   					//$('.menu'+first_menu_data.id).addClass("child-check").parents(".one-menu,.system-menu-li").addClass("system-men-check");
   					$yt_baseElement.showLoading();
   					$("#frame-right-model").addClass("iframe-flow").html('<iframe src="'+$yt_option.websit_index_base+'" name="right" id="rightMain" src="" frameborder="no" scrolling="auto" width="100%" height="100%" allowtransparency="true" style="display: block;"></iframe>');
				 }
   			},error:function(data){
   				console.log('菜单获取失败')
   			}
   		});
   		
	},
	/**
	 * 递归生成菜单
	 * @param {Object} menuData 菜单数据
	 * @param {Object} sysMenu  一级菜单
	 */
	getMenuData :function (menuData,sysMenu){
		var me = this;
		var className = '';
		var menuUl = $('<ul class="menu-list""></ul>');
		var menuNameClass='';
		var paramObj =  $yt_common.GetRequest();
		$.each(menuData, function(i,n) {
			menuNameClass='one-menu-text menu-element';
			className = 'one-menu no-border';
			//判断是否包含子节点
			if(n.leaf == "true"){
				className = 'two-menu leaf-menu menu'+n.id ;
				menuNameClass='menu-element';
				if(first_menu_data==""){
					if(paramObj.defaultSysCode==undefined||paramObj.defaultSysCode==''){
						first_menu_data = n;	
					}else if(n.systemCode==paramObj.defaultSysCode){
						first_menu_data = n;
					}
					
				}
				if(first_menu_data_bak==""){
					first_menu_data_bak = n;
				}
			}
			var childMenu = $('<li class="'+className+'"><div class="menu-fun-element"></div>'+
						'<div class="'+menuNameClass+'"  menuUrl="'+n.menuUrl+'">'+n.menuName+'</div>'+
					'</li>'
				);
				childMenu.find(".menu-element").data("menuData",n);
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
	switchTab:function (menuId,url,twoMenuId,openType,implateType,systemId,systemCode,menuInfo){
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
		//判断系统或菜单的打开方式1:本页面打开  2:新建页面打开
		if(!systemCode){
			if(url.indexOf("?") > -1){
				url = url + "&menuId="+menuId+"&systemId="+systemId;
			}else{
				url = url + "?menuId="+menuId+"&systemId="+systemId;
			}
		}
		if(openType=="2"){
			window.open(url);
			return false;
		}else if(implateType == "2"){//判断菜单或系统的嵌入方式,1:div 2:iframe
			sessionStorage.clear();
			$("#frame-right-model").addClass("iframe-flow").html('<iframe src="'+url+'" name="right" id="rightMain" src="" frameborder="no" scrolling="auto" width="100%" height="100%" allowtransparency="true" style="display: block;"></iframe>');
			$("#rightMain").load(function(){
				$left_menu.accessControlFun(systemId,menuInfo.id);
			})
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
		$left_menu.accessControlFun(systemId,menuId);
	},
	/**
	 * 获取权限控制数据
	 * @param {Object} systemId 系统ID
	 * @param {Object} menuId   菜单ID
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
//		$.ajax({
//			type:"post",
//			url:$yt_option.base_path+'api/index/getFuncListByMenuId',
//			async:false,
//			data:{
//				"dynamicKey":$yt_common.user_info.dynamicKey,
//				"systemId":systemId,
//				"menuId":menuId,
//				"userId":$yt_common.user_info.userId
//			},
//			success:function (data){
				var resultData = ",";
				$.each(document.cookie.replace(/[ ]/g,'').split(';'),function (i,n){
					if(n.split('=')[1]=='0'){
						resultData+=n.split('=')[0]+',';
					}
				});
				commonFuncAuth = resultData;
				//调用权限判断,清除按钮方法
				$left_menu.removeAuth();
//			}
//		});
	},
	locationToMenu :function (param){
	  if(window != top){
      window.parent.$left_menu.locationToMenu(param);
    }else{
      var url = JSON.parse(param).url;
      //进入列表页面
      var menuEle = $('[menuurl="'+url+'"]');
      var menuInfo = menuEle.data("menuData");
      menuEle.parent().siblings().removeClass("child-check")
      menuEle.parent().addClass("child-check");
      $left_menu.switchTab(menuInfo.parentId,menuInfo.menuUrl+"?"+$.param(JSON.parse(param)),menuInfo.pkId,menuInfo.openType,menuInfo.implateType,menuInfo.systemId);
      $(menuEle).addClass("child-check").parents(".one-menu,.system-menu-li").addClass("system-men-check");
    }
		
	},
	/**
	 * 权限判断,清除按钮方法
	 */
	removeAuth:function(){
		$("#rightMain").contents().find("[acl-code]").each(function (i,n){
			var acl_code = ","+$(n).attr("acl-code")+",";
			if(commonFuncAuth.indexOf(acl_code)==-1){
				$(n).remove();
			}
		});
	}
}

