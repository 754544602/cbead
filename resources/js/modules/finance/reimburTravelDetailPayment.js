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
		var me = this ;
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
					projectList.residualBudget(data.data.projectCode);
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
					if (data.data.workFlawState == "已完成") {
						$(".pay-info-title").hide();
						$('.pay-info-cont').hide();
						data.data.workFlawState='已通过'
					}
					//状态
					$('.state-type').text(data.data.workFlawState);
					
					$('#missionId').text(data.data.remarks);
					//备注
					$('.details').text(data.data.remarks);
					//支票号
					//$('#cheque-number').text(data.data.);
					//金额
					//$('#amount-money').text(data.data.);
					
					//列表
					$.ajax({
						type: "post",
						url: $yt_option.base_path + "finance/teacherExpense/getTeacherTrainDetails",
						async: false,
						data: {
							projectCode:projectCode,
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
						//保险总和
						var insuranceSum = 0;
						//退票改签费总和
						var refundSigningFeeSum = 0;
						//总报销费
						var expenseMoneySum = 0;
						//支票总计
						var checkinsuranceSum = 0;
						var checksalesPriceSum = 0;
						var checkrefundSigningFeeSum = 0;
						var checkexpenseMoneySum = 0;
						$.each(data.data, function(i, v) {
							allTravelmoney = Number(v.salesPrice) + Number(v.insurance) + Number(v.refundSigningFee);
							salesPriceSum += Number(v.salesPrice);
							insuranceSum += Number(v.insurance);
							refundSigningFeeSum += Number(v.refundSigningFee);
							expenseMoneySum += allTravelmoney;
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
								checkexpenseMoneySum += allTravelmoney;
								checkinsuranceSum += Number(v.insurance);
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
								v.flighttrainNumber = '';
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
							if(v.warehousePositionDetails==undefined){
								v.warehousePositionDetails=''
							}
							num = i + 1;
							var bookingRecord = '';
							v.bookingRecord==undefined?v.bookingRecord='':v.bookingRecord=v.bookingRecord;
							$.each(v.bookingRecord, function(x, y) {
								bookingRecord += '<div teacherStatementDetailsId="' + y.teacherStatementDetailsId + '">' + y.teacherStatementDetails + '</div>'
							});

							htmlTr = '<tr  class="rows tr' + i + ' row' + i + '" teacherId="' + v.teacherId + '">' +
								/*序号*/
								'<td style="text-align:center">' + num + '</td>' +
								/*教师*/
								'<td style="text-align:center">' + v.teacherName + '</td>' +
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
							console.log(v);
							$('.tr' + i).data('trData', v);
							if($('.tr' + i).data('trData').paymentMethod == 2) {
								/*
								 * me.addTwoInfo(数据，报销总额)
								 */
								var data = $('.tr' + i).data('trData');
								var all = $yt_baseElement.rmoney($('.tr' + i).find('.allTravelmoney').text());
								me.addTwoInfo(data, all);
//								addAll();
							}
						});
						var numb = num + 1;
						htmlTr = '<tr><td class="numb" style="display:none;">' + numb + '</td><td colspan="8" style="text-align:center">合计：</td>' +
							'<td class="salesPriceSum"  style="text-align:right;font-weight:bold">' + $yt_baseElement.fmMoney(salesPriceSum,2) + '</td>' +
							'<td style="text-align:right;font-weight:bold">'+$yt_baseElement.fmMoney(insuranceSum)+'</td>' +
							'<td id="refundSigningFeeSum" style="text-align:right;font-weight:bold">' + $yt_baseElement.fmMoney(refundSigningFeeSum,2) + '</td>' +
							'<td id="expenseMoneySum" style="text-align:right;font-weight:bold">' + $yt_baseElement.fmMoney(expenseMoneySum,2) + '</td><td></td>' +
							'<td></td>' +
							'</tr>' +
							'<tr><td class="numb" style="display:none;">' + numb + '</td><td colspan="8" style="text-align:center">支票合计：</td>' +
							'<td class="checksalesPriceSum"  style="text-align:right;font-weight:bold">' + $yt_baseElement.fmMoney(checksalesPriceSum,2) + '</td>' +
							'<td style="text-align:right;font-weight:bold">'+$yt_baseElement.fmMoney(checkinsuranceSum)+'</td>' +
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
								$yt_baseElement.hideLoading(function (){
									$yt_alert_Model.prompt("查询失败");
								});
							}

						}, //回调函数 匿名函数返回查询结果  
						isSelPageNum: true //是否显示选择条数列表默认false  
					});
					//调用费用减免，的项目下拉框接口，获取项目剩余预算
					$.ajax({
						type: "post",
						url: $yt_option.base_path + "finance/reduction/lookForAllProject",
						async: false,
						data: {
							selectParam:"",
							projectCode: projectCode
						},
						success: function(data) {
							$("#surplusId").text(data.data[0].projectSurplusBudget);
						}
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
														'<li class="view-time-li middle-step-commentTime" style="" >'+v.commentTime+'</li>'+
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
	},	//教师支付信息附表
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