(function($, window) {
	var serveFunds = {
		specialName: "",
		prjName: "",
		saveData: {},
		beforeCostList: [], //事前审批数据
		addressList: [], //全局的地区数据
		selUsersName: "", //用户名
		selUsersCode: "", //用户code
		usersInfoList: "", //出差人集合
		usersInfoJson: "", //出差人json
		riskExcMark: "../../../../../resources-sasac/images/common/war-red.png", //风险感叹号图片
		riskWarImg: "../../../../../resources-sasac/images/common/risk-war.png", //风险未通过图片红灯
		riskViaImg: "../../../../../resources-sasac/images/common/risk-via.png", //风险通过图片绿灯
		pid: '',
		/**
		 * 开始执行
		 */
		init: function() {
			var ts = this;

			//获取修改参数
			serveFunds.pid = $yt_common.GetQueryString('appId');
			if(serveFunds.pid) {
				//参数存在时获取对应的详情数据
				ts.getAdvanceUpdateAppInfoDetailByAdvanceAppId(serveFunds.pid);
				ts.showTrainFun();
			} else {
				//所属预算项目
				ts.setBudgetItme();
				//初始显示培训支出
				ts.showTrainFun();

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
			sysCommon.getApproveFlowData("SZ_CHANGEPRJ_APP");
			//当前登录人code
			$('#applicantUser').val($yt_common.user_info.userName);
			//获取人员信息
			ts.getBusiTripUsersList('');
			//点击下拉框显示
			ts.getArrearsAmount();
			ts.getChoiceLoanList();
			ts.subBtn();
			ts.saveBtn();
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
		//选择显示
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
			});
			$("#payeeName").change(function() {
				var jobLevelName = $("#payeeName").find("option:selected").attr("jobLevelName");
				var deptName = $("#payeeName").find("option:selected").attr("deptName");
				$(".pe-department").text(deptName);
				$(".pe-rank").text(jobLevelName);
				var isChange = $("#payeeName").find("option:selected").val();
				if(isChange == 'external' || isChange == 'noUser') {
					$(".display-rank").show();
					$(".pe-department").text("外部人员");
					$(".dis-r").hide();
					$(".where-company").show();
					$(".where-company").attr("validform", "{isNull:true,blurFlag:true,msg:'请输入收款人所在单位'}")
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
			})
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
			//清除事前申请单选中
			$('.clear-prior-approval').on('click', function() {
				//显示提示信息
				$yt_alert_Model.alertOne({
					alertMsg: '修改事前申请单会导致已导入的信息丢失，是否继续当前操作？',
					confirmFunction: function() {
						//事前申请单号
						$('.prior-approval').val('');
						//可用余额
						$('#advanceAppBalance').text('--');
						//显示相关联的按钮及字段
						$('.advance-relevance').hide();
						//赋值id
						$('#advanceAppId').val('');
						//隐藏导入按钮
						$('.index-main-div .export-but').hide();
						//项目名称
						$('#prjName').text('');
						//清空已导入的数据
						serveFunds.clearPriorApproval();
						$(".train-district").hide();
						$(".ser-bars").hide();
						$(".else-div").hide();
						$(".ordinar-div").hide();
						$(".pro-dis").hide();
						$(".cost-hide").show();
						//隐藏清除按钮
						$('.clear-prior-approval').hide();
						$('.yt-textarea').val('');
						$("#predictAllMoney").hide();
						$('#preTaxAllMoney').val('0.00');
						$('#afterTaxAllMoney').val('0.00');
					}
				});
			});
			//费用类型切换
			$('.docu-style').change(function() {
				//var code = $(this).find('option:selected').attr('code');
				var iput = $('.docu-style:checked');
				var code = iput.val();
				var fun = iput.attr('fun');
				if(code) {
					//相关区域显示
					me[fun]();
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
			//从事前审批单导入行程明细
			//从事前审批单导入差旅费用明细
			//事前审批导入处理
			me.exportDataEvent();
			//费用明细列表相关事件
			me.paymentListEvent();
			//选择事前审批单相关事件
			me.priorApprovalEvent();
			//填写对象信息相关事件
			me.msgListEvent();
			//选择借款单相关事件
			me.borrowListEvent();
			//选择所属专项名称相关事件
			me.specialListEvent();
			//普通报销列表相关事件
			me.generalListEvent();
			//差旅费用相关事件
			me.costApplyAlertEvent();
			//TAB切换方法
			$(".receipt-alert .cost-type-tab li").click(function() {
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
		},
		saveBtn: function() {
			//保存草稿
			$('#savePayment').on('click', function() {
				var thisBtn = $(this);
				$(this).attr('disabled', true).addClass('btn-disabled');
				// 获取数据
				var data = serveFunds.getSubData();
				//保存方法
				serveFunds.saveReimAppInfoToDrafts(data, thisBtn);
			});
		},
		subBtn: function() {
			//生成
			$('#submitPayment').on('click', function() {
				var thisBtn = $(this);

				if($yt_valid.validForm($('.base-info-form-modle,.approve-div'))) {
					//验证预算余额与申请金额
					var verifyBudgetExpendSum = true; // serveFunds.verifyBudgetExpendSum();
					if(verifyBudgetExpendSum) {
						//补领金额
						var replaceMoney = serveFunds.rmoney($('#replaceMoney').text());
						//补领合计
						var total = serveFunds.rmoney($('.amount-table .total').text());
						//合计金额应等于补领金额  ，提交/保存时校验。
						if(total == replaceMoney) {
							thisBtn.attr('disabled', true).addClass('btn-disabled').off();
							// 获取数据
							var data = serveFunds.getSubData();
							//保存方法
							serveFunds.submitReimAppInfo(data, thisBtn);
						} else {
							$yt_alert_Model.prompt('补领方式金额合计必须等于补领金额');
						}
					}
				} else {
					sysCommon.pageToScroll($(".base-info-form-modle .valid-font"));
					//					thisBtn.attr('disabled', false).removeClass('btn-disabled');
				}
			});
		},
		/**
		 * 清除导入的事前申请单数据
		 */
		clearPriorApproval: function() {
			//获取费用类型
			var costType = $('.docu-style-box input:checked').val();
			//先删除列表中导入的数据
			$('.cost-apply-model table tr.exports').remove();
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
		},
		/**
		 * 验证预算部门金额与支出申请金额
		 */
		verifyBudgetExpendSum: function() {
			//获取支出金额
			var expend = serveFunds.rmoney($('#serveAllMoney').text());
			//获取预算金额
			var budget = serveFunds.rmoney($('#advanceAppBalance').text().replace('万元', '')) * 10000;
			//var budget = serveFunds.rmoney($('#budgetBalanceAmount').text().replace('万元', '')) * 1000;
			//当部门可用预算余额小于支出事前申请金额或支出申请金额时，弹窗提示“部门预算可用余额小于当前申请的金额，请调整申请内容，或先保存页面信息，待部门预算调整后再重新提交申请。”
			if(budget < expend) {
				$yt_alert_Model.alertOne({
					haveCloseIcon: true, //是否带有关闭图标  
					leftBtnName: "确定", //左侧按钮名称,默认确定  
					cancelFunction: "", //取消按钮操作方法
					alertMsg: "部门预算可用余额小于当前申请的金额，请调整申请内容，或先保存页面信息，待部门预算调整后再重新提交申请。", //提示信息  
					//alertMsg: "单位预算可用余额小于当前申请的金额，请调整申请内容，或先保存页面信息，待单位预算调整后再重新提交申请。", //提示信息  
					cancelFunction: function() {},
				});
				return false;
			}
			return true;
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
							$('#'+fileElementId).val('');
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
		 * 事前审批导入事件处理
		 */
		exportDataEvent: function() {
			var me = this;
			//导入招待对象信息
			$('#exportMst').on('click', function() {
				//接待对象信息集合
				var costReceptionistList = me.beforeCostList.costData.costReceptionistList;
				//接待对象列表数据显示
				me.setCostReceptionistList(costReceptionistList);

			});
			//导入招待费用明细
			$('#exportPayment').on('click', function() {
				//费用明细信息集合
				var costDetailsList = me.beforeCostList.costData.costDetailsList;
				//招待费详情列表数据显示
				me.setCostDetailsList(costDetailsList);
				me.getTotleMoney();
			});
			//导入行程明细
			$('#exportTrip').on('click', function() {
				//取得保存的事前审批数据
				var list = me.beforeCostList.costData.travelRouteList;
				//赋值列表
				me.setTravelRouteList(list, true);
			});
			//导入差旅费用明细
			$('#exportTravel').on('click', function() {
				//costCarfareList	城市间交通费
				var costCarfareList = me.beforeCostList.costData.costCarfareList;
				me.setCostCarfareList(costCarfareList);
				//costHotelList	住宿费
				var costHotelList = me.beforeCostList.costData.costHotelList;
				//住宿费列表设置
				me.setCostHotelList(costHotelList);
				//costOtherList	其他费用
				var costOtherList = me.beforeCostList.costData.costOtherList;
				//列表数据显示
				me.setCostOtherList(costOtherList);
				//costSubsidyList	补助明细
				var costSubsidyList = me.beforeCostList.costData.costSubsidyList;
				//补助明细列表显示
				//me.setCostSubsidyList(costSubsidyList);
				//重新计算总金额
				me.updateApplyMeonySum();
			});

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
		//		getTotleMoney: function() { //获取所有的金额
		//			var tds = $('#paymentList tbody .money');
		//			var total = 0;
		//			//计算合计金额
		//			$.each(tds, function(i, n) {
		//				total += +$(n).attr('money');
		//			});
		//			var fmTotal = $yt_baseElement.fmMoney(total);
		//			//赋值合计金额
		//			$('#paymentList tbody .total-money').text(fmTotal);
		//			//报销总金额
		//			$('#serveAllMoney').text(fmTotal).attr('num', total);
		//			//报销总额
		//			$('#amountTotalMoney').text(fmTotal).attr('num', total);
		//			//大写转换
		//			$('#TotalMoneyUpper').text(arabiaToChinese(fmTotal + ''));
		//			//获取借款单可用余额
		//			var outstandingBalance = serveFunds.rmoney($('#outstandingBalance').text());
		//			//冲销金额：只读信息，读取逻辑：如果报销金额小于借款单可用余额，则读取报销总额；如果报销金额大于等于借款单可用余额，则读取借款单可用余额
		//			var writeOffAmount = total >= outstandingBalance ? outstandingBalance : total;
		//			$('#writeOffAmount,#outWriteAmount').text(serveFunds.fmMoney(writeOffAmount));
		//			// 补领金额：计算项，计算逻辑：如果报销金额小于借款单可用余额，则为0.00；如果报销金额大于等于借款单可用余额，则报销金额-冲销金额的金额值
		//			var replaceMoney = total >= outstandingBalance ? total - writeOffAmount : 0;
		//			/*if(replaceMoney <= 0) {
		//				//补领金额是零的时候 ，补领方式 几个输入框禁用，默认值都是0.
		//				$('#officialCard,#cash,#cheque').val('0').attr('disabled', true);
		//				$('.amount-table .total').text('0');
		//			} else {
		//				$('#officialCard,#cash,#cheque').attr('disabled', false);
		//			}*/
		//			$('#replaceMoney').text(serveFunds.fmMoney(replaceMoney));
		//			//报销后借款单余额：计算项，计算逻辑：如果报销金额小于借款单可用余额，则借款单可用余额-报销金额；如果报销金额大于风雨借款单可用余额；则显示为0.00
		//			$('#balanceMoney').text(serveFunds.fmMoney(total < outstandingBalance ? outstandingBalance - total : '0'));
		//		},
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
				//可用余额
				var balance = tr.find('.balance').val();
				//事前申请事由
				var advanceAppName = tr.attr('advanceAppName');
				if(code) {
					//获取事前申请数据
					me.getAdvanceAppInfoDetailByAdvanceAppId(id);
					//事前申请单号
					$('.prior-approval').val(code);
					//事前申请事由
					$('#advanceAppName').css({
						"color": "#333",
						"padding": "0"
					}).text(advanceAppName);
					//可用余额
//					$('#advanceAppBalance').css({
//						"color": "#333",
//						"padding": "0"
//					}).text(balance ? serveFunds.fmMoney(balance) + '万元' : '--');
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
					//成功后显示导入按钮
					//					$('.index-main-div .export-but').show();
					$(".train-district").show();
					$(".ser-bars").show();
					$(".else-div").show();
					$(".ordinar-div").show();
					$(".pro-dis").show();
					$(".cost-hide").hide();
				} else {
					$yt_alert_Model.prompt('请选择一条数据');
				}
			});

			//取消事件
			$('.prior-cancel,.prior-alert .closed-span').click(function() {
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
							//重新设置出差人数据
							/*var trs = $('#tripList tbody tr');
							trs.each(function(i, n) {
								//获取到每行的出差人数据进行拆分
								var users = $(n).attr('usercode').split(',');
								for(var j = 0, len = users.length; j < len; j++) {
									
									
								}
							});*/

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
						//重新配置补助明细合计
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
				$('#modelBusiAddres').html('<option value="">请选择</option>');
				//清空存储出差人的数据
				me.selUsersName = "";
				me.selUsersCode = "";
				me.clearAlert($('#busiPlanEditModel'));
			});

			//费用明细新增
			$('#addCostApplyBtn').click(function() {
				//显示弹框
				me.showCostApplyAlert();
				//绑定处理事件
				me.busiTripUserModelEvent();
				$('#modelSureBtn').off().on('click', function() {
					//获取当前选中的tab值0交通费,1住宿费2其他
					var tabFlag = $("#costApplyAlert .cost-type-tab li.tab-check .hid-tab").val();
					var validModel = "";
					if(tabFlag == 0) {
						validModel = $("#costApplyAlert .traffic-form");
					} else if(tabFlag == 1) {
						validModel = $("#costApplyAlert .hotel-form");
					} else if(tabFlag == 2) {
						validModel = $("#costApplyAlert .other-form");
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
				$("#costApplyAlert .cost-type-tab ul li").removeClass("tab-check");
				$('#costApplyAlert .cost-type-tab ul li input[value="' + costType + '"]').parent().addClass("tab-check");
				//显示相对应的表单
				if(costType == 0) {
					$(".traffic-form").show();
					//改变风险灯为绿灯
					//$(".traffic-form .risk-img").attr("src", me.riskViaImg);
				}
				if(costType == 1) {
					$(".hotel-form").show();
					$(".traffic-form").hide();
					//改变风险灯为绿灯
					//$(".hotel-form .risk-img").attr("src", me.riskViaImg);
				}
				if(costType == 2) {
					$(".other-form").show();
					$(".traffic-form").hide();
					//改变风险灯为绿灯
					//$(".other-form .risk-img").attr("src", me.riskViaImg);
				}
				//重置按钮
				$('#modelSureBtn').off().on('click', function() {
					me.appendCostApplyList(costType, tr);
				});
			});

			//费用明细关闭
			$('#modelCanelBtn').click(function() {
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
					var total = serveFunds.rmoney($('#serveAllMoney').text());
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
		 * 获取事前审批单列表
		 */
		getPriorApprovalList: function() {
			//表格区域
			var tbody = $('.prior-approval-list tbody');
			var queryParams = $('.prior-approval-val').val();
			//费用类型
			var costType = 'TRAIN_APPLY';
			//分页区域
			var pageDiv = $('.prior-page');
			$('.prior-page').pageInfo({
				pageIndex: 1,
				pageNum: 5, //每页显示条数  
				pageSize: 3, //显示...的规律  
				url: "sz/advanceApp/getAdvanceAppListToPageByParams", //ajax访问路径  
				objName: 'data',
				data: {
					type: 'ADVANCE_APP',
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
								var advanceAppName=n.advanceAppName;
								if(advanceAppName.length>17){
									advanceAppName=n.advanceAppName.substr(0,15)+"...";
								}
								trStr += '<tr specialName="' + n.specialName + '" advanceAppName="' + n.advanceAppName + '"  pid="' + n.advanceAppId + '" code="' + n.advanceAppNum + '">' +
									'<td>' + n.advanceAppNum + '<input type="hidden" class="balance" value="' + n.advanceAppBalance + '" /></td>' +
									'<td>' + n.applicantUserName + '</td>' +
									'<td>' + n.applicantUserDeptName + '</td>' +
									'<td title='+n.advanceAppName+'>' + advanceAppName + '</td>' +
									'<td>' + n.advanceCostTypeName + '</td>' +
									'<td>' + n.applicantTime + '</td>' +
									/*'<td class="sname">XX专项</td>' +*/
									'</tr>';
								trStr = $(trStr).data("bearInfoData", n);
								tbody.append(trStr);
							});
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
		 * 获取所属专项列表
		 */
		getSpecialList: function() {
			//表格区域
			var tbody = $('.special-list tbody');
			//分页区域
			var pageDiv = $('.special-page');
			//模糊查询条件
			var quertStr = $('.special-val').val();
			$('.special-page').pageInfo({
				pageIndex: 1,
				pageNum: 5, //每页显示条数  
				pageSize: 3, //显示...的规律  
				url: "sz/advanceApp/getAdvanceAppListToPageByParams", //ajax访问路径  
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
									'<td style="text-align:right;">10,000.00</td>' +
									'<td>8,500.00</td>' +
									'</tr>';
							});
							tbody.append(trStr);
						} else {
							//隐藏分页
							pageDiv.hide();
							var noTr = '<tr class="model-no-data-tr"><td colspan="4"><div class="no-data"><img src="../../../../../resources-sasac/images/common/no-data.png" alt=""></div></td></tr>';
							tbody.append(noTr);
						}
					}
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
			textareas.val('');
		},
		/**
		 * 1.1.5事前申请变更信息：项目事前申请变更提交
		 * @param {Object} subData
		 */
		submitReimAppInfo: function(subData, thisBtn) {
			$.ajax({
				type: "post",
				url: "sz/advanceAppUpdate/submitAdvanceChangeAppInfo",
				async: true,
				data: subData,
				success: function(data) {
					$yt_alert_Model.prompt(data.message);
					if(data.flag == 0) {
						subData.appId = data.data;
						serveFunds.submitWorkFlow(subData);
					} else if(data.flag==5){
						serveFunds.subBtn();
					} else {
						serveFunds.subBtn();
					}
					thisBtn.attr('disabled', false).removeClass('btn-disabled');
				}
			});
		},
		/**
		 * 1.1.6事前变更申请信息：提交表单  流程部分
		 * @param {Object} subData
		 */
		submitWorkFlow: function(subData /*, thisBtn*/ ) {
			$.ajax({
				type: "post",
				url: "sz/advanceAppUpdate/submitWorkFlow",
				async: true,
				data: subData,
				success: function(data) {
					$yt_alert_Model.prompt(data.message);
					if(data.flag == 0) {
						//打开单据粘贴单
						//						window.open($yt_option.websit_path + 'view/projectManagement-sasac/expensesReim/module/print/InvoicePasting.html?reimId=' + data.data);
						//跳转审批页面
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
					}
					//					thisBtn.attr('disabled', false).removeClass('btn-disabled');
				}
			});
		},
		/**
		 * 1.1.3.2	报销申请信息：保存至草稿箱
		 * @param {Object} subData
		 */
		saveReimAppInfoToDrafts: function(subData, thisBtn) {
			$.ajax({
				type: "post",
				url: "sz/advanceAppUpdate/saveAdvanceChangeAppInfo",
				data: subData,
				success: function(data) {
					$yt_alert_Model.prompt(data.message);
					if(data.flag == 0) {
						//跳转审批页面
						//window.location.href = $yt_option.websit_path + 'view/projectManagement-sasac/expensesReim/module/reimApply/reimApproveList.html';
						$yt_common.parentAction({
							url: $yt_option.parent_action_path, //父级中转地址,固定配置项,只有统一修改处理。
							funName: 'locationToMenu', //指定方法名，定位到菜单方法
							data: {
								url: 'view/projectManagement-sasac/expensesReim/module/approval/draftsList.html' //要跳转的页面路径
							}
						});
					} else {
						serveFunds.saveBtn();
					}
					//					thisBtn.attr('disabled', false).removeClass('btn-disabled');
				}
			});
		},
		/**
		 * 1.1.3.4	根据报销申请Id获取报销申请详细信息
		 * @param {Object} reimAppId
		 */
		//		getReimAppInfoDetailByReimAppId: function(reimAppId) {
		//			var me = this;
		//			$.ajax({
		//				type: "post",
		//				url: "sz/reimApp/getReimAppInfoDetailByReimAppId",
		//				data: {
		//					reimAppId: reimAppId
		//				},
		//				success: function(data) {
		//					var d = data.data;
		//					//申请人填报
		//					if(d.taskKey == 'activitiStartTask') {
		//						//删除保存按钮
		//						$('#savePayment').remove();
		//					}
		//					//数据回显
		//					me.showDetail(d);
		//				}
		//			});
		//		},
		/**
		 * 1.1.8根据事前申请Id获取事前申请变更详细信息 
		 * @param {Object} appId
		 * @param {Object} costType
		 */
		getAdvanceUpdateAppInfoDetailByAdvanceAppId: function(advanceAppId) {
			var me = this;
			$.ajax({
				type: "post",
				url: "sz/advanceAppUpdate/getAdvanceUpdateAppInfoDetailByAdvanceAppId",
				async: true,
				data: {
					advanceAppId: advanceAppId
				},
				success: function(data) {
					$(".train-district").show();
					$(".ser-bars").show();
					$(".else-div").show();
					$(".ordinar-div").show();
					$(".pro-dis").show();
					$(".cost-hide").hide();
					//数据回显
					if(data.data.advanceCostType=='TRAIN_APPLY'){
						$("#predictAllMoney").show();
					}
					me.showDetail(data.data);
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
					trainApplyInfoList: me.changeTrainApplyInfoList(), //changeTrainApplyInfoList	师资-培训信息json
					teacherApplyInfoList: me.changeTeacherApplyInfoList(), //changeTeacherApplyInfoList	师资-讲师信息json
					costTrainApplyInfoList: me.changeCostTrainApplyInfoList(), //changeCostTrainApplyInfoList	师资-培训费json
					costPredictInfoList:me.changeCostPredictInfoList(),
					costTeachersFoodApplyInfoList: me.changeCostTeachersFoodApplyInfoList(), //changeCostTeachersFoodApplyInfoList	师资-伙食费json
					costTeachersLectureApplyInfoList: me.changeCostTeachersLectureApplyInfoList(), //changeCostTeachersLectureApplyInfoList	师资-讲课费json
					costTeachersTravelApplyInfoList: me.changeCostTeachersTravelApplyInfoList(), //changeCostTeachersTravelApplyInfoList	师资-城市间交通费json
					costTeachersHotelApplyInfoList: me.changeCostTeachersHotelApplyInfoList(), //changeCostTeachersHotelApplyInfoList	师资-住宿费 json
					costNormalList: me.costNormalList(), //costNormalList	普通报销-费用明细/普通付款-付款明细 json
					projectBudgetList:me.projectBudgetList(),//预算变更
					projectBudgetDetails:me.projectBudgetDetails()//预算变更前
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
						code += val + ',';
					}
				});
				code = (code.substring(code.length - 1) == ',') ? code.substring(0, code.length - 1) : code;
				return code;
			};
			return {
				advanceAppIdUpdate: serveFunds.pid, //advanceAppId	事前申请id
				advanceAppId: $('#advanceAppId').val(),
				//				loanAppId: $('#loanAppId').val(), //loanAppId	借款申请表id
				//				reimAppId: $('#reimAppId').val(), //reimAppId	报销申请表id
				advanceAppNum: $('.prior-approval').val(), //advanceAppNum	事前申请单号
				advanceAppReason: $('#advanceAppName').text(), //advanceAppReason	事前申请事由
				costType: 'TRAIN_APPLY', //costType	费用类型
				advanceAmount: serveFunds.rmoney($('#serveAllMoney').text()), //advanceAmount	申请预算总金额
				doAdvanceAmount: serveFunds.rmoney($('#doAdvanceAmount').text()), //doAdvanceAmount	可用支出金额
				isSpecial: /*$('#isSpecial .check input').val()*/ '', //isSpecial	是否专项(1 是 2 否)
				specialCode: specialCode(), //specialCode	专项所属code
				prjCode: '', //prjCode 项目唯一标识code
				prjName: $('#prjName').text(), //prjName 项目名称
				specialName: $('#specialName').text(),
				specialCode: $('#specialCode').val(),
				applicantUser: $('#applicantUser').val(), //applicantUser	申请人code
				advanceAttIdStr: me.getFileList(), //attIdStr	附件id,字符串,逗号分隔
				parameters: '', //parameters	JSON格式字符串, 

				writeOffAmount: serveFunds.rmoney($('#writeOffAmount').text()), //writeOffAmount	冲销金额
				officialCard: rMoney($('.amount-table .official').val() || '0'), //officialCard	公务卡金额
				cash: rMoney($('.amount-table .cash').val() || '0'), //cash	现金金额
				cheque: rMoney($('.amount-table .cheque').val() || '0'), //cheque	支票金额
				transfer: 0, //transfer	转账金额
				paymentDate: '', //paymentDate	支付日期
				paymentAmount: 0, //paymentAmount	支付金额
				cmTotalAmount: 0, //cmTotalAmount	支付明细_报销总金额
				cmWriteOffAmount: 0, //cmWriteOffAmount	支付明细_冲销金额
				cmOfficialCard: 0, //cmOfficialCard	支付明细_公务卡金额
				cmCash: 0, //cmCash	支付明细_现金金额
				cmCheque: 0, //cmCheque	支付明细_支票金额
				cmTransfer: 0, //cmTransfer	支付明细_转账金额
				dealingWithPeople: $('#approve-users option:selected').val(), //dealingWithPeople	下一步操作人code
				opintion: $('#opintion').val(), //opintion	审批意见
				processInstanceId: $('#processInstanceId').val(), //processInstanceId	流程实例ID, 
				nextCode: $('#operate-flow option:selected').val(), //nextCode	操作流程代码
				costData: costData(), //costData	费用申请json
				billingVoucherJson: '' //billingVoucherJson	记账凭证json

			};
		},
		projectBudgetList:function(){
			var list = [];
			$.each($('#teachBeforeTable tbody tr'), function(i,n) {
				list.push({
					costCode:$(n).find('.cost-code').val(),
					budgetCost:$yt_baseElement.rmoney($(n).find('.budgetCost').text()),
					accordingInstructions:$(n).find('.accordingInstructions').text()
				})
			});
			$.each($('#trainingBeforeTable tbody tr'), function(i,n) {
				list.push({
					costCode:$(n).find('.cost-code').val(),
					budgetCost:$yt_baseElement.rmoney($(n).find('.budgetCost').text()),
					accordingInstructions:$(n).find('.accordingInstructions').text()
				})
			});
			return list;
		},
		projectBudgetDetails:function(){
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
		 * changeTrainApplyInfoList	师资-培训信息json
		 */
		changeTrainApplyInfoList: function() {
			var list = [];
			//获取列表
			/*var trs = $('#trainingPopTable tbody tr:not(.last)');
			var tr = null;
			$.each(trs, function(i, n) {
				//单个tr
				tr = $(n);*/
			list.push({
				trainType: $("#meetingClassification option:selected").val(), //trainType	培训类型
				regionDesignation: $("#regionDesignation").text(), //regionDesignation	培训名称
				projectId: $(".projectId").val(), //regionDesignation	培训名称
				regionName: $("#regionName").val(), //regionName	培训地点中文
				reportDate: $("span[data-text=reportDate]").text(), //reportTime	报到时间
				outHospitalDate: $("span[data-text=outHospitalDate]").text(), //endTime	结束时间
				trainDays: +$('#calculationSession').val() || '0' + '', //trainDays	培训天数
				budgetTraineeSum: $(".trainOfNum").text(), //trainOfNum	培训人数
				workerNum: $("#workerNum").val(), //workerNum 工作人员数量
				approvaNum: $("#approvaNum").val(), //approvaNum	批准文号
				chargeStandard: $("#chargeStandard").val(), //chargeStandard 收费标准
				costStandard:$('.costStandard').val(),
				offSiteTrainingRequirement:$("p[data-text=offSiteTrainingRequirement]").text(),
				isOffSiteTraining:$('.isOffSiteTraining').val(),
				reason: $(".details-textarea").val() //reason 调整原因
				/*});*/
			});
			return list;
		},
		/***
		 * changeTeacherApplyInfoList	师资-讲师信息json
		 */
		changeTeacherApplyInfoList: function() {
			var list = [];
			//获取列表
			var trs = $('#lecturerTable tbody tr:not(.last)');
			var tr = null;
			$.each(trs, function(i, n) {
				//单个tr
				tr = $(n);
				list.push({
					lecturerId: tr.find('.lectureId').val(), //lecturerId	讲师Id
					lecturerName: tr.find('.lecturerName span').text(), //lecturerName	讲师名称
					lecturerTitleCode: tr.attr('lecturerTitleCode'), //lecturerTitleCode	讲师职务code
					lecturerLevelCode: tr.attr('lecturerLevelCode'), //lecturerLevelCode	讲师职务级别code
					lecturerTitleName: tr.find('.professional').text(), //lecturerTitleName	讲师职务名称
					lecturerLevelName: tr.find('.level').text(), //lecturerLevelName	讲师职务级别名称
					reason: $(".lecturer-textarea").val() //reason 调整原因
				});
			});
			return list;
		},
		/**
		 * changeCostTrainApplyInfoList	师资-培训费json
		 */
		changeCostTrainApplyInfoList: function() {

			var list = [];
			//获取列表
			var trs = $('#trainingFeeTable tbody tr:not(.last)');
			var tr = null;
			$.each(trs, function(i, n) {
				//单个tr
				tr = $(n);
				list.push({
					trainType: tr.attr('costnameval'), //trainType	培训类型
					trainTypeName: tr.find('.cost-name').text(), //trainTypeName	费用名称
					trainDays: tr.find('.day-num').text(), //trainDays	培训天数
					trainOfNum: tr.find('.people-num').text(), //trainOfNum	报道人数
					standard: serveFunds.rmoney(tr.find('.standard-money').text()), //standard	标准
					averageMoney: serveFunds.rmoney(tr.find('.smallplan-money').text()), //averageMoney	小计
					remark: tr.find('.special-instruct').text(), //trainTypeName	费用名称
					setMethod: '', //setMethod	结算方式
					reason: $(".other-textarea").val() //reason 调整原因

				});
			});
			return list;

		},
		changeCostPredictInfoList: function() {

			var list = [];
			//获取列表
			var trs = $('#predictCostTable tbody tr:not(.last)');
			var tr = null;
			$.each(trs, function(i, n) {
				//单个tr
				tr = $(n);
				list.push({
					predictName: tr.find('.cost-name').text(), //costName	费用名称
					predictPeopleNum: tr.find('.predict-people-num').text(), //peopleNum	报道人数
					predictStandardMoney: serveFunds.rmoney(tr.find('.predict-standard-money').text()), //standardMoney	标准
					averageMoney: serveFunds.rmoney(tr.find('.predict-smallplan-money').text()), //averageMoney	小计
					remark: tr.find('.special-instruct').text(), //specialInstruct	特殊说明
					setMethod: '', //setMethod	结算方式
					reason: $(".predictCost-textarea").val() //reason 调整原因

				});
			});
			return list;

		},
		/**
		 * changeCostTeachersFoodApplyInfoList	师资-伙食费json
		 */
		changeCostTeachersFoodApplyInfoList: function() {
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
					remarks: tr.find('.dec').text(), //remarks	特殊说明
					setMethod: '', //setMethod	结算方式
					reason: $(".food-textarea").val() //reason 调整原因

				});
			});

			return list;
		},
		/**
		 * changeCostTeachersLectureApplyInfoList	师资-讲课费json
		 */
		changeCostTeachersLectureApplyInfoList: function() {
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
					remarks: /*tr.find('.lectureId').val()*/ '', //remarks	特殊说明
					setMethod: '', //setMethod	结算方式
					reason: $(".lecture-textarea").val() //reason 调整原因

				});
			});
			return list;
		},
		/**
		 * changeCostTeachersTravelApplyInfoList	师资-城市间交通费json
		 */
		changeCostTeachersTravelApplyInfoList: function() {
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
					remarks: tr.find('.dec').text(), //remarks	特殊说明
					setMethod: '', //setMethod	结算方式
					reason: $(".traffic-textarea").val() //reason 调整原因
				});
			});
			return list;
		},
		/**
		 * changeCostTeachersHotelApplyInfoList	师资-住宿费 json
		 */
		changeCostTeachersHotelApplyInfoList: function() {
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
					remarks: tr.find('.dec').text(), //remarks	特殊说明
					setMethod: '', //setMethod	结算方式
					reason: $(".accommodation-textarea").val() //reason 调整原因
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
					normalInstructions: tr.find('.reimInstructions').text(),
				});
			});

			return list;

		},
		/**
		 * 报销申请数据回显
		 * @param {Object} data
		 */
		showDetail: function(d) {
			var me = this;

			//把公用的金额格式化方法存一下
			var fmMoney = $yt_baseElement.fmMoney;

			//加载完成判断是否存在审批单
			//			if(d.advanceAppNum) {
			//				//成功后显示导入按钮
			//				//				$('.index-main-div .export-but').show();
			//				serveFunds.(serveFunds.saveData.advanceAppId || '', true);
			//			}
			$('#advanceAppId').val(d.advanceAppIdUpdate); //advanceAppId	事前申请id
			$('#advanceAppIdUpdate').val(d.advanceAppId);
			//			$('#formNum').text(d.advanceAppNum); //事前申请编号
			$('.prior-approval').val(d.advanceAppNum);
			//			if(d.advanceAppNum) {
			//				//赋值显示事前审批单可用余额
			//				$('#advanceAppBalance').text(d.advanceAppBalance ? serveFunds.fmMoney(d.advanceAppBalance) + '万元' : '--');
			//				$('.advance-relevance').show();
			//			}
			$('#advanceAppBalance').css({
				"color": "#333",
				"padding": "0"
			}).text(d.deptBudgetBalanceAmount ? $yt_baseElement.fmMoney(d.deptBudgetBalanceAmount) + '万元' : '--'); //预算剩余额度

			$('#budgetBalanceAmount').css({
				"color": "#333",
				"padding": "0"
			}).text(d.budgetBalanceAmount ? $yt_baseElement.fmMoney(d.budgetBalanceAmount) + '万元' : '--');
			$('#advanceAppName').css({
				"color": "#333",
				"padding": "0"
			}).text(d.advanceAppName || '--'); //advanceAppName	事前申请事由
			//costType	费用类型
			//me.getCostTypeList(d.costType);
			//			$('.docu-style[value="' + d.costType + '"]').setRadioState('check');
			//costTypeName	费用类型名称
			//isSpecial	是否专项(1 是 2 否)
			//$('#special' + d.isSpecial).setRadioState('check');
			//			var specialCodeArr = d.specialCode.split(','); //specialCode	所属预算项目code
			//			var specialNameArr = d.specialName.split('-'); //specialName	所属预算项目名称
			//设置所属预算项目数据
			//			me.setBudgetItme(specialCodeArr);
			//specialCode	所属预算项目code
			$('#specialCode').val(d.specialCode || '--');
			$('#specialName').css({
				"color": "#333",
				"padding": "0"
			}).text(d.specialName || '--'); //specialName	所属预算项目名称
			var arr = d.specialCode.split("-");
			if(arr[0] == 'SC_395') {
				$('#prjName').css({
					"color": "#333",
					"padding": "0"
				}).text(d.prjName || '--'); //prjName   项目名称
				$('.prj-name-tr').show();
			} else {
				$('.prj-name-tr').hide();
			}
			$('#taxAmount').text(serveFunds.fmMoney(d.taxAmount)); //taxAmount	相关课酬税金
			//loanAppBalance	借款可用剩余额度
			$('#outstandingBalance').text(serveFunds.fmMoney(d.arrearsAmount));
			//本次冲销金额：报销总额大于欠款 ，本次冲销=欠款金额,报销总额小于等于欠款，本次冲销=报销总额。
			var outWriteAmount = d.totalAmount <= d.arrearsAmount ? d.totalAmount : d.arrearsAmount;
			$('#outWriteAmount').text(serveFunds.fmMoney(outWriteAmount));
			//totalAmount	报销总金额
			$('#serveAllMoney').text(fmMoney(d.advanceAmount || '0')).attr('num', d.advanceAmount);
			//$('#amountTotalMoney').text(fmMoney(d.totalAmount || '0')).attr('num', d.totalAmount);
			$('#paymentList .total-money').text(fmMoney(d.totalAmount || '0')).attr('num', d.totalAmount);
			$('#TotalMoneyUpper').text(arabiaToChinese(d.advanceAmount || '0'));
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
			//大写
			$('#TotalMoneyUpper').text(arabiaToChinese(d.advanceAmount || '0'));
			//小写
			$('#serveAllMoney').text($yt_baseElement.fmMoney(d.advanceAmount));
			//applicantUser	申请人
			//applicantUserName	申请人姓名
			$('#busiUsers').text(d.applicantUserName);
			//applicantUserDeptName	申请人所在部门
			$('#deptName').text(d.applicantUserName);
			//applicantUserJobLevelCode	申请人级别code
			//applicantUserJobLevelName	申请人级别名称
			$('#jobName').text(d.applicantUserPositionName);
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
			//historyAssignee	历史责任人
			//attList	附件集合
			me.showFileList(d.attList);
			//costData	费用申请数据
			me.showCostDetail(d.costData);
			//billingVoucherList	记账凭证集合
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
			//费用信息
			me.setCostList(data.projectBudgetList);
			me.setNewCostList(data.projectBudgetDetails);
//			//teacherApplyInfoList	师资-讲师信息json
//			me.setTeacherApplyInfoList(data.teacherApplyInfoList);
//			//costTrainApplyInfoList	师资-培训费json
//			me.setCostTrainApplyInfoList(data.costTrainApplyInfoList);
//			//costPredictInfoList	收入费用json
//			me.setCostPredictInfoList(data.costPredictInfoList);
//			//costTeachersFoodApplyInfoList	师资-伙食费json
//			me.setCostTeachersFoodApplyInfoList(data.costTeachersFoodApplyInfoList);
//			//costTeachersLectureApplyInfoList	师资-讲课费json
//			me.setCostTeachersLectureApplyInfoList(data.costTeachersLectureApplyInfoList);
//			//costTeachersTravelApplyInfoList	师资-城市间交通费json
//			me.setCostTeachersTravelApplyInfoList(data.costTeachersTravelApplyInfoList);
//			//costTeachersHotelApplyInfoList	师资-住宿费 json
//			me.setCostTeachersHotelApplyInfoList(data.costTeachersHotelApplyInfoList);
//			//costNormalList	普通报销-费用明细/普通付款-付款明细 json
//			me.setCostNormalList(data.costNormalList);

		},
		setNewCostList:function(){
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
			$('.index-main-div').html('');
			//提示文字隐藏
			//			$('.qtip-text-div').hide();
			//其他区域隐藏
			$('.mod-div').hide();
			//其他信息显示
			$('.approve-div,.else-div').show();
			$('.business-div').show();
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
		 * 一般费用   funeven
		 */
		showGeneralFun: function() {
			//清空原有代码
//			$('.index-main-div').html('');
//			//提示文字隐藏
//			//			$('.qtip-text-div').hide();
//			//其他区域隐藏
//			$('.mod-div').hide();
//			//其他信息显示
//			$('.approve-div,.else-div').show();
//			//加载区域页面
//			sysCommon.loadingWord('view/projectManagement-sasac/expensesReim/module/reimApply/costDetail.html');
//
//			//清空业务招待接待对象信息
//			$('.business-div .msg-list tbody').empty();
//			//清空业务招待费费用明细信息
//			$('.business-div #paymentList tbody tr:not(.last)').remove();
//			$('.business-div #paymentList tbody .total-money').text('0.00');
//			//清空差旅费行程明细
//			$('.travel-div #tripList tbody').empty();
//			//清空差旅费费用明细
//			$('#traffic-list-info tbody,#hotel-list-info tbody,#other-list-info tbody,#subsidy-list-info tbody').empty();
//			//重置总金额
//			$('.count-val-num,#amountTotalMoney').text('0.00');
//			//重置人民币大写
//			$('#TotalMoneyUpper').text('--');
//			//重新设置冲销补领金额
//			serveFunds.setReimFundMoney();
		},
		/**
		 * 差旅
		 */
		showTravelFun: function() {
//			$('.index-main-div').html('');
//			//提示文字隐藏
//			//			$('.qtip-text-div').hide();
//			//其他区域隐藏
//			$('.mod-div').hide();
//			//其他信息显示
//			$('.approve-div,.else-div').show();
//			//相关区域显示
//			$('.travel-div').show();
//			//清空业务招待接待对象信息
//			$('.business-div .msg-list tbody').empty();
//			//清空业务招待费费用明细信息
//			$('.business-div #paymentList tbody tr:not(.last)').remove();
//			$('.business-div #paymentList tbody .total-money').text('0.00');
//			//重置总金额
//			$('.count-val-num,#amountTotalMoney').text('0.00');
//			//重置人民币大写
//			$('#TotalMoneyUpper').text('--');
//			//重新设置冲销补领金额
//			serveFunds.setReimFundMoney();
		},
		/**
		 * 培训
		 */
		showTrainFun: function() {
			var me = this;
			//清空原有代码
			$('.index-main-div').html('');
			//提示文字隐藏
			//			$('.qtip-text-div').hide();
			//其他区域隐藏
			$('.mod-div').hide();
			//其他信息显示
			//			$('.approve-div,.else-div').show();
			//加载区域页面
			sysCommon.loadingWord('view/projectManagement-sasac/expensesReim/module/busiTripApply/serveTrainApply.html');
			me.getCostList();
			//			//加载完成判断是否存在审批单
			//			if($('.prior-approval').val()) {
			//				//成功后显示导入按钮
			//				$('.index-main-div .export-but').show();
			//				serveFunds.(serveFunds.saveData.advanceAppId || '');
			//			}
			//导入培训信息
			$('#trainDetails').click(function() {
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
				//costPredictInfoList	收入费用json
				me.setCostPredictInfoList(data.costPredictInfoList);
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
				//$('#serveAllMoney').text(me.fmMoney(me.beforeCostList.advanceAmount));
				//大写金额
				//$('#TotalMoneyUpper').text(arabiaToChinese(me.beforeCostList.advanceAmount));

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
			//提示文字隐藏
			//			$('.qtip-text-div').hide();
			//其他区域隐藏
			$('.mod-div').hide();
			//其他信息显示
			$('.approve-div,.else-div').show();
			//加载区域页面
			sysCommon.loadingWord('view/projectManagement-sasac/expensesReim/module/beforehand/meetingCostApply.html');

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
//			var me = this;
//			$.ajax({
//				type: "post",
//				url: 'user/userInfo/getAllUserInfoToPage', //ajax访问路径  
//				async: true,
//				data: {
//					params: keyword,
//					pageIndex: 1,
//					pageNum: 99999 //每页显示条数  
//				},
//				success: function(data) {
//					if(data.flag == 0) {
//						//先清空出差人下拉列表中的数据
//						$("#busiUserInfo ul").empty();
//						var liStr = "";
//						var opts = '';
//						if(data.data.rows.length > 0) {
//							serveFunds.payeeUserList = data.data.rows;
//							$.each(data.data.rows, function(i, n) {
//								liStr = $('<li>' + n.userName + '/' + n.deptName + '</li>');
//								opts += '<option value="' + n.userItcode + '">' + n.userName + '</option>';
//								//存储当前出差人的数据
//								liStr.data("userData", n);
//								$("#busiUserInfo ul").append(liStr);
//							});
//							//判断出差人隐藏的code值是否有值
//							if($("#modelUserCodes").val() != "") {
//								var usersCodes = $("#modelUserCodes").val().split(",");
//								$("#busiUserInfo ul li").each(function(i, t) {
//									$.each(usersCodes, function(i, l) {
//										if($(t).data("userData").userItcode == l) {
//											$(t).addClass("tr-check");
//										}
//									});
//								});
//							}
//							//调用弹出框中操作事件方法
//							me.busiTripUserModelEvent($("#modelBusiUser"), $("#busiPlanEditModel .auto-font"), $(".model-user-num-show"), 1);
//							//设置收款人下拉列表
//							me.setPayeeNameSelect();
//						} else {
//							$("#busiUserInfo ul").append('<li style="text-align: center;">暂无数据</li>');
//						}
//					}
//				}
//			});
		},
		/**
		 * 收款弹框收款人姓名下拉
		 */
		setPayeeNameSelect: function() {
			//	        $.each(serveFunds.payeeUserList, function(i, n) {
			//				$("#payeeName").append('<option value="' + n.userItcode + '">' + n.userName + '</option>');
			//			});
			//			$("#payeeName").append('<option value="">外部人员</option>');
			//收款弹框收款人姓名下拉
			$('#payeeName').html('<option value="">请选择</option>').niceSelect({
				search: true,
				backFunction: function(text) {
					console.log(text);
					//回调方法,可以执行模糊查询,也可自行添加操作  
					$("#payeeName option").remove();
					if(text == "") {
						$("#payeeName").append('<option value="">请选择</option>');
					}
					//遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
					$.each(serveFunds.payeeUserList, function(i, n) {
						if(n.userName.indexOf(text) != -1) {
							$("#payeeName").append('<option jobLevelName="' + n.jobLevelName + '" deptName="' + n.deptName + '" value="' + n.userItcode + '">' + n.userName + '</option>');
						} else {}
					});
					$("#payeeName").append('<option value="external">外部人员</option>');
					if($("#payeeName option").length == 1 && $('payeeName option[value="external"]')) {
						$("#payeeName").append('<option value="noUser">没有找到匹配的单位内部人员</option>');
					}
					if($("#payeeName option").length == 2 && $('payeeName option[value="noUser"]')) {
						$(".display-rank").show();
						$(".pe-department").text("外部人员");
						$(".dis-r").hide();
						$(".where-company").show();
						$(".where-company").attr("validform", "{isNull:true,blurFlag:true,msg:'请输入收款人所在单位'}")
					}
				}
			});
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
//			var me = this;
//			$.ajax({
//				type: "get",
//				url: $yt_option.websit_path + 'resources-sasac/js/projectManagement/expensesReim/module/reimApply/regionList.json',
//				async: false,
//				success: function(data) {
//					//var dataList = data;
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
			$("#serveAllMoney").text(rMoney).attr('num', sumMoney);
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
				var sumMoneyLower = arabiaToChinese(rMoney || '0');
				$("#TotalMoneyUpper").text(sumMoneyLower);
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
			var fundsTotalNum = 0;
			//税后
			var afterNum = 0;
			//税后
			var aft = $('#carFeeTable,#hotelFeeTable,#dietFeeTable,#trainingFeeTable').find('.costTotal');
			//单独计算税后合计
			var aftt = $('#lectureFeeTable').find('.costTotal-after');
			aft.each(function() {
				afterNum += $yt_baseElement.rmoney($(this).text() || '0');
			});
			aftt.each(function() {
				afterNum += $yt_baseElement.rmoney($(this).text() || '0');
			});
			var costTotal = $yt_baseElement.rmoney($("#lectureFeeTable .costTotal").text());
			var costTotalAfter = $yt_baseElement.rmoney($("#lectureFeeTable .costTotal-after").text());
			var taxAmount = costTotal-costTotalAfter;
			
			var tds = $('#lectureFeeTable,#carFeeTable,#hotelFeeTable,#dietFeeTable,#trainingFeeTable').find('.costTotal');
			tds.each(function() {
				fundsTotalNum += $yt_baseElement.rmoney($(this).text() || '0');
			});
			//培训费列表
			$('#trainingFeeTable .training-total').each(function() {
				fundsTotalNum += $yt_baseElement.rmoney($(this).text() || '0');
			});
			$("#serveAllMoney").text($yt_baseElement.fmMoney(fundsTotalNum || '0')).attr('num', fundsTotalNum);
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
		 * 1.1.4.5	
		 * 导入事前审批单用
		 * @param {Object} id
		 */
		getAdvanceAppInfoDetailByAdvanceAppId: function(id, upDate) {
			var me = this;
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

						serveFunds.beforeCostList = data.data;
						//修改进入时不再加载事前附件信息
						if(!upDate) {
							//如果基本信息中有选择的事前审批单，将事前审批单中的相关附件中的文件导入，导入的文件不可删除
							//serveFunds.exportBeforeFiles(data.data.attList);
							serveFunds.specialName = serveFunds.beforeCostList.specialName;
							serveFunds.prjName = serveFunds.beforeCostList.prjName;
						}
						if(serveFunds.beforeCostList.advanceCostType=='TRAIN_APPLY'){
							$("#predictAllMoney").show();
						}
						//把公用的金额格式化方法存一下
						var fmMoney = $yt_baseElement.fmMoney;
						var arr = serveFunds.beforeCostList.specialCode.split("-");
						//项目名称
						if(arr[0] == 'SC_395') {
							$('#prjName').css({
								"color": "#333",
								"padding": "0"
							}).text(serveFunds.beforeCostList.prjName || '--');
							$('.prj-name-tr').show();
						} else {
							$('.prj-name-tr').hide();
						}
						//所属预算项目
						if(serveFunds.beforeCostList.specialName) {
							$('#specialName').css({
								"color": "#333",
								"padding": "0"
							}).text(serveFunds.beforeCostList.specialName || '--');
						}
						$('#serveAllMoney').text(fmMoney(serveFunds.beforeCostList.advanceAmount || '0'));
						$('#advanceAppBalance').text(fmMoney(serveFunds.beforeCostList.deptBudgetBalanceAmount ||  '0') + '万元');
						$('#budgetBalanceAmount').text(fmMoney(serveFunds.beforeCostList.budgetBalanceAmount ||  '0') + '万元');
						$('#TotalMoneyUpper').text(arabiaToChinese(serveFunds.beforeCostList.advanceAmount || '0'));
						serveFunds.showFileList(serveFunds.beforeCostList.attList);
						$('#specialCode').val(serveFunds.beforeCostList.specialCode);
						$('#prjCode').val(serveFunds.beforeCostList.prjCode);
						$('#jobName').text(serveFunds.beforeCostList.applicantUserPositionName);
						//取得保存的事前申请数据
						var list = me.beforeCostList.costData.trainApplyInfoList;
						//导入到列表中
						me.setTrainApplyInfoList(list);
						//取得保存的事前申请数据
						var list2 = me.beforeCostList.costData.teacherApplyInfoList;
						//导入到列表中
						me.setTeacherApplyInfoList(list2);
						//取得保存的事前申请数据
						var data = me.beforeCostList.costData;
						//导入到列表中
						//me.setTeacherApplyInfoList(list);
						//costTrainApplyInfoList	师资-培训费json
						me.setCostTrainApplyInfoList(data.costTrainApplyInfoList);
						
						if(data.projectBudgetDetails.length!=0){
							me.setCostList(data.projectBudgetDetails);
						}else{
							me.setCostList(data.projectBudgetList);
						}
						//费用信息

						//计算总金额
						personnelFunds.updateTotalNum();
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
					ls += '<div fid="' + n.attId + '" class="li-div export"><span class="file-name" >' + n.attName + '</span><label class="file-pv">预览<img src="' + src + '" ></label><label class="file-dw">下载</label></div>';
				} else {
					ls += '<div fid="' + n.attId + '" class="li-div export"><span class="file-name" >' + n.attName + '</span><label class="file-pvno">预览</label><label class="file-dw">下载</label></div>';
				}
			});
			$('#attIdStr').append(ls);
			//图片下载
			$('#attIdStr .file-dw').off().on('click', function() {
				var id = $(this).parent().attr('fid');
				window.location.href = $yt_option.base_path + 'fileUpDownload/download?pkId=' + id + '&isDownload=true';
			});
			//图片预览
			$('#attIdStr .file-pv img').showImg();
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
				receHtml += '<tr pkId="' + n.costReceptionistId + '" class="" nameVal="' + n.name + '" dutyVal="' + n.jobName + '" deptVal="' + n.unitName + '">' +
					'<td><span class="num">1</span></td>' +
					'<td><span class="name-text">' + n.name + '</span></td>' +
					'<td><span class="job-text">' + n.jobName + '</span></td>' +
					'<td><span class="unit-text">' + n.unitName + '</span></td>' +
					'<td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
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
		setCostDetailsList: function(costDetailsList) {
			//费用明细信息集合HTML文本
			var detaHtml = '';
			$.each(costDetailsList, function(i, n) {
				detaHtml += '<tr pkId="' + n.costDetailsId + '" budgetCode="' + n.publicServiceProCode + '" costCode="' + n.costType + '" budgetProject="' + n.publicServiceProName + '" applyDate="' + n.activityDate + '" siteVal="' + n.placeName + '" costBreakdown="' + n.costTypeName + '" standardMoney="' + n.standardAmount + '" budgetMoney="' + n.activityAmount + '" accompanyNum="' + n.peopleNum + '">' +
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

				tripHtml += '<tr busicode="' + n.travelType + '" usercode="' + n.travelPersonnels + '" rececode="' + n.receptionCostItem + '" >' +
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
		setCostCarfareList: function(costCarfareList) {
			var carHtml = '';
			//结算方式复选框
			var costCarfareClose = $('#traffic-list-info').next().find('.check-label input');
			var vehicle = [];
			$.each(costCarfareList, function(i, n) {
				//去掉第一个和最后一个. 后拆分
				vehicle = n.vehicle.substr(1).substr(0, n.vehicle.length - 2).split('.');
				carHtml += '<tr>' +
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
					'<td class="text-overflow-sty" data-text="remarks" title="' + n.remarks + '">' + (n.remarks == "" ? "--" : n.remarks) + '</td>' +
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
		setCostHotelList: function(costHotelList) {
			var hotelHtml = '';
			//结算方式复选框
			var costHotelClose = $('#hotel-list-info').next().find('.check-label input');
			var addresCdoe = [];
			$.each(costHotelList, function(i, n) {
				addresCdoe = n.hotelAddress.split('-');
				var avg = n.hotelDays > 0 ? $yt_baseElement.fmMoney((+n.hotelExpense / +n.hotelDays) || '0') : n.hotelExpense;
				hotelHtml += '<tr>' +
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
					'<td class="text-overflow-sty" data-text="remarks" title="' + n.remarks + '">' + (n.remarks == "" ? "--" : n.remarks) + '</td>' +
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
		setCostOtherList: function(costOtherList) {
			var otherHtml = '';
			//结算方式复选框
			var costOtherClose = $('#other-list-info').next().find('.check-label input');
			$.each(costOtherList, function(i, n) {
				otherHtml += '<tr>' +
					'<td><span>' + n.costTypeName + '</span>' +
					'<input type="hidden" data-val="costType" risk-code-val="otherCostType"  value="' + n.costType + '"/></td>' +
					'<td class="font-right money-td" data-text="reimAmount"  risk-code-val="otherCostReimPrice">' + $yt_baseElement.fmMoney(n.reimAmount || '0') + '</td>' +
					'<td class="text-overflow-sty" data-text="remarks" title="' + n.remarks + '">' + (n.remarks == "" ? "--" : n.remarks) + '</td>' +
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
		setCostSubsidyList: function(costSubsidyList) {
			var subHtml = '';
			var totalFood = 0;
			var totalTraffic = 0;
			$.each(costSubsidyList, function(i, n) {
				subHtml += '<tr class="' + n.travelPersonnel + '" code="' + n.travelPersonnel + '"><td><div class="user" code="' + n.travelPersonnel + '">' + n.travelPersonnelName + '</div></td><td><div class="lv">' + n.travelPersonnelsDept + '</div></td><td><div class="subsidy-num">' + n.subsidyDays + '</div></td><td><div style="text-align:right;" class="food">' + $yt_baseElement.fmMoney(n.subsidyFoodAmount || '0') + '</div></td><td><div  style="text-align:right;" class="traffic">' + $yt_baseElement.fmMoney(n.carfare || '0') + '</div></td><td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td></tr>';
				totalFood += +n.subsidyFoodAmount;
				totalTraffic += +n.carfare;
			});
			subHtml += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + $yt_baseElement.fmMoney(totalFood || '0') + '</td><td class="total-traffic"  style="text-align:right;">' + $yt_baseElement.fmMoney(totalTraffic || '0') + '</td><td></td></tr>';
			$('#subsidy-list-info tbody').html(subHtml);
		},
		/**
		 * changeTrainApplyInfoList	师资-培训信息json
		 * 设置 师资培训信息列表数据
		 * @param {Object} list
		 */
		setTrainApplyInfoList: function(list) {
			var me = this;
			if (list.length>0) {
			//培训名称
			$("#regionDesignation").text(list[0].regionDesignation);
			list[0].isOffSiteTraining == '1'?list[0].isOffSiteTrainingVal='是':'';
			list[0].isOffSiteTraining == '0'?list[0].isOffSiteTrainingVal='否':'';
			list[0].costStandard == '1'?list[0].costStandardVal='基本标准':'';
			list[0].costStandard == '2'?list[0].costStandardVal='高成本标准':'';
			$('.expenditure-matter-basic-information').setDatas(list[0]);
			me.initProjectSelect(list[0].projectCode,list[0].projectId);
			$('.trainOfNum').text(list[0].budgetTraineeSum);
			}
		},
		/*
		 费用明细信息列表
		 * 
		 * 
		 * */
		setCostList:function(list){
			var html = '';
			$('#teachBeforeTable tbody').empty();
			$('#trainingBeforeTable tbody').empty();
			$.each(list, function(i, n) {
				html='<tr>' +
						'<td align="right"><input type="hidden" value="' + n.costCode + '" class="cost-code">' +
						'<span>' + n.costName + '</span>' +
						'</td>' +
						'<td>' +
						'<span class="budgetCost">' + $yt_baseElement.fmMoney(n.budgetCost) + '</span>' +
						'</td>' +
						'<td style="text-align:left;">' +
						'<p class="accordingInstructions">' + n.accordingInstructions + '</p>' +
						'</td>' +
						'</tr>';
				if(n.costType == 1) {
					$('#teachBeforeTable tbody').append(html);
				}
				if(n.costType == 2) {
					$('#trainingBeforeTable tbody').append(html);
				}
			});
		},
		/**
		 * changeTeacherApplyInfoList	师资-讲师信息json
		 * 设置 师资讲师信息列表数据
		 * @param {Object} list
		 */
		setTeacherApplyInfoList: function(list) {
			var html = '';
			$.each(list, function(i, n) {
				html += '<tr>' +
					'<td class="lecturerName"><input type="hidden" class="lectureId" value="' + n.lecturerId + '"><span>' + n.lecturerName + '</span></td>' +
					'<td class="professional">' + (n.lecturerTitleName || '--') + '</td>' +
					'<td class="level">' + (n.lecturerLevelName || '--') + '</td>' +
					'<td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td></tr>';
				if(n.reason) {
					$('.lecturer-textarea').val(n.reason);
				}
			});
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveFunds.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveFunds.fmMoney(totalTraffic) + '</td></tr>';
			$('#lecturerTable tbody').html(html);
		},
		/**
		 * costTrainApplyInfoList	师资-培训费json
		 * 设置 师资培训费列表数据
		 * @param {Object} list
		 */
		setCostTrainApplyInfoList: function(list) {
//			var html = '';
//			var total = 0;
//			$.each(list, function(i, n) {
//				html += '<tr costnameval="' + n.trainType + '" pid=""><td class="cost-name">' + n.trainTypeName + '</td><td class="moneyText standard-money">' + ($yt_baseElement.fmMoney(n.standard)) + '</td><td class="people-num">' + n.trainOfNum + '</td><td class="day-num">' + n.trainDays + '</td><td class="moneyText smallplan-money">' + ($yt_baseElement.fmMoney(n.averageMoney)) + '</td><td class="special-instruct">' + (n.remark || "无") + '</td><td><input type="hidden" class="popM" value="4"><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td></tr>';
//				total += +n.averageMoney;
//				if(n.reason) {
//					$('.other-textarea').val(n.reason);
//				}
//			});
//			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveFunds.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveFunds.fmMoney(totalTraffic) + '</td></tr>';
//			$('#trainingFeeTable tbody tr').not('.last').remove();
//			$('#trainingFeeTable tbody tr.last').before(html).find('.costTotal').text(serveFunds.fmMoney(total));
		},
		/**
		 * costTeachersFoodApplyInfoList	收入费用json
		 * 设置 收入费用列表
		 * @param {Object} list
		 */
		setCostPredictInfoList: function(list) {
			var html = '';
			var costTotal = 0;
			var costTotalAfter=0;
			$.each(list, function(i, n) {
				html += '<tr  pid=""><td class="cost-name">' + n.predictName + '</td><td class="moneyText predict-standard-money">' + ($yt_baseElement.fmMoney(n.predictStandardMoney)) + '</td><td class="predict-people-num">' + n.predictPeopleNum + '</td><td class="moneyText predict-smallplan-money">' + ($yt_baseElement.fmMoney(n.averageMoney)) + '</td><td class="special-instruct">' + n.remark + '</td><td><input type="hidden" class="popM" value="4"><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td></tr>';
				costTotal += n.predictStandardMoney*n.predictPeopleNum;
				costTotalAfter+=n.averageMoney;
				if(n.reason) {
					$('.predictCost-textarea').val(n.reason);
				}
			});
			html += '<tr class="last"><td>合计</td><td></td><td></td><td  class="costTotal-after" style="text-align: right;display: none;">'+costTotal+'</td><td class="moneyText costTotal">' + $yt_baseElement.fmMoney(costTotalAfter) + '</td><td></td><td></td></tr>';
			$('#predictCostTable tbody').html(html);
	$("#preTaxAllMoney").text($yt_baseElement.fmMoney(costTotal));
	$("#afterTaxAllMoney").text($yt_baseElement.fmMoney(costTotalAfter));
			
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
					'<td class="avg">' + serveFunds.fmMoney(n.averageMoney) + '</td>' +
					'<td class="day">' + n.foodOfDays + '</td>' +
					'<td class="moneyText sum-pay">' + serveFunds.fmMoney(n.foodAmount) + '</td>' +
					'<td style="text-align: center !important;" class="dec">' + (n.remarks || "无") + '</td>' +
					'<td><input type="hidden" class="popM" value="3"/>' +
					'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
					'</tr>';
				if(n.reason) {
					$('.food-textarea').val(n.reason);
				}
				total += +n.foodAmount;
			});
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveFunds.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveFunds.fmMoney(totalTraffic) + '</td></tr>';
			$('#dietFeeTable tbody tr').not('.end-tr').remove();
			$('#dietFeeTable tbody .end-tr').before(html);
			$('#dietFeeTable tbody .costTotal').text(serveFunds.fmMoney(total));
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
			$.each(list, function(i, n) {
				html += '<tr pid="' + n.teachersLectureId + '">' +
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
				if(n.reason) {
					$('.lecture-textarea').val(n.reason);
				}
				total += +n.perTaxAmount;
				totalAfter += +n.afterTaxAmount;
			});
			$('#lectureFeeTable tbody tr').not('.end-tr').remove();
			$('#lectureFeeTable tbody .end-tr').before(html);
			$('#lectureFeeTable tbody .costTotal').text(serveFunds.fmMoney(total));
			$('#lectureFeeTable tbody .costTotal-after').text(serveFunds.fmMoney(totalAfter));
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
					'<td class="ulv">' + (n.lecturerLevelName || '--') + '</td>' +
					'<td class="sdate">' + n.goTime + '</td>' +
					'<td class="edate">' + n.arrivalTime + '</td>' +
					'<td class="sadd"><input type="hidden" class="scode" value="' + n.goAddress + '">' + n.goAddressName + '</td>' +
					'<td class="eadd"><input type="hidden" class="ecode" value="' + n.arrivalAddress + '">' + n.arrivalAddressName + '</td>' +
					'<td class="tname"><input type="hidden" class="tool" value="' + n.vehicle + '">' + n.vehicleName + '</td>' +
					'<td class="moneyText sum-pay">' + serveFunds.fmMoney(n.carfare) + '</td>' +
					'<td style="text-align: center !important;" class="dec">' + (n.remarks || "无") + '</td>' +
					'<td><input type="hidden" class="popM" value="1"/>' +
					'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
					'</td></tr>';
				if(n.reason) {
					$('.traffic-textarea').val(n.reason);
				}
				total += +n.carfare;
			});
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveFunds.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveFunds.fmMoney(totalTraffic) + '</td></tr>';
			$('#carFeeTable tbody tr').not('.end-tr').remove();
			$('#carFeeTable tbody .end-tr').before(html);
			$('#carFeeTable tbody .costTotal').text(serveFunds.fmMoney(total));
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
					'<td class="moneyText avg">' + serveFunds.fmMoney(n.averageMoney) + '</td>' +
					'<td class="day">' + n.hotelDays + '</td>' +
					'<td class="moneyText sum-pay">' + serveFunds.fmMoney(n.hotelExpense) + '</td>' +
					'<td style="text-align: center !important;" class="dec">' + (n.remarks || "无") + '</td>' +
					'<td><input type="hidden" class="popM" value="2"/>' +
					'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
					'</td></tr>';
				if(n.reason) {
					$('.accommodation-textarea').val(n.reason);
				}
				total += +n.hotelExpense;
			});
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveFunds.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveFunds.fmMoney(totalTraffic) + '</td></tr>';
			$('#hotelFeeTable tbody tr').not('.end-tr').remove();
			$('#hotelFeeTable tbody .end-tr').before(html);
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
					' <td class="reimInstructions"> ' + n.normalInstructions + '</td>' +
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
				//				if(code == '395') {
				//					$('.prj-name-tr').show();
				//				} else {
				//					$('.prj-name-tr').hide().val('');
				//				}
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
//			obj.find('option').remove();
//			$.ajax({
//				type: "post",
//				url: "budget/main/getSpecialDictList",
//				async: true,
//				data: {
//					parentCode: parentCode
//				},
//				success: function(data) {
//					var list = data.data || [];
//					var opts = '';
//					if(obj.hasClass('budget-item-one')) {
//						opts += '<option value="">请选择</option>';
//					}
//					if(data.flag == 0 && list.length > 0) {
//						$.each(list, function(i, n) {
//							if(code && code == n.specialCode) {
//								opts += '<option selected="selected" include-attr="'+n.includeAttr+'"  value="' + n.specialCode + '" valid-type="'+n.validateType+'">' + n.specialName + '</option>';
//							} else {
//								opts += '<option value="' + n.specialCode + '" include-attr="'+n.includeAttr+'" valid-type="'+n.validateType+'">' + n.specialName + '</option>';
//							}
//						});
//						//添加并初始化
//						obj.html(opts).niceSelect();
//					} else {
//						//隐藏
//					}
//					if(fun) {
//						//在选中第一级后，需要同时处理第二第三级的情况下，执行事件
//						fun(list);
//					}
//				}
//			});
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
					$('#codeMon').text(mon ? serveFunds.fmMoney(mon) + '万元' : '--');
				}
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
				serveFunds.setPayeeNameSelect();
			});
			//		TAB切换方法
			$(".receipt-alert .cost-type-tab li").click(function() {
				$(this).addClass("tab-check").siblings().removeClass("tab-check");
				var tabIndex = $(this).index();
				$(".receipt-alert .tab-info").hide().eq(tabIndex).show();
				$yt_alert_Model.getDivPosition($('#cost-apply-model'));
			});
		},
		/**
		 * 收款方添加数据方法
		 * @param {Object} tr
		 */
		raceAddList: function(tr) {
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
				var receMoney = serveFunds.getReceMsgMoney();
				//计算填写后的金额
				var totalReceMoney = receMoney + serveFunds.rmoney(companyMoney) + serveFunds.rmoney(otherAllMoney);
				//付款总金额
				var sumMoney = serveFunds.rmoney($('#applySumMoney').text());
				//验证收款金额与付款总金额
				if(totalReceMoney <= sumMoney) {
					switch(code) {
						case 'company':
							trHtml = '<tr class="payee-unit-tr" witeOffCompany="' + witeOffCompany + '" companyName="' + companyName + '" openBank="' + openBank + '" accountNumber="' + accountNumber + '" companyMoney="' + companyMoney + '" contractRadio="' + contractRadio + '" companySpecial="' + companySpecial + '">' +
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
							serveFunds.companyTotal();
							break;
						case 'personal':
							trHtml = '<tr class="payee-personal-tr" payeeVal="' + payeeVal + '" payeeName="' + payeeName + '" personalTotal="' + personalTotal + '" witeOffPersonal="' + witeOffPersonal + '" personalWriteoff="' + personalWriteoff + '" cash="' + cash + '" officialCard="' + officialCard + '" transferAccounts="' + transferAccounts + '" payeeRadio="' + payeeRadio + '" personalSpecial="' + personalSpecial + '" idCarkno="' + idCarkno + '" payeeBank="' + payeeBank + '" bankName="' + bankName + '" phoneNum="' + phoneNum + '">' +
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
							serveFunds.personalTotal();
							break;
						case 'other':
							trHtml = '<tr class="payee-other-tr" witeOffOther="' + witeOffOther + '" otherMoney="' + otherMoney + '" otherAllMoney="' + otherAllMoney + '" otherRadio="' + otherRadio + '" otherSpecial="' + otherSpecial + '">' +
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
							serveFunds.otherTotal();
							break;
						default:
							break;
					}
					//调用关闭可编辑弹出框方法
					serveFunds.clearAlterTable();

					$yt_baseElement.tableRowActive();
				} else {
					$yt_alert_Model.prompt('金额不能大于申请付款总金额');
				}

			}
		},
		alertReceivables: function() {
			$("#appendPaymentInfo").click(function() {
				serveFunds.raceAddList();
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
				serveFunds.alertClearReceivables();
				$('#appendPaymentInfo').off().on('click', function() {
					//编辑方法
					serveFunds.raceAddList(tr);
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
				serveFunds.getPayeeNameList(tr.attr('payeeVal'));
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
				serveFunds.alertClearReceivables();
				$('#appendPaymentInfo').off().on('click', function() {
					//编辑方法
					serveFunds.raceAddList(tr);
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
				serveFunds.alertClearReceivables();
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
		getReceMsgMoney: function() {
			var total = 0;
			//收款单位金额
			var unit = serveFunds.rmoney($('.payee-unit .payee-unit-money').text());
			//收款个人金额
			var us = serveFunds.rmoney($('.payee-personal .payee-unit-money').text());
			//收款其他金额
			var other = serveFunds.rmoney($('.payee-other .payee-unit-money').text());
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
						var datas = data.data[0];
						datas.projectTypeName = $yt_baseElement.setProjectTypeName(datas.projectType);
						$('.expenditure-matter-basic-information').setDatas(datas);
					}
				},
				error:function(){
					$yt_alert_Model.prompt('网络异常');
				}
			});
		}
	},
	/*
	 获取费用信息
	 * 
	 * 
	 * */
	getCostList:function(){
//		var me = this;
//		$.ajax({
//			type: "post",
//			url: $yt_option.base_path + "finance/projectBudget/getProjectBudgetCostBase",
//			async: false,
//			success: function(data) {
//				if(data.flag==0){
//					me.setNewCostList(data.data);
//				}
//			}
//		});
	},
	/*
	 
	 * 初始化费用信息
	 * */
	setNewCostList:function(data){
			var html = '';
			$('#lectureFeeTable tbody').empty();
			$('#trainingFeeTable tbody').empty();
			$.each(data, function(i, n) {
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