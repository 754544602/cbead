var InvoicePasting = {
	init : function(){
		var appId = $yt_common.GetQueryString('expenditureAppId');
		InvoicePasting.events();
		InvoicePasting.printInvoicePastingByExpenditureAppId(appId);
		InvoicePasting.downloadFileAppId(appId);
		//扫码打印功能
		$("input.code-inpu").startListen({
			letter : true,
			check  : false,
			show : function(code){
				if(code !="" && code && code !=undefined && code !=null){
					var subStr = code.substring(0,7);
					//截取开头是不是http://开头
					if(subStr == "http://"){
						window.open(code);
					}else{
						$yt_alert_Model.prompt("二维码识别不成功,请联系管理员!");
					}
				}else{
					$yt_alert_Model.prompt("二维码识别不成功,请联系管理员!");
				}
			}
		});
	},
	events:function(){
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
	},
	printInvoicePastingByExpenditureAppId: function(expenditureAppId) {
		$.ajax({
			type: "post",
			url: "sz/expenditureApp/printSpendingFormByExpenditureAppId",
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
	//2.2.4.4(文件路径)生成二维码 
	downloadFileAppId: function(expenditureAppId) {
		var imgSrc = '';
		$.ajax({
			type: "post",
			url: "fileUpDownload/createQrCode",
			async: true,
			data: {
				context : $yt_option.websit_path + 'barCode/expDetail.html?appId='+expenditureAppId
			},
			success: function(data) {
				imgSrc = data.data;
				$('.qr-code').attr('src',$yt_option.base_path + 'fileUpDownload/downloadFile?storePath=' + imgSrc + '&isDownload=false');
			}
		});
	},
//	//2.2.4.3(文件路径)下载文件/查看图片
//	downloadFile : function(imgSrc) {
//		
//		
//		
//	},
	printInvoice :function(data){
		//支出事由
		$(".bill-cause").text(data.expenditureAppName);
		//申请人
		$(".apply-user").text(data.applicantUserName);
		//申请部门
		$(".apply-department").text(data.applicantUserDeptName);
		$(".post-apply").text(data.applicantUserPositionName);
		$(".apply-phone").text(data.applicantUserPhone);
		//费用明细第一行
		$("#costTypeName").text(data.costTypeName);
		//费用明细第二行
		$("#specialName").text(data.specialName);
		//人民币大写
		$(".paymen-amount-chinese").text(arabiaToChinese($yt_baseElement.fmMoney(data.totalAmount)));
		$(".paymen-amount").text('￥' + $yt_baseElement.fmMoney(data.totalAmount));
		//年
		$(".year").text(data.printYear);
		//月
		$(".month").text(data.printMonth);
		//日
		$(".day").text(data.printDay);
		$("#expenditureAppNum").text(data.expenditureAppNum);
		var innerHeight=$('.bill-cause').innerHeight();
		if (innerHeight > 23) {
			$('.bill-cause').parents("td").css('vertical-align','top');
		};
		if (innerHeight > 40) {
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
//		window.location.reload();
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