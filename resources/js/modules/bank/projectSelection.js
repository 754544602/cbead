var projectSelection = {
	//初始化方法
	init: function() {
		$(".reconciliation-state-hid").val("3");
		if($yt_common.GetQueryString("wtType") == "wtType"){
			$(".surecheck").show();
		}else{
			$(".surecheck").hide();
		}
		//调用获取列表数据方法
		projectSelection.getProjectSelectionInf();
		projectSelection.getCompanyList();
//		$(".project-selection-more").click(function() {
//			$(".student-hide").show();
//			$(".project-student-td").attr("colspan", "16");
//		});
		var projectName = $yt_common.GetQueryString("projectName");
		
		$(".project-name").text(decodeURI(decodeURI(projectName)));
		//返回按钮
		$(".page-return-btn").click(function() {
//			var backIndex = $yt_common.GetQueryString("backIndex");
//			if (backIndex == 1) {//返回到教务下的我的项目对账
//				window.location.href = "../bill/projectBillInfo.html"; 
//			} else{//返回到财务下项目对账
//				window.location.href = "projectBillList.html"; 
//			}
			window.history.back();
		});
		$(".out-file").click(function(){
			projectSelection.getExportAssets();
		});
		//checkBox按钮事件
		$(".check-box-load input").change(function() {
			//0:未入账 1:已入账  2:都不查询，3都查询
			if($('.check-sure input[type="checkbox"]').is(':checked')) {//已入账被选中
				if($('.check-cancel input[type="checkbox"]').is(':checked')) {//未入账被选中
					$(".reconciliation-state-hid").val("3");
				} else {
					$(".reconciliation-state-hid").val("1");
				}
			} else {
				if($('.check-cancel input[type="checkbox"]').is(':checked')) {
					$(".reconciliation-state-hid").val("0");
				}else{
					$(".reconciliation-state-hid").val("2");
				}
			}
			projectSelection.getProjectSelectionInf();
		});
		//模糊查询
		$(".search-btn").click(function() {
			projectSelection.getProjectSelectionInf();
		})
		//点击学员姓名查看详情
		$('.project-student-tbody').off().on('click', '.real-name-inf', function() {
			var traineeId = $(this).parent().find(".trainee-id-info").val();
			//var studentList = $('.yt-table-active').data('studentList');
			//var traineeId = studentList.traineeId;
			var headImg = new Image();
			//获取班级编号
			var projectCode = $yt_common.GetQueryString("projectCode");
			//显示整体框架loading的方法
			$yt_baseElement.showLoading();
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "class/trainee/getTraineeDetails",
				data: {
					traineeId: traineeId,
					projectId: projectCode
				},
				async: true,
				success: function(data) {
					var htmlBody = $('.student-details-form .student-details-train-record tbody');
					var htmlTrs = '';
					htmlBody.empty();
					if(data.flag == 0) {
						if(data.data != null){
							detailsMsg = data.data;
							detailsMsg.checkInDate = detailsMsg.checkInDate.split(" ")[0];
							//性别
							if(detailsMsg.gender == 1) {
								detailsMsg.gender = "男";
							} else {
								detailsMsg.gender = "女";
							}
							//发票类型
							if(detailsMsg.invoiceType == 0) {
								detailsMsg.invoiceType = "暂不开票";
							} else if(detailsMsg.invoiceType == 1) {
								detailsMsg.invoiceType = "普通发票";
							} else {
								detailsMsg.invoiceType = "增值税发票";
							}
							//报到状态
							if(detailsMsg.checkInState == 0) {
								detailsMsg.checkInState = "未报到";
							} else {
								detailsMsg.checkInState = "已报到";
							}
							//缴费状态
							if(detailsMsg.paymentState == 0) {
								detailsMsg.paymentState = "未缴费";
							} else {
								detailsMsg.paymentState = "已缴费";
							}
							//开票状态
							if(detailsMsg.isOrderNum == 0) {
								detailsMsg.isOrderNum = "未开票";
							} else {
								detailsMsg.isOrderNum = "已开票";
							}
							$('.student-details-form .cont-edit-test').setDatas(detailsMsg);
	
							console.log("学员头像", detailsMsg.headPortraitUrl);
							if(detailsMsg.headPortrait != "") {
								headImg.src = detailsMsg.headPortraitUrl;
								headImg.onload = function() {
									$('.student-details-img').attr('src', headImg.src);
									$('.student-details-img').jqthumb({
										width: 89,
										height: 130
									});
								};
							} else {
								$('.student-details-img').attr('src', '../../resources/images/classStudent/student-picture.png');
								$('.student-details-img').jqthumb({
									width: 89,
									height: 130
								});
							}
							//添加培训记录
							$.each(detailsMsg.trainList, function(i, b) {
								htmlTrs = '<tr>' +
									'<td>' + b.projectCode + '</td>' +
									'<td>' + b.projectName + '</td>' +
									'<td>' + b.startDate + '</td>' +
									'<td>' + b.projectHead + '</td>' +
									'<td>' + b.certificateNo + '</td>' +
									'</tr>';
								htmlBody.append(htmlTrs);
							});
							//隐藏整体框架loading的方法
						}else{
							//headImg.onload = function() {
								$('.student-details-img').attr('src', '../../resources/images/classStudent/student-picture.png');
								$('.student-details-img').jqthumb({
									width: 89,
									height: 130
								});
							//}
						}
						$yt_baseElement.hideLoading();
					}
				}
			});
			/** 
			 * 显示编辑弹出框和显示顶部隐藏蒙层 
			 */
			$(".student-details-form").show();
			/** 
			 * 调用算取div显示位置方法 
			 */
			$yt_alert_Model.setFiexBoxHeight($(".student-details-form .yt-edit-alert-main"));
			$yt_alert_Model.getDivPosition($(".student-details-form"));
			/* 
			 * 调用支持拖拽的方法 
			 */
			$yt_model_drag.modelDragEvent($(".student-details-form .yt-edit-alert-title"));
			/** 
			 * 点击取消方法 
			 */
			$('.student-details-form .yt-eidt-model-bottom .yt-model-sure-btn').off().on("click", function() {
				//隐藏页面中自定义的表单内容  
				$(".student-details-form").hide();
			});
		});
	},

	/**
	 * 单位支付信息
	 */
	getCompanyList: function() {
		$yt_baseElement.showLoading();
		var projectCode = $yt_common.GetQueryString("projectCode");
		$.ajax({
			async: true,
			url: $yt_option.base_path + "finance/settlement/getDetailedList", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				projectCode: projectCode
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.project-company-tbody').empty();
					var htmlTr = '';
					var htmlPlan = '';
					var trainingExpenseNegotiatedPriceSum = 0;
					var traineeNegotiatedPriceSum = 0;
					var quarterageNegotiatedPriceSum = 0;
					var mealFeeNegotiatedPriceSum = 0;
					var incidentalSum = 0;
					var should = 0;
					var already = 0;
					var account = 0;
					if(data.data.settlementGroupDetails.length > 0) {
						$.each(data.data.settlementGroupDetails, function(i, v) {
							htmlTr += '<tr>' +
								'<td>' + v.groupName + '</td>' +
								'<td style="text-align:right;word-wrap:break-word;">' + $yt_baseElement.fmMoney(v.trainingExpenseNegotiatedPrice) + '</td>' +
								'<td style="text-align:right;word-wrap:break-word;">' + $yt_baseElement.fmMoney(v.traineeNegotiatedPrice) + '</td>' +
								'<td style="text-align:right;word-wrap:break-word;">' + $yt_baseElement.fmMoney(v.quarterageNegotiatedPrice) + '</td>' +
								'<td style="text-align:right;word-wrap:break-word;">' + $yt_baseElement.fmMoney(v.mealFeeNegotiatedPrice) + '</td>' +
								'<td style="text-align:right;word-wrap:break-word;">' + $yt_baseElement.fmMoney(v.incidental) + '</td>' +
								'<td class="should" style="text-align:right;">' + Number(v.amountReceivable).toFixed(2) + '</td>' +
								'<td class="already" style="text-align:right;">' + Number(v.netReceipts).toFixed(2) + '</td>' +
								'<td class="account" style="text-align:right;">' + Number(v.uncollected).toFixed(2) + '</td>' +
								'<td class="account">' + (projectSelection.confirmFunc(v.reconciliationState)) + '</td>' +
								'</tr>';
							trainingExpenseNegotiatedPriceSum+=v.trainingExpenseNegotiatedPrice;
							traineeNegotiatedPriceSum+=v.traineeNegotiatedPrice;
							quarterageNegotiatedPriceSum+=v.quarterageNegotiatedPrice;
							mealFeeNegotiatedPriceSum+=v.mealFeeNegotiatedPrice;
							incidentalSum+=v.incidental;
							should += v.amountReceivable;
							already += v.netReceipts;
							account += v.uncollected;
						});
						htmlTbody.append(htmlTr);
						htmlPlan += '<tr>' +
							'<td style="font-weight: bold;">' + "小计" + '</td>' +
							'<td style="text-align:right;font-weight: bold;">' + $yt_baseElement.fmMoney(trainingExpenseNegotiatedPriceSum) + '</td>' +
							'<td style="text-align:right;font-weight: bold;">' + $yt_baseElement.fmMoney(traineeNegotiatedPriceSum) + '</td>' +
							'<td style="text-align:right;font-weight: bold;">' + $yt_baseElement.fmMoney(quarterageNegotiatedPriceSum) + '</td>' +
							'<td style="text-align:right;font-weight: bold;">' + $yt_baseElement.fmMoney(mealFeeNegotiatedPriceSum) + '</td>' +
							'<td style="text-align:right;font-weight: bold;">' + $yt_baseElement.fmMoney(incidentalSum) + '</td>' +
							'<td style="text-align:right;font-weight: bold;">' + Number(should).toFixed(2) + '</td>' +
							'<td style="text-align:right;font-weight: bold;">' + Number(already).toFixed(2) + '</td>' +
							'<td style="text-align:right;font-weight: bold;">' + Number(account).toFixed(2) + '</td>' +
							'<td class=""></td>' +
							'</tr>';
						htmlTbody.append(htmlPlan)
					} else {
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="5" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						htmlTbody.append(htmlTr)
					}
					htmlTbody.find('tr').off('click');
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  

		});
	},
	/**
	 * 学员费用详情
	 */
	getProjectSelectionInf: function() {
		var reconciliationState = $(".reconciliation-state-hid").val();
		var selectParam = $(".selectParam").val();
		var projectCode = $yt_common.GetQueryString("projectCode");
		$('.project-student-page').pageInfo({
			async: true,
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "finance/settlement/getDetailedPersonalList", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				reconciliationState:reconciliationState,
				projectCode: projectCode,
				selectParam: selectParam,
				trainingExpenseStart: "",
				trainingExpenseEnd: "",
				traineeNegotiatedPriceStart: "",
				traineeNegotiatedPriceEnd: "",
				quarterageStart: "",
				quarterageEnd: "",
				mealFeeStart: "",
				mealFeeEnd: "",
				otherChargesStart: "",
				otherChargesEnd: "",
				uncollectedStart: "",
				uncollectedEnd: "",
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			before: function() {
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.project-student-tbody');
					var htmlTr = '';
					if(data.data.rows.length > 0) {
						$('.project-student-page').show();
						$.each(data.data.rows, function(i, v) {
							htmlTr += '<tr>' +
								'<td>' + v.groupNum + '</td>' +
								'<td><input type="hidden" class="trainee-id-info" value="'+v.traineeId+'" /><a class="real-name-inf" style="color: #3c4687;">' + v.realName + '</a></td>' +
								'<td style="text-align:left">' + v.groupOrgName + '</td>' +
								'<td>' + v.roomNumber + '</td>' +
								'<td style="text-align:right">' + Number(v.trainingExpenseNegotiatedPrice).toFixed(2) + '</td>' +
								'<td style="text-align:right">' + Number(v.traineeNegotiatedPrice).toFixed(2) + '</td>' +
								'<td style="text-align:right">' + Number(v.quarterageNegotiatedPrice).toFixed(2) + '</td>' +
								'<td style="text-align:right">' + Number(v.mealFeeNegotiatedPrice).toFixed(2) + '</td>' +
								'<td style="text-align:right">' + Number(v.incidental).toFixed(2) + '</td>' +
								'<td style="text-align:right">' + Number(v.smallPlan).toFixed(2) + '</td>' +
								'<td style="text-align:right">' + Number(v.cash).toFixed(2) + '</td>' +
								'<td style="text-align:right">' + Number(v.creditCard).toFixed(2) + '</td>' +
								'<td style="text-align:right">' + Number(v.wireTransfer).toFixed(2) + '</td>' +
								'<td style="text-align:right">' + Number(v.moneyTotal).toFixed(2) + '</td>' +
								'<td class="student-hide"style="text-align:right;">' + Number(v.uncollected).toFixed(2) + '</td>' +
								'<td class="student-hide" style="">' + projectSelection.confirmFunc(v.reconciliationState) + '</td>' +
								'</tr>';
						});
					} else {
						$('.project-student-page').hide();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td class="project-student-td" colspan="14" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
					}
					htmlTbody.html(htmlTr);
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	//项目类型设置
	projectTypeInfo: function(code) {
		if(code == 1) {
			return "计划";
		} else if(code == 2) {
			return "委托";
		} else if(code == 3) {
			return "选学";
		} else if(code == 4) {
			return "中组部调训";
		} else if(code == 5) {
			return "国资委调训";
		} else {
			return '';
		};
	},
	//入账确认
	confirmFunc: function(confirm) {
		if(confirm == 1) {
			return "已入账";
		} else if(confirm == 0) {
			return "未入账";
		}
	},
	//导出功能
	getExportAssets:function(){
		var projectCode = $yt_common.GetQueryString("projectCode");
		var selectParam = $(".selectParam").val();
		$.ajaxDownloadFile({
			url:$yt_option.base_path+"finance/projectStatement/exportProjectStatement",
			data:{
				projectCode:projectCode,
				selectParam:selectParam
			},
			success: function(data) {
				if(data.flag != 0){
					$yt_alert_Model.prompt("导出失败！");
				}
			}
		});
	}
}
$(function() {
	//初始化方法
	projectSelection.init();

});