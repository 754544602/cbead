﻿/**
 * 班级详细信息
 */
$yt_baseElement.showLoading();
document.onreadystatechange=function(){
	//所有数据加载完毕
    if(document.readyState=='complete'){
        $yt_baseElement.hideLoading();
    }

 }
var caInfoList = {
	//初始化方法
	init: function() {
		$yt_baseElement.showLoading();
		//授课教师点击教师名的详情页返回传过来的页签标识，
		var index = $yt_common.GetQueryString("index");
		var terForm=$yt_common.GetQueryString("teaerForm");
		if (index == 1) {//页签标识为1显示授课教师的信息
			$(".class-info-btn").removeClass("active");//移除班级信息页签的样式，
			$(".class-div").hide();//隐藏班级信息页面
			$(".teacher-info-btn").addClass("active");//授课教师页签添加样式
			$(".teacher-div-box").show();//显示授课教师页面
			caInfoList.getTeacherListInfo();//调用授课教师查询方法
			console.log('tetet',terForm);
			if(terForm!=null){
				//查询选择教师列表
				caInfoList.selectTeacherListInfo();
				caInfoList.choTeaForm();
			}
		}
		caInfoList.getPlanListInfo();
		var projectCode = $yt_common.GetQueryString("projectCode");
		/*
		 后勤人员只能访问接待通知
		 
		 * */
//		var isOperation = false;
//		(','+$yt_common.user_info.roleIds+',').indexOf(',323,') != -1?isOperation=true:'';
//		(','+$yt_common.user_info.roleIds+',').indexOf(',319,') != -1?isOperation=true:'';
//		(','+$yt_common.user_info.roleIds+',').indexOf(',308,') != -1?isOperation=true:'';
//		(','+$yt_common.user_info.roleIds+',').indexOf(',325,') != -1?isOperation=true:'';
//		(','+$yt_common.user_info.roleIds+',').indexOf(',326,') != -1?isOperation=true:'';
//		(','+$yt_common.user_info.roleIds+',').indexOf(',326,') != -1?isOperation=true:'';
		if($yt_common.GetQueryString('isOperation')==1){
			$('.body-tab-btn-end,.body-tab-btn-start').hide();
			$(".tab-body-list button").eq(6).show().addClass("active").siblings().hide();
			$(".box-list .content-box").hide().eq(6).show();
			 //接待通知页签
			//初始化接待通知
			receptionNotice.init();
			receptionNotice.getReceptionList();
		}else{
			$(".tab-body-list button").show()
		}
		if($yt_common.GetQueryString('diploma')==1){
			$('.body-tab-btn-end,.body-tab-btn-start').hide();
			if(!$(".tab-body-list button").eq(6).hasClass("active")){
				$(".tab-body-list button").eq(13).show().addClass("active").siblings().hide();
				$(".box-list .content-box").hide().eq(13).show();
				//结业证管理页签
				//初始化结业证
				certificateEnd.init();
				certificateEnd.getCertificateList();
			}else{
				$(".tab-body-list button").eq(13).show()
			}
		}else if($(".tab-body-list button").eq(6).is('hidden')){
			$(".tab-body-list button").show()
		}
		//设置列表样式
		$(".tab-body-list button").click(function() {
			//var divIndex; 
			$(this).addClass("active").siblings().removeClass("active");
		
			$(".box-list .content-box").hide().eq($(this).index()).show();

			if($(this).index() == 0) { //班级信息页签
				caInfoList.getPlanListInfo();

			} else if($(this).index() == 1) { //授课教师页签
				caInfoList.getTeacherListInfo();

			} else if($(this).index() == 2) { //课程日程页签
				//初始化百度地图
				positionMap.init();
				courseManager.init();
				var thisData=new Date();
				var thisYea=thisData.getFullYear();
				var thisMonth=thisData.getMonth()+1;
				var thisDae=thisData.getDate();
				var thisDate=thisYea+"-"+thisMonth+"-"+thisDae;
				//thisDate=thisData.toLocaleDateString().replace()
				var endData=$(".end-date").text();
				if(new Date(endData)<new Date(thisDate)){
					$(".add-couse-btn").hide();
				}
				courseManager.getCourseType();
				courseManager.getCourseList();
				//接待活动列表
				courseManager.getCourseReceptionList();

			} else if($(this).index() == 3) { //学员管理页签
				studentList.init();
				//studentList.clickStudentDetails();
				studentList.getStudentList();
				studentList.getDifferentList();
				$(".stu-key-word").off().on('click','.search-btn',function(){
					studentList.getStudentList();
				});
			} else if($(this).index() == 4) { //重复来院名单页签
				repeatCourtyardList.init();
				//重复来院名单
				repeatCourtyardList.getRepeatComeList();
				//疑似重复来院名单
				repeatCourtyardList.doubtRepatComeList();
			} else if($(this).index() == 5) { //学员手册页签
				//初始化学员手册
				studentManual.init();
				$('.student-manual-div .student-manual-btn').eq(0).addClass('change-page-sign').siblings().removeClass('change-page-sign');
				$('.student-manual-div .manual-div').hide().eq(0).show();
				//获取模板
				//studentManual.getPageDataList();
				studentManual.getTemplateList();
			} else if($(this).index() == 6) { //接待通知页签
				//初始化接待通知
				receptionNotice.init();
				receptionNotice.getReceptionList();

			} else if($(this).index() == 7) { //班级公告页签
				//初始化班级公告模块
				classBulletin.init();
				//班级公告
				classBulletin.getClassBulletin();
			} else if($(this).index() == 8) { //二维码页签
				$yt_baseElement.showLoading();
				$yt_baseElement.hideLoading();
			} else if($(this).index() == 9) { //学员报到页签
				//初始化学员报到模块
				studentReport.init();
				//学员报到
				studentReport.getStudentReport();
				studentReport.getDifferentList();
				//studentList.clickStudentDetails();
			} else if($(this).index() == 10) { //缴费开票页签
				//初始化缴费开票
				payTicket.init();
				payTicket.PayTicketList(2, 2);
			} else if($(this).index() == 11) { //请假管理页签
				//初始化请假管理
				leaveTube.init();
				leaveTube.leaveList();
			} else if($(this).index() == 12) { //出勤管理页签
				//初始化出勤管理
				attendance.init();
				//获取日期按钮
				attendance.getSwitchBtn();
				//获取全员的签到
				attendance.getStudentSign();
			} else if($(this).index() == 13) { //结业证管理页签
				//初始化结业证
				certificateEnd.init();
				certificateEnd.getCertificateList();
			} else if($(this).index() == 14) { //学员反馈页签
				//初始化学员反馈
				feedBack.init();
				feedBack.getBackListHead();
				feedBack.getFeedBackList();
			}
		});
		//返回班级管理页面
		$('.page-return-btn').off().on('click', function() {
//			window.history.back();
			window.location.href="classMg.html";
		});
		//点击查看更多详细信息
		$(".see-more-mssage").click(function() {
			//项目Id
			var projectId = $(".project-pk-id").val();
			//班级编号
			var projectCode = $yt_common.GetQueryString("projectCode");
			var classProjectStates = $yt_common.GetQueryString("classProjectStates");
			window.location.href = "../project/projectDetails.html?projectCode=" + projectCode + "&pkId=" + projectId + "&judgeList=1&tp=1&projectCodeList=" + projectCode+"&classProjectStates="+classProjectStates;
		});
		//点击教师姓名跳到详情页
		$('.teacher-div .tab-content .teacher-table,.select-teacher-div').on('click', '.real-name', function() {
			var teacherId = $(this).parents("tr").find('label .select-teacher-pkId').val();
			//班级编号
			var projectCode = $yt_common.GetQueryString("projectCode");
			var classInfo = "class";
			//判断选择教师弹窗是否弹出
			var teaerForm=$(".select-teacher-div").css('display');
			console.log($(".select-teacher-div").css('display'));
			//判断是否是弹框里的教师
			if(teaerForm!='none'){
				window.location.href = "classTeacherInf.html?pkId=" + teacherId + "&&projectCode=" + projectCode+"&"+"classInfo="+classInfo+"&classpkId="+$yt_common.GetQueryString('pkId')+"&projectType="+$yt_common.GetQueryString('projectType')+"&classProjectStates="+$yt_common.GetQueryString('classProjectStates')+"&teaerForm="+teaerForm;
			}else{
				//标识是跳转页面是从班级信息跳转到教师详情页的可授课程没有新增可授课程按钮的
				window.location.href = "classTeacherInf.html?pkId=" + teacherId + "&&projectCode=" + projectCode+"&"+"classInfo="+classInfo+"&classpkId="+$yt_common.GetQueryString('pkId')+"&projectType="+$yt_common.GetQueryString('projectType')+"&classProjectStates="+$yt_common.GetQueryString('classProjectStates');
			}
			$('.select-teacher-div').hide();
		});
		//点击弹窗选择授课教师
		$('.teacher-search-btn').click(function() {
			//查询选择教师列表
			caInfoList.selectTeacherListInfo();
			caInfoList.choTeaForm();
		});
	
		//移除教师
		$('.teacher-delete-btn').click(function() {
			var pkId = "";
			var courseNames = '';
			//提示文字
			var tipText='';
			$('.teacher-div .teacher-table .teacher-list-tbody tr input[class="select-teacher-pkId"]:checked').each(function() {
				var courseName=$(this).parents('tr').data('courseName');
				var teacherName=$(this).parents('tr').find('.real-name').text();
				if(pkId == "") {
					pkId = $(this).val();
				} else {
					pkId += "," + $(this).val();
				}
				//教师是否有课程
				if(courseName!=""){
					//填充课程数据
						courseNames=courseName;
					//拼接提示文字
					if(tipText==''){
						tipText+="<span style='color: #f00000;'>"+teacherName+"</span>已被指定为<span style='color: #f00000;'>" + courseName + "</span>课程的教师,请先取消该课程";
					}else{
						tipText+="<br/><span style='color: #f00000;'>"+teacherName+"</span>已被指定为<span style='color: #f00000;'>" + courseName + "</span>课程的教师,请先取消该课程";
					}
				}
			});
			if(pkId == "") {
				$yt_alert_Model.prompt("请选择教师数据");
			} else {
				if(courseNames == '') {
					$yt_alert_Model.alertOne({
						alertMsg: "数据删除将无法恢复，是否删除？", //提示信息  
						confirmFunction: function() { //点击确定按钮执行方法  
							caInfoList.deleteTeacher(pkId);
						},
					});
				} else {
					console.log(courseNames);
					$yt_alert_Model.alertOne({
						haveCloseIcon: true, //是否带有关闭图标  
						leftBtnName: "确定", //左侧按钮名称,默认确定  
						cancelFunction: "", //取消按钮操作方法*/  
						alertMsg:tipText,
						cancelFunction: function() { //点击确定按钮执行方法

						}
					});
				}

			}
		});
		//教师订票
		$('.teacher-ticket-btn').off('click').click(function() {
			//获取列表
			caInfoList.getTicketList();
			$(".select-ticket-div").show();
			//点击确定按钮
			$('.select-ticket-sure-btn').off('click').click(function() {
				caInfoList.getTicket();
				$(".select-ticket-div").hide();
			});
			$yt_model_drag.modelDragEvent($(".select-ticket-div .yt-edit-alert-title"));
			//取消按钮
			$('.select-ticket-canel-btn').click(function() {
				$(".yt-edit-alert").hide();
				$("#pop-modle-alert").hide();
			});
		});
		//复选框
		//全选  
		$(".check-all").change(function() {
			//判断自己是否被选中  
			if($(this).parent().hasClass("check")) {
				//设置反选  
				$(this).parents("table").find("tbody input[type='checkbox']").setCheckBoxState("uncheck");
				$(this).parents("table").find("tbody tr").removeClass('yt-table-active');
			} else {
				//调用设置选中方法,全选  
				$(this).parents("table").find("tbody input[type='checkbox']").setCheckBoxState("check");
				$(this).parents("table").find("tbody tr").addClass('yt-table-active');
			}
		});

		//修改全选按钮状态
		$(".teacher-table tbody,.select-teacher-tbody").on("change", "input[type='checkbox']", function() {
			if($(this).parents("table").find("tbody input[type='checkbox']").length != $(this).parents("table").find("tbody input[type='checkbox']:checked").length) {
				$(this).parents("table").find(".check-all").setCheckBoxState("uncheck");
			} else {
				$(this).parents("table").find(".check-all").setCheckBoxState("check");
			}
		});
		//点击接送站
		$(".teacher-station-btn").click(function() {
			caInfoList.getRelayList();
			/** 
			 * 显示编辑弹出框和显示顶部隐藏蒙层 
			 */
			$(".shuttle-box").show();
			/* 
			 * 调用支持拖拽的方法 
			 */
			$yt_model_drag.modelDragEvent($(".shuttle-box .yt-edit-alert-title"));
			/** 
			 * 点击取消方法 
			 */
			$('.shuttle-box .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
				//隐藏页面中自定义的表单内容  
				$(".shuttle-box").hide();
			});
		});
		//点击申请派车
		$(".shuttle-box .yt-model-sure-btn").off().on('click', function() {
			//caInfoList.teacherApplyCar();
			var boolAply = true;
			$(".shuttle-box tbody td input[name='test']:checked").each(function(i, b) {
				var dateTime = $(b).parents('tr').find('.relay-dates').val();
				var address = $(b).parents('tr').find('.relay-address').val();
				if(dateTime == "" || address == ""){
					if (dateTime == "") {
						boolAply = false;
						$yt_alert_Model.prompt("时间不能为空！");
					}else{
						boolAply = false;
						$yt_alert_Model.prompt("地点不能为空！");
					}
					return false;
				}
			});
			if(boolAply == true){
				caInfoList.getNextOptPeople();
			}
			
		});
		///tab标签切换
		$(".body-tab-btn-end").click(function() {
			var leftVal = parseInt($(".tab-title-box").css("margin-left")) - 120;
			console.log(leftVal);
			if($(".tab-title-box").parent().width() > ($(".tab-title-box button").last().position().left - 120)) {
				$(".body-tab-btn-end").hide();
				leftVal = (120 * $(".tab-title-box button").length - $(".tab-title-box").parent().width() + 32) * -1;
			}
			$(".tab-title-box").css("padding-left", "32px").stop(true, true).animate({
				"margin-left": leftVal
			}, 100);
			$(".body-tab-btn-start").show();
		});
		$(".body-tab-btn-start").click(function() {
			var leftVal = parseInt($(".tab-title-box").css("margin-left")) + 120;

			if(leftVal >= -120) {
				$(this).hide();
				leftVal = 0;
				$(".tab-title-box").css("padding-left", "0");
			}
			console.log(leftVal);
			$(".tab-title-box").stop(true, true).animate({
				"margin-left": leftVal
			}, 100);
			$(".body-tab-btn-end").show();
		});

	},
	/**
	 * 选择教师弹窗操作
	 */
	choTeaForm:function(){
		//模糊查询
			$('.teacher-search-btn-img').off().click(function() {
				caInfoList.selectTeacherListInfo($("#keyword").val());
				return false;
			});
			//选择授课教师
			$('.select-teacher-sure-btn').off().click(function() {
				var pkId = "";
				$('.select-teacher-alert-checkbox input[class="select-teacher-pkId"]:checked').each(function() {
					if(pkId == "") {
						pkId = $(this).val();
					} else {
						pkId += "," + $(this).val();
					}
				});
				if(pkId == "") {
					$yt_alert_Model.prompt("请选中一条数据进行操作", 3000);
				} else {
					caInfoList.selectTeacher(pkId);
				}
			});
			//取消按钮	
			$('.select-teacher-canel-btn').off().click(function() {
				$('.select-teacher-div .select-teacher-tbody').empty();
				$('.select-teacher-div').hide();
//				$(".yt-edit-alert,#heard-nav-bak").hide();
//				$("#pop-modle-alert").hide();
			});
	},
	/**
	 * 获取教师订票的pkId
	 */
	getTeacherReseverId: function() {
		var teachersReseverList = [];
		//班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/teacher/getTeachersReseve",
			data: {
				projectCode: projectCode
			},
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					var teachersReseve = data.data.teachersReseve
					if(teachersReseve != "") {
						var resever = $.parseJSON(teachersReseve);
						$.each(resever, function(i, g) {
							var teacherResever = {
								teacherReseverId: g.pkId,
								teacherId: g.teacherId,
								routeType: g.routeType
							};
							teachersReseverList.push(teacherResever);
						});
					}
				}
			}
		});
		//teachersReseverList=JSON.stringify(teachersReseverList);
		return teachersReseverList;
	},
	/**
	 * 获取下一步审批人
	 */
	getNextOptPeople: function() {
		var user = "";
		var dataObj = "";
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/workFlowOperate/getSubmitPageData",
			data: {
				businessCode: "teachersFeederStation",
				processInstanceId: "",
				parameters: "",
				versionNum: ""
			},
			async: true,
			success: function(data) {
				if(data.flag == 0) {
					console.log(data.data);
					$.each(data.data, function(i, n) {
						console.log(n);
						console.log(i);
						for(var k in n) {
							console.log('k', k);
							console.log("n[k]", n[k]);
							user = n[k][0].userCode;
							console.log("userCode", user);
							dataObj = eval("(" + k + ")");
							console.log(dataObj);
							console.log("nextCode", dataObj.nextCode);
						}
					});
					caInfoList.teacherApplyCar(user, "", dataObj.nextCode);
				}
			}
		});

	},
	/**
	 * 教师申请派车
	 */
	teacherApplyCar: function(dealingWithPeople, processInstanceId, nextCode) {
		var teacherReseverList = caInfoList.getTeacherReseverId();
		console.log("订票Id", teacherReseverList);
		//班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		var teachersFeederStation = [];
		//已选中的个数
		var checkedLength = $(".shuttle-box tbody td input[name='test']:checked").length;
		//循环取得所需参数
		$(".shuttle-box tbody td input[name='test']:checked").each(function(i, b) {
			var teacherReserveId = "";
			var pkId = $(b).parents('tr').find('.shuttle-pk-id').val();
			var teacherId = $(b).parents('tr').find('.teacher-id').val();
			var teacherName = $(b).parents('tr').find('.teach-name').text();
			var phone = $(b).parents('tr').find('.teach-phone').text();
			var routeType = $(b).val();
			var flightTrainNumber = $(b).parents('tr').find('.flight-num').val();
			var address = $(b).parents('tr').find('.relay-address').val();
			var dateTime = $(b).parents('tr').find('.relay-dates').val();
			var remarks = $(b).parents('tr').find('.card-remarks').val();
			//关联订票id
			$.each(teacherReseverList, function(q, o) {
				if(o.routeType == routeType && o.teacherId == teacherId) {
					teacherReserveId = o.teacherReseverId;
					return false;
				}
			});
			var sendCarType = 1;
			var teachersList = {
				pkId: pkId,
				teacherReserveId: teacherReserveId,
				teacherId: teacherId,
				teacherName: teacherName,
				phone: phone,
				routeType: routeType,
				flightTrainNumber: flightTrainNumber,
				address: address,
				dateTime: dateTime,
				sendCarType: sendCarType,
				remarks:remarks
			};

			teachersFeederStation.push(teachersList);
		});
		teachersFeederStation = JSON.stringify(teachersFeederStation);
		console.log(teachersFeederStation);
		if(checkedLength != 0) {
			//显示整体框架loading的方法
			$yt_baseElement.showLoading();
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "class/teacher/addTeachersFeederStation",
				data: {
					projectCode: projectCode,
					teachersFeederStation: teachersFeederStation,
					businessCode: "teachersFeederStation",
					dealingWithPeople: dealingWithPeople,
					processInstanceId: processInstanceId,
					opintion: "",
					nextCode: nextCode
				},
				async: true,
				success: function(data) {
					if(data.flag == 0) {
						//隐藏整体框架loading的方法
						$yt_baseElement.hideLoading(function() {
							$yt_alert_Model.prompt("申请成功");
							caInfoList.getRelayList();
						});
					} else {
						//隐藏整体框架loading的方法
						$yt_baseElement.hideLoading(function() {
							$yt_alert_Model.prompt("申请失败");
						});
					}
				}
			});
		} else {
			$yt_alert_Model.prompt("请选择需要派车的行程");
		}

	},
	/**
	 * 获取接送站列表数据
	 */
	getRelayList: function() {
		//班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/teacher/getTeachersFeederStation",
			data: {
				projectCode: projectCode
			},
			async: true,
			success: function(data) {
				var ralayBody = $(".shuttle-box tbody");
				var phone = '';
				var lasTr;
				var rowsNum = 2;
				var routeType;
				var num=-1;
				ralayBody.empty();
				if(data.flag == 0) {
					if(data.data.teachersFeederStation != "") {
						var teachersFeederStation = $.parseJSON(data.data.teachersFeederStation);
						console.log(teachersFeederStation)
						$.each(teachersFeederStation, function(i, n) {
							num++;
							var ralayHtml = '';
							if(n.routeType != "") {
								ralayHtml += '<tr>';
								if(phone != n.teacherId) {
									ralayHtml += '<td class="teach-name" style="text-align:left;">' + n.teacherName + '</td>' +
										'<td class="teach-phone">' + n.phone + '</td>';
										//if($(".shuttle-box tbody").find('tr').eq(lasTr).hasClass("type-is-null") == false){
										//}
										phone = n.teacherId;
										lasTr = num
								} else {
									//rowsNum++;
								}
								ralayHtml += '<input type="hidden" class="shuttle-pk-id" value="' + n.pkId + '"/>' +
									'<input type="hidden" class="teacher-id" value="' + n.teacherId + '"/>';
							}
							if(n.routeType == 1) {
								ralayHtml += '<td class="routetype route-meet">' +
									'<label class="check-label yt-checkbox" style="margin-left:-26px;">' +
									' <input type="checkbox" name="test" value="' + n.routeType + '"/>' +
									'接</label></td>';
							} else if(n.routeType == 2){
								ralayHtml += '<td class="routetype route-give">' +
									'<label class="check-label yt-checkbox" style="margin-left:-26px;">' +
									' <input type="checkbox" name="test" value="' + n.routeType + '"/>' +
									'送</label></td>';
							}else if(n.routeType == ''){
								ralayHtml += '<tr class="type-is-null">'+
												  '<td class="teach-name" style="text-align:left;" rowspan="2">' + n.teacherName + '</td>' +
												  '<td class="teach-phone" rowspan="2">' + n.phone + '</td>'+
												 	 	'<input type="hidden" class="shuttle-pk-id" value="' + n.pkId + '"/>' +
												 		 '<input type="hidden" class="teacher-id" value="' + n.teacherId + '"/>'+
												  '<td class="routetype route-meet">' +
											 	  		'<label class="check-label yt-checkbox" style="margin-left:-26px;">' +
											      		' <input type="checkbox" name="test" value="1"/>' +
												  		'接</label>'+
												  '</td>'+
												  '<td class="routeinput"><input type="text" style="width:100px;" class="yt-input flight-num" placeholder="请输入" value="' + n.flightTrainNumber + '"/></td>' +
												  '<td class="routeinput"><input type="text" style="width:100px;" class="yt-input relay-address" placeholder="请输入" value="' + n.address + '"/></td>' +
												  '<td class="routeinput"><input class="calendar-input relay-dates" style="width: 150px;background-position: 131px 7px;" value="" placeholder="请选择日期" type="text" /></td>'+
												  '<td>--</td>' +
												  '<td>--</td>'+
												  '<td><input type="text" style="text-align:left" class="yt-input card-remarks" value="' + n.remarks + '" /></td>'+
											'</tr>'+
										  	'<tr class="type-is-null">'+
										  	'<input type="hidden" class="shuttle-pk-id" value="' + n.pkId + '"/>' +
											'<input type="hidden" class="teacher-id" value="' + n.teacherId + '"/>'+
												  '<td class="routetype route-give">' +
														'<label class="check-label yt-checkbox" style="margin-left:-26px;">' +
														' <input type="checkbox" name="test" value="2"/>' +
													    '送</label>'+
											      '</td>'+
												  '<td class="routeinput"><input type="text" style="width:100px;" class="yt-input flight-num" placeholder="请输入" value="' + n.flightTrainNumber + '"/></td>' +
												 '<td class="routeinput"><input type="text" style="width:100px;" class="yt-input relay-address" placeholder="请输入" value="' + n.address + '"/></td>' +
												 '<td class="routeinput"><input class="calendar-input relay-dates" style="width: 150px;background-position: 131px 7px;" value="" placeholder="请选择日期" type="text" /></td>'+
												 '<td>--</td>' +
												 '<td>--</td>'+
												 '<td><input type="text" style="text-align:left" class="yt-input card-remarks" value="' + n.remarks + '" /></td>'+
											'</tr>';
											num++;
								ralayHtml = $(ralayHtml).data('data',n);
								ralayBody.append(ralayHtml);
								
							};
							if(n.routeType != "") {
								n.dates == '0000-00-00 00:00'?n.dates='':n.dates=n.dates;
								ralayHtml += '<td class="routeinput"><input type="text" style="width:100px;" class="yt-input flight-num" placeholder="请输入" value="' + n.flightTrainNumber + '"/></td>' +
									'<td class="routeinput"><input type="text" style="width:100px;" class="yt-input relay-address" placeholder="请输入" value="' + n.address + '"/></td>' +
									'<td class="routeinput"><input class="calendar-input relay-dates" style="width: 150px;background-position: 131px 7px;" value="' + n.dates + '" placeholder="请选择日期" type="text" /></td>';
								if(n.sendCarType == 1) {//sendCarType:1:派车2:已派车,前台传到后台的值为1
									ralayHtml += '<td style="color:#ff9600;">派车中</td>' +
										'<td style="color:#ff9600;">派车中</td>'+
										'<td>' + n.remarks + '</td>'+
										'</tr>';
								} else if(n.sendCarType == 2) {
									ralayHtml += '<td>' + n.car + '</td>' +
										'<td>' + n.driver + '</td>'+
										'<td>' + n.remarks + '</td>'+
										'</tr>';
								} else {
									ralayHtml += '<td>--</td>' +
												'<td>--</td>'+
												'<td><input type="text" style="text-align:left" class="yt-input card-remarks" value="' + n.remarks + '" /></td>'+
												'</tr>';
												
								}
								ralayHtml = $(ralayHtml).data('data',n);
								ralayBody.append(ralayHtml);
								$(".shuttle-box tbody").find('tr').eq(lasTr).find('td').eq(0).attr('rowspan', rowsNum);
								$(".shuttle-box tbody").find('tr').eq(lasTr).find('td').eq(1).attr('rowspan', rowsNum);
							};
						});
						$.each($('.routetype'),function(x,y){
							if($(y).parents('tr').data('data').sendCarType!=''){
								$(y).css('height','28px')
								$.each($(y).parents('tr').find('.routeinput'), function(a,b) {
									$(b).append('<span style="font-size:14px;float:left;margin-left:10px;"></span>');
									$(b).find('input').siblings('span').text($(b).find('input').val());
									$(b).find('input').hide();
								});
							}
						})
						//已派车中，点击提示
						$('.routetype input[type=checkbox]').off('change').on('change',function(){
						if($(this).parents('tr').data('data').sendCarType==1){
							$yt_alert_Model.prompt('该记录已经申请派车，请选择其他记录');
							$(this).removeAttr("checked");
						}
						})
					}

					$(".relay-dates").calendar({
						speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
						complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
						readonly: true, // 目标对象是否设为只读，默认：true     
						nowData: false, //默认选中当前时间,默认true  
						dateFmt: "yyyy-MM-dd HH:mm"
					});
					/** 
					 * 调用算取div显示位置方法 
					 */
					$yt_alert_Model.setFiexBoxHeight($(".shuttle-box .yt-edit-alert-main"));
					$yt_alert_Model.getDivPosition($(".shuttle-box"));
					console.log("接送站查询成功");
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading();
				} else {
					var ralayHtml = '';
					ralayHtml = '<tr>' +
						'<td colspan="9" align="center" style="border:0px;">' +
						'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
						'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
						'</div>' +
						'</td>' +
						'</tr>';
					ralayBody.append(ralayHtml);
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading();
				}
			}
		});
	},
	projectName:'',
	/**
	 * 获取班级信息
	 */
	getPlanListInfo: function() {
		var me = this;
		var projectCode = $yt_common.GetQueryString("projectCode");
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/getBeanByProjectCode",
			async: true,
			data: {
				projectCode: projectCode
			},
			objName: 'data',
			success: function(data) {
				if(data.flag == 0) {
					me.projectName = data.data.projectName;
					if(data.data.projectType == 1) {
						data.data.projectType = "调训";
					} else if(data.data.projectType == 2) {
						data.data.projectType = "委托";
					} else if(data.data.projectType == 3) {
						data.data.projectType = "选学";
						$('.entrust-compay-div').hide();
						$('.tab-content.entrust-info').hide()
					} else if(data.data.projectType == 4) {
						data.data.projectType = "中组部调训";
					} else if(data.data.projectType == 5) {
						data.data.projectType = "国资委调训";
					}
					$(".project-pk-id").val(data.data.projectId);
					$('.project-code').text(data.data.projectCode);
					$('.project-name').text(data.data.projectName);
					$('.project-type').text(data.data.projectType);
					$('.project-sell').text(data.data.projectSell);
					$('.start-date').text(data.data.startDate);
					$('#start-date').val(data.data.startDate);
					$('.end-date').text(data.data.endDate);
					$('#end-date').val(data.data.endDate);
					$('.details').text(data.data.details);
					$('.train-date').text(data.data.trainDate);
					$('.customer-unit').text(data.data.customerUnit);
					$('.customer-dept').text(data.data.customerDept);
					$('.customer-linkman').text(data.data.customerLinkman);
					$('.customer-linkman-position').text(data.data.customerLinkmanPosition);
					$('.customer-linkman-phone').text(data.data.customerLinkmanPhone);
					$('.customer-linkman-cellphone').text(data.data.customerLinkmanCellphone);
					$('.customer-linkman-fax').text(data.data.customerLinkmanFax);
					$('.customer-linkman-email').text(data.data.customerLinkmanEmail);
					$('.customer-trainee-position').text(data.data.customerTraineePosition);
					$('.customer-trainee-sum').text(data.data.customerTraineeSum);
					$('.customer-trainee-age-structure').text(data.data.customerTraineeAgeStructure);
					$('.customer-target-demand').text(data.data.customerTargetDemand);
					$('.project-head').text(data.data.projectHead);
					$('.class-teacher').text(data.data.classTeacher);
					$('.project-aid').text(data.data.projectAid);
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}
			}
		});
	},
	/**
	 * 授课教师列表
	 */
	getTeacherListInfo: function() {
		var projectCode = $yt_common.GetQueryString("projectCode");
		var searchParameters = "";
		$('.teacher-div .tab-content .teacher-table thead label input').setCheckBoxState('uncheck');
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "class/teacher/lookForAll", //ajax访问路径  
			data: {
				pageIndexs: 1,
				pageNum: 100000, //每页显示条数  
				searchParameters: searchParameters,
				projectCode: projectCode,
			}, //ajax查询访问参数
			async: false,
			objName: 'data', //指获取数据的对象名称  
			before: function() {
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.teacher-div .teacher-list-div .teacher-table .teacher-list-tbody').empty();
					var htmlTr = '';
					if(data.data.rows.length > 0) {
						$.each(data.data.rows, function(i, v) {
							if(v.dollarsStandard!=""){
								var str="元";
								var harfMoney=v.dollarsStandard.split(",")[0];
								harfMoney=harfMoney.substring(0,harfMoney.indexOf(str));
								var oneMoney=v.dollarsStandard.split(",")[1];
								oneMoney=oneMoney.substring(0,oneMoney.indexOf(str));
							}else{
								var harfMoney="";
								var oneMoney="";
							}
							htmlTr = '<tr class="teacher-tr">' +
								'<td style="position: relative;">' + '<label class="check-label yt-checkbox select-teacher-checkbox"><input type="checkbox" name="test" class="select-teacher-pkId" value="' + v.pkId + '"/></label><div class="checkbox-top">' + '</td>' +
								'<td style=""><a class="yt-link real-name" style="color:#3c4687;">' + v.realName + '</a></td>' +
								'<td>' + (v.gender == 1 ? "男" : "女") + '</td>' +
								'<td class="teacher-phone">' + v.phone + '</td>' +
								'<td style="text-align:left;">' + v.org + '</td>' +
								'<td style="text-align:center;">' + v.title + '</td>' +
								'<td style="text-align:center;">' + v.researchArea + '</td>' +
								'<td class="tr">' + harfMoney + '</td>' +
								'<td class="tr">' + oneMoney + '</td>' +
								'<td>' + (v.teacherStates == 1 ? "可用" : "已用") + '</td>' +
								'</tr>';
							htmlTr = $(htmlTr).data('courseName', v.courseName);
							htmlTbody.append(htmlTr);
						});
						//点击当前行选中当前行并且复选框被勾选
						$(".teacher-div .teacher-table .teacher-list-tbody tr").unbind().bind("click", function() {
							if($(this).find("input[type='checkbox']")[0].checked == true) {
								$(this).find("input[type='checkbox']").setCheckBoxState("uncheck");
								$(this).removeClass("yt-table-active");
							} else {
								$(this).find("input[type='checkbox']").setCheckBoxState("check");
								$(this).addClass("yt-table-active");
							}
							if($(this).parents("table").find("tbody input[type='checkbox']").length != $(this).parents("table").find("tbody input[type='checkbox']:checked").length) {
								$(this).parents("table").find(".check-all").setCheckBoxState("uncheck");
							} else {
								$(this).parents("table").find(".check-all").setCheckBoxState("check");
							}
						});
					} else {
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="10" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						htmlTbody.html(htmlTr);
					}
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}

			}	
		});
	},
	/**
	 * 获取授课教师列表查询
	 */
	selectTeacherListInfo: function(searchParameters) {
		var projectCode = $yt_common.GetQueryString("projectCode");
		$('.select-teacher-div thead label input').setCheckBoxState('unckeck');
		$('div.teacher-page').pageInfo({
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			url: $yt_option.base_path + "class/teacher/getTeachers", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				searchParameters: searchParameters,
				projectCode: projectCode
			}, //ajax查询访问参数
			async: true,
			after:function(){
				//点击当前行选中当前行并且复选框被勾选
				$(".select-teacher-div .select-teacher-table tbody tr").unbind().bind("click", function() {
					if($(this).find("input[type='checkbox']")[0].checked == true) {
						$(this).find("input[type='checkbox']").setCheckBoxState("uncheck");
						$(this).removeClass("yt-table-active");
					} else {
						$(this).find("input[type='checkbox']").setCheckBoxState("check");
						$(this).addClass("yt-table-active");
					}
					if($(this).parents("table").find("tbody input[type='checkbox']").length != $(this).parents("table").find("tbody input[type='checkbox']:checked").length) {
						$(this).parents("table").find(".check-all").setCheckBoxState("uncheck");
					} else {
						$(this).parents("table").find(".check-all").setCheckBoxState("check");
					}
				});
			},
			before: function() {
				//显示整体框架loading的方法
				$yt_baseElement.showLoading();
			},
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.select-teacher-table .select-teacher-tbody');
					var htmlTr = '';
					htmlTbody.empty();
					if(data.data.rows.length > 0) {
						$('.teacher-page').show();
						$.each(data.data.rows, function(i, v) {
							if(v.gender == 1) {
								v.gender = "男";
							} else {
								v.gender = "女";
							}
							if(v.teacherStates == 1) {
								v.teacherStates = "可用";
							} else {
								v.teacherStates = "已用";
							}
							if(v.dollarsStandard!=""){
								var str="元";
								var harfMoney=v.dollarsStandard.split(",")[0];
								harfMoney=harfMoney.substring(0,harfMoney.indexOf(str));
								var oneMoney=v.dollarsStandard.split(",")[1];
								oneMoney=oneMoney.substring(0,oneMoney.indexOf(str));
								console.log("harfMoney",harfMoney,'oneMoney',oneMoney);
							}else{
								var harfMoney="";
								var oneMoney="";
							}
							htmlTr = '<tr>' +
								'<td><label class="check-label yt-checkbox select-teacher-alert-checkbox"><input type="checkbox" name="test" class="select-teacher-pkId" value="' + v.pkId + '"/></label></td>' +
								'<input type="hidden" value="' + v.pkId + '" class="pkid">' +
								'<td><div><a class="yt-link real-name" style="color:#3c4687;">' + v.realName + '</a></div></td>' +
								'<td>' + v.gender + '</td>' +
								'<td>' + v.phone + '</td>' +
								'<td style="text-align:left;">' + v.org + '</td>' +
								'<td style="text-align:left;">' + v.title + '</td>' +
								'<td style="text-align:left;">' + v.researchArea + '</td>' +
								'<td style="text-align:right;">' + harfMoney + '</td>' +
								'<td style="text-align:right;">' + oneMoney + '</td>' +
								'<td style="text-align:right;">' + v.grade + '</td>' +
								'<td>' + v.teacherStates + '</td>' +
								'</tr>';
							htmlTbody.append(htmlTr);
						});
						
					} else {
						$('.teacher-page').hide();
						htmlTr = '<tr>' +
							'<td colspan="11" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						htmlTbody.append(htmlTr);
						
					}
					//计算弹出框位置
					//显示选择教师弹出框
					$(".select-teacher-div").show();
					$yt_alert_Model.setFiexBoxHeight($(".select-teacher-div .yt-edit-alert-main"));
					$yt_alert_Model.getDivPosition($(".select-teacher-div"));
					$yt_model_drag.modelDragEvent($(".select-teacher-div .yt-edit-alert-title"));
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}
			},
			error:function(){
				$yt_alert_Model.prompt('网络异常，稍后重试');
			}
		});
	},
	//选择教师
	selectTeacher: function(pkId) {
		var projectCode = $yt_common.GetQueryString("projectCode");
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/teacher/addTeachers", //ajax访问路径  
			async: true,
			data: {
				projectCode: projectCode,
				pkId: pkId,
			},
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt("添加教师成功");
					$(".yt-edit-alert,#heard-nav-bak").hide();
					caInfoList.getTeacherListInfo();
				} else {
					$yt_alert_Model.prompt("添加教师失败");
				}
			} //回调函数 匿名函数返回查询结果  
		});
	},
	//移除教师
	deleteTeacher: function(pkId) {
		var projectCode = $yt_common.GetQueryString("projectCode");
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/teacher/deleteTeachers", //ajax访问路径  
			async: false,
			data: {
				projectCode: projectCode,
				pkId: pkId,
			},
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt("移除教师成功");
					caInfoList.getTeacherListInfo();
				} else {
					$yt_alert_Model.prompt("移除教师失败");
				}
			} //回调函数 匿名函数返回查询结果  
		});
	},

	//订票
	getTicket: function() {
		var projectCode = $yt_common.GetQueryString("projectCode");
		var teachersReseveArr = [];
		$(".teacher-ticket-div .ticket-teacher-tbody tr").each(function(i, n) {
			var pkId = $(n).find('.teacher-pk-id').val()
			if(pkId == "0") {
				pkId = "";
			}
			var teacherId = $(n).find('.teacher-id').val();
			var routeType = $(n).find('.route-type').val();
			var flightTrainNumber = $(n).find('.flight-train-number').val();
			var placeDeparture = $(n).find('.place-departure').val();
			var goOff = $(n).find('.go-off').val();
			var bourn = $(n).find('.bourn').val();
			var arrivalTime = $(n).find('.arrival-time').val();
			var fares = $(n).find('.fares').val();
			var changeFeeRefund = $(n).find('.change-fee-refund').val();
			var remarks = $(n).find('.remarks').val();
			var states = 1;
			var teachersReseveList = {
				pkId: pkId,
				teacherId: teacherId,
				routeType: routeType,
				types: 1,
				flightTrainNumber: flightTrainNumber,
				placeDeparture: placeDeparture,
				goOff: goOff,
				bourn: bourn,
				arrivalTime: arrivalTime,
				fares: fares,
				changeFeeRefund: changeFeeRefund,
				states: states,
				remarks:remarks
			};
			teachersReseveArr.push(teachersReseveList);
		});
		console.log(teachersReseveArr);
		var teachersReseve = JSON.stringify(teachersReseveArr);
		console.log("订票数据", teachersReseve);
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			url: $yt_option.base_path + "class/teacher/addTeachersReseve", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				projectCode: projectCode,
				teachersReseve: teachersReseve
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					console.log(data);
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("订票成功");
					});
				} else {
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("订票失败");
					});
				}
			}
		});

	},
	//获取教师订票数据
	
	getTicketList: function() {
		var projectCode = $yt_common.GetQueryString("projectCode");
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			url: $yt_option.base_path + "class/teacher/getTeachersReseve", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				projectCode: projectCode
			}, //ajax查询访问参数
			success: function(data) {
				var rowspanNum = 1;
				var lastOr;
				var teacherPhone;
				var routeType;
				if(data.flag == 0) {
					console.log(data);
					var teachersReseve = $.parseJSON(data.data.teachersReseve);
					var htmlTbody = $('.select-ticket-div .ticket-teacher-tbody');
					htmlTbody.empty();
					if(teachersReseve != null) {
						$.each(teachersReseve, function(i, v) {
							if(v.routeType == 1) {
								routeType = "来院";
							} else {
								routeType = "返程";
							}
							var htmlTr = '';
							htmlTr += '<tr>';
							if(teacherPhone != v.teacherId) {
								$('.select-ticket-div .ticket-teacher-tbody tr').eq(lastOr).find('td').eq(0).attr('rowspan', rowspanNum);
								$('.select-ticket-div .ticket-teacher-tbody tr').eq(lastOr).find('td').eq(1).attr('rowspan', rowspanNum);
								teacherPhone = v.teacherId;
								lastOr = i;
								htmlTr += '<td class="teacherName" style="text-align:left;">' + v.teacherName + '</td>' +
									'<td class="phone">' + v.phone + '</td>';
								rowspanNum = 1;
							} else {
								rowspanNum++;
							}
							v.goOff=='0000-00-00 00:00'?v.goOff='':v.goOff=v.goOff;
							$('.select-ticket-div .ticket-teacher-tbody tr').eq(lastOr).find('td').eq(0).attr('rowspan', rowspanNum);
							$('.select-ticket-div .ticket-teacher-tbody tr').eq(lastOr).find('td').eq(1).attr('rowspan', rowspanNum);
							htmlTr += '<input type="hidden" class="teacher-id" value="' + v.teacherId + '" />' +
								'<input type="hidden" class="teacher-pk-id" value="' + v.pkId + '" />' +
								'<input type="hidden" class="teacher-phone" value="' + v.phone + '" />' +
								'<td><input type="hidden" class="route-type" value="' + v.routeType + '" />' + routeType + '</td>' +
								'<td><input type="hidden" class="types" value="' + v.types + '" />订票</td>' +
								'<td><input type="text" class="yt-input flight-train-number" value="' + v.flightTrainNumber + '" /></td>' +
								'<td><input type="text" class="yt-input place-departure" value="' + v.placeDeparture + '" /></td>' +
								'<td><input class="calendar-input go-off" style="width: 140px;background-position: 130px 7px;" value="' + v.goOff + '" placeholder="请选择日期" type="text" /></td>' +
								'<td><input type="text" class="yt-input bourn" value="' + v.bourn + '" /></td>' +
								'<td><input class="calendar-input arrival-time" style="width: 140px;background-position: 130px 7px;" value="' + v.arrivalTime + '" placeholder="请选择日期" type="text" /></td>' +
								'<td><input type="number" style="text-align:right" class="yt-input fares" value="' + v.fares + '" /></td>' +
								'<td><input type="number" style="text-align:right" class="yt-input change-fee-refund" value="' + v.changeFeeRefund + '" /></td>' +
								'<td><input type="text" style="text-align:left" class="yt-input remarks" value="' + v.remarks + '" /></td>' +
								'</tr>';
							htmlTbody.append(htmlTr);
						});
						$.each(htmlTbody.find('tr'), function() {
							$(this).find(".go-off").calendar({
								speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
								dateFmt: "yyyy-MM-dd HH:mm",
								nowData: true,
								complement: true,
								upperLimit:$(this).find(".arrival-time")
							});
							$(this).find(".arrival-time").calendar({
								speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
								dateFmt: "yyyy-MM-dd HH:mm",
								nowData: true,
								complement: true,
								lowerLimit:$(this).find(".go-off")
							});
						});
						
						$.each(teachersReseve, function(i, v) {
							$(".go-off").eq(i).val(v.goOff);
							$(".arrival-time").eq(i).val(v.arrivalTime);
						});
						$yt_alert_Model.setFiexBoxHeight($(".select-ticket-div .yt-edit-alert-main"));
						$yt_alert_Model.getDivPosition($(".select-ticket-div"));
						//隐藏整体框架loading的方法
						$yt_baseElement.hideLoading();
					} else {
						htmlTr = '<tr>' +
							'<td colspan="11" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						htmlTbody.append(htmlTr);
						$yt_alert_Model.setFiexBoxHeight($(".select-ticket-div .yt-edit-alert-main"));
						$yt_alert_Model.getDivPosition($(".select-ticket-div"));
						//隐藏整体框架loading的方法
						$yt_baseElement.hideLoading(function() {
							$yt_alert_Model.prompt("请先选择教师");
						});
					}
				} else {
					var htmlTr = '';
					htmlTr = '<tr>' +
						'<td colspan="11" align="center" style="border:0px;">' +
						'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
						'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
						'</div>' +
						'</td>' +
						'</tr>';
					htmlTbody.append(htmlTr);
				}
			}
		});

	}
}
/**
 * 课程详细信息
 */
var courseManager = {
	init: function() {
		var me = this;
		//课程新增修改的日期控件初始化
//			$(".course-date").val($("#start-date").val())
			$(".course-date").calendar({
		        controlId: "courseDate",
		        speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
		        complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
		        readonly: true, // 目标对象是否设为只读，默认：true   
		        nowData: false, //默认选中当前时间,默认true  
		        upperLimit:$("#end-date").val().replace(/-/g,'/'),//最大日期为当前班级培训结束日期
		        lowerLimit:$("#start-date"),//最小日期当前班级培训开始日期
		        dateFmt: "yyyy-MM-dd",
		        callback: function() { // 点击选择日期后的回调函数  
		          if ($(".course-date").val() != "") {//日期框不为空隐藏验证提示框和提示文字
		          	$(".course-date").removeClass("valid-hint");
		          	$(".course-date").next().text("");
		          };
		        }
		    });
		$(".course-date").click(function(){
			if($(".course-date").val()==''){
//				if($('.start-date').text().split('-')[1]>(new Date().getMonth()+1)){
//					var number = $('.start-date').text().split('-')[1]-(new Date().getMonth()+1);
//					for(var i=0;i<number;i++){
//						$("#courseDate").find('.nextMonth').mouseup();
//					}
//				}else if($('.start-date').text().split('-')[1]<(new Date().getMonth()+1)){
//					var number = (new Date().getMonth()+1)-$('.start-date').text().split('-')[1];
//					for(var i=0;i<number;i++){
//						$("#courseDate").find('.prevMonth').mouseup();
//					}
//				}
				$("#courseDate").find(".currentYear").text(Number($('.start-date').text().split('-')[0]));
				$("#courseDate").find(".currentMonth").text(Number($('.start-date').text().split('-')[1]));
				$("#courseDate").find(".currentMonthText").mouseup();
				$("#courseDate .tabM a[val="+(Number($('.start-date').text().split('-')[1])-1)+"]").mouseup();
			}
		})
		//课程类别切换表单
		$("select.couse-type").change(function() {
			$(".teacher-list-selt").removeClass("valid-hint");
			$(".teacher-span").text("");
			$(".yt-input").removeClass("valid-hint");
			$(".valid-font").text("");
			//$(".add-course-box table").hide().eq(parseInt($(this).val())).show();
//				$('.add-course-box .couse-type3-no').show();
			$(".add-course-box .couse-type1,.add-course-box .couse-type2,.add-course-box .couse-type3").hide();
			if($(this).val() == "openingCeremony" || $(this).val() == "windingUp") {
				$(".add-course-box .couse-type1").show();
			} else if($(this).val() == "teachingActivities") {
				$(".add-course-box .couse-type3").show();
//				$(".add-course-box .couse-type3,.add-course-box .couse-type2").show();
//				$('.add-course-box .couse-type3-no').hide();
			} else {//专题讲座seminar和案例分享caseShare类型是教师和课程主题需要必填，分类的验证去掉
				$(".add-course-box .couse-type2").show();
			}

		});
		//课程主题联想获取焦点
		$('#courseName').focus(function(){
			courseManager.assCourseNameList()
			$('.courseNameList').show();
			$('#courseName').off('keydown').keydown(function(event){
				if(event.keyCode=="38"){
					//上键
					if($('.hoverAction')[0]){
						var index = $('.hoverAction').index();
						if(index==0){
							index=$(".courseNameList li").length-1;
							$('.courseNameList').scrollTop($(".courseNameList li").eq($(".courseNameList li").length-1).offset().top);
						}else{
							index=index-1
						}
						$(".courseNameList li").eq(index).addClass('hoverAction').siblings().removeClass('hoverAction')
					}
					if($('.hoverAction').offset().top-$('.courseNameList').offset().top<90){
						$('.courseNameList').scrollTop($('.courseNameList').scrollTop()-30);
					}
					return false;
				}else if(event.keyCode=="40"){
					//下键
					if($('.hoverAction')[0]){
						var index = $('.hoverAction').index();
						if(index==$(".courseNameList li").length-1){
							index=0;
							$('.courseNameList').scrollTop(0);
						}else{
							index=index+1
						}
						$(".courseNameList li").eq(index).addClass('hoverAction').siblings().removeClass('hoverAction')
					}else{
						$(".courseNameList li").eq(0).addClass('hoverAction')
					}
					if($('.hoverAction').offset().top-$('.courseNameList').offset().top>90){
						$('.courseNameList').scrollTop($('.courseNameList').scrollTop()+30);
					}
					return false;
				}else if(event.keyCode=="13"||event.keyCode=="108"){
					//回车
						$('#courseName').val($('.hoverAction').text())
						$('#courseName').blur();
						return false;
				}
			})
			return false;
		})
		$(".courseNameList").on('mousedown','li',function(){
			$('#courseName').val($(this).text());
			$("#courseName").removeClass("valid-hint");
			$("#courseName").siblings('.valid-font').text("");
		})
		//课程主题联想失去焦点
		$('#courseName').blur(function(){
			setTimeout(function(){
				$('.courseNameList').hide();
			},100);
		})
		//实时监听课程主题
		$('#courseName')[0].oninput = function(){
			courseManager.assCourseNameList()
		}
		$(".teacher-list-selt").change(function(){
			if($(".teacher-list-selt").val() != "") {
				$(".teacher-list-selt").removeClass("valid-hint");
				$(".teacher-span").text("");
				courseManager.getCourseNameList();
			}
		});
		//新增课程按钮
		$(".add-couse-btn").off('click').click(function() {
			$(".recept-pkid").val("");
			$(".cource-cont-box").show();
			$(".cource-btn").show();
			$(".recept-box").hide();
			$(".recept-btn").hide();
			$('.newCourseFileSpan,.haveCourseFileSpan').hide();
			$("[name='receptCource']:eq(0)").setRadioState("check");
			$(".coure-recept-check-box").show();
			$(".reception-sure-continue").show();
			$(".sure-continue").show();
			$(".sure-continue").val("确定并继续");
			$(".add-course-box .yt-edit-alert-title-msg").text("新增课程");
			//初始化上课时间
			$("[name='giveType']:eq(0)").setRadioState("check");
			$(".add-course-box .start-time").timespinner('setValue', "08:30");
			$(".add-course-box .end-time").timespinner('setValue', "11:30");
			//初始化类型
			var openingCeremony = $("select.couse-type option:eq(0)").val();
			$(".couse-type").setSelectVal(openingCeremony);
			$(".couse-type2").hide();
			$(".couse-type1").show();
			$(".valid-font").text("");
			$(".select-file-btn").val("").removeData();
			$(".valid-hint").removeClass("valid-hint");
			$(".select-file-btn").css("visibility", "visible");
			$(".upload-file-btn").css("visibility", "hidden").prev().css("visibility", "hidden");
			$("[name='fileType']:eq(0)").setRadioState("check");
			$("[name='isNeedGroupPhoto']:eq(0)").setRadioState("check");
			$('.haveCourseFileUl').empty();
			$('.newCourseFileUl').empty();
			$(".upload-file-btn").val("").removeData("fileInfo");
			$("input[name='courseName']").val("");
			me.getTeacherList();

			/** 
			 * 显示编辑弹出框和显示顶部隐藏蒙层 
			 */
			$(".add-course-box").show();
			/** 
			 * 调用算取div显示位置方法 
			 */
			$yt_alert_Model.getDivPosition($(".add-course-box"));
			$($(".add-course-box")).css("top","40px");
			/* 
			 * 调用支持拖拽的方法 
			 */
			$yt_model_drag.modelDragEvent($(".add-course-box .yt-edit-alert-title"));
			/** 
			 * 点击取消方法 
			 */
			$('.add-course-box .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
				//隐藏页面中自定义的表单内容  
				$(".add-course-box").hide();
			});

			//新增课程方法
			$(".add-course-box .sure-continue").off().on("click", function() {
				//专题讲座seminar和案例分享caseShare类型是教师和课程主题需要必填，分类的验证去掉
				if($(".couse-type").val() == "seminar" || $(".couse-type").val() == "caseShare"){
					if ($(".teacher-list-selt").val() != "") {
						me.editCouseInfo(true);
					}else{
						$(".teacher-list-selt").addClass("valid-hint");
						$(".teacher-span").text("教师不能为空,请选择教师!");
					}
				}else{
					me.editCouseInfo(true);
				}
				
			});
			//新增课程确定按钮
			$(".yt-model-bot-btn.sure-close").off().on('click', function() {
				if($(".couse-type").val() == "seminar" || $(".couse-type").val() == "caseShare"){
					if ($(".teacher-list-selt").val() != "") {
						me.editCouseInfo(true);
					}else{
						$(".teacher-list-selt").addClass("valid-hint");
						$(".teacher-span").text("教师不能为空,请选择教师!");
					}
				}else{
					me.editCouseInfo(true);
				}
				if($("#courseName").val() != '' && $(".course-date").val() != '' && $("#courseName").val().length<=50 ) {//课程名和上课日期都不能为空
					$(".add-course-box").hide();
				}
			});
//---------------------
			//接待活动
			//调用人员数据
			courseManager.getAllDeptAndUser();
		});
		$(".cource-check").click(function(){//选择新增课程
			$("[name='receptCource']:eq(0)").setRadioState("check");
			$(".cource-recept-title").text("新增课程");
			$(".cource-cont-box").show();//显示新增课程内容弹窗
			$(".cource-btn").show();
			$(".recept-box").hide();//隐藏新增接待活动内容弹窗
			$(".recept-btn").hide();
			
		});
		$(".recept-check").click(function(){//选择新增接待活动
			$(".all-User-div").empty();
			$("[name='receptCource']:eq(1)").setRadioState("check");
			$(".cource-recept-title").text("新增接待活动");
			$(".cource-cont-box").hide();//隐藏新增课程内容弹窗
			$(".cource-btn").hide();
			$(".recept-box").show();//显示新增接待活动内容弹窗
			$(".recept-btn").show();
			$(".reception-sure-continue").show();
			$(".reception-sure-continue").val("确定并继续")
		});
		//删除课程日程附件
		$(".courseFileUl").on("click",'.delFile',function(){
			var newCourse = $(this).parents('td').find('.newCourseFileUl');
			var haveCourse = $(this).parents('td').find('.haveCourseFileUl');
			$(this).parents('li').remove();
			if($(newCourse).find('li').length==0){
				$('.newCourseFileSpan').hide();
			}
			if($(haveCourse).find('li').length==0){
				$('.haveCourseFileSpan').hide();
			}
		})
		//更改是否公开
		$(".courseFileUl").on("click",'.file-true',function(){
			$(this).attr('class','file-false').html('<img src="../../resources/images/icons/fileHidden.png">不公开');
			$(this).parents('li').data('data').isOpen=2;
		})
		$(".courseFileUl").on("click",'.file-false',function(){
			$(this).attr('class','file-true').html('<img src="../../resources/images/icons/fileShow.png">公开');
			$(this).parents('li').data('data').isOpen=1;
		})
		//上传按钮
		$(".upload-file-box").undelegate().delegate("input.upload-file-btn", "change", function() {
			var addFile = $(this).attr("id");
			$yt_baseElement.showLoading();
			var url = $yt_option.acl_path + "api/tAscPortraitInfo/addFile?modelCode=couseFile";
			$.ajaxFileUpload({
				url: url,
				type: "post",
				dataType: 'json',
				fileElementId: addFile,
				success: function(data, textStatus) {
					var resultData = $.parseJSON(data);
					if(resultData.success == 0) {
						$yt_baseElement.hideLoading(function() {
							resultData.obj.types=2;
							resultData.obj.isOpen=1;
							$('.newCourseFileSpan').show();
							$('.newCourseFileUl').append($('<li><span class="file-true"><img src="../../resources/images/icons/fileShow.png">公开</span><label>'+resultData.obj.naming+'</label><span class="delFile" style="color:red">×</span></li>').data('data',resultData.obj))
//							$("#" + addFile).prev().val(resultData.obj.naming).data("fileInfo", resultData.obj);
							$yt_alert_Model.prompt("附件上传成功");
						});

					} else {
						$yt_baseElement.hideLoading(function() {
							$yt_alert_Model.prompt("附件上传失败");
						});
					}

				},
				error: function(data, status, e) { //服务器响应失败处理函数  
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("附件上传失败");
					});
				}
			});
		});
		//附件类型改变事件
		$("input[name='fileType']").change(function() {
			$(this).parent().nextAll().css("visibility", "visible");
			$(this).parents("table").find("input[name='fileType']:not(:checked)").parent().nextAll().css("visibility", "hidden");
		});
		//时间改变事件
		$(".add-course-box input[name='giveType']").change(function() {
			//8:30 11:30
			//2:00 5:00
			//6:00 9:00
			var startTime = "";
			var endTime = "";
			if($(this).val() == "1") {
				startTime = "08:30";
				endTime = "11:30";
			} else if($(this).val() == "2") {
				startTime = "14:00";
				endTime = "17:00";
			} else {
				startTime = "18:00";
				endTime = "21:00";
			}
			$(".add-course-box .start-time").timespinner('setValue', startTime);
			$(".add-course-box .end-time").timespinner('setValue', endTime);
		});
		//修改课程按钮
		$(".update-couse-btn").off('click').click(function() {
			if($("input[name='couseCheck']:checked").length>0&&$(".reception-list-tbody").find(".yt-table-active").length>0){
				$yt_alert_Model.prompt("请选择一条进行修改");
				return false;
			}else if($("input[name='couseCheck']:checked").length == 0) {
				if ($(".reception-list-tbody").find(".yt-table-active").length != 0) {
					$(".cource-recept-title").text("修改接待活动");
					$(".reception-sure-continue").hide();
					//获取人员树形数据
					courseManager.getAllDeptAndUser();
					if ($(".reception-type").val() != 1) {
						$('.reception-type').setSelectVal(1);
					} 
					$(".all-User-div").empty();
					$("reception-date").calendar();
					$(".reception-address").val("");
					$(".reception-other-person").val("");
					$(".reception-flow").val("");
					var receptTrTd = $(".reception-list-tbody").find(".yt-table-active td");
					/** 
					 * 显示编辑弹出框和显示顶部隐藏蒙层 
					 */
					$(".add-course-box").show();
					/** 
					 * 调用算取div显示位置方法 
					 */
					$yt_alert_Model.getDivPosition($(".add-course-box"));
					/* 
					 * 调用支持拖拽的方法 
					 */
					$yt_model_drag.modelDragEvent($(".add-course-box .yt-edit-alert-title"));
					/** 
					 * 点击取消方法 
					 */
					$('.add-course-box .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
						//隐藏页面中自定义的表单内容  
						$(".add-course-box").hide();
					});
					
					$(".coure-recept-check-box").hide();
					$(".cource-cont-box").hide();//显示新增课程内容弹窗
					$(".cource-btn").hide();
					$(".recept-box").show();//隐藏新增接待活动内容弹窗
					$(".recept-btn").show();
					
					if ($(".reception-type").val() != 1) {
						$('.reception-type').setSelectVal($(receptTrTd).eq(0).find(".types").val());
					} 
					var leadName = $(receptTrTd).eq(1).text();
					var leadCode = $(receptTrTd).eq(1).find(".user-code").val();
					leadName = leadName.split("、");
					leadCode = leadCode.split(",");
					var leaDiv = $(".all-User-div");
					$.each(leadName,function(t,d){
						$(".all-User-div").children().length>0
						if (t==0) {
							leaDiv.append('<span username="'+leadCode[t]+'">'+d+'</span>');
						}else{
							leaDiv.append(','+'<span username="'+leadCode[t]+'">'+d+'</span>');
						}
					});
					$(".reception-date").val($(receptTrTd).eq(2).text());
					$(".reception-address").val($(receptTrTd).eq(4).text());
					$(".reception-other-person").val($(receptTrTd).eq(5).text());
					$(".reception-flow").val($(receptTrTd).eq(6).text());
					$(".recept-pkid").val($(receptTrTd).eq(0).find(".pk-id").val());
					
				} else{
					$yt_alert_Model.prompt("请选择一条记录进行修改");
				}
				
			}else if($("input[name='couseCheck']:checked").length >1 ){
				$yt_alert_Model.prompt("请选择一条记录进行修改");
			}else if(nowdate>thisdate){
				$yt_alert_Model.prompt("不可修改已上课程");
				return false;
			}else {//课程日程列表选中行数为1
				$(".cource-recept-title").text("修改课程");
				var nowdate = new Date();
				var thisdate = new Date($(".course-list-tbody input[type=checkbox]:checked").parents('tr').data("couseInfo").courseDate+' 23:00:00');
				$(".coure-recept-check-box").hide();
				$(".cource-cont-box").show();//显示新增课程内容弹窗
				$(".cource-btn").show();
				$(".recept-box").hide();//隐藏新增接待活动内容弹窗
				$(".recept-btn").hide();
				$('.courseFileUl').empty();
				$(".sure-continue").hide();
				$('.newCourseFileSpan,.haveCourseFileSpan').hide();
				$('.add-course-box .yt-model-sure-btn').val("确定");
				$(".add-course-box .yt-edit-alert-title-msg").text("修改课程");
				var couseInfo = $("input[name='couseCheck']:checked").parents("tr").data("couseInfo");
				//初始化上课时间
				$("[name='giveType'][value='" + couseInfo.giveType + "']").setRadioState("check");
				//日期初始化
				$(".course-date").val(couseInfo.courseDate);
				var giveTime = couseInfo.courseTime;
				$(".add-course-box .start-time").timespinner('setValue', giveTime.split("-")[0]);
				$(".add-course-box .end-time").timespinner('setValue', giveTime.split("-")[1]);
				//初始化类型
				var openingCeremony = couseInfo.courseTypeCode;
				$(".couse-type").setSelectVal(openingCeremony);
//				$(".add-course-box .couse-type3-no").show();
				$(".add-course-box .couse-type1,.add-course-box .couse-type2,.add-course-box .couse-type3").hide();
				if(openingCeremony == "openingCeremony" || openingCeremony == "windingUp") {
					$(".add-course-box .couse-type1").show();
				} else if(openingCeremony == "teachingActivities") {
					$(".add-course-box .couse-type3").show();
//					$(".add-course-box .couse-type3,.add-course-box .couse-type2").show();
//				$(".add-course-box .couse-type3-no").hide();
				} else {
					$(".add-course-box .couse-type2").show();
				}
				//课程主题
				$("input[name='courseName']").val(couseInfo.courseName);
				$(".valid-font").text("");
				$(".valid-hint").removeClass("valid-hint");
				var types = couseInfo.types;

				if(couseInfo.files != "") {
					var filesArr = $.parseJSON(couseInfo.files);
					$(".upload-file-btn").val("").removeData("fileInfo");
					$(".add-course-box [name='fileType']:eq(0)").setRadioState("check");
					$(".select-file-btn").css("visibility", "visible").val("");
					$(".upload-file-btn").css("visibility", "hidden").prev().css("visibility", "hidden").val("");
					if(filesArr.length > 0) {
						courseManager.courseFileList(filesArr,$(".add-course-box .select-file-btn"),$('.add-course-box .haveCourseFileUl'));
					}
					//					else {
					//						$(".add-course-box [name='fileType']:eq(1)").setRadioState("check");
					//						$(".select-file-btn").css("visibility", "hidden").val("");
					//						$(".upload-file-btn").css("visibility", "visible").prev().css("visibility", "visible").val("");
					//						if(filesArr.length > 0) {
					//							$(".upload-file-btn").prev().val(filesArr[0].fileName).data("fileInfo", {
					//								pkId: filesArr[0].fileId,
					//								naming: filesArr[0].fileName
					//							});
					//						}
					//					}
				} else {
					$(".add-course-box [name='fileType']:eq(0)").setRadioState("check");
					$(".select-file-btn").css("visibility", "visible").val("");
					$(".upload-file-btn").css("visibility", "hidden").prev().css("visibility", "hidden").val("");
				}
				me.getTeacherList();
				$("select.teacher-list-selt").setSelectVal(couseInfo.teacherId);
				courseManager.getCourseNameList();
				/** 
				 * 显示编辑弹出框和显示顶部隐藏蒙层 
				 */
				$(".add-course-box").show();
				/** 
				 * 调用算取div显示位置方法 
				 */
				$yt_alert_Model.getDivPosition($(".add-course-box"));
				/* 
				 * 调用支持拖拽的方法 
				 */
				$yt_model_drag.modelDragEvent($(".add-course-box .yt-edit-alert-title"));
				/** 
				 * 点击取消方法 
				 */
				$('.add-course-box .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
					//隐藏页面中自定义的表单内容  
					$(".add-course-box").hide();
				});
				$(".yt-input").removeClass("valid-hint");
				$(".valid-font").text("");
				//专题讲座seminar和案例分享caseShare类型是教师和课程主题需要必填
				if($(".couse-type").val() == "seminar" || $(".couse-type").val() == "caseShare") {
					$(".add-course-box .couse-type2").show();
				}
				//修改课程方法
				$(".add-course-box .yt-model-sure-btn").off().on("click", function() {
					if($(".couse-type").val() == "seminar" || $(".couse-type").val() == "caseShare"){
						if ($(".teacher-list-selt").val() != "") {
							me.editCouseInfo(false,couseInfo.pkId);
						}else{
							$(".teacher-list-selt").addClass("valid-hint");
							$(".teacher-span").text("教师不能为空,请选择教师!");
						}
					}else{
						me.editCouseInfo(false,couseInfo.pkId);
					}
				});
			}
		});
		//删除课程按钮
		$(".delete-couse-btn").click(function() {
			var nowdate = new Date();
			var deleteTabType;//标识删除的是哪个表
			var pkId;
			var deleteTabTypeText = "课程";
			if ($(".course-list-tbody input[type=checkbox]:checked").length > 0 && $(".reception-list-tbody").find(".yt-table-active").length > 0) {
				$yt_alert_Model.prompt("请选择一条记录进行删除");
				return false;
			}
			if($(".course-list-tbody input[type=checkbox]:checked").length == 1){
				var thisdate = new Date($(".course-list-tbody input[type=checkbox]:checked").parents('tr').data("couseInfo").courseDate+' 23:00:00');
			};
			if($(".course-list-tbody input[type=checkbox]:checked").length != 1) {//课程列表选中行
				if($(".course-list-tbody input[type=checkbox]:checked").length == 0) {//课程列表选中行
					if ($(".reception-list-tbody").find(".yt-table-active").length == 0) {//接待活动列表选中行
						$yt_alert_Model.prompt("请选择一条数据进行删除");
						return false;
					}else{
						deleteTabTypeText = "接待活动"
						deleteTabType = 2;
						pkId = $(".reception-list-tbody").find(".yt-table-active .pk-id").val();
					}
					
				}else{
					$yt_alert_Model.prompt("请选择一条数据进行删除");
					return false;
				}
				
			}else if(nowdate>thisdate){
				$yt_alert_Model.prompt("不可删除已上课程");
				return false;
			}
			$yt_alert_Model.alertOne({
				leftBtnName: "确定", //左侧按钮名称,默认确定  
				rightBtnName: "取消", //右侧按钮名称,默认取消  
				alertMsg: deleteTabTypeText+'数据删除将无法恢复，确认删除吗？', //提示信息  
				confirmFunction: function() { //点击确定按钮执行方法  
					if (deleteTabType == 2) {
						me.deleteRecept(pkId);
					}else{
						pkId = $(".course-list-tbody input[type=checkbox]:checked").parents('tr').data("couseInfo").pkId;
						me.deleteCouse(pkId);
					}
					
				},
			});

		});

		//选择课程日程附件信息
		$(".select-file-btn").click(function() {
			var oldBox = $(this).parents(".yt-pop-model");
			var teacherId = "";
			if($(this).parents(".add-course-box").length == 0) {
				teacherId = $("input[name='couseCheck']:checked").parents("tr").data("couseInfo").teacherId;
			} else {
				teacherId = $(".add-course-box select[name='teacherId']").val();
			}
			var me =this;
			$('.teacherFileSearchBtn').off().click(function(){
				getTeacherUploadFiles();
			})
			$('.teacherFileInput').val('');
			getTeacherUploadFiles();
			function getTeacherUploadFiles(){
				//查询教师附件信息
				$.ajax({
					type: "post",
					url: $yt_option.base_path + "class/course/getTeacherUploadFiles",
					async: true,
					data: {
						teacherId: teacherId,
						fileName:$('.teacherFileInput').val()
					},
					beforeSend:function(){
						$yt_baseElement.showLoading();
					},
					success: function(data) {
						if(data.flag == 0) {
							var htmlTbody = $(".select-file-div tbody").empty();
							var htmlTr = '';
							if(data.data.length > 0) {
								var fileArr=[];
								$.each($(me).parents('.yt-edit-alert-main').find('.haveCourseFileUl li'), function(a,b) {
									fileArr.push($(b).data('data').fileId);
								});
								$.each(data.data, function(i, n) {
									var active = '';
									fileArr.indexOf(n.fileId)!=-1?active='yt-table-active':'';
									htmlTr = $('<tr class="'+active+'"><td>' + (i + 1) + '</td><td>' + n.fileName + '</td></tr>').data("fileInfo", n);
									htmlTbody.append(htmlTr);
								});
	
								htmlTbody.find("tr").off().click(function() {
									!$(this).hasClass('yt-table-active')?$(this).addClass("yt-table-active"):$(this).removeClass("yt-table-active");
								});
	
							} else {
	
								htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
									'<td colspan="10" align="center" style="border:0px;">' +
									'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
									'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
									'</div>' +
									'</td>' +
									'</tr>';
								htmlTbody.html(htmlTr);
	
							}
							$yt_baseElement.hideLoading();
						} else {
							$yt_baseElement.hideLoading(function() {
								$yt_alert_Model.prompt("查询教师附件失败");
							});
						}
					},
					error: function(data) {
						$yt_baseElement.hideLoading(function() {
							$yt_alert_Model.prompt("查询教师附件失败");
						});
					}
				});
			}
			

			oldBox.hide();
			/** 
			 * 显示编辑弹出框和显示顶部隐藏蒙层 
			 */
			$(".select-file-div").show();
			/** 
			 * 调用算取div显示位置方法 
			 */
			$yt_alert_Model.getDivPosition($(".select-file-div"));
			/* 
			 * 调用支持拖拽的方法 
			 */
			$yt_model_drag.modelDragEvent($(".select-file-div .yt-edit-alert-title"));
			/** 
			 * 点击取消方法 
			 */
			$('.select-file-div .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
				//隐藏页面中自定义的表单内容  
				$(".select-file-div").hide();
				oldBox.show();
			});
			//选择附件选择方法
			$('.select-file-div .yt-eidt-model-bottom .yt-model-sure-btn').off().on("click", function() {
				//隐藏页面中自定义的表单内容  

				if($(".select-file-div tr.yt-table-active").length == 0) {

					$yt_alert_Model.prompt("请选择附件");
					return false;
				}
				//渲染课程日程附件列表
				var fileArr = [];
				$.each($(".select-file-div tr.yt-table-active"), function(i,n) {
					fileArr.push($(n).data('fileInfo'));
				});
				courseManager.courseFileList(fileArr,$(me),$(me).parents('.yt-edit-alert-main').find('.haveCourseFileUl'));
//				var fileInfo = $(".select-file-div tr.yt-table-active").data("fileInfo");
//				oldBox.find(".select-file-btn").val(fileInfo.fileName).data("fileInfo", {
//					pkId: fileInfo.fileId,
//					naming: fileInfo.fileName
//				});
				$(".select-file-div").hide();
				oldBox.show();
			});
		});

		//下载附件
		$(".course-list-tbody").on('click', '.file-name', function() {
			var fileUrl = $(this).attr("fileUrl");
			$.ajaxDownloadFile({
				url: fileUrl,
				yitianSSODynamicKey:$yt_common.getyitianSSODynamicKey()
			});
		});
		//课程上传附件方法
		$(".couse-file-btn").off('click').click(function() {
			if($("input[name='couseCheck']:checked").length != 1) {
				$yt_alert_Model.prompt("请选择一条数据进行修改");
			} else {
				$('.newCourseFileSpan,.haveCourseFileSpan').hide();
				$('.couse-file-box .courseFileUl').empty();
				var couseInfo = $("input[name='couseCheck']:checked").parents("tr").data("couseInfo");
				if(couseInfo.courseTypeCode != "openingCeremony" && couseInfo.courseTypeCode != "windingUp" && couseInfo.courseTypeCode != "teachingActivities") {
					$(".couse-file-box table tr:eq(0) td:eq(1)").text(couseInfo.teacherName);
					$(".couse-file-box table tr:eq(1) td:eq(1)").text(couseInfo.courseName);
					var types = couseInfo.types;
					var filesArr = $.parseJSON(couseInfo.files);

					if(filesArr != null || filesArr != "") {
						//if(types == 1) {
						if(true) {
							$(".couse-file-box [name='fileType']:eq(0)").setRadioState("check");
							$(".select-file-btn").css("visibility", "visible").val("");
							$(".upload-file-btn").css("visibility", "hidden").prev().css("visibility", "hidden").val("");
							if(filesArr && filesArr.length > 0) {
							courseManager.courseFileList(filesArr,$(".couse-file-box .select-file-btn"),$('.couse-file-box .haveCourseFileUl'));
//								$(".select-file-btn").val(filesArr[0].fileName).data("fileInfo", {
//									pkId: filesArr[0].fileId,
//									naming: filesArr[0].fileName
//								});
							}

						} else {
							$(".couse-file-box [name='fileType']:eq(1)").setRadioState("check");
							$(".select-file-btn").css("visibility", "hidden").val("");
							$(".upload-file-btn").css("visibility", "visible").prev().css("visibility", "visible").val("");
							if(filesArr && filesArr.length > 0) {
								$(".upload-file-btn").prev().val(filesArr[0].fileName).data("fileInfo", {
									pkId: filesArr[0].fileId,
									naming: filesArr[0].fileName
								});
							}
						}
					}
					/** 
					 * 显示编辑弹出框和显示顶部隐藏蒙层 
					 */
					$(".couse-file-box").show();
					/** 
					 * 调用算取div显示位置方法 
					 */
					$yt_alert_Model.getDivPosition($(".couse-file-box"));
					/* 
					 * 调用支持拖拽的方法 
					 */
					$yt_model_drag.modelDragEvent($(".couse-file-box .yt-edit-alert-title"));
					/** 
					 * 点击取消方法 
					 */
					$('.couse-file-box .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
						//隐藏页面中自定义的表单内容  
						$(".couse-file-box").hide();
					});
					//修改课程方法
					$(".couse-file-box .yt-model-sure-btn").off().on("click", function() {
						//me.editCouseInfo(couseInfo.pkId);
						me.uploadFiles();
					});
				} else {
					$yt_alert_Model.prompt("选择的课程类型不需要上传课件");
				}
			}
		});

		//选择教室
		$(".select-room").off('click').click(function() {
			if($("input[name='couseCheck']:checked").length == 0) {
				$yt_alert_Model.prompt("请选择一条数据进行修改");
			} else {
				//地点类型
				$("select.address-type").niceSelect();
				//查询教室信息
				me.getClassRooms();
				//获取课程信息
				var couseInfo = $("input[name='couseCheck']:checked").parents("tr").data("couseInfo");
				//获取上课地点信息
				$.ajax({
					type: "post",
					url: $yt_option.base_path + "class/course/getClassRoomConfig",
					async: true,
					data: {
						courseId: couseInfo.pkId
					},
					success: function(data) {
						if(data.flag == 0) {
							/** 
							 * 显示编辑弹出框和显示顶部隐藏蒙层 
							 */
							$(".select-room-box").show();

							/* 
							 * 调用支持拖拽的方法 
							 */
							$yt_model_drag.modelDragEvent($(".select-room-box .yt-edit-alert-title"));
							$yt_alert_Model.setFiexBoxHeight($('.room-form'));
							if(data.data) {

								$("select[name='courseType']").setSelectVal(data.data.courseType);

								if(data.data.courseType == 1) {
									$(".external-address").hide();
									$(".internal-address").show();
								} else {
									$(".internal-address").hide();
									$(".external-address").show();
									//初始化地图控件
									positionMap.ac.setInputValue(data.data.address);
									var longitude = parseFloat(data.data.longitude);
									var latitude = parseFloat(data.data.latitude);
									positionMap.mapObj.clearOverlays(); //清除地图上所有覆盖物
									var point = new BMap.Point(latitude, longitude);

									var myIcon = new BMap.Icon($yt_option.websit_path + "resources/images/img/blank.png", new BMap.Size(23, 25), {
										offset: new BMap.Size(10, 25), // 指定定位位置  
									});
									positionMap.marker = new BMap.Marker(point, {
										icon: myIcon
									}); // 创建标注
									positionMap.mapObj.addOverlay(positionMap.marker); // 将标注添加到地图中	
									positionMap.marker.enableDragging();
									setTimeout(function() {
										positionMap.mapObj.setCenter(point);
									}, 200)
									$(".external-address [name='placeSign'][value='" + data.data.placeSign + "']").setRadioState("check");

								}

							}

							/** 
							 * 点击取消方法 
							 */

							$('.select-room-box .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
								//隐藏页面中自定义的表单内容  
								$(".select-room-box").hide();
							});
							//修改课程方法
							$(".select-room-box .yt-model-sure-btn").off().on("click", function() {
								//me.editCouseInfo(couseInfo.pkId);
								//me.uploadFiles();
								var couseFile = {};
								//上课地点类型
								couseFile.courseType = $("select[name='courseType']").val();
								//获取班级code
								couseFile.projectCode = $yt_common.GetQueryString("projectCode");
								var pkIds = [];
								//教室是否被占用参数
								var isConflictParams = [];
								$.each($("input[name='couseCheck']:checked").parents("tr"), function(i,n) {
									pkIds.push($(n).data("couseInfo").pkId);
									$.each($(".select-room-box tbody input[type='checkbox']:checked").parents("tr"),function(x,y){
										isConflictParams.push({
											types:$(y).data('roomInfo').typeId,
											roomId:$(y).data('roomInfo').pkId,
											startTime:$(n).data("couseInfo").courseDate+" "+$(n).data("couseInfo").courseTime.split('-')[0],
											endTime:$(n).data("couseInfo").courseDate+" "+$(n).data("couseInfo").courseTime.split('-')[1]
										})
									})
								});
								console.log(isConflictParams);
								pkIds = pkIds.join(',')
								//获取课程ID
								couseFile.courseId = pkIds;
								if(couseFile.courseType == 1) {
									couseFile.placeSign = 2;
									if($(".select-room-box tbody input[type='checkbox']:checked").length == 0) {
										$yt_alert_Model.prompt("请选择教室");
										return false;
									} else {
										couseFile.classroomIds = "";
										$(".select-room-box tbody input[type='checkbox']:checked").each(function(i, n) {
											if(couseFile.classroomIds == "") {
												couseFile.classroomIds = $(n).val();
											} else {
												couseFile.classroomIds += "," + $(n).val();
											}
										});
										
										couseFile.longitude = $yt_option.longitude;
                    					couseFile.latitude = $yt_option.latitude;
										
									}
								} else {
									couseFile.address = $("#suggestId").val();
									var optionInfo = positionMap.getPosition();
									if(optionInfo == null) {
										$yt_alert_Model.prompt("请在地图中选择签到地点");
										return false;
									}
									couseFile.classroomIds="";
									couseFile.longitude = optionInfo.lng;
									couseFile.latitude = optionInfo.lat;
									couseFile.placeSign = $(".select-room-box [name='placeSign']:checked").val();
									updateClassRoom();
									return false
								}
								isConflictParams = JSON.stringify(isConflictParams);
								//选择上课地点
								$.ajax({
									type: "post",
									url: "administrator/room/getRoomIsConflict",
									data: {
										isConflictParams:isConflictParams
									},
									async: false,
									beforeSend:function(){
										$yt_baseElement.showLoading();
									},
									success: function(data) {
										$yt_baseElement.hideLoading();
										if(data.data.isConflict==1){
											var str = '';
											$.each(data.data.conflictDate, function(a,b) {
												str += '<p>'+b.roomName+"教室已被"+b.roomUser+"占用,占用时间"+b.startTime+"到"+b.endTime;+'</p>';
											});
											str+='<p style="text-align:center">是否确定继续使用该教室？</p>'
											$(".select-room-box").hide();
											$yt_alert_Model.alertOne({  
										        haveAlertIcon:false,//是否带有提示图标 
										        haveCloseIcon:false,//是否带有关闭图标 
										        leftBtnName:"确定",//左侧按钮名称,默认确定 
										        rightBtnName:"取消",//右侧按钮名称,默认取消 
										        cancelFunction:"",//取消按钮操作方法*/  
										        alertMsg: str, //提示信息  
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
									          updateClassRoom();
										}
									}
							});
							function updateClassRoom(){
								$.ajax({
									type: "post",
									url: "class/course/updateClassRoom",
									data: couseFile,
									async: false,
									beforeSend:function(){
										$yt_baseElement.showLoading();
									},
									success: function(data) {
										if(data.flag == 0) {
											$yt_baseElement.hideLoading(function() {
												$yt_alert_Model.prompt("上课地点选择成功");
												$(".select-room-box").hide();
												courseManager.getCourseList();
											});
										} else {
											$yt_baseElement.hideLoading(function() {
												$yt_alert_Model.prompt("操作失败，请稍后重试");
											});
										}
									},
									error: function(data) {
										$yt_baseElement.hideLoading(function() {
											$yt_alert_Model.prompt("网络出现问题，请稍后重试");
										});
									}
								}); 
							}
							});
						}
					},
					error: function(data) {

					}
				});

			}

		});
		//打印课件
		$('.print-couse').off().click(function() {
			/** 
			 * 显示编辑弹出框和显示顶部隐藏蒙层 
			 */
			$(".print-couse-form").show();
			var projectCode = $yt_common.GetQueryString("projectCode");
			var fileType = 1;
			$('.print-couse-form tbody').empty();
			//调用显示页面loading方法  
			$yt_baseElement.showLoading();
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "class/course/getPrinting",
				data: {
					projectCode: projectCode,
					fileType: fileType
				},
				async: true,
				success: function(data) {
					if(data.flag == 0) {
						console.log(data.data);
						$('.print-couse-form tbody').empty();
						var htmlBody = $('.print-couse-form tbody');
						var htmlStr = '';
						$.each(data.data, function(c, v) {
							var states = "";
							if(v.states == 2) {
								states = '已完成';
							} else if(v.states == 3) {
								states = '打印中';
							} else if(v.states == 4) {
								states = '已作废';
							} else {
								states = '未打印';
							}
							htmlStr = '<tr class="print-tr">' +
								'<td>';
							if(v.states == 5) {
								htmlStr += '<label class="check-label yt-checkbox" style="margin-left:12px;">' +
									'<input class="print-check" type="checkbox" name="test" value="1"/></label>';
							}
							htmlStr += '</td>' +
								'<td class="curse-file-name" style="text-align:left;padding-left:5px;"><input type="hidden" class="curse-file-id" value="' + v.fileId + '"/>' + v.fileName + '</td>' +
								'<td style="text-align:left;padding-left:5px;">' + v.teacherName + '</td>';
							if(v.states != 5) {
								htmlStr += '<td><input class="yt-input print-count " disabled="disabled" type="number" value="' + v.printerCount + '" /></td>';
							} else {
								htmlStr += '<td><input style="width:85px;text-align: right;" class="yt-input "  type="number" value="' + v.printerCount + '" /></td>';
							}
							htmlStr += '<td class="print-states">' + states + '</td>' +
								'<input type="hidden" class="curse-id" value="' + v.courseId + '"' +
								'</tr>';
							htmlBody.append(htmlStr);
							//							if(states != "未打印") {
							//								htmlBody.find('label.check-label').hide();
							//								htmlBody.find('.print-count').attr("disabled", "disabled");
							//								htmlBody.find('.print-count').removeClass("print-counts");
							//							}else {
							//								htmlBody.find('label.check-label').show();
							//								htmlBody.find('.print-states5').removeAttr("disabled");
							//								htmlBody.find('.print-states5').addClass("print-counts");
							//							}
						});
						$yt_baseElement.hideLoading();
					}
				}
			});
			/** 
			 * 调用算取div显示位置方法 
			 */
			$yt_alert_Model.getDivPosition($(".print-couse-form"));
			/* 
			 * 调用支持拖拽的方法 
			 */
			$yt_model_drag.modelDragEvent($(".print-couse-form .yt-edit-alert-title"));
			/**
			 * 点击提交方法
			 */
			$('.print-couse-form .yt-model-sure-btn').off().on('click', function() {
				var printData = [];
				var printList = "";
				//选中一行的打印数量
				var printerCount = "";
				//声明一个字符串
				var repeatNum = "0";
				var checklength = $('.print-check:checked').length;
				$('.print-check:checked').parent().parent().parent().each(function(a, b) {
					var fileId = $(b).find('.curse-file-id').val();
					var courseId = $(b).find('.curse-id').val();
					var fileName = $(b).find('.curse-file-name').text();
					if(printerCount == "") {
						printerCount += $(b).find('.yt-input').val();
					} else {
						printerCount += "," + $(b).find('.yt-input').val();
					}
					var printerCounts = $(b).find('.yt-input').val();
					var states = $(b).find('.print-states').text();
					if(states == "未打印") {
						printList = {
							projectCode: projectCode,
							courseId: courseId,
							fileId: fileId,
							fileName: fileName,
							printerCount: printerCounts,
							fileType: 1,
							states: 3
						};
						printData.push(printList);
					}

				});
				console.log("printerCount", printerCount);
				var pringingData = JSON.stringify(printData);
				console.log(pringingData);
				if(checklength != 0) {
					if(repeatNum.indexOf(printerCount) == -1) {
						console.log("有打印数量");
						//显示loading
						$yt_baseElement.showLoading();
						$.ajax({
							type: "post",
							url: $yt_option.base_path + "class/course/addPrinting",
							data: {
								pringingData: pringingData
							},
							async: true,
							success: function(data) {
								if(data.flag == 0) {
									console.log("成功");
									$yt_baseElement.hideLoading(function() {
										$yt_alert_Model.prompt("提交成功");
										$(".print-couse-form").hide();
									});
								} else {
									$yt_baseElement.hideLoading(function() {
										$yt_alert_Model.prompt("提交失败");
									});
								}

							}
						});
					} else {
						$yt_alert_Model.prompt("请填写打印数量");
					}

				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("请选择需要打印的附件");
					});
				}

			});
			/** 
			 * 点击取消方法 
			 */
			$('.print-couse-form .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
				//隐藏页面中自定义的表单内容  
				$(".print-couse-form").hide();
				//隐藏蒙层  
				$("#pop-modle-alert").hide();
			});
		});
		//合并评分
		$('.merge-score-couse').click(function() {
			var projectCode = $yt_common.GetQueryString("projectCode");
			//获取课程信息
			var htmlBody = $('.merge-score-form tbody:eq(0)');
			//获取选中课程的老师
			var teaNamePush=[];
			//判断是否有重复项
			var repetData="";
			htmlBody.empty();
			$('.merge-couse-name').val("");
			$("input[name='couseCheck']:checked").parents("tr").each(function(c, d) {
				var couseInfo = $(d).data("couseInfo");
				teaNamePush.push(couseInfo.teacherId);
				console.log(couseInfo);
				htmlStr = '<tr class="print-tr">' +
					'<input class="merge-course-id" type="hidden" value="' + couseInfo.pkId + '"/>' +
					'<td >' + couseInfo.courseDate + '</td>' +
					'<td style="text-align:center;">' + couseInfo.courseTime + '</td>' +
					'<td style="text-align:center;">' + couseInfo.courseTypeName + '</td>' +
					'<td style="text-align:center;">' + couseInfo.teacherName + '</td>' +
					'<td style="text-align:center;">' + couseInfo.courseName + '</td>' +
					'</tr>';
				htmlBody.append(htmlStr);
			});
			teaNamePush=teaNamePush.sort();
			console.log('选中老师',teaNamePush);
			for (var i=0;i<teaNamePush.length;i++) {
				var num=i+1;
				if(num!=teaNamePush.length){
					if(teaNamePush[i]==teaNamePush[num]){
						console.log('同一个老师');
						repetData="";
					}else{
						console.log('不同老师');
						repetData=teaNamePush[i];
						$yt_alert_Model.prompt('请选择相同老师的课程进行合并');
						break;
					}
				}
			}
			console.log('是否有内容',repetData);
			if(repetData==""){
				//查询合并评分历史记录
				courseManager.selectMeraRecord();
				/** 
				 * 显示编辑弹出框和显示顶部隐藏蒙层 
				 */
				$(".merge-score-form").show();
				/** 
				 * 调用算取div显示位置方法 
				 */
				$yt_alert_Model.getDivPosition($(".merge-score-form"));
				/* 
				 * 调用支持拖拽的方法 
				 */
				$yt_model_drag.modelDragEvent($(".merge-score-form .yt-edit-alert-title"));
			}
			/**
			 * 点击合并方法
			 */
			$('.merge-score-form .yt-model-sure-btn:eq(0)').off().on('click', function() {
				//课程合并ID
				var mergeCourseId = "";
				var tipCourseName = "";
				//历史记录ID
				var histCourseId=courseManager.selectMeraRecord();
				//循环取到每个课程ID
				$('.merge-course-id').each(function() {
					var checkCourseId = $(this).val();
					if(mergeCourseId == "") {
						mergeCourseId += checkCourseId;
					} else {
						mergeCourseId += ',' + checkCourseId;
					}
					//判断选中的课程id是否在合并历史记录里面
					if(histCourseId.indexOf(checkCourseId) != -1) {
						if(tipCourseName == "") {
							tipCourseName += $(this).parent().find('td:eq(4)').text();
						} else {
							tipCourseName += "," + $(this).parent().find('td:eq(4)').text();
						}

					}
				});
				//合并后课程主题
				var courseName = $('.merge-couse-name').val();
				if(tipCourseName == "") {
					if($('.merge-course-id').length > 1) {
						//显示loading
						$yt_baseElement.showLoading();
						$.ajax({
							type: "post",
							url: $yt_option.base_path + "class/course/updateCourseMerge",
							data: {
								mergeCourseId: mergeCourseId,
								courseName: courseName,
								projectCode: projectCode
							},
							async: true,
							success: function(data) {
								if(data.flag == 0) {
									//隐藏loading
									$yt_baseElement.hideLoading(function() {
										$yt_alert_Model.prompt("合并成功");
									});
									$(".merge-score-form").hide();
								} else {
									$yt_baseElement.hideLoading(function() {
										$yt_alert_Model.prompt("合并失败");
									});
								}
							}
						});
					} else {
						$yt_alert_Model.prompt("请选择至少两行数据");
					}

				} else {
					//隐藏loading
					$yt_baseElement.hideLoading();
					var msg = '';
					//声明数组循环已合并的课程名称
					var couseArray = tipCourseName.split(',');
					for(var i = 0; i < couseArray.length; i++) {
						msg += '《' + couseArray[i] + '》课程已合并,请重新选择</br>'
					}
					$('.merge-score-form').hide();
					$yt_alert_Model.alertOne({
						haveCloseIcon: false, //是否带有关闭图标  
						leftBtnName: "取消", //左侧按钮名称,默认确定  
						alertMsg: msg, //提示信息
						cancelFunction: function() { //点击确定按钮执行方法  
							$('.merge-score-form').show();
						},
					});
				}

			});
			/**
			 * 点击取消合并按钮方法
			 */
			$('.merge-score-form').off().on('click', '.cancel-merge-btn', function() {
				var courseIds;
				for(var i=0; i<Number($(this).attr('rowspan'));i++){
					if(i==0){
						courseIds = $(this).parent().find('input:eq(0)').val();
					}else{
						courseIds +=','+$(this).parent().next().find('input:eq(0)').val();
					}
				}
				var projectCode = $yt_common.GetQueryString("projectCode");
				var mergeCode = $(this).parent().find('.course-merge-code').val();
				//显示整体框架loading的方法
				$yt_baseElement.showLoading();
				$.ajax({
					type: "post",
					url: $yt_option.base_path + "class/course/updateCancelCourseMerge",
					data: {
						mergeCode: mergeCode,
						courseIds: courseIds,
						projectCode: projectCode
					},
					async: true,
					success: function(data) {
						if(data.flag == 0) {
							$yt_alert_Model.prompt("取消合并成功");
							//查询合并评分历史记录
							courseManager.selectMeraRecord();
							//隐藏整体框架loading的方法
							$yt_baseElement.hideLoading();
						} else {
							$yt_alert_Model.prompt("取消合并失败");
							//隐藏整体框架loading的方法
							$yt_baseElement.hideLoading();
						}
					}
				});
			});
			/** 
			 * 点击取消方法 
			 */
			$('.merge-score-form .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
				//隐藏页面中自定义的表单内容  
				$(".merge-score-form").hide();
				//隐藏蒙层  
				$("#pop-modle-alert").hide();
			});
		});
		//用车申请
		$('.apply-car-couse').click(function() {
			$('.apply-car-form .course-type').text("");
			$('.apply-car-form .course-time').text("");
			$('.apply-car-form .course-theme').text("");
			$('.apply-car-form .course-teacher').text("");
			$('.bus-num').val("");
			$('.course-place').val("");
			//获取课程信息
			var couseInfo = $("input[name='couseCheck']:checked").parents("tr").data("couseInfo");
			console.log(couseInfo);
			var couseInfoLength = $("input[name='couseCheck']:checked").parents("tr").length;
			console.log("couseInfo", couseInfoLength + couseInfo);
			if(couseInfoLength == 1 && couseInfo != null) {
				$('.apply-car-form .course-type').text(couseInfo.courseTypeName);
				$('.apply-car-form .course-time').text(couseInfo.courseDate + ' ' + couseInfo.courseTime);
				$('.apply-car-form .course-theme').text(couseInfo.courseName);
				$('.apply-car-form .course-teacher').text(couseInfo.teacherName);
			}else{
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("请选中一条数据进行新增");
					});
					return false;
				}
			//获取用车申请历史列表
			courseManager.getApplyCarList();
			//获取下一步审批人和操作
			var user = '';
			var dataObj = '';
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "uniform/workFlowOperate/getSubmitPageData",
				data: {
					businessCode: "courseCar",
					processInstanceId: "",
					parameters: "",
					versionNum: ""
				},
				async: true,
				success: function(data) {
					if(data.flag == 0) {
						console.log(data.data);
						$.each(data.data, function(i, n) {

							console.log(n);
							console.log(i);
							for(var k in n) {
								console.log('k', k);
								console.log("n[k]", n[k]);
								user = n[k][0].userCode;
								console.log(user);
								dataObj = eval("(" + k + ")");
								console.log(dataObj);
								console.log(dataObj.nextCode);
							}
						});
					}
				}
			});
			/**
			 * 点击新增按钮
			 */
			$(".apply-car-form .yt-model-sure-btn").off().on('click', function() {
				//班级编号
				var projectCode = $yt_common.GetQueryString("projectCode");
				var userCount = $('.bus-num').val();
				var address = $('.course-place').val();
				if(couseInfoLength == 1 && couseInfo != null) {
					//显示loading
					$yt_baseElement.showLoading();
					$.ajax({
						type: "post",
						url: $yt_option.base_path + "class/course/addCourseUseCar",
						data: {
							projectCode: projectCode,
							courseId: couseInfo.pkId,
							userCount: userCount,
							address: address,
							businessCode: "courseCar",
							dealingWithPeople: user,
							opintion: "",
							processInstanceId: "",
							nextCode: dataObj.nextCode
						},
						async: true,
						success: function(data) {

							if(data.flag == 0) {
								//隐藏整体框架loading的方法
								$yt_baseElement.hideLoading(function() {
									//初始化用车申请弹窗的人数和地点输入框
									$('.bus-num').val("");
									$('.course-place').val("");
									$yt_alert_Model.prompt("新增用车成功");
									//获取用车申请历史列表
									courseManager.getApplyCarList();
								});
							} else {
								//隐藏整体框架loading的方法
								$yt_baseElement.hideLoading(function() {
									$yt_alert_Model.prompt("新增用车失败");
								});
							}
						}
					});
				} else {
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("请选中一条数据进行新增");
					});
				}

			});
			/**
			 * 点击取消派车按钮
			 */
			$('.apply-car-form').on('click', '.cancel-car', function() {

			});
			/**
			 * 点击列表中课程主题显示用车详情
			 */
			//			$('.apply-car-form').on('click', '.course-name', function() {
			//				
			//				var courseId = $('.apply-course-id').val();
			//				var types = "";
			//				//显示loading
			//				$yt_baseElement.showLoading();
			//				$.ajax({
			//					type: "post",
			//					url: $yt_option.base_path + "class/course/getCourseUseCar",
			//					data: {
			//						projectCode: projectCode,
			//						courseId: courseId
			//					},
			//					async: true,
			//					success: function(data) {
			//						if(data.flag == 0) {
			//							if(data.data.sendCarType != 2) {
			//								$('.details-tab').hide();
			//							} else {
			//								$('.details-tab').show();
			//							}
			//							$('.apply-car-details-form .course-type-details').text(data.data.types);
			//							$('.apply-car-details-form .course-time-details').text(data.data.courseTime);
			//							$('.apply-car-details-form .course-theme-details').text(data.data.courseName);
			//							$('.apply-car-details-form .course-teacher-details').text(data.data.teacherName);
			//							$('.apply-car-details-form .bus-num-details').text(data.data.userCount);
			//							$('.apply-car-details-form .course-place-details').text(data.data.address);
			//							//隐藏整体框架loading的方法
			//							$yt_baseElement.hideLoading();
			//						} else {
			//							//隐藏整体框架loading的方法
			//							$yt_baseElement.hideLoading(function() {
			//								$yt_alert_Model.prompt("查询失败");
			//							});
			//						}
			//					}
			//				});
			//				/** 
			//				 * 显示编辑弹出框和显示顶部隐藏蒙层 
			//				 */
			//				$(".apply-car-form").hide();
			//				$(".apply-car-details-form").show();
			//
			//				/** 
			//				 * 调用算取div显示位置方法 
			//				 */
			//				$yt_alert_Model.getDivPosition($(".apply-car-details-form"));
			//				/* 
			//				 * 调用支持拖拽的方法 
			//				 */
			//				$yt_model_drag.modelDragEvent($(".apply-car-details-form .yt-edit-alert-title"));
			//				/** 
			//				 * 点击取消方法 
			//				 */
			//				$('.apply-car-details-form .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
			//
			//					$(".apply-car-details-form").hide();
			//					$(".apply-car-form").show();
			//					//隐藏页面中自定义的表单内容  
			//
			//				});
			//			});
			/** 
			 * 显示编辑弹出框和显示顶部隐藏蒙层 
			 */
			$(".apply-car-form").show();
			/** 
			 * 调用算取div显示位置方法 
			 */
			$yt_alert_Model.setFiexBoxHeight($('.apply-car-form .yt-edit-alert-main'));
			$yt_alert_Model.getDivPosition($(".apply-car-form"));
			/* 
			 * 调用支持拖拽的方法 
			 */
			$yt_model_drag.modelDragEvent($(".apply-car-form .yt-edit-alert-title"));
			/** 
			 * 点击取消方法 
			 */
			$('.apply-car-form .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {

				//隐藏页面中自定义的表单内容  
				$(".apply-car-form").hide();
				//隐藏蒙层  
				$("#pop-modle-alert").hide();
			});
		});

		$(".address-type").change(function() {
			if($(this).val() == "1") {
				$(".external-address").hide()
				$(".internal-address").show();
			} else {
				$(".internal-address").hide();
				$(".external-address").show()
			}
			$yt_alert_Model.setFiexBoxHeight($(".select-room-box .yt-edit-alert-main"));
		});

		//查询教室
		$(".select-room-box .key-word .search-btn").click(function() {
			//查询教室列表
			me.getClassRooms();
		});

	},
	/*
	 课程日程附件渲染
	 
	 * 
	 * 
	 * */
	courseFileList:function(item,updateBtn,appendHtml){
		var fileArr=[];
		$(appendHtml).empty();
		$.each(item, function(i,n) {
			n.pkId=n.fileId;
			n.naming=n.fileName;
			n.types=1;
			fileArr.push(n);
			var fileShowHtml = '<span class="file-true"><img src="../../resources/images/icons/fileShow.png">公开</span>';
			if(n.isOpen==2){
				fileShowHtml = '<span class="file-false"><img src="../../resources/images/icons/fileHidden.png">不公开</span>';
			}else{
				n.isOpen=1;
			}
			$(appendHtml).parents('tr').find('.haveCourseFileSpan').show();
			$(appendHtml).append($('<li>'+fileShowHtml+'<label title="'+n.naming+'">'+n.naming+'</label><span class="delFile" style="color:red">×</span></li>').data('data',n));
		});
		$(updateBtn).data("fileInfo",fileArr);
	},
	/**
	 * 查询合并评分历史记录
	 */
	selectMeraRecord:function(){
		var htmlHistory = $('.merge-score-form tbody:eq(1)');
		var projectCode = $yt_common.GetQueryString("projectCode");
		var histCourseId = '';
		htmlHistory.empty();
		//显示loading
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/course/getCourseMerge",
			data: {
				projectCode: projectCode
			},
			async: false,
			success: function(data) {
				var rowNmu = 1;
				var mergeTitle;
				var lastNum;
				if(data.flag == 0) {
					//隐藏loading
					$yt_baseElement.hideLoading();
					console.log("查询历史记录成功", data.data);
					$.each(data.data, function(g, h) {
						var htmlStr = '';
						if(histCourseId == "") {
							histCourseId += h.pkId;
						} else {
							histCourseId += "," + h.pkId;
						}
						htmlStr += '<tr>' +
							'<input class="" type="hidden" value="' + h.pkId + '"/>' +
							'<input class="course-merge-code" type="hidden" value="' + h.mergeCode + '"/>' +
							'<td style="text-align:center;">' + h.courseDate + '</td>' +
							'<td style="text-align:center;">' + h.courseTime + '</td>' +
							'<td style="text-align:center;">' + h.courseTypeName + '</td>' +
							'<td style="text-align:center;">' + h.teacherName + '</td>' +
							'<td style="text-align:center;">' + h.courseName + '</td>';
						if(mergeTitle != h.mergeTitle) {
							$('.merge-record tbody tr').eq(lastNum).find('td').eq(5).attr('rowspan', rowNmu);
							$('.merge-record tbody tr').eq(lastNum).find('td').eq(6).attr('rowspan', rowNmu);
							mergeTitle = h.mergeTitle;
							lastNum = g;
							rowNmu = 1;
							htmlStr += '<td rowspan="" style="text-align:center;">' + h.mergeTitle + '</td>' +
								'<td class="cancel-merge-btn" style="text-align:center;">取消合并</td>';
						} else {
							rowNmu++;
						}
						$('.merge-record tbody tr').eq(lastNum).find('td').eq(5).attr('rowspan', rowNmu);
						$('.merge-record tbody tr').eq(lastNum).find('td').eq(6).attr('rowspan', rowNmu);
						htmlStr += '</tr>';
						htmlHistory.append(htmlStr);
					});
				}
			}
		});
		return histCourseId;
	},
	//获取用车申请历史列表
	getApplyCarList: function() {
		//班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		//显示loading
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/course/getClassCourseCarList",
			data: {
				projectCode: projectCode
			},
			async: true,
			success: function(data) {
				if(data.flag == 0) {
					var htmlBody = $('.apply-car-form table:eq(1) tbody');
					htmlBody.empty();
					var htmlStr = '';
					$.each(data.data, function(j, k) {
						if(k.sendCarType == 1) {
							k.sendCarType = "派车中";
						} else {
							k.sendCarType = "已派车";
						}
						if( k.userCount==undefined){
							 k.userCount="";
						}
						htmlStr = '<tr>' +
							'<input class="apply-course-id" type="hidden" value="' + k.courseId + '"/>' +
							'<td>' + k.courseTypeName + '</td>' +
							'<td>' + k.courseDate + '</td>' +
							'<td style="text-align:left;"><a style="color:#3c4687;" class=" course-name">' + k.courseName + '</a></td>' +
							'<td style="text-align:right;">' + k.userCount + '</td>' +
							'<td style="text-align:left;padding-left:5px;">' + k.address + '</td>' +
							'<td>' + k.sendCarType + '</td>' +
							'</tr>';
						htmlBody.append(htmlStr);
					});
					//隐藏loading
					$yt_baseElement.hideLoading();
				}
			}
		});
	},
	getCourseList: function() {
		//查询课程列表
		var projectCode = $yt_common.GetQueryString("projectCode");
		//查询课程信息
		$yt_baseElement.showLoading();
		$.ajax({
			async: false,
			url: $yt_option.base_path + "class/course/lookForAll", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				projectCode: projectCode,
			}, //ajax查询访问参数
			success: function(data) {
				$(".course-title").show();
				$(".course-table").show();
				$('.course-list-tbody').empty();
				if(data.flag == 0) {
					var htmlTbody = $('.course-list-tbody');
					var htmlTr = '';
					if(data.data.rows.length > 0) {
						$('.reception-list-tbody').empty();
						var rowSpanNum = 1;
						var rowSpanStr = '';
						var lastTr;
						$.each(data.data.rows, function(i, n) {
							
							var fileName = '';
							var fileUrl = '';
							if(n.files != '' && $.parseJSON(n.files).length > 0) {
								$.each( $.parseJSON(n.files), function(a,b) {
									fileName += '<span style="color:#3c4687;display:block" class="file-name" fileUrl="' + b.fileUrl + '">' + b.fileName + '</span>';
								});
							}
							htmlTr = '<tr>';
							if(rowSpanStr != n.courseDate) {
								$('.course-list-tbody tr').eq(lastTr).find("td").eq(0).attr("rowSpan", rowSpanNum);
								lastTr = i;
								rowSpanStr = n.courseDate;
								htmlTr += '<td class="bgn-tr">' + n.courseDate + '</td>';
								rowSpanNum = 1;
							} else {
								rowSpanNum++;
							}
							var cssTd = "text-align:center;";
							//开班式、结业式、教学活动,这儿三种类型的课程不显示教师和课件
							if(n.courseTypeName == "开班式" || n.courseTypeName == "结业式" || n.courseTypeName == "教学活动"){
								n.teacherName = "--"
								fileName = "--"
								cssTd = "text-align:center;";
							}
							htmlTr += '<td> <label class="check-label yt-checkbox">' +
								'<input type="checkbox" name="couseCheck" value="1"/>' + n.courseTime +
								'</label><div class="checkbox-top"></div></td>' +
								'<td>' + (n.courseTypeCode == 'teachingActivities' ? n.courseTypeDetails : n.courseTypeName) + '</td>' +
								'<td style="'+cssTd+'">' + n.teacherName + '</td>' +
								'<td style="text-align:left;">' + n.courseName + '</td>' +
								'<td style="'+cssTd+'">' + fileName + '</td>' +
								'<td style="text-align:left;"><input class="class-room-ids" type="hidden" value="' + n.classroomIds + '"/>' + (n.classroomNames == "" ? n.address : n.classroomNames) + '</td>' +
								'</tr>';
							htmlTr = $(htmlTr).data("couseInfo", n);
							htmlTbody.append(htmlTr);
						});
						$('.course-list-tbody tr').eq(lastTr).find("td").eq(0).attr("rowSpan", rowSpanNum);
						$(".course-list-tbody tr").unbind().bind("click", function() {
							if($(this).find("input[type='checkbox']")[0].checked == true) {
								$(this).find("input[type='checkbox']").setCheckBoxState("uncheck");
								$(this).find("td:not(.bgn-tr)").removeClass("yt-table-active");
							} else {
								$(this).find("input[type='checkbox']").setCheckBoxState("check");
								$(this).find("td:not(.bgn-tr)").addClass("yt-table-active");
							}
						});
					} else {
						$(".course-title").hide();
						$(".course-table").hide();
					}
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}
			}
		});

	},
	//接待活动列表
	getCourseReceptionList: function() {
		$yt_baseElement.showLoading();
		var projectCode = $yt_common.GetQueryString("projectCode");
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/course/getClassReceptionActivities",
			async: false,
			data:{
				projectCode:projectCode
			},
			success: function(data) {
				$('.reception-list-tbody').empty();
				//显示接待活动表头
				$(".reception-head").show();
				$(".reception-title").show();
				if(data.flag == 0) {
					var htmlTbody = $('.reception-list-tbody');
					var htmlTr = "";
					if(data.data.length > 0) {
						$.each(data.data, function(i, n) {
//							1:院领导出席开班式 
//							2:院领导出席结业式 
//							3:院领导贵宾厅座谈 
//							3:院领导交流座谈
							if (n.types == 1) {
								n.types = "院领导出席开班式";
							}else if(n.types == 2){
								n.types = "院领导出席结业式";
							}else if(n.types == 3){
								n.types = "院领导贵宾厅座谈";
							}else if(n.types == 4){
								n.types = "院领导交流座谈";
							}else{
								n.types = "";
							}
							n.raDate = n.raDate.split(" ")[0];
							htmlTr = '<tr>' +
							'<td class="recept-td" style="text-align:left;"><input class="types" type="hidden" value="' + n.types + '"/><input class="pk-id" type="hidden" value="' + n.pkId + '"/>' + n.types + '</td>' +
							'<td style="text-align:left;"><input class="user-code" type="hidden" value="' + n.userCode + '"/>' + n.userName + '</td>' +
							'<td>' + n.raDate+'</td>' +
							'<td>' + n.raTimeStart+'--'+n.raTimeEnd + '</td>' +
							'<td style="text-align:left;">' + n.raAddress + '</td>' +
							'<td style="text-align:left;">' + n.personOther + '</td>' +
							'<td style="text-align:left;">' + n.activityFlow + '</td>' +
							'</tr>';
							htmlTbody.append(htmlTr);
						});
					}else{
						//隐藏接待活动表头
						$(".reception-head").hide();
						$(".reception-title").hide();
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="7" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
							
							if($(".course-title").css("display") == "none"){
								htmlTbody.append(htmlTr);
							}
					}
					$yt_baseElement.hideLoading();
				}else{
					$yt_baseElement.hideLoading();
				}
				$('.reception-list-tbody tr').off("click").on("click",function(){
				    if ($(this).hasClass("yt-table-active")) {
				    	$(this).removeClass("yt-table-active");
				    }else{
				    	$(this).addClass('yt-table-active').siblings().removeClass('yt-table-active');
				    }
				});
			},
			error: function(data) {

			}
		});
		//初始化日期
		$(".reception-date").calendar({  
		    speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
		    complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
		    readonly: true, // 目标对象是否设为只读，默认：true     
		    lowerLimit:"2010/01/01", // 日期下限，默认：NaN(不限制)     
		    nowData:true,//默认选中当前时间,默认true  
		    dateFmt:"yyyy-MM-dd",  
		    callback: function() { // 点击选择日期后的回调函数  
		    }  
		}); 
		//初始化类型下拉框
		$('.reception-type').niceSelect();
//		//点击新增接待活动按钮
//		$(".add-reception-btn").off().click(function(){
//			//调用人员数据
//			courseManager.getAllDeptAndUser();
//			//显示编辑弹出框和显示顶部隐藏蒙层 
//			$(".add-reception-box").show();
//			//调用算取div显示位置方法 
//			$yt_alert_Model.setFiexBoxHeight($(".add-reception-box .yt-edit-alert-main"));
//			$yt_alert_Model.getDivPosition($(".add-reception-box"));
//			//调用支持拖拽的方法 
//			$yt_model_drag.modelDragEvent($(".add-reception-box .yt-edit-alert-title"));
//			
//			//点击取消方法 
//			$('.add-reception-box .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
//				//隐藏页面中自定义的表单内容  
//				$(".add-reception-box").hide();
//			});
//		});
		//点击新增或新增继续
		$(".reception-sure-continue,.reception-sure-close").off().click(function(){
			var bool = $(this).hasClass("reception-sure-close");
			var types = $(".reception-type").val();
			var userCode = $(".all-User").children();
			var AllUser;
			$.each(userCode,function(i,u){
				if(i==0){
					AllUser = $(u).attr("username");
				}else{
					AllUser += ','+$(u).attr("username");
				}
			})
			var raDate = $(".reception-date").val();
			var raTimeStart = $(".reception-date-star").val();
			var raTimeEnd = $(".reception-date-end").val();
			if(raTimeStart==''||raTimeEnd==''){
				$yt_alert_Model.prompt('请选择时间');
				return false;
			}
			var personOther = $(".reception-other-person").val();
			var raAddress = $(".reception-address").val();
			var activityFlow = $(".reception-flow").val();
			var pkId = $(".recept-pkid").val();
			if($yt_valid.validForm($('.recept-box'))&&userCode.length >0){
				$.ajax({
					type: "post",
					url: $yt_option.base_path + "class/course/addOrUpdateClassReceptionActivities",
					async: true,
					data:{
						pkId:pkId,
						projectCode:projectCode,
						types:types,
						userCode:AllUser,
						raDate:raDate,
						raTimeStart:raTimeStart,
						raTimeEnd:raTimeEnd,
						personOther:personOther,
						raAddress:raAddress,
						activityFlow:activityFlow
					},
					beforeSend:function(){
						$yt_baseElement.showLoading();
					},
					success: function(data) {
						$yt_baseElement.hideLoading();
						if(data.flag == 0) {
							$yt_alert_Model.prompt('操作成功');
							if(bool == true){//点击确定隐藏弹窗
								//隐藏页面中自定义的表单内容  
								$(".add-course-box").hide();
							}
							//初始化弹窗
							$(".reception-type").val("")
							$(".all-User").empty();
							$(".reception-address").val("");
							$(".reception-other-person").val("");
							$(".reception-flow").val("");
							$('.applay-tt').tree('loadData',courseManager.dataObj)
							courseManager.getCourseReceptionList();
						}else{
							$yt_alert_Model.prompt('操作失败')
						}
					}
				});
			}else{
				$(".all-User").css("border","1px solid red");
				$(".leader-ereo-span").show();
			}
		});
		
	},	
	dataObj : '',
	//查询接待活动领导人员树状图
	getAllDeptAndUser:function() {
		$yt_baseElement.showLoading();
		var divText;
		var dataObj;
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/user/getUsers",
			data: {
				compId: ""
			},
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					$yt_baseElement.hideLoading();
					dataObj = data.data;
				}else{
					$yt_baseElement.hideLoading();
				}
			}
		});
		dataObj = this.getTreeData(dataObj, 0);
		this.dataObj = dataObj;
		//节点选择事件
		$('.applay-tt').tree({
			data: dataObj,
			checkbox: true,
			onCheck: function(node, checked) {
				$(node.target).parents(".applay-tt").parent().prev().empty()
				var nodes = $(node.target).parents(".applay-tt").tree('getChecked');
				$.each(nodes, function(i, v) {
					divText = $(v.target).parents(".applay-tt").parent().prev().text();
					if (v.type==3) {
						if(divText.length == 0) {
							$(".all-User").css("border","1px solid #DFE6F3");
							$(".leader-ereo-span").hide();
							$(v.target).parents(".applay-tt").parent().prev().append('<span userName="' + v.textName + '"deptName="' + v.parentId + '">' + v.text + '</span>');
						} else {
							$(v.target).parents(".applay-tt").parent().prev().append('<span userName="' + v.textName + '"deptName="' + v.parentId + '">' + ',' + v.text + '</span>');
						}
					}
				});
			}
		});
		//点击领导输入框显示领导人员树状图
		//默认隐藏树形图标识为0
		var showOrhide =0;
		$(document).bind("click",function(e){
			var target  = $(e.target);
			if(target.hasClass("all-User")){
				if (showOrhide == 0) {//显示树形
					showOrhide = 1;
					//隐藏上三角图标
					$(".lead-up").hide();
					//显示上三角图标
					$(".lead-down").show();
					$(".tt-all-user").show();
				} else{//隐藏树形
					showOrhide = 0;
					$(".lead-up").show();
					$(".lead-down").hide();
					$(".tt-all-user").hide();
				}
			}else{
				if (showOrhide == 1) {//为树形图
					showOrhide = 0;
				}
				$(".tt-all-user").hide();
			}
		});
	},
	//接待活动领导人员树状图
	getTreeData: function(data, parentId) {
		var me = this;
		var result = [],
			temp;
		for(var i in data) {
			if(data[i].parentId == parentId) {
				result.push(data[i]);
				temp = me.getTreeData(data, data[i].id);
				if(temp.length > 0) {
					data[i].children = temp;
				}
			}
		}
		return result;
	},
	//加载教师列表
	getTeacherList: function() {
		$("select.teacher-list-selt").empty();
		var projectCode = $yt_common.GetQueryString("projectCode");
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/teacher/lookForAll",
			async: false,
			data:{
				searchParameters: '',
				projectCode: projectCode,
				pageIndexs:1,
				pageNum:10000
			},
			success: function(data) {
				if(data.flag == 0) {
					$("select.teacher-list-selt").append('<option value="">请选择</option>');
					$.each(data.data.rows, function(i, n) {
						$("select.teacher-list-selt").append('<option value="' + n.pkId + '">' + n.realName + '</option>');
					});
					$("select.teacher-list-selt").niceSelect();
				}
			},
			error: function(data) {

			}
		});
	},
	getCourseType: function() {
		//初始化课程类型下拉列表
		$.ajax({
			type: "post",
			url: "class/course/getCourseType",
			data: {
				courseTypeName: ""
			},
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					$("select.couse-type").empty();
					$.each(data.data, function(i, n) {
						$("select.couse-type").append('<option value="' + n.courseTypeCode + '">' + n.courseTypeName + '</option>');
					});
				} else {
					$yt_alert_Model.prompt("课程类型查询失败");
				}
			},
			error: function(data) {
				$yt_alert_Model.prompt("课程类型查询失败");
			}
		});
		$("select.couse-type").niceSelect();
	},
	deleteCouse: function(pkId) {
		//删除课程
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/course/deleteCourse",
			data: {
				pkId: pkId
			},
			async: true,
			success: function(data) {
				if(data.flag == 0) {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt(data.message);
						courseManager.getCourseList();
						courseManager.getCourseReceptionList();
					});
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt(data.message);
					});
				}
			},
			error: function(data) {
				$yt_baseElement.hideLoading(function() {
					$yt_alert_Model.prompt("课程删除失败");
				});
			}
		});
	},
	//接待活动删除
	deleteRecept: function(pkId) {
		//删除课程
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/course/deleteClassReceptionActivities",
			data: {
				pkId: pkId
			},
			async: true,
			success: function(data) {
				if(data.flag == 0) {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("接待活动删除成功");
						courseManager.getCourseList();
						courseManager.getCourseReceptionList();
					});
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("接待活动删除失败");
					});
				}
			},
			error: function(data) {
				$yt_baseElement.hideLoading(function() {
					$yt_alert_Model.prompt("接待活动删除失败");
				});
			}
		});
	},
	editCouseInfo: function(add,pkId) {
		var postState = true;
		var courseTypeCode = $(".couse-type").val();
		var formData = {};
		//班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		if(courseTypeCode == "openingCeremony" || courseTypeCode == "windingUp") {
			if($yt_valid.validFont($(".add-course-box input[name='courseName']"))&&$yt_valid.validFont($(".add-course-box .course-date"))) {
				var formData = $(".add-course-box").getDatas();
				formData.projectCode = projectCode;
				formData.giveType = $(".add-course-box [name='giveType']:checked").val();
				formData.isNeedGroupPhoto = $(".add-course-box [name='isNeedGroupPhoto']:checked").val();
			} else {
				postState = false;
			}
		} else if(courseTypeCode == "teachingActivities") {
			if($yt_valid.validFont($(".add-course-box input[name='courseName']"))&&$yt_valid.validFont($(".add-course-box .course-date"))) {
				var formData = $(".add-course-box").getDatas();
				formData.projectCode = projectCode;
				formData.giveType = $(".add-course-box [name='giveType']:checked").val();
//				formData.teacherId = $(".add-course-box [name='teacherId']").val();
				formData.courseTypeDetails = $(".add-course-box [name='courseTypeDetails']").val();
//				var files = [];
//				$.each($('.add-course-box .courseFileUl li'),function(i,n){
//					var data = $(n).data('data');
//					files.push({
//						fileId: data.pkId,
//						fileName: data.naming,
//						types : data.types,
//						fileTypes: 2,
//						fileSize:data.fileSize,
//						isOpen:data.isOpen
//					})
//				})
//				formData.files = JSON.stringify(files);
			} else {
				postState = false;
			}
		} else {
			if($yt_valid.validFont($(".add-course-box input[name='courseName']"))&&$yt_valid.validFont($(".add-course-box .course-date"))) {
				var formData = $(".add-course-box").getDatas();
				formData.projectCode = projectCode;
				formData.giveType = $(".add-course-box [name='giveType']:checked").val();
				formData.teacherId = $(".add-course-box [name='teacherId']").val();

				formData.types = $(".add-course-box [name='fileType']:checked").val();
				var files = [];
				$.each($('.add-course-box .courseFileUl li'),function(i,n){
					var data = $(n).data('data');
					files.push({
						fileId: data.pkId,
						fileName: data.naming,
						types : data.types,
						fileTypes: 2,
						fileSize:data.fileSize,
						isOpen:data.isOpen
					})
				})
				formData.files = JSON.stringify(files);
//				if($(".add-course-box [name='fileType']:checked").parent().next().data("fileInfo")) {
//					var fileId = $(".add-course-box [name='fileType']:checked").parent().next().data("fileInfo").pkId;
//					var fileName = $(".add-course-box [name='fileType']:checked").parent().next().data("fileInfo").naming;
//					var fileSize = $(".add-course-box [name='fileType']:checked").parent().next().data("fileInfo").fileSize;
//					formData.files = JSON.stringify([{
//						fileId: fileId,
//						fileName: fileName,
//						fileTypes: 2,
//						fileSize:fileSize
//					}]);
//				}

			} else {
				postState = false;
			}
		}

		if(postState) {
			if(pkId) {
				formData.pkId = pkId;
			}
			$yt_baseElement.showLoading();
			$.ajax({
				type: "post",
				url: $yt_option.base_path+"class/course/addOrUpdateCourse",
				async: true,
				data: formData,
				success: function(data) {
					if(data.flag == 0) {
						$yt_baseElement.hideLoading(function() {
							$yt_alert_Model.prompt("操作成功");
							courseManager.getCourseList();
							if(add){
								//初始化上课时间
//								$("[name='giveType']:eq(0)").setRadioState("check");
//								$(".add-course-box .start-time").timespinner('setValue', "08:30");
//								$(".add-course-box .end-time").timespinner('setValue', "11:30");
								//初始化类型
								$("#courseName").val('');
//								var openingCeremony = $("select.couse-type option:eq(0)").val();
//								$(".couse-type").setSelectVal(openingCeremony);
//								$(".couse-type2").hide();
//								$(".couse-type1").show();
								$(".valid-font").text("");
								$(".select-file-btn").val("").removeData();
								$(".valid-hint").removeClass("valid-hint");
								$(".select-file-btn").css("visibility", "visible");
								$('.courseFileUl').empty();
								$('.upload-file-btn#couseFile').val('');
								$('.upload-file-btn#couseFile').siblings('input').val('').removeData('fileInfo');
								$('.teacher-list-selt').setSelectVal('');
								$('.add-course-box .select-file-btn').val('').removeData('fileInfo');
								$(".upload-file-btn").css("visibility", "hidden").prev().css("visibility", "hidden");
								$("[name='fileType']:eq(0)").setRadioState("check");
								$("[name='isNeedGroupPhoto']:eq(0)").setRadioState("check");
							}else{
								//隐藏页面中自定义的表单内容  
								$(".add-course-box").hide();
							}
						});
					} else {
						$yt_baseElement.hideLoading(function() {
							$yt_alert_Model.prompt("操作失败");
						});
					}
				},
				error: function(data) {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("操作失败");
					});
				}
			});
		}
	},
	uploadFiles: function() {
		var couseInfo = $("input[name='couseCheck']:checked").parents("tr").data("couseInfo");
		var projectCode = $yt_common.GetQueryString("projectCode");
		var teacherId = couseInfo.teacherId;
		var pkId = couseInfo.pkId;
//		var fileId = $(".couse-file-box input[name='fileType']:checked").parent().next().data("fileInfo").pkId;
//		var fileName = $(".couse-file-box input[name='fileType']:checked").parent().next().data("fileInfo").naming;
//		var types = $(".couse-file-box input[name='fileType']:checked").val();
//		var fileSize = $(".couse-file-box input[name='fileType']:checked").parent().next().data("fileInfo").fileSize;
		var files=[];
		$.each($('.couse-file-box .courseFileUl li'),function(i,n){
			var data = $(n).data('data');
			files.push({
				fileId: data.pkId,
				fileName: data.naming,
				types: data.types,
				fileTypes: 2,
				fileSize:data.fileSize,
				isOpen:data.isOpen
			})
		})
		files = JSON.stringify(files);
		//上传附件
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: "class/course/uploadFiles",
			data: {
				projectCode: projectCode,
				teacherId: teacherId,
				files: files,
				pkId: pkId
			},
			async: true,
			success: function(data) {
				if(data.flag == 0) {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("附件上传成功");
						courseManager.getCourseList();
						$(".couse-file-box").hide();
					});
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("操作异常");
					});
				}
			},
			error: function(data) {
				$yt_baseElement.hideLoading(function() {
					$yt_alert_Model.prompt("网络出现异常，请稍后重试");
				});
			}
		});
	},
	getClassRooms: function() {
		var courseDate = $("input[name='couseCheck']:checked").parents("tr").data("couseInfo");
		var classroomIds = courseDate.classsroomIds;
		console.log(classroomIds);
		var projectCode = $yt_common.GetQueryString("projectCode");
		var classroomName = $(".select-room-box .key-word input").val();
		var courseId = [] ;
		$.each($("input[name='couseCheck']:checked").parents("tr"), function(i,n) {
			courseId.push($(n).data("couseInfo").pkId);
		});
		courseId = courseId.join(',');
		$.ajax({
			async: true,
//			pageIndexs: 1,
//			pageNum: 15, //每页显示条数  
//			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "class/course/getClassRooms", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				classroomName: classroomName,
				projectCode: projectCode,
				pageIndexs: 1,
				pageNum: 10000,
				courseId:courseId
			}, //ajax查询访问参数
//			objName: 'data', //指获取数据的对象名称  
			beforeSend: function() {
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.rooms-tbody').empty();
					var htmlTr = '';
					//初始化日期

					var courseDate = $("input[name='couseCheck']:checked").parents("tr").data("couseInfo").courseDate;
					var weekList = ytDate.startStop(courseDate);

					$(".sun-head").nextAll().remove();
					$(".sun-head").remove();
					var th = '';
					var day = 0;
					var className = '';
					$.each(weekList, function(i, n) {
						day = new Date(n).getDate();
						if(i == 0) {
							className = 'sun-head';
						} else if(i == 6) {
							className = 'sat-head';
						} else {
							className = '';
						}
						th = '<th class="state-day ' + className + '" currentDay="' + n + '">' + day + '</th>'
						$(".select-room-box table thead tr").append(th);
					});
					var arrIndex = 0;
					var stateObj = null;
					if(data.data.rows.length > 0) {
						var stateDay = '<td class="state-day"></td>' +
							'<td class="state-day"></td>' +
							'<td class="state-day"></td>' +
							'<td class="state-day"></td>' +
							'<td class="state-day"></td>' +
							'<td class="state-day"></td>' +
							'<td class="state-day"></td>';
						$.each(data.data.rows, function(i, n) {
							htmlTr = '<tr>' +
								'<td rowspan="3" width="22px" class="tc"><label class="check-label yt-checkbox">' +
								'<input class="check-box"  type="checkbox" value="' + n.pkId + '"/>' +
								'</label></td>' +
								'<td rowspan="3" width="" class="room-name"><span>' + n.classroomName + '</span></td>' +
								'<td rowspan="3" width="">' + n.types + '</td>' +
								'<td rowspan="3" width="" class="tr">' + n.galleryful + '</td>' +
								'<td width="30px">上午</td>' +
								stateDay +
								'</tr>' +
								'<tr>' +
								'<td>下午</td>' +
								stateDay +
								'</tr>' +
								'<tr>' +
								'<td>晚上</td>' +
								stateDay +
								'</tr>';
							htmlTr = $(htmlTr).data("roomInfo", n);
							$.each(n.classroomStates, function(j, m) {
								arrIndex = $.inArray(m.classroomDate, weekList);
								if(arrIndex != -1) {
									stateObj = htmlTr.eq(parseInt(m.dataType) - 1).find(".state-day").eq(arrIndex).data("arrIndex", arrIndex);
									if(m.projectType==2){
										m.projectTypeVal = '委托'
									}else if(m.projectType==3){
										m.projectTypeVal = '选学'
									}else if(m.projectType==4){
										m.projectTypeVal = '中组部调训'
									}else if(m.projectType==5){
										m.projectTypeVal = '国资委调训'
									}else{
										m.projectTypeVal = ''
									}
									if(stateObj.data("classroomStates")){
										var dataArr = stateObj.data("classroomStates");
										dataArr.push(m);
										stateObj.addClass('base-use');
										stateObj.addClass(m.classroomStates == 1 ? "all-use" : "sub-use").data("classroomStates",dataArr).data("data",n);;
									}else{
										stateObj.addClass(m.classroomStates == 1 ? "all-use" : "sub-use").data("classroomStates",[m]).data("data",n);;
									}
								}
							});
							htmlTbody.append(htmlTr);
						});
						$(".room-form .check-all").off('change').change(function() {
							//判断自己是否被选中  
							if($(this).parent().hasClass("check")) {
								//设置反选  
								$(this).parents("table").find("tbody input[type='checkbox']").setCheckBoxState("uncheck");
							} else {
								//调用设置选中方法,全选  
								$(this).parents("table").find("tbody input[type='checkbox']").setCheckBoxState("check");
							}
						});
						$('.rooms-tbody .sub-use,.rooms-tbody .all-use').tooltip({
								position: 'bottom',
								content: function() {
									var classroomStates = $(this).data("classroomStates");
									console.log(classroomStates)
									var showBox = '';
									$.each(classroomStates, function(i,n) {
										showBox += '<div class="tip-box tipclassroombox" style="width:300px"><table class="tip-table">' +
											'<tr><td class="tip-lable" style="width:72px;color:#fff">使用时间：</td><td>'+(n.classroomDate+' '+n.startTime +'-'+ n.endTime)+'</td></tr>' +
											'<tr><td class="tip-lable" style="color:#fff">项目编号：</td><td>'+n.projectCode+'</td></tr>' +
											'<tr><td class="tip-lable" style="color:#fff">项目名称：</td><td>'+n.projectName+'</td></tr>' +
											'<tr><td class="tip-lable" style="color:#fff">项目类型：</td><td>'+n.projectTypeVal+'</td></tr>' +
											'<tr><td class="tip-lable" style="color:#fff">项目主任：</td><td>'+n.projectHead+'</td></tr>' +
											'<tr><td class="tip-lable" style="color:#fff">学员人数：</td><td>'+n.traineeCount+'人</td></tr>' +
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
							});
							$('.tab-room-box').empty();
							var tabHtml = '';
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
								}
								tabHtml = '<button class="yt-option-btn ">• '+n.courseName+'</button>';
								tabHtml = $(tabHtml).data('data',n);
								$('.tab-room-box').append(tabHtml);
							})
							$('.classRoomName').text(alldata.classroomName);
							$('.tab-room-box').css('width',data.length*120+'px');
							$('.tab-room-box .yt-option-btn').eq(0).addClass('active');
							$('.classRoomTable').setDatas($('.tab-room-box .yt-option-btn').eq(0).data('data'));
							$('.tab-room-box .yt-option-btn').off().on('click',function(){
								$(this).addClass("active").siblings().removeClass("active");
								$('.classRoomTable').setDatas($(this).data('data'));
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
							if($(".tab-room-list").width() > ($(".tab-room-box button").last().position().left + 120)) {
									$(".room-tab-btn-end").off();
									$(".room-tab-btn-end").hide();
							}else{
								$(".room-tab-btn-end").show();
							}
						});
						//修改开始和结束样式
						$(".rooms-tbody .state-day").each(function(i, n) {
							if($(n).hasClass("all-use") || $(n).hasClass("sub-use")) {
								if(i % 7 == 0) {
									$(n).addClass("start-state");
								} else if((i + 1) % 7 == 0) {
									$(n).addClass("end-state");
								} else {
									var lastDay = $(".rooms-tbody .state-day").eq(i - 1);
									var nextDay = $(".rooms-tbody .state-day").eq(i + 1);
									if(!lastDay.hasClass("all-use") && !lastDay.hasClass("sub-use")) {
										$(n).addClass("start-state");
									}
									if(!nextDay.hasClass("all-use") && !nextDay.hasClass("sub-use")) {
										$(n).addClass("end-state");
									}
								}

							}
						});

					} else {
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="10" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						htmlTbody.html(htmlTr);
					}

					$yt_baseElement.hideLoading();
					$('.room-name span').tooltip({
						position: 'right',
						content: function() {
							var roomInfo = $(this).parent().parent().data("roomInfo");
							roomInfo.infrastructure = roomInfo.infrastructure.replace("1", "白板").replace("2", "投影").replace("3", "扩音器").replace("4", roomInfo.infrastructureOther);
							var showBox = '<table class="tip-table">' +
								'<tr><td class="tip-lable">教室序号：</td><td>A303</td></tr>' +
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

					$yt_alert_Model.setFiexBoxHeight($(".select-room-box .yt-edit-alert-main"));
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}
				/** 
				 * 调用算取div显示位置方法 
				 */
				$yt_alert_Model.getDivPosition($(".select-room-box"));

			}
		})
	},
	courseNameList:[],
	//联想该教师的课程主题
	getCourseNameList:function(){
		var me = this;
		$.ajax({
			type:"post",
			url:"class/course/getCourseNameByTeacherId",
			async:false,
			data:{
				teacherId:$('.teacher-list-selt').val()
			},
			beforeSend:function(){
				$yt_baseElement.showLoading()
			},
			success:function(data){
				$yt_baseElement.hideLoading();
				if(data.flag==0){
					me.courseNameList = data.data;
					
				}
			},
			error:function(){
				$yt_baseElement.hideLoading();
			}
		});
	},
	assCourseNameList:function(){
		var value =$.trim($('#courseName').val());
		var arr = [];
		$.each(this.courseNameList, function(i,n) {
			if(n.indexOf(value)!=-1){
				arr.push(n)
			}
		});
		var a = '';
		var b = $('.courseNameList ul').empty();
		$.each(arr, function(i,n) {
			a += '<li>'+n+'</li>'
		});
		b.append(a);
		$(".courseNameList li").off("hover").hover(function(){
//			$('#courseName').val()==''?$('#courseName').val(" "):'';
			$(this).addClass('hoverAction');
		},function(){
			$(this).removeClass('hoverAction');
		})
	}
}
/**
 * 学员管理详细信息
 */
var studentList = {
	init: function() {
		$(".date-birth").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			lowerLimit: "NaN", // 日期下限，默认：NaN(不限制)     
			nowData: true, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd",
			callback: function() { // 点击选择日期后的回调函数  
				//alert("您选择的日期是：" + $("#txtDate").val());  
			}
		});
		$(".party-date").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			lowerLimit: "NaN", // 日期下限，默认：NaN(不限制)     
			nowData: true, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd",
			callback: function() { // 点击选择日期后的回调函数  
				//alert("您选择的日期是：" + $("#txtDate").val());  
			}
		});
		$(".work-time").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			lowerLimit: "NaN", // 日期下限，默认：NaN(不限制)     
			nowData: true, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd",
			callback: function() { // 点击选择日期后的回调函数  
				//alert("您选择的日期是：" + $("#txtDate").val());  
			}
		});
		var traineeId;
		$('.org-type').niceSelect();
		$(".card-type").niceSelect();
		//民族下拉列表
		var studentNationList = studentList.getStudentNationList();
		if(studentNationList != "") {
			$.each(studentNationList, function(i, w) {
				$('.class-student-stration-form .student-nation').append('<option value="' + w.nationId + '">' + w.nationName + '</option>');
			});
			$('.class-student-stration-form .student-nation').niceSelect();
		}
		//集团下拉列表
//		var studentGroupList = studentList.getStudentGroupList();
		$('.class-student-stration-form .group-id-elementary-name').off('click').click(function(){
			$('.class-student-stration-form').hide();
			studentList.getGroupAlertList($(this),$(this).siblings('.group-id-elementary'),trueBack,canelBack);
			function trueBack(){
				$('.class-student-stration-form').show();
				groupId = $('.class-student-stration-form .group-id-elementary').val();
				if($('.class-student-stration-form .group-id-elementary-name').val() != '') {
					$('.class-student-stration-form .group-id-elementary-name').removeClass('valid-hint');
					$('.class-student-stration-form .group-id-elementary-name').siblings('.valid-font').text('');
				}
				var companyList = studentList.getStudentCompanyList(groupId);
				//单位添加数据
				if(companyList != "") {
					$('.class-student-stration-form select.org-id').empty();
					$('.class-student-stration-form select.org-id').append(' <option value="">请选择</option>');
					$.each(companyList, function(i, o) {
						$('.class-student-stration-form select.org-id').append(' <option value="' + o.groupId + '">' + o.groupName + '</option>').data('types', o.types);
					});
					$('.class-student-stration-form select.org-id').niceSelect({  
				        search: true,  
				        backFunction: function(text) {  
				            //回调方法,可以执行模糊查询,也可自行添加操作  
				            $(".class-student-stration-form select.org-id option").remove();  
				            if(text == "") {  
				                $(".class-student-stration-form select.org-id").append('<option value="">请选择</option>');  
				            }  
				            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
				            $.each(companyList, function(i, n) {  
				                if(n.groupName.indexOf(text) != -1) {  
				                    $(".class-student-stration-form select.org-id").append('<option value="' + n.groupId + '">' + n.groupName + '</option>').data('types', n.types);  
				                }  
				            });  
				        }  
				    });
					$('.class-student-stration-form .orgType').text('');
					$(".class-student-stration-form select.org-id").off().change(function() {
						if($(this).val() != '') {
							$("div.org-id").removeClass('valid-hint');
							$(this).siblings('.valid-font').text('');
						}
						$('.class-student-stration-form .orgType').text($(this).data('types'));
					});
				} else {
					$('.class-student-stration-form select.org-id').empty();
					$('.class-student-stration-form select.org-id').append(' <option value="">请选择</option>');
					$('.class-student-stration-form select.org-id').niceSelect();
				}
			}
			function canelBack(){
				$('.class-student-stration-form').show();
				$('#pop-modle-alert').show();
			}
		});
//		if(studentGroupList != "") {
//			$('.class-student-stration-form select.group-id-elementary').empty();
//          $(".class-student-stration-form select.group-id-elementary").append('<option value="">请选择</option>');  
//			$.each(studentGroupList, function(i, q) {
//				$('.class-student-stration-form select.group-id-elementary').append('<option value="' + q.groupId + '">' + q.groupName + '</option>');
//			});
//			$('.class-student-stration-form select.group-id-elementary').niceSelect({  
//		        search: true,  
//		        backFunction: function(text) {  
//		            //回调方法,可以执行模糊查询,也可自行添加操作  
//		            $(".class-student-stration-form select.group-id-elementary option").remove();  
//		            if(text == "") {  
//		                $(".class-student-stration-form select.group-id-elementary").append('<option value="">请选择</option>');  
//		            }  
//		            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
//		            $.each(studentGroupList, function(i, n) {  
//		                if(n.groupName.indexOf(text) != -1) {  
//		                    $(".class-student-stration-form select.group-id-elementary").append('<option value="' + n.groupId + '">' + n.groupName + '</option>');  
//		                }  
//		            });  
//		        }  
//		    });
//		}
		//下拉框二级联动
//		$('.class-student-stration-form select.group-id-elementary').change(function() {
//			groupId = $(this).val();
//			var companyList = studentList.getStudentCompanyList(groupId);
//			//单位添加数据
//			if(companyList != "") {
//				$('.class-student-stration-form select.org-id').empty();
//				$('.class-student-stration-form select.org-id').append(' <option value="">请选择</option>');
//				$.each(companyList, function(i, o) {
//					$('.class-student-stration-form select.org-id').append(' <option value="' + o.groupId + '">' + o.groupName + '</option>').data('types', o.types);
//				});
//				$('.class-student-stration-form select.org-id').niceSelect({  
//			        search: true,  
//			        backFunction: function(text) {  
//			            //回调方法,可以执行模糊查询,也可自行添加操作  
//			            $(".class-student-stration-form select.org-id option").remove();  
//			            if(text == "") {  
//			                $(".class-student-stration-form select.org-id").append('<option value="">请选择</option>');  
//			            }  
//			            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
//			            $.each(companyList, function(i, n) {  
//			                if(n.groupName.indexOf(text) != -1) {  
//			                    $(".class-student-stration-form select.org-id").append('<option value="' + n.groupId + '">' + n.groupName + '</option>').data('types', n.types);  
//			                }  
//			            });  
//			        }  
//			    });
//				$('.class-student-stration-form .orgType').text('');
//				$(".class-student-stration-form select.org-id").off().change(function() {
//					if($(this).val() != '') {
//						$("div.org-id").removeClass('valid-hint');
//						$(this).siblings('.valid-font').text('');
//					}
//					$('.class-student-stration-form .orgType').text($(this).data('types'));
//				});
//			} else {
//				$('.class-student-stration-form select.org-id').empty();
//				$('.class-student-stration-form select.org-id').append(' <option value="">请选择</option>');
//				$('.class-student-stration-form select.org-id').niceSelect();
//			}
//		});
		//点击更多按钮
		$(".student-div button.cli-more-btn").off().click(function(){
			var isOrNot=$(this).attr('isOrNot');
			if(isOrNot=="true"){
				$(".student-div .cli-more-btn-box").show();
				$(this).attr('isOrNot','false');
				$(this).find('img').addClass('flipy');
			}else{
				$(".student-div .cli-more-btn-box").hide();
				$(this).attr('isOrNot','true');
				$(this).find('img').removeClass('flipy');
			}
			return false;
		});
		//点击弹出框里边的按钮
		$(".student-div .cli-more-btn-box button").click(function(){
				$(".student-div .cli-more-btn-box").hide();
				$(".student-div button.cli-more-btn").attr('isOrNot','true');
				$(".student-div button.cli-more-btn").find('img').removeClass('flipy');
		});
		$('body').click(function(){
				$(".student-div .cli-more-btn-box").hide();
			$(".student-div button.cli-more-btn").attr('isOrNot','true');
				$(".student-div button.cli-more-btn").find('img').removeClass('flipy');
		})
		//点击设为重要学员按钮
		$(".set-import-student").click(function(){
			//if($('.student-div label.yt-checkbox input:checked').length>0){
				studentList.setImportStudentAppend();
				/** 
				 * 显示编辑弹出框和显示顶部隐藏蒙层 
				 */
				$(".set-inport-student-div").show();
				$(".set-inport-student-div .list-tbody span[class!='can-tr-btn']").hide();
				$(".set-inport-student-div .list-tbody textarea").show();
				$('.set-inport-student-div .yt-model-sure-btn').attr('repair-btn','false');
				$('.set-inport-student-div .yt-model-sure-btn').val("确定");
				/** 
				 * 调用算取div显示位置方法 
				 */
				//$yt_alert_Model.setFiexBoxHeight($(".set-inport-student-div .yt-edit-alert-main"));
				$yt_alert_Model.getDivPosition($(".set-inport-student-div"));
				/* 
				 * 调用支持拖拽的方法 
				 */
				$yt_model_drag.modelDragEvent($(".set-inport-student-div .yt-edit-alert-title"));
				/**
				 * 点击确定按钮
				 */
				$('.set-inport-student-div .yt-model-sure-btn').off('click').on('click', function() {
					var repairBtn=$(this).attr('repair-btn');
					if(repairBtn=="true"){
						$(this).val("确定");
						$(".set-inport-student-div .list-tbody span[class!='can-tr-btn']").hide();
						$(".set-inport-student-div .list-tbody textarea").show();
						$(this).attr('repair-btn','flase');
					}else{
						$(this).val("修改");
						$(".set-inport-student-div .list-tbody span[class!='can-tr-btn']").show();
						$(".set-inport-student-div .list-tbody textarea").hide();
						$(this).attr('repair-btn','true');
						var projectCode = $yt_common.GetQueryString("projectCode");
						var traineeImportantList=[];
						var impStu=$(".set-inport-student-div .list-tbody tr");
						$.each(impStu, function() {
							var isImportant=1;
							var importantDetails=$(this).find('textarea').val();
							var traineeId=$(this).find('textarea').attr('data-trainee');
							var list={
								isImportant:isImportant,
								importantDetails:importantDetails,
								traineeId:traineeId
							};
							traineeImportantList.push(list);
						});
						traineeImportantList=JSON.stringify(traineeImportantList);
						console.log("traineeImportantList",traineeImportantList);
						$.ajax({
							type:"post",
							url:$yt_option.base_path + "class/trainee/updateTraineeImportant",
							data:{
								projectCode:projectCode,
								traineeImportantList:traineeImportantList
							},
							async:true,
							success:function(data){
								if(data.flag==0){
									$yt_alert_Model.prompt("重要学员设置成功");
									$('.student-div .page-info').eq(0).pageInfo("refresh");
									//studentList.getStudentList();
									studentList.setImportStudentAppend();
									//$(".set-inport-student-div").hide();
								}else{
									$yt_alert_Model.prompt("重要学员设置失败");
								}
							}
						});
					}
					
				});
				/** 
				 * 点击取消方法 
				 */
				$('.set-inport-student-div .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
					//隐藏页面中自定义的表单内容  
					$(".set-inport-student-div").hide();
				});
//			}else{
//				$yt_alert_Model.prompt("请先勾选学员");
//			}
		
		});
		//设为重要学员弹窗里列表的取消按钮
		$(".set-inport-student-div .list-tbody").off('click').on('click','.can-tr-btn',function(){
			var thisTd=$(this);
			var projectCode = $yt_common.GetQueryString("projectCode");
			var traineeImportantList={
				isImportant:0,
				traineeId:$(this).parents('tr').find('textarea').attr('data-trainee')
			};
			traineeImportantList=JSON.stringify(traineeImportantList);
				$.ajax({
					type:"post",
					url:$yt_option.base_path + "class/trainee/updateTraineeImportant",
					data:{
					projectCode:projectCode,
					traineeImportantList:traineeImportantList
					},
					async:true,
					success:function(data){
						if(data.flag==0){
							$yt_alert_Model.prompt("取消成功");
							studentList.getStudentList();
							thisTd.parents('tr').remove();
						}else{
							$yt_alert_Model.prompt("取消失败");
						}
					}
				});
			
		});
		//点击设置班委
		$('.class-set-committee-btn').off('click').on('click', function() {
			var grouping=$('.student-div .student-list-tbody .yt-table-active td').eq(1).text();
			if($('.student-div tbody label input[type="checkbox"]:checked').length == 1) {
				if(grouping==""){
					$yt_alert_Model.prompt("请先设置分组");
					return false;
				}
				var committee = '';
				var committeeList = $('.student-div tbody label input[type="checkbox"]:checked').parent().parent().parent().data('studentList');
				console.log(committeeList);
				var committeeName = committeeList.realName;
				$('.class-student-set-committee-from .need-set-group').text(committeeName);
				$.ajax({
					type: "post",
					url: $yt_option.base_path + "class/trainee/getTraineeCommittee",
					data: {
						committee: committee
					},
					async: true,
					success: function(data) {
						var htmlBody = $('.class-student-set-committee-from .set-group-lable');
						var htmlTr = '';
						htmlBody.empty();
						if(data.flag == 0) {
							$.each(data.data, function(i, v) {
								htmlTr = '<label class="check-label yt-radio ">' +
									'<input  type="radio" name="test"  value="' + v.classCommitteeId + '"/>' + v.classCommitteeName + '</label>';
								htmlBody.append(htmlTr);

							});
							if(committeeList.classCommitteeId == 0) {
								committeeList.classCommitteeId = 4;
							}
							//设置选中
							$('.class-student-set-committee-from label').find('input[value="' + committeeList.classCommitteeId + '"]').setRadioState("check");
						}
					}
				});

				/** 
				 * 显示编辑弹出框和显示顶部隐藏蒙层 
				 */
				$(".class-student-set-committee-from").show();
				/** 
				 * 调用算取div显示位置方法 
				 */
				$yt_alert_Model.getDivPosition($(".class-student-set-committee-from"));
				/* 
				 * 调用支持拖拽的方法 
				 */
				$yt_model_drag.modelDragEvent($(".class-student-set-committee-from .yt-edit-alert-title"));
				/**
				 * 点击确定方法
				 */
				$('.class-student-set-committee-from .yt-model-sure-btn').off('click').on('click', function() {
					//班级编号
					var projectCode = $yt_common.GetQueryString("projectCode");
					//学员ID
					var traineeId = committeeList.traineeId;
					//获取班委ID
					var classCommitteeId = $('.class-student-set-committee-from .set-group-lable input[name="test"]:checked').val();
					console.log(classCommitteeId);
					//显示整体框架loading的方法
					$yt_baseElement.showLoading();
					$.ajax({
						type: "post",
						url: $yt_option.base_path + "class/trainee/updateTraineeCommittee",
						data: {
							projectCode: projectCode,
							traineeId: traineeId,
							classCommitteeId: classCommitteeId
						},
						async: true,
						success: function(data) {
							if(data.flag == 0) {
								//隐藏整体框架loading的方法
								$yt_baseElement.hideLoading(function() {
									$yt_alert_Model.prompt("设置班委成功");
									//隐藏页面中自定义的表单内容  
									$(".class-student-set-committee-from").hide();
									$('.student-div .page-info').eq(0).pageInfo("refresh");
									//studentList.getStudentList();
									studentList.getDifferentList();
								});
							} else {
								//隐藏整体框架loading的方法
								$yt_baseElement.hideLoading(function() {
									$yt_alert_Model.prompt("设置班委失败");
								});
							}
						}
					});
				});
				/** 
				 * 点击取消方法 
				 */
				$('.class-student-set-committee-from .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
					//隐藏页面中自定义的表单内容  
					$(".class-student-set-committee-from").hide();
				});
			} else {
				$yt_alert_Model.prompt("请选择学员设置班委");
			}

		});
		//点击分组职务
		$('.class-set-group-post-btn').off('click').on('click', function() {
			//分组职务
			var groupPositionType;
			//设置分组职务的普通学员
			var groupPositionText = '';
			var grouping=$('.student-div .student-list-tbody .yt-table-active td').eq(1).text();
			if($('.student-div tbody label input[type="checkbox"]:checked').length == 1) {
				if(grouping==""){
					$yt_alert_Model.prompt("请先设置分组");
					return false;
				}
				$('.class-student-set-group-post-from .set-group-lable input[name="test"]').setRadioState("undisabled");
				//判断是否只有一个组长或副组长
				var repState=studentList.judgeOnlyGroup();
				console.log(repState);
				$(".class-student-set-group-post-from").show();
				var setName = $('.student-div tbody label input[type="checkbox"]:checked').parent().parent().parent().data('studentList').realName;
				//列表选中的分组职务
				var groupPosition = $('.student-div tbody label input[type="checkbox"]:checked').parent().parent().parent().data('studentList').groupPositionType;
				var groupPositionData = $('.student-div tbody label input[type="checkbox"]:checked').parent().parent().parent().data('studentList').groupPositionData;
				if(groupPosition == 3 && $.trim(groupPositionData) == "普通学员") {//该职务为普通学员
					groupPosition = 4;
					groupPositionText=groupPositionData;
				};
				$('.class-student-set-group-post-from .set-group-lable input[name="test"][value="' + groupPosition + '"]').setRadioState("check");
				if(repState.isOrChoose==1&&repState.vicGpleader==0){
					$('.class-student-set-group-post-from .set-group-lable input[name="test"][value="1"]').setRadioState("disabled");	
					//判断当前选中行的职务
					if(groupPosition==1){
						$('.class-student-set-group-post-from .set-group-lable input[name="test"][value="1"]').setRadioState("undisabled");	
						$('.class-student-set-group-post-from .set-group-lable input[name="test"][value="1"]').setRadioState("check");	
					}else if(groupPosition==2){
						$('.class-student-set-group-post-from .set-group-lable input[name="test"][value="2"]').setRadioState("undisabled");
						$('.class-student-set-group-post-from .set-group-lable input[name="test"][value="2"]').setRadioState("check");
					}
				}else if(repState.isOrChoose==0&&repState.vicGpleader==2){
					$('.class-student-set-group-post-from .set-group-lable input[name="test"][value="2"]').setRadioState("disabled");
					//判断当前选中行的职务
					if(groupPosition==1){
						$('.class-student-set-group-post-from .set-group-lable input[name="test"][value="1"]').setRadioState("undisabled");
						$('.class-student-set-group-post-from .set-group-lable input[name="test"][value="1"]').setRadioState("check");	
					}else if(groupPosition==2){
						$('.class-student-set-group-post-from .set-group-lable input[name="test"][value="2"]').setRadioState("undisabled");
						$('.class-student-set-group-post-from .set-group-lable input[name="test"][value="2"]').setRadioState("check");
					}
				}else if(repState.isOrChoose==1&&repState.vicGpleader==2){
					$('.class-student-set-group-post-from .set-group-lable input[name="test"][value="1"]').setRadioState("disabled");
					$('.class-student-set-group-post-from .set-group-lable input[name="test"][value="2"]').setRadioState("disabled");				
					//判断当前选中行的职务
					if(groupPosition==1){
						$('.class-student-set-group-post-from .set-group-lable input[name="test"][value="1"]').setRadioState("undisabled");
						$('.class-student-set-group-post-from .set-group-lable input[name="test"][value="1"]').setRadioState("check");	
					}else if(groupPosition==2){
						$('.class-student-set-group-post-from .set-group-lable input[name="test"][value="2"]').setRadioState("undisabled");
						$('.class-student-set-group-post-from .set-group-lable input[name="test"][value="2"]').setRadioState("check");
					}
				}else{
					$('.class-student-set-group-post-from .set-group-lable input[name="test"]').setRadioState("undisabled");
				}
				if(groupPosition == 3 && groupPositionData == "普通学员") { //判断分组职务为3
					$('.class-student-set-group-post-from .set-group-lable .set-group-custom-input').hide();
					
				}else if(groupPosition == 3){
					$('.class-student-set-group-post-from .set-group-lable .set-group-custom-input').show();
					$('.class-student-set-group-post-from .set-group-lable .set-group-custom-input').val(groupPositionData);
				}else { //判断分组职务不为3
					groupPositionType=groupPosition;
					$('.class-student-set-group-post-from .set-group-lable .set-group-custom-input').hide();
				}
				$('.class-student-set-group-post-from .need-set-group').text(setName);
				//$('.class-student-set-group-post-from .set-group-lable .set-group-custom-input').hide();
				var setRadioVal = $('.class-student-set-group-post-from .set-group-lable input[name="test"]');
				setRadioVal.change(function() {
					groupPositionType = $(this).val();
					if(groupPositionType == 4){//普通学员
						groupPositionText = $(this).parent().text();
					}
					if($(this).val() == 1 || $(this).val() == 2 || $(this).val() == 4) {
						$('.class-student-set-group-post-from .set-group-lable .set-group-custom-input').hide();
					} else {
						$('.class-student-set-group-post-from .set-group-lable .set-group-custom-input').val("");
						$('.class-student-set-group-post-from .set-group-lable .set-group-custom-input').show();

					}
				});
				/** 
				 * 调用算取div显示位置方法 
				 */
				$yt_alert_Model.getDivPosition($(".class-student-set-group-post-from"));
				/* 
				 * 调用支持拖拽的方法 
				 */
				$yt_model_drag.modelDragEvent($(".class-student-set-group-post-from .yt-edit-alert-title"));
				/**
				 * 点击确定按钮
				 */
				$('.class-student-set-group-post-from .yt-model-sure-btn').off('click').on('click', function() {
					//班级编号
					var projectCode = $yt_common.GetQueryString("projectCode");
					//学员ID
					var traineeId = $('.student-div tbody label input[type="checkbox"]:checked').parent().parent().parent().data('studentList').traineeId;
					//选择自定义设置的值      
					var groupPositionData = $('.class-student-set-group-post-from .set-group-custom-input').val();
					//显示整体框架loading的方法
					$yt_baseElement.showLoading();
					if (groupPositionType == 4) {//普通学员
						groupPositionType = 3;
						groupPositionData = groupPositionText;
					}
					$.ajax({
						type: "post",
						url: $yt_option.base_path + "class/trainee/updateTraineeGroupPosition",
						data: {
							projectCode: projectCode,
							traineeId: traineeId,
							groupPositionType: groupPositionType,
							groupPositionData: groupPositionData
						},
						async: true,
						success: function(data) {
							if(data.flag == 0) {
								//隐藏整体框架loading的方法
								$yt_baseElement.hideLoading(function() {
									$yt_alert_Model.prompt("分组职务设置成功");
									//隐藏页面中自定义的表单内容  
									$(".class-student-set-group-post-from").hide();
								});
								$('.student-div .page-info').eq(0).pageInfo("refresh");
								//studentList.getStudentList();
								studentList.getDifferentList();
							} else {
								//隐藏整体框架loading的方法
								$yt_baseElement.hideLoading(function() {
									$yt_alert_Model.prompt("分组职务设置失败");
								});
							}
						}
					});
				});
				/** 
				 * 点击取消方法 
				 */
				$('.class-student-set-group-post-from .yt-eidt-model-bottom .yt-model-canel-btn').off('click').on("click", function() {
					//隐藏页面中自定义的表单内容  
					$(".class-student-set-group-post-from").hide();
				});
			} else {
				$yt_alert_Model.prompt("请选择学员添加职务");
			}

		});
		//点击分组设置分组
		$('.class-set-group-btn').off('click').on('click', function() {
			$('.class-student-set-group-from .set-group-num').val("");
			var traineeIds = '';
			var traineeNames = '';
			//判断复选框的长度
			if($('.student-div tbody label input[type="checkbox"]:checked').length != 0) {
				$('.class-student-set-group-from .set-group-selected-length').text($('.student-div tbody label input[type="checkbox"]:checked').length);
				$('.student-div tbody label input[type="checkbox"]:checked').each(function() {
					if(traineeIds == '') {
						traineeIds += $(this).parent().parent().parent().data('studentList').traineeId;
						traineeNames += $(this).parent().parent().parent().data('studentList').realName;
					} else {
						traineeIds += ', ' + $(this).parent().parent().parent().data('studentList').traineeId;
						traineeNames += ', ' + $(this).parent().parent().parent().data('studentList').realName;
					}

				});
				console.log(traineeNames);
				console.log(traineeIds);
				$('.class-student-set-group-from .set-group-list').text(traineeNames);
				/** 
				 * 显示编辑弹出框和显示顶部隐藏蒙层 
				 */
				$(".class-student-set-group-from").show();
				/** 
				 * 调用算取div显示位置方法 
				 */
				$yt_alert_Model.getDivPosition($(".class-student-set-group-from"));
				/* 
				 * 调用支持拖拽的方法 
				 */
				$yt_model_drag.modelDragEvent($(".class-student-set-group-from .yt-edit-alert-title"));
				/**
				 * 点击确定按钮
				 */
				$('.class-student-set-group-from .yt-model-sure-btn').off().on('click', function() {
					//班级编号
					var projectCode = $yt_common.GetQueryString("projectCode");
					var groupNum = $('.class-student-set-group-from .set-group-num').val();
					//显示整体框架loading的方法
					$yt_baseElement.showLoading();
					$.ajax({
						type: "post",
						url: $yt_option.base_path + "class/trainee/updateTraineeGroup",
						data: {
							projectCode: projectCode,
							groupNum: groupNum,
							traineeIds: traineeIds
						},
						async: true,
						success: function(data) {
							if(data.flag == 0) {
								//隐藏整体框架loading的方法
								$yt_baseElement.hideLoading(function() {
									$yt_alert_Model.prompt("分组设置成功");
									//隐藏页面中自定义的表单内容  
									$(".class-student-set-group-from").hide();
								});
								$('.student-div .page-info').eq(0).pageInfo("refresh");
								//studentList.getStudentList();
								studentList.getDifferentList();
							} else {
								//隐藏整体框架loading的方法
								$yt_baseElement.hideLoading(function() {
									$yt_alert_Model.prompt("分组设置失败");
								});
							}
						}
					});

				});
				/** 
				 * 点击取消方法 
				 */
				$('.class-student-set-group-from .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
					//隐藏页面中自定义的表单内容  
					$(".class-student-set-group-from").hide();
				});
			} else {
				$yt_alert_Model.prompt("请选择学员进行分组");
			}

		});
		//点击预订房间
		$('.class-reserve-room-btn').on('click', function() {
			$('.class-reserve-room-search').val("");
			var projectCode = $yt_common.GetQueryString("projectCode");
			var gender = "";
			var phone = "";
			var groupId = "";
			var orgId = "";
			var deptPosition = "";
			var isFirstTraining = "";
			var classCommitteeId = "";
			var signUpState = "";
			var checkInState = "";
			var sort = "";
			var orderType = "";
			$('.class-reserve-room-btn-img').off().click(function(){
				room();
			})
			room();
			function room(){
				$('.class-reserve-room-from .page-info').pageInfo({
				pageIndexs: 1,
				pageNum: 15, //每页显示条数  
				pageSize: 10, //显示...的规律  
				url: $yt_option.base_path + "class/trainee/getClassTrainee", //ajax访问路径  
				type: "post", //ajax访问方式 默认 "post"  
				data: {
					projectCode: projectCode,
					selectParam: $('.class-reserve-room-search').val(),
					gender: gender,
					phone: phone,
					groupId: groupId,
					orgId: orgId,
					deptPosition: deptPosition,
					isFirstTraining: isFirstTraining,
					classCommitteeId: classCommitteeId,
					signUpState: signUpState,
					checkInState: checkInState,
					sort: sort,
					orderType: orderType
				}, //ajax查询访问参数
				objName: 'data', //指获取数据的对象名称  
				before: function() {
					//显示loading
					$yt_baseElement.showLoading();
				},
				success: function(data) {
					if(data.flag == 0) {
						var htmlTbody = $('.class-reserve-room-from .list-tbody');
						var htmlTr = '';
						$(htmlTbody).empty();
						if(data.data.rows.length > 0) {
							$.each(data.data.rows, function(i, v) {
								if(v.gender == 1) {
									v.gender = "男";
								} else if(v.gender == 2) {
									v.gender = "女";
								}
//								if(v.deptPosition=="/"){
//									v.deptPosition="";
//								}
								htmlTr = '<tr>' +
									'<input type="hidden" class="reserve-room-trainee-id" value="' + v.traineeId + '"/>' +
									'<td style="text-align: left;padding-left: 20px;">' + v.realName + '</td>' +
									'<td style="text-align: center;">' + v.gender + '</td>' +
									'<td style="text-align: center;">' + v.phone + '</td>' +
									'<td style="text-align: left;">' + v.groupOrgName + '</td>' +
									'<td style="text-align: left;">' + v.deptName+v.positionName + '</td>' +
									'<td><input class="yt-input room-number" value="' + v.roomNumber + '"/></td>' +
									'</tr>';
								htmlTr = $(htmlTr).data('reserveList', v);
								htmlTbody.append(htmlTr);
							});
						} else {
							htmlTr = '<tr class="class-tr">' +
								'<td colspan="6" align="center" style="border:0px;">' +
								'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
								'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
								'</div>' +
								'</td>' +
								'</tr>';
							htmlTbody.append(htmlTr);
						}
						//隐藏loading
						$yt_baseElement.hideLoading();
					} else {
						$yt_baseElement.hideLoading(function() {
							$yt_alert_Model.prompt("查询失败");
						});
					}

				}, //回调函数 匿名函数返回查询结果  
				isSelPageNum: true //是否显示选择条数列表默认false  
			});
			}
			/**
			 * 显示编辑弹出框和显示顶部隐藏蒙层 
			 */
			$(".class-reserve-room-from").show();
			/** 
			 * 调用算取div显示位置方法 
			 */
			$yt_alert_Model.setFiexBoxHeight($(".class-reserve-room-from .yt-edit-alert-main"));
			$yt_alert_Model.getDivPosition($(".class-reserve-room-from"));
			/* 
			 * 调用支持拖拽的方法 
			 */
			$yt_model_drag.modelDragEvent($(".class-reserve-room-from .yt-edit-alert-title"));
			/**
			 * 点击确定按钮
			 */
			$('.class-reserve-room-from .yt-model-sure-btn').on('click', function() {
				//班级编号
				var projectCode = $yt_common.GetQueryString("projectCode");
				var list = [];
				$('.class-reserve-room-from .list-tbody .room-number').each(function() {
					if($(this).val() != "") {
						var traineeId = $(this).parent().parent().find('.reserve-room-trainee-id').val();
						var roomNumber = $(this).val();
						var traineeName = $(this).parent().parent().find('td').eq(0).text();
						var reserveList = {
							traineeId: traineeId,
							traineeName: traineeName,
							roomNumber: roomNumber
						};
						list.push(reserveList);
					}
				});
				//学员和房间号
				var traineeIdRoomNumber ='';
				list.length!=0?traineeIdRoomNumber = JSON.stringify(list):'';
				//显示整体框架loading的方法
				$yt_baseElement.showLoading();
				$.ajax({
					type: "post",
					url: $yt_option.base_path + "class/trainee/updateTraineeRoomNumber",
					data: {
						projectCode: projectCode,
						traineeIdRoomNumber: traineeIdRoomNumber
					},
					async: true,
					success: function(data) {
						if(data.flag == 0) {
							//隐藏整体框架loading的方法
							$yt_baseElement.hideLoading(function() {
								$yt_alert_Model.prompt("预定成功");
								studentReport.getDifferentList();
							});
						} else {
							//隐藏整体框架loading的方法
							$yt_baseElement.hideLoading(function() {
								$yt_alert_Model.prompt("预定失败");
							});
						}
					}
				});
			});
			/** 
			 * 点击取消方法 
			 */
			$('.class-reserve-room-from .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
				//隐藏页面中自定义的表单内容  
				$(".class-reserve-room-from").hide();
			});
		});
		//组内排序
		$('.student-sort-btn').click(function(){	
			$(".sortStudentAlert").show();
			studentList.sortStudent()
			/** 
			 * 调用算取div显示位置方法 
			 */
			$yt_alert_Model.setFiexBoxHeight($('.sortStudentAlert .yt-edit-alert-main'));
			$yt_alert_Model.getDivPosition($(".sortStudentAlert"));
			/* 
			 * 调用支持拖拽的方法 
			 */
			$yt_model_drag.modelDragEvent($(".sortStudentAlert .yt-edit-alert-title"));
		})
		//点击下载模板
		$('.batch-import-form .download-template').click(function() {
			var fileName = "班级学员";
			$.ajaxDownloadFile({
				url: $yt_option.base_path + "class/trainee/downloadTraineeByClass",
				data: {
					fileName: fileName
				}
			});
		});
		//点击导入弹出框的导入按钮
		$('.batch-import-form .yt-model-sure-btn').off().on('click', function() {
			//班级编号
			var projectCode = $yt_common.GetQueryString("projectCode");
			var file = $('.batch-import-form .import-file-name').val();
			var url = $yt_option.base_path + "class/trainee/leadingTraineeByClass";
			//显示整体框架loading的方法
			$yt_baseElement.showLoading();
			$.ajaxFileUpload({
				type: "post",
				url: url,
				data:{
					projectCode:projectCode
				},
				dataType: 'json',
				fileElementId: 'fileName',
				success: function(data, textStatus) {
					if(data.flag == 0) {
						$yt_baseElement.hideLoading(function() {
							$yt_alert_Model.prompt("导入成功");
							//隐藏页面中自定义的表单内容  
							$(".batch-import-form").hide();
						});
						//刷新学员列表
						studentList.getStudentList();
					} else {
						//隐藏页面中自定义的表单内容  
						$(".batch-import-form").hide();
						$yt_baseElement.hideLoading(function() {
							 $yt_alert_Model.alertOne({  
						        haveCloseIcon: true, //是否带有关闭图标  
						        leftBtnName: "确定", //左侧按钮名称,默认确定  
						        cancelFunction: "", //取消按钮操作方法*/  
						        alertMsg: data.message, //提示信息  
						        cancelFunction: function() { //点击确定按钮执行方法  
						        	$(".batch-import-form").show();
									$yt_alert_Model.getDivPosition($(".batch-import-form"));
									$yt_model_drag.modelDragEvent($(".batch-import-form .yt-edit-alert-title"));
						        },  
						    });  
						});
					}
				},
				error: function(data, status, e) { //服务器响应失败处理函数  
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("导入文件失败");
					});
				}

			});
		});
		//点击上传附件
		$(".batch-import-form").undelegate().delegate("input[type='file']", "change", function() {
			$('.batch-import-form .import-file-name').val($(this)[0].files[0].name);
			//		var url=$yt_option.acl_path+"api/tAscPortraitInfo/addMultipartFiles?modelCode=trainingCourse";
			//		//显示整体框架loading的方法
			//		$yt_baseElement.showLoading();
			//		$.ajaxFileUpload({
			//			url:url,
			//			type:'post',
			//			dataType:'json',
			//			fileElementId:'fileName',
			//			success:function(data,textStatus){
			//				var resultData = $.parseJSON(data);
			//				console.log("resultData",resultData.length);
			//				$("#fileName").val("");
			//				if(resultData.success == 0) {
			//					
			//					
			//				} else {
			//					$yt_baseElement.hideLoading(function() {
			//						$yt_alert_Model.prompt("上传文件失败");
			//					});
			//				}
			//			},
			//			error: function(data, status, e) { //服务器响应失败处理函数  
			//				$yt_baseElement.hideLoading(function() {
			//					$yt_alert_Model.prompt("上传文件失败了");
			//				});
			//			}
			//		});
		});
		//点击导入按钮
		$('.student-import-btn').off().on('click', function() {
			$(".import-file-name").val("");
			$("#fileName").val("")
			/** 
			 * 显示编辑弹出框和显示顶部隐藏蒙层 
			 */
			$(".batch-import-form").show();
			/** 
			 * 调用算取div显示位置方法 
			 */
			$yt_alert_Model.getDivPosition($(".batch-import-form"));
			/* 
			 * 调用支持拖拽的方法 
			 */
			$yt_model_drag.modelDragEvent($(".batch-import-form .yt-edit-alert-title"));
			/** 
			 * 点击取消方法 
			 */
			$('.batch-import-form .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
				//隐藏页面中自定义的表单内容  
				$(".batch-import-form").hide();
				//隐藏蒙层  
				$("#pop-modle-alert").hide();
			});
		});
		//点击导出按钮
		$('.student-upload-btn').on('click', function() {
			//班级编号
			var projectCode = $yt_common.GetQueryString("projectCode");
			var thisData=new Date();
//			console.log(thisData.toLocaleDateString());
//			var year=thisData.getFullYear();
//			var month=thisData.getMonth()+1;
//			var day=thisData.getDate();
//			if(month.length==1){
//				month="0"+month;
//			}
			var tisDate=thisData.toLocaleDateString().replace('年','/').replace('月','/').replace('日','').replace(/-/g,'/').split("/").join("");
			//var thisDate=year+""+month+""+day;
			console.log(tisDate);
			var exportName = $('.project-name:eq(0)').text() +"学员名单"+tisDate+".xls";
			var gender = "";
			var phone = "";
			var groupId = "";
			var orgId = "";
			var deptPosition = "";
			var isFirstTraining = "";
			var classCommitteeId = "";
			var signUpState = "";
			$.ajaxDownloadFile({
				url: $yt_option.base_path + "class/trainee/exportTraineeByClass",
				data: {
					projectCode: projectCode,
					exportName: exportName,
					gender: gender,
					phone: phone,
					groupId: groupId,
					orgId: orgId,
					deptPosition: deptPosition,
					isFirstTraining: isFirstTraining,
					classCommitteeId: classCommitteeId,
					signUpState: signUpState,
					yitianSSODynamicKey:$yt_common.getyitianSSODynamicKey()
				}
			});
			studentList.getStudentList();
			studentList.getDifferentList();
		});
		//点击删除按钮
		$('.student-delete-btn').on('click', function() {
			var traineeIds = '';
			var lea = [];
			if($('.student-div label input[type="checkbox"]:checked').length != 0) {
				$.each($('.student-div .student-list-tbody label input[type="checkbox"]:checked'),function(i,n) {
					if($(n).parents('tr').data('studentList').lea!=''){
						lea.push($(n).parents('tr').data('studentList').realName)
					}
					if(traineeIds == '') {
						traineeIds += $(n).parents('tr').data('studentList').traineeId;
					} else {
						traineeIds += ',' + $(n).parents('tr').data('studentList').traineeId;
					}
				});
				if(lea.length!=0){
					$yt_alert_Model.alertOne({  
				        haveCloseIcon: true, //是否带有关闭图标  
				        leftBtnName: "确定", //左侧按钮名称,默认确定  
				        cancelFunction: "", //取消按钮操作方法*/  
				        alertMsg: '['+lea.join(',')+']已请假，不可删除'//提示信息
				    });  
				    return false;
				}
				//获取班级编号
				var projectCode = $yt_common.GetQueryString("projectCode");
				$yt_alert_Model.alertOne({
					haveCloseIcon: false, //是否带有关闭图标  
					closeIconUrl: "./resources/images/icons/x.png", //关闭图标路径  
					leftBtnName: "确定", //左侧按钮名称,默认确定  
					rightBtnName: "取消", //右侧按钮名称,默认取消  
					cancelFunction: "", //取消按钮操作方法*/  
					alertMsg: "数据删除将无法恢复，确认删除吗？", //提示信息  
					confirmFunction: function() { //点击确定按钮执行方法  
						//显示整体框架loading的方法
						$yt_baseElement.showLoading();
						$.ajax({
							type: "post",
							url: $yt_option.base_path + "class/trainee/deleteTrainee",
							data: {
								projectCode: projectCode,
								traineeIds: traineeIds
							},
							async: true,
							success: function(data) {
								if(data.flag == 0) {
									//隐藏整体框架loading的方法
									$yt_baseElement.hideLoading(function() {
										$yt_alert_Model.prompt("删除成功");
										$('.check-all').setCheckBoxState('uncheck')
									});
									$('.student-div .page-info').eq(0).pageInfo("refresh");
									//studentList.getStudentList();
									studentList.getDifferentList();
								} else {
									//隐藏整体框架loading的方法
									$yt_baseElement.hideLoading(function() {
										$yt_alert_Model.prompt("删除失败");

									});
									studentList.getStudentList();
									studentList.getDifferentList();
								}
							}
						});
					},
				});
			} else {
				$yt_alert_Model.prompt("请选择需要删除的学员");
			}

		});
		var traineeId
		//点击新增
		$('.student-add-btn').on('click', function() {
			$('.class-student-phone').addClass('tip-input');
			$('.class-student-name').addClass('tip-input');
			$('.class-student-stration-form .yt-edit-alert-title-msg').text('新增学员');
			traineeId = "";
			$('.class-student-stration-form .yt-edit-alert-title-msg').text("新增学员");
			//初始化提示信息
			$(".valid-font").text("");
			//获取名字
			$('.class-student-stration-form .class-student-name').val("");
			//获取组号
			$('.class-student-stration-form .class-student-group-num').val("");;
			//获取性别
			$('.class-student-stration-form .class-student-name').parent().nextAll().find('input[type="radio"][value="1"]').setRadioState("check");
			//获取民族
			$('.class-student-stration-form .student-nation').setSelectVal("");
			//获取手机号
			$('.class-student-stration-form .class-student-phone').val("");
			//获取证件类型
			$('.class-student-stration-form .card-type').setSelectVal("");
			//获取证件号
			$('.class-student-stration-form .id-number').val("");
			//获取集团
			$('.class-student-stration-form .group-id-elementary,.class-student-stration-form .group-id-elementary-name').val("");
			//获取单位
			$('.class-student-stration-form .org-id').setSelectVal("");
			$('.class-student-stration-form .org-id').empty();
			$('.class-student-stration-form .org-id').niceSelect();
			//获取部门
			$('.class-student-stration-form .student-msg .dept-name').val("");
			// 获取职位
			$('.class-student-stration-form .student-msg .position-name').val("");
			//获取联系人姓名
			$('.class-student-stration-form .student-link-man').val("");
			//获取联系人手机号
			$('.class-student-stration-form .student-link-man-phone').val("");
			//获取联系人电话
			$('.class-student-stration-form .student-link-man-telephone').val("");
			//获取联系人传真
			$('.class-student-stration-form .student-link-man-fax').val("");
			//获取联系人邮箱
			$('.class-student-stration-form .student-link-man-email').val("");
			//获取单位地址(邮编)
			$('.class-student-stration-form .student-link-man-address-email').val("");
			//出生年月
			$('.class-student-stration-form .date-birth').val();
			//获取单位类型
			$('.class-student-stration-form .orgType').text("");
			//获取通信地址
			$('.class-student-stration-form .mailing-address').val("");
			//获取邮政编码
			$('.class-student-stration-form .postal-code').val("");
			//获取传真
			$('.class-student-stration-form .class-student-fax').val("");
			//获取入党时间
			$('.class-student-stration-form .party-date').val();
			//获取全职教育
			$('.class-student-stration-form .education-time').val("");
			//获取全职教育-毕业院校及专业
			$('.class-student-stration-form .education-time-class').val("");
			//获取在职教育
			$('.class-student-stration-form .service-time').val("");
			//获取在职教育-毕业院校及专业
			$('.class-student-stration-form .service-time-class').val("");
			//获取电话号
			$('.class-student-stration-form .telephone-project').val("");
			//获取电子邮件
			$('.class-student-stration-form .class-student-email').val("");
			//获取工作时间
			$('.class-student-stration-form .work-time').val("");
			$('.receive-group-search').val('');
			$('.valid-hint').removeClass('valid-hint');
			$('.valid-font').text('');
			/** 
			 * 显示编辑弹出框和显示顶部隐藏蒙层 
			 */
			$(".class-student-stration-form").show();
			/** 
			 * 调用算取div显示位置方法 
			 */
			$yt_alert_Model.setFiexBoxHeight($(".class-student-stration-form .yt-edit-alert-main"));
			$yt_alert_Model.getDivPosition($(".class-student-stration-form"));
			/* 
			 * 调用支持拖拽的方法 
			 */
			$yt_model_drag.modelDragEvent($(".class-student-stration-form .yt-edit-alert-title"));
			/** 
			 * 点击取消方法 
			 */
			$('.class-student-stration-form .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
				//隐藏页面中自定义的表单内容  
				$(".class-student-stration-form").hide();
				//隐藏蒙层  
				$("#pop-modle-alert").hide();
			});
		});
		//点击修改按钮
		$('.student-update-btn').off('click').on('click', function() {
			$('.receive-group-search').val('');
			$('.valid-hint').removeClass('valid-hint');
			$('.valid-font').text('');
			$('.class-student-stration-form .yt-edit-alert-title-msg').text('修改学员');
			var studenLists = $('.student-div .student-list-tbody .yt-table-active');
			if(studenLists.length==1) {
				var studentDetailedMsg = studentList.getStudentDetailedMsg();
				
				$('.class-student-form .yt-edit-alert-title-msg').text("修改学员");
				traineeId = studentDetailedMsg.traineeId;
				$('.class-student-stration-form').setDatas(studentDetailedMsg);
				//			if(studentDetailedMsg.gender=="男"){
				//				studentDetailedMsg.gender=1;
				//			}else if(studentDetailedMsg.gender=="女"){
				//				studentDetailedMsg.gender=2;
				//			}
				//获取性别
				var gender = $('.class-student-stration-form .class-student-name').parent().nextAll().find('input[type="radio"][value="' + studentDetailedMsg.gender + '"]').setRadioState("check");
				//获取民族
				$('.class-student-stration-form .student-nation').setSelectVal(studentDetailedMsg.nationId);
				//获取证件类型
				$('.class-student-stration-form .card-type').setSelectVal(studentDetailedMsg.idType);
				//获取集团
				$('.class-student-stration-form .group-id-elementary').val('');
				$('.class-student-stration-form .group-id-elementary').val(studentDetailedMsg.groupId);
				$('.class-student-stration-form .group-id-elementary-name').val(studentDetailedMsg.groupName);
				studentList.oldStudentDataMsg = studentDetailedMsg;
//				studentList.oldStudentDataMsg.groupName = $('.class-student-stration-form .group-id-elementary option:selected').text();
				groupId = studentDetailedMsg.groupId;
				var companyList = studentReport.getCompanyList(groupId);
				//单位添加数据
				if(companyList != "") {
					$('.class-student-stration-form select.org-id').empty();
					$('.class-student-stration-form select.org-id').append(' <option value="">请选择</option>');
					$.each(companyList, function(i, o) {
							$('.class-student-stration-form select.org-id').append(' <option value="' + o.groupId + '">' + o.groupName + '</option>').data('types', o.types);
					});
					$('.class-student-stration-form select.org-id').niceSelect({  
				        search: true,  
				        backFunction: function(text) {  
				            //回调方法,可以执行模糊查询,也可自行添加操作  
				            $(".class-student-stration-form select.org-id option").remove();  
				            if(text == "") {  
				                $(".class-student-stration-form select.org-id").append('<option value="">请选择</option>');  
				            }  
				            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
				            $.each(companyList, function(i, n) {  
				                if(n.groupName.indexOf(text) != -1) {  
				                    $(".class-student-stration-form select.org-id").append('<option value="' + n.groupId + '">' + n.groupName + '</option>').data('types', n.types);  
				                }  
				            });  
				        }  
				    });
					$('.class-student-stration-form .orgType').text($('select.org-id').data('types'));
					studentList.oldStudentDataMsg.orgTypeVal = $('select.org-id').data('types');
					$(".class-student-stration-form select.org-id").off().change(function() {
						if($(this).val() != '') {
							$("div.org-id").removeClass('valid-hint');
							$(this).siblings('.valid-font').text('');
						}
						$('.class-student-stration-form .orgType').text($(this).data('types'));
					})
				} else {
					$('.class-student-stration-form select.org-id').empty();
					$('.class-student-stration-form select.org-id').append(' <option value="">请选择</option>');
					$('.class-student-stration-form select.org-id').niceSelect();
				}
				//获取单位
				$('.class-student-stration-form select.org-id').setSelectVal(studentDetailedMsg.groupOrgId);
				studentList.oldStudentDataMsg.gender == 1?studentList.oldStudentDataMsg.genderVal='男':studentList.oldStudentDataMsg.genderVal='女';
				studentList.oldStudentDataMsg.nationName = $('.class-student-stration-form select.student-nation option:selected').text();
				studentList.oldStudentDataMsg.idTypeName = $('.class-student-stration-form select.card-type option:selected').text();
				/** 
				 * 显示编辑弹出框和显示顶部隐藏蒙层 
				 */
				$(".class-student-stration-form").show();
				/** 
				 * 调用算取div显示位置方法 
				 */
				$yt_alert_Model.setFiexBoxHeight($(".class-student-stration-form .yt-edit-alert-main"));
				$yt_alert_Model.getDivPosition($(".class-student-stration-form"));
				/* 
				 * 调用支持拖拽的方法 
				 */
				$yt_model_drag.modelDragEvent($(".class-student-stration-form .yt-edit-alert-title"));
				/** 
				 * 点击取消方法 
				 */
				$('.class-student-stration-form .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
					//隐藏页面中自定义的表单内容  
					$(".class-student-stration-form").hide();
					//隐藏蒙层  
					$("#pop-modle-alert").hide();
				});
			} else {
				$yt_alert_Model.prompt("请选择一条学员数据进行修改");
			}

		});

		//学员管理新增与修改确定按钮
		$(".class-student-stration-form .yt-model-sure-btn").off('click').on('click', function() {
			var afterJson = {
			//获取班级编号
			 projectCode : $yt_common.GetQueryString("projectCode"),
			 groupName:$('.class-student-stration-form .group-id-elementary-name').val(),
			 groupOrgName:$('.class-student-stration-form select.org-id option:selected').text(),
			 nationName:$('.class-student-stration-form select.student-nation option:selected').text(),
			 idTypeName : $('.class-student-stration-form select.card-type option:selected').text(),
			//获取名字
			 realName : $('.class-student-stration-form .class-student-name').val(),
			//获取性别
			 gender : $('.class-student-stration-form .class-student-name').parent().nextAll().find('input[type="radio"]:checked').val(),
			//获取民族
			 nationId : $('.class-student-stration-form .student-nation').val(),
			//获取手机号
			 phone : $('.class-student-stration-form .class-student-phone').val(),
			//获取证件类型
			 idType : $('.class-student-stration-form .card-type').val(),
			//获取证件号
			 idNumber : $('.class-student-stration-form .id-number').val(),
			//获取集团
			 groupId : $('.class-student-stration-form .group-id-elementary').val(),
			//获取单位
			 orgId : $('.class-student-stration-form .org-id').val(),
			//获取部门
			 deptName : $('.class-student-stration-form .student-msg .dept-name').val(),
			// 获取职位
			 positionName : $('.class-student-stration-form .student-msg .position-name').val(),
			//获取联系人姓名
			 linkman : $('.class-student-stration-form .student-link-man').val(),
			//获取联系人手机号
			 linkmanPhone : $('.class-student-stration-form .student-link-man-phone').val(),
			//获取联系人电话
			 linkmanTelephone : $('.class-student-stration-form .student-link-man-telephone').val(),
			//获取联系人传真
			 linkmanFax : $('.class-student-stration-form .student-link-man-fax').val(),
			//获取联系人邮箱
			 linkmanEmail : $('.class-student-stration-form .student-link-man-email').val(),
			//获取单位地址(邮编)
			 linkmanAddressEmail : $('.class-student-stration-form .student-link-man-address-email').val(),
			//出生年月
			 dateBirth : $('.class-student-stration-form .date-birth').val(),
			//获取单位类型
			 orgType : studentList.getOrgType($('.class-student-stration-form .orgType').text()),
			 orgTypeVal : $('.class-student-stration-form .orgType').text(),
			//获取通信地址
			 mailingAddress : $('.class-student-stration-form .mailing-address').val(),
			//获取邮政编码
			 postalCode : $('.class-student-stration-form .postal-code').val(),
			//获取传真
			 fax : $('.class-student-stration-form .class-student-fax').val(),
			//获取入党时间
			 partyDate : $('.class-student-stration-form .party-date').val(),
			//获取全职教育
			 educationTime : $('.class-student-stration-form .education-time').val(),
			//获取全职教育-毕业院校及专业
			 educationTimeClass : $('.class-student-stration-form .education-time-class').val(),
			//获取在职教育
			 serviceTime : $('.class-student-stration-form .service-time').val(),
			//获取在职教育-毕业院校及专业
			 serviceTimeClass : $('.class-student-stration-form .service-time-class').val(),
			//获取电话号
			 telephone : $('.class-student-stration-form .telephone-project').val(),
			//获取电子邮件
			 email : $('.class-student-stration-form .class-student-email').val(),
			//获取工作时间
			 workTime : $('.class-student-stration-form .work-time').val()
			}
			if(afterJson.gender == 1){
				afterJson.genderVal='男'
			}else if(afterJson.gender == 2){
				afterJson.genderVal='女'
			}
			var operationContent='';
			if(traineeId!=''){
				operationContent = '修改操作：【'+studentList.oldStudentDataMsg.realName+'】，'+studentList.getLogInfo(studentList.StudentJsonName,studentList.oldStudentDataMsg,afterJson);
				studentList.getLogInfo(studentList.StudentJsonName,studentList.oldStudentDataMsg,afterJson)=='；'?operationContent='':operationContent=operationContent;
			}
			if($yt_valid.validForm($(".class-student-stration-form"))) {
				//显示整体框架loading的方法
				$yt_baseElement.showLoading();
				$.ajax({
					type: "post",
					url: $yt_option.base_path + "class/trainee/addOrUpdateTrainee",
					data: {
						traineeId: traineeId,
						projectCode: afterJson.projectCode,
						realName: afterJson.realName,
						gender: afterJson.gender,
						nationId: afterJson.nationId,
						phone: afterJson.phone,
						idNumber: afterJson.idNumber,
						groupId: afterJson.groupId,
						orgId: afterJson.orgId,
						deptName: afterJson.deptName,
						positionName: afterJson.positionName,
						/*
						 此界面无法修改的内容
						 * */
						groupNum: studentList.oldStudentDataMsg.groupNum,
						//开发票类型
						invoiceType:studentList.oldStudentDataMsg.invoiceType,
						//发票类型
						invoiceModel:studentList.oldStudentDataMsg.invoiceModel,
						//名称
						orgName:studentList.oldStudentDataMsg.orgName,
						//纳税人识别号
						taxNumber:studentList.oldStudentDataMsg.taxNumber,
						//地址
						address:studentList.oldStudentDataMsg.address,
						//电话
						telephoneProject:studentList.oldStudentDataMsg.telephoneProject,
						//开户行
						registeredBank:studentList.oldStudentDataMsg.registeredBank,
						//账号
						account:studentList.oldStudentDataMsg.account,
						linkman: afterJson.linkman,
						linkmanPhone: afterJson.linkmanPhone,
						linkmanTelephone: afterJson.linkmanTelephone,
						linkmanFax: afterJson.linkmanFax,
						linkmanEmail: afterJson.linkmanEmail,
						linkmanAddressEmail: afterJson.linkmanAddressEmail,
						idType: afterJson.idType,
						dateBirth: afterJson.dateBirth,
						orgType: afterJson.orgType,
						mailingAddress: afterJson.mailingAddress,
						postalCode: afterJson.postalCode,
						fax: afterJson.fax,
						partyDate: afterJson.partyDate,
						educationTime: afterJson.educationTime,
						educationTimeClass: afterJson.educationTimeClass,
						serviceTime: afterJson.serviceTime,
						serviceTimeClass: afterJson.serviceTimeClass,
						telephone: afterJson.telephone,
						email: afterJson.email,
						workTime: afterJson.workTime,
						operationContent:operationContent,
						traineeRemarks:studentList.oldStudentDataMsg.traineeRemarks
					},
					async: true,
					success: function(data) {
						if(data.flag == 0) {
							console.log("traineeId", traineeId);
							//隐藏整体框架loading的方法
							$yt_baseElement.hideLoading(function() {
								if(traineeId == "") {
									$yt_alert_Model.prompt("添加成功");
								} else {
									$yt_alert_Model.prompt("修改成功");
								}
								studentList.getStudentList();
								$(".class-student-stration-form").hide();
							});
						} else if(data.flag == 5) {
							$yt_baseElement.hideLoading(function() {
								$yt_alert_Model.prompt(data.message);
							})
						} else if(data.flag == 2) {
							//隐藏整体框架loading的方法
							$yt_baseElement.hideLoading(function() {
								if(traineeId == "") {
									$yt_alert_Model.prompt("添加失败");
								} else {
									$yt_alert_Model.prompt("修改失败");
								}
								$('.student-div .page-info').eq(0).pageInfo("refresh");
								//studentList.getStudentList();
								$(".class-student-stration-form").hide();
							});
						}else if(data.flag == 4) {
							$yt_baseElement.hideLoading(function() {
								$yt_alert_Model.prompt(data.message);
							})
						}else{
							$yt_baseElement.hideLoading(function() {
								$yt_alert_Model.prompt('修改失败');
							})
						}
					}
				});
			} else {
//				$('.class-student-phone').removeClass('tip-input');
//				$('.class-student-name').removeClass('tip-input');
			}

		});
	},
	/**
	 * 判断每个组是否有一组长或副组长
	 */
	judgeOnlyGroup:function(){
		//是否选择组长
		var isOrChoose=0;
		//副组长
		var vicGpleader=0;
		//当前选中行的分组
		var thisGroup=$('.student-div .student-list-tbody tr.yt-table-active').data('studentList').groupNum;
		//当前选中行的分组职务
		//var thisPost=$('.student-div .student-list-tbody tr.yt-table-active').data('studentList').groupPositionType;
		//声明同一个分组
		var eqPost="";
		//循环整个列表
		$('.student-div .student-list-tbody tr').each(function(){
			if($(this).data('studentList').groupNum==thisGroup){
				if(eqPost==""){
					eqPost=($(this).data('studentList').groupPositionType);
				}else{
					eqPost+=","+($(this).data('studentList').groupPositionType);
				}
			}
		});
		//判断是否有组长或副组长
		if(eqPost.indexOf(1)!=-1){
			isOrChoose=1;
		}
		if(eqPost.indexOf(2)!=-1){
			vicGpleader=2;
		}
		console.log(eqPost);
		console.log(isOrChoose);
		return {
			isOrChoose:isOrChoose,
			vicGpleader:vicGpleader
		};
	},
	getOrgType:function(orgType){
		//1:央企集团本部 2:央企二级公司 3:央企三级公司 4:省属企业 5:市属企业 6:其他
		var orgTypes;
		if (orgType == "央企集团本部") {
			orgTypes = 1;
		}else if(orgType == "央企集团本部"){
			orgTypes = 2;
		}else if(orgType == "央企三级公司"){
			orgTypes = 3;
		}else if(orgType == "省属企业"){
			orgTypes = 4;
		}else if(orgType == "市属企业"){
			orgTypes = 5;
		}else if(orgType == "其他"){
			orgTypes = 6;
		}else{
			orgTypes ="";
		}
		return orgTypes;
	},
	/**
	 * 获取学员日志
	 */
	getStudentJournal:function(){
		var pkId = $yt_common.GetQueryString("pkId");
		var traineeId = $(".student-div .yt-table-active .trainee-id").val();
		//点击日志按钮
		$(".student-Journal-btn").click(function(){
			$('.student-Journal-form .student-Journal-page').pageInfo({
			async: true,
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			url: $yt_option.base_path + "class/trainee/getTraineeLogs", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				projectId:pkId,
				traineeId:traineeId
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			before: function() {
				//显示loading
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				var htmlTable=$('.student-Journal-form .yt-tbody');
				htmlTable.empty();
				var htmlTr='';
					if(data.flag==0){
						if(data.data.rows.length!=0){
							$('.student-Journal-form .student-Journal-page').show();
							$.each(data.data.rows, function(i,v) {
								htmlTr='<tr>'+
									'<td>'+v.projectName+'</td>'+
									'<td>'+v.operationUser+'</td>'+
									'<td>'+v.operationTime+'</td>'+
									'<td>'+v.operationContent+'</td>'+
									'</tr>';
								htmlTable.append(htmlTr);	
							});
						}else{
							$('.student-Journal-form .student-Journal-page').hide();
							htmlTr='<tr class="class-tr">'+
								'<td colspan="4" align="center" style="border:0px;">'+
									'<div class="no-data" style="width: 280px;margin: 0 auto;">'+
										'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">'+
									'</div>'+
								'</td>'+
							'</tr>';
							htmlTable.append(htmlTr);	
						}
					}else{
						$('.student-Journal-form .student-Journal-page').hide();
						htmlTr='<tr class="class-tr">'+
							'<td colspan="4" align="center" style="border:0px;">'+
								'<div class="no-data" style="width: 280px;margin: 0 auto;">'+
									'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">'+
								'</div>'+
							'</td>'+
						'</tr>';
						htmlTable.append(htmlTr);	
					}
				studentList.getStudentList();
				//隐藏loading
				$yt_baseElement.hideLoading();
				}, //回调函数 匿名函数返回查询结果
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
			/** 
			 * 显示编辑弹出框和显示顶部隐藏蒙层 
			 */
			$(".student-Journal-form").show();
			/** 
			 * 调用算取div显示位置方法 
			 */
			$yt_alert_Model.setFiexBoxHeight($(".student-Journal-form .yt-edit-alert-main"));
			$yt_alert_Model.getDivPosition($(".student-Journal-form"));
			/* 
			 * 调用支持拖拽的方法 
			 */
			$yt_model_drag.modelDragEvent($(".student-Journal-form .yt-edit-alert-title"));
			/** 
			 * 点击取消方法 
			 */
			$('.student-Journal-form .yt-eidt-model-bottom .yt-model-sure-btn').off('click').on("click", function() {
				//隐藏页面中自定义的表单内容  
				$(".student-Journal-form").hide();
			});
		});
	},
	/**
	 * 设为重要学员弹框添加数据
	 */
	setImportStudentAppend:function(){
		var setImpot=[];
		var appHtml="";
		//已勾选的行
		var checkedTr=$('.student-div .student-list-tbody label.yt-checkbox input:checked').parents('tr');
		//未勾选的行
		var noCheckedTr=$('.student-div .student-list-tbody label.yt-checkbox input[checked!=checked]').parents('tr');
			if(checkedTr.length==0){
			$.each(noCheckedTr, function(i,n) {
				$(this).data('studentList').checkedName='0';
				var getImportant=$(this).attr('isImportant');
				if(getImportant==1){
					setImpot.push($(this).data('studentList'));
				}
			});
		}else{
			//循环选中的行
			$.each(checkedTr, function(i,n) {
				$(this).data('studentList').checkedName='1';
				var getImportant=$(this).attr('isImportant');
//				if(getImportant!=1){
					setImpot.push($(this).data('studentList'));
//				}
			});
			//循环未选中的行
			$.each(noCheckedTr, function(i,n) {
				$(this).data('studentList').checkedName='0';
				var getImportant=$(this).attr('isImportant');
				if(getImportant==1){
					setImpot.push($(this).data('studentList'));
				}
			});
			//setImpot=setImpot.reverse();//给数组排序
		}
//		$.each(checkedTr, function(i,n) {
//			setImpot.push($(this).data('studentList'));
//		});
		$(".student-div .set-inport-student-div .list-tbody").empty();
		if(setImpot.length!=0){
			//setImpot=setImpot.reverse();
			$.each(setImpot, function(i,b) {
				if(b.deptPosition=="/"){
					b.deptPosition="";
				}
				if(b.checkedName==1){
					appHtml +='<tr class="yt-table-active">';
				}else{
					appHtml +='<tr>';
				}

				appHtml+='<td>'+b.realName+'</td>'+
						'<td>'+b.gender+'</td>'+
						'<td>'+b.phone+'</td>'+
						'<td>'+b.orgParentName+'</td>'+
						'<td>'+b.deptPosition+'</td>'+
						'<td style="padding:5px;"><span>'+b.importantDetails+'</span><textarea data-trainee="'+b.traineeId+'"  class="yt-textarea" style="resize: none;width:190px;height:40px;display:none;">'+b.importantDetails+'</textarea></td>';
				if(b.isImportant==1){
					//$(".student-div .set-inport-student-div thead th.opera-th").show();
					appHtml+='<td><a class="can-tr-btn yt-link">取消</a></td>';
				}else{
					//$(".student-div .set-inport-student-div thead th.opera-th").hide();
					appHtml+='<td></td>';
				}
				appHtml+='</tr>';
			});
			$(".student-div .set-inport-student-div .list-tbody").append(appHtml);
			$(".student-div .set-inport-student-div .list-tbody textarea").attr('placeholder','请输入学员原因')
		}else{
			appHtml='<tr class="class-tr">'+
						'<td colspan="7" align="ce+ter" style="border:0px;">'+
							'<div class="no-data" style="width: 280px;margin: 0 auto;">'+
								'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">'+
							'</div>'+
						'</td>'+
					'</tr>';
			$(".student-div .set-inport-student-div .list-tbody").append(appHtml);
		}
		/** 
		 * 调用算取div显示位置方法 
		 */
		$yt_alert_Model.setFiexBoxHeight($(".set-inport-student-div .yt-edit-alert-main"));
		$yt_alert_Model.getDivPosition($(".set-inport-student-div"));
	},
	/**
	 * 获取民族列表
	 */
	getStudentNationList: function() {
		var nationList = [];
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/getNations",
			data: {
				searchParameters: ""
			},
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					$.each(data.data, function(a, b) {
						nationList.push(b);
					});
				}
			}
		});
		return nationList;
	},
	/*inputval：当前input
	 * inputId：存idinput
	 * faceBack：回调函数
	 */
	//获取集团列表
	getGroupAlertList:function(inputval,inputId,sureBack,canelBack){
		$('.receive-group-div-span').text("选择集团")
		function listData(){
			$('.receive-group-page').pageInfo({
			type:"post",
			url:$yt_option.base_path+"class/noticeReception/getGroups",
			async:true,
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			before:function(){
				$yt_baseElement.showLoading();
			},
			data:{
				groupName:$('.receive-group-search').val(),
				types:1
			},
			success:function(data){
				$yt_baseElement.hideLoading();
				if(data.flag==0){
					var tr = '';
					$('.receive-group-tbody').empty();
					$.each(data.data.rows,function(i,n){
						tr = '<tr><td groupId="'+n.groupId+'">'+n.groupName+'</td></tr>';
						$('.receive-group-tbody').append(tr);
					})
					/** 
				 * 调用算取div显示位置方法 
				 */
				$(".receive-group-div").show();
				$yt_alert_Model.setFiexBoxHeight($(".receive-group-div .yt-edit-alert-main"));
				$yt_alert_Model.getDivPosition($(".receive-group-div"));
				$yt_model_drag.modelDragEvent($(".receive-group-div .yt-edit-alert-title"));
				}else{
					$yt_alert_Model.prompt('查询失败')
				}
			},
			error:function(){
				$yt_baseElement.hideLoading();
				$yt_alert_Model.prompt('查询失败')
			},
			isSelPageNum: false //是否显示选择条数列表默认false  
		});
		}
		listData();
		$('.receive-group-canel-btn').off().click(function(){
				$('.receive-group-div').hide();
				canelBack();
		})
		$('.receive-group-sure-btn').off().click(function(){
			if($('.receive-group-div .yt-table-active')[0]){
					$(inputId).val($('.receive-group-div .yt-table-active td').attr('groupId'));
					$(inputval).val($('.receive-group-div .yt-table-active td').text());	
					$('.receive-group-div').hide();
					//回调函数
					sureBack();
			}else{
				$yt_alert_Model.prompt('请选择集团单位');
			}

		})
		$('.receive-group-div .receive-group-btn-img').off().click(function(){
			listData()
		})
	},
	/**
	 * 获取集团列表
	 */
	getStudentGroupList: function() {
		$yt_baseElement.showLoading();
		var groupList = [];
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/group/getGroups",
			data: {
				isSelectGroup: 1
			},
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					$.each(data.data, function(a, b) {
						groupList.push(b);
					});
				}
			}
		});
		return groupList;
	},
	/**
	 * 获取单位列表
	 */
	getStudentCompanyList: function(groupId) {
		var companyList = [];
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/group/getGroups",
			data: {
				isSelectGroup: 3,
				groupId: groupId
			},
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					console.log("成功");
					$.each(data.data, function(a, b) {
						companyList.push(b);
					});
				}
			}
		});
		return companyList;
	},
	/**
	 * 获取一个学员的详细信息
	 */
	oldStudentDataMsg:{},
	getStudentDetailedMsg: function() {
		var me = this ;
		//var studentList=$('.student-div .yt-table-active').data('studentList');
		var traineeId = $(".student-div .yt-table-active .trainee-id").val();
		var studentDetailedMsg;
		//获取班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/trainee/getTraineeDetails",
			data: {
				traineeId: traineeId,
				projectId: projectCode
			},
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					data.data.workTime=="0000-00-00"?data.data.workTime='':data.data.workTime=data.data.workTime;
					studentDetailedMsg = data.data;
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading();
				}
			}
		});
		return studentDetailedMsg;
	},
	/**
	 * 点击学员详情
	 */
	clickStudentDetails:function(){
			//点击学员姓名查看详情
		$('.box-list,repeat-list-tbody').off('click').on('click','.real-name-inf', function() {
			//var studentList=$('.yt-table-active').data('studentList');
			var traineeId = $(this).prev().val();
			var headImg = new Image();
			//获取班级编号
			var projectCode = $yt_common.GetQueryString("projectCode");
			//显示整体框架loading的方法
			$yt_baseElement.showLoading();
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "class/trainee/getTraineeDetails",
				data: {
					traineeId: traineeId,
					projectId: projectCode
				},
				async: true,
				success: function(data) {
					var htmlBody = $('.student-details-form .student-details-train-record tbody');
					var htmlTrs = '';
					htmlBody.empty();
					if(data.flag == 0) {
						data.data.workTime=="0000-00-00"?data.data.workTime='':data.data.workTime=data.data.workTime;
						detailsMsg = data.data;
						//证件类型   1:身份证 2:护照 3:军官证 4:其他
						if(data.data.idType == 1){
							$(".stu-id-type").text("身份证");
						}else if(data.data.idType == 2){
							$(".stu-id-type").text("护照");
						}else if(data.data.idType == 3){
							$(".stu-id-type").text("军官证");
						}else if(data.data.idType == 4){
							$(".stu-id-type").text("其他");
						}
						detailsMsg.checkInDate = detailsMsg.checkInDate.split(" ")[0];
						//性别
						if(detailsMsg.gender == 1) {
							detailsMsg.gender = "男";
						} else if(detailsMsg.gender == 2){
							detailsMsg.gender = "女";
						}else{
							detailsMsg.gender = "";
						}
						//发票类型
						if(detailsMsg.invoiceType == 0) {
							detailsMsg.invoiceType = "暂不开票";
						} else if(detailsMsg.invoiceType == 1) {
							detailsMsg.invoiceType = "普通发票";
						} else {
							detailsMsg.invoiceType = "增值税发票";
						}
						//报到状态
						if(detailsMsg.checkInState == 0) {
							detailsMsg.checkInState = "未报到";
						} else {
							detailsMsg.checkInState = "已报到";
						}
						//缴费（对账）状态
						if(detailsMsg.paymentState == 0) {
							detailsMsg.paymentState = "未对账";
						} else {
							detailsMsg.paymentState = "已对账";
						}
						//开票状态
						if(detailsMsg.isOrderNum == 0) {
							detailsMsg.isOrderNum = "未开票";
						} else {
							detailsMsg.isOrderNum = "已开票";
						}
						$('.student-details-form .cont-edit-test').setDatas(detailsMsg);

						console.log("学员头像", detailsMsg.headPortraitUrl);
						if(detailsMsg.headPortrait != "") {
							headImg.src = detailsMsg.headPortraitUrl;
							headImg.onload = function() {
								$('.student-details-img').attr('src', headImg.src);
								$('.student-details-img').jqthumb({
									width: 89,
									height: 130
								});
							};
						} else {
							$('.student-details-img').attr('src', '../../resources/images/classStudent/student-picture.png');
							$('.student-details-img').jqthumb({
								width: 89,
								height: 130
							});
						}
						//开票信息
					var recordList = data.data.orderList;
					var recordBody = $('.student-details-order-record .order-list-tbody').empty();
					var recordHtml = '';
					if (recordList.length != 0) {
						$.each(recordList, function(i,v) {
							v.isOrderNum==1?v.isOrderNum='已开票':v.isOrderNum='未开票';
							recordHtml='<tr>'+
							'<td style="text-align: right;" width="80px">开票状态：</td>'+
							'<td style="text-align: left;" width="150px">'+v.isOrderNum+'</td>';
							if (v.isOrderNum == "已开票") {
								recordHtml += '<td class="order-num" style="text-align: right;" width="80px">发票号：</td>'+
								'<td style="text-align: left;" width="120px">'+v.orderNum+'</td>'+
								'<td class="order-money" style="text-align: right;" width="80px">开票金额：</td>'+
								'<td style="text-align: left;" width="120px">'+v.tuition+'</td>';
							}
							recordHtml +='<td width="80px"><div class="addorder addorder'+i+'" style="display:none;padding: 5px 10px;border: 1px dashed #E6E6E6;cursor: pointer;">合并开票</div></td>'
							'</tr>';
							recordBody.append(recordHtml);
							var trainees = "";
							if(v.trainees != undefined){
								trainees = v.trainees.split(',');
							}
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
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td width="77px" align="right" style="border:0px;">开票状态：</td>' +
							'<td align="left" style="border:0px;">未开票</td>' +
							'</tr>';
							recordBody.append(htmlTr);
					}
						//添加培训记录
						$.each(detailsMsg.trainList, function(i, b) {
							if (b.dataStates == 6 || b.dataStates == 4) {//datatates值为6或4显示项目（班级code）
								b.projectCode = b.projectCode
							}else{//datatates值不为6或4的项目（班级）code是乱码，不显示code
								b.projectCode = "";
							}
							htmlTrs = '<tr>' +
								'<td style="text-align: center;">' + b.projectCode + '</td>' +
								'<td style="text-align: left;">' + b.projectName + '</td>' +
								'<td style="text-align: center;">' + b.startDate + '</td>' +
								'<td>' + b.projectHead + '</td>' +
								'<td>' + b.certificateNo + '</td>' +
								'</tr>';
							htmlBody.append(htmlTrs);
						});
						
					}
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading();
				}
			});
			/** 
			 * 显示编辑弹出框和显示顶部隐藏蒙层 
			 */
			$(".student-details-form").show();
			/** 
			 * 调用算取div显示位置方法 
			 */
			$yt_alert_Model.setFiexBoxHeight($(".student-details-form .yt-edit-alert-main"));
			$yt_alert_Model.getDivPosition($(".student-details-form"));
			/* 
			 * 调用支持拖拽的方法 
			 */
			$yt_model_drag.modelDragEvent($(".student-details-form .yt-edit-alert-title"));
			/** 
			 * 点击关闭方法
			 */
			$('.student-details-form .yt-eidt-model-bottom .yt-model-sure-btn').off().on("click", function() {
				//隐藏页面中自定义的表单内容  
				$(".student-details-form").hide();
			});
		});
	},
	/**
	 * 查询学员列表
	 */
	getStudentList: function() {
		var projectCode = $yt_common.GetQueryString("projectCode");
		var selectParam = $('.student-div .keyword').val();
		var gender = "";
		var phone = "";
		var groupId = "";
		var orgId = "";
		var deptPosition = "";
		var isFirstTraining = "";
		var classCommitteeId = "";
		var signUpState = "";
		var checkInState = "";
		var sort = "";
		var orderType = "";
		$('.student-div .tab-content thead').eq(0).find('label input').setCheckBoxState('uncleck');
		$('.student-div .page-info').eq(0).pageInfo({
			async: true,
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "class/trainee/getClassTrainee", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				projectCode: projectCode,
				selectParam: selectParam,
				gender: gender,
				phone: phone,
				groupId: groupId,
				orgId: orgId,
				deptPosition: deptPosition,
				isFirstTraining: isFirstTraining,
				classCommitteeId: classCommitteeId,
				signUpState: signUpState,
				checkInState: checkInState,
				sort: sort,
				orderType: orderType
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			before: function() {
				//显示loading
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.student-div .student-list-tbody');
					var htmlTr = '';
					var num = 1;
					var groupPositionTypeName;
					var fh = "/";
					$(htmlTbody).empty();
					if(data.data.rows.length > 0) {
						$('.student-div .page-info').show();
						$.each(data.data.rows, function(i, v) {
							if(v.gender == 1) {
								v.gender = "男";
							} else if(v.gender == 2) {
								v.gender = "女";
							}
//							if(v.classCommitteeName != '') {
//								var groupnameArr = [v.classCommitteeName];
//							} else {
//								var groupnameArr = []
//							}
							if(v.groupPositionType == 1) {
								groupPositionTypeName = "组长";
								//groupnameArr.push('组长')
							}else if(v.groupPositionType == 2) {
								groupPositionTypeName = "副组长";
								//groupnameArr.push('副组长')
							}else if(v.groupPositionType == 3) {
								groupPositionTypeName = v.groupPositionData;
								if($.trim(groupPositionTypeName)=="普通学员"){
									groupPositionTypeName="";
								}
								//groupnameArr.push(v.groupPositionData)
							}else{
								groupPositionTypeName = "";
							}
							if(v.groupPositionType == "") {
								groupPositionTypeName ="";
								fh="";
							}
							if(v.classCommitteeName == "普通学员" || v.classCommitteeName == ""){
								v.classCommitteeName = "";
								fh = "";
							}
							if(v.classCommitteeName != "" && v.groupPositionType != ""){
								fh = "/";
							}else{
								fh="";
							}
							if(v.deptPosition=="/"){
								v.deptPosition="";
							}
							if(v.classCommitteeName==""||groupPositionTypeName==""){
								fh='';
							}
							if(v.isImportant==1){
								htmlTr = '<tr class="is-important" isImportant="'+v.isImportant+'">';
							}else{
								htmlTr = '<tr isImportant="">';
							}
							htmlTr+='<td><label style="margin-left:4px;" class="check-label yt-checkbox">' +
								'<input class="check-box" type="checkbox"/>' +
								'</label>'+
//								'<div class="checkbox-top"></div>'+
								'</td>' +
								'<td style="text-align: center;"><input type="hidden" value="' + v.pkId + '" class="pkId">' + v.groupNum + '</td>' +
								'<td style="text-align: left;"><input type="hidden" value="' + v.traineeId + '" class="trainee-id"><a href="#" class="real-name-inf" style=" color:#3c4687;word-break: break-all;">' + v.realName + '</a></td>' +
								'<td style="text-align: center;">' + v.gender + '</td>' +
								'<td style="text-align: center;">' + v.phone + '</td>' +
								'<td style="text-align: left;">' + v.groupName + '</td>' +
								'<td style="text-align: left;">' + v.groupOrgName + '</td>' +
								'<td style="text-align: left;">' +v.deptName+v.positionName + '</td>' +
								//班委
								'<td style="text-align: left;">' + v.classCommitteeName+fh+groupPositionTypeName+ '</td>';
							if(v.isFirstTraining == 0) {
								v.isFirstTraining = "否";
								htmlTr += '<td class="color-yellow" style="text-align: center;">' + v.isFirstTraining + '</td>' +
									'</tr>';
							} else {
								v.isFirstTraining = "是";
								htmlTr += '<td style="text-align: center;">' + v.isFirstTraining + '</td>' +
									'</tr>';
							}
							htmlTr = $(htmlTr).data('studentList', v);
							htmlTbody.append(htmlTr);
						});
						//隐藏loading
						$yt_baseElement.hideLoading();
					} else {
						$('.student-div .page-info').hide();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="10" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						htmlTbody.append(htmlTr);
						//隐藏loading
						$yt_baseElement.hideLoading();
					}
					
					//点击当前行选中当前行并且复选框被勾选
					$(".student-div .student-list-tbody").off().on("click",'tr',function() {
						if($(this).find("input[type='checkbox']")[0].checked == true) {
							$(this).find("input[type='checkbox']").setCheckBoxState("uncheck");
							$(this).removeClass("yt-table-active");
						} else {
							$(this).find("input[type='checkbox']").setCheckBoxState("check");
							$(this).addClass("yt-table-active");
						}
						if($(this).parents("table").find("tbody input[type='checkbox']").length != $(this).parents("table").find("tbody input[type='checkbox']:checked").length) {
							$(this).parents("table").find(".check-all").setCheckBoxState("uncheck");
						} else {
							$(this).parents("table").find(".check-all").setCheckBoxState("check");
						}
					});
				
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
	 * 查询酒店入住名单与学员列表不匹配列表
	 */
	getDifferentList: function() {
		//班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/trainee/getHotelTraineeToClassTrainee",
			data: {
				projectCode: projectCode
			},
			async: true,
			success: function(data) {
				var htmlBody = $('.student-div .different-student-list tbody ');
				var htmlTr = '';
				var num = 1;
				if(data.flag == 0) {
					if(data.data.length > 0) {
						htmlBody.parent().parent().show();
						htmlBody.empty();
						$.each(data.data, function(k, b) {
							b.gender == 1?b.gender='男':b.gender='女';
							htmlTr = '<tr>' +
								'<td>' + num++ + '</td>' +
								'<td style="text-align: left;">' + b.traineeName + '</td>' +
								'<td>' + b.gender + '</td>' +
								'<td>' + b.idNumber + '</td>' +
								'<td>' + b.roomNumber + '</td>' +
								'<td>' + b.createTimeString + '</td>' +
								'<td style="text-align: left;">' + b.reason + '</td>' +
								'</tr>';
							htmlBody.append(htmlTr);
						});
					} else {
						htmlBody.parent().parent().hide();
					}

				} else {
					$yt_alert_Model.prompt("查询失败");
				}
			}
		});
	},
	//流程日志转换格式
	getLogInfo: function(objName,obj1,obj2){
	var logTestArr = [];
	if(obj1!=null){
		for (var keyName in objName) {
			if(obj1[keyName]!=undefined && obj2[keyName]!=undefined && obj1[keyName]!=obj2[keyName]){
				obj2[keyName]=='请选择'?obj2[keyName]='':obj2[keyName]=obj2[keyName];
				obj1[keyName]=='请选择'?obj1[keyName]='':obj1[keyName]=obj1[keyName];
				logTestArr.push(objName[keyName]+"：“"+obj1[keyName]+"”修改为“"+obj2[keyName]+"”");
			}
		}
	}else{
		for (var keyName in objName) {
			logTestArr.push(objName[keyName]+"：“"+obj2[keyName]+"”");
		}
	}
	console.log(logTestArr.join('；')+('；'));
	return logTestArr.join('；')+('；')
	},
	 //名称
	StudentJsonName:{
				projectName:"班级",
				realName:"姓名",
				groupNum:"组号",
				genderVal:"性别",
				phone:"手机号",
				nationName:"民族",
				idNumber:"证件号码",
				groupName:"集团",
				groupOrgName:"单位",
				deptName:"部门",
				positionName:"职务",
				invoiceTypeVel:"开发票类型",
				invoiceModel:"发票类型",
				orgName:"名称",
				taxNumber:"纳税人识别号",
				address:"地址",
				telephoneProject:"电话",
				registeredBank:"开户行",
				account:"账号",
				idTypeName:"证件类型",
				dateBirth:"出生年月",
				orgTypeVal:"单位类型",
				mailingAddress:"通信地址",
				postalCode:"邮政编码",
				fax:"传真",
				partyDate:"入党时间",
				educationTime:"全职教育",
				educationTimeClass:"全职教育-毕业院校及专业",
				serviceTime:"在职教育",
				serviceTimeClass:"在职教育-毕业院校及专业",
				linkman:"联系人-姓名",
				linkmanPhone:"联系人-手机号",
				linkmanTelephone:"联系人-电话",
				linkmanFax:"联系人-传真",
				linkmanEmail:"联系人-邮箱",
				linkmanAddressEmail:"联系人-单位地址(邮编)",
				telephone:"电话",
				email:"电子邮箱",
				workTime:"参加工作时间",
				traineeRemarks:'备注'
		},
	//组内排序
	sortStudent:function(first){
		$.ajax({
			type:"post",
			url:$yt_option.base_path+"class/trainee/getClassTraineeByOrder",
			async:false,
			data:{
				projectCode:$yt_common.GetQueryString("projectCode")
			},
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			success:function(data){
				if(data.flag==0){
					var groupArr=[];
					var switchHtml = $('.sortStudentpageSwitch').empty();
					var switchBtn = '';
					var sortStudentTr='';
					//是否修改过标识
					var whether = true;
					$.each(data.data, function(i,n) {
						if(groupArr.indexOf(n.groupNum)==-1&&n.groupNum!=''){
							switchBtn = '<button class="yt-option-btn switch-btn sortStudentpageSwitchButton" style="width:11%" data-group="'+n.groupNum+'">' + n.groupNum + '组</button>';
							switchHtml.append(switchBtn);
							groupArr.push(n.groupNum);
						}
						
					});
					if(first){
						$.each($('.sortStudentpageSwitchButton'), function(k,j) {
							if($(j).attr('data-group')==first){
								$(j).addClass('switch-btn-change');
								sort($(j).attr('data-group'));
							}
						});
					}else{
						$('.sortStudentpageSwitchButton').eq(0).addClass('switch-btn-change');
						sort($('.sortStudentpageSwitchButton').eq(0).attr('data-group'));
					}
					function sort(num){
						$yt_baseElement.showLoading();
						var sortStudentTbody = $('.sortStudentTbody').empty();
						$.each(data.data,function(j,v){
							if(v.groupNum==num){
								var Committeegroup=[];
								if(v.classCommitteeName!='普通学员'&&v.classCommitteeName!=''){
									Committeegroup.push(v.classCommitteeName);
								}
								if(v.groupPositionType==3){
									//清除左右空格
									v.groupPositionData = v.groupPositionData.replace(/(^\s*)|(\s*$)/g, "");
									if(v.groupPositionData!='普通学员'){
										Committeegroup.push(v.groupPositionData);
									}
								}else if(v.groupPositionType==1){
									Committeegroup.push('组长');
								}else if(v.groupPositionType==2){
									Committeegroup.push('副组长');
								}
								 Committeegroup = Committeegroup.join('/')
								v.gender==1?v.gender='男':v.gender='女'
								sortStudentTr = '<tr><td style="text-align: center;">' + v.groupNum + '</td>' +
									'<td style="text-align: left;">' + v.realName + '</td>' +
									'<td style="text-align: center;">' + v.gender + '</td>' +
									'<td style="text-align: center;">' + v.phone + '</td>' +
									'<td style="text-align: left;">' + v.groupOrgName + '</td>' +
									'<td style="text-align: left;">' +v.deptName+v.positionName + '</td>' +
									'<td style="text-align: left;">' + Committeegroup+ '</td>'+
									'<td style="text-align: center;"><input type="text" class="yt-input" style="width:50px;margin-right:15px" value="1"/><img class="orderBy-dele-img img-size moveUp" style="margin-right:15px" src="../../resources/images/icons/moveUp.png"><img class="orderBy-dele-img img-size moveDown" src="../../resources/images/icons/moveDown.png"></td></tr>';
								sortStudentTr = $(sortStudentTr).data('data',v);
								sortStudentTbody.append(sortStudentTr);
							}
						})
						$(sortStudentTbody).find('input').off('keyup').keyup(function(){
							this.value=this.value.replace(/\D/g,'')
						})
						$yt_baseElement.hideLoading();
					}
					/*
					 切换组签
					 * */
					$('.sortStudentpageSwitchButton').off().click(function(){
						var me = this;
						if(whether==false){
							$('.yt-alert-whether').show();
							$('.yt-alert-whether .yt-model-sure-btn').off().click(function(){
								whether = true;
								$(me).addClass('switch-btn-change').siblings().removeClass('switch-btn-change');
								sort($(me).attr('data-group'));
								$('.yt-alert-whether').css('display','none');
							})
						}else{
							whether = true;
							$(this).addClass('switch-btn-change').siblings().removeClass('switch-btn-change');
							sort($(this).attr('data-group'));
						}
					})
					$('.yt-alert-whether .yt-model-canel-btn').off().click(function(){
							$('.yt-alert-whether').css('display','none');
					})
					/*
					 
					 * 上移
					 * */
					$('.sortStudentTbody').off().on('click','.moveUp',function(){
						whether = false;
						var index = $(this).parents('tr').index();
						var moveNum = index-Number($(this).siblings('input').val());
						moveNum<0?moveNum=0:moveNum=moveNum;
						if($(this).css('opacity') != 0.2) {
							$('.sortStudentTbody tr').eq(moveNum).before($(this).parents('tr').clone().data('data',$(this).parents('tr').data('data')));
							$(this).parents('tr').remove();
						}
						return false;
					})
					/*
					 
					 * 下移
					 * */
					$('.sortStudentAlert').off().on('click','.moveDown',function(){
						whether = false;
						var index = $(this).parents('tr').index();
						var moveNum = index+Number($(this).siblings('input').val());
						moveNum>=$('.sortStudentTbody tr').length?moveNum=$('.sortStudentTbody tr').length-1:moveNum=moveNum;
						if($(this).css('opacity') != 0.2) {
							$('.sortStudentTbody tr').eq(moveNum).after($(this).parents('tr').clone().data('data',$(this).parents('tr').data('data')));
							
							$(this).parents('tr').remove();
						}
						return false;
					});
					/*
					 排序保存
					 * */
					$('.sortStudentSure').off().click(function(){
						var traineeOrders = [];
						var groupnum = '';
						$.each($('.sortStudentTbody tr'), function(i,n) {
							traineeOrders.push({
								classTraineeId: $(n).data('data').classTraineeId,
								traineeOrder:(i+1)
							})
							groupnum = $(n).data('data').groupNum;
						});
						traineeOrders = JSON.stringify(traineeOrders);
						whether = studentList.sortSave(traineeOrders,groupnum);
					})
					/** 
					 * 点击取消方法 
					 */
					$('.sortStudentAlert .yt-eidt-model-bottom .sortStudentCanel').off().on("click", function() {
						if(whether==false){
							$('.yt-alert-whether').show();
							$('.yt-alert-whether .yt-model-sure-btn').off().click(function(){
								whether = true;
								studentList.getStudentList();
								//隐藏页面中自定义的表单内容  
								$(".sortStudentAlert").hide();
								//隐藏蒙层  
								$("#pop-modle-alert").hide();
								$('.yt-alert-whether').css('display','none');
							})
						}else{
							whether = true;
							studentList.getStudentList();
							//隐藏页面中自定义的表单内容  
							$(".sortStudentAlert").hide();
							//隐藏蒙层  
							$("#pop-modle-alert").hide();
							$('.yt-alert-whether').css('display','none');
						}
						
					});
				}else{
					$yt_alert_Model.prompt('查询失败')
				}
				$yt_baseElement.hideLoading();
				
			},
			error:function(){
				$yt_baseElement.hideLoading(function(){
					$yt_alert_Model.prompt('网络异常，查询失败')
				});
			}
		});
	},
	sortSave:function(traineeOrders,groupnum){
		var bool = false;
		$.ajax({
			type:"post",
			url:$yt_option.base_path+"class/trainee/updateClassTraineeByOrder",
			async:false,
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			data:{
				traineeOrders:traineeOrders
			},
			success:function(data){
				if(data.flag==0){
					bool = true;
					$yt_alert_Model.prompt('保存成功');
					studentList.sortStudent(groupnum);
				}else{
					$yt_alert_Model.prompt('保存失败')
				}
				$yt_baseElement.hideLoading();
			},
			error:function(){
				$yt_baseElement.hideLoading(function(){
					$yt_alert_Model.prompt('网络异常，保存失败')
				});
			}
		});
		return bool;
	}

}
/**
 * 重复来院名单
 */
var repeatCourtyardList = {
	init: function() {

		//点击姓名进行排序
		var sortNum = '';
		$('.repeat-come-div thead th').eq(1).click(function() {
			if(sortNum == '') {
				var orderType = "ASC";
				repeatCourtyardList.getRepeatComeList(orderType);
				sortNum = 1;
			} else {
				var orderType = "DESC";
				repeatCourtyardList.getRepeatComeList(orderType);
				sortNum = '';
			}
		});
		//点击导出重复来院名单按钮
		$('.repeat-come-div .export-repeat-btn').on('click', function() {
			//班级编号
			var projectCode = $yt_common.GetQueryString("projectCode");
			var selectParam = $('.repeat-come-div .keyword').val();
			var gender = "";
			var phone = "";
			var orgId = "";
			var deptPosition = "";
			var startTimeStart = "";
			var startTimeEnd = "";
			var endTimeStart = "";
			var endTimeEnd = "";
			$.ajaxDownloadFile({
				url: $yt_option.base_path + "class/trainee/exportRepeatClassTrainee",
				data: {
					projectCode: projectCode,
					gender: gender,
					phone: phone,
					orgId: orgId,
					deptPosition: deptPosition,
					startTimeStart: startTimeStart,
					startTimeEnd: startTimeEnd,
					endTimeStart: endTimeStart,
					endTimeEnd: endTimeEnd,
					yitianSSODynamicKey:$yt_common.getyitianSSODynamicKey()
				}
			});
		});
		//点击疑似重复来院名单导出按钮
		$('.repeat-come-div .export-doubt-repeat-btn').on('click', function() {
			//班级编号
			var projectCode = $yt_common.GetQueryString("projectCode");
			var selectParam = $('.repeat-come-div .doubt-keyword').val();
			var gender = "";
			var phone = "";
			var orgId = "";
			var deptPosition = "";
			var startTimeStart = "";
			var startTimeEnd = "";
			var endTimeStart = "";
			var endTimeEnd = "";
			$.ajaxDownloadFile({
				url: $yt_option.base_path + "class/trainee/exportRepeatClassDoubtfulTrainee",
				data: {
					projectCode: projectCode,
					gender: gender,
					phone: phone,
					orgId: orgId,
					deptPosition: deptPosition,
					startTimeStart: startTimeStart,
					startTimeEnd: startTimeEnd,
					endTimeStart: endTimeStart,
					endTimeEnd: endTimeEnd,
					yitianSSODynamicKey:$yt_common.getyitianSSODynamicKey()
				}
			});
		});
	},
	/**
	 * 查询重复来院名单列表
	 */
	getRepeatComeList: function(orderType) {
		//班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		//模糊查询
		var selectParam = $('.repeat-come-div .keyword').val();
		var gender = "";
		var phone = "";
		var orgId = "";
		var deptPosition = "";
		var startTimeStart = "";
		var startTimeEnd = "";
		var endTimeStart = "";
		var endTimeEnd = "";
		var sort = "";
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/trainee/getRepeatClassTrainee", //ajax访问路径
			data: {
				projectCode: projectCode,
				selectParam: selectParam,
				gender: gender,
				phone: phone,
				orgId: orgId,
				deptPosition: deptPosition,
				startTimeStart: startTimeStart,
				startTimeEnd: startTimeEnd,
				endTimeStart: endTimeStart,
				endTimeEnd: endTimeEnd,
				sort: sort,
				orderType: orderType
			},
			async: false,
			success: function(data) {
				var htmlBody = $('.repeat-come-div .repeat-list-tbody');
				var htmlTr = "";
				var num = 1;
				htmlBody.empty();
				if(data.flag == 0) {
					var rowSpanNum = 1;
					var mergeName = '';
					var mergePhone = '';
					var lastTr;
					if(data.data.rows.length != 0) {
						$('.teacher-info-model').show();
						$('.repeat-come-div-nodata').remove();
						$.each(data.data.rows, function(i, n) {
							//合并
							htmlTr = '<tr>';
							if(mergeName != (n.realName + "-----" + n.phone)) {
								$('.repeat-come-div .repeat-list-tbody tr').eq(lastTr).find("td").eq(0).attr("rowSpan", rowSpanNum);
								$('.repeat-come-div .repeat-list-tbody tr').eq(lastTr).find("td").eq(1).attr("rowSpan", rowSpanNum);
								$('.repeat-come-div .repeat-list-tbody tr').eq(lastTr).find("td").eq(2).attr("rowSpan", rowSpanNum);
								$('.repeat-come-div .repeat-list-tbody tr').eq(lastTr).find("td").eq(3).attr("rowSpan", rowSpanNum);
								lastTr = i;
								mergeName = n.realName + "-----" + n.phone;
								if(n.gender == 1) {
									n.gender = "男";
								} else if(n.gender == 2){
									n.gender = "女";
								} else{n.gender = ""}
								htmlTr += '<td>' + num++ + '</td>' +
									'<td style=" word-break: break-all;">' + n.realName + '</td>' +
									'<td>' + n.gender + '</td>' +
									'<td>' + n.phone + '</td>';
								rowSpanNum = 1;
							} else {
								rowSpanNum++;
							}
							htmlTr += '<td>' + n.projectCode + '</td>' +
								'<td>' + n.projectName + '</td>' +
								'<td>' + n.startTime + '</td>' +
								'<td>' + n.endTime + '</td>' +
								'<td>' + n.orgName + '</td>' +
								'<td>' + n.deptPosition + '</td>' +
								'</tr>';
							htmlBody.append(htmlTr);
						});
						$('.repeat-come-div .repeat-list-tbody tr').eq(lastTr).find("td").eq(0).attr("rowSpan", rowSpanNum);
						$('.repeat-come-div .repeat-list-tbody tr').eq(lastTr).find("td").eq(1).attr("rowSpan", rowSpanNum);
						$('.repeat-come-div .repeat-list-tbody tr').eq(lastTr).find("td").eq(2).attr("rowSpan", rowSpanNum);
						$('.repeat-come-div .repeat-list-tbody tr').eq(lastTr).find("td").eq(3).attr("rowSpan", rowSpanNum);
//						var gender ='';
//						if(n.gender == 1) {
//							gender = "男";
//						} else {
//							gender = "女";
//						}
//						//不合并
//						htmlTr = '<tr>'+
//								'<td>' + num++ + '</td>' +
//								'<td style=" word-break: break-all;text-align:left;"><input type="hidden" value="'+n.traineeId+'" class="trainee-id"><a href="#" class="real-name-inf" style=" color:#3c4687;">' + n.realName + '</a></td>' +
//								'<td>' + gender + '</td>' +
//								'<td>' + n.phone + '</td>'+
//								'<td>' + n.projectCode + '</td>' +
//								'<td style="text-align:left;">' + n.projectName + '</td>' +
//								'<td>' + n.startTime + '</td>' +
//								'<td>' + n.endTime + '</td>' +
//								'<td style="text-align:left;">' + n.orgName + '</td>' +
//								'<td style="text-align:left;">' + n.deptPosition + '</td>' +
//								'</tr>';
//								htmlBody.append(htmlTr);
//						});
						
						//隐藏整体框架loading的方法
						$yt_baseElement.hideLoading();
					} else {
						$('.teacher-info-model').hide();
						if($('.teacher-info-model-may').css('display') == 'none' && $('.teacher-info-model').css('display') == 'none') {
							if($('.repeat-come-div').find('.repeat-come-div-nodata')[0] == undefined) {
								$('.repeat-come-div').append('<div class="no-data repeat-come-div-nodata" style="width: 280px;margin: 0 auto;"><img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;"></div>')
							}
						}
						//隐藏整体框架loading的方法
						$yt_baseElement.hideLoading();
					}

				} else {
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt('查询失败');
					});
				}
			}
		});
	},
	/**
	 * 查询疑似重复来院名单
	 */
	doubtRepatComeList: function() {
		//班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		//模糊查询
		var selectParam = $('.repeat-come-div .doubt-keyword').val();
		var gender = "";
		var phone = "";
		var orgId = "";
		var deptPosition = "";
		var startTimeStart = "";
		var startTimeEnd = "";
		var endTimeStart = "";
		var endTimeEnd = "";
		var sort = "";
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/trainee/getRepeatClassDoubtfulTrainee", //ajax访问路径
			data: {
				projectCode: projectCode,
				selectParam: selectParam,
				gender: gender,
				phone: phone,
				orgId: orgId,
				deptPosition: deptPosition,
				startTimeStart: startTimeStart,
				startTimeEnd: startTimeEnd,
				endTimeStart: endTimeStart,
				endTimeEnd: endTimeEnd
			},
			async: false,
			success: function(data) {
				var htmlBody = $('.repeat-come-div .doubt-repeat-list-tbody');
				var htmlTr = "";
				var num = 1;
				htmlBody.empty();
				if(data.flag == 0) {
					var rowSpanNum = 1;
					var mergeName = '';
					var mergePhone = '';
					var lastTr;
					if(data.data.length != 0) {
						$('.teacher-info-model-may').show();
						$('.repeat-come-div-nodata').remove();
						$.each(data.data, function(i, n) {
							if(n.gender == 1) {
								n.gender = "男";
							} else if(n.gender == 2){
								n.gender = "女";
							}else{
								n.gender = "";
							}
							if(n.orgName == null) {
								n.orgName = "";
							}
							//合并
							htmlTr = '<tr>';
							if(mergeName != (n.realName)) {
								$('.repeat-come-div .doubt-repeat-list-tbody tr').eq(lastTr).find("td").eq(0).attr("rowSpan", rowSpanNum);
								$('.repeat-come-div .doubt-repeat-list-tbody tr').eq(lastTr).find("td").eq(1).attr("rowSpan", rowSpanNum);
//								$('.repeat-come-div .doubt-repeat-list-tbody tr').eq(lastTr).find("td").eq(2).attr("rowSpan", rowSpanNum);
								lastTr = i;
								mergeName = n.realName;
								mergePhone = n.phone;
								htmlTr += '<td>' + num++ + '</td>' +
									'<td style=" word-break: break-all;">' + n.realName + '</td>';
//									'<td>' + n.gender + '</td>' ;
								rowSpanNum = 1;
							} else {
								rowSpanNum++;
							}
							htmlTr += '<td>' + n.gender + '</td>'+
								'<td>' + n.phone + '</td>'+
								'<td>' + n.projectCode + '</td>' +
								'<td>' + n.projectName + '</td>' +
								'<td>' + n.startTime + '</td>' +
								'<td>' + n.endTime + '</td>' +
								'<td>' + n.orgName + '</td>' +
								'<td>' + n.deptPosition + '</td>' +
								'</tr>';
							htmlBody.append(htmlTr);
						});
						$('.repeat-come-div .doubt-repeat-list-tbody tr').eq(lastTr).find("td").eq(0).attr("rowSpan", rowSpanNum);
						$('.repeat-come-div .doubt-repeat-list-tbody tr').eq(lastTr).find("td").eq(1).attr("rowSpan", rowSpanNum);
//						$('.repeat-come-div .doubt-repeat-list-tbody tr').eq(lastTr).find("td").eq(2).attr("rowSpan", rowSpanNum);

						//不合并
//						if(n.realName == undefined){
//							n.realName = "";
//						};
//						if(n.gender == undefined){
//							n.gender = "";
//						};
//						if(n.phone == undefined){
//							n.phone = "";
//						};
//						if(n.projectCode == undefined){
//							n.projectCode = "";
//						};
//						if(n.projectName == undefined){
//							n.projectName = "";
//						};
//						if(n.startTime == undefined){
//							n.startTime = "";
//						};
//						if(n.endTime == undefined){
//							n.endTime = "";
//						};
//						if(n.orgName == undefined){
//							n.orgName = "";
//						};
//						if(n.deptPosition == undefined){
//							n.deptPosition = "";
//						};
//						
//						htmlTr = '<tr>'+
//									'<td>' + num++ + '</td>' +
//									'<td style="text-align:left;">' + n.realName + '</td>' +
//									'<td>' + n.gender + '</td>' +
//									'<td>' + n.phone + '</td>'+
//									'<td>' + n.projectCode + '</td>' +
//									'<td style="text-align:left;">' + n.projectName + '</td>' +
//									'<td>' + n.startTime + '</td>' +
//									'<td>' + n.endTime + '</td>' +
//									'<td style="text-align:left;">' + n.orgName + '</td>' +
//									'<td style="text-align:left;">' + n.deptPosition + '</td>' +
//								'</tr>';
//						htmlBody.append(htmlTr);
//						});
						//隐藏整体框架loading的方法
						$yt_baseElement.hideLoading();
					} else {
						$('.teacher-info-model-may').hide();
						if($('.teacher-info-model-may').css('display') == 'none' && $('.teacher-info-model').css('display') == 'none') {
							if($('.repeat-come-div').find('.repeat-come-div-nodata')[0] == undefined) {
								$('.repeat-come-div').append('<div class="no-data repeat-come-div-nodata" style="width: 280px;margin: 0 auto;"><img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;"></div>')
							}
						}
						//隐藏整体框架loading的方法
						$yt_baseElement.hideLoading();
					}

				} else {
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt('查询失败');
					});
				}
			}
		});

	}
}
/**
 * 学员手册
 */
var studentManual = {
	ue: null,
	init: function() {
		$('#uploadOrCode').hover(function() {
			$(this).prev().css('text-decoration', 'underline');
		}, function() {
			$(this).prev().css('text-decoration', 'none');
		})
		//初始化富文本编辑器
		studentManual.ue = UE.getEditor('container', {
			toolbars: [
				['undo', 'redo', '|',
					'bold', 'italic', 'underline', 'forecolor', '|',
					'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'simpleupload', 'attachment'
				]
			],
			autoHeightEnabled: true,
			elementPathEnabled: false,
			enableAutoSave: false,
			autoFloatEnabled: false,
			maximumWords: 1000,
			saveInterval: 0
		});
		//点击学员手册里面的页签切换
		$('.student-manual-div .student-manual-btn').off('click').click(function() {
			$yt_baseElement.showLoading();
			$(this).addClass('change-page-sign').siblings().removeClass('change-page-sign');
			$('.student-manual-div .manual-div').hide().eq($(this).index()).show();
			if($(this).index() == 1) {
				studentManual.getPageDataList();//获取微信与委托一些数据
				studentManual.getPreviewData();
			}
			$yt_baseElement.hideLoading();
		});
		//点击上传二维码
		$(".student-manual-div").undelegate().delegate("#uploadOrCode", "change", function() {
			//格式jpg,png
			console.log($(this)[0].files[0]);
			//图片类型
			var type = $(this)[0].files[0].type;
			//图片大小
			var size = $(this)[0].files[0].size;
			console.log(type);
			if(size <= 307200 && type == 'image/jpeg' || size <= 307200 && type == 'image/png') {
				var url = $yt_option.acl_path + "api/tAscPortraitInfo/addFile";
				//显示整体框架loading的方法
				$yt_baseElement.showLoading();
				$.ajaxFileUpload({
					url: url,
					type: "post",
					data: {
						file: name,
						modelCode: 'or-codesss',
						uploadType: 1,
						type: 'PC'
					},
					dataType: 'json',
					fileElementId: "uploadOrCode",
					success: function(data, textStatus) {
						var resultData = $.parseJSON(data);
						if(resultData.success == 0) {
							console.log(resultData.obj.pkId);
							$('.student-manual-div .upload-or-code-img').attr('src', $yt_option.acl_path + 'api/tAscPortraitInfo/download?pkId=' + resultData.obj.pkId + '&isDownload=false');
							$('.qr-code-id').val(resultData.obj.pkId);
							$('.qr-code-name').val(resultData.obj.naming);
							$yt_baseElement.hideLoading();
						} else {
							$yt_baseElement.hideLoading(function() {
								$yt_alert_Model.prompt("附件上传失败");
							});
						}
					},
					error: function(data, status, e) { //服务器响应失败处理函数  
						$yt_baseElement.hideLoading(function() {
							$yt_alert_Model.prompt("附件上传失败");
						});
					}
				});
			} else {
				$yt_alert_Model.prompt("请选择正确格式");
			}

		});
		//点击页面保存按钮
		$('.manual-main-div .save-btn').off('click').on('click', function() {
			console.log("imgFileId", imgFileId, "imgFileName", imgFileName);
			var imgFileId = $('.qr-code-id').val();
			var imgFileName = $('.qr-code-name').val();
			if(imgFileId == '') {
				$yt_alert_Model.prompt("请上传微信二维码");
			} else {
				studentManual.manualOperation(imgFileId, imgFileName);
			}
		});
		//点击保存并预览按钮
		$(".manual-main-div .preview-save").off('click').on('click', function() {
			console.log("imgFileId", imgFileId, "imgFileName", imgFileName);
			var imgFileId = $('.qr-code-id').val();
			var imgFileName = $('.qr-code-name').val();
			studentManual.manualOperation(imgFileId, imgFileName);
			$('.student-manual-div .student-manual-btn').removeClass('change-page-sign');
			$('.student-manual-div .student-manual-btn').eq(1).addClass('change-page-sign');
			$('.student-manual-div .manual-div').hide().eq(1).show();
			studentManual.getPageDataList();//获取微信与委托一些数据
			studentManual.getPreviewData();
		});
		//点击页面取消按钮
		$('.manual-main-div .yt-model-canel-btn').on('click', function() {
			$yt_alert_Model.alertOne({
				haveCloseIcon: false, //是否带有关闭图标  
				closeIconUrl: "./resources/images/icons/x.png", //关闭图标路径  
				leftBtnName: "确定", //左侧按钮名称,默认确定  
				rightBtnName: "取消", //右侧按钮名称,默认取消  
				cancelFunction: "", //取消按钮操作方法*/
				alertMsg: "确定取消当前页面的所有操作吗？", //提示信息  
				confirmFunction: function() { //点击确定按钮执行方法  
					studentManual.getPageDataList();
					$("#pop-modle-alert").css("z-index", 100);
					$(".yt-alert-one").css("z-index", 1);
				},
				cancelFunction: function() {
					$("#pop-modle-alert").css("z-index", 100);
					$(".yt-alert-one").css("z-index", 1);
				}
			});
			$("#pop-modle-alert").css("z-index", 1000);
			$(".yt-alert-one").css("z-index", 1010);
		});
		//学员手册获取页面数据
		studentManual.getPageDataList();
		//点击委托单位新增按钮
		$('.entrust-company .add-student-manual').off('click').on('click', function() {
			var htmlTr = '<tr>' +
				'<td style="text-align:center;"><input class="yt-input entrust-name" style="width: 150px;" type="text"/></td>' +
				'<td style="text-align:center;"><input class="yt-input entrust-dept" type="text"/></td>' +
				'<td style="text-align:center;"><input class="yt-input entrust-room-num" type="text"/></td>' +
				'<td style="text-align:center;"><input class="yt-input entrust-phone" type="text"/></td>' +
				'<td style="text-align: center;">' +
				'<img class="entrust-delete" src="../../resources/images/icons/t-del.png"/></td>' +
				'</tr>';
			$(this).prev().find('tbody').append(htmlTr);
			//$('.college-project-post').niceSelect();
		});
		//点击项目组新增按钮
		$('.college-project .add-student-manual').off('click').on('click', function() {
			var htmlTr = '<tr>' +
				'<td style="text-align:center;"><input class="yt-input college-project-name" style="width: 150px;" type="text"/></td>' +
				'<td style="text-align:center;"><input class="yt-input college-project-dept" type="text"/></td>' +
				'<td style="text-align:center;"><select class="yt-select college-project-post" style="width:140px;">' +
				'<option value="1">带班院领导</option>' +
				'<option value="2">项目组组长</option>' +
				'<option value="3">夜间值班室</option>' +
				'</select>'+
				'</td>' +
				'<td style="text-align:center;"><input class="yt-input college-project-phone" type="text"/></td>' +
				'<td style="text-align: center;">' +
				'<img class="entrust-delete" src="../../resources/images/icons/t-del.png"/>'+
				'</td>' +
				'</tr>';
			$(this).prev().find('tbody').append(htmlTr);
			$('.college-project-post').niceSelect();
			$('.college-project-post').css("margin-left","18px");
		});
		//点击删除图标(包括学员手册和接待通知的删除)；	
		$('.box-list').off('click.entrust-delete').on('click', '.entrust-delete', function() {
			$(this).addClass('cho-btn');
			$yt_alert_Model.alertOne({
				haveCloseIcon: false, //是否带有关闭图标  
				closeIconUrl: "./resources/images/icons/x.png", //关闭图标路径  
				leftBtnName: "确定", //左侧按钮名称,默认确定  
				rightBtnName: "取消", //右侧按钮名称,默认取消  
				cancelFunction: function() { //取消按钮操作方法*/
					$(' .entrust-delete').removeClass('cho-btn');
				},
				alertMsg: "数据删除将无法恢复，确认删除吗？", //提示信息  
				confirmFunction: function() { //点击确定按钮执行方法  
					$('.entrust-delete.cho-btn').parents("tr").remove();
				},
			});
		});
		//打印
		$('.upPrint').click(function(){
			$('.import-file-name').val('');
			$("#printName").val('');
			$('.printNumber').val('')
			/** 
			 * 显示编辑弹出框和显示顶部隐藏蒙层 
			 */
			$(".print-import-form").show();
			/** 
			 * 调用算取div显示位置方法 
			 */
			$yt_alert_Model.getDivPosition($(".print-import-form"));
			/* 
			 * 调用支持拖拽的方法 
			 */
			$yt_model_drag.modelDragEvent($(".print-import-form .yt-edit-alert-title"));
			/** 
			 * 点击取消方法 
			 */
			$('.print-import-form .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
				//隐藏页面中自定义的表单内容  
				$(".print-import-form").hide();
			});
		})
		//打印上传文件
		$('.print-import-form').undelegate().delegate("#printName", "change", function() {
			var url = $yt_option.acl_path + "api/tAscPortraitInfo/addMultipartFiles?modelCode=printss";
					$yt_baseElement.showLoading();
					$.ajaxFileUpload({
						url: url,
						type: "post",
						dataType: 'json',
						fileElementId: "printName",
						success: function(data, textStatus) {
							var resultData = $.parseJSON(data);
							if(resultData.success == 0) {
								console.log(resultData)
								$('#printName').data('fileId',resultData.obj[0].pkId);
								$('.import-file-name').val(resultData.obj[0].naming);
								$yt_baseElement.hideLoading(function() {
									$yt_alert_Model.prompt("上传成功");
								});
							} else {
								$yt_baseElement.hideLoading(function() {
									$yt_alert_Model.prompt("上传失败");
								});
							}
						},
						error: function(data, status, e) { //服务器响应失败处理函数  
							$yt_baseElement.hideLoading(function() {
								$yt_alert_Model.prompt("网络异常，上传失败");
							});
						}
					});
		
		});
		//打印提交
		$('.print-btn').off('click').click(function(){
			var projectCode=$yt_common.GetQueryString("projectCode");
			if($('.import-file-name').val()==''){
				$yt_alert_Model.prompt('请上传需要打印的文件');
				return false;
			}else if($('.printNumber').val()==''){
				$yt_alert_Model.prompt('请填写打印份数');
				return false;
			}
			$('.printNumber').val()==''?$('.printNumber').val('1'):$('.printNumber').val($('.printNumber').val());
			var pringingData = [{
				projectCode:projectCode,
				fileId:$('#printName').data('fileId'),
				fileName:$('.import-file-name').val(),
				printerCount:$('.printNumber').val(),
				fileType:3,
				states:3
			}];
			pringingData = JSON.stringify(pringingData);
			$.ajax({
				type:"post",
				url:$yt_option.base_path+'class/studentHandbook/addPrintingStudentHandbook',
				async:true,
				beforeSend:function(){
					$yt_baseElement.showLoading()
				},
				data:{
					pringingData:pringingData
				},
				success:function(data){
					if(data.flag==0){
						$yt_alert_Model.prompt('打印成功');
						//隐藏页面中自定义的表单内容  
						$(".print-import-form").hide();
					}else{
						$yt_alert_Model.prompt('打印失败')
					}
					
					$yt_baseElement.hideLoading()
				},
				error:function(){
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt('网络异常，打印失败')
					})
				}
			});
		})
		//导出word
		$('.downloadWord').click(function(){
			for(var i=0;i<12;i++){
				$('.manual-class-date').before('<p class="ppp" style="font-size:22pt">&nbsp;</p>');
			}
			$.each($('.class-info-div'), function(i,n) {
				$(n).html('<h3 class="class-info-div">'+$(n).html()+'</h3>')
			});
			$('.traineeCount-div').append('<p class="traineeCount" style="text-align:center">（共计'+studentManual.traineeCount+'人）</p>');
			$('.word-scroll>div').append('<span style="mso-spacerun:\'yes\';font-family:方正小标宋简体;mso-hansi-font-family:\'Times New Roman\';mso-bidi-font-family:\'Times New Roman\';color:rgb(0,0,0);font-size:16.0000pt;mso-font-kerning:1.0000pt;"><br clear=all style=\'page-break-before:always;mso-break-type:section-break\'></span>')
			var html = $('.word-scroll').html();
			$('.ppp').remove();
			$('.traineeCount').remove();
			$.each($('.class-info-div'), function(i,n) {
				$(n).html($(n).text())
			});
			html = html.replace(new RegExp("'","g"),"&#x27;");
			var htmlString = '<!DOCTYPE html>'+
								'<html xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns:m="http://schemas.microsoft.com/office/2004/12/omml" xmlns="http://www.w3.org/TR/REC-html40">'+
								'<head>'+
									'<meta charset="UTF-8">'+
									'<meta name=ProgId content=Word.Document>'+
									'<meta name=Generator content="Microsoft Word 14">'+
									'<meta name=Originator content="Microsoft Word 14">'+
									'<title></title>'+
									'<style>'+
									'.class-info-div,.preview-course .class-info-div{text-align: center;font-weight: 700;font-size:21px}'+
									'.manual-class-name{font-size:27px}'+			
									'.manual-weixincontent img{width:125px;height:125px}'+
									'td{border:1px solid #000000;word-break:break-all}'+
									'th{border:1px solid #000000;font-weight:700;}'+
									'table{width:100%;border:none;border-collapse:collapse;}'+
									'.word-name{text-align:center}'+
									'.word-name p{text-align:center;font-size:29px;font-weight:700;}'+
									'.word-name .manual-class-date{display:inline-block;text-align:center;font-size:16px}'+
									'</style>'+
								'</head>'+
								'<body>'+
								html+
								'</body>'+
							'</html>';
			$yt_baseElement.showLoading();
			$.ajaxDownloadFile({
				data:{
					projectCode:$yt_common.GetQueryString("projectCode"),
					exportName:caInfoList.projectName,
					htmlString:htmlString,
					yitianSSODynamicKey:$yt_common.getyitianSSODynamicKey(),
					exportName:$('.project-name').eq(0).text()
				},
				url:$yt_option.base_path+'class/studentHandbook/exportStudentHandbook'
			});
			$yt_baseElement.hideLoading();
		})
	},
	traineeCount:0,
	/**
	 * 学员手册预览获取数据
	 **/
	getPreviewData: function() {
		var me = this;
		//班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/studentHandbook/getStudentHandbookPreview",
			data: {
				projectCode: projectCode
			},
			beforeSend:function(){
				//显示整体框架loading的方法
				$yt_baseElement.showLoading();
			},
			async: true,
			success: function(data) {
				if(data.flag == 0) {
					$('.word-scroll').empty();
					$.each(data.data.modelData, function(i, g) {
						if(g.modelCode == 'CLASSNAME') { //预览班级姓名
							$('.word-scroll').append('<div class="word-name" style="margin: 0px 6px;background-color: #FFFFFF;padding-bottom: 20px;">' +
								'<div class="class-info-div">' +
								'<span class="manual-class-name"></span>' +
								'</div><p style="font-size:22pt">&nbsp;</p><p style="font-size:22pt">&nbsp;</p><p style="font-size:22pt">&nbsp;</p><p>学员手册</p><p style="font-size:22pt">&nbsp;</p><p>大连高级经理学院</p></br><p class="manual-class-date"></p></div>'
							)
							$(".manual-class-name").text(g.modelValue);
							var manualDate = new Date();
							var year = manualDate.getFullYear();
							var month = manualDate.getMonth() + 1;
							$(".manual-class-date").text(year + "年" + month + "月");
						} else if(g.modelCode == 'TRAINDETAILS') { //预览学院简介
							$('.word-scroll').append('<div style="margin: 0px 6px;"><div class="class-info-div"></div><div class="teach-content manual-college-brief"></div></div>')
							$(".manual-college-brief").prev().text(g.modelName);
							$(".manual-college-brief").html(g.modelValue);

						} else if(g.modelCode == 'TEACHINGDETAILS') { //预览教学方案简介
							$('.word-scroll').append('<div style="margin: 0px 6px;"><div class="class-info-div"></div><div class="teach-content manual-teaching-brief"></div></div>')
							$(".manual-teaching-brief").prev().text(g.modelName);
							$(".manual-teaching-brief").empty();
							$(".manual-teaching-brief").html(g.modelValue);

						} else if(g.modelCode == 'COURSE') { //预览课程安排
							$('.word-scroll').append('<div class="preview-course" style="margin:0px 6px;">' +
								'<div class="class-info-div ">教学日程</div>' +
								'<div class="teach-content manual-teaching-schedule">' +
								'<table class="yt-table list-table" style="width=430pt;mso-table-layout-alt:fixed;">' +
								'<thead class="list-thead"><tr><th colspan="2" width="250px">时间</th><th>教学内容	</th><th width="225px">地点</th></tr>' +
								'</thead><tbody class="yt-tbody"></tbody></table></div></div>')
							$(".manual-teaching-schedule").prev().text(g.modelName);
							var previewBody = $(".preview-course tbody");
							previewBody.empty();
							$.each(g.modelValue, function(i, c) {
								var previewCourse = '';
								$.each(c.courseDetails, function(r, s) {
									previewCourse += '<tr>';
									if(c.courseDetails.length != 1 && r == 0) {
										previewCourse += '<td rowspan="' + c.courseDetails.length + '" style="text-align:center">' + c.courseDate + '</td>';
									} else if(c.courseDetails.length == 1) {
										previewCourse += '<td style="text-align:center">' + c.courseDate + '</td>';
									}
									previewCourse += '<td style="text-align: center;">' + s.courseTime + '</td>' +
										'<td>' +
										'<span style="font-weight: bolder;">' + s.courseTypeName + '</span><span>' + s.courseName + '</span><br/>' +
										'<span style="font-weight: bolder;">' + s.speaker + '</span><span>' + s.teacherName + '</span>' +
										'</td>' +
										'<td>' + s.address + '</td>' +
										'</tr>';

								});
								//$(".preview-course tbody tr").eq(lasTr).find('td').eq(0).attr('rowspan',courseNum);
								//previewBody.find('tr').eq(lasTr).find('td').eq(0).attr('rowspan',courseNum);
								previewBody.append(previewCourse);

							});

						} else if(g.modelCode == 'TRAINEE') { //预览学员名单
							me.traineeCount=0;
							$('.word-scroll').append('<div style="margin: 0px 6px;"><div class="traineeCount-div class-info-div"></div><div class="teach-content preview-student-list"></div></div>')
							$(".preview-student-list").prev().text(g.modelName);
							var studentList = $(".preview-student-list");
							studentList.empty();
							$.each(g.modelValue, function(i, d) {
								var preGroup = '';
								preGroup += '<p style="margin:0 auto;">' + d.groupName + '</p>' +
									'<p>组长：' + d.groupLeader + '</p>' +
									'<table class="yt-table list-table" style="margin-bottom:20px">' +
									'<thead class="list-thead">' +
									'<tr>' +
									'<th width="225px">姓名</th>' +
									'<th>单位职务</th>' +
									'<th width="225px">房间号</th>' +
									'</tr>' +
									'</thead>' +
									'<tbody class="yt-tbody">';
								$.each(d.traineeDetails, function(p, c) {
									if(c.realName.length==2){
										c.realName = c.realName.split('');
										c.realName[0] = c.realName[0]+'&emsp;';
										c.realName = c.realName.join('');
									}
									me.traineeCount++;
									preGroup += '<tr>' +
										'<td style="text-align:center;">' + c.realName + '</td>' +
										'<td>' + c.positionName + '</td>' +
										'<td>' + c.roomNumber + '</td>' +
										'</tr>';
								});
								preGroup += '</tbody></table>';
								studentList.append(preGroup);
								$('.traineeCount').text('共计'+me.traineeCount+'人');
							});

						} else if(g.modelCode == 'COMMITTEE') { //预览班委会成员
							$('.word-scroll').append('<div style="margin: 0px 6px;"><div class="class-info-div"></div><div class="teach-content manual-committee"></div></div>')
							$(".manual-committee").prev().text(g.modelName);
							var comiteBody = $(".manual-committee");
							comiteBody.empty();
							var manualComite = '';
							console.log(g.modelValue);
							$.each(g.modelValue, function(i, r) {
								manualComite = '<p style="font-weight: bolder;">' + r.classCommittee + '</p>';
								$.each(r.traineeDetails, function(t, j) {
									manualComite += '<p style="margin-left:20px">' +
										'<span>' + j.realName + " " + '</span>' +
										'<span>' + j.positionName + '</span>' +
										'</p>';
								});
								comiteBody.append(manualComite);
							});

						} else if(g.modelCode == 'GUIDE') { //预览学院指南
							$('.word-scroll').append('<div style="margin: 0px 6px;"><div class="class-info-div"></div><div class="teach-content manual-college-guide"></div></div>')
							$(".manual-college-guide").prev().text(g.modelName);
							$(".manual-college-guide").html(g.modelValue);
						}else if(g.modelCode == 'CBEADUSER'){//学院项目组成员
							$('.word-scroll').append('<div style="margin: 0px 6px;"><div class="class-info-div"></div><div class="teach-content manual-college-project-word"></div></div>')
							$('.manual-college-project-word').prev().text(g.modelName);
							$('.manual-college-project-word').html($('.college-project-word .teach-content').html());
							
						}else if(g.modelCode == 'UNITSTAFF'){//委托单位工作人员
							$('.word-scroll').append('<div style="margin: 0px 6px;"><div class="class-info-div"></div><div class="teach-content manual-entrust-company-word"></div></div>')
							$('.manual-entrust-company-word').prev().text(g.modelName);
							$('.manual-entrust-company-word').html($('.entrust-company-word .teach-content').html());
						}else if(g.modelCode == 'SYSTEMPLATFORM'){//网络交流平台
							$('.word-scroll').append('<div style="margin: 0px 6px;"><div class="class-info-div"></div><div class="teach-content manual-weixincontent"></div></div>')
							$('.manual-weixincontent').prev().text(g.modelName);
							$('.manual-weixincontent').html($('.weixincontent .teach-content').html());
						}else {
							$('.word-scroll').append('<div style="margin: 0px 6px;"><div class="class-info-div"></div><div class="teach-content manual-other' + i + '"></div></div>')
							$(".manual-other" + i).prev().text(g.modelName);
							$(".manual-other" + i).html(g.modelValue);
						}
					});
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading();
				} else {
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("获取预览数据失败");
					});
				}
			}
		});
	},
	/**
	 * 学员手册获取页面数据
	 **/
	studentPageData:'',
	getPageDataList: function() {
		var me = this;
		//班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/studentHandbook/getStudentHandbook",
			data: {
				projectCode: projectCode
			},
			beforeSend:function(){
				//显示整体框架loading的方法
				$yt_baseElement.showLoading();
			},
			async: true,
			success: function(data) {
				//添加委托单位人员
				var htmlPrev = $('.entrust-company tbody');
				//预览
				var htmlPrevWord = $('.entrust-company-word tbody').empty();
				var htmlTr = '';
				//添加项目组人员
				var htmlProTeam = $('.college-project tbody');
				var htmlProTeamWord = $('.college-project-word tbody').empty();
				var htmlTb = '';
				htmlPrev.empty();
				htmlProTeam.empty();
				if(data.flag == 0) {
					if(data.data != null) {
						//预览页面-----微信
						data.data.weixinQrCode = JSON.parse(data.data.weixinQrCode);
						$('.word-scroll-other .weixincontent').setDatas(data.data);
						$('.word-scroll-other .weixincontent .weixinimg').attr('src',data.data.weixinQrCode.weixinQrUrl);
						//
						var studentManual = data.data;
						console.log("获取手册数据成功", studentManual.pkId);
						$('.template-pkid').val(studentManual.pkId);
						$('.weixin-group-name').val(studentManual.weixnGroupName);
						$('.weixin-details').val(studentManual.weixnGroupDetails);
						//获取图片
						$('.qr-code-id').val(studentManual.weixinQrCodeId);
						$('.qr-code-name').val(studentManual.weixinQrCodeName);
						$('.student-manual-div .upload-or-code-img').attr('src', $yt_option.acl_path + 'api/tAscPortraitInfo/download?pkId=' + studentManual.weixinQrCodeId + '&isDownload=false');
						//循环添加委托单位人员
						var studentHandbookEntrust = $.parseJSON(studentManual.studentHandbookEntrust);
						var datastudentHandbookGroup = $.parseJSON(studentManual.studentHandbookGroup);

						//设置编辑器内容
						if(studentManual.templateData!="null"){
							studentManual.templateData = $.parseJSON(studentManual.templateData);
							$.each(studentManual.templateData,function(i,n){
								if(i==0){
								var ue = UE.getEditor('container');
									ue.ready(function() {
										ue.setContent(n.details);
									});
								}else{
									if($('#stumanual'+n.pkId)[0]!=undefined){
										var ue = UE.getEditor('stumanual'+n.pkId);
										ue.ready(function() {
											ue.setContent(n.details);
										});
									}
								}
							})
						}
						//循环添加委托单位工作人员     +预览页面
						$.each(studentHandbookEntrust, function(i, v) {
							htmlTr = '<tr>' +
								'<td style="text-align:center;"><input class="yt-input entrust-name" style="width: 150px;" value="' + v.userName + '" type="text"/></td>' +
								'<td style="text-align:center;"><input class="yt-input entrust-dept" value="' + v.deptName + '" type="text"/></td>' +
								'<td style="text-align:center;"><input class="yt-input entrust-room-num" value="' + v.roomNumber + '" type="text"/></td>' +
								'<td style="text-align:center;"><input class="yt-input entrust-phone" value="' + v.phone + '" type="text"/></td>' +
								'<td style="text-align: center;">' +
								'<img class="entrust-delete" src="../../resources/images/icons/t-del.png"/></td>' +
								'</tr>';
							htmlPrev.append(htmlTr);
							htmlTr = '<tr>' +
								'<td>'+ v.userName+'</td>' +
								'<td>'+ v.deptName + '</td>' +
								'<td>' + v.roomNumber + '</td>' +
								'<td>' + v.phone + '</td>' +
								'</tr>';
							htmlPrevWord.append(htmlTr);
						});
						//循环添加学员项目组人员
						$.each(datastudentHandbookGroup, function(i, k) {
							if(k != null) {
								htmlTb = '<tr>' +
									'<td style="text-align:center;"><input class="yt-input college-project-name" style="width: 150px;" value="' + k.userName + '" type="text"/></td>' +
									'<td style="text-align:center;"><input class="yt-input college-project-dept" value="' + k.deptName + '"  type="text"/></td>' +
									'<td style="text-align:center;"><select class="yt-select college-project-post" style="width:140px;">' +
									'<option value="1">带班院领导</option>' +
									'<option value="2">项目组组长</option>' +
									'<option value="3">夜间值班室</option></select></td>' +
									'<td style="text-align:center;"><input class="yt-input college-project-phone" value="' + k.phone + '"  type="text"/></td>' +
									'<td style="text-align: center;">' +
									'<img class="entrust-delete" src="../../resources/images/icons/t-del.png"/></td>' +
									'</tr>';
								htmlProTeam.append(htmlTb);
								$('.college-project-post').setSelectVal(k.positionId);
								$('.college-project-post').niceSelect();
								$('.college-project-post').css("margin-left","18px");
								if(k.positionId==1){
									k.positionIdVel = "带班院领导";
								}else if(k.positionId==2){
									k.positionIdVel = "项目组组长";
								}else if(k.positionId==3){
									k.positionIdVel = "夜间值班室";
								}
								htmlTb = '<tr>' +
									'<td>' + k.userName + '</td>' +
									'<td>' + k.deptName + '</td>' +
									'<td>' + k.positionIdVel + '</td>' +
									'<td>' + k.phone + '</td>' +
									'</tr>';
								htmlProTeamWord.append(htmlTb);
							}

						});
						//隐藏整体框架loading的方法
						$yt_baseElement.hideLoading();
					} else {
						//隐藏整体框架loading的方法
						$yt_baseElement.hideLoading();
					}

				} else {
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询学员手册失败");
					});
				}

			}
		});
	},
	/**
	 * 新增修改手册
	 */
	manualOperation: function(weixinQrCode, weixinQrName) {
		var me = this;
		//班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		var templateData = [];
		//pkId
		$.each(me.getTemplateListData, function(i,n) {
			if(n.modelCode == 'TEACHINGDETAILS'){
				var template = {
				templateId: n.pkId,
				details: ''
				};
				templateData.push(template);
			}else if(n.types==3){
				var template = {
				templateId: n.pkId,
				details: ''
				};
				templateData.push(template);
			}
		});
		//内容
		$.each(templateData, function(j,k) {
			if(j==0){
				var details = studentManual.ue.getContent();
				k.details = details;
			}else{
				var ue = UE.getEditor('stumanual'+k.templateId);
				k.details = ue.getContent();
			}
		});
		console.log(templateData);
		var pkId = $('.template-pkid').val();
		//模板数据
		templateData = JSON.stringify(templateData);
		//微信名称
		var weixnGroupName = $('.weixin-group-name').val();
		//微信说明
		var weixnGroupDetails = $('.weixin-details').val();
		//二维码数据
		var weixinQrCode = {
			weixinQrCode: weixinQrCode,
			weixinQrName: weixinQrName
		};
		weixinQrCode = JSON.stringify(weixinQrCode);
		//委托单位工作人员数据
		var studentHandbookEntrust = [];
		$('.entrust-company tbody tr').each(function(i, q) {
			var userName = $(q).find('.entrust-name').val();
			var deptName = $(q).find('.entrust-dept').val();
			var roomNumber = $(q).find('.entrust-room-num').val();
			var phone = $(q).find('.entrust-phone').val();
			var entrustList = {
				userName: userName,
				deptName: deptName,
				roomNumber: roomNumber,
				phone: phone
			};
			studentHandbookEntrust.push(entrustList);
		});
		studentHandbookEntrust = JSON.stringify(studentHandbookEntrust);
		//学院项目组成员数据
		var studentHandbookGroup = [];
		$('.college-project tbody tr').each(function(i, p) {
			var userName = $(p).find('.college-project-name').val();
			var deptName = $(p).find('.college-project-dept').val();
			var positionId = $(p).find('.college-project-post').val();
			var phone = $(p).find('.college-project-phone').val();
			var collegeList = {
				userName: userName,
				deptName: deptName,
				positionId: positionId,
				phone: phone
			};
			studentHandbookGroup.push(collegeList);
		});
		studentHandbookGroup = JSON.stringify(studentHandbookGroup);
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/studentHandbook/addOrUpdateStudentHandbook",
			data: {
				projectCode: projectCode,
				pkId: pkId,
				templateData: templateData,
				weixnGroupName: weixnGroupName,
				weixnGroupDetails: weixnGroupDetails,
				weixinQrCode: weixinQrCode,
				studentHandbookEntrust: studentHandbookEntrust,
				studentHandbookGroup: studentHandbookGroup
			},
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("保存成功");
					});
					studentManual.getPageDataList();
				} else {
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("保存失败");
					});

				}
			}
		});
	},
	/**
	 * 查询模板列表
	 */
	getTemplateListData:'',
	getTemplateList: function() {
		var me = this ;
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/traineeTemplate/lookForAll",
			data: {
				templateId: 1,
				types: 3
			},
			async: true,
			success: function(data) {
				if(data.flag == 0) {
					me.getTemplateListData=data.data;
					console.log("模板查询成功");
					$('.student-manual-other').empty();
					$.each(data.data, function(i, q) {
						if(q.modelCode == 'TEACHINGDETAILS') {
							
						}else if(q.types==3){
							console.log("模板id", q.pkId,q.types);
							var htmlTr = '<div class="class-info-div">'+q.modelName+'</div>'+
								'<div class="teach-content">'+
								'<div class="teach-content-box">'+
								'<span>'+q.modelName+'：</span>'+
								'<script id="stumanual'+q.pkId+'" class="stumanual" name="content" type="text/plain" style="width: 720px;height: 200px;display: inline-flex;">'+q.modelValue+'</script>'+
								'</div></div>';
							$('.student-manual-other').append(htmlTr);
							//初始化富文本编辑器
								UE.delEditor('stumanual'+q.pkId);
								var ue = UE.getEditor('stumanual'+q.pkId, {
									toolbars: [
										['undo', 'redo', '|',
											'bold', 'italic', 'underline', 'forecolor', '|',
											'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'simpleupload', 'attachment'
										]
									],
									autoHeightEnabled: true,
									elementPathEnabled: false,
									enableAutoSave: false,
									autoFloatEnabled: false,
									maximumWords: 1000,
									saveInterval: 0
								});
//									ue.ready(function() {
//										ue.setContent(q.modelValue);
//									});
							console.log(htmlTr);
						}
					});
				}
				//隐藏整体框架loading的方法
				$yt_baseElement.hideLoading();
			}
		});
	}
}
/**
 * 接待通知
 */
var receptionNotice = {
	ue: null,
	init: function() {
		//初始化富文本编辑器
		receptionNotice.ue = UE.getEditor('reception', {
			toolbars: [
				['undo', 'redo', '|',
					'bold', 'italic', 'underline', 'forecolor', '|',
					'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'simpleupload', 'attachment'
				]
			],
			autoHeightEnabled: true,
			elementPathEnabled: false,
			enableAutoSave: false,
			saveInterval: 0
		});
		//初始化人员下拉框
		var personnelName = receptionNotice.getPersonnelList();
		if(personnelName.length != 0) {
            $(".reception-notice-div select.project-head-select option").remove();  
        	$(".reception-notice-div select.project-head-select").append('<option value="">请选择</option>');  
			$.each(personnelName, function(i, o) {
				$(".reception-notice-div select.project-head-select").append('<option value=' + o.textName + '>' + o.name + '</option>');
			});
			$(".reception-notice-div select.head-select").niceSelect({  
		        search: true,  
		        backFunction: function(text) {  
		            //回调方法,可以执行模糊查询,也可自行添加操作  
		            $(".reception-notice-div select.head-select option").remove();  
		            if(text == "") {  
		                $(".reception-notice-div select.head-select").append('<option value="">请选择</option>');  
		            }  
		            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
		            $.each(personnelName, function(i, n) {  
		                if(n.name.indexOf(text) != -1) {  
		                    $(".reception-notice-div select.head-select").append('<option value="' + n.textName + '">' + n.name + '</option>');  
		                }  
		            });  
		        }  
		    });
		    $(".reception-notice-div select.head-master-select").niceSelect({  
		        search: true,  
		        backFunction: function(text) {  
		            //回调方法,可以执行模糊查询,也可自行添加操作  
		            $(".reception-notice-div select.head-master-select option").remove();  
		            if(text == "") {  
		                $(".reception-notice-div select.head-master-select").append('<option value="">请选择</option>');  
		            }  
		            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
		            $.each(personnelName, function(i, n) {  
		                if(n.name.indexOf(text) != -1) {  
		                    $(".reception-notice-div select.head-master-select").append('<option value="' + n.textName + '">' + n.name + '</option>');  
		                }  
		            });  
		        }  
		    });
		}
		//房间列表失去焦点变成数字
		$('.room-list-table').off().on('blur','.room-money',function(){
			$(this).val(Number($(this).val().replace(".","$#$").replace(/\./g,"").replace("$#$",".").replace(/[^\d.]/g,"")).toFixed(2))
		});
		$('.number-count').off().blur(function(){
			$(this).val(Number($(this).val().replace(/[^\d]/g,"")))
		})
//		$('.haveMeals-list-table').on('blur','.haveMealsCounts',function(){
//			$(this).val(Number($(this).val().replace(/[^\d]/g,"")))
//		})
		//新增房间使用情况
		$('.add-room-list').off('click').click(function() {
			var appedHtml = '<tr>' +
				'<td><input type="text" class="yt-input" style="width: 135px;" placeholder="请输入" /></td>' +
				'<td><input type="text" class="yt-input room-count" style="width: 85px;text-align:right;" placeholder="请输入" /></td>' +
				'<td><input type="text" class="yt-input room-money" style="width: 85px;text-align:right;" placeholder="请输入" /></td>' +
				'<td><textarea  class="yt-textarea textarea-remard" style="width: 98%;overflow-y:visible;vertical-align: middle;" placeholder="请输入" /></textarea></td>' +
				'<td><img class="entrust-delete" src="../../resources/images/icons/t-del.png" style="cursor: pointer;" /></td>' +
				'</tr>';
			$(this).prev().find('tbody').append(appedHtml);
			$('.textarea-remard').autoHeight();
		});
		//新增教学场地
		$(".add-address-list").off('click').click(function() {
			var appedHtml = '<tr>' +
				'<td><input type="text" class="yt-input" style="width: 95%;" placeholder="请输入" /></td>' +
				'<td><input type="text" class="yt-input" style="width: 94%;" placeholder="请输入" /></td>' +
				'<td><textarea class="yt-textarea textarea-remard" style="width: 94%;overflow-y:visible;vertical-align: middle;" placeholder="请输入" ></textarea></td>' +
				'<td><img class="entrust-delete" src="../../resources/images/icons/t-del.png" style="cursor: pointer;" /></td>' +
				'</tr>';
			$(this).prev().find('tbody').append(appedHtml);
			$('.textarea-remard').autoHeight();
		});
		//新增用餐情况
		$(".add-haveMeals-list").off('click').click(function() {
			var appedHtml = '<tr>' +
				'<td><input type="text" class="yt-input" style="width: 240px;" placeholder="请输入" /></td>' +
				'<td><input type="text" class="yt-input" style="width: 189px;" placeholder="请输入" /></td>' +
				'<td><input type="text" class="yt-input" style="width: 153px;" placeholder="请输入" /></td>' +
				'<td><input type="text" class="yt-input haveMealsCounts" style="width: 85px;text-align:right;" placeholder="请输入" /></td>' +
				'<td><input type="text" class="yt-input" style="width: 85px;" placeholder="请输入" /></td>' +
				'<td><textarea  class="yt-textarea textarea-remard" style="width: 90%;overflow-y:visible;vertical-align: middle;" placeholder="请输入" /></textarea></td>' +
				'<td><img class="entrust-delete" src="../../resources/images/icons/t-del.png" style="cursor: pointer;" /></td>' +
				'</tr>';
			$(this).prev().find('tbody').append(appedHtml);
			$('.textarea-remard').autoHeight();
		});
		//收费情况
		$(".add-charge-list").off('click').click(function() {
			var appedHtml = '<tr>' +
				'<td><input type="text" class="yt-input" style="width: 93%;" placeholder="请输入" /></td>' +
				'<td><input type="text" class="yt-input" style="width: 93%;text-align: right;" placeholder="请输入" /></td>' +
				'<td><input type="text" class="yt-input" style="width: 98%;" placeholder="请输入" /></td>' +
				'<td><img class="entrust-delete" src="../../resources/images/icons/t-del.png" style="cursor: pointer;" /></td>' +
				'</tr>';
			$(this).prev().find('tbody').append(appedHtml);
		});
		//点击保存按钮
		$('.reception-notice-div .save-reception').off('click').click(function() {
			receptionNotice.saveReception(1);
		});
		//点击生成按钮
		$('.reception-notice-div .generate').off('click').click(function() {
			$yt_alert_Model.alertOne({
				alertMsg: "生成后，接单通知单不可再修改，是否生成接待通知单？", //提示信息  
				confirmFunction: function() { //点击确定按钮执行方法  
					receptionNotice.saveReception(2);
				},
			});
		});
		//点击取消按钮
		$('.reception-notice-div .yt-model-canel-btn').off().click(function() {
			$yt_alert_Model.alertOne({
				haveCloseIcon: false, //是否带有关闭图标  
				closeIconUrl: "./resources/images/icons/x.png", //关闭图标路径  
				leftBtnName: "确定", //左侧按钮名称,默认确定  
				rightBtnName: "取消", //右侧按钮名称,默认取消  
				cancelFunction: "", //取消按钮操作方法*/  
				alertMsg: "确定取消当前页面的所有操作吗？", //提示信息  
				confirmFunction: function() { //点击确定按钮执行方法  
					receptionNotice.getReceptionList();
				},
			});
		});
		//学员费用详情点击保存编辑按钮
		$(".update-trainee-details").click(function(){
			if($(this).text() == "确定"){
				$(this).text("编辑");
				receptionNotice.updateTraineeDetails();
				$.each($(".student-cost-tbody").find(".yt-input"), function(i,r) {
					$(r).prev().text($(r).val());
					$(r).hide();
				});
			}else{
				$(this).text("确定");
				$.each($(".student-cost-tbody").find(".yt-input"), function(i,r) {
					$(r).prev().text("");
					$(r).show();
				});
			}
		});
		$(".student-cost-tbody").on('blur','.yt-input',function(){
			$(this).val($yt_baseElement.fmMoney($(this).val()));
		});
		$('.reception-notice-div').on('click', '.entrust-delete', function() {
			$(this).addClass('cho-btn');
			$yt_alert_Model.alertOne({
				haveCloseIcon: false, //是否带有关闭图标  
				closeIconUrl: "./resources/images/icons/x.png", //关闭图标路径  
				leftBtnName: "确定", //左侧按钮名称,默认确定  
				rightBtnName: "取消", //右侧按钮名称,默认取消  
				cancelFunction: function() { //取消按钮操作方法*/
					$(' .entrust-delete').removeClass('cho-btn');
				},
				alertMsg: "数据删除将无法恢复，确认删除吗？", //提示信息  
				confirmFunction: function() { //点击确定按钮执行方法  
					$('.entrust-delete.cho-btn').parents("tr").remove();
				},
			});
		});
	},
	/**
	 * 获取集团单位
	 */
	getGroupOrg: function() {
		var groupOrg;
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/group/getGroups",
			data: {
				isSelectGroup: 2
			},
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					groupOrg = data.data;
				}
			}
		});
		return groupOrg;
	},
	/**
	 * 人员列表数据
	 */
	getPersonnelList: function() {
		var personnelName = [];
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/user/getUsers",
			data: {
				compId: ""
			},
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					$.each(data.data, function(i, m) {
						if(m.type == 3) {
							var personnel = {
								name: m.text,
								textName: m.textName
							};
							personnelName.push(personnel);
						}
					});
					//隐藏整体框架loading的方法	
					$yt_baseElement.hideLoading();
				} else {
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading();
				}
			}
		});
		return personnelName;
	},
	/**
	 * 委托单位树形列表
	 */
	groupOrgTree: function() {
		$('.entrust-name-td').off('click').click(function(){
				$('.receive-group-div-span').text('选择培训委托单位名称');
				$('.receive-group-div').show();
				function listData(){
					$('.receive-group-div .receive-group-page').pageInfo({
						type:"post",
						url:$yt_option.base_path+"class/noticeReception/getGroups",
						async:true,
						pageIndexs: 1,
						pageNum: 15, //每页显示条数  
						before:function(){
							$yt_baseElement.showLoading();
						},
						data:{
							groupName:$('.receive-group-search').val(),
							types:2
						},
						success:function(data){
							$yt_baseElement.hideLoading();
							if(data.flag==0){
								var tr = '';
								$('.receive-group-tbody').empty();
								$.each(data.data.rows,function(i,n){
									tr = '<tr><td groupId="'+n.groupId+'">'+n.groupName+'</td></tr>';
									$('.receive-group-tbody').append(tr);
								})
								/** 
							 * 调用算取div显示位置方法 
							 */
							$yt_alert_Model.setFiexBoxHeight($(".receive-group-div .yt-edit-alert-main"));
							$yt_alert_Model.getDivPosition($(".receive-group-div"));
							}else{
								$yt_alert_Model.prompt('查询失败')
							}
						},
						error:function(){
							$yt_baseElement.hideLoading();
							$yt_alert_Model.prompt('查询失败')
						},
						isSelPageNum: true //是否显示选择条数列表默认false  
						
					});
				}
				listData();
				/* 
				 * 调用支持拖拽的方法 
				 */
				$yt_model_drag.modelDragEvent($(".receive-group-div .yt-edit-alert-title"));
				$('.receive-group-canel-btn').off().click(function(){
					$('.receive-group-div').hide();
				})
				$('.receive-group-sure-btn').off().click(function(){
					if($('.receive-group-div .yt-table-active')[0]){
						$('#groupId').val($('.receive-group-div .yt-table-active td').attr('groupId'));
						$('.entrust-cam-name').val($('.receive-group-div .yt-table-active td').text());
						$('.receive-group-div').hide();
					}else{
						$yt_alert_Model.prompt('请选择集团单位');
					}

				})
				$('.receive-group-div .receive-group-btn-img').off().click(function(){
					listData();
				})
		})
//		var getGroupOrg = receptionNotice.getGroupOrg();
//		if($("#treeDiv").length == 0) {
//			$('#textTree').createTree({
//				controlId: 'treeDiv', // 必选 弹出的树列表控件ID，默认: $(this).attr("id") + "Tree"  
//				dataList: getGroupOrg, // 必选 对象数组 树列表数据  
//				listConfig: { // 必选 树列表节点参数名称 设置为传入的数据对象参数名称  
//					id: 'groupId', //参数ID名称  
//					pid: 'parentId', //上一级ID名称  
//					name: 'groupName' //参数名称  
//				},
//				rootConfig: { //必选 设置根目录的 默认信息  
//					id: 0, //根目录ID  
//					pid: -1, // 根目录上一级ID 固定值为-1  
//					name: "大连高级经理学院" //根目录名称  
//				},
//				speed: 200, // 可选 下拉树列表显示速度 参数"slow","normal","fast"，或毫秒数值，默认：200      
//				readonly: true, //可选 目标对象是否设为只读，默认：true  
//				checked: false, //可选 是否显示多选框 默认：false  
//				hide: true, //设置单击节点立即隐藏 默认：false
//				callback: {
//					onClick: function(obj, id, name) {
//						$('#groupId').val(id);
//						$('#textTree').val(name);
//					}, //可选 点击树列表节点触发的事件  
//				}
//			});
//		}
	},
	
	/**
	 * 获取列表数据
	 */
	getReceptionList: function() {
		//报到时间
		$(".report-date").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			nowData: false, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd HH:mm"
		});
		//离院时间
		$(".out-hospital-date").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			nowData: false, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd HH:mm"
		});
		//学员集中接站时间
		$(".trainee-pick-date").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			nowData: false, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd HH:mm"
		});
		//学员集中退房时间
		$(".trainee-check-out-date").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			nowData: false, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd HH:mm"
		});
//		//输入框内容获取焦点时的输入框的值
//		var berforRoomCount;
//		$(".room-list-table").off('focus').on('focus','.room-count',function(){
//			//获取房间总数量
//			var allroom = $(".allroom").text();
//			//获取当前输入框的房间数量
//			berforRoomCount = $(this).val();
//		});
		
		//输入房间数量，输入框失去焦点改变房间数量
		$(".room-list-table").off('blur').on('blur','.room-count',function(){
			//判断输入的是否为汉字
			 var reg = /^[0-9]+.?[0-9]*$/;
				//获取房间总数量
				var allroom = 0;
				//获取所有房间行的
				var allTr = $(".room-list-table tbody").find("tr");
				$.each(allTr, function(a,t) {//计算房间总数量
					var inputState=reg.test($(t).find(".room-count").val());
					if(inputState){
						allroom +=parseInt($(t).find(".room-count").val());
					}else{
						$(t).find(".room-count").val("");
					}
				});
				$(".allroom").text("");
				$(".allroom").text(allroom);
			
			console.log(reg.test($(this).val()));
			
		});
		
		//删除一行房间总数减去当前行的房间数量
		$(".room-list-table").off('click').on('click','.entrust-delete',function(){
			$(this).parent().parent().remove();
			//获取房间总数量
			var allroom = 0;
			var allTr = $(".room-list-table tbody").find("tr");
			$.each(allTr, function(a,t) {
				allroom +=parseInt($(t).find(".room-count").val());
			});
			$(".allroom").text("");
			$(".allroom").text(allroom);
		});
		//班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		var hidEdit = "";
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/noticeReception/getNoticeReceptionByProjectCode",
			data: {
				projectCode: projectCode
			},
			async: true,
			success: function(data) {
				if(data.flag == 0) {
					console.log("接待通知查询列表成功");
					//console.log("项目类型",data.data.projectType);
					if(data.data != null) {
						if(data.data.projectType == 1) {
							data.data.projectType = "调训";
							receptionNotice.groupOrgTree();
							//去掉树形列表的第一行
							$(".dtree .dTreeNode").eq(0).addClass('tree-first');
						} else if(data.data.projectType == 2) {
							data.data.projectType = "委托";
								receptionNotice.groupOrgTree();
								//赋值
//								dtrees.treeDiv.getDeptValue(this,data.data.customerId,data.data.customerName);
//								dtrees.treeDiv.openTo(data.data.customerId,true);
								//去掉树形列表的第一行
//								$(".dtree .dTreeNode").eq(0).addClass('tree-first');

						} else if(data.data.projectType == 3) {
							data.data.projectType = "选学";
							$(".entrust-name-td").prev().remove();
							$(".entrust-name-td").remove();
						} else if(data.data.projectType == 4){
							receptionNotice.groupOrgTree();
							data.data.projectType = "中组部调训";
							//赋值
//							dtrees.treeDiv.getDeptValue(this,data.data.customerId,data.data.customerName);
//							dtrees.treeDiv.openTo(data.data.customerId,true);
							//去掉树形列表的第一行
//							$(".dtree .dTreeNode").eq(0).addClass('tree-first');
						} else if(data.data.projectType == 5){
							receptionNotice.groupOrgTree();
							data.data.projectType = "国资委调训";
							//赋值
//							dtrees.treeDiv.getDeptValue(this,data.data.customerId,data.data.customerName);
//							dtrees.treeDiv.openTo(data.data.customerId,true);
							//去掉树形列表的第一行
//							$(".dtree .dTreeNode").eq(0).addClass('tree-first');
						}
						data.data.haveMealsRemarks = data.data.haveMealsRemarks.replace('班级名称', data.data.projectName);
						//列表添加数据
						$('.reception-notice-div').setDatas(data.data);
						//当前的项目主任
						$('.head-select').setSelectVal(data.data.projectHeadCode);
						//当前的班主任
						$(".head-master-select").setSelectVal(data.data.classTeacherCode);
						//房间使用情况
						var roomList = data.data.roomList;
						if(roomList != "") {
							$('.room-list-table tbody').empty();
							var roomnum = 0;
							$.each(roomList, function(i, a) {
								if (a.roomType == undefined) {
									a.roomType = "";
								};
								if (a.roomCount == undefined) {
									a.roomCount = "";
								}else{
									roomnum += Number(a.roomCount);
								};
								if (a.remarks == undefined) {
									a.remarks = "";
								};
								if (a.roomPrice == undefined) {
									a.roomPrice = "";
								};
								var roomHtml = '<tr>' +
									'<td><input type="text" class="yt-input" style="width: 135px;" placeholder="请输入" value="' + a.roomType + '" /></td>' +
									'<td><input type="text" class="yt-input room-count" style="width: 85px;text-align:right;" placeholder="请输入" value="' + a.roomCount + '" /></td>' +
									'<td><input type="text" class="yt-input room-money" style="width: 85px;text-align:right;" placeholder="请输入" value="' + a.roomPrice + '" /></td>' +
									'<td><textarea  class="yt-textarea textarea-remard" style="width: 98%;overflow-y:visible;vertical-align: middle;" placeholder="请输入" >' + a.remarks + '</textarea></td>' +
									'<td class="operate-td"><img class="entrust-delete" src="../../resources/images/icons/t-del.png" style="cursor: pointer;" /></td>' +
									'</tr>';
								$('.room-list-table tbody').append(roomHtml);
							});
							$('.allroom').text(roomnum);
						}
						//教学场地使用情况
						var addressList = data.data.addressList;
						if(addressList != "") {
							$('.address-list-table tbody').empty();
							$.each(addressList, function(i, b) {
								if(b.address == null) {
									b.address = "";
								}
								if(b.peopleCount == undefined){
									b.peopleCount = "";
								}
								var addreHtml = '<tr>' +
									'<td><input type="text" class="yt-input" style="width: 95%;" placeholder="请输入" value="' + b.adressDate + '" /></td>' +
									'<td><input type="text" class="yt-input" style="width: 94%;" placeholder="请输入" value="' + b.address + '" /></td>' +
									'<td><textarea class="yt-textarea textarea-remard" style="width: 94%;text-align:left;overflow-y: hidden;vertical-align: middle;" placeholder="请输入" >' + b.peopleCount + '</textarea></td>' +
									'<td class="operate-td"><img class="entrust-delete" src="../../resources/images/icons/t-del.png" style="cursor: pointer;" /></td>' +
									'</tr>';
								$('.address-list-table tbody').append(addreHtml);
							});
						}
						//用餐情况
						var haveMealsList = data.data.haveMealsList;
						if(haveMealsList != "") {
							$('.haveMeals-list-table tbody').empty();
							$.each(haveMealsList, function(i, c) {
								if(c.peopleCount == undefined){
									c.peopleCount = "";
								}
								var mealsHtml = '<tr>' +
									'<td><input type="text" class="yt-input" style="width: 240px;" placeholder="请输入" value="' + c.adressDate + '"/></td>' +
									'<td><input type="text" class="yt-input" style="width: 189px;" placeholder="请输入" value="' + c.address + '" /></td>' +
									'<td><input type="text" class="yt-input" style="width: 153px;" placeholder="请输入" value="' + c.types + '" /></td>' +
									'<td><input type="text" class="yt-input haveMealsCounts" style="width: 85px;text-align:right;" placeholder="请输入" value="' + c.peopleCount + '" /></td>' +
									'<td><input type="text" class="yt-input" style="width: 85px;" placeholder="请输入" value="' + c.standard + '" /></td>' +
									'<td><textarea  class="yt-textarea textarea-remard" style="width: 90%;overflow-y:visible;vertical-align: middle;" placeholder="请输入">' + c.remarks + '</textarea></td>' +
									'<td class="operate-td"><img class="entrust-delete" src="../../resources/images/icons/t-del.png" style="cursor: pointer;" /></td>' +
									'</tr>';
								$('.haveMeals-list-table tbody').append(mealsHtml);
							});
						}
						if(data.data.updateTime==''||data.data.updateTime==undefined){
							//收费情况
							receptionNotice.getStudentCostInf(hidEdit);
						}else{
							$(".update-trainee-details").hide();
							receptionNotice.studentCostList(data.data.receptionChargeList,'updateTime');
						}
//						var receptionChargeList = data.data.receptionChargeList;
//						if(receptionChargeList != "") {
//							$('.reception-charge-list-table tbody').empty();
//							$.each(receptionChargeList, function(i, d) {
//								var recptionHtml = '<tr>' +
//									'<td><input type="text" class="yt-input" style="width: 93%;" placeholder="请输入" value="' + d.chargeType + '" /></td>' +
//									'<td><input type="text" class="yt-input" style="width: 93%;text-align: right;" placeholder="请输入" value="' + d.chargeTrainee + '" /></td>' +
//									'<td><input type="text" class="yt-input" style="width: 98%;" placeholder="请输入"  value="' + d.remarks + '"/></td>' +
//									'</tr>';
//								$('.reception-charge-list-table tbody').append(recptionHtml);
//							});
//						}
						/**
						 * 初始化编辑器数据
						 */
						var ue = UE.getEditor('reception');
						ue.ready(function() {
							if(data.data.specialCaseDescription != null) {
								ue.setContent(data.data.specialCaseDescription);
							}
						});
						//生成后无法编辑
					if(data.data.updateTimeString!=undefined){
						if(data.data.updateTimeString!=''){
							hidEdit = true;
							$(".update-trainee-details").hide();
							$(".remark-text").prev().text($(".remark-text").val());
							$(".remark-text").hide();
							$(".entrust-delete").hide();
							$(".generate").parent().find("span").hide();
							$(".operate-td").hide();
							$(".group-deptname").find("span").hide();
							$.each($('.reception-notice-div input'), function(i, n) {
								if($(n).siblings('span')[0]==undefined){
									if($(n).hasClass("hid-group-id")){
									}else{
										$(n).parents().append('<span></span>');	
									}
									
								}
								$(n).hide();
								$(n).siblings('span').text($(n).val());
							});
							$('.reception-notice-div textarea').attr('disabled', 'disabled');
							$('.reception-notice-div textarea').css('border', 'none');
							$('.add-notice-reception').remove();
							$.each($('.reception-notice-div select'), function(i, n) {
								$(n).find('option:selected').text()=='请选择'?$(n).parents('td').text(''):$(n).parents('td').text($(n).find('option:selected').text());
								$(n).parents('td').text($(n).find('option:selected').text());
							});
							$('#reception').parent().find('.receptionDiv').remove();
							$('#reception').parent().html(data.data.specialCaseDescription);
							console.log();
							$('#reception').hide();	
							$('.reception-notice-div .yt-eidt-model-bottom').hide();
						}
					}
						//隐藏整体框架loading的方法
						$yt_baseElement.hideLoading();
					} else {
						//班级类型
						var projectType = $yt_common.GetQueryString("projectType");
						if(projectType == 1) {
							projectType = "调训";
						} else if(projectType == 2) {
							projectType = "委托";
						} else if(projectType == 3) {
							projectType = "选学";
						} else if(projectType == 4){
							projectType = "中组部调训";
						}  else if(projectType == 5){
							projectType = "国资委调训";
						} 
						//var projectName= $yt_common.GetQueryString("projectName");
						var projectList = {
							projectType: projectType
							//projectName:projectName
						};
						//						if(projectType==1){//类型为计划
						//							//调用树形结构列表
						//							receptionNotice.groupOrgTree();
						//							//去掉树形列表的第一行
						//						$(".dtree .dTreeNode").eq(0).addClass('tree-first');
						//						}else if(projectType==2){//类型为委托
						//							$(".entrust-name-td").empty();
						//							$(".entrust-name-td").text(data.data.groupName);
						//						}else if(projectType==3){//类型为选学
						//							$(".entrust-name-td").prev().remove();
						//							$(".entrust-name-td").remove();
						//						}else{//类型为调训
						//							//调用树形结构列表
						//							receptionNotice.groupOrgTree(); 
						//							//去掉树形列表的第一行
						//						$(".dtree .dTreeNode").eq(0).addClass('tree-first');
						//						}
						//列表添加数据
						$('.reception-notice-div').setDatas(projectList);
						receptionNotice.groupOrgTree();
						//去掉树形列表的第一行
						$(".dtree .dTreeNode").eq(0).addClass('tree-first');
						//隐藏整体框架loading的方法
						$yt_baseElement.hideLoading();
					}
					$('.textarea-remard').autoHeight();
//					$('.textarea-remard').css('height','28px');
					
					
				} else {
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}
			}
		});
	},
	//获取学员费用详情（收费情况）
	getStudentCostInf: function(hidEdit) {
		var me = this;
		var projectId = $yt_common.GetQueryString('pkId');
		$yt_baseElement.showLoading();
		$.ajax({
			url: $yt_option.base_path + "project/getProjectRatesDetails", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				projectId: projectId,
				selectParam: ""
			}, //ajax查询访问参数
			async:false,
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				if(data.flag == 0) {
					me.studentCostList(data.data);
					if(hidEdit == true){
						$(".update-trainee-details").hide();
					}
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
	//渲染学员收费
	studentCostList:function(data,updateTime){
		var htmlTbody = $('.student-cost-tbody').empty();
		var htmlTr = '';
		var num = 1;
		if(data.length > 0) {
			$.each(data, function(i, v) {
				if(v.traineeName != ""){//只显示学员的
					if(updateTime){
						htmlTr = '<tr>' +
								'<td style="text-align: center;">' + (num++) + '</td>' +
								'<td><span class=" traineeName" value="">' + v.traineeName + '</span></td>' +
								'<td><span class=" groupName" value="">' + v.groupName + '</span></td>' +
								'<td><span></span><input style="width:95%" class="yt-input trainingExpenseNegotiatedPrice" value="' + $yt_baseElement.fmMoney(v.trainingExpenseNegotiatedPrice) + '"  type="text"/></td>' +
								'<td><span></span><input style="width:95%" class="yt-input traineeNegotiatedPrice" value="' + $yt_baseElement.fmMoney(v.traineeNegotiatedPrice) + '"  type="text"/></td>' +
								'<td><span></span><input style="width:95%" class="yt-input quarterageNegotiatedPrice" value="' + $yt_baseElement.fmMoney(v.quarterageNegotiatedPrice) + '"  type="text"/></td>' +
								'<td><span></span><input style="width:95%" class="yt-input mealFeeNegotiatedPrice" value="' + $yt_baseElement.fmMoney(v.mealFeeNegotiatedPrice) + '"  type="text"/></td>' +
							'</tr>';
					}else{
						htmlTr = '<tr>' +
								'<td style="text-align: center;"><input type="hidden" value="' + v.types + '" class="types"/>' + (num++) + '</td>' +
								'<td><span class=" traineeName" value="">' + v.traineeName + '</span></td>' +
								'<td><span class=" groupName" value=""><input type="hidden" value="' + v.groupId + '" class="groupId"/>' + v.groupName + '</span></td>' +
								'<td><span></span><input style="width:95%" class="yt-input trainingExpenseNegotiatedPrice" value="' + $yt_baseElement.fmMoney(v.trainingExpenseNegotiatedPrice) + '"  type="text"/></td>' +
								'<td><span></span><input style="width:95%" class="yt-input traineeNegotiatedPrice" value="' + $yt_baseElement.fmMoney(v.traineeNegotiatedPrice) + '"  type="text"/></td>' +
								'<td><span></span><input style="width:95%" class="yt-input quarterageNegotiatedPrice" value="' + $yt_baseElement.fmMoney(v.quarterageNegotiatedPrice) + '"  type="text"/></td>' +
								'<td><span></span><input style="width:95%" class="yt-input mealFeeNegotiatedPrice" value="' + $yt_baseElement.fmMoney(v.mealFeeNegotiatedPrice) + '"  type="text"/></td>' +
							'</tr>';
					}
					htmlTr = $(htmlTr).data('data',v);
					htmlTbody.append(htmlTr);
				}
			});
			$.each($(".student-cost-tbody").find(".yt-input"), function(i,r) {
				$(r).prev().text($(r).val());
				$(r).hide();
			});
		} else {
			htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
				'<td colspan="7" align="center" style="border:0px;">' +
				'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
				'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
				'</div>' +
				'</td>' +
				'</tr>';
				$(".update-trainee-details").hide();
				htmlTbody.append(htmlTr);
		}
	},
	//学员费用详情保存
	updateTraineeDetails: function() {
		function getMoneyLogInfo(objName,obj1,obj2){
				var logTestArr = [];
				if(obj1!=null){
					//修改
					for (var keyName in objName) {
						if(obj1[keyName]!=undefined && obj2[keyName]!=undefined && obj1[keyName]!=obj2[keyName]){
							if(keyName=='trainingExpenseRackRate'||keyName=='quarterageRackRate'||keyName=='traineeRackRate'||keyName=='mealFeeRackRate'||keyName=='trainingExpenseNegotiatedPrice'||keyName=='quarterageNegotiatedPrice'||keyName=='traineeNegotiatedPrice'||keyName=='mealFeeNegotiatedPrice'){
								var obj1money= $yt_baseElement.fmMoney(obj1[keyName],2)+'元';
								var obj2money = $yt_baseElement.fmMoney(obj2[keyName],2)+'元';
								logTestArr.push(objName[keyName]+"："+obj1money+"修改为"+obj2money);
							}else{
								logTestArr.push(objName[keyName]+"："+obj1[keyName]+"修改为"+obj2[keyName]);
							}
							
						}
					}
				}
				return logTestArr.join('；')+('；')=='；'?'':logTestArr.join('；')+('；')
		}
		var traineeRatesName = {
				trainingExpenseRackRate:'培训费标准价',
				quarterageRackRate:'住宿费(/晚)标准价',
				traineeRackRate:'课程费标准价',
				mealFeeRackRate:'餐费(/天)标准价',
				trainingExpenseNegotiatedPrice:'培训费协议价',
				quarterageNegotiatedPrice:'住宿费(/晚)协议价',
				traineeNegotiatedPrice:'课程费协议价',
				mealFeeNegotiatedPrice:'餐费(/天)协议价'
		}
		$yt_baseElement.showLoading();
		var updateData = "";
		var updateDataArr = [];
		$(".student-cost-tbody tr").each(function(i, n) {
			var projectId = $yt_common.GetQueryString('pkId');
			var traineeId = $(n).data('data').traineeId;
			var groupId = $(n).find(".groupId").val();
			var types = $(n).find(".types").val();
			var trainingExpenseNegotiatedPrice = $(n).find(".trainingExpenseNegotiatedPrice").val();
			var traineeNegotiatedPrice = $(n).find(".traineeNegotiatedPrice").val();
			var quarterageNegotiatedPrice = $(n).find(".quarterageNegotiatedPrice").val();
			var mealFeeNegotiatedPrice = $(n).find(".mealFeeNegotiatedPrice").val();
			var groupRatesList = {
				projectId: projectId,
				types: types,
				groupId: groupId,
				traineeId: traineeId,
				trainingExpenseRackRate:$(n).data('data').trainingExpenseRackRate,
				quarterageRackRate:$(n).data('data').quarterageRackRate,
				traineeRackRate:$(n).data('data').traineeRackRate,
				mealFeeRackRate:$(n).data('data').mealFeeRackRate,
				trainingExpenseNegotiatedPrice: $yt_baseElement.rmoney(trainingExpenseNegotiatedPrice),
				traineeNegotiatedPrice: $yt_baseElement.rmoney(traineeNegotiatedPrice),
				quarterageNegotiatedPrice: $yt_baseElement.rmoney(quarterageNegotiatedPrice),
				mealFeeNegotiatedPrice: $yt_baseElement.rmoney(mealFeeNegotiatedPrice),
				traineeLogs:{
					traineeGroupId:traineeId,
					traineeGroupType:1,
					logsType:3,
					logsDetails:''
				}
			}
			groupRatesList.traineeLogs.logsDetails = '修改'+name+'费用详情，'+getMoneyLogInfo(traineeRatesName,$(n).data('data'),groupRatesList);
			var json = $(n).data('data');
			var bool =true;
			//判断数据是否被修改
			for (var j in json){
				if(json[j]!=groupRatesList[j]){
					if(json[j]!=undefined&&groupRatesList[j]!=undefined){
						bool =false;
					}
				}
			}
			if(bool==false){
				updateDataArr.push(groupRatesList);
			}
		});
		var updateData = JSON.stringify(updateDataArr);

		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "project/updateTraineeDetails", //ajax访问路径  
			data: {
				updateData: updateData
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt("保存成功");
					$yt_baseElement.hideLoading();
				} else {
					$yt_alert_Model.prompt("保存失败");
					$yt_baseElement.hideLoading();
				}
			}
		});
	},
	/**
	 * 接待通知保存/生成
	 */
	saveReception: function(dataStates) {
		//班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		var recptionList = $('.reception-notice-div').getDatas();
		var groupId = $("#groupId").val();
//		console.log("recptionList", recptionList);
		var projectHeadCode = $('.head-select').val();
		var classTeacherCode = $(".head-master-select").val();
		var specialCaseDescription = receptionNotice.ue.getContent();
		//console.log(specialCaseDescription);
		var roomList = [];
		var addressList = [];
		var haveMealsList = [];
		var receptionChargeList = [];
		//获取房间使用情况
		$(".room-list-table tbody tr").each(function(i, s) {
			var roomUse = {
				roomType: $(s).find('td').eq(0).find('input').val(),
				roomCount: $(s).find('td').eq(1).find('input').val(),
				roomPrice: $(s).find('td').eq(2).find('input').val(),
				remarks: $(s).find('td').eq(3).find('textarea').val()
			};
			if (roomUse.roomType == "" && roomUse.roomCount == "" && roomUse.roomPrice == "" && roomUse.remarks == "") {
				
			} else{
				roomList.push(roomUse);
			}
		});
		roomList = JSON.stringify(roomList);
		//获取教学场地使用情况
		$(".address-list-table tbody tr").each(function(i, p) {
			var addressUse = {
				adressDate: $(p).find('td').eq(0).find('input').val(),
				address: $(p).find('td').eq(1).find('input').val(),
				peopleCount: $(p).find('td').eq(2).find('textarea').val()
			};
			if(addressUse.adressDate == "" && addressUse.address && addressUse.peopleCount){
				
			}else{
				addressList.push(addressUse);
			}
		});
		addressList = JSON.stringify(addressList);
		//获取用餐情况
		$(".haveMeals-list-table tbody tr").each(function(i, g) {
			var haveMealsUse = {
				adressDate: $(g).find('td').eq(0).find('input').val(),
				address: $(g).find('td').eq(1).find('input').val(),
				types: $(g).find('td').eq(2).find('input').val(),
				peopleCount: $(g).find('td').eq(3).find('input').val(),
				standard: $(g).find('td').eq(4).find('input').val(),
				remarks: $(g).find('td').eq(5).find('textarea').val()
			};
			if(haveMealsUse.adressDate == "" && haveMealsUse.address && haveMealsUse.types && haveMealsUse.peopleCount && haveMealsUse.standard && haveMealsUse.remarks){
				
			}else{
				haveMealsList.push(haveMealsUse);
			}
			
		});
		haveMealsList = JSON.stringify(haveMealsList);
		//获取收费情况
		$(".student-charfe-inf-table tbody tr").each(function(i, n) {
			var trainingExpenseNegotiatedPrice = $(n).find(".trainingExpenseNegotiatedPrice").val();
			var traineeNegotiatedPrice = $(n).find(".traineeNegotiatedPrice").val();
			var quarterageNegotiatedPrice = $(n).find(".quarterageNegotiatedPrice").val();
			var mealFeeNegotiatedPrice = $(n).find(".mealFeeNegotiatedPrice").val();
			var receptionUse = {
				traineeName:$(n).find(".traineeName").text(),
				groupName:$(n).find(".groupName").text(),
				trainingExpenseNegotiatedPrice: $yt_baseElement.rmoney(trainingExpenseNegotiatedPrice),
				traineeNegotiatedPrice: $yt_baseElement.rmoney(traineeNegotiatedPrice),
				quarterageNegotiatedPrice: $yt_baseElement.rmoney(quarterageNegotiatedPrice),
				mealFeeNegotiatedPrice: $yt_baseElement.rmoney(mealFeeNegotiatedPrice),
			};
			receptionChargeList.push(receptionUse);
		});
		receptionChargeList = JSON.stringify(receptionChargeList);
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/noticeReception/addNoticeReception",
			data: {
				projectCode: projectCode,
				dataStates: dataStates,
				groupId: groupId,
				reportDate: recptionList.reportDate,
				outHospitalDate: recptionList.outHospitalDate,
				traineePickDate: recptionList.traineePickDate,
				traineeCheckOutDate: recptionList.traineeCheckOutDate,
				traineeCount: recptionList.traineeCount,
				personnelCount: recptionList.personnelCount,
				leaderCount: recptionList.leaderCount,
				projectHeadCode: projectHeadCode,
				classTeacherCode: classTeacherCode,
				projectHeadPhone: recptionList.projectHeadPhone,
				classTeacherPhone: recptionList.classTeacherPhone,
				remarks: recptionList.remarks,
				roomRemarks: recptionList.roomRemarks,
				addressRemarks: recptionList.addressRemarks,
				haveMealsRemarks: recptionList.haveMealsRemarks,
				specialCaseDescription: specialCaseDescription,
				roomList: roomList,
				addressList: addressList,
				haveMealsList: haveMealsList,
				receptionChargeList: receptionChargeList
			},
			async: true,
			success: function(data) {
				if(data.flag == 0) {
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading(function() {
						if(dataStates == 1) {
							$yt_alert_Model.prompt("保存成功");
						} else if(dataStates == 2) {
							$yt_alert_Model.prompt("提交成功");
						}
					});
					receptionNotice.getReceptionList();
				} else {
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading(function() {
						if(dataStates == 1) {
							$yt_alert_Model.prompt("保存失败");
						} else if(dataStates == 2) {
							$yt_alert_Model.prompt("提交失败");
						}
					});
				}
			}
		});
	}
}
/**
 * 班级公告
 */
var classBulletin = {
	ue: null,
	init: function() {
		//初始化富文本编辑器
		classBulletin.ue = UE.getEditor('manual', {
			toolbars: [
				['undo', 'redo', '|',
					'bold', 'italic', 'underline', 'forecolor', '|',
					'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify', '|', 'simpleupload', 'attachment'
				]
			],
			autoHeightEnabled: true,
			elementPathEnabled: false,
			enableAutoSave: false,
			saveInterval: 0
		});

		//点击删除图标
		$('.class-bulletin-div .list-tbody').on('click', '.bulletin-delete', function() {
			var pkId = $(this).parent().parent().find('.bulletin-id').val();
			$yt_alert_Model.alertOne({
				haveCloseIcon: false, //是否带有关闭图标  
				closeIconUrl: "./resources/images/icons/x.png", //关闭图标路径  
				leftBtnName: "确定", //左侧按钮名称,默认确定  
				rightBtnName: "取消", //右侧按钮名称,默认取消  
				cancelFunction: "", //取消按钮操作方法*/  
				alertMsg: "数据删除将无法恢复，确认删除吗？", //提示信息  
				confirmFunction: function() { //点击确定按钮执行方法  
					//显示整体框架loading的方法
					$yt_baseElement.showLoading();
					$.ajax({
						type: "post",
						url: $yt_option.base_path + "class/notice/deleteClassNotice", //ajax访问路径 
						data: {
							pkId: pkId
						},
						async: true,
						success: function(data) {
							if(data.flag == 0) {
								//隐藏整体框架loading的方法
								$yt_baseElement.hideLoading(function() {
									$yt_alert_Model.prompt("删除成功");
									//查询公告列表
									classBulletin.getClassBulletin();
								});

							} else {
								//隐藏整体框架loading的方法
								$yt_baseElement.hideLoading(function() {
									$yt_alert_Model.prompt("删除失败");
									//查询公告列表
									classBulletin.getClassBulletin();
								});

							}
						}
					});
				},
			});
		});
		var pkId;
		var projectCode = $yt_common.GetQueryString("projectCode");
		//点击修改图标
		$('.class-bulletin-div .list-tbody').on('click', '.bulletin-update', function() {
			$yt_baseElement.showLoading();
			$('.class-bulletin-form .yt-edit-alert-title-msg').text("修改公告");
			pkId = $(this).parent().parent().find('.bulletin-id').val();
			//获取当前行的公告内容
			var noticeDescribe = $(this).parent().parent().data('bulletin').noticeDescribe;
			console.log("noticeDescribe",$(this).parent().parent().data('bulletin'));
			classBulletin.ue.ready(function() {
				classBulletin.ue.setContent(noticeDescribe);
			
			});
			//获取当前行的内容标题
			var noticeTitle = $(this).parent().parent().data('bulletin').noticeTitle;
			//添加到弹出框上
			$('.class-bulletin-input').val(noticeTitle);
			console.log(noticeDescribe);
			/** 
			 * 显示编辑弹出框和显示顶部隐藏蒙层 
			 */
			$(".class-bulletin-form").show();
			/** 
			 * 调用算取div显示位置方法 
			 */
			$yt_alert_Model.setFiexBoxHeight($(".class-bulletin-form .yt-edit-alert-main"));
			$yt_alert_Model.getDivPosition($(".class-bulletin-form"));
			/* 
			 * 调用支持拖拽的方法 
			 */
			$yt_model_drag.modelDragEvent($(".class-bulletin-form .yt-edit-alert-title"));
			/**
			 * 点击取消方法
			 */
			$('.class-bulletin-form .yt-eidt-model-bottom .canel-in-btn').off().on("click", function() {
				//隐藏页面中自定义的表单内容  
				$(".class-bulletin-form").hide();
				//隐藏蒙层  
				$("#pop-modle-alert").hide();
			});
		$yt_baseElement.hideLoading();
		});
		//点击班级公告新增
		$('.class-bulletin-add-btn').click(function() {

			pkId = "";
			$(".class-bulletin-input").val("");
			classBulletin.ue.execCommand('cleardoc');
			/** 
			 * 显示编辑弹出框和显示顶部隐藏蒙层 
			 */
			$(".class-bulletin-form").show();
			/** 
			 * 调用算取div显示位置方法 
			 */
			//滚动条
			$(".class-bulletin-form .yt-edit-alert-main").css('max-height','475px');
			$yt_alert_Model.setFiexBoxHeight($(".class-bulletin-form .yt-edit-alert-main"));
			$yt_alert_Model.getDivPosition($(".class-bulletin-form"));
			/* 
			 * 调用支持拖拽的方法 
			 */
			$yt_model_drag.modelDragEvent($(".class-bulletin-form .yt-edit-alert-title"));
			/**
			 * 点击取消方法
			 */
			$('.class-bulletin-form .yt-eidt-model-bottom .canel-in-btn').off().on("click", function() {
				//隐藏页面中自定义的表单内容  
				$(".class-bulletin-form").hide();
				//隐藏蒙层  
				$("#pop-modle-alert").hide();
			});
		});
		//点击发布按钮
		$('.class-bulletin-form .yt-model-sure-btn').off().on('click', function() {

			var noticeDescribe = classBulletin.ue.getContent();
			var noticeTitle = $(".class-bulletin-input").val();
			console.log(noticeDescribe);
			if(noticeDescribe != null && noticeTitle != '') {
				//显示整体框架loading的方法
				$yt_baseElement.showLoading();
				$.ajax({
					type: "post",
					url: $yt_option.base_path + "class/notice/addOrUpdateNotice",
					data: {
						pkId: pkId,
						projectCode: projectCode,
						noticeTitle: noticeTitle,
						noticeDescribe: noticeDescribe,
						dateStates: 1
					},
					async: true,
					success: function(data) {
						if(data.flag == 0) {
							//隐藏整体框架loading的方法
							$yt_baseElement.hideLoading(function() {
								$yt_alert_Model.prompt("发布成功");
								//隐藏弹出框
								$(".class-bulletin-form").hide();
								classBulletin.getClassBulletin();
							});
						} else {
							//隐藏整体框架loading的方法
							$yt_baseElement.hideLoading(function() {
								$yt_alert_Model.prompt("发布失败");
								//隐藏弹出框
								$(".class-bulletin-form").hide();
								classBulletin.getClassBulletin();
							});
						}
					}
				});
			} else {
				$yt_alert_Model.prompt("请填写公告内容");
			}

			console.log(noticeDescribe);
		});
		/** 
		 * 点击暂存方法 
		 */
		$('.class-bulletin-form .yt-eidt-model-bottom .save-in-btn').off().on("click", function() {

			var noticeDescribe = classBulletin.ue.getContent();
			var noticeTitle = $(".class-bulletin-input").val();
			console.log(noticeTitle);
			if(noticeDescribe != null && noticeTitle != "") {
				//显示整体框架loading的方法
				$yt_baseElement.showLoading();
				$.ajax({
					type: "post",
					url: $yt_option.base_path + "class/notice/addOrUpdateNotice",
					data: {
						pkId: pkId,
						projectCode: projectCode,
						noticeTitle: noticeTitle,
						noticeDescribe: noticeDescribe,
						dateStates: 0
					},
					async: true,
					success: function(data) {
						if(data.flag == 0) {
							//隐藏整体框架loading的方法
							$yt_baseElement.hideLoading(function() {
								$yt_alert_Model.prompt("暂存成功");
								//隐藏弹出框 
								$(".class-bulletin-form").hide();
								classBulletin.getClassBulletin();
							});
						} else {
							//隐藏整体框架loading的方法
							$yt_baseElement.hideLoading(function() {
								$yt_alert_Model.prompt("暂存成功");
								//隐藏弹出框
								$(".class-bulletin-form").hide();
								classBulletin.getClassBulletin();
							});

						}
					}
				});
			} else {
				$yt_alert_Model.prompt("请填写公告内容");
			}

		});

	},

	/**
	 * 获取班级公告列表
	 */
	getClassBulletin: function() {
		var projectCode = $yt_common.GetQueryString("projectCode");
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$('.class-bulletin-div .page-info').pageInfo({
			async: true,
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			//pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "class/notice/getClassNoticeList", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			before: function() {
				$yt_baseElement.showLoading();
			},
			data: {
				projectCode: projectCode
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.class-bulletin-div .list-tbody');
					var htmlTr = '';
					var num = 1;
					$(htmlTbody).empty();
					if(data.data.rows.length > 0) {
						$.each(data.data.rows, function(i, v) {
							$('.class-bulletin-div .page-info').show();
							htmlTr = '<tr>' +
								'<input class="bulletin-id" type="hidden" value="' + v.pkId + '"/>' +
								'<td  style="text-align: center;">' + num++ + '</td>' +
								'<td class="pro-desc">' + v.noticeTitle + '</td>' +
								'<td  style="text-align: center;">' + v.createTimeString + '</td>' +
								'<td  style="text-align: center;">' + v.createUserName + '</td>' +
								'<td  style="text-align: center;"><img class="bulletin-update" src="../../resources/images/icons/amend.png"/>' +
								'<div style="width: 1px;height: 15px;margin:0px 10px;display:inline-block;background: #e6e6e6;"></div>' +
								'<img class="bulletin-delete" src="../../resources/images/icons/t-del.png"/></td>' +
								'</tr>';
							htmlTr = $(htmlTr).data('bulletin', v);
							htmlTbody.append(htmlTr);
						});
					} else {
						$('.class-bulletin-div .page-info').hide();
						htmlTr = '<tr class="class-tr">' +
							'<td colspan="5" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						htmlTbody.append(htmlTr);
					}
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading();
				} else {
					//隐藏整体框架loading的方法	
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	}
}
/**
 * 班级二维码
 */
var classQrCode = {
	init: function() {
		classQrCode.getClassOrCode();
		var yitianSSODynamicKey = $yt_common.getyitianSSODynamicKey();
		//点击下载按钮
		$('.qr-img-download').on('click', function() {
			//获取班级编号
			var projectCode = $yt_common.GetQueryString("projectCode");
			var baseName = 'check_in_qr';
			var fileRealName = $('.project-name').eq(0).text() + '学员报到二维码.jpg';
			fileRealName = encodeURI(encodeURI(fileRealName));
			window.location.href = $yt_option.base_path + "class/getQrcode?projectCode=" + projectCode + "&isDownload=" + true + "&fileRealName=" + fileRealName + "&baseName=" + baseName+'&yitianSSODynamicKey='+yitianSSODynamicKey;
		});
		//点击打印按钮
		$('.qr-img-print').on('click', function() {
			//获取班级编号
			var projectCode = $yt_common.GetQueryString("projectCode");
			var baseName = 'check_in_qr';
			var url = $yt_option.base_path + "class/getQrcode?projectCode=" + projectCode + "&baseName=" + baseName+'&yitianSSODynamicKey='+yitianSSODynamicKey;
			var html = '<div><img style="margin:14px;width:160px;height:155px;" src="' + url + '"/></div>';
			classQrCode.printImg(html);
		});
	},
	//获取班级报到二维码
	getClassOrCode: function() {
		//获取班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		var yitianSSODynamicKey = $yt_common.getyitianSSODynamicKey();
		var baseName = 'check_in_qr';
		var url = $yt_option.base_path + "class/getQrcode?projectCode=" + projectCode + "&baseName=" + baseName+'&yitianSSODynamicKey='+yitianSSODynamicKey;
		var htmlBody = $('.class-qr-code-div .teacher-list-div .report-qr-code');
		htmlBody.before('<div><img style="margin:10px 0px 3px 10px;width:160px;height:154px;" src="' + url + '"/></div>');

	},
	//打印二维码
	printImg: function(html) {
		/*var headstr = "<html><head><title></title></head><body>";
		var footstr = "</body>";
		var printData = html;
		//获得 div 里的所有 html 数据
		var oldstr = document.body.innerHTML;
		document.body.innerHTML = headstr + html + footstr;*/
		$("#project-main").hide();
		$("#project-main").after($('<div class="body-print-box">' + html + '</div>'))
		window.print();
		$("#project-main").show();
		$(".body-print-box").remove();
		//document.body.innerHTML = oldstr;
		//trainingDetails.init();
		return false;
	},

}
/**
 * 学员报到
 */
var studentReport = {
	init: function() {
		var me = this;
		var traineeId;
		//失去焦点事件
		studentReport.losFfocus();
		//初始化下拉框
		$('.student-nation').niceSelect();
		$('.student-invoice-type').niceSelect();
		$('.card-type').niceSelect();
//		$('.group-id-elementary').niceSelect();
		$('.org-id').niceSelect();
		//初始化日期控件
		$(".date-birth").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			lowerLimit: "NaN", // 日期下限，默认：NaN(不限制)     
			nowData: true, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd",
			callback: function() { // 点击选择日期后的回调函数  
				//alert("您选择的日期是：" + $("#txtDate").val());  
			}
		});
		$(".party-date").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			lowerLimit: "NaN", // 日期下限，默认：NaN(不限制)     
			nowData: true, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd",
			callback: function() { // 点击选择日期后的回调函数  
				//alert("您选择的日期是：" + $("#txtDate").val());  
			}
		});
		$(".work-time").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			lowerLimit: "NaN", // 日期下限，默认：NaN(不限制)     
			nowData: true, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd",
			callback: function() { // 点击选择日期后的回调函数  
				//alert("您选择的日期是：" + $("#txtDate").val());  
			}
		});
//		var groupList = studentReport.getGroupList();
		var nationList = studentReport.getNationList();
		//民族下拉列表添加数据
		if(nationList.length != 0) {
			$('.class-student-form .student-nation').empty();
			$.each(nationList, function(q, e) {
				$('.class-student-form .student-nation').append(' <option value="' + e.nationId + '">' + e.nationName + '</option>');
			});
			$('.class-student-form .student-nation').niceSelect();
		}
		$('.class-student-form .group-id-elementary-name').off('click').click(function(){
			$('.class-student-form').hide();
			studentList.getGroupAlertList($(this),$(this).siblings('.group-id-elementary'),sureBack,canelBack);
			function sureBack(){
				$('.class-student-form').show();
				groupId = $('.class-student-form .group-id-elementary').val();
				if($('.class-student-form .group-id-elementary-name').val() != '') {
					$('.class-student-form .group-id-elementary-name').removeClass('valid-hint');
					$('.class-student-form .group-id-elementary-name').siblings('.valid-font').text('');
				}
				var companyList = studentReport.getCompanyList(groupId);
				//单位添加数据
				if(companyList.length != 0) {
					$('.class-student-form select.org-id').empty();
					$('.class-student-form .orgType').text('');
					$('.class-student-form select.org-id').append(' <option value="">请选择</option>');
					$.each(companyList, function(i, o) {
						$('.class-student-form select.org-id').append(' <option value="' + o.groupId + '">' + o.groupName + '</option>').data('types', o.types);
					});
					$('.class-student-form select.org-id').niceSelect({  
				        search: true,  
				        backFunction: function(text) {  
				            //回调方法,可以执行模糊查询,也可自行添加操作  
				            $(".class-student-form select.org-id option").remove();  
				            if(text == "") {  
				                $(".class-student-form select.org-id").append('<option value="">请选择</option>');  
				            }  
				            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
				            $.each(companyList, function(i, n) {  
				                if(n.groupName.indexOf(text) != -1) {  
				                    $(".class-student-form select.org-id").append('<option value="' + n.groupId + '">' + n.groupName + '</option>').data('types', n.types);  
				                }  
				            });  
				        }  
				    });
					$(".class-student-form select.org-id").off().change(function() {
						if($(this).val() != '') {
							$("div.org-id").removeClass('valid-hint');
							$(this).siblings('.valid-font').text('');
						}
						$('.class-student-form .orgType').text($(this).data('types'));
					})
				} else {
					$('.class-student-form select.org-id').empty();
					$('.class-student-form select.org-id').append(' <option value="">请选择</option>');
					$('.class-student-form select.org-id').niceSelect();
				}
		
			}
			function canelBack(){
				$('.class-student-form').show();
				$('#pop-modle-alert').show();
			}
		})
		//点击导出按钮
		$('.export-class-student-btn').off('click').on('click', function() {
			//班级编号
			var projectCode = $yt_common.GetQueryString("projectCode");
			var exportName = $('.project-name:eq(0)').text() + "学员列表.xls";
			var gender = "";
			var phone = "";
			var groupId = "";
			var orgId = "";
			var deptPosition = "";
			var isFirstTraining = "";
			var classCommitteeId = "";
			var signUpState = "";
			$.ajaxDownloadFile({
				url: $yt_option.base_path + "class/trainee/exportTraineeByClass",
				data: {
					projectCode: projectCode,
					exportName: exportName,
					gender: gender,
					phone: phone,
					groupId: groupId,
					orgId: orgId,
					deptPosition: deptPosition,
					isFirstTraining: isFirstTraining,
					classCommitteeId: classCommitteeId,
					signUpState: signUpState,
					yitianSSODynamicKey:$yt_common.getyitianSSODynamicKey()
				}
			});
		});

		//点击上传照片按钮
		$('.upload-class-student-btn').off('click').on('click', function() {
			if($('.student-report-div .list-tbody .yt-table-active')[0]==undefined){
				$yt_alert_Model.prompt('请选择')
			}else{
				$('.class-student-upload-img').empty();
				$('.img-url-name-length').text(0);
	
				/** 
				 * 显示编辑弹出框和显示顶部隐藏蒙层 
				 */
				$(".class-student-upload-form").show();
				/** 
				 * 调用算取div显示位置方法 
				 */
				$yt_alert_Model.getDivPosition($(".class-student-upload-form"));
				/* 
				 * 调用支持拖拽的方法 
				 */
				$yt_model_drag.modelDragEvent($(".class-student-upload-form .yt-edit-alert-title"));
				/**
				 * 点击弹窗中的上传按钮
				 */
				$(".class-student-upload-form .yt-model-sure-btn").off().on('click', function() {
					var headPortraits = [];
					$('.class-student-upload-img .exceed').each(function(i, e) {
						var headPortrait = $(e).find('input').val();
						var headPortraitName = $(e).find('span').text();
						var exceedName = {
							headPortrait: headPortrait,
							headPortraitName: headPortraitName
						};
						headPortraits.push(exceedName);
					});
					headPortraits = JSON.stringify(headPortraits);
					console.log("headPortraits", headPortraits);
					//显示整体框架loading的方法
					$yt_baseElement.showLoading();
					$.ajax({
						type: "post",
						url: $yt_option.base_path + "class/traineeCheck/updateTraineeHeadPortrait",
						data: {
							headPortraits: headPortraits
						},
						async: true,
						success: function(data) {
							if(data.flag == 0) {
								//隐藏整体框架loading的方法
								$yt_baseElement.hideLoading(function() {
									$yt_alert_Model.prompt("上传成功");
									$(".class-student-upload-form").hide();
								});
							} else {
								//隐藏整体框架loading的方法
								$yt_baseElement.hideLoading(function() {
									$yt_alert_Model.prompt("上传失败");
								});
							}
						}
					});
	
				});
				/** 
				 * 点击取消方法 
				 */
				$('.class-student-upload-form .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
					//隐藏页面中自定义的表单内容  
					$(".class-student-upload-form").hide();
				});
			}
			
		});

		//上传方法
		$(".class-student-upload-form").undelegate().delegate("input[type='file']", "change", function() {
			console.log($(this)[0].files);
			var imgName = $(this)[0].files;
			console.log(imgName[0].type);
			//声明一个超过3M的空字符串
			var exceedName = '';
			//声明一个照片格式不正确的字符串
			var repeatName = '';

			for(var i = 0; i < imgName.length; i++) {
				//判断大小是否超过3M
				if(imgName[i].size > 3145728) {
					if(exceedName == "") {
						exceedName += imgName[i].name;
					} else {
						exceedName += "," + imgName[i].name;
					}
				}
				//判断格式是否正确
				if(imgName[i].name.split(".")[1] != "jpg" && imgName[i].name.split(".")[1] != "png") {
					if(repeatName == '') {
						repeatName += imgName[i].name;
					} else {
						repeatName += "," + imgName[i].name;
					}
				}
			}
			console.log(imgName.length);
			console.log(exceedName);
			var url = $yt_option.acl_path + "api/tAscPortraitInfo/addMultipartFiles?modelCode=headPortraits";
			//判断是否超过3M
			if(exceedName == "") {
				//判断照片格式是否正确	
				if(repeatName == "") {
					$yt_baseElement.showLoading();
					$.ajaxFileUpload({
						url: url,
						type: "post",
						dataType: 'json',
						fileElementId: "fileNames",
						success: function(data, textStatus) {
							var resultData = $.parseJSON(data);
							console.log("resultData", resultData.length);
							$("#fileNames").val("");
							if(resultData.success == 0) {
								$.each(resultData.obj, function(q, e) {
									$('.exceed[fileName="' + e.naming + '"]').remove();
									$('.class-student-upload-img').append('<span class="exceed" fileName="' + e.naming + '"><input  type="hidden" value="' + e.pkId + '"/><span class="exceed-name">' + e.naming + '</span>，</span>');
									//$('.class-student-upload-img .exceed0').append('<input  type="hidden" value="'+e.pkId+'"/>');
								});
								$yt_baseElement.hideLoading();
								$('.img-url-name-length').text($('.class-student-upload-img .exceed').length);
							} else {
								$yt_baseElement.hideLoading(function() {
									$('#fileNames').val("");
									$yt_alert_Model.prompt("上传照片失败");
								});
							}
						},
						error: function(data, status, e) { //服务器响应失败处理函数  
							$yt_baseElement.hideLoading(function() {
									$('#fileNames').val("");
								$yt_alert_Model.prompt("上传照片失败");
							});
						}
					});
				} else {
					$("#pop-modle-alert").css("z-index", 103);
					$yt_alert_Model.alertOne({
						haveCloseIcon: false, //是否带有关闭图标  
						leftBtnName: "关闭", //左侧按钮名称,默认确定  
						cancelFunction: "", //取消按钮操作方法*/  
						alertMsg: '<div class="word-break: break-all;">' + repeatName + '</div>格式不对', //提示信息  
						cancelFunction: function() { //点击确定按钮执行方法  
							$("#pop-modle-alert").css("z-index", 100).show();
						}
					});
				}
			} else {
				$("#pop-modle-alert").css("z-index", 103);
				$yt_alert_Model.alertOne({
					haveCloseIcon: false, //是否带有关闭图标  
					leftBtnName: "关闭", //左侧按钮名称,默认确定  
					cancelFunction: "", //取消按钮操作方法*/  
					alertMsg: '<div class="word-break: break-all;">' + exceedName + '</div>大小超过3M', //提示信息  
					cancelFunction: function() { //点击确定按钮执行方法  
						$("#pop-modle-alert").css("z-index", 100).show();
					}
				});
			}
		});

		//点击通讯录按钮
		$('.mail-list-btn').off('click').on('click', function() {
			//班级编号
			var projectCode = $yt_common.GetQueryString("projectCode");
			var sort = '';
			var orderType = '';
			//显示整体框架loading的方法
			$yt_baseElement.showLoading();
			$('.class-student-mail-form .page-info').pageInfo({
				async: true,
				pageIndexs: 1,
				pageNum: 15, //每页显示条数  
				pageSize: 10, //显示...的规律  
				url: $yt_option.base_path + "class/traineeCheck/getClassTrainee", //ajax访问路径  
				type: "post", //ajax访问方式 默认 "post"  
				data: {
					projectCode: projectCode,
					sort: sort,
					orderType: orderType
				}, //ajax查询访问参数
				objName: 'data', //指获取数据的对象名称  
				before: function() {
					//显示整体框架loading的方法	
					$yt_baseElement.showLoading();
				},
				success: function(data) {
					if(data.flag == 0) {
						var htmlTbody = $('.class-student-mail-form .student-msg tbody');
						var htmlTr = '';
						var num = 1;
						$(htmlTbody).empty();
						if(data.data.rows.length > 0) {
							$.each(data.data.rows, function(i, v) {
								if(v.gender == 1) {
									v.gender = "男";
								} else if(v.gender == 2) {
									v.gender = "女";
								}
								htmlTr = '<tr>' +
									'<td >' + v.realName + '</td>' +
									'<td style="text-align: center;">' + v.gender + '</td>' +
									'<td>' + v.phone + '</td>' +
									'<td>' + v.orgName + '</td>' +
									'<td>' + v.deptPosition +'/'+v.positionName+ '</td>' +
									'<td style="text-align:center;"><a class="yt-link" href="' + v.headPortrait + '" target="_blank">' + v.headPortraitName + '</a></td>' +
									'</tr>';
								htmlTbody.append(htmlTr);
							});
						} else {
							htmlTr = '<tr class="class-tr">' +
								'<td colspan="6" align="center" style="border:0px;">' +
								'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
								'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
								'</div>' +
								'</td>' +
								'</tr>';
							htmlTbody.append(htmlTr);
						}
						//隐藏整体框架loading的方法
						$yt_baseElement.hideLoading();
					} else {
						//隐藏整体框架loading的方法
						$yt_baseElement.hideLoading(function() {
							$yt_alert_Model.prompt("查询失败");
						});

					}

				}, //回调函数 匿名函数返回查询结果  
				isSelPageNum: true //是否显示选择条数列表默认false  
			});
			/** 
			 * 显示编辑弹出框和显示顶部隐藏蒙层 
			 */
			$(".class-student-mail-form").show();
			/** 
			 * 调用算取div显示位置方法 
			 */
			$yt_alert_Model.getDivPosition($(".class-student-mail-form"));
			/* 
			 * 调用支持拖拽的方法 
			 */
			$yt_model_drag.modelDragEvent($(".class-student-mail-form .yt-edit-alert-title"));
			/** 
			 * 点击取消方法 
			 */
			$('.class-student-mail-form .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
				//隐藏页面中自定义的表单内容  
				$(".class-student-mail-form").hide();
			});
		});
		var clickNum = 1;
		//点击弹窗的打印按钮
		$('.class-student-mail-form .yt-model-sure-btn').off('click').on('click', function() {
			//获取班级编号
			var projectCode = $yt_common.GetQueryString("projectCode");
			//显示整体框架loading的方法
			$yt_baseElement.showLoading();
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "class/traineeCheck/getTraineeCheck",
				data: {
					projectCode: projectCode,
					fileType: 2
				},
				async: true,
				success: function(data) {
					var htmlBody = $('.class-student-print-form .pring-list tbody');
					var htmlr = '';
					htmlBody.empty();
					if(data.flag == 0) {
						if(data.data.length != 0) {
							//判断此接口是否有返回值，若有则为第二次打印
							$('.again-print-btn').show();
							$('.print-opera span').eq(0).show();
							$('.pring-list').show();
							$('.print-opera').hide();
							$.each(data.data, function(i, p) {
								htmlr = '<tr>' +
									'<td style="text-align: center;">' + p.createTimeString + '</td>' +
									'<td style="text-align: center;">' + p.createUser + '</td>' +
									'<td><a href="' + p.fileUrl + '" class="yt-link">' + p.fileName + '</a></td>' +
									'<td style="text-align: right;">' + p.printerCount + '</td>';
								if(p.states == "2") {
									p.states = "打印完成";
									htmlr += '<td class="colour-yellow" style="text-align: center;">' + p.states + '</td>' +
										'</tr>';
								} else if(p.states == "3") {
									p.states = "待打印";
									htmlr += '<td class="colour-blue" style="text-align: center;">' + p.states + '</td>' +
										'</tr>';
								} else if(p.states == "4") {
									p.states = "已作废";
									htmlr += '<td class="colour-blue" style="text-align: center;">' + p.states + '</td>' +
										'</tr>';
								} else if(p.states == "5") {
									p.states = "未打印";
									htmlr += '<td style="text-align: center;">' + p.states + '</td>' +
										'</tr>';
								}
								htmlBody.append(htmlr);
							});
						} else {
							//判断此接口是否有返回值，若没有则为第一次打印
							$('.pring-list').hide();
							$('.print-opera').show();
							$('.print-opera span').eq(0).hide();
							$('.print-opera .print-file-name').hide();
							$('.again-print-btn').hide();
						}
						//隐藏整体框架loading的方法
						$yt_baseElement.hideLoading();
					} else {
						//隐藏整体框架loading的方法
						$yt_baseElement.hideLoading();
					}
				}
			});
			//点击重新打印按钮
			$('.class-student-print-form .again-print-btn').off().on('click', function() {
				$('.class-student-print-form .print-file-name a').text("");
				$('.class-student-print-form .print-count-num').val("");
				$('.print-opera').show();
			});
			//点击生成excel按钮
			$('.print-opera .generate-excel-btn').off().on('click', function() {
				$('.print-opera .print-file-name').show();
				//获取班级编号
				var projectCode = $yt_common.GetQueryString("projectCode");
				//显示整体框架loading的方法
				$yt_baseElement.showLoading();
				$.ajax({
					type: "post",
					url: $yt_option.base_path + "class/traineeCheck/getPrintingExcel",
					data: {
						projectCode: projectCode
					},
					async: true,
					success: function(data) {
						if(data.flag == 0) {
							$('.print-opera .file-id').val(data.data.fileId);

							$('.print-opera .print-file-name a').text(data.data.fileName);
							$('.print-opera .print-file-name a').attr('href', data.data.fileUrl);
							//隐藏整体框架loading的方法
							$yt_baseElement.hideLoading();
						} else {
							//隐藏整体框架loading的方法
							$yt_baseElement.hideLoading(function() {
								$yt_alert_Model.prompt("生成excel失败");
							});
						}
					}
				});
			});
			//点击确定按钮
			$('.class-student-print-form .yt-eidt-model-bottom .yt-model-sure-btn').off().on('click', function() {
				clickNum = 2;
				//获取班级编号
				var projectCode = $yt_common.GetQueryString("projectCode");
				var fileId = $('.print-opera .file-id').val();
				var fileName = $('.print-opera .print-file-name a').text();
				var printerCount = $('.print-opera .print-count-num').val();
				var fileType = 2;
				var states = 3;
				var pringingData = {
					projectCode: projectCode,
					fileId: fileId,
					fileName: fileName,
					printerCount: printerCount,
					fileType: fileType,
					states: states
				};
				pringingData = JSON.stringify(pringingData);
				console.log(pringingData);
				//显示整体框架loading的方法
				$yt_baseElement.showLoading();
				$.ajax({
					type: "post",
					url: $yt_option.base_path + "class/traineeCheck/addPrinting",
					data: {
						pringingData: pringingData
					},
					async: true,
					success: function(data) {
						if(data.flag == 0) {
							//隐藏整体框架loading的方法
							$yt_baseElement.hideLoading(function() {
								$yt_alert_Model.prompt("打印成功");
								$(".class-student-print-form").hide();
							});
						} else {
							//隐藏整体框架loading的方法
							$yt_baseElement.hideLoading(function() {
								$yt_alert_Model.prompt("打印失败");
							});
						}
					}
				});
			});
			/** 
			 * 显示编辑弹出框和显示顶部隐藏蒙层 
			 */
			$(".class-student-mail-form").hide();
			$(".class-student-print-form").show();
			/** 
			 * 调用算取div显示位置方法 
			 */
			$yt_alert_Model.getDivPosition($(".class-student-print-form"));
			/* 
			 * 调用支持拖拽的方法 
			 */
			$yt_model_drag.modelDragEvent($(".class-student-print-form .yt-edit-alert-title"));
			/** 
			 * 点击取消方法 
			 */
			$('.class-student-print-form .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {

				//隐藏页面中自定义的表单内容  
				$(".class-student-print-form").hide();
				$(".class-student-mail-form").show();
			});
		});
		//点击报到按钮
		$('.report-class-student-btn').off().on('click', function() {
			var studentList = $('.student-report-div .yt-table-active').data('studentList');
			if(studentList != null) {
				var checkInState = 1;
				studentReport.reportInterface(checkInState);
			} else {
				$yt_alert_Model.prompt("请选择一条学员数据");
			}

		});
		//点击未报到按钮
		$('.no-report-class-student-btn').off().on('click', function() {
			var studentList = $('.student-report-div .yt-table-active').data('studentList');
			if(studentList != null) {
				var checkInState = 0;
				studentReport.reportInterface(checkInState);
			} else {
				$yt_alert_Model.prompt("请选择一条学员数据");
			}
		});
		//点击新增
		$('.add-class-student-btn').off('click').on('click', function() {
			traineeId = "";
			$('.class-student-form .yt-edit-alert-title-msg').text("新增学员");
			//获取名字
			$('.class-student-form .class-student-name').val("");
			//获取组号
			$('.class-student-form .class-student-group-num').val("");;
			//获取性别
			$('.class-student-form .class-student-name').parent().parent().nextAll().find('input[type="radio"][value="1"]').setRadioState("check");
			//获取民族
			$('.class-student-form .student-nation').setSelectVal("");
			//获取手机号
			$('.class-student-form .class-student-phone').val("");
			//获取证件类型
			$('.class-student-form .card-type').setSelectVal("");
			//获取证件号
			$('.class-student-form .id-number').val("");
			//获取集团
			$('.class-student-form .group-id-elementary').val("");
			$('.class-student-form .group-id-elementary-name').val("");
			//获取单位
			$('.class-student-form .org-id').setSelectVal("");
			$('.class-student-form select.org-id').empty();
			$('.class-student-form select.org-id').niceSelect();
			//获取部门
			$('.class-student-form .student-msg .dept-name').val("");
			// 获取职位
			$('.class-student-form .student-msg .position-name').val("");
			//获取发票类型
			$('.class-student-form .student-invoice-type').setSelectVal("");
			//获取发票名称
			$('.class-student-form .student-invoice-name').val("");
			//获取识别号
			$('.class-student-form .student-invoice-duty').val("");
			//获取地址
			$('.class-student-form .student-invoice-address').val("");
			//获取电话
			$('.class-student-form .student-invoice-phone').val("");
			//获取开户行
			$('.class-student-form .student-invoice-open-bank').val("");
			//获取账户
			$('.class-student-form .student-invoice-acc').val("");
			//出生年月
			$('.class-student-form .date-birth').val();
			//获取单位类型
			$('.class-student-form .orgType').text('');
			//获取通信地址
			$('.class-student-form .mailing-address').val("");
			//获取邮政编码
			$('.class-student-form .postal-code').val("");
			//获取传真
			$('.class-student-form .class-student-fax').val("");
			//获取入党时间
			$('.class-student-form .party-date').val();
			//获取全职教育
			$('.class-student-form .education-time').val("");
			//获取全职教育-毕业院校及专业
			$('.class-student-form .education-time-class').val("");
			//获取在职教育
			$('.class-student-form .service-time').val("");
			//获取在职教育-毕业院校及专业
			$('.class-student-form .service-time-class').val("");
			//获取电话号
			$('.class-student-form .telephone-project').val("");
			//获取电子邮件
			$('.class-student-form .class-student-email').val("");
			//获取工作时间
			$('.class-student-form .work-time').val("");
			$('.receive-group-search').val("");
			/** 
			 * 显示编辑弹出框和显示顶部隐藏蒙层 
			 */
			$(".class-student-form").show();
			/** 
			 * 调用算取div显示位置方法 
			 */
			$yt_alert_Model.setFiexBoxHeight($(".class-student-form .yt-edit-alert-main"));
			$yt_alert_Model.getDivPosition($(".class-student-form"));
			/* 
			 * 调用支持拖拽的方法 
			 */
			$yt_model_drag.modelDragEvent($(".class-student-form .yt-edit-alert-title"));
			/** 
			 * 点击取消方法 
			 */
			$('.class-student-form .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
				//隐藏页面中自定义的表单内容  
				$(".class-student-form").hide();
				//隐藏蒙层  
				$("#pop-modle-alert").hide();
			});
		});
		//点击修改按钮
		$('.update-class-student-btn').off('click').on('click', function() {
			$('.receive-group-search').val("");
			//获取学员Id
			traineeId = $(".student-report-div .yt-table-active .trainee-id").val();
			var studentList = $('.student-report-div .yt-table-active').data('studentList');
			console.log('studentList', studentList);
			if(studentList != null) {
				var studentDetailedmsg = studentReport.getStudentDetailedMsg();
				console.log('studentReport.studentDetailedmsg', studentDetailedmsg);
				$('.class-student-form .yt-edit-alert-title-msg').text("修改学员");
				$('.class-student-form').setDatas(studentDetailedmsg);
				//获取性别
				$('.class-student-form .class-student-name').parent().parent().nextAll().find('input[type="radio"][value="' + studentDetailedmsg.gender + '"]').setRadioState("check");
				//获取民族
				$('.class-student-form .student-nation').setSelectVal(studentDetailedmsg.nationId);
				//获取证件类型
				$('.class-student-form .card-type').setSelectVal(studentDetailedmsg.idType);
				//获取集团
				$('.class-student-form .group-id-elementary').val(studentDetailedmsg.groupId);
				$('.class-student-form .group-id-elementary-name').val(studentDetailedmsg.groupName);
				groupId = studentDetailedmsg.groupId;
				var companyList = studentReport.getCompanyList(groupId);
				//单位添加数据
				if(companyList != "") {
					$('.class-student-form select.org-id').empty();
					$('.class-student-form select.org-id').append(' <option value="">请选择</option>');
					$.each(companyList, function(i, o) {
							$('.class-student-form select.org-id').append(' <option value="' + o.groupId + '">' + o.groupName + '</option>').data('types', o.types);
					});
					$('.class-student-form select.org-id').niceSelect({  
				        search: true,  
				        backFunction: function(text) {  
				            //回调方法,可以执行模糊查询,也可自行添加操作  
				            $(".class-student-form select.org-id option").remove();  
				            if(text == "") {  
				                $(".class-student-form select.org-id").append('<option value="">请选择</option>');  
				            }  
				            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
				            $.each(companyList, function(i, n) {  
				                if(n.groupName.indexOf(text) != -1) {  
				                    $(".class-student-form select.org-id").append('<option value="' + n.groupId + '">' + n.groupName + '</option>').data('types', n.types);  
				                }  
				            });  
				        }  
				    });
					$(".class-student-form select.org-id").off().change(function() {
						if($(this).val() != '') {
							$("div.org-id").removeClass('valid-hint');
							$(this).siblings('.valid-font').text('');
						}
						$('.class-student-form .orgType').text($(this).data('types'));
					})
				} else {
					$('.class-student-form select.org-id').empty();
					$('.class-student-form select.org-id').append(' <option value="">请选择</option>');
					$('.class-student-form select.org-id').niceSelect();
				}
				//获取单位
				$('.class-student-form .org-id').setSelectVal(studentDetailedmsg.groupOrgId);
				//获取发票类型
				$('.class-student-form .student-invoice-type').setSelectVal(studentDetailedmsg.invoiceType);
				//获取单位类型
				$('.class-student-form .orgType').text($(".class-student-form select.org-id").data('types'));
				me.oldStudentDataMsg.orgTypeVal = $(".class-student-form select.org-id").data('types');
//				$('.class-student-form .org-type').setSelectVal(studentDetailedmsg.orgType);
				me.oldStudentDataMsg.gender == 1?me.oldStudentDataMsg.genderVal='男':me.oldStudentDataMsg.genderVal='女';
				if(me.oldStudentDataMsg.invoiceType==1){
					me.oldStudentDataMsg.invoiceTypeVel = '普通发票'
				}else if(me.oldStudentDataMsg.invoiceType==2){
					me.oldStudentDataMsg.invoiceTypeVel = '增值税发票'
				}
				me.oldStudentDataMsg.nationName = $('.class-student-form select.student-nation option:selected').text();
				me.oldStudentDataMsg.idTypeName = $('.class-student-form select.card-type option:selected').text();
				me.oldStudentDataMsg.groupName = $('.class-student-form .group-id-elementary-name').val();
				/** 
				 * 显示编辑弹出框和显示顶部隐藏蒙层 
				 */
				$(".class-student-form").show();
				/** 
				 * 调用算取div显示位置方法 
				 */
				$yt_alert_Model.setFiexBoxHeight($(".class-student-form .yt-edit-alert-main"));
				$yt_alert_Model.getDivPosition($(".class-student-form"));
				/* 
				 * 调用支持拖拽的方法 
				 */
				$yt_model_drag.modelDragEvent($(".class-student-form .yt-edit-alert-title"));
				/** 
				 * 点击取消方法 
				 */
				$('.class-student-form .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
					//隐藏页面中自定义的表单内容  
					$(".class-student-form").hide();
					//隐藏蒙层  
					$("#pop-modle-alert").hide();
				});
			} else {
				$yt_alert_Model.prompt("请选择一条学员数据进行修改");
			}

		});

		//点击弹框确定按钮
		$(".class-student-form .yt-model-sure-btn").off('click').on('click', function() {
			var afterJson = {
			//获取班级编号
			projectCode : $yt_common.GetQueryString("projectCode"),
			groupName:$('.class-student-form .group-id-elementary-name').val(),
			groupOrgName:$('.class-student-form select.org-id option:selected').text(),
			nationName:$('.class-student-form select.student-nation option:selected').text(),
			idTypeName : $('.class-student-form select.card-type option:selected').text(),	
			invoiceTypeVel:$('.class-student-form select.student-invoice-type option:selected').text(),
			//获取名字
			realName : $('.class-student-form .class-student-name').val(),
			//获取组号
			groupNum : $('.class-student-form .class-student-group-num').val(),
			//获取性别
			gender : $('.class-student-form .class-student-name').parent().parent().nextAll().find('input[type="radio"]:checked').val(),
			//获取民族
			nationId : $('.class-student-form .student-nation').val(),
			//获取手机号
			phone : $('.class-student-form .class-student-phone').val(),
			//获取证件类型
			idType : $('.class-student-form .card-type').val(),
			//获取证件号
			idNumber : $('.class-student-form .id-number').val(),
			//获取集团
			groupId : $('.class-student-form .group-id-elementary').val(),
			//获取单位
			orgId : $('.class-student-form .org-id').val(),
			//获取部门
			deptName : $('.class-student-form .student-msg .dept-name').val(),
			// 获取职位
			positionName : $('.class-student-form .student-msg .position-name').val(),
			//获取发票类型
			invoiceType : $('.class-student-form .student-invoice-type').val(),
			//获取发票名称
			orgName : $('.class-student-form .student-invoice-name').val(),
			//获取识别号
			taxNumber : $('.class-student-form .student-invoice-duty').val(),
			//获取地址
			address : $('.class-student-form .student-invoice-address').val(),
			//获取电话
			telephoneProject : $('.class-student-form .student-invoice-phone').val(),
			//获取开户行
			registeredBank : $('.class-student-form .student-invoice-open-bank').val(),
			//获取账户
			account : $('.class-student-form .student-invoice-acc').val(),
			//出生年月
			dateBirth : $('.class-student-form .date-birth').val(),
			//获取单位类型
			orgType : $('.class-student-form .org-type').val(),
			orgTypeVal : $('.class-student-form .orgType').text(),
			//获取通信地址
			mailingAddress : $('.class-student-form .mailing-address').val(),
			//获取邮政编码
			postalCode : $('.class-student-form .postal-code').val(),
			//获取传真
			fax : $('.class-student-form .class-student-fax').val(),
			//获取入党时间
			partyDate : $('.class-student-form .party-date').val(),
			//获取全职教育
			educationTime : $('.class-student-form .education-time').val(),
			//获取全职教育-毕业院校及专业
			educationTimeClass : $('.class-student-form .education-time-class').val(),
			//获取在职教育
			serviceTime : $('.class-student-form .service-time').val(),
			//获取在职教育-毕业院校及专业
			serviceTimeClass : $('.class-student-form .service-time-class').val(),
			//获取电话号
			telephone : $('.class-student-form .telephone-project').val(),
			//获取电子邮件
			email : $('.class-student-form .class-student-email').val(),
			//获取工作时间
			workTime : $('.class-student-form .work-time').val()
			}
			if(afterJson.gender == 1){
				afterJson.genderVal='男'
			}else if(afterJson.gender == 2){
				afterJson.genderVal='女'
			}
			var operationContent='';
			if(traineeId!=''){
				operationContent = '修改操作：【'+studentReport.oldStudentDataMsg.realName+'】，'+studentList.getLogInfo(studentList.StudentJsonName,studentReport.oldStudentDataMsg,afterJson);
				studentList.getLogInfo(studentList.StudentJsonName,studentReport.oldStudentDataMsg,afterJson)=='；'?operationContent='':operationContent=operationContent;
			}
			if(afterJson.phone != "") {
				//显示整体框架loading的方法
				$yt_baseElement.showLoading();
				$.ajax({
					type: "post",
					url: $yt_option.base_path + "class/trainee/addOrUpdateTrainee",
					data: {
						traineeId: traineeId,
						projectCode: afterJson.projectCode,
						realName: afterJson.realName,
						groupNum: afterJson.groupNum,
						gender: afterJson.gender,
						nationId: afterJson.nationId,
						phone: afterJson.phone,
						idNumber: afterJson.idNumber,
						groupId: afterJson.groupId,
						orgId: afterJson.orgId,
						deptName: afterJson.deptName,
						positionName: afterJson.positionName,
						invoiceType: afterJson.invoiceType,
						orgName: afterJson.orgName,
						taxNumber: afterJson.taxNumber,
						address: afterJson.address,
						telephoneProject: afterJson.telephoneProject,
						registeredBank: afterJson.registeredBank,
						account: afterJson.account,
						idType: afterJson.idType,
						dateBirth: afterJson.dateBirth,
						orgType: afterJson.orgType,
						mailingAddress: afterJson.mailingAddress,
						postalCode: afterJson.postalCode,
						fax: afterJson.fax,
						partyDate: afterJson.partyDate,
						educationTime: afterJson.educationTime,
						educationTimeClass: afterJson.educationTimeClass,
						serviceTime: afterJson.serviceTime,
						serviceTimeClass: afterJson.serviceTimeClass,
						/*
						 学员报道无法修改联系人模块
						 * */
						//联系人-姓名
						linkman:studentReport.oldStudentDataMsg.linkman,
						linkmanPhone:studentReport.oldStudentDataMsg.linkmanPhone,
						linkmanTelephone:studentReport.oldStudentDataMsg.linkmanTelephone,
						linkmanFax:studentReport.oldStudentDataMsg.linkmanFax,
						linkmanEmail:studentReport.oldStudentDataMsg.linkmanEmail,
						linkmanAddressEmail:studentReport.oldStudentDataMsg.linkmanAddressEmail,
						//
						telephone: afterJson.telephone,
						email: afterJson.email,
						workTime: afterJson.workTime,
						operationContent:operationContent,
						traineeRemarks:studentReport.oldStudentDataMsg.traineeRemarks
					},
					async: true,
					success: function(data) {
						if(data.flag == 0) {
							console.log("traineeId", traineeId);
							//隐藏整体框架loading的方法
							$yt_baseElement.hideLoading(function() {
								if(traineeId == "") {
									$yt_alert_Model.prompt("添加成功");
								} else {
									$yt_alert_Model.prompt("修改成功");
								}
								//刷新页面
								studentReport.getStudentReport();
								$(".class-student-form").hide();
							});
						} else {
							//隐藏整体框架loading的方法
							$yt_baseElement.hideLoading(function() {
								if(traineeId == "") {
									$yt_alert_Model.prompt("添加失败");
								} else {
									$yt_alert_Model.prompt("修改失败");
								}
								//刷新页面
								studentReport.getStudentReport();
								$(".class-student-form").hide();
							});
						}
					}
				});
			} else {
				/** 
				 * 调用验证方法 
				 */
				$yt_valid.validForm($(".valid-tab1"));
			}

		});
	},
	/**
	 * 失去焦点事件
	 */
	losFfocus: function() {
		$('.student-invoice-duty').blur(function() {
			//税号字母变成大写
			$(this).val($(this).val().toUpperCase());
		});
	},
	/**
	 * 获取一个学员的详细信息
	 */
	oldStudentDataMsg:{},
	getStudentDetailedMsg: function() {
		var me = this ;
		//var studentList=$('.student-report-div .yt-table-active').data('studentList');
		var traineeId = $(".student-report-div .yt-table-active .trainee-id").val();
		var studentDetailedMsg;
		//获取班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/trainee/getTraineeDetails",
			data: {
				traineeId: traineeId,
				projectId: projectCode
			},
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					data.data.workTime=="0000-00-00"?data.data.workTime='':data.data.workTime=data.data.workTime;
					studentDetailedMsg = data.data;
					me.oldStudentDataMsg = data.data;
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading();
				}
			}
		});
		return studentDetailedMsg;
	},
	/**
	 * 报到未报到接口
	 */
	reportInterface: function(checkInState) {
		//获取班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		var studentList = $('.student-report-div .yt-table-active').data('studentList');
		var traineeId = studentList.traineeId;
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/traineeCheck/updateCheckState",
			data: {
				projectCode: projectCode,
				traineeId: traineeId,
				checkInState: checkInState
			},
			async: true,
			success: function(data) {
				if(data.flag == 0) {
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("设置成功");
						studentReport.getStudentReport();
					});
				} else {
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("设置失败");
						studentReport.getStudentReport();
					});
				}
			}
		});
	},
	//获取民族列表
	getNationList: function() {
		var nationList = [];
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/getNations",
			data: {
				searchParameters: ""
			},
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					console.log("成功");
					$.each(data.data, function(a, b) {
						nationList.push(b);
					});
				}
			}
		});
		return nationList;
	},
	//获取集团列表
	getGroupList: function() {
		var groupList = [];
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/group/getGroups",
			data: {
				isSelectGroup: 1
			},
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					$.each(data.data, function(a, b) {
						groupList.push(b);
					});
				}
			}
		});
		return groupList;
	},
	//获取单位列表
	getCompanyList: function(groupId) {
		var companyList = [];
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/group/getGroups",
			data: {
				isSelectGroup: 3,
				groupId: groupId
			},
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					$.each(data.data, function(a, b) {
						companyList.push(b);
					});
				}
			}
		});
		return companyList;
	},
	/**
	 * 查询学员报到列表
	 */
	getStudentReport: function() {
		var projectCode = $yt_common.GetQueryString("projectCode");
		var selectParam = $('.student-report-div .keyword').val();
		var gender = "";
		var phone = "";
		var groupId = "";
		var orgId = "";
		var deptPosition = "";
		var isFirstTraining = "";
		var classCommitteeId = "";
		var signUpState = "";
		var checkInState = "";
		var sort = "";
		var orderType = "";
		var pageIndexs = $(".student-report-div .page-info").find(".active").text();
		if (pageIndexs == "") {
			pageIndexs = 1;
		}
		$('.student-report-div .page-info').eq(0).pageInfo({
			async: true,
			pageIndexs: pageIndexs,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "class/trainee/getClassTrainee", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				projectCode: projectCode,
				selectParam: selectParam,
				gender: gender,
				phone: phone,
				groupId: groupId,
				orgId: orgId,
				deptPosition: deptPosition,
				isFirstTraining: isFirstTraining,
				classCommitteeId: classCommitteeId,
				signUpState: signUpState,
				checkInState: checkInState,
				sort: sort,
				orderType: orderType
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			before: function() {
				//显示整体框架loading的方法	
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.student-report-div .list-tbody');
					var htmlTr = '';
					var num = 1;
					$(htmlTbody).empty();
					if(data.data.rows.length > 0) {
						$('.student-report-div .page-info').show();
						$.each(data.data.rows, function(i, v) {

							if(v.gender == 1) {
								v.gender = "男";
							} else if(v.gender == 2) {
								v.gender = "女";
							}
							if(v.isFirstTraining == 0) {
								v.isFirstTraining = "否";
							} else {
								v.isFirstTraining = "是";
							}
							htmlTr = '<tr>' +
								'<td style="text-align: center;"><input type="hidden" value="' + v.pkId + '" class="pkId">' + v.groupNum + '</td>' +
								'<td style="text-align: left;"><input type="hidden" value="' + v.traineeId + '" class="trainee-id"><a href="#" class="real-name-inf" style=" color:#3c4687;word-break: break-all;">' + v.realName + '</a></td>' +
								'<td style="text-align: center;">' + v.gender + '</td>' +
								'<td style="text-align: center;">' + v.phone + '</td>' +
								'<td style="text-align: left;">' + v.groupName + '</td>' +
								'<td style="text-align: left;">' + v.groupOrgName + '</td>' +
								'<td style="text-align: left;">' + (v.deptPosition+v.positionName) + '</td>' +
								'<td>' + v.classCommitteeName + '</td>' +
								'<td style="text-align: center;">' + v.isFirstTraining + '</td>';
							if(v.checkInState == 0) {
								v.checkInState = "未报到";
								htmlTr += '<td class="colour-yellow" style="text-align: center;">' + v.checkInState + '</td>' +
									'</tr>';
							} else {
								v.checkInState = "已报到";
								htmlTr += '<td class="colour-blue" style="text-align: center;">' + v.checkInState + '</td>' +
									'</tr>';
							}

							htmlTr = $(htmlTr).data('studentList', v);
							htmlTbody.append(htmlTr);
						});
					} else {
						$('.student-report-div .page-info').hide();
						htmlTr = '<tr class="class-tr">' +
							'<td colspan="10" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						htmlTbody.append(htmlTr);
					}
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading();
				} else {
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading(function() {

						$yt_alert_Model.prompt("查询失败");
					});

				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	/**
	 * 查询酒店入住名单与学员列表不匹配列表
	 */
	getDifferentList: function() {
		//班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/trainee/getHotelTraineeToClassTrainee",
			data: {
				projectCod: projectCode
			},
			async: true,
			success: function(data) {
				var htmlBody = $('.different-student-list tbody ');
				var htmlTr = '';
				var num = 1;
				if(data.flag == 0) {
					if(data.data.length > 0) {
						htmlBody.parent().parent().show();
						$.each(data.data, function(k, b) {
							htmlTr = '<tr>' +
								'<td>' + num++ + '</td>' +
								'<td>' + b.traineeName + '</td>' +
								'<td>' + b.gender + '</td>' +
								'<td>' + b.idNumber + '</td>' +
								'<td>' + b.roomNumber + '</td>' +
								'<td>' + b.createTimeString + '</td>' +
								'<td>' + b.reason + '</td>' +
								'</tr>';
							htmlBody.append(htmlTr);
						});
					} else {
						htmlBody.parent().parent().hide();
					}

				} else {
					$yt_alert_Model.prompt("查询失败");
				}
			}
		});
	}
}
/**
 * 缴费开票
 */
var payTicket = {
	init: function() {
		var me = this ;
		//加载下拉列表
		$(".ticket-class-student-form .student-nation").niceSelect();
		$(".ticket-class-student-form .card-types").niceSelect();
		$(".ticket-class-student-form .org-ids").niceSelect();
		$(".ticket-class-student-form .org-types").niceSelect();
		$(".ticket-class-student-form .student-invoice-types").niceSelect();

		console.log("缴费开票获取民族", studentList.getStudentNationList());
		//加载民族
		var tickStudentNation = studentList.getStudentNationList();
		if(tickStudentNation.length != 0) {
			$.each(tickStudentNation, function(i, n) {
				$(".ticket-class-student-form .student-nation").append('<option value="' + n.nationId + '">' + n.nationName + '</option>');
			});
			$(".ticket-class-student-form .student-nation").niceSelect();
		}
		$(".ticket-class-student-form .group-id-elementary-name").off().click(function(){
			$(".ticket-class-student-form").hide();
			studentList.getGroupAlertList($(this),$(this).siblings('.group-id-elementary'),sureBack,canelBack);
			function sureBack(){
				$(".ticket-class-student-form").show();
				var groupId = $(".ticket-class-student-form .group-id-elementary").val();
				var tickCompany = studentList.getStudentCompanyList(groupId);
				if(tickCompany.length != 0) {
					$(".ticket-class-student-form select.org-ids").empty();
					$('.ticket-class-student-form .orgTypes').text('');
					$(".ticket-class-student-form select.org-ids").append('<option value="">请选择</option>');
					$.each(tickCompany, function(i, a) {
							$(".ticket-class-student-form select.org-ids").append('<option value="' + a.groupId + '">' + a.groupName + '</option>').data('types', a.types);
					});
					$(".ticket-class-student-form select.org-ids").niceSelect({  
				        search: true,  
				        backFunction: function(text) {  
				            //回调方法,可以执行模糊查询,也可自行添加操作  
				            $(".ticket-class-student-form select.org-ids option").remove();  
				            if(text == "") {  
				                $(".ticket-class-student-form select.org-ids").append('<option value="">请选择</option>');  
				            }  
				            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
				            $.each(tickCompany, function(i, n) {  
				                if(n.groupName.indexOf(text) != -1) {  
				                    $(".ticket-class-student-form select.org-ids").append('<option value="' + n.groupId + '">' + n.groupName + '</option>').data('types', n.types);  
				                }  
				            });  
				        }  
				    });
					$("select.org-ids").off().change(function() {
						if($(this).val() != '') {
							$("div.org-ids").removeClass('valid-hint');
							$(this).siblings('.valid-font').text('');
						}
						$('.ticket-class-student-form .orgTypes').text($(this).data('types'));
					})
				} else {
					$(".ticket-class-student-form select.org-ids").empty();
					$(".ticket-class-student-form select.org-ids").append('<option value="">请选择</option>');
					$(".ticket-class-student-form select.org-ids").niceSelect();
				}
			}
			function canelBack(){
				$(".ticket-class-student-form").show();
				$("#pop-modle-alert").show();
			}
		})
		//点击复选框按钮
		$('.pay-ticket-open-div .tab-content label input').change(function() {
			var reconciliationState = 0;
			var invoiceState = 0;
			var reconciliationList = $('.pay-ticket-open-div .tab-content label input[name="reconciliationState"]:checked');
			var invoiceList = $('.pay-ticket-open-div .tab-content label input[name="invoiceState"]:checked');
			console.log(reconciliationList + '-----' + invoiceList)
			if(reconciliationList.length != 2) {
				reconciliationState = reconciliationList.val();
			} else {
				reconciliationState = 2;
			}
			if(invoiceList.length != 2) {
				invoiceState = invoiceList.val();
			} else {
				invoiceState = 2;
			}
			payTicket.PayTicketList(reconciliationState, invoiceState);
		});
		//点击搜索按钮进行模糊查询
		$('.pay-ticket-open-div .search-btn').click(function() {
			var reconciliationState = 0;
			var invoiceState = 0;
			var reconciliationList = $('.pay-ticket-open-div .tab-content label input[name="reconciliationState"]:checked');
			var invoiceList = $('.pay-ticket-open-div .tab-content label input[name="invoiceState"]:checked');
			console.log(reconciliationList + '-----' + invoiceList)
			if(reconciliationList.length != 2) {
				reconciliationState = reconciliationList.val();
			} else {
				reconciliationState = 2;
			}
			if(invoiceList.length != 2) {
				invoiceState = invoiceList.val();
			} else {
				invoiceState = 2;
			}
			payTicket.PayTicketList(reconciliationState, invoiceState);
		});
		//点击查看开票信息
		$('.pay-ticket-open-div .list-table tbody').off('click').on('click', '.see-ticket', function() {
			//初始化开票信息弹窗
			$(".invoice-type-info").text("");
			$(".org-name-info").text("");
			$(".tax-number-info").text("");
			$(".address-info").text("");
			$(".telephone-info").text("");
			$(".registered-bank-info").text("");
			$(".account-info").text("");
			//学员或单位id
			var traineeId;
			//学员或单位类型
			var types = $(this).parent().parent().find('.types').val();
			if(types == 2){
				//学员id
				traineeId = $(this).parent().parent().find('.traineeId').val();
			}else{//单位
				//单位id
				traineeId = $(this).parent().parent().find('.group-org-id').val();
			}
			var inspectTicketList = payTicket.inspectTicketList(traineeId,types);
			if (inspectTicketList != null) {
				$(".look-billing-inf-alert").setDatas(inspectTicketList);
			};
			
			/** 
			 * 显示编辑弹出框和显示顶部隐藏蒙层 
			 */
			$(".look-billing-inf-alert").show();
			/** 
			 * 调用算取div显示位置方法 
			 */
			$yt_alert_Model.getDivPosition($(".look-billing-inf-alert"));
			/* 
			 * 调用支持拖拽的方法 
			 */
			$yt_model_drag.modelDragEvent($(".look-billing-inf-alert .yt-edit-alert-title"));
			/** 
			 * 点击取消方法 
			 */
			$('.look-billing-inf-alert .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
				//隐藏页面中自定义的表单内容  
				$(".look-billing-inf-alert").hide();
			});
		});
		//点击姓名查看详情
		$(".pay-ticket-open-div").off('click').on('click', '.pay-student-name', function() {
			var traineeId = $(this).parent().parent().find('.traineeId').val();
			var headImg = new Image();
			var ticketStudentDetail = payTicket.ticketStudentDetail(traineeId);
			//证件类型   1:身份证 2:护照 3:军官证 4:其他
			if(ticketStudentDetail.idType == 1){
				$(".pay-id-type").text("身份证");
			}else if(ticketStudentDetail.idType == 2){
				$(".pay-id-type").text("护照");
			}else if(ticketStudentDetail.idType == 3){
				$(".pay-id-type").text("军官证");
			}else if(ticketStudentDetail.idType == 4){
				$(".pay-id-type").text("其他");
			}
			//性别
			if(ticketStudentDetail.gender == 1) {
				ticketStudentDetail.gender = "男";
			} else {
				ticketStudentDetail.gender = "女";
			}
			//发票类型
			if(ticketStudentDetail.invoiceType == 0) {
				ticketStudentDetail.invoiceType = "暂不开票";
			} else if(ticketStudentDetail.invoiceType == 1) {
				ticketStudentDetail.invoiceType = "普通发票";
			} else {
				ticketStudentDetail.invoiceType = "增值税发票";
			}
			//报到状态
			if(ticketStudentDetail.checkInState == 0) {
				ticketStudentDetail.checkInState = "未报到";
			} else {
				ticketStudentDetail.checkInState = "已报到";
			}
			//缴费状态
			if(ticketStudentDetail.paymentState == 0) {
				ticketStudentDetail.paymentState = "未对账";
			} else {
				ticketStudentDetail.paymentState = "已对账";
			}
			//开票状态
			if(ticketStudentDetail.isOrderNum == 0) {
				ticketStudentDetail.isOrderNum = "未开票";
			} else {
				ticketStudentDetail.isOrderNum = "已开票";
			}
			if(ticketStudentDetail.headPortrait != "") {
				headImg.src = ticketStudentDetail.headPortraitUrl;
				headImg.onload = function() {
					$('.pay-student-details-form .student-details-img').attr('src', headImg.src);
					$('.pay-student-details-form .student-details-img').jqthumb({
						width: 89,
						height: 130
					});
				};
			} else {
				$('.pay-student-details-form .student-details-img').attr('src', '../../resources/images/classStudent/student-picture.png');
				$('.pay-student-details-form .student-details-img').jqthumb({
					width: 89,
					height: 130
				});
			}
			$('.pay-student-details-form').setDatas(ticketStudentDetail);
			//开票信息
					var recordList = ticketStudentDetail.orderList;
					var recordBody = $('.order-record-table .order-list-tbody').empty();
					if(recordList!=""){
						var recordHtml = '';
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
							var trainees
							if(v.trainees==undefined){
								trainees = []
								v.trainees='';
							}else{
								trainees = v.trainees.split(',');
							}
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
						recordHtml='<tr style="border:0px;background-color:#fff !important;" >' +
									'<td width="77px" align="right" style="border:0px;">开票状态：</td>' +
									'<td align="left" style="border:0px;">未开票</td>' +
									'</tr>';
							recordBody.append(recordHtml);
					}
			/** 
			 * 显示编辑弹出框和显示顶部隐藏蒙层 
			 */
			$('.pay-student-details-form').show();
			/** 
			 * 调用算取div显示位置方法 
			 */
			$yt_alert_Model.setFiexBoxHeight($(".pay-student-details-form .yt-edit-alert-main"));
			$yt_alert_Model.getDivPosition($(".pay-student-details-form"));
			/* 
			 * 调用支持拖拽的方法 
			 */
			$yt_model_drag.modelDragEvent($(".pay-student-details-form .yt-edit-alert-title"));
			/** 
			 * 点击取消方法 
			 */
			$('.pay-student-details-form .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
				//隐藏页面中自定义的表单内容  
				$(".pay-student-details-form").hide();
			});
		});
		//二级联动加载单位
		//点击修改按钮
		$('.pay-ticket-open-div .ticket-update-class-student-btn').off('click').on('click', function() {
			$yt_baseElement.showLoading();
			//修改弹窗赋值
			var traineeId = $(".pay-ticket-open-div .yt-table-active .traineeId").val();
			if(traineeId != null) {
				if(traineeId !=''){
					var payStudent = payTicket.queryStudentDetails(traineeId);
					$('.ticket-class-student-form .yt-model-sure-btn').off('click').on('click', function() {
						payTicket.tickRepairStudent(traineeId);	
				});
				console.log("payStudent", payStudent);
				if(payStudent != null) {
					$('.ticket-class-student-form').setDatas(payStudent);
					//获取性别
					$('.ticket-class-student-form .class-student-name').parent().parent().nextAll().find('input[type="radio"][value="' + payStudent.gender + '"]').setRadioState("check");
					//获取民族
					$('.ticket-class-student-form .student-nation').setSelectVal(payStudent.nationId);
					//获取证件类型
					$('.ticket-class-student-form .card-types').setSelectVal(payStudent.idType);
					console.log(payStudent);
					//获取集团
					$('.ticket-class-student-form .group-id-elementary').val(payStudent.groupId);
					$('.ticket-class-student-form .group-id-elementary-name').val(payStudent.groupName);
					groupId = payStudent.groupId;
					var companyList = studentReport.getCompanyList(groupId);
					//单位添加数据
				if(companyList != "") {
					$('.ticket-class-student-form select.org-ids').empty();
					$('.ticket-class-student-form select.org-ids').append(' <option value="">请选择</option>');
					$.each(companyList, function(i, o) {
						$('.ticket-class-student-form select.org-ids').append(' <option value="' + o.groupId + '">' + o.groupName + '</option>').data('types', o.types);
					});
					$('.ticket-class-student-form select.org-ids').niceSelect({  
				        search: true,  
				        backFunction: function(text) {  
				            //回调方法,可以执行模糊查询,也可自行添加操作  
				            $(".ticket-class-student-form select.org-ids option").remove();  
				            if(text == "") {  
				                $(".ticket-class-student-form select.org-ids").append('<option value="">请选择</option>');  
				            }  
				            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
				            $.each(companyList, function(i, n) {  
				                if(n.groupName.indexOf(text) != -1) {  
				                    $(".ticket-class-student-form select.org-ids").append('<option value="' + n.groupId + '">' + n.groupName + '</option>').data('types', n.types);  
				                }  
				            });  
				        }  
				    });
					$(".ticket-class-student-form select.org-ids").off().change(function() {
						if($(this).val() != '') {
							$(".ticket-class-student-form div.org-ids").removeClass('valid-hint');
							$(this).siblings('.valid-font').text('');
						}
						console.log($(this).data('types'));
						$('.ticket-class-student-form .orgTypes').text($(this).data('types'));
					})
				} else {
					$('.ticket-class-student-form select.org-ids').empty();
					$('.ticket-class-student-form select.org-ids').append(' <option value="">请选择</option>');
					$('.ticket-class-student-form select.org-ids').niceSelect();
				}
				//获取单位
				$('.ticket-class-student-form .org-ids').setSelectVal(payStudent.groupOrgId);
				$('.ticket-class-student-form .orgTypes').text($('.ticket-class-student-form select.org-ids').data('types'));
				//获取发票类型
				$('.ticket-class-student-form .student-invoice-types').setSelectVal(payStudent.invoiceType);
				//获取单位类型
				$('.ticket-class-student-form .orgTypes').setSelectVal(payStudent.orgType);
				$('.ticket-class-student-form .orgTypes').text($(".ticket-class-student-form select.org-ids").data('types'));
				me.oldStudentDataMsg.orgTypeVal = $(".ticket-class-student-form select.org-ids").data('types');
				me.oldStudentDataMsg.gender == 1?me.oldStudentDataMsg.genderVal='男':me.oldStudentDataMsg.genderVal='女';
				if(me.oldStudentDataMsg.invoiceType==1){
					me.oldStudentDataMsg.invoiceTypeVel = '普通发票'
				}else if(me.oldStudentDataMsg.invoiceType==2){
					me.oldStudentDataMsg.invoiceTypeVel = '增值税发票'
				}
				me.oldStudentDataMsg.nationName = $('.ticket-class-student-form select.student-nation option:selected').text();
				me.oldStudentDataMsg.idTypeName = $('.ticket-class-student-form select.card-type option:selected').text();
				me.oldStudentDataMsg.groupName = $('.ticket-class-student-form .group-id-elementary-name').val();
					/** 
					 * 显示编辑弹出框和显示顶部隐藏蒙层 
					 */
					$('.ticket-class-student-form').show();
					/** 
					 * 调用算取div显示位置方法 
					 */
					$yt_alert_Model.setFiexBoxHeight($(".ticket-class-student-form .yt-edit-alert-main"));
					$yt_alert_Model.getDivPosition($(".ticket-class-student-form"));
					/* 
					 * 调用支持拖拽的方法 
					 */
					$yt_model_drag.modelDragEvent($(".ticket-class-student-form .yt-edit-alert-title"));
					/** 
					 * 点击取消方法 
					 */
					$('.ticket-class-student-form .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
						//隐藏页面中自定义的表单内容  
						$(".ticket-class-student-form").hide();
					});
				} else {
					$yt_alert_Model.prompt("查询失败");
				}
				}else{
					$yt_alert_Model.prompt("请选择学员进行修改");
				}
			} else {
				$yt_alert_Model.prompt("请选择记录");
			}
			$yt_baseElement.hideLoading();
		});
		
		//点击导出按钮
		$('.pay-ticket-open-div .ticket-export-class-student-btn').click(function() {
			console.log("导出");
			var reconciliationState = 0;
			var invoiceState = 0;
			var reconciliationList = $('.pay-ticket-open-div .tab-content label input[name="reconciliationState"]:checked');
			var invoiceList = $('.pay-ticket-open-div .tab-content label input[name="invoiceState"]:checked');
			if(reconciliationList.length != 2) {
				reconciliationState = reconciliationList.val();
			} else {
				reconciliationState = 2;
			}
			if(invoiceList.length != 2) {
				invoiceState = invoiceList.val();
			} else {
				invoiceState = 2;
			}
			payTicket.ticketExport(reconciliationState, invoiceState);
		});
		//点击导入开票信息
		$('.pay-ticket-open-div .ticket-add-class-student-btn').off('click').on('click', function() {
			
			//初始化文件名显示框
			$('.ticket-import-form .import-file-name').val("");
			$("#ticketeName").val("")
			//选择文件
			$(".ticket-import-form").undelegate().delegate("input[type='file']", "change", function() {
				//文件名
				$('.ticket-import-form .import-file-name').val($(this)[0].files[0].name);
			});
			//导入确定按钮
			$('.ticket-import-form .yt-model-sure-btn').off().on('click', function() {
				var file = $('.ticket-import-form .import-file-name').val();
				//获取班级编号
				var projectCode = $yt_common.GetQueryString("projectCode");
				var url = $yt_option.base_path + "class/trainee/leadingTraineeInvoice";
				//显示整体框架loading的方法
				$yt_baseElement.showLoading();
				$.ajaxFileUpload({
					type: "post",
					url: url,
					data:{
						projectCode:projectCode,
						file:file
					},
					dataType: 'json',
					fileElementId: 'ticketeName',
					success: function(data, textStatus) {
						if(data.flag == 0) {
							$yt_baseElement.hideLoading(function() {
								//隐藏页面中自定义的表单内容  
								$(".ticket-import-form-erro").hide();
								//隐藏导入自定义表单
								$(".ticket-import-form").hide();
								//隐藏蒙层  
								$("#pop-modle-alert").hide();
								
								$yt_alert_Model.prompt("导入成功");
							});
						} else {
							$yt_baseElement.hideLoading(function() {
								//隐藏导入自定义表单
								$(".ticket-import-form").hide();
								//开票导入显示错误数据列表弹窗
								//显示编辑弹出框和显示顶部隐藏蒙层 
								$(".ticket-import-form-erro").show();
								//调用算取div显示位置方法 
								$yt_alert_Model.getDivPosition($(".ticket-import-form-erro"));
								//调用支持拖拽的方法 
								$yt_model_drag.modelDragEvent($(".ticket-import-form-erro .yt-edit-alert-title"));
								//点击取消方法 
								$('.ticket-import-form-erro .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
									//隐藏页面中自定义的表单内容  
									$(".ticket-import-form-erro").hide();
									//隐藏导入自定义表单
									$(".ticket-import-form").hide();
									//隐藏蒙层  
									$("#pop-modle-alert").hide();
								});
								$(".ticket-erro-list-table .list-tbody").empty();
								$.each(data.data, function(t,e) {
									if (e.realName == undefined) {
										e.realName = "";
									};
									if (e.phone == undefined) {
										e.phone = "";
									};
									if (e.orgName == undefined) {
										e.orgName = "";
									};
									if (e.taxNumber == undefined) {
										e.taxNumber = "";
									};
									if (e.address == undefined) {
										e.address = "";
									};
									if (e.telephone == undefined) {
										e.telephone = "";
									};
									if (e.registeredBank == undefined) {
										e.registeredBank = "";
									};
									if (e.account == undefined) {
										e.account = "";
									};
									if (e.reason == undefined) {
										e.reason = "";
									};
									var erroHtml = '<tr>'+
														'<td>'+e.realName+'</td>'+
														'<td>'+e.phone+'</td>'+
														'<td style="text-align:left;word-break:break-all;">'+e.orgName+'</td>'+
														'<td>'+e.taxNumber+'</td>'+
														'<td style="text-align:left;word-break:break-all;">'+e.address+'</td>'+
														'<td>'+e.telephone+'</td>'+
														'<td style="text-align:left;word-break:break-all;">'+e.registeredBank+'</td>'+
														'<td style="text-align:left;word-break:break-all;">'+e.account+'</td>'+
														'<td style="text-align:left;word-break:break-all;">'+e.reason+'</td>'+
													'</tr>';	
									$(".ticket-erro-list-table .list-tbody").append(erroHtml);
								});
								
							});
						}
					},
					error: function(data, status, e) { //服务器响应失败处理函数  
						$yt_baseElement.hideLoading(function() {
							$yt_alert_Model.prompt("导入文件失败了");
						});
					}
				});
			});
			//开票点击下载模板
			$('.ticket-import-form .download-template').click(function() {
				var fileName = "开票信息模板";
				$.ajaxDownloadFile({
					url: $yt_option.base_path + "class/trainee/downloadInvoice",
					data: {
						fileName: fileName,
					yitianSSODynamicKey:$yt_common.getyitianSSODynamicKey()
					}
				});
			});
			/** 
			 * 显示编辑弹出框和显示顶部隐藏蒙层 
			 */
			$(".ticket-import-form").show();
			/** 
			 * 调用算取div显示位置方法 
			 */
			$yt_alert_Model.getDivPosition($(".ticket-import-form"));
			/* 
			 * 调用支持拖拽的方法 
			 */
			$yt_model_drag.modelDragEvent($(".ticket-import-form .yt-edit-alert-title"));
			/** 
			 * 点击取消方法 
			 */
			$('.ticket-import-form .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
				//隐藏页面中自定义的表单内容  
				$(".ticket-import-form").hide();
			});
		});
	},
	/**
	 * 查看开票信息
	 */
	inspectTicketList: function(groupOrgId,types) {
		var inspectTicketList;
		//获取班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/projectInvoice/getInvoice",
			data: {
				traineeOrGroupId: groupOrgId,
				projectCode: projectCode,
				types: types
			},
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					if (data.data != null) {
						//0:暂不开票 1:普通发票  2:增值税发票
						if (data.data.invoiceType == 0) {
							$(".invoice-type-info").text("暂不开票");
						}else if(data.data.invoiceType == 1){
							$(".invoice-type-info").text("普通发票");
						}else if(data.data.invoiceType == 2){
							$(".invoice-type-info").text("增值税发票");
						}
					}
					inspectTicketList = data.data;
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading();
				}else{
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
						inspectTicketList = ""
					});
					
				}
			}
		});
		return inspectTicketList;
	},
	/**
	 * 缴费开票查询列表
	 */
	PayTicketList: function(reconciliationState, invoiceState) {
		//获取班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		var selectParam = $(".pay-ticket-open-div .keyword").val();
		var checkInState = 2;
		$('.pay-ticket-open-div .page-info').pageInfo({
			async: true,
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			before: function() {
				$yt_baseElement.showLoading();
			},
			url: $yt_option.base_path + "class/trainee/getClassTraineeInvoice", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				projectCode: projectCode,
				selectParam: selectParam,
				checkInState: checkInState,
				reconciliationState: reconciliationState,
				invoiceState: invoiceState
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.pay-ticket-open-div .list-table tbody');
					var htmlTr = '';
					htmlTbody.empty();
					if(data.data.rows != null) {
						var margeStates = "";
						var last = 0;
						var numLengtht = 1;
						$.each(data.data.rows, function(i, v) {
							if(v.gender == 1) {
								v.gender = "男";
							} else if(v.gender == 2){
								v.gender = "女";
							}
							htmlTr = '<tr>' +
								'<td>' + v.groupNum + '</td>' +
								'<input type="hidden" value="' + v.groupOrgId + '" class="trainee-id group-org-id">' +
								'<input type="hidden" value="' + v.types + '" class="types">' +
								'<input type="hidden" value="' + v.traineeId + '" class="traineeId">' +
								'<td style="text-align:left;"><a class="yt-link pay-student-name" style="color:#3c4687;">' + v.realName + '</a></td>' +
								'<td>' + v.gender + '</td>' +
								'<td class="text-overflow">' + v.phone + '</td>' +
								'<td class="text-overflow" style="text-align:left;">' + v.groupOrgName + '</td>' +
								'<td class="tl" style="text-align: center !important;"><a class="yt-link see-ticket">查看</a></td>';
							if(v.checkInState == 1) {
								v.checkInState = "已报到";
								htmlTr += '<td class="colour-blue" style="text-align: center !important;">' + v.checkInState + '</td>';
							}else if(v.checkInState == '0'){
								v.checkInState = "未报到";
								htmlTr += '<td class="colour-yellow" style="text-align: center !important;">' + v.checkInState + '</td>';
							}else{
								v.checkInState = "";
								htmlTr += '<td class="colour-yellow" style="text-align: center !important;">' + v.checkInState + '</td>';
							}
							htmlTr += '<td class="tr">' + v.amountReceivable + '</td>';
							if(v.reconciliationState == 1) {
								v.reconciliationState = "已对账";
								htmlTr += '<td class="colour-blue">' + v.reconciliationState + '</td>';
							} else {
								v.reconciliationState = "未对账";
								htmlTr += '<td class="colour-yellow">' + v.reconciliationState + '</td>';
							}
							if(v.orderNum != margeStates) {
								$('.pay-ticket-open-div .list-table tbody tr').eq(last).find('td').eq(9).attr('rowspan', numLengtht);
								$('.pay-ticket-open-div .list-table tbody tr').eq(last).find('td').eq(10).attr('rowspan', numLengtht);
								htmlTr += '<td></td>';
								if(v.invoiceState == 1) {
									v.invoiceState = "未开票";
									htmlTr += '<td class="colour-yellow">' + v.invoiceState + '</td>';
								} else {
									v.invoiceState = "已开票";
									htmlTr += '<td class="colour-blue">' + v.invoiceState + '</td>';
								}
								//判断是否只有一条不相等
								if($('.pay-ticket-open-div .list-table tbody tr').eq(last).find('td').eq(9).attr('rowspan') != 1) {
									$('.pay-ticket-open-div .list-table tbody tr').eq(last).find('td').eq(9).addClass('colour-yellow');
									$('.pay-ticket-open-div .list-table tbody tr').eq(last).find('td').eq(9).text("合并开票");
								} else {
									$('.pay-ticket-open-div .list-table tbody tr').eq(last).find('td').eq(9).removeClass('colour-yellow');
								}
								margeStates = v.orderNum;
								last = i;
								numLengtht = 1;
							} else {
								numLengtht++;
							}
							htmlTr += '</tr>';
							$('.pay-ticket-open-div .list-table tbody tr').eq(last).find('td').eq(9).attr('rowspan', numLengtht);
							$('.pay-ticket-open-div .list-table tbody tr').eq(last).find('td').eq(10).attr('rowspan', numLengtht);
							htmlTbody.append(htmlTr);
						});
						$('.pay-ticket-open-div .page-info').show();
					} else {
						$('.pay-ticket-open-div .page-info').hide();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="11" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						htmlTbody.append(htmlTr);
					}
					//htmlTbody.html(htmlTr);
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
	 * 缴费开票导出
	 */
	ticketExport: function(reconciliationState, invoiceState) {
		//获取班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		var selectParam = $(".pay-ticket-open-div .keyword").val();
		var checkInState = 2;
		$.ajaxDownloadFile({
			url: $yt_option.base_path + "class/trainee/exportTraineeList",
			data: {
				projectCode: projectCode,
				selectParam: selectParam,
				checkInState: checkInState,
				reconciliationState: reconciliationState,
				invoiceState: invoiceState,
				yitianSSODynamicKey:$yt_common.getyitianSSODynamicKey()
			}
		});
	},
	/**
	 * 缴费开票查询一个学员的详细信息
	 */
	ticketStudentDetail: function(traineeId) {
		//获取班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		var ticketStudentDetail;
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/trainee/getTraineeDetails"/*"finance/projectInvoice/getTraineeDetails"*/,
			data: {
				traineeId: traineeId,
				projectId: projectCode
			},
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					data.data.workTime=="0000-00-00"?data.data.workTime='':data.data.workTime=data.data.workTime;
					ticketStudentDetail = data.data;
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading();
					/**
					 * 点击弹窗确定按钮
					 */
				}
			}
		});
		return ticketStudentDetail;
	},
	/**
	 * 查询一个学员的详细信息
	 */
	oldStudentDataMsg:{},
	queryStudentDetails: function(traineeId) {
		var me = this ;
		var studentDetailedMsg;
		//获取班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/trainee/getTraineeDetails",
			data: {
				traineeId: traineeId,
				projectId: projectCode
			},
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					data.data.workTime=="0000-00-00"?data.data.workTime='':data.data.workTime=data.data.workTime;
					studentDetailedMsg = data.data;
					me.oldStudentDataMsg = data.data;
					if(me.oldStudentDataMsg.idType==1){
						me.oldStudentDataMsg.idTypeName='身份证'
					}else if(me.oldStudentDataMsg.idType==2){
						me.oldStudentDataMsg.idTypeName='护照'
					}else if(me.oldStudentDataMsg.idType==3){
						me.oldStudentDataMsg.idTypeName='军官证'
					}else if(me.oldStudentDataMsg.idType==4	){
						me.oldStudentDataMsg.idTypeName='其他'
					}
					
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading();
				}
			}
		});
		return studentDetailedMsg;
	},
	/**
	 * 缴费开票修改学员
	 */
	tickRepairStudent: function(traineeId) {
		var me = this ; 
		var afterJson = {
			//获取班级编号
		projectCode : $yt_common.GetQueryString("projectCode"),
		groupName:$('.ticket-class-student-form .group-id-elementary-name').val(),
		groupOrgName:$('.ticket-class-student-form select.org-ids option:selected').text(),
		nationName:$('.ticket-class-student-form select.student-nation option:selected').text(),
		idTypeName : $('.ticket-class-student-form select.card-types option:selected').text(),	
		invoiceTypeVel:$('.ticket-class-student-form select.student-invoice-types option:selected').text(),
		//获取名字
		realName : $('.ticket-class-student-form .class-student-name').val(),
		//获取组号
		groupNum : $('.ticket-class-student-form .class-student-group-num').val(),
		//获取性别
		gender : $('.ticket-class-student-form .class-student-name').parent().parent().nextAll().find('input[type="radio"]:checked').val(),
		//获取民族
		nationId : $('.ticket-class-student-form .student-nation').val(),
		//获取手机号
		phone : $('.ticket-class-student-form .class-student-phone').val(),
		//获取证件类型
		idType : $('.ticket-class-student-form .card-types').val(),
		//获取证件号
		idNumber : $('.ticket-class-student-form .id-number').val(),
		//获取集团
		groupId : $('.ticket-class-student-form .group-id-elementary').val(),
		//获取单位
		orgId : $('.ticket-class-student-form .org-ids').val(),
		//获取部门
		deptName : $('.ticket-class-student-form .student-msg .dept-name').val(),
		// 获取职位
		positionName : $('.ticket-class-student-form .student-msg .position-name').val(),
		//获取发票类型
		invoiceType : $('.ticket-class-student-form .student-invoice-types').val(),
		//获取发票名称
		orgName : $('.ticket-class-student-form .student-invoice-name').val(),
		//获取识别号
		taxNumber : $('.ticket-class-student-form .student-invoice-duty').val(),
		//获取地址
		address : $('.ticket-class-student-form .student-invoice-address').val(),
		//获取电话
		telephoneProject : $('.ticket-class-student-form .student-invoice-phone').val(),
		//获取开户行
		registeredBank : $('.ticket-class-student-form .student-invoice-open-bank').val(),
		//获取账户
		account : $('.ticket-class-student-form .student-invoice-acc').val(),
		//出生年月
		dateBirth : $('.ticket-class-student-form .date-birth').val(),
		//获取单位类型
		orgTypeVal : $('.ticket-class-student-form .orgTypes').text(),
		orgType : $('.ticket-class-student-form .org-type').val(),
		//获取通信地址
		mailingAddress : $('.ticket-class-student-form .mailing-address').val(),
		//获取邮政编码
		postalCode : $('.ticket-class-student-form .postal-code').val(),
		//获取传真
		fax : $('.ticket-class-student-form .class-student-fax').val(),
		//获取入党时间
		partyDate : $('.ticket-class-student-form .party-date').val(),
		//获取全职教育
		educationTime : $('.ticket-class-student-form .education-time').val(),
		//获取全职教育-毕业院校及专业
		educationTimeClass : $('.ticket-class-student-form .education-time-class').val(),
		//获取在职教育
		serviceTime : $('.ticket-class-student-form .service-time').val(),
		//获取在职教育-毕业院校及专业
		serviceTimeClass : $('.ticket-class-student-form .service-time-class').val(),
		//获取电话号
		telephone : $('.ticket-class-student-form .telephone-project').val(),
		//获取电子邮件
		email : $('.ticket-class-student-form .class-student-email').val(),
		//获取工作时间
		workTime : $('.ticket-class-student-form .work-time').val()
		}
		if(afterJson.gender == 1){
			afterJson.genderVal='男'
		}else if(afterJson.gender == 2){
			afterJson.genderVal='女'
		}
		var operationContent = '';
			if(traineeId!=''){
				var operationContent = '修改操作：【'+payTicket.oldStudentDataMsg.realName+'】，'+studentList.getLogInfo(studentList.StudentJsonName,payTicket.oldStudentDataMsg,afterJson);
				studentList.getLogInfo(studentList.StudentJsonName,payTicket.oldStudentDataMsg,afterJson)=='；'?operationContent='':operationContent=operationContent;
			}
		if(afterJson.phone != "") {
			//显示整体框架loading的方法
			$yt_baseElement.showLoading();
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "class/trainee/addOrUpdateTrainee",
				data: {
					traineeId: traineeId,
					projectCode: afterJson.projectCode,
					realName: afterJson.realName,
					groupNum: afterJson.groupNum,
					gender: afterJson.gender,
					nationId: afterJson.nationId,
					phone: afterJson.phone,
					idNumber: afterJson.idNumber,
					groupId: afterJson.groupId,
					orgId: afterJson.orgId,
					deptName: afterJson.deptName,
					positionName: afterJson.positionName,
					invoiceType: afterJson.invoiceType,
					orgName: afterJson.orgName,
					taxNumber: afterJson.taxNumber,
					address: afterJson.address,
					telephoneProject: afterJson.telephoneProject,
					registeredBank: afterJson.registeredBank,
					account: afterJson.account,
					idType: afterJson.idType,
					dateBirth: afterJson.dateBirth,
					orgType: afterJson.orgType,
					mailingAddress: afterJson.mailingAddress,
					postalCode: afterJson.postalCode,
					fax: afterJson.fax,
					partyDate: afterJson.partyDate,
					educationTime: afterJson.educationTime,
					educationTimeClass: afterJson.educationTimeClass,
					serviceTime: afterJson.serviceTime,
					serviceTimeClass: afterJson.serviceTimeClass,
					/*
					 学员报道无法修改联系人模块
					 * */
					//联系人-姓名
					linkman:payTicket.oldStudentDataMsg.linkman,
					linkmanPhone:payTicket.oldStudentDataMsg.linkmanPhone,
					linkmanTelephone:payTicket.oldStudentDataMsg.linkmanTelephone,
					linkmanFax:payTicket.oldStudentDataMsg.linkmanFax,
					linkmanEmail:payTicket.oldStudentDataMsg.linkmanEmail,
					linkmanAddressEmail:payTicket.oldStudentDataMsg.linkmanAddressEmail,
					//
					telephone: afterJson.telephone,
					email: afterJson.email,
					workTime: afterJson.workTime,
					operationContent:operationContent,
					traineeRemarks:payTicket.oldStudentDataMsg.traineeRemarks
				},
				async: true,
				success: function(data) {
					if(data.flag == 0) {
						//隐藏整体框架loading的方法
						$yt_baseElement.hideLoading(function() {
							$yt_alert_Model.prompt("修改成功");
							var reconciliationState = 0;
									var invoiceState = 0;
									var reconciliationList = $('.pay-ticket-open-div .tab-content label input[name="reconciliationState"]:checked');
									var invoiceList = $('.pay-ticket-open-div .tab-content label input[name="invoiceState"]:checked');
									console.log(reconciliationList + '-----' + invoiceList)
									if(reconciliationList.length != 2) {
										reconciliationState = reconciliationList.val();
									} else {
										reconciliationState = 2;
									}
									if(invoiceList.length != 2) {
										invoiceState = invoiceList.val();
									} else {
										invoiceState = 2;
									}
							//刷新页面
							payTicket.PayTicketList(reconciliationState, invoiceState);
							$(".ticket-class-student-form").hide();
						});
					} else {
						//隐藏整体框架loading的方法
						$yt_baseElement.hideLoading(function() {
							$yt_alert_Model.prompt("修改失败");
							var reconciliationState = 0;
							var invoiceState = 0;
							var reconciliationList = $('.pay-ticket-open-div .tab-content label input[name="reconciliationState"]:checked');
							var invoiceList = $('.pay-ticket-open-div .tab-content label input[name="invoiceState"]:checked');
							console.log(reconciliationList + '-----' + invoiceList)
							if(reconciliationList.length != 2) {
								reconciliationState = reconciliationList.val();
							} else {
								reconciliationState = 2;
							}
							if(invoiceList.length != 2) {
								invoiceState = invoiceList.val();
							} else {
								invoiceState = 2;
							}
							//刷新页面
							payTicket.PayTicketList(reconciliationState, invoiceState);
							$(".ticket-class-student-form").hide();
						});
					}
				}
			});
		} else {
			/** 
			 * 调用验证方法 
			 */
			$yt_valid.validForm($(".valid-tab2"));
		}
	},
	/**
	 * 导入开票信息
	 */
}
/**
 * 请假管理
 */
var leaveTube = {
	init: function() {
		//点击请假时间
		$('.leave-tube-div thead th ').eq(5).find('span').click(function() {
			var orderType = $(this).attr('orderType');
			console.log(orderType);
			if(orderType == 'ASC') {
				$(this).attr('orderType', 'DESC');
				$(this).find('img').attr('src', '../../resources/images/classStudent/pai-down.png');
			} else {
				$(this).attr('orderType', 'ASC');
				$(this).find('img').attr('src', '../../resources/images/classStudent/pai-up.png');
			}
			var sort = 'start_time';

			leaveTube.leaveList(sort, orderType);
		});
		//点击提交时间
		$('.leave-tube-div thead th ').eq(6).find('span').click(function() {
			var orderType = $(this).attr('orderType');
			console.log(orderType);
			if(orderType == 'ASC') {
				$(this).attr('orderType', 'DESC');
				$(this).find('img').attr('src', '../../resources/images/classStudent/pai-down.png');
			} else {
				$(this).attr('orderType', 'ASC');
				$(this).find('img').attr('src', '../../resources/images/classStudent/pai-up.png');
			}
			var sort = 'create_time';
			leaveTube.leaveList(sort, orderType);
		});
	},
	/**
	 * 查询请假单详情信息
	 */
	leaveList: function(sort, orderType) {
		var projectCode = $yt_common.GetQueryString("projectCode"); 
		var selectParam="";
		$('.leave-tube-div .page-info').pageInfo({
			async: true,
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			before: function() {
				$yt_baseElement.showLoading();
			},
			url: $yt_option.base_path + "class/traineeLeave/getClassTraineeLeave", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				sort: sort,
				orderType: orderType,
				selectParam:selectParam,
				projectCode:projectCode
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.leave-tube-div .leave-list-tbody');
					var htmlTr = '';
					htmlTbody.empty();
					if(data.data.rows.length > 0) {
						$('.leave-tube-div .page-info').show();
						$.each(data.data.rows, function(i, v) {
							if(v.gender == 1) {
								v.gender = "男";
							} else if(v.gender == 2) {
								v.gender = "女";
							}
							htmlTr = '<tr>' +
								'<td>'+v.groupNum+'</td>' +
								'<td style="text-align:left;">' + v.realName + '</td>' +
								'<td>' + v.gender + '</td>' +
								'<td>' + v.phone + '</td>' +
								'<td>' + v.orgName + '</td>' +
								'<td>' + v.leaveTime + '</td>' +
								'<td>' + v.createTimeString + '</td>' +
								'<td style="text-align:left; class="leave-resion">' + v.leaveDetails + '</td>' +
								'</tr>';
							htmlTbody.append(htmlTr);
						});

					} else {
						$('.leave-tube-div .page-info').hide();
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="8" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						htmlTbody.append(htmlTr);
					}
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	}
}
/**
 * 出勤管理
 */
var attendance = {
	
	init: function() {
		var searchType = "";
		var searchIndex = "";
		var searchCreatTime = "";
		//点击日期切换页签
		$('.attendance-div ').on('click', '.switch-btn', function() {
			$('.attendance-div .key-word-val').val("");
			var switchNum = 0;
			console.log($(this).index());
			var createTime = $(this).find('.switch-date').val();
			searchCreatTime = createTime;
			$(this).addClass('switch-btn-change').siblings().removeClass('switch-btn-change');
			searchIndex = $(this).index();
			if($(this).index() != 0) {
				//获取每日的学员签到
				var types = $(this).data('data').types;
				searchType = types;
				switchNum = 1;
				attendance.getStudentDaySign(createTime,types);
			} else {
				//获取全员的签到
				attendance.getStudentSign();
			}
			$('.attendance-div .teacher-list-div').hide().eq(switchNum).show();
		});
		var bollen = true;
		//检索按钮
		$(".attendance-div .search-btn").click(function(){
			if(searchIndex == ""){//全部学员签到信息
				attendance.getStudentSign();
			}else if(searchIndex != 0){//每日学员签到
				attendance.getStudentDaySign(searchCreatTime,searchType);
			}else{
				attendance.getStudentSign();
			}
		});
		//横向滚动条
		//左边按钮
		//		$(".page-click-btn-left").off('click').on('click',function(){
		//		
		//			var width=parseInt($(this).prev().css('margin-left')+10);
		//			
		//			
		//			console.log(width);
		////			if(bollen){
		////				$(this).parent().animate({width:"100px"});
		////				bollen=false;
		////			}else{
		////				$(this).parent().animate({width:"900px"});
		////				bollen=true;
		////			}
		//			
		//		});
		//右边按钮
		//		$(".page-click-btn-right").off('click').on('click',function(){
		//			var lastBtn=$(".page-switch button").last().position().left;
		//			console.log("lastBtn",lastBtn);
		//			var width=parseInt($(this).prevAll('.page-switch').css('margin-left')-10);
		//			if(width> (lastBtn - 120)) {
		//				$(this).hide();
		//				//leftVal = (120 * $(".tab-title-box button").length - $(".tab-title-box").parent().width() + 32) * -1;
		//			}
		//			$(this).prevAll('.page-switch').css("padding-left", "32px").stop(true, true).animate({
		//				"margin-left": width
		//			}, 100);
		//			$(".page-click-btn-left").show();
		//		});
	},
	/**
	 * 获取页签切换按钮
	 */
	getSwitchBtn: function() {
		//班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/traineeAttendance/getAttendanceDate",
			data: {
				projectCode: projectCode
			},
			async: true,
			success: function(data) {
				var pageBtn = $('.attendance-div .page-switch');
				var switchBtn = '';
				pageBtn.empty();
				if(data.flag == 0) {
					var attendanceDate;
					switchBtn = '<button class="yt-option-btn switch-btn switch-btn-change">全员状态</button>';
					pageBtn.append(switchBtn);
					$.each(data.data, function(i, v) {
						attendanceDate = v.attendanceDate;
						attendanceDate = attendanceDate.replace(/[ ]/g,"");
						switchBtn = '<button class="yt-option-btn switch-btn">' +
							'<input type="hidden" class="switch-date" value="' + v.createTime + '"/>' + attendanceDate + '</button>';
						switchBtn = $(switchBtn).data('data',v);
						pageBtn.append(switchBtn);
					});
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading();
				} else {
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading();
					console.log("页签查询失败");
				}
			}
		});
	},
	/**
	 * 获取学员签到全员信息
	 */
	getStudentSign: function() {
		
		//班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		var selectParam = $('.attendance-div .key-word-val').val();
		var gender = '';
		var nationId = '';
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/traineeAttendance/getTraineeAttendanceAll",
			data: {
				projectCode: projectCode,
				selectParam: selectParam,
				gender: gender,
				nationId: nationId
			},
			async: true,
			success: function(data) {
				var htmlBody = $('.attendance-div .student-all-sign tbody');
				var htmlTr = '';
				var classNum;
				htmlBody.empty();
				if(data.flag == 0) {
					if(data.data.length != 0) {
						$.each(data.data, function(i, n) {
							if(n.gender == 1) {
								n.gender = '男';
							} else if(n.gender == 2) {
								n.gender = '女';
							}
							if(n.everyAttendance == n.totalAttendance) {
								classNum = 'colour-blue';
							} else {
								classNum = 'colour-yellow';
							}
							if(n.deptPosition == "/") {
								n.deptPosition = "";
							}
							console.log(n.groupNum);
							htmlTr = '<tr>' +
								'<td>'+n.groupNum+'</td>' +
								'<td style="text-align:left;">' + n.realName + '</td>' +
								'<td>' + n.gender + '</td>' +
								'<td style="text-align:left;">' + n.nationName + '</td>' +
								'<td>' + n.phone + '</td>' +
								'<td style="text-align:left;">' + n.orgName + '</td>' +
								'<td style="text-align:left;">' + n.deptPosition + '</td>' +
								'<td class="' + classNum + '">' + n.everyAttendance + '/' + n.totalAttendance + '</td>' +
								'</tr>';
							htmlBody.append(htmlTr);
						});
					} else {
						htmlTr = '<tr class="class-tr">' +
							'<td colspan="8" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						htmlBody.append(htmlTr);
					}
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading();
				} else {
					htmlTr = '<tr class="class-tr">' +
						'<td colspan="7" align="center" style="border:0px;">' +
						'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
						'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
						'</div>' +
						'</td>' +
						'</tr>';
					htmlBody.append(htmlTr);
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}
			}
		});
	},
	/**
	 * 获取每日学员签到信息
	 */
	getStudentDaySign: function(createTime,types) {
		//班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		var selectParam = $('.attendance-div .key-word-val').val();
		var gender = '';
		var nationId = '';
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/traineeAttendance/getTraineeAttendance",
			data: {
				projectCode: projectCode,
				createTime: createTime,
				types:types,
				selectParam: selectParam,
				gender: gender,
				nationId: nationId
			},
			async: true,
			success: function(data) {
				var htmlBody = $('.attendance-div .student-sign tbody');
				var htmlSign = '';
				var className;
				htmlBody.empty();
				if(data.flag == 0) {
					console.log("每日成功");
					if(data.data.length != 0) {
						$.each(data.data, function(i, k) {
							if(k.isAttendance == 1) {
								k.isAttendance = '签到';
								classNum = 'colour-blue';
							} else {
								k.isAttendance = '未签到';
								classNum = 'colour-yellow';
							}
							if(k.gender == 1) {
								k.gender = '男';
							} else {
								k.gender = '女';
							}
							if(k.deptPosition == "/") {
								k.deptPosition = "";
							} else if(k.deptPosition.split("/").length != 1) {
								k.deptPosition = k.deptPosition;
							} else if(k.deptPosition.split("/").length == 1) {
								k.deptPosition = k.deptPosition.split("/")[0];
							}
							htmlSign = '<tr>' +
								'<td>'+k.groupNum+'</td>' +
								'<td>' + k.realName + '</td>' +
								'<td>' + k.gender + '</td>' +
								'<td>' + k.nationName + '</td>' +
								'<td>' + k.phone + '</td>' +
								'<td style="text-align:left;">' + k.orgName + '</td>' +
								'<td style="text-align:left;">' + k.deptPosition + '</td>' +
								'<td class="' + classNum + '">' + k.isAttendance + '</td>' +
								'</tr>';
							htmlBody.append(htmlSign);
						});
					} else {
						htmlSign = '<tr class="class-tr">' +
							'<td colspan="7" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						htmlBody.append(htmlSign);
					}
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading();
				} else {
					htmlSign = '<tr class="class-tr">' +
						'<td colspan="7" align="center" style="border:0px;">' +
						'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
						'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
						'</div>' +
						'</td>' +
						'</tr>';
					htmlBody.append(htmlSign);
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}
			}
		});
	}
}
/**
 * 结业证
 */
var certificateEnd = {
	init: function() {
		//班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		//点击申请编号
		$('.certificate-end-div .apply-number-btn').click(function() {
			//获取申请编号的数据
			certificateEnd.applyNumberData();
			/** 
			 * 显示编辑弹出框和显示顶部隐藏蒙层 
			 */
			$(".certificate-end-div .graduation-form").show();
			/** 
			 * 调用算取div显示位置方法 
			 */
			$yt_alert_Model.getDivPosition($(".certificate-end-div .graduation-form"));
			/* 
			 * 调用支持拖拽的方法 
			 */
			$yt_model_drag.modelDragEvent($(".certificate-end-div .graduation-form .yt-edit-alert-title"));
			/** 
			 * 点击取消方法 
			 */
			$('.certificate-end-div .graduation-form .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
				//隐藏页面中自定义的表单内容  
				$(".certificate-end-div .graduation-form").hide();
			});
		});
		//点击导出
		$('.certificate-end-div .certificate-upload-btn').click(function() {
			$.ajaxDownloadFile({
				url: $yt_option.base_path + "class/traineeCertificateNo/exportTraineeCertificateNoByClass",
				data: {
					projectCode: projectCode,
					yitianSSODynamicKey:$yt_common.getyitianSSODynamicKey()
				}
			});
		});
		//点击提交按钮
		$('.certificate-end-div .yt-eidt-model-bottom .yt-model-sure-btn').click(function() {
			certificateEnd.applyEndNum();
		});
	},
	//申请结业证编号
	applyEndNum: function() {
		//班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/traineeCertificateNo/updateTraineeCertificateNoByClass",
			data: {
				projectCode: projectCode
			},
			async: true,
			success: function(data) {
				if(data.flag == 0) {
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("提交成功");
						$(".certificate-end-div .graduation-form").hide();
					});
				} else {
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("提交失败");
					});
				}
			}
		});
	},
	//申请结业证编号获取数据
	applyNumberData: function() {
		//班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/traineeCertificateNo/getTraineeCertificateNoByClass",
			data: {
				projectCode: projectCode
			},
			async: true,
			success: function(data) {
				var htmlBody = $(".certificate-end-div .apply-num-table");
				var htmlTr = '';
				if(data.flag == 0) {
					console.log('编号成功');
					var applyData = data.data;
					//根据分配状态判断编号是否显示
					if(applyData[0].distributionStates != 0) {
						$(".hiden-part").show();
						$('.certificate-end-div .yt-eidt-model-bottom .yt-model-sure-btn').hide();
						$('.certificate-end-div .yt-eidt-model-bottom .yt-model-canel-btn').val("关闭");
						$('.certificate-end-div .yt-eidt-model-bottom .yt-model-canel-btn').css('margin', '0');
					} else {
						$(".hiden-part").hide();
					}
					if(applyData[0].projectType == 1) {
						applyData[0].projectType = "计划";
					} else if(applyData[0].projectType == 2) {
						applyData[0].projectType = "委托";
					} else if(applyData[0].projectType == 3) {
						applyData[0].projectType = "选学";
					} else if(applyData[0].projectType == 4) {
						applyData[0].projectType = "中组部调训";
					} else if(applyData[0].projectType == 5) {
						applyData[0].projectType = "国资委调训";
					}

					if(applyData[0].distributionStates == 1) {
						applyData[0].distributionStates = "已分配";
					}
					if(applyData[0].distributionStates == 2) {
						applyData[0].distributionStates = "待分配";
					}
					$(".certificate-end-div .graduation-form").setDatas(applyData[0]);
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading();
				} else {
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading();
				}
			}
		});
	},
	//获取结业证列表信息
	getCertificateList: function() {
		//班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		$('.certificate-end-div .table-page').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			before: function() {
				//显示整体框架loading的方法
				$yt_baseElement.showLoading();
			},
			url: $yt_option.base_path + "class/traineeCertificateNo/getClassTrainee", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			async: true, //ajax 访问类型 默认 true 异步,false同步  
			data: {
				projectCode: projectCode
			}, //ajax查询访问参数  
			objName: 'data', //指获取数据的对象名称
			success: function(data) {
				var htmlBody = $('.certificate-end-div .list-tbody');
				var htmlGrad = '';
				if(data.flag == 0) {
					htmlBody.empty();
					if(data.data.rows.length != 0) {
						$('.certificate-end-div .table-page').show();
						$.each(data.data.rows, function(i, q) {
							if(q.gender == 1) {
								q.gender = '男';
							} else if(q.gender == 2) {
								q.gender = "女";
							}
							htmlGrad = '<tr>' +
								'<td>' + q.groupNum + '</td>' +
								'<td style="text-align: left;"><input type="hidden" value="' + q.traineeId + '" class="trainee-id"/><a href="#" class="real-name-inf" style=" color:#3c4687;word-break: break-all;">' + q.realName + '</a></td>' +
								'<td>' + q.gender + '</td>' +
								'<td>' + q.phone + '</td>' +
								'<td>' + q.groupName + '</td>' +
								'<td>' + q.orgName + '</td>' +
								'<td>' + q.certificateNo + '</td>' +
								'</tr>';
							htmlGrad = $(htmlGrad).data("studentList", q);
							htmlBody.append(htmlGrad);
						});
					} else {
						$('.certificate-end-div .table-page').hide();
						htmlGrad = '<tr class="class-tr">' +
							'<td colspan="7" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						htmlBody.append(htmlGrad);
					}
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading();
				} else {
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}
			},
			isSelPageNum: true //是否显示选择条数列表默认false,  
		});
	}
}
/**
 * 学员反馈
 */
var feedBack = {
	init: function() {
		//点击模糊查询
		$('.student-feedback-div .search-btn').off('click').on('click', function() {
			feedBack.getFeedBackList();
		});
		//点击导出按钮
		$('.student-feedback-div .certificate-upload-btn').click(function() {
			//班级编号
			var projectCode = $yt_common.GetQueryString("projectCode");
			//学员名字
			var traineeName = $(".student-feedback-div .yt-input.key-word").val();
			//是否评价
			var classCacsi = '1,0';
			var fileName="学员反馈";
			$.ajaxDownloadFile({
				url: $yt_option.base_path + "class/questionnaire/exportQuestionnaire",
				data: {
					projectCode: projectCode,
					traineeName: traineeName,
					classCacsi: classCacsi,
					fileName:fileName,
					isEffective: 1,
					selectionType:1,
					yitianSSODynamicKey:$yt_common.getyitianSSODynamicKey()
				}
			});
		});
		//点击每一行的查看详情
		$('.student-feedback-div').off('click').on('click', '.back-look-details', function() {
			var traineeId = $(this).parents("tr").find('input').val();
			feedBack.getEveryStudentDeatils(traineeId);
			/** 
			 * 显示编辑弹出框和显示顶部隐藏蒙层 
			 */
			$(".see-details-form").show();
			/* 
			 * 调用支持拖拽的方法 
			 */
			$yt_model_drag.modelDragEvent($(".see-details-form .yt-edit-alert-title"));
			/** 
			 * 点击取消方法 
			 */
			$('.see-details-form .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
				//隐藏页面中自定义的表单内容  
				$(".see-details-form").hide();
			});
		});
		//点击问卷编辑
		$('.question-edit-btn').off('click').click(function(){
			
			//问卷预览模块隐藏
			$('.question-deatils').hide();
			//全选 设置时间按钮显示
			$('.question-edit-btncon').show();
			//提交按钮显示
			$('.question-sure-btn').show();
			//获取问卷内容
			feedBack.getquestionData();
			//修改弹窗标题
			$(".question-alert .yt-edit-alert-title-msg").text('问卷编辑');
			//全选按钮重置
			$('.question-allcheck').text('全选');
			//显示弹窗
			$(".question-alert").show();
			$(".question-alert .cont-edit-test").scrollTop(0);
			//拖动弹窗
			$yt_model_drag.modelDragEvent($(".question-alert>.yt-edit-alert-title"));
			$('.question-canel-btn').off().click(function(){
				$(".question-alert").hide();
			})
			//新增问卷弹窗
			$('.question-edit-canel-btn').off().click(function(){
				$(".question-edit-alert").hide();
			})
			
		})
		//提交问卷
		$('.question-sure-btn').off().click(function(){
			feedBack.submitQuestion();
		})
		//点击问卷预览
		$('.question-pre-btn').off('click').click(function(){
			$(".question-alert .yt-edit-alert-title-msg").text('问卷预览');
			feedBack.getQuestionCount();
		})
		//问卷按钮绑定
		feedBack.event();
	},
	event:function(){
		/*全选按钮*/
		$('.question-edit-btncon').off().on('click','.question-allcheck',function(){
			if($(this).text()=='全选'){
				$('.question-alert-content .question-checkbox input').setCheckBoxState('check');
				$('.question-alert-content .question-check-all').setCheckBoxState('check');
				$(this).text('全不选');
			}else{
				$('.question-alert-content .question-checkbox input').setCheckBoxState('uncheck');
				$('.question-alert-content .question-check-all').setCheckBoxState('uncheck');
				$(this).text('全选');
			}
		});
		/*批量设置时间*/
		$('.question-alert').on('click','.question-allcheck-editTime',function(){
				if($('.question-alert-content .question-checkbox input:checked').length==0){
					$yt_alert_Model.prompt('请选择需要设置的问题项')
				}else{
					//显示弹窗
					$('.question-time-alert').show();
					//修改弹窗头部title
					$('.question-time-alert .yt-edit-alert-title-msg').text('批量设置时间');
					//修改设置标题
					$('.question-time-alert-title').text('请设置所选题目的开放时间：');
					//初始化时间控件
					feedBack.startDateAndEndDate();
					//开始时间为所选项的最早开始时间，回填的结束时间为最晚结束时间
					var start = '';
					var end = '';
					$.each($('.question-checkbox input:checked'),function(i,n){
						if(i==0){
							start=$(n).parents('.topic-div').find('.question-startDate').val();
							end=$(n).parents('.topic-div').find('.question-endDate').val();
						}else{
							new Date(start)>new Date($(n).parents('.topic-div').find('.question-startDate').val())?start=$(n).parents('.topic-div').find('.question-startDate').val():'';
							new Date(end)<new Date($(n).parents('.topic-div').find('.question-endDate').val())?end=$(n).parents('.topic-div').find('.question-endDate').val():'';
						}
					})
					//初始化开始时间
					$('.question-time-startTime').val(start);
					//初始化结束时间
					$('.question-time-endTime').val(end);
				}
				/*批量设置时间确定按钮*/
				$('.question-time-sure-btn').off().click(function(){
					$.each($('.question-checkbox input:checked'),function(i,n){
						$(n).parents('.topic-div').find('.question-startDate').val($('.question-time-startTime').val());
						$(n).parents('.topic-div').find('.question-endDate').val($('.question-time-endTime').val());
					})
					$('.question-time-alert').hide();
				})
		});
		$('.question-time-canel-btn').click(function(){
			$('.question-time-alert').hide();
		})
		/*大项全选
		 */
		$('.question-alert-content').on('change','.question-check-all',function(){
			if(this.checked){
				$(this).parents('.tab-content').find('.question-checkbox input').setCheckBoxState('check');
			}else{
				$(this).parents('.tab-content').find('.question-checkbox input').setCheckBoxState('uncheck');
			}
		})
		/*问题单多选*/
		$('.question-alert-content').on('change','.question-checkbox input',function(){
			if($(this).parents('.tab-content').find('.question-checkbox input').length==$(this).parents('.tab-content').find('.question-checkbox input:checked').length){
				$(this).parents('.tab-content').find('.question-check-all').setCheckBoxState('check');
			}else{
				$(this).parents('.tab-content').find('.question-check-all').setCheckBoxState('uncheck');
			}
		})
		/*大项标题修改按钮*/
		$('.question-alert-content').on('click','.title-update-name',function(){
			if($(this).siblings('.question-title-name-val').hasClass('question-title-name-val-action')){
				$(this).siblings('.question-title-name-val').removeClass('question-title-name-val-action');
				$(this).siblings('.question-title-name-val').attr('disabled','disabled');
				$(this).find('span').text('修改');
			}else{
				$(this).siblings('.question-title-name-val').addClass('question-title-name-val-action');
				$(this).siblings('.question-title-name-val').removeAttr('disabled');
				$(this).find('span').text('确定');
			}

		})
		/*停用启用*/
		$('.question-alert-content').on('click','.theState-false',function(){
			$(this).hide();
			if($(this).parents('.question-types6').data('data')){
				$(this).parents('.question-types6').data('data').states = 1;
			}else{
				$(this).parents('.topic-div').data('data').states = 1;
			}
			$(this).siblings('.theState-true').show();
		})
		$('.question-alert-content').on('click','.theState-true',function(){
			$(this).hide();
			if($(this).parents('.question-types6').data('data')){
				$(this).parents('.question-types6').data('data').states = 0;
			}else{
				$(this).parents('.topic-div').data('data').states = 0;
			}
			$(this).siblings('.theState-false').show();
		})
		//修改问卷编辑确定按钮
		function questionEditSubmit(that){
			var thisData = $(that).data('data');
			//问题内容值
			var itemDetailsSpecific = JSON.parse($(that).data('data').itemDetailsSpecific)||'';
			$('.question-edit-sure-btn').off().click(function(){
					$('#pop-modle-alert').show();
				//单选多选
				if($('.question-edit-select').val()==2||$('.question-edit-select').val()==3){
					itemDetailsSpecific = [];
					$(that).find('.radio-approval').empty();
					$.each($('.choose-tr-content'), function(i,n) {
						var json = {};
						$(n).data('data').specificValue = $(n).find('.choose-content-input').val();
						for(var i in $(n).data('data')){
							json[i] = $(n).data('data')[i]
						}
						itemDetailsSpecific.push(json);
						//遍历渲染选项，并给其附data
						$(that).find('.radio-approval').append($('<p class="que-choose">'+$(n).data('data').specificValue+'</p>').data('data',$(n).data('data')));
					});
					$(that).data('data').itemDetailsSpecific=JSON.stringify(itemDetailsSpecific);
				}else{
					//评分  开放
					$(that).find('.radio-approval').empty();
					$(that).data('data').itemDetailsSpecific='';
				}
				//替换标题
				$(that).find('.que-title').text($(that).data('data').title = $('.question-edit-title').val())
				$(that).data('data').types=$('.question-edit-select').val();
				thisData.types==5?$(that).data('data').types=5:'';
				if($(that).data('data').types==1){
					$(that).find('.que-type').text('【评分】')
				}else if($(that).data('data').types==2){
					$(that).find('.que-type').text('【单选】')
				}else if($(that).data('data').types==3){
					$(that).find('.que-type').text('【多选】')
				}else if($(that).data('data').types==4){
					$(that).find('.que-type').text('【开放】')
				}
				$('.question-edit-alert').hide();
			})
		}
		//新增问卷编辑确定按钮
		function addQuestionEditSubmit(parentHtml){
			$('.question-edit-su	re-btn').off().click(function(){
			$('#pop-modle-alert').show();
			var queType='';
			if($('.question-edit-select').val()==1){
				queType = "【评分】";
			}else if($('.question-edit-select').val()==2){
				queType = "【单选】";
			}else if($('.question-edit-select').val()==3){
				queType = "【多选】";
			}else if($('.question-edit-select').val()==4){
				queType = "【开放】";
			}
			var aData = {};
			for(var i in $(parentHtml).find('.topic-div').eq(0).data('data')){
				aData[i]=$(parentHtml).find('.topic-div').eq(0).data('data')[i]
			}
			aData.title = $('.question-edit-title').val();
			aData.types = $('.question-edit-select').val();
			aData.states = 1;
			aData.pkId = '';
			aData.itemDetailsId = '';
			aData.itemDetailsSpecific = '[]';
			aData.itemDetailsStartTime = $('.itemDetailsStartTimeDefault').val();
			aData.itemDetailsEndTime=$('.itemDetailsEndTimeDefault').val();
			var a = '<div class="topic-div">'+
						'<div class="radio-title-approval" style="height: 28px;line-height: 28px;">'+
							'<label class="check-label yt-checkbox question-checkbox" style="float: left;margin-top: 4px;">'+
								'<input type="checkbox" name="test" value="1">'+
							'</label>'+
							'<div style="display: inline-block;float: left;">'+
								'<span class="que-type" style="color: #6495BC;">'+
									queType+
								'</span>'+
								'<span class="que-title">'+$('.question-edit-title').val()+'</span>'+
							'</div>'+
							'<span class="theState-true" style="float: right;color: #04a304;">'+//0停用 1启用
								'<img src="../../resources/images/icons/question-true.png"/>启用'+
							'</span>'+
							'<span class="theState-false" style="float: right;color: #cc0002;display:none;">'+
								'<img src="../../resources/images/icons/question-false.png"/>停用'+
							'</span>'+
							'<span class="content-update-name" style="float: right;margin: 0 10px;">'+
								'<img style="margin-right: 2px;" src="../../resources/images/classStudent/wenjuan-modify.png">修改'+
							'</span>'+
							'<div style="float: right;">'+
										'<input type="text" class="calendar-input calendar-input-bg question-startDate" value="'+aData.itemDetailsStartTime+'" readonly="readonly">'+
										'至'+
										'<input type="text" class="calendar-input calendar-input-bg question-endDate" value="'+aData.itemDetailsEndTime+'" readonly="readonly">'+
									'</div>'+
								'</div>'+
								'<div class="radio-approval" style="margin-left:85px;clear:both"></div>'
							'</div>';
						$(parentHtml).find('.q-info').append(a);
						if(aData.types==2||aData.types==3){
							//单选，多选
							aData.itemDetailsSpecific = [];
							$.each($('.choose-tr-content'), function(i,n) {
									var json = {};
									$(n).data('data').specificValue = $(n).find('.choose-content-input').val();
									for(var i in $(n).data('data')){
										json[i] = $(n).data('data')[i]
									}
									aData.itemDetailsSpecific.push(json);
									//遍历渲染选项，并给其附data
									$(parentHtml).find('.radio-approval:last').append($('<p class="que-choose">'+$(n).data('data').specificValue+'</p>').data('data',$(n).data('data')));
								});
							aData.itemDetailsSpecific = JSON.stringify(aData.itemDetailsSpecific);
						}
						$(parentHtml).find('.topic-div:last').data('data',aData);
						//获取当天日期
						/*
						 * 初始化时间
						 * */
						var thisDate = new Date().toLocaleDateString().replace('年','/').replace('月','/').replace('日','').replace(/-/g,'/').split('/');
						thisDate[1].length==1?thisDate[1] = '0'+thisDate[1]:'';
						thisDate = thisDate.join('/')+' '+new Date().getHours()+':'+new Date().getMinutes();
						$(parentHtml).find('.question-startDate:last').calendar({
								speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
								complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
								readonly: true, // 目标对象是否设为只读，默认：true     
								lowerLimit: thisDate, // 日期下限，默认：NaN(不限制)
								upperLimit:feedBack.itemDetailsEndTimeDefault,									
								dateFmt: "yyyy-MM-dd HH:mm",
								nowData: false, //默认选中当前时间,默认true  
								callback: function() { // 点击选择日期后的回调函数  
									//alert("您选择的日期是：" + $("#txtDate").val()); 
									$(parentHtml).find('.question-startDate:last').val($(parentHtml).find('.question-startDate:last').val().replace(/-/g,'/'))
									if(new Date($(parentHtml).find('.question-startDate:last').val())>new Date($(parentHtml).find('.question-endDate:last').val())){
										$(parentHtml).find('.question-endDate:last').val($(parentHtml).find('.question-startDate:last').val())
									}
									endate();
								}
							});
						function endate(){
							$(parentHtml).find('.question-endDate:last').calendar({
								speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
								complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
								readonly: true, // 目标对象是否设为只读，默认：true     
								lowerLimit: $(parentHtml).find('.question-startDate:last'), // 日期下限，默认：NaN(不限制)     
								upperLimit:feedBack.itemDetailsEndTimeDefault,									
								dateFmt: "yyyy-MM-dd HH:mm",
								nowData: false, //默认选中当前时间,默认true  
								callback: function() { // 点击选择日期后的回调函数  
									//alert("您选择的日期是：" + $("#txtDate").val());  
									$(parentHtml).find('.question-endDate:last').val($(parentHtml).find('.question-endDate:last').val().replace(/-/g,'/'))
								}
							});
						}
						endate();
						/*
						 * 
						 * */
					$('.question-edit-alert').hide();
				})
		}
		/*新增问卷按钮*/
		$('.question-alert-content').on('click','.question-addmore',function(){
			questionEditAlert();
			//根据问卷类型显示隐藏内容
			changeQuestionType();
			addQuestionEditSubmit($(this).parents('.tab-content-question'));
			
		})
		/*修改问卷按钮*/
		$('.question-alert-content').on('click','.content-update-name',function(){
			questionEditAlert();
			var data = $(this).parents('.topic-div').data('data');
			//问卷类型赋值
			$('.question-edit-select').setSelectVal(data.types);
			//根据问卷类型显示隐藏内容
			changeQuestionType();
			//如果是优秀师资推荐，只能修改标题
			if(data.types==5){
				$('.question-edit-table tr').eq(0).hide();
				$('.choose-tr').hide();
			}
			//标题
			$('.question-edit-title').val(data.title);
			if(data.types==2||data.types==3){
				$('.choose-tr-content').remove();
				//单选或多选遍历出选项
				var itemDetailsSpecific = JSON.parse(data.itemDetailsSpecific);
				$.each(itemDetailsSpecific,function(x,y){
					var tr = '<tr class="choose-tr choose-tr-content">'+
						'<td>选项：</td>'+
						'<td>'+
							'<input style="border: 1px solid #DFE6F3 !important;width: 300px;" class="yt-input choose-content-input" value="'+y.specificValue+'" placeholder="请输入" validform="{isNull:true,msg:\'请填写选项\'}" />'+
							' <span class="valid-font"></span>'+
						'</td>'+
					'</tr>';
					$('.question-edit-table tbody').append($(tr).data('data',y));
				})
			}
			//提交问卷修改
			questionEditSubmit($(this).parents('.topic-div'));
		})
		/*修改问卷类型*/
		$('.question-edit-select').off().change(function(){
			changeQuestionType()
		})
		/*新增选项*/
		$('.form-bottom-btn').off().click(function(){
			var data ;
			var tr = '';
			$('.choose-tr-content').eq(0).data('data')?data=$('.choose-tr-content').eq(0).data('data'):data='';
			tr = '<tr class="choose-tr choose-tr-content">'+
						'<td>选项：</td>'+
						'<td>'+
							'<input style="border: 1px solid #DFE6F3 !important;width: 300px;" class="yt-input choose-content-input" value="" placeholder="请输入" validform="{isNull:true,msg:\'请填写选项\'}" />'+
							' <span class="valid-font"></span>'+
						'</td>'+
					'</tr>';
					if(data == ''){
						data = {
							specificValue:'',
							states:1
						}
					}else{
						data.pkId='';
					}
					tr = $(tr).data('data',data);
					$('.question-edit-table tbody').append(tr);
		})
		function changeQuestionType(){
			value = $('.question-edit-select').val();
			value==2||value==3?$('.choose-tr').show():$('.choose-tr').hide();
		}
		//重置编辑问卷弹窗
		function questionEditAlert(){
			$('.question-edit-alert').show();
			$('.question-edit-alert').find('.choose-tr').hide();
			$('.question-edit-select').niceSelect();
			$('.question-edit-table tr').eq(0).show();
			$('.question-edit-table').find('input').val('');
			$('.choose-tr-content').remove();
			$('.question-edit-table tbody').append($('<tr class="choose-tr choose-tr-content">'+
					'<td>选项：</td>'+
					'<td>'+
						'<input style="border: 1px solid #DFE6F3 !important;width: 300px;" class="yt-input choose-content-input" placeholder="请输入" validform="{isNull:true,msg:\'请填写选项\'}" />'+
						' <span class="valid-font"></span>'+
					'</td>'+
				'</tr>').data('data',{specificValue:'',states:1}));
		}
		/*
		 延时按钮
		 * */
		$('.lang-btn').click(function(){
			//显示弹窗
			$('.question-time-alert').show();
			//修改弹窗头部title
			$('.question-time-alert .yt-edit-alert-title-msg').text('设置延时时间');
			//修改设置标题
			$('.question-time-alert-title').text('请设置'+$('.question-switch-btn.switch-btn-change').text()+'的延时时间：');
			//初始化时间控件
			feedBack.startDateAndEndDate('islong',$('.question-switch-btn.switch-btn-change').data('data').itemDetailsTime[$('.question-switch-btn.switch-btn-change').data('data').itemDetailsTime.length-1].itemDetailsEndTime);	
			var start = $('.question-time li').eq(0).find('.isStartDate').text();
			var end = $('.question-time li').eq(0).find('.isEndDate').text();
			var longtime = false;
			$.each($('.question-switch-btn.switch-btn-change').data('data').itemDetailsTime,function(i,n){
				//开始时间为最后一个重启时间的开始时间
				if(n.timeType==3){
					start=n.itemDetailsStartTime;
					//如果没有延时时间结束时间为重置时间的结束时间
					longtime?"":end=n.itemDetailsEndTime;
				}
				//结束时间为最后一个延时时间的结束时间
				if(n.timeType==2){
					end=n.itemDetailsEndTime;
					longtime=true;
				}
			})
			//初始化开始时间
			$('.question-time-startTime').attr('disabled','disabled');
			$('.question-time-startTime').addClass('question-date-false');
			$('.question-time-startTime').val(start);
			//初始化结束时间
			$('.question-time-endTime').val(end);
			var identifying = $('.question-switch-btn.switch-btn-change').attr('identifying');
			/*设置延时时间确定按钮*/
			$('.question-time-sure-btn').off().click(function(){
				if(end==$('.question-time-endTime').val()){
					$yt_alert_Model.prompt('延时时间不可与问卷结束时间相同');
				}else{
					//延时重启  标识  类型
					feedBack.setQuestionTime(identifying,2)
					$('.question-time-alert').hide();
				}
			})
		})
		/*重启按钮*/
		$('.restart-btn').click(function(){
			//显示弹窗
			$('.question-time-alert').show();
			//修改弹窗头部title
			$('.question-time-alert .yt-edit-alert-title-msg').text('设置重启时间');
			//修改设置标题
			$('.question-time-alert-title').text('请设置'+$('.question-switch-btn.switch-btn-change').text()+'的重启时间：');
			$('.question-time-startTime').removeAttr('disabled').removeClass('question-date-false');
			//初始化时间控件
			feedBack.startDateAndEndDate();
			//初始化开始时间
			$('.question-time-startTime').val('');
			//初始化结束时间
			$('.question-time-endTime').val('');
			var identifying = $('.question-switch-btn.switch-btn-change').attr('identifying');
			/*设置延时时间确定按钮*/
			$('.question-time-sure-btn').off().click(function(){
				//延时重启  标识  类型
				feedBack.setQuestionTime(identifying,3)
				$('.question-time-alert').hide();
			})
		})
	},
	/*班级问卷默认结束时间*/
	itemDetailsEndTimeDefault:'',
	/*
	 *获取问卷详情  //问卷编辑所有事件
	 * */
	getquestionData:function(identifying){
		var itemVal = "";
		//var inputVal = "";
		//调用显示页面loading方法  
		$yt_baseElement.showLoading();
		$.ajax({
			url: $yt_option.base_path + "class/questionnaire/getQuestionnaireByProjectCode", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				projectCode: $yt_common.GetQueryString('projectCode'),
				identifying:identifying
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			async:true,
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.question-alert-content').empty();
					var htmlTr = '';
					var formList = [];
					//头部说明是否可编辑标识
					var headerStata = false;
					//问卷是否全部发布
					var isAllpublish = true;
					if(data.data.length > 0) {
						//循环大项的名字
						$.each(data.data, function(i, v) {
							/*
							 获取默认日期*/
							if(i==0){
								feedBack.itemDetailsEndTimeDefault = v.itemDetailsEndTimeDefault.replace(/-/g,'/');
								$('.itemDetailsStartTimeDefault').val(v.itemDetailsStartTimeDefault.replace(/-/g,'/'));
								$('.itemDetailsEndTimeDefault').val(v.itemDetailsEndTimeDefault.replace(/-/g,'/'));
							}
							//循环每个模块加载模板
							htmlTr = '<div class="tab-content tab-content-question '+v.itemCode+'">'+
							'<div class="question-title">'+
								'<div class="question-title-name">'+
									'<span class="question-title-name-red">'+
									'</span>';
							//如果不是卷首和卷尾增加修改功能
							/*
							 大项名称
							 * 
							 * */
							if(v.itemCode!="rollHead"&&v.itemCode!="other"){
								htmlTr+='<label class="check-label yt-checkbox" style="margin:10px 0px 0px 10px;float: left;">'+
										'<input type="checkbox" name="test" class="question-check-all" value="1">'+
										'</label>'+
										'<input class="yt-input title-name-input question-title-name-val" disabled="disabled" value="'+v.itemName+'">'+
										'<span class="title-update-name" style="display: inline-block;margin: 11px 0px 0px 0px;position: relative;float: right;">'+
											'<img style="margin-right: 2px;position: absolute;top: 2px;left: -20px;" src="../../resources/images/icons/amend.png">'+
											'<span class="modify-big-title">修改</span>'+
										'</span>';
							}else{
								htmlTr+='<label class="check-label yt-checkbox" style="margin:10px 0px 0px 10px;float: left;">'+
										'<input type="checkbox" name="test" class="question-check-all" value="1">'+
										'</label>'+
										'<input class="yt-input title-name-input question-title-name-val" style="" disabled="disabled" value="'+v.itemName+'">';
							}
							htmlTr += '</div>'+
							'</div>'+
							/*问题容器
							 */
							'<div class="q-info" style="width: 770px;margin: 10px auto;">'+
							'</div>'+
							/*新增问卷按钮
							 */
							'<div class="question-addmore">'+
									'<span style="position: relative;">'+
										'<img style="position: absolute;top: 2px;left: -17px;" src="../../resources/images/classStudent/wejuan-add.png">'+
									'</span>'+
									'<span style="font-size: 14px;">'+
										'新增问卷项'+
									'</span>'+
								'</div>'+
							'</div>';
							//先添加整个模块
							htmlTbody.append($(htmlTr).data('data',v));
							if(v.itemCode=="teachingEffect"||v.itemCode=="teachingActivites"){
									$('.q-info').eq(i).append('<div style="text-align:center">根据班级的课程日程自动生成问卷项</div>');
							}
							//循环大项的问题
							var htmlJsonTbody = $('.q-info').eq(i);
							var htmlJsonTr = '';
							if(v.itemsDetailsJson.length>0){
								if(v.itemCode=="teachingEffect"&&JSON.parse(v.itemsDetailsJson).length>0||v.itemCode=="teachingActivites"&&JSON.parse(v.itemsDetailsJson).length>0){
									htmlJsonTbody.empty();
								}
								$.each(JSON.parse(v.itemsDetailsJson), function(jsonIndex,jsonData) {
									//固定值：卷首卷尾的说明，优秀师资推荐
									if(jsonData.types==5){
										htmlJsonTr = '<div class="topic-div">'+
										'<div class="title-nam-approval" style="clear: both;margin-top:10px">'+
										(v.itemCode=="other"?'<label class="check-label yt-checkbox question-checkbox" style="float: left;margin-top: 4px;"><input type="checkbox" name="test" value="1"></label>':"")+
										'<span class="que-title" style="position: relative;line-height:28px;">'+
											jsonData.title+
										'</span>';
										if(jsonData.itemDetailsSpecific.length>0){
											$.each(JSON.parse(jsonData.itemDetailsSpecific), function(a,b) {
												function addtextarea(){
													return '<div class="radio-approval" style="margin:0px;display:inline-block;">'+
															'<textarea class="yt-textarea approval-textarea que-choose" style="width:700px;margin-top:10px">'+b.specificValue+'</textarea>';
												}
												//如果是卷尾的优秀师资推荐增加修改按钮启用按钮
												if(v.itemCode=="other"){
													htmlJsonTr+= 
													'<span class="theState-true" style="float: right;color: #04a304;"><img src="../../resources/images/icons/question-true.png"/>启用</span>'+
													'<span class="theState-false" style="float: right;color: #cc0002;display: none;"><img src="../../resources/images/icons/question-false.png"/>停用</span>'+
													'<span class="content-update-name" style="float: right;margin: 0 10px;">'+
														'<img style="margin-right: 2px;" src="../../resources/images/classStudent/wenjuan-modify.png">修改</span>'+
													'<div style="float: right;">'+
														'<input type="text" class="calendar-input calendar-input-bg question-startDate" value="'+jsonData.itemDetailsStartTime+'" readonly="readonly">'+
														'至'+
														'<input type="text" class="calendar-input calendar-input-bg question-endDate" value="'+jsonData.itemDetailsEndTime+'" readonly="readonly">'+
													'</div>'+
													addtextarea();
												}else{
													htmlJsonTr+=addtextarea()
												}
												htmlJsonTr+='</div>';
											});
										}
										htmlJsonTr+='</div></div>';
									}
									//评分或开放题
									else if(jsonData.types==1||jsonData.types==4){
										htmlJsonTr = '<div class="topic-div">'+
											'<div class="radio-title-approval" style="height: 28px;line-height: 28px;">'+
												'<label class="check-label yt-checkbox question-checkbox" style="float: left;margin-top: 4px;">'+
													'<input type="checkbox" name="test" value="1">'+
												'</label>'+
												'<div style="display: inline-block;float: left;">'+
													'<span class="que-type" style="color: #6495BC;">'+
														(jsonData.types==1?"【评分】":"【开放】")+
													'</span>'+
													'<span class="que-title">'+jsonData.title+'</span>'+
												'</div>';
										//授课效果、教学活动
										if(v.itemCode=="teachingEffect"||v.itemCode=="teachingActivites"){
											
										}else{
											htmlJsonTr += '<span class="theState-true" style="float: right;color: #04a304;'+(jsonData.states==1?"":"display:none;")+'">'+//0停用 1启用
													'<img src="../../resources/images/icons/question-true.png"/>启用'+
												'</span>'+
												'<span class="theState-false" style="float: right;color: #cc0002;'+(jsonData.states==0?"":"display:none;")+'">'+
													'<img src="../../resources/images/icons/question-false.png"/>停用'+
												'</span>'+
												'<span class="content-update-name" style="float: right;margin: 0 10px;">'+
													'<img style="margin-right: 2px;" src="../../resources/images/classStudent/wenjuan-modify.png">修改'+
												'</span>';
										}
										htmlJsonTr += '<div style="float: right;">'+
													'<input type="text" class="calendar-input calendar-input-bg question-startDate" value="'+jsonData.itemDetailsStartTime+'" readonly="readonly">'+
													'至'+
													'<input type="text" class="calendar-input calendar-input-bg question-endDate" value="'+jsonData.itemDetailsEndTime+'" readonly="readonly">'+
												'</div>'+
											'</div>'+
											'<div class="radio-approval" style="margin-left:85px;clear:both"></div>'
										'</div>';
									}
									//2单选 3多选//单选或多选
									else if(jsonData.types==2||jsonData.types==3){
										htmlJsonTr = '<div class="topic-div">'+
											'<div class="radio-title-approval" style="height: 28px;line-height: 28px;">'+
												'<label class="check-label yt-checkbox question-checkbox" style="float: left;margin-top: 4px;">'+
													'<input type="checkbox" name="test" value="1">'+
												'</label>'+
												'<div style="display: inline-block;float: left;">'+
													'<span class="que-type" style="color: #6495BC;">'+
														(jsonData.types==2?"【单选】":"【多选】")+
													'</span>'+
													'<span class="que-title">'+jsonData.title+'</span>'+
												'</div>'+
												'<span class="theState-true" style="float: right;color: #04a304;'+(jsonData.states==1?"":"display:none;")+'">'+//0停用 1启用
													'<img src="../../resources/images/icons/question-true.png"/>启用'+
												'</span>'+
												'<span class="theState-false" style="float: right;color: #cc0002;'+(jsonData.states==0?"":"display:none;")+'">'+
													'<img src="../../resources/images/icons/question-false.png"/>停用'+
												'</span>'+
												'<span class="content-update-name" style="float: right;margin: 0 10px;">'+
													'<img style="margin-right: 2px;" src="../../resources/images/classStudent/wenjuan-modify.png">修改'+
												'</span>'+
												'<div style="float: right;">'+
													'<input type="text" class="calendar-input calendar-input-bg question-startDate" value="'+jsonData.itemDetailsStartTime+'" readonly="readonly">'+
													'至'+
													'<input type="text" class="calendar-input calendar-input-bg question-endDate" value="'+jsonData.itemDetailsEndTime+'" readonly="readonly">'+
												'</div>'+
											'</div>'+
											'<div class="radio-approval" style="margin-left:85px;clear:both">';
											$.each($.parseJSON(jsonData.itemDetailsSpecific), function(a,b) {
												htmlJsonTr+='<p class="que-choose" style="width:fit-content;">'+b.specificValue+'</p>'
											});
											htmlJsonTr+='</div></div>'
									}
									//特殊处理
									else if(jsonData.types==6){
										htmlJsonTr =$('<div class="topic-div">'+
													'<div style="margin-top: 0px;margin-left: 45px;" class="radio-title-approval">'+
													'<div style="display: inline-block;" class="special-key">'+
													'<span class="que-title" style="position: relative;">'+	jsonData.title+'</span>'+
													'<div class="radio-approval">'+
													'</div>'+
													'</div>'+
													'</div>'+
													'</div>');
										$.each($.parseJSON(jsonData.itemDetailsSpecific), function(a,b) {
												$(htmlJsonTr).find('.radio-approval').append($('<div class="question-types6" style="margin:5px 0px">'+
													'<input class="yt-input que-choose" style="width:195px;" value="'+b.specificValue+'">'+
													'<span class="theState-true" style="float: right;color: #04a304;'+(b.states==1?"":"display:none;")+'">'+//0停用 1启用
														'<img src="../../resources/images/icons/question-true.png" style="margin-top:2px"/>启用'+
													'</span>'+
													'<span class="theState-false" style="float: right;color: #cc0002;'+(b.states==0?"":"display:none;")+'">'+
														'<img src="../../resources/images/icons/question-false.png"/>停用'+
													'</span>'+
													'</div>').data('data',b));
											});
									}
									htmlJsonTbody.append($(htmlJsonTr).data('data',jsonData));
									//如果问卷已经开始  兼容ios
									var itemDetailsStartTime;
									jsonData.itemDetailsStartTime?itemDetailsStartTime=jsonData.itemDetailsStartTime.replace(/-/g,'/'):itemDetailsStartTime=jsonData.itemDetailsStartTime;
									/*问卷开始
									 */
									if(new Date() >= new Date(itemDetailsStartTime)){
										headerStata = true;
										var index = jsonIndex;
										//复选框
										$(htmlJsonTbody).find('.topic-div').eq(index).find('.question-checkbox').remove();
										//修改按钮
										$(htmlJsonTbody).find('.topic-div').eq(index).find('.content-update-name').remove();
										//启用按钮
										$(htmlJsonTbody).find('.topic-div').eq(index).find('.theState-true').remove();
										//停用按钮
										$(htmlJsonTbody).find('.topic-div').eq(index).find('.theState-false').remove();
										//标题对齐
										$(htmlJsonTbody).find('.topic-div').eq(index).find('.que-type').css('margin-left','25px');
										//开始时间，结束时间  +对齐
										$(htmlJsonTbody).find('.topic-div').eq(index).find('.question-startDate').parent('div').css('margin-right','106px');
										$(htmlJsonTbody).find('.topic-div').eq(index).find('.question-startDate').addClass('question-date-false').attr('disabled','disabled');
										$(htmlJsonTbody).find('.topic-div').eq(index).find('.question-endDate').addClass('question-date-false').attr('disabled','disabled');
										if(jsonData.types==6||v.itemCode=="other"){
											/*特殊处理*/
											$(htmlJsonTbody).find('.topic-div').eq(index).find('input').addClass('question-date-false').attr('disabled','disabled');
											$(htmlJsonTbody).find('.topic-div').eq(index).find('textarea').addClass('question-date-false').attr('disabled','disabled');
										}
										$(htmlJsonTbody).siblings('.question-addmore').remove();
										$('.tab-content-question').eq(i).find('.title-update-name').remove();
									}else if(!(v.itemCode=='rollHead'&&jsonData.types==5)){
										isAllpublish = false;
									}
								});
							}
									if($('.tab-content-question').eq(i).find('.question-checkbox').length==0){
										$('.tab-content-question').eq(i).find('.check-label').remove();
										$('.tab-content-question').eq(i).find('.question-title-name-val').css('left','10px');
									}
						});
						//教学活动，教学模块，新增问卷项按钮去除  时间控件对齐
						$('.teachingEffect .question-addmore,.teachingActivites .question-addmore').remove();
						$('.teachingActivites .question-endDate').parent('div').css('margin-right','106px');
						$('.teachingEffect .question-endDate').parent('div').css('margin-right','106px');
						//问卷全部发布 操作按钮全部隐藏
						if(isAllpublish){
							$('.question-edit-btncon').hide();
							$('.rollHead .question-addmore').hide();
							$('.question-sure-btn').hide();
						}else{
							$('.question-edit-btncon').show();
							$('.rollHead .question-addmore').show();
							$('.question-sure-btn').show();
						}
						//有发布的问卷，则头部说明不可编辑
						headerStata?$('.tab-content-question').eq(0).find('textarea').addClass('question-date-false').attr('disabled','disabled'):'';
						//获取当天日期
						var thisDate = new Date().toLocaleDateString().replace('年','/').replace('月','/').replace('日','').replace(/-/g,'/').split('/');
						console.log(new Date().toLocaleDateString())
						thisDate[1].length==1?thisDate[1] = '0'+thisDate[1]:'';
						thisDate = thisDate.join('/')+' '+new Date().getHours()+':'+new Date().getMinutes();
						$.each($(".question-startDate"), function(x,y) {
							$(y).val($(y).val().replace(/-/g,'/'));
							$(".question-endDate").eq(x).val($(".question-endDate").eq(x).val().replace(/-/g,'/'))
							$(y).calendar({
								speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
								complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
								readonly: true, // 目标对象是否设为只读，默认：true     
								lowerLimit: thisDate, // 日期下限，默认：NaN(不限制)
								upperLimit:feedBack.itemDetailsEndTimeDefault,									
								dateFmt: "yyyy-MM-dd HH:mm",
								nowData: false, //默认选中当前时间,默认true  
								callback: function() { // 点击选择日期后的回调函数  
									//alert("您选择的日期是：" + $("#txtDate").val()); 
									$(y).val($(y).val().replace(/-/g,'/'));
									if(new Date($(y).val())>new Date($(".question-endDate").eq(x).val())){
										$(".question-endDate").eq(x).val($(y).val())
									}
									endate();
								}
							});
							function endate(){
								$(".question-endDate").eq(x).calendar({
									speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
									complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
									readonly: true, // 目标对象是否设为只读，默认：true     
									lowerLimit: $(y), // 日期下限，默认：NaN(不限制)   
									upperLimit:feedBack.itemDetailsEndTimeDefault,									
									dateFmt: "yyyy-MM-dd HH:mm",
									nowData: false, //默认选中当前时间,默认true  
									callback: function() { // 点击选择日期后的回调函数  
										//alert("您选择的日期是：" + $("#txtDate").val());  
										$(".question-endDate").eq(x).val($(".question-endDate").eq(x).val().replace(/-/g,'/'));
									}
								});
							}
							endate();
						});
						//初始化批量设置时间时间控件
						feedBack.startDateAndEndDate();
						$('.question-edit-select').niceSelect();
						$yt_alert_Model.setFiexBoxHeight($(".question-alert .yt-edit-alert-main"));
						$yt_alert_Model.getDivPosition($(".question-alert"));
						/*
						问卷预览隐藏所有按钮
						 * */
						if(identifying){
							$('.question-deatils').show();
							$('.question-edit-btncon').hide();
							$('.question-sure-btn').hide();
							$('.que-title').css('width','660px');
							$('.content-update-name').remove();
							$('.title-update-name').remove();
							$('.question-startDate').parent('div').remove();
							$('.question-alert-content .yt-checkbox').remove();
							$('.theState-true').remove();
							$('.theState-false').remove();
							$('.question-addmore').remove();
							$.each($('.question-alert-content textarea'), function(i,n) {
								$(n).parent().html('<p>'+$(n).val()+'</p>');
							});
							$('.que-choose').css('border','none');
							$('.que-choose').attr('disabled','disabled');
							$('.teachingEffect .q-info').text()=='根据班级的课程日程自动生成问卷项'?$('.teachingEffect').hide():'';
							$('.teachingActivites .q-info').text()=='根据班级的课程日程自动生成问卷项'?$('.teachingActivites').hide():'';
							$.each($('.tab-content-question'),function(x,y){
								$(y).find('.q-info').text()==''?$(y).hide():'';
							})
						}
					} else {
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="3" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						htmlTbody.append(htmlTr);
					}
					//console.log(formList);
					//隐藏loading
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt("查询失败");
					});
					
				}

			},
			error:function(){
				$yt_alert_Model.prompt('网络异常，查询失败')
				$yt_baseElement.hideLoading();
			}
		});
	},
	//初始化弹窗开始时间与结束时间  islong:是否为延时时间初始化   longDate:延时结束时间限制
	startDateAndEndDate:function(islong,longDate){
		//获取当天日期
		var thisDate = new Date().toLocaleDateString().replace('年','/').replace('月','/').replace('日','').replace(/-/g,'/').split('/');
		thisDate[1].length==1?thisDate[1] = '0'+thisDate[1]:'';
		thisDate[2].length==1?thisDate[2] = '0'+thisDate[2]:'';
		thisDate = thisDate.join('/')+' '+new Date().getHours()+':'+new Date().getMinutes();
		$('.question-time-startTime').calendar({
				speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
				complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
				readonly: true, // 目标对象是否设为只读，默认：true     
				lowerLimit: thisDate, // 日期下限，默认：NaN(不限制)
				upperLimit:feedBack.itemDetailsEndTimeDefault,									
				dateFmt: "yyyy-MM-dd HH:mm",
				nowData: false, //默认选中当前时间,默认true  
				callback: function() { // 点击选择日期后的回调函数  
					//alert("您选择的日期是：" + $("#txtDate").val()); 
					$('.question-time-startTime').val($('.question-time-startTime').val().replace(/-/g,'/'));
					if(new Date($('.question-time-startTime').val())>new Date($('.question-time-endTime').val())){
						$('.question-time-endTime').val($('.question-time-startTime').val())
					}
					endateTime();
				}
			});
			function endateTime(){
				if(islong){
					$(".question-time-endTime").calendar({
						speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
						complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
						readonly: true, // 目标对象是否设为只读，默认：true     
						lowerLimit: longDate, // 日期下限，默认：NaN(不限制)     
						upperLimit:feedBack.itemDetailsEndTimeDefault,									
						dateFmt: "yyyy-MM-dd HH:mm",
						nowData: false, //默认选中当前时间,默认true  
						callback: function() { // 点击选择日期后的回调函数  
							//alert("您选择的日期是：" + $("#txtDate").val());  
						$(".question-time-endTime").val($(".question-time-endTime").val().replace(/-/g,'/'));
						}
					});
				}else{
					$(".question-time-endTime").calendar({
						speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
						complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
						readonly: true, // 目标对象是否设为只读，默认：true     
						lowerLimit: $('.question-time-startTime'), // 日期下限，默认：NaN(不限制)     
						upperLimit:feedBack.itemDetailsEndTimeDefault,									
						dateFmt: "yyyy-MM-dd HH:mm",
						nowData: false, //默认选中当前时间,默认true  
						callback: function() { // 点击选择日期后的回调函数  
							$(".question-time-endTime").val($(".question-time-endTime").val().replace(/-/g,'/'));
							//alert("您选择的日期是：" + $("#txtDate").val());  
						}
					});
				}
			}
			endateTime();
	},
	/*
	 生成的问卷
	 * 
	 * 
	 * */
	getQuestionCount:function(){
		//获取是否有问卷
		$.ajax({
			type:"post",
			url:$yt_option.base_path+"class/questionnaire/isClassQuestionnaireByProjectCode",
			async:true,
			data:{
				projectCode: $yt_common.GetQueryString('projectCode')
			},
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			success:function(data){
				/*flag等于2返回:   未生成问卷
				flag等于0:  调用问卷预览获取一共有多少问卷
				再调用调查问卷模板获取详细信息*/
				if(data.flag==0){
					feedBack.showQuestionCount();
					$yt_model_drag.modelDragEvent($(".question-alert>.yt-edit-alert-title"));
					$('.question-canel-btn').off().click(function(){
						$(".question-alert").hide();
					})
				}else if(data.flag==2){
					$yt_baseElement.hideLoading();
					$yt_alert_Model.prompt('未生成问卷');	
				}
			},
			error:function(){
				$yt_alert_Model.prompt('网络异常');
			}
		});
		
	},
	//加载问卷
	showQuestionCount:function(index){
		$.ajax({
			type:"post",
			url:$yt_option.base_path+"class/questionnaire/getQuestionnaireCountByProjectCode",
			async:true,
			data:{
				projectCode: $yt_common.GetQueryString('projectCode')
			},
			success:function(data){
				if(data.flag==0){
					var htmlTbody = $('.question-swich').empty();
					var htmlTr = '' ;
					if(data.data.length==1){
						$('.question-swich').hide();
					}else{
						$('.question-swich').show();
					}
					$.each(data.data, function(i,n) {
						htmlTr= '<button class="yt-option-btn question-switch-btn switch-btn" identifying="'+n.identifying+'">'+n.questionnaireName+'</button>';
						htmlTbody.append($(htmlTr).data('data',n));
					});
					//先加载问卷一
					if(index){
						$('.question-switch-btn').eq(index).addClass('switch-btn-change');
						questionTime($('.question-switch-btn').eq(index).data('data'));
					}else{
						$('.question-switch-btn').eq(0).addClass('switch-btn-change');
						questionTime($('.question-switch-btn').eq(0).data('data'));
					}
					//页签点击事件
					$('.question-switch-btn').off().click(function(){
						var data = $(this).data('data')
						$(this).addClass('switch-btn-change').siblings().removeClass('switch-btn-change');
						questionTime(data)
					})
					function questionTime(data){
							$('.question-time').empty();
							function unpublished(){
								$('.question-stata').text('未发布').css('color','#ecae00');
							}
							function published(){
								$('.question-stata').text('发布中').css('color','#04a304');
							}
							function finish(){
								$('.question-stata').text('已结束').css('color','rgb(204, 0, 2)');
							}
							$.each(data.itemDetailsTime, function(i,n) {
								//ios兼容 new Date
								n.itemDetailsStartTime = n.itemDetailsStartTime.replace(/-/g,'/')
								n.itemDetailsEndTime = n.itemDetailsEndTime.replace(/-/g,'/')
								if(n.timeType==1){
									n.timeTypeVal = '开放时间：';
									if(new Date()>new Date(n.itemDetailsStartTime)){
										published();
										new Date()>new Date(n.itemDetailsEndTime+':59')?finish():'';
									}else{
										unpublished();
									}
								}else if(n.timeType==2){
									n.timeTypeVal = '延时：'
									new Date()>new Date(n.itemDetailsEndTime+':59')?finish():published();
								}else if(n.timeType==3){
									n.timeTypeVal = '重启：';
									if(new Date()>new Date(n.itemDetailsStartTime)){
										published();
										new Date()>new Date(n.itemDetailsEndTime+':59')?finish():'';
									}else{
										unpublished()
									}
								}
								var ht =  '<li><label>'+n.timeTypeVal+'</label><span class="isStartDate">'+n.itemDetailsStartTime+'</span><span>至</span><span class="isEndDate">'+n.itemDetailsEndTime+'</span></li>'
								$('.question-time').append(ht);
							});
							if($('.question-stata').text()=='未发布'){
								$('.restart-btn').hide();
								$('.lang-btn').hide();
							}else if($('.question-stata').text()=='发布中'){
								$('.restart-btn').hide();
								$('.lang-btn').show();
							}else if($('.question-stata').text()=='已结束'){
								$('.restart-btn').show();
								$('.lang-btn').hide();
							}
							feedBack.getquestionData(data.identifying);
						}
				}else if(data.flag==2){
					$yt_alert_Model.prompt(data.message);	
					feedBack.showQuestionCount();
				}
					$(".question-alert").show();
					$(".question-alert .cont-edit-test").scrollTop(0);
			},
			error:function(){
				$yt_alert_Model.prompt('网络异常');
			}
		});
	},
	/*
	 延时重启时间设置
	 * */
	setQuestionTime:function(identifying,timeType){
		$.ajax({
			type:"post",
			url:$yt_option.base_path+"class/questionnaire/updateQuestionnaireTimeByProjectCode",
			async:false,
			data:{
				projectCode: $yt_common.GetQueryString('projectCode'),
				identifying:identifying,
				timeType:timeType,
				itemDetailsStartTime:($('.question-time-startTime').val()).replace(/\//g,'-'),
				itemDetailsEndTime:($('.question-time-endTime').val()).replace(/\//g,'-')
			},
			success:function(data){
				$yt_alert_Model.prompt(data.message);
				feedBack.showQuestionCount($('.question-switch-btn.switch-btn-change').index());
			}
		});
	},
	/*
	 提交问卷编辑
	 * 
	 * */
	submitQuestion:function(){
		$yt_baseElement.showLoading();
		var templateData = [];
		$.each($('.tab-content-question'),function(i,n){
			var data = $(n).data('data');
			var json = {
				pkId:data.pkId,
				itemId:data.itemId,
				itemCode:data.itemCode,
				itemName:$(n).find('.question-title-name-val').val(),
				states:data.states,
				itemOrder:data.itemOrder,
				remarks:data.remarks,
				itemsDetailsJson:[]
			}
			//授课效果  教学活动如果没有值，则为空
			if(data.itemCode=="teachingActivites"||data.itemCode=="teachingEffect"){
				$(n).find('.topic-div').length==0?json.itemsDetailsJson='':'';
			}
			$.each($(n).find('.topic-div'),function(j,k){
				var detailData = $(k).data('data');
				var detailJson = {
					pkId:detailData.pkId,
					classItemId:detailData.classItemId,
					itemId:detailData.itemId,
					itemDetailsId:detailData.itemDetailsId,
					types:detailData.types,
					title:$(k).find('.que-title').text(),
					states:detailData.states,
					itemDetailsSpecific:[],
					itemDetailsStartTime:$(k).find('.question-startDate').val()?$(k).find('.question-startDate').val().replace(/\//g,'-'):$(k).find('.question-startDate').val(),
					itemDetailsEndTime:$(k).find('.question-endDate').val()?$(k).find('.question-endDate').val().replace(/\//g,'-'):$(k).find('.question-endDate').val(),
					identifying:detailData.identifying,
				}
				//小项问题
				var specificData;
				detailData.itemDetailsSpecific.length!=0?specificData = JSON.parse(detailData.itemDetailsSpecific):specificData = detailData.itemDetailsSpecific;
				//评分或开放
				if(detailData.types==1||detailData.types==4){
					detailJson.itemDetailsSpecific = '';
				}else if(detailData.types==2||detailData.types==3){
					//单选或多选
					$.each($(k).find('.que-choose'), function(x,y) {
						detailJson.itemDetailsSpecific.push({
							pkId:specificData[x].pkId,
							classItemDetailsId:specificData[x].classItemDetailsId,
							itemDetailsId:specificData[x].itemDetailsId,
							itemDetailsSpecificId:specificData[x].itemDetailsSpecificId,
							specificValue:$(y).text(),
							states:specificData[x].states,
							identification:specificData[x].identification
						})					
					});
				}else if(detailData.types==5){
					//固定值
					detailJson.itemDetailsSpecific.push({
						pkId:specificData[0].pkId,
						classItemDetailsId:specificData[0].classItemDetailsId,
						itemDetailsId:specificData[0].itemDetailsId,
						itemDetailsSpecificId:specificData[0].itemDetailsSpecificId,
						specificValue:$(k).find('textarea').val(),
						states:specificData[0].states,
						identification:specificData[0].identification
					})	
				}else if(detailData.types==6){
					//特殊值
					$.each($(k).find('.question-types6'), function(x,y) {
						detailJson.itemDetailsSpecific.push({
							pkId:$(y).data('data').pkId,
							classItemDetailsId:$(y).data('data').classItemDetailsId,
							itemDetailsId:$(y).data('data').itemDetailsId,
							itemDetailsSpecificId:$(y).data('data').itemDetailsSpecificId,
							specificValue:$(y).find('.que-choose').val(),
							states:$(y).data('data').states,
							identification:$(y).data('data').identification
						})	
					});
					detailJson.itemDetailsStartTime=$(k).prev().find('.question-startDate').val().replace(/\//g,'-');
					detailJson.itemDetailsEndTime=$(k).prev().find('.question-endDate').val().replace(/\//g,'-');
				}
				json.itemsDetailsJson.push(detailJson);
			})
			templateData.push(json);
		})
		templateData = JSON.stringify(templateData);
		$.ajax({
			type:"post",
			url:$yt_option.base_path+"class/questionnaire/updateQuestionnairedByProjectCode",
			async:true,
			data:{
				templateData:templateData,
				projectCode:$yt_common.GetQueryString('projectCode')
			},
			success:function(data){
				$yt_alert_Model.prompt(data.message);
				$(".question-alert").hide();
				$yt_baseElement.hideLoading();
			},
			error:function(){
				$yt_alert_Model.prompt('网络异常');
				$yt_baseElement.hideLoading();
			}
		});
	},
	/**
	 * 获取每个学员的详细信息
	 */
	getEveryStudentDeatils: function(traineeId) {
		//班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/questionnaire/getTraineeQuestionnaire",
			data: {
				projectCode: projectCode,
				traineeId: traineeId
			},
			async: true,
			success: function(data) {
				var htmlBody = $('.see-details-form .question-student');
				var indexNum = 1;
				//var starNum=0;
				htmlBody.empty();
				if(data.flag == 0) {
					//循环大项
					$.each(data.data, function(i, m) {
						var specialVal;
						var detailsHtml = '';
						detailsHtml += '<div><div class="problem-title-div" style="font-weight:bolder;font-size:16px">' + m.itemName + '</div>';
						if(m.itemsDetailsJson.length != 0) {
							//循环问题
							$.each(m.itemsDetailsJson, function(a, s) {
								if(s.itemDetailsSpecific.length==0&&s.types != 1){
									return true;
								}
								if(s.types == 1) { //问题类型为评分的
									detailsHtml += '<div style="margin-left: 10px;" class="student-problem-div"><span>' + indexNum++ + '、</span>' + s.title + '</div>'; //问题的标题
									detailsHtml += '<div style="margin-left: 30px;" class="star-num" data-scor="' + s.titleVakue + '"></div>';
								}else if(s.types == 2 || s.types == 3) { //问题类型为单选或多选的	
									detailsHtml += '<div style="margin-left: 10px;" class="student-problem-div"><span>' + indexNum++ + '、</span>' + s.title + '</div>'; //问题的标题
									//声明问题的选项
									var queOption="";
//									//判断问题答案的长度
//									if(s.titleVakue.length==1){
//										if(s.itemDetailsSpecific.length!=0){
//											$.each(s.itemDetailsSpecific, function(b,c) {
//												if(c.pkId==s.titleVakue){
//													queOption=c.specificValue;
//												}
//											});
//										}
//									}else{//为多选答案
//										//s.titleVakue=s.titleVakue.split(',');
//										if(s.itemDetailsSpecific.length!=0){
//											$.each(s.itemDetailsSpecific, function(b,c) {
//												if(s.titleVakue.indexOf(c.pkId)!=-1){
//													if(queOption==""){
//														queOption=c.specificValue;
//													}else{
//														queOption+=",<br/>"+c.specificValue;
//													}
//												}
//											});
//										}
//									}
									if(s.types==2){
										//单选
										queOption = s.itemDetailsSpecific[0].specificValue
									}else{
										//多选
										if(s.itemDetailsSpecific.length!=0){
											$.each(s.itemDetailsSpecific, function(b,c) {
													if(queOption==""){
														queOption=c.specificValue;
													}else{
														queOption+="<br/>"+c.specificValue;
													}
											});
										}
									}
									detailsHtml += '<div style="margin-left: 30px;" class="problem-val-div"><p style="word-wrap:break-word;">' + queOption + '</p></div>';
									console.log("s.titleVakue",s.titleVakue.length);
								} else if(s.types == 4) { //问题类型为开放的
									detailsHtml += '<div style="margin-left: 10px;" class="student-problem-div"><span>' + indexNum++ + '、</span>' + s.title + '</div>'; //问题的标题
									detailsHtml += '<p style="margin-left: 30px;">' + s.titleVakue + '</p>';
								} else if(s.types == 5){
//									if(m.itemCode=="other"){
										if(m.itemCode=="rollHead"){
											detailsHtml += '<div style="margin-left: 10px;" class="student-problem-div">' + s.title + '</div>'; //问题的标题
										}else{
											detailsHtml += '<div style="margin-left: 10px;" class="student-problem-div"><span>' + indexNum++ + '、</span>' + s.title + '</div>'; //问题的标题
										}
										if(s.itemDetailsSpecific.length!=0){
											$.each(s.itemDetailsSpecific, function(z,l) {
												detailsHtml += '<p style="margin-left: 30px;">' + l.specificValue + '</p>';
											});
										}
										specialVal=m.itemsDetailsJson;
										$.each(specialVal, function(q,v) {
											console.log('v',v);
											if(v.types==6){
												if(v.teacherRecommend.length!=0){
													detailsHtml+="<table style='margin-left:30px'><tbody>";
													$.each(v.teacherRecommend, function(g,h) {
														detailsHtml += '<tr><td style="width:200px;">' + h.identificationName + '</td><td>' + h.identificationValue + '</td></tr>';
													});
													detailsHtml+="</tbody></table>";
												}
											}
										});
//									}
								}
//								else if(s.types == 6) { //问题类型为特殊处理的
//									detailsHtml += '<div style="margin-left: 10px;" class="student-problem-div"><span></span></div>'; //问题的标题
//									if(s.itemDetailsSpecific.length != 0) {
//										detailsHtml+="<table style='margin-left:30px'><tbody>";
//										//循环问题选项
//										$.each(s.itemDetailsSpecific, function(k, j) {
//											detailsHtml += '<tr><td style="width:200px;">' + j.identificationName + '</td><td>' + j.identificationValue + '</td></tr>';
//										});
//										detailsHtml+="</tbody></table>";
//									}
//								} 
							});
						}
						detailsHtml += '</div>';
						htmlBody.append(detailsHtml);
					});
					//循环添加星星
					$(".star-num").each(function() {
						$(this).raty({
							readOnly: true,
							score: function() {
								return $(this).attr('data-scor');
							},
							starOff: '../../resources/images/starImg/star-off.png',
//							starOn: '../../resources/images/starImg/star.svg '
							starOn: '../../resources/images/starImg/star-on.png'
						});
					});
					/** 
					 * 调用算取div显示位置方法 
					 */
					$yt_alert_Model.setFiexBoxHeight($(".see-details-form .yt-edit-alert-main"));
					$yt_alert_Model.getDivPosition($(".see-details-form"));
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading();
				}
			}
		});

		//			for (var i=0;i<=5;i++) {
		//				detailsHtml='<div>'+
		//				'<div class="problem-title-div">问题大标题'+i+'</div>'+
		//				'<div id="score-demo'+i+'"></div>'+
		//				'<div class="student-problem-div">问题小标题'+i+'</div>'+
		//				'</div>';
		//				htmlBody.append(detailsHtml);
		//				$("#score-demo"+i+"").raty({ 
		//					readOnly: true,
		//					score:num,
		//					starOff:'../../resources/images/starImg/star-off.png',
		//					starOn:'../../resources/images/starImg/star-on.png '
		//				});
		//		}
	},
	/**
	 * 获取反馈列表的表头
	 */
	getBackListHead: function() {
		//班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/questionnaire/getQuestionnaireColumn",
			data: {
				projectCode: projectCode
			},
			async: true,
			success: function(data) {
				if(data.flag == 0) {
					console.log('data.data',data.data);
					var bacHead = '';
					$(".backHeads").remove();
					$.each(data.data, function(i, n) {
						bacHead = '<th rowspan="2" class="backHeads" style="text-align: center;">' + n.columnName + '</th>';
						$(".back-phone").before(bacHead);
					});
					//$(".feed-back-tbody").find('.class-tr td').attr('colspan', data.data.length + 6);
				}
			}
		});
	},
	/**
	 * 获取学员反馈列表数据
	 */
	getFeedBackList: function() {
		//班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		var traineeName = $(".student-feedback-div .yt-input.key-word").val();
		var designImplementationStart = "";
		var designImplementationEnd = "";
		var teachingEffectStart = "";
		var teachingEffectEnd = "";
		var teachingActivitesStart = "";
		var teachingActivitesEnd = "";
		var towslsStart = "";
		var towslsEnd = "";
		var learningeffectStart = "";
		var learningeffectEnd = "";
		var characteristicStart = "";
		var characteristicEnd = "";
		var classCacsi = '0,1';
		$('.student-feedback-div .page-info').pageInfo({
			async: true,
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			before: function() {
				$yt_baseElement.showLoading();
			},
			url: $yt_option.base_path + "class/questionnaire/getClassTraineeList", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				projectCode: projectCode,
				traineeName: traineeName,
				designImplementationStart: designImplementationStart,
				designImplementationEnd: designImplementationEnd,
				teachingEffectStart: teachingEffectStart,
				teachingEffectEnd: teachingEffectEnd,
				teachingActivitesStart: teachingActivitesStart,
				teachingActivitesEnd: teachingActivitesEnd,
				towslsStart: towslsStart,
				towslsEnd: towslsEnd,
				learningeffectStart: learningeffectStart,
				learningeffectEnd: learningeffectEnd,
				characteristicStart: characteristicStart,
				characteristicEnd: characteristicEnd,
				classCacsi: classCacsi,
				isEffective: 1
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				var feedBackBody = $(".feed-back-tbody");
				var feedHtml = '';
				var num = 1;
				var pageIndexs = (Number(this.pageDoc.pageInfo.pageIndexs)-1)*Number(this.pageDoc.pageInfo.pageNum);
				if(data.flag == 0) {
					feedBackBody.empty();
					if(data.data.rows.length > 0) {
						$('.student-feedback-div .page-info').show();
						$.each(data.data.rows, function(i, v) {
							//判断为未评价的
								if(v.learningEffect == "0") {
									v.learningEffect = "--";
								}
								if(v.towsls == "0") {
									v.towsls = "--";
								}
								if(v.teachingActivites == "0") {
									v.teachingActivites = "--";
								}
//								if(v.teacherRecommendation == "") {
//									v.teacherRecommendation = "--";
//								}
								if(v.designImplementation == "0") {
									v.designImplementation = "--";
								}
								if(v.teachingEffect == "0") {
									v.teachingEffect = "--";
								}
								if(v.criticismSuggestion == "") {
										v.criticismSuggestion = "--";
								}
								if(v.characteristic=="0"){
										v.characteristic='--';
								}
							v.teacherRecommendation=JSON.parse(v.teacherRecommendation);
							if(v.teacherRecommendation.length!=0) {
								$.each(v.teacherRecommendation, function(a,b) {
									if(b.teacherName==''){
										b.teacherName='--';
									}
									if(b.contactWay==''){
										b.contactWay='--';
									}
									if(b.classTitle==''){
										b.classTitle='--';
									}
									if(b.orgName==''){
										b.orgName='--';
									}
									if(b.understandTeacher==''){
										b.understandTeacher='--';
									}
									if(a==0){
										feedHtml = '<tr>' +
											'<input type="hidden" value="' + v.traineeId + '" />' +
											'<td rowspan="'+v.teacherRecommendation.length+'">' + num++ + '</td>' +
											'<td rowspan="'+v.teacherRecommendation.length+'">学员' +(pageIndexs+i+1)+ '</td>' +
//											'<td rowspan="'+v.teacherRecommendation.length+'">' + v.phone + '</td>' +
											'<td rowspan="'+v.teacherRecommendation.length+'">' + v.designImplementation + '</td>' +
											'<td rowspan="'+v.teacherRecommendation.length+'">' + v.teachingEffect + '</td>' +
											'<td rowspan="'+v.teacherRecommendation.length+'">' + v.teachingActivites + '</td>' +
											'<td rowspan="'+v.teacherRecommendation.length+'">' + v.towsls + '</td>' +
											'<td rowspan="'+v.teacherRecommendation.length+'">' + v.learningEffect + '</td>' +
											'<td rowspan="'+v.teacherRecommendation.length+'">' + v.characteristic + '</td>' +
											'<td rowspan="'+v.teacherRecommendation.length+'">' + v.criticismSuggestion + '</td>'+
											'<td>'+b.teacherName+'</td>'+
											'<td>'+b.contactWay+'</td>'+
											'<td>'+b.classTitle+'</td>'+
											'<td>'+b.orgName+'</td>'+
											'<td>'+b.understandTeacher+'</td>';
										if(v.classCacsi == 0) {
											feedHtml += '<td rowspan="'+v.teacherRecommendation.length+'">--</td>' +
												'</tr>';
										} else{
											feedHtml += '<td rowspan="'+v.teacherRecommendation.length+'"><a class="back-look-details" style="color:#3c4687;cursor: pointer;">查看</a></td>' +
												'</tr>';
										}
									}else{
										feedHtml+='<tr>'+
											'<td>'+b.teacherName+'</td>'+
											'<td>'+b.contactWay+'</td>'+
											'<td>'+b.classTitle+'</td>'+
											'<td>'+b.orgName+'</td>'+
											'<td>'+b.understandTeacher+'</td>'+
											'</tr>';
									}
								});
							}else{
								feedHtml = '<tr>' +
											'<input type="hidden" value="' + v.traineeId + '" />' +
											'<td>' + num++ + '</td>' +
											'<td>学员' + (pageIndexs+i+1) + '</td>' +
//											'<td>' + v.phone + '</td>' +
											'<td>' + v.designImplementation + '</td>' +
											'<td>' + v.teachingEffect + '</td>' +
											'<td>' + v.teachingActivites + '</td>' +
											'<td>' + v.towsls + '</td>' +
											'<td>' + v.learningEffect + '</td>' +
											'<td>' + v.characteristic + '</td>' +
											'<td>' + v.criticismSuggestion + '</td>'+
											'<td>--</td>'+
											'<td>--</td>'+
											'<td>--</td>'+
											'<td>--</td>'+
											'<td>--</td>';
										if(v.classCacsi != 0) {
											feedHtml += '<td><a class="back-look-details" style="color:#3c4687;cursor: pointer;">查看</a></td>' +
												'</tr>';
										}else{
											feedHtml += '<td>--</td>' +
												'</tr>';
										}
							}
							feedBackBody.append(feedHtml);
						});
					} else {
						$('.student-feedback-div .page-info').hide();
						feedHtml='<tr>'+
							'<td colspan="15" align="center" style="border:0px;">'+
								'<div class="no-data" style="width: 280px;margin: 0 auto;">'+
									'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">'+
								'</div>'+
							'</td>'+
						'</tr>';
						feedBackBody.append(feedHtml);
					}
					$yt_baseElement.hideLoading();
				} else {
					$('.student-feedback-div .page-info').hide();
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
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
		currentDate.setDate(currentDate.getDate() - weekday - 1); //往前算（weekday-1）天，年份、月份会自动变化
		for(var i = 0; i < 7; i++) {
			currentDate.setDate(currentDate.getDate() + 1); //往前算（weekday-1）天，年份、月份会自动变化
			startStop.push(me.formatDate(currentDate));
		}
		return startStop;
	}
}

//百度地图插件
var positionMap = {
	ac: null,
	myValue: null,
	addMarkerState: true,
	mapObj: null,
	init: function(configData) {
		$("#l-map").empty();
		this.mapObj = new BMap.Map("l-map");
		this.mapObj.centerAndZoom("大连市甘井子区中国大连高级经理学院", 14); // 初始化地图,设置城市和地图级别。
		/*	var myCity = new BMap.LocalCity();
		myCity.get(function (result){
			var cityName = result.name;
			console.log(cityName);
			map.centerAndZoom(cityName,14);                   // 初始化地图,设置城市和地图级别。
		});*/
		this.mapObj.enableScrollWheelZoom(); //启用滚轮放大缩小，默认禁用
		this.mapObj.enableContinuousZoom(); //启用地图惯性拖拽，默认禁用
		// 添加定位控件
		this.ac = new BMap.Autocomplete( //建立一个自动完成的对象
			{
				"input": "suggestId",
				"location": this.mapObj
			});
		this.eventFun();
	},
	eventFun: function() {
		var me = this;
		me.ac.addEventListener("onhighlight", function(e) { //鼠标放在下拉列表上的事件
			var str = "";
			var _value = e.fromitem.value;
			var value = "";
			if(e.fromitem.index > -1) {
				value = _value.province + _value.city + _value.district + _value.street + _value.business;
			}
			str = "FromItem<br />index = " + e.fromitem.index + "<br />value = " + value;

			value = "";
			if(e.toitem.index > -1) {
				_value = e.toitem.value;
				value = _value.province + _value.city + _value.district + _value.street + _value.business;
			}
			str += "<br />ToItem<br />index = " + e.toitem.index + "<br />value = " + value;
			me.G("searchResultPanel").innerHTML = str;
		});

		me.ac.addEventListener("onconfirm", function(e) { //鼠标点击下拉列表后的事件
			var _value = e.item.value;
			myValue = _value.province + _value.city + _value.district + _value.street + _value.business;
			me.G("searchResultPanel").innerHTML = "onconfirm<br />index = " + e.item.index + "<br />myValue = " + myValue;

			me.setPlace();
		});

		/*this.mapObj.addEventListener("tilesloaded",function(e){
				if(me.addMarkerState){
					var myIcon  = new BMap.Icon("http://api.map.baidu.com/img/markers.png", new BMap.Size(23, 25), {  
	                    offset: new BMap.Size(10, 25), // 指定定位位置  
	                    imageOffset: new BMap.Size(0, 0 - 10 * 25) // 设置图片偏移  
	                });  

					me.marker = new BMap.Marker(me.mapObj.getCenter(),{icon: myIcon});// 创建标注
					me.mapObj.addOverlay(me.marker);             // 将标注添加到地图中	
					me.marker.enableDragging();  
					me.addMarkerState = false;
				}
				
			});*/
	},
	// 百度地图API功能
	G: function(id) {
		return document.getElementById(id);
	},
	setPlace: function() {
		var me = this;
		me.mapObj.clearOverlays(); //清除地图上所有覆盖物
		function myFun() {
			var pp = local.getResults().getPoi(0).point; //获取第一个智能搜索的结果
			me.mapObj.centerAndZoom(pp, 18);
			var myIcon = new BMap.Icon($yt_option.websit_path + "resources/images/img/blank.png", new BMap.Size(23, 25), {
				offset: new BMap.Size(10, 25), // 指定定位位置  
			});
			me.marker = new BMap.Marker(pp, {
				icon: myIcon
			});
			me.mapObj.addOverlay(me.marker); //添加标注

			me.marker.enableDragging();
		}
		var local = new BMap.LocalSearch(me.mapObj, { //智能搜索
			onSearchComplete: myFun
		});
		local.search(myValue);
	},
	getPosition: function() {
		return this.marker == undefined ? null : this.marker.getPosition();
	}
}
$(function() {
	//初始化方法
	caInfoList.init();
	//初始化课程模块
//	courseManager.init();
//加载日志按钮
	studentList.getStudentJournal();
//加载学员详情
	studentList.clickStudentDetails();
//	//初始化学员管理模块
//	studentList.init();
//	//初始化重复来院名单
//	repeatCourtyardList.init();
//	//初始化学员手册
//	studentManual.init();
//	//初始化接待通知
//	receptionNotice.init();
//	//初始化班级公告模块
//	classBulletin.init();
//	//初始化班级二维码模块
	classQrCode.init();
//	//初始化学员报到模块
//	studentReport.init();
//	//初始化缴费开票
//	payTicket.init();
//	//初始化请假管理
//	leaveTube.init();
//	//初始化出勤管理
//	attendance.init();
//	//初始化结业证
//	certificateEnd.init();
//	//初始化学员反馈
//	feedBack.init();
//	//初始化百度地图
//	positionMap.init();
});