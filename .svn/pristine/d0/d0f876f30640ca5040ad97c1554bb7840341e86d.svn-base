var loanApply = {
	riskExcMark: "../../../../../resources-sasac/images/common/war-red.png", //风险感叹号图片
	riskWarImg: "../../../../../resources-sasac/images/common/risk-war.png", //风险未通过图片红灯
	riskViaImg: "../../../../../resources-sasac/images/common/risk-via.png", //风险通过图片绿灯
	loanId: "", //全局的借款Id
	loanDataObj: "", //全局的借款数据存储
	init: function() {
		$('#flowApproveDiv').html(sysCommon.createFlowApproveMode());
		//获取页面跳转传输的参数对象
		var requerParameter = $yt_common.GetRequest();
		// 获取传输的项目ID
		loanApply.loanId = requerParameter.loanId;
		//借款金额操作事件
		loanApply.loanMoneyEvent();
		//调用功能按钮操作事件方法
		loanApply.funOperationEvent(loanApply.eaa);
		//给当前页面设置最小高度
		$("#loanApply").css("min-height", $(window).height() - 32);
		//金额input计算
		loanApply.events();
		//弹出窗口
		loanApply.showReturnLoanModel();
		//调用格式化金额方法
		loanApply.fmMonList();
		//调用获取借款申请详情信息
		loanApply.getLoanInfoDetail();
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
		//点击打印借款单
		$("#printingLoanBtn").click(function() {
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
			//收款人所在单位
			$('#perPerank').text(tr.attr('personalUnit') || '--');
			//银行卡号
			$('#perPayeeBank').text(tr.attr('payeeBank') || '--');
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
		$('#personalPayment .model-bottom-btn .yt-cancel-btn').on('click', function() {
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
		//关闭按钮
		$('#personalPayment .closed-span').on('click', function() {
			$yt_baseElement.hideMongoliaLayer();
			$('#pop-modle-alert').hide();
			$('#personalPayment').hide();
			//填充数据
			$('#perPayeeName').text('--'); //收款人姓名
			//个人应收款总金额（元）
			$('#perPersonalTotal').text('0.00');

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
							if(data.data.rows.length > 0) {
								var datas = data.data.rows;
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
						}
						//收款方显示
						loanApply.showCostDetail(dataObj);
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
	 * 功能按钮操作事件
	 * 
	 */
	funOperationEvent: function() {
		//取消按钮事件
		$('#approveCanelBtn').on("click", function() {
			//操作成功跳转到借款审批列表页面
			$yt_common.parentAction({
				url: $yt_option.parent_action_path, //父级中转地址,固定配置项,只有统一修改处理。
				funName: 'locationToMenu', //指定方法名，定位到菜单方法
				data: {
					url: 'view/system-sasac/expensesReim/module/approval/loanApprovalList.html' //要跳转的页面路径
				}
			});
		});
		//提交按钮点击事件
		$("#approveSubBtn").off().on("click", function() {
			$(this).attr("disabled", true).addClass("btn-disabled");
			var ajaxUrl = "sz/loanApp/submitLoanAppInfo";
			//调用验证表单字段方法
			var validFlag = $yt_valid.validForm($("#flowApproveDiv"));
			//判断是否验证成功
			if(validFlag) {
				var loanObj = "";
				if(loanApply.loanDataObj && loanApply.loanDataObj != "") {
					loanObj = {
						loanAppId: loanApply.loanId,
						loanAppNum: loanApply.loanDataObj.loanAppNum,
						loanAppName: loanApply.loanDataObj.loanAppName,
						loanAmount: loanApply.loanDataObj.loanAmount,
						loanTerm: loanApply.loanDataObj.loanTerm,
						paymentMethod: loanApply.loanDataObj.paymentMethod,
						expectRepaymentTime: loanApply.loanDataObj.expectRepaymentTime,
						applicantUser: loanApply.loanDataObj.applicantUser,
						parameters: "",
						dealingWithPeople: $("select#approve-users").val(), //下一步操作人
						opintion: $("#opintion").val(),
						processInstanceId: loanApply.loanDataObj.processInstanceId,
						nextCode: $("#operate-flow").val()
					}
				}
				//调用提交接口
				$.ajax({
					type: "post",
					url: ajaxUrl,
					async: false,
					data: loanObj,
					success: function(data) {
						if(data.flag == 0) {

							$yt_common.parentAction({
								url: $yt_option.parent_action_path, //父级中转地址,固定配置项,只有统一修改处理。
								funName: 'locationToMenu', //指定方法名，定位到菜单方法
								data: {
									url: 'view/system-sasac/expensesReim/module/approval/loanApprovalList.html' //要跳转的页面路径
								}
							});
							//操作成功跳转到借款审批列表页面
							//							window.location.href = $yt_option.websit_path + 'view/system-sasac/expensesReim/module/approval/loanApprovalList.html?state=1';
						}
						$yt_alert_Model.prompt(data.message, 2000);
						$(this).attr('disabled', false).removeClass('btn-disabled');
					}
				});
			} else {
				//调用滚动条显示在错误信息位置方法
				sysCommon.pageToScroll($("#loanApply .valid-font"));
				$(this).attr('disabled', false).removeClass('btn-disabled');
			}
		});
	},
	//	弹出框操作事件
	fromProjectModelEvent: function() {
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

			var retMon = 0;
			var loanBillAB = 0;
			if($("#retMon").val() != '') {
				retMon = $yt_baseElement.rmoney($("#retMon").val());
			} else {
				retMon = 0;
			}
			if($("#loanBillAB").text() != '') {
				loanBillAB = $yt_baseElement.rmoney($("#loanBillAB").text());
			} else {
				loanBillAB = 0;
			}
			if(retMon > loanBillAB) {
				isTrue = false;
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
				var retMonDate = $("#retMonDate").val();
				var retMon = $("#retMon").val();
				var refundCash = $("#refundCash").val();
				var refundCheck = $("#refundCheck").val();
				var refundTransfer = $("#refundTransfer").val();
				var refundTotal = $("#refundTotal").text();
				//得到数据对象
				var dataObj = {
					loanAppId: loanApply.loanId,
					refundTime: retMonDate,
					refundAmount: retMon,
					refundWay: 2,
					chargeAgainst: "",
					cash: refundCash,
					cheque: refundTransfer,
					transfer: refundTotal
				}

				$.ajax({
					type: "post",
					url: "sz/loanApp/saveRefund",
					async: false,
					data: dataObj,
					success: function(data) {
						if(data.flag == 0) {
							if(retMonDate != '' || retMon != '') {
								$(".paymentHistory .yt-tbody").append('<tr>' +
									'<td style="text-align: center !important;"><span id="">' + retMonDate + '</span></td>' +
									'<td style="padding-right: 5px;"><div class="moneyText" style="width: 100%;text-align: right;" id="repaymentAmount">' + retMon + '</div></td>' +
									'<td style="padding-right: 5px;"><div class="moneyText" style="width: 100%;text-align: right;" id=""></div></td>' +
									'<td style="padding-right: 5px;"><div class="moneyText" style="width: 100%;text-align: right;" id="">' + refundCash + '</div></td>' +
									'<td style="padding-right: 5px;"><div class="moneyText" style="width: 100%;text-align: right;" id="">' + refundCheck + '</div></td>' +
									'<td style="padding-right: 5px;"><div class="moneyText" style="width: 100%;text-align: right;" id="">' + refundTransfer + '</div></td></tr>');
								loanApply.fmMonList();
							}
						}
						$yt_alert_Model.prompt(data.message);
					}
				});
			} else {
				$yt_alert_Model.prompt("还款金额不能大于借款单可用余额");
			}

		});
	},
	//	显示返还剩余借款信息弹出窗口
	showReturnLoanModel: function() {
		$("#returnLoanBut").off().on("click", function() {
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
				var lowerMoney = arabiaToChinese($(this).val() + '');
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