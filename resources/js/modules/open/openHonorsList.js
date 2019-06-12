var projectList = {
	//初始化方法
	init: function() {
		//调用获取列表数据方法
		projectList.getPlanListInfo();
		projectList.getAllClass();
		//点击新增开班式
		$('.add-class').off('click').on('click', function() {
			projectList.getAllClass();
			//初始化下拉框
			$(".project-code-edit").find(".add-op").remove();
			$("#txtDate").attr("placeholder","请选择开班时间");
			//标识当前弹窗为开班式
			$('#alert-type').val("开班式");
			//隐藏导出按钮
			$('.out-order').hide();
			//开班式标识
			$('#types').val(1);
			projectList.clearAlert();
			$('.offer-course-time').text("开班时间：");
			$(".main-title-span").text("新增开班式");
			$(".cal-title-p").text("开班式");
			$(".order-title-p").text("开班式会序");
			$(".file-title-p").text("开班式讲稿");
			$(".hid-pk-id").val('');
			$(".edt-approve").hide();
			$(".edit-approve-info").hide();
			projectList.addShowAlert();
			$yt_baseElement.showLoading();
			//调用获取下一步人函数
			projectList.getNextOperatePerson();
			$yt_baseElement.hideLoading();
		});

		//点击新增结业式
		$('.winding-up').off('click').on('click', function() {
			projectList.getAllClass();
			//初始化下拉框
			$(".project-code-edit").find(".add-op").remove();
			$("#txtDate").attr("placeholder","请选择结业时间");
			//标识当前弹窗为结业式
			$('#alert-type').val("结业式");
			//隐藏导出按钮
			$('.out-order').hide();
			//结业式标识
			$('#types').val(2);
			projectList.clearAlert();
			$('.offer-course-time').text("结业时间：");
			$(".main-title-span").text("新增结业式");
			$(".cal-title-p").text("结业式");
			$(".order-title-p").text("结业式会序");
			$(".file-title-p").text("结业式讲稿");
			$(".hid-pk-id").val('');
			$(".edt-approve").hide();
			$(".edit-approve-info").hide();
			projectList.addShowAlert();
			$yt_baseElement.showLoading();
			projectList.getNextOperatePerson();
			$yt_baseElement.hideLoading()
		});
		//初始化下拉列表
		$('select').niceSelect();

		/**
		 * 初始化日期控件
		 */
		$(".startTime").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			lowerLimit: "2010/01/01", // 日期下限，默认：NaN(不限制)     
			nowData: true, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd HH:mm",
			callback: function() {
				if ($(".star-date-input").val() != "") {
					$(".star-date-input").removeClass("valid-hint");
					$(".star-date-input").next(".valid-font").text("");
				}
			} // 点击选择日期后的回调函数
		});
