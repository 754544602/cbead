(function($, window) {
	var serveFinal = {
		/**
		 * 开始执行
		 */
		init: function() {
			var ts = this;
			$('#flowApproveDiv').html(sysCommon.createFlowApproveMode());
			var advanceAppId = $yt_common.GetQueryString('appId');
			var fun = $yt_common.GetQueryString('fun');
			serveFinal.getReimAppInfoDetailByReimAppId(advanceAppId);
			ts.events();
			//打印按钮点击事件
			$("button.print-btn").on("click", function() {
				var pageUrl = ""; //即将跳转的页面路径
				var goPageUrl = "view/projectManagement-sasac/expensesReim/module/approval/expenApplApprList.html"; //左侧菜单指定选中的页面路径
				//打印粘贴单
//				if($(this).val() == "printBills") {
//					pageUrl = "view/projectManagement-sasac/expensesReim/module/print/InvoicePasting.html?appId=" + serveFinal.appId;
//				}
				//打印决算单
				if($(this).val() == "printExpend") {
					pageUrl = "view/projectManagement-sasac/expensesReim/module/print/finalStatement.html?finalAppId=" + advanceAppId+"&costType="+serveFinal.costType;
				}
				//打印支出凭单明细
//				if($(this).val() == "printExpendDetail") {
//					pageUrl = 'view/projectManagement-sasac/expensesReim/module/print/finalVoucherDetailed.html?finalAppId=' + serveFinal.appId+"&costType="+serveFinal.costType;
//				}
				//调用公用的打开新页面方法传输参数不需要左侧菜单
				$yt_baseElement.openNewPage(2,pageUrl);
			});
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
			$('#advanceAppNum').click(function(){
				//跳转页面路径
				var pageUrl = "view/projectManagement-sasac/expensesReim/module/beforehand/beforeApplyDetail.html?advanceId=" + $("#advanceAppNumHiddenInput").val();
				//调用公用的打开新页面方法传输参数不需要左侧菜单
				$yt_baseElement.openNewPage(2,pageUrl);
			});
			//点击支出申请单编号,跳转到事前申请详情页面
			$('#expenditureAppNum').on('click','.expenitureAppNum',function(){
				var appId = $(this).parent().find(".hidden-input-expenditureAppId").text();
				console.log(appId);
				//跳转页面路径
				var pageUrl = "view/system-sasac/expensesReim/module/reimApply/expenseDetail.html?appId=" + appId;
				//调用公用的打开新页面方法传输参数不需要左侧菜单
				$yt_baseElement.openNewPage(2,pageUrl);
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
			$('#personalPayment .model-bottom-btn .yt-cancel-btn').on('click', function() {
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
						//获取提交数据
						var d = serveFinal.getSaveData();
						serveFinal.submitReimAppInfo(d, thisBtn)
				} else {
					thisBtn.attr('disabled', false).removeClass('btn-disabled');
				}
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
					var count = serveFinal.rmoney(n.find('.row-total').text());
					//获取对应付款列表中的金额
					var money = 0;
					if(ctype == 'GATHERING_UNIT') {
						//单位
						money = serveFinal.rmoney($('table.payee-unit td[pid="' + pkId + '"]').parent().find('.unitTotal').text());
					} else if(ctype == 'GATHERING_PERSON') {
						//个人
						money = serveFinal.rmoney($('table.payee-personal td[pid="' + pkId + '"]').parent().find('.personalTotal').text());
						//个人需要减去冲销借款金额
						money = money - (serveFinal.rmoney($('table.payee-personal td[pid="' + pkId + '"]').parent().find('td').eq(3).text()));
					} else if(ctype == 'GATHERING_OTHER') {
						//其他
						money = serveFinal.rmoney($('table.payee-other td[pid="' + pkId + '"]').parent().find('.unitTotal').text());
					}
					//每个收款方的合计金额必须等于该收款方在收款方信息中的金额（收款方为个人时对比“个人冲销后补领金额”数据）校验失败时，定位到财务支付明细区域，显示提示信息“支付金额与申请金额不符”，且不能提交
					if(count != money) {
						$yt_alert_Model.prompt('支付金额与申请金额不符');
						verify = false;
						return false;
					}
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
					var verifyPayDateilDiff = serveFinal.verifyPayDateilDiff();
					if(verifyPayDateilDiff) {
						//获取提交数据
						var d = serveFinal.getSaveData();
						serveFinal.saveLotPayDetailInfo(d, thisBtn);
					} else {
						thisBtn.attr('disabled', false).removeClass('btn-disabled');
					}
				} else {
					thisBtn.attr('disabled', false).removeClass('btn-disabled');
				}
			});

		},
		//决算审批页字体样式修改
		showFinalText:function(){
			if($("#costTypeName").attr('val') == 'TRAIN_APPLY'){
				$(".item .title-model-sty .title-text").text("项目决算事项信息");
				$(".cost .title-model-sty .title-text").text("项目决算费用信息");
			}
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
		serveFinalEvent: function() {
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
				url: "sz/finalApp/getFinalAppInfoByAppId",
				async: true,
				data: {
					finalAppId: advanceAppId
				},
				success: function(data) {
					var d = data.data;
					me.saveData = d;
					//判断是否有返回的页面操作方法名称
					if(d.jsFun) {
						//存在执行相应的方法
						me[d.jsFun]();
					}
					//给事前申请单号的隐藏input赋值
					$("#advanceAppNumHiddenInput").val(d.advanceAppId);
					//给支出申请单号赋值，循环支出申请单号
					var expenditureAppNumList = "";
					$.each(d.expenditureAppNumList, function(i,n) {
						expenditureAppNumList += '<div style="display: inline-block;">'+
													'<span class="expenitureAppNum" style="color:#417095;cursor: pointer;">'+n.expenitureAppNum+'</span><span style="color:#ffffff">1</span><span style="display:none" class="hidden-input-expenditureAppId">'+n.expenditureAppId+'</span>'+
												'</div>';
					});
					$("#expenditureAppNum").append(expenditureAppNumList);
					//调用获取审批流程数据方法
					sysCommon.getApproveFlowData("SZ_FINAL_APP", d.processInstanceId);
					//数据回显
					me.showDetail(d);
					//判断当前节点
					if(d.taskKey == 'activitiEndTask') {
						//申请人填报 对应key值: activitiStartTask  工作流最后一步审批操作对应key值: activitiEndTask
						//最后一步显示财务支付相关
						//$('.pay-detail').show();
						//清除审批人的必填验证
						$('#approve-users').attr("validform", "{isNull:false,msg:'请选择审批人'}");
						$('#submitPayment').text('流程结束');
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
					} else {
						$('.pay-detail').hide();
						//修改提交按钮文本
						$('#submitPayment').text('提交');
					}
// 
					if(d.costType=='TRAIN_APPLY'){
//					$("#predictCostDiv").hide()
					$("#payTaxesDiv").show();
					}
					//禁用公务卡结算选项
					$('.check-label').off('click');
					$('.check-label input').attr('disabled', true).off('click');
					$('#applySumMoney').text(
							$yt_baseElement.fmMoney(d.finalAmount || '0'));
							
					//隐藏部门或中心可用余额
					if(data.data.validateType == "UNIT"){
						$("#deptBudgetBalanceAmount").hide();
						$("#deptBudgetBalanceAmount").prev().hide();
						$("#deptBudgetBalanceAmount").next().hide();
					}
					if(data.data.validateType == "DEPT"){
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
				$('.pay-detail-tabel .last').before('<tr class="pay-row" pkId="' + n.unitId + '" ctype="GATHERING_UNIT">' +
					'<td>' + n.unitName + '</td>' +
					'<td><input id="unitDate' + n.unitId + '" class="calendar-input pay-date" style="width: 198px;" value="" placeholder="请选择日期" type="text" readonly="readonly"></td>' +
					'<td>--</td>' +
					'<td><input class="yt-input money-input cash" placeholder="请输入" value="0.00"></td>' +
					'<td><input class="yt-input money-input offica" placeholder="请输入" value="0.00"></td>' +
					'<td><input class="yt-input money-input trans" placeholder="请输入" value="' + (serveFinal.fmMoney(n.amount)) + '"></td>' +
					'<td class="row-total">' + (serveFinal.fmMoney(n.amount)) + '</td>' +
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
				$('.pay-detail-tabel .last').before('<tr class="pay-row" pkId="' + n.personalId + '" ctype="GATHERING_PERSON">' +
					'<td>' + n.personalName + '</td>' +
					'<td><input id="personalDate' + n.personalId + '" class="calendar-input pay-date" style="width: 198px;" value="" placeholder="请选择日期" type="text" readonly="readonly"></td>' +
					'<td class="write" style="text-align:right;padding-right:5px;">' + serveFinal.fmMoney(n.writeOffAmount) + '</td>' +
					'<td><input class="yt-input money-input cash" placeholder="请输入" value="' + (serveFinal.fmMoney(n.cash)) + '"></td>' +
					'<td><input class="yt-input money-input offica" placeholder="请输入" value="' + (serveFinal.fmMoney(n.officialCard)) + '"></td>' +
					'<td><input class="yt-input money-input trans" placeholder="请输入" value="' + (serveFinal.fmMoney(n.transfer)) + '"></td>' +
					'<td class="row-total">' + (serveFinal.fmMoney(Number(n.cash) + Number(n.officialCard) + Number(n.transfer))) + '</td>' +
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
				$('.pay-detail-tabel .last').before('<tr class="pay-row" pkId="' + n.otherId + '" ctype="GATHERING_OTHER">' +
					'<td>' + n.otherName + '</td>' +
					'<td><input id="otherDate' + n.otherId + '" class="calendar-input pay-date" style="width: 198px;" value="" placeholder="请选择日期" type="text" readonly="readonly"></td>' +
					'<td>--</td>' +
					'<td><input class="yt-input money-input cash" placeholder="请输入" value="0.00"></td>' +
					'<td><input class="yt-input money-input offica" placeholder="请输入" value="0.00"></td>' +
					'<td><input class="yt-input money-input trans" placeholder="请输入" value="' + (serveFinal.fmMoney(n.amount)) + '"></td>' +
					'<td class="row-total">' + (serveFinal.fmMoney(n.amount)) + '</td>' +
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
				total += serveFinal.rmoney($(this).text());
			});
			$('.pay-detail-tabel .last .total-money').text(serveFinal.fmMoney(total));
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
				parameters: '', //parameters	JSON格式字符串, 
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

			$('#finalAppReason').text(d.finalAppReason); //reimAppName	决算事由
			$('#specialName').text(d.specialName || '--');
			$('#advanceAppNum').text(d.advanceAppNum || '--'); //advanceAppNum	事前申请编号
			//$('#expenditureAppNum').text(d.expenditureAppNum || '--'); //expenditureAppNum	支出申请编号
			$('#costTypeName').text(d.costTypeName).attr('val', d.costType); //单据样式
			//培训费提示文字
			if(d.costType == "TRAIN_APPLY") {
				$("#noContain").show();
			} else {
				$("#noContain").hide();
			}
			$('#formNum').text(d.finalAppNum);

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
//				$('.advance-relevance').show();
//				$('#advanceAppBalance').text(d.paymentBalanceAmount ? (fMoney(d.paymentBalanceAmount) + '元') : '--');
			}
			//项目名称存在时 显示项目名称
			var specialValArr=d.specialCode.split('-');
			if(specialValArr[0]=='395'){//所属预算项目为项目支出
				$('.prj-name-tr').show(); //显示所属项目
				$('#prjName').text(d.prjName); //prjName	项目名称
			}else{
				$('.prj-name-tr').hide();//隐藏所属项目
			}
			
			$('#reimAppNum').val(d.reimAppNum); //reimAppNum	报销单号
			$('#formNum').text(d.reimAppNum).attr('val', d.reimAppNum);

			$('#budgetBalanceAmount').text(d.budgetBalanceAmount ? fMoney(d.budgetBalanceAmount) + '万元' : '--'); //budgetBalanceAmount	预算剩余额度
			$('#deptBudgetBalanceAmount').text(d.deptBudgetBalanceAmount ? fMoney(d.deptBudgetBalanceAmount<0?"0":d.deptBudgetBalanceAmount) + '万元' : '--');
			//invoiceNum	发票张数
			$('#invoiceNum').text(d.invoiceNum);
			$('#mustMoney').text(fMoney(d.totalAmount || '0'));
			//totalAmount	报销总金额
			$('#totalAmount').text(fMoney(d.expenditureTotal || '0')).attr('num', d.expenditureTotal);
			$('#amountTotalMoney').text(fMoney(d.totalAmount || '0')).attr('num', d.totalAmount);
			$('#paymentList .total-money').text(fMoney(d.totalAmount || '0')).attr('num', d.totalAmount);
			//大写金额
			$('#totalMoneyUpper').text(arabiaToChinese(d.expenditureTotal + '' || '0'));
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

			me.getTotleMoney();
			//项目决算设置字体样式
			me.showFinalText();
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
			$('#paymentList tbody .total-money').text(serveFinal.fmMoney(fmTotal));

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
			//师资-培训信息json
			me.setTrainApplyInfoList(data.trainApplyInfoList);
			//师资-课酬费
			me.setTeacherClassExpenseDetails(data.expenseClassDetails);
			//师资-差旅费
			me.setTeacherTrainDetails(data.expenseDetails);
			//costTrainApplyInfoList	师资-培训费json
			me.setCostTrainApplyInfoList(data.costTrainApplyInfoList);
			//计算税费信息
			var fundsTotalNum = 0;
			var afterNum = 0;
			//差旅费与培训费其他费用
			var aft = $('#carFeeTable,#trainingFeeTable').find('.costTotal');
			//课酬费
			var aftt = $('#expenseDetails').find('.costTotal-after');
			aft.each(function() {
				afterNum += $yt_baseElement.rmoney($(this).text() || '0');
			});
			aftt.each(function() {
				afterNum += $yt_baseElement.rmoney($(this).text() || '0');
			});
			$('#applyTotalMoney').text($yt_baseElement.fmMoney(afterNum || '0')).attr('num', afterNum);
			var costTotal = $yt_baseElement.rmoney($("#expenseDetails .costTotal").text());
			var costTotalAfter = $yt_baseElement.rmoney($("#expenseDetails .costTotal-after").text());
			var taxAmount = Number(costTotal);
			//课酬相关税金
			$("#taxAmount").text($yt_baseElement.fmMoney(taxAmount || '0')).attr('num', taxAmount);
			$("#payTeacherAll").text($yt_baseElement.fmMoney(taxAmount || '0')).attr('num', taxAmount);
			//中文
			var sumMoneyLower = arabiaToChinese(afterNum || '0');
			$("#TotalMoneyUpper,.total-money-up").text(sumMoneyLower);

		},
		setCostCarfareList: function(data) {
			//costCarfareList	城市间交通费
			var fMoney = $yt_baseElement.fmMoney;
			var costCarfareList = data.costCarfareList;
			var carHtml = '';
			//结算方式复选框
			var costCarfareClose = $('#traffic-list-info').next().find('.check-label input');
			if(costCarfareList != 0) {
				$.each(costCarfareList, function(i, n) {
					carHtml += '<tr>' +
						'<td><span>' + n.travelPersonnelName + '</span><input type="hidden" data-val="travelPersonnel" class="hid-traf-users" value="' + n.travelPersonnel + '"/>' +
						'</td><td>' + n.travelPersonnelsDept + '</td>' +
						'<td data-text="goTime">' + n.goTime + '</td><td><input data-val="goAddress" type="hidden" value="' + n.goAddress + '"><span data-text="goAddressName">' + n.goAddressName + '</span></td><td data-text="arrivalTime">' + n.arrivalTime + '</td>' +
						'<td><input data-val="arrivalAddress" type="hidden" value="' + n.arrivalAddress + '"> <span data-text="arrivalAddressName">' + n.arrivalAddressName + '</span></td>' +
						'<td><span data-text="vehicle">' + n.vehicleName + '</span><input type="hidden" class="hid-vehicle" value="' + n.vehicle + '"/><input type="hidden" class="hid-child-code" value=""/></td>' +
						'<td class="font-right money-td" data-text="crafare">' + (n.crafare == "" ? "--" : fMoney(n.crafare || '0')) + '</td>' +
						'<td class="text-overflow-sty" data-text="remarks" title="' + n.remarks + '">' + (n.remarks || "") + '</td>' +
						'<td style="display:none;">' +
						'<input type="hidden" class="hid-cost-type" value="0"/>' +
						'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>' +
						'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>' +
						'</td></tr>';
					//结算方式复选框存在并且有选中的值时
					if(costCarfareClose.length > 0 && n.setMethod) {
						//设置选中
						costCarfareClose.setCheckBoxState('check');
					}
				});
				carHtml += '<tr class="total-last-tr">' +
					'<td><span class="tab-font-blod">合计</span></td><td></td><td></td><td></td><td></td><td></td>' +
					'<td></td>' +
					'<td class="font-right"><span class="tab-font-blod money-sum">0.00</span></td>' +
					'<td></td></tr>';
				$('#traffic-list-info tbody').html(carHtml);
				//调用合计方法
				sysCommon.updateMoneySum(0);
			} else {
				$('#traffic-list-info').hide();
				$('.traffic-title').hide();
			}

		},
		setCostHotelList: function(data) {
			//costHotelList	住宿费
			var fMoney = $yt_baseElement.fmMoney;
			var costHotelList = data.costHotelList;
			var hotelHtml = '';
			//结算方式复选框
			var costHotelClose = $('#hotel-list-info').next().find('.check-label input');

			if(costHotelList != 0) {
				$.each(costHotelList, function(i, n) {
					var avg = n.hotelDays > 0 ? fMoney((+n.hotelExpense / +n.hotelDays) || '0') : n.hotelExpense;
					hotelHtml += '<tr>' +
						'<td><span>' + n.travelPersonnelName + '</span><input type="hidden" data-val="travelPersonnel" value="' + n.travelpersonnel + '"/></td><td>' + n.travelPersonnelsJobLevelName + '</td>' +
						/*'<td data-text="hotelTime">' + $("#hotelDate").val() + '</td>' +*/
						'<td class="font-right">' + avg + '</td>' +
						'<td risk-code-val="hotelCheckInDate" class="check-in-date"><span class="sdate">' + n.hotelTime + '</span></td>' +
						'<td class="leave-date"><span class="edate">' + n.leaveTime + '</span></td>' +
						'<td data-text="hotelDays">' + n.hotelDays + '</td><td class="font-right money-td" data-text="hotelExpense">' + fMoney(n.hotelExpense || '0') + '</td>' +
						'<td><span data-text="hotelAddressName">' + n.hotelAddressName + '</span><input type="hidden" data-val="hotelAddress" value="' + n.hotelAddress + '"</td>' +
						'<td class="text-overflow-sty" data-text="remarks" title="' + n.remarks + '">' + (n.remarks || "") + '</td>' +
						'<td style="display:none;">' +
						'<input type="hidden" class="hid-set-met" data-val="setMethod"/>' +
						'<input type="hidden" class="hid-cost-type" value="1"/>' +
						'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>' +
						'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>' +
						'</td></tr>';
					//结算方式复选框存在并且有选中的值时
					if(costHotelClose.length > 0 && n.setMethod) {
						//设置选中
						costHotelClose.setCheckBoxState('check');
					}
				});
				hotelHtml += '<tr class="total-last-tr">' +
					'<td><span class="tab-font-blod">合计</span></td><td></td><td></td><td></td><td></td><td></td>' +
					'<td class="font-right"><span class="tab-font-blod money-sum">0.00</span></td>' +
					'<td></td><td></td></tr>';
				$('#hotel-list-info tbody').html(hotelHtml);
				//调用合计方法
				sysCommon.updateMoneySum(1);
			} else {
				$('#hotel-list-info').hide();
				$('.accommodation-title').hide();
			}

		},
		setCostOtherList: function(data) {
			//costOtherList	其他费用
			var fMoney = $yt_baseElement.fmMoney;
			var costOtherList = data.costOtherList;
			var otherHtml = '';
			//结算方式复选框
			var costOtherClose = $('#other-list-info').next().find('.check-label input');

			if(costOtherList != 0) {
				$.each(costOtherList, function(i, n) {
					otherHtml += '<tr>' +
						'<td><span>' + n.costTypeName + '</span><input type="hidden" data-val="costType" value="' + n.costType + '"/></td>' +
						'<td class="font-right money-td" data-text="reimAmount">' + fMoney(n.reimAmount || '0') + '</td>' +
						'<td class="text-overflow-sty" data-text="remarks" title="' + n.remarks + '">' + (n.remarks || "") + '</td>' +
						'</tr>';
					//结算方式复选框存在并且有选中的值时
					if(costOtherClose.length > 0 && n.setMethod) {
						//设置选中
						costOtherClose.setCheckBoxState('check');
					}
				});
				otherHtml += '<tr class="total-last-tr">' +
					'<td><span class="tab-font-blod">合计</span></td>' +
					'<td class="font-right"><span class="tab-font-blod money-sum">0.00</span></td>' +
					'<td></td></tr>';
				$('#other-list-info tbody').html(otherHtml);
				//调用合计方法
				sysCommon.updateMoneySum(2);
			} else {
				$('#other-list-info').hide();
				$('.other-title').hide();
			}

		},
		setCostSubsidyList: function(data) {
			//costSubsidyList	补助明细
			var fMoney = $yt_baseElement.fmMoney;
			var costSubsidyList = data.costSubsidyList;
			var subHtml = '';
			var totalFood = 0;
			var totalTraffic = 0;

			if(costSubsidyList != 0) {
				$.each(costSubsidyList, function(i, n) {
					subHtml += '<tr class="' + n.travelPersonnel + '" code="' + n.travelPersonnel + '"><td><div class="user" code="' + n.travelPersonnel + '">' + n.travelPersonnelName + '</div></td><td><div class="lv">' + n.travelPersonnelsDept + '</div></td><td><div class="subsidy-num">' + n.subsidyDays + '</div></td><td><div style="text-align:right;" class="food">' + fMoney(n.subsidyFoodAmount || '0') + '</div></td><td><div  style="text-align:right;" class="traffic">' + fMoney(n.carfare || '0') + '</div></td></tr>';
					totalFood += +n.subsidyFoodAmount;
					totalTraffic += +n.carfare;
				});
				subHtml += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + fMoney(totalFood || '0') + '</td><td class="total-traffic"  style="text-align:right;">' + fMoney(totalTraffic || '0') + '</td></tr>';
				$('#subsidy-list-info tbody').html(subHtml);
			} else {
				$('#subsidy-list-info').hide();
				$('.subsidy-title').hide();
			}

		},
		/**
		 * teacherApplyInfoList	师资-讲师信息json
		 * 设置 师资讲师信息列表数据
		 * @param {Object} list
		 */
		setTeacherApplyInfoList: function(list) {
			var html = '';
			$.each(list, function(i, n) {
				html += '<tr>' +
					'<td class="lecturerName"><input type="hidden" class="lectureId" value="' + n.lecturerId + '"><span>' + n.lecturerName + '</span></td>' +
					'<td class="professional">' + (n.lecturerTitleName || '--') + '</td>' +
					'<td class="level">' + n.lecturerLevelName + '</td>' +
					'<td style="display:none"><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td></tr>';
			});
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveFinal.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveFinal.fmMoney(totalTraffic) + '</td></tr>';
			$('#lecturerTable tbody').html(html);
		},
		/**
		 * setCostPredictInfoList	收入费用信息json
		 * 设置 收入费用信息列表数据
		 * @param {Object} list
		 */
		setCostPredictInfoList: function(list) {
			var html = '';
			var costTotal = 0;
			var costTotalAfter=0;
			$.each(list, function(i, n) {
				html += '<tr  pid=""><td class="cost-name">' + n.predictName + '</td><td class="moneyText predict-standard-money">' + $yt_baseElement.fmMoney(n.predictStandardMoney) + '</td><td class="predict-people-num">' + n.predictPeopleNum + '</td><td class="moneyText predict-smallplan-money">' + $yt_baseElement.fmMoney(n.averageMoney) + '</td><td class="special-instruct">' + n.remark + '</td></tr>';
				costTotal += n.predictStandardMoney*n.predictPeopleNum;
				costTotalAfter+=n.averageMoney;
			});
			html += '<tr class="last"><td>合计</td><td></td><td></td><td class="moneyText costTotal">' + $yt_baseElement.fmMoney(costTotalAfter) + '</td><td></td></tr>';
			$('#predictCostTable tbody').html(html);
	$("#preTaxAllMoney").text($yt_baseElement.fmMoney(costTotal));
	$("#afterTaxAllMoney").text($yt_baseElement.fmMoney(costTotalAfter));
			if(list.length == 0) {
				$('.train-money').hide();
				$('.train-money').parent().hide();
				$('#predictCostTable,.other-title-train').hide();
			}
		},
		/**
		 * costTrainApplyInfoList	师资-培训费json
		 * 设置 师资培训费列表数据
		 * @param {Object} list
		 */
		setCostTrainApplyInfoList: function(list) {
			var html = '';
			var total = 0;
			$.each(list, function(i, n) {
				html += '<tr>' +
					'<td>' + n.trainTypeName + '</td>' +
					'<td class="moneyText">' + $yt_baseElement.fmMoney(n.standard) + '</td>' +
					'<td>' + n.trainOfNum + '</td>' +
					'<td class="moneyText">' + $yt_baseElement.fmMoney(n.averageMoney) + '</td>' +
					'<td>' + (n.remark || "") + '</td>' +
					'</tr>';
				total += +n.averageMoney;
			});
			html += '<tr class="last"><td>合计</td><td></td><td></td><td class="moneyText costTotal">' + $yt_baseElement.fmMoney(total) + '</td><td></td></tr>';
			$('#trainingFeeTable tbody').html(html);
			if(list.length == 0) {
				$('.train-money').hide();
				$('.train-money').parent().hide();
				$('#trainingFeeTable,.other-title-train').hide();
			}
		},
		/**
		 * costTeachersFoodApplyInfoList	师资-伙食费json
		 * 设置 师资伙食费列表
		 * @param {Object} list
		 */
		setCostTeachersFoodApplyInfoList: function(list) {
			var html = '';
			var total = 0;
			if(list != 0) {
				$.each(list, function(i, n) {
					html += '<tr pid="' + n.foodId + '">' +
						'<td><input type="hidden" class="lectureId" value="' + n.lecturerId + '">' + n.lecturerName + '</td>' +
						'<td class="avg moneyText">' + serveFinal.fmMoney(n.averageMoney) + '</td>' +
						'<td class="day">' + n.foodOfDays + '</td>' +
						'<td class="moneyText sum-pay">' + serveFinal.fmMoney(n.foodAmount) + '</td>' +
						'<td style="text-align: center !important;" class="dec">' + (n.remarks || "") + '</td>' +
						'<td style="display:none"><input type="hidden" class="popM" value="4"/>' +
						'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
						'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
						'</tr>';
					total += +n.foodAmount;
				});
				//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveFinal.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveFinal.fmMoney(totalTraffic) + '</td></tr>';
				$('#dietFeeTable tbody .end-tr').before(html);
				$('#dietFeeTable tbody .costTotal').text(serveFinal.fmMoney(total));
			} else {
				$('#dietFeeTable').hide();
				$('.food-title').hide();
			}
		},
		/**
		 * //costTeachersLectureApplyInfoList	师资-讲课费json
		 * 设置 师资讲课费列表
		 * @param {Object} list
		 */
		setCostTeachersLectureApplyInfoList: function(list) {
			var html = '';
			var total = 0;
			var totalAfter = 0;
			if(list != 0) {
				$.each(list, function(i, n) {
					html += '<tr pid="' + n.teachersLectureId + '">' +
						'<td class="uname"><input type="hidden" class="lectureId" value="' + n.lecturerId + '">' + n.lecturerName + '</td>' +
						'<td class="holder">' + n.lecturerTitleName + '</td>' +
						'<td class="hour">' + n.teachingHours + '</td>' +
						'<td class="cname">' + (n.courseName || '--') + '</td>' +
						'<td class="moneyText sum-pay">' + serveFinal.fmMoney(n.perTaxAmount) + '</td>' +
						'<td class="moneyText after">' + serveFinal.fmMoney(n.afterTaxAmount) + '</td>' +
						'<td class="moneyText avg">' + serveFinal.fmMoney(n.averageMoney) + '</td>' +
						'<td style="display:none"><input type="hidden" class="popM" value="1"/>' +
						'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
						'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
						'</td></tr>';
					total += +n.perTaxAmount;
					totalAfter += +n.afterTaxAmount;
				});
				//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveFinal.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveFinal.fmMoney(totalTraffic) + '</td></tr>';
				$('#lectureFeeTable tbody .end-tr').before(html);
				$('#lectureFeeTable tbody .costTotal').text(serveFinal.fmMoney(total));
				$('#lectureFeeTable tbody .costTotal-after').text(serveFinal.fmMoney(totalAfter));
			} else {
				$('#lectureFeeTable').hide();
				$('.lecture-title').hide();
			}
		},
		/**
		 * //costTeachersTravelApplyInfoList	师资-城市间交通费json
		 * 设置 师资城市间交通费列表
		 * @param {Object} list
		 */
		setCostTeachersTravelApplyInfoList: function(list) {
			var html = '';
			var total = 0;
			if(list != 0) {
				$.each(list, function(i, n) {
					html += '<tr pid="' + n.teachersTravelId + '">' +
						'<td class="uname"><input type="hidden" class="lectureId" value="' + n.lecturerId + '">' + n.lecturerName + '</td>' +
						'<td class="ulv">' + n.lecturerLevelName + '</td>' +
						'<td class="sdate">' + n.goTime + '</td>' +
						'<td class="edate">' + n.arrivalTime + '</td>' +
						'<td class="sadd"><input type="hidden" class="scode" value="' + n.goAddress + '">' + n.goAddressName + '</td>' +
						'<td class="eadd"><input type="hidden" class="ecode" value="' + n.arrivalAddress + '">' + n.arrivalAddressName + '</td>' +
						'<td class="tname"><input type="hidden" class="tool" value="' + n.vehicle + '">' + n.vehicleName + '</td>' +
						'<td class="moneyText sum-pay">' + serveFinal.fmMoney(n.carfare) + '</td>' +
						'<td style="text-align: center !important;" class="dec">' + (n.remarks || "") + '</td>' +
						'<td  style="display:none"><input type="hidden" class="popM" value="2"/>' +
						'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
						'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
						'</td></tr>';
					total += +n.carfare;
				});
				//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveFinal.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveFinal.fmMoney(totalTraffic) + '</td></tr>';
				$('#carFeeTable tbody .end-tr').before(html);
				$('#carFeeTable tbody .costTotal').text(serveFinal.fmMoney(total));
			} else {
				$('#carFeeTable').hide();
				$('.traffic-title').hide();
			}
		},
		/**
		 * //costTeachersHotelApplyInfoList	师资-住宿费 json
		 * 设置 师资住宿费列表
		 * @param {Object} list
		 */
		setCostTeachersHotelApplyInfoList: function(list) {
			var html = '';
			var total = 0;
			if(list != 0) {
				$.each(list, function(i, n) {
					html += '<tr pid="' + n.teachersHotelId + '">' +
						'<td class="name"><input type="hidden" class="lectureId" value="' + n.lecturerId + '">' + n.lecturerName + '</td>' +
						'<td class="sdate">' + n.startTime + '</td>' +
						'<td class="edate">' + n.endTime + '</td>' +
						'<td class="moneyText avg">' + serveFinal.fmMoney(n.averageMoney) + '</td>' +
						'<td class="day">' + n.hotelDays + '</td>' +
						'<td class="moneyText sum-pay">' + serveFinal.fmMoney(n.hotelExpense) + '</td>' +
						'<td style="text-align: center !important;" class="dec">' + (n.remarks || "") + '</td>' +
						'<td style="display:none"><input type="hidden" class="popM" value="3"/>' +
						'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
						'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
						'</td></tr>';
					total += +n.hotelExpense;
				});
				//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveFinal.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveFinal.fmMoney(totalTraffic) + '</td></tr>';
				$('#hotelFeeTable tbody .end-tr').before(html);
				$('#hotelFeeTable tbody .costTotal').text(serveFinal.fmMoney(total));
			} else {
				$('#hotelFeeTable').hide();
				$('.accommodation-title').hide();
			}
		},
		/**
		 * //costNormalList	普通报销-费用明细/普通付款-付款明细 json
		 * 设置普通报销列表数据
		 * @param {Object} list
		 */
		setCostNormalList: function(list) {
			var html = '';
			var total = 0;
			$.each(list, function(i, n) {
				html += '<tr>' +
					'<td style="text-align:left;" class="reimContent">' + n.normalName + '</td>' +
					'<td style="text-align: right;" class="reimAmount">' + ($yt_baseElement.fmMoney(n.normalAmount)) + '</td>' +
					'<td class="remarks">' + (n.remarks || '') + '</td>' +
					'</tr>';
				total += +n.normalAmount;
			});
			$('.ordinary-approval #costList tbody .last').before(html);
			$('.ordinary-approval #costList tbody #reimAmountlSum').text($yt_baseElement.fmMoney(total));
		},
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
		setMeetingList: function(list) {
			if(list.length > 0) {
				//会议分类
				$("#meetTypeName").text(list[0].meetTypeName);
				//会议名称
				$("#meetName").text(list[0].meetName);
				//会议地点中文
				$("#meetAddress").text(list[0].meetAddress);
				//会议开始时间
				$("#meetStartTime").text(list[0].meetStartTime);
				//会议结束时间	
				$("#meetEndTime").text(list[0].meetEndTime);
				//会期
				$("#meetDays").text(list[0].meetDays);
				//参会人数
				$("#meetOfNum").text(list[0].meetOfNum);
				//工作人员数量
				$("#meetWorkerNum").text(list[0].meetWorkerNum);
			}
		},
		setMeetingCostList: function(list) {
			if(list.length > 0) {
				$("#meetHotel").text($yt_baseElement.fmMoney((list[0].meetHotel || 0))); //住宿费
				$("#meetFood").text($yt_baseElement.fmMoney((list[0].meetFood || 0))); //伙食费
				$("#meetOther").text($yt_baseElement.fmMoney((list[0].meetOther || 0))); //其他费用
				$("#meetAmount").text($yt_baseElement.fmMoney((list[0].meetAmount || 0))); //费用合计	
				$("#meetAverage").text($yt_baseElement.fmMoney((list[0].meetAverage || 0))); //人均日均费用金额
			} else {
				//住宿费
				$("#meetHotel").text('--');
				//伙食费
				$("#meetFood").text('--');
				//其他费用
				$("#meetOther").text('--');
				//费用合计
				$("#meetAmount").text('--');
				//人均日均费用金额
				$("#meetAverage").text('--');
			}

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
					html += '<tr class="payee-unit-tr">' +
						'<td class="com" value="Company" pid="' + n.unitId + '">' + n.unitName + '</td>' +
						'<td>' + (n.reverseTheWayName || '--') + '</td>' +
						'<td style="text-align: right;" class="unitTotal">' + ($yt_baseElement.fmMoney(n.amount)) + '</td>' +
						'<td>' + n.openBank + '</td>' +
						'<td>' + n.accounts + '</td>' +
						'<td value="1">' + (n.isContract == 1 ? '有' : '无') + '</td>' +
						'<td>' + (n.remarks || '无') + '</td>' +
						'</tr>';
					total += +n.amount;
				});
				//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveFunds.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveFunds.fmMoney(totalTraffic) + '</td></tr>';
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
					html += '<tr class="payee-personal-tr" pkid="" payeeval="' + n.personalCode + '" payeename="' + n.personalName + '" pedepartment="' + n.personalDept + '" perank="' + n.personalJobLevelName + '" personaltotal="' + n.amount + '" witeoffpersonal="' + n.reverseTheWay + '" personalwriteoff="' + n.replaceAmount + '" cash="' + n.cash + '" officialcard="' + n.officialCard + '" transferaccounts="' + n.transfer + '" payeeradio="' + n.isContract + '" personalspecial="' + n.remarks + '" idcarkno="' + n.idCard + '" payeebank="' + n.accounts + '" bankname="' + n.openBank + '" phonenum="' + n.phoneNum + '" choiceloan="' + n.loanAppNum + '" choiceloanval="' + n.loanAppId + '" arrearsmoney="' + n.loanAppArrearsAmount + '" thereversemoney="' + n.writeOffAmount + '" offOpenBank="' + n.offOpenBank + '" offAccounts="' + n.offAccounts + '"><td class="per" value="personal" pid="' + n.personalId + '">' + n.personalName + '</td><td style="text-align: right;" class="personalTotal">' + serveFinal.fmMoney(n.amount) + '</td><td>' + (n.reverseTheWayName ? n.reverseTheWayName : '无') + '</td><td style="text-align: right;">' + (serveFinal.fmMoney(n.writeOffAmount)) + '</td><td style="text-align: right;">' + (serveFinal.fmMoney(n.replaceAmount)) + '</td><td style="text-align: right;">' + (serveFinal.fmMoney(n.cash)) + '</td><td style="text-align: right;">' + (serveFinal.fmMoney(n.officialCard)) + '</td><td style="text-align: right;">' + (serveFinal.fmMoney(n.transfer)) + '</td><td><a class="yt-link to-data">详情</a></td><td>' + (n.isContract == 1 ? '有' : '无') + '</td><td>' + (n.remarks || '无') + '</td></tr>';
					total += +n.amount;
				});
				//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveFunds.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveFunds.fmMoney(totalTraffic) + '</td></tr>';
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
				$.each(list.gatheringOtherList, function(i, n) {
					html += '<tr class="payee-unit-tr">' +
						'<td class="oth" pid="' + n.otherId + '">' + n.otherName + '</td>' +
						'<td>' + n.reverseTheWayName + '</td>' +
						'<td style="text-align: right;" class="unitTotal">' + ($yt_baseElement.fmMoney(n.amount)) + '</td>' +
						'<td value="1">' + (n.isContract == 1 ? '有' : '无') + '</td>' +
						'<td>' + (n.remarks || '无') + '</td>' +
						'</tr>';
					total += +n.amount;
				});
				//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveFunds.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveFunds.fmMoney(totalTraffic) + '</td></tr>';
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
				url: "sz/finalApp/submitWorkFlow",
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
								url: 'view/projectManagement-sasac/expensesReim/module/approval/finalApproval.html' //要跳转的页面路径
							}
						});
						//流程结束跳转至支出单打印
						/*if(flowEnd) {
							var urlStr = '';
							//判断单据类型
							if(subData.costType == 'TRAVEL_APPLY') {
								//差旅费
								urlStr = 'view/system-sasac/expensesReim/module/print/printTravelExpenses.html?finalAppId=' + subData.appId + '&processInstanceId=' + subData.processInstanceId;
							} else {
								//支出表单
								urlStr = 'view/system-sasac/expensesReim/module/print/printSpendingForm.html??finalAppId=' + subData.appId + '&processInstanceId=' + subData.processInstanceId;
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
			var me = this;
			var data = me.saveData;
			return {
				appId: data.finalAppId, //appId 表单申请id
				parameters: '', //parameters JSON格式字符串,
				dealingWithPeople: $('#approve-users option:selected').val(), //dealingWithPeople 下一步操作人code
				opintion: $('#opintion').val(), //opintion 审批意见
				processInstanceId: data.processInstanceId, //processInstanceId 流程实例ID,
				nextCode: $('#operate-flow option:selected').val(), //nextCode 操作流程代码
				appType: 'FINAL_APP',
				payDetailList: me.getPayDetailList()
			};
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
					writeOffAmount: serveFinal.rmoney(n.find('.write').text()),
					cash: serveFinal.rmoney(n.find('.cash').val()), //cash 现金
					officialCard: serveFinal.rmoney(n.find('.offica').val()), //officialCard 公务卡
					transfer: serveFinal.rmoney(n.find('.trans').val()), //transfer 转账
					paymentDate: n.find('.pay-date').val(), //paymentDate.付款日期
					paymentAmount: serveFinal.rmoney(n.find('.row-total').text()), //paymentAmount 付款金额
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
			//修改学员人数名称
			$("#actual").text("实际学员人数: ");
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

		},
		//	点击取消返回审批列表页面
		clearexamine: function() {
			$("#clearBtn").off().on("click", function() {
				$yt_common.parentAction({
					url: $yt_option.parent_action_path, //父级中转地址,固定配置项,只有统一修改处理。
					funName: 'locationToMenu', //指定方法名，定位到菜单方法
					data: {
						url: 'view/projectManagement-sasac/expensesReim/module/approval/finalApproval.html' //要跳转的页面路径
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
				serveFinal.clearAlert($('.create-detali'));
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
			serveFinal.clearAlert($('.create-detali'));
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
					appId: serveFinal.saveData.finalAppId, //表单申请Id
					appType: 'FINAL_APP', //表单申请类型		 报销申请- REIM_APP		付款申请 - PAYMENT_APP
					receivablesId: budgetProjectCode, //收款方id
					receivablesType: typeVal, //收款方类型		收款方单位 - GATHERING_UNIT	   收款方个人 - GATHERING_PERSON   收款方其他 - GATHERING_OTHER
					//payDetailId:'',//支付明细Id
					paymentDate: payDate, //付款日期
					cash: cash,
					officialCard: officialCard,
					transfer: transfer,
					paymentAmount: serveFinal.rmoney(createDetaTotalMoney), //付款金额
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
						me.getPaymentAmountInfoList(serveFinal.saveData.finalAppId);
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
						$('#mustMoney').text(serveFinal.fmMoney(d.totalAmount)); //totalAmount	应付款金额
						var paymentAmount = d.paymentAmount; //paymentAmount 已付款金额
						$('#alreadyMoney').text(serveFinal.fmMoney(paymentAmount));
						var paymentBalanceAmount = d.paymentBalanceAmount; //paymentBalanceAmount 未付款金额
						$('#notMoney').text(serveFinal.fmMoney(paymentBalanceAmount));
						var payDetailList = d.payDetailList || []; //payDetailList 支付明细列表
						serveFinal.setPayDetailList(payDetailList);
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
						' <td class="">' + serveFinal.fmMoney(n.cash) + '</td>' +
						' <td class="">' + serveFinal.fmMoney(n.officialCard) + '</td>' +
						' <td class="">' + serveFinal.fmMoney(n.transfer) + '</td>' +
						' <td class="paymentmoney" style="text-align: right;">' + serveFinal.fmMoney(n.paymentAmount) + '</td></tr>';
					total += +n.paymentAmount;
				});
			}
			$('.pay-detail-tabel .pay-detail-tabel-total').before(html);
			$('.pay-detail-tabel .payee-other-total-money').text(serveFinal.fmMoney(total));
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
						serveFinal.submitReimAppInfo(subData, thisBtn);
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
					serveFinal.sumExpenseDetails();
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
			$.each($('#expenseDetails tbody .expenseMoney'),function(i,n){
				expenseMoney+= $yt_baseElement.rmoney($(n).text());
			});
			//个税
			$.each($('#expenseDetails tbody .surrenderPersonal'),function(i,n){
				surrenderPersonal+= $yt_baseElement.rmoney($(n).text());
			});
			//税后
			$.each($('#expenseDetails tbody .afterTax'),function(i,n){
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
					serveFinal.sumTeacherTrainDetails();
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
		serveFinal.init();
		serveFinal.clearexamine();
	});
})(jQuery, window);