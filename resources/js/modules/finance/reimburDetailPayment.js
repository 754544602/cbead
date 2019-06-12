/**
 * 课酬报销支付反馈
 */
var projectList = {
	//课酬报销初始化方法
	init: function() {
		
		//获取一条详细信息
		projectList.getOneListInfo();
		/**
		 * 付款完成按钮
		 */
		$('.ok-button').on('click',function(){
			projectList.updateStatesClassExpense();
		});
		//取消按钮
		$('#no-cancel').click(function(){
			window.location.href = "reimbursementPayment.html";
		});
		$('.back-btn').click(function(){
			window.history.back();
		})
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
			url: $yt_option.base_path + "finance/teacherExpense/getBeanByIdTravel",
			async: false,
			data: {
				pkId: pkId
			},
			objName: 'data',
			success: function(data) {
				if(data.flag == 0) {
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
					if(data.data.workFlawState == "已完成"){
						$(".pay-bill").hide();
						$(".pay-info").hide();
						data.data.workFlawState='已通过'
					}
					//状态
					$('.state-type').text(data.data.workFlawState);
					//备注
					$('.details').text(data.data.remarks);
					projectList.residualBudget(data.data.projectCode);
					$('#budgetId').text('部门培训费');
					//支票号
					//$('#cheque-number').text(data.data.);
					//金额
					//$('#amount-money').text(data.data.);
					
					//列表
					$.ajax({
						type: "post",
						url: $yt_option.base_path + "finance/teacherExpense/getTeacherClassExpenseDetails",
						async: false,
						data: {
							projectCode:projectCode,
							pkId:pkId
						},
						success: function(data) {
							if(data.flag == 0) {
								var htmlTbody = $('.class-tbody');
								var htmlTr = '';
								if(data.data.length > 0) {
									var afterTaxSum = 0;
									var surrenderPersonalSum = 0;
									var expenseMoneySum = 0;
									var num = 0;
									$.each(data.data, function(i, v) {
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
												htmlTr += '<tr>' +
													'<td class="teacherId" style="display:none;">' + v.teacherId + '</td>' +
													'<td rowspan="' + lengthJson + '" style="text-align:center">' + num + '</td>' +
													'<td rowspan="' + lengthJson + '" style="text-align:center">' + v.teacherName + '</td>' +
													'<td rowspan="' + lengthJson + '" style="text-align:center">' + papersType + '</td>' +
													'<td rowspan="' + lengthJson + '">' + v.papersNumber + '</td>' +
													'<td rowspan="' + lengthJson + '">' + v.registeredBank + '</td>' +
													'<td rowspan="' + lengthJson + '">' + v.account + '</td>' + '<td  style="text-align:center">' + value.courseDate + '</td>' +
													'<td rowspan="' + lengthJson + '" style="text-align:right">' + $yt_baseElement.fmMoney(v.expenseMoney,2) + '</td>' +
													'<td rowspan="' + lengthJson + '" style="text-align:right">' + $yt_baseElement.fmMoney(v.surrenderPersonal,2) + '</td>' +
													'<td rowspan="' + lengthJson + '" style="text-align:right">' + $yt_baseElement.fmMoney(v.afterTax,2)+ '</td>' +
													'</tr>';
											} else {
												htmlTr += '<tr"><td style="text-align:center" class="courseDate">' + value.courseDate + '</td></tr>';

											}
										});
									});
									var mun = num + 1;
									htmlTr += '<tr><td colspan="7"  style="text-align:center">合计</td>' +
										'<td style="text-align:right"><b>' + $yt_baseElement.fmMoney(expenseMoneySum,2) + '</b></td>' +
										'<td style="text-align:right"><b>' + $yt_baseElement.fmMoney(surrenderPersonalSum,2) + '</b></td>' +
										'<td style="text-align:right"><b>' + $yt_baseElement.fmMoney(afterTaxSum,2) + '</b></td>' +
										'</tr>';
								} else {
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
								$yt_baseElement.hideLoading(function (){
									$yt_alert_Model.prompt("查询失败");
								});
							}

						}, //回调函数 匿名函数返回查询结果  
						isSelPageNum: true //是否显示选择条数列表默认false  
					});
					if (data.data.paymentState ==1){
						$('.ok-button').hide();
					}
					//流程详情获取数据
					var flowLog = JSON.parse(data.data.flowLog);
					var middleStepHtml;
					var length=flowLog.length;
					if(flowLog==""){
						$(".approval-process-module").hide();
					}
					$.each(flowLog, function(i,v) {
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
							//审批意见
							$('.first-step-comment').text(v.comment);
							
						}else{
							//如果i不等于且不等于length-1，是流程的中间步骤
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
														'<li class="view-time-li middle-step-commentTime" style="width:340px;" >'+v.commentTime+'</li>'+
														'<li class="operate-view-box-li">'+
															'<div class="operate-view-title-li">操作意见：</div>'+
															'<div class="operate-view-text-li middle-step-comment">'+v.comment+'</div>'+
														'</li>'+
													'</ul>'+
												'</div>'+
											'</div>';
							$('.last-step-div').append(middleStepHtml);	
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
	//finance/teacherExpense/updateStatesClassExpense
	/**
	 * 支付反馈调用接口
	 */
	updateStatesClassExpense:function(){
		var pkId = $yt_common.GetQueryString("pkId");
		var chequeNumber = $('#chequeNumber').val();
		var chequeNumberMoney = $('#chequeNumberMoney').val();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/teacherExpense/updateAlreadyPai",
			async: false,
			data: {
				pkId:pkId,
				chequeNumber:chequeNumber,
				chequeNumberMoney:chequeNumberMoney
			},
			success: function(data) {
				window.location.href = "reimbursementPayment.html";
			}
		});
	}
};
$(function() {
	//初始化方法
	projectList.init();
});