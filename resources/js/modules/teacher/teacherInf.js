var teacherList = {
	courseList:"",
	//初始化方法
	init: function() {
		//下拉框刷新 
		$("select").niceSelect();
		teacherList.tree();
		teacherList.selectNice();
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
				teacherList.teachCourseEvent();
				teacherList.getTeachCourseWareList();
			}
		});
		//隐藏input输入框
		$(".teacher-index-inf input").attr("disabled","disabled");
		
		//点击返回
		$(".btn-return").click(function(){
			if(window.parent.document.getElementById("teacherName")==null){
				window.location.href="teacherList.html?selectParam="+encodeURI(encodeURI($yt_common.GetQueryString("selectParam")))+'&pageNum='+$yt_common.GetQueryString("pageNum");
			}else{
				$(window.parent.document.getElementById("teacherName")).hide();
				$(window.parent.document.getElementsByTagName("body")).css('overflow','auto');
			}
//			
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
		//修改资料
		$('.amendDetail').off('click').click(function(){
			//判断是否有选中行
			$('.dollarsStandardHalfSpan').hide();
			$('.dollarsStandardHalf').show();
			$('.dollarsStandardOneSpan').hide()
			$('.dollarsStandardOne').show();
			teacherList.demandDetail();
			$.ajax({
				type:"post",
				url:$yt_option.base_path+"teacher/getTeacherHis",
				async:false,
				data:{
					teacherId:$yt_common.GetQueryString('pkId')
				},
				beforeSend:function(){
					$yt_baseElement.showLoading();
				},
				success:function(data){
					$yt_baseElement.hideLoading();
					//显示弹出框
					teacherList.demandDetailAlert();
					//点击弹出框确定按钮
					$('.alert-add-teacher .yt-model-sure-btn').off('click').on('click', function() {
						//调动修改方法  修改数据
						if($yt_valid.validForm($('.add-teacher-table-alert'))) {
//							if($('.icon-nopass').is(':hidden')){
//								;
//								//隐藏弹出框
//								$(".alert-add-teacher").hide();
//							}else{
//								$yt_alert_Model.prompt('该教师已存在');
//							}
							teacherList.getTeacherIsHave(teacherList.amendTeacherList)
						}
					});
					if(data.flag==2){
//						$yt_alert_Model.prompt("该教师已有审批记录，不可修改");
						$('.dollarsStandardHalfSpan').show();
						$('.dollarsStandardHalf').hide();
						$('.dollarsStandardOneSpan').show();
						$('.dollarsStandardOne').hide();
					}
				},error:function(){
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt("网络异常");
					});
					
				}
			});
		})
	},
	//初始化修改弹窗下拉列表
	selectNice:function(){
		$('#project-states').niceSelect();
		//获取考察人,中间联系人下拉列表
		var treeAllPersonal = teacherList.getTreeAllPersonnel();
		if(treeAllPersonal != null) {
			$.each(treeAllPersonal, function(i, n) {
				if(n.type == 3) {
					$("select.intermediate-user-code").append('<option value="' + n.textName + '">' + n.text + '</option>');
					$("select.inspecting-user-code").append('<option value="' + n.textName + '">' + n.text + '</option>');
				}
			});
		}
		$("select.inspecting-user-code").niceSelect({
	        search: true,  
	        backFunction: function(text) {
	            //回调方法,可以执行模糊查询,也可自行添加操作  
	            $("select.inspecting-user-code option").remove();  
	            if(text == "") {  
	                $("select.inspecting-user-code").append('<option value="">请选择</option>');  
	            }  
	            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
	            $.each(treeAllPersonal, function(i, n) {
	                if(n.text.indexOf(text) != -1) {
						if(n.type == 3) {
		                    $("select.inspecting-user-code").append('<option value="' + n.textName + '">' + n.text + '</option>');  
		           		 }    
					}
	            });  
	        }  
	    });
	    $("select.intermediate-user-code").niceSelect({
	        search: true,  
	        backFunction: function(text) {
	            //回调方法,可以执行模糊查询,也可自行添加操作  
	            $("select.intermediate-user-code option").remove();  
	            if(text == "") {  
	                $("select.intermediate-user-code").append('<option value="">请选择</option>');  
	            }  
	            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
	            $.each(treeAllPersonal, function(i, n) {  
	                if(n.text.indexOf(text) != -1) {
						if(n.type == 3) {
		                    $("select.intermediate-user-code").append('<option value="' + n.textName + '">' + n.text + '</option>');  
		           		 }    
					}
	            });  
	        }  
	    });
	    //输入半天课酬，一天课酬自动*2
		$('.dollarsStandardHalf').off().blur(function(){
			$('.dollarsStandardOne').val($yt_baseElement.fmMoney($(this).val()*2));
			$(this).val($yt_baseElement.fmMoney($(this).val()));
		}).focus(function(){
			$(this).val($yt_baseElement.rmoney($(this).val()));
		})
	    //输入半天课酬，一天课酬自动*2
		$('.dollarsStandardOne').off().blur(function(){
			$(this).val($yt_baseElement.fmMoney($(this).val()));
		}).focus(function(){
			$(this).val($yt_baseElement.rmoney($(this).val()));
		})
	    //附件上传
		$(".upload-td").off().undelegate().delegate("input[type='file']","change", function() {
			//$(".btn-file").next().text("");
			var addFile = $(this).attr("id");
			$yt_baseElement.showLoading();
			var url = $yt_option.acl_path + "api/tAscPortraitInfo/addFile?modelCode=caFile";
			$.ajaxFileUpload({
				url: url,
				type: "post",
				dataType: 'json',
				fileElementId: addFile,
				success: function(data, textStatus) {
					var resultData = $.parseJSON(data);
					if(resultData.success == 0) {
						$yt_alert_Model.prompt("附件上传成功");
						$(".file-id-alert").append('<li>' +
							'<span class="file-name" style="margin-right: 50px;color:blue;cursor: pointer"><input type="hidden" class="file-span-id" value="' + resultData.obj.pkId + '" >' + resultData.obj.naming + '</span><span class="cancal" style="cursor: pointer;">x</span>' +
							'</li>');

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
		$(".file-id-alert").on("click", "li .file-name", function() {
			var pkId = $(this).find(".file-span-id").val();
			var downUrl = $yt_option.acl_path + "api/tAscPortraitInfo/download";
			$.ajaxDownloadFile({
				url: downUrl,
				data: {
					pkId: pkId,
					isDownload: true
				}
			});
		});
		//删除附件
		$(".file-id-alert").on("click", "li .cancal", function() {
			$(this).parent().remove();
		});
	},
	//师资管理获取一条数据
	getTeacherInf: function() {
		$yt_baseElement.showLoading();
		var me = this;
		var pkId = $yt_common.GetQueryString('pkId');
			$.ajax({
				type: "post", //ajax访问方式 默认 "post"  
				url: $yt_option.base_path + "teacher/getBeanById", //ajax访问路径  
				data: {
					pkId:pkId
				}, //ajax查询访问参数
				success: function(data) {
					if(data.flag == 0){
						data.data.dollarsStandardOne = $yt_baseElement.fmMoney(data.data.dollarsStandardOne);
						data.data.dollarsStandardHalf = $yt_baseElement.fmMoney(data.data.dollarsStandardHalf);
						$(".teacher-index-inf").setDatas(data.data);
						$(".papersType").setSelectVal(data.data.papersType);
						if(data.data.gender==1){
							$(".gender").text("男");
						}else if(data.data.gender==2){
							$(".gender").text("女");
						}
						if(data.data.papersType==1){
							$(".papersType").text("身份证");
						}else if(data.data.papersType==2){
							$(".papersType").text("护照");
						}else if(data.data.papersType==3){
							$(".papersType").text("港澳通行证");
						}else if(data.data.papersType==4){
							$(".papersType").text("军官证");
						}else{
							$(".papersType").text("其他");
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
						me.oldTeacherData = data.data;
						var teacherUl = $(".file-id");
						var teacherLi = "";
						var fileIdsArr = $.parseJSON(data.data.fileIds);
						me.oldTeacherData.fileIdsName=[];
						if(fileIdsArr.length > 0) {
						$.each(fileIdsArr, function(i, v) {
							teacherLi += '<li>'+
											 '<span class="file-name" style="margin-right: 50px;color:blue;cursor: pointer">'+
												 '<input type="hidden" class="fileURL" value="'+$yt_option.acl_path +'api/tAscPortraitInfo/download?isDownload=true&pkId='+v.fileId+'">'+
												 '<input type="hidden" class="file-span-id" value="'+v.pkId+'" >'+v.fileName+
											 '</span>'+
										 '</li>';
								teacherUl.html(teacherLi);
							//修改前附件名
							me.oldTeacherData.fileIdsName.push(v.fileName);
						});
					} 
					me.oldTeacherData.fileIdsName = me.oldTeacherData.fileIdsName.join(',');
					var researchAreaArr = [];
					if(data.data.researchAreaData!='')
					data.data.researchAreaData = JSON.parse(data.data.researchAreaData);
					$.each(data.data.researchAreaData, function(a, b) {
						researchAreaArr.push(b.researchAreaName);
					})
					researchAreaArr = researchAreaArr.join(',');
					//专业领域
					me.oldTeacherData.researchAreaText = researchAreaArr;
					//考察人
					me.oldTeacherData.inspectingUserText = $('.alert-add-teacher select.inspecting-user-code option:selected').text();
					//中间联系人
					me.oldTeacherData.intermediateUserText = $('.alert-add-teacher select.intermediate-user-code option:selected').text();
					//证件类型
					me.oldTeacherData.papersTypeText = $('.alert-add-teacher select.papersTypeText option:selected').text();
					me.oldTeacherData.gender == 1?me.oldTeacherData.genderVal='男':me.oldTeacherData.genderVal='女';
					$('.changeRecord').tooltip({
							position: 'right',
							content: function() {
								var showBox='';
								$.each(data.data.dollarsStandardHis,function(i,n){
//									if(n.dataStates==1){
									showBox +='<div class="tip-box"><table class="tip-table"><tr><td class="tip-lable">变更时间：</td><td>'+n.updateTimeString+'</td></tr>' +
									'<tr><td class="tip-lable">课酬标准：</td><td>' + n.dollarsStandardHalfBefore + '元/半天</td></tr>' +
									'<tr><td class="tip-lable"></td><td>' + n.dollarsStandardOneBefore + '元/天</td></tr>' +
									'<tr><td class="tip-lable">审批状态：</td><td>' + n.workFlawState + '</td></tr></table></div>';
//									}else if(n.dataStates==2){
//									showBox +='<div class="tip-box"><table class="tip-table"><tr style="border-top: 1px dashed #ffffff;"><td class="tip-lable">变更时间：</td><td>'+n.updateTimeString+'</td></tr>' +
//									'<tr><td class="tip-lable">课酬标准：</td><td>' + n.dollarsStandardHalfBefore + '元/半天</td></tr>' +
//									'<tr><td class="tip-lable"></td><td>' + n.dollarsStandardOneBefore + '元/天</td></tr>' +
//									'<tr><td class="tip-lable">变更原因：</td><td>' + n.changeReason + '</td></tr>' +
//									'<tr><td class="tip-lable">审批状态：</td><td>' + n.workFlawState + '</td></tr></table></div>';
//									}
								})
								if(data.data.dollarsStandardHis.length==0){
									showBox +='<tr><td class="tip-lable">无变更记录</td></tr>'
								}
								showBox+='';
								return showBox;
							},
							onShow: function() {
								$(this).tooltip('tip').css({
									backgroundColor: '#666',
									borderColor: '#666',
									color:'#fff'
								});
							}
						})
					$yt_baseElement.hideLoading();
					}else{
						$yt_alert_Model.prompt("获取失败");
						$yt_baseElement.hideLoading();
					}
				}
			});
	},
	//修改资料详情
	demandDetail:function(){
		var data = this.oldTeacherData;
		$(".alert-add-teacher input:not(.gender)").val('');
		$(".alert-add-teacher textarea").val('');
		$('.alert-add-teacher .inspecting-user-code').val('');
		$('.alert-add-teacher .intermediate-user-code').val('');
		$(".alert-add-teacher").setDatas(data);
		var researchAreaArr = [];
		var researchAreapkId = [];
		$('.tree-div').find('input[type=checkbox]').setCheckBoxState('uncheck');
		$.each(data.researchAreaData, function(a, b) {
			researchAreaArr.push(b.researchAreaName);
			researchAreapkId.push(b.pkId);
			$.each(dtrees.treeDiv.aNodes,function(x,y){
				if(b.pkId==y.id){
					dtrees.treeDiv.setcc(x);
					dtrees.treeDiv.cc(x);
				}
			})
		})
		researchAreapkId = researchAreapkId.join(',');
		researchAreaArr = researchAreaArr.join(',');
		$('#textTree').data('pkId', researchAreapkId);
		$('#textTree').val(researchAreaArr).attr('title',researchAreaArr);
		var teacherUlAlert = $(".file-id-alert");
		var teacherLiAlert = "";
		var fileIdsArr = $.parseJSON(data.fileIds);
		if(fileIdsArr.length > 0) {
		$.each(fileIdsArr, function(i, v) {
			teacherLiAlert += '<li>' +
				'<span class="file-name" style="margin-right: 50px;color:blue;cursor: pointer"><input type="hidden" class="file-span-id" value="' + v.fileId + '" >' + v.fileName + '</span><span class="cancal" style="cursor: pointer;">x</span>' +
				'</li>';
			teacherUlAlert.html(teacherLiAlert);
			//修改前附件名
		});
		} 
		//性别
		$('.alert-add-teacher .gender#radio'+data.gender).setRadioState("check")
		//考察人
		$('.alert-add-teacher .inspecting-user-code,.alert-add-teacher .intermediate-user-code').setSelectVal('');
		$('.alert-add-teacher .inspecting-user-code').setSelectVal(data.inspectingUserCode);
		//中间联系人
		$('.alert-add-teacher .intermediate-user-code').setSelectVal(data.intermediateUserCode);
	},
	//获取专业领域
	tree:function(){
		//获取专业领域下拉列表
		var groupList = teacherList.getListSelectGroup();
		$('#textTree').off();
		$('#treeDiv').empty();
		$('#textTree').createTree({
			controlId: 'treeDiv', // 必选 弹出的树列表控件ID，默认: $(this).attr("id") + "Tree" 
			dataList: groupList, // 必选 对象数组 树列表数据 
			listConfig: { // 必选 树列表节点参数名称 设置为传入的数据对象参数名称 
				id: 'pkId', //参数ID 
				pid: 'parentId', //上一级ID 
				name: 'researchAreaName' //参数名称 
			},
			speed: 200, // 可选 下拉树列表显示速度 参数"slow","normal","fast"，或毫秒数值，默认：200 
			readonly: true, //可选 目标对象是否设为只读，默认：true 
			checked: true, //可选 是否显示多选框 默认：false 
			callback: {
				onCheckClick: getCheckNode//可选 点击复选框回调函数 
			},
			rootConfig: { //必选 设置根目录的 默认信息 
				id: 0, //根目录ID 
				pid: -1, // 根目录上一级ID 固定值为-1 
				name: "专业领域" //根目录名称 
			}
		});
		/** 
		 * 点击复选框触发事件 
		 * @param {Object} checkNode 选中的对象list 
		 */
		function getCheckNode(checkNode) {
			var check = '';
			var pkId = '';
			$.each(checkNode, function(i, n) {
					if(pkId==''){
						pkId+=n.id
						check += n.name;
					}else{
						check += ','+ n.name;
						pkId += ','+n.id;	
					}
			});
			$('#textTree').attr('title',check);
			$('#textTree').val(check);
			$('#textTree').data('pkId', pkId);
			
			if($('#textTree').val()!=''){
				$('#textTree').removeClass('valid-hint');
				$('#textTree').next('.valid-font').text('');
			}
		}
		/*
		 兼容IE*/
		$('#treeDiv a').off().click(function(){
//			if($(this).siblings('input')[0].checked){
//				$(this).siblings('input').setCheckBoxState('uncheck');
//			}else{
//				$(this).siblings('input').setCheckBoxState('check');
//			}
//			var checkNode = dtrees.treeDiv.getCheckedNodes();
//			/*清除根目录的数据*/
//			var checks = $.each(checkNode, function(i, m) {
//				dtrees.treeDiv.setcc(m.pid)
//				if(!!m.pid) {
//					if(m.pid == -1) {
//						checkNode.splice(i, 1);
//						return false;
//					}
//				}
//			});
//			
//				/*清除根目录的数据*/
//			getCheckNode(checkNode)
//			return false;
		});
		//调用生成滚动条方法
		$("#treeDiv").mCustomScrollbar({
			autoHideScrollbar:true,
			theme:"square"
		});
	},
	/**
	 * 师资管理列表获取专业领域
	 */
	getListSelectGroup: function() {
		var list = [];
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "teacher/getResearchArea",
			data: {

			},
			async: false,
			success: function(data) {
				list = data.data || [];
			}
		});
		$yt_baseElement.hideLoading();
		return list;
	},
	/**
	 * 获取树形结构所有人员
	 */
	getTreeAllPersonnel: function() {
		var list = [];
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/user/getUsers",
			data: {

			},
			async: false,
			success: function(data) {
				list = data.data || [];
			}
		});
		return list;
	},
	//获取一条数据
	oldTeacherData:{},
	//修改
	amendTeacherList: function() {
		
		var me = this;
		var pkId = $yt_common.GetQueryString('pkId');
		var afterJson = {
			realName : $(".alert-add-teacher .realName").val(),
			gender : $(".alert-add-teacher  input[type='radio']:checked").val(),
			researchArea : $('#textTree').data('pkId'),
			researchAreaText : $('#textTree').val(),
			org : $(".alert-add-teacher .org").val(),
			applyShift : $(".alert-add-teacher .applyShift").val(),
			title : $(".alert-add-teacher .title").val(),
			clerkPhone : $(".alert-add-teacher .clerkPhone").val(),
			papersType : $(".alert-add-teacher .papersType").val(),
			clerkWorkPhone : $(".alert-add-teacher .clerkWorkPhone").val(),
			papersNumber : $(".alert-add-teacher .papersNumber").val(),
			inspectingUserCode : $(".alert-add-teacher .inspecting-user-code").val(),
			phone : $(".alert-add-teacher .phone").val(),
			intermediateUserCode : $(".alert-add-teacher .intermediate-user-code").val(),
			workPhone : $(".alert-add-teacher .workPhone").val(),
			dollarsStandardHalf : $(".alert-add-teacher .dollarsStandardHalf").val(),
			dollarsStandardOne : $(".alert-add-teacher .dollarsStandardOne").val(),
			fax : $(".alert-add-teacher .fax").val(),
			email : $(".alert-add-teacher .email").val(),
			registeredBank : $(".alert-add-teacher .registeredBank").val(),
			orgAddress : $(".alert-add-teacher .orgAddress").val(),
			account : $(".alert-add-teacher .account").val(),
			teacherDetails : $(".alert-add-teacher .teacherDetails").val(),
			remarks : $(".alert-add-teacher .remarks").val(),
			tableValue: $(".alert-add-teacher .tableValue").val(),
			teacherEvaluate : $(".alert-add-teacher .teacherEva").val()
		}
		var fileIdsJsonArr = [];
		afterJson.fileIdsName=[]
		$(".file-id-alert li").each(function(i, n) {
			fileName = $(n).find(".file-name").text();
			fileId = $(n).find(".file-name .file-span-id").val();
			var fileIds = {
				fileName: fileName,
				fileId: fileId
			}
			afterJson.fileIdsName.push(fileName);
			fileIdsJsonArr.push(fileIds);
		});
		var fileIdsJson = JSON.stringify(fileIdsJsonArr);
		afterJson.fileIdsName = afterJson.fileIdsName.join(',');
		//考察人
		afterJson.inspectingUserText = $('.alert-add-teacher select.inspecting-user-code option:selected').text();
		//中间联系人
		afterJson.intermediateUserText = $('.alert-add-teacher select.intermediate-user-code option:selected').text();
		//证件类型
		afterJson.papersTypeText = $('.alert-add-teacher select.papersTypeText option:selected').text();
		if(afterJson.gender == 1){
			afterJson.genderVal='男'
		}else if(afterJson.gender == 2){
			afterJson.genderVal='女'
		}
		var logs = '修改操作：【'+me.oldTeacherData.realName+'】，'+me.getLogInfo(me.teacherLogsName,me.oldTeacherData,afterJson);
		if(me.getLogInfo(me.teacherLogsName,me.oldTeacherData,afterJson)=='；'){
			logs = '';
		}
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "teacher/addOrUpdateBean", //ajax访问路径  
			data: {
				pkId: pkId,
				realName: afterJson.realName,
				gender: afterJson.gender,
				researchArea: afterJson.researchArea,
				org: afterJson.org,
				applyShift: afterJson.applyShift,
				title: afterJson.title,
				isFormal:me.oldTeacherData.isFormal,
				clerkPhone: afterJson.clerkPhone,
				papersType: afterJson.papersType,
				clerkWorkPhone: afterJson.clerkWorkPhone,
				papersNumber: afterJson.papersNumber,
				inspectingUserCode: afterJson.inspectingUserCode,
				phone: afterJson.phone,
				intermediateUserCode: afterJson.intermediateUserCode,
				workPhone: afterJson.workPhone,
				dollarsStandardHalf: $yt_baseElement.rmoney(afterJson.dollarsStandardHalf),
				dollarsStandardOne: $yt_baseElement.rmoney(afterJson.dollarsStandardOne),
				fax: afterJson.fax,
				email: afterJson.email,
				registeredBank: afterJson.registeredBank,
				orgAddress: afterJson.orgAddress,
				account: afterJson.account,
				teacherDetails: afterJson.teacherDetails,
				fileIds: fileIdsJson,
				remarks: afterJson.remarks,
				tableValue:afterJson.tableValue,
				logs:logs,
		        teacherEvaluate : $(".alert-add-teacher .teacherEva").val()
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt("修改成功");
					teacherList.getTeacherInf();
				} else {
					$yt_alert_Model.prompt(data.message);
				}
				$yt_baseElement.hideLoading();
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
		$yt_baseElement.showLoading();
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
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.courses-tbody');
					var htmlTr = '';
					var num = 1;
					if(data.data.rows.length > 0) {
						$(htmlTbody).empty();
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
								'<td style="font-weight:bold;color:#c9c9c9;">'+ caozuo +'</td>'+
								'</tr>';
								htmlTbody.append($(htmlTr).data("courseData",v));
								
						});
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
	    demandDetailAlert:function(){
//		$(".file-id").empty();
//		$('.icon-pass').hide();
//		$('.icon-nopass').hide();
//		$('.valid-hint').removeClass('valid-hint');
//		$('.valid-font').text('');
//		$(".alert-add-teacher").find("input[type='text']").val("");
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$(".alert-add-teacher").show();
		/** 
		 * 调用算取div显示位置方法 
		 */
		$yt_alert_Model.getDivPosition($(".alert-add-teacher"));
		$yt_alert_Model.setFiexBoxHeight($(".alert-add-teacher form"));
		/* 
		 * 调用支持拖拽的方法 
		 */
		$yt_model_drag.modelDragEvent($(".alert-add-teacher .yt-edit-alert-title"));
		/** 
		 * 点击取消方法 
		 */
			$('.alert-add-teacher .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
				//隐藏页面中自定义的表单内容  
				$(".alert-add-teacher").hide();
				//隐藏蒙层  
				$("#pop-modle-alert").hide();
			});
	    },
	    //查询该教师是否存在
		getTeacherIsHave:function(backFun){
			var me = this;
			//隐藏弹出框
			$(".alert-add-teacher").hide();
			$.ajax({
				type:"post",
				url:$yt_option.base_path+"teacher/getTeacherIsHave",
				async:true,
				data:{
					pkId:$yt_common.GetQueryString('pkId'),
					realName:$('.alert-add-teacher .realName').val(),
				},
				success:function(data){
					if(data.flag==0){
	//					$('.icon-pass').show().siblings('img').hide();
	//					if($('.alert-add-teacher .realName').val()==''){
	//						$('.icon-nopass').show().siblings('img').hide();
	//					}
						//回调函数
						backFun.call(me)
					}else if(data.flag==2){
	//					$('.icon-nopass').show().siblings('img').hide().siblings('.valid-font').text('该教师已存在');
						$yt_alert_Model.alertOne({
							haveCloseIcon: false, //是否带有关闭图标  
							closeIconUrl: "", //关闭图标路径  
							leftBtnName: "确定", //左侧按钮名称,默认确定  
							rightBtnName: "取消", //右侧按钮名称,默认取消  
							cancelFunction: function(){
								$(".alert-add-teacher").show();
							}, //取消按钮操作方法*/
							alertMsg: "教师名称已有重复，是否继续？", //提示信息  
							confirmFunction: function() {
								//回调函数
								backFun.call(me)
							}
						});
	
					}
				}
			});
		},
	    //课件文件事件绑定
	    teachCourseEvent:function(){
	    	//初始化
	    	$('.selectParam').val('');
	    	//模糊查询
	    	$('.search-btn').off().click(function(){
	    		teacherList.getTeachCourseWareList();
	    	})
	    	//上传按钮
	    	$('.import-btn').off().click(function(){
	    		$('#fileName').val('');
	    		$('.import-file-name').val('');
	    		 /** 
		         * 显示编辑弹出框和显示顶部隐藏蒙层 
		         */  
		        $(".batch-import-form").show();  
		        /** 
		         * 调用算取div显示位置方法 
		         */  
		        $yt_alert_Model.getDivPosition($(".batch-import-form"));  
		        $yt_alert_Model.setFiexBoxHeight($(".batch-import-form form"));
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
	    	})
	    	//选择文件
	    	$('.batch-import-form').undelegate().delegate('#fileName','change',function(){
	    		var url = $yt_option.acl_path + "api/tAscPortraitInfo/addFile?modelCode=teachcouseFile";
				$yt_baseElement.showLoading();
				$.ajaxFileUpload({
					url: url,
					type: "post",
					dataType: 'json',
					fileElementId: 'fileName',
					success: function(data, textStatus) {
						var resultData = $.parseJSON(data);
						if(resultData.success == 0) {
							$yt_baseElement.hideLoading(function() {
								$('.import-file-name').val(resultData.obj.naming).data("fileInfo", resultData.obj);
							});
						} else {
							$yt_baseElement.hideLoading(function() {
								$yt_alert_Model.prompt("选择失败");
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
	    	//弹窗上传确定按钮
	    	$('.import-sure').off().click(function(){
	    		var teacherFileList = [{
	    			teacherId:$yt_common.GetQueryString("pkId"),
					fileId:$('.import-file-name').data('fileInfo').pkId,
					fileName:$('.import-file-name').val(),
					fileSize:$('.import-file-name').data('fileInfo').fileSize,
					fileTypes:2
	    		}];
	    		teacherFileList = JSON.stringify(teacherFileList);
	    		$.ajax({
	    			type:"post",
	    			url:"teacher/addTeacherFiles",
	    			async:true,
	    			beforeSend:function(){
	    				$yt_baseElement.showLoading();
	    			},
	    			data:{
	    				teacherFileList:teacherFileList
	    			},
	    			success:function(data){
	    				$yt_baseElement.hideLoading();
	    				if(data.flag==0){
	    					teacherList.getTeachCourseWareList();
	    					$yt_alert_Model.prompt('上传成功')
		          			$(".batch-import-form").hide();  
	    				}else{
	    					$yt_alert_Model.prompt('上传失败')
	    				}
	    			},
	    			error:function(){
	    				$yt_baseElement.hideLoading(function(){
	    					$yt_alert_Model.prompt('上传失败')
	    				})
	    			}
	    		});
	    	});
	    	//删除按钮
	    	$('.courseware-tbody').off().on('click','.teachCourseDel',function(){
	    		teacherList.teachCourseBase($(this));
	    	})
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
				teacherId:teacherId,
				fileName:$('.selectParam').val()
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.courseware-tbody');
					var htmlTr = '';
					var num = 1;
					$(htmlTbody).empty();
					if(data.data.rows!=null){
					if(data.data.rows.length > 0) {
						$('.courseware-info').show();
						$.each(data.data.rows, function(i, v) {
							htmlTr = '<tr>' +
								'<td><input type="hidden" value="' + v.pkId + '" class="pkId">' + num++ + '</td>' +
								'<td style="text-align: left;"><a href="'+v.fileUrl+'" class="yt-link">'+v.fileName+'</a></td>' +
								'<td style="text-align: left;">' + v.createUserName + '</td>' +
								'<td>' + v.createTimeString + '</td>' +
								'<td style="text-align: right;">' + v.fileSize + (v.fileSize==""?"":"MB")+'</td>' +
								'<td><a class="teachCourseDel">删除</a></td>' +
								'</tr>';
								htmlTbody.append($(htmlTr).data("courseWareData",v));
								
						});
					} else{
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="6" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
							htmlTbody.append(htmlTr);
						$('.courseware-info').hide();
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
	//点击删除查询课件占用情况
	teachCourseBase:function(item){
		var fileIds = $(item).parents('tr').data("courseWareData").fileId;
		$.ajax({
			type:"post",
			url:"teacher/getCourseFileByFileIds",
			async:false,
			data:{
				fileIds:fileIds
			},
			beforeSend:function(){
				$yt_baseElement.showLoading();	
			},
			success:function(data){
				$yt_baseElement.hideLoading();
				if(data.flag==0){
					if(data.data.length>0){
						var alert = '';
						$.each(data.data, function(i,n) {
							n.courseDate = n.courseDate.replace('-','年').replace('-','月')+'日';
							alert +="该课件已被《"+n.projectName+"》选为"+n.courseDate+n.teacherName+"老师"+n.courseName+"课程的课件<br>"
						});
						alert+="若要删除课件，请先修改课程的课件";
						$yt_alert_Model.alertOne({  
					        haveCloseIcon: true, //是否带有关闭图标  
					        leftBtnName: "确定", //左侧按钮名称,默认确定  
					        cancelFunction: "", //取消按钮操作方法*/  
					        alertMsg: alert, //提示信息  
					        cancelFunction: function() { //点击确定按钮执行方法  
					        	
					        }
					    });
						$('.yt-alert-one').css("width",'750px');
						$yt_alert_Model.getDivPosition($(".yt-alert-one"));
					}else{
						$yt_alert_Model.alertOne({  
					        alertMsg: "删除后无法恢复，确认是否删除？", //提示信息  
					        confirmFunction: function() { //点击确定按钮执行方法  
					        	teacherList.delFile(item);
					        }
					    });
						$('.yt-alert-one').css("width",'350px');
						$yt_alert_Model.getDivPosition($(".yt-alert-one"));
					}
					
				}else{
					$yt_alert_Model.prompt('删除失败');
				}
			},
			error:function(){
				$yt_baseElement.hideLoading();
				$yt_alert_Model.prompt('网络异常');
			}
		});
	},
	//删除课件
	delFile:function(item){
		var fileIds = $(item).parents('tr').data("courseWareData").fileId;
		$.ajax({
			type:"post",
			url:"teacher/deleteCoursePortraitByPkIds",
			async:false,
			data:{
				fileIds:fileIds
			},
			beforeSend:function(){
				$yt_baseElement.showLoading();	
			},
			success:function(data){
				$yt_baseElement.hideLoading();
				if(data.flag==0){
	    			teacherList.getTeachCourseWareList();
					$yt_alert_Model.prompt('删除成功');
				}else{
					$yt_alert_Model.prompt('删除失败');
				}
				   
			},
			error:function(){
				$yt_baseElement.hideLoading();
				$yt_alert_Model.prompt('删除失败');
			}
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
	},
	teacherLogsName:{
		realName:'姓名',
		genderVal:'性别',
		researchAreaText:'专业领域',
		org:'单位',
		applyShift:'适用班次',
		title:'职称',
		isFormal:'编制',
		clerkPhone:'秘书手机',
		papersTypeText:'证件类型',
		clerkWorkPhone:'秘书电话',
		papersNumber:'证件号码',
		inspectingUserText:'考察人',
		phone:'手机号',
		intermediateUserText:'中间联系人',
		workPhone:'办公电话',
		dollarsStandardHalf:'课酬标准-半天',
		dollarsStandardOne:'课酬标准-天',
		fax:'传真',
		email:'邮箱',
		registeredBank:'开户行',
		orgAddress:'单位地址',
		account:'银行卡号',
		teacherDetails:'教师简介',
		fileIdsName:'附件',
		remarks:'备注',	
		tableValue:'标签',
		teacherEvaluate:'教师评价'
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
}
$(function() {
	//初始化方法
	teacherList.init();
	
});