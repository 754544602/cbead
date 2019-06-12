var detailObj = {
	booksId:'',//帐套Id
	init: function() {
		//初始化select控件
		$("select").niceSelect();
		//调用获取部门和预算阶段数据方法
		detailObj.getAllDeptsAndStageInfo();
		//获取页面跳转传输的参数
		detailObj.booksId = $yt_common.GetQueryString('booksId');
		//获取预算年度
		var  booksYear = $yt_common.GetQueryString('booksYear'); 
		$(".year-val").text(booksYear );
		//给当前页面设置最小高度
		$(".apply-main-model").css("min-height", $(window).height() - 18);
		//调用表格模板操作事件
		detailObj.tableModelEvent();
		//调用父级关闭当前窗体方法
		$("#cancelBtn").click(function() {
			$yt_common.parentAction({
				url: $yt_option.parent_action_path, //父级中转地址,固定配置项,只有统一修改处理。  
				funName: 'locationToMenu', //指定方法名，定位到菜单方法  
				data: {
					url: 'view/system-sasac/budget/module/expenditure/budgetTableManager.html' //要跳转的页面路径  
				}
			});
		});
	},
	//获取所有部门和阶段数据
	getAllDeptsAndStageInfo: function() {
		//获取部门处室数据
		$.ajax({
			type: "post",
			url: "user/userInfo/getAllDeptsInfo",
			async:false,
			success: function(data) {
				var datas = data.data;
				if(data.flag == 0) {
					//1.遍历数据,给select赋值 
					$.each(datas, function(i, n) {
						if(n.type == 2) {
							$('select.dept-sel').append('<option value="' + n.id + '">' + n.text + '</option>');
						}
					});
					$("select.dept-sel").niceSelect();
					$("select.dept-sel").change(function(){
						//调用获取表格数据方法
						detailObj.getTableModelInfo();
					});
				}
			}
		});
		//获取阶段数据
		$.ajax({
			type: "post",
			url: "budget/details/getBudgetStageInfo",
			async:false,
			data: {
				type: '2'
			},
			success: function(data) {
				var datas = data.data;
				if(data.flag == 0) {
					//1.遍历数据,给select赋值 
					$.each(datas, function(i, n) {
						$('select.stage-sel').append('<option value="' + n.budgetStage + '">' + n.budgetStageName + '</option>');
					});
					$("select.stage-sel").niceSelect();
					$("select.stage-sel").change(function(){
						//调用获取表格数据方法
						detailObj.getTableModelInfo();
					});
				}
			}
		});
	},
	/**
	 * 
	 * 表格模板操作事件
	 * 
	 */
	tableModelEvent: function() {
		//调用获取表格数据方法
		detailObj.getTableModelInfo();
	},
	/**
	 * 
	 * 
	 * 获取表格模板信息
	 * 
	 * 
	 */
	getTableModelInfo: function() {
		//调用获取相同属性的表格
		$.ajax({
			type: 'post',
			url: 'budget/details/getTabInfoListByParams',
			data: {
				booksId:detailObj.booksId,//帐套Id
				budgetStage:$("select.stage-sel").val(),//阶段code
				deptId:$("select.dept-sel").val()//部门Id
			},
			success: function(data) {
				if(data.flag == 0) {
					//数据获取成功拼接easyui的tab
					var contStr = "";
					if(data.data && data.data.length > 0) {
						//显示表格面板,隐藏暂无数据
						$('#tableTemplate').show();
						$(".listNoData").hide();
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
								detailObj.getBudgetTableDetailByTableId(tableId, thisSelPanel);
								//调用获取配置信息方法
								detailObj.getTableInfoList(tableId,thisSelPanel);
								//拼接标题
								$(".tabs-panels .panel").eq(tabIndex).find(".panel-body .tab-table-title").remove();
								var tableTitle = '<div class="tab-table-title">' + tableCode + '--' + title + '</div>';
								$(".tabs-panels .panel").eq(tabIndex).find(".panel-body table").before(tableTitle);
							}
						});
						//获取当前选中的tab对象
						var tab = $('#tableTemplate').tabs('getSelected');
						//获取当前选中的tab索引
						var index = $('#tableTemplate').tabs('getTabIndex',tab);
						//设置选中当前选中的tab
						$('#tableTemplate').tabs('select',index);
						//获取当前选择的表格Id
						var tableId = $(".tabs-panels .panel").eq(index).find(".panel-body input.hid-table-id").val();
						//获取当前选择的表格code
						var tableCode = $(".tabs-panels .panel").eq(index).find(".panel-body input.hid-table-code").val();
						//存储选中的tab索引
						var tabIndex = index;
						//获取当前选中的面板
						var thisSelPanel = $(".tabs-panels .panel").eq(tabIndex).find(".panel-body");
						//调用获取表格模板接口
						detailObj.getBudgetTableDetailByTableId(tableId, thisSelPanel);
						//调用获取配置信息方法
						detailObj.getTableInfoList(tableId,thisSelPanel);
					}else{
						//隐藏表格面板,显示暂无数据
						$('#tableTemplate').hide();
						$(".listNoData").show();
					}
				}else{
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
				if(data.flag == 0){
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
					$(creatTableAreaObj).find('.rule-table').data('tableData', dataObj);
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
				}else{
					$yt_alert_Model.prompt(data.message, 2000);
				}
			}
		});
	},
	/**
	 * 获取表格数据信息
	 * @param {Object} tableId 预算表Id
	 * @param {Object} thisPanel 当前面板
	 */
	getTableInfoList: function(tableId,thisPanel) {
		$.ajax({
			type: "post",
			url: 'budget/details/getBudgetDataDetailInfoByTable',
			async: false,
			data: {
				tableId:tableId,//表Id
				booksId:detailObj.booksId,//帐套Id
				budgetStage:$("select.stage-sel").val(),//阶段code
				deptId:$("select.dept-sel").val()//部门Id
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
	}
}
$(function() {
	//调用初始化方法
	detailObj.init();
});