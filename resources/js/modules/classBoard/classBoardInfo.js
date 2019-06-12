var classBoardInfo = {
	//初始化方法
	init: function() {
		//调用获取列表数据方法
		classBoardInfo.projectDetail();
		var scrollTo = $yt_common.GetQueryString("scrollTop");
		if(scrollTo=='receptionActivities'){
			console.log($('.class-info-div').eq(3).offset().top)
			$(document).scrollTop($('.class-info-div').eq(3).offset().top);
		}else if(scrollTo=='personnelNames'){
			console.log($('.class-info-div').eq(1).offset().top)
			$(document).scrollTop($('.class-info-div').eq(1).offset().top);
		}else if(scrollTo=='importantTrainee'){
			console.log($('.class-info-div').eq(2).offset().top)
			$(document).scrollTop($('.class-info-div').eq(2).offset().top);
		}
		$('.class-return-img').click(function(){
			//返回
			window.history.back();
		})
		//导航
		$('.nav li').click(function(){
			$('body,html').animate({
				scrollTop:$('.class-info-div').eq($(this).index()).offset().top
			},300)
		})
		$('.page-return-btn').click(function(){
			window.history.back();
		})
	},
	projectDetail:function(){
		var projectCode = $yt_common.GetQueryString("projectCode");
		$.ajax({
			type:"post",
			url:$yt_option.base_path + "class/getClassKanBanByPkId",
			async:false,
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			data:{
				projectCode: projectCode
			},
			success:function(data){
				if(data.flag==0){
					//点击更多，进入班级信息页面
					$('.see-more-mssage').click(function(){
							window.location.href="../class/classInfo.html?projectCode="+ data.data.projectCode+"&projectType="+data.data.projectType
					})
					if(data.data.projectType == 2) {
						data.data.projectTypeVal = "委托";
					} else if(data.data.projectType == 3) {
						data.data.projectTypeVal = "选学";
					} else if(data.data.projectType == 4) {
						data.data.projectTypeVal = "调训";
					}
					$('.class-info-table').setDatas(data.data);
					$('.project-name').text(data.data.projectName);
					//委托方领导及驻班员
					var tbody = $('.entrust-info-table').empty();
					var tr = '';
					data.data.personnelNames = JSON.parse(data.data.personnelNames);
					if(data.data.personnelNames.length>0){
						$.each(data.data.personnelNames, function(i,n) {
							if(n.types==1){
								n.typesVel='驻班员'
							}else if(n.types == 2){
								n.typesVel='委托方领导'
							}
							var deptposition = [];
							deptposition.push(n.deptName);
							deptposition.push(n.positionName);
							deptposition = deptposition.join('');
							tr = '<tr>'+
									'<td width="80px">'+
										'<span>姓名：</span>'+
									'</td>'+
									'<td width="100px">'+
										'<div type="text" class="customer-unit project-div">'+n.personnelName+'</div>'+
									'</td>'+
									'<td width="80px">'+
										'<span>身份：</span>'+
									'</td>'+
									'<td width="150px">'+
										'<div type="text" class="customer-dept project-div">'+n.typesVel+'</div>'+
									'</td>'+
									'<td width="80px">'+
										'<span>单位：</span>'+
									'</td>'+
									'<td>'+
										'<div type="text" class="customer-dept project-div">'+n.groupName+'</div>'+
									'</td>'+
									'<td width="80px">'+
										'<span>部门职务：</span>'+
									'</td>'+
									'<td width="150px">'+
										'<div type="text" class="customer-dept project-div">'+n.deptName+n.positionName+'</div>'+
									'</td>'+
									'<td width="80px">'+
										'<span>备注：</span>'+
									'</td>'+
									'<td>'+
										'<div type="text" class="customer-dept project-div">'+n.remarks+'</div>'+
									'</td>'+
								'</tr>';
								tbody.append(tr);
						});
					}else{
						tr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="10" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
							tbody.append(tr);
					}
					//重要学员
					var htmlTbody = $('.teacher-list-tbody').empty();
					var htmlTr = '';
					data.data.importantTrainee = JSON.parse(data.data.importantTrainee);
					if(data.data.importantTrainee.length>0){
						$.each(data.data.importantTrainee, function(i,n) {
							if(n.gender==1){
								n.genderVel='男'
							}else if(n.gender == 2){
								n.genderVel='女'
							}else{
								n.genderVel=''
							}
							if(n.isFirstTraining==0){
								n.isFirstTrainingVel = '否';
							}else if(n.isFirstTraining==1){
								n.isFirstTrainingVel = '是';
							}
							//部门/职位
							var deposName = [];
							n.deptName!=''?deposName.push(n.deptName):n.deptName=n.deptName;
							n.positionName!=''?deposName.push(n.positionName):n.positionName=n.positionName;
							deposName = deposName.join('/');
							htmlTr = '<tr>'+
										'<td>'+(i+1)+'</td>'+
										'<td><a class="traineeName" style="color:#3c4687">'+n.traineeName+'</a></td>'+
										'<td>'+n.genderVel+'</td>'+
										'<td>'+n.phone+'</td>'+
										'<td style="text-align: left;">'+n.groupName+'</td>'+
										'<td style="text-align: left;">'+n.groupOrgName+'</td>'+
										'<td>'+deposName+'</td>'+
										'<td>'+n.isFirstTrainingVel+'</td>'+
										'<td style="text-align: left;">'+n.importantDetails+'</td>'+
									'</tr>';
								htmlTr = $(htmlTr).data('data',n);
								htmlTbody.append(htmlTr);
						});
						$('.traineeName').off().click(function(){
							//点击姓名查看选学学员详情
							classBoardInfo.getStudentInf($(this).parents('tr').data('data').traineeId,data.data.pkId);
								//获取被选中行的详细信息
								/** 
							 * 显示编辑弹出框和显示顶部隐藏蒙层 
							 */
							$(".elementary-student-details").show();
							/** 
							 * 调用算取div显示位置方法 
							 */
							$yt_alert_Model.getDivPosition($(".elementary-student-details"));
							$yt_alert_Model.setFiexBoxHeight($(".elementary-student-details .alert-form"));
							/* 
							 * 调用支持拖拽的方法 
							 */
							$yt_model_drag.modelDragEvent($(".elementary-student-details .yt-edit-alert-title"));
							/** 
							 * 点击取消方法 
							 */
							$('.elementary-student-details .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
								//隐藏页面中自定义的表单内容  
								$(".elementary-student-details").hide();
								//隐藏蒙层  
								$("#pop-modle-alert").hide();
							});
						})
					}else{
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="9" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
							htmlTbody.append(htmlTr);
					}
					//接待活动receptionActivities
					var activeTable = $('.acive-info-centent').empty();
					var activeTr = '';
					data.data.receptionActivities = JSON.parse(data.data.receptionActivities);
					if(data.data.receptionActivities.length>0){
						$.each(data.data.receptionActivities, function(i,n) {
							if(n.types==1){
								n.typesVel='院领导出席开班式'
							}else if(n.types == 2){
								n.typesVel='院领导出席结业式'
							}
							else if(n.types == 3){
								n.typesVel='院领导贵宾厅座谈'
							}
							else if(n.types == 4){
								n.typesVel='院领导交流座谈'
							}
							var raTime = n.raTimeStart+'-'+n.raTimeEnd;
							activeTr = '<div class="active-title">'+
									'<label class="active-num">'+(i+1)+'</label>接待活动</div>'+
									'<div class="active-content">'+
									'<table class="active-table">'+
									'<tr><td>类型：</td><td>'+n.typesVel+'</td></tr>'+
									'<tr><td>出席领导：</td><td>'+n.userName+'</td></tr>'+
									'<tr><td>日期：</td><td>'+n.raDate+'</td></tr>'+
									'<tr><td>时间：</td><td>'+raTime+'</td></tr>'+
									'<tr><td>地点：</td><td>'+n.raAddress+'</td></tr>'+
									'<tr><td>对方人员：</td><td>'+n.personOther+'</td></tr>'+
									'<tr><td>活动流程：</td><td>'+n.activityFlow+'</td></tr>'+
								'</table>'+
							'</div>'
							activeTable.append(activeTr);
						});
					}else{
						activeTr ='<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>'
							activeTable.append(activeTr);
					}
					$yt_baseElement.hideLoading();
				}else{
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt('查询失败')
					});
				}
				
				
				
			},
			error:function(data){
				$yt_alert_Model.prompt('网络异常，获取项目信息失败');
			}
		});
	},
	getStudentInf: function(traineeId,projectId) {
		var me = this ;
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "class/trainee/getTraineeDetails", //ajax访问路径  
			data: {
				traineeId: traineeId,
				projectId: projectId
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					if(data.data.types == 1) {
						data.data.types = "央企集团本部"
					} else if(data.data.types == 2) {
						data.data.types = "央企二级公司"
					} else if(data.data.types == 3) {
						data.data.types = "央企三级公司"
					} else if(data.data.types == 4) {
						data.data.types = "省属企业"
					} else if(data.data.types == 5) {
						data.data.types = "市属企业"
					} else if(data.data.types == 6) {
						data.data.types = "其他"
					}
					if(data.data.checkInState == 0) {
						data.data.checkInState = "未报到"
					} else if(data.data.checkInState == 1) {
						data.data.checkInState = "已报到"
					}
					if(data.data.paymentState == 0) {
						data.data.paymentState = "未对账"
					} else if(data.data.paymentState == 1) {
						data.data.paymentState = "已对账"
					}
					if(data.data.isOrderNum == 0) {
						data.data.isOrderNum = "未开票"
						$(".order-num").hide();
						$(".order-money").hide();
					} else if(data.data.isOrderNum == 1) {
						data.data.isOrderNum = "已开票"
					}
					if(data.data.projectStates == 1) {
						data.data.projectStates = "未开始"
					} else if(data.data.projectStates == 2) {
						data.data.projectStates = "培训中"
					} else if(data.data.projectStates == 3) {
						data.data.projectStates = "未结项"
					} else if(data.data.projectStates == 4) {
						data.data.projectStates = "已结项"
					}
					if(data.data.remarks == "") {
						data.data.remarks = "有效"
					}
					data.data.gender=='1'?data.data.gender='男':data.data.gender='女';
					data.data.nationId=='0'?data.data.nationId='':data.data.nationId=data.data.nationId;
					data.data.workTime=='0000-00-00'?data.data.workTime='':data.data.workTime=data.data.workTime;
					$(".elementary-student-details").setDatas(data.data);
					$(".add-elementary-student").setDatas(data.data);
					//获取民族
					 classBoardInfo.getListSelectNations();
					if(classBoardInfo.nationsList != null) {
						console.log(classBoardInfo.nationsList);
						$.each(classBoardInfo.nationsList, function(i, n) {
							if($("span.nation-id").text() == n.nationId) {
								$("span.nation-id").text(n.nationName);
							}
						});
					};
					if($("span.id-type").text() == 1) {
						$("span.id-type").text("身份证");
					} else if($("span.id-type").text() == 2) {
						$("span.id-type").text("护照");
					} else if($("span.id-type").text() == 3) {
						$("span.id-type").text("军官证");
					} else if($("span.id-type").text() == 4) {
						$("span.id-type").text("其他")
					};
					//开票信息
					var recordList = data.data.orderList;
					var recordBody = $('.order-list-tbody').empty();
					var recordHtml = '';
					if(recordList.length!=0){
							$.each(recordList, function(i,v) {
							v.isOrderNum==1?v.isOrderNum='已开票':v.isOrderNum='未开票';
							recordHtml='<tr>'+
							'<td style="text-align: right;" width="80px">开票状态：</td>'+
							'<td style="text-align: left;" width="150px">'+v.isOrderNum+'</td>'+
							'<td class="order-num" style="text-align: right;" width="80px">发票号：</td>'+
							'<td style="text-align: left;" width="120px">'+v.orderNum+'</td>'+
							'<td class="order-money" style="text-align: right;" width="80px">开票金额：</td>'+
							'<td style="text-align: left;" width="120px">'+v.tuition+'</td>'+
							'<td width="80px"><div class="addorder addorder'+i+'" style="display:none;padding: 5px 10px;border: 1px dashed #E6E6E6;cursor: pointer;">合并开票</div></td>'
							'</tr>';
							recordBody.append(recordHtml);
							var trainees = v.trainees.split(',');
							if(trainees.length>1){
								$('.addorder'+i).show().data('trainees',trainees.join('  '));
							}
							$('.addorder').tooltip({
								position: 'bottom',
								content: function() {
									var showBox = '<table class="tip-table">' +
										'<tr><td style="text-align:left">合并开票者：</td></tr><tr><td>' + $(this).data('trainees') + '</td></tr>' +
										'</table>';
									return showBox;
								},
								onShow: function() {
									$(this).tooltip('tip').css({
										backgroundColor: '#666',
										borderColor: '#666',
										color: '#fff'
									});
								}
							});
						});
					}else{
						recordHtml = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td width="77px" align="right" style="border:0px;">开票状态：</td>' +
							'<td align="left" style="border:0px;">未开票</td>' +
							'</tr>';
							recordBody.append(recordHtml);
					}
					
					var trainList = data.data.trainList;
					var htmlTbody = $(".train-list-tbody");
					var htmlTr = "";
					$.each(trainList, function(i, v) {
						htmlTr += '<tr>' +
							'<td style="text-align:center" class="project-code"><span style="">' + v.projectCode + '</span></td>' +
							'<td style="text-align:left">' + v.projectName + '</td>' +
							'<td style="text-align:center" class="project-head">' + v.startDate + '</td>' +
							'<td style="text-align:center" class="certificate-no">' + v.projectHead + '</td>' +
							'<td style="text-align:right" class="start-date">' + v.certificateNo + '</td>' +
							'</tr>';
					})
					htmlTbody.html(htmlTr);
					$yt_alert_Model.setFiexBoxHeight($(".elementary-student-details .alert-form"));
					$yt_baseElement.hideLoading();
				} else {
					$yt_alert_Model.prompt("获取失败");
					$yt_baseElement.hideLoading();
				}
			}
		});
	},
	nationsList:[],
	getListSelectNations: function() {
		var me = this;
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/getNations",
			data: {
				searchParameters: ""
			},
			async: false,
			success: function(data) {
				me.nationsList = data.data ;
			}
		});
	}
	}
