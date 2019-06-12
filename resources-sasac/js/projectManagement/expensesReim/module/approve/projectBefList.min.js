var pro = {
	init : function() {
		pro.switcher();
		pro.searchList();
		pro.events()
	},
	events : function() {
		$('.pending')
				.on(
						'click',
						'.apprv-btn',
						function() {
							var thisTr = $(this).parents("tr");
							var advanceAppId = thisTr.find(
									".advanceAppIdUpdate").val();
							var appId = thisTr.find('.advance-app-id').val();
							var taskKey = $(this).attr('taskKey');
							if (taskKey == 'activitiStartTask') {
								var pageUrl = "view/projectManagement-sasac/expensesReim/module/busiTripApply/projectServeApply.html?appId="
										+ advanceAppId;
								window.location.href = $yt_option.websit_path
										+ pageUrl
							} else {
								var pageUrl = "view/projectManagement-sasac/expensesReim/module/busiTripApply/projectServeExamine.html?appId="
										+ advanceAppId;
								window.location.href = $yt_option.websit_path
										+ pageUrl
							}
						});
		$('.pending')
				.on(
						'click',
						'.to-detail',
						function() {
							var thisTr = $(this).parents("tr");
							var advanceAppId = thisTr.find(".advance-app-id")
									.val();
							var processInstanceId = thisTr.find(
									".processInstanceId").val();
							var pageUrl = "view/projectManagement-sasac/expensesReim/module/beforehand/beforeApplyDetail.html?advanceId="
									+ advanceAppId;
							$yt_baseElement.openNewPage(2, pageUrl)
						});
		$('.pending')
				.on(
						'click',
						'.to-update-detail',
						function() {
							var thisTr = $(this).parents("tr");
							var advanceAppId = thisTr.find(
									".advanceAppIdUpdate").val();
							var processInstanceId = thisTr.find(
									".processInstanceId").val();
							var pageUrl = "view/projectManagement-sasac/expensesReim/module/busiTripApply/projectServeDetails.html?advanceAppId="
									+ advanceAppId;
							$yt_baseElement.openNewPage(2, pageUrl)
						});
		$('.search').on('keydown', function() {
			if ($('.search').val() != '' || $('.search').val() != null) {
				$('.clearImg').show()
			}
		});
		$('.clearImg').on('click', function() {
			$('.search').val('');
			$(this).hide();
			pro.searchList()
		});
		$("#resetBtn").off().on("click", function() {
			$('.search').val('');
			$(".clearImg").hide();
			pro.searchList()
		});
		$("#searchBtn").off().on("click", function() {
			pro.searchList()
		});
		$(".end-table").on(
				'click',
				'.process-state',
				function() {
					var processInstanceId = $(this).parents("tr").find(
							".processInstanceId").val();
					sysCommon.processStatePop(processInstanceId)
				});
		$("#printUpdateBtn")
				.click(
						function() {
							var selTrLen = $(".tab-div .tab-content:visible tbody tr.yt-table-active").length;
							var thisTrData = $(
									".tab-div .tab-content:visible tbody tr.yt-table-active")
									.data("dataStr");
							if (selTrLen == 0) {
								$yt_alert_Model.prompt("请选择一行数据进行操作")
							} else {
								var pageUrl = "view/projectManagement-sasac/expensesReim/module/print/bugetAdjustApplyForm.html?expenditureAppId="
										+ thisTrData.advanceAppId
										+ '&costType='
										+ thisTrData.advanceCostType;
								$yt_baseElement.openNewPage(2, pageUrl)
							}
						})
	},
	switcher : function() {
		$('.tab-li').off().on(
				'click',
				function() {
					var index = $(this).index();
					$(this).addClass('active-li').siblings('.tab-li')
							.removeClass('active-li');
					if (index == 1 || index == 2) {
						$('.tab-content').eq(1).css("display", 'block')
								.addClass("check").siblings('.tab-content')
								.hide().removeClass("check")
					} else {
						$('.tab-content').eq(index).css("display", 'block')
								.addClass("check").siblings('.tab-content')
								.hide().removeClass("check")
					}
					if (index == 2) {
						$('.add-bill').show();
						$('.to-budget-dia').show();
						$('.bill-record').show()
					} else {
						$('.add-bill').hide();
						$('.to-budget-dia').hide();
						$('.bill-record').hide()
					}
					if (index == 0) {
						$(".dis").show()
					} else {
						$(".dis").hide()
					}
					pro.searchList()
				})
	},
	searchList : function() {
		var status = $('.active-li input').val();
		if (status == 'WF_SUSPENDING_QUERY_SQL_PARAMS') {
			pro.getListByPage(status)
		} else if (status == 'WF_SOLVED_QUERY_SQL_PARAMS') {
			pro.getProcessingAndFinishList(status)
		} else if (status == 'WF_COMPLETED_QUERY_SQL_PARAMS') {
			pro.getProcessingAndFinishList(status)
		} else if (status == 'WF_DRAFTS_QUERY_SQL_PARAMS') {
		}
	},
	getListByPage : function(stateCode) {
		var keyWord = $('.search').val();
		$('.page1')
				.pageInfo(
						{
							pageIndex : 1,
							pageNum : 15,
							pageSize : 10,
							url : 'sz/advanceAppUpdate/getUserAdvanceUpdateAppInfoWFListToPageByParams',
							data : {
								queryStateParams : stateCode,
								queryParams : keyWord
							},
							objName : 'data',
							success : function(data) {
								var datas = data.data.rows;
								var thisTbody = $('.wait-table .yt-tbody');
								thisTbody.empty();
								var trStr = "";
								if (data.flag == 0) {
									if (datas.length > 0) {
										$('.page1').show();
										$
												.each(
														datas,
														function(i, n) {
															trStr += '<tr><td><a class="yt-link to-update-detail">'
																	+ n.advanceAppNumUpdate
																	+ '</a><input type="hidden" class="advanceAppIdUpdate" value="'
																	+ n.advanceAppId
																	+ '"/><input type="hidden" class="advance-app-id" value="'
																	+ n.advanceAppIdUpdate
																	+ '"/><input type="hidden" class="processInstanceId" value="'
																	+ n.processInstanceId
																	+ '"/></td><td><a class="yt-link to-detail">'
																	+ n.advanceAppNum
																	+ '</a></td><td style="text-align: left;">'
																	+ (n.advanceAppName == "" ? "--"
																			: n.advanceAppName)
																	+ '</td><td style="text-align: right;">'
																	+ (n.changeAmount == "" ? $yt_baseElement
																			.fmMoney(0)
																			: $yt_baseElement
																					.fmMoney(n.changeAmount))
																	+ '</td>'
																	+ '<td>'
																	+ n.applicantUserName
																	+ '</td><td><span>'
																	+ n.applicantDept
																	+ '</span></td><td>'
																	+ n.stagnationTime
																	+ '</td>';
															trStr += '<td>'
																	+ (stateCode != 'WF_SUSPENDING_QUERY_SQL_PARAMS' ? ''
																			: '<a class="yt-link apprv-btn" taskKey="'
																					+ n.taskKey
																					+ '">'
																					+ (n.taskKey == 'activitiStartTask' ? '处理'
																							: '审批')
																					+ '</a><span class="center-line">|</span>')
																	+ '<a class="yt-link log-mod">日志</a></td></tr>';
															trStr = $(trStr)
																	.data(
																			"dataStr",
																			n);
															thisTbody
																	.append(trStr)
														});
										sysCommon.initQtip($(".log-mod"));
									} else {
										thisTbody.empty();
										$('.page1').hide();
										thisTbody.append(pro.noDataTrStr(8))
									}
								} else {
									$yt_alert_Model.prompt(data.message);
									$('.page1').hide();
									thisTbody.empty();
									thisTbody.append(pro.noDataTrStr(8))
								}
							},
							isSelPageNum : true
						})
	},
	getProcessingAndFinishList : function(stateCode) {
		var keyWord = $('.search').val();
		$('.page2')
				.pageInfo(
						{
							pageIndex : 1,
							pageNum : 15,
							pageSize : 10,
							url : 'sz/advanceAppUpdate/getUserAdvanceUpdateAppInfoWFListToPageByParams',
							data : {
								queryStateParams : stateCode,
								queryParams : keyWord
							},
							objName : 'data',
							success : function(data) {
								var datas = data.data.rows;
								var thisTbody = $('.end-table .yt-tbody');
								thisTbody.empty();
								var trStr = "";
								if (data.flag == 0) {
									if (datas.length > 0) {
										$('.page2').show();
										$
												.each(
														datas,
														function(i, n) {
															trStr += '<tr><td><a class="yt-link to-update-detail">'
																	+ n.advanceAppNumUpdate
																	+ '</a><input type="hidden" class="advance-app-id" value="'
																	+ n.advanceAppIdUpdate
																	+ '"/><input type="hidden" class="advanceAppIdUpdate" value="'
																	+ n.advanceAppId
																	+ '"/><input type="hidden" class="processInstanceId" value="'
																	+ n.processInstanceId
																	+ '"/></td><td><a class="yt-link to-detail">'
																	+ n.advanceAppNum
																	+ '</a></td><td style="text-align:left;">'
																	+ (n.advanceAppName == "" ? "--"
																			: n.advanceAppName)
																	+ '</td><td style="text-align: right;">'
																	+ (n.changeAmount == "" ? $yt_baseElement
																			.fmMoney(0)
																			: $yt_baseElement
																					.fmMoney(n.changeAmount))
																	+ '</td>'
																	+ '<td>'
																	+ n.applicantUserName
																	+ '</td><td><span>'
																	+ n.applicantDept
																	+ '</span></td>';
															if (stateCode == 'WF_COMPLETED_QUERY_SQL_PARAMS') {
																$(
																		".applicant-time-th")
																		.show();
																trStr += '<td>'
																		+ n.applicantTime
																		+ '</td>'
															} else {
																$(
																		".applicant-time-th")
																		.hide();
															}
															if (stateCode == 'WF_SOLVED_QUERY_SQL_PARAMS') {
																$(
																		".process-state-th")
																		.show();
																trStr += '<td style="text-align:left;"><span class="yt-link process-state">'
																		+ n.nodeNowState
																		+ '</span></td>';
															} else {
																$(
																		".process-state-th")
																		.hide();
															}
															trStr += '<td>'
																	+ (stateCode != 'WF_SUSPENDING_QUERY_SQL_PARAMS' ? ''
																			: '<a class="yt-link apprv-btn" taskKey="'
																					+ n.taskKey
																					+ '">'
																					+ (n.taskKey == 'activitiStartTask' ? '处理'
																							: '审批')
																					+ '</a><span class="center-line">|</span>')
																	+ '<a class="yt-link log-mod">日志</a></td></tr>';
															trStr = $(trStr)
																	.data(
																			"dataStr",
																			n);
															thisTbody
																	.append(trStr)
														});
										sysCommon.initQtip($(".log-mod"));
									} else {
										$('.page2').hide();
										thisTbody.empty();
										thisTbody.append(pro.noDataTrStr(8))
									}
								}
							},
							isSelPageNum : false
						})
	},
	noDataTrStr : function(trNum) {
		var noDataStr = '<tr style="border:0px;background-color:#fff !important;"><td  colspan="'
				+ trNum
				+ '" align="center"style="border:0px;"><div class="no-data" style="width: 280px;margin: 0 auto;"><img src="../../../../../resources-sasac/images/common/no-data.png" alt="" style="padding: 35px 0 20px;"></div></td></tr>';
		return noDataStr
	}
};
$(function() {
	pro.init();
	$("#projectBefList").css("min-height", $(window).height() - 12)
});