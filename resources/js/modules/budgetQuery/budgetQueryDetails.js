var budgetQueryDetails = {
	//初始化方法
	init: function() {
		
		//获取跳转页面传过来的pkId
		var pkId = $yt_common.GetQueryString('pkId');
		
		//查询详细信息
		budgetQueryDetails.getBudgetInf();
		
		
		//初始化日期控件
		$(".report-date").calendar({
		    speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
		    complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
		    readonly: true, // 目标对象是否设为只读，默认：true     
		    lowerLimit:"NaN", // 日期下限，默认：NaN(不限制)     
		    nowData:true,//默认选中当前时间,默认true  
		    dateFmt:"yyyy-MM-dd HH:mm",  
		    callback: function() { // 点击选择日期后的回调函数  
		        //alert("您选择的日期是：" + $("#txtDate").val());  
		    }  
		});  
		$(".out-hospital-date").calendar({
		    speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
		    complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
		    readonly: true, // 目标对象是否设为只读，默认：true     
		    lowerLimit:"NaN", // 日期下限，默认：NaN(不限制)     
		    nowData:true,//默认选中当前时间,默认true  
		    dateFmt:"yyyy-MM-dd HH:mm",  
		    callback: function() { // 点击选择日期后的回调函数  
		        //alert("您选择的日期是：" + $("#txtDate").val());  
		    }  
		});
		
		//获取项目下拉框
		var projectSelect = budgetQueryDetails.getAddBudgetSelect();
		if (projectSelect !=null){
			$.each(projectSelect,function (i,n){
				$(".project-code").append('<option value="'+n.projectCode+'" createUserName="'+n.createUserName+'" projectType="'+n.projectType+'" classTeacher="'+n.classTeacher+'" projectHead="'+n.projectHead+'" startDate="'+n.startDate+'" endDate="'+n.endDate+'" traineeTotal="'+n.traineeTotal+'">'+n.projectName+'</option>');
			});
		}
		$(".project-code").niceSelect();
		//通过projectCode获取其他信息
		$("select.project-code").change(function (){
			var createUserName=$("select.project-code option:selected").attr("createUserName");
			var projectType=$("select.project-code option:selected").attr("projectType");
			var classTeacher=$("select.project-code option:selected").attr("classTeacher");
			var projectHead=$("select.project-code option:selected").attr("projectHead");
			var startDate=$("select.project-code option:selected").attr("startDate");
			var endDate=$("select.project-code option:selected").attr("endDate");
			var traineeTotal=$("select.project-code option:selected").attr("traineeTotal");
			$(".create-user-name").text(createUserName);
			$(".project-type").text(budgetQueryDetails.getProjectType(projectType));
			if(classTeacher=="null"){
				$(".class-teacher").text("");
			}else{
				$(".class-teacher").text(classTeacher);
			}
			if(projectHead=="null"){
				$(".project-head").text("");
			}else{
				$(".project-head").text(projectHead);
			}
			$(".start-date").text(startDate.split(" ")[0]);
			$(".end-date").text(endDate.split(" ")[0]);
			$(".trainee-total").text(traineeTotal);
		});
		
		/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
		
		
		
		//点击返回
		$('.back-btn').click(function(){
			window.location.href = "budgetList.html";
		});
	},
	
	/**
	 * 项目下拉框查询
	 */
	getAddBudgetSelect:function(){
		var list =[];
		$.ajax({
			type: "post",
			url: $yt_option.base_path+"finance/reduction/lookForAllProject",
			data:{
				searchParameters:""
			},
			async: false,
			success: function(data) {
				list = data.data || [];
			}
		});
		return list;
	},
	
	//获取一条数据
	getBudgetInf: function() {
			var pkId = $yt_common.GetQueryString('pkId');
			$.ajax({
				type: "post", //ajax访问方式 默认 "post"  
				url: $yt_option.base_path + "finance/projectBudget/getBeanById", //ajax访问路径  
				data: {
					pkId:pkId
				}, //ajax查询访问参数
				success: function(data) {
					if(data.flag == 0){
						
						//获取流程实例ID
						$(".processInstanceId").val(data.data.processInstanceId);
						
						$('.state-type').text(data.data.workFlawState);
						
						$(".budget-inf").setDatas(data.data);		
						//从返回的值里给select赋值
						$(".project-code").setSelectVal(data.data.projectCode);
						//通过projectCode获取其他信息
						if($(".project-code").val()!=""){
							var createUserName=$("select.project-code option:selected").attr("createUserName");
							var projectType=$("select.project-code option:selected").attr("projectType");
							var classTeacher=$("select.project-code option:selected").attr("classTeacher");
							var projectHead=$("select.project-code option:selected").attr("projectHead");
							var startDate=$("select.project-code option:selected").attr("startDate");
							var endDate=$("select.project-code option:selected").attr("endDate");
							var traineeTotal=$("select.project-code option:selected").attr("traineeTotal");
							$(".create-user-name").text(createUserName);
							$(".project-type").text(budgetQueryDetails.getProjectType(projectType));
							if(classTeacher=="null"){
								$(".class-teacher").text("");
							}else{
								$(".class-teacher").text(classTeacher);
							}
							if(projectHead=="null"){
								$(".project-head").text("");
							}else{
								$(".project-head").text(projectHead);
							}
							$(".start-date").text(startDate.split(" ")[0]);
							$(".end-date").text(endDate.split(" ")[0]);
							$(".trainee-total").text(traineeTotal);
						}
						//获取预算明细
						var projectBudgetDetailsArr = $.parseJSON(data.data.projectBudgetDetails);
						var projectBudget = '';
						if(projectBudgetDetailsArr!=null){
							$.each(projectBudgetDetailsArr, function(i,n) {
								projectBudget = $('<tr><td align="right"><input type="hidden" value="' +n.costCode+ '" class="cost-code"><span>'+ n.costName +'：</span></td><td><input type="text" class="yt-input budget-cost" data-val="budgetCost" placeholder="请输入"></td><td style="width: 50px;"><span>元</span></td><td><input type="text" class="yt-input according-instructions gist" data-val="accordingInstructions" placeholder="请输入依据说明"></td></tr>');
								projectBudget.setDatas(n);
								if(n.costType==1&&n.types==1){
									$(".approval-change-before .teach-related-expenses-table").append(projectBudget);
								}
								if(n.costType==2&&n.types==1){
									$(".approval-change-before .logistics-related-expenses-table").append(projectBudget);
								}
								if(n.costType==1&&n.types==2){
									$(".approval-change-after").show();
									$(".approval-change-after .teach-related-expenses-table").append(projectBudget);
								}
								if(n.costType==2&&n.types==2){
									$(".approval-change-after .logistics-related-expenses-table").append(projectBudget);
								}
							});
						}
						
						//流程
						var flowLog = data.data.flowLog;
						var flowLogArr = $.parseJSON(flowLog);
						console.log(flowLogArr);
						if(flowLogArr==""){
							$(".approval-process-module").hide();
						}
						var middleStepHtml;
						var length=flowLogArr.length;
						var deleteReasons="";
						var tastName;
						$.each(flowLogArr, function(i,n) {
							$('#tastKey').val(n.tastKey);
							//隐藏下一步操作人下拉框
							if(n.tastKey=="activitiEndTask"){
								$('.next-operate-person-tr').hide();
							}
							if(n.deleteReason == "completed") {
								deleteReasons = "同意";
							};
							
							if(n.deleteReason == "returnedSubmit") {
								deleteReasons = "退回到申请人";
							};
							if(n.deleteReason == "refusedToApproval") {
								deleteReasons = "拒绝";
							}
						tastName=n.taskName+deleteReasons;
							//如果i等于length-1是流程的第一步
							if(i==length-1){
								//流程编号
								$('.first-step-order').text(1);
								//操作人名
								$('.first-step-operate-person-userName').text(n.userName);
								//当前审批节点名字
								$('.first-step-taskName').text("申请提交");
								//时间
								$('.first-step-commentTime').text(n.commentTime);
								//审批意见
								$('.first-step-comment').text(n.comment);
								
							};
							//如果i不等于且不等于length-1，是流程的中间步骤
							if(i!= length-1){
								//流程序号
								var order=length-i;
								middleStepHtml='<div>'+	
													'<div style="height: 150; ">'+
														'<div class="number-name-box">'+
															'<span class="number-box-span middle-step-order middle-a-index" >'+order+'</span>'+
															'<span class="name-box-span middle-step-userName middle-a-index" >'+n.userName+'</span>'+
															'<img src="../../resources/images/open/openFlow.png" class="order-img" />'+
														'</div>'+
													'</div>'+
													'<div class="middle-step-box-div">'+
														'<ul class="middle-step-box-ul">'+
															'<li style="height: 30px;">'+
																'<span  class="middle-step-taskName view-taskName-span"  style="float: left;">'+tastName+'</span>'+
															'</li>'+
															'<li class="view-time-li middle-step-commentTime" >'+n.commentTime+'</li>'+
															'<li class="operate-view-box-li">'+
																'<div class="operate-view-title-li">操作意见：</div>'+
																'<div class="operate-view-text-li middle-step-comment">'+n.comment+'</div>'+
															'</li>'+
														'</ul>'+
													'</div>'+
												'</div>';
								$('.first-step').before(middleStepHtml);	
							};
						});
					}else{
						$yt_alert_Model.prompt("获取失败");
					}
				}
			});
	},
	getProjectType:function(code){
		if(code == 1){
			return "计划"
		}else if(code == 2){
			return "委托"
		}else if(code == 3){
			return "选学"
		}else if(code == 4){
			return "调训"
		}
	}
	
}
$(function() {
	//初始化方法
	budgetQueryDetails.init();
	
});