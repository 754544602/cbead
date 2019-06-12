var pay = {
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
		$('.dottom-div').show();
		$('.grod-div').show();
		$('.business-div').show();
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
		$('.dottom-div').show();
		$('.grod-div').show();
		//相关区域显示
		$('.index-main-div').show();
		//加载区域页面
		sysCommon.loadingWord('view/system-sasac/expensesReim/module/payment/ordinaryPaymentApplyApproval.html');
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
		$('.dottom-div').show();
		$('.grod-div').show();
		//相关区域显示
		$('.travel-div').show();
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
		$('.dottom-div').show();
		$('.grod-div').show();
		//相关区域显示
		$('.index-main-div').show();
		//加载区域页面
		sysCommon.loadingWord('view/system-sasac/expensesReim/module/busiTripApply/trainApproval.html');
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
		$('.dottom-div').show();
		$('.grod-div').show();
		//相关区域显示

	},
	alertpay: function() {
		var me = this;
		//显示支出明细弹出框
		$('#payAddBtn').click(function() {
			//未付款金额
			var notMoney = $yt_baseElement.rmoney($('#notMoney').text());
			if(notMoney > 0){
				//显示弹窗
				me.showMsgAlert();
				$('#LpaymentAddBtn').off().on('click', function() {
					//未付款金额
					var notMoney = $yt_baseElement.rmoney($('#notMoney').text());
					//输入的金额
					var money = $yt_baseElement.rmoney($('#Unit').val());
					//填写的金额不能大于未付款金额；如果验证失败，提示“金额不能大于未付款金额”，采用失去焦点方法进行验证
					if(money > notMoney){
						$yt_alert_Model.prompt('金额不能大于未付款金额');
					} else {
						$yt_alert_Model.alertOne({
							alertMsg: "确定已支付后不可修改，确定所填写的支付明细并提交吗？", //提示信息  
							confirmFunction: function() { //点击确定按钮执行方法  
								/** 
								 * 调用验证方法 
								 */
								var isNull = $yt_valid.validForm($("#addObjInfo"));
								if(isNull) {
									//添加到数据库方法
				
									//添加到列表方法
									me.appendMsgList();
									//隐藏
									me.hideMsgAlert();
								}
							},
				
						});
					}
				}).text('确定已支付');
			} else {
				//支付明细中新增金额验证，未付款金额为0时，点击新增按钮时，提示“已支付所有应付款金额”，且不弹出弹窗
				$yt_alert_Model.prompt('已支付所有应付款金额');
			}
			
		});
	},
	//	记账凭证
	alerttally: function() {
		var me = this;
		$('#tallyAddBtn').click(function() {
			me.showtallyAlert();
			$('#paymentAddBtn').off().on('click', function() {
				//				字段验证
				$yt_valid.validForm($("#AddAppDetails"));
				/** 
				 * 调用验证方法 
				 */
				var isNull = $yt_valid.validForm($("#AddAppDetails"));
				if(isNull) {
					me.appendtallyList();
					//隐藏
					me.hidetallyAlert();
				}
			}).text('添加到列表');
		});
	},
	/**
	 * 1.1.5.1	付款申请信息：提交表单数据
	 * @param {Object} subData
	 */
	submitPaymentAppInfo: function(subData,thisBtn) {
		$.ajax({
			type: 'post',
			url: 'sz/payApp/submitPaymentAppInfo',
			data: subData,
			success: function(data) {
				if(data.flag == 0) {
					//提交成功跳转列表页面
					window.location.href = $yt_option.websit_path + 'view/system-sasac/expensesReim/module/approval/paymentApprovalList.html?state=1';
				}
				$yt_alert_Model.prompt(data.message);
				thisBtn.attr('disabled',false).removeClass('btn-disabled');
			}
		});
	},
	getSaveData: function() {
		var d = pay.saveData,
			costData = {},
		//费用信息数据
		costData = d.costData,
		//收款方数据
		payReceivablesData = d.payReceivablesData;
		d.opintion = $("#opintion").val(); //		opintion	审批意见
		//nextCode	操作流程代码
		d.nextCode = $("#operate-flow option:selected").val();
		//dealingWithPeople	下一步操作人code
		d.dealingWithPeople = $("#approve-users option:selected").val();
		d.attIdStr = pay.getFileList(); //		advanceAttIdStr	附件idstr
		d.attList = '';
		d.costData = typeof(costData) == 'string' ? costData : JSON.stringify(costData); //		costData	费用申请json串
		d.payReceivablesData = typeof(payReceivablesData) == 'string' ? payReceivablesData : JSON.stringify(payReceivablesData);
		d.parameters = '';
		d.billingVoucherList = '';
		//删除创建日期字段
		delete d.applicantTime;
		d.payDetailList = pay.payDetailList();
		
		return d;
	},
	/**
	 * 获取附件字符串
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
	//	操作流程字段验证
	submitPayment: function() {
		$("#submitPayment").off().on("click", function() {
			var thisBtn=$(this);
			$(this).attr('disabled',true).addClass('btn-disabled');
			if($yt_valid.validForm($(".operation"))){
				//未付款金额
				var notMoney = $yt_baseElement.rmoney($('#notMoney').text());
				//未付款金额不为0时，点击提交时，提示“应付款金额未全部付清”，且不能提交申请
				if(notMoney != 0){
					$yt_alert_Model.prompt('应付款金额未全部付清');
					thisBtn.attr('disabled',false).removeClass('btn-disabled');
				} else {
					var data = pay.getSaveData();
					//提交数据
					pay.submitPaymentAppInfo(data,thisBtn);
				}
			}else{
				thisBtn.attr('disabled',false).removeClass('btn-disabled');
			}
		});
	},
	showMsgAlert: function() {
		//显示对象信息弹框及蒙层
		$yt_baseElement.showMongoliaLayer();
		$yt_alert_Model.getDivPosition($('#createDetali'));
		$('#pop-modle-alert').show();
		$('#createDetali').show();
	},
	showtallyAlert: function() {
		//显示记账凭证弹框及蒙层
		$yt_baseElement.showMongoliaLayer();
		$yt_alert_Model.getDivPosition($('#createExpense'));
		$('#pop-modle-alert').show();
		$('#createExpense').show();
	},
	/*支付明细数据添加到列表（数据库）方法*/
	appendMsgList: function(tr) {
		var me = this;
		//收款方类型
		var type =  $('#firstSelect option:selected').text();
		var typeVal =  $('#firstSelect option:selected').val();
		//收款方
		var budgetProject = $('#budgetProject option:selected').text();
		//收款方id
		var budgetProjectCode = $('#budgetProject option:selected').val();
		//付款日期
		var payDate = $('#payDate').val();
		//金额
		var Unit = $('#Unit').val();
		$.ajax({
			type: "post",
			url: "sz/payDetailBillingVoucher/savePaymentDetailInfo",
			async: true,
			data: {
				appId:pay.saveData.payAppId,//表单申请Id
				appType:'PAYMENT_APP',//表单申请类型		 报销申请- REIM_APP		付款申请 - PAYMENT_APP
				receivablesId:budgetProjectCode,//收款方id
				receivablesType:typeVal,//收款方类型		收款方单位 - GATHERING_UNIT	   收款方个人 - GATHERING_PERSON   收款方其他 - GATHERING_OTHER
//				payDetailId:'',//支付明细Id
				paymentDate:payDate,//付款日期
				paymentAmount:pay.rmoney(Unit),//付款金额
			},
			success: function(data) {
				if(data.flag == 0) {
					var d = data.data;
					//添加成功
					var html = '<tr pid="" type="'+typeVal+'" payee="' + budgetProjectCode + '" payment="' + payDate + '" paymentmoney="' + Unit + '">' +
						' <td class="payee" style="width: 100px;">' + budgetProject + '</td>' +
						' <td class="payment" style="width: 100px;">' + payDate + '</td>' +
						' <td class="paymentmoney" style="text-align: right;">' + Unit + '</td></tr>';
					//替换
					/*if(tr) {
						tr.replaceWith(html);
					} else {
						//$('.msg-list').append(html);
						$('.pay-detail-tabel tbody .pay-detail-tabel-total').before(html);
					}*/
					//隐藏
					me.hideMsgAlert();
					//清空
					me.clearAlert($('#createDetali'));
					//获取列表
					me.getPaymentAmountInfoList(d.appId);
					//重置序号
					//me.resetNum($('.msg-list'));
				}
				//添加失败
				$yt_alert_Model.prompt(data.message);

			}
		});
		
		
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
//		$yt_baseElement.fmMoney($('.payee-other tbody .payee-other-total-money').text(fmTotal));
	},

	appendtallyList: function(tr) {

		var me = this;

		//借贷方类型
		var typeselect = $('#typeselect option:selected').text();
		//摘要
		var summary = $('#summary').val();
		//会计科目
		var bursar = $('#bursar').val();
		//总账科目
		var ledger = $('#ledger').val();
		//明细科目
		var detail = $('#detail').val();
		//金额
		var taMoney = $('#taMoney').val();
		//借贷方类型code
		var tallygetCode = $('#typeselect option:selected').val();
		var html = '<tr Pcode="' + tallygetCode + '" typeselect="' + typeselect + '" summary="' + summary + '" bursar="' + bursar + '" ledger="' + ledger + '" detail="' + detail + '" taMoney="' + taMoney + '">' +
			' <td class="typeselect" style="width: 100px;">' + typeselect + '</td>' +
			' <td class="summary" style="width: 100px;">' + summary + '</td>' +
			' <td class="bursar" style="width: 100px;">' + bursar + '</td>' +
			' <td class="ledger" style="width: 100px;">' + ledger + '</td>' +
			' <td class="detail" style="width: 100px;">' + detail + '</td>' +
			' <td><span class="receive-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="receive-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td> </tr>';
		//替换

		if(tr) {
			tr.replaceWith(html);
		} else {
			//$('.msg-list').append(html);
			$('.tally-proof-tabel').append(html);
		}
		//隐藏
		me.hidetallyAlert();
		//清空
		me.clearAlert($('.create-expense'));
		//重置序号
		//me.resetNum($('.msg-list'));
	},
	//		隐藏支付明细弹窗
	hideMsgAlert: function() {
		$yt_baseElement.hideMongoliaLayer();
		$('#createDetali').hide();
		$('#pop-modle-alert').hide();
	},
	//	隐藏记账凭证弹窗
	hidetallyAlert: function() {
		$yt_baseElement.hideMongoliaLayer();
		$('#createExpense').hide();
		$('#pop-modle-alert').hide();
	},
	hidepayalert: function() {
		//关闭支付明细弹窗
		$('#paymentCanelBtn').on('click', function() {
			//关闭弹框及蒙层
			$yt_baseElement.hideMongoliaLayer();
			$('#createDetali').hide();
			$('#pop-modle-alert').hide();
			pay.clearAlert($('.create-detali'));
		});
	},
	hidetallyalert: function() {
		//关闭记账凭证弹窗
		$('#GpaymentCanelBtn').on('click', function() {
			//关闭弹框及蒙层
			$yt_baseElement.hideMongoliaLayer();
			$('#createExpense').hide();
			$('#pop-modle-alert').hide();
			pay.clearAlert($('.create-expense'));
		});
	},
	getpaydata: function() {
		$("#payDate").calendar({
			speed: 0, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			lowerLimit: "2010/01/01", // 日期下限，默认：NaN(不限制)     
			nowData: false, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd",
			callback: function() { // 点击选择日期后的回调函数  
				//alert("您选择的日期是：" + $("#txtDate").val());  
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
			$(n).find('option:first-child').attr('selected', true);
		});
		selects.niceSelect();
		//输入框
		var inputs = obj.find('input');
		inputs.val('');
	},
	Moneyfocus: function() {
		/** 
		 * 金额文本框获取焦点事件 
		 */
		$("#taMoney").on("focus", function() {
			if($(this).val() != "") {
				//调用还原格式化的方法  
				$(this).val($yt_baseElement.rmoney($(this).val()));
			}
		});
		/** 
		 * 金额文本框失去焦点事件 
		 */
		$("#taMoney").on("blur", function() {
			if($(this).val() != "") {
				//调用格式化金额方法  
				$(this).val($yt_baseElement.fmMoney($(this).val()));
			}
		});
	},
	Moneyfocusdetail: function() {
		/** 
		 * 金额文本框获取焦点事件 
		 */
		$("#Unit").on("focus", function() {
			if($(this).val() != "") {
				//调用还原格式化的方法  
				$(this).val($yt_baseElement.rmoney($(this).val()));
			}
		});
		/** 
		 * 金额文本框失去焦点事件 
		 */
		$("#Unit").on("blur", function() {
			var val = $(this).val();
			//未付款金额
			var notMoney = $yt_baseElement.rmoney($('#notMoney').text());
			//填写的金额不能大于未付款金额；如果验证失败，提示“金额不能大于未付款金额”，采用失去焦点方法进行验证
			if(val > notMoney){
				$(this).focus();
				$yt_alert_Model.prompt('金额不能大于未付款金额');
			}
			if($(this).val() != "") {
				//调用格式化金额方法  
				$(this).val($yt_baseElement.fmMoney($(this).val()));
			}
		});
	},
	//	删除记账凭证
	deltally: function() {
		$('.tally-proof-tabel').on('click', '.receive-del', function() {
			var ithis = $(this);
			var tr = ithis.parents('tr');
			$yt_alert_Model.alertOne({
				alertMsg: "数据删除将无法恢复,确认删除吗?", //提示信息  
				confirmFunction: function() { //点击确定按钮执行方法  
					tr.remove();
					//						var tds = $('.tally-proof-tabel tbody .money');
					var total = 0;
					//计算合计金额

					//						$.each(tds, function(i, n) {
					//							total += +$(n).attr('money');
					//						});
					//						var fmTotal = $yt_baseElement.fmMoney(total);
					//						//赋值合计金额

					//						$('.tally-proof-tabel tbody .total-money').text(fmTotal);
					//						//报销总金额
					//						$('.count-val-num').text(fmTotal);
					//						//大写转换
					//						$('.count-val').text(arabiaToChinese(fmTotal));
				}
			});
		});
	},
	updatatally: function() {
		//编辑记账凭证
		$('.tally-proof-tabel').on('click', '.receive-update', function() {
			var ithis = $(this);
			var tr = ithis.parents('tr');

			//显示弹框及蒙层
			$yt_baseElement.showMongoliaLayer();
			$yt_alert_Model.getDivPosition($('#createExpense'));
			$('#pop-modle-alert').show();
			$('#createExpense').show();

		});
	},
	updatatallycarry: function() {
		//			给表格重新赋值
		$('.tally-proof-tabel').on('click', '.receive-update', function() {
			var me = this;
			var ithis = $(this);
			var tr = ithis.parents('tr');

			//借贷方类型
			var typeselect = $('#typeselect option[value="' + tr.attr('pcode') + '"]').attr('selected', true);
			//摘要
			var summary = $('#summary').val(tr.attr('summary'));
			//会计科目
			var bursar = $('#bursar').val(tr.attr('bursar'));
			//总账科目
			var ledger = $('#ledger').val(tr.attr('ledger'));
			//明细科目
			var detail = $('#detail').val(tr.attr('detail'));
			//金额
			var taMoney = $('#taMoney').val(tr.attr('taMoney'));

			$('#typeselect').niceSelect();
			//显示弹框
			pay.showtallyAlert();

			$('#paymentAddBtn').off().on('click', function() {
				//编辑方法
				pay.appendtallyList(tr);
			}).text('确定');
		});
	},
	//	点击取消返回审批列表页面
	clearexamine: function() {
		$("#ClearBtn").off().on("click", function() {
			$yt_common.parentAction({
				url: $yt_option.parent_action_path, //父级中转地址,固定配置项,只有统一修改处理。
				funName: 'locationToMenu', //指定方法名，定位到菜单方法
				data: {
					url: 'view/system-sasac/expensesReim/module/approval/paymentApprovalList.html' //要跳转的页面路径
				}
			});
		});
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
	//培训信息ajax
	getInformationajax: function(data) {},
	//培训信息拼接字符串
	getInformationstring: function(data) {},
	//讲师信息ajax
	getLectorajax: function(data) {},
	//讲师信息拼接字符串
	getLectorstring: function(data) {},
	//培训费金额ajax
	gettrainMoneyajax: function(data) {},
	//培训费金额拼接字符串
	gettrainMoneystring: function(data) {},
	//讲课费金额ajax
	getlectureMoneyajax: function(data) {},
	//讲课费金额拼接字符串
	getlectureMoneystring: function(data) {},
	//城市间交通费金额ajax
	gettrafficMoneyajax: function(data) {},
	//城市间交通费金额拼接字符串
	gettrafficMoneystring: function(data) {},
	//住宿费金额ajax
	getaccommodationMoneyajax: function(data) {},
	//住宿费金额拼接字符串
	getaccommodationMoneystring: function(data) {},
	//伙食费ajax
	getfoodMoneyajax: function(data) {},
	//伙食费拼接字符串
	getfoodMoneystring: function(data) {},
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
					//判断当前节点
					if(d.taskKey == 'activitiEndTask') {
						//申请人填报 对应key值: activitiStartTask
						//工作流最后一步审批操作对应key值: activitiEndTask
						//最后一步显示财务支付相关
						$('.pay-detail').show();
						//清除审批人的必填验证
						$('#approve-users').attr("validform", "{isNull:false,msg:'请选择审批人'}")
						//获取支付明细列表
						me.getPaymentAmountInfoList(d);
					} else {
						//$('.pay-detail').hide();
						//修改提交按钮文本
						$('#submitPayment').text('提交');
						//$('#approve-users').attr("validform","{isNull:true,msg:'请选择审批人'}")
					}
					//保存详情数据
					pay.saveData = d;
					//添加数据至页面
					me.setFormData(d);
				}

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
		//调用获取审批流程数据方法
		sysCommon.getApproveFlowData("SZ_ADVANCE_APP", d.processInstanceId);
		//申请人名称:#busiUsers 	applicantUserName
		$('#busiUsers').text(d.applicantUserName);
		//申请人部门:#deptName  applicantUserDeptName
		$('#deptName').text(d.applicantUserDeptName);
		//申请人职务名称:#jobName applicantUserJobLevelName
		$('#jobName').text(d.applicantUserJobLevelName);
		//paymentAppNum	付款单号
		$('#formNum').text(d.paymentAppNum);
		//申请日期
		$('#fuData').text(d.applicantTime);
		//paymentAppName	付款事由
		$('.advanceAppReason').text(d.paymentAppName);
		//事前申请编号
		$('.befor-examine').text(d.advanceAppNum ? d.advanceAppNum : '--');
		if(d.advanceAppNum){
			$('.advance-relevance').show();
			$('#advanceAppBalance').text(d.advanceAppBalance ? (me.fmMoney(d.advanceAppBalance) + '元') : '--');
		}
		//项目名称存在时 显示项目名称
		if(d.prjName) {
			$('#prjName').text(d.prjName);
			$('.prj-name-tr').show();
		}
		//costTypeName 付款类型名称
		$('.expense-type').text(d.costTypeName);
		//$('#isSpecial').text(d.isSpecial == '1' ? '是' : '否');
		$('#specialName').text(d.specialName);//specialCode	所属预算项目code
		$('#budgetBalanceAmount').text(d.budgetBalanceAmount ?  me.fmMoney(d.budgetBalanceAmount) + '万元' : '--');//budgetBalanceAmount	预算剩余额度
		//invoiceNum	发票张数
		$('#invoiceNum').text(d.invoiceNum?d.invoiceNum:'0');
		//totalAmount	付款总金额
		$('.count-val-num,#mustMoney').text(me.fmMoney(d.totalAmount));
		//大写金额
		$('.total-money-up').text(arabiaToChinese(d.totalAmount + ''));
		//attIdStr	附件id,字符串,逗号分隔
		//applicantUser	申请人
		
		//获取流程信息

		//attList	附件集合
		me.showFileList(d.attList);
		//显示费用列表数据内容
		me.setDataListTable(d.costData);
		//显示收款列表数据内容
		me.setReceiptListTable(d.payReceivablesData);
		//显示支付明细数据
		//me.setPayDetailList(d.payDetailList);
		
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
			$.each(list, function(i, n) {
				//获取图片格式
				var imgType = n.attName.split('.');
				if(imgType.length > 1 && (imgType[1] == 'png' || imgType[1] == 'jpeg' || imgType[1] == 'bmp' || imgType[1] == 'jpg')){
					//拼接图片路径
					src = $yt_option.base_path +'fileUpDownload/download?pkId=' + n.attId + '&isDownload=false';
					ls += '<div fid="' + n.attId + '" class="li-div"><span class="file-name" >' + n.attName + '</span><label class="file-dw">下载</label><label class="file-pv">预览<img src="'+src+'" ></label></div>';
				}else{
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
		},
	/**
	 * 显示table 数据列表
	 * @param {Object} costData
	 */
	setDataListTable: function(data) {
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
			receHtml += '<tr pkId="' + n.receptionObjectId + '" class="" applyName="' + n.name + '" Unit="' + n.jobName + '" Duties="' + n.unitName + '">' +
				'<td><span class="num">1</span></td>' +
				'<td><span class="name-text">' + n.name + '</span></td>' +
				'<td><span class="job-text">' + n.jobName + '</span></td>' +
				'<td><span class="unit-text">' + n.unitName + '</span></td>' +
				'</tr>';
		});
		//替换代码
		$('.msg-list tbody').append(receHtml);
		//重置序号
		//		me.resetNum($('.msg-list'));

		//费用明细信息集合HTML文本
		var detaHtml = '';
		//结算方式复选框
		var costDetaClose = $('#paymentList').next().find('.check-label input');
		$.each(costDetailsList, function(i, n) {

			detaHtml += '<tr Tcode="' + n.budgetfeiCode + '" Pcode="' + n.costType + '" budgetProject="' + n.publicServiceProName + '" txtDate="' + n.activityDate + '" place="' + n.placeName + '" costBreakdown="' + n.costTypeName + '" bzy-span="' + n.standardAmount + '" budgetMoney="' + n.activityAmount + '" peoplenum="' + n.peopleNum + '">' +
				'<td><span class="">' + n.publicServiceProName + '</span></td>' +
				'<td><span class="activityDate">' + n.activityDate + '</span></td>' +
				'<td><span class="place-name">' + n.placeName + '</span></td>' +
				'<td><span>' + n.costTypeName + '</span></td>' +
				'<td style="text-align: right;"><div class="stan-money" money=' + n.standardAmount + '>' + fMoney(n.standardAmount || '0') + '</div></td>' +
				'<td style="text-align: right;"><div class="money" money=' + n.activityAmount + '>' + fMoney(n.activityAmount || '0') + '</div></td>' +
				'<td><span class="people-num">' + n.peopleNum + '</span></td>' +
				'</tr>';
			//结算方式复选框存在并且有选中的值时
			if(costDetaClose.length > 0 && n.setMethod) {
				//设置选中
				costDetaClose.setCheckBoxState('check');
			}
		});
		//追加表格代码
		$('#paymentList tbody .last').before(detaHtml);

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

		//costCarfareList	城市间交通费
		var costCarfareList = data.costCarfareList;
		var carHtml = '';
		//结算方式复选框
		var costCarfareClose = $('#traffic-list-info').next().find('.check-label input');
		$.each(costCarfareList, function(i, n) {
			carHtml += '<tr>' +
				'<td><span>' + n.travelPersonnelName + '</span><input type="hidden" data-val="travelPersonnel" class="hid-traf-users" value="' + n.travelPersonnel + '"/>' +
				'</td><td>' + n.travelPersonnelsDept + '</td>' +
				'<td data-text="goTime">' + n.goTime + '</td><td><input data-val="goAddress" type="hidden" value="' + n.goAddress + '"><span data-text="goAddressName">' + n.goAddressName + '</span></td><td data-text="arrivalTime">' + n.arrivalTime + '</td>' +
				'<td><input data-val="arrivalAddress" type="hidden" value="' + n.arrivalAddress + '"> <span data-text="arrivalAddressName">' + n.arrivalAddressName + '</span></td>' +
				'<td><span data-text="vehicle">' + n.vehicleName + '</span><input type="hidden" class="hid-vehicle" value="' + n.vehicle + '"/><input type="hidden" class="hid-child-code" value=""/></td>' +
				'<td class="font-right money-td" data-text="crafare">' + (n.crafare == "" ? "--" : fMoney(n.crafare || '0')) + '</td>' +
				'<td class="text-overflow-sty" data-text="remarks" title="' + n.remarks + '">' + (n.remarks == "" ? "--" : n.remarks) + '</td>' +
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
		me.updateMoneySum(0);
		//costHotelList	住宿费
		var costHotelList = data.costHotelList;
		var hotelHtml = '';
		//结算方式复选框
		var costHotelClose = $('#hotel-list-info').next().find('.check-label input');
		$.each(costHotelList, function(i, n) {
			hotelHtml += '<tr>' +
				'<td><span>' + n.travelPersonnelName + '</span><input type="hidden" data-val="travelPersonnel" value="' + n.travelpersonnel + '"/></td><td>' + n.travelPersonnelsDept + '</td>' +
				/*'<td data-text="hotelTime">' + $("#hotelDate").val() + '</td>' +*/
				'<td class="font-right">' + fMoney((n.hotelExpense / n.hotelDays) || '0') + '</td>' +
				'<td data-text="hotelDays">' + n.hotelDays + '</td><td class="font-right money-td" data-text="hotelExpense">' + fMoney(n.hotelExpense || '0') + '</td>' +
				'<td><span data-text="hotelAddressName">' + n.hotelAddressName + '</span><input type="hidden" data-val="hotelAddress" value="' + n.hotelAddress + '"</td>' +
				'<td class="text-overflow-sty" data-text="remarks" title="' + n.remarks + '">' + (n.remarks == "" ? "--" : n.remarks) + '</td>' +
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
			'<td><span class="tab-font-blod">合计</span></td><td></td><td></td><td></td>' +
			'<td class="font-right"><span class="tab-font-blod money-sum">0.00</span></td>' +
			'<td></td><td></td></tr>';
		$('#hotel-list-info tbody').html(hotelHtml);
		//调用合计方法
		me.updateMoneySum(1);
		//costOtherList	其他费用
		var costOtherList = data.costOtherList;
		var otherHtml = '';
		//结算方式复选框
		var costOtherClose = $('#other-list-info').next().find('.check-label input');
		$.each(costOtherList, function(i, n) {
			otherHtml += '<tr>' +
				'<td><span>' + n.costTypeName + '</span><input type="hidden" data-val="costType" value="' + n.costType + '"/></td>' +
				'<td class="font-right money-td" data-text="reimAmount">' + fMoney(n.reimAmount || '0') + '</td>' +
				'<td class="text-overflow-sty" data-text="remarks" title="' + n.remarks + '">' + (n.remarks == "" ? "--" : n.remarks) + '</td>' +
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
		me.updateMoneySum(2);
		//costSubsidyList	补助明细
		var costSubsidyList = data.costSubsidyList;
		var subHtml = '';
		var totalFood = 0;
		var totalTraffic = 0;
		$.each(costSubsidyList, function(i, n) {
			subHtml += '<tr class="' + n.travelPersonnel + '" code="' + n.travelPersonnel + '"><td><div class="user" code="' + n.travelPersonnel + '">' + n.travelPersonnelName + '</div></td><td><div class="lv">' + n.travelPersonnelsDept + '</div></td><td><div class="subsidy-num">' + n.subsidyDays + '</div></td><td><div style="text-align:right;" class="food">' + fMoney(n.subsidyFoodAmount || '0') + '</div></td><td><div  style="text-align:right;" class="traffic">' + fMoney(n.carfare || '0') + '</div></td></tr>';
			totalFood += +n.subsidyFoodAmount;
			totalTraffic += +n.carfare;
		});
		subHtml += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + $yt_baseElement.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + $yt_baseElement.fmMoney(totalTraffic) + '</td></tr>';
		$('#subsidy-list-info tbody').html(subHtml);

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
				'<td style="display:none"><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
				'</tr>';
		});
		//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + pay.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + pay.fmMoney(totalTraffic) + '</td></tr>';
		$('#trainingPopTable tbody').html(html);
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
				'<td style="display:none"><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
				'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td></tr>';
		});
		//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + pay.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + pay.fmMoney(totalTraffic) + '</td></tr>';
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
				'<td class="moneyText" class="avg">' + pay.fmMoney(n.averageMoney) + '</td>' +
				'<td class="moneyText training-total">' + pay.fmMoney(n.trainAmount) + '</td>' +
				'<td style="display:none"><input type="hidden" class="popM" value="0"/>' +
				'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
				'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
				'</tr>';
		});
		//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + pay.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + pay.fmMoney(totalTraffic) + '</td></tr>';
		$('#trainingFeeTable tbody').html(html);
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
				'<td><input type="hidden" class="lectureId" value="' + n.lecturerId + '">' + n.lecturerName + '</td>' +
				'<td class="avg moneyText">' + pay.fmMoney(n.averageMoney) + '</td>' +
				'<td class="day">' + n.foodOfDays + '</td>' +
				'<td class="moneyText sum-pay">' + pay.fmMoney(n.foodAmount) + '</td>' +
				'<td style="text-align: left !important;" class="dec">' + n.remarks + '</td>' +
				'<td style="display:none"><input type="hidden" class="popM" value="4"/>' +
				'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
				'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
				'</tr>';
			total += +n.foodAmount;
		});
		//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + pay.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + pay.fmMoney(totalTraffic) + '</td></tr>';
		$('#dietFeeTable tbody .end-tr').before(html);
		$('#dietFeeTable tbody .costTotal').text(pay.fmMoney(total));
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
				'<td class="moneyText sum-pay">' + pay.fmMoney(n.perTaxAmount) + '</td>' +
				'<td class="moneyText after">' + pay.fmMoney(n.afterTaxAmount) + '</td>' +
				'<td class="moneyText avg">' + pay.fmMoney(n.averageMoney) + '</td>' +
				'<td style="display:none"><input type="hidden" class="popM" value="1"/>' +
				'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
				'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
				'</td></tr>';
			total += +n.perTaxAmount;
		});
		//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + pay.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + pay.fmMoney(totalTraffic) + '</td></tr>';
		$('#lectureFeeTable tbody .end-tr').before(html);
		$('#lectureFeeTable tbody .costTotal').text(pay.fmMoney(total));
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
				'<td class="moneyText sum-pay">' + pay.fmMoney(n.carfare) + '</td>' +
				'<td style="text-align: left !important;" class="dec">' + n.remarks + '</td>' +
				'<td  style="display:none"><input type="hidden" class="popM" value="2"/>' +
				'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
				'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
				'</td></tr>';
			total += +n.carfare;
		});
		//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + pay.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + pay.fmMoney(totalTraffic) + '</td></tr>';
		$('#carFeeTable tbody .end-tr').before(html);
		$('#carFeeTable tbody .costTotal').text(pay.fmMoney(total));
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
			html += '<tr pid="' + n.teachersHotelId + '">' +
				'<td class="name"><input type="hidden" class="lectureId" value="' + n.lecturerId + '">' + n.lecturerName + '</td>' +
				'<td class="sdate">' + n.startTime + '</td>' +
				'<td class="edate">' + n.endTime + '</td>' +
				'<td class="moneyText avg">' + pay.fmMoney(n.averageMoney) + '</td>' +
				'<td class="day">' + n.hotelDays + '</td>' +
				'<td class="moneyText sum-pay">' + pay.fmMoney(n.hotelExpense) + '</td>' +
				'<td style="text-align: left !important;" class="dec">' + n.remarks + '</td>' +
				'<td style="display:none"><input type="hidden" class="popM" value="3"/>' +
				'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
				'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
				'</td></tr>';
			total += +n.hotelExpense;
		});
		//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + pay.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + pay.fmMoney(totalTraffic) + '</td></tr>';
		$('#hotelFeeTable tbody .end-tr').before(html);
		$('#hotelFeeTable tbody .costTotal').text(pay.fmMoney(total));
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
		//设置收款方类型的下拉
		var opts = '<option value="">请选择</option>';
		if(data.gatheringUnitList && data.gatheringUnitList.length > 0){
			//单位类型
			opts += '<option value="GATHERING_UNIT">单位</option>';
		}
		if(data.gatheringPersonList && data.gatheringPersonList.length > 0){
			//个人类型
			opts += '<option value="GATHERING_PERSON">个人</option>';
		}
		if(data.gatheringOtherList && data.gatheringOtherList.length > 0){
			//其他类型
			opts += '<option value="GATHERING_OTHER">其他</option>';
		}
		
		$('#firstSelect').empty().append(opts).niceSelect();
		
	},
	/**
	 * 收款信息 单位列表数据详情
	 * @param {Object} list
	 */
	setGatheringUnitList: function(list) {
		var html = '';
		$.each(list, function(i, n) {
			html += '<tr class="payee-unit-tr" companyName="' + n.unitName + '" openBank="' + n.openBank + '" accountNumber="' + n.accounts + '" companyMoney="' + n.amount + '" contractRadio="' + n.isContract + '" companySpecial="' + n.remarks + '">' +
				'<td class="com" pid="'+n.unitId+'" value="Company">' + n.unitName + '</td>' +
				'<td style="text-align: left;">' + n.openBank + '</td>' +
				'<td style="text-align: left;">' + n.accounts + '</td>' +
				'<td style="text-align: right;" class="unitTotal">' + (pay.fmMoney(n.amount)) + '</td>' +
				'<td value="' + n.isContract + '">' + (n.isContract == '1' ? '是' : '否') + '</td>' +
				'<td>' + n.remarks + '</td>' +
				'</tr>';
		});
		$('table.payee-unit tbody .payee-unit-total').before(html);
		//					获取合计
		pay.companyTotal();
	},
	/**
	 * 收款信息 个人列表数据详情
	 * @param {Object} list
	 */
	setGatheringPersonList: function(list) {
		var html = '';
		$.each(list, function(i, n) {
			html += '<tr class="payee-personal-tr" payeeName="' + n.personalName + '" idCarkno="' + n.idCard + '" payeeMoney="' + n.amount + '" payeeBank="' + n.accounts + '" bankName="' + n.openBank + '" phoneNum="' + n.phoneNum + '" payeeRadio="' + n.isContract + '" personalSpecial="' + n.remarks + '">' +
				'<td class="per" pid="'+n.personalId+'" value="personal">' + n.personalName + '</td>' +
				'<td>' + n.idCard + '</td>' +
				'<td style="text-align: right;" class="personalTotal">' + (pay.fmMoney(n.amount)) + '</td>' +
				'<td>' + n.accounts + '</td>' +
				'<td>' + n.openBank + '</td>' +
				'<td>' + n.phoneNum + '</td>' +
				'<td>' + (n.isContract == '1' ? '是' : '否') + '</td>' +
				'<td>' + n.remarks + '</td>' +
				'</tr>';

		});
		$('table.payee-personal tbody .payee-personal-total').before(html);
		//					获取合计
		pay.personalTotal();
	},
	/**
	 * 收款信息 其他列表数据详情
	 * @param {Object} list
	 */
	setGatheringOtherList: function(list) {
		var html = '';
		$.each(list, function(i, n) {
			html += '<tr class="payee-other-tr" otherMoney="' + n.otherName + '" otherAllMoney="' + n.amount + '" otherRadio="' + n.isContract + '" otherSpecial="' + n.remarks + '">' +
				'<td class="oth" pid="'+n.otherId+'" value="Other">' + n.otherName + '</td>' +
				'<td style="text-align: right;" class="otherTotal">' + (pay.fmMoney(n.amount)) + '</td>' +
				'<td>' + (n.isContract == '1' ? '是' : '否') + '</td>' +
				'<td>' + n.remarks + '</td>' +
				'</tr>';
		});
		$('table.payee-other tbody .payee-other-total').before(html);
		//					获取合计
		pay.otherTotal();
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
					'<td class="ordinar-name" style="text-align: left !important;">'+ n.normalName + '</td>' +
					'<td class="payDet-money" style="text-align: right;">' + (pay.fmMoney(n.normalAmount)) + '</td>' +
					'</tr>';
				total += +n.normalAmount;
			});
			$('.ordinary-payment-approval #paymentDetailedTable tbody .pay-detail-tabel-total').before(html);
			$('.ordinary-payment-approval #paymentDetailedTable tbody .total-money').text(pay.fmMoney(total));
	},
	/**
	 * 显示支付明细数据
	 * @param {Object} list
	 */
	setPayDetailList:function(list){
		var html = '';
		var total = 0;
		$('.pay-detail-tabel tbody tr:not(.pay-detail-tabel-total)').remove();
		$.each(list, function(i, n) {
			html += '<tr pid="'+n.receivablesId+'" type="'+n.receivablesType+'" payee="' + n.receivablesId + '" payment="' + n.paymentDate + '" paymentmoney="' + n.paymentAmount + '">' +
						' <td class="payee" style="width: 100px;">' + n.receivablesName + '</td>' +
						' <td class="payment" style="width: 100px;">' + n.paymentDate + '</td>' +
						' <td class="paymentmoney" style="text-align: right;">' + pay.fmMoney(n.paymentAmount) + '</td></tr>';
			total += +n.paymentAmount;
		});
		$('.pay-detail-tabel .pay-detail-tabel-total').before(html);
		$('.pay-detail-tabel .payee-other-total-money').text(pay.fmMoney(total));
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
		//me.updateApplyMeonySum();
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
		sumMoney = $yt_baseElement.fmMoney(sumMoney);
		$(".count-val-num").text(sumMoney).attr('num', sumMoney);
		//判断当前页面是否包含报销申请页面中,补领金额中的报销金额
		if($("body").find("#reimPrice")) {
			$("#reimPrice").text(sumMoney);
			//计算补领金额
			var loanPrice = $("#loanCost").text();
			var replPrice = $yt_baseElement.rmoney(sumMoney) - parseFloat(loanPrice);
			replPrice = $yt_baseElement.fmMoney(replPrice);
			$("#givePrice").text(replPrice);
		}
		if(sumMoney != null && sumMoney != undefined && $yt_baseElement.rmoney(sumMoney) > 0) {
			var sumMoneyLower = arabiaToChinese(sumMoney);
			$(".count-val").text(sumMoneyLower);
		} else {
			$(".count-val-num").text("0.00");
		}
	},
	/**
	 * 获取付款明细jison数据
	 */
	payDetailList:function(){
		var list = [];
		var tr = [];
		$('table.pay-detail-tabel tbody tr:not(.pay-detail-tabel-total)').each(function(i, n) {
			tr = $(n);
			list.push({
				receivablesId:tr.attr('payee'),//receivablesId	收款方Id
				receivablesType:tr.attr('type'),//receivablesType	收款方类型
				paymentDate:tr.attr('payment'),//paymentDate	支付时间
				paymentAmount:pay.rmoney(tr.attr('paymentmoney')),//paymentAmount	支付金额
			});
			
		});
		return JSON.stringify(list);
	},
	/**
	 * 1.1.8.5	支付明细列表
	 * @param {Object} appId
	 */
	getPaymentAmountInfoList:function(appId){
		$.ajax({
			type:"post",
			url:"sz/payDetailBillingVoucher/getPaymentAmountInfoList",
			async:true,
			data:{
				appId:appId
			},
			success:function(data){
				if(data.flag == 0){
					var d = data.data;
					$('#mustMoney').text(pay.fmMoney(d.totalAmount));//totalAmount	应付款金额
					var paymentAmount = d.paymentAmount;//paymentAmount 已付款金额
					$('#alreadyMoney').text(pay.fmMoney(paymentAmount));
					var paymentBalanceAmount = d.paymentBalanceAmount;//paymentBalanceAmount 未付款金额
					$('#notMoney').text(pay.fmMoney(paymentBalanceAmount));
					var payDetailList = d.payDetailList || [];//payDetailList 支付明细列表
					pay.setPayDetailList(payDetailList);
				}
				
			}
		});
	}
};
$(function() {
	$("#budgetProject").niceSelect();
	$("#typeselect").niceSelect();
	$("#operate-flow").niceSelect();
	$("#approve-users").niceSelect();
	$("#firstSelect").niceSelect();
	
	//获取修改参数
	var pid =$yt_common.GetQueryString('payAppId');
	if(pid) {
		//参数存在时获取对应的详情数据
		pay.getPayAppInfoByPayAppId(pid);
	}
	
	pay.alertpay();
	pay.hidepayalert();
	pay.hidetallyalert();
	pay.getpaydata();
	pay.alerttally();
	pay.Moneyfocus();
	pay.Moneyfocusdetail();
	pay.submitPayment();
	pay.deltally();
	pay.updatatally();
	pay.updatatallycarry();
	pay.clearexamine();
	pay.selectCheck();
	//ajax调用区域
	pay.getInformationajax();
	pay.getLectorajax();
	pay.gettrainMoneyajax();
	pay.getlectureMoneyajax();
	pay.gettrafficMoneyajax();
	pay.getaccommodationMoneyajax();
	pay.getfoodMoneyajax();
})