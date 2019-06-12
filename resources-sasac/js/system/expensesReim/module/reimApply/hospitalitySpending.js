var hospitalitySpending = {
	init: function() {
		var me = this;
		me.start();
		me.getDictInfoByTypeCode();
		me.events();
	},
	start: function() {

		$('#applyDate').calendar({
			speed: 0,
			nowData: false
		});
	},
	events: function() {
		var me = this;

		//金额文本框获取焦点事件 
		$('.business-div .money-input').on('focus', function() {
			var ts = $(this);
			if(ts.val() != "") {
				//调用还原格式化的方法  
				ts.val($yt_baseElement.rmoney(ts.val()));
			}
		});
		//金额文本框失去焦点事件 
		$('.business-div .money-input').on('blur', function() {
			var ts = $(this);
			if(ts.val() != '') {
				//调用格式化金额方法  
				ts.val($yt_baseElement.fmMoney(ts.val()));
			}
		});
		//金额文本框输入事件 
		$('.business-div .money-input').on('keyup', function() {
			var ts = $(this);
			if(ts.val() != '') {
				//调用格式化金额方法  
				ts.val(ts.val().replace(/[^\d.]/g, ''));
			}
		});

		me.msgListEvent();
		me.paymentListEvent();
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
		$('.msg-cancel,.msg-alert .closed-span').click(function() {
			//隐藏
			me.hideMsgAlert();
			//清空
			me.clearAlert($('.msg-alert'));
		});

		//列表内删除
		$('.msg-list').on('click', '.receive-del', function() {
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
		$('.msg-list').on('click', '.receive-update', function() {
			var ithis = $(this);
			var tr = ithis.parents('tr');
			//数据回显
			//姓名
			var nameVal = $('#nameVal').val(tr.attr('applyname'));
			//职务
			var dutyVal = $('#dutyVal').val(tr.attr('duties'));
			//单位
			var deptVal = $('#deptVal').val(tr.attr('unit'));
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

		var html = '<tr pkId="" class="" applyname="' + nameVal + '" duties="' + dutyVal + '" unit="' + deptVal + '">' +
			'<td><span class="num">1</span></td>' +
			'<td><span class="name-text">' + nameVal + '</span></td>' +
			'<td><span class="job-text">' + dutyVal + '</span></td>' +
			'<td><span class="unit-text">' + deptVal + '</span></td>' +
			'<td><span class="receive-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="receive-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
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
		$('#paymentCanelBtn,#createDetali .closed-span').on('click', function() {
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
		$('#amountTotalMoney,.count-val-num').text(fmTotal).attr('num', total);
		//大写转换
		$('#TotalMoneyUpper').text(arabiaToChinese(fmTotal + ''));
		//获取借款单可用余额
		var outstandingBalance = $yt_baseElement.rmoney($('#outstandingBalance').text());
		//冲销金额：只读信息，读取逻辑：如果报销金额小于借款单可用余额，则读取报销总额；如果报销金额大于等于借款单可用余额，则读取借款单可用余额
		var writeOffAmount = total >= outstandingBalance ? outstandingBalance : total;
		$('#writeOffAmount,#outWriteAmount').text($yt_baseElement.fmMoney(writeOffAmount));
		// 补领金额：计算项，计算逻辑：如果报销金额小于借款单可用余额，则为0.00；如果报销金额大于等于借款单可用余额，则报销金额-冲销金额的金额值
		var replaceMoney = total >= outstandingBalance ? total - writeOffAmount : 0;
		/*if(replaceMoney <= 0) {
			//补领金额是零的时候 ，补领方式 几个输入框禁用，默认值都是0.
			$('#officialCard,#cash,#cheque').val('0').attr('disabled', true);
			$('.amount-table .total').text('0');
		} else {
			$('#officialCard,#cash,#cheque').attr('disabled', false);
		}*/
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
		var outstandingBalance = $yt_baseElement.rmoney($('#outstandingBalance').text());
		//冲销金额：只读信息，读取逻辑：如果报销金额小于借款单可用余额，则读取报销总额；如果报销金额大于等于借款单可用余额，则读取借款单可用余额
		var writeOffAmount = total >= outstandingBalance ? outstandingBalance : total;
		$('#writeOffAmount,#outWriteAmount').text($yt_baseElement.fmMoney(writeOffAmount));
		// 补领金额：计算项，计算逻辑：如果报销金额小于借款单可用余额，则为0.00；如果报销金额大于等于借款单可用余额，则报销金额-冲销金额的金额值
		var replaceMoney = total >= outstandingBalance ? total - writeOffAmount : 0;
		/*if(replaceMoney <= 0) {
			//补领金额是零的时候 ，补领方式 几个输入框禁用，默认值都是0.
			$('#officialCard,#cash,#cheque').val('0').attr('disabled', true);
			$('.amount-table .total').text('0');
		} else {
			$('#officialCard,#cash,#cheque').attr('disabled', false);
		}*/
		$('#replaceMoney').text($yt_baseElement.fmMoney(replaceMoney));
		//报销后借款单余额：计算项，计算逻辑：如果报销金额小于借款单可用余额，则借款单可用余额-报销金额；如果报销金额大于风雨借款单可用余额；则显示为0.00
		$('#balanceMoney').text($yt_baseElement.fmMoney(total < outstandingBalance ? outstandingBalance - total : '0'));
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
			}
		});
	},
};

$(function() {
	hospitalitySpending.init();
});