var ordinaryPaymentApply = {
	
	/**
	 * 新增付款隐藏弹窗
	 */
	addListEvent: function() {
		
		var me = this;
		//新增按钮
		$('#addOrdinaryPayment').click(function() {
			//显示弹框
			me.showGeneralAlert();
			//重置按钮
			$('.ordinary-payment .general-common').off().on('click', function() {
				
				me.appendGeneralList();
				me.clearAlert($('.ordinary-payment .general-alert'));
			}).text('添加到列表');
		});
		//取消
		$('.ordinary-payment .general-cancel').click(function() {
			//隐藏
			me.hideGeneralAlert();
			//清空
			me.clearAlert($('.ordinary-payment .general-alert'));
		});

		//编辑
		$('.ordinary-payment #paymentDetailedTable').on('click', '.operate-update', function() {
			var ithis = $(this);
			var tr = ithis.parents('tr');
			//数据回显
			//款项用途
			var cont = $('#MoneyUse').val(tr.find('.ordinar-name').text());
			//金额
			var sum = $('#addMoney').val(tr.find('.paydet-money').text());
			//显示弹框
			me.showGeneralAlert();
			//重置按钮
			$('.ordinary-payment .general-common').off().on('click', function() {
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
		$('.ordinary-payment .general-alert').hide();
		$('#pop-modle-alert').hide();
	},
	/**
	 * 新增修改付款明细弹窗
	 * @param {Object} tr
	 */
	appendGeneralList: function(tr) {
		var me = this;
		//款项用途
		var MoneyUse = $('.ordinary-payment .general-alert #MoneyUse').val();
		//金额
		var addMoney = $('.ordinary-payment .general-alert #addMoney').val();
		if($yt_valid.validForm($(".ordinary-payment .alert-div"))) {
			//转换格式
			var num = $yt_baseElement.rmoney(addMoney);
			var html = '<tr MoneyUse="' + MoneyUse + '" num="' + num + '"  class="">'+
			'<td class="ordinar-name" style="text-align: left;">' + MoneyUse +'</td>'+ 
			'<td class="paydet-money" style="text-align: right;">' + ($yt_baseElement.fmMoney(addMoney)) + '</td>'+
			'<td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>'+
			'<span class="operate-del" style=""><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>'+
			'</td></tr>';

			if(tr) {
				//已经存在的进行替换
				tr.replaceWith(html);
			} else {
				//追加
				$('#paymentDetailedTable tbody .pay-detail-tabel-total').before(html);
			}
			//计算合计
			ordinaryPaymentApply.paymentTotal();
			//隐藏弹框
			me.hideGeneralAlert();
			//清空表单
			me.clearAlert($('.ordinary-payment .general-alert'));

		} else {
			$yt_alert_Model.prompt('请填写完整数据');
		}

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
		valid.text('');
		inputs.val('');
		textbig.val('');
	},
	/**
	 * 显示新增付款明细弹出框
	 */
	showGeneralAlert: function() {
		//获取弹框对象
		var alert = $('.ordinary-payment .general-alert');
		//显示弹框及蒙层
		$yt_baseElement.showMongoliaLayer();
		$yt_alert_Model.getDivPosition(alert);
		$('#pop-modle-alert').show();
		alert.show();
	},
	//	金额格式化
	moneyFormat: function() {
		/** 
		 * 金额文本框获取焦点事件 
		 */
		$("#addMoney").on("focus", function() {
			if($(this).val() != "") {
				//调用还原格式化的方法  
				$(this).val($yt_baseElement.rmoney($(this).val()));
			}
		});
		/** 
		 * 金额文本框失去焦点事件 
		 */
		$("#addMoney").on("blur", function() {
			if($(this).val() != "") {
				//调用格式化金额方法  
				$(this).val($yt_baseElement.fmMoney($(this).val()));
			}
		});
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
		$('.count-val-num').text(fmTotal);
		//大写转换
		$('.total-money-up').text(arabiaToChinese(fmTotal + ''));
		//赋值合计金额
		$yt_baseElement.fmMoney($('#paymentDetailedTable tbody .total-money').text(fmTotal));
	},
	delPayment: function() {
		//删除付款明细
		$('.ordinary-payment #paymentDetailedTable').on('click', '.operate-del', function() {
			var ithis = $(this);
			var tr = ithis.parents('tr');
			$yt_alert_Model.alertOne({
				alertMsg: "数据删除将无法恢复,确认删除吗?", //提示信息  
				confirmFunction: function() { //点击确定按钮执行方法  
					tr.remove();
					ordinaryPaymentApply.paymentTotal();
				}
			});
			
		});
	},
	dataAttrList:function(){
		var list = [];
		var tr = null;
		var  trs = $('#paymentDetailedTable tbody tr:not(.pay-detail-tabel-total)');;
		$.each(trs, function(i,n) {
			//单个tr
			tr = $(n);
			list.push({
				normalId: '',
				normalName: tr.find(".ordinar-name").text(),
				normalAmount: $yt_baseElement.rmoney(tr.find(".payDet-money").text()),
			});
		});
		
		
		return list;
	},
	textbtn:function(){
		$(".text").off().on("click", function() {
			console.log(ordinaryPaymentApply.dataAttrList());
		});
	},
}
$(function(){
	ordinaryPaymentApply.addListEvent();
	ordinaryPaymentApply.moneyFormat();
	ordinaryPaymentApply.delPayment();
	ordinaryPaymentApply.textbtn();
})
