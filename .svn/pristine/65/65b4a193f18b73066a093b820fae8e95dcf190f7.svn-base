var InvoicePasting = {
	init: function() {
		var appId = $yt_common.GetQueryString('loanId');
		InvoicePasting.events();
		InvoicePasting.downloadFileAppId(appId);
		InvoicePasting.printInvoicePastingByExpenditureAppId(appId);
		//扫码打印功能
		$("input.code-inpu").startListen({
			letter: true,
			check: false,
			show: function(code) {
				if(code != "" && code && code != undefined && code != null) {
					var subStr = code.substring(0, 7);
					//截取开头是不是http://开头
					if(subStr == "http://") {
						window.open(code);
					} else {
						$yt_alert_Model.prompt("二维码识别不成功,请联系管理员!");
					}
				} else {
					$yt_alert_Model.prompt("二维码识别不成功,请联系管理员!");
				}
			}
		});
	},
	events: function() {
		/*打印按钮操作事件*/
		$("#printBtn").off().on("click", function() {
			//调用执行打印的方法
			InvoicePasting.doPrint();
		});
		/* 关闭按钮*/
		$("#closeBtn").off().on("click", function() {
			if(window.top == window.self){//不存在父页面
  				window.close();
			 }else{
			 	parent.closeWindow();
			}
		});
		if($('.bill-cause').innerHeight() > 50) {
			$('.bill-cause').css('padding', '0px');
		};
		if($('.bill-cause').innerHeight() > 55) {
			$('.bill-cause').css('font-size', '12px');
		}
	},
	//普通单据
	printInvoicePastingByExpenditureAppId: function(loanId) {
		$.ajax({
			type: "post",
			url: "sz/loanApp/printLoanAppInfoDetailByLoanAppId",
			async: true,
			data: {
				loanAppId: loanId
			},
			success: function(data) {
				var datas = data.data;
				if(data.flag == 0) {
					InvoicePasting.printInvoice(datas);
				}
			}
		});
	},
	//2.2.4.4(文件路径)生成二维码 
	downloadFileAppId: function(loanId) {
		var imgSrc = '';
		$.ajax({
			type: "post",
			url: "fileUpDownload/createQrCode",
			async: true,
			data: {
				context: $yt_option.websit_path + 'barCode/expDetail.html?appId=' + loanId
			},
			success: function(data) {
				imgSrc = data.data;
				$('.qr-code').attr('src', $yt_option.base_path + 'fileUpDownload/downloadFile?storePath=' + imgSrc + '&isDownload=false');
			}
		});
	},
	//	//2.2.4.3(文件路径)下载文件/查看图片
	//	downloadFile : function(imgSrc) {
	//		
	//		
	//		
	//	},
	//通用
	printInvoice: function(data) {
		var me = this;
		//支出事由
		$(".bill-cause").text(data.expenditureAppName);
		//申请人
		$(".apply-user").text(data.applicantUserName);
		//申请部门
		$(".apply-department").text(data.applicantUserDeptName);
		//职务
		$(".post-apply").text(data.applicantUserJobLevelName);
		//电话
		$(".apply-phone").text(data.applicantUserPhone);
		//费用明细第一行
		$("#costTypeName").text(data.costTypeName);
		//费用明细第二行
		$("#specialName").text(data.specialName);
		//人民币大写
		//		$(".paymen-amount-chinese").text(arabiaToChinese(data.totalAmount));
		//金额
		$(".pay-money").text('￥' + $yt_baseElement.fmMoney(data.expTotalAmount));
		//总金额
		$(".normal-total-amount").text('￥' + $yt_baseElement.fmMoney(data.totalAmount));
		//年
		$(".year").text(data.printYear);
		//月
		$(".month").text(data.printMonth);
		//日
		$(".day").text(data.printDay);
		$("#expenditureAppNum").text(data.loanAppNum);
		//收款方明細
		me.setExpReceivablesListList(data.expReceivablesList);
		me.setRecordOfApprovalListList(data.recordOfApprovalList);
		//通过costType判断执行那个加载列表方法
		if(data.costType == 'NORMAL_APPLY'){
			me.setNormalDetailsListList(data.normalDetailsList);
		}else{
			me.setcostSpecialDetailsList(data.costSpecialDetailsList);
		}
		//薪酬税费
		if(data.costType == 'ACCRUED_TAX'){
			$(".normal-total-amount").text('￥' + $yt_baseElement.fmMoney(data.deductBudgetAmount));
		}
	},
	setTravelCostList: function(list) {
		var thisTr = $(".travel-detailed-first-tr");
		var listLen = $(list).length;
		//遍历差旅费表格行排除前4行的标题行,遍历差旅费列表信息
		$(".travel-detailed-table tr:gt(3)").each(function(i,t){
			if(list[i]){
				$(t).find(".start-place").text(list[i].goAddressName);//出发地
				$(t).find(".end-place").text(list[i].arrivalAddressName);//到达地
				$(t).find(".travel-num").text(list[i].personNum);//出差人数
				$(t).find(".traffic-money").text($yt_baseElement.fmMoney(list[i].crafare));//金额
			}
		});
		//清除第一行数据以后的补助金
		$(".travel-detailed-table .subsidy-money:gt(0)").text("");
	},
	setTravelInfoList: function(list) {
		var html = '';
		var total = 0;
		$.each(list, function(i, n) {
			html += '<div><span class="startTime" style="margin-right: 15px;">' + n.startTime + '</span>至' +
				'<span style="margin-left: 15px;margin-right: 20px;" class="endTime">' + n.endTime + '</span>' +
				'出差地点：<span style="margin-right: 20px;" class="travelAddressName">' + n.travelAddressName + '</span>' +
				'出差人：<span class="travelPersonnelsName">' + n.travelPersonnelsName + '</span></div>';
		});
		$('.travel-detailed-td').html(html);
	},
	setTeachersLectureList: function(list) {
		var html = '';
		var total = 0;
		var beforAmount = 0;
		var afterAmount = 0;
		$.each(list, function(i, n) {
			html += '<tr>' +
				'<td style="text-align: center;">' + n.teacherName + '</td>' +
				'<td style="text-align: right;">' + $yt_baseElement.fmMoney(n.beforAmount) + '</td>' +
				'<td style="text-align: right;">' + $yt_baseElement.fmMoney(n.afterAmount) + '</td>' +
				'<td style="text-align: right;">' + $yt_baseElement.fmMoney(n.hotelAmount) + '</td>' +
				'<td style="text-align: right;">' + $yt_baseElement.fmMoney(n.carfareAmount) + '</td>' +
				'<td style="text-align: right;">' + $yt_baseElement.fmMoney(n.foodAmount) + '</td>' +
				'</tr>';
			beforAmount+=n.beforAmount;
			afterAmount+=n.afterAmount;
		});
		//		var len = list.length + 16;
		//		$('.payment-detail-tby').attr("rowspan", len);
		//课酬费税金
		$("#teachersTax").text($yt_baseElement.fmMoney(beforAmount-afterAmount));
		$('.train-detailed-table tbody .train-all-money').before(html);
	},
	setTeachersOtherAmountList: function(list) {
		var html = '';
		var total = 0;
		var bemoney = 0;
		$.each(list, function(i, n) {
			html += '<tr>' +
				'<td colspan="2">' + n.name + '</td>' +
				'<td style="text-align: right;" colspan="2">' + $yt_baseElement.fmMoney(n.otherAmount) + '</td>' +
				'<td style="text-align: left;" colspan="2">' + (n.remark || "") + '</td>' +
				'</tr>';
			bemoney += n.otherAmount;
		});
		$('.train-other-money').text(bemoney ? $yt_baseElement.fmMoney(bemoney) : $yt_baseElement.fmMoney(0));
		$('.train-detailed-table tbody').append(html);
	},
	setExpReceivablesListList: function(list) {
		var html = '';
		var total = 0;
		$.each(list, function(i, n) {
			var receivablesContent ='';
			if(n.personalType == 0){
				if(n.isSettlement){
					receivablesContent = n.isSettlement == 1 ? '汇款' : '支票'
				}else{
					receivablesContent = '';
				}
			}else{
				receivablesContent = n.receivablesType;
			}
			html += '<tr>' +
				'<td class="receivablesName" style="text-align: left;">' + n.receivablesName + '</td>' +
				'<td class="receivablesType">' + receivablesContent + '</td>' +
				'<td class="amount" style="text-align: right;">' + $yt_baseElement.fmMoney(n.amount) + '</td>' +
				'<td class="openBank">' + n.openBank + '</td>' +
				'<td class="accounts">' + n.accounts + '</td>' +
				'<td class="isContract">' + (n.isContract == 1 ? '有' : '无') + '</td>' +
//				'<td class="isSettlement">' + (n.isSettlement == 1 ? '汇款' : '支票') + '</td>' +
				/*'<td class="" style="text-align:right;">' + $yt_baseElement.fmMoney(n.paidAmount) + '</td>' +*/
				'<td class="">' + n.remarks + '</td>' +
				'</tr>';
		});
		var len = list.length + 1;
		$('.receivables-detailed').attr("rowspan", len);
		$('.expenditure-receivables tbody').append(html);
	},
	setNormalDetailsListList: function(list) {
		var html = '';
		var total = 0;
		$.each(list, function(i, n) {
			html += '<tr>' +
				'<td class="normalName" style="text-align: left;">' + n.normalName + '</td>' +
				'<td class="amount" style="text-align: right;">' + $yt_baseElement.fmMoney(n.amount) + '</td>' +
				'<td class="remarks">' + n.remarks + '</td>' +
				'</tr>';
		});
		var len = list.length + 1;
		$('.cost-detailed').attr("rowspan", len);
		$('.cost-detailed-table tbody').append(html);
	},
	setcostSpecialDetailsList: function(list) {
		var html = '';
		var total = 0;
		$.each(list, function(i, n) {
			html += '<tr>' +
				'<td class="normalName" style="text-align: left;">' + n.specialName + '</td>' +
				'<td class="amount" style="text-align: right;">' + $yt_baseElement.fmMoney(n.specialAmount) + '</td>' +
				'<td class="remarks">' + n.remarks + '</td>' +
				'</tr>';
		});
		var len = list.length + 1;
		$('.cost-detailed').attr("rowspan", len);
		$('.cost-detailed-table tbody').append(html);
	},
	setRecordOfApprovalListList: function(list) {
		var html = '';
		var total = 0;
		var i = 0;
		$.each(list, function(i, n) {
			html += '<tr>' +
				'<td>' + (i + 1) + '</td>' +
				'<td style="text-align: left;"><span class="nodeName">【' + n.nodeName + '】</span>——<span class="nodeUserName">' + n.nodeUserName + '</span></td>' +
				'<td class="" style="text-align: left;padding-left: 15px;">';
			$.each(n.approvaInfoList, function(v, j) {
				html += '<div style="' + (v == n.approvaInfoList.length - 1 ? 'font-weight: bold;' : '') + '"><span class="approvaDate">' + j.approvaDate + '</span><span class="approvaState" style="padding-left: 10px;">' + j.approvaState + '</span>，意见：<span class="approvaRemarks">' + (j.approvaRemarks || '') + '</span></div>';
			});
			html += '</td></tr>';
		});
		var len = list.length + 1;
		$('.approval-record').attr("rowspan", len);
		$('.approval-record-table tbody').append(html);
	},
	/**
	 * 
	 * 执行打印操作
	 * 
	 */
	doPrint: function() {
		bdhtml = window.document.body.innerHTML; //获取当前页的html代码  
		startInvoicePasting = "<!--startInvoicePasting-->"; //设置打印开始区域   
		endInvoicePasting = "<!--endInvoicePasting-->"; //设置打印结束区域   
		prnhtml = bdhtml.substr(bdhtml.indexOf(startInvoicePasting)); //从开始代码向后取html   
		prnhtml = prnhtml.substring(0, prnhtml.indexOf(endInvoicePasting)); //从结束代码向前取html   
		window.document.body.innerHTML = prnhtml;
		window.focus();
		if(InvoicePasting.isIE()) {
			document.body.className += ' ext-ie';
			document.execCommand('print', false, null);
		} else {
			window.print();
		}
		window.document.body.innerHTML = bdhtml; //还原页面  
		window.location.reload();
	},
	isIE: function() {
		if(!!window.ActiveXObject || "ActiveXObject" in window)
			return true;
		else
			return false;
	}
}
$(function() {
	InvoicePasting.init();
})