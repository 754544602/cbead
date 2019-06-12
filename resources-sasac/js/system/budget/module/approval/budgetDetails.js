var approveObj = {
	budgetAppId: "", //申请Id
	processInstanceId: "", //流程实例id
	init: function() {
		//获取申请Id
		approveObj.budgetAppId = $yt_common.GetQueryString('budgetAppId');
		// 获取传输的项目ID
		var processInstanceId = $yt_common.GetQueryString('processInstanceId');
		//调用获取流程日志方法
		var flowLogHtml = sysCommon.getCommentByProcessInstanceId(processInstanceId);
		$(".flow-log-div").html(flowLogHtml);
		//调用公用方法生成流程审批区域代码,追加在底部按钮前面
		if(approveObj.budgetAppId && approveObj.budgetAppId != undefined && approveObj.budgetAppId != "") {
			//调动获取申请详细信息方法
			approveObj.getBudgetApplyDetailInfo();
			//调用获取表格数据方法
			approveObj.getTableModelInfo();
		}
		//调用初始操作事件化方法
		approveObj.initEvent();
	},
	/**
	 * 
	 * 获取预算申请单据详情
	 * 
	 */
	getBudgetApplyDetailInfo: function() {
		$.ajax({
			type: 'post',
			url: 'budget/appMain/getBudgetAppInfoByAppId',
			async: false,
			data: {
				"budgetAppId": approveObj.budgetAppId
			},
			success: function(data) {
				if(data.flag == 0) {
					if(data.data) {
						var datas = data.data;
						//调用设置值方法,传输数据对象  
						$(".apply-main-model").setDatas(datas);
						//存储数据集
						$(".apply-main-model").data("applyData", datas);
						//赋值全局的流程实例Id
						approveObj.processInstanceId = datas.processInstanceId;
						//基础信息
						$("#busiUsers").text(datas.applicantUserName);
						$("#deptName").text(datas.applicantUserDeptName);
						$("#jobName").text(datas.applicantUserJobName == "" ? "--" : datas.applicantUserJobName);
						$("#telPhone").text(datas.applicantUserPhone == "" ? "--" : datas.applicantUserPhone);
					}
				} else {
					$yt_alert_Model.prompt(data.message);
				}
			}
		});
	},
	initEvent: function() {
		//关闭按钮点击事件
		$("#cancelBtn").click(function() {
			if(window.top == window.self) { //不存在父页面
				window.close();
			} else {
				parent.closeWindow();
			}
		});
	},
	/**
	 * 
	 * 
	 * 获取表模板
	 * 
	 * 
	 */
	getTableModelInfo: function() {
		//获取表单数据集
		var applyData = $(".apply-main-model").data("applyData");
		//调用获取相同属性的表格
		$.ajax({
			type: 'post',
			url: 'budget/details/getTabInfoListByParams',
			data: {
				booksId: applyData.booksId, //帐套Id
				budgetStage: applyData.budgetStage, //阶段code
				deptId: '' //部门Id
			},
			success: function(data) {
				if(data.flag == 0) {
					if(data.data && data.data.length > 0) {
						//数据获取成功拼接easyui的tab
						var contStr = "";
						//显示表格面板,隐藏暂无数据
						$('#tableTemplate').show();
						$(".listNoData").hide();
						//重新创建存储对象
						$(".temp-model").html('<div id="tableTemplate"></div>')
						$.each(data.data, function(i, n) {
							contStr = '<div title="' + n.tableName + '">' +
								'<input type="hidden" class="hid-table-id" value="' + n.tableId + '"/>' +
								'<input type="hidden" class="hid-table-code" value="' + n.tableCode + '"/>' +
								'</div>';
							$("#tableTemplate").append(contStr);
						});
						$('#tableTemplate').tabs({
							onSelect: function(title, index) {
								//获取当前选择的表格Id
								var tableId = $(".tabs-panels .panel").eq(index).find(".panel-body input.hid-table-id").val();
								//获取当前选择的表格code
								var tableCode = $(".tabs-panels .panel").eq(index).find(".panel-body input.hid-table-code").val();
								//存储选中的tab索引
								var tabIndex = index;
								//获取当前选中的面板
								var thisSelPanel = $(".tabs-panels .panel").eq(tabIndex).find(".panel-body");
								//调用获取表格模板接口
								approveObj.getBudgetTableDetailByTableId(tableId, thisSelPanel);
								//调用获取配置信息方法
								approveObj.getTableInfoList(tableId, thisSelPanel);
								//拼接标题
								$(".tabs-panels .panel").eq(tabIndex).find(".panel-body .tab-table-title").remove();
								var tableTitle = '<div class="tab-table-title">' + tableCode + '--' + title + '</div>';
								$(".tabs-panels .panel").eq(tabIndex).find(".panel-body table").before(tableTitle);
							}
						});
						//设置选中第一个tab标签
						$('#tableTemplate').tabs('select', 0);
					} else {
						//隐藏表格面板,显示暂无数据
						$('#tableTemplate').hide();
						$(".listNoData").show();
					}
				} else {
					//隐藏表格面板,显示暂无数据
					$('#tableTemplate').hide();
					$(".listNoData").show();
					$yt_alert_Model.prompt(data.message);
				}
			}
		});
	},
	/**
	 * 2.3.4.5	获取预算表样式详情
	 * @param {Object} tableId  表格id
	 * @param {Object} creatTableAreaObj  创建表格区域
	 */
	getBudgetTableDetailByTableId: function(tableId, creatTableAreaObj) {
		$.ajax({
			type: 'post',
			url: 'budget/table/getBudgetTableDetailByTableId',
			async: false,
			data: {
				tableId: tableId
			},
			success: function(data) {
				var dataObj = data.data || {};
				//还原数据表
				$(creatTableAreaObj).newRuleTable({
					theads: dataObj.theads,
					tbodys: dataObj.tbodys,
					propertyList: dataObj.propertyList,
					//是否绑定列表操作事件
					eventCheck: false,
					//是否添加序号 serialNumber
					serialNumber: false
				});
				//只读的属性list
				var propertyList = dataObj.propertyList;
				for(var i = 0, len = propertyList.length; i < len; i++) {
					var proper = propertyList[i];
					//拆分所属下标
					var index = proper.crNum.replace(proper.type, '');
					if(proper.type == 'c') {
						$(creatTableAreaObj).find('.rule-table .indicate-head tr .indicate').eq(index - 1).addClass('dis');
						$(creatTableAreaObj).find('.rule-table .yt-tbody tr').each(function() {
							$(this).find('td').eq(index - 1).addClass('dis');
						});
					} else if(proper.type == 'r') {
						$(creatTableAreaObj).find('.rule-table .yt-tbody tr').eq(index - 1).find('td,th').addClass('dis');
					}
				}
				//设置表格基础数据、
				$('.rule-table').data('tableData', dataObj);
				//设置表格tr td的序号
				$(creatTableAreaObj).find('.rule-table tbody tr').each(function(i) {
					$(this).attr('fieldflag', 'r' + (i + 1)).addClass('r' + (i + 1)).find('td').each(function(j) {
						$(this).attr('fieldflag', 'c' + (j + 1)).addClass('c' + (j + 1));
					});
				});
				//未禁用的td内添加文本和输入框
				$(creatTableAreaObj).find('.rule-table tbody tr td:not(.disable-sty)').each(function() {
					var html = $(this).html();
					//是否是数字
					if(!isNaN(html)) {
						html = '<span class="money-text">' + html + '</span>';
					}else{
						html = '<span>' + html + '</span>';
					}
					$(this).html(html);
				});
			}
		});
	},
	/**
	 * 获取表格数据信息
	 * @param {Object} tableId 预算表Id
	 * @param {Object} thisPanel 当前面板
	 */
	getTableInfoList: function(tableId, thisPanel) {
		//获取表单数据集
		var applyData = $(".apply-main-model").data("applyData");
		$.ajax({
			type: "post",
			url: 'budget/details/getBudgetDataDetailInfoByTable',
			async: false,
			data: {
				tableId: tableId, //表Id
				booksId: applyData.booksId, //帐套Id
				budgetStage: applyData.budgetStage, //阶段code
				deptId: '' //部门Id
			},
			success: function(data) {
				//判断操作是否成功
				if(data.flag == 0) {
					if(data.data.length > 0) {
						//数据列表对象
						var tbody = $('.rule-table .yt-tbody');
						//遍历数据集
						$.each(data.data, function(i, n) {
							//遍历有效行
							$(thisPanel).find(".rule-table .yt-tbody tr").each(function(i, v) {
								//找到对应的行
								if($(v).attr("fieldFlag") == n.rowNum) {
									//遍历列
									$(v).find("td").each(function(t, c) {
										//找到对应的列
										if($(c).attr("fieldFlag") == n.cellNum) {
											//存储预算ID
											$(c).attr("budgetMainId", n.budgetMainId);
											//赋值数据金额
											if(n.crValue != "" && n.crValue != null && n.crValue != undefined) {
												//是否是数字
												if(!isNaN(n.crValue)) {
													n.crValue = $yt_baseElement.fmMoney(n.crValue);
												}
												$(c).find(".money-text").html(n.crValue);
												$(c).find(".money-input").val(n.crValue);
											}
										}
									});
								}
							});
						});
					}
				} else {
					$yt_alert_Model.prompt(data.message, 2000);
				}
			}
		});
	},
}
$(function() {
	//调用初始化方法
	approveObj.init();
});