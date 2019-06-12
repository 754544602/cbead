var summPreviewObj = {
	tableId:"",//表Id
	budgetStage:"",//阶段
	configData:[],
	init:function(){
		//获取页面跳转传输的参数对象  
		var requerParameter = $yt_common.GetRequest(); 
		if(requerParameter !=null && requerParameter !=""){
			//表Id
			summPreviewObj.tableId = requerParameter.tableId;
			//阶段
			summPreviewObj.budgetStage = requerParameter.budgetStage;
			//调用获取表样式信息方法
			summPreviewObj.getBudgetTableDetail();
		}
		//调用操作事件方法
	    summPreviewObj.events();
	},events:function(){
		$("button.close-btn").click(function(){
			window.close();
		});
	},
	/**
	 * 获取预算表样式详情
	 */
	getBudgetTableDetail: function() {
		$.ajax({
			type: 'post',
			url: 'budget/main/getTotalBudgetTableDetailInfo',
			async: false,
			data: {
				tableId:summPreviewObj.tableId,
				budgetStage:summPreviewObj.budgetStage
			},
			success: function(data) {
				var dataObj = data.data || {};
				//表样信息数据
				var  tableStyle = dataObj.tableStyle;
				//表格数据
				var  budgetData = dataObj.budgetData;
				//获取表名称
			    $(".table-name").text(tableStyle.tableName);
			    //赋值阶段信息
				$(".stage").text(tableStyle.budgetStageName);
				//单位
				$(".label-msg").text(tableStyle.tagging);
				//还原数据表
				$('#createConfigTableDiv').html('').newRuleTable({
					theads: tableStyle.theads,
					tbodys: tableStyle.tbodys,
					propertyList: tableStyle.propertyList,
					//不绑定列表操作事件
					eventCheck: false,
					//不添加列表序号
					serialNumber: false
				});
				//只读的属性list
				var propertyList = tableStyle.propertyList;
				for(var i = 0, len = propertyList.length; i < len; i++) {
					var proper = propertyList[i];
					//拆分所属下标
					var index = proper.crNum.replace(proper.type, '');
					if(proper.type == 'c') {
						$('.rule-table .yt-tbody tr').each(function() {
							$(this).find('td').eq(index - 1).addClass('disable-sty');
						});
					} else if(proper.type == 'r') {
						$('.rule-table .yt-tbody tr').eq(index - 1).find('td,th').addClass('disable-sty');
					}
				}
				//设置表格基础数据、
				$('.rule-table').data('tableData', tableStyle);

				//设置表格tr td的序号
				$('.rule-table tbody tr').each(function(i) {
					$(this).attr('fieldflag', 'r' + (i + 1)).addClass('r' + (i + 1)).find('td').each(function(j) {
						$(this).attr('fieldflag', 'c' + (j + 1)).addClass('c' + (j + 1));
					});
				});

				//未禁用的td内添加文本和输入框
				$('.rule-table tbody tr td:not(.disable-sty)').each(function() {
					var html = $(this).html();
					html = '<span class="money-text">' + html + '</span>';
					$(this).html(html);
				});
				
				//判断是否有未提交数据
				var rNum = "";
				var cNum = "";
				for (var r = 1;r<=tableStyle.theadRowsNum;r++) {
					rNum = "r"+r;
					for (var c = 1;c<= tableStyle.totalColsNum;c++) {
						cNum = "c"+c;
						var state = tableStyle.tbodys[rNum][cNum].submitState;
					   if(state == "2" || state == 2){
					   	  var tdData = $(".rule-table").find("tr." + rNum + " td." + cNum);
					   	  $(tdData).addClass("subBak");
					   }
					}
				}
				
				//重新计算th的宽度
				//获取只读列的个数
				var disLen = $('.rule-table thead th.dis').length;
				var width = parseInt($(window).width()) / (tableStyle.totalColsNum);
				width = width > 130 ? 130 : parseInt(width);
				$('.rule-table thead th:not(.dis)').css("min-width",(width-15)+"px");
				//调用获取预算表配置方法
				summPreviewObj.getConfigInfo();
				//调用获取预算表格数据方法
				summPreviewObj.getTableInfoList(budgetData);
			}
		});
	},
	/**
	 * 
	 * 初始获取配置项信息
	 * 
	 */
	getConfigInfo: function() {
		summPreviewObj.configData = [];
		$.ajax({
			type: "post",
			url: 'budget/confg/getTableAllCongfigByTableId',
			async: false,
			data: {
				tableId:summPreviewObj.tableId
			},
			success: function(data) {
				var crNums = "";
				//判断操作是否成功
				if(data.flag == 0) {
					if(data.data.length > 0) {
						summPreviewObj.configData = data.data;
						$.each(data.data, function(i, n) {
							//判断类型如果是单元格
							if(n.type == "cr") {
								crNums = n.crNum.split("-");
								//遍历行
								$(".rule-table tbody tr").each(function(i, r) {
									//比对行
									if(crNums[1] == $(this).attr("fieldFlag")) {
										//判断如果行的属性是文本
										if(n.calcItem && n.calcItem == "2") {
											//找到输入框添加文本标识类
											$(r).find("input.money-input").addClass("character-inpu");
										}
										//找到对应的列
										$.each($(r).find("td"), function(i, c) {
											//比对列
											if(crNums[0] == $(c).attr("fieldFlag")) {
												//判断是1是单表有计算项,4是表间有计算项,是则不可编辑单元格2文本3数字
												if(n.calcItem == "1" || n.calcItem == "4") {
													$(c).addClass("disable-sty");
												}
												//判断如果是文本
												/*if(n.calcItem == "2"){
													//找到输入框添加文本标识类
													$(c).find("input.money-input").addClass("character-inpu");
												}*/
												$(c).data("configData", n);
											}
										});
									}
								});
							} else {
								//遍历行
								$(".rule-table tbody tr").each(function(i, r) {
									//比对行
									if(n.crNum == $(this).attr("fieldFlag")) {
										//判断是1是单表有计算项,4是表间有计算项,是则不可编辑单元格2文本3数字
										if(n.calcItem == "1" || n.calcItem == "4") {
											$(this).addClass("disable-sty").find('td').addClass("disable-sty");
										}
										//判断如果是文本
										if(n.calcItem == "2") {
											//找到输入框添加文本标识类
											$(this).find("input.money-input").addClass("character-inpu");
										}
										$(this).data("configData", n);
									}
								});
								//遍历列
								$(".rule-table tbody tr td").each(function(v, c) {
									//比对列
									if(n.crNum == $(this).attr("fieldFlag")) {
										//判断是1是单表有计算项,4是表间有计算项,是则不可编辑单元格2文本3数字
										if(n.calcItem == "1" || n.calcItem == "4") {
											$(this).addClass("disable-sty");
										}
										//判断如果是文本
										/*if(n.calcItem == "2"){
											//找到输入框添加文本标识类
											$(this).find("input.money-input").addClass("character-inpu");
										}*/
										$(this).data("configData", n);
									}
								});
							}
						});
					}
				} else {
					$yt_alert_Model.prompt(data.message, 2000);
				}
			}
		});
	},
	/**
	 * 初始获取表格数据
	 * @param {Object} budgetData 表格数据信息
	 */
	getTableInfoList: function(budgetData) {
		if(budgetData !=undefined && budgetData !=null && budgetData.length > 0) {
			//数据列表对象
			var tbody = $('.rule-table .yt-tbody');
			//遍历数据集
			$.each(budgetData, function(i, n) {
				//遍历有效行
				$(".rule-table .yt-tbody tr").each(function(i, v) {
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
									//判断是否包含未提交的标识
									if(!$(c).hasClass("subBak")){
										$(c).find(".money-text").html(n.crValue);
										$(c).find(".money-input").val(n.crValue);
									}
								}
								//存储数据
								$(c).data("cellData",n);
							}
						});
					}
				});
			});
		}
	}
}
$(function(){
	summPreviewObj.init();
});
