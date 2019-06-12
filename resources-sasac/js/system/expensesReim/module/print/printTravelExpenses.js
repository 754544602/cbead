var printTE = {
	expenditureAppId:'',//支出申请id
	processInstanceId:'',//流程日志id
	inits: function() {
		printTE.expenditureAppId = $yt_common.GetQueryString('expenditureAppId');
		printTE.processInstanceId=$yt_common.GetQueryString('processInstanceId');
		//获取流程日志
		var flowLogHtml=sysCommon.getCommentByProcessInstanceId(printTE.processInstanceId);
		$(".flow-log-div").html(flowLogHtml);
		printTE.events();
		printTE.initDate();
	},
	events:function(){
		/*打印按钮操作事件*/
		$("#printBtn").off().on("click", function() {
			//调用执行打印的方法
            printTE.doPrint();
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
			url: "sz/expenditureApp/printTravelExpensesByExpenditureAppId",
			async: true,
			data: {
				expenditureAppId:printTE.expenditureAppId,	//支出申请表id
			},
			success: function(data) {
				if(data.flag==0){
					var datas=data.data;
					$(".expenditure-app-num").text(datas.expenditureAppNum);//单据编号
//					$(".expenditure-app-id").text(datas.expenditureAppId);	//支出申请id
					$(".expenditure-app-num").text(datas.expenditureAppNum);	//支出申请单号
					var entryVal=[];	//支出事由字段拆分数组
					var entryLength=0;	//支出事由字段长度
					entryVal=datas.expenditureAppName.split('');	//拆分字段为数组
					$(entryVal).each(function(i,n){
						if(n.charCodeAt()>255){ //遍历判断字符串中每个字符的Unicode码,大于255则为中文  
							entryLength += 2;  //如果是中文加2字符
						}else{
							entryLength += 1;	//否则加1字符
						}
					});
					if(entryLength >= 68){		//支出事由总字符长度大于等于74时添加样式
						$(".expenditure-app-name").addClass("expenditure-app-name-css");
						if(entryLength >= 136){		//总字符大于148时改变字体大小
							$(".expenditure-app-name").css("font-size","12px");
						}
					}
					$(".expenditure-app-name").text(datas.expenditureAppName);	//支出申请事由
					$(".total-amount").text(datas.totalAmount);	//支出总金额
					$(".invoice-num").text(datas.invoiceNum);	//附件张数/发票张数
					$(".applicant-user").text(datas.applicantUser);	//申请人
					$(".applicant-user-name").text(datas.applicantUserName);	//申请人姓名
					$(".applicant-user-dept-name").text(datas.applicantUserDeptName);	//申请人所在部门
//					$(".applicantUserJobLevelCode").text(datas.applicantUserJobLevelCode);	//申请人级别code
//					$(".applicantUserJobLevelName").text(datas.applicantUserJobLevelName);	//申请人级别名称
					$(".print-year").text(datas.printYear);	//打印时间-年
					$(".print-month").text(datas.printMonth);	//打印时间-月
					$(".print-day").text(datas.printDay);	//打印时间-日
					$(".travel-personnels").text(datas.travelPersonnels);	//出差人
					$(".travel-personnels-name").text(datas.travelPersonnelsName);	//出差人姓名
					$(".travel-subsidy-day").text(datas.travelSubsidyDay);	//出差补贴-天数
//					$(".travel-subsidy-amount").text(datas.travelSubsidyAmount);	//出差补贴-金额
					$(".hotel-amount").text($yt_baseElement.fmMoney(datas.hotelAmount));//	住宿费
					$(".city-fare").text($yt_baseElement.fmMoney(datas.cityFare));//	市内车费
					$(".post-fee").text($yt_baseElement.fmMoney(datas.postFee));//	邮电费
					$(".office-supplies").text($yt_baseElement.fmMoney(datas.officeSupplies));//	办公用品费
					$(".un-sleeper-subsidy").text($yt_baseElement.fmMoney(datas.unSleeperSubsidy));//	不买卧铺补贴
					$(".other").text($yt_baseElement.fmMoney(datas.other));//	其他
					$(".write-offs").text($yt_baseElement.fmMoney(datas.writeOffs));//	予借旅费
					//设置差旅费集合数据
					var thisTr=$(".travel-start-tr");
					thisTr.find('td').eq(11).text(datas.travelSubsidyDay);//出差补贴天数
					thisTr.find('td').eq(12).text($yt_baseElement.fmMoney(datas.travelSubsidyAmount));//出差补贴金额
					var carFareTotal=0;//交通费合计金额
					var travelExpenseTotal=datas.travelSubsidyAmount;//出差补贴合计金额
					var	otherTotal=0;//其他费用合计金额
					$(datas.travelCostList).each(function(i,n){
						thisTr.find("td").eq(0).text(n.goMonth);
						thisTr.find("td").eq(1).text(n.goDay);
						thisTr.find("td").eq(2).text();
						thisTr.find("td").eq(3).text(n.goAddressName);
						thisTr.find("td").eq(4).text(n.arrivalMonth);
						thisTr.find("td").eq(5).text(n.arrivalDay);
						thisTr.find("td").eq(6).text();
						thisTr.find("td").eq(7).text(n.arrivalAddressName);
						thisTr.find("td").eq(8).text(n.vehicleName);
						thisTr.find("td").eq(9).text();
						thisTr.find("td").eq(10).text(n.carfare);
						thisTr.find("td").eq(11).text();
						thisTr.find("td").eq(12).text();
						carFareTotal += 0;//交通费叠加
						travelExpenseTotal += 0;//差旅费叠加
						//如果数据大于6条时追加一行
						if(i>=5){
							thisTr.after('<tr style="">'+
							'<td class="tr"></td> <td class="tr"></td> <td></td> <td class="tl"></td>'+
							'<td class="tr"></td> <td class="tr"></td> <td></td> <td class="tl"></td>'+
							'<td class="tl"></td> <td class="tr"></td><td></td><td></td><td></td><td></td>'+
							'<td></td><td></td>'+
							'</tr>');
							$(".rowspan-td").attr("rowspan",(i+7));
						}
						thisTr=thisTr.next();
					});
					if($(".travel-table tr").length>15){ //判断是否有添加行如果有删除多余行
						thisTr.remove();
					}
					//合计金额赋值
					$(".car-fare-total").text($yt_baseElement.fmMoney(carFareTotal));//交通费合计
					$(".travel-expense-total").text($yt_baseElement.fmMoney(travelExpenseTotal));//差旅费合计
					$(".other-total").text($yt_baseElement.fmMoney($yt_baseElement.rmoney(datas.hotelAmount) + $yt_baseElement.rmoney(datas.cityFare) + $yt_baseElement.rmoney(datas.postFee) + $yt_baseElement.rmoney(datas.officeSupplies) + $yt_baseElement.rmoney(datas.unSleeperSubsidy) + $yt_baseElement.rmoney(datas.other)));//其他费合计
					var totalMoney= $yt_baseElement.rmoney($(".other-total").text()) + carFareTotal + travelExpenseTotal;
					$(".total-money").text(arabiaToChinese(totalMoney + ''));//总金额 人民币大写
					//补领金额和退还金额赋值
					if((totalMoney-datas.writeOffs)>0){
						$(".replace-money").text($yt_baseElement.fmMoney((totalMoney-datas.writeOffs)));
					}else{
						$(".return-money").text($yt_baseElement.fmMoney((totalMoney-datas.writeOffs)));
					}
				}else{
					$yt_alert_Model.prompt(data.message);
				}
			}
		});
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
	printTE.inits();
});