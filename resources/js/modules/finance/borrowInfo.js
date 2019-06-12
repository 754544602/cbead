var borrowInfo = {
	//初始化方法
	init: function() {
		$(".process-instance-id").val("");
		var num = $yt_common.GetQueryString("num");
		//判断显示开票信息输入框
		if(num == 1 || num == 3 || num == 4 || num == 2) {
			if(num == 4) {
				borrowInfo.getBorrowInfo();
				$(".ticket-info").css("display", "inherit");
				$(".submit-budget").off().click(function() {
					borrowInfo.updateInvoicing();
				});
			} else if(num == 3) {
				var billingInformation = $yt_common.GetQueryString("billingInformation");
				$(".textarea-billing-information").val(decodeURI(decodeURI(billingInformation)));
				$(".ticket-info").css("display", "inherit");
				$(".submit-budget").off().click(function() {
					borrowInfo.updateInvoicing();
				});
			} else if(num == 2) { //发票借用审批详情页面跳转传过来的参数为2
				borrowInfo.getBorrowInfo();
			} else { //我的申请发票借用详情页面跳转传过来的参数为1
				borrowInfo.getBorrowInfo();
			}
		} else {
			borrowInfo.getBorrowInfoEditable();
			$('select').niceSelect();
		}
		//点击返回
		$('.page-return-btn').on('click', function() {
			if(num == 3 || num == 4) {
				var first = "borrow";
				window.location.href = "applyQueryList.html?first=" + first;
				//隐藏减免列表
				$('.reduce-list').hide();
				//显示发票列表
				$('.borrow-list').show();
				$yt_baseElement.showLoading();
			} else if(num == 1) {
				var first = "borrow";
				window.location.href = "borrowList.html?first=" + first;
				//隐藏减免列表
				$('.reduce-list').hide();
				//显示发票列表
				$('.borrow-list').show();
				$yt_baseElement.showLoading();
			} else {
				var backType = $yt_common.GetQueryString("backType");
				if (backType == "f1" || backType == "f2" || backType == "j1" || backType == "j2") {
					window.location.href = "myApproveList.html?backType="+backType+"&apprOrInf="+22;
				}
			}

		});
		//取消按钮
		$(".btn-off").click(function() {
			if(num == 3 || num == 4) {
				var first = "borrow";
				window.location.href = "applyQueryList.html?first=" + first;
				//隐藏减免列表
				$('.reduce-list').hide();
				//显示发票列表
				$('.borrow-list').show();
				$yt_baseElement.showLoading();
			} else {
				var first = "borrow";
				window.location.href = "borrowList.html?first=" + first;
				//隐藏减免列表
				$('.reduce-list').hide();
				//显示发票列表
				$('.borrow-list').show();
				$yt_baseElement.showLoading();
			}

		})
		//点击弹窗选择所属项目
		$('.borrow-search-btn').click(function() {
			var me = this;
			//显示选择所属项目弹出框
			$(".select-teacher-div").show();
			//查询选择所属项目列表
			borrowInfo.getProjectInfo();

			//模糊查询
			/*$('.teacher-search-img').click(function() {
				borrowInfo.getProjectInfo();
			});*/
			//选择所属项目渲染到列表
			$('.select-teacher-sure-btn').click(function() {
				//声明存储选中状态项目的数组
				var borrowListArr = [];
				//遍历选中状态行
				$('.addBorrow-tbody').find('label input[type="checkbox"]:checked').each(function() {
					//获取选中状态行的数据
					var borrowList = $(this).parent().parent().parent().data('list');
					//存储数据到外部数组
					borrowListArr.push(borrowList);
				});
				var htmlTbody = $('.project-tbody')
				var htmlTr = "";
				//遍历得到外部数组渲染到列表
				$.each(borrowListArr, function(i, v) {
					htmlTr += '<tr>' +
						'<td class="projectCode">' + v.projectCode + '</td>' +
						'<td style="text-align: left";>' + v.projectName + '</td>' +
						'<td class="project-type">' + (borrowInfo.projectTypeInfo(v.projectType)) + '</td>' +
						'<td>' + v.projectHead + '</td>' +
						'<td>' + v.startDate + '</td>' +
						'<td>' + v.endDate + '</td>' +
						'</tr>';
				});

				//影藏弹出窗
				$(".yt-edit-alert,#heard-nav-bak").hide();
				$("#pop-modle-alert").hide();
				htmlTbody.html(htmlTr);

			});
			//取消按钮
			$('.select-teacher-canel-btn').click(function() {
				$(".yt-edit-alert,#heard-nav-bak").hide();
				$("#pop-modle-alert").hide();
			});
		});
	},
	//获取一条信息
	getBorrowInfo: function() {
		var pkId = $yt_common.GetQueryString("pkId");
		var applicationInvoice;
		var money;
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/invoicing/getBeanById",
			async: true,
			data: {
				pkId: pkId
			},
			objName: 'data',
			success: function(data) {
				//hide
				$yt_baseElement.hideLoading();
				if(data.flag == 0) {
					$('.create-user').text(data.data.createUser);
					$('.dept-name').text(data.data.deptName);
					$('.create-time-string').text(data.data.createTimeString);
					//开票金额添加千位分隔符
					applicationInvoice = data.data.applicationInvoice;
					money = applicationInvoice.toFixed(2)+"";//保留两位小数
					money = money.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g,'$1,');
					$('.application-invoice').text(money);
					$('.invoice-org').text(data.data.invoiceOrg);
					$('.invoice-type').text((borrowInfo.borrowTypeInfo(data.data.invoiceType)));
					$('.org-name').text(data.data.orgName);
					$('.tax-number').text(data.data.taxNumber);
					$('.address').text(data.data.address);
					$('.telephone').text(data.data.telephone);
					$('.registered-bank').text(data.data.registeredBank);
					$('.account').text(data.data.account);
					$('.invoice-reason').text(data.data.invoiceReason);
					$('.work-flaw-state').text(data.data.workFlawState);
					var projectJSON = $.parseJSON(data.data.projects)
					var htmlTr = "";
					var htmlTbody = $(".project-tbody");
					htmlTbody.html("");
					var num = 0;
					//遍历所属项目
					if(projectJSON.length > 0) {
						$.each(projectJSON, function(i, v) {
							htmlTr = '<tr>' +
								'<td style = "text-align: center;" class="projectCode">' + v.projectCode + '</td>' +
								'<td style = "text-align: left;">' + v.projectName + '</td>' +
								'<td style = "text-align: center;">' + (borrowInfo.projectTypeInfo(v.projectType)) + '</td>' +
								'<td style = "text-align: center;">' + v.projectHead + '</td>' +
								'<td style = "text-align: center;">' + v.startDate + '</td>' +
								'<td style = "text-align: center;">' + v.endDate + '</td>' +
								'</tr>';
							htmlTbody.append(htmlTr);
						});
					} else {
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="5" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						htmlTbody.html(htmlTr);
					}
					//遍历审批流程信息
					//流程
					var flowLog = data.data.flowLog;
					var middleStepHtml;
					var length = flowLog.length;
					if(flowLog != "" && flowLog.length > 0) {
						$('.approve-info-title').show();
						$('.approve-info').show();
						$.each(flowLog, function(i, v) {
							if(i > 0) {
								$('.middle-step-box-div').css("border-left", "8px solid #686F99");
							}
							var order = length - i;
							var comonLi = '<li class="operate-view-box-li" style="background-color: #EDEBEC">' +
												'<div class="operate-view-title-li" style="color:#686F99">操作意见：</div>' +
												'<div class="operate-view-text-li middle-step-comment">' + v.comment + '</div>' +
											'</li>';
							if(i == flowLog.length-1){//流程第一步没有意见框
								comonLi = "";
							}
							middleStepHtml = '<div>' +
								'<div>' +
								'<div class="number-name-box">' +
								'<span class="number-box-span middle-step-order middle-a-index" >' + order + '</span>' +
								'<span class="name-box-span middle-step-userName middle-a-index" >' + v.userName + '</span>' +
								'<img src="../../resources/images/open/openFlow.png" class="order-img" />' +
								'</div>' +
								'</div>' +
								'<div class="middle-step-box-div" style="border: none;">' +
								'<ul class="middle-step-box-ul">' +
									'<li style="height: 30px;">' +
										'<span  class="middle-step-taskName view-taskName-span"  style="float: left;background-color:#686F99;">' + v.operationState + '</span>' +
									'</li>' +
									'<li class="view-time-li middle-step-commentTime"style="width:360px;text-align:right;white-space:nowrap;color:#686F99;"  >' + v.commentTime + '</li>' +
									comonLi+
								'</ul>' +
								'</div>' +
								'</div>';
							$('.first-step').before(middleStepHtml);
						});
					}
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}
			}
		});
	},
	//获取所属项目列表
	getProjectInfo: function() {
		var me = this;
		var selectParam = $('.borrow-search-input').val();
		$('.borrow-page').pageInfo({
			async: true,
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "finance/invoicing/lookForAllProject", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam: selectParam,
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			before: function() {
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.addBorrow-tbody');
					var htmlTr = '';
					if(data.data.rows.length > 0) {
						htmlTbody.html("");
						$.each(data.data.rows, function(i, v) {
							htmlTr = '<tr>' +
								'<td>' + '<label class="check-label yt-checkbox select-teacher-checkbox"><input type="checkbox" name="test" class="select-teacher-pkId" value="' + v.projectCode + '"/></label>' + '</td>' +
								'<td class="projectCode">' + v.projectCode + '</td>' +
								'<td style="text-align: left;">' + v.projectName + '</td>' +
								'<td class="project-type">' + (me.projectTypeInfo(v.projectType)) + '</td>' +
								'<td>' + v.projectHead + '</td>' +
								'<td>' + v.startDate + '</td>' +
								'<td>' + v.endDate + '</td>' +
								'</tr>';
							htmlTr = $(htmlTr).data('list', v);
							htmlTbody.append(htmlTr);
						});
						borrowInfo.projectCodeInfo();

					} else {
						htmlTbody.html("");
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="7" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						htmlTbody.append(htmlTr);
					}
					$('.addBorrow-tbody').off('click').on('click','tr',function(){
						if($(this).hasClass('yt-table-active')){
							$(this).removeClass('yt-table-active');
							$(this).find('input[type=checkbox]').setCheckBoxState('uncheck');
						}else{
							$(this).addClass('yt-table-active');
							$(this).find('input[type=checkbox]').setCheckBoxState('check');
						}
						if($(this).parents("table").find("tbody input[type='checkbox']").length != $(this).parents("table").find("tbody input[type='checkbox']:checked").length) {
							$(this).parents("table").find(".check-all").setCheckBoxState("uncheck");
						} else {
							$(this).parents("table").find(".check-all").setCheckBoxState("check");
						}
						return false;
					})
					//计算弹出框位置
					$yt_alert_Model.setFiexBoxHeight($(".select-teacher-div .yt-edit-alert-main"));
					$yt_alert_Model.getDivPosition($(".select-teacher-div"));
					$yt_model_drag.modelDragEvent($(".select-teacher-div .yt-edit-alert-title"));
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
	//获取页面已有项目code
	projectCodeInfo: function() {
		$(".project-tbody").find('td.projectCode').each(function(i, v) {
			var lastProjectCode = $(this).text();
			$('.addBorrow-tbody').find('td.projectCode').each(function(i, v) {
				var firstProjectCode = $(this).text();
				if(firstProjectCode == lastProjectCode) {
					$(this).parents("tr").find("td input[type='checkbox']").setCheckBoxState("check");
				}
			});
		});

	},
	//获取一条信息
	getBorrowInfoEditable: function() {
		var pkId = $yt_common.GetQueryString("pkId");
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/invoicing/getBeanById",
			async: true,
			data: {
				pkId: pkId
			},
			objName: 'data',
			success: function(data) {
				//hide
				$yt_baseElement.hideLoading();
				if(data.flag == 0) {
					if (data.data == null) {
						return false;
					};
					if (data.data.createUser == null) {
						data.data.createUser = "";
					};
					$(".process-instance-id").val(data.data.processInstanceId);
					$('.create-user').text(data.data.createUser);
					$('.dept-name').text(data.data.deptName);
					$('.create-time-string').text(data.data.createTimeString);
					$('.application-invoice').val(data.data.applicationInvoice);
					if(data.data.invoiceModel == 1){
						$("#agree").setRadioState("check");
					}else{
						$("#disagree").setRadioState("check");
					}
					$('.invoice-org').val(data.data.invoiceOrg);
					$('.invoice-type').setSelectVal(data.data.invoiceType);
					if (data.data.invoiceType == 1 || data.data.invoiceType == "") {//普通发票
						if (data.data.invoiceModel == 1) {
							$(".bill-name,.bill-num").show();
							$(".org-name,.tax-number").attr("validform","{isNull:true,blurFlag:true,msg:'请输入名称'}");
						}else{
							$(".bill-name").show();
							$(".org-name").attr("validform","{isNull:true,blurFlag:true,msg:'请输入名称'}");
						}
					}else{
						$(".bill-name,.bill-num,.address-span,.telephone-span,.bank-span,.account-span").show();
						$(".org-name,.tax-number,.address,.telephone,.registered-bank,.account").attr("validform","{isNull:true,blurFlag:true,msg:'请输入名称'}");
					}
					$('.org-name').val(data.data.orgName);
					$('.tax-number').val(data.data.taxNumber);
					$('.address').val(data.data.address);
					$('.telephone').val(data.data.telephone);
					$('.registered-bank').val(data.data.registeredBank);
					$('.account').val(data.data.account);
					$('.dealing-with-people').setSelectVal(data.data.dealingWithPeople)
					$('.invoice-reason').val(data.data.invoiceReason);
					$('.work-flaw-state').text(data.data.workFlawState);
					if(data.data.workFlawState == "草稿"){
						$(".applay-date-tr").hide();
					}
					var projectJSON = $.parseJSON(data.data.projects)
					var htmlTr = "";
					var htmlTbody = $(".project-tbody");
					htmlTbody.html("");
					var num = 0;
					//遍历所属项目
					
					if(projectJSON.length > 0) {
						$.each(projectJSON, function(i, v) {
							htmlTr = '<tr>' +
								'<td style = "text-align: center;" class="projectCode">' + v.projectCode + '</td>' +
								'<td style = "text-align: left;">' + v.projectName + '</td>' +
								'<td style = "text-align: center;">' + (borrowInfo.projectTypeInfo(v.projectType)) + '</td>' +
								'<td style = "text-align: center;">' + v.projectHead + '</td>' +
								'<td style = "text-align: center;">' + v.startDate + '</td>' +
								'<td style = "text-align: center;">' + v.endDate + '</td>' +
								'</tr>';
							htmlTbody.append(htmlTr);
						});
					} else {
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="5" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						htmlTbody.html(htmlTr);
					}
					//遍历审批流程信息
					//流程
					var flowLog = data.data.flowLog;
					var middleStepHtml;
					var length = flowLog.length;
					if(flowLog != "" && flowLog.length > 0) {
						$('.approve-info-title').show();
						$('.approve-info').show();
						$.each(flowLog, function(i, v) {
							if(i > 0) {
								$('.middle-step-box-div').css("border-left", "8px solid #686F99");
							}
							var order = length - i;
							middleStepHtml = '<div>' +
								'<div>' +
								'<div class="number-name-box">' +
								'<span class="number-box-span middle-step-order middle-a-index" >' + order + '</span>' +
								'<span class="name-box-span middle-step-userName middle-a-index" >' + v.userName + '</span>' +
								'<img src="../../resources/images/open/openFlow.png" class="order-img" />' +
								'</div>' +
								'</div>' +
								'<div class="middle-step-box-div" style="border: none;">' +
								'<ul class="middle-step-box-ul">' +
								'<li style="height: 30px;">' +
								'<span  class="middle-step-taskName view-taskName-span"  style="float: left;background-color:#686F99;">' + v.operationState + '</span>' +
								'</li>' +
								'<li class="view-time-li middle-step-commentTime"style="width: 360px;text-align:right;white-space:nowrap;color:#686F99;"  >' + v.commentTime + '</li>' +
								'<li class="operate-view-box-li" style="background-color: #EDEBEC">' +
								'<div class="operate-view-title-li" style="color:#686F99">操作意见：</div>' +
								'<div class="operate-view-text-li middle-step-comment">' + v.comment + '</div>' +
								'</li>' +
								'</ul>' +
								'</div>' +
								'</div>';
							$('.first-step').before(middleStepHtml);
						});
					}
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}
			}
		});
	},
	updateInvoicing: function() {
		var pkId = $yt_common.GetQueryString("pkId");
		var billingInformation = $(".textarea-billing-information").val();
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/invoicing/updateInvoicing",
			async: true,
			data: {
				pkId: pkId,
				billingInformation: decodeURI(decodeURI(billingInformation))
			},
			objName: 'data',
			success: function(data) {
				$yt_baseElement.hideLoading();
				if(data.flag == 0) {
					$yt_alert_Model.prompt("开票成功");
					$yt_baseElement.hideLoading();

					var first = "borrow";
					window.location.href = "applyQueryList.html?first=" + first;
					//隐藏减免列表
					$('.reduce-list').hide();
					//显示发票列表
					$('.borrow-list').show();
					$yt_baseElement.showLoading();
				} else {
					$yt_alert_Model.prompt("开票失败");
				}

			}
		});

	}, //项目类型设置
	borrowTypeInfo: function(code) {
		if(code == 1) {
			return "普通发票";
		} else if(code == 2) {
			return "增值税发票";
		} else {
			return '';
		};
	},
}
$(function() {
	//初始化方法
	borrowInfo.init();

});