var projectBillList = {
	//初始化方法
	init: function() {
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
				projectBillList.getprojectBillListInf();
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
				projectBillList.getprojectBillListInf();
			}
		});
		sessionStorage.getItem("startDate")?$('.search-startDate').val(sessionStorage.getItem("startDate")):'';
		sessionStorage.getItem("endDate")?$('.search-endDate').val(sessionStorage.getItem("endDate")):'';
		//调用获取列表数据方法
		projectBillList.getprojectBillListInf();
		$(".project-bill-tbody").on("click",".project-name",function(){
			var projectType = $(this).parents("tr").find("td.project-type").text();
			var projectCode = $(this).parents("tr").find("td.project-code").text();
			var projectName = encodeURI(encodeURI($(this).parents("tr").find("td.project-name-td").text()));
			sessionStorage.setItem("startDate", $(".search-startDate").val());
			sessionStorage.setItem("endDate", $(".search-endDate").val());
			sessionStorage.setItem("searchParams", $('.selectParam').val());
			sessionStorage.setItem("pageIndexs", $('.num-text.active').text());
			if(projectType == "选学" || projectType == "委托"){
				var url = "projectSelection.html?projectCode=" + projectCode + "&" + "projectName=" + projectName+"&"+'backIndex='+2;
				window.location.href = encodeURI(url);
			}else{
				var url = "projectBreak.html?projectCode=" + projectCode + "&" + "projectName=" + projectName+"&"+'backIndex='+2;
				window.location.href = encodeURI(url);
			}
		})
		//模糊查询
		$(".search-btn").click(function(){
			$(".search-box .search-table input").val('');
			$(".search-box .search-table #project-type").setSelectVal('');
			projectBillList.getprojectBillListInf();
		});
		//高级搜索
		projectBillList.hideSearch();
	},

	/**
	 * 获取列表数据
	 */
	getprojectBillListInf: function() {
		sessionStorage.getItem("searchParams")?$('.selectParam').val(sessionStorage.getItem("searchParams")):'';
		var selectParam = $(".selectParam").val();
		var projectCode=$(".search-box .project-code").val();
		var projectName=$(".search-box .project-name").val();
		var projectType=$(".search-box #project-type").val();
		var projectSell=$(".search-box .project-sell").val();
		var projectHead=$(".search-box .project-head").val();
		var startTimeStart=$(".search-box .start-time-start").val();
		var startTimeEnd=$(".search-box .start-time-end").val();
		var endTimeStart=$(".search-box .end-time-start").val();
		var endTimeEnd=$(".search-box .end-time-end").val();
		var checkInCountStart=$(".search-box .check-count-start").val();
		var checkInCountEnd=$(".search-box .check-count-end").val();
		var notReconciliationStart=$(".search-box .not-recond-start").val();
		var notReconciliationEnd=$(".search-box .not-recond-end").val();
		$('.project-bill-page').pageInfo({
			async: true,
			pageIndexs: sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "finance/projectStatement/lookForAll", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam: selectParam,
				projectCode:projectCode,
				projectName:projectName,
				projectType:projectType,
				projectSell:projectSell,
				projectHead:projectHead,
				startTimeStart:startTimeStart,
				startTimeEnd:startTimeEnd,
				endTimeStart:endTimeStart,
				endTimeEnd:endTimeEnd,
				checkInCountStart:checkInCountStart,
				checkInCountEnd:checkInCountEnd,
				notReconciliationStart:notReconciliationStart,
				notReconciliationEnd:notReconciliationEnd,
				isUserProject: "1",
				selectProjectStart:$('.search-startDate').val(),
				selectProjectEnd:$('.search-endDate').val()
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			before: function() {
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				var startDate;
				var endDate;
				sessionStorage.clear();
				if(data.flag == 0) {
					var projectHead = "";
					var htmlTbody = $('.project-bill-tbody');
					var htmlTr = '';
					if(data.data.rows.length > 0) {
						$('.project-bill-page').show();
						$.each(data.data.rows, function(i, v) {
							if(v.projectSell == null){
								v.projectSell = "";
							}
							if(v.projectHead == null){
								projectHead = "";
							}else{
								projectHead = v.projectHead;
							}
							
							startDate = (v.startDate).split(" ");
							startDate = startDate[0];
							endDate = (v.endDate).split(" ");
							endDate = endDate[0];
							htmlTr += '<tr>' +
								'<td class="project-code">' + v.projectCode + '</td>' +
								'<td class="project-name-td" style="text-align:left;"><a style="color: #3c4687;" class="project-name">' + v.projectName + '</td>' +
								'<td class="project-type">' + (projectBillList.projectTypeInfo(v.projectType)) + '</a></td>' +
								'<td style="text-align:left;">' + v.projectSell + '</td>' +
								'<td style="text-align:left;">' + projectHead + '</td>' +
								'<td>' + startDate + '</td>' +
								'<td>' + endDate + '</td>' +
								'<td style="text-align:right;">' + v.checkInCount + '</td>' +
								'<td style="text-align:right;">' + v.notReconciliationCount + '</td>' +
								'</tr>';
						});
					} else {
						$('.project-bill-page').hide();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="9" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
					}
					htmlTbody.html(htmlTr);
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
	 * 高级搜索
	 */
	hideSearch:function(){
		$(".yt-select").niceSelect();
		var clickTime=0;
		$('.senior-search-btn').click(function(e){
			if(clickTime%2==0){
				$(".selectParam").val('');
				$(".search-box").show();
				$('.search-put').addClass('flipy');
			}else{
				$(".search-box").hide();
				$('.search-put').removeClass('flipy');
				
			}
			clickTime++;
			e.stopPropagation();
		});	
		$(document).click(function(e){
			clickTime=0;
			$(".search-box").hide();
			$('.search-put').removeClass('flipy');
//			$(".search-box .search-table input").val('');
//			$(".search-box .search-table #project-type").setSelectVal('');
			e.stopPropagation();
		});
		//点击搜索按钮
		$(".search-box .yt-model-sure-btn").click(function(){
			projectBillList.getprojectBillListInf();
		});
		//点击清空按钮
		$(".search-box .yt-model-reset-btn").click(function(){
			$(".search-box .search-table input").val('');
			$(".search-box .search-table #project-type").setSelectVal('');
		});
	}
}
$(function() {
	//初始化方法
	projectBillList.init();

});