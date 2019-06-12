var addTable = {
	tableId: "", //全局的id
	booksId:'',//全局张套id
	budgetStage:'',//全局阶段code
	init: function() {
		$("#addTable select").niceSelect();
		//获取页面跳转传输的参数对象
		var requerParameter = $yt_common.GetRequest();
		//获取传输的项目ID
		addTable.tableId = requerParameter.tableId;
		addTable.booksId = requerParameter.booksId;
		addTable.budgetStage=requerParameter.budgetStage;
		
		addTable.generateBtn();
		if(addTable.tableId != "" && addTable.tableId != null) {
			//调用获取表单详情方法
			addTable.getBudgetTableDetailByTableId();
		};
		
		addTable.getBudType();
	},
	//点击按钮生成并验证
	generateBtn: function() {
		//生成
		$("#generateBtn").off().on("click", function() {
			/** 
			 * 调用验证方法 
			 */
			if($yt_valid.validForm($(".bud-total"))) {
				//总列数
				var budgetCols = +$('#budgetCols').val();
				//表头总行数
				var budgetRows = +$('#budgetRows').val();
				//表身总行数
				var budgetBodyCols = +$('#budgetBodyCols').val();

				//验证是否已存在列表
				if($('#createTable .rule-table').length > 0) {
					//提示已存在
					$yt_alert_Model.alertOne({
						alertMsg: '重新生成会清空原有列表中的数据，确定继续吗？',
						confirmFunction: function() {
							//添加生成列表
							$('#createTable').newRuleTable({
								rowNum: budgetBodyCols,
								colNum: budgetCols,
								headRow: budgetRows,
								callback: function(obj) {
									//回调返回当前列表的行列数量
									//总列数
									$('#budgetCols').val(obj.cols);
									//表头总行数
									$('#budgetRows').val(obj.headRows);
									//表身总行数
									$('#budgetBodyCols').val(obj.rows);
								}
							});
						}
					});

				} else {
					//添加生成列表
					$('#createTable').newRuleTable({
						rowNum: budgetBodyCols,
						colNum: budgetCols,
						headRow: budgetRows,
						callback: function(obj) {
							//回调返回当前列表的行列数量
							//总列数
							$('#budgetCols').val(obj.cols);
							//表头总行数
							$('#budgetRows').val(obj.headRows);
							//表身总行数
							$('#budgetBodyCols').val(obj.rows);
						}
					});
				}
			};

		});
		//保存
		$("#saveBtn").off().on("click", function() {
			/** 
			 * 调用验证方法 
			 */
			if($yt_valid.validForm($(".start-name"))) {
				addTable.saveOrUpdateBudgetTableInfo();
			};
		});
		//取消按钮事件
		$('#approveCanelBtn').on("click", function() {
			//返回上一个页面
			window.history.back(-1);
		});
	},
	/**
	 * 
	 * 获取借款表单数据
	 * 
	 */
	getLoanFormData: function() {
		//表头单元格数据
		var theadCellsList = function() {
			var list = [];
			$('#createTable .yt-thead tr').each(function(i) {
				//list.push([]);
				$(this).find('th:not(.tab-indicate)').each(function(j, m) {
					list.push({
						colNum: 'c' + (j + 1), //行编号
						rowNum: 'r' + (i + 1), //列编号
						contents: $(m).html(), //单元格内容
						rowspan: $(m).attr('rowspan') || '', //合并行数量
						colspan: $(m).attr('colspan') || '', //合并列数据
						style: $(m).attr('style') || '' //单元格样式
					});
				});

			});
			return JSON.stringify(list);
		};
		//表数据单元格
		var tbodyCellsList = function() {
			var list = [];
			$('#createTable .yt-tbody tr').each(function(i) {
				//list.push([]);
				$(this).find('td').each(function(j, m) {
					list.push({
						colNum: 'c' + (j + 1), //行编号
						rowNum: 'r' + (i + 1), //列编号
						contents: $(m).html(), //单元格内容
						rowspan: $(m).attr('rowspan') || '', //合并行数量
						colspan: $(m).attr('colspan') || '', //合并列数据
						style: $(m).attr('style') || '' //单元格样式
					});
				});

			});
			return JSON.stringify(list);
		};
		//表属性数据
		var propertyList = function() {
			var list = [];
			//列的只读数据
			$('#createTable .indicate-head th.dis').each(function(i) {
				list.push({
					crNum: 'c' + ($(this).index()), //行/列编号
					property: 'READ_ONLY', //属性 只读: READ_ONLY
					type: 'c' //类型(r 行  c列)
				});
			});
			//行的只读数据
			$('#createTable .yt-tbody th.dis').each(function(i) {
				list.push({
					crNum: 'r' + ($(this).parent().index() + 1), //行/列编号
					property: 'READ_ONLY', //属性 只读: READ_ONLY
					type: 'r' //类型(r 行  c列)
				});
			});
			return JSON.stringify(list);
		};
		return {
			tableId: addTable.tableId, //预算表Id
			tableName: $("#budgetTableName").val(), //预算表名称
			tableYear: $("#budgetTableYear").val(), //预算表所属年份  
			tableDescribe: $("#budgetTableDescribe").val(), //预算表说明
			budgetStage: addTable.budgetStage, //预算表所属阶段
			budgetType: $('#budType option:selected').val(), //预算表类型
			drawTableId: $("#draw").val(), //自定义表Id
			booksId: addTable.booksId,//账套id
			tagging: $("#budgetCalibration").val(), //标注  budgetCalibration
			totalColsNum: $("#budgetCols").val(), //总列数
			theadRowsNum: $("#budgetRows").val(), //表头总行数
			tbodyRowsNum: $("#budgetBodyCols").val(), //数据总行数
			theadCellsList: theadCellsList(), //表头单元格数据json串
			tbodyCellsList: tbodyCellsList(), //表数据单元格数据json串
			propertyList: propertyList() //表属性数据json串
		}
	},
	/*
	 * 2.3.4.5获取预算表样式详情
	 */
	getBudgetTableDetailByTableId: function() {
		$.ajax({
			type: "post",
			url: "/budget/table/getBudgetTableDetailByTableId",
			data: {
				tableId: addTable.tableId
			},
			success: function(data) {
				if(data.flag == 0) {
					var dataObj = data.data;
					if(dataObj && dataObj != "" && dataObj != undefined) {
						//预算表名称
						$("#budgetTableName").val(dataObj.tableName);
						//预算表所属年度
						$("#budgetTableYear").val(dataObj.tableYear);
						//预算表描述
						$("#budgetTableDescribe").val(dataObj.tableDescribe);
						//标准
						$("#budgetCalibration").val(dataObj.tagging);
						//总列数
						$("#budgetCols").val(dataObj.totalColsNum);
						//表头总行数
						$("#budgetRows").val(dataObj.theadRowsNum);
						//表身总行数
						$("#budgetBodyCols").val(dataObj.tbodyRowsNum);
						//预算表所属阶段
						$('#unitCode option[value="' + dataObj.budgetStage + '"]').attr("selected", "selected");
						$('#unitCode').niceSelect();
						//预算表类型
						$('#budType option[value="' + dataObj.budgetType + '"]').attr("selected", "selected");
						$('#budType').niceSelect();
						//自定义表id
						$("#draw").val(dataObj.drawTableId)
						//还原数据表
						$('#createTable').newRuleTable({
							theads: dataObj.theads,
							tbodys: dataObj.tbodys,
							propertyList: dataObj.propertyList,
							callback: function(obj) {
								//回调返回当前列表的行列数量
								//总列数
								$('#budgetCols').val(obj.cols);
								//表头总行数
								$('#budgetRows').val(obj.headRows);
								//表身总行数
								$('#budgetBodyCols').val(obj.rows);
							}
						});
					}
				}
			}
		});
	},
	/**
	 * 2.3.4.2保存预算表样式数据
	 */
	saveOrUpdateBudgetTableInfo: function() {
		//获取表单数据
		var formDatas = addTable.getLoanFormData();
		$.ajax({
			type: 'post',
			url: '/budget/table/saveOrUpdateBudgetTableInfo',
			data: formDatas,
			success: function(data) {
				if(data.flag == 0) {
					//提交成功跳转列表页面
					window.location.href = $yt_option.websit_path + 'view/system-sasac/budget/module/expenditure/budgetTableStyle.html?booksId=' + addTable.booksId + '&budgetStage=' + addTable.budgetStage;
				}
			}
		});
	},
	
	/**
	 * 预算类型
	 */
	getBudType: function(code) {
		$.ajax({
			type: "post",
			url: $yt_option.base_path + '/budget/table/getBudgetClassifyDataByParams?tableKey=coso_classify_budget_type', //ajax访问路径  
			async: false,
			data: {
				pageIndex: 1,
				pageNum: 9999, //每页显示条数  
				pageSize: 10, //显示...的规律  
				params: ''
			},
			success: function(data) {
				var datas = data.data.rows;
				if(data.flag == 0) {
					var numOptions = '<option value="">请选择</option>';
					//判断返回的数据
					$('#budType').empty();
					if(datas.length > 0 && datas != undefined && datas != null) {
						$.each(datas, function(i, n) {
							numOptions += '<option value="' + n.code + '" sel-val="' + n.name + '">' + n.name + '</option>'
						});
						$('#budType').append(numOptions);
					}
					$('#budType').niceSelect();
				}
			}
		});

	},
}
$(function() {
	addTable.init();
})