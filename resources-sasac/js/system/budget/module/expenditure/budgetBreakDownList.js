var budgetReport = {
	init: function() {
		//给当前页面设置最小高度
		$("#budgetReport").css("min-height", $(window).height() - 12);
		//初始化下拉框
		$("select").niceSelect();
		//		//获取table分页
		//		budgetReport.tablePage();
		//单选按钮触发事件
		$(".budget-radio .yt-radio input").change(function() {
			//调用查询预算列表数据方法
			budgetReport.tablePage($(".budget-year").val());
		});
		//重写选中变色方法
		$(".yt-table .yt-tbody").on("click", " tr", function() {
			$(".yt-table .yt-tbody tr.yt-table-active").removeClass("yt-table-active");
			$(this).addClass("yt-table-active");
		});
		//获取预算年度
		budgetReport.getBudgetYear();
		//调用点击预算分解按钮方法
		budgetReport.clickBudgetOrgan();
		//点击下达按钮
		budgetReport.clickBudgetNext();
	},
	//点击预算分解按钮
	clickBudgetOrgan: function() {
		//点击事件
		$(".budget-organ").click(function() {
			//获取点击变色行数
			var selTrLen = $(".plan-list-model tbody tr.yt-table-active").length;
			//获取当前选中行数据
			var tableData = $(".plan-list-model tbody tr.yt-table-active").data("tableData");
			//如果为0提示选择
			if(selTrLen == 0) {
				$yt_alert_Model.prompt("请选择一行数据进行操作");
			} else {
				//跳转预算分解页面
				window.location.href = $yt_option.websit_path + "view/system-sasac/budget/module/expenditure/budgetBreakDown.html?tableId=" + tableData.tableId + "&budgetStage=" + tableData.budgetStage;
			}
		});
		
		//点击导出按钮
		$("button.export-btn").click(function(){
			//获取点击变色行数
			var selTrLen = $(".plan-list-model tbody tr.yt-table-active").length;
			//获取当前选中行数据
			var tableData = $(".plan-list-model tbody tr.yt-table-active").data("tableData");
			//如果为0提示选择
			if(selTrLen == 0) {
				$yt_alert_Model.prompt("请选择一行数据进行操作");
			} else {
				//配置统一参数
				var yitianSSODynamicKey  = $yt_baseElement.getToken();
				window.location.href = $yt_option.base_path + 'gzw/budget/excel/exportResolveAuditToExcel?tableId=' + tableData.tableId + '&budgetStage='+tableData.budgetStage+"&yitianSSODynamicKey="+yitianSSODynamicKey+"&ajax=1";
			}
		});
	},
	//获取预算年度
	getBudgetYear: function() {
		$.ajax({
			type: "post",
			url: "budget/appMain/getBudgetYearInfo",
			async: false,
			success: function(data) {
				var datas = data.data;
				if(data.flag == 0) {
					//1.遍历数据,给select赋值 
					$.each(datas, function(i, n) {
						$('select.budget-year').append('<option value="' + n.budgetYear + '">' + n.budgetYear + '</option>');
					});
					$("select.budget-year").niceSelect();
					//调用查询预算列表数据方法
					budgetReport.tablePage($(".budget-year").val());
					//预算年度切换事件
					$("select.budget-year").change(function() {
						var thisYear = $(this).val();
						//调用查询预算列表数据方法
						budgetReport.tablePage(thisYear);
						//4.10.4[预算表上报]：获取编制阶段默认选择项
						//						budgetReport.getBudgetStageOption(thisYear);
					});
				}
			}
		});
	},
	/**
	 * table分页
	 * @param {Object} property
	 */
	tablePage: function(budgetYear) {
		//获取单选按钮数据
		//阶段
		var budgetStage = $(".budget-radio .yt-radio input:checked").val();
		$.ajax({
			type: "post",
			url: "budget/resolve/getResolvePublishBudgetTableList", //ajax访问路径
			async: false,
			data: {
				budgetYear: budgetYear,
				budgetStage: budgetStage
			},
			success: function(data) {
				var htmlTbody = $('.publish-table .yt-tbody');
				htmlTbody.empty();
				var trStr = "";
				if(data.flag == 0) {
					var datas = data.data;
					if(datas.length > 0) {
						$.each(datas, function(i, n) {
							trStr += '<tr>' +
								'<td>' + n.tableCode + '</td>' +
								'<td style="">' + n.budgetTypeName + '</td>' +
								'<td style="text-align: left;" class="text-overflow" title="' + n.tableName + '">' + n.tableName + '</td>' +
								'<td>' + (n.budgetStage == 1 ? "一下编制数据分解" : "二下编制数据分解") + '</td>' +
								'<td>' + (n.resolveState == 1 ? "已分解" : "未分解") + '</td>' +
								'<td style="">' + (n.goDownState == 1 ? "已下达" : "未下达") + '</td>' +
								'<td lastOperatorUserCode="' + n.lastOperatorUserCode + '">' + (n.lastOperatorUserName || '--') + '</td>' +
								'<td>' + (n.lastOperatorDateTime.substring(0, n.lastOperatorDateTime.length - 3) || '--') + '</td>' +
								'</tr>';
							trStr = $(trStr).data("tableData", n);
							htmlTbody.append(trStr);
						});
					} else {
						$('.before-table-page').hide();
						//拼接暂无数据效果
						htmlTbody.html(sysCommon.noDataTrStr(9));
					}
				} else {
					$('.before-table-page').hide();
					//拼接暂无数据效果
					htmlTbody.html(sysCommon.noDataTrStr(9));
					//提示信息	
					$yt_alert_Model.prompt(data.message);
				}
			}
		});
	},
	//点击下达按钮
	clickBudgetNext: function() {
		//点击事件
		$(".budget-next").click(function() {
			//阶段
			var budgetStage = $(".budget-radio .yt-radio input:checked").val();
			//年度
			var budgetYear = $(".budget-year").val()
			$.ajax({
				type: "post",
				url: "budget/resolve/setGoDownBudgetResolveData",
				async: false,
				data: {
					budgetYear: budgetYear,
					budgetStage: budgetStage
				},
				success: function(data) {
					var datas = data.data;
					if(data.flag == 0) {
						//调用列表方法刷新数据
						budgetReport.tablePage(budgetYear);
					}
					//提示信息	
					$yt_alert_Model.prompt(data.message);
				}
			});
		});
	}
}
$(function() {
	budgetReport.init();
})