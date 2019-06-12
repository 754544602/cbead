var InvoicePasting = {
	init : function() {
		var appId = $yt_common.GetQueryString('expenditureAppId');
		
		InvoicePasting.events();
		InvoicePasting.printInvoicePastingByExpenditureAppId(appId);
		InvoicePasting.downloadFileAppId(appId);
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
			InvoicePasting.doPrint()
		});
		$("#closeBtn").off().on("click", function() {
			if (window.top == window.self) {
				window.close()
			} else {
				parent.closeWindow()
			}
		})
	},
	printInvoicePastingByExpenditureAppId : function(expenditureAppId) {
		$.ajax({
			type : "post",
			url : "sz/expenditureApp/printSpendingFormByExpenditureAppId",
			async : true,
			data : {
				expenditureAppId : expenditureAppId
			},
			success : function(data) {
				var data = data.data;
				InvoicePasting.printInvoice(data)
			}
		})
	},
	downloadFileAppId : function(expenditureAppId) {
		var imgSrc = '';
		$.ajax({
			type : "post",
			url : "fileUpDownload/createQrCode",
			async : true,
			data : {
				context : $yt_option.websit_path
						+ 'barCode/expDetail.html?appId=' + expenditureAppId
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
	printInvoice : function(data) {
		$(".bill-cause").text(data.expenditureAppName);
		$(".apply-user").text(data.applicantUserName);
		$(".apply-department").text(data.applicantUserDeptName);
		$(".post-apply").text(data.applicantUserPositionName);
		$(".apply-phone").text(data.applicantUserPhone);
		$("#costTypeName").text(data.costTypeName);
		$("#specialName").text(data.specialName);
		$(".paymen-amount-chinese").text(arabiaToChinese(data.totalAmount));
		$(".paymen-amount").text(
				'￥' + $yt_baseElement.fmMoney(data.totalAmount));
		$(".year").text(data.printYear);
		$(".month").text(data.printMonth);
		$(".day").text(data.printDay);
		$("#expenditureAppNum").text(data.expenditureAppNum);
		var innerHeight = $('.bill-cause').innerHeight();
		if (innerHeight > 23) {
			$('.bill-cause').parents("td").css('vertical-align', 'top')
		}
		;
		if (innerHeight > 40) {
			$('.bill-cause').css('font-size', '12px')
		}
	},
	doPrint : function() {
		bdhtml = window.document.body.innerHTML;
		startInvoicePasting = "<!--startInvoicePasting-->";
		endInvoicePasting = "<!--endInvoicePasting-->";
		prnhtml = bdhtml.substr(bdhtml.indexOf(startInvoicePasting));
		prnhtml = prnhtml.substring(0, prnhtml.indexOf(endInvoicePasting));
		window.document.body.innerHTML = prnhtml;
		window.focus();
		if (InvoicePasting.isIE()) {
			document.body.className += ' ext-ie';
			document.execCommand('print', false, null)
		} else {
			window.print()
		}
		window.document.body.innerHTML = bdhtml;
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
	InvoicePasting.init()
});