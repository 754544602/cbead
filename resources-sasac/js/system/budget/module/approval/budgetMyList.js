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
			//调用遍历方法
			beforeApproList.getPendingList();
		});
		//点击重置按钮
		$("#resetBtn").off().on("click", function() {
			$('.search').val('');
			$(".clearImg").hide();
			//调用遍历方法
			beforeApproList.getPendingList();
		});
		/**
		 * 
		 * 点击关键字查询按钮
		 * 
		 */
		$("#heardSearchBtn").off().on("click", function() {
			//调用遍历方法
			beforeApproList.getPendingList();
		});
		//流程状态链接事件绑定
		$(".wait-table").on('click', '.process-state', function() {
			//获取流程实例ID
			var processInstanceId = $(this).parents("tr").find(".processInstanceId").val();
			sysCommon.processStatePop(processInstanceId);
		});
	},
	/**
	 * 获取待处理 列表
	 * @param {Object} stateCode 状态code值
	 */
	getPendingList: function() {
		//获取查询关键字
		var queryParams = $('#keywordInput').val();
		$('.page1').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: 'budget/appMain/myApplicationAppInfo', //ajax访问路径  
			data: {
				queryParams: queryParams
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				var datas = data.data.rows;
				var htmlTbody = $('.wait-table .yt-tbody');
				htmlTbody.empty();
				var trStr = "";
				if(data.flag == 0) {
					if(datas.length > 0) {
						$('.page1').show();
						//获取公用的不显示流程图的状态字符串
						sysCommon.isWorkFlowStateStr = ',' + sysCommon.isWorkFlowStateStr + ',';
						$.each(datas, function(i, n) {
							trStr += '<tr>' +
								'<td><input type="hidden" class="budgetAppId" value="' + n.budgetAppId + '"/><input type="hidden" class="processInstanceId" value="' + n.processInstanceId + '"/>' + n.applicantTime + '</td>' +
								'<td><a class="yt-link to-detail">' + n.budgetAppNum + '</a></td>' +
								'<td>' + n.budgetYear + '</td>' +
								'<td budgetStage="' + n.budgetStage + '">' + n.budgetStageName + '</td>';
							//检索不能显示流程图的状态字符串
							if(sysCommon.isWorkFlowStateStr.indexOf(',' + n.workFlowState + ',') == -1) {
								trStr += '<td style="">' + '<span class="yt-link process-state">' + n.nodeNowState + '</span>' + '</td>';
							} else {
								trStr += '<td style="">' + n.nodeNowState + '</td>';
							}
							trStr += '</tr>';
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
					}
				} else {
					$('.page1').hide();
					//拼接暂无数据效果
					htmlTbody.append(sysCommon.noDataTrStr(8));
					//提示信息	
					$yt_alert_Model.prompt(data.message);
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
			//跳转路径
			var pageUrl = '';
			if(state == 'activitiStartTask') {
				//状态为申请人填报时 进入修改页面
				pageUrl = ''
			} else {
				//审批页面
				pageUrl = ''
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
	//调用遍历方法
	beforeApproList.getPendingList();
	//给页面设置最小高度
	$("#reimApproList").css("min-height", $(window).height() - 12);
})