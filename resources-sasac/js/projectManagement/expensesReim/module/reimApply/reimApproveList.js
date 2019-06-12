var reimApproveList = {
	/**
	 * 
	 * 关键字输入框事件
	 * 
	 */
	searchInput: function() {
		// 输入框输入文本后  显示出删除叉号
		$('.search').on('keydown', function() {
			if($(this).val() != '') {
				$('.clearImg').show();
			}
		});
		// 点击叉号 清空输入框并隐藏叉号
		$('.clearImg').on('click', function() {
			$('.search').val('');
			$(this).hide();
			//调用获取选中的Tab状态
			reimApproveList.searchList();
		});
		//点击重置按钮
		$("#resetBtn").off().on("click", function() {
			$('.search').val('');
			//调用获取选中的Tab状态
			reimApproveList.searchList();
		});
		/**
		 * 
		 * 点击关键字查询按钮
		 * 
		 */
		$("#heardSearchBtn").off().on("click", function() {
			//调用获取选中的Tab状态
			reimApproveList.searchList();
		});
		/**
		 * 
		 * 点击扫码查询按钮
		 * 
		 */
		$("#scanSearch").off().on("click", function() {
			var reimId = $("div.tab-content:visible").find("table tbody tr:eq(0) .hid-reim-id").val();
			$yt_alert_Model.alertOne({
				leftBtnName: "等待扫描...", //左侧按钮名称,默认确定  
				rightBtnName: "取消",
				alertMsg: "请使用终端设备扫描报销单的二维码", //提示信息  
				confirmFunction: function() {
					var pageUrl = 'view/system-sasac/expensesReim/module/reimApply/reimApprove.html?reimId=' + reimId;
					window.location.href = $yt_option.websit_path + pageUrl;
				},
			});
		});
	},
	/**
	 * 
	 * 
	 * 查询列表方法
	 * 
	 */
	searchList: function() {
		var status = $('.active-li input').val();
		if(status == 'WF_SUSPENDING_QUERY_SQL_PARAMS') { // 待处理
			reimApproveList.getPendingList(status);
		} else if(status == 'WF_SOLVED_QUERY_SQL_PARAMS') { // 已处理
			reimApproveList.getProcessingAndFinishList(status);
		} else if(status == 'WF_COMPLETED_QUERY_SQL_PARAMS') { // 已完结
			reimApproveList.getProcessingAndFinishList(status);
		} else if(status == 'WF_DRAFTS_QUERY_SQL_PARAMS') { // 草稿箱
		}
	},
	/**
	 * 
	 * Tab标签切换事件
	 * 
	 */
	switcher: function() {
		$('.tab-li').off().on('click', function() {
			var index = $(this).index();
			$(this).addClass('active-li').siblings('.tab-li').removeClass('active-li');
			if(index == 1 || index == 2) {
				$('.tab-content').eq(1).css("display", 'block').siblings('.tab-content').hide();
			} else {
				$('.tab-content').eq(index).css("display", 'block').siblings('.tab-content').hide();
			}
			//调用获取选中的Tab状态
			reimApproveList.searchList();
		});
	},
	/**
	 * 获取待处理 列表
	 * @param {Object} stateCode 状态code值
	 */
	getPendingList: function(stateCode) {
		var keyWord = $('.search').val();
		$('.page1').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: "sz/reimApp/getUserReimAppInfoWFListToPageByParams", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				queryStateParams: stateCode,
				queryParams: keyWord
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				var datas = data.data.rows;
				var htmlTbody = $('.pending .yt-tbody');
				htmlTbody.empty();
				var trStr = "";
				if(data.flag == 0) {
					if(datas.length > 0) {
						$('.page1').show();
						$.each(datas, function(i, n) {
							trStr += '<tr>' +
								'<td><a class="yt-link to-detail">' + n.reimAppNum + '</a><input type="hidden" class="hid-reim-id" value="' + n.reimAppId + '"/><input type="hidden" class="processInstanceId" value="'+n.processInstanceId+'"/></td>' +
								'<td class="tl"><div style="white-space: normal;word-break: break-all;word-wrap: break-word;">' + (n.reimAppName == "" ? "--" : n.reimAppName) + '</div></td>' +
								'<td>' + n.costTypeName + '</td>' +
								'<td>' + n.applicantUserName + '</td>' +
								'<td>' + n.applicantUserDeptName + '</td>' +
								'<td style="text-align: right;">' + (n.totalAmount == "" ? "--" : $yt_baseElement.fmMoney(n.totalAmount)) + '</td><td>' + n.applicantTime + '</td>' +
								'<td><a class="yt-link flowBtn">' + n.nodeNowState + '</a></td>' +
								'<td><a class="yt-link apprv-btn"  taskKey="' + n.taskKey + '">' + (n.taskKey == 'activitiStartTask' ? '处理' : '审批') + '</a><span class="center-line">|</span><a class="yt-link log-mod">日志</a></td></tr>';
						});
						htmlTbody.append(trStr);
						//调用跳转到审批页面方法
						reimApproveList.goApprovePage();
						//调用提示窗口
						reimApproveList.initQtip();
						//绑定弹窗事件
						reimApproveList.flowWindow();
						//绑定去详情页面
						reimApproveList.toDetails();
					} else {
						$('.page1').hide();
						//拼接暂无数据效果
						htmlTbody.append(reimApproveList.noDataTrStr(8));
					}
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	/*点击编号  查看详情*/
	toDetails: function() {
		$('.yt-link.to-detail').off("click").on('click', function() {
			/*调用阻止冒泡方法*/
			reimApproveList.eventStopPageaction();
			/*获取id*/
			var processInstanceId = $(this).parents('tr').find('.processInstanceId').val();
			var reimId=$(this).parents('tr').find('.hid-reim-id').val();
//			var reimId = $("div.tab-content:visible").find("table tbody tr:eq(0) .hid-reim-id").val();
			/*页面跳转打开新页面*/
			var pageUrl = "view/system-sasac/expensesReim/module/reimApply/reimApplyDetail.html?processInstanceId=" + processInstanceId+"&reimId="+reimId;//即将跳转的页面路径
			var goPageUrl = "view/system-sasac/expensesReim/module/reimApply/reimApproveList.html";//左侧菜单指定选中的页面路径
			window.open($yt_option.websit_path+"index.html?pageUrl="+encodeURIComponent(pageUrl)+'&goPageUrl='+goPageUrl);
		})
	},
	/**
	 * 
	 * 获取已处理已完成列表数据
	 * @param {Object} stateCode
	 */
	getProcessingAndFinishList: function(stateCode) {
		var keyWord = $('.search').val();
		$('.page2').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: "sz/reimApp/getUserReimAppInfoWFListToPageByParams", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				queryStateParams: stateCode,
				queryParams: keyWord
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				var datas = data.data.rows;
				var htmlTbody = $('.handle-and-end .yt-tbody');
				htmlTbody.empty();
				var trStr = "";
				if(data.flag == 0) {
					if(datas.length > 0) {
						$('.page2').show();
						$.each(datas, function(i, n) {
							trStr += '<tr>' +
								'<td><a class="yt-link to-detail">' + n.reimAppNum + '</a><input type="hidden" class="hid-reim-id" value="' + n.reimAppId + '"/><input type="hidden" class="processInstanceId" value="'+n.processInstanceId+'"/></td>' +
								'<td class="tl"><div style="white-space: normal;word-break: break-all;word-wrap: break-word;">' + (n.reimAppName == "" ? "--" : n.reimAppName) + '</div></td>' +
								'<td>' + n.costTypeName + '</td>' +
								'<td>' + n.applicantUserName + '</td>' +
								'<td>' + n.applicantUserDeptName+ '</td>' +
								'<td style="text-align: right;">' + (n.totalAmount == "" ? "--" : $yt_baseElement.fmMoney(n.totalAmount)) + '</td><td>' + n.applicantTime + '</td>' +
								'<td>' + (stateCode == "WF_COMPLETED_QUERY_SQL_PARAMS" ? n.nodeNowState : "<a class='flowBtn'>"+n.nodeNowState+"</a>") +'</td>' +
								'<td><a class="yt-link log-mod">日志</a></td>'+
								'</tr>';
						});
						htmlTbody.append(trStr);
						//调用跳转到审批页面方法
						reimApproveList.goApprovePage();
						//调用提示窗口
						reimApproveList.initQtip();
						//绑定弹窗事件
						reimApproveList.flowWindow();
						//绑定去详情页面
						reimApproveList.toDetails();
					} else {
						$('.page2').hide();
						//拼接暂无数据效果
						htmlTbody.append(reimApproveList.noDataTrStr(8));
					}
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	/**
	 * 拼接暂无数据内容
	 * @param {Object} trNum  行数
	 */
	noDataTrStr: function(trNum) {
		//暂无数据内容
		var noDataStr = '<tr style="border:0px;background-color:#fff !important;"><td  colspan="' + trNum + '" align="center"style="border:0px;"><div class="no-data" style="width: 280px;margin: 0 auto;">' +
			'<img src="../../../../../resources-sasac/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
			'</div></td></tr>';
		return noDataStr;
	},
	/**
	 * 
	 * 
	 * 跳转到报销单审批页面
	 * 
	 */
	goApprovePage: function() {
		/**
		 * 
		 * 点击操作中的审批按钮
		 * 
		 */
		$(".apprv-btn").off().click(function() {
			//报销单id
			var reimId = $(this).parents("tr").find(".hid-reim-id").val();
			//报销单状态
			var state = $(this).attr('taskKey');
			//跳转路径
			var pageUrl = '';
			if(state == 'activitiStartTask') {
				//状态为申请人填报时 进入修改页面
				pageUrl = 'view/system-sasac/expensesReim/module/reimApply/serveFunds.html?reimId=' + reimId;
			} else {
				pageUrl = 'view/system-sasac/expensesReim/module/reimApply/serveExamine.html?reimId=' + reimId;
			}
			/**
			 * 调用显示loading方法
			 */
			parent.parent.$yt_baseElement.showLoading();
			window.location.href = $yt_option.websit_path + pageUrl;
		});
	},
	//阻止冒泡
	eventStopPageaction: function() {
		var e = arguments.callee.caller.arguments[0] || event;
		if(e && e.stopPropagation) {
			// this code is for Mozilla and Opera
			e.stopPropagation();
		} else if(window.event) {
			// this code is for IE 
			window.event.cancelBubble = true;
		}
	},
	//提示信息方法
	initQtip:function(){
		//注意：以下配置参数如无特别说明均为默认，使用时只需配置相关参数即可  
        $('.log-mod').qtip({  
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
					var td = $(this).parent("td").prevAll("td");
					/*获取id*/
					var processInstanceId = td.find('.processInstanceId').val();
					
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
									shomd += '<div class="log-msg-model">'
									      +'<div><div class="first-log-msg"><span class="log-num">'+(WorkFlowLogList.length-i)+'</span></div><span class="user-name">'+(WorkFlowLog.userName == "" ? '无' : WorkFlowLog.userName) +'</span><div style="clear:both;"></div></div>'
									      +'<div class="log-line-div" style="'+(i == (WorkFlowLogList.length-1) ? "padding-bottom: 0px;":"padding-bottom: 10px;")+''+(WorkFlowLogList.length == 1?"border:0px;":"")+'"><div style="'+(WorkFlowLogList.length == 1?"border:0px;":"border-bottom: 1px solid #D6E6F3;")+'">'
									      +'<div class="oper-status-model"><label class="log-label-text">操作状态</label><span>：</span><span>'+(WorkFlowLog.taskName == "" ? "无" : WorkFlowLog.taskName)+'</span></div>'
									      +'<div class="oper-time-model"><label class="log-label-text">操作时间</label><span>：</span><span>'+(WorkFlowLog.commentTime == "" ? "无" : WorkFlowLog.commentTime)+'</span></div>';
									      /**
									       *判断操作意见是否为空,为空不显示
									       */
									      if(WorkFlowLog.comment != "" && WorkFlowLog.comment != null && WorkFlowLog.comment != " "){
									      	shomd +='<div class="log-comment-model"><label class="log-label-text">操作意见</label><span>：</span><div class="oper-comment-msg">'+WorkFlowLog.comment+'</div></div>';
									      }
									     shomd +='</div></div>';

								} else {
									/*其他人的意见循环,一种格式*/
									shomd += '<div class="log-msg-model">'
									      +'<div><div class="log-msg-def-bak"><span class="log-num">'+(WorkFlowLogList.length-i)+'</span></div><span class="user-name" style="top:0px;">'+(WorkFlowLog.userName == "" ? '无' : WorkFlowLog.userName) +'</span><div style="clear:both;"></div></div>'
									      +'<div class="log-line-div" style="'+(i == (WorkFlowLogList.length-1) ? "padding-bottom: 0px;":"padding-bottom: 10px;")+''+( i == (WorkFlowLogList.length-1) ? "border:0px;":"")+'"><div style="'+( i == (WorkFlowLogList.length-1) ? "border:0px;":"border-bottom: 1px solid #D6E6F3;")+'">'
									      +'<div class="oper-status-model"><label class="log-label-text">操作状态</label><span>：</span><span>'+(WorkFlowLog.taskName == "" ? "无" : WorkFlowLog.taskName)+'</span></div>'
									      +'<div class="oper-time-model"><label class="log-label-text">操作时间</label><span>：</span><span>'+(WorkFlowLog.commentTime == "" ? "无" : WorkFlowLog.commentTime)+'</span></div>';
									      /**
									       *判断操作意见是否为空,为空不显示
									       */
									      if(WorkFlowLog.comment != "" && WorkFlowLog.comment != null && WorkFlowLog.comment != " "){
									      	shomd +='<div class="log-comment-model"><label class="log-label-text">操作意见</label><span>：</span><div class="oper-comment-msg">'+WorkFlowLog.comment+'</div></div>';
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
                my: 'right top',
				at: 'left top',
				container: false,
				viewport: $('body'),
				adjust: {
					x: 0,
					y: 0,
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
//				event:"click"
            },  
            // 样式相关    
            style: {  
                /*自定义的类样式*/
				classes: 'showmod',
				/*tip插件，箭头相关设置*/
				tip: {
					corner: true,
					mimic: false,
					width: 10,
					height: 10,
					border: true,
					offset: 0
				}
            },  
            // 事件对象确定绑定到工具提示的初始事件处理程序  
            events: {  
                show:function (data){
					$(data.target).find(".qtip-content").css("max-height",$('#frame-right-model').height()-200);
				}
            }  
        }); 
	},
	// 流程弹窗
	flowWindow: function() {
		$('.flowBtn').off().on('click', function() {
			$(".flowWindow").show();
			//调用算取div显示位置方法
			$yt_alert_Model.getDivPosition($(".yt-edit-alert.flowWindow"));

			var processInstanceId = $(this).parent('td').parent('tr').find('.processInstanceId').val();
			// 流程图查询
			$('.imgBox').html('<img src="' + $yt_option.workFlow + 'findPngByProcessInstanceId?processInstanceId=' + processInstanceId + '">')

			//点击取消方法 
			$('.flowWindow .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
				$(".flowWindow").hide();
			});
		})

	}
}
$(function() {
	//调用关键字输入框事件
	reimApproveList.searchInput();
	// tab切换
	reimApproveList.switcher();
	//获取参数 审批页面提交定位至已处理tab页
	var state = $yt_common.GetRequest().state;
	if(state){
		$('.tab-header .tab-li').removeClass('active-li');
		$('.tab-header .tab-li').eq(1).addClass('active-li');
		$('.tab-content').eq(1).css("display", 'block').siblings('.tab-content').hide();
	}
	//调用获取选中的Tab状态
	reimApproveList.searchList();
	$("#reimApproList").css("min-height", $(window).height() - 12);
})