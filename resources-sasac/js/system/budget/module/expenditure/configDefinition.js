var  configCommonObj ={
	 cellImgDef:"../../../../../resources-sasac/images/common/defau-icon.png",//表间计算选中单元格默认图标
	 cellImgCheck:"../../../../../resources-sasac/images/common/sure-icon.png",//表间计算选中单元格确定图标
	 booksId:"",//预算年度Id
	 tableId:"",//预算表ID
	 budgetStage:""//阶段code
}

//全局的表格Id
var tableIdObj = "";
$(function(){
	//获取页面跳转传输的参数对象
	var requerParameter = $yt_common.GetRequest();
	if(requerParameter){
		//获取预算表ID
		configCommonObj.tableId = requerParameter.tableId;
		if(configCommonObj.tableId && configCommonObj.tableId  !=undefined && configCommonObj.tableId  !=""){
			//调用获取表数据方法
			tableIdObj = getConfigData.getbudgetInfoById(configCommonObj.tableId);
			//预算年度Id
			configCommonObj.booksId = tableIdObj.booksId;
		}
	}
	//获取表格信息
	getConfigData.getTableData();
	//给列加编号的td加样式
	$(".datagrid-htable .datagrid-header-row:eq(0) td").addClass("td-num-sty");
	//添加layout的高度
	$(".easyui-layout:not(.fun-btn-model)").css("height",$(window).height()+"px");
    $(".easyui-layout:not(.fun-btn-model)").layout("resize", {
        width: "100%",
        height: ($(window).height()) + "px"
    });
    /**
     * 
     * 
     * 点击顶部返回按钮操作事件
     * 
     */
    $("button.page-retu-btn").click(function(){
    	   window.location.href= $yt_option.websit_path+'view/system-sasac/budget/module/expenditure/budgetTableStyle.html?booksId='+configCommonObj.booksId;
    	  /*  $yt_common.parentAction({
				url:$yt_option.parent_action_path,//父级中转地址,固定配置项,只有统一修改处理。
				funName:'locationToMenu',//指定方法名，定位到菜单方法
				data:{
					url:'view/system-sasac/budget/module/expenditure/budgetTableStyle.html?booksId='+configCommonObj.booksId+'&budgetStage='+configCommonObj.budgetStage//要跳转的页面路径
				}
			});*/
    });
    /**
     * 
     * 点击行配置中的,优先级复选框事件
     * 
     */
    $("#rowFirst").change(function(){
    	//判断是否选中
    	if($(this).is(":checked")){
    		//显示遮盖格式字段的div
    		$("div.dis-div").show();
    	}else{
    		//显示遮盖格式字段的div
    		$("div.dis-div").hide();
    	}
    });
    //配置按钮点击事件
    $("#createConfigTableDiv").on('click','th.indicate:not(.dis)',function (){
    	//去除行或列的选中编号的选中标识
	    $(".rule-table tr th").removeClass("select-btn");
    	//隐藏单元格选中显示的弹出框
    	$(".tip-valid-sty").hide();
    	//获取当前选中的配置按钮存储的配置信息
    	var configData = $(this).data("configData");
    	//获取当前选中的配置表
    	var configTable = $(".rule-table");
    	configTable.find("tr").removeClass("sel-shadow");
    	//基础数据
    	var tableData = configTable.data("tableData");
    	var valText = '';
		//配置区域对象
    	var configDoc = ""; 
    	var thisText = $(this).text().trim(); 
    	//删除所有列配置按钮选中的样式,和之前加的最后一行对应列的下边框
    	//$(".rule-table tr:last-child td").removeClass("td-shadow cell-shadow").removeAttr("style");
    	//删除所有列的选中样式
    	$(".rule-table td").removeClass("td-shadow cell-shadow");
    	$(".rule-table td").css("border-bottom","1px solid #DFE6F3");
    	//比对当前配置按钮中的文本是否包含R,包含代表是行
    	if(thisText.indexOf("R") != -1){
    		//给当前选中的行配置加选中样式
    		$(this).parent().siblings().removeClass("tr-shadow");
    		$(this).parent().addClass("tr-shadow");
    		configDoc = $(".row-config-panel .model-content");
    		//关闭列的配置面板
    		$(".column-config-panel .model-content").hide().next().show();
			$('#config-layout').layout('collapse','south');
			//显示配置行面板的操作按钮部分
			$(".row-config-panel .config-btngroup").show();
			$(".column-config-panel .config-btngroup").hide();
			//修改底部配置面板标题名称
			$('#config-layout').layout('panel', 'south').panel({ title: '列的配置' });
			//显示列的提示信息
    		$(".column-config-panel .no-select-table").show();
    	}else{
    		configDoc = $(".column-config-panel .model-content");
    		//获取当前选中的配置th的索引
    		var selThIndex = $(this).index();
    		var activeTable = $("#createConfigTableDiv .rule-table");
    		//删除选中行配置添加的样式
    		activeTable.find("tr").removeClass("tr-shadow");
    		//删除所有列的选中样式
    		activeTable.find("tr td").removeClass("td-shadow");
    		//添加列的选中的配置列样式
    		//activeTable.find("tbody tr td").removeClass("td-shadow").removeAttr("style");
    		activeTable.find("tbody tr td").each(function(){
    			if($(this).index() == selThIndex){
	    			$(this).addClass("td-shadow");
	    			if($(this).parent().index() == activeTable.find("tbody tr").length - 1){
	    				$(this).css("border-bottom","2px solid #417095");
	    			}
	    		}
    		});
    		//关闭行的配置面板
    		$(".row-config-panel .model-content").hide().next().show();
			$('#config-layout').layout('collapse','east');
			//显示配置列面板的操作按钮部分
			$(".row-config-panel .config-btngroup").hide();
			$(".column-config-panel .config-btngroup").show();
    	}
    	
    	//判断是否包含配置表头,有则表示是点击的列的配置按钮
    	if($(this).parent().parent().hasClass("indicate-head")){
    		//隐藏提示信息
    		$(".column-config-panel .no-select-table").hide();
    		//调用拼接底部配置区域结构的方法
    		getConfigData.addBotConfigHtml("c");
    		configDoc = $(".column-config-panel .model-content");
    		//获取配置按钮的索引
    		var configIndex = $(this).parent().find(".config-btn:eq(0)").index();
    		//判断选中的配置按钮个数,是0的话给当前的配置按钮添加选中类
    		$(this).siblings().removeClass("select-btn");
    		if($(this).siblings(".select-btn").length == 0){
    			$(this).addClass("select-btn");
    		}else{
    			//获取配置列
    			//getConfigData.getcolumConfig($(this).parent().find(".select-btn"),"c");
    			$(this).addClass("select-btn").siblings().removeClass("select-btn");
    		}
    		$(".column-config-panel .model-content,.column-config-panel .config-btngroup").show();
	    	//清除计算按钮
			//configDoc.find(".is-calculation").parent().removeClass("check");
			//configDoc.find(".is-calculation").attr("checked", false);
			//清除计算公式验证
			configDoc.find(".formual").hide().find("input").removeClass("valid-hint").val('').removeAttr("validform").next().html('');
			//清除属性选中的默认选数字
			if(configDoc.find(".property-model .yt-radio:eq(0) input").length>0){
				configDoc.find(".property-model .yt-radio:eq(0) input").setRadioState("check");
			}
			configDoc.find(".property-val-model").hide();
	    	//序号
	    	var valText = $(this).index();
	    	configDoc.find(".column-num").text(valText);
	    	//列名 暂时不用
	    	//var valText = $(".rule-table").find(".column-name"+($(this).index()-configIndex+1)).text();
	    	//configDoc.find(".column-name").text(valText);
	    	$(".column-config-panel .attributes-list").empty();
	    	//调用设置表单方法
	    	getConfigData.setFormData($(this),$(".column-config-panel"));
	    	//修改面板标题
	    	$('#config-layout').layout('panel', 'south').panel({ title: '列的配置' });
	    	if($('#config-layout').layout('panel','south').is(":hidden")){
	    		$('#config-layout').layout('expand','south');
	    	}
	    	//存储列的配置信息
    		$(".column-config-panel").data("crConfigData",$(this).data("configData"));
    		//判断列是否有配置数据
    		if($(this).data("configData") != undefined){
    			//有显示清除配置按钮
    			$(".column-config-panel").find("button.clear-config-btn").show();
    		}else{
    			//有显示清除配置按钮
    			$(".column-config-panel").find("button.clear-config-btn").hide();
    		}
    	}else{
    		$(this).parent().parent().find(".select-btn").removeClass("select-btn");
    		if($(this).parent().parent().find(".select-btn").length == 0){
    			$(this).addClass("select-btn");
    		}else{
    			//getConfigData.getcolumConfig($(this).parent().parent().find(".select-btn"),"r");
    			$(this).parent().parent().find(".select-btn").removeClass("select-btn");
    			$(this).addClass("select-btn");
    		}
	    	//清除计算按钮
			//configDoc.find(".is-calculation").parent().removeClass("check");
			//configDoc.find(".is-calculation").attr("checked", false);
			//清除计算公式验证
			configDoc.find(".formual").hide().find("input").removeClass("valid-hint").val('').removeAttr("validform").next().html('');
			//清除属性选中的默认选数字
			if(configDoc.find(".property-model .yt-radio:eq(0) input").length>0){
				configDoc.find(".property-model .yt-radio:eq(0) input").setRadioState("check"); 
			}
			configDoc.find(".property-val-model").hide();
			
			
    		configDoc = $(".row-config-panel .model-content"); 
    		$(".row-config-panel .model-content").show().next().hide();
    		//序号
	    	var valText = $(this).parent().index() + 1;
	    	configDoc.find(".row-num").text(valText);
	    	
	    	//功能科目
			valText = $(this).parent().find("td").eq($(this).parents(".config-table").find(".config-thead tr th.subject-code").index()).text();
			configDoc.find(".subject").text((valText == "" ? "--" : valText));
			//单位编码
			valText = $(this).parent().find("td").eq($(this).parents(".config-table").find(".config-thead tr th.co-code").index()).text();
			configDoc.find(".co-code").text((valText == "" ? "--" : valText));
			//单位名称
			valText = $(this).parent().find("td").eq($(this).parents(".config-table").find(".config-thead tr th.co-name").index()).text();
			configDoc.find(".co-name").text((valText == "" ? "--" : valText));
			$(".row-config-panel .attributes-list").empty();
	    	getConfigData.setFormData($(this),$(".row-config-panel"));
    		
    		if($('#config-layout').layout('panel','east').is(":hidden")){
    			$('#config-layout').layout('expand','east');
	    	}
    		//存储行的配置信息
    		$(".row-config-panel").data("configData",$(this).data("configData"));
    		//判断行是否有配置数据
    		if($(this).data("configData") != undefined){
    			//有显示清除配置按钮
    			$(".row-config-panel").find("button.clear-config-btn").show();
    		}else{
    			//有显示清除配置按钮
    			$(".row-config-panel").find("button.clear-config-btn").hide();
    		}
    	}
    	//填充表名
    	valText = tableData.tableName;
    	configDoc.find(".table-name").text(valText);
		
		//getConfigData.createAttrList(configDoc,null,true);
    	
    });
    //调用点击行和列单元格保存配置按钮操作方法
    getConfigData.rowTdCellConfigBtnEvent();
    
    //保存表配置
    $(".attr-model .save-config").click(function(){
    	if(!$yt_valid.validForm($(".table-config-panel"))){
    		return false;
    	}
    	//var tableId = $("#table-list .table-active").data("tableData").tableId;
    	//获取表格id
    	var tableId = tableIdObj.tableId;
    	var tableConfigArr = [];
    	//获取表配置
    	$(".table-attr .attributes-list .box-row,.table-attr .attributes-list-append .box-row").each(function (i,n){
    		if($(this).find("select").val()!="0"){
    			//获取选中的预算属性code值
    			var codeVal = $(this).find("select.attributes").val();
	    		//字典编码code
	    		var valueVal = '';
	    		//字典编码名称
	    		var disValue ='';
	    		//判断字典编码的输入框是否显示状态,显示则取值,否则取下拉列表的值
	    		if($(this).find("input.word-code").length <= 0 || $(this).find("input.word-code").is(":hidden")){
	    			disValue = $(this).find("select.word-num-sel option:selected").attr("sel-val");
	    			valueVal = $(this).find("select.word-num-sel").val();
	    		}else{
	    			disValue = $(this).find(".word-code").val();
	    			valueVal = $(this).find(".hid-word-code").val();
	    		}
	    		var tableConfig = {
	    			filterType :"t",
	    			code:codeVal,
	    			value:(valueVal == "" ? disValue : valueVal),
	    			disValue:disValue
	    		}
	    		tableConfigArr.push(tableConfig);
    		}
    	});
    	/*//单独添加预算年度数据
    	tableConfigArr.push({ 
	    	filterType :"t",
	    	code:'BUDGET_YEAR',
	    	value:$('#budgetYear').val(),
	    	disValue:$('#budgetYear').val()
	    });
	    //单独添加单位编码数据
	    tableConfigArr.push({ 
	    	filterType :"t",
	    	code:'UNIT_NUM',
	    	value:$('#unitCode option:selected').val(),
	    	disValue:$('#unitCode option:selected').text()
	    });*/
    	
    	//获取行配置
    	$(".row-attr .attributes-list .box-row").each(function (i,n){
    		if($(this).find("select").val()!="0"){
    			var codeVal = $(this).find("select").val();
	    		var tableConfig = {
	    			filterType :"r",
	    			code:codeVal
	    		}
	    		tableConfigArr.push(tableConfig);
    		}
    	});
    	
    	//获取列配置
    	$(".column-attr .attributes-list .box-row").each(function (i,n){
    		if($(this).find("select").val()!="0"){
    			var codeVal = $(this).find("select").val();
	    		var tableConfig = {
	    			filterType :"c",
	    			code:codeVal
	    		}
	    		tableConfigArr.push(tableConfig);
    		}
    	});
    	//获取单元格的
    	$(".cell-attr .attributes-list .box-row").each(function (i,n){
    		if($(this).find("select").val()!="0"){
    			var codeVal = $(this).find("select").val();
	    		var tableConfig = {
	    			filterType :"cr",
	    			code:codeVal
	    		}
	    		tableConfigArr.push(tableConfig);
    		}
    	});
    	//隐藏行列的配置面板
    	$(".row-config-panel .model-content,.column-config-panel .model-content").hide().next().show();
    	$('#config-layout').layout('collapse','south');
    	$('#config-layout').layout('collapse','east');
    	$(".rule-table tr th").removeClass("select-btn");
    	$.ajax({
    		type:"post",
    		url:"budget/confg/saveTableFilterInfo",
    		async:false,
    		data:{"tableId":tableId,"tableFilterJson":JSON.stringify(tableConfigArr)},
    		success:function (data){
    			if(data.flag == "0"){
    				$yt_alert_Model.prompt("配置保存成功!");
    				var configTab = $("#table-list .table-active");
    				$(".table-config-panel .attributes-list").empty();
    				//getConfigData.getTableConfig(configTab,configTab.data("tableData"));
    				getConfigData.getTableConfig(configTab,tableIdObj);
    				//删除配置按钮选中样式
					$(".select-table tr").removeClass("tr-shadow");
					//$(".select-table td").removeClass("td-shadow cell-shadow").removeAttr("style");
    			}else{
    				$yt_alert_Model.prompt(data.message);
    			}
    		}
    	});
    });
    
    
    //关闭字典编码列表
	$("#code-list .yt-cancel-btn").click(function (){
		sysCommon.closeModel($("#code-list"));
		//删除所有选中的标识
		$(".attributes-list div,.attributes-list select").removeClass("select-code");
	});
	//字典编码列表点击事件
	$(".code-list tr").click(function (){
		$(this).addClass("yt-table-active").siblings().removeClass("yt-table-active");
	});
	//点击字典编码弹出框的确定按钮
	$("#code-list .yt-common-btn").click(function (){
		if($(".code-list .yt-table-active").length==0){
			$yt_alert_Model.prompt("请选择编码");
		}else{
			//找到当前选择的可输入下拉列表对象
			var thisSel = $("select.word-num-sel.select-code");
			//获取表格选中的字典编码code
			var selCode = $(".code-list .yt-table-active td:eq(0)").attr("sub-code");
			//调用查询字典编码数据方法
			var  codeDatas = getConfigData.getSelValData(thisSel.parent().parent());
			var numOptions = "";
	    	//判断返回的数据
	    	thisSel.empty();
			if(codeDatas.length > 0 && codeDatas !=undefined && codeDatas!=null){
				$.each(codeDatas, function(i,n) {
					if(selCode !="" && selCode == n.code){
						numOptions+='<option value="'+n.code+'" selected="selected" sel-val="'+ n.name+'">'+n.num+' '+n.name+'</option>'
					}else{
						numOptions+='<option value="'+n.code+'" sel-val="'+ n.name+'">'+n.num+' '+n.name+'</option>'
					}
				});
				thisSel.append(numOptions);
			}
	    	thisSel.niceSelect({  
	        search: true,  
	        backFunction: function(text) {  
		            //回调方法,可以执行模糊查询,也可自行添加操作  
		            thisSel.html('');  
		            if(text == "") {  
		                thisSel.append('<option value="">请选择</option>');  
		            } 
		            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
		            if(codeDatas != "" && codeDatas.length>0){
		            	$.each(codeDatas,function(i, n) {  
		            		//名称
			                if(n.name.indexOf(text) != -1) {  
			                    thisSel.append('<option value="'+n.code+'" sel-val="'+ n.name+'">'+n.num+' '+n.name+'</option>');  
			                }else if(n.num.indexOf(text) != -1){//编码
			                	thisSel.append('<option value="'+n.code+'" sel-val="'+ n.name+'">'+n.num+' '+n.name+'</option>'); 
			                }
			            });  
		            }
		        }
		    }); 
		    //添加验证
		    thisSel.attr("validform","{isNull:true,changeFlag:true,msg:'请选择编码'}");
			//关闭弹出框
			sysCommon.closeModel($("#code-list"));
		}
		//删除所有选中的标识
		$(".attributes-list div,.attributes-list select").removeClass("select-code");
	});
	//获取单位编码下拉数据
	getConfigData.getUnitOpts();
	//调用点击标题方法
	getConfigData.configTitleEvent();
});
var getConfigData = {
	configDatas:"",//全局的配置信息数据
	wordNumDatas:"",//全局的字典编码信息数据
	delIconUrl:"../../../../../resources-sasac/images/common/delc.png",//删除图标路径
	addIconUrl:"../../../../../resources-sasac/images/common/addc.png",//添加图标路径
	getTableData :function (){
		$.post("budget/table/getTableDetailListByParams",function(data){
			if(data.flag==0){
				var trDoc  = '';
				$.each(data.data,function (i,n){
					trDoc = '<tr>'+
				 	    		'<td>'+n.tableCode+'</td>'+
				 	    		'<td>'+n.budgetTypeName+'</td>'+
				 	    		'<td style="text-align: left;">'+n.tableName+'</td>'+
				 	    		'<td>'+n.lastOperatorUserName+'</td>'+
				 	    		'<td>'+n.lastOperatorDateTime+'</td>'+
				 	    	'</tr>';
					$("#table-list tbody").append(trDoc);
					//绑定列表点击事件
					$("#table-list tbody tr").last().data("tableData",n).click(function (){
						$('#config-layout').layout('collapse','south');
    					$('#config-layout').layout('collapse','east');
						//切换选择样式
						$(this).addClass("table-active").siblings().removeClass("table-active");
						$(".tab-nav:eq(1)").addClass("active-nav").siblings().removeClass("active-nav");
						//切换表格显示
						$(".table-config .no-select-table,.save-config,.canel-config").hide();
						//比对表格code显示对应的表格
						$('.table-config table[table-code="'+n.tableCode+'"]').show().addClass("select-table").siblings().removeClass("select-table").hide();
						//$(".table-config table").eq($(this).index()).show().addClass("select-table").siblings().removeClass("select-table").hide();
						//切换到表格配置区域
						$(".tab-content:eq(1)").show().siblings().hide();
						//显示操作按钮
						$(".save-config,.canel-config").show();
						$(".tab-content:eq(1) .table-name").text(n.tableName);
						$(".table-config-panel").show().next().hide();
						//清除行、列配置区域显示
						$(".row-config-panel .model-content,.column-config-panel .model-content").hide().next().show();
						
						$(".table-attr .attributes-list,.column-attr .attributes-list,.row-attr .attributes-list,.cell-attr .attributes-list").empty();
						//获取预算表样式详情
						getConfigData.getBudgetTableDetailByTableId(n.tableId,$('#createConfigTableDiv'));
						var tableDoc = $(this);
						//设置表格配置信息
						getConfigData.getTableConfig(tableDoc, n);
						//调用单元格操作事件方法
                        getConfigData.cellEventFun();
					});
				});
			}
		});
		
		
		//$('#config-layout').layout('collapse','south');
		//$('#config-layout').layout('collapse','east');
		//切换表格显示
		$(".table-config .no-select-table,.save-config,.canel-config").hide();
		//比对表格code显示对应的表格
		//$('.table-config table[table-code="'+tableIdObj.tableCode+'"]').show().addClass("select-table").siblings().removeClass("select-table").hide();
		//$(".table-config table").eq($(this).index()).show().addClass("select-table").siblings().removeClass("select-table").hide();
		//切换到表格配置区域
		$(".tab-content:eq(1)").show().siblings().hide();
		//显示操作按钮
		$(".save-config,.canel-config").show();
		$(".table-name").text(tableIdObj.tableName);
		$(".table-config-panel").show().next().hide();
		//清除行、列配置区域显示
		$(".row-config-panel .model-content,.column-config-panel .model-content").hide().next().show();
		
		$(".table-attr .attributes-list,.column-attr .attributes-list,.row-attr .attributes-list,.cell-attr .attributes-list").empty();
		//获取预算表样式详情
		getConfigData.getBudgetTableDetailByTableId(tableIdObj.tableId,$('#createConfigTableDiv'));
		//var tableDoc = $(this);
		//设置表格配置信息
		getConfigData.getTableConfig("",tableIdObj);
		//调用单元格操作事件方法
        getConfigData.cellEventFun();
	},
	/**
	 * 创建拼接预算属性
	 * @param {Object} obj
	 * @param {Object} configData
	 * @param {Object} haveVal
	 */
	createAttrList:function (obj,configData,haveVal){
		var attrLength = $(obj).find('.attributes-list').find(".box-row").length;
		var tableTest = $(obj).find(".attributes-list").attr("table-test");
		var attrDoc = '<div class="box-row">'+
	  				'<div class="box-content box-lable" style="letter-spacing: 1px;">'+
	  					(tableTest?tableTest:'预算属性：')+
	  				'</div>'+
	  				'<div class="box-content box-content-read" style="position: relative;">'+
	  					'<select name="" class="yt-select attributes">'+
	  					'</select>'+
	  				'</div>'+
	  				(haveVal?('<div class="box-content box-lable1">'+
	  					'字典编码：'+
	  				'</div>'+
	  				'<div class="box-content box-lable2"><input type="text" value="" class="yt-input word-code" style="width: 130px;"/>'+
	  				'<select  name="" class="yt-select word-num-sel" placeholder="请选择"></select>'+
	  				'<span class="valid-font" style="top:35px;"></span>'+
	  				'<input type="hidden" class="hid-word-code" value=""></input>'+
	  				'</div>'):"")
	  				+
	  				/*'<div class="box-content box-button">'+'<a onclick="getConfigData.attrEvent(this)" class="yt-link '+(attrLength==0?'add-attr':"del-attr")+'" >'+(attrLength==0?'添加属性':"删除")+'</a>'+
	  				'</div>'+*/
	  				'<div class="box-content box-button">'+'<a onclick="getConfigData.attrEvent(this)" class="yt-link add-attr" ><img src="'+getConfigData.addIconUrl+'"/></a>'+
	  				'<a onclick="getConfigData.attrEvent(this)" style="margin-left: 10px;" class="yt-link del-attr"><img src="'+getConfigData.delIconUrl+'"/></a>'+
	  				'</div>'+
	  	    	'</div>';
	  	    	attrDoc = $(attrDoc);
	  	    	//初始化下拉列表
	  	    	attrDoc.find(".yt-select.attributes").change(function (){
	  	    		var selData = $(this).find("option:selected").data("opData");
	  	    		//判断是否选择预算属性
	  	    		if($(this).val()=="0"){
	  	    			$(this).parent().next().next().find("input.word-code").removeAttr("validform");
	  	    			$(this).parent().next().next().find("select.word-num-sel").removeAttr("validform");
	  	    		}else{
	  	    			$(this).parent().next().next().find("input.word-code").attr("validform","{isNull:true,msg:'请输入编码'}");
	  	    			$(this).parent().next().next().find("select.word-num-sel").attr("validform","{isNull:true,changeFlag:true,msg:'请选择编码'}");
	  	    		}
	  	    		if(selData && selData.type.toUpperCase() == "SELECT"){
	  	    			var thisPar = attrDoc.parent().parent();
	  	    			//判断是过滤表的
	  	    			if(!thisPar.hasClass("column-attr") && !thisPar.hasClass("row-attr") && !thisPar.hasClass("cell-attr")){
	  	    				var searchImg = '<img src="../../../../../resources-sasac/images/common/search.png" class="search-img"/>';
		  	    			attrDoc.find(".box-button img.search-img").remove();
		  	    			attrDoc.find(".box-button a:eq(0)").before(searchImg);
		  	    			attrDoc.find(".box-button").css("width","105px");
	  	    			}
	  	    			//调用查询字典编码信息
	  	    			getConfigData.selectCode(attrDoc);
	  	    			//隐藏输入框
	  	    			attrDoc.find(".word-code").hide();
	  	    			//显示可输入下拉列表
	  	    			attrDoc.find(".word-num-sel").show();
	  	    			//调用初始化字典编码可输入下拉列表方法
	  	    			getConfigData.getSelValData(attrDoc);
	  	    			attrDoc.find("input.word-code").removeAttr("validform");
	  	    		}else{
	  	    			attrDoc.find(".word-code").unbind();
	  	    			//删除查询图片
	  	    			attrDoc.find(".search-img").remove();
	  	    			//显示输入框
	  	    			attrDoc.find(".word-code").show();
	  	    			//判断如果选中的不是请选择加上输入框验证
	  	    			if($(this).val()!="0"){
	  	    				attrDoc.find("input.word-code").attr("validform","{isNull:true,msg:'请输入编码'}");
	  	    			}
	  	    			//隐藏可输入下拉列表
	  	    			attrDoc.find(".word-num-sel").hide().empty().removeAttr("validform");
	  	    		}
	  	    		$(this).parent().next().next().find("input").val("");
	  	    	});
	  	    	$(obj).find('.attributes-list').append(attrDoc);
	  	    	//调用获取预算属性方法
	  	    	getConfigData.getAttrList(attrDoc.find(".yt-select.attributes"),configData?configData.property:"");
	  	    	attrDoc.find(".yt-select.attributes").niceSelect();
	  	    	//判断是否包含字典编码输入框,存在则调用查询字典编码数据方法
	  	    	//获取选中的预算属性的配置信息
	  	    	var selAttrData = attrDoc.find("select.attributes option:selected").data("opData");
	  	    	if(selAttrData && selAttrData.type !=undefined && selAttrData.type.toUpperCase() == "INPUT"){
	  	    		//显示字典编码输入框
	  	    		attrDoc.find(".word-code").show();
	  	    		attrDoc.find(".word-code").val(configData.disValue);
	  	    		attrDoc.find(".hid-word-code").val(configData.value);
	  	    		//隐藏字典编码下拉列表
	  	    		attrDoc.find(".word-num-sel").hide().empty().removeAttr("validform");
	  	    	}else{
	  	    		//调用查询字典编码信息
	  	    		getConfigData.selectCode(attrDoc);
	  	    		if(attrDoc.find("select.attributes").val() == "0"){
	  	    			attrDoc.find("select.word-num-sel").niceSelect({  
				        search: true,  
				        backFunction: function(text) {  
					            //回调方法,可以执行模糊查询,也可自行添加操作  
					            attrDoc.find("select.word-num-sel").html('');  
					            attrDoc.find("select.word-num-sel").append('<option value="">请选择</option>');  
					        }
					    }); 
					    //添加验证
					   // attrDoc.find("select.word-num-sel").attr("validform","{isNull:true,changeFlag:true,msg:'请选择编码'}");
	  	    		}else{
	  	    			//调用初始化字典编码可输入下拉列表方法
	  	    			getConfigData.getSelValData(attrDoc,configData);
	  	    		}
	  	    	}
	},
	/**
	 * 属性的操作事件,添加和删除
	 * @param {Object} obj
	 */
    attrEvent:function(obj){
    	//操作图标路径
    	var operImgUrl ="";
    	//判断是添加还是删除
    	if($(obj).hasClass("add-attr")){
    		var thisPar = $(obj).parent().parent().parent().parent();
    		var  isAttFlag = "";
    		if(!thisPar.hasClass("column-attr") && !thisPar.hasClass("row-attr") && !thisPar.hasClass("cell-attr")){
    			isAttFlag = "t";
    		}
    		//回调创建属性方法
  	    	getConfigData.createAttrList($(obj).parent().parent().parent().parent(),null,isAttFlag);
    	}else{
    		//获取当前区域下的预算属性个数
    		var  thisBoxLen = $(obj).parents(".attributes-list").find(".box-row").length;
    		if(thisBoxLen != 1){
    			//删除操作
    			$(obj).parent().parent().remove();
    		}else{
    			$yt_alert_Model.prompt("请至少保留一条预算属性",2000); 
    		}
    	}
    },
	/**
	 * 初始化字典编码可输入下拉列表数据方法
	 * @param {Object} attrDoc 区域对象
	 * @param {Object} selData 选中的数据
	 */
	initWordNumData:function(codeDatas,attrDoc,configData){
		var numOptions = '<option value="">请选择</option>';
    	//判断返回的数据
    	attrDoc.find("select.word-num-sel").empty();
		if(codeDatas.length > 0 && codeDatas !=undefined && codeDatas!=null){
			$.each(codeDatas, function(i,n) {
				if(configData && configData.value == n.code){
					numOptions+='<option value="'+n.code+'" selected="selected" sel-val="'+ n.name+'">'+n.num+' '+n.name+'</option>'
				}else{
					numOptions+='<option value="'+n.code+'" sel-val="'+ n.name+'">'+n.num+' '+n.name+'</option>'
				}
			});
			attrDoc.find("select.word-num-sel").append(numOptions);
		}
    	attrDoc.find("select.word-num-sel").niceSelect({  
        search: true,  
        backFunction: function(text) {  
	            //回调方法,可以执行模糊查询,也可自行添加操作  
	            attrDoc.find("select.word-num-sel").html('');  
	            if(text == "") {  
	                attrDoc.find("select.word-num-sel").append('<option value="">请选择</option>');  
	            } 
	            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
	            if(codeDatas != "" && codeDatas.length>0){
	            	$.each(codeDatas,function(i, n) {  
	            		//名称
		                if(n.name.indexOf(text) != -1) {  
		                    attrDoc.find("select.word-num-sel").append('<option value="'+n.code+'" sel-val="'+ n.name+'">'+n.num+' '+n.name+'</option>');  
		                }else if(n.num.indexOf(text) != -1){//编码
		                	 attrDoc.find("select.word-num-sel").append('<option value="'+n.code+'" sel-val="'+ n.name+'">'+n.num+' '+n.name+'</option>'); 
		                }
		            });
	            }
	        }
	    });
	    //独立下拉列表字段 单位编码初始化
	    
	    //添加验证
	   // attrDoc.find("select.word-num-sel").attr("validform","{isNull:true,changeFlag:true,msg:'请选择编码'}");
	},
	/**
	 * 获取字典编码
	 * @param {Object} attrDoc
	 */
	getSelValData:function(obj,configData){
		var  configdatas = "";
		var opData = $(obj).find("select.attributes option:selected").data("opData");
		var wordKey = '';
		//判断是不是可输入下拉列表获取数据
		$.ajax({
				type:"post",
				url:$yt_option.base_path+opData.url, //ajax访问路径  
				async:false,
				data:{
					pageIndex: 1,
					pageNum: 9999, //每页显示条数  
					pageSize: 10, //显示...的规律  
					params:wordKey
				},
				success:function(data){
					var datas = data.data.rows;
					if(data.flag == 0){
						if(datas.length>0){
							configdatas = datas;
							getConfigData.initWordNumData(datas,obj,configData);
						}
					}
				}
			});
		return configdatas;
	},
	/**
	 * 获取预算属性
	 * @param {Object} ele
	 * @param {Object} selectData
	 */getAttrList:function(ele,selectData){
		var filterState = false;
		var optionStr = '';
		//判断行或列的配置区域
		if(ele.parents(".row-config-panel").length>0){
			filterState = true;
			//var tableConfig = $("#table-list .table-active").data("tableConfig");
			var tableConfig = $(".table-name").data("tableConfig");
			//行的
			if(tableConfig.r){
				optionStr +=',';
				$.each(tableConfig.r, function(i,n) {
					optionStr += n.code+',';
				});
			}
		}else if(ele.parents(".column-config-panel").length>0){
			filterState = true;
			//var tableConfig = $("#table-list .table-active").data("tableConfig");
			var tableConfig = $(".table-name").data("tableConfig");
			//判断是单元格还是列
			if(ele.parents(".column-config-panel").find(".hid-flag").val() == "cr"){
				//单元格的
				if(tableConfig.cr){
					optionStr +=',';
					$.each(tableConfig.cr, function(i,n) {
						optionStr += n.code+',';
					});
				}
			}else{
				//列的
				if(tableConfig.c){
					optionStr +=',';
					$.each(tableConfig.c, function(i,n) {
						optionStr += n.code+',';
					});
				}
			}
		}
		
		$(ele).empty();
		if(selectData=="0" || selectData==undefined || selectData==""){
			$(ele).parent().next().next().find("input").removeAttr("validform");	
		}
		var selParent =  $(ele).parent().parent();
		//放大镜图片
		var searchImg = '<img src="../../../../../resources-sasac/images/common/search.png" class="search-img"/>';
		//不可更改的过滤维度数据
		var notChangeDict = [];
		//可更改的过滤维度数据
		var aowChangeDoctList = [];
		//判断存储的属性集合是否为空,为空则请求ajax
		if(getConfigData.codeList==null){
			$.ajax({
				type:"post",
				url:"budget/table/getDictList",
				async:false,
				success:function(data){
					if(data.flag == 0){
						var option = $('<option value="0">请选择</option>');
						$(ele).append(option);
						$.each(data.data, function(i,n) {
							if(filterState){
								if(optionStr.indexOf(n.code)>=0){
									//比对找到对应的预算属性
									if(selectData==n.code){
										option = $('<option value="'+n.code+'" selected="selected">'+n.name+'</option>');
										//判断类型是不是下拉列表
										if(n.type.toUpperCase() == "SELECT"){
											//添加放大镜,点击显示弹出框
											selParent.find(".box-button img.search-img").remove();
					  	    				selParent.find(".box-button a:eq(0)").before(searchImg);
					  	    				selParent.find(".box-button").css("width","105px");
										}
									}else{
										//判断是否可以更改
										if(n.isChange == 1){
											//可以更改
											option = $('<option value="'+n.code+'">'+n.name+'</option>');
											aowChangeDoctList.push(n);
										} else {
											//不可更改
											notChangeDict.push(n);
										}
									}
									option.data("opData",n);
									$(ele).append(option);	
								}
							}else{
								if(selectData==n.code){
										option = $('<option value="'+n.code+'" selected="selected">'+n.name+'</option>');
										//判断类型是不是下拉列表
										if(n.type.toUpperCase() == "SELECT" && $(ele).parents(".attributes-list").parent().hasClass("table-attr")){
											//添加放大镜,点击显示弹出框
											selParent.find(".box-button img.search-img").remove();
					  	    				selParent.find(".box-button a:eq(0)").before(searchImg);
					  	    				selParent.find(".box-button").css("width","105px");
										}
									}else{
										//判断是否可以更改
										if(n.isChange == 1) {
											//可以更改
											option = $('<option value="' + n.code + '">' + n.name + '</option>');
											aowChangeDoctList.push(n);
										} else {
											//不可更改
											notChangeDict.push(n);
										}
									}
									
									option.data("opData",n)
									$(ele).append(option);	
							}
						});
						//保存完整的下拉列表数据
						getConfigData.codeList = data.data;
						//不可更改的表维度数据
						getConfigData.notChangeDoctList = notChangeDict;
						//保存可变更的下拉数据
						getConfigData.aowChangeDoctList = aowChangeDoctList;
					}
					
				}
			});
		}else{
			var option = $('<option value="0">请选择</option>');
			$(ele).append(option);
			$.each(($(ele).parents('.table-attr').length > 0) ? getConfigData.aowChangeDoctList : getConfigData.codeList, function(i,n) {
				//判断是行和列 配置面板中的,还是表过滤配置
				if(filterState){
					if(optionStr.indexOf(n.code)>=0){
						if(selectData==n.code){
							option = $('<option value="'+n.code+'" selected="selected">'+n.name+'</option>');	
							//判断类型是不是下拉列表
							if(n.type.toUpperCase() == "SELECT"){
								//添加放大镜,点击显示弹出框
								selParent.find(".box-button img.search-img").remove();
		  	    				selParent.find(".box-button a:eq(0)").before(searchImg);
		  	    				selParent.find(".box-button").css("width","105px");
							}
						}else{
							option = $('<option value="'+n.code+'">'+n.name+'</option>');
						}
						option.data("opData",n)
						$(ele).append(option);
					}
				}else{
					if(selectData==n.code){
						option = $('<option value="'+n.code+'" selected="selected">'+n.name+'</option>');	
						//判断类型是不是下拉列表
						if(n.type.toUpperCase() == "SELECT" && $(ele).parents(".attributes-list").parent().hasClass("table-attr")){
							//添加放大镜,点击显示弹出框
							selParent.find(".box-button img.search-img").remove();
	  	    				selParent.find(".box-button a:eq(0)").before(searchImg);
	  	    				selParent.find(".box-button").css("width","105px");
						}
					}else{
						option = $('<option value="'+n.code+'">'+n.name+'</option>');
					}
					option.data("opData",n)
					$(ele).append(option);
				}
				
			});
		}
		
	},
	/**
	 * 选择字典编码
	 * @param {Object} obj
	 */
	selectCode:function (obj){
		//点击放大镜操作
		$(obj).find(".search-img").unbind('click').bind("click",function(){
			//判断是否选择预算属性
			if($(obj).find("select.attributes").val()=="0"){
				$yt_alert_Model.prompt("请选择引用字典/预算属性");
				return false;
			}
			$(obj).find(".search-img").parent().prev().find(".word-num-sel").addClass("select-code");
			//显示字典编码弹出框
			sysCommon.showModel($("#code-list"));
			$("#code-list .yt-search-btn").prev().val("");
			getConfigData.getCodeList(obj);
		});
		//字典编码列表输入框键盘
		$("#code-list .yt-search-btn").prev().unbind().bind("keydown",function (e){
			if(e.keyCode == 13){
				//获取当前选到的区域
				var thiObj = $("select.word-num-sel.select-code").parent().parent();
				getConfigData.getCodeList(thiObj);
			}
		});
		//字典编码列表查询按钮事件
		$("#code-list .yt-search-btn").unbind().bind("click",function (){
			//获取当前选到的区域
			var thiObj = $("select.word-num-sel.select-code").parent().parent();
			getConfigData.getCodeList(thiObj);
		});
		
	},
	
	/**
	 * 获取字典编码列表数据
	 * @param {Object} obj 当前标签
	 */getCodeList:function (obj,isSel){
		var opData = $(obj).find("select.attributes option:selected").data("opData");
		var wordKey = $("#code-list .yt-search-btn").prev().val();
		$('.page1').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url:$yt_option.base_path+opData.url, //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				params:wordKey,
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				var datas = data.data.rows;
				var htmlTbody = $('.code-list .yt-tbody');
				htmlTbody.empty();
				var trStr  = "";
				if(data.flag == 0){
					if(datas.length==0){
						$('.page1').hide();
						//拼接暂无数据效果
						htmlTbody.append(getConfigData.noDataTrStr(2));	
					}else{
						//赋值全局的字典编码数据
						getConfigData.wordNumDatas = datas;
						$.each(datas,function (i,n){
							htmlTbody.append('<tr> <td sub-code='+ n.code +'>'+n.num+'</td> <td>'+n.name+'</td> </tr>');
						});
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
		var noDataStr = '<tr style="border:0px;background-color:#fff !important;"><td  colspan="'+trNum+'" align="center"style="border:0px;"><div class="no-data" style="width: 280px;margin: 0 auto;">' +
			'<img src="../../../../../resources-sasac/images/common/no-data.png" alt="">' +
			'</div></td></tr>';
	    return noDataStr;
	},
	/**
	 * 获取配置列
	 * @param {Object} configBtn 配置按钮
	 * @param {Object} type 类型
	 */getcolumConfig:function(configBtn,type){
		var formData = {};
			formData.type = type;
			var panleDoc ;
			var val = "";
			//tableId
			//val =$("#table-list .table-active").data("tableData").tableId;
			val = tableIdObj.tableId;
			formData.tableId = val;
			//name
			val = "";
			formData.name = val;
			var tableCongfigId="";
			//单元格
			formData.crNum = "";
			//序号
			if(type == "r"){
				panleDoc = $(".row-config-panel");
				val = $(".row-config-panel").find(".row-num").text();
				tableCongfigId = $(".row-config-panel").find(".hid-config-id").val();
				formData.crNum = "r"+val;
			}else{
				panleDoc = $(".column-config-panel");
				val = $(".column-config-panel").find(".column-num").text();
				tableCongfigId = $(".column-config-panel").find(".hid-config-id").val();
				//判断是否是单元格数据,单元格编号列号加行号
				if(type == "cr"){
					formData.crNum = "c"+val+"-"+"r"+$(".column-config-panel").find(".row-num").text();
				}else{
					formData.crNum = "c"+val;
				}
			}
			formData.orderNum = val;
			//获取配置ID
			formData.tableCongfigId = tableCongfigId;
			//是否为计算项
			//val = (panleDoc.find(".is-calculation:checked").length==0)?2:1;
			//获取属性类型1计算项2文本3数字
			val = $(".property-model .yt-radio.check input").val();
			formData.calcItem = val;
			//是否是编辑项
			//formData.editorItem = val;
			//计算公式
			val = panleDoc.find(".formual input").val();
			formData.calcValue = val;
			formData.propertyList=[];
			formData.propertyListJson = "";
			var  propertyListJson = "";
			var  promptState = false;
			//字典编码code
			var value="";
			//字典编码中文
			var disValue = "";
			//获取运算属性
			var formVal = {};
			panleDoc.find(".attributes-list .box-row").each(function (i,n){
				if($(n).find("select.attributes").val()!="0"){
					//判断字典编码输入框是否显示
					if($(n).find("input.word-code").is(":hidden")){
						if($(n).find("select.word-num-sel").val() !="" && $(n).find("select.word-num-sel").val() !=null){
							disValue = $(n).find("select.word-num-sel option:selected").attr("sel-val");
							value = $(n).find("select.word-num-sel").val();
						}
					}else{
						disValue = $(n).find("input.word-code").val();
						value = $(n).find(".hid-word-code").val();
					}
					formVal = {
						property:$(n).find("select.attributes").val(),
						value:(value == "" ? disValue : value),
						disValue:disValue
					}
					formData.propertyList.push(formVal);
				}
			});
			if(formData.propertyList.length>0 && formData.propertyList!=null){
				formData.propertyListJson = JSON.stringify(formData.propertyList);
			}
			//关联列数据
			formData.relationCell = $('.relation-cell').val();
			//列配置-优先列的属性1选中2未选中
			var editorItem = "";
			if(panleDoc.find('.yt-checkbox.first-td-box input').is(':checked')){
				editorItem = 1;
			}else{
				editorItem = 2;
			}
			formData.editorItem = editorItem;
			/**
			 * 验证
			 */
			if($yt_valid.validForm(panleDoc)){
				//存储全局的配置数据
				getConfigData.configDatas = formData;
				configBtn.data("configData",formData).addClass("rtest");
				return true;
			}else{
				getConfigData.configDatas = false;
				return false;
			}
	},
	/**
	 * 给表单赋值数据
	 * @param {Object} obj
	 * @param {Object} parent
	 */
	setFormData:function (obj,parent){
		//回写表单数据
		var configData = "";
		var configData = $(obj).data("configData");
		if(configData){
			//是否为单表和表间
			if(configData.calcItem ==1 || configData.calcItem == 4){
				//显示属性条件区域
				$(".property-val-model").show();
				/*$(parent).find(".is-calculation").parent().addClass("check");
				$(parent).find(".is-calculation").attr("checked", true);*/
				$(parent).find(".formual").css("display","table-cell");
				//判断如果是表间
				if(configData.calcItem == 4){
					//设置输入框禁用
					$(parent).find(".formual input").css("cursor","pointer").attr("readonly","readonly");
					$(parent).find(".formual input").click(function(){
						//调用点击输入框显示表间计算弹出框方法
						tableRelaCalcuObj.calcuTableInit($(parent).find(".formual input"));
					});
				}
				$(parent).find(".formual input").val(configData.calcValue).attr("validform","{isNull:true,blurFlag:true,msg:'请输入计算公式'}");;
			}else{
				//隐藏属性条件区域
				$(".property-val-model").hide();
			}
			//备注列
			$('.relation-cell').val(configData.relationCell);
			//列的配置-优先列的配置值1.选中2未选中
			if($(parent).find(".first-td-box input") !=undefined && $(parent).find(".first-td-box input").length>0){
				if(configData.editorItem == "1"){
					$(parent).find(".first-td-box input").setCheckBoxState("check");
				    $(".dis-div").show();
				}else{
					$(parent).find(".first-td-box input").setCheckBoxState("uncheck");
					$(".dis-div").hide();
				}
				
			}
			//设置选中对应的属性类型1单表2文本3数字4表间
			if($(parent).find('.property-model .yt-radio input[value="'+configData.calcItem+'"]').length>0){
				$(parent).find('.property-model .yt-radio input[value="'+configData.calcItem+'"]').setRadioState("check");
			}
			//属性列表
			if(configData.propertyList.length>0){
				$.each(configData.propertyList, function(i,n) {
					getConfigData.createAttrList($(parent),n,true);
				});
			}else{
				getConfigData.createAttrList($(parent),null,true);
			}
			//配置id
			$(parent).find(".hid-config-id").val(configData.id);
		}else{
			getConfigData.createAttrList($(parent),null,true);
			//配置id
			$(parent).find(".hid-config-id").val('');
		}
	},
	/**
	 * 获取表格配置数据
	 * @param {Object} tableDoc
	 * @param {Object} configData
	 */
	getTableConfig:function (tableDoc,configData){
		$.ajax({
			type:"post",
			url:"budget/confg/getTableFilterMapByParams",
			async:false,
			data:{"tableId":configData.tableId},
			success:function (data){
				if(data.flag == 0){
					/*if(tableDoc){
						tableDoc.data("tableConfig",data.data);
					}*/
					//存储配置信息
					$(".table-name").data("tableConfig",data.data);
					//不可编辑的数据列表
					var notChangeDistList = [];
					//过滤表的表格
					if(data.data.t){
						$.each(data.data.t, function(i,n) {
							n.property = n.code;
							if(n.isChange == 1){
								//可编辑
								getConfigData.createAttrList($(".table-attr"), n, true);
							} else {
								//不可编辑
								notChangeDistList.push(n);
							}
						});
						//添加完成后判断页面数据为空时，添加一条空数据
						if($('.table-attr .attributes-list .box-row').length <= 0){
							//最后一条为空的数据
							getConfigData.createAttrList($(".table-attr"),null,true);
						}
						//添加不可编辑的数据维度
						//getConfigData.setNotChangeDict(notChangeDistList);
						getConfigData.notChangeDistList = notChangeDistList;
					}else{
						getConfigData.createAttrList($(".table-attr"),null,true);
					}
					//过滤表的行
					if(data.data.r){
						$.each(data.data.r, function(i,n) {
							n.property = n.code;
							getConfigData.createAttrList($(".row-attr"),n);
						});	
						$(".row-con-num").text(data.data.r.length);
					}else{
						getConfigData.createAttrList($(".row-attr"),null);
					}
					//过滤表的列
					if(data.data.c){
						$.each(data.data.c, function(i,n) {
							n.property = n.code;
							getConfigData.createAttrList($(".column-attr"),n);
						});	
						$(".col-con-num").text(data.data.c.length);
					}else{
						getConfigData.createAttrList($(".column-attr"),null);
					}
					
					//过滤表的单元格数据
					if(data.data.cr){
						$.each(data.data.cr, function(i,n) {
							n.property = n.code;
							getConfigData.createAttrList($(".cell-attr"),n);
						});
						$(".cell-con-num").text(data.data.cr.length);
					}else{
						getConfigData.createAttrList($(".cell-attr"),null)
					}
				}
			}
		});
		//调用获取配置数据
		getConfigData.getConfigDataList(configData);
		//存在不可更改数据时
		if(getConfigData.aowChangeDoctList.length > 0) {
			//将数据添加至页面
			getConfigData.setNotChangeDict();
		}
	},
	/**
	 * 获取配置信息
	 * @param {Object} configData 当前预算表信息
	 */
	getConfigDataList:function(configData){
		$.ajax({
			type:"post",
			url:"budget/confg/getTableAllCongfigByTableId",
			data:{
				tableId:configData.tableId
			},
			async:false,
			success:function (data){
				if(data.flag == 0) {
					//清除所有的行、列、单元格的配置样式和存储的data数据
					$("#createConfigTableDiv .rule-table tbody tr .indicate").removeClass("config-th-sty").removeData("configData");
					$("#createConfigTableDiv .rule-table .indicate-head .indicate").removeClass("config-th-sty").removeData("configData");
					$("#createConfigTableDiv .rule-table tbody td .tick-img").remove();
					$("#createConfigTableDiv .rule-table tbody td").removeData("crConfigData");
                  if(data.data.length > 0){
                    $.each(data.data, function(i,n) {
                		if(n.type == "r"){
                			$("#createConfigTableDiv .rule-table tbody tr .indicate").eq(n.orderNum - 1).data("configData",n);
                			//给配置成功的添加样式
                			$("#createConfigTableDiv .rule-table tbody .indicate").each(function(){
                		 		if($(this).text() == n.crNum.toUpperCase()){
                		 			$(this).addClass("config-th-sty");
                		 		}
                		 	});
                		}else if(n.type == "cr"){//判断是不是单元格
                			//获取单元格
                			var crNum = n.crNum.split("-");
                			var configIndex = $("#createConfigTableDiv .rule-table .indicate-head .no-th-sty").length;
                			//比对行
                			var tdNum = "";
                			$("#createConfigTableDiv .rule-table tbody tr .indicate").each(function(i, r) {
                				//找到对应的行
                				if(crNum[1].toUpperCase() == $(this).text()) {
                					//找到对应的列
                					tdNum = crNum[0].charAt(1, 1);
                					var tickImg = '<img src="../../../../../resources-sasac/images/common/config.png" alt="" class="tick-img">';
                					var tdObj = $(r).parent().find('td').eq(tdNum - 1).data("crConfigData", n).html(tickImg);
                				}
                			});
                			
                		}else{
                		 	$(".rule-table .indicate-head .indicate").eq(n.orderNum - 1).data("configData", n);
                		 	//给配置成功的添加样式
                		 	$("#createConfigTableDiv .rule-table .indicate-head .indicate").each(function(){
                		 		if($(this).text() == n.crNum.toUpperCase()){
                		 			$(this).addClass("config-th-sty");
                		 		}
                		 	});
                		}
                    });
                  }
				}else{
					$yt_alert_Model.prompt(data.message,2000);
				}
			}
		});
	},
	/**
	 * 
	 * 
	 * 单元格操作方法
	 * 
	 * 
	 */
	cellEventFun:function(){
		//点击表格中不是标识行和配置按钮的td
	    $(".rule-table tbody tr:not(.flag-tr) td:not(.config-btn,.config-th-sty,.no-cell,.dis)").click(function(){
	    	//删除所有列配置按钮选中的样式,和之前加的最后一行对应列的下边框
    		//$(".rule-table tr:last-child td").removeClass("td-shadow cell-shadow").removeAttr("style");
	    	//去除行或列的选中编号的选中标识
	    	$(".rule-table tr th").removeClass("select-btn");
	    	//调用冒泡方法
	    	$yt_common.eventStopPageaction();
	    	//删除表格种选中的行样式和列样式
	    	$(".rule-table tbody tr").removeClass("tr-shadow");
	    	$(".rule-table tbody tr td").removeClass("td-shadow cell-shadow");
	    	//$(".rule-table tbody td").removeClass("td-shadow cell-shadow").removeAttr("style");
	    	//给当前单元格添加选中样式
	    	$(this).addClass("cell-shadow");
	    	//折叠行配置面板和列配置面板
	    	$(".column-config-panel .model-content").hide().next().show();
			$('#config-layout').layout('collapse','south');
    		$(".row-config-panel .model-content").hide().next().show();
			$('#config-layout').layout('collapse','east');
			//获取选中单元格的列配置数据
   			//td的配置信息			
			var cellTdConfig = $('.rule-table .indicate-head th:eq('+$(this).index()+')').data("configData");
			//tr的配置信息
			var cellRowCofnig = $(this).parent().find(".indicate").data("configData");
			//将当前是多少列多少行赋值给单元格
			var cellTdText = $('.rule-table .indicate-head th:eq('+$(this).index()+')').text();
			var cellRowText = $(this).parent().find(".indicate").text();
			//获取Td的名称
			var configIndex =  $('.rule-table .indicate-head .indicate:eq(0)').index();
			var cellTdName = $(".rule-table").find(".column-name"+($(this).index()-configIndex+1)).text();
			//当前单元格
			var thisCell = $(this);
			
			//修改底部配置面板标题名称
			$('#config-layout').layout('panel', 'south').panel({ title: '单元格的配置' });
			if($('#config-layout').layout('panel','south').is(":hidden")){
	    		$('#config-layout').layout('expand','south');
	    	}
			var configDoc = $(".column-config-panel");
			//调用拼接底部配置区域结构方法
			getConfigData.addBotConfigHtml("cell");
			//显示区域
			configDoc.find(".model-content,.config-btngroup").show();
			//隐藏提示信息
    		$(".column-config-panel .no-select-table").hide();
    		//清除计算按钮
			//configDoc.find(".is-calculation").parent().removeClass("check");
			//configDoc.find(".is-calculation").attr("checked", false);
			//清除计算公式验证
			configDoc.find(".formual").hide().find("input").removeClass("valid-hint").val('').removeAttr("validform").next().html('');
			//清除属性选中的默认选数字
			if(configDoc.find(".property-model .yt-radio:eq(0) input").length>0){
				configDoc.find(".property-model .yt-radio:eq(0) input").setRadioState("check"); 
			}
			configDoc.find(".property-val-model").hide();
			
			
    		//清空属性
    		$(".column-config-panel .attributes-list").empty();
	    	//获取选中的表数据
			//var tableData = $("#table-list tbody .table-active").data("tableData");
			var tableData = tableIdObj;
			//获取表名行号列号
	    	configDoc.find(".table-name").text(tableData.tableName);
	    	//获取配置按钮的索引
			var configIndex = $(".select-table .config-thead .config-btn:eq(0)").index();
			var valText = thisCell.index();
			//获取单元格配置数据
			var configData = thisCell.data("crConfigData");
			//存储单元格的配置数据
			$(".column-config-panel").data("crConfigData",configData);
			//判断单元格是否有配置数据
    		if(configData != undefined){
    			//有显示清除配置按钮
    			$(".column-config-panel").find("button.clear-config-btn").show();
    		}else{
    			//有显示清除配置按钮
    			$(".column-config-panel").find("button.clear-config-btn").hide();
    		}
			//判断是否是否是第26张表,进行特殊处理
           /* if(tableData.tableCode == "T26"){
				configDoc.find(".column-num").text(thisCell.index()+1);
			}else{
			}*/
			configDoc.find(".column-num").text(valText);
	    	configDoc.find(".row-num").text(thisCell.parent().index() + 1);
	    	//回写表单数据
			if(configData){
				//是否为单表和表间
				if(configData.calcItem ==1 || configData.calcItem == 4){
					//显示属性条件区域
					$(".property-val-model").show();
					/*configDoc.find(".is-calculation").parent().addClass("check");
					configDoc.find(".is-calculation").attr("checked", true);*/
					//判断如果是表间
					if(configData.calcItem == 4){
						//设置输入框禁用
						$(configDoc).find(".formual input").css("cursor","pointer").attr("readonly","readonly");
						$(configDoc).find(".formual input").click(function(){
							//调用点击输入框显示表间计算弹出框方法
							//如果是单元格配置点击表间计算传入当前表格信息表编号列行
							var configSelCell = cellTdText.toLocaleLowerCase()+cellRowText.toLocaleLowerCase();
							tableRelaCalcuObj.calcuTableInit($(configDoc).find(".formual input"),configSelCell);
						});
					}
					configDoc.find(".formual").css("display","table-cell");
					configDoc.find(".formual input").val(configData.calcValue).attr("validform","{isNull:true,blurFlag:true,msg:'请输入计算公式'}");
				}else{
					//隐藏属性条件区域
					$(".property-val-model").hide();
				}
				//设置选中对应的属性类型1单表2文本3数字4表间
				configDoc.find('.property-model .yt-radio').removeClass("check");
				configDoc.find('.property-model .yt-radio input[value="'+configData.calcItem+'"]').parent().addClass("check");
				configDoc.find('.property-model .yt-radio input[value="'+configData.calcItem+'"]').prop("checked", true);
				//属性列表
				if(configData.propertyList.length>0){
					$.each(configData.propertyList, function(i,n) {
						getConfigData.createAttrList(configDoc,n,true);
					});
				}else{
					getConfigData.createAttrList(configDoc,null,true);
				}
				//配置id
				configDoc.find(".hid-config-id").val(configData.id);
			}else{
				//配置id
				configDoc.find(".hid-config-id").val('');
				getConfigData.createAttrList(configDoc,null,true);
			}
		    /*$("body .tip-valid-sty").remove();
		    $("body #cell-config-model").remove()
			$("body").append('<div id="cell-config-model"></div>');
			var  trStr = '<div class="cell-model">'
					   + '<div class="area-box font-bold cell-title">配置单元格</div>'
					   + '<div class="area-box"><lable>行号<span style="margin:0px 5px;">——</span>列号：</label>'
					   + '<span>'+cellRowText+'行</span>-<span>'+cellTdText+cellTdName+'列</span>'
					   + '</div>'
					   + '<div class="area-box"><label>列的计算公式：</label>'
					   + '<span>'+(cellTdConfig == undefined ? "--" : cellTdConfig.calcValue)+'</span>'
					   + '</div>'
					   + '<div class="area-box"><label>行的计算公式：</label>'
					   + '<span>'+(cellRowCofnig == undefined ? "--" : cellRowCofnig.calcValue)+'</span>'
					   + '</div>'
					   + '<div class="cell-tip-btn"><button class="yt-option-btn yt-common-btn sure-btn" style="margin-right:10px">确定</button>'
					   + '<button class="yt-option-btn yt-cancel-btn canel-btn">取消</button>'
					   + '</div>'
			           + '</div>';
			
		    $("#cell-config-model").append(trStr);
			//调用滚动条方法
			$(".cell-model").mCustomScrollbar();
		    //调用提示框方法
	  		thisCell.poshytip({
				className: 'tip-valid-sty',
				content:$("#cell-config-model"),
				showOn: 'none',
				alignTo: 'target',
				alignX: 'center',
				alignY:'top'
			});
			//显示弹出框
			thisCell.poshytip('show');
			$(".tip-valid-sty").mouseleave(function(){
		  		//thisCell.poshytip('hide');
		  		//$(".select-table tbody td").removeClass("td-shadow cell-shadow").removeAttr("style");
		  	});
		  	//确定按钮点击事件
		  	$(".cell-tip-btn .sure-btn").click(function(){
		  		thisCell.poshytip('hide');
		  		$(".select-table tbody td").removeClass("td-shadow cell-shadow").removeAttr("style");
		  		//操作成功给当前单元格添加对勾图标做标识
		  	    var tickImg = '<img src="../../../../../resources-sasac/images/common/tick.png" alt="" class="tick-img">';
		  	    thisCell.html(tickImg);
		  	});
		  	//取消按钮点击事件
		  	$(".cell-tip-btn .canel-btn").click(function(){
		  		thisCell.poshytip('hide');
		  		$(".select-table tbody td").removeClass("td-shadow cell-shadow").removeAttr("style");
		  	});*/
	    });
	},
	/**
	 * 拼接底部配置面板内容
	 * @param {Object} flag
	 */
	addBotConfigHtml:function(flag){
		//先清空
		$(".column-config-panel .no-select-table").nextAll().remove();
		var htmlStr = '<div class="model-content dn">'
		            + '<input type="hidden" class="hid-config-id" value=""/>';
		            /**
		             * 判断要拼接的是列的配置还是单元格的
		             */
		            if(flag == "c"){
		            	htmlStr+='<div class="box-row">'
		            	        //+'<div class="box-content box-lable" style="width: 150px;"><span class="letter6">显示名</span>称：</div>'
		            	        //+'<div class="box-content column-name"></div>'
		            	        +'<div class="box-content box-lable1" style=""><span style="letter-spacing: 10px;">所属</span>表：</div>'
		            	        +'<div class="box-content table-name"></div>'
		            	        +'<div class="box-content box-lable" style="width: 150px !important;">行或列：</div>'
		            	        +'<div class="box-content box-content-read" style="width: 150px !important;">列</div>'
		            	        +'<div class="box-content box-lable1">列号：</div>'
		            	        +'<div class="box-content column-num"></div>'
		            	        +'</div>';
		            }else{
		            	htmlStr+='<div class="box-row">'
		            	        +'<div class="box-content box-lable1" style="width: 90px;"><span style="letter-spacing: 10px;">所属</span>表：</div>'
		            	        +'<div class="box-content table-name"></div>'
		            	        +'<div class="box-content box-lable1" style="width:90px;">列号：</div>'
		            	        +'<div class="box-content column-num"></div>'
		            	        +'<div class="box-content box-lable1" style="width:90px;">行号：</div>'
		            	        +'<div class="box-content row-num"></div>'
		            	        +'</div>';
		            }
		            htmlStr +='<div class="box-row">'
		                    +'<div class="box-content box-lable" style="float: left;display: inline;"><span style="letter-spacing: 35px;">格</span>式：</div>'
		            		+'<div class="property-model">'
		            		+'<label class="check-label yt-radio check">'
		            		+'<input id="radio1" type="radio" name="property"  value="3"/>数字 '
		            		+'</label>'
		            		+'<label class="check-label yt-radio"><input id="radio1" type="radio" name="property"  value="2"/>文本</label>'
		            		+'<label class="check-label yt-radio"><input id="radio1" type="radio" name="property"  value="1"/>单表</label>'
		            		+'<label class="check-label yt-radio"><input id="radio1" type="radio" name="property"  value="4"/>表间</label>'
		            		+'</div>'
					        +'</div>';
					        //添加一个列字段,优先列的属性
					        htmlStr +='<div style="padding:10px 0px;"><label><span style="letter-spacing: 10px;">优先</span>级：</label>'
					                +'<label class="check-label yt-checkbox first-td-box"><input id="" type="checkbox" name="test" value="2"/>列优先行</label>' 
					                +'</div>';
					        //添加备注列
					        if (flag == "c") {
					        	htmlStr += '<div class="box-row relevance-item"><label><span style="letter-spacing: 10px;">备注</span>列：</label><input class="yt-input relation-cell" /></div><span style="color:#417095;padding-left: 86px;">如填写c2（文本列），则表示c2列内容为本列内容的备注信息</span>';
					        }
					        htmlStr += '<div class="box-row property-val-model" style="display: none;">'
		            		+'<div class="box-content box-lable1 formual dn">'
		            		+'<span class="not-null">*</span><span class="letter6">计算公</span>式：</div>'
		            		+'<div class="box-content formual dn"><input class="yt-input formula-inpu" type="text" value="" />'
		            		+'<span class="valid-font" style="top: 32px;"></span>'
		            		+'</div></div>'
		            		+'<div style="clear: both;"></div>'
					        +'<div class="attributes-list"></div>'
					        +'</div>';
									htmlStr+='<div class="config-btngroup" style="padding-bottom: 0px;" btn-flag="'+(flag == "c"?"c":"cr")+'">'
					        +'<button class="yt-option-btn yt-common-btn clear-config-btn" style="margin-right: 15px;display:none">删除配置项</button>'
					        +'<button class="yt-option-btn yt-common-btn tb-save-btn">保存<input type="hidden" class="hid-flag" value="'+(flag == "c"?"c":"cr")+'"/></button>'
					        +'<button class="yt-option-btn yt-cancel-btn r-cancel-btn">取消</button>'
					        +'</div>';
			$(".column-config-panel").append(htmlStr);	
			//调用点击行和列单元格保存配置按钮操作方法
   			getConfigData.rowTdCellConfigBtnEvent();
	},
	/**
	 * 
	 * 行和列的配置按钮方法
	 * 
	 */
	rowTdCellConfigBtnEvent:function(){
		/**
	    * 点击行和列的保存按钮
	    */
	     $(".config-btngroup .tb-save-btn").attr('disabled', false).off('click').on('click', function(){
	     	var  configFlag = $(this).find(".hid-flag").val();
	     	if(configFlag == "c"){
	     		getConfigData.getcolumConfig($(".config-table.select-table .config-thead .config-btn.select-btn"),"c");
	     	}else if(configFlag == "cr"){
	     		getConfigData.getcolumConfig($(".config-table.select-table .config-thead .config-btn.select-btn"),"cr");
	     	}else{
	     		getConfigData.getcolumConfig($(".config-table.select-table tbody tr .config-btn.select-btn"),"r");
	     	}
			//var tableId = $("#table-list .table-active").data("tableData").tableId;
			//获取表格id
			var tableId = tableIdObj.tableId;
			var  datas = "";
			//判断得到的值是否验证通过,或是有数据
			if(getConfigData.configDatas){
				datas = getConfigData.configDatas;
				//保存配置信息
				$.ajax({
					type:"post",
					url:"budget/confg/saveTableCongfigDetail",
					async:false,
					data:getConfigData.configDatas,
					success:function (data){
						if(data.flag == 0){
							$(".rule-table td").css("border-bottom","1px solid #DFE6F3");
							if(configFlag == "c" || configFlag == "cr"){
								//收起列配置面板
					    		$(".column-config-panel .model-content").hide().next().show();
					    	    $('#config-layout').layout('collapse','south');
					    	    //清空计算公式输入框
					    	    $(".column-config-panel .formula-inpu").val('');
							}else{
								//收起行配置面板
					    		$(".row-config-panel .model-content").hide().next().show();
					    		$('#config-layout').layout('collapse','east');
					    		 //清空计算公式输入框
					    	    $(".row-config-panel .formula-inpu").val('');
							}
							//删除配置按钮选中样式
							$(".select-table tr").removeClass("tr-shadow");
							//$(".select-table td").removeClass("td-shadow cell-shadow").removeAttr("style");
							$yt_alert_Model.prompt("配置成功");
							//刷新列表配置信息
							var configTab = $("#table-list .table-active");
							//调用获取刷新配置信息方法
							getConfigData.getConfigDataList(tableIdObj);
							//执行保存后禁用当前按钮并移除点击事件
							$(".config-btngroup .tb-save-btn").attr('disabled',true).unbind('click');
							//两秒后执行恢复
							setTimeout(function(){
								//调用点击行和列单元格保存配置按钮操作方法
								getConfigData.rowTdCellConfigBtnEvent();
							},2000);
							//清除行或列的选中的编号
							$(".rule-table tr th").removeClass("select-btn");
						}
					},error:function (data){
						$yt_alert_Model.prompt("网络异常请稍后重试");
					}
				});
			}
	     });
	    /**
	     * 
	     * 点击行、列、单元格配置板块清除配置项按钮操作方法
	     * 
	     */
	    $(".config-btngroup .clear-config-btn").on("click",function(){
	    	var thisBtn = $(this);
	    	//获取按钮标识
	    	var btnFlag = thisBtn.parent().attr("btn-flag");
	    	//获取配置ID
	    	var configId = "";
	    	if(btnFlag == "c" || btnFlag == "cr"){
	    		configId = $(".column-config-panel").data("crConfigData").id;
	    	}
	    	if(btnFlag == "r"){
	    		configId = $(".row-config-panel").data("configData").id;
	    	}
	    	$yt_alert_Model.alertOne({  
		        alertMsg: "确定要删除配置项吗？删除后将无法恢复", //提示信息  
		        leftBtnName:"确定",
		        confirmFunction: function() { //点击确定按钮执行方法  
		           //调用清除接口方法
					$.ajax({
						type: 'post',
						url: 'budget/confg/deleteBudgetTableConfigByTableConfigId',
						async: false,
						data:{
							tableId:configCommonObj.tableId,//表Id
							tableConfigId:configId//配置项Id
						},
						success: function(data) {
							$yt_alert_Model.prompt(data.message);
							if(data.flag == 0) {
								//判断是什么按钮	
								$(".rule-table td").css("border-bottom","1px solid #DFE6F3");
								if(btnFlag == "c" || btnFlag == "cr"){
									//收起列配置面板
						    		$(".column-config-panel .model-content").hide().next().show();
						    	    $('#config-layout').layout('collapse','south');
						    	    //清空计算公式输入框
						    	    $(".column-config-panel .formula-inpu").val('');
						    	    //清空隐藏的配置id
						    	    $(".column-config-panel .hid-config-id").val('');
						    	    //删除选中样式
						    	    $(".rule-table td").removeClass("cell-shadow td-shadow");
								}else{
									//收起行配置面板
						    		$(".row-config-panel .model-content").hide().next().show();
						    		$('#config-layout').layout('collapse','east');
						    		 //清空计算公式输入框
						    	    $(".row-config-panel .formula-inpu").val('');
						    	     //清空隐藏的配置id
						    	    $(".row-config-panel .hid-config-id").val('');
						    	    //删除选中样式
						    	    $(".rule-table tr").removeClass("tr-shadow");
								}
								//调用获取刷新配置信息方法
								getConfigData.getConfigDataList(tableIdObj);
								//两秒后执行恢复
								setTimeout(function(){
									//调用点击行和列单元格保存配置按钮操作方法
									getConfigData.rowTdCellConfigBtnEvent();
								},2000);
								//清除行或列的选中的编号
								$(".rule-table tr th").removeClass("select-btn");
							}else{
								$yt_alert_Model.prompt(data.message);
							}
						},error:function(e){
						  
						}
					});
		        },  
		    });  
	    });
	     /**
	      * 点击行或列的取消按钮
	      */
	    $(".config-btngroup .r-cancel-btn").off('click').on('click', function(){
	    	//获取标识
	    	var typeFlag = $(this).prev().find(".hid-flag").val();
	    	var panelFlag = "";
	    	//c是列,r是行,cell单元格
	    	if(typeFlag == "c" || typeFlag == "cr"){
	    		panelFlag = $(".column-config-panel");
	    		//删除拼接的区域
	    		panelFlag.find(".model-content,.config-btngroup").remove();
	    		panelFlag.find(".no-select-table").show();
	    		//收起列配置面板
	    	    $('#config-layout').layout('collapse','south');
	    	    //删除列配置的选中样式
	    	    //$(".select-table td").removeClass("td-shadow cell-shadow").removeAttr("style");
	    	}else{
	    		panelFlag = $(".row-config-panel");
	    		//收起行配置面板
	    		$('#config-layout').layout('collapse','east');
	    		panelFlag.find(".model-content").hide().next().show();
	    	    //删除行配置的选中样式
	    	    $(".select-table tr").removeClass("tr-shadow");
	    	}
	    	//隐藏操作按钮
	    	panelFlag.find(".config-btngroup").hide();
	    	//清空输入框数据
    	    panelFlag.find(".model-content input:not(.yt-radio input)").val('');
    	    panelFlag.find(".model-content select").niceSelect();
    	    
    	    //初始化单选按钮
    	    if(panelFlag.find(".yt-radio input:eq(0)").length>0){
    	    	panelFlag.find(".yt-radio input:eq(0)").setRadioState("check");
    	    }
    	    //清除行或列的选中的编号
			$(".rule-table tr th").removeClass("select-btn");
	    });
		//是否为计算项
		/*$(".is-calculation").change(function (){
			if($(this).attr("checked")=="checked"){
				$(this).parent().parent().next().css("display","table-cell").next().css("display","table-cell");
				$(this).parent().parent().next().next().find("input").attr("validform","{isNull:true,blurFlag:true,msg:'请输入计算公式'}");
				//删除字典编码的验证
				$(this).parent().parent().next().next().find("select.word-num-sel").removeAttr("validform");
				//删除字典编码的验证
				$(this).parent().parent().parent().next().find("select.word-num-sel").removeAttr("validform");
			}else{
				$(this).parent().parent().next().css("display","none").next().css("display","none");
				$(this).parent().parent().next().next().find("input").removeAttr("validform");
				//给字典编码下拉列表加上验证
				$(this).parent().parent().parent().next().find("select.word-num-sel").attr("validform","{isNull:true,changeFlag:true,msg:'请选择编码'}");
			}
		});*/
		
		/**
		 * 
		 * 属性类型选择事件
		 * 
		 */
		$(".property-model .yt-radio input").off('change').on('change', function(){
			var  thisVal = $(this).val();
			//计算公式输入框
			var  thisInput = $(this).parents(".model-content").find(".formual").find("input");
			//判断选中的属性类型,1,单表4表间3.数字2.文本
			if(thisVal == 1 || thisVal == 4){
				//获取当前选择行或列或单元格的配置信息
				var thisObj ="";
				thisObj = $("#createConfigTableDiv table.rule-table th.select-btn").data("configData");
				if(thisObj == undefined || thisObj == null){
					thisObj = $("#createConfigTableDiv table.rule-table td.cell-shadow").data("crConfigData");
				}
				//比对找到对应属性值,比对成功赋值,否则空
				if(thisObj && thisObj.calcItem == thisVal){
					$(thisInput).val(thisObj.calcValue);
				}else{
					$(thisInput).val("");
				}
				//显示属性值区域
				$(".property-val-model").show();
				//显示输入计算项信息
				$(this).parents(".model-content").find(".formual").css("display","table-cell");
				//$(this).parent().parent().next().css("display","table-cell").next().css("display","table-cell");
				//判断是否是表间
				if(thisVal == 4){
					//设置计算公式输入禁用可点击
					$(thisInput).css("cursor","pointer").attr("readonly","readonly");
					$(thisInput).off().on("click",function(){
						//调用表间计算弹出框初始化方法
						tableRelaCalcuObj.calcuTableInit($(thisInput));
					});
				}else{
					//不是表间则删除输入框禁用
					$(thisInput).off("click").css("cursor","default").removeAttr("readonly");
				}
				$(this).parents(".model-content").find(".formual").find("input").attr("validform","{isNull:true,blurFlag:true,msg:'请输入计算公式'}");
				//删除字典编码的验证
				$(this).parents(".model-content").find("select.word-num-sel").removeAttr("validform");
				//删除字典编码的验证
				$(this).parents(".model-content").find("select.word-num-sel").removeAttr("validform");
			}else{
				//隐藏输入计算项信息
				$(this).parents(".model-content").find(".formual").css("display","none");
				//$(this).parent().parent().next().css("display","none").next().css("display","none");
				$(this).parents(".model-content").find(".formual").find("input").removeAttr("validform");
				//给字典编码下拉列表加上验证
				//$(this).parents(".model-content").find("select.word-num-sel").attr("validform","{isNull:true,changeFlag:true,msg:'请选择编码'}");
				//$(this).parents(".model-content").find(".formual").find("input").val('');
				//隐藏属性值区域
				$(".property-val-model").hide();
			}
		});
	},
	/**
	 * 获取固定字段单位编码的数据
	 * @param {Object} code
	 */
	getUnitOpts:function(code){
		$.ajax({
			type: "post",
			url: $yt_option.base_path + '/budget/table/getBudgetClassifyDataByParams?tableKey=coso_classify_unit_main', //ajax访问路径  
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
					$('#unitCode').empty();
					if(datas.length > 0 && datas != undefined && datas != null) {
						$.each(datas, function(i, n) {
							if(code && code == n.code) {
								numOptions += '<option value="' + n.code + '" selected="selected" sel-val="' + n.name + '">' + n.num + ' ' + n.name + '</option>'
							} else {
								numOptions += '<option value="' + n.code + '" sel-val="' + n.name + '">' + n.num + ' ' + n.name + '</option>'
							}
						});
						$('#unitCode').append(numOptions);
					}
					$('#unitCode').niceSelect({
			        search: true,  
			        backFunction: function(text) {  
				            //回调方法,可以执行模糊查询,也可自行添加操作  
				            $('#unitCode').html('');  
				            if(text == "") {  
				                $('#unitCode').append('<option value="">请选择</option>');  
				            } 
				            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
				            if(datas != "" && datas.length>0){
				            	$.each(datas,function(i, n) {  
				            		//名称
					                if(n.name.indexOf(text) != -1) {  
					                    $('#unitCode').append('<option value="'+n.code+'" sel-val="'+ n.name+'">'+n.num+' '+n.name+'</option>');  
					                }else if(n.num.indexOf(text) != -1){//编码
					                	 $('#unitCode').append('<option value="'+n.code+'" sel-val="'+ n.name+'">'+n.num+' '+n.name+'</option>'); 
					                }
					            });  
				            }
				        }
				    });
				}
			}
		});
		
	},
	getUnitCodeList:function(){},
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
			success: function(data){
				var dataObj = data.data || {};
				//还原数据表
				$(creatTableAreaObj).newRuleTable({
					theads: dataObj.theads,
					tbodys: dataObj.tbodys,
					propertyList: dataObj.propertyList,
					//是否绑定列表操作事件
					eventCheck:false,
					//是否添加序号 serialNumber
					serialNumber:true
				});
				//只读的属性list
				var propertyList = dataObj.propertyList;
				for(var i = 0, len = propertyList.length; i < len; i++) {
					var proper = propertyList[i];
					//拆分所属下标
					var index = proper.crNum.replace(proper.type, '');
					if(proper.type == 'c') {
						$(creatTableAreaObj).find('.rule-table .indicate-head tr .indicate').eq(index - 1).addClass('dis');
						$(creatTableAreaObj).find('.rule-table .yt-tbody tr').each(function(){
							$(this).find('td').eq(index - 1).addClass('dis');
						});
					} else if(proper.type == 'r') {
						$(creatTableAreaObj).find('.rule-table .yt-tbody tr').eq(index - 1).find('td,th').addClass('dis');
					}
				}
				//设置表格基础数据、
				$('.rule-table').data('tableData', dataObj);
			}
		});
	},
	/**
	 * 设置不可更改的过滤维度
	 * @param {Object} obj
	 */
	setNotChangeDict:function(list){
		//循环添加HTML
		var html = '';
		$('.attributes-list-append').html('');
		//已保存的维度数据
		var notChangeDistList = getConfigData.notChangeDistList || [];
		var notDist = {};
		for(var i = 0;i < notChangeDistList.length;i++){
			notDist[notChangeDistList[i].code] = notChangeDistList[i];
		}
		//不可更改的所有数据
		var notChangeDoctList = getConfigData.notChangeDoctList || [];
		var notDoct = {};
		for(var j = 0;j < notChangeDoctList.length;j++){
			notDoct[notChangeDoctList[j].code] = notChangeDoctList[j];
		}
		//循环不更更改的数据的对象
		for(n in notDoct) {
			//判断在以保存的数据里是否存在
			if(notDist[n]) {
				//存在使用已保存的数据显示
				n = notDist[n];
				if(n.type == 'SELECT') {
					html = $('<div class="box-row unit-code-row">' +
						'<div class="box-content" style="letter-spacing: 1px;padding-left: 14px;">' + n.name + '：</div>' +
						'<div class="box-content box-lable2">' +
						'<select name="" class="attributes" id="" style="display: none;">' +
						'<option value="' + n.code + '">' + n.name + '</option>' +
						'</select>' +
						'<select name="" class="yt-select word-num-sel" id="" code="' + n.code + '" placeholder="请选择" validform="{isNull:true,changeFlag:true,msg:\'请选择' + n.name + '\'}">' +
						'<option value="" selected="selected"></option>' +
						'</select>' +
						'<input type="hidden" class="hid-word-code" value="">' +
						'<span class="valid-font" style="top:35px;"></span>' +
						'</div>' +
						'<div class="box-content box-button">' +
						'<img src="../../../../../resources-sasac/images/common/search.png" class="search-img unit-code-search">' +
						'</div>' +
						'</div>');
					html.find('select.attributes').html($('<option value="' + n.code + '">' + n.name + '</option>').data('opData', n));
					$('.attributes-list-append').append(html);
					getConfigData.setNotChangeSelectOption(html, n);
				} else if(n.type == 'INPUT') {
					html = $('<div class="box-row">' +
						'<div class="box-content" style="letter-spacing: 1px;padding-left: 14px;">' + n.name + '：</div>' +
						'<div class="box-content">' +
						'<select name="" class="attributes" id="" style="display: none;">' +
						'<option value="' + n.code + '">' + n.name + '</option>' +
						'</select>' +
						'<input type="text" value="' + (n.disValue ? n.disValue : '') + '" code="' + n.code + '" class="yt-input word-code" id="" style="width: 130px; display: inline-block;" validform="{isNull:true,blurFlag:true,msg:\'请输入' + n.name + '\'}">' +
						'<input type="hidden" class="hid-word-code" value="">' +
						'<span class="valid-font" style="top:35px;"></span>' +
						'</div>' +
						'</div>');
					html.find('select.attributes').html($('<option value="' + n.code + '">' + n.name + '</option>').data('opData', notDist[n.code]));
					$('.attributes-list-append').append(html);
				}
			} else {
				//不存在使用初始化数据显示
				n = notDoct[n];
				if(n.type == 'SELECT') {
					html = $('<div class="box-row unit-code-row">' +
						'<div class="box-content" style="letter-spacing: 1px;padding-left: 14px;">' + n.name + '：</div>' +
						'<div class="box-content box-lable2">' +
						'<select name="" class="attributes" id="" style="display: none;">' +
						'<option value="' + n.code + '">' + n.name + '</option>' +
						'</select>' +
						'<select name="" class="yt-select word-num-sel" id="" code="' + n.code + '" placeholder="请选择" validform="{isNull:true,changeFlag:true,msg:\'请选择' + n.name + '\'}">' +
						'<option value="" selected="selected"></option>' +
						'</select>' +
						'<input type="hidden" class="hid-word-code" value="">' +
						'<span class="valid-font" style="top:35px;"></span>' +
						'</div>' +
						'<div class="box-content box-button">' +
						'<img src="../../../../../resources-sasac/images/common/search.png" class="search-img unit-code-search">' +
						'</div>' +
						'</div>');
					html.find('select.attributes').html($('<option value="' + n.code + '">' + n.name + '</option>').data('opData', n));
					$('.attributes-list-append').append(html);
					getConfigData.setNotChangeSelectOption(html, n);
				} else if(n.type == 'INPUT') {
					html = $('<div class="box-row">' +
						'<div class="box-content" style="letter-spacing: 1px;padding-left: 14px;">' + n.name + '：</div>' +
						'<div class="box-content">' +
						'<select name="" class="attributes" id="" style="display: none;">' +
						'<option value="' + n.code + '">' + n.name + '</option>' +
						'</select>' +
						'<input type="text" value="' + (n.disValue ? n.disValue : '') + '" code="' + n.code + '" class="yt-input word-code" id="" style="width: 130px; display: inline-block;" validform="{isNull:true,blurFlag:true,msg:\'请输入' + n.name + '\'}">' +
						'<input type="hidden" class="hid-word-code" value="">' +
						'<span class="valid-font" style="top:35px;"></span>' +
						'</div>' +
						'</div>');
					html.find('select.attributes').html($('<option value="' + n.code + '">' + n.name + '</option>').data('opData', n));
					$('.attributes-list-append').append(html);
				}
			}
		}
	},
	/**
	 * 设置不可更改的过滤维度下拉数据
	 * @param {Object} obj
	 * @param {Object} opData
	 */
	setNotChangeSelectOption:function(obj, opData){
		var selData = opData;
		var attrDoc = obj;
		if(selData && selData.type.toUpperCase() == "SELECT") {
			var thisPar = attrDoc.parent().parent();
			//调用查询字典编码信息
			getConfigData.selectCode(attrDoc);
			//隐藏输入框
			attrDoc.find(".word-code").hide();
			//显示可输入下拉列表
			attrDoc.find(".word-num-sel").show();
			//调用初始化字典编码可输入下拉列表方法
			getConfigData.getSelValData(attrDoc, opData);
			attrDoc.find("input.word-code").removeAttr("validform");
		} else {
			attrDoc.find(".word-code").unbind();
			//删除查询图片
			attrDoc.find(".search-img").remove();
			//显示输入框
			attrDoc.find(".word-code").show();
			//隐藏可输入下拉列表
			attrDoc.find(".word-num-sel").hide().empty().removeAttr("validform");
			attrDoc.find("input.word-code").attr("validform", "{isNull:true,msg:'请输入编码'}");
		}
		//$(this).parent().next().next().find("input").val("");
	},
	/**
	 * 
	 * 顶部配置区域标题点击事件
	 * 
	 */
	configTitleEvent:function(){
		//初始化显示行配置
		$(".table-config-panel .row-col-model:eq(0) .row-col-title").addClass("config-title-check");
		$(".table-config-panel .row-col-model:eq(0) .row-col-title").next().show();
		$(".row-col-title").click(function(){
			//加上选中样式
			$(".row-col-title").removeClass("config-title-check");
			$(this).addClass("config-title-check");
			//隐藏其他的配置信息
			$(".row-col-title").next().hide();
			//显示对应的配置信息
			$(this).next().show();
		});
	},
    /**
     * 获取预算表信息
     * @param {Object} tableId 预算表Id 
     */
    getbudgetInfoById:function(tableId){
    	var  tableData = "";
    	$.ajax({
			type: 'post',
			url: 'budget/tStyle/getBudgetTableDetailByTableId',
			data: {
				tableId:tableId
			},
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					if(data.data){
						tableData = data.data;
					}
				}
			}
		});
	    return tableData;
    }
}
/**
 * 
 * 表间计算逻辑对象
 * 
 */
