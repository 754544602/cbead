var budgetTableStyle={
	booksId:'',//账套id
	budgetStage:'',//阶段code：budgetStage
	init:function(){
		
		//获取页面跳转传输的参数对象
		var requerParameter = $yt_common.GetRequest();
		// 获取传输的项目ID
		budgetTableStyle.booksId = requerParameter.booksId;
		budgetTableStyle.budgetStage = requerParameter.budgetStage;
		//初始化单位名称下拉列表
		budgetTableStyle.getUtilName();
		//绑定页面事件
		budgetTableStyle.events();
		//给当前页面设置最小高度
		$("#budgetTableStyle").css("min-height",$(window).height()-15);
	},
	events:function(){
		//页面底部取消按钮事件
		$("#approveCanelBtn").click(function(){
			window.history.back(-1);
		});
		//状态筛选多选框change事件
		$('.status-model .checkbox1').change(function() {
			if($(".status-model .checkbox1").is(':checked')){
				$(".status-model .checkbox-state").each(function(i,n){
					$(n).setCheckBoxState("check");
				});
			}else{
				$(".status-model .checkbox-state").each(function(i,n){
					$(n).setCheckBoxState("uncheck");
				});
			}
			budgetTableStyle.getBudgetList();
		});
		$('.status-model .checkbox2,.status-model .checkbox3').change(function() {
			if($(".status-model .checkbox2").is(':checked')&&$(".status-model .checkbox3").is(':checked') ){
				$(".status-model .checkbox-state").each(function(i,n){
					$(n).setCheckBoxState("check");
				});
			}else{
				$(".status-model .checkbox1").each(function(i,n){
					$(n).setCheckBoxState("uncheck");
				});
			}
			budgetTableStyle.getBudgetList();
		});
		//弹出窗多选框change事件
		$('.update-data-pop .checkbox1').change(function() {
			if($(".update-data-pop .checkbox1").is(':checked')){
				$(".update-data-pop .checkbox1").each(function(i,n){
					$(n).setCheckBoxState("check");
				});
			}else{
				$(".update-data-pop .checkbox-state").each(function(i,n){
					$(n).setCheckBoxState("uncheck");
				});
			}
			//调用查询方法
			//budgetTableStyle.getBudgetList();
		});
		$('.update-data-pop .checkbox2').change(function() {
			if($(".update-data-pop .checkbox2").is(':checked')){
				$(".update-data-pop .checkbox1,.update-data-pop .checkbox2").each(function(i,n){
					$(n).setCheckBoxState("check");
				});
			}else{
				$(".update-data-pop .checkbox2,.update-data-pop .checkbox3").each(function(i,n){
					$(n).setCheckBoxState("uncheck");
				});
			}
			//调用查询方法
			//budgetTableStyle.getBudgetList();
		});
		$('.update-data-pop .checkbox3').change(function() {
			if($(".update-data-pop .checkbox3").is(':checked')){
				$(".update-data-pop .checkbox-state").each(function(i,n){
					$(n).setCheckBoxState("check");
				});
			}else{
				$(".update-data-pop .checkbox3").each(function(i,n){
					$(n).setCheckBoxState("uncheck");
				});
			}
			//调用查询方法
			//budgetTableStyle.getBudgetList();
		});
		//弹出框table下的多选框
		$('.update-data-pop').on('change','.checkbox-all',function(){
			//调用冒泡方法
			//$yt_common.eventStopPageaction();
			if($(".update-data-pop .checkbox-all").is(':checked')){
				$(".table-div-checkbox .pop-checkbox").each(function(i,n){
					$(n).setCheckBoxState("check");
				});
			}else{
				$(".table-div-checkbox .pop-checkbox").each(function(i,n){
					$(n).setCheckBoxState("uncheck");
				});
			}
		});
		$(".table-div-checkbox").on('change','.pop-checkbox',function(){
			//调用冒泡方法
			//$yt_common.eventStopPageaction();
			var isChecked=true;
			$(".table-div-checkbox .pop-checkbox").each(function(i,n){
				if(!$(n).is(':checked')){
					isChecked=false;
					return ;
				}
			});
			
			if(isChecked){
				$(".update-data-pop .checkbox-all").each(function(i,n){
					$(n).setCheckBoxState("check");
				});
			}else{
				$(".update-data-pop .checkbox-all").each(function(i,n){
					$(n).setCheckBoxState("uncheck");
				});
			}
		});
		//重置按钮事件
		$("#resetBtn").click(function(){
			$("#queryParams").val("");
			$(".checkbox-state").each(function(i,n){
				$(n).setCheckBoxState("uncheck");
			});
			budgetTableStyle.getBudgetList();
		});
		//查询按钮事件
		$("#heardSearchBtn").click(function(){
			budgetTableStyle.getBudgetList();
		});
		//新增按钮事件
		$("#addRiskBtn").click(function(){
			window.location.href=$yt_option.websit_path+'view/system-sasac/budget/module/expenditure/addTable.html?booksId='+budgetTableStyle.booksId+'&budgetStage='+budgetTableStyle.budgetStage;
		});
		//修改按钮事件
		$("#tableList").on("click",".operate-update",function(){
			var thisObj=$(this);
			var tableId=thisObj.parents("tr").find("input.tableId").val();
			
			window.location.href=$yt_option.websit_path+'view/system-sasac/budget/module/expenditure/addTable.html?tableId='+tableId+'&booksId='+budgetTableStyle.booksId+'&budgetStage='+budgetTableStyle.budgetStage;
		});
		//行点击时修改启用按钮事件
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
			var thisBtn=$(this);
			var loanId = thisTr.find("input.tableId").val();
			if(selTrLen == 0){
				$yt_alert_Model.prompt("请选择一行数据进行操作");
			}else{
				if(thisBtn.text()=="启用"){
					//设置当前行的启用
					//tableId	预算表Id
					$.ajax({
						type: "post",
						url:"budget/table/setBudgetTableStateToEnable",
						async: false,
						data:{
							tableId:loanId
						},
						success: function(data) {
							if(data.flag == 0){
								thisTr.find(".tr-state").text("启用").css("color","#4aae62");
								thisBtn.text("停用");
							}else{
								$yt_alert_Model.prompt(data.message,2000); 
							}
						}
					});
				}else{
					//设置当前行的停用
					//tableId	预算表Id
					$.ajax({
						type: "post",
						url:"budget/table/setBudgetTableStateToDisable",
						async: false,
						data:{
							tableId:loanId
						},
						success: function(data) {
							if(data.flag == 0){
								thisTr.find(".tr-state").text("停用").css("color","#ff0000");
								thisBtn.text("启用");
							}else{
								$yt_alert_Model.prompt(data.message,2000); 
							}
						}
					});
				}
			}
		});
		//一键导入按钮事件
		$(".fun-btn-group").on("click",".update-plan-item",function(){
			//调用添加弹出窗
			budgetTableStyle.showUpdateAlert();
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
			var tableOjbData = $(thisTr).data("tableObj");
			tableOjbData = JSON.stringify(tableOjbData);  
			tableOjbData = escape(tableOjbData);
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
					pageUrl='view/system-sasac/budget/module/expenditure/addTable.html?tableId='+tableId+'&tableOjbData='+tableOjbData+'&booksId='+budgetTableStyle.booksId+'&budgetStage='+budgetTableStyle.budgetStage;
				}else if(btnFlag == "1"){
					pageUrl='view/system-sasac/budget/module/expenditure/configDefinition.html?tableId='+tableId+'&tableOjbData='+tableOjbData+'&booksId='+budgetTableStyle.booksId+'&budgetStage='+budgetTableStyle.budgetStage;
				}else if(btnFlag == "2"){
					pageUrl='view/system-sasac/budget/module/expenditure/budgetStatistics.html?tableId='+tableId+'&tableOjbData='+tableOjbData+'&booksId='+budgetTableStyle.booksId+'&budgetStage='+budgetTableStyle.budgetStage;
				}
				window.location.href=$yt_option.websit_path+pageUrl;
			}
		});
	},
	/*获取列表数据*/
	getBudgetList:function(){
		//queryParams	查询条件(表名称)
		//stateStr	状态字符串       1 启用   2 停用
		//pageIndex	分页页数
		//pageNum	分页条数
		var queryParams=$("#queryParams").val();
		var stateStr=budgetTableStyle.quotaCheck();
		
		$('.budget-table-page').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url:"/budget/table/getPageTableDetailListByParams", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				booksId:budgetTableStyle.booksId,
				budgetStage:budgetTableStyle.budgetStage,
				queryParams:queryParams,
				stateStr:stateStr,
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
						var defSty = "background: #ccc;color: #666666;";
						var colorSty = "background: #6495bc;color: #fff;";
						var sty1 = "";
						var sty2 = "";
						var sty3 = "";
						$.each(datas,function (i,n){
							sty1 = defSty;
							sty2 = defSty;
							sty3 = defSty;
							//drawCount	表样式数量configCount	表配置数量dataCount	预算数据数量
							trDoc = '<tr>'+
						 	    		'<td><input class="tableId" value="'+n.tableId+'" type="hidden">'+n.tableCode+'</td>'+
						 	    		'<td>'+n.budgetTypeName+'</td>'+
						 	    		'<td style="text-align: left;">'+n.tableName+'</td>'+
						 	    		'<td class="plan-td">';
						 	    		//判断进度状态0 未做任何操作1 表样配置2 属性配置3 预算编制
										if(n.scheduleState == 1){
											sty1 = colorSty;
										}else if(n.scheduleState == 2){
											sty1 = colorSty;
											sty2 = colorSty;
										}else if(n.scheduleState == 3){
											sty1 = colorSty;
											sty2 = colorSty;
											sty3 = colorSty;
										}
										trDoc +='<div class="plan-div style-plan" style="'+ sty1 +'">表样配置</div>'
							 	    		+'<div class="plan-div config-plan" style="'+ sty2 +'">属性配置</div>'
							 	    		+'<div class="plan-div edit-plan"style="margin-right:0px;'+ sty3 +'">预算编制</div>';
							 	    		
						 	    		trDoc +='</td>'+
						 	    		'<td>'+(n.state==1?'<span class="tr-state" style="color:#4aae62">启用</span>':'<span class="tr-state" style="color:#ff0000">停用</span>')+'</td>'+
						 	    		'<td>'+n.lastOperatorUserName+'</td>'+
						 	    		'<td>'+n.lastOperatorDateTime+'</td>'
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
					}
				}
				
			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	//遍历使用额度多选框的状态
	quotaCheck: function() {
		var str = '';
		$('.status-model .checkbox-state').each(function(i, n) {
			if(n.checked){
				var s = $(n).val();
				str += s + ',';
			}
		});
		return str.substring(0,str.length-1);
	},
	/**
	 * 拼接暂无数据内容
	 * @param {Object} trNum  行数
	 */
	noDataTrStr:function(trNum){
		//暂无数据内容
		var noDataStr = '<tr style="border:0px;background-color:#fff !important;"><td  colspan="'+trNum+'" align="center"style="border:0px;"><div class="no-data" style="width: 280px;margin: 0 auto;">' +
			'<img src="../../../../../resources-sasac/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
			'</div></td></tr>';
	    return noDataStr;
	},
	//编辑弹出框  
	showUpdateAlert:function() {
		
		budgetTableStyle.anImportGetQueryInfo();
		budgetTableStyle.anImportGetList();
		
		/**显示编辑弹出框和显示顶部隐藏蒙层 */
		$(".yt-edit-alert.update-data-pop,#heard-nav-bak").show();
		/*调用算取div显示位置方法 */
		$yt_alert_Model.getDivPosition($(".yt-edit-alert.update-data-pop"));
		
		//弹窗查询按钮事件绑定
		$(".update-data-pop .query-plan-btn").click(function(){
			//验证非空字段
			var isTrue= $yt_valid.validForm($(".yt-edit-alert.update-data-pop .pop-query-group"));  
			if(isTrue){
				//调用查询
				budgetTableStyle.anImportGetList();
				/*调用算取div显示位置方法 */
				$yt_alert_Model.getDivPosition($(".yt-edit-alert.update-data-pop"));
			}
		});
		//弹窗重置按钮事件绑定
		$(".update-data-pop .reset-btn").click(function(){
			//初始化数据
			$(".update-data-pop .nice-select,#copyBudgetStage,#copyBooksYear").removeClass("valid-hint");
			$(".update-data-pop .valid-font").text("");
			//初始化单位名称列表
			$('#copyBudgetStage,#copyBooksYear').val("");
			$('#copyBudgetStage').niceSelect();
			budgetTableStyle.anImportGetList();
		});
		//确定按钮事件绑定
		$(".update-data-pop").off("click").on("click",".sure-plan-btn",function(){
			//验证非空字段
			var isTrue= $yt_valid.validForm($(".yt-edit-alert.update-data-pop"));
			var isChecked=false;
			$(".update-data-pop .checkbox1,.update-data-pop .checkbox2,.update-data-pop .checkbox3").each(function(i,n){
				if($(n).is(':checked')){
					isChecked=true;
					return ;
				}
			});
			if(isChecked){
				var isChecked2=false;
				$(".update-data-pop .table-div-checkbox .pop-checkbox").each(function(i,n){
					if($(n).is(':checked')){
						isChecked2=true;
						return ;
					}
				});
				if(!isChecked2){
					$yt_alert_Model.prompt("请选择一条数据");
					isTrue=false;
				}
			}else{
				$yt_alert_Model.prompt("请选择一条复制样式");
				isTrue=false;
			}
			
			if(isTrue){
				//参数
				/*
				 	booksId	帐套Id	
					budgetStage	预算阶段	
					copyBooksYear	查询-预算年度	
					copyBudgetStage	查询-所属阶段	
					copyStyle	是否复制表样	1 是 2否
					copyConfig	是否复制配置	1 是 2否
					copyData	是否复制数据	1 是 2否
					copyTableIdStr	选择的预算表Id,字符串	多个用英文逗号分隔
				 * */
				
				var copyBooksYear = $("#copyBooksYear").val();
				var copyBudgetStage =  $("#copyBudgetStage").val();
				var copyStyle=($(".update-data-pop .checkbox1").is(':checked') ? 1 : 2);
				var copyConfig=($(".update-data-pop .checkbox2").is(':checked') ? 1 : 2);
				var copyData=($(".update-data-pop .checkbox3").is(':checked') ? 1 : 2);
				var copyTableIdStr="";
				$(".table-div-checkbox .pop-checkbox").each(function(i,n){
					if($(n).is(':checked')){
						copyTableIdStr += $(n).val() + ',';
					}
				});
				copyTableIdStr=copyTableIdStr.substring(0,copyTableIdStr.length-1);
				$.ajax({
					type: "post",
					url: 'budget/books/saveCopyBooksInfo', //ajax访问路径  
					async: false,
					data: {
						booksId:budgetTableStyle.booksId,
						budgetStage:budgetTableStyle.budgetStage,
						copyBooksYear:copyBooksYear,
						copyBudgetStage:copyBudgetStage,
						copyStyle:copyStyle,
						copyConfig:copyConfig,
						copyData:copyData,
						copyTableIdStr:copyTableIdStr,
					},
					success: function(data) {
						//初始化数据
						$(".update-data-pop .nice-select,#copyBudgetStage,#copyBooksYear").removeClass("valid-hint");
						$(".update-data-pop .valid-font").text("");
						//初始化单位名称列表
						$('#copyBudgetStage,#copyBooksYear').val("");
						$('#copyBudgetStage').niceSelect();
						$(".table-div-checkbox .yt-tbody").html("");
						//初始化多选框
						$(".update-data-pop .checkbox1,.update-data-pop .checkbox2,.update-data-pop .checkbox3").each(function(i,n){
							$(n).setCheckBoxState("uncheck");
						});
						//隐藏页面中自定义的表单内容
						$(".yt-edit-alert,#heard-nav-bak").hide();
						//隐藏蒙层  
						$("#pop-modle-alert").hide();
						budgetTableStyle.getBudgetList();
						$yt_alert_Model.prompt(data.message);
					}
				});
			}
		});
		/** 
		 * 点击取消方法 
		 */
		$('.update-data-pop .canel-btn').click(function() {
			//初始化数据
			$(".update-data-pop .nice-select,#copyBudgetStage,#copyBooksYear").removeClass("valid-hint");
			$(".update-data-pop .valid-font").text("");
			//初始化单位名称列表
			$('#copyBudgetStage,#copyBooksYear').val("");
			$('#copyBudgetStage').niceSelect();
			$(".table-div-checkbox .yt-tbody").html("");
			//初始化多选框
			$(".update-data-pop .checkbox1,.update-data-pop .checkbox2,.update-data-pop .checkbox3").each(function(i,n){
				$(n).setCheckBoxState("uncheck");
			});
			//隐藏页面中自定义的表单内容
			$(".yt-edit-alert,#heard-nav-bak").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
	},
	//2.3.5.5一键导入: 根据条件获取未复制的表信息列表
	anImportGetList:function(){
		//获取参数
		/*copyBooksYear	查询-所属年度 
		 copyBudgetStage	查询-所属阶段
		 booksId	帐套Id
		 budgetStage	预算阶段*/
		var copyBudgetStage =  $("#copyBudgetStage").val();
		var copyBooksYear = $("#copyBooksYear").val();
		$.ajax({
			type: "post",
			url: 'budget/books/getNotCopyTableListByParams', //ajax访问路径  
			async: false,
			data: {
				copyBooksYear:copyBooksYear,
				copyBudgetStage:copyBudgetStage,
				booksId:budgetTableStyle.booksId,
				budgetStage:budgetTableStyle.budgetStage,
			},
			success: function(data) {
				var datas = data.data;
				if(data.flag == 0) {
					/*
					 
					    tableId	表Id
						tableCode	表编码
						tableName	表名称
						tableYear	表年份
						budgetStage	预算阶段
						budgetStageName	预算阶段名称
						budgetType	预算类型编码
						budgetTypeName	预算类型名称
						tableDescribe	表描述
						drawTableId	自定义表Id 
						
					 */
					if(data.data.length>0){
						$(".table-div-checkbox .yt-tbody").html("");
						var allHtml="";
						$(data.data).each(function(i,n){
							allHtml += '<tr>'+
									'<td style="text-align: left;padding-left: 17px;">'+
									'<label class="check-label yt-checkbox"><input class="pop-checkbox checkbox-'+i+'" type="checkbox" name="test" value="'+n.tableId+'"/>'+n.tableCode+'</label>'+
									'</td>'+
									'<td>'+n.tableName+'</td>'+
									'</tr>';
						});
						$(".table-div-checkbox .yt-tbody").html(allHtml);
						$(".update-data-pop .table-two,.update-data-pop .check-label").show();
						
					}else{
						var noDataStr = '<tr style="border:0px;background-color:#fff !important;"><td  colspan="'+2+'" align="center"style="border:0px;"><div class="no-data" style="width: 280px;margin: 0 auto;padding:0px;">' +
									'<img src="../../../../../resources-sasac/images/common/no-data.png" alt="" style="padding:0;">' +
									'</div></td></tr>';
						$(".table-div-checkbox .yt-tbody").html(noDataStr);
						$(".update-data-pop .table-two,.update-data-pop .check-label").hide();
					}
					//多选框默认值设置
					$(".update-data-pop .checkbox1,.update-data-pop .checkbox2,.update-data-pop .checkbox3,.update-data-pop .checkbox-all,.table-div-checkbox .pop-checkbox").each(function(i,n){
						$(n).setCheckBoxState("check");
					});
				}else{
					$yt_alert_Model.prompt(data.message);
				}
			}
		});
	},
	//一键导入: 根据条件获取帐套历史导入时,查询所选的属性信息
	anImportGetQueryInfo:function(){
		//获取参数
		//张套id  	budgetTableStyle.booksId;
		//阶段code		budgetTableStyle.budgetStage;
		/*	
		 booksId	帐套Id
		 budgetStage	预算阶段
		 */
		$.ajax({
			type: "post",
			url: 'budget/books/getCopyBooksAttrsByBooksId', //ajax访问路径  
			async: false,
			data: {
				booksId:budgetTableStyle.booksId,
				budgetStage:budgetTableStyle.budgetStage,
			},
			success: function(data) {
				var datas = data.data;
				if(data.flag == 0) {
					if(data.data){
						$("#copyBudgetStage").val(datas.copyBudgetStage).niceSelect();
						$("#copyBooksYear").val(datas.copyBooksYear);
						//判断查询区域是否应该有值
						if($("#copyBudgetStage").val() && $("#copyBooksYear").val()){
							$("#copyBudgetStage").attr('disabled',true).niceSelect();
							$("#copyBooksYear").attr('disabled', 'disabled');
							$(".update-data-pop .query-plan-btn,.update-data-pop .reset-btn").hide();
						}else{
							$("#copyBudgetStage").attr('disabled',false).niceSelect();
							$("#copyBooksYear").attr('disabled', 'false');
							$(".update-data-pop .query-plan-btn,.update-data-pop .reset-btn").show();
						}
					}
				}else{
					$yt_alert_Model.prompt(data.message);
				}
			}
		});
	},
	//初始化单位名称
	getUtilName:function(){
		$.ajax({
			type: "post",
			url: $yt_option.base_path + 'budget/table/getBudgetClassifyDataByParams?tableKey=coso_classify_budget_stage', //ajax访问路径  
			async: false,
			data: {},
			success: function(data) {
				var datas = data.data.rows;
				if(data.flag == 0) {
					var numOptions = '<option value="">请选择</option>';
					//判断返回的数据
					$('#copyBudgetStage').empty();
					if(datas.length > 0 && datas != undefined && datas != null) {
						$.each(datas, function(i, n) {
							numOptions += '<option value="' + n.code + '" sel-val="' + n.name + '">' + n.name + '</option>'
						});
						$('#copyBudgetStage').append(numOptions);
					}
					$('#copyBudgetStage').niceSelect();
				}
			}
		});
	},
};

$(function(){
	//初始化页面
	budgetTableStyle.init();
	//获取预算类别方法
	budgetTableStyle.getBudgetList();
});
