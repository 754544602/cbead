var beforeApproList = {
	//初始化方法
	init:function(){
		$(".project-summary").click(function(){
			beforeApproList.toProjectSummary();
		});
		//信息栏的显示隐藏
		$('.info-sidebar .sidebar-head').on('click', function(){
			var div = $('.info-sidebar .sidebar-data');
			if (div.is(':hidden')) {
				div.show();
			} else {
				div.hide();
			}
		});
		
		beforeApproList.infoSidebarList();
		//待处理全选反选
		beforeApproList.checkBoxEvent();
		//跳转详情点击
		beforeApproList.toDetails();
	},
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
		$(".end-table").on('click', '.process-state', function() {
			//获取流程实例ID
			var processInstanceId = $(this).parents("tr").find(".processInstanceId").val();
			sysCommon.processStatePop(processInstanceId);
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
			url: 'budget/prjApp/getUserBudgetPrjAppInfoWFListToPageByParams', //ajax访问路径    $yt_option.websit_path + 'resources-sasac/js/testJsonData/budgetProjectList.json
			type: 'post',
			data: {
				queryStateParams: stateCode,
				queryParams: keyWord
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				var htmlTbody = $('.wait-table .yt-tbody');
				htmlTbody.empty();
				var trStr = "";
				if(data.flag == 0) {
					var datas = data.data.rows;
					if(datas.length > 0) {
						$('.page1').show();
						$.each(datas, function(i, n) {
							trStr += '<tr>' +
								'<td>' +
								'<label class="check-label yt-checkbox"><input class="check-but" type="checkbox" name="check" value="' + n.budgetPrjAppId + '"/></label>' +
								'</td>' +
								'<td><a class="yt-link to-detail">' + n.budgetPrjAppNum + '</a><input type="hidden" class="budgetPrjAppId" value="' + n.budgetPrjAppId + '"/><input type="hidden" class="processInstanceId" value="' + n.processInstanceId + '"/></td>' +
								'<td style="text-align: left;" class="prj-name">' + n.prjName + '</td>' +
								'<td>' + n.prjUnitName + '</td>' +
								/*'<td applicantUser="' + n.applicantUser + '">' + n.applicantUserName + '</td>' +*/
								'<td>' + n.applicantDeptName + '</td>' +
								'<td>' + n.stagnationTime + '</td>' + //停滞时间
								'<td><a class="yt-link apprv-btn" taskKey="' + n.taskKey + '">' + (n.taskKey == 'activitiStartTask' ? '处理' : '审批') + '</a><span class="center-line">|</span><a class="yt-link log-mod">日志</a></td></tr>';
							trStr = $(trStr).data("dataStr", n);
							htmlTbody.append(trStr);
						});
						//调用跳转到审批页面方法
						beforeApproList.goApprovePage();
						//调用提示窗口
						sysCommon.initQtip($(".log-mod"));
					} else {
						$('.page1').hide();
						//拼接暂无数据效果
						htmlTbody.append(sysCommon.noDataTrStr(7));
					}
				} else {
					$('.page1').hide();
					//拼接暂无数据效果
					htmlTbody.append(sysCommon.noDataTrStr(7));
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	//查询信息边栏列表
	infoSidebarList: function() {
		$('.info-sidebar-page').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: 'budget/prjSummaryApp/getBudgetPrjAppInfoPageByParams', //ajax访问路径    $yt_option.websit_path + 'resources-sasac/js/testJsonData/budgetProjectList.json
			type: 'post',
			data: {
				startTime: "",
				queryParams: "",
				endTime: ""
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				var htmlTbody = $('.info-sidebar-tbody');
				htmlTbody.empty();
				var trStr = "";
				if(data.flag == 0) {
					var datas = data.data.rows;
					if(datas.length > 0) {
						$('.info-sidebar-tbody').show();
						$.each(datas, function(i, n) {
							trStr += '<tr>' +
								'<td style="text-align: left;"><input type="hidden" class="budgetPrjAppId" value="'+n.budgetPrjAppId+'" /><a class="yt-link to-detail type">' + n.prjName + '</a></td>' +
								'<td>' + n.prjUnitName + '</td>' +
								/*'<td applicantUser="' + n.applicantUser + '">' + n.applicantUserName + '</td>' +*/
								'<td>' + n.applicantUserName + '</td>' +
								'<td>' + n.applicantTime + '</td>';
							trStr = $(trStr).data("dataStr", n);
							htmlTbody.append(trStr);
						});
					} else {
						$('.info-sidebar-tbody').hide();
						//拼接暂无数据效果
						htmlTbody.append(sysCommon.noDataTrStr(7));
					}
				} else {
					$('.page1').hide();
					//拼接暂无数据效果
					htmlTbody.append(sysCommon.noDataTrStr(7));
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
		$('.yt-table').off("click").on('click', '.to-detail', function() {
			//获取预算立项申请Id
			var budgetPrjAppId = $(this).parents('tr').find('.budgetPrjAppId').val();
			//获取流程实例Id
			var processInstanceId = $(this).parents('tr').find('.processInstanceId').val();
			/*调用阻止冒泡方法*/
			$yt_baseElement.eventStopPageaction();
			/*页面跳转打开新页面*/
			var pageUrl = "view/system-sasac/budget/module/projectApproval/budgetApprovalDetails.html?budgetPrjAppId=" + budgetPrjAppId + '&processInstanceId=' + processInstanceId; //即将跳转的页面路径
			if ($(this).hasClass('type')) {
				//跳转汇总后详情
				pageUrl += '&type=2';
			}
			//调用公用的打开新页面方法传输参数不需要左侧菜单
			$yt_baseElement.openNewPage(2, pageUrl);
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
			url: 'budget/prjApp/getUserBudgetPrjAppInfoWFListToPageByParams', //ajax访问路径   
			type: 'post',
			data: {
				queryStateParams: stateCode,
				queryParams: keyWord
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				var htmlTbody = $('.end-table .yt-tbody');
				htmlTbody.empty();
				var trStr = "";
				if(data.flag == 0) {
					var datas = data.data.rows;
					if(datas.length > 0) {
						$('.page2').show();
						$.each(datas, function(i, n) {
							trStr += '<tr>' +
								'<td>' +
								'<label class="check-label yt-checkbox"><input class="check-but" type="checkbox" name="check" value="' + n.budgetPrjAppId + '"/></label>' +
								'</td>' +
								'<td><a class="yt-link to-detail">' + n.budgetPrjAppNum + '</a><input type="hidden" class="budgetPrjAppId" value="' + n.budgetPrjAppId + '"/><input type="hidden" class="processInstanceId" value="' + n.processInstanceId + '"/></td>' +
								'<td style="text-align: left;">' + n.prjName + '</td>' +
								'<td style="">' + n.prjUnitName + '</td>' +
								/*'<td applicantUser="' + n.applicantUser + '">' + n.applicantUserName + '</td>' +*/
								'<td>' + n.applicantDeptName + '</td>';
							//已完结  隐藏当前状态
							if(stateCode == 'WF_COMPLETED_QUERY_SQL_PARAMS') {
								//显示申请日期th
								$(".now-show-th").hide();
								$(".now-show-td").hide();
								$(".apply-date-th").show();
								$(".apply-date-td").show();
								trStr += '<td>' + n.applicantTime + '</td>';
							} else {
								//显示当前状态th
								$(".now-show-th").show();
								$(".now-show-td").show();
								$(".apply-date-th").hide();
								$(".apply-date-td").hide();
								trStr += '<td><a class="yt-link process-state">' + n.nodeNowState + '</a></td>';
							}
							/*flowBtn*/
							trStr += '<td><a class="yt-link log-mod">日志</a></td>' +
								'</tr>';
							//存储数据data
							trStr = $(trStr).data("dataStr", n);
							htmlTbody.append(trStr);
						});

						//判断已处理
						if(stateCode == "WF_SOLVED_QUERY_SQL_PARAMS") {
							//隐藏状态列
							$(".app-state-td,.app-state-th").hide();
						} else {
							//显示状态列
							$(".app-state-td,.app-state-th").show();
						}
						//调用跳转到审批页面方法
						beforeApproList.goApprovePage();
						//调用提示窗口
						sysCommon.initQtip($(".log-mod"));
					} else {
						$('.page2').hide();
						//拼接暂无数据效果
						htmlTbody.append(sysCommon.noDataTrStr(8));
					}
				} else {
					$('.page1').hide();
					//拼接暂无数据效果
					htmlTbody.append(sysCommon.noDataTrStr(8));
				}
			},
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	/**
	 * 
	 * 
	 * 跳转到预算审批页面
	 * 
	 */
	goApprovePage: function() {
		/**
		 * 
		 * 点击操作中的审批按钮
		 * 
		 */
		$(".apprv-btn").off().click(function() {
			//跳转路径
			var pageUrl = '';
			//获取预算立项申请Id
			var budgetPrjAppId = $(this).parents('tr').find('.budgetPrjAppId').val();
			//获取流程实例Id
			var processInstanceId = $(this).parents('tr').find('.processInstanceId').val();
			/*
			 * 获取当前审批节点key值
			 */
			var state = $(this).attr('taskKey');
			pageUrl = 'view/system-sasac/budget/module/projectApproval/projectApplyApproval.html?budgetPrjAppId=' + budgetPrjAppId + '&processInstanceId=' + processInstanceId + '&draCode=3';
			/*if(state == 'DEPT_AUDIT' || state == 'CSZY') {
				//状态为数据维护时 进入编辑页面
				pageUrl = 'view/system-sasac/budget/module/projectApproval/projectApplyApproval.html?budgetPrjAppId=' + budgetPrjAppId + '&processInstanceId=' + processInstanceId + '&draCode=3';
			} else {
				//审批页面
				pageUrl = 'view/system-sasac/budget/module/projectApproval/budgetApplyDetails.html?budgetPrjAppId=' + budgetPrjAppId + '&processInstanceId=' + processInstanceId;
			}*/
			/**
			 * 调用显示loading方法
			 */
			parent.parent.$yt_baseElement.showLoading();
			window.location.href = $yt_option.websit_path + pageUrl;
		});
	},
	/**
	 * 全选反选处理
	 */
	checkBoxEvent: function() {
		//表头复选框点击
		$('.checkAll').on('change', function() {
			//获取表格内所有复选框
			var checks = $('.check>table .yt-tbody .check-but');
			if(this.checked) {
				//选中则选中所有
				checks.each(function() {
					$(this).setCheckBoxState('check');
				});
			} else {
				//所有取消选中
				checks.each(function() {
					$(this).setCheckBoxState('uncheck');
				});
			}
		});
		//表格内复选框点击
		$('.check>table .yt-tbody').on('change', '.check-but', function() {
			var check = true;
			$('.check>table .yt-tbody .check-but').each(function() {
				if(!this.checked) {
					check = false;
					//其中一个未选中则停止
					return false;
				}
			});
			if(check) {
				// 全部选中则表头复选框选中
				$('.checkAll').setCheckBoxState('check');
			} else {
				$('.checkAll').setCheckBoxState('uncheck');
			}
		});
	},
	//选择数据后跳转项目汇总
	toProjectSummary: function(){
		//获取选中的数据
		var selData = $('.check>.yt-table>tbody label.check input');
		if (selData.length > 0) {
			// 判断项目名是否相同
			if (beforeApproList.verifyProjectName(selData)) {
				//获取id集合
				var ids = '';
				selData.each(function(i, n) {
					ids += $(n).val() + (i < selData.length - 1 ? ',' : '')
 				});
 				//跳转至立项申请页面
 				window.location.href = $yt_option.websit_path + "view/system-sasac/budget/module/projectApproval/projectApplyApproval.html?budgetPrjAppId=" + ids + '&draCode=2';
			} else {
				$yt_alert_Model.prompt('请选择相同的项目名称');
			}
		} else {
			$yt_alert_Model.prompt('请选择数据进行操作');
		}
	},
	/**
	 * 验证相同的项目名称
	 * @param {Object} data
	 */
	verifyProjectName: function (data) {
		var verify = true;
		//第一个项目名称
		var prjName = data.eq(0).parents('tr').find('.prj-name').text();
		$.each(data, function(i, n) {
			if (prjName != $(n).parents('tr').find('.prj-name').text()) {
				verify = false;
				return false;
			}
		});
		return verify;
	}
}
$(function() {
	//初始化
	beforeApproList.init();
	//调用关键字输入框事件
	beforeApproList.searchInput();
	//tab切换
	beforeApproList.switcher();
	//获取参数 审批页面提交定位至已处理tab页
	var state = $yt_common.GetRequest().state;
	if(state) {
		$('.tab-header .tab-li').removeClass('active-li');
		$('.tab-header .tab-li').eq(1).addClass('active-li');
		$('.tab-content').eq(1).css("display", 'block').siblings('.tab-content').hide();
	}
	//调用获取选中的Tab状态
	beforeApproList.searchList();
	//给页面设置最小高度
	$("#reimApproList").css("min-height", $(window).height() - 12);
});
/*获取复选框值*/
function checkbox() {
	var budgetPrjAppIdArr = $("lable.check");
	console.log(budgetPrjAppIdArr);
	var budgetPrjAppIdLength = budgetPrjAppIdArr.length;
	var chestr = "";
	for(i = 0; i < budgetPrjAppIdLength; i++) {
		if(budgetPrjAppIdArr[i].checked == true) {
			if(budgetPrjAppIdArr[i].value != ""){
				chestr = budgetPrjAppIdArr[i].value;
			}
		}
	}
	return chestr;

}