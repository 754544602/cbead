var noSetProjectList = {
	//初始化方法
	init: function() {
		
		//初始化时间控件
//		$(".chose-year").calendar({
//		    speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
//		    complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
//		    readonly: true, // 目标对象是否设为只读，默认：true     
//		    lowerLimit:"NaN", // 日期下限，默认：NaN(不限制)     
//		    nowData:true,//默认选中当前时间,默认true  
//		    dateFmt:"yyyy",  
//		    callback: function() { // 点击选择日期后的回调函数  
//		        noSetProjectList.getNoProjectApprovalList();
//		    }  
//		});  
		$(".search-startDate").calendar({
			controlId: "startDates",
			nowData: true, //默认选中当前时间,默认true  
			dateFmt:"yyyy-MM",
			callback:function(){
				if(new Date($(".search-endDate").val())<new Date($(".search-startDate").val())){
					$(".search-endDate").val($(".search-startDate").val());
				}
				noSetProjectList.getNoProjectApprovalList();
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
				noSetProjectList.getNoProjectApprovalList();
			}
		});
		sessionStorage.getItem("startDate")?$('.search-startDate').val(sessionStorage.getItem("startDate")):'';
		sessionStorage.getItem("endDate")?$('.search-endDate').val(sessionStorage.getItem("endDate")):'';
		//调用获取列表数据方法
		noSetProjectList.getNoProjectApprovalList();
		
		//搜索关键字
		$('.search-btn').click(function() {
			//调用获取列表数据方法查询
			$(".search-box .project-types").setSelectVal('');
			noSetProjectList.getNoProjectApprovalList();
		});
		//高级搜索
		noSetProjectList.hideSearch();
		//点击项目名称
		$(".noSetProject-tbody").on('click',".file-name",function(){
			var pkId = $('.yt-table-active .pkId').val();
			var projectCode =$('.yt-table-active .project-code-list').val();
			var projectState = $(this).parents('tr').find(".project-state-step").val();
			var projectType = $(this).parents('tr').data('data').projectType;
			sessionStorage.setItem("startDate", $(".search-startDate").val());
			sessionStorage.setItem("endDate", $(".search-endDate").val());
			sessionStorage.setItem("searchParams", $('.selectParam').val());
			sessionStorage.setItem("pageIndexs", $('.num-text.active').text());
			window.location.href="/cbead/website/view/project/projectDetails.html?pkId=" + pkId +"&"+"tp="+1+"&history=noSetProjectList&projectCode="+projectCode+'&projectState='+projectState+"&projectType="+projectType+"&approve="+1;
		});
		
	},
		
	/**
	 * 获取列表数据
	 */
	getNoProjectApprovalList: function() {
		sessionStorage.getItem("searchParams")?$('.selectParam').val(sessionStorage.getItem("searchParams")):'';
		var selectParam = $(".select-param").val();             
		var years = $(".search-startDate").val().split('-')[0];             
		var projectType=$(".search-box .project-types").val();
		$('.noSetProject-page').pageInfo({
			pageIndexs: sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "project/lookForAllByProjectNoPass", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam:selectParam,
				years:years,
				projectType:projectType,
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
					var htmlTbody = $('.noSetProject-tbody').empty();
					var htmlTr = '';
					if(data.data.rows.length > 0) {
						$.each(data.data.rows, function(i, v) {
							if(v.projectType==2){
								v.projectTypeVal="委托"
							}else if(v.projectType==3){
								v.projectTypeVal="选学"
							}else if(v.projectType==4){
								v.projectTypeVal="中组部调训"
							}else if(v.projectType==5){
								v.projectTypeVal="国资委调训"
							}
							if(v.projectStates==1){
								v.projectStatesVal="初定意向"
							}else if(v.projectStates==2){
								v.projectStatesVal="审批中"
							}else if(v.projectStates==3){
								v.projectStatesVal="未通过"
							}else if(v.projectStates==4){
								v.projectStatesVal="已取消"
							}else{
								v.projectStatesVal=""
							}
							htmlTr = '<tr>' +
								'<td style="width:50px;word-wrap:break-word;"><input type="hidden" value="' + v.pkId + '" class="pkId">' + (i+1) + '</td>' +
								'<td style="text-align:left"><a style="color:#3c4687;" class="file-name"><input type="hidden" value="' + v.projectCode + '" class="project-code-list">' + v.projectName + '</a></td>' +
								'<td>' + v.projectTypeVal + '</td>' +
								'<td>' + v.startDate + '</td>' +
								'<td style="text-align:right">' + v.trainDateCount + '</td>' +
								'<td style="text-align:left">' + v.projectSell + '</td>' +
								'<td style="text-align:right">' + v.traineeCount + '</td>' +
								'<td><input type="hidden" value="' + v.projectStates + '" class="project-state-step">' + v.projectStatesVal + '</td>' +
								'</tr>';
								$(".noSetProject-page").show();
								htmlTr=$(htmlTr).data('data',v);
								htmlTbody.append(htmlTr);
						});
					} else {
						$(".noSetProject-page").hide();
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="8" align="center" style="border:0px;">' +
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
		$(".project-types").niceSelect();
		var clickTime=0;
		$(".senior-search-btn").click(function(e){
			if(clickTime%2==0){
				$(".search-box").show();
				$("img.search-put").addClass('flipy');
			}else{
				$(".search-box").hide();
				$("img.search-put").removeClass('flipy');
			}
			clickTime++;
			e.stopPropagation();
		});
		//点击其他地方收起
		$(document).click(function(e){
			clickTime=0;
			$(".search-box").hide();
			$("img.search-put").removeClass('flipy');
			e.stopPropagation();
		});
		//点击查询按钮
		$(".search-box .yt-model-sure-btn").click(function(){
			noSetProjectList.getNoProjectApprovalList();
		});
		//点击重置按钮
		$(".search-box .yt-model-reset-btn").click(function(){
			$(".search-box .project-types").setSelectVal('');
		});
	}
}
$(function() {
	//初始化方法
	noSetProjectList.init();
	
});