//		$("select.projectName").blur(function(){//下拉框失去焦点
//			
//		});
		
		
		//点击下拉框选择班级获取项该班级的目主任名和学员数量
		$(".projectName").change(function() {
			//console.log($(this).val());
			//console.log($(this).find("option:selected").data("classData"));
			var classData = $(this).find("option:selected").data("classData");
			if(classData != undefined) {
				$('#project-user-name-edit').text(classData.projectUserName);
				$('#trainee-count-edit').text(classData.traineeCount);
			}

		});
		//班级字段验证
		$("select.projectName ").change(function() {
			var projectName = $("select.projectName ").val();
			if(projectName != "") {
				$("div.projectName ").removeClass("valid-hint");
				$("select.projectName ").siblings(".valid-font").text("")
			}
		});

		//调用拖拽排序函数
		projectList.reorder();
		//调用开班式会序删除函数
		projectList.addAlineDelTabRwo();
		//删除讲稿文件
		projectList.delFileTr();
		//上传文件
		$(".operate-file-box").undelegate().delegate("#addFile", "change", function() {
			$yt_baseElement.showLoading();
			var me = $(this);
			var addFile = $(this).attr("id");
			//切割文件路径获取文件名
			var fileName = $(this).val().split('\\');
			//获取到上传的文件名
			var fm = fileName[fileName.length - 1];
			var fileTypeLen = fm.split(".");
			var fileType = fileTypeLen[(fileTypeLen.length-1)];
			if (fileType == "docx" || fileType == "doc" || fileType == "xls" || fileType == "xlsx" || fileType == "pdf" || fileType == "xls" || fileType == "ppt" || fileType == "pptx") {//word文档类型，excel，pdf，ppt，
				var url = $yt_option.acl_path + "api/tAscPortraitInfo/addFile?modelCode=caFiles";
				$.ajaxFileUpload({
					url: url,
					type: "post",
					dataType: 'json',
					fileElementId: addFile,
					success: function(data, textStatus) {
						var resultData = $.parseJSON(data);
						var fileId = resultData.obj.pkId;
						if(resultData.success == 0) {
							$yt_baseElement.hideLoading(function() {
								$yt_alert_Model.prompt("附件上传成功");
								fileList = [resultData.obj.naming, fileId]
								//调用新增一行函数
								var num = $(".add-lecture-tb").children("tr").length + 1;
								projectList.addLineLecture(resultData.obj.naming, fileId, num);
								var fileAllTr = $(".add-lecture-tb tbody").children();
								fileAllTr.each(function(i, v) {
									i += 1;
									$(v).find(".fileLineNum").text(i);
								});
							});
	
						} else {
							$yt_baseElement.hideLoading(function() {
								$yt_alert_Model.prompt("附件上传失败");
							});
						}
						$("#" + addFile).val("");
					},
					error: function(data, status, e) { //服务器响应失败处理函数  
						$yt_baseElement.hideLoading(function() {
							$yt_alert_Model.prompt("附件上传失败!!!!");
							$("#" + addFile).val("");
						});
						
					}
				});
			}else{
				$yt_baseElement.hideLoading(function() {
					$yt_alert_Model.prompt("请上传doc,xls,pdf,ppt格式文件！",3000);
				});
			}

		});

		//下载演讲稿
		$('.add-lecture-tb,.only-look-lecture-tb').on('click', ".down-file", function() {
			var filePkId = $(this).parent().parent().find('.file-span-id').val();
			var fileURL = $(this).parent().parent().find('.fileURL').val();
			$.ajaxDownloadFile({
				url: fileURL
			});
		});

		//点击下载模板
		$('.operate-file-box').on('click', '.down-modle-file', function() {
			//调用下载模板函数
			projectList.downloadOrder();
		});
		//点击提交
		$('.submit-btn').off().click(function() {
			var orderTr = $(".add-order-tb tbody tr").length;
			var fileTr = $(".add-lecture-tb tbody tr").length;
			if (orderTr != 0 && fileTr != 0 ) {
				var lastTr = $(".add-order-tb tr:last-child");
				var details = lastTr.find(".details").val();
				var dateLength = lastTr.find(".dateLength ").val();
				if (details != "" && dateLength != "") {
					var processInstanceId = $('#processInstanceId').val();
					projectList.addClassInfo(2);
				} else{
					$('.tab-content').scrollTop($('.add-shuttle-box').height()/2);
					$yt_valid.validForm($(".valid-tab"));
					//$yt_alert_Model.prompt("会序不能为空！");
				}
				
			} else{
				if(orderTr == 0){
					$yt_alert_Model.prompt("请添加会序！");
				}else{
					if(fileTr == 0){
						$yt_alert_Model.prompt("请上传讲稿！");
					}
				}
				
			}
		});
		//点击保存
		$('#save').off().click(function() {
//			var orderTr = $(".add-order-tb tbody tr").length;
//			var fileTr = $(".add-lecture-tb tbody tr").length;
//			if (orderTr != 0 && fileTr != 0) {
//				var lastTr = $(".add-order-tb tr:last-child");
//				var details = lastTr.find(".details").val();
//				var dateLength = lastTr.find(".dateLength ").val();
//				if (details != "" && dateLength != "") {
//					var processInstanceId = $('#processInstanceId').val();
//					projectList.addClassInfo(1);
//				} else{
////					$.each($(".add-order-tb tbody tr"), function(i,n) {
////						if($(this).find(".details").val()==""||$(this).find(".dateLength").val()==""){
////							$(this).addClass('length-tr');
////						}else{
////							$(this).removeClass('length-tr');
////						}
////					});
//					//$('.tab-content').scrollTop($(".length-tr").eq(0).position().top);
//					$('.tab-content').scrollTop($('.add-shuttle-box').height()/2);
//					$yt_valid.validForm($(".valid-tab"));
////					$yt_alert_Model.prompt("会序不能为空！");
//				}
//			} else{
//				if(orderTr == 0){
//					$yt_alert_Model.prompt("请添加会序！");
//				}else{
//					if(fileTr == 0){
//						$yt_alert_Model.prompt("请上传讲稿！");
//					}
//				}
//			}
			projectList.addClassInfo(1);
		});
		//点击班级名称
		$('.list-table .yt-tbody').off('click').on('click', '.class-name', function() {
			projectList.clearAlert();
			var pkId = $(this).parents('tr').find(".pk-id").val();
			$(".hid-pk-id").val(pkId);
			//判断状态
			var states = $(this).parent().parent().find('.state').text();
			//获取types
			var types = $(this).parent().parent().find('.types').text();
			$('#types').val(types);
			$('#pkId').val(pkId);
			if(types == 1) {
				projectList.clearAlert();
				$(".main-title-span").text("开班式详情");
				$(".cal-title-p").text("开班式");
				$(".order-title-p").text("开班式会序");
				$(".file-title-p").text("开班式讲稿");

			};
			if(types == 2) {
				//标识当前弹窗为结业式
				projectList.clearAlert();
				$(".main-title-span").text("结业式详情");
				$(".cal-title-p").text("结业式");
				$(".order-title-p").text("结业式会序");
				$(".file-title-p").text("结业式讲稿");
			}

			//可修改
			if(states == "未通过" || states == "草稿") {
				//可编辑弹窗
				projectList.addShowAlert();
				//调用获取一条详细班级信息
				projectList.getOneListInfo(pkId, types);
			};

			//只可查看
			if(states == "已完成" || states == "审批中") {
				//调用仅查看函数
				projectList.getOnlyLookInfo(pkId, types);
				//只可查看弹窗
				projectList.onlyLookShowAlert();
			};
			projectList.getNextOperatePerson();
		});
