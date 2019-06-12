var InvoicePasting = {
	init : function() {
		var appId = $yt_common.GetQueryString('appId');
		InvoicePasting.events();
		InvoicePasting.printInvoicePastingByExpenditureAppId(appId)
	},
	events : function() {
		$("#printBtn").off().on("click", function() {
			//WebBrowser.ExecWB(7, 1);
			InvoicePasting.doPrint()
		});
		$("#closeBtn").click(function() {
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
			url : "sz/expenditureApp/printInvoicePastingByExpenditureAppId",
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
	printInvoice : function(data) {
		$(".bill-department").text(data.applicantUserDeptName);
		$(".bill-agent").text(data.applicantUserName);
		$(".bill-cause").text(data.expenditureAppName);
		$(".year").text(data.printYear);
		$(".month").text(data.printMonth);
		$(".day").text(data.printDay);
		$("#expenditureAppNum").text(data.expenditureAppNum);
		var innerHeight = $('.bill-cause').innerHeight();
		if ($('.bill-cause').innerHeight() > 23) {
			$('.bill-cause').parents("td").css('vertical-align', 'top')
		}
		;
		if ($('.bill-cause').innerHeight() > 40) {
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
	InvoicePasting.init()
});