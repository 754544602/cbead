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
			var pageUrl = "view/system-sasac/budget/module/projectApproval/budgetManagerDetails.html?budgetPrjFinancialAppId=" + draData.budgetPrjFinancialAppId; //即将跳转的页面路径
			//调用公用的打开新页面方法传输参数不需要左侧菜单
			$yt_baseElement.openNewPage(2, pageUrl);
		});
		//流程状态链接事件绑定
		$(".projetc-table").on('click', '.process-state', function() {
			//获取当前行的data
			var draData = $(this).parents('tr').data('draData');
			sysCommon.processStatePop(draData.processInstanceId);
		});
		//点击创建财政项目按钮
		$(".project-create").click(function() {
				//跳转编辑预算表数据页面
				window.location.href = $yt_option.websit_path + "view/system-sasac/budget/module/projectApproval/projectManagerApply.html";
		});
		//点击发布按钮
		$(".project-release").click(function() {
			//获取点击变色行数
			var selTrLen = $(".projetc-table tbody tr.yt-table-active").length;
			//获取当前选中行数据
			var tableData = $(".projetc-table tbody tr.yt-table-active").data("tableData");
			//如果为0提示选择
			if(selTrLen == 0) {
				$yt_alert_Model.prompt("请选择一行数据进行操作");
			} else {
				//跳转编辑预算表数据页面
			}
		});
	},
	/*table分页*/
	tablePage: function() {
		//获取查询条件值
		var queryParams = $(".query-text").val();
		//分页查询列表
		$('.payment-table-page').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 5, //显示...的规律
			url: 'budget/prjFinancialApp/getBudgetPrjFinancialAppInfoListToPageByParams', //'$yt_option.websit_path+'resources-sasac/js/testJsonData/project.json'',//ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			async: false, //ajax 访问类型 默认 true 异步,false同步  
			data: {
				queryParams: queryParams,
				prjBudgetYear:'2019',
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
								'<td><a class="yt-link to-detail">' + n.prjFinancialAppNum + '</a></td>' +
								'<td style="text-align: left;" class="text-overflow" title="' + n.prjForShort + '">' + n.prjForShort + '</td>' +
								'<td style="text-align: left;" class="text-overflow" title="' + n.prjStartYear + '">' + n.prjStartYear + '</td>' +
								'<td style="text-align: left;" class="text-overflow" title="' + n.prjUnitName + '">' + n.prjUnitName + '</td>' +
								'<td>' + n.prjClassifyName + '</td>'+
								'<td>' + n.applicantTime + '</td>' 
								;
							if( n.isPublish == 0) {
								trStr += '<td style="">' + '<span class="yt-link process-state">未发布</span>' + '</td>';
							} else {
								trStr += '<td style="">已发布</td>';
							}
							trStr +='<td>' + n.submitDeadline + '</td>';
							trStr +='<td width: 100px;><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>';
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