var budgetReport = {
	booksId:'',//预算年度ID
	booksObj:'',//预算年度对象
	deptNum:0,//部门总数量
	init: function() {
		//初始化下拉框
		$("select").niceSelect();
		//获取页面跳转传输的参数对象
		var requerParameter = $yt_common.GetRequest();
		//获取传输的预算年度ID并赋值给全局变量
		budgetReport.booksId = requerParameter.booksId;
		if(budgetReport.booksId && budgetReport.booksId !=undefined && budgetReport.booksId !=""){
			//调用获取预算年度信息方法
			budgetReport.getBudgetYearInfoById(budgetReport.booksId);
		}
		//时间控件初始化
		$('#endTop').calendar({  
			speed: 0, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			readonly: true, // 目标对象是否设为只读，默认：true     
			nowData:false,//默认选中当前时间,默认true  
			hmsDefVal:true,//时分秒的默认值23:59:59
			dateFmt:"yyyy-MM-dd HH:mm:ss",  
			callback: function() { // 点击选择日期后的回调函数  
			    //alert("您选择的日期是：" + $("#txtDate").val());  
			    $("#endTop").removeClass("valid-hint");
			    $("#endTop").next().next().text("");
			}
		});
		//调用获取发布列表数据方法
		budgetReport.getPublishTableList();
	},
	/**
	 * 
	 * 初始事件方法
	 * 
	 */
	initEvent:function(){
	  /**
	   * 
	   * 
	   * 点击发布按钮操作事件
	   * 
	   */
	  $("#submitPayment").click(function(){
	  	 var  thisBtn = $(this);
	  	 //验证截止日期必填
	  	 var  validFlag = $yt_valid.validForm($("#budgetReport"));
	  	 if(validFlag){
	  	 	 //设置禁用
		  	 $(this).attr('disabled', true);
		  	 //调用获取列表数据方法
		  	 var  publishDatas = budgetReport.getPublishInfo();
		  	  $.ajax({
				type: 'post',
				url: 'budget/publish/savePublishBudgetInfo',
				data:publishDatas,
				async: false,
				success: function(data) {
					//解除按钮禁用
					$(thisBtn).attr('disabled', true);
					$yt_alert_Model.prompt(data.message);
					if(data.flag == 0) {
						//解除按钮禁用
						$(thisBtn).attr('disabled', true);
						//发布成功回到预算基础配置页面
						window.location.href = $yt_option.websit_path+'view/system-sasac/budget/module/expenditure/budgetTableStyle.html?booksId='+budgetReport.booksObj.booksId;
					}
				},error:function(e){
					//解除按钮禁用
					$(thisBtn).attr('disabled',true);
				}
			});
	  	 }else{
	  	 	//sysCommon.pageToScroll($("#budgetReport .valid-font"));
	  	 	$yt_alert_Model.prompt("请选择编制提交截止时间");
	  	 }
	  });
	  /**
	   * 
	   * 切换阶段事件
	   * 
	   */
	  $("select.budget-year").change(function(){
	  	//调用获取列表数据方法
	  	budgetReport.getPublishTableList();
	  });
	  
      /**
       * 
       * 点击取消按钮操作事件
       * 
       */
      $("#cancelBtn").click(function(){
      	window.location.href = $yt_option.websit_path+'view/system-sasac/budget/module/expenditure/budgetTableStyle.html?booksId='+budgetReport.booksObj.booksId;
      });
	},
	/**
	 * 
	 * 
	 * 获取列表发布信息数据
	 * 
	 */
	getPublishInfo:function(){
		//新增的数据集合
		var addDataList = [];
		var addDataJson = "";
		//修改数据集合
		var updateDataList = [];
		var updateDataJson = "";
		//删除的数据信息
		var deletePublishTableIdStr = "";
		/**
		 * 
		 * 遍历列表中的数据部门复选框
		 * 
		 */
		$(".publish-table tbody tr").each(function(){
			$(this).find(".check-label-div ul li .yt-checkbox:not(.last-parent-check)").each(function(){
				var thisChecobox = $(this);
				//判断是否被选中
				if($(this).hasClass("check")){
					//判断是否包含初始获取列表选中的部门对象信息
					if($(this).data("checkDept") && $(this).data("checkDept") !=undefined && $(this).data("checkDept") !=""){
						//存储修改的部门数据
						updateDataList.push({
							publishTableId:$(thisChecobox).data("checkDept").publishTableId,//发布表Id
							deptId:$(thisChecobox).find("input").val(),//部门Id
							tableId:$(thisChecobox).parents("tr").data("tableInfo").tableId//预算表Id
						});
					}else{
						//存储新增的部门数据
						addDataList.push({
							deptId:$(thisChecobox).find("input").val(),
							tableId:$(thisChecobox).parents("tr").data("tableInfo").tableId
						});
					}
				}else{
					//判断是否包含初始获取列表选中的部门对象信息
					if($(this).data("checkDept") && $(this).data("checkDept") !=undefined && $(this).data("checkDept") !=""){
						//获取删除的数据
						deletePublishTableIdStr += $(thisChecobox).data("checkDept").publishTableId+",";
					}
				}
			});
		});
		//获取到新增的部门集合转json
		if(addDataList.length > 0){
			addDataJson = JSON.stringify(addDataList);
		}
		//获取修改的部门集合转json
		if(updateDataList.length > 0){
			updateDataJson = JSON.stringify(updateDataList);
		}
		//截取删除
		if(deletePublishTableIdStr != ""){
			deletePublishTableIdStr = deletePublishTableIdStr.substring(deletePublishTableIdStr.length-1,0);
		}
		return {
			budgetStage:$("select.budget-year").val(),	//预算阶段	不能为空
			submitDeadline:$("#endTop").val(),	//编制提交截止时间
			booksId:budgetReport.booksId,	//年度预算Id
			deletePublishTableIdStr:deletePublishTableIdStr,//删除的发布表Id字符串	多个用逗号分隔,如”1,2,3”
			addDataJson:addDataJson,	//新增的数据json串
			updateDataJson:updateDataJson	//修改的数据json串
		}
	},
	/**
	 * 
	 * 
	 * 获取发布信息
	 * 
	 * 
	 */
	getPublishTableList:function(){
		//获取选中的阶段
		var budgetStage = $("select.budget-year").val();
		$.ajax({
			type: 'post',
			url: 'budget/publish/getPublishBudgetTableList',
			data:{
				booksId:budgetReport.booksId,
				budgetStage:budgetStage
			},
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					//初始化清空
					$("table.publish-table tbody").empty();
					var  trStr = "";
					//判断集合是否有数据
					if(data.data.length > 0){
						//拼接部门信息
						//调用获取所有部门信息方法
						var allDeptInfoList = budgetReport.getDeptInfoListFun();
						//遍历发布表格的数据
						$.each(data.data, function(i,n) {
						  trStr = '<tr>'
						        +'<td style="text-align: left;" class="first"><span>'+n.tableCode+'</span></td>'
						        +'<td class="table-name"><div>'+n.tableName+'</div></td>'
								+'<td style="text-align: left;">'+n.budgetTypeName+'</td>'
								+'<td class="last"><div class="check-label-div"><ul>'
								+'<li><label class="check-label yt-checkbox last-parent-check"><input class="last-all-check" type="checkbox" name="test" value=""/>全部</label></li>';
								//遍历所有的部门信息拼接数据
								if(allDeptInfoList.length >0){
									var  deptStrCheck = "";
									var  deptStrDef = "";
									$.each(allDeptInfoList, function(i,d) {
										//判断类型是部门的获取
										if(d.type == 2){
											//比对加上选中
											trStr += '<li>'
									        +'<label class="check-label yt-checkbox"><input class="" type="checkbox" name="test" value="'+d.id+'"/>'+d.text+'</label>'
									        +'</li>'; 
										}
									});
								}
								trStr +='</ul></div></td>';
								//存储data
								trStr = $(trStr).data("tableInfo",n);
						  $("table.publish-table tbody").append(trStr);
						});
						//调用部门全选方法
						budgetReport.setTdAllCheck();
						//调用筛选选中的部门方法
						budgetReport.checkDeptSel();
					}else{
						//拼接无数据方法
						$("table.publish-table tbody").append(sysCommon.noDataTrStr(4));
					}
				}
			}
		});
	},
	/**
	 * 
	 * 选中部门集合筛选
	 * 
	 */
	checkDeptSel:function(){
		//遍历所有的行
		$("table.publish-table tbody tr").each(function(i,n){
			//判断如果选中的部门数量等于所有部门的数量,则选中全选
			if($(n).data("tableInfo").checkDeptList.length == budgetReport.deptNum){
				$(n).find('.yt-checkbox.last-parent-check input').prop("checked","checked").parent().addClass("check");
			}
			//得到行存储的表格数据遍历,选中的部门集合
			$.each($(n).data("tableInfo").checkDeptList,function(i,t){
				//比对行下面所有的部门复选框找到对应的选中
				$(n).find('.yt-checkbox input[value ='+t.deptId+']').prop("checked","checked").parent().data("checkDept",t).addClass("check");
			});
		});
	},
	/**
	 * 
	 * 获取部门信息
	 * 
	 */
	getDeptInfoListFun:function(){
		//自动以变量
		var  allDeptInfoList = "";
		$.ajax({
			type: 'post',
			url: 'user/userInfo/getAllDeptsInfo',
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					   //获取数据赋值
					   allDeptInfoList = data.data;
					   //循环遍历赋值
					   $.each(data.data, function(i,n) {
					   	  if(n.type == "2"){
					   	  	budgetReport.deptNum+=1;
					   	  }
					   });
					}
				}
		});
		//返回所有值
		return allDeptInfoList;
	},
	//参与编制处室全选
	setTdAllCheck: function() {
		//全选  
		$(".last-parent-check").change(function() {
			//判断自己是否被选中  
			if($(this).hasClass("check")) {
				//设置反选  
				$(this).parents(".check-label-div").setCheckBoxState("unCheckAll");
				//设置当前行的表格取消选中
				$(this).parents("tr").find("input.budget-check").setCheckBoxState("unCheck");
			} else {
				//调用设置选中方法,全选  
				$(this).parents(".check-label-div").setCheckBoxState("checkAll");
			}
		});
		/* 
		 *  
		 * 表格中复选框操作 
		 *  
		 */
		//获取区域复选框数量,用来比较  
		var tableCheckLen = $(this).parent("label.yt-checkbox").length;
		//表格中除last-parent-check外复选框change事件
		$(".check-label-div").find(".yt-checkbox:not(.last-parent-check)").off().on("change", function() {
			//判断当前点击的是否有check类
			if($(this).hasClass("check")) {
				//设置当前复选框选中  
				$(this).find("input").setCheckBoxState("unCheck");
				//取消全选  
				$(this).parents(".check-label-div").find(".last-all-check").prop("checked", false).setCheckBoxState("uncheck");
			}else{
				//设置当前复选框选中  
				$(this).find("input").setCheckBoxState("check");
				//比对选中的复选框数量和区域内复选框数量  
				if($(this).parents(".check-label-div").find("label.yt-checkbox.check").length == tableCheckLen) {
					//设置反选  
					$(this).parents(".check-label-div").find(".last-all-check").prop("checked", true).setCheckBoxState("check");
				}
			}
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
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					if(data.data){
						//全局变量赋值
						budgetReport.booksObj = data.data;
						//部门预算表年度
						$(".year").text(data.data.booksYear);
					}
				}
			}
		});
	}
}
$(function() {
	budgetReport.init();
	//调用初始化事件方法
	budgetReport.initEvent();
})