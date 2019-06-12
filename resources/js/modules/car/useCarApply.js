var carList = {
	//初始化方法
	init: function() {
		//初始化表头时间框
		$("#carDate").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			lowerLimit: "2010/01/01", // 日期下限，默认：NaN(不限制)     
			nowData: true, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd",
			callback: function() {
				//选择日期调用列表
				carList.getPlanListInfo();
			}
		});

		//获取列表数据
		carList.getPlanListInfo();
		//点击导出
		$('.disableList').off('click').on('click', function() {
			carList.sendMeetListexport();
		});
		$('.submit-form').off('click').on('click', function() {
			carList.submitData();
		});
	},

	//初始化出发时间
	listTimeInput: function() {
		$(".out-list-time-input").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			lowerLimit: "2010/01/01", // 日期下限，默认：NaN(不限制)     
			nowData: true, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd HH:mm",
			callback: function() {}
		});
	},

	//	//获取司机下拉列表
//	driverNameLis: function(select) {
//		$.ajax({
//			type: "post",
//			url: $yt_option.base_path + "uniform/user/getUsers",
//			data: {
//				compId: "81",
//			},
//			async: false,
//			success: function(data) {
//				$.each(data.data, function(i, d) {
//					if(d.type == 3) {
//						$(select).append('<option value="' + d.id + '">' + d.text + '</option>');
//					}
//				});
//			}
//		});
//	},
	//	//获取车辆下拉列表
