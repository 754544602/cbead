var projectList = {
	//课酬报销初始化方法
	init: function() {
		//获取一条详细信息
		projectList.getOneListInfo();
		//projectList.projectSurplusBudget();
		//返回按钮
		var type = $yt_common.GetQueryString("type");
		$('.back-btn').click(function() {
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
		});
		//打印
		$('.print').off().click(function(){
			projectList.print();
		})
		//流程单选按钮
		$(".check-label input[type='radio']").change(function() {
			var rad = $(this).val();
			//单选当前值为1同意显示下一步操作人下拉框
			if(rad == "completed") {
				$('.hid-input').show();
			};
			//单选当前值为0拒绝隐藏下一步操作人下拉框
			if(rad == "returnedSubmit") {
				$('#nextPeople').val("");
				$('.hid-input').hide();
			}
		});

		//审批意见提交
		$('#last-submit').click(function() {
			var pkId = $yt_common.GetQueryString('pkId');

			//流程实例id
			var processInstanceId = $('.processInstanceId').val();

			//下一步操作人
			var dealingWithPeople = $('#nextPeople').val();
			var tastKey = $('#tastKey').val();
			//如果满足该条件，是没结束流程的最后一步，不需要传下一步操作人
			if(tastKey == "activitiEndTask") {
				dealingWithPeople = "";
			}
			//审批意见
			var opintion = $('#opintion').val();
			//判断同意和不同意
			var nextCode = $('input[name="radioType"]:checked ').val();
			//拒绝
			if(nextCode == "returnedSubmit") {
				dealingWithPeople = "";
			}
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "finance/teacherExpense/updateApplyClassExpense",
				async: false,
				data: {
					pkId: pkId,
					businessCode: "classExpense",
					dealingWithPeople: dealingWithPeople,
					opintion: opintion,
					processInstanceId: processInstanceId,
					nextCode: nextCode
				},
				objName: 'data',
				success: function(data) {
					if(data.flag == 0) {};
				}
			});
			window.location.href = "reimburseExamination.html";
		});
		//审批取消
		$('#last-cancel').click(function() {
			//跳转到审批列表页面
			window.location.href = "reimburseExamination.html";
		});

		//调用下一步操作人
		//budgetApprovalDetails.getNextOperatePerson();
		var getAllNextPeople = projectList.getListSelectDealingWithPeople();
		if(getAllNextPeople != null) {
			$.each(getAllNextPeople, function(i, n) {
				$("#nextPeople").append('<option value="' + n.userCode + '">' + n.userName + '</option>');
			});
		};
		$("#nextPeople").niceSelect();
	},
	/**
	 * 获取下一步操作人
	 */
	getListSelectDealingWithPeople: function() {
		var list = [];
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/workFlowOperate/getSubmitPageData",
			data: {
				businessCode: "project",
				processInstanceId: "",
				parameters: "",
				versionNum: ""
			},
			async: false,
			success: function(data) {
				$.each(data.data, function(i, n) {
					for(var k in n) {
						console.log('k', k);
						console.log("n[k]", n[k]);
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
	projectCode:'',
	//流程详细信息
	getOneListInfo: function() {
		var me = this;
		$yt_baseElement.showLoading();
		var pkId = $yt_common.GetQueryString("pkId");
		var projectCode;
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/teacherExpense/getBeanByIdTravel",
			async: true,
			data: {
				pkId: pkId
			},
			objName: 'data',
			success: function(data) {
				if(data.flag == 0) {
					$('.processInstanceId').val(data.data.processInstanceId);
					projectCode = data.data.projectCode;
					me.projectCode = data.data.projectCode;
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
					data.data.workFlawState=='已完成'?data.data.workFlawState='已通过':data.data.workFlawState=data.data.workFlawState;
					//状态
					$('.state-type').text(data.data.workFlawState);
					//出差任务
					$('#missionId').text(data.data.remarks);
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
					$('#amount-money').text(money+"元");
					$('#budgetId').text('部门培训费');
					me.residualBudget(data.data.projectCode);
					//列表
					$.ajax({
						type: "post",
						url: $yt_option.base_path + "finance/teacherExpense/getTeacherTrainDetails",
						async: true,
						data: {
							projectCode: projectCode,
							pkId:pkId
						},
						success: function(data) {
							if(data.flag == 0) {
								me.getList = data.data;
								var htmlTbody = $('.class-tbody');
								var htmlTr = '';
								htmlTbody.empty();
								if(data.data.length > 0) {
									var num = 0;
									var allTravelmoney = 0;
									//票价总和
									var salesPriceSum = 0;
									//退票改签费总和
									var refundSigningFeeSum = 0;
									//总报销费
									var expenseMoneySum = 0;
									//保险总和
									var insuranceSum = 0
									//支票总计
									var checksalesPriceSum = 0;
									var checkrefundSigningFeeSum = 0;
									var checkexpenseMoneySum = 0;
									var checkinsuranceSum = 0
									$.each(data.data, function(i, v) {
										allTravelmoney = Number(v.salesPrice) + Number(v.insurance) + Number(v.refundSigningFee);
										salesPriceSum += Number(v.salesPrice);
										refundSigningFeeSum += Number(v.refundSigningFee);
										expenseMoneySum += Number(allTravelmoney);
										insuranceSum +=Number(v.insurance)
										if(v.papersType == '1') {
											v.papersTypeVel = '身份证';
										}
										else if(v.papersType == '2') {
											v.papersTypeVel = '护照';
										}
										else if(v.papersType == '3') {
											v.papersTypeVel = '港澳通行证';
										} else if(v.papersType == '4') {
											v.papersTypeVel = '军官证';
										} else if(v.papersType == '5') {
											v.papersTypeVel = '其他';
										} else {
											v.papersTypeVel = ' ';
										}
										if(v.paymentMethod == 1) {
											v.paymentMethodVel = '支票';
											checksalesPriceSum += Number(v.salesPrice);
											checkrefundSigningFeeSum += Number(v.refundSigningFee);
											checkexpenseMoneySum += Number(allTravelmoney);
											checkinsuranceSum +=Number(v.insurance)
										}
										else if(v.paymentMethod == 2) {
											v.paymentMethodVel = '电汇'
										}
										else if(v.paymentMethod == 3) {
											v.paymentMethodVel = '归还公务卡'
										}
										else if(v.paymentMethod == 4) {
											v.paymentMethodVel = '现金'
										}
										else if(v.paymentMethod == 5) {
											v.paymentMethodVel = '核销借款'
										}else{
											v.paymentMethodVel = ''
										}
										if(v.flighttrainNumber == undefined) {
											v.flighttrainNumber = v.flightTrainNumber;
										}
										num = i + 1;
										var bookingRecord = '';
										if(v.bookingRecord!=undefined){
											$.each(v.bookingRecord, function(x, y) {
												bookingRecord += '<div teacherStatementDetailsId="' + y.teacherStatementDetailsId + '">' + y.teacherStatementDetails + '</div>'
											});
										}
										if(v.warehousePosition==1){
											v.warehousePositionVal = '头等舱'
										}else if(v.warehousePosition==2){
											v.warehousePositionVal = '商务舱'
										}else if(v.warehousePosition==3){
											v.warehousePositionVal = '经济舱'
										}else if(v.warehousePosition==4){
											v.warehousePositionVal = '商务座'
										}else if(v.warehousePosition==5){
											v.warehousePositionVal = '一等座'
										}else if(v.warehousePosition==6){
											v.warehousePositionVal = '二等座'
										}else if(v.warehousePosition==7){
											v.warehousePositionVal = '软卧'
										}else if(v.warehousePosition==8){
											v.warehousePositionVal = '硬卧'
										}else if(v.warehousePosition==9){
											v.warehousePositionVal = '软座'
										}else if(v.warehousePosition==10){
											v.warehousePositionVal = '硬座'
										}else{
											v.warehousePositionVal=''
										}
										htmlTr = '<tr  class="rows tr' + i + ' row' + i + '" teacherId="' + v.teacherId + '">' +
											/*序号*/
											'<td style="text-align:center">' + num + '</td>' +
											/*教师*/
											'<td style="text-align:center"><a class="teacherName" style="color:#2080bf">' + v.teacherName + '</a></td>' +
											/*航班车次*/
											'<td style="text-align:center">' + v.flighttrainNumber + '</td>' +
											/*出发地*/
											'<td>' + v.placeDeparture + '</td>' +
											/*目的地*/
											'<td>' + v.bourn + '</td>' +
											'<td>' + v.warehousePositionVal + '</td>' +
											'<td style="text-align:left"><p>' + v.warehousePositionDetails + '</p></td>' +
											/*起止时间*/
											'<td>' + v.startEndTime + '</td>' +
											/*票价*/
											'<td style="text-align:right" class="salesPriceTd">' +	$yt_baseElement.fmMoney(v.salesPrice,2)  + '</td>' +
											/*保险*/
											'<td style="text-align:right" class="insurance">' + $yt_baseElement.fmMoney(v.insurance,2) + '</td>' +
											/*退改签费*/
											'<td style="text-align:right" class="refundSigningFeeTd">' + $yt_baseElement.fmMoney(v.refundSigningFee,2) + '</td>' +
											/*报销总金额*/
											'<td class="allTravelmoney" style="text-align:right">' + $yt_baseElement.fmMoney(allTravelmoney,2) + '</td>' +
											/*付款方式*/
											'<td style="text-align:center"><span class="paymentMethod">' + v.paymentMethodVel + '</span></td > ' +
											/*关联订票记录*/
											'<td style="text-align:center" class="bookingRecord">' + bookingRecord + '</td>' +
											'</tr>';
										htmlTbody.append(htmlTr);
										v.num = i;
										$('.tr' + i).data('trData', v);
										$('.teacherName').off('click').on('click',function(){
											window.location.href = '../teacher/teacherInf.html?pkId='+$(this).parents('tr').data('trData').teacherId;
										})
										console.log($('.tr' + i).data('trData').paymentMethod)
										if($('.tr' + i).data('trData').paymentMethod == 2) {
											/*
											 * me.addTwoInfo(数据，报销总额)
											 */
											var data = $('.tr' + i).data('trData');
											var all = $yt_baseElement.rmoney($('.tr' + i).find('.allTravelmoney').text());
											me.addTwoInfo(data, all);
										}
									});
									var numb = num + 1;
									htmlTr = '<tr><td class="numb" style="display:none;">' + numb + '</td><td colspan="8" style="text-align:center">合计：</td>' +
										'<td class="salesPriceSum"  style="text-align:right;font-weight:bold">' + $yt_baseElement.fmMoney(salesPriceSum,2) + '</td>' +
										'<td id="insuranceSum" style="text-align:right;font-weight:bold">'+$yt_baseElement.fmMoney(insuranceSum,2)+'</td>' +
										'<td id="refundSigningFeeSum" style="text-align:right;font-weight:bold">' + $yt_baseElement.fmMoney(refundSigningFeeSum,2) + '</td>' +
										'<td id="expenseMoneySum" style="text-align:right;font-weight:bold">' + $yt_baseElement.fmMoney(expenseMoneySum,2) + '</td><td></td>' +
										'<td></td>' +
										'</tr>' +
										'<tr><td class="numb" style="display:none;">' + numb + '</td><td colspan="8" style="text-align:center">支票合计：</td>' +
										'<td class="checksalesPriceSum"  style="text-align:right;font-weight:bold">' + $yt_baseElement.fmMoney(checksalesPriceSum,2) + '</td>' +
										'<td id="checkinsuranceSum" style="text-align:right;font-weight:bold">'+$yt_baseElement.fmMoney(checkinsuranceSum,2)+'</td>' +
										'<td id="checkrefundSigningFeeSum" style="text-align:right;font-weight:bold">' + $yt_baseElement.fmMoney(checkrefundSigningFeeSum,2) + '</td>' +
										'<td id="checkexpenseMoneySum" style="text-align:right;font-weight:bold">' + $yt_baseElement.fmMoney(checkexpenseMoneySum,2) + '</td><td></td>' +
										'<td></td>' +
										'</tr>';
									htmlTbody.append(htmlTr);
								} else {
									htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
										'<td colspan="14" align="center" style="border:0px;">' +
										'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
										'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
										'</div>' +
										'</td>' +
										'</tr>';
									htmlTbody.html(htmlTr);
								}
								$('select').niceSelect();
								$('.select-hide').hide();
								$yt_baseElement.hideLoading();
							} else {
								$yt_baseElement.hideLoading(function() {
									$yt_alert_Model.prompt("查询失败");
								});
							}
							
							//获取项目剩余预算

						}, //回调函数 匿名函数返回查询结果  
						isSelPageNum: true //是否显示选择条数列表默认false  
					});
					//调用费用减免，的项目下拉框接口，获取项目剩余预算
					$.ajax({
						type: "post",
						url: $yt_option.base_path + "finance/reduction/lookForAllProject",
						async: true,
						data: {
							selectParam:"",
							projectCode: projectCode
						},
						success: function(data) {
							$("#surplusId").text(data.data[0].projectSurplusBudget);
						}
					});
					if (data.data.flowLog != "") {
						$(".approve-title").show();
						$(".approve-box").show();
						//流程详情获取数据
						var flowLog = JSON.parse(data.data.flowLog);
						var middleStepHtml;
						var length = flowLog.length;
						$.each(flowLog, function(i, v) {
							$('#tastKey').val(v.tastKey);
							//隐藏下一步操作人下拉框
							if(v.tastKey == "activitiEndTask") {
								$('.next-operate-person-tr').hide();
							}
							//如果i等于0是最后一步流程
							if(i == 0) {
								//流程编号
								$('.last-step-order').text(length);
								//操作人名
								$('.last-step-operate-person-userName').text(v.userName);
								//操作状态
								$('.last-step-operationState').text(v.operationState);
								//停滞时间							
								$('.last-step-commentTime').text(v.commentTime);
							};
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
	
							};
							//如果i不等于且不等于length-1，是流程的中间步骤
							if(i != length - 1) {
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
									'<li class="view-time-li middle-step-commentTime" style="width:200px;right:3%;left:auto">' + v.commentTime + '</li>' +
									'<li class="operate-view-box-li" style="width:97%">' +
									'<div class="operate-view-title-li">操作意见：</div>' +
									'<div class="operate-view-text-li middle-step-comment">' + v.comment + '</div>' +
									'</li>' +
									'</ul>' +
									'</div>' +
									'</div>';
								$('.last-step').append(middleStepHtml);
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
	
	
	//教师支付信息附表
	addTwoInfo: function(data, all) {
		var htmlBody = $('#two-table');
		var htmlTr = '';
		var bool = true;
		if($('#two-table').find('.twoTr').length==0){
			$('#two-table').empty();
			$('#two-table').parents('table').hide();
		}
		$.each($('#two-table').find('.twoTr'), function(i,n) {
			if($(n).data('data').teacherId==data.teacherId){
				console.log($(n).data('data').twomoney)
				if($(n).data('data').twomoney==undefined){
					$(n).data('data').twomoney = all;
					$(n).find('.twotablemoney').text($yt_baseElement.fmMoney($yt_baseElement.rmoney($(n).data('data').twomoney)+$yt_baseElement.rmoney($(n).find('.twotablemoney').text()),2));
				}
				bool =false;
			}
		});
		data.papersNumber == undefined ? data.papersNumber = '' : data.papersNumber = data.papersNumber;
		if(bool){
			htmlTr = '<tr class="twoTr twoTr' + data.num + ' teacher'+data.teacherId+'">' +
			'<td style="text-align:center">' + ($('#two-table .twoTr').length + 1) + '</td>' +
			'<td style="text-align:center">' + data.teacherName + '</td>' +
			'<td style="text-align:center">' + data.papersTypeVel + '</td>' +
			'<td>' + data.papersNumber + '</td>' +
			'<td>' + data.registeredBank + '</td>' +
			'<td>' + data.account + '</td>' +
			'<td style="text-align:center">电汇</td>' +
			'<td style="text-align:right" class="twotablemoney" >' + $yt_baseElement.fmMoney(all,2) + '</td>' +
			'</tr>';
			htmlTr = $(htmlTr).data('data',data);
			htmlBody.append(htmlTr);
			if($('#two-table').find('.twoTr').length>0){
				$('#two-table').parents('table').show();
			}
		}
	},
	print:function(){
		var me = this ;
		var pkId = $yt_common.GetQueryString("pkId");
		if($('.rows').length>0){
			var totalJson = {
			salesPrice:$yt_baseElement.rmoney($('.salesPriceSum').text()),
			insurance:$yt_baseElement.rmoney($('#insuranceSum').text()),
			refundSigningFee:$yt_baseElement.rmoney($('#refundSigningFeeSum').text()),
			total:$yt_baseElement.rmoney($('#expenseMoneySum').text())
			}
			var totalCheckJson = {
				salesPrice:$yt_baseElement.rmoney($('.checksalesPriceSum').text()),
				insurance:$yt_baseElement.rmoney($('#checkinsuranceSum').text()),
				refundSigningFee:$yt_baseElement.rmoney($('#checkrefundSigningFeeSum').text()),
				total:$yt_baseElement.rmoney($('#checkexpenseMoneySum').text())
			}
		}else{
			var totalJson = {
			salesPrice:0,
			insurance:0,
			refundSigningFee:0,
			total:0
			}
			var totalCheckJson = {
				salesPrice:0,
				insurance:0,
				refundSigningFee:0,
				total:0
			}
		}
		
		var teacherJsonArr = [];
		if($('.twoTr').length>0){
			$.each($('.twoTr'),function(i,n){
				var data = $(n).data('data');
				var teacherJson ={
					teacherName:data.teacherName,
					papersType:data.papersTypeVel,
					papersNumber: data.papersNumber,
					registeredBank: data.registeredBank,
					account: data.account,
					paymentMethod: data.paymentMethodVel,
					total:$yt_baseElement.rmoney($(n).find('.twotablemoney').text()),
				}
				teacherJsonArr.push(teacherJson);
			})
			
		}else{
			teacherJsonArr=''
		}
		totalJson = JSON.stringify(totalJson);
		totalCheckJson = JSON.stringify(totalCheckJson);
		teacherJsonArr = JSON.stringify(teacherJsonArr);
		//加密
//		totalJson = Base64.encode(totalJson);
//		totalCheckJson = Base64.encode(totalCheckJson);
//		teacherJsonArr = Base64.encode(teacherJsonArr);
		$.ajaxDownloadFile({
			type: "post",
			url:$yt_option.base_path+"finance/teacherExpense/exportTeacherTrainDetails",
			data:{
				projectCode:me.projectCode,
				pkId:pkId,
				totalJson:totalJson,
				totalCheckJson:totalCheckJson,
				teacherJson:teacherJsonArr
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