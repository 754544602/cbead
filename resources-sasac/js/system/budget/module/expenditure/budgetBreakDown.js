var  breakDownObj = {
	 configData: [],//表配置集合
	 tableId:'',//预算表Id
	 budgetStage:'',//阶段
	 initDeptData:{},//初始的初始编制数据
	init:function(){//初始化方法
		var requerParameter = $yt_common.GetRequest();
		if(requerParameter){
			//获取传输的预算表ID
			breakDownObj.tableId = requerParameter.tableId;
			breakDownObj.budgetStage = requerParameter.budgetStage;
			//调用获取表样式信息方法
			breakDownObj.getBudgetTableDetail();
		}
		//调用操作事件方法	
		breakDownObj.handleEvent();
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
				//调用检测数据改变方法
				breakDownObj.dataIsUpdate(1);
			}else{
				$yt_common.parentAction({  
				    url:$yt_option.parent_action_path,//父级中转地址,固定配置项,只有统一修改处理。  
				    funName:'locationToMenu',//指定方法名，定位到菜单方法  
				    data:{  
				        url:'view/system-sasac/budget/module/expenditure/budgetBreakDownList.html'//要跳转的页面路径  
				    }  
				});  
			}
		});
		/**
		 * 
		 * 
		 * 点击查看分解报告按钮
		 * 
		 * 
		 */
		$("button.look-report").click(function(){
			//跳转至分解报告页面
			$yt_baseElement.openNewPage(2,"view/system-sasac/budget/module/expenditure/breakDownReport.html?tableId="+breakDownObj.tableId+'&budgetStage='+breakDownObj.budgetStage);
		});
		/**
		 * 
		 * 点击导入编制数据按钮操作事件
		 * 
		 */
		$("button.import-edit-btn").click(function() {
			//判断分解数据是否大于0,大于0提示信息,等于0直接执行导入
			if($("table.prepare-table tbody tr:not(.sum-row)").length > 0 || $('.rule-table tbody tr').length > 0) {
				$yt_alert_Model.alertOne({
					leftBtnName: "是", //左侧按钮名称,默认确定 
					rightBtnName: "否", //右侧按钮名称,默认取消  
					alertMsg: "导入数据将覆盖现有的分解数据，是否导入？", //提示信息  
					confirmFunction: function() { //点击左侧按钮执行方法
						//将编制金额列数据赋值给分解金额列
						//合计行
						$("table.prepare-table tbody tr.sum-row .break-down-sum").text($("table.prepare-table tbody tr.sum-row .prepare-money").text());
						//遍历单元格
						$("table.prepare-table tbody tr:not(.sum-row)").each(function() {
							$(this).find("input.adjust-inpu").val($(this).find(".prepare-money").text());
						});
						//调用计算分解状态数据
						breakDownObj.calculateBreakDownState();
						//提示信息
						breakDownObj.saveExportDpetResolveDataByCells();
					}
				});
			} else {
				$("table.prepare-table tbody tr.sum-row .break-down-sum").text($("table.prepare-table tbody tr.sum-row .prepare-money").text());
				//遍历单元格
				$("table.prepare-table tbody tr:not(.sum-row)").each(function() {
					$(this).find("input.adjust-inpu").val($(this).find(".prepare-money").text());
				});
				//调用计算分解状态数据
				breakDownObj.calculateBreakDownState();
				//提示信息
				breakDownObj.saveExportDpetResolveDataByCells();
			}
		});
	},
	/**
	 * 获取预算表样式详情
	 */
	getBudgetTableDetail: function() {
		$.ajax({
			type: 'post',
			url: 'budget/main/getResolveBudgetTableDetailInfo',
			async: false,
			data: {
				tableId:breakDownObj.tableId,
				budgetStage:breakDownObj.budgetStage
			},
			success: function(data) {
				var dataObj = data.data || {};
				//表样信息
				var tableStyle = dataObj.tableStyle;
				//表数据信息
				var budgetData = dataObj.budgetData;
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
				breakDownObj.getConfigInfo();
				//调用获取预算表格数据方法
				breakDownObj.getTableInfoList(budgetData);
			}
		});
	},
	/**
	 * 
	 * 初始获取配置项信息
	 * 
	 */
	getConfigInfo: function() {
		breakDownObj.configData = [];
		$.ajax({
			type: "post",
			url: 'budget/confg/getTableAllCongfigByTableId',
			async: false,
			data: {
				tableId:breakDownObj.tableId
			},
			success: function(data) {
				var crNums = "";
				//判断操作是否成功
				if(data.flag == 0) {
					if(data.data.length > 0) {
						breakDownObj.configData = data.data;
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
	 * @param {Object} budgetData 表数据集
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
				breakDownObj.cellEvent();
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
						    title: '分解明细'+unitText,
						    id:"bottomPanel",
						    split: true
							});
							breakDownObj.setLayoutPanelHeader();
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
					url: 'budget/resolve/getDpetTotalDataByCells',
					async: false,
					data:{
						tableId:breakDownObj.tableId,//表ID
						budgetStage:breakDownObj.budgetStage,//阶段
						colNum:colNum,//列号
						rowNum:cellData.rowNum//行号
					},
					success:function(data){
						var datas = data.data;
						if(data.flag == 0) {
									//计算未分解数
							        var noBreakNum = $yt_baseElement.rmoney(datas.controlAmount) - $yt_baseElement.rmoney(datas.resolveAmount);
									var botStr ='<div code="detail" class="tab-panel"><div class="break-down-info">';
					        		//拼接预算控制数区域
					                botStr +='<div><lable>预算控制数：</lable><input type="hidden" class="con-id" value="'+datas.resolveControlId+'"/><input class="yt-input control-inpu" type="text" value="'+(datas.controlAmount == "" ? "0.00" : ($yt_baseElement.fmMoney(datas.controlAmount)))+'"/>'
									   +'<lable style="margin-left: 35px;"><span style="letter-spacing: 5px;">分解状</span>态：</lable>'
									   +'<span>已分解&nbsp;&nbsp;<span class="break-down-num '+(datas.resolveAmount > datas.controlAmount ? "font-red" : "")+'">'+(datas.resolveAmount == "" ? "0.00" : ($yt_baseElement.fmMoney(datas.resolveAmount)))+'</span>'
									   +'<span style="margin-left: 50px;">未分解&nbsp;&nbsp;<span  class="no-break-down-num '+(noBreakNum > 0 ? "font-red" : "")+'">'+(noBreakNum == "" ? "0.00" : $yt_baseElement.fmMoney(noBreakNum))+'</span></span>'
					                   +'</div>';
					                //拼接相关附件区域
					                /*botStr +='<div>'
					                   	   +'<table border="0" cellspacing="0" cellpadding="0" class="from-table" style="margin-left: 0px;">'
					                   	   +'<tr>'
					                   	   +'<td valign="top" style="padding-top: 5px;"><span style="letter-spacing: 5px;">相关附</span>件：</td>'
					                  	   +'<td>'
					                  	   +'<div class="file-up-div" style="display: block;padding: 0px;">'
					                  	   +'<div class="yt-input dib" style="vertical-align:middle;padding: 0px;float:left;display:inline;">'
					                  	   +'<span class="file-msg" style="color: rgb(51, 51, 51);"></span>'
					                  	   +'</div>'
					                  	   +'<div style="display: inline-block; margin-left: 15px;position: relative;vertical-align: middle;padding: 0px;">'
					                  	   +'<input name="file" risk-code-val="reimCorrelationFile" class="cont-file" id="reimFile" type="file">'
					                  	   +'<input type="hidden" id="" value="">'
					                  	   +'<button class="yt-option-btn yt-common-btn file-upload-btn" id="" style="margin: 0;">请上传</button>'
					                  	   +'<span class="risk-model"> <input type="hidden" value="busiTripFile" class="hid-risk-code">'
					                  	   +'<img src="" class="risk-img"> </span>'
					                  	   +'</div>'
					                  	   +'</div>'
					                  	   +'<div class="file-box" id="attIdStr" style="padding: 0px;">';
					                  	//拼接附件数据
					                  	if(datas.attList && datas.attList.length > 0){
											var src = '';
					                  	  $.each(datas.attList, function(i,n) {
					                  	  	//botStr +='<div class="li-div"  fId="'+data.attId+'" ><span>'+n.attName+'</span><span class="del-file">x</span></div>';
					                  	  	//获取图片格式
											var imgType = n.attName.split('.');
											if(imgType.length > 1 && (imgType[1] == 'png' || imgType[1] == 'jpeg' || imgType[1] == 'bmp' || imgType[1] == 'jpg')) {
												//拼接图片路径
												src = $yt_option.base_path + 'fileUpDownload/download?pkId=' + n.attId + '&isDownload=false';
												botStr+= '<div fid="' + n.attId + '" class="li-div export"><span class="file-name" >' + n.attName + '</span>'
												      +'<span style="float:right;display:inline;">'
												      +'<label class="file-dw">下载</label><label class="file-pv">预览<img src="' + src + '"/></label></span></div>';
											} else {
												botStr+= '<div fid="' + n.attId + '" class="li-div export"><span class="file-name" >' + n.attName + '</span>'
												      +'<span style="float:right;display:inline;"><label class="file-dw">下载</label></span></div>';
											}
					                  	  });
					                  	}
					                  	 botStr +='</div>'
					                  	   +'</td>'
					                  	   +'</tr>'
					                  	   +'</table>'
					                  	   +'</div>';*/
					                //拼接快速分解区域
					                /*botStr +='<div><lable><span style="letter-spacing: 5px;">快速分</span>解：</lable>'
					                   +'<button class="yt-option-btn yt-common-btn import-edit-btn" style="margin-right: 10px;">导入编制数据</button>'
					                   +'<button class="yt-option-btn yt-common-btn import-other-btn">导入其他历史数据</button>'
					                   +'</div>';*/
					                botStr +='</div>';
					                //拼接编辑表格数据
					                botStr +='<div style="padding:0px 10px;"><table class="yt-table prepare-table" style="width: 100%;margin-top: 20px;">'
					                   +'<thead class="yt-thead">'
					                   +'<tr><th>编制处室</th><th>编制金额</th><th>备注（汇总编制）</th><th>分解金额</th><th>备注</th></tr>'
					                   +'</thead>'
					                   +'<tbody class="yt-tbody">'
					                   +'<tr class="sum-row">'
					                   +'<td style="text-align: left;">合计</td>'
					                   +'<td class="prepare-money sum-money" style="text-align: right;">'+(datas.amount == "" ? "0.00" : ($yt_baseElement.fmMoney(datas.amount)))+'</td>'
					                   +'<td></td>'
					                   +'<td style="text-align: right;">'
					                   +'<span class="break-down-sum">'+(datas.resolveAmount == "" ? "0.00" : ($yt_baseElement.fmMoney(datas.resolveAmount)))+'</span>'
					                   +'</td>'
					                   +'<td><input class="yt-input prepare-remark sum-prepare-remark"  value="'+(datas.remark)+'" placeholder="请输入"/></td>'
					                   +'</tr>';
					                //遍历各部门上报预算数据集合
					                if(datas.deptBudgetList !="" && datas.deptBudgetList != undefined && datas.deptBudgetList.length > 0){
					                	$.each(datas.deptBudgetList, function(i,n) {
					                		botStr +='<tr class="'+(cellData.deptId == n.deptId ? "selBak" : "")+'">'
						                   +'<td style="text-align: left;" dept-id-data="'+n.deptId+'">'+n.deptName+'</td>'
						                   +'<td class="prepare-money" style="text-align: right;">'+(n.amount == "" ? "0.00" : ($yt_baseElement.fmMoney(n.amount)))+'</td>'
						                   +'<td>'+n.totalRemark+'</td>'
						                   +'<td class="adjust-money">'
						                   +'<input class="yt-input adjust-inpu" type="text" value="'+(n.resolveAmount == "" ? "0.00" : ($yt_baseElement.fmMoney(n.resolveAmount)))+'"/>'
						                   +'</td>'
						                   +'<td><input class="yt-input prepare-remark"  value="'+(n.remark)+'" placeholder="请输入"/></td>'
						                   +'</tr>';
					                	});
					                }
					                botStr +='</tbody></table></div>';
					                //拼接底部按钮区域
					                botStr +='<div class="handle-model" style="text-align: center;margin-top: 20px;">'
					                   +'<button class="yt-option-btn yt-common-btn prepare-save-btn" style="margin-right: 20px;">保存</button>'
					                   +'<button class="yt-option-btn yt-cancel-btn prepare-cancel-btn">取消</button>'
					                   +'</div></div>';
					                botStr += breakDownObj.getGistFileHtml();
					                botStr = $(botStr);
					                botStr.find('.break-down-info').data("cellData",cellData);
							        $("#bottomPanel").html(botStr);
									//调用刷新面板高度方法
									customResize();
									//调用面板操作事件方法
									breakDownObj.panleEvent();
									//附件上传事件
									breakDownObj.fileUpEvent();
									//获取附件
									breakDownObj.getFileInfoList(breakDownObj.tableId);
									//图片下载
									/*$('#attIdStr .file-dw').off().on('click', function() {
										var id = $(this).parents(".li-div").attr('fid');
										window.location.href = $yt_option.base_path + 'fileUpDownload/download?pkId=' + id + '&isDownload=true';
									});*/
									/*//图片预览
									$('#attIdStr .file-pv img').showImg();*/
									//初始调用获取数据方法
					  			    breakDownObj.initDeptData = breakDownObj.getCellDeptData();
					  			    
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
								$yt_alert_Model.prompt(data.message, 3000);
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
		//金额输入框获取焦点事件
		$("#bottomPanel").on("focus",".adjust-inpu,.control-inpu",function(){
			$(this).select();
			if($(this).val() !="" && $(this).val() !="0.00" && $(this).val() !=null){
				$(this).val($yt_baseElement.rmoney($(this).val()));
			}else{
				$(this).val("0.00");
			}
		});
		//金额输入框失去焦点事件
		$("#bottomPanel").on("blur",".adjust-inpu,.control-inpu",function(){
			if($(this).val() !="" && $(this).val() !="0.00" && $(this).val() !=null){
				$(this).val($yt_baseElement.fmMoney($(this).val()));
			}else{
				$(this).val("0.00");
			}
			//判断如果是分解金额输入框
			if($(this).hasClass("adjust-inpu")){
				 //计算分解后的合计金额
			    var breakDownSum = "0.00";
			    breakDownSum = $yt_baseElement.rmoney(breakDownSum);
			    $(".prepare-table .adjust-inpu").each(function(i,n){
			    	breakDownSum += $yt_baseElement.rmoney($(n).val());
			    });
			    $(".break-down-sum").text($yt_baseElement.fmMoney(breakDownSum));
			}
			//调用计算分解状态数据
		    breakDownObj.calculateBreakDownState();
		});
		//金额输入框键盘抬起事件
		$("#bottomPanel").on("keyup", '.adjust-inpu,.control-inpu', function() {
			$(this).val($(this).val().replace(/[^\d.]/g, ''));
		});
		/**
		 * 
		 *分解明细面板点击保存按钮操作事件
		 * 
		 */
		$("button.prepare-save-btn").click(function(){
			var thisBtn = $(this);
			//校验 分解金额合计=控制数
			if($yt_baseElement.rmoney($(".break-down-sum").text()) == $yt_baseElement.rmoney($(".control-inpu").val())){
				//设置按钮禁用
				$(thisBtn).attr("disabled","disabled");
				//调用执行保存方法
				breakDownObj.executeSave(thisBtn);
			}else{
				//给出提示信息
				$yt_alert_Model.alertOne({  
			        haveCloseIcon: true, //是否带有关闭图标  
			        leftBtnName: "确定", //左侧按钮名称,默认确定  
			        cancelFunction: "", //取消按钮操作方法*/  
			        alertMsg: "已分解金额应等于预算控制数", //提示信息  
			        cancelFunction: function() { //点击确定按钮执行方法  
			        }
		      	});  
			}
		});
		/**
    	 * 
    	 * 分解明细面板取消按钮点击事件
    	 * 
    	 */
    	$("button.prepare-cancel-btn").click(function(){
    		//调用检测数据改变方法
			breakDownObj.dataIsUpdate(0);
    	});
    	//调用上传附件方法
    	breakDownObj.uploadFile();
    	//附件删除事件
		$('.file-box').on('click', '.del-file', function() {
			var ithis = $(this);
			var parent = ithis.parent();
			$yt_alert_Model.alertOne({
				alertMsg: "数据删除将无法恢复,确认删除吗?",
				confirmFunction: function() {
					parent.remove();
				},
			});
		});
	},
	/**
	 * 判断数据是否发生变动
	 * @param {Object} isBtn 0代表面板中的取消按钮1代表顶部返回按钮
	 */
	dataIsUpdate:function(isBtn){
		//判断数据是否有变动
		var saveData = JSON.stringify(!!breakDownObj ? breakDownObj.getCellDeptData() : {});
		var initData = JSON.stringify(!!breakDownObj ? breakDownObj.initDeptData : {});
		if(saveData != initData){
			//提示信息
    		 $yt_alert_Model.alertOne({  
	         leftBtnName:"保存",//左侧按钮名称,默认确定 
	         rightBtnName:"不保存",//右侧按钮名称,默认取消  
	         alertMsg: "当前页面有调整数据尚未保存，是否放弃保存？点击“保存”保存页面调整数，或点击“不保存”继续。", //提示信息  
	         confirmFunction: function() { //点击左侧按钮执行方法
	         	//调用执行保存方法
				breakDownObj.executeSave();
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
					        url:'view/system-sasac/budget/module/expenditure/budgetBreakDownList.html'//要跳转的页面路径  
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
				        url:'view/system-sasac/budget/module/expenditure/budgetBreakDownList.html'//要跳转的页面路径  
				    }  
				});  
			}
		}
	},
	/**
	 * 执行保存方法
	 * @param {Object} thisBtn 当前操作按钮
	 */
	executeSave:function(thisBtn){
		//调用获取数据方法
		var saveDatas = breakDownObj.getCellDeptData();
		$.ajax({
			type: "post",
			url: "budget/resolve/saveDpetResolveDataByCells",
			data:saveDatas,
			success: function(data) {
				$yt_alert_Model.prompt(data.message);
				if(thisBtn != undefined && thisBtn !=""){
					//解除按钮禁用
					$(thisBtn).attr("disabled",false);
				}
				//操作成功
				if(data.flag == 0) {
					//调用获取预算表格数据方法
					breakDownObj.getBudgetTableDetail();
					//返回
					if(thisBtn == undefined && $("button.page-retun-btn").hasClass("check")){
						$yt_common.parentAction({  
						    url:$yt_option.parent_action_path,//父级中转地址,固定配置项,只有统一修改处理。  
						    funName:'locationToMenu',//指定方法名，定位到菜单方法  
						    data:{  
						        url:'view/system-sasac/budget/module/expenditure/budgetBreakDownList.html'//要跳转的页面路径  
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
	 * 
	 * 计算分解状态数据
	 * 
	 */
	calculateBreakDownState:function(){
			/*
         	 * 计算已分解,未分解
         	 */
         	//已分解金额=分解数据合计，未分解金额=控制数-已分解；当已分解金额大于控制数，数值显示红色字体；当未分解金额大于0 ，数值显示红色字体
         	//已分解
         	var breakDownNum = $yt_baseElement.rmoney($(".break-down-sum").text());
         	//获取控制数据
         	var controlNum = $yt_baseElement.rmoney($(".control-inpu").val());
         	if(breakDownNum > controlNum){
         		$(".break-down-num").css("color","#FF0000");
         	}else{
         		$(".no-break-down-num").css("color","#333");
         	}
         	$(".break-down-num").text($(".break-down-sum").text());
         	//未分解
         	var noBreakDownNum = 0;
         	if($yt_baseElement.rmoney($(".control-inpu").val())>0){
         	  noBreakDownNum = $yt_baseElement.rmoney($(".control-inpu").val()) - $yt_baseElement.rmoney($(".break-down-num").text());
         	}
         	if(noBreakDownNum > 0){
         		$(".no-break-down-num").css("color","#FF0000");
         	}else{
         		$(".no-break-down-num").css("color","#333");
         	}
         	$(".no-break-down-num").text($yt_baseElement.fmMoney(noBreakDownNum));
	},
	/*
	 * 
	 * 上传附件
	 * 
	 * */
	uploadFile: function() {
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
						/*var attaElement = $('<div id="' + data.data.pkId + '" class="file-lable">' +
							'<span class="file-name">' + data.data.fileName + '</span>' +
							'<img class="file-del" src="../../../resources-sasac/images/module/projects/file-del.png" />' +
							'</div>');*/
						//imgUlr = $yt_option.base_path + 'fileUpDownload/download?prjId=' + data.data.pkId + '&isDownload=false';
						var attaElement = $('<div fid="' + data.data.pkId + '" class="li-div"><span>' + data.data.naming + '</span><span class="del-file">x</span></div>');
						ithisParent.append(attaElement);
					} else {
						$yt_alert_Model.prompt(data.message);
					}
					//图片预览
					$('#attIdStr .file-pv img').showImg();
				},
				error: function(data, status, e) {
					$yt_alert_Model.prompt(data.message);
				}
			});

		});
	},
	/**
	 * 获取要保存的数据
	 */
	getCellDeptData:function(){
		//获取分解表格对象
		var  bottomPanelObj = $("#bottomPanel");
		//获取汇总表Id
		var resolveControlId = $(bottomPanelObj).find(".con-id").val();
		//获取存储的单元格对象
		var cellData =  $(".break-down-info").data("cellData");
		//获取合计编制金额
		var  amount = $(bottomPanelObj).find(".sum-money").text();
		//还原金额格式化处理
		amount = $yt_baseElement.rmoney(amount);
		//获取已分解金额
		var breakDownAmount = ($(".break-down-num").text() =="" ? "0.00":($yt_baseElement.rmoney($(".break-down-num").text())));
		//获取控制数金额
		var confAmount = $yt_baseElement.rmoney($(".control-inpu").val());
		//获取附件数据
		var files = "";
		if($("#attIdStr .li-div").length > 0){
			files = "";
			$("#attIdStr .li-div").each(function(i,n){
				files += $(n).attr("fid")+",";
			});
		}
		files = (files =="" ? "" : files.substring(files.length-1,0));
		//获取各部门上报的数据
		var deptBudgetList = [];
		var deptBudgetJson = "";
		$(bottomPanelObj).find("table.prepare-table tbody tr:gt(0)").each(function(i,n){
			deptBudgetList.push({
				deptId:$(n).find("td").attr("dept-id-data"),//部门Id
				deptName:$(n).find("td:eq(0)").text(),//部门名称
				amount:($yt_baseElement.rmoney($(n).find(".prepare-money").text())), //编制金额
				resolveAmount:($yt_baseElement.rmoney($(n).find(".adjust-inpu").val())),//分解金额
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
			tableId:breakDownObj.tableId,//表ID
			budgetStage:breakDownObj.budgetStage,//阶段
			colNum:colNum,//列号
			rowNum:cellData.rowNum,//行号
			resolveControlId:resolveControlId,//汇总信息表Id	
			amount:amount, //合计编制金额	
			resolveAmount:breakDownAmount,//已分解金额	
			controlAmount:confAmount,//控制数	
			attIdStr:files,//附件id字符串多个用英文逗号”,”分隔
			remark:$(bottomPanelObj).find(".sum-prepare-remark").val(),//合计: 备注	
			deptBudgetList:deptBudgetJson//各部门上报预算数据集合json串
		}
	},
	/**
	 * 预算汇总的折叠面板头部处理
	 */
	setLayoutPanelHeader: function () {
		$('.layout-panel-south .panel-title').html('<label code="detail" class="tab-item check">分解明细（单位：万元）</label><label code="gist" class="tab-item">编制依据（文件）</label>');
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
			'<input type="hidden" id="fileId">' +
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
			'<div class="file-up-list" id="attIdList">' +
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
			    breakDownObj.saveFileInfo();
			  }
			} else {
				$yt_alert_Model.prompt('请选择附件');
			}
		});
		//下载
		$('#attIdList').on('click', '.file-dw', function() {
			var id = $(this).parents('.file-lable').attr('fid');
			window.location.href = $yt_option.base_path + 'fileUpDownload/download?pkId=' + id + '&isDownload=true';
		});
		//附件删除
		$('#attIdList').on('click', '.del-file', function() {
			var ithis = $(this);
			var parent = ithis.parents('.file-lable');
			var id = parent.attr('fid');
			$yt_alert_Model.alertOne({
				alertMsg: "数据删除将无法恢复,确认删除吗?",
				confirmFunction: function() {
					breakDownObj.deleteFileInfoById(id, function() {
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
					$('#attIdList').html(html);
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
				tableId: breakDownObj.tableId,
				budgetStage: breakDownObj.budgetStage,
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
					breakDownObj.getFileInfoList(breakDownObj.tableId, breakDownObj.deptId);
				}
				$yt_alert_Model.prompt(data.message);
			}
		});
	},
	/**
	 * 2.13.5	[预算分解]：导入编制数据
	 */
	saveExportDpetResolveDataByCells: function() {
		$.ajax({
			type: 'post',
			url: 'budget/resolve/saveExportDpetResolveDataByCells',
			async: false,
			data:{
				tableId: breakDownObj.tableId,
				budgetStage: breakDownObj.budgetStage
			},
			success: function(data) {
				if (data.flag == 0) {
					//调用获取预算表格数据方法
					breakDownObj.getBudgetTableDetail();
				}
				$yt_alert_Model.prompt(data.message);
			}
		});
	}
}
$(function(){
	//调用初始化方法
	breakDownObj.init();
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