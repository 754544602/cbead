(function($, window) {
	var serveExamine = {
		processInstanceId:'',//流程日志id
		appId:'',//申请变革id
		detailDatas:'',//全局变量数据集
		/**
		 * 开始执行
		 */
		init: function() {
			var ts = this;

			//加载区域页面
			sysCommon.loadingWord('view/system-sasac/expensesReim/module/busiTripApply/serveTrainApproval.html');

			serveExamine.appId = $yt_common.GetQueryString('advanceAppId');
			ts.getAdvanceUpdateAppInfoDetailByAdvanceAppId();
			//获取当前登录用户信息
			sysCommon.getLoginUserInfo();
			//调用获取审批流程数据方法
			//sysCommon.getApproveFlowData("SZ_REIM_APP");
			//获取数据字典
			ts.getDictInfoByTypeCode();
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
			//关闭按钮事件
			$("#clearBtn").off().on("click", function() {
				if(window.top == window.self){//不存在父页面
	  				window.close();
				 }else{
				 	parent.closeWindow();
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
			$('.amount-table .money-input').blur(function() {
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
			});

			//提交
			$('#submitPayment').on('click', function() {
				var thisBtn = $(this);
				thisBtn.attr('disabled', true).addClass('btn-disabled');
				if($yt_valid.validForm($('.approve-div'))) {

					//获取提交数据
					var d = me.saveData;
					//获取存储数据
					var costData = me.saveData.costData;
					var changeList = me.saveData.changeList;
					d.dealingWithPeople = $('#approve-users option:selected').val(); //dealingWithPeople	下一步操作人code
					d.opintion = $('#opintion').val(); //opintion	审批意见
					d.nextCode = $('#operate-flow option:selected').val(); //nextCode	操作流程代码

					d.costData = typeof(costData) == 'string' ? costData : JSON.stringify(costData);
					d.changeList = typeof(changeList) == 'string' ? changeList : JSON.stringify(changeList);
					me.submitReimAppInfo(d, thisBtn);
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
			
			//打印按钮操作事件
			$("#printUpdateForm").click(function(){
				var pageUrl = "view/projectManagement-sasac/expensesReim/module/print/bugetAdjustApplyForm.html?expenditureAppId="+serveExamine.appId+ '&costType='+me.saveData.advanceCostType;//即将跳转的页面路径
				//调用公用的打开新页面方法传输参数不需要左侧菜单
				$yt_baseElement.openNewPage(2,pageUrl);
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
			$("#paymentAddBtn").on('click', function() {
				//所属预算项目
				var budgetProject = $('#budgetProject option:selected').text();
				//金额
				var budgetMoney = $('#budgetMoney').val();
				//专项项目编号
				var specialNum = $('#specialNum').text();

				var html = '<tr> <td>' + budgetProject + '</td> <td style="text-align: right;">' + budgetMoney + '</td> <td>' + specialNum + '</td> <td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td> </tr>';

				$('#paymentList tbody').append(html);

				me.hidePaymentAlert();
			});

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
		getAdvanceUpdateAppInfoDetailByAdvanceAppId: function() {
			var me = this;
			$.ajax({
				type: "post",
				url: "sz/advanceAppUpdate/getAdvanceUpdateAppInfoDetailByAdvanceAppId",
				async: true,
				data: {
					advanceAppId:serveExamine.appId
				},
				success: function(data) {
					var d = data.data;
					me.saveData = d;
					//数据回显
					me.showDetail(d);
					//判断当前节点
					if(d.taskKey == 'activitiEndTask') {
						//申请人填报 对应key值: activitiStartTask
						//工作流最后一步审批操作对应key值: activitiEndTask
						//最后一步显示财务支付相关
						$('.payroll-working').show();
						//清除审批人的必填验证
						$('#approve-users').attr("validform", "{isNull:false,msg:'请选择审批人'}")
					} else {
						$('.payroll-working').hide();
						//修改提交按钮文本
						$('#submitPayment').text('提交');
						//$('#approve-users').attr("validform","{isNull:true,msg:'请选择审批人'}")
					}

					//禁用公务卡结算选项
					$('.check-label').off('click');
					$('.check-label input').attr('disabled', true).off('click');

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
		 * 空值转换为默认
		 * @param {Object} str
		 */
		non: function(str) {
			return(str ? 　str : '--');
		},
		/**
		 * 报销申请数据回显
		 * @param {Object} data
		 */
		showDetail: function(d) {
			var me = this;
			//advanceAppId	事前申请Id
			serveExamine.processInstanceId=d.processInstanceId;
			//获取流程日志
			var flowLogHtml=sysCommon.getCommentByProcessInstanceId(serveExamine.processInstanceId);
			$(".flow-log-div").html(flowLogHtml);
			$('#advanceAppNum').text(me.non(d.advanceAppNum)); //advanceAppNum	事前申请单号
			$("#formNum").text(me.non(d.newAdvanceAppNum));//变更申请单号
			$('#advanceAppName').text(me.non(d.advanceAppName)); //advanceAppName	事前申请事由
			//isSpecial	是否为专项
			//specialCode	所属预算项目code
			$('#specialName').text(me.non(d.specialName)); //specialName	所属预算项目名称
			var specialValArr=d.specialCode.split('-');
			//if(specialValArr[0]=='395'){//所属预算项目为项目支出
			//var specialValArr=d.specialCode.split('-');   specialValArr[0]=='SC_395'
			if(d.includeAttr =='TEXT' && d.includeAttr != null && d.includeAttr != undefined){//所属预算项目为项目支出
				$('.prj-name-tr').show(); //显示所属项目
				$('#prjName').text(me.non(d.prjName)); //prjName	项目名称
			}else{
				$('.prj-name-tr').hide();//隐藏所属项目
			}
			$(".adj-before").text(me.fmMoney(d.taxChangeData.changeBeforeAmount || '0.00'));
			$(".adj-after").text(me.fmMoney(d.taxChangeData.changeAfterAmount || '0.00'));
			$(".remuneration-tax-total").text(me.fmMoney(d.taxChangeData.changeAmount || '0.00'));
			$('#deptBudgetBalanceAmount').text(d.deptBudgetBalanceAmount ? me.fmMoney(d.deptBudgetBalanceAmount) + '万元' : '--'); //budgetBalanceAmount	预算剩余额度
			$('#budgetBalanceAmount').text(d.budgetBalanceAmount ?　me.fmMoney(d.budgetBalanceAmount) + '万元': '--'); //budgetBalanceAmount	预算剩余额度
			//advanceCostType	费用类型
			$('#advanceCostType').text(me.non(d.advanceCostTypeName)); //advanceCostTypeName	费用类型名称
			$('#totalAmount').text(me.fmMoney(d.advanceAmount)); //advanceAmount	预算总金额
			$('#totalMoneyUpper').text(arabiaToChinese(d.advanceAmount || '0')); //大写金额
			$('#doAdvanceAmount').text(me.fmMoney(d.doAdvanceAmount)); //doAdvanceAmount	可用支出金额
			$('#taxAmount').text(me.fmMoney(d.taxAmount)); //taxAmount	相关课酬税金
			//applicantUser	申请人
			$('#busiUsers').text(me.non(d.applicantUserName)); //applicantUserName	申请人姓名
			$('#deptName').text(me.non(d.applicantUserDeptName)); //applicantUserDeptName	申请人所在部门
			//applicantUserJobLevelCode	申请人级别code
			$('#jobName').text(me.non(d.applicantUserJobName)); //applicantUserJobLevelName	申请人级别名称
			$('#telPhone').text(me.non(d.applicantUserPhone)); //applicantUserPhone	电话号码
			$('#applicantTime').text(me.non(d.applicantTime)); //applicantTime	申请时间
			//nodeNowState	流程状态
			//workFlowState	工作流状态
			//调用获取审批流程数据方法
			sysCommon.getApproveFlowData("SZ_CHANGEPRJ_APP", d.processInstanceId); //processInstanceId	流程实例Id
			//historyAssignee	历史责任人
			me.showCostDetail(d.costData); //costData	费用申请信息
			me.showFileList(d.attList); //attList	附件信息集合
			$('#changeNum').text(d.changeNum || '0'); //changeNum	调整次数
			//changeCount	调整合计
			me.setChangeList(d.changeList); //changeList	调整情况list

		},
		/**
		 * 调整情况列表显示
		 * @param {Object} list
		 */
		setChangeList: function(list) {
			var me = this,
				html = '',
				total = 0;
			$.each(list, function(i, n) {
				html += '<tr> <td>' + n.changeProject + '</td> <td style="text-align: right;">' + me.fmMoney(n.changeBeforeAmount) + '</td> <td style="text-align: right;">' + me.fmMoney(n.changeAfterAmount) + '</td> <td style="text-align: right;">' + me.fmMoney(n.changeAmount) + '</td> <td style="text-align: left;">' + me.non(n.changeReason) + '</td> </tr>';
				total += +n.changeAmount;
			});
			$('#changeList tbody .last').before(html).find('.amount-total').text(me.fmMoney(total));
		},
		/**
		 * 费用信息数据回显
		 * @param {Object} data
		 */
		showCostDetail: function(data) {
			var me = this;
			//转换金额格式的方法
			var fMoney = $yt_baseElement.fmMoney;
			if(data.costTrainApplyInfoList.length == 0 && data.costTeachersFoodApplyInfoList.length == 0 && data.costTeachersLectureApplyInfoList.length == 0 && data.costTeachersTravelApplyInfoList.length == 0 && data.costTeachersHotelApplyInfoList.length == 0) {
				$(".hide-div").html('<table style="width:100%"><tr style="border:0px;background-color:#fff !important;"><td align="center"style="border:0px;"><div class="no-data" style="width: 280px;padding:0;margin: 0 auto;">' +
					'<img src="../../../../../resources-sasac/images/common/no-data.png" alt="" style="padding:10px 0;">' +
					'</div></td></tr></table>');

			} else {
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
			}
			//师资-培训信息json
			me.setTrainApplyInfoList(data.trainApplyInfoList);
			//teacherApplyInfoList	师资-讲师信息json
			me.setTeacherApplyInfoList(data.teacherApplyInfoList);

		},
		/**
		 * trainApplyInfoList	师资-培训信息json
		 * 设置 师资培训信息列表数据
		 * @param {Object} list
		 */
		setTrainApplyInfoList: function(list) {
			var me = this;
			if(list.length > 0) {
				//培训类型
				$(".train-type").text(me.non(list[0].trainTypeName));
				//培训名称
				$(".region-designation").text(me.non(list[0].regionDesignation));
				//培训地点中文
				$(".region-name").text(list[0].regionName);
				//报到时间
				$(".report-time").text(list[0].reportTime);
				//结束时间	
				$(".end-time").text(list[0].endTime);
				//培训天数
				$(".train-days").text(list[0].trainDays);
				//培训人数
				$(".train-of-num").text(list[0].trainOfNum);
				//工作人员数量
				$(".worker-num").text(list[0].workerNum);
				if(list[0].reason){
					$("#trainApplyReason").text(list[0].reason);
				}else{
					$(".trainApply-reason-hide").hide();
				}
				
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
					'<td class="level">' + (n.lecturerLevelName || '--') + '</td>' +
					'<td style="display:none"><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td></tr>';
				if(n.reason){
					$("#teacherReason").text(n.reason);
				}else{
					$(".teacher-reason").hide();
				}
			});
			if(!list && list.length <= 0){
				$(".teacher-reason").hide();
			}
			$('#lecturerTable tbody').html(html);
			
		},
		/**
		 * costTrainApplyInfoList	师资-培训费json
		 * 设置 师资培训费列表数据
		 * @param {Object} list
		 */
		setCostTrainApplyInfoList: function(list) {
			var html = '';
			var total = 0;
			if(list.length != 0) {
				$.each(list, function(i, n) {
					html += '<tr pid="' + n.trainAppId + '" trainType="' + n.trainType + '">' +
						'<td class="trainTypeName">' + n.trainTypeName + '</td>' +  //培训类型
						'<td class="standard">' + serveExamine.fmMoney(n.standard) + '</td>' +  //标准
						'<td class="trainOfNum">' + n.trainOfNum + '</td>' +  //报道人数
						'<td class="trainDays">' + n.trainDays + '</td>' +  //培训天数
						'<td class="moneyText averageMoney">' + serveExamine.fmMoney(n.averageMoney) + '</td>' +  
						'<td class="trainingPerNumber">' + (n.remarks || "无") + '</td>' +
						'</tr>';
					total += +n.averageMoney;
					if(n.reason) {
						$('#trainingReason').text(n.reason);
					}else{
						$(".other-reason").hide();
					}
				});
				$('#trainingFeeTable tbody .last').before(html);
				$('#trainingFeeTable .costTotal').text(serveExamine.fmMoney(total));
			} else {
				$(".other-title,.trainingFeeTable,.other-reason").hide();
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
			if(list.length != 0) {
				$.each(list, function(i, n) {
					html += '<tr pid="' + n.foodId + '">' +
						'<td><input type="hidden" class="lectureId" value="' + n.lecturerId + '">' + n.lecturerName + '</td>' +
						'<td class="avg moneyText">' + serveExamine.fmMoney(n.averageMoney) + '</td>' +
						'<td class="day">' + n.foodOfDays + '</td>' +
						'<td class="moneyText sum-pay">' + serveExamine.fmMoney(n.foodAmount) + '</td>' +
						'<td class="dec">' + (n.remarks || "无") + '</td>' +
						'<td style="display:none"><input type="hidden" class="popM" value="4"/>' +
						'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
						'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
						'</tr>';
					total += +n.foodAmount;
					if(n.reason) {
						$('#dietApplyReason').text(n.reason);
					}else{
						$(".food-reason").hide();
					}
				});
				$('#dietFeeTable tbody .end-tr').before(html);
				$('#dietFeeTable tbody .costTotal').text(serveExamine.fmMoney(total));
			} else {
				$(".food-title,.dietFeeTable,.food-reason").hide();
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
			if(list.length != 0) {
				$.each(list, function(i, n) {
					html += '<tr pid="' + n.teachersLectureId + '">' +
						'<td class="uname"><input type="hidden" class="lectureId" value="' + n.lecturerId + '">' + n.lecturerName + '</td>' +
						'<td class="holder">' + (n.lecturerTitleName || '--') + '</td>' +
						'<td class="hour">' + n.teachingHours + '</td>' +
						'<td class="cname">' + (n.courseName || '--') + '</td>' +
						'<td class="moneyText sum-pay">' + serveExamine.fmMoney(n.perTaxAmount) + '</td>' +
						'<td class="moneyText after">' + serveExamine.fmMoney(n.afterTaxAmount) + '</td>' +
						'<td class="moneyText avg">' + serveExamine.fmMoney(n.averageMoney) + '</td>' +
						'<td style="display:none"><input type="hidden" class="popM" value="1"/>' +
						'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
						'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
						'</td></tr>';
					total += +n.perTaxAmount;
					if(n.reason) {
						$('#costTrainApplyReason').text(n.reason);
					}else{
						$(".lecture-reason").hide();
					}
				});
				$('#lectureFeeTable tbody .end-tr').before(html);
				$('#lectureFeeTable tbody .costTotal').text(serveExamine.fmMoney(total));
			} else {
				$(".lecture-title,.lectureFeeTable,.lecture-reason").hide();
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
			if(list.length != 0) {
				$.each(list, function(i, n) {
					html += '<tr pid="' + n.teachersTravelId + '">' +
						'<td class="uname"><input type="hidden" class="lectureId" value="' + n.lecturerId + '">' + n.lecturerName + '</td>' +
						'<td class="ulv">' + (n.lecturerLevelName || '--') + '</td>' +
						'<td class="sdate">' + n.goTime + '</td>' +
						'<td class="edate">' + n.arrivalTime + '</td>' +
						'<td class="sadd"><input type="hidden" class="scode" value="' + n.goAddress + '">' + n.goAddressName + '</td>' +
						'<td class="eadd"><input type="hidden" class="ecode" value="' + n.arrivalAddress + '">' + n.arrivalAddressName + '</td>' +
						'<td class="tname"><input type="hidden" class="tool" value="' + n.vehicle + '">' + n.vehicleName + '</td>' +
						'<td class="moneyText sum-pay">' + serveExamine.fmMoney(n.carfare) + '</td>' +
						'<td class="dec">' + (n.remarks || "无") + '</td>' +
						'<td  style="display:none"><input type="hidden" class="popM" value="2"/>' +
						'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
						'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
						'</td></tr>';
					total += +n.carfare;
					if(n.reason) {
						$('#carApplyReason').text(n.reason);
					}else{
						$(".traffic-reason").hide();
					}
				});
				$('#carFeeTable tbody .end-tr').before(html);
				$('#carFeeTable tbody .costTotal').text(serveExamine.fmMoney(total));
			} else {
				$(".traffic-title,.carFeeTable,.traffic-reason").hide();
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
			if(list.length != 0) {
				$.each(list, function(i, n) {
					html += '<tr pid="' + n.teachersHotelId + '">' +
						'<td class="name"><input type="hidden" class="lectureId" value="' + n.lecturerId + '">' + n.lecturerName + '</td>' +
						'<td class="sdate">' + n.startTime + '</td>' +
						'<td class="edate">' + n.endTime + '</td>' +
						'<td class="moneyText avg">' + serveExamine.fmMoney(n.averageMoney) + '</td>' +
						'<td class="day">' + n.hotelDays + '</td>' +
						'<td class="moneyText sum-pay">' + serveExamine.fmMoney(n.hotelExpense) + '</td>' +
						'<td class="dec">' + (n.remarks || "无") + '</td>' +
						'<td style="display:none"><input type="hidden" class="popM" value="3"/>' +
						'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
						'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
						'</td></tr>';
					total += +n.hotelExpense;
					if(n.reason) {
						$('#hotelApplyReason').text(n.reason);
					}else{
						$(".accommodation-reason").hide();
					}
				});
				$('#hotelFeeTable tbody .end-tr').before(html);
				$('#hotelFeeTable tbody .costTotal').text(serveExamine.fmMoney(total));
			} else {
				$(".accommodation-title,.hotelFeeTable,.accommodation-reason").hide();
			}
		},
		/**
		 * //costNormalList	普通报销-费用明细/普通付款-付款明细 json
		 * 设置普通报销列表数据
		 * @param {Object} list
		 */
//		setCostNormalList: function(list) {
//			var html = '';
//			var total = 0;
//			$.each(list, function(i, n) {
//				html += '<tr>' +
//					'<td style="text-align:left;" class="reimContent">' + n.normalName + '</td>' +
//					'<td style="text-align: right;" class="reimAmount">' + ($yt_baseElement.fmMoney(n.normalAmount)) + '</td>' +
//					'<td></td>' +
//					'</tr>';
//				total += +n.normalAmount;
//			});
//			$('.ordinary-approval #costList tbody .last').before(html);
//			$('.ordinary-approval #costList tbody #reimAmountlSum').text($yt_baseElement.fmMoney(total));
//		},
		/**
		 * 附件集合显示
		 * @param {Object} list
		 */
		showFileList: function(list) {
			if(list.length>0){
				//图片显示拼接字符串
				var ls = '';
				//图片显示路径
				var src = '';
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
			}else{
				$('#attIdStr').html("暂无附件");
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
		submitReimAppInfo: function(subData, thisBtn) {
			$.ajax({
				type: "post",
				url: "sz/advanceAppUpdate/submitWorkFlow",
				async: true,
				data: subData,
				success: function(data) {
					$yt_alert_Model.prompt(data.message);
					if(data.flag == 0) {
						//跳转列表页面
						window.location.href = $yt_option.websit_path + 'view/system-sasac/expensesReim/module/approval/projectBefList.html?state=1';
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
			data.paymentDate = $('#paymentDate').val(); //paymentDate	支付日期
			data.paymentAmount = $yt_baseElement.rmoney($('#paymentAmount').val() || '0'); //paymentAmount	支付金额
			data.cmTotalAmount = $('#cmTotalAmount').attr('num'); //cmTotalAmount	支付明细_报销总金额
			data.cmWriteOffAmount = $('#cmWriteOffAmount').attr('num'); //cmWriteOffAmount	支付明细_冲销金额
			data.cmOfficialCard = $yt_baseElement.rmoney($('#cmOfficialCard').val() || '0'); //cmOfficialCard	支付明细_公务卡金额
			data.cmCash = $yt_baseElement.rmoney($('#cmCash').val() || '0'); //cmCash	支付明细_现金金额
			data.cmCheque = $yt_baseElement.rmoney($('#cmCheque').val() || '0'); //cmCheque	支付明细_支票金额
			data.costData = JSON.stringify(data.costData); //cmTransfer	支付明细_转账金额
			data.nextCode = $('#operate-flow option:selected').val(); //nextCode 操作流程代码
			data.dealingWithPeople = $('#approve-users option:selected').val(); //dealingWithPeople	下一步操作人code
			data.attIdStr = me.getFileList();

			return data;
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
			$('.dottom-div,.approve-div').show();
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
			$('.dottom-div,.approve-div').show();
			$('.grod-div').show();
			//加载区域页面
			sysCommon.loadingWord('view/system-sasac/expensesReim/module/beforehand/meetingCostApplyDetails.html');

		},
		/**
		 * 财务支付明细新增
		 */
		financialPayment: function() {
			var me = this;
			//显示支出明细弹出框
			$('#payAddBtn').click(function() {
				//未付款金额
				var notMoney = 1; //$yt_baseElement.rmoney($('#notMoney').text());
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
				pay.clearAlert($('.create-detali'));
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
			var createDetaTotalMoney = $('#createDetaTotalMoney').val();
			$.ajax({
				type: "post",
				url: "sz/payDetailBillingVoucher/savePaymentDetailInfo",
				async: true,
				data: {
					appId: serveExamine.saveData.payAppId, //表单申请Id
					appType: 'PAYMENT_APP', //表单申请类型		 报销申请- REIM_APP		付款申请 - PAYMENT_APP
					receivablesId: budgetProjectCode, //收款方id
					receivablesType: typeVal, //收款方类型		收款方单位 - GATHERING_UNIT	   收款方个人 - GATHERING_PERSON   收款方其他 - GATHERING_OTHER
					//payDetailId:'',//支付明细Id
					paymentDate: payDate, //付款日期
					paymentAmount: serveExamine.rmoney(createDetaTotalMoney), //付款金额
				},
				success: function(data) {
					if(data.flag == 0) {
						var d = data.data;
						//添加成功
						var html = '<tr pid="" type="' + typeVal + '" payee="' + budgetProjectCode + '" payment="' + payDate + '" paymentmoney="' + Unit + '">' +
							' <td class="payee" style="width: 100px;">' + budgetProject + '</td>' +
							' <td class="payment" style="width: 100px;">' + payDate + '</td>' +
							' <td class="paymentmoney" style="text-align: right;">' + Unit + '</td></tr>';
						//隐藏
						me.hideMsgAlert();
						//清空
						me.clearAlert($('#createDetali'));
						//获取列表
						me.getPaymentAmountInfoList(d.appId);
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
						$('#mustMoney').text(pay.fmMoney(d.totalAmount)); //totalAmount	应付款金额
						var paymentAmount = d.paymentAmount; //paymentAmount 已付款金额
						$('#alreadyMoney').text(pay.fmMoney(paymentAmount));
						var paymentBalanceAmount = d.paymentBalanceAmount; //paymentBalanceAmount 未付款金额
						$('#notMoney').text(pay.fmMoney(paymentBalanceAmount));
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
			$.each(list, function(i, n) {
				html += '<tr pid="' + n.receivablesId + '" type="' + n.receivablesType + '" payee="' + n.receivablesId + '" payment="' + n.paymentDate + '" paymentmoney="' + n.paymentAmount + '">' +
					' <td class="payee" style="width: 100px;">' + n.receivablesName + '</td>' +
					' <td class="payment" style="width: 100px;">' + n.paymentDate + '</td>' +
					' <td class=""></td>' +
					' <td class=""></td>' +
					' <td class=""></td>' +
					' <td class="paymentmoney" style="text-align: right;">' + pay.fmMoney(n.paymentAmount) + '</td></tr>';
				total += +n.paymentAmount;
			});
			$('.pay-detail-tabel .pay-detail-tabel-total').before(html);
			$('.pay-detail-tabel .payee-other-total-money').text(pay.fmMoney(total));
		},
	};

	$(function() {
		serveExamine.init();
	});
})(jQuery, window);