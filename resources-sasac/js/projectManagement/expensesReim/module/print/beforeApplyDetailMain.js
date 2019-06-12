var printFormObj = {
	init: function() {
		var appId = $yt_common.GetQueryString('expenditureAppId');
		var costType = $yt_common.GetQueryString('costType');
		printFormObj.events();
		//调用生成二维码方法
		printFormObj.downloadFileAppId(appId);
		switch(costType) {
			case 'TRAIN_APPLY': //培训费
				//调用获取单据基本信息方法
				printFormObj.printFormBaseInfo(appId);
				//调用获取培训费信息方法
				printFormObj.getPrintTrainInfo(appId);
				$(".meet-detailed-table-one").hide();
				$(".meet-detailed-table-two").hide();
				$("#teachersCostList").show();
				$("#teachersCostListFrist").show();
				$(".reception-table").hide();
				$(".reception-table-two").hide();
				$(".travel-detailed-table").hide();
				//显示底部签字栏
				$(".bot-signature-model").show();
				break;
			case 'MEETING_APPLY':
				//调用获取会议费信息方法
				printFormObj.getprintMeetingInfo(appId);
				$(".meet-detailed-table-one").show();
				$(".meet-detailed-table-two").show();
				$("#teachersCostList").hide();
				$("#teachersCostListFrist").hide();
				$(".reception-table").hide();
				$(".reception-table-two").hide();
				$(".travel-detailed-table").hide();
				break;
			case 'BH_APPLY':
				//调用获取公务接待费信息方法
				printFormObj.getprintReceptionInfo(appId);
				$(".meet-detailed-table-one").hide();
				$(".meet-detailed-table-two").hide();
				$("#teachersCostList").hide();
				$("#teachersCostListFrist").hide();
				$(".reception-table").show();
				$(".reception-table-two").show();
				$(".travel-detailed-table").hide();
				break;
			case 'TRAVEL_APPLY': //差旅费
				//调用获取公务接待费信息方法
				printFormObj.getprintTravelInfo(appId);
				$(".meet-detailed-table-one").hide();
				$(".meet-detailed-table-two").hide();
				$("#teachersCostList").hide();
				$("#teachersCostListFrist").hide();
				$(".reception-table").hide();
				$(".reception-table-two").hide();
				$(".travel-detailed-table").show();
				//显示底部签字区域
				$(".bot-travel-model").show();
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
			printFormObj.doPrint();
		});
		/* 关闭按钮*/
		$("#closeBtn").off().on("click", function() {
			/**
			 * 判断是否是顶层,如果不是,则顶层跳转页面
			 */
			if (window != top){
				parent.closeWindow();
			}else{
				window.close();
			}
		});
		if($('.before-cause,.train-name').innerHeight() > 50) {
			$('.before-cause,.train-name').css('padding', '0px');
		};
		if($('.before-cause,.train-name').innerHeight() > 55) {
			$('.before-cause,.train-name').css('font-size', '12px');
		}
	},
	//单据公用数据方法
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
					//printFormObj.printInvoice(datas);
					
				}
			}
		});
	},
	//培训费单据
	getPrintTrainInfo: function(advanceAppId) {
		$.ajax({
			type: "post",
			url: "sz/advanceApp/printTrainFormDetailsByAdvanceAppId",
			async: true,
			data: {
				advanceAppId: advanceAppId
			},
			success: function(data) {
				var datas = data.data;
				printFormObj.getDataList = datas;
				if(data.flag == 0) {
					printFormObj.printInvoiceTrain(datas);
					var afterTaxAllMoney = '';
					$.each(datas.applicationFee.predictCostList, function(i,n) {
						afterTaxAllMoney += n.amount;
					});
					$(".surcharge").text($yt_baseElement.fmMoney(afterTaxAllMoney*0.03*0.12));
					$(".added-tax-value").text($yt_baseElement.fmMoney(afterTaxAllMoney*0.03));
				}
			}
		});
	},
	//会议费单据
	getprintMeetingInfo: function(advanceAppId) {
		$.ajax({
			type: "post",
			url: "sz/advanceApp/printMeetingByAdvanceAppId",
			async: true,
			data: {
				advanceAppId: advanceAppId
			},
			success: function(data) {
				var datas = data.data;
				if(data.flag == 0) {
					$('.meeting-total-amount').text($yt_baseElement.fmMoney(datas.advanceAmount));
					printFormObj.printInvoiceMeeting(datas);
				}
			}
		});
	},
	//公务接待费用单据
	getprintReceptionInfo: function(advanceAppId) {
		$.ajax({
			type: "post",
			url: "sz/advanceApp/printReceptionByAdvanceAppId",
			async: true,
			data: {
				advanceAppId: advanceAppId
			},
			success: function(data) {
				var datas = data.data;
				if(data.flag == 0) {
					$('.reception-total-amount').text($yt_baseElement.fmMoney(datas.advanceAmount));
					printFormObj.printInvoiceRe(datas);
				}
			}
		});
	},
	//差旅费单据
	getprintTravelInfo: function(advanceAppId) {
		$.ajax({
			type: "post",
			url: "sz/advanceApp/printTravelExpensesByAdvanceAppId",
			async: true,
			data: {
				advanceAppId: advanceAppId
			},
			success: function(data) {
				var datas = data.data;
				if(data.flag == 0) {
					printFormObj.printInvoiceTravel(datas);
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
				context: $yt_option.websit_path + 'barCode/beforDetail.html?appId=' + expenditureAppId
			},
			success: function(data) {
				imgSrc = data.data;
				$('.qr-code').attr('src', $yt_option.base_path + 'fileUpDownload/downloadFile?storePath=' + imgSrc + '&isDownload=false');
			}
		});
	},
	//差旅
	printInvoiceTravel: function(data) {
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
		$(".by-budget-prj").text(data.specialName);
		//部门预算余额
		$(".dept-money").text($yt_baseElement.fmMoney(data.deptBudgetBalanceAmount));
		//单位预算余额
		$(".unit-money").text($yt_baseElement.fmMoney(data.budgetBalanceAmount));
		//总金额
		$(".travel-total-amount").text($yt_baseElement.fmMoney(data.advanceAmount));
		
//		//支出事由
//		$(".bill-cause").text(data.expenditureAppName);
//		//申请人
//		$(".apply-user").text(data.applicantUserName);
//		//申请部门
//		$(".apply-department").text(data.applicantUserDeptName);
//		//职务
//		$(".post-apply").text(data.applicantUserJobLevelName);
//		//电话
//		$(".apply-phone").text(data.applicantUserPhone);
//		//费用明细第一行
//		$("#costTypeName").text(data.costTypeName);
//		//费用明细第二行
//		$("#specialName").text(data.specialName);
//		//人民币大写
//		//		$(".paymen-amount-chinese").text(arabiaToChinese(data.totalAmount));
//		$("#expenditureAppNum").text(data.expenditureAppNum);

		$("#hotelAmount").text($yt_baseElement.fmMoney(data.travelInfo.hotelAmount));
		$("#cityFare").text($yt_baseElement.fmMoney(data.travelInfo.cityFare));
		$("#postFee").text($yt_baseElement.fmMoney(data.travelInfo.postFee));
		$("#officeSupplies").text($yt_baseElement.fmMoney(data.travelInfo.officeSupplies));
		$("#unSleeperSubsidy").text($yt_baseElement.fmMoney(data.travelInfo.unSleeperSubsidy));
		$("#other").text($yt_baseElement.fmMoney(data.travelInfo.other));
		$(".travel-people").text(data.travelPersonnelsName);
		$(".subsidy-money").text($yt_baseElement.fmMoney(data.travelInfo.travelSubsidyAmount));
		me.setTravelCostList(data.travelInfo.travelCostList);
		me.setTravelInfoList(data.travelInfo.travelInfoList);
		me.setRecordOfApprovalListList(data.recordOfApprovalList);
	},
	//公务接待费
	printInvoiceRe : function(data){
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
		$(".by-budget-prj").text(data.specialName);
		//部门预算余额
		$(".dept-money").text($yt_baseElement.fmMoney(data.deptBudgetBalanceAmount));
		//单位预算余额
		$(".unit-money").text($yt_baseElement.fmMoney(data.budgetBalanceAmount));
		
		me.printInvoiceBh(data.applicationFee);
		me.printInvoiceBec(data.applicationMatters);
		me.setRecordOfApprovalListList(data.recordOfApprovalList);
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
	setTravelCostList: function(list) {
		var thisTr = $(".travel-detailed-first-tr");
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
		});
	},
	printInvoiceBec: function(list) {
		var html = '';
		var total = 0;
		var i = 0;
		$.each(list, function(i, n) {
			html += '<tr>' +
				'<td>' + (i + 1) + '</td>' +
				'<td>' + n.receptionName + '</td>' +
				'<td>' + n.receptionJobName + '</td>' +
				'<td style="text-align: left;">' + n.receptionUnitName + '</td>' +
				'</tr>';
		});
		var len = list.length + 2;
		$('.expenditure-rowspan').attr("rowspan", len);
		$('.reception-table-two tbody').append(html);
	},
	printInvoiceBh: function(list) {
		var html = '';
		var total = 0;
		$.each(list, function(i, n) {
			html += '<tr>' +
				'<td>' + n.publicServiceProName + '</td>' +
				'<td>' + n.activityDate + '</td>' +
				'<td style="text-align: left;">' + n.placeName + '</td>' +
				'<td>' + n.costTypeName + '</td>' +
				'<td style="text-align: right;">' + $yt_baseElement.fmMoney(n.activityAmount) + '</td>' +
				'<td>' + n.peopleNum + '</td>' +
				'</tr>';
		});
		var len = list.length + 1;
		$('.expenditure-receivables-detailed').attr("rowspan", len);
		$('.reception-table tbody').append(html);
	},
	//通用
	//	printInvoice: function(data) {
	//		var me = this;
	//		//支出事由
	//		$(".bill-cause").text(data.expenditureAppName);
	//		//申请人
	//		$(".apply-user").text(data.applicantUserName);
	//		//申请部门
	//		$(".apply-department").text(data.applicantUserDeptName);
	//		//职务
	//		$(".post-apply").text(data.applicantUserJobLevelName);
	//		//电话
	//		$(".apply-phone").text(data.applicantUserPhone);
	//		//费用明细第一行
	//		$("#costTypeName").text(data.costTypeName);
	//		//费用明细第二行
	//		$("#specialName").text(data.specialName);
	//		//人民币大写
	//		//		$(".paymen-amount-chinese").text(arabiaToChinese(data.totalAmount));
	//		//金额
	//		$(".pay-money").text('￥' + $yt_baseElement.fmMoney(data.expTotalAmount));
	//		//总金额
	//		$(".normal-total-amount").text('￥' + $yt_baseElement.fmMoney(data.totalAmount));
	//		//年
	//		$(".year").text(data.printYear);
	//		//月
	//		$(".month").text(data.printMonth);
	//		//日
	//		$(".day").text(data.printDay);
	//		$("#expenditureAppNum").text(data.expenditureAppNum);
	//		//收款方明細
	//		me.setExpReceivablesListList(data.expReceivablesList);
	//		me.setNormalDetailsListList(data.normalDetailsList);
	//		me.setRecordOfApprovalListList(data.recordOfApprovalList);
	//	},
	//会议
	printInvoiceMeeting: function(data) {
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
		$(".by-budget-prj").text(data.specialName);
		//部门预算余额
		$(".dept-money").text($yt_baseElement.fmMoney(data.deptBudgetBalanceAmount));
		//单位预算余额
		$(".unit-money").text($yt_baseElement.fmMoney(data.budgetBalanceAmount));
		
		//会议申请事项信息
		var datas = data.applicationMatters;
		//会议名称
		$(".meet-name").text(datas.meetName);
		//会议分类
		$(".meet-addres").text(datas.meetTypeName);
		//开始日期
		$(".meet-start-time").text(datas.meetStartTime);
		//结束日期
		$(".meet-end-time").text(datas.meetEndTime);
		//会议地点
		$(".meet-place").text(datas.meetAddress);
		//参会人数
		$(".meet-people").text(datas.meetOfNum);
		//工作人员数量
		$(".job-num").text(datas.meetWorkerNum);
		
		var dataT = data.applicationFee;
		//住宿费
		$(".meet-hotel").text($yt_baseElement.fmMoney(dataT.meetHotel));
		//伙食费
		$(".meet-food").text($yt_baseElement.fmMoney(dataT.meetFood));
		//其实费用
		$(".meet-other").text($yt_baseElement.fmMoney(dataT.meetOther));
		//人均日均费用
		$(".average-expense").text($yt_baseElement.fmMoney(dataT.meetAverage));

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
		$(".by-budget-prj").text(data.specialName);
		//部门预算余额
		$(".dept-money").text($yt_baseElement.fmMoney(data.deptBudgetBalanceAmount));
		//单位预算余额
		$(".unit-money").text($yt_baseElement.fmMoney(data.budgetBalanceAmount));

		//申请事项信息
		//培训名称
		$(".train-name").text(data.applicationMatters.regionDesignation);
		//培训地点
		$(".train-addres").text(data.applicationMatters.regionName);
		$(".train-approva-num").text(data.applicationMatters.approvaNum);
		$(".train-charge-standard").text($yt_baseElement.fmMoney(data.applicationMatters.chargeStandard));
		$(".train-start-time").text(data.applicationMatters.reportTime);
		//结束日期
		$(".train-end-time").text(data.applicationMatters.endTime);
		//培训人数/学员人数
		$(".train-per-num").text(data.applicationMatters.trainOfNum);
		//员工数量/工作人员数量
		$(".train-work-num").text(data.applicationMatters.workerNum);

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
		me.setPredictCostList(data.applicationFee.predictCostList);
		//师资费支出详情
		me.setTeachersCostList(data.applicationFee.teachersCostList);
		me.setTrainOtherList(data.applicationFee.trainOtherList);
		me.setRecordOfApprovalListList(data.recordOfApprovalList);
	},
	setPredictCostList : function(list) {
		var me = this;
		var predictHtml = '';
		$.each(list,function(i, n) {
		  predictHtml += '<tr>';
		  if (i == 0) {
		    predictHtml += '<td class="font-bold" rowspan="'+ list.length +'">预计收费情况</td>';
		  }
			predictHtml += '<td>'+ $yt_baseElement.fmMoney(n.predictStandardMoney)+'</td>'+
							'<td>'+n.predictPeopleNum+'</td>'+
							'<td></td>'+
							'<td style="text-align: right;" class="font-bold"><span>'+ $yt_baseElement.fmMoney(n.amount) + '</span></td>'+
							'<td><div class="yt-table-br">'+n.remark+'</div></td></tr>';
			});
		var detailTby = $('td.detail-tby');
		var rowspan = detailTby.attr('rowspan');
		detailTby.attr('rowspan', +rowspan + list.length);
		$('#teachersCostList tbody .predict-tr').before(predictHtml);
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
			receHtml += '<tr class="small-td">'+
							'<td>'+ n.costTypeName +'</td>'+
							'<td></td><td></td><td></td>'+
							'<td style="text-align: right;"><span>'+ $yt_baseElement.fmMoney(n.amount) +'</span></td><td></td>'+
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
			var standard = (n.standard == '0' || n.standard == '') ? '': $yt_baseElement.fmMoney(n.standard);
			var trainOfNum = (n.trainOfNum == '0'|| n.trainOfNum == '') ? '': n.trainOfNum;
			var trainDays = (n.trainDays == '0' || n.trainDays == '') ? '':n.trainDays;
			receHtml += '<tr class="small-td">'+
							'<td>'+ n.costTypeName +'</td>'+
							'<td style="text-align: right;"><span>'+ standard +'</span></td>'+
							'<td>'+ trainOfNum +'</td>'+
							'<td>'+ trainDays +'</td>'+
							'<td style="text-align: right;"><span>'+ $yt_baseElement.fmMoney(n.amount) +'</span></td>'+
							'<td style="text-align: left;">'+ n.remark +'</td>'+
						'</tr>';
		});
		receHtml+= '<tr>'+
					'<td class="font-bold">'+ '应缴附加费' +'</td>'+
					'<td style="text-align: right;"><span>'+ '12%' +'</span></td>'+
					'<td>'+'</td>'+
					'<td>'+'</td>'+
					'<td style="text-align: right;" class="font-bold"><span class="surcharge">'+ $yt_baseElement.fmMoney(printFormObj.incomeTotal*0.03*0.12) +'</span></td>'+
					'<td style="text-align: left;"></td>'+
					'</tr>';
		var len = 0;
		var rowspan = +$('.detail-tby').attr("rowspan");
		if(printFormObj.getDataList.applicationFee.hasOwnProperty('predictCostList') && printFormObj.getDataList.applicationFee.predictCostList.length > 0){
			len = list.length + rowspan;
		}else{
			len = list.length + rowspan;
		}
		$('.detail-tby').attr("rowspan", len);
		$('#teachersCostList tbody .added-tax-value').text($yt_baseElement.fmMoney(printFormObj.incomeTotal*0.03));
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
		if(printFormObj.isIE()) {
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
	printFormObj.init();
})