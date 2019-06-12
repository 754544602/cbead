var teacherList = {
	courseList:"",
	//初始化方法
	init: function() {
		var classInfo = $yt_common.GetQueryString('classInfo');
		if(classInfo == "class"){//满足条件，该页面是由班级信息跳转过来的，新增可授课程按钮隐藏
			$(".add-course-div").hide();
		};
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
		$(".teacher-index-inf input").attr("disabled","disabled");
		
		//点击返回
		$(".btn-return").click(function(){
			var projectCode = $yt_common.GetQueryString('projectCode');
			var index = 1;
			var teaerForm=$yt_common.GetQueryString('teaerForm');
			if(teaerForm!=null){
				window.location.href="classInfo.html?projectCode="+projectCode+"&index="+index+"&projectType="+$yt_common.GetQueryString('projectType')+"&classProjectStates="+$yt_common.GetQueryString('classProjectStates')+"&pkId="+$yt_common.GetQueryString('classpkId')+"&teaerForm="+teaerForm;
			}else{
				window.location.href="classInfo.html?projectCode="+projectCode+"&index="+index+"&projectType="+$yt_common.GetQueryString('projectType')+"&classProjectStates="+$yt_common.GetQueryString('classProjectStates')+"&pkId="+$yt_common.GetQueryString('classpkId');
			}
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
	},
	//师资管理获取一条数据
	getTeacherInf: function() {
		$yt_baseElement.showLoading();
		var pkId = $yt_common.GetQueryString('pkId');
			$.ajax({
				type: "post", //ajax访问方式 默认 "post"  
				url: $yt_option.base_path + "teacher/getBeanById", //ajax访问路径  
				data: {
					pkId:pkId
				}, //ajax查询访问参数
				success: function(data) {
					if(data.flag == 0){
						$(".teacher-index-inf").setDatas(data.data);
						$(".papersType").setSelectVal(data.data.papersType);
						if(data.data.gender==1){
							$(".gender").text("男");
						}else if(data.data.gender==2){
							$(".gender").text("女");
						}
						if(data.data.papersType==1){
							$(".papersType").text("身份证");
						}
						if(data.data.papersType==2){
							$(".papersType").text("护照");
						}
						if(data.data.papersType==3){
							$(".papersType").text("港澳通行证");
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
//							<span class="cancal" style="cursor: pointer;">x</span>
							teacherLi += '<li>'+
											 '<span class="file-name" style="margin-right: 50px;color:blue;cursor: pointer">'+
												 '<input type="hidden" class="fileURL" value="'+$yt_option.acl_path +'api/tAscPortraitInfo/download?isDownload=true&pkId='+v.fileId+'">'+
												 '<input type="hidden" class="file-span-id" value="'+v.pkId+'" >'+v.fileName+
											 '</span>'+
										 '</li>';
								teacherUl.html(teacherLi);
						});
					} 
					$yt_baseElement.hideLoading();
					}else{
						$yt_alert_Model.prompt("获取失败");
						$yt_baseElement.hideLoading();
					}
				}
			});
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
							$('.record-info').show();
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
						}else{
							$('.record-info').hide();
							htmlTr='<tr>'+
								'<td colspan="7" align="center" style="border:0px;">'+
									'<div class="no-data" style="width: 280px;margin: 0 auto;">'+
										'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">'+
									'</div>'+
								'</td>'+
							'</tr>';
							htmlTbody.append(htmlTr);
						}
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
			before:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.courses-tbody');
					var htmlTr = '';
					var num = 1;
					$(htmlTbody).empty();
					if(data.data.rows.length > 0) {
						$('.course-info').show();
						$.each(data.data.rows, function(i, v) {
							var caozuo = '';
							if(v.types==2){
								caozuo='';
							}else{
								caozuo='<img src="../../resources/images/icons/amend.png" style="margin" class="img-amend" alt="" />'+'|'+'<img src="../../resources/images/icons/t-del.png" class="img-del" alt="" />';
								
							}
							htmlTr = '<tr>' +
								'<td><input type="hidden" value="' + v.pkId + '" class="pkId">' + num++ + '</td>' +
								'<td style="text-align:left">'+v.courseTitle+'</td>' +
								'<td style="text-align:left">' + v.courseDetails + '</td>' +
								'<td style="font-weight:bold;color:#c9c9c9;">'+caozuo +'</td>'+
								'</tr>';
								htmlTbody.append($(htmlTr).data("courseData",v));
						});
					}else{
						$('.course-info').hide();
						htmlTr='<tr>'+
								'<td colspan="4" align="center" style="border:0px;">'+
									'<div class="no-data" style="width: 280px;margin: 0 auto;">'+
										'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">'+
									'</div>'+
								'</td>'+
							'</tr>';
						htmlTbody.append(htmlTr);
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
						$(htmlTbody).empty()
						$.each(data.data.rows, function(i, v) {
							htmlTr = '<tr>' +
								'<td><input type="hidden" value="' + v.pkId + '" class="pkId">' + num++ + '</td>' +
								'<td style="text-align: left;"><a href="'+v.fileUrl+'" class="yt-link">'+v.fileName+'</a></td>' +
								'<td style="text-align: left;">' + v.createUserName + '</td>' +
								'<td>' + v.createTimeString + '</td>' +
								'<td style="text-align: right;">' + v.fileSize + '<span>'+(v.fileSize==""?"":"MB")+'</span></td>' +
								'</tr>';
								htmlTbody.append($(htmlTr).data("courseWareData",v));
								
						});
					} 
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