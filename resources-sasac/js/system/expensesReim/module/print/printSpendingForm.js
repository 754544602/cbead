var printSF = {
	expenditureAppId:'',//支出申请id
	processInstanceId:'',//流程日志id
	inits: function() {
		printSF.expenditureAppId = $yt_common.GetQueryString('expenditureAppId');
		printSF.processInstanceId=$yt_common.GetQueryString('processInstanceId');
		//获取流程日志
		var flowLogHtml=sysCommon.getCommentByProcessInstanceId(printSF.processInstanceId);
		$(".flow-log-div").html(flowLogHtml);
		printSF.events();
		printSF.initDate();
	},
	events:function(){
		/*打印按钮操作事件*/
		$("#printBtn").off().on("click", function() {
			//调用执行打印的方法
            printSF.doPrint();
		});
		/* 关闭按钮*/
		$("#closeBtn").off().on("click", function() {
			//调用父级关闭当前窗体方法
			parent.closeWindow();
		});
	},
	/*初始化页面数据*/
	initDate:function(){
		//差旅费报销单数据获取
		$.ajax({
			type: "post",
			url: "sz/expenditureApp/printSpendingFormByExpenditureAppId",
			async: true,
			data: {
				expenditureAppId:printSF.expenditureAppId,	//支出申请表id
			},
			success: function(data) {
				if(data.flag==0){
					var datas=data.data;
						//expenditureAppId	支出申请id
					$(".expenditure-app-num").text(datas.expenditureAppNum); //expenditureAppNum	支出申请单号
					var entryVal=[];
					var entryLength=0;
					entryVal=datas.expenditureAppName.split('');
					$(entryVal).each(function(i,n){
						if(n.charCodeAt()>255){ //遍历判断字符串中每个字符的Unicode码,大于255则为中文  
							entryLength += 2;
						}else{
							entryLength += 1;
						}
					});
					if(entryLength >= 56){
						$(".expenditure-app-name").addClass("expenditure-app-name-css");
						if(entryLength >= 112){
							$(".expenditure-app-name").css("font-size","12px");
						}
					}
					$(".expenditure-app-name").text(datas.expenditureAppName);//expenditureAppName	支出申请事由
					$(".total-amount").text($yt_baseElement.fmMoney(datas.totalAmount));//totalAmount	 支出总金额
						//applicantUser	申请人
						//applicantUserName	申请人姓名
						//applicantUserDeptName	申请人所在部门
						//applicantUserJobLevelCode	申请人级别code
						//applicantUserJobLevelName	申请人级别名称
					$(".print-year").text(datas.printYear);//printYear	打印时间-年
					$(".print-month").text(datas.printMonth);//printMonth	打印时间-月
					$(".print-day").text(datas.printDay);//printDay	打印时间-日
						//paymentAmount	已支出金额
					var payReceivablesList=datas.payReceivablesList;	
					//收款方集合
					var thisTr=$(".datas-start-tr");
					var sumMoney=0;
					$(payReceivablesList).each(function(i,n){
						if(i>=3){
							thisTr.after('<td style="text-align:left;padding:2px 5px;"><div class="width-td"></div></td><td></td><td></td><td></td><td></td>');
							$(".rowspan-attr-td").attr("rowspan",(i+3));
						}
						$(".width-td")
						var entryArr=[];
						var entryArrLength=0;
						entryArr=n.payName.split('');
						$(entryArr).each(function(i,n){
							if(n.charCodeAt()>255){ //遍历判断字符串中每个字符的Unicode码,大于255则为中文  
								entryArrLength += 2;
							}else{
								entryArrLength += 1;
							}
						});
						if(entryArrLength >= 50){
							thisTr.find("td .width-td").addClass("expenditure-app-name-css");
							if(entryArrLength >= 100){
								thisTr.find("td .width-td").css("font-size","12px");
							}
						}
						thisTr.find("td .width-td").text(n.payName);
						thisTr.find("td").eq(1).text($yt_baseElement.fmMoney(n.amount)).css("text-align","right");
						thisTr.find("td").eq(2).text(n.openBank);
						thisTr.find("td").eq(3).text(n.accounts);
						thisTr.find("td").eq(4).text((n.isContract == 1 ? '是' : '否'));
						sumMoney += $yt_baseElement.rmoney(n.amount);
						thisTr=thisTr.next();
					});
					$(".sum-money").text($yt_baseElement.fmMoney(sumMoney));
					$(".text-sum-money").text(arabiaToChinese(sumMoney + ""));
				}else{
					$yt_alert_Model.prompt(data.message);
				}
			}
		})
	},
	/**
	 * 
	 * 执行打印操作
	 * 
	 */
	doPrint: function() {
		bdhtml = window.document.body.innerHTML; //获取当前页的html代码  
		sprnstr = "<!--startprint-->"; //设置打印开始区域   
		eprnstr = "<!--endprint-->"; //设置打印结束区域   
		prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr) + 17); //从开始代码向后取html   
		prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr)); //从结束代码向前取html   
		window.document.body.innerHTML = prnhtml;
		window.print();
		window.document.body.innerHTML = bdhtml; //还原页面  
		window.location.reload();
	},

};

$(function() {
	printSF.inits();
});