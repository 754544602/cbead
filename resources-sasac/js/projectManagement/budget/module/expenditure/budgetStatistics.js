var budgetObj = {
	configData: [],
	booksId:"",//帐套Id
	budgetStage:"",//阶段code
	/**
	 * 初始化
	 */
	init: function() {
		//调用获取预算表数据方法
		//budgetObj.getTableData();
		var requerParameter = $yt_common.GetRequest();
		if(requerParameter){
			// 获取传输的项目ID
			budgetObj.booksId = requerParameter.booksId;
			budgetObj.budgetStage = requerParameter.budgetStage;
			//获取传输的项目ID
			var tableIdObj = requerParameter.tableOjbData;
			if(tableIdObj) {
				budgetObj.tableIdObj = JSON.parse(tableIdObj);
				//开始获取数据
				budgetObj.getTableDataStart();
			}
		}
	},
	/*
	 * 操作事件
	 */
	eventFun: function() {
		//点击编辑按钮
		$(".edit-btn").off().on("click", function() {
			//获取当前显示的表格
			var thisSelTable = $(".rule-table");
			//隐藏span文本显示
			thisSelTable.find("tbody tr:not(.disable-sty) td:not(.disable-sty) .money-text").hide();
			//将span中的数据赋值给输入框
			thisSelTable.find("tbody tr td .money-input").each(function() {
				$(this).val($(this).parent().find(".money-text").text());
			});
			//隐藏编辑按钮
			$(this).hide();
			//显示保存和取消,计算按钮,列表中所有的输入框
			thisSelTable.find("tr:not(.disable-sty) td:not(.disable-sty) .money-input").show();
			$(".init-calculate-btn,.init-cancel-btn,.init-save-btn").show();
		});
		//点击计算按钮
		$(".init-calculate-btn").off().on("click", function() {
			//调用计算表格数据方法
			budgetObj.calculateTableData();
		});
		//点击保存按钮
		$(".init-save-btn").off().on("click", function() {
			//获取选中的表格数据
			var selTabData = budgetObj.tableIdObj;
			var tabDatas = "";
			//获取表格数据
			var tableDatas = budgetObj.getSaveTableInfo();
			//获取存储数据,调用保存方法
			$.ajax({
				type: "post",
				url: 'budget/main/saveBudgetDataDetailInfo',
				data: {
					budgetDataJson: tableDatas,
					tableId: selTabData.tableId
				},
				async: false,
				success: function(data) {
					if(data.flag == "0") {
						//调用初始化顶部按钮方法
						budgetObj.initHeardBtn();

					}
					//判断操作是否成功
					$yt_alert_Model.prompt(data.message, 2000);
				}
			});
		});
		//点击取消按钮
		$(".init-cancel-btn").on("click", function() {
			//调用初始化顶部按钮方法
			budgetObj.initHeardBtn();
		});
		//调用金额输入框操作事件
		budgetObj.priceInputEvent();
	},
	/**
	 * 
	 * 金额输入框操作事件
	 * 
	 */
	priceInputEvent: function() {
		//表格中金额输入框获取焦点失去焦点事件
		$("#createConfigTableDiv tbody tr td input").each(function() {
			if($(this).hasClass(".character-inpu")) {

			}
		});
		$("#createConfigTableDiv").on("keyup", '.money-input', function() {
			//判断是否是文本
			if(!$(this).hasClass("character-inpu")) {
				$(this).val($(this).val().replace(/[^\d.]/g, ''));
			}
		});
		$("#createConfigTableDiv").on("focus", '.money-input', function() {
			if($(this).val() != "" && $(this).val() != null && !$(this).hasClass("character-inpu")) {
				$(this).val($yt_baseElement.rmoney($(this).val()));
				$(this).select();
			}
		});
		$("#createConfigTableDiv").on("blur", '.money-input', function() {

			if(!$(this).hasClass("character-inpu")) {
				if($(this).val() != "" && $(this).val() != null) {
					//格式化输入的金额数据
					$(this).val($yt_baseElement.fmMoney($(this).val()));
					$(this).parent().find(".money-text").text($(this).val());
				} else {
					$(this).parent().find(".money-text").text("0.00");
				}
			}
		});
	},
	/**
	 * 
	 * 初始化顶部按钮
	 * 
	 */
	initHeardBtn: function() {
		//显示编辑按钮,显示td中的span标签内容
		$(".edit-btn,.rule-table tbody tr td .money-text").show();
		//隐藏保存和取消按钮,隐藏列表中所有的输入框
		$(".init-save-btn,.init-cancel-btn,.init-calculate-btn,.rule-table tbody tr td .money-input").hide();
		//清空输入框的数据
		$(".rule-table tbody tr td .money-input").val('');
		$(".rule-table tbody tr td .money-text").text('');
		//调用获取初始化获取表格信息接口
		budgetObj.getTableInfoList();
	},
	/**
	 * 拼接td
	 * @param {Object} tableObj 表格数据对象信息
	 */
	addTdHtml: function(tableObj) {
		var thisTable = $('table.config-table[table-code="' + tableObj.tableCode + '"]');
		//获取列数
		var tdNum = thisTable.find("tbody tr.flag-tr td:not(.flag-td)").length;
		var noDataTdFlag = thisTable.find("tbody tr.flag-tr td.flag-td").length;
		var tdStr = "";
		//判断如果不是第26张表到第33张表,动态拼接td的处理方式
		if(tableObj.tableCode != "T26" && tableObj.tableCode != "T28" && tableObj.tableCode != "T29" && tableObj.tableCode != "T30" && tableObj.tableCode != "T31" && tableObj.tableCode != "T32" && tableObj.tableCode != "T33") {
			for(var i = 0; i < tdNum; i++) {
				tdStr += '<td class="right-td c' + (i + 1) + '" fieldFlag=c' + (i + 1) + '><span class="money-text"></span><input type="text" value="" class="money-input"/></td>';
			}
			if(noDataTdFlag == 1) {
				thisTable.find("tbody tr:gt(0)").each(function() {
					//先清除
					$(this).find('td:eq(0)').nextAll("td").remove();
					$(this).addClass('r' + $(this).index() + '');
					$(this).attr("fieldFlag", 'r' + $(this).index() + '');
					$(this).find('td:eq(0)').after(tdStr);
				});
			} else {
				thisTable.find("tbody tr:gt(0)").each(function() {
					//先清除
					$(this).find('td:gt(' + (noDataTdFlag - 2) + ')').nextAll("td").remove();
					$(this).addClass('r' + $(this).index() + '');
					$(this).attr("fieldFlag", 'r' + $(this).index() + '');
					$(this).find('td:gt(' + (noDataTdFlag - 2) + ')').after(tdStr);
				});
			}
		}

		//调用金额输入框操作事件
		budgetObj.priceInputEvent();
	},
	/**
	 * 
	 * 
	 * 初始获取表格数据
	 * 
	 * 
	 */
	getTableInfoList: function() {
		//获取选中的表格数据
		var selTabData = budgetObj.tableIdObj;
		$.ajax({
			type: "post",
			url: 'budget/main/getBudgetDataDetailInfo',
			async: false,
			data: {
				"tableId": selTabData.tableId
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
							$(".rule-table .yt-tbody tr:gt(0)").each(function(i, v) {
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
		//点击返回按钮操作事件
		
		$("button.page-retun-btn").click(function(){
			window.location.href=$yt_option.websit_path+'view/system-sasac/budget/module/expenditure/budgetTableStyle.html?booksId='+budgetObj.booksId+'&budgetStage='+budgetObj.budgetStage;
		});
	},
	/**
	 * 
	 * 计算单元格数据方法
	 * 
	 */
	calculateTableData: function() {
		//获取选中的表格数据
		var selTabData = budgetObj.tableIdObj;
		//获取表格数据
		var getTableDatas = budgetObj.getSaveTableInfo();
		$.ajax({
			type: "post",
			url: 'budget/main/calcBudgetData',
			async: false,
			data: {
				"tableId": selTabData.tableId,
				"budgetDataJson": getTableDatas
			},
			success: function(data) {
				//判断操作是否成功
				if(data.flag == 0) {
					if(data.data.length > 0) {
						//遍历数据集
						$.each(data.data, function(i, n) {
							//遍历当前显示表格的行
							$(".rule-table tbody tr:gt(0)").each(function(i, r) {
								//找到所有的计算行,并且比对行
								if($(r).attr("fieldflag") == n.rowNum) {
									//遍历当前行下所有的计算列
									$.each($(r).find("td"), function(i, c) {
										//比对计算列
										if($(c).attr("fieldflag") == n.cellNum) {
											//获取金额数据
											$(c).find(".money-text").html($yt_baseElement.fmMoney(n.crValue));
											$(c).find(".money-input").val($yt_baseElement.fmMoney(n.crValue));
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
	/**
	 * 
	 * 计算合计金额
	 * 
	 */
	totalMoney: function(obj) {
		//行和列配置信息
		var thisTrConfig = "";
		var thisTdConfig = "";
		var thisTd = "";
		var tdVal = "";
		/**
		 * 遍历所有是计算项的列
		 */
		var thisTr = "";
		var price = 0;
		//console.log("--------------");
		//使用单元格集合
		var useConfigData = [];
		var cFieldflag = $(obj).attr("fieldflag");
		var rFieldflag = $(obj).parent().attr("fieldflag");
		//console.log(cFieldflag+"++"+rFieldflag);
		for(var n = 0; n < budgetObj.configData.length; n++) {
			var calvValue = budgetObj.configData[n].calcValue;
			calvValue = calvValue.replace(/\+/g, '#');
			calvValue = calvValue.replace(/\-/g, '#');
			calvValue = calvValue.replace(/\*/g, '#');
			calvValue = calvValue.replace(/\//g, '#');
			calvValue = calvValue.replace(/\(/g, '#');
			calvValue = calvValue.replace(/\)/g, '#');
			calvValue = "#" + calvValue + "#";
			if(calvValue.indexOf("#" + cFieldflag + "#") != -1 || calvValue.indexOf("#" + rFieldflag + "#") != -1) {
				useConfigData.push(budgetObj.configData[n]);
			}
		}
		//console.log(useConfigData);
		$.each(useConfigData, function(i, n) {
			if(n.type == "c") {
				budgetObj.totalMoneyFun($(obj).parent().find("td[fieldflag='" + n.crNum + "']"));
			} else {
				budgetObj.totalMoneyFun($(".rule-table tr[fieldflag='" + n.crNum + "']").find("td[fieldflag='" + cFieldflag + "']"));
			}
		})
	},
	/**
	 * 
	 * @param {Object} ele
	 */
	totalMoneyFun: function(ele) {
		//行和列配置信息
		var configData;
		var thisTrConfig = "";
		var thisTdConfig = "";
		var thisTd = "";
		var tdVal = "";
		var tdNum = 0;
		var repStr = "";
		/**
		 * 遍历所有是计算项的列
		 */
		var thisTr = "";
		var price = 0;
		$.each(ele, function(i, r) {
			try {
				//获取当前td的配置信息
				thisTdConfig = $(this).data("configData");
				thisTrConfig = $(this).parent().data("configData");
				thisTd = $(this).index();
				thisTr = $(this).parent();
				//如果行的配置项是计算项
				if(thisTrConfig && thisTrConfig.calcItem == "1") {
					tdVal = thisTrConfig.calcValue;
					configData = thisTrConfig;
				} else {
					tdVal = thisTdConfig.calcValue;
					configData = thisTdConfig
				}
				//判断行的配置
				//获取行的公式
				if(tdVal != "" && tdVal != undefined) {
					tdNum = $(".rule-table tbody tr").length;
					repStr = "r";
					if(configData.type == "c") {
						tdNum = $(".rule-table tbody tr:eq(0) td").length;
						repStr = "c";
					}
					for(var j = tdNum; j > 0; j--) {
						var re = new RegExp(repStr + j, "g");
						price = 0;
						if(configData.type == "c") {
							var re = new RegExp("c" + j, "g");
							if($(thisTr).find("td").eq(j + 2).find("span").text() == "") {
								price = 0;
							} else {
								price = $yt_baseElement.rmoney($(thisTr).find("td").eq(j + 2).find("span").text());
							}
						} else {

							if($(".rule-table .r" + j).find("td").eq(thisTd).find("span").text() == "") {
								price = 0;
							} else {
								price = $yt_baseElement.rmoney($(".rule-table .r" + j).find("td").eq(thisTd).find("span").text());
							}
						}
						tdVal = tdVal.replace(re, price);

					}
					if(isNaN(eval(tdVal))) {
						$(this).find("span").text("error");
					} else {
						$(this).find("span").text($yt_baseElement.fmMoney(eval(tdVal)));
					}
				}
			} catch(e) {
				//TODO handle the exception
				$(this).find("span").text("error");
			}
			//budgetObj.totalMoney(r);
		});

	},
	/**
	 * 
	 * 获取表格编辑后的数据
	 * 
	 */
	getSaveTableInfo: function() {
		//获取行程计划数据
		var tableList = [];
		var tableJson = "";
		var thisTableTbody = $(".rule-table tbody");
		var rowConfig; //行的配置数据
		var colConfig; //列的配置数据
		var price = 0; //金额
		var budgetMainId = "";
		//遍历行
		thisTableTbody.find("tr:gt(0)").each(function(i, n) {
			//排除是计算项的数据
			if(!$(n).hasClass("disable-sty")) {
				//遍历td
				$(n).find("td").each(function(v, c) {
					//排除是计算项的数据
					if(!$(c).hasClass("disable-sty")) {
						//获取单元格金额数据
						price = 0;
						if($(c).find(".money-input") != undefined && $(c).find(".money-input").length > 0 && $(c).find(".money-input").val() != "") {
							if(!$(c).find(".money-input").hasClass("character-inpu")) {
								price = $yt_baseElement.rmoney($(c).find(".money-input").val());
							} else {
								price = $(c).find(".money-input").val();
							}
						}
						budgetMainId = "";
						//获取预算ID
						if($(c).attr("budgetMainId") != undefined && $(c).attr("budgetMainId").length > 0) {
							budgetMainId = $(c).attr("budgetMainId");
						}
						var propertyInfo = {};
						propertyInfo["cellNum"] = $(this).attr("fieldflag"); //列的编号
						propertyInfo["rowNum"] = $(this).parent().attr("fieldflag"); //行的编号
						propertyInfo["crNum"] = $(this).attr("fieldflag") + $(this).parent().attr("fieldflag"); //单元格的编号
						propertyInfo["crValue"] = price; //单元格金额
						propertyInfo["budgetMainId"] = budgetMainId; //预算数据id
						tableList.push(propertyInfo);
					}
				});
			}
		});
		if(tableList.length > 0) {
			tableJson = JSON.stringify(tableList);
		}
		return tableJson;
	},
	/**
	 * 
	 * 初始获取配置项信息
	 * 
	 */
	getConfigInfo: function(selTabData) {
		budgetObj.configData = [];
		$.ajax({
			type: "post",
			url: 'budget/table/getTableAllCongfigByTableId',
			async: false,
			data: selTabData,
			success: function(data) {
				var crNums = "";
				//判断操作是否成功
				if(data.flag == 0) {
					if(data.data.length > 0) {
						budgetObj.configData = data.data;
						$.each(data.data, function(i, n) {
							//判断类型如果是单元格
							if(n.type == "cr") {
								crNums = n.crNum.split("-");
								//遍历行
								$(".rule-table tbody tr:gt(0)").each(function(i, r) {
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
	 * 
	 * 获取预算表信息
	 * 
	 */
	getTableData: function() {
		$.post("budget/table/getTableDetailListByParams", function(data) {
			if(data.flag == 0) {
				var trDoc = '';
				//拼接预算表数据
				$.each(data.data, function(i, n) {
					trDoc = '<tr>' +
						'<td>' + n.tableCode + '</td>' +
						'<td>' + n.budgetTypeName + '</td>' +
						'<td style="text-align: left;">' + n.tableName + '</td>' +
						'<td>' + n.lastOperatorUserName + '</td>' +
						'<td>' + n.lastOperatorDateTime + '</td>' +
						'</tr>';
					$("#table-list tbody").append(trDoc);
					//绑定列表点击事件
					$("#table-list tbody tr").last().data("tableData", n).click(function() {
						//切换选择样式
						$(this).addClass("yt-table-active").siblings().removeClass("yt-table-active");
						//切换表格显示
						$(".table-config .no-select-table").hide();
						$('.table-config .config-table').removeClass("select-table").hide();
						//比对表格code显示对应的表格
						$('.table-config table[table-code="' + n.tableCode + '"]').show().addClass("select-table");

						$(".table-config table").eq($(this).index()).show().addClass("select-table").siblings().removeClass("select-table").hide();
						//切换到表格配置区域
						$(".tab-content:eq(1)").show().siblings().hide();
						//显示操作按钮
						$(".btn-group-model").show();
						$(".btn-group-model .tab-name").text(n.tableName);
						//获取预算表样式详情
						budgetObj.getBudgetTableDetailByTableId(n.tableId);
						//调用拼接Td的方法
						budgetObj.addTdHtml(n);
						//调用获取配置信息方法
						budgetObj.getConfigInfo(n);
						//调用获取初始化获取表格信息接口
						//budgetObj.getTableInfoList();
						//调用初始化顶部按钮方法
						budgetObj.initHeardBtn();
					});
				});
			}
		});
	},
	/**
	 * 获取单条预算表信息
	 */
	getTableDataStart:function(){
		var n = budgetObj.tableIdObj;
		//切换选择样式
		$(this).addClass("yt-table-active").siblings().removeClass("yt-table-active");
		//切换表格显示
		$(".no-select-table").hide();
		$('.config-table').removeClass("select-table").hide();
		//比对表格code显示对应的表格
		$('table[table-code="' + n.tableCode + '"]').show().addClass("select-table");
		//$("table").eq($(this).index()).show().addClass("select-table").siblings().removeClass("select-table").hide();
		//切换到表格配置区域
		$(".tab-content:eq(1)").show().siblings().hide();
		//显示操作按钮
		$(".btn-group-model").show();
		$(".btn-group-model .tab-name").text(n.tableName);
		//获取预算表样式详情
		budgetObj.getBudgetTableDetailByTableId(n.tableId);
		//调用拼接Td的方法
		budgetObj.addTdHtml(n);
		//调用获取配置信息方法
		budgetObj.getConfigInfo(n);
		//调用获取初始化获取表格信息接口
		//budgetObj.getTableInfoList();
		//调用初始化顶部按钮方法
		budgetObj.initHeardBtn();
	},
	/**
	 * 2.3.4.5	获取预算表样式详情
	 * @param {Object} tableId
	 */
	getBudgetTableDetailByTableId: function(tableId) {
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
				$('#createConfigTableDiv').html('').newRuleTable({
					theads: dataObj.theads,
					tbodys: dataObj.tbodys,
					propertyList: dataObj.propertyList,
					//不绑定列表操作事件
					eventCheck: false,
					//不添加列表序号
					serialNumber: false
				});
				//只读的属性list
				var propertyList = dataObj.propertyList;
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
				$('.rule-table').data('tableData', dataObj);

				//设置表格tr td的序号
				$('.rule-table tbody tr').each(function(i) {
					$(this).attr('fieldflag', 'r' + (i + 1)).addClass('r' + (i + 1)).find('td').each(function(j) {
						$(this).attr('fieldflag', 'c' + (j + 1)).addClass('c' + (j + 1));
					});
				});

				//未禁用的td内添加文本和输入框
				$('.rule-table tbody tr td:not(.disable-sty)').each(function() {
					var html = $(this).html();
					html = '<span class="money-text">' + html + '</span><input class="yt-input money-input" value="" />';
					$(this).html(html);
				});
			}
		});
	},
	/**
	 * 设置数据表格中的文本和输入框
	 */
	setRuleTableToggle: function() {

	}
}

$(function() {
	//添加layout的高度
	$(".easyui-layout:not(.fun-btn-model)").css("height", $(window).height() + "px");
	$(".easyui-layout:not(.fun-btn-model)").layout("resize", {
		width: "100%",
		height: ($(window).height() - 10) + "px"
	});
	budgetObj.init();
	budgetObj.eventFun();
});