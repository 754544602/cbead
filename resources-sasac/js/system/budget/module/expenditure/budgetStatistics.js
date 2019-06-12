var budgetObj = {
	configData: [],
	tableId:"",//预算表Id
	tableObj:"",//预算表对象
	publishId:'',//发布表Id
	processInstanceId: "", //流程实例Id
	businessCode:"",//下一步操作code
	/**
	 * 初始化
	 */
	init: function() {
		//流程审批
		$(".flow-approve-model").html(sysCommon.createFlowApproveMode());
		//初始化下拉框
		$("select").niceSelect();
		var requerParameter = $yt_common.GetRequest();
		if(requerParameter){
			//获取传输的预算表ID
			budgetObj.tableId = requerParameter.tableId;
			//获取发布表Id
			budgetObj.publishId = requerParameter.publishId;
			//开始获取数据
			budgetObj.getTableDataStart();
			
			//获取报表类型A02基本支出A03项目支出
			if(budgetObj.tableObj.budgetType == "A02"){
			 	budgetObj.businessCode = "JBZC_APP_FLOW";
			}
			if(budgetObj.tableObj.budgetType == "A03"){
			 	budgetObj.businessCode ="XMZC_APP_FLOW";
			}
			//获取审批流程下拉菜单数据
			sysCommon.getApproveFlowData(budgetObj.businessCode,budgetObj.processInstanceId);
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
			thisSelTable.find("tbody tr td .yt-input").each(function() {
				$(this).val($(this).parent().find(".money-text").text());
			});
			//隐藏编辑按钮
			$(this).hide();
			//隐藏提交按钮
			$(".submit-btn").hide();
			//显示保存和取消,计算按钮,列表中所有的输入框
			thisSelTable.find("tr:not(.disable-sty) td:not(.disable-sty) .yt-input").show();
			$(".init-calculate-btn,.init-cancel-btn,.init-save-btn").show();
			//隐藏流程审批部分代码
			$(".approve-stat-model").hide();
		});
		//点击计算按钮
		$(".init-calculate-btn").off().on("click", function() {
			//调用计算表格数据方法
			budgetObj.calculateTableData();
		});
		//点击保存按钮
		$(".init-save-btn").off().on("click", function() {
			//调用执行保存操作方法
			budgetObj.doSaveEvent();
		});
		
		//点击提交按钮
		$(".submit-btn").off().on("click",function(){
			$yt_alert_Model.alertOne({  
				leftBtnName: "确定提交", //左侧按钮名称,默认确定  
       			rightBtnName: "暂不提交", //右侧按钮名称,默认取消  
		        alertMsg: "提交成功后，填写数据将被锁定,无法修改,如需要修改，请先联系预算处解除锁定！", //提示信息  
		        confirmFunction: function() { //点击确定按钮执行方法  
		        	//设置按钮禁用
					$(this).attr("disabled","disabled");
		            //获取存储数据,调用保存方法
					$.ajax({
						type: "post",
						url: 'budget/report/setRreportBudgetTable',
						data: {
							publishTableId:budgetObj.publishId
						},
						async: false,
						success: function(data) {
							//解除按钮禁用
							$(this).attr("disabled",false);
							//判断操作是否成功
							$yt_alert_Model.prompt(data.message, 2000);
							if(data.flag == "0") {
								//判断是否包含财政项目
								if (budgetObj.checkPrjFalg()) {
									//当财政项目的值非0时，弹出提示
									$yt_alert_Model.alertOne({
										leftBtnName:"前往填写",//左侧按钮名称,默认确定 
										rightBtnName:"我已填写（稍后处理）",//右侧按钮名称,默认取消 
										alertMsg: "当前预算包含财政项目预算，需完善项目信息。", //提示信息 
										confirmFunction: function() {
											//跳转财政项目立项页面
											$yt_common.parentAction({
												url: $yt_option.parent_action_path, //父级中转地址,固定配置项,只有统一修改处理。  
												funName: 'locationToMenu', //指定方法名，定位到菜单方法  
												data: {
													url: 'view/system-sasac/budget/module/projectApproval/projectApplyApproval.html' //要跳转的页面路径  
												}
											});
										},cancelFunction:function(){//点击我已填写
											//成功回到上报列表页面
											$yt_common.parentAction({  
											    url:$yt_option.parent_action_path,//父级中转地址,固定配置项,只有统一修改处理。  
											    funName:'locationToMenu',//指定方法名，定位到菜单方法  
											    data:{  
											        url:'view/system-sasac/budget/module/expenditure/budgetReport.html'//要跳转的页面路径  
											    }  
											});  
										}
									});
								}else{
									//成功回到上报列表页面
									$yt_common.parentAction({  
									    url:$yt_option.parent_action_path,//父级中转地址,固定配置项,只有统一修改处理。  
									    funName:'locationToMenu',//指定方法名，定位到菜单方法  
									    data:{  
									        url:'view/system-sasac/budget/module/expenditure/budgetReport.html'//要跳转的页面路径  
									    }  
									});  
									//判断操作是否成功
									$yt_alert_Model.prompt(data.message, 2000);
								}
								
								//判断审批流程区域正在显示，调用审批流程方法
								if($(".approve-stat-model").is(":visible")){
									//调用提交审批流程方法
									budgetObj.subApproval();
								}
							}
						},error:function(e){
							//解除按钮禁用
							$(this).attr("disabled",false);
						}
					});
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
		//附件上传
		budgetObj.fileUpEvent();
	},
	/**
	 * 
	 * 
	 * 执行保存操作
	 * 
	 */
	doSaveEvent:function(validFlag){
		//获取选中的表格数据
		var selTabData = budgetObj.tableObj;
		var tabDatas = "";
		//获取表格数据
		var tableDatas = budgetObj.getSaveTableInfo();
		//验证提示
		if (budgetObj.verifySaveData(tableDatas,validFlag)) {
			//获取存储数据,调用保存方法
			$.ajax({
				type: "post",
				url: 'budget/main/saveBudgetDataDetailInfo',
				data: {
					budgetDataJson: tableDatas,
					tableId: selTabData.tableId,
					publishTableId:budgetObj.publishId
				},
				async: false,
				success: function(data) {
					if(data.flag == "0") {
						//调用初始化顶部按钮方法
						budgetObj.initHeardBtn();
						//显示流程审批部分
						$(".approve-stat-model").show();
					}else{
						//判断操作是否成功
						$yt_alert_Model.prompt(data.message, 2000);
					}
				}
			});
		}
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
					//图片预览
					//$('#attIdStr .file-pv img').showImg();
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
			    budgetObj.saveFileInfo();
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
					budgetObj.deleteFileInfoById(id, function() {
						parent.remove();
					});
				},
			});
		});
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
		//显示编辑,提交按钮,显示td中的span标签内容
		$(".edit-btn,.submit-btn,.rule-table tbody tr td .money-text").show();
		//隐藏保存和取消按钮,隐藏列表中所有的输入框
		$(".init-save-btn,.init-cancel-btn,.init-calculate-btn,.rule-table tbody tr td .yt-input").hide();
		//清空输入框的数据
		$(".rule-table tbody tr td .yt-input").val('');
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
				tdStr += '<td class="right-td c' + (i + 1) + '" fieldFlag=c' + (i + 1) + '><span class="money-text"></span><input type="text" value="" class="yt-input money-input"/></td>';
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
		$.ajax({
			type: "post",
			url: 'budget/main/getBudgetDataDetailInfo',
			async: false,
			data: {
				"tableId": budgetObj.tableId,
				"publishTableId":budgetObj.publishId
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
												$(c).find(".yt-input").val(n.crValue);
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
			 $yt_common.parentAction({  
			    url:$yt_option.parent_action_path,//父级中转地址,固定配置项,只有统一修改处理。  
			    funName:'locationToMenu',//指定方法名，定位到菜单方法  
			    data:{  
			        url:'view/system-sasac/budget/module/expenditure/budgetReport.html'//要跳转的页面路径  
			    }  
			});  
		});
	},
	/**
	 * 
	 * 计算单元格数据方法
	 * 
	 */
	calculateTableData: function() {
		//获取选中的表格数据
		var selTabData = budgetObj.tableObj;
		//获取表格数据
		var getTableDatas = budgetObj.getSaveTableInfo();
		$.ajax({
			type: "post",
			url: 'budget/main/calcBudgetData',
			async: false,
			data: {
				"tableId": selTabData.tableId,
				"budgetDataJson": getTableDatas,
				"publishTableId":budgetObj.publishId
			},
			success: function(data) {
				//判断操作是否成功
				if(data.flag == 0) {
					if(data.data.length > 0) {
						//遍历数据集
						$.each(data.data, function(i, n) {
							//遍历当前显示表格的行
							$(".rule-table tbody tr").each(function(i, r) {
								//找到所有的计算行,并且比对行
								if($(r).attr("fieldflag") == n.rowNum) {
									//遍历当前行下所有的计算列
									$.each($(r).find("td"), function(i, c) {
										//比对计算列
										if($(c).attr("fieldflag") == n.cellNum) {
											//获取金额数据
											if(n.crValue == "#VALUE!" || n.crValue == undefined || n.crValue == "" || n.crValue ==null){
												n.crValue = 0;
											}
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
		thisTableTbody.find("tr").each(function(i, n) {
			//排除是计算项的数据
			if(!$(n).hasClass("disable-sty")) {
				//遍历td
				$(n).find("td").each(function(v, c) {
					//排除是计算项的数据
					if(!$(c).hasClass("disable-sty")) {
						//获取单元格金额数据
						price = '';
						if($(c).find(".yt-input").hasClass("money-input")) {
							price = $yt_baseElement.rmoney($(c).find(".yt-input").val());
						} else {
							price = $(c).find(".yt-input").val();
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
			url: 'budget/confg/getTableAllCongfigByTableId',
			async: false,
			data: {
				tableId:budgetObj.tableId
			},
			success: function(data) {
				var crNums = "";
				//判断操作是否成功
				if(data.flag == 0) {
					if(data.data.length > 0) {
						budgetObj.configData = data.data;
						$.each(data.data, function(i, n) {
							//判断类型如果是列
							if(n.type == "c") {
								//遍历列
								$(".rule-table tbody tr td").each(function(v, c) {
									//比对列
									if(n.crNum == $(this).attr("fieldFlag")) {
										//判断是1是单表有计算项,4是表间有计算项,是则不可编辑单元格2文本3数字5优先列的配置
										if(n.calcItem == "1" || n.calcItem == "4") {
											$(this).addClass("disable-sty");
										}
										//判断如果是文本
										if(n.calcItem == "2"){
											//找到输入框添加文本标识类
											$(this).find("input").addClass("character-inpu").removeClass('money-input').show();
										} else {
											$(this).find("input").removeClass('character-inpu').addClass("money-input");
										}
										//判断优先列的配置是否选中,1选中2未选中
										if(n.editorItem == 1){
											$(this).addClass("priori-td");
										}
										$(this).data("configData", n);
									}
								});
							}
						});
						
						$.each(data.data, function(i, n) {
							//判断类型如果是行
							if(n.type == "r") {
								//遍历行
								$(".rule-table tbody tr").each(function(i, r) {
									//比对行5优先列的配置
									if(n.crNum == $(this).attr("fieldFlag") && n.calcItem != "5" && n.editorItem != "1") {
										//判断是1是单表有计算项,4是表间有计算项,是则不可编辑单元格2文本3数字5优先列的配置
										if(n.calcItem == "1" || n.calcItem == "4") {
											$(this).addClass("disable-sty").find('td:not(.priori-td)').addClass("disable-sty");
										}
										//判断如果是文本
										if(n.calcItem == "2") {
											//找到输入框添加文本标识类td:not(.priori-td)
											$(this).find("td:not(.priori-td) input").addClass("character-inpu").removeClass('money-input').show();
										} else {
											$(this).find("td:not(.priori-td) input").removeClass('character-inpu').addClass("money-input");
										}
										$(this).data("configData", n);
									}
								});
							} 
						});
						
						
						$.each(data.data, function(i, n) {
							//判断类型如果是单元格
							if(n.type == "cr") {
								crNums = n.crNum.split("-");
								//找到所属单元格的输入框
								var inpt = $('.rule-table tbody td.' + crNums[0] + '' + crNums[1] + ' input');
								if(n.calcItem == "1" || n.calcItem == "4") {
									$('.rule-table tbody td.' + crNums[0] + '' + crNums[1]).addClass("disable-sty");
								}
								//判断如果行的属性是文本
								if(n.calcItem && n.calcItem == "2") {
									//找到输入框添加文本标识类
									inpt.addClass("character-inpu").removeClass('money-input').show();
								} else {
									inpt.removeClass('character-inpu').addClass("money-input");
								}
							}
						});
						
						$('.rule-table tbody tr td.disable-sty .yt-input').hide();
					}
				} else {
					$yt_alert_Model.prompt(data.message, 2000);
				}
			}
		});
	},
	/**
	 * 获取单条预算表信息
	 */
	getTableDataStart:function(){
		//获取预算表样式详情
		budgetObj.getBudgetTableDetailByTableId(budgetObj.publishId);
		//未禁用的td内添加文本和输入框
		$('.rule-table tbody tr td:not(.disable-sty)').each(function() {
			var html = $(this).html();
			html = '<span class="money-text">' + html + '</span><input class="yt-input money-input" value="" />';
			$(this).html(html);
		});
		//切换选择样式
		$(this).addClass("yt-table-active").siblings().removeClass("yt-table-active");
		//切换表格显示
		$(".no-select-table").hide();
		$('.config-table').removeClass("select-table").hide();
		//比对表格code显示对应的表格
		$('table[table-code="' + budgetObj.tableObj.tableCode + '"]').show().addClass("select-table");
		//$("table").eq($(this).index()).show().addClass("select-table").siblings().removeClass("select-table").hide();
		//切换到表格配置区域
		$(".tab-content:eq(1)").show().siblings().hide();
		//显示操作按钮
		$(".btn-group-model").show();
		//调用拼接Td的方法
		budgetObj.addTdHtml(budgetObj.tableObj);
		//调用初始化顶部按钮方法
		budgetObj.initHeardBtn();
		//调用获取配置信息方法
		budgetObj.getConfigInfo(budgetObj.tableObj);
		/**
		 * 
		 * 判断提交状态1 已提交 2未提交
		 * 
		 */
		if(budgetObj.tableObj.submitState == 1){
			//设置编辑按钮和提交按钮禁用
			$(".edit-btn,.submit-btn").addClass("yt-btn-disabled").attr("disabled","disabled");
			//隐藏输入框文
			$(".rule-table").find("tbody tr:not(.disable-sty) td:not(.disable-sty) input").hide();
		}else{
			//未提交状态
			//显示表格为编辑状态
			//获取当前显示的表格
			var thisSelTable = $(".rule-table");
			//隐藏span文本显示
			thisSelTable.find("tbody tr:not(.disable-sty) td:not(.disable-sty) .money-text").hide();
			//将span中的数据赋值给输入框
			thisSelTable.find("tbody tr td .money-input").each(function() {
				$(this).val($(this).parent().find(".money-text").text());
			});
			//隐藏编辑和提交按钮
			$(".edit-btn,.submit-btn").removeClass("yt-btn-disabled").removeAttr("disabled").hide();
			//显示保存和取消,计算按钮,列表中所有的输入框
			thisSelTable.find("tr:not(.disable-sty) td:not(.disable-sty) .money-input").show();
			$(".init-calculate-btn,.init-cancel-btn,.init-save-btn").show();
		}
	},
	/**
	 * 2.3.4.5	获取预算表样式详情
	 * @param {Object} publishId 发布表Id
	 */
	getBudgetTableDetailByTableId: function(publishId) {
		$.ajax({
			type: 'post',
			url: 'budget/main/getBudgetTableDetailByPublishTableId',
			async: false,
			data: {
				publishTableId: publishId
			},
			success: function(data) {
				var dataObj = data.data || {};
				budgetObj.tableObj = dataObj;
				//获取附件数据
				budgetObj.getFileInfoList(budgetObj.tableId, data.deptId)
				//获取预算阶段
				var budgetState = "";
				switch(dataObj.budgetStage) {
						case "1":
							budgetState = '一上阶段'
							break;
						case "2":
							budgetState = ''
							break;
						case "3":
							budgetState = '二上阶段'
							break;
					}
			    //赋值阶段信息
				$(".budget-state").text(budgetState);
				//获取部门名称
				$(".dept-name").text(dataObj.deptName);
				//单位
				$("#tableDescribe").text(dataObj.tagging);
				//表名称
				$(".btn-group-model .tab-name").text(dataObj.tableName);
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
						$(this).attr('fieldflag', 'c' + (j + 1)).addClass('c' + (j + 1)).addClass('c' + (j + 1) + 'r' + (i + 1));
					});
				});
			}
		});
	},
	/**
	 * 获取所有上传的附件
	 * @param {Object} data
	 */
	getFileInfoList: function(tableId, deptId) {
		$.ajax({
			type: 'post',
			url: 'budget/files/getFileInfoList',
			data: {
				tableId: tableId,
				deptId: $yt_common.user_info.deptId,
				budgetStage: '',
			},
			success: function(data) {
				if(data.flag == 0) {
					var html = '';
					$.each(data.data, function(i, n) {
						html += '<div class="file-lable" fid="' + n.attId + '">' +
							'<div class=""><a class="yt-link file-dw">' + n.attName + '</a><label class="del-file">x</label></div>' +
							'<div class=""><span>文件说明：</span><span class="">' + n.attRemarks + '</span></div>' +
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
	//提交审批
	subApproval: function() {
		var dealingWithPeople = $("#approve-users").val();
		var nextCode = $("#operate-flow").val();
		var opintion = $("#opintion").val();
		var processInstanceId = $("#processInstanceId").val();
		$.ajax({
			type: 'post',
			url: 'budget/report/submitWorkFlow',
			data: {
				appId: budgetObj.publishId,//发布Id
				businessCode: budgetObj.businessCode,
				parameters: "",
				dealingWithPeople: dealingWithPeople,
				opintion: opintion,
				processInstanceId: "",
				nowPersion: "",
				nextCode: nextCode
			},
			success: function(data) {
				if (data.flag == 0) {
					$yt_alert_Model.prompt(data.message);
					//操作成功跳转至审批列表页面
					$yt_common.parentAction({  
					    url:$yt_option.parent_action_path,//父级中转地址,固定配置项,只有统一修改处理。  
					    funName:'locationToMenu',//指定方法名，定位到菜单方法  
					    data:{  
					        url:'view/system-sasac/budget/module/expenditure/budgetFill.html'//要跳转的页面路径  
					    }  
					});  
				}else{
					$yt_alert_Model.prompt(data.message);
				}
			}
		});
	},
	verifySaveData: function(data,verifySaveData) {
		//验证变量
		var verify = true;
		var  flagFlag = budgetObj.checkThreePublicFalg();
		//检查是否包含三公经费
		if (flagFlag && false != verifySaveData) {
			verify = false;
			$yt_alert_Model.alertOne({
				leftBtnName:"返回填写",//左侧按钮名称,默认确定 
				rightBtnName:"我已上传相关附件",//右侧按钮名称,默认取消 
				alertMsg: "当前“三公经费”及会议费的测算依据（备注）尚未填写，请填写后再提交。", //提示信息 
				confirmFunction: function() {},
				cancelFunction:function(){
					//点击"我已上传相关附件"按钮事件
					//调用执行保存操作方法
					budgetObj.doSaveEvent(false);
				}
			});
			//当没有附件时，“我已上传相关附件”按钮禁用
			if ($('.file-up-list .file-lable').length <= 0) {
				$('.yt-alert-one .yt-model-canel-btn').attr('disabled', true).addClass('yt-btn-disabled').unbind('click');
			}
			return false;
		}
		return verify;
	},
	/**
	 * 2.19.1	[预算文件相关]：保存上传文件
	 */
	saveFileInfo: function() {
		$.ajax({
			type: 'post',
			url: 'budget/files/saveFileInfo',
			data:{
				tableId: budgetObj.tableId,
				budgetStage: budgetObj.tableObj.budgetStage,
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
					budgetObj.getFileInfoList(budgetObj.tableId, budgetObj.tableObj.deptId);
				}
				$yt_alert_Model.prompt(data.message);
			}
		});
	},
	/**
	 * 2.2.8	检查是否包含三公经费
	 */
	checkThreePublicFalg: function() {
		var verify = false;
		$.ajax({
			type: 'post',
			url: 'budget/main/checkThreePublicFalg',
			async: false,
			data: {
				tableId: budgetObj.tableId
			},
			success: function(data) {
				if (data.flag == 0) {
					//包含三公经费时进入判断
					if (data.data.checkFalg == 1) {
						//循环相关单元格
						$.each(data.data.cellList, function(i, n){
							//当三公经费包含的经济科目的值非0时
							if ($('#createConfigTableDiv tr.' + n.rowNum + ' td.' + n.colNum).text() && $yt_baseElement.rmoney($('#createConfigTableDiv tr.' + n.rowNum + ' td.' + n.colNum).text() || '0') != 0) {
								//判断备注是否填写信息
								if (n.relationCellList && n.relationCellList.length > 0) {
									$.each(n.relationCellList, function(j, m) {
										//判断备注是否有值
										if (!$('#createConfigTableDiv td.' + m +  ' .yt-input').val()) {
											//没有值给出提示
											verify = true;
											return false;
										}
									});
								} else {
									//没有关联备注列的情况下直接提示
									verify = true;
									return false;
								}
							}
						});
					}
				}
			}
		});
		return verify;
	},
	/**
	 * 2.2.9	检查是否包含财政项目
	 */
	checkPrjFalg: function() {
		var verify = false;
		$.ajax({
			type: 'post',
			url: 'budget/main/checkPrjFalg',
			async: false,
			data: {
				tableId: budgetObj.tableId
			},
			success: function(data) {
				if (data.flag == 0) {
					if (data.data.checkFalg == 1) {
						verify = true;
					}
				}
			}
		});
		return verify;
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
	
	$('#mainLayout').layout({
  	onCollapse: function(){//折叠面板操作事件
  	}
  });
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