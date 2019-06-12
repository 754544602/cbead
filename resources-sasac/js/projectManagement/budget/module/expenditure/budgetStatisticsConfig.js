var budgetObj = {
	codeList:null,
	/**
	 * 初始化
	 */
	init:function(){
		budgetObj.getHeardTabInfo();
		budgetObj.getConfigInfo();
		$(".table-title").text($(".tab-li.active-li").text());
	},
	/*
	 * 操作事件
	 */
	eventFun:function(){
		//调用Tab标签切换事件
		budgetObj.switcher();
		
		//点击取消按钮
		$(".canel-btn").on("click",function(){
			var pageUrl= "view/system-sasac/budget/module/expenditure/budgetStatistics.html";
			/**
			* 调用显示loading方法
			*/
			parent.parent.$yt_baseElement.showLoading();
			window.location.href = $yt_option.websit_path+pageUrl;
		});
		//配置按钮事件
		$(".config-btn").click(function (){
			$(".formual input,.word-code").val("");
			$("#config-form-column .attributes-list,#config-form-row .attributes-list").empty();
			$(".is-calculation").parent().removeClass("check");
			$(".is-calculation").attr("checked", false);
			$(".formual").hide().find("input").removeAttr("validform");
			
			
			var titleText ="";
			if($(this).parent().parent().hasClass("config-thead")){
				//获取所属列表
				var tabContent = $(".tab-content").eq($(".tab-header .active-li").index());
				//标题
				titleText = "配置列"+($(this).index()-3)+"属性";
				$("#config-form-column .title-text").text(titleText);
				//表名
				titleText = $(".tab-header .active-li").text();
				$("#config-form-column .table-name").text(titleText);
				//列名
				$("#config-form-column .column-name").text(tabContent.find(".column-name"+($(this).index()-3)).text());
				$(".column-num").text($(this).index()-2);
				//回写表单数据
				budgetObj.setFormData($(this),$("#config-form-column"));
				sysCommon.showModel($("#config-form-column"));
			}else{
				//标题
				titleText = "配置行"+($(this).parent().index())+"属性";
				$("#config-form-row .title-text").text(titleText);
				//表名
				titleText = $(".tab-header .active-li").text();
				$("#config-form-row .table-name").text(titleText);
				//功能科目
				titleText = $(this).next().text();
				$(".subject").text(titleText);
				//单位编码
				titleText = $(this).next().next().text();
				$(".co-code").text(titleText);
				//单位名称
				titleText = $(this).next().next().next().text();
				$(".co-name").text(titleText);
				$(".row-num").text($(this).parent().index());
				//回写表单数据
				budgetObj.setFormData($(this),$("#config-form-row"));
				sysCommon.showModel($("#config-form-row"));
			}
			//清除表单
		});
		//是否为计算项
		$(".is-calculation").change(function (){
			if($(this).attr("checked")=="checked"){
				$(this).parent().parent().next().css("display","table-cell").next().css("display","table-cell");
				$(this).parent().parent().next().next().find("input").attr("validform","{isNull:true,blurFlag:true,msg:'请输入计算公式'}");
			}else{
				$(this).parent().parent().next().css("display","none").next().css("display","none");
				$(this).parent().parent().next().next().find("input").removeAttr("validform");
			}
		});
		//添加属性
		$(".add-attr").click(function (){
			budgetObj.createAttrList($(this).parents(".dialog-box"));
		});
		
		//取消按钮关闭配置弹出框
		$("#config-form-column .yt-cancel-btn").click(function (){
			sysCommon.closeModel($("#config-form-column"));
		});
		//取消按钮关闭配置弹出框
		$("#config-form-row .yt-cancel-btn").click(function (){
			sysCommon.closeModel($("#config-form-row"));
		});
		//绑定编码选择事件
		budgetObj.selectCode($(".word-code"));
		//关闭编码列表
		$("#code-list .yt-cancel-btn").click(function (){
			$("#code-list").hide();
			$("#pop-modle-alert").css("z-index","100");
		});
		//编码列表点击事件
		$(".code-list tr").click(function (){
			$(this).addClass("yt-table-active").siblings().removeClass("yt-table-active");
		});
		
		$("#code-list .yt-common-btn").click(function (){
			if($(".code-list .yt-table-active").length==0){
				$yt_alert_Model.prompt("请选择编码");
			}else{
				$(".word-code.select-code").val($(".code-list .yt-table-active td:eq(0)").text()).removeClass("select-code");
				$("#code-list").hide();
				$("#pop-modle-alert").css("z-index","100");
			}
		});
		
		
		//初始化下拉列表
		budgetObj.getAttrList($(".attributes"));
		$(".attributes").niceSelect();
		
		
		//配置行保存方法
		$("#config-form-row .yt-common-btn,#config-form-column .yt-common-btn").click(function (){
			var formData = {};
			if($(this).parents(".dialog-box").attr("id")=="config-form-row"){
				formData.type = "r";
			}else{
				formData.type = "c";
			}
			
			var val = "";
			//tableId
			val = $(".tab-header .active-li input").val();
			formData.tableId = val;
			//name
			val = "";
			formData.name = val;
			//序号
			if(formData.type=="r"){
				val = $(this).parents(".dialog-box").find(".row-num").text();
			}else{
				val = $(this).parents(".dialog-box").find(".column-num").text();
			}
			
			formData.orderNum = val;
			
			//是否为计算项
			val = ($(this).parents(".dialog-box").find(".is-calculation:checked").length==0)?2:1;
			formData.calcItem = val;
			//计算公式
			val = $(this).parents(".dialog-box").find(".formual input").val();
			formData.calcValue = val;
			formData.propertyList = [];
			var promptState = false;
			
			//获取运算属性
			var formVal = {};
			$(this).parents(".dialog-box").find(".attributes-list .box-row").each(function (i,n){
				if($(n).find("select").val()!="0"){
					formVal = {
						property:$(n).find("select").val(),
						value:$(n).find(".word-code").val()
					}
					formData.propertyList.push(formVal);
				}
			});
			if($yt_valid.validForm($(this).parents(".dialog-box"))){
				var tabContent = $(".tab-content").eq($(".tab-header .active-li").index());
				if(formData.type=="r"){
					tabContent.find(".yt-tbody .config-btn").eq($("#config-form-row .row-num").text()-1).data("configData",formData).addClass("rtest");
					sysCommon.closeModel($("#config-form-row"));
				}else{
					tabContent.find(".config-thead .config-btn").eq($("#config-form-column .column-num").text()-1).data("configData",formData).addClass("ctest");
					sysCommon.closeModel($("#config-form-column"));
				}
			}
		});
		//保存配置方法
		$(".config-save-btn").click(function (){
			//获取所属列表
			var tabContent = $(".tab-content").eq($(".tab-header .active-li").index());
			var tableId = $(".tab-header .active-li input").val();
			var formList = [];
			tabContent.find(".config-btn").each(function (i,n){
				if($(n).data("configData")){
					formList.push($(n).data("configData"));
				}
			});
			console.log(formList);
			//保存配置信息
			$.ajax({
				type:"post",
				url:"budget/table/saveCongfig",
				async:false,
				data:{"congfigJsonStr":JSON.stringify(formList),"tableId":tableId},
				success:function (data){
					$yt_alert_Model.prompt("配置成功");
					budgetObj.getConfigInfo();
				},error:function (data){
					$yt_alert_Model.prompt("网络异常请稍后重试");
				}
			});
			
		});
	},
	/**
	 * 
	 * Tab标签切换事件
	 * 
	 */
	switcher: function() {
		$('.tab-li').off().on('click', function() {
			var index = $(this).index();
			$(this).addClass('active-li').siblings('.tab-li').removeClass('active-li');
			$('.tab-content').eq(index).css("display", 'block').siblings('.tab-content').hide();
			$(".table-title").text($(this).text());
			budgetObj.getConfigInfo();
		});
	},selectCode:function (obj){
		
		$(obj).click(function(){
			if($(this).parent().prev().prev().find("select").val()=="0"){
				$yt_alert_Model.prompt("请选择引用字典/预算属性")
				return false;
			}
			$(this).addClass("select-code")
			sysCommon.showModel($("#code-list"));
			$("#code-list .yt-search-btn").prev().val("")
			$("#pop-modle-alert").css("z-index","10002");
			budgetObj.getCodeList(obj);
		});
		$("#code-list .yt-search-btn").prev().unbind().bind("keydown",function (e){
			if(e.keyCode == 13){
				budgetObj.getCodeList(obj);
			}
		});
		$("#code-list .yt-search-btn").unbind().bind("click",function (){
			budgetObj.getCodeList(obj);
		});
	},getAttrList:function(ele,selectData){
		$(ele).empty();
		if(selectData=="0" || selectData==undefined || selectData==""){
			$(ele).parent().next().next().find("input").removeAttr("validform")	
		}
		if(budgetObj.codeList==null){
			$.ajax({
				type:"post",
				url:"budget/table/getDictList",
				async:false,
				success:function(data){
					if(data.flag == 0){
						var option = $('<option value="0">请选择</option>');
							$(ele).append(option);
						$.each(data.data, function(i,n) {
							if(selectData==n.code){
								option = $('<option value="'+n.code+'" selected="selected">'+n.name+'</option>');	
							}else{
								option = $('<option value="'+n.code+'">'+n.name+'</option>');
							}
							
							option.data("opData",n)
							$(ele).append(option);
						});
						budgetObj.codeList = data.data;
					}
					
				}
			});
		}else{
			var option = $('<option value="0">请选择</option>');
							$(ele).append(option);
			$.each(budgetObj.codeList, function(i,n) {
				
				if(selectData==n.code){
					option = $('<option value="'+n.code+'" selected="selected">'+n.name+'</option>');	
				}else{
					option = $('<option value="'+n.code+'">'+n.name+'</option>');
				}
				option.data("opData",n)
				$(ele).append(option);
			});
		}
		
	},getCodeList:function (obj){
		var opData = $(obj).parent().prev().prev().find("select option:selected").data("opData");
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
					if(data.data.length==0){
						$('.page1').hide();
						//拼接暂无数据效果
						htmlTbody.append(beforeApproList.noDataTrStr(6));	
					}else{
						$.each(data.data.rows,function (i,n){
							htmlTbody.append('<tr> <td>'+n.code+'</td> <td>'+n.name+'</td> </tr>');
						});
					}
					
				}
				
			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},/**
	 * 
	 * 获取顶部tab标签数据
	 * 
	 */
	getHeardTabInfo:function(){
		//选择id
		var tableId = $yt_common.GetRequest().tableId;
		$.ajax({
			type: "post",
			url: 'budget/table/getTabInfo',
			async: false,
			success: function(data) {
				//判断操作是否成功
				if(data.flag == 0) {
                  if(data.data.length>0){
                  	 //清空数据
                     $(".tab-header ul").html('');
                     var liStr;
                     $.each(data.data, function(i,n) {
                     	if(tableId == n.tableId){
                     		liStr = $('<li class="tab-li active-li"><input type="hidden" value="'+n.tableId+'">'+n.tableName+'</li>');
                     		$('.tab-content').eq(i).css("display", 'block').siblings('.tab-content').hide();
                     	}else{
                     		liStr = $('<li class="tab-li"><input type="hidden" value="'+n.tableId+'">'+n.tableName+'</li>');
                     	}
                     	 
                     	 $(".tab-header ul").append(liStr);
                     	 liStr.data("tabData",n);
                     });
                  }
				}else{
					$yt_alert_Model.prompt(data.message,2000);
				}
			}
		});
		if(!tableId){
			$(".tab-header ul li:eq(0)").addClass("active-li"); 
        	$('.tab-content').eq(0).css("display", 'block').siblings('.tab-content').hide();
		}
	},/**
	 * 
	 * 初始获取配置项信息
	 * 
	 */
	getConfigInfo:function(){
		$(".disable-sty").removeClass("disable-sty");
		//获取所属列表
		var tabContent = $(".tab-content").eq($(".tab-header .active-li").index());
		//获取选中的tab表数据
		var selTabData = $(".tab-header ul li.active-li").data("tabData");
		$.ajax({
				type: "post",
				url: 'budget/table/getCongfig',
				async: false,
				data: selTabData ,
				success: function(data) {
					//判断操作是否成功
					if(data.flag == 0) {
                      if(data.data.length>0){
                        $.each(data.data, function(i,n) {
                        	tabContent.find("."+n.rcNum).data("configData",n);
                        	if(n.calcItem == 1){
                        		if(n.type=="r"){
                        			tabContent.find("."+n.rcNum).parent().find("td").addClass("disable-sty");
                        		}else{
                        		 	tabContent.find("tbody tr:gt(0) td:nth-child("+(tabContent.find("."+n.rcNum).index()+1)+")").addClass("disable-sty")
                        		}
                        	}
                        });
                      }
					}else{
						$yt_alert_Model.prompt(data.message,2000);
					}
				}
			});
	},createAttrList:function (obj,configData){
		var attrLength = $(".attributes-list .box-row").length;
		var attrDoc = '<div class="box-row">'+
	  				'<div class="box-content box-lable">'+
	  					'引用字典/预算属性：'+
	  				'</div>'+
	  				'<div class="box-content box-content-read" style="position: relative;">'+
	  					'<select name="" class="yt-select attributes">'+
	  					'</select>'+
	  				'</div>'+
	  				'<div class="box-content box-lable1">'+
	  					'字典编码：'+
	  				'</div>'+
	  				'<div class="box-content box-lable2"><input type="text" value="'+(configData?configData.value:'')+'" class="yt-input word-code" style="width: 130px;cursor: pointer;" readonly="readonly" validform="{isNull:true,msg:\'请选择编码\'}" /><span class="valid-font"></span>'+
	  				'</div>'+
	  				'<div class="box-content box-button">'+
	  					'<button class="yt-option-btn yt-common-btn '+(attrLength==0?'add-attr':"del-attr")+'">'+(attrLength==0?'添加属性':"删除")+'</button>'+
	  				'</div>'+
	  	    	'</div>';
	  	    	attrDoc = $(attrDoc);
	  	    	//初始化下拉列表
	  	    	attrDoc.find(".yt-select").change(function (){
	  	    		$(this).parent().next().next().find("input").val("");
	  	    		if($(this).val()=="0"){
	  	    			$(this).parent().next().next().find("input").removeAttr("validform");
	  	    		}else{
	  	    			$(this).parent().next().next().find("input").attr("validform","{isNull:true,msg:'请选择编码'}");
	  	    		}
	  	    	});
	  	    	budgetObj.getAttrList(attrDoc.find(".yt-select"),configData?configData.property:"");
	  	    	attrDoc.find(".yt-select").niceSelect();
	  	    	//绑定删除方法
	  	    	attrDoc.find(".del-attr").click(function (){
	  	    		$(this).parent().parent().remove();
	  	    	});
	  	    	if(attrLength==0){
	  	    		attrDoc.find(".add-attr").click(function (){
	  	    		budgetObj.createAttrList(obj)
	  	    	});
	  	    	}
	  	    	budgetObj.selectCode(attrDoc.find(".word-code"));
	  	    	
	  	    	$(obj).find('.attributes-list').append(attrDoc);
	},setFormData:function (obj,parent){
		//回写表单数据
		var configData = $(obj).data("configData");
		console.log(configData);
		if(configData){
			//是否为计算项
			if(configData.calcItem==1){
				$(parent).find(".is-calculation").parent().addClass("check");
				$(parent).find(".is-calculation").attr("checked", true);
				$(parent).find(".formual").css("display","table-cell");
				$(parent).find(".formual input").val(configData.calcValue).attr("validform","{isNull:true,blurFlag:true,msg:'请输入计算公式'}");;
			}
			//属性列表
			if(configData.propertyList.length>0){
				$.each(configData.propertyList, function(i,n) {
					budgetObj.createAttrList($(parent),n);
				});
			}else{
				budgetObj.createAttrList($(parent));
			}
		}else{
			budgetObj.createAttrList($(parent));
		}
		
	}
}

$(function(){
	budgetObj.init();
	budgetObj.eventFun();
});

