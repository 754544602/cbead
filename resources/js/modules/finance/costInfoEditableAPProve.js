var approveList = {
	init:function(){
		approveList.getcostInfoEditable();
	},
	//获取一条信息
	getcostInfoEditable: function() {
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
			success: function(data) {
				//hide
				$yt_baseElement.hideLoading();
				if(data.flag == 0) {
					var v = data.data;
					
						var projectName = v.projectName;
						$('.create-user').text(v.createUser);
						$('.dept-name').text(v.deptName);
						$('.create-time-string').text(v.createTimeString);
						$('.work-flaw-state').text(v.workFlawState);
						var reductionDetailsJSON = $.parseJSON(v.reductionDetails)
						var htmlTr = "";
						var htmlTbody = $(".project-tbody");
						htmlTbody.html("");
						//遍历所属项目
						$.each(reductionDetailsJSON, function(i, n) {
							htmlTr = '<tr>' +
								'<td class="types" style="text-align: center;">' + costInfo.projectTypeInfo(n.types) + '</td>' +
								'<td style="text-align: center;">' + n.reductionExemption + '</td>' +
								'<td style="text-align: center;">' + n.preReliefStandard + '</td>' +
								'<td style="text-align: center;">' + n.postRemissionStandard + '</td>' +
								'<td style="text-align: center;">' + n.postRemissionMoney + '</td>' +
								'</tr>';
							htmlTbody.append(htmlTr);
						});
						htmlTrOnly = '<tr style="display:none">' +
							'<input class="project-name-input" val="' + v.projectName + '"/>' +
							'</tr>';
						htmlTbody.append(htmlTrOnly);
						//遍历审批流程信息
						//流程
						var flowLog = JSON.parse(v.flowLog);
						var middleStepHtml;
						var length = flowLog.length;
						var commentLi;
						if (flowLog.length >=0) {
							
							$.each(flowLog, function(i, v) {
								
								if(i > 0) {
									$('.middle-step-box-div').css("border-left", "8px solid #B5C2D4");
								}
								var order = length - i;
								commentLi = '<li class="operate-view-box-li">' +
										'<div class="operate-view-title-li">操作意见：</div>' +
										'<div class="operate-view-text-li middle-step-comment">' + v.comment + '</div>' +
									'</li>' ;
								if(i == length-1){//审批流第一步
									commentLi ="";
								}
								
								middleStepHtml = '<div>' +
									'<div>' +
									'<div class="number-name-box">' +
									'<span class="number-box-span middle-step-order middle-a-index" >' + order + '</span>' +
									'<span class="name-box-span middle-step-userName middle-a-index" >' + v.userName + '</span>' +
									'<img src="../../resources/images/open/openFlow.png" class="order-img" />' +
									'</div>' +
									'</div>' +
									'<div class="middle-step-box-div" style="border: none;">' +
									'<ul class="middle-step-box-ul">' +
									'<li style="height: 30px;">' +
									'<span  class="middle-step-taskName view-taskName-span operation-state"  style="float: left;">' + v.operationState + '</span>' +
									'</li>' +
									'<li class="view-time-li middle-step-commentTime"style="width: 360px;text-align:right;white-space:nowrap;"  >' + v.commentTime + '</li>' +commentLi+
									'</ul>' +
									'</div>' +
									'</div>';
								$('.first-step').before(middleStepHtml);
							});
						}
						$yt_baseElement.hideLoading();

					
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}
				var operationState = $('.operation-state').text();
				if(operationState == "") {
					$('.operationState').text("操作状态");
				};
				var remissionCause = $('.remission-cause').text();
				if(remissionCause == "") {
					$('.remission-cause-div').css("float", "none");
				};
			}
		});
	}

};

$(function() {
	//初始化方法
	approveList.init();

});