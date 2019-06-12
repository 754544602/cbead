var beforeApproList = {
	/**
	 * 
	 * 关键字输入框事件
	 * 
	 */
	searchInput: function() {
		// 输入框输入文本后  显示出删除叉号
		$('.search').on('keydown', function() {
			if($(this).val() != '') {
				$('.clearImg').show();
			}
		});
		// 点击叉号 清空输入框并隐藏叉号
		$('.clearImg').on('click', function() {
			$('.search').val('');
			$(this).hide();
			//调用获取选中的Tab状态
			beforeApproList.searchList();
		});
		//点击重置按钮
		$("#resetBtn").off().on("click", function() {
			$('.search').val('');
			$(".clearImg").hide();
			//调用获取选中的Tab状态
			beforeApproList.searchList();
		});
		/**
		 * 
		 * 点击关键字查询按钮
		 * 
		 */
		$("#heardSearchBtn").off().on("click", function() {
			//调用获取选中的Tab状态
			beforeApproList.searchList();
		});
		//流程状态链接事件绑定
		$(".end-table").on('click','.process-state',function() {
			//获取流程实例ID
			var processInstanceId=$(this).parents("tr").find(".processInstanceId").val();
			sysCommon.processStatePop(processInstanceId);
		});
		//调用打印按钮操作事件方法
		beforeApproList.printBtnEvent();
	},
	/**
	 * 
	 * 打印按钮操作事件
	 * 
	 */
	printBtnEvent:function(){
		//点击打印单按钮事件操作方法
		$("#printBeforBtn").click(function(){
			//判断是否选择表格数据
			var selTrLen = $(".tab-div .tab-content:visible tbody tr.yt-table-active").length;
			//获取当前选中行数据
			var  thisTrData = $(".tab-div .tab-content:visible tbody tr.yt-table-active").data("dataStr");
			if(selTrLen == 0){
				$yt_alert_Model.prompt("请选择一行数据进行操作");
			}else{
				var pageUrl = "view/system-sasac/expensesReim/module/print/beforeApplyDetailMain.html?expenditureAppId="+thisTrData.advanceAppId+ '&costType='+thisTrData.advanceCostType;//即将跳转的页面路径
				//调用公用的打开新页面方法传输参数不需要左侧菜单
				$yt_baseElement.openNewPage(2,pageUrl);
			}
		});
	},
	/**
	 * 查询列表方法
	 */
	searchList: function() {
		var status = $('.active-li input').val();
		if(status == 'WF_SUSPENDING_QUERY_SQL_PARAMS') { // 待处理
			beforeApproList.getPendingList(status);
		} else if(status == 'WF_SOLVED_QUERY_SQL_PARAMS') { // 已处理
			$(".app-date-th").text("申请日期");
			beforeApproList.getProcessingAndFinishList(status);
		} else if(status == 'WF_COMPLETED_QUERY_SQL_PARAMS') { // 已完结
			//$(".app-date-th").text("最新修改日期");
			beforeApproList.getProcessingAndFinishList(status);
		} else if(status == 'WF_DRAFTS_QUERY_SQL_PARAMS') { // 草稿箱
		}
	},
	/**
	 * 
	 * Tab标签切换事件
	 * 
	 */
	switcher: function() {
		$('.tab-li').off().on('click', function() {
			var index = $(this).index();
			$(this).addClass('active-li').siblings('.tab-li').removeClass('active-li');
			if(index == 1 || index == 2) {
				$('.tab-content').eq(1).css("display", 'block').addClass("check").siblings('.tab-content').hide().removeClass("check");
			} else {
				$('.tab-content').eq(index).css("display", 'block').addClass("check").siblings('.tab-content').hide().removeClass("check");
			}
			//调用获取选中的Tab状态
			beforeApproList.searchList();
		});
	},
	/**
	 * 获取待处理 列表
	 * @param {Object} stateCode 状态code值
	 */
	getPendingList: function(stateCode) {
		//获取查询关键字
		var keyWord = $('.search').val();
		$('.page1').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: 'sz/advanceApp/getUserAdvanceAppInfoWFListToPageByParams', //ajax访问路径  
			data: {
				queryStateParams: stateCode,
				queryParams: keyWord,
				formType:"expenditure"
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				var datas = data.data.rows;
				var htmlTbody = $('.wait-table .yt-tbody');
				htmlTbody.empty();
				var trStr = "";
				if(data.flag == 0) {
					if(datas.length > 0) {
						$('.page1').show();
						$.each(datas, function(i, n) {
							trStr += '<tr>' +
								'<td><a class="yt-link to-detail">' + n.advanceAppNum + '</a><input type="hidden" class="hid-advance-id" value="' + n.advanceAppId + '"/><input type="hidden" class="processInstanceId" value="'+n.processInstanceId+'"/></td>' +
								'<td class="tl"><div style="white-space: normal;word-break: break-all;word-wrap: break-word;">' + (n.advanceAppName == "" ? "--" : n.advanceAppName) + '</div></td>' +
								'<td style="text-align: right;">' + (n.advanceAmount == "" ? "--" : $yt_baseElement.fmMoney(n.advanceAmount)) + '</td>'+
//								'<td><span>' + n.advanceCostTypeName + '</span></td>' +
								'<td>' + n.applicantUserName + '</td>' +
								'<td><span>' + n.applicantDept + '</span></td>' +
								'<td>' + n.stagnationTime + '</td>' +  //停滞时间
//								'<td><a class="yt-link flowBtn">' + n.nodeNowState + '</a></td>' +
								'<td><a class="yt-link apprv-btn" taskKey="' + n.taskKey + '">' + (n.taskKey == 'activitiStartTask' ? '处理' : '审批') + '</a><span class="center-line">|</span><a class="yt-link log-mod">日志</a></td></tr>';
						    trStr = $(trStr).data("dataStr",n);
						    htmlTbody.append(trStr);
						});
						//调用跳转到审批页面方法
						beforeApproList.goApprovePage();
						//调用提示窗口
						sysCommon.initQtip($(".log-mod"));
						//绑定去详情页面
						beforeApproList.toDetails();
					} else {
						$('.page1').hide();
						//拼接暂无数据效果
						htmlTbody.append(sysCommon.noDataTrStr(8));
					}
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	/**
	 * 
	 * 跳转详情方法
	 * 
	 */
	toDetails: function() {
		$('.yt-link.to-detail').off("click").on('click', function() {
			/*调用阻止冒泡方法*/
			$yt_baseElement.eventStopPageaction();
			/*获取流程实例id*/
			var processInstanceId = $(this).parents('tr').find('.processInstanceId').val();
			//获取单据ID
			var advanceId=$(this).parents('tr').find('.hid-advance-id').val();
			var fun = $(this).attr('fun');
			/*页面跳转打开新页面*/
			var pageUrl = "view/system-sasac/expensesReim/module/beforehand/beforeApplyDetail.html?processInstanceId=" + processInstanceId+"&advanceId="+advanceId+"&fun="+fun;//即将跳转的页面路径
			//调用公用的打开新页面方法传输参数不需要左侧菜单
			$yt_baseElement.openNewPage(2,pageUrl);
		})
	},
	/**
	 * 
	 * 获取已处理已完成列表数据
	 * @param {Object} stateCode 状态code
	 */
	getProcessingAndFinishList: function(stateCode) {
		var keyWord = $('.search').val();
		$('.page2').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: 'sz/advanceApp/getUserAdvanceAppInfoWFListToPageByParams', //ajax访问路径  
			data: {
				queryStateParams: stateCode,
				queryParams: keyWord
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				var datas = data.data.rows;
				var htmlTbody = $('.end-table .yt-tbody');
				htmlTbody.empty();
				var trStr = "";
				if(data.flag == 0) {
					if(datas.length > 0) {
						$('.page2').show();
						$.each(datas, function(i, n) {
							trStr += '<tr>' +
								'<td><a class="yt-link to-detail">' + n.advanceAppNum + '</a><input type="hidden" class="hid-advance-id" value="' + n.advanceAppId + '"/><input type="hidden" class="processInstanceId" value="'+n.processInstanceId+'"/></td>' +
								'<td class="tl">' + (n.advanceAppName == "" ? "--" : n.advanceAppName) + '</td>' +
								'<td style="text-align: right;">' + (n.advanceAmount == "" ? "--" : $yt_baseElement.fmMoney(n.advanceAmount)) + '</td>'+
//								'<td><span>' + n.advanceCostTypeName + '</span></td>' +
								'<td>' + n.applicantUserName + '</td>' +
								'<td><span>' + n.applicantDept + '</span></td>';
								//已完结  显示申请日期
								if(stateCode == 'WF_COMPLETED_QUERY_SQL_PARAMS'){
									//显示申请日期th
									$(".applicant-time-th").show();
									trStr +='<td>' + n.handleTime + '</td>';
								}else{
									//隐藏申请日期th
									$(".applicant-time-th").hide();
								}
								//已处理  显示流程状态
								if(stateCode == 'WF_SOLVED_QUERY_SQL_PARAMS'){
									//显示流程状态th
									$(".process-state-th").show();
									//流程状态
									trStr +='<td style="text-align:left;"><span class="yt-link process-state">' + n.nodeNowState + '</span></td>';
								}else{
									//隐藏流程状态th
									$(".process-state-th").hide();
								}
							//trStr +='<td class="app-end-date-td">'+n.newAdvanceTime+'</td>';//判断状态类型
							/*flowBtn*/
					        trStr += '<td class="app-state-td"><span class="">'+(n.changeState == 0 ? '未修改' : '已修改')+'</span></td>' +
								'<td><a class="yt-link log-mod">日志</a></td>'+
								'</tr>';
							//存储数据data
							trStr = $(trStr).data("dataStr",n);
							htmlTbody.append(trStr);
						});
						
						//判断已处理
						if(stateCode=="WF_SOLVED_QUERY_SQL_PARAMS"){
							//隐藏状态列
							$(".app-state-td,.app-state-th").hide();
						}else{
							//显示状态列
							$(".app-state-td,.app-state-th").show();
						}
						//调用跳转到审批页面方法
						beforeApproList.goApprovePage();
						//调用提示窗口
						sysCommon.initQtip($(".log-mod"));
						//绑定去详情页面
						beforeApproList.toDetails();
					} else {
						$('.page2').hide();
						//拼接暂无数据效果
						htmlTbody.append(sysCommon.noDataTrStr(8));
					}
				}

			},
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	/**
	 * 
	 * 
	 * 跳转到报销单审批页面
	 * 
	 */
	goApprovePage: function() {
		/**
		 * 
		 * 点击操作中的审批按钮
		 * 
		 */
		$(".apprv-btn").off().click(function() {
			//获取单据ID
			var advanceId = $(this).parents("tr").find(".hid-advance-id").val();
			//获取申请单状态
			var state = $(this).attr('taskKey');
			//获取单据类型要实现的方法
			var fun = $(this).attr('fun');
			//跳转路径
			var pageUrl = '';
			if(state == 'activitiStartTask') {
				//状态为申请人填报时 进入修改页面
				pageUrl = 'view/system-sasac/expensesReim/module/busiTripApply/serveApply.html?advanceId=' + advanceId;
			} else {
				//审批页面
				pageUrl = 'view/system-sasac/expensesReim/module/busiTripApply/priorApproval.html?advanceId=' + advanceId + '&fun=' + fun;
			}
			/**
			 * 调用显示loading方法
			 */
			parent.parent.$yt_baseElement.showLoading();
			window.location.href = $yt_option.websit_path + pageUrl;
		});
	}
}
$(function() {
	//调用关键字输入框事件
	beforeApproList.searchInput();
	//tab切换
	beforeApproList.switcher();
	//获取参数 审批页面提交定位至已处理tab页
	var state = $yt_common.GetRequest().state;
	if(state){
		$('.tab-header .tab-li').removeClass('active-li');
		$('.tab-header .tab-li').eq(1).addClass('active-li');
		$('.tab-content').eq(1).css("display", 'block').siblings('.tab-content').hide();
	}
	//调用获取选中的Tab状态
	beforeApproList.searchList();
	//给页面设置最小高度
	$("#reimApproList").css("min-height", $(window).height() - 12);
})