var meetingCostApply = {
	init: function() {
		//获取数据字典
		//meetingCostApply.getDictInfoByTypeCode();

		$("#saveBtn").off().on("click", function() {
			/** 
			 * 调用验证方法 
			 */
			$yt_valid.validForm($("#meetingDiv"));
		});
		/** 
		 * 金额文本框获取焦点事件 
		 */
		$(".get-accommodation,.get-food,.get-other").on("focus", function() {
			if($(this).val() != "") {
				//调用还原格式化的方法  
				$(this).val($yt_baseElement.rmoney($(this).val()));
			}
		});
		/** 
		 * 金额文本框失去焦点事件 
		 */
		$(".get-accommodation,.get-food,.get-other").on("blur", function() {
			if($(this).val() != "") {
				//调用格式化金额方法  
				$(this).val($yt_baseElement.fmMoney($(this).val()));
			}
		});
		meetingCostApply.getTotalMoney();
		meetingCostApply.getInputChage();
	},
	//会期标识类
	getInputChage: function() {
		$("#calculationSession").change(function() {
			$("#calculationSession").removeClass("calculation-Identification");
		})
	},
	//获取伙食费，住宿费，其他费计算，每次每个input失去焦点都计算一次
	getTotalMoney: function() {
		$(".get-accommodation,.get-food,.get-other").on("blur", function() {
			var accommodation = $yt_baseElement.rmoney($(".get-accommodation").val() || '0');
			var food = $yt_baseElement.rmoney($(".get-food").val() || '0');
			var other = $yt_baseElement.rmoney($(".get-other").val() || '0');
			var total = accommodation + food + other;
			if(total !== 0) {
				$("#costTotal,.count-val-num").css("color", "#333333").text($yt_baseElement.fmMoney(total));
				//大写转化
				$('.total-money-up,#TotalMoneyUpper').text(arabiaToChinese(total));
			} else {
				$("#costTotal").css("color", "#999").text("住宿费+伙食费+其他费用");
			}
			meetingCostApply.getDayMoney();
		});
	},
	getDayMoney: function() {
		if($("#calculationSession").hasClass('calculation-Identification')) {
			$("#dailyAverageConsumption").css("color", "#999").text("费用合计/【(参会人数+工作人员数量）*会期】")
		} else {
			var accommodation = $yt_baseElement.rmoney($(".get-accommodation").val() || '0');
			var food = $yt_baseElement.rmoney($(".get-food").val() || '0');
			var other = $yt_baseElement.rmoney($(".get-other").val() || '0');
			//参会人数
			var meetOfNum = +($('#meetOfNum').val());
			//工作人员数量
			var meetWorkerNum = +($('#meetWorkerNum').val());
			//总金额
			var total = accommodation + food + other;
			//会期
			var numData = +($("#calculationSession").val());
			//计算
			var result = total / [(meetOfNum + meetWorkerNum) * numData];
			if(result == Infinity) {
				result = 0;
			}
			if(result != undefined) {
				$("#dailyAverageConsumption").css("color", "#333333").text($yt_baseElement.fmMoney(result));
			}
		}
	},
	//初始化日期控件并计算
	getData: function() {
		//开始日期
		$("#startTime").calendar({
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $("#endTime"), //开始日期最大为结束日期 
			speed: 0,
			callback: function() {
				//调用公用的清除验证信息方法
				sysCommon.clearValidInfo($("#startTime"));
				//开始日期
				var tdStartDate = $("#startTime").val();
				//结束日期
				var tdEndDate = $('#endTime').val();
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
					meetingCostApply.getDayMoney();
				}
			}
		});
		//离开日期
		$("#endTime").calendar({
			nowData: false, //默认选中当前时间,默认true  
			lowerLimit: $("#startTime"), //结束日期最小为开始日期  
			speed: 0,
			callback: function() {
				//调用公用的清除验证信息方法
				sysCommon.clearValidInfo($("#endTime"));
				//入住日期
				var tdStartDate = $("#startTime").val();
				//结束日期
				var tdEndDate = $('#endTime').val();
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
					meetingCostApply.getDayMoney();
				}
			}
		});
	},
	getDictInfoByTypeCode: function(code) {
		$.ajax({
			type: "post",
			url: "basicconfig/dictInfo/getDictInfoByTypeCode",
			async: true,
			data: {
				dictTypeCode: 'MEET_CODE'
			},
			success: function(data) {
				//获取数据list
				var list = data.data || [];
				//初始化HTML文本
				var start = '<option value="">请选择</option>';
				//循环添加文本
				$.each(list, function(i, n) {
					start += '<option ' + (code == n.value ? 'selected="selected"' : '') + ' value="' + n.value + '">' + n.disvalue + '</option>';
				});
				//替换页面代码
				$('#meetingClassification').html(start).niceSelect();
			}
		});
	},
}
$(function() {
	//	下拉框初始化
	$("#meetingDiv select").niceSelect();
	meetingCostApply.init();
	meetingCostApply.getData();
})