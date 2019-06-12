var InvoicePasting = {
	init : function(){
		var appId = $yt_common.GetQueryString('appId');
		InvoicePasting.events();
		InvoicePasting.printInvoicePastingByExpenditureAppId(appId);
	},
	events:function(){
		/*打印按钮操作事件*/
		$("#printBtn").off().on("click", function() {
			//WebBrowser.ExecWB(7,1);  
			//调用执行打印的方法
            InvoicePasting.doPrint();
		});
		/* 关闭按钮*/
		$("#closeBtn").click(function() {
			if(window.top == window.self){//不存在父页面
				window.close();
			}else{
			 	parent.closeWindow();
			}
		});
		
	},
	printInvoicePastingByExpenditureAppId: function(expenditureAppId) {
		$.ajax({
			type: "post",
			url: "sz/expenditureApp/printInvoicePastingByExpenditureAppId",
			async: true,
			data: {
				expenditureAppId:expenditureAppId
			},
			success: function(data) {
				var data = data.data;
				InvoicePasting.printInvoice(data);
			}
		});
	},
	printInvoice :function(data){
		$(".bill-department").text(data.applicantUserDeptName);
		$(".bill-agent").text(data.applicantUserName);
		$(".bill-cause").text(data.expenditureAppName);
		$(".year").text(data.printYear);
		$(".month").text(data.printMonth);
		$(".day").text(data.printDay);
		$("#expenditureAppNum").text(data.expenditureAppNum);
		var innerHeight=$('.bill-cause').innerHeight();
		if ($('.bill-cause').innerHeight()>23) {
			$('.bill-cause').parents("td").css('vertical-align','top');
		};
		if ($('.bill-cause').innerHeight()>40) {
			$('.bill-cause').css('font-size','12px');
		}
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
        if(InvoicePasting.isIE()){
			document.body.className += ' ext-ie';
			document.execCommand('print', false, null);
		}else{
			window.print();
		}
		window.document.body.innerHTML = bdhtml; //还原页面  
		window.location.reload();
	},
	isIE:function() {
		if (!!window.ActiveXObject || "ActiveXObject" in window)  
			return true;  
		else  
			return false; 
	}
}
$(function(){
	InvoicePasting.init();
})
