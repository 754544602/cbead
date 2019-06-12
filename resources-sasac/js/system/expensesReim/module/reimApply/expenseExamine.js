(function($, window) {
	var serveExamine = {
		/**
		 * 开始执行
		 */
		appId: '', //支出申请id
		costType: '', //费用类型
		processInstanceId: '', //全局processInstanceId
		unitActual: 0,
		parActual: 0,
		otherActual: 0,
		payDetail: '',
		parCode: '',
		init: function() {
			var ts = this;
			$('#approveDiv').html(sysCommon.createFlowApproveMode());
			var advanceAppId = $yt_common.GetQueryString('appId');
			var fun = $yt_common.GetQueryString('fun');
			serveExamine.appId = advanceAppId;
			serveExamine.getReimAppInfoDetailByReimAppId(advanceAppId);
			ts.start();
			ts.events();

		},
		/**
		 * 初始化组件
		 */
		start: function() {
			$('select').niceSelect();
			/*$('#paymentDate').calendar({
				speed: 0,
				nowData: false
			});*/
			$('#payDate').calendar({
				speed: 0,
				nowData: false
			});
		},
		/**
		 * 事件处理
		 */
		events: function() {
			var me = this;
			//判断预算项目显示隐藏
			if($("#costTypeName").text() != "差旅费") {
				$("#budgetPprojectDetailsTd").hide();
			} else if($("#specialName").text().split("-")[0] == "基本支出") {
				$("#budgetPprojectDetailsTd").hide();
			} else {
				$("#budgetPprojectDetailsTd").show();
			}
			if($("#costTypeName").text() == "培训费") {
				$("#budgetPprojectDetailsTd").hide();
				$("#budgetPprojectDetailsTd").prev("td").show();
				$("#budgetPprojectDetailsTd").prev("td").find("label").text("预算项目：");
				$(".advance-relevance label").text("预算项目可用余额：");
			}

			//付款相关附件
			/*$('.cont-file').on('change', function() {
				var ithis = $(this);
				var val = ithis.val();
				var parent = ithis.parents('.file-up-div');
				parent.find('.file-msg').text(val).css('color', '#333');
				parent.next('.file-box').append('<div class="li-div"><span>' + val + '</span><span class="del-file">x</span></div>');
			});*/
			$('.file-box').on('click', '.del-file', function() {
				var ithis = $(this);
				var parent = ithis.parent();
				$yt_alert_Model.alertOne({
					alertMsg: "数据删除将无法恢复,确认删除吗?",
					confirmFunction: function() {
						parent.remove();
					},
				});
			});
			//点击事前申请单编号,跳转到事前申请详情页面
			$('#advanceAppNum').click(function() {
				//跳转页面路径
				var pageUrl = "";
				if($("#costTypeName").text() == "培训费") {
					pageUrl = "view/projectManagement-sasac/expensesReim/module/beforehand/beforeApplyDetail.html?advanceId=" + $("#advanceAppNumHiddenInput").val();
				} else {
					pageUrl = "view/system-sasac/expensesReim/module/beforehand/beforeApplyDetail.html?advanceId=" + $("#advanceAppNumHiddenInput").val();
				}
				//调用公用的打开新页面方法传输参数不需要左侧菜单
				$yt_baseElement.openNewPage(2, pageUrl);
			});
			//点击预算项目单号,跳转到事前申请详情页面
			$('.budget-project').click(function() {
				//跳转页面路径
				var pageUrl = "view/projectManagement-sasac/expensesReim/module/beforehand/beforeApplyDetail.html?advanceId=" + $("#hiddenBudgetProject").val();
				//调用公用的打开新页面方法传输参数不需要左侧菜单
				$yt_baseElement.openNewPage(2, pageUrl);
			});
			//金额文本框获取焦点事件 
			$('.money-input').on('focus', function() {
				var ts = $(this);
				if(ts.val() != "") {
					//调用还原格式化的方法  
					ts.val($yt_baseElement.rmoney(ts.val()));
				}
			});
			//金额文本框失去焦点事件 
			$('.money-input').on('blur', function() {
				var ts = $(this);
				if(ts.val() != '') {
					//调用格式化金额方法  
					ts.val($yt_baseElement.fmMoney(ts.val()));
				}
			});
			//金额文本框输入事件 
			$('.money-input').on('keyup', function() {
				var ts = $(this);
				if(ts.val() != '') {
					//调用格式化金额方法  
					ts.val(ts.val().replace(/[^\d.]/g, ''));
				}
			});

			//打印单据粘贴单
			$('#printBills').on('click', function() {
				//单据类型
				var type = /*me.saveData.costType*/ '';
				//单据编号
				//var advanceAppNum = me.saveData.advanceAppNum;
				var urlStr = '';
				//判断单据类型
				if(type == 'TRAVEL_APPLY') {
					//差旅费
					urlStr = $yt_option.websit_path + 'view/system-sasac/expensesReim/module/print/printTravelExpenses.html';
				} else {
					//支出表单
					urlStr = $yt_option.websit_path + 'view/system-sasac/expensesReim/module/print/printSpendingForm.html';
				}
				var pageUrl = urlStr; //即将跳转的页面路径
				var goPageUrl = "view/system-sasac/expensesReim/module/approval/expenApplApprList.html"; //左侧菜单指定选中的页面路径
				window.open($yt_option.websit_path + "index.html?pageUrl=" + encodeURIComponent(pageUrl) + '&goPageUrl=' + goPageUrl);
			});

			//支付明细每行数据的合计计算
			$('.pay-detail-tabel').on('blur', '.money-input', function() {
				var ts = $(this);
				if(ts.val() != '') {
					//调用格式化金额方法  
					ts.val($yt_baseElement.fmMoney(ts.val()));
				}
				//当前对象所在行
				var tr = $(this).parents('tr');
				//现金
				var cash = me.rmoney(tr.find('.cash').val());
				//公务卡
				var offica = me.rmoney(tr.find('.offica').val());
				//转账
				var trans = me.rmoney(tr.find('.trans').val());
				//计算行合计
				tr.find('.row-total').text(me.fmMoney(cash + offica + trans));
				//计算列表总合计
				me.countDetailTotal();
			});

			//补领/返还方式 合计金额
			/*$('.amount-table .money-input').blur(function() {
				var body = $('.payment-detail .amount-table');
				//公务卡
				var official = Number($yt_baseElement.rmoney(body.find('.official').val() || '0'));
				//现金
				var cash = Number($yt_baseElement.rmoney(body.find('.cash').val() || '0'));
				//支票
				var cheque = Number($yt_baseElement.rmoney(body.find('.cheque').val() || '0'));
				//转账
				var transfer = Number($yt_baseElement.rmoney(body.find('.transfer').val() || '0'));
				//计算合计金额
				var total = official + cash + cheque + transfer;
				//赋值合计金额
				body.find('.total').text($yt_baseElement.fmMoney(total));

				//支付明细显示时判断支付明细的数据
				if($('.payroll-working').is(':visible')) {
					body = $('.payroll-working .amount-table');
					//支付公务卡
					var cmOfficialCard = $yt_baseElement.rmoney($('#cmOfficialCard').val() || '0');
					//支付现金
					var cmCash = $yt_baseElement.rmoney($('#cmCash').val() || '0');
					//支付支票
					var cmCheque = $yt_baseElement.rmoney($('#cmCheque').val() || '0');
					//支付明细合计补领金额
					var cmTotal = cmOfficialCard + cmCash + cmCheque;
					//补领金额大于0 的时候，补领方式合计金额不能超过补领金额。
					var replaceMoney = $yt_baseElement.rmoney($('#cmReplaceMoney').text() || '0');
					if(replaceMoney > 0 && total > replaceMoney) {
						$(this).focus();
						$yt_alert_Model.prompt('金额不能大于补领金额金额');
					} else {
						//格式转换
						var rtotal = me.fmMoney(cmTotal);
						//赋值合计金额
						body.find('.total').text(rtotal).attr('num', cmTotal);
					}
				}
			});*/

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
				//收款人所在单位
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
				$('#perSpecial').text(tr.attr('personalSpecial'));

				$('#personalPayment').show();

				$yt_baseElement.showMongoliaLayer();
				$yt_alert_Model.getDivPosition($('#personalPayment'));
				$('#pop-modle-alert').show();
				$('#personalPayment').show();

			});
			$('#personalPayment .model-bottom-btn .yt-cancel-btn,#personalPayment .closed-span').on('click', function() {
				$yt_baseElement.hideMongoliaLayer();
				$('#pop-modle-alert').hide();
				$('#personalPayment').hide();
				//填充数据
				$('#perPayeeName').text('--'); //收款人姓名
				//个人应收款总金额（元）
				$('#perPersonalTotal').text('0.00');

				//否则隐藏数据
				$('.personal-payment .display-loan').hide();
				$('#perChoiceLoan').text('--');
				//借款单欠款金额
				$('.per-arrears-money').text('0.00');
				//本次冲销金额
				$('.per-arrears-money').text('0.00');
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
				//
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
				$('#perSpecial').text('--');
			});

			//提交
			$('#submitPayment').on('click', function() {
				var thisBtn = $(this);
				thisBtn.attr('disabled', true).addClass('btn-disabled');
				//单据类型
				var type = /*me.saveData.costType*/ '';
				//单据编号
				if($yt_valid.validForm($('.approve-div'))) {
					//支付明细与付款金额验证
					var verifyPayDateilDiff = serveExamine.verifyPayDateilDiff();
					if(verifyPayDateilDiff) {
						//获取提交数据
						var d = serveExamine.getSaveData();
						//var actualTotal = (parseFloat(serveExamine.unitActual)+parseFloat(serveExamine.parActual)+parseFloat(serveExamine.otherActual));
						//浮点精度出现偏差，格式化后去除格式化处理
						var actualTotal =  $yt_baseElement.fmMoney(serveExamine.unitActual+serveExamine.parActual+serveExamine.otherActual);
						actualTotal = $yt_baseElement.rmoney(actualTotal);
						if(d.taskKey == 'activitiEndTask') {
							var payDetail = $('.pay-detail-tabel .total-money').text();
							if ($yt_baseElement.rmoney(payDetail) == actualTotal) {
								serveExamine.saveLotPayDetailInfo(d, thisBtn);
							} else{
								$yt_alert_Model.prompt('财务支付金额与实际收款总金额不符');
								thisBtn.attr('disabled', false).removeClass('btn-disabled');
							}
						} else {
							serveExamine.saveLotPayDetailInfo(d, thisBtn);
						}
					} else {
						thisBtn.attr('disabled', false).removeClass('btn-disabled');
					}
				} else {
					thisBtn.attr('disabled', false).removeClass('btn-disabled');
				}
			});

			//打印支出凭单
			$("#printExpend").on("click", function() {
				var pageUrl = "view/system-sasac/expensesReim/module/print/expenditureVoucher.html?expenditureAppId=" + serveExamine.appId;

				//调用公用的打开新页面方法传输参数不需要左侧菜单
				$yt_baseElement.openNewPage(2, pageUrl);
			});
			//打印支出凭单明细
			$("#printExpendDetail").on("click", function() {
				var pageUrl = "view/system-sasac/expensesReim/module/print/expenditureVoucherDetailed.html?expenditureAppId=" + serveExamine.appId + "&costType=" + serveExamine.costType;
				//调用公用的打开新页面方法传输参数不需要左侧菜单
				$yt_baseElement.openNewPage(2, pageUrl);
			});
			//填写对象信息相关事件
			me.tallyListEvent();
			//调用表格行点击事件改变背景色方法
			$('.yt-table tbody').on('click', 'tr', function() {
				//当前对象
				var ts = $(this);
				//所有同级元素
				var trs = ts.siblings();
				//移除样式
				trs.removeClass('yt-table-active');
				//点击行追加样式
				ts.addClass('yt-table-active');
			});

			//财务支付明细新增
			me.financialPayment();
			//财务支付的收款方切换
			me.selectCheck();
			//跳转详情页面
			$('.payee-unit,.payee-other,.payee-personal').on('click', '.to-detail', function(){
				var loanAppId = $(this).parents('tr').attr('loanAppId');
				var pageUrl = "view/system-sasac/expensesReim/module/loanApply/loanApplyDetail.html?loanId="+ loanAppId;//即将跳转的页面路径
	
				//调用公用的打开新页面方法传输参数不需要左侧菜单
				$yt_baseElement.openNewPage(2,pageUrl);
			});
		},
		/**
		 * 验证财务支付明细和收款方列表数据
		 */
		verifyPayDateilDiff: function() {
			//获取支付明细列表中的数据
			var trs = $('.pay-detail-tabel .pay-row');
			var verify = true;
			if(trs.length > 0) {
				trs.each(function(i, n) {
					n = $(n);
					//支付明细id
					var pkId = n.attr('pkId');
					//支付明细类型
					var ctype = n.attr('ctype');
					//支付明细合计金额
					var count = serveExamine.rmoney(n.find('.row-total').text());
					//获取对应付款列表中的金额
					var money = 0;
					if(ctype == 'GATHERING_UNIT') {
						//单位
						money = serveExamine.rmoney($('table.payee-unit td[pid="' + pkId + '"]').parent().find('.unitTotal').text());
					} else if(ctype == 'GATHERING_PERSON') {
						//个人
						money = serveExamine.rmoney($('table.payee-personal td[pid="' + pkId + '"]').parent().find('.personalTotal').text());
						//个人需要减去冲销借款金额
						money = money - (serveExamine.rmoney($('table.payee-personal td[pid="' + pkId + '"]').parent().find('td').eq(3).text()));
					} else if(ctype == 'GATHERING_OTHER') {
						//其他
						money = serveExamine.rmoney($('table.payee-other td[pid="' + pkId + '"]').parent().find('.unitTotal').text());
					}
					//每个收款方的合计金额必须等于该收款方在收款方信息中的金额（收款方为个人时对比“个人冲销后补领金额”数据）校验失败时，定位到财务支付明细区域，显示提示信息“支付金额与申请金额不符”，且不能提交
					/*if(count != money) {
						$yt_alert_Model.prompt('支付金额与申请金额不符');
						verify = false;
						return false;
					}*/
				});

			}
			return verify;
		},

		/**
		 * 最后一步流程提交按钮的操作
		 */
		workEndSubmitEvent: function() {
			var me = this;
			//提交
			$('#submitPayment').off().on('click', function() {
				var thisBtn = $(this);
				thisBtn.attr('disabled', true).addClass('btn-disabled');
				//单据类型
				var type = /*me.saveData.costType*/ '';
				//单据编号
				if($yt_valid.validForm($('.approve-div'))) {
					//支付明细与付款金额验证
					var verifyPayDateilDiff = serveExamine.verifyPayDateilDiff();
					if(verifyPayDateilDiff) {
						//获取提交数据
						var d = serveExamine.getSaveData();
						serveExamine.saveLotPayDetailInfo(d, thisBtn);
					} else {
						thisBtn.attr('disabled', false).removeClass('btn-disabled');
					}
				} else {
					thisBtn.attr('disabled', false).removeClass('btn-disabled');
				}
			});

		},

		/**
		 * 日期格式转换
		 * @param {Object} str
		 */
		fmMoney: function(str) {
			return $yt_baseElement.fmMoney(str || '0');
		},
		/**
		 * 日期格式还原
		 * @param {Object} str
		 */
		rmoney: function(str) {
			return $yt_baseElement.rmoney(str || '0');
		},
		/**
		 * 费用明细列表相关事件
		 */
		paymentListEvent: function() {
			var me = this;

			//新增明细
			$('#addProcuList').on('click', function() {
				me.showPaymentAlert();
			});

			//添加到付款明細列表
			/*$("#paymentAddBtn").on('click', function() {
				//所属预算项目
				var budgetProject = $('#budgetProject option:selected').text();
				//金额
				var budgetMoney = $('#budgetMoney').val();
				//专项项目编号
				var specialNum = $('#specialNum').text();

				var html = '<tr> <td>' + budgetProject + '</td> <td style="text-align: right;">' + budgetMoney + '</td> <td>' + specialNum + '</td> <td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td> </tr>';

				$('#paymentList tbody').append(html);

				me.hidePaymentAlert();
			});*/

			//删除
			$('#paymentList').on('click', '.operate-del', function() {
				var ithis = $(this);
				var tr = ithis.parents('tr');
				$yt_alert_Model.alertOne({
					alertMsg: "数据删除将无法恢复,确认删除吗?", //提示信息  
					confirmFunction: function() { //点击确定按钮执行方法  
						tr.remove();
					}
				});
			});

			//编辑
			$('#paymentList').on('click', '.operate-update', function() {
				var ithis = $(this);
				var tr = ithis.parents('tr');
				//显示弹框
				me.showPaymentAlert();

			});
			//修改关闭
			$('#paymentCanelBtn').on('click', function() {
				//隐藏弹框
				me.hidePaymentAlert();

			});

		},
		/**
		 * 显示费用明细新增弹框
		 */
		showPaymentAlert: function() {
			//获取弹框对象
			var alert = $('#createDetali');
			//显示弹框及蒙层
			$yt_baseElement.showMongoliaLayer();
			$yt_alert_Model.getDivPosition(alert);
			$('#pop-modle-alert').show();
			alert.show();
		},
		/**
		 * 隐藏费用明细新增弹框
		 */
		hidePaymentAlert: function() {
			//获取弹框对象
			var alert = $('#createDetali');
			//关闭弹框及蒙层
			$yt_baseElement.hideMongoliaLayer();
			alert.hide();
			$('#pop-modle-alert').hide();
		},
		/**
		 * 选择事前审批单相关事件
		 */
		serveExamineEvent: function() {
			//弹出框显示
			$('.prior-approval').click(function() {
				//显示弹框及蒙层
				$yt_baseElement.showMongoliaLayer();
				$yt_alert_Model.getDivPosition($('.prior-alert'));
				$('#pop-modle-alert').show();
				$('.prior-alert').show();
			});
			//确定事件
			$('.prior-common').click(function() {

				var code = $('.prior-approval-list .yt-table-active').attr('code');
				if(code) {
					$('.prior-approval').val(code);
					//隐藏弹框及蒙层
					$yt_baseElement.hideMongoliaLayer();
					$('.prior-alert').hide();
					$('#pop-modle-alert').hide();
				} else {

					$yt_alert_Model.prompt('请选择一条数据');
				}
			});

			//取消事件
			$('.prior-cancel').click(function() {
				//隐藏弹框及蒙层
				$yt_baseElement.hideMongoliaLayer();
				$('.prior-alert').hide();
				$('#pop-modle-alert').hide();
			});
		},
		/**
		 * 填写对象信息相关事件
		 */
		tallyListEvent: function() {
			var me = this;

			//显示弹出框
			$('.add-tally').click(function() {
				me.showMsgAlert();
				$('.tally-common').off().on('click', function() {
					me.appendMsgList();
				}).text('添加到列表');
			});

			//取消
			$('.tally-cancel').click(function() {
				//隐藏
				me.hideMsgAlert();
				//清空
				me.clearAlert($('.msg-alert'));
			});

			//列表内删除
			$('.tally-list').on('click', '.operate-del', function() {
				var ithis = $(this);
				var tr = ithis.parents('tr');
				$yt_alert_Model.alertOne({
					alertMsg: "数据删除将无法恢复,确认删除吗?", //提示信息  
					confirmFunction: function() { //点击确定按钮执行方法  
						tr.remove();
					}
				});
			});

			//编辑
			$('.tally-list').on('click', '.operate-update', function() {
				var ithis = $(this);
				var tr = ithis.parents('tr');
				//数据回显
				//借贷方类型
				var loanType = $('#loanType option[value="' + tr.attr('loanCode') + '"]').attr('selected', true);
				//摘要
				var abstract = $('#abstract').val(tr.attr('abstract'));
				//总账科目
				var totalSubject = $('#totalSubject').val(tr.attr('totalSubject'));
				//明细科目
				var detailSubject = $('#detailSubject').val(tr.attr('detailSubject'));
				//金额
				var tallyMoney = $('#tallyMoney').val(tr.attr('tallyMoney'));
				$('#loanType').niceSelect();
				//显示弹框
				me.showMsgAlert();
				//重置按钮
				$('.tally-common').off().on('click', function() {
					me.appendMsgList(tr);
				}).text('确定');
			});
		},
		/**
		 * 记账凭证信息列表
		 */
		appendMsgList: function(tr) {
			var me = this;
			//验证数据
			if($yt_valid.validForm($('.tally-alert'))) {
				//借贷方类型
				var loanType = $('#loanType option:selected').text();
				var loanCode = $('#loanType option:selected').val();
				//摘要
				var abstract = $('#abstract').val();
				//总账科目
				var totalSubject = $('#totalSubject').val();
				//明细科目
				var detailSubject = $('#detailSubject').val();
				//金额
				var tallyMoney = $('#tallyMoney').val();
				//金额转换
				//var numMoney = $yt_baseElement.rmoney(tallyMoney);
				//借方文本
				var totalText = '';
				//贷方文本
				var detailText = '';
				//判断借贷方类型赋值
				if(loanType == 'DEBIT_ENTRY') {
					//借方类型
					totalText = tallyMoney;
				} else {
					//贷方类型
					detailText = tallyMoney;
				}
				var html = '<tr pid="" class="" loanCode="' + loanCode + '" loanType="' + loanType + '" abstract="' + abstract + '" totalSubject="' + totalSubject + '" detailSubject="' + detailSubject + '" tallyMoney="' + tallyMoney + '">' +
					'<td>' + abstract + '</td>' +
					'<td>' + totalSubject + '</td>' +
					'<td>' + detailSubject + '</td>' +
					'<td>' + totalText + '</td>' +
					'<td>' + detailText + '</td>' +
					'<td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
					'</tr>';

				//判断是修改还是新增
				if(tr) {
					//替换
					tr.replaceWith(html);
				} else {
					$('.tally-list').append(html);
				}
				//隐藏
				me.hideMsgAlert();
				//清空
				me.clearAlert($('.tally-alert'));
			} else {

			}
		},
		/**
		 * 显示填写对象信息弹出框
		 */
		showMsgAlert: function() {
			//获取弹框对象
			var alert = $('.tally-alert');
			//显示弹框及蒙层
			$yt_baseElement.showMongoliaLayer();
			$yt_alert_Model.getDivPosition(alert);
			$('#pop-modle-alert').show();
			alert.show();
		},
		/**
		 * 隐藏填写对象信息弹出框
		 */
		hideMsgAlert: function() {
			//隐藏弹框及蒙层
			$yt_baseElement.hideMongoliaLayer();
			$('.tally-alert').hide();
			$('#pop-modle-alert').hide();
		},
		/**
		 * 清空表单内数据
		 * @param {Object} obj
		 */
		clearAlert: function(obj) {
			//取得所有select
			var selects = obj.find('select');
			//循环重置
			$.each(selects, function(i, n) {
				$(n).find('option:first-child').attr('selected', true);
			});
			selects.niceSelect();
			//输入框
			var inputs = obj.find('input');
			inputs.val('');
		},
		/**
		 * 1.1.3.4	根据报销申请Id获取报销申请详细信息
		 * @param {Object} reimAppId
		 */
		getReimAppInfoDetailByReimAppId: function(advanceAppId) {
			var me = this;
			$.ajax({
				type: "post",
				url: "sz/expenditureApp/getExpenditureAppInfoByAppId",
				async: false,
				data: {
					expenditureAppId: advanceAppId
				},
				success: function(data) {
					var d = data.data;
					me.saveData = d;
					serveExamine.processInstanceId = d.processInstanceId;
					serveExamine.costType = d.costType;
					//调用获取审批流程数据方法
					sysCommon.getApproveFlowData("SZ_EXPENDITURE_APP", d.processInstanceId,'{posCode:"'+ serveExamine.parCode +'"}');

					//判断是否有返回的页面操作方法名称
					if(d.jsFun) {
						//存在执行相应的方法
						me[d.jsFun]();
					}
					//给事前申请单号的隐藏input赋值
					$("#advanceAppNumHiddenInput").val(d.advanceAppId);
					$("#hiddenBudgetProject").val(d.budgetAppId);
					//数据回显
					me.showDetail(d);
					if(d.costType == 'ACCRUED_TAX' || d.costType == 'SOCIAL_SECURITY_FEE') {
						//最后一步显示财务支付相关
						$('.pay-detail').hide();
						//清除审批人的必填验证
						$('#approve-users').attr("validform", "{isNull:false,msg:'请选择审批人'}");
						//修改提交按钮文本
						if(d.taskKey == 'activitiEndTask') {
							$('#submitPayment').text('提交');
						} else {
							$('#submitPayment').text('提交');
						}
						//$("#printExpend").show();
					} else {

						//判断当前节点
						if(d.taskKey == 'activitiEndTask') {
							//申请人填报 对应key值: activitiStartTask  工作流最后一步审批操作对应key值: activitiEndTask
							//最后一步显示财务支付相关
							$('.pay-detail').show();
							//清除审批人的必填验证
							$('#approve-users').attr("validform", "{isNull:false,msg:'请选择审批人'}");
							$('#submitPayment').text('提交');
							//me.workEndSubmitEvent();
							//支付明细数据
							//设置收款方单位的支付明细信息
							me.gatheringUnitDetail(d.payReceivablesData.gatheringUnitList);
							//设置收款方个人的支付明细信息
							me.gatheringPersonDetail(d.payReceivablesData.gatheringPersonList);
							//设置收款方其他的支付明细信息
							me.gatheringOtherDetail(d.payReceivablesData.gatheringOtherList);
							//计算支付明细合计
							me.countDetailTotal();
							//$("#printExpend").show();
							//$("#printExpendDetail").show();
						} else {
							$('.pay-detail').hide();
							//修改提交按钮文本
							$('#submitPayment').text('提交');
						}
					}
					// 
					if(d.costType == 'TRAIN_APPLY') {
						$("#predictCostDiv").hide()
						$("#payTaxesDiv").show();
						//					
					} else {
						$("#doAdvanceBox").hide()
					}
					//禁用公务卡结算选项
					$('.check-label').off('click');
					$('.check-label input').attr('disabled', true).off('click');
					//隐藏部门或中心可用余额
					if(data.data.validateType == "UNIT") {
						$("#deptBudgetBalanceAmount").hide();
						$("#deptBudgetBalanceAmount").prev().hide();
						$("#deptBudgetBalanceAmount").next().hide();
					}
					if(data.data.validateType == "DEPT") {
						$("#budgetBalanceAmount").hide();
						$("#budgetBalanceAmount").prev().hide();
					}

				}
			});
		},
		/**
		 * 设置收款方单位的支付明细信息
		 * @param {Object} list
		 */
		gatheringUnitDetail: function(list) {
			var html = '';
			$.each(list, function(i, n) {
				$('.pay-detail-tabel .last').before('<tr class="pay-row" pkId="' + n.unitId + '" ctype="GATHERING_UNIT" reverseLoanAmount="'+ $yt_baseElement.rmoney(n.reverseLoanAmount) +'">' +
					'<td>' + n.unitName + '</td>' +
					'<td><input id="unitDate' + n.unitId + '" class="calendar-input pay-date" style="width: 198px;" value="" placeholder="请选择日期" type="text" readonly="readonly"></td>' +
					'<td><input class="yt-input money-input cash" placeholder="请输入" value="0.00"></td>' +
					'<td><input class="yt-input money-input offica" placeholder="请输入" value="0.00"></td>' +
					'<td><input class="yt-input money-input trans" placeholder="请输入" value="' + (serveExamine.fmMoney(n.actualCollectionAmount)) + '"></td>' +
					'<td class="row-total">' + (serveExamine.fmMoney(n.actualCollectionAmount)) + '</td>' +
					'</tr>');
				$('#unitDate' + n.unitId).calendar({
					speed: 0
				});
			});
		},
		/**
		 * 设置收款方个人的支付明细信息
		 * @param {Object} list
		 */
		gatheringPersonDetail: function(list) {
			var html = '';
			$.each(list, function(i, n) {
				$('.pay-detail-tabel .last').before('<tr class="pay-row" pkId="' + n.personalId + '" ctype="GATHERING_PERSON" reverseLoanAmount="'+ $yt_baseElement.rmoney(n.writeOffAmount) +'">' +
					'<td>' + n.personalName + '</td>' +
					'<td><input id="personalDate' + n.personalId + '" class="calendar-input pay-date" style="width: 198px;" value="" placeholder="请选择日期" type="text" readonly="readonly"></td>' +
					'<td><input class="yt-input money-input cash" placeholder="请输入" value="' + (serveExamine.fmMoney(n.cash)) + '"></td>' +
					'<td><input class="yt-input money-input offica" placeholder="请输入" value="' + (serveExamine.fmMoney(n.officialCard)) + '"></td>' +
					'<td><input class="yt-input money-input trans" placeholder="请输入" value="' + (serveExamine.fmMoney(n.transfer)) + '"></td>' +
					'<td class="row-total">' + (serveExamine.fmMoney(Number(n.cash) + Number(n.officialCard) + Number(n.transfer))) + '</td>' +
					'</tr>');
				$('#personalDate' + n.personalId).calendar({
					speed: 0
				});
			});
		},
		/**
		 * 设置收款方其他的支付明细信息
		 * @param {Object} list
		 */
		gatheringOtherDetail: function(list) {
			var html = '';
			$.each(list, function(i, n) {
				$('.pay-detail-tabel .last').before('<tr class="pay-row" pkId="' + n.otherId + '" ctype="GATHERING_OTHER" reverseLoanAmount="'+ $yt_baseElement.rmoney(n.reverseLoanAmount) +'">' +
					'<td>' + n.otherName + '</td>' +
					'<td><input id="otherDate' + n.otherId + '" class="calendar-input pay-date" style="width: 198px;" value="" placeholder="请选择日期" type="text" readonly="readonly"></td>' +
					'<td><input class="yt-input money-input cash" placeholder="请输入" value="0.00"></td>' +
					'<td><input class="yt-input money-input offica" placeholder="请输入" value="0.00"></td>' +
					'<td><input class="yt-input money-input trans" placeholder="请输入" value="' + (serveExamine.fmMoney(n.actualCollectionAmount)) + '"></td>' +
					'<td class="row-total">' + (serveExamine.fmMoney(n.actualCollectionAmount)) + '</td>' +
					'</tr>');
				$('#otherDate' + n.otherId).calendar({
					speed: 0
				});
			});
		},
		/**
		 * 计算支付明细合计
		 */
		countDetailTotal: function() {
			var total = 0;
			$('.pay-detail-tabel .row-total').each(function() {
				total += serveExamine.rmoney($(this).text());
			});
			$('.pay-detail-tabel .last .total-money').text(serveExamine.fmMoney(total));
		},
		/**
		 * 1.1.3.5	根据条件获取费用申请详细信息
		 * @param {Object} appId
		 * @param {Object} costType
		 */
		getCostAppInfoDetailByParams: function(appId, costType) {
			var me = this;
			$.ajax({
				type: "post",
				url: "sz/reimApp/getCostAppInfoDetailByParams",
				async: true,
				data: {
					appId: appId,
					costType: costType
				},
				success: function(data) {
					//数据回显
					me.showCostDetail(data.data);
				}
			});
		},
		/**
		 * 1.1.3.6	根据报销申请Id获取生成预览报销申请单详细信息
		 * @param {Object} reimAppId 报销申请Id
		 * @param {Object} previewFalg 是否预览(true : 预览,flase : 生成)
		 * @param {Object} qrCodeContext 二维码访问路径(报销审批路径)
		 */
		getReimPreviewDetailByReimAppId: function(reimAppId, previewFalg, qrCodeContext) {
			var me = this;
			$.ajax({
				type: "post",
				url: "sz/reimApp/getCostAppInfoDetailByParams",
				async: true,
				data: {
					reimAppId: reimAppId,
					previewFalg: previewFalg,
					qrCodeContext: qrCodeContext
				},
				success: function(data) {
					//数据回显 未定义 ？？
					//me.showCostDetail(data.data);
				}
			});
		},

		/**
		 * 获取保存提交的数据
		 */
		getSubData: function() {

			//获取附件id
			var getFileList = function() {
				var str = '';
				//获取所有的文件列表
				var list = $('#attIdStr .li-div');
				$.each(list, function(i, n) {
					str += $(n).attr('fid') + (i < list.length ? ',' : '');
				});
				return str;
			};
			//获取接待对象信息集合json
			var costReceptionistList = function() {
				var list = [];
				//获取接待对象列表
				var trs = $('.msg-list tbody tr');
				var tr = null;
				$.each(trs, function(i, n) {
					//单个tr
					tr = $(n);
					list.push({
						costReceptionistId: tr.attr('pkId'), //costReceptionistId	接待对象Id
						name: tr.find('.name-text').text(), //name	姓名
						jobName: tr.find('.job-text').text(), //jobName	职务
						unitName: tr.find('.unit-text').text(), //unitName	单位名称
					});
				});
				return list;
			};
			//获取费用明细json
			var costDetailsList = function() {
				var list = [];
				//获取费用明细列表
				var trs = $('#paymentList tbody tr:not(.last)');
				var tr = null;
				$.each(trs, function(i, n) {
					//单个tr
					tr = $(n);
					list.push({
						costDetailsId: tr.attr('pkId'), //costDetailsId	费用明细表Id
						publicServiceProCode: tr.attr('budgetcode'), //publicServiceProCode	公务活动项目code
						activityDate: tr.find('.act-date').text(), //activityDate	活动日期
						placeName: tr.find('.place-name').text(), //placeName	活动场所
						costType: tr.attr('costcode'), //costType	具体费用类型code
						standardAmount: tr.find('.stan-money').attr('money'), //standardAmount	标准金额
						activityAmount: tr.find('.money').attr('money'), //activityAmount	活动金额
						peopleNum: tr.find('.people-num').text(), //peopleNum	陪同人数
						setMethod: '' //setMethod	结算方式
					});
				});
				return list;
			};
			//行程明细
			var tripPlanList = function() {
				var list = [];
				//获取费用明细列表
				var trs = $('#tripList tbody tr:not(.last)');
				var tr = null;
				$.each(trs, function(i, n) {
					//单个tr
					tr = $(n);
					list.push({
						travelType: tr.attr('busicode'), //travelType	出差类型
						travelAddress: tr.find('.address').attr('val'), //travelAddress	出差地点
						travelAddressName: tr.find('.address').text(),
						startTime: tr.find('.sdate').text(), //startTime	开始时间
						endTime: tr.find('.edate').text(), //endTime	结束时间
						travelPersonnels: tr.attr('usercode'), //travelPersonnels	出差人
						receptionCostItem: tr.attr('rececode'), //receptionCostItem	接待方承担费用项
						setMethod: '' //setMethod	结算方式

					});
				});
				return list;
			};
			//城市间交通费
			var carfareList = function() { //获取城市间交通费列表数据
				var costCarfareList = [];
				var costCarfareJson = "";
				var cityDatas;
				if($("#traffic-list-info tbody tr:not(.total-last-tr)").length > 0) {
					$("#traffic-list-info tbody tr:not(.total-last-tr)").each(function(i, n) {
						cityDatas = $(this).getDatas();
						//费用格式化
						cityDatas.crafare = $yt_baseElement.rmoney(cityDatas.crafare);
						cityDatas.setMethod = '';
						//交通工具做处理,判断子级交通工具是否有值
						if($(this).find(".hid-child-code").val() == "null" || $(this).find(".hid-child-code").val() == "") {
							cityDatas.vehicle = "." + $(this).find(".hid-vehicle").val() + ".";
						} else {
							cityDatas.vehicle = "." + $(this).find(".hid-vehicle").val() + "." + $(this).find(".hid-child-code").val() + ".";
						}
						costCarfareList.push(cityDatas);
					});
				}
				return costCarfareList;
			};
			//住宿费用
			var hotelList = function() { //获取住宿费列表数据
				var costHotelList = [];
				var costHotelJson = "";
				var hotelDatas;
				if($("#hotel-list-info tbody tr:not(.total-last-tr)").length > 0) {
					$("#hotel-list-info tbody tr:not(.total-last-tr)").each(function(i, n) {
						hotelDatas = $(this).getDatas();
						hotelDatas.hotelExpense = $yt_baseElement.rmoney(hotelDatas.hotelExpense);
						hotelDatas.setMethod = '';
						costHotelList.push(hotelDatas);
					});
					if(costHotelList.length > 0) {
						costHotelJson = JSON.stringify(costHotelList);
					}
				}
				return costHotelList;
			};
			//其他费用
			var otherList = function() {
				//获取其他列表数据
				var costOtherList = [];
				var costOtherJson = "";
				var otherDatas;
				if($("#other-list-info tbody tr:not(.total-last-tr)").length > 0) {
					$("#other-list-info tbody tr:not(.total-last-tr)").each(function(i, n) {
						otherDatas = $(this).getDatas();
						otherDatas.reimAmount = $yt_baseElement.rmoney(otherDatas.reimAmount);
						otherDatas.setMethod = '';
						costOtherList.push(otherDatas);
					});
					if(costOtherList.length > 0) {
						costOtherJson = JSON.stringify(costOtherList);
					}
				}
				return costOtherList;
			};
			//补助明细
			var costSubsidyList = function() {
				var list = [];
				//获取费用明细列表
				var trs = $('#subsidy-list-info tbody tr:not(.last)');
				var tr = null;
				$.each(trs, function(i, n) {
					//单个tr
					tr = $(n);
					list.push({
						travelPersonnel: tr.find('.user').attr('code'), //travelPersonnel	出差人
						subsidyDays: tr.find('.subsidy-num').text(), //subsidyDays	补助天数
						subsidyFoodAmount: tr.find('.food').attr('num'), //subsidyFoodAmount	伙食补助费
						carfare: tr.find('.traffic').attr('num'), //carfare	室内交通费
						setMethod: '' //setMethod	结算方式
					});
				});
				return list;
			};
			//费用申请json
			var costData = function() {
				return JSON.stringify({
					costReceptionistList: costReceptionistList(),
					costDetailsList: costDetailsList(),
					travelRouteList: tripPlanList(),
					costCarfareList: carfareList(),
					costHotelList: hotelList(),
					costOtherList: otherList(),
					costSubsidyList: costSubsidyList()
				});
			}
			//记账凭证json
			var billingVoucherJson = function() {
				var list = [];
				//获取费用明细列表
				var trs = $('#tally-list tbody tr');
				var tr = null;
				$.each(trs, function(i, n) {
					//单个tr
					tr = $(n);
					list.push({
						billingVoucherId: tr.attr('pid'), //billingVoucherId	记账凭证Id
						toLoanType: tr.attr('loancode'), //toLoanType	借贷类型
						abstracts: tr.attr('abstract'), //abstracts	摘要
						ledger: tr.attr('totalsubject'), //ledger	总账科目
						detailed: tr.attr('detailsubject'), //detailed	明细科目
						amount: tr.attr('tallymoney') //amount	金额
					});
				});
				return JSON.stringify(list);
			};
			return {
				advanceAppId: $('#advanceAppId').val(), //advanceAppId	事前申请id
				loanAppId: $('#loanAppId').val(), //loanAppId	借款申请表id
				reimAppId: $('#reimAppId').val(), //reimAppId	报销申请表id
				reimAppNum: $('#reimAppNum').val(), //reimAppNum	报销单号
				reimAppName: $('#reimAppName').attr('val'), //reimAppName	报销事由
				costType: $('#costTypeName').attr('val'), //costType	费用类型
				//isSpecial: $('#isSpecial').attr('val'), //isSpecial	是否专项(1 是 2 否)
				specialCode: $('#specialName').attr('val'), //specialCode	专项所属code
				invoiceNum: $('#invoiceNum').text(), //invoiceNum	发票张数
				totalAmount: $('#totalAmount').attr('num'), //totalAmount	报销总金额
				writeOffAmount: $yt_baseElement.rmoney($('#writeOffAmount').text()), //writeOffAmount	冲销金额
				officialCard: $yt_baseElement.rmoney($('#officialCard').text()), //officialCard	公务卡金额
				cash: $yt_baseElement.rmoney($('#cash').text()), //cash	现金金额
				cheque: $yt_baseElement.rmoney($('#cheque').text()), //cheque	支票金额
				transfer: 0, //transfer	转账金额
				attIdStr: getFileList(), //attIdStr	附件id,字符串,逗号分隔
				paymentDate: $('#paymentDate').val(), //paymentDate	支付日期
				paymentAmount: $yt_baseElement.rmoney($('#paymentAmount').val() || '0'), //paymentAmount	支付金额
				cmTotalAmount: $yt_baseElement.rmoney($('#cmTotalAmount').text() || '0'), //cmTotalAmount	支付明细_报销总金额
				cmWriteOffAmount: $yt_baseElement.rmoney($('#cmWriteOffAmount').text() || '0'), //cmWriteOffAmount	支付明细_冲销金额
				cmOfficialCard: $yt_baseElement.rmoney($('#cmOfficialCard').val() || '0'), //cmOfficialCard	支付明细_公务卡金额
				cmCash: $yt_baseElement.rmoney($('#cmCash').val() || '0'), //cmCash	支付明细_现金金额
				cmCheque: $yt_baseElement.rmoney($('#cmCheque').val() || '0'), //cmCheque	支付明细_支票金额
				cmTransfer: 0, //cmTransfer	支付明细_转账金额

				applicantUser: $('#applicantUser').val(), //applicantUser	申请人code
				parameters: '{posCode:"'+ serveFunds.parCode +'"}', //parameters	JSON格式字符串, 
				dealingWithPeople: $('#approve-users option:selected').val(), //dealingWithPeople	下一步操作人code
				opintion: $('#opintion').val(), //opintion	审批意见
				processInstanceId: $('#processInstanceId').val(), //processInstanceId	流程实例ID, 
				nextCode: $('#operate-flow option:selected').val(), //nextCode	操作流程代码
				costData: [], //costData	费用申请json
				billingVoucherJson: billingVoucherJson(), //billingVoucherJson	记账凭证json

			};
		},
		/**
		 * 报销申请数据回显
		 * @param {Object} data
		 */
		showDetail: function(d) {
			var me = this;
			//转换金额格式的方法
			var fMoney = $yt_baseElement.fmMoney;
			$('#reimAppName').text(d.expenditureAppName); //reimAppName	支出事由
			$('#specialName').text(d.specialName || '--');
			$('#advanceAppNum').text(d.advanceAppNum || '--'); //advanceAppNum	事前申请编号
			$('#costTypeName').text(d.costTypeName).attr('val', d.costType); //单据样式
			//培训费提示文字
			if(d.costType == "TRAIN_APPLY") {
				$("#noContain").show();
			} else {
				$("#noContain").hide();
			}
			$('#formNum').text(d.expenditureAppNum);

			//调用给表单设置值的方法
			$(".ordinary-div").setDatas(d);

			$('#busiUsers').text(d.applicantUserName); //申请人名称: applicantUserName				
			$('#deptName').text(d.applicantUserDeptName); //申请人部门: applicantUserDeptName		
			//申请人职务code: applicantUserJobName
			$('#jobName').text(d.applicantUserPositionName == "" ? "--" : d.applicantUserPositionName);
			//电话号码
			$("#telPhone").text(d.applicantUserPhone == "" ? "--" : d.applicantUserPhone);
			$('#advanceAppId').val(d.advanceAppId); //advanceAppId	事前申请id
			$('#loanAppId').val(d.loanAppId); //loanAppId	借款申请表id
			$('#loanAmount').text(d.arrearsAmount ? (fMoney(d.arrearsAmount)) : '0.00');
			//本次冲销金额：报销总额大于欠款 ，本次冲销=欠款金额,报销总额小于等于欠款，本次冲销=报销总额。
			var outWriteAmount = +d.totalAmount <= +d.arrearsAmount ? d.totalAmount : d.arrearsAmount;
			$('#outWriteAmount').text(fMoney(outWriteAmount || '0'));
			$('#reimAppId').val(d.reimAppId); //reimAppId	报销申请表id

			if(d.advanceAppNum) {
				$('.advance-relevance').show();
				$('#advanceAppBalance').text(d.advanceAppBalance ? (fMoney(d.advanceAppBalance) + '元') : '--');
				$('.advance-relevance').append('<span>（不包含冻结金额'+d.frozenMount+'元）</span>');
			}
			//项目名称存在时 显示项目名称
			var specialValArr = d.specialCode.split('-');
			if(specialValArr[0] == '395') { //所属预算项目为项目支出
				$('.prj-name-tr').show(); //显示所属项目
				$('#prjName').text(d.prjName); //prjName	项目名称
			} else {
				$('.prj-name-tr').hide(); //隐藏所属项目
			}
			if(specialValArr[0] == '402') {
				$(".deptBudgetBalanceAmount").hide();
			} else {
				$(".deptBudgetBalanceAmount").show();
			}

			$('#reimAppNum').val(d.reimAppNum); //reimAppNum	报销单号
			$('#formNum').text(d.reimAppNum).attr('val', d.reimAppNum);

			$('#budgetBalanceAmount').text(d.budgetBalanceAmount ? fMoney(d.budgetBalanceAmount) + '万元' : '--'); //budgetBalanceAmount	预算剩余额度
			$('#deptBudgetBalanceAmount').text(d.deptBudgetBalanceAmount ? fMoney(d.deptBudgetBalanceAmount) + '万元' : '--');
			//invoiceNum	发票张数
			$('#invoiceNum').text(d.invoiceNum);
			$('#mustMoney').text(fMoney(d.totalAmount || '0'));
			//totalAmount	报销总金额
			/*if(d.costType == 'ACCRUED_TAX' || d.costType == 'SPECIAL_DEDUCTION') {
				//totalAmount	报销总金额
				$('#totalAmount').text(fMoney(d.deductBudgetAmount || '0')).attr('num', d.deductBudgetAmount);
				//扣除预算总金额
				$("#deductBudgetTotalMoney").text(fMoney(d.totalAmount || '0')).attr('num', d.totalAmount);
				$('#totalMoneyUpper').text(arabiaToChinese(d.deductBudgetAmount + '' || '0'));
			} else {
				//totalAmount	报销总金额
				$('#totalAmount').text(fMoney(d.totalAmount || '0')).attr('num', d.totalAmount);
				//扣除预算总金额
				$("#deductBudgetTotalMoney").text(fMoney(d.deductBudgetAmount || '0')).attr('num', d.deductBudgetAmount);
				//大写金额
				$('#totalMoneyUpper').text(arabiaToChinese(d.totalAmount + '' || '0'));
			}*/
			//totalAmount	报销总金额
			$('#totalAmount').text(fMoney(d.totalAmount || '0')).attr('num', d.totalAmount);
			//扣除预算总金额
			$("#deductBudgetTotalMoney").text(fMoney(d.deductBudgetAmount || '0')).attr('num', d.deductBudgetAmount);
			//大写金额
			$('#totalMoneyUpper').text(arabiaToChinese(d.totalAmount + '' || '0'));
			$('#amountTotalMoney').text(fMoney(d.totalAmount || '0')).attr('num', d.totalAmount);
			$('#paymentList .total-money').text(fMoney(d.totalAmount || '0')).attr('num', d.totalAmount);

			//writeOffAmount	冲销金额
			$('#writeOffAmount,#outWriteAmount').text(fMoney(d.writeOffAmount || '0')).attr('num', d.writeOffAmount);
			//报销后借款单余额：计算项，计算逻辑：如果报销金额小于借款单可用余额，则借款单可用余额-报销金额；如果报销金额大于风雨借款单可用余额；则显示为0.00
			var balanceMoney = d.totalAmount < d.arrearsAmount ? d.arrearsAmount - d.totalAmount : '0';
			$('#balanceMoney').text(fMoney(balanceMoney));
			//officialCard	公务卡金额
			$('#officialCard').text(fMoney(d.officialCard || '0')).attr('num', d.officialCard);
			//cash	现金金额
			$('#cash').text(fMoney(d.cash || '0')).attr('num', d.cash);
			//cheque	支票金额
			$('#cheque').text(fMoney(d.cheque || '0')).attr('num', d.cheque);
			//transfer	转账金额
			var body = $('#applyTable tbody');
			//计算合计金额
			var total = +d.officialCard + +d.cash + +d.cheque + 0;
			//格式转换
			var rtotal = fMoney(total || '0');
			//赋值合计金额
			body.find('.total').text(rtotal).attr('num', total);
			// 补领金额：计算项，计算逻辑：如果报销金额小于借款单可用余额，则为0.00；如果报销金额大于等于借款单可用余额，则报销金额-冲销金额的金额值
			var replaceMoney = total;
			$('#replaceMoney').text(fMoney(replaceMoney));
			//借款单号
			$('#loanAppNum').text(d.loanAppNum ? d.loanAppNum : '--');
			$('#invoiceNum').text(d.invoiceNum);
			//paymentDate	支付日期
			$('#paymentDate').val(d.paymentDate);
			//paymentAmount	支付金额
			//paymentAmount	已付款金额
			$('#paymentAmount,#alreadyMoney').text(fMoney(d.paymentAmount));
			//paymentBalanceAmount	未付款金额
			$('#notMoney').text(fMoney(d.paymentBalanceAmount));
			var cmTotalAmount = d.cmTotalAmount ? d.cmTotalAmount : d.totalAmount;
			//cmTotalAmount	支付明细_报销总金额
			$('#cmTotalAmount').text(fMoney(cmTotalAmount || '0')).attr('num', cmTotalAmount);
			//cmWriteOffAmount	支付明细_冲销金额
			$('#cmWriteOffAmount').text(fMoney(d.writeOffAmount || '0')).attr('num', d.writeOffAmount);
			//支付明细补领金额
			$('#cmReplaceMoney').text(fMoney(replaceMoney)).attr('num', replaceMoney);
			//cmOfficialCard	支付明细_公务卡金额
			$('#cmOfficialCard').val(fMoney(d.cmOfficialCard || '0'));
			//cmCash	支付明细_现金金额
			$('#cmCash').val(fMoney(d.cmCash || '0'));
			//cmCheque	支付明细_支票金额
			$('#cmCheque').val(fMoney(d.cmCheque || '0'));
			//replaceMoney 补领金额为0的时候，后面的补领方式不可填写，
			if(replaceMoney <= 0) {
				$('.payroll-working .amount-table tbody input').attr('disabled', true);
			}
			//applicantUser	申请人code
			$('#applicantUser').val(d.applicantUser);
			//applicantUserName	申请人名称

			//applicantTime	申请时间
			$('#applicantTime').text(d.applicantTime);
			//nodeNowState	流程状态
			$('#operate-flow option[value="' + d.nodeNowState + '"]').attr('selected', true);
			//workFlowState	工作流状态

			//processInstanceId	流程实例Id
			$('#processInstanceId').val(d.processInstanceId);
			//currentAssignee	当前责任人
			$('#approve-users option[value="' + d.currentAssignee + '"]').attr('selected', true);
			$('#operate-flow,#approve-users').niceSelect();
			//historyAssignee	历史责任人
			//attList	支出附件集合
			me.showFileList(d.attList);
			//advanceAppAttList	事前申请附件信息集合
			me.showAdvanceFileList(d.advanceAppAttList);
			if(d.payReceivablesData.gatheringUnitList == 0 && d.payReceivablesData.gatheringPersonList == 0 && d.payReceivablesData.gatheringOtherList == 0) {
				$(".payment-information").html('<table style="width:100%"><tr style="border:0px;background-color:#fff !important;"><td align="center"style="border:0px;"><div class="no-data" style="width: 280px;padding:0;margin: 0 auto;">' +
					'<img src="../../../../../resources-sasac/images/common/no-data.png" alt="" style="padding:10px 0;">' +
					'</div></td></tr></table>');
			} else {
				//payReceivablesData 收款方为单位
				me.showGatheringUnitList(d.payReceivablesData);
				//gatheringPersonList  收款方为个人
				me.showGatheringPersonList(d.payReceivablesData);
				//gatheringOtherList  收款方为其他
				me.showGatheringOtherList(d.payReceivablesData);
			}
			//costData	费用申请数据
			me.showCostDetail(d.costData);
			//billingVoucherList	记账凭证集合
			//me.showBillingVoucherList(d.billingVoucherList);

			//me.getTotleMoney();
			if(d.payReceivablesData.paymentSet) {
				//声明借款单obj对象
				var payLoanMapObj = {};
				//循环后台返回的借款单数据，将数据以键值对的方式存储
				$.each(d.payReceivablesData.paymentSet, function(i, n) {
					//添加字段属性 loanTotalAmount【借款单计算合计欠款金额】
					n["loanTotalAmount"] = 0;
					//将添加过字段属性的借款单数据，添加到借款单obj对象中
					//以借款单编号为key,借款单数据为值
					payLoanMapObj[n.loanAppNum] = n;
				});
				//声明临时变量借款单编号，存储tr表格中的借款单编号
				var trLoanAppNum = "";
				//声明借款单计算合计金额变量
				var loanTotal = "";
				$('.payee-unit .yt-tbody tr:not(:last),.payee-personal .yt-tbody tr:not(:last),.payee-other .yt-tbody tr:not(:last)').each(function(i, n) {
					//获取tr表格上借款单编号
					trLoanAppNum = $(n).attr('loanAppNum');
					//初始化借款单计算合计金额为0
					loanTotal = 0;
					//判断借款单obj对象中是否存在tr中的借款单
					if(payLoanMapObj[trLoanAppNum]) {
						//如果存在则将对应借款单中的借款单计算合计欠款金额赋值给声明的计算合计金额变量
						loanTotal = payLoanMapObj[trLoanAppNum].loanTotalAmount;
						//判断tr中的借款单欠款金额是否存在
						if($(this).attr('reverseLoanAmount')) {
							//如果存在则计算欠款金额
							loanTotal += $yt_baseElement.rmoney($(this).attr('reverseLoanAmount'));
							//将计算过得欠款金额重新赋值给借款单obj对象
							payLoanMapObj[trLoanAppNum].loanTotalAmount = loanTotal;
						}
					}

				});
				var orTrRed = true;
				var trNum = '';
				$.each(payLoanMapObj, function(i, n) {
					if(n.loanTotalAmount > $yt_baseElement.rmoney(n.loanAmount)) {
						orTrRed = false;
						trNum = n.loanAppNum;
						$yt_alert_Model.alertOne({  
					        haveCloseIcon: true, //是否带有关闭图标  
					        leftBtnName: "确定", //左侧按钮名称,默认确定  
					        cancelFunction: "", //取消按钮操作方法*/  
					        alertMsg: "该支出申请审批过程中，借款单欠款金额已发生变化，现少于冲销借款金额，须退回申请人修改后，重新提交", //提示信息  
					        cancelFunction: function() { //点击确定按钮执行方法  
					        },  
					    });  
						return;
					}
				});
				if(orTrRed == false) {
					$('.payee-unit .yt-tbody tr:not(:last),.payee-personal .yt-tbody tr:not(:last),.payee-other .yt-tbody tr:not(:last)').each(function(i, n) {
						if($(n).attr('loanAppNum') == trNum) {
							$(n).find('.ready-red').css('color', 'red');
						}
					});
				}

			}
		},
		/**
		 * 费用信息数据回显
		 * @param {Object} data
		 */
		showCostDetail: function(data) {
			var me = this;
			//转换金额格式的方法
			var fMoney = $yt_baseElement.fmMoney;

			//接待对象信息集合
			var costReceptionistList = data.costReceptionistList;
			//费用明细信息集合
			var costDetailsList = data.costDetailsList;

			//接待对象信息集合HTML文本
			var receHtml = '';
			$.each(costReceptionistList, function(i, n) {
				receHtml += '<tr pkId="' + n.costReceptionistId + '" class="" nameVal="' + n.name + '" dutyVal="' + n.jobName + '" deptVal="' + n.unitName + '">' +
					'<td><span class="num">1</span></td>' +
					'<td><span class="name-text">' + n.name + '</span></td>' +
					'<td><span class="job-text">' + n.jobName + '</span></td>' +
					'<td><span class="unit-text">' + n.unitName + '</span></td>' +
					'</tr>';
			});
			//替换代码
			$('.msg-list tbody').append(receHtml);
			//重置序号
			me.resetNum($('.msg-list'));

			//费用明细信息集合HTML文本
			var detaHtml = '';
			//结算方式复选框
			var costDetaClose = $('#paymentList').next().find('.check-label input');
			var fmTotal = 0;
			$.each(costDetailsList, function(i, n) {
				detaHtml += '<tr pkId="' + n.costDetailsId + '" budgetCode="' + n.publicServiceProCode + '" costCode="' + n.costType + '" budgetProject="' + n.publicServiceProName + '" applyDate="' + n.activityDate + '" siteVal="' + n.placeName + '" costBreakdown="' + n.costTypeName + '" standardMoney="' + n.standardAmount + '" budgetMoney="' + n.activityAmount + '" accompanyNum="' + n.peopleNum + '">' +
					'<td><span class="">' + n.publicServiceProName + '</span></td>' +
					'<td><span class="act-date">' + n.activityDate + '</span></td>' +
					'<td><span class="place-name">' + n.placeName + '</span></td>' +
					'<td><span>' + n.costTypeName + '</span></td>' +
					/*'<td style="text-align: right;"><div class="stan-money" money=' + n.standardAmount + '>' + fMoney(n.standardAmount || '0') + '</div></td>' +*/
					'<td style="text-align: right;"><div class="money" money=' + n.activityAmount + '>' + fMoney(n.activityAmount || '0') + '</div></td>' +
					'<td><span class="people-num">' + n.peopleNum + '</span></td>' +
					'</tr>';

				//结算方式复选框存在并且有选中的值时
				if(costDetaClose.length > 0 && n.setMethod) {
					//设置选中
					costDetaClose.setCheckBoxState('check');
				}
				fmTotal += +n.activityAmount;
			});
			//追加表格代码
			$('#paymentList tbody .last').before(detaHtml);
			$('#paymentList tbody .total-money').text(serveExamine.fmMoney(fmTotal));

			//行程明细
			var tripPlanList = data.travelRouteList;
			var tripHtml = '';
			var travelPersonnelsList = [];
			//获取出差人名称
			var getUserNames = function(list) {
				var str = '';
				$.each(list, function(i, n) {
					str += n.travelPersonnelName + (i < list.length - 1 ? '、' : '');
				});
				return str;
			};
			//获取借贷方类型
			var costItem = function(str) {
				switch(str) {
					case '1':
						return '住宿费';
						break;
					case '2':
						return '伙食费';
						break;
					case '3':
						return '市内交通费';
						break;
					default:
						return '';
						break;
				}
			};
			var getCostItemName = function(str) {
				var txt = '';
				if(str) {
					var list = str.split(',');
					$.each(list, function(i, n) {
						if(n) {
							txt += costItem(n) + (i < list.length - 1 ? '、' : '');
						}
					});
					return txt;
				}
				return '';
			};

			$.each(tripPlanList, function(i, n) {
				//1. 把开始时间和结束时间保存
				var dateFrom = new Date(n.startTime);
				var dateTo = new Date(n.endTime);
				//2. 计算时间差
				var diff = dateTo.valueOf() - dateFrom.valueOf();
				//3. 时间差转换为天数
				var diff_day = parseInt(diff / (1000 * 60 * 60 * 24));

				tripHtml += '<tr busicode="' + n.travelType + '" usercode="' + n.travelPersonnels + '" rececode="' + n.receptionCostItem + '" >' +
					'<td><input type="hidden" class="hid-user-code" value="' + n.travelPersonnels + '" /> <span class="name">' + n.travelTypeName + '</span></td>' +
					'<td class="sdate">' + n.startTime + '</td>' +
					'<td class="edate">' + n.endTime + '</td>' +
					'<td class="day">' + diff_day + '</td>' +
					'<td class="address" val="' + n.travelAddress + '">' + n.travelAddressName + '</td>' +
					'<td class="uname">' + getUserNames(n.travelPersonnelsList) + '</td>' +
					'<td class="numof">' + n.travelPersonnelsList.length + '</td>' +
					'<td class="reception">' + getCostItemName(n.receptionCostItem) + '</td>' +
					'</tr>';
			});
			$('#tripList tbody').html(tripHtml);
			if(data.expenseClassDetails.length == 0 && data.costTrainApplyInfoList.length == 0 && data.costTeachersFoodApplyInfoList.length == 0 && data.costTeachersLectureApplyInfoList.length == 0 && data.costTeachersTravelApplyInfoList.length == 0 && data.costTeachersHotelApplyInfoList.length == 0 && data.costNormalList.length == 0) {
				$(".hide-div").html('<table style="width:100%"><tr style="border:0px;background-color:#fff !important;"><td align="center"style="border:0px;"><div class="no-data" style="width: 280px;padding:0;margin: 0 auto;">' +
					'<img src="../../../../../resources-sasac/images/common/no-data.png" alt="" style="padding:10px 0;">' +
					'</div></td></tr></table>');

			} else {
				//costTrainApplyInfoList	师资-培训费json
				me.setCostTrainApplyInfoList(data.costTrainApplyInfoList);
				//师资-课酬费
				me.setTeacherClassExpenseDetails(data.expenseClassDetails);
				//师资-差旅费
				me.setTeacherTrainDetails(data.expenseDetails);
			}
			//师资-培训信息json
			me.setTrainApplyInfoList(data.trainApplyInfoList);
		},
		/**
		 * costTrainApplyInfoList	师资-培训费json
		 * 设置 师资培训费列表数据
		 * @param {Object} list
		 */
		setCostTrainApplyInfoList: function(list) {
			var html = '';
			var total = 0;
			if(list != 0) {
				$.each(list, function(i, n) {
					html += '<tr pid="' + n.trainAppId + '" trainType="' + n.trainType + '">' +
						'<td class="trainTypeName">' + n.trainTypeName + '</td>' +
						'<td class="standard">' + $yt_baseElement.fmMoney(n.standard) + '</td>' +
						'<td class="trainOfNum">' + n.trainOfNum + '</td>' +
						'<td class="moneyText averageMoney">' + $yt_baseElement.fmMoney(n.averageMoney) + '</td>' +
						'<td style="text-align: center" class="trainingPerNumber">' + (n.remark || '') + '</td>' +
						'</tr>';
					total += +n.averageMoney;
				});
				//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveExamine.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveExamine.fmMoney(totalTraffic) + '</td></tr>';
				$('#trainingFeeTable tbody .last').before(html);
				$('#trainingFeeTable .costTotal').text(serveExamine.fmMoney(total));
			} else {
				$('#trainingFeeTable').hide();
				$('.other-title-back').hide();
			}
		},
		/**
		 * trainApplyInfoList	师资-培训信息json
		 * 设置 师资培训信息列表数据
		 * @param {Object} list
		 */
		setTrainApplyInfoList: function(list) {
			var html = '';
			var me = this;
			$.each(list, function(i, n) {
				//培训费信息赋值
				me.initProjectSelect(n.projectCode,n.projectId);
				$('.from-table-detail').setDatas(n);
			});
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveExamine.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveExamine.fmMoney(totalTraffic) + '</td></tr>';
			$('#trainingPopTable tbody').html(html);
		},
		/**
		 * 附件集合显示
		 * @param {Object} list
		 */
		showFileList: function(list) {
			//图片显示拼接字符串
			var ls = '';
			//图片显示路径
			var src = '';
			if(list && list.length > 0) {
				$.each(list, function(i, n) {
					//获取图片格式
					var imgType = n.attName.split('.');
					if(imgType.length > 1 && (imgType[1] == 'png' || imgType[1] == 'jpeg' || imgType[1] == 'bmp' || imgType[1] == 'jpg')) {
						//拼接图片路径
						src = $yt_option.base_path + 'fileUpDownload/download?pkId=' + n.attId + '&isDownload=false';
						ls += '<div fid="' + n.attId + '" class="li-div"><span class="file-name" >' + n.attName + '</span><label class="file-dw">下载</label><label class="file-pv">预览<img src="' + src + '" ></label></div>';
					} else {
						ls += '<div fid="' + n.attId + '" class="li-div"><span class="file-name" >' + n.attName + '</span><label class="file-dw">下载</label><label class="file-pvno">预览</label></div>';
					}
				});
				$('#attIdStr').html(ls);
				//图片下载
				$('#attIdStr .file-dw').on('click', function() {
					var id = $(this).parent().attr('fid');
					window.location.href = $yt_option.base_path + 'fileUpDownload/download?pkId=' + id + '&isDownload=true';
				});
				//图片预览
				$('#attIdStr .file-pv img').showImg();
			} else {
				$('#attIdStr').html('暂无附件');
			}
		},
		/**
		 * 事前申请附件
		 * @param {Object} list
		 */
		showAdvanceFileList: function(list) {
			//图片显示拼接字符串
			var ls = '';
			//图片显示路径
			var src = '';
			if(list && list.length > 0) {
				$.each(list, function(i, n) {
					//获取图片格式
					var imgType = n.attName.split('.');
					if(imgType.length > 1 && (imgType[1] == 'png' || imgType[1] == 'jpeg' || imgType[1] == 'bmp' || imgType[1] == 'jpg')) {
						//拼接图片路径
						src = $yt_option.base_path + 'fileUpDownload/download?pkId=' + n.attId + '&isDownload=false';
						ls += '<div fid="' + n.attId + '" class="li-div"><span class="file-name" >' + n.attName + '</span><label class="file-dw">下载</label><label class="file-pv">预览<img src="' + src + '" ></label></div>';
					} else {
						ls += '<div fid="' + n.attId + '" class="li-div"><span class="file-name" >' + n.attName + '</span><label class="file-dw">下载</label><label class="file-pvno">预览</label></div>';
					}
				});
				$('#advanceIdStr').html(ls);
				//图片下载
				$('#advanceIdStr .file-dw').on('click', function() {
					var id = $(this).parent().attr('fid');
					window.location.href = $yt_option.base_path + 'fileUpDownload/download?pkId=' + id + '&isDownload=true';
				});
				//图片预览
				$('#advanceIdStr .file-pv img').showImg();
			} else {
				$('#advanceIdStr').html('暂无附件');
			}
		},
		/*
		 * 收款方为单位
		 */
		showGatheringUnitList: function(list) {
			var html = '';
			var total = 0;
			if(list.gatheringUnitList != 0) {
				$.each(list.gatheringUnitList, function(i, n) {
					html += '<tr class="payee-unit-tr" loanAppNum="' + n.loanAppNum + '" loanAppId="' + n.loanAppId + '" reverseLoanAmount="' + n.reverseLoanAmount + '" theReverseMoney="' + $yt_baseElement.rmoney(n.reverseLoanAmount) + '" actualMoney="' + $yt_baseElement.rmoney(n.actualCollectionAmount) + '">' +
						'<td class="com" value="Company" pid="' + n.unitId + '" >' + n.unitName + '</td>' +
						'<td style="text-align: right;" class="unitTotal">' + ($yt_baseElement.fmMoney(n.amount)) + '</td>'+
						'<td>' + n.openBank + '</td>' +
						'<td>' + n.accounts + '</td>' +
						'<td value="1">' + (n.isContract == 1 ? '有' : '无') + '</td>' +
						'<td >' + (n.isSettlement == 1 ? '汇款' : '支票') + '</td>' +
						'<td style="text-align:right;">' + ($yt_baseElement.fmMoney(n.paidAmount)) + '</td>' +
						'<td>' + (n.remarks || '') + '</td>' +
						'</tr>';
					total += +n.amount;
					serveExamine.unitActual += +n.actualCollectionAmount;
				});
				//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveExamine.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveExamine.fmMoney(totalTraffic) + '</td></tr>';
				$('table.payee-unit .payee-unit-total').before(html).find('.payee-unit-money').text($yt_baseElement.fmMoney(total));
			} else {
				$('table.payee-unit').hide();
				$(".unit-div").hide();
			}

		},
		/*
		 * 收款方为个人
		 */
		showGatheringPersonList: function(list) {
			var html = '';
			var total = 0;
			if(list.gatheringPersonList != 0) {
				$.each(list.gatheringPersonList, function(i, n) {
					html += '<tr class="payee-personal-tr" pkid="" loanAppNum="' + n.loanAppNum + '" reverseLoanAmount="' + n.writeOffAmount + '" loanAppId="' + n.loanAppId + '" personalUnit="' + n.personalUnit + '" payeeval="' + n.personalCode + '" payeename="' + n.personalName + '" pedepartment="' + n.personalDept + '" perank="' + n.personalJobLevelName + '" personaltotal="' + n.amount + '" witeoffpersonal="' + n.reverseTheWay + '" personalwriteoff="' + n.replaceAmount + '" cash="' + n.cash + '" officialcard="' + n.officialCard + '" transferaccounts="' + n.transfer + '" payeeradio="' + n.isContract + '" personalspecial="' + n.remarks + '" idcarkno="' + n.idCard + '" payeebank="' + n.accounts + '" bankname="' + n.openBank + '" phonenum="' + n.phoneNum + '" choiceloan="' + n.loanAppNum + '" choiceloanval="' + n.loanAppId + '" arrearsmoney="' + n.loanAppArrearsAmount + '" thereversemoney="' + n.writeOffAmount + '" offOpenBank="' + n.offOpenBank + '" offAccounts="' + n.offAccounts + '">' +
						'<td class="per" value="personal" pid="' + n.personalId + '">' + n.personalName + '</td>' +
						'<td style="text-align: right;" class="personalTotal">' + serveExamine.fmMoney(n.amount) + '</td>'+
						'<td style="text-align: right;">' + (serveExamine.fmMoney(n.cash)) + '</td>' +
						'<td style="text-align: right;">' + (serveExamine.fmMoney(n.officialCard)) + '</td>' +
						'<td style="text-align: right;">' + (serveExamine.fmMoney(n.transfer)) + '</td>' +
						'<td><a class="yt-link to-data">详情</a></td>' +
						'<td>' + (n.isContract == 1 ? '有' : '无') + '</td>' +
						'<td style="text-align:right;">' + ($yt_baseElement.fmMoney(n.paidAmount)) + '</td>' +
						'<td>' + (n.remarks || '') + '</td></tr>';
					total += +n.amount;
					serveExamine.parActual += +n.replaceAmount;
				});
				//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveExamine.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveExamine.fmMoney(totalTraffic) + '</td></tr>';
				$('table.payee-personal .payee-personal-total').before(html).find('.payee-personal-money').text($yt_baseElement.fmMoney(total));
			} else {
				$('table.payee-personal').hide();
				$(".personal-div").hide();
			}

		},
		/*
		 * 收款方为其他
		 */
		showGatheringOtherList: function(list) {
			var html = '';
			var total = 0;
			if(list.gatheringOtherList != 0) {
				var goDel = '';
				$.each(list.gatheringOtherList, function(i, n) {
					goDel = '';
					if (n.reverseTheWayName == '借款单冲销') {
						goDel = 'to-detail';
					}
					html += '<tr class="payee-unit-tr"  loanAppNum="' + n.loanAppNum + '" reverseLoanAmount="' + n.reverseLoanAmount + '" loanAppId="' + n.loanAppId + '" theReverseMoney="' + $yt_baseElement.rmoney(n.reverseLoanAmount) + '" actualMoney="' + $yt_baseElement.rmoney(n.actualCollectionAmount) + '">' +
						'<td class="oth" pid="' + n.otherId + '">' + n.otherName + '</td>' +
						'<td style="text-align: right;" class="unitTotal">' + ($yt_baseElement.fmMoney(n.amount)) + '</td>'+
						'<td value="1">' + (n.isContract == 1 ? '有' : '无') + '</td>' +
						'<td style="text-align:right;">' + ($yt_baseElement.fmMoney(n.paidAmount)) + '</td>' +
						'<td>' + (n.remarks || '') + '</td>' +
						'</tr>';
					total += +n.amount;
					serveExamine.otherActual += +n.actualCollectionAmount;
				});
				//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveExamine.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveExamine.fmMoney(totalTraffic) + '</td></tr>';
				$('table.payee-other .payee-other-total').before(html).find('.payee-other-total-money').text($yt_baseElement.fmMoney(total));
			} else {
				$('table.payee-other').hide();
				$(".other-div").hide();
			}

		},
		/**
		 * 记账凭证列表显示
		 * @param {Object} list
		 */
		showBillingVoucherList: function(list) {
			//借方文本
			var totalText = '';
			//贷方文本
			var detailText = '';
			var html = '';

			$.each(function(i, n) {
				//判断借贷方类型赋值
				if(n.toLoanType == 'DEBIT_ENTRY') {
					//借方类型
					totalText = n.amount;
				} else {
					//贷方类型
					detailText = n.amount;
				}
				html += '<tr pid="' + n.billingVoucherId + '" class="" loanCode="' + n.toLoanType + '" loanType="' + n.toLoanTypeName + '" abstract="' + n.abstracts + '" totalSubject="' + n.ledger + '" detailSubject="' + n.detailed + '" tallyMoney="' + n.amount + '">' +
					'<td>' + n.abstracts + '</td>' +
					'<td>' + n.ledger + '</td>' +
					'<td>' + n.detailed + '</td>' +
					'<td>' + totalText + '</td>' +
					'<td>' + detailText + '</td>' +
					'</tr>';
			});
			$('.tally-list').append(html);
		},
		/**
		 * 获取数据字典
		 */
		getDictInfoByTypeCode: function() {
			$.ajax({
				type: "post",
				url: "basicconfig/dictInfo/getDictInfoByTypeCode",
				async: true,
				data: {
					dictTypeCode: 'TO_LOAN_TYPE'
				},
				success: function(data) {
					//获取数据list
					var list = data.data || [];
					//初始化HTML文本
					var optone = '<option value="">请选择</option>';
					//循环添加文本
					$.each(list, function(i, n) {
						//公务活动项目
						optone += '<option value="' + n.value + '">' + n.disvalue + '</option>';
					});
					//替换页面代码
					$('#loanType').html(optone).niceSelect();
					//$('#costBreakdown').html(opttwo).niceSelect();
				}
			});
		},
		/**
		 * 重置表格序号
		 * @param {Object} obj
		 */
		resetNum: function(obj) {
			var trs = obj.find('tbody tr');
			$.each(trs, function(i, n) {
				$(n).find('.num').text(i + 1);
			});
		},
		/**
		 * 提交流程数据
		 * @param {Object} subData
		 * @param {Object} thisBtn
		 * @param {Object} flowEnd
		 */
		submitReimAppInfo: function(subData, thisBtn, flowEnd) {
			$.ajax({
				type: "post",
				url: "sz/expenditureApp/submitWorkFlow",
				async: true,
				data: subData,
				success: function(data) {
					$yt_alert_Model.prompt(data.message);
					if(data.flag == 0) {
						//跳转列表页面
						//window.location.href = $yt_option.websit_path + 'view/system-sasac/expensesReim/module/approval/expenApplApprList.html';
						$yt_common.parentAction({
							url: $yt_option.parent_action_path, //父级中转地址,固定配置项,只有统一修改处理。
							funName: 'locationToMenu', //指定方法名，定位到菜单方法
							data: {
								url: 'view/system-sasac/expensesReim/module/approval/expenApplApprList.html' //要跳转的页面路径
							}
						});
						//流程结束跳转至支出单打印
						/*if(flowEnd) {
							var urlStr = '';
							//判断单据类型
							if(subData.costType == 'TRAVEL_APPLY') {
								//差旅费
								urlStr = 'view/system-sasac/expensesReim/module/print/printTravelExpenses.html?expenditureAppId=' + subData.appId + '&processInstanceId=' + subData.processInstanceId;
							} else {
								//支出表单
								urlStr = 'view/system-sasac/expensesReim/module/print/printSpendingForm.html??expenditureAppId=' + subData.appId + '&processInstanceId=' + subData.processInstanceId;
							}
							var pageUrl = urlStr; //即将跳转的页面路径
							var goPageUrl = "view/system-sasac/expensesReim/module/approval/expenApplApprList.html"; //左侧菜单指定选中的页面路径
							window.open($yt_option.websit_path + "index.html?pageUrl=" + encodeURIComponent(pageUrl) + '&goPageUrl=' + goPageUrl);
						}*/
					}
					thisBtn.attr('disabled', false).removeClass('btn-disabled');
				}
			});
		},
		/**
		 * 计算总金额
		 */
		getTotleMoney: function() { //获取所有的金额
			var tds = $('#paymentList tbody .money');
			var total = 0;
			//计算合计金额
			$.each(tds, function(i, n) {
				total += +$(n).attr('money');
			});
			var fmTotal = $yt_baseElement.fmMoney(total || '0');
			//赋值合计金额
			$('#paymentList tbody .total-money').text(fmTotal);
			//报销总金额
			$('#applyTotalMoney').text(fmTotal).attr('num', total);
			//报销总额
			$('#amountTotalMoney').text(fmTotal).attr('num', total);
			//大写转换
			$('#TotalMoneyUpper').text(arabiaToChinese(fmTotal + ''));
			//冲销总额
			var writeOffAmount = +($('#writeOffAmount').attr('num'));
			//计算补领金额 报销后借款单余额
			var num = total - writeOffAmount;
			if(num >= 0) {
				//赋值补领金额
				$('#replaceMoney').text($yt_baseElement.fmMoney(num));
			} else {
				//报销后借款单余额
				$('#balanceMoney').text($yt_baseElement.fmMoney(num));
			}
		},
		/**
		 * 获取保存的数据 并 重置 为操作后的数据
		 */
		getSaveData: function() {
			/*var me = this;
			var data = me.saveData;
			return {
				appId: data.expenditureAppId, //appId 表单申请id
				parameters: '', //parameters JSON格式字符串,
				dealingWithPeople: $('#approve-users option:selected').val(), //dealingWithPeople 下一步操作人code
				opintion: $('#opintion').val(), //opintion 审批意见
				processInstanceId: data.processInstanceId, //processInstanceId 流程实例ID,
				nextCode: $('#operate-flow option:selected').val(), //nextCode 操作流程代码
				appType: 'EXPENDITURE_APP',
				payDetailList: me.getPayDetailList()
			};*/
			
			var me = this;
			var d = me.saveData;
			costData = {};
			costData = d.costData;
			payReceivablesData = {};
			payReceivablesData = d.payReceivablesData;
			d.costData = typeof(costData) == 'string' ? costData : JSON.stringify(costData); //		costData	费用申请json串
			d.payReceivablesData = typeof(payReceivablesData) == 'string' ? payReceivablesData : JSON.stringify(payReceivablesData); //		costData	收款方json串
			d.appId = d.expenditureAppId; //appId 表单申请id
			d.parameters = '{totalAmount:' + $('#totalAmount').attr('num') + '}'; //parameters JSON格式字符串;
			d.dealingWithPeople = $('#approve-users option:selected').val(); //dealingWithPeople 下一步操作人code
			d.opintion = $('#opintion').val(); //opintion 审批意见
			d.processInstanceId = d.processInstanceId; //processInstanceId 流程实例ID;
			d.nextCode = $('#operate-flow option:selected').val(); //nextCode 操作流程代码
			d.appType = 'EXPENDITURE_APP';
			d.payDetailList = me.getPayDetailList();
			return d; 
		},
		/**
		 * 获取支付明细的数据
		 */
		getPayDetailList: function() {
			var list = [];
			$('.pay-detail-tabel .pay-row').each(function(i, n) {
				n = $(n);
				list.push({
					receivablesId: n.attr('pkId'), //receivablesId 收款方id
					receivablesType: n.attr('ctype'), //receivablesType 收款方类型
					writeOffAmount: serveExamine.rmoney(n.find('.write').text()),
					cash: serveExamine.rmoney(n.find('.cash').val()), //cash 现金
					officialCard: serveExamine.rmoney(n.find('.offica').val()), //officialCard 公务卡
					transfer: serveExamine.rmoney(n.find('.trans').val()), //transfer 转账
					paymentDate: n.find('.pay-date').val(), //paymentDate.付款日期
					writeOffAmount: n.attr('reverseloanamount'), //writeOffAmount.冲销金额
					paymentAmount: serveExamine.rmoney(n.find('.row-total').text()), //paymentAmount 付款金额
				});
			});
			return JSON.stringify(list);
		},
		getFileList: function() {
			var str = '';
			//获取所有的文件列表
			var list = $('#attIdStr .li-div');
			$.each(list, function(i, n) {
				str += $(n).attr('fid') + (i < list.length ? ',' : '');
			});
			return str;
		},
		/**
		 * 显示业务员招待费
		 */
		showBusinessFun: function() {
			$('.index-main-div').html('');
			//提示文字隐藏
			$('.qtip-text-div').hide();
			//其他区域隐藏
			$('.mod-div').hide();
			//其他信息显示
			$('.dottom-div,.approve-div').show();
			$('.grod-div').show();
			//相关区域显示
			$('.index-main-div').show();
			//加载区域页面
			sysCommon.loadingWord('view/system-sasac/expensesReim/module/reimApply/hospitalitySpendingDetail.html');
			//课酬费税金隐藏
			$("#doAdvanceBox").hide();
		},
		/**
		 * 一般费用
		 */
		showGeneralFun: function() {
			//清空原有代码
			$('.index-main-div').html('');
			//提示文字隐藏
			$('.qtip-text-div').hide();
			//其他区域隐藏
			$('.mod-div').hide();
			//其他信息显示
			$('.dottom-div,.approve-div').show();
			$('.grod-div').show();
			//相关区域显示
			$('.index-main-div').show();
			//纳税信息
			$(".rece-msg").hide();
			//课酬费税金隐藏
			$("#doAdvanceBox").hide();
			//事前申请相关附件隐藏
			$(".advance-file-div").hide();
			//事前申请单
			$("#advanceApplication").hide();
			//加载区域页面
			sysCommon.loadingWord('view/system-sasac/expensesReim/module/reimApply/costDetailApproval.html');
		},
		/**
		 * 差旅
		 */
		showTravelFun: function() {
			$('.index-main-div').html('');
			//提示文字隐藏
			$('.qtip-text-div').hide();
			//其他区域隐藏
			$('.mod-div').hide();
			//其他信息显示
			$('.dottom-div,.approve-div').show();
			$('.grod-div').show();
			//相关区域显示
			$('.index-main-div').show();
			//加载区域页面
			sysCommon.loadingWord('view/system-sasac/expensesReim/module/reimApply/travelSpendingDetails.html');
		},
		/**
		 * 培训
		 */
		showTrainFun: function() {
			//清空原有代码
			$('.index-main-div').html('');
			//提示文字隐藏
			$('.qtip-text-div').hide();
			//其他区域隐藏
			$('.mod-div').hide();
			//其他信息显示
			$('.dottom-div,.approve-div').show();
			$('.grod-div').show();
			//相关区域显示
			$('.index-main-div').show();
			//加载区域页面
			sysCommon.loadingWord('view/system-sasac/expensesReim/module/busiTripApply/trainApproval.html');
			//课酬费税金隐藏
			$("#doAdvanceBox").show();
		},
		/**
		 * 会议
		 */
		showMettingFun: function() {
			//提示文字隐藏
			$('.qtip-text-div').hide();
			//其他区域隐藏
			$('.mod-div').hide();
			//其他信息显示
			$('.dottom-div,.approve-div').show();
			$('.grod-div').show();
			//加载区域页面
			sysCommon.loadingWord('view/system-sasac/expensesReim/module/beforehand/meetingCostApplyDetails.html');
			//课酬费税金隐藏
			$("#doAdvanceBox").hide();
		},
		/**
		 * 社保费
		 */
		showSheBaoFun: function() {
			$('.index-main-div').html('');
			$('.qtip-text-div').hide();
			$('.mod-div').hide();
			$('.approve-div,.else-div').show();
			sysCommon.loadingWord('view/system-sasac/expensesReim/module/reimApply/costDetail.html');
			//纳税信息
			$(".rece-msg").hide();
			//课酬费税金隐藏
			$("#doAdvanceBox").hide();
			//扣除预算总金额显示
			$("#deductBudgetDiv").show();
			//事前申请相关附件隐藏
			$(".advance-file-div").hide();
			//事前申请单
			$("#advanceApplication").hide();
			//通用表格隐藏
			$("#costSpending").hide();
			//其他社保表格显示
			$("#socialSecurity").show();
			//新增按钮隐藏
			$(".special-btn").hide();
			//操作列表隐藏
			$("table .operation").hide();
			$("#workflowCode").val("SBJF_APP_FLOW");
			sysCommon.getApproveFlowData("SZ_SBJF_APP", serveExamine.processInstanceId,'{posCode:"'+ serveExamine.parCode +'"}');
		},
		/**
		 * 应交税费用
		 */
		showYingJiaoFun: function() {
			$('.index-main-div').html('');
			$('.qtip-text-div').hide();
			$('.mod-div').hide();
			$('.approve-div,.else-div').show();
			sysCommon.loadingWord('view/system-sasac/expensesReim/module/reimApply/costDetail.html');
			//纳税信息
			$(".rece-msg").hide();
			//课酬费税金隐藏
			$("#doAdvanceBox").hide();
			//扣除预算总金额显示
			$("#deductBudgetDiv").show();
			//事前申请相关附件隐藏
			$(".advance-file-div").hide();
			//事前申请单
			$("#advanceApplication").hide();
			//通用表格隐藏
			$("#costSpending").hide();
			//其他社保表格显示
			$("#socialSecurity").show();
			//新增按钮隐藏
			$(".special-btn").hide();
			//操作列表隐藏
			$("table .operation").hide();
			$("#workflowCode").val("YJSF_APP_FLOW");
			sysCommon.getApproveFlowData("SZ_YJSF_APP", serveExamine.processInstanceId,'{posCode:"'+ serveExamine.parCode +'"}');
		},
		/**
		 * 医疗费费用
		 */
		showYiLiaoFun: function() {
			$('.index-main-div').html('');
			$('.qtip-text-div').hide();
			$('.mod-div').hide();
			$('.approve-div,.else-div').show();
			sysCommon.loadingWord('view/system-sasac/expensesReim/module/reimApply/costDetail.html');
			//纳税信息
			$(".rece-msg").hide();
			//课酬费税金隐藏
			$("#doAdvanceBox").hide();
			//扣除预算总金额显示
			$("#deductBudgetDiv").show();
			//事前申请相关附件隐藏
			$(".advance-file-div").hide();
			//事前申请单
			$("#advanceApplication").hide();
			//通用表格隐藏
			$("#costSpending").hide();
			//其他社保表格显示
			$("#socialSecurity").show();
			//新增按钮隐藏
			$(".special-btn").hide();
			//操作列表隐藏
			$("table .operation").hide();
			$("#workflowCode").val("YYF_APP_FLOW");
			sysCommon.getApproveFlowData("SZ_YYF_APP", serveExamine.processInstanceId,'{posCode:"'+ serveExamine.parCode +'"}');
		},
		/**
		 * 工会费费用
		 */
		showGongHuiFun: function() {
			$('.index-main-div').html('');
			$('.qtip-text-div').hide();
			$('.mod-div').hide();
			$('.approve-div,.else-div').show();
			sysCommon.loadingWord('view/system-sasac/expensesReim/module/reimApply/costDetail.html');
			//纳税信息
			$(".rece-msg").hide();
			//课酬费税金隐藏
			$("#doAdvanceBox").hide();
			//扣除预算总金额显示
			$("#deductBudgetDiv").show();
			//事前申请相关附件隐藏
			$(".advance-file-div").hide();
			//事前申请单
			$("#advanceApplication").hide();
			//通用表格隐藏
			$("#costSpending").hide();
			//其他社保表格显示
			$("#socialSecurity").show();
			//新增按钮隐藏
			$(".special-btn").hide();
			//操作列表隐藏
			$("table .operation").hide();
			$("#workflowCode").val("GHJF_APP_FLOW");
			sysCommon.getApproveFlowData("SZ_GHJF_APP", serveExamine.processInstanceId,'{posCode:"'+ serveExamine.parCode +'"}');
		},
		/**
		 * 建党费费用
		 */
		showDangJianFun: function() {
			$('.index-main-div').html('');
			$('.qtip-text-div').hide();
			$('.mod-div').hide();
			$('.approve-div,.else-div').show();
			sysCommon.loadingWord('view/system-sasac/expensesReim/module/reimApply/costDetail.html');
			//纳税信息
			$(".rece-msg").hide();
			//课酬费税金隐藏
			$("#doAdvanceBox").hide();
			//扣除预算总金额显示
			$("#deductBudgetDiv").show();
			//事前申请相关附件隐藏
			$(".advance-file-div").hide();
			//事前申请单
			$("#advanceApplication").hide();
			//通用表格隐藏
			$("#costSpending").hide();
			//其他社保表格显示
			$("#socialSecurity").show();
			//新增按钮隐藏
			$(".special-btn").hide();
			//操作列表隐藏
			$("table .operation").hide();
			$("#workflowCode").val("DJJF_APP_FLOW");
			sysCommon.getApproveFlowData("SZ_DJJF_APP", serveExamine.processInstanceId,'{posCode:"'+ serveExamine.parCode +'"}');
		},
		/**
		 * 往来款项
		 */
		showWithMoneyFun: function() {
			$('.index-main-div').html('');
			$('.qtip-text-div').hide();
			$('.mod-div').hide();
			$('.approve-div,.else-div').show();
			sysCommon.loadingWord('view/system-sasac/expensesReim/module/reimApply/costDetail.html');
			//纳税信息
			$(".rece-msg").hide();
			//课酬费税金隐藏
			$("#doAdvanceBox").hide();
			//扣除预算总金额显示
			$("#deductBudgetDiv").show();
			//事前申请相关附件隐藏
			$(".advance-file-div").hide();
			//事前申请单
			$("#advanceApplication").hide();
			//通用表格隐藏
			$("#costSpending").hide();
			//付款信息隐藏
			$("#payeeInformation").hide();
			//其他社保表格显示
			$("#socialSecurity").show();
			//新增按钮隐藏
			$(".special-btn").hide();
			//操作列表隐藏
			$("table .operation").hide();
			$("#workflowCode").val("WLKX_APP_FLOW");
			sysCommon.getApproveFlowData("SZ_WLKX_APP", serveExamine.processInstanceId,'{posCode:"'+ serveExamine.parCode +'"}');
		},
		//	点击取消返回审批列表页面
		clearexamine: function() {
			$("#clearBtn").off().on("click", function() {
				$yt_common.parentAction({
					url: $yt_option.parent_action_path, //父级中转地址,固定配置项,只有统一修改处理。
					funName: 'locationToMenu', //指定方法名，定位到菜单方法
					data: {
						url: 'view/system-sasac/expensesReim/module/approval/expenApplApprList.html' //要跳转的页面路径
					}
				});
			});
		},
		/**
		 * 财务支付明细新增
		 */
		financialPayment: function() {
			var me = this;
			//显示支出明细弹出框
			$('#payAddBtn').click(function() {
				//未付款金额
				var notMoney = $yt_baseElement.rmoney($('#notMoney').text());
				if(notMoney > 0) {
					//显示弹窗
					me.showCrateDetaliAlert();
					$('#lpaymentAddBtn').off().on('click', function() {
						//未付款金额
						var notMoney = $yt_baseElement.rmoney($('#notMoney').text());
						//输入的金额
						var money = $yt_baseElement.rmoney($('#createDetaTotalMoney').text());
						//填写的金额不能大于未付款金额；如果验证失败，提示“金额不能大于未付款金额”，采用失去焦点方法进行验证
						var isNull = $yt_valid.validForm($("#addObjInfo"));
						if(money > notMoney) {
							$yt_alert_Model.prompt('金额不能大于未付款金额');
						} else if(isNull) {
							$yt_alert_Model.alertOne({
								alertMsg: "确定已支付后不可修改，确定所填写的支付明细并提交吗？", //提示信息  
								confirmFunction: function() { //点击确定按钮执行方法  
									//添加到数据库方法

									//添加到列表方法
									me.appendDetaliList();
									//隐藏
									me.hideCrateDetaliAlert();
								},

							});
						}
					}).text('确定已支付');
				} else {
					//支付明细中新增金额验证，未付款金额为0时，点击新增按钮时，提示“已支付所有应付款金额”，且不弹出弹窗
					$yt_alert_Model.prompt('已支付所有应付款金额');
				}

			});

			//关闭支付明细弹窗
			$('#paymentCanelBtn').on('click', function() {
				//关闭弹框及蒙层
				$yt_baseElement.hideMongoliaLayer();
				$('#createDetali').hide();
				$('#pop-modle-alert').hide();
				serveExamine.clearAlert($('.create-detali'));
			});
		},
		/**
		 * 显示财务支付明细的弹框
		 */
		showCrateDetaliAlert: function() {
			//显示对象信息弹框及蒙层
			$yt_baseElement.showMongoliaLayer();
			$yt_alert_Model.getDivPosition($('#createDetali'));
			$('#pop-modle-alert').show();
			$('#createDetali').show();
		},
		/**
		 * 隐藏财务支付明细弹窗
		 */
		hideCrateDetaliAlert: function() {
			$yt_baseElement.hideMongoliaLayer();
			$('#createDetali').hide();
			$('#pop-modle-alert').hide();
			serveExamine.clearAlert($('.create-detali'));
			$('#createDetaTotalMoney').text('0.00');
		},
		/*支付明细数据添加到列表（数据库）方法*/
		appendDetaliList: function(tr) {
			var me = this;
			//收款方类型
			var type = $('#firstSelect option:selected').text();
			var typeVal = $('#firstSelect option:selected').val();
			//收款方
			var budgetProject = $('#budgetProject option:selected').text();
			//收款方id
			var budgetProjectCode = $('#budgetProject option:selected').val();
			//付款日期
			var payDate = $('#payDate').val();
			//现金
			var cash = $('#cash').val();
			//公务卡
			var officialCard = $('#officialCard').val();
			//转账
			var transfer = $('#transfer').val();
			//金额
			var createDetaTotalMoney = $('#createDetaTotalMoney').text();
			$.ajax({
				type: "post",
				url: "sz/payDetailBillingVoucher/savePaymentDetailInfo",
				async: true,
				data: {
					appId: serveExamine.saveData.expenditureAppId, //表单申请Id
					appType: 'EXPENDITURE_APP', //表单申请类型		 报销申请- REIM_APP		付款申请 - PAYMENT_APP
					receivablesId: budgetProjectCode, //收款方id
					receivablesType: typeVal, //收款方类型		收款方单位 - GATHERING_UNIT	   收款方个人 - GATHERING_PERSON   收款方其他 - GATHERING_OTHER
					//payDetailId:'',//支付明细Id
					paymentDate: payDate, //付款日期
					cash: cash,
					officialCard: officialCard,
					transfer: transfer,
					paymentAmount: serveExamine.rmoney(createDetaTotalMoney), //付款金额
				},
				success: function(data) {
					if(data.flag == 0) {
						var d = data.data;
						//添加成功
						var html = '<tr pid="" type="' + typeVal + '" payee="' + budgetProjectCode + '" payment="' + payDate + '" paymentmoney="' + createDetaTotalMoney + '">' +
							' <td class="payee" style="width: 100px;">' + budgetProject + '</td>' +
							' <td class="payment" style="width: 100px;">' + payDate + '</td>' +
							' <td class="cash" >' + cash + '</td>' +
							' <td class="card" >' + officialCard + '</td>' +
							' <td class="trans" >' + transfer + '</td>' +
							' <td class="paymentmoney" style="text-align: right;">' + createDetaTotalMoney + '</td></tr>';
						//隐藏
						me.hideMsgAlert();
						//清空
						me.clearAlert($('#createDetali'));
						//获取列表
						me.getPaymentAmountInfoList(serveExamine.saveData.expenditureAppId);
					}
					//添加失败
					$yt_alert_Model.prompt(data.message);

				}
			});

		},
		/**
		 * 1.1.8.5	支付明细列表
		 * @param {Object} appId
		 */
		getPaymentAmountInfoList: function(appId) {
			$.ajax({
				type: "post",
				url: "sz/payDetailBillingVoucher/getPaymentAmountInfoList",
				async: true,
				data: {
					appId: appId
				},
				success: function(data) {
					if(data.flag == 0) {
						var d = data.data;
						$('#mustMoney').text(serveExamine.fmMoney(d.totalAmount)); //totalAmount	应付款金额
						var paymentAmount = d.paymentAmount; //paymentAmount 已付款金额
						$('#alreadyMoney').text(serveExamine.fmMoney(paymentAmount));
						var paymentBalanceAmount = d.paymentBalanceAmount; //paymentBalanceAmount 未付款金额
						$('#notMoney').text(serveExamine.fmMoney(paymentBalanceAmount));
						var payDetailList = d.payDetailList || []; //payDetailList 支付明细列表
						serveExamine.setPayDetailList(payDetailList);
					}

				}
			});
		},
		/**
		 * 显示支付明细数据
		 * @param {Object} list
		 */
		setPayDetailList: function(list) {
			var html = '';
			var total = 0;
			$('.pay-detail-tabel tbody tr:not(.pay-detail-tabel-total)').remove();
			if(list && list.length > 0) {
				$.each(list, function(i, n) {
					html += '<tr pid="' + n.receivablesId + '" type="' + n.receivablesType + '" payee="' + n.receivablesId + '" payment="' + n.paymentDate + '" paymentmoney="' + n.paymentAmount + '">' +
						' <td class="payee" style="width: 100px;">' + n.receivablesName + '</td>' +
						' <td class="payment" style="width: 100px;">' + n.paymentDate + '</td>' +
						' <td class="">' + serveExamine.fmMoney(n.cash) + '</td>' +
						' <td class="">' + serveExamine.fmMoney(n.officialCard) + '</td>' +
						' <td class="">' + serveExamine.fmMoney(n.transfer) + '</td>' +
						' <td class="paymentmoney" style="text-align: right;">' + serveExamine.fmMoney(n.paymentAmount) + '</td></tr>';
					total += +n.paymentAmount;
				});
			}
			$('.pay-detail-tabel .pay-detail-tabel-total').before(html);
			$('.pay-detail-tabel .payee-other-total-money').text(serveExamine.fmMoney(total));
		},
		selectCheck: function() {
			$("#firstSelect").change(function() {
				var selvalue = $(this).val();
				//			text = $("#firstSelect option:selected").text();
				if(selvalue == 'GATHERING_UNIT') {
					//单位
					var comcod = '<option value="">请选择</option>';
					$(".payee-unit tbody tr:not(.payee-unit-total)").each(function(x, n) {
						var comtext = $(this).find(".com").text();
						var id = $(this).find(".com").attr('pid');
						comcod += "<option value='" + id + "'>" + comtext + "</option>";
					})
					$("#budgetProject").html(comcod).niceSelect();
				} else if(selvalue == 'GATHERING_PERSON') {
					//个人
					var percod = '<option value="">请选择</option>';
					$(".payee-personal tbody tr:not(.payee-personal-total)").each(function(x, n) {
						var pertext = '';
						var id = $(this).find(".per").attr('pid');
						pertext = $(this).find(".per").text();
						percod += "<option value='" + id + "'>" + pertext + "</option>";
					})
					$("#budgetProject").html(percod).niceSelect();
				} else if(selvalue == 'GATHERING_OTHER') {
					//其他
					var othcod = '<option value="">请选择</option>';
					$(".payee-other tbody tr:not(.payee-other-total)").each(function(x, n) {
						var othtext = $(this).find(".oth").text();
						var id = $(this).find(".oth").attr('pid');
						othcod += "<option value='" + id + "'>" + othtext + "</option>";
					})

					$("#budgetProject").html(othcod).niceSelect();
				}
			})
		},
		/**
		 * 2.1.8.1	保存支付明细：批量保存信息
		 * @param {Object} data
		 */
		saveLotPayDetailInfo: function(subData, thisBtn) {
			$.ajax({
				type: "post",
				url: "sz/payDetailBillingVoucher/saveLotPayDetailInfo",
				async: true,
				data: subData,
				success: function(data) {
					if(data.flag == 0) {
						serveExamine.submitReimAppInfo(subData, thisBtn);
					} else {
						thisBtn.attr('disabled', false).removeClass('btn-disabled');
					}
				}
			});
		},
		/*
		 渲染课酬费用
		 * */
		setTeacherClassExpenseDetails:function(list){
				var tBody = $('#expenseDetails tbody');
				tBody.find('tr:not(.end-tr)').remove();
				var tr = '';
				$.each(list,function(i,n){
					var rowspan = n.courseDateJson.length;
					tr='<tr teacherId="'+n.teacherId+'" class="expenseTr">'+
					'<td rowspan="'+rowspan+'"><a class="teacherName">'+n.teacherName+'</a></td>'+
					'<td>'+(n.courseDateJson.length>0?n.courseDateJson[0].courseDate:"")+'</td>'+
					'<td>'+(n.courseDateJson[0].courseName?n.courseDateJson[0].courseName:"")+'</td>'+
					'<td rowspan="'+rowspan+'" class="expenseMoney moneyText">'+$yt_baseElement.fmMoney(n.expenseMoney)+'</td>'+
					'<td rowspan="'+rowspan+'" class="surrenderPersonal moneyText">'+$yt_baseElement.fmMoney(n.surrenderPersonal)+'</td>'+
					'<td rowspan="'+rowspan+'" class="moneyText" style="height:28px"><span class="afterTax desc-text">'+$yt_baseElement.fmMoney(n.afterTax)+'</span></td>'+
					'</tr>';
					tr = $(tr).data('data',n);
					tBody.find('.end-tr').before(tr);
					$.each(n.courseDateJson, function(x,y) {
						if(x!=0){
							tr='<tr teacherId="'+n.teacherId+'">'+
								'<td>'+y.courseDate+'</td>'+
								'<td>'+(y.courseName?y.courseName:"")+'</td>'+
								'</tr>';
							tBody.find('.end-tr').before(tr);
						}
					});
					
				});
					//课酬费合计计算
					serveExamine.sumExpenseDetails();
		},
		/*
		 课酬费合计计算
		 * 
		 * */
		sumExpenseDetails:function(){
			var expenseMoney = 0;
			var surrenderPersonal = 0;
			var afterTax = 0;
			//税前
			$.each($('#expenseDetails tbody .expenseMoney:visible'),function(i,n){
				expenseMoney+= $yt_baseElement.rmoney($(n).text());
			});
			//个税
			$.each($('#expenseDetails tbody .surrenderPersonal:visible'),function(i,n){
				surrenderPersonal+= $yt_baseElement.rmoney($(n).text());
			});
			//税后
			$.each($('#expenseDetails tbody .afterTax:visible'),function(i,n){
				afterTax+= $yt_baseElement.rmoney($(n).text());
			});
			//纳税信息
			$('#payTeacherAll').text($yt_baseElement.fmMoney(surrenderPersonal));
			$('#expenseDetails tbody .costTotal-before').text($yt_baseElement.fmMoney(expenseMoney));
			$('#expenseDetails tbody .costTotal').text($yt_baseElement.fmMoney(surrenderPersonal));
			$('#expenseDetails tbody .costTotal-after').text($yt_baseElement.fmMoney(afterTax));
		},
		//显示差旅列表
		setTeacherTrainDetails:function(list){
				var tBody = $('#carFeeTable tbody');
				tBody.find('tr:not(.end-tr)').remove();
				var tr = '';
				$.each(list,function(i,n){
					n.costSum = Number(n.salesPrice) + Number(n.insurance) + Number(n.refundSigningFee);
					if(!n.bookingRecord){
						n.bookingRecord=[]
					}
					tr='<tr teacherId="'+n.teacherId+'" class="teachertravelTr">'+
					'<td>'+n.teacherName+'</td>'+
					'<td>'+n.startEndTime.split('至')[0]+'</td>'+
					'<td>'+(n.startEndTime.split('至')[1]?n.startEndTime.split('至')[1]:"")+'</td>'+
					'<td>'+n.placeDeparture+'</td>'+
					'<td>'+n.bourn+'</td>'+
					'<td>'+n.flighttrainNumber+'</td>'+
					'<td class="moneyText" style="height:28px"><span class="salesPrice desc-text">'+$yt_baseElement.fmMoney(n.salesPrice)+'</span></td>'+
					'<td class="moneyText" style="height:28px"><span class="insurance desc-text">'+$yt_baseElement.fmMoney(n.insurance)+'</span></td>'+
					'<td class="moneyText" style="height:28px"><span class="refundSigningFee desc-text">'+$yt_baseElement.fmMoney(n.refundSigningFee)+'</span></td>'+
					'<td class="costSum moneyText">'+$yt_baseElement.fmMoney(n.costSum)+'</td>'+
					'<td class="teacherStatementDetailsId" teacherStatementDetailsId="'+n.bookingRecord.map(function(x){return x.teacherStatementDetailsId}).join(",")+'">'+n.bookingRecord.map(function(x){return x.teacherStatementDetails}).join("</br>")+'</td>'+
					'<td>'+(n.warehousePositionDetails?n.warehousePositionDetails:"")+'</td>'+
					'</tr>';
					tr = $(tr).data('data',n);
					tBody.find('.end-tr').before(tr);
				});
					//课酬费合计计算
					serveExamine.sumTeacherTrainDetails();
		},
		//计算差旅费合计
		sumTeacherTrainDetails:function(){
			//票价
			var salesPrice = 0;
			//改签费
			var insurance = 0;
			//保险费
			var refundSigningFee = 0;
			//总报销费
			var costSum = 0;
			$.each($('#carFeeTable tbody .salesPrice'), function(i,n) {
				salesPrice+= $yt_baseElement.rmoney($(n).text());
			});
			$.each($('#carFeeTable tbody .insurance'), function(i,n) {
				insurance+= $yt_baseElement.rmoney($(n).text());
			});
			$.each($('#carFeeTable tbody .refundSigningFee'), function(i,n) {
				refundSigningFee+= $yt_baseElement.rmoney($(n).text());
			});
			$.each($('#carFeeTable tbody .costSum'), function(i,n) {
				costSum+= $yt_baseElement.rmoney($(n).text());
			});
			$('#carFeeTable tbody .sumSalesPrice').text($yt_baseElement.fmMoney(salesPrice));
			$('#carFeeTable tbody .sumInsurance').text($yt_baseElement.fmMoney(insurance));
			$('#carFeeTable tbody .sumRefundSigningFee').text($yt_baseElement.fmMoney(refundSigningFee));
			$('#carFeeTable tbody .costTotal').text($yt_baseElement.fmMoney(costSum));
		},
		/*
	 获取项目详情
	 * 
	 * 
	 * */
	initProjectSelect:function(projectCode,projectId){
		if(projectCode){
			$.ajax({
				type:"post",
				url:"finance/budget/lookForProjectListBudget",
				async:false,
				data:{
					projectCode:projectCode,
					projectId:projectId
				},
				beforeSend:function(){
				},
				success:function(data){
					if(data.flag==0){
						var datas = data.data[0]
						datas.projectTypeName = $yt_baseElement.setProjectTypeName(datas.projectType);
						$('.from-table-detail').setDatas(datas);
					}
				},
				error:function(){
					$yt_alert_Model.prompt('网络异常');
				}
			});
		}
	}
	};

	$(function() {
		serveExamine.init();
		serveExamine.clearexamine();
	});
})(jQuery, window);