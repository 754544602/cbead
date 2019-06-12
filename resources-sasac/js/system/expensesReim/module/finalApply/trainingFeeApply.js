var personnelFunds = {
	riskViaImg: "../../../../../resources-sasac/images/common/risk-via.png", //风险通过图片绿灯
	trainingDay: 0, //培训天数
	stayDays: 0, //住宿天数
	hotCityList:'',//热门城市
	addressList: '', //全局的地址集合
	tabIndex: 0, //获取当前操作的弹窗
	thisPopM: '', //当前弹窗对象
	lectureId: 1, //自增的讲师id
	//初始化金额方法
	initMoney: function() {
		//获取类名为.moneyText的对象集合
		var moneyTextList = $(".moneyText");
		//遍历集合并设置金额格式
		moneyTextList.each(function() {
			var thisObj = $(this);
			if(thisObj.text()) {
				thisObj.text($yt_baseElement.fmMoney(thisObj.text()));
			}
		});
		//获取类名为.moneyInput的对象集合
		var moneyInputList = $(".moneyInput");
		//遍历集合并设置金额格式
		moneyInputList.each(function() {
			var thisObj = $(this);
			if(thisObj.val()) {
				thisObj.val($yt_baseElement.fmMoney(thisObj.val()));
			}
			thisObj.focus(function() {
				var thisInput = $(this);
				if(thisInput.val()) {
					thisInput.val($yt_baseElement.rmoney(thisInput.val()));
				}
			});
			thisObj.blur(function() {
				var thisInput = $(this);
				if(thisInput.val()) {
					thisInput.val($yt_baseElement.fmMoney(thisInput.val()));
				}
			});
		});

		//.弹窗的培训费其他tab中，“小计”字段变成自动计算可修改，计算公式：小计=标准*人数*天数
		$('.standard-money,.people-num,.day-num').on('blur', function() {
			//标准
			var standard = $yt_baseElement.rmoney($('input.standard-money').val() || '0');
			//人数
			var people = Number($('input.people-num').val() || '0');
			//天数
			var day = Number($('input.day-num').val() || '0');
			//计算小计
			var count = standard * people * day;
			//赋值
			$('input.smallplan-money').val($yt_baseElement.fmMoney(count || '0'));
		});
		//.弹窗的预计收入费用tab中，“小计”字段变成自动计算可修改，计算公式：小计=标准*人数/1.03
		$('.predict-standard-money,.predict-people-num').on(
				'blur',
				function() {
					//标准
					var standard = $yt_baseElement.rmoney($(
							'input.predict-standard-money').val()
							|| '0');
					//人数
					var people = Number($('input.predict-people-num').val() || '0');
					//计算小计
					var count = standard * people /1.03;
					//赋值
					$('input.predict-smallplan-money').val(
							$yt_baseElement.fmMoney(count || '0'))
//							$('input.predict-people-num').val('1');
				});

	},
	//初始化日期控件并计算
	getData: function() {
		//开始日期
		$("#startTimeTop").calendar({
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $("#endTimeTop"), //开始日期最大为结束日期 
			speed: 0,
			callback: function() {
				//调用公用的清除验证信息方法
				sysCommon.clearValidInfo($("#startTimeTop"));
				//开始日期
				var tdStartDate = $("#startTimeTop").val();
				//结束日期
				var tdEndDate = $('#endTimeTop').val();
				//1. 把开始时间和结束时间保存
				var dateFrom = new Date(tdStartDate);
				var dateTo = new Date(tdEndDate);
				if(tdStartDate != "" && tdEndDate != "") {
					//2. 计算时间差
					var diff = dateTo.valueOf() - dateFrom.valueOf();
					//3. 时间差转换为天数
					var diff_day = parseInt(diff / (1000 * 60 * 60 * 24));
					//计算会期
					$("#calculationSession").css("color", "#333333").val(diff_day + 1);
					$("#calculationSession").removeClass("calculation-Identification");
				}
			}
		});
		//离开日期
		$("#endTimeTop").calendar({
			nowData: false, //默认选中当前时间,默认true  
			lowerLimit: $("#startTimeTop"), //结束日期最小为开始日期  
			speed: 0,
			callback: function() {
				//调用公用的清除验证信息方法
				sysCommon.clearValidInfo($("#endTime"));
				//入住日期
				var tdStartDate = $("#startTimeTop").val();
				//结束日期
				var tdEndDate = $('#endTimeTop').val();
				//1. 把开始时间和结束时间保存
				var dateFrom = new Date(tdStartDate);
				var dateTo = new Date(tdEndDate);
				if(tdStartDate != "" && tdEndDate != "") {
					//2. 计算时间差
					var diff = dateTo.valueOf() - dateFrom.valueOf();
					//3. 时间差转换为天数
					var diff_day = parseInt(diff / (1000 * 60 * 60 * 24));
					//计算会期
					$("#calculationSession").css("color", "#333333").val(diff_day + 1);
					$("#calculationSession").removeClass("calculation-Identification");
				}
			}
		});
	},
	init: function() {
		//获取数据字典
		personnelFunds.getCostActivityPro();
		//其他费用名称
		personnelFunds.getDictTypeByTypeCode();
		/** 
		 * 金额文本框获取焦点事件 
		 */
		$(".standard-money,.smallplan-money").on("focus", function() {
			if($(this).val() != "") {
				//调用还原格式化的方法  
				$(this).val($yt_baseElement.rmoney($(this).val()));
			}
		});
		/** 
		 * 金额文本框失去焦点事件 
		 */
		$(".standard-money,.smallplan-money").on("blur", function() {
			if($(this).val() != "") {
				//调用格式化金额方法  
				$(this).val($yt_baseElement.fmMoney($(this).val()));
			}
		});
		/** 
		 * 预计收入费用金额文本框获取焦点事件 
		 */
		$(".predict-standard-money,.predict-smallplan-money").on("focus", function() {
			if ($(this).val() != "") {
				$(this).val($yt_baseElement.rmoney($(this).val()))
			}
		});
		/** 
		 * 预计收入费用金额文本框失去焦点事件 
		 */
		$(".predict-standard-money,.predict-smallplan-money").on("blur", function() {
			if ($(this).val() != "") {
				$(this).val($yt_baseElement.fmMoney($(this).val()))
			}
		});
		
		//页面数据初始化
		//$(".costTotal").text($yt_baseElement.fmMoney('0'));
		personnelFunds.tabIndex = $(".train-district .tab-check").index();
		personnelFunds.thisPopM = $(".train-district .tab-info").eq(personnelFunds.tabIndex);
		//添加按钮绑定限定事件
		$("#addTraining").click(function() {
			if($("#trainingPopTable .yt-table .yt-tbody tr").size() < 1) {
				personnelFunds.trainingPopModel();
			} else {
				$yt_alert_Model.prompt("最多添加一条培训信息");
			}
		});
		//为费用申请的新增按钮添加事件
		$("#addCostAppBtn").click(function() {
			if($('#lecturerTable table tbody tr').length > 0) {
//				personnelFunds.initModel();
				//设置tab
				personnelFunds.initPopMTab();
				//初始化表单selsect
				personnelFunds.initLecturerSelect();
				personnelFunds.costPopModelAddOrUp();

			} else {
				//提示添加讲师信息
				$yt_alert_Model.prompt('请添加讲师信息');
			}

		});
		//为培训费其他的新增按钮添加事件
		$("#addTrainingOther").click(function() {
			/*
			 * 添加培训费其他
			 */
			$('#oherTrainingAlert.yt-edit-alert .yt-eidt-model-bottom .yt-model-sure-btn').off().on("click", function() {
				var isFalse = $yt_valid.validForm($("#trainingFeePopM"));
				if(isFalse) {
					personnelFunds.addOtherTrainingList();
				}
			});
			personnelFunds.showOtherAlert();
		});
		//为预计收入费用的新增按钮添加事件
		$("#addPredictCostBtn").click(function() {
			/*
			 * 预计收入费用
			 */
			
			$('#predictCostAlert.yt-edit-alert .yt-eidt-model-bottom .yt-model-sure-btn').off().on("click", function() {
				var isFalse = $yt_valid.validForm($("#predictCostPopM"));
				if(isFalse) {
					personnelFunds.addPredictCostList();
				}
			});
			personnelFunds.showPredictCostAlert();
			
			var trainOfNum = $("#trainOfNum").val();//学员人数
			var chargeStandard = $("#chargeStandard").val();//收费标准
			var total = $yt_baseElement.rmoney(chargeStandard)*Number(trainOfNum)/1.03;
			var thisTbody = $("#predictCostTable .yt-tbody");
			var len = thisTbody.children().length;
			if( trainOfNum && chargeStandard && len == 1){
				$("#predictCostPopM .cost-name").val("培训费");//费用名称赋值
				$("#predictCostPopM .predict-standard-money").val(chargeStandard);//标准
				$("#predictCostPopM .predict-people-num").val(trainOfNum);//人数
				$("#predictCostPopM .predict-smallplan-money").val($yt_baseElement.fmMoney(total));//小计
			}
		});
		//关闭弹出框表单
		$("#model-canel-btn,#costPopModel .closed-span").click(function() {
			//调用关闭可编辑弹出框方法
			sysCommon.closeModel($("#costPopModel"));
			//调用公共用的清空表单数据方法
			sysCommon.clearFormData();
		});
		//初始化日期控件
		$("#trainingReportDate").calendar({
			controlId: "trd",
			upperLimit: $("#trainingEndingDate"), //开始日期最大为结束日期  
			speed: 0, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			//lowerLimit:"2010/01/01", // 日期下限，默认：NaN(不限制)     
			nowData: false, //默认选中当前时间,默认true 
			speed: 0,
			dateFmt: "yyyy-MM-dd",
			callback: function() { // 点击选择日期后的回调函数  
				//alert("您选择的日期是：" + $("#txtDate").val());  
				$("#trainingReportDate").parent().find(".risk-img").attr("src", personnelFunds.riskViaImg);
				//清空验证提示信息
				sysCommon.clearValidInfo($("#trainingReportDate"));
				//计算日期差
				if($("#trainingReportDate").val() && $("#trainingEndingDate").val()) {
					personnelFunds.trainingDay = personnelFunds.GetDateDiff($("#trainingReportDate").val(), $("#trainingEndingDate").val(), "day") + 1;
					$("#trainingDay").text(personnelFunds.trainingDay);
				}
			}
		});
		$("#trainingEndingDate").calendar({
			controlId: "ted",
			lowerLimit: $("#trainingReportDate"), //结束日期最小为开始日期 
			speed: 0, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			//		    lowerLimit:"2010/01/01", // 日期下限，默认：NaN(不限制)     
			nowData: false, //默认选中当前时间,默认true 
			speed: 0,
			dateFmt: "yyyy-MM-dd",
			callback: function() { // 点击选择日期后的回调函数  
				//alert("您选择的日期是：" + $("#txtDate").val());  
				$("#trainingEndingDate").parent().find(".risk-img").attr("src", personnelFunds.riskViaImg);
				//清空验证提示信息
				sysCommon.clearValidInfo($("#trainingEndingDate"));
				//计算日期差
				if($("#trainingReportDate").val() && $("#trainingEndingDate").val()) {
					personnelFunds.trainingDay = personnelFunds.GetDateDiff($("#trainingReportDate").val(), $("#trainingEndingDate").val(), "day") + 1;
					$("#trainingDay").text(personnelFunds.trainingDay);
				}
			}
		});
		$("#startTime").calendar({
			controlId: "st",
			upperLimit: $("#endTime"), //开始日期最大为结束日期  
			speed: 0, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			//lowerLimit:"2010/01/01", // 日期下限，默认：NaN(不限制)     
			nowData: false, //默认选中当前时间,默认true 
			speed: 0,
			dateFmt: "yyyy-MM-dd",
			callback: function() { // 点击选择日期后的回调函数  
				//alert("您选择的日期是：" + $("#txtDate").val());  
				$("#startTime").parent().find(".risk-img").attr("src", personnelFunds.riskViaImg);
				//清空验证提示信息
				sysCommon.clearValidInfo($("#startTime"));
				//计算日期差
				if($("#startTime").val() && $("#endTime").val()) {
					var trainingDay = personnelFunds.GetDateDiff($("#startTime").val(), $("#endTime").val(), "day") + 1;
					//$("#trainingDay").text(trainingDay+"天");
				}
			}
		});
		$("#endTime").calendar({
			controlId: "et",
			lowerLimit: $("#startTime"), //结束日期最小为开始日期 
			speed: 0, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			//		    lowerLimit:"2010/01/01", // 日期下限，默认：NaN(不限制)     
			nowData: false, //默认选中当前时间,默认true 
			speed: 0,
			dateFmt: "yyyy-MM-dd",
			callback: function() { // 点击选择日期后的回调函数  
				//alert("您选择的日期是：" + $("#txtDate").val());  
				$("#endTime").parent().find(".risk-img").attr("src", personnelFunds.riskViaImg);
				//清空验证提示信息
				sysCommon.clearValidInfo($("#endTime"));
				//计算日期差
				if($("#startTime").val() && $("#endTime").val()) {
					var trainingDay = personnelFunds.GetDateDiff($("#startTime").val(), $("#endTime").val(), "day") + 1;
					//$("#trainingDay").text(trainingDay+"天");
				}
			}
		});
		$("#checkInDate").calendar({
			controlId: "cd",
			upperLimit: $("#leaveDate"), //开始日期最大为结束日期  
			speed: 0, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			//lowerLimit:"2010/01/01", // 日期下限，默认：NaN(不限制)     
			nowData: false, //默认选中当前时间,默认true 
			speed: 0,
			dateFmt: "yyyy-MM-dd",
			callback: function() { // 点击选择日期后的回调函数  
				//alert("您选择的日期是：" + $("#txtDate").val());  
				$("#checkInDate").parent().find(".risk-img").attr("src", personnelFunds.riskViaImg);
				//清空验证提示信息
				sysCommon.clearValidInfo($("#checkInDate"));
				//计算日期差
				if($("#checkInDate").val() && $("#leaveDate").val()) {
					personnelFunds.stayDays = personnelFunds.GetDateDiff($("#checkInDate").val(), $("#leaveDate").val(), "day");
					$("#stayDays").text(personnelFunds.stayDays);
					var avgCost = 0;
					var stayCost = personnelFunds.thisPopM.find(".stayCost").val();
					if(stayCost) {
						if($("#stayDays").text() == 0) {
							avgCost = +$yt_baseElement.rmoney(personnelFunds.thisPopM.find(".stayCost").val());
						} else {
							avgCost = +$yt_baseElement.rmoney(personnelFunds.thisPopM.find(".stayCost").val()) / personnelFunds.thisPopM.find("#stayDays").text();
						}
					}
					personnelFunds.thisPopM.find(".avgCost").text($yt_baseElement.fmMoney(avgCost));
				}
			}
		});
		$("#leaveDate").calendar({
			controlId: "ld",
			lowerLimit: $("#checkInDate"), //结束日期最小为开始日期 
			speed: 0, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			//		    lowerLimit:"2010/01/01", // 日期下限，默认：NaN(不限制)     
			nowData: false, //默认选中当前时间,默认true 
			speed: 0,
			dateFmt: "yyyy-MM-dd",
			callback: function() { // 点击选择日期后的回调函数  
				//alert("您选择的日期是：" + $("#txtDate").val());  
				$("#leaveDate").parent().find(".risk-img").attr("src", personnelFunds.riskViaImg);
				//清空验证提示信息
				sysCommon.clearValidInfo($("#leaveDate"));
				//计算日期差
				if($("#checkInDate").val() && $("#leaveDate").val()) {
					personnelFunds.stayDays = personnelFunds.GetDateDiff($("#checkInDate").val(), $("#leaveDate").val(), "day");
					$("#stayDays").text(personnelFunds.stayDays);
					var avgCost = 0;
					var stayCost = personnelFunds.thisPopM.find(".stayCost").val();
					if(stayCost) {
						if($("#stayDays").text() == 0) {
							avgCost = +$yt_baseElement.rmoney(personnelFunds.thisPopM.find(".stayCost").val());
						} else {
							avgCost = +$yt_baseElement.rmoney(personnelFunds.thisPopM.find(".stayCost").val()) / personnelFunds.thisPopM.find("#stayDays").text();
						}
					}
					personnelFunds.thisPopM.find(".avgCost").text($yt_baseElement.fmMoney(avgCost));
				}
			}
		});

		//表单加入列表
		$("#model-add-list-btn").click(function() {
			if($(this).hasClass("save")) {
				var tabIndex = $(".train-district .cost-type-tab li.tab-check").index();
				var trHtml = '';
				switch(tabIndex) {
					case 0:
						var pAmount = $(".pAmount").val();
						var pDay = $(".pDay").val();
						var pNum = $(".pNum").val();
						var pAverage = $(".pAverage").text();
						trHtml = '<tr>' +
							'<td>' + pAmount + '</td>' +
							'<td>' + pDay + '</td>' +
							'<td>' + pNum + '</td>' +
							'<td>' + pAverage + '</td>' +
							'<td>' +
							'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>' +
							'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>' +
							'</td></tr>';
						break;
					case 1:
						var name = $(".teacher-name").val();
						var title = $(".title-select option:selected").text();
						var costAmount = $(".cost-amount").val();
						var hoursVal = $(".hours-val").val()
						trHtml = '<tr>' +
							'<td>' + name + '</td>' +
							'<td>' + title + '</td>' +
							'<td>' + costAmount + '</td>' +
							'<td>' + hoursVal + '</td>' +
							'<td></td>' +
							'<td>' +
							'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>' +
							'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>' +
							'</td></tr>';
						break;
					case 2:
						var reimReason = $('#reimReason').val();
						var stateDate = $("#traffic-start-time").val();
						var endDate = $("#traffic-end-time").val();
						var fromcity = $("#fromcity").val();
						var tocity = $("#tocity").val();
						var trafficTool = $(".traffic-tool option:selected").text();
						var cityCost = $(".city-cost-input").val();
						var specialRemark = $("#special-remark").val();

						trHtml = '<tr>' +
							'<td><span>' + reimReason + '</span></td><td></td>' +
							'<td data-text="goTime">' + stateDate + '</td><td data-text="goAddress">' + fromcity + '</td><td data-text="arrivalTime">' + endDate + '</td>' +
							'<td data-text="arrivalAddress">' + tocity + '</td>' + '<td><span>' + trafficTool + '</span>' +
							'<input class="hid-child-code" type="hidden" value=""/></td>' +
							'<td class="font-right money-td" data-text="crafare">' + cityCost + '</td>' +
							'<td class="text-overflow-sty" title="" data-text="remarks">' + (specialRemark == '' ? '无' : specialRemark) + '</td>' +
							'<td>' +
							'<input type="hidden" class="hid-set-met" data-val="setMethod"/>' +
							'<input type="hidden" class="hid-cost-type" value="0"/>' +
							'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>' +
							'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>' +
							'</td></tr>';
						break;
					default:
						break;
				}

				trHtml = $(trHtml);
				//绑定点击删除事件
				trHtml.find(".operate-del").click(function() {
					var thisObj = $(this);
					$yt_alert_Model.alertOne({
						alertMsg: "确定要删除此条数据吗?", //提示信息  
						leftBtnName: "确定",
						confirmFunction: function() { //点击确定按钮执行方法  
							//判断表格中除去,合计行和公务卡行
							if(thisObj.parents("tbody").find("tr:not(.total-last-tr)").length == 1) {
								thisObj.parents("tbody").empty();
							}

							//删除当前行
							thisObj.parents("tr").remove();
							personnelFunds.updateTotalNum();
						}
					});
				});
				trHtml.find(".operate-update").click(function() {
					var modelIndex = $(this).parents(".traffic-cost-model").index();
					$(".train-district .tab-info").hide().eq(modelIndex).show();
					$(".train-district .cost-type-tab li").removeClass("tab-check").eq(modelIndex).addClass("tab-check");
					$(".train-district .tab-top").show();
					$("#model-add-list-btn").removeClass("save").addClass("update").text("保存");
					//调用 显示费用明细弹出框方法
					sysCommon.showModel($("#costPopModel"));
				});
				$(".traffic-cost-model").eq(tabIndex).find(".yt-tbody").append(trHtml);
			} else {

			}

			personnelFunds.updateTotalNum();
			//调用关闭可编辑弹出框方法
			sysCommon.closeModel($("#costPopModel"));
			//调用公共用的清空表单数据方法
			sysCommon.clearFormData();

		});
		//tab切换方法
		$(".train-district .cost-type-tab li").click(function() {
			//判断当前操作标签如果不是0
			var thisObj = $(this);
			//取消首个tab表单的验证
			if( /*thisObj.index() != 0*/ true) {
				//验证是否添加了讲师信息
				if($("#lecturerTable .yt-tbody tr").size() > 0) {
					//设置弹窗显示内容
					thisObj.addClass("tab-check").siblings().removeClass("tab-check");
					personnelFunds.tabIndex = thisObj.index();
					personnelFunds.thisPopM = $(".train-district .tab-info").eq(personnelFunds.tabIndex);
					$(".train-district .tab-info").hide().eq(personnelFunds.tabIndex).show();
					//调用弹窗
					personnelFunds.costPopModel();
					//初始化讲师select
					personnelFunds.initLecturerSelect();
				} else {
					//初始化讲师select
					personnelFunds.initLecturerSelect();
					//提示信息
					$yt_alert_Model.prompt("请添加讲师信息");
				}
			} else {
				//如果当前tab为0，直接设置显示
				thisObj.addClass("tab-check").siblings().removeClass("tab-check");
				personnelFunds.tabIndex = thisObj.index();
				//				alert(personnelFunds.tabIndex);
				personnelFunds.thisPopM = $(".train-district .tab-info").eq(personnelFunds.tabIndex);
				$(".train-district .tab-info").hide().eq(personnelFunds.tabIndex).show();
				personnelFunds.costPopModel();
			}
			//初始化模态框数据
			personnelFunds.initModel();
			//计算弹窗位置
			$yt_alert_Model.getDivPosition($("#costPopModel"));
		});
		//初始化下拉列表

		$('.train-district select').niceSelect();
		//绑定计算日均消费
		$(".pAmount,.pDay,.pNum").blur(function() {
			if($(".pAmount").val() != "" && $(".pDay").val() != "" && $(".pNum").val() != "") {
				var average = parseFloat($(".pAmount").val()) / parseFloat($(".pDay").val()) / parseFloat($(".pNum").val());
				$(".pAverage").text(isNaN(average) ? "" : average);
			}

		});
		//附件删除
		$('.file-name-list').on('click', '.del-file', function() {
			var ithis = $(this);
			ithis.parent().remove();
		});
		//初始化金额
		personnelFunds.initMoney();

		//初始化弹窗数据
		personnelFunds.initModel($("#trainingPopModel,#lecturerPopModel,#costPopModel,#trainingPopModel"));

		//表格内修改删除
		personnelFunds.setTableOperaEvent();
		
		personnelFunds.getData();

		/*
		 * 点击培训费其他取消方法
		 */
		$('#oherTrainingAlert.yt-edit-alert .yt-eidt-model-bottom .yt-model-canel-btn,#oherTrainingAlert .closed-span').off().on("click", function() {
			//调用关闭可编辑弹出框方法
			sysCommon.closeModel($("#oherTrainingAlert"));
			//调用公共用的清空表单数据方法
			sysCommon.clearFormData();
			$("#trainingFeePopM textarea").val("");
		});
		/*
		 * 点击新增/修改预计收入费用信息关闭方法
		 */
		$('#predictCostAlert.yt-edit-alert .yt-eidt-model-bottom .yt-model-canel-btn,#predictCostAlert .closed-span').off().on("click", function() {
			//调用关闭可编辑弹出框方法
			sysCommon.closeModel($("#predictCostAlert"));
			//调用公共用的清空表单数据方法
			sysCommon.clearFormData();
			$("#predictCostPopM textarea").val("");
		});
		//培训其他列表修改
		$("#trainingFeeTable").on('click', '.operate-update', function() {
			var thisObj = this;
			var thisTr = $(thisObj).parents('tr');
			//调用当前操作关联弹窗方法
			//			personnelFunds.handlePopMShow(thisTr);
			/*获取数据	/	赋值*/
			var costname = $(thisTr).find(".cost-name").text();
			var standardmoney = $(thisTr).find(".standard-money").text();
			var peoplenum = $(thisTr).find(".people-num").text();
			var daynum = $(thisTr).find(".day-num").text();
			var smallplanmoney = $(thisTr).find(".smallplan-money").text();
			var specialinstruct = $(thisTr).find(".special-instruct").text();
			specialinstruct = specialinstruct == '无' ? '' : specialinstruct;
			var costNameVal = $(thisTr).attr('costNameVal');
			//隐藏input讲师val
			var lecturerNameVal = $(thisTr).find(".lectureId").val();
			//显示窗口
			personnelFunds.showOtherAlert();
			//获取讲师select数据
			personnelFunds.initLecturerSelect();
//						$('#trainingFeePopM select.cost-name option[value="' + lecturerNameVal + '"]').attr("selected", "selected");
			$('#trainingFeePopM').find('select.cost-name option[value="' + costNameVal + '"]').attr("selected", true);
			$("#trainingFeePopM").find("select.cost-name").niceSelect();
			$('#trainingFeePopM').find('.standard-money').val(standardmoney);
			$('#trainingFeePopM').find('.people-num').val(peoplenum);
			$('#trainingFeePopM').find('.day-num').val(daynum);
			$('#trainingFeePopM').find('.smallplan-money').val(smallplanmoney);
			$('#trainingFeePopM').find('.specialInstruct').val(specialinstruct);

			$('#oherTrainingAlert.yt-edit-alert .yt-eidt-model-bottom .yt-model-sure-btn').off().on("click", function() {
				personnelFunds.addOtherTrainingList(thisTr);
			});
		});
		
		//预计收入费用列表修改
		$("#predictCostTable").on('click', '.operate-update', function() {
			var thisObj = this;
			var thisTr = $(thisObj).parents('tr');
			//调用当前操作关联弹窗方法
			//			personnelFunds.handlePopMShow(thisTr);
			/*获取数据	/	赋值*/
			var costname = $(thisTr).find(".cost-name").text();
			var standardmoney = $(thisTr).find(".predict-standard-money").text();
			var peoplenum = $(thisTr).find(".predict-people-num").text();
			var smallplanmoney = $(thisTr).find(".predict-smallplan-money").text();
			var specialinstruct = $(thisTr).find(".special-instruct").text();
			specialinstruct = specialinstruct == '无' ? '' : specialinstruct;
			//隐藏input讲师val
			var lecturerNameVal = $(thisTr).find(".lectureId").val();
			//显示窗口
			personnelFunds.showPredictCostAlert();
			$('#predictCostPopM').find('.cost-name').val(costname);
			$("#predictCostPopM").find("select.cost-name").niceSelect();
			$('#predictCostPopM').find('.predict-standard-money').val(standardmoney);
			$('#predictCostPopM').find('.predict-people-num').val(peoplenum);
			$('#predictCostPopM').find('.predict-smallplan-money').val(smallplanmoney);
			$('#predictCostPopM').find('.specialInstruct').val(specialinstruct);

			$('#predictCostAlert.yt-edit-alert .yt-eidt-model-bottom .yt-model-sure-btn').off().on("click", function() {
				personnelFunds.addPredictCostList(thisTr);
			});
		});
	},
	
	addOtherTrainingList: function(tr) {
		//点击添加方法 
		//验证只能添加一条培训信息
		if( /*$("#trainingFeeTable .yt-tbody tr").size() < 1*/ true) {
			//获取数据
			/*费用名称*/
			var costName = $("#trainingFeePopM .cost-name option:selected").text();
			var costNameVal = $("#trainingFeePopM .cost-name option:selected").val();
			/*标准*/
			var standardMoney = $("#trainingFeePopM .standard-money").val();
			/*人数*/
			var peopleNum = $("#trainingFeePopM .people-num").val();
			/*天数*/
			var dayNum = $("#trainingFeePopM .day-num").val();
			/*小计*/
			var smallplanMoney = $("#trainingFeePopM .smallplan-money").val();
			/*特殊说明*/
			var specialInstruct = $("#trainingFeePopM .specialInstruct").val();
			specialInstruct = specialInstruct == '' ? '无' : specialInstruct;
			/*添加到表格*/
			html = '<tr costNameVal="' + costNameVal + '" pid="">' +
				'<td class="cost-name">' + costName + '</td>' +
				'<td class="moneyText standard-money">' + standardMoney + '</td>' +
				'<td class="people-num">' + peopleNum + '</td>' +
				'<td class="day-num">' + dayNum + '</td>' +
				'<td class="moneyText smallplan-money">' + smallplanMoney + '</td>' +
				'<td class="special-instruct">' + specialInstruct + '</td>' +
				'<td><input type="hidden" class="popM" value="' + personnelFunds.tabIndex + '"/><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
				'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
				'</tr>';

			if(tr) {
				tr.replaceWith(html);
				$yt_alert_Model.prompt("填写的信息已成功加入到列表");
				//隐藏
//				personnelFunds.hideOtherAlert();
			} else {
				$("#trainingFeeTable .yt-tbody .last").before(html);
				$yt_alert_Model.prompt("填写的信息已成功加入到列表");
			}

			var totalAmount = 0;
			$('#trainingFeeTable tbody .smallplan-money').each(function() {
				totalAmount += $yt_baseElement.rmoney($(this).text());
			});
			$('#trainingFeeTable tbody .costTotal').text($yt_baseElement.fmMoney(totalAmount));
			//调用初始化数据方法
			personnelFunds.initModel(personnelFunds.thisPopM);
			//					//隐藏页面中自定义的表单内容  
			//					$("#costPopModel.yt-edit-alert,#heard-nav-bak").hide();
			//					//隐藏蒙层  
			//					$("#pop-modle-alert").hide();
			//计算总金额
			personnelFunds.updateTotalNum();
			//调用公共用的清空表单数据方法
			sysCommon.clearFormData();
			$("#trainingFeePopM select").val("").niceSelect();
			$("#trainingFeePopM textarea").val("");
		} else {
			$yt_alert_Model.prompt("只能添加一条培训信息");
		}
	},
	/*预计收入费用信息*/
	addPredictCostList: function(tr) {
		//点击添加方法 
		if(true) {
			/*费用名称*/
			var costName = $("#predictCostPopM .cost-name").val();
			/*标准*/
			var standardMoney = $("#predictCostPopM .predict-standard-money").val();
			/*人数*/
			var peopleNum = $("#predictCostPopM .predict-people-num").val();
			/*小计*/
			var smallplanMoney = $("#predictCostPopM .predict-smallplan-money").val();
			/*特殊说明*/
			var specialInstruct = $("#predictCostPopM .specialInstruct").val();
			specialInstruct = specialInstruct == '' ? '无' : specialInstruct;
			/*添加到表格*/
			html = '<tr  pid="">' +
				'<td class="cost-name">' + costName + '</td>' +
				'<td class="moneyText predict-standard-money">' + standardMoney + '</td>' +
				'<td class="predict-people-num">' + peopleNum + '</td>' +
				'<td class="moneyText predict-smallplan-money">' + smallplanMoney + '</td>' +
				'<td class="special-instruct">' + specialInstruct + '</td>' +
				'<td><input type="hidden" class="popM" value="' + personnelFunds.tabIndex + '"/><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
				'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
				'</tr>';
			if(tr) {
				tr.replaceWith(html);
				$yt_alert_Model.prompt("填写的信息已成功加入到列表");
				//隐藏
//				personnelFunds.hidePredictCostAlert();
			} else {
				$("#predictCostTable .yt-tbody .last").before(html);
				$yt_alert_Model.prompt("填写的信息已成功加入到列表");
			}

			var totalAmount = 0;
			$('#predictCostTable tbody .predict-smallplan-money').each(function() {
				totalAmount += $yt_baseElement.rmoney($(this).text());
			});
			$('#predictCostTable tbody .costTotal').text($yt_baseElement.fmMoney(totalAmount));
			//调用初始化数据方法
			personnelFunds.initModel(personnelFunds.thisPopM);
			//计算总金额
			personnelFunds.updateTotalNum();
			//调用公共用的清空表单数据方法
			sysCommon.clearFormData();
			$("#predictCostPopM textarea").val("");
		}
	},
	/**
	 * 显示培训费其他弹出框方法
	 */
	showOtherAlert: function() {
		//获取弹框对象
		var alert = $('#oherTrainingAlert');
		sysCommon.showModel(alert);
	},
	/**
	 * 显示预计收入费用信息弹出框方法
	 */
	showPredictCostAlert: function() {
		//获取弹框对象
		var alert = $('#predictCostAlert');
		sysCommon.showModel(alert);
	},
	/**
	 * 隐藏培训费其他弹框
	 */
	hideOtherAlert: function() {
		//获取弹框对象
		var alert = $('#oherTrainingAlert');
		//关闭弹框及蒙层
		$yt_baseElement.hideMongoliaLayer();
		alert.hide();
		$('#pop-modle-alert').hide();
	},
	/**
	 * 隐藏预计收入费用弹框
	 */
	hidePredictCostAlert : function() {
		var alert = $('#predictCostAlert');
		$yt_baseElement.hideMongoliaLayer();
		alert.hide();
		$('#pop-modle-alert').hide()
	},
	/**
	 * 列表内修改删除事件处理
	 */
	setTableOperaEvent: function() {
		//培训信息列表删除
		$("#trainingPopTable").on('click', '.operate-del', function() {
			var thisObj = $(this);
			$yt_alert_Model.alertOne({
				alertMsg: "确定要删除此条数据吗?", //提示信息 
				leftBtnName: "确定",
				confirmFunction: function() { //点击确定按钮执行方法 
					//删除当前行
					thisObj.parents('tr').remove();
					//删除数据
					$("#trainingFeeTable").find(".yt-tbody tr").remove();
					$("#lectureFeeTable,#carFeeTable,#hotelFeeTable,#dietFeeTable").find(".yt-tbody tr:not(:last)").remove();
					//初始化合计金额
					$("#lectureFeeTable,#carFeeTable,#hotelFeeTable,#dietFeeTable").find(".costTotal").text($yt_baseElement.fmMoney('0'));
					$("#lectureFeeTable").find(".costTotal-after").text($yt_baseElement.fmMoney('0'));
					//计算总金额
					personnelFunds.updateTotalNum();
				}
			});
		});
		//培训信息列表修改
		$("#trainingPopTable").on('click', '.operate-update', function() {
			var thisData = this;
			personnelFunds.updateThisTr(thisData, $("#trainingPopTable"));
		});

		//讲师信息列表删除
		$("#lecturerTable").on('click', '.operate-del', function() {
			var thisObj = $(this);
			var thisTr = thisObj.parents('tr');
			var thisId = thisTr.find(".lectureId").val();
			$yt_alert_Model.alertOne({
				alertMsg: "确定要删除此条数据吗?", //提示信息 
				leftBtnName: "确定",
				confirmFunction: function() {
					//删除讲师信息方法
					personnelFunds.deleteLecturerInfo(thisId, thisTr);
				}
			});
		});
		//讲师信息列表修改
		$("#lecturerTable").on('click', '.operate-update', function() {
			var thisObj = this;
			var thisTr = $(thisObj).parents('tr');
			personnelFunds.lecturerPopModel(thisTr);
			//获取表格数据
			var lecturerName = $(thisTr).find(".lecturerName").text();
			var professional = $(thisTr).find(".professional").text();
			professional = professional == '--' ? '请选择' : professional;
			var level = $(thisTr).find(".level").text();
			level = level == '--' ? '请选择' : level;
			//赋值到弹窗
			$("#lecturerPopModel").find("#lecturerName").val(lecturerName);
			$("#lecturerPopModel #professional").find("option:contains('" + professional + "')").attr("selected", true);
			$("#lecturerPopModel #level").find("option:contains('" + level + "')").attr("selected", true);
			//下拉列表初始化完成赋值
			$("#lecturerPopModel #professional,#level").niceSelect();
		});

		//培训费列表删除
		$("#trainingFeeTable").on('click', '.operate-del', function() {
			var thisObj = this;
			var tr = $(this).parents('tr');
			$yt_alert_Model.alertOne({
				alertMsg: "确定要删除此条数据吗?", //提示信息 
				leftBtnName: "确定",
				confirmFunction: function() { //点击确定按钮执行方法 
					//判断表格中除去,合计行和公务卡行
					//if(thisObj.parents("tbody").find("tr:not(.total-last-tr)").length == 1) {
					//	thisObj.parents("tbody").empty();
					//}
					//删除当前行
					tr.remove();
					var sum = 0;
					$("#trainingFeeTable").find("tbody tr:not(.last)").each(function() {
						sum += $yt_baseElement.rmoney($(this).find(".smallplan-money").text());
					});
					$("#trainingFeeTable").find(".costTotal").text($yt_baseElement.fmMoney(sum));
					//计算总金额
					personnelFunds.updateTotalNum();
				}
			});
		});
		//预计收入费用列表删除
		$("#predictCostTable").on('click', '.operate-del', function() {
			var thisObj = this;
			var tr = $(this).parents('tr');
			$yt_alert_Model.alertOne({
				alertMsg: "确定要删除此条数据吗?", //提示信息 
				leftBtnName: "确定",
				confirmFunction: function() { //点击确定按钮执行方法 
					//删除当前行
					tr.remove();
					var sum = 0;
					$("#predictCostTable").find("tbody tr:not(.last)").each(function() {
						sum += $yt_baseElement.rmoney($(this).find(".smallplan-money").text());
					});
					$("#predictCostTable").find(".costTotal").text($yt_baseElement.fmMoney(sum));
					//计算总金额
					personnelFunds.updateTotalNum();
				}
			});
		});
		//培训费列表修改
		//		$("#trainingFeeTable").on('click', '.operate-update', function() {
		//			var thisObj = this;
		//			var thisTr = $(thisObj).parents('tr');
		//			//调用当前操作关联弹窗方法
		////			personnelFunds.handlePopMShow(thisTr);
		//			//获取数据
		//			/*总培训金额*/
		//			$('#trainingTotal').val(thisTr.find(".training-total").text());
		//			//日均：
		//			$('#trainingFeePopM .aupr').text(thisTr.find(".avg").text());
		//			//赋值
		//			/*其他赋值操作*/
		//			
		//			/*
		//			 * 获取
		//			 */
		//			//费用名称
		//			var costName = $("#trainingFeeTable .cost-name").text();
		//			var costCode = thisTr.attr('costnameval');
		//			//标准
		//			var standardMoney = $yt_baseElement.rmoney($("#trainingFeeTable .standard-money").text());
		//			//人数
		//			var standardMoney = $("#trainingFeeTable .people-num").text();
		//			//天数
		//			var standardMoney = $("#trainingFeeTable .day-num").text();
		//			//小计
		//			var standardMoney = $yt_baseElement.rmoney($("#trainingFeeTable .smallplan-money").text());
		//			//特殊说明
		//			var standardMoney = $("#trainingFeeTable .special-instruct").text();
		//			
		//			/*
		//			 * 赋值
		//			 */
		//			//费用名称
		//			$('#trainingFeePopM .cost-name option[value="'+costCode+'"]').attr("selected","selected");
		//			$('#trainingFeePopM .cost-name').niceSelect();
		//			//标准
		//			$('#trainingFeePopM .standard-money').val($yt_baseElement.fmMoney(standardMoney));
		//			//人数
		//			$('#trainingFeePopM .people-num').val(standardMoney);
		//			//天数
		//			$('#trainingFeePopM .day-num').val(standardMoney);
		//			//小计
		//			$('#trainingFeePopM .smallplan-money').val($yt_baseElement.fmMoney(standardMoney));
		//			//特殊说明
		//			$('#trainingFeePopM .specialInstruct').val(standardMoney);
		//			
		//			
		//			//显示窗口
		//			personnelFunds.showOtherAlert();
		//		});

		/*$("#trainingFeeTable .operate-del").click(function() {
			var thisObj = this;
			personnelFunds.deleteThisTr(thisObj);
		});
		$("#trainingFeeTable .operate-update").click(function() {
			var thisObj = this;
			var thisTr = $(thisObj).parents('tr');
			//获取数据
			//总培训金额
			var trainingTotal = $(thisTr).find("td").eq(3).text();
			//日均：
			var aupr = $(thisTr).find("td").eq(2).text();
			//赋值
			//其他赋值操作
			personnelFunds.costPopModelAddOrUp();
			$("#trainingFeePopM #trainingTotal").val(trainingTotal);
			if(trainingTotal) {
				var aupr = trainingTotal / trainingDay / trainingPerNumber;
				$("#trainingFeePopM .aupr").text(aupr);
			};
			//调用窗口
			personnelFunds.costPopModel(thisTr);
		});*/
		//讲课费列表删除
		$("#lectureFeeTable").on('click', '.operate-del', function() {
			var thisObj = this;
			personnelFunds.deleteThisTr(thisObj, $("#lectureFeeTable"));
		});
		//讲课费列表修改
		$("#lectureFeeTable").on('click', '.operate-update', function() {
			var thisObj = this;
			var thisTr = $(thisObj).parents('tr');
			//调用当前操作关联弹窗方法
			personnelFunds.handlePopMShow(thisTr);
			/*获取数据	/	赋值*/
			/*
		        	 * 	讲师名称		lecturerName			select
						讲师职称		lecturerProfessional	text
						授课学时		teachingHours
						课程名称		courseName
						税前酬劳		preTaxPay
						税后酬劳		afterTaxPay	
						税后每学时金额	athPay					text
		        	 * */

			var lecturerName = $(thisTr).find(".uname").text();
			var lecturerNameVal = $(thisTr).find(".lectureId").val();
			var lecturerProfessional = $(thisTr).find(".holder").text();
			var teachingHours = $(thisTr).find(".hour").text();
			var courseName = $(thisTr).find(".cname").text();
			var preTaxPay = $(thisTr).find(".sum-pay").text();
			var afterTaxPay = $(thisTr).find(".after").text();
			var athPay = $(thisTr).find(".avg").text();
			/*初始化讲师select*/
			personnelFunds.initLecturerSelect(lecturerNameVal);
			$('#lectureFeePopM').find('.lecturerProfessional').text(lecturerProfessional);
			$('#lectureFeePopM').find('.teachingHours').val(teachingHours);
			$('#lectureFeePopM').find('.courseName').val(courseName);
			$('#lectureFeePopM').find('.preTaxPay').text(preTaxPay);
			$('#lectureFeePopM').find('.afterTaxPay').val(afterTaxPay);
			$('#lectureFeePopM').find('.athPay').text(athPay);

			//					//显示窗口
			personnelFunds.costPopModel(thisTr);
		});

		//城市间交通费列表删除
		$("#carFeeTable").on('click', '.operate-del', function() {
			var thisObj = this;
			personnelFunds.deleteThisTr(thisObj, $("#carFeeTable"));
		});
		//城市间交通费列表修改
		$("#carFeeTable").on('click', '.operate-update', function() {
			var thisObj = this;
			var thisTr = $(thisObj).parents('tr');
			//显示窗口
			personnelFunds.costPopModel(thisTr);

			/*获取数据	/	赋值*/

			var lecturerName = $(thisTr).find(".uname").text();
			var lecturerlevel = $(thisTr).find(".ulv").text();
			var startTime = $(thisTr).find(".sdate").text();
			var endTime = $(thisTr).find(".edate").text();
			var fromAddr = $(thisTr).find(".sadd").text();
			var endAddr = $(thisTr).find(".eadd").text();
			var vehicleArr = $(thisTr).find(".tname").text().split('-');
			var vehicle1 = '';
			var vehicle2 = '';
			if(vehicleArr.length > 1) {
				vehicle1 = vehicleArr[0];
				vehicle2 = vehicleArr[1];
			} else {
				vehicle1 = vehicleArr[0];
			}
			var vehicleValArr = $(thisTr).find(".tool").val().split('-');
			var vehicle1Val = '';
			var vehicle2Val = '';
			if(vehicleValArr.length > 1) {
				vehicle1Val = vehicleValArr[0];
				vehicle2Val = vehicleValArr[1];
			} else {
				vehicle1Val = vehicleValArr[0];
			}

			var carFare = $(thisTr).find(".sum-pay").text();
			var specialInstruct = $(thisTr).find(".dec").text();
			specialInstruct = specialInstruct == '无' ? '' : specialInstruct;
			//隐藏input
			var lecturerNameVal = $(thisTr).find("td").eq(0).find("input").val();
			var fromAddrVal = $(thisTr).find(".scode").val();
			var endAddrVal = $(thisTr).find(".ecode").val();

			/*赋值给弹窗*/
			/*初始化讲师select*/
			personnelFunds.initLecturerSelect($(thisTr).find(".lectureId").val());
			$("#carFeePopM").find('.lecturerlevel').text(lecturerlevel);
			$('#carFeePopM').find('.startTime').val(startTime);
			$('#carFeePopM').find('.endTime').val(endTime);

			$('#carFeePopM').find(".fromAddr").html('<option value="' + fromAddrVal + '">' + fromAddr + '</option>');
			personnelFunds.getPlanBusiAddress($("#fromAddr"));
			$('#carFeePopM').find(".endAddr").html('<option value="' + endAddrVal + '">' + endAddr + '</option>');
			personnelFunds.getPlanBusiAddress($("#endAddr"));

			$('#carFeePopM select.vehicle1 option[value="' + vehicle1Val + '"]').attr("selected", "selected");
			if(vehicleValArr.length > 1) {
				//调用公用方法根据一级交通工具获取二级交通工具
				personnelFunds.vechicleChildData(vehicle1Val);
				$('#carFeePopM select.vehicle2 option[value="' + vehicle2Val + '"]').attr("selected", "selected");
				$('#vehicle1,#vehicle2').niceSelect();
				$("div.vehicle2").show();
			} else {
				$('#vehicle1,#vehicle2').niceSelect();
				$(".vehicle2").hide();
			}

			$('#carFeePopM').find('.carFare').val(carFare);
			$('#carFeePopM').find('.specialInstruct').val(specialInstruct);

		});

		//住宿费列表删除
		$("#hotelFeeTable").on('click', '.operate-del', function() {
			var thisObj = this;
			personnelFunds.deleteThisTr(thisObj, $("#hotelFeeTable"));

		});
		//住宿费列表修改
		$("#hotelFeeTable").on('click', '.operate-update', function() {
			var thisObj = this;
			var thisTr = $(thisObj).parents('tr');
			//调用当前操作关联弹窗方法
			personnelFunds.handlePopMShow(thisTr);
			//显示窗口
			personnelFunds.costPopModel(thisTr);
			/*获取数据	/	赋值*/
			var lecturerName = $(thisTr).find(".name").text();
			//var lecturerlevel = $(thisTr).find("input.ulv").val();
			var checkInDate = $(thisTr).find(".sdate").text();
			var level = $(thisTr).find("input.level").val();
			var leaveDate = $(thisTr).find(".edate").text();
			var avgCost = $(thisTr).find(".avg").text();
			var stayDays = $(thisTr).find(".day").text();
			var stayCost = $(thisTr).find(".sum-pay").text();
			var specialInstruct = $(thisTr).find(".dec").text();
			specialInstruct = specialInstruct == '无' ? '' : specialInstruct;
			//隐藏input讲师val
			var lecturerNameVal = $(thisTr).find(".lectureId").val();
			personnelFunds.initLecturerSelect(lecturerNameVal);
//			$('#hotelFeePopM select.lecturerName option[value="' + lecturerNameVal + '"]').attr("selected", "selected");
			$("#hotelFeePopM").find("select.lecturerName").niceSelect();
			$("#hotelFeePopM").find(".level").text(level);
			$("#hotelFeePopM").find(".lecturerName").niceSelect();
			$('#hotelFeePopM').find('.checkInDate').val(checkInDate);
			$('#hotelFeePopM').find('.leaveDate').val(leaveDate);
			$('#hotelFeePopM').find('.avgCost').text(avgCost);
			$('#hotelFeePopM').find('.stayDays').text(stayDays);
			$('#hotelFeePopM').find('.stayCost').val(stayCost);
			$("#hotelFeePopM").find(".level").text(level);
			$('#hotelFeePopM').find('.specialInstruct').val(specialInstruct);
		});

		//伙食费列表删除
		$("#dietFeeTable").on('click', '.operate-del', function() {
			var thisObj = this;
			personnelFunds.deleteThisTr(thisObj, $("#dietFeeTable"));

		});
		//伙食费列表修改
		$("#dietFeeTable").on('click', '.operate-update', function() {
			var thisObj = this;
			var thisTr = $(thisObj).parents('tr');
			//调用当前操作关联弹窗方法
			personnelFunds.handlePopMShow(thisTr);
			/*获取数据	/	赋值*/
			var lecturerName = $(thisTr).find(".name").text();
			var avgCost = $(thisTr).find(".avg").text();
			var mealDays = $(thisTr).find(".day").text();
			var mealCost = $(thisTr).find(".sum-pay").text();
			var specialInstruct = $(thisTr).find(".dec").text();
			specialInstruct = specialInstruct == '无' ? '' : specialInstruct;
			//隐藏input讲师val
			var lecturerNameVal = $(thisTr).find(".lectureId").val();
			//显示窗口
			personnelFunds.costPopModel(thisTr);
			//获取讲师select数据
			personnelFunds.initLecturerSelect();
			$('#dietFeePopM select.lecturerName option[value="' + lecturerNameVal + '"]').attr("selected", "selected");
			$("#dietFeePopM").find("select.lecturerName").niceSelect();
			$('#dietFeePopM').find('.avgCost').val(avgCost);
			$('#dietFeePopM').find('.mealDays').val(mealDays);
			$('#dietFeePopM').find('.mealCost').val(mealCost);
			$('#dietFeePopM').find('.specialInstruct').val(specialInstruct);
			//					//其他赋值操作
			//					personnelFunds.costPopModelAddOrUp();
			//					
		});

	},
	/**
	 *1.2.1.1	根据数据字典类型查询字典数据
	 * TEACHE_JOB_LEVEL_CODE  级别
		TEACHE_JOB_CODE 职务
		TRAIN_TYPE 培训类型
	 */
	getCostActivityPro: function() {
		$.ajax({
			type: "post",
			url: "basicconfig/dictInfo/getDictInfoByTypeCode",
			async: false,
			data: {
				dictTypeCode: 'TEACHE_JOB_LEVEL_CODE,TEACHE_JOB_CODE,TRAIN_TYPE,VEHICIE_CODE,SPECIFIC_COST_TYPE'
			},
			success: function(data) {
				//获取数据list
				var list = data.data || [];
				//初始化HTML文本
				var start = '<option value="">请选择</option>',
					optone = start,
					opttwo = start,
					travelType = start,
					vehicle = start,
					detaMoney = start;
				//循环添加文本
				$.each(list, function(i, n) {
					if(n.dictTypeCode == 'TEACHE_JOB_LEVEL_CODE') {
						//讲师级别
						optone += '<option value="' + n.value + '">' + n.disvalue + '</option>';
					} else if(n.dictTypeCode == 'TEACHE_JOB_CODE') {
						//讲师职务
						opttwo += '<option value="' + n.value + '">' + n.disvalue + '</option>';
					} else if(n.dictTypeCode == 'TRAIN_TYPE') {
						//培训类型
						travelType += '<option value="' + n.value + '">' + n.disvalue + '</option>';
					} else if(n.dictTypeCode == 'VEHICIE_CODE') {
						//交通工具
						vehicle += '<option value="' + n.value + '">' + n.disvalue + '</option>';
					} else if(n.dictTypeCode == 'SPECIFIC_COST_TYPE') {
						//具体费用
						detaMoney += '<option value="' + n.value + '">' + n.disvalue + '</option>';
					}
				});
				//替换页面代码
				$('#level').html(optone).niceSelect();
				$('#professional').html(opttwo).niceSelect();
				//具体费用名称
				//$('select.cost-name').html(detaMoney).niceSelect();

				//培训类型
				//$('#meetingClassification').html(travelType).niceSelect();
				//交通工具
				$('#vehicle1').html(vehicle).on("change", function() {
					var selVal = $(this).val();
					//调用公用方法根据一级交通工具获取二级交通工具
					personnelFunds.vechicleChildData(selVal);
				}).niceSelect();

			}
		});
	},
	/**
	 * 获取其他费用  费用名称
	 */
	getDictTypeByTypeCode: function() {
		$.ajax({
			type: "post",
			url: "basicconfig/dictInfo/getDictTypeByTypeCode",
			async: true,
			data: {
				dictTypeCode: 'COST_OTHER'
			},
			success: function(data) {
				//获取数据list
				var list = data.data || [];
				//初始化HTML文本
				var start = '<option value="">请选择</option>';
				$.each(list, function(i, n) {
					start += '<option value="' + n.value + '">' + n.disvalue + '</option>';
				});
				$('select.cost-name').html(start).niceSelect();
			}
		});
	},
	/**
	 * 根据一级交通工具获取二级交通工具
	 * @param {Object} selVal 一级交通工具选中值
	 */
	vechicleChildData: function(selVal) {
		$.ajax({
			type: "post",
			url: "basicconfig/dictInfo/getDictInfoByTypeCode",
			async: false,
			data: {
				dictTypeCode: selVal
			},
			success: function(data) {
				if(data.flag == 0) {
					var veStr = "";
					$(".vehicle2").empty();
					veStr = '';
					if(data.data.length > 0) {
						//显示二级菜单
						$(".vehicle2").attr("validform", "{isNull:true,changeFlag:true,msg:'请选择交通工具'}");
						$.each(data.data, function(i, n) {
							veStr += '<option value="' + n.value + '">' + n.disvalue + '</option>';
						});
						$(".vehicle2").append(veStr).niceSelect();
						$("div.vehicle2").show();
					} else {
						//隐藏二级菜单
						$(".vehicle2").attr("validform", "{}");
						$(".vehicle2").niceSelect();
						$(".vehicle2").hide();
					}
				}
			}
		});
	},

	/*初始化讲师下拉列表方法*暂注释,采用手动录入方式*/
	initLecturerSelect: function(code) {
//		获取讲师表中的数据
		var lecturerTrList = $("#lecturerTable .yt-tbody tr");
//		添加到弹窗的下拉列表
		personnelFunds.thisPopM.find(".lecturerNameSel").html('<option value="">请选择</option>');
		lecturerTrList.each(function() {
//			讲师姓名
			var lecturerName = $(this).find('.lecturerName span').text();
			var lecturerId = $(this).find('.lecturerName input.lectureId').val();
			if(code && code == lecturerId) {
				personnelFunds.thisPopM.find(".lecturerNameSel").append('<option selected="selected" value="' + lecturerId + '">' + lecturerName + '</option>');
			} else {
				personnelFunds.thisPopM.find(".lecturerNameSel").append('<option value="' + lecturerId + '">' + lecturerName + '</option>');
			}
//			讲师职称
			//var professional=$(this).find('.professional').text();
		});
		$('select.lecturerNameSel').niceSelect();
		//选择讲师后为讲师等级等联动数据赋值
		personnelFunds.thisPopM.find(".lecturerNameSel").change(function() {
			var thisObj = $(this);
			var lecturerNameSelVal = thisObj.val();
			if(lecturerNameSelVal != '') {
				lecturerTrList.each(function() {
//					讲师姓名
					var thisTr = $(this);
					var lecturerId = thisTr.find('.lecturerName input.lectureId').val();
					if(lecturerNameSelVal == lecturerId) {
						var professional = thisTr.find('.professional').text();
						var level = thisTr.find('.level').text();
						personnelFunds.thisPopM.find(".professional").text(professional);
						personnelFunds.thisPopM.find(".level").text(level);
					}
				});
			} else {
				personnelFunds.thisPopM.find(".professional").text('');
				personnelFunds.thisPopM.find(".level").text('');
			}
		});
	},
//	初始化弹窗的切换tab
	initPopMTab: function() {
		//重置表单下标
		personnelFunds.tabIndex = 0;
		$(".train-district .cost-type-tab li").eq(personnelFunds.tabIndex).addClass("tab-check").siblings().removeClass("tab-check");
		//获取弹框默认的表单
		personnelFunds.thisPopM = $(".train-district .tab-info").hide().eq(personnelFunds.tabIndex).show();
		$("#trainingTotal").val("");
		$(".aupr").text($yt_baseElement.fmMoney(0));
	},
	/*费用申请新增和修改时公共操作*/
	costPopModelAddOrUp: function() {
		//初始化全部弹窗
		//		personnelFunds.initModel();
		/**获取数据*/
		//培训类别
		var trainingClasses = $("#trainingPopTable .trainingClasses").text();
		//培训天数
		var trainingDay = $("#trainingPopTable .trainingDay").text();
		//培训人数
		var trainingPerNumber = $("#trainingPopTable .trainingPerNumber").text();
		//赋值
		$("#trainingFeePopM .trainingClasses").text(trainingClasses);
		$("#trainingFeePopM .trainingDay").text(trainingDay);
		$("#trainingFeePopM .trainingPerNumber").text(trainingPerNumber);

		//显示费用申请弹窗
		personnelFunds.costPopModel();
		$("#trainingTotal").blur(function() {
			var trainingTotal = $("#trainingTotal").val();
			if(trainingTotal) {
				var aupr = $yt_baseElement.rmoney(trainingTotal) / trainingDay / trainingPerNumber;
				$("#trainingFeePopM .aupr").text($yt_baseElement.fmMoney(aupr));
			}
		});
	},
	//计算日期差
	GetDateDiff: function(startTime, endTime, diffType) {
		//将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式 
		startTime = startTime.replace(/\-/g, "/");
		endTime = endTime.replace(/\-/g, "/");

		//将计算间隔类性字符转换为小写
		diffType = diffType.toLowerCase();
		var sTime = new Date(startTime); //开始时间
		var eTime = new Date(endTime); //结束时间
		//作为除数的数字
		var divNum = 1;
		switch(diffType) {
			case "second":
				divNum = 1000;
				break;
			case "minute":
				divNum = 1000 * 60;
				break;
			case "hour":
				divNum = 1000 * 3600;
				break;
			case "day":
				divNum = 1000 * 3600 * 24;
				break;
			default:
				break;
		}
		return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(divNum));
	},
	//计算总金额方法
	updateTotalNum: function() {
		var fundsTotalNum = 0;
		//税后
		var afterNum = 0;
		//税后
		var aft = $('#carFeeTable,#hotelFeeTable,#dietFeeTable,#trainingFeeTable').find('.costTotal');
		//单独计算税后合计
		var aftt = $('#lectureFeeTable').find('.costTotal-after');
		aft.each(function() {
			afterNum += $yt_baseElement.rmoney($(this).text() || '0');
		});
		aftt.each(function() {
			afterNum += $yt_baseElement.rmoney($(this).text() || '0');
		});
		var costTotal = $yt_baseElement.rmoney($("#lectureFeeTable .costTotal").text());
		var costTotalAfter = $yt_baseElement.rmoney($("#lectureFeeTable .costTotal-after").text());
		var taxAmount = costTotal-costTotalAfter;
		
		var tds = $('#lectureFeeTable,#carFeeTable,#hotelFeeTable,#dietFeeTable,#trainingFeeTable').find('.costTotal');
		tds.each(function() {
			fundsTotalNum += $yt_baseElement.rmoney($(this).text() || '0');
		});
		//培训费列表
//		$('#trainingFeeTable .training-total').each(function() {
//			fundsTotalNum += $yt_baseElement.rmoney($(this).text() || '0');
//		});
		$("#serveAllMoney").text($yt_baseElement.fmMoney(fundsTotalNum || '0')).attr('num', fundsTotalNum);
		//可用支出金额\支出申请合计
		$("#doAdvanceAmount").text($yt_baseElement.fmMoney(afterNum || '0')).attr('num', afterNum);
		
		//课酬相关税金
		$("#taxAmount").text($yt_baseElement.fmMoney(taxAmount || '0')).attr('num', taxAmount);
		var sumMoneyLower = arabiaToChinese(afterNum || '0');
		
		//收费总金额（税后）
		var afterTaxAllMoney = $yt_baseElement.rmoney($("#predictCostTable .costTotal")
			.text());
		$("#afterTaxAllMoney").text($yt_baseElement.fmMoney(afterTaxAllMoney || '0'))
		.attr('num', afterTaxAllMoney);
		
		//收费总金额（税前）
		var preTaxAllMoney=afterTaxAllMoney*1.03;
		$("#preTaxAllMoney").text($yt_baseElement.fmMoney(preTaxAllMoney || '0'))
			.attr('num', preTaxAllMoney);
		//增值税销项税
		var vatSalesTax=afterTaxAllMoney*0.03;
		$("#vatSalesTax").text($yt_baseElement.fmMoney(vatSalesTax || '0'))
		.attr('num', vatSalesTax);
		//应缴附加费
			var surtax = vatSalesTax*0.12;
				$("#surtax").text($yt_baseElement.fmMoney(surtax || '0'))
				.attr('num', surtax);
		
		$("#TotalMoneyUpper,.total-money-up").text(sumMoneyLower);
		//税费表格内容 课酬费税金 增值税销项税 应邀附加税
		$(".taxation .tax-amount").text($yt_baseElement.fmMoney(taxAmount || '0'));
		$(".taxation .added-value").text($yt_baseElement.fmMoney(vatSalesTax || '0'));
		$(".taxation .surtax").text($yt_baseElement.fmMoney(surtax || '0'));
		var taxationTotal = taxAmount + vatSalesTax + surtax;
		$(".taxation .total").text($yt_baseElement.fmMoney(taxationTotal || '0'));
		//支出总金额  税前
		fundsTotalNum += surtax;
		$("#applyTotalMoney").text($yt_baseElement.fmMoney(fundsTotalNum || '0')).attr('num', fundsTotalNum);

	},
	//初始化弹窗数据方法(参数为当前弹窗的id)
	initModel: function(thisPopM) {
		var costPopModel = $('#costPopModel');
		//  		var allModel=$("#trainingPopModel,#lecturerPopModel,#costPopModel,#trainingPopModel");
		costPopModel.find(".lecturerProfessional,.lecturerlevel,#stayDays,.avgCost,#mealCost,.professional").text('');
		costPopModel.find("#startTime,#endTime,#checkInDate,#leaveDate,.specialInstruct").val('');
		sysCommon.clearValidInfo($("#startTime,#endTime,#checkInDate,#leaveDate"));
		//$("#fromAddr,#endAddr,#trainingAddr,#vehicle2").html("");
		$("#trainingAddr,#vehicle2").html("");
		//出发地到达地点
		$("#fromAddr,#endAddr").html('<option value="">请输入</option>');
		costPopModel.find(".yt-input,.yt-select").val('').removeClass('valid-hint');
		costPopModel.find(".yt-select:not(.fromAddr,.endAddr,.trainingAddr)").niceSelect();
		costPopModel.find(".valid-font").text('');
		$("#trainingDay").text('0');
		costPopModel.find(".aupr,.athPay,.preTaxPay").text($yt_baseElement.fmMoney('0'));
		//调用获取地址数据方法
		personnelFunds.addressList = sysCommon.getAddressInfoList();
		//调用获取热门城市方法
		personnelFunds.hotCityList = sysCommon.getHotCityList();
		if(personnelFunds.addressList != "" && personnelFunds.addressList != null) {
			//调用遍历地址数据的方法
			personnelFunds.getPlanBusiAddress($("#trainingAddr"));
			personnelFunds.getPlanBusiAddress($("#fromAddr"));
			personnelFunds.getPlanBusiAddress($("#endAddr"));
		}
		if(thisPopM) {}
		costPopModel.find('.lecturerProfessional,.level').text('');
		$("#startTime,#endTime,#checkInDate,#leaveDate").val("");
	},
	/**
	 *  行程表单出差地点事件
	 * @param {Object} labelObj 当前标签对象
	 */
	getPlanBusiAddress: function(labelObj) {
		/**
		 * 行程表单中出差地点
		 */
		//4.初始化调用插件刷新方法  
		$(labelObj).niceSelect({
			search: true,
			backFunction: function(text) {
				//回调方法,可以执行模糊查询,也可自行添加操作  
				$(labelObj).find("option").remove();
				var opt = '';
				//遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
				if(text == "") {
					opt += '<option value="" disabled="disabled">热门城市</option>';
					//遍历热门城市集合
					$.each(personnelFunds.hotCityList, function(i, n) {
						//行程中的出差地点
						opt += '<option value="' + n.regionCode + '" data-level="' + n.regionLevel + '" data-name="' + n.regionName + '">' + n.regionName + '/' + n.regionMergerName + '</option>';
					});
				} else {
					//遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
					$.each(personnelFunds.addressList, function(i, n) {
						//名称模糊查询
						if(n.regionName.indexOf(text) != -1) {
							opt += '<option value="' + n.regionCode + '" data-level="' + n.regionLevel + '" data-name="' + n.regionName + '">' + n.regionName + '/' + n.regionMergerName + '</option>';
						}
						//拼音模糊查询
						if(n.regionNamePinYin.indexOf(text) != -1) {
							opt += '<option value="' + n.regionCode + '" data-level="' + n.regionLevel + '" data-name="' + n.regionName + '">' + n.regionName + '/' + n.regionMergerName + '</option>';
						}
					});
				}
				$(labelObj).append(opt);
			}
		});
		//可搜索输入框失去焦点事件
		$(labelObj).next("div.nice-select").find(".search-current").blur(function(){
			if($(this).val() == ""){
				$(this).val("请输入");
			}
		});
	},
	//删除当前行的方法(参数为当前按钮对象)
	deleteThisTr: function(thisObj, thisTable) {
		$yt_alert_Model.alertOne({
			alertMsg: "确定要删除此条数据吗?", //提示信息 
			leftBtnName: "确定",
			confirmFunction: function() { //点击确定按钮执行方法 
				//判断表格中除去,合计行和公务卡行
				//if(thisObj.parents("tbody").find("tr:not(.total-last-tr)").length == 1) {
				//	thisObj.parents("tbody").empty();
				//}
				//删除当前行
				$(thisObj).parents('tr').remove();
				if(thisTable) {
					var sum = 0;
					thisTable.find("tbody tr:not(.end-tr)").each(function() {
						var thisObj = $(this);
						sum += $yt_baseElement.rmoney(thisObj.find(".sum-pay").text());
					});
					thisTable.find(".costTotal").text($yt_baseElement.fmMoney(sum));
				}
				if(thisTable.selector == "#lectureFeeTable") {
					var sum = 0;
					thisTable.find("tbody tr:not(.end-tr)").each(function() {
						var thisObj = $(this);
						sum += $yt_baseElement.rmoney(thisObj.find(".after").text());
					});
					thisTable.find(".costTotal-after").text($yt_baseElement.fmMoney(sum));
				}
				//计算总金额
				personnelFunds.updateTotalNum();
			}
		});
	},
	//修改当前行数据方法
	updateThisTr: function(thisObj) {
		var thisTr = $(thisObj).parents('tr');
		personnelFunds.trainingPopModel(thisTr);
		//获取表单数据
		//培训类别：
		var trainingClasses = $(thisTr).attr('traintype');
		//培训地点：
		var trainingAddr = $(thisTr).find(".trainingAddr").text();
		var trainingAddrVal = $(thisTr).find(".trainingAddrVal").val();
		//培训报到日期：
		var trainingReportDate = $(thisTr).find(".trainingReportDate").text();
		//培训结束日期：
		var trainingEndingDate = $(thisTr).find(".trainingEndingDate").text();
		//培训天数：//personnelFunds.trainingDay
		var trainingDay = $(thisTr).find(".trainingDay").text();
		//培训人数：
		var trainingPerNumber = $(thisTr).find(".trainingPerNumber").text();
		//赋值
		$("#trainingClasses").find('option[value="' + trainingClasses + '"]').attr("selected", true);

		$("#trainingAddr").html('<option value="' + trainingAddrVal + '">' + trainingAddr + '</option>');
		personnelFunds.getPlanBusiAddress($("#trainingAddr"));

		$("#trainingClasses").niceSelect();
		$("#trainingReportDate").val(trainingReportDate);
		$("#trainingEndingDate").val(trainingEndingDate);
		$("#trainingDay").text(trainingDay);
		$("#trainingPerNumber").val(trainingPerNumber);
	},
	//保存修改当前行的方法
	saveUpdateThisTr: function(thisTr) {
		//删除当前行
		if(thisTr) {
			thisTr.remove();
		}
		//获取表单数据
		//培训类别：
		var trainingClassVal = $("#trainingClasses").val();
		var trainingClasses = $("#trainingClasses option:selected").text();
		//培训地点：
		var trainingAddrVal = $("#trainingAddr").val();
		var trainingAddr = $("#trainingAddr option:selected").text();
		//培训报到日期：
		var trainingReportDate = $("#trainingReportDate").val();
		//培训结束日期：
		var trainingEndingDate = $("#trainingEndingDate").val();
		//培训天数：
		var day = personnelFunds.GetDateDiff(trainingReportDate, trainingEndingDate, "day") + 1;
		//培训人数：
		var trainingPerNumber = $("#trainingPerNumber").val();
		//将表单数据添加到表格
		$("#trainingPopTable .yt-table .yt-tbody").append('<tr pid="" trainType="' + trainingClassVal + '">' +
			'<td class="trainingClasses">' + trainingClasses + '</td>' +
			'<td class="trainingAddr"><input type="hidden" class="trainingAddrVal" value="' + trainingAddrVal + '">' + trainingAddr + '</td>' +
			'<td class="trainingReportDate">' + trainingReportDate + '</td>' +
			'<td class="trainingEndingDate">' + trainingEndingDate + '</td>' +
			'<td class="trainingDay">' + day + '</td>' +
			'<td class="trainingPerNumber">' + trainingPerNumber + '</td>' +
			'<td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
			'</tr>');
	},

	//填写培训信息弹窗	trainingPopModel
	trainingPopModel: function(thisTr) {
		if(thisTr) {
			$("#trainingPopModel.yt-edit-alert .yt-eidt-model-bottom .yt-model-sure-btn").addClass('yt-model-save-btn').text('确定');
		} else {
			$("#trainingPopModel.yt-edit-alert .yt-eidt-model-bottom .yt-model-save-btn").removeClass('yt-model-save-btn').text('保存');
		}
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$("#trainingPopModel.yt-edit-alert,#heard-nav-bak").show();
		/** 
		 * 调用算取div显示位置方法 
		 */
		$yt_alert_Model.getDivPosition($("#trainingPopModel"));
		/* 
		 * 调用支持拖拽的方法 
		 */
		//      $yt_model_drag.modelDragEvent($("#trainingPopModel.yt-edit-alert .yt-edit-alert-title"));  
		/** 
		 * 点击取消方法 
		 */
		$('#trainingPopModel.yt-edit-alert .yt-eidt-model-bottom .yt-model-canel-btn,#trainingPopModel .closed-span').off().on("click", function() {
			//初始化数据
			personnelFunds.initModel($("#trainingPopModel"));
			//隐藏页面中自定义的表单内容
			$("#trainingPopModel.yt-edit-alert,#heard-nav-bak").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
		/** 
		 * 点击确定方法 
		 */
		$('#trainingPopModel.yt-edit-alert .yt-eidt-model-bottom .yt-model-sure-btn').off().on("click", function() {
			var isFalse = $yt_valid.validForm($("#trainingPopModel"));
			if(isFalse) {
				//获取表单数据
				personnelFunds.saveUpdateThisTr();
				//隐藏页面中自定义的表单内容  
				$("#trainingPopModel.yt-edit-alert,#heard-nav-bak").hide();
				//隐藏蒙层  
				$("#pop-modle-alert").hide();

				$("#trainingPopTable .operate-update").click(function() {
					var thisData = this;
					personnelFunds.updateThisTr(thisData, $("#trainingPopTable"));
				});
				$("#trainingPopTable .operate-del").click(function() {
					var thisObj = $(this);
					$yt_alert_Model.alertOne({
						alertMsg: "确定要删除此条数据吗?", //提示信息 
						leftBtnName: "确定",
						confirmFunction: function() { //点击确定按钮执行方法 
							//删除当前行
							thisObj.parents('tr').remove();
							//删除数据
							$("#trainingFeeTable").find(".yt-tbody tr").remove();
							$("#lectureFeeTable,#carFeeTable,#hotelFeeTable,#dietFeeTable").find(".yt-tbody tr:not(:last)").remove();
							//初始化合计金额
							$("#lectureFeeTable,#carFeeTable,#hotelFeeTable,#dietFeeTable").find(".costTotal").text($yt_baseElement.fmMoney('0'));
							$("#lectureFeeTable").find(".costTotal-after").text($yt_baseElement.fmMoney('0'));
							//计算总金额
							personnelFunds.updateTotalNum();
						}
					});
				});

				//初始化数据
				personnelFunds.initModel($("#trainingPopModel"));
			}
		});
		/**
		 * 点击保存方法
		 * */
		$("#trainingPopModel.yt-edit-alert .yt-eidt-model-bottom .yt-model-save-btn").off().on("click", function() {
			var isFalse = $yt_valid.validForm($("#trainingPopModel"));
			if(isFalse) {
				personnelFunds.saveUpdateThisTr(thisTr);

				$("#trainingPopTable .operate-del").click(function() {
					var thisObj = $(this);
					$yt_alert_Model.alertOne({
						alertMsg: "确定要删除此条数据吗?", //提示信息 
						leftBtnName: "确定",
						confirmFunction: function() { //点击确定按钮执行方法 
							//删除当前行
							thisObj.parents('tr').remove();
							//删除数据
							$("#trainingFeeTable").find(".yt-tbody").remove();
							$("#lectureFeeTable,#carFeeTable,#hotelFeeTable,#dietFeeTable").find(".yt-tbody tr:not(:last)").remove();
							//初始化合计金额
							$("#lectureFeeTable,#carFeeTable,#hotelFeeTable,#dietFeeTable").find(".costTotal").text($yt_baseElement.fmMoney('0'));
							$("#lectureFeeTable").find(".costTotal-after").text($yt_baseElement.fmMoney('0'));
							//计算总金额
							personnelFunds.updateTotalNum();
						}
					});
				});
				$("#trainingPopTable .operate-update").click(function() {
					var thisData = this;
					personnelFunds.updateThisTr(thisData, $("#trainingPopTable"));
				});
				//初始化数据
				personnelFunds.initModel($("#trainingPopModel"));
				//隐藏页面中自定义的表单内容
				$("#trainingPopModel.yt-edit-alert,#heard-nav-bak").hide();
				//隐藏蒙层  
				$("#pop-modle-alert").hide();
				personnelFunds.updateTotalNum();
			}
		});

	},

	//填写讲师信息弹窗	lecturerPopModel
	lecturerPopModel: function(thisTr) {
		if(thisTr) {
			$("#lecturerPopModel.yt-edit-alert .yt-eidt-model-bottom .请先选择事前申请单").addClass('yt-model-save-btn').text('确定');
		} else {
			$("#lecturerPopModel.yt-edit-alert .yt-eidt-model-bottom .yt-model-save-btn").removeClass('yt-model-save-btn').text('保存');
			//初始化数据
			//	        personnelFunds.initModel();
		}
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$("#lecturerPopModel.yt-edit-alert,#heard-nav-bak").show();
		/** 
		 * 调用算取div显示位置方法 
		 */
		$yt_alert_Model.getDivPosition($("#lecturerPopModel"));
		/* 
		 * 调用支持拖拽的方法 
		 */
		$yt_model_drag.modelDragEvent($("#lecturerPopModel.yt-edit-alert .yt-edit-alert-title"));
		/** 
		 * 点击取消方法 
		 */
		$('#lecturerPopModel.yt-edit-alert .yt-eidt-model-bottom .yt-model-canel-btn,#lecturerPopModel .closed-span').off().on("click", function() {
			//初始化数据
			personnelFunds.initModel($("#lecturerPopModel"));
			//隐藏页面中自定义的表单内容
			$("#lecturerPopModel.yt-edit-alert,#heard-nav-bak").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
		/** 
		 * 点击确定方法 
		 */

		$('#lecturerPopModel.yt-edit-alert .yt-eidt-model-bottom .yt-model-sure-btn').off().on("click", function() {
			var isFalse = $yt_valid.validForm($("#lecturerPopModel"));
			if(isFalse) {
				//获取弹窗数据
				//讲师id
				var lectureId = '';
				//讲师姓名： lecturerName
				var lecturerName = $("#lecturerName").val();
				//职称： professional
				var professional = $("#professional option:selected").val();
				var professionalVal = $("#professional option:selected").text();
				professionalVal = professionalVal == '请选择' ? '' : professionalVal;
				//级别： level
				var level = $("#level option:selected").val();
				var levelVal = $("#level option:selected").text();
				levelVal = levelVal == '请选择' ? '' : levelVal;
				//ajax	
				personnelFunds.lectureId += 1;
				if(thisTr) {
					lectureId = thisTr.find('.lectureId').val();
				}
				//调用讲师信息新增接口
				personnelFunds.addToListLecturerInfo({
					lectureId: lectureId, //lectureId	讲师信息编号Id
					lecturerName: lecturerName, //lecturerName	讲师名称
					lecturerTitleCode: professional, //lecturerTitleCode	讲师职称
					professionalVal: professionalVal,
					lecturerLevelCode: level, //lecturerLevelCode	讲师级别
					levelVal: levelVal
				}, thisTr);
			}

		});

	},
	/**
	 * 设置预先收入费用表格相关事件20180725
	 */
	predictCostPopM: function(thisTr) {
		/*$("#trainingTotal").blur(function() {
			if($("#trainingTotal").val()) {
				var aupr = $yt_baseElement.rmoney($("#trainingTotal").val()) / personnelFunds.thisPopM.find(".trainingDay").text() / personnelFunds.thisPopM.find(".trainingPerNumber").text();
				$("#predictCostPopM .aupr").text($yt_baseElement.fmMoney(aupr));
			} else {
				$("#predictCostPopM .aupr").text($yt_baseElement.fmMoney('0'));
			}
		});*/
		//弹窗当前操作对象显示处理
		personnelFunds.handlePopMShow(thisTr);
		//显示编辑弹出框和显示顶部隐藏蒙层  
		$("#predictCostPopM.yt-edit-alert,#heard-nav-bak").show();
		//调用算取div显示位置方法 
		$yt_alert_Model.getDivPosition($("#costPopModel"));
		//点击取消方法 
		$('#predictCostPopM.yt-edit-alert .yt-eidt-model-bottom .yt-model-canel-btn,#predictCostPopM .closed-span').off().on("click", function() {
			//初始化数据
			personnelFunds.initModel(personnelFunds.thisPopM);
			//隐藏页面中自定义的表单内容
			$("#predictCostPopM.yt-edit-alert,#heard-nav-bak").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
		//点击添加方法 
		$('#oherTrainingAlert.yt-edit-alert .yt-eidt-model-bottom .yt-model-sure-btn').off().on("click", function() {
			//验证只能添加一条培训信息
			if( /*$("#trainingFeeTable .yt-tbody tr").size() < 1*/ true) {
				//验证当前弹窗对象
				var isFalse = $yt_valid.validForm(personnelFunds.thisPopM);
				if(isFalse) {
					//获取数据
					/*费用名称*/
					var costName = $("#trainingFeePopM .cost-name option:selected").text();
					var costNameVal = $("#trainingFeePopM .cost-name option:selected").val();
					/*标准*/
					var standardMoney = $("#trainingFeePopM .standard-money").val();
					/*人数*/
					var peopleNum = $("#trainingFeePopM .people-num").val();
					/*天数*/
					var dayNum = $("#trainingFeePopM .day-num").val();
					/*小计*/
					var smallplanMoney = $("#trainingFeePopM .smallplan-money").val();
					/*特殊说明*/
					var specialInstruct = $("#trainingFeePopM .specialInstruct").val();
					specialInstruct = specialInstruct == '' ? '无' : specialInstruct;
					/*添加到表格*/
					$("#trainingFeeTable .yt-tbody tr").eq(-1).before('<tr costNameVal="' + costNameVal + '" pid="">' +
						'<td class="cost-name">' + costName + '</td>' +
						'<td class="moneyText standard-money">' + standardMoney + '</td>' +
						'<td class="people-num">' + peopleNum + '</td>' +
						'<td class="day-num">' + dayNum + '</td>' +
						'<td class="moneyText smallplan-money">' + smallplanMoney + '</td>' +
						'<td class="special-instruct">' + specialInstruct + '</td>' +
						'<td><input type="hidden" class="popM" value="' + personnelFunds.tabIndex + '"/><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
						'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
						'</tr>');

					var totalAmount = 0;
					$('#trainingFeeTable tbody .smallplan-money').each(function() {
						totalAmount += $yt_baseElement.rmoney($(this).text());
					});
					$('#trainingFeeTable tbody .costTotal').text($yt_baseElement.fmMoney(totalAmount));
					//调用初始化数据方法
					personnelFunds.initModel(personnelFunds.thisPopM);
					//					//隐藏页面中自定义的表单内容  
					//					$("#predictCostPopM.yt-edit-alert,#heard-nav-bak").hide();
					//					//隐藏蒙层  
					//					$("#pop-modle-alert").hide();
					$yt_alert_Model.prompt("填写的信息已成功加入到列表");
					//计算总金额
					personnelFunds.updateTotalNum();
				}
			} else {
				$yt_alert_Model.prompt("只能添加一条培训信息");
			}
		});
		//点击保存按钮方法
		$('#predictCostPopM.yt-edit-alert .yt-eidt-model-bottom .yt-model-save-btn').off().on("click", function() {
			//验证当前弹窗对象
			var isFalse = $yt_valid.validForm(personnelFunds.thisPopM);

			if(isFalse) {
				//获取数据
				/*费用名称*/
				var costName = $("#predictCostPopM .cost-name").val();
				/*标准*/
				var standardMoney = $("#predictCostPopM .standard-money").val();
				/*人数*/
				var peopleNum = $("#predictCostPopM .people-num").val();
				/*小计*/
				var smallplanMoney = $("#predictCostPopM .smallplan-money").val();
				/*特殊说明*/
				var specialInstruct = $("#predictCostPopM .specialInstruct").val();
				specialInstruct = specialInstruct == '' ? '无' : specialInstruct;

				/*添加到表格*/
				thisTr.replaceWith('<tr  pid="">' +
					'<td class="cost-name">' + costName + '</td>' +
					'<td class="moneyText standard-money">' + standardMoney + '</td>' +
					'<td class="people-num">' + peopleNum + '</td>' +
					'<td class="moneyText smallplan-money">' + smallplanMoney + '</td>' +
					'<td class="special-instruct">' + specialInstruct + '</td>' +
					'<td><input type="hidden" class="popM" value="' + personnelFunds.tabIndex + '"/><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
					'</tr>');
				var totalAmount = 0;
				$('#predictCostTable tbody .smallplan-money').each(function() {
					totalAmount += $yt_baseElement.rmoney($(this).text());
				});
				$('#predictCostTable tbody .costTotal').text($yt_baseElement.fmMoney(totalAmount));
				//调用初始化数据方法
				personnelFunds.initModel(personnelFunds.thisPopM);
				$yt_alert_Model.prompt("填写的信息已成功加入到列表");
				//计算总金额
				personnelFunds.updateTotalNum();
			}

		});
	},
	
	/**
	 * 设置讲师表格相关事件
	 */
	setLecturerTableEvent: function() {
		$('#lecturerPopModel input').val('');
		$('#lecturerPopModel select').each(function() {
			$(this).find('option:first-child').attr('selected', true);
		}).niceSelect();
		$yt_alert_Model.prompt("填写的信息已成功加入到列表");
	},

	//填写费用明细弹窗   	costPopModel
	costPopModel: function(thisTr) {
		//弹窗当前操作对象显示处理
		personnelFunds.handlePopMShow(thisTr);
		//		alert(personnelFunds.tabIndex);
		//显示编辑弹出框和显示顶部隐藏蒙层  
		$("#costPopModel.yt-edit-alert,#heard-nav-bak").show();
		//调用算取div显示位置方法 
		$yt_alert_Model.getDivPosition($("#costPopModel"));
		//调用支持拖拽的方法 
		//$yt_model_drag.modelDragEvent($("#costPopModel.yt-edit-alert .yt-edit-alert-title"));  

		if(personnelFunds.tabIndex == 0) {
			personnelFunds.lectureFeePopM(thisTr);
		} else if(personnelFunds.tabIndex == 1) {
			personnelFunds.carFeePopM(thisTr);
		} else if(personnelFunds.tabIndex == 2) {
			personnelFunds.hotelFeePopM(thisTr);
		} else if(personnelFunds.tabIndex == 3) {
			personnelFunds.dietFeePopM(thisTr);
		} else if(personnelFunds.tabIndex == 4) {
			personnelFunds.trainingFeePopM(thisTr);
		}
		//初始化下拉列表
		//$('select').niceSelect();
		//初始化事件控件

	},
	//培训费弹窗方法
	trainingFeePopM: function(thisTr) {
		$("#trainingTotal").blur(function() {
			if($("#trainingTotal").val()) {
				var aupr = $yt_baseElement.rmoney($("#trainingTotal").val()) / personnelFunds.thisPopM.find(".trainingDay").text() / personnelFunds.thisPopM.find(".trainingPerNumber").text();
				$("#trainingFeePopM .aupr").text($yt_baseElement.fmMoney(aupr));
			} else {
				$("#trainingFeePopM .aupr").text($yt_baseElement.fmMoney('0'));
			}
		});
		//弹窗当前操作对象显示处理
		personnelFunds.handlePopMShow(thisTr);
		//显示编辑弹出框和显示顶部隐藏蒙层  
		$("#costPopModel.yt-edit-alert,#heard-nav-bak").show();
		//调用算取div显示位置方法 
		$yt_alert_Model.getDivPosition($("#costPopModel"));
		//点击取消方法 
		$('#costPopModel.yt-edit-alert .yt-eidt-model-bottom .yt-model-canel-btn,#costPopModel .closed-span').off().on("click", function() {
			//初始化数据
			personnelFunds.initModel(personnelFunds.thisPopM);
			//隐藏页面中自定义的表单内容
			$("#costPopModel.yt-edit-alert,#heard-nav-bak").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
		//点击添加方法 
		$('#oherTrainingAlert.yt-edit-alert .yt-eidt-model-bottom .yt-model-sure-btn').off().on("click", function() {
			//验证只能添加一条培训信息
			if( /*$("#trainingFeeTable .yt-tbody tr").size() < 1*/ true) {
				//验证当前弹窗对象
				var isFalse = $yt_valid.validForm(personnelFunds.thisPopM);
				if(isFalse) {
					//获取数据
					/*费用名称*/
					var costName = $("#trainingFeePopM .cost-name option:selected").text();
					var costNameVal = $("#trainingFeePopM .cost-name option:selected").val();
					/*标准*/
					var standardMoney = $("#trainingFeePopM .standard-money").val();
					/*人数*/
					var peopleNum = $("#trainingFeePopM .people-num").val();
					/*天数*/
					var dayNum = $("#trainingFeePopM .day-num").val();
					/*小计*/
					var smallplanMoney = $("#trainingFeePopM .smallplan-money").val();
					/*特殊说明*/
					var specialInstruct = $("#trainingFeePopM .specialInstruct").val();
					specialInstruct = specialInstruct == '' ? '无' : specialInstruct;
					/*添加到表格*/
					$("#trainingFeeTable .yt-tbody tr").eq(-1).before('<tr costNameVal="' + costNameVal + '" pid="">' +
						'<td class="cost-name">' + costName + '</td>' +
						'<td class="moneyText standard-money">' + standardMoney + '</td>' +
						'<td class="people-num">' + peopleNum + '</td>' +
						'<td class="day-num">' + dayNum + '</td>' +
						'<td class="moneyText smallplan-money">' + smallplanMoney + '</td>' +
						'<td class="special-instruct">' + specialInstruct + '</td>' +
						'<td><input type="hidden" class="popM" value="' + personnelFunds.tabIndex + '"/><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
						'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
						'</tr>');

					var totalAmount = 0;
					$('#trainingFeeTable tbody .smallplan-money').each(function() {
						totalAmount += $yt_baseElement.rmoney($(this).text());
					});
					$('#trainingFeeTable tbody .costTotal').text($yt_baseElement.fmMoney(totalAmount));
					//调用初始化数据方法
					personnelFunds.initModel(personnelFunds.thisPopM);
					//					//隐藏页面中自定义的表单内容  
					//					$("#costPopModel.yt-edit-alert,#heard-nav-bak").hide();
					//					//隐藏蒙层  
					//					$("#pop-modle-alert").hide();
					$yt_alert_Model.prompt("填写的信息已成功加入到列表");
					//计算总金额
					personnelFunds.updateTotalNum();
				}
			} else {
				$yt_alert_Model.prompt("只能添加一条培训信息");
			}
		});
		//点击确定按钮方法
		$('#costPopModel.yt-edit-alert .yt-eidt-model-bottom .yt-model-save-btn').off().on("click", function() {
			//验证当前弹窗对象
			var isFalse = $yt_valid.validForm(personnelFunds.thisPopM);

			if(isFalse) {
				//获取数据
				/*费用名称*/
				var costName = $("#trainingFeePopM .cost-name option:selected").text();
				var costNameVal = $("#trainingFeePopM .cost-name option:selected").val();
				/*标准*/
				var standardMoney = $("#trainingFeePopM .standard-money").val();
				/*人数*/
				var peopleNum = $("#trainingFeePopM .people-num").val();
				/*天数*/
				var dayNum = $("#trainingFeePopM .day-num").val();
				/*小计*/
				var smallplanMoney = $("#trainingFeePopM .smallplan-money").val();
				/*特殊说明*/
				var specialInstruct = $("#trainingFeePopM .specialInstruct").val();
				specialInstruct = specialInstruct == '' ? '无' : specialInstruct;

				/*删除原始行*/
				//thisTr.remove();

				/*添加到表格*/
				thisTr.replaceWith('<tr costNameVal="' + costNameVal + '" pid="">' +
					'<td class="cost-name">' + costName + '</td>' +
					'<td class="moneyText standard-money">' + standardMoney + '</td>' +
					'<td class="people-num">' + peopleNum + '</td>' +
					'<td class="day-num">' + dayNum + '</td>' +
					'<td class="moneyText smallplan-money">' + smallplanMoney + '</td>' +
					'<td class="special-instruct">' + specialInstruct + '</td>' +
					'<td><input type="hidden" class="popM" value="' + personnelFunds.tabIndex + '"/><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
					'</tr>');
				var totalAmount = 0;
				$('#trainingFeeTable tbody .smallplan-money').each(function() {
					totalAmount += $yt_baseElement.rmoney($(this).text());
				});
				$('#trainingFeeTable tbody .costTotal').text($yt_baseElement.fmMoney(totalAmount));
				//调用初始化数据方法
				personnelFunds.initModel(personnelFunds.thisPopM);
				//隐藏页面中自定义的表单内容  
				$("#costPopModel.yt-edit-alert,#heard-nav-bak").hide();
				//隐藏蒙层  
				$("#pop-modle-alert").hide();
				$yt_alert_Model.prompt("填写的信息已成功加入到列表");
				//计算总金额
				personnelFunds.updateTotalNum();
			}

		});
	},
	//讲课费弹窗方法
	lectureFeePopM: function(thisTr) {
		//初始化当前弹窗数据
		if(!thisTr) {
			personnelFunds.thisPopM.find(".athPay").text($yt_baseElement.fmMoney('0'));
		}
		//计算税后每学时金额
		$(personnelFunds.thisPopM.find(".afterTaxPay,.teachingHours")).blur(function() {
//			var athPay = 0;
//			if(personnelFunds.thisPopM.find(".afterTaxPay").val() && personnelFunds.thisPopM.find(".teachingHours").val()) {
//				athPay = $yt_baseElement.rmoney(personnelFunds.thisPopM.find(".afterTaxPay").val()) / personnelFunds.thisPopM.find(".teachingHours").val();
//				personnelFunds.thisPopM.find(".athPay").text($yt_baseElement.fmMoney(athPay));
//			} else {
//				personnelFunds.thisPopM.find(".athPay").text($yt_baseElement.fmMoney(athPay));
//			}
			var athPay = 0;
			//税前
			var preTaxPay=0;
			if (personnelFunds.thisPopM.find(".afterTaxPay").val() && personnelFunds.thisPopM.find(".teachingHours").val()) {
				//税后
				var afterTaxPay = personnelFunds.thisPopM.find('.afterTaxPay').val();
				athPay = $yt_baseElement.rmoney(afterTaxPay) / personnelFunds.thisPopM.find(".teachingHours").val();
				preTaxPay = $yt_baseElement.preTaxPaymoney(afterTaxPay);
			} 
			personnelFunds.thisPopM.find(".athPay").text($yt_baseElement.fmMoney(athPay))
			personnelFunds.thisPopM.find(".preTaxPay").text($yt_baseElement.fmMoney(preTaxPay));
		});
		//点击取消方法 
		$('#costPopModel.yt-edit-alert .yt-eidt-model-bottom .yt-model-canel-btn,#costPopModel .closed-span').off().on("click", function() {
			//初始化数据
			personnelFunds.initModel(personnelFunds.thisPopM);
			//隐藏页面中自定义的表单内容
			$("#costPopModel.yt-edit-alert,#heard-nav-bak").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
		//点击添加方法
		$('#costPopModel.yt-edit-alert .yt-eidt-model-bottom .yt-model-sure-btn').off().on("click", function() {
			//验证当前弹窗对象
			var isFalse = $yt_valid.validForm(personnelFunds.thisPopM);
			if(isFalse) {
				/*获取数据*/
				/*
	        	 * 	讲师名称		lecturerName			select
					讲师职称		lecturerProfessional	text
					授课学时		teachingHours
					课程名称		courseName
					税前酬劳		preTaxPay
					税后酬劳		afterTaxPay	
					税后每学时金额	athPay					text
	        	 * */
				var lecturerName = personnelFunds.thisPopM.find('.lecturerName option:selected').text();
				var lecturerProfessional = personnelFunds.thisPopM.find('.lecturerProfessional').text();
				var teachingHours = personnelFunds.thisPopM.find('.teachingHours').val();
				var courseName = personnelFunds.thisPopM.find('.courseName').val();
				var preTaxPay=0;
				var afterTaxPay = $yt_baseElement.fmMoney(personnelFunds.thisPopM.find('.afterTaxPay').val());
				preTaxPay=$yt_baseElement.fmMoney($yt_baseElement.preTaxPaymoney(afterTaxPay));
				var athPay = personnelFunds.thisPopM.find('.athPay').text();
				//隐藏input讲师val
				var lecturerNameVal = personnelFunds.thisPopM.find('.lecturerName option:selected').val();
				/*添加到表格*/
				$("#lectureFeeTable .yt-tbody tr").eq(-1).before('<tr pid="">' +
					'<td class="uname"><input type="hidden" class="lectureId" value="' + lecturerNameVal + '">' + lecturerName + '</td>' +
					'<td class="holder">' + lecturerProfessional + '</td>' +
					'<td class="hour">' + teachingHours + '</td>' +
					'<td class="cname">' + (courseName || '--') + '</td>' +
					'<td class="moneyText sum-pay">' + preTaxPay + '</td>' +
					'<td class="moneyText after">' + afterTaxPay + '</td>' +
					'<td class="moneyText avg">' + athPay + '</td>' +
					'<td><input type="hidden" class="popM" value="' + personnelFunds.tabIndex + '"/>' +
					'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
					'</td></tr>');	
				var sum = 0;
				$("#lectureFeeTable tbody tr:not(.end-tr)").each(function() {
					var thisObj = $(this);
					sum += $yt_baseElement.rmoney(thisObj.find(".sum-pay").text());
				});
				//税后
				var after = 0;
				$("#lectureFeeTable tbody tr:not(.end-tr)").each(function() {
					var thisObj = $(this);
					after += $yt_baseElement.rmoney(thisObj.find(".after").text());
				});
				$("#lectureFeeTable .costTotal-after").text($yt_baseElement.fmMoney(after));
				$("#lectureFeeTable .costTotal").text($yt_baseElement.fmMoney(sum));
				//计算总金额
				personnelFunds.updateTotalNum();
				//调用初始化数据方法
				personnelFunds.initModel(personnelFunds.thisPopM);
				personnelFunds.initPopMTab();
				//				//隐藏页面中自定义的表单内容  
				//				$("#costPopModel.yt-edit-alert,#heard-nav-bak").hide();
				//				//隐藏蒙层  
				//				$("#pop-modle-alert").hide();
				$yt_alert_Model.prompt("填写的信息已成功加入到列表");
			}

		});
		//点击确定按钮方法
		$('#costPopModel.yt-edit-alert .yt-eidt-model-bottom .yt-model-save-btn').off().on("click", function() {
			var isFalse = $yt_valid.validForm(personnelFunds.thisPopM);
			if(isFalse) {
				var lecturerName = personnelFunds.thisPopM.find('.lecturerName option:selected').text();
				var lecturerProfessional = personnelFunds.thisPopM.find('.lecturerProfessional').text();
				var teachingHours = personnelFunds.thisPopM.find('.teachingHours').val();
				var courseName = personnelFunds.thisPopM.find('.courseName').val();
				var preTaxPay = personnelFunds.thisPopM.find('.preTaxPay').text();
				var afterTaxPay = personnelFunds.thisPopM.find('.afterTaxPay').val();
				var athPay = personnelFunds.thisPopM.find('.athPay').text();
				//隐藏input讲师val
				var lecturerNameVal = personnelFunds.thisPopM.find('.lecturerName option:selected').val();
				$(thisTr).find("td").eq(0).html('<input type="hidden" class="lectureId" value="' + lecturerNameVal + '">' + lecturerName);
				$(thisTr).find("td").eq(1).text(lecturerProfessional);
				$(thisTr).find("td").eq(2).text(teachingHours);
				$(thisTr).find("td").eq(3).text(courseName);
				$(thisTr).find("td").eq(4).text(preTaxPay);
				$(thisTr).find("td").eq(5).text(afterTaxPay);
				$(thisTr).find("td").eq(6).text(athPay);

				var sum = 0;
				$("#lectureFeeTable tbody tr:not(.end-tr)").each(function() {
					var thisObj = $(this);
					sum += $yt_baseElement.rmoney(thisObj.find(".sum-pay").text());
				});
				//税后
				var after = 0;
				$("#lectureFeeTable tbody tr:not(.end-tr)").each(function() {
					var thisObj = $(this);
					after += $yt_baseElement.rmoney(thisObj.find(".after").text());
				});
				$("#lectureFeeTable .costTotal-after").text($yt_baseElement.fmMoney(after));
				$("#lectureFeeTable .costTotal").text($yt_baseElement.fmMoney(sum));
				//计算总金额
				personnelFunds.updateTotalNum();
				//初始化数据
				personnelFunds.initModel(personnelFunds.thisPopM);
				//隐藏页面中自定义的表单内容  
				$("#costPopModel.yt-edit-alert,#heard-nav-bak").hide();
				//隐藏蒙层  
				$("#pop-modle-alert").hide();

			}
		});
	},
	//交通费弹窗方法
	carFeePopM: function(thisTr) {
		//点击取消方法 
		$('#costPopModel.yt-edit-alert .yt-eidt-model-bottom .yt-model-canel-btn,#costPopModel .closed-span').off().on("click", function() {
			//初始化数据
			personnelFunds.initModel(personnelFunds.thisPopM);
			//隐藏页面中自定义的表单内容
			$("#costPopModel.yt-edit-alert,#heard-nav-bak").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
		//点击添加方法
		$('#costPopModel.yt-edit-alert .yt-eidt-model-bottom .yt-model-sure-btn').off().on("click", function() {
			//验证当前弹窗对象
			var isFalse = $yt_valid.validForm(personnelFunds.thisPopM);
			if(isFalse) {
				/*获取数据*/
				//交通费

				/*	讲师姓名	lecturerName
					讲师级别	lecturerlevel
					出发日期	startTime
					到达日期	endTime
					出发地点	fromAddr
					到达地点	endAddr
					交通工具	vehicle
					城市间交通费	 carFare
					特殊说明	specialInstruct*/
				var lecturerName = personnelFunds.thisPopM.find('.lecturerName option:selected').text();
				var lecturerlevel = personnelFunds.thisPopM.find('.lecturerlevel').text();
				var startTime = personnelFunds.thisPopM.find('.startTime').val();
				var endTime = personnelFunds.thisPopM.find('.endTime').val();
				var fromAddr = personnelFunds.thisPopM.find("select.fromAddr option:selected").text();
				var endAddr = personnelFunds.thisPopM.find("select.endAddr option:selected").text();
				var vehicle1 = personnelFunds.thisPopM.find('.vehicle1 option:selected').text();
				var vehicle2 = personnelFunds.thisPopM.find('.vehicle2 option:selected').text();
				var carFare = personnelFunds.thisPopM.find('.carFare').val();
				var specialInstruct = personnelFunds.thisPopM.find('.specialInstruct').val();
				specialInstruct = specialInstruct == '' ? '无' : specialInstruct;
				//隐藏input
				var lecturerNameVal = personnelFunds.thisPopM.find('.lecturerName').val();
				var fromAddrVal = personnelFunds.thisPopM.find('.fromAddr').val();
				var endAddrVal = personnelFunds.thisPopM.find('.endAddr').val();
				var vehicle1Val = personnelFunds.thisPopM.find('.vehicle1').val();
				var vehicle2Val = personnelFunds.thisPopM.find('.vehicle2').val();
				/*添加到表格*/
				var thisHtml = "";
				thisHtml += '<tr pid="">' +
					'<td class="uname"><input type="hidden" class="lectureId" value="' + lecturerNameVal + '">' + lecturerName + '</td>' +
					'<td class="ulv">' + lecturerlevel + '</td>' +
					'<td class="sdate">' + startTime + '</td>' +
					'<td class="edate">' + endTime + '</td>' +
					'<td class="sadd"><input type="hidden" class="scode" value="' + fromAddrVal + '">' + fromAddr + '</td>' +
					'<td class="eadd"><input type="hidden" class="ecode" value="' + endAddrVal + '">' + endAddr + '</td>' +
					'<td class="tname"><input type="hidden" class="tool" value="' + vehicle1Val;
				if(vehicle2) {
					thisHtml += '-' + vehicle2Val;
				}
				thisHtml += '">' + vehicle1;
				if(vehicle2) {
					thisHtml += '-' + vehicle2;
				}
				thisHtml += '</td>' +
					'<td class="moneyText sum-pay">' + carFare + '</td>' +
					'<td style="" class="dec">' + specialInstruct + '</td>' +
					'<td><input type="hidden" class="popM" value="' + personnelFunds.tabIndex + '"/>' +
					'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
					'</td></tr>';
				$("#carFeeTable .yt-tbody tr").eq(-1).before(thisHtml);
				var sum = 0;
				$("#carFeeTable tbody tr:not(.end-tr)").each(function() {
					var thisObj = $(this);
					sum += $yt_baseElement.rmoney(thisObj.find(".sum-pay").text());
				});
				$("#carFeeTable .costTotal").text($yt_baseElement.fmMoney(sum));
				//计算总金额
				personnelFunds.updateTotalNum();
				//调用初始化数据方法
				personnelFunds.initModel(personnelFunds.thisPopM);
				personnelFunds.initPopMTab();
				//				//隐藏页面中自定义的表单内容  
				//				$("#costPopModel.yt-edit-alert,#heard-nav-bak").hide();
				//				//隐藏蒙层  
				//				$("#pop-modle-alert").hide();
				$yt_alert_Model.prompt("填写的信息已成功加入到列表");
			}

		});
		//点击确定按钮方法
		$('#costPopModel.yt-edit-alert .yt-eidt-model-bottom .yt-model-save-btn').off().on("click", function() {
			var isFalse = $yt_valid.validForm(personnelFunds.thisPopM);
			if(isFalse) {
				var lecturerName = personnelFunds.thisPopM.find('.lecturerName option:selected').text();
				var lecturerlevel = personnelFunds.thisPopM.find('.lecturerlevel').text();
				var startTime = personnelFunds.thisPopM.find('.startTime').val();
				var endTime = personnelFunds.thisPopM.find('.endTime').val();
				var fromAddr = personnelFunds.thisPopM.find("select.fromAddr option:selected").text();
				var endAddr = personnelFunds.thisPopM.find("select.endAddr option:selected").text();
				var vehicle1 = personnelFunds.thisPopM.find('.vehicle1 option:selected').text();
				var vehicle2 = personnelFunds.thisPopM.find('.vehicle2 option:selected').text();
				var carFare = personnelFunds.thisPopM.find('.carFare').val();
				var specialInstruct = personnelFunds.thisPopM.find('.specialInstruct').val();
				specialInstruct = specialInstruct == '' ? '无' : specialInstruct;
				//隐藏input
				var lecturerNameVal = personnelFunds.thisPopM.find('.lecturerName').val();
				var fromAddrVal = personnelFunds.thisPopM.find('.fromAddr').val();
				var endAddrVal = personnelFunds.thisPopM.find('.endAddr').val();
				var vehicle1Val = personnelFunds.thisPopM.find('.vehicle1').val();
				var vehicle2Val = personnelFunds.thisPopM.find('.vehicle2').val();

				var thisHtml = "";
				thisHtml += '<tr pid="">' +
					'<td class="uname"><input type="hidden" class="lectureId" value="' + lecturerNameVal + '">' + lecturerName + '</td>' +
					'<td class="ulv">' + lecturerlevel + '</td>' +
					'<td class="sdate">' + startTime + '</td>' +
					'<td class="edate">' + endTime + '</td>' +
					'<td class="sadd"><input type="hidden" class="scode" value="' + fromAddrVal + '">' + fromAddr + '</td>' +
					'<td class="eadd"><input type="hidden" class="ecode" value="' + endAddrVal + '">' + endAddr + '</td>' +
					'<td class="tname"><input type="hidden" class="tool" value="' + vehicle1Val;
				if(vehicle2) {
					thisHtml += '-' + vehicle2Val;
				}
				thisHtml += '">' + vehicle1;
				if(vehicle2) {
					thisHtml += '-' + vehicle2;
				}
				thisHtml += '</td>' +
					'<td class="moneyText sum-pay">' + carFare + '</td>' +
					'<td style="" class="dec">' + specialInstruct + '</td>' +
					'<td><input type="hidden" class="popM" value="' + personnelFunds.tabIndex + '"/>' +
					'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
					'</td></tr>';
				$(thisTr).replaceWith(thisHtml);
				var sum = 0;
				$("#carFeeTable tbody tr:not(.end-tr)").each(function() {
					var thisObj = $(this);
					sum += $yt_baseElement.rmoney(thisObj.find(".sum-pay").text());
				});
				$("#carFeeTable .costTotal").text($yt_baseElement.fmMoney(sum));
				//计算总金额
				personnelFunds.updateTotalNum();
				//初始化数据
				personnelFunds.initModel(personnelFunds.thisPopM);
				personnelFunds.initPopMTab();
				//隐藏页面中自定义的表单内容  
				$("#costPopModel.yt-edit-alert,#heard-nav-bak").hide();
				//隐藏蒙层  
				$("#pop-modle-alert").hide();

			}
		});
	},
	//住宿费弹窗方法
	hotelFeePopM: function(thisTr) {
		//点击取消方法 
		$('#costPopModel.yt-edit-alert .yt-eidt-model-bottom .yt-model-canel-btn,#costPopModel .closed-span').off().on("click", function() {
			//初始化数据
			personnelFunds.initModel(personnelFunds.thisPopM);
			//隐藏页面中自定义的表单内容
			$("#costPopModel.yt-edit-alert,#heard-nav-bak").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
		//人均花销：计算项，住宿费/住宿天数，保留两位小数   .avgCost .stayCost  .stayDays
		$(personnelFunds.thisPopM.find(".stayCost")).keyup(function() {
			var avgCost = 0;
			var stayCost = personnelFunds.thisPopM.find(".stayCost").val();
			var checkInDate = personnelFunds.thisPopM.find(".checkInDate").val();
			var leaveDate = personnelFunds.thisPopM.find(".leaveDate").val();
			if(stayCost && checkInDate && leaveDate) {
				if(personnelFunds.thisPopM.find("#stayDays").text() == 0) {
					avgCost = +$yt_baseElement.rmoney(personnelFunds.thisPopM.find(".stayCost").val());
				} else {
					avgCost = +$yt_baseElement.rmoney(personnelFunds.thisPopM.find(".stayCost").val()) / personnelFunds.thisPopM.find("#stayDays").text();
				}
			}
			personnelFunds.thisPopM.find(".avgCost").text($yt_baseElement.fmMoney(avgCost));

		});
		//点击添加方法
		$('#costPopModel.yt-edit-alert .yt-eidt-model-bottom .yt-model-sure-btn').off().on("click", function() {
			//验证当前弹窗对象
			var isFalse = $yt_valid.validForm(personnelFunds.thisPopM);
			if(isFalse) {
				/*获取数据*/
				/*hotelFeePopM
	        	 * 	讲师姓名		lecturerName
					入住日期		checkInDate
					离开日期		leaveDate
					人均花销		avgCost
					住宿天数		stayDays
					住宿费		stayCost
					特殊说明		specialInstruct
	        	 * */

				var lecturerName = personnelFunds.thisPopM.find('select.lecturerName option:selected').text();
				var checkInDate = personnelFunds.thisPopM.find('.checkInDate').val();
				var level = personnelFunds.thisPopM.find('.level').text();
				var leaveDate = personnelFunds.thisPopM.find('.leaveDate').val();
				var avgCost = personnelFunds.thisPopM.find('.avgCost').text();
				var stayDays = personnelFunds.thisPopM.find('.stayDays').text();
				var stayCost = personnelFunds.thisPopM.find('.stayCost').val();
				var specialInstruct = personnelFunds.thisPopM.find('.specialInstruct').val();
				specialInstruct = specialInstruct == '' ? '无' : specialInstruct;
				//隐藏input讲师val
				var lecturerNameVal = personnelFunds.thisPopM.find('select.lecturerName').val();
				//	        	alert(lecturerName);
				/*添加到表格*/
				$("#hotelFeeTable .yt-tbody tr").eq(-1).before('<tr>' +
					'<td class="name"><input type="hidden" class="level" value="' + level + '"><input type="hidden" class="lectureId" value="' + lecturerNameVal + '">' + lecturerName + '</td>' +
					'<td class="sdate">' + checkInDate + '</td>' +
					'<td class="edate">' + leaveDate + '</td>' +
					'<td class="moneyText avg">' + avgCost + '</td>' +
					'<td class="day">' + stayDays + '</td>' +
					'<td class="moneyText sum-pay">' + stayCost + '</td>' +
					'<td style="" class="dec">' + specialInstruct + '</td>' +
					'<td><input type="hidden" class="popM" value="' + personnelFunds.tabIndex + '"/>' +
					'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
					'</td></tr>');
				var sum = 0;
				$("#hotelFeeTable tbody tr:not(.end-tr)").each(function() {
					var thisObj = $(this);
					sum += $yt_baseElement.rmoney(thisObj.find(".sum-pay").text());
				});
				$("#hotelFeeTable .costTotal").text($yt_baseElement.fmMoney(sum));
				//计算总金额
				personnelFunds.updateTotalNum();
				//调用初始化数据方法
				personnelFunds.initModel(personnelFunds.thisPopM);
				personnelFunds.initPopMTab();
				//				//隐藏页面中自定义的表单内容  
				//				$("#costPopModel.yt-edit-alert,#heard-nav-bak").hide();
				//				//隐藏蒙层  
				//				$("#pop-modle-alert").hide();
				$yt_alert_Model.prompt("填写的信息已成功加入到列表");
			}

		});
		//点击确定按钮方法
		$('#costPopModel.yt-edit-alert .yt-eidt-model-bottom .yt-model-save-btn').off().on("click", function() {
			var isFalse = $yt_valid.validForm(personnelFunds.thisPopM);
			if(isFalse) {
				var lecturerName = personnelFunds.thisPopM.find('.lecturerName option:selected').text();
				var checkInDate = personnelFunds.thisPopM.find('.checkInDate').val();
				var leaveDate = personnelFunds.thisPopM.find('.leaveDate').val();
				var avgCost = personnelFunds.thisPopM.find('.avgCost').text();
				var stayDays = personnelFunds.thisPopM.find('.stayDays').text();
				var stayCost = personnelFunds.thisPopM.find('.stayCost').val();
				var specialInstruct = personnelFunds.thisPopM.find('.specialInstruct').val();
				specialInstruct = specialInstruct == '' ? '无' : specialInstruct;
				//隐藏input讲师val
				var lecturerNameVal = personnelFunds.thisPopM.find('.lecturerName').val();

				$(thisTr).find("td").eq(0).html('<input type="hidden" class="lectureId" value="' + lecturerNameVal + '">' + lecturerName);
				$(thisTr).find("td").eq(1).text(checkInDate);
				$(thisTr).find("td").eq(2).text(leaveDate);
				$(thisTr).find("td").eq(3).text(avgCost);
				$(thisTr).find("td").eq(4).text(stayDays);
				$(thisTr).find("td").eq(5).text(stayCost);
				$(thisTr).find("td").eq(6).text(specialInstruct);
				var sum = 0;
				$("#hotelFeeTable tbody tr:not(.end-tr)").each(function() {
					var thisObj = $(this);
					sum += $yt_baseElement.rmoney(thisObj.find(".sum-pay").text());
				});
				$("#hotelFeeTable .costTotal").text($yt_baseElement.fmMoney(sum));
				//计算总金额
				personnelFunds.updateTotalNum();
				//初始化数据
				personnelFunds.initModel(personnelFunds.thisPopM);
				personnelFunds.initPopMTab();
				//隐藏页面中自定义的表单内容  
				$("#costPopModel.yt-edit-alert,#heard-nav-bak").hide();
				//隐藏蒙层  
				$("#pop-modle-alert").hide();

			}
		});
	},
	//伙食费弹窗方法
	dietFeePopM: function(thisTr) {
		//点击取消方法 
		$('#costPopModel.yt-edit-alert .yt-eidt-model-bottom .yt-model-canel-btn,#costPopModel .closed-span').off().on("click", function() {
			//初始化数据
			personnelFunds.initModel(personnelFunds.thisPopM);
			//隐藏页面中自定义的表单内容
			$("#costPopModel.yt-edit-alert,#heard-nav-bak").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
		//伙食费：计算项，日平均花销*用餐天数，保留两位小数	.mealCost  .avgCost  .mealDays
		$(personnelFunds.thisPopM.find(".avgCost,.mealDays")).blur(function() {
			var mealCost = 0;
			if(personnelFunds.thisPopM.find(".avgCost").val() && personnelFunds.thisPopM.find(".mealDays").val()) {
				mealCost = $yt_baseElement.rmoney(personnelFunds.thisPopM.find(".avgCost").val()) * personnelFunds.thisPopM.find(".mealDays").val();
				personnelFunds.thisPopM.find(".mealCost").val($yt_baseElement.fmMoney(mealCost || '0'));
			} else {
				personnelFunds.thisPopM.find(".mealCost").val($yt_baseElement.fmMoney(mealCost || '0'));
			}
		});
		//点击添加方法
		$('#costPopModel.yt-edit-alert .yt-eidt-model-bottom .yt-model-sure-btn').off().on("click", function() {
			//验证当前弹窗对象
			var isFalse = $yt_valid.validForm(personnelFunds.thisPopM);
			if(isFalse) {
				/*获取数据*/
				/*dietFeePopM
	        	 * 	讲师姓名	lecturerName
					人均花销	avgCost
					用餐天数	mealDays
					伙食费		mealCost
					特殊说明	specialInstruct
	        	 * */
				var lecturerName = personnelFunds.thisPopM.find('.lecturerName option:selected').text();
				var avgCost = personnelFunds.thisPopM.find('.avgCost').val();
				var mealDays = personnelFunds.thisPopM.find('.mealDays').val();
				var mealCost = personnelFunds.thisPopM.find('.mealCost').val();
				var specialInstruct = personnelFunds.thisPopM.find('.specialInstruct').val();
				specialInstruct = specialInstruct == '' ? '无' : specialInstruct;
				//隐藏input讲师val
				var lecturerNameVal = personnelFunds.thisPopM.find('.lecturerName option:selected').val();
				/*添加到表格*/

				$("#dietFeeTable .yt-tbody tr").eq(-1).before('<tr pid="">' +
					'<td class="name"><input type="hidden" class="lectureId" value="' + lecturerNameVal + '">' + lecturerName + '</td>' +
					'<td class="avg">' + avgCost + '</td>' +
					'<td class="day">' + mealDays + '</td>' +
					'<td class="moneyText sum-pay">' + mealCost + '</td>' +
					'<td style="" class="dec">' + specialInstruct + '</td>' +
					'<td><input type="hidden" class="popM" value="' + personnelFunds.tabIndex + '"/>' +
					'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
					'</tr>');
				var sum = 0;
				$("#dietFeeTable tbody tr:not(.end-tr)").each(function() {
					var thisObj = $(this);
					sum += $yt_baseElement.rmoney(thisObj.find(".sum-pay").text() || '0');
				});
				$("#dietFeeTable .costTotal").text($yt_baseElement.fmMoney(sum || '0'));
				//计算总金额
				personnelFunds.updateTotalNum();
				//调用初始化数据方法
				personnelFunds.initModel(personnelFunds.thisPopM);
				personnelFunds.initPopMTab();
				//				//隐藏页面中自定义的表单内容  
				//				$("#costPopModel.yt-edit-alert,#heard-nav-bak").hide();
				//				//隐藏蒙层  
				//				$("#pop-modle-alert").hide();
				$yt_alert_Model.prompt("填写的信息已成功加入到列表");
			}

		});
		//点击确定按钮方法
		$('#costPopModel.yt-edit-alert .yt-eidt-model-bottom .yt-model-save-btn').off().on("click", function() {
			var isFalse = $yt_valid.validForm(personnelFunds.thisPopM);
			if(isFalse) {
				var lecturerName = personnelFunds.thisPopM.find('.lecturerName option:selected').text();
				var avgCost = personnelFunds.thisPopM.find('.avgCost').val();
				var mealDays = personnelFunds.thisPopM.find('.mealDays').val();
				var mealCost = personnelFunds.thisPopM.find('.mealCost').val();
				var specialInstruct = personnelFunds.thisPopM.find('.specialInstruct').val();
				specialInstruct = specialInstruct == '' ? '无' : specialInstruct;
				//隐藏input讲师val
				var lecturerNameVal = personnelFunds.thisPopM.find('.lecturerName option:selected').val();

				$(thisTr).find("td").eq(0).html('<input type="hidden" class="lectureId" value="' + lecturerNameVal + '">' + lecturerName);
				$(thisTr).find("td").eq(1).text($yt_baseElement.fmMoney(avgCost || '0'));
				$(thisTr).find("td").eq(2).text(mealDays);
				$(thisTr).find("td").eq(3).text($yt_baseElement.fmMoney(mealCost || '0'));
				$(thisTr).find("td").eq(4).text(specialInstruct);
				var sum = 0;
				$("#dietFeeTable tbody tr:not(.end-tr)").each(function() {
					var thisObj = $(this);
					sum += $yt_baseElement.rmoney(thisObj.find(".sum-pay").text() || '0');
				});
				$("#dietFeeTable .costTotal").text($yt_baseElement.fmMoney(sum || '0'));
				//计算总金额
				personnelFunds.updateTotalNum();
				//初始化数据
				personnelFunds.initModel(personnelFunds.thisPopM);
				personnelFunds.initPopMTab();
				//隐藏页面中自定义的表单内容  
				$("#costPopModel.yt-edit-alert,#heard-nav-bak").hide();
				//隐藏蒙层  
				$("#pop-modle-alert").hide();

			}
		});
	},
	//弹窗显示处理方法
	handlePopMShow: function(thisTr) {
		if(thisTr) {
			//修改操作
			//更新当前操作弹窗对象	
			personnelFunds.tabIndex = thisTr.find('input.popM').val();
			personnelFunds.thisPopM = $(".train-district .tab-info").eq(personnelFunds.tabIndex);
			$(".train-district .cost-type-tab li").eq(personnelFunds.tabIndex).addClass("tab-check").siblings().removeClass("tab-check");
			$(".train-district .tab-info").hide().eq(personnelFunds.tabIndex).show();
			$("#costPopModel.yt-edit-alert .yt-eidt-model-bottom .yt-model-sure-btn").addClass('yt-model-save-btn').text('确定');
		} else {
			//添加操作
			$("#costPopModel.yt-edit-alert .yt-eidt-model-bottom .yt-model-save-btn").removeClass('yt-model-save-btn').text('保存');
			//  		personnelFunds.initModel();
		}
	},
	/**
	 * 1.1.6.1	讲师信息：加入到列表[新增/修改]
	 * @param {Object} data
	 */
	addToListLecturerInfo: function(saveData, tr) {
		$.ajax({
			type: 'post',
			url: 'sz/lecturerApp/addToListLecturerInfo',
			data: saveData,
			success: function(data) {
				if(data.flag == 0) {
					saveData.professionalVal = saveData.professionalVal == '' ? '--' : 　saveData.professionalVal;
					saveData.levelVal = saveData.levelVal == '' ? '--' : 　saveData.levelVal;
					var html = '<tr pid="" lecturerTitleCode="' + saveData.lecturerTitleCode + '" lecturerLevelCode="' + saveData.lecturerLevelCode + '">' +
						'<td class="lecturerName"><input type="hidden" class="lectureId" value="' + data.data + '"><span>' + saveData.lecturerName + '</span></td>' +
						'<td class="professional">' + saveData.professionalVal + '</td>' +
						'<td class="level">' + saveData.levelVal + '</td>' +
						'<td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
						'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td></tr>';

					//添加到表格行数据
					if(tr) {
						tr.replaceWith(html);
					} else {
						$("#lecturerTable .yt-table .yt-tbody").append(html);
					}
					//重新设置表格事件
					personnelFunds.setLecturerTableEvent();
				}

			}
		});
	},
	/**
	 * 1.1.6.2	讲师信息：根据Id删除讲师信息
	 * @param {Object} data
	 * @param {Object} tr
	 */
	deleteLecturerInfo: function(thisId, thisTr) {
		thisTr.remove();
		//获取全部相关tr
		var lecturerTrs = $('.cost-apply-model tr');
		$.each(lecturerTrs, function(i, n) {
			//删除与该讲师有关tr
			if($(n).find("input.lectureId").val() == thisId) {
				//计算所有表格的合计
				/*获取当前对象的父级table*/
				var thisTable = $(n).parents('table');
				//合计金额变量
				var sum = 0;
				//移除对应的行
				$(n).remove();
				thisTable.find("tbody tr:not(.end-tr)").each(function() {
					var thisObj = $(this);
					sum += $yt_baseElement.rmoney(thisObj.find(".sum-pay").text());
				});
				//赋值合计金额
				thisTable.find(".costTotal").text($yt_baseElement.fmMoney(sum));
			}
		});
		//调用计算总额方法
		personnelFunds.updateTotalNum();

	}
}

function datedifference(sDate1, sDate2) { //sDate1和sDate2是2006-12-18格式  
	var dateSpan,
		tempDate,
		iDays;
	sDate1 = Date.parse(sDate1);
	sDate2 = Date.parse(sDate2);
	dateSpan = sDate2 - sDate1;
	dateSpan = Math.abs(dateSpan);
	iDays = Math.floor(dateSpan / (24 * 3600 * 1000));
	return iDays;
};

$(function() {
	personnelFunds.init();
})