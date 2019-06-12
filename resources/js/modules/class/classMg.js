/**
 * 班级信息
 */
var caList = {
	//初始化方法
	init: function() {
		$("select").niceSelect(); //下拉框刷新  
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
				caList.getPlanListInfo();
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
				caList.getPlanListInfo();
			}
		});
		sessionStorage.getItem("searchParams")?$('#keyword').val(sessionStorage.getItem("searchParams")):'';
		sessionStorage.getItem("startDate")?$('.search-startDate').val(sessionStorage.getItem("startDate")):'';
		sessionStorage.getItem("endDate")?$('.search-endDate').val(sessionStorage.getItem("endDate")):'';
		sessionStorage.getItem("myClass")==2?$('.check-myClass').setCheckBoxState('uncheck'):'';
		//超链接跳转传参
		//调用获取列表数据方法
		caList.getPlanListInfo();
		//跳转页面传参
		$('.list-table').on("click",".projectName",function(){
			toDetail($(this).parents("tr"))
		});
		$('.list-table').on("dblclick","tr",function(){
			toDetail($(this))
		});
		function toDetail(tr){
			var pkId=$(tr).attr('project-id');
			var projectCode = $(tr).find('.projectCode').val();//获取班级编号
			var projectType=$(tr).find('.project-type').val();//获取班级类型
			var classProjectStates = $(tr).data('data').projectStates;
			var isOperation ;
			$('.isOperation')[0]?isOperation='1':isOperation=undefined;
			$('.diploma')[0]?diploma='1':diploma=undefined;
			//var projectName=$(this).text();//获取班级名称
			var url="classInfo.html?projectCode="+ projectCode+"&projectType="+projectType+"&classProjectStates="+classProjectStates+"&pkId="+pkId+'&isOperation='+isOperation+'&diploma='+diploma;
			sessionStorage.setItem("startDate", $(".search-startDate").val());
			sessionStorage.setItem("endDate", $(".search-endDate").val());
			sessionStorage.setItem("myClass",$('.check-myClass:checked').val()?1:2);
			sessionStorage.setItem("searchParams", $('#keyword').val());
			sessionStorage.setItem("pageIndexs", $('.list-page .num-text.active').text());
			window.location.href=url;
		}
		//点击编号排序
		$(".pro-number").click(function(){
			var projectCode=$(this).attr('projectCode');
			if(projectCode=='true'){
				caList.getPlanListInfo("","project_code","ASC");
				$(this).attr('projectCode',false);
			}else{
				caList.getPlanListInfo("","project_code","DESC");
				$(this).attr('projectCode',true);
			}
		});
		//点击开班日期排序
		$(".pro-star").click(function(){
			var start=$(this).attr('start');
			if(start=='true'){
				$(this).attr('start',false);
				caList.getPlanListInfo("","start_date","ASC");
			}else{
				$(this).attr('start',true);
				caList.getPlanListInfo("","start_date","DESC");
			}
		});
		//点击结束日期排序
		$(".pro-end").click(function(){
			var end=$(this).attr('end');
			if(end=='true'){
				$(this).attr('end',false);
				caList.getPlanListInfo("","end_date","ASC");
			}else{
				$(this).attr('end',true);
				caList.getPlanListInfo("","end_date","DESC");
			}
		});
		//点击普通搜索
		$('.search-btn').click(function(){
			$('.project-code').val("");
			$('.project-name').val("");
			$('.project-sell').val("");
			$("#project-type").setSelectVal("");
			$("#project-states").setSelectVal("");
			$('.start-time-start').val("");
			$('.start-time-end').val("");
			$('.end-time-start').val("");
			$('.end-time-end').val("");
			caList.getPlanListInfo($("#keyword").val());
		});
		$('.check-myClass').change(function(){
				caList.getPlanListInfo();
		})
		//高级搜索
		caList.hideSearch();
	},
		
	/**
	 * 获取列表数据
	 */
	getPlanListInfo: function(selectParam,sort,orderType) {
		var selectParam = $('#keyword').val();
		var projectCode = $('.project-code').val();
		var projectName = $('.project-name').val();
		var projectType = $('#project-type').val();
		var projectSell = $('.project-sell').val();
		var projectHead = $('.project-head').val();
		var projectStates = $('#project-states').val();
		var startTimeStart = $('.start-time-start').val();
		var startTimeEnd = $('.start-time-end').val();
		var endTimeStart = $('.end-time-start').val();
		var endTimeEnd = $('.end-time-end').val();
		$('.list-page').pageInfo({
			pageIndexs: sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "class/lookForAll", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam:selectParam,
				projectCode: projectCode,
				projectName: projectName,
				projectType: projectType,
				projectSell: projectSell,
				projectHead: projectHead,
				projectStates:projectStates,
				startTimeStart: startTimeStart,
				startTimeEnd: startTimeEnd,
				endTimeStart: endTimeStart,
				endTimeEnd: endTimeEnd,
				sort:sort,
				orderType:orderType,
				isLookMeClass:$('.check-myClass:checked').val(),
				selectProjectStart:$('.search-startDate').val(),
				selectProjectEnd:$('.search-endDate').val()
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			async:true,
			before:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				sessionStorage.clear();
				if(data.flag == 0) {
					var htmlTbody = $('.class-tbody').empty();
					var htmlTr = '';
					if(data.data.rows.length > 0) {
						$.each(data.data.rows, function(i, v) {
							var projectType;
							switch (v.projectType){
								case '1':
									projectType = '调训';
									break;
								case '2':
									projectType = '委托';
									break;
								case '3':
									projectType = '选学';
									break;
								case '4':
									projectType = '中组部调训';
									break;
								case '5':
									projectType = '国资委调训';
									break;
							}
							v.projectStatesVal = '';
							switch (v.projectStates){
								case '1':
									v.projectStatesVal = '未开始';
									break;
								case '2':
									v.projectStatesVal = '培训中';
									break;
								case '3':
									v.projectStatesVal = '未结项';
									break;
								case '4':
									v.projectStatesVal = '已结项';
									break;
								
							}
							//overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 3;
							htmlTr = '<tr project-id="'+v.pkId+'">' +
								'<td>' + v.projectCode + '</td>' +
								'<input type="hidden" value="' + v.projectCode + '" class="projectCode">' +
								'<input type="hidden" value="' + v.projectType + '" class="project-type">' +
								'<td  style="text-align: left;"><a class="projectName" style="color:#3c4687;">'+v.projectName+'</a></td>' +
								'<td>' + projectType + '</td>' +
								'<td class="text-overflow" style="text-align:left;">' + v.projectSell + '</td>' +
								'<td class="text-overflow" style="text-align:left;">' + v.projectHead + '</td>' +
								'<td class="tl" style="text-align: center !important;">' + v.startDate + '</td>' +
								'<td class="tl" style="text-align: center !important;">' + v.endDate + '</td>' +
								'<td class="tr">' + v.traineeCount + '</td>' +
								'<td>' + v.projectStatesVal + '</td>' +
								'</tr>';
								htmlTr = $(htmlTr).data('data',v);
								htmlTbody.append(htmlTr);
						});
						$('.list-page').show();
					} else {
						$('.list-page').hide();
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="9" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
							htmlTbody.append(htmlTr);
					}
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
		//点击更多
		var clickNumber = 0;
		$('.search-more').click(function(e) {
			//显示窗口
			if(clickNumber %2==0){
				$('.search-box').show();
				$('.search-put').addClass('flipy');
			}else{
				$('.search-box').hide();
				$('.project-code').val("");
				$('.project-name').val("");
				$('.project-head').val("");
				$('.project-sell').val("");
				$('.project-state-box').each(function() {
					$(this).find("option:eq(0)").prop("selected", "selected");
				});
				$('.project-type-box').each(function() {
					$(this).find("option:eq(0)").prop("selected", "selected");
				});
				$('.start-time-start').val("");
				$('.start-time-end').val("");
				$('.end-time-start').val("");
				$('.end-time-end').val("");
				$('.search-put').removeClass('flipy');
				
			}
			clickNumber++;
			e.stopPropagation();
		});
		//重置按钮
		$('.yt-model-reset-btn').click(function(){
			$('.project-code').val("");
			$('.project-name').val("");
			$('.project-head').val("");
			$('.project-sell').val("");
			$("#project-type").setSelectVal("");
			$("#project-states").setSelectVal("");
			$('.start-time-start').val("");
			$('.start-time-end').val("");
			$('.end-time-start').val("");
			$('.end-time-end').val("");
		});
		//条件搜索
		$('.yt-model-sure-btn').click(function(){
			caList.getPlanListInfo();
		});
		$(document).click(function(e){
			clickNumber=0;
			$('.search-box').hide();
			$('.search-put').removeClass('flipy');
			e.stopPropagation();
		});
	}
}
$(function() {
	//初始化方法
	caList.init();
	
});