//		$("#nextPeople").niceSelect();
		//新增会序
		$('.order-div-box').off().on('click', '.add-one-line', function() {
			var len = $(".add-order-tb tbody").children().length;
			if(len != 0) {
				var details = $(".add-order-tb tbody tr:last").find('.details').val();
				var dateLength = $(".add-order-tb tbody tr:last").find('.dateLength').val();
				if(details == "" || dateLength == "") {
//					$yt_valid.validForm($(".valid-tab"));
					projectList.addLineInfo();
				} else {
					projectList.addLineInfo();
				}
			} else {
				projectList.addLineInfo();
			}
			//输入框字段验证失去焦点
			//$(".add-order-tb").off().on("click",".vaild-input",function(){
			//		       $yt_valid.validForm($(".valid-tab"));  class-info
			//		    });
			projectList.addAlineDelTabRwo();
		});

		$('.key-word').off().on('click', '.search-btn', function() {
			//调用获取列表数据方法查询
			projectList.getPlanListInfo();
			$('#keyword').val("");
		});

	},

	getAllClass:function(){
		//班级列表下拉框
		var classList = projectList.getClassLis();
		var userName = projectList.userInfo();
		if(classList != null) {
			var projectUserCode;
			var projectHeadmasterCode;
			var projectSell;
			var projectAid;
			$(".projectName").empty();
			$(".projectName").append($('<option value="">请选择</option>'));
			$.each(classList.data, function(i, n) {
				//项目主任code
				projectUserCode = n.projectUserCode;
				//班主任code
				projectHeadmasterCode = n.projectHeadmasterCode;
				//项目销售code
				projectSell = n.projectSell;
				//项目助理code
				projectAid = n.projectAid;
				//判断当前登录人是否为项目主任或班主任
				if(projectUserCode.indexOf(userName) != -1 || projectHeadmasterCode.indexOf(userName) != -1 || projectSell.indexOf(userName) != -1 || projectAid.indexOf(userName) != -1) {
					$(".projectName").append($('<option value="' + n.projectCode + '">' + n.className + '</option>').data("classData", n));
				};
			});
			$(".projectName").niceSelect();
		};
	},
	//初始化弹窗
	clearAlert: function() {
		$('#processInstanceId').val("");
		$('#businessCode').val("");
		//清空班级名
		$('#project-code-edit').setSelectVal("");
		//清空项目
		$('#project-user-name-edit').text("");
		//清空时间
		$('#txtDate').val("");
		//清空学员数量
		$('#trainee-count-edit').text("");
		//清空可修改会序列表
		$(".add-order-tb tbody").html("");
		//清空可修改讲稿列表
		$(".add-lecture-tb tbody").html("");

		//清空不可修改会序列表
		$(".only-look-order-tb tbody").html("");
		//清空不可修改讲稿列表
		$(".only-look-lecture-tb tbody").html("");

	},

	//点击保存提交新增数据
	addClassInfo: function(dataStates) {
		 $yt_valid.validForm($(".class-info"));  
		var pkId = $(".hid-pk-id").val();
		//是开班式还是结业式，1  开班式，2  结业式
		var operateType;
		//新增的开结业式类型
		var operateTypeText;
		//流程定义key
		var processInstanceId = $('#processInstanceId').val();
		var businessCode = "";
		//判断当前弹窗式开班式功能还是结业式功能
		var identifiers = $('#types').val();
		if(identifiers == 1) {
			operateType = 1;
			businessCode = "openHonorsStart";
		}
		if(identifiers == 2) {
			operateType = 2;
			businessCode = "openHonorsEnd";
		}
		//新增开结业式判断
		operateTypeText = $('.main-title-span').text();
		if(operateTypeText == "新增开班式") {
			operateType = 1;
			businessCode = "openHonorsStart";
		}
		if(operateTypeText == "新增结业式") {
			operateType = 2;
			businessCode = "openHonorsEnd";
		}

		//班级编号
		var projectCode = $('#project-code-edit').val();
		//开结业式时间
		var startTime = $('.startTime').val();

		//会序
		var orderListArr = [];
		//会序内容
		var details = "";
		//会序时长
		var dateLength = "";
		//会序调序
		var orderBy = "";
		//遍历会序表格获取每一行会序参数
		$(".add-order-tb tbody tr").each(function(i, n) {
			//会序序号
			orderBy = i + 1;
			details = $(n).find('.details').val();
			dateLength = $(n).find('.dateLength').val();
			var orderList = {
				details: details,
				dateLength: dateLength,
				orderBy: orderBy
			}
			orderListArr.push(orderList);
		});
		orderLen = $(".add-order-tb tbody tr")
		var orderListJson = JSON.stringify(orderListArr);
		//开班式讲稿
		var fileListArr = [];
		//附件id
		var fileId = "";
		//附件名
		var fileName = "";
		//附件类型，1  图片，2  其他附件
		var types = "";
		var fileListArr = [];
		//获取所有上传的讲稿  
		var fileTr = $(".add-lecture-tb tbody").children();
		fileTr.each(function(i, n) {
			fileId = $(n).find('.file-span-id').val();
			fileName = $(n).find('.fileName').text();
			var fileList = {
				fileId: fileId,
				fileName: fileName,
				types: 2
			}
			fileListArr.push(fileList);
		});
		var fileListJson = JSON.stringify(fileListArr);

		var opintion = "";
		//获取下一步操作人
		var dealingWithPeople = $('#nextPeople').val();
		if(projectCode != "" && startTime != "") {
			$yt_baseElement.showLoading();
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "class/openHonors/addOrUpdateBean",
				data: {
					pkId: pkId,
					types: operateType,
					projectCode: projectCode,
					startTime: startTime,
					orderList: orderListJson,
					fileList: fileListJson,
					//保存或提交
					dataStates: dataStates,
					//开班式或结业式
					businessCode: businessCode,
					//审批意见  可为空
					opintion: opintion,
					//下一步操作人  
					dealingWithPeople: dealingWithPeople,
					//操作流程代码   不能为空
					nextCode: "submited",
					//流程实例ID
					processInstanceId: processInstanceId
				},
				success: function(data) {
					if(data.flag == 0) {
						$yt_baseElement.hideLoading(function() {
							$(".yt-edit-alert,#heard-nav-bak").hide();
							$yt_alert_Model.prompt("操作成功");
						});
						//初始化讲稿列表
						$(".add-lecture-tb tbody").empty();
						projectList.init();
					} else {
						$yt_baseElement.hideLoading(function() {
							$yt_alert_Model.prompt("添加失败");
							$(".yt-edit-alert,#heard-nav-bak").hide();
						});
					}
				}
			});
		} else {
			$yt_valid.validForm($(".class-info"));
		}

	},

	//下一步操作人
	getNextOperatePerson: function() {
		$("#nextPeople").empty();
		var getAllNextPeople = projectList.getworkFlowOperate();
		if(getAllNextPeople != null) {
			$.each(getAllNextPeople, function(i, n) {
				$("#nextPeople").append('<option class="add-op" value="' + n.userCode + '">' + n.userName + '</option>');
			});
			$("#nextPeople").niceSelect();
		};
	},
	//请求下一步操作人接口
	getworkFlowOperate: function() {
		var businessCode;
		var types = $('#types').val();
		if(types == 1) {
			businessCode = "openHonorsStart";
		};
		if(types == 2) {
			businessCode = "openHonorsEnd";
		}
		var list;
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/workFlowOperate/getSubmitPageData",
			data: {
				businessCode: businessCode
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

	//下载模版
	downloadOrder: function() {
		//文件名
		var typeName = $('#alert-type').val();
		var fileName = "";
		//模板类型
		var type;
		if(typeName == "开班式") {
			type = 1;
			fileName = "开班式模板";
		};
		if(typeName == "结业式") {
			type = 2;
			fileName = "结业式模板";
		}
		$.ajaxDownloadFile({
			url: $yt_option.base_path + "class/openHonors/downloadOrder",
			data: {
				types: type
			}
		});
	},

	//开班讲稿式删除一行
	delFileTr: function() {
		//删除一行数据
		$(".add-lecture-tb").on('click', ".entry-del-icon", function() {
			var tr = $(this).parent().parent();
			var fileLineNum = $(this).parent().parent().find("span.fileLineNum").text();
			$("#pop-modle-alert").css("z-index", 103);
			$yt_alert_Model.alertOne({
				haveAlertIcon: false, //是否带有提示图标
				closeIconUrl: "", //关闭图标路径 
				leftBtnName: "确定", //左侧按钮名称,默认确定 
				rightBtnName: "取消", //右侧按钮名称,默认取消 
				alertMsg: "数据删除将无法恢复，确认删除吗？", //提示信息 
				confirmFunction: function() {
					tr.remove();
					var fileAllTr = $(".add-lecture-tb tbody").children();
					fileAllTr.each(function(i, v) {
						i += 1;
						$(v).find(".fileLineNum").text(i);
					});
					$("#pop-modle-alert").show().css("z-index", 100);
				},
				cancelFunction: function() {
					$("#pop-modle-alert").show().css("z-index", 100);
				}
			});
		});
	},

	//上传一一个文件新增一行
	addLineLecture: function(fileName, fileId, num) {
		
		var lineTrHtml = '<tr class="file-tr-border-style">' +
			'<input type="hidden" class="fileURL" value="'+$yt_option.acl_path +'api/tAscPortraitInfo/download?isDownload=true&pkId=' + fileId + '">' +
			'<td class="lecture-tds">【<span class="fileLineNum">' + num + '</span>】</td>' +
			'<td class="fileName"><input type="hidden" class="file-span-id" value="' + fileId + '" >' + fileName + '</td>' +
			'<td style="display:none;" class="lecture-tds"><img class="ioc-img" src="../../resources/images/open/yulan.png" /></td>' +
			'<td style="width: 40px; display:none;">预览</td>' +
			'<td class="lecture-tds" style="text-align:center;width:70px"><span style="cursor: pointer;" class="down-file"><img class="ioc-img" src="../../resources/images/open/xiazai2.png" />下载</span></td>' +
			'<td class="lecture-tds" style="text-align:center;width:170px"><span style="cursor: pointer;" class="entry-del-icon"><img class="ioc-img" src="../../resources/images/open/delete.png" />删除</span></td>' +

			'</tr>';
		$(".add-lecture-tb tbody").append(lineTrHtml);

	},

	//导出开结业式会序
	getOutOpenHonors: function() {
		//当前一条详细信息的pkId
		var pkId = $('#pkId').val();
		//当前详细信息是开班式还是结业式
		var type = $('#types').val();
		$.ajaxDownloadFile({
			url: $yt_option.base_path + "class/openHonors/exportOrder",
			data: {
				pkId: pkId,
				types: type
			}
		});
	},
	//开班式会序删除一行
	addAlineDelTabRwo: function() {
		//删除一行数据
		$(".add-order-tb").on('click', ".entry-del-icon", function() {
			var tr = $(this).parent().parent();
			$("#pop-modle-alert").css("z-index", 103);
			$yt_alert_Model.alertOne({
				haveAlertIcon: false, //是否带有提示图标
				closeIconUrl: "", //关闭图标路径 
				leftBtnName: "确定", //左侧按钮名称,默认确定 
				rightBtnName: "取消", //右侧按钮名称,默认取消 
				alertMsg: "数据删除将无法恢复，确认删除吗？", //提示信息 
				confirmFunction: function() {
					tr.remove();
					$("#pop-modle-alert").show().css("z-index", 100);
					var orderAllTr = $(".add-order-tb tbody").children();
					orderAllTr.each(function(i, v) {
						i += 1;
						$(v).find(".order-by").text(i)
					});
				},
				cancelFunction: function() {
					$("#pop-modle-alert").show().css("z-index", 100);
					//$(".add-shuttle-box").show();
				}

			});
		});
	},
	//排序
	reorder: function() {
		$('.add-order-tb').on('click','.moveUp',function(){
			if($(this).css('opacity') != 0.2) {
				$(this).parents('tr').prev().before($(this).parents('tr').clone());
				$(this).parents('tr').remove();
				$.each($('.add-order-tb tbody tr'),function(i,n){
					$(n).find('.order-by').text(i+1);
				})
			}
		})
		$('.add-order-tb').on('click','.moveDown',function(){
			if($(this).css('opacity') != 0.2) {
				$(this).parents('tr').next().after($(this).parents('tr').clone());
				$(this).parents('tr').remove();
				$.each($('.add-order-tb tbody tr'),function(i,n){
					$(n).find('.order-by').text(i+1);
				})
			}
		})
	},

	//会序列表新增一行
	addLineInfo: function() {
		var num = $(".add-order-tb tbody").children().length + 1;
		var lineTrHtml = '<tr class="add-textList tr-border-style tr-td-padding" style="cursor: pointer;">' +
			'<td class="order-by" style="height:40px cursor: pointer;text-align:center;">' + num + '</td>' +
			'<td class="td-input" style="cursor: pointer;">' +
			'<input style="width: 587px; float: left;" type="text" class="yt-input vaild-input details" validform="{isNull:true,blurFlag:true,size:20,msg:\'请输入内容,不要超过20个字\'}"/>' +
			'<span class="valid-font z-style"></span>' +
			'</td>' +
			'<td  style="position: relative;cursor: pointer;">' +
			'<input style="margin-left: 20px;" type="text" class="yt-input vaild-input dateLength td-input-time" validform="{isNull:true,blurFlag:true,size:10,msg:\'请输入会序时长\'}"/> ' +
			'<span class="valid-font z-style"></span>' +
			'<p class="time-txt" style="float: left;margin: 4px;">' + '分钟' + '</p>' +
			'</td>' +
			'<td class="td-img" style="cursor: pointer;text-align: center;">' +
			'<img class="orderBy-dele-img img-size moveUp" style="margin-right:15px" src="../../resources/images/icons/moveUp.png"/>' +
			'<img class="orderBy-dele-img img-size moveDown" src="../../resources/images/icons/moveDown.png"/>' +
			'</td>' +
			'<td class="handle-td td-img" style="cursor: pointer;text-align: center;">' +
			'<span class="entry-del-icon" onclick="">' +
			'<img class="orderBy-dele-img img-size" src="../../resources/images/open/delete.png"/>' +
			'</span>' +
			'</td>' +
			'</tr>';

		$(".add-order-tb tbody").append(lineTrHtml);
		//点击新增一行后从初始化排序函数
		projectList.reorder();

	},
	/**
	 * 获取所有班级
	 */
	getClassLis: function() {
		var list = [];
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/getClasslist",
			data: {
				searchParameters:"",
				types: '1',
				dataStates:"1",
				sort:"start_date",
				orderType:""
			},
			async: false,
			success: function(data) {
				list = data || [];

			}
		});
		return list;
	},
	//获取登录人信息
	userInfo: function() {
		var userName = "";
		$.ajax({
			async: false,
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "uniform/user/getUsersDetails", //ajax访问路径  
			data: {}, //ajax查询访问参数
			success: function(data) {
				userName = data.data.userName;
			}
		});
		return userName;
	},

	//新增修改弹窗
	addShowAlert: function() {
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$(".add-shuttle-box").show();
		/** 
		 * 调用算取div显示位置方法 
		 */
		$yt_alert_Model.getDivPosition($(".add-shuttle-box"));
		/* 
		 * 调用支持拖拽的方法 
		 */
		$yt_model_drag.modelDragEvent($(".add-shuttle-box .yt-edit-alert-title"));
		/** 
		 * 点击取消方法 
		 */
		$('.add-shuttle-box .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
			//隐藏页面中自定义的表单内容  
			$(".yt-edit-alert,#heard-nav-bak").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
		$('div.projectName').show();
		$('.projectNameSpan').text('');
	},

	//仅查看弹窗
	onlyLookShowAlert: function() {
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$(".only-look").show();
		/** 
		 * 调用算取div显示位置方法 
		 */
		$yt_alert_Model.getDivPosition($(".only-look"));
		/* 
		 * 调用支持拖拽的方法 
		 */
		$yt_model_drag.modelDragEvent($(".only-look .yt-edit-alert-title"));
		/** 
		 * 点击取消方法 
		 */
		$('.only-look .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
			//隐藏页面中自定义的表单内容  
			$(".yt-edit-alert,#heard-nav-bak").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
	},

	/** 
	 * 获取列表数据
	 * 
	 */
	getPlanListInfo: function() {
		
		var queryParams = $('#keyword').val();
		$('.page-info').pageInfo({
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "class/openHonors/lookForAll", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				searchParameters: queryParams
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			async:true,
			before:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.open-class-tbody');
					var htmlTr = '';
					var num = 1;
					var xuhao = 1;
					var states = "";
					var type = "";
					if(data.data.rows.length > 0) {
						$('.page-info').show();
						$.each(data.data.rows, function(i, v) {
							xuhao = i + 1;
							if(v.types == 1) {
								type = "开班式";
							}
							if(v.types == 2) {
								type = "结业式";
							}

							if(v.states == 1) {
								states = "未通过";
							}
							if(v.states == 2) {
								states = "已通过";
							}
							if(v.states == 3) {
								states = "草稿";
							}

							htmlTr += '<tr class="td-list">' +
								'<td class="types" style="display:none;"><input type="hidden" class="pk-id" value="' + v.pkId + '" />' + v.types + '</td>' +
								'<td style="text-align: center;">' + xuhao + '</td>' +
								'<td style="text-align:left;"><a style="color:#3c4687;" class="class-name">' + v.className + '</a></td>' +
								'<td style="text-align: center;">' + type + '</td>' +
								'<td class="userName">' + v.userName + '</td>' +
								'<td style="text-align: center;">' + v.startTimeString + '</td>' +
								'<td style="text-align: center;">' + v.createTimeString + '</td>' +
								'<td style="text-align: center;" class="state">' + v.states + '</td>' +
								'</tr>';
						});
					} else {
						$('.page-info').hide();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="7" align="center" style="border:0px;">' +
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

	//获取一条班级详细信息,添加到可修改弹窗
	getOneListInfo: function(pkId, types) {
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/openHonors/getBeanById",
			async: true,
			data: {
				pkId: pkId,
				types: types
			},
			objName: 'data',
			success: function(data) {
				if(data.flag == 0) {
					//班级名
					$('#project-code-edit').setSelectVal(data.data.projectCode);
					$('div.projectName').hide();
					$('.projectNameSpan').text(data.data.projectName);
					//项目主任
					$('#project-user-name-edit').text(data.data.projectUserName);
					//开班时间
					$('.star-date-input').val(data.data.startTime);
					//学员数量
					$('#trainee-count-edit').text(data.data.traineeCount);
					//流程id
					$('#processInstanceId').val(data.data.processInstanceId);
					//流程定义key
					$('#businessCode').val(data.data.businessCode);

					//会序
					//清空会序列表
					$(".add-order-tb tbody").empty();
					var orderList = data.data.orderList;
					$(".add-order-tb tbody").html("");
					var orderListObj = $.parseJSON(orderList);

					$.each(orderListObj, function(i, v) {
						var num = $(".add-order-tb tbody tr").length + 1;
						var lineTrHtml = '<tr class="add-textList tr-border-style tr-td-padding">' +
											'<td class="order-by "  style="cursor: pointer;text-align: center;"><input type="hidden" class="orderBy" value="' + v.orderBy + '"/>' + num + '</td>' +
											'<td class="td-input">' +
												'<input style="width: 587px; float: left;" type="text" class="yt-input details" value="' + v.details + '" validform="{isNull:true,size:20,msg:\'请输入内容,不要超过20个字\'}"/>' +
												'<span class="valid-font"></span>' +
											'</td>' +
											'<td  style="position: relative;">' +
												'<input type="text" style="margin-left: 20px;" class="yt-input dateLength td-input-time" value="' + v.dateLength + '" validform="{isNull:true,size:10,msg:\'请输入会序时长\'}"/> ' +
												'<span class="valid-font"></span>' +
												'<p class="time-txt" style="float: left;margin: 4px;">' + '分钟' + '</p>' +
											'</td>' +
											'<td class="td-img"  style="cursor: pointer;text-align: center;">' +
												'<img class="orderBy-dele-img img-size moveUp" style="margin-right:15px" src="../../resources/images/icons/moveUp.png"/>' +
												'<img class="orderBy-dele-img img-size moveDown" src="../../resources/images/icons/moveDown.png"/>' +
											'</td>' +
											'<td class="handle-td td-img"  style="cursor: pointer;text-align: center;">' +
												'<span class="entry-del-icon" onclick="">' +
												'<img class="orderBy-dele-img img-size" src="../../resources/images/open/delete.png"/>' +
												'</span>' +
											'</td>' +
										'</tr>';

						$(".add-order-tb tbody").append(lineTrHtml);

					});
					//讲稿
					var fileList = data.data.fileList;
					var fileListObj = $.parseJSON(fileList)
					$(".add-lecture-tb tbody").html("");
					$.each(fileListObj, function(i, v) {
						var num = $(".add-lecture-tb tbody tr").length + 1;
						var lineTrHtml = '<tr class="tr-border-style">' +
							'<input type="hidden" class="fileURL" value="'+$yt_option.acl_path +'api/tAscPortraitInfo/download?isDownload=true&pkId=' + v.fileId + '">' +
							'<td class="lecture-tds">【<span class="fileLineNum">' + num + '</span>】</td>' +
							'<td class="fileName"><input type="hidden" class="file-span-id" value="' + v.fileId + '" >' + v.fileName + '</td>' +
							'<td style="display:none;" class="lecture-tds"><img class="ioc-img" src="../../resources/images/open/yulan.png" /></td>' +
							'<td style="width: 40px; display:none;">预览</td>' +
							'<td class="lecture-tds" style="text-align:center;width:70px"><span style="cursor: pointer;" class="down-file"><img class="ioc-img" src="../../resources/images/open/xiazai2.png" />下载</span></td>' +
							'<td class="lecture-tds" style="text-align:center;width:170px"><span style="cursor: pointer;" class="entry-del-icon"><img class="ioc-img" src="../../resources/images/open/delete.png" />删除</span></td>' +

							'</tr>';

						$(".add-lecture-tb").append(lineTrHtml);
					});
					//初始化班级下拉列表
//					$(".projectName").niceSelect();
					
					
					//流程
					var flowLog = data.data.flowLog;
					if(flowLog != ""){
						$('.last-step').empty();
						$(".edt-approve").show();
						$(".edit-approve-info").show();
						var middleStepHtml;
						var length=flowLog.length;
						$.each(flowLog, function(i,v) {
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
							};
							//如果i不等于且不等于length-1，是流程的中间步骤
							if(i < length-1){					
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
																'<span  class="middle-step-taskName view-taskName-span"  style="float: left;">'+v.operationState+'</span>'+
															'</li>'+
															'<li class="view-time-li middle-step-commentTime" >'+v.commentTime+'</li>'+
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
					}
					$yt_baseElement.hideLoading()
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}
			}
		});
	},
	//仅查看班级详情
	getOnlyLookInfo: function(pkId, types) {
		
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/openHonors/getBeanById",
			async: false,
			data: {
				pkId: pkId,
				types: types
			},
			objName: 'data',
			success: function(data) {
				if(data.flag == 0) {
					//班级名
					$('#project-name-info').text(data.data.projectName);
					//项目主任
					$('#project-user-name-info').text(data.data.projectUserName);
					//召开时间
					$('#start-time-info').text(data.data.startTime);
					//学员数量
					$('#trainee-count-info').text(data.data.traineeCount);
					//提交时间
					$('#create-time-string-info').text(data.data.createTimeString);
					//提交人
					$('#create-user-info').text(data.data.createUserName);
					//会序列表
					var orderList = data.data.orderList;
					var orderListObj = $.parseJSON(orderList);
					$.each(orderListObj, function(i, v) {
						i = i + 1;
						var lineTrHtml = '<tr class="add-textList tr-border-style">' +
											'<td style="text-align:center;" class="order-by"> <input type="hidden" class="orderBy" value="' + v.orderBy + '"/>' + i + '</td>' +
											'<td class="td-input details">' + v.details + '</td>' +
											'<td style="text-align:right;" class="dateLength" style="padding-right:10px;"><span style="margin-right:5px">' + v.dateLength + '</span>' + "分钟" + '</td>' +
										'</tr>';

						$(".only-look-order-tb tbody").append(lineTrHtml);

					});
					//讲稿列表
					var fileList = data.data.fileList;
					var fileListObj = $.parseJSON(fileList)
					$.each(fileListObj, function(i, v) {
						i = i + 1;
						var lineTrHtml = '<tr class="file-tr-border-style">' +
							'<input type="hidden" class="fileURL" value="'+$yt_option.acl_path +'api/tAscPortraitInfo/download?isDownload=true&pkId=' + v.fileId + '">' +
							'<td class="lecture-tds">【<span class="fileLineNum">' + i + '</span>】</td>' +
							'<td class="fileName"><input type="hidden" class="file-span-id" value="' + v.fileId + '" >' + v.fileName + '</td>' +
							'<td style="display:none;" class="lecture-tds"><img class="ioc-img" src="../../resources/images/open/yulan.png" /></td>' +
							'<td style="width: 40px;display:none;">预览</td>' +
							'<td class="lecture-tds" style="text-align:center;width:70px"><span style="cursor: pointer;" class="down-file"><img class="ioc-img" src="../../resources/images/open/xiazai2.png" />下载</span></td>' +
							'</tr>';
						$(".only-look-lecture-tb").append(lineTrHtml);
					});
					
					//流程
					var flowLog = data.data.flowLog;
					if(flowLog != ""){
						$('.last-step').empty();
						var middleStepHtml;
						var length=flowLog.length;
						$.each(flowLog, function(i,v) {
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
							};
							//如果i不等于且不等于length-1，是流程的中间步骤
							if(i < length-1){
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
																'<span  class="middle-step-taskName view-taskName-span"  style="float: left;">'+v.operationState+'</span>'+
															'</li>'+
															'<li class="view-time-li middle-step-commentTime" >'+v.commentTime+'</li>'+
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
					}
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}
			}

		});
	}
};
$(function() {
	//初始化方法
	projectList.init();
});