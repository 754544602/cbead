var  applyObj ={
	budgetAppId:"",//申请Id
	processInstanceId:"",//流程实例id
	init:function(){
    //调用公用方法生成流程审批区域代码,追加在底部按钮前面
	$(".bottom-btn-model").before(sysCommon.createFlowApproveMode());
	//初始化select控件
	$("select").niceSelect();
	//调用获取预算年度和阶段信息
	applyObj.getYearAndStageInfo();
	//获取申请Id
	applyObj.budgetAppId = $yt_common.GetQueryString('budgetAppId');
	if(applyObj.budgetAppId && applyObj.budgetAppId !=undefined && applyObj.budgetAppId !=""){
		//调动获取申请详细信息方法
		applyObj.getBudgetApplyDetailInfo();
	}else{
		//获取当前登录用户信息
		sysCommon.getLoginUserInfo();
	}
	//调用获取审批流程数据方法
	sysCommon.getApproveFlowData("BUDGET_DATA_APP",applyObj.processInstanceId);	
	//调用初始操作事件化方法
	applyObj.initEvent();
	//调用获取表模板方法
	applyObj.getTableModelInfo();
	},
	initEvent:function(){
		//提交按钮操作事件
		$("#submitBtn").click(function(){
			var  thisBtn = $(this);
			//禁用当前按钮
			$(thisBtn).attr("disabled","disabled");
			//调用验证方法,验证表单数据
			var validFlag = $yt_valid.validForm($(".apply-main-model"));
			//判断是否验证成功
			if(validFlag){
				//获取数据
				var submitData = {
					processInstanceId:applyObj.processInstanceId,	//流程实例Id
					budgetAppId:applyObj.budgetAppId,	//预算申请Id
					booksId:$("select.year-sel").val(),	//预算表Id(帐套)
					budgetYear:$("select.year-sel option:selected").text(),	//预算年度
					budgetStage:$("select.stage-sel").val()//预算阶段code
				}
				//调用提交接口
				$.ajax({
					type: 'post',
					url: 'budget/appMain/submitBudgetAppInfo',
					async: false,
					data:submitData,
					success: function(data) {
						//解除按钮禁用
						$(thisBtn).attr("disabled",false);
						if(data.flag == 0) {
							if(data.data && data.data !=undefined && data.data!=null){
								//调用提交工作流方法
								var isSuc = applyObj.submitWorkflow(data.data);
								if(isSuc){
									$yt_alert_Model.prompt(data.message);
									//提交成功跳转到我的申请页面
									$yt_common.parentAction({  
									    url:$yt_option.parent_action_path,//父级中转地址,固定配置项,只有统一修改处理。  
									    funName:'locationToMenu',//指定方法名，定位到菜单方法  
									    data:{  
									        url:'view/system-sasac/budget/module/approval/budgetMyList.html'//要跳转的页面路径  
									    }  
									}); 
								}
							}
						}else{
							$yt_alert_Model.prompt(data.message);
						}
					},error:function(e){
						//解除按钮禁用
						$(thisBtn).attr("disabled",false);
					}
				});
			}
		});
	},
	/**
	 * 
	 * 初始获取预算年度和阶段下拉列表数据
	 * 
	 */
	getYearAndStageInfo:function(){
		//获取预算年度
		$.ajax({
			type: 'post',
			url: 'budget/appMain/getBudgetYearInfo',
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					if(data.data && data.data.length >0){
						$.each(data.data, function(i,n) {
							$("select.year-sel").append('<option value="'+n.booksId+'">'+n.budgetYear+'</option>');
						});
						$("select.year-sel").niceSelect();
						$("select.year-sel").change(function(){
							//调用表格模板操作事件
							applyObj.getTableModelInfo();
						});
					}
				}
			}
		});
		//获取阶段数据
		$.ajax({
			type: 'post',
			url: 'budget/details/getBudgetStageInfo',
			data:{
				type:"1"
			},
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					if(data.data && data.data.length >0){
						$.each(data.data, function(i,n) {
							$("select.stage-sel").append('<option value="'+n.budgetStage+'">'+n.budgetStageName+'</option>');
						});
						$("select.stage-sel").niceSelect();
						$("select.stage-sel").change(function(){
						    //获取选中tab的索引
							var  selTabIndex = $(".tabs li.tabs-selected").index();
							//调用表格模板操作事件
							applyObj.getTableModelInfo(selTabIndex);
						});
					}
				}
			}
		});
	},
	/**
	 * 
	 * 获取预算申请单据详情
	 * 
	 */
	getBudgetApplyDetailInfo:function(){
		$.ajax({
			type: 'post',
			url: 'budget/appMain/getBudgetAppInfoByAppId',
			async: false,
			data:{
				"budgetAppId":applyObj.budgetAppId
			},
			success: function(data) {
				if(data.flag == 0) {
					if(data.data){
						var datas = data.data;
						//调用设置值方法,传输数据对象  
           			   $(".apply-main-model").setDatas(datas);  
           			   //赋值全局的流程实例Id
           			   applyObj.processInstanceId = datas.processInstanceId;
           			   //删除掉单据编号字段的样式
           			   $("#formNum").removeClass("form-num");
						//基础信息
						$("#busiUsers").text(datas.applicantUserName);
						$("#deptName").text(datas.applicantUserDeptName);
						$("#jobName").text(datas.applicantUserJobName == "" ? "--" : datas.applicantUserJobName);
						$("#telPhone").text(datas.applicantUserPhone == "" ? "--" : datas.applicantUserPhone);
						//获取阶段数据
						$('select.stage-sel option[value="'+datas.budgetStage+'"]').prop("selected","selected");
						//获取年度
						$('select.year-sel option[value="'+datas.booksId+'"]').prop("selected","selected");
						$("select").niceSelect();
					}
				}else{
					$yt_alert_Model.prompt(data.message);
				}
			}
		});
	},
	/**
	 * 提交工作流方法
	 * @param {Object} appId 单据Id
	 */
	submitWorkflow:function(appId){
		//判断是否成功
		var  isSuc = true;
		var  subDataObj = {
				appId:appId,//表单申请id	
				parameters:"",//JSON格式字符串,可以为空,该字段是需要传给工作流的表单信息，为后续判断节点使用
				dealingWithPeople:$("#approve-users").val(),//下一步操作人code	
				opintion:$("#opintion").val(),//审批意见	
				processInstanceId:applyObj.processInstanceId,//流程实例ID
				nextCode:$("#operate-flow").val()//操作流程代码
		}
		//调用提交接口
		$.ajax({
			type: 'post',
			url: 'budget/appMain/submitWorkFlow',
			async: false,
			data:subDataObj,
			success: function(data) {
				if(data.flag == 0) {
					isSuc = true;
				}else{
					$yt_alert_Model.prompt(data.message);
					isSuc = false;
				}
			}
		});
		return isSuc;
	},
	/**
	 * 
	 * 
	 * 获取表模板
	 * 
	 * 
	 */
	getTableModelInfo:function(selTabIndex){
		//调用获取相同属性的表格
		$.ajax({
			type: 'post',
			url: 'budget/details/getTabInfoListByParams',
			data: {
				booksId:$("select.year-sel").val(),//帐套Id
				budgetStage:$("select.stage-sel").val(),//阶段code
				deptId:''//部门Id
			},
			success: function(data) {
				if(data.flag == 0) {
					if(data.data && data.data.length > 0) {
						var oldSelTabIndex = 0;
						//数据获取成功拼接easyui的tab
						var contStr = "";
						//显示表格面板,隐藏暂无数据
						$('#tableTemplate').show();
						$(".listNoData").hide();
						//重新创建存储对象
						$(".temp-model").html('<div id="tableTemplate"></div>');
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
								applyObj.getBudgetTableDetailByTableId(tableId, thisSelPanel);
								//调用获取配置信息方法
								applyObj.getTableInfoList(tableId,thisSelPanel);
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
						if(selTabIndex !=undefined){
							//设置选中当前选中的tab
						    $('#tableTemplate').tabs('select',selTabIndex);
						}else{
							//设置选中当前选中的tab
						    $('#tableTemplate').tabs('select',index);
						}
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
	getBudgetTableDetailByTableId:function(tableId,creatTableAreaObj){
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
				booksId:$("select.year-sel").val(),//帐套Id
				budgetStage:$("select.stage-sel").val(),//阶段code
				deptId:''//部门Id
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
$(function(){
	//调用初始化方法
	applyObj.init();
});
