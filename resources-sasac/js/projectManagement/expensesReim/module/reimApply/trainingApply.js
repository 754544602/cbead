var personnelFunds = {
	init: function() {

		//显示附件名称
		$('.cont-file').on('change', function() {
			var ithis = $(this);
			var val = ithis.val();
			var parent = ithis.parent();
			parent.prev().find('.file-msg').text(val).css('color', '#333');
			$('.file-box').append('<div class="li-div"><span>' + val + '</span><span class="del-file">x</span></div>');
		});
		$('.file-box').on('click','.del-file',function(){
			var ithis = $(this);
			var parent = ithis.parent();
			$yt_alert_Model.alertOne({
				alertMsg: "数据删除将无法恢复,确认删除吗?",
				confirmFunction: function() {
	                parent.remove();
	            },
			});
		});

		$('#payDate').calendar({
			speed:0,
			nowData: false
		});

		//弹出表单
		$("#addCostApplyBtn").click(function() {
			$("#model-add-list-btn").removeClass("update").addClass("save").text("加入到列表");
			$(".tab-info").hide().eq(0).show();
			$(".cost-type-tab li").removeClass("tab-check").eq(0).addClass("tab-check");
			$(".tab-top").hide();
			//调用 显示费用明细弹出框方法
			sysCommon.showModel($("#cost-apply-model"));
		});
		//关闭弹出框表单
		$("#model-canel-btn").click(function() {
			//调用关闭可编辑弹出框方法
			sysCommon.closeModel($("#cost-apply-model"));
			//调用公共用的清空表单数据方法
			sysCommon.clearFormData();
		});
		//表单加入列表
		$("#model-add-list-btn").click(function() {
			if($(this).hasClass("save")) {
				var tabIndex = $(".cost-type-tab li.tab-check").index();
				var trHtml = '';
				switch(tabIndex) {
					case 0:
						trHtml = '<tr>' +
							'<td>400</td>' +
							'<td>3</td>' +
							'<td>50</td>' +
							'<td>50</td>' +
							'<td>' +
							'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>' +
							'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>' +
							'</td></tr>';
						break;
					case 1:
						trHtml = '<tr>' +
							'<td>XXX</td>' +
							'<td>XXX</td>' +
							'<td>500</td>' +
							'<td>4</td>' +
							'<td>100</td>' +
							'<td>' +
							'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>' +
							'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>' +
							'</td></tr>';
						break;
					case 2:
						trHtml = '<tr>' +
							'<td><span>XXX</span></td><td>XXXXX</td>' +
							'<td data-text="goTime">2018-01-01</td><td data-text="goAddress">天津</td><td data-text="arrivalTime">2018-01-01</td>' +
							'<td data-text="arrivalAddress">北京</td>' + '<td><span>XXX</span>' +
							'<input class="hid-child-code" type="hidden" value=""/></td>' +
							'<td class="font-right money-td" data-text="crafare">201.12</td>' +
							'<td class="text-overflow-sty" title="" data-text="remarks">XXXXXXXX</td>' +
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
					$(".tab-info").hide().eq(modelIndex).show();
					$(".cost-type-tab li").removeClass("tab-check").eq(modelIndex).addClass("tab-check");
					$(".tab-top").show();
					$("#model-add-list-btn").removeClass("save").addClass("update").text("保存");
					//调用 显示费用明细弹出框方法
					sysCommon.showModel($("#cost-apply-model"));
				});
				$(".traffic-cost-model").eq(tabIndex).find(".yt-tbody").append(trHtml);
			} else {

			}

			personnelFunds.updateTotalNum();
			//调用关闭可编辑弹出框方法
			sysCommon.closeModel($("#cost-apply-model"));
			//调用公共用的清空表单数据方法
			sysCommon.clearFormData();

		});
		//tab切换方法
		$(".cost-type-tab li").click(function() {
			$(this).addClass("tab-check").siblings().removeClass("tab-check");
			var tabIndex = $(this).index();
			$(".tab-info").hide().eq(tabIndex).show();
		});
		//初始化下拉列表
		$('.yt-select').niceSelect();
		//初始化事件控件
		$("#traffic-start-time").calendar({
			controlId: "trafficStartTime",
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $("#traffic-end-time"), //开始日期最大为结束日期  
			speed: 0,
			callback: function() {
				//调用公用的清除验证信息方法
				sysCommon.clearValidInfo($("#traffic-start-time"));
			}
		});
		$("#traffic-end-time").calendar({
			controlId: "trafficEndTime",
			nowData: false, //默认选中当前时间,默认true  
			lowerLimit: $("#traffic-start-time"), //结束日期最小为开始日期
			speed: 0,
			callback: function() {
				//调用公用的清除验证信息方法
				sysCommon.clearValidInfo($("#traffic-end-time"));
			}
		});

	},
	updateTotalNum: function() {
		var fundsTotalNum = 0;
		$(".money-td").each(function() {
			fundsTotalNum += $yt_baseElement.rmoney($(this).text());
		});
		$("#applySumMoney").text(fundsTotalNum);
		var sumMoneyLower = arabiaToChinese(fundsTotalNum + "");
		$("#applyMoneyLower").text(sumMoneyLower);
	}

}

$(function() {
	personnelFunds.init();
})