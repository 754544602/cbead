var budgetApprovalDetails = {
	//初始化方法
	init: function() {
		//获取跳转页面传过来的pkId
		var pkId = $yt_common.GetQueryString('pkId');
		
		//查询详细信息
		budgetApprovalDetails.getBudgetInf();
		
		
		//初始化日期控件
//		$(".report-date").calendar({
//		    speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
//		    complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
//		    readonly: true, // 目标对象是否设为只读，默认：true     
//		    lowerLimit:"NaN", // 日期下限，默认：NaN(不限制)     
//		    nowData:true,//默认选中当前时间,默认true  
//		    dateFmt:"yyyy-MM-dd HH:mm",  
//		    callback: function() { // 点击选择日期后的回调函数  
//		        //alert("您选择的日期是：" + $("#txtDate").val());  
//		    }  
//		});  
//		$(".out-hospital-date").calendar({
//		    speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
//		    complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
//		    readonly: true, // 目标对象是否设为只读，默认：true     
//		    lowerLimit:"NaN", // 日期下限，默认：NaN(不限制)     
//		    nowData:true,//默认选中当前时间,默认true  
//		    dateFmt:"yyyy-MM-dd HH:mm",  
//		    callback: function() { // 点击选择日期后的回调函数  
//		        //alert("您选择的日期是：" + $("#txtDate").val());  
//		    }  
//		});
		
		//获取项目下拉框
		var projectSelect = budgetApprovalDetails.getAddBudgetSelect();
		if (projectSelect !=null){
			$.each(projectSelect,function (i,n){
				$(".project-code").append('<option value="'+n.projectCode+'" createUserName="'+n.createUserName+'" projectType="'+n.projectType+'" classTeacher="'+n.classTeacher+'" projectHead="'+n.projectHead+'" startDate="'+n.startDate+'" endDate="'+n.endDate+'" traineeTotal="'+n.traineeTotal+'">'+n.projectName+'</option>');
			});
		}
		$(".project-code").niceSelect();
		$("div.project-code").hide();
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
			$(".project-type").text(budgetApprovalDetails.getProjectType(projectType));
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
			traineeTotal == 'null' ? $(".trainee-total").text(0):$(".trainee-total").text(traineeTotal);
		});
		
		/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/
		
		//流程单选按钮
		$(".check-label input[type='radio']").change( function() {
		  	var rad = $(this).val();
		  	//单选当前值为1同意显示下一步操作人下拉框
		  	if (rad=="completed") {
		  		$('.hid-input').show();
		  	};
		  	//单选当前值为0拒绝隐藏下一步操作人下拉框
		  	if (rad=="returnedSubmit") {
		  		$('#nextPeople').val("");
		  		$('.hid-input').hide();
		  	}
		});
		
		//审批意见提交
		$('#last-submit').click(function(){
			var pkId = $yt_common.GetQueryString('pkId');
			
			//流程实例id
			var processInstanceId=$('.processInstanceId').val();
			
			//下一步操作人
			var dealingWithPeople=$('#nextPeople').val();
			var tastKey = $('#tastKey').val();
			//如果满足该条件，是没结束流程的最后一步，不需要传下一步操作人
			if(tastKey == "activitiEndTask"){
				dealingWithPeople="";
			}
			//审批意见
			var opintion=$('#opintion').val();
			//判断同意和不同意
			var nextCode = $('input[name="radioType"]:checked ').val();
			//拒绝
			if(nextCode=="returnedSubmit"){
				dealingWithPeople="";
			}
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "finance/projectBudget/updateApply",
				data: {
					pkId: pkId,
					businessCode:"projectBudget",
					types:$(".project-name").data('data').types,
					dealingWithPeople:dealingWithPeople,
					opintion:opintion,
					processInstanceId:processInstanceId,
					nextCode:nextCode
				},
				success: function(data) {
					if(data.flag == 0) {
						$yt_alert_Model.prompt("操作成功!");
					};
				}
			});
			window.location.href = "budgetApprovalList.html?backType="+1;
		});
		//审批取消
		$('#last-cancel').click(function(){
			//跳转到审批列表页面
			window.location.href = "budgetApprovalList.html?backType="+1;
		});
		//点击返回
		$('.back-btn').click(function(){
			window.location.href = "budgetApprovalList.html?backType="+1;
		});
	},
	/**
	 * 获取下一步操作人
	 */
	getListSelectDealingWithPeople:function(processInstanceId){
		var list =[];
		$.ajax({
			type: "post",
			url: $yt_option.base_path+"uniform/workFlowOperate/getSubmitPageData",
			data:{
				businessCode:"projectBudget",
				processInstanceId:processInstanceId,
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
						$(".project-name").data('data',data.data);
						//获取流程实例ID
						$(".processInstanceId").val(data.data.processInstanceId);
						
						$('.state-type').text(data.data.workFlawState);
						//是否异地培训
						$(".budget-inf").setDatas(data.data);
						if (data.data.isOffSiteTraining == 0) {
							data.data.isOffSiteTraining  = "否"
						} else{
							data.data.isOffSiteTraining  = "是"
						}
						$(".is-offSite-training").text(data.data.isOffSiteTraining);
						//是否异地培训 1:基本标准 2:高成本标准
						if (data.data.costStandard == 1) {
							data.data.costStandard  = "基本标准"
						} else{
							data.data.costStandard  = "高成本标准"
						}
						$(".cost-standard").text(data.data.costStandard);
						//从返回的值里给select赋值
						$(".project-code").setSelectVal(data.data.projectCode);
						//通过projectCode获取其他信息
						if($(".project-code").val()!=""){
							var projectType=$("select.project-code option:selected").attr("projectType");
							var classTeacher=$("select.project-code option:selected").attr("classTeacher");
							var projectHead=$("select.project-code option:selected").attr("projectHead");
							var startDate=$("select.project-code option:selected").attr("startDate");
							var endDate=$("select.project-code option:selected").attr("endDate");
							var traineeTotal=$("select.project-code option:selected").attr("traineeTotal");
							$(".create-user-name").text(data.data.createUser);
							$(".project-type").text(budgetApprovalDetails.getProjectType(projectType));
							if(projectType == 2) {
								$(".project-type").text("委托");
							}
							else if(projectType == 3) {
								$(".project-type").text("选学");
							}
							else if(projectType == 4) {
								$(".project-type").text("中组部调训");
							}
							else if(projectType == 5) {
								$(".project-type").text("国资委调训");
							}
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
//							if(data.data.traineeTotal==0||data.data.traineeTotal==undefined){
//								traineeTotal == 'null' ? $(".trainee-total").text(0):$(".trainee-total").text(traineeTotal);
//							}
							$('select.project-code').parents('td').css('width','722px');
							$('select.project-code').parents('td').text($('div.project-code .current').text());
							
						}
						//获取变更次数
						var times = data.data.dataType;
						var htmlappend='';
						if(times != undefined){
							for(let j=0;j<times;j++){
								htmlappend='<div class="approval-change-after approval-change-after'+(j+1)+'">'+
												'<div class="class-info-div">预算明细(第'+(j+1)+'次变更)</div>'+
												'<div class="tab-content class-info">'+
													'<div class="class-info-centent budget-subsidiary-change">'+
														'<div class="teach-related-expenses">'+
															'<div class="teach-related-expenses-title">'+
																'<span>教学相关费用</span>'+
															'</div>'+
															'<table class="class-info-table teach-related-expenses-table" style="width:100%">'+
															'</table>'+
														'</div>'+
														'<div class="logistics-related-expenses">'+
															'<div class="teach-related-expenses-title">'+
																'<span>后勤相关费用</span>'+
															'</div>'+
															'<table class="class-info-table logistics-related-expenses-table" style="width:100%">'+
															'</table>'+
															'<table class="class-info-table" style="width: 100%;">'+
																'<tr><td width="100px" align="right">合计：</td><td class="total"></td></tr>'+
															'</table>'+
														'</div>'+
													'</div>'+
												'</div>'+
											'</div>';
											$('#approval-change-after').append(htmlappend);
							}
						}else{
							$("#approval-change-after").hide();
						}
						//获取预算明细
						var projectBudgetDetailsArr = $.parseJSON(data.data.projectBudgetDetails);
						console.log(projectBudgetDetailsArr)
						var projectBudget = '';
						if(projectBudgetDetailsArr!=null){
							$.each(projectBudgetDetailsArr, function(i,n) {
								n.budgetCost=$yt_baseElement.fmMoney(n.budgetCost,2);
								projectBudget = $('<tr><td align="right" width="100px"><input type="hidden" value="' +n.costCode+ '" class="cost-code"><span>'+ n.costName +'：</span></td><td style="text-align:right" class="budgetCost" data-text="budgetCost"></td><td style="width: 50px;"><span>元</span></td><td width="70%" style="word-break: break-all;" data-text="accordingInstructions"></td></tr>');
								projectBudget.setDatas(n);
								if(n.types==1){//1:预算申请 2:预算变更
									if(n.costType==1){//1:教学相关费用 2:后勤相关费用
									$(".approval-change-before .teach-related-expenses-table").append(projectBudget);
									}
									if(n.costType==2){
										$(".approval-change-before .logistics-related-expenses-table").append(projectBudget);
									}
								}else if(n.types==2){
									if(n.costType==1){
										$(".approval-change-after"+n.dataType+" .teach-related-expenses-table").append(projectBudget);
									}
									if(n.costType==2){
										$(".approval-change-after"+n.dataType+" .logistics-related-expenses-table").append(projectBudget);
									}
								}
							});
							budgetApprovalDetails.total($('.approval-change-before'));
							for(let j=0;j<times;j++){
								budgetApprovalDetails.total($(".approval-change-after"+(j+1)))							
							}
						$.each($('.approval-change-before input'),function(i,n){
							if($(n).css('display')!='none'){
								$(n).parents('td').append('<span></span>');
								$(n).siblings('span').text($(n).val());
								$(n).hide();
								
							}
						})
						}
						
						//流程
						var flowLog = data.data.flowLog;
						var flowLogArr = $.parseJSON(flowLog);
						if(flowLogArr==""){
							$(".approval-process-module").hide();
						}
						var middleStepHtml;
						var length=flowLogArr.length;
						$.each(flowLogArr, function(i,n) {
							$('#tastKey').val(n.tastKey);
							//审批日志最后一条数据
							if(i==0){
								//隐藏下一步操作人下拉框\n
								if(n.tastKey=="activitiEndTask"){
								$('.next-operate-person-tr').hide();
								}else{
									$('.next-operate-person-tr').show();
								}
								//流程编号
								$('.last-step-order').text(length);
								//操作人名
								$('.last-step-operate-person-userName').text(n.userName);
								//操作状态
								$('.last-step-operationState').text(n.operationState);
								//停滞时间							
								$('.last-step-commentTime').text(n.commentTime);
								console.log(n.userCode);
								if($yt_common.user_info.userName!=n.userCode||n.tastKey=="activitiEndTask"&&$yt_common.user_info.userName==n.userCode&&n.deleteReason!=''){
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
																	'<span  class="middle-step-taskName view-taskName-span"  style="float: left;">'+n.operationState+'</span>'+
																'</li>'+
																'<li class="view-time-li middle-step-commentTime" >'+n.commentTime+'</li>'+
																'<li class="operate-view-box-li">'+
																	'<div class="operate-view-title-li">操作意见：</div>'+
																	'<div class="operate-view-text-li middle-step-comment">'+n.comment+'</div>'+
																'</li>'+
															'</ul>'+
														'</div>'+
													'</div>';
									$('.last-step').append(middleStepHtml);	
									$('.view-box-div').hide();
									$('.view-box-div').prev().hide();
									$('.yt-eidt-model-bottom').hide();
								}
							};
							//如果i等于length-1是流程的第一步
							if(i==length-1){
								//流程编号
								$('.first-step-order').text(1);
								//操作人名
								$('.first-step-operate-person-userName').text(n.userName);
								//当前审批节点名字
								$('.first-step-taskName').text(n.operationState);
								//时间
								$('.first-step-commentTime').text(n.commentTime);
								
							};
							//如果i不等于且不等于length-1，是流程的中间步骤
							if(i!=0 && i < length-1){
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
																'<span  class="middle-step-taskName view-taskName-span"  style="float: left;">'+n.operationState+'</span>'+
															'</li>'+
															'<li class="view-time-li middle-step-commentTime" >'+n.commentTime+'</li>'+
															'<li class="operate-view-box-li">'+
																'<div class="operate-view-title-li">操作意见：</div>'+
																'<div class="operate-view-text-li middle-step-comment">'+n.comment+'</div>'+
															'</li>'+
														'</ul>'+
													'</div>'+
												'</div>';
								$('.last-step').append(middleStepHtml);	
							};
						});
						//调用下一步操作人
						var getAllNextPeople = budgetApprovalDetails.getListSelectDealingWithPeople(data.data.processInstanceId);
						if (getAllNextPeople !=null){
							$.each(getAllNextPeople,function (i,n){
								$("#nextPeople").append('<option value="'+n.userCode+'">'+n.userName+'</option>');
							});
						};
						$("#nextPeople").niceSelect();
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
			return "中组部调训"
		}else if(code == 5){
			return "国资委调训"
		}
	},//合计      x合计的父级
	total:function(x){
		var num =0;
		$.each($(x).find('.budgetCost'),function(i,n){
			var val = $(n).text();
			val==''?val='0':val=val;
			num +=Number($yt_baseElement.rmoney(val));
		})
		$(x).find('.total').text($yt_baseElement.fmMoney(num,2)+'元');
		
	}
	
}
$(function() {
	//初始化方法
	budgetApprovalDetails.init();
	
});