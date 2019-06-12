var costInfo = {
	//初始化方法
	init: function() {
		costInfo.getcostInfo();
		//点击返回
		$('.page-return-btn').on('click', function() {
			//满足条件是从审批页面跳转过来的
			var backType = $yt_common.GetQueryString("backType");
			if (backType == "f1" || backType == "f2" || backType == "j1" || backType == "j2") {
				window.location.href = "myApproveList.html?backType="+backType;
			}
		});
		//审批意见提交
		$('#last-submit').click(function(){
				//下一步操作人
				var dealingWithPeople=$('#next-people').val();
				var pkId = $yt_common.GetQueryString("pkId");
				//流程实例id
				var processInstanceId=$('.hid-process-instance-id').val();
				
				
				//审批意见
				var opintion=$('#opintion').val();
				//判断同意和不同意
				var nextCode = $('input[name="radioType"]:checked ').val();
				var tastKey = $('.hid-tast-key').val();
				//拒绝,或流程节点值为activitiEndTask下一步操作人为空
				if(nextCode=="returnedSubmit" || tastKey=="activitiEndTask"){
					dealingWithPeople="";
				}
				
				//下一步操作人为no审批提交时没有选择下一步操作人
				if (dealingWithPeople=="no") {
					$yt_alert_Model.prompt("请选择下一步操作人！", 3000);
				}else{
				$.ajax({
					type: "post",
					url: $yt_option.base_path + "finance/reduction/updateApply",
					async: false,
					data: {
						pkId: pkId,
						businessCode:"reduction",
						processInstanceId:processInstanceId,
						dealingWithPeople:dealingWithPeople,
						opintion:opintion,
						nextCode:nextCode
					},
					success: function(data) {
						if(data.flag == 0) {
							costInfo.getcostInfo();
						};
					}
				});
				window.location.href = "myApproveList.html";
			}
		});
		//审批取消
		$('#last-cancel').click(function(){
			//跳转到审批列表页面
			window.location.href = "myApproveList.html";
		});
		
		
		
		$("#next-people").niceSelect();
		//流程单选按钮,选择拒绝隐藏下一步操作人下拉框
		$(".check-label input[type='radio']").change( function() {
		  	var rad = $(this).val();
		  	var tastKey = $('.hid-tast-key').val();
		  	//单选当前值为1同意显示下一步操作人下拉框
		  	if (rad=="completed") {//点击同意
		  		if(tastKey=="activitiEndTask" ){//判断流程节点符合条件隐藏下一步操作人下拉框
		  			$('.hid-input').hide();
		  		}else{//隐藏下一步操作人下拉框
		  			$('.hid-input').show();
		  		}
		  		
		  	};
		  	//单选当前值为0拒绝隐藏下一步操作人下拉框
		  	if (rad=="returnedSubmit") {
		  		$('#next-people').setSelectVal("");
		  		$('.hid-input').hide();
		  	}
		});
	},
	
	
	//下一步操作人
	getNextOperatePerson:function(){
		var getAllNextPeople = costInfo.getworkFlowOperate();
		if (getAllNextPeople !=null){
			$.each(getAllNextPeople,function (i,n){
				$("#next-people").append('<option value="'+n.userCode+'">'+n.userName+'</option>');
			});
		};
		$("#next-people").niceSelect();
	},
	//获取费用减免下一步操作人
	getworkFlowOperate:function(){
		var processInstanceId = $('.hid-process-instance-id').val();
		var user;
		$.ajax({
			type: "post",
			url: $yt_option.base_path+"uniform/workFlowOperate/getSubmitPageData",
			data:{
				//费用减免businessCode值为reduction
				businessCode:"reduction",
				processInstanceId:processInstanceId
			},
			async: false,
			success: function(data) {
				$.each(data.data, function(i, n) {
					for(var k in n) {
						user = n[k];
					}
				});
			}
		});
		return user;
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
				//获取流程实例id
				$('.hid-process-instance-id').val(data.data.processInstanceId);
				//hide
				$yt_baseElement.hideLoading();
				if(data.flag == 0) {
						var v = data.data;
						$('.create-user').text(v.createUser);
						$('.dept-name').text(v.deptName);
						$('.create-time-string').text(v.createTimeString);
						$('.post-remission-money').text(v.postRemissionMoney);
						$('.remission-cause').text(v.remissionCause);
						$('.project-code').text(v.projectCode);
						$('.project-name').text(v.projectName);
						if(v.projectType==2){
							v.projectTypeVal='委托'
						}else if(v.projectType==3){
							v.projectTypeVal='选学'
						}else if(v.projectType==4){
							v.projectTypeVal='中组部调训'
						}else if(v.projectType==5){
							v.projectTypeVal='国资委调训'
						}
						$('.project-type').text(v.projectTypeVal);
						$('.project-head').text(v.projectHead);
						$('.class-teacher').text(v.classTeacher);
						$('.start-date').text(v.startDate);
						$('.end-date').text(v.endDate);
						$('.work-flaw-state').text(v.workFlawState);
						var reductionDetailsJSON = $.parseJSON(v.reductionDetails)
						var htmlTr = "";
						var htmlTbody = $(".project-tbody");
						htmlTbody.html("");
						//遍历所属项目
						if(reductionDetailsJSON.length > 0) {
							$.each(reductionDetailsJSON, function(i, n) {
								htmlTr = '<tr>' +
									'<td style="text-align:center" class="types-td"><input class="types-input" style="display: none;" value="' + n.types + '"/>' + costInfo.costTypeInfo(n.types) + '</td>' +
									'<td style="text-align:right" class="reduction-exemption-td">' + n.reductionExemption + '</td>' +
									'<td style="text-align:right" class="pre-relief-standard-td">' + n.preReliefStandard + '</td>' +
									'<td style="text-align:right" class="post-remission-standard-td">' + n.postRemissionStandard + '</td>' +
									'<td style="text-align:right" class="post-remission-money-td">' + n.postRemissionMoney + '</td>' +
									'<td style="text-align:left" class="remarks-td">' + n.remarks + '</td>' +
									'</tr>';
								htmlTbody.append(htmlTr);
							});
						} else {
							htmlTr = '<tr class="null" style="border:0px;background-color:#fff !important;" >' +
								'<td colspan="6" align="center" style="border:0px;">' +
								'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
								'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
								'</div>' +
								'</td>' +
								'</tr>';
							htmlTbody.html(htmlTr);
						}
						//遍历审批流程信息
						//流程
						var flowLog = JSON.parse(v.flowLog);
						var middleStepHtml;
						var length = flowLog.length;
						$.each(flowLog, function(i, v) {
							//最后一步
							if(i==0){
								//隐藏下一步操作人下拉框
								if(v.tastKey=="activitiEndTask"){
									$('.hid-tast-key').val(v.tastKey);
									$('.next-operate-person-tr').hide();
								}
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
																	'<div class="operate-view-text-li middle-step-comment">'+v.comment+'</div>'+
																'</li>'+
															'</ul>'+
														'</div>'+
													'</div>';
									$('.last-step').append(middleStepHtml);
									$('.view-box-div').hide();
									$('.name-box-span.last-step-operate-person-userName').parents('.number-name-box ').hide();
									$('.yt-eidt-model-bottom').hide();
								}
							};
							//如果i等于length-1是流程的第一步
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
							if(i!=0 && i < length-1){
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
																'<div class="operate-view-text-li middle-step-comment">'+v.comment+'</div>'+
															'</li>'+
														'</ul>'+
													'</div>'+
												'</div>';
								$('.last-step').append(middleStepHtml);
								$yt_baseElement.hideLoading();
							}
						});
						//调用获取下一步操作人
						costInfo.getNextOperatePerson();
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
					$('.remission-cause-div').css("float","none");
				};
			}
		});
	},
	//费用类型设置
	costTypeInfo: function(code) {
		if(code == 1) {
			return "培训费";
		} else if(code == 2) {
			return "课程费";
		} else if(code == 3) {
			return "住宿费";
		} else if(code == 4) {
			return "餐费";
		} else if(code == 5) {
			return "杂费";
		} else if(code == 6) {
			return "场地使用费";
		} else if(code == 7) {
			return "会务费";
		} else if(code == 8) {
			return "其他";
		} else {
			return '';
		};
	},
}
$(function() {
	//初始化方法
	costInfo.init();

});