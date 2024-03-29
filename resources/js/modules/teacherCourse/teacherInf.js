var teacherList = {
	courseList:"",
	//初始化方法
	init: function() {
		//下拉框刷新 
		$("select").niceSelect();  
		teacherList.getTeacherInf();
		
		//点击按钮
		$(".tab-title-list button").click(function (){
			$(this).addClass("active").siblings().removeClass("active");
			$(".box-list .content-box").hide().eq($(this).index()).show();
			if($(this).index() == 0) {
				//教师信息页签
				teacherList.getTeacherInf();
			} else if($(this).index() == 1) {
				//授课记录页签
				teacherList.getTeachRecordsList();
			} else if($(this).index() == 2) {
				//可授课程页签
				teacherList.getTeachCoursesList();
			} else if($(this).index() == 3) {
				//课件文件页签
				teacherList.getTeachCourseWareList();
			}
		});
		//隐藏input输入框
		//点击返回
		$(".btn-return").click(function(){
			if(window.parent.document.getElementById("teacherName")==null){
				window.history.back();
			}else{
				$(window.parent.document.getElementById("teacherName")).hide();
				$(window.parent.document.getElementsByTagName("body")).css('overflow','auto');
			}
//			window.location.href="teacherList.html";
		});
		
		//点击新增
		$(".add-courses-list").on('click',function(){
			$(".yt-edit-alert-title-msg").text("新增课程");
			teacherList.legalAdd();
			$(".alert-index .course-title").val("");
			$(".alert-index .course-details").val("");
			$('.yt-model-sure-btn').off('click').on('click', function(){
	            if($yt_valid.validForm($('.add-course-alert'))){
					teacherList.addCourseList();
				}else{
					teacherList.pageToScroll($('.add-course-alert .valid-font'));
					$yt_alert_Model.prompt("请将必填项填写完整");
				}
			});
		});
		//点击修改
		$(".courses-tbody").on('click',".img-amend",function(){
			$(".yt-edit-alert-title-msg").text("修改");
			var courseTitle = $(this).parent().parent().data("courseData").courseTitle;
			var courseDetails = $(this).parent().parent().data("courseData").courseDetails;
			
			$(".alert-index .course-title").val(courseTitle);
			$(".alert-index .course-details").val(courseDetails);
			//显示弹出框
			teacherList.legalAdd();
			var pkId = $(this).parent().parent().data("courseData").pkId;
			$('.yt-model-sure-btn').off('click').on('click', function() {
				teacherList.amendCourseList(pkId);
	            $(".alert-index").hide();
			});
		});
		//点击删除
		$(".courses-tbody").on('click',".img-del",function(){
			var pkId = $(this).parent().parent().data("courseData").pkId;
			teacherList.delCourseList(pkId);
		});
		//下载课件
		$(".teacher-index-inf").off().on('click','.file-name',function(){
			var fileURL = $(this).find('.fileURL').val();
			$.ajaxDownloadFile({
				url: fileURL
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
		  		$('.hid-input').hide();
		  	}
		});
		//审批意见提交
		$('#last-submit').click(function(){
			var teacherId = $yt_common.GetQueryString('pkId');
			var processInstanceId = $yt_common.GetQueryString('processInstanceId');
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
					url: $yt_option.base_path + "teacher/updateApply",
					async: false,
					data: {
						teacherId: teacherId,
						businessCode:"teacher",
						processInstanceId:processInstanceId,
						dealingWithPeople:dealingWithPeople,
						opintion:opintion,
						nextCode:nextCode
					},
					success: function(data) {
						if(data.flag == 0) {
							window.history.back();
						}else{
							$yt_alert_Model.prompt("审批提交失败!", 3000);
						}
					}
				});
				
			}
		});
		//审批取消
		$('#last-cancel').click(function(){
			//跳转到审批列表页面
			window.history.back();
		});
	},
	//师资管理获取一条数据
	getTeacherInf: function() {
		$yt_baseElement.showLoading();
		var pkId = $yt_common.GetQueryString('pkId');
		var processInstanceId = $yt_common.GetQueryString('processInstanceId');
		var backPage = $yt_common.GetQueryString('backPage');
		var indexNum = $yt_common.GetQueryString('indexNum');
			$.ajax({
				type: "post", //ajax访问方式 默认 "post"  
				url: $yt_option.base_path + "teacher/getBeanByIdByApproval", //ajax访问路径  
				data: {
					pkId:pkId,
					processInstanceId:processInstanceId
				}, //ajax查询访问参数
				async: false,
				success: function(data) {
					if(data.flag == 0){
						var tastKey;
						$(".teacher-index-inf").setDatas(data.data);
						$(".papersType").setSelectVal(data.data.papersType);
						if (data.data.dataStates == "1") {
							//变更前
							$(".dollars-standard-before").html($yt_baseElement.fmMoney(data.data.dollarsStandardHalfBefore)+'元/半天&emsp;'+$yt_baseElement.fmMoney(data.data.dollarsStandardOneBefore)+'元/天');
							$(".fater-td").parents('tr').hide();
							$(".change-reason-tr").hide();
						}else{
							$(".changeReason").parents('tr').show();
							$(".fater-td").parents('tr').show();
							$(".before-td").text("课酬标准（变更前）：");
							$(".fater-td").text("课酬标准（变更后）：");
							//变更前
							$(".dollars-standard-before").html($yt_baseElement.fmMoney(data.data.dollarsStandardHalf)+'元/半天&emsp;'+$yt_baseElement.fmMoney(data.data.dollarsStandardOne)+'元/天');
							//变更后
							$(".dollars-standard-after").html($yt_baseElement.fmMoney(data.data.dollarsStandardHalfBefore)+'元/半天&emsp;'+$yt_baseElement.fmMoney(data.data.dollarsStandardOneBefore)+'元/天');
							$(".change-reason-tr").show();
						}
						$(".changeReason").text(data.data.changeReason);
						if(data.data.gender==1){
							$(".gender").text("男");
						}else if(data.data.gender==2){
							$(".gender").text("女");
						}
						if(data.data.papersType==1){
							$(".papersType").text("身份证");
						}else if(data.data.papersType==2){
							$(".papersType").text("护照");
						}else if(data.data.papersType==3){
							$(".papersType").text("港澳通行证");
						}else if(data.data.papersType==4){
							$(".papersType").text("军官证");
						}else{
							$(".papersType").text("其他");
						}
						if(data.data.researchAreaData!=''){
							var researchAreaData = JSON.parse(data.data.researchAreaData);
							var researchAreaDataArr=[];
							$.each(researchAreaData, function(i,n) {
								researchAreaDataArr.push(n.researchAreaName);
							});
							researchAreaDataArr.join(",");
							$(".researchArea").text(researchAreaDataArr);
						}
						var teacherUl = $(".file-id");
						var teacherLi = "";
						var fileIdsArr = $.parseJSON(data.data.fileIds);
						if(fileIdsArr.length > 0) {
							$.each(fileIdsArr, function(i, v) {
								teacherLi += '<li>'+
												 '<span class="file-name" style="margin-right: 50px;color:blue;cursor: pointer">'+
													 '<input type="hidden" class="fileURL" value="'+$yt_option.acl_path +'api/tAscPortraitInfo/download?isDownload=true&pkId='+v.fileId+'">'+
													 '<input type="hidden" class="file-span-id" value="'+v.pkId+'" >'+v.fileName+
												 '</span>'+
											 '</li>';
									teacherUl.html(teacherLi);
							});
						}
						//流程
						if(data.data.flowLog  != ""){
							$(".approve-content-box").show();
							var flowLog = $.parseJSON(data.data.flowLog);
							var middleStepHtml;
							var length=flowLog.length;
							$(".middle-box").remove();
							$.each(flowLog, function(i,v) {
								
								//如果i等于0是最后一步流程数据
								if(i==0){
									if(v.tastKey == "activitiStartTask"){
										tastKey = 'activitiStartTask';
									}
									if (v.tastKey == "activitiEndTask") {//审批最后一步隐藏下一步操作人
										$(".next-operate-person-tr").hide();
										if(v.deleteReason!='' || backPage !=2 ){//从我的申请和申请查询跳转查询详情不能审批
											$(".btn-box").hide();
											$('.last-box').hide();
											var order=length-i;
											middleStepHtml='<div class="middle-box">'+	
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
																		'<li class="view-time-li middle-step-commentTime" style="text-align:right;">'+v.commentTime+'</li>'+
																		'<li class="operate-view-box-li">'+
																			'<div class="operate-view-title-li">操作意见：</div>'+
																			'<div class="operate-view-text-li middle-step-comment">'+v.comment+'</div>'+
																		'</li>'+
																	'</ul>'+
																'</div>'+
															'</div>';
											$('.last-step').append(middleStepHtml);	
										}
									}else if((v.tastKey == "activitiStartTask" && indexNum == "2") || backPage !=2){//indexNum=2表示审批记录页面列表跳转
										$(".btn-box").hide();
										$('.last-box').hide();
										var order=length-i;
										middleStepHtml='<div class="middle-box">'+	
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
																	'<li class="view-time-li middle-step-commentTime" style="text-align:right;">'+v.commentTime+'</li>'+
																	'<li class="operate-view-box-li">'+
																		'<div class="operate-view-title-li">操作意见：</div>'+
																		'<div class="operate-view-text-li middle-step-comment">'+v.comment+'</div>'+
																	'</li>'+
																'</ul>'+
															'</div>'+
														'</div>';
										$('.last-step').append(middleStepHtml);	
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
									$(".first-step-comment").text(v.comment);
								};
								//如果i不等于且不等于length-1，是流程的中间步骤
								if(i!=0 && i< length-1){
									//流程序号
									var order=length-i;
									middleStepHtml='<div class="middle-box">'+	
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
																'<li class="view-time-li middle-step-commentTime"  style="text-align:right;">'+v.commentTime+'</li>'+
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
						};
						var showBox='';
							$.each(data.data.dollarsStandardHis,function(i,n){
								if(n.dataStates==1){
								showBox +='<div class="tip-box"><table class="tip-table"><tr><td class="tip-lable">变更时间：</td><td>'+n.updateTimeString+'</td></tr>' +
								'<tr><td class="tip-lable">课酬标准：</td><td>' + n.dollarsStandardHalfBefore + '元/半天</td></tr>' +
								'<tr><td class="tip-lable"></td><td>' + n.dollarsStandardOneBefore + '元/天</td></tr>' +
								'<tr><td class="tip-lable">审批状态：</td><td>' + n.workFlawState + '</td></tr></table></div>';
								}else if(n.dataStates==2){
								showBox +='<div class="tip-box"><table class="tip-table"><tr style="border-top: 1px dashed #ffffff;"><td class="tip-lable">变更时间：</td><td>'+n.updateTimeString+'</td></tr>' +
								'<tr><td class="tip-lable">课酬标准：</td><td>' + n.dollarsStandardHalfBefore + '元/半天</td></tr>' +
								'<tr><td class="tip-lable"></td><td>' + n.dollarsStandardOneBefore + '元/天</td></tr>' +
								'<tr><td class="tip-lable">变更原因：</td><td>' + n.changeReason + '</td></tr>' +
								'<tr><td class="tip-lable">审批状态：</td><td>' + n.workFlawState + '</td></tr></table></div>';
								}
							})
							if(data.data.dollarsStandardHis.length==0){
								showBox +='<tr><td class="tip-lable">无变更记录</td></tr>'
							}
							showBox+='';
						$('.changeRecord').tooltip({
							position: 'right',
							content: function() {
								return showBox;
							},
							onShow: function() {
								$(this).tooltip('tip').css({
									backgroundColor: '#666',
									borderColor: '#666',
									color:'#fff'
								});
							}
						})
						//下一步操作人
						var nextPersonList = teacherList.getworkFlowOperate();
						if(nextPersonList != null) {
							$("#nextPeople").empty();
							$("#nextPeople").append('<option value="no">请选择下一步操作人</option>');
							$.each(nextPersonList, function(g, p) {
								$("#nextPeople").append('<option value="' + p.userCode + '">' + p.userName + '</option>');
							});
						};
						$("#nextPeople").niceSelect();
						$yt_baseElement.hideLoading();
						var dollarsStandardHalf; 
						var dollarsStandardOne;
						if(tastKey=='activitiStartTask'){
							//流程被退回
							$(".btn-box").show();
							$('.last-box').show();
							$('.middle-box').eq(0).hide();
							$('.agree-disagree').parents('tr').hide();
							if(data.data.dataStates==1){
								dollarsStandardHalf=0;
								dollarsStandardOne=0;
								//审批的数据
								var h = '<input type="text" class="yt-input dollarsStandardHalfBefore" value="'+$yt_baseElement.fmMoney(data.data.dollarsStandardHalfBefore)+'" style="border: 1px solid #DFE6F3;"/>元/半天    <input type="text" class="yt-input dollarsStandardOneBefore"  value="'+$yt_baseElement.fmMoney(data.data.dollarsStandardOneBefore)+'"  style="border: 1px solid #DFE6F3;"/>元/天'
								$('.dollars-standard-before').html(h);
							}else if(data.data.dataStates==2){
								dollarsStandardHalf = data.data.dollarsStandardHalf;
								dollarsStandardOne = data.data.dollarsStandardOne;
								//变更的数据
								var h = '<input type="text" class="yt-input dollarsStandardHalfBefore" value="'+$yt_baseElement.fmMoney(data.data.dollarsStandardHalfBefore)+'"  style="border: 1px solid #DFE6F3;"/>元/半天    <input type="text" class="yt-input dollarsStandardOneBefore"  value="'+$yt_baseElement.fmMoney(data.data.dollarsStandardOneBefore)+'"  style="border: 1px solid #DFE6F3;"/>元/天'
								$('.dollars-standard-after').html(h);
								var c = '<textarea class="yt-textarea changeReason-textarea">'+$('.changeReason').text()+'</textarea>'
								$('.changeReason').html(c);
							}
							$('.dollarsStandardHalfBefore').focus(function(){
								$(this).val($yt_baseElement.rmoney($(this).val()))
							})
							$('.dollarsStandardHalfBefore').blur(function(){
								$('.dollarsStandardOneBefore').val(Number($(this).val())*2)
								$(this).val($yt_baseElement.fmMoney($(this).val()))
								$('.dollarsStandardOneBefore').val($yt_baseElement.fmMoney($('.dollarsStandardOneBefore').val()))
							})
							$('.dollarsStandardOneBefore').focus(function(){
								$(this).val($yt_baseElement.rmoney($(this).val()))
							})
							$('.dollarsStandardOneBefore').blur(function(){
								$(this).val($yt_baseElement.fmMoney($(this).val()))
							})
							$('#last-submit').attr('id','lastsub');
							$('#lastsub').off().click(function(){
								$.ajax({
									type:"post",
									url:$yt_option.base_path+"teacher/addOrApprovalTeacher",
									async:false,
									data:{
										dataStates:data.data.dataStates,
										teacherId:data.data.pkId,
										dollarsStandardHalf:dollarsStandardHalf,
										dollarsStandardOne:dollarsStandardOne,
										dollarsStandardHalfBefore:$yt_baseElement.rmoney($('.dollarsStandardHalfBefore').val()),
										dollarsStandardOneBefore:$yt_baseElement.rmoney($('.dollarsStandardOneBefore').val()),
										changeReason:$('.changeReason-textarea').val(),
										businessCode:'teacher',
										dealingWithPeople:$('#nextPeople').val(),
										opintion:$('#opintion').val(),
										processInstanceId:data.data.processInstanceId,
										nextCode:'submited'
									},
									beforeSend:function(){
										$yt_baseElement.showLoading();
									},
									success:function(data){
										if(data.flag==0){
											$yt_baseElement.hideLoading(function(){
												$yt_alert_Model.prompt('提交成功');
												window.history.back();
											});
										}else{
											$yt_baseElement.hideLoading(function(){
												$yt_alert_Model.prompt('提交失败')
											});
										}
									},
									error:function(){
										$yt_baseElement.hideLoading(function(){
												$yt_alert_Model.prompt('网络异常，提交失败')
											});
									}
								});
							})
						}
					}else{
						$yt_alert_Model.prompt("获取失败");
						$yt_baseElement.hideLoading();
					}
				}
			});
	},
	//获取下一步操作人
	getworkFlowOperate: function() {
		var processInstanceId = $yt_common.GetQueryString('processInstanceId');
		var list = [];
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/workFlowOperate/getSubmitPageData",
			data: {
				businessCode: "teacher",
				processInstanceId:processInstanceId
			},
			async: false,
			success: function(data) {
				if (data.data != null) {
					$.each(data.data, function(i, n) {
						for(var k in n) {
							list = n[k];
						}
					});
				}
			}
		});
		return list;
	},
	/**
	 * 获取授课记录列表数据
	 */
	getTeachRecordsList: function() {
		var teacherId = $yt_common.GetQueryString("pkId");
		$('.record-info').pageInfo({
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "teacher/getClassCourseData", //ajax访问路径  
			async:true,
			before:function(){
				$yt_baseElement.showLoading();
			},
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				teacherId:teacherId
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.records-tbody');
					var htmlTr = '';
					var num = 1;
					if(data.data.rows!=null){
						if(data.data.rows.length > 0) {
							$(htmlTbody).empty();
							var fileNameArr = "";
							$.each(data.data.rows, function(i, v) {
								if(v.combinedScore==null){
									v.combinedScore=" ";
								}
								fileNameArr="";
								var filesArr = $.parseJSON(v.files);
								$.each(filesArr, function(i, n) {
									if(fileNameArr==""){
										fileNameArr = n.fileName;
									}else{
										fileNameArr += "," + n.fileName;
									}
								});
								htmlTr = '<tr>' +
									'<td>' + num++ + '</td>' +
									'<td>'+v.courseDate+'</td>' +
									'<td style="text-align: left;">' + v.className + '</td>' +
									'<td style="text-align: left;">' + v.projectUserName + '</td>' +
									'<td style="text-align: left;">' + v.courseName + '</td>' +
									'<td style="text-align: left;">' + fileNameArr + '</td>' +
									'<td style="text-align: right;">' + v.combinedScore + '</td>' +
									'</tr>';
									htmlTbody.append($(htmlTr).data("legalData",v));
							});
						}
					}else{
						$(".record-info").hide();
					}
					$yt_baseElement.hideLoading();
				} else {
					$yt_alert_Model.prompt("查询失败");
					$yt_baseElement.hideLoading();
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	/**
	 * 获取可授课程列表数据
	 */
	getTeachCoursesList: function() {
		$yt_baseElement.showLoading();
		var teacherId = $yt_common.GetQueryString('pkId');
		$('.course-info').pageInfo({
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "teacher/lookForAllByCourse", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				teacherId:teacherId
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.courses-tbody');
					var htmlTr = '';
					var num = 1;
					if(data.data.rows.length > 0) {
						$(htmlTbody).empty()
						$.each(data.data.rows, function(i, v) {
							htmlTr = '<tr>' +
								'<td><input type="hidden" value="' + v.pkId + '" class="pkId">' + num++ + '</td>' +
								'<td style="text-align:left">'+v.courseTitle+'</td>' +
								'<td style="text-align:left">' + v.courseDetails + '</td>' +
								'<td style="font-weight:bold;color:#c9c9c9;"><img src="../../resources/images/icons/amend.png" style="margin" class="img-amend" alt="" />'+'|'+'<img src="../../resources/images/icons/t-del.png" class="img-del" alt="" />' +
								'</tr>';
								htmlTbody.append($(htmlTr).data("courseData",v));
								
						});
					}else{
						$(".course-info").hide();
					}
					$yt_baseElement.hideLoading();
				} else {
					$yt_alert_Model.prompt("查询失败");
					$yt_baseElement.hideLoading();
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	//新增可授课程
	addCourseList: function() {
		var  validFlag = $yt_valid.validForm($(".valid-tab"));
		if(validFlag){
			
			
		}else{
			
		}
		var teacherId = $yt_common.GetQueryString('pkId');
		var courseTitle = $(".alert-index .course-title").val();
		var courseDetails = $(".alert-index .course-details").val();
		
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "teacher/addOrUpdateBeanByCourse", //ajax访问路径  
			data: {
				teacherId:teacherId	,  
				courseTitle:courseTitle,      
				courseDetails: courseDetails
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0){
				 	$yt_alert_Model.prompt("新增成功");
				 	$(".yt-edit-alert").hide();
				 	$('.course-info').pageInfo("refresh");
				}else{
					$yt_alert_Model.prompt("新增失败");
					$(".alert-index").hide();
					$yt_baseElement.hideLoading();
				}
			} 
		});
	},
	//修改可授课程
	amendCourseList: function(pkId) {
		var  validFlag = $yt_valid.validForm($(".valid-tab"));
		if(validFlag){
			
			
		}else{
			
		}
		var teacherId = $yt_common.GetQueryString('pkId');
		var courseTitle = $(".alert-index .course-title").val();
		var courseDetails = $(".alert-index .course-details").val();
		
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "teacher/addOrUpdateBeanByCourse", //ajax访问路径  
			data: {
				pkId:pkId,
				teacherId:teacherId	,  
				courseTitle:courseTitle,      
				courseDetails: courseDetails
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0){
				 	$yt_alert_Model.prompt("修改成功");
				 	$(".yt-edit-alert").hide();
				 	$('.course-info').pageInfo("refresh");
				}else{
					$yt_alert_Model.prompt("修改失败");
					$yt_baseElement.hideLoading();
				}
			} 
		});
	},
	//删除
    delCourseList:function(pkId) {
		$yt_alert_Model.alertOne({
			haveCloseIcon: false, //是否带有关闭图标  
			closeIconUrl: "", //关闭图标路径  
			leftBtnName: "确定", //左侧按钮名称,默认确定  
			rightBtnName: "取消", //右侧按钮名称,默认取消  
			cancelFunction: "", //取消按钮操作方法*/  
			alertMsg: "数据删除将无法恢复，确认删除吗？", //提示信息  
			confirmFunction: function() { //点击确定按钮执行方法  
				$.ajax({
					type: "post",
					url: $yt_option.base_path + "teacher/deleteByCourseId",
					data: {
						pkId:pkId
					},
					success: function(data) {
						if(data.flag == 0) {
							$yt_alert_Model.prompt("删除成功");
				 			teacherList.getTeachCoursesList();
						} else {
							$yt_alert_Model.prompt("删除失败");
						}

					}

				});

			}
		});
	},
	//带有顶部标题栏的弹出框  
	    legalAdd:function() {  
	        /** 
	         * 显示编辑弹出框和显示顶部隐藏蒙层 
	         */  
	        $(".alert-index").show();  
	        /** 
	         * 调用算取div显示位置方法 
	         */  
	        $yt_alert_Model.getDivPosition($(".alert-index"));  
	        $yt_alert_Model.setFiexBoxHeight($(".add-course-alert form"));
	        /* 
	         * 调用支持拖拽的方法 
	         */  
	        $yt_model_drag.modelDragEvent($(".lawyer-opinion-box .yt-edit-alert-title"));  
	        /** 
	         * 点击取消方法 
	         */  
	        $('.alert-index .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {  
	            //隐藏页面中自定义的表单内容  
	            $(".alert-index").hide();  
	            //隐藏蒙层  
	            $("#pop-modle-alert").hide();  
	        });  
	    },
	    /**
	 * 获取课件文件列表数据
	 */
	getTeachCourseWareList: function() {
		var teacherId = $yt_common.GetQueryString("pkId");
		$('.courseware-info').pageInfo({
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "teacher/getClassCourseFileList", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			async:true,
			before:function(){
				$yt_baseElement.showLoading();
			},
			data: {
				teacherId:teacherId
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.courseware-tbody');
					var htmlTr = '';
					var num = 1;
					if(data.data.rows!=null){
						if(data.data.rows.length > 0) {
							$('.courseware-info').show();
							$(htmlTbody).empty();
							$.each(data.data.rows, function(i, v) {
								htmlTr = '<tr>' +
									'<td><input type="hidden" value="' + v.pkId + '" class="pkId">' + num++ + '</td>' +
									'<td style="text-align: left;"><a href="'+v.fileUrl+'" class="yt-link">'+v.fileName+'</a></td>' +
									'<td style="text-align: left;">' + v.createUserName + '</td>' +
									'<td>' + v.createTimeString + '</td>' +
									'<td style="text-align: left;">' + v.fileSize + '</td>' +
									'</tr>';
									htmlTbody.append($(htmlTr).data("courseWareData",v));
									
							});
						} 
					}else{
						$('.courseware-info').hide();
					}
					$yt_baseElement.hideLoading();
				} else {
					$yt_alert_Model.prompt("查询失败");
					$yt_baseElement.hideLoading();
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	pageToScroll: function(validObj) {
		var scrollTopVal = 0;
		$(validObj).each(function() {
			if($(this).text() != "") {
				if($(window).scrollTop() && ($(this).eq(0).parent().offset().top < $(window).scrollTop() || $(this).eq(0).parent().offset().top > $(window).height())) {
					scrollTopVal = $(this).eq(0).parents().offset().top - 30;
					$(window).scrollTop(scrollTopVal);
				}
				return false;
			}
		});
	}
}
$(function() {
	//初始化方法
	teacherList.init();
	
});