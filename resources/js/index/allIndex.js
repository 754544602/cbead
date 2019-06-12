//教务负责人首页
var index = {
	init: function() {
		var me = this;
		dateinit();
		me.indexData();
		index.classplan();
		$('.index-rates-yes').show();
		//本月班级信息--跳转查询班级列表
		$('.nowmouth-class').click(function(){
			$left_menu.locationToMenu('{"url":"view/class/classMg.html"}');
		})
		
		$('.index-info,.index-ready').off().on('click','.projectName',function(){
			projectCode = $(this).parents('tr').data('data').projectCode;
			projectType = $(this).parents('tr').data('data').projectType;
			window.location.href='../class/classInfo.html?projectCode='+projectCode+'&projectType='+projectType;
		})
		//项目决算
		$('.nowmouth-classsum').click(function(){
			$left_menu.locationToMenu('{"url":"view/projectSettlement/projectSettlementList.html"}');
		});
		//对账未完成
		$('.nofinishMore').click(function(){
			$left_menu.locationToMenu('{"url":"view/bank/projectBillList.html"}');
		})
		//开票未完成
		$('.nofinishInvoice').click(function(){
			$left_menu.locationToMenu('{"url":"view/ticketOpen/ticketOpenList.html"}');
		})
	},
	dates: '',
	year: '',
	month: '',
	days: '',
	indexData: function() {
		var me = this ;
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "index/getIndexDataByRegistrar",
			beforeSend: function() {
				$yt_baseElement.showLoading();
			},
			async: true,
			data: {},
			success: function(data) {
				data.data.projectStatistics==null?data.data.projectStatistics='':data.data.projectStatistics=data.data.projectStatistics;
				//今年项目统计
				$('.educationIndex .index-top-middle').setDatas(data.data.projectStatistics);
				//待办事项-立项审批
				function examination(){
				$('.index-rates-approve caption span').text('立项审批');
				var examinationBody = $('.index-rates-project').empty();
					var examinationHtml = '';
				if(data.data.examinationApproval.length > 0) {
					$('.index-rates-approve thead').empty().append('<tr><th>项目名称</th>'+
						'<th>委托单位</th>'+
						'<th>预计培训时间</th>'+
						'<th>项目销售</th>'+
						'<th>洽谈记录</th>'+
						'<th>学员数量</th>'+
						'<th>项目状态</th>'+
						'</tr>');
					$.each(data.data.examinationApproval, function(i, n) {
						//							洽谈状态 1:咨询 2:在谈3:意向4:方案5:调整6:签约7:取消
						if(n.projectNegotiationRecord == 1) {
							n.projectNegotiationRecord = '咨询'
						} else if(n.projectNegotiationRecord == 2) {
							n.projectNegotiationRecord = '在谈'
						} else if(n.projectNegotiationRecord == 3) {
							n.projectNegotiationRecord = '意向'
						} else if(n.projectNegotiationRecord == 4) {
							n.projectNegotiationRecord = '方案'
						} else if(n.projectNegotiationRecord == 5) {
							n.projectNegotiationRecord = '调整'
						} else if(n.projectNegotiationRecord == 6) {
							n.projectNegotiationRecord = '签约'
						} else if(n.projectNegotiationRecord == 7) {
							n.projectNegotiationRecord = '取消'
						}
						n.negotiationRecord == '' ? n.negotiationRecord = '0' : n.negotiationRecord = n.negotiationRecord;
						examinationHtml = '<tr>' +
							'<td><a class="projectName">' + n.projectName + '</a></td>' +
							'<td>' + n.groupName + '</td>' +
							'<td>' + n.startDateString + '</td>' +
							'<td>' + n.projectSell + '</td>' +
							'<td>' + n.negotiationRecord + '次</td>' +
							'<td>' + n.traineeCount + '</td>' +
							'<td>' + n.projectNegotiationRecord + '</td>' +
							'</tr>';
						examinationHtml = $(examinationHtml).data('data',n);
						examinationBody.append(examinationHtml);
					});
					$('.index-rates-project').find('.projectName').off().on('click',function(){
						var projectCode = $(this).parents('tr').data('data').projectCode;
						var pkId = $(this).parents('tr').data('data').projectId;
						window.location.href="/cbead/website/view/project/projectDetails.html?pkId=" + pkId + "&" + "projectCode=" +  projectCode + "&" + "pass=Approval&projectState=2&pageType=2&projectType=2&approveWorkPerson=awp";
					})
				} else {
					examinationHtml = '<tr style="border:0px;background-color:#fff !important;" >' +
						'<td colspan="9" align="center" style="border:0px;">' +
						'<div class="no-data" style="width: 220px;margin: 0 auto;">' +
						'<img src="../../resources/images/common/no-data.png" alt="" style="width: 220px;padding: 35px 0 20px;">' +
						'</div>' +
						'</td>' +
						'</tr>';
					examinationBody.append(examinationHtml);
				}}
				examination();
				//报销审批
				function reimApproval(){
					$('.index-rates-approve caption span').text('报销审批');
					$('.index-rates-approve thead').empty().append('<tr><th>项目名称</th>'+
						'<th width="140px">报销类型</th>'+
						'<th width="140px">报销时间</th>'+
						'<th>项目主任</th>'+
						'<th width="100px">教师人数</th>'+
						'<th width="140px">报销金额</th>'+
						'</tr>');
				var examinationBody = $('.index-rates-project').empty();
				var examinationHtml = '';
				if(data.data.reimApproval.length > 0) {
					$.each(data.data.reimApproval, function(i, n) {
						//	洽谈状态 1:咨询 2:在谈3:意向4:方案5:调整6:签约7:取消
						if(n.expenseType == 1) {
							n.expenseTypeVal = '教师课酬报销'
						} else if(n.expenseType == 2) {
							n.expenseTypeVal = '教师差旅报销'
						}
						examinationHtml = '<tr>' +
							'<td><a class="projectName">' + n.projectName + '</a></td>' +
							'<td>' + n.expenseTypeVal + '</td>' +
							'<td>' + n.createTimeString + '</td>' +
							'<td>' + n.projectHead + '</td>' +
							'<td>' + n.teacherCount + '</td>' +
							'<td>' + n.expenseMoney + '</td>' +
							'</tr>';
							examinationHtml = $(examinationHtml).data('data',n);
						examinationBody.append(examinationHtml);
					});
					$('.index-rates-project').find('.projectName').off().on('click',function(){
						var expenseType = $(this).parents('tr').data('data').expenseType;
						var pkId = $(this).parents('tr').data('data').pkId;
						if(expenseType == 1) {
							window.location.href = "/cbead/website/view/finance/reimbursementLook.html?pkId=" + pkId + '&type=allIndex';
						}
						if(expenseType == 2) {
							window.location.href = "/cbead/website/view/finance/reimburseTravelDetailsLook.html?pkId=" + pkId+'&type=allIndex';
						}					
					})
				
				} else {
					examinationHtml = '<tr style="border:0px;background-color:#fff !important;" >' +
						'<td colspan="9" align="center" style="border:0px;">' +
						'<div class="no-data" style="width: 220px;margin: 0 auto;">' +
						'<img src="../../resources/images/common/no-data.png" alt="" style="width: 220px;padding: 35px 0 20px;">' +
						'</div>' +
						'</td>' +
						'</tr>';
					examinationBody.append(examinationHtml);
				}}
				//切换标签
				$('.swich-title').on('click', 'li', function() {
					if($(this).index() == 0) {
						$(this).addClass('active').siblings().removeClass('active');
						examination();
					}
					if($(this).index() == 1) {
						$(this).addClass('active').siblings().removeClass('active');
						reimApproval();
					}
				})
				//本月班级信息
				var projecDetailsBody = $('.educationIndex .index-info tbody').empty();
				var projecDetailsHtml = '';
				if(data.data.projecDetails.length>0){
						$.each(data.data.projecDetails, function(i,n) {
							if(n.projectType==1){
								n.projectTypeVel = '计划'
							}
							else if(n.projectType==2){
								n.projectTypeVel = '委托'
							}
							else if(n.projectType==3){
								n.projectTypeVel = '选学'
							}
							else if(n.projectType==4){
								n.projectTypeVel = '中组部调训'
							}
							else if(n.projectType==5){
								n.projectTypeVel = '国资委调训'
							}
							if(n.projectStates==1){
								n.projectStates='未开始';
							}else if(n.projectStates==2){
								n.projectStates='进行中';
							}else if(n.projectStates==3){
								n.projectStates='已完成';
							}
							projecDetailsHtml = '<tr>'+
							'<td style="text-align:center" width="40px">'+(i+1)+'</td>'+
							'<td style="text-align:left" class="projectName">'+n.projectName+'</td>'+
							'<td style="text-align:center" width="60px">'+n.projectTypeVel+'</td>'+
							'<td style="text-align:center" width="90px">'+n.startDate+'</td>'+
							'<td style="text-align:center" width="90px">'+n.endDate+'</td>'+
							'<td style="text-align:left">'+n.projectHead+'</td>'+
							'<td style="text-align:right" width="60px">'+n.traineeCount+'</td>'+
							//应收金额
							'<td style="text-align:right" width="60px">'+n.amountReceivable+'</td>'+
							'<td style="text-align:right" width="60px">'+n.unpaid+'</td>'+
							'<td style="text-align:center" width="65px">'+n.projectStates+'</td>'+
							'</tr>';
							projecDetailsHtml = $(projecDetailsHtml).data('data',n);
							projecDetailsBody.append(projecDetailsHtml);
						});
					}else{
						projecDetailsHtml = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="9" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 220px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="width: 220px;padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
							projecDetailsBody.append(projecDetailsHtml);
					}
					//本月班次决算
					var accountsBody = $('.educationIndex .index-scend tbody').empty();
					var accountsHtml = '';
					if(data.data.projecFinalAccounts.length>0){
						$.each(data.data.projecFinalAccounts, function(i,n) {
							accountsHtml = '<tr>'+
							'<td style="text-align:center">'+(i+1)+'</td>'+
							'<td>'+n.projectName+'</td>'+
							'<td style="text-align:center">'+n.endDate+'</td>'+
							'<td>'+n.projectHead+'</td>'+
							'<td style="text-align:right" >'+n.traineeCount+'</td>'+
							'<td style="text-align:right">'+n.amountReceivable+'</td>'+
							'<td style="text-align:right">'+n.netReceipts+'</td>'+
							//应收金额
							'<td style="text-align:right">'+n.teacherRemuneration+'</td>'+
							'<td style="text-align:right">'+n.teacherTravel+'</td>'+
							'<td style="text-align:right">'+n.expenditureTotal+'</td>'+
							'</tr>';
							accountsHtml = $(accountsHtml).data('data',n);
							accountsBody.append(accountsHtml);
						});
					}else{
						accountsHtml = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="9" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 220px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="width: 220px;padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
							accountsBody.append(accountsHtml);
					}
				$yt_baseElement.hideLoading();
			},
			error: function(data) {
				$yt_alert_Model.prompt('网络异常，查询失败');
				$yt_baseElement.hideLoading();
			}
		});
	},
	classplan:function(){
		var me = this ;
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "project/getShiftPlan",
			async: true,
			beforeSend: function() {
				$yt_baseElement.showLoading();
			},
			data: {
				classMonth: $("#txtDate").val()
			},
			success: function(data) {
				console.log(data.data);
				if(data.flag == 0) {
					this.dates = $("#txtDate").val().split('-');
					this.year = this.dates[0];
					this.month = this.dates[1];
					this.days = new Date(this.year, this.month, 0);
					this.days = this.days.getDate();
					$('.plan-table thead tr').empty();
					$('.plan-table tbody').empty();
					$('.plan-table thead tr').append("<th width='30px'>序号</th><th>培训主题</th>");
					for(let i = 0; i < data.data.length; i++) {
						$('.plan-table tbody').append('<tr><td style="text-align:center">'+(i+1)+'</td><td>' + data.data[i].projectName + '</td></tr>'); //渲染培训主题
					}
					for(let i = 0; i < this.days; i++) {
						$('.plan-table tbody tr').append("<td class='state-day'></td>"); //渲染当月天数
					};
					setDayList(new Date($("#txtDate").val()));
					var num = 0;
					//循环每一行
					$.each(data.data, function(i, n) {
						//循环日期，赋予开始与结束类
						if(n.startDate.substring(5, 7) != n.endDate.substring(5, 7)) {
							//判断是否当月开始
							if(n.startDate.substring(5, 7) == $("#txtDate").val().substring(5, 7)) {
								$.each($('.index-plan thead tr .state-day'), function(k, v) {
									if(n.startDate == $(v).attr('currentday')) {
										$('.index-plan tbody tr').eq(i).children('.state-day').eq(k).addClass('start-state line').data('classData', n);
										$('.index-plan tbody tr').eq(i).children('.state-day').eq($('thead tr .state-day').length-1).addClass('end-state line').data('classData', n);
									}
								});
							}else if(n.startDate.substring(5, 7) <= $("#txtDate").val().substring(5, 7)){
									$('tbody tr').eq(i).children('.state-day').eq(0).addClass('start-state line').data('classData', n);
							}
							//判断是否上月开始
							if(n.endDate.substring(5, 7) == $("#txtDate").val().substring(5, 7)) {
								$.each($('.index-plan thead tr .state-day'), function(k, v) {
									if(n.endDate == $(v).attr('currentday')) {
										$('.index-plan tbody tr').eq(i).children('.state-day').eq(k).addClass('end-state line').data('classData', n);
										$('.index-plan tbody tr').eq(i).children('.state-day').eq(0).addClass('start-state line').data('classData', n);
									}
								});
							}else if(n.endDate.substring(5, 7) > $("#txtDate").val().substring(5, 7)){
									$('tbody tr').eq(i).children('.state-day').eq($('thead tr .state-day').length-1).addClass('end-state line').data('classData', n);
							}
						} else {
							for(let j = 0; j < $('.index-plan thead tr .state-day').length; j++) {
								if(n.startDate == $('.index-plan thead tr .state-day').eq(j).attr('currentday')) {
									$('.index-plan tbody tr').eq(i).children('.state-day').eq(j).addClass('start-state line').data('classData', n);
								}
								if(n.endDate == $('thead tr .state-day').eq(j).attr('currentday')) {
									$('.index-plan tbody tr').eq(i).children('.state-day').eq(j).addClass('end-state line').data('classData', n);
								}

							}
						}
						//开始与结束之间增加线
						for(let k = $('.index-plan tbody tr').eq(i).children('.start-state').index() - 2; k < $('.index-plan tbody tr').eq(i).children('.end-state').index()-1; k++) {
							if(n.projectStates == '1') {
								$('.index-plan tbody tr').eq(i).children('.state-day').eq(k).addClass('sub-use line').data("classData", n);
							} else if(n.projectStates == '2') {
								$('.index-plan tbody tr').eq(i).children('.state-day').eq(k).addClass('all-use line').data("classData", n);
							} else if(n.projectStates == '3'||n.projectStates == '5') {
								$('.index-plan tbody tr').eq(i).children('.state-day').eq(k).addClass('no-use line').data("classData", n);
							} else if(n.projectStates == '4') {
								$('.index-plan tbody tr').eq(i).children('.state-day').eq(k).addClass('alr-use line').data("classData", n);
							} else if(n.projectStates == '9') {
								$('.index-plan tbody tr').eq(i).children('.state-day').eq(k).addClass('sur-use line').data("classData", n);
							}
						}
					});
					//在院人数
					$.each($('.plan-table thead .state-day'), function(i, n) {
						num = 0;
						for(let j = 0; j < data.data.length; j++) {
							var classData = $('.plan-table tbody tr').eq(j).find("td.state-day").eq(i).data("classData");
							if(classData != undefined) {
								num = num + classData.traineeCount;
							}

						}
						$(n).data('traineeCount', num);
					})
					//hover
					//日子选中状态
					$('.plan-table th.state-day').hover(function() {
						th = this;
						$.each($('.index-plan tbody tr'), function(j, m) {
							$(this).children('.state-day').eq($(th).index() - 2).css('background-color', '#f6f7ff');
						});
					}, function() {
						$.each($('.index-plan tbody tr'), function(j, m) {
							$(this).children('.state-day').eq($(th).index() - 2).css('background', 'none')
						});
					});
					setTimeout($yt_baseElement.hideLoading(), 500);
					if(data.data == '') {
						$('.plan-table tbody').append("<td colspan='30' align='center' style='border:0px;'><div class='no-data' style='width: 280px;margin: 0 auto;'><img src='../../resources/images/common/no-data.png' style='width:200px;padding: 35px 0 20px;'></div></td>")
					};

					$('.plan-table th.state-day').tooltip({
						position: 'bottom',
						content: function() {
							var showBox = '<table class="tip-table">' +
								'<tr><td class="tip-lable">在院人数：</td><td><span style="color:red">' + $(this).data('traineeCount') + '</span>人</td></tr>' +
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
					//提示
					$('.line').tooltip({
						position: 'bottom',
						content: function() {
							var line = $(this).data('classData');
							line.projectType = line.projectType.replace("1", "计划").replace("2", "委托").replace("3", "选学").replace("4", "中组部调训").replace("5", "国资委调训");
							var showBox = '<table class="tip-table" style="max-width:500px">' +
								'<tr><td class="tip-lable" width="80px">班级名称：</td><td>' + line.projectName + '</td></tr>' +
								'<tr><td class="tip-lable" width="80px">项目类型：</td><td>' + line.projectType + '</td></tr>' +
								'<tr><td class="tip-lable" width="80px">开始日期：</td><td>' + line.startDate + '</td></tr>' +
								'<tr><td class="tip-lable" width="80px">结束日期：</td><td>' + line.endDate + '</td></tr>' +
								'<tr><td class="tip-lable" width="80px">项目销售：</td><td>' + line.projectSell + '</td></tr>' +
								'<tr><td class="tip-lable" width="80px">项目主任：</td><td>' + line.projectHead + '</td></tr>' +
								'<tr><td class="tip-lable" width="80px">学员数量：</td><td>' + line.traineeCount + '人</td></tr>' +
								'<tr><td class="tip-lable" width="80px">委托单位：</td><td>' + line.groupName + '</td></tr>' +
								'</table>';
							return showBox;
						},
						onShow: function() {
							var borderState = $(this).tooltip('tip').find(".tooltip-arrow").css("border-top-color") == 'rgba(0, 0, 0, 0)';
							var maTop = ($(this).height()-22)/2*-1 - 5;
							if(!borderState){
								maTop = ($(this).height()-22)/2+5;
							}
							$(this).tooltip('tip').css({
								backgroundColor: '#666',
								borderColor: '#666',
								color: '#fff'
							});
						}
					});
					//
				} else {
					setTimeout($yt_baseElement.hideLoading(), 500);
				}
			}
		});
	}
};
//财务首页
var moneyIndex={
	init:function(){
		var me = this ;
			//echart 图
		$(".moneyIndex #txtDate1").calendar({
		speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
		complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
		readonly: true, // 目标对象是否设为只读，默认：true     
		lowerLimit: "2010/01/01", // 日期下限，默认：NaN(不限制)     
		nowData:true,//默认选中当前时间,默认true  
		dateFmt:"yyyy-MM",  
		callback: function() { // 点击选择日期后的回调函数  
			me.incomeStatistics($('.moneyIndex #txtDate1').val());
		}  
		});		
		//为对账流水
		$(".moneyIndex #txtDate2").calendar({  
		speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
		complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
		readonly: true, // 目标对象是否设为只读，默认：true     
		lowerLimit: "2010/01/01", // 日期下限，默认：NaN(不限制)     
		nowData:true,//默认选中当前时间,默认true  
		dateFmt:"yyyy-MM",  
		callback: function() { // 点击选择日期后的回调函数  
			me.waterNot($('.moneyIndex #txtDate2').val());
		}  
		});	
		me.indexData();
		me.incomeStatistics($('.moneyIndex #txtDate1').val());
		me.waterNot($('.moneyIndex #txtDate2').val());
		var nowmouth = $('.moneyIndex #txtDate2').val();
		$('.mouthbefore').click(function(){
			var mouthArr =  $('.moneyIndex #txtDate2').val().split('-');
			if(mouthArr[1]=='01'){
				mouthArr[1] = '12';
				mouthArr[0] = Number(mouthArr[0])-1;
			}else{
				mouthArr[1] = Number(mouthArr[1])-1;
				if(mouthArr[1]<10){
					mouthArr[1] = '0'+mouthArr[1];
				}
			}
			mouthArr = mouthArr.join('-');
			$('.moneyIndex #txtDate2').val(mouthArr)
			me.waterNot(mouthArr);
		})
		$('.mouthnow').click(function(){
			$('.moneyIndex #txtDate2').val(nowmouth)
			me.waterNot(nowmouth);
		})
		$('.mouthafter').click(function(){
			var mouthArr =  $('.moneyIndex #txtDate2').val().split('-');
			if(mouthArr[1]=='12'){
				mouthArr[1] = '01';
				mouthArr[0] = Number(mouthArr[0])+1;
			}else{
				mouthArr[1] = Number(mouthArr[1])+1;
				if(mouthArr[1]<10){
					mouthArr[1] = '0'+mouthArr[1];
				}
			}
			mouthArr = mouthArr.join('-');
			$('.moneyIndex #txtDate2').val(mouthArr)
			me.waterNot(mouthArr);
		})
	},
	indexData:function(){
		$.ajax({
			type:"post",
			url:$yt_option.base_path + "index/getIndexDataByFinance",
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			async:true,
			data:{},
			success:function(data){
				if(data.flag==0){
					//总体情况
					$('.moneyIndex .index-top-middle').setDatas(data.data.overallSituation);
					//项目未对账
					var reconciliationBody = $('.moneyIndex .reconciliationNot-tbody').empty();
					if(data.data.reconciliationNot.length>0){
						var htmlTr='';
						$.each(data.data.reconciliationNot, function(i,n) {
							if(i<4){
							if(n.projectType==1){
								n.projectTypeVel = '计划'
							}
							else if(n.projectType==2){
								n.projectTypeVel = '委托'
							}
							else if(n.projectType==3){
								n.projectTypeVel = '选学'
							}
							else if(n.projectType==4){
								n.projectTypeVel = '中组部调训'
							}
							else if(n.projectType==5){
								n.projectTypeVel = '国资委调训'
							}
							htmlTr = '<tr>'+
							'<td><a style="color: #384495;" class="projectName">'+n.projectName+'</a></td>'+
							'<td width="50px">'+n.projectTypeVel+'</td>'+
							'<td width="100px">'+n.endDate+'</td>'+
							'<td width="100px">'+n.reconciliationNotTrainee+'</td>'+
							'<td width="150px">'+n.reconciliationNotMoney+'</td>'+
							'</tr>'
							htmlTr = $(htmlTr).data('data',n);
							reconciliationBody.append(htmlTr);
							}
						});
						$('.index-two-reconciliation .projectName').off().click(function(){
							var projectCode = $(this).parents('tr').data('data').projectCode;
							var projectName = encodeURI(encodeURI($(this).parents('tr').data('data').projectName));
							window.location.href='../bank/projectSelection.html?projectCode='+projectCode+'&projectName='+projectName;
						})
					}else{
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="9" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 120px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="width: 120px;padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
							reconciliationBody.append(htmlTr);
					}
					//开票未完成
					var ticketBody = $('.moneyIndex .ticketBody').empty();
					if(data.data.ticketOpeningNot.length>0){
						var ticketHtml='';
						$.each(data.data.ticketOpeningNot, function(i,n) {
							if(i<4){
							if(n.projectType==1){
								n.projectTypeVel = '计划'
							}
							else if(n.projectType==2){
								n.projectTypeVel = '委托'
							}
							else if(n.projectType==3){
								n.projectTypeVel = '选学'
							}
							else if(n.projectType==4){
								n.projectTypeVel = '中组部调训'
							}
							else if(n.projectType==5){
								n.projectTypeVel = '国资委调训'
							}
							ticketHtml = '<tr>'+
							'<td><a style="color: #384495;" class="projectName">'+n.projectName+'</a></td>'+
							'<td width="50px">'+n.projectTypeVel+'</td>'+
							'<td width="100px">'+n.endDate+'</td>'+
							'<td width="100px">'+n.invoiceNot+'</td>'+
							'</tr>';
							ticketHtml = $(ticketHtml).data('data',n);
							ticketBody.append(ticketHtml);
							}
						});
						$('.ticketBody .projectName').off().click(function(){
							var pkId = $(this).parents('tr').data('data').projectId;
							var projectCode = $(this).parents('tr').data('data').projectCode;
							var projectType = $(this).parents('tr').data('data').projectType ;
							window.location.href='../ticketOpen/ticketOpenInfo.html?projectCode='+projectCode+'&pkId='+pkId+'&projectType='+projectType;
						})
					}else{
						ticketHtml = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="9" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 120px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="width: 120px;padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
							ticketBody.append(ticketHtml);
					}
					//近一年报销统计
					var myChart2 = echarts.init(document.getElementById('echartstwo'));
					var reimbursementAmountArr = [];
					var monthDataArr = [];
					$.each(data.data.reimApprovalStatistics,function(i,n){
						monthDataArr.push(n.monthData+'月');
						reimbursementAmountArr.push(n.reimbursementAmount);
					})
						option2 = {
							title: {
								text: '近一年报销统计',
								left:11,
							},
							backgroundColor: '#ffffff',
							xAxis: {
								type: 'category',
								data: monthDataArr
							},
							yAxis: {
								type: 'value',
								nameTextStyle:{
									
								}
							},
							series: [{
								data:reimbursementAmountArr,
								type: 'line',
								itemStyle:{
									borderColor:'#7b74c7'
								},
								lineStyle: {
									color: '#7b74c7'
								}
							}]
						};
						
						
						myChart2.setOption(option2, true);
					$yt_baseElement.hideLoading();
				}else{
					$yt_baseElement.hideLoading(function (){
						$yt_alert_Model.prompt("查询失败");
					});
				}
			},
			error:function(data){
				$yt_baseElement.hideLoading(function (){
					$yt_alert_Model.prompt("网络出现问题,请稍后重试");
				});
			}
		});
	},
	incomeStatistics:function(monthData){
		var me = this;
		$.ajax({
			type:"post",
			url:$yt_option.base_path + "index/getIndexDataByIncomeStatistics",
			async:true,
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			data:{
				monthData:monthData
			},
			success:function(data){
				//收入统计
					var projectNameArr = [];
					//实际收入
					var realIncomeArr = [] ;
					//预计收入
					var expectedIncomeArr = [];
					if(data.data.length>0){
					$.each(data.data,function(i,n){
						projectNameArr.push(n.projectName);
						realIncomeArr.push(n.realIncome);
						expectedIncomeArr.push(n.expectedIncome);
					})}
					var myChart1 ;
					if(data.data.length>7){
						$('#echartsone').replaceWith('<div id="echartsone"></div>');
						$('#echartsone').css('height',383 + ((data.data.length-7)*50)+'px');
						 myChart1 = echarts.init($('#echartsone')[0]);
					}else{
						$('#echartsone').replaceWith('<div id="echartsone"></div>');
						$('#echartsone').css('height','383px');
						 myChart1 = echarts.init($('#echartsone')[0]);
					}
					option1 = {
							title: {
								text: '收入统计',
								left:11,
							},
							backgroundColor: '#ffffff',
							tooltip: {
								trigger: 'axis',
								axisPointer: { // 坐标轴指示器，坐标轴触发有效
									type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
								},
								extraCssText:'max-width:400px;white-space: normal;'
							},
						
							legend: {
								data: ['实际收入', '预计收入'],
								right: '78px',
								itemWidth: 10,
								itemHeight: 10,
								borderRadius: 5,
						
							},
							grid: {
								left: '3%',
								right: '4%',
								bottom: '3%',
								containLabel: true,
							},
							xAxis: {
								type: 'value',
								nameTextStyle: {
									color: '#888888',
								},
							},
							yAxis: {
								type: 'category',
								nameTextStyle: {
									color: '#888888'
								},
								splitLine: {
									show: false
								},
								data: projectNameArr
							},
							series: [{
									name: '实际收入',
									type: 'bar',
									itemStyle: {
										color: '#847ccf',
										barBorderRadius: [0, 5, 5, 0],
						
									},
									label:{
										formatter: function(e){
										 	if(e.value==0){
										 		return e.value='' 
										 	}
										 }
									},
									barWidth: 16,
									z: 10,
									barGap: '-100%',
									data: realIncomeArr
								},
								{
									name: '预计收入',
									type: 'bar',
									itemStyle: {
										color: '#df94e0',
										barBorderRadius: [0, 5, 5, 0],
									},
									z: 1,
									barWidth: 16,
									data: expectedIncomeArr
								}
							]
						};
						me.newline(option1,8,'yAxis');
						myChart1.setOption(option1, true);
				$yt_baseElement.hideLoading();
			},
			error:function(data){
				$yt_baseElement.hideLoading(function (){
					$yt_alert_Model.prompt("网络出现问题,请稍后重试");
				});
			}
		});
	},
	//未对账流水
	waterNot:function(monthData){
		$.ajax({
			type:"post",
			url:$yt_option.base_path + "index/getIndexDataByFlowingWaterNot",
			async:true,
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			data:{
				monthData:monthData
			},
			success:function(data){
				if(data.flag==0){
				//未处理流水
				if(data.data!=null){
					$('.index-two-waste').setDatas(data.data);
					var wasteBody = $('.index-two-waste tbody').empty();
					var wasteHtml= '';
					if(data.data.reconciliationNotDetails.length>0){
					$.each(data.data.reconciliationNotDetails, function(i,n) {
						if(i<10){
						wasteHtml = '<tr>'+
						'<td width="45px">'+(i+1)+'</td>'+
						'<td width="90px">'+n.exchangeHour+'</td>'+
						'<td>'+n.abstractData+'</td>'+
						'<td width="100px">'+n.income+'</td>'+
						'<td width="150px">'+n.otherPartyAccounts+'</td>'+
						'<td width="80px">'+n.otherPartyName+'</td>'+
						'</tr>'
						}
						wasteHtml =$(wasteHtml).data('data',n);
						wasteBody.append(wasteHtml);
					});	
					}else{
						wasteHtml = '<tr style="border:0px;background-color:#fff !important;" >' +
						'<td colspan="9" align="center" style="border:0px;">' +
						'<div class="no-data" style="width: 220px;margin: 0 auto;">' +
						'<img src="../../resources/images/common/no-data.png" alt="" style="width: 220px;padding: 35px 0 20px;">' +
						'</div>' +
						'</td>' +
						'</tr>';
						wasteBody.append(wasteHtml);
					}
				}
				$yt_baseElement.hideLoading();
				}else{
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt("查询失败");
					});
				}
			},
			error:function(data){
				
			}
		});
	},
	//* 参数一：是你的option
	//* 参数二：是多少个字就换行
	//* 参数三：是x轴还是y轴 可选项 'yAxis' OR 'xAxis'
	newline:function (option, number, axis){
    /* 此处注意你的json是数组还是对象 */
    option[axis]['axisLabel']={
        interval: 0,
        formatter: function(params){
        	if(params.length>23){
        		params = params.substring(0,22)+'..';
        	}
            var newParamsName = "";
            var paramsNameNumber = params.length;
            var provideNumber = number;
            var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
            if (paramsNameNumber > provideNumber) {
                for (var p = 0; p < rowNumber; p++) {
                    var tempStr = "";
                    var start = p * provideNumber;
                    var end = start + provideNumber;
                    if (p == rowNumber - 1) {
                        tempStr = params.substring(start, paramsNameNumber);
                    } else {
                        tempStr = params.substring(start, end) + "\n";
                    }
                    newParamsName += tempStr;
                }
            } else {
                newParamsName = params;
            }
            return newParamsName
        }
    }
    return option;
}
}
//项目主任首页
var projectIndex = {
		init:function(){
		var me = this ;
		$("#txtDate-yyyy").calendar({  
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			lowerLimit: "2010/01/01", // 日期下限，默认：NaN(不限制)     
			nowData:true,//默认选中当前时间,默认true  
			dateFmt:"yyyy",  
			callback: function() { // 点击选择日期后的回调函数  
			    me.getIndexDataByYear($("#txtDate-yyyy").val()); 
			}});  
		me.getIndexDataByYear($("#txtDate-yyyy").val());
		me.indexData();
		
	},
	indexData:function(){
		$.ajax({
			type:"post",
			url:$yt_option.base_path + "index/getIndexDataByProjectDirector",
			async:true,
			data:{},
			success:function(data){
				//即将开班
				var forthcomingShiftBody = $('.projectIndex .index-scend tbody').empty();
				var forthcomingShiftHtml = '';
				if(data.flag==0){
					if(data.data.population!=null){
						$('.projectIndex .index-top-middle').setDatas(data.data.population);
					}
					if(data.data.forthcomingShift.length>0){
						$('.willclass').text(data.data.forthcomingShift.length);
							$.each(data.data.forthcomingShift, function(i,n) {
								if(n.projectType==1){
									n.projectTypeVel = '计划'
								}
								else if(n.projectType==2){
									n.projectTypeVel = '委托'
								}
								else if(n.projectType==3){
									n.projectTypeVel = '选学'
								}
								else if(n.projectType==4){
									n.projectTypeVel = '中组部调训'
								}
								else if(n.projectType==5){
									n.projectTypeVel = '国资委调训'
								}
								forthcomingShiftHtml = '<tr>'+
								'<td style="text-align:left"><a style="color: #384495;" class="projectName">'+n.projectName+'</a></td>'+
								'<td style="text-align:center" width="60px">'+n.projectTypeVel+'</td>'+
								'<td style="text-align:center" width="90px">'+n.startDate+'</td>'+
								'<td style="text-align:right" width="100px">'+n.traineeCount+'</td>'+
								'<td style="text-align:right" width="110px">'+n.teacherArrange+'</td>'+
								'<td style="text-align:right" width="90px">'+n.courseArrange+'</td>'+
								'<td style="text-align:center" width="90px">'+n.traineeGroupNum+'</td>'+
								'<td style="text-align:center" width="90px">'+n.traineeHandbook+'</td>'+
								'<td style="text-align:center" width="90px">'+n.classHonors+'</td>'+
								'</tr>'
								forthcomingShiftHtml = $(forthcomingShiftHtml).data('data',n);
								forthcomingShiftBody.append(forthcomingShiftHtml);
							});
						}else{
							forthcomingShiftHtml = '<tr style="border:0px;background-color:#fff !important;" >' +
								'<td colspan="9" align="center" style="border:0px;">' +
								'<div class="no-data" style="width: 220px;margin: 0 auto;">' +
								'<img src="../../resources/images/common/no-data.png" alt="" style="width: 220px;padding: 35px 0 20px;">' +
								'</div>' +
								'</td>' +
								'</tr>';
								forthcomingShiftBody.append(forthcomingShiftHtml);
						}
						//未完成班级
						var noFinishedBody = $('.projectIndex .index-nocome tbody').empty();
						var noFinishedHtml = '';
						if(data.data.projectNoFinished.length>0){
							console.log(data.data.projectNoFinished);
							$.each(data.data.projectNoFinished, function(i,n) {
								if(n.projectType==1){
									n.projectTypeVel = '计划'
								}
								else if(n.projectType==2){
									n.projectTypeVel = '委托'
								}
								else if(n.projectType==3){
									n.projectTypeVel = '选学'
								}
								else if(n.projectType==4){
									n.projectTypeVel = '中组部调训'
								}
								else if(n.projectType==5){
									n.projectTypeVel = '国资委调训'
								}
								noFinishedHtml = '<tr>'+
								'<td style="text-align:left"><a style="color: #384495;" class="projectName">'+n.projectName+'</a></td>'+
								'<td style="text-align:center" width="60px">'+n.projectTypeVel+'</td>'+
								'<td style="text-align:center" width="90px">'+n.endDate+'</td>'+
								'<td style="text-align:center" width="100px">'+n.teacherReimbursement+'</td>'+
								'<td style="text-align:center" width="110px">'+n.teacherBusiness+'</td>'+
								'<td style="text-align:center" width="90px">'+n.traineeReconciliation+'</td>'+
								'<td style="text-align:center" width="90px">'+n.trainee+'</td>'+
								'<td style="text-align:center" width="90px">'+n.projectArchiving+'</td>'+
								'</tr>'
								noFinishedHtml = $(noFinishedHtml).data('data',n);
								noFinishedBody.append(noFinishedHtml);
							});
						}else{
							noFinishedHtml = '<tr style="border:0px;background-color:#fff !important;" >' +
								'<td colspan="9" align="center" style="border:0px;">' +
								'<div class="no-data" style="width: 220px;margin: 0 auto;">' +
								'<img src="../../resources/images/common/no-data.png" alt="" style="width: 220px;padding: 35px 0 20px;">' +
								'</div>' +
								'</td>' +
								'</tr>';
								noFinishedBody.append(noFinishedHtml);
						}
						//当前班级
						if(data.data.projectNow.length>0){
							var tabBox = $('.projectIndex .tab-title-box').empty();
							var tabHtml = '';
							var classData=[
							{
								value:'',
								name:'未报到'
							},{
								value:'',
								name:'已报到'
							}];
							$.each(data.data.projectNow,function(i,n){
								if(n.projectType==1){
									n.projectTypeVel = '计划'
								}
								else if(n.projectType==2){
									n.projectTypeVel = '委托'
								}
								else if(n.projectType==3){
									n.projectTypeVel = '选学'
								}
								else if(n.projectType==4){
									n.projectTypeVel = '中组部调训'
								}
								else if(n.projectType==5){
									n.projectTypeVel = '国资委调训'
								}
								tabHtml = '<button class="yt-option-btn class-info-btn">• '+n.projectName+'</button>';
								tabHtml = $(tabHtml).data('data',n);
								tabBox.append(tabHtml);
							})
							$('.projectIndex .tab-title-box').css('width',data.data.projectNow.length*120+'px');
							$('.projectIndex .tab-title-box .yt-option-btn').eq(0).addClass('active');
							$('.projectIndex .class-info').setDatas($('.projectIndex .tab-title-box .yt-option-btn').eq(0).data('data'));
							classData[0].value=$('.projectIndex .tab-title-box .yt-option-btn').eq(0).data('data').traineeNoReportCount;
							classData[1].value=$('.projectIndex .tab-title-box .yt-option-btn').eq(0).data('data').traineeReportCount;
						}
							$('.projectIndex .tab-title-box .yt-option-btn').click(function(){
								$(this).addClass("active").siblings().removeClass("active");
								$('.projectIndex .class-info').setDatas($(this).data('data'));
								classData[0].value=$(this).data('data').traineeNoReportCount;
								classData[1].value=$(this).data('data').traineeReportCount;
								myChartthree.setOption(options, true);
							})
							///tab标签切换
							$('.tab-title-list').on('click',".more-tab-btn-end",function(){
								var leftVal = parseInt($(".tab-title-box").css("margin-left")) - 120;
								if($(".tab-title-box").parent().width() > ($(".tab-title-box button").last().position().left - 120)) {
									$(".more-tab-btn-end").hide();
									leftVal = (120 * $(".tab-title-box button").length - $(".tab-title-box").parent().width() + 32) * -1;
								}
								$(".tab-title-box").css("padding-left", "32px").stop(true, true).animate({
									"margin-left": leftVal
								}, 100);
								$(".more-tab-btn-start").show();
							});
							$('.tab-title-list').on('click',".more-tab-btn-start",function(){
								var leftVal = parseInt($(".tab-title-box").css("margin-left")) + 120;
								if(leftVal >= -120) {
									$(this).hide();
									leftVal = 0;
									$(".tab-title-box").css("padding-left", "0");
								}
								$(".tab-title-box").stop(true, true).animate({
									"margin-left": leftVal
								}, 100);
								$(".more-tab-btn-end").show();
							});
							if($(".tab-title-box").width() > ($(".tab-title-box button").last().position().left - 120)) {
									$(".more-tab-btn-end").off();
									$(".more-tab-btn-end").hide();
							}
							var myChartthree = echarts.init($('.drawsclass')[0]);
							var options = {
							    tooltip : {
							        trigger: 'item',
							        formatter: "{a} <br/>{b} : {c} ({d}%)"
							    },
							    legend: {
							        orient: 'vertical',
							        right:'20%',
							        data:classData,
							        formatter:  function(name){
							        	var total = 0;
									    var target;
									    if(classData!=undefined){
									   	 	for (var i = 0, l = classData.length; i < l; i++) {
										    total += classData[i].value;
										    if (classData[i].name == name) {
										        target = classData[i].value;
										        }
										    }
									    	total==0?total=1:total=total;
									   		return name + ' ' + target + '(' + ((target/total)*100).toFixed(2) + '%)';	
									    }
									}
							    },
							    color:['#847ccf', '#df94e0', '#b8b3e2', '#f59700', '#6776ea', '#394b59', '#c554ff', '#30323d'],
							    series : [
							        {
							            name: '学员人数',
							            type: 'pie',
							            radius : ['70%','45%'],
							            center: ['50%', '60%'],
							            data:classData,
							            label: {
							                normal: {
							                    show: false,
							                    position: 'center'
							                }
						               	},
							            itemStyle: {
							                emphasis: {
							                    shadowBlur: 10,
							                    shadowOffsetX: 0,
							                    shadowColor: 'rgba(0, 0, 0, 0.5)'
							                }
							            }
							        }
							    ]
							};
						myChartthree.setOption(options, true);
					}else{
						forthcomingShiftHtml='<tr>'+
										      '<td colspan="10" align="center" style="border:0px;">'+
												'<div class="no-data" style="width: 280px;margin: 0 auto;">'+
													'<img src="../../resources/images/common/no-data.png" alt="" style="width:200px;padding: 35px 0 20px;">'+
												'</div>'+
												'</td>'+
												'</tr>';
						forthcomingShiftBody.append(forthcomingShiftHtml);
				}
			},
			error:function(data){
				
			}
		});
	},
	//质量排行
	getIndexDataByYear:function(years){
		var me = this;
		$.ajax({
			type:"post",
			url:$yt_option.base_path + "index/getIndexDataByProjectDirectorByYear",
			async:true,
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			data:{
				years:years
			},
			success:function(data){
					//班级名称
					var projectNameArr = [];
					//平均分
					var projectAverageArr = [] ;
					if(data.data.length>0){
					$.each(data.data,function(i,n){
						projectNameArr.push(n.projectName);
						projectAverageArr.push(n.projectAverage);
					})}
					var myChart1 ;
					if(data.data.length>7){
						$('#echartsthree').replaceWith('<div id="echartsthree"></div>');
						$('#echartsthree').css('height',383 + ((data.data.length-7)*50)+'px');
						 myChart1 = echarts.init($('#echartsthree')[0]);
					}else{
						$('#echartsthree').replaceWith('<div id="echartsthree"></div>');
						$('#echartsthree').css('height','383px');
						 myChart1 = echarts.init($('#echartsthree')[0]);
					}
					option1 = {
							title: {
								text: '年度带班质量排行',
								left:11,
							},
							backgroundColor: '#ffffff',
							tooltip: {
								trigger: 'axis',
								axisPointer: { // 坐标轴指示器，坐标轴触发有效
									type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
								},
								extraCssText:'max-width:400px;white-space: normal;'
							},
//						
//							legend: {
//								data: ['实际收入'],
//								right: '78px',
//								itemWidth: 10,
//								itemHeight: 10,
//								borderRadius: 5,
//						
//							},
							grid: {
								left: '3%',
								right: '4%',
								bottom: '3%',
								containLabel: true,
							},
							xAxis: {
								type: 'value',
								nameTextStyle: {
									color: '#888888',
								},
								position:'top'
							},
							yAxis: {
								type: 'category',
								nameTextStyle: {
									color: '#888888'
								},
								splitLine: {
									show: false
								},
								axisLabel:{},
								data: projectNameArr
							},
							series: [{
									name: '实际收入',
									type: 'bar',
									itemStyle: {
										color: '#847ccf',
										barBorderRadius: [0, 5, 5, 0],
									},
									label:{
										formatter: function(e){
										 	if(e.value==0){
										 		return e.value='' 
										 	}
										 }
									},
									barWidth: 16,
									z: 10,
									barGap: '-100%',
									data: projectAverageArr
								}
							]
						};
						me.newline(option1,8,'yAxis');
						myChart1.setOption(option1, true);
				$yt_baseElement.hideLoading();
			},
			error:function(data){
				$yt_baseElement.hideLoading(function (){
					$yt_alert_Model.prompt("网络出现问题,请稍后重试");
				});
			}
		});
	},
	//* 参数一：是你的option
	//* 参数二：是多少个字就换行
	//* 参数三：是x轴还是y轴 可选项 'yAxis' OR 'xAxis'
	newline:function (option, number, axis){
    /* 此处注意你的json是数组还是对象 */
    option[axis]['axisLabel']={
        interval: 0,
        formatter: function(params){
        	if(params.length>23){
        		params = params.substring(0,22)+'..';
        	}
            var newParamsName = "";
            var paramsNameNumber = params.length;
            var provideNumber = number;
            var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
            if (paramsNameNumber > provideNumber) {
                for (var p = 0; p < rowNumber; p++) {
                    var tempStr = "";
                    var start = p * provideNumber;
                    var end = start + provideNumber;
                    if (p == rowNumber - 1) {
                        tempStr = params.substring(start, paramsNameNumber);
                    } else {
                        tempStr = params.substring(start, end) + "\n";
                    }
                    newParamsName += tempStr;
                }
            } else {
                newParamsName = params;
            }
            return params
        }
    }
    return option;
}
}
function dateinit() {
	$("#txtDate").calendar({
		speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
		complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
		readonly: true, // 目标对象是否设为只读，默认：true     
		lowerLimit: "2010/01/01", // 日期下限，默认：NaN(不限制)     
		nowData: true, //默认选中当前时间,默认true  
		dateFmt: "yyyy-MM",
		callback: function() { // 点击选择日期后的回调函数  
			//        alert("您选择的日期是：" + $("#txtDate").val());  
			setDayList(new Date($("#txtDate").val()));
			index.classplan();
		}
	});
}
$(document).ready(function() {
	//班次计划月份选择
	$(".plan-table caption div.right span").click(function() {
		var currentData = $("#txtDate").val();
		if($(this).index() == 0) {
			currentData = getPreMonth(currentData);
		} else if($(this).index() == 1) {
			currentData = new Date();
			var y = new Date().getFullYear(); //年
			var m = new Date().getMonth() + 1; //月
			var day = new Date().getDate(); //日
			currentData = y + "-" + (m < 10 ? "0" + m : m);
		} else {
			currentData = getNextMonth(currentData);
		}
		//初始化数据

		$("#txtDate").val(currentData);
		setDayList(new Date($("#txtDate").val()));
		index.classplan();
	});
	index.init();
	//判断当前登录人
	//	124项目销售
	//	125项目主任
	//	126班主任
	//	127项目助理
	//	128财务
	//129教务负责人
	$.ajax({
		type:"post",
		url:$yt_option.base_path +"uniform/user/getUsersDetails",
		async:true,
		data:{},
		success:function(data){
			var roleIds = ','+String(data.data.roleIds)+',';
			if(roleIds.indexOf(',124,')!=-1||roleIds.indexOf(',129,')!=-1){
				$('.educationIndexshow').show()
			}
			if(roleIds.indexOf(',125,')!=-1){
				projectIndex.init();
				$('.projectIndex').show();
			}
			if(roleIds.indexOf(',126,')!=-1){
				
			}
			if(roleIds.indexOf(',127,')!=-1){
				
			}
			if(roleIds.indexOf(',128,')!=-1){
				moneyIndex.init();
				$('.moneyIndex').show();
			}		
		}
	});
});
function setDayList(currentDate) {
	//获取时间
	//var currentDate = new Date();
	currentDate.setDate(1);
	var year = currentDate.getFullYear();

	var month = currentDate.getMonth() + 1;
	var d = new Date(year, month, 0);
	$(".occupy-list .state-day").remove();
	var y, m, day, th;
	for(var i = 0; i < d.getDate(); i++) {

		if(i > 0) {
			currentDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
		}
		y = currentDate.getFullYear(); //年
		m = currentDate.getMonth() + 1; //月
		day = currentDate.getDate(); //日
		currentdayStr = y + "-" + (m < 10 ? "0" + m : m) + "-" + (day < 10 ? "0" + day : day);
		th = $('<th class="state-day" currentday="' + currentdayStr + '"><div>' + currentDate.getDate() + '</div></th>');
		if(currentDate.getDay() == 0) {
			th.addClass("sun");
		} else if(currentDate.getDay() == 6) {
			th.addClass("sat");
		}
		$(".occupy-list tr").append(th);
	}
}
/**
 * 获取上一个月
 *
 * @date 格式为yyyy-mm-dd的日期，如：2014-01-25
 */
