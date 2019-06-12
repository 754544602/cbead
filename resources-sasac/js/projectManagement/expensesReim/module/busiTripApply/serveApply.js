(function($, window) {
	var ordernumber = 0;
	var serveApply = {
		addressList: "", //全局的地区数据
		selUsersName: "", //用户名
		selUsersCode: "", //用户code
		usersInfoList: "", //出差人集合
		usersInfoJson: "", //出差人json
		beforeCostList: [],//历史预算单详细数据
		riskExcMark: "../../../../../resources-sasac/images/common/war-red.png", //风险感叹号图片
		riskWarImg: "../../../../../resources-sasac/images/common/risk-war.png", //风险未通过图片红灯
		riskViaImg: "../../../../../resources-sasac/images/common/risk-via.png", //风险通过图片绿灯

		/**
		 * 开始执行
		 */
		init: function() {
			var ts = this;
			//获取修改参数
			var pid = $yt_common.GetQueryString('advanceId');
			if(pid) {
				//参数存在时获取对应的详情数据
				ts.getAdvanceAppInfoDetailByAdvanceAppId(pid);
			} else {
				//获取费用类型
				ts.getCostTypeList();
				//默认加载培训
				ts.showTrainFun();
//				$('.label-title.item .title-text').text('事前申请事项信息');
//				$('.label-title.cost .title-text').text('事前申请费用信息');
			}

			//控件初始化
			ts.start();
			//获取当前登录用户信息
			sysCommon.getLoginUserInfo();
			//申请人code
			$(".applicantUser").val($yt_common.user_info.userName);
			//调用获取审批流程数据方法
			sysCommon.getApproveFlowData("SZ_ADVANCE_APP");
			ts.getCostActivityPro();
			ts.getSpectificCostType();
			//出差地点
			ts.setAddress();
			//其他事件处理
			ts.events();
			//差旅费用相关事件
			ts.costApplyAlertEvent();
			//调用公用的差旅报销明细填写Tab页切换事件方法
			sysCommon.costDetailModelTabEvent();

			//附件上传
			ts.uploadFile();

		},
		/**
		 * 初始化组件
		 */
		start: function() {
			//数字文本框
			$yt_baseElement.numberInput($(".yt-numberInput-box"));
			$('select').niceSelect();
		},
		/**
		 * 事件处理
		 */
		events: function() {
			var me = this;
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
			//给人民币大写赋值
			/*$("#serveAllMoney").change(function(){
				$("#TotalMoneyUpper").text(arabiaToChinese($("#serveAllMoney").text()));
				console.log($("#serveAllMoney").text());
			});*/
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
			//新增明细
			$('#addExpense').on('click', function() {
				me.showPaymentAlert();
				$('#paymentAddBtn').off().on('click', function() {
					me.appendPaymentList();
				});
			});

			$("#budgetMoney").on("blur", function() {
				if($(this).val() != "") {
					//调用格式化金额方法  
					$(this).val($yt_baseElement.fmMoney($(this).val()));
				}
			});

			/** 
			 * 金额文本框获取焦点事件 
			 */
			$("#bzy-span,#budgetMoney").on("focus", function() {
				if($(this).val() != "") {
					//调用还原格式化的方法  
					$(this).val($yt_baseElement.rmoney($(this).val()));
				}
			});

			//显示弹出框
			$('.add-msg').click(function() {
				me.showMsgAlert();
				$('#LpaymentAddBtn').off().on('click', function() {
					/** 
					 * 调用验证方法 
					 */
					var isNull = $yt_valid.validForm($("#addObjInfo"));
					if(isNull) {
						me.appendMsgList();
					}
				});
			});
			//取消
			$('#paymentCanelBtn').click(function() {
				//隐藏
				me.hideMsgAlert();
				//清空
				me.clearAlert($('#createDetali'));
			});
			/** 
			 * 金额文本框失去焦点事件 
			 */
			$("#bzy-span").on("blur", function() {
				if($(this).val() != "") {
					//调用格式化金额方法  
					$(this).val($yt_baseElement.fmMoney($(this).val()));
				}
			});
			$('#getvalue').change(function() {
				//获取费用类型
				var name = $('#getvalue option:selected').text();
				//替换余额字段内容
				$('.special-label').text(name + '余额：');
			});
			//是否为专项切换
			$('.special-type').change(function() {
			
				var val = $(this).val();

				var yesno = '';
				if(val == '2') {
					$('.special-yes').hide();
					$('.special-no').show();
					//获取费用类型
					var name = $('#getvalue option:selected').text();
					//替换余额字段内容
					$('.special-label').text(name + '余额：');
					var yesno = '否';

				} else {
					$('.special-yes').show();
					$('.special-no').hide();
					var yesno = '是';
				}
			});
			//删除费用明细
			$('#paymentList').on('click', '.operate-del', function() {
				var ithis = $(this);
				var tr = ithis.parents('tr');
				$yt_alert_Model.alertOne({
					alertMsg: "数据删除将无法恢复,确认删除吗?", //提示信息  
					confirmFunction: function() { //点击确定按钮执行方法  
						tr.remove();
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
						$('.count-val-num').text(fmTotal);
						//大写转换
						$('.count-val').text(arabiaToChinese(fmTotal + ''));
					}
				});
			});
			//删除接待对象
			$('#targetList').on('click', '.receive-del', function() {
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

			//编辑对象信息
			$('#targetList').on('click', '.receive-update', function() {
				var ithis = $(this);
				var tr = ithis.parents('tr');

				//显示弹框及蒙层
				$yt_baseElement.showMongoliaLayer();
				$yt_alert_Model.getDivPosition($('#createDetali'));
				$('#pop-modle-alert').show();
				$('#createDetali').show();

			});
			//修改关闭
			$('#paymentCanelBtn').on('click', function() {
				//关闭弹框及蒙层
				$yt_baseElement.hideMongoliaLayer();
				$('#createDetali').hide();
				$('#pop-modle-alert').hide();
			});
			//修改关闭2
			$('#GpaymentCanelBtn').on('click', function() {
				//关闭弹框及蒙层
				$yt_baseElement.hideMongoliaLayer();
				$('#createExpense').hide();
				$('#pop-modle-alert').hide();
				me.clearAlert($('.create-detali'));
			});
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
				var code = $('.special-list .yt-table-active').attr('code');
				var codeName = $('.special-list .yt-table-active').find('td').eq(1).text();
				var codeMon = $('.special-list .yt-table-active').find('td').eq(2).text();
				if(code) {
					$('#codeMon').text(codeMon);
					$('.prior-approval').val(codeName);
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
			//费用类型切换
			$('.docu-style-box').on('change', '.docu-style', function() {
				var fun = $(this).attr('fun');
				if(fun) {
					$('.qtip-text-div').hide();
					$('.mod-div').hide();
					//执行相应的显示方法
					me[fun]();
					$('.dottom-div').show();
					$('.grod-div').show();
				} else {
					$('.qtip-text-div').show();
					$('.mod-div').hide();
					$('.dottom-div').hide();
					$('.grod-div').hide();
				}

				$('.label-title.item .title-text').text('事前申请事项信息');
				$('.label-title.cost .title-text').text('事前申请费用信息');
			});

			//调用表格行点击事件改变背景色方法  
			$yt_baseElement.tableRowActive();

			//点击取消
			$('#inputcancel').click(function() {			
				//清空
				$('#askinput').val('');
			});

			//重置按钮
			$('#resetting').click(function() {
				$('#askinput').val('');

			});

			//编辑对象信息
			$('#targetList').on('click', '.receive-update', function() {
				var ithis = $(this);
				var tr = ithis.parents('tr');

				//数据回显
				var objId = tr.attr('pkid');
				//姓名
				var applyName = $('#applyName').val(tr.attr('applyName'));
				//职务
				var Duties = $('#Duties').val(tr.attr('Duties'));
				//单位
				var Unit = $('#Unit').val(tr.attr('Unit'));
				//显示弹框
				me.showMsgAlert();
				//重置按钮
				$('#LpaymentAddBtn').off().on('click', function() {
					var isNull = $yt_valid.validForm($("#addObjInfo"));
					if(isNull) {
						me.appendMsgList(tr, objId);
					}
				});
			});

			$('#paymentList').on('click', '.operate-update', function() {
				var ithis = $(this);
				var tr = ithis.parents('tr');

				//公务活动项目
				var budgetProject = $('#budgetProject option[value="' + tr.attr('pcode') + '"]').attr('selected', true);
				//日期
				var txtDate = $('#txtDate').val(tr.attr('txtDate'));
				//场所
				var place = $('#place').val(tr.attr('place'));
				//费用明细
				var costBreakdown = $('#costBreakdown option[value="' + tr.attr('tcode') + '"]').attr('selected', true);
				//标准
				var bzyspan = $('#bzy-span').val($yt_baseElement.fmMoney(tr.attr('bzy-span')));
				//金额
				var budgetMoney = $('#budgetMoney').val($yt_baseElement.fmMoney(tr.attr('budgetMoney')));
				//转换金额格式
				//var numMoney = $yt_baseElement.rmoney(budgetMoney);
				//陪同人数
				var peoplenum = $('#peoplenum').val(tr.attr('peoplenum'));

				$('#budgetProject,#costBreakdown').niceSelect();
				//显示弹框
				me.showPaymentAlert();

				$('#paymentAddBtn').off().on('click', function() {
					//编辑方法
					me.appendPaymentList(tr);
				});
			});
			$("#cancelBtn").off().on('click', function() {
				window.history.back(-1);
			});
			//清除历史预算信息选中
			$('.clear-historical-approval').on('click', function() {
				//显示提示信息
				$yt_alert_Model.alertOne({
					alertMsg: '变更历史预算单后，从历史预算单导入的数据将清空是否确定变更预算单？',
					confirmFunction: function() {
						//事前申请单号
						$('.historical-approval').val('');
						//赋值id
						$('#advanceAppId').val('');
						//隐藏导入按钮
						$('.index-main-div .export-but').hide();
						//清空已导入的数据
						me.clearPriorApproval();
						//隐藏清除按钮
						$('.clear-historical-approval').hide();
						//导入按钮设置可用
						$('#trainDetails,#exportLecturer,#exportCostApp,#exportPredictCost,#importTrainingOther').attr("disabled",false);
					}
				});
			});
			//申请事由联动效果
			$("#advanceAppReason").on("blur",function(){
				var value = $(this).val();
				//项目名称
				$("#prjName").val(value);
				//培训名称
//				$("#regionDesignation").val(value);
			});
			
			//			advanceAppId 主表id
			//			advanceAppNum 事前申请单号
			//			advanceAppReason 事前申请事由
			//			costType 费用类型
			//			isSpecial 是否为专项
			//			specialCode 专项名称
			//			applicantUser 申请人code
			//			parameters JSON格式字符串,
			//			dealingWithPeople 下一步操作人code
			//			opintion 审批意见
			//			processInstanceId 流程实例ID,
			//			nextCode 操作流程代码
			//			costData 费用申请json串
			//			advanceAttIdStr 附件idstr
			
			//提交申请事件
			me.setSubmitEvent();
			//保存申请事件
			me.setSaveEvent();
			//选择历史预算信息事件
			me.historicalApprovalEvent();
			//初始化导入按钮
			me.showImportFun();
		},
		/**
		 * 提交申请
		 */
		setSubmitEvent:function(){
			var me = this;
			//生成事前申请
			$('#getPayment').on('click', function() {
				//获取支出金额
				var budgetMoney = "";
				//验证提示语句
				var validMsg = "";
				var applyTotalMoneyAmount = $yt_baseElement.rmoney($("#applyTotalMoney").text());
				/**
				 * 
				 *需要判断选择的所属项目是,基本支出DEPT还是项目支出UNIT
				 *
				 */
				var lastSelectIndex = $(".budget-items .nice-select:visible").length - 1;
				if($(".budget-items select").eq(lastSelectIndex).find("option:selected").attr("valid-type") == "DEPT") {
					//获取部门预算可用余额
					budgetMoney = $("#deptBudgetBalanceAmountHidden").val() * 10000;
					validMsg = "部门预算可用余额小于当前申请的金额，请调整申请内容，或先保存页面信息，待部门预算调整后再重新提交申请。";
				}
				if($(".budget-items select").eq(lastSelectIndex).find("option:selected").attr("valid-type") == "UNIT") {
					//获取单位预算可用余额
					budgetMoney = $yt_baseElement.rmoney($('#budgetBalanceAmount').text().replace('万元', '')) * 10000;
					validMsg = "中心预算可用余额小于当前申请的金额，请调整申请内容，或先保存页面信息，待单位预算调整后再重新提交申请。";
				}
				if(applyTotalMoneyAmount > budgetMoney){
					$yt_alert_Model.alertOne({  
				        haveCloseIcon: true, //是否带有关闭图标  
				        leftBtnName: "确定", //左侧按钮名称,默认确定  
				        cancelFunction: "", //取消按钮操作方法*/  
				        alertMsg: validMsg, //提示信息  
				        cancelFunction: function() { //点击确定按钮执行方法  
				        },  
				    });  
				}else{
					var thisBtn = $(this);
					var verifyBudgetExpendSum = me.verifyBudgetExpendSum();
					if($yt_valid.validForm($('.base-info-form-modle,.grod-div,.verify-div')) && verifyBudgetExpendSum) {
						//禁用生成按钮
						thisBtn.off();
						var d = me.getJsonVal();
						me.submitAdvanceAppInfo(d, thisBtn);
					} else {
						sysCommon.pageToScroll($("body .valid-font"));
						//撤销禁用
						thisBtn.attr('disabled', false).removeClass('btn-disabled');
					}
				}
			});
		},
		/**
		 * 保存申请
		 */
		setSaveEvent:function(){
			var me = this;
			//保存事前申请
			$('#saveask').on('click', function() {
				var thisBtn = $(this);
				//禁用保存按钮
				thisBtn.off();
				var d = me.getJsonVal();
				me.saveAdvanceAppInfoToDrafts(d, thisBtn);
			});
		},
		/**
		 * 选择事前审批单相关事件
		 */
		historicalApprovalEvent: function() {
			var me = this;
			//弹出框显示
			$('.historical-approval').click(function() {
				//获取数据
				me.getHistoricalApprovalList();
				//显示弹框及蒙层
				$yt_baseElement.showMongoliaLayer();
				$yt_alert_Model.getDivPosition($('.historical-alert'));
				$('#pop-modle-alert').show();
				$('.historical-alert').show();
			});
			//确定事件
			$('.historical-common').click(function() {
				//选中行的对象
				var tr = $('.historical-approval-list .yt-table-active');
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
				var thisVal = $('.historical-approval').val();
				if(thisVal && thisVal != code) {
					//提示信息
					$yt_alert_Model.alertOne({
						alertMsg: "变更历史预算单后，从历史预算单导入的数据将清空是否确定变更预算单？", //提示信息  
						confirmFunction: function() { //点击确定按钮执行方法  
							if(code) {
								//清空导入数据
								me.clearPriorApproval();
								//赋值事前申请单号  清除验证样式及内容
								$('.historical-approval').val(code).attr('costType', types).removeClass('valid-hint').nextAll().find('.valid-font').text('');
								//赋值id
								//$('#advanceAppId').val(id);
								//隐藏弹框及蒙层
								$yt_baseElement.hideMongoliaLayer();
								$('.historical-alert').hide();
								$('#pop-modle-alert').hide();
								//显示清除按钮
								$('.clear-historical-approval').show();
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
						me.getHistoricalAdvanceAppInfoDetailByAdvanceAppId(id);
						//赋值事前申请单号  清除验证样式及内容
						$('.historical-approval').val(code).attr('costType', types).removeClass('valid-hint').nextAll().find('.valid-font').text('');
						//赋值id
						//$('#advanceAppId').val(id);
						//隐藏弹框及蒙层
						$yt_baseElement.hideMongoliaLayer();
						$('.historical-alert').hide();
						$('#pop-modle-alert').hide();
						//显示清除按钮
						$('.clear-historical-approval').show();
						//成功后显示导入按钮.index-main-div 
						$('.export-but').show();
						//清空事前申请单输入框验证提示信息
						$(".historical-approval").parent().find(".valid-font").text('');
					} else {
						$yt_alert_Model.prompt('请选择一条数据');
					}
				}
			});		

			//取消事件
			$('.historical-cancel,.historical-alert .closed-span').click(function() {
				//隐藏弹框及蒙层
				$yt_baseElement.hideMongoliaLayer();
				$('.historical-alert').hide();
				$('#pop-modle-alert').hide();
				//清空
				$('.historical-approval-val').val('');
				//获取数据
//				me.getHistoricalApprovalList();
			});

			//查询按钮
			$('.historical-approval-search').click(function() {
				//获取数据
				me.getHistoricalApprovalList();
			});

			//重置按钮
			$('.historical-approval-reset').click(function() {
				$('.historical-approval-val').val('');
				//获取数据
				me.getHistoricalApprovalList();
			});

		},
		/**
		 * 获取历史预算单列表
		 */
		getHistoricalApprovalList: function() {
			//表格区域
			var tbody = $('.historical-approval-list tbody');
			var queryParams = $('.historical-approval-val').val();
			//费用类型
			var costType = $('.docu-style-box .check input').val();
			//分页区域
			var pageDiv = $('.historical-page');
			$('.historical-page').pageInfo({
				pageIndex: 1,
				pageNum: 5, //每页显示条数  
				pageSize: 3, //显示...的规律  
				url: "sz/advanceApp/getAdvanceAppListToPageByParams", //ajax访问路径  
				objName: 'data',
				data: {
					type: 'FINAL_APP',
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
		 * 1.1.4.5	根据历史项目预算单Id获取报销申请详细信息   
		 * 导入项目预算单用
		 * @param {Object} id
		 */
		getHistoricalAdvanceAppInfoDetailByAdvanceAppId: function(id, upDate) {
			$.ajax({
				type: "post",
				url: "sz/advanceApp/getHistoricalAdvanceAppInfoDetail",
				async: true,
				data: {
					advanceAppId: id
				},
				success: function(data) {
					//保存查询成功的事前数据
					if(data.flag == 0) {
						data.data.advanceAppId='';
						data.data.nodeNowState='';
						data.data.workFlowState='';
						data.data.currentAssignee='';
						data.data.historyAssignee='';
						serveApply.beforeCostList = data.data;
					}
				}
			});

		},
		/**
		 * 清除导入的事前申请单数据
		 */
		clearPriorApproval: function() {
			$('#trainDetails,#exportLecturer,#exportCostApp,#exportPredictCost,#importTrainingOther').attr("disabled",false);
			//先删除列表中导入的数据
			$('#indexMainDiv table tr.exports').remove();
			$('#meetingClassification.exports option:first-child').attr('selected', 'selected');
			$('#meetingClassification.exports').removeClass('exports').niceSelect();
			$('#regionDesignation.exports,#regionName.exports,#startTimeTop.exports,#endTimeTop.exports,#calculationSession.exports,#trainOfNum.exports,#workerNum.exports,#approvaNum.exports,#chargeStandard.exports').val('').removeClass('exports');
			
			var predictSum = 0;
			$("#predictCostTable tbody tr:not(.last)").each(function() {
				var thisObj = $(this);
				predictSum += $yt_baseElement.rmoney(thisObj.find(".sum-pay").text());
			});
			$("#predictCostTable .costTotal").text($yt_baseElement.fmMoney(predictSum));
			var lectureSum = 0;
			$("#lectureFeeTable tbody tr:not(.end-tr)").each(function() {
				var thisObj = $(this);
				lectureSum += $yt_baseElement.rmoney(thisObj.find(".sum-pay").text());
			});
			$("#lectureFeeTable .costTotal").text($yt_baseElement.fmMoney(lectureSum));
			$("#lectureFeeTable .costTotal-after").text($yt_baseElement.fmMoney(lectureSum));
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
		},
		showImportFun: function(){
			var me = this;
			//导入培训信息
			$('#trainDetails').click(function() {
				var thisBtn = $(this);
				//禁用按钮
				//thisBtn.off();
				thisBtn.attr("disabled",true);
				//取得保存的历史预算数据
				var list = me.beforeCostList.costData.trainApplyInfoList;
				//导入到列表中
				me.setTrainApplyInfoList(list, true);
			});
			//导入讲师信息
			$('#exportLecturer').click(function() {
				var thisBtn = $(this);
				//禁用按钮
				//thisBtn.off();
				thisBtn.attr("disabled",true);
				//取得保存的历史预算数据
				var list = me.beforeCostList.costData.teacherApplyInfoList;
				//导入到列表中
				me.setTeacherApplyInfoList(list, true);
			});
			//导入培训费用明细
			$('#exportCostApp').click(function() {
				var thisBtn = $(this);
				//禁用按钮
				//thisBtn.off();
				thisBtn.attr("disabled",true);
				//取得保存的事前申请数据
				var data = me.beforeCostList.costData;
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
			});
			//导入预计收入费用明细
			$('#exportPredictCost').click(function() {
				var thisBtn = $(this);
				//禁用按钮
				//thisBtn.off();
				thisBtn.attr("disabled",true);
				//取得保存的事前申请数据
				var data = me.beforeCostList.costData;
				//导入到列表中
				me.setCostPredictInfoList(data.costPredictInfoList, true);
				//计算总金额
				personnelFunds.updateTotalNum();
			});
			//导入培训费用明细
			$('#importTrainingOther').click(function() {
				var thisBtn = $(this);
				//禁用按钮
				//thisBtn.off();
				thisBtn.attr("disabled",true);
				//取得保存的事前申请数据
				var data = me.beforeCostList.costData;
				//导入到列表中
			
				//costTrainApplyInfoList	师资-培训费json
				me.setCostTrainApplyInfoList(data.costTrainApplyInfoList, true);
				//计算总金额
				personnelFunds.updateTotalNum();

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
						var attaElement = $('<div fId="' + data.data.pkId + '" class="li-div"><span>' + data.data.naming + '</span><span class="del-file">x</span></div>');
							ithisParent.append(attaElement);
							$('#'+fileElementId).val('');
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

		getJsonVal: function() {
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
					teacherApplyInfoList: me.teacherApplyInfoList(), //teacherApplyInfoList	师资-讲师信息json
					costTrainApplyInfoList: me.costTrainApplyInfoList(), //costTrainApplyInfoList	师资-培训费json
					costPredictInfoList: me.costPredictInfoList(), //costPredictInfoList	预计收入费用json
					costTeachersFoodApplyInfoList: me.costTeachersFoodApplyInfoList(), //costTeachersFoodApplyInfoList	师资-伙食费json
					costTeachersLectureApplyInfoList: me.costTeachersLectureApplyInfoList(), //costTeachersLectureApplyInfoList	师资-讲课费json
					costTeachersTravelApplyInfoList: me.costTeachersTravelApplyInfoList(), //costTeachersTravelApplyInfoList	师资-城市间交通费json
					costTeachersHotelApplyInfoList: me.costTeachersHotelApplyInfoList(), //costTeachersHotelApplyInfoList	师资-住宿费 json
					costNormalList: me.costNormalList(), //costNormalList	普通报销-费用明细/普通付款-付款明细 json
					meetingList: me.meetingList(), //meetingList	会议详情json
					meetingCostList: me.meetingCostList(), //meetingCostList	会议费用详情
					projectBudgetList:me.projectBudgetList()//预算费用明细
				});
			};
			var getjsons = {
				advanceAppId: $("#advanceAppId").val(), //主表id
				advanceAppNum: $("#advanceAppNum").val(), //事前申请单号
				advanceAppReason: $("#advanceAppReason").val(), //事前申请事由
				costType : 'TRAIN_APPLY',//培训费
				doAdvanceAmount: $yt_baseElement.rmoney($("#doAdvanceAmount").text()|| '0'),//可用支出金额
				advanceAmount: $yt_baseElement.rmoney($(".count-val-num").text() || '0'), //申请预算总金额
				prjName: $('#prjName').val(),
				applicantUser: $(".applicantUser").val(), //申请人code
				parameters: '', //JSON格式字符串
				dealingWithPeople: $("#approve-users option:selected").val(), //下一步操作人code
				opintion: $(".textareaHQ").val(), //审批意见
				processInstanceId: $("#processInstanceId").val(), //流程实例ID
				nextCode: $("#operate-flow option:selected").val(), //操作流程代码
				costData: costData(), //费用申请json串
				advanceAttIdStr: me.getFileList() //附件idstr
			};
			return getjsons;
		},
		/*
		 * 预算费用明细
		 */
		projectBudgetList:function(){
			var list = [];
			$.each($('#lectureFeeTable tbody tr'), function(i,n) {
				list.push({
					costCode:$(n).find('.cost-code').val(),
					budgetCost:$yt_baseElement.rmoney($(n).find('.budget-cost').val()),
					accordingInstructions:$(n).find('.accordingInstructions').val()
				})
			});
			$.each($('#trainingFeeTable tbody tr'), function(i,n) {
				list.push({
					costCode:$(n).find('.cost-code').val(),
					budgetCost:$yt_baseElement.rmoney($(n).find('.budget-cost').val()),
					accordingInstructions:$(n).find('.accordingInstructions').val()
				})
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
				meetDays: +$('#calculationSession').text() || '0' + '', //meetDays 会期
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
					costReceptionistId: tr.attr('pkid'), //costReceptionistId	接待对象Id
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
					activityAmount: $yt_baseElement.rmoney(tr.find('.money').text() || '0'), //活动金额
					peopleNum: tr.find('.people-num').text(), //陪同人数
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
			//判断是否是培训费
			var list = [{
				trainType: $('.trainType').val(), //trainType	培训类型
				regionDesignation: $('#regionDesignation option:selected').text(), //regionDesignation	培训名称
				projectId: $('#regionDesignation').val(), //regionDesignation	培训名称
				reportTime: $('.reportTime').val(), //reportTime	报到时间
				endTime: $('.endTime').val(), //endTime	结束时间
				trainDays: +$('#calculationSession').text() || '0' + '', //trainDays	培训天数
				budgetTraineeSum: $('.trainOfNum').val(), //trainOfNum	培训人数
				reportDate:$("#startTimeTop").val(),	//报到时间
				outHospitalDate:$("#endTimeTop").val(),	//离院时间
				isOffSiteTraining:$('.is-off-site-training:checked').val(),//	是否异地培训
				offSiteTrainingRequirement:$('.offsite-training-requirement').val(),//	异地培训特殊要求
				costStandard:$('.cost-standard:checked').val()//	适用成本标准
			}];
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
					lecturerId: tr.find('.lectureId').val()//lecturerId	讲师Id
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
		 * costPredictInfoList	预计收入费用json
		 */
		costPredictInfoList: function() {
			var list = [];
			//获取列表
			var trs = $('#predictCostTable tbody tr:not(.last)');
			var tr = null;
			$.each(trs, function(i, n) {
				//单个tr
				tr = $(n);
				list.push({
					predictName: tr.find('.cost-name').text(), //predictName 费用名称
					predictStandardMoney: $yt_baseElement.rmoney(tr.find('.predict-standard-money').text()), //predictStandardMoney 标准
					predictPeopleNum: tr.find('.predict-people-num').text(), //predictPeopleNum 报道人数
					averageMoney: $yt_baseElement.rmoney(tr.find('.predict-smallplan-money').text()), //averageMoney 小计
					remark: tr.find('.special-instruct').text() //remark 特殊说明
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
					averageMoney: serveApply.rmoney(tr.find('.avg').text()), //averageMoney	人均消费
					foodOfDays: tr.find('.day').text(), //foodOfDays	用餐天数
					foodAmount: serveApply.rmoney(tr.find('.sum-pay').text()), //foodAmount	伙食费
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
					perTaxAmount: serveApply.rmoney(tr.find('.sum-pay').text()), //perTaxAmount	税前金额
					afterTaxAmount: serveApply.rmoney(tr.find('.after').text()), //afterTaxAmount	税后金额
					averageMoney: serveApply.rmoney(tr.find('.avg').text()), //averageMoney	税后每学时金额
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
					carfare: serveApply.rmoney(tr.find('.sum-pay').text()), //carfare	交通费
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
					hotelExpense: serveApply.rmoney(tr.find('.sum-pay').text()), //hotelExpense	住宿费
					averageMoney: serveApply.rmoney(tr.find('.avg').text()), //averageMoney	人均花销
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

			return list;
		},

		/**
		 * 获取事前审批单列表
		 */
		getPriorApprovalList: function() {
			//表格区域
			var tbody = $('.special-list tbody');
			//分页区域
			var pageDiv = $('.prior-page');
			$('.prior-page').pageInfo({
				pageIndex: 1,
				pageNum: 1, //每页显示条数  
				pageSize: 3, //显示...的规律  
				url: "sz/travelApp/getUserTravelAppListByParams", //ajax访问路径  
				objName: 'data',
				data: {},
				success: function(data) {
					tbody.empty();
					if(data.flag == 0) {
						var trStr = "";
						if(data.data.rows.length > 0) {
							//显示分页
							pageDiv.show();
							$.each(data.data.rows, function(i, n) {
								trStr += '<tr code="ZX201804011">' +
									'<td>ZX201804011</td>' +
									'<td>人工智能研发</td>' +
									'<td>10,000.00万元</td>' +
									'<td>8,500.00万元</td>' +
									'</tr>';
							});
							tbody.append(trStr);
						} else {
							//隐藏分页
							pageDiv.hide();
							var noTr = '<tr class="model-no-data-tr"><td colspan="2"><div class="no-data"><img src="../../../../../resources-sasac/images/common/no-data.png" alt=""></div></td></tr>';
							tbody.append(noTr);
						}
					}
				} //回调函数 匿名函数返回查询结果  
			});
		},

		appendPaymentList: function(tr) {

			var me = this;
			//公务活动项目
			var budgetProject = $('#budgetProject option:selected').text();
			//公务活动项目cod
			var budgetCode = $('#budgetProject option:selected').val();
			//日期
			var budgetdata = $('#txtDate').val();
			//场所
			var budgetchang = $('#place').val();
			//费用明细
			var budgetfei = $('#costBreakdown option:selected').text();
			//费用明细cod
			var budgetfeiCode = $('#costBreakdown option:selected').val();
			//标准
			var budgetbiao = $('#bzy-span').val();
			//金额
			var budgetMoney = $('#budgetMoney').val();
			//转换金额格式
			var numMoney = $yt_baseElement.rmoney(budgetMoney);
			//陪同人数
			var budgetpeople = $('#peoplenum').val();

			var BMoney = '';
			var html = '<tr Tcode="'
					+ budgetfeiCode
					+ '" Pcode="'
					+ budgetCode
					+ '" budgetProject="'
					+ budgetProject
					+ '" txtDate="'
					+ budgetdata
					+ '" place="'
					+ budgetchang
					+ '" costBreakdown= "'
					+ budgetfei
					+ '" bzy-span="'
					+ BMoney
					+ '" budgetMoney="'
					+ numMoney
					+ '" peoplenum="'
					+ budgetpeople
					+ '"> <td >'
					+ budgetProject
					+ '</td><td class="activityDate">'
					+ budgetdata
					+ '</td><td class="placeName">'
					+ budgetchang
					+ '</td> <td>'
					+ budgetfei
					+ '</td>'
					+ '<td style="text-align: right;" class="money" money='
					+ numMoney
					+ '>'
					+ budgetMoney
					+ '</td> <td class="peopleNum">'
					+ budgetpeople
					+ '</td> <td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td> </tr>';
			var isNull = $yt_valid.validForm($("#AddAppDetails"));
			if(isNull) {
				if(tr) {
					tr.replaceWith(html);
					//隐藏
					me.hidePaymentAlert();
				} else {
					$('#paymentList tbody .last').before(html);
				}
				//清空
				me.clearAlert($('#createExpense'));
				//获取所有的金额
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
				$('.count-val-num').text(fmTotal);
				console.log(fmTotal);
				//大写转换
				$('.count-val').text(arabiaToChinese(fmTotal + ''));
			}
		},
		showPaymentAlert: function() {
			//显示费用明细弹框及蒙层
			$yt_baseElement.showMongoliaLayer();
			$yt_alert_Model.getDivPosition($('#createExpense'));
			$('#pop-modle-alert').show();
			$('#createExpense').show();
		},
		showMsgAlert: function() {
			//显示对象信息弹框及蒙层
			$yt_baseElement.showMongoliaLayer();
			$yt_alert_Model.getDivPosition($('#createDetali'));
			$('#pop-modle-alert').show();
			$('#createDetali').show();
		},
		appendMsgList: function(tr, objId) {
			var me = this;

			//姓名
			var applyName = $('#applyName').val();
			//单位
			var Unit = $('#Unit').val();
			//职务
			var Duties = $('#Duties').val();
			if (tr) {
				tr
						.replaceWith('<tr pkId="'
								+ objId
								+ '" applyName="'
								+ applyName
								+ '" Duties="'
								+ Duties
								+ '" Unit="'
								+ Unit
								+ '"> <td class="order-number">1</td> <td class="name" style="width: 100px;">'
								+ applyName
								+ '</td> <td class="jobName" style="width: 100px;">'
								+ Duties
								+ '</td> <td class="DutiesName" style="text-align: left;">'
								+ Unit
								+ '</td> <td><span class="receive-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="receive-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td> </tr>');
				me.hideMsgAlert()
			} else {
				$('#targetList tbody')
						.append(
								'<tr pkId="" applyName="'
										+ applyName
										+ '" Duties="'
										+ Duties
										+ '" Unit="'
										+ Unit
										+ '"> <td class="order-number">1</td> <td class="name" style="width: 100px;">'
										+ applyName
										+ '</td> <td class="jobName" style="width: 100px;">'
										+ Duties
										+ '</td> <td class="DutiesName" style="text-align: left;">'
										+ Unit
										+ '</td> <td><span class="receive-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="receive-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td> </tr>')
			}
			//清空
			me.clearAlert($('.create-detali'));
			//重置序号
			me.resetNum($('.msg-list'));
		},
		hideMsgAlert: function() {
			$yt_baseElement.hideMongoliaLayer();
			$('#createDetali').hide();
			$('#pop-modle-alert').hide();
		},
		hidePaymentAlert: function() {
			$yt_baseElement.hideMongoliaLayer();
			$('#createExpense').hide();
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
			var inputs = obj.find('input:not(input[type="radio"],input[type="checkbox"])');
			inputs.val('');
			//单选
			var radios = obj.find('input[type="radio"]');
			$.each(radios, function(i, n) {
				$(n).setRadioState('uncheck');
			});
			//复选
			var checks = obj.find('input[type="checkbox"]');
			$.each(checks, function(i, n) {
				$(n).setCheckBoxState('uncheck');
			});
			//文本域
			var textareas = obj.find('textarea');

		},
		/**
		 * 1.1.2.2	事前申请信息：提交表单数据  业务部分
		 * @param {Object} data
		 */
		submitAdvanceAppInfo: function(d, thisBtn) {
			var me = this;
			$.ajax({
				type: "post",
				url: "sz/advanceApp/submitAdvanceAppInfo",
				async: true,
				data: d,
				success: function(data) {
					if(data.flag == 0) {
						d.appId = data.data;
						//提交业务流程
						me.submitWorkFlow(d, thisBtn);
					} else {
						//重新绑定提交事件
						me.setSubmitEvent();
					}
				}
			});
		},
		/**
		 * 1.1.2.1	事前申请信息：提交表单   流程部分
		 * @param {Object} d
		 * @param {Object} thisBtn
		 */
		submitWorkFlow: function(d, thisBtn) {
			var me = this;
			$.ajax({
				type: "post",
				url: "sz/advanceApp/submitWorkFlow",
				async: true,
				data: d,
				success: function(data) {
					if(data.flag == 0) {
						//成功跳转到事前申请审批列表页面
						var menUrl = 'view/projectManagement-sasac/expensesReim/module/approval/myApplyList.html';
            if (window.frames.length == parent.frames.length) {
              //跳转至我的申请页面
              $yt_baseElement.openNewPage(1,menUrl,menUrl);
              window.close();
            } else {
              //跳转至我的申请页面
              $yt_common.parentAction({
                url: $yt_option.parent_action_path, //父级中转地址,固定配置项,只有统一修改处理。  
                funName: 'locationToMenu', //指定方法名，定位到菜单方法  
                data: {
                  url: menUrl //要跳转的页面路径  
                }
              });
            }
					} else {
						//重新绑定提交事件
						me.setSubmitEvent();
					}
					//撤销禁用
					thisBtn.attr('disabled', false).removeClass('btn-disabled');
					$yt_alert_Model.prompt(data.message);
				}
			});

		},
		/**
		 * 事前申请信息：保存至草稿箱
		 * @param {Object} d
		 */
		saveAdvanceAppInfoToDrafts: function(d, thisBtn) {
			var me = this;
			$.ajax({
				type: "post",
				url: "sz/advanceApp/saveAdvanceAppInfoToDrafts",
				data: d,
				success: function(data) {
					if(data.flag == 0) {
						//成功跳转到事前申请审批列表页面
						$yt_common.parentAction({
							url: $yt_option.parent_action_path, //父级中转地址,固定配置项,只有统一修改处理。
							funName: 'locationToMenu', //指定方法名，定位到菜单方法
							data: {
								url: 'view/projectManagement-sasac/expensesReim/module/approval/draftsList.html' //要跳转的页面路径
							}
						});
					} else {
						//重新绑定事件
						me.setSaveEvent();
					}
					$yt_alert_Model.prompt(data.message);
				}
			});
		},
		/**
		 * 
		 * @param {Object} advanceAppId
		 */
		getAdvanceAppInfoDetailByAdvanceAppId: function(advanceAppId) {
			$.ajax({
				type: "post",
				url: " sz/advanceApp/getAdvanceAppInfoDetailByAdvanceAppId",
				async: true,
				data: {
					advanceAppId: advanceAppId
				},
				success: function(data) {
					var d = data.data;
					
					//申请人填报
					if(d.taskKey == 'activitiStartTask') {
						//删除保存按钮
						$('#saveask').remove();
					}
					serveApply.setformdata(d);
					var afterTaxAllMoney = $yt_baseElement.rmoney($("#predictCostTable .costTotal").text());
					var vatSalesTax=afterTaxAllMoney*0.03;
					$("#vatSalesTax").text($yt_baseElement.fmMoney(vatSalesTax || '0')).attr('num', vatSalesTax);
					var surtax=vatSalesTax*0.12;
			$("#surtax").text($yt_baseElement.fmMoney(surtax || '0')).attr('num', surtax);

				}
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
					formAppCode: 'ADVANCE_APP'
				},
				success: function(data) {
					//获取数据list
					var list = data.data || [];
					//初始化HTML文本
					var opts = '';
					//循环添加文本
					$.each(list, function(i, n) {
					
						if(n.costCode=='TRAIN_APPLY'){
							opts += '<span >' + n.costName
								+ '</span>';
						}
					});
					//替换页面代码
					$('.docu-style-box').append(opts);
				}
			});
		},
		/**
		 * 1.2.1.2	
		 */
		getCostActivityPro: function() {
//			$.ajax({
//				type: "post",
//				url: "basicconfig/dictInfo/getDictInfoByTypeCode",
//				async: true,
//				data: {
//					dictTypeCode: 'ACTIVITY_PRO,SPECIFIC_COST_TYPE,TRAVEL_TYPE,VEHICIE_CODE,HOTEL_ADDRESS,COST_TYPE'
//				},
//				success: function(data) {
//					//获取数据list
//					var list = data.data || [];
//					//初始化HTML文本
//					var start = '<option value="">请选择</option>', optone = start, opttwo = start, travelType = start, vehicieCode = start, hotel = start, cost = start;
//				
//					//循环添加文本
//					$.each(list, function(i, n) {
//						if(n.dictTypeCode == 'ACTIVITY_PRO') {
//							//公务活动项目
//							optone += '<option value="' + n.value + '">' + n.disvalue + '</option>';
//						} else if(n.dictTypeCode == 'SPECIFIC_COST_TYPE') {
//							//具体费用
//							opttwo += '<option value="' + n.value + '">' + n.disvalue + '</option>';
//						} else if(n.dictTypeCode == 'TRAVEL_TYPE') {
//							//出差类型
//							travelType += '<option value="' + n.value + '">' + n.disvalue + '</option>';
//						} else if(n.dictTypeCode == 'VEHICIE_CODE') {
//							//交通工具
//							vehicieCode += '<option value="' + n.value + '">' + n.disvalue + '</option>';
//						} else if(n.dictTypeCode == 'HOTEL_ADDRESS') {
//							//住宿地点
//							hotel += '<option value="' + n.value + '">' + n.disvalue + '</option>';
//						} else if(n.dictTypeCode == 'COST_TYPE') {
//							//其他费用类型
//							cost += '<option value="' + n.value + '">' + n.disvalue + '</option>';
//						}
//					});
//				
//					//替换页面代码
//					$('#budgetProject').html(optone).niceSelect();
//					$('#costBreakdown').html(opttwo).niceSelect();
//					//出差类型
//					$('#modelBusiType').html(travelType).niceSelect();
//					//交通工具
//					$('select.vehicle-sel').html(vehicieCode).on("change", function() {
//						var selVal = $(this).val();
//						//调用公用方法根据一级交通工具获取二级交通工具
//						sysCommon.vechicleChildData(selVal);
//					}).niceSelect();
//					//其他费用类型
//					$('select.cost-type-sel').html(cost).niceSelect();
//
//				}
//			});
		},
		getSpectificCostType: function() {
//			$.ajax({
//				type: "post",
//				url: "basicconfig/dictInfo/getDictInfoByTypeCode",
//				async: true,
//				data: {
//					dictTypeCode: 'SPECIFIC_COST_TYPE'
//				},
//				success: function(data) {
//					//获取数据list
//					var list = data.data || [];
//					//初始化HTML文本
//					var opts = '<option value="">请选择</option>';
//					//循环添加文本
//					$.each(list, function(i, n) {
//						opts += '<option value="' + n.value + '">' + n.disvalue + '</option>';
//					});
//					//替换页面代码
//					$('#costBreakdown').html(opts).niceSelect();
//				}
//			});
		},

		setformdata: function(d) {
			var me = this;
			//把公用的金额格式化方法存一下
			var fmMoney = $yt_baseElement.fmMoney;
			if(d.jsFun) {
				//根据相应的方法显示对应的区域
				if(d.jsFun=='showTrainFun'){
					me[d.jsFun]('',d.costData.trainApplyInfoList[0].projectId);
				}else{
					me[d.jsFun]();
				}
				$('.label-title.item .title-text').text('事前申请事项信息');
				$('.label-title.cost .title-text').text('事前申请费用信息');
			}
			//advanceAppId	事前申请Id
			$('#advanceAppId').val(d.advanceAppId);
			//advanceAppNum	事前申请单号
			$('#form-num').text(d.advanceAppNum);
			$('#advanceAppNum').val(d.advanceAppNum);
			//advanceAppName	事前申请事由
			$('#advanceAppReason').val(d.advanceAppName);
//			var specialCodeArr = d.specialCode.split('-'); //specialCode	所属预算项目code
//			var specialNameArr = d.specialName.split('-'); //specialName	所属预算项目名称
			//设置所属预算项目数据
//			me.setBudgetItme(specialCodeArr);
		
			//prjCode	项目唯一标识code
//			$('#prjName').val(d.prjName); //prjName	项目名称
//			if(d.prjName) {
//				$('.prj-name-tr').show();
//			}
			//advanceCostType	费用类型
			me.getCostTypeList(d.advanceCostType);
			//预计收入总金额(税后)
			if(d.costData.costPredictInfoList){
				var afterTaxAllMoney='0';
				if(d.costData.costPredictInfoList.length>0){
				 
				afterTaxAllMoney = $yt_baseElement.rmoney(d.costData.costPredictInfoList[0].averageMoney);
				$("#afterTaxAllMoney").text($yt_baseElement.fmMoney(afterTaxAllMoney || '0')).attr('num', afterTaxAllMoney);
				}else{
					$("#afterTaxAllMoney").text(afterTaxAllMoney).attr('num', afterTaxAllMoney);
				}
				var preTaxAllMoney=afterTaxAllMoney*1.03;
				$("#preTaxAllMoney").text($yt_baseElement.fmMoney(preTaxAllMoney || '0')).attr('num', preTaxAllMoney);
			}
			
			//advanceAmount	预算总金额
			$('.count-val-num').text(fmMoney(d.advanceAmount || '0')).attr('num', d.advanceAmount);
			//大写
			$('#TotalMoneyUpper').text(arabiaToChinese(d.advanceAmount + ''));
			//税后计算
			$('#doAdvanceAmount').text(fmMoney(d.doAdvanceAmount || '0'));
			
			//applicantUserName	申请人姓名
			$('#busiUsers').text(d.applicantUserName);
			//applicantUserDeptName	申请人所在部门
			$('#deptName').text(d.deptName);
			//申请人职务名称:#jobName applicantUserJobLevelName
			$('#jobName').text(d.positionName == "" ? "--" : d.positionName);
			//电话号码
			$('#telPhone').text(d.applicantUserPhone == "" ? "--" : d.applicantUserPhone);
			//applicantTime	申请时间
			$('#fuData').text(d.applicantTime);
			//nodeNowState	流程状态
			//workFlowState	工作流状态
			//nodeNowState	流程状态
			$('#operate-flow option[value="' + d.nodeNowState + '"]').attr('selected', true);
			//workFlowState	工作流状态
			//processInstanceId	流程实例Id
			$('#processInstanceId').val(d.processInstanceId);
			//currentAssignee	当前责任人
			$('#approve-users option[value="' + d.currentAssignee + '"]').attr('selected', true);
			$('#operate-flow,#approve-users').niceSelect();
			$('#taxAmount').text(fmMoney(d.taxAmount)); 
			//attList	附件集合
			me.showFileList(d.attList);
			//costData	费用申请数据
			me.showCostDetail(d.costData);
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
		 * 重置表格序号
		 * @param {Object} obj
		 */
		resetNum: function(obj) {
			var trs = obj.find('tbody tr');
			$.each(trs, function(i, n) {
				$(n).find('.order-number').text(i + 1);
			});
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
			//费用明细
			me.setCostList(data.projectBudgetList);
			//teacherApplyInfoList	师资-讲师信息json
			me.setTeacherApplyInfoList(data.teacherApplyInfoList);
			//costTrainApplyInfoList	师资-培训费json
			me.setCostTrainApplyInfoList(data.costTrainApplyInfoList);
			//costPredictInfoList	预计收入费用json
			me.setCostPredictInfoList(data.costPredictInfoList);
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
			//加载区域页面
			sysCommon.loadingWord('view/system-sasac/expensesReim/module/reimApply/hospitalitySpending.html');
			$('.advance-relevance').hide();
			//清空差旅行程明细
			$('#tripList tbody').empty();
			//清空差旅费用明细
			$('#traffic-list-info tbody,#hotel-list-info tbody,#other-list-info tbody,#subsidy-list-info tbody').empty();
			//重置总金额
			$('.count-val-num').text('0.00');
			$('#TotalMoneyUpper').text('--');
			//显示可支出金额字段
			$('#doAdvanceBox').hide();
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
			$('.approve-div,.else-div').show();
			//加载区域页面
			sysCommon.loadingWord('view/system-sasac/expensesReim/module/reimApply/costDetail.html');

			//清空接待对象信息
			$("#targetList tbody").empty();
			//清空接待费用申请
			$("#paymentList tbody tr:not(.last)").remove();
			//清空差旅行程明细
			$('#tripList tbody').empty();
			//清空差旅费用明细
			$('#traffic-list-info tbody,#hotel-list-info tbody,#other-list-info tbody,#subsidy-list-info tbody').empty();
			//重置总金额
			$('.count-val-num').text('0.00');
			$('#TotalMoneyUpper').text('--');
			//显示可支出金额字段
			$('#doAdvanceBox').hide();
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
			$('.index-main-div').show();
			//加载区域页面
			sysCommon.loadingWord('view/system-sasac/expensesReim/module/reimApply/travelSpending.html');
			$('.advance-relevance').hide();
			//清空接待对象信息
			$("#targetList tbody").empty();
			//清空接待费用申请
			$("#paymentList tbody tr:not(.last)").remove();
			//重置总金额
			$('.count-val-num').text('0.00');
			$('#TotalMoneyUpper').text('--');
			//显示可支出金额字段
			$('#doAdvanceBox').hide();
		},
		/**
		 * 培训
		 */
		showTrainFun: function(code,projectId) {
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
			var id = '';
			if(projectId)id = '?projectId='+projectId;
			sysCommon.loadingWord('view/projectManagement-sasac/expensesReim/module/beforehand/trainingFeeApply.html'+id);
			//清空接待对象信息
			$("#targetList tbody").empty();
			//清空接待费用申请
			$("#paymentList tbody tr:not(.last)").remove();
			//清空差旅行程明细
			$('#tripList tbody').empty();
			//清空差旅费用明细
			$('#traffic-list-info tbody,#hotel-list-info tbody,#other-list-info tbody,#subsidy-list-info tbody').empty();
			//重置总金额
			$('.count-val-num').text('0.00');
			$('#TotalMoneyUpper').text('--');
			//显示可支出金额字段
			$('#doAdvanceBox').show();
			//获取培训类别
			serveApply.getTrainingTypeOption(code);
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
			//加载区域页面
			sysCommon.loadingWord('view/system-sasac/expensesReim/module/beforehand/meetingCostApply.html');
			//显示可支出金额字段
			$('#doAdvanceBox').hide();
			//加载类型
			serveApply.getMeetingTypeCode();
		},
		/**
		 * 差旅费列表相关事件
		 */
		costApplyAlertEvent: function() {
			var me = this;
			//点击出差人输入框操作
			$("#modelBusiUser").off().on("click", function() {
				//显示出差人列表
				$("#busiUserInfo").show();
				//判断出差人列表书否读取过数据
				if(!$("#busiUserInfo").hasClass("check")) {
					//调用获取出差人列表方法
					me.getBusiTripUsersList($("#userPram").val());
				}
				//调用弹出框中操作事件方法
				me.busiTripUserModelEvent($("#modelBusiUser"), $("#busiPlanEditModel .auto-font"), $(".model-user-num-show"), 1);
			});
			//行程明细新增
			$('#tripAddBtn').click(function() {
				//显示弹框
				me.showTripAlert();
				$('#planSaveBtn').off().on('click', function() {
					//添加页面
					me.appendTripList();
				});
			});

			//行程明细删除
			$('#tripList').on('click', '.operate-del', function() {
				var ithis = $(this);
				var tr = ithis.parents('tr');
				$yt_alert_Model.alertOne({
					alertMsg: "数据删除将无法恢复,确认删除吗?", //提示信息  
					confirmFunction: function() { //点击确定按钮执行方法  
						tr.remove();
						//获取行程列表的长度
						var trs = $('#tripList tbody tr');
						//行程列表没有数据
						if(trs.length <= 0) {
							//清空费用明细中所有列表
							$('#traffic-list-info tbody').empty();
							$('#hotel-list-info tbody').empty();
							$('#other-list-info tbody').empty();
							$('#subsidy-list-info tbody').empty();
						} else {
							//重新配置补助明细列表
							me.setSubsidyList();
						}
					}
				});
			});
			//补助明细删除
			$('#subsidy-list-info').on('click', '.operate-del', function() {
				var ithis = $(this);
				var tr = ithis.parents('tr');
				$yt_alert_Model.alertOne({
					alertMsg: "数据删除将无法恢复,确认删除吗?", //提示信息  
					confirmFunction: function() { //点击确定按钮执行方法  
						tr.remove();
						//设置合计金额
						me.setSubsidyTotal();
						//计算总金额
						me.updateMoneySum();

					}
				});
			});

			//行程明细修改
			$('#tripList').on('click', '.operate-update', function() {
				var ithis = $(this);
				var tr = ithis.parents('tr');
				//数据回显
				me.setTripAlertData(tr);
				//显示弹框
				me.showTripAlert();
				//重置按钮
				$('#planSaveBtn').off().on('click', function() {
					me.appendTripList(tr);
				});
			});
			//行程明细取消
			$('#planCanelBtn').click(function() {
				me.hideTripAlert();
				$("#busiUserInfo ul li").removeClass("tr-check");
				$("#busiUserInfo").removeClass("check");
				//清除字段验证样式
				$("#tdStartDate,#tdEndDate,#modelBusiUser,#modelBusiAddres,#busiPlanEditModel .model-busi-addres").removeClass("valid-hint");
				$("#busiPlanEditModel .valid-font").text("");
				//清空存储出差人的数据
				me.selUsersName = "";
				me.selUsersCode = "";
				me.clearAlert($('#busiPlanEditModel'));
				me.getPlanBusiAddress($("#modelBusiAddres"));
				//清空出差人数
				me.clearUser();
			});

			//费用明细新增
			$('#addCostApplyBtn').click(function() {
				//显示弹框
				me.showCostApplyAlert();
				$('#modelSureBtn').off().on('click', function() {
					//获取当前选中的tab值0交通费,1住宿费2其他
					var tabFlag = $(".cost-type-tab li.tab-check .hid-tab").val();
					var validModel = "";
					if(tabFlag == 0) {
						validModel = $(".traffic-form");
					} else if(tabFlag == 1) {
						validModel = $(".hotel-form");
					} else if(tabFlag == 2) {
						validModel = $(".other-form");
					}
					//调用验证方法
					var validFlag = $yt_valid.validForm(validModel);
					if(validFlag) {
						//调用获取表单数据拼接方法
						me.appendCostApplyList(tabFlag);
					}
				});
			});

			/**
			 * 
			 * 出发地,到达地互换操作
			 * 
			 */
			$("#addres-icon").off().on("click", function() {
				var startCity = $("#fromcity option:selected");
				var endCity = $("#tocity option:selected");
				$("#tocity").html(startCity);
				$("#fromcity").html(endCity);
				me.getPlanBusiAddress($("#tocity"));
				me.getPlanBusiAddress($("#fromcity"));
			});
			/**
			 * 
			 * 入住天数上下相加
			 * 
			 */
			$(".yt-spin").click(function() {
				//获取住宿天数
				var hotelDay = $(".hotel-form .yt-numberInput").val();
				if(hotelDay < 1) {
					hotelDay = $(".hotel-form .yt-numberInput").val(1);
				}
				//获取 住宿金额
				var hotelMoney = $(".cost-detail-money").val();
				if(hotelDay > 0 && hotelMoney != "") {
					//算出住宿费平均数
					$("#peoDayMoney").html($yt_baseElement.fmMoney(($yt_baseElement.rmoney(hotelMoney)) / hotelDay));
				}
			});
			//入住天数文本框失去焦点事件
			$(".yt-numberInput").on("blur", function() {
				//获取 住宿金额
				var hotelMoney = $(".cost-detail-money").val();
				if($(this).val() > 0 && hotelMoney != "") {
					//算出住宿费平均数
					$("#peoDayMoney").html($yt_baseElement.fmMoney(hotelMoney / $(this).val()));
				}
			});
			/**
			 * 
			 * 城市金额输入框失去焦点获取焦点事件
			 * 
			 */
			$(".city-cost-input,.cost-detail-money").on("focus", function() {
				if($(this).val() != "" && $(this).val() != null) {
					$(this).val($yt_baseElement.rmoney($(this).val()));
					$(this).select();
				}
			});
			$(".city-cost-input,.cost-detail-money").on("blur", function() {
				var val = $yt_baseElement.rmoney($(this).val() || '0');
				//判断如果是住宿费失去焦点
				if($(this).hasClass("cost-detail-money")) {
					if($(this).val() != "") {
						//算出住宿费平均数
						var hotelDay = $(".hotel-form .hotel-num").text();
						//判断如果天数计算是0
						if(hotelDay == 0) {
						
						$("#peoDayMoney").html($yt_baseElement.fmMoney(val));
						} else {
						$("#peoDayMoney").html($yt_baseElement.fmMoney(val / hotelDay));
						}
					}
				}
			});

			//城市间交通费删除
			$('#traffic-list-info,#hotel-list-info,#other-list-info').on('click', '.operate-del', function() {
				var ithis = $(this);
				var tr = ithis.parents('tr');
				var table = ithis.parents('table');
				$yt_alert_Model.alertOne({
					alertMsg: "数据删除将无法恢复,确认删除吗?", //提示信息  
					confirmFunction: function() { //点击确定按钮执行方法  
						tr.remove();
						//判断是否都删除,给出暂无数据
						if(table.find('tbody tr:not(.total-last-tr)').length <= 0) {
							var cols = table.find('thead tr th').length;
							var noDataTr = '<tr class="not-date-tr">' +
								'<td colspan="' + cols + '">' +
								'<div class="no-data">' +
								'<img src="../../../../../resources-sasac/images/common/no-data.png" alt="">' +
								'</div>' +
								'</td>' +
								'</tr>';
							table.find('tbody').html('');
						}
						//调用合计方法
						me.updateMoneySum(0);
						me.updateMoneySum(1);
						me.updateMoneySum(2);
						//重新计算总金额
						me.updateApplyMeonySum();
					}
				});
			});
			//城市间交通费修改
			$('#traffic-list-info,#hotel-list-info,#other-list-info').on('click', '.operate-update', function() {
				var ithis = $(this);
				var tr = ithis.parents('tr');
				//显示弹框
				me.showCostApplyAlert();
				//数据回显
				me.setFormInfo(tr);
				//获取费用类型0.交通1.住宿2.其他
				var costType = tr.find(".hid-cost-type").val();
				//选中相对应的tab
				$(".cost-type-tab ul li").removeClass("tab-check");
				$('.cost-type-tab ul li input[value="' + costType + '"]').parent().addClass("tab-check");
				//显示相对应的表单
				if(costType == 0) {
					$(".traffic-form").show();
					//改变风险灯为绿灯
					$(".traffic-form .risk-img").attr("src", me.riskViaImg);
				}
				if(costType == 1) {
					$(".hotel-form").show();
					$(".traffic-form").hide();
					//改变风险灯为绿灯
					$(".hotel-form .risk-img").attr("src", me.riskViaImg);
				}
				if(costType == 2) {
					$(".other-form").show();
					$(".traffic-form").hide();
					//改变风险灯为绿灯
					$(".other-form .risk-img").attr("src", me.riskViaImg);
				}
				//重置按钮
				$('#modelSureBtn').off().on('click', function() {
					me.appendCostApplyList(costType, tr);
				});
			});

			//费用明细关闭
			$('#modelCanelBtn').click(function() {
			
			$('#fromcity,#tocity,#hotelParentAddress,#hotelTwoAddres,#hotelChildAddres').html('<option value="">请选择</option>');
				//关闭弹框
				me.hideCostApplyAlert();
				//清空表单
				me.clearFormData();
			});

			//补助明细修改事件
			$('#subsidy-list-info').on('click', '.operate-update', function() {
				var ithis = $(this);
				var tr = ithis.parents('tr');
				//显示弹框
				me.showSubsidiesAlert();
				//数据回显
				//出差人
				$('#subsidyBusinUser').text(tr.find('.user').text());
				//级别
				$('#subsidyBusinLevel').text(tr.find('.lv').text());
				//补助天数
				$('#subsidiesDays').val(tr.find('.subsidy-num').text());
				//伙食补助费
				$('#subsidiesFood').val(tr.find('.food').text());
				//室内交通补助
				$('#subsidiesTraffic').val(tr.find('.traffic').text());
				//重置按钮
				$('#subsidiesCommon').off().on('click', function() {
					//修改补助明细
					me.appendSubdisyList(tr);
				}).text('确定');
			});
			//补助明细关闭
			$('#subsidiesCancel').click(function() {
				//关闭弹框
				me.hideSubsidiesAlert();
				//清空表单
				me.clearAlert($('#subdisyInfoAlert'));
			});

		},
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
		 * 显示行程明细新增弹框
		 */
		showTripAlert: function() {
			var me = this;
			//获取弹框对象
			var alert = $('#busiPlanEditModel');
			//设置地点
			me.getPlanBusiAddress($('#modelBusiAddres'));
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
			$('#modelBusiAddres').html('<option value="">请选择</option>');

			//隐藏弹框及蒙层
			$yt_baseElement.hideMongoliaLayer();
			$('#busiPlanEditModel').hide();
			$('#pop-modle-alert').hide();
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
						if(data.data.rows.length > 0) {
							$.each(data.data.rows, function(i, n) {
								liStr = $('<li>' + n.userName + '/' + n.deptName + '</li>');
								//存储当前出差人的数据
								liStr.data("userData", n);
								$("#busiUserInfo ul").append(liStr);
							});
							//判断出差人隐藏的code值是否有值
							if($("#modelUserCodes").val() != "") {
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
						} else {
							$("#busiUserInfo ul").append('<li style="text-align: center;">暂无数据</li>');
						}
					}
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

				$("#modelBusiUser").val('');
				$("#modelBusiUser").prev("input[type=hidden]").val('');
				//出差人数赋值
				$(".model-user-num-show").find(".users-num").text(0);
				//添加验证信息方法
				$("#modelBusiUser").next(".valid-font").text("请选择出差人");
				$("#modelBusiUser").addClass("valid-hint");
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
				me.clearUser();
			});
			//隐藏
			$("#busiUserInfo").mouseleave(function() {
				$(this).hide();
				$(this).addClass("check");
			});
		},
		/*清空按钮事件*/
		clearUser: function() {
			//显示自动计算文本
			$("#busiPlanEditModel .auto-font").show();
			//隐藏出差人数
			$(".model-user-num-show").hide();

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
			var budiAddName = $('#modelBusiAddres option:selected').text();
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
				}
				//清空出差人数
				me.clearUser();
				$("#busiUserInfo ul li").removeClass("tr-check");
				$("#busiUserInfo").removeClass("check");
				//清空存储出差人的数据
				me.selUsersName = "";
				me.selUsersCode = "";
				me.clearAlert($('#busiPlanEditModel'));
				//				$('#modelBusiAddres').html('<option value="">请选择</option>');
				me.getPlanBusiAddress($("#modelBusiAddres"));
				//更新费用明细弹框中的出差人列表
				//me.getModelUsersInfo();
				//更新补助明细内容
				me.setSubsidyList();
			}

		},
		/**
		 * 修改行程明细列表时重新设置弹出框数据
		 * @param {Object} tr
		 */
		setTripAlertData: function(tr) {
			var me = this;
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

			me.getPlanBusiAddress($("#modelBusiAddres"));

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
			var level = trabfficObj.find("#model-trip-user option:selected").attr("data-level");
			//出发日期
			var trafficStartTime = $('#traffic-start-time').val();
			//到达日期
			var trafficEndTime = $('#traffic-end-time').val();
			//出发地点
			var fromcityName = $('#fromcity option:selected').text();
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
			vehicleChildCode = trabfficObj.find(".vehicle-two-sel").val();
			//判断如果二级菜单没有选中
			if($(".vehicle-two-sel").val() != "" && $(".vehicle-two-sel").val() != null) {
				vehicle = trabfficObj.find(".vehicle-two-sel option:selected").text();
			} else {
				vehicle = trabfficObj.find(".vehicle-sel option:selected").text();
			}

			//城市交通费
			var cityMoney = trabfficObj.find(".city-cost-input").val();
			//拼接交通费表格数据
			var trafficCostStr = '<tr>' +
				'<td><span>' + tripUser + '</span><input type="hidden" data-val="travelPersonnel" class="hid-traf-users" value="' + userCode + '"/>' +
				'</td><td>' + level + '</td>' +
				'<td data-text="goTime">' + trafficStartTime + '</td><td><input data-val="goAddress" type="hidden" value="' + fromcity + '"><span data-text="goAddressName">' + fromcityName + '</span></td><td data-text="arrivalTime">' + trafficEndTime + '</td>' +
				'<td><input data-val="arrivalAddress" type="hidden" value="' + tocity + '"> <span data-text="arrivalAddressName">' + tocityName + '</span></td>' +
				'<td><span data-text="vehicle">' + vehicle + '</span><input type="hidden" class="hid-vehicle" value="' + vehicleCode + '"/><input type="hidden" class="hid-child-code" value="' + vehicleChildCode + '"/></td>' +
				'<td class="font-right money-td" data-text="crafare">' + (cityMoney == "" ? "--" : cityMoney) + '</td>' +
				'<td class="text-overflow-sty" data-text="remarks" title="' + specialRemark + '">' + (specialRemark == "" ? "无" : specialRemark) + '</td>' +
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

				$('#model-trip-user option[value="' + busiUser + '"]').attr("selected", true);
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
				$(".hotel-form .hotel-num").text(hotelDay);
				if(hotelAddress.length == 3) {
					$('#hotelParentAddress').html('<option value="' + hotelAddress[0] + '">' + hotelAddressName[0] + '</option>');
					$('#hotelTwoAddres').html('<option value="' + hotelAddress[1] + '">' + hotelAddressName[1] + '</option>');
					$('#hotelChildAddres').html('<option value="' + hotelAddress[2] + '">' + hotelAddressName[2] + '</option>');
				} else if(hotelAddress.length == 2) {
					$('#hotelChildAddres').html('<option value="' + hotelAddress[1] + '">' + hotelAddressName[1] + '</option>');
				}
			
				$(".hotel-form .hotel-money").val(hotelMoney);
				$("#peoDayMoney").text(dayMoney);
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
			var level = hotelObj.find("select.hotel-trip-user-sel option:selected").attr("data-level");

			//住宿地址
			var hotelAddress = "";
			var hotelAdressCode = "";
			var hotelParentAdres = hotelObj.find("#hotelParentAddress option:selected").text();
			var hotelTwoAdres = hotelObj.find("#hotelTwoAddres option:selected").text();
			var hotelChildAdres = hotelObj.find("#hotelChildAddres option:selected").text();
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
				'<td><span>' + tripUser + '</span><input type="hidden" data-val="travelPersonnel" value="' + hotelObj.find("select.hotel-trip-user-sel").val() + '"/></td><td>' + level + '</td>' +
				/*'<td data-text="hotelTime">' + $("#hotelDate").val() + '</td>' +*/
				'<td class="font-right">' + hotelObj.find("#peoDayMoney").text() + '</td>' +
				'<td  risk-code-val="hotelCheckInDate" class="check-in-date"><span data-text="hotelTime" class="sdate">' + hotelCheckInDate + '</span></td>' +
				'<td class="leave-date"><span data-text="leaveTime" class="edate">' + leaveDate + '</span></td>' +
				'<td data-text="hotelDays">' + hotelObj.find(".hotel-num").text() + '</td><td class="font-right money-td" data-text="hotelExpense">' + hotelObj.find(".cost-detail-money").val() + '</td>' +
				'<td><span data-text="hotelAddressName">' + hotelAddress + '</span><input type="hidden" data-val="hotelAddress" value="' + hotelAdressCode + '"</td>' +
				'<td class="text-overflow-sty" data-text="remarks" title="' + hotelObj.find(".hotel-msg").val() + '">' + (hotelObj.find(".hotel-msg").val() == "" ? "--" : hotelObj.find(".hotel-msg").val()) + '</td>' +
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
				'<td><span>' + costType + '</span><input type="hidden" data-val="costType" value="' + otherObj.find("#cost-type").val() + '"/></td>' +
				'<td class="font-right money-td" data-text="reimAmount">' + otherObj.find(".other-money").val() + '</td>' +
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
			}

			//调用合计方法
			me.updateMoneySum(2);
			//调用公用清空表单数据方法
			me.clearFormData();
			//改变风险灯图标绿灯
			$("#other-list-info").parent().find(".cost-list-title .risk-img").attr("src", me.riskViaImg);
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
				me.usersInfoJson = eval("(" + me.usersInfoJson + ")");
				$.each(me.usersInfoJson, function(i, n) {
					optionText = '<option value="' + n.userItcode + '" data-level="' + n.jobLevelName + '">' + n.userName + '</option>';
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
					opts += '<option value="' + n.userItcode + '" data-level="' + n.jobLevelName + '">' + n.userName + '</option>';
				});
				$("#model-trip-user,#hotel-trip-user").html(opts).niceSelect();
			}
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
				totalFood += +(serveApply.rmoney(tr.find('.food').text()));
				totalTraffic += +(serveApply.rmoney(tr.find('.traffic').text()));
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
			modelObj.find("#hotelParentAddress,#hotelTwoAddres,#hotelChildAddres").html('').append('<option value="">请选择</option>');
			//初始化下拉列表
			modelObj.find("select").niceSelect();
			//住宿天数
			$(".hotel-num").css("color", "#999999");
			modelObj.find(".hotel-num").text("自动计算");
			//入住天数默认值1
			modelObj.find(".yt-numberInput").val(1);
			//住宿费平均数
			modelObj.find("#peoDayMoney").text("0.00");
			//入住天数
			modelObj.find("#hotelDay").text("*");
			//tab标签初始
			$(".cost-type-tab ul li").removeClass("tab-check");
			$(".cost-type-tab ul li:eq(0)").addClass("tab-check");
			$(".traffic-form").show();
			$(".hotel-form,.other-form").hide();
			//显示加入列表按钮,隐藏确定按钮
			$("#model-add-list-btn").show();
			//显示确定按钮
			$("#model-sure-btn").hide();
			//将费用明细中的风险灯都改为红色
			modelObj.find(".risk-img").attr("src", sysCommon.riskExcMark);
			//清空验证信息
			modelObj.find(".valid-font").text("");
			modelObj.find(".valid-hint").removeClass("valid-hint");
			//获取出差人
			me.setModelUsers();
			//调用获取出差地点方法
			me.setAddress();
			me.getPlanBusiAddress($("#fromcity"));
			me.getPlanBusiAddress($("#tocity"));
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
			sumMoney = $yt_baseElement.fmMoney(sumMoney);
			//增值税销项税
			var vatSalesTax=afterTaxAllMoney*0.03;
			$("#vatSalesTax").text($yt_baseElement.fmMoney(vatSalesTax || '0')).attr('num', vatSalesTax);
			//应缴附加税
			var surtax=vatSalesTax*0.12;
			$("#surtax").text($yt_baseElement.fmMoney(surtax || '0')).attr('num', surtax);
			//预算支出总金额
			$("span.count-val-num").text(sumMoney).attr('num', sumMoney);
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
				var sumMoneyLower = arabiaToChinese(sumMoney + '');
				$("span.count-val").text(sumMoneyLower);
			} else {
				$("span.count-val-num").text("0.00");
			}
		},
		/**
		 * 设置住宿地点内容
		 */
		setAddress: function() {
			var me = this;
//			$.ajax({
//				type: "get",
//				url: $yt_option.websit_path + 'resources-sasac/js/system/expensesReim/module/reimApply/regionList.json',
//				async: false,
//				success: function(data) {
//				
//					me.addressList = data;
//					me.setAddressSelect();
//				}
//			});

		},
		/**
		 * 设置住宿地点下拉模糊查询
		 */
		setAddressSelect: function() {
			var me = this;

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
			$("#hotelParentAddress").on("change", function() {
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
			$("#hotelTwoAddres").on("change", function() {
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
		 * 行程表单出差地点事件
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
			//			$(labelObj).niceSelect();
		},
		/**
		 * 添加事前申请的附件数据
		 * @param {Object} files
		 */
		exportBeforeFiles: function(files) {
			var ls = '';
			$.each(files, function(i, n) {
				ls += '<div fId="' + n.attId + '" class="li-div"><span>' + n.attName + '</span></div>';
			});
			$('#attIdStr').append(ls);
		},
		/**
		 * 接待对象信息列表数据循环
		 * @param {Object} list
		 */
		setCostReceptionistList: function(costReceptionistList) {
			var me = this;
			//接待对象信息集合HTML文本
			var receHtml = '';
			$.each(costReceptionistList, function(i, n) {
				receHtml += '<tr pkId="' + n.costReceptionistId + '" applyName="' + n.name + '" Duties="' + n.jobName + '" Unit="' + n.unitName + '">' +
					' <td class="order-number">1</td>' +
					' <td class="name" style="width: 100px;">' + n.name + '</td>' +
					' <td class="jobName" style="width: 100px;">' + n.jobName + '</td>' +
					' <td class="DutiesName">' + n.unitName + '</td>' +
					' <td><span class="receive-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="receive-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td> </tr>'
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
		setCostDetailsList: function(costDetailsList) {
			//费用明细信息集合HTML文本
			var detaHtml = '';
			var fmTotal = 0;
			$.each(costDetailsList, function(i, n) {
				fmTotal += +n.activityAmount;
				detaHtml += '<tr class="" pkId="' + n.costDetailsId + '" budgetCode="' + n.publicServiceProCode + '" costCode="' + n.costType + '" budgetProject="' + n.publicServiceProName + '" applyDate="' + n.activityDate + '" siteVal="' + n.placeName + '" costBreakdown="' + n.costTypeName + '" standardMoney="' + n.standardAmount + '" budgetMoney="' + n.activityAmount + '" accompanyNum="' + n.peopleNum + '">' +
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
			$('#paymentList tbody .total-money').text(serveApply.fmMoney(fmTotal));
		},
		/**
		 * 行程明细列表数据显示
		 * @param {Object} tripPlanList
		 */
		setTravelRouteList: function(tripPlanList) {
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
				var costItemName = getCostItemName(n.receptionCostItem);

				tripHtml += '<tr busicode="' + n.travelType + '" usercode="' + n.travelPersonnels + '" rececode="' + (n.receptionCostItem) + '" >' +
					'<td><input type="hidden" class="hid-user-code" value="' + n.travelPersonnels + '" /> <span class="name">' + n.travelTypeName + '</span></td>' +
					'<td class="sdate">' + n.startTime + '</td>' +
					'<td class="edate">' + n.endTime + '</td>' +
					'<td class="day">' + diff_day + '</td>' +
					'<td class="address" val="' + n.travelAddress + '">' + n.travelAddressName + '</td>' +
					'<td class="uname">' + getUserNames(n.travelPersonnelsList) + '</td>' +
					'<td class="numof">' + n.travelPersonnelsList.length + '</td>' +
					'<td class="reception">' + (costItemName ? costItemName : '无') + '</td>' +
					'<td>' +
					'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>' +
					'</td>' +
					'</tr>';

				clearRepetitionUser(n.travelPersonnelsList, n.travelPersonnels);
			});
			$('#tripList tbody').append(tripHtml);
			//更新费用明细弹框中的出差人列表
			//me.getModelUsersInfo();
		},
		/**
		 * 设置城市间交通费列表数据
		 * @param {Object} costCarfareList
		 */
		setCostCarfareList: function(costCarfareList) {
			var carHtml = '';
			//结算方式复选框
			var costCarfareClose = $('#traffic-list-info').next().find('.check-label input');
			var vehicle = [];
			$.each(costCarfareList, function(i, n) {
				//去掉第一个和最后一个. 后拆分
				vehicle = n.vehicle.substr(1).substr(0, n.vehicle.length - 2).split('.');
				carHtml += '<tr>' +
				'<td><span>' + n.travelPersonnelName + '</span><input type="hidden" data-val="travelPersonnel" class="hid-traf-users" value="' + n.travelPersonnel + '"/>' +
					'</td><td>' + n.travelPersonnelsDept + '</td>' +
					'<td data-text="goTime">' + n.goTime + '</td><td><input data-val="goAddress" type="hidden" value="' + n.goAddress + '"><span data-text="goAddressName">' + n.goAddressName + '</span></td><td data-text="arrivalTime">' + n.arrivalTime + '</td>' +
					'<td><input data-val="arrivalAddress" type="hidden" value="' + n.arrivalAddress + '"> <span data-text="arrivalAddressName">' + n.arrivalAddressName + '</span></td>' +
					'<td><span data-text="vehicle">' + n.vehicleName + '</span><input type="hidden" class="hid-vehicle" value="' + vehicle[0] + '"/><input type="hidden" class="hid-child-code" value="' + (vehicle.length > 1 ? vehicle[1] : '') + '"/></td>' +
					'<td class="font-right money-td" data-text="crafare">' + (n.crafare == "" ? "--" : serveApply.fmMoney(n.crafare)) + '</td>' +
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
			carHtml += '<tr class="total-last-tr"><td><span class="tab-font-blod">合计</span></td><td></td><td></td><td></td><td></td><td></td><td></td><td class="font-right"><span class="tab-font-blod money-sum">0.00</span></td><td></td><td></td></tr>';
			$('#traffic-list-info tbody').html(carHtml);
			//调用合计方法
			sysCommon.updateMoneySum(0);
		},
		/**
		 * 住宿费列表数据显示
		 * @param {Object} costHotelList
		 */
		setCostHotelList: function(costHotelList) {
			var hotelHtml = '';
			//结算方式复选框
			var costHotelClose = $('#hotel-list-info').next().find('.check-label input');
			$.each(costHotelList, function(i, n) {
				var avg = n.hotelDays > 0 ? serveApply.fmMoney(+n.hotelExpense / +n.hotelDays) : n.hotelExpense;
				hotelHtml += '<tr>' +
					'<td><span>' + n.travelPersonnelName + '</span><input type="hidden" data-val="travelPersonnel" value="' + n.travelPersonnel + '"/></td><td>' + n.travelPersonnelsJobLevelName + '</td>' +
					/*'<td data-text="hotelTime">' + $("#hotelDate").val() + '</td>' +*/
					'<td class="font-right">' + avg + '</td>' +
					'<td risk-code-val="hotelCheckInDate" class="check-in-date"><span  data-text="hotelTime" class="sdate">' + n.hotelTime + '</span></td>' +
					'<td class="leave-date"><span data-text="leaveTime" class="edate">' + n.leaveTime + '</span></td>' +

					'<td data-text="hotelDays">' + n.hotelDays + '</td><td class="font-right money-td" data-text="hotelExpense">' + serveApply.fmMoney(n.hotelExpense) + '</td>' +
					'<td><span data-text="hotelAddressName">' + n.hotelAddressName + '</span><input type="hidden" data-val="hotelAddress" value="' + n.hotelAddress + '"</td>' +
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
			hotelHtml += '<tr class="total-last-tr"><td><span class="tab-font-blod">合计</span></td><td></td><td></td><td></td><td></td><td></td><td class="font-right"><span class="tab-font-blod money-sum">0.00</span></td><td></td><td></td><td></td></tr>';
			$('#hotel-list-info tbody').html(hotelHtml);
			//调用合计方法
			sysCommon.updateMoneySum(1);
		},
		/**
		 * 其他费用列表数据显示
		 * @param {Object} costOtherList
		 */
		setCostOtherList: function(costOtherList) {
			var otherHtml = '';
			//结算方式复选框
			var costOtherClose = $('#other-list-info').next().find('.check-label input');
			$.each(costOtherList, function(i, n) {
				otherHtml += '<tr>' +
					'<td><span>' + n.costTypeName + '</span><input type="hidden" data-val="costType" value="' + n.costType + '"/></td>' +
					'<td class="font-right money-td" data-text="reimAmount">' + serveApply.fmMoney(n.reimAmount) + '</td>' +
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
		otherHtml += '<tr class="total-last-tr"><td><span class="tab-font-blod">合计</span></td><td class="font-right"><span class="tab-font-blod money-sum">0.00</span></td><td></td><td></td></tr>';

			$('#other-list-info tbody').html(otherHtml);
			//调用合计方法
			sysCommon.updateMoneySum(2);
		},
		/**
		 * 设置补助明细列表
		 * @param {Object} costSubsidyList
		 */
		setCostSubsidyList: function(costSubsidyList) {
			var subHtml = '';
			var totalFood = 0;
			var totalTraffic = 0;
			$.each(costSubsidyList, function(i, n) {
				subHtml += '<tr class="' + n.travelPersonnel + '" code="' + n.travelPersonnel + '"><td><div class="user" code="' + n.travelPersonnel + '">' + n.travelPersonnelName + '</div></td><td><div class="lv">' + n.travelPersonnelsDept + '</div></td><td><div class="subsidy-num">' + n.subsidyDays + '</div></td><td><div style="text-align:right;" class="food">' + serveApply.fmMoney(n.subsidyFoodAmount) + '</div></td><td><div  style="text-align:right;" class="traffic">' + serveApply.fmMoney(n.carfare) + '</div></td><td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td></tr>';
				totalFood += +n.subsidyFoodAmount;
				totalTraffic += +n.carfare;
			});
		subHtml += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">'
					+ serveApply.fmMoney(totalFood)
					+ '</td><td class="total-traffic"  style="text-align:right;">'
					+ serveApply.fmMoney(totalTraffic) + '</td><td></td></tr>';
								$('#subsidy-list-info tbody').html(subHtml);
		},
		/**
		 * trainApplyInfoList	师资-培训信息json
		 * 设置 师资培训信息列表数据
		 * @param {Object} list
		 */
		setTrainApplyInfoList: function(list, exports) {
			var me = this ;
			var html = '';
			$.each(list, function(i, n) {
				serveApply.getTrainingTypeOption(n.trainType); //trainType 培训类型
				$('#meetingClassification').niceSelect();
				$('#regionDesignation').setSelectVal(n.projectId); //regionDesignation 培训名称
				var data = $('#regionDesignation option:selected').data('data');
				data.projectTypeName = $yt_baseElement.setProjectTypeName(data.projectType);
				$('.verify-div').setDatas(data);
				$('.trainOfNum').val(n.budgetTraineeSum);
				$('#startTimeTop').val(n.reportDate); //reportTime 报到时间
				$('#endTimeTop').val(n.outHospitalDate); //endTime 结束时间
				$('.is-off-site-training[value='+n.isOffSiteTraining+']').setRadioState('check');//是否异地培训
				$('.cost-standard[value='+n.costStandard+']').setRadioState('check');//适用成本标准
				$('.offsite-training-requirement').val(n.offSiteTrainingRequirement);//异地培训特殊要求
				if(exports) {
					$('#meetingClassification,#regionDesignation,#regionName,#startTimeTop,#endTimeTop,#calculationSession,#trainOfNum,#workerNum,#approvaNum,#chargeStandard').addClass('exports');
				}
			});
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveApply.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveApply.fmMoney(totalTraffic) + '</td></tr>';
			$('#trainingPopTable tbody').html(html);
		},
		/*
		 费用明细信息列表
		 * 
		 * 
		 * */
		setCostList:function(list){
			var html = '';
			$('#lectureFeeTable tbody').empty();
			$('#trainingFeeTable tbody').empty();
			$.each(list, function(i, n) {
				html='<tr>' +
						'<td align="right"><input type="hidden" value="' + n.costCode + '" class="cost-code">' +
						'<span>' + n.costName + '</span>' +
						'</td>' +
						'<td>' +
						'<input type="text" class="yt-money-input budget-cost" data-val="budgetCost" placeholder="请输入" value="'+$yt_baseElement.fmMoney(n.budgetCost)+'"/>' +
						'</td>' +
						'<td>' +
						'<textarea class="yt-textarea accordingInstructions" style="height:28px;line-height:28px;padding:0 4px;width:95%" data-val="accordingInstructions" placeholder="请输入依据说明">'+n.accordingInstructions+'</textarea>'+
						'</td>' +
						'</tr>';
				if(n.costType == 1) {
					$('#lectureFeeTable tbody').append(html);
				}
				if(n.costType == 2) {
					$('#trainingFeeTable tbody').append(html);
				}
				$('#lectureFeeTable,#trainingFeeTable').find('.yt-textarea').autoHeight();
				$('#lectureFeeTable,#trainingFeeTable').off('blur',($('.yt-money-input'))).off('focus',($('.yt-money-input'))).on('blur','.yt-money-input',function(){
					if($(this).val()!=''){
						$(this).val($yt_baseElement.fmMoney($(this).val()));
					}
				}).on('focus','.yt-money-input',function(){
						$(this).val($yt_baseElement.rmoney($(this).val()));
				})
			});
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
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveApply.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveApply.fmMoney(totalTraffic) + '</td></tr>';
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
			//处理数据
			$.each(list,function(i, n) {
				//处理数据为零的事项
				var standard = (n.standard == '0.00' || n.standard == '') ? '': $yt_baseElement.fmMoney(n.standard);
				var trainOfNum = (n.trainOfNum == '0'|| n.trainOfNum == '') ? '': n.trainOfNum;
				var trainDays = (n.trainDays == '0' || n.trainDays == '') ? '':n.trainDays;
				html += '<tr class="' + (exports ? 'exports' : '') + '" costnameval="' + n.trainType + '" pid="">'+
						'<td class="cost-name">' + n.trainTypeName + '</td>'+
						'<td class="moneyText standard-money">' + standard + '</td>'+
						'<td class="people-num">' + trainOfNum + '</td>'+
						'<td class="day-num">' + trainDays + '</td>'+
						'<td class="moneyText smallplan-money">' + serveApply.fmMoney(n.averageMoney) + '</td>'+
						'<td class="special-instruct">' + n.remark + '</td>'+
						'<td><input type="hidden" class="popM" value="4"><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td></tr>';
				total += + n.averageMoney;
			});
			$('#trainingFeeTable tbody tr.last').before(html).find('.costTotal').text(serveApply.fmMoney(total));
		},
		/**
		 * costPredictInfoList	预计收入费用json
		 * 设置 预计收入费用列表数据
		 * @param {Object} list
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
						'<td class="moneyText predict-smallplan-money sum-pay">'+ serveApply.fmMoney(n.averageMoney) + '</td>'+
						'<td class="moneyText predict-all-money" style="display:none;">'+ serveApply.fmMoney(n.predictAllMoney)+ '</td>'+
						'<td class="special-instruct">'+ n.remark + '</td>'+
						'<td><input type="hidden" class="popM" value="4"><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td></tr>';
				 costTotalAfter+= +n.predictStandardMoney;
				 costTotal+=+n.averageMoney;
			});
			
			$('#predictCostTable tbody tr.last').find('.costTotal-after').text(serveApply.fmMoney(costTotalAfter))
			$('#predictCostTable tbody tr.last').before(html).find('.costTotal').text(serveApply.fmMoney(costTotal));		
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
					'<td class="moneyText avg">' + serveApply.fmMoney(n.averageMoney) + '</td>' +
					'<td class="day">' + n.foodOfDays + '</td>' +
					'<td class="moneyText sum-pay">' + serveApply.fmMoney(n.foodAmount) + '</td>' +
					'<td style="text-align: left !important;" class="dec">' + (n.remarks || '无') + '</td>' +
					'<td><input type="hidden" class="popM" value="3"/>' +
					'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
					'</tr>';
				//total += +n.foodAmount;
			});
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveApply.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveApply.fmMoney(totalTraffic) + '</td></tr>';
			$('#dietFeeTable tbody .end-tr').before(html);
			//计算合计金额
			$('#dietFeeTable tbody tr:not(.end-tr)').each(function() {
				total += serveApply.rmoney($(this).find('.sum-pay').text());
			});
			$('#dietFeeTable tbody .costTotal').text(serveApply.fmMoney(total));
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
					'<td class="moneyText sum-pay">' + serveApply.fmMoney(n.perTaxAmount) + '</td>' +
					'<td class="moneyText after">' + serveApply.fmMoney(n.afterTaxAmount) + '</td>' +
					'<td class="moneyText avg">' + serveApply.fmMoney(n.averageMoney) + '</td>' +
					'<td><input type="hidden" class="popM" value="0"/>' +
					'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
					'</td></tr>';
				total += +n.perTaxAmount;
				afterTotal += +n.afterTaxAmount;
			});
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveApply.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveApply.fmMoney(totalTraffic) + '</td></tr>';
			$('#lectureFeeTable tbody .end-tr').before(html);
			//计算合计金额
//			$('#lectureFeeTable tbody tr:not(.end-tr)').each(function() {
//				total += serveApply.rmoney($(this).find('.after').text());
//			});
			$('#lectureFeeTable tbody .costTotal').text(serveApply.fmMoney(total));
			$('#lectureFeeTable tbody .costTotal-after').text(serveApply.fmMoney(afterTotal));
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
					'<td class="moneyText sum-pay">' + serveApply.fmMoney(n.carfare) + '</td>' +
					'<td style="text-align: left !important;" class="dec">' + (n.remarks || '') + '</td>' +
					'<td><input type="hidden" class="popM" value="1"/>' +
					'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
					'</td></tr>';
				//total += +n.carfare;
			});
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveApply.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveApply.fmMoney(totalTraffic) + '</td></tr>';
			$('#carFeeTable tbody .end-tr').before(html);
			//计算合计金额
			$('#carFeeTable tbody tr:not(.end-tr)').each(function() {
				total += serveApply.rmoney($(this).find('.sum-pay').text());
			});
			$('#carFeeTable tbody .costTotal').text(serveApply.fmMoney(total));
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
					'<td class="moneyText avg">' + serveApply.fmMoney(n.averageMoney) + '</td>' +
					'<td class="day">' + n.hotelDays + '</td>' +
					'<td class="moneyText sum-pay">' + serveApply.fmMoney(n.hotelExpense) + '</td>' +
					'<td style="text-align: left !important;" class="dec">' + (n.remarks || '') + '</td>' +
					'<td><input type="hidden" class="popM" value="2"/>' +
					'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
					'</td></tr>';
				//total += +n.hotelExpense;
			});
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveApply.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveApply.fmMoney(totalTraffic) + '</td></tr>';
			$('#hotelFeeTable tbody .end-tr').before(html);
			//计算合计金额
			$('#hotelFeeTable tbody tr:not(.end-tr)').each(function() {
				total += serveApply.rmoney($(this).find('.sum-pay').text());
			});
			$('#hotelFeeTable tbody .costTotal').text(serveApply.fmMoney(total));
		},
		/**
		 * //costNormalList	普通报销-费用明细/普通付款-付款明细 json
		 * 设置普通报销列表数据
		 * @param {Object} list
		 */
		setCostNormalList: function(list) {},
		/**
		 * 会议费会议详情数据
		 * @param {Object} list
		 */
		setMeetingList: function(list) {
			$.each(list, function(i, n) {
				//调用会议费类型赋值
				serveApply.getMeetingTypeCode(n.meetType); //meetType 会议分类
				$('#meetName').val(n.meetName); //meetName 会议名称
				$('#meetAddress').val(n.meetAddress); //meetAddress 会议地点中文
				$('#startTime').val(n.meetStartTime); //meetStartTime 会议开始时间
				$('#endTime').val(n.meetEndTime); //meetEndTime 会议结束时间
				$('#calculationSession').text(n.meetDays); //meetDays 会期
				$('#meetOfNum').val(n.meetOfNum); //meetOfNum 参会人数
				$('#meetWorkerNum').val(n.meetWorkerNum); //meetWorkerNum 工作人员数量
			});
		},
		/**
		 * 会议费费用明细数据
		 * @param {Object} list
		 */
		setMeetingCostList: function(list) {
			$.each(list, function(i, n) {
				$('#meetHotel').val($yt_baseElement.fmMoney(n.meetHotel)); //meetHotel 住宿费
				$('#meetFood').val($yt_baseElement.fmMoney(n.meetFood)); //meetFood 伙食费
				$('#meetOther').val($yt_baseElement.fmMoney(n.meetOther)); //meetOther 其他费用
				$('#costTotal').text($yt_baseElement.fmMoney(n.meetAmount)).css('color', '#333'); //meetAmount 费用合计
				$('#dailyAverageConsumption').text($yt_baseElement.fmMoney(n.meetAverage)).css('color', '#333'); //meetAverage 人均日均费用金额
			});
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
		/**
		 * 验证预算部门金额与支出申请金额
		 */
		verifyBudgetExpendSum: function() {
			//获取支出金额
			var expend = serveApply.rmoney($('.count-val-num').text());
			//获取预算金额
			//var budget = serveApply.rmoney($('#budgetBalanceAmount').text().replace('万元', '')) * 1000;
			var budget = serveApply.rmoney($('#deptBudgetBalanceAmount').text().replace('万元', '')) * 10000;
			//当部门可用预算余额小于支出事前申请金额或支出申请金额时，弹窗提示“部门预算可用余额小于当前申请的金额，请调整申请内容，或先保存页面信息，待部门预算调整后再重新提交申请。”
			if(false) {
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
		 * 获取培训类别下拉数据
		 * @param {Object} code
		 */
		getTrainingTypeOption: function(code) {
//			$.ajax({
//				type: "post",
//				url: "basicconfig/dictInfo/getDictInfoByTypeCode",
//				async: false,
//				data: {
//					dictTypeCode: 'TRAIN_TYPE'
//				},
//				success: function(data) {
//					//获取数据list
//					var list = data.data || [];
//					//初始化HTML文本
//					var start = '<option value="">请选择</option>',
//						optone = start,
//						opttwo = start,
//						travelType = start,
//						vehicle = start;
//					//循环添加文本
//					$.each(list, function(i, n) {
//						//培训类型
//						travelType += '<option ' + (code == n.value ? 'selected="selected"' : '') + ' value="' + n.value + '">' + n.disvalue + '</option>';
//					});
//					//培训类型
//					$('#meetingClassification').html(travelType);
//					$("select#meetingClassification option").each(function() {
//						if($(this).val() == 'TRAIN_TYPE_3') {
//							$(this).attr("selected", true);
//						}
//					});
//					$('#meetingClassification').niceSelect();
//				}
//			});
		},
		/**
		 * 会议费类型code
		 * @param {Object} code
		 */
		getMeetingTypeCode: function(code) {
//			$.ajax({
//				type: "post",
//				url: "basicconfig/dictInfo/getDictInfoByTypeCode",
//				async: true,
//				data: {
//					dictTypeCode: 'MEET_CODE'
//				},
//				success: function(data) {
//					//获取数据list
//					var list = data.data || [];
//					//初始化HTML文本
//					var start = '<option value="">请选择</option>';
//					//循环添加文本
//					$.each(list, function(i, n) {
//						start += '<option ' + (code == n.value ? 'selected="selected"' : '') + ' value="' + n.value + '">' + n.disvalue + '</option>';
//					});
//					//替换页面代码
//					$('#meetingClassification').html(start).niceSelect();
//				}
//			});
		}
	};

	$(function() {
		serveApply.init();
	});
})(jQuery, window);