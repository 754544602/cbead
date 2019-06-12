var adjustPrintObj = {
	getDataList: [],
	init: function() {
		var appId = $yt_common.GetQueryString('expenditureAppId');
		var costType = $yt_common.GetQueryString('costType');
		adjustPrintObj.events();
		//调用生成二维码方法
		adjustPrintObj.downloadFileAppId(appId);
		switch(costType) {
			case 'TRAIN_APPLY': //培训费
				//调用获取单据基本信息方法
				//				adjustPrintObj.printFormBaseInfo(appId);
				//调用获取培训费信息方法
				adjustPrintObj.getPrintTrainInfo(appId);
				break;
			case 'MEETING_APPLY':
				break;
			case 'BH_APPLY':
				break;
			case 'NORMAL_APPLY':
				break;
		};
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
			adjustPrintObj.doPrint();
		});
		/* 关闭按钮*/
		$("#closeBtn").off().on("click", function() {
			if(window.top == window.self) { //不存在父页面
				window.close();
			} else {
				parent.closeWindow();
			}
		});
		if($('.before-cause,.train-name').innerHeight() > 50) {
			$('.before-cause,.train-name').css('padding', '0px');
		};
		if($('.before-cause,.train-name').innerHeight() > 55) {
			$('.before-cause,.train-name').css('font-size', '12px');
		}
	},
	//单据公用信息
	printFormBaseInfo: function(expenditureAppId) {
		$.ajax({
			type: "post",
			url: "sz/expenditureApp/printSpendingFormDetailsByExpenditureAppId",
			async: true,
			data: {
				expenditureAppId: expenditureAppId
			},
			success: function(data) {
				var datas = data.data;
				if(data.flag == 0) {
					adjustPrintObj.printInvoice(datas);
				}
			}
		});
	},
	//培训费单据
	getPrintTrainInfo: function(advanceAppId) {
		$.ajax({
			type: "post",
			url: "sz/advanceAppUpdate/printTrainFormDetailsByAdvanceAppIdUpdate",
			async: true,
			data: {
				advanceAppId: advanceAppId
			},
			success: function(data) {
				var datas = data.data;
				if(data.flag == 0) {
					adjustPrintObj.getDataList = datas;
					adjustPrintObj.printInvoiceTrain(datas);
					var afterTaxAllMoney = '';
					$.each(datas.applicationFee.predictCostList, function(i, n) {
						afterTaxAllMoney += n.amount;
					});
					$(".surcharge").text($yt_baseElement.fmMoney(afterTaxAllMoney * 0.03 * 0.12));
					$(".added-tax-value").text($yt_baseElement.fmMoney(afterTaxAllMoney * 0.03));
				}
			}
		});
	},
	//2.2.4.4(文件路径)生成二维码 
	downloadFileAppId: function(expenditureAppId) {
		var imgSrc = '';
		$.ajax({
			type: "post",
			url: "fileUpDownload/createQrCode",
			async: true,
			data: {
				context: $yt_option.websit_path + 'barCode/adjustDetail.html?appId=' + expenditureAppId
			},
			success: function(data) {
				imgSrc = data.data;
				$('.qr-code').attr('src', $yt_option.base_path + 'fileUpDownload/downloadFile?storePath=' + imgSrc + '&isDownload=false');
			}
		});
	},
	//公务接待费
	printInvoiceBh: function(data) {
		var html = '';
		var total = 0;
		$('.recipients-number').text(data.receptionDetailsData.receptionTotalNum);
		var list = data.receptionDetailsData.receptionList;
		$.each(list, function(i, n) {
			html += '<tr>' +
				'<td>' + n.publicServiceProName + '</td>' +
				'<td>' + n.activityDate + '</td>' +
				'<td>' + n.costTypeName + '</td>' +
				'<td>' + $yt_baseElement.fmMoney(n.activityAmount) + '</td>' +
				'<td>' + n.peopleNum + '</td>' +
				'</tr>';
		});
		var len = list.length + 2;
		$('.expenditure-receivables-detailed').attr("rowspan", len);
		$('.reception-table tbody').append(html);
	},
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
		$("#expenditureAppNum").text(data.expenditureAppNum);
		//收款方明細
		me.setExpReceivablesListList(data.expReceivablesList);
		me.setNormalDetailsListList(data.normalDetailsList);
		me.setRecordOfApprovalListList(data.recordOfApprovalList);
	},
	//	培训
	printInvoiceTrain: function(data) {
		var me = this;
		//打印时间-年
		$(".year").text(data.printYear);
		//打印时间-月
		$(".month").text(data.printMonth);
		//打印时间-日
		$(".day").text(data.printDay);
		//事前申请单号
		$("#expenditureAppNum").text(data.advanceAppNum);
		//事前申请事由
		$(".before-cause").text(data.advanceAppName);
		//事前申请签批日期
		$(".apply-date").text(data.applicantTime);
		//申请人姓名
		$(".apply-users").text(data.applicantUserName);
		//申请人职务名称
		$(".users-job").text(data.applicantUserPositionName);
		//申请人所在部门
		$(".users-dept").text(data.applicantUserDeptName);
		//申请人手机号
		$(".users-tel").text(data.applicantUserPhone);
		//费用类型名称
		$(".cost-type").text(data.advanceCostTypeName);
		//申请支出总金额
		$(".apply-money").text($yt_baseElement.fmMoney(data.advanceAmount));
		//大写
		$(".apply-money-upper").text(arabiaToChinese(data.advanceAmount));
		//所属预算项目-项目名称
		$(".by-budget-prj").text(data.specialName + (data.prjName ? '-' + data.prjName : data.prjName));
		//部门预算余额
		$(".dept-money").text($yt_baseElement.fmMoney(data.deptBudgetBalanceAmount));
		//单位预算余额
		$(".unit-money").text($yt_baseElement.fmMoney(data.budgetBalanceAmount));

		//调整后事项信息
		//项目名称
		$(".prj-name").text(data.applicationMatters.regionDesignation);
		//培训地点
		$(".address-info").text(data.applicationMatters.regionName);
		$(".train-approva-num").text(data.applicationMatters.approvaNum);
		$(".train-charge-standard").text($yt_baseElement.fmMoney(data.applicationMatters.chargeStandard));
		//开始日期
		$(".start-date").text(data.applicationMatters.reportTime);
		//结束日期
		$(".end-date").text(data.applicationMatters.endTime);
		//培训人数/学员人数
		$(".stu-num").text(data.applicationMatters.trainOfNum);
		//员工数量/工作人员数量
		$(".work-num").text(data.applicationMatters.workerNum);

		//申请费用信息
		//预计支出情况
		$(".advance-amount").text($yt_baseElement.fmMoney(data.advanceAmount));
		//师资费支出小计
		$(".teachers-amount").text($yt_baseElement.fmMoney(data.applicationFee.teachersAmount));
		//培训费其他支出小计
		$(".train-other-amount").text($yt_baseElement.fmMoney(data.applicationFee.trainOtherAmount));
		//培训名称
		$(".train-name").text(data.applicationFee.regionDesignation);
		//支出合计
		$(".train-sum-money").text($yt_baseElement.fmMoney(data.advanceAmount));
		//其中，课酬相关税金
		//调整前金额
		$(".adj-before").text($yt_baseElement.fmMoney(data.taxChangeData.changeBeforeAmount));
		//调整后金额
		$(".adj-after").text($yt_baseElement.fmMoney(data.taxChangeData.changeAfterAmount));
		//调整金额
		$("#taxAmount").text($yt_baseElement.fmMoney(data.taxChangeData.changeAmount));

		me.setTeachersCostList(data.applicationFee.teachersCostList);
		me.setTrainOtherList(data.applicationFee.trainOtherList);
		me.setRecordOfApprovalListList(data.recordOfApprovalList);
		me.setChangeList(data.changeList);
		me.setPredictCostList(data.applicationFee.predictCostList);
	},
	/**
	 * 预计收入费用列表数据循环
	 * @param {Object} list
	 */
	setPredictCostList: function(list) {
		var me = this;
		var predictHtml = '';
		$.each(list, function(i, n) {
			predictHtml += '<td class="font-bold">预计收费情况</td>' +
				'<td>' + $yt_baseElement.fmMoney(n.predictStandardMoney) + '</td><td>' +
				n.predictPeopleNum + '</td><td></td><td style="text-align: right;" class="font-bold"><span>' +
				$yt_baseElement.fmMoney(n.amount) +
				'</span></td><td><div class="yt-table-br">收费标准*预计学员人数/(1+3%)</div></td>'
		});
		$('#teachersCostList tbody .predict-tr').before(predictHtml)
	},
	/**
	 * 调整概览列表数据循环
	 * @param {Object} list
	 */
	setChangeList: function(list) {
		var me = this;
		//培训费其他支出详情集合HTML文本
		var receHtml = '';
		var total = 0;
		$.each(list, function(i, n) {
			receHtml += '<tr>' +
				'<td>' + n.changeProject + '</td>' +
				'<td style="text-align: right;"><span>' + $yt_baseElement.fmMoney(n.changeBeforeAmount) + '</span></td>' +
				'<td style="text-align: right;"><span>' + $yt_baseElement.fmMoney(n.changeAfterAmount) + '</span></td>' +
				'<td style="text-align: right;"><span>' + $yt_baseElement.fmMoney(n.changeAmount) + '</span></td>' +
				'<td><div class="yt-table-br">' + n.changeReason + '</div></td>' +
				'</tr>';
			total += n.changeAmount;
		});
		var len = list.length + 3;
		$('.remunera-money').text(total ? $yt_baseElement.fmMoney(total) : $yt_baseElement.fmMoney(0));
		$('.adjustment-tby').attr("rowspan", len);
		//替换代码
		$('.adjustment-table tbody .last').before(receHtml);
	},
	/**
	 * 师资费支出详情列表数据循环
	 * @param {Object} list
	 */
	setTeachersCostList: function(list) {
		var me = this;
		//师资费支出详情集合HTML文本
		var receHtml = '';
		$.each(list, function(i, n) {
			var amount = '0.00';
			if(n.amount) {
				amount = $yt_baseElement.fmMoney(n.amount);
			}
			receHtml += '<tr class="small-td">' +
				'<td>' + n.costTypeName + '</td>' +
				'<td></td><td></td><td></td>' +
				'<td style="text-align: right;"><span>' + amount + '</span></td><td></td>' +
				'</tr>';
		});
		//替换代码
		$('#teachersCostList tbody .train-other-tr').before(receHtml);
	},
	/**
	 * 培训费其他支出详情列表数据循环
	 * @param {Object} list
	 */
	setTrainOtherList: function(list) {
		var me = this;
		//培训费其他支出详情集合HTML文本
		var receHtml = '';
		$.each(list, function(i, n) {
			var standard = '';
			var trainOfNum = '';
			var trainDays = '';
			var amount = '0.00';
			if(n.standard != '0.00') {
				standard = $yt_baseElement.fmMoney(n.standard);
			}
			if(n.trainOfNum != '0') {
				trainOfNum = n.trainOfNum;
			}
			if(n.trainDays != '0') {
				trainDays = n.trainDays;
			}
			if(n.amount != '0.00') {
				amount = $yt_baseElement.fmMoney(n.amount);
			}
			receHtml += '<tr class="small-td">' +
				'<td>' + n.costTypeName + '</td>' +
				'<td style="text-align: right;"><span>' + standard + '</span></td>' +
				'<td>' + trainOfNum + '</td>' +
				'<td>' + trainDays + '</td>' +
				'<td style="text-align: right;"><span>' + amount + '</span></td>' +
				'<td style="text-align: left;">' + n.remark + '</td>' +
				'</tr>';
		});
		receHtml += '<tr>' +
			'<td class="font-bold">' + '应缴附加费' + '</td>' +
			'<td style="text-align: right;"><span>' + '12%' + '</span></td>' +
			'<td>' + '</td>' +
			'<td>' + '</td>' +
			'<td style="text-align: right;" class="font-bold"><span class="surcharge">' + $yt_baseElement.fmMoney(adjustPrintObj.incomeTotal * 0.03 * 0.12) + '</span></td>' +
			'<td style="text-align: left;"></td>' +
			'</tr>';
		var len = 0;
		var rowspan = +$('.detail-tby').attr("rowspan");
		if(adjustPrintObj.getDataList.applicationFee.hasOwnProperty('predictCostList') && adjustPrintObj.getDataList.applicationFee.predictCostList.length > 0) {
			len = list.length + rowspan + 1;
		} else {
			len = list.length + rowspan;
		}
		$('.detail-tby').attr("rowspan", len);
		$('#teachersCostList tbody .added-tax-value').text($yt_baseElement.fmMoney(adjustPrintObj.incomeTotal * 0.03));
		//替换代码
		$('#teachersCostList tbody .train-sum-tr').before(receHtml);
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
				html += '<div style="' + (v == n.approvaInfoList.length - 1 ? 'font-weight: bold;' : '') + '"><span class="approvaDate">' + j.approvaDate + '</span><span class="approvaState" style="padding-left: 10px;">' + j.approvaState + '</span>，意见：<span class="approvaRemarks">' + (j.approvaRemarks || '无') + '</span></div>';
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
		if(adjustPrintObj.isIE()) {
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
	adjustPrintObj.init();
})