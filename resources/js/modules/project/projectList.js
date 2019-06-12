var projectList = {
	//初始化方法
	init: function() {
		var judgeList = 1;
		$(".search-startDate").calendar({
			controlId: "startDates",
			nowData: true, //默认选中当前时间,默认true  
			dateFmt:"yyyy-MM",
			callback:function(){
				if(new Date($(".search-endDate").val())<new Date($(".search-startDate").val())){
					$(".search-endDate").val($(".search-startDate").val());
				}
				projectList.getProjectListInfo();
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
				projectList.getProjectListInfo();
			}
		});
		sessionStorage.getItem("startDate")?$('.search-startDate').val(sessionStorage.getItem("startDate")):'';
		sessionStorage.getItem("endDate")?$('.search-endDate').val(sessionStorage.getItem("endDate")):'';
		//点击新增
		$(".add-list").on('click',function(){
			window.location.href="addProjectList.html?judgeList=1";
		});
		//点击修改
		$(".update-list").on('click',function(){
			if($("tr.yt-table-active").length == 0){
				$yt_alert_Model.prompt("请选择要修改的数据");
				return false;
			}else if($("tr.yt-table-active").find(".project-state-step").val() == "1" || $("tr.yt-table-active").find(".project-state-step").val() == "3"){
				var projectType = $('.yt-table-active .project-type').val();
				window.location.href="addProjectList.html?pkId=" + $('.yt-table-active .pkId').val() + "&judgeList=1"+"&"+"projectType="+projectType;
			}else{
				var states = $("tr.yt-table-active").find(".project-states-text").text();
				$yt_alert_Model.prompt(states+'状态数据不可修改!');
			}
			
		});
		//点击项目名称
		$(".project-tbody").on('click',".file-name",function(){
			//获取项目状态值
			var projectState = $(this).parent().parent().find(".project-state-step").val();
			var pkId = $('.yt-table-active .pkId').val();
			var projectCode = $('.yt-table-active .projectCodeText').val();
			var projectCodeList = $('.yt-table-active .project-code-list').text(); 
			var tp = 1;
			var judgeList = 1;
			var approve = 1;
			var projectType = $('.yt-table-active .project-type').val();
			sessionStorage.setItem("startDate", $(".search-startDate").val());
			sessionStorage.setItem("endDate", $(".search-endDate").val());
			sessionStorage.setItem("searchParams", $('#keyword').val());
			sessionStorage.setItem("pageIndexs", $('.project-page .num-text.active').text());
			window.location.href="projectDetails.html?pkId="+pkId+"&"+"tp="+tp+"&"+"projectCode="+projectCode +"&"+"projectCodeList="+projectCodeList+"&"+"judgeList="+judgeList+"&"+"projectState="+projectState+"&"+"approve="+approve+"&"+"projectType="+projectType+"&history=myProjectList";
		});
		//点击删除
		$(".delete-list").on('click',function(){
			if($("tr.yt-table-active").length == 0){
				$yt_alert_Model.prompt("请选择要删除的数据");
				return false;
			}
			projectList.delProjectList();
		});
		//点击立项申请
		$(".project-application").on('click',function(){
			if($("tr.yt-table-active").length == 0){
				$yt_alert_Model.prompt("请选择要操作的数据");
				return false;
			}else{
				var projectState = $(".yt-table-active").find(".project-state-step").val();
				if(projectState == 1 || projectState == 3){//
					//显示弹出框
					projectList.projectApplicationAlert();
				}else{
					$yt_alert_Model.prompt("该项目立项申请已提交！");
				}
			}
			//获取下一步操作人
			var dealingWithPeople = projectList.getListSelectDealingWithPeople();
			if (dealingWithPeople !=null){
				$(".dealing-with-people").empty();
				$.each(dealingWithPeople,function (i,n){
					$(".dealing-with-people").append('<option value="'+n.userCode+'">'+n.userName+'</option>');
				});
			}
			$(".dealing-with-people").niceSelect();
			
			var realName = $(".yt-table-active .project-name").text();
			$(".real-name").text(realName);
			//点击提交按钮
			$(".project-application-alert .yt-model-sure-btn").off('click').click(function(){
				if($yt_valid.validForm($(".project-application-alert"))){
					projectList.projectApplicationList();
				}
				
			});
		});
		//点击取消
		$(".cancel-list").on('click',function(){
			if($("tr.yt-table-active").length == 0){
				$yt_alert_Model.prompt("请选择要操作的数据");
				return false;
			}else if($(".yt-table-active .project-states-text").text() == "已取消"){
				$yt_alert_Model.prompt("请选择未被取消的项目");
				return false;
			}else{
				projectList.offProjectList();
			}
		});
		//点击恢复
		$(".regain-list").on('click',function(){
			if($("tr.yt-table-active").length == 0){
				$yt_alert_Model.prompt("请选择要操作的数据");
				return false;
			}else if($(".yt-table-active .project-states-text").text() != "已取消"){
				$yt_alert_Model.prompt("请选择已取消的数据");
				return false;
			}else{
				projectList.restoreProjectList();
			}
		});
		
		//调用获取列表数据方法
		projectList.getProjectListInfo();
		
		//条件搜索
		$('.search-btn').click(function() {
			projectList.getProjectListInfo();
		});
		//高级搜索
		projectList.hideSearch();
		$(".click-project-code-th").click(function(){//点击项目编号进行排序
			$(".clickType").val("1");
			if ($(".click-project-code").val() == "ASC") {
				$(".click-project-code").val("DESC");//倒序排
			}else{
				$(".click-project-code").val("ASC");//正序排
			}
			projectList.getProjectListInfo();
		});
		$(".click-start-date-th").click(function(){//点击培训日期进行排序
			$(".clickType").val("2");
			if ($(".click-start-date").val() == "ASC") {
				$(".click-start-date").val("DESC");//倒序排
			}else{
				$(".click-start-date").val("ASC");//正序排
			}
			projectList.getProjectListInfo();
		});
		
	},
	/**
	 * 获取下一步操作人
	 */
	getListSelectDealingWithPeople:function(){
		var list =[];
		$.ajax({
			type: "post",
			url: $yt_option.base_path+"uniform/workFlowOperate/getSubmitPageData",
			data:{
				businessCode:"project",
				processInstanceId:"",
				parameters:"",
				versionNum:""
			},
			async: false,
			success: function(data) {
				$.each(data.data, function(i, n) {
						for(var k in n) {
							list = n[k];
						}
					});
			}
		});
		return list;
	},	
	/**
	 * 获取列表数据
	 */
	getProjectListInfo: function(projectType) {
		var sort = "";
		var orderType = "";
		if($(".clickType").val() == 1){//点击编号排序
			sort = "project_code";
			orderType = $(".click-project-code").val();
		}else if($(".clickType").val() == 2){
			sort = "start_date";
			orderType = $(".click-start-date").val();
		}else{
			
		}
		if(sessionStorage.getItem("searchParams"))$('#keyword').val(sessionStorage.getItem("searchParams"));
		var selectParam =$('#keyword').val();
		$('.project-page').pageInfo({
			pageIndexs: sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "project/lookForAll", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam:selectParam,
				projectType:projectType,
				projectStates:"",
				startTimeStart:"",
				startTimeEnd:"",
				endTimeStart:"",
				endTimeEnd:"",
				sort:sort,
				orderType:orderType,
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
					$(".clickType").val("");
					var htmlTbody = $('.project-tbody');
					var htmlTr = '';
					var projectCodeText = "";
					var projectType = "";
					if(data.data.rows.length > 0) {
						$.each(data.data.rows, function(i, v) {
							projectCodeText = v.projectCode;
							if(v.trainDateCount==null){
								v.trainDateCount="";
							}
							if(v.projectType==1){
								projectType="计划";
							}else if(v.projectType==2){
								projectType="委托";
							}else if(v.projectType==3){
								projectType="选学";
							}else if(v.projectType==4){
								projectType="中组部调训";
							}else if(v.projectType==5){
								projectType="国资委调训";
							}
							var projectStates= v.projectStates;
							if (projectStates ==1){
								projectStates='初定意向';
							}
							else if (projectStates ==2){
								projectStates='审批中';
							}
							else if (projectStates ==3){
								projectStates='未通过';
							}
							else if (projectStates ==4){
								projectStates='意向';
							}
							else if (projectStates ==5){
								projectStates='运行中';
							}
							else if (projectStates ==6){
								projectStates='未结项';
							}
							else if (projectStates ==7){
								projectStates='已结项';
							}
							else if (projectStates ==8){
								projectStates='已取消';
							}else if (projectStates ==9){
								projectStates='确定意向';
							}
							htmlTr += '<tr>' +
								'<td class="project-code-list" style="word-wrap:break-word;">' + v.projectCode + '</td>' +
								'<td class="project-name" style="text-align: left;"><input type="hidden" value="' + v.pkId + '" class="pkId"><a class="file-name" style="color:#3c4687;">'+v.projectName+'</a></td>' +
								'<td><input type="hidden" value="' + projectCodeText + '" class="projectCodeText">' + projectType + '</td>' +
								'<td><input class="process-instance-id" type="hidden" value="' + v.processInstanceId + '" class="pkId">' + v.startDate + '</td>' +
								'<td style="text-align: right;"><input type="hidden" value="' + v.projectType + '" class="project-type">' + v.trainDateCount + '</td>' +
								'<td style="text-align: left;">' + v.projectSell + '</td>' +
								'<td style="text-align: left;">' + v.projectHead + '</td>' +
								'<td style="text-align: right;">' + v.traineeCount + '</td>' +
								'<td class="project-states-text"><input type="hidden" value="' + v.projectStates + '" class="project-state-step">' + projectStates + '</td>' +
								'</tr>';
								$(".project-page").show();
						});
					} else {
						$(".project-page").hide();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="9" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
					}
					htmlTbody.html(htmlTr);
					$.each(htmlTbody.find('.project-code-list'),function(i,n){
						
						if(('1,2,3,8').indexOf($(n).parents('tr').find('.project-state-step').val())!=-1){
							$(n).css('opacity','0');
							$(n).text("");
						}
					})
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
			var projectType=$(".search-box .project-types").val();
			projectList.getProjectListInfo(projectType);
		});
		//点击重置按钮
		$(".search-box .yt-model-reset-btn").click(function(){
			$(".search-box .project-types").setSelectVal('');
		});
	},
	//删除
    delProjectList:function() {
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
					url: $yt_option.base_path + "project/deleteProject",
					data: {
						pkId: pkId
					},
					success: function(data) {
						if(data.flag == 0) {
							$yt_alert_Model.prompt("删除成功");
				 			$('.project-page').pageInfo("refresh");
						} else {
							$yt_alert_Model.prompt("删除失败");
						}

					}

				});

			}
		});
	},
	//取消
    offProjectList:function() {
		var pkId = $('.yt-table-active .pkId').val();
		$yt_alert_Model.alertOne({
			haveCloseIcon: false, //是否带有关闭图标  
			closeIconUrl: "", //关闭图标路径  
			leftBtnName: "确定", //左侧按钮名称,默认确定  
			rightBtnName: "取消", //右侧按钮名称,默认取消  
			cancelFunction: "", //取消按钮操作方法*/  
			alertMsg: "是否取消该项目并通知项目负责人？", //提示信息  
			confirmFunction: function() { //点击确定按钮执行方法  
				$.ajax({
					type: "post",
					url: $yt_option.base_path + "project/updateProjectDataStates",
					data: {
						pkId: pkId,
						type: 2
					},
					success: function(data) {
						if(data.flag == 0) {
							$yt_alert_Model.prompt("已取消");
				 			$('.project-page').pageInfo("refresh");
						} else {
							$yt_alert_Model.prompt("操作失败");
						}

					}

				});

			}
		});
	},
	//恢复
    restoreProjectList:function() {
		var pkId = $('.yt-table-active .pkId').val();
		$yt_alert_Model.alertOne({
			haveCloseIcon: false, //是否带有关闭图标  
			closeIconUrl: "", //关闭图标路径  
			leftBtnName: "确定", //左侧按钮名称,默认确定  
			rightBtnName: "取消", //右侧按钮名称,默认取消  
			cancelFunction: "", //取消按钮操作方法*/  
			alertMsg: "是否恢复该项目并通知项目负责人？", //提示信息  
			confirmFunction: function() { //点击确定按钮执行方法  
				$.ajax({
					type: "post",
					url: $yt_option.base_path + "project/updateProjectDataStates",
					data: {
						pkId: pkId,
						type: 1
					},
					success: function(data) {
						if(data.flag == 0) {
							$yt_alert_Model.prompt("已恢复");
				 			$('.project-page').pageInfo("refresh");
						} else {
							$yt_alert_Model.prompt("操作失败");
						}

					}

				});

			}
		});
	},
	//立项申请
	projectApplicationList: function() {
		var  validFlag = $yt_valid.validForm($(".valid-tab"));
		
//		if(validFlag){
//			
//			
//		}else{
//			
//		}
		
		var processInstanceId = $(".yt-table-active .process-instance-id").val();	
		var pkId = $(".yt-table-active .pkId").val();
		var remarks = $(".project-application-alert .remarks").val();
		var dealingWithPeople = $(".project-application-alert .dealing-with-people").val();
		
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "project/addOrApprovalProject", //ajax访问路径  
			data: {
				pkId:pkId,
				remarks:remarks,        
				businessCode:"project", 
				dealingWithPeople:dealingWithPeople,    
				opintion:remarks,    
				processInstanceId:processInstanceId,      
				nextCode:"submited"

			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0){
				 	$yt_alert_Model.prompt("操作成功");
				 	$(".yt-edit-alert").hide();
				 	$('.project-page').pageInfo("refresh");
				}else{
					$yt_alert_Model.prompt("操作失败");
				}
			} 
		});
	},
	//立项申请弹出框
	projectApplicationAlert:function() {  
        /** 
         * 显示编辑弹出框和显示顶部隐藏蒙层 
         */  
        $(".lawyer-opinion-box").show();  
        /** 
         * 调用算取div显示位置方法 
         */  
        $yt_alert_Model.getDivPosition($(".lawyer-opinion-box"));  
        /*
               缩小窗口显示滚动条
         * */
        //$yt_alert_Model.setFiexBoxHeight($(".project-application-alert form"));
        /* 
         * 调用支持拖拽的方法 
         */  
        $yt_model_drag.modelDragEvent($(".lawyer-opinion-box .yt-edit-alert-title"));  
        /** 
         * 点击取消方法 
         */  
        $('.lawyer-opinion-box .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {  
            //隐藏页面中自定义的表单内容  
            $(".lawyer-opinion-box").hide();  
            //隐藏蒙层  
            $("#pop-modle-alert").hide();  
        });  
    }
	
}
$(function() {
	//初始化方法
	projectList.init();
	
});