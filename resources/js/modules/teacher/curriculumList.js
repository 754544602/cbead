var curriculumList = {
	//初始化方法
	init: function() {
		var me = this;
		
		$("select").niceSelect(); //下拉框刷新  
		//初始化教学方案时间选择
		$("#txtDate").calendar({  
		    speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
		    complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
		    readonly: true, // 目标对象是否设为只读，默认：true     
		    lowerLimit:"2010/01/01", // 日期下限，默认：NaN(不限制)     
		    nowData:true,//默认选中当前时间,默认true  
		    dateFmt:"yyyy-MM-dd",  
		    callback: function() { // 点击选择日期后的回调函数  
		       	 //查询教学方案信息
				me.teachingShare($("#txtDate").val());
		    }  
		});  
		//初始化周切换
		$(".change-week span").click(function (){
			var current = $("#txtDate").val();
			if($(this).index() == 0){
				current = ytDate.prevWeek(current);
			}else if($(this).index() == 1){
				current = ytDate.formatDate(new Date());
			}else{
				current = ytDate.nextWeek(current);
			}
			$("#txtDate").val(current);
			me.teachingShare(current);
		});
		
		
		//日期控件
		$(".course-date-start").calendar({
			controlId: "startDate",
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $(".course-date-end") //开始日期最大为结束日期  
		});
		$(".course-date-end").calendar({
			controlId: "endDate",
			nowData: false, //默认选中当前时间,默认true  
			lowerLimit: $(".course-date-start") //结束日期最小为开始日期  
		});
		//超链接跳转传参
		$(".tab-title-list button").click(function() {
			$(this).addClass("active").siblings().removeClass("active");
			$(".box-list .content-box").hide().eq($(this).index()).show();

			if($(this).index() == 0) {
			 	//查询教学方案信息
				this.teachingShare($("#txtDate").val());
			} else if($(this).index() == 1) {
				//调用获取列表数据方法
				curriculumList.getCurriculumListInfo();
			} 
		});
		//返回班级管理页面
		$('.page-return-btn').off().on('click', function() {
			window.location.href = "classMg.html";
		});
		
		//跳转页面传参
		/*$('.projectName').off().on("click",function(){
			var projectCode = $('.projectCode').val();//获取班级编号
			window.location.href="classInfo.html?projectCode=" + projectCode;
			
		})*/
		
		
		//点击更多
		var clickNumber = 0;
		$('.search-more').click(function() {
			//显示窗口
			if(clickNumber %2==0){
				$('.search-box').show();
				$('.search-put').addClass('flipy');
			}else{
				$('.search-box').hide();
				$('.course-date-start').val("");
				$('.course-date-end').val("");
				$('.project-code').val("");
				$('.project-name').val("");
				$('.course-name').val("");
				$('.project-state-box').each(function() {
					$(this).find("option:eq(0)").prop("selected", "selected");
				});
				$('.teacher-name').val("");
				$('.grade-start').val("");
				$('.grade-end').val("");
				$('.project-user-name').val("");
			}
			clickNumber++;
		});
		//重置按钮
		$('.yt-model-reset-btn').click(function(){
			$('.course-date-start').val("");
			$('.course-date-end').val("");
			$('.project-code').val("");
			$('.project-name').val("");
			$('.course-name').val("");
			$(".course-type-code").setSelectVal("");
			$('.teacher-name').val("");
			$('.grade-start').val("");
			$('.grade-end').val("");
			$('.project-user-name').val("");
		});
		//条件搜索
		$('.search-box .yt-model-sure-btn').click(function(){
		var projectCode=$('.search-box .project-code').val();                  
		var projectName=$('.search-box .project-name').val();                  
		var courseName=$('.search-box .course-name').val();                   
		var teacherName=$('.search-box .teacher-name').val();
			curriculumList.getCurriculumListInfo(projectCode,projectName,courseName,teacherName);
		});
		
		$('.search-btn').click(function() {
			//调用获取列表数据方法查询
			curriculumList.getCurriculumListInfo();
			
		});
		
		//查询教学方案信息
		me.teachingShare($("#txtDate").val());
		//导出
		$(".exportList").click(function(){
			debugger
			curriculumList.outFile();
		});
	},
		
	/**
	 * 获取列表数据
	 */
	getCurriculumListInfo: function(projectCode,projectName,courseName,teacherName) {
		var projectUserName=$('.search-box .project-user-name').val();
		var courseDateStart=$('.search-box .course-date-start').val();
		var courseDateEnd=$('.search-box .course-date-end').val();
		var courseTypeCode=$('.search-box .course-type-code').val();
		var gradeStart=$('.search-box .grade-start').val();
		var gradeEnd=$('.search-box .grade-end').val();
		var slectParam=$('.keyword').val();                  
		$('.curriculum-page').pageInfo({
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "class/course/lookForCourseAll", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				courseDateStart:courseDateStart,				       
				courseDateEnd:courseDateEnd,
				projectCode:projectCode,
				projectName:projectName,
				courseName:courseName,
				courseTypeCode:courseTypeCode,
				teacherName:teacherName,
				gradeStart:gradeStart,
				gradeEnd:gradeEnd,
				slectParam:slectParam,
				projectUserName:projectUserName
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			async:true,
			before:function(){
				$yt_baseElement.showLoading(); 
			},
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.curriculum-tbody');
					var htmlTr = '';
					var num = 1;
					if(data.data.rows.length > 0) {
						$.each(data.data.rows, function(i, v) {
							//v.courseDate = v.courseDate.split(" ")[0];
							htmlTr += '<tr>' +
								'<td>' + num++ + '</td>' +
								'<td>' + v.projectCode + '</td>' +
								'<td style="text-align: left;">'+v.projectName+'</td>' +
								'<td>' + v.courseDate + '</td>' +
								'<td class="text-overflow" style="text-align: left;">' + v.courseName + '</td>' +
								'<td class="text-overflow" style="text-align: left;">' + v.courseTypeName + '</td>' +
								'<td style="text-align: left;">' + v.teacherName + '</td>' +
								'<td style="text-align: left;">' + v.projectUserName + '</td>' +
								'<td style="text-align: right;">' + v.grade + '</td>' +
								'</tr>';
						});
					} else {
						$(".curriculum-page").hide();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="9" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
					}
					htmlTbody.html(htmlTr);
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function (){
						$yt_alert_Model.prompt("查询失败");
					});
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},setWeekHead:function (){
		var me = this;
		//获取日期
		var currentDate = $("#txtDate").val();
		var weekList = ytDate.startStop(currentDate);
		$(".state-day").remove();
		$(".programme thead tr").append('<th class="state-day"><div>星期一<span>'+(new Date(weekList[0]).getDate())+'日</div></span></th>');
		$(".programme thead tr").append('<th class="state-day"><div>星期二<span>'+(new Date(weekList[1]).getDate())+'日</div></span></th>');
		$(".programme thead tr").append('<th class="state-day"><div>星期三<span>'+(new Date(weekList[2]).getDate())+'日</div></span></th>');
		$(".programme thead tr").append('<th class="state-day"><div>星期四<span>'+(new Date(weekList[3]).getDate())+'日</div></span></th>');
		$(".programme thead tr").append('<th class="state-day"><div>星期五<span>'+(new Date(weekList[4]).getDate())+'日</div></span></th>');
		$(".programme thead tr").append('<th class="state-day"><div>星期六<span>'+(new Date(weekList[5]).getDate())+'日</div></span></th>');
		$(".programme thead tr").append('<th class="state-day"><div>星期日<span>'+(new Date(weekList[6]).getDate())+'日</div></span></th>');
		return weekList;
	},teachingShare:function(currentDate){
		
		//查询教学方案共享表头
		var weekList = this.setWeekHead();	
		
		$yt_baseElement.showLoading();
		$.ajax({
			type:"post",
			url:"class/teachingShare/lookForAll",
			async:true,
			data:{selectDate:currentDate,selectWeek:0,dateTypes:'1,2,3'},
			success:function(data){
			    if(data.flag == 0){
			    	var programmeList = $(".programme tbody").empty();
			    	if(data.data.length > 0){
			    		var weekDoc = '<td class="state-day"></td>' +
							'<td class="state-day"></td>' +
							'<td class="state-day"></td>' +
							'<td class="state-day"></td>' +
							'<td class="state-day"></td>' +
							'<td class="state-day"></td>' +
							'<td class="state-day"></td>';
			    		var programme = '';
			    		var arrIndex,stateObj;
			    		$.each(data.data,function (i,n){
			    			programme = '<tr class="morning"><td rowspan="3">'+n.projectName+'</td>'+
			    			'<td class="tc">上午</td>'+
			    			weekDoc+
			    			'</tr>'+
			    			'<tr class="afternoon">'+
			    			'<td class="tc">下午</td>'+
			    			weekDoc+
			    			'</tr>'+
			    			'<tr class="night">'+
			    			'<td class="tc">晚上</td>'+
			    			weekDoc+
			    			'</tr>';
			    			programme = $(programme).data("classInfo",n);
			    			$.each(n.courseData, function(j, m) {
								arrIndex = $.inArray(m.courseDate, weekList);
								if(arrIndex != -1) {
									stateObj = programme.eq(parseInt(m.dateType) - 1).find(".state-day").eq(arrIndex).data("arrIndex", arrIndex);
									if(stateObj.find('.teacher-name')[0]){
										stateObj.find('.teacher-name').text(stateObj.find('.teacher-name').text()+'、'+m.teacherName);
										stateObj.data("teacherId",stateObj.data("teacherId")+','+m.teacherId);
										stateObj.find(".tool-info").data("courseData").push(m)
									}else{
										stateObj.addClass("have-couse").append('<div class="teacher-name">'+m.teacherName+'</div>').attr("colspan",1).data("teacherId",m.teacherId).append($('<div class="tool-info"></div>').data("courseData",[m]));
									}
								}
							});
			    			programmeList.append(programme);
			    		});
			    		var haveCouseDoc,colspan,courseData,currentData;
		    			$(".have-couse").each(function (i,n){
		    				if($(n).prev().hasClass('have-couse') && $(n).prev().data("teacherId") == $(n).data("teacherId")){
		    					colspan = $(this).prev().attr("colspan");
		    					colspan = parseInt(colspan)+1;
		    					
		    					if($(this).prev().find(".tool-box").length ==0 ){
		    						$(this).prev().append($('<div class="tool-box"></div>').append($(this).prev().find(".tool-info")));
		    					}
		    					$(this).prev().attr("colspan",colspan).find(".tool-box").append($(this).find("div"));
		    					$(this).remove();
		    				}else{
		    					$(this).append($('<div class="tool-box"></div>').append($(this).find(".tool-info")));
		    				}
		    				
			    		});
		    			$(".tool-box .teacher-name").remove();
			    		//鼠标悬浮
			    		$('.have-couse div.tool-info').tooltip({
							position: 'bottom',
							content: function() {
								var courseData = $(this).data("courseData");
								var showBox ='';
								$.each(courseData, function(a,b) {
								b.title==undefined?b.title='':b.title=b.title;
								showBox += '<div class="tip-box" style="width:264px"><table class="tip-table">' +
										'<tr><td class="tip-lable" width="72px" style="vertical-align: top;">课程主题：</td><td>'+b.courseName+'</td></tr>' +
										'<tr><td class="tip-lable">授课教师：</td><td>'+b.teacherName+'</td></tr>' +
										'<tr><td class="tip-lable">单位职称：</td><td>'+b.title+'</td></tr>' +
										'<tr><td class="tip-lable">工作单位：</td><td>'+b.org+'</td></tr>' +
										'<tr><td class="tip-lable">上课时间：</td><td>'+b.courseTime+'</td></tr>' +
										'<tr><td class="tip-lable">课程教室：</td><td>'+b.classroomNames+'</td></tr>' +
										'<tr><td class="tip-lable">项目主任：</td><td>'+b.projectHead+'</td></tr>' +
										'<tr><td class="tip-lable">班主任：</td><td>'+b.classTeacher+'</td></tr>' +
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
			    	}else{
						var htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="9" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
							programmeList.html(htmlTr);
			    	}
			    	$yt_baseElement.hideLoading();
			    }else{
			    	$yt_baseElement.hideLoading(function (){
				    	$yt_alert_Model.prompt("操作失败,请稍后重试");
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
	outFile:function(){
		var projectUserName=$('.search-box .project-user-name').val();
		var courseDateStart=$('.search-box .course-date-start').val();
		var courseDateEnd=$('.search-box .course-date-end').val();
		var courseTypeCode=$('.search-box .course-type-code').val();
		var gradeStart=$('.search-box .grade-start').val();
		var gradeEnd=$('.search-box .grade-end').val();
		var slectParam=$('.keyword').val();   
		var projectCode = $('.project-code').val();
		var projectName = $('.project-name').val();
		var courseName = $('.course-name').val();
		var teacherName = $('.teacher-name').val();
		$.ajaxDownloadFile({
			url:$yt_option.base_path+"class/course/exportCourseByClass",
			data:{
				courseDateStart:courseDateStart,
				courseDateEnd:courseDateEnd,
				slectParam:slectParam,
				courseTypeCode:courseTypeCode,
				gradeStart:gradeStart,
				gradeEnd:gradeEnd,
				projectCode:projectCode,
				projectName:projectName,
				courseName:courseName,
				teacherName:teacherName,
				projectUserName:projectUserName
			}
		});
	}
}


var ytDate = {
	//格局化日期：yyyy-MM-dd   
	formatDate: function(date) {
		var myyear = date.getFullYear();
		var mymonth = date.getMonth() + 1;
		var myweekday = date.getDate();

		if(mymonth < 10) {
			mymonth = "0" + mymonth;
		}
		if(myweekday < 10) {
			myweekday = "0" + myweekday;
		}
		return(myyear + "-" + mymonth + "-" + myweekday);
	},
	startStop: function(obj) {
		var me = this;
		var startStop = new Array();
		//获取当前时间    
		var currentDate = new Date(obj);
		var weekday = currentDate.getDay() || 7;
		currentDate.setDate(currentDate.getDate() - weekday); //往前算（weekday-1）天，年份、月份会自动变化
		for(var i = 0; i < 7; i++) {
			currentDate.setDate(currentDate.getDate() + 1); //往前算（weekday-1）天，年份、月份会自动变化
			startStop.push(me.formatDate(currentDate));
		}
		return startStop;
	},nextWeek:function (obj){
		var me = this;
		//获取当前时间    
		var currentDate = new Date(obj);
		currentDate.setDate(currentDate.getDate() + 7); //往前算（weekday-1）天，年份、月份会自动变化
		return me.formatDate(currentDate);
	},prevWeek:function (obj){
		var me = this;
		//获取当前时间    
		var currentDate = new Date(obj);
		currentDate.setDate(currentDate.getDate() - 7); //往前算（weekday-1）天，年份、月份会自动变化
		return me.formatDate(currentDate);
	}
}

$(function() {
	//初始化方法
	curriculumList.init();
	
});