var projectDetailsList = {
		//初始化方法
		init: function() {
			var tp = "";
			var tp = $yt_common.GetQueryString('tp');
			if(tp == 1) {
				$('.hid-title').hide();
				$('.hid-approva-box').hide();
			}
			//初始化下拉列表
			$(".yt-select").niceSelect();
			//初始化日期控件
			$(".time-receipt").calendar({
				speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
				complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
				readonly: true, // 目标对象是否设为只读，默认：true     
				lowerLimit: "NaN", // 日期下限，默认：NaN(不限制)     
				nowData: false, //默认选中当前时间,默认true  
				dateFmt: "yyyy-MM-dd",
				callback: function() { // 点击选择日期后的回调函数  
					//alert("您选择的日期是：" + $("#txtDate").val());  
				}
			});
			$(".feedback-time").calendar({
				speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
				complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
				readonly: true, // 目标对象是否设为只读，默认：true     
				lowerLimit: "NaN", // 日期下限，默认：NaN(不限制)     
				nowData: false, //默认选中当前时间,默认true  
				dateFmt: "yyyy-MM-dd",
				callback: function() { // 点击选择日期后的回调函数  
					//alert("您选择的日期是：" + $("#txtDate").val());  
				}
			});
			$(".date-birth").calendar({
				speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
				complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
				readonly: true, // 目标对象是否设为只读，默认：true     
				lowerLimit: "NaN", // 日期下限，默认：NaN(不限制)     
				nowData: false, //默认选中当前时间,默认true  
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
				nowData: false, //默认选中当前时间,默认true  
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
				nowData: false, //默认选中当前时间,默认true  
				dateFmt: "yyyy-MM-dd",
				callback: function() { // 点击选择日期后的回调函数  
					//alert("您选择的日期是：" + $("#txtDate").val());  
				}
			});
			$(".discuss-date").calendar({
				speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
				complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
				readonly: true, // 目标对象是否设为只读，默认：true     
				lowerLimit: "NaN", // 日期下限，默认：NaN(不限制)     
				nowData: false, //默认选中当前时间,默认true  
				dateFmt: "yyyy-MM-dd",
				callback: function() { // 点击选择日期后的回调函数  
					//alert("您选择的日期是：" + $("#txtDate").val());  
				}
			});
			//获取跳转页面传过来的pkId,projectCode
			var pkId = $yt_common.GetQueryString('pkId');
			var projectCode = $yt_common.GetQueryString('projectCode');
			var projectCodeList = $yt_common.GetQueryString('projectCodeList');
			$(".project-code").val(projectCodeList);
			//获取项目信息
			projectDetailsList.getProjectInf();
			projectDetailsList.getApproveInf();
			//隐藏input输入框
			$(".class-info-table input").attr("disabled", "disabled");

			//点击按钮
			$(".tab-title-list button").click(function() {
				$(this).addClass("active").siblings().removeClass("active");
				$(".box-list .content-box").eq($(this).index()).show().siblings().hide();
			});
			//点击洽谈记录
			$(".discuss-records").click(function() {
				projectDetailsList.getDiscussInf();
			});
			//点击洽谈记录新增
			$(".btn-add").click(function() {
				projectDetailsList.discussAdd();
				$(".add-discuss-alert .discuss-states").setSelectVal("");
				$(".add-discuss-alert .discuss-data").val("");
				$(".add-discuss-alert .linkman").val("");
				$(".add-discuss-alert .phone").val("");
				$(".add-discuss-alert .discussDetails").val("");
				$(".add-discuss-alert .train-cost").val("");
				$(".add-discuss-alert .course-cost").val("");
				$(".add-discuss-alert .stay-cost").val("");
				$(".add-discuss-alert .meal-cost").val("");
				$(".add-discuss-alert .other-cost").val("");
				$(".discuss-btn-sure .yt-model-sure-btn").off().on().click(function() {
					var discussId = "";
					projectDetailsList.addDiscussList(discussId);
				});
			});
			//点击洽谈记录编辑
			$(".discuss-box").on('click', '.discuss-editor', function() {
				projectDetailsList.discussAdd();
				var discussStates = $(this).parent().parent().parent().parent().parent().data("discussData").discussStates;
				var discussDate = $(this).parent().parent().parent().parent().parent().data("discussData").discussDate;
				var linkman = $(this).parent().parent().parent().parent().parent().data("discussData").linkman;
				var phone = $(this).parent().parent().parent().parent().parent().data("discussData").phone;
				var discussDetails = $(this).parent().parent().parent().parent().parent().data("discussData").discussDetails;
				var trainCost = $(this).parent().parent().parent().parent().parent().data("discussData").trainCost;
				var courseCost = $(this).parent().parent().parent().parent().parent().data("discussData").courseCost;
				var stayCost = $(this).parent().parent().parent().parent().parent().data("discussData").stayCost;
				var mealCost = $(this).parent().parent().parent().parent().parent().data("discussData").mealCost;
				var otherCost = $(this).parent().parent().parent().parent().parent().data("discussData").otherCost;
				var discussId = $(this).parent().parent().parent().parent().parent().data("discussData").discussId;
				$(".add-discuss-alert .discuss-states").setSelectVal(discussStates);
				$(".add-discuss-alert .discuss-data").val(discussDate);
				$(".add-discuss-alert .linkman").val(linkman);
				$(".add-discuss-alert .phone").val(phone);
				$(".add-discuss-alert .discussDetails").val(discussDetails);
				$(".add-discuss-alert .train-cost").val(trainCost);
				$(".add-discuss-alert .course-cost").val(courseCost);
				$(".add-discuss-alert .stay-cost").val(stayCost);
				$(".add-discuss-alert .meal-cost").val(mealCost);
				$(".add-discuss-alert .other-cost").val(otherCost);
				$(".yt-model-sure-btn").off().on().click(function() {
					projectDetailsList.addDiscussList(discussId);
				});
			});
			//点击洽谈记录删除
			$(".discuss-box").on('click', '.discuss-del', function() {
				var discussId = $(this).find("input.discussId").val();
				$('.hid-discuss-id').val(discussId);
				projectDetailsList.delDiscussList(discussId);
			});
			//洽谈记录审核意见提交
			$('.discuss-box').on('click','.talk-over-with-submit',function(){
				debugger
				//确认取消按钮签对象
				var btn = $(this);
				//文本框对象
				var textareaNoe = $(this).parent().prev().find('.apprro-view');
				var discussId = $(this).parent().find('.hid-discuss-id').val();
				var details = $(this).parent().prev().find('.apprro-view').val();
				var pkId = $yt_common.GetQueryString('pkId');
				$.ajax({
					type: "post",
					url: $yt_option.base_path + "project/addOrUpdateDiscussIdea",
					data:{
						pkId:pkId,
						discussId:discussId,
						ideaType:"2",
						details:details
					},
					async: false,
					success: function(data) {
						if (data.flag==0) {
							//提交成功，隐藏取消提交按钮
							btn.parent().hide();
							//审核意见禁止输入
							textareaNoe.attr("disabled", true);
							textareaNoe.css("border","none");
							textareaNoe.css("background","#FFF");
							projectDetailsList.getDiscussInf();
						}
					}
				});
			});
			//点击学员管理
			$(".student-admin").click(function() {
				projectDetailsList.getStudentAdminList();
				//获取集团名称
				var groupList = projectDetailsList.getListSelectGroup1("2");
				var groupOnlyList = projectDetailsList.getListSelectGroup1("1");
				if(groupList != null || groupOnlyList != null) {
					$.each(groupList, function(i, n) {
						$("select.org-id").append('<option value="' + n.groupId + '">' + n.groupName + '</option>');
					});
					$.each(groupOnlyList, function(i, n) {
						$("select.group-id-elementary").append('<option value="' + n.groupId + '">' + n.groupName + '</option>');
					});
				}
				$("select").niceSelect();
			});
			//复选框
			//全选  
			$(".check-all").change(function() {
				//判断自己是否被选中  
				if($(this).parent().hasClass("check")) {
					//设置反选  
					$(this).parents("table").find("tbody input[type='checkbox']").setCheckBoxState("uncheck");
				} else {
					//调用设置选中方法,全选  
					$(this).parents("table").find("tbody input[type='checkbox']").setCheckBoxState("check");
				}

			});

			//修改全选按钮状态
			$(".student-admin-tbody").on("change", "input[type='checkbox']", function() {
				if($(this).parents("table").find("tbody input[type='checkbox']").length != $(this).parents("table").find("tbody input[type='checkbox']:checked").length) {
					$(this).parents("table").find(".check-all").setCheckBoxState("uncheck");
				} else {
					$(this).parents("table").find(".check-all").setCheckBoxState("check");
				}
			});
			//点击学员管理新增
			$(".student-add").click(function() {
				projectDetailsList.studentAdd();
				//点击新增
				$(".add-student .yt-model-sure-btn").click(function() {
					projectDetailsList.addStudentList();
				});
			});
			//点击学员管理修改
			$(".student-amend").click(function() {
				//判断是否有选中行
				if($("tr.yt-table-active").length == 0) {
					$yt_alert_Model.prompt("请选择要修改的数据");
					return false;
				}
				//获取被选中行的详细信息
				projectDetailsList.getStudentInf();
				//设置标题内容
				$(".yt-edit-alert-title-msg").text("修改");
				projectDetailsList.studentAdd();
				//点击修改确定按钮
				$(".add-student .yt-model-sure-btn").click(function() {
					projectDetailsList.amendStudentList();
				});
			});
			//点击删除
			$(".student-del").on('click', function() {
				//判断是否有选中行
				if($("tr.yt-table-active").length == 0) {
					$yt_alert_Model.prompt("请选择要删除的数据");
					return false;
				}
				//调用删除方法  删除被选中的数据
				projectDetailsList.delStudentList();
			});
			//点击日志
			$(".log-list").click(function() {
				projectDetailsList.studentLog();
			});
			//点击导入
			$(".student-lead").click(function() {
				projectDetailsList.studentLead();
				$(".lead-student .yt-model-sure-btn").click(function() {
					projectDetailsList.batchStudentLead();
				});
			});
			//下载附件
			$(".download-template").click(function() {
				var file = $(".template-file").val();
				var fileName = getFileName(file);

				function getFileName(o) {
					var pos = o.lastIndexOf("\\");
					return o.substring(pos + 1);
				}
				var downUrl = $yt_option.base_path + "class/trainee/downloadTraineeByClass";
				$.ajaxDownloadFile({
					url: downUrl,
					data: {
						fileName: fileName,
						isDownload: true
					}
				});
			});
			//点击导出
			$(".export-student-list").on("click", function() {
				//判断是否有选中行
				if($("tr.yt-table-active").length == 0) {
					$yt_alert_Model.prompt("请选择要操作的数据");
					return false;
				}
				//获取被选中行的数据
				var projectCode = $yt_common.GetQueryString('pkId');
				var exportName = $('.yt-table-active').data("legalData").exportName;
				var selectParam = $('.yt-table-active').data("legalData").selectParam;
				var gender = $('.yt-table-active').data("legalData").gender;
				var phone = $('.yt-table-active').data("legalData").phone;
				var groupId = $('.yt-table-active').data("legalData").groupId;
				var orgId = $('.yt-table-active').data("legalData").orgId;
				var deptPosition = $('.yt-table-active').data("legalData").deptPosition;
				var isFirstTraining = $('.yt-table-active').data("legalData").isFirstTraining;
				var classCommitteeId = $('.yt-table-active').data("legalData").classCommitteeId;
				var signUpState = $('.yt-table-active').data("legalData").signUpState;
				var downUrl = $yt_option.base_path + "teacher/exportTeacher";
				$.ajaxDownloadFile({
					url: downUrl,
					data: {
						projectCode: projectCode,
						exportName: exportName,
						selectParam: selectParam,
						gender: gender,
						phone: phone,
						groupId: groupId,
						orgId: orgId,
						deptPosition: deptPosition,
						isFirstTraining: isFirstTraining,
						classCommitteeId: classCommitteeId,
						signUpState: signUpState,
						isDownload: true
					}
				});
			});
			//点击返回
			$(".btn-return").click(function() {
				var projectCode = $yt_common.GetQueryString("projectCode");
				window.location.href = "classInfo.html?projectCode="+projectCode;
				
			});

			//点击新增添加一条空数据
			//1.拼接一行空字符串
			var groupStr = '<tr>' +
				'<td><span style="margin-left:10px">' + 1 + '</span></td>' +
				'<td class="groupId">' +
				'<select class="yt-select group-select" style="width:200px">' +
				/*'<option value="">请选择</option>'+*/
				'</select>' +
				'</td>' +
				'<td><input class="yt-input trainingExpenseRackRate" type="text"/></td>' +
				'<td><input class="yt-input traineeRackRate" type="text"/></td>' +
				'<td><input class="yt-input quarterageRackRate" type="text"/></td>' +
				'<td><input class="yt-input mealFeeRackRate" type="text"/></td>' +
				'<td><input class="yt-input trainingExpenseNegotiatedPrice" type="text"/></td>' +
				'<td><input class="yt-input traineeNegotiatedPrice" type="text"/></td>' +
				'<td><input class="yt-input quarterageNegotiatedPrice" type="text"/></td>' +
				'<td><input class="yt-input mealFeeNegotiatedPrice" type="text"/></td>' +
				'<td align="center"><a href="#" class="editor-charge">编辑</a></td>' +
				'<td align="center">' +
				'<span style="">' +
				'<img src="../../resources/images/icons/cost-level.png" class="del-charge" alt="" />' +
				'</span>' +
				'</td>' +
				'</tr>';
			//2.点击新增
			$(".add-charge").click(function() {
				$(".charge-tbody").append(groupStr);
				//获取集团名称
				var groupList = projectDetailsList.getListSelectGroup();
				if(groupList != null) {
					$.each(groupList, function(i, n) {
						$(".group-select").append('<option value="' + n.groupId + '">' + n.groupName + '</option>');
					});
				}
				$(".group-select").niceSelect();
			});
			//点击删除按钮  删除当前行数据
			$(".charge-tbody").on('click', '.del-charge', function() {
				$(this).parent().parent().parent().remove();
			});
			//点击编辑按钮  显示开票信息弹出框
			$(".charge-tbody").on('click', '.editor-charge', function() {
				projectDetailsList.billingInf();
				$(".invoice-inf .sub-invoice").click(function(){
					projectDetailsList.savebillingInf();
				});
			});
			//点击收费标准
			$(".charge-standard").click(function() {
				//获取学员费用详情
				projectDetailsList.getStudentCostInf();
				//获取单位标准
				projectDetailsList.getUnitCostInf();
				//点击确定提交数据
				$(".btn-sub-charge").click(function() {
					projectDetailsList.saveChargeStandard();
					projectDetailsList.getStudentCostInf();
				});
				//点击确定提交数据
				$(".update-trainee-details").click(function() {
					projectDetailsList.updateTraineeDetails();
				});
			});
			//点击教学方案
			$(".teaching-plan").click(function() {
				projectDetailsList.getTeachPlanDesignRequirements();
			});
			//教学方案设计需求提交
			//点击提交
			$(".btn-teach-plan-submit").click(function() {
				var dataStates = 1;
				projectDetailsList.teachPlanDesignRequirements(dataStates);
			});
			//点击保存
			$(".btn-teach-plan-save").click(function() {
				var dataStates = 0;
				projectDetailsList.teachPlanDesignRequirements(dataStates);
			});
			//获取民族
			var nationsList = projectDetailsList.getListSelectNations();
			if(nationsList != null) {
				$.each(nationsList, function(i, n) {
					$(".nation-id").append('<option value="' + n.nationId + '">' + n.nationName + '</option>');
				});
			}
			$(".nation-id").niceSelect();
			//学员管理条件搜索
			$('.search-btn').click(function() {
				//调用获取列表数据方法查询
				projectDetailsList.getStudentAdminList();
			});
			//点击姓名查看选学学员详情
			$(".student-admin-tbody").on('click', '.real-name-alert-details', function() {
				//获取被选中行的详细信息
				projectDetailsList.getStudentInf();
				projectDetailsList.elementaryStudentDetailsAlert();
				$(".shut-down").click(function() {
					$(".elementary-student-details").hide();
				});
			});

			//教学方案初稿附件上传
			$(".file-upload").undelegate().delegate("input", "change", function() {
				var addFile = $(this).attr("id");
				$yt_baseElement.showLoading();
				var url = $yt_option.acl_path + "api/tAscPortraitInfo/addFile";
				$.ajaxFileUpload({
					url: url,
					type: "post",
					data: { modelCode: "teachPlan" },
					dataType: 'json',
					fileElementId: addFile,
					success: function(data, textStatus) {
						var resultData = $.parseJSON(data);
						if(resultData.success == 0) {
							$yt_alert_Model.prompt("附件上传成功");
							$(".file-id").empty();
							$(".file-id").append('<p style="width:870px;height:40px;border:1px dashed #e6e6e6;line-height:40px;">' +
								'<span class="file-name" style="margin-right: 50px;color:blue;cursor: pointer"><input type="hidden" class="file-span-id" value="' + resultData.obj.pkId + '" >' + resultData.obj.naming + '</span>' +
								'<span class="del-file-p" style="float:right;cursor: pointer; display:none;"><img src="../../resources/images/icons/teach-plan-del.png" alt="" />删除</span>' +
								'<span class="down-load-file-index" style="float:right;cursor: pointer;"><img src="../../resources/images/icons/down-load-teach-plan.png" alt="" />下载</span>' +
								'<span style="float:right; display:none;"><img src="../../resources/images/icons/preview.png" alt="" />预览</span>' +
								'</p>');

						} else {
							$yt_alert_Model.prompt("附件上传失败");
						}
						$yt_baseElement.hideLoading();
					},
					error: function(data, status, e) { //服务器响应失败处理函数  
						$yt_alert_Model.prompt("附件上传失败");
						$yt_baseElement.hideLoading();
					}
				});
			});
			//下载附件
			$(".file-id").on("click", ".down-load-file-index", function() {
				//var pkId = $(".file-span-id").val();
				// var downUrl = $yt_option.acl_path + "api/tAscPortraitInfo/download";
				var downUrl = $('.down-file-url').val();
				$.ajaxDownloadFile({
					url: downUrl
				});
			});
			//下载模板
			$(".down-load-template").click(function() {
				var pkId = $(".file-span-id").val();
				var downUrl = $yt_option.base_path + "project/downloadTeachingScheme";
				$.ajaxDownloadFile({
					url: downUrl,
					data: {
						fileName: ""
					}
				});
			});
			//删除附件
			$(".file-id").on("click", ".del-file-p", function() {
				$(this).parent().remove();
			});
			//初稿点击取消
			$('.btn-teach-plan-end-cancel').click(function() {
				$(".file-id").empty();
			});
			//终稿点击取消
			$('.btn-teach-plan-end-cancel').click(function() {
				$(".last-file-id").empty();
			});
			//教学方案终稿附件上传
			$(".last-file-upload").undelegate().delegate("input", "change", function() {
				var addFile = $(this).attr("id");
				$yt_baseElement.showLoading();
				var url = $yt_option.acl_path + "api/tAscPortraitInfo/addFile";

				$.ajaxFileUpload({
					url: url,
					type: "post",
					data: { modelCode: "teachPlan" },
					dataType: 'json',
					fileElementId: addFile,
					success: function(data, textStatus) {
						var resultData = $.parseJSON(data);
						if(resultData.success == 0) {
							$yt_alert_Model.prompt("附件上传成功");
							$(".last-file-id").empty();
							$(".last-file-id").append('<p style="width:870px;height:40px;border:1px dashed #e6e6e6;line-height:40px;">' +
								'<span class="file-name" style="margin-right: 50px;color:blue;cursor: pointer"><input type="hidden" class="file-span-id" value="' + resultData.obj.pkId + '" >' + resultData.obj.naming + '</span>' +
								'<span class="del-file-p" style="float:right;cursor: pointer; display:none;"><img src="../../resources/images/icons/teach-plan-del.png" alt="" />删除</span>' +
								'<span class="down-load-file-index" style="float:right;cursor: pointer;"><img src="../../resources/images/icons/down-load-teach-plan.png" alt="" />下载</span>' +
								'<span style="float:right; display:none;"><img src="../../resources/images/icons/preview.png" alt="" />预览</span>' +
								'</p>');

						} else {
							$yt_alert_Model.prompt("附件上传失败");
						}
						$yt_baseElement.hideLoading();
					},
					error: function(data, status, e) { //服务器响应失败处理函数  
						$yt_alert_Model.prompt("附件上传失败");
						$yt_baseElement.hideLoading();
					}
				});
			});

			//调用下一步操作人
			var getAllNextPeople = projectDetailsList.getListSelectDealingWithPeople();
			if(getAllNextPeople != null) {
				$.each(getAllNextPeople, function(i, n) {
					if(i == 0) {
						//初稿提交下一步操作人
						$('.star-dealingWithPeople').val(n.userCode);
					}
					$(".next-people").append('<option value="' + n.userCode + '">' + n.userName + '</option>');
				});
			};
			$(".next-people").niceSelect();
			//项目主任首次操作点击提交
			$(".btn-teach-plan-star-submit").click(function() {
				projectDetailsList.firstDraftByProjectDirector(1);
			});
			//项目主任终稿提交
			$(".btn-teach-plan-end-submit").click(function() {
				projectDetailsList.firstDraftByProjectDirector(2);
			});
			// 教学方案初稿审批流程单选按钮
			$(".check-label input[type='radio']").change(function() {
				var rad = $(this).val();
				//单选当前值为1同意显示下一步操作人下拉框
				if(rad == "completed") {//同意显示下一步操作人
					if($('.hid-tast-key').val() != "activitiEndTask") {
						$('.hid-input').show();
					} else {
						$('.hid-input').hide();
					}
				}else{//拒绝隐藏下一步操作人
					$('#nextPeople').val("");
					$('.hid-input').hide();
				}
			});
			// 项目审批流程单选按钮
			$(".project-radio input[type='radio']").change(function() {
				var rad = $(this).val();
				//单选当前值为1同意显示下一步操作人下拉框
				if(rad == "completed") {
					if($('.hid-tast-key').val() != "activitiEndTask") {
						//显示设置负责人弹窗
						projectDetailsList.setPrincipal();
						trainingProgramsList.setPrincipal();
						var alertProjectName = $('.yt-table-active').data("legalData").projectName;
						var alertProjectType = $('.yt-table-active').data("legalData").projectType;
						$(".project-name").text(alertProjectName);
						$(".project-type").text(alertProjectType);
						$(".set-principal-alert .yt-model-sure-btn").click(function(){
							trainingProgramsList.setHeadAlert();
						});
						$('.hid-input').show();
					} else {
						$('.hid-input').hide();
					}
				};
				//单选当前值为0拒绝隐藏下一步操作人下拉框
				if(rad == "returnedSubmit") {
					$('#nextPeople').val("");
					$('.hid-input').hide();
				}
			});
			

//--------------------------审批功能------------------------------------
			//调用下一步操作人
			projectDetailsList.getNextOperatePerson();
			//教学方案下一步操作人
			projectDetailsList.getNextOperatePersonTeach();
			$(".next-people-teach").niceSelect();
			//点击返回
			$('.back-btn').click(function() {
				window.location.href = "projectList.html";
			});

//教学方案审批-------------------------------------------------------------STAR

			$('.appro-submit-teach').click(function() {
				//流程实例id
				var processInstanceId = $('.hid-process-instance-id-teach').val();
				var projectId = $yt_common.GetQueryString('pkId');

				//下一步操作人
				var dealingWithPeople = $('.next-people-teach').val();
				var tastKey = $('.tast-key-teach').val();
				//如果满足该条件，是没结束流程的最后一步，不需要传下一步操作人
				if(tastKey == "activitiEndTask") {
					dealingWithPeople = "";
				}
				//审批意见
				var opintion = $('.opintion-teach').val();
				//判断同意和不同意
				var nextCode = $('input[name="radioType"]:checked ').val();
				//拒绝下一步操作人传空
				if(nextCode == "returnedSubmit") {
					dealingWithPeople = "";
				}
				$.ajax({
					type: "post",
					url: $yt_option.base_path + "project/updateTeachingSchemeApply",
					data: {
						projectId: projectId,
						businessCode: "teachingsSchemeLevel",
						dealingWithPeople: dealingWithPeople,
						opintion: opintion,
						processInstanceId: processInstanceId,
						nextCode: nextCode
					},
					success: function(data) {
						if(data.flag == 0) {
							window.location.href = "teachingDesignApproveList.html";
						};
					}
				});
			});
			//审批取消
			$('.appro-cancel-teach').click(function() {
				//跳转到教学方案审批列表页面
				window.location.href = "teachingDesignApproveList.html";
			});
			//教学方案审批-------------------------------------------------------------END	

			//项目信息审批意见提交
			$('.appro-submit').click(function() {
				//流程实例id
				var processInstanceId = $('.hid-process-instance-id').val();
				var pkId = $yt_common.GetQueryString('pkId');
				var projectCode = $yt_common.GetQueryString('projectCode');

				//下一步操作人
				var dealingWithPeople = $('#nextPeople').val();
				var tastKey = $('.hid-tast-key').val();
				//如果满足该条件，是没结束流程的最后一步，不需要传下一步操作人
				if(tastKey == "activitiEndTask") {
					dealingWithPeople = "";
				}
				//审批意见
				var opintion = $('#opintion').val();
				//判断同意和不同意
				var nextCode = $('input[name="radioType"]:checked ').val();
				//拒绝
				if(nextCode == "returnedSubmit") {
					dealingWithPeople = "";
				}

				$.ajax({
					type: "post",
					url: $yt_option.base_path + "project/updateApply",
					data: {
						pkId: pkId,
						projectCode:projectCode,
						businessCode: "project",
						dealingWithPeople: dealingWithPeople,
						opintion: opintion,
						processInstanceId: processInstanceId,
						nextCode: nextCode
					},
					success: function(data) {
						if(data.flag == 0) {
							window.location.href = "projectList.html";
							
						};
					}
				});
			});
			//审批取消
			$('.appro-cancel').click(function() {
				//跳转到审批列表页面
				window.location.href = "projectList.html";
				
			});

		},
		//获取登录人信息
		userInfo: function() {
			$.ajax({
				type: "post", //ajax访问方式 默认 "post"  
				url: $yt_option.base_path + "uniform/user/getUsersDetails", //ajax访问路径  
				data: {}, //ajax查询访问参数
				success: function(data) {
					$('.hid-user-real-name').val(data.data.userRealName);
				}

			});
		},

		//	教学方案下一步操作人-STAR-------------------------------

		getNextOperatePersonTeach: function() {
			var nextPersonList = projectDetailsList.getworkFlowOperateTeach();
			if(nextPersonList != null) {
				$.each(nextPersonList, function(i, n) {
					$(".next-people-teach").append('<option value="' + n.userCode + '">' + n.userName + '</option>');
				});
			};
			$(".next-people-teach").niceSelect();
		},
		//获取下一步操作人项目信息
		getworkFlowOperateTeach: function() {
			var businessCode;
			//获取页面隐藏的流程实例id
			var processInstanceId = $('.hid-process-instance-id-teach').val();
			var list = [];
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "uniform/workFlowOperate/getSubmitPageData",
				data: {
					businessCode: "project",
					processInstanceId: processInstanceId
				},
				async: false,
				success: function(data) {
					$.each(data.data, function(i, n) {
						for(var k in n) {
							user= n[k];
						}
					});
				}
			});
			return user;
		},

		//下一步操作人项目信息
		getNextOperatePerson: function() {
			var nextPersonList = projectDetailsList.getworkFlowOperate();
			if(nextPersonList != null) {
				$.each(nextPersonList, function(i, n) {
					$("#nextPeople").append('<option value="' + n.userCode + '">' + n.userName + '</option>');
				});
			};
			$("#nextPeople").niceSelect();
		},
		//获取下一步操作人项目信息
		getworkFlowOperate: function() {
			var businessCode;
			//获取页面隐藏的流程实例id
			var processInstanceId = $('.hid-process-instance-id').val();
			var list = [];
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "uniform/workFlowOperate/getSubmitPageData",
				data: {
					businessCode: "project",
					processInstanceId: processInstanceId
				},
				async: false,
				success: function(data) {
					$.each(data.data, function(i, n) {
						for(var k in n) {
							user= n[k];
						}
					});
				}
			});
			return user;
		},

		//-------------------------------审批功能END
		/**
		 * 收费标准获取所有集团,单位
		 */
		getListSelectGroup: function() {
			var list = [];
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "uniform/group/getGroups",
				data: {
					isSelectGroup: '2',
					groupId: ""
				},
				async: false,
				success: function(data) {
					list = data.data || [];
				}
			});
			return list;
		},
		/**
	 * 获取所有集团,单位
	 */
	getListSelectGroup1: function(isSelectGroup) {
		var list = [];
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/group/getGroups",
			data: {
				isSelectGroup: isSelectGroup,
				groupId: ""
			},
			async: false,
			success: function(data) {
				list = data.data || [];
			}
		});
		return list;
	},
		/**
		 * 获取民族
		 */
		getListSelectNations: function() {
			var list = [];
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "uniform/getNations",
				data: {
					searchParameters: ""
				},
				async: false,
				success: function(data) {
					list = data.data || [];
				}
			});
			return list;
		},

		//我的项目查询一条详细信息
		getProjectInf: function() {
			$yt_baseElement.showLoading();
			//获取当前登录人
			projectDetailsList.userInfo();
			var pkId = $yt_common.GetQueryString('pkId');
			$.ajax({
				type: "post", //ajax访问方式 默认 "post"  
				url: $yt_option.base_path + "project/getBeanById", //ajax访问路径  
				data: {
					pkId: pkId
				}, //ajax查询访问参数
				success: function(data) {
					if(data.flag == 0) {
						//获取销售人名和项目主任名
						$('.hid-project-sell-name').val(data.data.projectSellName);
						$('.hid-project-head-name').val(data.data.projectHeadName);

						$(".get-project-inf").setDatas(data.data);
						$('.project-sell-name').val(data.data.projectSellName);
						$('.project-head').val(data.data.projectHead);
						if(data.data.projectType == 1) {
							$(".project-type").val("计划");
						} else if(data.data.projectType == 2) {
							$(".project-type").val("委托");
						} else if(data.data.projectType == 3) {
							$('.get-project-info,.discuss-records').hide();
							$(".project-type").val("选学");
						} else if(data.data.projectType == 4) {
							$(".project-type").val("调训");
						}
						$yt_baseElement.hideLoading();

					} else {
						$yt_alert_Model.prompt("获取失败");
						$yt_baseElement.hideLoading();
					}
				}
			});
		},
		//设置负责人
		setHeadAlert: function() {
			var projectCode = $('.yt-table-active').data("legalData").projectCode;
			var userList = "";
			
			var userListArr=[];
			$(".set-principal-alert .set-principal-alert-select").each(function (i,n){
				types=$(n).find("select.types option:selected").attr("types");
				typesData=$(n).find("select.types option:selected").val();
					
				var arrUserList={
					types:types,
					typesData:typesData,
				}
				userListArr.push(arrUserList);
			});
			var userList = JSON.stringify(userListArr);
			
			$.ajax({
				type: "post", //ajax访问方式 默认 "post"  
				url: $yt_option.base_path + "project/updateProjectPrincipal", //ajax访问路径  
				data: {
					projectCode:projectCode, 
					userList:userList
				}, //ajax查询访问参数
				success: function(data) {
					if(data.flag == 0){
					 	$yt_alert_Model.prompt("操作成功");
					 	$(".set-principal-alert").hide();
					}else{
						$yt_alert_Model.prompt("操作失败");
						$(".set-principal-alert").hide();
					}
				} 
			});
		},
		//设置负责人弹出框
		setPrincipal:function() {  
	        /** 
	         * 显示编辑弹出框和显示顶部隐藏蒙层 
	         */  
	        $(".set-principal-alert").show();  
	        /** 
	         * 调用算取div显示位置方法 
	         */  
	        $yt_alert_Model.getDivPosition($(".set-principal-alert"));  
	        /* 
	         * 调用支持拖拽的方法 
	         */  
	        $yt_model_drag.modelDragEvent($(".set-principal-alert .yt-edit-alert-title"));  
	        /** 
	         * 点击取消方法 
	         */  
	        $('.set-principal-alert .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {  
	            //隐藏页面中自定义的表单内容  
	            $(".set-principal-alert").hide();  
	            //隐藏蒙层  
	            $("#pop-modle-alert").hide();  
        	});
        },
		//项目审批流程
		getApproveInf: function() {
			$yt_baseElement.showLoading();
			var pkId = $yt_common.GetQueryString('pkId');
			var approve = $yt_common.GetQueryString('approve');
			$.ajax({
				type: "post", //ajax访问方式 默认 "post"  
				url: $yt_option.base_path + "project/getBeanById", //ajax访问路径  
				data: {
					pkId: pkId
				}, //ajax查询访问参数
				success: function(data) {
					if (data.data != null) {
					if(data.data.projectType == 2){//项目类型为委托
						if(data.data.flowLog == "" || data.data.flowLog == null) {
	
						} else {
							$('.hid-title').show();
							$('.hid-approva-box').show();
							if(data.flag == 0) {
								var flowLog = JSON.parse(data.data.flowLog);
								$('.hid-process-instance-id').val(data.data.processInstanceId);
								var middleStepHtml;
								var length = flowLog.length;
								var deleteReasons = "";
								var tastName;
								$.each(flowLog, function(i, v) {
									if(v.deleteReason == "completed") {
										deleteReasons = "同意";
									};
									if(v.deleteReason == "returnedSubmit") {
										deleteReasons = "退回到审批人";
									};
									if(v.deleteReason == "refusedToApproval") {
										deleteReasons = "拒绝";
									}
									tastName = v.taskName + deleteReasons;
									//如果i等于0是最后一步流程数据
									if(i == 0) {
										if(v.tastKey=="activitiEndTask" && v.deleteReason !=""){
											$('.project-appro-btn-box').hide();
										}
										if(approve == 1){//如果值为1标识是从审批记录条状过来的,只显示审批流程记录不显示审批步骤
											
											$('.last-step-project-div').hide();
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
																				'<span  class="middle-step-taskName view-taskName-span"  style="float: left;">'+tastName+'</span>'+
																			'</li>'+
																			'<li class="view-time-li middle-step-commentTime" >'+v.commentTime+'</li>'+
																			'<li class="operate-view-box-li">'+
																				'<div class="operate-view-title-li">操作意见：</div>'+
																				'<div class="operate-view-text-li middle-step-comment" style="padding-left:10px;">'+v.comment+'</div>'+
																			'</li>'+
																		'</ul>'+
																	'</div>'+
																'</div>';
												$('.last-step-add-project').append(middleStepHtml);											
										}else{//否则是从审批列表跳转过来的
											//隐藏下一步操作人下拉框
											if(v.tastKey=="activitiEndTask" && v.deleteReason ==""){//到最后一步审批
												$('.next-operate-person-tr').hide();
												$('.hid-tast-key').val(v.tastKey);
												//流程编号
												$('.last-step-order').text(length);
												//操作人名
												$('.last-step-operate-person-userName').text(v.userName);
												//操作状态
												$('.last-step-operationState').text(tastName);
												//停滞时间							
												$('.last-step-commentTime').text(v.commentTime);
											}else{
												$('.hid-tast-key').val(v.tastKey);
												//流程编号
												$('.last-step-order').text(length);
												//操作人名
												$('.last-step-operate-person-userName').text(v.userName);
												//操作状态
												$('.last-step-operationState').text(tastName);
												//停滞时间							
												$('.last-step-commentTime').text(v.commentTime);
											}
											if (v.tastKey=="activitiEndTask" && v.deleteReason !="") {//标志审批结束
												//隐藏审批步骤
												$('.last-step-project-div').hide();
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
																				'<span  class="middle-step-taskName view-taskName-span"  style="float: left;">'+tastName+'</span>'+
																			'</li>'+
																			'<li class="view-time-li middle-step-commentTime" >'+v.commentTime+'</li>'+
																			'<li class="operate-view-box-li">'+
																				'<div class="operate-view-title-li">操作意见：</div>'+
																				'<div class="operate-view-text-li middle-step-comment" style="padding-left:10px;">'+v.comment+'</div>'+
																			'</li>'+
																		'</ul>'+
																	'</div>'+
																'</div>';
												$('.last-step-add-project').append(middleStepHtml);
											}
										}
									};
									//如果i等于length-1是流程的第一步
									if(i == length - 1) {
										//流程编号
										$('.first-step-order').text(1);
										//操作人名
										$('.first-step-operate-person-userName').text(v.userName);
										//当前审批节点名字
										$('.first-step-taskName').text(tastName);
										//时间
										$('.first-step-commentTime').text(v.commentTime);
										//审批意见
										$('.first-step-comment').text(v.comment);
									};
	
									//如果i不等于且不等于length-1，是流程的中间步骤
									if(i != 0 && i != length - 1) {
										//流程序号
										var order = length - i;
										middleStepHtml = '<div>' +
											'<div style="height: 150; ">' +
											'<div class="number-name-box">' +
											'<span class="number-box-span middle-step-order middle-a-index" >' + order + '</span>' +
											'<span class="name-box-span middle-step-userName middle-a-index" >' + v.userName + '</span>' +
											'<img src="../../resources/images/open/openFlow.png" class="order-img" />' +
											'</div>' +
											'</div>' +
											'<div class="middle-step-box-div">' +
											'<ul class="middle-step-box-ul">' +
											'<li style="height: 30px;">' +
											'<span  class="middle-step-taskName view-taskName-span"  style="float: left;">' + tastName + '</span>' +
											'</li>' +
											'<li class="view-time-li middle-step-commentTime" >' + v.commentTime + '</li>' +
											'<li class="operate-view-box-li">' +
											'<div class="operate-view-title-li">操作意见：</div>' +
											'<div class="operate-view-text-li middle-step-comment" style="padding-left:10px;">' + v.comment + '</div>' +
											'</li>' +
											'</ul>' +
											'</div>' +
											'</div>';
										$('.last-step-add-project').append(middleStepHtml);
									}
								});
								$yt_baseElement.hideLoading();
	
							} else {
								$yt_alert_Model.prompt("获取失败");
								$yt_baseElement.hideLoading();
							}
						}
					}else{//项目类型不是委托的没有审批流程
						//隐藏审批
						$('.hid-title').hide();
						$('.hid-approva-box').hide();
						$('.project-appro-btn-box').hide();
					}
				}
				}
			});
		},
		/**
		 * 获取下一步操作人
		 */
		getListSelectDealingWithPeople: function() {
			var list = [];
			var processInstanceId = $('.processInstanceId').val();
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "uniform/workFlowOperate/getSubmitPageData",
				data: {
					businessCode: "project",
					processInstanceId:processInstanceId,
					parameters: "",
					versionNum: ""
				},
				async: false,
				success: function(data) {
					$.each(data.data, function(i, n) {
						for(var k in n) {
							list = n[k];
						}
					});
				}
			});
			return list;
		},
		

		//查询洽谈记录详细信息
		getDiscussInf:function() {
			debugger
			$yt_baseElement.showLoading();
			var pkId = $yt_common.GetQueryString('pkId');
			$.ajax({
				type: "post", //ajax访问方式 默认 "post"  
				url: $yt_option.base_path + "project/getDiscuss", //ajax访问路径  
				data: {
					pkId: pkId
				}, //ajax查询访问参数
				success: function(data) {
					if(data.flag == 0) {
						var htmlDiscuss = $(".discuss-box");
						var htmlIndex = "";
						var num = 1;
						$(htmlDiscuss).empty();
						if(data.data.length > 0) {
							$.each(data.data, function(i, v) {
								var createUsername = "";
								var details = "";
								//编辑删除按钮
								var deleEdit = "";
								var ideaJsonArr = JSON.parse(v.ideaJson);
								if (i == data.data.length-1) {//是最后一条，显示编辑和删除按钮
									deleEdit ='<button class="yt-option-btn discuss-editor">编辑</button>' +
										'<button class="yt-option-btn discuss-del"><input type="hidden" value="' + v.discussId + '" class="discussId">删除</button>';
								}
								if (ideaJsonArr.length == 0) {//洽谈记录没被审核，编辑删除按钮不显示，审核意见填写框显示
									discuinfo = '<table style="width:100%;">'+
											'<tr>'+
												'<td colspan="2" style="height:30px;padding-bottom: 15px;">'+
													'<p style="width:82px;height:30px;line-height:30px;text-align:center; background-color: #5B66AB;color:#FFF;">审核意见</p>'+
												'</td>'+
											'</tr>'+
											'<tr>'+
												'<td valign="top" style="width:85px;text-align:right;">审核意见：</td>'+
												'<td >'+
													'<textarea class="apprro-view" style="min-height: 50px; width: 860px;resize:none;"></textarea>'+
												'</td>'+
											'</tr>'+
										'</table>'+
										'<div class="yt-eidt-model-bottom" style="text-align: center;margin: 10px 0px;">'+
											'<input class="hid-discuss-id" type="hidden" value="'+v.discussId+'" />'+
											'<input class="yt-model-bot-btn yt-model-sure-btn talk-over-with-submit" type="button" value="提交" />'+
											'<input class="yt-model-bot-btn yt-model-canel-btn talk-over-with-cancel" type="button" value="取消" style="margin-left: 20px;" />'+
										'</div>';
										
								}else{//有审核意见，显示审核意见详情框，
									createUsername = ideaJsonArr[0].createUsername;
									details = ideaJsonArr[0].details;
									//洽谈审核意见详情
									var discuinfo = '<table style="width:100%;">'+
												'<tr>'+
													'<td colspan="2" style="height:30px;padding-bottom: 15px;">'+
														'<p style="width:82px;height:30px;line-height:30px;text-align:center; background-color: #5B66AB;color:#FFF;">审核意见</p>'+
													'</td>'+
												'</tr>'+
												'<tr>'+
													'<td style="height:35px;width:100px;text-align:right;line-heigth:35px;">审核人：</td>'+
													'<td class="create-username" style="text-align:left;">'+createUsername+'</td>'+
												'</tr>'+
												'<tr>'+
													'<td valign="top" style="width:100px;text-align:right;">审核意见：</td>'+
													'<td >'+
														'<p class="details-p" style="min-height:50px;">'+details+'</p>'+
													'</td>'+
												'</tr>'+
											'</table>';
								}
								
								var discussStates ="";
								if(v.discussStates == 1){
									discussStates = "咨询";
								}else if (v.discussStates == 2) {
									discussStates = "在谈";
								}else if (v.discussStates == 3) {
									discussStates = "意向";
								}else if (v.discussStates == 4) {
									discussStates = "方案";
								}else if (v.discussStates == 5) {
									discussStates = "调整";
								}else if (v.discussStates == 6) {
									discussStates = "签约";
								}else if (v.discussStates == 7) {
									discussStates = "咨询";
								}else{
									discussStates = "取消";
								}
								htmlIndex = '<div class="class-info-centent discuss-index">' +
									'<div class="class-info-title">' +
									'<div class="discuss-info-div">' +
									'<p class="steps-num"><span>' + num++ + '</span></p>' +
									'<div class="class-info-name">' +
									'<img class="discuss-steps" src="../../resources/images/icons/discuss-steps.png"> 洽谈详情' +
									'<div class="discuss-btn">'+deleEdit+'</div>' +
									'</div>' +
									'</div>' +
									'</div>' +
									'<table class="class-info-table">' +
									'<tr>' +
									'<td align="right" valign="top">' +
									'<span>洽谈状态：</span>' +
									'</td>' +
									'<td valign="top">' +
									'<p class="discuss-states" data-val="discussStates" style="width: 120px;">' + discussStates + '</p>' +
									'</td>' +
									'<td align="right" valign="top">' +
									'<span>洽谈日期：</span>' +
									'</td>' +
									'<td valign="top">' +
									'<p class="discuss-date" data-val="discussDate" style="width: 120px;">' + v.discussDate + '</p>' +
									'</td>' +
									'<td align="right" valign="top">' +
									'<span>联系人：</span>' +
									'</td>' +
									'<td valign="top">' +
									'<p class="linkman" data-val="linkman" style="width: 120px;">' + v.linkman + '</p>' +
									'</td>' +
									'<td align="right" valign="top">' +
									'<span>联系电话：</span>' +
									'</td>' +
									'<td valign="top">' +
									'<p class="phone" data-val="phone" style="width: 120px;">' + v.phone + '</p>' +
									'</td>' +
									'</tr>' +
									'<tr>' +
									'<td align="right" valign="top">' +
									'<span>洽谈内容：</span>' +
									'</td>' +
									'<td colspan="7" valign="top">' +
									'<p class="discussDetails" data-val="discussDetails" style="width:720px;height: auto;word-break: break-all;word-wrap: break-word">' + v.discussDetails + '</p>' +
									'</td>' +
									'</tr>' +
									'<tr>' +
									'<td valign="top">' +
									'<span class="offer-case">报价情况:</span>' +
									'</td>' +
									'</tr>' +
									'<tr>' +
									'<td align="right" valign="top">' +
									'<span>培训费：</span>' +
									'</td>' +
									'<td valign="top">' +
									'<p class="train-cost" data-val="trainCost" style="width: 120px;">' + v.trainCost + '</p>' +
									'</td>' +
									'<td align="right" valign="top">' +
									'<span>课程费：</span>' +
									'</td>' +
									'<td valign="top">' +
									'<p class="course-cost" data-val="courseCost" style="width: 120px;">' + v.courseCost + '</p>' +
									'</td>' +
									'<td align="right" valign="top">' +
									'<span>住宿费：</span>' +
									'</td>' +
									'<td valign="top">' +
									'<p class="stay-cost" data-val="stayCost" style="width: 120px;">' + v.stayCost + '</p>' +
									'</td>' +
									'<td align="right" valign="top">' +
									'<span>餐费：</span>' +
									'</td>' +
									'<td valign="top">' +
									'<p class="meal-cost" data-val="mealCost" style="width: 120px;">' + v.mealCost + '</p>' +
									'</td>' +
									'<td align="right" valign="top">' +
									'<span>其他费用：</span>' +
									'</td>' +
									'<td valign="top">' +
									'<p class="other-cost" data-val="otherCost" style="width: 120px;">' + v.otherCost + '</p>' +
									'</td>' +
									'</tr>' +
									'</table>' +
									'<div style="margin:10px 70px;border:1px solid #ECECEC;">'+discuinfo+'</div>'+
									'</div>';
								htmlDiscuss.append($(htmlIndex).data("discussData", v));
							});
						}
						$yt_baseElement.hideLoading();
					} else {
						$yt_alert_Model.prompt("获取失败");
						$yt_baseElement.hideLoading();
					}
				}
			});
		},
		//新增洽谈项目
		addDiscussList: function(discussId) {

			var projectId = $yt_common.GetQueryString('pkId');
			var discussStates = $(".alert-add-discuss .discuss-states").val();
			var discussDate = $(".alert-add-discuss .discuss-date").val();
			var linkman = $(".alert-add-discuss .linkman").val();
			var phone = $(".alert-add-discuss .phone").val();
			var discussDetails = $(".alert-add-discuss .discussDetails").val();
			var trainCost = $(".alert-add-discuss .train-cost").val();
			var courseCost = $(".alert-add-discuss .course-cost").val();
			var stayCost = $(".alert-add-discuss .stay-cost").val();
			var mealCost = $(".alert-add-discuss .meal-cost").val();
			var otherCost = $(".alert-add-discuss .other-cost").val();

			$.ajax({
				type: "post", //ajax访问方式 默认 "post"  
				url: $yt_option.base_path + "project/addOrUpdateDiscuss", //ajax访问路径  
				data: {
					projectId: projectId,
					discussId:discussId,
					discussStates: discussStates,
					discussDate: discussDate,
					linkman: linkman,
					phone: phone,
					discussDetails: discussDetails,
					trainCost: trainCost,
					courseCost: courseCost,
					stayCost: stayCost,
					mealCost: mealCost,
					otherCost: otherCost

				}, //ajax查询访问参数
				success: function(data) {
					if(data.flag == 0) {
						if(discussId==""){
							$yt_alert_Model.prompt("新增成功");
							projectDetailsList.getDiscussInf();
						}else{
							$yt_alert_Model.prompt("修改成功");
							projectDetailsList.getDiscussInf();
						}
						
						$(".yt-edit-alert").hide();
					} else {
						if(discussId==""){
							$yt_alert_Model.prompt("新增失败");
							projectDetailsList.getDiscussInf();
						}else{
							$yt_alert_Model.prompt("修改失败");
							projectDetailsList.getDiscussInf();
						}
					}
				}
			});
		},
		
		
		//删除洽谈记录
		delDiscussList: function(discussId) {
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
						url: $yt_option.base_path + "project/deleteDiscuss",
						data: {
							discussId: discussId
						},
						success: function(data) {
							if(data.flag == 0) {
								//洽谈记录编辑删除父标签
								var deleEditDiv = $('.discuss-box').children("div:last-child").find('.discuss-btn');
								//编辑删除按钮
								deleEdit ='<button class="yt-option-btn discuss-editor">编辑</button>' +
								'<button class="yt-option-btn discuss-del"><input type="hidden" value="' + discussId + '" class="discussId">删除</button>';
								//把编辑删除按钮添加到最后一条洽谈记录；
								deleEditDiv.append(deleEdit);
								$yt_alert_Model.prompt("删除成功");
								projectDetailsList.getDiscussInf();
							} else {
								$yt_alert_Model.prompt("不能删除");
							}

						}

					});

				}
			});
		},
		//洽谈记录弹出框  
		discussAdd: function() {
			/** 
			 * 显示编辑弹出框和显示顶部隐藏蒙层 
			 */
			$(".lawyer-opinion-box").show();
			/** 
			 * 调用算取div显示位置方法 
			 */
			$yt_alert_Model.getDivPosition($(".lawyer-opinion-box"));
			$yt_alert_Model.setFiexBoxHeight($(".alert-add-discuss form"));
			/* 
			 * 调用支持拖拽的方法 
			 */
			$yt_model_drag.modelDragEvent($(".lawyer-opinion-box .yt-edit-alert-title"));
			/** 
			 * 点击取消方法 
			 */
			$('.lawyer-opinion-box .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
				//隐藏页面中自定义的表单内容  
				$(".lawyer-opinion-box").hide();
				//隐藏蒙层  
				$("#pop-modle-alert").hide();
			});
		},
		//学员管理列表
		getStudentAdminList: function() {
			var selectParam = $(".selectParam").val();
			var projectCode = $yt_common.GetQueryString('projectCode');

			$yt_baseElement.showLoading();
			$('.student-admin-page').pageInfo({
				async: true,
				pageIndexs: 1,
				pageNum: 15, //每页显示条数  
				pageSize: 10, //显示...的规律  
				url: $yt_option.base_path + "class/trainee/getClassTraineeManager", //ajax访问路径  
				type: "post", //ajax访问方式 默认 "post"  
				data: {
					projectCode: projectCode,
					selectParam: selectParam,
					gender: "",
					nationId: "",
					sort: "groupId",
					orderType: "ASC"
				}, //ajax查询访问参数
				objName: 'data', //指获取数据的对象名称  
				success: function(data) {
					if(data.flag == 0) {
						var htmlTbody = $('.student-admin-tbody');
						var htmlTr = '';
						var num = 1;
						$(htmlTbody).empty();
						if(data.data.rows.length > 0) {
							$.each(data.data.rows, function(i, v) {
								if(v.gender == 1) {
									v.gender = "男"
								} else if(v.gender == 2) {
									v.gender = "女"
								}
								if(v.checkInState == 0) {
									v.checkInState = "未报到"
								} else if(v.checkInState == 1) {
									v.checkInState = "已报到"
								}
								if(v.reconciliationState == 0) {
									v.reconciliationState = "未入账"
								} else if(v.reconciliationState == 1) {
									v.reconciliationState = "已入账"
								}
								if(v.invoiceState == 0) {
									v.invoiceState = "未开票"
								} else if(v.invoiceState == 1) {
									v.invoiceState = "已开票"
								}
								htmlTr = '<tr>' +
									'<td>' + '<label class="check-label yt-checkbox select-elementary-checkbox"><input type="checkbox" name="test" class="student-admin-pkId" value="' + v.pkId + '"/></label>' + '</td>' +
									'<td><input type="hidden" class="trainee-id" value="' + v.traineeId + '"/>' + num++ + '</td>' +
									'<td><input type="hidden" class="project-code" value="' + v.projectCode + '"/><a style="color: #4169E1;" href="#" class="real-name-alert-details">' + v.realName + '</a></td>' +
									'<td>' + v.gender + '</td>' +
									'<td>' + v.nationName + '</td>' +
									'<td>' + v.phone + '</td>' +
									'<td>' + v.groupName + '</td>' +
									'<td>' + v.groupOrgName + '</td>' +
									'<td>' + v.deptPosition + '</td>' +
									'<td>' + v.invoiceType + '</td>' +
									'<td>' + v.checkInState + '</td>' +
									'<td>' + v.reconciliationState + '</td>' +
									'<td>' + v.invoiceState + '</td>' +
									'</tr>';
								$(".student-admin-page").show();
								htmlTbody.append($(htmlTr).data("legalData", v));
							});
						} else {
							$(".student-admin-page").hide();
							htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
								'<td colspan="13" align="center" style="border:0px;">' +
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
		//学员管理新增
		addStudentList: function() {
			$yt_baseElement.showLoading();
			var projectCode = $yt_common.GetQueryString('projectCode');
			var realName = $(".add-student .real-name").val();
			var gender = $(".add-student .gender").val();
			var nationId = $(".add-student .nation-id").val();
			var phone = $(".add-student .phone").val();
			var idType = $(".add-student .id-type").val();
			var idNumber = $(".add-student .id-number").val();
			var dateBirth = $(".add-student .date-birth").val();
			var groupId = $(".add-student .group-id-elementary").val();
			var orgId = $(".add-student .org-id").val();
			var orgType = $(".add-student .org-type").val();
			var deptName = $(".add-student .dept-name").val();
			var mailingAddress = $(".add-student .mailing-address").val();
			var postalCode = $(".add-student .postal-code").val();
			var telephoneProject = $(".add-student .telephone-project").val();
			var fax = $(".add-student .fax").val();
			var email = $(".add-student .email").val();
			var partyDate = $(".add-student .party-date").val();
			var workTime = $(".add-student .work-time").val();
			var educationTime = $(".add-student .education-time").val();
			var educationTimeClass = $(".add-student .education-time-class").val();
			var serviceTime = $(".add-student .service-time").val();
			var serviceTimeClass = $(".add-student .service-time-class").val();
			var linkman = $(".add-student .linkman").val();
			var linkmanPhone = $(".add-student .linkman-phone").val();
			var linkmanTelephone = $(".add-student .linkman-telephone").val();
			var linkmanFax = $(".add-student .linkman-fax").val();
			var linkmanEmail = $(".add-student .linkman-email").val();
			var linkmanAddressEmail = $(".add-student .linkman-address-email").val();

			$.ajax({
				type: "post", //ajax访问方式 默认 "post"  
				url: $yt_option.base_path + "class/trainee/addOrUpdateTrainee", //ajax访问路径  
				data: {
					traineeId:"",
					projectCode: projectCode,
					realName: realName,
					gender: gender,
					nationId: nationId,
					phone: phone,
					idType: idType,
					idNumber: idNumber,
					dateBirth: dateBirth,
					groupId: groupId,
					orgId: orgId,
					orgType: orgType,
					deptName: deptName,
					mailingAddress: mailingAddress,
					postalCode: postalCode,
					telephoneProject: telephoneProject,
					fax: fax,
					email: email,
					partyDate: partyDate,
					workTime: workTime,
					educationTime: educationTime,
					educationTimeClass: educationTimeClass,
					serviceTime: serviceTime,
					serviceTimeClass: serviceTimeClass,
					linkman: linkman,
					linkmanPhone: linkmanPhone,
					linkmanTelephone: linkmanTelephone,
					linkmanFax: linkmanFax,
					linkmanEmail: linkmanEmail,
					linkmanAddressEmail: linkmanAddressEmail,
					traineeId: "",
					groupNum: "",
					positionName: "",
					invoiceType: "",
					taxNumber: "",
					address: "",
					registeredBank: "",
					account: "",
					telephone: "",
					orgName: ""

				}, //ajax查询访问参数
				success: function(data) {
					if(data.flag == 0) {
						$yt_alert_Model.prompt("新增成功");
						$('.student-admin-page').pageInfo("refresh");
						$(".yt-edit-alert").hide();
						$yt_baseElement.hideLoading();
					} else {
						$yt_alert_Model.prompt("新增失败");
						$yt_baseElement.hideLoading();
					}
				}
			});
		},
		//获取一条数据
		getStudentInf: function() {
			var traineeId = $('.yt-table-active .trainee-id').val();
			var projectId = $yt_common.GetQueryString('pkId');
			$.ajax({
				type: "post", //ajax访问方式 默认 "post"  
				url: $yt_option.base_path + "class/trainee/getTraineeDetails", //ajax访问路径  
				data: {
					traineeId: traineeId,
					projectId: projectId
				}, //ajax查询访问参数
				success: function(data) {
					if(data.flag == 0) {
						$(".elementary-student-details").setDatas(data.data);
						$(".add-student").setDatas(data.data);
						//修改弹出窗设置值
						$("select.project-code").setSelectVal(data.data.projectCode);
						$("select.nation-id").setSelectVal(String(data.data.nationId));
						$("select.project-states").setSelectVal(data.data.idType);
						$("select.group-id-elementary").setSelectVal(data.data.groupId);
						$("select.org-id").setSelectVal(String(data.data.groupOrgId));
						$("select.org-type").setSelectVal(data.data.orgType);
						if(data.data.gender == "1") {
							$("#radio1").setRadioState("check");  
						} else if(data.data.gender == "2") {
							$("#radio2").setRadioState("check");  
						};
						if($("span.gender").text() == "1") {
							$("span.gender").text("男");
						} else if($("span.gender").text() == "2") {
							$("span.gender").text("女");
						};
						//获取民族
						var nationsList = projectDetailsList.getListSelectNations();
						if(nationsList != null) {
							$.each(nationsList, function(i, n) {
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
						var trainList = data.data.trainList;
						var htmlTbody = $(".train-list-tbody");
						var htmlTr = "";
						$.each(trainList, function(i, v) {
							htmlTr += '<tr>' +
								'<td class="project-code" style="text-align:center"><a style="color: #4169E1;" class="file-name">' + v.projectCode + '</td>' +
								'<td style="text-align:center">' + v.projectName + '</a></td>' +
								'<td class="project-head" style="text-align:center">' + v.startDate + '</td>' +
								'<td class="certificate-no" style="text-align:center">' + v.projectHead + '</td>' +
								'<td class="start-date" style="text-align:center">' + v.certificateNo + '</td>' +
								'</tr>';
						})
						htmlTbody.html(htmlTr);
					} else {
						$yt_alert_Model.prompt("获取失败");
					}
				}
			});
		},
		//选学学员查看详情弹出框
		elementaryStudentDetailsAlert: function() {
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
		},
		//学员管理修改
		amendStudentList: function() {
			var projectCode = $yt_common.GetQueryString('projectCode');
			var traineeId = $(".yt-table-active .trainee-id").val();
			var realName = $(".add-student .real-name").val();
			var gender = $(".add-student .gender").val();
			var nationId = $(".add-student .nation-id").val();
			var phone = $(".add-student .phone").val();
			var idType = $(".add-student .id-type").val();
			var idNumber = $(".add-student .id-number").val();
			var dateBirth = $(".add-student .date-birth").val();
			var groupId = $(".add-student .group-id-elementary").val();
			var orgId = $(".add-student .org-id").val();
			var orgType = $(".add-student .org-type").val();
			var deptName = $(".add-student .dept-name").val();
			var mailingAddress = $(".add-student .mailing-address").val();
			var postalCode = $(".add-student .postal-code").val();
			var telephoneProject = $(".add-student .telephone-project").val();
			var fax = $(".add-student .fax").val();
			var email = $(".add-student .email").val();
			var partyDate = $(".add-student .party-date").val();
			var workTime = $(".add-student .work-time").val();
			var educationTime = $(".add-student .education-time").val();
			var educationTimeClass = $(".add-student .education-time-class").val();
			var serviceTime = $(".add-student .service-time").val();
			var serviceTimeClass = $(".add-student .service-time-class").val();
			var linkman = $(".add-student .linkman").val();
			var linkmanPhone = $(".add-student .linkman-phone").val();
			var linkmanTelephone = $(".add-student .linkman-telephone").val();
			var linkmanFax = $(".add-student .linkman-fax").val();
			var linkmanEmail = $(".add-student .linkman-email").val();
			var linkmanAddressEmail = $(".add-student .linkman-address-email").val();

			$.ajax({
				type: "post", //ajax访问方式 默认 "post"  
				url: $yt_option.base_path + "class/trainee/addOrUpdateTrainee", //ajax访问路径  
				data: {
					traineeId:traineeId,
					projectCode: projectCode,
					realName: realName,
					gender: gender,
					nationId: nationId,
					phone: phone,
					idType: idType,
					idNumber: idNumber,
					dateBirth: dateBirth,
					groupId: groupId,
					orgId: orgId,
					orgType: orgType,
					deptName: deptName,
					mailingAddress: mailingAddress,
					postalCode: postalCode,
					telephoneProject: telephoneProject,
					fax: fax,
					email: email,
					partyDate: partyDate,
					workTime: workTime,
					educationTime: educationTime,
					educationTimeClass: educationTimeClass,
					serviceTime: serviceTime,
					serviceTimeClass: serviceTimeClass,
					linkman: linkman,
					linkmanPhone: linkmanPhone,
					linkmanTelephone: linkmanTelephone,
					linkmanFax: linkmanFax,
					linkmanEmail: linkmanEmail,
					linkmanAddressEmail: linkmanAddressEmail,
					traineeId: "",
					groupNum: "",
					positionName: "",
					invoiceType: "",
					taxNumber: "",
					address: "",
					registeredBank: "",
					account: "",
					telephone: "",
					orgName: ""

				}, //ajax查询访问参数
				success: function(data) {
					if(data.flag == 0) {
						$yt_alert_Model.prompt("修改成功");
						$('.student-admin-page').pageInfo("refresh");
						$(".yt-edit-alert").hide();
					} else {
						$yt_alert_Model.prompt("修改失败");
					}
				}
			});
		},
		//学员管理新增学员弹出框
		studentAdd: function() {
			/** 
			 * 显示编辑弹出框和显示顶部隐藏蒙层 
			 */
			$(".add-student").show();
			/** 
			 * 调用算取div显示位置方法 
			 */
			$yt_alert_Model.setFiexBoxHeight($(".add-student .alert-form"));
			$yt_alert_Model.getDivPosition($(".add-student"));
			/* 
			 * 调用支持拖拽的方法 
			 */
			$yt_model_drag.modelDragEvent($(".add-student .yt-edit-alert-title"));
			/** 
			 * 点击取消方法 
			 */
			$('.add-student .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
				//隐藏页面中自定义的表单内容  
				$(".add-student").hide();
				//隐藏蒙层  
				$("#pop-modle-alert").hide();
			});
		},
		//删除学员
		delStudentList: function() {
			var projectCode = $('.yt-table-active .project-code').val();
			var traineeIds = $('.yt-table-active .trainee-id').val();
			var projectId = $yt_common.GetQueryString('pkId');
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
						url: $yt_option.base_path + "class/trainee/deleteTrainee",
						data: {
							projectCode: projectCode,
							traineeIds: traineeIds
						},
						success: function(data) {
							if(data.flag == 0) {
								$yt_alert_Model.prompt("删除成功");
								$('.student-admin-page').pageInfo("refresh");
							} else {
								$yt_alert_Model.prompt("不能删除");
							}

						}

					});

				}
			});
		},
		//管理学员日志
		studentLog: function() {
			/** 
			 * 显示编辑弹出框和显示顶部隐藏蒙层 
			 */
			$(".student-log").show();
			/** 
			 * 调用算取div显示位置方法 
			 */
			$yt_alert_Model.setFiexBoxHeight($(".student-log .alert-form"));
			$yt_alert_Model.getDivPosition($(".student-log"));
			/* 
			 * 调用支持拖拽的方法 
			 */
			$yt_model_drag.modelDragEvent($(".student-log .yt-edit-alert-title"));
			/** 
			 * 点击取消方法 
			 */
			$('.student-log .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
				//隐藏页面中自定义的表单内容  
				$(".student-log").hide();
				//隐藏蒙层  
				$("#pop-modle-alert").hide();
			});
		},
		//批量导入学员
		batchStudentLead: function() {

			var projectCode = $yt_common.GetQueryString('pkId');
			var fileName = $(".template-file").val();
			var file = getFileName(fileName);

			function getFileName(o) {
				var pos = o.lastIndexOf("\\");
				return o.substring(pos + 1);
			}

			$.ajax({
				type: "post", //ajax访问方式 默认 "post"  
				url: $yt_option.base_path + "class/trainee/leadingTraineeByClass", //ajax访问路径  
				data: {
					projectCode: projectCode,
					file: file

				}, //ajax查询访问参数
				success: function(data) {
					if(data.flag == 0) {
						$yt_alert_Model.prompt("导入成功");
						$('.student-admin-page').pageInfo("refresh");
						$(".yt-edit-alert").hide();
					} else {
						$yt_alert_Model.prompt("导入失败");
					}
				}
			});
		},
		//批量导入学员弹出框
		studentLead: function() {
			/** 
			 * 显示编辑弹出框和显示顶部隐藏蒙层 
			 */
			$(".lead-student").show();
			/** 
			 * 调用算取div显示位置方法
			 */
			$yt_alert_Model.setFiexBoxHeight($(".lead-student .alert-form"));
			$yt_alert_Model.getDivPosition($(".lead-student"));
			/* 
			 * 调用支持拖拽的方法 
			 */
			$yt_model_drag.modelDragEvent($(".lead-student .yt-edit-alert-title"));
			/** 
			 * 点击取消方法 
			 */
			$('.lead-student .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
				//隐藏页面中自定义的表单内容  
				$(".lead-student").hide();
				//隐藏蒙层  
				$("#pop-modle-alert").hide();
			});
		},
		//获取单位标准以及个人标准
		getUnitCostInf: function() {
			$yt_baseElement.showLoading();
			var projectId = $yt_common.GetQueryString('pkId');
			$.ajax({
				url: $yt_option.base_path + "project/getProjectRates", //ajax访问路径  
				type: "post", //ajax访问方式 默认 "post"  
				data: {
					projectId: projectId
				}, //ajax查询访问参数
				objName: 'data', //指获取数据的对象名称  
				success: function(data) {
					if(data.flag == 0) {
						var htmlTbody = $('.charge-tbody');
						var htmlTr = '';
						var num = 1;
						//单位标准
						var groupRatesArr = $.parseJSON(data.data.groupRates);
						if(groupRatesArr.length > 0) {
							$.each(groupRatesArr, function(i, v) {
								$('.yt-tab-active .group-select').setSelectVal(v.groupId);
								$('.invoice-inf .invoiceModel').val(v.invoiceModel);
								$('.invoice-inf .orgName').val(v.orgName);
								$('.invoice-inf .taxNumber').val(v.taxNumber);
								$('.invoice-inf .address').val(v.address);
								$('.invoice-inf .telephone').val(v.telephone);
								$('.invoice-inf .registeredBank').val(v.registeredBank);
								$('.invoice-inf .account').val(v.account);
								htmlTr += '<tr>' +
									'<td><span style="margin-left:10px">' + num++ + '</span></td>' +
									'<td class="groupId">' +
									'<select class="yt-select group-select" style="width:200px" value="' + v.groupId + '">'+
									'<option value="' + v.groupId + '"selected>' + v.groupName + '</option>'+
									'</select>' +
									'</td>' +
									'<td><input class="yt-input trainingExpenseRackRate" value="' + v.trainingExpenseRackRate + '"  type="text"/></td>' +
									'<td><input class="yt-input traineeRackRate" value="' + v.traineeRackRate + '"  type="text"/></td>' +
									'<td><input class="yt-input quarterageRackRate" value="' + v.quarterageRackRate + '"  type="text"/></td>' +
									'<td><input class="yt-input mealFeeRackRate" value="' + v.mealFeeRackRate + '"  type="text"/></td>' +
									'<td><input class="yt-input trainingExpenseNegotiatedPrice" value="' + v.trainingExpenseNegotiatedPrice + '"  type="text"/></td>' +
									'<td><input class="yt-input traineeNegotiatedPrice" value="' + v.traineeNegotiatedPrice + '"  type="text"/></td>' +
									'<td><input class="yt-input quarterageNegotiatedPrice" value="' + v.quarterageNegotiatedPrice + '"  type="text"/></td>' +
									'<td><input class="yt-input mealFeeNegotiatedPrice" value="' + v.mealFeeNegotiatedPrice + '"  type="text"/></td>' +
									'<td align="center"><a href="#" class="editor-charge">编辑</a></td>' +
									'<td align="center">' +
									'<span style="text-align:center;">' +
									'<img src="../../resources/images/icons/cost-level.png" class="del-charge" alt="" />' +
									'</span>' +
									'</td>' +
									'</tr>';
								htmlTbody.html(htmlTr);
							});
							//获取集团名称
							var groupList = projectDetailsList.getListSelectGroup();
							if(groupList != null) {
								$.each(groupList, function(i, n) {
									$(".group-select").append('<option value="' + n.groupId + '">' + n.groupName + '</option>');
								});
							}
							//初始化单位名称下拉列表
							$(".group-select").niceSelect();
						}
						//个人标准
						var traineeRatesArr = $.parseJSON(data.data.traineeRates);
						if(traineeRatesArr != null) {
							$(".personal-standard").setDatas(traineeRatesArr);
						} else {

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
		//开票信息保存
		savebillingInf: function() {
			$yt_baseElement.showLoading();
			var projectId = $yt_common.GetQueryString('pkId');
			var groupId = $('.yt-tab-active .group-select').val();
			var invoiceModel = $('.invoice-inf .invoiceModel').val();
			var orgName = $('.invoice-inf .orgName').val();
			var taxNumber = $('.invoice-inf .taxNumber').val();
			var address = $('.invoice-inf .address').val();
			var telephone = $('.invoice-inf .telephone').val();
			var registeredBank = $('.invoice-inf .registeredBank').val();
			var account = $('.invoice-inf .account').val();

			$.ajax({
				type: "post", //ajax访问方式 默认 "post"  
				url: $yt_option.base_path + "project/updateProjectOrgInvoice", //ajax访问路径  
				data: {
					projectId: projectId,
					groupId: groupId,
					invoiceModel: invoiceModel,
					orgName: orgName,
					taxNumber: taxNumber,
					address: address,
					telephone: telephone,
					registeredBank: registeredBank,
					account: account,
					deliveryAddress: "",
					recipients: "",
					recipientsPhone: "",
					invoiceType: ""
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
		//开票信息弹出框
		billingInf: function() {
			/** 
			 * 显示编辑弹出框和显示顶部隐藏蒙层 
			 */
			$(".billing-inf-alert").show();
			/** 
			 * 调用算取div显示位置方法
			 */
			$yt_alert_Model.setFiexBoxHeight($(".billing-inf-alert .alert-form"));
			$yt_alert_Model.getDivPosition($(".billing-inf-alert"));
			/* 
			 * 调用支持拖拽的方法 
			 */
			$yt_model_drag.modelDragEvent($(".billing-inf-alert .yt-edit-alert-title"));
			/** 
			 * 点击取消方法 
			 */
			$('.billing-inf-alert .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
				//隐藏页面中自定义的表单内容  
				$(".billing-inf-alert").hide();
				//隐藏蒙层  
				$("#pop-modle-alert").hide();
			});
		},
		//收费标准保存
		saveChargeStandard: function() {
			$yt_baseElement.showLoading();
			var projectId = $yt_common.GetQueryString('pkId');
			var groupRates = "";
			var traineeRates = "";

			var groupRatesArr = [];
			$(".charge-tbody tr").each(function(i, n) {
				var projectId = $yt_common.GetQueryString('pkId');
				groupId = $(n).find(".groupId .group-select").val();
				trainingExpenseRackRate = $(n).find(".trainingExpenseRackRate").val();
				traineeRackRate = $(n).find(".traineeRackRate").val();
				quarterageRackRate = $(n).find(".quarterageRackRate").val();
				mealFeeRackRate = $(n).find(".mealFeeRackRate").val();
				trainingExpenseNegotiatedPrice = $(n).find(".trainingExpenseNegotiatedPrice").val();
				traineeNegotiatedPrice = $(n).find(".traineeNegotiatedPrice").val();
				quarterageNegotiatedPrice = $(n).find(".quarterageNegotiatedPrice").val();
				mealFeeNegotiatedPrice = $(n).find(".mealFeeNegotiatedPrice").val();
				var groupRatesList = {
					projectId: projectId,
					groupId:groupId,
					trainingExpenseRackRate: trainingExpenseRackRate,
					traineeRackRate: traineeRackRate,
					quarterageRackRate: quarterageRackRate,
					mealFeeRackRate: mealFeeRackRate,
					trainingExpenseNegotiatedPrice: trainingExpenseNegotiatedPrice,
					traineeNegotiatedPrice: traineeNegotiatedPrice,
					quarterageNegotiatedPrice: quarterageNegotiatedPrice,
					mealFeeNegotiatedPrice: mealFeeNegotiatedPrice,
					invoiceType: 0
				}
				groupRatesArr.push(groupRatesList);
			});
			var groupRates = JSON.stringify(groupRatesArr);

			var projectId = $yt_common.GetQueryString('pkId');
			var trainingExpenseRackRate = $(".personal-standard .training-expense-rack-rate").val();
			var traineeRackRate = $(".personal-standard .trainee-rack-rate").val();
			var quarterageRackRate = $(".personal-standard .quarterage-rack-rate").val();
			var mealFeeRackRate = $(".personal-standard .meal-fee-rack-rate").val();
			var trainingExpenseNegotiatedPrice = $(".personal-standard .training-expense-negotiated-price").val();
			var traineeNegotiatedPrice = $(".personal-standard .trainee-negotiated-price").val();
			var quarterageNegotiatedPrice = $(".personal-standard .quarterage-negotiated-price").val();
			var mealFeeNegotiatedPrice = $(".personal-standard .meal-fee-negotiated-price").val();
			var traineeRatesList = {
				projectId: projectId,
				trainingExpenseRackRate: trainingExpenseRackRate,
				traineeRackRate: traineeRackRate,
				quarterageRackRate: quarterageRackRate,
				mealFeeRackRate: mealFeeRackRate,
				trainingExpenseNegotiatedPrice: trainingExpenseNegotiatedPrice,
				traineeNegotiatedPrice: traineeNegotiatedPrice,
				quarterageNegotiatedPrice: quarterageNegotiatedPrice,
				mealFeeNegotiatedPrice: mealFeeNegotiatedPrice
			}
			var traineeRates = JSON.stringify(traineeRatesList);

			$.ajax({
				type: "post", //ajax访问方式 默认 "post"  
				url: $yt_option.base_path + "project/updateProjectRates", //ajax访问路径  
				data: {
					projectId: projectId,
					groupRates: groupRates,
					traineeRates: traineeRates
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
		//获取学员费用详情
		getStudentCostInf: function() {

			$yt_baseElement.showLoading();
			var projectId = $yt_common.GetQueryString('pkId');
			var selectParam = "";
			$.ajax({
				url: $yt_option.base_path + "project/getProjectRatesDetails", //ajax访问路径  
				type: "post", //ajax访问方式 默认 "post"  
				data: {
					projectId: projectId,
					selectParam: selectParam
				}, //ajax查询访问参数
				objName: 'data', //指获取数据的对象名称  
				success: function(data) {
					if(data.flag == 0) {
						var htmlTbody = $('.student-cost-tbody');
						var htmlTr = '';
						var num = 1;
						if(data.data.length > 0) {
							$.each(data.data, function(i, v) {
								htmlTr += '<tr>' +
									'<td>' + num++ + '</td>' +
									'<td><input type="hidden" value="'+v.traineeId+'" class="traineeId"/><span class=" traineeName" value="">' + v.traineeName + '</span></td>' +
									'<td><span class=" groupName" value=""><input type="hidden" value="'+v.groupId+'" class="groupId"/>' + v.groupName + '</span></td>' +
									'<td><input type="hidden" value="'+v.types+'" class="types"/><input class="yt-input trainingExpenseRackRate" value="' + v.trainingExpenseRackRate + '"  type="text"/></td>' +
									'<td><input class="yt-input traineeRackRate" value="' + v.traineeRackRate + '"  type="text"/></td>' +
									'<td><input class="yt-input quarterageRackRate" value="' + v.quarterageRackRate + '"  type="text"/></td>' +
									'<td><input class="yt-input mealFeeRackRate" value="' + v.mealFeeRackRate + '"  type="text"/></td>' +
									'<td><input class="yt-input trainingExpenseNegotiatedPrice" value="' + v.trainingExpenseNegotiatedPrice + '"  type="text"/></td>' +
									'<td><input class="yt-input traineeNegotiatedPrice" value="' + v.traineeNegotiatedPrice + '"  type="text"/></td>' +
									'<td><input class="yt-input quarterageNegotiatedPrice" value="' + v.quarterageNegotiatedPrice + '"  type="text"/></td>' +
									'<td><input class="yt-input mealFeeNegotiatedPrice" value="' + v.mealFeeNegotiatedPrice + '"  type="text"/></td>' +
									'</tr>';
							});
						} else {
							htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
								'<td colspan="10" align="center" style="border:0px;">' +
								'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
								'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
								'</div>' +
								'</td>' +
								'</tr>';
						}
						htmlTbody.html(htmlTr);
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
		//学员费用详情保存
		updateTraineeDetails: function() {
			$yt_baseElement.showLoading();
			var updateData = "";
			
			var updateDataArr = [];
			$(".student-cost-tbody tr").each(function(i, n) {
				var projectId = $yt_common.GetQueryString('pkId');
				traineeId = $(n).find(".traineeId").val();
				groupId = $(n).find(".groupId").val();
				types = $(n).find(".types").val();
				trainingExpenseRackRate = $(n).find(".trainingExpenseRackRate").val();
				traineeRackRate = $(n).find(".traineeRackRate").val();
				quarterageRackRate = $(n).find(".quarterageRackRate").val();
				mealFeeRackRate = $(n).find(".mealFeeRackRate").val();
				trainingExpenseNegotiatedPrice = $(n).find(".trainingExpenseNegotiatedPrice").val();
				traineeNegotiatedPrice = $(n).find(".traineeNegotiatedPrice").val();
				quarterageNegotiatedPrice = $(n).find(".quarterageNegotiatedPrice").val();
				mealFeeNegotiatedPrice = $(n).find(".mealFeeNegotiatedPrice").val();
				var groupRatesList = {
					projectId: projectId,
					types:types,
					groupId:groupId,
					traineeId:traineeId,
					trainingExpenseRackRate: trainingExpenseRackRate,
					traineeRackRate: traineeRackRate,
					quarterageRackRate: quarterageRackRate,
					mealFeeRackRate: mealFeeRackRate,
					trainingExpenseNegotiatedPrice: trainingExpenseNegotiatedPrice,
					traineeNegotiatedPrice: traineeNegotiatedPrice,
					quarterageNegotiatedPrice: quarterageNegotiatedPrice,
					mealFeeNegotiatedPrice: mealFeeNegotiatedPrice
				}
				updateDataArr.push(groupRatesList);
			});
			var updateData = JSON.stringify(updateDataArr);
			
			$.ajax({
				type: "post", //ajax访问方式 默认 "post"  
				url: $yt_option.base_path + "project/updateTraineeDetails", //ajax访问路径  
				data: {
					updateData:updateData
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
		//教学方案设计需求查询
		getTeachPlanDesignRequirements: function() {
			$yt_baseElement.showLoading();
			//登录人名
			var userRealName = $('.hid-user-real-name').val();
			//项目销售人名
			var projectSellName = $('.hid-project-sell-name').val();
			//项目主任名
			var projectHead = $('.hid-project-head-name').val();
			var projectId = $yt_common.GetQueryString('pkId');
			$.ajax({
				type: "post", //ajax访问方式 默认 "post"  
				url: $yt_option.base_path + "project/getTeachingScheme", //ajax访问路径  
				data: {
					projectId: projectId
				}, //ajax查询访问参数
				success: function(data) {
					if(data.flag == 0 && data.data != null) { //教学方案需求设计存在
						//隐藏教学方案需求设计提交按钮
						$('.demand-btn').hide();
						//隐藏教学方案需求填写框
						$('.teach-plan-table').hide();
						
						if(data.data.traineeLevel = 1){
							data.data.traineeLevel = "一级经理"
						}else if(data.data.traineeLevel = 2){
							data.data.traineeLevel = "二级经理"
						}else if(data.data.traineeLevel = 3){
							data.data.traineeLevel = "三级经理"
						}else if(data.data.traineeLevel = 4){
							data.data.traineeLevel = "其他"
						}
						if(data.data.estimatedTransactionPrice = 1){
							data.data.estimatedTransactionPrice = "较高"
						}else if(data.data.estimatedTransactionPrice = 2){
							data.data.estimatedTransactionPrice = "一般"
						}else if(data.data.estimatedTransactionPrice = 3){
							data.data.estimatedTransactionPrice = "较低"
						}
						if(data.data.schemeRequirement = 1){
							data.data.schemeRequirement = "方案设计思路"
						}else if(data.data.schemeRequirement = 2){
							data.data.schemeRequirement = "教学日程"
						}else if(data.data.schemeRequirement = 3){
							data.data.schemeRequirement = "师资简介"
						}
						//显示教学方案需求设计详情
						$('.teach-plan-table-info').show();
						
						//设计方案需求数据详情数据
						$('.trainee-level-info').text(data.data.traineeLevel);
						$('.estimated-transaction-price-info').text(data.data.estimatedTransactionPrice);
						$('.time-receipt-info').text(data.data.timeReceipt);
						$('.feedback-time-info').text(data.data.feedbackTime);
						$('.scheme-requirement-info').text(data.data.schemeRequirement);
						$('.linkman-info').text(data.data.linkman);
						$('.phone-info').text(data.data.phone);
						$('.ad-details-info').text(data.data.adDetails);
						var teachingsSchemeLevel = data.data.teachingsSchemeLevel;
						var tsl = "";
						if(teachingsSchemeLevel == "teachingSchemeDept") {
							tsl = "部门级别";
						} else if(teachingsSchemeLevel == "teachingSchemeExpert") {
							tsl = "专家组";
						} else {
							tsl = "院领导";
						}
						$('.teachings-scheme-level-info').text(tsl);

						//获取初稿
						var firstDraft;
						//获取终稿
						var teachingSchemeFile = JSON.parse(data.data.teachingSchemeFile);
						//--------------------------------------------------------------------------------------------------

						//判断当前登录人是否为当前项目的项目主任
						if(projectHead.indexOf(userRealName) == 0) { //是该项目的项目主任
							//判断初终稿是否存在
							if(teachingSchemeFile.length > 0) { //初终存在
								//判断是否有初稿
								if(teachingSchemeFile[0].fileType == 1) { //有初稿
									//显示初稿文件
									$('.first-draft').show();
									//隐藏初稿的上传下载按钮
									$('.first-draft-btn').hide();
									//隐藏初稿提交按钮
									$('.plan-btn-flirst').hide();
									//显示初稿
									var teacherUl = $(".file-id");
									var teacherLi = "";
									var fileIdsArr = $.parseJSON(data.data.teachingSchemeFile);
									if(fileIdsArr.length > 0) {
										$.each(fileIdsArr, function(i, v) {
											if(v.fileType == 1) {
												//上传时间
												$('.first-upload-time').text(v.createTimeString);

												teacherLi = '<p style="width:870px;height:40px;border:1px dashed #e6e6e6;line-height:40px;">' +
													'<input type="hidden" class="down-file-url" value="'+$yt_option.acl_path +'api/tAscPortraitInfo/download?isDownload=true&pkId=' + v.fileId + '">' +
													'<span class="file-name" style="margin-right: 50px;color:blue;cursor: pointer"><input type="hidden" class="file-span-id" value="' + v.pkId + '" >' + v.fileName + '</span>' +
													'<span class="del-file-p" style="float:right;cursor: pointer;display:none;"><img src="../../resources/images/icons/teach-plan-del.png" alt="" />删除</span>' +
													'<span class="down-load-file-index" style="float:right;cursor: pointer;"><img src="../../resources/images/icons/down-load-teach-plan.png" alt="" />下载</span>' +
													'<span style="float:right; display:none;"><img src="../../resources/images/icons/preview.png" alt="" />预览</span>' +
													'</p>';
												teacherUl.html(teacherLi);
											}
										});

									}
									//获取流程实例id
									$('.hid-process-instance-id-teach').val(data.data.processInstanceId);
									//获取审批流程
									var flowLogArr = $.parseJSON(data.data.flowLog);

									//判断是否有流程
									if(flowLogArr.length > 0) { //流程存在
										//---------------------------------------------------------------------------------------------------------------------------									

										//显示审批流程
										$('.approval-process-module').show();
										var deleteReasons = "";
										$.each(flowLogArr, function(i, n) {
											if(n.deleteReason == "completed") {
												deleteReasons = "同意";
											};
											if(n.deleteReason == "returnedSubmit") {
												deleteReasons = "退回到审批人";
											};
											if(n.deleteReason == "refusedToApproval") {
												deleteReasons = "拒绝";
											}
											tastName = n.taskName + deleteReasons;
											$('.tast-key-teach').val(flowLogArr[0].tastKey);
											//判断当前登录人是否为当前审批人
											if(userRealName == flowLogArr[0].userName) { //是当前登录人
												//如果i等于0是最后一步流程数据
												if(i == 0) {
													//满足条件隐藏下一步操作人下拉框
													if(n.tastKey == "activitiEndTask") { //显示审批功能
														//隐藏下一步操作人下拉框
														$('.next-operate-person-teach-tr').hide();
														if(n.deleteReason != "") { //审批结束
															$('.appro-btn-div').hide();
															//隐藏审批功能
															$('.last-step-div-teach').hide();
															//隐藏审批提交按钮功能
															$('.appro-btn-div').hide();
															middleStepHtml = '<div>' +
																'<div style="height: 150; ">' +
																'<div class="number-name-box">' +
																'<span class="number-box-span middle-step-order middle-a-index" >' + flowLogArr.length + '</span>' +
																'<span class="name-box-span middle-step-userName middle-a-index" >' + flowLogArr[0].userName + '</span>' +
																'<img src="../../resources/images/open/openFlow.png" class="order-img" />' +
																'</div>' +
																'</div>' +
																'<div class="middle-step-box-div">' +
																'<ul class="middle-step-box-ul">' +
																'<li style="height: 30px;">' +
																'<span  class="middle-step-taskName view-taskName-span"  style="float: left;">' + tastName + '</span>' +
																'</li>' +
																'<li class="view-time-li middle-step-commentTime" >' + flowLogArr[0].commentTime + '</li>' +
																'<li class="operate-view-box-li">' +
																'<div class="operate-view-title-li">操作意见：</div>' +
																'<div class="operate-view-text-li middle-step-comment">' + flowLogArr[0].comment + '</div>' +
																'</li>' +
																'</ul>' +
																'</div>' +
																'</div>';
															$('.last-step-add-teach').append(middleStepHtml);
														} else {//审批没结束
															//$('.next-operate-person-teach-tr').hide();
															$('.hid-tast-key').val(n.tastKey);
															//渲染审批步骤的数据
															//流程编号
															$('.last-step-order-teach').text(flowLogArr.length);
															//操作人名
															$('.last-step-operate-person-userName-teach').text(n.userName);
															//操作状态
															$('.last-step-operationState-teach').text(n.taskName);
															//停滞时间							
															$('.last-step-commentTime-teach').text(n.commentTime);
														}
													} else { //渲染审批步骤的数据
														$('.last-step-order-teach').text(flowLogArr.length);
														//操作人名
														$('.last-step-operate-person-userName-teach').text(n.userName);
														//操作状态
														$('.last-step-operationState-teach').text(n.taskName);
														//停滞时间							
														$('.last-step-commentTime-teach').text(n.commentTime);
													}
												};
											} else { //不是当前登录人
												$('.last-step-div-teach').hide();
												if(i == 0) {
													middleStepHtml = '<div>' +
														'<div style="height: 150; ">' +
														'<div class="number-name-box">' +
														'<span class="number-box-span middle-step-order middle-a-index" >' + flowLogArr.length + '</span>' +
														'<span class="name-box-span middle-step-userName middle-a-index" >' + flowLogArr[0].userName + '</span>' +
														'<img src="../../resources/images/open/openFlow.png" class="order-img" />' +
														'</div>' +
														'</div>' +
														'<div class="middle-step-box-div">' +
														'<ul class="middle-step-box-ul">' +
														'<li style="height: 30px;">' +
														'<span  class="middle-step-taskName view-taskName-span"  style="float: left;">' + tastName + '</span>' +
														'</li>' +
														'<li class="view-time-li middle-step-commentTime" >' + flowLogArr[0].commentTime + '</li>' +
														'<li class="operate-view-box-li">' +
														'<div class="operate-view-title-li">操作意见：</div>' +
														'<div class="operate-view-text-li middle-step-comment">' + flowLogArr[0].comment + '</div>' +
														'</li>' +
														'</ul>' +
														'</div>' +
														'</div>';
													$('.last-step-add-teach').append(middleStepHtml);
												}
											}

											//如果i等于length-1是流程的第一步
											if(i == flowLogArr.length - 1) {
												//流程编号
												$('.first-step-order-teach').text(1);
												//操作人名
												$('.first-step-operate-person-username-teach').text(n.userName);
												//当前审批节点名字
												$('.first-step-taskName-teach').text(tastName);
												//时间
												$('.first-step-commentTime-teach').text(n.commentTime);
												//审批意见
												//								$('.first-step-comment').text(n.comment);

											};
											
											//如果i不等于且不等于length-1，是流程的中间步骤
											if(i != 0 && i != flowLogArr.length - 1) {
												
												//流程序号
												var order = flowLogArr.length - i;
												middleStepHtml = '<div>' +
													'<div style="height: 150; ">' +
													'<div class="number-name-box">' +
													'<span class="number-box-span middle-step-order middle-a-index" >' + order + '</span>' +
													'<span class="name-box-span middle-step-userName middle-a-index" >' + n.userName + '</span>' +
													'<img src="../../resources/images/open/openFlow.png" class="order-img" />' +
													'</div>' +
													'</div>' +
													'<div class="middle-step-box-div">' +
													'<ul class="middle-step-box-ul">' +
													'<li style="height: 30px;">' +
													'<span  class="middle-step-taskName view-taskName-span"  style="float: left;">' + tastName + '</span>' +
													'</li>' +
													'<li class="view-time-li middle-step-commentTime" >' + n.commentTime + '</li>' +
													'<li class="operate-view-box-li">' +
													'<div class="operate-view-title-li">操作意见：</div>' +
													'<div class="operate-view-text-li middle-step-comment">' + n.comment + '</div>' +
													'</li>' +
													'</ul>' +
													'</div>' +
													'</div>';
												$('.last-step-add-teach').append(middleStepHtml);
											};
										});
										//----------------------------------------------------------------------------------------------------------------------------
										//判断流程是否结束
										if(flowLogArr[0].tastKey == "activitiEndTask" && flowLogArr[0].deleteReason != "") { //流程结束
											if(teachingSchemeFile.length > 1) { //存在终稿
												//显示终稿
												$('.last-draft').show();
												//隐藏终稿上传按钮
												$('.last-draft-btn').hide();
												//隐藏终稿提交按钮
												$('.plan-btn-last').hide();
												if(fileIdsArr.length > 0) {
													$.each(fileIdsArr, function(i, v) {
														$('.last-upload-time').text(v.createTimeString);
														if(v.fileType == 2) {
															teacherLi = '<p style="width:870px;height:40px;border:1px dashed #e6e6e6;line-height:40px;padding:0px 20px">' +
																'<input type="hidden" class="last-down-file-url" value="'+$yt_option.acl_path +'api/tAscPortraitInfo/download?isDownload=true&pkId=' + v.fileId + '">' +
																'<span class="file-name" style="margin-right: 50px;color:blue;cursor: pointer"><input type="hidden" class="file-span-id" value="' + v.pkId + '" >' + v.fileName + '</span>' +
																'<span class="del-file-p" style="float:right;cursor: pointer;display:none;"><img src="../../resources/images/icons/teach-plan-del.png" alt="" />删除</span>' +
																'<span class="last-down-load-file-index" style="float:right;cursor: pointer;"><img src="../../resources/images/icons/down-load-teach-plan.png" alt="" />下载</span>' +
																'<span style="float:right; display:none;"><img src="../../resources/images/icons/preview.png" alt="" />预览</span>' +
																'</p>';
															$('.last-file-id').html(teacherLi);
														}
													});
												}
											} else {
												//显示终稿上传功能
												$('.last-draft').show();
											}
										} //判断六尺是否结束时流程已经判断完，不需要再判断流程没结束情况
									} //已经判断初终稿存在，不会出现流程不存在情况
								} else { //没有初稿
									//显示初稿功能框
									$('.first-draft').show();
								}
							} else { //初终不存在
								//显示初稿功能框
								$('.first-draft').show();
							}
						} else { //当前登录人不是该项目的项目主任---------------------------------------------------
							$('.last-step-div-teach').hide();
							$('.appro-btn-div').hide();
							//判断初终稿是否存在
							if(teachingSchemeFile.length > 0) { //初终存在
								//判断是否有初稿
								if(teachingSchemeFile[0].fileType == 1) { //有初稿
									//显示初稿文件
									$('.first-draft').show();
									//隐藏初稿的上传下载按钮
									$('.first-draft-btn').hide();
									//隐藏初稿提交按钮
									$('.plan-btn-flirst').hide();
									//显示初稿
									var teacherUl = $(".file-id");
									var teacherLi = "";
									var fileIdsArr = $.parseJSON(data.data.teachingSchemeFile);
									if(fileIdsArr.length > 0) {
										$.each(fileIdsArr, function(i, v) {
											if(v.fileType == 1) {
												//上传时间
												$('.first-upload-time').text(v.createTimeString);

												teacherLi = '<p style="width:870px;height:40px;border:1px dashed #e6e6e6;line-height:40px;">' +
													'<input type="hidden" class="down-file-url" value="'+$yt_option.acl_path +'api/tAscPortraitInfo/download?isDownload=true&pkId=' + v.fileId + '">' +
													'<span class="file-name" style="margin-right: 50px;color:blue;cursor: pointer"><input type="hidden" class="file-span-id" value="' + v.pkId + '" >' + v.fileName + '</span>' +
													'<span class="del-file-p" style="float:right;cursor: pointer;display:none;"><img src="../../resources/images/icons/teach-plan-del.png" alt="" />删除</span>' +
													'<span class="down-load-file-index" style="float:right;cursor: pointer;"><img src="../../resources/images/icons/down-load-teach-plan.png" alt="" />下载</span>' +
													'<span style="float:right; display:none;"><img src="../../resources/images/icons/preview.png" alt="" />预览</span>' +
													'</p>';
												teacherUl.html(teacherLi);
											}
										});

									}
									var flowLogArr = $.parseJSON(data.data.flowLog);

									//判断是否有流程
									if(flowLogArr.length > 0) { //流程存在
										//显示审批流程
										$('.approval-process-module').show();
										var deleteReasons = "";
										$.each(flowLogArr, function(i, n) {
											if(n.deleteReason == "completed") {
												deleteReasons = "同意";
											};
											if(n.deleteReason == "returnedSubmit") {
												deleteReasons = "退回到审批人";
											};
											if(n.deleteReason == "refusedToApproval") {
												deleteReasons = "拒绝";
											}
											tastName = n.taskName + deleteReasons;
											if (i==0) {
												middleStepHtml = '<div>' +
													'<div style="height: 150; ">' +
													'<div class="number-name-box">' +
													'<span class="number-box-span middle-step-order middle-a-index" >' + flowLogArr.length + '</span>' +
													'<span class="name-box-span middle-step-userName middle-a-index" >' + n.userName + '</span>' +
													'<img src="../../resources/images/open/openFlow.png" class="order-img" />' +
													'</div>' +
													'</div>' +
													'<div class="middle-step-box-div">' +
													'<ul class="middle-step-box-ul">' +
													'<li style="height: 30px;">' +
													'<span  class="middle-step-taskName view-taskName-span"  style="float: left;">' + tastName + '</span>' +
													'</li>' +
													'<li class="view-time-li middle-step-commentTime" >' + n.commentTime + '</li>' +
													'<li class="operate-view-box-li">' +
													'<div class="operate-view-title-li">操作意见：</div>' +
													'<div class="operate-view-text-li middle-step-comment">' + n.comment + '</div>' +
													'</li>' +
													'</ul>' +
													'</div>' +
													'</div>';
												$('.last-step-add-teach').append(middleStepHtml);
											}
											//如果i等于length-1是流程的第一步
											if(i == flowLogArr.length - 1) {
												//流程编号
												$('.first-step-order-teach').text(1);
												//操作人名
												$('.first-step-operate-person-username-teach').text(n.userName);
												//当前审批节点名字
												$('.first-step-taskName-teach').text(tastName);
												//时间
												$('.first-step-commentTime-teach').text(n.commentTime);
												
											};
											//如果i不等于且不等于length-1，是流程的中间步骤
											if(i != 0 && i != flowLogArr.length - 1) {
												//流程序号
												var order = flowLogArr.length - i;
												middleStepHtml = '<div>' +
													'<div style="height: 150; ">' +
													'<div class="number-name-box">' +
													'<span class="number-box-span middle-step-order middle-a-index" >' + order + '</span>' +
													'<span class="name-box-span middle-step-userName middle-a-index" >' + n.userName + '</span>' +
													'<img src="../../resources/images/open/openFlow.png" class="order-img" />' +
													'</div>' +
													'</div>' +
													'<div class="middle-step-box-div">' +
													'<ul class="middle-step-box-ul">' +
													'<li style="height: 30px;">' +
													'<span  class="middle-step-taskName view-taskName-span"  style="float: left;">' + tastName + '</span>' +
													'</li>' +
													'<li class="view-time-li middle-step-commentTime" >' + n.commentTime + '</li>' +
													'<li class="operate-view-box-li">' +
													'<div class="operate-view-title-li">操作意见：</div>' +
													'<div class="operate-view-text-li middle-step-comment">' + n.comment + '</div>' +
													'</li>' +
													'</ul>' +
													'</div>' +
													'</div>';
												$('.last-step-add-teach').append(middleStepHtml);
											};
										});
										if(teachingSchemeFile.length > 1) { //存在终稿
											//显示终稿
											$('.last-draft').show();
											//隐藏终稿上传按钮
											$('.last-draft-btn').hide();
											//隐藏终稿提交按钮
											$('.plan-btn-last').hide();
											if(fileIdsArr.length > 0) {
												$.each(fileIdsArr, function(i, v) {
													$('.last-upload-time').text(v.createTimeString);
													if(v.fileType == 2) {
														teacherLi = '<p style="width:870px;height:40px;border:1px dashed #e6e6e6;line-height:40px;padding:0px 20px">' +
															'<input type="hidden" class="last-down-file-url" value="'+$yt_option.acl_path +'api/tAscPortraitInfo/download?isDownload=true&pkId=' + v.fileId + '">' +
															'<span class="file-name" style="margin-right: 50px;color:blue;cursor: pointer"><input type="hidden" class="file-span-id" value="' + v.pkId + '" >' + v.fileName + '</span>' +
															'<span class="del-file-p" style="float:right;cursor: pointer;display:none;"><img src="../../resources/images/icons/teach-plan-del.png" alt="" />删除</span>' +
															'<span class="last-down-load-file-index" style="float:right;cursor: pointer;"><img src="../../resources/images/icons/down-load-teach-plan.png" alt="" />下载</span>' +
															'<span style="float:right; display:none;"><img src="../../resources/images/icons/preview.png" alt="" />预览</span>' +
															'</p>';
														$('.last-file-id').html(teacherLi);
													}
												});
											}
										}
									}
								}
							}
						}
								$yt_baseElement.hideLoading();
					}else{ //教学方案设计需求不存在
						//登录人是否为当前项目销售人
						if(userRealName == projectSellName) { //是当前销售人
							//显示教学方案需求填写表单
							$('.teach-plan-table').show()
						}
						$yt_baseElement.hideLoading();
					}
				}		
			});
		},
					
					
					
					
					//教学方案设计需求保存&提交
					teachPlanDesignRequirements: function(dataStates) {
						var projectId = $yt_common.GetQueryString('pkId');
						var pkId = $(".teach-plan-table .pk-id").val();
						var traineeLevel = $(".trainee-level>input:checkbox:checked").val();
						var estimatedTransactionPrice = $(".teach-plan-table .estimated-transaction-price").val();
						var timeReceipt = $(".teach-plan-table .time-receipt").val();
						var feedbackTime = $(".teach-plan-table .feedback-time").val();
						var schemeRequirement = $('.scheme-requirement>input:checkbox:checked').val();
						var linkman = $(".teach-plan-table .linkman").val();
						var phone = $(".teach-plan-table .phone").val();
						var adDetails = $(".teach-plan-table .ad-details").val();
						var teachingsSchemeLevel = $(".teach-plan-table .teachings-scheme-level").val();

						$.ajax({
							type: "post", //ajax访问方式 默认 "post"  
							url: $yt_option.base_path + "project/addOrUpdateTeachingScheme", //ajax访问路径  
							data: {
								projectId: projectId,
								pkId: pkId,
								traineeLevel: traineeLevel,
								estimatedTransactionPrice: estimatedTransactionPrice,
								timeReceipt: timeReceipt,
								feedbackTime: feedbackTime,
								schemeRequirement: schemeRequirement,
								linkman: linkman,
								phone: phone,
								adDetails: adDetails,
								teachingsSchemeLevel: teachingsSchemeLevel,
								dataStates: dataStates

							}, //ajax查询访问参数
							success: function(data) {
								if(data.flag == 0) {
									if(dataStates == 0){
										$yt_alert_Model.prompt("保存成功");
									}else{
										$yt_alert_Model.prompt("提交成功");
										projectDetailsList.getTeachPlanDesignRequirements();
									}
								} else {
									if(dataStates == 0){
										$yt_alert_Model.prompt("保存失败");
									}else{
										$yt_alert_Model.prompt("提交失败");	
									}
								}
							}
						});
					},
					//项目主任首次操作时
					firstDraftByProjectDirector: function(fileType) {
						var projectId = $yt_common.GetQueryString('pkId');
						var businessCode = $(".teach-plan-table .teachings-scheme-level").val();
						var dealingWithPeople = $('.star-dealingWithPeople').val();
						var files = "";
						var filesArr = [];
						if(fileType == 1) { //初稿提交
							$(".file-id p").each(function(i, n) {
								fileName = $(n).find(".file-name").text();
								fileId = $(n).find(".file-name .file-span-id").val();
								var arrFile = {
									fileName: fileName,
									fileId: fileId
								}
								filesArr.push(arrFile);
							});
						} else {
							$(".last-file-id p").each(function(i, n) {
								fileName = $(n).find(".file-name").text();
								fileId = $(n).find(".file-name .file-span-id").val();
								var arrFile = {
									fileName: fileName,
									fileId: fileId
								}
								filesArr.push(arrFile);
							});
						}

						var files = JSON.stringify(filesArr);

						$.ajax({
							type: "post", //ajax访问方式 默认 "post"  
							url: $yt_option.base_path + "project/addOrUpdateTeachingSchemeFile", //ajax访问路径  
							data: {
								projectId: projectId,
								fileType: fileType,
								files: files,
								businessCode: businessCode,
								dealingWithPeople: dealingWithPeople,
								opintion: "",
								processInstanceId: "",
								nextCode: "submited"

							}, //ajax查询访问参数
							success: function(data) {
								if(data.flag == 0) {
									$yt_alert_Model.prompt("操作成功");
									window.location.href = "projectList.html";
								} else {
									$yt_alert_Model.prompt("操作失败");
								}
							}
						});
					}

				}
				$(function() {
					//初始化方法
					projectDetailsList.init();
				});