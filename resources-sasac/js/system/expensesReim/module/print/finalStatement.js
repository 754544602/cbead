var printFormObj = {
	init : function() {
		var appId = $yt_common.GetQueryString('finalAppId');
		$(".applicantUser").val($yt_common.user_info.userName);
		printFormObj.events();
		printFormObj.downloadFileAppId(appId);
			printFormObj.printFormBaseInfo(appId);
			printFormObj.getPrintTrainInfo(appId);
			$(".meet-detailed-table-one").hide();
			$(".meet-detailed-table-two").hide();
			$("#teachersCostList").show();
			$("#teachersCostListFrist").show();
			$(".reception-table").hide();
			$(".reception-table-two").hide();
			$(".travel-detailed-table").hide();
			$(".bot-signature-model").show();
		;
		$("input.code-inpu").startListen({
			letter : true,
			check : false,
			show : function(code) {
				if (code != "" && code && code != undefined && code != null) {
					var subStr = code.substring(0, 7);
					if (subStr == "http://") {
						window.open(code)
					} else {
						$yt_alert_Model.prompt("二维码识别不成功,请联系管理员!")
					}
				} else {
					$yt_alert_Model.prompt("二维码识别不成功,请联系管理员!")
				}
			}
		})
	},
	events : function() {
		$("#printBtn").off().on("click", function() {
			printFormObj.doPrint()
		});
		//
		$("#closeBtn").off().on("click", function() {
			if (window != top) {
				parent.closeWindow()
			} else {
				window.close()
			}
		});
		if ($('.before-cause,.train-name').innerHeight() > 50) {
			$('.before-cause,.train-name').css('padding', '0px')
		}
		;
		if ($('.before-cause,.train-name').innerHeight() > 55) {
			$('.before-cause,.train-name').css('font-size', '12px')
		}
	},
	printFormBaseInfo : function(finalAppId) {
		$
				.ajax({
					type : "post",
					url : "sz/finalApp/printSpendingFormDetailsByFinalAppId",
					async : true,
					data : {
						finalAppId : finalAppId
					},
					success : function(data) {
						var datas = data.data;
						if (data.flag == 0) {
						}
					}
				})
	},
	getPrintTrainInfo : function(finalAppId) {
		$.ajax({
			type : "post",
			url : "sz/finalApp/printTrainFormDetailsByFinalAppId",
			async : true,
			data : {
				finalAppId : finalAppId
			},
			success : function(data) {
				var datas = data.data;
				if (data.flag == 0) {
					printFormObj.printInvoiceTrain(datas)
				}
			}
		})
	},
	downloadFileAppId : function(finalAppId) {
		var imgSrc = '';
		$.ajax({
			type : "post",
			url : "fileUpDownload/createQrCode",
			async : true,
			data : {
				context : $yt_option.websit_path
						+ 'barCode/beforDetail.html?appId=' + finalAppId
			},
			success : function(data) {
				imgSrc = data.data;
				$('.qr-code').attr(
						'src',
						$yt_option.base_path
								+ 'fileUpDownload/downloadFile?storePath='
								+ imgSrc + '&isDownload=false')
			}
		})
	},
	printInvoiceTrain : function(data) {
		var me = this;
		$(".year").text(data.printYear);
		$(".month").text(data.printMonth);
		$(".day").text(data.printDay);
		$("#finalAppNum").text(data.finalAppNum);
		$(".before-cause").text(data.finalAppReason);
		$(".apply-users").text(data.applicantUserName);
		$(".users-job").text(data.applicantUserPositionName);
		$(".users-dept").text(data.applicantUserDeptName);
		$(".users-tel").text(data.applicantUserPhone);
		$(".cost-type").text(data.costTypeName);
		$(".apply-money").text($yt_baseElement.fmMoney(data.expenditureTotal));
		$(".apply-money-upper").text(arabiaToChinese(data.expenditureTotal));
		$(".by-budget-prj").text(
				data.specialName
						+ (data.prjName ? '-' + data.prjName : data.prjName));
		$(".dept-money").text(
				$yt_baseElement.fmMoney(data.deptBudgetBalanceAmount));
		$(".unit-money")
				.text($yt_baseElement.fmMoney(data.budgetBalanceAmount));
		$(".train-name").text(data.applicationMatters.regionName);
		$(".train-addres").text(data.applicationMatters.regionName);
		$(".train-approva-num").text(data.applicationMatters.approvaNum);
		$(".train-charge-standard").text($yt_baseElement.fmMoney(data.applicationMatters.chargeStandard));
		$(".train-start-time").text(data.applicationMatters.reportTime);
		$(".train-end-time").text(data.applicationMatters.endTime);
		$(".train-per-num").text(data.applicationMatters.trainOfNum);
		$(".train-work-num").text(data.applicationMatters.workerNum);
		$(".advance-amount").text($yt_baseElement.fmMoney(data.expenditureTotal));
		$(".teachers-amount").text(
				$yt_baseElement.fmMoney(data.applicationFee.teachersAmount));
		$(".train-other-amount").text(
				$yt_baseElement.fmMoney(data.applicationFee.trainOtherAmount));
		$(".train-sum-money").text($yt_baseElement.fmMoney(data.expenditureTotal));
		me.setPredictCostList(data.applicationFee.predictCostList);
		me.setTeachersCostList(data.applicationFee.teachersCostList);
		me.setTrainOtherList(data.applicationFee.trainOtherList);
		me.setRecordOfApprovalListList(data.recordOfApprovalList)
	},
	setPredictCostList : function(list) {
		var me = this;
		var predictHtml = '';
		$
				.each(
						list,
						function(i, n) {
							predictHtml += '<td class="font-bold">收入情况</td>'
								+'<td>'+n.predictStandardMoney+'</td><td>'
								+n.predictPeopleNum+'</td><td></td><td style="text-align: right;" class="font-bold"><span>'
									+ $yt_baseElement.fmMoney(n.amount)
									+ '</span></td><td><div class="yt-table-br">收费标准*预计学员人数/(1+3%)</div></td>'
						});
		$('#teachersCostList tbody .predict-tr').before(predictHtml)
	},
	setTeachersCostList : function(list) {
		var me = this;
		var receHtml = '';
		$
				.each(
						list,
						function(i, n) {
							var amount='';
							if(n.amount){
								amount=$yt_baseElement.fmMoney(n.amount);
							}
							receHtml += '<tr class="small-td"><td>'
									+ n.costTypeName
									+ '</td><td></td><td></td><td></td><td style="text-align: right;"><span>'
									+ amount
									+ '</span></td><td></td></tr>'
						});
		$('#teachersCostList tbody .train-other-tr').before(receHtml)
	},
	setTrainOtherList : function(list) {
		var me = this;
		var receHtml = '';
		$.each(list, function(i, n) {
			var standard="";
			if(n.standard){
				standard=$yt_baseElement.fmMoney(n.standard);
			}
			receHtml += '<tr class="small-td"><td>' + n.costTypeName
					+ '</td><td style="text-align: right;"><span>'
					+ standard + '</span></td><td>'
					+ n.trainOfNum + '</td><td>' + n.trainDays
					+ '</td><td style="text-align: right;"><span>'
					+ $yt_baseElement.fmMoney(n.amount)
					+ '</span></td><td style="text-align: left;">' + n.remark
					+ '</td></tr>'
		});
		var len = list.length + 10;
		$('.detail-tby').attr("rowspan", len);
		$('#teachersCostList tbody .train-sum-tr').before(receHtml)
	},
	setRecordOfApprovalListList : function(list) {
		var html = '';
		var total = 0;
		var i = 0;
		$
				.each(
						list,
						function(i, n) {
							html += '<tr><td>'
									+ (i + 1)
									+ '</td><td style="text-align: left;"><span class="nodeName">【'
									+ n.nodeName
									+ '】</span>——<span class="nodeUserName">'
									+ n.nodeUserName
									+ '</span></td><td class="" style="text-align: left;padding-left: 15px;">';
							$
									.each(
											n.approvaInfoList,
											function(v, j) {
												html += '<div style="'
														+ (v == n.approvaInfoList.length - 1 ? 'font-weight: bold;'
																: '')
														+ '"><span class="approvaDate">'
														+ j.approvaDate
														+ '</span><span class="approvaState" style="padding-left: 10px;">'
														+ j.approvaState
														+ '</span>，意见：<span class="approvaRemarks">'
														+ (j.approvaRemarks || '无')
														+ '</span></div>'
											});
							html += '</td></tr>'
						});
		var len = list.length + 1;
		$('.approval-record').attr("rowspan", len);
		$('.approval-record-table tbody').append(html)
	},
	doPrint : function() {
		bdhtml = window.document.body.innerHTML;
		startInvoicePasting = "<!--startInvoicePasting-->";
		endInvoicePasting = "<!--endInvoicePasting-->";
		prnhtml = bdhtml.substr(bdhtml.indexOf(startInvoicePasting));
		prnhtml = prnhtml.substring(0, prnhtml.indexOf(endInvoicePasting));
		window.document.body.innerHTML = prnhtml;
		window.focus();
		if (printFormObj.isIE()) {
			document.body.className += ' ext-ie';
			document.execCommand('print', false, null)
		} else {
			window.print()
		}
		window.document.body.innerHTML = bdhtml;
		window.location.reload()
	},
	isIE : function() {
		if (!!window.ActiveXObject || "ActiveXObject" in window) {
			return true
		} else {
			return false
		}
	}
};
$(function() {
	printFormObj.init()
});