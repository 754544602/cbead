var BudgetList = {
	//初始化方法
	init: function() {
		//初始化下拉框
		$("#project-states").niceSelect();
		//日期控件
		$(".start-time-start").calendar({
			controlId: "startDate",
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $(".start-time-end") //开始日期最大为结束日期  
		});
		$(".start-time-end").calendar({
			controlId: "endDate",
			nowData: false, //默认选中当前时间,默认true  
			lowerLimit: $(".start-time-start") //结束日期最小为开始日期  
		});
		$(".end-time-start").calendar({
			controlId: "startDate",
			dateFmt:"yyyy-MM-dd HH:mm",
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $(".end-time-end") //开始日期最大为结束日期  
		});
		$(".end-time-end").calendar({
			controlId: "endDate",
			dateFmt:"yyyy-MM-dd HH:mm",
			nowData: false, //默认选中当前时间,默认true  
			lowerLimit: $(".end-time-start") //结束日期最小为开始日期  
		});
		$(".search-box #projectStates").niceSelect();
		//点击删除
		$(".budget-delete-list").click(function() {
			//判断是否有选中行
			if($("tr.yt-table-active").length == 0) {
				$yt_alert_Model.prompt("请选择要删除的数据");
				return false;
			} else {
				if($("tr.yt-table-active").find('.workFlawState').text() == '草稿' || $("tr.yt-table-active").find('.workFlawState').text() == '未通过') {
					//调用删除方法  删除被选中的数据
					BudgetList.delBankBillList();
				} else {
					$yt_alert_Model.prompt("只可删除草稿与未通过的数据");
				}
			}
		});
		//点击新增
		$(".budget-add-list").click(function() {
			window.location.href = "/cbead/website/view/projectBudget/addBudGetList.html";
		});
		//点击修改
		$(".budget-update-list").click(function() {
			//判断是否有选中行
			if($("tr.yt-table-active").length == 0) {
				$yt_alert_Model.prompt("请选择要修改的数据");
				return false;
			} else {
				if($("tr.yt-table-active").find('.workFlawState').text() == '草稿' || $("tr.yt-table-active").find('.workFlawState').text() == '未通过') {
					if($("tr.yt-table-active").data('data').types==2){
						window.location.href = "/cbead/website/view/projectBudget/projectBudgetChange.html?pkId=" + $('.yt-table-active .pkId').val();
					}else{
						window.location.href = "/cbead/website/view/projectBudget/addBudGetList.html?pkId=" + $('.yt-table-active .pkId').val();
					}
				} else {
					$yt_alert_Model.prompt("只可修改草稿与未通过的数据");
				}
			}
		});
		//点击项目名称
		$(".budget-tbody").on('click', '.project-name-details', function() {
			var pkId = $(this).parent().parent().find(".pkId").val();
			var workFlawState = $(this).parent().parent().find(".workFlawState").text();
			sessionStorage.setItem("searchParams", $('#keyword').val());
			sessionStorage.setItem("pageIndexs", $('.budget-page .num-text.active').text());
			if (workFlawState == "草稿" || workFlawState == "未通过"){//跳转到可修改页面
				window.location.href = "/cbead/website/view/projectBudget/addBudGetList.html?pkId=" + pkId;
			}else{//跳转到详情页
				window.location.href="/cbead/website/view/projectBudget/projectBudgetDetails.html?pkId=" + pkId;
				//window.location.href="/cbead/website/view/projectBudget/projectBudgetDetails.html?pkId=" + pkId;
			}
			
		});
		//点击预算变更
		$(".budget-change-list").click(function() {
			//判断是否有选中行
			if($("tr.yt-table-active").length == 0) {
				$yt_alert_Model.prompt("请选择要操作的数据");
				return false;
			}else{
				if($("tr.yt-table-active").find('.workFlawState').text() == '已通过'||$("tr.yt-table-active").find('.workFlawState').text() == '变更已通过'){
					window.location.href = "projectBudgetChange.html?pkId=" + $('.yt-table-active .pkId').val();
				}else{
					$yt_alert_Model.prompt("只可变更已通过的数据");
				}
			}
		});
		//模糊查询
		$(".search-btn").click(function() {
			$(".search-box #projectStates").setSelectVal("");
			$('.search-box input.yt-input').val("");
			$('.search-box input.calendar-input').val("");
			BudgetList.getBudgetListInf();
		});
		//高级查询
		BudgetList.hideSearch();
		//调用获取列表数据方法
		BudgetList.getBudgetListInf();
	},

	/**
	 * 获取列表数据
	 */
	getBudgetListInf: function() {
		sessionStorage.getItem("searchParams")?$('.selectParam').val(sessionStorage.getItem("searchParams")):'';
		var selectParam = $(".selectParam").val();
		var projectCode=$(".search-box .project-code").val();
		var projectName=$(".search-box .project-name").val();
		var projectHead=$(".search-box .project-head").val();
		var startDateStart=$(".search-box .start-time-start").val();
		var startDateEnd=$(".search-box .start-time-end").val();
		var createTimeStart=$(".search-box .end-time-start").val();
		var createTimeEnd=$(".search-box .end-time-end").val();
		var implementationRateStart=$(".search-box .imp-start").val();
		var implementationRateEnd=$(".search-box .imp-end").val();
		var workFlawState=$(".search-box #projectStates").val();
		var trainDateStart=$(".search-box .train-date-start").val();
		var trainDateEnd=$(".search-box .train-date-end").val();
		var surplusBudgetStart=$(".search-box .surplus-udget-start").val();
		var surplusBudgetEnd=$(".search-box .surplus-udget-end").val();
		var budgetTotalStart=$(".search-box .budget-total-start").val();
		var budgetTotalEnd=$(".search-box .budget-total-end").val();
		$('.budget-page').pageInfo({
			pageIndexs: sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "finance/projectBudget/lookForAll", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam: selectParam,
				projectCode:projectCode,
				projectName:projectName,
				projectHead:projectHead,
				startDateStart:startDateStart,
				startDateEnd:startDateEnd,
				createTimeStart:createTimeStart,
				createTimeEnd:createTimeEnd,
				implementationRateStart:implementationRateStart,
				implementationRateEnd:implementationRateEnd,
				workFlawState:workFlawState,
				trainDateStart:trainDateStart,
				trainDateEnd:trainDateEnd,
				surplusBudgetStart:surplusBudgetStart,
				surplusBudgetEnd:surplusBudgetEnd,
				budgetTotalStart:budgetTotalStart,
				budgetTotalEnd:budgetTotalEnd
				}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			async:true,
			before:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				sessionStorage.clear();
				if(data.flag == 0) {
					var htmlTbody = $('.budget-tbody').empty();
					var htmlTr = '';
					if(data.data.rows.length > 0) {
						var cstyle = "right";
						$.each(data.data.rows, function(i, v) {
							if (v.workFlawState == "草稿") {
								v.createTime = "";
							}
							if(v.workFlawState != "已通过" && v.types == "1"){
								v.implementationRate = "--";
								v.surplusBudget = "--";
								cstyle = "center";
							}else{
								cstyle = "right";
								v.implementationRate = v.implementationRate.toFixed(2)
								v.surplusBudget = $yt_baseElement.fmMoney(v.surplusBudget);
							}
							if(v.createTime == null){
								v.createTime = "";
							}
							htmlTr = '<tr>' +
								'<td><a style="text-decoration:none;color:black;" class="file-name"><input type="hidden" value="' + v.pkId + '" class="pkId">' + v.projectCode + '</a></td>' +
								'<td style="text-align: left;"><a href="#" class="project-name-details" style="color:#3c4687;">' + v.projectName + '</a></td>' +
								'<td style="text-align: left;">' + v.projectHead + '</td>' +
								'<td>' + v.startDate + '</td>' +
								'<td style="text-align: right;">' + v.trainDate + '</td>' +
								'<td>' + v.createTime + '</td>' +
								'<td style="text-align: right;">' + Number(v.budgetTotal).toFixed(2) + '</td>' +
								'<td class="workFlawState">' + v.workFlawState + '</td>' +
								'<td style="text-align: '+cstyle+';">' + v.implementationRate + '</td>' +
								'<td style="text-align: '+cstyle+';">' + v.surplusBudget + '</td>' +
								'</tr>';
							$(".budget-page").show();
							htmlTr = $(htmlTr).data('data',v);
							htmlTbody.append(htmlTr);
						});
					} else {
						$(".budget-page").hide();
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="10" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						htmlTbody.append(htmlTr);
					}
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	//删除
	delBankBillList: function() {
		var pkId = $('.yt-table-active .pkId').val();
		$yt_alert_Model.alertOne({
			haveCloseIcon: false, //是否带有关闭图标  
			closeIconUrl: "", //关闭图标路径  
			leftBtnName: "确定", //左侧按钮名称,默认确定  
			rightBtnName: "取消", //右侧按钮名称,默认取消  
			cancelFunction: "", //取消按钮操作方法*/  
			alertMsg: "数据删除将无法恢复，确认删除吗？", //提示信息  
			confirmFunction: function() { //点击确定按钮执行方法  
				$.ajax({
					type: "post",
					url: $yt_option.base_path + "finance/projectBudget/removeBeanById",
					data: {
						pkId: pkId
					},
					success: function(data) {
						if(data.flag == 0) {
							$yt_alert_Model.prompt("删除成功");
							$('.budget-page').pageInfo("refresh");
						} else {
							$yt_alert_Model.prompt("不能删除");
						}

					}

				});

			}
		});
	},
	/**
	 * 高级搜索
	 */
	hideSearch:function(){
		var clickTime=0;
		$("button.senior-search-btn").click(function(e){
			if(clickTime%2==0){
				$(".selectParam").val('');
				$('.search-box').show();
				$('.search-put').addClass('flipy');
			}else{
//				$(".search-box #projectStates").setSelectVal("");
//				$('.search-box input.yt-input').val("");
//				$('.search-box input.calendar-input').val("");
				$('.search-box').hide();
				$('.search-put').removeClass('flipy');
			}
			clickTime++;
			e.stopPropagation();
		});
		$(document).click(function(e){
			clickTime=0;
//			$(".selectParam").val('');
//			$(".search-box #projectStates").setSelectVal("");
//			$('.search-box input.yt-input').val("");
//			$('.search-box input.calendar-input').val("");
			$('.search-box').hide();
			$('.search-put').removeClass('flipy');
			e.stopPropagation();
		});
		//点击弹框搜索按钮
		$(".search-box .yt-model-sure-btn").click(function(){
			BudgetList.getBudgetListInf();
		});
		//点击弹框清空按钮
		$(".search-box .yt-model-reset-btn").click(function(){
			$(".search-box #projectStates").setSelectVal("");
			$('.search-box input.yt-input').val("");
			$('.search-box input.calendar-input').val("");
		});
	}
}
$(function() {
	//初始化方法
	BudgetList.init();

});