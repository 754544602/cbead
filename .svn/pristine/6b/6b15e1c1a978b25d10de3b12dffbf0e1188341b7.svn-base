var InvoicePasting = {
	init: function() {
		var appId = $yt_common.GetQueryString('expenditureAppId');
		var costType = $yt_common.GetQueryString('costType');
		InvoicePasting.events();
		InvoicePasting.downloadFileAppId(appId);
		switch(costType) {
			case 'TRAIN_APPLY':
				InvoicePasting.printInvoicePastingByExpenditureAppId(appId);
				InvoicePasting.printTrainCostByExpenditureAppId(appId);
				$('.train-detailed-table').show();
				$('.travel-detailed-table').hide();
				$('.cost-detailed-table').hide();
				$('.meeting-table').hide();
				$('.reception-table').hide();
				break;
			case 'TRAVEL_APPLY':
				InvoicePasting.printInvoicePastingByExpenditureAppId(appId);
				InvoicePasting.printTravelExpensesByExpenditureAppId(appId);
				$('.train-detailed-table').hide();
				$('.travel-detailed-table').show();
				$('.cost-detailed-table').hide();
				$('.meeting-table').hide();
				$('.reception-table').hide();
				break;
			case 'MEETING_APPLY':
				InvoicePasting.printInvoicePastingByExpenditureAppId(appId);
				InvoicePasting.printMeetingFormDetailsByExpenditureAppId(appId);
				$('.train-detailed-table').hide();
				$('.travel-detailed-table').hide();
				$('.cost-detailed-table').hide();
				$('.meeting-table').show();
				$('.reception-table').hide();
				break;
			case 'BH_APPLY':
				InvoicePasting.printInvoicePastingByExpenditureAppId(appId);
				InvoicePasting.printReceptionFormDetailsByExpenditureAppId(appId);
				$('.train-detailed-table').hide();
				$('.travel-detailed-table').hide();
				$('.cost-detailed-table').hide();
				$('.meeting-table').hide();
				$('.reception-table').show();
				break;
			case 'NORMAL_APPLY'://通用支出
				InvoicePasting.printInvoicePastingByExpenditureAppId(appId);
				$('.train-detailed-table').hide();
				$('.travel-detailed-table').hide();
				$('.cost-detailed-table').show();
				$('.meeting-table').hide();
				$('.reception-table').hide();
				break;
		    case 'SOCIAL_SECURITY_FEE'://公积金
		        InvoicePasting.printInvoicePastingByExpenditureAppId(appId);
				$('.train-detailed-table').hide();
				$('.travel-detailed-table').hide();
				$('.cost-detailed-table').show();
				$('.meeting-table').hide();
				$('.reception-table').hide();
				break;
			case 'LABOUR_UNION_FUNDS':
				InvoicePasting.printInvoicePastingByExpenditureAppId(appId);
				$('.train-detailed-table').hide();
				$('.travel-detailed-table').hide();
				$('.cost-detailed-table').show();
				$('.meeting-table').hide();
				$('.reception-table').hide();
				break;
			case 'PARTY_BUILDING_FUNDS':
				InvoicePasting.printInvoicePastingByExpenditureAppId(appId);
				$('.train-detailed-table').hide();
				$('.travel-detailed-table').hide();
				$('.cost-detailed-table').show();
				$('.meeting-table').hide();
				$('.reception-table').hide();
				break;
			case 'CURRENT_ACCOUNT'://往来款项
				InvoicePasting.printInvoicePastingByExpenditureAppId(appId);
				$('.train-detailed-table').hide();
				$('.travel-detailed-table').hide();
				$('.cost-detailed-table').show();
				$('.meeting-table').hide();
				$('.reception-table').hide();
				break;
			case 'MEDICAL_EXPENSES':
				InvoicePasting.printInvoicePastingByExpenditureAppId(appId);
				$('.train-detailed-table').hide();
				$('.travel-detailed-table').hide();
				$('.cost-detailed-table').show();
				$('.meeting-table').hide();
				$('.reception-table').hide();
				break;
			case 'ACCRUED_TAX'://薪酬税费
				InvoicePasting.printInvoicePastingByExpenditureAppId(appId);
				$('.train-detailed-table').hide();
				$('.travel-detailed-table').hide();
				$('.cost-detailed-table').show();
				$('.meeting-table').hide();
				$('.reception-table').hide();
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
	printInvoicePastingByExpenditureAppId: function(expenditureAppId) {
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
					InvoicePasting.printInvoice(datas);
				}
			}
		});
	},
	//培训费单据
	printTrainCostByExpenditureAppId: function(expenditureAppId) {
		$.ajax({
			type: "post",
			url: "sz/expenditureApp/printTrainCostByExpenditureAppId",
			async: true,
			data: {
				expenditureAppId: expenditureAppId
			},
			success: function(data) {
				var datas = data.data;
				if(data.flag == 0) {
					InvoicePasting.printInvoiceTrain(datas);
				}
			}
		});
	},
	//差旅费单据
	printTravelExpensesByExpenditureAppId: function(expenditureAppId) {
		$.ajax({
			type: "post",
			url: "sz/expenditureApp/printTravelExpensesByExpenditureAppId",
			async: true,
			data: {
				expenditureAppId: expenditureAppId
			},
			success: function(data) {
				if(data.flag == 0) {
					var datas = data.data;
					if(data.flag == 0) {
						var str = "";
						var a = datas.costOtherList.length;//其他费用
				        var b = datas.travelCostList.length;//差旅费
				        var c = 0;
				         var max="";
				         if(a>b){
				         	max=a;
				         }else{
				         	max=b;
				         }
				         if(max>c){
				         	max=max;
				         }else{
				         	max=c;
				         }
			            //判断住宿费是否有值
                    	 if(datas.hotelAmount !=undefined && datas.hotelAmount !=null && datas.hotelAmount !=""){
                    	 	//如果住宿费有值就多拼接一行
                    	 	max+=1;
				         }
				         //比较其他费用数据条数和差旅费数据条数哪个大用来生成表格行
	                    for (var i=0;i<max-1;i++) {
	                    	str += '<tr>'+
										'<td class="start-place"></td>'+
										'<td class="end-place"></td>'+
										'<td class="travel-num"></td>'+
										'<td style="text-align: right;" class="traffic-money"></td>'+
										'<td style="text-align: right;" class="subsidy-money"></td>'+
										'<td class="otherName" style="font-weight: bold;"></td>'+
										'<td class="hotelAmount" style="text-align: right;"></td>'+
									'</tr>';
	                    }
	                    $(".travel-detailed-first-tr").after(str);
	                    //调用赋值差旅费信息方法
						InvoicePasting.printInvoiceTravel(datas);
					}
				}
			}
		});
	},
	//会议费单据
	printMeetingFormDetailsByExpenditureAppId: function(expenditureAppId) {
		$.ajax({
			type: "post",
			url: "sz/expenditureApp/printMeetingFormDetailsByExpenditureAppId",
			async: true,
			data: {
				expenditureAppId: expenditureAppId
			},
			success: function(data) {
				var datas = data.data;
				var datsT = datas.meetDetailsData;
				if(data.flag == 0) {
					$('.meeting-total-amount').text($yt_baseElement.fmMoney(datas.normalTotalAmount));
					InvoicePasting.printInvoiceMeeting(datsT);
				}
			}
		});
	},
	//公务接待而非单据
	printReceptionFormDetailsByExpenditureAppId: function(expenditureAppId) {
		$.ajax({
			type: "post",
			url: "sz/expenditureApp/printReceptionFormDetailsByExpenditureAppId",
			async: true,
			data: {
				expenditureAppId: expenditureAppId
			},
			success: function(data) {
				var datas = data.data;
				if(data.flag == 0) {
					$('.reception-total-amount').text($yt_baseElement.fmMoney(datas.normalTotalAmount));
					InvoicePasting.printInvoiceBh(datas);
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
				context: $yt_option.websit_path + 'barCode/expDetail.html?appId=' + expenditureAppId
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
	//会议
	printInvoiceMeeting: function(data) {
		var me = this;
		//会议名称
		$(".meeting-name").text(data.meetName);
		//会议分类
		$(".meeting-type").text(data.meetTypeName);
		//会议起止日期
		$(".meeting-data").text(data.meetStartTime + '  至  ' + data.meetEndTime);
		//会议地点
		$(".meeting-place").text(data.meetAddress);
		//参会人数
		$(".meeting-number").text(data.meetOfNum);
		//工作人员数量
		$(".job-number").text(data.meetWorkerNum);
		//住宿费
		$(".hotel-expense").text($yt_baseElement.fmMoney(data.meetHotel));
		//伙食费
		$(".food-expense").text($yt_baseElement.fmMoney(data.meetFood));
		//其他费用
		$(".other-expense").text($yt_baseElement.fmMoney(data.meetOther));
		//人均日均费用金额
		$(".average-expense").text($yt_baseElement.fmMoney(data.meetAverage));
	},
	//差旅
	printInvoiceTravel: function(data) {
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
		//总金额
		$(".travel-total-amount").text('￥' + $yt_baseElement.fmMoney(data.totalAmount));
		//年
		$(".year").text(data.printYear);
		//月
		$(".month").text(data.printMonth);
		//日
		$(".day").text(data.printDay);
		$("#expenditureAppNum").text(data.expenditureAppNum);

		//$("#hotelAmount").text($yt_baseElement.fmMoney(data.hotelAmount));
	    //判断住宿费是否有值
		var trNum = 3;//拼接其他费用行数从第几行开始
		if(data.hotelAmount !=undefined && data.hotelAmount !=null && data.hotelAmount !=""){
			var thisTr = $(".travel-detailed-first-tr");
			$(thisTr).addClass("hotel-info").find(".otherName").attr("other-flag","hotel").text("住宿费");//住宿费名称
			$(thisTr).find(".hotelAmount").text($yt_baseElement.fmMoney(data.hotelAmount));//住宿费金额
			trNum +=1;//如果有住宿费行数就加1
		}
		debugger
		//遍历赋值其他费用数据
		$('.travel-detailed-table tr:gt('+trNum+')').each(function(i,t){
			if(data.costOtherList[i]){
				$(t).find(".otherName").text(data.costOtherList[i].costType);//其他费用名称
				$(t).find(".hotelAmount").text($yt_baseElement.fmMoney(data.costOtherList[i].amount));//金额
			}
		});
		
		$("#officeSupplies").text($yt_baseElement.fmMoney(data.officeSupplies));
		$("#unSleeperSubsidy").text($yt_baseElement.fmMoney(data.unSleeperSubsidy));
		$("#other").text($yt_baseElement.fmMoney(data.other));
		$(".travel-people").text(data.travelPersonnelsName);
		$(".subsidy-money").text($yt_baseElement.fmMoney(data.travelSubsidyAmount));
		me.setTravelCostList(data.travelCostList);
		me.setTravelInfoList(data.travelInfoList);
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
		//通过costType判断执行那个加载列表方法
		if(data.costType == 'NORMAL_APPLY'){
			me.setNormalDetailsListList(data.normalDetailsList);
		}else{
			me.setcostSpecialDetailsList(data.costSpecialDetailsList);
		}
		me.setRecordOfApprovalListList(data.recordOfApprovalList);
	},
	//	培训
	printInvoiceTrain: function(data) {
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
		//师资费总金额
		$("#teachersAmount").text($yt_baseElement.fmMoney(data.teachersAmount.teachersAmount));
		
		//年
		$(".year").text(data.printYear);
		//月
		$(".month").text(data.printMonth);
		//日
		$(".day").text(data.printDay);
		$("#expenditureAppNum").text(data.expenditureAppNum);

		var tea = data.teachersLectureList.length;
		var oth = data.teachersOtherAmount.length;
		var len = tea + oth + 4;
		$('.payment-detail-tby').attr("rowspan", len);
		//培训费-师资费
		me.setTeachersLectureList(data.teachersLectureList);
		me.setTeachersOtherAmountList(data.teachersOtherAmount);
		//总金额
		var teachersTax = $("#teachersTax").text(); //取课酬费税金
		//var total = data.totalAmount - $yt_baseElement.rmoney(teachersTax);
		$(".train-total-amount").text('￥' + $yt_baseElement.fmMoney(data.totalAmount));
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
		
		/*var thisTr = $(".travel-detailed-first-tr");
		var listLen = $(list).length;
		$(list).each(function(i, n) {
			thisTr.find(".start-place").text(n.goAddressName);
			thisTr.find(".end-place").text(n.arrivalAddressName);
			thisTr.find(".travel-num").text(n.personNum);
			thisTr.find(".traffic-money").text($yt_baseElement.fmMoney(n.crafare));
			//如果数据大于6条时追加一行
			if(i >= 5 && (listLen - 1) > i) {
				thisTr.after('<tr style="">' +
					'<td class="start-place"></td>' +
					'<td class="end-place"></td>' +
					'<td class="travel-num"></td>' +
					'<td style="text-align: right;" class="traffic-money"></td>' +
					'<td style="text-align: right;" class="subsidy-money"></td>' +
					'<td class=""></td>' +
					'<td class=""></td>' +
					'</tr>');
			}
			thisTr = thisTr.next();
		});*/
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
				'<td class="" style="text-align:right;">' + $yt_baseElement.fmMoney(n.paidAmount) + '</td>';
				if(n.receivablesType == '冲销借款'){
					html += '<td class="">借款单：'+ n.loanAppNum + '<br/>' + n.remarks;
				} else {
					html += '<td class="">' + n.remarks;
				}
				'</td>' +
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