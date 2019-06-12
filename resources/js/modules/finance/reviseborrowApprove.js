var borrowInfo = {
	//初始化方法
	init: function() {
		borrowInfo.getBorrowInfo();
		$("#nextPeople").niceSelect();
		//流程单选按钮,选择拒绝隐藏下一步操作人下拉框
		$(".check-label input[type='radio']").change( function() {
			var tastKey = $('.hid-tast-key').val();
		  	var rad = $(this).val();
		  	//单选当前值为1同意显示下一步操作人下拉框
		  	if (rad=="completed") {
		  		if(tastKey=="activitiEndTask" ){//判断流程节点符合条件隐藏下一步操作人下拉框
		  			$('.hid-input').hide();
		  		}else{//显示下一步操作人下拉框
		  			$('.hid-input').show();
		  		}
		  	};
		  	//单选当前值为0拒绝隐藏下一步操作人下拉框
		  	if (rad=="returnedSubmit") {
		  		$('#nextPeople').val("");
		  		$('.hid-input').hide();
		  	}
		});
		
		//审批意见提交
		$('#last-submit').click(function(){
				//下一步操作人
				var dealingWithPeople=$('#nextPeople').val();
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
					url: $yt_option.base_path + "finance/invoicing/updateApply",
					async: false,
					data: {
						pkId: pkId,
						businessCode:"invoicing",
						processInstanceId:processInstanceId,
						dealingWithPeople:dealingWithPeople,
						opintion:opintion,
						nextCode:nextCode
					},
					objName: 'data',
					success: function(data) {
						if(data.flag == 0) {};
					}
				});
				//跳转到发票借用待审批列表页面
				window.location.href = "myApproveList.html?apprOrInf="+21;
			}
		});
		//审批取消
		$('#last-cancel').click(function(){
			//跳转到发票借用待审批列表页面
			window.location.href = "myApproveList.html?apprOrInf="+21;
		});
		
		
	},
	
	//下一步操作人
	getNextOperatePerson:function(){
		var getAllNextPeople = borrowInfo.getworkFlowOperate();
		if (getAllNextPeople !=null){
			$.each(getAllNextPeople,function (i,n){
				$("#nextPeople").append('<option value="'+n.userCode+'">'+n.userName+'</option>');
			});
		};
		$("#nextPeople").niceSelect();
	},
	//获取费用减免下一步操作人
	getworkFlowOperate:function(){
		var processInstanceId = $('.hid-process-instance-id').val();
		var user;
		$.ajax({
			type: "post",
			url: $yt_option.base_path+"uniform/workFlowOperate/getSubmitPageData",
			data:{
				//费用减免businessCode值为invoicing
				businessCode:"invoicing",
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
	getBorrowInfo: function() {
		var pkId = $yt_common.GetQueryString("pkId");
		var applicationInvoice;
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/invoicing/getBeanById",
			async: true,
			data: {
				pkId: pkId
			},
			objName: 'data',
			success: function(data) {
				//hide
				$yt_baseElement.hideLoading();
				if(data.flag == 0) {
					$('.create-user').text(data.data.createUser);
					$('.dept-name').text(data.data.deptName);
					$('.create-time-string').text(data.data.createTimeString);
					applicationInvoice = data.data.applicationInvoice;
					money = applicationInvoice.toFixed(2)+"";//保留两位小数
					money = money.replace(/(\d{1,3})(?=(\d{3})+(?:$|\.))/g,'$1,');
					$('.application-invoice').text(money);
					$('.invoice-org').text(data.data.invoiceOrg);
					$('.invoice-type').text((borrowInfo.borrowTypeInfo(data.data.invoiceType)));
					$('.org-name').text(data.data.orgName);
					$('.tax-number').text(data.data.taxNumber);
					$('.address').text(data.data.address);
					$('.telephone').text(data.data.telephone);
					$('.registered-bank').text(data.data.registeredBank);
					$('.account').text(data.data.account);
					$('.invoice-reason').text(data.data.invoiceReason);
					$('.work-flaw-state').text(data.data.workFlawState);
					var projectJSON = $.parseJSON(data.data.projects)
					var htmlTr = "";
					var htmlTbody = $(".project-tbody");
					htmlTbody.html("");
					var num = 0;
					//遍历所属项目
					$.each(projectJSON, function(i, v) {
						htmlTr = '<tr>' +
							'<td style = "text-align: center;" class="projectCode">' + v.projectCode + '</td>' +
							'<td >' + v.projectName + '</td>' +
							'<td style = "text-align: center;">' + v.projectHead + '</td>' +
							'<td style = "text-align: center;">' + v.startDate + '</td>' +
							'<td style = "text-align: center;">' + v.endDate + '</td>' +
							'</tr>';
							htmlTbody.append(htmlTr);
					});
					//遍历审批流程信息
					//流程
						var flowLog = data.data.flowLog;
						var middleStepHtml;
						var length = flowLog.length;
						//获取流程实例id
						$('.hid-process-instance-id').val(data.data.processInstanceId);
						$.each(flowLog, function(i, v) {
							//最后一步
							if(i==0){
								$('.hid-tast-key').val(v.tastKey);
								//隐藏下一步操作人下拉框
								if(v.tastKey=="activitiEndTask"){
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
																	'<div class="operate-view-text-li middle-step-comment" style="padding-left:10px;">'+v.comment+'</div>'+
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
																'<div class="operate-view-text-li middle-step-comment" style="padding-left:10px;">'+v.comment+'</div>'+
															'</li>'+
														'</ul>'+
													'</div>'+
												'</div>';
								$('.last-step').append(middleStepHtml);
							}
					});
					$yt_baseElement.hideLoading();
					//调用获取下一步操作人
					borrowInfo.getNextOperatePerson();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}
			}
		});
		$('.head-div').on('click','.page-return-btn',function() {
			var first = "borrow";
			var backType = $yt_common.GetQueryString("backType");
			if (backType == "f1" || backType == "f2" || backType == "j1" || backType == "j2") {
				window.location.href = "myApproveList.html?first=" + first+"&"+"backType="+backType+"&apprOrInf="+21;
			}
			//隐藏减免列表
			$('.reduce-list').hide();
			//显示发票列表
			$('.borrow-list').show();
			$yt_baseElement.showLoading();
			
		});
	},
	borrowTypeInfo: function(code) {
		if(code == 1) {
			return "普通发票";
		} else if(code == 2) {
			return "增值税发票";
		} else {
			return '';
		};
	},
}
$(function() {
	//初始化方法
	borrowInfo.init();

});