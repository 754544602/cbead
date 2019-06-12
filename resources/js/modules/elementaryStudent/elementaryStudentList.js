var elementaryStudentList = {
	//初始化方法
	init: function() {
		$("select").niceSelect(); //下拉框刷新  

		//初始化日期控件
		$(".chose-year").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			lowerLimit: "NaN", // 日期下限，默认：NaN(不限制)     
			nowData: true, //默认选中当前时间,默认true  
			dateFmt: "yyyy",
			callback: function() { // 点击选择日期后的回调函数  
				elementaryStudentList.getElementaryStudentList();
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
			dateFmt: "yyyy-MM",
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
			dateFmt: "yyyy-MM",
			callback: function() { // 点击选择日期后的回调函数  
				//alert("您选择的日期是：" + $("#txtDate").val());  
			}
		});
		//点击新增
		$(".addList").on('click', function() {
			$(".elementary-student-title").text("新增学员");
			elementaryStudentList.addElementaryStudentAlert();
			$('#projectName').hide();
			$("select.org-id").empty();
			$("select.org-id").niceSelect();
			$(".yt-model-sure-btn").off().click(function() {
				if($yt_valid.validForm($('body')) && $("select.project-code").val() != "" && $(".group-id-elementary").val() != "" && $("select.org-id").val() != "") {
					elementaryStudentList.addElementaryStudentList('');
				} else {
					elementaryStudentList.pageToScroll($('body .valid-font'));
					$yt_alert_Model.prompt("请将必填项填写完整");
				}
			});
		});
		//获取班级下拉框
		var classList = elementaryStudentList.getListSelectClass();
		if(classList != null) {
			$.each(classList, function(i, n) {
				if(n.type == 3) {
					$("select.project-code").append('<option value="' + n.projectCode + '" className="' + n.className + '">' + n.projectCode+'  '+ n.className + '</option>');
				}
			});
		}
		$("select.project-code").niceSelect({  
		        search: true,  
		        backFunction: function(text) {  
		            //回调方法,可以执行模糊查询,也可自行添加操作  
		            $("select.project-code option").remove();  
		            if(text == "") {  
		                $("select.project-code").append('<option value="">请选择</option>');  
		            }  
		            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
		            $.each(classList, function(i, n) {  
						if(n.type == 3) {
			                if((n.projectCode+'  '+ n.className).indexOf(text) != -1) {  
								$("select.project-code").append('<option value="' + n.projectCode + '" className="' + n.className + '">' + n.projectCode+'  '+ n.className + '</option>');
			                }  
		                }  
		            });  
		        }  
		    });
		//获取民族
		var nationsList = elementaryStudentList.getListSelectNations();
		if(nationsList != null) {
			$.each(nationsList, function(i, n) {
				$("select.nation-id").append('<option value="' + n.nationId + '">' + n.nationName + '</option>');
			});
		}
		//获取集团名称
		$('.group-id-elementary-name').off().click(function(){
			$('.add-elementary-student').hide();
			elementaryStudentList.getGroupAlertList($(this),$(this).siblings('.group-id-elementary'),sureBack,canelBack);
			function sureBack(){
				$('.add-elementary-student').show();
				if($('.group-id-elementary-name').val() != '') {
					$('.group-id-elementary-name').removeClass('valid-hint');
					$('.group-id-elementary-name').siblings('.valid-font').text('');
				}
				var groupList = elementaryStudentList.getListSelectGroup("3", $('.group-id-elementary').val());
				if(groupList != null) {
					$("select.org-id").empty();
					$("select.org-id").append('<option value=" ">请选择</option>');
					$.each(groupList, function(i, n) {
						if(i != 0) {
							$("select.org-id").append('<option value="' + n.groupId + '">' + n.groupName + '</option>').data('types', n.types)
						}
					});
					$("select.org-id").niceSelect({  
				        search: true,  
				        backFunction: function(text) {  
				            //回调方法,可以执行模糊查询,也可自行添加操作  
				            $("select.org-id option").remove();  
				            if(text == "") {  
				                $("select.org-id").append('<option value="">请选择</option>');  
				            }  
				            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
				            $.each(groupList, function(i, n) {  
				                if(n.groupName.indexOf(text) != -1) {  
				                    $("select.org-id").append('<option value="' + n.groupId + '">' + n.groupName + '</option>').data('types', n.types);  
				                }  
				            });  
				        }  
				    });
					$("select.org-id").off().change(function() {
						if($(this).val() != '') {
							$("div.org-id").removeClass('valid-hint');
							$(this).siblings('.valid-font').text('');
						}
						$('.orgType').text($(this).data('types'));
					})
				}
			
			}
			function canelBack(){
				$('.add-elementary-student').show();
				$('#pop-modle-alert').show();
			}
		})

		//点击修改
		$(".updateList").on('click', function() {
			var checkLine = $(".elementary-tbody input[type=checkbox]:checked");
			if(checkLine.length == 0 || checkLine.length > 1) {
				$yt_alert_Model.prompt("请选选中一条记录进行修改！");
				return false;
			}
			var checkVal = checkLine.parent().parent().parent().find(".trainee-id").val();
			var checkProjectId = checkLine.parent().parent().parent().find(".project-id").val();
			//获取被选中行的详细信息
			elementaryStudentList.getStudentInf(checkVal,checkProjectId);
			//修改弹窗标题
			$(".elementary-student-title").text("修改学员");
			elementaryStudentList.addElementaryStudentAlert();
			$(".yt-model-sure-btn").off().click(function() {
				elementaryStudentList.addElementaryStudentList(checkVal);
			});
		});
		//点击姓名查看选学学员详情
		$(".elementary-tbody").on('click', '.real-name-alert-details', function() {
			//获取被选中行的详细信息
			var trainId = $(this).parent().parent().find(".trainee-id").val();
			var projectId = $(this).parent().parent().find(".project-id").val();
			elementaryStudentList.getStudentInf(trainId,projectId);
			elementaryStudentList.elementaryStudentDetailsAlert();
			$(".shut-down").click(function() {
				$(".elementary-student-details").hide();
			});
		});
		//点击删除
		$(".delList").on('click', function() {
			var pkId = "";
			var traineeArr = [];
			$('.elementary-tbody input[class="select-elementary-pkId"]:checked').each(function() {
				var treainJson = {
					projectCode:$(this).parent().parent().parent().find(".project-code").text(),
					traineeId:$(this).parent().parent().parent().find(".trainee-id").val()
				}
				traineeArr.push(treainJson);
			});
			var traineeJsonList = JSON.stringify(traineeArr);
			if($('.elementary-tbody input[class="select-elementary-pkId"]:checked').length == 0){
				$yt_alert_Model.prompt("请选中数据进行删除", 3000);
			}else{
				$yt_alert_Model.alertOne({
					haveAlertIcon: false, //是否带有提示图标
					closeIconUrl: "", //关闭图标路径 
					leftBtnName: "确定", //左侧按钮名称,默认确定 
					rightBtnName: "取消", //右侧按钮名称,默认取消 
					alertMsg: "数据删除将无法恢复，确认删除吗？", //提示信息 
					confirmFunction: function() {
						elementaryStudentList.delElementaryStudentList(traineeJsonList);
					}
				});
			}
		});
		//点击项目名称  查看详情
		$(".train-tbody").on('click', ".real-name-inf", function() {
			window.location.href = $yt_option.base_path + "website/view/project/projectDetails.html?pkId=" + $('.yt-table-active .pkId').val();
		});
		//选择班次代码    显示班级名称
		$("select.project-code").change(function() {
			var className = $("select.project-code option:selected").attr("className");
			$(".class-name").text(className);
			if($(this).val() != '') {
				$('div.project-code').removeClass('valid-hint');
				$(this).siblings('.valid-font').text('');
			}
		});
		//选学学员管理有效&无效
		$(".btn-effective").click(function() {
			var checkLine = $(".elementary-tbody input[type=checkbox]:checked");
			if(checkLine.length != 1) {
				$yt_alert_Model.prompt("请选中一条记录进行操作!");
				return false;
			}
			var remarks = "有效";
			elementaryStudentList.effectiveInvalidElementaryList(remarks);
		});
		$(".btn-invalid").click(function() {
			var checkLine = $(".elementary-tbody input[type=checkbox]:checked");
			if(checkLine.length != 1) {
				$yt_alert_Model.prompt("请选中一条记录进行操作!");
				return false;
			}
			var remarks = "无效";
			elementaryStudentList.effectiveInvalidElementaryList(remarks);
		});
		//点击导出
		$(".export-student-btn").on("click", function() {
			var selectParam = $('.selectParam').val();
			var years = $('.chose-year').val();
			var downUrl = $yt_option.base_path + "class/trainee/downloadTraineeByYear";
			$.ajaxDownloadFile({
				url: downUrl,
				data: {
					selectParam: selectParam,
					years: years,
					isDownload: true
				}
			});
		});
		//复选框
		//全选  
		$(".check-all").change(function() {
			//判断自己是否被选中  
			if($(this).parent().hasClass("check")) {
				//设置反选  
				$(this).parents("table").find("tbody input[type='checkbox']").setCheckBoxState("uncheck");
				$(".elementary-tbody").find("td").removeClass("yt-table-active");
			} else {
				//调用设置选中方法,全选  
				$(this).parents("table").find("tbody input[type='checkbox']").setCheckBoxState("check");
				$(".elementary-tbody").find("td").addClass("yt-table-active");
			}
		});

		//修改全选按钮状态
		$(".elementary-tbody").on("change", "input[type='checkbox']", function() {
			if($(this).parents("table").find("tbody input[type='checkbox']").length != $(this).parents("table").find("tbody input[type='checkbox']:checked").length) {
				$(this).parents("table").find(".check-all").setCheckBoxState("uncheck");
			} else {
				$(this).parents("table").find(".check-all").setCheckBoxState("check");
			}
		});
		//搜索关键字
		$('.search-btn').click(function() {
			//调用获取列表数据方法查询
			elementaryStudentList.getElementaryStudentList();
		});
		//调用获取列表数据方法
		elementaryStudentList.getElementaryStudentList();
		//批量导入
		$(".leading-in").undelegate().delegate("input", "change", function() {
			var me = $(this);
			var addFile = $(this).attr("id");
			//切割文件路径获取文件名
			var fileName = $(this).val().split('\\');
			//获取到上传的文件名
			var fm = fileName[fileName.length - 1];
		});
		//点击导入按钮
		$('.set-principal-btn').on('click', function() {
			$(".elementary-tbody").find("td").removeClass("yt-table-active");
			$(".check-all").setCheckBoxState("uncheck");
			$(".elementary-tbody").find("input[type='checkbox']").setCheckBoxState("uncheck");
			$('.batch-import-form .import-file-name').val('');
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
		//点击下载模板
		$('.batch-import-form .download-template').click(function() {
			var fileName = "选学学员列表";
			$.ajaxDownloadFile({
				url: $yt_option.base_path + "class/trainee/downloadTraineeByClassSelection",
				data: {
					fileName: fileName
				}
			});
		});
		//选择要导入的文件
		$(".leading-in").undelegate().delegate("input", "change", function() {
			var me = $(this);
			var addFile = $(this).attr("id");
			//切割文件路径获取文件名
			var fileName = $(this).val().split('\\');
			//获取到上传的文件名
			var fm = fileName[fileName.length - 1];
			$('.batch-import-form .import-file-name').val(fm);
		});
		//点击导入弹出框的导入按钮
		$('.batch-import-form .yt-model-sure-btn').off().on('click', function() {
			var projectCode = $('.list-table tbody input[type=checkbox]:checked').val();
			var addFile = 'fileName'; //是input标签类型为file的id名，通过
			var fm = $('.batch-import-form .import-file-name').val();
			var url = $yt_option.base_path + "class/trainee/leadingTraineeByClassSelection";
			if(fm == "") {
				$yt_alert_Model.prompt("请选择导入文件！");
			} else {
				$.ajaxFileUpload({
					url: url,
					type: "post",
					dataType: 'json',
					fileElementId: addFile,
					data: {
						projectCode: projectCode
					},
					success: function(data, textStatus) {
						if(data.flag==0){
							$yt_alert_Model.prompt(data.message);
							elementaryStudentList.getElementaryStudentList();
							$(".batch-import-form").hide();
						}else{
							$(".batch-import-form").hide();
						    $yt_alert_Model.alertOne({  
						        haveCloseIcon: true, //是否带有关闭图标  
						        leftBtnName: "关闭", //左侧按钮名称,默认确定  
						        cancelFunction: "", //取消按钮操作方法*/  
						        alertMsg: data.message, //提示信息  
						        cancelFunction: function() { //点击确定按钮执行方法  
						        	$("#pop-modle-alert").show();
						        	$(".batch-import-form").show();
						        },  
						    });  
						}
					},
					error: function(data, status, e) { //服务器响应失败处理函数  
						$(".batch-import-form").hide();
						    $yt_alert_Model.alertOne({  
						        haveCloseIcon: true, //是否带有关闭图标  
						        leftBtnName: "关闭", //左侧按钮名称,默认确定  
						        cancelFunction: "", //取消按钮操作方法*/  
						        alertMsg: data.message, //提示信息  
						        cancelFunction: function() { //点击确定按钮执行方法  
						        	$("#pop-modle-alert").show();
						        	$(".batch-import-form").show();
						        },  
						    });  
						$("#" + addFile).val("");
					}
				});
			}
		});
		//验证
		$('.add-elementary-student').on('change', '.nation-id', function() {
			if($(this).val() != '') {
				$('div.nation-id').removeClass('valid-hint');
				$(this).siblings('.valid-font').text('');
			}
		})

	},
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
	 * 获取所有集团,单位
	 */
	getListSelectGroup: function(isSelectGroup, groupId) {
		var list = [];
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/group/getGroups",
			data: {
				isSelectGroup: isSelectGroup,
				groupId: groupId
			},
			async: false,
			success: function(data) {
				list = data.data || [];
			}
		});
		return list;
	},
	//获取一条数据
	oldStudentData:{},
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
					if(data.data.workTime == "0000-00-00"){
						data.data.workTime="";
					}
					$(".elementary-student-details").setDatas(data.data);
					$(".add-elementary-student").setDatas(data.data);
					$('#projectName').text( $('select.project-code option:selected').text());
					$('div.project-code').hide();
					$('#projectName').show();
					//修改弹出窗设置值
					$("select.project-code").setSelectVal(data.data.projectCode);
					$("select.nation-id").setSelectVal(String(data.data.nationId));
					$("select.project-states").setSelectVal(data.data.idType);
					$(".group-id-elementary").val(data.data.groupId);
					me.oldStudentData = data.data; 
					me.oldStudentData.gender == 1?me.oldStudentData.genderVal='男':me.oldStudentData.genderVal='女';
					me.oldStudentData.nationName = $('select.nation-id option:selected').text();
					me.oldStudentData.idTypeName = $('select#project-states option:selected').text();
					me.oldStudentData.projectName = $('select.project-code option:selected').text().split('  ')[1];
					me.oldStudentData.groupName = $('.group-id-elementary-name').val();
					if(data.data.groupId==0||data.data.groupId==''||data.data.groupId==null){
						var groupList = [];
					}else{
						var groupList = elementaryStudentList.getListSelectGroup("3", $(".group-id-elementary").val());
					}
					if(groupList != null) {
						$("select.org-id").empty();
						$("select.org-id").append('<option value=" ">请选择</option>')
						$.each(groupList, function(i, n) {
								$("select.org-id").append('<option value="' + n.groupId + '">' + n.groupName + '</option>').data('types', n.types)
						});
						$("select.org-id").niceSelect({  
					        search: true,  
					        backFunction: function(text) {  
					            //回调方法,可以执行模糊查询,也可自行添加操作  
					            $("select.org-id option").remove();  
					            if(text == "") {  
					                $("select.org-id").append('<option value="">请选择</option>');  
					            }  
					            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
					            $.each(groupList, function(i, n) {  
					                if(n.groupName.indexOf(text) != -1) {  
					                    $("select.org-id").append('<option value="' + n.groupId + '">' + n.groupName + '</option>').data('types', n.types);  
					                }  
					            });  
					        }  
					    });
						$("select.org-id").setSelectVal(data.data.groupOrgId);
					}
					$('.orgType').text($("select.org-id").data('types'));
					me.oldStudentData.orgTypeVal = $("select.org-id").data('types');
					$("select.id-type").setSelectVal(data.data.idType);
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
					var nationsList = elementaryStudentList.getListSelectNations();
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
						recordHtml='<tr style="border:0px;background-color:#fff !important;" >' +
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
							'<td style="text-align:center" class="project-code"><span style="" class="file-name">' + v.projectCode + '</span></td>' +
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
	/**
	 * 选学学员管理获取班级
	 */
	getListSelectClass: function() {
		var list = [];
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/getClasslist",
			data: {
				searchParameters: "",
				types: '4',
				sort:"start_date",
				dataStates:1,
				projectType:'three'
			},
			async: false,
			success: function(data) {
				list = data.data || [];
			}
		});
		return list;
	},
	/**
	 * 选学学员管理获取民族
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
	/**
	 * 获取列表数据
	 */
	getElementaryStudentList: function() {
		$yt_baseElement.showLoading();
		var selectParam = $(".selectParam").val();
		var years = $(".chose-year").val();
		$('.elementary-page').pageInfo({
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "class/trainee/getClassTraineeByYear", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam: selectParam,
				years: years
			}, //ajax查询访问参数
			async:true,
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.list-table .elementary-tbody');
					var htmlTr = '';
					var num = 1;
					var dep;
					if(data.data.rows.length > 0) {
						$(htmlTbody).empty()
						$.each(data.data.rows, function(i, v) {
							if(v.deptPosition == null) {
								v.deptPosition = "";
							}
							if(v.types == 1) {
								v.types = "央企集团本部"
							} else if(v.types == 2) {
								v.types = "央企二级公司"
							} else if(v.types == 3) {
								v.types = "央企三级公司"
							} else if(v.types == 4) {
								v.types = "省属企业"
							} else if(v.types == 5) {
								v.types = "市属企业"
							} else if(v.types == 6) {
								v.types = "其他"
							}
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
							if(v.projectStates == 1) {
								v.projectStates = "未开始"
							} else if(v.projectStates == 2) {
								v.projectStates = "培训中"
							} else if(v.projectStates == 3) {
								v.projectStates = "未结项"
							} else if(v.projectStates == 4) {
								v.projectStates = "已结项"
							} else if(v.projectStates == 6) {
								v.projectStates = "未结项"
							}
							if(v.remarks == "") {
								v.remarks = "有效"
							}
							if( v.deptName!=""&&v.positionName!=""){
								dep=v.deptName+'/'+v.positionName;
							}else if(v.deptName!=""){
								dep=v.deptName;
							}else if(v.positionName!=""){
								dep=v.positionName;
							}else{
								dep="";
							}
							htmlTr = '<tr>' +
								'<td style="width:26px;position:relative;"><div style="position: absolute;z-index:100;top: 5px;width: 30px;height: 30px;opacity: 0;"></div>' + '<label style="margin-left:6px;" class="check-label yt-checkbox select-elementary-checkbox"><input type="checkbox" name="test" class="select-elementary-pkId" value="' + v.pkId + '"/></label>' + '</td>' +
								'<td><input type="hidden" class="trainee-id" value="' + v.traineeId + '"/>' + num++ + '</td>' +
								'<td class="project-code">' + v.projectCode + '</a></td>' +
								'<td style="word-wrap:break-word;text-align:center;"><a style="color: #3c4687;" href="#" class="real-name-alert-details">' + v.realName + '</a></td>' +
								'<td>' + v.gender + '</td>' +
								'<td style="text-align:left"><input type="hidden" class="project-id" value="' + v.projectId + '"/>' + v.groupName + '</td>' +
								'<td style="text-align:left">' + v.orgName + '</td>' +
								'<td>' + v.types + '</td>' +
								'<td style="text-align:left">' + dep + '</td>' +
								'<td style="text-align:center">' + v.remarks + '</td>' +
								'<td style="text-align:center">' + v.linkman + '</td>' +
								'<td>' + v.linkmanPhone + '</td>' +
								'<td>' + v.documentCode + '</td>' +
								'<td>' + v.checkInState + '</td>' +
								'<td>' + v.projectStates + '</td>' +
								'<td>' + v.traineeRemarks + '</td>' +
								'</tr>';
							$(".elementary-page").show();
							htmlTbody.append($(htmlTr).data("legalData", v));
						});
					} else {
						$(".elementary-page").hide();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="16" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						htmlTbody.html(htmlTr);
					}
					$yt_baseElement.hideLoading();
					//点击当前行选中当前行并且复选框被勾选
					$(".elementary-tbody tr").unbind().bind("click", function() {
						if($(this).find("input[type='checkbox']")[0].checked == true) {
							$(this).find("input[type='checkbox']").setCheckBoxState("uncheck");
							$(this).find("td").removeClass("yt-table-active");
						} else {
							$(this).find("input[type='checkbox']").setCheckBoxState("check");
							$(this).find("td").addClass("yt-table-active");
						}
						if($(".elementary-tbody input:checkbox").not("input:checked").length > 0){
							$(".check-all").setCheckBoxState("uncheck");
						}else{
							$(".check-all").setCheckBoxState("check");
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
	//新增选学学员
	addElementaryStudentList: function(traineeId) {
		var me = this;
		$yt_baseElement.showLoading();
		var afterJson = {
		  validFlag : $yt_valid.validForm($(".valid-tab")),
		  traineeId : traineeId,
		  groupName:$('.group-id-elementary-name').val(),
		  groupOrgName:$('select.org-id option:selected').text(),
		  nationName:$('select.nation-id option:selected').text(),
		  projectName:$('select.project-code option:selected').text().split('  ')[1],
		  idTypeName : $('select#project-states option:selected').text(),
		  projectCode : $(".add-elementary-student select.project-code").val(),
		  realName : $(".add-elementary-student .real-name").val(),
		  gender : $(".add-elementary-student input[type='radio']:checked").val(),
		  nationId : $(".add-elementary-student .nation-id").val(),
		  phone : $(".add-elementary-student .phone").val(),
		  idType : $(".add-elementary-student .id-type").val(),
		  idNumber : $(".add-elementary-student .id-number").val(),
		  dateBirth : $(".add-elementary-student .date-birth").val(),
		  groupId : $(".add-elementary-student .group-id-elementary").val(),
		  orgId : $(".add-elementary-student .org-id").val(),
		  orgTypeVal : $(".add-elementary-student .orgType").text(),
		  deptName : $(".add-elementary-student .dept-name").val(),
		  positionName : $(".add-elementary-student .position-name").val(),
		  mailingAddress : $(".add-elementary-student .mailing-address").val(),
		  postalCode : $(".add-elementary-student .postal-code").val(),
		  telephone : $(".add-elementary-student .telephone-project").val(),
		  fax : $(".add-elementary-student .fax").val(),
		  email : $(".add-elementary-student .email").val(),
		  partyDate : $(".add-elementary-student .party-date").val(),
		  workTime : $(".add-elementary-student .work-time").val(),
		  educationTime : $(".add-elementary-student .education-time").val(),
		  educationTimeClass : $(".add-elementary-student .education-time-class").val(),
		  serviceTime : $(".add-elementary-student .service-time").val(),
		  serviceTimeClass : $(".add-elementary-student .service-time-class").val(),
		  linkman : $(".add-elementary-student .linkman").val(),
		  linkmanPhone : $(".add-elementary-student .linkman-phone").val(),
		  linkmanTelephone : $(".add-elementary-student .linkman-telephone").val(),
		  linkmanFax : $(".add-elementary-student .linkman-fax").val(),
		  linkmanEmail : $(".add-elementary-student .linkman-email").val(),
		  linkmanAddressEmail : $(".add-elementary-student .linkman-address-email").val(),
		  traineeRemarks:$(".add-elementary-student .traineeRemarks").val()
		}
		//名称
		var jsonName={
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
				invoiceType:"开发票类型",
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
			}
			if(afterJson.gender == 1){
				afterJson.genderVal='男'
			}else if(afterJson.gender == 2){
				afterJson.genderVal='女'
			}
			var operationContent = '';
			if(traineeId!=''){
				operationContent = '修改操作：【'+me.oldStudentData.realName+'】，'+me.getLogInfo(jsonName,me.oldStudentData,afterJson);
			}
			if(me.getLogInfo(jsonName,me.oldStudentData,afterJson)=='；'){
				operationContent='';
			}
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "class/trainee/addOrUpdateTrainee", //ajax访问路径  
			data: {
				projectCode: afterJson.projectCode,
				realName: afterJson.realName,
				gender: afterJson.gender,
				nationId: afterJson.nationId,
				phone: afterJson.phone,
				idType: afterJson.idType,
				idNumber: afterJson.idNumber,
				dateBirth: afterJson.dateBirth,
				groupId: afterJson.groupId,
				orgId: afterJson.orgId,
				deptName: afterJson.deptName,
				positionName: afterJson.positionName,
				mailingAddress: afterJson.mailingAddress,
				postalCode: afterJson.postalCode,
				telephone: afterJson.telephone,
				fax: afterJson.fax,
				email: afterJson.email,
				partyDate: afterJson.partyDate,
				workTime: afterJson.workTime,
				educationTime: afterJson.educationTime,
				educationTimeClass: afterJson.educationTimeClass,
				serviceTime: afterJson.serviceTime,
				serviceTimeClass: afterJson.serviceTimeClass,
				linkman: afterJson.linkman,
				linkmanPhone: afterJson.linkmanPhone,
				linkmanTelephone: afterJson.linkmanTelephone,
				linkmanFax: afterJson.linkmanFax,
				linkmanEmail: afterJson.linkmanEmail,
				linkmanAddressEmail: afterJson.linkmanAddressEmail,
				traineeId: afterJson.traineeId,
				groupNum: me.oldStudentData.groupNum,
				invoiceType: me.oldStudentData.invoiceType,
				taxNumber: me.oldStudentData.taxNumber,
				address: me.oldStudentData.address,
				registeredBank: me.oldStudentData.registeredBank,
				account: me.oldStudentData.account,
				telephoneProject: me.oldStudentData.telephoneProject,
				orgName: me.oldStudentData.orgName,
				operationContent:operationContent,
				traineeRemarks:afterJson.traineeRemarks
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					$yt_baseElement.hideLoading();
					$yt_alert_Model.prompt("操作成功");
					$('.elementary-page').pageInfo("refresh");
					//					me.getElementaryStudentList()
					$(".yt-edit-alert").hide();
					elementaryStudentList.getElementaryStudentList();
				} else if(data.flag == 5) {
					$yt_baseElement.hideLoading();
					$yt_alert_Model.prompt(data.message);
					$(".yt-edit-alert").hide();
					elementaryStudentList.getElementaryStudentList();
				} else {
					$yt_baseElement.hideLoading();
					$yt_alert_Model.prompt("操作失败");
					$(".yt-edit-alert").hide();
				}
			}
		});
	},
	//新增,修改选学学员弹出框
	addElementaryStudentAlert: function() {
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$(".add-elementary-student").show();
		/** 
		 * 调用算取div显示位置方法 
		 */
		$yt_alert_Model.getDivPosition($(".add-elementary-student"));
		$yt_alert_Model.setFiexBoxHeight($(".add-elementary-student .alert-form"));
		/* 
		 * 调用支持拖拽的方法 
		 */
		$yt_model_drag.modelDragEvent($(".add-elementary-student .yt-edit-alert-title"));
		//清空
		elementaryStudentList.getEmpty();
		/** 
		 * 点击取消方法 
		 */
		$('.add-elementary-student .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
			//隐藏页面中自定义的表单内容  
			$(".add-elementary-student").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
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
	//删除选学学员
	delElementaryStudentList: function(traineeJsonList) {
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/trainee/deleteTraineeByProject",
			data: {
				traineeJsonList:traineeJsonList
			},
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt("删除成功");
					$('.elementary-page').pageInfo("refresh");
					elementaryStudentList.getElementaryStudentList();
				} else {
					$yt_alert_Model.prompt("不能删除");
				}

			}
		});
	},
	//选学学员管理有效&无效
	effectiveInvalidElementaryList: function(remarks) {
		var checkLine = $(".elementary-tbody input[type=checkbox]:checked");
		var traineeId = checkLine.parent().parent().parent().find(".trainee-id").val();
		var projectCode = checkLine.parent().parent().parent().find(".project-code").text();
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "class/trainee/updateClassTraineeRemarks", //ajax访问路径  
			data: {
				projectCode: projectCode,
				traineeId: traineeId,
				remarks: remarks
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt("操作成功");
					$('.elementary-page').pageInfo("refresh");
					elementaryStudentList.getElementaryStudentList();
				} else {
					$yt_alert_Model.prompt("操作失败");
				}
			}
		});
	},
	//清空
	getEmpty: function() {
		$("add-elementary-student select")
		$("select.project-code").setSelectVal("");
		$("select.nation-id").setSelectVal("");
		$("select.id-type").setSelectVal("");
		$(".group-id-elementary").val('');
		$(".group-id-elementary-name").val('');
		$(".receive-group-search").val('');
		$("select.org-id").setSelectVal("");
//		$("select.org-type").setSelectVal("");
		$('.orgType').text('');
		$("div.project-code").show();
		$('select.nation-id').niceSelect();
		$('.valid-hint').removeClass('valid-hint');
		$('.valid-font').text('');
		$("span.class-name").text("");
		//		$('.add-elementary-student select').setSelectVal("select");
		$('.add-elementary-student td>input').val("");
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
	}

}
$(function() {
	//初始化方法
	elementaryStudentList.init();

});