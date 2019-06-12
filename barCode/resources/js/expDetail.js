(function($, window) {
	var serveExamine = {
		appId: '', //支出申请id
		costType: '', //费用类型
		processInstanceId: '', //流程日志id，
		request_params:'',
		/**
		 * 开始执行
		 */
		init: function() {
			var ts = this;
			//serveExamine.appId = 36;
			serveExamine.appId = serveExamine.GetQueryString('appId'); //支出申请id
			ts.getReimAppInfoDetailByReimAppId(); //分页获取页面数据
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
		},
		/**
		 * 事件处理
		 */
		events: function() {
			var me = this;
			//关闭当前窗体
			$("#closeBtn").click(function() {
				window.close();
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
			//点击个人转账相关信息详情按钮
			$('table.payee-personal').on('click', '.to-data', function() {
				//显示背景蒙层
				$("#pop-modle-alert").show();
				//当前所在行
				var tr = $(this).parents('tr');
				//填充数据
				$('#perPayeeName').text(tr.attr('payeename')); //收款人姓名
				//个人应收款总金额（元）
				$('#perPersonalTotal').text(tr.attr('personalTotal'));

				//借款单
				var choiceLoan = tr.attr('choiceLoan');
				if(choiceLoan) {
					$('.personal-payment .display-loan').show();
					//借款单存在显示并赋值对应数据
					$('#perChoiceLoan').text(tr.attr('choiceLoan'));
					//借款单欠款金额
					$('.per-arrears-money').text(tr.attr('arrearsmoney'));
					//本次冲销金额
					$('.per-reverse-money').text(tr.attr('thereversemoney'));
				} else {
					//否则隐藏数据
					$('.personal-payment .display-loan').hide();
					$('#perChoiceLoan').text('').niceSelect();
					//借款单欠款金额
					$('.per-arrears-money').text('0.00');
					//本次冲销金额
					$('.per-reverse-money').text('0.00');
				}
				//冲销方式
				$('#perWiteOffPersonal').text(tr.attr('witeOffPersonal'));
				//个人冲销后补领金额（元）
				$('.per-writeoff-money').text(tr.attr('personalWriteoff'));
				//收款方式：现金（元
				$('#perCash').text(tr.attr('cash'));
				//收款方式：公务卡（元）
				$('#perOfficialCard').text(tr.attr('officialCard'));
				//收款方式：转账（元）
				$('#perTransferAccounts').text(tr.attr('transferAccounts'));
				//身份证号码
				$('#perIdCarkno').text(tr.attr('idCarkno'));
				//银行卡号
				$('#perPayeeBank').text(tr.attr('payeeBank'));
				//开户银行名称
				$('#perBankName').text(tr.attr('bankName'));
				//移动电话
				$('#perPhoneNum').text(tr.attr('phoneNum'));
				//offOpenBank 公务卡 - 开户银行
				$('#perOffOpenBank').text(tr.attr('offOpenBank'));
				//offAccounts 公务卡 - 银行卡号
				$('#perOffAccounts').text(tr.attr('offAccounts'));
				
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
				var choiceLoan = tr.attr('choiceLoan');
				if(choiceLoan) {
					$('.personal-payment .display-loan').show();
					//借款单存在显示并赋值对应数据
					$('#perChoiceLoan').text('--');
					//借款单欠款金额
					$('.per-arrears-money').text('0.00');
					//本次冲销金额
					$('.per-reverse-money').text('0.00');
				} else {
					//否则隐藏数据
					$('.personal-payment .display-loan').hide();
					$('#perChoiceLoan').text('--');
					//借款单欠款金额
					$('.per-arrears-money').text('0.00');
					//本次冲销金额
					$('.per-arrears-money').text('0.00');
				}
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
			//打印按钮点击事件
			$(".bottom-btn button.print-btn").on("click", function() {
				var pageUrl = ""; //即将跳转的页面路径
				var goPageUrl = "view/system/expensesReim/module/approval/expenApplApprList.html"; //左侧菜单指定选中的页面路径
				//打印粘贴单
				if($(this).val() == "printBills") {
					pageUrl = "view/system/expensesReim/module/print/InvoicePasting.html?appId=" + serveExamine.appId;
				}
				//打印支出凭单
				if($(this).val() == "printExpend") {
					pageUrl = "view/system/expensesReim/module/print/expenditureVoucher.html?expenditureAppId=" + serveExamine.appId;
				}
				//打印支出凭单明细
				if($(this).val() == "printExpendDetail") {
					pageUrl = 'view/system/expensesReim/module/print/expenditureVoucherDetailed.html?expenditureAppId=' + serveExamine.appId+"&costType="+serveExamine.costType;
				}
				//调用公用的打开新页面方法传输参数不需要左侧菜单
				$yt_baseElement.openNewPage(2,pageUrl);
			});
 			//编辑页面跳转
       		 $("#expenseEdit").on("click",function(){
				 //即将跳转页面
				var pageUrl=$yt_option.websit_path+"view/system/expensesReim/module/reimApply/expenseExamine.html?appId="+serveExamine.appId;
				//调用公用的跳转方法
				window.location.href = pageUrl;
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

				var html = '<tr> <td>' + budgetProject + '</td> <td style="text-align: right;">' + budgetMoney + '</td> <td>' + specialNum + '</td> <td><span class="operate-update"><img src="../resources/images/common/edit-icon.png"></span><span class="operate-del"><img src="../resources/images/common/del-icon.png"></span></td> </tr>';

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
					'<td><span class="operate-update"><img src="../resources/images/common/edit-icon.png"></span><span class="operate-del"><img src="../resources/images/common/del-icon.png"></span></td>' +
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
		 * 根据申请Id获取申请详细信息
		 * @param {Object} reimAppId
		 */
		getReimAppInfoDetailByReimAppId: function() {
			var me = this;
			$.ajax({
				type: "post",
				url: $yt_option.base_path+"sz/expenditureApp/getExpenditureAppInfoByAppId",
				async: true,
				data: {
					expenditureAppId: serveExamine.appId,
					"CASPARAMS":"OFF_INDEX"
				},
				success: function(data) {
					var datas = eval('('+data+')');
					var d = datas.data;
					serveExamine.processInstanceId = d.processInstanceId;
					serveExamine.getCommentByProcessInstanceId(serveExamine.processInstanceId);
					serveExamine.costType = d.costType;
					me.saveData = d;
					//判断是否有返回的页面操作方法名称
					if(d.jsFun) {
						//存在执行相应的方法
						me[d.jsFun]();
					}

					//数据回显
					me.showDetail(d);
					console.log(d.workFlowState);
					//申请人填报 对应key值: activitiStartTask
					//工作流最后一步审批操作对应key值: activitiEndTask
					//最后一步显示财务支付相关
					me.getPaymentAmountInfoList(d.expenditureAppId);
					$('.pay-detail,.print-div').show();
					//清除审批人的必填验证
					$('#approve-users').attr("validform", "{isNull:false,msg:'请选择审批人'}");
					//财务出纳岗显示支出凭单
					//判断当前登录人如果不是申请人或财务,就隐藏打印单据粘贴单按钮
				/*	if($yt_common.user_info.positionCode == 'CNG' ||  d.applicantUser == $yt_common.user_info.userName){
						//显示打印单据粘贴单按钮
						$("#printBills").show();
					}else{
						//隐藏打印单据粘贴单按钮
						$("#printBills").hide();
					}*/
					
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
				url:$yt_option.base_path + "sz/reimApp/getCostAppInfoDetailByParams",
				async: true,
				data: {
					appId: appId,
					costType: costType,
					"CASPARAMS":"OFF_INDEX"
				},
				success: function(data) {
					//数据回显
					if(data){
						me.showCostDetail(data.data);
					}else{
						$yt_alert_Model.prompt(data.message);
					}
					
				}
			});
		},
		/**
		 * 根据id获取数据
		 * @param {Object} reimAppId 报销申请Id
		 * @param {Object} previewFalg 是否预览(true : 预览,flase : 生成)
		 * @param {Object} qrCodeContext 二维码访问路径(报销审批路径)
		 */
		getReimPreviewDetailByReimAppId: function(reimAppId, previewFalg, qrCodeContext) {
			var me = this;
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "sz/reimApp/getCostAppInfoDetailByParams",
				async: true,
				data: {
					reimAppId: reimAppId,
					previewFalg: previewFalg,
					qrCodeContext: qrCodeContext,
					"CASPARAMS":"OFF_INDEX"
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
		 * 数据回显
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
			//申请人职务code: applicantUserPositionName
			$('#jobName').text(d.applicantUserPositionName == "" ? "--" : d.applicantUserPositionName); 
			//电话号码
			$("#telPhone").text(d.applicantUserPhone == "" ? "--" : d.applicantUserPhone);
			//支出申请事由
			$("#expenditureAppName").text(d.expenditureAppName);
			$('#advanceAppId').val(d.advanceAppId); //advanceAppId	事前申请id
			//$('#loanAppId').val(d.loanAppId); //loanAppId	借款申请表id
			//$('#loanAmount').text(d.arrearsAmount ? (fMoney(d.arrearsAmount)) : '0.00');
			//本次冲销金额：报销总额大于欠款 ，本次冲销=欠款金额,报销总额小于等于欠款，本次冲销=报销总额。
			var outWriteAmount = d.totalAmount <= d.arrearsAmount ? d.totalAmount : d.arrearsAmount;
			$('#outWriteAmount').text(fMoney(outWriteAmount || '0'));
			$('#reimAppId').val(d.reimAppId); //reimAppId	报销申请表id
			$('#advanceAppNum').text((d.advanceAppNum == '' ? '--' : d.advanceAppNum)); //advanceAppNum	事前申请编号
			if(d.advanceAppNum) {
				$('.advance-relevance').show();
				$('#advanceAppBalance').text(d.advanceAppBalance ? (fMoney(d.advanceAppBalance) + '元') : '--');
			}
			//项目名称存在时 显示项目名称
			if(d.prjName) {
				$('#prjName').text(d.prjName);
				$('.prj-name-tr').show();
			}
			$('#reimAppNum').val(d.reimAppNum); //reimAppNum	报销单号
			$('#formNum').text(d.expenditureAppNum).attr('val', d.expenditureAppNum);
			$('#reimAppName').text(d.reimAppName).attr('val', d.advanceAppReason); //reimAppName	报销事由

			$('#costTypeName').text(d.costTypeName).attr('val', d.costType); //costTypeName	费用类型名称//costType	费用类型
			//isSpecial	是否专项(1 是 2 否)
			//$('#isSpecial').text(d.isSpecial == '1' ? '是' : '否').attr('val', d.isSpecial);
			//specialCode	专项所属code

			$('#specialName').text((d.specialName == '' ? '--' : d.specialName)).attr('val', d.specialCode); //specialName	专项所属名称
			$('#budgetBalanceAmount').text(d.budgetBalanceAmount ? fMoney(d.budgetBalanceAmount) + '万元' : '--'); //budgetBalanceAmount	预算剩余额度
			$('#deptBudgetBalanceAmount').text(d.deptBudgetBalanceAmount ? fMoney(d.deptBudgetBalanceAmount) + '万元' : '--');
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
			$('#processInstanceId').val(serveExamine.processInstanceId);
			//获取流程日志
			me.getCommentByProcessInstanceId(serveExamine.processInstanceId);
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
			var thisTotal = 0;
			$.each(costDetailsList, function(i, n) {
				detaHtml += '<tr pkId="' + n.costDetailsId + '" budgetCode="' + n.publicServiceProCode + '" costCode="' + n.costType + '" budgetProject="' + n.publicServiceProName + '" applyDate="' + n.activityDate + '" siteVal="' + n.placeName + '" costBreakdown="' + n.costTypeName + '" standardMoney="' + n.standardAmount + '" budgetMoney="' + n.activityAmount + '" accompanyNum="' + n.peopleNum + '">' +
					'<td><span class="">' + n.publicServiceProName + '</span></td>' +
					'<td><span class="act-date">' + n.activityDate + '</span></td>' +
					'<td><span class="place-name">' + n.placeName + '</span></td>' +
					'<td>' + n.costTypeName + '</td>' +
					/*'<td style="text-align: right;"><div class="stan-money" money=' + n.standardAmount + '>' + fMoney(n.standardAmount || '0') + '</div></td>' +*/
					'<td style="text-align: right;"><div class="money" money=' + n.activityAmount + '>' + fMoney(n.activityAmount || '0') + '</div></td>' +
					'<td><span class="people-num">' + n.peopleNum + '</span></td>' +
					'</tr>';
				thisTotal += +n.activityAmount;
				//结算方式复选框存在并且有选中的值时
				if(costDetaClose.length > 0 && n.setMethod) {
					//设置选中
					costDetaClose.setCheckBoxState('check');
				}
			});
			detaHtml += '<tr><td>合计</td><td></td><td></td><td></td><td style="text-align: right;" class="total-money">' + $yt_baseElement.fmMoney(thisTotal) + '</td><td></td></tr>';
			//追加表格代码
			$('#paymentList .yt-tbody').html(detaHtml);

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
				return '--';
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
					'<td class="text-overflow-sty" data-text="remarks" title="' + n.remarks + '">' + (n.remarks == "" ? "无" : n.remarks) + '</td>' +
					'<td style="display:none;">' +
					'<input type="hidden" class="hid-cost-type" value="0"/>' +
					'<span class="operate-update"><img src="../resources/images/common/edit-icon.png"/></span>' +
					'<span class="operate-del"><img src="../resources/images/common/del-icon.png"/></span>' +
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
			serveExamine.updateMoneySum(0);
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
					'<td class="text-overflow-sty" data-text="remarks" title="' + n.remarks + '">' + (n.remarks == "" ? "无" : n.remarks) + '</td>' +
					'<td style="display:none;">' +
					'<input type="hidden" class="hid-set-met" data-val="setMethod"/>' +
					'<input type="hidden" class="hid-cost-type" value="1"/>' +
					'<span class="operate-update"><img src="../resources/images/common/edit-icon.png"/></span>' +
					'<span class="operate-del"><img src="../resources/images/common/del-icon.png"/></span>' +
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
			serveExamine.updateMoneySum(1);
			//costOtherList	其他费用
			var costOtherList = data.costOtherList;
			var otherHtml = '';
			//结算方式复选框
			var costOtherClose = $('#other-list-info').next().find('.check-label input');
			$.each(costOtherList, function(i, n) {
				otherHtml += '<tr>' +
					'<td><span>' + n.costTypeName + '</span><input type="hidden" data-val="costType" value="' + n.costType + '"/></td>' +
					'<td class="font-right money-td" data-text="reimAmount">' + fMoney(n.reimAmount || '0') + '</td>' +
					'<td class="text-overflow-sty" data-text="remarks" title="' + n.remarks + '">' + (n.remarks == "" ? "无" : n.remarks) + '</td>' +
					'</tr>';
				//结算方式复选框存在并且有选中的值时
				if(costOtherClose.length > 0 && n.setMethod) {
					//设置选中
					costOtherClose.setCheckBoxState('check');
				}
			});
			otherHtml += '<tr class="total-last-tr">' +
				'<td><span class="tab-font-blod">合计</span></td>' +
				'<td class="font-right"><span class="tab-font-blod money-sum"></span></td>' +
				'<td></td></tr>';
			$('#other-list-info tbody').html(otherHtml);
			//调用合计方法
			serveExamine.updateMoneySum(2);
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

			//会议详情
			var meetingList = data.meetingList;
			$.each(meetingList, function(i, n) {
				$("#meetTypeName").text(n.meetTypeName);
				$("#meetName").text(n.meetName);
				$("#meetAddress").text(n.meetAddress);
				$("#meetStartTime").text(n.meetStartTime);
				$("#meetEndTime").text(n.meetEndTime);
				$("#meetDays").text(n.meetDays);
				$("#meetOfNum").text(n.meetOfNum);
				$("#meetWorkerNum").text(n.meetWorkerNum);
			});
			//会议费用明细
			var meetingCostList = data.meetingCostList;
			$.each(meetingCostList, function(i, n) {
				$("#meetHotel").text(n.meetHotel);
				$("#meetFood").text(n.meetFood);
				$("#meetOther").text(n.meetOther);
				$("#meetAmount").text(n.meetAmount);
				$("#meetAverage").text(n.meetAverage);
			});

			//付款信息区域
			var payReceivablesData = me.saveData.payReceivablesData;
			//单位-收款方集合
			var gatheringUnitList = payReceivablesData.gatheringUnitList;
			var otherPayeeHtml = "";
			var otherPayeeTotale = 0;
			$.each(gatheringUnitList, function(i, n) {
				otherPayeeHtml += '<tr>' +
					'<td>' + n.unitName + '</td>' +
					'<td >' + n.reverseTheWayName + '</td>' +
					'<td style="text-align:right;">' + $yt_baseElement.fmMoney(n.amount) + '</td>' +
					'<td >' + n.openBank + '</td>' +
					'<td >' + n.accounts + '</td>' +
					'<td >' + (n.isContract == 1 ? '是' : '否') + '</td>' +
					'<td >' + (n.remarks == '' ? '无' : n.remarks) + '</td>' +
					'</tr>';
				otherPayeeTotale += +n.amount;
			});
			$(".payee-unit .yt-tbody .payee-unit-total").before(otherPayeeHtml);
			$(".payee-unit .payee-unit-total .payee-unit-money").text($yt_baseElement.fmMoney(otherPayeeTotale));
			if(gatheringUnitList.length == 0) {
				$(".payee-unit-model").hide();
			}
			//个人-收款方集合
			var gatheringPersonList = payReceivablesData.gatheringPersonList;
			var gatheringPersonHtml = "";
			var gatheringPersonTotale = 0;
			$.each(gatheringPersonList, function(i, n) {
				//theReverseMoney 本次冲销金额：报销总额大于欠款 ，本次冲销=欠款金额,报销总额小于等于欠款，本次冲销=报销总额。
				var theReverseMoney = n.amount <= n.loanAppArrearsAmount ? n.amount : n.loanAppArrearsAmount;
				//'<td style="text-align: right;">' + theReverseMoney + '</td>' + 
				gatheringPersonHtml += '<tr class="payee-personal-tr" pkid="" payeeval="' + n.personalCode + '" payeename="' + n.personalName + '" pedepartment="' + n.personalDept + '" perank="' + n.personalJobLevelName + '" personaltotal="' + n.amount + '" witeoffpersonal="' + n.reverseTheWay + '" personalwriteoff="' + n.replaceAmount + '" cash="' + n.cash + '" officialcard="' + n.officialCard + '" transferaccounts="' + n.transfer + '" payeeradio="' + n.isContract + '" personalspecial="' + n.remarks + '" idcarkno="' + n.idCard + '" payeebank="' + n.accounts + '" bankname="' + n.openBank + '" phonenum="' + n.phoneNum + '" choiceloan="' + n.loanAppNum + '" choiceloanval="' + n.loanAppId + '" arrearsmoney="' + n.loanAppArrearsAmount + '" thereversemoney="0.00" offOpenBank="'+ n.offOpenBank +'" offAccounts="'+ n.offAccounts +'"><td class="per" value="personal">' + n.personalName + '</td><td style="text-align: right;" class="personalTotal">' + n.amount + '</td><td>' + (n.reverseTheWayName ? n.reverseTheWayName : '无') + '</td><td style="text-align: right;">' + (serveExamine.fmMoney(theReverseMoney)) + '</td><td style="text-align: right;">' + (serveExamine.fmMoney(n.replaceAmount)) + '</td><td style="text-align: right;">' + (serveExamine.fmMoney(n.cash)) + '</td><td style="text-align: right;">' + (serveExamine.fmMoney(n.officialCard)) + '</td><td style="text-align: right;">' + (serveExamine.fmMoney(n.transfer)) + '</td><td><a class="yt-link to-data">详情</a></td><td>' + (n.isContract == 1 ? '有' : '无') + '</td><td>' + n.remarks + '</td></tr>';
				gatheringPersonTotale += +n.amount;
			});
			$(".payee-personal .yt-tbody .payee-personal-total").before(gatheringPersonHtml);
			$(".payee-personal .payee-personal-total .payee-personal-money").text($yt_baseElement.fmMoney(gatheringPersonTotale));
			if(gatheringPersonList.length == 0) {
				$(".payee-personal-model").hide();
			}
			//其他-收款方集合
			var gatheringOtherList = payReceivablesData.gatheringOtherList;
			var gatheringOtherHtml = "";
			var gatheringOtherTotale = 0;
			$.each(gatheringOtherList, function(i, n) {
				gatheringOtherHtml += '<tr>' +
					'<td>' + n.otherName + '</td>' + //其他付款
					'<td >' + n.reverseTheWayName + '</td>' + //冲销方式
					'<td style="text-align:right;">' + $yt_baseElement.fmMoney(n.amount) + '</td>' + //金额（元）
					'<td >' + (n.isContract == 1 ? '是' : '否') + '</td>' + //有无合同协议	
					'<td>' + (n.remarks == '' ? '无' : n.remarks) + '</td>' + //特殊说明
					'</tr>';
				gatheringOtherTotale += +n.amount;
			});
			$(".payee-other .yt-tbody .payee-other-total").before(gatheringOtherHtml);
			$(".payee-other .payee-other-total .payee-other-total-money").text($yt_baseElement.fmMoney(gatheringOtherTotale));
			if(gatheringOtherList.length == 0) {
				$(".payee-other-model").hide();
			}
			if(gatheringOtherList.length == 0 && gatheringPersonList.length == 0 && gatheringUnitList.length == 0) {
				$(".payee-info-isshow").html('<table style="width:100%"><tr style="border:0px;background-color:#fff !important;"><td align="center"style="border:0px;"><div class="no-data" style="width: 280px;padding:0;margin: 0 auto;">' +
					'<img src="../resources/images/common/no-data.png" alt="" style="padding:10px 0;">' +
					'</div></td></tr></table>');
			}

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
			//costNormalList 普通报销-费用明细/普通付款-付款明细 json
      me.setCostNormalList(data.costNormalList);
      //costSpecialList  社保报销-费用明细/普通付款-付款明细 json
      me.setCostSpecialList(data.costSpecialList);
			//判断是否有值处理
			//城市间交通费
			if(data.costCarfareList.length == 0) {
				$(".traffic-cost-div").hide();
			}
			//住宿费
			if(data.costHotelList.length == 0) {
				$(".hotel-list-model").hide();
			}
			//其他费用
			if(data.costOtherList.length == 0) {
				$(".other-cost-model").hide();
			}
			//补助明细
			if(data.costSubsidyList.length == 0) {
				$(".subsidy-model").hide();
			}
			if(data.costCarfareList.length == 0 && data.costHotelList.length == 0 && data.costOtherList.length == 0 && data.costSubsidyList.length == 0) {
				$(".cost-list-model").html('<table style="width:100%"><tr style="border:0px;background-color:#fff !important;"><td align="center"style="border:0px;"><div class="no-data" style="width: 280px;padding:0;margin: 0 auto;">' +
					'<img src="../resources/images/common/no-data.png" alt="" style="padding:10px 0;">' +
					'</div></td></tr></table>');
			}
			if(data.costTrainApplyInfoList.length == 0 && data.costTeachersFoodApplyInfoList == 0 && data.costTeachersLectureApplyInfoList == 0 && data.costTeachersTravelApplyInfoList == 0 && data.costTeachersHotelApplyInfoList == 0) {
				$("#costDetailDiv").html('<table style="width:100%"><tr style="border:0px;background-color:#fff !important;"><td align="center"style="border:0px;"><div class="no-data" style="width: 280px;padding:0;margin: 0 auto;">' +
					'<img src="../resources/images/common/no-data.png" alt="" style="padding:10px 0;">' +
					'</div></td></tr></table>');
			}
		},
		/**
		 * trainApplyInfoList	师资-培训信息json
		 * 设置 师资培训信息列表数据
		 * @param {Object} list
		 */
		setTrainApplyInfoList: function(list) {
			var html = '';
			$.each(list, function(i, n) {
				//培训费信息赋值
				$('#trainType').text(n.trainTypeName);
				$('#regionDesignation').text(n.regionDesignation);
				$('#regionName').text(n.regionName);
				$('#reportTime').text(n.reportTime);
				$('#endTime').text(n.endTime);
				$('#trainDays').text(n.trainDays);
				$('#trainOfNum').text(n.trainOfNum);
				$('#workerNum').text(n.workerNum);
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
					'<td style="display:none"><span class="operate-update"><img src="../resources/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../resources/images/common/del-icon.png"></span></td></tr>';
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
			var total = 0;
			$.each(list, function(i, n) {
				html += '<tr>' +
					'<td>' + n.trainTypeName + '</td>' +
					'<td class="moneyText">' + $yt_baseElement.fmMoney(n.standard) + '</td>' +
					'<td>' + n.trainOfNum + '</td>' +
					'<td>' + n.trainDays + '</td>' +
					'<td class="moneyText">' + $yt_baseElement.fmMoney(n.averageMoney) + '</td>' +
					'<td>' + (n.remark == '' ? '无' : n.remark) + '</td>' +
					'</tr>';
				total += +n.averageMoney;
			});
			html += '<tr class="last"><td>合计</td><td></td><td></td><td></td><td class="moneyText costTotal">' + $yt_baseElement.fmMoney(total) + '</td><td></td></tr>';
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
			$.each(list, function(i, n) {
				html += '<tr pid="' + n.foodId + '">' +
					'<td><input type="hidden" class="lectureId" value="' + n.lecturerId + '">' + n.lecturerName + '</td>' +
					'<td class="avg" style="text-align: right;">' + serveExamine.fmMoney(n.averageMoney) + '</td>' +
					'<td class="day">' + n.foodOfDays + '</td>' +
					'<td class="moneyText sum-pay">' + serveExamine.fmMoney(n.foodAmount) + '</td>' +
					'<td class="dec">' + n.remarks + '</td>' +
					'<td style="display:none"><input type="hidden" class="popM" value="4"/>' +
					'<span class="operate-update"><img src="../resources/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../resources/images/common/del-icon.png"></span></td>' +
					'</tr>';
				total += +n.foodAmount;
			});
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveExamine.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveExamine.fmMoney(totalTraffic) + '</td></tr>';
			$('#dietFeeTable tbody .end-tr').before(html);
			$('#dietFeeTable tbody .costTotal').text(serveExamine.fmMoney(total));
			if(list.length == 0) {
				$('.food-money').hide();
				$('.food-money').parent().hide();
				$('#dietFeeTable').hide();
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
					'<span class="operate-update"><img src="../resources/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../resources/images/common/del-icon.png"></span>' +
					'</td></tr>';
				total += +n.perTaxAmount;
			});
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveExamine.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveExamine.fmMoney(totalTraffic) + '</td></tr>';
			$('#lectureFeeTable tbody .end-tr').before(html);
			$('#lectureFeeTable tbody .costTotal').text(serveExamine.fmMoney(total));
			if(list.length == 0) {
				$('.lecture-money').hide();
				$('.lecture-money').parent().hide();
				$('#lectureFeeTable').hide();
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
					'<td class="dec">' + n.remarks + '</td>' +
					'<td  style="display:none"><input type="hidden" class="popM" value="2"/>' +
					'<span class="operate-update"><img src="../resources/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../resources/images/common/del-icon.png"></span>' +
					'</td></tr>';
				total += +n.carfare;
			});
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveExamine.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveExamine.fmMoney(totalTraffic) + '</td></tr>';
			$('#carFeeTable tbody .end-tr').before(html);
			$('#carFeeTable tbody .costTotal').text(serveExamine.fmMoney(total));
			if(list.length == 0) {
				$('.traffic-money').hide();
				$('.traffic-money').parent().hide();
				$('#carFeeTable').hide();
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
			$.each(list, function(i, n) {
				html += '<tr pid="' + n.teachersHotelId + '">' +
					'<td class="name"><input type="hidden" class="lectureId" value="' + n.lecturerId + '">' + n.lecturerName + '</td>' +
					'<td class="sdate">' + n.startTime + '</td>' +
					'<td class="edate">' + n.endTime + '</td>' +
					'<td class="moneyText avg">' + serveExamine.fmMoney(n.averageMoney) + '</td>' +
					'<td class="day">' + n.hotelDays + '</td>' +
					'<td class="moneyText sum-pay">' + serveExamine.fmMoney(n.hotelExpense) + '</td>' +
					'<td class="dec">' + n.remarks + '</td>' +
					'<td style="display:none"><input type="hidden" class="popM" value="3"/>' +
					'<span class="operate-update"><img src="../resources/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../resources/images/common/del-icon.png"></span>' +
					'</td></tr>';
				total += +n.hotelExpense;
			});
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + serveExamine.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + serveExamine.fmMoney(totalTraffic) + '</td></tr>';
			$('#hotelFeeTable tbody .end-tr').before(html);
			$('#hotelFeeTable tbody .costTotal').text(serveExamine.fmMoney(total));
			if(list.length == 0) {
				$('.accommodation-money').hide();
				$('.accommodation-money').parent().hide();
				$('#hotelFeeTable').hide();
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
					'<td>' + (n.remarks == '' ? '无' : n.remarks) + '</td>' +
					'</tr>';
				total += +n.normalAmount;
			});
			$('.ordinary-approval #costList tbody .last').before(html);
			$('.ordinary-approval #costList tbody #reimAmountlSum').text($yt_baseElement.fmMoney(total));
		},
		/**
     * 社保费用详细
     * @param {Object} list
     * @param {Object} exports
     */
    setCostSpecialList : function(list) {
      var html = '';
      var specialAmountSum = 0;
      var deductBudgetAmountSum=0;
      var code = $('#costTypeName').attr('val');
      if(code == 'SOCIAL_SECURITY_FEE' ||code == 'MEDICAL_EXPENSES' || code == 'LABOUR_UNION_FUNDS' || code == 'PARTY_BUILDING_FUNDS'){
        $.each(list,function(i, n) {
          html += '<tr class="yt-tab-row">'+
              '<td  class="specialContent">'+ n.specialName + '</td>'+ 
              '<td style="text-align: right;" class="specialAmount">'+ ($yt_baseElement.fmMoney(n.specialAmount))+ '</td>'+
              '<td class="specialInstructions"> '+ (n.remarks || '') + '</td>'+
              '</tr>';
          specialAmountSum += +n.specialAmount;
        });
        $('.ordinary-approval #specialCostList tbody .last').before(html);
        $('.ordinary-approval #specialCostList tbody #specialAmountSum').text($yt_baseElement.fmMoney(specialAmountSum));
      }else if(code == 'ACCRUED_TAX' || code == 'SPECIAL_DEDUCTION'){
        $.each(list,function(i, n) {
          html += '<tr class="yt-tab-row">'+
              '<td  class="specialContent">'+ n.specialName + '</td>'+ 
              '<td style="text-align: right;" class="specialAmount">'+ ($yt_baseElement.fmMoney(n.specialAmount))+ '</td>'+
              '<td style="text-align: right;" class="deductBudgetAmount">'+ ($yt_baseElement.fmMoney(n.deductBudgetAmount))+ '</td>'+
              '<td class="specialInstructions"> '+ (n.remarks || '') + '</td>'+
              '</tr>';
          specialAmountSum += +n.specialAmount;
          deductBudgetAmountSum += +n.deductBudgetAmount;
        });
        $('.ordinary-approval #specialCostList tbody .last').before(html);
        $('.ordinary-approval #specialCostList tbody #specialAmountSum').text($yt_baseElement.fmMoney(specialAmountSum));
        $('.ordinary-approval #specialCostList tbody #deductBudgetAmountSum').text($yt_baseElement.fmMoney(deductBudgetAmountSum));
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
			if(list.length){
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
			}
			$('#attIdStr').html(ls);
			//图片下载
			$('#attIdStr .file-dw').on('click', function() {
				var id = $(this).parent().attr('fid');
				window.location.href = $yt_option.base_path + 'fileUpDownload/download?pkId=' + id + '&isDownload=true';
			});
			//图片预览
			$('#attIdStr .file-pv img').showImg();
			if(list.length == 0) {
				$("#attIdStr").html("<span style='color:;'>暂无附件</span>");
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
				url: $yt_option.base_path + "basicconfig/dictInfo/getDictInfoByTypeCode",
				async: true,
				data: {
					dictTypeCode: 'TO_LOAN_TYPE',
					"CASPARAMS":"OFF_INDEX"
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
				url:$yt_option.base_path + "sz/reimApp/submitReimAppInfo",
				async: true,
				data:subData,
				success: function(data) {
					$yt_alert_Model.prompt(data.message);
					if(data.flag == 0) {
						//跳转列表页面
						window.location.href = $yt_option.websit_path + 'view/system/expensesReim/module/reimApply/reimApproveList.html';
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
			//相关区域显示
			$('.index-main-div').show();
			//加载区域页面
			serveExamine.loadingWord('view/system/expensesReim/module/reimApply/hospitalitySpendingDetail.html');
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
			serveExamine.loadingWord('view/system/expensesReim/module/reimApply/costDetailApproval.html');
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
			serveExamine.loadingWord('view/system/expensesReim/module/reimApply/travelSpendingDetails.html');
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
			serveExamine.loadingWord('view/system/expensesReim/module/busiTripApply/trainApproval.html');
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
			serveExamine.loadingWord('view/system/expensesReim/module/beforehand/meetingCostApplyDetails.html');
		},
		/**
     * 社保费
     */
    showSheBaoFun : function() {
      $('.index-main-div').html('');
      $('.qtip-text-div').hide();
      $('.mod-div').hide();
      $('.approve-div,.else-div').show();
      serveExamine.loadingWord('view/system/expensesReim/module/reimApply/costDetail.html');
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
      $(".operation").hide();
    },
    /**
     * 应交税费用
     */
    showYingJiaoFun : function() {
      $('.index-main-div').html('');
      $('.qtip-text-div').hide();
      $('.mod-div').hide();
      $('.approve-div,.else-div').show();
      serveExamine.loadingWord('view/system/expensesReim/module/reimApply/costDetail.html');
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
      $(".operation").hide();
    },
    /**
     * 医疗费费用
     */
    showYiLiaoFun : function() {
      $('.index-main-div').html('');
      $('.qtip-text-div').hide();
      $('.mod-div').hide();
      $('.approve-div,.else-div').show();
      serveExamine.loadingWord('view/system/expensesReim/module/reimApply/costDetail.html');
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
      $(".operation").hide();
    },
    /**
     * 工会费费用
     */
    showGongHuiFun : function() {
      $('.index-main-div').html('');
      $('.qtip-text-div').hide();
      $('.mod-div').hide();
      $('.approve-div,.else-div').show();
      serveExamine.loadingWord('view/system/expensesReim/module/reimApply/costDetail.html');
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
      $(".operation").hide();
    },
    /**
     * 建党费费用
     */
    showDangJianFun : function() {
      $('.index-main-div').html('');
      $('.qtip-text-div').hide();
      $('.mod-div').hide();
      $('.approve-div,.else-div').show();
      serveExamine.loadingWord('view/system/expensesReim/module/reimApply/costDetail.html');
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
      $(".operation").hide();
    },
    /**
     * 专项扣除
     */
    showKouChuFun : function() {
      $('.index-main-div').html('');
      $('.qtip-text-div').hide();
      $('.mod-div').hide();
      $('.approve-div,.else-div').show();
      //收款方信息隐藏
      $("#payeeInformation").hide();
      //审批流程隐藏
      $(".appr-flow-log").hide();
      serveExamine.loadingWord('view/system/expensesReim/module/reimApply/costDetail.html');
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
      $(".operation").hide();
      
    },
		//	点击取消返回审批列表页面
		clearexamine: function() {
			$("#clearBtn").off().on("click", function() {
				$yt_common.parentAction({
					url: $yt_option.parent_action_path, //父级中转地址,固定配置项,只有统一修改处理。
					funName: 'locationToMenu', //指定方法名，定位到菜单方法
					data: {
						url: 'view/system/expensesReim/module/reimApply/reimApproveList.html' //要跳转的页面路径
					}
				});
			});
		},

		/**
		 * 获取流程日志
		 * @param {Object} 
		 */
		getCommentByProcessInstanceId: function() {
			var processInstanceId = serveExamine.processInstanceId;
			$.ajax({
				type: "post",
				url: $yt_option.base_path+"basicconfig/workFlow/getWorkFlowLog",
				async: false,
				data: {
					processInstanceId: processInstanceId,
					"CASPARAMS":"OFF_INDEX"
				},
				success: function(data) {
					var txt = '';
					var data = eval('('+data+')');
					if(!!data && data.flag == '0') {
						//数据列表
						var list = data.data || [];
						var imgUrl = "";
						for(var i = 0, len = list.length; i < len; i++) {
							if(i == 0) {
								imgUrl = "../resources/images/common/log-border-color.png";
							} else {
								imgUrl = "../resources/images/common/log-info-border.png";
							}
							//首行
							txt += '<div class="log-info">' +
								(i == list.length - 1 ? '' : '<div class="log-icon-border"></div>') +
								'<div class="log-icon">' +
								'<img src="' + (list.length == 1 ? '../resources/images/common/num-icon-one.png' : (i == 0 ? '../resources/images/common/log-num-first.png' : '../resources/images/common/log-num.png')) + '" />' +
								'<div class="log-icon-num" ' + (i == 0 ? 'style="top: 7px;"' : '') + '>' + (list.length - i) + '<div></div></div>' +
								'</div>' +
								'<div class="log-details ' + (i == 0 ? "log-shadow-sty" : "") + '" ' + ((list[i].comment == undefined || list[i].comment == null || list[i].comment == "") ? 'style="padding-bottom: 30px;"' : '') + '>' +
								'<label class="log-task-name">【'+list[i].taskName+'】</label>'+
								'<label class="log-name">' + list[i].userName + '</label>' +
								'<img style="' + (i == 0 ? "left: -9px;" : "left:-8px;") + '" src="' + imgUrl + '"/>' +
								'<div>' +
								'<p><label class="log-title">操作状态：</label><span class="log-state">' + list[i].operationState + '</span></p>' +
								((list[i].comment == undefined || list[i].comment == null || list[i].comment == "") ? '' : ('<p class="log-ideap"><label class="log-title">操作意见：</label><label class="log-idea">' + list[i].comment + '</label></p>')) +
								'</div>' +
								'</div>' +
								'<label class="log-time">' + list[i].commentTime + '</label>' +
								'</div>';
						}
						$('.flow-div').html(txt);
					} else {
						$(".appr-flow-log").hide();
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
		/**
		 * 1.1.8.5	支付明细列表
		 * @param {Object} appId
		 */
		getPaymentAmountInfoList: function(appId) {
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "sz/payDetailBillingVoucher/getPaymentAmountInfoList",
				async: true,
				data: {
					appId: appId,
					"CASPARAMS":"OFF_INDEX"
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
	 * 
	 * 表格金额合计更新
	 * 
	 * @param {Object} thisTab费用表格标识0交通费1.住宿费2.其他费用3补助
	 * 
	 * 
	 */
	updateMoneySum:function(thisTab){
		//thisTab参数0交通费1.住宿费2.其他费用3补助
		var moenySum = 0.00;
		if(thisTab == 0){
			$("#traffic-list-info tbody .money-td").each(function(i,n){
				moenySum += parseFloat($yt_baseElement.rmoney($(n).text()));
			});
			moenySum = $yt_baseElement.fmMoney(moenySum);
			if(moenySum != undefined && $yt_baseElement.rmoney(moenySum) >0){
			 $("#traffic-list-info tbody .money-sum").text(moenySum);
			}else{
			 $("#traffic-list-info tbody .money-sum").text("0.00");
			}
		}
		if(thisTab == 1){
			$("#hotel-list-info tbody .money-td").each(function(i,n){
				moenySum += parseFloat($yt_baseElement.rmoney($(n).text()));
			});
			moenySum = $yt_baseElement.fmMoney(moenySum);
			if(moenySum != undefined && $yt_baseElement.rmoney(moenySum) >0){
			 $("#hotel-list-info tbody .money-sum").text(moenySum);
			}else{
			 $("#hotel-list-info tbody .money-sum").text("0.00");
			}
		}
		if(thisTab == 2){
			$("#other-list-info tbody .money-td").each(function(i,n){
				moenySum += parseFloat($yt_baseElement.rmoney($(n).text()));
			});
			moenySum = $yt_baseElement.fmMoney(moenySum);
			if(moenySum != undefined && $yt_baseElement.rmoney(moenySum) >0){
			 $("#other-list-info tbody .money-sum").text(moenySum);
			}else{
			$("#other-list-info tbody .money-sum").text("0.00");
			}
		}
		if(thisTab == 3){
			$("#subsidy-list-info tbody .food-money").each(function(i,n){
				moenySum += parseFloat($yt_baseElement.rmoney($(n).text()));
			});
			moenySum = $yt_baseElement.fmMoney(moenySum);
			if(moenySum != undefined && $yt_baseElement.rmoney(moenySum) >0){
			  $("#subsidy-list-info tbody .money-sum").text(moenySum);
			}else{
			  $("#subsidy-list-info tbody .money-sum").text("0.00");
			}
			var cityMoneySum = 0.00;
			$("#subsidy-list-info tbody .city-money").each(function(i,n){
				cityMoneySum += parseFloat($yt_baseElement.rmoney($(n).text()));
			});
			cityMoneySum = $yt_baseElement.fmMoney(cityMoneySum);
			if(cityMoneySum != undefined && $yt_baseElement.rmoney(cityMoneySum) >0){
			  $("#subsidy-list-info tbody .city-money-td").text(cityMoneySum);
			}else{
			  $("#subsidy-list-info tbody .city-money-td").text("0.00");
			}
		}
		//调用刷新申请总预算金额的方法
		serveExamine.updateApplyMeonySum();
	},
	/**
	 * 
	 * 刷新申请预算总金额方法
	 * 
	 */
	updateApplyMeonySum:function(){
		var  sumMoney = 0 ;
		$(".cost-list-model table .money-sum").each(function(i,n){
			sumMoney += $yt_baseElement.rmoney($(n).text());
		});
		$(".cost-list-model table .city-money-td").each(function(i,n){
			sumMoney += $yt_baseElement.rmoney($(n).text());
		});
		 sumMoney =  $yt_baseElement.fmMoney(sumMoney);
		$("#applySumMoney").text(sumMoney);
		//判断当前页面是否包含报销申请页面中,补领金额中的报销金额
		if($("body").find("#reimPrice")){
		    $("#reimPrice").text(sumMoney);
		    //计算补领金额
		    var loanPrice = $("#loanCost").text();
		    var replPrice = $yt_baseElement.rmoney(sumMoney) - parseFloat(loanPrice);
		    replPrice = $yt_baseElement.fmMoney(replPrice);
		    $("#givePrice").text(replPrice);
		}
		if(sumMoney !=null && sumMoney !=undefined && $yt_baseElement.rmoney(sumMoney) > 0){
			var sumMoneyLower = arabiaToChinese(sumMoney);
		    $("#applyMoneyLower").text(sumMoneyLower);
		}else{
			$("#applySumMoney").text("0.00");
		}
	},
	/**
	 * 加载区域的页面操作代码
	 * @param {Object} url      页面路径
	 */
	loadingWord: function(url) {
		//判断传输的url路径
		if(url.indexOf("http://") != 0) {
			url = $yt_option.websit_path + url;
		}
		serveExamine.request_params = new Object();
		//截取url路径
		if(url.indexOf("?") != -1) {
			var str = url.substr(url.indexOf("?") + 1);
			strs = str.split("&");
			for(var i = 0; i < strs.length; i++) {
				serveExamine.request_params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
			}
		} else {
			serveExamine.request_params = null;
		}
		$("#indexMainDiv").html("");
		//走ajax加载页面
		$.ajax({
			type: "get",
			url: url,
			async: false,
			data:{
				"CASPARAMS":"OFF_INDEX"
			},
			success: function(data) {
				$("#indexMainDiv").html(data);
				//替换页面图片地址问题
				$("body img").each(function(){
					$(this).attr("src",$(this).attr("src").replace("../../../../../","../"));
				});
				//替换资源文件路径
				$("body link").each(function(){
					$(this).attr("href",$(this).attr("href").replace("../../../../../","../"));
				});
				$("body script").each(function(){
					$(this).attr("src",$(this).attr("src").replace("../../../../../","../"));
				});
			}
		});
	},
	GetQueryString:function(name){
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = window.location.search.substr(1).match(reg);
	     if(r!=null)return  unescape(r[2]); return null;
	}
	};

	$(function() {
		serveExamine.init();
		serveExamine.clearexamine();
	});
})(jQuery, window);
/**
 *金额转换成中文大写方法
 * @param {Object} Num 金额数字
 */
function arabiaToChinese(Num) {
	Num = Num+"";
	for(i = Num.length - 1; i >= 0; i--) {
		Num = Num.replace(",", "") //替换tomoney()中的“,”
		Num = Num.replace(" ", "") //替换tomoney()中的空格
	}
	Num = Num.replace("￥", "") //替换掉可能出现的￥字符
	if(isNaN(Num)) { //验证输入的字符是否为数字
		$yt_alert_Model.prompt("请检查小写金额是否正确", 2000);  
		return;
	}
	//---字符处理完毕，开始转换，转换采用前后两部分分别转换---//
	part = String(Num).split(".");
	newchar = "";
	//小数点前进行转化
	for(i = part[0].length - 1; i >= 0; i--) {
		if(part[0].length > 10) { $yt_alert_Model.prompt("位数过大，无法计算", 2000); return ""; } //若数量超过拾亿单位，提示
		tmpnewchar = ""
		perchar = part[0].charAt(i);
		switch(perchar) {
			case "0":
				tmpnewchar = "零" + tmpnewchar;
				break;
			case "1":
				tmpnewchar = "壹" + tmpnewchar;
				break;
			case "2":
				tmpnewchar = "贰" + tmpnewchar;
				break;
			case "3":
				tmpnewchar = "叁" + tmpnewchar;
				break;
			case "4":
				tmpnewchar = "肆" + tmpnewchar;
				break;
			case "5":
				tmpnewchar = "伍" + tmpnewchar;
				break;
			case "6":
				tmpnewchar = "陆" + tmpnewchar;
				break;
			case "7":
				tmpnewchar = "柒" + tmpnewchar;
				break;
			case "8":
				tmpnewchar = "捌" + tmpnewchar;
				break;
			case "9":
				tmpnewchar = "玖" + tmpnewchar;
				break;
		}
		switch(part[0].length - i - 1) {
			case 0:
				tmpnewchar = tmpnewchar + "元";
				break;
			case 1:
				if(perchar != 0) tmpnewchar = tmpnewchar + "拾";
				break;
			case 2:
				if(perchar != 0) tmpnewchar = tmpnewchar + "佰";
				break;
			case 3:
				if(perchar != 0) tmpnewchar = tmpnewchar + "仟";
				break;
			case 4:
				tmpnewchar = tmpnewchar + "万";
				break;
			case 5:
				if(perchar != 0) tmpnewchar = tmpnewchar + "拾";
				break;
			case 6:
				if(perchar != 0) tmpnewchar = tmpnewchar + "佰";
				break;
			case 7:
				if(perchar != 0) tmpnewchar = tmpnewchar + "仟";
				break;
			case 8:
				tmpnewchar = tmpnewchar + "亿";
				break;
			case 9:
				tmpnewchar = tmpnewchar + "拾";
				break;
		}
		newchar = tmpnewchar + newchar;
	}
	//小数点之后进行转化
	if(Num.indexOf(".") != -1) {
		if(part[1].length > 2) {
			$yt_alert_Model.prompt("小数点之后只能保留两位,系统将自动截段", 2000);  
			part[1] = part[1].substr(0, 2)
		}
		for(i = 0; i < part[1].length; i++) {
			tmpnewchar = ""
			perchar = part[1].charAt(i)
			switch(perchar) {
				case "0":
					tmpnewchar = "零" + tmpnewchar;
					break;
				case "1":
					tmpnewchar = "壹" + tmpnewchar;
					break;
				case "2":
					tmpnewchar = "贰" + tmpnewchar;
					break;
				case "3":
					tmpnewchar = "叁" + tmpnewchar;
					break;
				case "4":
					tmpnewchar = "肆" + tmpnewchar;
					break;
				case "5":
					tmpnewchar = "伍" + tmpnewchar;
					break;
				case "6":
					tmpnewchar = "陆" + tmpnewchar;
					break;
				case "7":
					tmpnewchar = "柒" + tmpnewchar;
					break;
				case "8":
					tmpnewchar = "捌" + tmpnewchar;
					break;
				case "9":
					tmpnewchar = "玖" + tmpnewchar;
					break;
			}
			if(i == 0) tmpnewchar = tmpnewchar + "角";
			if(i == 1) tmpnewchar = tmpnewchar + "分";
			newchar = newchar + tmpnewchar;
		}
	}
	//替换所有无用汉字
	while(newchar.search("零零") != -1)
		newchar = newchar.replace("零零", "零");
	newchar = newchar.replace("零亿", "亿");
	newchar = newchar.replace("亿万", "亿");
	newchar = newchar.replace("零万", "万");
	newchar = newchar.replace("零元", "元");
	newchar = newchar.replace("零角", "");
	newchar = newchar.replace("零分", "");
	if(newchar.charAt(newchar.length - 1) == "元" || newchar.charAt(newchar.length - 1) == "角")
		newchar = newchar + "整";
		//处理如果是无内容的给出--
		if(newchar == "元整"){
			newchar = "--";
		}
	//  document.write(newchar);
	return newchar;
};
$.fn.extend({
	showImg: function(obj) {
		var imgId = 'show-img-box' + (parseInt(Math.random() * 1000000000));
		var imgs = $(this);
		imgs.addClass(imgId);
		imgs.off().on("click", function() {
			var ulMl = $("#" + imgId).find("li").width() * imgs.index($(this)) * -1;
			if($("#" + imgId).length > 0) {
				$("#" + imgId).find("ul").css("margin-left", ulMl + "px");
				$("#" + imgId).show();
				$('#pop-modle-alert').show();
			} else {
				var wHeigth = $(window).height();
				var wWidth = $(window).width();
				if(wWidth / wHeigth > 20 / 13) {
					wWidth = Math.floor(wHeigth * 20 / 13 - 200);
				} else {
					wWidth = wWidth - 100;
				}
				var bannerWidth = Math.floor(wWidth * 0.8);
				var hannerHeight = Math.floor(bannerWidth * 13 / 20);

				var imgsElement = $('<div id="' + imgId + '" class="show-img-box"><a class="prev"></a><a class="next"></a></div>');

				$("body").append(imgsElement);

				var closeElement = $('<a class="close-btn" src="img/icons/atta-x.png"></a>');
				var imgBox = $('<div class="imgs-list"></div>');
				imgBox.css({
					width: bannerWidth,
					height: hannerHeight
				});
				closeElement.click(function() {
					$("#" + imgId).hide();
					$('#pop-modle-alert').hide();
				});
				imgsElement.append(closeElement).append(imgBox);
				var imgListEle = $('<ul style="width: ' + ($("." + imgId).length * bannerWidth) + 'px;"></ul>');
				imgListEle.css("margin-left", ulMl + "px");
				$("." + imgId).each(function() {
					var img = new Image();
					var imgLi = $('<li></li>').append(img);
					imgLi.css({
						width: bannerWidth,
						height: hannerHeight
					});
					//img.style='width:'+bannerWidth+'px;';
					img.draggable = false;
					img.src = $(this).attr('src');
					img.name = 'viewImg';
					var meImg = imgLi.find("img");
					img.onload = function() {
						if(img.width / img.height > 20 / 13) {
							$(meImg).css("width", "100%");
						} else {
							$(meImg).css("height", "100%");
						}
					};
					imgListEle.append(imgLi);
				});
				imgBox.append(imgListEle);
				ulMl = imgsElement.find("li").width() * imgs.index($(this)) * -1;
				imgsElement.find("ul").css("margin-left", ulMl + "px");
				imgsElement.find(".next").click(function() {
					$(this).siblings(".imgs-list").find("ul").stop(true, true);
					var bannerWidth = $(this).siblings(".imgs-list").find("li").width();
					var bannerUlWidth = $(this).siblings(".imgs-list").find("ul").width();
					var ulLeft = $(this).siblings(".imgs-list").find("ul").css("margin-left");
					var nextUlLeft = parseInt(ulLeft.replace("px", "").replace("PX", "")) - bannerWidth;

					if(nextUlLeft > bannerUlWidth * -1) {
						$(this).siblings(".imgs-list").find("ul").animate({
							marginLeft: nextUlLeft
						}, 500, function() {/*
							$("#" + imgId).find("li img").css({
								'width': 'auto',
								'height': 'auto',
								'left': 0,
								'right': 0,
								'top': 0,
								'bottom': 0
							});

						*/});
						/*	$(".banner-main .tb-btn a.active").next().addClass("active");
							$(".banner-main .tb-btn a.active:eq(0)").removeClass("active");*/
					}

				});
				imgsElement.find(".prev").click(function() {
					$(this).siblings(".imgs-list").find("ul").stop(true, true);
					var bannerWidth = $(this).siblings(".imgs-list").find("li").width();
					var ulLeft = $(this).siblings(".imgs-list").find("ul").css("margin-left");

					var nextUlLeft = parseInt(ulLeft.replace("px", "").replace("PX", "")) + bannerWidth;
					console.log(nextUlLeft);
					if(nextUlLeft <= 10) {
						$(this).siblings(".imgs-list").find("ul").animate({
							marginLeft: nextUlLeft
						}, 500, function() {/*
							$("#" + imgId).find("li img").css({
								'width': 'auto',
								'height': 'auto',
								'left': 0,
								'right': 0,
								'top': 0,
								'bottom': 0
							});

						*/});
						/*$(".banner-main .tb-btn a.active").prev().addClass("active");
						$(".banner-main .tb-btn a.active:eq(1)").removeClass("active");*/
					}
				});
				imgsElement.show();
				$('#pop-modle-alert').show();
			}
			//$("#" + imgId).find("li img").zoomMarker();
		});
	}
});
