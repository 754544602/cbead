var projectExpenditureList = {
	//初始化方法
	init: function() {

		//调用获取列表数据方法
		projectExpenditureList.getExpenditureListInf();
		
	},

	/**
	 * 获取列表数据
	 */
	getExpenditureListInf: function() {
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/settlement/getExpenditure",
			async: false,
			data: {},
			objName: 'data',
			success: function(data) {
				if(data.flag == 0) {
					var expenseDetails = data.data.expenseDetails;
					var expenseClassDetails = data.data.expenseClassDetails;
					var otherCost = data.data.otherCost;
					var expenseDetailsTbody = $('.expenseDetails-tbody');
					var expenseDetailsTr = '';
					var expenseClassDetailsTbody = $('.expenseClassDetails-tbody');
					var expenseClassDetailsTr = '';
					var otherCostTbody = $('.otherCost-tbody');
					var otherCostTr = '';

					var faresNum = 0;
					var changeFeeRefundNum = 0;
					var expenseMoneyNum = 0;
					$.each(expenseDetails, function(i, v) {
						expenseDetailsTr += '<tr>' +
							'<td>' + v.teacherId + '</td>' +
							'<td>' + v.teacherName + '</td>' +
							'<td>' + v.flighttrainNumber + '</td>' +
							'<td>' + v.placeDeparture + '</td>' +
							'<td>' + v.bourn + '</td>' +
							'<td>' + v.startEndTime + '</td>' +
							'<td>' + v.fares + '</td>' +
							'<td>' + v.changeFeeRefund + '</td>' +
							'<td>' + v.changeFeeRefundDetails + '</td>' +
							'<td>' + v.expenseMoney + '</td>' +
							'</tr>';
						faresNum += v.fares;
						changeFeeRefundNum += v.changeFeeRefund;
						expenseMoneyNum += v.expenseMoney;
					});
					expenseDetailsTr += '<tr>' +
							'<td>合计</td>' +
							'<td></td>' +
							'<td></td>' +
							'<td></td>' +
							'<td></td>' +
							'<td></td>' +
							'<td>' + faresNum + '</td>' +
							'<td></td>' +
							'<td>' + changeFeeRefundNum + '</td>' +
							'<td>' + expenseMoneyNum + '</td>' +
							'</tr>';
					expenseDetailsTbody.html(expenseDetailsTr);
					$yt_baseElement.hideLoading();
					var afterTaxNum = 0;
					var surrenderPersonalNum = 0;
					var expenseMoneyNum = 0;
					$.each(expenseClassDetails, function(i, v) {
						expenseClassDetailsTr += '<tr>' +
							'<td>' + v.teacherId + '</td>' +
							'<td>' + v.teacherName + '</td>' +
							'<td>' + v.papersType + '</td>' +
							'<td>' + v.papersNumber + '</td>' +
							'<td>' + v.registeredBank + '</td>' +
							'<td>' + v.account + '</td>' +
							'<td>' + v.courseDate + '</td>' +
							'<td>' + v.afterTax + '</td>' +
							'<td>' + v.surrenderPersonal + '</td>' +
							'<td>' + v.expenseMoney + '</td>' +
							'</tr>';
						afterTaxNum += v.afterTax;
						surrenderPersonalNum += v.surrenderPersonal;
						expenseMoneyNum += v.expenseMoney;
					});
					expenseClassDetailsTr += '<tr>' +
							'<td>合计</td>' +
							'<td></td>' +
							'<td></td>' +
							'<td></td>' +
							'<td></td>' +
							'<td></td>' +
							'<td></td>' +
							'<td>' + afterTaxNum + '</td>' +
							'<td>' + surrenderPersonalNum + '</td>' +
							'<td>' + expenseMoneyNum + '</td>' +
							'</tr>';
					expenseClassDetailsTbody.html(expenseClassDetailsTr);
					$yt_baseElement.hideLoading();
					var spendMoneyNum = 0;
					$.each(otherCost, function(i, v) {
						otherCostTr += '<tr>' +
							'<td class="costCode">' + v.costCode + '</td>' +
							'<td>' + v.costName + '</td>' +
							'<td style="padding: 0px;"><input type="number" class="spendMoney" style="width: 99%;height: 41px;border-radius: 4px;border:1px solid #ccc;" value="' + v.spendMoney + '" /></td>' +
							'<td style="padding: 0px;"><input class="details" style="width: 99%;height: 41px;border-radius: 4px;border:1px solid #ccc;" value="' + v.details + '" /></td>' +
							'</tr>';
						spendMoneyNum += v.spendMoney;
					});
					otherCostTr += '<tr>' +
							'<td>合计</td>' +
							'<td></td>' +
							'<td style="text-align: left;" class = "spendMoneyTotal">' + spendMoneyNum + '</td>' +
							'<td></td>' +
							'</tr>';
					otherCostTbody.html(otherCostTr);
					$yt_baseElement.hideLoading();
					//其他费用总计
					$("input.spendMoney").blur(function(){
						var firstSpendMoney = 0;
						$("input.spendMoney").each(function (i,n){
							firstSpendMoney = firstSpendMoney + parseFloat($(n).val());
						});
						$('.spendMoneyTotal').text(firstSpendMoney);
					});
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}
			}
		});
	}
}
$(function() {
	//初始化方法
	projectExpenditureList.init();

});