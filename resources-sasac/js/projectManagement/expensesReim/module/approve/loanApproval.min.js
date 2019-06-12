var loanApply = {
	riskExcMark : "../../../../../resources-sasac/images/common/war-red.png",
	riskWarImg : "../../../../../resources-sasac/images/common/risk-war.png",
	riskViaImg : "../../../../../resources-sasac/images/common/risk-via.png",
	loanId : "",
	loanDataObj : "",
	init : function() {
		sysCommon.getLoginUserInfo();
		$("#loanApply select").niceSelect();
		var requerParameter = $yt_common.GetRequest();
		loanApply.loanId = requerParameter.loanId;
		$("#retMonDate").calendar(
				{
					speed : 0,
					complement : true,
					readonly : true,
					lowerLimit : "2010/01/01",
					nowData : false,
					speed : 0,
					dateFmt : "yyyy-MM-dd",
					callback : function() {
						$("#retMonDate").parent().find(".risk-img").attr("src",
								loanApply.riskViaImg);
						sysCommon.clearValidInfo($("#retMonDate"))
					}
				});
		loanApply.loanMoneyEvent();
		loanApply.funOperationEvent(loanApply.eaa);
		$("#loanApply").css("min-height", $(window).height() - 32);
		loanApply.events();
		loanApply.showReturnLoanModel();
		loanApply.fmMonList();
		loanApply.getLoanInfoDetail()
	},
	fmMonList : function() {
		$(".refund-tab-inp").attr("placeholder", "0.00");
		var moneyInpArray = $(".refund-tab-inp");
		for (j = 0; j < moneyInpArray.length; j += 1) {
			if (moneyInpArray.eq(j).val() != '') {
				moneyInpArray.eq(j).val(
						$yt_baseElement.fmMoney(moneyInpArray.eq(j).val()))
			}
		}
		;
		var moneyTextArray = $(".moneyText");
		for (h = 0; h < moneyTextArray.length; h += 1) {
			if (moneyTextArray.eq(h).text() != '') {
				moneyTextArray.eq(h).text(
						$yt_baseElement.fmMoney(moneyTextArray.eq(h).text()))
			} else {
				moneyTextArray.eq(h).text($yt_baseElement.fmMoney(0))
			}
		}
	},
	events : function() {
		$('.refund-tab-inp').on('focus', function() {
			var ts = $(this);
			if (ts.val() != "") {
				ts.val($yt_baseElement.rmoney(ts.val()))
			}
		});
		$('.refund-tab-inp').on('blur', function() {
			var ts = $(this);
			if (ts.val() != '') {
				ts.val($yt_baseElement.fmMoney(ts.val()))
			}
		});
		$('.refund-tab-inp').on('keyup', function() {
			var ts = $(this);
			if (ts.val() != '') {
				ts.val(ts.val().replace(/[^\d.]/g, ''))
			}
		});
		$('.refund-tab-inp').blur(function() {
			loanApply.refundTotal()
		});
		$('.yt-table tbody').on('click', 'tr', function() {
			var ts = $(this);
			var trs = ts.siblings();
			trs.removeClass('yt-table-active');
			ts.addClass('yt-table-active')
		})
	},
	getLoanInfoDetail : function() {
		$
				.ajax({
					type : "post",
					url : "sz/loanApp/getLoanAppInfoDetailByLoanAppId",
					async : false,
					data : {
						loanAppId : loanApply.loanId
					},
					success : function(data) {
						if (data.flag == 0) {
							var dataObj = data.data;
							loanApply.loanDataObj = dataObj;
							if (dataObj && dataObj != ""
									&& dataObj != undefined) {
								$("#formNum").text(dataObj.loanAppNum);
								$("#applyDate").text(dataObj.applicantTime);
								$("#busiUsers").text(dataObj.applicantUserName);
								$("#deptName").text(
										dataObj.applicantUserDeptName);
								$("#jobName")
										.text(
												dataObj.applicantUserPositionName == "" ? "--"
														: dataObj.applicantUserPositionName);
								$("#telPhone").text(
										dataObj.applicantUserPhone == "" ? "--"
												: dataObj.applicantUserPhone);
								$("#loanAppName").text(dataObj.loanAppName);
								$("#lonMon").text(
										$yt_baseElement
												.fmMoney(dataObj.loanAmount));
								$("#moneyUpper")
										.text(
												arabiaToChinese(dataObj.loanAmount
														+ ''));
								$("#loanTerm").text(dataObj.loanTerm);
								$("#expectRepaymentTime").text(
										dataObj.expectRepaymentTime || '--');
								var paymentMethod = "";
								if (dataObj.paymentMethod == "1") {
									paymentMethod = "现金"
								} else if (dataObj.paymentMethod == "2") {
									paymentMethod = "支票"
								}
								$("#paymentMethod").text(paymentMethod);
								if (dataObj.isSettleInfo) {
									$("#noCloseOut").text(
											dataObj.isSettleInfo.noCloseOut);
									$("#loanAppNumStr").text(
											dataObj.isSettleInfo.loanAppNumStr
													|| '--')
								}
								if (dataObj.amountRecord) {
									var money = dataObj.amountRecord.loanAmount;
									var frozenLoanAmount = dataObj.amountRecord.blockingAmount;
									var usedAmount = dataObj.amountRecord.usedAmount;
									var allowUseAmount = dataObj.amountRecord.allowUseAmount;
									$("#loanSumAmount").text(
											money == "" ? "0.00"
													: ($yt_baseElement
															.fmMoney(money)));
									$("#frozenLoanAmount")
											.text(
													frozenLoanAmount == "" ? "0.00"
															: ($yt_baseElement
																	.fmMoney(frozenLoanAmount)));
									$("#haveBeenLoanAmount")
											.text(
													usedAmount == "" ? "0.00"
															: ($yt_baseElement
																	.fmMoney(usedAmount)));
									$("#loanBillAB")
											.text(
													allowUseAmount == "" ? "0.00"
															: ($yt_baseElement
																	.fmMoney(allowUseAmount)))
								}
								$(".paymentHistory tbody").empty();
								if (dataObj.refundList
										&& dataObj.refundList.length > 0) {
									var trStr = "";
									$
											.each(
													dataObj.refundList,
													function(i, n) {
														trStr = $('<tr><td style="text-align: center !important;">'
																+ n.refundTime
																+ '</td><td style="padding-right: 5px;"style="text-align: right;"><div class="moneyText">'
																+ (n.refundAmount == "" ? "0.00"
																		: ($yt_baseElement
																				.fmMoney(n.refundAmount)))
																+ '</div></td><td style="padding-right: 5px;"><div class="moneyText">'
																+ (n.chargeAgainst == "" ? "0.00"
																		: ($yt_baseElement
																				.fmMoney(n.chargeAgainst)))
																+ '</div></td><td style="padding-right: 5px;"><div class="moneyText">'
																+ (n.cash == "" ? "0.00"
																		: ($yt_baseElement
																				.fmMoney(n.cash)))
																+ '</div></td><td style="padding-right: 5px;"><div class="moneyText">'
																+ (n.cheque == "" ? "0.00"
																		: ($yt_baseElement
																				.fmMoney(n.cheque)))
																+ '</div></td><td style="padding-right: 5px;"><div class="moneyText">'
																+ (n.transfer == "" ? "0.00"
																		: ($yt_baseElement
																				.fmMoney(n.transfer)))
																+ '</div></td></tr>');
														trStr
																.data(
																		"refundInfo",
																		n);
														$(
																".paymentHistory tbody")
																.append(trStr)
													})
								}
							}
							sysCommon.getApproveFlowData("SZ_LOAN_APP",
									dataObj.processInstanceId)
						} else {
							$yt_alert_Model.prompt(data.message, 2000)
						}
					}
				})
	},
	refundTotal : function() {
		var body = $('.amount-table');
		var refundCash = 0;
		var refundCheck = 0;
		var refundTransfer = 0;
		if (body.find('#refundCash').val() != '') {
			refundCash = parseFloat($yt_baseElement.rmoney(body.find(
					'#refundCash').val()))
		}
		if (body.find('#refundCheck').val() != '') {
			refundCheck = parseFloat($yt_baseElement.rmoney(body.find(
					'#refundCheck').val()))
		}
		if (body.find('#refundTransfer').val() != '') {
			refundTransfer = parseFloat($yt_baseElement.rmoney(body.find(
					'#refundTransfer').val()))
		}
		var refundTotal = refundCash + refundCheck + refundTransfer;
		body.find('#refundTotal').text($yt_baseElement.fmMoney(refundTotal))
	},
	funOperationEvent : function() {
		$('#approveCanelBtn')
				.on(
						"click",
						function() {
							$yt_common
									.parentAction({
										url : $yt_option.parent_action_path,
										funName : 'locationToMenu',
										data : {
											url : 'view/system-sasac/expensesReim/module/approval/loanApprovalList.html'
										}
									})
						});
		$("#approveSubBtn")
				.off()
				.on(
						"click",
						function() {
							$(this).attr("disabled", true).addClass(
									"btn-disabled");
							var ajaxUrl = "sz/loanApp/submitLoanAppInfo";
							var validFlag = $yt_valid
									.validForm($("#loanApply"));
							if (validFlag) {
								var loanObj = "";
								if (loanApply.loanDataObj
										&& loanApply.loanDataObj != "") {
									loanObj = {
										loanAppId : loanApply.loanId,
										loanAppNum : loanApply.loanDataObj.loanAppNum,
										loanAppName : loanApply.loanDataObj.loanAppName,
										loanAmount : loanApply.loanDataObj.loanAmount,
										loanTerm : loanApply.loanDataObj.loanTerm,
										paymentMethod : loanApply.loanDataObj.paymentMethod,
										expectRepaymentTime : loanApply.loanDataObj.expectRepaymentTime,
										applicantUser : loanApply.loanDataObj.applicantUser,
										parameters : "",
										dealingWithPeople : $(
												"select.approve-users-sel")
												.val(),
										opintion : $("#operateMsg").val(),
										processInstanceId : loanApply.loanDataObj.processInstanceId,
										nextCode : $("select.operate-flow-sel")
												.val()
									}
								}
								$
										.ajax({
											type : "post",
											url : ajaxUrl,
											async : false,
											data : loanObj,
											success : function(data) {
												if (data.flag == 0) {
													window.location.href = $yt_option.websit_path
															+ 'view/system-sasac/expensesReim/module/approval/loanApprovalList.html?state=1'
												}
												$yt_alert_Model.prompt(
														data.message, 2000);
												$(this).attr('disabled', false)
														.removeClass(
																'btn-disabled')
											}
										})
							} else {
								sysCommon
										.pageToScroll($("#loanApply .valid-font"));
								$(this).attr('disabled', false).removeClass(
										'btn-disabled')
							}
						})
	},
	fromProjectModelEvent : function() {
		$(".yt-edit-alert,#heard-nav-bak").show();
		$yt_alert_Model.getDivPosition($(".yt-edit-alert"));
		$yt_model_drag.modelDragEvent($(".yt-edit-alert .yt-edit-alert-title"));
		$('.yt-edit-alert .yt-eidt-model-bottom .yt-model-canel-btn').off().on(
				"click", function() {
					$(".yt-edit-alert,#heard-nav-bak").hide();
					$("#pop-modle-alert").hide()
				});
		$("#confirmedPayment")
				.off()
				.on(
						"click",
						function() {
							loanApply.refundTotal();
							var isTrue = $yt_valid.validForm($(".valid-tab"));
							var retMon = 0;
							var loanBillAB = 0;
							if ($("#retMon").val() != '') {
								retMon = $yt_baseElement.rmoney($("#retMon")
										.val())
							} else {
								retMon = 0
							}
							if ($("#loanBillAB").text() != '') {
								loanBillAB = $yt_baseElement.rmoney($(
										"#loanBillAB").text())
							} else {
								loanBillAB = 0
							}
							if (retMon > loanBillAB) {
								isTrue = false
							}
							if (isTrue) {
								$(".yt-edit-alert,#heard-nav-bak").hide();
								$("#pop-modle-alert").hide();
								var retMonDate = $("#retMonDate").val();
								var retMon = $("#retMon").val();
								var refundCash = $("#refundCash").val();
								var refundCheck = $("#refundCheck").val();
								var refundTransfer = $("#refundTransfer").val();
								var refundTotal = $("#refundTotal").text();
								var dataObj = {
									loanAppId : loanApply.loanId,
									refundTime : retMonDate,
									refundAmount : retMon,
									refundWay : 2,
									chargeAgainst : "",
									cash : refundCash,
									cheque : refundTransfer,
									transfer : refundTotal
								};
								$
										.ajax({
											type : "post",
											url : "sz/loanApp/saveRefund",
											async : false,
											data : dataObj,
											success : function(data) {
												if (data.flag == 0) {
													if (retMonDate != ''
															|| retMon != '') {
														$(
																".paymentHistory .yt-tbody")
																.append(
																		'<tr><td style="text-align: center !important;"><span id="">'
																				+ retMonDate
																				+ '</span></td><td style="padding-right: 5px;"><div class="moneyText" style="width: 100%;text-align: right;" id="repaymentAmount">'
																				+ retMon
																				+ '</div></td><td style="padding-right: 5px;"><div class="moneyText" style="width: 100%;text-align: right;" id=""></div></td><td style="padding-right: 5px;"><div class="moneyText" style="width: 100%;text-align: right;" id="">'
																				+ refundCash
																				+ '</div></td><td style="padding-right: 5px;"><div class="moneyText" style="width: 100%;text-align: right;" id="">'
																				+ refundCheck
																				+ '</div></td><td style="padding-right: 5px;"><div class="moneyText" style="width: 100%;text-align: right;" id="">'
																				+ refundTransfer
																				+ '</div></td></tr>');
														loanApply.fmMonList()
													}
												}
												$yt_alert_Model
														.prompt(data.message)
											}
										})
							} else {
								$yt_alert_Model.prompt("还款金额不能大于借款单可用余额")
							}
						})
	},
	showReturnLoanModel : function() {
		$("#returnLoanBut").off().on("click", function() {
			$("#retMonDate").val('');
			$("#retMon").val('');
			$("#refundCash").val('');
			$("#refundCheck").val('');
			$("#refundTransfer").val('');
			loanApply.fmMonList();
			loanApply.fromProjectModelEvent()
		})
	},
	loanMoneyEvent : function() {
		$("#loanMoney").on("focus", function() {
			if ($(this).val() != "" && $(this).val() != null) {
				$(this).val($yt_baseElement.rmoney($(this).val()));
				$(this).select()
			}
		});
		$("#loanMoney").on("blur", function() {
			if ($(this).val() != "" && $(this).val() != null) {
				var fmMoney = $yt_baseElement.fmMoney($(this).val());
				$(this).val(fmMoney);
				var lowerMoney = arabiaToChinese($(this).val() + '');
				$("#moneyLower").text(lowerMoney)
			}
		})
	}
};
$(function() {
	loanApply.init()
});