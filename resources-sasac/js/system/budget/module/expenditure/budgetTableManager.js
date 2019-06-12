var budgetTableManager = {
	init: function() {
		//下拉框初始化
		$("select").niceSelect();
		//初始化日期控件
		$('#budgetYearInput').calendar({
			speed: 0,
			dateFmt: "yyyy",
			nowData: true
		});
		//点击出现弹出框方法
		$('.add-budget-year').click(function() {
			budgetTableManager.clickYearButton();
		});
		//决定基础配置按钮是否能点击
		//		var btnText = $(".budget-state").text();
		//		if (btnText == '编制阶段') {
		//			
		//		} else{
		//			
		//		}
		//获取预算年度
		budgetTableManager.getBudgetYear();
		//初始化预算单位
		budgetTableManager.getUtilName();
	},
	//获取预算年度
	getBudgetYear: function() {
		$.ajax({
			type: "post",
			url: "budget/bm/getBooksYear",
			async: true,
			success: function(data) {
				var datas = data.data;
				if(data.flag == 0) {
					//1.遍历数据,给select赋值 
					$.each(datas, function(i, n) {
						$('select.budget-year').append('<option value="' + n.booksYear + '">' + n.booksYear + '</option>');
					});
					//select初始化
					$("select.budget-year").niceSelect();
					//调用查询预算列表数据方法
					budgetTableManager.divPage($(".budget-year").val());
					//预算年度切换事件
					$("select.budget-year").change(function() {
						//获取选择后的值
						var thisYear = $(this).val();
						//调用查询预算列表数据方法
						budgetTableManager.divPage(thisYear);
					});
				}
			}
		});
	},
	//初始化预算单位
	getUtilName: function() {
		$.ajax({
			type: "post",
			url: $yt_option.base_path + 'budget/table/getBudgetClassifyDataByParams?tableKey=coso_classify_unit_main', //ajax访问路径  
			async: false,
			data: {},
			success: function(data) {
				var datas = data.data.rows;
				if(data.flag == 0) {
					//初始设置select
					var numOptions = '<option value="">请选择</option>';
					//判断返回的数据
					$('#professional').empty();
					//非空状态下拼接
					if(datas.length > 0 && datas != undefined && datas != null) {
						//1.遍历数据,给select赋值 
						$.each(datas, function(i, n) {
							numOptions += '<option value="' + n.code + '" sel-val="' + n.name + '">(' + n.num + ')' + n.name + '</option>'
						});
						//添加值
						$('#professional').append(numOptions);
					}
					//初始化select
					$('#professional').niceSelect();
				}
			}
		});
	},
	//获取列表
	/**
	 * div添加
	 * @param {Object} property
	 */
	divPage: function(budgetYear) {
		$.ajax({
			type: "post",
			url: "budget/bm/getBooksList",
			async: true,
			data: {
				booksYear: budgetYear
			},
			success: function(data) {
				var datas = data.data;
				//获取需要添加数据的div
				var htmlDiv = $('.plan-list');
				//清空
				htmlDiv.empty();
				var dStr = "";
				if(data.flag == 0) {
					var datas = data.data;
					//循环遍历拼接数据
					$.each(datas, function(i, n) {
						dStr += '<div class="plan-list-item" booksId="' + n.booksId + '">' +
							'<span class="plan-list-title span-font-bold">单位预算表（' + n.booksYear + '）</span>' +
							'<div class="title-line">' +
							'<div></div>' +
							'</div>' +
							'<table style="border: 0px;" class="plan-list-table">' +
							'<tbody>' +
							'<tr>' +
							'<td style="width: 90px;" class="span-font-bold"><span style="letter-spacing:5px;">预算年</span>度：</td>' +
							'<td class="budget-annual">' + n.booksYear + '</td>' +
							'</tr>' +
							'<tr>' +
							'<td style="width: 90px;" class="span-font-bold"  valign="top"><span style="letter-spacing:5px;">预算单</span>位：</td>' +
							'<td class="budget-unit" unitNum="' + n.unitNum + '">(' + n.unitAsNum + ')' + n.unitName + '</td>' +
							'</tr>' +
							'<tr>' +
							'<td style="width: 90px;" class="span-font-bold"><span style="letter-spacing:43px;">状</span>态：</td>' +
							'<td class="budget-state" state="' + n.state + '">' + n.stateName + '</td>' +
							'</tr>' +
							'</tbody>' +
							'</table>' +
							'<div class="button-box">' +
							'<button class="yt-option-btn yt-common-btn check-details" style="margin-left: 35px;">查看详情</button>';
						//判断状态1 编制准备 2编制阶段 3 执行阶段 4执行完成
						if(n.state == 3 || n.state == 4) {
							dStr += '<button class="yt-option-btn yt-cancel-btn basis-set" style="margin-left: 35px; color:#bbbbbb;" disabled="disabled">基础设置</button>';
						} else {
							dStr += '<button class="yt-option-btn yt-cancel-btn basis-set" style="margin-left: 35px;">基础设置</button>';
						}
						dStr += '</div>' +
							'</div>';
						//存储年度数据对象
						dStr = $(dStr).data("yearData", n);
						htmlDiv.append(dStr);
					});
					//基础配置点击方法
					budgetTableManager.basisClick();
					//查看详情点击方法
					budgetTableManager.detailsClick();
				}else{
					//提示信息
					$yt_alert_Model.prompt(data.message);
				}
			}
		});
	},
	//创建年度预算按钮
	clickYearButton: function() {
		//调用公用的显示弹出框方法
		sysCommon.showModel($("#budgetAlert"));
		/** 
		 * 点击取消方法 
		 */
		$('#budgetAlert.yt-edit-alert .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
			//初始化数据
			budgetTableManager.clearAlert($("#budgetAlert"));
			//清空日期验证信息
			sysCommon.clearValidInfo($("#budgetYearInput"));
			//清空单位验证信息
			sysCommon.clearValidInfo($(".professional-select"));
			//隐藏页面中自定义的表单内容
			$("#budgetAlert.yt-edit-alert,#heard-nav-bak").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
		//点击确定
		$('#budgetAlert .yt-model-sure-btn').off().on('click', function() {
			var valid = $yt_valid.validForm($("#budgetAlert"));
			if(valid) {
				//预算年度
				var budgetYearInput = $('#budgetYearInput').val();
				//预算单位
				var professional = $("#professional").val();
				$.ajax({
					type: "post",
					url: "budget/bm/createBooksInfo",
					async: true,
					data: {
						booksYear: budgetYearInput,
						unitNum: professional
					},
					success: function(data) {
						var datas = data.data;
						if(data.flag == 0) {
							//提示信息
							$yt_alert_Model.prompt('创建年度预算成功');
							//调用公用的关闭弹出框方法
							sysCommon.closeModel($("#budgetAlert"));
							//调用遍历方法
							budgetTableManager.divPage($(".budget-year").val());
							//初始化下拉框数据
							budgetTableManager.getBudgetYear();
						} else {
							//提示信息
							$yt_alert_Model.prompt('创建年度预算重复');
						}
						//弹出框初始化
						budgetTableManager.clearAlert($("#budgetAlert"));
						//清空日期验证信息
						sysCommon.clearValidInfo($("#budgetYearInput"));
						//清空单位验证信息
						sysCommon.clearValidInfo($(".professional-select"));
					}
				});
			}
		});
	},
	//基础配置点击方法
	basisClick: function() {
		$('.button-box').on('click', '.basis-set', function() {
			//获取预算年度对象
			var booksObj = $(this).parents(".plan-list-item").data("yearData");
			//基础设置跳转页面
			var pageUrl = "view/system-sasac/budget/module/expenditure/budgetTableStyle.html?booksId=" + booksObj.booksId; //即将跳转的页面路径
			window.location.href = $yt_option.websit_path + pageUrl;
		});
	},
	//查看详情点击方法
	detailsClick: function() {
		$('.button-box').on('click', '.check-details', function() {
			//获取预算年度对象
			var booksObj = $(this).parents(".plan-list-item").data("yearData");
			//基础设置跳转页面
			var pageUrl = "view/system-sasac/budget/module/expenditure/budgetCheckDetails.html?booksId=" + booksObj.booksId +"&booksYear=" + booksObj.booksYear; //即将跳转的页面路径
			window.location.href = $yt_option.websit_path + pageUrl;
		});
	},
	/**
	 * 清空表单内数据
	 * @param {Object} obj
	 */
	clearAlert: function(obj) {
		//取得所有select
		var selects = obj.find('select');
		//循环重置
		$.each(selects, function(i, n) {
			$(n).find('option:eq(0)').attr('selected', true);
		});
		selects.niceSelect();
		//输入框
		var inputs = obj.find('input:not(input[type="radio"],input[type="checkbox"])');
		inputs.val('');
		//单选
		var radios = obj.find('input[type="radio"]');
		$.each(radios, function(i, n) {
			$(n).setRadioState('uncheck');
		});
		//复选
		var checks = obj.find('input[type="checkbox"]');
		$.each(checks, function(i, n) {
			$(n).setCheckBoxState('uncheck');
		});
		//文本域
		var textareas = obj.find('textarea');
		textareas.val('');
	},
}
$(function() {
	budgetTableManager.init();
})