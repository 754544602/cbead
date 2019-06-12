var costInfo = {
	//初始化方法
	init: function() {
		costInfo.getcostInfo();
		//点击返回
		$('.page-return-btn').on('click', function() {
			window.location.href = "borrowList.html";
		});
	},
	//获取一条信息
	getcostInfo: function() {
		var pkId = $yt_common.GetQueryString("pkId");
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/reduction/getBeanById",
			async: true,
			data: {
				pkId: pkId
			},
			objName: 'data',
			success: function(data) {
				
				$yt_baseElement.hideLoading();
				if(data.flag == 0) {
					$.each(data.data, function(i, v) {
						
						//遍历审批流程信息
						//流程
						var flowLog = JSON.parse(v.flowLog);
						var middleStepHtml;
						var length = flowLog.length;

						$.each(flowLog, function(i, v) {
							
							//给隐藏数据input添加值
							$('.hid-process-instance-id').val(v.processInstanceId);
							if(i > 0) {
								$('.middle-step-box-div').css("border-left", "8px solid #B5C2D4");
							}
							
							var order = length - i;
							middleStepHtml = '<div>' +
								'<div>' +
								'<div class="number-name-box">' +
								'<span class="number-box-span middle-step-order middle-a-index" >' + order + '</span>' +
								'<span class="name-box-span middle-step-userName middle-a-index" >' + v.userName + '</span>' +
								'<img src="../../resources/images/open/open-sp.png" class="order-img" />' +
								'</div>' +
								'</div>' +
								'<div class="middle-step-box-div" style="border: none;">' +
								'<ul class="middle-step-box-ul">' +
								'<li style="height: 30px;">' +
								'<span  class="middle-step-taskName view-taskName-span operation-state"  style="float: left;">' + v.operationState + '</span>' +
								'</li>' +
								'<li class="view-time-li middle-step-commentTime"style="width: auto;white-space:nowrap;"  >' + v.commentTime + '</li>' +
								'<li class="operate-view-box-li">' +
								'<div class="operate-view-title-li">操作意见：</div>' +
								'<div class="operate-view-text-li middle-step-comment">' + v.comment + '</div>' +
								'</li>' +
								'</ul>' +
								'</div>' +
								'</div>';
							$('.first-step').before(middleStepHtml);
						});
						$yt_baseElement.hideLoading();

					});
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}
			}
		});
	},
	
}
$(function() {
	//初始化方法
	costInfo.init();

});