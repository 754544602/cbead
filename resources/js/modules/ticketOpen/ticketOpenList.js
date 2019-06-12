var ticketOpenInfo = {

	//初始化方法
	init: function() {
		$(".yt-select").niceSelect();
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
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $(".end-time-end") //开始日期最大为结束日期  
		});
		$(".end-time-end").calendar({
			controlId: "endDate",
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
				ticketOpenInfo.getPlanListInfo();
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
				ticketOpenInfo.getPlanListInfo();
			}
		});
		sessionStorage.getItem("startDate")?$('.search-startDate').val(sessionStorage.getItem("startDate")):'';
		sessionStorage.getItem("endDate")?$('.search-endDate').val(sessionStorage.getItem("endDate")):'';
		//初始化列表
		ticketOpenInfo.getPlanListInfo();
		//点击查询
		$('.key-word').off().on('click', '.search-btn', function() {
			//调用获取列表数据方法查询
			$('.search-box #projectType').setSelectVal("");
			$(".search-box #projectStates").setSelectVal("");
			$('.search-box input.yt-input').val("");
			$('.search-box input.calendar-input').val("");
			ticketOpenInfo.getPlanListInfo();
			return false;
		});
		//跳转页面
		$(".open-class-tbody").on("click",".project-name",function(){
			var projectCode = $(this).parent().parent().find(".project-code").text();
			var pkId = $(this).parent().parent().find(".pk-id").val();
			var projectType = $(this).parent().parent().find(".project-type-hid").val();
			sessionStorage.setItem("startDate", $(".search-startDate").val());
			sessionStorage.setItem("endDate", $(".search-endDate").val());
			sessionStorage.setItem("searchParams", $('#keyword').val());
			sessionStorage.setItem("pageIndexs", $('.num-text.active').text());
			window.location.href = "ticketOpenInfo.html?projectCode="+projectCode+"&"+"pkId="+pkId+"&projectType="+projectType;
		});
		//点击页面上的其他位置收起高级搜索
		ticketOpenInfo.hideSearch();
	},

	/**
	 * 项目档案列表
	 */
	getPlanListInfo: function() {
		sessionStorage.getItem("searchParams")?$('#keyword').val(sessionStorage.getItem("searchParams")):'';
		var keyword = $("#keyword").val();
		var projectCode=$(".search-box .project-code").val();
		var projectName=$(".search-box .project-name").val();
		var projectSell=$(".search-box .project-sell").val();
		var projectHead=$(".search-box .project-head").val();
		var startTimeStart=$(".search-box .start-time-start").val();
		var startTimeEnd=$(".search-box .start-time-end").val();
		var endTimeStart=$(".search-box .end-time-start").val();
		var endTimeEnd=$(".search-box .end-time-end").val();
		var projectType=$(".search-box #projectType").val();
		var checkInCountStart=$(".search-box .report-stu-start").val();
		var checkInCountEnd=$(".search-box .report-stu-end").val();
		var notInvoiceStart=$(".search-box .not-invoice-start").val();
		var notInvoiceEnd=$(".search-box .not-invoice-end").val();
		var projectStates=$(".search-box #projectStates").val();
		$('.page-info').pageInfo({
			pageIndexs: sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "finance/projectInvoice/lookForAll", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam: keyword,
				projectCode:projectCode,
				projectName:projectName,
				projectSell:projectSell,
				projectHead:projectHead,
				startTimeStart:startTimeStart,
				startTimeEnd:startTimeEnd,
				endTimeStart:endTimeStart,
				endTimeEnd:endTimeEnd,
				projectType:projectType,
				checkInCountStart:checkInCountStart,
				checkInCountEnd:checkInCountEnd,
				notInvoiceStart:notInvoiceStart,
				notInvoiceEnd:notInvoiceEnd,
				projectStates:projectStates,
				selectProjectStart:$('.search-startDate').val(),
				selectProjectEnd:$('.search-endDate').val()
			}, //ajax查询访问参数
			async:true,
			before:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				sessionStorage.clear();
				if(data.flag == 0) {
					var htmlTbody = $('.list-table .yt-tbody');
					var htmlTr = '';
					htmlTbody.empty();
					if(data.data.rows.length > 0) {
						var projectType;
						var states;
						var projectStates;
						$('.page-info').show();
						$.each(data.data.rows, function(i, v) {
							if(v.projectStates == 1 ){
								v.projectStates = "已立项";
							}else if(v.projectStates == 2 ){
								v.projectStates = "培训中";
							}else{
								v.projectStates = "已结束";
							}
							htmlTr = '<tr>' +
								'<td class="project-code"><input type="hidden" class="pk-id" value="'+v.pkId+'" />' + v.projectCode + '</td>' +
								'<td style="text-align: left;"><a style="color: #3c4687;" class="project-name" href="#">' + v.projectName + '</a></td>' +
								'<td class="project-type"><input type="hidden" class="project-type-hid" value="'+v.projectType+'" />' + (ticketOpenInfo.projectTypeInfo(v.projectType)) + '</td>' +
								'<td style="text-align:left;" class="project-sell">' + v.projectSell + '</td>' +
								'<td style="text-align:left;" class="project-head">' + v.projectHead + '</td>' +
								'<td class="start-date">' + v.startDate + '</td>' +
								'<td class="end-date">' + v.endDate + '</td>' +
								'<td style="text-align:right;" class="check-in-count">' + v.checkInCount + '</td>' +
								'<td>' + v.projectStates + '</td>' +
								'<td style="text-align:right;" class="noInvoice-count">' + v.noInvoiceCount + '</td>' +
								'</tr>';
							htmlTbody.append(htmlTr);
						});
					}else {
						$('.page-info').hide();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
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
		//项目类型设置
	projectTypeInfo: function(code) {
		if(code == 1) {
			return "计划";
		} else if(code == 2) {
			return "委托";
		} else if(code == 3) {
			return "选学";
		} else if(code == 4) {
			return"中组部调训";
		} else if(code == 5) {
			return"国资委调训";
		}else {
			return '';
		};
	},
	/**
	 * 点击页面其他位置收起高级搜索
	 */
	hideSearch:function(){
		///高级搜索
		var clickTime=0;
		$("button.senior-search-btn").click(function(e){
			if(clickTime%2==0){
				$("#keyword").val('');
				$('.search-box').show();
				$('.search-put').addClass('flipy');
			}else{
//				$('.search-box #projectType').setSelectVal("");
//				$(".search-box #projectStates").setSelectVal("");
//				$('.search-box input.yt-input').val("");
//				$('.search-box input.calendar-input').val("");
				$('.search-box').hide();
				$('.search-put').removeClass('flipy');
			}
			clickTime++;
			e.stopPropagation();
		});
		$(document).click(function(){
//			$("#keyword").val('');
			clickTime=0;
//			$('.search-box #projectType').setSelectVal("");
//			$(".search-box #projectStates").setSelectVal("");
//			$('.search-box input.yt-input').val("");
//			$('.search-box input.calendar-input').val("");
			$('.search-box').hide();
			$('.search-put').removeClass('flipy');
		});
		//点击弹框搜索按钮
		$(".search-box .yt-model-sure-btn").click(function(){
			ticketOpenInfo.getPlanListInfo();
		});
		//点击弹框清空按钮
		$(".search-box .yt-model-reset-btn").click(function(){
			$('.search-box #projectType').setSelectVal("");
			$(".search-box #projectStates").setSelectVal("");
			$('.search-box input.yt-input').val("");
			$('.search-box input.calendar-input').val("");
		});
	}
}
$(function() {
	//初始化方法
	ticketOpenInfo.init();
});