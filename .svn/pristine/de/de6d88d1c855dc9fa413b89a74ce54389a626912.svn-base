var budgetFill= {
	init: function() {
		//给当前页面设置最小高度
		$("#budgetFill").css("min-height", $(window).height() - 12);
		//初始化下拉框
		$(".yt-select").niceSelect();
		//单选按钮触发事件
		$(".budget-radio .yt-radio input").change(function() {
			//调用获取选中的Tab状态
			budgetFill.searchList();
		});
		//获取预算年度
	//	budgetFill.getBudgetYear();
		//调用点击编制上报按钮方法
		budgetFill.clickBudgetOrgan();
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
				window.location.href = $yt_option.websit_path + "view/system-sasac/budget/module/expenditure/budgetFillDetails.html?tableId=" + tableData.tableId + "&publishId=" + tableData.publishTableId;
			}
		});
	},
	/**
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
					//4.10.4[预算表上报]：获取编制阶段默认选择项
					//预算年度切换事件
					$("select.budget-year").change(function() {
						//调用获取选中的Tab状态
						budgetFill.searchList();
					});
				}
			}
		});
	}, **/
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
					//调用获取选中的Tab状态
					budgetFill.searchList();
					
				}
			}
		});
	},
	/**

	 * 
	 * 查询列表方法
	 * 
	 */
	searchList: function(thisYear) {
		var status = $('.active-li input').val();
		if(status == 'WF_SUSPENDING_QUERY_SQL_PARAMS') { // 待处理
			budgetFill.getPendingList(status);
		} else if(status == 'WF_SOLVED_QUERY_SQL_PARAMS') { // 已处理
			budgetFill.getProcessingAndFinishList(status);
		} else if(status == 'WF_COMPLETED_QUERY_SQL_PARAMS') { // 已完结
			budgetFill.getPendingList(status);
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
			$('.tab-li').removeClass('active-li');
			$(this).addClass('active-li');
			$('.tab-content').hide();
			if(index == 1) { 
				$('.tab-content').eq(1).show();
			} else {
				$('.tab-content').eq(0).show();
			}
			if(index==1){//已处理状态下，显示当前状态字段
				$('.node-now-state').show();
			}else{
				$('.node-now-state').hide();
			}
			//调用获取选中的Tab状态
			budgetFill.searchList();
		});
	},
	/**
	 * 我的方法
	 * 
	 */
	/**
	 * 待处理 列表
	 * WF_SUSPENDING_QUERY_SQL_PARAMS  待处理
	 * @param {Object} stateCode 状态code值
	 */
	getPendingList: function(status) {
		//获取选中的状态
		//var status = $('.active-li input').val();
		//获取年度
	//	var budgetYear = $(".budget-year").val();
		//获取预算阶段
		var budgetStage = $(".budget-radio .yt-radio input:checked").val();
		$('.page1').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: "budget/report/getUserBudgetReportAppInfoWFListToPageByParams", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				queryStateParams: status,
	//			budgetYear: budgetYear,
				budgetStage:budgetStage
			},  //ajax查询访问参数
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
							//编制状态( 1 未开始 2 编制中 3 编制完成)
							var editorStage = "";
							if(n.editorStage == "1"){
								editorStage = "未开始";
							}else if(n.editorStage == "2"){
								editorStage = "编制中";
							}else if(n.editorStage == "3"){
								editorStage = "编制完成";
							}
							var appaovalBtn = '<a class="yt-link apprv-btn"  taskKey="' + n.taskKey + '">' + (n.taskKey == 'activitiStartTask' ? '处理' : '审批') + 
								'</a><span class="center-line">|</span>';
							if(status == 'WF_COMPLETED_QUERY_SQL_PARAMS'){
								appaovalBtn = '';
							}
							trStr += '<tr>' +
								'<td><a class="yt-link to-detail">' + n.reportNum + '</a><input type="hidden" class="hid-reim-id" value="' + n.tableId + '"/><input type="hidden" class="processInstanceId" value="'+n.processInstanceId+'"/></td>' +
								'<td>' + n.sourceDeptName + '</td>' +
								'<td>' + n.budgetTypeName + '</td>' +
								'<td>' + n.tableName + '</td>' +
								'<td>' + n.budgetStageName + '</td>' +
								'<td>' + editorStage + '</td>' +
								'<td>' + n.submitRemainTimeShort + '</td>' +
								'<td>'+n.lastUpdateTime+'</td>' +
								'<td>'+ appaovalBtn +'<a class="yt-link log-mod">日志</a></td></tr>';
						    trStr = $(trStr).data("dataTr",n);
						    htmlTbody.append(trStr);
						});
						//调用流程日志提示窗口
						sysCommon.initQtip($(".log-mod"));
						//调用跳转到审批页面方法
						budgetFill.goApprovePage();    
						//调用跳转详情方法
						budgetFill.toDetails();
					} else {
						$('.page1').hide();
						//拼接暂无数据效果
						htmlTbody.append(budgetFill.noDataTrStr(8));
					}
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	//审批按钮操作事件
	goApprovePage:function(){
		//审批按钮点击事件
		$(".apprv-btn").off().click(function(){
			var tableId = $(this).parents("tr").data("dataTr").tableId;
			var processInstanceId =  $(this).parents("tr").data("dataTr").processInstanceId;
			var publishId = $(this).parents("tr").data("dataTr").publishId;
			//代表审批操作
			var detailsA = 2;
			window.location.href=$yt_option.websit_path+"view/system-sasac/budget/module/expenditure/budgetFillDetails.html?publishId="+publishId+"&detailsA="+detailsA;
		});
	},
	/*点击编号  查看详情*/
	toDetails: function() {
		$('.yt-link.to-detail').off().on('click', function() {
			/*调用阻止冒泡方法*/
			//budgetFill.eventStopPageaction();
			/*获取id*/
			var tableId = $(this).parents("tr").data("dataTr").tableId;
			var publishId = $(this).parents("tr").data("dataTr").publishId;
			//代表详情
			var detailsA = 1;
			window.location.href=$yt_option.websit_path+"view/system-sasac/budget/module/expenditure/budgetFillDetails.html?publishId="+publishId+"&detailsA="+detailsA;
		});
		
		//流程状态链接事件绑定
		$(".process-state").click(function(){
			//获取流程实例ID
			var processInstanceId=$(this).parents("tr").find(".processInstanceId").val();
			sysCommon.processStatePop(processInstanceId);
		});
	},
	/**
	 * 
	 * 获取 已处理 已完成 列表数据 
	 * WF_SUSPENDING_QUERY_SQL_PARAMS  已处理
	 * WF_COMPLETED_QUERY_SQL_PARAMS   已完成
	 * @param {Object} stateCode
	 */
	getProcessingAndFinishList: function() {
		var status = $('.active-li input').val();
	//	var budgetYear = $(".budget-year").val();
		var budgetStage = $(".budget-radio .yt-radio input:checked").val();
		$('.page2').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: "budget/report/getUserBudgetReportAppInfoWFListToPageByParams", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				queryStateParams: status,
		//		budgetYear: budgetYear,
				budgetStage:budgetStage
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
							//编制状态( 1 未开始 2 编制中 3 编制完成)
							var editorStage = "";
							if(n.editorStage == "1"){
								editorStage = "未开始";
							}else if(n.editorStage == "2"){
								editorStage = "编制中";
							}else if(n.editorStage == "3"){
								editorStage = "编制完成";
							}
							trStr += '<tr>' +
								'<td><a class="yt-link to-detail">' + n.reportNum + '</a><input type="hidden" class="hid-reim-id" value="' + n.tableId + '"/><input type="hidden" class="processInstanceId" value="'+n.processInstanceId+'"/></td>' +
								'<td>' + n.sourceDeptName + '</td>' +
								'<td>' + n.budgetTypeName + '</td>' +
								'<td>' + n.tableName + '</td>' +
								'<td>' + n.budgetStageName + '</td>' +
								'<td>' + editorStage + '</td>' +
								'<td>' + n.submitRemainTimeShort + '</td>' ;
								//判断当前选中的如果是待处理显示当前状态字段
								if(status == 'WF_SOLVED_QUERY_SQL_PARAMS'){
									trStr +='<td style="text-align:left;"><span class="yt-link process-state">' + n.nodeNowState + '</span></td>';  //流程状态
								}
								trStr +='<td><a class="yt-link log-mod">日志</a></td></tr>';
								trStr = $(trStr).data("dataTr",n);
						    	htmlTbody.append(trStr);
						});
						//调用流程日志提示窗口
						sysCommon.initQtip($(".log-mod"));
						//绑定去详情页面
						budgetFill.toDetails();
					} else {
						$('.page2').hide();
						//拼接暂无数据效果
						htmlTbody.append(budgetFill.noDataTrStr(8));
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
	}
	
}

$(function() {
	budgetFill.init();
	// tab切换
	budgetFill.switcher();
	//获取参数 审批页面提交定位至已处理tab页
	var state = $yt_common.GetRequest().state;
	if(state){
		$('.tab-header .tab-li').removeClass('active-li');
		$('.tab-header .tab-li').eq(1).addClass('active-li');
		$('.tab-content').eq(1).css("display", 'block').siblings('.tab-content').hide();
	}
	//调用获取选中的Tab状态
	budgetFill.searchList();
	$("#reimApproList").css("min-height", $(window).height() - 12);
});