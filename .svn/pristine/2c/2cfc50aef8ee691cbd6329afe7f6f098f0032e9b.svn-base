var budgetReport = {
	init: function() {
		//给当前页面设置最小高度
		$("#budgetReport").css("min-height", $(window).height() - 12);
		//初始化下拉框
		$("select").niceSelect();
		//单选按钮触发事件
		$(".budget-radio .yt-radio input").change(function() {
			//调用查询预算列表数据方法
			budgetReport.tablePage($(".budget-year").val());
		});
		//重写选中变色方法
		$(".yt-table .yt-tbody").on("click", " tr", function() {
			$(".yt-table .yt-tbody tr.yt-table-active").removeClass("yt-table-active");
			$(this).addClass("yt-table-active");
			var trData = $(this).data("tableData");
			//判断选中表类型是查询表类型,禁用汇总编制按钮
			if(trData.budgetType == "A04"){
				$("button.budget-organ").attr("disabled","disabled").addClass("yt-btn-disabled");
			}else{
				$("button.budget-organ").attr("disabled",false).removeClass("yt-btn-disabled");
			}
		});
		//获取预算年度
		budgetReport.getBudgetYear();
		//调用点击顶部按钮方法
		budgetReport.clickBudgetOrgan();
	},
	//点击顶部按钮
	clickBudgetOrgan: function() {
		//点击编辑汇总按钮
		$(".budget-organ").click(function() {
			var  thisTr = $(".publish-table tbody tr.yt-table-active");
			//获取点击变色行数
			var selTrLen = $(".publish-table tbody tr.yt-table-active").length;
			//如果为0提示选择
			if(selTrLen == 0) {
				$yt_alert_Model.prompt("请选择一行数据进行操作");
			} else {
				//[预算编制]：解锁各处室提交的数据
				var  validFalg = budgetReport.checkEditorStateByTable();
				if(validFalg){
					var  tableId = $(thisTr).data("tableData").tableId;
					//阶段信息
					var budgetStage =  $(thisTr).data("tableData").budgetStage;
					//跳转编辑预算表数据页面
					window.location.href = $yt_option.websit_path + "view/system-sasac/budget/module/expenditure/budgetPrepare.html?tableId=" + tableId + "&budgetStage=" + budgetStage;
				}
			}
		});
		/**
		 * 
		 * 点击汇总信息预览按钮
		 * 
		 */
		$("button.preview-btn").click(function(){
			var  thisTr = $(".publish-table tbody tr.yt-table-active");
			//获取点击变色行数
			var selTrLen = $(".publish-table tbody tr.yt-table-active").length;
			//如果为0提示选择
			if(selTrLen == 0) {
				$yt_alert_Model.prompt("请选择一行数据进行操作");
			} else {
				//获取当前选中行的数据
				//表Id
				var  tableId = $(thisTr).data("tableData").tableId;
				//阶段信息
				var budgetStage =  $(thisTr).data("tableData").budgetStage;
				//跳转至汇总信息预览页面
				$yt_baseElement.openNewPage(2,"view/system-sasac/budget/module/expenditure/summaryPreview.html?tableId="+tableId+'&budgetStage='+budgetStage);
			}
		});
		/**
		 * 
		 * 点击导出编制汇总按钮
		 * 
		 */
		$("button.export-budget-organ").on('click', function() {
			//判断是否有选中行
			if($("tr.yt-table-active").length == 0) {
				$yt_alert_Model.prompt("请选择一行数据进行操作");
				return false;
			}else{
				//[预算编制]：解锁各处室提交的数据
				var  validFalg = budgetReport.checkEditorStateByTable();
				if(validFalg){
					//获取当前选中行的数据集
					var trData = $("tr.yt-table-active").data("tableData");
					//配置统一参数
					var yitianSSODynamicKey  = $yt_baseElement.getToken();
					window.location.href = $yt_option.base_path + 'gzw/budget/excel/exportTotalAuditToExcel?tableId=' + trData.tableId + '&budgetStage='+trData.budgetStage+"&yitianSSODynamicKey="+yitianSSODynamicKey+"&ajax=1";
				}
				
			}
		});
		/**
		 * 
		 * 点击导出编制处室按钮
		 * 
		 */
		$("button.export-dept-organ").click(function(){
			//判断是否有选中行
			if($("tr.yt-table-active").length == 0) {
				$yt_alert_Model.prompt("请选择一行数据进行操作");
				return false;
			}else{
				//获取当前选中行的数据集
				var trData = $("tr.yt-table-active").data("tableData");
				//[预算编制]：解锁各处室提交的数据
				var  validFalg = budgetReport.checkEditorStateByTable();
				//判断是不是查询表
				if(trData.budgetType == "A04"){
					$yt_alert_Model.prompt("该表格为查询表，无法导出各处室预算表");
					return false;
				}else{
					if(validFalg){
						//配置统一参数
						var yitianSSODynamicKey  = $yt_baseElement.getToken();
						window.location.href = $yt_option.base_path + 'gzw/budget/excel/exportOfficeBudgetToExcel?tableId=' + trData.tableId + '&budgetStage='+trData.budgetStage+"&yitianSSODynamicKey="+yitianSSODynamicKey+"&ajax=1";
					}
				}
			}
		});
	},
	//[预算编制]：解锁各处室提交的数据
	checkEditorStateByTable: function() {
		var  validFlag = false;
		//阶段
		var budgetStage = $(".budget-radio .yt-radio input:checked").val();
		//获取当前选中行数据
		var tableData = $(".publish-table tbody tr.yt-table-active").data("tableData");
		$.ajax({
			type: "post",
			url: "budget/editor/checkEditorStateByTable",
			async: false,
			data: {
				budgetStage: budgetStage,
				tableId: tableData.tableId
			},
			success: function(data) {
				if(data.flag == 0) {
					validFlag = true;
				} else {
					//提示信息
					$yt_alert_Model.prompt(data.message);
				}
			}
		});
		return validFlag;
	},
	//获取预算年度
	getBudgetYear: function() {
		$.ajax({
			type: "post",
			url: "budget/appMain/getBudgetYearInfo",
			async: true,
			success: function(data) {
				var datas = data.data;
				if(data.flag == 0) {
					//1.遍历数据,给select赋值 
					$.each(datas, function(i, n) {
						$('select.budget-year').append('<option value="' + n.budgetYear + '">' + n.budgetYear + '</option>');
					});
					$("select.budget-year").niceSelect();
					//调用查询预算列表数据方法
					budgetReport.tablePage($(".budget-year").val());
					//预算年度切换事件
					$("select.budget-year").change(function() {
						var thisYear = $(this).val();
						//调用查询预算列表数据方法
						budgetReport.tablePage(thisYear);
					});
				}
			}
		});
	},
	/**
	 * 是否锁定点击
	 * @param {Object} property
	 */
	imgLockClick: function() {
		$(".check-input-div").on("click", ".img-lock-click", function() {
			//获取自定义属性stage
			var stage = $(this).attr('stage');
			if(stage == '1') {
				//获取自定义属性publishTableId
				var publishTableId = $(this).attr('publishTableId');
				//获取自定义属性tableId
				var tableId = $(this).attr('tableId');
				//调用  [预算编制]：解锁各处室提交的数据  方法并传参
				budgetReport.setLockStateByDisable(tableId, publishTableId, $(this));
			} else {
				//提示信息
				$yt_alert_Model.prompt("已解锁，无法重复解锁");
			}
		});
	},
	//[预算编制]：解锁各处室提交的数据
	setLockStateByDisable: function(tableId, publishTableId, thisImg) {
		//阶段
		var budgetStage = $(".budget-radio .yt-radio input:checked").val();
		$.ajax({
			type: "post",
			url: "budget/editor/setLockStateByDisable",
			async: true,
			data: {
				budgetStage: budgetStage,
				tableId: tableId,
				publishTableId: publishTableId
			},
			success: function(data) {
				if(data.flag == 0) {
					//改变路径
					thisImg.attr("src", '../../../../../resources-sasac/images/common/unlock.png');
					//改变自定义属性
					thisImg.attr("stage", '2');
					//提示信息
					$yt_alert_Model.prompt(data.message);
				}
				$yt_alert_Model.prompt(data.message);
			}
		});
	},
	/**
	 * 
	 * 获取部门信息
	 * 
	 */
	getDeptInfoListFun: function() {
		var allDeptInfoList = "";
		$.ajax({
			type: 'post',
			url: 'user/userInfo/getAllDeptsInfo',
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					//获取数据
					allDeptInfoList = data.data;
					$.each(data.data, function(i, n) {
						if(n.type == "2") {
							//							budgetReport.deptNum += 1;
						}
					});
				}
			}
		});
		return allDeptInfoList;
	},
	/**
	 * table分页
	 * @param {Object} property
	 */
	tablePage: function(budgetYear) {
		//获取单选按钮数据
		//阶段
		var budgetStage = $(".budget-radio .yt-radio input:checked").val();
		$.ajax({
			type: "post",
			url: "budget/editor/getTotalPublishBudgetTableList", //ajax访问路径  budget/editor/getTotalPublishBudgetTableList
			async: true,
			data: {
				budgetStage: budgetStage,
				budgetYear: budgetYear
			},
			success: function(data) {
				var htmlTbody = $('.publish-table .yt-tbody');
				htmlTbody.empty();
				var trStr = "";
				if(data.flag == 0) {
					var datas = data.data;
					//调用获取所有部门信息方法
					var allDeptInfoList = budgetReport.getDeptInfoListFun();
					if(datas.length > 0) {
						$.each(datas, function(i, n) {
							trStr += '<tr>' +
								'<td class="first">' + n.tableCode + '</td>' +
								'<td style="">' + n.budgetTypeName + '</td>' +
								'<td style="text-align: left;">' + n.tableName + '</td>' +
								'<td class="last">' +
								'<div class="check-label-div">';
							if(allDeptInfoList.length > 0) {
								$.each(allDeptInfoList, function(i, d) {
									//判断类型是部门的获取
									if(d.type == 2) {
										//比对加上选中
										trStr += '<div class="check-input-div">' +
											'<label class="check-label yt-checkbox"><input class="" type="checkbox" name="test" value="' + d.id + '" disabled="disabled"/>' + d.text + '</label>' +
											'</div>';
									}
								});
							}
							trStr += '</div>' +
								'</td>' +
								'<td style="text-align: right;" title="' + n.submitRemainTime + '">' + (n.submitRemainTimeShort == "" ?"--" : n.submitRemainTimeShort) + '</td>' +
								'<td>' + (n.lastOperatorDateTime.substring(0, n.lastOperatorDateTime.length - 3) || '--') + '</td>' +
								'<td lastOperatorUserCode="' + n.lastOperatorUserCode + '">' + (n.lastOperatorUserName || '--') + '</td>' +
								'</tr>';
							trStr = $(trStr).data("tableData", n);
							htmlTbody.append(trStr);
						});
						//是否锁定点击
						budgetReport.imgLockClick();
						//调用筛选选中的部门方法
						budgetReport.checkDeptSel();
					} else {
						$('.before-table-page').hide();
						//拼接暂无数据效果
						htmlTbody.html(sysCommon.noDataTrStr(9));
					}
				} else {
					$('.before-table-page').hide();
					//拼接暂无数据效果
					htmlTbody.html(sysCommon.noDataTrStr(9));
					//提示信息	
					$yt_alert_Model.prompt(data.message);
				}
			}
		});
	},
	/**
	 * 
	 * 选中部门集合筛选
	 * 
	 */
	checkDeptSel: function() {
		//遍历所有的行
		$("table.publish-table tbody tr").each(function(i, n) {
			//得到行存储的表格数据遍历,选中的部门集合
			$.each($(n).data("tableData").checkDeptList, function(i, d) {
				//比对行下面所有的部门复选框找到对应的选中
				$(n).find('.yt-checkbox input[value =' + d.deptId + ']').prop("checked", "checked").parent().data("checkDept", d).addClass("check");
			});
		});
		//遍历锁定状态
		$("table.publish-table tbody tr .check-input-div .yt-checkbox.check").each(function(i, n) {
			var checkDept = $(n).data("checkDept");
			var imgSrc = "";
			if(checkDept.lockState == "1") {
				imgSrc = "../../../../../resources-sasac/images/common/lock.png";
				//路径为锁定图
			} else {
				imgSrc = "../../../../../resources-sasac/images/common/unlock.png";
			}
			var imgLabel = '<img publishTableId="' + checkDept.publishTableId + '" tableId="' + checkDept.tableId + '" stage="' + (checkDept.lockState == "1" ? "1" : "2") + '" class="img-lock-click" src="' + imgSrc + '"/>';
			$(n).after(imgLabel);
		});
		budgetReport.imgLockClick();
	},
}
$(function() {
	budgetReport.init();
})