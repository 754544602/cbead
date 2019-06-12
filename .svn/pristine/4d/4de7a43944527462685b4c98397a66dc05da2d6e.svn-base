var teaching = {
	init:function(){
		//获取登录人信息
		teaching.userInfo();
		
		
		//初始化下拉列表
		$(".yt-select").niceSelect();
		//收到时间初始化日期控件
		$(".time-receipt").calendar({
		    speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
		    complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
		    readonly: true, // 目标对象是否设为只读，默认：true     
		    lowerLimit:"NaN", // 日期下限，默认：NaN(不限制)     
		    nowData:true,//默认选中当前时间,默认true  
		    dateFmt:"yyyy-MM-dd",  
		    callback: function() { // 点击选择日期后的回调函数  
		        //alert("您选择的日期是：" + $("#txtDate").val());  
		    }  
		}); 
		//要求反馈时间控件初始化
		$(".feedback-time").calendar({
		    speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
		    complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
		    readonly: true, // 目标对象是否设为只读，默认：true     
		    lowerLimit:"NaN", // 日期下限，默认：NaN(不限制)     
		    nowData:true,//默认选中当前时间,默认true  
		    dateFmt:"yyyy-MM-dd",  
		    callback: function() { // 点击选择日期后的回调函数  
		        //alert("您选择的日期是：" + $("#txtDate").val());  
		    }  
		});
		//设计方案需求保存
		$(".btn-teach-plan-save").click(function(){
			var dataStates = 0;
			teaching.teachPlanDesignRequirements(dataStates);
		});
		
		
			//获取当前登录人
			
			//获取当前项目的销售人和项目主任
			
			//判断当前是否已存在教学方案
			
					//没有教学方案判断当前登录人是不是当前项目的销售人
					   
					   	//当前登录人是当前销售人，当前登录人新添加一个销售需求，需求是保存，保存后没有工作流
					   	
					   	//当前登录人不是当前项目的销售人,页面显示空白
					
					//当前项目已经存在教学方案
					
							//判断当前登录人是否为项目主任
							
								//是项目主任
								
									//判断流程是否存在
									
										//流程存在
										
											//判断流程是否结束
												
												//流程结束
												
													//判断终稿是否存在
													
														//终稿存在
														
															//只显示详情
															
														//终稿不存在
														
															//显示终稿上传功能
															
												//流程没结束
												
													//项目主任审批
											
											//显示审批
											
										//流程不存在
										
											//显示审批
									
								//不是项目主任
								
									//只显示详情
	},
	
	//获取登录人信息
	userInfo:function(){
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "uniform/user/getUsersDetails", //ajax访问路径  
			data: {
			}, //ajax查询访问参数
			success: function(data) {
				$('.user-real-name').val(data.data.userRealName);
			}
			
		});
	},
	//我的项目查询一条详细信息
	getProjectInf: function() {
		$yt_baseElement.showLoading();
			var pkId = $yt_common.GetQueryString('pkId');
			$.ajax({
				type: "post", //ajax访问方式 默认 "post"  
				url: $yt_option.base_path + "project/getBeanById", //ajax访问路径  
				data: {
					pkId:pkId
				}, //ajax查询访问参数
				
				success: function(data) {
					if(data.flag == 0){
						
						$yt_baseElement.hideLoading();
					}else{
						$yt_alert_Model.prompt("获取失败");
						$yt_baseElement.hideLoading();
					}
					//教学方案信息查询
					teaching.getTeachPlanDesignRequirements();
				}
			});
	},
	//教学方案设计需求查询
	getTeachPlanDesignRequirements: function() {
		debugger
		$yt_baseElement.showLoading();
		
		var projectId = $yt_common.GetQueryString('pkId');
			$.ajax({
				type: "post", //ajax访问方式 默认 "post"  
				url: $yt_option.base_path + "project/getTeachingScheme", //ajax访问路径  
				data: {
					projectId:projectId
				}, //ajax查询访问参数
				success: function(data) {
					if(data.flag == 0&&data.data!=null){
						//显示教学方案设计需求详情
						$('.teach-plan-table-info').show();
						//学员层次
						$('.trainee-level-info input[value="'+ data.data.traineeLevel +'"]').setCheckBoxState("check");
						//方案要求
						$('.scheme-requirement-info input[value="'+ data.data.schemeRequirement +'"]').setCheckBoxState("check");
						//获取没被选中的复选框
						var notChecked = $(".trainee-level-info input:checkbox").not("input:checked");
						//隐藏没被选中的复选框
						/*$.each(notChecked,function(i,v){
							v.parent().hide();
						});*/
						
						 
						
						//判断当前登录人是否为当前项目的项目主任
						if(userRealName == projectHead){//是该项目的项目主任
							//判断是否有初稿
//							if(){//有初稿
//								//判断是否有流程
//								if(){//流程存在
//									//判断流程是否结束
//									if(){//流程结束
//										//判断终稿是否存在
//										if(){//终稿存在
//											//显示所有详情
//											
//										}else{//终稿不存在
//											//显示终稿功能
//											
//										}
//										
//									}else{//流程没结束
//										//判断该流程审批人是否为但该案登录人
//										if(){//是当前登录人
//											//显示流程审批
//											
//										}else{//不是当前登录人
//											//只显示流程详情
//											
//										}
//									}
//								}else{//流程不存在
//									//显示流程
//									
//								}
//							}else{//没有初稿
//								//显示初稿功能框
//								
//							}
							
						}else{//当前登录人不是该项目的项目主任
							//判断是否有终稿
//							if(){//有终稿
//								//显示所有详情
//								
//							}else{//没有终稿，审批未结束审批详情不展示给其他登录人
//								
//							}
						}
						
						var teacherUl = $(".file-id");
						var teacherLi = "";
						var fileIdsArr = $.parseJSON(data.data.teachingSchemeFile);
						if(fileIdsArr.length > 0) {
							$.each(fileIdsArr, function(i, v) {
								teacherLi += '<p style="width:870px;height:40px;border:1px dashed #e6e6e6;line-height:40px;">'+
							'<span class="file-name" style="margin-right: 50px;color:blue;cursor: pointer"><input type="hidden" class="file-span-id" value="'+v.pkId+'" >'+v.fileName+'</span>'+
							'<span class="del-file-p" style="float:right;cursor: pointer;"><img src="../../resources/images/icons/teach-plan-del.png" alt="" />删除</span>'+
							'<span class="down-load-file-index" style="float:right;cursor: pointer;"><img src="../../resources/images/icons/down-load-teach-plan.png" alt="" />下载</span>'+
							'<span style="float:right;"><img src="../../resources/images/icons/preview.png" alt="" />预览</span>'+
							'</p>';
									teacherUl.html(teacherLi);
							});
						}
						$yt_baseElement.hideLoading();
						
						//流程
						var flowLog = data.data.flowLog;
						if (flowLog == "") {
							$('.approval-process-module').hide();
						}else{
							//解析流程日志
							var flowLogArr = $.parseJSON(flowLog);
							//获取流程实例id
							$('.hid-process-instance-id-teach').val(data.data.processInstanceId);
							var middleStepHtml;
							var length = flowLogArr.length;
							var deleteReasons="";
							var tastName;
							$.each(flowLogArr, function(i,n) {
								if (n.deleteReason=="completed") {
									deleteReasons="同意";
								};
								if (n.deleteReason=="returnedSubmit") {
									deleteReasons="退回到审批人";
								};
								if (n.deleteReason=="refusedToApproval") {
									deleteReasons="拒绝";
								}
								tastName=n.taskName+deleteReasons;
								$('.tast-key-teach').val(n.tastKey);
								//隐藏下一步操作人下拉框
								if(n.tastKey=="activitiEndTask"){
									$('.next-operate-person-tr').hide();
								}
								
								//如果i等于0是最后一步流程数据
								if(i==0){
									if (n.taskName=="审批") {
										//显示审批步骤
										$('.last-step-div-teach').show();
									}else{
										//状态隐藏审批步骤
										$('.last-step-div-teach').hide();
									}
									
									//满足条件隐藏下一步操作人下拉框
									if(n.tastKey=="activitiEndTask"){
										$('.hid-tast-key').val(n.tastKey);
										$('.next-operate-person-teach-tr').hide();
										//渲染审批步骤的数据
										//流程编号
										$('.last-step-order-teach').text(length);
										//操作人名
										$('.last-step-operate-person-userName-teach').text(n.userName);
										//操作状态
										$('.last-step-operationState-teach').text(n.taskName);
										//停滞时间							
										$('.last-step-commentTime-teach').text(n.commentTime);
									}else{
										//流程序号
										var order=length-i;
										middleStepHtml='<div>'+	
															'<div style="height: 150; ">'+
																'<div class="number-name-box">'+
																	'<span class="number-box-span middle-step-order middle-a-index" >'+order+'</span>'+
																	'<span class="name-box-span middle-step-userName middle-a-index" >'+n.userName+'</span>'+
																	'<img src="../../resources/images/open/openFlow.png" class="order-img" />'+
																'</div>'+
															'</div>'+
															'<div class="middle-step-box-div">'+
																'<ul class="middle-step-box-ul">'+
																	'<li style="height: 30px;">'+
																		'<span  class="middle-step-taskName view-taskName-span"  style="float: left;">'+tastName+'</span>'+
																	'</li>'+
																	'<li class="view-time-li middle-step-commentTime" >'+n.commentTime+'</li>'+
																	'<li class="operate-view-box-li">'+
																		'<div class="operate-view-title-li">操作意见：</div>'+
																		'<div class="operate-view-text-li middle-step-comment" style="padding-left:10px;">'+n.comment+'</div>'+
																	'</li>'+
																'</ul>'+
															'</div>'+
														'</div>';
										$('.last-step-add-teach').append(middleStepHtml);
									}
								};
								//如果i等于length-1是流程的第一步
								if(i==length-1){
									//流程编号
									$('.first-step-order-teach').text(1);
									//操作人名
									$('.first-step-operate-person-username-teach').text(n.userName);
									//当前审批节点名字
									$('.first-step-taskName-teach').text(tastName);
									//时间
									$('.first-step-commentTime-teach').text(n.commentTime);
									//审批意见
	//								$('.first-step-comment').text(n.comment);
									
								};
								//如果i不等于且不等于length-1，是流程的中间步骤
								if(i!=0 && i!= length-1){
									//流程序号
									var order=length-i;
									middleStepHtml='<div>'+	
														'<div style="height: 150; ">'+
															'<div class="number-name-box">'+
																'<span class="number-box-span middle-step-order middle-a-index" >'+order+'</span>'+
																'<span class="name-box-span middle-step-userName middle-a-index" >'+n.userName+'</span>'+
																'<img src="../../resources/images/open/open-sp.png" class="order-img" />'+
															'</div>'+
														'</div>'+
														'<div class="middle-step-box-div">'+
															'<ul class="middle-step-box-ul">'+
																'<li style="height: 30px;">'+
																	'<span  class="middle-step-taskName view-taskName-span"  style="float: left;">'+tastName+'</span>'+
																'</li>'+
																'<li class="view-time-li middle-step-commentTime" >'+n.commentTime+'</li>'+
																'<li class="operate-view-box-li">'+
																	'<div class="operate-view-title-li">操作意见：</div>'+
																	'<div class="operate-view-text-li middle-step-comment">'+n.comment+'</div>'+
																'</li>'+
															'</ul>'+
														'</div>'+
													'</div>';
									$('.last-step-add-teach').append(middleStepHtml);	
								};
							});
						}
					}else{
						//没有教学方案设计需求
						
						
						$yt_baseElement.hideLoading();
					}
				}
			});
	},
	//教学方案设计需求保存&提交
	teachPlanDesignRequirements: function(dataStates) {
		var projectId = $yt_common.GetQueryString('pkId');
		var pkId = $(".teach-plan-table .pk-id").val();
		var traineeLevel = $(".trainee-level>input:checkbox:checked").val();
		var estimatedTransactionPrice = $(".teach-plan-table .estimated-transaction-price").val();
		var timeReceipt = $(".teach-plan-table .time-receipt").val();
		var feedbackTime = $(".teach-plan-table .feedback-time").val();
		var schemeRequirement = $('.scheme-requirement>input:checkbox:checked').val();
		var linkman = $(".teach-plan-table .linkman").val();
		var phone = $(".teach-plan-table .phone").val();
		var adDetails = $(".teach-plan-table .ad-details").val();
		var teachingsSchemeLevel = $(".teach-plan-table .teachings-scheme-level").val();
		
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "project/addOrUpdateTeachingScheme", //ajax访问路径  
			data: {
				projectId:projectId,
				pkId:pkId,
				traineeLevel:traineeLevel,        
				estimatedTransactionPrice:estimatedTransactionPrice, 
				timeReceipt:timeReceipt,    
				feedbackTime:feedbackTime,    
				schemeRequirement:schemeRequirement,      
				linkman:linkman,  
				phone:phone,  
				adDetails:adDetails,      
				teachingsSchemeLevel:teachingsSchemeLevel,
				dataStates:dataStates

			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0){
				 	$yt_alert_Model.prompt("操作成功");
				}else{
					$yt_alert_Model.prompt("操作失败");
				}
			} 
		});
	},
	//项目主任首次操作时
	firstDraftByProjectDirector: function() {
		var projectId = $yt_common.GetQueryString('pkId');
		var businessCode = $(".teach-plan-table .teachings-scheme-level").val();
		var dealingWithPeople=$('.next-people').val();
		var files = "";
		
		var filesArr=[];
			$(".file-id p").each(function (i,n){
				fileName=$(n).find(".file-name").text();
				fileId=$(n).find(".file-name .file-span-id").val();
				var arrFile={
					fileName:fileName,
					fileId:fileId
				}
				filesArr.push(arrFile);
			});
		var files = JSON.stringify(filesArr);
		
		
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "project/addOrUpdateTeachingSchemeFile", //ajax访问路径  
			data: {
				projectId:projectId,
				fileType:1,
				files:files,        
				businessCode:businessCode, 
				dealingWithPeople:dealingWithPeople,    
				opintion:"",    
				processInstanceId:"",      
				nextCode:"submited"

			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0){
				 	$yt_alert_Model.prompt("操作成功");
				}else{
					$yt_alert_Model.prompt("操作失败");
				}
			} 
		});
	}
	
}
$(function() {
	teaching.init();
});