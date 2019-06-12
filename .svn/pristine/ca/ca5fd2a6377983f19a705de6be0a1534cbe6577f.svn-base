var beforeApproList = {
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
			beforeApproList.searchList();
		});
		//点击重置按钮
		$("#resetBtn").off().on("click", function() {
			$('.search').val('');
			$(".clearImg").hide();
			//调用获取选中的Tab状态
			beforeApproList.searchList();
		});
		/**
		 * 
		 * 点击关键字查询按钮
		 * 
		 */
		$("#heardSearchBtn").off().on("click", function() {
			//调用获取选中的Tab状态
			beforeApproList.searchList();
		});
		//流程状态链接事件绑定
		$(".end-table").on('click', '.process-state', function() {
			//获取流程实例ID
			var processInstanceId = $(this).parents("tr").find(".processInstanceId").val();
			sysCommon.processStatePop(processInstanceId);
		});
	},
	/**
	 * 查询列表方法
	 */
	searchList: function() {
		var status = $('.active-li input').val();
		if(status == 'WF_SUSPENDING_QUERY_SQL_PARAMS') { // 待处理
			beforeApproList.getPendingList(status);
		} else if(status == 'WF_SOLVED_QUERY_SQL_PARAMS') { // 已处理
			$(".app-date-th").text("申请日期");
			beforeApproList.getProcessingAndFinishList(status);
		} else if(status == 'WF_COMPLETED_QUERY_SQL_PARAMS') { // 已完结
			//$(".app-date-th").text("最新修改日期");
			beforeApproList.getProcessingAndFinishList(status);
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
				$('.tab-content').eq(1).css("display", 'block').addClass("check").siblings('.tab-content').hide().removeClass("check");
			} else {
				$('.tab-content').eq(index).css("display", 'block').addClass("check").siblings('.tab-content').hide().removeClass("check");
			}
			//调用获取选中的Tab状态
			beforeApproList.searchList();
		});
	},
	/**
	 * 获取待处理 列表
	 * @param {Object} stateCode 状态code值
	 */
	getPendingList: function(stateCode) {
		//获取查询关键字
		var keyWord = $('#keywordInput').val();
		$('.page1').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: 'budget/appMain/getUserBudgetAppInfoWFListToPageByParams', //ajax访问路径  
			data: {
				queryStateParams: stateCode,
				queryParams: keyWord
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				var htmlTbody = $('.wait-table .yt-tbody');
				htmlTbody.empty();
				var trStr = "";
				if(data.flag == 0) {
					var datas = data.data.rows;
					if(datas.length > 0) {
						$('.page1').show();
						$.each(datas, function(i, n) {
							trStr += '<tr>' +
								'<td><a class="yt-link to-detail">' + n.budgetAppNum + '</a><input type="hidden" class="budgetAppId" value="' + n.budgetAppId + '"/><input type="hidden" class="processInstanceId" value="' + n.processInstanceId + '"/><input type="hidden" class="booksId" value="' + n.booksId + '"/></td>' +
								'<td>' + n.budgetYear + '</td>' +
								'<td budgetStage="' + n.budgetStage + '">' + n.budgetStageName + '</td>' +
								'<td applicantUser=' + n.applicantUser + '>' + n.applicantUserName + '</td>' +
								'<td>' + n.applicantDeptName + '</td>' +
								'<td>' + n.stagnationTime + '</td>' + //停滞时间
								'<td><a class="yt-link apprv-btn" taskKey="' + n.taskKey + '">' + (n.taskKey == 'activitiStartTask' ? '处理' : '审批') + '</a><span class="center-line">|</span><a class="yt-link log-mod">日志</a></td></tr>';
							trStr = $(trStr).data("dataStr", n);
							htmlTbody.append(trStr);
						});
						//调用跳转到审批页面方法
						beforeApproList.goApprovePage();
						//调用提示窗口
						sysCommon.initQtip($(".log-mod"));
						//绑定去详情页面
						beforeApproList.toDetails();
					} else {
						$('.page1').hide();
						//拼接暂无数据效果
						htmlTbody.append(sysCommon.noDataTrStr(8));
						//提示信息	
						$yt_alert_Model.prompt(data.message);
					}
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	/**
	 * 
	 * 跳转详情方法
	 * 
	 */
	toDetails: function() {
		$('.yt-link.to-detail').off("click").on('click', function() {
			/*调用阻止冒泡方法*/
			$yt_baseElement.eventStopPageaction();
			/*获取流程实例id*/
			var processInstanceId = $(this).parents('tr').find('.processInstanceId').val();
			//获取单据ID
			var budgetAppId = $(this).parents('tr').find('.budgetAppId').val();
			/*页面跳转打开新页面*/
			var pageUrl = "view/system-sasac/budget/module/approval/budgetDetails.html?processInstanceId=" + processInstanceId + "&budgetAppId=" + budgetAppId; //即将跳转的页面路径
			//调用公用的打开新页面方法传输参数不需要左侧菜单
			$yt_baseElement.openNewPage(2, pageUrl);
		})
	},
	/**
	 * 
	 * 获取已处理已完成列表数据
	 * @param {Object} stateCode 状态code
	 */
	getProcessingAndFinishList: function(stateCode) {
		//输入框
		var keyWord = $('#keywordInput').val();
		$('.page2').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: 'budget/appMain/getUserBudgetAppInfoWFListToPageByParams', //ajax访问路径  
			data: {
				queryStateParams: stateCode,
				queryParams: keyWord
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				var htmlTbody = $('.end-table .yt-tbody');
				htmlTbody.empty();
				var trStr = "";
				if(data.flag == 0) {
					var datas = data.data.rows;
					if(datas.length > 0) {
						$('.page2').show();
						$.each(datas, function(i, n) {
							trStr += '<tr>' +
								'<td><a class="yt-link to-detail">' + n.budgetAppNum + '</a><input type="hidden" class="budgetAppId" value="' + n.budgetAppId + '"/><input type="hidden" class="processInstanceId" value="' + n.processInstanceId + '"/><input type="hidden" class="booksId" value="' + n.booksId + '"/></td>' +
								'<td>' + n.budgetYear + '</td>' +
								'<td budgetStage="' + n.budgetStage + '">' + n.budgetStageName + '</td>' +
								'<td applicantUser="' + n.applicantUser + '">' + n.applicantUserName + '</td>' +
								'<td>' + n.applicantDeptName + '</td>';
							//已完结  隐藏当前状态
							if(stateCode == 'WF_COMPLETED_QUERY_SQL_PARAMS') {
								//隐藏当前状态th
								$(".now-show-th").hide();
							} else {
								//显示当前状态th
								$(".now-show-th").show();
								trStr += '<td><a class="yt-link process-state">' + n.nodeNowState + '</a></td>';
							}
							/*flowBtn*/
							trStr += '<td><a class="yt-link log-mod">日志</a></td>' +
								'</tr>';
							//存储数据data
							trStr = $(trStr).data("dataStr", n);
							htmlTbody.append(trStr);
						});
						//调用跳转到审批页面方法
						beforeApproList.goApprovePage();
						//调用提示窗口
						sysCommon.initQtip($(".log-mod"));
						//绑定去详情页面
						beforeApproList.toDetails();
					} else {
						//如无数据 已完结  隐藏当前状态
						if(stateCode == 'WF_COMPLETED_QUERY_SQL_PARAMS') {
							//隐藏当前状态th
							$(".now-show-th").hide();
						} else {
							//显示当前状态th
							$(".now-show-th").show();
						}
						$('.page2').hide();
						//拼接暂无数据效果
						htmlTbody.append(sysCommon.noDataTrStr(8));
					}
				} else {
					$('.page2').hide();
					//拼接暂无数据效果
					htmlTbody.append(sysCommon.noDataTrStr(8));
				}

			},
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	/**
	 * 
	 * 
	 * 跳转到预算审批页面
	 * 
	 */
	goApprovePage: function() {
		/**
		 * 
		 * 点击操作中的审批按钮
		 * 
		 */
		$(".apprv-btn").off().click(function() {
			/*获取预算申请Id*/
			var budgetAppId = $(this).parents('tr').find('.budgetAppId').val();
			/*
			 * 获取当前审批节点key值
			 */
			var state = $(this).attr('taskKey');
			//跳转路径
			var pageUrl = '';
			if(state == 'activitiStartTask') {
				//状态为activitiStartTask时 进入修改页面
				var pageUrl = 'view/system-sasac/budget/module/approval/budgetApply.html?budgetAppId=' + budgetAppId; 
			} else {
				//审批页面
				var pageUrl = 'view/system-sasac/budget/module/approval/budgetApprove.html?budgetAppId=' + budgetAppId;
			}
			/**
			 * 调用显示loading方法
			 */
			parent.parent.$yt_baseElement.showLoading();
			window.location.href = $yt_option.websit_path + pageUrl;
		});
	}
}
$(function() {
	//调用关键字输入框事件
	beforeApproList.searchInput();
	//tab切换
	beforeApproList.switcher();
	//获取参数 审批页面提交定位至已处理tab页
	var state = $yt_common.GetRequest().state;
	if(state) {
		$('.tab-header .tab-li').removeClass('active-li');
		$('.tab-header .tab-li').eq(1).addClass('active-li');
		$('.tab-content').eq(1).css("display", 'block').siblings('.tab-content').hide();
	}
	//调用获取选中的Tab状态
	beforeApproList.searchList();
	//给页面设置最小高度
	$("#reimApproList").css("min-height", $(window).height() - 12);
})