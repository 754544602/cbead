var projectList = {
	//课酬报销初始化方法
	init: function() {
		//获取一条详细信息
		projectList.getOneListInfo();
		//返回按钮
		var type = $yt_common.GetQueryString("type");
		$('.page-return-btn').click(function() {
			if(type == 'reimburseExamination') {
				if($yt_common.GetQueryString("page")){
					window.location.href = "reimburseExamination.html?page="+$yt_common.GetQueryString("page");
				}
			} else if(type == 'reimbursementList'){
				window.location.href = "reimbursementList.html";
			}else if(type == 'reimbursementPayment'){
				window.location.href = "reimbursementPayment.html";
			}else if(type == 'allIndex'){
				window.location.href = "../index/allIndex.html";
			}
//			window.history.back();
		});
		$('.print').off().click(function(){
			projectList.print()
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
	projectCode:'',
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
					projectList.residualBudget(data.data.projectCode);
					$('#budgetId').text('部门培训费');
					var projectCode = data.data.projectCode;
					projectList.projectCode=data.data.projectCode;
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
						$(".pay-money").hide();
						$(".pay-info-title").hide();
						data.data.workFlawState='已通过'
					}
					//状态
					$('.state-type').text(data.data.workFlawState);
					//备注
					$('.details').text(data.data.remarks);
					//支票号
					$('#cheque-number').text(data.data.chequeNumber);
					if(data.data.paymentState==2){
						$('#cheque').show();
						$('.state-type').text('已开票')
					}else if(data.data.paymentState==1){
						$('.state-type').text('已支付')
					}
					//金额,小数点保留两位，加上千位分隔符
					var chequeNumberMoney = data.data.chequeNumberMoney;
					var num = chequeNumberMoney.toFixed(2)+"";//保留两位小数
					var money = num.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g,'$1,');
					$('#amount-money').text(money);
					if(data.data.workFlawState == '草稿') {
						$(".approval-process-module").hide();
					}
					//列表
					
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
						
					var flowLog = data.data.flowLog;
					//流程详情获取数据
					if(flowLog == "") {
						$(".approval-process-module").hide();
					} else {
						flowLog = JSON.parse(flowLog);
						var middleStepHtml;
						var length = flowLog.length;
						var tastName = '';
						var deleteReason = '';
						$.each(flowLog, function(i, v) {
							if(v.deleteReason == "submited") {
								deleteReason = "提交填制";
							} else if(v.deleteReason == "returnedSubmit") {
								deleteReason = "退回提交人";
							} else if(v.deleteReason == "revoke") {
								deleteReason = "已撤销";
							} else if(v.deleteReason == "completed") {
								deleteReason = "同意审批";
							} else if(v.deleteReason == "refusedToApproval") {
								deleteReason = "拒绝审批";
							} else if(v.deleteReason == "recall") {
								deleteReason = "已撤回";
							} else {
								deleteReason = "";
							}
							tastName = v.taskName + deleteReason;
							//如果i等于length-1是流程的第一步
							if(i == length - 1) {
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

							} else {

								//如果i不等于且不等于length-1，是流程的中间步骤
								//流程序号
								var order = length - i;
								middleStepHtml = '<div>' +
									'<div style="height: 150; ">' +
									'<div class="number-name-box">' +
									'<span class="number-box-span middle-step-order middle-a-index" >' + order + '</span>' +
									'<span class="name-box-span middle-step-userName middle-a-index" >' + v.userName + '</span>' +
									'<img src="../../resources/images/open/openFlow.png" class="order-img" />' +
									'</div>' +
									'</div>' +
									'<div class="middle-step-box-div">' +
									'<ul class="middle-step-box-ul">' +
									'<li style="height: 30px;">' +
									'<span  class="middle-step-taskName view-taskName-span"  style="float: left;">' + v.operationState + '</span>' +
									'</li>' +
									'<li class="view-time-li middle-step-commentTime" style="right:3%;left:auto" >' + v.commentTime + '</li>' +
									'<li class="operate-view-box-li" style="width:97%">' +
									'<div class="operate-view-title-li">操作意见：</div>' +
									'<div class="operate-view-text-li middle-step-comment">' + v.comment + '</div>' +
									'</li>' +
									'</ul>' +
									'</div>' +
									'</div>';
								$('.last-step-div').append(middleStepHtml);
							};
						});
					}
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}
			}
		});
	},
	print:function(){
		var pkId = $yt_common.GetQueryString("pkId");
		$.ajaxDownloadFile({
			url:$yt_option.base_path+"finance/teacherExpense/exportList",
			data:{
				projectCode:projectList.projectCode,
				pkId:pkId
			},
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt(data.message);
				} else {
					$yt_alert_Model.prompt(data.message);
				}
			}
		});
	}
};
$(function() {
	//初始化方法
	projectList.init();
});