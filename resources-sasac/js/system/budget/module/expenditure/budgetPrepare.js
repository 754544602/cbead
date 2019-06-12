var  prepareObj = {
	 configData: [],//表配置集合
	 tableId:'',//预算表Id
	 budgetStage:'',//阶段
	 initDeptData:{},//初始的初始编制数据
	init:function(){//初始化方法
		var requerParameter = $yt_common.GetRequest();
		if(requerParameter){
			//获取传输的预算表ID
			prepareObj.tableId = requerParameter.tableId;
			prepareObj.budgetStage = requerParameter.budgetStage;
			//调用获取表样式信息方法
			prepareObj.getBudgetTableDetail();
		}
		//调用操作事件方法	
		prepareObj.handleEvent();
	},
	/**
	 * 
	 * 操作事件方法
	 * 
	 */
	handleEvent:function(){
		 //点击返回按钮操作事件
		$("button.page-retun-btn").click(function(){
			$(this).addClass("check");
			//判断当前页面是否有底部编制区域面板
			if($("body #bottomPanel").length > 0){
				//调用判断数据是否有变动方法
	    		prepareObj.dataIsUpdate(1);
			}else{
				$yt_common.parentAction({  
				    url:$yt_option.parent_action_path,//父级中转地址,固定配置项,只有统一修改处理。  
				    funName:'locationToMenu',//指定方法名，定位到菜单方法  
				    data:{  
				        url:'view/system-sasac/budget/module/expenditure/prepareSummaryList.html'//要跳转的页面路径  
				    }  
				});  
			}
		});
		//点击查看编制报告按钮
		$("button.report-btn").click(function(){
			//跳转至编制报告页面
			$yt_baseElement.openNewPage(2,"view/system-sasac/budget/module/expenditure/summaryReport.html?tableId="+prepareObj.tableId+'&budgetStage='+prepareObj.budgetStage);
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
				tableId:prepareObj.tableId,
				budgetStage:prepareObj.budgetStage
			},
			success: function(data) {
				var dataObj = data.data || {};
				//表样信息
				var tableStyle = dataObj.tableStyle;
				//表数据信息
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
				width = width > 140 ? 140 : parseInt(width);
				$('.rule-table thead th:not(.dis)').css("min-width",(width-15)+"px");
				//调用获取预算表配置方法
				prepareObj.getConfigInfo();
				//调用获取预算表格数据方法
				prepareObj.getTableInfoList(budgetData);
			}
		});
	},
	/**
	 * 
	 * 初始获取配置项信息
	 * 
	 */
	getConfigInfo: function() {
		prepareObj.configData = [];
		$.ajax({
			type: "post",
			url: 'budget/confg/getTableAllCongfigByTableId',
			async: false,
			data: {
				tableId:prepareObj.tableId
			},
			success: function(data) {
				var crNums = "";
				//判断操作是否成功
				if(data.flag == 0) {
					if(data.data.length > 0) {
						prepareObj.configData = data.data;
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
	 * @param {Object} budgetData 表格数据集
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
								//存储数据
								$(c).data("cellData",n);
							}
						});
					}
				});
			});
			//调用单元格点击方法
			prepareObj.cellEvent();
		}
	},
	/**
	 * 
	 * 
	 * 单元格操作事件方法
	 * 
	 */
	cellEvent:function(){
		//表格中的单元格除去禁用的单击事件
		$('.rule-table .yt-tbody tr td:not(.disable-sty)').click(function(){
			var  thisCell = $(this);
			//获取当前单元格数据
	    	var  cellData = $(this).data("cellData");
	    	//获取当前单元格的配置信息
	   		 var cellConfigData = $(this).data("configData");
	   		 if(cellConfigData == undefined || cellConfigData ==null){
	   		 	//判断当前单元格的关系列是否有值
	   		 	if(cellData !=undefined &&  cellData.aliasCellNum != "" && cellData.aliasCellNum !=null){
	   		 	  cellConfigData = $(this).parent().find('td[fieldflag='+cellData.aliasCellNum+']').data("configData");
	   		 	}
	   		 }
		    //判断是1是单表有计算项,4是表间有计算项,是则不可编辑单元格2文本3数字
			if(cellData !=undefined && cellConfigData !=undefined && cellConfigData.calcItem != "1" && cellConfigData.calcItem != "4"){
				//给当前单元格加上选中样式
				$('.rule-table .yt-tbody tr td').removeClass("cell-shadow");
			    $(this).addClass("cell-shadow");
		        //获取单位名称
			    var unitText = ($(".label-msg").text() !="" ? '('+$(".label-msg").text()+')' : "");
			     //添加底部编制面板
	    		$('#mainLayout').layout('add',{
				    region: 'south',
				    width: 180,
				    title: '编制明细'+unitText,
				    id:"bottomPanel",
				    split: true
					});
					prepareObj.setLayoutPanelHeader();
				//列号
				var colNum = "";
				//判断关联列是否有值
				if(cellData.aliasCellNum == "" || cellData.aliasCellNum ==null || cellData.aliasCellNum == undefined){
					colNum = cellData.cellNum;
				}else{
					colNum = cellData.aliasCellNum;
				}
			    //调用获取当前单元格编制处室信息接口
			    $.ajax({
					type: "post",
					url: 'budget/editor/getDpetDataByCells',
					async: false,
					data:{
						tableId:prepareObj.tableId,//表ID
						budgetStage:prepareObj.budgetStage,//阶段
						colNum:colNum,//列号
						rowNum:cellData.rowNum//行号
					},
					success: function(data) {
						var datas = data.data;
						if(data.flag == 0) {
							//拼接编制面板数据
							var botStr = "";
					        botStr ='<div code="detail" class="tab-panel"><table class="yt-table prepare-table" style="width: 100%;margin-top: 20px;">'
					                   +'<thead class="yt-thead">'
					                   +'<tr><th>编制处室</th><th>编制金额</th>';
					                   //botStr += '<th>备注</th>';
					                   //循环动态表头
					                   if (datas.tableTitleList && datas.tableTitleList.length > 0) {
					                   	$.each(datas.tableTitleList, function(i, n) {
					                   		botStr += '<th>' + n.titleName + '</th>';
					                   	});
					                   }
					                   botStr +='<th>调整后金额</th><th>备注</th></tr>';
					                   +'</thead>';
					                  //拼接tbody部分
					                  botStr +='<tbody class="yt-tbody">'
					                   +'<tr>'
					                   +'<td style="text-align: left;">合计<input type="hidden" class="total-tab-id" value="'+datas.totalInfoId+'"/></td>'
					                   +'<td class="prepare-money sum-money" style="text-align: right;">'+(datas.amount == "" ? "0.00" :$yt_baseElement.fmMoney(datas.amount))+'</td>';
					                   //+'<td>'+ datas.remark +'</td>';
					                   if (datas.tableTitleList && datas.tableTitleList.length > 0) {
					                   	$.each(datas.tableTitleList, function(i, n) {
					                   		botStr += '<td></td>';
					                   	});
					                   }
					                   botStr +='<td class="adjust-money" style="text-align: right;">'
					                   +'<span class="adjust-sum">'+(datas.adjustedAmount == "" ? "0.00" :$yt_baseElement.fmMoney(datas.adjustedAmount))+'</span>'
					                   +'</td>'
					                   +'<td><input style="text-align: left;" class="yt-input sum-prepare-remark"  value="'+datas.remark+'" placeholder="请输入"/></td>';
					                   botStr +='</tr>';
					                   //拼接处室信息部分
					                   if(datas.deptBudgetList != "" && datas.deptBudgetList !=undefined && datas.deptBudgetList.length>0){
					                   	$.each(datas.deptBudgetList, function(i,n) {
					                   		botStr +='<tr class="'+(cellData.deptId == n.deptId ? "selBak" : "")+'">'
						                   +'<td style="text-align: left;" dept-id-data="'+n.deptId+'">'+n.deptName+'</td>'
						                   +'<td class="prepare-money" style="text-align: right;">'+(n.amount == "" ? "0.00" : $yt_baseElement.fmMoney(n.amount))+'</td>';
						                   //+'<td></td>';
						                   //拼接动态表格
						                   if (n.tableTitleDataList && n.tableTitleDataList.length > 0) {
						                   	$.each(n.tableTitleDataList, function(j, m) {
						                   		botStr += '<td>' + m.crValue + '</td>';
						                   	});
						                   }
						                   botStr +='<td class="adjust-money">'
						                   +'<input class="yt-input adjust-inpu" type="text" value="'+(n.adjustedAmount == "" ? "0.00" : $yt_baseElement.fmMoney(n.adjustedAmount))+'"/>'
						                   +'</td>'
						                   +'<td><input class="yt-input prepare-remark"  value="'+n.remark+'" placeholder="请输入"/></td>';
						                   botStr +='</tr>';
					                   	});
					                   }
					                   botStr +='</tbody></table>'
					                   +'<div class="handle-model" style="text-align: center;margin-top: 20px;">'
					                   +'<button class="yt-option-btn yt-common-btn prepare-save-btn" style="margin-right: 20px;">保存</button>'
					                   +'<button class="yt-option-btn yt-cancel-btn prepare-cancel-btn">取消</button>'
					                   +'</div></div>';
					                   botStr += prepareObj.getGistFileHtml();
					                   botStr = $(botStr);
					                   botStr.find('.prepare-table').data("cellData",cellData)
					        $("#bottomPanel").html(botStr);
							//调用刷新面板高度方法
							customResize();
							//调用面板操作事件方法
							prepareObj.panleEvent();
							//存储初始的单元格编制处室数据
							prepareObj.initDeptData = prepareObj.getCellDeptData();
							//调用附件上传
							prepareObj.fileUpEvent();
							//获取附件信息
							prepareObj.getFileInfoList(prepareObj.tableId);
							//底部分解明细栏输入框失去焦点事件.
			  			    $(".prepare-table input").focus(function(){
			  			    	//删除其他行选中类
			  			    	$(".prepare-table tr").removeClass("selBak");
			  			    	//给当前行加上选中效果
			  			    	$(this).parents("tr").addClass("selBak");
			  			    	//比对处室ID
			  			    	var deptId  = $(this).parents("tr").find("td").attr("dept-id-data");
			  			    	//遍历当前选中表格行下的Td匹配处室
			  			    	$.each($(thisCell).parents("tr").find("td"), function(i,n) {
			  			    		if($(n).data("cellData") !=undefined && $(n).data("cellData") !=null){
			  			    			if($(n).data("cellData").deptId == deptId){
			  			    				//给表格内对应的单元格加上选中效果
			  			    				$(".rule-table td").removeClass("cell-shadow");
			  			    				$(n).addClass("cell-shadow");
			  			    			}
			  			    		}
			  			    	});
			  			    });
						}else{
							$yt_alert_Model.prompt(data.message);
							//删除底部面板
    						$("#mainLayout").layout('remove','south');
						}
					}
				});
			}
    	});
	},
	/**
	 * 
	 * 面板操作事件
	 * 
	 */
	panleEvent:function(){
		 $('#mainLayout').layout({
        	onCollapse: function(){//折叠面板操作事件
        		//删除底部面板
    			$("#mainLayout").layout('remove','south');
    			//清除单元格选中
    			$('.rule-table .yt-tbody tr td').removeClass("cell-shadow");
        	}
        });
		//调整后金额输入框获取焦点事件
		$(".prepare-table").on("focus",".adjust-inpu",function(){
			$(this).select();
			if($(this).val() !="" && $(this).val() !="0.00" && $(this).val() !=null){
				$(this).val($yt_baseElement.rmoney($(this).val()));
			}else{
				$(this).val("0.00");
			}
		});
		//调整后金额输入框失去焦点事件
		$(".prepare-table").on("blur",".adjust-inpu",function(){
			if($(this).val() !="" && $(this).val() !="0.00" && $(this).val() !=null){
				$(this).val($yt_baseElement.fmMoney($(this).val()));
			}else{
				$(this).val("0.00");
			}
		    //计算调整后的合计金额
		    var adjustSum = "0.00";
		    adjustSum = $yt_baseElement.rmoney(adjustSum);
		    $(".prepare-table .adjust-inpu").each(function(i,n){
		    	adjustSum += $yt_baseElement.rmoney($(n).val());
		    });
		    $(".adjust-sum").text($yt_baseElement.fmMoney(adjustSum));
		});
		//调整后金额输入框键盘抬起事件
		$(".prepare-table").on("keyup", '.adjust-inpu', function() {
			$(this).val($(this).val().replace(/[^\d.]/g, ''));
		});
		/**
		 * 
		 * 编制明细面板点击保存按钮操作事件
		 * 
		 */
		$("button.prepare-save-btn").click(function(){
			var  thisBtn = $(this);
			//给按钮加上禁用
			$(thisBtn).attr("disabled","disabled");
			//调用获取一下分解控制数方法
			var onceObj = prepareObj.getOnceControlData();
			//判断一下的控制数是不是为空
			if(onceObj && onceObj.controlAmount !="" && onceObj.controlAmount!=undefined && onceObj.controlAmount !=null){
				//验证调整和的合计应等于一下控制数
				if(($yt_baseElement.rmoney(onceObj.controlAmount)) != ($yt_baseElement.rmoney($(".adjust-sum").text()))){
					$yt_alert_Model.alertOne({  
				        leftBtnName: "确定", //左侧按钮名称,默认确定  
				        cancelFunction: "", //取消按钮操作方法*/  
				        alertMsg: '一下控制数是：'+onceObj.controlAmount+',调整后金额合计应等于一下控制数', //提示信息  
				        cancelFunction: function() { //点击确定按钮执行方法  
				        },  
				    });  
					//解除按钮禁用
					$(thisBtn).attr("disabled",false);
					return false;
				}else{
					//调用执行保存方法
					prepareObj.executeSave(thisBtn);
				}
			}else{
				//调用执行保存方法
				prepareObj.executeSave(thisBtn);
			}
		});
		/**
    	 * 
    	 * 编制明细面板取消按钮点击事件
    	 * 
    	 */
    	$("button.prepare-cancel-btn").click(function(){
    		//调用判断数据是否有变动方法
    		prepareObj.dataIsUpdate(0);
    	});
	},
	/**
	 * 判断数据是否发生变动
	 * @param {Object} isBtn 0代表面板中的取消按钮1代表顶部返回按钮
	 */
	dataIsUpdate:function(isBtn){
		//判断数据是否有变动
		var saveData = JSON.stringify(!!prepareObj ? prepareObj.getCellDeptData() : {});
		var initData = JSON.stringify(!!prepareObj ? prepareObj.initDeptData : {});
		if(saveData != initData){
			isUpdate = true;
			//提示信息
    		 $yt_alert_Model.alertOne({  
	         leftBtnName:"保存",//左侧按钮名称,默认确定 
	         rightBtnName:"不保存",//右侧按钮名称,默认取消  
	         alertMsg: "当前页面有调整数据尚未保存，是否放弃保存？点击“保存”保存页面调整数，或点击“不保存”继续。", //提示信息  
	         confirmFunction: function() { //点击左侧按钮执行方法
	         	//调用获取一下分解控制数方法
				var onceObj = prepareObj.getOnceControlData();
				//判断一下的控制数是不是为空
				if(onceObj && onceObj.controlAmount !="" && onceObj.controlAmount!=undefined && onceObj.controlAmount !=null){
					//验证调整和的合计应等于一下控制数
					if(($yt_baseElement.rmoney(onceObj.controlAmount)) != ($yt_baseElement.rmoney($(".adjust-sum").text()))){
						$yt_alert_Model.prompt("调整后金额合计应等于一下控制数");
						return false;
					}else{
						//调用执行保存方法
						prepareObj.executeSave();
					}
				}else{
					//调用执行保存方法
					prepareObj.executeSave();
				}
	         },
	         cancelFunction:function(){//点击右侧按钮方法
	         	//删除底部面板
    			$("#mainLayout").layout('remove','south');
    			//清除单元格选中
    			$('.rule-table .yt-tbody tr td').removeClass("cell-shadow");
    			//判断如果是返回按钮
    			if(isBtn == 1){
					$yt_common.parentAction({  
					    url:$yt_option.parent_action_path,//父级中转地址,固定配置项,只有统一修改处理。  
					    funName:'locationToMenu',//指定方法名，定位到菜单方法  
					    data:{  
					        url:'view/system-sasac/budget/module/expenditure/prepareSummaryList.html'//要跳转的页面路径  
					    }  
					});  
				}
	         }
	   		});  
		}else{
			//删除底部面板
			$("#mainLayout").layout('remove','south');
			//清除单元格选中
			$('.rule-table .yt-tbody tr td').removeClass("cell-shadow");
			//判断如果是返回按钮
			if(isBtn == 1){
				$yt_common.parentAction({  
				    url:$yt_option.parent_action_path,//父级中转地址,固定配置项,只有统一修改处理。  
				    funName:'locationToMenu',//指定方法名，定位到菜单方法  
				    data:{  
				        url:'view/system-sasac/budget/module/expenditure/prepareSummaryList.html'//要跳转的页面路径  
				    }  
				});  
			}
		}
	},
	/**
	 * 
	 * 
	 * 获取一下分解控制数
	 * 
	 */
	getOnceControlData:function(){
		//获取当前单元格数据
		var  cellData = $(".rule-table tbody .cell-shadow").data("cellData");
		var datas = "";
		$.ajax({
			type: "post",
			url: "budget/editor/getBudgetStageResolveNum",
			async: false,
			data:{
				tableId:prepareObj.tableId,//表ID
				colNum:cellData.cellNum,//列号
				rowNum:cellData.rowNum//行号
			},
			success: function(data) {
				if(data.flag == 0){
					datas = data.data;
				}
			}
		});
		return datas;
	},
	/**
	 * 执行保存方法
	 * @param {Object} thisBtn 当前操作按钮
	 */
	executeSave:function(thisBtn){
		//调用获取数据方法
		var saveDatas = prepareObj.getCellDeptData();
		$.ajax({
			type: "post",
			url: "budget/editor/saveDpetDataByCells",
			data:saveDatas,
			async: false,
			success: function(data) {
				$yt_alert_Model.prompt(data.message);
				if(thisBtn != undefined && thisBtn !=""){
					//解除按钮禁用
					$(thisBtn).attr("disabled",false);
				}
				//操作成功
				if(data.flag == 0) {
					//刷新表格数据
					prepareObj.getBudgetTableDetail();
					//返回按钮点击的确定操作跳转回汇总列表页面
					if(thisBtn == undefined && $("button.page-retun-btn").hasClass("check")){
						$yt_common.parentAction({  
						    url:$yt_option.parent_action_path,//父级中转地址,固定配置项,只有统一修改处理。  
						    funName:'locationToMenu',//指定方法名，定位到菜单方法  
						    data:{  
						        url:'view/system-sasac/budget/module/expenditure/prepareSummaryList.html'//要跳转的页面路径  
						    }  
						});  
					}
					//删除底部面板
	    			$("#mainLayout").layout('remove','south');
	    			//清除单元格选中
	    			$('.rule-table .yt-tbody tr td').removeClass("cell-shadow");
				}
			},error:function(e){
				if(thisBtn != undefined && thisBtn !=""){
					//解除按钮禁用
					$(thisBtn).attr("disabled",false);
				}
			}
		});
	},
	/**
	 * 获取要保存的数据
	 */
	getCellDeptData:function(){
		//获取编制表格对象
		var  preTableObj = $(".prepare-table");
		//获取汇总表Id
		var totalTabId = $(preTableObj).find(".total-tab-id").val();
		//获取存储的单元格对象
		var cellData =  $(preTableObj).data("cellData");
		//获取合计编制金额
		var  amount = $(preTableObj).find(".sum-money").text();
		//还原金额格式化处理
		amount = $yt_baseElement.rmoney(amount);
		//调整后金额合计
		var adjustedAmount = $(preTableObj).find(".adjust-sum").text();
		adjustedAmount = $yt_baseElement.rmoney(adjustedAmount);
		//获取各部门上报的数据
		var deptBudgetList = [];
		var deptBudgetJson = "";
		$(preTableObj).find("tbody tr:gt(0)").each(function(i,n){
			deptBudgetList.push({
				deptId:$(n).find("td").attr("dept-id-data"),//部门Id
				amount:($yt_baseElement.rmoney($(n).find(".prepare-money").text())), //编制金额
				adjustedAmount:($yt_baseElement.rmoney($(n).find(".adjust-inpu").val())),//调整后金额
				remark:$(n).find(".prepare-remark").val()
			});
		});
		if(deptBudgetList !="" && deptBudgetList.length>0){
			deptBudgetJson = JSON.stringify(deptBudgetList);
		}
		//列号
		var colNum = "";
		//判断关联列是否有值
		if(cellData.aliasCellNum == "" || cellData.aliasCellNum ==null || cellData.aliasCellNum == undefined){
			colNum = cellData.cellNum;
		}else{
			colNum = cellData.aliasCellNum;
		}
		return{
			tableId:prepareObj.tableId,//表ID
			budgetStage:prepareObj.budgetStage,//阶段
			colNum:colNum,//列号
			rowNum:cellData.rowNum,//行号
			totalInfoId:totalTabId,//汇总信息表Id	
			amount:amount, //合计编制金额	
			adjustedAmount:adjustedAmount,	//合计: 调整后金额	
			remark: $(preTableObj).find(".sum-prepare-remark").val(),//合计: 备注	
			deptBudgetList:deptBudgetJson//各部门上报预算数据集合json串
		}
	},
	/**
	 * 预算汇总的折叠面板头部处理
	 */
	setLayoutPanelHeader: function () {
		$('.layout-panel-south .panel-title').html('<label code="detail" class="tab-item check">编制明细（单位：万元）</label><label code="gist" class="tab-item">编制依据（文件）</label>');
		$('.layout-panel-south .tab-item').on('click', function() {
			$('.layout-panel-south .tab-item').removeClass('check');
			$(this).addClass('check');
			//获取tab编号
			var code = $(this).attr('code');
			$('.tab-panel').hide();
			$('.tab-panel[code="'+ code +'"]').show();
		});
	},
	/**
	 * 编制依据（文件）html
	 */
	getGistFileHtml: function () {
		var html = '<div style="display:none;" class="file-content tab-panel" code="gist">' +
			'<div class="file-update">' +
			'<div class="file-cont-row">' +
			'<span><span style="color: #fff;">*</span><span style="letter-spacing: 5px;">上传附</span>件：</span>' +
			'<div class="file-up-div">' +
			'<div class="dib" style="vertical-align: middle;"><input class="yt-input file-msg" id="fileName" readonly="readonly"></div>' +
			'<div class="file-input-but">' +
			'<input name="file" class="cont-file" id="fileInput" type="file">' +
			'<input type="hidden" id="fileId" value="">' +
			'<button class="yt-option-btn yt-common-btn file-upload-btn" id="" style="margin: 0;">请上传</button>' +
			'</div>' +
			'</div>' +
			'</div>' +
			'<div class="file-cont-row">' +
			'<div style="float: left;">' +
			'<label><span class="not-null">*</span><span style="letter-spacing: 5px;">文件说</span>明：</label>' +
			'</div>' +
			'<div style="overflow: hidden;position: relative;padding-bottom: 20px;">' +
			'<textarea class="yt-textarea" id="fileRemark" validform="{isNull:true,blurFlag:true,msg:\'请输入文件说明\'}"></textarea><div class="valid-font" style="left: 0;"></div>' +
			'</div>' +
			'</div>' +
			'<div class="file-cont-row" style="text-align: center;"><button class="yt-option-btn yt-common-btn" id="fileUp">上传</button></div>' +
			'</div>' +
			'<div class="file-up-list" id="attIdStr">' +
			'</div>' +
			'<div style="clear: both;"></div>' +
			'</div>';
		return html;
	},
	/**
	 * 附件上传事件处理
	 */
	fileUpEvent: function () {
		//上传附件
		$(".file-up-div").off().on('change', '.cont-file', function(obj) {
			var fileElementId = this.id;
			var ithisParent = $('#attIdStr');
			var url = $yt_option.base_path + "/fileUpDownload/upload?ajax=1&modelCode=REIM_APP";
			var imgUlr = '';
			$.ajaxFileUpload({
				url: url,
				type: "post",
				dataType: 'json',
				fileElementId: fileElementId,
				success: function(data, textStatus) {
					if(data.flag == 0) {
						$('#fileId').val(data.data.pkId);
						$('#fileName').val(data.data.naming);
					} else {
						$yt_alert_Model.prompt(data.message);
					}
				},
				error: function(data, status, e) {
					$yt_alert_Model.prompt(data.message);
				}
			});
		});
		//点击上传按钮
		$('#fileUp').on('click', function() {
			//获取附件id
			var fid = $('#fileId').val();
			if (fid) {
			  if ($yt_valid.validForm('.file-content')) {
			    //保存附件信息
			    prepareObj.saveFileInfo();
			  }
			} else {
				$yt_alert_Model.prompt('请选择附件');
			}
		});
		//下载
		$('#attIdStr').on('click', '.file-dw', function() {
			var id = $(this).parents('.file-lable').attr('fid');
			window.location.href = $yt_option.base_path + 'fileUpDownload/download?pkId=' + id + '&isDownload=true';
		});
		//附件删除
		$('#attIdStr').on('click', '.del-file', function() {
			var ithis = $(this);
			var parent = ithis.parents('.file-lable');
			var id = parent.attr('fid');
			$yt_alert_Model.alertOne({
				alertMsg: "数据删除将无法恢复,确认删除吗?",
				confirmFunction: function() {
					prepareObj.deleteFileInfoById(id, function() {
						parent.remove();
					});
				},
			});
		});
	},
	/**
	 * 获取所有上传的附件
	 * @param {Object} data
	 */
	getFileInfoList: function(tableId) {
		$.ajax({
			type: 'post',
			url: 'budget/files/getFileInfoList',
			data: {
				tableId: tableId,
				deptId: '',
				budgetStage: '',
			},
			success: function(data) {
				if(data.flag == 0) {
					var html = '';
					$.each(data.data, function(i, n) {
						html += '<div class="file-lable" fid="' + n.attId + '">' +
							'<div class=""><a class="yt-link file-dw">' + n.attName + '</a><label class="del-file">x</label></div>' +
							'<div class=""><span>文件说明：</span><span class="">' + n.attRemarks + '</span></div>' +
							'<div class=""><span>上传人：</span><span class="">' + n.createUserName + '</span></div>' +
							'</div>';
					});
					$('#attIdStr').html(html);
				}
			}
		});
	},
	/**
	 * 2.19.3	[预算文件相关]：删除上传文件
	 * @param {Object} id
	 * @param {Object} fun
	 */
	deleteFileInfoById: function(id, callback) {
		$.ajax({
			type: 'post',
			url: 'budget/files/deleteFileInfoById',
			data: {
				attId: id
			},
			success: function(data) {
				if (data.flag == 0) {
					if (callback) {
						callback()
					}
				}
				$yt_alert_Model.prompt(data.message);
			}
		});
	},
			/**
	 * 2.19.1	[预算文件相关]：保存上传文件
	 */
	saveFileInfo: function() {
		$.ajax({
			type: 'post',
			url: 'budget/files/saveFileInfo',
			data:{
				tableId: prepareObj.tableId,
				budgetStage: prepareObj.budgetStage,
				attId: $('#fileId').val(),
				attRemarks: $('#fileRemark').val()
			},
			success: function(data) {
				if (data.flag == 0) {
					//清空附件信息
					$('#fileId').val('');
					$('#fileName').val('');
					$('#fileRemark').val('');
					//重新获取附件信息
					prepareObj.getFileInfoList(prepareObj.tableId);
				}
				$yt_alert_Model.prompt(data.message);
			}
		});
	}
}
$(function(){
	//调用初始化方法
	prepareObj.init();
	//调用
	redraw();
});
 $(window).resize(function () {
    redraw();
});
 window.customResize = function () {
            var width = $(window).width();
            var height = $(window).height();
            var panelHeight = parseInt(height / 2); //每个1/3高度
            $('#centerPanel').panel('resize', { width: width, height: panelHeight });
            $('#bottomPanel').panel('resize', { width: width, height: panelHeight });
            $('#mainLayout').layout('resize', { width: width, height: height });
    };
//窗体改变大小easyui控件调整宽度和高度
function redraw() {
    if (window.customResize) {
        customResize(); //自定义缩放函数，页面若使用多个布局控件，需自定义缩放函数处理
    }else{
        var width = $(window).width();
        var height = $(window).height();
        //没有自定义缩放函数时，默认对panel，layout，treegrid，datagrid等控件进行调整
        $('.easyui-panel').panel('resize', { width: width, height: height });
        $('.easyui-layout').layout('resize', { width: width, height: height });
        $('.easyui-treegrid').treegrid('resize', { width: width, height: height });
        $('.easyui-datagrid').datagrid('resize', { width: width, height: height });
    }
} 