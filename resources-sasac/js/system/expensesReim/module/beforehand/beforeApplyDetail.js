var priorApproval = {
	detailDatas:"",//全局的数据集
	processInstanceId:'',//流程日志id
	init: function() {
//		var pid = $yt_common.GetQueryString('reimId');
		
		
		//获取当前登录用户信息
		sysCommon.getLoginUserInfo();
		//初始化下拉列表
		$("#priorApproval select").niceSelect();
		//获取页面跳转传输的参数对象
		var requerParameter = $yt_common.GetRequest();
		//获取传输的项目ID
		priorApproval.reimId = requerParameter.advanceId;
		var fun = $yt_common.GetQueryString('fun');
		//给当前页面设置最小高度
		$("#priorApproval").css("min-height", $(window).height() - 32);
		//金额input计算
		priorApproval.events();
		//给全页面赋值事件
		priorApproval.getAdvanceAppInfoDetailByAdvanceAppId(priorApproval.reimId);
		if(fun) {
			//存在执行相应的方法
			$('.label-title.item .title-text').text('事前申请事项信息');
			$('.label-title.cost .title-text').text('事前申请费用信息');
		}
	},
	/**
	 * 日期格式转换
	 * @param {Object} str
	 */
	fmMoney: function(str) {
		return $yt_baseElement.fmMoney(str || '0');
	},
	/**
	 * 日期格式还原
	 * @param {Object} str
	 */
	rmoney: function(str) {
		return $yt_baseElement.rmoney(str || '0');
	},
	/**
	 * 事件处理
	 */
	events: function() {
		var me = this;
		//调用父级关闭当前窗体方法
		$("#closeBtn").click(function() {
			if(window.top == window.self){//不存在父页面
  				window.close();
			 }else{
			 	parent.closeWindow();
			}
		});
		//补领/返还方式  合计金额
		$('.refund-tab-inp').blur(function() {
			var body = $('.amount-table');
			//现金
			var refundCash = 0;
			//支票
			var refundCheck = 0;
			//转账
			var refundTransfer = 0;
			if(body.find('#refundCash').val() != '') {
				refundCash = parseFloat($yt_baseElement.rmoney(body.find('#refundCash').val()));
			}

			if(body.find('#refundCheck').val() != '') {
				refundCheck = parseFloat($yt_baseElement.rmoney(body.find('#refundCheck').val()));
			}

			if(body.find('#refundTransfer').val() != '') {
				refundTransfer = parseFloat($yt_baseElement.rmoney(body.find('#refundTransfer').val()));
			}
			//计算合计金额
			var total = refundCash + refundCheck + refundTransfer;
			//赋值合计金额
			body.find('.total').text($yt_baseElement.fmMoney(total));
		});

		//调用表格行点击事件改变背景色方法
		$('.yt-table tbody').on('click', 'tr', function() {
			//当前对象
			var ts = $(this);
			//所有同级元素
			var trs = ts.siblings();
			//移除样式
			trs.removeClass('yt-table-active');
			//点击行追加样式
			ts.addClass('yt-table-active')
		});
        //打印按钮操作事件
        $("#printBeforeForm").click(function(){
        	var pageUrl = "view/system-sasac/expensesReim/module/print/beforeApplyDetailMain.html?expenditureAppId="+priorApproval.reimId+ '&costType='+priorApproval.detailDatas.advanceCostType;//即将跳转的页面路径
			var goPageUrl = "view/system-sasac/expensesReim/module/approval/beforehandApproveList.html";//左侧菜单指定选中的页面路径
			//调用公用的打开新页面方法传输参数不需要左侧菜单
			$yt_baseElement.openNewPage(2,pageUrl);
        });
        //编辑页面跳转
        $("#beforeEdit").on("click",function(){
			 //即将跳转页面
			 var pageUrl=$yt_option.websit_path+'view/system-sasac/expensesReim/module/busiTripApply/serveApply.html?advanceId='+priorApproval.reimId;
			//调用公用的跳转方法
			window.location.href = pageUrl;
        });
	},
	/**
	 * 
	 *给表单赋值方法 
	 * @param {Object} d 数据集
	 */
	setexaminedata: function(d) {
		//advanceAppId	事前申请Id
		$('#advanceAppId').text(d.advanceAppId);
		//advanceAppNum	事前申请单号
		$('#advanceAppNum').text(d.advanceAppNum);
		//单据编号：#formNum		advanceAppNum
		$("#formNum").text(d.advanceAppNum);
		//申请时间：#fuData		applicantTime
		$("#fuData").text(d.applicantTime);
		//申请人名称:#busiUsers 	applicantUserName
		$('#busiUsers').text(d.applicantUserName);
		//申请人部门:#deptName  applicantUserDeptName
		$('#deptName').text(d.applicantUserDeptName);
		//申请人职务名称:#jobName applicantUserPositionName
		$('#jobName').text(d.applicantUserPositionName == "" ? "--" : d.applicantUserPositionName);
		//电话号码
		$('#telPhone').text(d.applicantUserPhone == "" ? "--" : d.applicantUserPhone);
		//事前申请事由：.advanceAppReason	advanceAppName
		$('.advanceAppReason').text(d.advanceAppName);
		//费用类型名称:.expense-type	advanceCostTypeName
		$('.expense-type').text(d.advanceCostTypeName);
		$('#specialName').text(d.specialName); //specialCode	所属预算项目code
		$('#budgetBalanceAmount').text(d.budgetBalanceAmount ? $yt_baseElement.fmMoney(d.budgetBalanceAmount) + '万元' : '--'); //budgetBalanceAmount	预算剩余额度
		$('#deptBudgetBalanceAmount').text(d.deptBudgetBalanceAmount ? $yt_baseElement.fmMoney(d.deptBudgetBalanceAmount) + '万元' : '--');
		//合计金额：#money4 advanceAmount
		$('#money4,#applySumMoney').text($yt_baseElement.fmMoney(d.advanceAmount || '0'));
		$('#applySumMoneyCap').text(arabiaToChinese(d.advanceAmount + ''));
		//培训项目可用支出金额
		$('#doAdvanceAmount').text($yt_baseElement.fmMoney(d.doAdvanceAmount || '0'));
		//课酬费相关税金
		$('#taxAmount').text($yt_baseElement.fmMoney(d.taxAmount || '0'));
		priorApproval.processInstanceId=d.processInstanceId;
		//获取日志数据
		var flowLogHtm=sysCommon.getCommentByProcessInstanceId(priorApproval.processInstanceId);
		$(".flow-log-div").html(flowLogHtm);
		//项目名称存在时 显示项目名称
		if(d.prjName) {
			$('#prjName').text(d.prjName);
			$('.prj-name-tr').show();
		}
		//判断当前单据状态 是否为培训费
		if(d.advanceCostType=='TRAIN_APPLY'){
			$(".adjustment-module").show(); //显示调整情况概览模块
			$(".adjustment-frequency").text((d.changeInfo.changeNum || '0'));//变更次数
			$(".end-updete-date").text((d.changeInfo.advanceTime || '--'));//最新修改日期
		}else{
			$(".adjustment-module").hide();//隐藏调整情况概览模块
		}
		//调用费用信息数据回显方法
		priorApproval.showCostDetail(d.costData);
		//调用显示附件信息方法
		priorApproval.showCost(d.attList);
	},
	/**
	 * 费用信息数据回显
	 * @param {Object} data
	 */
	showCostDetail: function(data) {
		var me = this;
		//转换金额格式的方法
		var fMoney = $yt_baseElement.fmMoney;
		//接待对象信息集合
		var costReceptionistList = data.costReceptionistList;
		//费用明细信息集合
		var costDetailsList = data.costDetailsList;
		//接待对象信息集合HTML文本
		var receHtml = '';
		if(costReceptionistList && costReceptionistList.length > 0){
			$.each(costReceptionistList, function(i, n) {
				receHtml += '<tr pkId="' + n.receptionObjectId + '" class="" applyName="' + n.name + '" Unit="' + n.jobName + '" Duties="' + n.unitName + '">' +
					'<td><span class="num">1</span></td>' +
					'<td><span class="name-text">' + n.name + '</span></td>' +
					'<td><span class="job-text">' + n.jobName + '</span></td>' +
					'<td><span class="unit-text">' + n.unitName + '</span></td>' +
					'</tr>';
			});
		}
		//替换代码
		$('.msg-list tbody').append(receHtml);
		//重置序号
		//me.resetNum($('.msg-list'));
		//费用明细信息集合HTML文本
		var detaHtml = '';
		//结算方式复选框
		var costDetaClose = $('#paymentList').next().find('.check-label input');
		var totalPaymentList=0;
		if(costDetailsList && costDetailsList.length > 0){
			$.each(costDetailsList, function(i, n) {
				detaHtml += '<tr Tcode="' + n.budgetfeiCode + '" Pcode="' + n.costType + '" budgetProject="' + n.publicServiceProName + '" txtDate="' + n.activityDate + '" place="' + n.placeName + '" costBreakdown="' + n.costTypeName + '" bzy-span="' + n.standardAmount + '" budgetMoney="' + n.activityAmount + '" peoplenum="' + n.peopleNum + '">' +
					'<td><span class="">' + n.publicServiceProName + '</span></td>' +
					'<td><span class="activityDate">' + n.activityDate + '</span></td>' +
					'<td><span class="place-name">' + n.placeName + '</span></td>' +
					'<td><span>' + n.costTypeName + '</span></td>' +
					/*'<td style="text-align: right;"><div class="stan-money" money=' + n.standardAmount + '>' + fMoney(n.standardAmount || '0') + '</div></td>' +*/
					'<td style="text-align: right;"><div class="money" money=' + n.activityAmount + '>' + fMoney(n.activityAmount || '0') + '</div></td>' +
					'<td><span class="people-num">' + n.peopleNum + '</span></td>' +
					'</tr>';
					totalPaymentList += +n.activityAmount
				//结算方式复选框存在并且有选中的值时
				if(costDetaClose.length > 0 && n.setMethod) {
					//设置选中
					costDetaClose.setCheckBoxState('check');
				}
			});
		}
		//追加表格代码
		$('#paymentList tbody .last').before(detaHtml);
		//赋值格式化总金额
		$("#paymentList .total-money").text($yt_baseElement.fmMoney(totalPaymentList));
		//行程明细
		var tripPlanList = data.travelRouteList;
		var tripHtml = '';
		var travelPersonnelsList = [];
		//获取出差人名称
		var getUserNames = function(list) {
			var str = '';
			$.each(list, function(i, n) {
				str += n.travelPersonnelName + (i < list.length - 1 ? '、' : '');
			});
			return str;
		};
		//获取借贷方类型
		var costItem = function(str) {
			switch(str) {
				case '1':
					return '住宿费';
					break;
				case '2':
					return '伙食费';
					break;
				case '3':
					return '市内交通费';
					break;
				default:
					return '';
					break;
			}
		};
		var getCostItemName = function(str) {
			var txt = '';
			if(str) {
				var list = str.split(',');
				$.each(list, function(i, n) {
					if(n) {
						txt += costItem(n) + (i < list.length - 1 ? '、' : '');
					}
				});
				return txt;
			}
			return '';
		};
		//遍历行程明细数据
		$.each(tripPlanList, function(i, n) {
			//1. 把开始时间和结束时间保存
			var dateFrom = new Date(n.startTime);
			var dateTo = new Date(n.endTime);
			//2. 计算时间差
			var diff = dateTo.valueOf() - dateFrom.valueOf();
			//3. 时间差转换为天数
			var diff_day = parseInt(diff / (1000 * 60 * 60 * 24)) + 1;

			tripHtml += '<tr busicode="' + n.travelType + '" usercode="' + n.travelPersonnels + '" rececode="' + n.receptionCostItem + '" >' +
				'<td><input type="hidden" class="hid-user-code" value="' + n.travelPersonnels + '" /> <span class="name">' + n.travelTypeName + '</span></td>' +
				'<td class="sdate">' + n.startTime + '</td>' +
				'<td class="edate">' + n.endTime + '</td>' +
				'<td class="day">' + diff_day + '</td>' +
				'<td class="address" val="' + n.travelAddress + '">' + n.travelAddressName + '</td>' +
				'<td class="uname">' + getUserNames(n.travelPersonnelsList) + '</td>' +
				'<td class="numof">' + n.travelPersonnelsList.length + '</td>' +
				'<td class="reception">' + (getCostItemName(n.receptionCostItem) || "--") + '</td>' +
				'</tr>';
		});
		$('#tripList tbody').html(tripHtml);
		if (data.costCarfareList.length == 0 && data.costHotelList.length == 0 && data.costOtherList.length == 0 && data.costSubsidyList.length == 0) {
		$(".cost-list-model").html('<table style="width:100%"><tr style="border:0px;background-color:#fff !important;"><td align="center"style="border:0px;"><div class="no-data" style="width: 280px;padding:0;margin: 0 auto;"><img src="../../../../../resources-sasac/images/common/no-data.png" alt="" style="padding:10px 0;"></div></td></tr></table>');
		} else{
		//接收城市间交通费
		var costCarfareList = data.costCarfareList;
		var carHtml = '';
		//结算方式复选框
		var costCarfareClose = $('#traffic-list-info').next().find('.check-label input');
		//遍历城市间交通费信息
		$.each(costCarfareList, function(i, n) {
			carHtml += '<tr>' +
				'<td><span>' + n.travelPersonnelName + '</span><input type="hidden" data-val="travelPersonnel" class="hid-traf-users" value="' + n.travelPersonnel + '"/>' +
				'</td><td>' + n.travelPersonnelsDept + '</td>' +
				'<td data-text="goTime">' + n.goTime + '</td><td><input data-val="goAddress" type="hidden" value="' + n.goAddress + '"><span data-text="goAddressName">' + n.goAddressName + '</span></td><td data-text="arrivalTime">' + n.arrivalTime + '</td>' +
				'<td><input data-val="arrivalAddress" type="hidden" value="' + n.arrivalAddress + '"> <span data-text="arrivalAddressName">' + n.arrivalAddressName + '</span></td>' +
				'<td><span data-text="vehicle">' + n.vehicleName + '</span><input type="hidden" class="hid-vehicle" value="' + n.vehicle + '"/><input type="hidden" class="hid-child-code" value=""/></td>' +
				'<td class="font-right money-td" data-text="crafare">' + (n.crafare == "" ? "--" : fMoney(n.crafare || '0')) + '</td>' +
				'<td class="text-overflow-sty" data-text="remarks" title="' + n.remarks + '">' + (n.remarks == '' ? '' : n.remarks) + '</td>' +
				'<td style="display:none;">' +
				'<input type="hidden" class="hid-cost-type" value="0"/>' +
				'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>' +
				'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>' +
				'</td></tr>';
			//结算方式复选框存在并且有选中的值时
			if(costCarfareClose.length > 0 && n.setMethod) {
				//设置选中
				costCarfareClose.setCheckBoxState('check');
			}
		});
		//判断城市间交通费值为空
		if(costCarfareList.length == 0) {
			$('.traffic-cost-model').hide();
			$('#traffic-list-info').hide();
		}
		carHtml += '<tr class="total-last-tr">' +
			'<td><span class="tab-font-blod">合计</span></td><td></td><td></td><td></td><td></td><td></td>' +
			'<td></td>' +
			'<td class="font-right"><span class="tab-font-blod money-sum">0.00</span></td>' +
			'<td></td></tr>';
		$('#traffic-list-info tbody').html(carHtml);
		//调用合计方法
		me.updateMoneySum(0);
		//接收住宿费信息
		var costHotelList = data.costHotelList;
		var hotelHtml = '';
		//结算方式复选框
		var costHotelClose = $('#hotel-list-info').next().find('.check-label input');
		//遍历住宿费数据
		$.each(costHotelList, function(i, n) {
			var avg = n.hotelDays > 0 ? fMoney((+n.hotelExpense / +n.hotelDays) || '0') : n.hotelExpense;
			hotelHtml += '<tr>' +
				'<td><span>' + n.travelPersonnelName + '</span><input type="hidden" data-val="travelPersonnel" value="' + n.travelpersonnel + '"/></td><td>' + n.travelPersonnelsJobLevelName + '</td>' +
				/*'<td data-text="hotelTime">' + $("#hotelDate").val() + '</td>' +*/
				'<td class="font-right" >' + avg + '</td>' +
				'<td risk-code-val="hotelCheckInDate" class="check-in-date"><span class="sdate">' + n.hotelTime + '</span></td>' +
				'<td class="leave-date"><span class="edate">' + n.leaveTime + '</span></td>' +
				'<td data-text="hotelDays">' + n.hotelDays + '</td><td class="font-right money-td" data-text="hotelExpense">' + fMoney(n.hotelExpense || '0') + '</td>' +
				'<td><span data-text="hotelAddressName">' + n.hotelAddressName + '</span><input type="hidden" data-val="hotelAddress" value="' + n.hotelAddress + '"</td>' +
				'<td class="text-overflow-sty" data-text="remarks" title="' + n.remarks + '">' + (n.remarks == '' ? '' : n.remarks) + '</td>' +
				'<td style="display:none;">' +
				'<input type="hidden" class="hid-set-met" data-val="setMethod"/>' +
				'<input type="hidden" class="hid-cost-type" value="1"/>' +
				'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>' +
				'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>' +
				'</td></tr>';
			//结算方式复选框存在并且有选中的值时
			if(costHotelClose.length > 0 && n.setMethod) {
				//设置选中
				costHotelClose.setCheckBoxState('check');
			}
		});
		//判断住宿费集合值为空的时候
		if(costHotelList.length == 0) {
			$('.hotel-list-model').hide();
			$('#hotel-list-info').hide();
		}
		hotelHtml += '<tr class="total-last-tr">' +
			'<td><span class="tab-font-blod">合计</span></td><td></td><td></td><td></td><td></td><td></td>' +
			'<td class="font-right"><span class="tab-font-blod money-sum">0.00</span></td>' +
			'<td></td><td></td></tr>';
		$('#hotel-list-info tbody').html(hotelHtml);
		//调用合计方法
		me.updateMoneySum(1);
		//接口其他费用数据
		var costOtherList = data.costOtherList;
		var otherHtml = '';
		//结算方式复选框
		var costOtherClose = $('#other-list-info').next().find('.check-label input');
		$.each(costOtherList, function(i, n) {
			otherHtml += '<tr>' +
				'<td><span>' + n.costType + '</span><input type="hidden" data-val="costType" value="' + n.costType + '"/></td>' +
				'<td class="font-right money-td" data-text="reimAmount">' + fMoney(n.reimAmount || '0') + '</td>' +
				'<td class="text-overflow-sty" data-text="remarks" title="' + n.remarks + '">' + (n.remarks == "" ? "" : n.remarks) + '</td>' +
				'</tr>';
			//结算方式复选框存在并且有选中的值时
			if(costOtherClose.length > 0 && n.setMethod) {
				//设置选中
				costOtherClose.setCheckBoxState('check');
			}
		});
		if(costOtherList.length == 0) {
			$('.other-cost-model').hide();
			$('#other-list-info').hide();
		}
		otherHtml += '<tr class="total-last-tr">' +
			'<td><span class="tab-font-blod">合计</span></td>' +
			'<td class="font-right"><span class="tab-font-blod money-sum">0.00</span></td>' +
			'<td></td></tr>';
		$('#other-list-info tbody').html(otherHtml);
		//调用合计方法
		me.updateMoneySum(2);
		//costSubsidyList	补助明细
		var costSubsidyList = data.costSubsidyList;
		var subHtml = '';
		var totalFood = 0;
		var totalTraffic = 0;
		$.each(costSubsidyList, function(i, n) {
			subHtml += '<tr class="' + n.travelPersonnel + '" code="' + n.travelPersonnel + '"><td><div class="user" code="' + n.travelPersonnel + '">' + n.travelPersonnelName + '</div></td><td><div class="lv">' + n.travelPersonnelsDept + '</div></td><td><div class="subsidy-num">' + n.subsidyDays + '</div></td><td><div style="text-align:right;" class="food">' + fMoney(n.subsidyFoodAmount || '0') + '</div></td><td><div  style="text-align:right;" class="traffic">' + fMoney(n.carfare || '0') + '</div></td></tr>';
			totalFood += +n.subsidyFoodAmount;
			totalTraffic += +n.carfare;
		});
		if (costSubsidyList.length == 0) {
			
			$('.subsidy-model').hide();
		}
		subHtml += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + $yt_baseElement.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + $yt_baseElement.fmMoney(totalTraffic) + '</td></tr>';
		$('#subsidy-list-info tbody').html(subHtml);

		}
		
		//师资-培训信息json
//		me.setTrainApplyInfoList(data.trainApplyInfoList);''
		if (data.costTrainApplyInfoList.length==0 && data.costTeachersFoodApplyInfoList.length==0 && data.costTeachersLectureApplyInfoList.length==0 && data.costTeachersTravelApplyInfoList.length==0 && data.costTeachersHotelApplyInfoList.length==0) {
			$(".hide-div").html('<table style="width:100%"><tr style="border:0px;background-color:#fff !important;"><td align="center"style="border:0px;"><div class="no-data" style="width: 280px;padding:0;margin: 0 auto;">' +
			'<img src="../../../../../resources-sasac/images/common/no-data.png" alt="" style="padding:10px 0;">' +
			'</div></td></tr></table>');
		
		} else{
		//costTrainApplyInfoList	师资-培训费json
		me.setCostTrainApplyInfoList(data.costTrainApplyInfoList);
		me.setCostPredictInfoList(data.costPredictInfoList);
		//costTeachersFoodApplyInfoList	师资-伙食费json
		me.setCostTeachersFoodApplyInfoList(data.costTeachersFoodApplyInfoList);
		//costTeachersLectureApplyInfoList	师资-讲课费json
		me.setCostTeachersLectureApplyInfoList(data.costTeachersLectureApplyInfoList);
		//costTeachersTravelApplyInfoList	师资-城市间交通费json
		me.setCostTeachersTravelApplyInfoList(data.costTeachersTravelApplyInfoList);
		//costTeachersHotelApplyInfoList	师资-住宿费 json
		me.setCostTeachersHotelApplyInfoList(data.costTeachersHotelApplyInfoList);
		//costNormalList	普通报销-费用明细/普通付款-付款明细 json
		me.setCostNormalList(data.costNormalList);
		}
		//teacherApplyInfoList	师资-讲师信息json
		me.setTeacherApplyInfoList(data.teacherApplyInfoList);
		//meetingList 会议详情json
		me.setMeetingList(data.meetingList);
		me.setMeetingCostList(data.meetingCostList);
		me.setTrainApplyInfoList(data.trainApplyInfoList);
	},
	showCost: function(list) {
		var me = this;
		if(list.length > 0){
			//图片显示拼接字符串
			var receHtml = '';
			//图片显示路径
			var src = '';
			$.each(list, function(i, n) {
				//获取图片格式
				var imgType = n.attName.split('.');
				if(imgType.length > 1 && (imgType[1] == 'png' || imgType[1] == 'jpeg' || imgType[1] == 'bmp' || imgType[1] == 'jpg')) {
					//拼接图片路径
					src = $yt_option.base_path + 'fileUpDownload/download?pkId=' + n.attId + '&isDownload=false';
					receHtml += '<div fid="' + n.attId + '" class="li-div"><span class="file-name" >' + n.attName + '</span><label class="file-dw">下载</label><label class="file-pv">预览<img src="' + src + '" ></label></div>';
				} else {
					receHtml += '<div fid="' + n.attId + '" class="li-div"><span class="file-name" >' + n.attName + '</span><label class="file-dw">下载</label><label class="file-pvno">预览</label></div>';
				}
			});
			//替换代码
			$('#receHtml').append(receHtml);
			//图片下载
			$('#receHtml .file-dw').on('click', function() {
				var id = $(this).parent().attr('fid');
				window.location.href = $yt_option.base_path + 'fileUpDownload/download?pkId=' + id + '&isDownload=true';
			});
			//图片预览
			$('#receHtml .file-pv img').showImg();
		} else {
			$('#receHtml').html('<div fid="" class="li-div"><span class="file-name" >暂无附件</span></div>');
		}

	},
	/**
	 * 1.1.4.5根据事前申请Id获取报销申请详细信息
	 * @param {Object} data
	 */
	getAdvanceAppInfoDetailByAdvanceAppId: function(advanceAppId) {
		var me = this;
		$.ajax({
			type: "post",
			url: "sz/advanceApp/getAdvanceAppInfoDetailByAdvanceAppId",
			async: true,
			data: {
				advanceAppId: advanceAppId
			},
			success: function(data) {
				if(data.flag == 0) {
					var d = data.data;
					priorApproval.detailDatas = data.data;
					//判断当前节点
					if(d.taskKey == 'activitiEndTask') {
						//申请人填报 对应key值: activitiStartTask
						//工作流最后一步审批操作对应key值: activitiEndTask
						//清除审批人的必填验证
						$('#approve-users').attr("validform", "{isNull:false,msg:'请选择审批人'}")
					} else {
						//修改提交按钮文本
						$('#approveSubBtn').text('提交');
						//$('#approve-users').attr("validform","{isNull:true,msg:'请选择审批人'}")
					}
					priorApproval.saveData = d;
					//判断是否有返回的页面操作方法名称
					if(d.jsFun) {
						//存在执行相应的方法
						me[d.jsFun]();
					}
					if(d.jsFun!='showTrainFun'){
						$("#preTaxDiv").hide()
					}
					//调用获取审批流程数据方法
					sysCommon.getApproveFlowData("SZ_ADVANCE_APP", d.processInstanceId);
					//调用赋值数据方法
					priorApproval.setexaminedata(d);
					//判断流程状态是否是退回的
					if(sysCommon.processState){
						if(sysCommon.processState[0].operationState == '待申请人再次提交'){
							//将编辑按钮显示
							$("#beforeEdit").show();
							//关闭按钮隐藏
							$("#closeBtn").hide();
						}
					}
					//隐藏部门或中心可用余额
					if(data.data.validateType == "UNIT"){
						$("#deptBudgetBalanceAmount").hide();
						$("#deptBudgetBalanceAmount").prev().hide();
						$("#deptBudgetBalanceAmount").next().hide();
					}
					if(data.data.validateType == "DEPT"){
						$("#budgetBalanceAmount").hide();
						$("#budgetBalanceAmount").prev().hide();
					}
				}
			}
		});
	},
	getSaveData: function() {
		var d = priorApproval.saveData,
			costData = {};
		costData = d.costData;
		d.opintion = $("#operateMsg").val(); //		opintion	审批意见
		//		nextCode	操作流程代码
		d.nextCode = $("#operate-flow option:selected").val();
		//dealingWithPeople	下一步操作人code
		d.dealingWithPeople = $("#approve-users option:selected").val();
		d.advanceAttIdStr = priorApproval.getFileList(); //		advanceAttIdStr	附件idstr
		d.costData = typeof(costData) == 'string' ? costData : JSON.stringify(costData); //		costData	费用申请json串
		d.advanceAppReason = d.advanceAppName; //		advanceAppReason	事前申请事由
		d.costType = d.advanceCostType; //		costType	费用类型
		return d;
	},
	getFileList: function() {
		var str = '';
		//获取所有的文件列表
		var list = $('#receHtml p');
		$.each(list, function(i, n) {
			str += $(n).attr('fid') + (i < list.length - 1 ? ',' : '');
		});
		return str;
	},
	/**
	 * 1.1.4.1事前申请信息：提交表单数据
	 * @param {Object} data
	 */
	submitAdvanceAppInfo: function(d) {
		$.ajax({
			type: "post",
			url: "sz/advanceApp/submitAdvanceAppInfo",
			async: true,
			data: d,
			success: function(data) {

				if(data.flag == 0) {
					//成功跳转到事前申请审批列表页面
					window.location.href = $yt_option.websit_path + 'view/system-sasac/expensesReim/module/approval/beforehandApproveList.html';

				}
				$yt_alert_Model.prompt(data.message);
			}
		});
	},
	/**
	 * 显示业务员招待费
	 */
	showBusinessFun: function() {
		$('.index-main-div').html('');
		//提示文字隐藏
		$('.qtip-text-div').hide();
		//其他区域隐藏
		$('.mod-div').hide();
		//其他信息显示
		$('.dottom-div').show();
		$('.grod-div').show();
		//显示可支出金额字段
		$('#doAdvanceBox').hide();
		//加载区域页面
		sysCommon.loadingWord('view/system-sasac/expensesReim/module/reimApply/hospitalitySpendingDetail.html');
		$('#SQtext1').text('事前申请事项信息');
		$('#SQtext2').text('事前申请费用信息');
	},
	/**
	 * 一般费用
	 */
	showGeneralFun: function() {
		$('.index-main-div').html('');
		//提示文字隐藏
		$('.qtip-text-div').hide();
		//其他区域隐藏
		$('.mod-div').hide();
		//其他信息显示
		$('.dottom-div').show();
		$('.grod-div').show();
		//相关区域显示
		$('.general-div').show();
		//显示可支出金额字段
		$('#doAdvanceBox').hide();
	},
	/**
	 * 差旅
	 */
	showTravelFun: function() {
		$('.index-main-div').html('');
		//提示文字隐藏
		$('.qtip-text-div').hide();
		//其他区域隐藏
		$('.mod-div').hide();
		//其他信息显示
		$('.dottom-div').show();
		$('.grod-div').show();
		//相关区域显示
		$('.index-main-div').show();
		//显示可支出金额字段
		$('#doAdvanceBox').hide();
		//加载区域页面
		sysCommon.loadingWord('view/system-sasac/expensesReim/module/reimApply/travelSpendingDetails.html');
		$('#SQtext1').text('事前申请事项信息');
		$('#SQtext2').text('事前申请费用信息');
	},
	/**
	 * 培训
	 */
	showTrainFun: function() {
		//清空原有代码
		$('.index-main-div').html('');
		//提示文字隐藏
		$('.qtip-text-div').hide();
		//其他区域隐藏
		$('.mod-div').hide();
		//其他信息显示
		$('.dottom-div').show();
		$('.grod-div').show();
		//相关区域显示
		$('.index-main-div').show();
		//显示可支出金额字段
		$('#doAdvanceBox').show();
		//加载区域页面
		sysCommon.loadingWord('view/system-sasac/expensesReim/module/busiTripApply/trainApproval.html');
		$('#SQtext1').text('事前申请事项信息');
		$('#SQtext2').text('事前申请费用信息');
	},
	/**
	 * 会议
	 */
	showMettingFun: function() {
		//提示文字隐藏
		$('.qtip-text-div').hide();
		//其他区域隐藏
		$('.mod-div').hide();
		//其他信息显示
		$('.dottom-div').show();
		$('.grod-div').show();
		//显示可支出金额字段
		$('#doAdvanceBox').hide();
		//加载区域页面
		sysCommon.loadingWord('view/system-sasac/expensesReim/module/beforehand/meetingCostApplyDetails.html');
		$('#SQtext1').text('事前申请事项信息');
		$('#SQtext2').text('事前申请费用信息');
	},
	/**
	 * 
	 * 表格金额合计更新
	 * 
	 * @param {Object} thisTab费用表格标识0交通费1.住宿费2.其他费用3补助
	 * 
	 * 
	 */
	updateMoneySum: function(thisTab) {
		var me = this;
		//thisTab参数0交通费1.住宿费2.其他费用3补助
		var moenySum = 0.00;
		if(thisTab == 0) {
			$("#traffic-list-info tbody .money-td").each(function(i, n) {
				moenySum += parseFloat($yt_baseElement.rmoney($(n).text()));
			});
			moenySum = $yt_baseElement.fmMoney(moenySum);
			if(moenySum != undefined && $yt_baseElement.rmoney(moenySum) > 0) {
				$("#traffic-list-info tbody .money-sum").text(moenySum);
			} else {
				$("#traffic-list-info tbody .money-sum").text("0.00");
			}
		}
		if(thisTab == 1) {
			$("#hotel-list-info tbody .money-td").each(function(i, n) {
				moenySum += parseFloat($yt_baseElement.rmoney($(n).text()));
			});
			moenySum = $yt_baseElement.fmMoney(moenySum);
			if(moenySum != undefined && $yt_baseElement.rmoney(moenySum) > 0) {
				$("#hotel-list-info tbody .money-sum").text(moenySum);
			} else {
				$("#hotel-list-info tbody .money-sum").text("0.00");
			}
		}
		if(thisTab == 2) {
			$("#other-list-info tbody .money-td").each(function(i, n) {
				moenySum += parseFloat($yt_baseElement.rmoney($(n).text()));
			});
			moenySum = $yt_baseElement.fmMoney(moenySum);
			if(moenySum != undefined && $yt_baseElement.rmoney(moenySum) > 0) {
				$("#other-list-info tbody .money-sum").text(moenySum);
			} else {
				$("#other-list-info tbody .money-sum").text("0.00");
			}
		}
		if(thisTab == 3) {
			$("#subsidy-list-info tbody .food-money").each(function(i, n) {
				moenySum += parseFloat($yt_baseElement.rmoney($(n).text()));
			});
			moenySum = $yt_baseElement.fmMoney(moenySum);
			if(moenySum != undefined && $yt_baseElement.rmoney(moenySum) > 0) {
				$("#subsidy-list-info tbody .money-sum").text(moenySum);
			} else {
				$("#subsidy-list-info tbody .money-sum").text("0.00");
			}
			var cityMoneySum = 0.00;
			$("#subsidy-list-info tbody .city-money").each(function(i, n) {
				cityMoneySum += parseFloat($yt_baseElement.rmoney($(n).text()));
			});
			cityMoneySum = $yt_baseElement.fmMoney(cityMoneySum);
			if(cityMoneySum != undefined && $yt_baseElement.rmoney(cityMoneySum) > 0) {
				$("#subsidy-list-info tbody .city-money-td").text(cityMoneySum);
			} else {
				$("#subsidy-list-info tbody .city-money-td").text("0.00");
			}
		}
		//调用刷新申请总预算金额的方法
		//me.updateApplyMeonySum();
	},
	/**
	 * 
	 * 刷新申请预算总金额方法
	 * 
	 */
	updateApplyMeonySum: function() {
		var sumMoney = 0;
		$(".cost-list-model table .money-sum").each(function(i, n) {
			sumMoney += $yt_baseElement.rmoney($(n).text());
		});
		$(".cost-list-model table .city-money-td").each(function(i, n) {
			sumMoney += $yt_baseElement.rmoney($(n).text());
		});
		sumMoney = $yt_baseElement.fmMoney(sumMoney);
		$(".count-val-num").text(sumMoney).attr('num', sumMoney);
		//判断当前页面是否包含报销申请页面中,补领金额中的报销金额
		if($("body").find("#reimPrice")) {
			$("#reimPrice").text(sumMoney);
			//计算补领金额
			var loanPrice = $("#loanCost").text();
			var replPrice = $yt_baseElement.rmoney(sumMoney) - parseFloat(loanPrice);
			replPrice = $yt_baseElement.fmMoney(replPrice);
			$("#givePrice").text(replPrice);
		}
		if(sumMoney != null && sumMoney != undefined && $yt_baseElement.rmoney(sumMoney) > 0) {
			var sumMoneyLower = arabiaToChinese(sumMoney);
			$(".count-val").text(sumMoneyLower);
		} else {
			$(".count-val-num").text("0.00");
		}
	},

	setTrainApplyInfoList : function(list){
		if (list.length>0) {
		//培训类型
		$("#trainType").text(list[0].trainTypeName);
		//培训名称
		$("#regionDesignation").text(list[0].regionDesignation);
		//培训地点中文
		$("#regionName").text(list[0].regionName);
		//报到时间
		$("#reportTime").text(list[0].reportTime);
		//结束时间	
		$("#endTime").text(list[0].endTime);
		//培训天数
		$("#trainDays").text(list[0].trainDays);
		//培训人数
		$("#trainOfNum").text(list[0].trainOfNum);
		//工作人员数量
		$("#workerNum").text(list[0].workerNum);
		$('#approvaNum').text(list[0].approvaNum);
		$('#chargeStandard').text(list[0].chargeStandard)
		}
		
	},
	setMeetingList : function(list){
		if (list.length>0) {
			//会议分类
		$("#meetTypeName").text(list[0].meetTypeName);
		//会议名称
		$("#meetName").text(list[0].meetName);
		//会议地点中文
		$("#meetAddress").text(list[0].meetAddress);
		//会议开始时间
		$("#meetStartTime").text(list[0].meetStartTime);
		//会议结束时间	
		$("#meetEndTime").text(list[0].meetEndTime);
		//会期
		$("#meetDays").text(list[0].meetDays);
		//参会人数
		$("#meetOfNum").text(list[0].meetOfNum);
		//工作人员数量
		$("#meetWorkerNum").text(list[0].meetWorkerNum);
		}
	},
	setMeetingCostList : function(list){
		if (list.length>0) {
		//住宿费
		$("#meetHotel").text($yt_baseElement.fmMoney(list[0].meetHotel || '0'));
		//伙食费
		$("#meetFood").text($yt_baseElement.fmMoney(list[0].meetFood || '0'));
		//其他费用
		$("#meetOther").text($yt_baseElement.fmMoney(list[0].meetOther || '0'));
		//费用合计	
		$("#meetAmount").text($yt_baseElement.fmMoney(list[0].meetAmount || '0'));
		//人均日均费用金额
		$("#meetAverage").text($yt_baseElement.fmMoney(list[0].meetAverage || '0'));
		}else{
			//住宿费
		$("#meetHotel").text('--');
		//伙食费
		$("#meetFood").text('--');
		//其他费用
		$("#meetOther").text('--');
		//费用合计
		$("#meetAmount").text('--');
		//人均日均费用金额
		$("#meetAverage").text('--');
		}
		
	},
	/**
	 * teacherApplyInfoList	师资-讲师信息json
	 * 设置 师资讲师信息列表数据
	 * @param {Object} list
	 */
	setTeacherApplyInfoList: function(list) {
		var html = '';
		$.each(list, function(i, n) {
			html += '<tr>' +
				'<td class="lecturerName"><input type="hidden" class="lectureId" value="' + n.lecturerId + '"><span>' + n.lecturerName + '</span></td>' +
				'<td class="professional">' + (n.lecturerTitleName || '--') + '</td>' +
				'<td class="level">' + (n.lecturerLevelName || '--') + '</td>' +
				'<td style="display:none"><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
				'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td></tr>';
		});
		//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + priorApproval.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + priorApproval.fmMoney(totalTraffic) + '</td></tr>';
		$('#lecturerTable tbody').html(html);
	},
	/**
	 * costTrainApplyInfoList	师资-培训费json
	 * 设置 师资培训费列表数据
	 * @param {Object} list
	 */
	setCostTrainApplyInfoList: function(list) {
		var html = '';
		var total = 0;
		if (list!=0) {
			$.each(list, function(i, n) {
			var standard='';
		var trainOfNum='';
		var trainDays='';
				if(n.standard!='0'){
					standard=$yt_baseElement.fmMoney(n.standard);
				}
				if(n.trainOfNum!='0'){
					trainOfNum=n.trainOfNum;
				}
				if(n.trainDays!='0'){
					trainDays=n.trainDays;
				}
			html += '<tr pid="' + n.trainAppId + '" trainType="' + n.trainType + '">' +
					'<td class="trainTypeName">' + n.trainTypeName + '</td>' +
					'<td class="standard">' + standard + '</td>' +
					'<td class="trainOfNum">' + trainOfNum + '</td>' +
					'<td class="trainDays">' + trainDays + '</td>' +
					'<td class="moneyText averageMoney">' + n.averageMoney + '</td>' +
					'<td class="trainingPerNumber">' +  (n.remark || "") + '</td>' +
					'</tr>';
					total += +n.averageMoney;
		});
		//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + priorApproval.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + priorApproval.fmMoney(totalTraffic) + '</td></tr>';
		$('#trainingFeeTable tbody .last').before(html);
		$('#trainingFeeTable .costTotal').text(priorApproval.fmMoney(total));
		} else{
			$('#trainingFeeTable').hide();
			$('.other-title-train').hide();
		}
		
	},
		setCostPredictInfoList: function(list) {
		var html = '';
		var costTotal = 0;
		var costTotalAfter=0;
		$.each(list, function(i, n) {
			html += '<tr  pid=""><td class="cost-name">' + n.predictName + '</td><td class="moneyText predict-standard-money">' + ($yt_baseElement.fmMoney(n.predictStandardMoney)) + '</td><td class="predict-people-num">' + n.predictPeopleNum + '</td><td class="moneyText predict-smallplan-money">' + ($yt_baseElement.fmMoney(n.averageMoney)) + '</td><td class="special-instruct">' + n.remark + '</td></tr>';
			costTotal += n.predictStandardMoney*n.predictPeopleNum;
			costTotalAfter+=n.averageMoney;
		});
		html += '<tr class="last"><td>合计</td><td></td><td></td><td class="moneyText costTotal">' + $yt_baseElement.fmMoney(costTotalAfter) + '</td><td></td></tr>';
		$('#predictCostTable tbody').html(html);
$("#preTaxAllMoney").text($yt_baseElement.fmMoney(costTotal));
$("#afterTaxAllMoney").text($yt_baseElement.fmMoney(costTotalAfter));
		if(list.length == 0) {
			$('.train-money').hide();
			$('.train-money').parent().hide();
			$('#predictCostTable,.other-title-train').hide();
		}
	},
	/**
	 * costTeachersFoodApplyInfoList	师资-伙食费json
	 * 设置 师资伙食费列表
	 * @param {Object} list
	 */
	setCostTeachersFoodApplyInfoList: function(list) {
		var html = '';
		var total = 0;
		if (list!=0) {
			$.each(list, function(i, n) {
			html += '<tr pid="' + n.foodId + '">' +
				'<td><input type="hidden" class="lectureId" value="' + n.lecturerId + '">' + n.lecturerName + '</td>' +
				'<td class="avg moneyText">' + priorApproval.fmMoney(n.averageMoney) + '</td>' +
				'<td class="day">' + n.foodOfDays + '</td>' +
				'<td class="moneyText sum-pay">' + priorApproval.fmMoney(n.foodAmount) + '</td>' +
				'<td class="dec">' + (n.remarks || "") + '</td>' +
				'<td style="display:none"><input type="hidden" class="popM" value="4"/>' +
				'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
				'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
				'</tr>';
			total += +n.foodAmount;
		});
		//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + priorApproval.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + priorApproval.fmMoney(totalTraffic) + '</td></tr>';
		$('#dietFeeTable tbody .end-tr').before(html);
		$('#dietFeeTable tbody .costTotal').text(priorApproval.fmMoney(total));
		}else{
			$('#dietFeeTable').hide();
			$('.food-title').hide();
		}
	},
	/**
	 * //costTeachersLectureApplyInfoList	师资-讲课费json
	 * 设置 师资讲课费列表
	 * @param {Object} list
	 */
	setCostTeachersLectureApplyInfoList: function(list) {
		var html = '';
		var total = 0;
		if (list!=0) {
			$.each(list, function(i, n) {
			html += '<tr pid="' + n.teachersLectureId + '">' +
				'<td class="uname"><input type="hidden" class="lectureId" value="' + n.lecturerId + '">' + n.lecturerName + '</td>' +
				'<td class="holder">' + (n.lecturerTitleName || '--') + '</td>' +
				'<td class="hour">' + n.teachingHours + '</td>' +
				'<td class="cname">' + (n.courseName || '--') + '</td>' +
				'<td class="moneyText sum-pay">' + priorApproval.fmMoney(n.perTaxAmount) + '</td>' +
				'<td class="moneyText after">' + priorApproval.fmMoney(n.afterTaxAmount) + '</td>' +
				'<td class="moneyText avg">' + priorApproval.fmMoney(n.averageMoney) + '</td>' +
				'<td style="display:none"><input type="hidden" class="popM" value="1"/>' +
				'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
				'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
				'</td></tr>';
			total += +n.perTaxAmount;
		});
		//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + priorApproval.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + priorApproval.fmMoney(totalTraffic) + '</td></tr>';
		$('#lectureFeeTable tbody .end-tr').before(html);
		$('#lectureFeeTable tbody .costTotal').text(priorApproval.fmMoney(total));
		}else{
			$('#lectureFeeTable').hide();
			$('.lecture-title').hide();
		}
	},
	/**
	 * //costTeachersTravelApplyInfoList	师资-城市间交通费json
	 * 设置 师资城市间交通费列表
	 * @param {Object} list
	 */
	setCostTeachersTravelApplyInfoList: function(list) {
		var html = '';
		var total = 0;
		if (list!=0) {
			$.each(list, function(i, n) {
			html += '<tr pid="' + n.teachersTravelId + '">' +
				'<td class="uname"><input type="hidden" class="lectureId" value="' + n.lecturerId + '">' + n.lecturerName + '</td>' +
				'<td class="ulv">' + (n.lecturerLevelName || '--') + '</td>' +
				'<td class="sdate">' + n.goTime + '</td>' +
				'<td class="edate">' + n.arrivalTime + '</td>' +
				'<td class="sadd"><input type="hidden" class="scode" value="' + n.goAddress + '">' + n.goAddressName + '</td>' +
				'<td class="eadd"><input type="hidden" class="ecode" value="' + n.arrivalAddress + '">' + n.arrivalAddressName + '</td>' +
				'<td class="tname"><input type="hidden" class="tool" value="' + n.vehicle + '">' + n.vehicleName + '</td>' +
				'<td class="moneyText sum-pay">' + priorApproval.fmMoney(n.carfare) + '</td>' +
				'<td class="dec">' + (n.remarks == '' ? '' : n.remarks) + '</td>' +
				'<td  style="display:none"><input type="hidden" class="popM" value="2"/>' +
				'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
				'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
				'</td></tr>';
			total += +n.carfare;
		});
		//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + priorApproval.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + priorApproval.fmMoney(totalTraffic) + '</td></tr>';
		$('#carFeeTable tbody .end-tr').before(html);
		$('#carFeeTable tbody .costTotal').text(priorApproval.fmMoney(total));
		}else{
			$('#carFeeTable').hide();
			$('.traffic-title').hide();
		}
	},
	/**
	 * //costTeachersHotelApplyInfoList	师资-住宿费 json
	 * 设置 师资住宿费列表
	 * @param {Object} list
	 */
	setCostTeachersHotelApplyInfoList: function(list) {
		var html = '';
		var total = 0;
		if (list!=0) {
			$.each(list, function(i, n) {
			html += '<tr pid="' + n.teachersHotelId + '">' +
				'<td class="name"><input type="hidden" class="lectureId" value="' + n.lecturerId + '">' + n.lecturerName + '</td>' +
				'<td class="sdate">' + n.startTime + '</td>' +
				'<td class="edate">' + n.endTime + '</td>' +
				'<td class="moneyText avg">' + priorApproval.fmMoney(n.averageMoney) + '</td>' +
				'<td class="day">' + n.hotelDays + '</td>' +
				'<td class="moneyText sum-pay">' + priorApproval.fmMoney(n.hotelExpense) + '</td>' +
				'<td class="dec">' + (n.remarks || "") + '</td>' +
				'<td style="display:none"><input type="hidden" class="popM" value="3"/>' +
				'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
				'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
				'</td></tr>';
			total += +n.hotelExpense;
		});
		//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + priorApproval.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + priorApproval.fmMoney(totalTraffic) + '</td></tr>';
		$('#hotelFeeTable tbody .end-tr').before(html);
		$('#hotelFeeTable tbody .costTotal').text(priorApproval.fmMoney(total));
		}else{
			$('#hotelFeeTable').hide();
			$('.accommodation-title').hide();
		}
	},
	/**
	 * //costNormalList	普通报销-费用明细/普通付款-付款明细 json
	 * 设置普通报销列表数据
	 * @param {Object} list
	 */
	setCostNormalList: function(list) {},
	
}
$(function() {
	//调用初始化方法
	priorApproval.init();
});