var indexObj = {
	pageIndex: 1, //当前页码
	init: function() {
		//获取上次登录时间
		var loginTime = $yt_common.user_info.lastLoginTime;
		if(loginTime == "" || loginTime == null || loginTime == undefined) {
			loginTime = "--";
		}
		$("#login-time").html(loginTime);
		//获取用户信息
		//用户名
		$("#users-name").html($yt_common.user_info.realName);
		//用户的职位
		$("#users-job").html($yt_common.user_info.positionName);
		//调用获取模块信息方法
		indexObj.systemModelList();
		//调用上下页操作方法
		indexObj.prevNextPageEvent();
		//待办事项
		indexObj.setAgendaItems();
		indexObj.showAPPNum();
		//提醒设置
		indexObj.cautionSet();
		//最新版本信息
		indexObj.getNewestVersionInfo();
		//我的申请获取数据
		indexObj.getMyApplyList();
		//我的申请到详情页链接
		//indexObj.myApplyToDetails();
		
		//下拉列表
		$('#settingAlert select').niceSelect();
		//点击修改密码
		$("#update-pwd").click(function(){
			//获取弹出框对象
	    	var updateModel = $(".update-pwd-model");
			//调用显示弹出框方法
			sysCommon.showModel(updateModel);
			//调用算取弹出框位置的方法
			$yt_alert_Model.getDivPosition(updateModel);
			$("#updatePwd").attr("src",$yt_option.update_pwd_path);
		});
		//点击关闭
		$(".update-pwd-model .close-span").click(function(){
			//获取弹出框对象
	    	var updateModel = $(".update-pwd-model");
			//调用显示弹出框方法
			sysCommon.closeModel(updateModel);
		});
		
		//点击版本说明
		$("#versionDescription").click(function(){
			var  versionDesc = $(this).data("verDesc");
			//显示顶部隐藏蒙层
			$("#heard-nav-bak,#pop-modle-alert").show();
			//调用显示全局蒙层的方法
			$yt_baseElement.showMongoliaLayer();
			//显示弹出框
			$(".version-desc-model").show();
			$(".version-desc-cont").html(versionDesc == "" ?"暂无数据":versionDesc);
			$yt_alert_Model.getDivPosition($(".version-desc-model"));
			//隐藏页面滚动条
			$("body").css("overflow","hidden");
		});
		//点击版本说明关闭
		$(".ver-close").click(function(){
			//隐藏顶部隐藏蒙层
			$("#heard-nav-bak").hide();
			$('#pop-modle-alert').hide();
			//调用隐藏全局蒙层的方法
		    $yt_baseElement.hideMongoliaLayer();
		    //显示页面滚动条
			$("body").css("overflow","auto");
			$(".version-desc-cont").html("");
			//隐藏弹出框
			$(".version-desc-model").hide();
		});
	},
	indexQtip:function(logQtipObj){
		//注意：以下配置参数如无特别说明均为默认，使用时只需配置相关参数即可  
        logQtipObj.qtip({  
            // 默认为事件触发时加载，设置为true时，会在页面加载时加载提示 类型：boolean，true, false (默认: false)  
            // prerender: false,  
            // 为提示信息设置id，如设置为myTooltip就可以通过ui-tooltip-myTooltip访问这个提示信息  类型:"String", false (默认: false)  
            // id: false,  
            // 每次显示提示都删除上一次的提示  类型：boolean，true, false (默认: true)  
            // overwrite: true,  
            // 通过元素属性创建提示  如a[title]，把原有的title重命名为oldtitle  类型：boolean，true, false (默认: true)  
            // suppress: true,  
            // 内容相关的设置     
            content: {  
                // 提示信息的内容，如果只设置内容可以直接 content: "提示信息"，而不需要 content: { text: { "提示信息" } }    
                text: function(event,api) {  
                    //var txt = $(this).text();  
                    //return txt || '';  
                    var txt = '';
				    var WorkFlowLogList = [];
				    //获取当前行的日志id
				    var processInstanceId = $(this).parent("span").find('.processInstanceId').val();
				    //调用获取流程日志的接口
				    $.ajax({
				    	type: "post",
					url: "basicconfig/workFlow/getWorkFlowLog",
					async: false,
					data: {
						processInstanceId: processInstanceId
					},
					success: function(data) {
						if(data.data != undefined && data.data != null) {
							WorkFlowLogList = data.data;
						}
						//判断数据是否为空
						if(WorkFlowLogList == null || WorkFlowLogList == undefined) {
							return;
						}
						shomd = "";
						shomd = '<div class="suspension" >';
						var WorkFlowLog;
						for(var i = 0; i < WorkFlowLogList.length; i++) {
							WorkFlowLog = WorkFlowLogList[i];
							/*数据的第一条分为审批中和其他的两种显示日志*/
							if(i == 0) {
							//显示的内容设置
								shomd += '<div class="log-msg-model">'
								      +'<div><div class="first-log-msg"><span class="log-num">'+(WorkFlowLogList.length-i)+'</span></div><span class="user-name">【'+ (WorkFlowLog.taskName == '' ? '' : WorkFlowLog.taskName) +'】'+(WorkFlowLog.userName == "" ? '无' : WorkFlowLog.userName) +'</span><div style="clear:both;"></div></div>'
								      +'<div class="log-line-div" style="'+(i == (WorkFlowLogList.length-1) ? "padding-bottom: 0px;":"padding-bottom: 10px;")+''+(WorkFlowLogList.length == 1?"border:0px;":"")+'"><div style="'+(WorkFlowLogList.length == 1?"border:0px;":"border-bottom: 1px solid #D6E6F3;")+'">'
								      +'<div class="oper-status-model"><label class="log-label-text">操作状态</label><span>：</span><span>'+(WorkFlowLog.operationState == "" ? "无" : WorkFlowLog.operationState)+'</span></div>'
								      +'<div class="oper-time-model"><label class="log-label-text">操作时间</label><span>：</span><span>'+(WorkFlowLog.commentTime == "" ? "无" : WorkFlowLog.commentTime)+'</span></div>';
								      /**
								       *判断操作意见是否为空,为空不显示
								       */
								      if(WorkFlowLog.comment != "" && WorkFlowLog.comment != null && WorkFlowLog.comment != " "){
								      	shomd +='<div class="log-comment-model"><label class="log-label-text">操作意见</label><span>：</span><span class="oper-comment-msg">'+(WorkFlowLog.comment == '' ? '' : WorkFlowLog.comment)+'</span></div>';
								      }
								     shomd +='</div></div>';
		
							} else {
								/*其他人的意见循环,一种格式*/
								shomd += '<div class="log-msg-model">'
								      +'<div><div class="log-msg-def-bak"><span class="log-num">'+(WorkFlowLogList.length-i)+'</span></div><span class="user-name" style="top:0px;">【'+ (WorkFlowLog.taskName == '' ? '' : WorkFlowLog.taskName) +'】'+(WorkFlowLog.userName == "" ? '无' : WorkFlowLog.userName) +'</span><div style="clear:both;"></div></div>'
								      +'<div class="log-line-div" style="'+(i == (WorkFlowLogList.length-1) ? "padding-bottom: 0px;":"padding-bottom: 10px;")+''+( i == (WorkFlowLogList.length-1) ? "border:0px;":"")+'"><div style="'+( i == (WorkFlowLogList.length-1) ? "border:0px;":"border-bottom: 1px solid #D6E6F3;")+'">'
								      +'<div class="oper-status-model"><label class="log-label-text">操作状态</label><span>：</span><span>'+(WorkFlowLog.operationState == "" ? "无" : WorkFlowLog.operationState)+'</span></div>'
								      +'<div class="oper-time-model"><label class="log-label-text">操作时间</label><span>：</span><span>'+(WorkFlowLog.commentTime == "" ? "无" : WorkFlowLog.commentTime)+'</span></div>';
								      /**
								       *判断操作意见是否为空,为空不显示
								       */
								      if(WorkFlowLog.comment != "" && WorkFlowLog.comment != null && WorkFlowLog.comment != " "){
								      	shomd +='<div class="log-comment-model"><label class="log-label-text">操作意见</label><span>：</span><span class="oper-comment-msg">'+(WorkFlowLog.comment == '' ? '' : WorkFlowLog.comment)+'</span></div>';
								      }
								      shomd+='</div></div>';
							}
							shomd += '</div>';
						}
					}
				    });
					return(WorkFlowLogList.length < 1 ? '<span style="color:#999">暂无数据</span>' : shomd); /*设置显示内容*/
                }
            },  
            // 位置相关的设置    
            position: { 
            	// 提示信息的位置    
                // 如提示的目标元素的右下角(at属性)    
                // 对应 提示信息的左上角(my属性)    
                my: 'right top',//提示信息箭头位置
				at: 'left top',//提示信息相对于当前td的位置
				//提示的目标元素，默认为选择器  也可以设置为“mouse”或“event”（在目标的位置触发的工具提示），或一个数组包含一个绝对的X / Y的位置  
				//target: false,
				//提示信息默认添加到的容器   false (默认: document.body)  
				container: false,
				//使提示信息在指定目标内可见，不会超出边界 
				viewport: $('body'),
				adjust: {
					// 提示信息位置偏移
					x: 8,
					y: 8,
					//是否在鼠标悬停时提示 true, false (默认: true)
					mouse: true,
					//是否可以调整提示信息的位置
					resize: true,
					method: 'flip flip'
				},
            },  
            // 隐藏提示的相关设置  参考show  
            hide: {  
                /*在提示框显示时可以进行交互*/
				fixed: true,
				//event:"click"
            },  
            // 样式相关    
            style: {  
                /*自定义提示框类样式 多个类样式以空格分割*/
				classes: 'showmod',
				/*tip插件，箭头相关设置*/
				tip: {
					corner: true,//是否显示箭头
					mimic: false,//定义箭头的角度 如 “right center”默认false 
					width: 10, //箭头的宽度 
					height: 10, //箭头的高度 
					border: true,//是否有边框  
					offset: 0, //确定尖端相对于其当前拐角位置的偏移量 Integer (默认: 0)
				}
            },  
            // 事件对象确定绑定到工具提示的初始事件处理程序  
            events: {  
            	//当工具提示显示由库本身或用户调用适当的切换或显示API方法时被触发 
                show:function (data){
					$(data.target).find(".qtip-content").css("max-height",$('#frame-right-model').height()-200);
				}
            }  
        }); 
	},
	/**
	 *
	 * 悬浮显示app二维码
	 * 
	 */
	showAPPNum: function() {
		$("#appNum").mouseover(function() {
			$("#appNum").css("font-size", "16px");
			$(".app-num-model").show();
		});
		$("#appNum").mouseout(function() {
			$(".app-num-model").hide();
			$("#appNum").css("font-size", "14px");
		});
	},
	/**
	 * 
	 * 
	 * 点击上一页下一页
	 * 
	 */
	prevNextPageEvent: function() {
		//点击上一页
		$(".prev-btn").click(function() {
			if(indexObj.pageNum > 1) {
				indexObj.pageNum = indexObj.pageNum - 1;
			}
			//调用获取模块信息方法
			indexObj.systemModelList(indexObj.pageNum);
		});
		//点击下一页
		$(".next-btn").click(function() {
			indexObj.pageNum = indexObj.pageNum + 1;
			//调用获取模块信息方法
			indexObj.systemModelList(indexObj.pageNum);
		});
	},
	/**
	 * 
	 * 
	 * 获取模块数据
	 * 
	 * 
	 */
	systemModelList: function(pageNum) {

		$.ajax({
			type: "get",
			url: $yt_option.websit_path + "resources/js/testJsonData/systemModel.json",
			async: false,
			data: {},
			success: function(data) {
				if(data.flag == 0) {
					if(data.data.rows.length > 0) {
						//清空ul数据
						$("#modelList").empty();
						var liStr = '';
						$.each(data.data.rows, function(i, n) {
							if(pageNum != undefined) {
								n.modelName = n.modelName + pageNum;
							}
							liStr = '<li>' +
								'<div class="model-logo"><img src="' + n.modelIconUrl + '"/></div>' +
								'<div class="model-name" title="' + n.modelName + '">' + n.modelName + '</div>' +
								'</li>';
							$("#modelList").append(liStr);
						});
					}
				}
			}
		});
	},
	/**
	 * 提醒设置事件
	 */
	cautionSet: function() {
		var me = this;
		//提醒设置按钮点击
		$('#cautionSet').click(function() {
			//显示
			me.showSettingAlert();
		});
		//弹出框确定按钮
		$('#settingConBtn').click(function() {
			//隐藏
			me.hideSettingAlert();
		});
		//弹出框取消按钮
		$('#settingCenBtn').click(function() {
			//隐藏
			me.hideSettingAlert();
		});
		//事项开始隐藏关键字
		$('#matterPrev').click(function() {
			$('#reminderKeyBox').hide();
		});
		//事项状态显示关键字
		$('#matterNext').click(function() {
			$('#reminderKeyBox').css('display', 'table-cell');
		});
		//会议弹框显示
		$('#calendarSet').click(function() {
			me.showCalenAlert();
		});
		//会议弹框隐藏
		/*$('#calenConBtn').click(function() {
			me.hideCalenAlert();
		});*/
		$("#closeIcon").click(function() {
			me.hideCalenAlert();
		});
	},
	/**
	 * 提醒设置弹框显示
	 */
	showSettingAlert: function() {
		//弹框对象
		var settingAlert = $('#settingAlert');
		//父级蒙层
		$yt_baseElement.showMongoliaLayer();
		//子级蒙层
		$('#pop-modle-alert').show();
		//计算定位
		$yt_alert_Model.getDivPosition(settingAlert);
		//弹框
		settingAlert.show();
	},
	/**
	 * 提醒设置弹框关闭
	 */
	hideSettingAlert: function() {
		//弹框对象
		var settingAlert = $('#settingAlert');
		//父级蒙层
		$yt_baseElement.hideMongoliaLayer();
		//子级蒙层
		$('#pop-modle-alert').hide();
		//弹框
		settingAlert.hide();
	},
	/**
	 * 会议安排日历显示
	 */
	showCalenAlert: function() {
		//弹框对象
		var conferenceCalendar = $('#conferenceCalendar');
		//父级蒙层
		$yt_baseElement.showMongoliaLayer();
		//子级蒙层
		$('#pop-modle-alert').show();
		//计算定位
		$yt_alert_Model.getDivPosition(conferenceCalendar);
		//弹框
		conferenceCalendar.show();
	},
	/**
	 * 会议安排日历隐藏
	 */
	hideCalenAlert: function() {
		//弹框对象
		var conferenceCalendar = $('#conferenceCalendar');
		//父级蒙层
		$yt_baseElement.hideMongoliaLayer();
		//子级蒙层
		$('#pop-modle-alert').hide();
		//弹框
		conferenceCalendar.hide();

	},
	/**
	 * 设置待办事项相关
	 */
	setAgendaItems:function(){
		//待办事项窗体
		var backLogModel = $('.backlog-model');
		//滚动条事件
		/*backLogModel.scroll(function() {
			//$(window).scrollTop()这个方法是当前滚动条滚动的距离
			var scrollTop = backLogModel.scrollTop();
			//$(window).height()获取当前窗体的高度
			var backLogHeight = backLogModel.height();
			//$(document).height()获取当前文档的高度
			var wordHeight = backLogModel.find('ul').height();
			var bot = 20; //bot是底部距离的高度
			console.log(bot + scrollTop, wordHeight, backLogHeight);
			if((bot + scrollTop) >= (wordHeight - backLogHeight) ) {
				//当底部基本距离+滚动的高度〉=文档的高度-窗体的高度时；
				//我们需要去异步加载数据了
				//indexObj.setAgendaListData([0,0,0,0,0]);
				//indexObj.getMyToDoInfoListPageByParams(indexObj.pageIndex);
				return false;
			}
		});*/
		//进入加载第一页数据
		indexObj.getMyToDoInfoListPageByParams(indexObj.pageIndex, '', false, function(data){
			//首次加载调用总数
			$('.backlog-num').text(data.total);
			//expenditureTotal：支出申请总条数
      $('#expenditureTotal').text(data.expenditureTotal);
      //accountsTotal：项目决算总条数
      $('#accountsTotal').text(data.accountsTotal);
      //budgetTotal：项目预算总条数
      $('#budgetTotal').text(data.budgetTotal);
      //changeTotal：项目变更总条数
      $('#changeTotal').text(data.changeTotal);
      //otherTotal：其它待办总条数
      $('#otherTotal').text(data.otherTotal);
			//赋值总数
			$yt_controlElement.bubbleFun($('.backlog-num'), true);
			$yt_controlElement.bubbleFun($('#expenditureTotal'), true);
			$yt_controlElement.bubbleFun($('#accountsTotal'), true);
			$yt_controlElement.bubbleFun($('#budgetTotal'), true);
			$yt_controlElement.bubbleFun($('#changeTotal'), true);
			$yt_controlElement.bubbleFun($('#otherTotal'), true);
		});
		//加载更多点击事件
		$('.scroll-load-data span').on('click', function(){
			//查询数据
			indexObj.getMyToDoInfoListPageByParams(indexObj.pageIndex);
		});
		//切换排序方式
		$('.backlog-order .check-label input').on('change', function(){
			indexObj.pageIndex = 1;
			//查询数据
			indexObj.getMyToDoInfoListPageByParams(indexObj.pageIndex, '', true);
		});
		
		$('.backlog-model').on('click', '.approve', function(){
			var ih = $(this);
			//获取id
			var id = ih.attr('pid');
			var processInstanceId = ih.attr('processInstanceId');
			//获取跳转类型
			var code = ih.attr('flowcode');
			//获取流程key
			var taskKey = ih.attr('taskKey');
			var costType = ih.attr('costType');
			//跳转地址
			var urlStr = $yt_option.websit_path;
			//获取选中的菜单信息
			var parentObj = window.parent.document.getElementById("system-menu");
			
			if (taskKey == 'activitiStartTask') {
				if (code == 'ADV_APP_FLOW'||code == 'TRAVEL_APP_FLOW'||code == 'HYSQ_APP_FLOW'||code == 'JDSQ_APP_FLOW') {
					
					if(costType=='TRAIN_APPLY'){
						urlStr = urlStr + 'view/projectManagement-sasac/expensesReim/module/beforehand/beforeApplyDetail.html?advanceId=' + id;
					}else{
						urlStr = urlStr + 'view/system-sasac/expensesReim/module/beforehand/beforeApplyDetail.html?advanceId=' + id;
					}
					
				} else if (code == 'EXP_APP_FLOW'||code=='GHJF_APP_FLOW'||code=='DJJF_APP_FLOW'||code=='SBJF_APP_FLOW'||code=='YJSF_APP_FLOW') {
					//获取菜单信息
					/*var menuEle = $(parentObj).find('.menu-element[menuurl="view/system-sasac/expensesReim/module/approval/expenApplApprList.html"]');
					var iJquery = window.parent.jQuery;  
					var $mydata = iJquery(menuEle);  
					var menuInfo = $mydata.data("menuData");*/
					//urlStr = urlStr + 'view/system-sasac/expensesReim/module/reimApply/expenseDetail.html?appId=' + id+'&childId='+menuInfo.pkId+'&systemId='+menuInfo.systemId;//即将跳转的页面路径
					urlStr = urlStr + 'view/system-sasac/expensesReim/module/reimApply/expenseDetail.html?appId=' + id;//即将跳转的页面路径
				} else if (code == 'LOAN_APP_FLOW') {
					urlStr = urlStr + 'view/system-sasac/expensesReim/module/loanApply/loanApplyDetail.html?processInstanceId=' + processInstanceId + '&loanId=' + id;
				} else if (code == 'CPRJ_APP_FLOW') {
					urlStr = urlStr + 'view/projectManagement-sasac/expensesReim/module/busiTripApply/projectServeDetails.html?advanceAppId=' + id;
				}else if(code == 'FINAL_APP_FLOW') {
					urlStr = urlStr + 'view/projectManagement-sasac/expensesReim/module/reimApply/finalDetail.html?appId=' + id;				
				}else if(code == 'BUD_APP_FLOW') {
					//预算数据申请
					urlStr = urlStr + 'view/system-sasac/budget/module/approval/budgetApply.html?budgetPrjAppId=' + id;
				} else if(code == 'BUDPRJ_APP_FLOW') {
					//预算立项申请
					urlStr = urlStr + 'view/system-sasac/budget/module/projectApproval/projectApplyApproval.html?budgetPrjAppId=' + id;
				}else if(code == 'JBZC_APP_FLOW' || code == 'XMZC_APP_FLOW') {
					//预算立项申请
					urlStr = urlStr + 'view/system-sasac/budget/module/expenditure/budgetFillDetails.html?publishId=' + id;
				}else if(code == 'XMLX_APP_FLOW') {
					//立项审批
					urlStr = urlStr + 'view/system-sasac/budget/module/projectApproval/budgetApplyDetails.html?budgetPrjAppId=' + id;
				}else if(code == 'WLKX_APP_FLOW') {
					//往来款项
					urlStr = urlStr + 'view/system-sasac/expensesReim/module/reimApply/expenseExamine.html?appId=' + id;
				}
			} else {
				if (code == 'ADV_APP_FLOW'||code == 'TRAVEL_APP_FLOW'||code == 'HYSQ_APP_FLOW'||code == 'JDSQ_APP_FLOW') {
					if(costType=='TRAIN_APPLY'){
						urlStr = urlStr+'view/projectManagement-sasac/expensesReim/module/busiTripApply/priorApproval.html?advanceId='+ id;
					}else{
						urlStr = urlStr+'view/system-sasac/expensesReim/module/busiTripApply/priorApproval.html?advanceId='+ id
					}
				} else if (code == 'EXP_APP_FLOW'||code=='GHJF_APP_FLOW'||code=='DJJF_APP_FLOW'||code=='SBJF_APP_FLOW'||code=='YJSF_APP_FLOW'||code == 'YYF_APP_FLOW') {
					//支出申请审批页面
					//获取菜单信息
					var menuEle = $(parentObj).find('.menu-element[menuurl="view/system-sasac/expensesReim/module/approval/expenApplApprList.html"]');
					var iJquery = window.parent.jQuery;  
					var $mydata = iJquery(menuEle);  
					var menuInfo = $mydata.data("menuData");
					urlStr = urlStr  + 'view/system-sasac/expensesReim/module/reimApply/expenseExamine.html?appId=' + id+'&childId='+menuInfo.pkId+'&systemId='+menuInfo.systemId;//即将跳转的页面路径
				} else if (code == 'LOAN_APP_FLOW') {//借款申请
					//获取菜单信息
					var menuEle = $(parentObj).find('.menu-element[menuurl="view/system-sasac/expensesReim/module/approval/loanApprovalList.html"]');
					var iJquery = window.parent.jQuery;  
					var $mydata = iJquery(menuEle);  
					var menuInfo = $mydata.data("menuData");
					urlStr = urlStr + 'view/system-sasac/expensesReim/module/approval/loanApproval.html?loanId=' + id+'&childId='+menuInfo.pkId+'&systemId='+menuInfo.systemId;//即将跳转的页面路径
				} else if (code == 'CPRJ_APP_FLOW') {
					urlStr = urlStr + 'view/system-sasac/expensesReim/module/busiTripApply/projectServeExamine.html?appId=' + id;
				}else if(code == 'FINAL_APP_FLOW') {
					urlStr = urlStr + 'view/projectManagement-sasac/expensesReim/module/reimApply/finalExamine.html?appId=' + id;
				} else if(code == 'BUD_APP_FLOW') {
					//预算数据申请
					urlStr = urlStr + 'view/system-sasac/budget/module/approval/budgetApprove.html?budgetAppId=' + id;
				} else if(code == 'BUDPRJ_APP_FLOW') {
					if (taskKey == 'DEPT_AUDIT' || taskKey == 'CSZY') {
						urlStr = urlStr + 'view/system-sasac/budget/module/projectApproval/projectApplyApproval.html?budgetPrjAppId=' + id + '&draCode=3';
					} else {
						//预算立项申请
						urlStr = urlStr + 'view/system-sasac/budget/module/projectApproval/budgetApplyDetails.html?budgetPrjAppId=' + id;
					}
				} else if(code == 'JBZC_APP_FLOW' || code == 'XMZC_APP_FLOW') {
					//预算审批
					urlStr = urlStr + 'view/system-sasac/budget/module/expenditure/budgetFillDetails.html?publishId=' + id;
				}else if(code == 'XMLX_APP_FLOW') {
					//立项审批
					urlStr = urlStr + 'view/system-sasac/budget/module/projectApproval/budgetApplyDetails.html?budgetPrjAppId=' + id;
				}else if(code == 'WLKX_APP_FLOW') {
					//往来款项
					urlStr = urlStr + 'view/system-sasac/expensesReim/module/reimApply/expenseExamine.html?appId=' + id;
				}
			}
			window.location.href = urlStr; 
		});
	},
	/**
	 * 1.1.1.1	获取我的待办[分页]
	 * @param {Object} property
	 * @param {Object} direction
	 * @param {Object} pageIndex
	 */
	getMyToDoInfoListPageByParams:function(pageIndex, direction, newLoad, fun){
		//默认倒序排列
		direction = $('.backlog-order input:checked').val();
		//切换查询类型
		var typeCode = $('.nav-heard li.active-nav input').val();
		$.ajax({
			type:"post",
			url:"index/getMyToDoInfoListPageByParams",
			dataType: 'json',
			data:{
				property:typeCode,
				direction:direction,
				pageIndex:pageIndex,
				pageNum:10
			},
			success:function(data){
				if(data.flag == 0){
					//每成功查询一次更新一次当前页
					indexObj.pageIndex += 1;
					//总条数
					var total = data.data.total;
					if(fun){
						//回调存在时执行
						fun(data.data); 
					}
					//列表数据
					var rows = data.data.rows;
					if(rows.length >= 10) {
						//隐藏暂无数据
						$('.scroll-not-data').hide();
						//显示加载数据
						$('.scroll-load-data').show();
						indexObj.setAgendaListData(rows, newLoad);
					} else if(rows.length < 10){
						//显示暂无数据
						$('.scroll-not-data').show();
						//隐藏加载数据
						$('.scroll-load-data').hide();
						indexObj.setAgendaListData(rows, newLoad);
					} else {
						//显示暂无数据
						$('.scroll-not-data').show();
						//隐藏加载数据
						$('.scroll-load-data').hide();
						indexObj.setAgendaListData(rows, newLoad);
					}
				} else {
					//显示暂无数据
					$('.scroll-not-data').show();
					//隐藏加载数据
					$('.scroll-load-data').hide();
				}
				
			},
			error:function(){
				//显示暂无数据
				$('.scroll-not-data').show();
				//隐藏加载数据
				$('.scroll-load-data').hide();
			}
		});
	},
	/**
	 * 设置待办事项的数据
	 * @param {Object} list
	 */
	setAgendaListData:function(list, newLoad){
		var lis = '';
		$.each(list, function(i, n) {
			//将审批改为处理
			var content = n.formTitle.replace("审批","处理");
			var costType="";
			if(content.indexOf("预算")>'-1'){
				costType="TRAIN_APPLY";
			}
			lis += '<li> <div> ' 
			+ content 
			+ ' </div> <div class="d-right"> <span style="margin-right: 64px;">' 
			+ n.stagnationTime 
			+ '</span> <span class="font-col approve" style="margin-right: 52px;" pid="' 
			+ n.formId 
			+ '" flowCode="' 
			+ n.flowCode 
			+ '" taskKey="' 
			+ n.taskKey 
			+ '" costType="' 
			+ costType
			+ '" processInstanceId="' 
			+ n.processInstanceId 
			+ '">'
			+(n.taskKey == 'activitiStartTask' ? '处理' : '审批')
			+'</span><span style="margin-right: 6px;"><input type="hidden" class="processInstanceId" value="' 
			+ n.processInstanceId 
			+ '"/><a class="yt-link log-mod" style="color: #179ee8;">日志</a></span> </div> </li>';
			
		});
		//切换排序改为替换代码
		if(newLoad){
			$('.backlog-model ul').html(lis);
		}else{
			$('.backlog-model ul').append(lis);
		}
		//调用提示窗口
		indexObj.indexQtip($(".log-mod"));
	},
	/**
	 * 1.1.2.1	获取最新版本信息
	 */
	getNewestVersionInfo:function(){
		$.ajax({
			type:"post",
			url:"index/getNewestVersionInfo",
			async:true,
			success:function(data){
				if(data.flag == 0){
					//存储版本说明信息
//					$("#versionDescription").text("verDesc",data.data.versionDescription);
//					$('#versionNum').text('产品当前版本号：' + data.data.versionNum);
//					$('#versionTime').text('最近一次升级日期：' + data.data.versionTime);
				}
			}
		});
	},
	/**
	 * 获取我的申请列表数据
	 */
	getMyApplyList: function() {
		var me = this;	
		$('.page1').pageInfo({
			pageIndex: 1,
			pageNum: 5, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url:"sz/applyApp/myApplicationAppInfo", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data:{
				type:'expenditure'
			},// {	},//条件查询数据
			//ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				var htmlTbody = $('#myApply .my-apply-list');
				htmlTbody.empty();
				var trStr  = "";
				if(data.flag == 0){
					var datas = data.data.rows;
					if(datas.length > 0){
						//$('.page1').show();
						//获取公用的不显示流程图的状态字符串
						sysCommon.isWorkFlowStateStr = ','+sysCommon.isWorkFlowStateStr+',';
						$.each(datas,function(i,n) {//index  formType
							trStr += '<tr>'+
								'<td>'+ n.applicantTime +'</td>'+
								'<td><a class="yt-link to-detail">'+ n.appNum +'</a><input type="hidden" class="hid-obj-id" value="' + n.pkId + '"/><input type="hidden" class="processInstanceId" value="'+n.processInstanceId+'"/><input type="hidden" class="hid-obj-type" value="' + n.formType + '"/></td>'+
								'<td style="text-align: left;">'+ n.appName +'</td>'+
								'<td>'+ n.formTypeName +'</td>'+
								'<td style="text-align: right;">'+ $yt_baseElement.fmMoney(n.totalAmount) +'</td>';
								//检索不能显示流程图的状态字符串
								if(sysCommon.isWorkFlowStateStr.indexOf(','+n.workFlowState+',') == -1){
									trStr += '<td style="text-align: left;">'+'<span class="yt-link process-state">'+ n.nodeNowState +'</span>'+'</td>';
								}else{
									trStr += '<td style="text-align: left;">'+n.nodeNowState+'</td>';
								}
								trStr += '</tr>';
						});
						htmlTbody.append(trStr);
					}else{
						$('.page1').hide();
						//拼接暂无数据效果
						htmlTbody.html('<tr style="border:0px;background-color:#fff !important;"><td  colspan="6" align="center"style="border:0px;"><div class="no-data" style="width: 280px;margin: 0 auto;">' +
						'<img src="./resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
						'<img src="./resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
						'</div></td></tr>');
					}
				}
				
			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
		//隐藏分页
		$('.page1').hide();
		//初始化详情跳转链接
		indexObj.myApplyToDetails();
		//我的申请查看更多
		$(".echarts-box .to-myApply").on("click",function(){
			var pageUrl = '';
			pageUrl = "view/system-sasac/expensesReim/module/approval/myApplyList.html";
			//调用公用的打开新页面方法传输参数不需要左侧菜单
			window.location.href = $yt_option.websit_path + pageUrl;
		});
	},
	/**
	 * 我的申请点击编号  查看详情
	 */
	myApplyToDetails: function() {
		$('#myApply .my-apply-list').on('click','.yt-link.to-detail', function() {
			/*调用阻止冒泡方法*/
			$yt_baseElement.eventStopPageaction();
			/*获取流程实例id*/
			var processInstanceId = $(this).parents('tr').find('.processInstanceId').val();
			//获取当前对象ID
			var objId = $(this).parents('tr').find('.hid-obj-id').val();
			//获取当前数据类型
			var objType = $(this).parents('tr').find('.hid-obj-type').val();
			var pageUrl = '';
			var goPageUrl = '';
			/*
			 * 根据类型跳转不同页面
			 * 事前申请: ADVANCE_APP
			报销申请: REIM_APP
			付款申请: PAYMENT_APP
			借款申请: LOAN_APP
			支出：EXPENDITURE_APP
			事前变更：CHANGE_APP*/
			if(objType=='ADVANCE_APP'){
				/*页面跳转打开新页面*/
				pageUrl = "view/system-sasac/expensesReim/module/beforehand/beforeApplyDetail.html?advanceId="+objId;//即将跳转的页面路径
				goPageUrl = "view/system-sasac/expensesReim/module/approval/beforehandApproveList.html";//左侧菜单指定选中的页面路径
			}else if(objType=='REIM_APP'){
				/*页面跳转打开新页面*/
				pageUrl = "view/system-sasac/expensesReim/module/reimApply/reimApplyDetail.html?processInstanceId=" + processInstanceId+"&reimId="+objId;//即将跳转的页面路径
				goPageUrl = "view/system-sasac/expensesReim/module/reimApply/reimApproveList.html";//左侧菜单指定选中的页面路径
			}else if(objType=='PAYMENT_APP'){
				/*页面跳转打开新页面*/
				pageUrl = "view/system-sasac/expensesReim/module/payment/paymentApplyDetail.html?processInstanceId=" + processInstanceId+"&payAppId="+objId;//即将跳转的页面路径
				goPageUrl = "view/system-sasac/expensesReim/module/approval/paymentApprovalList.html";//左侧菜单指定选中的页面路径
			}else if(objType=='LOAN_APP'){
				/*页面跳转打开新页面*/
				pageUrl = "view/system-sasac/expensesReim/module/loanApply/loanApplyDetail.html?processInstanceId=" + processInstanceId+"&loanId="+objId;//即将跳转的页面路径
				goPageUrl = "view/system-sasac/expensesReim/module/approval/loanApprovalList.html";//左侧菜单指定选中的页面路径
			}else if(objType == 'EXPENDITURE_APP'){
				//支出
				pageUrl = "view/system-sasac/expensesReim/module/reimApply/expenseDetail.html?appId="+objId;//即将跳转的页面路径
				goPageUrl = "view/system-sasac/expensesReim/module/approval/expenApplApprList.html";//左侧菜单指定选中的页面路径
			}else if(objType == 'CHANGE_APP'){
				//事前变更
				pageUrl = "view/system-sasac/expensesReim/module/busiTripApply/projectServeDetails.html?advanceAppId="+objId;//即将跳转的页面路径
				goPageUrl = "view/system-sasac/expensesReim/module/approval/projectBefList.html";//左侧菜单指定选中的页面路径
			}
			//调用公用的打开新页面方法传输参数不需要左侧菜单
			$yt_baseElement.openNewPage(2,pageUrl);
		})
	},
	/**
	 * 获取我的项目列表数据
	 */
	getMyProjectList: function() {
		var me = this;	
		$('.page2').pageInfo({
			pageIndex: 1,
			pageNum: 5, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url:"sz/applyApp/myApplicationAppInfo", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data:{
				type:"project"
			},// {	},//条件查询数据
			//ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				var htmlTbody = $('#myProject .my-apply-list');
				htmlTbody.empty();
				var trStr  = "";
				if(data.flag == 0){
					var datas = data.data.rows;
					if(datas.length > 0){
						//$('.page2').show();
						//获取公用的不显示流程图的状态字符串
						sysCommon.isWorkFlowStateStr = ','+sysCommon.isWorkFlowStateStr+',';
						$.each(datas,function(i,n) {//index  formType
							trStr += '<tr>'+
								'<td>'+ n.applicantTime +'</td>'+
								'<td><a class="yt-link to-detail">'+ n.appNum +'</a><input type="hidden" class="hid-obj-id" value="' + n.pkId + '"/><input type="hidden" class="processInstanceId" value="'+n.processInstanceId+'"/><input type="hidden" class="hid-obj-type" value="' + n.formType + '"/></td>'+
								'<td style="text-align: left;">'+ n.appName +'</td>'+
								'<td>'+ n.formTypeName +'</td>'+
								'<td style="text-align: right;">'+ $yt_baseElement.fmMoney(n.totalAmount) +'</td>';
								//检索不能显示流程图的状态字符串
								if(sysCommon.isWorkFlowStateStr.indexOf(','+n.workFlowState+',') == -1){
									trStr += '<td style="text-align: left;">'+'<span class="yt-link process-state">'+ n.nodeNowState +'</span>'+'</td>';
								}else{
									trStr += '<td style="text-align: left;">'+n.nodeNowState+'</td>';
								}
								trStr += '</tr>';
						});
						htmlTbody.append(trStr);
					}else{
						$('.page2').hide();
						//拼接暂无数据效果
						htmlTbody.html('<tr style="border:0px;background-color:#fff !important;"><td  colspan="6" align="center"style="border:0px;"><div class="no-data" style="width: 280px;margin: 0 auto;">' +
						'<img src="./resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
						'</div></td></tr>');
					}
				}
				
			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
		//隐藏分页
		$('.page2').hide();
		//初始化详情跳转链接
		indexObj.myProjectToDetails();
		//我的项目查看更多
		$(".echarts-box .to-myProject").on("click",function(){
			var pageUrl = '';
			pageUrl = "view/projectManagement-sasac/expensesReim/module/approval/myApplyList.html";
			//调用公用的打开带左侧栏
			window.location.href = $yt_option.websit_path + pageUrl;
		});
	},
	/**
	 * 我的项目点击编号  查看详情
	 */
	myProjectToDetails: function() {
		$('#myProject .my-apply-list').on('click','.yt-link.to-detail', function() {
			/*调用阻止冒泡方法*/
			$yt_baseElement.eventStopPageaction();
			/*获取流程实例id*/
			var processInstanceId = $(this).parents('tr').find('.processInstanceId').val();
			//获取当前对象ID
			var objId = $(this).parents('tr').find('.hid-obj-id').val();
			//获取当前数据类型
			var objType = $(this).parents('tr').find('.hid-obj-type').val();
			var pageUrl = '';
			var goPageUrl = '';
			/*
			 * 根据类型跳转不同页面
			 * 事前申请: ADVANCE_APP
			报销申请: REIM_APP
			付款申请: PAYMENT_APP
			借款申请: LOAN_APP
			支出：EXPENDITURE_APP
			事前变更：CHANGE_APP*/
			if (objType == 'ADVANCE_APP') {
				pageUrl = "view/projectManagement-sasac/expensesReim/module/beforehand/beforeApplyDetail.html?advanceId=" + objId;
				goPageUrl = "view/projectManagement-sasac/expensesReim/module/approval/beforehandApproveList.html";
			} else if (objType == 'REIM_APP') {
				pageUrl = "view/projectManagement-sasac/expensesReim/module/reimApply/reimApplyDetail.html?processInstanceId=" + processInstanceId + "&reimId=" + objId;
				goPageUrl = "view/projectManagement-sasac/expensesReim/module/reimApply/reimApproveList.html";
			} else if (objType == 'PAYMENT_APP') {
				pageUrl = "view/projectManagement-sasac/expensesReim/module/payment/paymentApplyDetail.html?processInstanceId=" + processInstanceId + "&payAppId=" + objId;
				goPageUrl = "view/projectManagement-sasac/expensesReim/module/approval/paymentApprovalList.html";
			} else if (objType == 'LOAN_APP') {
				pageUrl = "view/projectManagement-sasac/expensesReim/module/loanApply/loanApplyDetail.html?processInstanceId=" + processInstanceId + "&loanId=" + objId;
				goPageUrl = "view/projectManagement-sasac/expensesReim/module/approval/loanApprovalList.html";
			} else if (objType == 'EXPENDITURE_APP') {
				pageUrl = "view/projectManagement-sasac/expensesReim/module/reimApply/expenseDetail.html?appId=" + objId;
				goPageUrl = "view/projectManagement-sasac/expensesReim/module/approval/expenApplApprList.html";
			} else if (objType == 'CHANGE_APP') {
				pageUrl = "view/projectManagement-sasac/expensesReim/module/busiTripApply/projectServeDetails.html?advanceAppId=" + objId;
				goPageUrl = "view/projectManagement-sasac/expensesReim/module/approval/projectBefList.html";
			}else if (objType == 'FINAL_APP') {
				pageUrl = "view/projectManagement-sasac/expensesReim/module/reimApply/finalDetail.html?appId=" + objId;
				goPageUrl = "view/projectManagement-sasac/expensesReim/module/approval/projectBefList.html";
			}else if (objType == 'PROJECT_BUDGET') {
        //项目预算
        pageUrl = "view/projectManagement-sasac/expensesReim/module/beforehand/beforeApplyDetail.html?advanceId="+ objId + '&processInstanceId=' + processInstanceId;
        goPageUrl = "view/projectManagement-sasac/expensesReim/module/approval/projectBefList.html";
      }else if (objType == 'FINAL_APP') {
        //项目决算
        pageUrl = "view/projectManagement-sasac/expensesReim/module/reimApply/finalDetail.html?appId="+ objId;
        goPageUrl = "view/projectManagement-sasac/expensesReim/module/approval/projectBefList.html";
      }
			$yt_baseElement.openNewPage(2, pageUrl)
		})
	}
}

$(function() {
	//调用初始化方法
	indexObj.init();
	//调用tab标签切换方法
	switcherTab();
	//调用单选和多选操作事件方法
	radioCheckBoxEvent();
});

function switcherTab() {
	//事项tab切换事件
	$('#right-matter .tab-nav').off().on('click', function() {
		var index = $(this).index();
		$(this).addClass('active-nav').siblings('.tab-nav').removeClass('active-nav');
		//切换加载数据
		indexObj.pageIndex = 1;
    indexObj.getMyToDoInfoListPageByParams(indexObj.pageIndex, '', true);
		//$('#right-matter .tab-content').eq(index).css("display", 'block').siblings('#right-matter .tab-content').hide();
	});
	//统计图展示tab切换事件
	$('.statistics-model .tab-nav').off().on('click', function() {
		var index = $(this).index();
		$(this).addClass('active-nav').siblings('.tab-nav').removeClass('active-nav');
		$('.statistics-model .tab-content').eq(index).css("display", "block").siblings().hide();
		//我的项目获取数据
		indexObj.getMyProjectList();
	});
}
/**
 * 按钮操作事件
 */
function radioCheckBoxEvent() {
	/**
	 * 单选
	 */
	$("body").delegate(".radio-sty input[type='radio']", "change", function() {
		$(".radio-sty").removeClass("check");
		$(this).parent().addClass("check");
		$(".radio-sty.check").find("input[type='radio']").prop("checked", true);
	});
	/**
	 * 多选
	 */
	$("body").delegate(".checkbox-sty input[type='checkbox']", "change", function() {
		/*如果当前点击的label下的input被选中*/
		if($(this)[0].checked) {
			/*当前点击的label添加checked*/
			$(this).parent().addClass("check");
		} else {
			$(this).parent().removeClass("check");
		}
		$(".checkbox-sty.check").find("input[type='checkbox']").prop("checked", true);
	});
}