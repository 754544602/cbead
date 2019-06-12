var loanApply={
	riskExcMark:"../../../../../resources-sasac/images/common/war-red.png",//风险感叹号图片
	riskWarImg:"../../../../../resources-sasac/images/common/risk-war.png",//风险未通过图片红灯
	riskViaImg:"../../../../../resources-sasac/images/common/risk-via.png",//风险通过图片绿灯
	loanId:"",//全局的借款Id
	loanDataObj:"",//全局的借款数据存储
	init:function(){
		//获取当前登录用户信息
     	sysCommon.getLoginUserInfo();
		//初始化下拉列表
		$("#loanApply select").niceSelect();
		//获取页面跳转传输的参数对象
		var requerParameter = $yt_common.GetRequest();
		// 获取传输的项目ID
		loanApply.loanId = requerParameter.loanId;
		
		//借款金额操作事件
		loanApply.loanMoneyEvent();
		//给当前页面设置最小高度
		$("#loanApply").css("min-height",$(window).height()-32);
		//金额input计算
		loanApply.events();
		//调用格式化金额方法
		loanApply.fmMonList();
		//调用获取借款申请详情信息
		loanApply.getLoanInfoDetail();
		//获取流程日志
		//获取页面跳转传输的参数对象
		var requerParameter = $yt_common.GetRequest();
		// 获取传输的项目ID
		var processInstanceId=requerParameter.processInstanceId;
		//调用获取流程日志方法
		var flowLogHtml = sysCommon.getCommentByProcessInstanceId(processInstanceId);
		$(".flow-log-div").html(flowLogHtml);
	},
	//格式化金额方法
	fmMonList:function(){
		$(".refund-tab-inp").attr("placeholder","0.00");
		var moneyInpArray=$(".refund-tab-inp");
		for(j = 0; j < moneyInpArray.length; j++) {
   			if(moneyInpArray.eq(j).val()!=''){
				moneyInpArray.eq(j).val($yt_baseElement.fmMoney(moneyInpArray.eq(j).val()));
			}
		};
		var moneyTextArray=$(".moneyText");
		for(h = 0; h < moneyTextArray.length; h++) {
   			if(moneyTextArray.eq(h).text()!=''){
				moneyTextArray.eq(h).text($yt_baseElement.fmMoney(moneyTextArray.eq(h).text()));
			}else{
				moneyTextArray.eq(h).text($yt_baseElement.fmMoney(0));
			}
		}
	},
	/**
	 * 事件处理
	 */
	events: function() {
		//调用父级关闭当前窗体方法
		$("#closeBtn").click(function(){
			if(window.top == window.self){//不存在父页面
  				window.close();
			 }else{
			 	parent.closeWindow();
			}
		});
		//金额文本框获取焦点事件 
		$('.refund-tab-inp').on('focus', function() {
			var ts = $(this);
			if(ts.val() != "") {
				//调用还原格式化的方法  
				ts.val($yt_baseElement.rmoney(ts.val()));
			}
		});
		//金额文本框失去焦点事件 
		$('.refund-tab-inp').on('blur', function() {
			var ts = $(this);
			if(ts.val() != '') {
				//调用格式化金额方法  
				ts.val($yt_baseElement.fmMoney(ts.val()));
			}
		});
		//金额文本框输入事件 
		$('.refund-tab-inp').on('keyup', function() {
			var ts = $(this);
			if(ts.val() != '') {
				//调用格式化金额方法  
				ts.val(ts.val().replace(/[^\d.]/g, ''));
			}
		});

		//补领/返还方式  合计金额
		$('.refund-tab-inp').blur(function() {
		 	loanApply.refundTotal();
		});

		//调用表格行点击事件改变背景色方法
		$('.yt-table tbody').on('click', 'tr', function() {
			//当前对象
			var ts = $(this);
			//所有同级元素
			var trs = ts.siblings();
			//移除样式
			trs.removeClass('yt-table-active');
			//点击行追加样式
			ts.addClass('yt-table-active')
		});
	},
	/**
	 * 
	 * 获取借款信息详情
	 * 
	 */
    getLoanInfoDetail:function(){
    	$.ajax({
				type: "post",
				url:"sz/loanApp/getLoanAppInfoDetailByLoanAppId",
				async: false,
				data:{
					loanAppId:loanApply.loanId
				},
				success: function(data) {
					if(data.flag == 0){
						var  dataObj = data.data;
						loanApply.loanDataObj = dataObj;
						if(dataObj && dataObj !="" && dataObj !=undefined){
							//单据编号
							$("#formNum").text(dataObj.loanAppNum);
							//申请时间
							$("#applyDate").text(dataObj.applicantTime);
							//申请人
							$("#busiUsers").text(dataObj.applicantUserName);
							//部门
							$("#deptName").text(dataObj.applicantUserDeptName);
							//职务
							$("#jobName").text(dataObj.applicantUserJobName == "" ? "--" : dataObj.applicantUserJobName);
							//电话
							$("#telPhone").text(dataObj.applicantUserPhone == "" ? "--" : dataObj.applicantUserPhone);
							//借款事由
							$("#loanAppName").text(dataObj.loanAppName);
							//借款金额
							$("#lonMon").text($yt_baseElement.fmMoney(dataObj.loanAmount));
							//金额大写
							$("#moneyUpper").text(arabiaToChinese(dataObj.loanAmount + ''));
							//借款期限
							$("#loanTerm").text(dataObj.loanTerm);
							//预计还款日期
							$("#expectRepaymentTime").text(dataObj.expectRepaymentTime || '--');
							//借款方式
							var paymentMethod = "";
							if(dataObj.paymentMethod == "1"){
								paymentMethod = "现金";
							}else if(dataObj.paymentMethod == "2"){
								paymentMethod = "支票";
							}
							$("#paymentMethod").text(paymentMethod);
							//是否有未清账账单
							if(dataObj.isSettleInfo){
								$("#noCloseOut").text(dataObj.isSettleInfo.noCloseOut);
								$("#loanAppNumStr").text(dataObj.isSettleInfo.loanAppNumStr|| '--');
							}
							/**
							 * 
							 * 还款记录信息
							 * 
							 */
							if(dataObj.amountRecord){
								var money = dataObj.amountRecord.loanAmount;
								var  frozenLoanAmount = dataObj.amountRecord.blockingAmount
								var usedAmount = dataObj.amountRecord.usedAmount
								var allowUseAmount =  dataObj.amountRecord.allowUseAmount
								//借款总金额
								$("#loanSumAmount").text(money == "" ? "0.00" : ($yt_baseElement.fmMoney(money)));
								//冻结金额
								$("#frozenLoanAmount").text(frozenLoanAmount == "" ? "0.00" : ($yt_baseElement.fmMoney(frozenLoanAmount)));
								//已使用借款金额
								$("#haveBeenLoanAmount").text(usedAmount == "" ? "0.00" : ($yt_baseElement.fmMoney(usedAmount)));
								//借款单可用金额
								$("#loanBillAB").text(allowUseAmount == "" ? "0.00" : ($yt_baseElement.fmMoney(allowUseAmount)));
							}
							//还款记录金额列表
							$(".paymentHistory tbody").empty();
							if(dataObj.refundList && dataObj.refundList.length>0){
								var trStr  = "";
								$.each(dataObj.refundList, function(i,n) {
									trStr = $('<tr>'
								   		  + '<td style="text-align: center !important;">'+n.refundTime+'</td>'
								   		  + '<td style="padding-right: 5px;"style="text-align: right;">'
								   		  + '<div class="moneyText">'+(n.refundAmount == "" ? "0.00" : ($yt_baseElement.fmMoney(n.refundAmount)))+'</div></td>'
								   		  + '<td style="padding-right: 5px;"><div class="moneyText">'+(n.chargeAgainst == "" ?"0.00":($yt_baseElement.fmMoney(n.chargeAgainst)))+'</div></td>'
								   		  + '<td style="padding-right: 5px;"><div class="moneyText">'+(n.cash == "" ? "0.00" : ($yt_baseElement.fmMoney(n.cash)))+'</div></td>'
								   		  + '<td style="padding-right: 5px;"><div class="moneyText">'+(n.cheque == "" ? "0.00" : ($yt_baseElement.fmMoney(n.cheque)))+'</div></td>'
								   		  + '<td style="padding-right: 5px;"><div class="moneyText">'+(n.transfer == "" ? "0.00" : ($yt_baseElement.fmMoney(n.transfer)))+'</div></td>'
								   		  + '</tr>');
								   	trStr.data("refundInfo",n);
									$(".paymentHistory tbody").append(trStr);
								});
							}else{
								$(".base-info-model.payment-history").hide();
							}
						}
						/**
						 * 
						 * 调用获取审批流程数据方法
						 * 
						 */
						sysCommon.getApproveFlowData("SZ_LOAN_APP",dataObj.processInstanceId);
					}else{
						$yt_alert_Model.prompt(data.message,2000); 
					}
				}
			});
    },
	//计算金额方法
	refundTotal:function(){
			var body = $('.amount-table');
			//现金
			var refundCash=0;
			//支票
			var refundCheck=0;
			//转账
			var refundTransfer=0;
			if(body.find('#refundCash').val()!=''){
				refundCash = parseFloat($yt_baseElement.rmoney(body.find('#refundCash').val()));
			}
			
			if(body.find('#refundCheck').val()!=''){
				refundCheck = parseFloat($yt_baseElement.rmoney(body.find('#refundCheck').val()));
			}
			
			if(body.find('#refundTransfer').val()!='' ){
				refundTransfer = parseFloat($yt_baseElement.rmoney(body.find('#refundTransfer').val()));
			}
			//计算合计金额
			var refundTotal =  refundCash + refundCheck + refundTransfer;
			//赋值合计金额
			body.find('#refundTotal').text($yt_baseElement.fmMoney(refundTotal));
	},
	/**
	 * 
	 * 借款金额操作事件
	 * 
	 */
	loanMoneyEvent:function(){
	    $("#loanMoney").on("focus",function(){
			if($(this).val()!="" && $(this).val() !=null){
				$(this).val($yt_baseElement.rmoney($(this).val()));
				$(this).select();
			}
		});
		$("#loanMoney").on("blur",function(){
			if($(this).val() !="" && $(this).val()!=null){
				var fmMoney = $yt_baseElement.fmMoney($(this).val());
				$(this).val(fmMoney);
				var lowerMoney =  arabiaToChinese($(this).val());
				$("#moneyLower").text(lowerMoney);
			}
		});
	},	
}
$(function(){
	//调用初始化方法
	loanApply.init();
});
