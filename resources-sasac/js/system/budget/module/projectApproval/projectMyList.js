var project = {
	//当前日期
	thisDate: "",
	//初始化页面
	init: function() {
		//给当前页面设置最小高度
		$("#paymentRequest").css("min-height", $(window).height() - 12);
		//调用事件绑定方法
		project.events();
		/**
		 * 初始化日期控件
		 */
		$("#startDate").calendar({
			controlId: "startTime",
			upperLimit: $("#endDate"), //开始日期最大为结束日期  
			speed: 0,
			nowData: false,
			callback: function() {}
		});
		$("#endDate").calendar({
			controlId: "endTime",
			lowerLimit: $("#startDate"), //结束日期最小为开始日期  
			speed: 0,
			nowData: false,
			callback: function() {}
		});
		//调用分页查询方法
		project.tablePage();
	},
	//事件绑定
	events: function() {
		//查询按钮事件绑定
		$("#heardSearchBtn").click(function() {
			project.tablePage();
		});
		//重置按钮事件
		$("#resetBtn").click(function() {
			//重置关键字
			$(".query-text").val("");
			//重置日期
			$("#startDate").val(project.thisDate);
			$("#endDate").val(project.thisDate);
			//调用查询方法
			project.tablePage();
		});
		//跳转详情页面
		$('.projetc-table').on('click', '.to-detail', function() {
			//获取当前行的data
			var draData = $(this).parents('tr').data('draData');
			/*调用阻止冒泡方法*/
			$yt_baseElement.eventStopPageaction();
			//详情页面
			var pageUrl = "view/system-sasac/budget/module/projectApproval/budgetApprovalDetails.html?budgetPrjAppId=" + draData.budgetPrjAppId + '&processInstanceId=' + draData.processInstanceId; //即将跳转的页面路径
			//调用公用的打开新页面方法传输参数不需要左侧菜单
			$yt_baseElement.openNewPage(2, pageUrl);
		});
		//流程状态链接事件绑定
		$(".projetc-table").on('click', '.process-state', function() {
			//获取当前行的data
			var draData = $(this).parents('tr').data('draData');
			sysCommon.processStatePop(draData.processInstanceId);
		});
	},
	/*table分页*/
	tablePage: function() {
		//获取查询条件值
		var queryParams = $(".query-text").val();
		var startDate = $("#startDate").val();
		var endDate = $("#endDate").val();
		//分页查询列表
		$('.payment-table-page').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 5, //显示...的规律  
			url: 'budget/prjApp/getBudgetPrjAppInfoWFListToPageByParams', //'$yt_option.websit_path+'resources-sasac/js/testJsonData/project.json'',//ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			async: false, //ajax 访问类型 默认 true 异步,false同步  
			data: {
				queryParams: queryParams,
				startTime: startDate,
				endTime: endDate
			}, //ajax查询访问参数  
			/** 
			 * ajax回调函数  
			 * @param {Object} data 列表数据 
			 * @param {Object} pageObj 分页参数对象 
			 */
			success: function(data, pageObj) {
				var htmlTbody = $('.projetc-table .yt-tbody');
				htmlTbody.empty();
				var trStr = "";
				if(data.flag == 0) {
					var datas = data.data.rows;
					if(datas.length > 0) {
						$('.payment-table-page').show();
						//获取公用的不显示流程图的状态字符串
						sysCommon.isWorkFlowStateStr = ',' + sysCommon.isWorkFlowStateStr + ',';
						$.each(datas, function(i, n) {
							trStr += '<tr>' +
								'<td>' + n.applicantTime + '</td>' +
								'<td><a class="yt-link to-detail">' + n.budgetPrjAppNum + '</a></td>' +
								'<td style="text-align: left;" class="text-overflow" title="' + n.prjName + '">' + n.prjName + '</td>' +
								'<td style="text-align: left;" class="text-overflow" title="' + n.prjUnitName + '">' + n.prjUnitName + '</td>' +
								'<td>' + n.prjClassifyName + '</td>';
							//检索不能显示流程图的状态字符串
							if(sysCommon.isWorkFlowStateStr.indexOf(',' + n.workFlowState + ',') == -1) {
								trStr += '<td style="">' + '<span class="yt-link process-state">' + n.nodeNowState + '</span>' + '</td>';
							} else {
								trStr += '<td style="">' + n.nodeNowState + '</td>';
							}
							trStr += '</tr>';
							trStr = $(trStr).data("draData", n);
							htmlTbody.append(trStr);
						});
					} else {
						$('.payment-table-page').hide();
						//拼接暂无数据效果
						htmlTbody.append(sysCommon.noDataTrStr(6));
					}
				}

			},
			isSelPageNum: true //是否显示选择条数列表默认false,  
		});
	}
}

$(function() {
	//调用初始化页面方法
	project.init();
});