//	carNameLis: function(select) {
//		$.ajax({
//			type: "post",
//			url: $yt_option.base_path + "uniform/getCars",
//			data: {
//				searchParameters: "",
//			},
//			async: false,
//			success: function(data) {
//				$.each(data.data, function(i, c) {
//					if(c.carStates == 1) {
//						$(select).append('<option>' + c.carNum + '</option>');
//					}
//				});
//			}
//		});
//	},
	/**
	 * 获取用车信息列表
	 */
	getPlanListInfo: function() {
		var carDate = $('#carDate').val();
		var carDate = $('#carDate').val();
		//获取返回接口的派车状态
		var sendCarState=[];
		$('.page-info').pageInfo({
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "administrator/car/getCarApprove", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				carDate: carDate
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			async:true,
			before:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.teacher-use-car-list .yt-tbody');
					var htmlTr = '';
					var num = 1;
					var driverName;
					var carName;
					var routeType;
					if(data.data.teacherCar.length > 0) {
						$("#project-main").css("width","1833px");
						$('.class-info1').show();
						$('.repeat-come-div-nodata').remove();
						$('.class-info-bottom').show();
						$(htmlTbody).empty();
						//遍历接送站列表
						$.each(data.data.teacherCar, function(i, v) {
							sendCarState.push(v.sendCarType);
							if(v.routeType == 1) {
								routeType = "接站";
							} else {
								routeType = "送站";
							}
							if(v.remarks == undefined){
								v.remarks = "";
							};
							htmlTr += '<tr class="teacherCar" sendCarType="'+v.sendCarType+'">' +
								'<td class="pk-id" style="text-align:center;display:none;">' + v.pkId + '</td>' +
								'<td class="business-code" style="text-align:center;display:none;">' + v.processInstanceId + '</td>' +
								'<td class="route-type" style="text-align:center;">' + routeType + '</td>' +
								'<td class="teacher-name" style="text-align:left;">' + v.teacherName + '</td>' +
								'<td class="phone" style="text-align:center;">' + v.phone + '</td>' +
								'<td class="flight-train-number" style="text-align:center;">' + v.flightTrainNumber + '</td>' +
								'<td class="date-time" style="text-align:center;">' + v.dateTime + '</td>' +
								'<td class="bourn" style="text-align:left;">' + v.bourn + '</td>';
								if(v.sendCarType==2){
									htmlTr+='<td class="set-out-date" style="text-align:center;">'+v.setOutDate+'</td>'+			
											'<td class="driver-name" style="text-align:center;padding:0px 6px;">'+v.driverName+'</td>'+
											'<td class="car-name" style="text-align:center;padding:0px 6px;">'+v.carName+'</td>';
								}else{
									htmlTr+='<td class="set-out-date" style="text-align:center;">'+
											'<input style="background-position: 130px 7px;width:140px;" class="calendar-input out-list-time-input" value="' + v.setOutDate + '" type="text" />'+
											'</td>' +
											'<td class="driver-name" style="text-align:center;padding:0px 6px;">' +
											'<input style="width:113px;" class="yt-input driver-name-input" value="" type="text" />' +
											'</td>' +
											'<td class="car-name" style="text-align:center;padding:0px 6px;">' +
											'<input style="width:113px;" class="yt-input car-name-input" value="" type="text" />' +
											'</td>';
								}
								htmlTr+='<td class="create-user-string" style="text-align:left;">' + v.createUserString + '</td>' +
										'<td class="create-user-phone" style="text-align:center;">' + v.createUserPhone + '</td>' +
										'<td class="project-code" style="text-align:center;">' + v.projectCode + '</td>' +
										'<td class="project-name" style="text-align:left;">' + v.projectName + '</td>' +
										'<td class="project-name" style="text-align:left;">' + v.remarks + '</td>' +
										'</tr>';
							htmlTr = $(htmlTr);
							htmlTr.data('teacherCar',v);
							htmlTbody.append(htmlTr);
						});
						//初始化时间
						carList.listTimeInput();
					} else {
						if(data.data.courseCar.length > 0) {
							$("#project-main").css("width","1833px");
						}else{
							$("#project-main").css("width","100%");
						}
						
						$(htmlTbody).empty();
						$('.class-info1').hide();
						if($('.class-info1').css('display') == 'none' && $('.class-info2').css('display') == 'none') {
							if($('#project-main').find('.repeat-come-div-nodata')[0] == undefined) {
								$('#project-main').append('<div class="no-data repeat-come-div-nodata" style="width: 280px;margin: 0 auto;"><img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;"></div>')
								$('.class-info-bottom').hide();
							}
						}
					}

					//外出教学列表
					var outHmlTbody = $('.out-list-table .yt-tbody');
					var outHtmlTr = '';
					
					if(data.data.courseCar.length > 0) {
						$("#project-main").css("width","1833px");
						$('.class-info2').show();
						$('.class-info-bottom').show();
						$('.repeat-come-div-nodata').remove();
						$(outHmlTbody).empty();
						var driverName=[];
						var carName=[];
						//遍历现场教学（外出教学）
						$.each(data.data.courseCar, function(i, v) {
							if(v.remarks == undefined){
								v.remarks = "";
							};
							sendCarState.push(v.sendCarType);
							i = i + 1;
							outHtmlTr += '<tr class="courseCar" sendCarType="'+v.sendCarType+'">' +
									'<td class="pkid" style="display:none;">' + v.pkId + '</td>' +
									'<td class="process-instanceId" style="display:none;">' + v.processInstanceId + '</td>' +
									'<td class="types" style="text-align:center;">' + v.types + '</td>' +
									'<td class="user-count" style="text-align:right;">' + v.userCount + '</td>' +
									'<td class="start-time" style="text-align:center;">' +$('#carDate').val() +' '+ v.startTime + '</td>' +
									'<td class="address" style="text-align:left;">' + v.address + '</td>';
									if(v.sendCarType==2){
										$.each(v.drivers, function(a,b) {
											driverName.push(b.driverName);
										});
										$.each(v.cars, function(a,b) {
											carName.push(b.carName);
										});
										v.setOutDate=v.setOutDate.substr(0,16);
										outHtmlTr+='<td class="set-out-date" style="text-align:center;">'+v.setOutDate+'</td>'+ 
													'<td class="drivers" style="text-align:center;">' +driverName.join(',')+'</td>'+ 
													'<td class="cars" style="text-align:center;">' +carName.join(',')+'</td>';
									}else{
										outHtmlTr+='<td class="set-out-date" style="text-align:center;">' +
											'<input class="calendar-input out-list-time-input" value="' + v.setOutDate + '" type="text" />' +
											'</td>' +
											'<td class="drivers" style="text-align:center;">' +
											'<input style="width:113px;" class="yt-input drivers-input" value="" type="text" />' +
											'</td>' +
											'<td class="cars" style="text-align:center;">' +
											'<input style="width:113px;" class="yt-input cars-input"  value="" type="text" />' +
											'</td>';
									}
									outHtmlTr+='<td class="create-uer-string" style="text-align:center;">' + v.createUserString + '</td>' +
												'<td class="create-user-phone" style="text-align:center;">' + v.createUserPhone + '</td>' +
												'<td class="project-code" style="text-align:center;">' + v.projectCode + '</td>' +
												'<td class="project-name" style="text-align:left;">' + v.projectName + '</td>' +
												'<td class="project-name" style="text-align:left;">' + v.remarks + '</td>' +
												'</tr>';
							outHtmlTr=$(outHtmlTr);
							outHtmlTr.data('courseCar',v);
							outHmlTbody.append(outHtmlTr);
						});
						//初始化时间
						carList.listTimeInput();
					} else {
						if(data.data.teacherCar.length > 0) {
							$("#project-main").css("width","1833px");
						}else{
							$("#project-main").css("width","100%");
						}
						$(outHmlTbody).empty();
						$('.class-info2').hide();
						if($('.class-info1').css('display') == 'none' && $('.class-info2').css('display') == 'none') {
							if($('#project-main').find('.repeat-come-div-nodata')[0] == undefined) {
								$('#project-main').append('<div class="no-data repeat-come-div-nodata" style="width: 280px;margin: 0 auto;"><img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;"></div>')
								$('.class-info-bottom').hide();
							}
						}
					}
					sendCarState=sendCarState.join(",");
					if(sendCarState.indexOf(1)!=-1){
						$(".class-info-bottom").show();
					}else{
						$(".class-info-bottom").hide();
					}
					carList.carInputAssData();
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	/**
	 * 车辆输入框联想数据
	 */
	carInputAssData:function(){
		var thisVal;
		$(".car-name-input,.cars-input").parent().css('position','relative');
		var newHtml='<div class="car-input-ass-div" lostBlur=true style="position:absolute;width: 120px;height: auto;overflow: auto;left:6px;display: none;background-color: #FFFFFF;z-index:999;">'+
					'<table style="width:100%;height:100%;">'+
					'<tbody></tbody>'+
					'</table></div>';
		$(".car-name-input,.cars-input").parent().append(newHtml);
		$("#project-main").off('input').on('input','.car-name-input,.cars-input',function(){
			//当前车辆输入框
			thisVal= $(this);
			console.log('thisValsssssssss',thisVal);
			//输入事件
			if(thisVal.val()==""){
				thisVal.parent().find('div.car-input-ass-div').hide();
			}else{
				carList.selectCarInfo(thisVal.val(),thisVal);
//				thisVal.parent().find('div.car-input-ass-div').show();
				//获得焦点事件
				$("#project-main").off('focus').on('focus','.car-name-input,.cars-input',function(e){
					thisVal.parent().find('div.car-input-ass-div').hide();
					thisVal=$(this);
					console.log('thisVal',thisVal.val());
					thisVal.parent().find('div.car-input-ass-div').show();
//								e.stopPropagation();
				});
				//联想框点击事件
				$("#project-main").off('click').on('click','div.car-input-ass-div tbody tr',function(e){
					//$(this).parents('div.car-input-ass-div').attr('lostBlur',false);
					thisVal.val($(this).find('td').text());
					$('div.car-input-ass-div').hide();
				});
				$(document).click(function(e){
					$('div.car-input-ass-div').hide();
				});
				thisVal.click(function(e){
					e.stopPropagation();
				});
				//输入框失去焦点事件
//				thisVal.on('blur',function(){
//					setTimeout(function(){
//						$('div.car-input-ass-div').hide();
//					},100);
//				});
			}
		});
	},
	/**
	 * 查询车辆信息
	 */
	selectCarInfo:function(selectParam,thisVal){
		$.ajax({
			type:"post",
			url:$yt_option.base_path + "administrator/car/lookForAll",
			async:true,
			data:{
				selectParam:selectParam,
				pageIndexs: 1,
				pageNum: 999999
			},
			success:function(data){
				if(data.flag==0){
					var thisDiv=thisVal.parent().find('div.car-input-ass-div tbody');
					thisDiv.empty();
					thisVal.parent().find('div.car-input-ass-div').show();
					var thisHtml='';
					if(data.data.rows.length!=0){
						$.each(data.data.rows, function(i,n) {
						thisHtml+='<tr>'+
								'<td>'+n.carNum+'</td>'+
								'</tr>';
						});
						thisDiv.append(thisHtml);
					}
					//计算当前联想框的高度
					if(data.data.rows.length<3){
						thisVal.parent().find('div.car-input-ass-div').css('height','auto');
					}else{
						thisVal.parent().find('div.car-input-ass-div').css({
							"height":"87px",
							"overflow":"auto"
						});
					}
				}
			}
		});
	},
	sendMeetListexport: function() {
		//接送站用车
		var sendOffMeetStationArrJson = "";
		//外出用车
		var courseCarDetailJson;
		//接送站
		var teacherList = $('.teacher-use-car-list .list-tbody tr');
		var len = $('.teacher-use-car-list .list-tbody tr td').length;
		var routeType;
		//乘车人
		var teacherName;
		//联系方式
		var phone;
		//航班/车次
		var flightTrainNumber;
		//预计到达/起飞时间
		var dateTime;
		//目的地
		var bourn;
		//出发时间
		var setOutDate;
		//司机
		var driverName;
		//车辆
		var carName;
		//用车人
		var createUserString;
		//联系方式
		var createUserPhone;
		//班级编号
		var projectCode;
		//班级名称
		var projectName;
		//定义接站数组
		var meetStationArr = [];
		//if(len >= 2) {
			console.log("teacherList",teacherList.data('teacherCar'));
			$.each(teacherList, function(i, t) {
				
				routeType = $(t).data('teacherCar').routeType;
				teacherName = $(t).data('teacherCar').teacherName;
				phone = $(t).data('teacherCar').phone;
				flightTrainNumber = $(t).data('teacherCar').flightTrainNumber;
				dateTime = $(t).data('teacherCar').dateTime;
				bourn =$(t).data('teacherCar').bourn;
				setOutDate = $(t).data('teacherCar').setOutDate;
				driverName = $(t).data('teacherCar').driverName;
				carName = $(t).data('teacherCar').carName;
				createUserString = $(t).data('teacherCar').createUserString;
				createUserPhone =$(t).data('teacherCar').createUserPhone;
				projectCode = $(t).data('teacherCar').projectCode;
				projectName = $(t).data('teacherCar').projectName;
				var meetStation = {
					routeType:routeType,
					teacherName: teacherName,
					phone: phone,
					flightTrainNumber: flightTrainNumber,
					dateTime: dateTime,
					bourn: bourn,
					setOutDate: setOutDate,
					driverName: driverName,
					carName: carName,
					createUserString: createUserString,
					createUserPhone: createUserPhone,
					projectCode: projectCode,
					projectName: projectName
				}
				meetStationArr.push(meetStation);
			});
			//教室用车teacherCar
			sendOffMeetStationArrJson = JSON.stringify(meetStationArr);
		//}

		//现场教学用车
		var courseCarList = $('.out-list-table .list-tbody tr');
		var len = $('.out-list-table .list-tbody tr td').length;
		//乘车人数
		var outUserCount;
		//上课时间
		var outStartTime;
		//目的地
		var outAddress;
		//出发时间
		var outSetOutDate;
		//司机
		var outDrivers="";
		//车辆
		var outCars="";
		//用车人
		var outCreateUserString;
		//联系方式
		var outCreateUserPhone;
		//班级编号
		var outProjectCode;
		//班级名称
		var outProjectName;
		var courseCarArr = [];
//		if(len >= 2) {
	console.log("courseCarList",courseCarList.data('courseCar'));
			$.each(courseCarList, function(i, c) {
				outUserCount = $(c).data('courseCar').userCount;
				outStartTime = $(c).data('courseCar').startTime;
				outAddress = $(c).data('courseCar').address;
				outSetOutDate = $(c).data('courseCar').setOutDate;
				//判断司机是否有值
				if($(c).data('courseCar').drivers.length!=0){
					$.each($(c).data('courseCar').drivers,function(a,n){
						if(outDrivers==""){
							outDrivers=n.driverName;
						}else{
							outDrivers+="、"+n.driverName;
						}
					});
				}else{
					outDrivers="";
				}
				//判断车辆是否有值
				if($(c).data('courseCar').cars.length!=0){
					$.each($(c).data('courseCar').cars,function(a,v){
						if(outCars==""){
							outCars=v.carName;
						}else{
							outCars+="、"+v.carName;
						}
					});
				}else{
					outCars="";
				}
//				outDrivers = $(c).data('courseCar').drivers;
//				outCars = $(c).data('courseCar').cars;
				outCreateUserString = $(c).data('courseCar').createUserString;
				outCreateUserPhone = $(c).data('courseCar').createUserPhone;
				outProjectCode = $(c).data('courseCar').projectCode;
				outProjectName = $(c).data('courseCar').projectName;
				var courseCar = {
					types:"外出教学",
					userCount: outUserCount,
					startTime: outStartTime,
					address: outAddress,
					setOutDate: outSetOutDate,
					drivers: outDrivers,
					cars: outCars,
					createUserString: outCreateUserString,
					createUserPhone: outCreateUserPhone,
					projectCode: outProjectCode,
					projectName: outProjectName,
				}
				courseCarArr.push(courseCar);
			});
				courseCarDetailJson = JSON.stringify(courseCarArr);
			
//		};
		console.log("sendOffMeetStationArrJson",sendOffMeetStationArrJson);
		console.log("courseCarDetailJson",courseCarDetailJson);
		//导出接口
		var exportDate = $('#carDate').val();
		$.ajaxDownloadFile({
			url: $yt_option.base_path + "administrator/car/exportCars",
			data:{
				teacherCar: sendOffMeetStationArrJson,
				courseCar: courseCarDetailJson,
				fileName: exportDate + "用车申请导出"
			}
		});
	},
	/**
	 * 提交方法
	 */
	submitData: function() {
		$yt_baseElement.showLoading();
		var teacherCarArr = [];
		var courseCarArr = [];
		//声明派车状态数组
		var sendCarState=[];
		$.each($('.teacherCar'), function(i, n) {
			var sendCarType=$(this).attr('sendCarType');
			//判断列表中是否有派车中的数据
			sendCarState.push(sendCarType);
			if(sendCarType==1){
				var json = {
					pkId: '',
					setOutDate: '',
					driverCode: '',
					carId: '',
					processInstanceId: '',
					nextCode: 'completed'
				}
				json.processInstanceId = $(n).find('.business-code').text();
				json.pkId = $(n).find('.pk-id').text();
				json.setOutDate = $(n).find('.out-list-time-input').val();
				$(n).find('.driver-name-input').val() == '' ? json.driverCode = $(n).find('.driver-name-select').val() : json.driverCode = $(n).find('.driver-name-input').val();
				$(n).find('.car-name-input').val() == '' ? json.carId = $(n).find('.car-name-select').val() : json.carId = $(n).find('.car-name-input').val();
				teacherCarArr.push(json);
			}
		});
		$.each($('.courseCar'), function(i, n) {
			var sendCarType=$(this).attr('sendCarType');
			//判断列表中是否有派车中的数据
			sendCarState.push(sendCarType);
			if(sendCarType==1){
				var json = {
					pkId: '',
					setOutDate: '',
					driverCode: '',
					carId: '',
					processInstanceId: '',
					nextCode: 'completed'
				}
				json.processInstanceId = $(n).find('.process-instanceId').text();
				json.pkId = $(n).find('.pkid').text();
				json.setOutDate = $(n).find('.out-list-time-input').val();
				$(n).find('.drivers-input').val() == '' ? json.driverCode = $(n).find('.drivers-select').val() : json.driverCode = $(n).find('.drivers-input').val();
				$(n).find('.cars-input').val() == '' ? json.carId = $(n).find('.cars-select').val() : json.carId = $(n).find('.cars-input').val();
				courseCarArr.push(json);
			}
		});
		teacherCar = JSON.stringify(teacherCarArr);
		courseCar = JSON.stringify(courseCarArr);
		sendCarState=sendCarState.join(",");
		console.log("sendCarState",sendCarState);
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "administrator/car/updateCarApprove",
			async: true,
			data: {
				carDate:$('#carDate').val(),
				teacherCar:teacherCar,
				courseCar:courseCar
			},
			success: function(data) {
				if(data.flag==0){
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt("提交成功");
							carList.getPlanListInfo();
							$('.class-info-bottom').hide();
					});
					if(sendCarState.indexOf(1)!=-1){
						$('.class-info-bottom').show();
					}else{
						$('.class-info-bottom').hide();
					}
				}else{
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt("提交失败");
					});
				}
			},
			error: function(data) {

			}
		});
	}
};
$(function() {
	//初始化方法
	carList.init();
});