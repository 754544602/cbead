var meetingRoom = {
	 mouseState:'up',
    pos:{
    	x:0,
    	y:0
    },
	init:function (){
		var me = this;
		
		$("#query-date").calendar({  
	    	speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
		    complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
		    readonly: true, // 目标对象是否设为只读，默认：true     
		    lowerLimit:"2010/01/01", // 日期下限，默认：NaN(不限制)     
		    nowData:true,//默认选中当前时间,默认true  
		    dateFmt:"yyyy-MM-dd",  
		    callback: function() { // 点击选择日期后的回调函数  
		        //alert("您选择的日期是：" + $("#txtDate").val());  
		        
				//构建甘特图
				me.getRoomsInfo($("#query-date").val());
				me.setDay(new Date($("#query-date").val()));
		        
		    }  
		});  
		me.setDay(new Date());
		//构建甘特图
		me.getRoomsInfo($("#query-date").val());
		
		//上一天
		$(".prev-day").click(function (){
			var currentDay = new Date($("#query-date").val());
			currentDay.setTime(currentDay.getTime()-24*60*60*1000);
			me.setDay(currentDay);
			me.getRoomsInfo($("#query-date").val());
		});
		//下一天
		$(".next-day").click(function (){
			var currentDay = new Date($("#query-date").val());
			currentDay.setTime(currentDay.getTime()+24*60*60*1000);
			me.setDay(currentDay);
			me.getRoomsInfo($("#query-date").val());
		});
		//今天
		$(".current-day").click(function (){
			me.setDay(new Date($("#query-date").val()));
			me.getRoomsInfo($("#query-date").val());
		});
		
		//tab切换
		$(".tab-title-box button").click(function (){
			$(this).addClass("active").siblings().removeClass("active");
			if($(this).index() == 0){
				$(".list-title span").text('会议室占用情况');
			}else if($(this).index() == 1){
				$(".list-title span").text('研讨室占用情况');
			}else if($(this).index() == 2){
				$(".list-title span").text('教室占用情况');
			}
			me.getRoomsInfo($("#query-date").val());
		});
		
		$(".meeting-time").niceSelect();
		$(".appointment").click(function (){
			me.chooseDay(true);
			me.addOrUpdateRoom();
		});
		$(".rooms").change(function (){
			if($(this).val() == ''){
				$(this).next().addClass("valid-hint").next().text("请选择");
			}else{
				$(this).next().removeClass("valid-hint").next().text("");
			}
		});
		
	},addOrUpdateRoom:function (useData){
		var me = this;
		$(".valid-hint").removeClass("valid-hint");
		$(".valid-font").text("");
		$(".create-user-name").text($yt_common.user_info.userRealName);
		if(useData){
			$(".add-appointment-box .yt-edit-alert-main input[name='titles']").val(useData.titles);
			$(".add-appointment-box .yt-edit-alert-main [name='details']").val(useData.details);
			$(".add-appointment-box .yt-edit-alert-main [name='phone']").val(useData.phone);
			$("#txtDate").val(useData.useDate);
			$(".start-h").setSelectVal(useData.startTime.split(' ')[1].split(':')[0]);
			$(".start-m").setSelectVal(useData.startTime.split(' ')[1].split(':')[1]);
			$(".end-h").setSelectVal(useData.endTime.split(' ')[1].split(':')[0]);
			$(".end-m").setSelectVal(useData.endTime.split(' ')[1].split(':')[1]);
		}else{
			$(".add-appointment-box .yt-edit-alert-main input").val('');
			$(".add-appointment-box .yt-edit-alert-main textarea").val('');	
		}
		$("#txtDate").val($("#query-date").val());
		var type = $(".tab-title-box button.active").attr('types');
		me.getRooms(type,$(".add-appointment-box select.rooms"),useData?useData.roomId:"");
		
		
		if($(".select-item").length > 0){
			var startIndex = $(".select-item").first().parent().index();
			var endIndex = $(".select-item").last().parent().index();
			var startTime = $(".meeting-room thead th").eq(startIndex).attr('timeval');
			
			var endTime = '';
			if(endIndex == 25){
				endTime = '24:00';		
			}else{
				endTime = $(".meeting-room thead th").eq(endIndex+1).attr('timeval');
			}
			$("select.start-h").setSelectVal(startTime.split(":")[0]);
			$("select.start-m").setSelectVal(startTime.split(":")[1]);
			$("select.end-h").setSelectVal(endTime.split(":")[0]);
			$("select.end-m").setSelectVal(endTime.split(":")[1]);
			console.log(endTime);
		}
		
			/** 
         * 显示编辑弹出框和显示顶部隐藏蒙层 
         */  
        $(".add-appointment-box").show();  
        /** 
         * 调用算取div显示位置方法 
         */  
        $yt_alert_Model.getDivPosition($(".add-appointment-box"));  
        /* 
         * 调用支持拖拽的方法 
         */  
        $yt_model_drag.modelDragEvent($(".add-appointment-box .yt-edit-alert-title"));  
        /** 
         * 点击取消方法 
         */  
        $('.add-appointment-box .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {  
            //隐藏页面中自定义的表单内容  
            $(".add-appointment-box").hide();  
        });
         /** 
         * 点击取消方法 
         */  
        $('.add-appointment-box .yt-eidt-model-bottom .yt-model-sure-btn').off().on("click", function() {
	    	var validState = true;
			if($(".rooms").val() == ''){
				$(".rooms").addClass("valid-hint").next().next().text("请选择");
				validState = false;
			}else{
				$(".rooms").removeClass("valid-hint").next().next().text("");
			}
			validState = $yt_valid.validForm($(".add-appointment-box"));
			var startTimeVal = $("select.start-h").val() + ':' + $("select.start-m").val();
			var endTimeVal = $("select.end-h").val() + ':' + $("select.end-m").val();
			if(($("select.end-h").val() + ':' + $("select.end-m").val()) == '24:00'){
				endTimeVal = $("#txtDate").val() + ' ' +  '23:59';
			}
			
			var startDate = new Date(startTimeVal);
			var endDate = new Date(endTimeVal);
			
			if(startTimeVal>=endTimeVal){
				$(".end-time-font").text("开始时间要小于结束时间");
				return false;
			}else{
				$(".end-time-font").text("");
			}
			if(validState){
				var type = $('.yt-option-btn.active').attr("types");
				console.log(type);
				var isConflictParams = [];
				$.each($("#txtDate").val().split(','),function(i,n){
					isConflictParams.push({
											types:type,
											roomId:$("select.rooms").val(),
											startTime:n+' '+startTimeVal,
											endTime:n+' '+endTimeVal,
											pkId:useData?useData.pkId:""
										})
				})
				isConflictParams = JSON.stringify(isConflictParams);
				$.ajax({
					type:"post",
					url:$yt_option.base_path+"administrator/room/getRoomIsConflict",
					async:true,
					data:{
						isConflictParams:isConflictParams
					},
					beforeSend:function(){
						$yt_baseElement.showLoading();
					},
					success:function (data){
						if(data.flag == 0){
								$yt_baseElement.hideLoading();
								if(data.data.isConflict == '1'){
									var alert = '';
									if(data.data.conflictDate!=null){
										$.each(data.data.conflictDate,function(i,n){
										 	alert += '<p>'+"该教室已被"+n.roomUser+"占用,占用时间"+n.startTime+"到"+n.endTime+'</p>';
										})
									}
									alert+='<p style="text-align:center">是否确定继续使用该教室？</p>'
									//隐藏页面中自定义的表单内容  
									$(".add-appointment-box").hide();  
									$yt_alert_Model.alertOne({  
								        haveAlertIcon:false,//是否带有提示图标 
								        haveCloseIcon:false,//是否带有关闭图标 
								        leftBtnName:"确定",//左侧按钮名称,默认确定 
								        rightBtnName:"取消",//右侧按钮名称,默认取消 
								        cancelFunction:"",//取消按钮操作方法*/  
								        alertMsg: alert, //提示信息  
								        confirmFunction: function() { //点击确定按钮执行方法  
								          updateClassRoom();
								        },  
								    }); 
									$('.yt-alert-one').css({
										'width':'700px',
									    'left': '50%',
										'margin-left': '-325px'
									})
								}else{
									updateClassRoom()
								}
								function updateClassRoom(){
									$.ajax({
										type:"post",
										url:"administrator/room/addOrUpdateRoom",
										async:true,
										data:{
											types:type,
											titles:$("input[name='titles']").val(),
											roomId:$("select.rooms").val(),
											startTime:startTimeVal,
											endTime:endTimeVal,
											details:$("[name='details']").val(),
											phone:$("input[name='phone']").val(),
											pkId:useData?useData.pkId:"",
											appointmentTime:$("#txtDate").val()
											},
										beforeSend:function(){
											$yt_baseElement.showLoading();
										},
										success:function (data){
											if(data.flag == 0){
												//构建甘特图
												me.getRoomsInfo($("#query-date").val());
												$(".add-appointment-box").hide();  
												$yt_baseElement.hideLoading(function (){
													$yt_alert_Model.prompt("会议室预约成功");
												});
											}else{
												$yt_baseElement.hideLoading(function (){
													$yt_alert_Model.prompt("会议室预约失败");
												});
											}
										},error:function(data){
											$yt_baseElement.hideLoading(function (){
												$yt_alert_Model.prompt("网络出现问题,请稍后重试");
											});
										}
									});
								}
								
						}else{
							$yt_baseElement.hideLoading(function (){
								$yt_alert_Model.prompt("会议室预约失败");
							});
						}
					},error:function(data){
						$yt_baseElement.hideLoading(function (){
							$yt_alert_Model.prompt("网络出现问题,请稍后重试");
						});
					}
					
				});
				
			
			}
        });
	},
	//选择日期的空间(可多选)
	chooseDay:function(isMultiple){
		$("#txtDate").calendar({  
		    speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
		    complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
		    readonly: true, // 目标对象是否设为只读，默认：true     
		    lowerLimit:"2010/01/01", // 日期下限，默认：NaN(不限制)     
		    nowData:true,//默认选中当前时间,默认true  
			isMultiple:isMultiple,//是否多选
		    dateFmt:"yyyy-MM-dd",  
		    callback: function() { // 点击选择日期后的回调函数  
		        //alert("您选择的日期是：" + $("#txtDate").val()); 
		        if($("#txtDate").val() != ''){
		        	$("#txtDate").removeClass("valid-hint").next().text("");
		        }
		    }  
		});  
	},
	setDay:function (date){
		var me = this;
		var currentDay = me.dateFormat('yyyy年MM月dd日',date);
		$(".current-day").text(currentDay);
		currentDay = me.dateFormat('yyyy-MM-dd',date);
		$("#query-date").val(currentDay);
		 date.setTime(date.getTime()-24*60*60*1000);
		 currentDay = me.dateFormat('yyyy年MM月dd日',date);
		 $(".prev-day").text(currentDay);
		  date.setTime(date.getTime()+2*24*60*60*1000);
		  currentDay = me.dateFormat('yyyy年MM月dd日',date);
		 $(".next-day").text(currentDay);
		 
		 
	},dateFormat:function(fmt, d) { //author: meizz
			var o = {
				"M+": d.getMonth() + 1, //月份 
				"d+": d.getDate(), //日 
				"H+": d.getHours(), //小时 
				"m+": d.getMinutes(), //分 
				"s+": d.getSeconds(), //秒 
				"q+": Math.floor((d.getMonth() + 3) / 3), //季度 
				"S": d.getMilliseconds() //毫秒 
			};
			if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
			for(var k in o)
				if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			return fmt;
		},createGanttView:function (ganttData){
		
		//构建甘特图
		/*$("#ganttChart").ganttView({ 
			data: ganttData
		});*/
	},getRoomsInfo:function (dataVal){
		var me = this;
		var type = $(".tab-title-box button.active").attr('types');
		$yt_baseElement.showLoading();
		$(".meeting-room tbody").empty();
		$.ajax({
			type:"post",
			url:$yt_option.base_path+"administrator/room/lookForAll",
			data:{types:type,dates:dataVal},
			async:true,
			success:function(data){
				if(data.flag == 0){
					var ganttData = [];
					var series = [];
					var gantInfo = {};
					$yt_baseElement.hideLoading();
					var htmlTr = '';
					$.each(data.data, function(i,n) {
						if(n.isEffective=='0')n.roomName=n.roomName+'(停用)';
						htmlTr = '<tr class="ganttview-grid-row">'+
						'<td class="ganttview-grid-row-cell">'+n.roomName+'</td>'+
						'<td class="ganttview-grid-row-cell" style="width:25px;padding:8px 10px"><div class="grid-item"></div></td>'+
						'<td class="ganttview-grid-row-cell"><div class="grid-item"></div></td>'+
						'<td class="ganttview-grid-row-cell"><div class="grid-item"></div></td>'+
						'<td class="ganttview-grid-row-cell"><div class="grid-item"></div></td>'+
						'<td class="ganttview-grid-row-cell"><div class="grid-item"></div></td>'+
						'<td class="ganttview-grid-row-cell"><div class="grid-item"></div></td>'+
						'<td class="ganttview-grid-row-cell"><div class="grid-item"></div></td>'+
						'<td class="ganttview-grid-row-cell"><div class="grid-item"></div></td>'+
						'<td class="ganttview-grid-row-cell"><div class="grid-item"></div></td>'+
						'<td class="ganttview-grid-row-cell"><div class="grid-item"></div></td>'+
						'<td class="ganttview-grid-row-cell"><div class="grid-item"></div></td>'+
						'<td class="ganttview-grid-row-cell"><div class="grid-item"></div></td>'+
						'<td class="ganttview-grid-row-cell"><div class="grid-item"></div></td>'+
						'<td class="ganttview-grid-row-cell"><div class="grid-item"></div></td>'+
						'<td class="ganttview-grid-row-cell"><div class="grid-item"></div></td>'+
						'<td class="ganttview-grid-row-cell"><div class="grid-item"></div></td>'+
						'<td class="ganttview-grid-row-cell"><div class="grid-item"></div></td>'+
						'<td class="ganttview-grid-row-cell"><div class="grid-item"></div></td>'+
						'<td class="ganttview-grid-row-cell"><div class="grid-item"></div></td>'+
						'<td class="ganttview-grid-row-cell"><div class="grid-item"></div></td>'+
						'<td class="ganttview-grid-row-cell"><div class="grid-item"></div></td>'+
						'<td class="ganttview-grid-row-cell"><div class="grid-item"></div></td>'+
						'<td class="ganttview-grid-row-cell"><div class="grid-item"></div></td>'+
						'<td class="ganttview-grid-row-cell"><div class="grid-item"></div></td>'+
						'<td class="ganttview-grid-row-cell"><div class="grid-item"></div></td>'+
						'</tr>';
						htmlTr = $(htmlTr).data("roomInfo",n);
						$(".meeting-room tbody").append(htmlTr);
						if(n.dateTimes != ''){
							$.each($.parseJSON(n.dateTimes), function(j,m) {
								var startTime = m.startTime.split(" ")[1];
								Number(startTime.split(':')[1])<30?startTime = startTime.split(':')[0]+':00':'';
								Number(startTime.split(':')[1])>30?startTime = startTime.split(':')[0]+':30':'';
								var startIndex = $("th[timeval='"+(startTime)+"']").index();
								startIndex = startIndex<0?1:startIndex;
								if(('20:00,20:30,21:00,21:30,22:00,22:30,23:00,23:30').indexOf(startTime) != -1){
									startIndex = 25	;
								}
								if(('01:00,01:30,02:00,02:30,03:00,03:30,04:00,04:30,05:00,05:30,06:00,06:30,07:00,07:30').indexOf(startTime) != -1){
									startIndex = 1	;
								}
								var endTime = m.endTime.split(" ")[1];
								Number(endTime.split(':')[1])<30?endTime = endTime.split(':')[0]+':00':'';
								Number(endTime.split(':')[1])>30?endTime = endTime.split(':')[0]+':30':'';
								var endIndex = $("th[timeval='"+endTime+"']").index();
								if(m.endTime.split(" ")[1] == '23:59' || ('20:00,20:30,21:00,21:30,22:00,22:30,23:00,23:30').indexOf(endTime) != -1){
									endIndex = 26;
								}
								if(('01:00,01:30,02:00,02:30,03:00,03:30,04:00,04:30,05:00,05:30,06:00,06:30,07:00,07:30').indexOf(endTime) != -1){
									endIndex = 2;
								}
								endIndex = Number(endIndex)-1;
								var d = [m];
								var bool = true;
								var abc;
								//判断是否冲突,冲突就变红色
								$.each(htmlTr.find(".ganttview-grid-row-cell:gt("+startIndex+"):lt("+(endIndex-startIndex)+")").find(".old-item"), function(a,b) {
									if($(b).data('useData')){
										bool=false;
										d = $(b).data('useData');
										abc = $(b).data('useData');
									}
								});
								if(htmlTr.find(".ganttview-grid-row-cell:eq("+(startIndex)+")").find(".grid-item").data('useData')){
									bool=false;
									d = htmlTr.find(".ganttview-grid-row-cell:eq("+(startIndex)+")").find(".grid-item").data('useData');
									abc = htmlTr.find(".ganttview-grid-row-cell:eq("+(startIndex)+")").find(".grid-item").data('useData');
								}
								//开始日期判断
								if(htmlTr.find(".ganttview-grid-row-cell:eq("+(startIndex-1)+")").find(".grid-item").data('useData')){
									$.each(htmlTr.find(".ganttview-grid-row-cell:eq("+(startIndex-1)+")").find(".grid-item").data('useData'), function(a,b) {
										if(b.endTime.split(" ")[1]>m.startTime.split(" ")[1]){
											bool=false;
											d = htmlTr.find(".ganttview-grid-row-cell:eq("+(startIndex-1)+")").find(".grid-item").data('useData');
											abc = htmlTr.find(".ganttview-grid-row-cell:eq("+(startIndex-1)+")").find(".grid-item").data('useData');
										}
									});
								}
								//结束日期判断
								if(htmlTr.find(".ganttview-grid-row-cell:eq("+(endIndex+1)+")").find(".grid-item").data('useData')){
									$.each(htmlTr.find(".ganttview-grid-row-cell:eq("+(endIndex+1)+")").find(".grid-item").data('useData'), function(a,b) {
										if(b.startTime.split(" ")[1]<m.endTime.split(" ")[1]){
											bool=false;
											d = htmlTr.find(".ganttview-grid-row-cell:eq("+(endIndex+1)+")").find(".grid-item").data('useData');
											abc = htmlTr.find(".ganttview-grid-row-cell:eq("+(endIndex+1)+")").find(".grid-item").data('useData');
										}
									});
								}
								var widthStart=startIndex,widthEnd=endIndex;
								if(!bool){
									d.push(m);
									htmlTr.find(".ganttview-grid-row-cell:gt("+startIndex+"):lt("+(endIndex-startIndex)+")").find(".grid-item").addClass('base-item').data("useData",d);
									$.each(abc, function(x,y) {
											var oldstartTime = y.startTime.split(" ")[1];
											Number(oldstartTime.split(':')[1])<30?oldstartTime = oldstartTime.split(':')[0]+':00':'';
											Number(oldstartTime.split(':')[1])>30?oldstartTime = oldstartTime.split(':')[0]+':30':'';
											var oldstartIndex = $("th[timeval='"+oldstartTime+"']").index();
											oldstartIndex = oldstartIndex<0?1:oldstartIndex;
											if(('20:00,20:30,21:00,21:30,22:00,22:30,23:00,23:30').indexOf(oldstartTime) != -1){
												oldstartIndex = 25	;
											}
											if(('01:00,01:30,02:00,02:30,03:00,03:30,04:00,04:30,05:00,05:30,06:00,06:30,07:00,07:30').indexOf(oldstartTime) != -1){
												oldstartIndex = 1	;
											}
											var oldstartTime = y.endTime.split(" ")[1];
											Number(oldstartTime.split(':')[1])<30?oldstartTime = oldstartTime.split(':')[0]+':00':'';
											Number(oldstartTime.split(':')[1])>30?oldstartTime = oldstartTime.split(':')[0]+':30':'';
											var oldendIndex = $("th[timeval='"+oldstartTime+"']").index();
											if(y.endTime.split(" ")[1] == '23:59' || ('20:00,20:30,21:00,21:30,22:00,22:30,23:00,23:30').indexOf(oldstartTime) != -1){
												oldendIndex = 26;
											}
											if(('01:00,01:30,02:00,02:30,03:00,03:30,04:00,04:30,05:00,05:30,06:00,06:30,07:00,07:30').indexOf(oldstartTime) != -1){
												oldendIndex = 2;
											}
											oldendIndex = Number(oldendIndex)-1;
											widthStart>oldstartIndex?widthStart=oldstartIndex:'';
											widthEnd<oldendIndex?widthEnd=oldendIndex:'';
											htmlTr.find(".ganttview-grid-row-cell:gt("+oldstartIndex+"):lt("+(oldendIndex-oldstartIndex)+")").find(".grid-item").addClass('base-item').data("useData",d);
											htmlTr.find(".ganttview-grid-row-cell:eq("+(oldstartIndex)+")").find(".grid-item").addClass('base-item').data("useData",d);
									});
								}
								htmlTr.find(".ganttview-grid-row-cell:gt("+startIndex+"):lt("+(endIndex-startIndex)+")").find(".grid-item").addClass("old-item tool-info").data("useData",d);
								htmlTr.find(".ganttview-grid-row-cell:eq("+(startIndex)+")").find(".grid-item").addClass("old-item tool-info").data("useData",d);
								htmlTr.find(".ganttview-grid-row-cell:eq("+(startIndex)+")").find(".grid-item").addClass("start");
								htmlTr.find(".ganttview-grid-row-cell:eq("+endIndex+")").find(".grid-item").addClass("end");
								var toolBox = $('<div class="tool-box" user=",'+m.createUser+',">'+m.createUser+'</div>');
								var widthVal = (htmlTr.find(".ganttview-grid-row-cell:gt("+widthStart+"):lt("+(widthEnd-widthStart)+")").length+1) * 41;
								toolBox.css("width",widthVal==41?"auto":widthVal).data("useData",d);
								if(!bool){
									console.log(widthStart,htmlTr.find(".ganttview-grid-row-cell:eq("+(widthStart)+")"))
									htmlTr.find(".ganttview-grid-row-cell:eq("+(widthStart)+")").find(".grid-item .tool-box").css("width",widthVal==41?"auto":widthVal).data("useData",d);
									//判断改创建人是否已经存在
									if(htmlTr.find(".ganttview-grid-row-cell:eq("+(widthStart)+")").find(".grid-item .tool-box").attr('user')?htmlTr.find(".ganttview-grid-row-cell:eq("+(widthStart)+")").find(".grid-item .tool-box").attr('user').indexOf(','+m.createUser+',')==-1:''){
										htmlTr.find(".ganttview-grid-row-cell:eq("+(widthStart)+")").find(".grid-item .tool-box").attr('user',htmlTr.find(".ganttview-grid-row-cell:eq("+(widthStart)+")").find(".grid-item .tool-box").attr('user')+m.createUser+',').append(m.createUser)
									}
								}else{
									//判断是否冲突
									htmlTr.find(".ganttview-grid-row-cell:eq("+(startIndex)+")").find(".grid-item").append(toolBox);
								}
							});
							$.each($('.start'), function(x,y) {
								$(y).parents('td').prev().find('.base-item')[0]?$(y).removeClass('start'):'';
							});
						}
					});
					//鼠标悬浮
		    		$('div.tool-box').tooltip({
						position: 'bottom',
						content: function() {
							var showBox = '';	
//							$(this).parent().find(".tool-box").each(function (i,n){
//								var useData = $(n).data("useData");
								$.each($(this).data("useData"),function(c,useData){
									showBox += '<div class="tip-box" style="width:270px"><table class="tip-table">' +
									'<tr><td class="tip-lable" style="width:72px">会议主题：</td><td>'+useData.titles+'</td></tr>' +
									'<tr><td class="tip-lable">会议时间：</td><td>'+(useData.startTime.replace('-','年').replace('-','月').replace(' ','日 '))+'-'+(useData.endTime.split(' ')[1])+'</td></tr>' +
									'<tr><td class="tip-lable">申请人：</td><td>'+useData.createUser+'</td></tr>' +
									'<tr><td class="tip-lable">联系方式：</td><td>'+useData.phone+'</td></tr>' +
									'</table></div>';
								})
//							});
						
							return showBox;
						},
						onShow: function() {
							$(this).tooltip('tip').css({
								backgroundColor: '#666',
								borderColor: '#666'
							});
						}
					});
					//点击查看预约详情
					$('div.tool-info').click(function (){
						$(".show-appointment-box .yt-model-sure-btn").hide();
						var meObj = this;
//						if($(meObj).parent().find(".tool-box").length > 1){
//							$(".form-box").hide();
//							$(".form-table").show();
//							$(".form-table tbody").empty();
//							$(this).parent().find(".tool-box").each(function (i,n){
//								var useData = JSON.parse(JSON.stringify($(n).data("useData")))[0];
//								var useTime = useData.startTime + '-' + useData.endTime.split(' ')[1];
//								var trObj = $('<tr><td class="tl">'+useData.titles+'</td><td class="tl">'+useData.roomName+'</td><td>'+useTime+'</td><td>'+useData.phone+'</td><td class="tl">'+useData.dateTimes+'</td></tr>').data("useData",useData);
//								$(".form-table tbody").append(trObj)
//							});
//							$(".form-table tbody tr").click(function (){
//								$(this).addClass("yt-table-active").siblings().removeClass("yt-table-active");
//								if($(this).data("useData").createUserCode == $yt_common.user_info.userName){
//									$(".show-appointment-box .yt-model-sure-btn").show();
//								}else{
//									$(".show-appointment-box .yt-model-sure-btn").hide();
//								}
//							});
//						}else{
		/** 
				         * 显示编辑弹出框和显示顶部隐藏蒙层 
				         */  
				        $(".show-appointment-box").show();  
				        /** 
				         * 调用算取div显示位置方法 
				         */  
				        $yt_alert_Model.getDivPosition($(".show-appointment-box"));  
				        /* 
				         * 调用支持拖拽的方法 
				         */  
				        $yt_model_drag.modelDragEvent($(".show-appointment-box .yt-edit-alert-title"));  
				        /** 
				         * 点击取消方法 
				         */  
				        $('.show-appointment-box .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {  
				            //隐藏页面中自定义的表单内容  
				            $(".show-appointment-box").hide();  
				        });
							$(".form-box").show();
							$(".form-table").hide();
							var useData = JSON.parse(JSON.stringify($(meObj).data("useData")));
							$('.tab-room-box').empty().css('marginLeft','0');
							$(".room-tab-btn-start").hide();
							var tabHtml = '';
							$.each(useData,function(i,n){
								tabHtml = '<button class="yt-option-btn ">• '+n.createUser+'</button>';
								n.useDate = n.startTime.split(' ')[0];
								n.startDate = n.startTime.split(' ')[1];
								n.endDate = n.endTime.split(' ')[1];
								tabHtml = $(tabHtml).data('data',n);
								$('.tab-room-box').append(tabHtml);
							})
							$('.tab-room-box').css('width',useData.length*120+'px');
							$('.tab-room-box .yt-option-btn').eq(0).addClass('active');
							$('.show-appointment-box').setDatas($('.tab-room-box .yt-option-btn').eq(0).data('data'));
							if($('.tab-room-box .yt-option-btn').eq(0).data('data').createUserCode == $yt_common.user_info.userName&&$('.tab-room-box .yt-option-btn').eq(0).data('data').roomType==1){
								$(".show-appointment-box .yt-model-sure-btn").show();
							}else{
								$(".show-appointment-box .yt-model-sure-btn").hide();
							}
							$('.tab-room-box .yt-option-btn').off().on('click',function(){
								$(this).addClass("active").siblings().removeClass("active");
								$('.show-appointment-box').setDatas($(this).data('data'));
								if($(this).data('data').createUserCode == $yt_common.user_info.userName&&$(this).data('data').roomType==1){
									$(".show-appointment-box .yt-model-sure-btn").show();
								}else{
									$(".show-appointment-box .yt-model-sure-btn").hide();
								}
								return false;
							})
							///tab标签切换
							$('.room-tab-btn-end').off().on('click',function(){
								var leftVal = parseInt($(".tab-room-box").css("margin-left")) - 120;
								if($(".tab-room-box").parent().width() > ($(".tab-room-box button").last().position().left - 120)) {
									$(".room-tab-btn-end").hide();
									leftVal = (120 * $(".tab-room-box button").length - $(".tab-room-box").parent().width() + 32) * -1;
								}
								$(".tab-room-box").css("padding-left", "32px").stop(true, true).animate({
									"margin-left": leftVal
								}, 100);
								$(".room-tab-btn-start").show();
							});
							$('.tab-room-list').on('click',".room-tab-btn-start",function(){
								var leftVal = parseInt($(".tab-room-box").css("margin-left")) + 120;
								if(leftVal >= -120) {
									$(this).hide();
									leftVal = 0;
									$(".tab-room-box").css("padding-left", "0");
								}
								$(".tab-room-box").stop(true, true).animate({
									"margin-left": leftVal
								}, 100);
								$(".room-tab-btn-end").show();
							});
							if($(".tab-room-list").width() >= ($(".tab-room-box button").last().position().left + 120)) {
									$(".room-tab-btn-end").off();
									$(".room-tab-btn-end").hide();
							}else{
								$(".room-tab-btn-end").show();
							}
//						}
						
				         /** 
				         * 点击取消方法 
				         */  
				        $('.show-appointment-box .yt-eidt-model-bottom .yt-model-sure-btn:eq(1)').off().on("click", function() {
				        	var useData = JSON.parse(JSON.stringify($('.tab-room-box .yt-option-btn.active').data('data')));
//				        	if($(meObj).parent().find(".tool-box").length > 1){
//				        		if($(".form-table tbody tr.yt-table-active").length ==0 ){
//				        			$yt_alert_Model.prompt("请选择要取消的预约数据!");
//				        			return false;
//				        		}
//				        		useData = JSON.parse(JSON.stringify($(".form-table tbody tr.yt-table-active").data("useData")));
//				        	}
				        	
				        	
			        		var msgText = '是否要取消【'+useData.roomName+'】在'+useData.startTime+'-'+useData.endTime+'的使用申请，取消后数据不可恢复';
				        	$("#pop-modle-alert").css("z-index",103);
				        	$yt_alert_Model.alertOne({
								alertMsg: msgText, //提示信息  
								confirmFunction: function() { //点击确定按钮执行方法
									$("#pop-modle-alert").show().css("z-index",100);
									$.ajax({
										type:"post",
										url:"administrator/room/removeBeanById",
										async:true,
										data:{pkId:useData.pkId},
										sendBefore:function (){
											$yt_baseElement.showLoading();
										},
										success:function (data){
											console.log(data);
											if(data.flag == 0){
												$yt_baseElement.hideLoading(function (){
													$yt_alert_Model.prompt("取消预约成功");
													me.getRoomsInfo($("#query-date").val());
													$(".show-appointment-box").hide();  
												});
											}else{
												$yt_baseElement.hideLoading(function (){
													$yt_alert_Model.prompt("取消预约出错,请稍后重试");
												});	
											}
										},error:function (data){
											$yt_baseElement.hideLoading(function (){
												$yt_alert_Model.prompt("网络出现问题,请稍后重试");
											});
										}
									});
								},cancelFunction:function (){
									$("#pop-modle-alert").show().css("z-index",100);
									
								}
							});
				        });
				        //点击修改
				        $('.show-appointment-box .yt-eidt-model-bottom .yt-model-sure-btn:eq(0)').off().on("click", function() {
				        	$(".show-appointment-box").hide();
				        	var useData = JSON.parse(JSON.stringify($('.tab-room-box .yt-option-btn.active').data('data')));
//				        	if($(meObj).parent().find(".tool-box").length > 1){
//				        		if($(".form-table tbody tr.yt-table-active").length ==0 ){
//				        			$yt_alert_Model.prompt("请选择要修改的预约数据!");
//				        			return false;
//				        		}
//				        		useData = JSON.parse(JSON.stringify($(".form-table tbody tr.yt-table-active").data("useData")));
//				        	}
				        	console.log(useData)
							me.chooseDay(false);
				        	me.addOrUpdateRoom(useData);
				        });
				        
				        
					});
					me.gantt($(".meeting-room tbody"));
				}else{
					$yt_baseElement.hideLoading(function (){
						$yt_alert_Model.prompt("查询出错,请稍后重试");
					});	
				}
			},
			error:function(data){
				$yt_baseElement.hideLoading(function (){
					$yt_alert_Model.prompt("网络出现问题,请稍后重试");
				});
			}
		});
	},gantt:function (div){
		var me = this;
		 $(div).find(".ganttview-grid-row-cell").mousedown(function (){
        	if($(this).find(".grid-item.old-item").length == 0){
        		$(div).find(".grid-item").removeClass("select-item");
        		$(this).find(".grid-item").addClass("select-item");
        		me.mouseState = 'down';
        		me.pos.x = $(this).index();
        		me.pos.y = $(this).parent().index();
        		$(div).find(".ganttview-grid-row:eq("+me.pos.y+") .select-item").first().addClass("start");
    			$(div).find(".ganttview-grid-row:eq("+me.pos.y+") .select-item").last().addClass("end");
        	}else{
        		me.mouseState = 'up';
        	}
        });
         $(div).find(".ganttview-grid-row-cell").mouseup(function (){
            	me.mouseState = 'up';
            });
            $(div).find(".ganttview-grid-row-cell").mousemove(function (){
            	$(div).find(".ganttview-grid-row:eq("+me.pos.y+") .select-item").removeClass("start end");
            	if($(this).find(".grid-item.old-item").length == 0){
            		if(me.mouseState == 'down'){
            			
            			$(div).find(".ganttview-grid-row:eq("+me.pos.y+") .select-item").removeClass("select-item");
            			if($(this).index() < me.pos.x){
            				$(div).find(".ganttview-grid-row:eq("+me.pos.y+") .ganttview-grid-row-cell:gt("+$(this).index()+"):lt("+(me.pos.x-$(this).index())+") .grid-item:not(.old-item)").addClass("select-item");
            				$(div).find(".ganttview-grid-row:eq("+me.pos.y+") .ganttview-grid-row-cell:eq("+$(this).index()+") .grid-item:not(.old-item)").addClass("select-item");
            			}else{
            				$(div).find(".ganttview-grid-row:eq("+me.pos.y+") .ganttview-grid-row-cell:gt("+me.pos.x+"):lt("+($(this).index()-me.pos.x)+") .grid-item:not(.old-item)").addClass("select-item");
            				$(div).find(".ganttview-grid-row:eq("+me.pos.y+") .ganttview-grid-row-cell:eq("+me.pos.x+") .grid-item:not(.old-item)").addClass("select-item");
            			}
            			/*
            			$(this).find(".grid-item").addClass("select-item");*/
            		}
            	}else{
            		me.mouseState = 'up';
            	}
            	$(div).find(".ganttview-grid-row:eq("+me.pos.y+") .select-item").first().addClass("start");
    			$(div).find(".ganttview-grid-row:eq("+me.pos.y+") .select-item").last().addClass("end");
            });
            
            $(div).find(".ganttview-grid").mouseleave(function (){
            	me.mouseState = "up";
            });
        
	},getRooms:function (typeVal,doc,selectVal){
		doc.empty();
		$.ajax({
			type:"post",
			url:$yt_option.base_path + "administrator/room/getRooms",
			async:true,
			data:{roomName:"",types:typeVal},
			beforeSend:function (){
				$yt_baseElement.showLoading();
			},
			success:function(data){
				if(data.flag == 0){
					$.each(data.data, function(i,n) {
						doc.append('<option value="'+n.pkId+'">'+n.roomName+'</option>');
					});
					$(".add-appointment-box select.rooms").niceSelect();
					
					if($(".select-item").length > 0){
						var roomInfo = $(".select-item").first().parent().parent().data("roomInfo");
						$(".add-appointment-box select.rooms").setSelectVal(roomInfo.pkId);
					}
					$yt_baseElement.hideLoading();
				}else{
					$yt_baseElement.hideLoading(function (){
				    	$yt_alert_Model.prompt("查询教室出现问题，请稍后重试");
				    })
				}
				if(selectVal){
					$(".add-appointment-box select.rooms").setSelectVal(selectVal);
				}
			},
			error:function(data){
			    $yt_baseElement.hideLoading(function (){
			    	$yt_alert_Model.prompt("网络出现问题，请稍后重试");
			    })
			}
		});
	}
}
$(function (){
	meetingRoom.init();
})