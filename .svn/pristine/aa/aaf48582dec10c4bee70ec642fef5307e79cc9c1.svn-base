var pro = {
	init: function() {
		pro.switcher();
		pro.searchList();
		pro.events();
	},
	events: function() {
		//审批处理点击事件
		$('.pending').on('click', '.apprv-btn', function() {
			var thisTr=$(this).parents("tr");
			//获取变更单据ID
			var advanceAppId=thisTr.find(".advanceAppIdUpdate").val();
			//获取事前申请单ID
			var appId = thisTr.find('.advance-app-id').val();
			//获取流程节点
			var taskKey = $(this).attr('taskKey');
			//判断流程节点状态
			if(taskKey == 'activitiStartTask') {
				//修改
				var pageUrl = "view/system-sasac/expensesReim/module/busiTripApply/projectServeApply.html?appId=" + advanceAppId; //即将跳转的页面路径
				window.location.href = $yt_option.websit_path + pageUrl;
			} else {
				//审批
				var pageUrl = "view/system-sasac/expensesReim/module/busiTripApply/projectServeExamine.html?appId=" + advanceAppId; //即将跳转的页面路径
				window.location.href = $yt_option.websit_path + pageUrl;
			}

		});
		//跳转详情页面
		$('.pending').on('click', '.to-detail', function() {
			var thisTr=$(this).parents("tr");
			var advanceAppId=thisTr.find(".advance-app-id").val();
			var processInstanceId=thisTr.find(".processInstanceId").val();
			//详情页面
			var pageUrl = "view/system-sasac/expensesReim/module/beforehand/beforeApplyDetail.html?advanceId="+ advanceAppId;//即将跳转的页面路径
			//调用公用的打开新页面方法传输参数不需要左侧菜单
			$yt_baseElement.openNewPage(2,pageUrl);
		});
		//跳转事前申请变更详情页面
		$('.pending').on('click', '.to-update-detail', function() {
			var thisTr=$(this).parents("tr");
			var advanceAppId=thisTr.find(".advanceAppIdUpdate").val();
			var processInstanceId=thisTr.find(".processInstanceId").val();
			//详情页面
			var pageUrl = "view/system-sasac/expensesReim/module/busiTripApply/projectServeDetails.html?advanceAppId="+advanceAppId;//即将跳转的页面路径
			//调用公用的打开新页面方法传输参数不需要左侧菜单
			$yt_baseElement.openNewPage(2,pageUrl);
		});
		// 输入框输入文本后  显示出删除叉号
		$('.search').on('keydown', function() {
			if($('.search').val() != '' || $('.search').val() != null) {
				$('.clearImg').show();
			}
		});
		// 点击叉号 清空输入框并隐藏叉号
		$('.clearImg').on('click', function() {
			$('.search').val('');
			$(this).hide();
			//调用获取选中的Tab状态
			pro.searchList();
		});
		// 点击重置按钮
		$("#resetBtn").off().on("click", function() {
			$('.search').val('');
			$(".clearImg").hide();
			//调用获取选中的Tab状态
			pro.searchList();
		});
		// 点击查询按钮
		$("#searchBtn").off().on("click", function() {
			//调用获取选中的Tab状态
			pro.searchList();
		});
		//流程状态链接事件绑定
		$(".end-table").on('click','.process-state',function() {
			var processInstanceId=$(this).parents("tr").find(".processInstanceId").val();
			sysCommon.processStatePop(processInstanceId);
		});
		//点击打印单按钮
		$("#printUpdateBtn").click(function(){
			//判断是否选择表格数据
			var selTrLen = $(".tab-div .tab-content:visible tbody tr.yt-table-active").length;
			//获取当前选中行数据
			var  thisTrData = $(".tab-div .tab-content:visible tbody tr.yt-table-active").data("dataStr");
			if(selTrLen == 0){
				$yt_alert_Model.prompt("请选择一行数据进行操作");
			}else{
				var pageUrl = "view/system-sasac/expensesReim/module/print/bugetAdjustApplyForm.html?expenditureAppId="+thisTrData.advanceAppId+ '&costType='+thisTrData.advanceCostType;//即将跳转的页面路径
				//调用公用的打开新页面方法传输参数不需要左侧菜单
				$yt_baseElement.openNewPage(2,pageUrl);
			}
		});
	},
	/*Tab标签切换事件*/
	switcher: function() {
		$('.tab-li').off().on('click', function() {
			var index = $(this).index();
			$(this).addClass('active-li').siblings('.tab-li').removeClass('active-li');
			if(index == 1 || index == 2) {
				$('.tab-content').eq(1).css("display", 'block').addClass("check").siblings('.tab-content').hide().removeClass("check");
			} else {
				$('.tab-content').eq(index).css("display", 'block').addClass("check").siblings('.tab-content').hide().removeClass("check");
			}
			if(index == 2) {
				$('.add-bill').show();
				$('.to-budget-dia').show();
				$('.bill-record').show();
			} else {
				$('.add-bill').hide();
				$('.to-budget-dia').hide();
				$('.bill-record').hide();
			}
			if(index == 0) {
				$(".dis").show();
			} else {
				$(".dis").hide();
			}
			//调用获取选中的Tab状态
			pro.searchList();
		});
	},
	/*查询列表方法*/
	searchList: function() {
		var status = $('.active-li input').val();
		if(status == 'WF_SUSPENDING_QUERY_SQL_PARAMS') { // 待处理
			pro.getListByPage(status);
		} else if(status == 'WF_SOLVED_QUERY_SQL_PARAMS') { // 已处理
			pro.getProcessingAndFinishList(status);
		} else if(status == 'WF_COMPLETED_QUERY_SQL_PARAMS') { // 已完结
			pro.getProcessingAndFinishList(status);
		} else if(status == 'WF_DRAFTS_QUERY_SQL_PARAMS') { // 草稿箱
		}
	},
	/*分页查询获取待处理列表(根据当前状态stateCode)*/
	getListByPage: function(stateCode) {
		//获取关键字值
		var keyWord = $('.search').val();
		
		$('.page1').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: 'sz/advanceAppUpdate/getUserAdvanceUpdateAppInfoWFListToPageByParams', //ajax访问路径  
			data: {
				queryStateParams: stateCode,
				queryParams: keyWord
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				var datas = data.data.rows;
				var thisTbody=$('.wait-table .yt-tbody');
				thisTbody.empty();
				var trStr = "";
				if(data.flag == 0) {
					if(datas.length > 0) {
						$('.page1').show();
						$.each(datas, function(i, n) {
							trStr += '<tr>' +
								'<td><a class="yt-link to-update-detail">' + n.advanceAppNumUpdate + '</a><input type="hidden" class="advanceAppIdUpdate" value="' + n.advanceAppId + '"/><input type="hidden" class="advance-app-id" value="' + n.advanceAppIdUpdate + '"/><input type="hidden" class="processInstanceId" value="' + n.processInstanceId + '"/></td>' +
								'<td><a class="yt-link to-detail">' + n.advanceAppNum + '</a></td>' +
								'<td style="text-align: left;">' + (n.advanceAppName == "" ? "--" : n.advanceAppName) + '</td>' +
								'<td style="text-align: right;">' + (n.changeAmount == "" ? $yt_baseElement.fmMoney(0) : $yt_baseElement.fmMoney(n.changeAmount)) + '</td>' +
								//'<td><span>' + n.advanceCostTypeName + '</span></td>' +
								'<td>' + n.applicantUserName + '</td>' +
								'<td><span>' + n.applicantDept + '</span></td>'+
								'<td>' + n.stagnationTime + '</td>';  //停滞时间
							trStr += '<td>' + (stateCode != 'WF_SUSPENDING_QUERY_SQL_PARAMS' ? '' : '<a class="yt-link apprv-btn" taskKey="' + n.taskKey + '">' + (n.taskKey == 'activitiStartTask' ? '处理' : '审批') + '</a><span class="center-line">|</span>') + '<a class="yt-link log-mod">日志</a></td>' +
								'</tr>';
						    trStr = $(trStr).data("dataStr",n);
						    thisTbody.append(trStr);
						});
						//调用跳转到审批页面方法
//						expenApplApprList.goApprovePage();
						//调用提示窗口
						sysCommon.initQtip($(".log-mod"));
						//绑定弹窗事件
//						expenApplApprList.flowWindow();
						//绑定去详情页面
//						expenApplApprList.toDetails();
					} else {
						thisTbody.empty();
						$('.page1').hide();
						//拼接暂无数据效果
						thisTbody.append(pro.noDataTrStr(8));
					}
				}else{
					$yt_alert_Model.prompt(data.message);
					$('.page1').hide();
					thisTbody.empty();
					//拼接暂无数据效果
					thisTbody.append(pro.noDataTrStr(8));
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	/*已处理和已完结页面数据列表*/
	getProcessingAndFinishList:function(stateCode){
		//获取关键字值
		var keyWord = $('.search').val();
		$('.page2').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: 'sz/advanceAppUpdate/getUserAdvanceUpdateAppInfoWFListToPageByParams', //ajax访问路径  
			data: {
				queryStateParams: stateCode,
				queryParams: keyWord
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				var datas = data.data.rows;
				var thisTbody=$('.end-table .yt-tbody');
				thisTbody.empty();
				var trStr = "";
				if(data.flag == 0) {
					if(datas.length > 0) {
						$('.page2').show();
						$.each(datas, function(i, n) {
							trStr += '<tr>' +
								'<td><a class="yt-link to-update-detail">' + n.advanceAppNumUpdate + '</a><input type="hidden" class="advance-app-id" value="' + n.advanceAppIdUpdate + '"/><input type="hidden" class="advanceAppIdUpdate" value="' + n.advanceAppId + '"/><input type="hidden" class="processInstanceId" value="' + n.processInstanceId + '"/></td>' +
								'<td><a class="yt-link to-detail">' + n.advanceAppNum + '</a></td>' +
								'<td style="text-align:left;">' + (n.advanceAppName == "" ? "--" : n.advanceAppName) + '</td>' +
								'<td style="text-align: right;">' + (n.changeAmount == "" ? $yt_baseElement.fmMoney(0) : $yt_baseElement.fmMoney(n.changeAmount)) + '</td>' +
								//'<td><span>' + n.advanceCostTypeName + '</span></td>' +
								'<td>' + n.applicantUserName + '</td>' +
								'<td><span>' + n.applicantDept + '</span></td>';
							if(stateCode == 'WF_COMPLETED_QUERY_SQL_PARAMS'){//已完结  显示申请日期
								$(".applicant-time-th").show();//显示申请日期th
								trStr +='<td>' + n.applicantTime + '</td>';
							}else{
								$(".applicant-time-th").hide()//隐藏申请日期th
							}
							if(stateCode == 'WF_SOLVED_QUERY_SQL_PARAMS'){//已处理  显示流程状态
								$(".process-state-th").show();//显示流程状态th
								trStr +='<td style="text-align:left;"><span class="yt-link process-state">' + n.nodeNowState + '</span></td>';  //流程状态
							}else{
								$(".process-state-th").hide();//隐藏流程状态th
							}
							trStr += '<td>' + (stateCode != 'WF_SUSPENDING_QUERY_SQL_PARAMS' ? '' : '<a class="yt-link apprv-btn" taskKey="' + n.taskKey + '">' + (n.taskKey == 'activitiStartTask' ? '处理' : '审批') + '</a><span class="center-line">|</span>') + '<a class="yt-link log-mod">日志</a></td>' +
								'</tr>';
							trStr = $(trStr).data("dataStr",n);
							thisTbody.append(trStr);
						});
						//调用跳转到审批页面方法
//						expenApplApprList.goApprovePage();
						//调用提示窗口
						sysCommon.initQtip($(".log-mod"));
						//绑定弹窗事件
//						expenApplApprList.flowWindow();
						//绑定去详情页面
//						expenApplApprList.toDetails();
					} else {
						$('.page2').hide();
						thisTbody.empty();
						//拼接暂无数据效果
						thisTbody.append(pro.noDataTrStr(8));
					}
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: false //是否显示选择条数列表默认false  
		});
	},
	/**
	 * 拼接暂无数据内容
	 * @param {Object} trNum  行数
	 * 分页查询没有数据时提示拼接数据
	 */
	noDataTrStr: function(trNum) {
		//暂无数据内容
		var noDataStr = '<tr style="border:0px;background-color:#fff !important;"><td  colspan="' + trNum + '" align="center"style="border:0px;"><div class="no-data" style="width: 280px;margin: 0 auto;">' +
			'<img src="../../../../../resources-sasac/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
			'</div></td></tr>';
		return noDataStr;
	},

}
$(function() {
	pro.init();
	$("#projectBefList").css("min-height", $(window).height() - 12);
})