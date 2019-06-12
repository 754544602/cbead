var costDetail={
	//初始化方法
	init:function(){
		//初始化表格金额总数
		costDetail.paymentTotal();
		//初始化金额
		var reimAmount = $(".reimAmount").text();
		if(reimAmount != '') {
			$(".reimAmount").text($yt_baseElement.fmMoney(reimAmount));
		} else {
			$(".reimAmount").text('0.00');
		};
		
		var reimAmountlSum = $("#reimAmountlSum").text();
		if(reimAmountlSum != '') {
			$("#reimAmountlSum").text($yt_baseElement.fmMoney(reimAmountlSum));
		} else {
			$("#reimAmountlSum").text('0.00');
		};
	
		/** 
		 * 金额文本框获取焦点事件 
		 */
		$("#reimAmount").on("focus", function() {
			if($(this).val() != "") {
				//调用还原格式化的方法  
				$(this).val($yt_baseElement.rmoney($(this).val()));
			}
		});
		/** 
		 * 金额文本框失去焦点事件 
		 */
		$("#reimAmount").on("blur", function() {
			if($(this).val() != "") {
				//调用格式化金额方法  
				$(this).val($yt_baseElement.fmMoney($(this).val()));
			}
		});
		costDetail.event();
	},
	
	//点击事件绑定
	event:function(){
		//为修改图片绑定事件
		$("#costList").on("click",".operate-update",function(){
			var thisObj=$(this);
			var reimContent=thisObj.parents('tr').find('.reimContent').text();
			var reimAmount=thisObj.parents('tr').find('.reimAmount').text();
			var reimInstructions=thisObj.parents('tr').find('.reimInstructions').text();
			costDetail.showAlert(thisObj);
			$("#reimContent").val(reimContent);
			$("#reimAmount").val(reimAmount);
			$("#instructions").val(reimInstructions == '无' ? '' : reimInstructions);
		});
		//为删除图片绑定事件
		$("#costList").on("click",".operate-del",function(){
			var thisObj=$(this);
			//带按钮,不带有图标的提示框 
	        $yt_alert_Model.alertOne({  
	            /*haveAlertIcon:false,//是否带有提示图标 
	            haveCloseIcon:false,//是否带有关闭图标 
	            iconUrl:"",//提示图标路径 
	            closeIconUrl:"",//关闭图标路径 
	            leftBtnName:"确定",//左侧按钮名称,默认确定 
	            rightBtnName:"取消",//右侧按钮名称,默认取消 
	            cancelFunction:"",//取消按钮操作方法*/  
	            alertMsg: "数据删除将无法恢复,确认删除吗?", //提示信息  
	            confirmFunction: function() { //点击确定按钮执行方法 
					thisObj.parents("tr").remove();
					costDetail.paymentTotal();
	            }
	        });
		});
	},
	//行修改方法
	//	operateUpdate:function(thisObj){
	//		var a=thisObj.parents('tr').find('td').eq(0).text();
	//		var b=thisObj.parents('tr').find('td').eq(1).text();
	//	},
	//带有顶部标题栏的弹出框	
	showAlert:function(thisObj){
		if(thisObj!=null){
			$(".save-btn").show();
			$(".sure-btn").hide();
		}else{
			$(".save-btn").hide();
			$(".sure-btn").show();
		}
		costDetail.clearCPMInfo();
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$(".yt-edit-alert,#heard-nav-bak").show();
		/** 
		 * 调用算取div显示位置方法 
		 */
		$yt_alert_Model.getDivPosition($(".yt-edit-alert"));
		/* 
		 * 调用支持拖拽的方法 
		 */
		//$yt_model_drag.modelDragEvent($(".yt-edit-alert .yt-edit-alert-title"));  
		//点击加入列表方法
		$(".sure-btn").off().on("click", function() {
			/*调用验证方法 */
			var isTrue = $yt_valid.validForm($(".valid-tab"));
			if(isTrue) {
//				//隐藏页面中自定义的表单内容  
//				$(".yt-edit-alert,#heard-nav-bak").hide();
//				//隐藏蒙层  
//				$("#pop-modle-alert").hide();
				$yt_alert_Model.prompt("填写的信息已成功加入到列表");  
				
				//报销内容
				var reimContent=$("#reimContent").val();
				//报销金额
				var reimAmount=$("#reimAmount").val();
				//特殊说明
				var instructions=$("#instructions").val();
				instructions = instructions || '无';
				//追加一行数据
				var trHtml=' <tr class="yt-tab-row">'
							+' <td style="text-align:left;" class="reimContent">'+reimContent+'</td>'
							+' <td style="text-align:right;" class="reimAmount">'+reimAmount+'</td>'
							+' <td class="reimInstructions">'+ instructions +'</td>'
							+' <td>'
							+' <span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>'
							+' <span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>'
							+' </td>'
							+' </tr>';
				$("#costList tbody .last").before(trHtml);
				costDetail.paymentTotal();
				costDetail.clearCPMInfo();
			};
		});
		//点击保存方法
		$(".save-btn").off().on("click", function() {
			/*调用验证方法 */
			var isTrue = $yt_valid.validForm($(".valid-tab"));
			if(isTrue) {
				//隐藏页面中自定义的表单内容  
				$(".yt-edit-alert,#heard-nav-bak").hide();
				//隐藏蒙层  
				$("#pop-modle-alert").hide();
				//报销内容
				var reimContent=$("#reimContent").val();
				//报销金额
				var reimAmount=$("#reimAmount").val();
				//特殊说明
				var instructions=$("#instructions").val();
				thisObj.parents('tr').find('td').eq(0).text(reimContent);
				thisObj.parents('tr').find('td').eq(1).text(reimAmount);
				thisObj.parents('tr').find('td').eq(2).text(instructions || '无');
				costDetail.paymentTotal();
				costDetail.clearCPMInfo();
			}
		});
		/** 
		 * 点击取消方法 
		 */
		$('.yt-edit-alert .yt-eidt-model-bottom .yt-cancel-btn').off().on("click", function() {
			costDetail.clearCPMInfo();
			//隐藏页面中自定义的表单内容  
			$(".yt-edit-alert,#heard-nav-bak").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
			
			
		});
	},
	//清空弹窗方法
	clearCPMInfo:function(){
		$("#reimContent").val('').removeClass("valid-hint");
		$("#reimAmount").val('').removeClass("valid-hint");
		$(".cost-popm .valid-font").text('');
		$("#instructions").val('');
	},
//	//计算总额方法
//	smountCalculate:function(){
//		var smount=$(".reimAmount");
//		var sum=0;
//		for (var i = 0; i < smount.length; i++){
//			sum += parseInt($yt_baseElement.rmoney(smount.eq(i).text()));
//		};
//		$("#reimAmountlSum").text(sum);
//		var reimAmountlSum = $("#reimAmountlSum").text();
//		if(reimAmountlSum != '') {
//			$("#reimAmountlSum").text($yt_baseElement.fmMoney(reimAmountlSum));
//		} else {
//			$("#reimAmountlSum").text('0.00');
//		};
//	},
	dataAttrList:function(){
		var list = [];
		var tr = null;
		var  trs = $('#costList tbody tr:not(.last)');;
		$.each(trs, function(i,n) {
			//单个tr
			tr = $(n);
			list.push({
				normalId: tr.find('').text(),
				normalName: tr.find('.reimContent').text(),
				normalInstructions:tr.find('.reimInstructions').text(),
				normalAmount: $yt_baseElement.rmoney(tr.find(".reimAmount").text()),
			});
		});
		
		
		return list;
	},
	textbtn:function(){
		$(".text").off().on("click", function() {
			console.log(costDetail.dataAttrList());
		});
	},
	//付款明细合计
	paymentTotal: function() {
		//获取所有的金额
		var tds = $('#costList tbody .reimAmount');
		var total = 0;
		//计算合计金额
		$.each(tds, function(i, n) {
			total += $yt_baseElement.rmoney($(n).text());
		});
		var fmTotal = $yt_baseElement.fmMoney(total);
		//申请付款总额
		$('#applyTotalMoney,.count-val-num,#amountTotalMoney').text(fmTotal);
		//大写转换
		$('#TotalMoneyUpper,.total-money-up').text(arabiaToChinese(total + ''));
		//赋值合计金额
		$('#costList tbody #reimAmountlSum').text(fmTotal);
		//借款金额
		var loanAmount = $('#loanAmount').text();
		loanAmount = loanAmount == '--' ? 0 :　$yt_baseElement.rmoney(loanAmount);
		//获取借款单可用余额
		var outstandingBalance = $yt_baseElement.rmoney($('#outstandingBalance').text());
		//冲销金额：只读信息，读取逻辑：如果报销金额小于借款单可用余额，则读取报销总额；如果报销金额大于等于借款单可用余额，则读取借款单可用余额
		var writeOffAmount = total >= outstandingBalance ? outstandingBalance : total;
		$('#writeOffAmount,#outWriteAmount').text($yt_baseElement.fmMoney(writeOffAmount));
		// 补领金额：计算项，计算逻辑：如果报销金额小于借款单可用余额，则为0.00；如果报销金额大于等于借款单可用余额，则报销金额-冲销金额的金额值
		var replaceMoney = total >= outstandingBalance ? total - writeOffAmount : '0';
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
}




$(function() {
	//调用初始化方法
	costDetail.init();
	costDetail.textbtn();
});