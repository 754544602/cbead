var caList = {

	//初始化方法
	init: function() {
		//点击返回
		$('.page-return-btn').off().on("click", function() {
			var projectCode = $('.projectCode').val(); //获取班级编号
			var pageNum = $yt_common.GetQueryString("pageNum");
			if(pageNum == 2){//跳转到待审批列表页面
				window.location.href = "lookForByBacklogList.html";
			}else{
				window.location.href = "newList.html";
			}
			
		});
		caList.getOneListInfo();
		
	},

	
	//审批获取新闻稿详细信息
	getOneListInfo: function() {
		
		$yt_baseElement.showLoading();
		var pkId = $yt_common.GetQueryString("pkId");
		var processInstanceId;
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/news/getBeanById",
			async: false,
			data: {
				pkId: pkId
			},
			objName: 'data',
			success: function(data) {
				//流程实例ID
				processInstanceId=data.data.processInstanceId;
				//把processInstanceId放到隐藏的input标签里面
				$('#processInstanceId').val(processInstanceId);
				if(data.flag == 0) {
					//班级名
					$('#projectCode').text(data.data.projectName);
					//项目主任
					$('#projectUserName').text(data.data.projectUserName);
					//标题
					$('#title').text(data.data.title);
					//发布时间
					$('#issueDayeString').text(data.data.issueDayeString);
					//新闻稿内容
					//
					$('#details').html(data.data.details);
					var flowLog = data.data.flowLog;
					var middleStepHtml;
					var length=flowLog.length;
					$.each(flowLog, function(i,v) {
						//第一步
						if(i==length-1){
							//流程编号
							$('.first-step-order').text(1);
							//操作人名
							$('.first-step-operate-person-userName').text(v.userName);
							//当前审批节点名字
							$('.first-step-taskName').text(v.operationState);
							//时间
							$('.first-step-commentTime').text(v.commentTime);
						};
						//如果i不等于且不等于length-1，是流程的中间步骤
						if(i < length-1){
							//流程序号
							var order=length-i;
							middleStepHtml='<div>'+	
												'<div style="height: 150; ">'+
													'<div class="number-name-box">'+
														'<span class="number-box-span middle-step-order middle-a-index" >'+order+'</span>'+
														'<span class="name-box-span middle-step-userName middle-a-index" >'+v.userName+'</span>'+
														'<img src="../../resources/images/open/openFlow.png" class="order-img" />'+
													'</div>'+
												'</div>'+
												'<div class="middle-step-box-div">'+
													'<ul class="middle-step-box-ul">'+
														'<li style="height: 30px;">'+
															'<span  class="middle-step-taskName view-taskName-span"  style="float: left;">'+v.operationState+'</span>'+
														'</li>'+
														'<li class="view-time-li middle-step-commentTime" >'+v.commentTime+'</li>'+
														'<li class="operate-view-box-li">'+
															'<div class="operate-view-title-li">操作意见：</div>'+
															'<div class="operate-view-text-li middle-step-comment" style="padding-left: 10px;">'+v.comment+'</div>'+
														'</li>'+
													'</ul>'+
												'</div>'+
											'</div>';
							$('.last-step').append(middleStepHtml);
						};
					});
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function (){
						$yt_alert_Model.prompt("查询失败");
					});
				}
			}
		});
		
	},
}
$(function() {
	//初始化方法
	caList.init();

});