var  executeQueryObj ={
	//初始化
	init:function(){
		//初始化下拉列表
		$("select").niceSelect();
		//设置子页面的高度
		$("#executeQuery").css("min-height",$(window).height()-55+"px");
		//调用获取预算年度数据方法
		executeQueryObj.getQueryParamData();
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
					executeQueryObj.getBudgetDataInfo($("select.budget-year-sel option:selected").text());
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
						{title:'预算科目',field:'specialName',width:'25%',align:'center'},
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
					    	    var planStr = '<div class="plan-div" style="background: #c2c1c1;width: 100%;">'
					    	                + '<div class="plan-div percentExecute" style="background: blue;width:'+row.percentExecute+'"></div>'
					    	                + '<div class="plan-div percentUnExecute" style="background: orange;width:'+row.percentUnExecute+'"></div>'
					    	                +'</div>';
								return planStr;
							}
					    }
					    ]]
				});
});
