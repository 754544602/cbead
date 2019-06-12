var budgetQueryList = {
	//初始化方法
	init: function() {
		$(".yt-select").niceSelect();
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
		//调用获取列表数据方法
		budgetQueryList.getbudgetQueryListInf();
		
		//点击待审批中项目名称跳转到审批详情页面
		$(".budget-query-tbody").on("click",".project-name-query",function(){
			sessionStorage.setItem("searchParams", $('.selectParam').val());
			sessionStorage.setItem("pageIndexs", $('.budget-query-page .num-text.active').text());
			window.location.href="/cbead/website/view/projectBudget/projectBudgetDetails.html?pkId=" + $('.yt-table-active .pkId').val();
		});
		//模糊查询
		$(".search-btn").click(function(){
			$('.search-box input.yt-input').val("");
			$('.search-box input.calendar-input').val("");
			budgetQueryList.getbudgetQueryListInf();
		});
		//高级查询
		budgetQueryList.hideSearch();
	},
		
	/**
	 * 获取列表数据
	 */
	getbudgetQueryListInf: function() {
		sessionStorage.getItem("searchParams")?$('#keyword').val(sessionStorage.getItem("searchParams")):'';
		var selectParam=$(".selectParam").val(); 
		var projectCode=$(".search-box .project-code").val();
		var projectName=$(".search-box .project-name").val();
		var projectHead=$(".search-box .project-head").val();
		var startDateStart=$(".search-box .start-time-start").val();
		var startDateEnd=$(".search-box .start-time-end").val();
		var createTimeStart=$(".search-box .end-time-start").val();
		var createTimeEnd=$(".search-box .end-time-end").val();
		var trainDateStart=$(".search-box .train-start").val();
		var trainDateEnd=$(".search-box .train-end").val();
		var surplusBudgetStart=$(".search-box .surpl-start").val();
		var surplusBudgetEnd=$(".search-box .surpl-end").val();
		var implementationRateStart=$(".search-box .imp-start").val();
		var implementationRateEnd=$(".search-box .imp-end").val();
		var budgetTotalStart=$(".search-box .budge-start").val();
		var budgetTotalEnd=$(".search-box .budge-end").val();
		$('.budget-query-page').pageInfo({
			pageIndexs: sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "finance/projectBudget/lookForAllByFinished", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam:selectParam,
				projectCode:projectCode,
				projectName:projectName,
				projectHead:projectHead,
				startDateStart:startDateStart,
				startDateEnd:startDateEnd,
				createTimeStart:createTimeStart,
				createTimeEnd:createTimeEnd,
				trainDateStart:trainDateStart,
				trainDateEnd:trainDateEnd,
				surplusBudgetStart:surplusBudgetStart,
				surplusBudgetEnd:surplusBudgetEnd,
//				types:types,
				implementationRateStart:implementationRateStart,
				implementationRateEnd:implementationRateEnd,
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
				$yt_baseElement.showLoading();
				if(data.flag == 0) {
					var htmlTbody = $('.budget-query-tbody');
					var htmlTr = '';
					if(data.data.rows.length > 0) {
						$.each(data.data.rows, function(i, v) {
							v.workFlawState=='已完成'?v.workFlawState='已通过':v.workFlawState=v.workFlawState;
							htmlTr += '<tr>' +
								'<td><a class="file-name" ><input type="hidden" value="' + v.pkId + '" class="pkId">'+v.projectCode+'</a></td>' +
								'<td style="text-align: left;"><a href="#" class="project-name-query" style="color:#3c4687;">' + v.projectName + '</a></td>' +
								'<td style="text-align: left;">' + v.projectHead + '</td>' +
								'<td>' + v.startDate + '</td>' +
								'<td style="text-align: right;">' + v.trainDate + '</td>' +
								'<td>' + v.createTime + '</td>' +
								'<td style="text-align: right;">' + Number(v.budgetTotal).toFixed(2) + '</td>' +
								'<td style="text-align: left;">' + v.workFlawState + '</td>' +
								'<td style="text-align: right;">' + v.implementationRate + '</td>' +
								'<td style="text-align: right;">' + $yt_baseElement.fmMoney(v.surplusBudget) + '</td>' +
								'</tr>';
								$(".budget-query-page").show();
						});
					} else {
						$(".budget-query-page").hide();
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
		var clickTIme=0;
		$("button.senior-search-btn").click(function(e){
			if(clickTIme%2==0){
				$(".selectParam").val('');
				$(".search-box").show();
				$(".search-put").addClass('flipy');
			}else{
				$(".search-box").hide();
//				$('.search-box input.yt-input').val("");
//				$('.search-box input.calendar-input').val("");
				$(".search-put").removeClass('flipy');
			}
			clickTIme++;
			e.stopPropagation();
		});	
		$(document).click(function(e){
			clickTIme=0;
			$(".search-box").hide();
//			$('.search-box input.yt-input').val("");
//			$('.search-box input.calendar-input').val("");
			$(".search-put").removeClass('flipy');
			e.stopPropagation();
		});
		//点击弹框搜索按钮
		$(".search-box .yt-model-sure-btn").click(function(){
			budgetQueryList.getbudgetQueryListInf();
		});
		//点击弹框清空按钮
		$(".search-box .yt-model-reset-btn").click(function(){
			$('.search-box input.yt-input').val("");
			$('.search-box input.calendar-input').val("");
		});
	}
}
$(function() {
	//初始化方法
	budgetQueryList.init();
	
});