function getPreMonth(date) {
	var arr = date.split('-');
	var year = arr[0]; //获取当前日期的年份
	var month = arr[1]; //获取当前日期的月份
	var day = arr[2]; //获取当前日期的日
	var days = new Date(year, month, 0);
	days = days.getDate(); //获取当前日期中月的天数
	var year2 = year;
	var month2 = parseInt(month) - 1;
	if(month2 == 0) {
		year2 = parseInt(year2) - 1;
		month2 = 12;
	}
	var day2 = day;
	var days2 = new Date(year2, month2, 0);
	days2 = days2.getDate();
	if(day2 > days2) {
		day2 = days2;
	}
	if(month2 < 10) {
		month2 = '0' + month2;
	}
	var t2 = year2 + '-' + month2;
	return t2;
}

/**
 * 获取下一个月
 *
 * @date 格式为yyyy-mm-dd的日期，如：2014-01-25
 */
function getNextMonth(date) {
	var arr = date.split('-');
	var year = arr[0]; //获取当前日期的年份
	var month = arr[1]; //获取当前日期的月份
	var day = arr[2]; //获取当前日期的日
	var days = new Date(year, month, 0);
	days = days.getDate(); //获取当前日期中的月的天数
	var year2 = year;
	var month2 = parseInt(month) + 1;
	if(month2 == 13) {
		year2 = parseInt(year2) + 1;
		month2 = 1;
	}
	var day2 = day;
	var days2 = new Date(year2, month2, 0);
	days2 = days2.getDate();
	if(day2 > days2) {
		day2 = days2;
	}
	if(month2 < 10) {
		month2 = '0' + month2;
	}

	var t2 = year2 + '-' + month2;
	return t2;
}