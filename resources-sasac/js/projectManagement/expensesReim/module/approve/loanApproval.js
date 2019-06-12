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
		//初始化日期控件
		$("#retMonDate").calendar({  
		    speed: 0, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
		    complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
		    readonly: true, // 目标对象是否设为只读，默认：true     
		    lowerLimit:"2010/01/01", // 日期下限，默认：NaN(不限制)     
		    nowData:false,//默认选中当前时间,默认true 
		    speed:0,
		    dateFmt:"yyyy-MM-dd",  
		    callback: function() { // 点击选择日期后的回调函数  
		        //alert("您选择的日期是：" + $("#txtDate").val());  
		       $("#retMonDate").parent().find(".risk-img").attr("src",loanApply.riskViaImg);
		       //清空验证提示信息
		       sysCommon.clearValidInfo($("#retMonDate"));
		    }  
		});  
		//借款金额操作事件
		loanApply.loanMoneyEvent();
		//调用功能按钮操作事件方法
		loanApply.funOperationEvent(loanApply.eaa);
		//给当前页面设置最小高度
		$("#loanApply").css("min-height",$(window).height()-32);
		//金额input计算
		loanApply.events();
		//弹出窗口
		loanApply.showReturnLoanModel();
		//调用格式化金额方法
		loanApply.fmMonList();
		//调用获取借款申请详情信息
		loanApply.getLoanInfoDetail();
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
								$("#loanAppNumStr").text(dataObj.isSettleInfo.loanAppNumStr || '--');
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
	 * 功能按钮操作事件
	 * 
	 */
	funOperationEvent:function(){
		//取消按钮事件
		$('#approveCanelBtn').on("click",function(){
			//操作成功跳转到借款审批列表页面
	    	$yt_common.parentAction({
				url:$yt_option.parent_action_path,//父级中转地址,固定配置项,只有统一修改处理。
				funName:'locationToMenu',//指定方法名，定位到菜单方法
				data:{
					url:'view/system-sasac/expensesReim/module/approval/loanApprovalList.html'//要跳转的页面路径
				}
			});
		});
		//提交按钮点击事件
		$("#approveSubBtn").off().on("click",function(){
			$(this).attr("disabled",true).addClass("btn-disabled");
			var ajaxUrl = "sz/loanApp/submitLoanAppInfo";
			//调用验证表单字段方法
			var  validFlag  = $yt_valid.validForm($("#loanApply"));
			//判断是否验证成功
			if(validFlag){
				var  loanObj = "";
				if(loanApply.loanDataObj && loanApply.loanDataObj !=""){
					 loanObj = {
					 	loanAppId:loanApply.loanId,
					 	loanAppNum:loanApply.loanDataObj.loanAppNum,
					 	loanAppName:loanApply.loanDataObj.loanAppName,
					 	loanAmount:loanApply.loanDataObj.loanAmount,
					 	loanTerm:loanApply.loanDataObj.loanTerm,
					 	paymentMethod:loanApply.loanDataObj.paymentMethod,
					 	expectRepaymentTime:loanApply.loanDataObj.expectRepaymentTime,
					 	applicantUser:loanApply.loanDataObj.applicantUser,
					 	parameters:"",
					 	dealingWithPeople:$("select.approve-users-sel").val(),
					 	opintion:$("#operateMsg").val(),
					 	processInstanceId:loanApply.loanDataObj.processInstanceId,
					 	nextCode:$("select.operate-flow-sel").val()
					 }
				} 
				//调用提交接口
				$.ajax({
					type: "post",
					url:ajaxUrl,
					async: false,
					data:loanObj,
					success: function(data) {
						if(data.flag == 0){
						   //操作成功跳转到借款审批列表页面
							window.location.href = $yt_option.websit_path + 'view/system-sasac/expensesReim/module/approval/loanApprovalList.html?state=1';
						}
						$yt_alert_Model.prompt(data.message,2000); 
						$(this).attr('disabled',false).removeClass('btn-disabled');
					}
				});
			}else{
				//调用滚动条显示在错误信息位置方法
				sysCommon.pageToScroll($("#loanApply .valid-font"));
				$(this).attr('disabled',false).removeClass('btn-disabled');
			}
		});
	},
	//	弹出框操作事件
	fromProjectModelEvent:function(){
        /** 
         * 显示编辑弹出框和显示顶部隐藏蒙层 
         */  
        $(".yt-edit-alert,#heard-nav-bak").show();  
        /** 
         * 调用算取div显示位置方法 
         */  
        $yt_alert_Model.getDivPosition($(".yt-edit-alert"));  
        /* 
         * 调用支持拖拽的方法 
         */  
        $yt_model_drag.modelDragEvent($(".yt-edit-alert .yt-edit-alert-title"));  
        /** 
         * 点击取消方法 
         */  
        $('.yt-edit-alert .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {  
            //隐藏页面中自定义的表单内容  
            $(".yt-edit-alert,#heard-nav-bak").hide();  
            //隐藏蒙层  
            $("#pop-modle-alert").hide();  
        }); 
        /** 
         * 点击确认已还款方法 
         */ 
		$("#confirmedPayment").off().on("click", function() {
			/*调用验证方法 */
			loanApply.refundTotal();
			var isTrue = $yt_valid.validForm($(".valid-tab"));
			
			var retMon=0;
			var loanBillAB=0;
			if($("#retMon").val()!=''){
				retMon=$yt_baseElement.rmoney($("#retMon").val());
			}else{
				retMon=0;
			}
			if($("#loanBillAB").text()!=''){
				loanBillAB=$yt_baseElement.rmoney($("#loanBillAB").text());
			}else{
				loanBillAB=0;
			}
			if(retMon>loanBillAB){
				isTrue=false;
			}
			if(isTrue) {
				//隐藏页面中自定义的表单内容  
				$(".yt-edit-alert,#heard-nav-bak").hide();
				//隐藏蒙层  
				$("#pop-modle-alert").hide();
				
				//获取信息操作
				/**
				 * 还款日期
				 * 还款金额（元）
				 * 现金
				 * 支票
				 * 转账
			     */
				var retMonDate=$("#retMonDate").val();
				var retMon=$("#retMon").val();
				var refundCash=$("#refundCash").val();
				var refundCheck=$("#refundCheck").val();
				var refundTransfer=$("#refundTransfer").val();
				var refundTotal=$("#refundTotal").text();
				//得到数据对象
				var dataObj = {
					loanAppId:loanApply.loanId,
					refundTime:retMonDate,
					refundAmount:retMon,
					refundWay:2,
					chargeAgainst:"",
					cash:refundCash,
					cheque:refundTransfer,
					transfer:refundTotal
				}
				
				$.ajax({
					type: "post",
					url:"sz/loanApp/saveRefund",
					async: false,
					data:dataObj,
					success: function(data) {
						if(data.flag == 0){
							if(retMonDate!=''||retMon!=''){
								$(".paymentHistory .yt-tbody").append('<tr>'
												+'<td style="text-align: center !important;"><span id="">'+retMonDate+'</span></td>'
												+'<td style="padding-right: 5px;"><div class="moneyText" style="width: 100%;text-align: right;" id="repaymentAmount">'+retMon+'</div></td>'
												+'<td style="padding-right: 5px;"><div class="moneyText" style="width: 100%;text-align: right;" id=""></div></td>'
												+'<td style="padding-right: 5px;"><div class="moneyText" style="width: 100%;text-align: right;" id="">'+refundCash+'</div></td>'
												+'<td style="padding-right: 5px;"><div class="moneyText" style="width: 100%;text-align: right;" id="">'+refundCheck+'</div></td>'
												+'<td style="padding-right: 5px;"><div class="moneyText" style="width: 100%;text-align: right;" id="">'+refundTransfer+'</div></td></tr>');
								loanApply.fmMonList();
							}
						}
						$yt_alert_Model.prompt(data.message); 
				 	}
				});
			}else{
				$yt_alert_Model.prompt("还款金额不能大于借款单可用余额");
			}
			
		});
	},
	//	显示返还剩余借款信息弹出窗口
	showReturnLoanModel:function(){
		$("#returnLoanBut").off().on("click",function(){
			//调用弹出框操作事件
			$("#retMonDate").val('');
			$("#retMon").val('');
			$("#refundCash").val('');
			$("#refundCheck").val('');
			$("#refundTransfer").val('');
			loanApply.fmMonList();
			loanApply.fromProjectModelEvent();
		});
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
				var lowerMoney =  arabiaToChinese($(this).val() + '');
				$("#moneyLower").text(lowerMoney);
			}
		});
	}
}
$(function(){
	//调用初始化方法
	loanApply.init();
});
