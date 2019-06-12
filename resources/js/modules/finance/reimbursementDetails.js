var projectList = {
	//课酬报销初始化方法
	init: function() {
		//获取一条详细信息
		projectList.getOneListInfo();
		//返回按钮
		$('.back-btn').click(function(){
			window.location.href = "reimburseExamination.html";
		});
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
				url: $yt_option.base_path + "finance/teacherExpense/updateApplyClassExpense",
				async: false,
				data: {
					pkId: pkId,
					businessCode:"classExpense",
					dealingWithPeople:dealingWithPeople,
					opintion:opintion,
					processInstanceId:processInstanceId,
					nextCode:nextCode
				},
				objName: 'data',
				success: function(data) {
					if(data.flag == 0) {};
				}
			});
			window.location.href = "reimburseExamination.html";
		});
		//审批取消
		$('#last-cancel').click(function(){
			//跳转到审批列表页面
			window.location.href = "reimburseExamination.html";
		});
		
		//调用下一步操作人
		//budgetApprovalDetails.getNextOperatePerson();
		var getAllNextPeople = projectList.getListSelectDealingWithPeople();
		if (getAllNextPeople !=null){
			$.each(getAllNextPeople,function (i,n){
				$("#nextPeople").append('<option value="'+n.userCode+'">'+n.userName+'</option>');
			});
		};
		$("#nextPeople").niceSelect();
	},
	/**
	 * 获取下一步操作人
	 */
	getListSelectDealingWithPeople:function(){
		var list =[];
		var processInstanceId = $('.processInstanceId').val();
		$.ajax({
			type: "post",
			url: $yt_option.base_path+"uniform/workFlowOperate/getSubmitPageData",
			data:{
				businessCode:"classExpense",
				processInstanceId:processInstanceId
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
	//剩余预算
	residualBudget:function(projectCode){
		$.ajax({
			type:"post",
			url:$yt_option.base_path+"finance/reduction/lookForAllProject",
			async:true,
			data:{
				projectCode:projectCode
			},
			success:function(data){
				if(data.flag==0){
					$('#surplusId').text(data.data[0].projectSurplusBudget);
					$('#startDate').text(data.data[0].startDate);
					$('#endDate').text(data.data[0].endDate);
				}
			},
		});
	},
	//流程详细信息
	getOneListInfo: function() {
		$yt_baseElement.showLoading();
		var pkId = $yt_common.GetQueryString("pkId");
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/teacherExpense/getBeanByIdClassExpense",
			async: true,
			data: {
				pkId: pkId
			},
			objName: 'data',
			success: function(data) {
				if(data.flag == 0) {
					$('.processInstanceId').val(data.data.processInstanceId);
					var projectCode = data.data.projectCode;
					//班级名
					$('#projectName').text(data.data.projectName);
					//班级编号
					$('#projectCode').text(projectCode);
					//流水号
					$('#flowNumber').text(data.data.flowNumber);
					//项目主任
					$('#projectHead').text(data.data.projectHead);
					//申请人
					$('#createUser').text(data.data.createUser);
					//申请时间
					$('#createTimeString').text(data.data.createTimeString);
					//状态
					$('.state-type').text(data.data.workFlawState);
					//支票号
					$('#cheque-number').text(data.data.chequeNumber);
					//金额
					$('#amount-money').text(data.data.chequeNumberMoney);
					//备注
					$('.details').text(data.data.remarks);
					projectList.residualBudget(data.data.projectCode);
					$('#budgetId').text('部门培训费');
					if(data.data.paymentState==2){
						$('#cheque').show();
					}
					var htmlTbody = $('.class-tbody').empty();
					var twoTbody = $('#two-table').empty();
					var htmlTr = '';
					var twoTr = '';
					if(data.data.expenseClassDetails.length > 0) {
						data.data.expenseClassDetails = JSON.parse(data.data.expenseClassDetails);
						var afterTaxSum = 0;
						var surrenderPersonalSum = 0;
						var expenseMoneySum = 0;
						var num = 0;
						$.each(data.data.expenseClassDetails, function(i, v) {
							//证件类型 1:身份证 2:护照 3:军官证 4:其他
							var papersType = v.papersType;
							if(papersType == 1) {
								papersType = '身份证';
							}
							else if(papersType == 2) {
								papersType = '护照';
							}
							else if(papersType == 3) {
								papersType = '港澳通行证';
							}
							else if(papersType == 4) {
								papersType = '军官证';
							}else if(papersType == 5){
								papersType = '其他';
							}else{
								papersType='';
							}
							var courseDateJson = v.courseDateJson;
							var lengthJson = courseDateJson.length;
							num = i + 1;
							var jsonTd = '';

							afterTaxSum += v.afterTax;
							surrenderPersonalSum += v.surrenderPersonal;
							expenseMoneySum += v.expenseMoney;
							$.each(courseDateJson, function(index, value) {
								if(index == 0) {
									htmlTr = '<tr>' +
										'<td class="teacherId" style="display:none;">' + v.teacherId + '</td>' +
										'<td rowspan="' + lengthJson + '" style="text-align:center">' + num + '</td>' +
										'<td rowspan="' + lengthJson + '" style="text-align:center"><a class="teacherName" style="color:#2080bf">' + v.teacherName + '</a></td>' +
										'<td rowspan="' + lengthJson + '" style="text-align:center">' + papersType + '</td>' +
										'<td rowspan="' + lengthJson + '">' + v.papersNumber + '</td>' +
										'<td rowspan="' + lengthJson + '">' + v.registeredBank + '</td>' +
										'<td rowspan="' + lengthJson + '">' + v.account + '</td>' + '<td  style="text-align:center">' + value.courseDate + '</td>' +
										'<td rowspan="' + lengthJson + '" style="text-align:right">' + $yt_baseElement.fmMoney(v.expenseMoney,2) + '</td>' +
										'<td rowspan="' + lengthJson + '" style="text-align:right">' + $yt_baseElement.fmMoney(v.surrenderPersonal,2) + '</td>' +
										'<td rowspan="' + lengthJson + '" style="text-align:right">' + $yt_baseElement.fmMoney(v.afterTax,2) + '</td>' +
										'</tr>';
										htmlTr = $(htmlTr).data('data',v);
										htmlTbody.append(htmlTr);
										$('.teacherName').off('click').on('click',function(){
											window.location.href = '../teacherCourse/teacherApprovalInf.html?pkId='+$(this).parents('tr').data('data').teacherId;
										})
								} else {
									htmlTr = '<tr"><td style="text-align:center" class="courseDate">' + value.courseDate + '</td></tr>';
									htmlTbody.append(htmlTr);
								}
							});
						});
						var mun = num + 1;
						htmlTr = '<tr><td colspan="7"  style="text-align:center">合计</td>' +
							'<td style="text-align:right"><b>' + $yt_baseElement.fmMoney(expenseMoneySum,2) + '</b></td>' +
							'<td style="text-align:right"><b>' + $yt_baseElement.fmMoney(surrenderPersonalSum,2) + '</b></td>' +
							'<td style="text-align:right"><b>' + $yt_baseElement.fmMoney(afterTaxSum,2) + '</b></td>' +
							'</tr>';
							htmlTbody.append(htmlTr);
					} else {
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
					
					//流程详情获取数据
					if(flowLog!=''){
						var flowLog = JSON.parse(data.data.flowLog);
					}
					var middleStepHtml;
					var length=flowLog.length;
					$.each(flowLog, function(i,v) {
						$('#tastKey').val(v.tastKey);
						//隐藏下一步操作人下拉框
						if(v.tastKey=="activitiEndTask"){
							$('.next-operate-person-tr').hide();
						}
						//如果i等于0是最后一步流程
						if(i==0){
							//流程编号
							$('.last-step-order').text(length);
							//操作人名
							$('.last-step-operate-person-userName').text(v.userName);
							//操作状态
							$('.last-step-operationState').text(v.operationState);
							//停滞时间							
							$('.last-step-commentTime').text(v.commentTime);
							if($yt_common.user_info.userName!=v.userCode){
									//流程序号
									var order=length-i;
									middleStepHtml='<div>'+	
														'<div style="height: 150; ">'+
															'<div class="number-name-box">'+
																'<span class="number-box-span middle-step-order middle-a-index" >'+order+'</span>'+
																'<span class="name-box-span middle-step-userName middle-a-index" >'+v.userName+'</span>'+
																'<img src="../../resources/images/open/openFlow.png" class="order-img" />'+
															'</div>'+
														'</div>'+
														'<div class="middle-step-box-div">'+
															'<ul class="middle-step-box-ul">'+
																'<li style="height: 30px;">'+
																	'<span  class="middle-step-taskName view-taskName-span"  style="float: left;">'+v.operationState+'</span>'+
																'</li>'+
																'<li class="view-time-li middle-step-commentTime">'+v.commentTime+'</li>'+
																'<li class="operate-view-box-li">'+
																	'<div class="operate-view-title-li">操作意见：</div>'+
																	'<div class="operate-view-text-li middle-step-comment">'+v.comment+'</div>'+
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
							$('.first-step-operate-person-userName').text(v.userName);
							//当前审批节点名字
							$('.first-step-taskName').text(v.operationState);
							//时间
							$('.first-step-commentTime').text(v.commentTime);							
						};
						//如果i不等于且不等于length-1，是流程的中间步骤
						if(i!=0 &&i < length-1){
							//流程序号
							var order=length-i;
							middleStepHtml='<div>'+	
												'<div style="height: 150; ">'+
													'<div class="number-name-box">'+
														'<span class="number-box-span middle-step-order middle-a-index" >'+order+'</span>'+
														'<span class="name-box-span middle-step-userName middle-a-index" >'+v.userName+'</span>'+
														'<img src="../../resources/images/open/openFlow.png" class="order-img" />'+
													'</div>'+
												'</div>'+
												'<div class="middle-step-box-div">'+
													'<ul class="middle-step-box-ul">'+
														'<li style="height: 30px;">'+
															'<span  class="middle-step-taskName view-taskName-span"  style="float: left;">'+v.operationState+'</span>'+
														'</li>'+
														'<li class="view-time-li middle-step-commentTime">'+v.commentTime+'</li>'+
														'<li class="operate-view-box-li">'+
															'<div class="operate-view-title-li">操作意见：</div>'+
															'<div class="operate-view-text-li middle-step-comment">'+v.comment+'</div>'+
														'</li>'+
													'</ul>'+
												'</div>'+
											'</div>';
							$('.last-step').append(middleStepHtml);
						};
					});
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function (){
						$yt_alert_Model.prompt("查询失败");
					});
				}
			}
		});
	},
};
$(function() {
	//初始化方法
	projectList.init();
});