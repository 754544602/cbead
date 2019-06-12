var  summReportObj = {
	tableId:"",//表Id
	budgetStage:"",//阶段,
	configData:[],//配置信息数据
	init:function(){
		//获取页面跳转传输的参数对象  
		var requerParameter = $yt_common.GetRequest(); 
		if(requerParameter !=null && requerParameter !=""){
			//表Id
			summReportObj.tableId = requerParameter.tableId;
			//阶段
			summReportObj.budgetStage = requerParameter.budgetStage;
			//调用获取表样式信息方法
			summReportObj.getBudgetTableDetail();
		}
		//调用操作事件方法
		summReportObj.events();
	},
	events:function(){
		/*打印按钮操作事件*/
		$("#printBtn").off().on("click", function() {
			//调用执行打印的方法
            summReportObj.doPrint();
		});
		//点击下载按钮
		$("#downLoadBtn").click(function(){
			//配置统一参数
			var yitianSSODynamicKey  = $yt_baseElement.getToken();
			window.location.href = $yt_option.base_path + 'budget/main/exportTotalAdjustReport?tableId=' + summReportObj.tableId + '&budgetStage='+summReportObj.budgetStage+"&yitianSSODynamicKey="+yitianSSODynamicKey+"&ajax=1";
		});
	},
	/**
	 * 获取预算表样式详情
	 */
	getBudgetTableDetail: function() {
		$.ajax({
			type: 'post',
			url: 'budget/main/getTotalAdjustReport',
			async: false,
			data: {
				tableId:summReportObj.tableId,
				budgetStage:summReportObj.budgetStage
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
				//重新计算th的宽度
				//获取只读列的个数
				var disLen = $('.rule-table thead th.dis').length;
				var width = parseInt($(window).width()) / (tableStyle.totalColsNum);
				width = width > 130 ? 130 : parseInt(width);
				$('.rule-table thead th:not(.dis)').css("min-width",(width-15)+"px");
				
				//调用获取预算表配置方法
				summReportObj.getConfigInfo();
				//调用获取预算表格数据方法
				summReportObj.getTableInfoList(budgetData);
				//调用获取差额明细信息方法
				summReportObj.getMoneyDetail(dataObj);
			}
		});
	},
	/**
	 * 
	 * 获取差额明细信息
	 * 
	 */
	getMoneyDetail:function(dataObj){
		//科目数据信息
		var subAdjustList = dataObj.subAdjustList;
		//处室信息
		var deptAdjustList = dataObj.deptAdjustList;
		//科目总金额
		if(dataObj.subAdjustTotalVal!=undefined && dataObj.subAdjustTotalVal !="" && dataObj.subAdjustTotalVal !=null){
			if($yt_baseElement.fmMoney(dataObj.subAdjustTotalVal) <0){
				$(".course-info  .money-flag").addClass("font-green").text("调减");
			}else if($yt_baseElement.fmMoney(dataObj.subAdjustTotalVal) == 0){
				$(".course-info  .money-flag").addClass("hui-col").text("调整");
			}else{
				$(".course-info  .money-flag").addClass("font-red").text("调增");
			}
			$(".course-info .little-money").text($yt_baseElement.fmMoney(dataObj.subAdjustTotalVal));
		}else{
			$(".course-info .little-money").text("0.00");
			$(".course-info  .money-flag").addClass("hui-col").text("调整");
		}
		//处室总金额
		if(dataObj.deptAdjustTotalVal !=undefined && dataObj.deptAdjustTotalVal !="" && dataObj.deptAdjustTotalVal !=null){
			if($yt_baseElement.fmMoney(dataObj.deptAdjustTotalVal) <0){
				$(".department-info .money-flag").addClass("font-green").text("调减");
			}else if($yt_baseElement.fmMoney(dataObj.deptAdjustTotalVal) == 0){
				$(".department-info .money-flag").addClass("hui-col").text("调整");
			}else{
				$(".department-info .money-flag").addClass("font-red").text("调增");
			}
			$(".department-info .little-money").text($yt_baseElement.fmMoney(dataObj.deptAdjustTotalVal));
		}else{
			$(".department-info .little-money").text("0.00");
			$(".department-info .money-flag").addClass("hui-col").text("调整");
		}
		//遍历科目的详细信息
		$(".course-info .other-list-info ul li").empty();
		if(subAdjustList !=undefined && subAdjustList!=null && subAdjustList.length >0){
			var liStr = "";
			$.each(subAdjustList, function(i,n) {
			   if($yt_baseElement.fmMoney(n.crValue) <0){
			   	liStr += '<li><label>'+n.text+'</label><label class="font-green">调减<span class="add-money">'+($yt_baseElement.fmMoney(n.crValue*-1))+'</span></label></li>';
			   }else{
			   	liStr += '<li><label>'+n.text+'</label><label class="font-red">调增<span class="add-money">'+($yt_baseElement.fmMoney(n.crValue))+'</span></label></li>';
			   }
			});
			$(".course-info .other-list-info ul").html(liStr);
		}
		//遍历处室的详细信息
		$(".department-info .other-list-info ul li").empty();
		if(deptAdjustList !=undefined && deptAdjustList!=null && deptAdjustList.length >0){
			var liStr = "";
			$.each(deptAdjustList, function(i,n) {
			   if($yt_baseElement.fmMoney(n.crValue) < 0){
			   	 liStr += '<li><label>'+n.text+'</label><label class="font-green">调减<span class="add-money">'+($yt_baseElement.fmMoney(n.crValue*-1))+'</span></label></li>';
			   }else{
			   	 liStr += '<li><label>'+n.text+'</label><label class="font-red">调增<span class="add-money">'+($yt_baseElement.fmMoney(n.crValue))+'</span></label></li>';
			   }
			  
			});
			$(".department-info .other-list-info ul").html(liStr);
		}
	},
	/**
	 * 
	 * 初始获取配置项信息
	 * 
	 */
	getConfigInfo: function() {
		summReportObj.configData = [];
		$.ajax({
			type: "post",
			url: 'budget/confg/getTableAllCongfigByTableId',
			async: false,
			data: {
				tableId:summReportObj.tableId
			},
			success: function(data) {
				var crNums = "";
				//判断操作是否成功
				if(data.flag == 0) {
					if(data.data.length > 0) {
						summReportObj.configData = data.data;
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
		if(budgetData != undefined && budgetData !=null &&  budgetData.length > 0) {
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
									$(c).find(".money-text").html(n.crValue);
									$(c).find(".money-input").val(n.crValue);
								}
								//判断是否有调减金额
								if(n.adjustValue !="" && n.adjustValue !=null && n.adjustValue !=undefined && n.adjustValue !="0.00" &&  n.adjustValue != 0.00){
									//是否是数字
									if(!isNaN(n.adjustValue)) {
										n.adjustValue = $yt_baseElement.fmMoney(n.adjustValue);
									}
									//判断是调增还是调减
									$(c).find(".adjust-money").remove();
									if(n.adjustValue < 0){
										//$(c).css("position","relative").find(".money-text").before('<span class="adjust-money font-green">'+n.adjustValue+'</span>');
									    $(c).append('<span class="adjust-money font-green">'+n.adjustValue+'</span>');
									}else{
										//$(c).css("position","relative").find(".money-text").before('<span class="adjust-money font-red">+'+n.adjustValue+'</span>');
										$(c).append('<span class="adjust-money font-red">+'+n.adjustValue+'</span>');
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
	},
	/**
	 * 
	 * 执行打印操作
	 * 
	 */
	doPrint: function() {
		bdhtml = window.document.body.innerHTML; //获取当前页的html代码  
		startSummaryPasting = "<!--startSummaryPasting-->"; //设置打印开始区域   
		endSummaryPasting = "<!--endSummaryPasting-->"; //设置打印结束区域   
		prnhtml = bdhtml.substr(bdhtml.indexOf(startSummaryPasting)); //从开始代码向后取html   
		prnhtml = prnhtml.substring(0, prnhtml.indexOf(endSummaryPasting)); //从结束代码向前取html   
		window.document.body.innerHTML = prnhtml;
		window.focus();
        if(summReportObj.isIE()){
			document.body.className += ' ext-ie';
			document.execCommand('print', false, null);
		}else{
			window.print();
		}
		window.document.body.innerHTML = bdhtml; //还原页面  
		window.location.reload();
	},
	isIE:function() {
		if (!!window.ActiveXObject || "ActiveXObject" in window)  
			return true;  
		else  
			return false; 
	}
}
$(function(){
	summReportObj.init();
})
