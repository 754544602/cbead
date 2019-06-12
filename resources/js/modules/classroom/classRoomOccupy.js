var classRoomOccupy = {
	init:function (){
		var me = this;
		//初始化日期控件
		$("#txtDate").calendar({  
		    speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
		    complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
		    readonly: true, // 目标对象是否设为只读，默认：true     
		    nowData:true,//默认选中当前时间,默认true  
		    dateFmt:"yyyy-MM",  
		    callback: function() { // 点击选择日期后的回调函数  
		        //alert("您选择的日期是：" + $("#txtDate").val());  
	        	me.setDayList(new Date($("#txtDate").val()));
				me.getClassRooms($("#txtDate").val());
		    }  
		});  
		
		//月份选择
		$(".mouth-check span").click(function (){
			var currentData = $("#txtDate").val();
			if($(this).index() == 0){
				currentData = getPreMonth(currentData);
			}else if($(this).index() == 1){
				currentData = new Date();
			  	var y = new Date().getFullYear(); //年
			    var m = new Date().getMonth() + 1; //月
			    var day = new Date().getDate(); //日
			    currentData = y + "-" + (m<10?"0"+m:m);
			}else{
				currentData = getNextMonth(currentData);
			}
			//初始化数据
			me.setDayList(new Date(currentData));
			me.getClassRooms(currentData);
			$("#txtDate").val(currentData);
			
		});
		
		//初始化数据
		me.setDayList(new Date($("#txtDate").val()));
		me.getClassRooms($("#txtDate").val());
		//模糊查询
		$(".search-btn").on("click",function(){
			me.getClassRooms($("#txtDate").val());	
		})
		
		
	},setDayList:function (currentDate){
		//获取时间
		//var currentDate = new Date();
	    currentDate.setDate(1);
	    var year = currentDate.getFullYear();
	    var month = currentDate.getMonth()+1;
	    var d = new Date(year, month, 0);
	    $(".occupy-list .state-day").remove();
	    var y,m,day,th;
	    for(var i = 0; i < d.getDate();i++){
	    	
	    	if(i>0){
	    		currentDate = new Date(currentDate.getTime() + 24*60*60*1000);
	    	}
		    y = currentDate.getFullYear(); //年
		    m = currentDate.getMonth() + 1; //月
		    day = currentDate.getDate(); //日
		    currentdayStr = y + "-" + (m<10?"0"+m:m) + "-" + (day<10?"0"+day:day);
		    th = $('<th class="state-day" currentday="'+currentdayStr+'"><div>'+currentDate.getDate()+'</div></th>');
		    if(currentDate.getDay() == 0){
		    	th.addClass("sun-head");
		    }else if(currentDate.getDay() == 6){
		    	th.addClass("sat-head");
		    }
	    	$(".occupy-list thead tr").append(th);
	    }
	},getClassRooms:function (monthData){
		var me = this;
		var classroomName = $("#keyword").val();
		//查询教室数据
		$('.page-info').pageInfo({
			async:true,
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url:$yt_option.base_path + "classroom/getClassRooms", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data:{monthData:monthData,classroomName:classroomName}, //ajax查询访问参数
			before:function(){
				$yt_baseElement.showLoading();
			},
			objName: 'data', //指获取数据的对象名称  
			isSelPageNum: true, //是否显示选择条数列表默认false  
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.occupy-list tbody').empty();
					var htmlTr = '';
					var num = 1;
					if(data.data.rows != null) {
						$('.page-info').show();
						$(htmlTbody).empty();
						$('.classRoomSelect').html('<option value="">请选择</option>');
						$.each(data.data.rows, function(i, v) {
							$('.classRoomSelect').append('<option value="'+v.pkId+'" type="'+v.types+'">'+v.classroomName+'</option>');
							htmlTr = '<tr><td rowspan="3" class="room-name"><span>'+v.classroomName+'</span></td><td class="tc">上午</td></tr>'+
							'<tr><td class="tc">下午</td></tr>'+
							'<tr><td class="tc">晚上</td></tr>';
							htmlTr = $(htmlTr).data("roomInfo", v);
							for (var j=0;j<$(".occupy-list thead .state-day").length;j++) {
								htmlTr.append('<td class="state-day"></td>');
							}
							htmlTbody.append(htmlTr);
							$.each(v.classroomStates, function(j, m) {
								arrIndex = $("th[currentday='"+m.classroomDate+"']").index() - 2;
								stateObj = htmlTr.eq(parseInt(m.dataType) - 1).find(".state-day").eq(arrIndex).data("arrIndex", arrIndex);
								if(stateObj.data("classroomStates")){
									var dataArr = stateObj.data("classroomStates");
									dataArr.push(m);
									stateObj.addClass('base-use');
									stateObj.addClass(m.classroomStates == 0 ? "all-use" : "sub-use").data("classroomStates",dataArr).data("data",v);
								}else{
									stateObj.addClass(m.classroomStates == 0 ? "all-use" : "sub-use").data("classroomStates",[m]).data("data",v);
								}
							});
						});
						$('.classRoomSelect').niceSelect();
						$(".occupy-list tbody .state-day").each(function(i, n) {
							if($(n).hasClass("all-use") || $(n).hasClass("sub-use")) {
								if(i % $(".occupy-list thead .state-day").length == 0) {
									$(n).addClass("start-state");
								} else if((i + 1) % $(".occupy-list thead .state-day").length == 0) {
									$(n).addClass("end-state");
								} else {
									var lastDay = $(".occupy-list tbody .state-day").eq(i - 1);
									var nextDay = $(".occupy-list tbody .state-day").eq(i + 1);
									if(!lastDay.hasClass("all-use") && !lastDay.hasClass("sub-use")) {
										$(n).addClass("start-state");
									}
									if(!nextDay.hasClass("all-use") && !nextDay.hasClass("sub-use")) {
										$(n).addClass("end-state");
									}
								}
							}
						});
						
						$('.room-name span').tooltip({
							position: 'right',
							content: function() {
								var roomInfo = $(this).parent().parent().data("roomInfo");
								roomInfo.infrastructure = roomInfo.infrastructure.replace("1", "白板").replace("2", "投影").replace("3", "扩音器").replace("4", roomInfo.infrastructureOther);
								var showBox = '<table class="tip-table">' +
									'<tr><td class="tip-lable">教室序号：</td><td>'+roomInfo.classroomNum+'</td></tr>' +
									'<tr><td class="tip-lable">类型：</td><td>' + roomInfo.types + '</td></tr>' +
									'<tr><td class="tip-lable">可容纳人数：</td><td>' + roomInfo.galleryful + '人</td></tr>' +
									'<tr><td class="tip-lable">基础设施：</td><td>' + roomInfo.infrastructure + '</td></tr>' +
									'<tr><td class="tip-lable">备注：</td><td>' + roomInfo.remarks + '</td></tr>' +
									'</table>';
								return showBox;
							},
							onShow: function() {
								$(this).tooltip('tip').css({
									backgroundColor: '#666',
									borderColor: '#666'
								});
							}
						});
						
						$('.occupy-list tbody .sub-use,.occupy-list tbody .all-use').tooltip({
							position: 'bottom',
							content: function() {
								var classroomStates = $(this).data("classroomStates");
								var showBox = '';
								$.each(classroomStates, function(i,n) {
									showBox += '<div class="tip-box" style="width:300px"><table class="tip-table">' +
										'<tr><td class="tip-lable" style="width:72px">使用时间：</td><td>'+(n.classroomDate+' '+n.startTime +'-'+ n.endTime)+'</td></tr>' +
										'<tr><td class="tip-lable">项目编号：</td><td>'+n.projectCode+'</td></tr>' +
										'<tr><td class="tip-lable">项目名称：</td><td>'+n.projectName+'</td></tr>' +
										'<tr><td class="tip-lable">项目类型：</td><td>'+(classRoomOccupy.projectTypeInfo(n.projectType))+'</td></tr>' +
										'<tr><td class="tip-lable">项目主任：</td><td>'+n.projectHead+'</td></tr>' +
										'<tr><td class="tip-lable">学员人数：</td><td>'+n.traineeCount+'人</td></tr>' +
										'</table></div>';	
								});
								return showBox;
							},
							onShow: function() {
								$(this).tooltip('tip').css({
									backgroundColor: '#666',
									borderColor: '#666'
								});
							}
						});
						$('.tooltip-f').off('click').on('click',function(){
							var data = $(this).data('classroomStates');
							var alldata =  $(this).data('data');
							/** 
							 * 显示编辑弹出框和显示顶部隐藏蒙层 
							 */
							$(".classRoomAlert").show();
							/** 
							 * 调用算取div显示位置方法 
							 */
							$yt_alert_Model.setFiexBoxHeight($(".classRoomAlert .yt-edit-alert-main"));
							$yt_alert_Model.getDivPosition($(".classRoomAlert"));
							/* 
							 * 调用支持拖拽的方法 
							 */
							$yt_model_drag.modelDragEvent($(".classRoomAlert .yt-edit-alert-title"));
							/** 
							 * 点击取消方法 
							 */
							$('.classRoomAlert .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
								//隐藏页面中自定义的表单内容  
								$(".classRoomAlert").hide();
								$('.page-info').pageInfo('refresh');
							});
							$('input[type=radio][name=classRoom]').off('change').change(function(){
								if($(this).val()==2){
									$('.noSubmit').hide();
								}else{
									$('.noSubmit').show();
								}
							})
							$('.tab-title-box').empty();
							$.each(data,function(i,n){
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
									n.projectTypeVel = '调训'
								}else{
									n.projectTypeVel = ''
								}
								tabHtml = '<button class="yt-option-btn ">• '+n.createUser+'</button>';
								tabHtml = $(tabHtml).data('data',n);
								$('.tab-title-box').append(tabHtml);
							})
							$('.classRoomName').text(alldata.classroomName);
							$('.tab-title-box').css('width',data.length*120+'px');
							$('.tab-title-box .yt-option-btn').eq(0).addClass('active');
							$('.classRoomTable').setDatas($('.tab-title-box .yt-option-btn').eq(0).data('data'));
							$('.tab-title-box .yt-option-btn').off().on('click',function(){
								$(this).addClass("active").siblings().removeClass("active");
								$('.classRoomTable').setDatas($(this).data('data'));
								return false;
							})
							///tab标签切换
							$('.more-tab-btn-end').off().on('click',function(){
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
							if($(".tab-title-list").width() > ($(".tab-title-box button").last().position().left + 120)) {
									$(".more-tab-btn-end").off();
									$(".more-tab-btn-end").hide();
							}else{
								$(".more-tab-btn-end").show();
							}
							$('.noSubmit').off().click(function(){
								var classData = $('.tab-title-box .yt-option-btn.active').data('data');
								message ='您预约的'+classData.projectName+'的'+classData.courseName+'的'+alldata.classroomName+'已被拒绝使用，请重新申请。';
								classRoomOccupy.updataClassRoom(1,classData,'',message);
							})
							$('.submit').off().click(function(){
								if($('input[type=radio][name=classRoom]:checked').val()==1){
									$yt_alert_Model.prompt('操作成功');
									$('.classRoomAlert').hide();
									$('.page-info').pageInfo('refresh');
									return false;
								}
								if($('input[type=radio][name=classRoom]:checked').val()==2&&$('.classRoomSelect').val()==''){
									$yt_alert_Model.prompt('请选择教室');
									return false;
								}
								var classData = $('.tab-title-box .yt-option-btn.active').data('data');
								message ='您预约的'+classData.projectName+'的'+classData.courseName+'的'+alldata.classroomName+'已被调换为'+$('.classRoomSelect option:checked').text()+'。';
								classRoomOccupy.updataClassRoom(2,classData,$('.classRoomSelect').val(),message);
							});
						})
					}else{
						$('.page-info').hide();
					}
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}
			} //回调函数 匿名函数返回查询结果  
		});
		
	},
	updataClassRoom:function(type,classData,classroomId,message){
		$.ajax({
			type:"post",
			url:$yt_option.base_path+"classroom/updateYesOrOnClassroom",
			async:true,
			data:{
				type:type,
				courseClassromId:classData.courseClassromId,
				classroomId:classroomId,
				message:message,
				occupyType:classData.occupyType
			},
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			success:function(data){
				if(data.flag==0){
					if(type==1){
						$yt_alert_Model.prompt('你已拒绝该教室使用申请')
					}else if(type==2){
						$yt_alert_Model.prompt('调换成功')
					}
					$(".classRoomAlert").hide();
					$('.page-info').pageInfo('refresh');
				}else{
					$yt_alert_Model.prompt('操作失败')
				}
				$yt_baseElement.hideLoading();
			},
			error:function(){
				$yt_baseElement.hideLoading(function(){
					$yt_alert_Model.prompt('网络异常，操作失败')
				});
			}
		});
	},
	//项目类型设置
	projectTypeInfo: function(code) {
		if(code == 1) {
			return "计划";
		} else if(code == 2) {
			return "委托";
		} else if(code == 3) {
			return "选学";
		} else if(code == 4) {
			return"中组部调训";
		} else if(code == 5) {
			return"国资委调训";
		}else {
			return '';
		};
	}
}
$(function (){
	//初始化方法
	classRoomOccupy.init();
})

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
    if (month2 == 0) {
        year2 = parseInt(year2) - 1;
        month2 = 12;
    }
    var day2 = day;
    var days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {
        day2 = days2;
    }
    if (month2 < 10) {
        month2 = '0' + month2;
    }
    var t2 = year2 + '-' + month2 ;
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
    if (month2 == 13) {
        year2 = parseInt(year2) + 1;
        month2 = 1;
    }
    var day2 = day;
    var days2 = new Date(year2, month2, 0);
    days2 = days2.getDate();
    if (day2 > days2) {
        day2 = days2;
    }
    if (month2 < 10) {
        month2 = '0' + month2;
    }

    var t2 = year2 + '-' + month2 ;
    return t2;
}