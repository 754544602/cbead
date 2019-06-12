var paymentApply = {
	/**
	 * 本地暂存数据//ordinar-name paydet-money
	 */
	saveData: {
		payAppId: '', //lpayAppId	付款申请表id
		paymentAppNum: '', //paymentAppNum	付款单号
		specialCode: '', //specialCode	所属专项code
		applicantUser: '', //applicantUser	申请人
		processInstanceId: '' //processInstanceId	流程实例ID, 
	},
	/**
	 * 附加事件处理
	 */
	events: function() {
		var me = this;
		//费用类型切换
		$('#getvalue').change(function() {
			var fun = $(this).find('option:selected').attr('fun');
			if(fun) {
				me[fun]();
			} else {
				//清空区域代码
				$('.index-main-div').html('');
				//隐藏提示文字
				$('.qtip-text-div').show();
				//隐藏无关区域
				$('.mod-div,.dottom-div,.grod-div').hide();
			}
		});

		//附件删除
		$('#attIdStr').on('click', '.del-file', function() {
			var ithis = $(this);
			var parent = ithis.parent();
			$yt_alert_Model.alertOne({
				alertMsg: "数据删除将无法恢复,确认删除吗?",
				confirmFunction: function() {
					parent.remove();
				},
			});
		});
		//页面取消按钮事件
		$("#cancelBtn").off().on('click', function() {
			window.history.back(-1);
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

		//公务接待费 接待对象
		//me.msgListEvent();
		//公务接待费 费用明细
		//me.paymentListEvent();
	},
	/**
	 * 重写金额转换方法
	 * @param {Object} str
	 */
	fmMoney: function(str) {
		return $yt_baseElement.fmMoney(str || '0');
	},
	/**
	 * 重写金额还原方法
	 */
	rmoney: function(str) {
		return $yt_baseElement.rmoney(str || '0');
	},
	start: function() {
		$('#applyDate').calendar({
			speed: 0,
			nowData: false
		});
	},
	//	//付款相关附件
	payeeAppenddix: function() {
		//上传附件
		$(".file-up-div").off().on('change', '.cont-file', function(obj) {
			var fileElementId = this.id;
			var ithisParent = $('#attIdStr');
			var url = $yt_option.base_path + "/fileUpDownload/upload?ajax=1&modelCode=REIM_APP";
			var imgUlr = '';
			$.ajaxFileUpload({
				url: url,
				type: "post",
				dataType: 'json',
				fileElementId: fileElementId,
				success: function(data, textStatus) {
					if(data.flag == 0) {
						/*var attaElement = $('<div id="' + data.data.pkId + '" class="file-lable">' +
							'<span class="file-name">' + data.data.fileName + '</span>' +
							'<img class="file-del" src="../../../resources-sasac/images/module/projects/file-del.png" />' +
							'</div>');*/
						//imgUlr = $yt_option.base_path + 'fileUpDownload/download?prjId=' + data.data.pkId + '&isDownload=false';
						var attaElement = $('<div fId="' + data.data.pkId + '" class="li-div"><span>' + data.data.naming + '</span><span class="del-file">x</span></div>');
						ithisParent.append(attaElement);
					} else {
						$yt_alert_Model.prompt(data.message);
					}
				},
				error: function(data, status, e) {
					$yt_alert_Model.prompt(data.message);
				}
			});

		});

	},
	//事前申请审批单
	beforehandApply: function() {
		//弹出框显示
		$('.prior-approval').click(function() {
			//获取数据
			paymentApply.getPriorApprovalList();
			//显示弹框及蒙层
			$yt_baseElement.showMongoliaLayer();
			$yt_alert_Model.getDivPosition($('.prior-alert'));
			$('#pop-modle-alert').show();
			$('.prior-alert').show();
		});
		//弹出框点击查询
		$('#query').click(function() {
			//获取数据
			paymentApply.getPriorApprovalList();
		});
		//弹出框点击重置
		$('#approvalReset').click(function() {
			//清空搜索输入框
			$('#askinput').val('');
			//获取数据
			paymentApply.getPriorApprovalList();
		});

	},
	/**
	 * 获取事前审批单列表
	 */
	getPriorApprovalList: function() {
		//表格区域
		var tbody = $('table.special-list tbody');
		var queryParams = $('#askinput').val();
		//费用类型
		var costType = $('#getvalue option:selected').val();
		//分页区域
		var pageDiv = $('.prior-page');
		$('.prior-page').pageInfo({
			pageIndex: 1,
			pageNum: 5, //每页显示条数  
			pageSize: 3, //显示...的规律  
			url: "sz/advanceApp/getAdvanceAppListToPageByParams", //ajax访问路径  
			objName: 'data',
			data: {
				queryParams: queryParams,
				costType: costType
			},
			success: function(data) {
				tbody.empty();
				if(data.flag == 0) {
					var trStr = "";
					if(data.data.rows.length > 0) {
						//显示分页
						pageDiv.show();
						$.each(data.data.rows, function(i, n) {
							trStr += '<tr pid="' + n.advanceAppId + '" code="' + n.advanceAppNum + '" amount="' + n.advanceAmount + '">' +
								'<td>' + n.advanceAppNum + '<input type="hidden" class="balance" value="' + n.advanceAppBalance + '" /></td>' +
								'<td>' + n.applicantUserName + '</td>' +
								'<td>' + n.applicantUserDeptName + '</td>' +
								'<td>' + n.advanceAppName + '</td>' +
								'<td>' + n.advanceCostTypeName + '</td>' +
								'<td>' + n.applicantTime + '</td>' +
								/*'<td class="sname">XX专项</td>' +*/
								'</tr>';
						});
						tbody.append(trStr);
					} else {
						//隐藏分页
						pageDiv.hide();
						var noTr = '<tr class="model-no-data-tr"><td colspan="7"><div class="no-data"><img src="../../../../../resources-sasac/images/common/no-data.png" alt=""></div></td></tr>';
						tbody.append(noTr);
					}
				}
			} //回调函数 匿名函数返回查询结果  
		});
	},
	//事前审批单弹窗确定事件
	befAlertok: function() {
		//确定事件
		$('.prior-common').click(function() {
			var activeTr = $('.special-list .yt-table-active');
			//事前申请单号
			var code = activeTr.attr('code');
			//专项名称
			var codeName = activeTr.find('.sname').text();
			//可用余额
			var balance = activeTr.find('.balance').val();
			//事前申请id
			var id = activeTr.attr('pid');

			if(code) {
				//paymentApply.saveData.advanceAppId = code;
				//获取事前申请信息
				paymentApply.saveData.advanceAppId = id;
				paymentApply.getAdvanceAppInfoDetailByAdvanceAppId(id);

				$('#advanceAppBalance').text(balance ? $yt_baseElement.fmMoney(balance) + '元' : '--');
				$('.prior-approval').val(code);
				$('.special-name').val(codeName);
				//隐藏弹框及蒙层
				$yt_baseElement.hideMongoliaLayer();
				$('.prior-alert').hide();
				$('#pop-modle-alert').hide();
				//成功后显示导入按钮
				$('.index-main-div .export-but').show();
				//事前审批单可用余额字段显示
				$('.advance-relevance').show();

			} else {
				$yt_alert_Model.prompt('请选择一条数据');
			}
		});
	},
	/**
	 * 显示新增付款明细弹出框
	 */
	showGeneralAlert: function() {
		//获取弹框对象
		var alert = $('.general-alert');
		//显示弹框及蒙层
		$yt_baseElement.showMongoliaLayer();
		$yt_alert_Model.getDivPosition(alert);
		$('#pop-modle-alert').show();
		alert.show();
	},
	befAlertclear: function() {
		//取消事件
		$('.prior-cancel').click(function() {
			//隐藏弹框及蒙层
			$yt_baseElement.hideMongoliaLayer();
			$('.prior-alert').hide();
			$('#pop-modle-alert').hide();
			paymentApply.clearAlert($(".prior-alert"));
		});
	},
	//所属专项名称
	specialApply: function() {
		//弹出框显示
		$('.special-name').click(function() {
			//显示弹框及蒙层
			/*$yt_baseElement.showMongoliaLayer();
			$yt_alert_Model.getDivPosition($('.pecial-name-window'));
			$('#pop-modle-alert').show();
			$('.pecial-name-window').show();*/
			//获取数据
			paymentApply.getPriorApprovalList();
			//显示弹框及蒙层
			$yt_baseElement.showMongoliaLayer();
			$yt_alert_Model.getDivPosition($('.prior-alert'));
			$('#pop-modle-alert').show();
			$('.prior-alert').show();
		});
	},
	specialAlertok: function() {
		//确定事件
		$('.pecial-common').click(function() {
			var code = $('.special-list .yt-table-active').attr('code');
			var codeName = $('.special-list .yt-table-active').find('td').eq(1).text();
			var codeMon = $('.special-list .yt-table-active').find('td').eq(2).text();
			if(code) {
				$('#codeMon').text(codeMon);
				$('.special-name').val(codeName);
				//隐藏弹框及蒙层
				$yt_baseElement.hideMongoliaLayer();
				$('.pecial-name-window').hide();
				$('#pop-modle-alert').hide();
			} else {
				$yt_alert_Model.prompt('请选择一条数据');
			}
		});
	},
	specialAlertclear: function() {
		//取消事件
		$('.pecial-cancel').click(function() {
			//隐藏弹框及蒙层
			$yt_baseElement.hideMongoliaLayer();
			$('.pecial-name-window').hide();
			$('#pop-modle-alert').hide();
			paymentApply.clearAlert($(".pecial-name-window"));
		});
	},

	whetherSpecial: function() {
		//是否为专项切换
		$('.special-type').change(function() {
			//				var getvalue = $('#getvalue option:selected').text();
			var val = $(this).val();

			var yesno = '';
			if(val == '2') {
				$('.special-yes').hide();
				$('.special-no').hide();
				//获取费用类型
				var name = $('#getvalue option:selected').text();
				//替换余额字段内容
				$('.special-label').text(name + '余额：');
				var yesno = '否';
			} else {
				$('.special-yes').show();
				var priorAppr = $(".prior-approval").val();
				if(priorAppr) {
					$('.special-no').hide();
				} else {
					$('.special-no').hide();
				}
				var yesno = '是';
			}
		});
	},
	//下拉框传值点击事件
	selectCost: function() {
		$('#getvalue').on('change', function() {
			//获取费用类型
			var name = $('#getvalue option:selected').text();
			//替换余额字段内容
			$('.special-label').text(name + '余额：');
		});

	},
	delPayment: function() {
		//删除付款明细
		$('#paymentDetailedTable').on('click', '.operate-del', function() {
			var ithis = $(this);
			var tr = ithis.parents('tr');
			$yt_alert_Model.alertOne({
				alertMsg: "数据删除将无法恢复,确认删除吗?", //提示信息  
				confirmFunction: function() { //点击确定按钮执行方法  
					tr.remove();
					paymentApply.paymentTotal();
				}
			});

		});
	},
	delCompany: function() {
		//删除单位
		$('.payee-unit').on('click', '.operate-del', function() {
			var ithis = $(this);
			var tr = ithis.parents('tr');
			$yt_alert_Model.alertOne({
				alertMsg: "数据删除将无法恢复,确认删除吗?", //提示信息  
				confirmFunction: function() { //点击确定按钮执行方法  
					tr.remove();
					paymentApply.companyTotal();
				}
			});
		});
	},
	delPersonal: function() {
		//删除个人
		$('.payee-personal').on('click', '.operate-del', function() {
			var ithis = $(this);
			var tr = ithis.parents('tr');
			$yt_alert_Model.alertOne({
				alertMsg: "数据删除将无法恢复,确认删除吗?", //提示信息  
				confirmFunction: function() { //点击确定按钮执行方法  
					tr.remove();
					paymentApply.personalTotal();
				}
			});
		});
	},
	delOther: function() {
		//删除其他
		$('.payee-other').on('click', '.operate-del', function() {
			var ithis = $(this);
			var tr = ithis.parents('tr');
			$yt_alert_Model.alertOne({
				alertMsg: "数据删除将无法恢复,确认删除吗?", //提示信息  
				confirmFunction: function() { //点击确定按钮执行方法  
					tr.remove();
					paymentApply.otherTotal();
				}
			});
		});
	},
	//	弹出关闭收款方弹窗方法
	alertClearReceivables: function() {

		$('#addExpense').click(function() {
			var code = 'company';

			$(".receipt-alert .cost-type-tab ul li").removeClass("tab-check");
			$('.receipt-alert .cost-type-tab ul li[code="' + code + '"]').addClass('tab-check');
			$('.receipt-alert .tab-info').hide();
			$('.model-content[code="' + code + '"]').parent().show();

			//显示弹框及蒙层
			$yt_baseElement.showMongoliaLayer();
			$yt_alert_Model.getDivPosition($('#cost-apply-model'));
			$('#pop-modle-alert').show();
			$('#cost-apply-model').show();
			$('#appendPaymentInfo').off().on('click', function() {
				//编辑方法
				paymentApply.raceAddList();
			}).text('保存');

		});
		//		});
		//关闭弹出框表单
		$("#model-canel-btn").click(function() {
			//调用关闭可编辑弹出框方法
			sysCommon.closeModel($("#cost-apply-model"));
			//调用公共用的清空表单数据方法
			paymentApply.clearAlert($(".model-content"));
		});
		//		TAB切换方法
		$(".receipt-alert .cost-type-tab li").click(function() {
			$(this).addClass("tab-check").siblings().removeClass("tab-check");
			var tabIndex = $(this).index();
			$(".receipt-alert .tab-info").hide().eq(tabIndex).show();
			$yt_alert_Model.getDivPosition($('#cost-apply-model'));
		});
	},

	//	收款方添加数据方法
	raceAddList: function(tr) {

		//			var code = $('ul li.chcke').ATTR('code');
		//			var form = $('.model-content[code="' + code + '"]');
		//			var sss = form.find();
		//			$('table[code="' + code + '"]');
		var code = $('.receipt-alert ul li.tab-check').attr('code');
		var form = $('.model-content[code="' + code + '"]');

		var is = $yt_valid.validForm(form);
		if(is) {
			//获取对单位的输入框内的信息
			var companyName = form.find('#companyName').val();
			var witeOffCompany = form.find('#witeOffCompany option:selected').text();
			var openBank = form.find('#openBank').val();
			var accountNumber = form.find('#accountNumber').val();
			var companyMoney = form.find('#companyMoney').val();
			var contractRadio = form.find('.check .contractRadio').val();
			var contractRadioText = '';
			if(contractRadio == 1) {
				contractRadioText = '有'
			} else {
				contractRadioText = '无'
			}
			var companySpecial = form.find('#companySpecial').val();
			//获取对个人输入框内的信息
			var payeeName = form.find('#payeeName option:selected').text();
			var payeeVal = form.find('#payeeName option:selected').val();
			var personalTotal = form.find('#personalTotal').val();
			var witeOffPersonal = form.find("#witeOffPersonal option:selected").text();
			var personalWriteoff = form.find('.personal-writeoff-money').text();
			var cash = form.find('#cash').val();
			var officialCard = form.find('#officialCard').val();
			var transferAccounts = form.find('#transferAccounts').val();
			var payeeRadio = form.find('.check .payeeRadio').val();
			var payeeRadioText = '';
			if(payeeRadio == 1) {
				payeeRadioText = '有'
			} else {
				payeeRadioText = '无'
			}
			var personalSpecial = form.find('#personalSpecial').val();
			var idCarkno = form.find('#idCarkno').val();
			var payeeBank = form.find('#payeeBank').val();
			var bankName = form.find('#bankName').val();
			var phoneNum = form.find('#phoneNum').val();
			//获取对其他输入框内的信息
			var otherMoney = form.find('#otherMoney').val();
			var witeOffOther = form.find('#witeOffOther option:selected').text();
			var otherAllMoney = form.find('#otherAllMoney').val();
			var otherRadio = form.find('.check .otherRadio').val();
			var otherRadioText = '';
			if(otherRadio == 1) {
				otherRadioText = '有';
			} else {
				otherRadioText = '无';
			}
			var otherSpecial = form.find('#otherSpecial').val();

			var trHtml = '';

			//获取列表中的已有金额
			var receMoney = paymentApply.getReceMsgMoney();
			//计算填写后的金额
			var totalReceMoney = receMoney + paymentApply.rmoney(companyMoney) + paymentApply.rmoney(otherAllMoney);
			//付款总金额
			var sumMoney = paymentApply.rmoney($('#applySumMoney').text());
			//验证收款金额与付款总金额
			if(totalReceMoney <= sumMoney) {

				switch(code) {
					case 'company':
						trHtml = '<tr class="payee-unit-tr" witeOffCompany="'+ witeOffCompany +'" companyName="' + companyName + '" openBank="' + openBank + '" accountNumber="' + accountNumber + '" companyMoney="' + companyMoney + '" contractRadio="' + contractRadio + '" companySpecial="' + companySpecial + '">' +
							'<td class="com" value="Company">' + companyName + '</td>' +
							'<td>' + witeOffCompany + '</td>' +
							'<td style="text-align: right;" class="unitTotal">' + ($yt_baseElement.fmMoney(companyMoney)) + '</td>' +
							'<td>' + openBank + '</td>' +
							'<td>' + accountNumber + '</td>' +
							'<td value="' + contractRadio + '">' + contractRadioText + '</td>' +
							'<td>' + companySpecial + '</td>' +
							'<td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
							'</tr>';
						if(tr) {
							tr.replaceWith(trHtml);
						} else {
							$('.rece-msg table[code="' + code + '"] tbody .payee-unit-total').before(trHtml);
						}
						//					获取合计
						paymentApply.companyTotal();
						break;
					case 'personal':
						trHtml = '<tr class="payee-personal-tr" payeeVal="'+ payeeVal +'" payeeName="' + payeeName + '" personalTotal="' + personalTotal + '" witeOffPersonal="' + witeOffPersonal + '" personalWriteoff="' + personalWriteoff + '" cash="' + cash + '" officialCard="' + officialCard + '" transferAccounts="' + transferAccounts + '" payeeRadio="' + payeeRadio + '" personalSpecial="' + personalSpecial + '" idCarkno="' + idCarkno + '" payeeBank="' + payeeBank + '" bankName="' + bankName + '" phoneNum="' + phoneNum + '">' +
							'<td class="per" value="personal">' + payeeName + '</td>' +
							'<td style="text-align: right;" class="personalTotal">' + ($yt_baseElement.fmMoney(personalTotal)) + '</td>' +
							'<td>' + witeOffPersonal + '</td>' +
							'<td style="text-align: right;">' + personalWriteoff + '</td>' +
							'<td style="text-align: right;">' + cash + '</td>' +
							'<td style="text-align: right;">' + officialCard + '</td>' +
							'<td style="text-align: right;">' + transferAccounts + '</td>' +
							'<td><a class="yt-link">详情</a></td>' +
							'<td>' + payeeRadioText + '</td>' +
							'<td>' + personalSpecial + '</td>' +
							'<td>' +
							'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>' +
							'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>' +
							'</td></tr>';
						if(tr) {
							tr.replaceWith(trHtml);
						} else {
							$('.rece-msg table[code="' + code + '"] tbody .payee-personal-total').before(trHtml);
						}
						//					获取合计
						paymentApply.personalTotal();
						break;
					case 'other':
						trHtml = '<tr class="payee-other-tr" witeOffOther="'+ witeOffOther +'" otherMoney="' + otherMoney + '" otherAllMoney="' + otherAllMoney + '" otherRadio="' + otherRadio + '" otherSpecial="' + otherSpecial + '">' +
							'<td class="oth" value="Other">' + otherMoney + '</td>' +
							'<td>' + witeOffOther + '</td>' +
							'<td style="text-align: right;" class="otherTotal">' + ($yt_baseElement.fmMoney(otherAllMoney)) + '</td>' +
							'<td>' + otherRadioText + '</td>' +
							'<td>' + otherSpecial + '</td>' +
							'<td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
							'</tr>';
						if(tr) {
							tr.replaceWith(trHtml);
						} else {
							$('.rece-msg table[code="' + code + '"] tbody .payee-other-total').before(trHtml);
						}
						//					获取合计
						paymentApply.otherTotal();
						break;
					default:
						break;
				}
				//			$(form).html(trHtml);
				//			trHtml = $(trHtml);
				//调用关闭可编辑弹出框方法
				paymentApply.clearAlterTable();

				$yt_baseElement.tableRowActive();
			} else {
				$yt_alert_Model.prompt('金额不能大于申请付款总金额');
			}

		}
	},
	alertReceivables: function() {
		$("#appendPaymentInfo").click(function() {
			//			debugger
			paymentApply.raceAddList();
			//隐藏
			//					me.hidetallyAlert();
		});
	},
	//修改收款方为单位
	updataPersonal: function() {
		$(".payee-unit tbody").on("click", ".operate-update", function() {
			var ithis = $(this);
			var tr = ithis.parents('tr');
			var table = ithis.parents('table');
			var code = table.attr('code');

			$(".receipt-alert .cost-type-tab ul li").removeClass("tab-check");
			$('.receipt-alert .cost-type-tab ul li[code="' + code + '"]').addClass('tab-check');
			$('.receipt-alert .tab-info').hide();
			$('.model-content[code="' + code + '"]').parent().show();

			//显示弹框及蒙层
			$yt_baseElement.showMongoliaLayer();
			$yt_alert_Model.getDivPosition($('#cost-apply-model'));
			$('#pop-modle-alert').show();
			$('#cost-apply-model').show();

			//将表格赋值给修改的输入框
			//冲销
			$('#witeOffCompany').val(tr.attr('witeOffCompany'));
			//单位全称
			$('#companyName').val(tr.attr('companyName'));
			//开户银行
			$('#openBank').val(tr.attr('openBank'));
			//账号
			$('#accountNumber').val(tr.attr('accountNumber'));
			//金额
			$('#companyMoney').val(tr.attr('companyMoney'));
			//有无合同协议
			var contractRadio = tr.attr('contractRadio');
			$('.companyCheck .check-label input[value="' + contractRadio + '"]').setRadioState('check');
			//特殊说明
			$('#companySpecial').val(tr.attr('companySpecial'));
			//弹窗方法
			paymentApply.alertClearReceivables();
			$('#appendPaymentInfo').off().on('click', function() {
				//编辑方法
				paymentApply.raceAddList(tr);
			}).text('确定');
		})
	},
	//修改收款方为个人
	updataReceivables: function() {
		$(".payee-personal tbody").on("click", ".operate-update", function() {
			$("#appendPaymentInfo").text('确定');
			var ithis = $(this);
			var tr = ithis.parents('tr');
			var table = ithis.parents('table');
			var code = table.attr('code');

			$(".receipt-alert .cost-type-tab ul li").removeClass("tab-check");
			$('.receipt-alert .cost-type-tab ul li[code="' + code + '"]').addClass('tab-check');
			$('.receipt-alert .tab-info').hide();
			$('.model-content[code="' + code + '"]').parent().show();
			//显示弹框及蒙层
			$yt_baseElement.showMongoliaLayer();
			$yt_alert_Model.getDivPosition($('#cost-apply-model'));
			$('#pop-modle-alert').show();
			$('#cost-apply-model').show();

			//将表格赋值给修改的输入框
			//收款人姓名
			paymentApply.getPayeeNameList(tr.attr('payeeVal'));
			//个人应收款总金额（元）
			$('#personalTotal').val(tr.attr('personalTotal'));
			//冲销方式
			$('#witeOffPersonal').val(tr.attr('witeOffPersonal'));
			//个人冲销后补领金额（元）
			$('.personal-writeoff-money').val(tr.attr('personalWriteoff'));
			//收款方式：现金（元
			$('#cash').val(tr.attr('cash'));
			//收款方式：公务卡（元）
			$('#officialCard').val(tr.attr('officialCard'));
			//收款方式：转账（元）
			$('#transferAccounts').val(tr.attr('transferAccounts'));
			//身份证号码
			$('#idCarkno').val(tr.attr('idCarkno'));
			//银行卡号
			$('#payeeBank').val(tr.attr('payeeBank'));
			//开户银行名称
			$('#bankName').val(tr.attr('bankName'));
			//移动电话
			$('#phoneNum').val(tr.attr('phoneNum'));
			//有无合同协议
			var payeeRadio = tr.attr('payeeRadio');
			$('.personalCheck .check-label input[value="' + payeeRadio + '"]').setRadioState('check');
			//特殊说明
			$('#personalSpecial').val(tr.attr('personalSpecial'));
			//弹窗方法
			paymentApply.alertClearReceivables();
			$('#appendPaymentInfo').off().on('click', function() {
				//编辑方法
				paymentApply.raceAddList(tr);
			});
		})
	},
	//修改收款方为其他
	updataOther: function() {
		$(".payee-other tbody").on("click", ".operate-update", function() {
			//充值摁钮的文字
			$("#appendPaymentInfo").text('确定');
			var ithis = $(this);
			var tr = ithis.parents('tr');
			var table = ithis.parents('table');
			var code = table.attr('code');

			$(".receipt-alert .cost-type-tab ul li").removeClass("tab-check");
			$('.receipt-alert .cost-type-tab ul li[code="' + code + '"]').addClass('tab-check');
			$('.receipt-alert .tab-info').hide();
			$('.model-content[code="' + code + '"]').parent().show();
			//显示弹框及蒙层
			$yt_baseElement.showMongoliaLayer();
			$yt_alert_Model.getDivPosition($('#cost-apply-model'));
			$('#pop-modle-alert').show();
			$('#cost-apply-model').show();

			//将表格赋值给修改的输入框
			//其他付款
			$('#otherMoney').val(tr.attr('otherMoney'));
			//冲销
			$('#witeOffOther').val(tr.attr('witeOffOther'));
			//金额
			$('#otherAllMoney').val(tr.attr('otherAllMoney'));
			//有无合同协议
			var otherRadio = tr.attr('otherRadio');
			$('.otherCheck .check-label input[value="' + otherRadio + '"]').setRadioState('check');
			//特殊说明
			$('#otherSpecial').val(tr.attr('otherSpecial'));
			//弹窗方法
			paymentApply.alertClearReceivables();
			$('#appendPaymentInfo').off().on('click', function() {
				//编辑方法
				paymentApply.raceAddList(tr);
			}).text('确定');
		})
	},
	clearAlterTable: function() {
		//关闭弹出框表单
		//调用关闭可编辑弹出框方法
		sysCommon.closeModel($("#cost-apply-model"));
		//调用公共用的清空表单数据方法
		paymentApply.clearAlert($(".model-content"));
	},
	/**
	 * 新增修改付款明细弹窗
	 * @param {Object} tr
	 */
	appendGeneralList: function(tr) {
		var me = this;
		//款项用途
		var MoneyUse = $('#MoneyUse').val();
		//金额
		var addMoney = $('#addMoney').val();

		if(MoneyUse && addMoney) {
			//转换格式
			var num = $yt_baseElement.rmoney(addMoney);
			var html = '<tr MoneyUse="' + MoneyUse + '" num="' + num + '"  class=""> <td class="" style="text-align: left;">' + MoneyUse + '</td> <td class="paydet-money" style="text-align: right;" class="">' + ($yt_baseElement.fmMoney(addMoney)) + '</td> <td> <span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span> <span class="operate-del" style=""><img src="../../../../../resources-sasac/images/common/del-icon.png"></span> </td> </tr>';

			if(tr) {
				//已经存在的进行替换
				tr.replaceWith(html);
			} else {
				//追加
				$('#paymentDetailedTable tbody .pay-detail-tabel-total').before(html);
			}
			//计算合计
			paymentApply.paymentTotal();
			//隐藏弹框
			me.hideGeneralAlert();
			//清空表单
			me.clearAlert($('.general-alert'));

		} else {
			$yt_alert_Model.prompt('请填写完整数据');
		}

	},
	//付款明细合计
	paymentTotal: function() {
		//获取所有的金额
		var tds = $('#paymentDetailedTable tbody .paydet-money');
		var total = 0;
		//计算合计金额
		$.each(tds, function(i, n) {
			total += $yt_baseElement.rmoney($(n).text());
		});
		var fmTotal = $yt_baseElement.fmMoney(total);
		//申请付款总额
		$('#applySumMoney').text(fmTotal);
		//大写转换
		$('#applyMoneyLower').text(arabiaToChinese(fmTotal));
		//赋值合计金额
		$yt_baseElement.fmMoney($('#paymentDetailedTable tbody .total-money').text(fmTotal));
	},
	//单位合计
	companyTotal: function() {
		//获取所有的金额
		var tds = $('.payee-unit tbody .unitTotal');
		var total = 0;
		//计算合计金额
		$.each(tds, function(i, n) {
			total += $yt_baseElement.rmoney($(n).text());
		});
		var fmTotal = $yt_baseElement.fmMoney(total);
		//赋值合计金额
		$yt_baseElement.fmMoney($('.payee-unit tbody .payee-unit-money').text(fmTotal));
	},
	//个人合计
	personalTotal: function() {
		//获取所有的金额
		var tds = $('.payee-personal tbody .personalTotal');
		var total = 0;
		//计算合计金额
		$.each(tds, function(i, n) {
			total += $yt_baseElement.rmoney($(n).text());
		});
		var fmTotal = $yt_baseElement.fmMoney(total);
		//赋值合计金额
//		$yt_baseElement.fmMoney($('.payee-personal tbody .payee-personal-money').text(fmTotal));
	},
	//其他合计
	otherTotal: function() {
		//获取所有的金额
		var tds = $('.payee-other tbody .otherTotal');
		var total = 0;
		//计算合计金额
		$.each(tds, function(i, n) {
			total += $yt_baseElement.rmoney($(n).text());
		});
		var fmTotal = $yt_baseElement.fmMoney(total);
		//赋值合计金额
		$yt_baseElement.fmMoney($('.payee-other tbody .payee-other-total-money').text(fmTotal));
	},
	/**
	 * 新增付款隐藏弹窗
	 */
	addListEvent: function() {
		var me = this;
		//新增按钮
		$('#addPayment').click(function() {
			//显示弹框
			me.showGeneralAlert();
			//重置按钮
			$('.general-common').off().on('click', function() {
				me.appendGeneralList();
			}).text('添加到列表');
		});
		//取消
		$('.general-cancel').click(function() {
			//隐藏
			me.hideGeneralAlert();
			//清空
			me.clearAlert($('.general-alert'));
		});

		//编辑
		$('#paymentDetailedTable').on('click', '.operate-update', function() {
			var ithis = $(this);
			var tr = ithis.parents('tr');
			//数据回显
			//款项用途
			var cont = $('#MoneyUse').val(tr.attr('MoneyUse'));
			//金额
			var sum = $('#addMoney').val(tr.attr('num'));
			//显示弹框
			me.showGeneralAlert();
			//重置按钮
			$('.general-common').off().on('click', function() {
				me.appendGeneralList(tr);
			}).text('确定');
		});

	},
	/**
	 * 隐藏新增修改付款明细弹出框
	 */
	hideGeneralAlert: function() {
		//隐藏弹框及蒙层
		$yt_baseElement.hideMongoliaLayer();
		$('.general-alert').hide();
		$('#pop-modle-alert').hide();
	},
	//	重置摁钮方法
	resetBtn: function() {
		$('#special-resetting').click(function() {
			paymentApply.clearAlert($(".pecial-name-window"));
		});
		$('#approval-resetting').click(function() {
			paymentApply.clearAlert($(".prior-alert"));
		});
	},
	/**
	 * 清空表单内数据
	 * @param {Object} obj
	 */
	clearAlert: function(obj) {
		//		//取得所有select
		//		var selects = obj.find('select');
		//		//循环重置
		//		$.each(selects, function(i, n) {
		//			$(n).find('option:first-child').attr('selected', true);
		//		});
		//		selects.niceSelect();
		//输入框
		var inputs = obj.find('input:not(.notClearRadio)');
		var textbig = obj.find('textarea');
		var valid = obj.find('.valid-font');
		$('.general-alert input').removeClass('valid-hint');
		$('.model-content input').removeClass('valid-hint')
		valid.text('');
		inputs.val('');
		textbig.val('');
		$('#contractRadio-yes').setRadioState('check');
		$('#payeeRadio-yes').setRadioState('check');
		$('#otherRadio-yes').setRadioState('check');
		//取得所有select
		var selects = obj.find('select');
		//循环重置
		$.each(selects, function(i, n) {
			$(n).find('option:first-child').attr('selected', true);
		});
		selects.niceSelect();
	},
	//	金额格式化
	moneyFormat: function() {
		/** 
		 * 金额文本框获取焦点事件 
		 */
		$("#companyMoney,#payeeMoney,#otherAllMoney,#addMoney,#personalTotal,#cash,#officialCard,#transferAccounts").on("focus", function() {
			if($(this).val() != "") {
				//调用还原格式化的方法  
				$(this).val($yt_baseElement.rmoney($(this).val()));
			}
		});
		/** 
		 * 金额文本框失去焦点事件 
		 */
		$("#companyMoney,#payeeMoney,#otherAllMoney,#addMoney,#personalTotal,#cash,#officialCard,#transferAccounts").on("blur", function() {
			if($(this).val() != "") {
				//调用格式化金额方法  
				$(this).val($yt_baseElement.fmMoney($(this).val()));
			}
		});
	},
	//	点击提交生成并验证
	submitPayment: function() {
		$('#submitPayment').off().on("click", function() {
			var thisBtn = $(this);
			$(this).attr('disabled', true).addClass('btn-disabled');
			var validFlag = $yt_valid.validForm($('.base-info-form-modle,.payee-appenddix'));
			if(validFlag) {
				//获取列表中的已有金额
				var receMoney = paymentApply.getReceMsgMoney();
				//付款总金额
				var sumMoney = paymentApply.rmoney($('#applySumMoney').text());
				if(receMoney > sumMoney) {
					//显示提示
					$('.rece-msg-text').show();
				} else {
					$('.rece-msg-text').hide();
					//获取提交的数据
					var data = paymentApply.getSubData();
					//调用提交接口
					paymentApply.submitPaymentAppInfo(data, thisBtn);
				}

			} else {
				//调用滚动条显示在错误信息位置方法
				sysCommon.pageToScroll($(".ordinary-div .valid-font"));
				$(this).attr('disabled', false).removeClass('btn-disabled');
			}
		})
	},
	//	点击保存生成并验证
	savePayment: function() {
		$('#savePayment').off().on("click", function() {
			//			var validFlag = $yt_valid.validForm('.base-info-form-modle,payee-appenddix');
			//			if(validFlag) {
			var thisBtn = $(this);
			$(this).attr('disabled', true).addClass('btn-disabled');
			//获取提交的数据
			var data = paymentApply.getSubData();
			//调用提交接口
			paymentApply.savePayAppInfoToDrafts(data, thisBtn);
		})
	},
	/**
	 * 1.1.5.1	付款申请信息：提交表单数据
	 * @param {Object} subData
	 */
	submitPaymentAppInfo: function(subData, thisBtn) {
		$.ajax({
			type: 'post',
			url: 'sz/payApp/submitPaymentAppInfo',
			data: subData,
			success: function(data) {
				if(data.flag == 0) {
					//提交成功跳转列表页面
					$yt_common.parentAction({
						url: $yt_option.parent_action_path, //父级中转地址,固定配置项,只有统一修改处理。
						funName: 'locationToMenu', //指定方法名，定位到菜单方法
						data: {
							url: 'view/system-sasac/expensesReim/module/approval/myApplyList.html' //要跳转的页面路径
						}
					});
				};
				$yt_alert_Model.prompt(data.message);
				thisBtn.attr('disabled', false).removeClass('btn-disabled');
			}
		});
	},
	/**
	 * 1.1.5.1	付款申请信息：保存至草稿箱
	 * @param {Object} subData
	 */
	savePayAppInfoToDrafts: function(subData, thisBtn) {
		$.ajax({
			type: 'post',
			url: 'sz/payApp/savePayAppInfoToDrafts',
			data: subData,
			success: function(data) {
				if(data.flag == 0) {
					//提交成功跳转列表页面
					//提交成功跳转列表页面
					$yt_common.parentAction({
						url: $yt_option.parent_action_path, //父级中转地址,固定配置项,只有统一修改处理。
						funName: 'locationToMenu', //指定方法名，定位到菜单方法
						data: {
							url: 'view/system-sasac/expensesReim/module/approval/draftsList.html' //要跳转的页面路径
						}
					});
				}
				$yt_alert_Model.prompt(data.message);
				$(this).attr('disabled', false).removeClass('btn-disabled');
			}
		});
	},
	/**
	 * 1.1.5.4	根据付款申请Id获取付款申请详细信息
	 * @param {Object} payAppId
	 */
	getPayAppInfoByPayAppId: function(payAppId) {
		var me = this;
		$.ajax({
			type: "post",
			url: "sz/payApp/getPayAppInfoByPayAppId",
			async: true,
			data: {
				payAppId: payAppId
			},
			success: function(data) {
				if(data.flag == 0) {
					var d = data.data;
					//申请人填报
					if(d.taskKey == 'activitiStartTask') {
						//删除保存按钮
						$('#savePayment').remove();
					}
					//添加数据至页面
					me.setFormData(d);
				}

			}
		});
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
		$('.approve-div,.else-div').show();
		$('.business-div').show();
		//清空差旅费行程明细
		//$('.travel-div #tripList tbody').empty();
		//清空差旅费费用明细
		//$('#traffic-list-info tbody,#hotel-list-info tbody,#other-list-info tbody,#subsidy-list-info tbody').empty();
		//重置总金额
		//$('.count-val-num,#amountTotalMoney').text('0.00');
		//重置人民币大写
		//$('#TotalMoneyUpper').text('--');
		//重新设置冲销补领金额
		//serveFunds.setReimFundMoney();
		//加载区域页面
		sysCommon.loadingWord('view/system-sasac/expensesReim/module/payment/ordinaryPaymentApply.html');
	},
	/**
	 * 一般费用
	 */
	showGeneralFun: function() { //清空原有代码
		$('.index-main-div').html('');
		//提示文字隐藏
		$('.qtip-text-div').hide();
		//其他区域隐藏
		$('.mod-div').hide();
		//其他信息显示
		$('.approve-div,.else-div').show();
		//加载区域页面
		sysCommon.loadingWord('view/system-sasac/expensesReim/module/payment/ordinaryPaymentApply.html');

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
		$('.approve-div,.else-div').show();
		//相关区域显示
		$('.travel-div').show();
		//加载区域页面
		sysCommon.loadingWord('view/system-sasac/expensesReim/module/payment/ordinaryPaymentApply.html');
	},
	/**
	 * 培训
	 */
	showTrainFun: function() {
		var me = this;
		//清空原有代码
		$('.index-main-div').html('');
		//提示文字隐藏
		$('.qtip-text-div').hide();
		//其他区域隐藏
		$('.mod-div').hide();
		//其他信息显示
		$('.approve-div,.else-div').show();
		//加载区域页面
		sysCommon.loadingWord('view/system-sasac/expensesReim/module/beforehand/trainingFeeApply.html');
		//加载完成判断是否存在审批单
		if($('.prior-approval').val()) {
			//成功后显示导入按钮
			$('.index-main-div .export-but').show();
			paymentApply.getAdvanceAppInfoDetailByAdvanceAppId(paymentApply.saveData.advanceAppId || '', true);
		}
		//导入培训信息
		$('#exportTraining').click(function() {
			//取得保存的事前申请数据
			var list = me.beforeCostList.costData.trainApplyInfoList;
			//导入到列表中
			me.setTrainApplyInfoList(list);
		});
		//导入讲师信息
		$('#exportLecturer').click(function() {
			//取得保存的事前申请数据
			var list = me.beforeCostList.costData.teacherApplyInfoList;
			//导入到列表中
			me.setTeacherApplyInfoList(list);
		});
		//导入培训费用明细
		$('#exportCostApp').click(function() {
			//取得保存的事前申请数据
			var data = me.beforeCostList.costData;
			//导入到列表中
			//me.setTeacherApplyInfoList(list);
			//costTrainApplyInfoList	师资-培训费json
			me.setCostTrainApplyInfoList(data.costTrainApplyInfoList);
			//costTeachersFoodApplyInfoList	师资-伙食费json
			me.setCostTeachersFoodApplyInfoList(data.costTeachersFoodApplyInfoList);
			//costTeachersLectureApplyInfoList	师资-讲课费json
			me.setCostTeachersLectureApplyInfoList(data.costTeachersLectureApplyInfoList);
			//costTeachersTravelApplyInfoList	师资-城市间交通费json
			me.setCostTeachersTravelApplyInfoList(data.costTeachersTravelApplyInfoList);
			//costTeachersHotelApplyInfoList	师资-住宿费 json
			me.setCostTeachersHotelApplyInfoList(data.costTeachersHotelApplyInfoList);
			//计算总金额
			personnelFunds.updateTotalNum();
			//totalAmount	付款总金额
			//$('.count-val-num').text(me.fmMoney(me.beforeCostList.advanceAmount));
			//大写金额
			//$('.total-money-up').text(arabiaToChinese(me.beforeCostList.advanceAmount));

		});

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
		$('.approve-div,.else-div').show();
		//相关区域显示

	},
	/**
	 * 1.2.1.2	[事前申请/报销申请]获取申请费用类型
	 */
	getCostTypeList: function(code) {
		$.ajax({
			type: "post",
			url: "basicconfig/dictInfo/getDictInfoByFormCode",
			async: true,
			data: {
				formAppCode: 'PAYMENT_APP'
			},
			success: function(data) {
				//获取数据list
				var list = data.data || [];
				//初始化HTML文本
				var opts = '<option value="">请选择</option>';
				//循环添加文本
				$.each(list, function(i, n) {
					if(code && code == n.costCode) {
						opts += '<option selected="selected" fun="' + n.jsFun + '" value="' + n.costCode + '">' + n.costName + '</option>';
					} else {
						opts += '<option fun="' + n.jsFun + '" value="' + n.costCode + '">' + n.costName + '</option>';
					}

				});
				//替换页面代码
				$('#getvalue').html(opts).niceSelect();
			}
		});
	},
	/**
	 * 将查询到的详情数据显示至页面
	 * @param {Object} d
	 */
	setFormData: function(d) {
		var me = this;
		if(d.jsFun) {
			//根据相应的方法显示对应的区域
			me[d.jsFun]();
		}
		//lpayAppId	付款申请表id
		me.saveData.payAppId = d.payAppId;
		//流程实例id
		me.saveData.processInstanceId = d.processInstanceId;
		me.saveData.advanceAppId = d.advanceAppId;
		me.saveData.advanceAppNum = d.advanceAppNum;
		me.saveData.paymentAppNum = d.paymentAppNum;
		//paymentAppNum	付款单号
		$('#form-num').text(d.paymentAppNum);
		//paymentAppName	付款事由
		$('#advanceAppReason').val(d.paymentAppName);
		//事前申请编号
		$('.prior-approval').val(d.advanceAppNum);

		//specialCode	所属专项code
		me.saveData.specialCode = d.specialCode;
		//isSpecial	是否专项(1是,2否)
		//$('#radio' + d.isSpecial).setRadioState('check');
		if(d.advanceAppNum) {
			//赋值显示事前审批单可用余额
			$('#advanceAppBalance').text(d.advanceAppBalance ? me.fmMoney(d.advanceAppBalance) + '万元' : '--');
			$('.advance-relevance').show();
		}
		var specialCodeArr = d.specialCode.split(','); //specialCode	所属预算项目code
		var specialNameArr = d.specialName.split('-'); //specialName	所属预算项目名称
		//设置所属预算项目数据
		me.setBudgetItme(specialCodeArr);

		//invoiceNum	发票张数
		$('#invoiceNum').val(d.invoiceNum);
		//totalAmount	付款总金额
		$('#applySumMoney').text(me.fmMoney(d.totalAmount));
		//大写
		$('#applyMoneyLower').text(arabiaToChinese(d.totalAmount + ''));
		$('#fuData').text(d.applicantTime);

		//attIdStr	附件id,字符串,逗号分隔
		//applicantUser	申请人

		//advanceCostType	费用类型
		me.getCostTypeList(d.costType);
		//attList	附件集合
		me.showFileList(d.attList);
		//显示费用列表数据内容
		me.setDataListTable(d.costData);
		//显示收款列表数据内容
		me.setReceiptListTable(d.payReceivablesData);

	},
	/**
	 * 附件集合显示
	 * @param {Object} list
	 */
	showFileList: function(list) {
		var ls = '';
		$.each(list, function(i, n) {
			ls += '<div fId="' + n.attId + '" class="li-div"><span>' + n.attName + '</span><span class="del-file">x</span></div>';
		});
		$('#attIdStr').html(ls);
	},
	/**
	 * 获取保存提交的数据
	 */
	getSubData: function() {
		var me = this;
		//获取本地保存的数据
		var saveData = me.saveData;
		//金额转换方法
		var rMoney = $yt_baseElement.rmoney;
		//预算项目
		var specialCode = function() {
			var code = '';
			$('select.budget-item-one,select.budget-item-two,select.budget-item-three').each(function(i, n) {
				var val = $(this).find('option:selected').val();
				if(val) {
					code += val + ',';
				}
			});
			code = (code.substring(code.length - 1) == ',') ? code.substring(0, code.length - 1) : code;
			return code;
		};
		return {
			payAppId: saveData.payAppId || '', //lpayAppId	付款申请表id
			paymentAppNum: saveData.paymentAppNum || '', //paymentAppNum	付款单号
			paymentAppName: $('#advanceAppReason').val(), //paymentAppName	付款事由
			advanceAppId: me.saveData.advanceAppId,
			advanceAppNum: saveData.advanceAppNum, //事前申请单号
			costType: $('#getvalue option:selected').val(), //costType	费用类型
			specialCode: saveData.specialCode || '', //specialCode	所属专项code
			prjCode: '', //prjCode 项目唯一标识code
			prjName: $('#prjName').val(), //prjName 项目名称
			//isSpecial: $('#radiocheck .check input').val(), //isSpecial	是否专项(1是,2否)
			specialCode: specialCode(), //specialCode	专项所属code
			invoiceNum: $('#invoiceNum').val(), //invoiceNum	发票张数
			totalAmount: me.rmoney($('#applySumMoney').text()), //totalAmount	付款总金额
			attIdStr: me.getFileList(), //attIdStr	附件id,字符串,逗号分隔
			applicantUser: saveData.applicantUser || '', //applicantUser	申请人
			parameters: '', //parameters	JSON格式字符串, 
			dealingWithPeople: $('#approve-users option:selected').val(), //dealingWithPeople	下一步操作人code
			opintion: $('#opintion').val(), //opintion	审批意见
			processInstanceId: saveData.processInstanceId || '', //processInstanceId	流程实例ID, 
			nextCode: $('#operate-flow').val(), //nextCode	操作流程代码
			costData: me.getCostDataJson(), //costData	费用申请数据json
			payReceivablesData: me.payReceivablesData(), //payReceivablesData	收款方数据json
			billingVoucherList: me.billingVoucherList(), //billingVoucherList	记账凭证集合json串
			payDetailList: me.payDetailList() //payDetailList	支付明细集合json串
		};
	},
	/**
	 * //payReceivablesData	收款方数据json
	 */
	payReceivablesData: function() {
		var me = this;
		return JSON.stringify({
			gatheringUnitList: me.gatheringUnitList(), //gatheringUnitList	单位-收款方json 
			gatheringPersonList: me.gatheringPersonList(), //gatheringPersonList	个人-收款方json
			gatheringOtherList: me.gatheringOtherList() //gatheringOtherList	其他-收款方json
		});
	},
	/**
	 * 收款方数据 单位
	 */
	gatheringUnitList: function() {
		var list = [];
		//获取接待对象列表
		var trs = $('table.payee-unit tbody tr:not(.payee-unit-total)');
		var tr = null;
		$.each(trs, function(i, n) {
			//单个tr
			tr = $(n);
			list.push({
				unitName: tr.attr('companyname'), //unitName	单位名称
				openBank: tr.attr('openbank'), //openBank	开户银行
				accounts: tr.attr('accountnumber'), //accounts	账户
				amount: paymentApply.rmoney(tr.attr('companymoney')), //amount	金额
				isContract: tr.attr('contractradio'), //isContract	是否有合同协议(1是,2否)
				remarks: tr.attr('companyspecial'), //remarks	特殊说明
				setMethod: '' //setMethod	结算方式
			});
		});
		return list;
	},
	/**
	 * 收款方数据 个人
	 */
	gatheringPersonList: function() {
		var list = [];
		//获取接待对象列表
		var trs = $('table.payee-personal tbody tr:not(.payee-personal-total)');
		var tr = null;
		$.each(trs, function(i, n) {
			//单个tr
			tr = $(n);
			list.push({
				personalName: tr.attr('payeename'), //personalName	名称
				idCard: tr.attr('idcarkno'), //idCard	身份证号
				phoneNum: tr.attr('phonenum'), //phoneNum	手机号
				openBank: tr.attr('payeebank'), //openBank	开户银行
				accounts: tr.attr('bankname'), //accounts	账户
				amount: paymentApply.rmoney(tr.attr('payeemoney')), //amount	金额
				isContract: tr.attr('payeeradio'), //isContract	是否有合同协议//(1是,2否)
				remarks: tr.attr('personalspecial'), //remarks	特殊说明
				setMethod: '' //setMethod	结算方式
			});
		});
		return list;
	},
	/**
	 * 收款方数据 其他
	 */
	gatheringOtherList: function() {
		var list = [];
		//获取接待对象列表
		var trs = $('table.payee-other tbody tr:not(.payee-other-total)');
		var tr = null;
		$.each(trs, function(i, n) {
			//单个tr
			tr = $(n);
			list.push({
				otherName: tr.attr('othermoney'), //otherName	其他付款名称
				amount: paymentApply.rmoney(tr.attr('otherallmoney')), //amount	金额
				isContract: tr.attr('otherradio'), //isContract	是否有合同协议(1是,2否)
				remarks: tr.attr('otherspecial'), //remarks	特殊说明
				setMethod: '' //setMethod	结算方式
			});
		});
		return list;
	},
	/**
	 * //billingVoucherList	记账凭证集合json串
	 */
	billingVoucherList: function() {
		var list = [];
		//获取接待对象列表
		var trs = $('.msg-list tbody tr');
		var tr = null;
		/*$.each(trs, function(i, n) {
			//单个tr
			tr = $(n);
			list.push({
				toLoanType:'',//toLoanType	记账凭证类型code
				abstracts:'',//abstracts	摘要
				ledger:'',//ledger	总账科目
				detailed:'',//detailed	明细科目
				amount:''//amount	金额
			});
		});*/
		return JSON.stringify(list);
	},
	/**
	 * //payDetailList	支付明细集合json串
	 */
	payDetailList: function() {
		var list = [];
		//获取接待对象列表
		var trs = $('.msg-list tbody tr');
		var tr = null;
		/*$.each(trs, function(i, n) {
			//单个tr
			tr = $(n);
			list.push({
				receivablesId:'',//receivablesId	收款方Id
				receivablesType:'',//receivablesType	收款方类型
				paymentDate:'',//paymentDate	支付时间
				paymentAmount:''//paymentAmount	支付金额
			});
		});*/
		return JSON.stringify(list);
	},
	/**
	 * 
	 * 获取费用类型json数据
	 */
	getCostDataJson: function() {
		var me = this;
		return JSON.stringify({
			costReceptionistList: me.costReceptionistList(),
			costDetailsList: me.costDetailsList(),
			travelRouteList: me.tripPlanList(),
			costCarfareList: me.carfareList(),
			costHotelList: me.hotelList(),
			costOtherList: me.otherList(),
			costSubsidyList: me.costSubsidyList(),
			trainApplyInfoList: me.trainApplyInfoList(), //trainApplyInfoList	师资-培训信息json
			teacherApplyInfoList: me.teacherApplyInfoList(), //teacherApplyInfoList	师资-讲师信息json
			costTrainApplyInfoList: me.costTrainApplyInfoList(), //costTrainApplyInfoList	师资-培训费json
			costTeachersFoodApplyInfoList: me.costTeachersFoodApplyInfoList(), //costTeachersFoodApplyInfoList	师资-伙食费json
			costTeachersLectureApplyInfoList: me.costTeachersLectureApplyInfoList(), //costTeachersLectureApplyInfoList	师资-讲课费json
			costTeachersTravelApplyInfoList: me.costTeachersTravelApplyInfoList(), //costTeachersTravelApplyInfoList	师资-城市间交通费json
			costTeachersHotelApplyInfoList: me.costTeachersHotelApplyInfoList(), //costTeachersHotelApplyInfoList	师资-住宿费 json
			costNormalList: me.costNormalList() //costNormalList	普通报销-费用明细/普通付款-付款明细 json

		});
	},
	/**
	 * 获取附件id字符串
	 */
	getFileList: function() {
		var str = '';
		//获取所有的文件列表
		var list = $('#attIdStr .li-div');
		$.each(list, function(i, n) {
			str += $(n).attr('fid') + (i < list.length - 1 ? ',' : '');
		});
		return str;
	},
	/**
	 * 获取招待费报销 对象信息列表数据
	 */
	costReceptionistList: function() {
		var list = [];
		//获取接待对象列表
		var trs = $('.msg-list tbody tr');
		var tr = null;
		$.each(trs, function(i, n) {
			//单个tr
			tr = $(n);
			list.push({
				costReceptionistId: tr.attr('pkId'), //costReceptionistId	接待对象Id
				name: tr.find('.name').text(), //name	姓名
				jobName: tr.find('.jobName').text(), //jobName	职务
				unitName: tr.find('.DutiesName').text(), //unitName	单位名称
			});
		});
		return list;
	},
	/**
	 * 招待费 接待对象列表信息
	 */
	costDetailsList: function() {
		var list = [];
		//获取接待对象列表
		var trs = $('#paymentList tbody tr:not(.last)');
		var tr = null;
		//结算方式
		var setMethod = $('#paymentList').next().find('.check-label.check input').val();
		$.each(trs, function(i, n) {
			//单个tr
			tr = $(n);
			list.push({
				publicServiceProCode: tr.attr('Pcode'), //costReceptionistId	公务活动项目code
				activityDate: tr.find('.activityDate').text(), //活动日期
				placeName: tr.find('.placeName').text(), //场所
				costType: tr.attr('Tcode'), //具体费用类型code
				standardAmount: $yt_baseElement.rmoney(tr.find('.standardAmount').text() || '0'), //标准金额
				activityAmount: $yt_baseElement.rmoney(tr.find('.money').text() || '0'), //活动金额
				peopleNum: tr.find('.peopleNum').text(), //陪同人数
				setMethod: setMethod //setMethod	结算方式
			});
		});
		return list;
	},
	/**
	 * 差旅费 行程明细列表数据
	 */
	tripPlanList: function() {
		var list = [];
		//获取费用明细列表
		var trs = $('#tripList tbody tr:not(.last)');
		var tr = null;
		//结算方式
		var setMethod = $('#tripList').next().find('.check-label.check input').val();
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
				setMethod: setMethod //setMethod	结算方式

			});
		});
		return list;
	},
	/**
	 * 差旅费 城市间交通费
	 */
	carfareList: function() { //获取城市间交通费列表数据
		var costCarfareList = [];
		var costCarfareJson = "";
		var cityDatas;
		//结算方式
		var setMethod = $('#traffic-list-info').next().find('.check-label.check input').val();
		if($("#traffic-list-info tbody tr:not(.total-last-tr)").length > 0) {
			$("#traffic-list-info tbody tr:not(.total-last-tr)").each(function(i, n) {
				cityDatas = $(this).getDatas();
				//费用格式化
				cityDatas.crafare = $yt_baseElement.rmoney(cityDatas.crafare);
				cityDatas.setMethod = setMethod;
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
	},
	/**
	 * 差旅 住宿费用列表信息
	 */
	hotelList: function() { //获取住宿费列表数据
		var costHotelList = [];
		var costHotelJson = "";
		var hotelDatas;
		//结算方式
		var setMethod = $('#hotel-list-info').next().find('.check-label.check input').val();
		if($("#hotel-list-info tbody tr:not(.total-last-tr)").length > 0) {
			$("#hotel-list-info tbody tr:not(.total-last-tr)").each(function(i, n) {
				hotelDatas = $(this).getDatas();
				hotelDatas.hotelExpense = $yt_baseElement.rmoney(hotelDatas.hotelExpense);
				hotelDatas.setMethod = setMethod;
				costHotelList.push(hotelDatas);
			});
			if(costHotelList.length > 0) {
				costHotelJson = JSON.stringify(costHotelList);
			}
		}
		return costHotelList;
	},
	/**
	 * 差旅 其他费用列表信息
	 */
	otherList: function() {
		//获取其他列表数据
		var costOtherList = [];
		var costOtherJson = "";
		var otherDatas;
		//结算方式
		var setMethod = $('#other-list-info').next().find('.check-label.check input').val();
		if($("#other-list-info tbody tr:not(.total-last-tr)").length > 0) {
			$("#other-list-info tbody tr:not(.total-last-tr)").each(function(i, n) {
				otherDatas = $(this).getDatas();
				otherDatas.reimAmount = $yt_baseElement.rmoney(otherDatas.reimAmount);
				otherDatas.setMethod = setMethod;
				costOtherList.push(otherDatas);
			});
			if(costOtherList.length > 0) {
				costOtherJson = JSON.stringify(costOtherList);
			}
		}
		return costOtherList;
	},
	/**
	 * 差旅 补助明细列表信息
	 */
	costSubsidyList: function() {
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
				subsidyFoodAmount: $yt_baseElement.rmoney(tr.find('.food').text()), //subsidyFoodAmount	伙食补助费
				carfare: $yt_baseElement.rmoney(tr.find('.traffic').text()), //carfare	室内交通费
				setMethod: '' //setMethod	结算方式
			});
		});
		return list;
	},
	/**
	 * trainApplyInfoList	师资-培训信息json
	 */
	trainApplyInfoList: function() {
		var list = [];
		//获取列表
		var trs = $('#trainingPopTable tbody tr:not(.last)');
		var tr = null;
		$.each(trs, function(i, n) {
			//单个tr
			tr = $(n);
			list.push({
				trainType: tr.attr('trainType'), //trainType	培训类型
				regionCode: tr.find('.trainingAddrVal').val(), //regionCode	培训地点code
				regionName: tr.find('.trainingAddr').text(), //regionName	培训地点中文
				reportTime: tr.find('.trainingReportDate').text(), //reportTime	报到时间
				endTime: tr.find('.trainingEndingDate').text(), //endTime	结束时间
				trainDays: tr.find('.trainingDay').text(), //trainDays	培训天数
				trainOfNum: tr.find('.trainingPerNumber').text() //trainOfNum	培训人数
			});
		});
		return list;
	},
	/***
	 * teacherApplyInfoList	师资-讲师信息json
	 */
	teacherApplyInfoList: function() {
		var list = [];
		//获取列表
		var trs = $('#lecturerTable tbody tr:not(.last)');
		var tr = null;
		$.each(trs, function(i, n) {
			//单个tr
			tr = $(n);
			list.push({
				lecturerId: tr.find('.lectureId').val() //lecturerId	讲师Id
			});
		});
		return list;
	},
	/**
	 * costTrainApplyInfoList	师资-培训费json
	 */
	costTrainApplyInfoList: function() {

		var list = [];
		//获取列表
		var trs = $('#trainingFeeTable tbody tr:not(.last)');
		var tr = null;
		$.each(trs, function(i, n) {
			//单个tr
			tr = $(n);
			list.push({
				trainAmount: paymentApply.rmoney(tr.find('.training-total').text()), //trainAmount	培训费总金额
				trainType: '', //trainType	培训类型
				trainDays: tr.find('.day').text(), //trainDays	培训天数
				trainOfNum: tr.find('.num').text(), //trainOfNum	报道人数
				averageMoney: paymentApply.rmoney(tr.find('.avg').text()), //averageMoney	人均消费
				setMethod: '' //setMethod	结算方式

			});
		});
		return list;

	},
	/**
	 * costTeachersFoodApplyInfoList	师资-伙食费json
	 */
	costTeachersFoodApplyInfoList: function() {
		var list = [];
		//获取列表
		var trs = $('#dietFeeTable tbody tr:not(.end-tr)');
		var tr = null;
		$.each(trs, function(i, n) {
			//单个tr
			tr = $(n);
			list.push({
				lecturerId: tr.find('.lectureId').val(), //lecturerId	讲师Id
				averageMoney: paymentApply.rmoney(tr.find('.avg').text()), //averageMoney	人均消费
				foodOfDays: tr.find('.day').text(), //foodOfDays	用餐天数
				foodAmount: paymentApply.rmoney(tr.find('.sum-pay').text()), //foodAmount	伙食费
				remarks: tr.find('.dec').text(), //remarks	特殊说明
				setMethod: '' //setMethod	结算方式
			});
		});
		return list;
	},
	/**
	 * costTeachersLectureApplyInfoList	师资-讲课费json
	 */
	costTeachersLectureApplyInfoList: function() {
		var list = [];
		//获取列表
		var trs = $('#lectureFeeTable tbody tr:not(.end-tr)');
		var tr = null;
		$.each(trs, function(i, n) {
			//单个tr
			tr = $(n);
			list.push({
				lecturerId: tr.find('.lectureId').val(), //lecturerId	讲师Id
				courseName: tr.find('.cname').text(), //courseName	课程名称
				teachingHours: tr.find('.hour').text(), //teachingHours	授课学时
				perTaxAmount: paymentApply.rmoney(tr.find('.sum-pay').text()), //perTaxAmount	税前金额
				afterTaxAmount: paymentApply.rmoney(tr.find('.after').text()), //afterTaxAmount	税后金额
				averageMoney: paymentApply.rmoney(tr.find('.avg').text()), //averageMoney	税后每学时金额
				remarks: tr.find('.lectureId').val(), //remarks	特殊说明
				setMethod: '' //setMethod	结算方式

			});
		});
		return list;
	},
	/**
	 * costTeachersTravelApplyInfoList	师资-城市间交通费json
	 */
	costTeachersTravelApplyInfoList: function() {
		var list = [];
		//获取列表
		var trs = $('#carFeeTable tbody tr:not(.end-tr)');
		var tr = null;
		$.each(trs, function(i, n) {
			//单个tr
			tr = $(n);
			list.push({
				lecturerId: tr.find('.lectureId').val(), //lecturerId	讲师Id
				goTime: tr.find('.sdate').text(), //goTime	出发时间
				arrivalTime: tr.find('.edate').text(), //arrivalTime	到达时间
				goAddress: tr.find('.scode').val(), //goAddress	出发地点code
				goAddressName: tr.find('.sadd').text(), //goAddressName	到达地点中文
				arrivalAddress: tr.find('.ecode').val(), //arrivalAddress	出发地点code
				arrivalAddressName: tr.find('.eadd').text(), //arrivalAddressName	到达地点中文
				vehicle: tr.find('.tool').val(), //vehicle	交通工具code
				carfare: paymentApply.rmoney(tr.find('.sum-pay').text()), //carfare	交通费
				remarks: tr.find('.dec').text(), //remarks	特殊说明
				setMethod: '', //setMethod	结算方式

			});
		});
		return list;
	},
	/**
	 * costTeachersHotelApplyInfoList	师资-住宿费 json
	 */
	costTeachersHotelApplyInfoList: function() {
		var list = [];
		//获取列表
		var trs = $('#hotelFeeTable tbody tr:not(.end-tr)');
		var tr = null;
		$.each(trs, function(i, n) {
			//单个tr
			tr = $(n);
			list.push({
				lecturerId: tr.find('.lectureId').val(), //lecturerId	讲师Id
				startTime: tr.find('.sdate').text(), //startTime	入住时间
				endTime: tr.find('.edate').text(), //endTime	离开时间
				hotelDays: tr.find('.day').text(), //hotelDays	住宿天数
				hotelAddress: '', //hotelAddress	住宿地点
				hotelAddressName: '', //hotelAddressName	住宿地点中文
				hotelExpense: paymentApply.rmoney(tr.find('.sum-pay').text()), //hotelExpense	住宿费
				averageMoney: paymentApply.rmoney(tr.find('.avg').text()), //averageMoney	人均花销
				remarks: tr.find('.dec').text(), //remarks	特殊说明
				setMethod: '' //setMethod	结算方式
			});
		});
		return list;
	},
	/**
	 * costNormalList	普通报销-费用明细/普通付款-付款明细 json
	 */
	costNormalList: function() {
		var list = [];
		var tr = null;
		var trs = $('.ordinary-payment #paymentDetailedTable tbody tr:not(.pay-detail-tabel-total)');;
		$.each(trs, function(i, n) {
			//单个tr
			tr = $(n);
			list.push({
				normalId: '',
				normalName: tr.find(".ordinar-name").text(),
				normalAmount: $yt_baseElement.rmoney(tr.find(".paydet-money").text()),
			});
		});

		return list;

	},
	/**
	 * 显示table 数据列表
	 * @param {Object} costData
	 */
	setDataListTable: function(data) {
		var me = this;

		//师资-培训信息json
		me.setTrainApplyInfoList(data.trainApplyInfoList);
		//teacherApplyInfoList	师资-讲师信息json
		me.setTeacherApplyInfoList(data.teacherApplyInfoList);
		//costTrainApplyInfoList	师资-培训费json
		me.setCostTrainApplyInfoList(data.costTrainApplyInfoList);
		//costTeachersFoodApplyInfoList	师资-伙食费json
		me.setCostTeachersFoodApplyInfoList(data.costTeachersFoodApplyInfoList);
		//costTeachersLectureApplyInfoList	师资-讲课费json
		me.setCostTeachersLectureApplyInfoList(data.costTeachersLectureApplyInfoList);
		//costTeachersTravelApplyInfoList	师资-城市间交通费json
		me.setCostTeachersTravelApplyInfoList(data.costTeachersTravelApplyInfoList);
		//costTeachersHotelApplyInfoList	师资-住宿费 json
		me.setCostTeachersHotelApplyInfoList(data.costTeachersHotelApplyInfoList);
		//costNormalList	普通报销-费用明细/普通付款-付款明细 json
		me.setCostNormalList(data.costNormalList);
	},
	/**
	 * 显示收款信息列表详情
	 * @param {Object} data
	 */
	setReceiptListTable: function(data) {
		var me = this;
		//gatheringUnitList	单位-收款方json
		me.setGatheringUnitList(data.gatheringUnitList);
		//gatheringPersonList	个人-收款方json
		me.setGatheringPersonList(data.gatheringPersonList);
		//gatheringOtherList	其他-收款方json
		me.setGatheringOtherList(data.gatheringOtherList);
	},
	/**
	 * 收款信息 单位列表数据详情
	 * @param {Object} list
	 */
	setGatheringUnitList: function(list) {
		var html = '';
		$.each(list, function(i, n) {
			html += '<tr class="payee-unit-tr" companyName="' + n.unitName + '" openBank="' + n.openBank + '" accountNumber="' + n.accounts + '" companyMoney="' + n.amount + '" contractRadio="' + n.isContract + '" companySpecial="' + n.remarks + '">' +
				'<td class="com" value="Company">' + n.unitName + '</td>' +
				'<td style="text-align: left;">' + n.openBank + '</td>' +
				'<td style="text-align: left;">' + n.accounts + '</td>' +
				'<td style="text-align: right;" class="unitTotal">' + (paymentApply.fmMoney(n.amount)) + '</td>' +
				'<td value="' + n.isContract + '">' + (n.isContract == '1' ? '是' : '否') + '</td>' +
				'<td>' + n.remarks + '</td>' +
				'<td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
				'</tr>';
		});
		$('table.payee-unit tbody .payee-unit-total').before(html);
		//					获取合计
		paymentApply.companyTotal();
	},
	/**
	 * 收款信息 个人列表数据详情
	 * @param {Object} list
	 */
	setGatheringPersonList: function(list) {
		var html = '';
		$.each(list, function(i, n) {
			html += '<tr class="payee-personal-tr" payeeName="' + n.personalName + '" idCarkno="' + n.idCard + '" payeeMoney="' + n.amount + '" payeeBank="' + n.accounts + '" bankName="' + n.openBank + '" phoneNum="' + n.phoneNum + '" payeeRadio="' + n.isContract + '" personalSpecial="' + n.remarks + '">' +
				'<td class="per" value="personal">' + n.personalName + '</td>' +
				'<td>' + n.idCard + '</td>' +
				'<td style="text-align: right;" class="personalTotal">' + (paymentApply.fmMoney(n.amount)) + '</td>' +
				'<td>' + n.accounts + '</td>' +
				'<td>' + n.openBank + '</td>' +
				'<td>' + n.phoneNum + '</td>' +
				'<td>' + (n.isContract == '1' ? '是' : '否') + '</td>' +
				'<td>' + n.remarks + '</td>' +
				'<td>' +
				'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>' +
				'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>' +
				'</td></tr>';

		});
		$('table.payee-personal tbody .payee-personal-total').before(html);
		//					获取合计
		paymentApply.personalTotal();
	},
	/**
	 * 收款信息 其他列表数据详情
	 * @param {Object} list
	 */
	setGatheringOtherList: function(list) {
		var html = '';
		$.each(list, function(i, n) {
			html += '<tr class="payee-other-tr" otherMoney="' + n.otherName + '" otherAllMoney="' + n.amount + '" otherRadio="' + n.isContract + '" otherSpecial="' + n.remarks + '">' +
				'<td class="oth" value="Other">' + n.otherName + '</td>' +
				'<td style="text-align: right;" class="otherTotal">' + (paymentApply.fmMoney(n.amount)) + '</td>' +
				'<td>' + (n.isContract == '1' ? '是' : '否') + '</td>' +
				'<td>' + n.remarks + '</td>' +
				'<td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
				'</tr>';
		});
		$('table.payee-other tbody .payee-other-total').before(html);
		//					获取合计
		paymentApply.otherTotal();
	},
	/**
	 * trainApplyInfoList	师资-培训信息json
	 * 设置 师资培训信息列表数据
	 * @param {Object} list
	 */
	setTrainApplyInfoList: function(list) {
		var html = '';
		$.each(list, function(i, n) {
			html += '<tr pid="' + n.trainAppId + '" trainType="' + n.trainType + '">' +
				'<td class="trainingClasses">' + n.trainTypeName + '</td>' +
				'<td class="trainingAddr"><input type="hidden" class="trainingAddrVal" value="' + n.regionCode + '">' + n.regionName + '</td>' +
				'<td class="trainingReportDate">' + n.reportTime + '</td>' +
				'<td class="trainingEndingDate">' + n.endTime + '</td>' +
				'<td class="trainingDay">' + n.trainDays + '</td>' +
				'<td class="trainingPerNumber">' + n.trainOfNum + '</td>' +
				'<td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
				'</tr>';
		});
		//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + paymentApply.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + paymentApply.fmMoney(totalTraffic) + '</td></tr>';
		$('#trainingPopTable tbody').append(html);
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
				'<td class="professional">' + n.lecturerTitleName + '</td>' +
				'<td class="level">' + n.lecturerLevelName + '</td>' +
				'<td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
				'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td></tr>';
		});
		//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + paymentApply.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + paymentApply.fmMoney(totalTraffic) + '</td></tr>';
		$('#lecturerTable tbody').html(html);
	},
	/**
	 * costTrainApplyInfoList	师资-培训费json
	 * 设置 师资培训费列表数据
	 * @param {Object} list
	 */
	setCostTrainApplyInfoList: function(list) {
		var html = '';
		$.each(list, function(i, n) {
			html += '<tr pid="' + n.teachersTrainId + '">' +
				'<td class="day">' + n.trainDays + '</td>' +
				'<td class="num">' + n.trainOfNum + '</td>' +
				'<td class="moneyText avg">' + paymentApply.fmMoney(n.averageMoney) + '</td>' +
				'<td class="moneyText training-total">' + paymentApply.fmMoney(n.trainAmount) + '</td>' +
				'<td><input type="hidden" class="popM" value="0"/>' +
				'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
				'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
				'</tr>';
		});
		//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + paymentApply.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + paymentApply.fmMoney(totalTraffic) + '</td></tr>';
		$('#trainingFeeTable tbody').append(html);
	},
	/**
	 * costTeachersFoodApplyInfoList	师资-伙食费json
	 * 设置 师资伙食费列表
	 * @param {Object} list
	 */
	setCostTeachersFoodApplyInfoList: function(list) {
		var html = '';
		var total = 0;
		$.each(list, function(i, n) {
			html += '<tr pid="' + n.foodId + '">' +
				'<td class="name"><input type="hidden" class="lectureId" value="' + n.lecturerId + '">' + n.lecturerName + '</td>' +
				'<td class="avg">' + paymentApply.fmMoney(n.averageMoney) + '</td>' +
				'<td class="day">' + n.foodOfDays + '</td>' +
				'<td class="moneyText sum-pay">' + paymentApply.fmMoney(n.foodAmount) + '</td>' +
				'<td style="text-align: left !important;" class="dec">' + n.remarks + '</td>' +
				'<td><input type="hidden" class="popM" value="4"/>' +
				'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
				'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
				'</tr>';
			total += +n.foodAmount;
		});
		//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + paymentApply.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + paymentApply.fmMoney(totalTraffic) + '</td></tr>';
		$('#dietFeeTable tbody .end-tr').before(html);
		$('#dietFeeTable tbody .costTotal').text(paymentApply.fmMoney(total));
	},
	/**
	 * //costTeachersLectureApplyInfoList	师资-讲课费json
	 * 设置 师资讲课费列表
	 * @param {Object} list
	 */
	setCostTeachersLectureApplyInfoList: function(list) {
		var html = '';
		var total = 0;
		$.each(list, function(i, n) {
			html += '<tr pid="' + n.teachersLectureId + '">' +
				'<td class="uname"><input type="hidden" class="lectureId" value="' + n.lecturerId + '">' + n.lecturerName + '</td>' +
				'<td class="holder">' + n.lecturerTitleName + '</td>' +
				'<td class="hour">' + n.teachingHours + '</td>' +
				'<td class="cname">' + n.courseName + '</td>' +
				'<td class="moneyText sum-pay">' + paymentApply.fmMoney(n.perTaxAmount) + '</td>' +
				'<td class="moneyText after">' + paymentApply.fmMoney(n.afterTaxAmount) + '</td>' +
				'<td class="moneyText avg">' + paymentApply.fmMoney(n.averageMoney) + '</td>' +
				'<td><input type="hidden" class="popM" value="1"/>' +
				'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
				'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
				'</td></tr>';
			total += +n.perTaxAmount;
		});
		//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + paymentApply.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + paymentApply.fmMoney(totalTraffic) + '</td></tr>';
		$('#lectureFeeTable tbody .end-tr').before(html);
		$('#lectureFeeTable tbody .costTotal').text(paymentApply.fmMoney(total));
	},
	/**
	 * //costTeachersTravelApplyInfoList	师资-城市间交通费json
	 * 设置 师资城市间交通费列表
	 * @param {Object} list
	 */
	setCostTeachersTravelApplyInfoList: function(list) {
		var html = '';
		var total = 0;
		$.each(list, function(i, n) {
			html += '<tr pid="' + n.teachersTravelId + '">' +
				'<td class="uname"><input type="hidden" class="lectureId" value="' + n.lecturerId + '">' + n.lecturerName + '</td>' +
				'<td class="ulv">' + n.lecturerLevelName + '</td>' +
				'<td class="sdate">' + n.goTime + '</td>' +
				'<td class="edate">' + n.arrivalTime + '</td>' +
				'<td class="sadd"><input type="hidden" class="scode" value="' + n.goAddress + '">' + n.goAddressName + '</td>' +
				'<td class="eadd"><input type="hidden" class="ecode" value="' + n.arrivalAddress + '">' + n.arrivalAddressName + '</td>' +
				'<td class="tname"><input type="hidden" class="tool" value="' + n.vehicle + '">' + n.vehicleName + '</td>' +
				'<td class="moneyText sum-pay">' + paymentApply.fmMoney(n.carfare) + '</td>' +
				'<td style="text-align: left !important;" class="dec">' + n.remarks + '</td>' +
				'<td><input type="hidden" class="popM" value="2"/>' +
				'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
				'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
				'</td></tr>';
			total += +n.carfare;
		});
		//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + paymentApply.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + paymentApply.fmMoney(totalTraffic) + '</td></tr>';
		$('#carFeeTable tbody .end-tr').before(html);
		$('#carFeeTable tbody .costTotal').text(paymentApply.fmMoney(total));
	},
	/**
	 * //costTeachersHotelApplyInfoList	师资-住宿费 json
	 * 设置 师资住宿费列表
	 * @param {Object} list
	 */
	setCostTeachersHotelApplyInfoList: function(list) {
		var html = '';
		var total = 0;
		$.each(list, function(i, n) {
			html += '<tr pid="' + n.teachersHotelId + '" level="' + n.lecturerLevelName + '">' +
				'<td class="name"><input type="hidden" class="lectureId" value="' + n.lecturerId + '">' + n.lecturerName + '</td>' +
				'<td class="sdate">' + n.startTime + '</td>' +
				'<td class="edate">' + n.endTime + '</td>' +
				'<td class="moneyText avg">' + paymentApply.fmMoney(n.averageMoney) + '</td>' +
				'<td class="day">' + n.hotelDays + '</td>' +
				'<td class="moneyText sum-pay">' + paymentApply.fmMoney(n.hotelExpense) + '</td>' +
				'<td style="text-align: left !important;" class="dec">' + n.remarks + '</td>' +
				'<td><input type="hidden" class="popM" value="3"/>' +
				'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
				'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
				'</td></tr>';
			total += +n.hotelExpense;
		});
		//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + paymentApply.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + paymentApply.fmMoney(totalTraffic) + '</td></tr>';
		$('#hotelFeeTable tbody .end-tr').before(html);
		$('#hotelFeeTable tbody .costTotal').text(paymentApply.fmMoney(total));
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
			html += ' <tr class="yt-tab-row">' +
				' <td style="text-align:left;" class="ordinar-name">' + n.normalName + '</td>' +
				' <td style="text-align: right;" class="paydet-money">' + ($yt_baseElement.fmMoney(n.normalAmount)) + '</td>' +
				' <td>' +
				' <span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
				' <span class="operate-del" style=""><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
				' </td>' +
				' </tr>';
			total += +n.normalAmount;
		});
		$('.ordinary-payment #paymentDetailedTable tbody .pay-detail-tabel-total').before(html);
		$('.ordinary-payment #paymentDetailedTable tbody .total-money').text($yt_baseElement.fmMoney(total));
	},
	/**t
	 * 1.1.4.5	根据事前申请Id获取报销申请详细信息   
	 * 导入事前审批单用
	 * @param {Object} id
	 */
	getAdvanceAppInfoDetailByAdvanceAppId: function(id, updata) {
		$.ajax({
			type: "post",
			url: "sz/advanceApp/getAdvanceAppInfoDetailByAdvanceAppId",
			async: true,
			data: {
				advanceAppId: id
			},
			success: function(data) {
				//保存查询成功的事前数据
				if(data.flag == 0) {
					//保存事前申请信息  导入使用
					paymentApply.beforeCostList = data.data;

					if(!updata) {
						//如果基本信息中有选择的事前审批单，将事前审批单中的相关附件中的文件导入，导入的文件不可删除
						paymentApply.exportBeforeFiles(data.data.attList);
					}
				}
			}
		});

	},
	/**
	 * 添加事前申请的附件数据
	 * @param {Object} files
	 */
	exportBeforeFiles: function(files) {
		var ls = '';
		var src = '';
		//首先移除之前导入的附件
		$('#attIdStr .export').remove();
		$.each(files, function(i, n) {
			//获取图片格式
			var imgType = n.attName.split('.');
			if(imgType.length > 1 && (imgType[1] == 'png' || imgType[1] == 'jpeg' || imgType[1] == 'bmp' || imgType[1] == 'jpg')) {
				//拼接图片路径
				src = $yt_option.base_path + 'fileUpDownload/download?pkId=' + n.attId + '&isDownload=false';
				ls += '<div fid="' + n.attId + '" class="li-div export"><span class="file-name" >' + n.attName + '</span><label class="file-dw">下载</label><label class="file-pv">预览<img src="' + src + '" ></label></div>';
			} else {
				ls += '<div fid="' + n.attId + '" class="li-div export"><span class="file-name" >' + n.attName + '</span><label class="file-dw">下载</label><label class="file-pvno">预览</label></div>';
			}
		});
		$('#attIdStr').append(ls);
		//图片下载
		$('#attIdStr .file-dw').on('click', function() {
			var id = $(this).parent().attr('fid');
			window.location.href = $yt_option.base_path + 'fileUpDownload/download?pkId=' + id + '&isDownload=true';
		});
		//图片预览
		$('#attIdStr .file-pv img').showImg();
	},
	/**
	 * 设置所属预算项目
	 */
	setBudgetItme: function(arr) {
		var me = this;
		//修改时重新绑定数据
		var codeArr = arr ? arr : [];
		//第一级下拉框
		var budgetOne = $('.budget-item-one');
		//第二级下拉框
		var budgetTwo = $('.budget-item-two');
		//第三级下拉框
		var budgetThree = $('.budget-item-three');
		//获取选中的预算项目code
		var getBudgetCode = function() {
			$('select.budget-item-one,select.budget-item-two,select.budget-item-three').each(function() {

			});
		};
		//先隐藏第二级第三级的下拉框
		$('div.budget-item-two').hide();
		$('div.budget-item-three').hide();
		//设置第一级数据
		me.getSpecialDictList($('select.budget-item-one'), '', function(list) {
			var code = $('select.budget-item-one').find('option:selected').val();
			if(code) {
				//设置第二级数据
				me.getSpecialDictList($('select.budget-item-two'), code, function(list) {
					if(list.length > 0) {
						//第二级选中的code
						var twoCode = $('select.budget-item-two').find('option:selected').val();
						//设置第三级数据
						me.getSpecialDictList($('select.budget-item-three'), twoCode, function(list) {
							if(list.length > 0) {
								//第三级存在获取第三级的余额
								var threeCode = $('select.budget-item-three').find('option:selected').val();
								me.getBudgetBalanceAmount(threeCode);
							} else {
								//先隐藏第三级的下拉框
								$('div.budget-item-three').hide();
								//第三级不存在获取第二级的余额
								me.getBudgetBalanceAmount(twoCode);
							}
						}, codeArr.length > 2 ? codeArr[2] : '');
					} else {
						//先隐藏第二级第三级的下拉框
						$('div.budget-item-two').hide();
						$('div.budget-item-three').hide();
					}
				}, codeArr.length > 1 ? codeArr[1] : '');
			} else {
				$('#codeMon').text('--');
				$('div.budget-item-two').hide();
				$('div.budget-item-three').hide();
			}
		}, codeArr.length > 0 ? codeArr[0] : '');
		//第一级更新获取第二级
		$('select.budget-item-one').on('change', function() {
			//先隐藏第二级第三级的下拉框
			//$('div.budget-item-two').hide();
			//$('div.budget-item-three').hide();
			var code = $(this).find('option:selected').val();
			if(code) {
				//设置第二级数据
				me.getSpecialDictList($('select.budget-item-two'), code, function(list) {
					if(list.length > 0) {
						//第二级选中的code
						var twoCode = budgetTwo.find('option:selected').val();
						//设置第三级数据
						me.getSpecialDictList($('select.budget-item-three'), twoCode, function(list) {
							if(list.length > 0) {
								//第三级存在获取第三级的余额
								var threeCode = $('select.budget-item-three').find('option:selected').val();
								me.getBudgetBalanceAmount(threeCode);
							} else {
								//先隐藏第三级的下拉框
								$('div.budget-item-three').hide();
								//第三级不存在获取第二级的余额
								me.getBudgetBalanceAmount(twoCode);
							}
						});
					} else {
						//先隐藏第二级第三级的下拉框
						$('div.budget-item-two').hide();
						$('div.budget-item-three').hide();
					}
				});
			} else {
				$('#codeMon').text('--');
				$('div.budget-item-two').hide();
				$('div.budget-item-three').hide();
			}
			//选择为项目支出时显示项目名称
			if(code == '395') {
				$('.prj-name-tr').show();
			} else {
				$('.prj-name-tr').hide().val('');
			}
		});
		//第二级更新获取第三级
		$('select.budget-item-two').on('change', function() {
			//先隐藏第三级的下拉框
			//$('div.budget-item-three').hide();
			var code = $(this).find('option:selected').val();
			//设置第三级数据
			me.getSpecialDictList($('select.budget-item-three'), code, function(list) {
				if(list.length > 0) {
					//第三级存在获取第三级的余额
					var threeCode = $('select.budget-item-three').find('option:selected').val();
					me.getBudgetBalanceAmount(threeCode);
				} else {
					//先隐藏第三级的下拉框
					$('div.budget-item-three').hide();
					//第三级不存在获取第二级的余额
					me.getBudgetBalanceAmount(code);
				}
			});
		});

		//第三级更新获取余额
		$('select.budget-item-three').on('change', function() {
			//第三级存在获取第三级的余额
			var threeCode = $('select.budget-item-three').find('option:selected').val();
			me.getBudgetBalanceAmount(threeCode);
		});

	},
	/**
	 * select下拉获取数据(根据父级code获取子级数据)
	 * @param {Object} parentCode
	 */
	getSpecialDictList: function(obj, parentCode, fun, code) {
		obj.find('option').remove();
		$.ajax({
			type: "post",
			url: "budget/main/getSpecialDictList",
			async: true,
			data: {
				parentCode: parentCode
			},
			success: function(data) {
				var list = data.data || [];
				var opts = '';
				if(obj.hasClass('budget-item-one')) {
					opts += '<option value="">请选择</option>';
				}
				if(data.flag == 0 && list.length > 0) {
					$.each(list, function(i, n) {
						if(code && code == n.specialCode) {
							opts += '<option selected="selected" value="' + n.specialCode + '">' + n.specialName + '</option>';
						} else {
							opts += '<option value="' + n.specialCode + '">' + n.specialName + '</option>';
						}
					});
					//添加并初始化
					obj.html(opts).niceSelect();
				} else {
					//隐藏
				}
				if(fun) {
					//在选中第一级后，需要同时处理第二第三级的情况下，执行事件
					fun(list);
				}
			}
		});
	},
	/**
	 * 1.3.3.4	所属预算项目：获取预算剩余额度
	 * @param {Object} specialCodeSeq
	 */
	getBudgetBalanceAmount: function(specialCodeSeq) {
		$.ajax({
			type: "post",
			url: "budget/main/getBudgetOtherBalanceAmount",
			async: true,
			data: {
				specialCodeSeq: specialCodeSeq
			},
			success: function(data) {
				var mon = data.data;
				//赋值可用预算余额
				$('#codeMon').text(mon ? $yt_baseElement.fmMoney(mon) + '万元' : '--');
			}
		});
	},
	/**
	 * 获取收款方的现有金额
	 */
	getReceMsgMoney: function() {
		var total = 0;
		//收款单位金额
		var unit = paymentApply.rmoney($('.payee-unit .payee-unit-money').text());
		//收款个人金额
		var us = paymentApply.rmoney($('.payee-personal .payee-unit-money').text());
		//收款其他金额
		var other = paymentApply.rmoney($('.payee-other .payee-unit-money').text());
		total = unit + us + other;
		return total;
	},
	/**
	 * 填写对象信息相关事件
	 */
	msgListEvent: function() {
		var me = this;

		//显示弹出框
		$('.add-msg').click(function() {
			me.showMsgAlert();
			$('.msg-common').off().on('click', function() {
				me.appendMsgList();

			}).text('添加到列表');
		});

		//取消
		$('.msg-cancel').click(function() {
			//隐藏
			me.hideMsgAlert();
			//清空
			me.clearAlert($('.msg-alert'));
		});

		//列表内删除
		$('.msg-list').on('click', '.operate-del', function() {
			var ithis = $(this);
			var tr = ithis.parents('tr');
			$yt_alert_Model.alertOne({
				alertMsg: "数据删除将无法恢复,确认删除吗?", //提示信息  
				confirmFunction: function() { //点击确定按钮执行方法  
					tr.remove();
					//重置序号
					me.resetNum($('.msg-list'));
				}
			});
		});

		//编辑
		$('.msg-list').on('click', '.operate-update', function() {
			var ithis = $(this);
			var tr = ithis.parents('tr');
			//数据回显
			//姓名
			var nameVal = $('#nameVal').val(tr.attr('nameVal'));
			//职务
			var dutyVal = $('#dutyVal').val(tr.attr('dutyVal'));
			//单位
			var deptVal = $('#deptVal').val(tr.attr('deptVal'));
			//显示弹框
			me.showMsgAlert();
			//重置按钮
			$('.msg-common').off().on('click', function() {
				me.appendMsgList(tr);
			}).text('确定');
		});
	},
	/**
	 * 添加接待对象信息列表
	 */
	appendMsgList: function(tr) {
		var me = this;
		//姓名
		var nameVal = $('#nameVal').val();
		//职务
		var dutyVal = $('#dutyVal').val();
		//单位
		var deptVal = $('#deptVal').val();

		var html = '<tr pkId="" class="" nameVal="' + nameVal + '" dutyVal="' + dutyVal + '" deptVal="' + deptVal + '">' +
			'<td><span class="num">1</span></td>' +
			'<td><span class="name-text">' + nameVal + '</span></td>' +
			'<td><span class="job-text">' + dutyVal + '</span></td>' +
			'<td><span class="unit-text">' + deptVal + '</span></td>' +
			'<td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
			'</tr>';

		if(nameVal != '' && dutyVal != '' && deptVal != '') {
			if(tr) {
				//替换
				tr.replaceWith(html);
			} else {
				$('.msg-list').append(html);
			}
			//隐藏
			me.hideMsgAlert();
			//清空
			me.clearAlert($('.msg-alert'));
			//重置序号
			me.resetNum($('.msg-list'));
		} else {
			$yt_alert_Model.prompt('请完整填写数据');
		}
	},
	/**
	 * 添加接待对象信息列表修改表格行内容
	 * @param {Object} tr
	 */
	updateMsgList: function(tr) {},
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
	 * 显示填写对象信息弹出框
	 */
	showMsgAlert: function() {
		//获取弹框对象
		var alert = $('.msg-alert');
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
		$('.msg-alert').hide();
		$('#pop-modle-alert').hide();
	},
	/**
	 * 费用明细列表相关事件
	 */
	paymentListEvent: function() {
		var me = this;

		//新增明细
		$('#addProcuList').on('click', function() {
			me.showPaymentAlert();

			$('#paymentAddBtn').off().on('click', function() {
				me.appendPaymentList();
			}).text('添加到列表');
		});
		//删除
		$('#paymentList').on('click', '.operate-del', function() {
			var ithis = $(this);
			var tr = ithis.parents('tr');
			$yt_alert_Model.alertOne({
				alertMsg: "数据删除将无法恢复,确认删除吗?", //提示信息  
				confirmFunction: function() { //点击确定按钮执行方法  
					tr.remove();
					//计算总额
					me.getTotleMoney();
				}
			});
		});

		//编辑
		$('#paymentList').on('click', '.operate-update', function() {
			var ithis = $(this);
			var tr = ithis.parents('tr');
			//公务活动项目
			var budgetProject = $('#budgetProject option[value="' + tr.attr('budgetcode') + '"]').attr('selected', true);
			//日期
			var applyDate = $('#applyDate').val(tr.attr('applyDate'));
			//场所
			var siteVal = $('#siteVal').val(tr.attr('siteVal'));
			//费用明细
			var costBreakdown = $('#costBreakdown option[value="' + tr.attr('costcode') + '"]').attr('selected', true);
			//标准
			var standardMoney = $('#standardMoney').val(tr.attr('standardMoney'));
			//金额
			var budgetMoney = $('#budgetMoney').val(tr.attr('budgetMoney'));
			//转换金额格式
			//var numMoney = $yt_baseElement.rmoney(budgetMoney);
			//陪同人数
			var accompanyNum = $('#accompanyNum').val(tr.attr('accompanyNum'));
			$('#budgetProject,#costBreakdown').niceSelect();
			//显示弹框
			me.showPaymentAlert();

			$('#paymentAddBtn').off().on('click', function() {
				//编辑方法
				me.appendPaymentList(tr);
			}).text('确定');
		});
		//修改关闭
		$('#paymentCanelBtn').on('click', function() {
			//隐藏弹框
			me.hidePaymentAlert();
			//清空
			me.clearAlert($('#createDetali'));
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
	 * 费用明细列表追加
	 */
	appendPaymentList: function(tr) {
		var me = this;
		//公务活动项目
		var budgetProject = $('#budgetProject option:selected').text();
		//项目code
		var budgetCode = $('#budgetProject option:selected').val();
		//日期
		var applyDate = $('#applyDate').val();
		//场所
		var siteVal = $('#siteVal').val();
		//费用明细
		var costBreakdown = $('#costBreakdown option:selected').text();
		var costCode = $('#costBreakdown option:selected').val();
		//标准
		var standardMoney = '';
		//转换金额格式
		var stanMoney = $yt_baseElement.rmoney(standardMoney);
		//金额
		var budgetMoney = $('#budgetMoney').val();
		//转换金额格式
		var numMoney = $yt_baseElement.rmoney(budgetMoney);
		//陪同人数
		var accompanyNum = $('#accompanyNum').val();

		var html = '<tr pkId="" budgetCode="' + budgetCode + '" costCode="' + costCode + '" budgetProject="' + budgetProject + '" applyDate="' + applyDate + '" siteVal="' + siteVal + '" costBreakdown="' + costBreakdown + '" standardMoney="' + standardMoney + '" budgetMoney="' + budgetMoney + '" accompanyNum="' + accompanyNum + '">' +
			'<td><span class="">' + budgetProject + '</span></td>' +
			'<td><span class="act-date">' + applyDate + '</span></td>' +
			'<td><span class="place-name">' + siteVal + '</span></td>' +
			'<td><span>' + costBreakdown + '</span></td>' +
			/*'<td style="text-align: right;"><div class="stan-money" money=' + stanMoney + '>' + standardMoney + '</div></td>' +*/
			'<td style="text-align: right;"><div class="money" money=' + numMoney + '>' + budgetMoney + '</div></td>' +
			'<td><span class="people-num">' + accompanyNum + '</span></td>' +
			'<td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
			'</tr>';

		if(budgetProject && applyDate && siteVal && costBreakdown && budgetMoney && accompanyNum) {
			if(tr) {
				tr.replaceWith(html);
			} else {
				$('#paymentList tbody .last').before(html);
			}
			//隐藏
			me.hidePaymentAlert();
			//清空
			me.clearAlert($('#createDetali'));
			//计算总金额
			me.getTotleMoney();
		} else {
			$yt_alert_Model.prompt('请完整填写数据');
		}
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
		var fmTotal = $yt_baseElement.fmMoney(total);
		//赋值合计金额
		$('#paymentList tbody .total-money').text(fmTotal);
		//报销总金额
		$('#applyTotalMoney').text(fmTotal).attr('num', total);
		//报销总额
		$('#amountTotalMoney').text(fmTotal).attr('num', total);
		//大写转换
		$('#TotalMoneyUpper').text(arabiaToChinese(fmTotal + ''));
		//获取借款单可用余额
		var outstandingBalance = $yt_baseElement.rmoney($('#outstandingBalance').text());
		//冲销金额：只读信息，读取逻辑：如果报销金额小于借款单可用余额，则读取报销总额；如果报销金额大于等于借款单可用余额，则读取借款单可用余额
		var writeOffAmount = total >= outstandingBalance ? outstandingBalance : total;
		$('#writeOffAmount,#outWriteAmount').text($yt_baseElement.fmMoney(writeOffAmount));
		// 补领金额：计算项，计算逻辑：如果报销金额小于借款单可用余额，则为0.00；如果报销金额大于等于借款单可用余额，则报销金额-冲销金额的金额值
		var replaceMoney = total >= outstandingBalance ? total - writeOffAmount : 0;
		if(replaceMoney <= 0) {
			//补领金额是零的时候 ，补领方式 几个输入框禁用，默认值都是0.
			$('#officialCard,#cash,#cheque').val('0').attr('disabled', true);
			$('.amount-table .total').text('0');
		} else {
			$('#officialCard,#cash,#cheque').attr('disabled', false);
		}
		$('#replaceMoney').text($yt_baseElement.fmMoney(replaceMoney));
		//报销后借款单余额：计算项，计算逻辑：如果报销金额小于借款单可用余额，则借款单可用余额-报销金额；如果报销金额大于风雨借款单可用余额；则显示为0.00
		$('#balanceMoney').text($yt_baseElement.fmMoney(total < outstandingBalance ? outstandingBalance - total : '0'));
	},
	/**
	 * 切换费用类型时重新设置冲销补领金额
	 */
	setReimFundMoney: function() {
		var total = 0;
		//获取借款单可用余额
		var outstandingBalance = serveFunds.rmoney($('#outstandingBalance').text());
		//冲销金额：只读信息，读取逻辑：如果报销金额小于借款单可用余额，则读取报销总额；如果报销金额大于等于借款单可用余额，则读取借款单可用余额
		var writeOffAmount = total >= outstandingBalance ? outstandingBalance : total;
		$('#writeOffAmount,#outWriteAmount').text(serveFunds.fmMoney(writeOffAmount));
		// 补领金额：计算项，计算逻辑：如果报销金额小于借款单可用余额，则为0.00；如果报销金额大于等于借款单可用余额，则报销金额-冲销金额的金额值
		var replaceMoney = total >= outstandingBalance ? total - writeOffAmount : 0;
		if(replaceMoney <= 0) {
			//补领金额是零的时候 ，补领方式 几个输入框禁用，默认值都是0.
			$('#officialCard,#cash,#cheque').val('0').attr('disabled', true);
			$('.amount-table .total').text('0');
		} else {
			$('#officialCard,#cash,#cheque').attr('disabled', false);
		}
		$('#replaceMoney').text(serveFunds.fmMoney(replaceMoney));
		//报销后借款单余额：计算项，计算逻辑：如果报销金额小于借款单可用余额，则借款单可用余额-报销金额；如果报销金额大于风雨借款单可用余额；则显示为0.00
		$('#balanceMoney').text(serveFunds.fmMoney(total < outstandingBalance ? outstandingBalance - total : '0'));
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
				dictTypeCode: 'ACTIVITY_PRO,SPECIFIC_COST_TYPE,TRAVEL_TYPE,VEHICIE_CODE,HOTEL_ADDRESS,COST_TYPE'
			},
			success: function(data) {
				//获取数据list
				var list = data.data || [];
				//初始化HTML文本
				var start = '<option value="">请选择</option>',
					optone = start,
					opttwo = start,
					travelType = start,
					vehicieCode = start,
					hotel = start,
					cost = start;
				//循环添加文本
				$.each(list, function(i, n) {
					if(n.dictTypeCode == 'ACTIVITY_PRO') {
						//公务活动项目
						optone += '<option value="' + n.value + '">' + n.disvalue + '</option>';
					} else if(n.dictTypeCode == 'SPECIFIC_COST_TYPE') {
						//具体费用
						opttwo += '<option value="' + n.value + '">' + n.disvalue + '</option>';
					} else if(n.dictTypeCode == 'TRAVEL_TYPE') {
						//出差类型
						travelType += '<option value="' + n.value + '">' + n.disvalue + '</option>';
					} else if(n.dictTypeCode == 'VEHICIE_CODE') {
						//交通工具
						vehicieCode += '<option value="' + n.value + '">' + n.disvalue + '</option>';
					} else if(n.dictTypeCode == 'HOTEL_ADDRESS') {
						//住宿地点
						hotel += '<option value="' + n.value + '">' + n.disvalue + '</option>';
					} else if(n.dictTypeCode == 'COST_TYPE') {
						//其他费用类型
						cost += '<option value="' + n.value + '">' + n.disvalue + '</option>';
					}
				});
				//替换页面代码
				$('#budgetProject').html(optone).niceSelect();
				$('#costBreakdown').html(opttwo).niceSelect();
				//出差类型
				$('#modelBusiType').html(travelType).niceSelect();
				//交通工具
				$('select.vehicle-sel').html(vehicieCode).on("change", function() {
					var selVal = $(this).val();
					//调用公用方法根据一级交通工具获取二级交通工具
					sysCommon.vechicleChildData(selVal);
				}).niceSelect();
				//住宿地点
				//$('#hotelParentAddress').html(travelType).niceSelect();
				//其他费用类型
				$('select.cost-type-sel').html(cost).niceSelect();
			}
		});
	},
	getChoiceLoanList: function(code) {
		$.ajax({
			type: "post",
			url: "sz/loanApp/getUserLoanAppInfoListToPageByParams",
			async: true,
			success: function(data) {
				//获取数据list
				var list = data.data.rows || [];
				//初始化HTML文本
				var opts = '<option value="">请选择</option>';
				//循环添加文本
				$.each(list, function(i, n) {
					opts += '<option arrearsAmount="' + n.arrearsAmount + '" value="' + n.loanAppId + '">' + n.loanAppNum + '</option>';
				});
				//替换页面代码
				$('#choiceLoan').html(opts).niceSelect();
			}
		});
	},
	getPayeeNameList: function(code) {
		$.ajax({
			type: "post",
			url: "user/userInfo/getAllUserInfoToPage",
			async: true,
			success: function(data) {
				//获取数据list
				var list = data.data.rows || [];
				//初始化HTML文本
				var opts = '<option value="">请选择</option>';
				//循环添加文本
				$.each(list, function(i, n) {
					if(code && code == n.userItcode){
						opts += '<option selected="" value="' + n.userItcode + '">' + n.userName + '</option>';
					}else{
						opts += '<option value="' + n.userItcode + '">' + n.userName + '</option>';
					}
				});
				//替换页面代码
				$('#payeeName').html(opts).niceSelect();
				//初始化调用插件刷新方法  
				$("select#payeeName").niceSelect({
					search: true,
					backFunction: function(text) {
						//回调方法,可以执行模糊查询,也可自行添加操作  
						$("select#payeeName option").remove();
						if(text == "") {
							$("select#payeeName").append('<option value="">请选择</option>');
						}
						//遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
						$.each(list, function(i, n) {
							if(n.userName.indexOf(text) != -1) {
								$("select#payeeName").append('<option value="' + n.userItcode + '">' + n.userName + '</option>');
							}
						});
					}
				});
			}
		});
	},
	getArrearsAmount: function() {
		$("#choiceLoan").change(function() {
			var arrearsAmount = $("#choiceLoan").find("option:selected").attr("arrearsAmount");
			$(".arrears-money").text($yt_baseElement.fmMoney(arrearsAmount));
		});
		$("#witeOffPersonal").change(function() {
			var thischange = $("#witeOffPersonal").find("option:selected").val();
			if(thischange == 1) {
				$(".display-loan").show();
			} else {
				$(".display-loan").hide();
			}
		})
	},
}

