var budgetTableStyle={
	booksId:'',//预算年度id
	booksYear:'',//预算年度
	booksObj:"",//预算年度对象
	init:function(){
		//获取页面跳转传输的参数对象
		var requerParameter = $yt_common.GetRequest();
		// 获取传输的项目ID
		budgetTableStyle.booksId = requerParameter.booksId;
		//调用根据预算年度ID获取年度信息方法
		if(budgetTableStyle.booksId && budgetTableStyle.booksId !=undefined && budgetTableStyle.booksId !=""){
			budgetTableStyle.getBudgetYearInfoById(budgetTableStyle.booksId);
		}
		//绑定页面事件
		budgetTableStyle.events();
		//给当前页面设置最小高度
		$("#budgetTableStyle").css("min-height",$(window).height()-15);
	},
	events:function(){
		//新增按钮事件
		$("#addRiskBtn,#newTabLab").click(function(){
			window.location.href=$yt_option.websit_path+'view/system-sasac/budget/module/expenditure/addTable.html?booksId='+budgetTableStyle.booksId;
		});
		//点击行切换停用启用按钮
		$("#tableList tbody").on("click","tr",function(){
			var thisObj=$(this);
			var trState=thisObj.find(".tr-state").text();
			if(trState=="启用"){
				$("#blockUpBtn").text("停用");
			}else{
				$("#blockUpBtn").text("启用");
			}
		});
		//启用按钮绑定事件
		$("#blockUpBtn").click(function(){
			//获取已完结列表中选中行数据个数
			var selTrLen = $("#tableList tbody tr.yt-table-active").length;
			var thisTr = $("#tableList tbody tr.yt-table-active");
			var tableObjData = $(thisTr).data("tableObj");
			var thisBtn = $(this);
			//获取预算表ID
			var tableId = thisTr.find("input.tableId").val();
			if(selTrLen == 0){
				$yt_alert_Model.prompt("请选择一行数据进行操作");
				return  false;
			}else if(tableObjData.scheduleState == "3"){//判断当前选中表是否发布
				$yt_alert_Model.prompt("该表格已发布");
				return  false;
			}else{
				var  interfaceUrl = ""
				if(thisBtn.text()=="启用"){
					interfaceUrl="budget/table/setBudgetTableStateToEnable";
				}else{
					interfaceUrl="budget/table/setBudgetTableStateToDisable";
				}
				$.ajax({
						type: "post",
						url:interfaceUrl,
						async: false,
						data:{
							tableId:tableId
						},
						success: function(data) {
							$yt_alert_Model.prompt(data.message,2000);
							if(data.flag == 0){
							  //调用获取列表数据方法,刷新数据
							  budgetTableStyle.getBudgetList();
							}
						}
				});
			}
		});
		/**
		 * 
		 * 点击导入按钮操作
		 * 
		 */
		$(".import-btn,#importTabLab").click(function(){
			//显示导入初始弹出框
			var  importModeInitObj = $(".import-Model-init");
			sysCommon.showModel(importModeInitObj);
			//点击下一步按钮
			importModeInitObj.find(".next-btn").click(function(){
				//关闭当前弹出框
				sysCommon.closeModel(importModeInitObj);
				//调用显示导入表数据弹出框
				budgetTableStyle.showImportTableModel();
				//清除所有选中的复选框和单选
		 		importModeInitObj.find("label.yt-radio").removeClass("check").find("input").prop("checked",false);
		 		//设置第一个选中
		 		importModeInitObj.find("label.yt-radio:eq(0) input").setRadioState("check");
			});
			//点击导入初始弹出框取消按钮
			importModeInitObj.find(".canel-btn").click(function(){
				//关闭当前弹出框
				sysCommon.closeModel(importModeInitObj);
				//清除所有选中的复选框和单选
		 		importModeInitObj.find("label.yt-radio").removeClass("check").find("input").prop("checked",false);
		 		//设置第一个选中
		 		importModeInitObj.find("label.yt-radio:eq(0) input").setRadioState("check");
			});
		});
		/**
		 * 
		 * 
		 * 操作按钮区域调整按钮点击操作事件
		 * 
		 */
		$(".fun-btn-group button.adjust").on("click",function(){
			//获取已完结列表中选中行数据个数
			var selTrLen = $("#tableList tbody tr.yt-table-active").length;
			var thisTr = $("#tableList tbody tr.yt-table-active");
			var tableObjData = $(thisTr).data("tableObj");
			//tableOjbData = JSON.stringify(tableOjbData);  
			//tableOjbData = escape(tableOjbData);
			var thisBtn=$(this);
			var pageUrl = "";
			//获取表格Id
			var tableId = thisTr.find("input.tableId").val();
			//获取状态
			var trState=$("#tableList tbody tr.yt-table-active").find(".tr-state").text();
			if(selTrLen == 0){//判断是否选中表格数据
				$yt_alert_Model.prompt("请选择一行数据进行操作");
				return  false;
			}else if(trState == "停用"){//判断状态
				$yt_alert_Model.prompt("该表格已被停用");
				return  false;
			}else{
				//获取按钮自定义属性,判断功能按钮0调整样式1调整配置2调整值
				var btnFlag = $(this).attr("btnFlag");
				if(btnFlag == "0"){
					//判断当前选中表是否发布,已发布表格不能够调整样式
					if(tableObjData.scheduleState == "3"){
						$yt_alert_Model.prompt("该表格已发布");
						return  false;
					}else{
						pageUrl='view/system-sasac/budget/module/expenditure/addTable.html?tableId='+tableId+'&booksId='+budgetTableStyle.booksId;
					}
				}else if(btnFlag == "1"){
					pageUrl='view/system-sasac/budget/module/expenditure/configDefinition.html?tableId='+tableId;
				}
				window.location.href=$yt_option.websit_path+pageUrl;
			}
		});
		/**
		 * 
		 * 点击发布按钮
		 * 
		 */
		$("#releaseBtn").click(function(){
			window.location.href=$yt_option.websit_path+'view/system-sasac/budget/module/expenditure/publishBudgetTabList.html?booksId='+budgetTableStyle.booksId;
		});
		/***
		 * 
		 * 
		 * 点击删除按钮操作
		 * 
		 */
		$(".del-btn").click(function(){
			//获取已完结列表中选中行数据个数
			var selTrLen = $("#tableList tbody tr.yt-table-active").length;
			 //得到当前选中的行
			var thisTr = $("#tableList tbody tr.yt-table-active");
			if(selTrLen == 0){//判断是否选中表格数据
				$yt_alert_Model.prompt("请选择一行数据进行操作");
				return  false;
			}else if(thisTr.data("tableObj").scheduleState == "3"){//判断当前选中表是否发布
				$yt_alert_Model.prompt("该表格已发布");
				return  false;
			}else{
				$yt_alert_Model.alertOne({  
			        alertMsg: "数据删除将无法恢复,确认删除吗?", //提示信息  
			        confirmFunction: function() { //点击确定按钮执行方法  
				        	//获取表格ID
				        	var tableId = thisTr.data("tableObj").tableId;
				        	//ajax调用删除方法
				            $.ajax({
									type: "post",
									url:"budget/tm/deleteTableByTableId",
									async: false,
									data:{
										tableId:tableId
									},
									success: function(data) {
										$yt_alert_Model.prompt(data.message,2000);
										if(data.flag == 0){
										  //调用获取列表数据方法,刷新数据
										  budgetTableStyle.getBudgetList();
										}
									}
							});
			        } 
			    });  
			}
		});
	    /**
	     * 
	     * 
	     * 返回预算表管理页面
	     * 
	     */
	    $("#retuLab").click(function(){
	    	 $yt_common.parentAction({  
			    url:$yt_option.parent_action_path,//父级中转地址,固定配置项,只有统一修改处理。  
			    funName:'locationToMenu',//指定方法名，定位到菜单方法  
			    data:{  
			        url:'view/system-sasac/budget/module/expenditure/budgetTableManager.html'//要跳转的页面路径  
			    }  
			});  
	    });
	},
	/**
	 * 获取预算年度信息
	 * @param {Object} booksId
	 */
	getBudgetYearInfoById:function(booksId){
		$.ajax({
			type: 'post',
			url: 'budget/bm/getBooksInfo',
			data: {
				booksId:booksId
			},
			success: function(data) {
				if(data.flag == 0) {
					if(data.data){
						budgetTableStyle.booksObj = data.data;
						//部门预算表年度
						$(".dept-year").text(data.data.booksYear);
					}
				}
			}
		});
	},
	/**
	 * 
	 * 
	 * 显示导入表格数据弹出框
	 * 
	 * 
	 */
	showImportTableModel:function(){
		//接收弹出框对象
		var importModelObj  = $(".import-table-model");
		//调用公用方法显示提示框
		sysCommon.showModel(importModelObj);
		//全选  
        $(".parent-check").change(function(){  
            //判断自己是否被选中  
            if($(this).hasClass("check")){  
                //设置反选  
                $("table.budget-table tbody").setCheckBoxState("unCheckAll");   
            }else{  
                //调用设置选中方法,全选  
                $("table.budget-table tbody").setCheckBoxState("checkAll");   
            }  
        });  
        /* 
         *  
         * 表格中复选框操作 
         *  
         */  
        //获取区域复选框数量,用来比较  
        var  tableCheckLen = $("table.budget-table tbody label.yt-checkbox").length;  
        $("table.budget-table tbody label.yt-checkbox").off().on("change",function(){  
            if($(this).hasClass("check")){  
                //取消全选  
                $("input.check-all").prop("checked",false).setCheckBoxState("uncheck");  
            }else{  
                //设置当前复选框选中  
                $(this).find("input").setCheckBoxState("check");  
                //比对选中的复选框数量和区域内复选框数量  
                if($("table.budget-table tbody label.yt-checkbox.check").length == tableCheckLen){  
                    //设置反选  
                    $("input.check-all").prop("checked",true).setCheckBoxState("check");  
                }  
            }  
        });  
		//点击确定按钮
		importModelObj.find(".sure-btn").click(function(){
		 	//关闭当前弹出框
		 	sysCommon.closeModel(importModelObj);
		 	//提交数据刷新列表数据
		 	//清除所有选中的复选框和单选
		 	importModelObj.find("label.yt-radio,label.yt-checkbox").removeClass("check").find("input").prop("checked",false);
		});
		//点击取消按钮
		importModelObj.find(".canel-btn").click(function(){
		 	//关闭当前弹出框
		 	sysCommon.closeModel(importModelObj);
		 	//清除所有选中的复选框和单选
		 	importModelObj.find("label.yt-radio,label.yt-checkbox").removeClass("check").find("input").prop("checked",false);
		});
		//点击返回上一级按钮
		 importModelObj.find(".retn-btn").click(function(){
		 	//关闭当前弹出框
		 	sysCommon.closeModel(importModelObj);
		 	//显示导入初始弹出框
		 	sysCommon.showModel($(".import-Model-init"));
		 	//清除所有选中的复选框和单选
		 	importModelObj.find("label.yt-radio,label.yt-checkbox").removeClass("check").find("input").prop("checked",false);
		 });
	},
	/**
	 * 
	 * 
	 * 获取列表数据
	 * 
	 */
	getBudgetList:function(){
		$('.budget-table-page').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url:"budget/tm/getPageTableList", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				booksId:budgetTableStyle.booksId
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				var htmlTbody = $('#tableList .yt-tbody');
				htmlTbody.empty();
				var trStr  = "";
				if(data.flag==0){
					var datas = data.data.rows;
					if(datas.length > 0){
						//显示分页
						$(".budget-table-page").show();
						var trDoc  = '';
						//tableId	表Id
						//tableCode	表编码
						//tableName	表名称
						//tableYear	表年份
						//budgetStage	预算阶段
						//budgetType	预算类型编码
						//budgetTypeName	预算类型名称
						//tableDescribe	表描述
						//lastOperatorUserCode	最后一次操作人code
						//lastOperatorUserName	最后一次操作人名称
						//lastOperatorDateTime	最后一次操作时间		
						//拼接预算表数据
						var sty1 ,sty2,sty2,sty3,line1,line2= "";
						$.each(datas,function (i,n){
							sty1 = sty2 = sty3 = line1 = line2 = "";
							//drawCount	表样式数量configCount	表配置数量dataCount	预算数据数量
							trDoc = '<tr>'+
						 	    		'<td><input class="tableId" value="'+n.tableId+'" type="hidden">'+n.tableCode+'</td>'+
						 	    		'<td>'+n.budgetTypeName+'</td>'+
						 	    		'<td style="text-align: left;" class="text-overflow-sty"  title="'+n.tableName+'">'+n.tableName+'</td>'+
						 	    		'<td class="plan-td">';
						 	    		//判断进度状态0 未做任何操作1 表样配置2 属性配置3 已发布
										if(n.scheduleState == 1){
											sty1 = "state-sty";
										}else if(n.scheduleState == 2){
											sty1 = sty2 = line1 = "state-sty";
										}else if(n.scheduleState == 3){
											sty1 = sty2 = sty3 = line1 = line2 = "state-sty";
										}
							 	    	trDoc +='<div class="state-plan style-plan"><div class="circle-div '+sty1+'"><div class="state-line '+line1+'"></div></div></div>'
							 	    	+'<div class="state-plan config-plan"><div class="circle-div '+sty2+'"><div class="state-line '+line2+'"></div></div></div>'
							 	    	+'<div class="state-plan release-plan"style="margin-right:0px;"><div class="circle-div '+sty3+'"></div></div>';
							 	    	trDoc +='<div style="clear: both;"></div><div class="state-text-model"><label>样式配置</label><label style="margin-left: 20px;">属性配置</label><label style="margin-left: 28px;">已发布</label></div>';
						 	    		trDoc +='</td>'+
						 	    		'<td>'+(n.state==1?'<span class="tr-state" style="color:#4aae62">启用</span>':'<span class="tr-state" style="color:#ff0000">停用</span>')+'</td>'+
						 	    		'<td>'+n.lastOperatorDateTime+'</td>'+
						 	    		'<td>'+n.lastOperatorUserName+'</td>'+
						 	    	'</tr>';
						 	 //存储表格对象信息
						 	 trDoc = $(trDoc);
						 	 trDoc.data("tableObj",n);
							$("#tableList tbody").append(trDoc);
						});
					}else{
						//没有数据是显示数据
						htmlTbody.append(budgetTableStyle.noDataTrStr(7));
						//隐藏分页
						$(".budget-table-page").hide();
						//调用按钮操作事件方法
						budgetTableStyle.events();
					}
				}
			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	/**
	 * 拼接暂无数据内容
	 * @param {Object} trNum  行数
	 */
	noDataTrStr:function(trNum){
		//暂无数据内容
		var noDataStr = '<tr style="border:0px;background-color:#fff !important;"><td  colspan="'+trNum+'" align="center"style="border:0px;"><div class="no-data" style="font-size: 18px;margin: 0 auto;">' +
			'<label>暂无预算表，请选择<a class="yt-link" id="newTabLab">创建新预算表</a>或<a class="yt-link" id="importTabLab">导入预算表</a>。</label>' +
			'</div></td></tr>';
	    return noDataStr;
	}
};

$(function(){
	//初始化页面
	budgetTableStyle.init();
	//调用获取列表数据方法
	budgetTableStyle.getBudgetList();
});
