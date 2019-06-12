var beforeApproList = {
	/**
	 * 关键字输入框事件
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
		
		/*切换复选框查询*/
		$('.screen input').change(function() {
			var stateCode = "WF_PASS_QUERY_SQL_PARAMS";
			var signState = function() {
				var states = $('.screen .check');
				if($(states).length >= 2 || $(states).length <= 0) {
					return '2';
				} else if($(states).length < 2) {
					return $(states).find('input').val();
				}
				return '';
			}
			var sta = '';
			if($(this).parent().hasClass('check')) {
				/*取消选中*/
				$(this).setCheckBoxState("uncheck");
				sta = signState();
			} else {
				/*选中*/
				$(this).setCheckBoxState("check");
				sta = signState();
			}
			beforeApproList.getProcessingAndFinishList(stateCode,sta);
		});
		/*全选 反选*/
		var check = true;
		$('.all-checked').click(function() {
			if(check) {
				$('.yt-table tbody').setCheckBoxState("checkAll");
			} else {
				$('.yt-table tbody').setCheckBoxState("unCheckAll");
			}
			check = !check;
		});
		/*打印*/
		$('.already-printed').click(function() {
			var ids = '';
			$('.yt-table tbody .check').each(function(i, n) {
				ids += $(n).find('input').val() + (i < $('.yt-table tbody .check').length - 1 ? ',' : '');
			});
			if(ids) {
				beforeApproList.updateAdvanceIsPrintStateYes(ids);
				check = true;
			} else {
				$yt_alert_Model.prompt('请选择数据进行操作');
			}
		})
		/*未打印*/
		$('.non-printing').click(function() {
			var ids = '';
			$('.yt-table tbody .check').each(function(i, n) {
				ids += $(n).find('input').val() + (i < $('.yt-table tbody .check').length - 1 ? ',' : '');
			});
			if(ids) {
				beforeApproList.updateAdvanceIsPrintStateNo(ids);
				check = true;
			} else {
				$yt_alert_Model.prompt('请选择数据进行操作');
			}
		});
		//调用打印按钮操作事件方法
		beforeApproList.printBtnEvent();
	},
	/**
	 * 打印
	 * @param {Object} ids
	 */
	updateAdvanceIsPrintStateYes: function(ids) {
		$.ajax({
			type: "post",
			url: "sz/advanceApp/updateAdvanceIsPrintStateYes",
			async: false,
			data: {
				ids: ids
			},
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt(data.message);
					//刷新列表
					beforeApproList.searchList();
				} else {
					$yt_alert_Model.prompt(data.message);
				}
			}
		});
	},
	/**
	 * 未打印
	 * @param {Object} ids
	 */
	updateAdvanceIsPrintStateNo: function(ids) {
		$.ajax({
			type: "post",
			url: "sz/advanceApp/updateAdvanceIsPrintStateNo",
			async: false,
			data: {
				ids: ids
			},
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt(data.message);
					//刷新列表
					beforeApproList.searchList();
				} else {
					$yt_alert_Model.prompt(data.message);
				}
			}
		});
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
		beforeApproList.getProcessingAndFinishList("WF_PASS_QUERY_SQL_PARAMS","2");
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
	getProcessingAndFinishList: function(stateCode,printState) {
		var keyWord = $('.search').val();
		$('.page2').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: 'sz/advanceApp/getUserAdvanceAppInfoBusinessListToPageByParams', //ajax访问路径  
			data: {
				queryStateParams: stateCode,
				queryParams: keyWord,
				formType:"expenditure",
				printState:printState
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
								'<td><label class="check-label yt-checkbox"><input type="checkbox" name="test" value="' + n.advanceAppId + '"/></label>' + '</td>'+
								'<td><a class="yt-link to-detail">' + n.advanceAppNum + '</a><input type="hidden" class="hid-advance-id" value="' + n.advanceAppId + '"/><input type="hidden" class="processInstanceId" value="'+n.processInstanceId+'"/></td>' +
								'<td class="tl">' + (n.advanceAppName == "" ? "--" : n.advanceAppName) + '</td>' +
								'<td style="text-align: right;">' + (n.advanceAmount == "" ? "--" : $yt_baseElement.fmMoney(n.advanceAmount)) + '</td>'+
								'<td>' + n.applicantUserName + '</td>' +
								'<td><span>' + n.applicantDept + '</span></td>'+
					        	'<td class="isprint-th"><span class="print-state" style="color: ' + (n.isPrint == 0 ? '#333333' : '#417095') + ';">'+ (n.isPrint == 0 ? '未打印' : '已打印') + '</span></td>'+
								'<td><a class="yt-link log-mod">日志</a></td>'+
								'</tr>';
							//存储数据data
							trStr = $(trStr).data("dataStr",n);
							htmlTbody.append(trStr);
						});
						//显示状态列
						$(".app-state-td,.app-state-th").show();
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
	//调用获取选中的Tab状态
	beforeApproList.searchList();
	//给页面设置最小高度
	$("#reimApproList").css("min-height", $(window).height() - 12);
})