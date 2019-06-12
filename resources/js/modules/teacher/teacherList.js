var teacherList = {
	//初始化方法
	init: function() {
		$("select").niceSelect(); //下拉框刷新  
		//日期控件
		$(".startAttendClassStart").calendar({
			controlId: "startDate",
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $(".startAttendClassEnd") //开始日期最大为结束日期  
		});
		$(".startAttendClassEnd").calendar({
			controlId: "endDate",
			nowData: false, //默认选中当前时间,默认true  
			lowerLimit: $(".startAttendClassStart") //结束日期最小为开始日期  
		});
		$(".endAttendClassStart").calendar({
			controlId: "startDate",
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $(".end-time-end") //开始日期最大为结束日期  
		});
		$(".endAttendClassEnd").calendar({
			controlId: "endDate",
			nowData: false, //默认选中当前时间,默认true  
			lowerLimit: $(".endAttendClassStart") //结束日期最小为开始日期  
		});
		//获取当前登录人
	    var getRoleIds = teacherList.userInfo();
	    //获取当前登录人角色
	    var roleIds = ','+getRoleIds+',';
	    //只有教学资源管理员与管理员才能控制删除与编辑公告
//		var isOperation = false;
//		roleIds.indexOf(',310,') != -1?isOperation=true:'';
//		roleIds.indexOf(',322,') == -1?isOperation=true:'';
//	    if (isOperation == false) {
//	   		$(".edit-btn").remove();
//	   		$('.deleteList').remove();
//	   	}
	   	//获取公告
	   	teacherList.getTeacherNotice();
		//点击新增
		$(".addList").on('click', function() {
			//设置标题名称
			$(".yt-edit-alert-title-msg").text("新增教师");
			$(".alert-add-teacher td>input").val("");
			$(".alert-add-teacher .teacherDetails").val('');
			$(".alert-add-teacher .remarks").val('');
			$(".alert-add-teacher .tableValue").val('');
			$(".alert-add-teacher .teacherEva").val('');
			$(".file-id").empty();
			$('.tree-div').find('input[type=checkbox]').setCheckBoxState('uncheck');
			$('.dollarsStandardHalfSpan').hide();
			$('.dollarsStandardHalf').show();
			$('.dollarsStandardOneSpan').hide()
			$('.dollarsStandardOne').show();
			//调用弹出框方法  显示弹出框
			teacherList.legalAdd();
			//点击弹出框确定按钮
			$('.alert-add-teacher .yt-model-sure-btn').off('click').on('click', function() {
				if($yt_valid.validForm($('.add-teacher-table-alert'))) {
//				if($('.icon-nopass').is(':hidden')){
//					teacherList.addTeacherList();
//					$(".lawyer-opinion-box").hide();
//					$('body').css('overflow','auto');
//				}else{
//					$yt_alert_Model.prompt('该教师已存在');
//				}
						teacherList.getTeacherIsHave(teacherList.addTeacherList)
				} else {
					teacherList.pageToScroll($('body .valid-font'));
					$yt_alert_Model.prompt("请将标红必填项填写完整", 3000);

				}
			});
		});
		//点击修改
		//点击修改按钮  
		$(".updateList").on('click', function() {
			//判断是否有选中行
			if($("tr.yt-table-active").length == 0) {
				$yt_alert_Model.prompt("请选择要修改的数据");
				return false;
			}
			$('.tree-div').find('input[type=checkbox]').setCheckBoxState('uncheck');
			$('.dollarsStandardHalfSpan').hide();
			$('.dollarsStandardHalf').show();
			$('.dollarsStandardOneSpan').hide()
			$('.dollarsStandardOne').show();
			$.ajax({
				type:"post",
				url:$yt_option.base_path+"teacher/getTeacherHis",
				async:false,
				data:{
					teacherId:$("tr.yt-table-active").find('.pkId').val()
				},
				beforeSend:function(){
					$yt_baseElement.showLoading();
				},
				success:function(data){
					$yt_baseElement.hideLoading();
					//获取被选中行的详细信息
					teacherList.getTeacherInf();
					//设置标题内容
					$(".yt-edit-alert-title-msg").text("修改");
					//显示弹出框
					teacherList.legalAdd();
					//点击弹出框确定按钮
					$('.alert-add-teacher .yt-model-sure-btn').off('click').on('click', function() {
						//调动修改方法  修改数据
					if($yt_valid.validForm($('.add-teacher-table-alert'))) {
//						if($('.icon-nopass').is(':hidden')){
//							
//							
//						}else{
//							$yt_alert_Model.prompt('该教师已存在');
//						}
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
		$('.halfMoneyChange').blur(function(){
			$('.oneMoneyChange').val($yt_baseElement.fmMoney($(this).val()*2));
			$(this).val($yt_baseElement.fmMoney($(this).val()));
		})
		$('.oneMoneyChange').blur(function(){
			$(this).val($yt_baseElement.fmMoney($(this).val()));
		})
		//点击删除
		$(".deleteList").on('click', function() {
			//判断是否有选中行
			if($("tr.yt-table-active").length == 0) {
				$yt_alert_Model.prompt("请选择要删除的数据");
				return false;
			}
			var data = $("tr.yt-table-active").data('legalData');
			if(data.approvalState!=0){
				if(data.states!=3){
					$yt_alert_Model.prompt('该教师已提交课酬审批，无法删除，您可选择停用该老师',3000)
					$('.yt-alert-four').css('width','500px')
				}else{
					//调用删除方法  删除被选中的数据
					teacherList.delTeacherList();
				}
			}else{
					//调用删除方法  删除被选中的数据
					teacherList.delTeacherList();	
			}
		});
		//点击启用
		$(".enableList").on('click', function() {
			//判断是否有选中行
			if($("tr.yt-table-active").length == 0) {
				$yt_alert_Model.prompt("请选择要操作的数据");
				return false;
			}
			//调用启用方法   启用被选中的数据
			teacherList.startUsing();
		});
		//点击停用
		$(".disableList").on('click', function() {
			//判断是否有选中行
			if($("tr.yt-table-active").length == 0) {
				$yt_alert_Model.prompt("请选择要操作的数据");
				return false;
			}
			//调用停用方法  停用被选中的数据
			teacherList.endUsing();
		});
		//点击导出
		$(".exportList").on("click", function() {
			var realName = $('.search-box .realName').val();
			var org = $('.search-box .org').val();
			var title = $('.search-box .title').val();
			var researchArea = $('.search-box .researchArea').val();
			var states = $('.states').val();
			var startAttendClassStart = $('.startAttendClassStart').val();
			var startAttendClassEnd = $('.startAttendClassEnd').val();
			var endAttendClassStart = $('.endAttendClassStart').val();
			var endAttendClassEnd = $('.endAttendClassEnd').val();
			var gradeStart = $('.gradeStart').val();
			var gradeEnd = $('.gradeEnd').val();
			var selectParam = $('.keyword').val();
			var downUrl = $yt_option.base_path + "teacher/exportTeacher";
			$.ajaxDownloadFile({
				url: downUrl,
				data: {
					selectParam:selectParam,
					realName: realName,
					org: org,
					title: title,
					researchArea: researchArea,
					states: states,
					startAttendClassStart: startAttendClassStart,
					startAttendClassEnd: startAttendClassEnd,
					endAttendClassStart: endAttendClassStart,
					endAttendClassEnd: endAttendClassEnd,
					gradeStart: gradeStart,
					gradeEnd: gradeEnd,
				}
			});
		});
		//查看详情
		$(".list-tbody").on('click', '.real-name-inf', function() {
			toDetail($(this).parent().parent().find('.pkId'))
		});
		$(".list-tbody").on('dblclick', 'tr', function() {
			toDetail($(this).find('.pkId'))
		});
		//查看详情
		function toDetail(pkId){
				sessionStorage.setItem("searchParams", $('.keyword').val());
				sessionStorage.setItem("pageIndexs", $('.num-text.active').text());
				sessionStorage.setItem("searchJson",JSON.stringify(teacherList.searchJson));
			window.location.href = "teacherInf.html?pkId=" + $(pkId).val()+'&pageNum='+$('.num-text.change-btn.active').text()+'&selectParam='+encodeURI(encodeURI($('.keyword').val()));
		}
		//头像附件上传
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
						$(".file-id").append('<li>' +
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
		$(".file-id").on("click", "li .file-name", function() {
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
		$(".file-id").on("click", "li .cancal", function() {
			$(this).parent().remove();
		});
		if($yt_common.GetQueryString("selectParam")){
			$('.keyword').val(decodeURI(decodeURI($yt_common.GetQueryString("selectParam"))));
		}
		teacherList.tree();
		//调用获取列表数据方法
		teacherList.getPlanListInfo($('.keyword').val());
		//高级搜索
		teacherList.hideSearch();
		//条件搜索
		$('.search-more-button').click(function() {
			teacherList.searchJson.tableValue=$(".table-value").val();
			teacherList.searchJson.teacherCourse=$(".teacher-course").val();
			teacherList.searchJson.realName = $('.search-box .realName').val();
			teacherList.searchJson.org = $('.search-box .org').val();
			teacherList.searchJson.title = $('.search-box .title').val();
			teacherList.searchJson.researchArea = $('.search-box .researchArea').val();
			teacherList.searchJson.states = $('.states').val();
			teacherList.searchJson.startAttendClassStart = $('.startAttendClassStart').val();
			teacherList.searchJson.startAttendClassEnd = $('.startAttendClassEnd').val();
			teacherList.searchJson.endAttendClassStart = $('.endAttendClassStart').val();
			teacherList.searchJson.endAttendClassEnd = $('.endAttendClassEnd').val();
			teacherList.searchJson.gradeStart = $('.gradeStart').val();
			teacherList.searchJson.gradeEnd = $('.gradeEnd').val();
			teacherList.getPlanListInfo($('.keyword').val(),teacherList.searchJson.realName,teacherList.searchJson.tableValue,teacherList.searchJson.teacherCourse, teacherList.searchJson.org, teacherList.searchJson.title, teacherList.searchJson.researchArea, teacherList.searchJson.states, teacherList.searchJson.startAttendClassStart, teacherList.searchJson.startAttendClassEnd, teacherList.searchJson.endAttendClassStart, teacherList.searchJson.endAttendClassEnd, teacherList.searchJson.gradeStart, teacherList.searchJson.gradeEnd);
		});
		$('.search-all-button').click(function() {
			teacherList.getPlanListInfo('');
		});
		$('.search-btn').click(function() {
			//调用获取列表数据方法查询
			var selectParam = $('.keyword').val();
			teacherList.getPlanListInfo(selectParam);

		});
		$(".research-area").click(function() {
			$(this).find(".research-area-list").show();
		});
		$(".research-area").mouseleave(function() {
			$(this).find(".research-area-list").hide();
		});
		$(".research-area-list").on("click", "li", function() {
			$(this).toggleClass("active");
			var researchAreaVal = "";
			$(".research-area-list li.active").each(function(i, n) {
				if(researchAreaVal == "") {
					researchAreaVal = $(n).text();
				} else {
					researchAreaVal += "," + $(n).text();
				}
			});
			$(".researchArea").val(researchAreaVal);
		});
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
	    //课酬审批
	    $('.dollarsApprove').click(function(){
				if($('.yt-table-active')[0]!=undefined){
					$('.dollarsApproveAlert .deptName').text('');
					$('.dollarsApproveAlert .remarks').val('');
					$('.dollarsApproveAlert .yt-input').val('');
					$('.valid-hint').removeClass('valid-hint');
					$('select.teacherCourse').empty();
					$('select.teacherCourse').append('<option value="">请选择</option>');
					$('select.teacherCourse').niceSelect();
					var data = $('.yt-table-active').data('legalData');
						$('.dollarsApproveAlert .yt-model-sure-btn').off('click').on('click',function(){
							if($yt_valid.validForm($(".dollarsApproveAlert"))){
								teacherList.teacherApproveNew($('.teacherName').attr('dataStates'),data.pkId);
							}
						})
					teacherList.teacherApproval(data.pkId,'');
					teacherList.teacherProject(data.pkId);
					teacherList.dollarsApproveAlert();
					$('.basicsStandardHalf').off().on('blur',function(){
					$('.basicsStandardOne').val($yt_baseElement.fmMoney($(this).val()*2));
					$(this).val($yt_baseElement.fmMoney($(this).val()));
					$(this).val($yt_baseElement.fmMoney($(this).val()));
					allmoney('half')
					})
					$('.floatStandardHalf').off().on('blur',function(){
						$('.floatStandardOne').val($yt_baseElement.fmMoney($(this).val()*2));
						$(this).val($yt_baseElement.fmMoney($(this).val()));
						allmoney('half')
					})
					$('.customizedStandardHalf').off().on('blur',function(){
						$('.customizedStandardOne').val($yt_baseElement.fmMoney($(this).val()*2));
						$(this).val($yt_baseElement.fmMoney($(this).val()));
						allmoney('half')
					})
					$('.basicsStandardOne,.floatStandardOne,.customizedStandardOne').off().on('blur',function(){
						$(this).val($yt_baseElement.fmMoney($(this).val()));
						allmoney('one')
					})
					function allmoney(type){
						var half = $yt_baseElement.rmoney($('.basicsStandardHalf').val())+$yt_baseElement.rmoney($('.floatStandardHalf').val())+$yt_baseElement.rmoney($('.customizedStandardHalf').val());
						var one = $yt_baseElement.rmoney($('.basicsStandardOne').val())+$yt_baseElement.rmoney($('.floatStandardOne').val())+$yt_baseElement.rmoney($('.customizedStandardOne').val());
						if(type=='half'){
							$('.teacherMoneyHalf').text($yt_baseElement.fmMoney(half));
							$('.teacherMoneyOne').text($yt_baseElement.fmMoney(one));
						}else if(type=='one'){
							$('.teacherMoneyOne').text($yt_baseElement.fmMoney(one));
						}
					}
				}else{
					$yt_alert_Model.prompt('请选择一位教师!');
				}
	    });
	    
	    //课酬变更
//	    $('.dollarsChange').click(function(){
//				if($('.yt-table-active')[0]!=undefined){
//					var data = $('.yt-table-active').data('legalData');
//					if(data.approvalState==2||data.approvalState==4){
//						$('.dollarsChangeTr').show();
//						teacherList.dollarsApproveAlert();
//						teacherList.teacher(data.pkId);
//						$('.dollarsApproveAlert .yt-model-sure-btn').off('click').on('click',function(){
//							teacherList.teacherApprove(2,data.pkId,$('.halfMoney').text(),$('.oneMoney').text(),$yt_baseElement.rmoney($(".halfMoneyChange").val()),$yt_baseElement.rmoney($(".oneMoneyChange").val()),data.processInstanceId);
//						})
//					}else{
//						$yt_alert_Model.prompt('请先提交该教师的课酬审批!')
//					}
//				}else{
//					$yt_alert_Model.prompt('请选择一位教师')
//				}
//	    });
	    teacherList.dollarsNextPeople();
	    //公告编辑
	    $(".edit-btn").click(function(){
		   	$(".edit-text-cont").val("");
	   		//公告编辑弹窗
	   		teacherList.editTextTitle(roleIds);
	    });
	},
	searchJson:{
		tableValue:"",
		teacherCourse:"",
		realName:"",
		org:"",
		title :"",
		researchArea:"",
		states:"",
		startAttendClassStart:"",
		startAttendClassEnd:"",
		endAttendClassStart:"",
		endAttendClassEnd:"",
		gradeStart:"",
		gradeEnd:""
	},
	//获取专业领域
	tree:function(){
		//获取专业领域下拉列表
		var groupList = teacherList.getListSelectGroup();
		if (groupList !=null){
			$("select.researchArea").empty();
			$("select.researchArea").append('<option value="">请选择</option>');
			$.each(groupList,function (i,n){
//				$(".researchArea").append('<li value="'+n.pkId+'">'+n.researchAreaName+'</li>');
				$("select.researchArea").append('<option value="'+n.pkId+'">'+n.researchAreaName+'</option>');
			});
			$("select.researchArea").niceSelect();
		}
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
	//获取登录人信息
	userInfo: function() {
		var roleIds = "";
		$.ajax({
			async: false,
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "uniform/user/getUsersDetails", //ajax访问路径  
			data: {}, //ajax查询访问参数
			success: function(data) {
				roleIds = data.data.roleIds;
			}
		});
		return roleIds;
	},
	//获取公告
	getTeacherNotice:function(){
		$.ajax({
			type:"post",
			url:$yt_option.base_path+'teacher/getTeacherNotice',
			async:false,
			data:{
			},
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			success:function(data){
				if(data.flag == 0){
					if(data.data!=null){
						$(".notice").val(data.data.pkId);
						$(".text-title").text(data.data.noticeDetails);
						//鼠标移动到公告上显示全部公告内容
						$('.text-title').tooltip({
							position: 'bootom',
							content: function() {
								var showBox = "";
								if(data.flag == 0){
									showBox='<p style="width:300px;word-break: break-all;">'+data.data.noticeDetails+'</p>';
								}
								return showBox;
							},
							onShow: function() {
								$(this).tooltip('tip').css({
									backgroundColor: '#666',
									borderColor: '#666',
									color:'#fff',
									top:'90px'
								});
							}
						});
					}
				
					$yt_baseElement.hideLoading();
				}
			}
		});
	},
	//公告编辑弹窗
	editTextTitle:function(roleIds){
		$(".edit-text-cont").val("");
		$(".edit-text-cont").val($(".text-title").text());
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$(".edit-text-title").show();
		/**
		 * 调用算取div显示位置方法 
		 */
		$yt_alert_Model.getDivPosition($(".edit-text-title"));
		$yt_alert_Model.setFiexBoxHeight($(".edit-text-title form"));
		/* 
		 * 调用支持拖拽的方法 
		 */
		$yt_model_drag.modelDragEvent($(".edit-text-title .yt-edit-alert-title"));
		/** 
		 * 点击取消方法 
		 */
		$('.edit-text-title .yt-eidt-model-bottom .text-canel').off().on("click", function() {
			//隐藏页面中自定义的表单内容  
			$(".edit-text-title").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
		//点击保存
		$('.edit-text-title .yt-eidt-model-bottom .text-btn').off().on("click", function() {
			 //获取当前登录人角色
//			if (roleIds.indexOf(',201,') != -1) {//当前登录人可编辑公告
				var noticeDetails = $(".edit-text-cont").val();
				var pkId = $(".notice").val();
				$.ajax({
					type:"post",
					url:$yt_option.base_path+'teacher/addOrUpdateTeacherNotice',
					async:true,
					data:{
						noticeDetails:noticeDetails,
						pkId:pkId
					},
					success:function(data){
						if(data.flag == 0){
							$yt_alert_Model.prompt('保存成功');
							$(".notice").val("");
							teacherList.getTeacherNotice();
						}
					}
				});
//			}
			//隐藏页面中自定义的表单内容  
			$(".edit-text-title").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
			
		});
	},
	/*
	 课酬弹窗
	 * */
	dollarsApproveAlert:function(){
		/** 
				 * 显示编辑弹出框和显示顶部隐藏蒙层 
				 */
				$(".dollarsApproveAlert").show();
				/** 
				 * 调用算取div显示位置方法 
				 */
				$yt_alert_Model.getDivPosition($(".dollarsApproveAlert"));
				$yt_alert_Model.setFiexBoxHeight($(".dollarsApproveAlert form"));
				/* 
				 * 调用支持拖拽的方法 
				 */
				$yt_model_drag.modelDragEvent($(".dollarsApproveAlert .yt-edit-alert-title"));
				/** 
				 * 点击取消方法 
				 */
				$('.dollarsApproveAlert .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
					//隐藏页面中自定义的表单内容  
					$(".dollarsApproveAlert").hide();
					//隐藏蒙层  
					$("#pop-modle-alert").hide();
				});
	},
	/*
	 * 
	 * 课酬下一步审批*/
	dollarsNextPeople:function(){
		var list=[];
		$.ajax({
			type:"post",
			url:$yt_option.base_path+'uniform/workFlowOperate/getSubmitPageData',
			async:true,
			data:{
				businessCode:'teacher',
				processInstanceId:'',
				parameters:'',
				versionNum:''
			},
			success:function(data){
				$.each(data.data, function(i, n) {
						for(var k in n) {
							list = n[k];
						}
				});
				$.each(list, function(j,k) {
					$('select.dealing-with-people').append('<option value="'+k.userCode+'">'+k.userName+'</option>')
				});
				$('select.dealing-with-people').niceSelect();
			}
		});
	},
	/*
	 提交审批(作废)
	 * */
	teacherApprove:function(dataStates,teacherId,dollarsStandardHalf,dollarsStandardOne,dollarsStandardHalfBefore,dollarsStandardOneBefore,processInstanceId){
		$.ajax({
			type:"post",
			url:$yt_option.base_path+"teacher/addOrApprovalTeacher",
			async:false,
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			data:{
				dataStates:dataStates,
				teacherId:teacherId,
				dollarsStandardHalf:dollarsStandardHalf,
				dollarsStandardOne:dollarsStandardOne,
				dollarsStandardHalfBefore:dollarsStandardHalfBefore,
				dollarsStandardOneBefore:dollarsStandardOneBefore,
				changeReason:$('.changeRemarks').val(),
				businessCode:'teacher',
				dealingWithPeople:$(".dealing-with-people").val(),
				opintion:$('.dollarsApproveAlert .remarks').val(),
				processInstanceId:processInstanceId,
				nextCode:'submited'
			},
			success:function(data){
				if(data.flag==0){
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt('提交成功')
						$(".dollarsApproveAlert").hide();
						$('.page-info').pageInfo('refresh');
					});
				}else{
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt('提交失败')
					});
				}
			},
			error:function(){
				$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt('网络异常，提交失败')
					});
			}
		});
	},
	teacherApproveNew:function(dataStates,teacherId){
		$.ajax({
			type:"post",
			url:$yt_option.base_path+"teacher/addOrApprovalTeacherNew",
			async:true,
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			data:{
				dataStates:dataStates,
				teacherId:teacherId,
				dollarsStandardHalf:$yt_baseElement.rmoney($('.teacherName').data('data').dollarsStandardHalf),
				dollarsStandardOne:$yt_baseElement.rmoney($('.teacherName').data('data').dollarsStandardOne),
				projectCode:$('.teacherProjectCode').val(),
				courseId:$('.teacherCourse').val(),
				dollarsStandardType:$('input[name=moneyType]:checked').val(),
				basicsStandardHalf:$yt_baseElement.rmoney($('.basicsStandardHalf').val()),
				basicsStandardOne:$yt_baseElement.rmoney($('.basicsStandardOne').val()),
				floatStandardHalf:$yt_baseElement.rmoney($('.floatStandardHalf').val()),
				floatStandardOne:$yt_baseElement.rmoney($('.floatStandardOne').val()),
				customizedStandardHalf:$yt_baseElement.rmoney($('.customizedStandardHalf').val()),
				customizedStandardOne:$yt_baseElement.rmoney($('.customizedStandardOne').val()),
				businessCode:'teacher',
				dealingWithPeople:$(".dealing-with-people").val(),
				opintion:$('.dollarsApproveAlert .remarks').val(),
				processInstanceId:'',
				nextCode:'submited'
			},
			success:function(data){
				if(data.flag==0){
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt('提交成功')
						$(".dollarsApproveAlert").hide();
						$('.page-info').pageInfo('refresh');
					});
				}else{
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt('提交失败')
					});
				}
			},
			error:function(){
				$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt('网络异常，提交失败')
					});
			}
		});
	},
	/*
	 
	 * 获取教师详情*/
	teacher:function(pkId){
		$.ajax({
			type:"post",
			url:$yt_option.base_path+"teacher/getBeanById",
			async:true,
			data:{
				pkId:pkId
			},
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			success:function(data){
				if(data.flag==0){
					$('.dollarsApproveAlert').setDatas(data.data);
					$("#project-states").setSelectVal(data.data.papersType);
				}
				$yt_baseElement.hideLoading();
			},
			error:function(){
				$yt_baseElement.hideLoading();
				$yt_alert_Model.prompt('网络异常，请稍后重试')
			}
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
	/**
	 * 获取列表数据
	 */
	getPlanListInfo: function(selectParam,realName,tableValue,teacherCourse, org, title, researchArea, states, startAttendClassStart, startAttendClassEnd, endAttendClassStart, endAttendClassEnd, gradeStart, gradeEnd) {
		sessionStorage.getItem("searchParams")?$('.keyword').val(sessionStorage.getItem("searchParams")):'';
		var selectParams =  $('.keyword').val();
		if(sessionStorage.getItem("searchJson")){
			teacherList.searchJson = JSON.parse(sessionStorage.getItem("searchJson"));
			realName = teacherList.searchJson.realName;
			tableValue = teacherList.searchJson.tableValue;
			teacherCourse = teacherList.searchJson.teacherCourse;
			org = teacherList.searchJson.org;
			title = teacherList.searchJson.title;
			researchArea = teacherList.searchJson.researchArea;
			states = teacherList.searchJson.states;
			startAttendClassStart = teacherList.searchJson.startAttendClassStart;
			startAttendClassEnd = teacherList.searchJson.startAttendClassEnd;
			endAttendClassStart = teacherList.searchJson.endAttendClassStart;
			endAttendClassEnd = teacherList.searchJson.endAttendClassEnd;
			gradeStart = teacherList.searchJson.gradeStart;
			gradeEnd = teacherList.searchJson.gradeEnd;
			$('.search-box .realName').val(realName);
			$('.search-box .org').val(org);
			$('.search-box .title').val(title);
			$('.search-box .researchArea').setSelectVal(researchArea);
			$('.states').setSelectVal(states);
			$('.startAttendClassStart').val(startAttendClassStart);
			$('.startAttendClassEnd').val(startAttendClassEnd);
			$('.endAttendClassStart').val(endAttendClassStart);
			$('.endAttendClassEnd').val(endAttendClassEnd);
			$('.gradeStart').val(gradeStart);
			$('.gradeEnd').val(gradeEnd);
		}
		$('.page-info').pageInfo({
			pageIndexs: sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "teacher/lookForAll", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				"selectParam":selectParams,
				realName: realName,
				tableValue:tableValue,
				teacherCourse:teacherCourse,
				org: org,
				title: title,
				researchArea: researchArea,
				states: states,
				startAttendClassStart: startAttendClassStart,
				startAttendClassEnd: startAttendClassEnd,
				endAttendClassStart: endAttendClassStart,
				endAttendClassEnd: endAttendClassEnd,
				gradeStart: gradeStart,
				gradeEnd: gradeEnd
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			async:true,
			before:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				sessionStorage.clear();
				if(data.flag == 0) {
					var htmlTbody = $('.list-table .list-tbody');
					var htmlTr = '';
					var num = 1;
					$(htmlTbody).empty();
					if(data.data.rows.length > 0) {
						$.each(data.data.rows, function(i, v) {
							v.startAttendClass == null ? v.startAttendClass = '' : v.startAttendClass = v.startAttendClass;
							v.endAttendClass == null ? v.endAttendClass = '' : v.endAttendClass = v.endAttendClass;
							htmlTr = '<tr>' +
								'<td><input type="hidden" value="' + v.pkId + '" class="pkId">' + num++ + '</td>' +
								'<td style="text-align: left;"><a href="#" class="real-name-inf" style=" color:#3c4687">' + v.realName + '</a></td>' +
								'<td style="text-align: left;">' + v.org + '</td>' +
								'<td style="text-align: left;">' + v.title + '</td>' +
								'<td>' + v.startAttendClass + '</td>' +
								'<td>' + v.endAttendClass + '</td>' +
								'<td style="text-align: right;">' + v.grade + '</td>' +
								'<td style="text-align: left;">' + v.researchArea + '</td>' +
								'<td>' + (v.states == 1 ? "可用" : (v.states == 2 ? "已用" : "停用")) + '</td>' +
								'</tr>';
							$('.page-info').show();
							htmlTbody.append($(htmlTr).data("legalData", v));
						});
					} else {
						$('.page-info').hide();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="9" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						htmlTbody.html(htmlTr);
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
	//新增教师
	addTeacherList: function() {
		var validFlag = $yt_valid.validForm($(".valid-tab"));
//		if(validFlag) {
//
//		} else {
//
//		}
		var realName = $(".alert-add-teacher .realName").val();
		var gender = $(".alert-add-teacher input[type='radio']:checked").val();
		var researchArea = $('#textTree').data('pkId');
		var org = $(".alert-add-teacher .org").val();
		var applyShift = $(".alert-add-teacher .applyShift").val();
		var title = $(".alert-add-teacher .title").val();
		var clerkPhone = $(".alert-add-teacher .clerkPhone").val();
		var papersType = $(".alert-add-teacher .papersType").val();
		var clerkWorkPhone = $(".alert-add-teacher .clerkWorkPhone").val();
		var papersNumber = $(".alert-add-teacher .papersNumber").val();
		var inspectingUserCode = $(".alert-add-teacher .inspecting-user-code").val();
		var phone = $(".alert-add-teacher .phone").val();
		var intermediateUserCode = $(".alert-add-teacher .intermediate-user-code").val();
		var workPhone = $(".alert-add-teacher .workPhone").val();
		var dollarsStandardHalf = $(".alert-add-teacher .dollarsStandardHalf").val();
		var dollarsStandardOne = $(".alert-add-teacher .dollarsStandardOne").val();
		var fax = $(".alert-add-teacher .fax").val();
		var email = $(".alert-add-teacher .email").val();
		var registeredBank = $(".alert-add-teacher .registeredBank").val();
		var orgAddress = $(".alert-add-teacher .orgAddress").val();
		var account = $(".alert-add-teacher .account").val();
		var teacherDetails = $(".alert-add-teacher .teacherDetails").val();
		var fileIds = "";
		var remarks = $(".alert-add-teacher .remarks").val();
		var teacherEvaluate = $(".alert-add-teacher .teacherEva").val();
		var tableValue=$(".alert-add-teacher .tableValue").val();
		var fileIdsJsonArr = [];
		$(".file-id li").each(function(i, n) {
			fileName = $(n).find(".file-name").text();
			fileId = $(n).find(".file-name .file-span-id").val();
			var fileIds = {
				fileName: fileName,
				fileId: fileId
			}
			fileIdsJsonArr.push(fileIds);
		});
		var fileIdsJson = JSON.stringify(fileIdsJsonArr);
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "teacher/addOrUpdateBean", //ajax访问路径  
			data: {
				pkId:'',
				realName: realName,
				gender: gender,
				researchArea: researchArea,
				org: org,
				applyShift: applyShift,
				title: title,
				clerkPhone: clerkPhone,
				papersType: papersType,
				clerkWorkPhone: clerkWorkPhone,
				papersNumber: papersNumber,
				inspectingUserCode: inspectingUserCode,
				phone: phone,
				intermediateUserCode: intermediateUserCode,
				workPhone: workPhone,
				dollarsStandardHalf:$yt_baseElement.rmoney(dollarsStandardHalf),
				dollarsStandardOne:$yt_baseElement.rmoney(dollarsStandardOne),
				fax: fax,
				email: email,
				registeredBank: registeredBank,
				orgAddress: orgAddress,
				account: account,
				teacherDetails: teacherDetails,
				tableValue:tableValue,
				fileIds: fileIdsJson,
				remarks: remarks,
				teacherEvaluate:teacherEvaluate
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt("新增成功");
					$(".yt-edit-alert").hide();
					$('.page-info').pageInfo("refresh");
				}else if(data.flag==5){
					$yt_alert_Model.prompt("此教师已存在");
				}else {
					$yt_alert_Model.prompt(data.message);
				}
				//s隐藏整体框架loading的方法
				$yt_baseElement.hideLoading();
			}
		});
	},
	//修改
	amendTeacherList: function() {
		
		var me = this;
		var pkId = $(".yt-table-active .pkId").val();
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
		$(".file-id li").each(function(i, n) {
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
		afterJson.papersTypeText = $('.alert-add-teacher select.papersType option:selected').text();
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
				dollarsStandardHalf:$yt_baseElement.rmoney(afterJson.dollarsStandardHalf),
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
					$('.page-info').pageInfo("refresh");
					
				} else {
					$yt_alert_Model.prompt("修改失败");
				}
				$yt_baseElement.hideLoading();
			}
		});
	},
	//删除
	delTeacherList: function() {
		var pkId = $('.yt-table-active .pkId').val();
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
					url: $yt_option.base_path + "teacher/deleteById",
					data: {
						pkId: pkId
					},
					success: function(data) {
						if(data.flag == 0) {
							$yt_alert_Model.prompt("删除成功");
							$('.page-info').pageInfo("refresh");
						} else {
							$yt_alert_Model.prompt("不能删除");
						}

					}

				});

			}
		});
	},
	//启用
	startUsing: function() {
		var pkId = $(".yt-table-active .pkId").val();
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "teacher/updateDataStatesById", //ajax访问路径  
			data: {
				pkId: pkId,
				dataStates: 3
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt("已启用");
					$(".yt-edit-alert").hide();
					$('.page-info').pageInfo("refresh");
				} else {
					$yt_alert_Model.prompt("操作失败");
				}
			}
		});
	},
	//停用
	endUsing: function() {
		var pkId = $(".yt-table-active .pkId").val();
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "teacher/updateDataStatesById", //ajax访问路径  
			data: {
				pkId: pkId,
				dataStates: 2
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt("已停用");
					$('.page-info').pageInfo("refresh");
				} else {
					$yt_alert_Model.prompt("操作失败");
				}
			}
		});
	},
	//获取一条数据
	oldTeacherData:{},
	getTeacherInf: function() {
		var pkId = $(".yt-table-active .pkId").val();
		var me = this ;
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "teacher/getBeanById", //ajax访问路径  
			data: {
				pkId: pkId
			}, //ajax查询访问参数
			async:true,
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag == 0) {
					me.oldTeacherData = data.data;
					$(".alert-add-teacher input:not(.gender)").val('');
					$(".alert-add-teacher textarea").val('');
					$('.alert-add-teacher .inspecting-user-code').val('');
					$('.alert-add-teacher .intermediate-user-code').val('');
					$(".alert-add-teacher").setDatas(data.data);
					$('.alert-add-teacher .dollarsStandardHalf').val($yt_baseElement.fmMoney($('.alert-add-teacher .dollarsStandardHalf').val()))
					$('.alert-add-teacher .dollarsStandardOne').val($yt_baseElement.fmMoney($('.alert-add-teacher .dollarsStandardOne').val()))
					var researchAreaArr = [];
					var researchAreapkId = [];
					if(data.data.researchAreaData!='')
					data.data.researchAreaData = JSON.parse(data.data.researchAreaData);
					$.each(data.data.researchAreaData, function(a, b) {
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
					var teacherUl = $(".file-id");
					var teacherLi = "";
					var fileIdsArr = $.parseJSON(data.data.fileIds);
					me.oldTeacherData.fileIdsName=[];
					if(fileIdsArr.length > 0) {
						$.each(fileIdsArr, function(i, v) {
							teacherLi += '<li>' +
								'<span class="file-name" style="margin-right: 50px;color:blue;cursor: pointer"><input type="hidden" class="file-span-id" value="' + v.fileId + '" >' + v.fileName + '</span><span class="cancal" style="cursor: pointer;">x</span>' +
								'</li>';
							teacherUl.html(teacherLi);
							//修改前附件名
							me.oldTeacherData.fileIdsName.push(v.fileName);
						});
					}
					me.oldTeacherData.fileIdsName = me.oldTeacherData.fileIdsName.join(',')
					//性别
					$('.alert-add-teacher .gender#radio'+data.data.gender).setRadioState("check")
					//考察人
					$('.alert-add-teacher .inspecting-user-code,.alert-add-teacher .intermediate-user-code').setSelectVal('');
					$('.alert-add-teacher .inspecting-user-code').setSelectVal(data.data.inspectingUserCode);
					//中间联系人
					$('.alert-add-teacher .intermediate-user-code').setSelectVal(data.data.intermediateUserCode);
					//专业领域
					me.oldTeacherData.researchAreaText = researchAreaArr;
					//考察人
					me.oldTeacherData.inspectingUserText = $('.alert-add-teacher select.inspecting-user-code option:selected').text();
					//中间联系人
					me.oldTeacherData.intermediateUserText = $('.alert-add-teacher select.intermediate-user-code option:selected').text();
					//证件类型
					me.oldTeacherData.papersTypeText = $('.alert-add-teacher select.papersType option:selected').text();
					me.oldTeacherData.gender == 1?me.oldTeacherData.genderVal='男':me.oldTeacherData.genderVal='女';
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading();
					$yt_alert_Model.prompt("获取失败");
				}
			},
			error:function(data){
				$yt_baseElement.hideLoading();
			}
		});
	},
	//带有顶部标题栏的弹出框  
	legalAdd: function() {
		$(".file-id").empty();
		$('.icon-pass').hide();
		$('.icon-nopass').hide();
		$('.valid-hint').removeClass('valid-hint');
		$('.valid-font').text('');
		$(".alert-add-teacher").find("input[type='text']").val("");
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$(".lawyer-opinion-box").show();
		/** 
		 * 调用算取div显示位置方法 
		 */
		$yt_alert_Model.getDivPosition($(".lawyer-opinion-box"));
		$yt_alert_Model.setFiexBoxHeight($(".alert-add-teacher form"));
		/* 
		 * 调用支持拖拽的方法 
		 */
		$yt_model_drag.modelDragEvent($(".lawyer-opinion-box .yt-edit-alert-title"));
		/** 
		 * 点击取消方法 
		 */
		$('body').css('overflow','hidden');
		$('.lawyer-opinion-box .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
			//隐藏页面中自定义的表单内容  
			$(".lawyer-opinion-box").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
			$('body').css('overflow','auto');
		});
	},
	//查询该教师是否存在
	getTeacherIsHave:function(backFun){
		var me = this;
		//隐藏弹出框
		$(".lawyer-opinion-box").hide();
		$('body').css('overflow','auto');
		var pkId;
		if($('.add-teacher-table-alert .yt-edit-alert-title-msg').text()=='新增教师'){
			pkId='';
		}else{
			pkId = $(".yt-table-active .pkId").val();
		}
		$.ajax({
			type:"post",
			url:$yt_option.base_path+"teacher/getTeacherIsHave",
			async:true,
			data:{
				pkId:pkId,
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
							$(".lawyer-opinion-box").show();
							$('body').css('overflow','hidden');
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
	//课酬审批获取详情
	teacherApproval:function(pkId,processInstanceId){
		$.ajax({
			type:"post",
			url:$yt_option.base_path+"teacher/getTeacherBeanByIdByApproval",
			async:false,
			data:{
				pkId:pkId,
				processInstanceId:processInstanceId
			},
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			success:function(data){
				data.data.dollarsStandardHalf = $yt_baseElement.fmMoney(data.data.dollarsStandardHalf)
				data.data.dollarsStandardOne = $yt_baseElement.fmMoney(data.data.dollarsStandardOne)
				data.data.dollarsStandardHalfVal = $yt_baseElement.fmMoney(Number(data.data.basicsStandardHalf)+Number(data.data.floatStandardHalf)+Number(data.data.customizedStandardHalf))
				data.data.dollarsStandardOneVal = $yt_baseElement.fmMoney(Number(data.data.basicsStandardOne)+Number(data.data.floatStandardOne)+Number(data.data.customizedStandardOne))
				data.data.basicsStandardHalf = $yt_baseElement.fmMoney(data.data.basicsStandardHalf)
				data.data.basicsStandardOne = $yt_baseElement.fmMoney(data.data.basicsStandardOne)
				data.data.floatStandardHalf = $yt_baseElement.fmMoney(data.data.floatStandardHalf)
				data.data.floatStandardOne = $yt_baseElement.fmMoney(data.data.floatStandardOne)
				data.data.customizedStandardHalf = $yt_baseElement.fmMoney(data.data.customizedStandardHalf)
				data.data.customizedStandardOne = $yt_baseElement.fmMoney(data.data.customizedStandardOne)
				$('.dollarsApproveTable').setDatas(data.data);
				$('.teacherName').attr('teacherId',data.data.pkId);
				$('.teacherName').attr('dataStates',data.data.dataStates);
				$('.teacherName').data('data',data.data);
				$('.deptName').text(data.data.org+data.data.title);
				$('.teacherProjectCode').setSelectVal(data.data.projectCode);
				$('.teacherCourse').setSelectVal(data.data.courseId);
				$('input[name=moneyType][value='+data.data.dollarsStandardType+']').setRadioState('check');
			},
			error:function(){
				$yt_baseElement.hideLoading(function(){
					$yt_alert_Model.prompt('网络异常，请稍后重试');
				})
			}
		});
	},
	//课酬审批项目下拉框初始化
	teacherProject:function(teacherId){
		var me = this ;
		$.ajax({
			type:"post",
			url:$yt_option.base_path+"teacher/lookForAllProjectByDollarsStandard",
			async:true,
			data:{
				selectParam:'',
				pkId:teacherId
			},
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			success:function(data){
				if(data.flag==0){
					$yt_baseElement.hideLoading();
					$('select.teacherProjectCode').empty();
//					$('select.teacherProjectCode').append('<option value="">请选择</option>');
					$.each(data.data, function(i,n) {
						$('select.teacherProjectCode').append('<option value="'+n.projectCode+'">'+n.projectName+'</option>');
					});
					$('select.teacherProjectCode').niceSelect({
				        search: true,  
				        backFunction: function(text) {  
				            //回调方法,可以执行模糊查询,也可自行添加操作  
				           $('select.teacherProjectCode option').remove();  
				            if(text == "") {  
				               $('select.teacherProjectCode').append('<option value="">请选择</option>');  
				            }  
				            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
				            $.each(data.data, function(i, n) {  
				                if(n.projectName.indexOf(text) != -1) { 
				                   $('select.teacherProjectCode').append('<option value="' + n.projectCode + '">' + n.projectName + '</option>');  
								}
				            });  
				        }  
					});
					$('.teacherProjectCode').off('change').on('change',function(){
						if($(this).val()==''){
							$('select.teacherCourse').empty();
							$('select.teacherCourse').append('<option value="">请选择</option>');
							$('select.teacherCourse').niceSelect()
						}else{
							$('.teacherProjectCode').removeClass('valid-hint');
							me.teacherProjectCourse($(this).val());
						}
					})
					if($('select.teacherProjectCode').val()!=''){
							me.teacherProjectCourse($('select.teacherProjectCode').val());
					}
				}else{
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt('项目查询失败')
					})
				}
			},
			error:function(){
				$yt_baseElement.hideLoading(function(){
					$yt_alert_Model.prompt('网络异常，请稍后重试');
				})
			}
		});
	},
	//项目课程下拉框初始化
	teacherProjectCourse:function(projectCode){
		$.ajax({
			type:"post",
			url:$yt_option.base_path+"teacher/lookForAllCourseByProject",
			async:true,
			data:{
				selectParam:'',
				projectCode:projectCode,
				teacherId:$('.teacherName').attr('teacherId')
			},
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			success:function(data){
				if(data.flag==0){
					$yt_baseElement.hideLoading();
					$('select.teacherCourse').empty();
					$.each(data.data, function(i,n) {
						$('select.teacherCourse').append('<option value="'+n.courseId+'">'+n.courseName+'</option>');
					});
					if(data.data.length==0){
						$('select.teacherCourse').append('<option value="">请选择</option>');
					}
					if($('select.teacherCourse').val()!=''){
							$('.teacherCourse').removeClass('valid-hint');
					}
					$('select.teacherCourse').niceSelect();
					$('.teacherCourse').off('change').on('change',function(){
						if($(this).val()!=''){
							$('.teacherCourse').removeClass('valid-hint');
						}
					})
				}else{
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt('项目查询失败')
					})
				}
			},
			error:function(){
				$yt_baseElement.hideLoading(function(){
					$yt_alert_Model.prompt('网络异常，请稍后重试');
				})
			}
		});
	},
	/**
	 * 字段验证设置滚动条滚动到验证错误信息位置
	 * @param {Object} validObj 验证区域对象
	 */
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
	/**
	 * 高级搜索
	 */
	hideSearch:function(){
		//点击更多
		var clickNumber = 0;
		$('.search-more').off().on('click', function(e) {
			//显示窗口
			if(clickNumber % 2 == 0) {
				$('.search-box').show();
				$('.search-put').addClass('flipy');
			} else {
				$('.search-box').hide();
				$('.realName').val("");
				$('.org').val("");
				$('.isFormal').setSelectVal("1");
				$('.title').val("");
				$('.researchArea').val("");
				$('.states').setSelectVal("1");
				$('.startAttendClassStart').val("");
				$('.startAttendClassEnd').val("");
				$('.endAttendClassStart').val("");
				$('.endAttendClassEnd').val("");
				$('.gradeStart').val("");
				$('.gradeEnd').val("");
				$('.search-put').removeClass('flipy');
			}
			clickNumber++;
			e.stopPropagation();
		});
		$(document).click(function(e){
			clickNumber=0;
			$('.search-box').hide();
			$('.search-put').removeClass('flipy');
		});
		//重置按钮
		$('.yt-model-reset-btn').off().on("click", function() {
			$('.realName').val("");
			$('.org').val("");
			$('.isFormal').setSelectVal("");
			$('.title').val("");
			$('.researchArea').val("");
			$('.states').setSelectVal("");
			$(".researchArea").setSelectVal("");
			$('.startAttendClassStart').val("");
			$('.startAttendClassEnd').val("");
			$('.endAttendClassStart').val("");
			$('.endAttendClassEnd').val("");
			$('.gradeStart').val("");
			$('.gradeEnd').val("");
			$('.table-value').val("");
			$('.teacher-course').val("");
		});
	}
}
$(function() {
	//初始化方法
	$(document).ready(function(){
		teacherList.init();
//		$("*").scroll(function (){
//					$(".tree-div").hide();
//					$("#textTree").removeClass('open')
//		});
//		$(window).scroll(function (){
//				$(".tree-div").hide();
//				$("#textTree").removeClass('open')
//		});
	})
});