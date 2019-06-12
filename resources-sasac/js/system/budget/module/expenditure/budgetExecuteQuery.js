var  executeQueryObj ={
	//初始化
	init:function(){
		//初始化下拉列表
		//$("select").niceSelect();
		//设置子页面的高度
		$("#executeQuery").css("min-height",$(window).height()-55+"px");
		//调用获取预算年度数据方法
		executeQueryObj.getQueryParamData();
		//判断如为会领导，财务显示单位整体，否则则不显示
		if ($yt_common.user_info.deptId == 80 || $yt_common.user_info.deptId == 73) {
			$('.unit-none-lable').show();
			$('.unit-none-lable').removeClass('lable-my-id');
		} else{
			$('.unit-none-lable').hide();
			$('.unit-none-lable').addClass('lable-my-id');
		}
		//初始化下拉列表
		$("select").niceSelect();
	},
	/**
	 * 
	 * 
	 * 获取预算年度数据
	 * 
	 */
	getQueryParamData:function(){
		//获取预算年度
		$.ajax({
			type: "post",
			url: "budget/main/getBudgetYear",
			async: true,
			success: function(data) {
				if(data.flag == 0){
					$("select.budget-year-sel").empty();
					var optionStr = '';
					$.each(data.data, function(i,n) {
						optionStr += '<option value="'+(i+1)+'">'+n.budgetYear+'</option>';
					});
					$("select.budget-year-sel").append(optionStr);
					$("select.budget-year-sel").niceSelect();
					//调用查询预算列表数据方法
					executeQueryObj.getBudgetDataInfo($("select.budget-year-sel option:selected").text());
					//预算年度切换事件
					$("select.budget-year-sel").change(function(){
						var  thisYear = $(this).find("option:selected").text();
						//调用查询预算列表数据方法
						executeQueryObj.getBudgetDataInfo(thisYear,$("select.unit-sel").val());
					});
				}
			}
		});
		//获取部门信息
		$.ajax({
			type: "post",
			url: "user/userInfo/getAllDeptsInfo",
			async: true,
			success: function(data) {
				if(data.flag == 0){
					//获取部门List
					var list = data.data || [];
					$("select.unit-sel").empty();
					var optionStr = '<option value="">全部</option>';
					if(list.length > 0){
						$.each(list,function(i,n) {
							//判断组织类型,是否公司 1是 2不是
							if(n.type == "2"){
								optionStr += '<option value="'+ n.id +'">'+ n.text +'</option>';
							}
						});
					}
					$("select.unit-sel").append(optionStr).niceSelect();
					//调用查询预算列表数据方法
					//executeQueryObj.getBudgetDataInfo($("select.budget-year-sel option:selected").text());
					//单位整体切换事件
					$("select.unit-sel").change(function(){
						var  thisUnit = $(this).val();
						//调用查询预算列表数据方法
						executeQueryObj.getBudgetDataInfo($("select.budget-year-sel option:selected").text(),thisUnit);
					});
				}
			}
		});
	},
	/**
	 * 获取预算列表数据
	 * @param {Object} yearVal 预算年度
	 * @param {Object} unitVal 单位
	 */
	getBudgetDataInfo:function(yearVal,unitVal){
		yearVal = (yearVal == undefined ? "" : yearVal);
		unitVal = (unitVal == undefined ? "" : unitVal);
		if ($('.unit-none-lable').hasClass('lable-my-id')) {
			unitVal = $yt_common.user_info.deptId;
		}
		$.ajax({
			type: "post",
			url: "budget/main/getBudgetExecuteTableDataInfo",
			async: true,
			data:{
				budgetYear:yearVal,
				deptId:unitVal
			},
			success: function(data) {
				if(data.flag == 0){
				 var  datas = executeQueryObj.getTreeData(data.data,'-1',"specialCode","parentCode");
				$('#budgetTab').treegrid("loadData",datas);
		
				}else{
					$yt_alert_Model.prompt(data.message);
				}
			}
		});
		
	},
	/**
	 * 属性返回数据转换
	 * @param {Object} data 返回数据集
	 * @param {Object} parentId 父级ID
	 */
	getTreeData:function (data,parentId,code,parentCode){
		code = code?code:'id';
		parentCode = parentCode?parentCode:'parentId';
		var me = this;
	    var result = [] , temp;
	    for(var i in data){
	        if(data[i][parentCode]==parentId){
	            result.push(data[i]);
	            temp = me.getTreeData(data,data[i][code],code,parentCode);           
	            if(temp.length>0){
	                data[i].children=temp;
	            }           
	        }       
	    }
	    return result;
	},
	/**
	 * 
	 * 提示信息方法
	 * 
	 */
	initQtip:function(){
		//注意：以下配置参数如无特别说明均为默认，使用时只需配置相关参数即可  
        $('.qtip-lable').qtip({  
            // 默认为事件触发时加载，设置为true时，会在页面加载时加载提示 类型：boolean，true, false (默认: false)  
            // prerender: false,  
            // 为提示信息设置id，如设置为myTooltip就可以通过ui-tooltip-myTooltip访问这个提示信息  类型:"String", false (默认: false)  
            // id: false,  
            // 每次显示提示都删除上一次的提示  类型：boolean，true, false (默认: true)  
            // overwrite: true,  
            // 通过元素属性创建提示  如a[title]，把原有的title重命名为oldtitle  类型：boolean，true, false (默认: true)  
            // suppress: true,  
            // 内容相关的设置     
            content: {  
                // 提示信息的内容，如果只设置内容可以直接 content: "提示信息"，而不需要 content: { text: { "提示信息" } }    
                text: function(event,api) {
					var thisObj = $(this);
					var execute = $(this).attr("execute-data");
					var unExecute = $(this).attr("un-execute-data");
					var showText = '<div style="width:160px;color:#666;">'+'<div><div class="qtip-yuan-div" style="background: blue;"></div><span>已执行</span><span  style="margin-left:10px;">'+execute+'</span></div>' 
					            +'<div><div class="qtip-yuan-div" style="background: orange;"></div><span>待执行</span><span  style="margin-left:10px;">'+unExecute+'</span></div>' 
					            +'</div>';
					return showText;
                },
            },
            // 位置相关的设置    
            position: {  
                my: 'top center',
				at: 'top center',
				container: false,
				viewport: $('body'),
				adjust: {
					x: 0,
					y: 10,
					//是否在鼠标悬停时提示 true, false (默认: true)
					mouse: true,
					//是否可以调整提示信息的位置
					resize: true,
					method: 'flip flip'
				},
            },  
            // 隐藏提示的相关设置  参考show  
            hide: {  
                /*在提示框显示时可以进行交互*/
				fixed: true,
			/*	event:"click"*/
            },  
            // 样式相关    
            style: {  
                /*自定义的类样式*/
				classes: 'showmod',
				/*tip插件，箭头相关设置*/
				tip: {
					corner: true,
					mimic: false,
					width: 10,
					height: 10,
					border: true,
					offset: 0
				}
            },  
            // 事件对象确定绑定到工具提示的初始事件处理程序  
            events: {  
                show:function (data){
					$(data.target).find(".qtip-content").css("max-height",$('#frame-right-model').height()-200);
				}
            }  
        }); 
	},
	/**
	 * 
	 * 事件初始化
	 * 
	 */
	eventInit:function(){
	}
}
$(function(){
	//调用初始化方法
	executeQueryObj.init();
	$('#budgetTab').treegrid({
				    idField:'specialCode',
				    treeField:'specialName',
				    columns:[[
						{title:'预算科目',field:'specialName',width:'25%',align:'center',
							formatter:function(value, row, index,num){
								return '<span class="tree-title" style="" title="'+ value +'">'+ value +'</span>';
							}
						},
						{title:'预算额(万元)',field:'totalAmount',width:'15%',align:'center',
						    formatter:function(value, row, index,num){
								return '<span style="float: right;display: inline;">'+(value == "" ? "0.00" : $yt_baseElement.fmMoney(value))+'</span>';
							}
						},
						{title:'已执行预算额(万元)',field:'executeAmount',width:'15%',align:'center',
						 	formatter:function(value, row, index,num){
								return '<span style="float: right;display: inline;">'+(value == "" ? "0.00" : $yt_baseElement.fmMoney(value))+'</span>';
							}
						},
						{title:'预算与已执行的差额(万元)',field:'differenceAmount',width:'15%',align:'center',
						 	formatter:function(value, row, index,num){
								return '<span style="float: right;display: inline;">'+(value == "" ? "0.00" : $yt_baseElement.fmMoney(value))+'</span>';
							}
						}
					    ,{title:'待执行预算额(万元)',field:'unExecuteAmount',width:'15%',align:'center',
					     	formatter:function(value, row, index,num){
								return '<span style="float: right;display: inline;">'+(value == "" ? "0.00" : $yt_baseElement.fmMoney(value))+'</span>';
							}
					    }
					    ,{title:'执行进度',field:'percentExecute',width:'16%',align:'center',
					    formatter:function(value, row, index,num){
					    	    var planStr = '<div class="plan-div qtip-lable" style="background: #c2c1c1;width: 100%;" execute-data="'+row.percentExecute+'" un-execute-data="'+row.percentUnExecute+'">'
					    	                + '<div class="plan-div percentExecute" style="background: blue;width:'+row.percentExecute+'"></div>'
					    	                + '<div class="plan-div percentUnExecute" style="background: orange;width:'+row.percentUnExecute+'"></div>'
					    	                +'</div>';
								return planStr;
							}
					    }
					    ]],//当数据加载成功时触发。
					   	onLoadSuccess:function(){
					    	//调用显示提示框方法
							executeQueryObj.initQtip();
							//去除easyUI左侧文件夹图标
							$(".tree-icon").removeClass("tree-folder tree-folder-open tree-folder-closed");
					    }
				});
});
