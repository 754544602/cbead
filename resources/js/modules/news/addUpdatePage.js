var caList = {
	ue:null,
	//初始化方法
	init: function() {
		
		//初始化新增页面
		caList.clearAlertBox();
		//获取班级详情
		caList.getPlanListInfo();
		//获取审批详情
		caList.getOneListInfo();
		//初始化下拉列表
		$('select').niceSelect();
		
		//初始化创建时间
		$("#issueDayeString").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			lowerLimit: "2010/01/01", // 日期下限，默认：NaN(不限制)     
			nowData: true, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd HH:mm",
			callback: function() {} // 点击选择日期后的回调函数  
		});
		//班级列表下拉框
		//班级列表下拉框
		var classList = caList.getClassLis();
		var userName = caList.userInfo();
		if(classList != null) {
			var projectUserCode;
			var projectHeadmasterCode;
			var projectSell;
			var projectAid;
			$.each(classList.data, function(i, n) {
				//项目主任code
				projectUserCode = n.projectUserCode;
				//班主任code
				projectHeadmasterCode = n.projectHeadmasterCode;
				//项目销售code
				projectSell = n.projectSell;
				//项目助理code
				projectAid = n.projectAid;
				//判断当前登录人是否为项目主任或班主任
				if(projectUserCode.indexOf(userName) != -1 || projectHeadmasterCode.indexOf(userName) != -1 || projectSell.indexOf(userName) != -1 || projectAid.indexOf(userName) != -1) {
					$("#projectCode").append($('<option value="' + n.projectCode + '">' + n.className + '</option>').data("classData", n));
				};
			});
			//初始化班级下拉框
			$("#projectCode").niceSelect();
		};
		//选择班级获取项目主任名
		$('#projectCode').on('change', function() {
			var className = $('#projectCode option:selected').val();
			var projectUserName = $('#projectCode option:selected').data("classData").projectUserName;
			$('#projectUserName').text(projectUserName);
		});
		
		
		//点击返回
		$('.page-return-btn').click(function() {
			caList.backNewsListPage();
		});
		
		//点击保存
		$('.save').click(function() {
		 	caList.addnewsInfo(1);
		});
		//点击提交
		$('.btn-ti').click(function() {
		 	caList.addnewsInfo(2);
		});
		//取消
		$('.yt-model-canel-btn').click(function() {
		 	var pageNum = $yt_common.GetQueryString("pageNum");
			if(pageNum == 2){//跳转到待审批列表页面
				window.location.href = "lookForByBacklogList.html";
			}else{
				window.location.href = "newList.html";
			}
		});
		
	},
	//返回新闻稿列表
	backNewsListPage:function(){
		var pageNum = $yt_common.GetQueryString("pageNum");
			if(pageNum == 2){//跳转到待审批列表页面
				window.location.href = "lookForByBacklogList.html";
			}else{
				window.location.href = "newList.html";
			}
	},
	
	/**
	 * 获取所有班级
	 */
	getClassLis: function() {
		var list = [];
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/getClasslist",
			data: {
				types: '4'
			},
			async: false,
			success: function(data) {
				list = data || [];
			}
		});
		return list;
	},
	//获取登录人信息
	userInfo: function() {
		var userName = "";
		$.ajax({
			async: false,
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "uniform/user/getUsersDetails", //ajax访问路径  
			data: {}, //ajax查询访问参数
			success: function(data) {
				userName = data.data.userName;
			}
		});
		return userName;
	},
	/**
	 * 获下一步操作人
	 */
	getNextOperatePerson: function() {
		var list = [];
		var dataObj;
		var user = null;
		var processInstanceId = $('#processInstanceId').val();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/workFlowOperate/getSubmitPageData",
			data: {
				businessCode: "news",
				processInstanceId:processInstanceId,
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
	
	
	
	//点击新增清空弹窗内容
	clearAlertBox:function(){
		$('#projectCode').val("");
		$('#projectUserName').val("");
		$('#title').val("");
		$('#details').text("");
		$('#issueDayeString').val("");
		$('#dealingWithPeople').val("");
		$('select').niceSelect();
	},
	
	//获取新闻稿信息
	getPlanListInfo: function() {
		$yt_baseElement.showLoading();
		var pkId = $yt_common.GetQueryString("pkId");
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/news/getBeanById",
			async: true,
			data: {
				pkId: pkId
			},
			objName: 'data',
			success: function(data) {
				if(data.flag == 0) {
					//班级名
					$('#projectCode').setSelectVal(data.data.projectCode);
					//项目主任
					$('#projectUserName').text(data.data.projectUserName);
					//标题
					$('#title').val(data.data.title);
					//发布时间
					$('#issueDayeString').val(data.data.issueDayeString);
					//发布时间
					$('#processInstanceId').val(data.data.processInstanceId);
					//初始化富文本编辑器
				 	caList.ue = UE.getEditor('container', {
						toolbars: [
							[ 'undo', 'redo', '|',
								'bold', 'italic', 'underline', 'forecolor', '|',
								'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify','|','simpleupload','attachment'
							]
						],
						autoHeightEnabled: true,
						autoFloatEnabled: false,
						elementPathEnabled:false,
			            wordCount:false,
			            enableAutoSave :false,
			            enableAutoSave:false
					});
					//新闻稿内容
					caList.ue.ready(function() {
					    caList.ue.setContent(data.data.details);
					});
					
					//下一步操作人
					$('#dealingWithPeople').val(data.data.dealingWithPeople);
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function (){
						$yt_alert_Model.prompt("查询成功");
					});
				}
			}
		});
	},
	
	//点击保存或提交
	addnewsInfo:function(dataStates){
		$yt_baseElement.showLoading();
		var processInstanceId = $yt_common.GetQueryString("processInstanceId");
		var pkId = $yt_common.GetQueryString("pkId");
		var projectCode = $('#projectCode').val();
		var title = $('#title').val();
		var details =  caList.ue.getContent();;
		var issueDayeString = $('#issueDayeString').val();
		var dealingWithPeople = $('#dealingWithPeople').val();
		//var processInstanceId = $('#processInstanceId').val();
		
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/news/addOrUpdateBean",
			data: {
				//新增可以为空，修改不能为空
				pkId:pkId,
				//班级编号
				projectCode: projectCode,
				//标题
				title:title,
				//内容
				details:details,
				//发布时间
				issueDayeString: issueDayeString,
				//流程定义
				businessCode: "news",
				//下一步操作人
				dealingWithPeople:dealingWithPeople,
				//提交，或保存
				dataStates:dataStates,
				//操作流程代码   不能为空
				nextCode:"submited",
				//流程实例id
				processInstanceId:processInstanceId
			},
			success: function(data) {
				if(data.flag == 0) {
					$yt_baseElement.hideLoading();
					
				} else {
					$yt_baseElement.hideLoading(function (){
						$yt_alert_Model.prompt("提交失败");
					});
				}
				caList.backNewsListPage();
			}
		});
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
			success: function(data) {
				if(data.flag == 0) {
					//下一步操作人
						var nextPersonList = caList.getNextOperatePerson();
						if(nextPersonList != null) {
							$.each(nextPersonList, function(i, n) {
								$("#dealingWithPeople").append($('<option value="' + n.userCode + '">' + n.userName + '</option>').data("classData", n));
							});
						};
						//初始化下一步操作人下拉框
						$("#dealingWithPeople").niceSelect();
					if(data.data.flowLog.length != 0){
						$(".hide-approve-title").show();
						$(".hide-appreove").show();
						var flowLog = data.data.flowLog;
						var middleStepHtml;
						var length=flowLog.length;
						$.each(flowLog, function(i,v) {
							$('#processInstanceId').val(data.data.processInstanceId);
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
																'<div class="operate-view-text-li middle-step-comment" style="padding-left: 10px;">'+v.comment+'</div>'+
															'</li>'+
														'</ul>'+
													'</div>'+
												'</div>';
								$('.last-step').append(middleStepHtml);
							};
						});
						$yt_baseElement.hideLoading();
					} ;
				}else {
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
	caList.init();
	
});