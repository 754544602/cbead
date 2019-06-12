var caList = {

	//初始化方法
	init: function() {
		
		//调用获取新闻稿详细信息
		caList.getOneListInfo();
		//初始化下拉列表
		$('select').niceSelect();
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
		//下一步操作人
		var nextPersonList = caList.getNextOperatePerson();
		if(nextPersonList != null) {
//			$("#dealingWithPeople").empty();
//			$("#dealingWithPeople").append('<option value="no">请选择下一步操作人</option>');
			$.each(nextPersonList, function(i, n) {
				$("#dealingWithPeople").append($('<option value="' + n.userCode + '">' + n.userName + '</option>').data("classData", n));
			});
			//初始化下一步操作人下拉框
			$("#dealingWithPeople").niceSelect();
		};
		//流程单选按钮
		$("input[type='radio']").change( function() {
		  	var rad = $(this).val();
		  	if (rad=="completed") {//同意显示下一步操作人下拉框
		  		if($('#tast-key').val() != "activitiEndTask") {
					$('.hid-input').show();
				} else {
					$('.hid-input').hide();
				}
		  	}else{//拒绝隐藏下一步操作人下拉框
		  		$('.hid-input').hide();
		  	}
		});
		//点击确定
		$('.yt-model-sure-btn').click(function() {
			caList.newsUpdateApply();
			//caList.init();
		});
		
		//点击取消
		$('.yt-model-canel-btn').click(function() {
			var pageNum = $yt_common.GetQueryString("pageNum");
			if(pageNum == 2){//跳转到待审批列表页面
				window.location.href = "lookForByBacklogList.html";
			}else{
				window.location.href = "newList.html";
			}
		});
	},

	/**
	 * 获下一步操作人
	 */
	getNextOperatePerson: function() {
		var list = [];
		var dataObj;
		var processInstanceId = $('#processInstanceId').val();
		var user = null;
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/workFlowOperate/getSubmitPageData",
			data: {
				businessCode: "news",
				processInstanceId: processInstanceId
			},
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					$.each(data.data, function(i, n) {
						for(var k in n) {
							user= n[k];
						}
					});
				}
			}
		});
		return user;
	},
	//审批记录获取新闻稿详细信息
	getOneListInfo: function() {
		var pkId = $yt_common.GetQueryString("pkId");
		var processInstanceId;
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/news/getBeanById",
			async: true,
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
					$('#details').html(data.data.details);
					var flowLog = data.data.flowLog;
					var middleStepHtml;
					var length=flowLog.length;
					var order;
					var flowLog = data.data.flowLog;
					var deleteReason= flowLog[0].deleteReason;
					var tastKey= flowLog[0].tastKey;
					$('#tast-key').val(tastKey);
					//满足条件代表审批的最后一步，下一步操作人下拉框隐藏
					if(tastKey == "activitiEndTask"){
						$('.hid-input').hide();
						$('#dealingWithPeople').setSelectVal("");
					}
					$.each(flowLog, function(i,v) {
						//最后一步
						if(i==0){
							//流程编号
							$('.last-step-order').text(length);
							//操作人名
							$('.last-step-operate-person-userName').text(v.userName);
							//操作状态
							$('.last-step-operationState').text(v.operationState);
							//停滞时间							
							$('.last-step-commentTime').text(v.commentTime);
							if($yt_common.user_info.userName!=v.userCode){
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
									$('.view-box-div').hide();
									$('.view-box-div').prev().hide();
									$('.yt-eidt-model-bottom').hide();
								}
						};
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
						if(i!=0 && i!= length-1){
							//流程序号
							order=length-i;
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
				}
			}
		});
		
	},
	//审批流程提交
	newsUpdateApply:function(){
		//获取跳转页面传过来的pkId
		var pkId = $yt_common.GetQueryString("pkId");
		//获取下一步操作人
		var dealingWithPeople=$('#dealingWithPeople').val();
		//获取审批意见
		var opintion=$('#opintion').val();
		//获取流程实例id
		var processInstanceId=$('#processInstanceId').val();
		//流程状态
		var tastKey = $('#tast-key').val();
		//获取单选按钮的值
		var nextCode = $("input:checked").val();
		//拒绝,或流程节点值为activitiEndTask下一步操作人为空
		if(nextCode=="returnedSubmit" || tastKey=="activitiEndTask"){
			dealingWithPeople="";
		};
		//下一步操作人为no审批提交时没有选择下一步操作人
		if (dealingWithPeople=="no") {
			$yt_alert_Model.prompt("请选择下一步操作人！", 3000);
		}else{
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "class/news/updateApply",
				async: false,
				data: {
					pkId: pkId,
					businessCode:"news",
					dealingWithPeople:dealingWithPeople,
					opintion:opintion,
					processInstanceId:processInstanceId,
					nextCode:nextCode
				},
				objName: 'data',
				success: function(data) {
					if(data.flag == 0) {
						$yt_alert_Model.prompt("提交成功");
					} else {
						$yt_alert_Model.prompt("提交失败");
					}
					//审批提交后跳转到审批列表页面
					window.location.href = "lookForByBacklogList.html";
				}
			});
		}
	}
	
	
	
	
}
$(function() {
	//初始化方法
	caList.init();

});