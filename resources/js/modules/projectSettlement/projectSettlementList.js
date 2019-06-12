var projectSettlementList = {
	//初始化方法
	init: function() {
		//下拉控件
		$(".yt-select").niceSelect();
		//初始化日期控件
		$(".start-time-start").calendar({
			controlId: "startDate",
			dateFmt:"yyyy-MM-dd",
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $(".start-time-end") //开始日期最大为结束日期  
		});
		$(".start-time-end").calendar({
			controlId: "endDate",
			dateFmt:"yyyy-MM-dd",
			nowData: false, //默认选中当前时间,默认true  
			lowerLimit: $(".start-time-start") //结束日期最小为开始日期  
		});$(".end-time-start").calendar({
			controlId: "startDate",
			dateFmt:"yyyy-MM-dd",
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $(".end-time-end") //开始日期最大为结束日期  
		});
		$(".end-time-end").calendar({
			controlId: "endDate",
			dateFmt:"yyyy-MM-dd",
			nowData: false, //默认选中当前时间,默认true  
			lowerLimit: $(".end-time-start") //结束日期最小为开始日期  
		});
		$(".search-startDate").calendar({
			controlId: "startDates",
			nowData: true, //默认选中当前时间,默认true  
			dateFmt:"yyyy-MM",
			callback:function(){
				if(new Date($(".search-endDate").val())<new Date($(".search-startDate").val())){
					$(".search-endDate").val($(".search-startDate").val());
				}
				projectSettlementList.getSettlementListInf();
			}
		});
		$(".search-endDate").calendar({
			controlId: "endDates",
			nowData: true, //默认选中当前时间,默认true  
			dateFmt:"yyyy-MM",
			callback:function(){
				if(new Date($(".search-endDate").val())<new Date($(".search-startDate").val())){
					$(".search-startDate").val($(".search-endDate").val());
				}
				projectSettlementList.getSettlementListInf();
			}
		});
		sessionStorage.getItem("startDate")?$('.search-startDate').val(sessionStorage.getItem("startDate")):'';
		sessionStorage.getItem("endDate")?$('.search-endDate').val(sessionStorage.getItem("endDate")):'';
		//调用获取列表数据方法
		projectSettlementList.getSettlementListInf();
		$(".settlement-tbody").on("click",".project-name",function(){
			var projectCode = $(this).parents("tr").find('td.project-code').text();//获取班级编号
			var pkId = $(".yt-table-active .pkId").val();
			var projectCode = $(".yt-table-active .project-code").text();
			var projectType = $(".yt-table-active .projectType").val();
			sessionStorage.setItem("startDate", $(".search-startDate").val());
			sessionStorage.setItem("endDate", $(".search-endDate").val());
			sessionStorage.setItem("searchParams", $('.selectParam').val());
			sessionStorage.setItem("pageIndexs", $('.settlement-page .num-text.active').text());
			window.location.href="projectDetails.html?pkId=" + pkId + "&projectCode="+ projectCode + "&projectType="+ projectType+'&pageIndexs='+$('.num-text.change-btn.active').text();
		});
		//模糊查询
		$(".key-word .search-btn").click(function(){
			//重置高级搜索
			projectSettlementList.resertForm();
			projectSettlementList.getSettlementListInf();
		});
		//高级搜索
		projectSettlementList.hideSearch();
	},
	/**
	 * 重置弹出框
	 */
	resertForm:function(){
		$(".search-box input").val("");
		$(".search-box .yt-select").setSelectVal("");
	},
	/**
	 * 获取列表数据
	 */
	getSettlementListInf: function() {
		sessionStorage.getItem("searchParams")?$('.selectParam').val(sessionStorage.getItem("searchParams")):'';
		selectParam=$(".selectParam").val(); 
		var projectCode=$(".project-code").val();
		var projectName=$(".project-name").val();
		var projectSell=$(".project-sell").val();
		var projectHead=$(".project-head").val();
		var projectStartDateStart=$(".start-time-start").val();
		var projectStartDateEnd=$(".start-time-end").val();
		var projectEndDateStart=$(".end-time-start").val();
		var projectEndDateEnd=$(".end-time-end").val();
		//应收
		var amountReceivableStart=$(".amount-start").val();
		var amountReceivableEnd=$(".amount-end").val();
		var netReceiptsStart=$(".net-start").val();
		var netReceiptsEnd=$(".net-end").val();
		var uncollectedStart=$(".uncoll-start").val();
		var uncollectedEnd=$(".uncoll-end").val();
		var expenditureStart=$(".expend-start").val();
		var expenditureEnd=$(".expend-end").val();
		var projectType=$("#projectType").val();
		$('.settlement-page').pageInfo({
			pageIndexs: sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "finance/settlement/lookForAll", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			async:true,
			data: {
				selectParam:selectParam,
				projectCode:projectCode,
				projectName:projectName,
				projectSell:projectSell,
				projectHead:projectHead,
				projectStartDateStart:projectStartDateStart,
				projectStartDateEnd:projectStartDateEnd,
				projectEndDateStart:projectEndDateStart,
				projectEndDateEnd:projectEndDateEnd,
				amountReceivableStart:amountReceivableStart,
				amountReceivableEnd:amountReceivableEnd,
				netReceiptsStart:netReceiptsStart,
				netReceiptsEnd:netReceiptsEnd,
				uncollectedStart:uncollectedStart,
				uncollectedEnd:uncollectedEnd,
				expenditureStart:expenditureStart,
				expenditureEnd:expenditureEnd,
				projectType:projectType,
				selectProjectStart:$('.search-startDate').val(),
				selectProjectEnd:$('.search-endDate').val()
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			before:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				sessionStorage.clear();
				if(data.flag == 0) {
					var htmlTbody = $('.settlement-tbody');
					var htmlTr = '';
					if(data.data.rows.length > 0) {
						$('.settlement-page').show();
						var projectTypeName = "";
						$.each(data.data.rows, function(i, v) {
							
							if(v.projectHead == "null"||v.projectHead == null){
								v.projectHead = "";
							}
							if(v.projectSell == "null"||v.projectSell == null){
								v.projectSell = "";
							}
							if(v.projectType == 1){
								projectTypeName = "计划";
							}
							else if(v.projectType == 2){
								projectTypeName = "委托";
							}
							else if(v.projectType == 3){
								projectTypeName = "选学";
							}
							else if(v.projectType == 4){
								projectTypeName = "中组部调训";
							}
							else if(v.projectType == 5){
								projectTypeName = "国资委调训";
							}
							v.amountReceivable = $yt_baseElement.fmMoney(v.amountReceivable);
							v.netReceipts = $yt_baseElement.fmMoney(v.netReceipts);
							v.uncollected = $yt_baseElement.fmMoney(v.uncollected);
							v.expenditure = $yt_baseElement.fmMoney(v.expenditure);
							htmlTr += '<tr>' +
								'<td class="project-code"><input type="hidden" value="' + v.pkId + '" class="pkId">'+v.projectCode+'</td>' +
								'<td style="text-align: left;"><a style="color: #3c4687;" class="project-name">' + v.projectName + '</a></td>' +
								'<td><input type="hidden" value="' + v.projectType + '" class="projectType">' + projectTypeName + '</td>' +
								'<td style="text-align: left;">' + v.projectSell + '</td>' +
								'<td style="text-align: left;">' + v.projectHead + '</td>' +
								'<td>' + v.projectDate + '</td>' +
								'<td style="text-align: right;">' + v.amountReceivable + '</td>' +
								'<td style="text-align: right;">' + v.netReceipts + '</td>' +
								'<td style="text-align: right;">' + v.uncollected + '</td>' +
								'<td style="text-align: right;">' + v.expenditure + '</td>' +
								'</tr>';
						});
					} else {
						$('.settlement-page').hide();
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
		var clickTime=0;
		$("button.senior-search-btn").click(function(e){
			if(clickTime%2==0){//展开
				$(".search-box").show();
				$(".search-put").addClass('flipy');
			}else{//收起
				$(".search-box").hide();
				$(".search-put").removeClass('flipy');
				//projectSettlementList.resertForm();
			}
			clickTime++;
			e.stopPropagation();
		});
		$(document).click(function(e){
			clickTime=0;
			$(".search-box").hide();
			$(".search-put").removeClass('flipy');
			e.stopPropagation();
		});
		//重置按钮
		$(".search-box .yt-model-reset-btn").click(function(){
			projectSettlementList.resertForm();
			projectSettlementList.getSettlementListInf();
		});
		//高级搜索查询按钮
		$(".search-box .yt-model-sure-btn").click(function(){
			projectSettlementList.getSettlementListInf();
		});
	}
}
$(function() {
	//初始化方法
	projectSettlementList.init();
	
});