var projectBreak = {
	//初始化方法
	init: function() {
		//调用获取列表数据方法
		projectBreak.getprojectBreakInf();
		$(".page-return-btn").click(function() {
			window.location.href = "projectBillList.html";
		})
		
		var projectName = $yt_common.GetQueryString("projectName");
		$(".project-name").text(decodeURI(decodeURI(projectName)));
	},

	/**
	 * 获取列表数据
	 */
	getprojectBreakInf: function() {
		var projectCode = $yt_common.GetQueryString("projectCode");
		$('.project-student-page').pageInfo({
			async: true,
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "finance/settlement/getNoDetailedList", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				projectCode:projectCode
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			before: function() {
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.project-company-tbody');
					var htmlTr = '';
					var htmlPlan = '';
					var trainingExpenseNegotiatedPriceSum = 0;
					var traineeNegotiatedPriceSum = 0;
					var quarterageNegotiatedPriceSum = 0;
					var mealFeeNegotiatedPriceSum = 0;
					var incidentalSum = 0;
					var should = 0;
					var already = 0;
					var account = 0;
					$(htmlTbody).empty()
					if(data.data.length > 0) {
						$.each(data.data, function(i, v) {
							htmlTr += '<tr>' +
								'<td style="text-align:left;">' + v.groupName + '</td>' +
								'<td style="text-align:right;word-wrap:break-word;">' + $yt_baseElement.fmMoney(v.trainingExpenseNegotiatedPrice) + '</td>' +
								'<td style="text-align:right;word-wrap:break-word;">' + $yt_baseElement.fmMoney(v.traineeNegotiatedPrice) + '</td>' +
								'<td style="text-align:right;word-wrap:break-word;">' + $yt_baseElement.fmMoney(v.quarterageNegotiatedPrice) + '</td>' +
								'<td style="text-align:right;word-wrap:break-word;">' + $yt_baseElement.fmMoney(v.mealFeeNegotiatedPrice) + '</td>' +
								'<td style="text-align:right;word-wrap:break-word;">' + $yt_baseElement.fmMoney(v.incidental) + '</td>' +
								'<td class="should" style="text-align:right;">' + Number(v.amountReceivable).toFixed(2) + '</td>' +
								'<td class="already" style="text-align:right;">' + Number(v.netReceipts).toFixed(2) + '</td>' +
								'<td class="account" style="text-align:right;">' + Number(v.uncollected).toFixed(2) + '</td>' +
								'<td class="" style="text-align:right;">' + v.reconciliationState + '</td>' +
								'</tr>';
							trainingExpenseNegotiatedPriceSum+=v.trainingExpenseNegotiatedPrice;
							traineeNegotiatedPriceSum+=v.traineeNegotiatedPrice;
							quarterageNegotiatedPriceSum+=v.quarterageNegotiatedPrice;
							mealFeeNegotiatedPriceSum+=v.mealFeeNegotiatedPrice;
							incidentalSum+=v.incidental;
							should += v.amountReceivable;
							already += v.netReceipts;
							account += v.uncollected;
						});
						htmlTbody.html(htmlTr);
						htmlPlan += '<tr>' +
							'<td style="font-weight: bold;">' + "小计" + '</td>' +
							'<td style="text-align:right;font-weight: bold;">' + $yt_baseElement.fmMoney(trainingExpenseNegotiatedPriceSum) + '</td>' +
							'<td style="text-align:right;font-weight: bold;">' + $yt_baseElement.fmMoney(traineeNegotiatedPriceSum) + '</td>' +
							'<td style="text-align:right;font-weight: bold;">' + $yt_baseElement.fmMoney(quarterageNegotiatedPriceSum) + '</td>' +
							'<td style="text-align:right;font-weight: bold;">' + $yt_baseElement.fmMoney(mealFeeNegotiatedPriceSum) + '</td>' +
							'<td style="text-align:right;font-weight: bold;">' + $yt_baseElement.fmMoney(incidentalSum) + '</td>' +
							'<td style="text-align:right;font-weight: bold;">' + Number(should).toFixed(2) + '</td>' +
							'<td style="text-align:right;font-weight: bold;">' + Number(already).toFixed(2) + '</td>' +
							'<td style="text-align:right;font-weight: bold;">' + Number(account).toFixed(2) + '</td>' +
							'<td style="text-align:right;font-weight: bold;"></td>' +
							'</tr>';
						htmlTbody.append(htmlPlan)
					} else {
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td class="project-student-td" colspan="5" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' + '<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' + '</div>' +
							'</td>' +
							'</tr>';
						htmlTbody.append(htmlTr)
					}
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	//项目类型设置
	projectTypeInfo: function(code) {
		if(code == 1) {
			return "计划";
		} else if(code == 2) {
			return "委托";
		} else if(code == 3) {
			return "选学";
		} else if(code == 4) {
			return "中组部调训";
		} else if(code == 5) {
			return "国资委调训";
		} else {
			return '';
		};
	},
}
$(function() {
	//初始化方法
	projectBreak.init();

});