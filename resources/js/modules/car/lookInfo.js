var caList = {

	//初始化方法
	init: function() {
		//调用弹窗
		caList.clearAlertBox();
		//初始化列表
		caList.updateCarInfo();
		//点击返回
		$('.page-return-btn').on('click', function() {
			window.location.href = "carInfoList.html";
		});
	},
	//点击新增清空弹窗内容
	clearAlertBox: function() {
		$('#carNum').text("");
		$('#carBrand').text("");
		$('#carModel').text("");
		$('#carColor').text("");
		$('#carSource').text("");
		$('#engineNumber').text("");
		$('#carBuyString').text("");
		$('#remarks').text("");
	},
	//查看车辆详情
	updateCarInfo: function() {
		$yt_baseElement.showLoading();
		//获取页面跳转传过来的pkid
		var pkId = $yt_common.GetQueryString("pkId");
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "administrator/car/getBeanById",
			data: {
				pkId: pkId
			},
			success: function(data) {
				$yt_baseElement.showLoading();
				if(data.flag == 0) {
					$('#carNum').text(data.data.carNum);
					var carType = data.data.carType;
					var getcarTypeList = caList.getcarTypeLis();
					$.each(getcarTypeList.data, function(i, n) {
						if(carType == n.pkId) {
							$('#carType').text(n.typeName);
						}
					});
					$('#carBrand').text(data.data.carBrand);
					$('#carModel').text(data.data.carModel);
					$('#carColor').text(data.data.carColor);
					$('#carSource').text(data.data.carSource);
					$('#engineNumber').text(data.data.engineNumber);
					$('#carBuyString').text(data.data.carBuyString);
					$('#remarks').text(data.data.remarks);
					var catStatesList = data.data.carStates;
					var htmlTbody = $('.list-table .yt-tbody');
					var htmlTr = '';
					catStatesList = $.parseJSON(catStatesList);
					if(catStatesList.length > 0) {
						$(htmlTbody).empty()
						var type = "";
						$.each(catStatesList, function(i, v) {
							if(v.types == "1") {
								type = "维修"
							} else {
								type = "报废"
							}
							htmlTr = '<tr>' +
								'<td style="padding-left: 10px;text-align:center;" class="recordDate">' + v.recordDate + '</td>' +
								'<td style="padding-left: 20px;text-align:center;" class="types">' + type + '</td>' +
								'<td style="padding-left: 20px;" class="details">' + v.details + '</td>' +
								'</tr>';
							htmlTbody.append($(htmlTr).data("legalData", v));
						});
					}

					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}
			}
		});
	},
	//获取车辆类型
	getcarTypeLis: function() {
		var list = [];
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "administrator/car/getType",
			data: {
				types: '1'
			},
			async: false,
			success: function(data) {
				list = data || [];
			}
		});
		return list;
	},

};
$(function() {
	//初始化方法
	caList.init();

});