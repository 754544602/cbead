var projectBudgetDetails = {
	//初始化方法
	init: function() {

		//获取跳转页面传过来的pkId
		var pkId = $yt_common.GetQueryString('pkId');

		//查询详细信息
		projectBudgetDetails.getBudgetInf();

		//初始化日期控件
		$(".report-date").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			lowerLimit: "NaN", // 日期下限，默认：NaN(不限制)     
			nowData: true, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd HH:mm",
			callback: function() { // 点击选择日期后的回调函数  
				//alert("您选择的日期是：" + $("#txtDate").val());  
			}
		});
		$(".out-hospital-date").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			lowerLimit: "NaN", // 日期下限，默认：NaN(不限制)     
			nowData: true, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd HH:mm",
			callback: function() { // 点击选择日期后的回调函数  
				//alert("您选择的日期是：" + $("#txtDate").val());  
			}
		});

		//获取项目下拉框
		var projectSelect = projectBudgetDetails.getAddBudgetSelect();
		if(projectSelect != null) {
			$.each(projectSelect, function(i, n) {
				$(".project-code").append('<option value="' + n.projectCode + '" createUserName="' + n.createUserName + '" projectType="' + n.projectType + '" classTeacher="' + n.classTeacher + '" projectHead="' + n.projectHead + '" startDate="' + n.startDate + '" endDate="' + n.endDate + '" traineeTotal="' + n.traineeTotal + '">' + n.projectName + '</option>');
			});
		}
		$(".project-code").niceSelect();
		//通过projectCode获取其他信息
		$("select.project-code").change(function() {
			var createUserName = $("select.project-code option:selected").attr("createUserName");
			var projectType = $("select.project-code option:selected").attr("projectType");
			var classTeacher = $("select.project-code option:selected").attr("classTeacher");
			var projectHead = $("select.project-code option:selected").attr("projectHead");
			var startDate = $("select.project-code option:selected").attr("startDate");
			var endDate = $("select.project-code option:selected").attr("endDate");
			var traineeTotal = $("select.project-code option:selected").attr("traineeTotal");
			$(".project-type").text(projectBudgetDetails.getProjectType(projectType));
			if(classTeacher == "null") {
				$(".class-teacher").text("");
			} else {
				$(".class-teacher").text(classTeacher);
			}
			if(projectHead == "null") {
				$(".project-head").text("");
			} else {
				$(".project-head").text(projectHead);
			}
			traineeTotal == 'null' ? $(".trainee-total").text(0) : $(".trainee-total").text(traineeTotal);
			$(".start-date").text(startDate.split(" ")[0]);
			$(".end-date").text(endDate.split(" ")[0]);
		});

		/*-------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

		//点击返回
		$('.back-btn').click(function() {
			//s审批记录跳转回去
			if($yt_common.GetQueryString("history")=='oldApprove'){
				window.location.href = "/cbead/website/view/budgetApproval/budgetApprovalList.html?backType="+2;
			}else{
				window.history.back();
			}
		});
	},

	/**
	 * 项目下拉框查询
	 */
	getAddBudgetSelect: function() {
		var list = [];
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/reduction/lookForAllProject",
			data: {
				searchParameters: ""
			},
			async: true,
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
				pkId: pkId
			}, //ajax查询访问参数
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag == 0) {
					//获取流程实例ID
					$(".processInstanceId").val(data.data.processInstanceId);
					$('.state-type').text(data.data.workFlawState);
					if(data.data.isOffSiteTraining == 0) {
						data.data.isOffSiteTraining = '否'
					}
					else if(data.data.isOffSiteTraining == 1) {
						data.data.isOffSiteTraining = '是'
					}
					if(data.data.costStandard == 1) {
						data.data.costStandard = '基本标准'
					}
					else if(data.data.costStandard == 2) {
						data.data.costStandard = '高成本标准'
					}
					$(".budget-inf").setDatas(data.data);
					
					//从返回的值里给select赋值
					$(".project-code").setSelectVal(data.data.projectCode);
					$(".project-type").text(projectBudgetDetails.getProjectType(data.data.projectType));
					//通过projectCode获取其他信息
//					if($(".project-code").val() != "") {
//						var createUserName = $("select.project-code option:selected").attr("createUserName");
//						var projectType = $("select.project-code option:selected").attr("projectType");
//						var classTeacher = $("select.project-code option:selected").attr("classTeacher");
//						var projectHead = $("select.project-code option:selected").attr("projectHead");
//						var startDate = $("select.project-code option:selected").attr("startDate");
//						var endDate = $("select.project-code option:selected").attr("endDate");
//						var traineeTotal = $("select.project-code option:selected").attr("traineeTotal");
//						if(projectType == 2) {
//							$(".project-type").text("委托");
//						}
//						if(projectType == 3) {
//							$(".project-type").text("选学");
//						}
//						if(projectType == 4) {
//							$(".project-type").text("调训");
//						}
//						if(classTeacher == "null") {
//							$(".class-teacher").text("");
//						} else {
//							$(".class-teacher").text(classTeacher);
//						}
//						if(projectHead == "null") {
//							$(".project-head").text("");
//						} else {
//							$(".project-head").text(projectHead);
//						}
//						$(".create-user-name").text(createUserName);
//						$(".start-date").text(startDate.split(" ")[0]);
//						$(".end-date").text(endDate.split(" ")[0]);
//						traineeTotal == 'null' ? $(".trainee-total").text(0) : $(".trainee-total").text(traineeTotal);
//						$('select.project-code').parents('td').css('width','722px');
//						$('select.project-code').parents('td').text($('div.project-code .current').text())
//						
//					}
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
					var projectBudget = '';
					if(projectBudgetDetailsArr != null) {
						$.each(projectBudgetDetailsArr, function(i, n) {
							n.budgetCost=$yt_baseElement.fmMoney(n.budgetCost,2);
							projectBudget = $('<tr><td align="right" width="100px"><input type="hidden" value="' +n.costCode+ '" class="cost-code"><span>'+ n.costName +'：</span></td><td style="text-align:right" class="budgetCost" data-text="budgetCost"></td><td style="width: 30px;"><span>元</span></td><td width="75%" style="word-break: break-all;" data-text="accordingInstructions"></td></tr>');
							projectBudget.setDatas(n);
							//costType  1:教学相关费用 2:后勤相关
							//types  1:预算申请 2:预算变更
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
						projectBudgetDetails.total($('.approval-change-before'));
						for(let j=0;j<times;j++){
							projectBudgetDetails.total($(".approval-change-after"+(j+1)))							
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
					if (flowLog.length>0) {
						$(".approval-process-module").show();
						var flowLogArr = $.parseJSON(flowLog);
						if(flowLogArr == "") {
							$(".approval-process-module").hide();
						}
						var middleStepHtml;
						var length = flowLogArr.length;
						var commentLi = "";
						$.each(flowLogArr, function(i, n) {
							$('#tastKey').val(n.tastKey);
							//隐藏下一步操作人下拉框
							if(n.tastKey == "activitiEndTask") {
								$('.next-operate-person-tr').hide();
							}
							//第一步
							if(i == length - 1) {
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
							if(i < length - 1) {
								//流程序号
								var order = length - i;
								middleStepHtml = '<div>' +
									'<div style="height: 150; ">' +
									'<div class="number-name-box">' +
									'<span class="number-box-span middle-step-order middle-a-index" >' + order + '</span>' +
									'<span class="name-box-span middle-step-userName middle-a-index" >' + n.userName + '</span>' +
									'<img src="../../resources/images/open/openFlow.png" class="order-img" />' +
									'</div>' +
									'</div>' +
									'<div class="middle-step-box-div">' +
									'<ul class="middle-step-box-ul">' +
									'<li style="height: 30px;">' +
									'<span  class="middle-step-taskName view-taskName-span"  style="float: left;">' + n.operationState + '</span>' +
									'</li>' +
									'<li class="view-time-li middle-step-commentTime" >' + n.commentTime + '</li>' +
									'<li class="operate-view-box-li">' +
									'<div class="operate-view-title-li">操作意见：</div>' +
									'<div class="operate-view-text-li middle-step-comment">' + n.comment + '</div>' +
									'</li>' +
									'</ul>' +
									'</div>' +
									'</div>';
								$('.first-step').before(middleStepHtml);
							};
						});
					}
				} else {
					$yt_alert_Model.prompt("获取失败");
				}
				$yt_baseElement.hideLoading();
			}
		});
	},
	getProjectType: function(code) {
		if(code == 1) {
			return "计划"
		} else if(code == 2) {
			return "委托"
		} else if(code == 3) {
			return "选学"
		} else if(code == 4) {
			return "中组部调训"
		} else if(code == 5) {
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
	projectBudgetDetails.init();

});