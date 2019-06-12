var projectList = {
	//初始化方法
	init: function() {
		//审批流程
		projectList.getOneListInfo();
		//下载演讲稿
		$('.add-lecture-tb tbody').on('click', ".down-file", function() {
			//获取文件的id
			var filePkId =$(this).parent().parent().find('.file-span-id').val();
			var fileURL =$(this).parent().parent().find('.fileURL').val();
			$.ajaxDownloadFile({
				url:fileURL
			});
		});

		//流程单选按钮
		$(".check-label input[type='radio']").change( function() {
		  	var rad = $(this).val();
		  	//单选当前值为1同意显示下一步操作人下拉框
		  	if (rad=="completed") {
		  		if($('#taskKey').val() != "activitiEndTask") {
					$('.hid-input').show();
				} else {
					$('.hid-input').hide();
				}
		  	};
		  	//单选当前值为0拒绝隐藏下一步操作人下拉框
		  	if (rad=="returnedSubmit") {
		  		$('#nextPeople').setSelectVal("");
		  		$('.hid-input').hide();
		  	}
		});

		
		//审批意见提交
		$('#last-submit').click(function(){
			var types=$('#types').val();
			var pkId=$('#pkId').val();
			//流程定义key
			var businessCode;
			if(types==1){
				businessCode="openHonorsStart";
			};
			if(types==2){
				businessCode="openHonorsEnd";
			};
			//流程实例id
			var processInstanceId=$('#processInstanceId').val();
			//下一步操作人
			var dealingWithPeople=$('#nextPeople').val();
			//审批意见
			var opintion=$('#opintion').val();
			//判断同意和不同意
			var nextCode = $('input[name="radioType"]:checked ').val();
			var tastKey = $('#taskKey').val();
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
					url: $yt_option.base_path + "class/openHonors/updateApply",
					async: false,
					data: {
						pkId: pkId,
						types:types,
						businessCode:businessCode,
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
				window.location.href = "waitOpenHonorsList.html";
			}
		});
		//审批取消
		$('#last-cancel').click(function(){
			//跳转到审批列表页面
			window.location.href = "waitOpenHonorsList.html";
		});
		
		
		//点击返回
		$('.page-return-btn').click(function(){
			window.location.href = "waitOpenHonorsList.html";
		});
	},
	//下一步操作人
	getNextOperatePerson:function(){
		var nextPersonList = projectList.getworkFlowOperate();
		if (nextPersonList !=null){
			$.each(nextPersonList,function (i,n){
				$("#nextPeople").append('<option value="'+n.userCode+'">'+n.userName+'</option>');
			});
		};
	},
	//获取下一步操作人
	getworkFlowOperate:function(){
		var businessCode;
		var processInstanceId = $('#processInstanceId').val();
		var types=$('#types').val();
		if(types==1){
			businessCode="openHonorsStart";
		};
		if(types==2){
			businessCode="openHonorsEnd";
		}
		var list =[];
		$.ajax({
			type: "post",
			url: $yt_option.base_path+"uniform/workFlowOperate/getSubmitPageData",
			data:{
				businessCode:businessCode,
				processInstanceId:processInstanceId
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
	//导出开结业式会序
	getOutOpenHonors: function() {
		//当前一条详细信息的pkId
		var pkId = $('#pkId').val();
		//当前详细信息是开班式还是结业式
		var type = $('#types').val();
		//当前详细信息是开班式还是结业式
		alertNmae = $('.types').val();
		$.ajaxDownloadFile({
			url: $yt_option.base_path + "class/openHonors/exportOrder",
			data: {
				pkId: pkId,
				types: type
			}
		});
	},
	
	
//----------------------------------------审批部分流程--------------------------------------------------------	



	//审批获取审批详细信息
	getOneListInfo: function() {
		$yt_baseElement.showLoading();
		var pkId = $yt_common.GetQueryString("pkId");
		var types =$('#types').val();
		if (types == 2) {
			$(".class-title").text("结业式待审批");
			$('.order-title').text("结业式会序");
			$(".file-title").text("结业式讲稿");
			$(".approve-title").text("结业式审批流程");
		}
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/openHonors/getBeanById",
			async: true,
			data: {
				pkId: pkId,
				types:types
			},
			objName: 'data',
			success: function(data) {
				if(data.flag == 0) {
			//隐藏数据		
					//流程实例id
					$('#processInstanceId').val(data.data.processInstanceId);
					//开班式，结业式标识
					$('#types').val(data.data.types);
					//主表pkid
					$('#pkId').val(data.data.pkId);
					
			//展示数据		
					//班级名
					$('#projectCode').text(data.data.projectName);
					//项目主任
					$('#projectUserName').text(data.data.projectUserName);
					//召开时间
					$('#startTime').text(data.data.startTime);
					//学员数量
					$('#traineeCount').text(data.data.traineeCount);
					//提交时间
					$('#createTimeString').text(data.data.createTimeString);
					//提交人
					$('#createUser').text(data.data.createUserName);
					
					//会序
					var orderList=data.data.orderList;
					var orderListObj=$.parseJSON(orderList);
					$.each(orderListObj, function(i,v) {
						
						var num = $(".add-order-tb tbody tr").length + 1;
						var lineTrHtml = '<tr class="add-textList tr-border-style">' +
											'<td style="text-align:center;" class="order-by"> <input type="hidden" class="orderBy" value="'+v.orderBy+'"/>' + num + '</td>' +
											'<td class="td-input details">'+v.details+'</td>' +
											'<td class="dateLength" style="padding-right:10px;text-align:right"><span style="margin-right:5px">'+v.dateLength+'</span>'+"分钟"+'</td>' +
										'</tr>';
										$(".add-order-tb tbody").append(lineTrHtml);
					});
					//讲稿
					var fileList=data.data.fileList;
					var fileListObj=$.parseJSON(fileList)
					$.each(fileListObj, function(i,v) {
						var num = $(".lecture tbody tr").length + 1;
						var lineTrHtml='<tr class="file-tr-border-style">'+
											'<input type="hidden" class="fileURL" value="'+$yt_option.acl_path +'api/tAscPortraitInfo/download?isDownload=true&pkId='+v.fileId+'">'+
											'<td class="lecture-tds">【<span class="fileLineNum">'+num+'</span>】</td>'+
											'<td class="fileName"><input type="hidden" class="file-span-id" value="' + v.fileId + '" >' + v.fileName + '</td>' +
											'<td style="display:none;" class="lecture-tds"><img class="ioc-img" src="../../resources/images/open/yulan.png" /></td>'+
											'<td style="width: 40px; display:none;">预览</td>'+
											'<td class="lecture-tds" style="text-align:center;width:70px"><span style="cursor: pointer;" class="down-file"><img class="ioc-img" src="../../resources/images/open/xiazai2.png" />下载</span></td>'+
										
										'</tr>';
						$(".lecture").append(lineTrHtml);
					});
					
					//流程
					var flowLog = data.data.flowLog;
					var middleStepHtml;
					var length=flowLog.length;
					$.each(flowLog, function(i,v) {
						
						//如果i等于0是最后一步流程数据
						if(i==0){
							if (v.tastKey == "activitiEndTask") {//审批最后一步隐藏下一步操作人
								$(".next-operate-person-tr").hide();
								if(v.deleteReason!=''){
									$('.last-box').hide();
									$('.yt-eidt-model-bottom').hide();
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
								}
							}
							//隐藏数据，用来提交审批是判断是否需要下一步操作人
							$('#taskKey').val(v.tastKey);
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
									$('.last-box').hide();
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
						if(i!=0 && i< length-1){
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
						};
					});
					$yt_baseElement.hideLoading();
					//调用下一步操作人
					projectList.getNextOperatePerson();
					$("#nextPeople").niceSelect();
				} else {
					$yt_baseElement.hideLoading(function (){
						$yt_alert_Model.prompt("查询失败");
					});
				}
			}
		});
	}

};
$(function() {
	//初始化方法
	projectList.init();
});

