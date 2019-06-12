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
		//获取预算年度
		budgetReport.getBudgetYear();
		//调用点击编辑上报按钮方法
		budgetReport.clickBudgetOrgan();
	},
	//点击编辑上报按钮
	clickBudgetOrgan: function() {
		//点击事件
		$(".budget-organ").click(function() {
			//获取点击变色行数
			var selTrLen = $(".before-apply-table tbody tr.yt-table-active").length;
			//获取当前选中行数据
			var tableData = $(".before-apply-table tbody tr.yt-table-active").data("tableData");
			//如果为0提示选择
			if(selTrLen == 0) {
				$yt_alert_Model.prompt("请选择一行数据进行操作");
			} else {
				//跳转编辑预算表数据页面
				window.location.href = $yt_option.websit_path + "view/system-sasac/budget/module/expenditure/budgetStatistics.html?tableId=" + tableData.tableId + "&publishId=" + tableData.publishTableId;
			}
		});
	},
	//获取预算年度
	getBudgetYear: function() {
		$.ajax({
			type: "post",
			url: "budget/report/getBudgetYear",
			async: false,
			success: function(data) {
				var datas = data.data;
				if(data.flag == 0) {
					//1.遍历数据,给select赋值 
					$.each(datas, function(i, n) {
						$('select.budget-year').append('<option value="' + n.bookYear + '">' + n.bookYear + '</option>');
					});
					$("select.budget-year").niceSelect();
					//调用查询预算列表数据方法
					budgetReport.tablePage($(".budget-year").val());
					//4.10.4[预算表上报]：获取编制阶段默认选择项
					budgetReport.getBudgetStageOption($(".budget-year").val());
					//预算年度切换事件
					$("select.budget-year").change(function() {
						var thisYear = $(this).val();
						//4.10.4[预算表上报]：获取编制阶段默认选择项
						budgetReport.getBudgetStageOption(thisYear);
					});
				}
			}
		});
	},
	//4.10.4[预算表上报]：获取编制阶段默认选择项
	getBudgetStageOption: function(thisYear) {
		$.ajax({
			type: "post",
			url: "budget/report/getBudgetStageOption",
			async: false,
			data: {
				budgetYear: thisYear
			},
			success: function(data) {
				var datas = data.data;
				if(data.flag == 0) {
					//设置预算编制阶段选中
					$('.budget-radio input.docu-style[value="' + datas + '"]').setRadioState("check");
					//调用查询预算列表数据方法
					budgetReport.tablePage(thisYear);
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
		$('.before-table-page').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 5, //显示...的规律  
			url: "budget/report/getPageReportBudgetTableList", //ajax访问路径
			type: "post", //ajax访问方式 默认 "post"  
			async: false, //ajax 访问类型 默认 true 异步,false同步  
			data: {
				budgetYear: budgetYear,
				budgetStage: budgetStage
			}, //ajax查询访问参数  
			/** 
			 * ajax回调函数  
			 * @param {Object} data 列表数据 
			 * @param {Object} pageObj 分页参数对象 
			 */
			success: function(data) {
				//获取列表的body
				var htmlTbody = $('.before-apply-table .yt-tbody');
				//初始化清空
				htmlTbody.empty();
				var trStr = "";
				if(data.flag == 0) {
					//获取列表数据
					var datas = data.data.rows;
					if(datas.length > 0) {
						//显示分页div
						$('.before-table-page').show();
						//自定义变量
						var editorState = '';
						$.each(datas, function(i, n) {
							//判断editorState状态决定显示文字
							switch(n.editorState) {
								case 1:
									editorState = '未开始'
									break;
								case 2:
									editorState = '编制中'
									break;
								case 3:
									editorState = '编制完成'
									break;
							}
							trStr += '<tr>' +
								'<td>' + n.tableCode + '</td>' +
								'<td>' + n.budgetTypeName + '</td>' +
								'<td style="text-align: left;" class="text-overflow" title="' + n.tableName + '">' + n.tableName + '</td>' +
								'<td>' + (n.budgetStage == 1 ? '一上阶段' : '二上阶段') + '</td>' +
								'<td>' + editorState + '</td>' +
								'<td style="text-align: right;" title="' + n.submitRemainTime + '">' + n.submitRemainTimeShort + '</td>' +
								'<td lockState="' + n.lockState + '">' + (n.submitState == 1 ? '已提交（锁定）' : '未提交') + '</td>' +
								'<td>' + n.lastUpdateTime.substring(0, n.lastUpdateTime.length - 3) + '</td>' +
								'</tr>';
							//存储data
							trStr = $(trStr).data("tableData", n);
							//拼接
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
			},
			isSelPageNum: true //是否显示选择条数列表默认false,  
		});
	},
}
$(function() {
	budgetReport.init();
})