$(function() {
	//初始化方法
	classBoardInfo.init();
	$(document).scroll(function(){
		var scr = $(document).scrollTop();
		if(scr<=$('.class-info-div').eq(0).offset().top){
			$.each($('.nav ul li'), function(i,n) {
				if(i==0){
					$('.nav ul li').eq(i).css('color','#de595a')
				}else{
					$('.nav ul li').eq(i).css('color','#fff')
				}
			});
		}
		if(scr<=$('.class-info-div').eq(1).offset().top&&scr>$('.class-info-div').eq(0).offset().top){
			$.each($('.nav ul li'), function(i,n) {
				if(i==1){
					$('.nav ul li').eq(i).css('color','#de595a')
				}else{
					$('.nav ul li').eq(i).css('color','#fff')
				}
			});
		}
		if(scr<=$('.class-info-div').eq(2).offset().top&&scr>$('.class-info-div').eq(1).offset().top){
			$.each($('.nav ul li'), function(i,n) {
				if(i==2){
					$('.nav ul li').eq(i).css('color','#de595a')
				}else{
					$('.nav ul li').eq(i).css('color','#fff')
				}
			});
		}
		if(scr<=$('.class-info-div').eq(3).offset().top&&scr>$('.class-info-div').eq(2).offset().top){
			$.each($('.nav ul li'), function(i,n) {
				if(i==3){
					$('.nav ul li').eq(i).css('color','#de595a')
				}else{
					$('.nav ul li').eq(i).css('color','#fff')
				}
			});
		}
	})
});