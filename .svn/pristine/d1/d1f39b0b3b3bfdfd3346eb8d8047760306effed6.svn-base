var loanApply = {
	riskExcMark: "../../../../../resources-sasac/images/common/war-red.png", //风险感叹号图片
	riskWarImg: "../../../../../resources-sasac/images/common/risk-war.png", //风险未通过图片红灯
	riskViaImg: "../../../../../resources-sasac/images/common/risk-via.png", //风险通过图片绿灯
	loanId: "", //全局的借款Id
	loanDataObj: "", //全局的借款数据存储
	init: function() {
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
		$("#loanApply").css("min-height", $(window).height() - 32);
		//金额input计算
		loanApply.events();
		//调用格式化金额方法
		loanApply.fmMonList();
		//调用获取借款申请详情信息
		loanApply.getLoanInfoDetail();
		//判断流程状态是否是退回的
		if(sysCommon.processState[0].operationState == '待申请人再次提交') {
			//将编辑按钮显示
			$("#loanEdit").show();
			//隐藏关闭按钮
			$("#closeBtn").hide();
		}
	},
	//金额格式化
	fmMoney: function(str) {
		return $yt_baseElement.fmMoney(str || '0');
	},
	rmoney: function(str) {
		return $yt_baseElement.rmoney(str || '0');
	},
	//格式化金额方法
	fmMonList: function() {
		$(".refund-tab-inp").attr("placeholder", "0.00");
		var moneyInpArray = $(".refund-tab-inp");
		for(j = 0; j < moneyInpArray.length; j++) {
			if(moneyInpArray.eq(j).val() != '') {
				moneyInpArray.eq(j).val($yt_baseElement.fmMoney(moneyInpArray.eq(j).val()));
			}
		};
		var moneyTextArray = $(".moneyText");
		for(h = 0; h < moneyTextArray.length; h++) {
			if(moneyTextArray.eq(h).text() != '') {
				moneyTextArray.eq(h).text($yt_baseElement.fmMoney(moneyTextArray.eq(h).text()));
			} else {
				moneyTextArray.eq(h).text($yt_baseElement.fmMoney(0));
			}
		}
	},
	/**
	 * 事件处理
	 */
	events: function() {
		//调用父级关闭当前窗体方法
		$("#closeBtn").click(function() {
			if(window.top == window.self) { //不存在父页面
				window.close();
			} else {
				parent.closeWindow();
			}
		});
		//编辑页面跳转
		$("#loanEdit").on("click", function() {
			//即将跳转页面
			var pageUrl = $yt_option.websit_path + 'view/system-sasac/expensesReim/module/loanApply/loanApply.html?loanId=' + loanApply.loanId;
			//调用公用的跳转方法
			window.location.href = pageUrl;
		});
		//编辑页面跳转
		$("#printingLoanBtn").on("click", function() {
			//即将跳转页面
			var pageUrl = "view/system-sasac/expensesReim/module/print/printLoanApply.html?loanId=" + loanApply.loanId;
			//调用公用的打开新页面方法传输参数不需要左侧菜单
			$yt_baseElement.openNewPage(2, pageUrl);
		});
		//编辑页面跳转
		$("#printingLoanDetailsBtn").on("click", function() {
			//即将跳转页面
			var pageUrl = "view/system-sasac/expensesReim/module/print/printLoanApplyDetails.html?loanId=" + loanApply.loanId;
			//调用公用的打开新页面方法传输参数不需要左侧菜单
			$yt_baseElement.openNewPage(2, pageUrl);
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

		//点击个人转账相关信息详情按钮
		$('table.payee-personal').on('click', '.to-data', function() {
			//当前所在行
			var tr = $(this).parents('tr');
			//填充数据
			$('#perPayeeName').text(tr.attr('payeename') || '--'); //收款人姓名
			//个人应收款总金额（元）
			$('#perPersonalTotal').text(tr.attr('personalTotal') || '0.00');

			//借款单
			var choiceLoan = tr.attr('choiceLoan');
			if(choiceLoan && choiceLoan != '请选择') {
				$('.personal-payment .display-loan').show();
				//借款单存在显示并赋值对应数据
				$('#perChoiceLoan').text(tr.attr('choiceLoan') || '--');
				//借款单欠款金额
				$('.per-arrears-money').text(tr.attr('arrearsmoney') || '0.00');
				//本次冲销金额
				$('.per-reverse-money').text(tr.attr('thereversemoney') || '0.00');
			} else {
				//否则隐藏数据
				$('.personal-payment .display-loan').hide();
				$('#perChoiceLoan').text('');
				//借款单欠款金额
				$('.per-arrears-money').text('0.00');
				//本次冲销金额
				$('.per-reverse-money').text('0.00');
			}
			//冲销方式
			$('#perWiteOffPersonal').text(tr.find('td').eq(2).text() || '无');
			if(tr.attr('witeOffPersonal')) {
				$('.personal-payment .display-loan').show();
			} else {
				$('.personal-payment .display-loan').hide();
			}
			//个人冲销后补领金额（元）
			$('.per-writeoff-money').text(tr.attr('personalWriteoff') || '0.00');
			//收款方式：现金（元
			$('#perCash').text(tr.attr('cash') || '0.00');
			//收款方式：公务卡（元）
			$('#perOfficialCard').text(tr.attr('officialCard') || '0.00');
			//收款方式：转账（元）
			$('#perTransferAccounts').text(tr.attr('transferAccounts') || '0.00');
			//身份证号码
			$('#perIdCarkno').text(tr.attr('idCarkno') || '--');
			//银行卡号
			$('#perPayeeBank').text(tr.attr('payeeBank') || '--');
			//收款人手中单位
			$('#perPerank').text(tr.attr('personalUnit') || '--');
			//开户银行名称
			$('#perBankName').text(tr.attr('bankName') || '--');
			//移动电话
			$('#perPhoneNum').text(tr.attr('phoneNum') || '--');
			$('#perOffOpenBank').text(tr.attr('offOpenBank') || '--'); //offOpenBank 公务卡 - 开户银行
			$('#perOffAccounts').text(tr.attr('offAccounts') || '--') //offAccounts 公务卡 - 银行卡号

			//有无合同协议
			var payeeRadio = tr.attr('payeeRadio');
			$('#payeeRadio').text(payeeRadio == 1 ? '有' : '无');
			//特殊说明
			$('#perSpecial').text(tr.attr('personalSpecial') || '无');

			$('#personalPayment').show();

			$yt_baseElement.showMongoliaLayer();
			$yt_alert_Model.getDivPosition($('#personalPayment'));
			$('#pop-modle-alert').show();
			$('#personalPayment').show();

		});
		//关闭按钮
		$('#personalPayment .model-bottom-btn .yt-cancel-btn ,#personalPayment .closed-span').on('click', function() {
			$yt_baseElement.hideMongoliaLayer();
			$('#pop-modle-alert').hide();
			$('#personalPayment').hide();
			//填充数据
			$('#perPayeeName').text('--'); //收款人姓名
			//个人应收款总金额（元）
			$('#perPersonalTotal').text('0.00');

			//借款单
			//			var choiceLoan = tr.attr('choiceLoan');
			//			if(choiceLoan) {
			//				$('.personal-payment .display-loan').show();
			//				//借款单存在显示并赋值对应数据
			//				$('#perChoiceLoan').text('--');
			//				//借款单欠款金额
			//				$('.per-arrears-money').text('0.00');
			//				//本次冲销金额
			//				$('.per-reverse-money').text('0.00');
			//			} else {
			//				//否则隐藏数据
			//				$('.personal-payment .display-loan').hide();
			//				$('#perChoiceLoan').text('--');
			//				//借款单欠款金额
			//				$('.per-arrears-money').text('0.00');
			//				//本次冲销金额
			//				$('.per-arrears-money').text('0.00');
			//			}
			//冲销方式
			$('#perWiteOffPersonal').text('--');
			//个人冲销后补领金额（元）
			$('.per-writeoff-money').text('0.00');
			//收款方式：现金（元
			$('#perCash').text('0.00');
			//收款方式：公务卡（元）
			$('#perOfficialCard').text('0.00');
			//收款方式：转账（元）
			$('#perTransferAccounts').text('0.00');
			//身份证号码
			$('#perIdCarkno').text('--');
			//收款人所在单位
			$('#perPerank').text('--');
			//银行卡号
			$('#perPayeeBank').text('--');
			//开户银行名称
			$('#perBankName').text('--');
			//移动电话
			$('#perPhoneNum').text('--');
			//有无合同协议
			$('#payeeRadio').text('--');
			//特殊说明
			$('#perSpecial').text('无');
		});
	},
	/**
	 * 
	 * 获取借款信息详情
	 * 
	 */
	getLoanInfoDetail: function() {
		$.ajax({
			type: "post",
			url: "sz/loanApp/getLoanAppInfoDetailByLoanAppId",
			async: false,
			data: {
				loanAppId: loanApply.loanId
			},
			success: function(data) {
				if(data.flag == 0) {
					var dataObj = data.data;
					loanApply.loanDataObj = dataObj;
					if(dataObj && dataObj != "" && dataObj != undefined) {
						//单据编号
						$("#formNum").text(dataObj.loanAppNum);
						//申请时间
						$("#applyDate").text(dataObj.applicantTime);
						//申请人
						$("#busiUsers").text(dataObj.applicantUserName);
						//部门
						$("#deptName").text(dataObj.applicantUserDeptName);
						//职务
						$("#jobName").text(dataObj.applicantUserPositionName == "" ? "--" : dataObj.applicantUserPositionName);
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
						if(dataObj.paymentMethod == "1") {
							paymentMethod = "现金";
						} else if(dataObj.paymentMethod == "2") {
							paymentMethod = "支票";
						}
						$("#paymentMethod").text(paymentMethod);
						//是否有未清账账单
						if(dataObj.isSettleInfo) {
							$("#noCloseOut").text(dataObj.isSettleInfo.noCloseOut);
							if(dataObj.rows.length > 0) {
								var datas = dataObj.rows;
								var htmlSpan = "";
								$.each(datas, function(i, n) {
									if(datas.length - 1 == i) {
										htmlSpan += '<a class="yt-link to-detail" loanAppId="' + n.loanAppId + '">' + n.loanAppNumStr + '</a>'
									} else {
										htmlSpan += '<a class="yt-link to-detail" loanAppId="' + n.loanAppId + '">' + n.loanAppNumStr + '</a>,'
									}
								});
								//未结清借款单号
								$("#loanAppNumStr").html(htmlSpan);
								//调用点击编号方法
								loanApply.toDetails();
							} else {
								$("#loanAppNumStr").text('--');
							}
						}
						/**
						 * 
						 * 还款记录信息
						 * 
						 */
						if(dataObj.amountRecord) {
							var money = dataObj.amountRecord.loanAmount;
							var frozenLoanAmount = dataObj.amountRecord.blockingAmount
							var usedAmount = dataObj.amountRecord.usedAmount
							var allowUseAmount = dataObj.amountRecord.allowUseAmount
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
						if(dataObj.refundList && dataObj.refundList.length > 0) {
							var trStr = "";
							$.each(dataObj.refundList, function(i, n) {
								trStr = $('<tr>' +
									'<td style="text-align: center !important;">' + n.refundTime + '</td>' +
									'<td style="padding-right: 5px;"style="text-align: right;">' +
									'<div class="moneyText">' + (n.refundAmount == "" ? "0.00" : ($yt_baseElement.fmMoney(n.refundAmount))) + '</div></td>' +
									'<td style="padding-right: 5px;"><div class="moneyText">' + (n.chargeAgainst == "" ? "0.00" : ($yt_baseElement.fmMoney(n.chargeAgainst))) + '</div></td>' +
									'<td style="padding-right: 5px;"><div class="moneyText">' + (n.cash == "" ? "0.00" : ($yt_baseElement.fmMoney(n.cash))) + '</div></td>' +
									'<td style="padding-right: 5px;"><div class="moneyText">' + (n.cheque == "" ? "0.00" : ($yt_baseElement.fmMoney(n.cheque))) + '</div></td>' +
									'<td style="padding-right: 5px;"><div class="moneyText">' + (n.transfer == "" ? "0.00" : ($yt_baseElement.fmMoney(n.transfer))) + '</div></td>' +
									'</tr>');
								trStr.data("refundInfo", n);
								$(".paymentHistory tbody").append(trStr);
							});
						} else {
							$(".base-info-model.payment-history").hide();
						}
						//收款方显示
						loanApply.showCostDetail(dataObj);
						//调用获取流程日志方法
						var flowLogHtml = sysCommon.getCommentByProcessInstanceId(dataObj.processInstanceId);
						$(".flow-log-div").html(flowLogHtml);
					}
					/**
					 * 
					 * 调用获取审批流程数据方法
					 * 
					 */
					sysCommon.getApproveFlowData("SZ_LOAN_APP", dataObj.processInstanceId);
				} else {
					$yt_alert_Model.prompt(data.message, 2000);
				}
			}
		});
	},
	//计算金额方法
	refundTotal: function() {
		var body = $('.amount-table');
		//现金
		var refundCash = 0;
		//支票
		var refundCheck = 0;
		//转账
		var refundTransfer = 0;
		if(body.find('#refundCash').val() != '') {
			refundCash = parseFloat($yt_baseElement.rmoney(body.find('#refundCash').val()));
		}

		if(body.find('#refundCheck').val() != '') {
			refundCheck = parseFloat($yt_baseElement.rmoney(body.find('#refundCheck').val()));
		}

		if(body.find('#refundTransfer').val() != '') {
			refundTransfer = parseFloat($yt_baseElement.rmoney(body.find('#refundTransfer').val()));
		}
		//计算合计金额
		var refundTotal = refundCash + refundCheck + refundTransfer;
		//赋值合计金额
		body.find('#refundTotal').text($yt_baseElement.fmMoney(refundTotal));
	},
	/**
	 * 
	 * 借款金额操作事件
	 * 
	 */
	loanMoneyEvent: function() {
		$("#loanMoney").on("focus", function() {
			if($(this).val() != "" && $(this).val() != null) {
				$(this).val($yt_baseElement.rmoney($(this).val()));
				$(this).select();
			}
		});
		$("#loanMoney").on("blur", function() {
			if($(this).val() != "" && $(this).val() != null) {
				var fmMoney = $yt_baseElement.fmMoney($(this).val());
				$(this).val(fmMoney);
				var lowerMoney = arabiaToChinese($(this).val());
				$("#moneyLower").text(lowerMoney);
			}
		});
	},
	showCostDetail: function(data) {
		var me = this;
		//转换金额格式的方法
		var fMoney = $yt_baseElement.fmMoney;
		//付款信息区域
		var payReceivablesData = data.payReceivablesData;
		//单位-收款方集合
		var gatheringUnitList = payReceivablesData.gatheringUnitList;
		var otherPayeeHtml = "";
		var otherPayeeTotale = 0;
		$.each(gatheringUnitList, function(i, n) {
			otherPayeeHtml += '<tr>' +
				'<td>' + n.unitName + '</td>' +
				'<td style="text-align:right;">' + $yt_baseElement.fmMoney(n.amount) + '</td>' +
				'<td >' + n.openBank + '</td>' +
				'<td >' + n.accounts + '</td>' +
				'<td >' + (n.isContract == 1 ? '是' : '否') + '</td>' +
				'<td >' + (n.isSettlement == 1 ? '汇款' : '支票') + '</td>' +
				'<td >' + (n.remarks || "无") + '</td>' +
				'</tr>';
			otherPayeeTotale += +n.amount;
		});
		$(".payee-unit .yt-tbody .payee-unit-total").before(otherPayeeHtml);
		$(".payee-unit .payee-unit-total .payee-unit-money").text($yt_baseElement.fmMoney(otherPayeeTotale));
		if(gatheringUnitList.length == 0) {
			$(".payee-unit-model").hide();
		}
		//个人-收款方集合
		var gatheringPersonList = payReceivablesData.gatheringPersonList;
		var gatheringPersonHtml = "";
		var gatheringPersonTotale = 0;
		$.each(gatheringPersonList, function(i, n) {
			gatheringPersonHtml += '<tr class="payee-personal-tr" pkid="" personalUnit="' + n.personalUnit + '" payeeval="' + n.personalCode + '" payeename="' + n.personalName + '" pedepartment="' + n.personalDept + '" perank="' + n.personalJobLevelName + '" personaltotal="' + n.amount + '" witeoffpersonal="' + n.reverseTheWay + '" personalwriteoff="' + n.replaceAmount + '" cash="' + n.cash + '" officialcard="' + n.officialCard + '" transferaccounts="' + n.transfer + '" payeeradio="' + n.isContract + '" personalspecial="' + n.remarks + '" idcarkno="' + n.idCard + '" payeebank="' + n.accounts + '" bankname="' + n.openBank + '" phonenum="' + n.phoneNum + '" choiceloan="' + n.loanAppNum + '" choiceloanval="' + n.loanAppId + '" arrearsmoney="' + n.loanAppArrearsAmount + '" thereversemoney="' + n.writeOffAmount + '" offOpenBank="' + n.offOpenBank + '" offAccounts="' + n.offAccounts + '"><td class="per" value="personal">' + n.personalName + '</td><td style="text-align: right;" class="personalTotal">' + loanApply.fmMoney(n.amount) + '</td><td style="text-align: right;">' + (loanApply.fmMoney(n.cash)) + '</td><td style="text-align: right;">' + (loanApply.fmMoney(n.officialCard)) + '</td><td style="text-align: right;">' + (loanApply.fmMoney(n.transfer)) + '</td><td><a class="yt-link to-data">详情</a></td><td>' + (n.isContract == 1 ? '有' : '无') + '</td><td>' + (n.remarks || '无') + '</td></tr>';
			gatheringPersonTotale += +n.amount;
		});
		$(".payee-personal .yt-tbody .payee-personal-total").before(gatheringPersonHtml);
		$(".payee-personal .payee-personal-total .payee-personal-money").text($yt_baseElement.fmMoney(gatheringPersonTotale));
		if(gatheringPersonList.length == 0) {
			$(".payee-personal-model").hide();
		}
		//其他-收款方集合
		var gatheringOtherList = payReceivablesData.gatheringOtherList;
		var gatheringOtherHtml = "";
		var gatheringOtherTotale = 0;
		$.each(gatheringOtherList, function(i, n) {
			gatheringOtherHtml += '<tr>' +
				'<td>' + n.otherName + '</td>' + //其他付款
				'<td style="text-align:right;">' + $yt_baseElement.fmMoney(n.amount) + '</td>' + //金额（元）
				'<td >' + (n.isContract == 1 ? '是' : '否') + '</td>' + //有无合同协议	
				'<td>' + (n.remarks || "无") + '</td>' + //特殊说明
				'</tr>';
			gatheringOtherTotale += +n.amount;
		});
		$(".payee-other .yt-tbody .payee-other-total").before(gatheringOtherHtml);
		$(".payee-other .payee-other-total .payee-other-total-money").text($yt_baseElement.fmMoney(gatheringOtherTotale));
		if(gatheringOtherList.length == 0) {
			$(".payee-other-model").hide();
		}
		if(gatheringOtherList.length == 0 && gatheringPersonList.length == 0 && gatheringUnitList.length == 0) {
			$(".payee-info-isshow").html('<table style="width:100%"><tr style="border:0px;background-color:#fff !important;"><td align="center"style="border:0px;"><div class="no-data" style="width: 280px;padding:0;margin: 0 auto;">' +
				'<img src="../../../../../resources-sasac/images/common/no-data.png" alt="" style="padding:10px 0;">' +
				'</div></td></tr></table>');
		}
	},
	/*点击编号  查看详情*/
	toDetails: function() {
		$('.to-detail').off("click").on('click', function() {
			/*调用阻止冒泡方法*/
			$yt_baseElement.eventStopPageaction();
			/*获取id*/
			//var processInstanceId = $(this).parents('tr').find('.processInstanceId').val();
			var loanAppId = $(this).attr("loanAppId");
			/*页面跳转打开新页面*/
			var pageUrl = "view/system-sasac/expensesReim/module/loanApply/loanApplyDetail.html?loanId=" + loanAppId; //即将跳转的页面路径
			//window.open($yt_option.websit_path + "index.html?pageUrl=" + encodeURIComponent(pageUrl) + '&goPageUrl=' + goPageUrl);
			//调用公用的打开新页面方法传输参数不需要左侧菜单
			$yt_baseElement.openNewPage(2, pageUrl);
		})
	},
}
$(function() {
	//调用初始化方法
	loanApply.init();
});