$(function() {
	//获取修改参数
	var pid = $yt_common.GetQueryString('payAppId');
	if(pid) {
		//参数存在时获取对应的详情数据
		paymentApply.getPayAppInfoByPayAppId(pid);
	} else {
		//获取申请费用类型
		paymentApply.getCostTypeList();
		paymentApply.setBudgetItme();
	}

	$("select").niceSelect();
	//获取当前登录用户信息
	sysCommon.getLoginUserInfo();
	//调用获取审批流程数据方法
	sysCommon.getApproveFlowData("SZ_PAYMENT_APP");
	//当前登录人code
	paymentApply.saveData.applicantUser = $yt_common.user_info.userName;
	//paymentApply.start();
	//附件上传
	paymentApply.payeeAppenddix();
	//	事前申请弹窗方法
	paymentApply.beforehandApply();
	paymentApply.befAlertclear();
	paymentApply.befAlertok();
	//	所属专项名称弹窗方法
	paymentApply.specialAlertclear();
	paymentApply.specialAlertok();
	paymentApply.specialApply();
	$yt_baseElement.tableRowActive();
	paymentApply.whetherSpecial();
	//	表格的删除方法
	paymentApply.delPayment();
	paymentApply.delCompany();
	paymentApply.delPersonal();
	paymentApply.delOther();
	paymentApply.alertClearReceivables();
	paymentApply.alertReceivables();
	paymentApply.moneyFormat();
	paymentApply.updataReceivables();
	paymentApply.updataPersonal();
	paymentApply.updataOther();
	paymentApply.addListEvent();
	paymentApply.resetBtn();
	paymentApply.selectCost();
	paymentApply.submitPayment();
	paymentApply.savePayment();
	//附加事件绑定处理
	paymentApply.events();
	//获取数据字典
	//paymentApply.getDictInfoByTypeCode();
	paymentApply.getChoiceLoanList();
	paymentApply.getArrearsAmount();
	paymentApply.getPayeeNameList();
})