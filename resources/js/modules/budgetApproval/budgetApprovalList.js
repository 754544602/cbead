var budgetApprovalList = {
	//初始化方法
	init: function() {
		$(".yt-select").niceSelect();
		//日期控件
		$(".search-box1 .start-time-start").calendar({
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $(".search-box1 .start-time-end") //开始日期最大为结束日期  
		});
		$(".search-box1 .start-time-end").calendar({
			nowData: false, //默认选中当前时间,默认true  
			lowerLimit: $(".search-box1 .start-time-start") //结束日期最小为开始日期  
		});
		$(".search-box1 .end-time-start").calendar({
			dateFmt:"yyyy-MM-dd HH:mm",
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $(".search-box1 .end-time-end") //开始日期最大为结束日期  
		});
		$(".search-box1 .end-time-end").calendar({
			dateFmt:"yyyy-MM-dd HH:mm",
			nowData: false, //默认选中当前时间,默认true  
			lowerLimit: $(".search-box1 .end-time-start") //结束日期最小为开始日期  
		});
		$(".search-box2 .start-time-start").calendar({
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $(".search-box2 .start-time-end") //开始日期最大为结束日期  
		});
		$(".search-box2 .start-time-end").calendar({
			nowData: false, //默认选中当前时间,默认true  
			lowerLimit: $(".search-box2 .start-time-start") //结束日期最小为开始日期  
		});
		$(".search-box2 .end-time-start").calendar({
			dateFmt:"yyyy-MM-dd HH:mm",
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $(".search-box2 .end-time-end") //开始日期最大为结束日期  
		});
		$(".search-box2 .end-time-end").calendar({
			dateFmt:"yyyy-MM-dd HH:mm",
			nowData: false, //默认选中当前时间,默认true  
			lowerLimit: $(".search-box2 .end-time-start") //结束日期最小为开始日期  
		});
		var index = 0;
		var backType = $yt_common.GetQueryString('backType');
		if(backType == 1){
			$(".pending-approval-tab").eq(1).removeClass("active");
			//标识加载的是待审批列表还是审批记录列表
			budgetApprovalList.getPendingBudgetApprovalListInf();
		}else if(backType == 2){//审批记录
			$(".pending-approval-tab").removeClass("active");
			$(".approval-record-tab").addClass("active");
			$(".box-list .content-box").hide().eq(0).hide();
			$(".box-list .content-box").hide().eq(1).show();
			index = 1;
			//初始化搜索框
			$(".approval-record-selectParam").val(""); 
			//审批记录页签
			budgetApprovalList.getApprovalRecordListInf();
		}else{
			//标识加载的是待审批列表还是审批记录列表
			budgetApprovalList.getPendingBudgetApprovalListInf();
		}
		//高级搜索
		budgetApprovalList.hideSearch();
		//点击页签切换页
		$(".tab-title-list button").click(function() {
			$(this).addClass("active").siblings().removeClass("active");
			$(".box-list .content-box").hide().eq($(this).index()).show();
			if($(this).index() == 0) {//待审批
				index = 0;
				//初始化搜索框
				$(".pending-approval-selectParam").val("");
				//待审批页签
				budgetApprovalList.getPendingBudgetApprovalListInf();
				
			};
			if($(this).index() == 1) {//审批记录
				index = 1;
				//初始化搜索框
				$(".approval-record-selectParam").val(""); 
				//审批记录页签
				budgetApprovalList.getApprovalRecordListInf();
				//高级搜索
			}
		});
		
		
		//点击待审批中项目名称跳转到审批详情页面
		$(".budget-approval-tbody").on("click",".project-name-approval",function(){
			sessionStorage.setItem("searchParams", $('.pending-approval-selectParam').val());
			sessionStorage.setItem("pageIndexs", $('.budget-approval-page .num-text.active').text());
			window.location.href="/cbead/website/view/budgetApproval/budgetApprovalDetails.html?pkId=" + $('.yt-table-active .pkId').val();
		});
		//点击审批记录中项目名称跳转到审批详情页面
		$(".approval-record-tbody").on("click",".project-name-approval",function(){
			sessionStorage.setItem("searchParams", $('.pending-approval-selectParam').val());
			sessionStorage.setItem("pageIndexs", $('.num-text.active').text());
			window.location.href="/cbead/website/view/projectBudget/projectBudgetDetails.html?history=oldApprove&pkId=" + $('.yt-table-active .pkId').val();
		});
		//模糊查询
		$(".search-btn").click(function(){
			$('.search-box1 #projectStates').setSelectVal("");
			$('.search-box1 #projectType').setSelectVal("");
			$('.search-box1 input.yt-input').val("");
			$('.search-box1 input.calendar-input').val("");
			$('.search-box2 #projectState').setSelectVal("");
			$('.search-box2 #projectTypes').setSelectVal("");
			$('.search-box2 input.yt-input').val("");
			$('.search-box2 input.calendar-input').val("");
			if(index == 0){
				budgetApprovalList.getPendingBudgetApprovalListInf();
			}else if(index == 1) {
				budgetApprovalList.getApprovalRecordListInf();
			}
			
		});
	
		
		
	},
		
	/**
	 * 待审批列表查询
	 */
	getPendingBudgetApprovalListInf: function() {
		sessionStorage.getItem("searchParams")?$('.pending-approval-selectParam').val(sessionStorage.getItem("searchParams")):'';
		var selectParam=$(".pending-approval-selectParam").val(); 
		var projectCode=$(".search-box1 .project-code").val();
		var projectName=$(".search-box1 .project-name").val();
		var projectType=$(".search-box1 #projectType").val();
		var projectHead=$(".search-box1 .project-head").val();
		var startDateStart=$(".search-box1 .start-time-start").val();
		var startDateEnd=$(".search-box1 .start-time-end").val();
		var createTimeStart=$(".search-box1 .end-time-start").val();
		var createTimeEnd=$(".search-box1 .end-time-end").val();
		var trainDateStart=$(".search-box1 .train-start").val();
		var trainDateEnd=$(".search-box1 .train-end").val();
		var surplusBudgetStart=$(".search-box1 .super-start").val();
		var surplusBudgetEnd=$(".search-box1 .super-end").val();
		var types=$(".search-box1 #projectStates").val();
		$('.budget-approval-page').pageInfo({
			pageIndexs: sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "finance/projectBudget/lookForAllByApproved", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam:selectParam,
				projectCode:projectCode,
				projectName:projectName,
				projectType:projectType,
				projectHead:projectHead,
				startDateStart:startDateStart,
				startDateEnd:startDateEnd,
				createTimeStart:createTimeStart,
				createTimeEnd:createTimeEnd,
				trainDateStart:trainDateStart,
				trainDateEnd:trainDateEnd,
				surplusBudgetStart:surplusBudgetStart,
				surplusBudgetEnd:surplusBudgetEnd,
				types:types
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			async:true,
			before:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				sessionStorage.clear();
				if(data.flag == 0) {
					var htmlTbody = $('.budget-approval-tbody');
					var htmlTr = '';
					if(data.data.rows.length > 0) {
						$.each(data.data.rows, function(i, v) {
							if(v.projectType==1){
								v.projectType="计划"
							}
							else if(v.projectType==2){
								v.projectType="委托"
							}
							else if(v.projectType==3){
								v.projectType="选学"
							}
							else if(v.projectType==4){
								v.projectType="中组部调训"
							}
							else if(v.projectType==5){
								v.projectType="国资委调训"
							}
							if(v.types==1){
								v.types="预算申请"
							}
							if(v.types==2){
								v.types="预算变更"
							}
							htmlTr += '<tr>' +
								'<td><a class="file-name"><input type="hidden" value="' + v.pkId + '" class="pkId">'+v.projectCode+'</a></td>' +
								'<td style="text-align: left;"><a style="color:#3c4687;" href="#" class="project-name-approval">' + v.projectName + '</a></td>' +
								'<td style="text-align: center;">' + v.projectType + '</td>' +
								'<td style="text-align: left;">' + v.projectHead + '</td>' +
								'<td>' + v.startDate + '</td>' +
								'<td style="text-align: right;">' + v.trainDate + '</td>' +
								'<td>' + v.createTime + '</td>' +
								'<td style="text-align: right;">' + Number(v.budgetTotal).toFixed(2) + '</td>' +
								'<td style="text-align: center;">' + v.types + '</td>' +
								'<td style="text-align: center;">' + v.dealingWithPeople + '</td>' +
								'</tr>';
								$(".budget-approval-page").show();
						});
					} else {
						$(".budget-approval-page").hide();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="10" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
					}
					htmlTbody.html(htmlTr);
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function (){
						$yt_alert_Model.prompt("查询失败");
					});
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	/**
	 * 审批记录列表查询
	 */
	getApprovalRecordListInf: function() {
		sessionStorage.getItem("searchParams")?$('.pending-approval-selectParam').val(sessionStorage.getItem("searchParams")):'';
		var selectParam=$(".approval-record-selectParam").val(); 
		var projectCode=$(".search-box2 .project-code").val();
		var projectName=$(".search-box2 .project-name").val();
		var projectType=$(".search-box2 #projectTypes").val();
		var projectHead=$(".search-box2 .project-head").val();
		var startDateStart=$(".search-box2 .start-time-start").val();
		var startDateEnd=$(".search-box2 .start-time-end").val();
		var createTimeStart=$(".search-box2 .end-time-start").val();
		var createTimeEnd=$(".search-box2 .end-time-end").val();
		var trainDateStart=$(".search-box2 .train-start").val();
		var trainDateEnd=$(".search-box2 .train-end").val();
		var surplusBudgetStart=$(".search-box2 .super-start").val();
		var surplusBudgetEnd=$(".search-box2 .super-end").val();
		var types=$(".search-box2 #projectState").val();
		$('.approval-record-page').pageInfo({
			async:true,
			pageIndexs: sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "finance/projectBudget/lookForAllByHi", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam:selectParam,
				projectCode:projectCode,
				projectName:projectName,
				projectType:projectType,
				projectHead:projectHead,
				startDateStart:startDateStart,
				startDateEnd:startDateEnd,
				createTimeStart:createTimeStart,
				createTimeEnd:createTimeEnd,
				trainDateStart:trainDateStart,
				trainDateEnd:trainDateEnd,
				surplusBudgetStart:surplusBudgetStart,
				surplusBudgetEnd:surplusBudgetEnd,
				types:types
			}, //ajax查询访问参数
			before:function (){
				$yt_baseElement.showLoading();
			},
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				sessionStorage.clear();
				if(data.flag == 0) {
					var htmlTbody = $('.approval-record-tbody');
					var htmlTr = '';
					if(data.data.rows.length!=0) {
						$.each(data.data.rows, function(i, v) {
							if(v.projectType==1){
								v.projectType="计划"
							}
							else if(v.projectType==2){
								v.projectType="委托"
							}
							else if(v.projectType==3){
								v.projectType="选学"
							}
							else if(v.projectType==4){
								v.projectType="中组部调训"
							}
							else if(v.projectType==5){
								v.projectType="国资委调训"
							}
							if(v.types==1){
								v.types="预算申请"
							}
							if(v.types==2){
								v.types="预算变更"
							}
							htmlTr += '<tr>' +
								'<td><a class="file-name"><input type="hidden" value="' + v.pkId + '" class="pkId">'+v.projectCode+'</a></td>' +
								'<td style="text-align: left;"><a style="color:#3c4687;" href="#" class="project-name-approval">' + v.projectName + '</a></td>' +
								'<td style="text-align: center;">' + v.projectType + '</td>' +
								'<td style="text-align: left;">' + v.projectHead + '</td>' +
								'<td>' + v.startDate + '</td>' +
								'<td style="text-align: right;">' + v.trainDate + '</td>' +
								'<td>' + v.createTime + '</td>' +
								'<td style="text-align: right;">' + Number(v.budgetTotal).toFixed(2) + '</td>' +
								'<td style="text-align: center;">' + v.types + '</td>' +
								'<td style="text-align: center;">' + v.dealingWithPeople + '</td>' +
								'</tr>';
								$(".approval-record-page").show();
						});
					} else {
						$(".approval-record-page").hide();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="10" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
					}
					htmlTbody.html(htmlTr);
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function (){
						$yt_alert_Model.prompt("查询失败");
					});
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	/**
	 * 高级搜索
	 */
	hideSearch:function(){
		//待审批页签高级搜索
		var clickTime=0;
		$("button.senior-search-btn").click(function(e){
			if(clickTime%2==0){
				$(".pending-approval-selectParam").val('');
				$("button.senior-search-btn img").addClass('flipy');
				$(".search-box1").show();
			}else{
//				$('.search-box1 #projectStates').setSelectVal("");
//				$('.search-box1 #projectType').setSelectVal("");
//				$('.search-box1 input.yt-input').val("");
//				$('.search-box1 input.calendar-input').val("");
				$("button.senior-search-btn img").removeClass('flipy');
				$(".search-box1").hide();
			}
			clickTime++;
			e.stopPropagation();
		});
		//审批记录页签高级搜索
		var clickTimes=0;
		$("button.search-record-btn").click(function(e){
			if(clickTimes%2==0){
				$(".approval-record-selectParam").val('');
				$("button.search-record-btn img").addClass('flipy');
				$(".search-box2").show();
			}else{
//				$('.search-box2 #projectState').setSelectVal("");
//				$('.search-box2 #projectTypes').setSelectVal("");
//				$('.search-box2 input.yt-input').val("");
//				$('.search-box2 input.calendar-input').val("");
				$("button.search-record-btn img").removeClass('flipy');
				$(".search-box2").hide();
			}
			clickTimes++;
			e.stopPropagation();
		});
		$(document).click(function(e){
			clickTime=0;
			clickTimes=0;
			$("button.search-record-btn img").removeClass('flipy');
			$(".search-box1").hide();
			$(".search-box2").hide();
//			$('.search-box1 #projectStates').setSelectVal("");
//			$('.search-box1 #projectType').setSelectVal("");
//			$('.search-box1 input.yt-input').val("");
//			$('.search-box1 input.calendar-input').val("");
//			$('.search-box2 #projectState').setSelectVal("");
//			$('.search-box2 #projectTypes').setSelectVal("");
//			$('.search-box2 input.yt-input').val("");
//			$('.search-box2 input.calendar-input').val("");
		});
		$(".search-box1,.search-box2").click(function(e){
			e.stopPropagation();
		});
		$(document).on('click','.calendar',function(e){
			e.stopPropagation();
		});
		//点击待审批弹框搜索按钮
		$(".search-box1 .yt-model-sure-btn").click(function(){
			budgetApprovalList.getPendingBudgetApprovalListInf();
		});
		//点击待审批弹框清空按钮
		$(".search-box1 .yt-model-reset-btn").click(function(){
			$('.search-box1 #projectStates').setSelectVal("");
			$('.search-box1 #projectType').setSelectVal("");
			$('.search-box1 input.yt-input').val("");
			$('.search-box1 input.calendar-input').val("");
		});
		//点击审批记录弹框搜索按钮
		$(".search-box2 .yt-model-sure-btn").click(function(){
			budgetApprovalList.getApprovalRecordListInf();
		});
		//点击审批记录弹框清空按钮
		$(".search-box2 .yt-model-reset-btn").click(function(){
			$('.search-box2 #projectState').setSelectVal("");
			$('.search-box2 #projectTypes').setSelectVal("");
			$('.search-box2 input.yt-input').val("");
			$('.search-box2 input.calendar-input').val("");
		});
	}
}

$(function() {
	//初始化方法
	budgetApprovalList.init();
	
});