var  tableRelaCalcuObj ={
	/**
	 * 初始化显示表模板信息
	 * @param {Object} thisInput 配置面板进来计算公式的输入框对象
	 * @param {Object} configSelCell 配置面板进来选中的单元格
	 */calcuTableInit:function(thisInput,configSelCell){
	 	//清除表格中所有选中的单元格样式
	 	$("#tableTemplate tr td").removeClass("cell-check cell-shadow");
	 	//设置右键交互弹出框
		setInteractive();
		//显示表间计算选择表区域
		$(".table-rela-model").show();
		//获取到计算公式数据赋值给弹出框中的计算公式输入框
		$("#calcuInput").val($(thisInput).val());
		//调用计算公式输入框操作事件方法
		tableRelaCalcuObj.calInputEvent();
		//调用点击整个表格区域(包含tab切换)
		 tableRelaCalcuObj.allDivClick();
		 //调用获取tab数据方法
		 tableRelaCalcuObj.getPropertyTabInfo();
		 //给获取表格模板区域算取宽和高
		$("#tableTemplate").css({"width":$(window).width()+"px","height":($(window).height()-120)+"px"});
		$(window).resize(function(){
			//给获取表格模板区域算取宽和高
			$("#tableTemplate").css({"width":$(window).width()+"px","height":($(window).height()-120)+"px"});
		});
		//移除默认选中效果
		$("body").on('selectstart', function() {
			return false;
		});
		//移除默认右键菜单
		$("body").on('contextmenu', function(e) {
			e.preventDefault();
		});
		//点击确定按钮
		$("button.calcu-sure-btn").off().on('click',function(){
			var  validFlag = true;
			//判断计算公式是否有数据
			if($("#calcuInput").val() == ""){
				$yt_alert_Model.prompt("请完善计算公式!");
				validFlag = false;
				return false;
			}else if(configSelCell && configSelCell != undefined && configSelCell !=null){//判断传输的配置面板选中的单元格是否有值
				var calcuVal = $("#calcuInput").val();
				var calValuArr = calcuVal.replace(/[~'/<>@#$%^&*()-+_=:]/g,",");
		  	    //截取掉表格
		  	    calValuArr = calValuArr.split(",");
				$.each(calValuArr, function(i,n) {
					//比对查找是不是相同的单元格
					if(configSelCell == n){
						 $yt_alert_Model.alertOne({  
				            haveCloseIcon: true, //是否带有关闭图标  
				            leftBtnName: "确定", //左侧按钮名称,默认确定  
				            cancelFunction: "", //取消按钮操作方法*/  
				            alertMsg: "计算公式中出现了相同表格的同一个单元格信息,请检查!", //提示信息  
				            cancelFunction: function() { //点击确定按钮执行方法  
				            },  
				        });  
						validFlag = false;
						return false;
					}
				});
			}
			if(validFlag){
				var calcuVal = $("#calcuInput").val();
				//判断计算公式的最后一个字符是不是运算符
				var  calcuValSub = calcuVal.substr(calcuVal.length-1,1);
				var reg = /^[\(\{\[+\-*\/%]+$/i;
				if(reg.test(calcuValSub)){
					//最后一位含有运算符的话截取掉
					calcuVal = calcuVal.substring(0,calcuVal.length-1);
				}
				//获取计算公式输入框数据赋值给配置面板中的计算公式输入框
				$(thisInput).val(calcuVal);
				//隐藏表间计算选择表区域
			 	$(".table-rela-model").hide();
			 	//清空计算公式输入框内容
			 	$("#calcuInput").val('');
			 	//清除生成的鼠标右键生成的提示框
			 	$("body #tableInputHolder").remove();
				//调用筛选选中单元格方法
		 		tableRelaCalcuObj.screenCellsData();
			 	//松开鼠标移除经过事件
				$("#tableTemplate").find('td,th').off('mouseover');
			}
		});
		 //点击关闭按钮
		 $("button.calcu-close-btn").click(function(){
		 	//隐藏表间计算选择表区域
		 	$(".table-rela-model").hide();
		 	//清空计算公式输入框内容
		 	$("#calcuInput").val('');
		 	//调用筛选选中单元格方法
		 	tableRelaCalcuObj.screenCellsData();
		 	//清除生成的鼠标右键生成的提示框
			$("body #tableInputHolder").remove();
			//松开鼠标移除经过事件
			$("#tableTemplate").on('mouseup', 'td,th', function() {
				$("#tableTemplate").find('td,th').off('mouseover');
			});
		 });
		 //点击清空字样
		 $(".clear-lab").click(function(){
		 	//清空计算公式输入框内容
		 	$("#calcuInput").val('');
		 	//调用筛选选中单元格方法
		 	tableRelaCalcuObj.screenCellsData();
		 	//隐藏清空字样
		 	$(this).hide();
		 	//松开鼠标移除经过事件
			$("#tableTemplate").on('mouseup', 'td,th', function() {
				$("#tableTemplate").find('td,th').off('mouseover');
			});
		 });
	},
	/**
	 * 
	 * 获取相同属性的表格tab数据
	 * 
	 */
	getPropertyTabInfo:function(){
		//调用获取相同属性的表格
	 	$.ajax({
			type: 'post',
			url:'budget/confg/getSameAttrTabListByTableId',
			data:{
				tableId:tableIdObj.tableId
			},
			success: function(data) {
				if(data.flag == 0) {
					//数据获取成功拼接easyui的tab
					var contStr = "";
					$("select.attr-table-sel").empty();
					var optionStr = '';
					
					if(data.data && data.data.length > 0){
						$.each(data.data,function(i,n){
							contStr = '<div title="'+n.tableName+'">'
						        +'<input type="hidden" class="hid-table-id" value="'+n.tableId+'"/>'
						        +'<input type="hidden" class="hid-table-code" value="'+n.tableCode+'"/>'
						        +'</div>';
							$("#tableTemplate").append(contStr);
							//相同属性下拉列表
							optionStr += '<option value="'+n.tableId+'">'+n.tableName+'</option>';
						});
						//拼接相同属性下拉列表
						$("select.attr-table-sel").append(optionStr);
						$("select.attr-table-sel").niceSelect();
						//相同属性下拉列表选择事件
						$("select.attr-table-sel").change(function(){
							var thisSel = $(this);
							//遍历所有面板下的表格Id
							$(".tabs-panels .panel .panel-body input.hid-table-id").each(function(i,n){
								//比对Id值找到对应的面板
								 if($(thisSel).val() == $(n).val()){
									//获取比对上的面板索引,设置面板选中
									$('#tableTemplate').tabs("select",$(n).parents(".panel").index());
								 	return false;
								 }
							});
						});
						
						$('#tableTemplate').tabs({
							onSelect:function (title,index){
								//获取当前选择的表格Id
								var tableId = $(".tabs-panels .panel").eq(index).find(".panel-body input.hid-table-id").val();
								var tableCode =  $(".tabs-panels .panel").eq(index).find(".panel-body input.hid-table-code").val();
								//存储选中的tab索引
								var tabIndex  = index;
								var thisSelPanel = $(".tabs-panels .panel").eq(tabIndex).find(".panel-body");
								//调用获取表格模板接口
							    getConfigData.getBudgetTableDetailByTableId(tableId,thisSelPanel);
							    //拼接标题
							    $(".tabs-panels .panel").eq(tabIndex).find(".panel-body .tab-table-title").remove();
							    var  tableTitle = '<div class="tab-table-title">'+tableCode+'--'+title+'</div>';
							    $(".tabs-panels .panel").eq(tabIndex).find(".panel-body table").before(tableTitle);
							    //调用单元格操作事件方法
							    tableRelaCalcuObj.tableRelaCellsEvent();
							    //给表格中的单元格拼接默认图标
							    $(thisSelPanel).find(".rule-table tbody tr td:not(.indicate,.dis)").html('<img class="img-def" src="'+configCommonObj.cellImgDef+'"/>');
							    //调用筛选单元格数据方法
		  						tableRelaCalcuObj.screenCellsData();
		  						//设置相同属性下拉列表选中当前选中的tab页值
		  						$('select.attr-table-sel option[value="'+tableId+'"]').attr("selected","selected");
		  						$('select.attr-table-sel').niceSelect();
							}
						});
						//调用筛选单元格数据方法
		  				tableRelaCalcuObj.screenCellsData();
					}
				}
			}
		});
	},
	/**
	 * 
	 * 
	 * 单元格操作事件
	 * 
	 */
	tableRelaCellsEvent:function(){
		 /**
		  * 
		  * 点击表格单元格操作事件
		  * 排序排序列和禁用的单元格
		  */
		 $(".rule-table tbody tr td:not(.indicate,.dis)").on("mousedown",function(e){
		 	var me = $(this);
		 	var btnNumFlag = e.button;
		 	//调用冒泡方法
		 	$yt_common.eventStopPageaction();
		 	//添加选中类样式
		 	 $(".rule-table td").removeClass("cell-shadow");
		 	 $(this).addClass("cell-shadow");
		 	 //初始化赋予全部标签隐藏
			$("img.img-def").css("display", "none");
			//当前点击td下的图标显示
			$(this).find("img.img-def").css("display", "inline-block");
			//调用点击单元格中默认图标操作方法
			tableRelaCalcuObj.cellsImgEvent($(this).find("img.img-def"));
			//获取当前选中的tab标签对象
	 		var tab = $('#tableTemplate').tabs('getSelected');
			var tabIndex = $('#tableTemplate').tabs('getTabIndex',tab);
			var selPanlObj = $(".tabs-panels .panel").eq(tabIndex);
			//获取表格code
		 	var tableCode = selPanlObj.find(".panel-body input.hid-table-code").val();
			if(btnNumFlag == 2){//鼠标右键的时候
				//判断如果选择的单元格超过1个话执行鼠标右键操作
				if($(selPanlObj).find('table td.cell-check').length > 1){
					//点击确定
					$('#rightButCon .readonly').off().on('click', function() {
						var  validFlag = true;
						$(selPanlObj).find('table td.cell-check').each(function() {
							var td = $(this);
							var tr = td.parent();
							var c = td.index();
							var r = tr.index() + 1;
							var cellsVal ="";
							//获取现在的input里边的值
							var inputtext = $("#calculationFormula").val();
							//判断当前选择的表格是否与从模板来的表格code相同则不拼接表的code
						 	if(tableCode != tableIdObj.tableCode){
						 		 cellsVal  = tableCode +"!" + "c" + c + "r" + r;
						 	}else{
						 		 cellsVal  = "c" + c + "r" + r;
						 	}
							if(!$(".cell-check img").hasClass("img-check")) {
								//获取计算公式输入框的值
			   					var inputVal = $("#calcuInput").val();
			   					if(inputVal != ""){
			   						//获取当前焦点所在位置的前一位
				   					var selectStartIndex = $("#calcuInput").getSelectionStart()-1;
				   					//判断是否大于等于0
							   		if(0 <= selectStartIndex){
							   			//输入框内的值截取,获取当前焦点的前一位字符
							   			var regInputVal = inputVal.substr(selectStartIndex,1);
							   			var reg = /^[\(\{\[+\-*\/%]+$/i;
							   			//验证是否满足条件	
							   			if(reg.test(regInputVal)){
							   				$("#calcuInput").insertInputStr(cellsVal+"+");
							   				
							   			}else{
							   				$yt_alert_Model.prompt("请检查您的计算公式内容,不规范!");
							   				validFlag = false;
							   			}
							   		}
			   					}else{
			   						//给input值替换，一种特殊的insertInputStr方法
									$("#calcuInput").insertInputStr(cellsVal+"+");
			   					}
							}
						});
						if(validFlag){
							$(".cell-check .img-def").attr("src",configCommonObj.cellImgCheck);
							//去除非选中的类名
							$(".cell-check img").removeClass("img-def");
							//添加选中的类名
							$(".cell-check img").addClass("img-check").css("display","inline-block");
						}
					});
					//显示清空字样
			   		$(".clear-lab").show();
					//右键显示选单
					rightButConPosition(e);
					//右键菜单事件
					setInterEvent(me, '.yt-tbody', 'tbody');
					//点击关闭菜单
					$("body").one('click', function() {
						$('#rightButCon').hide();
					});
				}
			}else if(btnNumFlag == 0){
				//点击后为所有的单元格添加鼠标经过事件
				var startTd = $(this);
				var y = $(this).index();
				var x = $(this).parent().index();
				var startIndex = {
					x: x,
					y: y
				};
				//松开鼠标移除经过事件
				$("#tableTemplate").on('mouseup', 'td,th', function() {
					$("#tableTemplate").find('td,th').off('mouseover');
				});
				$(".rule-table tbody tr td:not(.indicate,.dis)").removeClass('cell-check').on('mouseover', function() {
					endTd = $(this);
					var y = $(this).index();
					var x = $(this).parent().index();
				var	endIndex = {
						x: x,
						y: y
					};
					selectTd(startIndex, endIndex, 'td:not(.indicate)', 'tbody');
				});
			  }
			});
			//松开鼠标移除经过事件
			$("#tableTemplate").on('mouseup', 'td,th', function() {
				$("#tableTemplate").find('td,th').off('mouseover');
			});
	},
	/**
	 * 
	 * 点击单元格内默认图标方法
	 * 
	 */
	cellsImgEvent:function(obj){
		$(obj).off().on("click",function(){
		 	//调用冒泡方法
		 	$yt_common.eventStopPageaction();
		 	//获取当前选中的tab标签对象
		 	var tab = $('#tableTemplate').tabs('getSelected');
			var tabIndex = $('#tableTemplate').tabs('getTabIndex',tab);
			var selPanlObj = $(".tabs-panels .panel").eq(tabIndex);
		 	//获取当前选中单元格的表格code列号行号
		 	//列和行
		 	var tdNum = selPanlObj.find(".indicate-head th").eq($(this).parent().index()).text().trim().toLocaleLowerCase();
		 	var trNum = $(this).parents("tr").find(".indicate").text().trim().toLocaleLowerCase();
		 	//拼接出单元格的值
		 	var cellsVal ="";
		 	//获取表格code
		 	var tableCode = selPanlObj.find(".panel-body input.hid-table-code").val();
		 	//判断当前选择的表格是否与从模板来的表格code相同则不拼接表的code
		 	if(tableCode != tableIdObj.tableCode){
		 		cellsVal = tableCode +"!" + tdNum + trNum;
		 	}else{
		 		cellsVal = tdNum + trNum;
		 	}
		 	//先判断是否重复选择单元格
		 	if(!$(this).hasClass("img-check")) {
		 		//获取计算公式输入框的值
		   		var inputVal = $("#calcuInput").val();
		   		//获取当前焦点所在位置的前一位
		   		var selectStartIndex = $("#calcuInput").getSelectionStart()-1;
		   		//判断是否大于等于0
		   		if(0 <= selectStartIndex){
		   			//输入框内的值截取,获取当前焦点的前一位字符
		   			var regInputVal = inputVal.substr(selectStartIndex,1);
		   			var reg = /^[\(\{\[+\-*\/%]+$/i;
		   			//验证是否满足条件	
		   			if(reg.test(regInputVal)){
		   				$("#calcuInput").insertInputStr(cellsVal);
		   				//更改图标路径
						$(this).attr("src",configCommonObj.cellImgCheck).removeClass("img-def").addClass("img-check");
		   			}else{
		   				$yt_alert_Model.prompt("请检查您的计算公式内容,不规范!");
		   			}
		   		}else{
		   			//如果光标是从0开始的,则直接赋值
		   			$("#calcuInput").insertInputStr(cellsVal);
		   			//更改图标路径
					$(this).attr("src",configCommonObj.cellImgCheck).removeClass("img-def").addClass("img-check");
		   		}
		   		//显示清空字样
		   		$(".clear-lab").show();
		 	}
		 });
	},
	/**
	 * 
	 * 计算公式输入框操作事件
	 * 
	 */
	calInputEvent:function(){
		/**
		 * 
		 * 验证计算公式输入框只能输入指定字符
		 * 
		 */
		$("#calcuInput").keyup(function(ev){
			if($(this).val() != ""){
				//显示清空的字样
				 $(".clear-lab").show();
			}
	  		var val = this.value;
	  	 	var e = ev || event;
	  	 	var reg = /[^A-Za-z0-9!(){}\[\]+\-*\/%.]+$/i;
		 	return this.value = this.value.replace(reg,"");
	  	});
	  	/**
	  	 * 
	  	 * 失去焦点操作事件
	  	 * 
	  	 */
	  	$("#calcuInput").on("blur",function(){
	  		//调用冒泡方法
		   	$yt_common.eventStopPageaction();
		   	if($(this).val() != ""){
		   		//显示清空字样
		   		$(".clear-lab").show();
		   	}
	  	});
	},
	/**
	 * 
	 * 
	 * 筛选单元格数据方法
	 * 
	 * 
	 */
	screenCellsData:function(){
		//获取当前选中的tab标签对象
	 	var tab = $('#tableTemplate').tabs('getSelected');
		var tabIndex = $('#tableTemplate').tabs('getTabIndex',tab);
		var selPanlObj = $(".tabs-panels .panel").eq(tabIndex);
	 	//当前面板表的表格对象
	  	var thisTable = selPanlObj.find("table.rule-table");
	  	//获取表格code
	 	var tableCode = selPanlObj.find(".panel-body input.hid-table-code").val();
	 	//判断当前选择的表格是否和模板页面选择的是同一个表格不同则
	 	if(tableCode != tableIdObj.tableCode){
	 		tableCode = tableCode+"!";
	 	}
	  	//计算公式输入框对象
	  	var calcuInpuObj = $("#calcuInput");
	  	var cellsObj = {};
	  		var cellsList = [];
	  		//列的配置信息
	  		var cellTdText = "";
	  		//行的配置信息
	  		var cellRowText = "";
	  		//1.遍历当前表内所有的单元格,拼接数据数据信息对象
	  		thisTable.find("tbody tr td:not(.indicate,.dis)").each(function(i,n){
	  			cellsObj = {};
	  			cellTdText = "";
	  		    cellRowText = "";
	  		    //得到列的配置名
	  			cellTdText = thisTable.find('.indicate-head th:eq('+$(this).index()+')').text().trim().toLocaleLowerCase();
	  			//得到行的配置名
	  			cellRowText = $(this).parent().find(".indicate").text().trim().toLocaleLowerCase();
	  			//比对两次选中的表格code是否相同
	  			if(tableCode != tableIdObj.tableCode){
	  				//存储单元格
	  			   $(this).data("cellData",tableCode+cellTdText+cellRowText);
	  			   //拼接单元格
	  			   cellsObj.cells = tableCode + cellTdText + cellRowText;
	  			}else{
	  				//存储单元格
	  			   $(this).data("cellData",cellTdText+cellRowText);
	  			   //拼接单元格
	  			   cellsObj.cells = cellTdText + cellRowText;
	  			}
	  			cellsList.push(cellsObj);
	  			
	  		});
	  	    console.log(cellsList);
	  	    //2.分割计算公式的值,得到单元格集合
	  	    var calValuArr = $(calcuInpuObj).val().replace(/[~'/<>@#$%^&*()-+_=:]/g, ",");
	  	    //截取掉表格
	  	    calValuArr = calValuArr.split(",");
	  	    console.log(calValuArr);
	  	    //3.定义一个空的集合,存储计算公式输入框中现有的单元格
	  	    var tempCells = [];
	  	    //4.遍历截取的计算公式数据集合
	  	    $.each(calValuArr, function(i,n) {
	  	    	//遍历存储的单元格数据集合
	  	    	$.each(cellsList, function(v,c) {
	  	    		//比对单元格
	  	    		if(n == c.cells){
	  	    			//存储到选中的单元格中
	  	    			tempCells.push(n);
	  	    		}
	  	    	});
	  	    });
	  	    //6.删除表格中所有选中单元格中图标样式改为默认并且影藏
	  	    thisTable.find("tbody tr td:not(.cell-shadow) img").hide().removeClass("img-check").addClass("img-def").attr("src",configCommonObj.cellImgDef);
	  	    //删除当前选中的单元格样式
	  	    thisTable.find("tbody tr td.cell-shadow img").removeClass("img-check").addClass("img-def").attr("src",configCommonObj.cellImgDef);
	  	   // thisTable.find("tbody tr td").removeClass("cell-shadow");
	  	    if(tempCells.length>0){
	  	    	$.each(tempCells, function(i,n) {
		  	    	//遍历表格单元格
		  	    	$.each(thisTable.find("tbody td:not(.indicate,.dis)"), function(i,t) {
		  	    		//比对找到对应的单元格
		  	    		if(n == $(t).data("cellData")){
		  	    		   $(t).find("img").addClass("img-check").removeClass("img-def").attr("src",configCommonObj.cellImgCheck).show();
		  	    		}
		  	    	});
		  	    });
	  	    }
	},
	/**
	 * 点击整个表格区域(包含tab切换)
	 */
	allDivClick: function() {
		$("#tableTemplate").off().on("click", function() {
			//调用冒泡方法
		   //	$yt_common.eventStopPageaction();
			//计算公式输入框失去焦点
			$("#calcuInput").blur(function(){
				//调用冒泡方法
		  	    $yt_common.eventStopPageaction();
				//设置计算公式输入框获取焦点
				$("#calcuInput").focus();
			});
		});
	}
}

//重写方法
$.extend($.fn, {
	//获取文本框内光标位置  
	getSelectionStart: function() {
		var e = this[0];
		if(e.selectionStart) {
			return e.selectionStart;
		} else if(document.selection) {
			e.focus();
			var r = document.selection.createRange();
			var sr = r.duplicate();
			sr.moveToElementText(e);
			sr.setEndPoint('EndToEnd', r);
			return sr.text.length - r.text.length;
		}

		return 0;
	},
	getSelectionEnd: function() {
		var e = this[0];
		if(e.selectionEnd) {
			return e.selectionEnd;
		} else if(document.selection) {
			e.focus();
			var r = document.selection.createRange();
			var sr = r.duplicate();
			sr.moveToElementText(e);
			sr.setEndPoint('EndToEnd', r);
			return sr.text.length;
		}
		return 0;
	},
	//自动插入默认字符串  
	insertInputStr: function(str) {
		$(this).each(function() {
			var tb = $(this);
			//tb.focus();
			if(document.selection) {
				var r = document.selection.createRange();
				document.selection.empty();
				r.text = str;
				r.collapse();
				r.select();
			} else {
				var newstart = tb.get(0).selectionStart + str.length;
				tb.val(tb.val().substr(0, tb.get(0).selectionStart) +
					str + tb.val().substring(tb.get(0).selectionEnd));
				tb.get(0).selectionStart = newstart;
				tb.get(0).selectionEnd = newstart;
			}
		});

		return this;
	},
	setSelection: function(startIndex, len) {
		$(this).each(function() {
			if(this.setSelectionRange) {
				this.setSelectionRange(startIndex, startIndex + len);
			} else if(document.selection) {
				var range = this.createTextRange();
				range.collapse(true);
				range.moveStart('character', startIndex);
				range.moveEnd('character', len);
				range.select();
			} else {
				this.selectionStart = startIndex;
				this.selectionEnd = startIndex + len;
			}
		});

		return this;
	},
	getSelection: function() {
		var elem = this[0];

		var sel = '';
		if(document.selection) {
			var r = document.selection.createRange();
			document.selection.empty();
			sel = r.text;
		} else {
			var start = elem.selectionStart;
			var end = elem.selectionEnd;
			var content = $(elem).is(':input') ? $(elem).val() : $(elem).text();
			sel = content.substring(start, end);
		}
		return sel;
	}
});
	/**
	 * 拖拽选中单元格
	 * @param {Object} startIndex
	 * @param {Object} endIndex
	 * @param {Object} Color
	 */
	function selectTd(startIndex, endIndex, dom, box) {
		
		var tab = $('#tableTemplate').tabs('getSelected');
		var tabIndex = $('#tableTemplate').tabs('getTabIndex',tab);
		var selPanlObj = $(".tabs-panels .panel").eq(tabIndex);
		var minX = null;
		var maxX = null;
		var minY = null;
		var maxY = null;
		if(startIndex.x < endIndex.x) {
			minX = startIndex.x;
			maxX = endIndex.x;
		} else {
			minX = endIndex.x;
			maxX = startIndex.x;
		};
		if(startIndex.y < endIndex.y) {
			minY = startIndex.y;
			maxY = endIndex.y;
		} else {
			minY = endIndex.y;
			maxY = startIndex.y;
		};
		startIndex = {
			x: minX,
			y: minY
		};
		endIndex = {
			x: maxX,
			y: maxY
		};
		$(selPanlObj).find("td,th").removeClass('cell-check');
		$(selPanlObj).find('.yt-tbody tr').removeClass('tr-shadow');
		$(selPanlObj).find('td,th').removeClass('td-shadow');
		for(var i = minX; i <= maxX; i++) {
			var selectTr = $(selPanlObj).find(box).find("tr").eq(i);
			for(var j = minY; j <= maxY; j++) {
				selectTr.find(dom).eq((j-1)).addClass('cell-check');
			}
		}
	}
	/**
	 * 添加右键交互弹出框
	 */
	function setInteractive() {
		var html = '<div id="rightButCon" class="right-button-context"><ul><li class="readonly">确定选中</li></ul></div>';
		html += '<div id="tableInputHolder" class="input-holder"><textarea id="handtableInput" class="hand-input"></textarea></div>';
		$("body").append(html);
	}

	/**
	 * 设置右键菜单的显示位置
	 * @param {Object} site
	 */
	function rightButConPosition(e) {
		var left = e.clientX;
		var top = e.clientY;
		console.log(e);
		//弹出框对象
		var rightButCon = $('#rightButCon');
		//宽度
		var width = rightButCon.width();
		//高度
		var height = rightButCon.height();
		//获取页面的宽高
		var w = $(window);
		var winWidth = w.width();
		var winHeight = w.height();
		//计算超出定位的显示方式
		left = width + left > 　winWidth ? left - width : left;
		top = height + top > winHeight ? top - height : top;
		rightButCon.show().css({
			left: left,
			top: top
		});
	}
	/**
	 * 右键菜单点击事件处理
	 * @param {Object} obj
	 */
	function setInterEvent(obj, site, type) {
		//设置只读一行
		$('#rightButCon .readonly-row:not(.dis)').off().on('click', function(e) {
			var tr = obj;
			readOnlyRow(tr, type, 'before');
		});
		//设置只读一列
		$('#rightButCon .readonly-col:not(.dis)').off().on('click', function(e) {
			var tr = obj;
			readOnlyCol(tr, type, 'before');
		});
	}