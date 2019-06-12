var projectList = {
	//审批记录详情，审批人，申请人仅仅能查看
	
	
	//初始化方法
	init: function() {
		projectList.getOneListInfo();
		//下载演讲稿
		$('.only-look-lecture-tb').on('click', ".down-file", function() {
			//获取文件的id
			var fileURL = $(this).parent().parent().find('.fileURL').val();
			$.ajaxDownloadFile({
				url: fileURL
			});
		});

		//点击下载模板
		$('.operate-file-box').on('click', '.down-modle-file', function() {
			//调用下载模板函数
			projectList.downloadOrder();
		});
		//点击返回
		var num = $yt_common.GetQueryString("num");
		$('.back-btn').click(function(){
			if (num == 1) {
				window.location.href = "waitOpenHonorsList.html?page="+ $yt_common.GetQueryString("page");
			}
			
		});
	},


	//下载模版
	downloadOrder: function() {
		//文件名
		var typeName = $('.dd-open-span').text();
		var fileName = "";
		//模板类型
		var type = $yt_common.GetQueryString("types");
		$.ajaxDownloadFile({
			url: $yt_option.base_path + "class/openHonors/downloadOrder",
			data:{
				types: type,
				fileName: fileName
			}
		});
	},
	//导出开结业式会序
	getOutOpenHonors: function() {
		var alertNmae = ""
		//当前一条详细信息的pkId
		var type = $yt_common.GetQueryString("types");
		var pkId = $yt_common.GetQueryString("pkId");
		//当前详细信息是开班式还是结业式
		alertNmae = $('.types').val();
		$.ajaxDownloadFile({
			url: $yt_option.base_path + "class/openHonors/exportOrder",
			data:{
				pkId: pkId,
				types: type
			}
		});
	},
	
	//审批获取审批详细信息
	getOneListInfo: function() {
		$yt_baseElement.showLoading();
		var pkId = $yt_common.GetQueryString("pkId");
		var types = $yt_common.GetQueryString("types");
		if (types == 2) {
			$(".class-title").text("结业式");
			$('.order-title').text("结业式会序");
			$(".file-title").text("结业式讲稿");
			$(".approve-title").text("结业式审批流程");
		}
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/openHonors/getBeanById",
			async: false,
			data: {
				pkId: pkId,
				types:types
			},
			objName: 'data',
			success: function(data) {
				if(data.flag == 0) {
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
						
						i=i+1;
						var lineTrHtml = '<tr class="add-textList tr-border-style">' +
											'<td style="text-align:center;" class="order-by"> <input type="hidden" class="orderBy" value="'+v.orderBy+'"/>' + i + '</td>' +
											'<td class="td-input details">'+v.details+'</td>' +
											'<td style="text-align:right;" class="dateLength" style="padding-right:10px;"><span style="margin-right:5px">'+v.dateLength+'</span>'+"分钟"+'</td>' +
											
										'</tr>';

							$(".add-order-tb tbody").append(lineTrHtml);
						
					});
					//讲稿
					var fileList=data.data.fileList;
					var fileListObj=$.parseJSON(fileList)
					$.each(fileListObj, function(i,v) {
						i=i+1;
						var lineTrHtml = '<tr class="file-tr-border-style">' +
											'<input type="hidden" class="fileURL" value="'+v.fileURL+'">'+
											'<td class="lecture-tds">【<span class="fileLineNum">' + i + '</span>】</td>' +
											'<td class="fileName"><input type="hidden" class="file-span-id" value="' + v.fileId + '" >' + v.fileName + '</td>' +
											'<td style="display:none;" class="lecture-tds"><img class="ioc-img" src="../../resources/images/open/yulan.png" /></td>' +
											'<td style="width: 40px;display:none;">预览</td>' +
											'<td class="lecture-tds" style="text-align:center;width:70px"><span style="cursor: pointer;" class="down-file"><img class="ioc-img" src="../../resources/images/open/xiazai2.png" />下载</span></td>'+
										'</tr>';
										$(".only-look-lecture-tb tbody").append(lineTrHtml);
										
					});
					
					//流程
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
						//如果i小于length-1，是流程的中间步骤
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
															'<div class="operate-view-text-li middle-step-comment">'+v.comment+'</div>'+
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
		
	}

};
$(function() {
	//初始化方法
	projectList.init();
});