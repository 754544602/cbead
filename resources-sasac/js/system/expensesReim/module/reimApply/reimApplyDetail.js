(function($, window) {
	var serveExamine = {
		/**
		 * 开始执行
		 */
		init: function() {
			var ts = this;

			var pid = $yt_common.GetQueryString('reimId');

			ts.getReimAppInfoDetailByReimAppId(pid);

			//获取当前登录用户信息
			sysCommon.getLoginUserInfo();
			//调用获取审批流程数据方法
			//sysCommon.getApproveFlowData("SZ_REIM_APP");
			//获取数据字典
			ts.getDictInfoByTypeCode();
			ts.start();

			ts.events();
			ts.getCommentByProcessInstanceId();
		},
		/**
		 * 初始化组件
		 */
		start: function() {
			$('select').niceSelect();
//			$('#paymentDate').calendar({
//				speed: 0,
//				nowData: false
//			});
		},
		/**
		 * 事件处理
		 */
		events: function() {
			var me = this;
			//调用父级关闭当前窗体方法
			$("#closeBtn").click(function(){
				parent.closeWindow();
			});
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
				var body = $('.amount-table');
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
			});

			//提交
			$('#submitPayment').on('click', function() {
				if($yt_valid.validForm($('.approve-div'))) {
					//获取提交数据
					var d = me.getSubData();
					//获取存储数据
					var costData = me.saveData.costData;
					d.costData = typeof(costData) == 'string' ? costData : JSON.stringify(costData);

					//var d = me.getSaveData();
					me.submitReimAppInfo(d);
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
		getReimAppInfoDetailByReimAppId: function(reimAppId) {
			var me = this;
			$.ajax({
				type: "post",
				url: "sz/reimApp/getReimAppInfoDetailByReimAppId",
				async: true,
				data: {
					reimAppId: reimAppId
				},
				success: function(data) {
					var d = data.data;
					me.saveData = d;
					//判断是否有返回的页面操作方法名称
					if(d.jsFun) {
						//存在执行相应的方法
						me[d.jsFun]();
					}

					//调用获取审批流程数据方法
					sysCommon.getApproveFlowData("SZ_REIM_APP", d.processInstanceId);
					//数据回显
					me.showDetail(d);
					console.log(d.workFlowState);
					//判断当前节点
					if(d.workFlowState == '已完成') {
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
				isSpecial: $('#isSpecial').attr('val'), //isSpecial	是否专项(1 是 2 否)
				specialCode: $('#specialName').attr('val'), //specialCode	专项所属code
				invoiceNum: $('#invoiceNum').text(), //invoiceNum	发票张数
				totalAmount: $('#totalAmount').attr('num'), //totalAmount	报销总金额
				writeOffAmount: $('#writeOffAmount').attr('num'), //writeOffAmount	冲销金额
				officialCard: $('#officialCard').attr('num'), //officialCard	公务卡金额
				cash: $('#cash').attr('num'), //cash	现金金额
				cheque: $('#cheque').attr('num'), //cheque	支票金额
				transfer: 0, //transfer	转账金额
				attIdStr: getFileList(), //attIdStr	附件id,字符串,逗号分隔
				paymentDate: $('#paymentDate').val(), //paymentDate	支付日期
				paymentAmount: $('#paymentAmount').val(), //paymentAmount	支付金额
				cmTotalAmount: $('#cmTotalAmount').attr('num'), //cmTotalAmount	支付明细_报销总金额
				cmWriteOffAmount: $('#cmWriteOffAmount').attr('num'), //cmWriteOffAmount	支付明细_冲销金额
				cmOfficialCard: $('#cmOfficialCard').val(), //cmOfficialCard	支付明细_公务卡金额
				cmCash: $('#cmCash').val(), //cmCash	支付明细_现金金额
				cmCheque: $('#cmCheque').val(), //cmCheque	支付明细_支票金额
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

			//调用给表单设置值的方法
			$(".ordinary-div").setDatas(d);

			$('#busiUsers').text(d.applicantUserName); //申请人名称: applicantUserName				
			$('#deptName').text(d.applicantUserDeptName); //申请人部门: applicantUserDeptName		
			//申请人职务code: applicantUserJobLevelCode
			$('#jobName').text(d.applicantUserJobLevelName); //申请人职务名称: applicantUserJobLevelName

			$('#advanceAppId').val(d.advanceAppId); //advanceAppId	事前申请id
			$('#loanAppId').val(d.loanAppId); //loanAppId	借款申请表id
			$('#loanAmount').text(d.arrearsAmount ? (fMoney(d.arrearsAmount)) : '0.00');
			//本次冲销金额：报销总额大于欠款 ，本次冲销=欠款金额,报销总额小于等于欠款，本次冲销=报销总额。
			var outWriteAmount = d.totalAmount <= d.arrearsAmount ? d.totalAmount : d.arrearsAmount;
			$('#outWriteAmount').text(fMoney(outWriteAmount || '0'));
			$('#reimAppId').val(d.reimAppId); //reimAppId	报销申请表id
			$('#advanceAppNum').text(d.advanceAppNum); //advanceAppNum	事前申请编号
			if(d.advanceAppNum){
				$('.advance-relevance').show();
				$('#advanceAppBalance').text(d.advanceAppBalance ? (fMoney(d.advanceAppBalance) + '元') : '--');
			}
			//项目名称存在时 显示项目名称
			if(d.prjName) {
				$('#prjName').text(d.prjName);
				$('.prj-name-tr').show();
			}
			$('#reimAppNum').val(d.reimAppNum); //reimAppNum	报销单号
			$('#formNum').text(d.reimAppNum).attr('val', d.reimAppNum);
			$('#reimAppName').text(d.reimAppName).attr('val', d.reimAppName); //reimAppName	报销事由
			//costType	费用类型
			//costTypeName	费用类型名称
			$('#costTypeName').text(d.costTypeName).attr('val', d.costType);
			//isSpecial	是否专项(1 是 2 否)
			//$('#isSpecial').text(d.isSpecial == '1' ? '是' : '否').attr('val', d.isSpecial);
			//specialCode	专项所属code
			//specialName	专项所属名称
			//$('#specialName').text(d.specialName).attr('val', d.specialCode);
			$('#specialName').text(d.specialName);//specialCode	所属预算项目code
			$('#budgetBalanceAmount').text(d.budgetBalanceAmount ?  fMoney(d.budgetBalanceAmount) + '万元' : '--');//budgetBalanceAmount	预算剩余额度
			//invoiceNum	发票张数
			$('#invoiceNum').text(d.invoiceNum || '0');
			//totalAmount	报销总金额
			$('#totalAmount').text(fMoney(d.totalAmount || '0')).attr('num', d.totalAmount);
			$('#amountTotalMoney').text(fMoney(d.totalAmount || '0')).attr('num', d.totalAmount);
			$('#paymentList .total-money').text(fMoney(d.totalAmount || '0')).attr('num', d.totalAmount);
			//大写金额
			$('#totalMoneyUpper').text(arabiaToChinese(d.totalAmount + '' || '0'));

			//writeOffAmount	冲销金额
			//$('#writeOffAmount').text(fMoney(d.totalAmount || '0')).attr('num', d.totalAmount);
			//writeOffAmount	冲销金额
			$('#writeOffAmount,#outWriteAmount').text(fMoney(d.writeOffAmount || '0')).attr('num', d.writeOffAmount);
			
			//报销后借款单余额：计算项，计算逻辑：如果报销金额小于借款单可用余额，则借款单可用余额-报销金额；如果报销金额大于风雨借款单可用余额；则显示为0.00
			$('#balanceMoney').text(fMoney(d.totalAmount < d.loanAppBalance ? d.loanAppBalance - d.totalAmount : '0'));
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
			$('#replaceMoney,#cmReplaceMoney').text(fMoney(total));

			//paymentDate	支付日期
			$('#paymentDate').text(d.paymentDate);
			//paymentAmount	支付金额
			$('#paymentAmount').text(fMoney(d.paymentAmount || '0'));

			var cmTotalAmount = d.cmTotalAmount ? d.cmTotalAmount : d.totalAmount;
			//cmTotalAmount	支付明细_报销总金额
			$('#cmTotalAmount').text(fMoney(cmTotalAmount || '0')).attr('num', cmTotalAmount);
			var cmWriteOffAmount = +cmTotalAmount - +d.cmWriteOffAmount;
			cmWriteOffAmount = cmWriteOffAmount > 0 ? cmWriteOffAmount : '';
			//cmWriteOffAmount	支付明细_冲销金额
			$('#cmWriteOffAmount').text(fMoney(d.cmWriteOffAmount || '0')).attr('num', d.cmWriteOffAmount);
			//cmOfficialCard	支付明细_公务卡金额
			$('#cmOfficialCard').text(fMoney(d.cmOfficialCard || '0'));
			//cmCash	支付明细_现金金额
			$('#cmCash').text(fMoney(d.cmCash || '0'));
			//cmCheque	支付明细_支票金额
			$('#cmCheque').text(fMoney(d.cmCheque || '0'));
			//cmTransfer	支付明细_转账金额
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
			//attList	附件集合
			me.showFileList(d.attList);
			//costData	费用申请数据
			me.showCostDetail(d.costData);
			//billingVoucherList	记账凭证集合
			//me.showBillingVoucherList(d.billingVoucherList);

			//me.getTotleMoney();
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
			sysCommon.updateMoneySum(0);
			//costHotelList	住宿费
			var costHotelList = data.costHotelList;
			var hotelHtml = '';
			//结算方式复选框
			var costHotelClose = $('#hotel-list-info').next().find('.check-label input');
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
				'<td><span class="tab-font-blod">合计</span></td><td></td><td></td><td></td><td></td><td></td>' +
				'<td class="font-right"><span class="tab-font-blod money-sum">0.00</span></td>' +
				'<td></td><td></td></tr>';
			$('#hotel-list-info tbody').html(hotelHtml);
			//调用合计方法
			sysCommon.updateMoneySum(1);
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
			sysCommon.updateMoneySum(2);
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
			subHtml += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + fMoney(totalFood || '0') + '</td><td class="total-traffic"  style="text-align:right;">' + fMoney(totalTraffic || '0') + '</td></tr>';
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
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveExamine.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveExamine.fmMoney(totalTraffic) + '</td></tr>';
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
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveExamine.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveExamine.fmMoney(totalTraffic) + '</td></tr>';
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
					'<td class="moneyText" class="avg">' + serveExamine.fmMoney(n.averageMoney) + '</td>' +
					'<td class="moneyText training-total">' + serveExamine.fmMoney(n.trainAmount) + '</td>' +
					'<td style="display:none"><input type="hidden" class="popM" value="0"/>' +
					'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
					'</tr>';
			});
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveExamine.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveExamine.fmMoney(totalTraffic) + '</td></tr>';
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
					'<td class="avg" style="text-align: right;">' + serveExamine.fmMoney(n.averageMoney) + '</td>' +
					'<td class="day">' + n.foodOfDays + '</td>' +
					'<td class="moneyText sum-pay">' + serveExamine.fmMoney(n.foodAmount) + '</td>' +
					'<td style="text-align: left !important;" class="dec">' + n.remarks + '</td>' +
					'<td style="display:none"><input type="hidden" class="popM" value="4"/>' +
					'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
					'</tr>';
				total += n.foodAmount;
			});
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveExamine.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveExamine.fmMoney(totalTraffic) + '</td></tr>';
			$('#dietFeeTable tbody .end-tr').before(html);
			$('#dietFeeTable tbody .costTotal').text(serveExamine.fmMoney(total));
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
					'<td class="moneyText sum-pay">' + serveExamine.fmMoney(n.perTaxAmount) + '</td>' +
					'<td class="moneyText after">' + serveExamine.fmMoney(n.afterTaxAmount) + '</td>' +
					'<td class="moneyText avg">' + serveExamine.fmMoney(n.averageMoney) + '</td>' +
					'<td style="display:none"><input type="hidden" class="popM" value="1"/>' +
					'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
					'</td></tr>';
				total += n.perTaxAmount;
			});
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveExamine.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveExamine.fmMoney(totalTraffic) + '</td></tr>';
			$('#lectureFeeTable tbody .end-tr').before(html);
			$('#lectureFeeTable tbody .costTotal').text(serveExamine.fmMoney(total));
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
					'<td class="moneyText sum-pay">' + serveExamine.fmMoney(n.carfare) + '</td>' +
					'<td style="text-align: left !important;" class="dec">' + n.remarks + '</td>' +
					'<td  style="display:none"><input type="hidden" class="popM" value="2"/>' +
					'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
					'</td></tr>';
				total += n.carfare;
			});
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveExamine.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveExamine.fmMoney(totalTraffic) + '</td></tr>';
			$('#carFeeTable tbody .end-tr').before(html);
			$('#carFeeTable tbody .costTotal').text(serveExamine.fmMoney(total));
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
					'<td class="moneyText avg">' + serveExamine.fmMoney(n.averageMoney) + '</td>' +
					'<td class="day">' + n.hotelDays + '</td>' +
					'<td class="moneyText sum-pay">' + serveExamine.fmMoney(n.hotelExpense) + '</td>' +
					'<td style="text-align: left !important;" class="dec">' + n.remarks + '</td>' +
					'<td style="display:none"><input type="hidden" class="popM" value="3"/>' +
					'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
					'</td></tr>';
				total += n.hotelExpense;
			});
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveExamine.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveExamine.fmMoney(totalTraffic) + '</td></tr>';
			$('#hotelFeeTable tbody .end-tr').before(html);
			$('#hotelFeeTable tbody .costTotal').text(serveExamine.fmMoney(total));
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
					'<td></td>'+
					'</tr>';
				total += +n.normalAmount;
			});
			$('.ordinary-approval #costList tbody .last').before(html);
			$('.ordinary-approval #costList tbody #reimAmountlSum').text($yt_baseElement.fmMoney(total));
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
		submitReimAppInfo: function(subData) {
			$.ajax({
				type: "post",
				url: "sz/reimApp/submitReimAppInfo",
				async: true,
				data: subData,
				success: function(data) {
					$yt_alert_Model.prompt(data.message);
					if(data.flag == 0) {
						//跳转列表页面
						window.location.href = $yt_option.websit_path + 'view/system-sasac/expensesReim/module/reimApply/reimApproveList.html';
					}
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
			$('#TotalMoneyUpper').text(arabiaToChinese(fmTotal));
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
			data.paymentAmount = $('#paymentAmount').val(); //paymentAmount	支付金额
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
			//相关区域显示

		},
		//	点击取消返回审批列表页面
		clearexamine: function() {
			$("#clearBtn").off().on("click", function() {
				$yt_common.parentAction({
					url: $yt_option.parent_action_path, //父级中转地址,固定配置项,只有统一修改处理。
					funName: 'locationToMenu', //指定方法名，定位到菜单方法
					data: {
						url: 'view/system-sasac/expensesReim/module/reimApply/reimApproveList.html' //要跳转的页面路径
					}
				});
			});
		},
		
		/**
		 * 获取流程日志
		 * @param {Object} 
		 */
		getCommentByProcessInstanceId: function() {
			//获取页面跳转传输的参数对象
			var requerParameter = $yt_common.GetRequest();
			// 获取传输的项目ID
			var processInstanceId=requerParameter.processInstanceId;
			
			$.ajax({
				type: "post",
				url: "basicconfig/workFlow/getWorkFlowLog",
				async: false,
				data: {
					processInstanceId: processInstanceId
				},
				success: function(data) {
					var txt = '';
					if(!!data && data.flag == '0') {
						//数据列表
						var list = data.data || [];
						var imgUrl = "";
						for(var i = 0, len = list.length; i < len; i++) {
							if(i == 0){
								imgUrl = "../../../../../resources-sasac/images/common/log-border-color.png";
							}else{
								imgUrl = "../../../../../resources-sasac/images/common/log-info-border.jpg";
							}
							//首行
							txt += '<div class="log-info">'+
											(i==list.length-1?'':'<div class="log-icon-border"></div>')+
											'<div class="log-icon">'+
												'<img src="'+(list.length==1?'../../../../../resources-sasac/images/common/num-icon-one.png':(i==0?'../../../../../resources-sasac/images/common/log-num-first.png':'../../../../../resources-sasac/images/common/log-num.png'))+'" />'+
												'<div class="log-icon-num" '+(i==0?'style="top: 7px;"':'')+'>'+(list.length-i)+'<div></div></div>'+
											'</div>'+
											'<div class="log-details '+(i == 0 ? "log-shadow-sty":"")+'" '+((list[i].commment == undefined || list[i].commment == null || list[i].commment == "")  ? 'style="padding-bottom: 30px;"':'')+'>'+
												'<label class="log-name">' + list[i].userName + '</label>'+
												'<img style="'+(i == 0 ? "left: -9px;":"left:-8px;")+'" src="'+imgUrl+'"/>'+
												'<div>'+
													'<p><label class="log-title">操作状态：</label><span class="log-state">' + list[i].taskName + '</span></p>'
													 + ((list[i].commment == undefined || list[i].commment == null || list[i].commment == "")  ? '' : ('<p class="log-ideap"><label class="log-title">操作意见：</label><label class="log-idea">'+ list[i].commment + '</label></p>')) +	
												'</div>'+
											'</div>'+
											'<label class="log-time">' + list[i].commentTime + '</label>'+
										'</div>';
						}
						$('.flow-div').html(txt);
					}else{
						$(".appr-flow-log").hide();
					}
				}
			});
		},
	};

	$(function() {
		serveExamine.init();
		serveExamine.clearexamine();
	});
})(jQuery, window);