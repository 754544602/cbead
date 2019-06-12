var loanApply = {
	loanId: "", //全局的借款单Id
	riskExcMark: "../../../../../resources-sasac/images/common/war-red.png", //风险感叹号图片
	riskWarImg: "../../../../../resources-sasac/images/common/risk-war.png", //风险未通过图片红灯
	riskViaImg: "../../../../../resources-sasac/images/common/risk-via.png", //风险通过图片绿灯
	init: function() {
		//获取页面跳转传输的参数对象
		var requerParameter = $yt_common.GetRequest();
		//获取传输的项目ID
		loanApply.loanId = requerParameter.loanId;
		//获取当前登录用户信息
		sysCommon.getLoginUserInfo();
		//初始化下拉列表
		$("#loanApply select").niceSelect();
		//调用初始化获取功能数据的方法
		loanApply.getInitFunDatas();
		//初始化日期控件
		$("#returnDate").calendar({
			speed: 0, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			lowerLimit: "2010/01/01", // 日期下限，默认：NaN(不限制)     
			nowData: false, //默认选中当前时间,默认true 
			speed: 0,
			dateFmt: "yyyy-MM-dd",
			callback: function() { // 点击选择日期后的回调函数  
				$("#returnDate").parent().find(".risk-img").attr("src", loanApply.riskViaImg);
				//清空验证提示信息
				sysCommon.clearValidInfo($("#returnDate"));
			}
		});
		//借款金额操作事件
		loanApply.loanMoneyEvent();
		//调用功能按钮操作事件方法
		loanApply.funOperationEvent(loanApply.eaa);
		//给当前页面设置最小高度
		$("#loanApply").css("min-height", $(window).height() - 32);
		//金额input计算
		loanApply.events();
		//调用格式化金额方法
		loanApply.fmMonList();
		//判断借款ID是否为空
		if(loanApply.loanId != "" && loanApply.loanId != null) {
			//调用获取借款单详情方法
			loanApply.getLoanDetailById();
		};
		//调用获取当前登录人未结清账单
		loanApply.getCurrentUserIsSettleInfo();
		//获取数据字典
		loanApply.getDictInfoByTypeCode();
		//收款方弹框事件处理
		loanApply.alertClearReceivables();
		//获取人员信息
		loanApply.getBusiTripUsersList('');
		//点击下拉框显示
		loanApply.getArrearsAmount();
		//获取单位数据
		loanApply.getAllPaymentReceivablesUnitList($("#companyPram").val());
		//给收款方为个人弹出框表单中的本人单选赋值当前登录人code
		$("#userRadio").val($yt_common.user_info.userName);
		//本人单选事件
		$(".user-radio-label").change(function() {
			var userCode = $(this).find("input").val();
			//比对收款人下拉列表找到当前登录人并选中
			$('#payeeName option[value="' + userCode + '"]').prop("selected", "selected");
			//$("select#payeeName").niceSelect();
			loanApply.setPayeeNameSelect(userCode);
			//读取部门职级
			var jobLevelName = $('#payeeName option[value="' + userCode + '"]').attr("jobLevelName");
			var deptName = $('#payeeName option[value="' + userCode + '"]').attr("deptName");
			$(".pe-department").text(deptName);
			$(".pe-rank").text(jobLevelName == "" ? "--" : jobLevelName);
			$(".display-rank,.dis-r").show();
			//清空收款人为单位的验证信息
			$("input.where-company").removeAttr("validform");
			if(userCode == $("#userRadio").val()) {
				loanApply.getPaymentReceivablesPersonalByUserCode(userCode, '');
			}
			setTimeout(function() {
				//隐藏当前单选
				$("label.user-radio-label").hide().removeClass("check");
				$("label.user-radio-label input").prop("checked", false);
			}, 200);
		});
	},
	//获取当前登录人未结清账单
	getCurrentUserIsSettleInfo: function() {
		$.ajax({
			type: "post",
			url: "sz/loanApp/getCurrentUserIsSettleInfo",
			async: false,
			data: {},
			success: function(data) {
				if(data.flag == 0) {
					//是否有未结清的借款单
					$("#noCloseOut").text(data.data.noCloseOut);
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
			}
		});
	},
	//金额格式化
	fmMoney: function(str) {
		return $yt_baseElement.fmMoney(str || '0');
	},
	rmoney: function(str) {
		return $yt_baseElement.rmoney(str || '0');
	},
	getAllPaymentReceivablesUnitList: function(keyword) {
		$.ajax({
			type: "post",
			url: 'sz/expenditureApp/getAllPaymentReceivablesUnit',
			async: true,
			data: {
				unitName: keyword
			},
			success: function(data) {
				loanApply.payeeCompanyList = data.data.paymentReceivablesUnitList;
			}
		});
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
		var me = this;
		//金额文本框获取焦点事件 
		$('.refund-tab-inp,.money-input').on('focus', function() {
			var ts = $(this);
			if(ts.val() != "") {
				//调用还原格式化的方法  
				ts.val($yt_baseElement.rmoney(ts.val()));
			}
		});
		//金额文本框失去焦点事件 
		$('.refund-tab-inp,.money-input').on('blur', function() {
			var ts = $(this);
			if(ts.val() != '') {
				//调用格式化金额方法  
				ts.val($yt_baseElement.fmMoney(ts.val()));
			}
		});
		//金额文本框输入事件 
		$('.refund-tab-inp,.money-input').on('keyup', function() {
			var ts = $(this);
			if(ts.val() != '') {
				//调用格式化金额方法  
				ts.val(ts.val().replace(/[^\d.]/g, ''));
			}
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
		//页面取消按钮事件
		$("#cancelBtn").off().on('click', function() {
			window.history.back(-1);
		});
		//现金 公务卡  转账获取焦点时触发事件
		$('#cash,#officialCard,#transferAccounts').on('focus', function() {
			if($(this).val() == '0') {
				$(this).val('');
			}
		});
		//TAB切换方法
		$(".receipt-alert .cost-type-tab li").click(function() {
			//调用公共用的清空表单数据方法
			loanApply.clearAlert($(".model-content"));
			//显示收款方为个人的收款人是本人单选
			$("label.user-radio-label").show();
			//隐藏为个人的部门职位单位
			$(".display-rank").hide();
			$('#cash,#officialCard,#transferAccounts').val('0.00');
			//情况其他数据
			$('.arrears-money').text(0.00);
			$('.pe-department,.pe-rank').text('');
			$('.receipt-alert .display-loan').hide();
			loanApply.setPayeeNameSelect();
			$(this).addClass("tab-check").siblings().removeClass("tab-check");
			var tabIndex = $(this).index();
			$(".receipt-alert .tab-info").hide().eq(tabIndex).show();
			$yt_alert_Model.getDivPosition($('#cost-apply-model'));
		});
		//收款方单位change事件
		$("#companyName").on("keyup", function() {
			//清空
			$("#companyNameList ul").empty();
			$("#openBank").val('');
			$("#accountNumber").val('');
			var companyName = $("#companyName");
			//输入模糊查询存储文字
			var text = '';
			var html = '';
			text = companyName.val();
			//收款单位去重
			var arr = loanApply.payeeCompanyList;
			var map = {},
				dest = [];
			for(var i = 0; i < arr.length; i++) {
				var ai = arr[i];
				if(!map[ai.unitName]) {
					dest.push({
						unitName: ai.unitName,
						openBank: ai.openBank,
						accounts: ai.accounts
					});
					map[ai.unitName] = ai;
				} else {
					for(var j = 0; j < dest.length; j++) {
						var dj = dest[j];
						if(dj.unitName == ai.unitName) {
							break;
						}
					}
				}
			};
			$.each(dest, function(i, n) {
				if(n.unitName.indexOf(text) != -1) {
					html += '<li unitName="' + n.unitName + '" openBank="' + n.openBank + '" accounts="' + n.accounts + '">' + n.unitName + '</li>';
				}
			});
			$("#companyNameList ul").append(html);
			$("#companyNameList").show();
			$("#companyNameList ul li").off().on("click", function() {
				var companyName = $(this).text();
				var openBank = $(this).attr('openBank');
				var accounts = $(this).attr('accounts')
				$("#companyName").val(companyName).attr({
					'openBank': openBank,
					'accounts': accounts
				});
				$("#openBank").val(openBank);
				$("#accountNumber").val(accounts);
				//隐藏提示框
				$("#companyNameList").hide();
			})
		});
		//收款方为单位
		me.updataPersonal();
		//收款方为个人
		me.updataReceivables()
		//收款方为其他
		me.updataOther();
	},
	/**
	 * 根据人员信息获取最新开户相关信息
	 * @param {Object} code
	 */
	getPaymentReceivablesPersonalByUserCode: function(userCode, username) {
		$.ajax({
			type: "post",
			url: "sz/loanApp/getPaymentReceivablesPersonalByUserCode",
			async: true,
			data: {
				userCode: userCode, //userCode 人员code
				username: username
			},
			success: function(data) {
				if(data.data != null) {
					$("#bankName").val(data.data.openBank);
					$("#payeeBank").val(data.data.accounts);
					$("#offOpenBank").val(data.data.offOpenBank);
					$("#offAccounts").val(data.data.offAccounts);
					$("#idCarkno").val(data.data.idCarkno);
					$("#phoneNum").val(data.data.phoneNum);
					$("#personalUnit").val(data.data.personalUnit);
				} else {
					$("#bankName").val('');
					$("#payeeBank").val('');
					$("#offOpenBank").val('');
					$("#offAccounts").val('');
					$("#idCarkno").val('');
					$("#phoneNum").val('');
					$("#personalUnit").val('');
				}
			}
		});
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
					opts += '<option ' + (code == n.loanAppId ? 'selected="selected"' : '') + ' arrearsAmount="' + n.arrearsAmount + '" value="' + n.loanAppId + '">' + n.loanAppNum + '</option>';
					if(code == n.loanAppId) {
						//借款单欠款金额
						$('.arrears-money').text(loanApply.fmMoney(n.arrearsAmount));
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
			loanApply.calculatePaymentAlertPerson();
		});

		$("#choiceLoan").change(function() {
			//计算金额
			loanApply.calculatePaymentAlertPerson();
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
			$("#userRadio").prop("checked", false);
			//根据人员信息获取最新开户相关信息
			var userCode = $('#payeeName option:selected').val();
			var isChange = $("#payeeName").find("option:selected").val();
			var username = $('#payeeName').next().find(".search-current").val();
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
			loanApply.getChoiceLoanList();

			loanApply.getPaymentReceivablesPersonalByUserCode(userCode, username);
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

		//付款列表删除
		$('.rece-msg').on('click', '.operate-del', function() {
			var ithis = $(this);
			var tr = ithis.parents('tr');
			$yt_alert_Model.alertOne({
				alertMsg: "数据删除将无法恢复,确认删除吗?", //提示信息  
				confirmFunction: function() { //点击确定按钮执行方法  
					tr.remove();
					//计算总额
					loanApply.companyTotal();
					loanApply.personalTotal();
					loanApply.otherTotal();
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
		$('.personal-writeoff-money').text(loanApply.fmMoney(writeTotal));

	},
	/**
	 * 
	 * 
	 * 根据借款单Id获取借款单详细信息
	 * 
	 * 
	 */
	getLoanDetailById: function() {
		var me = this;
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
					// console.log(dataObj);
					if(dataObj && dataObj != "" && dataObj != undefined) {
						//申请人
						$("#busiUsers").text(dataObj.applicantUserName);
						//部门
						$("#deptName").text(dataObj.applicantUserDeptName);
						//职务
						$("#jobName").text(dataObj.applicantUserPositionName == "" ? "--" : dataObj.applicantUserPositionName);
						//电话
						$("#telPhone").text(dataObj.applicantUserPhone == "" ? "--" : dataObj.applicantUserPhone);
						//给表单赋值
						$("#loanApply").setDatas(dataObj);
						//金额大写
						$("#moneyLower").text(arabiaToChinese(dataObj.loanAmount + ''));
						//借款期限
						$("#lifeOfLoan option").each(function() {
							if($(this).text() == dataObj.loanTerm) {
								$(this).attr("selected", true);
							}
						});
						//初始化借款期限下拉列表
						$("#lifeOfLoan").niceSelect();
						//设置借款方式选中
						//							$('.pay-met input.radio-inpu[value="'+dataObj.paymentMethod+'"]').setRadioState("check");
						//判断是否有未清账账单
						if(dataObj.isSettleInfo) {
							//显示未清账账单编号区域
							$("#loanAppNumStr").text(dataObj.isSettleInfo.loanAppNumStr || '--');
							$("#noCloseOut").text(dataObj.isSettleInfo.noCloseOut);
						}
						me.setHeringUnitList(dataObj.payReceivablesData.gatheringUnitList);
						me.setHeringPersonList(dataObj.payReceivablesData.gatheringPersonList);
						me.setHeringOtherList(dataObj.payReceivablesData.gatheringOtherList);
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
	/**
	 * 
	 * 
	 * 获取初始下拉列表,弹出框表格数据
	 * 
	 */
	getInitFunDatas: function() {
		/**
		 * 
		 * 出差类型:TRAVEL_TYPE
		 * 交通工具:VEHICIE_CODE
		 * 住宿地点:HOTEL_ADDRESS
		 * 费用类型:COST_TYPE
		 * 资金性质:AMOUNT_NATURE
		 * 
		 */
		$.ajax({
			type: "post",
			url: "basicconfig/dictInfo/getDictInfoByTypeCode",
			async: false,
			data: {
				dictTypeCode: "AMOUNT_NATURE"
			},
			success: function(data) {
				if(data.flag == 0) {
					var optionText = '<option value="">请选择</option>';
					if(data.data.length > 0) {
						$.each(data.data, function(i, n) {
							/**
							 * 
							 * 资金性质获取数据
							 * 
							 */
							if(n.dictTypeCode == "AMOUNT_NATURE") {
								optionText = '<option value="' + n.value + '">' + n.disvalue + '</option>';
								$("#moneyQuality").append(optionText);
								$("#moneyQuality").niceSelect();
								//资金性质选择事件
								$("#moneyQuality").on("change", function() {
									//调用获取所属项目列表方法
									loanApply.getProjectInfoList($("#prjKeyWord").val(), $(this).val());
								});
							}
						});
						$("#moneyQuality").niceSelect();
					}
				}
			}
		});
		//调用获取审批流程数据方法
		sysCommon.getApproveFlowData("SZ_LOAN_APP");
	},
	/**
	 * 
	 * 功能按钮操作事件
	 * 
	 */
	funOperationEvent: function() {
		//取消按钮事件
		$('#approveCanelBtn').on("click", function() {
			//调用清空页面数据方法
			loanApply.clearPageData();
		});
		//提交保存按钮点击事件
		$("#approveSubBtn").off().on("click", function() {
			var thisBtn = $(this);
			//禁用当前按钮
			$(this).attr('disabled', true).addClass('btn-disabled');
			var ajaxUrl = "";
			var validFlag = true;
			var fromUrl = '';
			//判断当前按钮是否包含提交类名
			if(thisBtn.hasClass("sub-btn")) {
				ajaxUrl = "sz/loanApp/submitLoanAppInfo";
				//调用验证表单字段方法
				validFlag = $yt_valid.validForm($("#loanApply"));
				//跳转路径审批页面
				fromUrl = 'view/system-sasac/expensesReim/module/approval/myApplyList.html';
			}
			//收款方为单位金额
			var paytotal = $yt_baseElement.rmoney($('.payee-unit-money').text());
			//收款方为个人金额
			var pertotal = $yt_baseElement.rmoney($('.payee-personal-money').text());
			//收款方为其他金额
			var othtotal = $yt_baseElement.rmoney($('.payee-other-total-money').text());
			//合计
			var alltotal = paytotal + pertotal + othtotal;
			//判断借款金额之和是否等于收款方信息之和
			if(alltotal == $yt_baseElement.rmoney($('#loanMoney').val())) {
				//判断是否验证成功
				if(validFlag) {
					//获取表单数据
					var formDatas = loanApply.getLoanFormData();
					//调用提交接口
					$.ajax({
						type: "post",
						url: ajaxUrl,
						async: false,
						data: formDatas,
						success: function(data) {
							$yt_alert_Model.prompt(data.message);
							if(data.flag == 0) {
								//操作成功跳转到借款审批列表页面
								$yt_common.parentAction({
									url: $yt_option.parent_action_path, //父级中转地址,固定配置项,只有统一修改处理。
									funName: 'locationToMenu', //指定方法名，定位到菜单方法
									data: {
										url: fromUrl //要跳转的页面路径
									}
								});
							};
							//删除
							$(this).attr('disabled', false).removeClass('btn-disabled');
						}
					});
				} else {
					//调用滚动条显示在错误信息位置方法
					sysCommon.pageToScroll($("#loanApply .valid-font"));
					$(this).attr('disabled', false).removeClass('btn-disabled');
				}
			} else {
				$yt_alert_Model.prompt('所有收款方收款金额合计必须等于借款金额');
				//调用滚动条显示在错误信息位置方法
				sysCommon.pageToScroll($("#loanApply .valid-font"));
				$(this).attr('disabled', false).removeClass('btn-disabled');
			}
		});
		//提交保存按钮点击事件
		$("#saveBtn").off().on("click", function() {
			var thisBtn = $(this);
			//禁用当前按钮
			$(this).attr('disabled', true).addClass('btn-disabled');
			var ajaxUrl = "";
			var validFlag = true;
			var fromUrl = '';
			//判断是否是保存按钮
			if(thisBtn.hasClass("save-btn")) {
				ajaxUrl = "sz/loanApp/saveLoanAppInfoToDrafts";
				//跳转路径 草稿箱
				fromUrl = 'view/system-sasac/expensesReim/module/approval/draftsList.html';
			}
			//收款方为单位金额
			var paytotal = $yt_baseElement.rmoney($('.payee-unit-money').text());
			//收款方为个人金额
			var pertotal = $yt_baseElement.rmoney($('.payee-personal-money').text());
			//收款方为其他金额
			var othtotal = $yt_baseElement.rmoney($('.payee-other-total-money').text());
			//合计
			var alltotal = paytotal + pertotal + othtotal;
			//判断借款金额之和是否等于收款方信息之和
			//判断是否验证成功
			if(validFlag) {
				//获取表单数据
				var formDatas = loanApply.getLoanFormData();
				//调用提交接口
				$.ajax({
					type: "post",
					url: ajaxUrl,
					async: false,
					data: formDatas,
					success: function(data) {
						$yt_alert_Model.prompt(data.message);
						if(data.flag == 0) {
							//操作成功跳转到借款审批列表页面
							$yt_common.parentAction({
								url: $yt_option.parent_action_path, //父级中转地址,固定配置项,只有统一修改处理。
								funName: 'locationToMenu', //指定方法名，定位到菜单方法
								data: {
									url: fromUrl //要跳转的页面路径
								}
							});
						};
						//删除
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
	/**
	 * 
	 * 获取借款表单数据
	 * 
	 */
	getLoanFormData: function() {
		var me = this;
		var applicantUserCode = "";
		//判断隐藏的申请人code是否有值
		if($("#hidUserCode").val() != "") {
			applicantUserCode = $("#hidUserCode").val();
		} else {
			//否则赋值当前登录人
			applicantUserCode = $yt_common.user_info.userName;
		}
		var payReceivablesData = function() {
			return JSON.stringify({
				gatheringUnitList: me.gatheringUnitList(),
				gatheringPersonList: me.gatheringPersonList(),
				gatheringOtherList: me.gatheringOtherList()
			})
		};
		//获取借款期限数据
		var loanTerm = $("#lifeOfLoan option:selected").text();
		loanTerm = (loanTerm == '请选择' ? '' : loanTerm);
		return {
			loanAppId: loanApply.loanId, //借款申请表id
			loanAppNum: $("#hidFormNum").val(), //借款单号
			isSpecial: '', //是否属于专项
			loanAppName: $("#loanReason").val(), //借款事由
			loanAmount: $yt_baseElement.rmoney($("#loanMoney").val() || '0'), //借款金额
			paymentMethod: $(".pay-met .yt-radio.check input").val(), //付款方式
			loanTerm: loanTerm, //借款期限
			expectRepaymentTime: $("#returnDate").val(), //预计还款日期
			applicantUser: applicantUserCode, //申请人code
			parameters: "", //JSON格式字符串
			nextCode: $("#operate-flow").val(), //操作流程code
			dealingWithPeople: $("#approve-users").val(), //审批人code
			opintion: $("#operateMsg").val(), //审批意见
			processInstanceId: $("#processInstanceId").val(), //流程实例ID
			payReceivablesData: payReceivablesData()
		}
	},
	/**
	 * 清空页面数据
	 */
	clearPageData: function() {
		//清空输入框,文本域
		$("#loanApply input:not(.radio-inpu,.hid-risk-code),#loanApply textarea").val('');
		$("#loanMoney").val('');
		//		$("#radio1").setRadioState("check");
		//人民币大写
		$("#moneyLower").text('--');
		//初始化下拉列表
		$("#approve-users,#operate-flow,#lifeOfLoan").each(function(i, n) {
			$(this).find("option:eq(0)").attr("selected", "selected");
		});
		$("#loanApply select").each(function(i, n) {
			$(this).find("option:eq(0)").attr("selected", "selected");
		});
		$("#loanApply select").niceSelect();
		//风险灯设置默认
		$("#loanApply .risk-img").attr("src", loanApply.riskExcMark);
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
	gatheringUnitList: function() {
		var list = [];
		var trs = $('table.payee-unit tbody tr:not(.payee-unit-total)');
		var tr = null;
		$.each(trs, function(i, n) {
			tr = $(n);
			list.push({
				unitName: tr.attr('companyname'),
				openBank: tr.attr('openbank'),
				accounts: tr.attr('accountnumber'),
				amount: $yt_baseElement.rmoney(tr.attr('companymoney')),
				isContract: tr.attr('contractradio'),
				isSettlement: tr.attr('settlementRadio'), //isSettlement 结算方式(1 汇款, 2 支票)
				reverseTheWay: /*tr.attr('witeOffCompany')*/'',
				reverseTheWayName: $yt_baseElement.rmoney(tr.find('td').eq(1).text()),
				remarks : tr.attr('companyspecial') == '无' ? '' : tr.attr('companyspecial'),
			})
		});
		return list
	},
	setHeringUnitList: function(list) {
		var html = '';
		var total = 0;
		$
			.each(
				list,
				function(i, n) {
					html += '<tr class="payee-unit-tr" pkid="" witeOffCompany="' +
						n.reverseTheWay +
						'" companyname="' +
						n.unitName +
						'" openbank="' +
						n.openBank +
						'" accountnumber="' +
						n.accounts +
						'" companymoney="' +
						n.amount +
						'" contractradio="' +
						n.isContract +
						'" settlementradio="' +
						n.isSettlement +
						'" companyspecial="' +
						n.remarks +
						'"><td class="com" value="Company">' +
						n.unitName +
						'</td>' +
						'<td style="text-align: right;" class="unitTotal">' +
						($yt_baseElement.fmMoney(n.amount)) +
						'</td><td>' +
						n.openBank +
						'</td><td>' +
						n.accounts +
						'</td><td value="1">' +
						(n.isContract == 1 ? '有' : '无') +
						'</td><td value="1">' +
						(n.isSettlement == 1 ? '汇款' : '支票') +
						'</td><td>' +
						n.remarks +
						'</td><td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td></tr>';
					total += +n.amount
				});
		$('table.payee-unit .payee-unit-total').before(html).find(
			'.payee-unit-money').text($yt_baseElement.fmMoney(total))
	},
	gatheringPersonList: function() {
		var list = [];
		var trs = $('table.payee-personal tbody tr:not(.payee-personal-total)');
		var tr = null;
		$.each(trs, function(i, n) {
			tr = $(n);
			list.push({
				personalType: 2,
				personalCode: tr.attr('payeeval'),
				personalName: tr.attr('payeename'),
				personalUnit: tr.attr('perank'),
				idCard: tr.attr('idcarkno'),
				phoneNum: tr.attr('phonenum'),
				openBank: tr.attr('bankname'),
				accounts: tr.attr('payeebank'),
				writeOffAmount: $yt_baseElement.rmoney(tr
					.attr('theReverseMoney')),
				offOpenBank: tr.attr('offOpenBank'),
				offAccounts: tr.attr('offAccounts'),
				amount: $yt_baseElement.rmoney(tr.attr('personaltotal')),
				loanAppId: tr.attr('choiceloanval') == 'undefined' ? '' : tr.attr('choiceloanval'),
				replaceAmount: $yt_baseElement.rmoney(tr
					.attr('personalwriteoff')),
				cash: $yt_baseElement.rmoney(tr.attr('cash')),
				officialCard: $yt_baseElement.rmoney(tr
					.attr('officialcard')),
				transfer: $yt_baseElement.rmoney(tr
					.attr('transferaccounts')),
				isContract: tr.attr('payeeradio'),
				reverseTheWay: '' /*tr.attr('witeoffpersonal')*/ ,
				remarks: tr.attr('personalspecial') == '无' ? '' : tr
					.attr('personalspecial'),
			})
		});
		return list
	},
	setHeringPersonList: function(list) {
		var html = '';
		var total = 0;
		$
			.each(
				list,
				function(i, n) {
					html += '<tr class="payee-personal-tr" pkid="" payeeval="' +
						n.personalCode +
						'" payeename="' +
						n.personalName +
						'" personalUnit="' +
						n.personalUnit +
						'" pedepartment="' +
						n.personalDept +
						'" perank="' +
						n.personalJobLevelName +
						'" personaltotal="' +
						n.amount +
						'" witeoffpersonal="' +
						n.reverseTheWay +
						'" personalwriteoff="' +
						n.replaceAmount +
						'" cash="' +
						n.cash +
						'" officialcard="' +
						n.officialCard +
						'" transferaccounts="' +
						n.transfer +
						'" payeeradio="' +
						n.isContract +
						'" personalspecial="' +
						n.remarks +
						'" idcarkno="' +
						n.idCard +
						'" payeebank="' +
						n.accounts +
						'" bankname="' +
						n.openBank +
						'" phonenum="' +
						n.phoneNum +
						'" choiceloan="' +
						n.loanAppNum +
						'" choiceloanval="' +
						n.loanAppId +
						'" arrearsmoney="' +
						n.loanAppArrearsAmount +
						'" thereversemoney="' +
						n.writeOffAmount +
						'" offOpenBank="' +
						n.offOpenBank +
						'" offAccounts="' +
						n.offAccounts +
						'"><td class="per" value="personal">' +
						n.personalName +
						'</td><td style="text-align: right;" class="personalTotal">' +
						loanApply.fmMoney(n.amount) +
						'</td><td style="text-align: right;">' +
						(loanApply.fmMoney(n.cash)) +
						'</td><td style="text-align: right;">' +
						(loanApply.fmMoney(n.officialCard)) +
						'</td><td style="text-align: right;">' +
						(loanApply.fmMoney(n.transfer)) +
						'</td><td><a class="yt-link to-data">详情</a></td><td>' +
						(n.isContract == 1 ? '有' : '无') +
						'</td><td>' +
						n.remarks +
						'</td><td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td></tr>';
					total += +n.amount
				});
		$('table.payee-personal .payee-personal-total').before(html).find(
			'.payee-personal-money').text(
			$yt_baseElement.fmMoney(total))
	},
	gatheringOtherList: function() {
		var list = [];
		var trs = $('table.payee-other tbody tr:not(.payee-other-total)');
		var tr = null;
		$.each(trs, function(i, n) {
			tr = $(n);
			list.push({
				otherName: tr.attr('othermoney'),
				amount: $yt_baseElement.rmoney(tr.attr('otherallmoney')),
				isContract: tr.attr('otherradio'),
				reverseTheWay: '' /*tr.attr('witeoffother')*/ ,
				remarks: tr.attr('otherspecial') == '无' ? '' : tr
					.attr('otherspecial')
			})
		});
		return list
	},
	setHeringOtherList: function(list) {
		var html = '';
		var total = 0;
		$
			.each(
				list,
				function(i, n) {
					html += '<tr class="payee-other-tr" pkid="" witeoffother="' +
						n.reverseTheWay +
						'" othermoney="' +
						n.otherName +
						'" otherallmoney="' +
						n.amount +
						'" otherradio="' +
						n.isContract +
						'" otherspecial="' +
						n.remarks +
						'"><td class="oth" value="Other">' +
						n.otherName +
						'</td><td style="text-align: right;" class="otherTotal">' +
						loanApply.fmMoney(n.amount) +
						'</td><td>' +
						(n.isContract == 1 ? '有' : '无') +
						'</td><td>' +
						n.remarks +
						'</td><td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td></tr>';
					total += +n.amount
				});
		$('table.payee-other .payee-other-total').before(html).find(
			'.payee-other-total-money').text(
			$yt_baseElement.fmMoney(total))
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
				//				$('select.vehicle-sel').html(vehicieCode).on("change", function() {
				//					var selVal = $(this).val();
				//					//调用公用方法根据一级交通工具获取二级交通工具
				//					sysCommon.vechicleChildData(selVal);
				//				}).niceSelect();
				//住宿地点
				//$('#hotelParentAddress').html(travelType).niceSelect();
				//其他费用类型
				$('select.cost-type-sel').html(cost).niceSelect();
			}
		});
	},
	/**
	 * 获取收款方信息的收款方式合计
	 */
	getPaymentTermTotal: function() {
		//现金
		var cash = loanApply.rmoney($('#cash').val());
		//公务卡
		var offic = loanApply.rmoney($('#officialCard').val());
		//转账
		var trans = loanApply.rmoney($('#transferAccounts').val());
		return cash + offic + trans;
	},
	//	弹出关闭收款方弹窗方法
	alertClearReceivables: function() {
		//填写金额不能大于金额，失去焦点验证；如果校验失败，显示提示信息：“金额不能大于冲销后补领总金额”
		$('#cash,#officialCard,#transferAccounts').on('blur', function() {
			//金额
			var writeoff = loanApply.rmoney($('#personalTotal').val());
			var total = loanApply.getPaymentTermTotal();
			if(total > writeoff) {
				//当前输入框获得焦点
				$(this).focus();
				$yt_alert_Model.prompt('各收款方式的金额合计与个人收款的金额不相等');
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
				loanApply.raceAddList();
			}).text('保存');

		});
		//		});
		//关闭弹出框表单
		$("#modelCanelBtn,#cost-apply-model .closed-span").click(function() {
			//调用关闭可编辑弹出框方法
			sysCommon.closeModel($("#cost-apply-model"));
			//调用公共用的清空表单数据方法
			loanApply.clearAlert($(".model-content"));
			//清空其他数据
			$('.arrears-money').text(0.00);
			$('.pe-department,.pe-rank').text('');
			$('.personal-writeoff-money').text('0.00');
			$('#cash,#officialCard,#transferAccounts').val('0.00');
			loanApply.setPayeeNameSelect();
			$('.receipt-alert .display-loan').hide();
			//隐藏收款人带出的部门和职级
			$(".display-rank").hide();
			$(".where-company").hide();
			$(".where-company").removeAttr("validform");
			$(".display-rank .valid-font").text("");
			$(".dis-r").hide();
			//隐藏收款人为本人单选
			$("label.user-radio-label").hide().removeClass("check");
			$("#userRadio").prop("checked", false);
		});
		//TAB切换方法
		//		$(".receipt-alert .cost-type-tab li").click(function() {
		//			$(this).addClass("tab-check").siblings().removeClass("tab-check");
		//			var tabIndex = $(this).index();
		//			$(".receipt-alert .tab-info").hide().eq(tabIndex).show();
		//			$yt_alert_Model.getDivPosition($('#cost-apply-model'));
		//		});
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
			//收款人所在单位
			var personalUnit = form.find('#personalUnit').val();
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
			var settlementRadio = form.find('.check .settlementRadio').val();
			var settlementRadioText = '';
			if(settlementRadio == 1) {
				settlementRadioText = '汇款';
			} else {
				settlementRadioText = '支票';
			}
			var companySpecial = form.find('#companySpecial').val();
			//companySpecial = companySpecial ? companySpecial : '无';
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
			var personalWriteoff = form.find('#personalTotal').val(); //个人冲销后补领总金额
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
			//personalSpecial = personalSpecial ? personalSpecial : '无';
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
			//otherSpecial = otherSpecial ? otherSpecial : '无';

			var trHtml = '';

			//三个金额合计必须等于个人冲销后补领总金额；弹窗“保存”按钮时校验；如果校验结果失败，显示提示信息：“收款方式金额合计必须等于个人冲销后补领总金额”，且校验失败时，不能保存数据
			var pamTotal = loanApply.getPaymentTermTotal(); //付款方式合计金额
			var writeOffNum = loanApply.rmoney(personalWriteoff); //个人冲销后补领总金额
			if(pamTotal == writeOffNum) {
				//获取列表中的已有金额 + 输入的金额
				var receMoney = loanApply.getReceMsgMoney(tr) + loanApply.rmoney(otherAllMoney) + loanApply.rmoney(personalWriteoff) + loanApply.rmoney(companyMoney);
				//付款总金额
				var sumMoney = loanApply.rmoney($('#loanMoney').val());
				//验证收款金额与付款总金额
				if(receMoney <= sumMoney) {
					switch(code) {
						case 'company':
							trHtml = '<tr  pkid="" class="payee-unit-tr" witeOffCompany="' + witeOffCompanyCode + '" companyName="' + companyName + '" openBank="' + openBank + '" accountNumber="' + accountNumber + '" companyMoney="' + companyMoney + '" contractRadio="' + contractRadio + '" settlementRadio="' + settlementRadio + '" companySpecial="' + companySpecial + '">' +
								'<td class="com" value="Company">' + companyName + '</td>' +
								'<td style="text-align: right;" class="unitTotal">' + ($yt_baseElement.fmMoney(companyMoney)) + '</td>' +
								'<td>' + openBank + '</td>' +
								'<td>' + accountNumber + '</td>' +
								'<td value="' + contractRadio + '">' + contractRadioText + '</td>' +
								'<td value="' + settlementRadio + '">' + settlementRadioText + '</td>' +
								'<td>' + companySpecial + '</td>' +
								'<td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
								'</tr>';
							if(tr) {
								tr.replaceWith(trHtml);
								//调用关闭可编辑弹出框方法
								loanApply.clearAlterTable();
							} else {
								$('.rece-msg table[code="' + code + '"] tbody .payee-unit-total').before(trHtml);
								$yt_alert_Model.prompt('填写的信息已成功加入到列表');
							}
							//					获取合计
							loanApply.companyTotal();
							break;
						case 'personal':
							if(verifyName()) {
								trHtml = '<tr class="payee-personal-tr" pkid="" payeeVal="' + payeeVal + '" payeeName="' + payeeName + '" personalUnit="' + personalUnit + '" peDepartment="' + peDepartment + '" peRank="' + peRank + '" personalTotal="' + personalTotal + '" witeOffPersonal="' + witeOffPersonalVal + '" personalWriteoff="' + personalWriteoff + '" cash="' + cash + '" officialCard="' + officialCard + '" transferAccounts="' + transferAccounts + '" payeeRadio="' + payeeRadio + '" personalSpecial="' + personalSpecial + '" idCarkno="' + idCarkno + '" payeeBank="' + payeeBank + '" bankName="' + bankName + '" phoneNum="' + phoneNum + '" choiceLoan="' + choiceLoan + '" choiceLoanVal="' + choiceLoanVal + '" arrearsMoney="' + arrearsMoney + '" theReverseMoney="' + theReverseMoney + '" offOpenBank="' + offOpenBank + '" offAccounts="' + offAccounts + '">' +
									'<td class="per" value="personal">' + payeeName + '</td>' +
									'<td style="text-align: right;" class="personalTotal">' + ($yt_baseElement.fmMoney(personalTotal)) + '</td>' +
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
									loanApply.clearAlterTable();
								} else {
									$('.rece-msg table[code="' + code + '"] tbody .payee-personal-total').before(trHtml);
									$yt_alert_Model.prompt('填写的信息已成功加入到列表');
								}
								//					获取合计
								loanApply.personalTotal();
							}
							break;
						case 'other':
							trHtml = '<tr class="payee-other-tr"  pkid="" witeOffOther="' + witeOffOtherVal + '" otherMoney="' + otherMoney + '" otherAllMoney="' + otherAllMoney + '" otherRadio="' + otherRadio + '" otherSpecial="' + otherSpecial + '">' +
								'<td class="oth" value="Other">' + otherMoney + '</td>' +
								'<td style="text-align: right;" class="otherTotal">' + ($yt_baseElement.fmMoney(otherAllMoney)) + '</td>' +
								'<td>' + otherRadioText + '</td>' +
								'<td>' + otherSpecial + '</td>' +
								'<td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
								'</tr>';
							if(tr) {
								tr.replaceWith(trHtml);
								//调用关闭可编辑弹出框方法
								loanApply.clearAlterTable();
							} else {
								$('.rece-msg table[code="' + code + '"] tbody .payee-other-total').before(trHtml);
								$yt_alert_Model.prompt('填写的信息已成功加入到列表');
							}
							//					获取合计
							loanApply.otherTotal();
							break;
						default:
							break;
					}
					//调用公共用的清空表单数据方法
					loanApply.clearAlert($(".model-content"));
					//初始化人员列表
					loanApply.setPayeeNameSelect();
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
					$("#userRadio").prop("checked", false);

				} else {
					$yt_alert_Model.prompt('金额不能大于申请支出总金额');
				}
			} else {
				$yt_alert_Model.prompt('各收款方式的金额合计与个人收款的金额不相等');
			}

		}
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
			//结算方式
			var settlementRadio = tr.attr('settlementRadio');
			$('.settlementCheck .check-label input[value="' + settlementRadio + '"]').setRadioState('check');
			//特殊说明
			var companySpecial = tr.attr('companySpecial');
			//$('#companySpecial').val(companySpecial == '无' ? '' : companySpecial);
			//弹窗方法
			//				loanApply.alertClearReceivables();
			$('#appendPaymentInfo').off().on('click', function() {
				//编辑方法
				loanApply.raceAddList(tr);
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
			loanApply.setPayeeNameSelect(payee);
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
				//收款人所在单位
				$('#personalUnit').val(tr.attr('personalUnit'));
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
				loanApply.getChoiceLoanList(tr.attr('choiceLoanVal'));
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
			//$('#personalSpecial').val(personalSpecial == '无' ? '' : personalSpecial);
			//弹窗方法
			//				loanApply.alertClearReceivables();
			$('#appendPaymentInfo').off().on('click', function() {
				//编辑方法
				loanApply.raceAddList(tr);
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
			//$('#witeOffOther').val(tr.attr('witeOffOther')).niceSelect();
			//金额
			$('#otherAllMoney').val(tr.attr('otherAllMoney'));
			//有无合同协议
			var otherRadio = tr.attr('otherRadio');
			$('.otherCheck .check-label input[value="' + otherRadio + '"]').setRadioState('check');
			//特殊说明
			var otherSpecial = tr.attr('otherSpecial');
			$('#otherSpecial').val(otherSpecial == '无' ? '' : otherSpecial);
			//弹窗方法
			//				loanApply.alertClearReceivables();
			$('#appendPaymentInfo').off().on('click', function() {
				//编辑方法
				loanApply.raceAddList(tr);
			}).text('确定');
		})
	},
	clearAlterTable: function() {
		//关闭弹出框表单
		//调用关闭可编辑弹出框方法
		sysCommon.closeModel($("#cost-apply-model"));
		//调用公共用的清空表单数据方法
		loanApply.clearAlert($(".model-content"));
		loanApply.setPayeeNameSelect();
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
						loanApply.payeeUserList = data.data.rows;
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
						//						me.busiTripUserModelEvent($("#modelBusiUser"), $("#busiPlanEditModel .auto-font"), $(".model-user-num-show"), 1);
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
		$.each(loanApply.payeeUserList, function(i, n) {
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
				$.each(loanApply.payeeUserList, function(i, n) {
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
				} else {
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
	 * 获取收款方的现有金额
	 */
	getReceMsgMoney: function(tr) {
		var total = 0;
		//收款单位金额
		var unit = 0;
		$('table.payee-unit tbody tr:not(.payee-unit-total)').not(tr).each(function() {
			unit += loanApply.rmoney($(this).find('.unitTotal').text());
		});
		//收款个人金额
		var us = 0;
		$('table.payee-personal tbody tr:not(.payee-personal-total)').not(tr).each(function() {
			other += loanApply.rmoney($(this).find('.personalTotal').text());
		});
		//收款其他金额
		var other = 0;
		$('table.payee-other tbody tr:not(.payee-other-total)').not(tr).each(function() {
			other += loanApply.rmoney($(this).find('.otherTotal').text());
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