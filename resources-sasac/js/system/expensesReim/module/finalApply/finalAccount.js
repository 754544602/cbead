(function($, window) {
	var serveFunds = {
		saveData: {},
		beforeCostList: [], //事前审批数据
		expenditureList: [], //支出申请单数据
		addressList: "", //全局的地区数据
		selUsersName: "", //用户名
		selUsersCode: "", //用户code
		usersInfoList: "", //出差人集合
		usersInfoJson: "", //出差人json
		riskExcMark: "../../../../../resources-sasac/images/common/war-red.png", //风险感叹号图片
		riskWarImg: "../../../../../resources-sasac/images/common/risk-war.png", //风险未通过图片红灯
		riskViaImg: "../../../../../resources-sasac/images/common/risk-via.png", //风险通过图片绿灯
		/**
		 * 开始执行
		 */
		init: function() {
			var ts = this;
			//获取修改参数
			var pid = $yt_common.GetQueryString('appId');
			if(pid) {
				//参数存在时获取对应的详情数据
				ts.getFinalAppInfoByAppId(pid);
			} else {
				//获取费用类型
				ts.getCostTypeList();
				//所属预算项目
				ts.setBudgetItme();
				//初始显示通用支出
				ts.showGeneralFun();

			}
			//控件初始化
			ts.start();
			//事件处理
			ts.events();
			//附件上传
			ts.uploadFile();
			//获取当前登录用户信息
			sysCommon.getLoginUserInfo();
			//调用获取审批流程数据方法
			sysCommon.getApproveFlowData("SZ_FINAL_APP");
			//当前登录人code
			$('#applicantUser').val($yt_common.user_info.userName);
			//获取数据字典
			ts.getDictInfoByTypeCode();
			//获取人员信息
			ts.getBusiTripUsersList('');
			//点击下拉框显示
			ts.getArrearsAmount();
			//ts.getChoiceLoanList();
			//给收款方为个人弹出框表单中的本人单选赋值当前登录人code
			$("#userRadio").val($yt_common.user_info.userName);
			//本人单选事件
			$(".user-radio-label").change(function() {
				var userCode = $(this).find("input").val();
				//比对收款人下拉列表找到当前登录人并选中
				$('#payeeName option[value="' + userCode + '"]').prop("selected", "selected");
				//$("select#payeeName").niceSelect();
				serveFunds.setPayeeNameSelect(userCode);
				//读取部门职级
				var jobLevelName = $('#payeeName option[value="' + userCode + '"]').attr("jobLevelName");
				var deptName = $('#payeeName option[value="' + userCode + '"]').attr("deptName");
				$(".pe-department").text(deptName);
				$(".pe-rank").text(jobLevelName == "" ? "--" : jobLevelName);
				$(".display-rank,.dis-r").show();
				//清空收款人为单位的验证信息
				$("input.where-company").removeAttr("validform");
				setTimeout(function(){
					//隐藏当前单选
					$("label.user-radio-label").hide().removeClass("check");
					$("label.user-radio-label input").prop("checked",false);
				},200);
			});
		},
		/**
		 * 初始化组件
		 */
		start: function() {
			//数字文本框
			$yt_baseElement.numberInput($(".yt-numberInput-box"));
			//下拉列表
			$('select:not(.busi-addres-sel)').niceSelect();
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
		 * 根据人员信息获取借款单数据
		 * @param {Object} code
		 */
		getChoiceLoanList: function(code) {
			//收款人员code
			var userCode = $('#payeeName option:selected').val();
			$.ajax({
				type: "post",
				url: "sz/loanApp/getLoanAppInfoListToPageByParams",
				async: true,
				data: {
					queryParams: '', //queryParams 查询条件(编号, 事由)
					userCode: userCode, //userCode 人员code
					pageIndex: 1, //pageIndex 分页页数
					pageNum: 99999 //pageNum 分页条数
				},
				success: function(data) {
					//获取数据list
					var list = data.data.rows || [];
					//初始化HTML文本
					var opts = '<option value="">请选择</option>';
					//循环添加文本
					$.each(list, function(i, n) {
						opts += '<option ' + (code == n.loanAppId ? 'selected="selected"' : '') + ' arrearsAmount="' + n.loanAmount + '" value="' + n.loanAppId + '">' + n.loanAppNum + '</option>';
						if(code == n.loanAppId) {
							//借款单欠款金额
							$('.arrears-money').text(serveFunds.fmMoney(n.loanAmount));
						}
					});
					//替换页面代码
					$('#choiceLoan').html(opts).niceSelect();
				}
			});
		},
		//选择显示
		getArrearsAmount: function() {
			var me = this;
			$('#personalTotal').on('blur', function() {
				serveFunds.calculatePaymentAlertPerson();
			});

			$("#choiceLoan").change(function() {
				//计算金额
				serveFunds.calculatePaymentAlertPerson();
			});
			$("#witeOffPersonal").change(function() {
				var thischange = $("#witeOffPersonal").find("option:selected").val();
				if(thischange == 'LOAN_REVERSE') {
					$(".display-loan").show();
				} else {
					$(".display-loan").hide();
					$('.arrears-money,.the-reverse-money').text('0.00');
					$('.personal-writeoff-money').text($('#personalTotal').val());
				}
				//更换冲销方式重置借款单
				me.getChoiceLoanList();
			});
			$("#payeeName").change(function() {
				var jobLevelName = $("#payeeName").find("option:selected").attr("jobLevelName");
				var deptName = $("#payeeName").find("option:selected").attr("deptName");
				$(".pe-department").text(deptName);
				$(".pe-rank").text(jobLevelName);
				//初始化收款人控件
				//$("#payeeName").niceSelect();
				//赋值选中的用户名
				$("#payeeName").next().find(".current").text($("#payeeName").find("option:selected").attr("username"));
				//隐藏收款人为本人单选
				$("label.user-radio-label").hide().removeClass("check");
				$("#userRadio").prop("checked",false);
				var isChange = $("#payeeName").find("option:selected").val();
				if(isChange == 'external' || isChange == 'noUser') {
					$(".display-rank").show();
					$(".pe-department").text("外部人员");
					$(".dis-r").hide();
					$(".where-company").show();
					$("input.where-company").attr("validform", "{isNull:true,blurFlag:true,msg:'请输入收款人所在单位'}");
				} else {
					if(isChange == "") {
						$(".display-rank").hide();
					} else {
						$(".display-rank").show();
						$(".where-company").hide();
						$(".where-company").removeAttr("validform");
						$(".display-rank .valid-font").text("");
						$(".dis-r").show();
					}
				}
				//获取借款单号
				serveFunds.getChoiceLoanList();
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

				//借款单
				//var choiceLoan = tr.attr('choiceLoan');

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
				$('#perSpecial').text('无');
			});

			//付款列表删除
			$('.rece-msg').on('click', '.operate-del', function() {
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

		},
		/**
		 * 计算付款弹框个人的各项金额
		 */
		calculatePaymentAlertPerson: function() {
			//本次冲销金额：如果个人应收款小于欠款，本次冲销即为个人应收款，如果个人应收款等于欠款，本次冲销金额就是个人应收款。如果个人应收款大于借款，本次冲销的应为借款单欠款金额。

			//个人应收款
			var total = $yt_baseElement.rmoney($('#personalTotal').val());
			//欠款金额
			var arrearsAmount = $("#choiceLoan").find("option:selected").attr("arrearsAmount") || 0;
			//欠款金额
			$(".arrears-money").text($yt_baseElement.fmMoney(arrearsAmount));
			var outWriteAmount = total <= arrearsAmount ? total : arrearsAmount;
			$('.the-reverse-money').text($yt_baseElement.fmMoney(outWriteAmount));
			//个人应收总金额
			var personalTotal = $yt_baseElement.rmoney($('#personalTotal').val() || '0');
			//个人冲销后补领总金额 个人应收款总金额-本次冲销金额
			var writeTotal = personalTotal - outWriteAmount;
			writeTotal = writeTotal > 0 ? writeTotal : 0;
			$('.personal-writeoff-money').text(serveFunds.fmMoney(writeTotal));

		},
		/**
		 * 事件处理
		 */
		events: function() {
			var me = this;
			//附件删除事件
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

			//费用类型切换
			$('.docu-style-box').on('change', '.docu-style', function() {
				//var code = $(this).find('option:selected').attr('code');
				var iput = $('.docu-style:checked');
				var code = iput.val();
				var fun = iput.attr('fun');
				if(code) {
					//相关区域显示
					me[fun]();
					//判断选择的单据样式如果是差旅费,培训费,会议费,公务接待费设置事前申请单必填
					if(code == 'TRAVEL_APPLY' || code == 'TRAIN_APPLY' || code == 'MEETING_APPLY' || code == 'BH_APPLY') {
						//添加验证规则
						$('.prior-approval').attr('validform', '{isNull:true,msg:\'请选择事前申请单\'}');
						$('.befor-not').css('color', 'red');
					} else {
						//清除验证规则
						$('.prior-approval').removeClass("valid-hint").attr('validform', '{isNull:false,msg:\'请选择事前申请单\'}');
						$('.prior-approval').parent().find(".valid-font").text('');
						$('.befor-not').css('color', '#fff');
					}
				} else {
					$('.qtip-text-div').show();
					$('.mod-div').hide();
					$('.else-div').hide();
					$('.approve-div').hide();
				}
			});

			//是否为专项切换
			$('.special-type').change(function() {
				var val = $(this).val();
				if(val == '2') {
					$('.special-yes').hide();
					$('.special-no').show();
					//获取费用类型
					var name = $('select.expense-type option:selected').text();
					//替换余额字段内容
					$('.special-label').text(name + '余额：');

				} else {
					$('.special-yes').show();
					$('.special-no').hide();
				}
			});

			//清除事前申请单选中
			$('.clear-prior-approval').on('click', function() {
				//显示提示信息
				$yt_alert_Model.alertOne({
					alertMsg: '变更事前申请单后，从事前申请单导入的数据将清空是否确定变更事前申请单？',
					confirmFunction: function() {
						//事前申请单号
						$('.prior-approval').val('');
						//支出申请单号
						$('.expenditure-approval').val('');
						
						//可用余额
						$('#advanceAppBalance').text('0.00元');
						//显示相关联的按钮及字段
						$('.advance-relevance').hide();
						//赋值id
						$('#advanceAppId').val('');
						//隐藏导入按钮
						$('.index-main-div .export-but').hide();
						//清空已导入的数据
						me.clearPriorApproval();

						//隐藏清除按钮
						$('.clear-prior-approval').hide();
					}
				});
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

			//补领/返还方式 合计金额
			$('.amount-table .money-input').on('blur', function() {
				var body = $('.amount-table');
				//公务卡
				var official = Number(me.rmoney(body.find('.official').val() || '0'));
				//现金
				var cash = Number(me.rmoney(body.find('.cash').val() || '0'));
				//支票
				var cheque = Number(me.rmoney(body.find('.cheque').val() || '0'));
				//转账
				var transfer = Number(me.rmoney(body.find('.transfer').val() || '0'));
				//计算合计金额
				var total = official + cash + cheque + transfer;
				//补领金额大于0 的时候，补领方式合计金额不能超过补领金额。
				var replaceMoney = me.rmoney($('#replaceMoney').text());
				if(replaceMoney > 0 && total > replaceMoney) {
					$(this).focus();
					$yt_alert_Model.prompt('填写金额不能大于补领总金额');
				} else {
					//格式转换
					var rtotal = me.fmMoney(total);
					//赋值合计金额
					body.find('.total').text(rtotal).attr('num', total);
				}
			});

			//费用明细列表相关事件
			me.paymentListEvent();
			//选择事前审批单相关事件
			me.priorApprovalEvent();
			//选择支出申请单
		
			me.expenditureApprovalEvent();
			//填写对象信息相关事件
			//me.msgListEvent();
			//选择借款单相关事件
			me.borrowListEvent();
			//选择所属专项名称相关事件
			me.specialListEvent();
			//普通报销列表相关事件
			me.generalListEvent();
			//差旅费用相关事件
			//me.costApplyAlertEvent();
			//事前审批导入处理
			me.exportDataEvent();
			me.updataReceivables();
			me.updataPersonal();
			me.updataOther();
			//从事前导入按钮处理
			me.showTrainFun();

			//TAB切换方法
			$(".receipt-alert .cost-type-tab li").click(function() {
				//调用公共用的清空表单数据方法
				serveFunds.clearAlert($(".model-content"));
				//显示收款方为个人的收款人是本人单选
				$("label.user-radio-label").show();
				//隐藏为个人的部门职位单位
				$(".display-rank").hide();
				$('#cash,#officialCard,#transferAccounts').val('0.00');
				//情况其他数据
				$('.arrears-money').text(0.00);
				$('.pe-department,.pe-rank').text('');
				$('.receipt-alert .display-loan').hide();
				serveFunds.setPayeeNameSelect();
				$(this).addClass("tab-check").siblings().removeClass("tab-check");
				var tabIndex = $(this).index();
				$(".receipt-alert .tab-info").hide().eq(tabIndex).show();
				$yt_alert_Model.getDivPosition($('#cost-apply-model'));
			});
			//收款方弹框事件处理
			serveFunds.alertClearReceivables();
			//调用公用的差旅报销明细填写Tab页切换事件方法
			sysCommon.costDetailModelTabEvent();

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

			//页面取消按钮事件
			$("#cancelBtn").off().on('click', function() {
				window.history.back(-1);
			});

			//收款人姓名的change
			/*$('#payeeName').on('change', function(){
				var val = $(this).find('option:selected').val();
				if(val == 'external'){
					$(this).next().find('.search-current').val('');
				}
			});*/

			//提交按钮事件
			me.setSubmitEvent();
			//保存按钮事件
			me.setSaveEvent();
		},
		/**
		 * 设置提交按钮的点击事件
		 */
		setSubmitEvent: function() {
			var me = this;
			//生成报销单
			$('#submitPayment').on('click', function() {
				var thisBtn = $(this);
				//禁用当前按钮
				$(this).attr('disabled',true).addClass('btn-disabled');
				//必填列表验证
//				var tableVerigfy = me.verifySubmitTableLenght();
//				if($yt_valid.validForm($('.base-info-form-modle,.approve-div,.verify-div')) && tableVerigfy) {
				if($yt_valid.validForm($('.base-info-form-modle,.approve-div,.verify-div'))) {
//					//收款总金额
//					var replaceMoney = function() {
//						return(serveFunds.rmoney($('table.payee-unit .payee-unit-total .payee-unit-money').text()) + serveFunds.rmoney($('table.payee-personal .payee-personal-total .payee-personal-money').text()) + serveFunds.rmoney($('table.payee-other .payee-other-total .payee-other-total-money').text()));
//					};
//					//申请支出总金额
//					var total = serveFunds.rmoney($('#applyTotalMoney').text());
//					//收款方为单位金额合计+收款方为个人个人冲销后补领金额合计+收款方为其他金额合计必须等于个人冲销后补领总金额
//					if(total == replaceMoney()) {
//						//验证部门预算余额与申请金额
//						var verifyBudgetExpendSum = me.verifyBudgetExpendSum();
//						if(verifyBudgetExpendSum) {
							// 获取数据
							var data = me.getSubData();
							//判断是否选择了事前申请单
//							if($('.prior-approval').val()) {
//								//判断事前申请可用余额与支出总金额
//								//事前余额
//								var advan = serveFunds.rmoney($('#advanceAppBalance').text().replace('元', ''));
//								//支出总金额
//								var total = serveFunds.rmoney($('#applyTotalMoney').text());
//								if(total > advan) {
//									$yt_alert_Model.prompt('申请支出总金额不能大于事前申请单可用余额');
//								} else {
//									//保存方法
//									me.submitExpenditureAppInfo(data, thisBtn);
//								}
//							} else {
								//保存方法
								me.submitFinalAppInfo(data, thisBtn);
								//删除禁用
								$(thisBtn).attr('disabled',false).removeClass('btn-disabled');
//							}
//						}
//					} else {
//						$yt_alert_Model.prompt('所有收款方收款金额合计必须等于申请支出总金额');
//					}
				} else {
					sysCommon.pageToScroll($("body .valid-font"));
					//删除禁用
					$(thisBtn).attr('disabled',false).removeClass('btn-disabled');
				}
			});
		},
		/**
		 * 保存按钮事件
		 */
		setSaveEvent: function() {
			var me = this;
			//保存草稿
			$('#savePayment').on('click', function() {
				var thisBtn = $(this);
				//禁用并移除所有的事件
				thisBtn.off();
				// 获取数据
				var data = me.getSubData();
				//保存方法
				me.submitFinalAppInfoToDrafts(data, thisBtn);
			});
		},
		/*
		 * 
		 * 上传附件
		 * 
		 * */
		uploadFile: function() {
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
						//图片预览
						$('#attIdStr .file-pv img').showImg();
					},
					error: function(data, status, e) {
						$yt_alert_Model.prompt(data.message);
					}
				});

			});

			//图片下载
			/*$('#attIdStr').on('click', '.file-dw', function() {
				var id = $(this).parent().attr('fid');
				window.location.href = $yt_option.base_path + 'fileUpDownload/download?pkId=' + id + '&isDownload=true';
			});*/

		},
		/**
		 * 导入数据时对选中的单据类型和事前申请单类型验证
		 */
		verifyCostTypeExport: function() {
			//选中的单据类型
//			var costType = $('.docu-style-box .check input').val();
			//设置培训类别costType值
			var costType = "TRAIN_APPLY";
			//事前申请单类型
			var beforType = $('.prior-approval').attr('costType');
			return costType == beforType;
		},
		/**
		 * 事前审批导入事件处理
		 */
		exportDataEvent: function() {
			var me = this;

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
				});
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
				});
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
					//隐藏
					me.hidePaymentAlert();
				} else {
					$('#paymentList tbody .last').before(html);
					$yt_alert_Model.prompt('填写的信息已成功加入到列表');
				}
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
			var unitCount = 0;
			$('table.payee-unit tbody tr:not(.payee-unit-total)').each(function() {
				unitCount += serveFunds.rmoney($(this).find('.unitTotal').text());
			});
			$('table.payee-unit .payee-unit-money').text(serveFunds.fmMoney(unitCount));

			var perCount = 0;
			$('table.payee-personal tbody tr:not(.payee-personal-total)').each(function() {
				perCount += serveFunds.rmoney($(this).find('.personalTotal').text());
			});
			$('table.payee-personal .payee-personal-money').text(serveFunds.fmMoney(perCount));

			var perCount = 0;
			$('table.payee-other tbody tr:not(.payee-other-total)').each(function() {
				perCount += serveFunds.rmoney($(this).find('.otherTotal').text());
			});
			$('table.payee-other .payee-other-total-money').text(serveFunds.fmMoney(perCount));

			/*var tds = $('#paymentList tbody .money');
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
			var outstandingBalance = serveFunds.rmoney($('#outstandingBalance').text());
			//冲销金额：只读信息，读取逻辑：如果报销金额小于借款单可用余额，则读取报销总额；如果报销金额大于等于借款单可用余额，则读取借款单可用余额
			var writeOffAmount = total >= outstandingBalance ? outstandingBalance : total;
			$('#writeOffAmount,#outWriteAmount').text(serveFunds.fmMoney(writeOffAmount));
			// 补领金额：计算项，计算逻辑：如果报销金额小于借款单可用余额，则为0.00；如果报销金额大于等于借款单可用余额，则报销金额-冲销金额的金额值
			var replaceMoney = total >= outstandingBalance ? total - writeOffAmount : 0;
			$('#replaceMoney').text(serveFunds.fmMoney(replaceMoney));
			//报销后借款单余额：计算项，计算逻辑：如果报销金额小于借款单可用余额，则借款单可用余额-报销金额；如果报销金额大于风雨借款单可用余额；则显示为0.00
			$('#balanceMoney').text(serveFunds.fmMoney(total < outstandingBalance ? outstandingBalance - total : '0'));*/
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
			/*if(replaceMoney <= 0) {
				//补领金额是零的时候 ，补领方式 几个输入框禁用，默认值都是0.
				$('#officialCard,#cash,#cheque').val('0').attr('disabled', true);
				$('.amount-table .total').text('0');
			} else {
				$('#officialCard,#cash,#cheque').attr('disabled', false);
			}*/
			$('#replaceMoney').text(serveFunds.fmMoney(replaceMoney));
			//报销后借款单余额：计算项，计算逻辑：如果报销金额小于借款单可用余额，则借款单可用余额-报销金额；如果报销金额大于风雨借款单可用余额；则显示为0.00
			$('#balanceMoney').text(serveFunds.fmMoney(total < outstandingBalance ? outstandingBalance - total : '0'));
		},
		/**
		 * 修改表格行内容
		 * @param {Object} tr
		 */
		updatePaymentList: function(tr) {},
		/**
		 * 选择事前审批单相关事件
		 */
		priorApprovalEvent: function() {
			var me = this;

			//弹出框显示
			$('.prior-approval').click(function() {
				//获取数据
				me.getPriorApprovalList();
				//显示弹框及蒙层
				$yt_baseElement.showMongoliaLayer();
				$yt_alert_Model.getDivPosition($('.prior-alert'));
				$('#pop-modle-alert').show();
				$('.prior-alert').show();
			});
			//确定事件
			$('.prior-common').click(function() {
				//选中行的对象
				var tr = $('.prior-approval-list .yt-table-active');
				//选中行的code
				var code = tr.attr('code');
				//专项名称
				var name = tr.find('.sname').text();
				//事前申请id
				var id = tr.attr('pid');
				//费用类型
				var types = tr.attr('type');
				//可用余额
				var balance = tr.find('.balance').val();
				//已存在的事前申请单
				var thisVal = $('.prior-approval').val();
				if(thisVal && thisVal != code) {
					//提示信息
					$yt_alert_Model.alertOne({
						alertMsg: "变更事前申请单后，从事前申请单导入的数据将清空是否确定变更事前申请单？", //提示信息  
						confirmFunction: function() { //点击确定按钮执行方法  
							if(code) {
								//清空导入数据
								me.clearPriorApproval();
								//获取事前申请数据
								me.getAdvanceAppInfoDetailByAdvanceAppId(id);
								//me.getExpenditureList();
								//赋值事前申请单号  清除验证样式及内容
								$('.prior-approval').val(code).attr('costType', types).removeClass('valid-hint').nextAll().find('.valid-font').text('');
								//支出申请单号
								$('.expenditure-approval').val('');
								//可用余额
								$('#advanceAppBalance').text(balance ? serveFunds.fmMoney(balance) + '元' : '--');
								//培训费提示文字
								if(types == "TRAIN_APPLY") {
									$("#noContain").show();
								} else {
									$("#noContain").hide();
								}
								//显示相关联的按钮及字段
								$('.advance-relevance').show();
								//赋值id
								$('#advanceAppId').val(id);
								//隐藏弹框及蒙层
								$yt_baseElement.hideMongoliaLayer();
								$('.prior-alert').hide();
								$('#pop-modle-alert').hide();
								//显示清除按钮
								$('.clear-prior-approval').show();
								//成功后显示导入按钮 .index-main-div 
								$('.export-but').show();
							} else {
								$yt_alert_Model.prompt('请选择一条数据');
							}
						}
					});
				} else {
					if(code) {
						//清空导入数据
						me.clearPriorApproval();
						//获取事前申请数据
						me.getAdvanceAppInfoDetailByAdvanceAppId(id);
						me.getExpenditureList();
						//赋值事前申请单号  清除验证样式及内容
						$('.prior-approval').val(code).attr('costType', types).removeClass('valid-hint').nextAll().find('.valid-font').text('');
						//赋值支出申请单号
						//me.setExpenditureVal();
						//可用余额
						$('#advanceAppBalance').text(balance ? serveFunds.fmMoney(balance) + '元' : '--');
						//培训费提示文字
						if(types == "TRAIN_APPLY") {
							$("#noContain").show();
						} else {
							$("#noContain").hide();
						}
						//显示相关联的按钮及字段
						$('.advance-relevance').show();
						//赋值id
						$('#advanceAppId').val(id);
						//隐藏弹框及蒙层
						$yt_baseElement.hideMongoliaLayer();
						$('.prior-alert').hide();
						$('#pop-modle-alert').hide();
						//显示清除按钮
						$('.clear-prior-approval').show();
						//成功后显示导入按钮.index-main-div 
						$('.export-but').show();
						//清空事前申请单输入框验证提示信息
						$(".prior-approval").parent().find(".valid-font").text('');
					} else {
						$yt_alert_Model.prompt('请选择一条数据');
					}
				}
			});		

			//取消事件
			$('.prior-cancel').click(function() {
				//隐藏弹框及蒙层
				$yt_baseElement.hideMongoliaLayer();
				$('.prior-alert').hide();
				$('#pop-modle-alert').hide();
				//清空
				$('.prior-approval-val').val('');
				//获取数据
				me.getPriorApprovalList();
			});

			//查询按钮
			$('.prior-approval-search').click(function() {
				//获取数据
				me.getPriorApprovalList();
			});

			//重置按钮
			$('.prior-approval-reset').click(function() {
				$('.prior-approval-val').val('');
				//获取数据
				me.getPriorApprovalList();
			});

		},
		//赋值支出申请单号 
		setExpenditureVal:function(){
			//获取支出申请单数组
			if(serveFunds.expenditureList.rows.length > 0){
				var expenditureNum =''; 
				$.each(serveFunds.expenditureList.rows,function(i,n){
					expenditureNum += n.appNum + ',';
				})
				//去掉末尾逗号
				expenditureNum = expenditureNum.slice(0,expenditureNum.length-1);
				$('.expenditure-approval').val(expenditureNum);
			}else{
				$('.expenditure-approval').val('');
			}
		},
		/**
		 * 选择支出单相关事件
		 */
		expenditureApprovalEvent: function() {
			var me = this;
			//弹出框显示
			$('.expenditure-approval').click(function() {
				if($(".prior-approval").val()==''){
					$yt_alert_Model.alertOne({
						alertMsg: "请选择事前申请单"
					});
					return ;
				}

				//获取数据
				  
				me.getExpenditureList();
				//显示弹框及蒙层
				$yt_baseElement.showMongoliaLayer();
				$yt_alert_Model.getDivPosition($('.expenditure-alert'));
				$('#pop-modle-alert').show();
				$('.expenditure-alert').show();
			});
						
			//取消事件
			$('.expenditure-cancel').click(function() {
				//隐藏弹框及蒙层
				$yt_baseElement.hideMongoliaLayer();
				$('.expenditure-alert').hide();
				$('#pop-modle-alert').hide();
				//清空
				$('.expenditure-approval-val').val('');
				//获取数据
				me.getExpenditureList();
			});

			//查询按钮
			$('.expenditure-approval-search').click(function() {
				//获取数据
				me.getExpenditureList();
			});

			//重置按钮
			$('.expenditure-approval-reset').click(function() {
				$('.expenditure-approval-val').val('');
				//获取数据
				me.getExpenditureList();
			});
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

				});
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
				});
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
					//隐藏
					me.hideMsgAlert();
				} else {
					$('.msg-list').append(html);
					$yt_alert_Model.prompt('填写的信息已成功加入到列表');
				}
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
		 * 普通报销填写相关事件
		 */
		generalListEvent: function() {
			var me = this;
			//新增按钮
			$('.add-general').click(function() {
				//显示弹框
				me.showGeneralAlert();
				//重置按钮
				$('.general-common').off().on('click', function() {
					me.appendGeneralList();
				});
			});
			//取消
			$('.general-cancel').click(function() {
				//隐藏
				me.hideGeneralAlert();
				//清空
				me.clearAlert($('.general-alert'));
			});

			//列表内删除
			$('.general-list').on('click', '.operate-del', function() {
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
			$('.general-list').on('click', '.operate-update', function() {
				var ithis = $(this);
				var tr = ithis.parents('tr');
				//数据回显
				//报销费用内容
				var cont = $('#generalCostContent').val(tr.attr('cont'));
				//金额
				var sum = $('#generalSum').val(tr.attr('num'));
				//显示弹框
				me.showGeneralAlert();
				//重置按钮
				$('.general-common').off().on('click', function() {
					me.appendGeneralList(tr);
				}).text('确定');
			});

		},
		/**
		 * 显示普通报销填写弹出框
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
		/**
		 * 隐藏普通报销填写弹出框
		 */
		hideGeneralAlert: function() {
			//隐藏弹框及蒙层
			$yt_baseElement.hideMongoliaLayer();
			$('.general-alert').hide();
			$('#pop-modle-alert').hide();
		},
		/**
		 * 普通报销列表新增修改
		 * @param {Object} tr
		 */
		appendGeneralList: function(tr) {
			var me = this;
			//报销费用内容
			var cont = $('#generalCostContent').val();
			//金额
			var sum = $('#generalSum').val();

			if(cont && sum) {
				//转换格式
				var num = $yt_baseElement.rmoney(sum);
				var html = '<tr cont="' + cont + '" sum="' + num + '"  class="">' +
					'<td style="text-align:left;" class="">' + cont + '</td>' +
					'<td style="text-align: right;" class="">' + sum + '</td>' +
					'<td></td>' +
					'<td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span> <span class="operate-del" style=""><img src="../../../../../resources-sasac/images/common/del-icon.png"></span> </td>' +
					' </tr>';

				if(tr) {
					//已经存在的进行替换
					tr.replaceWith(html);
				} else {
					//追加
					$('#generalList tbody .last').before(html);
				}
				//隐藏弹框
				me.hideGeneralAlert();
				//清空表单
				me.clearAlert($('.general-alert'));

			} else {
				$yt_alert_Model.prompt('请填写完整数据');
			}

		},
		/**
		 * 差旅费列表相关事件
		 */
		costApplyAlertEvent: function() {},
		/**
		 * 显示补助明细弹框
		 */
		showSubsidiesAlert: function() {
			var me = this;
			//获取弹框对象
			var alert = $('#subdisyInfoAlert');
			//显示弹框及蒙层
			$yt_baseElement.showMongoliaLayer();
			$yt_alert_Model.getDivPosition(alert);
			$('#pop-modle-alert').show();
			alert.show();
		},
		/**
		 * 隐藏补助明细弹框
		 */
		hideSubsidiesAlert: function() {
			//隐藏弹框及蒙层
			$yt_baseElement.hideMongoliaLayer();
			$('#subdisyInfoAlert').hide();
			$('#pop-modle-alert').hide();
		},
		/**
		 * 显示行程明细新增弹框
		 */
		showTripAlert: function() {
			var me = this;
			//获取弹框对象
			var alert = $('#busiPlanEditModel');
			//调用行程表单出差地点事件
			//获取住宿地点
			me.setAddress();
			//显示弹框及蒙层
			$yt_baseElement.showMongoliaLayer();
			$yt_alert_Model.getDivPosition(alert);
			$('#pop-modle-alert').show();
			alert.show();
		},
		/**
		 * 隐藏行程明细新增弹框
		 */
		hideTripAlert: function() {
			//隐藏弹框及蒙层
			$yt_baseElement.hideMongoliaLayer();
			$('#busiPlanEditModel').hide();
			$('#pop-modle-alert').hide();
		},

		/**
		 * 显示新增差旅费用明细弹框
		 */
		showCostApplyAlert: function() {
			var me = this;
			//获取弹框对象
			var alert = $('#costApplyAlert');
			//获取出差人
			me.setModelUsers();
			//调用获取出差地点方法
			me.setAddress();
			me.getPlanBusiAddress($("#fromcity"));
			me.getPlanBusiAddress($("#tocity"));
			//显示弹框及蒙层
			$yt_baseElement.showMongoliaLayer();
			$yt_alert_Model.getDivPosition(alert);
			$('#pop-modle-alert').show();
			alert.show();

		},
		/**
		 * 隐藏新增差旅费用明细弹框
		 */
		hideCostApplyAlert: function() {
			//隐藏弹框及蒙层
			$yt_baseElement.hideMongoliaLayer();
			$('#costApplyAlert').hide();
			$('#pop-modle-alert').hide();
		},
		/**
		 * 添加修改行程明细表格
		 */
		appendTripList: function(tr) {
			var me = this;
			//显示出行程计划编辑框
			var planModel = $("#busiPlanEditModel");
			//出差类型
			var modelBusiType = $('#modelBusiType option:selected');
			//类型名称
			var name = modelBusiType.text();
			//类型code
			var code = modelBusiType.val();
			//开始日期
			var tdStartDate = $('#tdStartDate').val();
			//结束日期
			var tdEndDate = $('#tdEndDate').val();
			//1. 把开始时间和结束时间保存
			var dateFrom = new Date(tdStartDate);
			var dateTo = new Date(tdEndDate);
			//2. 计算时间差
			var diff = dateTo.valueOf() - dateFrom.valueOf();
			//3. 时间差转换为天数
			var diff_day = parseInt(diff / (1000 * 60 * 60 * 24));
			//出差天数
			var day = diff_day + 1;
			//出差地点
			var modelBusiAddres = $('#modelBusiAddres option:selected').val();
			var budiAddName = $('#modelBusiAddres').next().find('.search-current').val();
			//出差人
			var busiUsersName = $("#modelBusiUser").val(); //出差人名称
			var busiUsersCode = $("#modelUserCodes").val(); //出差人code
			//出差人数
			var busiNum = $(".model-user-num-show .users-num").text(); //出差人数
			//接待方承担费用
			var receptionMoney = ""; //名称
			var receptionMoneyCode = ""; //code
			if(planModel.find(".check-label.check").length > 0) {
				planModel.find(".check-label.check").each(function(i, n) {
					receptionMoney += $(n).find("span").text() + "、";
					receptionMoneyCode += $(n).find("input").val() + ",";
				});
				receptionMoney = receptionMoney.substring(0, receptionMoney.length - 1);
				receptionMoneyCode = receptionMoneyCode.substring(0, receptionMoneyCode.length - 1);
			} else {
				receptionMoney = "--";
			}
			var html = '<tr busicode="' + code + '" usercode="' + busiUsersCode + '" rececode="' + receptionMoneyCode + '" >' +
				'<td><input type="hidden" class="hid-user-code" value="' + busiUsersCode + '" /> <span class="name">' + name + '</span></td>' +
				'<td class="sdate">' + tdStartDate + '</td>' +
				'<td class="edate">' + tdEndDate + '</td>' +
				'<td class="day">' + day + '</td>' +
				'<td class="address" val="' + modelBusiAddres + '">' + budiAddName + '</td>' +
				'<td class="uname">' + busiUsersName + '</td>' +
				'<td class="numof">' + busiNum + '</td>' +
				'<td class="reception">' + receptionMoney + '</td>' +
				'<td>' +
				'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
				'<span class="operate-del" style=""><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
				'</td>' +
				'</tr>';

			//验证数据
			if($yt_valid.validForm($('#busiPlanEditModel'))) {
				if(tr) {
					//存在替换
					tr.replaceWith(html);
					//隐藏弹框
					me.hideTripAlert();
				} else {
					//不存在添加
					$('#tripList tbody').append(html);
					//提示添加成功
					$yt_alert_Model.prompt('填写的信息已成功加入到列表');
				}
				$("#busiUserInfo ul li").removeClass("tr-check");
				$("#busiUserInfo").removeClass("check");
				//清空存储出差人的数据
				me.selUsersName = "";
				me.selUsersCode = "";
				//显示自动计算文字
				$('.auto-font').show();
				//隐藏出差人数
				$('.model-user-num-show').hide();
				me.clearAlert($('#busiPlanEditModel'));
				$('#modelBusiAddres').html('<option value="">请选择</option>');
				//更新费用明细弹框中的出差人列表
				//me.getModelUsersInfo();
				//更新补助明细内容
				me.setSubsidyList();
				//获取住宿地点
				me.setAddress();
			}

		},
		/**
		 * 修改行程明细列表时重新设置弹出框数据
		 * @param {Object} tr
		 */
		setTripAlertData: function(tr) {
			//显示出行程计划编辑框
			var planModel = $("#busiPlanEditModel");
			//出差类型
			var modelBusiType = $('#modelBusiType option[value="' + tr.attr('busicode') + '"]').attr('selected', true);
			$('#modelBusiType').niceSelect();
			//开始日期
			var tdStartDate = $('#tdStartDate').val(tr.find('.sdate').text());
			//结束日期
			var tdEndDate = $('#tdEndDate').val(tr.find('.edate').text());
			//出差地点
			var modelBusiAddres = $('#modelBusiAddres').html('<option value="' + tr.find('.address').attr('val') + '">' + tr.find('.address').text() + '</option>');
			//出差人
			var busiUsersName = $("#modelBusiUser").val(tr.find('.uname').text()); //出差人名称
			var busiUsersCode = $("#modelUserCodes").val(tr.attr('usercode')); //出差人code
			//出差人数
			var busiNum = $(".model-user-num-show .users-num").text(tr.find('.numof').text()); //出差人数
			//接待方承担费用
			var rececode = tr.attr('rececode');
			//拆分字符串
			var receList = rececode.split(',');
			//循环选择
			$.each(receList, function(i, n) {
				if(n) {
					planModel.find('.check-label input[value="' + n + '"]').setCheckBoxState('check');
				}
			});

			serveFunds.getPlanBusiAddress($("#modelBusiAddres"));

		},
		/**
		 * 新增差旅费用明细列表
		 * @param {Object} tr
		 */
		appendCostApplyList: function(tabFlag, tr) {
			var me = this;
			if(tabFlag == 0) {
				//调用获取获取拼接交通费数据方法
				me.getTrafficCostFormInfo(tr);
			}
			if(tabFlag == 1) {
				//调用获取获取拼接住宿费数据方法
				me.getHotelFormInfo(tr);
			}
			if(tabFlag == 2) {
				//调用获取获取拼接其他费数据方法
				me.getOtherCostFormInfo(tr);
			}
		},
		/**
		 * 获取拼接交通费数据方法
		 */
		getTrafficCostFormInfo: function(tr) {
			var me = this;
			//获取交通费模块对象
			var trabfficObj = $(".traffic-form");
			//调用公用的拼接合计行方法
			sysCommon.createSumTr(0);
			//出差人
			var tripUser = trabfficObj.find("#model-trip-user option:selected").text();
			var userCode = trabfficObj.find("#model-trip-user option:selected").val();
			//出差人级别
			var level = trabfficObj.find("#model-trip-user option:selected").attr("data-level");
			var levelCode = trabfficObj.find("#model-trip-user option:selected").attr("data-level-code");
			//出发日期
			var trafficStartTime = $('#traffic-start-time').val();
			//到达日期
			var trafficEndTime = $('#traffic-end-time').val();
			//出发地点
			var fromcityName = $('#fromcity').next().find('.search-current').val();
			var fromcity = $('#fromcity option:selected').val();
			//到达地点
			var tocityName = $('#tocity option:selected').text();
			var tocity = $('#tocity option:selected').val();
			//特殊说明
			var specialRemark = $('#special-remark').val();
			//获取交通工具文本信息
			var vehicle = "";
			var vehicleCode = "";
			vehicleCode = trabfficObj.find(".vehicle-sel").val();
			var vehicleChildCode = "";
			vehicleChildCode = (trabfficObj.find(".vehicle-two-sel").val() == null ? "" : trabfficObj.find(".vehicle-two-sel").val());
			//判断如果二级菜单没有选中
			if($(".vehicle-two-sel").val() != "" && $(".vehicle-two-sel").val() != null) {
				vehicle = trabfficObj.find(".vehicle-sel option:selected").text() + trabfficObj.find(".vehicle-two-sel option:selected").text();
			} else {
				vehicle = trabfficObj.find(".vehicle-sel option:selected").text();
			}

			//城市交通费
			var cityMoney = trabfficObj.find(".city-cost-input").val();
			//拼接交通费表格数据
			var trafficCostStr = '<tr>' +
				'<td><span>' + tripUser + '</span>' +
				'<input type="hidden" data-val="travelPersonnel" class="hid-traf-users" value="' + userCode + '" risk-code-val="trafficBusiUsers"/>' +
				'</td><td><span>' + level + '</span><input type="hidden" class="hid-level-code" value="' + levelCode + '" risk-code-val="trafficBusiUsersLevel"/></td>' +
				'<td data-text="goTime"><span risk-code-val="traExpStartDate">' + trafficStartTime + '</span></td>' +
				'<td><input data-val="goAddress" type="hidden" value="' + fromcity + '"><span data-text="goAddressName">' + fromcityName + '</span></td>' +
				'<td data-text="arrivalTime"><span  risk-code-val="traExpEndDate">' + trafficEndTime + '</span></td>' +
				'<td><input data-val="arrivalAddress" type="hidden" value="' + tocity + '"> <span data-text="arrivalAddressName">' + tocityName + '</span></td>' +
				'<td><span data-text="vehicle">' + vehicle + '</span>' +
				'<input type="hidden" class="hid-vehicle" value="' + vehicleCode + '" risk-code-val="vehicleParent"/>' +
				'<input type="hidden" class="hid-child-code" value="' + vehicleChildCode + '"  risk-code-val="vehicleChild"/></td>' +
				'<td class="font-right money-td" data-text="crafare" risk-code-val="cityTrafficCost">' + (cityMoney == '' ? "--" : $yt_baseElement.fmMoney(cityMoney)) + '</td>' +
				'<td class="text-overflow-sty" data-text="remarks" title="' + specialRemark + '">' + (specialRemark == "" ? "--" : specialRemark) + '</td>' +
				'<td>' +
				'<input type="hidden" class="hid-cost-type" value="0"/>' +
				'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>' +
				'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>' +
				'</td></tr>';

			//存在为替换
			if(tr) {
				tr.replaceWith(trafficCostStr);
				//隐藏弹出框
				me.hideCostApplyAlert();
			} else {
				//不存在新增
				$("#traffic-list-info tbody .total-last-tr").before(trafficCostStr);
				//提示保存至列表成功
				$yt_alert_Model.prompt('填写的信息已成功加入到列表');
			}

			//调用合计方法
			me.updateMoneySum(0);
			//清空弹框内数据
			//me.clearAlert($('#costApplyAlert .traffic-form'));
			//调用关闭可编辑弹出框方法
			me.clearFormData();
			//改变风险灯图标绿灯
			//$("#traffic-list-info").parent().find(".cost-list-title .risk-img").attr("src", busiTripApply.riskViaImg);

		},
		/***
		 * 设置交通费弹框数据
		 * @param {Object} tr
		 */
		setFormInfo: function(thisTr) {
			var me = this;
			//获取费用类型0.交通1.住宿2.其他
			var costType = $(thisTr).find(".hid-cost-type").val();
			//交通费
			if(costType == 0) {
				//获取出差人的code
				var busiUser = $(thisTr).find("td:eq(0) .hid-traf-users").val();
				//获取出发日期
				var startDate = $(thisTr).find("td:eq(2)").text();
				//获取出发地点
				var startAddre = $(thisTr).find("td:eq(3)").text();
				var startVal = $(thisTr).find("td:eq(3)").attr('val');
				//到达日期
				var endDate = $(thisTr).find("td:eq(4)").text();
				//获取到达地点
				var endAddre = $(thisTr).find("td:eq(5)").text();
				var endVal = $(thisTr).find("td:eq(5)").attr('val');
				//获取交通工具code
				var vehicles = 0;
				if($(thisTr).find("td:eq(6) input:eq(0)").val().indexOf(".") != -1) {
					vehicles = $(thisTr).find("td:eq(6) input:eq(0)").val().split(".");
				}
				var vehicle = "";
				//获取子级交通工具code
				var vehicleChildCode = "";
				if(vehicles.length > 0) {
					vehicle = vehicles[1];
					vehicleChildCode = vehicles[2];
				} else {
					vehicle = $(thisTr).find("td:eq(6) input:eq(0)").val();
					vehicleChildCode = $(thisTr).find("td:eq(6) .hid-child-code").val();
				}
				//获取城市交通费
				var cityMoney = $(thisTr).find("td:eq(7)").text();
				//获取特殊说明
				var cityMsg = $(thisTr).find("td:eq(8)").text();

				$('#model-trip-user option[value="' + busiUser + '"]').attr("selected", "selected");
				$("#traffic-start-time").val(startDate);
				$("#traffic-end-time").val(endDate);
				$("#fromcity").html('<option value="' + startVal + '">' + startAddre + '</option>');
				$("#tocity").html('<option value="' + endVal + '">' + endAddre + '</option>');
				$('.traffic-form .vehicle-sel option[value="' + vehicle + '"]').attr("selected", "selected");
				if(vehicleChildCode != "") {
					//显示出二级交通工具下拉
					$("#vehicleTwoDiv").css('display', 'inline-block');
					//调用公用方法根据一级交通工具获取二级交通工具
					sysCommon.vechicleChildData(vehicle);
					$('.traffic-form .vehicle-two-sel option[value="' + vehicleChildCode + '"]').attr("selected", "selected");
				}
				$(".traffic-form .city-cost-input").val(cityMoney);
				$("#special-remark").val((cityMsg == "--" ? "" : cityMsg));
				$('#model-trip-user,.traffic-form .vehicle-sel,.traffic-form .vehicle-two-sel').niceSelect();
				//调用获取出差地点方法
				me.getPlanBusiAddress($("#fromcity"));
				me.getPlanBusiAddress($("#tocity"));

				//改变风险灯
				if(vehicle != "" || vehicleChildCode != "") {
					$(".vehicle-sel").parents("td").find(".risk-img").attr("src", me.riskViaImg);
				}
			}
			//住宿费
			if(costType == 1) {
				//获取出差人的code
				var busiUser = $(thisTr).find("td:eq(0) input").val();
				//人均花销
				var dayMoney = $(thisTr).find("td:eq(2)").text();
				//住宿天数
				var hotelDay = $(thisTr).find("td:eq(5)").text();
				//住宿费
				var hotelMoney = $(thisTr).find("td:eq(6)").text();
				//住宿日期
				//var hotelDate = $(thisTr).find("td:eq(2)").text();
				//住宿地点
				var hotelAddress = $(thisTr).find("td:eq(7) input").val();
				//入住日期
				var sDate = $(thisTr).find('.sdate').text();
				$('.hotel-form #hotelDate').val(sDate);
				//离开日期
				var eDate = $(thisTr).find('.edate').text();
				$('.hotel-form #leaveDate').val(eDate);

				hotelAddress = hotelAddress.split("-");
				var hotelAddressName = $(thisTr).find('td:eq(7) span').text().split('-');
				///获取特殊说明
				var textareMsg = $(thisTr).find("td:eq(8)").text();
				$('#hotel-trip-user').val(busiUser);
				//$('#hotel-trip-user option[value="' + busiUser + '"]').attr("selected", "selected");
				$(".hotel-form .hotel-num").text(hotelDay);
				if(hotelAddress.length == 3) {
					$('#hotelParentAddress').html('<option value="' + hotelAddress[0] + '">' + hotelAddressName[0] + '</option>');
					$('#hotelTwoAddres').html('<option value="' + hotelAddress[1] + '">' + hotelAddressName[1] + '</option>');
					$('#hotelChildAddres').html('<option value="' + hotelAddress[2] + '">' + hotelAddressName[2] + '</option>');
					//me.hotelAddressChild(hotelAddress[0], "CITY");
					//me.hotelAddressArea(hotelAddress[1], "AREA");
				} else if(hotelAddress.length == 2) {
					$('#hotelChildAddres').html('<option value="' + hotelAddress[1] + '">' + hotelAddressName[1] + '</option>');
					//me.hotelAddressChild(hotelAddress[0], "CITY");
				}
				//住宿地点选中
				/*$.each(hotelAddress, function(i, n) {
					$('.hotel-addres-sel option[value="' + n + '"]').prop("selected", "selected");
				});*/
				$(".hotel-form .hotel-money").val(hotelMoney);
				$("#peoDayMoney").text(dayMoney);
				//$("#hotelDate").val(hotelDate);
				$(".hotel-form .hotel-msg").val((textareMsg == "--" ? "" : textareMsg));
				me.setAddress();
				$('#hotel-trip-user').niceSelect();
				//调用设置住宿费子级无数据设置禁用方法
				me.hotelChildDisa(hotelAddress[0], "CITY");
				//调用设置住宿费子级无数据设置禁用方法
				me.hotelChildDisa(hotelAddress[1], "AREA");
			}
			//其他费用
			if(costType == 2) {
				//获取费用类型的code
				var costType = $(thisTr).find("td:eq(0) input").val();
				//费用金额
				var costMoney = $(thisTr).find("td:eq(1)").text();
				///获取特殊说明
				var textareMsg = $(thisTr).find("td:eq(2)").text();
				$('#cost-type option[value="' + costType + '"]').attr("selected", "selected");
				$(".other-form .other-money").val(costMoney);
				$(".other-form .other-msg").val((textareMsg == "--" ? "" : textareMsg));
				$('#cost-type').niceSelect();
			}
		},
		/**
		 * 获取拼接住宿费数据方法
		 */
		getHotelFormInfo: function(tr) {
			var me = this;
			//获取交通费模块对象
			var hotelObj = $(".hotel-form");
			//调用公用的拼接合计行方法
			sysCommon.createSumTr(1);
			//出差人
			var tripUser = hotelObj.find("select.hotel-trip-user-sel option:selected").text();
			//出差人级别
			var level = hotelObj.find("select.hotel-trip-user-sel option:selected").attr("data-level");
			//出差人界别code
			var levelCode = hotelObj.find("select.hotel-trip-user-sel option:selected").attr("data-level-code");
			//住宿地址
			var hotelAddress = "";
			var hotelAdressCode = "";
			var hotelParentAdres = hotelObj.find("#hotelParentAddress").next().find('.search-current').val();
			var hotelTwoAdres = hotelObj.find("#hotelTwoAddres").next().find('.search-current').val();
			var hotelChildAdres = hotelObj.find("#hotelChildAddres").next().find('.search-current').val();
			if(hotelTwoAdres == "" || hotelTwoAdres == "请选择") {
				hotelAddress = hotelParentAdres;
				hotelAdressCode = hotelObj.find("#hotelParentAddress").val();
			} else {
				hotelAddress = hotelParentAdres + "-" + hotelTwoAdres + "-" + hotelChildAdres;
				hotelAdressCode = hotelObj.find("#hotelParentAddress").val() + "-" + hotelObj.find("#hotelTwoAddres").val() + "-" + hotelObj.find("#hotelChildAddres").val();
			}
			//入住日期
			var hotelCheckInDate = $("#hotelDate").val();
			//离开日期
			var leaveDate = $("#leaveDate").val();
			//拼接住宿费表格数据
			var hotelCostStr = '<tr>' +
				'<td><span>' + tripUser + '</span>' +
				'<input type="hidden" data-val="travelPersonnel" value="' + hotelObj.find("select.hotel-trip-user-sel").val() + '" risk-code-val="hotelBusiUsers"/>' +
				'</td><td><span>' + level + '</span><input type="hidden" value="' + levelCode + '" risk-code-val="hotelBusiUsersLevel"/></td>' +
				'<td class="font-right"  risk-code-val="costDetailHotelCost"><span>' + $("#peoDayMoney").html() + '</span></td>' +
				'<td  risk-code-val="hotelCheckInDate" class="check-in-date"><span data-text="hotelTime" class="sdate">' + hotelCheckInDate + '</span></td>' +
				'<td class="leave-date"><span data-text="leaveTime" class="edate">' + leaveDate + '</span></td>' +
				'<td data-text="hotelDays">' + hotelObj.find(".hotel-num").text() + '</td>' +
				'<td class="font-right money-td" data-text="hotelExpense"  risk-code-val="hotelCost"><span>' + $yt_baseElement.fmMoney(hotelObj.find(".cost-detail-money").val() || '0') + '</span></td>' +
				'<td><span data-text="hotelAddressName">' + hotelAddress + '</span>' +
				'<input type="hidden" data-val="hotelAddress" value="' + hotelAdressCode + '"/>' +
				'<input type="hidden" risk-code-val="hotelProvinceAddress" value="' + hotelObj.find("#hotelParentAddress").val() + '"/>' +
				'<input type="hidden" risk-code-val="hotelCityAddress" value="' + hotelObj.find("#hotelTwoAddres").val() + '"/>' +
				'<input type="hidden" risk-code-val="hotelHaidianAddress" value="' + hotelObj.find("#hotelChildAddres").val() + '"/>' +
				'</td>' +
				'<td class="text-overflow-sty" data-text="remarks" title="' + hotelObj.find(".hotel-msg").val() + '">' + (hotelObj.find(".hotel-msg").val() == "" ? "无" : hotelObj.find(".hotel-msg").val()) + '</td>' +
				'<td>' +
				'<input type="hidden" class="hid-set-met" data-val="setMethod"/>' +
				'<input type="hidden" class="hid-cost-type" value="1"/>' +
				'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>' +
				'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>' +
				'</td></tr>';

			//存在为替换
			if(tr) {
				tr.replaceWith(hotelCostStr);
				//隐藏弹出框
				me.hideCostApplyAlert();
			} else {
				//不存在新增
				$("#hotel-list-info tbody .total-last-tr").before(hotelCostStr);
				//提示保存至列表成功
				$yt_alert_Model.prompt('填写的信息已成功加入到列表');
			}

			//调用合计方法
			me.updateMoneySum(1);
			//调用公用的清空表单数据方法
			me.clearFormData();
			//改变风险灯图标绿灯
			//$("#hotel-list-info").parent().find(".cost-list-title .risk-img").attr("src", busiTripApply.riskViaImg);
		},
		/**
		 * 获取拼接其他费数据方法
		 */
		getOtherCostFormInfo: function(tr) {
			var me = this;
			//获取交通费模块对象
			var otherObj = $(".other-form");
			//调用公用的拼接合计行方法
			sysCommon.createSumTr(2);
			//费用类型
			var costType = otherObj.find("#cost-type option:selected").text();
			//拼接其他费用表格数据
			var otherCostStr = '<tr>' +
				'<td><span>' + costType + '</span>' +
				'<input type="hidden" data-val="costType" risk-code-val="otherCostType" value="' + otherObj.find("#cost-type").val() + '"/></td>' +
				'<td class="font-right money-td" data-text="reimAmount" risk-code-val="otherCostReimPrice">' + $yt_baseElement.fmMoney(otherObj.find(".other-money").val() || '0') + '</td>' +
				'<td class="text-overflow-sty" data-text="remarks" title="' + otherObj.find(".other-msg").val() + '">' + (otherObj.find(".other-msg").val() == "" ? "--" : otherObj.find(".other-msg").val()) + '</td>' +
				'<td>' +
				'<input type="hidden" class="hid-cost-type" value="2"/>' +
				'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>' +
				'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>' +
				'</td></tr>';

			//存在为替换
			if(tr) {
				tr.replaceWith(otherCostStr);
				//隐藏弹出框
				me.hideCostApplyAlert();
			} else {
				//不存在新增
				$("#other-list-info tbody .total-last-tr").before(otherCostStr);
				//提示保存至列表成功
				$yt_alert_Model.prompt('填写的信息已成功加入到列表');
			}

			//调用合计方法
			me.updateMoneySum(2);
			//调用公用清空表单数据方法
			me.clearFormData();
			//改变风险灯图标绿灯
			//$("#other-list-info").parent().find(".cost-list-title .risk-img").attr("src", me.riskViaImg);
		},
		/**
		 * 选择借款单相关事件
		 */
		borrowListEvent: function() {
			var me = this;
			//点击显示
			$('.borrow-money').click(function() {
				//获取数据
				me.getBorrowList();
				//显示
				me.showBorrowAlert();
			});
			//选中确定
			$('.borrow-common').click(function() {
				var code = $('.borrow-list .yt-table-active').attr('code');
				if(code) {
					//赋值借款单编号
					$('.borrow-money').val(code);
					//id
					$('#loanAppId').val($('.borrow-list .yt-table-active').attr('pid'));
					//赋值借款单欠款金额
					var loanMoney = serveFunds.rmoney($('.borrow-list .yt-table-active').find(".loanApp-balance").text());
					$("#outstandingBalance").text(serveFunds.fmMoney(loanMoney));
					var total = serveFunds.rmoney($('#applyTotalMoney').text());
					//本次冲销金额：报销总额大于欠款 ，本次冲销=欠款金额,报销总额小于等于欠款，本次冲销=报销总额。
					var outWriteAmount = total <= loanMoney ? total : loanMoney;
					$('#outWriteAmount').text(serveFunds.fmMoney(outWriteAmount));
					//获取借款单可用余额
					var outstandingBalance = loanMoney;
					//冲销金额：只读信息，读取逻辑：如果报销金额小于借款单可用余额，则读取报销总额；如果报销金额大于等于借款单可用余额，则读取借款单可用余额
					var writeOffAmount = total >= outstandingBalance ? outstandingBalance : total;
					$('#writeOffAmount,#outWriteAmount').text(serveFunds.fmMoney(writeOffAmount));
					// 补领金额：计算项，计算逻辑：如果报销金额小于借款单可用余额，则为0.00；如果报销金额大于等于借款单可用余额，则报销金额-冲销金额的金额值
					var replaceMoney = total >= outstandingBalance ? total - writeOffAmount : 0;
					/*if(replaceMoney <= 0) {
						//补领金额是零的时候 ，补领方式 几个输入框禁用，默认值都是0.
						$('#officialCard,#cash,#cheque').val('0').attr('disabled', true);
						$('.amount-table .total').text('0');
					} else {
						$('#officialCard,#cash,#cheque').attr('disabled', false);
					}*/
					$('#replaceMoney').text(serveFunds.fmMoney(replaceMoney));
					//报销后借款单余额：计算项，计算逻辑：如果报销金额小于借款单可用余额，则借款单可用余额-报销金额；如果报销金额大于风雨借款单可用余额；则显示为0.00
					$('#balanceMoney').text(serveFunds.fmMoney(total < outstandingBalance ? outstandingBalance - total : '0'));

					//隐藏弹框及蒙层
					me.hideBorrowAlert();
				} else {
					$yt_alert_Model.prompt('请选择一条数据');
				}
			});
			//取消选择
			$('.borrow-cancel').click(function() {
				me.hideBorrowAlert();
				//清空
				$('.borrow-val').val('');
				//获取数据
				me.getPriorApprovalList();
			});
			//查询按钮
			$('.borrow-search').click(function() {
				//获取数据
				me.getPriorApprovalList();
			});

			//重置按钮
			$('.borrow-reset').click(function() {
				$('.borrow-val').val('');
				//获取数据
				me.getPriorApprovalList();
			});

		},
		/**
		 * 显示借款单弹框
		 */
		showBorrowAlert: function() {
			//获取弹框对象
			var alert = $('.borrow-alert');
			//显示弹框及蒙层
			$yt_baseElement.showMongoliaLayer();
			$yt_alert_Model.getDivPosition(alert);
			$('#pop-modle-alert').show();
			alert.show();
		},
		/**
		 * 隐藏借款单弹框
		 */
		hideBorrowAlert: function() {
			//隐藏弹框及蒙层
			$yt_baseElement.hideMongoliaLayer();
			$('.borrow-alert').hide();
			$('#pop-modle-alert').hide();
		},
		/**
		 * 选择所属专项名称相关事件
		 */
		specialListEvent: function() {
			var me = this;
			//点击输入框显示
			$('.special-name').click(function() {
				//获取数据
				//me.getSpecialList();
				//显示
				me.showSpecialAlert();
			});
			//点击确定选中
			$('.special-common').click(function() {
				var code = $('.special-list .yt-table-active').attr('code');
				if(code) {
					$('.special-name').val(code);
					//隐藏弹框及蒙层
					me.hideSpecialAlert();
				} else {
					$yt_alert_Model.prompt('请选择一条数据');
				}
			});
			//点击取消
			$('.special-cancel').click(function() {
				me.hideSpecialAlert();
				//清空
				$('.special-val').val('');
				//获取数据
				me.getPriorApprovalList();
			});

			//查询按钮
			$('.special-search').click(function() {
				//获取数据
				me.getPriorApprovalList();
			});

			//重置按钮
			$('.special-reset').click(function() {
				$('.special-val').val('');
				//获取数据
				me.getPriorApprovalList();
			});

		},
		/**
		 * 选择所属专项名称弹框显示
		 */
		showSpecialAlert: function() {
			//获取弹框对象
			var alert = $('.special-alert');
			//显示弹框及蒙层
			$yt_baseElement.showMongoliaLayer();
			$yt_alert_Model.getDivPosition(alert);
			$('#pop-modle-alert').show();
			alert.show();
		},
		/**
		 * 选择所属专项名称弹框隐藏
		 */
		hideSpecialAlert: function() {
			//隐藏弹框及蒙层
			$yt_baseElement.hideMongoliaLayer();
			$('.special-alert').hide();
			$('#pop-modle-alert').hide();
		},
		/**
		 * 获取支出申请单数据列表
		 */
		
		getExpenditureList: function(advanceId) {
			//表格区域
			var tbody = $('.expenditure-approval-list tbody');
			var queryParams = $('.expenditure-approval-val').val();
			var advanceId=$("#advanceAppId").val();
			//分页区域
			var pageDiv = $('.expenditure-page');
			$('.expenditure-page').pageInfo({
				pageIndex: 1,
				pageNum: 5, //每页显示条数  
				pageSize: 3, //显示...的规律  
				url: "sz/advanceApp/getExpenditureAppListToPageByParams", //ajax访问路径  
				objName: 'data',
				data: {
					type: 'EXPENDITURE_APP',
					costType:'TRAIN_APPLY',
					queryParams: queryParams,
					advanceId:advanceId
				},
				success: function(data) {
					//获取支出申请单数据
					serveFunds.expenditureList = data.data;
					tbody.empty();
					if(data.flag == 0) {
						var trStr = "";
						if(data.data.rows.length > 0) {
							//显示分页
							pageDiv.show();
							$.each(data.data.rows, function(i, n) {
								trStr += '<tr  code="' + n.appNum + '">' +
									'<td>' + n.appNum + '</td>' +
									'<td>' + n.applicantUserName + '</td>' +
									'<td>' + n.applicantUserDeptName + '</td>' +
									'<td>' + n.appName + '</td>' +
									'<td>' + n.specialCode + '</td>' +
									'<td>' + n.applicantTime + '</td>' +
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
		/**
		 * 获取事前审批单列表
		 */
		getPriorApprovalList: function() {
			//表格区域
			var tbody = $('.prior-approval-list tbody');
			var queryParams = $('.prior-approval-val').val();
			//费用类型
			var costType = $('.docu-style-box .check input').val();
			//分页区域
			var pageDiv = $('.prior-page');
			$('.prior-page').pageInfo({
				pageIndex: 1,
				pageNum: 5, //每页显示条数  
				pageSize: 3, //显示...的规律  
				url: "sz/advanceApp/getAdvanceAppListToPageByParams", //ajax访问路径  
				objName: 'data',
				data: {
					type: 'EXPENDITURE_APP',
					costType:'TRAIN_APPLY',
					queryParams: queryParams
				},
				success: function(data) {
					tbody.empty();
					if(data.flag == 0) {
						var trStr = "";
						if(data.data.rows.length > 0) {
							//显示分页
							pageDiv.show();
							$.each(data.data.rows, function(i, n) {
								var advanceAppName=n.advanceAppName;
								if(advanceAppName.length>17){
									advanceAppName=n.advanceAppName.substr(0,15)+"...";
								}
								trStr += '<tr pid="' + n.advanceAppId + '" code="' + n.advanceAppNum + '" type="' + n.advanceCostType + '">' +
									'<td>' + n.advanceAppNum + '<input type="hidden" class="balance" value="' + n.advanceAppBalance + '" /></td>' +
									'<td>' + n.applicantUserName + '</td>' +
									'<td>' + n.applicantUserDeptName + '</td>' +
									'<td title='+n.advanceAppName+'>' + advanceAppName + '</td>' +
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
		/**
		 * 获取借款单列表
		 */
		getBorrowList: function() {
			//表格区域
			var tbody = $('.borrow-list tbody');
			//分页区域
			var pageDiv = $('.borrow-page');
			//查询条件(编号,事由)
			var queryParams = $('.borrow-val').val();
			$('.borrow-page').pageInfo({
				pageIndex: 1,
				pageNum: 5, //每页显示条数  
				pageSize: 3, //显示...的规律  
				url: "sz/loanApp/getUserLoanAppInfoListToPageByParams", //ajax访问路径  
				objName: 'data',
				data: {
					queryParams: queryParams
				},
				success: function(data) {
					tbody.empty();
					if(data.flag == 0) {
						var trStr = "";
						if(data.data.rows.length > 0) {
							//显示分页
							pageDiv.show();
							$.each(data.data.rows, function(i, n) {
								trStr += '<tr pid="' + n.loanAppId + '" code="' + n.loanAppNum + '">' +
									'<td>' + n.loanAppNum + '</td>' +
									'<td>' + n.applicantUserName + '</td>' +
									'<td>' + n.applicantUserDeptName + '</td>' +
									'<td>' + n.loanAppName + '</td>' +
									'<td>' + n.applicantTime + '</td>' +
									'<td style="text-align: right;"><span class="loanApp-balance">' + ($yt_baseElement.fmMoney(n.arrearsAmount || '0')) + '</span></td>' +
									'</tr>';
							});
							tbody.append(trStr);
						} else {
							//隐藏分页
							pageDiv.hide();
							var noTr = '<tr class="model-no-data-tr"><td colspan="6"><div class="no-data"><img src="../../../../../resources-sasac/images/common/no-data.png" alt=""></div></td></tr>';
							tbody.append(noTr);
						}
					}
				} //回调函数 匿名函数返回查询结果  
			});

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
					formAppCode: 'EXPENDITURE_APP'
				},
				success: function(data) {
					//获取数据list
					var list = data.data || [];
					//初始化HTML文本
					var opts = '';
					//循环添加文本
					$.each(list, function(i, n) {
						opts += '<label class="check-label yt-radio ' + (i == 0 ? 'check' : '') + '"><input id="" fun="' + n.jsFun + '" class="docu-style" name="style" value="' + n.costCode + '" type="radio">' + n.costName + '</label>';
					});
					//替换页面代码
					$('.docu-style-box').append(opts);

					if(code) {
						$('.docu-style-box input[value="' + code + '"]').setRadioState('check');
					}
				}
			});
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
					dictTypeCode: 'ACTIVITY_PRO,SPECIFIC_COST_TYPE,TRAVEL_TYPE,VEHICIE_CODE,HOTEL_ADDRESS,COST_TYPE,OTHER_UNIT_REC_TYPE,PERSONAL_REC_TYPE'
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
						reverse = '<option value="">无</option>',
						reverseUser = '<option value="">无</option>',
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
						} else if(n.dictTypeCode == 'OTHER_UNIT_REC_TYPE') {
							//冲销方式(单位/其他)
							reverse += '<option value="' + n.value + '">' + n.disvalue + '</option>';
						} else if(n.dictTypeCode == 'PERSONAL_REC_TYPE') {
							//冲销方式(个人)
							reverseUser += '<option value="' + n.value + '">' + n.disvalue + '</option>';
						}
					});

					//冲销方式(单位/其他)
					$('#witeOffCompany,#witeOffOther').html(reverse).niceSelect();
					//冲销方式(个人)
					$('#witeOffPersonal').html(reverseUser).niceSelect();
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
		/**
		 * 清空表单内数据
		 * @param {Object} obj
		 */
		clearAlert: function(obj) {
			//取得所有select
			var selects = obj.find('select');
			//循环重置
			$.each(selects, function(i, n) {
				$(n).find('option:eq(0)').attr('selected', true);
			});
			selects.niceSelect();
			//输入框
			var inputs = obj.find('input:not(input[type="radio"],input[type="checkbox"])');
			inputs.val('');
			//单选
			/*var radios = obj.find('input[type="radio"]');
			$.each(radios, function(i, n) {
				$(n).setRadioState('uncheck');
			});*/
			//复选
			var checks = obj.find('input[type="checkbox"]');
			$.each(checks, function(i, n) {
				$(n).setCheckBoxState('uncheck');
			});
			//文本域
			var textareas = obj.find('textarea');
			obj.find('.valid-font').text('');
			obj.find('.valid-hint').removeClass('valid-hint');
			textareas.val('');
		},
		/**
		 * 1.1.3.1	报销申请信息：提交表单数据
		 * @param {Object} subData
		 */
		submitFinalAppInfo: function(subData, thisBtn) {
			var me = this;
			//禁用并移除所有的事件
			thisBtn.off();
			$.ajax({
				type: "post",
				url: "sz/finalApp/submitFinalAppInfo",
				async: true,
				data: subData,
				success: function(data) {
					$yt_alert_Model.prompt(data.message); 
					if(data.flag == 0) {
						subData.appId = data.data;
						//提交流程数据
						me.submitWorkFlow({
							appId: data.data, //appId	表单申请id
							parameters: '', //parameters	JSON格式字符串, 
							dealingWithPeople: subData.dealingWithPeople, //dealingWithPeople	下一步操作人code
							opintion: subData.opintion, //opintion	审批意见
							processInstanceId: subData.processInstanceId, //processInstanceId	流程实例ID, 
							nextCode: subData.nextCode //nextCode	操作流程代码
						}, thisBtn);
					} else {
						me.setSubmitEvent();
					}
				},
				error: function(e) {
					me.setSubmitEvent();
				}
			});
		},
		/**
		 * 2.1.9.3	支出申请信息：提交流程审批
		 * @param {Object} subData
		 * @param {Object} thisBtn
		 */
		submitWorkFlow: function(subData, thisBtn) {
			$.ajax({
				type: "post",
				url: "sz/finalApp/submitWorkFlow",
				async: false,
				data: subData,
				success: function(data) {
					$yt_alert_Model.prompt(data.message);
					if(data.flag == 0) {
						$yt_common.parentAction({
							url: $yt_option.parent_action_path, //父级中转地址,固定配置项,只有统一修改处理。
							funName: 'locationToMenu', //指定方法名，定位到菜单方法
							data: {
								url: 'view/system-sasac/expensesReim/module/approval/myApplyList.html' //要跳转的页面路径
							}
						});
					} else {
						me.setSubmitEvent();
					}
				},
				error: function(e) {
					me.setSubmitEvent();
				}
			});

		},
		/**
		 * 1.1.3.2	决算申请信息：保存至草稿箱
		 * @param {Object} subData
		 */
		submitFinalAppInfoToDrafts: function(subData, thisBtn) {
			$.ajax({
				type: "post",
				url: "sz/finalApp/submitFinalAppInfoToDrafts",
				data: subData,
				success: function(data) {
					$yt_alert_Model.prompt(data.message);
					if(data.flag == 0) {
						//跳转审批页面
						//window.location.href = $yt_option.websit_path + 'view/system-sasac/expensesReim/module/reimApply/reimApproveList.html';
						$yt_common.parentAction({
							url: $yt_option.parent_action_path, //父级中转地址,固定配置项,只有统一修改处理。
							funName: 'locationToMenu', //指定方法名，定位到菜单方法
							data: {
								url: 'view/system-sasac/expensesReim/module/approval/draftsList.html' //要跳转的页面路径
							}
						});
					} else {
						serveFunds.setSaveEvent();
					}
				}
			});
		},
		/**
		 * 1.1.3.4	根据报销申请Id获取报销申请详细信息
		 * @param {Object} reimAppId
		 */
		getFinalAppInfoByAppId: function(finalAppId) {
			var me = this;
			$.ajax({
				type: "post",
				url: "sz/finalApp/getFinalAppInfoByAppId",
				data: {
					finalAppId: finalAppId
				},
				success: function(data) {
					var d = data.data;

					//申请人填报
					if(d.taskKey == 'activitiStartTask') {
						//删除保存按钮
						$('#savePayment').remove();
					}
					//数据回显
					me.showDetail(d);
				}
			});
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
			var me = this;
			//费用申请json
			var costData = function() {
				return JSON.stringify({
					costReceptionistList: me.costReceptionistList(),
					costDetailsList: me.costDetailsList(),
					travelRouteList: me.tripPlanList(),
					costCarfareList: me.carfareList(),
					costHotelList: me.hotelList(),
					costOtherList: me.otherList(),
					costSubsidyList: me.costSubsidyList(),
					trainApplyInfoList: me.trainApplyInfoList(), //trainApplyInfoList	师资-培训信息json
					costPredictInfoList: me.costPredictInfoList(), //costPredictInfoList	收入费用信息json
					teacherApplyInfoList: me.teacherApplyInfoList(), //teacherApplyInfoList	师资-讲师信息json
					costTrainApplyInfoList: me.costTrainApplyInfoList(), //costTrainApplyInfoList	师资-培训费json
					costTeachersFoodApplyInfoList: me.costTeachersFoodApplyInfoList(), //costTeachersFoodApplyInfoList	师资-伙食费json
					costTeachersLectureApplyInfoList: me.costTeachersLectureApplyInfoList(), //costTeachersLectureApplyInfoList	师资-讲课费json
					costTeachersTravelApplyInfoList: me.costTeachersTravelApplyInfoList(), //costTeachersTravelApplyInfoList	师资-城市间交通费json
					costTeachersHotelApplyInfoList: me.costTeachersHotelApplyInfoList(), //costTeachersHotelApplyInfoList	师资-住宿费 json
					costNormalList: me.costNormalList(), //costNormalList	普通报销-费用明细/普通付款-付款明细 json
					meetingList: me.meetingList(), //meetingList	会议详情json
					meetingCostList: me.meetingCostList(), //meetingCostList	会议费用详情
					costTaxInfoList: me.costTaxInfoList()//costTaxInfoList   税费信息json
					
				});
			};

			//收款方数据json
			var payReceivablesData = function() {
				return JSON.stringify({
					gatheringUnitList: me.gatheringUnitList(), //gatheringUnitList	单位-收款方json 
					gatheringPersonList: me.gatheringPersonList(), //gatheringPersonList	个人-收款方json
					gatheringOtherList: me.gatheringOtherList() //gatheringOtherList	其他-收款方json
				});
			};

			//金额转换方法
			var rMoney = $yt_baseElement.rmoney;
			//预算项目
			var specialCode = function() {
				var code = '';
				$('select.budget-item-one,select.budget-item-two,select.budget-item-three').each(function(i, n) {
					var val = $(this).find('option:selected').val();
					if(val) {
						code += val + '-';
					}
				});
				code = (code.substring(code.length - 1) == '-') ? code.substring(0, code.length - 1) : code;
				return code;
			};
			return {
				advanceAppId:serveFunds.beforeCostList.advanceAppId, //事前申请单id
				expenditureAppNum : $(".expenditure-approval").val(),
				finalAppId : $("#finalAppId").val(),
				finalAppNum : $("#finalAppNum").val(),
				finalAppReason : $("#finalAppReason").val(),
				costType : 'TRAIN_APPLY',
				expenditureTotal : $yt_baseElement.rmoney($(".count-val-num")
						.text()
						|| '0'),
				incomeTotal : $yt_baseElement.rmoney($("#afterTaxAllMoney")
								.text()
								|| '0'),
				prjName : $('#prjName').val(),
				applicantUser : $("#applicantUser").val(),
				specialCode : specialCode(),
				parameters : '',
				dealingWithPeople : $("#approve-users option:selected").val(),
				opintion : $(".textareaHQ").val(),
				processInstanceId : $("#processInstanceId").val(),
				nextCode : $("#operate-flow option:selected").val(),
				costData : costData(),
				finalAttIdStr : me.getFileList()
			};
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
					name: tr.find('.name-text').text(), //name	姓名
					jobName: tr.find('.job-text').text(), //jobName	职务
					unitName: tr.find('.unit-text').text(), //unitName	单位名称
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
					publicServiceProCode: tr.attr('budgetcode'), //costReceptionistId	公务活动项目code
					activityDate: tr.find('.act-date').text(), //活动日期
					placeName: tr.find('.place-name').text(), //场所
					costType: tr.attr('costcode'), //具体费用类型code
					//standardAmount: serveFunds.rmoney(tr.find('.stan-money').text() || '0'), //标准金额
					activityAmount: serveFunds.rmoney(tr.find('.money').text() || '0'), //活动金额
					peopleNum: tr.find('.people-num').text(), //陪同人数
					setMethod: setMethod //setMethod	结算方式
				});
			});
			return list;
		},
		//税费信息
		costTaxInfoList: function() {
			var list = [];
			//取课酬费税金的值
			var taxAmount = $(".taxation .tax-amount").text();
			//取增值税销项税的值
			var addedValue = $(".taxation .added-value").text();
			//取	应缴附加税的值
			var surtax = $(".taxation .surtax").text();
			//税费信息
			list.push({
				taxation:"税费信息",
				taxAmount:taxAmount, //课酬费税金
				addedValue:addedValue,//增值税销项税
				surtax:surtax //应缴附加税
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
					cityDatas.crafare = serveFunds.rmoney(cityDatas.crafare);
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
					hotelDatas.hotelExpense = serveFunds.rmoney(hotelDatas.hotelExpense);
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
					otherDatas.reimAmount = serveFunds.rmoney(otherDatas.reimAmount);
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
					subsidyFoodAmount: serveFunds.rmoney(tr.find('.food').text()), //subsidyFoodAmount	伙食补助费
					carfare: serveFunds.rmoney(tr.find('.traffic').text()), //carfare	室内交通费
					setMethod: '' //setMethod	结算方式
				});
			});
			return list;
		},
		/**
		 * trainApplyInfoList	师资-培训信息json
		 */
		trainApplyInfoList: function() {
			//判断是否是培训费
			var costType = $('.docu-style-box .check input').val();
			var costType = 'TRAIN_APPLY';
			var list = costType == 'TRAIN_APPLY' ? [{
				trainType: $('#meetingClassification option:selected').val(), //trainType	培训类型
				regionDesignation: $('#regionDesignation').val(), //regionDesignation	培训名称
				regionName: $('#regionName').val(), //regionName	培训地点中文
				reportTime: $('#startTimeTop').val(), //reportTime	报到时间
				endTime: $('#endTimeTop').val(), //endTime	结束时间
				trainDays: $('#calculationSession').val(), //trainDays	培训天数
				trainOfNum: $('#trainOfNum').val(), //trainOfNum	培训人数
				workerNum: $('#workerNum').val(), //workerNum	工作人员数量
				approvaNum: $('#approvaNum').val(), //approvaNum	批准文号
				chargeStandard: $('#chargeStandard').val() //chargeStandard	收费标准
			}] : [];
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
					trainType: tr.attr('costnameval'), //costName 费用名称
					standard: $yt_baseElement.rmoney(tr.find('.standard-money').text()), //standard 标准
					trainDays: tr.find('.day-num').text(), //trainDays 培训天数
					trainOfNum: tr.find('.people-num').text(), //trainOfNum 报道人数
					averageMoney: $yt_baseElement.rmoney(tr.find('.smallplan-money').text()), //averageMoney 小计
					remark: tr.find('.special-instruct').text() //remark 特殊说明
				});
			});
			return list;

		},
		/**
		 * 收入费用信息
		 */
		costPredictInfoList : function() {
			var list = [];
			var trs = $('#predictCostTable tbody tr:not(.last)');
			var tr = null;
			$.each(trs, function(i, n) {
				tr = $(n);
				list.push({
					costname : tr.find('.cost-name').text(),
					standardmoney : $yt_baseElement.rmoney(tr.find('.predict-standard-money').text()),
					peoplenum : tr.find('.predict-people-num').text(),
					smallplanmoney : $yt_baseElement.rmoney(tr.find('.predict-smallplan-money').text()),
					predictAllMoney:$yt_baseElement.rmoney(tr.find(".predict-all-money").text()),
					specialinstruct : tr.find('.special-instruct').text()
				})
			});
			return list
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
					averageMoney: serveFunds.rmoney(tr.find('.avg').text()), //averageMoney	人均消费
					foodOfDays: tr.find('.day').text(), //foodOfDays	用餐天数
					foodAmount: serveFunds.rmoney(tr.find('.sum-pay').text()), //foodAmount	伙食费
					remarks: tr.find('.dec').text() == '无' ? '' : tr.find('.dec').text(), //remarks	特殊说明
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
					perTaxAmount: serveFunds.rmoney(tr.find('.sum-pay').text()), //perTaxAmount	税前金额
					afterTaxAmount: serveFunds.rmoney(tr.find('.after').text()), //afterTaxAmount	税后金额
					averageMoney: serveFunds.rmoney(tr.find('.avg').text()), //averageMoney	税后每学时金额
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
					carfare: serveFunds.rmoney(tr.find('.sum-pay').text()), //carfare	交通费
					remarks: tr.find('.dec').text() == '无' ? '' : tr.find('.dec').text(), //remarks	特殊说明
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
					hotelExpense: serveFunds.rmoney(tr.find('.sum-pay').text()), //hotelExpense	住宿费
					averageMoney: serveFunds.rmoney(tr.find('.avg').text()), //averageMoney	人均花销
					remarks: tr.find('.dec').text() == '无' ? '' : tr.find('.dec').text(), //remarks	特殊说明
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
			var trs = $('.ordinary-approval #costList tbody tr:not(.last)');;
			$.each(trs, function(i, n) {
				//单个tr
				tr = $(n);
				list.push({
					normalId: '',
					normalName: tr.find(".reimContent").text(),
					normalAmount: $yt_baseElement.rmoney(tr.find(".reimAmount").text()),
					remarks: tr.find('.reimInstructions').text() == '无' ? '' : tr.find('.reimInstructions').text(),
				});
			});
			return list;
		},
		/**
		 * 会议详情json
		 */
		meetingList: function() {
			var costType = $(".docu-style-box .check input").val();
			var list = costType == 'MEETING_APPLY' ? [{
				meetType: $('#meetingClassification option:selected').val(), //meetType 会议分类
				meetName: $('#meetName').val(), //meetName 会议名称
				meetAddress: $('#meetAddress').val(), //meetAddress 会议地点中文
				meetStartTime: $('#startTime').val(), //meetStartTime 会议开始时间
				meetEndTime: $('#endTime').val(), //meetEndTime 会议结束时间
				meetDays: $('#calculationSession').val(), //meetDays 会期
				meetOfNum: $('#meetOfNum').val(), //meetOfNum 参会人数
				meetWorkerNum: $('#meetWorkerNum').val(), //meetWorkerNum 工作人员数量
			}] : [];
			return list;
		},
		/**
		 * 会议费用详情
		 */
		meetingCostList: function() {
			var costType = $(".docu-style-box .check input").val();
			var list = costType == 'MEETING_APPLY' ? [{
				meetHotel: $yt_baseElement.rmoney($('#meetHotel').val()), //meetHotel 住宿费
				meetFood: $yt_baseElement.rmoney($('#meetFood').val()), //meetFood 伙食费
				meetOther: $yt_baseElement.rmoney($('#meetOther').val()), //meetOther 其他费用
				meetAmount: $yt_baseElement.rmoney($('#costTotal').text()), //meetAmount 费用合计
				meetAverage: $yt_baseElement.rmoney($('#dailyAverageConsumption').text()), //meetAverage 人均日均费用金额
			}] : [];
			return list;
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
					unitName: tr.attr('companyname'), //unitName 单位名称
					openBank: tr.attr('openbank'), //openBank 开户银行
					accounts: tr.attr('accountnumber'), //accounts 账户
					amount: $yt_baseElement.rmoney(tr.attr('companymoney')), //amount 金额
					isContract: tr.attr('contractradio'), //isContract 是否有合同协议(1 是, 2 否)
					reverseTheWay: tr.attr('witeoffcompany'), //reverseTheWay	冲销方式
					reverseTheWayName: tr.find('td').eq(1).text(), //reverseTheWayName	冲销方式名称
					remarks: tr.attr('companyspecial') == '无' ? '' : tr.attr('companyspecial'), //remarks 特殊说明
				});
			});
			return list;
		},
		/**
		 * 设置收款方单位数据
		 * @param {Object} list
		 */
		setHeringUnitList: function(list) {
			var html = '';
			var total = 0;
			$.each(list, function(i, n) {
				html += '<tr class="payee-unit-tr" pkid="" witeoffcompany="' + n.reverseTheWay + '" companyname="' + n.unitName + '" openbank="' + n.openBank + '" accountnumber="' + n.accounts + '" companymoney="' + n.amount + '" contractradio="' + n.isContract + '" companyspecial="' + n.remarks + '"><td class="com" value="Company">' + n.unitName + '</td><td>' + (n.reverseTheWayName ? n.reverseTheWayName : '无') + '</td><td style="text-align: right;" class="unitTotal">' + ($yt_baseElement.fmMoney(n.amount)) + '</td><td>' + n.openBank + '</td><td>' + n.accounts + '</td><td value="1">' + (n.isContract == 1 ? '有' : '无') + '</td><td>' + (n.remarks ? n.remarks : '无') + '</td><td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td></tr>';
				total += +n.amount;
			});
			$('table.payee-unit .payee-unit-total').before(html).find('.payee-unit-money').text($yt_baseElement.fmMoney(total));
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
					personalType: 2, //personalType 人员类型(1 外部 2 内部)
					personalCode: tr.attr('payeeval'), //personalCode 人员code
					personalName: tr.attr('payeename'), //personalName 人员名称
					idCard: tr.attr('idcarkno'), //idCard 身份证号
					phoneNum: tr.attr('phonenum'), //phoneNum 手机号
					openBank: tr.attr('bankname'), //openBank 开户银行
					accounts: tr.attr('payeebank'), //accounts 银行卡号
					writeOffAmount: $yt_baseElement.rmoney(tr.attr('theReverseMoney')), //冲销金额
					offOpenBank: tr.attr('offOpenBank'), //offOpenBank 公务卡 - 开户银行
					offAccounts: tr.attr('offAccounts'), //offAccounts 公务卡 - 银行卡号
					amount: $yt_baseElement.rmoney(tr.attr('personaltotal')), //amount 个人应收款总金额
					loanAppId: tr.attr('choiceloanval'), //loanAppId 借款单Id
					replaceAmount: $yt_baseElement.rmoney(tr.attr('personalwriteoff')), //replaceAmount 补领金额
					cash: $yt_baseElement.rmoney(tr.attr('cash')), //cash 收款方式 - 现金
					officialCard: $yt_baseElement.rmoney(tr.attr('officialcard')), //officialCard 收款方式 - 公务卡
					transfer: $yt_baseElement.rmoney(tr.attr('transferaccounts')), //transfer 收款方式 - 转账
					isContract: tr.attr('payeeradio'), //isContract 是否有合同协议(1 是, 2 否)
					reverseTheWay: tr.attr('witeoffpersonal'), //reverseTheWay 冲销方式
					remarks: tr.attr('personalspecial') == '无' ? '' : tr.attr('personalspecial'), //remarks 特殊说明
				});
			});
			return list;
		},
		/**
		 * 设置收款方个人数据
		 * @param {Object} list
		 */
		setHeringPersonList: function(list) {
			var html = '';
			var total = 0;
			$.each(list, function(i, n) {
				html += '<tr class="payee-personal-tr" pkid="" payeeval="' + n.personalCode + '" payeename="' + n.personalName + '" pedepartment="' + n.personalDept + '" perank="' + n.personalJobLevelName + '" personaltotal="' + n.amount + '" witeoffpersonal="' + n.reverseTheWay + '" personalwriteoff="' + n.replaceAmount + '" cash="' + n.cash + '" officialcard="' + n.officialCard + '" transferaccounts="' + n.transfer + '" payeeradio="' + n.isContract + '" personalspecial="' + n.remarks + '" idcarkno="' + n.idCard + '" payeebank="' + n.accounts + '" bankname="' + n.openBank + '" phonenum="' + n.phoneNum + '" choiceloan="' + n.loanAppNum + '" choiceloanval="' + n.loanAppId + '" arrearsmoney="' + n.loanAppArrearsAmount + '" thereversemoney="' + n.writeOffAmount + '" offOpenBank="' + n.offOpenBank + '" offAccounts="' + n.offAccounts + '"><td class="per" value="personal">' + n.personalName + '</td><td style="text-align: right;" class="personalTotal">' + serveFunds.fmMoney(n.amount) + '</td><td>' + (n.reverseTheWayName ? n.reverseTheWayName : '无') + '</td><td style="text-align: right;">' + (serveFunds.fmMoney(n.writeOffAmount)) + '</td><td style="text-align: right;">' + (serveFunds.fmMoney(n.replaceAmount)) + '</td><td style="text-align: right;">' + (serveFunds.fmMoney(n.cash)) + '</td><td style="text-align: right;">' + (serveFunds.fmMoney(n.officialCard)) + '</td><td style="text-align: right;">' + (serveFunds.fmMoney(n.transfer)) + '</td><td><a class="yt-link to-data">详情</a></td><td>' + (n.isContract == 1 ? '有' : '无') + '</td><td>' + (n.remarks ? n.remarks : '无') + '</td><td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td></tr>';
				total += +n.amount;
			});
			$('table.payee-personal .payee-personal-total').before(html).find('.payee-personal-money').text($yt_baseElement.fmMoney(total));
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
					otherName: tr.attr('othermoney'), //otherName 其他付款名称
					amount: $yt_baseElement.rmoney(tr.attr('otherallmoney')), //amount 金额
					isContract: tr.attr('otherradio'), //isContract 是否有合同协议(1 是, 2 否)
					reverseTheWay: tr.attr('witeoffother'), //reverseTheWay 收款方式
					remarks: tr.attr('otherspecial') == '无' ? '' : tr.attr('otherspecial') //remarks 特殊说明
				});
			});
			return list;
		},
		/**
		 * 设置收款方其他数据
		 * @param {Object} list
		 */
		setHeringOtherList: function(list) {
			var html = '';
			var total = 0;
			$.each(list, function(i, n) {
				html += '<tr class="payee-other-tr" pkid="" witeoffother="' + n.reverseTheWay + '" othermoney="' + n.otherName + '" otherallmoney="' + n.amount + '" otherradio="' + n.isContract + '" otherspecial="' + n.remarks + '"><td class="oth" value="Other">' + n.otherName + '</td><td>' + n.reverseTheWayName + '</td><td style="text-align: right;" class="otherTotal">' + serveFunds.fmMoney(n.amount) + '</td><td>' + (n.isContract == 1 ? '有' : '无') + '</td><td>' + (n.remarks ? n.remarks : '无') + '</td><td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td></tr>';
				total += +n.amount;
			});
			$('table.payee-other .payee-other-total').before(html).find('.payee-other-total-money').text($yt_baseElement.fmMoney(total));
		},
		/**
		 * 报销申请数据回显
		 * @param {Object} data
		 */
		showDetail: function(d) {
			var me = this;

			//把公用的金额格式化方法存一下
			var fmMoney = $yt_baseElement.fmMoney;

			if(d.jsFun) {
				//根据相应的方法显示对应的区域
				me[d.jsFun]();
			}
			serveFunds.saveData.advanceAppId = d.advanceAppId;
			serveFunds.saveData.finalAppId = d.finalAppId;

			//加载完成判断是否存在审批单
			if(d.advanceAppNum) {
				//成功后显示导入按钮
				$('.index-main-div .export-but').show();
				serveFunds.getAdvanceAppInfoDetailByAdvanceAppId(serveFunds.saveData.advanceAppId || '', true);
			}
			$('#advanceAppId').val(d.advanceAppId); //advanceAppId	事前申请id
			$('.prior-approval').val(d.advanceAppNum).attr('costtype', d.costType); //事前申请编号
			
			if(d.advanceAppNum) {
				//赋值显示事前审批单可用余额
				$('#advanceAppBalance').text(d.advanceAppBalance ? serveFunds.fmMoney(d.advanceAppBalance) + '元' : '无');
				$('.advance-relevance').show();
			}
			$('#loanAppId').val(d.loanAppId); //loanAppId	借款申请表id
			$('.borrow-money').val(d.loanAppNum); //借款单号
			$('#outstandingBalance').text(fmMoney(d.loanAmount || '0')); //借款金额
			
			$('#finalAppNum').text(d.finalAppNum);//决算申请单编号
			$('#finalAppReason').val(d.finalAppReason); //决算申请事由
			
			$('#advanceAppId').val(serveFunds.saveData.advanceAppId); //事前表id
			//costType	费用类型
			me.getCostTypeList(d.costType);
			//costTypeName	费用类型名称
			//isSpecial	是否专项(1 是 2 否)
			//$('#special' + d.isSpecial).setRadioState('check');
			var specialCodeArr = d.specialCode.split('-'); //specialCode	所属预算项目code
			var specialNameArr = d.specialName.split('-'); //specialName	所属预算项目名称
			//判断事前申请单是否必填单据是差旅费,培训费,会议费,公务接待费
			if(d.costType == "TRAVEL_APPLY" || d.costType == "TRAIN_APPLY" || d.costType == "MEETING_APPLY" || d.costType == "BH_APPLY") {
				//添加验证规则
				$('.prior-approval').attr('validform', '{isNull:true,msg:\'请选择事前申请单\'}');
				$('.befor-not').css('color', 'red');
			} else {
				//清除验证规则
				$('.prior-approval').removeClass("valid-hint").attr('validform', '{isNull:false,msg:\'请选择事前申请单\'}');
				$('.prior-approval').parent().find(".valid-font").text('');
				$('.befor-not').css('color', '#fff');
			}
			//设置所属预算项目数据
			me.setBudgetItme(specialCodeArr);
			if(d.prjName) {
				$('.prj-name-tr').show();
				$('#prjName').val(d.prjName);
			}
			//invoiceNum	发票张数
			$('#invoiceNum').val(d.invoiceNum);
			//loanAppBalance	借款可用剩余额度
			$('#outstandingBalance').text(serveFunds.fmMoney(d.arrearsAmount));
			//本次冲销金额：报销总额大于欠款 ，本次冲销=欠款金额,报销总额小于等于欠款，本次冲销=报销总额。
			var outWriteAmount = d.totalAmount <= d.arrearsAmount ? d.totalAmount : d.arrearsAmount;
			$('#outWriteAmount').text(serveFunds.fmMoney(outWriteAmount));
			//totalAmount	报销总金额
			$('#applyTotalMoney').text(fmMoney(d.totalAmount || '0')).attr('num', d.totalAmount);
			$('#amountTotalMoney').text(fmMoney(d.totalAmount || '0')).attr('num', d.totalAmount);
			$('#paymentList .total-money').text(fmMoney(d.totalAmount || '0')).attr('num', d.totalAmount);
			$('#TotalMoneyUpper').text(arabiaToChinese(d.totalAmount + ''));
			//writeOffAmount	冲销金额
			$('#writeOffAmount,#outWriteAmount').text(fmMoney(d.writeOffAmount || '0')).attr('num', d.writeOffAmount);
			//报销后借款单余额：计算项，计算逻辑：如果报销金额小于借款单可用余额，则借款单可用余额-报销金额；如果报销金额大于风雨借款单可用余额；则显示为0.00
			$('#balanceMoney').text(serveFunds.fmMoney(d.totalAmount < d.arrearsAmount ? d.arrearsAmount - d.totalAmount : '0'));

			//officialCard	公务卡金额
			$('#officialCard').val(fmMoney(d.officialCard || '0')).attr('num', d.officialCard);
			//cash	现金金额
			$('input.cash').val(fmMoney(d.cash || '0')).attr('num', d.cash);
			//cheque	支票金额
			$('input.cheque').val(fmMoney(d.cheque || '0')).attr('num', d.cheque);
			//补领方式合计
			var total = +d.officialCard + +d.cash + +d.cheque;
			// 补领金额：计算项，计算逻辑：如果报销金额小于借款单可用余额，则为0.00；如果报销金额大于等于借款单可用余额，则报销金额-冲销金额的金额值
			var replaceMoney = total;
			/*if(replaceMoney <= 0) {
				//补领金额是零的时候 ，补领方式 几个输入框禁用，默认值都是0.
				$('#officialCard,#cash,#cheque').val('0').attr('disabled', true);
				$('.amount-table .total').text('0');
			} else {
				$('#officialCard,#cash,#cheque').attr('disabled', false);
			}*/
			$('#replaceMoney').text(serveFunds.fmMoney(replaceMoney));
			$('.amount-table .total').text(fmMoney(total || '0')).attr('num', total);
			//transfer	转账金额
			//paymentDate	支付日期
			//paymentAmount	支付金额
			//cmTotalAmount	支付明细_报销总金额
			//cmWriteOffAmount	支付明细_冲销金额
			//cmOfficialCard	支付明细_公务卡金额
			//cmCash	支付明细_现金金额
			//cmCheque	支付明细_支票金额
			//cmTransfer	支付明细_转账金额
			//applicantUser	申请人code
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
			//attList	附件集合
			me.showFileList(d.attList);
			//costData	费用申请数据
			me.showCostDetail(d.costData);
			//billingVoucherList	记账凭证集合
			//advanceAppAttList 事前申请附件信息集合
			//payReceivablesData 收款方数据信息
			me.setHeringUnitList(d.payReceivablesData.gatheringUnitList);
			me.setHeringPersonList(d.payReceivablesData.gatheringPersonList);
			me.setHeringOtherList(d.payReceivablesData.gatheringOtherList);
			//payDetailList 支付明细集合

			//currentBudgetSubList 当前预算核减信息集合

		},
		/**
		 * 费用信息数据回显
		 * @param {Object} data
		 */
		showCostDetail: function(data) {
			var me = this;
			//接待对象信息集合
			var costReceptionistList = data.costReceptionistList;
			//接待对象列表数据显示
			me.setCostReceptionistList(costReceptionistList);

			//费用明细信息集合
			var costDetailsList = data.costDetailsList;
			//招待费详情列表数据显示
			me.setCostDetailsList(costDetailsList);

			//行程明细
			var tripPlanList = data.travelRouteList;
			//行程明细列表数据显示
			me.setTravelRouteList(tripPlanList);

			//costCarfareList	城市间交通费
			var costCarfareList = data.costCarfareList;
			me.setCostCarfareList(costCarfareList);

			//costHotelList	住宿费
			var costHotelList = data.costHotelList;
			//住宿费列表设置
			me.setCostHotelList(costHotelList);

			//costOtherList	其他费用
			var costOtherList = data.costOtherList;
			//列表数据显示
			me.setCostOtherList(costOtherList);

			//costSubsidyList	补助明细
			var costSubsidyList = data.costSubsidyList;
			//补助明细列表显示
			me.setCostSubsidyList(costSubsidyList);

			//师资-培训信息json
			me.setTrainApplyInfoList(data.trainApplyInfoList);
			//teacherApplyInfoList	师资-讲师信息json
			me.setTeacherApplyInfoList(data.teacherApplyInfoList);
			//costPredictInfoList	收入费用息json
			me.costPredictInfoList(data.costPredictInfoList);
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

			//meetingList 会议详情json
			me.setMeetingList(data.meetingList);
			//meetingCostList 会议费用详情
			me.setMeetingCostList(data.meetingCostList);
			//税费信息
//			me.costTaxInfoList(data.costTaxInfoList);
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
		 * 区域操作
		 * 显示业务员招待费
		 */
		showBusinessFun: function() {
			var me = this;
			$('.index-main-div').html('');
			//提示文字隐藏
			$('.qtip-text-div').hide();
			//其他区域隐藏
			$('.mod-div').hide();
			//其他信息显示
			$('.approve-div,.else-div').show();
			//加载区域页面
			sysCommon.loadingWord('view/system-sasac/expensesReim/module/reimApply/hospitalitySpending.html');
			if($('.prior-approval').val()) {
				//成功后显示导入按钮
				$('.index-main-div .advance-relevance').show();
				serveFunds.getAdvanceAppInfoDetailByAdvanceAppId(serveFunds.saveData.advanceAppId || '');
			}
			$('.checkbox-div').show();

			//导入招待对象信息
			$('#exportMst').on('click', function() {
				//验证单据类型与事前申请单类型
				if(me.verifyCostTypeExport()) {
					//接待对象信息集合
					var costReceptionistList = me.beforeCostList.costData.costReceptionistList;
					//接待对象列表数据显示
					me.setCostReceptionistList(costReceptionistList, true);

				} else {
					$yt_alert_Model.prompt('事前申请单单据样式不符，无法导入');
				}
			});
			//导入招待费用明细
			$('#exportPayment').on('click', function() {
				if(me.verifyCostTypeExport()) {
					//费用明细信息集合
					var costDetailsList = me.beforeCostList.costData.costDetailsList;
					//招待费详情列表数据显示
					me.setCostDetailsList(costDetailsList, true);
					hospitalitySpending.getTotleMoney();
				} else {
					$yt_alert_Model.prompt('事前申请单单据样式不符，无法导入');
				}
			});
			//重置总金额
			$('.count-val-num,#amountTotalMoney').text('0.00');
			//重置人民币大写
			$('#TotalMoneyUpper').text('--');
			//重新设置冲销补领金额
			serveFunds.setReimFundMoney();
		},
		/**
		 * 一般费用   funeven
		 */
		showGeneralFun: function() {
			//清空原有代码
			$('.index-main-div').html('');
			//提示文字隐藏
			$('.qtip-text-div').hide();
			//其他区域隐藏
			$('.mod-div').hide();
			//其他信息显示
			$('.approve-div,.else-div').show();
			//加载区域页面
			sysCommon.loadingWord('view/system-sasac/expensesReim/module/reimApply/costDetail.html');

			//清空业务招待接待对象信息
			$('.business-div .msg-list tbody').empty();
			//清空业务招待费费用明细信息
			$('.business-div #paymentList tbody tr:not(.last)').remove();
			$('.business-div #paymentList tbody .total-money').text('0.00');
			//清空差旅费行程明细
			$('.travel-div #tripList tbody').empty();
			//清空差旅费费用明细
			$('#traffic-list-info tbody,#hotel-list-info tbody,#other-list-info tbody,#subsidy-list-info tbody').empty();
			//重置总金额
			$('.count-val-num,#amountTotalMoney').text('0.00');
			//重置人民币大写
			$('#TotalMoneyUpper').text('--');
			//重新设置冲销补领金额
			serveFunds.setReimFundMoney();
		},
		/**
		 * 差旅
		 */
		showTravelFun: function() {
			var me = this;
			$('.index-main-div').html('');
			//提示文字隐藏
			$('.qtip-text-div').hide();
			//其他区域隐藏
			$('.mod-div').hide();
			//其他信息显示
			$('.approve-div,.else-div').show();
			//相关区域显示
			//$('.travel-div').show();
			//加载区域页面
			sysCommon.loadingWord('view/system-sasac/expensesReim/module/reimApply/travelSpending.html');
			if($('.prior-approval').val()) {
				//成功后显示导入按钮
				$('.index-main-div .advance-relevance').show();
				serveFunds.getAdvanceAppInfoDetailByAdvanceAppId(serveFunds.saveData.advanceAppId || '');
			}
			$('.checkbox-div').show();
			//导入行程明细
			$('#exportTrip').on('click', function() {
				//验证单据类型与事前申请单类型
				if(me.verifyCostTypeExport()) {
					//取得保存的事前审批数据
					var list = me.beforeCostList.costData.travelRouteList;
					//赋值列表
					me.setTravelRouteList(list, true);
				} else {
					$yt_alert_Model.prompt('事前申请单单据样式不符，无法导入');
				}
			});
			//导入差旅费用明细
			$('#exportTravel').on('click', function() {
				//验证单据类型与事前申请单类型
				if(me.verifyCostTypeExport()) {
					//costCarfareList	城市间交通费
					var costCarfareList = me.beforeCostList.costData.costCarfareList;
					me.setCostCarfareList(costCarfareList, true);
					//costHotelList	住宿费
					var costHotelList = me.beforeCostList.costData.costHotelList;
					//住宿费列表设置
					me.setCostHotelList(costHotelList, true);
					//costOtherList	其他费用
					var costOtherList = me.beforeCostList.costData.costOtherList;
					//列表数据显示
					me.setCostOtherList(costOtherList, true);
					//costSubsidyList	补助明细
					var costSubsidyList = me.beforeCostList.costData.costSubsidyList;
					//补助明细列表显示
					me.setCostSubsidyList(costSubsidyList, true);
					//重新计算总金额
					me.updateApplyMeonySum();
				} else {
					$yt_alert_Model.prompt('事前申请单单据样式不符，无法导入');
				}
			});
			//清空业务招待接待对象信息
			$('.business-div .msg-list tbody').empty();
			//清空业务招待费费用明细信息
			$('.business-div #paymentList tbody tr:not(.last)').remove();
			$('.business-div #paymentList tbody .total-money').text('0.00');
			//重置总金额
			$('.count-val-num,#amountTotalMoney').text('0.00');
			//重置人民币大写
			$('#TotalMoneyUpper').text('--');
			//重新设置冲销补领金额
			serveFunds.setReimFundMoney();
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
				serveFunds.getAdvanceAppInfoDetailByAdvanceAppId(serveFunds.saveData.advanceAppId || '');
			}
			me.getTrainingTypeOption();
			//导入培训信息
			$('#trainDetails').click(function() {
				var thisBtn = $(this);
				//禁用按钮
				thisBtn.off();
				//验证单据类型与事前申请单类型
				if( me.verifyCostTypeExport()) {
					//取得保存的事前申请数据
					var list = me.beforeCostList.costData.trainApplyInfoList;
					//导入到列表中
					me.setTrainApplyInfoList(list, true);
				} else {
					$yt_alert_Model.prompt('事前申请单单据样式不符，无法导入');
				}
			});
			//导入讲师信息
			$('#exportLecturer').click(function() {
				//验证单据类型与事前申请单类型
				if(me.verifyCostTypeExport()) {
					//取得保存的事前申请数据
					var list = me.beforeCostList.costData.teacherApplyInfoList;
					//导入到列表中
					me.setTeacherApplyInfoList(list, true);
				} else {
					$yt_alert_Model.prompt('事前申请单单据样式不符，无法导入');
				}
			});
			
			//导入培训费用明细
			$('#exportCostApp').click(function() {
				var thisBtn = $(this);
				//禁用按钮
				thisBtn.off();
				//验证单据类型与事前申请单类型
				if(me.verifyCostTypeExport()) {
					//取得保存的事前申请数据
					var data = me.beforeCostList.costData;
					//导入到列表中
					//me.setTeacherApplyInfoList(list);
					//costTrainApplyInfoList	师资-培训费json
					//					me.setCostTrainApplyInfoList(data.costTrainApplyInfoList, true);
					//costTeachersFoodApplyInfoList	师资-伙食费json
					me.setCostTeachersFoodApplyInfoList(data.costTeachersFoodApplyInfoList, true);
					//costTeachersLectureApplyInfoList	师资-讲课费json
					me.setCostTeachersLectureApplyInfoList(data.costTeachersLectureApplyInfoList, true);
					//costTeachersTravelApplyInfoList	师资-城市间交通费json
					me.setCostTeachersTravelApplyInfoList(data.costTeachersTravelApplyInfoList, true);
					//costTeachersHotelApplyInfoList	师资-住宿费 json
					me.setCostTeachersHotelApplyInfoList(data.costTeachersHotelApplyInfoList, true);

					//计算总金额
					personnelFunds.updateTotalNum();

					//totalAmount	付款总金额
					//$('#applyTotalMoney').text(me.fmMoney(me.beforeCostList.advanceAmount));
					//大写金额
					//$('#TotalMoneyUpper').text(arabiaToChinese(me.beforeCostList.advanceAmount));
				} else {
					$yt_alert_Model.prompt('事前申请单单据样式不符，无法导入');
				}

			});
			//导入预计收入费用明细
			$('#exportPredictCost').click(function() {
				var thisBtn = $(this);
				//禁用按钮
				thisBtn.off();
				//验证单据类型与事前申请单类型
				if(me.verifyCostTypeExport()) {
					//取得保存的事前申请数据
					var data = me.beforeCostList.costData;
					//导入到列表中
					me.setCostPredictInfoList(data.costPredictInfoList, true);
					//计算总金额
					personnelFunds.updateTotalNum();
				} else {
					$yt_alert_Model.prompt('事前申请单单据样式不符，无法导入');
				}

			});
			//导入培训费用明细
			$('#importTrainingOther').click(function() {
				var thisBtn = $(this);
				//禁用按钮
				thisBtn.off();
				//验证单据类型与事前申请单类型
				if(me.verifyCostTypeExport()) {
					//取得保存的事前申请数据
					var data = me.beforeCostList.costData;
					//导入到列表中
					//me.setTeacherApplyInfoList(list);
					//costTrainApplyInfoList	师资-培训费json
					me.setCostTrainApplyInfoList(data.costTrainApplyInfoList, true);
					//计算总金额
					personnelFunds.updateTotalNum();
				} else {
					$yt_alert_Model.prompt('事前申请单单据样式不符，无法导入');
				}

			});

			//清空业务招待接待对象信息
			$('.business-div .msg-list tbody').empty();
			//清空业务招待费费用明细信息
			$('.business-div #paymentList tbody tr:not(.last)').remove();
			$('.business-div #paymentList tbody .total-money').text('0.00');
			//清空差旅费行程明细
			$('.travel-div #tripList tbody').empty();
			//清空差旅费费用明细
			$('#traffic-list-info tbody,#hotel-list-info tbody,#other-list-info tbody,#subsidy-list-info tbody').empty();
			//重置总金额
			$('.count-val-num,#amountTotalMoney').text('0.00');
			//重置人民币大写
			$('#TotalMoneyUpper').text('--');
			//重新设置冲销补领金额
			serveFunds.setReimFundMoney();
		},
		/**
		 * 会议
		 */
		showMettingFun: function() {
			var me = this;
			//提示文字隐藏
			$('.qtip-text-div').hide();
			//其他区域隐藏
			$('.mod-div').hide();
			//其他信息显示
			$('.approve-div,.else-div').show();
			//加载区域页面
			sysCommon.loadingWord('view/system-sasac/expensesReim/module/beforehand/meetingCostApply.html');
			if($('.prior-approval').val()) {
				//成功后显示导入按钮
				$('.index-main-div .export-but').show();
				serveFunds.getAdvanceAppInfoDetailByAdvanceAppId(serveFunds.saveData.advanceAppId || '');
			}
			//加载类型
			me.getMeetingTypeCode();
			$('#exportMeetDeta').on('click', function() {
				//验证单据类型与事前申请单类型
				if(me.verifyCostTypeExport()) {
					//取得保存的事前申请数据
					var list = me.beforeCostList.costData.meetingList;
					//导入到列表中
					me.setMeetingList(list, true);
				} else {
					$yt_alert_Model.prompt('事前申请单单据样式不符，无法导入');
				}
			});
			$('#exportMeetCost').on('click', function() {
				//验证单据类型与事前申请单类型
				if(me.verifyCostTypeExport()) {
					//取得保存的事前申请数据
					var list = me.beforeCostList.costData.meetingCostList;
					//导入到列表中
					me.setMeetingCostList(list, true);
				} else {
					$yt_alert_Model.prompt('事前申请单单据样式不符，无法导入');
				}
			});

		},
		/**
		 * 出差人弹出框操作事件
		 * @param {Object} busiInputObj  出差人输入框
		 * @param {Object} autoFontObj   自动计算字样
		 * @param {Object} userNumObj    人数字段
		 * @param {Object} clickFlag     点击标识
		 */
		busiTripUserModelEvent: function(busiInputObj, autoFontObj, userNumObj, clickFlag) {
			var me = this;
			//获取弹出框对象
			var busiTripUserModel = $("#busiTripUserModel");
			/**
			 * 查询按钮点击事件
			 */
			$("#searchUser").off().on("click", function() {
				//调用获取出差人列表方法
				me.getBusiTripUsersList($("#userPram").val());
			});
			/**
			 * 
			 * 查询输入框方法
			 * 
			 */
			$("#userPram").on("keyup", function() {
				//调用获取出差人列表方法
				me.getBusiTripUsersList($(this).val());
			});
			/**
			 * 单选一行数据
			 */
			$("#busiUserInfo ul li").off("click").on("click", function() {
				//出差人对象数据
				var usersDatas = "";
				//判断是否选中过
				if($(this).hasClass("tr-check")) {
					$(this).removeClass("tr-check");
					me.selUsersName = "";
					me.selUsersCode = "";
					//清空存储出差人的数据
					//busiTripApply.usersInfoList = "";
					//busiTripApply.usersInfoJson = "";
					$("#busiUserInfo ul li.tr-check").each(function(i, n) {
						usersDatas = $(this).data("userData");
						me.selUsersName += usersDatas.userName + "、";
						me.selUsersCode += usersDatas.userItcode + ",";
					});
				} else {
					$(this).addClass("tr-check");
					usersDatas = $(this).data("userData");
					me.selUsersName += usersDatas.userName + "、";
					me.selUsersCode += usersDatas.userItcode + ",";
					//去重出差人操作
					var checkUsersCodes = "";
					//遍历表格中的数据,
					$("#tripList tbody .hid-user-code").each(function() {
						checkUsersCodes += $(this).val() + ",";
					});
					var selUsersCode = "," + usersDatas.userItcode + ",";
					if(checkUsersCodes != "" && checkUsersCodes != undefined) {
						checkUsersCodes = "," + checkUsersCodes;
					}
					if(checkUsersCodes.indexOf(selUsersCode) < 0) {
						//拼接出差人集合
						var userLevel = usersDatas.jobLevelName == "--" ? "" : usersDatas.jobLevelName;
						me.usersInfoList = me.usersInfoList + '{"userItcode":"' + usersDatas.userItcode + '","jobLevelName":"' + usersDatas.jobLevelName + '","userName":"' + usersDatas.userName + '"},';
					}

				}
				var selTr = $("#busiUserInfo ul li.tr-check");
				if(selTr != "" && selTr.length > 0) {
					var selUser = "";
					var userCode = "";
					//获取选中出差人和code值
					selUser = me.selUsersName.substring(0, me.selUsersName.length - 1);
					userCode = me.selUsersCode.substring(0, me.selUsersCode.length - 1);

					$(busiInputObj).val(selUser);
					$(busiInputObj).prev("input[type=hidden]").val(userCode);
					//隐藏自动计算文本
					$(autoFontObj).hide();
					//显示出差人
					$(userNumObj).show();
					var userNums = selUser.split("、");
					//出差人数赋值
					$(userNumObj).find(".users-num").text(userNums.length);
					//调用清除验证信息方法
					sysCommon.clearValidInfo(busiInputObj);
					//显示清空按钮
					$("#clearUser").show();
				} else {
					$(busiInputObj).val('');
					$(busiInputObj).prev("input[type=hidden]").val('');
					//显示自动计算文本
					$(autoFontObj).show();
					//隐藏出差人数
					$(userNumObj).hide();
					//出差人数赋值
					$(userNumObj).find(".users-num").text(0);
					//添加验证信息方法
					$(busiInputObj).next(".valid-font").text("请选择出差人");
					$(busiInputObj).addClass("valid-hint");
					//清空存储出差人的数据
					me.selUsersName = "";
					me.selUsersCode = "";
					me.usersInfoList = "";
					me.usersInfoJson = "";
					//初始化
					var optionText = '<option value="">请选择</option>';
					//$("#model-trip-user,#hotel-trip-user").empty().append(optionText);
					//$("#model-trip-user,#hotel-trip-user").niceSelect();
					//隐藏清空按钮
					$("#clearUser").hide();
				}
			});
			/**
			 * 
			 * 清空按钮点击事件
			 * 
			 */
			$("#clearUser").click(function() {
				$(busiInputObj).val('');
				$(busiInputObj).prev("input[type=hidden]").val('');
				//显示自动计算文本
				$(autoFontObj).show();
				//隐藏出差人数
				$(userNumObj).hide();
				//出差人数赋值
				$(userNumObj).find(".users-num").text(0);
				//添加验证信息方法
				$(busiInputObj).next(".valid-font").text("请选择出差人");
				$(busiInputObj).addClass("valid-hint");
				//清空存储出差人的数据
				me.selUsersName = "";
				me.selUsersCode = "";
				me.usersInfoList = "";
				me.usersInfoJson = "";
				//初始化
				var optionText = '<option value="">请选择</option>';
				//$("#model-trip-user,#hotel-trip-user").empty().append(optionText);
				//$("#model-trip-user,#hotel-trip-user").niceSelect();

				//清空出差人下拉选中的数据
				$("#busiUserInfo ul li").removeClass("tr-check");
			});
			//隐藏
			$("#busiUserInfo").mouseleave(function() {
				$(this).hide();
				$(this).addClass("check");
			});
		},
		/**
		 * 获取出差人信息
		 * @param {Object} keyword
		 */
		getBusiTripUsersList: function(keyword) {
			var me = this;
			$.ajax({
				type: "post",
				url: 'user/userInfo/getAllUserInfoToPage', //ajax访问路径  
				async: true,
				data: {
					params: keyword,
					pageIndex: 1,
					pageNum: 99999 //每页显示条数  
				},
				success: function(data) {
					if(data.flag == 0) {
						//先清空出差人下拉列表中的数据
						$("#busiUserInfo ul").empty();
						var liStr = "";
						var opts = '';
						if(data.data.rows.length > 0) {
							serveFunds.payeeUserList = data.data.rows;
							$.each(data.data.rows, function(i, n) {
								liStr = $('<li>' + n.userName + '/' + n.deptName + '</li>');
								opts += '<option value="' + n.userItcode + '">' + n.userName + '</option>';
								//存储当前出差人的数据
								liStr.data("userData", n);
								$("#busiUserInfo ul").append(liStr);
							});
							//判断出差人隐藏的code值是否有值
							if($("#modelUserCodes").val()) {
								var usersCodes = $("#modelUserCodes").val().split(",");
								$("#busiUserInfo ul li").each(function(i, t) {
									$.each(usersCodes, function(i, l) {
										if($(t).data("userData").userItcode == l) {
											$(t).addClass("tr-check");
										}
									});
								});
							}
							//调用弹出框中操作事件方法
							me.busiTripUserModelEvent($("#modelBusiUser"), $("#busiPlanEditModel .auto-font"), $(".model-user-num-show"), 1);
							//设置收款人下拉列表
							me.setPayeeNameSelect();
						} else {
							$("#busiUserInfo ul").append('<li style="text-align: center;">暂无数据</li>');
						}
					}
				}
			});
		},
		/**
		 * 收款弹框收款人姓名下拉
		 */
		setPayeeNameSelect: function(code) {
			var me = this;
			var payeeName = $('#payeeName');
			//添加验证
			payeeName.attr('validform', '{isNull:true,blurFlag:true,msg:\'请输入收款人姓名\'}');
			payeeName.html('<option value="">请选择</option>');
			$.each(serveFunds.payeeUserList, function(i, n) {
				payeeName.append('<option userName="' + n.userName + '" jobLevelName="' + n.jobLevelName + '" deptName="' + n.deptName + '" value="' + n.userItcode + '">' + n.userName + '/' + n.deptName + '/' + n.jobName + '</option>');
			});
			payeeName.append('<option userName="" value="external">外部人员</option>');
			if(code) {
				payeeName.find('option[value="' + code + '"]').attr('selected', 'selected');
				//赋值选中的用户姓名
				payeeName.next().find(".current").text($('#payeeName option[value="' + code + '"]').attr("username"));
				payeeName.next().find(".search-current").val($('#payeeName option:selected').attr("username") == undefined ? "请选择" : $('#payeeName option:selected').attr("username"));
			}
			//输入模糊查询存储文字
			me.payeeKeyText = '';
			//收款弹框收款人姓名下拉
			payeeName.niceSelect({
				search: true,
				backFunction: function(text) {
					//回调方法,可以执行模糊查询,也可自行添加操作  
					payeeName.html('');
					if(text == "") {
						payeeName.html('<option value="">请选择</option>');
					} else {
						//隐藏收款人为本人单选
						/*$("label.user-radio-label").hide().removeClass("check");
						$("#userRadio").prop("checked",false);*/
						payeeName.parent().find('.valid-font').text('');
						//输入模糊查询存储文字
						me.payeeKeyText = text;
					}
					//遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
					$.each(serveFunds.payeeUserList, function(i, n) {
						if(n.userName.indexOf(text) != -1) {
							payeeName.append('<option userName="' + n.userName + '" jobLevelName="' + n.jobLevelName + '" deptName="' + n.deptName + '" value="' + n.userItcode + '">' + n.userName + '/' + n.deptName + '/' + n.jobName + '</option>');
						} else {}
					});
					payeeName.append('<option  userName="" value="external">外部人员</option>');
					if(payeeName.find('option').length == 1 && $('payeeName option[value="external"]')) {
						payeeName.html('<option value="noUser" disabled="disabled">没有找到匹配的单位内部人员</option><option  userName="" value="external">外部人员</option>');
					}
					if(payeeName.find('option').length == 2 && $('payeeName option[value="noUser"]')) {
						//$(".display-rank").show();
						//$(".pe-department").text("外部人员");
						//$(".dis-r").hide();
						//$(".where-company").show();
						//$(".where-company").attr("validform", "{isNull:true,blurFlag:true,msg:'请输入收款人所在单位'}")
					}
				},
				optionCallBcak: function(opt) {
					//判断当前option是否是外部人员
					if(opt.attr('data-value') == 'external') {
						payeeName.next().find('.search-current').val(me.payeeKeyText);
						//取消验证
						payeeName.attr('validform', '{}');
					}else {
						//添加验证
						payeeName.attr('validform', '{isNull:true,blurFlag:true,msg:\'请输入收款人姓名\'}');
						//赋值选中的用户姓名
						payeeName.next().find(".current").text($('#payeeName option:selected').attr("username"));
						payeeName.next().find(".search-current").val($('#payeeName option:selected').attr("username") == undefined ? "请选择" : $('#payeeName option:selected').attr("username"));
					}
				}
			});
			//赋值选中的用户姓名
			payeeName.next().find(".current").text($('#payeeName option:selected').attr("username"));
			payeeName.next().find(".search-current").val($('#payeeName option:selected').attr("username") == undefined ? "请选择" : $('#payeeName option:selected').attr("username"));
		},
		/**
		 * 住宿费,住宿地点子级获取数据
		 * @param {Object} addressCode  地区code
		 * @param {Object} addressLevel 地区级别
		 */
		hotelAddressChild: function(addressCode, addressLevel) {
			var me = this;
			$("#hotelTwoAddres").niceSelect({
				search: true,
				backFunction: function(text) {
					//回调方法,可以执行模糊查询,也可自行添加操作  
					$("#hotelTwoAddres option").remove();
					if(text == "") {
						$("#hotelTwoAddres").append('<option value="">请选择</option>');
					}
					//遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
					$.each(me.addressList, function(i, n) {
						if(n.regionName.indexOf(text) != -1 && n.parentCode == addressCode && addressLevel == "CITY") {
							//区
							$("#hotelTwoAddres").append('<option value="' + n.regionCode + '">' + n.regionName + '</option>');
						}
					});
				}
			});
			//调用设置住宿费子级无数据禁用
			//me.hotelChildDisa(addressCode, addressLevel);
			//me.hotelAreaDisa(addressCode, addressLevel);
		},
		/**
		 * 住宿费 区数据初始化
		 * @param {Object} addressCode
		 * @param {Object} addressLevel
		 */
		hotelAddressArea: function(addressCode, addressLevel) {
			var me = this;
			$("#hotelChildAddres").niceSelect({
				search: true,
				backFunction: function(text) {
					//回调方法,可以执行模糊查询,也可自行添加操作  
					$("#hotelChildAddres option").remove();
					if(text == "") {
						$("#hotelChildAddres").append('<option value="">请选择</option>');
					}
					//遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
					$.each(me.addressList, function(i, n) {
						if(n.regionName.indexOf(text) != -1 && n.parentCode == addressCode && addressLevel == "AREA") {
							//区
							$("#hotelChildAddres").append('<option value="' + n.regionCode + '">' + n.regionName + '</option>');

						}
					});
				}
			});
			//调用设置住宿费子级无数据禁用
			//me.hotelChildDisa(addressCode, addressLevel);
		},
		/**
		 * 设置住宿地点内容
		 */
		setAddress: function() {
			var me = this;
			$.ajax({
				type: "get",
				url: $yt_option.websit_path + 'resources-sasac/js/system/expensesReim/module/reimApply/regionList.json',
				async: false,
				success: function(data) {
					//var dataList = data;
					me.addressList = data;
					me.setAddressSelect();
				}
			});

		},
		/**
		 * 设置住宿地点下拉模糊查询
		 */
		setAddressSelect: function() {
			var me = this;
			//遍历省份
			/*$.each(me.addressList, function(i, n) {
				//省
				if(n.regionLevel == "PROVINCE") {
					$("#hotelParentAddress").append('<option value="' + n.regionCode + '" data-level="' + n.regionLevel + '" >' + n.regionName + '</option>');
				}
			});*/
			$("#hotelParentAddress").niceSelect({
				search: true,
				backFunction: function(text) {
					//回调方法,可以执行模糊查询,也可自行添加操作  
					$("#hotelParentAddress option").remove();
					if(text == "") {
						$("#hotelParentAddress").append('<option value="">请选择</option>');
					}
					//遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
					$.each(me.addressList, function(i, n) {
						if(n.regionName.indexOf(text) != -1 && n.regionLevel == 'PROVINCE') {
							$("#hotelParentAddress").append('<option value="' + n.regionCode + '" data-level="' + n.regionLevel + '" >' + n.regionName + '</option>');
						}
					});
				}
			});
			/**
			 * 
			 * 省份选择操作事件
			 * 
			 */
			$("#hotelParentAddress").off("change").on("change", function() {
				var thisSel = $(this);
				$("#hotelTwoAddres,#hotelChildAddres").html('').append('<option value="">请选择</option>');
				//调用查询地区子级方法
				me.hotelAddressChild(thisSel.val(), "CITY");
			});
			/**
			 * 
			 * 市选择操作事件
			 * 
			 */
			$("#hotelTwoAddres").off("change").on("change", function() {
				var thisSel = $(this);
				$("#hotelChildAddres").html('').append('<option value="">请选择</option>');
				//调用查询地区子级方法
				me.hotelAddressArea(thisSel.val(), "AREA");
			});

			me.getPlanBusiAddress($("#modelBusiAddres"));
		},
		/**
		 * 设置住宿费子级无数据禁用
		 * @param {Object} addressLevel 地区级别
		 */
		hotelChildDisa: function(addressCode, addressLevel) {
			var me = this;
			if(addressLevel == "CITY") {
				//判断二级和三级是否有值,无则禁用
				var disaFlag = true;
				if($("#hotelTwoAddres option").length < 1) {
					$("#hotelTwoAddres,#hotelChildAddres").prop("disabled", "disabled");
					//删除验证的自定义属性
					$("#hotelTwoAddres,#hotelChildAddres").removeAttr("validform");
					//调用清除验证信息方法
					sysCommon.clearValidInfo($("div.hotel-child-addres,div.hotel-two-addres,#hotelTwoAddres,#hotelChildAddres"));
				} else {
					$("#hotelTwoAddres,#hotelChildAddres").prop("disabled", "");
					//添加验证的自定义属性
					$("#hotelTwoAddres").attr("validform", "{isNull:true,changeFlag:true,msg:'请选择市'}");
					$("#hotelChildAddres").attr("validform", "{isNull:true,changeFlag:true,msg:'请选择区'}");
					disaFlag = false;
				}
				me.hotelAddressChild(addressCode, addressLevel);
				me.hotelAddressArea(addressCode, addressLevel);
				if(disaFlag) {
					$("div.hotel-child-addres,div.hotel-two-addres").css("background-color", "#D0D0D0");
				}
			} else if(addressLevel == "AREA") {
				//判断二级和三级是否有值,无则禁用
				var disaFlag = true;
				if($("#hotelChildAddres option").length < 1) {
					$("#hotelChildAddres").prop("disabled", "disabled");
				} else {
					$("#hotelChildAddres").prop("disabled", "");
					disaFlag = false;
				}
				me.hotelAddressArea(addressCode, addressLevel);
				if(disaFlag) {
					$("div.hotel-child-addres").css("background-color", "#D0D0D0");
				}
			}
		},
		/**
		 * 
		 * 获取差旅明细弹出框中的出差人数据
		 * 
		 */
		getModelUsersInfo: function() {
			var me = this;
			//出差人集合
			if(me.usersInfoList != "" && me.usersInfoList != null) {
				me.usersInfoJson = "[" + me.usersInfoList + "]";
				me.usersInfoJson = me.usersInfoJson.substr(0, me.usersInfoJson.length - 2);
				me.usersInfoJson += "]";
			}
			//给差旅申请弹出框中添加出差人
			//option html
			var optionText = '<option value="">请选择</option>';
			$("#model-trip-user,#hotel-trip-user").empty().append(optionText);
			if(me.usersInfoJson != "" && me.usersInfoJson.length > 0) {
				var list = eval("(" + me.usersInfoJson + ")");
				$.each(list, function(i, n) {
					optionText = '<option value="' + n.userItcode + '" data-level="' + n.jobLevelName + '" data-level-code="' + n.jobLevelCode + '">' + n.userName + '</option>';
					$("#model-trip-user,#hotel-trip-user").append(optionText);
				});
			}
			$("#model-trip-user,#hotel-trip-user").niceSelect();
		},
		/**
		 * 设置出差人列表数据
		 */
		setModelUsers: function() {
			//获取行程明细列表中的所有出差人
			var userStr = '';
			var trs = $('#tripList tbody tr');
			trs.each(function(i, n) {
				//对每行的出差人拆分去重
				var ls = $(n).attr('usercode').split(',');
				$.each(ls, function(j, m) {
					if(userStr.indexOf(m) < 0) {
						//拼接出差人
						userStr += m + ',';
					}
				});
			});
			//删除最后一个逗号
			userStr = (userStr.substring(userStr.length - 1) == ',') ? userStr.substring(0, userStr.length - 1) : userStr;
			if(userStr) {
				//获取出差人详细信息
				var userList = sysCommon.getUserAllInfo('', userStr, '');
				//拼接出差人HTML
				var opts = '<option value="">请选择</option>';
				$.each(userList, function(i, n) {
					opts += '<option value="' + n.userItcode + '" data-level="' + n.jobLevelName + '"  data-level-code="' + n.jobLevelCode + '">' + n.userName + '</option>';
				});
				$("#model-trip-user,#hotel-trip-user").html(opts).niceSelect();
			}
		},
		/**
		 * 
		 * 刷新申请预算总金额方法
		 * 
		 */
		updateApplyMeonySum: function() {
			var sumMoney = 0;
			$(".cost-list-model table .money-sum").each(function(i, n) {
				sumMoney += $yt_baseElement.rmoney($(n).text());
			});
			$(".cost-list-model table .city-money-td").each(function(i, n) {
				sumMoney += $yt_baseElement.rmoney($(n).text());
			});
			//补助明细费用
			$('#subsidy-list-info tbody tr:not(.last)').each(function(i, n) {
				sumMoney += $yt_baseElement.rmoney($(n).find('.food').text());
				sumMoney += $yt_baseElement.rmoney($(n).find('.traffic').text());
			});
			//转换总金额格式
			var rMoney = $yt_baseElement.fmMoney(sumMoney);
			$("#applyTotalMoney").text(rMoney).attr('num', sumMoney);
			//判断当前页面是否包含报销申请页面中,补领金额中的报销金额
			if($("body").find("#reimPrice")) {
				$("#reimPrice").text(rMoney);
				//计算补领金额
				var loanPrice = $("#loanCost").text();
				var replPrice = sumMoney - parseFloat(loanPrice);
				replPrice = $yt_baseElement.fmMoney(replPrice);
				$("#givePrice").text(replPrice);
			}
			if(sumMoney != null && sumMoney != undefined && sumMoney > 0) {
				var sumMoneyLower = arabiaToChinese(rMoney + '');
				$("#TotalMoneyUpper").text(sumMoneyLower);
			} else {
				$("#applyTotalMoney").text("0.00");
			}
			//赋值借款单中的报销总额
			$('#amountTotalMoney').text(rMoney).attr('num', sumMoney);
			//获取借款单可用余额
			var outstandingBalance = serveFunds.rmoney($('#outstandingBalance').text());
			//冲销金额：只读信息，读取逻辑：如果报销金额小于借款单可用余额，则读取报销总额；如果报销金额大于等于借款单可用余额，则读取借款单可用余额
			var writeOffAmount = sumMoney >= outstandingBalance ? outstandingBalance : sumMoney;
			$('#writeOffAmount,#outWriteAmount').text(serveFunds.fmMoney(writeOffAmount));
			// 补领金额：计算项，计算逻辑：如果报销金额小于借款单可用余额，则为0.00；如果报销金额大于等于借款单可用余额，则报销金额-冲销金额的金额值
			var replaceMoney = sumMoney >= outstandingBalance ? sumMoney - writeOffAmount : '0';
			/*if(replaceMoney <= 0) {
				//补领金额是零的时候 ，补领方式 几个输入框禁用，默认值都是0.
				$('#officialCard,#cash,#cheque').val('0').attr('disabled', true);
				$('.amount-table .total').text('0');
			} else {
				$('#officialCard,#cash,#cheque').attr('disabled', false);
			}*/
			$('#replaceMoney').text(serveFunds.fmMoney(replaceMoney));
			//报销后借款单余额：计算项，计算逻辑：如果报销金额小于借款单可用余额，则借款单可用余额-报销金额；如果报销金额大于风雨借款单可用余额；则显示为0.00
			$('#balanceMoney').text(serveFunds.fmMoney(sumMoney < outstandingBalance ? outstandingBalance - sumMoney : '0'));

		},
		/**
		 * 
		 * 表格金额合计更新
		 * 
		 * @param {Object} thisTab费用表格标识0交通费1.住宿费2.其他费用3补助
		 * 
		 * 
		 */
		updateMoneySum: function(thisTab) {
			var me = this;
			//thisTab参数0交通费1.住宿费2.其他费用3补助
			var moenySum = 0.00;
			if(thisTab == 0) {
				$("#traffic-list-info tbody .money-td").each(function(i, n) {
					moenySum += parseFloat($yt_baseElement.rmoney($(n).text()));
				});
				moenySum = $yt_baseElement.fmMoney(moenySum);
				if(moenySum != undefined && $yt_baseElement.rmoney(moenySum) > 0) {
					$("#traffic-list-info tbody .money-sum").text(moenySum);
				} else {
					$("#traffic-list-info tbody .money-sum").text("0.00");
				}
			}
			if(thisTab == 1) {
				$("#hotel-list-info tbody .money-td").each(function(i, n) {
					moenySum += parseFloat($yt_baseElement.rmoney($(n).text()));
				});
				moenySum = $yt_baseElement.fmMoney(moenySum);
				if(moenySum != undefined && $yt_baseElement.rmoney(moenySum) > 0) {
					$("#hotel-list-info tbody .money-sum").text(moenySum);
				} else {
					$("#hotel-list-info tbody .money-sum").text("0.00");
				}
			}
			if(thisTab == 2) {
				$("#other-list-info tbody .money-td").each(function(i, n) {
					moenySum += parseFloat($yt_baseElement.rmoney($(n).text()));
				});
				moenySum = $yt_baseElement.fmMoney(moenySum);
				if(moenySum != undefined && $yt_baseElement.rmoney(moenySum) > 0) {
					$("#other-list-info tbody .money-sum").text(moenySum);
				} else {
					$("#other-list-info tbody .money-sum").text("0.00");
				}
			}
			if(thisTab == 3) {
				$("#subsidy-list-info tbody .food-money").each(function(i, n) {
					moenySum += parseFloat($yt_baseElement.rmoney($(n).text()));
				});
				moenySum = $yt_baseElement.fmMoney(moenySum);
				if(moenySum != undefined && $yt_baseElement.rmoney(moenySum) > 0) {
					$("#subsidy-list-info tbody .money-sum").text(moenySum);
				} else {
					$("#subsidy-list-info tbody .money-sum").text("0.00");
				}
				var cityMoneySum = 0.00;
				$("#subsidy-list-info tbody .city-money").each(function(i, n) {
					cityMoneySum += parseFloat($yt_baseElement.rmoney($(n).text()));
				});
				cityMoneySum = $yt_baseElement.fmMoney(cityMoneySum);
				if(cityMoneySum != undefined && $yt_baseElement.rmoney(cityMoneySum) > 0) {
					$("#subsidy-list-info tbody .city-money-td").text(cityMoneySum);
				} else {
					$("#subsidy-list-info tbody .city-money-td").text("0.00");
				}
			}
			//调用刷新申请总预算金额的方法
			me.updateApplyMeonySum();
		},
		/**
		 * 设置补助明细的列表信息
		 * 
		 */
		setSubsidyList: function() {
			var me = this;
			//获取行程明细列表中的所有出差人
			var userStr = '';
			var trs = $('#tripList tbody tr');
			trs.each(function(i, n) {
				//对每行的出差人拆分去重
				var ls = $(n).attr('usercode').split(',');
				$.each(ls, function(j, m) {
					if(userStr.indexOf(m) < 0) {
						//拼接出差人
						userStr += m + ',';
					}
				});
			});
			//删除最后一个逗号
			userStr = (userStr.substring(userStr.length - 1) == ',') ? userStr.substring(0, userStr.length - 1) : userStr;
			//获取出差人详细信息
			var userList = sysCommon.getUserAllInfo('', userStr, '');
			var html = '';
			$.each(userList, function(i, n) {
				html += '<tr class="' + n.userItcode + '" code="' + n.userItcode + '"><td><div class="user" code="' + n.userItcode + '">' + n.userName + '</div></td><td><div class="lv">' + n.jobLevelName + '</div></td><td><div class="subsidy-num">0</div></td><td><div style="text-align:right;" class="food">0.00</div></td><td><div  style="text-align:right;" class="traffic">0.00</div></td><td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td></tr>';
			});
			html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">0.00</td><td class="total-traffic"  style="text-align:right;">0.00</td><td></td></tr>';
			//转换为jquery对象进行操作
			var jqHtml = $(html);

			//对补助金额明细中的金额天数 进行复制计算
			var code = '',
				tr = [],
				jqTr = [],
				day = 0,
				totalFood = 0,
				totalTraffic = 0;
			$.each(trs, function(i, n) {
				//当前行
				tr = $(n);
				//当前行的出差人code
				codeList = tr.attr('usercode').length > 0 ? tr.attr('usercode').split(',') : [];
				//获得当前行的全员出差天数
				day = +tr.find('.day').text();
				//获得当前行的所有人员 
				$.each(codeList, function(j, m) {
					//获取当前人员所在补助列表的行
					jqTr = jqHtml.siblings('[code="' + m + '"]');
					if(jqTr.length > 0) {
						//当前人员的天数计算 存在则累加
						var d = +(jqTr.find('.subsidy-num').text()) + day;
						jqTr.find('.subsidy-num').text(d);
						//伙食补助费
						jqTr.find('.food').text($yt_baseElement.fmMoney(d * 100)).attr('num', d * 100);
						//城市内交通费
						jqTr.find('.traffic').text($yt_baseElement.fmMoney(d * 80)).attr('num', d * 80);
					}
				});
			});

			//赋值总金额
			jqHtml.find('.total-food').text($yt_baseElement.fmMoney(totalFood)).attr('num', totalFood);
			jqHtml.find('.total-traffic').text($yt_baseElement.fmMoney(totalTraffic)).attr('num', totalTraffic);

			//添加页面代码
			$('#subsidy-list-info tbody').html(jqHtml);
			//设置合计金额
			me.setSubsidyTotal();
			//计算总金额
			me.updateMoneySum();

		},
		appendSubdisyList: function(tr) {
			var me = this;
			//出差人
			var subsidyBusinUser = $('#subsidyBusinUser').text();
			//级别
			var subsidyBusinLevel = $('#subsidyBusinLevel').text();
			//补助天数
			var subsidiesDays = $('#subsidiesDays').val();
			//伙食补助费
			var subsidiesFood = $('#subsidiesFood').val();
			//室内交通补助
			var subsidiesTraffic = $('#subsidiesTraffic').val();
			tr.find('.subsidy-num').text(subsidiesDays);
			tr.find('.food').text(subsidiesFood);
			tr.find('.traffic').text(subsidiesTraffic);
			//设置合计金额
			me.setSubsidyTotal();
			//计算总金额
			me.updateMoneySum();
			me.hideSubsidiesAlert();
		},
		/**
		 * 设置补助列表的合计金额
		 */
		setSubsidyTotal: function() {
			var trs = $('#subsidy-list-info tbody tr:not(.last)');
			//伙食补助费合计
			var totalFood = 0,
				//交通补助费合计
				totalTraffic = 0,
				tr = [];
			$.each(trs, function(i, n) {
				tr = $(n);
				totalFood += +(serveFunds.rmoney(tr.find('.food').text()));
				totalTraffic += +(serveFunds.rmoney(tr.find('.traffic').text()));
			});
			$('#subsidy-list-info tbody .total-food').text($yt_baseElement.fmMoney(totalFood)).attr('num', totalFood);
			$('#subsidy-list-info tbody .total-traffic').text($yt_baseElement.fmMoney(totalTraffic)).attr('num', totalTraffic);
		},
		/**
		 * 
		 * 清空差旅报销明细弹出框中表单数据
		 * 
		 */
		clearFormData: function() {
			var me = this;
			//获取弹出框对象
			var modelObj = $("#costApplyAlert");
			//清空输入框文本域内容
			$(".traffic-form input:not(.hid-risk-code),.hotel-form input:not(.hid-risk-code),.other-form input:not(.hid-risk-code)").val('');
			modelObj.find("textarea").val('');
			modelObj.find("select").each(function(i, n) {
				$(n).find("option:eq(0)").attr("selected", "selected");
			});
			//交通费二级菜单隐藏
			$("#vehicleTwoDiv").hide();
			//清空住宿费二级三级地点下拉列表
			modelObj.find("#hotelParentAddress,#hotelTwoAddres,#hotelChildAddres,#fromcity,#tocity").html('<option value="">请选择</option>');
			//初始化下拉列表
			modelObj.find("select").niceSelect();
			//入住天数默认提示信息
			modelObj.find(".hotel-num").text("自动计算").css("color", "#999999");
			//住宿费平均数
			modelObj.find("#peoDayMoney").text("0.00");
			//入住天数
			modelObj.find("#hotelDay").text("*");
			//tab标签初始
			$("#costApplyAlert .cost-type-tab ul li").removeClass("tab-check");
			$("#costApplyAlert .cost-type-tab ul li:eq(0)").addClass("tab-check");
			$(".traffic-form").show();
			$(".hotel-form,.other-form").hide();
			//显示加入列表按钮,隐藏确定按钮
			$("#model-add-list-btn").show();
			//显示确定按钮
			$("#model-sure-btn").hide();
			//将费用明细中的风险灯都改为红色
			//modelObj.find(".risk-img").attr("src", sysCommon.riskExcMark);
			//清空验证信息
			modelObj.find(".valid-font").text("");
			modelObj.find(".valid-hint").removeClass("valid-hint");
			//调用获取出差地点方法
			serveFunds.setAddress();
			me.getPlanBusiAddress($("#fromcity"));
			me.getPlanBusiAddress($("#tocity"));
		},
		/**
		 *  行程表单出差地点事件
		 * @param {Object} labelObj 当前标签对象
		 */
		getPlanBusiAddress: function(labelObj) {
			var me = this;
			/**
			 * 
			 * 行程表单中出差地点
			 * 
			 */
			//4.初始化调用插件刷新方法  
			$(labelObj).niceSelect({
				search: true,
				backFunction: function(text) {
					//回调方法,可以执行模糊查询,也可自行添加操作  
					$(labelObj).find("option").remove();
					var opt = '';
					//遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
					//opt += '<option   disabled="disabled">支持模糊搜索省/市/区</option>';
					if(text == "") {
						$.each(me.addressList, function(i, n) {
							//省
							if(n.regionLevel == "PROVINCE") {
								//行程中的出差地点
								opt += '<option value="' + n.regionCode + '" data-level="' + n.regionLevel + '" data-name="' + n.regionName + '">' + n.regionName + '</option>';
							}
						});
					} else {
						//遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
						$.each(me.addressList, function(i, n) {
							//名称模糊查询
							if(n.regionName.indexOf(text) != -1) {
								opt += '<option value="' + n.regionCode + '" data-level="' + n.regionLevel + '" data-name="' + n.regionName + '">' + n.regionName + '/' + n.regionMergerName.substr(3) + '</option>';
							}
							//拼音模糊查询
							if(n.regionNamePinYin.indexOf(text) != -1) {
								opt += '<option value="' + n.regionCode + '" data-level="' + n.regionLevel + '" data-name="' + n.regionName + '">' + n.regionName + '/' + n.regionMergerName.substr(3) + '</option>';
							}
						});
					}
					$(labelObj).append(opt);
				}
			});

		},
		/**
		 * 1.1.4.5	根据事前申请Id获取报销申请详细信息   
		 * 导入事前审批单用
		 * @param {Object} id
		 */
		getAdvanceAppInfoDetailByAdvanceAppId: function(id, upDate) {
			$.ajax({
				type: "post",
				url: "sz/advanceApp/getAdvanceExpenditureAppInfoDetail",
				async: true,
				data: {
					advanceAppId: id
				},
				success: function(data) {
					//保存查询成功的事前数据
					if(data.flag == 0) {
						$('#advanceAppId').text(data.data.advanceAppId);
						serveFunds.getExpenditureList($('#advanceAppId').val());
						serveFunds.beforeCostList = data.data;
						//如果基本信息中有选择的事前审批单，将事前审批单中的相关附件中的文件导入，导入的文件不可删除
						serveFunds.exportBeforeFiles(data.data.attList);
					}
				}
			});

		},
		/**
		 * 添加事前申请的附件数据
		 * @param {Object} files
		 */
		exportBeforeFiles: function(files) {
			if(files.length > 0) {
				var ls = '';
				var src = '';
				$.each(files, function(i, n) {
					//获取图片格式
					var imgType = n.attName.split('.');
					if(imgType.length > 1 && (imgType[1] == 'png' || imgType[1] == 'jpeg' || imgType[1] == 'bmp' || imgType[1] == 'jpg')) {
						//拼接图片路径
						src = $yt_option.base_path + 'fileUpDownload/download?pkId=' + n.attId + '&isDownload=false';
						ls += '<div fid="' + n.attId + '" class="li-div export"><span class="file-name" >' + n.attName + '</span><label class="file-pv">预览<img src="' + src + '" ></label><label class="file-dw">下载</label></div>';
					} else {
						ls += '<div fid="' + n.attId + '" class="li-div export"><span class="file-name" >' + n.attName + '</span><label class="file-pvno">预览</label><label class="file-dw">下载</label></div>';
					}
				});
				$('#advanceIdStr').html(ls);
				//图片下载
				$('#advanceIdStr .file-dw').off().on('click', function() {
					var id = $(this).parent().attr('fid');
					window.location.href = $yt_option.base_path + 'fileUpDownload/download?pkId=' + id + '&isDownload=true';
				});
				//图片预览
				$('#advanceIdStr .file-pv img').showImg();
			} else {
				$('#advanceIdStr').html('<div class="li-div"><span>暂无附件</span></div>');
			}
		},
		/**
		 * 接待对象信息列表数据循环
		 * @param {Object} list
		 */
		setCostReceptionistList: function(costReceptionistList, exports) {
			var me = this;
			//接待对象信息集合HTML文本
			var receHtml = '';
			$.each(costReceptionistList, function(i, n) {
				receHtml += '<tr pkId="' + n.costReceptionistId + '" class="' + (exports ? 'exports' : '') + '" applyname="' + n.name + '" duties="' + n.jobName + '" unit="' + n.unitName + '">' +
					'<td><span class="num">1</span></td>' +
					'<td><span class="name-text">' + n.name + '</span></td>' +
					'<td><span class="job-text">' + n.jobName + '</span></td>' +
					'<td><span class="unit-text">' + n.unitName + '</span></td>' +
					'<td><span class="receive-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="receive-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
					'</tr>';
			});
			//替换代码
			$('.msg-list tbody').append(receHtml);
			//重置序号
			me.resetNum($('.msg-list'));
		},
		/**
		 * 招待费详情列表数据显示
		 * @param {Object} costDetailsList
		 */
		setCostDetailsList: function(costDetailsList, exports) {
			//费用明细信息集合HTML文本
			var detaHtml = '';
			var fmTotal = 0;
			$.each(costDetailsList, function(i, n) {
				fmTotal += n.activityAmount;
				detaHtml += '<tr class="' + (exports ? 'exports' : '') + '" pkId="' + n.costDetailsId + '" budgetCode="' + n.publicServiceProCode + '" costCode="' + n.costType + '" budgetProject="' + n.publicServiceProName + '" applyDate="' + n.activityDate + '" siteVal="' + n.placeName + '" costBreakdown="' + n.costTypeName + '" standardMoney="' + n.standardAmount + '" budgetMoney="' + n.activityAmount + '" accompanyNum="' + n.peopleNum + '">' +
					'<td><span class="">' + n.publicServiceProName + '</span></td>' +
					'<td><span class="act-date">' + n.activityDate + '</span></td>' +
					'<td><span class="place-name">' + n.placeName + '</span></td>' +
					'<td><span>' + n.costTypeName + '</span></td>' +
					/*'<td style="text-align: right;"><div class="stan-money" money=' + n.standardAmount + '>' + $yt_baseElement.fmMoney(n.standardAmount || '0') + '</div></td>' +*/
					'<td style="text-align: right;"><div class="money" money=' + n.activityAmount + '>' + $yt_baseElement.fmMoney(n.activityAmount || '0') + '</div></td>' +
					'<td><span class="people-num">' + n.peopleNum + '</span></td>' +
					'<td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
					'</tr>';

			});
			//追加表格代码
			$('#paymentList tbody .last').before(detaHtml);
			$('#paymentList tbody .total-money').text(serveFunds.fmMoney(fmTotal));
		},
		/**
		 * 行程明细列表数据显示
		 * @param {Object} tripPlanList
		 */
		setTravelRouteList: function(tripPlanList, exports) {
			var me = this;
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

			//去重出差人操作
			var clearRepetitionUser = function(list, str) {
				var checkUsersCodes = me.usersInfoList;
				var srtList = str.split(',');
				//遍历表格中的数据,
				$.each(srtList, function(i, n) {
					//var selUsersCode = "," + n + ",";
					if(checkUsersCodes.indexOf(n) < 0) {
						//拼接出差人集合
						me.usersInfoList = me.usersInfoList + '{"userItcode":"' + n + '","jobLevelName":"' + list[i].travelPersonnelsJobLevelName + '","userName":"' + list[i].travelPersonnelName + '"},';
					}
				});
			};
			$.each(tripPlanList, function(i, n) {
				//1. 把开始时间和结束时间保存
				var dateFrom = new Date(n.startTime);
				var dateTo = new Date(n.endTime);
				//2. 计算时间差
				var diff = dateTo.valueOf() - dateFrom.valueOf();
				//3. 时间差转换为天数
				var diff_day = parseInt(diff / (1000 * 60 * 60 * 24)) + 1;

				tripHtml += '<tr class="' + (exports ? 'exports' : '') + '" busicode="' + n.travelType + '" usercode="' + n.travelPersonnels + '" rececode="' + n.receptionCostItem + '" >' +
					'<td><input type="hidden" class="hid-user-code" value="' + n.travelPersonnels + '" /> <span class="name">' + n.travelTypeName + '</span></td>' +
					'<td class="sdate">' + n.startTime + '</td>' +
					'<td class="edate">' + n.endTime + '</td>' +
					'<td class="day">' + diff_day + '</td>' +
					'<td class="address" val="' + n.travelAddress + '">' + n.travelAddressName + '</td>' +
					'<td class="uname">' + getUserNames(n.travelPersonnelsList) + '</td>' +
					'<td class="numof">' + n.travelPersonnelsList.length + '</td>' +
					'<td class="reception">' + getCostItemName(n.receptionCostItem) + '</td>' +
					'<td>' +
					'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>' +
					'</td>' +
					'</tr>';

				clearRepetitionUser(n.travelPersonnelsList, n.travelPersonnels);
			});
			$('#tripList tbody').append(tripHtml);

			//导入时更新补助明细列表
			if(exports) {
				//更新补助明细内容
				me.setSubsidyList();
				//重新计算总金额
				me.updateApplyMeonySum();
			}
			//更新费用明细弹框中的出差人列表
			//me.getModelUsersInfo();
		},
		/**
		 * 设置城市间交通费列表数据
		 * @param {Object} costCarfareList
		 */
		setCostCarfareList: function(costCarfareList, exports) {
			var carHtml = '';
			//结算方式复选框
			var costCarfareClose = $('#traffic-list-info').next().find('.check-label input');
			var vehicle = [];
			$.each(costCarfareList, function(i, n) {
				//去掉第一个和最后一个. 后拆分
				vehicle = n.vehicle.substr(1).substr(0, n.vehicle.length - 2).split('.');
				carHtml += '<tr class="' + (exports ? 'exports' : '') + '">' +
					'<td><span>' + n.travelPersonnelName + '</span>' +
					'<input type="hidden" risk-code-val="trafficBusiUsers" data-val="travelPersonnel" class="hid-traf-users" value="' + n.travelPersonnel + '"/>' +
					'</td><td><span>' + n.travelPersonnelsJobLevelName + '</span>' +
					'<input type="hidden" risk-code-val="trafficBusiUsersLevel" value="' + n.travelPersonnelsJobLevelCode + '"/></td>' +
					'<td data-text="goTime">' + n.goTime + '</td>' +
					'<td><input data-val="goAddress" type="hidden" value="' + n.goAddress + '">' +
					'<span data-text="goAddressName">' + n.goAddressName + '</span></td>' +
					'<td data-text="arrivalTime">' + n.arrivalTime + '</td>' +
					'<td><input data-val="arrivalAddress" type="hidden" value="' + n.arrivalAddress + '">' +
					'<span data-text="arrivalAddressName">' + n.arrivalAddressName + '</span>' +
					'</td>' +
					'<td><span data-text="vehicle">' + n.vehicleName + '</span>' +
					'<input type="hidden" class="hid-vehicle"  risk-code-val="vehicleParent" value="' + vehicle[0] + '"/>' +
					'<input type="hidden" class="hid-child-code" risk-code-val="vehicleChild" value="' + (vehicle.length > 1 ? vehicle[1] : '') + '"/></td>' +
					'<td class="font-right money-td" data-text="crafare">' + (n.crafare == "" ? "--" : $yt_baseElement.fmMoney(n.crafare || '0')) + '</td>' +
					'<td class="text-overflow-sty" data-text="remarks" title="' + n.remarks + '">' + (n.remarks == "" ? "无" : n.remarks) + '</td>' +
					'<td>' +
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
				'<td></td><td></td></tr>';
			$('#traffic-list-info tbody').html(carHtml);
			//调用合计方法
			sysCommon.updateMoneySum(0);
		},
		/**
		 * 住宿费列表数据显示
		 * @param {Object} costHotelList
		 */
		setCostHotelList: function(costHotelList, exports) {
			var hotelHtml = '';
			//结算方式复选框
			var costHotelClose = $('#hotel-list-info').next().find('.check-label input');
			var addresCdoe = [];
			$.each(costHotelList, function(i, n) {
				addresCdoe = n.hotelAddress.split('-');
				var avg = n.hotelDays > 0 ? $yt_baseElement.fmMoney((+n.hotelExpense / +n.hotelDays) || '0') : n.hotelExpense;
				hotelHtml += '<tr class="' + (exports ? 'exports' : '') + '">' +
					'<td><span>' + n.travelPersonnelName + '</span>' +
					'<input type="hidden" data-val="travelPersonnel" risk-code-val="hotelBusiUsers" value="' + n.travelPersonnel + '"/></td>' +
					'<td><span>' + n.travelPersonnelsJobLevelName + '</span>' +
					'<input type="hidden" risk-code-val="hotelBusiUsersLevel" value="' + n.travelPersonnelsJobLevelCode + '"/>' +
					'</td>' +
					'<td  risk-code-val="costDetailHotelCost" class="font-right"><span>' + avg + '<span></td>' +
					'<td risk-code-val="hotelCheckInDate" class="check-in-date"><span data-text="hotelTime" class="sdate">' + n.hotelTime + '</span></td>' +
					'<td class="leave-date"><span data-text="leaveTime" class="edate">' + n.leaveTime + '</span></td>' +
					'<td data-text="hotelDays">' + n.hotelDays + '</td>' +
					'<td class="font-right money-td" data-text="hotelExpense"  risk-code-val="hotelCost">' + $yt_baseElement.fmMoney(n.hotelExpense || '0') + '</td>' +
					'<td><span data-text="hotelAddressName">' + n.hotelAddressName + '</span>' +
					'<input type="hidden" data-val="hotelAddress" value="' + n.hotelAddress + '"/>' +
					'<input type="hidden" risk-code-val="hotelProvinceAddress" value="' + addresCdoe[0] + '">' +
					'<input type="hidden" risk-code-val="hotelCityAddress" value="' + addresCdoe[1] + '">' +
					'<input type="hidden" risk-code-val="hotelHaidianAddress" value="' + addresCdoe[2] + '">' +
					'</td>' +
					'<td class="text-overflow-sty" data-text="remarks" title="' + n.remarks + '">' + (n.remarks == "" ? "无" : n.remarks) + '</td>' +
					'<td>' +
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
				'<td><span class="tab-font-blod">合计</span></td><td></td><td></td><td></td>' +
				'<td></td><td></td><td class="font-right"><span class="tab-font-blod money-sum">0.00</span></td>' +
				'<td></td><td></td><td></td></tr>';
			$('#hotel-list-info tbody').html(hotelHtml);
			//调用合计方法
			sysCommon.updateMoneySum(1);
		},
		/**
		 * 其他费用列表数据显示
		 * @param {Object} costOtherList
		 */
		setCostOtherList: function(costOtherList, exports) {
			var otherHtml = '';
			//结算方式复选框
			var costOtherClose = $('#other-list-info').next().find('.check-label input');
			$.each(costOtherList, function(i, n) {
				otherHtml += '<tr class="' + (exports ? 'exports' : '') + '">' +
					'<td><span>' + n.costTypeName + '</span>' +
					'<input type="hidden" data-val="costType" risk-code-val="otherCostType"  value="' + n.costType + '"/></td>' +
					'<td class="font-right money-td" data-text="reimAmount"  risk-code-val="otherCostReimPrice">' + $yt_baseElement.fmMoney(n.reimAmount || '0') + '</td>' +
					'<td class="text-overflow-sty" data-text="remarks" title="' + n.remarks + '">' + (n.remarks == "" ? "无" : n.remarks) + '</td>' +
					'<td>' +
					'<input type="hidden" class="hid-cost-type" value="2"/>' +
					'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>' +
					'</td></tr>';
				//结算方式复选框存在并且有选中的值时
				if(costOtherClose.length > 0 && n.setMethod) {
					//设置选中
					costOtherClose.setCheckBoxState('check');
				}
			});
			otherHtml += '<tr class="total-last-tr">' +
				'<td><span class="tab-font-blod">合计</span></td>' +
				'<td class="font-right"><span class="tab-font-blod money-sum">0.00</span></td>' +
				'<td></td><td></td></tr>';
			$('#other-list-info tbody').html(otherHtml);
			//调用合计方法
			sysCommon.updateMoneySum(2);
		},
		/**
		 * 设置补助明细列表
		 * @param {Object} costSubsidyList
		 */
		setCostSubsidyList: function(costSubsidyList, exports) {
			var subHtml = '';
			var totalFood = 0;
			var totalTraffic = 0;
			$.each(costSubsidyList, function(i, n) {
				subHtml += '<tr class="' + n.travelPersonnel + ' ' + (exports ? 'exports' : '') + '" code="' + n.travelPersonnel + '"><td><div class="user" code="' + n.travelPersonnel + '">' + n.travelPersonnelName + '</div></td><td><div class="lv">' + n.travelPersonnelsDept + '</div></td><td><div class="subsidy-num">' + n.subsidyDays + '</div></td><td><div style="text-align:right;" class="food">' + $yt_baseElement.fmMoney(n.subsidyFoodAmount || '0') + '</div></td><td><div  style="text-align:right;" class="traffic">' + $yt_baseElement.fmMoney(n.carfare || '0') + '</div></td><td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td></tr>';
				totalFood += +n.subsidyFoodAmount;
				totalTraffic += +n.carfare;
			});
			subHtml += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + $yt_baseElement.fmMoney(totalFood || '0') + '</td><td class="total-traffic"  style="text-align:right;">' + $yt_baseElement.fmMoney(totalTraffic || '0') + '</td><td></td></tr>';
			$('#subsidy-list-info tbody').html(subHtml);
		},
		/**
		 * trainApplyInfoList	师资-培训信息json
		 * 设置 师资培训信息列表数据
		 * @param {Object} list
		 */
		setTrainApplyInfoList: function(list, exports) {
			var html = '';
			$.each(list, function(i, n) {
				serveFunds.getTrainingTypeOption(n.trainType); //trainType 培训类型
				$('#meetingClassification').niceSelect();
				$('#regionDesignation').val(n.regionDesignation); //regionDesignation 培训名称
				$('#regionName').val(n.regionName); //regionName 培训地点中文
				$('#startTimeTop').val(n.reportTime); //reportTime 报到时间
				$('#endTimeTop').val(n.endTime); //endTime 结束时间
				$('#calculationSession').val(n.trainDays); //trainDays 培训天数
				$('#trainOfNum').val(n.trainOfNum); //trainOfNum 培训人数
				$('#workerNum').val(n.workerNum); //workerNum 工作人员数量
				$('#approvaNum').val(n.approvaNum); //approvaNum 批准文号
				$('#chargeStandard').val(n.chargeStandard); //chargeStandard 收费标准	
				if(exports) {
					$('#meetingClassification,#regionDesignation,#regionName,#startTimeTop,#endTimeTop,#calculationSession,#trainOfNum,#workerNum').addClass('exports');
				}
			});
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveFunds.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveFunds.fmMoney(totalTraffic) + '</td></tr>';
			$('#trainingPopTable tbody').html(html);
		},
		/**
		 * teacherApplyInfoList	师资-讲师信息json
		 * 设置 师资讲师信息列表数据
		 * @param {Object} list
		 */
		setTeacherApplyInfoList: function(list, exports) {
			var html = '';
			$.each(list, function(i, n) {
				html += '<tr class="' + (exports ? 'exports' : '') + '">' +
					'<td class="lecturerName"><input type="hidden" class="lectureId" value="' + n.lecturerId + '"><span>' + n.lecturerName + '</span></td>' +
					'<td class="professional">' + (n.lecturerTitleName == '' ? '--' : n.lecturerTitleName) + '</td>' +
					'<td class="level">' + (n.lecturerLevelName == '' ? '--' : n.lecturerLevelName) + '</td>' +
					'<td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td></tr>';
			});
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveFunds.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveFunds.fmMoney(totalTraffic) + '</td></tr>';
			$('#lecturerTable tbody').html(html);
		},
		/**
		 * costTrainApplyInfoList	师资-培训费json
		 * 设置 师资培训费列表数据
		 * @param {Object} list
		 */
		setCostTrainApplyInfoList: function(list, exports) {
			var html = '';
			var total = 0;
			$.each(list, function(i, n) {
				html += '<tr class="' + (exports ? 'exports' : '') + '" costnameval="' + n.trainType + '" pid="">'+
						'<td class="cost-name">' + n.trainTypeName + '</td>'+
						'<td class="moneyText standard-money">' + ($yt_baseElement.fmMoney(n.standard)) + '</td>'+
						'<td class="people-num">' + n.trainOfNum + '</td>'+
						'<td class="day-num">' + n.trainDays + '</td>'+
						'<td class="moneyText smallplan-money">' + serveFunds.fmMoney(n.averageMoney) + '</td>'+
						'<td class="special-instruct">' + n.remark + '</td>'+
						'<td><input type="hidden" class="popM" value="4"><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td></tr>';
				total += +n.averageMoney;
			});
			$('#trainingFeeTable tbody tr.last').before(html).find('.costTotal').text(serveFunds.fmMoney(total));
		},
		/**
		 * costTrainApplyInfoList	收入费用json
		 * 设置 收入费用费列表数据
		 * @param {Object} list
		 */
		costPredictInfoList: function(list, exports) {
			var list = [];
			var trs = $('#predictCostTable tbody tr:not(.last)');
			var tr = null;
			$.each(trs, function(i, n) {
				tr = $(n);
				list.push({
					predictName: tr.find('.cost-name').text(), 
					predictStandardMoney: $yt_baseElement.rmoney(tr.find('.predict-standard-money').text()),
					predictPeopleNum: tr.find('.predict-people-num').text(),
					averageMoney: $yt_baseElement.rmoney(tr.find('.predict-smallplan-money').text()), 
					remark: tr.find('.special-instruct').text() 
				});
			});
			return list;
		},
		/**
		 * costTeachersFoodApplyInfoList	师资-伙食费json
		 * 设置 师资伙食费列表
		 * @param {Object} list
		 */
		setCostTeachersFoodApplyInfoList: function(list, exports) {
			var html = '';
			var total = 0;
			$.each(list, function(i, n) {
				html += '<tr class="' + (exports ? 'exports' : '') + '" pid="' + n.foodId + '">' +
					'<td class="name"><input type="hidden" class="lectureId" value="' + n.lecturerId + '">' + n.lecturerName + '</td>' +
					'<td class="moneyText avg">' + serveFunds.fmMoney(n.averageMoney) + '</td>' +
					'<td class="day">' + n.foodOfDays + '</td>' +
					'<td class="moneyText sum-pay">' + serveFunds.fmMoney(n.foodAmount) + '</td>' +
					'<td style="text-align: left !important;" class="dec">' + (n.remarks || '无') + '</td>' +
					'<td><input type="hidden" class="popM" value="3"/>' +
					'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
					'</tr>';
				//total += +n.foodAmount;
			});
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveFunds.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveFunds.fmMoney(totalTraffic) + '</td></tr>';
			$('#dietFeeTable tbody .end-tr').before(html);
			//计算合计金额
			$('#dietFeeTable tbody tr:not(.end-tr)').each(function() {
				total += serveFunds.rmoney($(this).find('.sum-pay').text());
			});
			$('#dietFeeTable tbody .costTotal').text(serveFunds.fmMoney(total));
		},
		/**
		 * //costTeachersLectureApplyInfoList	师资-讲课费json
		 * 设置 师资讲课费列表
		 * @param {Object} list
		 */
		setCostTeachersLectureApplyInfoList: function(list, exports) {
			var html = '';
			var total = 0;
			var afterTotal = 0;
			$.each(list, function(i, n) {
				html += '<tr class="' + (exports ? 'exports' : '') + '" pid="' + n.teachersLectureId + '">' +
					'<td class="uname"><input type="hidden" class="lectureId" value="' + n.lecturerId + '">' + n.lecturerName + '</td>' +
					'<td class="holder">' + (n.lecturerTitleName || '--') + '</td>' +
					'<td class="hour">' + n.teachingHours + '</td>' +
					'<td class="cname">' + (n.courseName || '--') + '</td>' +
					'<td class="moneyText sum-pay">' + serveFunds.fmMoney(n.perTaxAmount) + '</td>' +
					'<td class="moneyText after">' + serveFunds.fmMoney(n.afterTaxAmount) + '</td>' +
					'<td class="moneyText avg">' + serveFunds.fmMoney(n.averageMoney) + '</td>' +
					'<td><input type="hidden" class="popM" value="0"/>' +
					'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
					'</td></tr>';
				total += +n.perTaxAmount;
				afterTotal += +n.afterTaxAmount;
			});
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveFunds.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveFunds.fmMoney(totalTraffic) + '</td></tr>';
			$('#lectureFeeTable tbody .end-tr').before(html);
			//计算合计金额
//			$('#lectureFeeTable tbody tr:not(.end-tr)').each(function() {
//				total += serveFunds.rmoney($(this).find('.after').text());
//			});
			$('#lectureFeeTable tbody .costTotal').text(serveFunds.fmMoney(total));
			$('#lectureFeeTable tbody .costTotal-after').text(serveFunds.fmMoney(afterTotal));
		},
		/**
		 * //costTeachersTravelApplyInfoList	师资-城市间交通费json
		 * 设置 师资城市间交通费列表
		 * @param {Object} list
		 */
		setCostTeachersTravelApplyInfoList: function(list, exports) {
			var html = '';
			var total = 0;
			$.each(list, function(i, n) {
				html += '<tr class="' + (exports ? 'exports' : '') + '" pid="' + n.teachersTravelId + '">' +
					'<td class="uname"><input type="hidden" class="lectureId" value="' + n.lecturerId + '">' + n.lecturerName + '</td>' +
					'<td class="ulv">' + (n.lecturerLevelName || '--') + '</td>' +
					'<td class="sdate">' + n.goTime + '</td>' +
					'<td class="edate">' + n.arrivalTime + '</td>' +
					'<td class="sadd"><input type="hidden" class="scode" value="' + n.goAddress + '">' + n.goAddressName + '</td>' +
					'<td class="eadd"><input type="hidden" class="ecode" value="' + n.arrivalAddress + '">' + n.arrivalAddressName + '</td>' +
					'<td class="tname"><input type="hidden" class="tool" value="' + n.vehicle + '">' + n.vehicleName + '</td>' +
					'<td class="moneyText sum-pay">' + serveFunds.fmMoney(n.carfare) + '</td>' +
					'<td style="text-align: left !important;" class="dec">' + (n.remarks || '无') + '</td>' +
					'<td><input type="hidden" class="popM" value="1"/>' +
					'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
					'</td></tr>';
				//total += +n.carfare;
			});
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveFunds.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveFunds.fmMoney(totalTraffic) + '</td></tr>';
			$('#carFeeTable tbody .end-tr').before(html);
			//计算合计金额
			$('#carFeeTable tbody tr:not(.end-tr)').each(function() {
				total += serveFunds.rmoney($(this).find('.sum-pay').text());
			});
			$('#carFeeTable tbody .costTotal').text(serveFunds.fmMoney(total));
		},
		/**
		 * //costTeachersHotelApplyInfoList	师资-住宿费 json
		 * 设置 师资住宿费列表
		 * @param {Object} list
		 */
		setCostTeachersHotelApplyInfoList: function(list, exports) {
			var html = '';
			var total = 0;
			$.each(list, function(i, n) {
				html += '<tr class="' + (exports ? 'exports' : '') + '" pid="' + n.teachersHotelId + '" level="' + n.lecturerLevelName + '">' +
					'<td class="name"><input type="hidden" class="lectureId" value="' + n.lecturerId + '">' + n.lecturerName + '</td>' +
					'<td class="sdate">' + n.startTime + '</td>' +
					'<td class="edate">' + n.endTime + '</td>' +
					'<td class="moneyText avg">' + serveFunds.fmMoney(n.averageMoney) + '</td>' +
					'<td class="day">' + n.hotelDays + '</td>' +
					'<td class="moneyText sum-pay">' + serveFunds.fmMoney(n.hotelExpense) + '</td>' +
					'<td style="text-align: left !important;" class="dec">' + (n.remarks || '无') + '</td>' +
					'<td><input type="hidden" class="popM" value="3"/>' +
					'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
					'</td></tr>';
				//total += +n.hotelExpense;
			});
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveFunds.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveFunds.fmMoney(totalTraffic) + '</td></tr>';
			$('#hotelFeeTable tbody .end-tr').before(html);
			//计算合计金额
			$('#hotelFeeTable tbody tr:not(.end-tr)').each(function() {
				total += serveFunds.rmoney($(this).find('.sum-pay').text());
			});
			$('#hotelFeeTable tbody .costTotal').text(serveFunds.fmMoney(total));
		},
		/**
		 * //costNormalList	普通报销-费用明细/普通付款-付款明细 json
		 * 设置普通报销列表数据
		 * @param {Object} list
		 */
		setCostNormalList: function(list, exports) {
			var html = '';
			var total = 0;
			$.each(list, function(i, n) {
				html += '<tr class="yt-tab-row ' + (exports ? 'exports' : '') + '">' +
					' <td style="text-align:left;" class="reimContent">' + n.normalName + '</td>' +
					' <td style="text-align: right;" class="reimAmount">' + ($yt_baseElement.fmMoney(n.normalAmount)) + '</td>' +
					' <td class="reimInstructions"> ' + (n.remarks || '无') + '</td>' +
					' <td>' +
					' <span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					' <span class="operate-del" style=""><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
					' </td>' +
					' </tr>';
				total += +n.normalAmount;
			});
			$('.ordinary-approval #costList tbody .last').before(html);
			$('.ordinary-approval #costList tbody #reimAmountlSum').text($yt_baseElement.fmMoney(total));
		},
		/**
		 * 会议费会议详情数据
		 * @param {Object} list
		 */
		setMeetingList: function(list, exports) {
			$.each(list, function(i, n) {
				//调用会议费类型赋值
				serveFunds.getMeetingTypeCode(n.meetType); //meetType 会议分类
				$('#meetName').val(n.meetName); //meetName 会议名称
				$('#meetAddress').val(n.meetAddress); //meetAddress 会议地点中文
				$('#startTime').val(n.meetStartTime); //meetStartTime 会议开始时间
				$('#endTime').val(n.meetEndTime); //meetEndTime 会议结束时间
				if(n.meetDays) {
					$('#calculationSession').val(n.meetDays).css('color', '#333').removeClass('calculation-Identification'); //meetDays 会期
				}
				$('#meetOfNum').val(n.meetOfNum); //meetOfNum 参会人数
				$('#meetWorkerNum').val(n.meetWorkerNum); //meetWorkerNum 工作人员数量
				if(exports) {
					$('#meetName,#meetAddress,#startTime,#endTime,#calculationSession,#meetOfNum,#meetWorkerNum').addClass('exports');
				}
			});
		},
		/**
		 * 会议费费用明细数据
		 * @param {Object} list
		 */
		setMeetingCostList: function(list, exports) {
			$.each(list, function(i, n) {
				$('#meetHotel').val($yt_baseElement.fmMoney(n.meetHotel)); //meetHotel 住宿费
				$('#meetFood').val($yt_baseElement.fmMoney(n.meetFood)); //meetFood 伙食费
				$('#meetOther').val($yt_baseElement.fmMoney(n.meetOther)); //meetOther 其他费用
				$('#costTotal,#applyTotalMoney').text($yt_baseElement.fmMoney(n.meetAmount)).css('color', '#333'); //meetAmount 费用合计
				$('#TotalMoneyUpper').text(arabiaToChinese(n.meetAmount)); //大写金额
				$('#dailyAverageConsumption').text($yt_baseElement.fmMoney(n.meetAverage)).css('color', '#333'); //meetAverage 人均日均费用金额
				if(exports) {
					$('#meetHotel,#meetFood,#meetOther,#costTotal,#dailyAverageConsumption').addClass('exports');
				}

			});
		},
		/**
		 * 预计收入费用明细
		 */
		setCostPredictInfoList : function(list, exports) {
			var html = '';
			var costTotal = 0;
			var costTotalAfter = 0;
			$.each(list,function(i, n) {
				html += '<tr class="'+ (exports ? 'exports' : '') + '" pid="'+n.teachersTrainId+'">' +
						'<td class="cost-name">'+ n.predictName + '</td>' +
						'<td class="moneyText predict-standard-money">'+ ($yt_baseElement.fmMoney(n.predictStandardMoney))+ '</td>'+
						'<td class="predict-people-num">'+ n.predictPeopleNum + '</td>'+
						'<td class="moneyText predict-smallplan-money">'+ serveFunds.fmMoney(n.averageMoney) + '</td>'+
						'<td class="moneyText predict-all-money" style="display:none;">'+ serveFunds.fmMoney(n.predictAllMoney)+ '</td>'+
						'<td class="special-instruct">'+ n.remark + '</td>'+
						'<td><input type="hidden" class="popM" value="4"><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td></tr>';
				 costTotalAfter+= +n.predictStandardMoney;
				 costTotal+=+n.averageMoney;
			});
			
			$('#predictCostTable tbody tr.last').find('.costTotal-after').text(serveFunds.fmMoney(costTotalAfter))
			$('#predictCostTable tbody tr.last').before(html).find('.costTotal').text(serveFunds.fmMoney(costTotal));		
		},
		/**
		 * 事前申请单是否必填验证操作
		 */
		priorApprovalNon: function() {
			
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
					$('#deptBudgetBalanceAmount,#budgetBalanceAmount').text('--');
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
					$('#deptBudgetBalanceAmount,#budgetBalanceAmount').text('--');
					$('div.budget-item-two').hide();
					$('div.budget-item-three').hide();
				}
				//选择为项目支出时显示项目名称
				if(code == '395') {
					$('.prj-name-tr').show();
				} else {
					$('.prj-name-tr').hide().val('');
				}
				//验证事前申请单必填
				me.priorApprovalNon();
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
				//验证事前申请单必填
				me.priorApprovalNon();
			});

			//第三级更新获取余额
			$('select.budget-item-three').on('change', function() {
				//第三级存在获取第三级的余额
				var threeCode = $('select.budget-item-three').find('option:selected').val();
				me.getBudgetBalanceAmount(threeCode);
				//验证事前申请单必填
				me.priorApprovalNon();
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
					if(data.flag == 0) {
						//部门预算额度
						var deptBudgetBalanceAmount = data.data.deptBudgetBalanceAmount;
						$('#deptBudgetBalanceAmount').text(deptBudgetBalanceAmount ? serveFunds.fmMoney(deptBudgetBalanceAmount) + '万元' : '--');
						//单位预算额度
						var budgetBalanceAmount = data.data.budgetBalanceAmount;
						$('#budgetBalanceAmount').text(budgetBalanceAmount ? serveFunds.fmMoney(budgetBalanceAmount) + '万元' : '--');
						//验证金额
						//serveFunds.verifyBudgetExpendSum();
					}

				}
			});
		},
		/**
		 * 验证预算部门金额与支出申请金额
		 */
		verifyBudgetExpendSum: function() {
			//获取支出金额
			var expend = serveFunds.rmoney($('#applyTotalMoney').text());
			//获取预算金额
			var budget = serveFunds.rmoney($('#deptBudgetBalanceAmount').text().replace('万元', '')) * 10000;
			//当部门可用预算余额小于支出事前申请金额或支出申请金额时，弹窗提示“部门预算可用余额小于当前申请的金额，请调整申请内容，或先保存页面信息，待部门预算调整后再重新提交申请。”
			if(budget < expend) {
				$yt_alert_Model.alertOne({
					haveCloseIcon: true, //是否带有关闭图标  
					leftBtnName: "确定", //左侧按钮名称,默认确定  
					cancelFunction: "", //取消按钮操作方法*/  
					alertMsg: "部门预算可用余额小于当前申请的金额，请调整申请内容，或先保存页面信息，待部门预算调整后再重新提交申请。", //提示信息  
					//alertMsg: "单位预算可用余额小于当前申请的金额，请调整申请内容，或先保存页面信息，待单位预算调整后再重新提交申请。", //提示信息  
					cancelFunction: function() {},
				});
				return false;
			}
			return true;
		},
		/**
		 * 获取收款方信息的收款方式合计
		 */
		getPaymentTermTotal: function() {
			//现金
			var cash = serveFunds.rmoney($('#cash').val());
			//公务卡
			var offic = serveFunds.rmoney($('#officialCard').val());
			//转账
			var trans = serveFunds.rmoney($('#transferAccounts').val());
			return cash + offic + trans;
		},
		//	弹出关闭收款方弹窗方法
		alertClearReceivables: function() {
			//填写金额不能大于个人冲销后补领总金额，失去焦点验证；如果校验失败，显示提示信息：“金额不能大于冲销后补领总金额”
			$('#cash,#officialCard,#transferAccounts').on('blur', function() {
				//补领总金额
				var writeoff = serveFunds.rmoney($('.personal-writeoff-money').text());
				var total = serveFunds.getPaymentTermTotal();
				if(total > writeoff) {
					//当前输入框获得焦点
					$(this).focus();
					$yt_alert_Model.prompt('金额不能大于冲销后补领总金额');
					return false;
				}
			});

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
				$('#cash,#officialCard,#transferAccounts').val('0.00');
				//显示收款方为个人的收款人是本人单选
				$("label.user-radio-label").show();
				//点击保存按钮操作方法
				$('#appendPaymentInfo').off().on('click', function() {
					//编辑方法
					serveFunds.raceAddList();
				}).text('保存');

			});
			//		});
			//关闭弹出框表单
			$("#model-canel-btn").click(function() {
				//调用关闭可编辑弹出框方法
				sysCommon.closeModel($("#cost-apply-model"));
				//调用公共用的清空表单数据方法
				serveFunds.clearAlert($(".model-content"));
				//清空其他数据
				$('.arrears-money').text(0.00);
				$('.pe-department,.pe-rank').text('');
				$('.personal-writeoff-money').text('0.00');
				$('#cash,#officialCard,#transferAccounts').val('0.00');
				serveFunds.setPayeeNameSelect();
				$('.receipt-alert .display-loan').hide();
				//隐藏收款人带出的部门和职级
				$(".display-rank").hide();
				$(".where-company").hide();
				$(".where-company").removeAttr("validform");
				$(".display-rank .valid-font").text("");
				$(".dis-r").hide();
				//隐藏收款人为本人单选
				$("label.user-radio-label").hide().removeClass("check");
				$("#userRadio").prop("checked",false);
			});
			//		TAB切换方法
			/*$(".receipt-alert .cost-type-tab li").click(function() {
				$(this).addClass("tab-check").siblings().removeClass("tab-check");
				var tabIndex = $(this).index();
				$(".receipt-alert .tab-info").hide().eq(tabIndex).show();
				$yt_alert_Model.getDivPosition($('#cost-apply-model'));
			});*/
		},
		/**
		 * 收款方添加数据方法
		 * @param {Object} tr
		 */
		raceAddList: function(tr) {
			var code = $('.receipt-alert ul li.tab-check').attr('code');
			var form = $('.receipt-alert .model-content[code="' + code + '"]');
			//调用验证表单方法
			var is = $yt_valid.validForm(form);

			if(is) {
				//获取对单位的输入框内的信息
				var companyName = form.find('#companyName').val();
				var witeOffCompany = form.find('#witeOffCompany option:selected').text();
				var witeOffCompanyCode = form.find('#witeOffCompany option:selected').val();
				var openBank = form.find('#openBank').val();
				var accountNumber = form.find('#accountNumber').val();
				var companyMoney = form.find('#companyMoney').val();
				var contractRadio = form.find('.check .contractRadio').val();
				var contractRadioText = '';
				if(contractRadio == 1) {
					contractRadioText = '有';
				} else {
					contractRadioText = '无';
				}
				var companySpecial = form.find('#companySpecial').val();
				companySpecial = companySpecial ? companySpecial : '无';
				//获取对个人输入框内的信息
				var payeeName = form.find('#payeeName option:selected').attr('username'); //收款人姓名
				var payeeVal = form.find('#payeeName option:selected').val(); //收款人code
				var peDepartment = form.find('.pe-department').text(); //收款人部门
				var peRank = form.find('.pe-rank').text(); //收款人职级
				//根据收款人所在单位字段的显示状态来判断是否获取外部人员姓名
				if(payeeVal == 'external' || !($('input.where-company').is(":hidden"))) {
					peRank = form.find('input.where-company').val();
					$(".display-rank").show();
					$(".pe-department").text("外部人员");
					$(".dis-r").hide();
					$(".where-company").show();
					$("input.where-company").attr("validform", "{isNull:true,blurFlag:true,msg:'请输入收款人所在单位'}");
					//收款人姓名取输入框里的值
					payeeName = $('#payeeName').next().find('.search-current').val();
					payeeName = payeeName == '请选择' ? '' : payeeName;
					payeeVal = 'external';
				} else {
					$(".display-rank").show();
					$(".where-company").hide();
					$(".where-company").removeAttr("validform");
					$(".display-rank .valid-font").text("");
					$(".dis-r").show();
				}
				//添加收款人姓名选中外部人员的情况下人员名称非空验证
				var verifyName = function() {
					if(payeeName) {
						return true;
						$('#payeeName').parent().find('.valid-font').text('');
					} else {
						$('#payeeName').parent().find('.valid-font').text('请填写外部人员名称');
						return false;
					}
				};
				var personalTotal = form.find('#personalTotal').val(); //个人应收总金额
				var witeOffPersonal = form.find("#witeOffPersonal option:selected").text(); //冲销方式
				var witeOffPersonalVal = form.find("#witeOffPersonal option:selected").val(); //冲销方式code
				var choiceLoan = form.find('#choiceLoan option:selected').text(); //借款单号
				var choiceLoanVal = form.find('#choiceLoan option:selected').val(); //借款单code
				var arrearsMoney = form.find('.arrears-money').text(); //借款单欠款金额 
				var theReverseMoney = form.find('.the-reverse-money').text(); //本次冲销金额
				var personalWriteoff = form.find('.personal-writeoff-money').text(); //个人冲销后补领总金额
				var cash = form.find('#cash').val(); //现金
				var officialCard = form.find('#officialCard').val() || '0.00'; //公务卡
				var transferAccounts = form.find('#transferAccounts').val() || '0.00'; //转账
				var payeeRadio = form.find('.check .payeeRadio').val() || '0.00'; //合同协议
				var payeeRadioText = '';
				if(payeeRadio == 1) {
					payeeRadioText = '有';
				} else {
					payeeRadioText = '无';
				}
				var personalSpecial = form.find('#personalSpecial').val();
				personalSpecial = personalSpecial ? personalSpecial : '无';
				var idCarkno = form.find('#idCarkno').val();
				var payeeBank = form.find('#payeeBank').val();
				var bankName = form.find('#bankName').val();
				var phoneNum = form.find('#phoneNum').val();
				var offOpenBank = form.find('#offOpenBank').val(); //offOpenBank 公务卡 - 开户银行
				var offAccounts = form.find('#offAccounts').val(); //offAccounts 公务卡 - 银行卡号
				//获取对其他输入框内的信息
				var otherMoney = form.find('#otherMoney').val();
				var witeOffOther = form.find('#witeOffOther option:selected').text();
				var witeOffOtherVal = form.find('#witeOffOther option:selected').val();
				var otherAllMoney = form.find('#otherAllMoney').val();
				var otherRadio = form.find('.check .otherRadio').val();
				var otherRadioText = '';
				if(otherRadio == 1) {
					otherRadioText = '有';
				} else {
					otherRadioText = '无';
				}
				var otherSpecial = form.find('#otherSpecial').val();
				otherSpecial = otherSpecial ? otherSpecial : '无';

				var trHtml = '';

				//三个金额合计必须等于个人冲销后补领总金额；弹窗“保存”按钮时校验；如果校验结果失败，显示提示信息：“收款方式金额合计必须等于个人冲销后补领总金额”，且校验失败时，不能保存数据
				var pamTotal = serveFunds.getPaymentTermTotal(); //付款方式合计金额
				var writeOffNum = serveFunds.rmoney(personalWriteoff); //个人冲销后补领总金额
				if(pamTotal == writeOffNum) {
					//获取列表中的已有金额 + 输入的金额
					var receMoney = serveFunds.getReceMsgMoney(tr) + serveFunds.rmoney(otherAllMoney) + serveFunds.rmoney(personalWriteoff) + serveFunds.rmoney(companyMoney);
					//付款总金额
					var sumMoney = serveFunds.rmoney($('#applyTotalMoney').text());
					//验证收款金额与付款总金额
					if(receMoney <= sumMoney) {
						switch(code) {
							case 'company':
								trHtml = '<tr  pkid="" class="payee-unit-tr" witeOffCompany="' + witeOffCompanyCode + '" companyName="' + companyName + '" openBank="' + openBank + '" accountNumber="' + accountNumber + '" companyMoney="' + companyMoney + '" contractRadio="' + contractRadio + '" companySpecial="' + companySpecial + '">' +
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
									//调用关闭可编辑弹出框方法
									serveFunds.clearAlterTable();
								} else {
									$('.rece-msg table[code="' + code + '"] tbody .payee-unit-total').before(trHtml);
									$yt_alert_Model.prompt('填写的信息已成功加入到列表');
								}
								//					获取合计
								serveFunds.companyTotal();
								break;
							case 'personal':
								if(verifyName()) {
									trHtml = '<tr class="payee-personal-tr" pkid="" payeeVal="' + payeeVal + '" payeeName="' + payeeName + '" peDepartment="' + peDepartment + '" peRank="' + peRank + '" personalTotal="' + personalTotal + '" witeOffPersonal="' + witeOffPersonalVal + '" personalWriteoff="' + personalWriteoff + '" cash="' + cash + '" officialCard="' + officialCard + '" transferAccounts="' + transferAccounts + '" payeeRadio="' + payeeRadio + '" personalSpecial="' + personalSpecial + '" idCarkno="' + idCarkno + '" payeeBank="' + payeeBank + '" bankName="' + bankName + '" phoneNum="' + phoneNum + '" choiceLoan="' + choiceLoan + '" choiceLoanVal="' + choiceLoanVal + '" arrearsMoney="' + arrearsMoney + '" theReverseMoney="' + theReverseMoney + '" offOpenBank="' + offOpenBank + '" offAccounts="' + offAccounts + '">' +
										'<td class="per" value="personal">' + payeeName + '</td>' +
										'<td style="text-align: right;" class="personalTotal">' + ($yt_baseElement.fmMoney(personalTotal)) + '</td>' +
										'<td>' + witeOffPersonal + '</td>' +
										'<td style="text-align: right;">' + theReverseMoney + '</td>' +
										'<td style="text-align: right;">' + personalWriteoff + '</td>' +
										'<td style="text-align: right;">' + cash + '</td>' +
										'<td style="text-align: right;">' + officialCard + '</td>' +
										'<td style="text-align: right;">' + transferAccounts + '</td>' +
										'<td><a class="yt-link to-data">详情</a></td>' +
										'<td>' + payeeRadioText + '</td>' +
										'<td>' + personalSpecial + '</td>' +
										'<td>' +
										'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>' +
										'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>' +
										'</td></tr>';
									if(tr) {
										tr.replaceWith(trHtml);
										//调用关闭可编辑弹出框方法
										serveFunds.clearAlterTable();
									} else {
										$('.rece-msg table[code="' + code + '"] tbody .payee-personal-total').before(trHtml);
										$yt_alert_Model.prompt('填写的信息已成功加入到列表');
									}
									//					获取合计
									serveFunds.personalTotal();
								}
								break;
							case 'other':
								trHtml = '<tr class="payee-other-tr"  pkid="" witeOffOther="' + witeOffOtherVal + '" otherMoney="' + otherMoney + '" otherAllMoney="' + otherAllMoney + '" otherRadio="' + otherRadio + '" otherSpecial="' + otherSpecial + '">' +
									'<td class="oth" value="Other">' + otherMoney + '</td>' +
									'<td>' + witeOffOther + '</td>' +
									'<td style="text-align: right;" class="otherTotal">' + ($yt_baseElement.fmMoney(otherAllMoney)) + '</td>' +
									'<td>' + otherRadioText + '</td>' +
									'<td>' + otherSpecial + '</td>' +
									'<td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
									'</tr>';
								if(tr) {
									tr.replaceWith(trHtml);
									//调用关闭可编辑弹出框方法
									serveFunds.clearAlterTable();
								} else {
									$('.rece-msg table[code="' + code + '"] tbody .payee-other-total').before(trHtml);
									$yt_alert_Model.prompt('填写的信息已成功加入到列表');
								}
								//					获取合计
								serveFunds.otherTotal();
								break;
							default:
								break;
						}
						//调用公共用的清空表单数据方法
						serveFunds.clearAlert($(".model-content"));
						//初始化人员列表
						serveFunds.setPayeeNameSelect();
						$yt_baseElement.tableRowActive();
						$('.receipt-alert .display-loan').hide();
						$('.pe-department,.pe-rank').text('');
						$('.personal-writeoff-money').text('0.00');
						$('#cash,#officialCard,#transferAccounts').val('0.00');
						//隐藏收款人带出的部门和职级信息
						$(".display-rank").hide();
						$(".where-company").hide();
						$(".where-company").removeAttr("validform");
						$(".display-rank .valid-font").text("");
						$(".dis-r").hide();
						//隐藏收款人为本人单选
						$("label.user-radio-label").hide().removeClass("check");
						$("#userRadio").prop("checked",false);

					} else {
						$yt_alert_Model.prompt('金额不能大于申请支出总金额');
					}
				} else {
					$yt_alert_Model.prompt('收款方式金额合计必须等于个人冲销后补领总金额');
				}

			}
		},
		alertReceivables: function() {
			$("#appendPaymentInfo").click(function() {
				serveFunds.raceAddList();
			});
		},
		/**
		 * 修改收款方为单位
		 */
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
				$('#witeOffCompany').val(tr.attr('witeOffCompany')).niceSelect();
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
				var companySpecial = tr.attr('companySpecial');
				$('#companySpecial').val(companySpecial == '无' ? '' : companySpecial);
				//弹窗方法
				//serveFunds.alertClearReceivables();
				$('#appendPaymentInfo').off().on('click', function() {
					//编辑方法
					serveFunds.raceAddList(tr);
				}).text('确定');
			})
		},
		/**
		 * 修改收款方为个人
		 */
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
				var payee = tr.attr('payeeVal');
				serveFunds.setPayeeNameSelect(payee);
				$('.pe-department').text(tr.attr('pedepartment')); //部门
				$('.pe-rank').text(tr.attr('perank')); //职级
				//外部人员
				if(payee == 'external') {
					$('input.where-company').val(tr.attr('perank'));
					$(".display-rank").show();
					$(".pe-department").text("外部人员");
					$(".dis-r").hide();
					$(".where-company").show();
					$("input.where-company").attr("validform", "{isNull:true,blurFlag:true,msg:'请输入收款人所在单位'}");
					//收款人姓名赋值为输入的值
					$('#payeeName').attr('validform', '{}').next().find('.search-current').val(tr.attr('payeeName'));
				} else {
					$(".display-rank").show();
					$(".where-company").hide();
					$(".where-company").removeAttr("validform");
					$(".display-rank .valid-font").text("");
					$(".dis-r").show();
					$('#payeeName').attr('validform', '{isNull:true,blurFlag:true,msg:\'请输入收款人姓名\'}');
				}
				//个人应收款总金额（元）
				$('#personalTotal').val(tr.attr('personalTotal'));
				//借款单
				var choiceLoan = tr.attr('choiceLoan');
				if(choiceLoan && choiceLoan != '请选择') {
					$('.receipt-alert .display-loan').show();
					//借款单存在显示并赋值对应数据
					serveFunds.getChoiceLoanList(tr.attr('choiceLoanVal'));
					//本次冲销金额
					$('.the-reverse-money').text(tr.attr('thereversemoney'));
				} else {
					//否则隐藏数据
					$('.receipt-alert .display-loan').hide();
					$('#choiceLoan').val('').niceSelect();
					//借款单欠款金额
					$('.arrears-money').text('0.00');
					//本次冲销金额
					$('.the-reverse-money').text('0.00');
				}
				//冲销方式
				$('#witeOffPersonal').val(tr.attr('witeOffPersonal')).niceSelect();
				//个人冲销后补领金额（元）
				$('.personal-writeoff-money').text(tr.attr('personalwriteoff'));
				//收款方式：现金（元
				$('#cash').val(tr.attr('cash') || '0.00');
				//收款方式：公务卡（元）
				$('#officialCard').val(tr.attr('officialCard') || '0.00');
				//收款方式：转账（元）
				$('#transferAccounts').val(tr.attr('transferAccounts') || '0.00');
				//身份证号码
				$('#idCarkno').val(tr.attr('idCarkno'));
				//银行卡号
				$('#payeeBank').val(tr.attr('payeeBank'));
				//开户银行名称
				$('#bankName').val(tr.attr('bankName'));
				//移动电话
				$('#phoneNum').val(tr.attr('phoneNum'));
				//offOpenBank 公务卡 - 开户银行
				$('#offOpenBank').val(tr.attr('offOpenBank'));
				//offAccounts 公务卡 - 银行卡号
				$('#offAccounts').val(tr.attr('offAccounts'));
				//有无合同协议
				var payeeRadio = tr.attr('payeeRadio');
				$('.personalCheck .check-label input[value="' + payeeRadio + '"]').setRadioState('check');
				//特殊说明
				var personalSpecial = tr.attr('personalSpecial');
				$('#personalSpecial').val(personalSpecial == '无' ? '' : personalSpecial);
				//弹窗方法
				//serveFunds.alertClearReceivables();
				$('#appendPaymentInfo').off().on('click', function() {
					//编辑方法
					serveFunds.raceAddList(tr);
				});
			})
		},
		/**
		 * 修改收款方为其他
		 */
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
				$('#witeOffOther').val(tr.attr('witeOffOther')).niceSelect();
				//金额
				$('#otherAllMoney').val(tr.attr('otherAllMoney'));
				//有无合同协议
				var otherRadio = tr.attr('otherRadio');
				$('.otherCheck .check-label input[value="' + otherRadio + '"]').setRadioState('check');
				//特殊说明
				var otherSpecial = tr.attr('otherSpecial');
				$('#otherSpecial').val(otherSpecial == '无' ? '' : otherSpecial);
				//弹窗方法
				//serveFunds.alertClearReceivables();
				$('#appendPaymentInfo').off().on('click', function() {
					//编辑方法
					serveFunds.raceAddList(tr);
				}).text('确定');
			})
		},
		clearAlterTable: function() {
			//关闭弹出框表单
			//调用关闭可编辑弹出框方法
			sysCommon.closeModel($("#cost-apply-model"));
			//调用公共用的清空表单数据方法
			serveFunds.clearAlert($(".model-content"));
			serveFunds.setPayeeNameSelect();
		},
		/**
		 * 获取收款方的现有金额
		 */
		getReceMsgMoney: function(tr) {
			var total = 0;
			//收款单位金额
			var unit = 0;
			$('table.payee-unit tbody tr:not(.payee-unit-total)').not(tr).each(function() {
				unit += serveFunds.rmoney($(this).find('.unitTotal').text());
			});
			//收款个人金额
			var us = 0;
			$('table.payee-personal tbody tr:not(.payee-personal-total)').not(tr).each(function() {
				other += serveFunds.rmoney($(this).find('.personalTotal').text());
			});
			//收款其他金额
			var other = 0;
			$('table.payee-other tbody tr:not(.payee-other-total)').not(tr).each(function() {
				other += serveFunds.rmoney($(this).find('.otherTotal').text());
			});
			total = unit + us + other;
			return total;
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
			var tds = $('.payee-personal tbody tr:not(.payee-personal-total)');
			var total = 0;
			//计算合计金额
			$.each(tds, function(i, n) {
				total += $yt_baseElement.rmoney($(n).find('.personalTotal').text());
			});
			var fmTotal = $yt_baseElement.fmMoney(total);
			//赋值合计金额
			$yt_baseElement.fmMoney($('.payee-personal tbody .payee-personal-money').text(fmTotal));
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
		 * 清除导入的事前申请单数据
		 */
		clearPriorApproval: function() {
			//获取费用类型
			var costType = $('.docu-style-box input:checked').val();
			//先删除列表中导入的数据
			$('#indexMainDiv table tr.exports').remove();
			switch(costType) {
				case 'PERSONNEL_APPLY': //通用支出

					break;
				case 'TRAVEL_APPLY': //差旅费支出
					//重新计算列表的合计
					travelSpending.updateMoneySum(0);
					travelSpending.updateMoneySum(1);
					travelSpending.updateMoneySum(2);
					//设置补助合计金额
					travelSpending.setSubsidyTotal();
					//计算总金额
					travelSpending.updateMoneySum();
					break;
				case 'TRAIN_APPLY': //培训费支出
					$('#meetingClassification.exports option:first-child').attr('selected', 'selected');
					$('#meetingClassification.exports').removeClass('exports').niceSelect();
					$('#regionDesignation.exports,#regionName.exports,#startTimeTop.exports,#endTimeTop.exports,#calculationSession.exports,#trainOfNum.exports,#workerNum.exports').val('').removeClass('exports');

					var lectureSum = 0;
					$("#lectureFeeTable tbody tr:not(.end-tr)").each(function() {
						var thisObj = $(this);
						lectureSum += $yt_baseElement.rmoney(thisObj.find(".sum-pay").text());
					});
					$("#lectureFeeTable .costTotal").text($yt_baseElement.fmMoney(lectureSum));
					var hotelSum = 0;
					$("#hotelFeeTable tbody tr:not(.end-tr)").each(function() {
						var thisObj = $(this);
						hotelSum += $yt_baseElement.rmoney(thisObj.find(".sum-pay").text());
					});
					$("#hotelFeeTable .costTotal").text($yt_baseElement.fmMoney(hotelSum));
					var dietSum = 0;
					$("#dietFeeTable tbody tr:not(.end-tr)").each(function() {
						var thisObj = $(this);
						dietSum += $yt_baseElement.rmoney(thisObj.find(".sum-pay").text());
					});
					$("#dietFeeTable .costTotal").text($yt_baseElement.fmMoney(dietSum));
					var carSum = 0;
					$("#carFeeTable tbody tr:not(.end-tr)").each(function() {
						var thisObj = $(this);
						carSum += $yt_baseElement.rmoney(thisObj.find(".sum-pay").text());
					});
					$("#carFeeTable .costTotal").text($yt_baseElement.fmMoney(carSum));
					var totalAmount = 0;
					$('#trainingFeeTable tbody .smallplan-money').each(function() {
						totalAmount += $yt_baseElement.rmoney($(this).text());
					});
					$('#trainingFeeTable tbody .costTotal').text($yt_baseElement.fmMoney(totalAmount));

					//重新计算合计
					personnelFunds.updateTotalNum();
					break;
				case 'MEETING_APPLY': //会议费支出
					$('#meetingClassification.exports option:first-child').attr('selected', 'selected');
					$('#meetingClassification.exports').removeClass('exports').niceSelect();
					$('#meetName.exports,#meetAddress.exports,#startTime.exports,#endTime.exports,#calculationSession.exports,#meetOfNum.exports,#meetWorkerNum.exports,#meetHotel.exports,#meetFood.exports,#dailyAverageConsumption.exports').val('').removeClass('exports');
					$('#costTotal').text('住宿费+伙食费+其他费用').css('color', '#999').removeClass('exports');
					$('#dailyAverageConsumption').text('费用合计/【(参会人数+工作人员数量）*会期】').css('color', '#999').removeClass('exports');
					var accommodation = $yt_baseElement.rmoney($(".get-accommodation").val() || '0');
					var food = $yt_baseElement.rmoney($(".get-food").val() || '0');
					var other = $yt_baseElement.rmoney($(".get-other").val() || '0');
					var total = accommodation + food + other;
					$(".count-val-num").css("color", "#333333").text($yt_baseElement.fmMoney(total));
					if(total !== 0) {
						//大写转化
						//$('.total-money-up,#TotalMoneyUpper').text(arabiaToChinese(total));
					}
					break;
				case 'BH_APPLY': //公务接待费支出
					var payTotal = 0;
					$('#paymentList tbody tr:not(.last)').each(function() {
						payTotal += serveFunds.rmoney($(this).find('.money').text());
					});
					$('#paymentList tbody tr.last .total-money').text(serveFunds.fmMoney(payTotal));
					hospitalitySpending.getTotleMoney();
					break;
				default:
					break;
			}
		},
		/**
		 * 获取培训类别下拉数据
		 * @param {Object} code
		 */
		getTrainingTypeOption: function(code) {
			$.ajax({
				type: "post",
				url: "basicconfig/dictInfo/getDictInfoByTypeCode",
				async: false,
				data: {
					dictTypeCode: 'TRAIN_TYPE'
				},
				success: function(data) {
					//获取数据list
					var list = data.data || [];
					//初始化HTML文本
					var start = '<option value="">请选择</option>',
						optone = start,
						opttwo = start,
						travelType = start,
						vehicle = start;
					//循环添加文本
					$.each(list, function(i, n) {
						//培训类型
						travelType += '<option ' + (code == n.value ? 'selected="selected"' : '') + ' value="' + n.value + '">' + n.disvalue + '</option>';
					});
					//培训类型
					$('#meetingClassification').html(travelType).niceSelect();
				}
			});
		},
		/**
		 * 会议费类型code
		 * @param {Object} code
		 */
		getMeetingTypeCode: function(code) {
			$.ajax({
				type: "post",
				url: "basicconfig/dictInfo/getDictInfoByTypeCode",
				async: true,
				data: {
					dictTypeCode: 'MEET_CODE'
				},
				success: function(data) {
					//获取数据list
					var list = data.data || [];
					//初始化HTML文本
					var start = '<option value="">请选择</option>';
					//循环添加文本
					$.each(list, function(i, n) {
						start += '<option ' + (code == n.value ? 'selected="selected"' : '') + ' value="' + n.value + '">' + n.disvalue + '</option>';
					});
					//替换页面代码
					$('#meetingClassification').html(start).niceSelect();
				}
			});
		},
		getPayeeNameList: function(code) {
			$.ajax({
				type: "post",
				url: "user/userInfo/getAllUserInfoToPage",
				async: true,
				data: {
					params: '',
					pageIndex: 1,
					pageNum: 99999 //每页显示条数  
				},
				success: function(data) {
					//获取数据list
					var list = data.data.rows || [];
					//初始化HTML文本
					var opts = '<option value="">请选择</option>';
					//循环添加文本
					$.each(list, function(i, n) {
						if(code && code == n.userItcode) {
							opts += '<option selected="selected" userName="' + n.userName + '" jobLevelName="' + n.jobLevelName + '" deptName="' + n.deptName + '" value="' + n.userItcode + '">' + n.userName + '/' + n.deptName + '/' + n.jobName + '</option>';
						} else {
							opts += '<option userName="' + n.userName + '" jobLevelName="' + n.jobLevelName + '" deptName="' + n.deptName + '" value="' + n.userItcode + '">' + n.userName + '/' + n.deptName + '/' + n.jobName + '</option>';
						}
					});
					//替换页面代码
					$('#payeeName').html(opts);
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
									$("select#payeeName").append('<option userName="' + n.userName + '" jobLevelName="' + n.jobLevelName + '" deptName="' + n.deptName + '" value="' + n.userItcode + '">' + n.userName + '/' + n.deptName + '/' + n.jobName + '</option>');
								}
							});
						},
						optionCallBcak: function(opt) {
							console.log(opt);
						}
					});
				}
			});
		},
		/**
		 * 验证提交费用时的必填列表数据
		 */
		verifySubmitTableLenght: function() {
			var costType = $('.docu-style-box .check input').val();
			var verify = true;
			if(costType == 'TRAVEL_APPLY') {
				//差旅
				if($('#tripList tbody tr').length <= 0) {
					$yt_alert_Model.prompt('行程详情不能为空');
					verify = false;
				}
			} else if(costType == 'BH_APPLY') {
				//公务接待费
				if($('table.msg-list tbody tr').length <= 0) {
					$yt_alert_Model.prompt('接待对象信息列表不能为空');
					verify = false;
				}
			}

			return verify;
		}
	};

	$(function() {
		serveFunds.init();
		//调用风险验证方法
		validRiskInfoEvent();
	});
	/**
	 * 
	 * 风险验证方法事件
	 * 
	 */
	function validRiskInfoEvent() {
		//点击验证风险按钮
		$("button.valid-risk-btn").click(function() {
			//获取页面code
			var appSceneCode = $("body div").attr("riskPageCode");
			//验证风险json串
			var valiRiskJson = "";
			var valiRiskList = [];
			var validRiskObj = {};
			//列表数据存储集合
			var trValiFieldList = [];
			//列表数据存储对象
			var trValiFieldObj = {};
			//显示风险字段的风险信息
			var riskDataInfo = "";
			//风险验证字段code
			var valiFieldCode = "";
			//风险验证值
			var valiFieldValue = "";
			//风险验证字段code 
			var valiFieldCodeTwo = "";
			//风险验证值
			var valiFieldValueTwo = "";
			var tag = null;
			//获取页面中的风险code
			$("body input.hid-risk-code").each(function(i, n) {
				//得到风险字段的风险信息
				riskDataInfo = $(n).data("riskData");
				var valiFieldList = [];
				var valiFieldObj = {};
				//标签类型
				var lableType = "";
				//判断当前风险字段,验证风险数据是否有值
				if(riskDataInfo && riskDataInfo.valiFieldList != undefined && riskDataInfo.valiFieldList != "" && riskDataInfo.valiFieldList.length) {
					//目前判断两种取值方式一种表单,一种列表取值
					if(riskDataInfo.proofRule == "LIST") {
						//先找到对应的表格
						var tabObj = $('table[risk-code-val="' + riskDataInfo.hintFieldCode + '"]');
						// tabObj = $(tabObj).tagName;
						//遍历表格数据
						$(tabObj).find("tbody tr:not(.total-last-tr)").each(function(trIndex, t) {
							//遍历行之前,将行数据集合先清空
							trValiFieldList = [];
							//遍历当前风险字段的验证字段集合
							$.each(riskDataInfo.valiFieldList, function(i, r) {
								//每次循环获取字段数据,先清空字段对象
								trValiFieldObj = {};
								//每次循环清空标签类型
								lableType = "";
								//比对是否存在表格数据与验证字段,先比对找第一个验证字段
								tag = $(t).find('[risk-code-val="' + r.valiFieldCode + '"]');
								if(tag && tag != undefined) {
									//获取当前字段标签名称
									lableType = $(tag)[0].tagName;
									//判断如果是输入框,下拉列表,文本域获取值用val
									if(lableType == "SELECT" || lableType == "INPUT" || lableType == "TEXTAREA") {
										//风险验证值
										valiFieldValue = $(tag).val();
									} else {
										//风险验证值
										//判断是不是日期字段
										if($(tag).attr("risk-code-val").indexOf("Date") > -1) {
											//转为日期格式,获取月份
											var timeNew = new Date($(tag).text().replace(/-/g, "/"));
											var monthVal = parseInt(timeNew.getMonth() + 1);
											// alert("日期是:"+$(tag).text());
											//alert("月份是:"+parseInt(timeNew.getMonth()+1));
											valiFieldValue = monthVal;
										} else {
											valiFieldValue = $(tag).text();
										}
									}
									//风险验证字段code
									valiFieldCode = $(tag).attr("risk-code-val");
								}
								//判断第二个验证字段的code是否为空
								if(r.valiFieldCodeTwo != undefined && r.valiFieldCodeTwo != "" && r.valiFieldCodeTwo != null) {
									tag = $(t).find('[risk-code-val="' + r.valiFieldCodeTwo + '"]');
									if(tag && tag != undefined) {
										//获取到标签名称
										lableType = $(tag)[0].tagName;
										//判断如果是输入框,下拉列表,文本域获取值用val
										if(lableType == "SELECT" || lableType == "INPUT" || lableType == "TEXTAREA") {
											//风险验证值
											valiFieldValueTwo = $(tag).val();
										} else {
											//风险验证值
											//判断是不是日期字段
											if($(tag).attr("risk-code-val").indexOf("Date") > -1) {
												//转为日期格式,获取月份
												var timeNew = new Date($(tag).text().replace(/-/g, "/"));
												var monthVal = parseInt(timeNew.getMonth() + 1);
												valiFieldValueTwo = monthVal;
											} else {
												valiFieldValueTwo = $(tag).text();
											}
										}
										//获取第二个验证字段的风险code
										valiFieldCodeTwo = $(tag).attr("risk-code-val");
									}
								}
								//拼接列表数据对象信息
								trValiFieldObj = {
									valiFieldCode: valiFieldCode, //第一个验证字段风险code
									valiFieldValue: valiFieldValue, //第二个风险验证字段值
									valiFieldCodeTwo: valiFieldCodeTwo, //第二个验证字段风险code
									valiFieldValueTwo: valiFieldValueTwo //第二个验证字段值
								};
								//存储到列表数据集合中
								trValiFieldList.push(trValiFieldObj);
							});
							//存储对象
							valiFieldObj = {
								trNum: trIndex, //行索引
								valiFieldList: trValiFieldList //行数据集合
							}
							//存储到整体的集合中
							valiFieldList.push(valiFieldObj);
						});
					} else {
						//遍历当前风险数据对象的验证字段集合
						$.each(riskDataInfo.valiFieldList, function(i, v) {
							//得到第一个验证字段对应的风险字段
							var thisTag = $('[risk-code-val="' + v.valiFieldCode + '"]');
							if(thisTag && thisTag != undefined) {
								//获取当前字段标签名称
								lableType = $(thisTag)[0].tagName;
								//判断如果是输入框,下拉列表,文本域获取值用val
								if(lableType == "SELECT" || lableType == "INPUT" || lableType == "TEXTAREA") {
									//风险验证值
									valiFieldValue = $(thisTag).val();
								} else {
									//风险验证值
									valiFieldValue = $(thisTag).text();
								}
								//风险验证字段code
								valiFieldCode = $(thisTag).attr("risk-code-val");
							}
							//判断第二个验证字段code值是否为空
							if(v.valiFieldCodeTwo != "" && v.valiFieldCodeTwo != undefined && v.valiFieldCodeTwo != null) {
								//得到验证对象
								thisTag = $('[risk-code-val="' + v.valiFieldCodeTwo + '"]');
								//获取当前字段标签名称
								lableType = $(thisTag)[0].tagName;
								//判断如果是输入框,下拉列表,文本域获取值用val
								if(lableType == "SELECT" || lableType == "INPUT" || lableType == "TEXTAREA") {
									//风险验证值
									valiFieldValueTwo = $(thisTag).val();
								} else {
									//风险验证值
									valiFieldValueTwo = $(thisTag).text();
								}
								//风险验证字段code
								valiFieldCodeTwo = $(thisTag).attr("risk-code-val");
							}
							//拼接对象信息
							valiFieldObj = {
								valiFieldCode: valiFieldCode, //第一个验证字段风险code
								valiFieldValue: valiFieldValue, //第二个风险验证字段值
								valiFieldCodeTwo: valiFieldCodeTwo, //第二个验证字段风险code
								valiFieldValueTwo: valiFieldValueTwo //第二个验证字段值
							};
							//存储到集合中
							valiFieldList.push(valiFieldObj);
						});
					}
					validRiskObj = {
						hintFieldCode: riskDataInfo.hintFieldCode, //风险提示灯code
						valiFieldList: valiFieldList //风险验证字段集合
					};
					valiRiskList.push(validRiskObj);
				}
			});
			//判断集合是否为空,转成json格式数据
			if(valiRiskList.length > 0 && valiRiskList != null) {
				valiRiskJson = JSON.stringify(valiRiskList);
			}
			$.ajax({
				type: "post",
				url: "basicconfig/risk/valiRiskPageField",
				async: false,
				data: {
					appSceneCode: appSceneCode,
					valiRiskJson: valiRiskJson
				},
				success: function(data) {
					if(data.flag == 0) {
						if(data.data.length > 0) {
							$.each(data.data, function(i, n) {
								//找到对应的风险字段
								var riskFontLabel = $('body input.hid-risk-code[value="' + n.hintFieldCode + '"]');
								//判断对象是否存在
								if(riskFontLabel && riskFontLabel != undefined && riskFontLabel != "") {
									//1.通过2.未通过
									if(n.valiFalg == "1") {
										$(riskFontLabel).next("img.risk-img").attr("src", sysCommon.riskViaImg);
									} else {
										$(riskFontLabel).next("img.risk-img").attr("src", sysCommon.riskWarImg);
										//未通过情况,遍历验证字段集合
										$.each(n.valiFieldList, function(i, v) {
											//判断列表行数字段是否为空
											if(v.trNum != undefined && v.trNum != null) {
												var tabObj = $('table[risk-code-val="' + n.hintFieldCode + '"]');
												//判断验证是否通过1.通过2.未通过
												if(v.valiFalg == "2") {
													//找到当前表格下的相对应的行字体改为红色
													$(tabObj).find('tbody tr:eq("' + v.trNum + '") td').css("color", "red");
												}
											}
										});
									}
								}
							});
						}
						$yt_alert_Model.prompt("验证成功!");
						//滚动条显示滚动位置
						var scrollTopVal = 0;
						//找到页面中第一个显示风险灯的位置
						var spanObj = $("body span.risk-model:visible:eq(0)");
						if($(window).scrollTop() && ($(spanObj).offset().top < $(window).scrollTop() || $(spanObj).offset().top > $(window).height())) {
							scrollTopVal = $(spanObj).offset().top - 50;
							$(window).scrollTop(scrollTopVal);
						}
					} else {
						$yt_alert_Model.prompt("验证失败!");

					}
				}
			});
		});
	}
})(jQuery, window);