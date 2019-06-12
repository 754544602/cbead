var classInfo = {

	//初始化方法
	init: function() {
		//初始化列表
		classInfo.getPlanListInfo();
		$('.add-type-name-select').niceSelect();
		$('select').niceSelect();
		//新增班级
		$(".addList").click(function() {
			$(".type-name-select").empty();
			$('.ticket-class-title-span').text("新增");
			classInfo.clearAddAlertBox();
			classInfo.addShowAlert();
		});

		//修改班级
		$(".updateList").click(function() {
			$('.ticket-class-title-span').text("修改");
			var pkId = $('.yt-table-active .pkId').val();
			if(pkId == "" || pkId == undefined) {
				$yt_alert_Model.prompt("请选择要修改的数据");
			} else {
				classInfo.addShowAlert();
				classInfo.updateClassRoom()
			}
		});
		//新增修改确定按钮
		$('.add-btn-div').on('click', '.add-class-btn', function() {
			var title = $('.ticket-class-title-span').text();
			var pkId = "";
			if($yt_valid.validForm($('.repair-tab'))){
				if(title == "新增") {
				classInfo.addClassRoom(pkId);
			} else {
				pkId = $('.yt-table-active .pkId').val();
				classInfo.addClassRoom(pkId);
			}
			}
		});
		//点击删除 班级  
		$(".deleteList").on('click', function() {
			if($(".yt-table-active").length == 0) {
				$yt_alert_Model.prompt("请选择要删除的数据");
				return false;
			}
			classInfo.getClassName($(".yt-table-active").find('.classroom-name').text());
		});
		//教室类型管理,显示弹窗
		$(".btn-all").on('click', '.add-class-roomtype-btn', function() {
			classInfo.classRoomTpyeShowAlert();
			classInfo.deleteNum=0;
			//$('.add-classroom-name').niceSelect();
		});
		//点击新增教室类型-----动态新增一行
		$(".add-one-line").on('click', function() {
			//获取表格的最后一行的输入框的是否为空
			var typeName = $('.add-one-line-tbody tr:last').find('.typeName').val();
			if(typeName == "") {
				//调用判空函数
				$yt_valid.validForm($(".add-one-line-tab"));
			} else {
				var length = $('.add-one-line-tbody tr').length + 1;
				var addOneHtml = '<tr>' +
					'<td style="text-align:center;" class="order"><input class="yt-input input-style type-id" type="hidden" value="" /><span>' + length + '</span></td>' +
					'<td style="position:relative;text-align:center;">' +
					'<input class="yt-input input-style add-room-type typeName" style="width:300px" value="" placeholder="请输入" type="text" validform="{isNull:true,blurFlag:true,size:20,msg:\'不能为空,不要超过10个字\'}"/>' +
					'<span class="valid-font" style="left:45px;"></span>' +
					'</td>' +
					'<td style="text-align:center;"><img style="margin:0px;" class="entry-del-icon del-img" src="../../resources/images/open/delete.png" /></td>' +
					'</tr>';
				$('.add-one-line-tbody').append(addOneHtml);
			}
		});
		//新增教室类型确定按钮
		var deleteId = '';
		$(".class-btn-div").on('click', '.class-room-btn', function() {
			var bool = true;
			$.each($('.add-room-type'), function(i,n) {
				if($(n).val()==''||$(n).val().length>10){
					bool = false;
				}
			});
			if(bool){
				classInfo.addClassRoomType(deleteId);
			}else{
				$yt_alert_Model.prompt('类型名称不能为空，且不能超过10个字');
			}
		});
		//删除教室类型确定按钮

		$(".add-one-line-tbody").on('click', '.del-img', function() {
			$(this).addClass('delete-img');
			//删除新增的一行
			if(deleteId != '') {
				deleteId += "," + $(".add-one-line-tbody .delete-img").parent().parent().find('.type-id').val();
			} else {
				deleteId += $(".add-one-line-tbody .delete-img").parent().parent().find('.type-id').val();
			}
			$(".add-one-line-tbody .delete-img").parent().parent().remove();
			$('#pop-modle-alert').show();
			var order = $('.add-one-line-tab .add-one-line-tbody tr');
			$.each(order, function(i, v) {
				i = i + 1;
				$(v).find('.order span').text(i);
			});
			classInfo.deleteNum++;
			//获取删除行的教室类型id
			//var typeId=$(this).parent().parent().find('.type-id').val();
			//如果typeId为空该行是新增，否者原有
			//			if(typeId==""){
			//			}else{
			//				$yt_alert_Model.alertOne({
			//					alertMsg: "数据删除将无法恢复,确认删除吗?", //提示信息  
			//					confirmFunction: function() { //点击确定按钮执行方法  
			//						//删除原有的，并获取pkId
			//						var classRoomTypeId = $(this).parent().parent().find('.type-id').val();
			//						$(this).parent().parent().remove();
			//						classInfo.delClassRoomTypeInfo(classRoomTypeId);
			//					},
			//				});
			//				
			//				
			//			}

		});
		//点击查询
		$('.key-word').off().on('click', '.search-btn', function() {
			//调用获取列表数据方法查询
			classInfo.getPlanListInfo();
		});
		//标记无效
		$('.update-effective-true').click(function(){
			if($('.yt-table-active').length>0){
				classInfo.effective($('.yt-table-active').data('legalData').pkId,0)
			}else{
				$yt_alert_Model.prompt('请选择需要标记的数据')
			}
			
		})
		//标记有效
		$('.update-effective-cancel').click(function(){
			if($('.yt-table-active').length>0){
				classInfo.effective($('.yt-table-active').data('legalData').pkId,1)
			}else{
				$yt_alert_Model.prompt('请选择需要标记的数据')
			}
		})
		
	},
	deleteNum:0,
	//获取教室类型
	getRoomTypeList: function() {
		var list = [];
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "classroom/lookForAllClassroomType",
			data: {
				typeName: ""
			},
			async: false,
			success: function(data) {
				typeList = data.data || [];
				if(typeList != null) {
					$.each(typeList, function(i, n) {
						$(".add-type-name-select").append('<option value="' + n.typeId + '">' + n.typeName + '</option>');
					});
					$(".add-type-name-select").niceSelect();
				}

			}
		});
	},

	//获取所有教室类型
	getClassRoomType: function() {
		$('.add-one-line-tbody').empty();
		var selectParam = "";
		var addOneHtml;
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "classroom/lookForAllClassroomType",
			data: {
				selectParam: selectParam
			},
			async: false,
			success: function(data) {
				if(data.data.length != 0) {
					$.each(data.data, function(i, v) {
						addOneHtml = '<tr>' +
							'<td style="text-align:center;" class="order"><input class="yt-input input-style type-id" type="hidden" value="' + v.typeId + '" /><span>' + (i + 1) + '</span></td>' +
							'<td style="text-align:center"><input class="yt-input add-room-type typeName" style="width: 300px;" type="text" value="' + v.typeName + '" /></td>' +
							'<td style="text-align:center;"><img style="margin:0px;" class="del-class-roomtype del-img" src="../../resources/images/open/delete.png" /></td>' +
							'</tr>';
						if(',6,7,'.indexOf(','+v.typeId+',')!=-1){
							addOneHtml= $(addOneHtml);
							$(addOneHtml).find('.typeName').attr('disabled','disabled').css('background','#eee');
							$(addOneHtml).find('img').remove();
							$('.add-one-line-tbody').prepend($(addOneHtml));
						}else{
							$('.add-one-line-tbody').append(addOneHtml);
						}
					});
					$.each($('.add-one-line-tbody tr'), function(a,b) {
						$(b).find('.order span').text(a+1);
					});
				}
			}
		});
	},
	//新增教室类型   
	addClassRoomType: function(deleteClassroomtype) {
		//获取所有新增教室类型
		var classRoomArr = []; // 定义一个空数组
		var pkId;
		var typeName;
		var typeTypeName = $('.add-one-line-tbody tr');
		$.each(typeTypeName, function(i, b) {
			// 循环获取pkid
			var pkId = $(b).find('.type-id').val()
			// 循环获取typName
			var typeName = $(b).find('.typeName').val()
			//把每一行的pkId typName定义一个Map集合
			var roomMap = {
				pkId: pkId,
				typeName: typeName
			};
			//把map集合放进数组里
			classRoomArr.push(roomMap); // 将文本框的值添加到数组中

		});
		//把数组转换为json字符串
		var classroomTypeData = JSON.stringify(classRoomArr);
		if(classInfo.deleteNum!=0){
			$yt_alert_Model.alertOne({
				haveCloseIcon: false, //是否带有关闭图标  
				closeIconUrl: "./resources/images/icons/x.png", //关闭图标路径  
				leftBtnName: "确定", //左侧按钮名称,默认确定  
				rightBtnName: "取消",
				cancelFunction: function() {
					$(".add-one-line-tbody .del-img").removeClass('delete-img');
					$('#pop-modle-alert').show();
				},
				alertMsg: "数据删除将无法恢复，确认删除吗？", //提示信息  
				confirmFunction: function() { //点击确定按钮执行方法  
					add();
				}
			});
		}else{
			add();
		}
		function add(){
			$.ajax({
			type: "post",
			url: $yt_option.base_path + "classroom/addClassroomType",
			data: {
				deleteClassroomtype: deleteClassroomtype,
				classroomTypeData: classroomTypeData
			},
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag == 0) {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("保存成功");
					});
					//$('.page-info').pageInfo("refresh");
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("保存失败");
					});

				}
			}
		});
		//隐藏页面中自定义的表单内容  
		$(".yt-edit-alert,#heard-nav-bak").hide();
		//隐藏蒙层  
		$("#pop-modle-alert").hide();
		}
	},
	//删除教室类型功能
	//	delClassRoomTypeInfo: function(classRoomTypeId) {
	//		$yt_baseElement.showLoading();
	//		$.ajax({
	//			type: "post",
	//			url: $yt_option.base_path + "classroom/addClassroomType",
	//			data: {
	//				deleteClassroomtype: classRoomTypeId,
	//				classroomTypeData: ""
	//			},
	//			success: function(data) {
	//				if(data.flag == 0) {
	//					$yt_baseElement.hideLoading(function() {
	//						$yt_alert_Model.prompt("删除成功");
	//					});
	//					$('.page-info').pageInfo("refresh");
	//				} else {
	//					$yt_baseElement.hideLoading(function() {
	//						$yt_alert_Model.prompt("删除失败");
	//					});
	//
	//				}
	//			}
	//
	//		});
	//	},

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
		//获取教师类型
		$(".add-type-name-select").find("option").remove();
		$(".add-type-name-select").niceSelect();
		classInfo.getRoomTypeList();
		/** 
		 * 点击确定
		 */
	},
	//新增教室类型弹窗
	classRoomTpyeShowAlert: function() {
		//获取所有教室类型
		classInfo.getClassRoomType();
		 /** 
         * 显示编辑弹出框和显示顶部隐藏蒙层 
         */  
        $(".class-room-tye-shuttle-box").show();
        /** 
         * 调用算取div显示位置方法 
         */  
        $yt_alert_Model.getDivPosition($(".class-room-tye-shuttle-box"));  
        /* 
         * 调用支持拖拽的方法 
         */  
        $yt_model_drag.modelDragEvent($(".class-room-tye-shuttle-box .yt-edit-alert-title"));  
        
		/** 
		 * 点击取消方法 
		 */
		$('.class-room-tye-shuttle-box .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
			//隐藏页面中自定义的表单内容  
			$(".yt-edit-alert,#heard-nav-bak").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
	},

	/**
	 * 获教室信息列表
	 */
	getPlanListInfo: function() {
		$yt_baseElement.showLoading();
		var keyword = $('#keyword').val();
		var buildingNo = "";
		$('.page-info').pageInfo({
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "classroom/lookForAll", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam: keyword
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.list-table .yt-tbody');
					var htmlTr = '';
					var num = 1;
					if(data.data.rows.length > 0) {
						$(htmlTbody).empty();
						$.each(data.data.rows, function(i, v) {
							if(v.buildingNo == 1) {
								buildingNo = "A座"
							}
							else if(v.buildingNo == 2) {
								buildingNo = "B座"
							}else if(v.buildingNo == 3) {
								buildingNo = "3号楼"
							}else{
								buildingNo=''
							}
							if(v.isEffective==0){
								v.isEffectiveVal='无效'
							}else if(v.isEffective==1){
								v.isEffectiveVal='有效'
							}else{
								v.isEffectiveVal=''
							}
							i = i + 1;
							htmlTr = '<tr>' +
								'<td style="text-align:center;">' + i + '</td>' +
								'<td style="display:none;"><input type="hidden" value="' + v.pkId + '" class="pkId"><a href="#" classInfo="real-name-inf" style="color:blue">' + v.carNum + '</a></td>' +
								'<td class="classroom-name">' + v.classroomName + '</td>' +
								'<td style="text-align:center;" class="type-name"><input type="hidden" value="' + v.typeId + '" class="type-id">' + v.typeName + '</td>' +
								'<td style="text-align:center;" class="building-no">' + buildingNo + '</td>' +
								'<td style="text-align:center;" class="classroom-num">' + v.classroomNum + '</td>' +
								'<td style="text-align:center;" class="classroom-person-num">' + v.classroomPersonNum + '</td>' +
								'<td class="base-facility">' + v.baseFacility + '</td>' +
								'<td class="isEffective">' + v.isEffectiveVal + '</td>' +
								'<td class="remarks">' + v.remarks + '</td>' +
								'</tr>';
							htmlTbody.append($(htmlTr).data("legalData", v));
						});
					} else {
						$(htmlTbody).empty();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="9" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						$('.page1').hide();
						htmlTbody.html(htmlTr);
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
	//初始化新增框
	clearAddAlertBox: function() {
		$('.add-classroom-name').val("");
		$('.add-type-name-select').setSelectVal("");
		$('.add-building-no').setSelectVal("");
		$('add-classroom-num').val("");
		$('.add-classroom-person-num').val("");
		$(".input-style").val("");
		$('.equipment').setCheckBoxState("uncheck");
		$('#baseFacilityOther').setCheckBoxState("uncheck");
		$('#baseFacilityOther').val("");
		$('#baseFacilityOtherText').val("");
		$('#remarks').val("");
	},
	//新增功能
	addClassRoom: function(pkId) {
		var pkId;
		var classroomName = $('.add-classroom-name').val();
		var typeId = $('.add-type-name-select').val();
		var buildingNo = $('.add-building-no').val();
		var classroomNum = $('.add-classroom-num').val();
		var classroomPersonNum = $('.add-classroom-person-num').val();
		//白板
		var blank;
		//投影仪
		var projector;
		//扩音器
		var megaphone;
		//其他id
		var baseFacilityOther;
		//其他内容
		var baseFacilityOtherText;
		//定义一个接受字符串变量
		var baseFacility = "";
		//遍历被选中的多选框
		var checkAll = $('.tr-checkbox').find('.equipment-checkbox')
		$.each(checkAll, function(i, c) {
			if($(c).hasClass("check")) {
				if(baseFacility == "") {
					baseFacility = $(c).find('.equipment').val();
					if($(c).find('.equipment').val() == 4) { //为其他设备
						//获取其他设备名
						baseFacilityOtherText = $(c).next().val();
					}
				} else {
					baseFacility += "," + $(c).find('.equipment').val();
					if($(c).find('.equipment').val() == 4) { //为其他设备
						//获取其他设备名
						baseFacilityOtherText = $(c).next().val();
					}
				}
			}

		});
		var remarks = $('#remarks').val();
			$.ajax({
			type: "post",
			url: $yt_option.base_path + "classroom/addOrUpdateClassroom",
			data: {
				pkId: pkId,
				classroomName: classroomName,
				typeId: typeId,
				buildingNo: buildingNo,
				classroomNum: classroomNum,
				classroomPersonNum: classroomPersonNum,
				baseFacility: baseFacility,
				baseFacilityOther: baseFacilityOtherText,
				remarks: remarks
			},
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					$yt_baseElement.hideLoading();
					$yt_alert_Model.prompt("提交成功");
					//隐藏页面中自定义的表单内容  
					$(".yt-edit-alert,#heard-nav-bak").hide();
					//隐藏蒙层  
					$("#pop-modle-alert").hide();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("提交失败");
					});

				};
				//先调用列表方法
				classInfo.getPlanListInfo();
			}
		});
	},
	//查询教室占用情况
	getClassName:function(classroomName){
		$.ajax({
			type:"post",
			url:$yt_option.base_path+ "classroom/getClassRooms",
			async:true,
			data:{
				monthData:'',
				classroomName:classroomName,
				pageIndexs:1,
				pageNum:10000
			},
			beforeSend:function(){
				$yt_baseElement.showLoading()
			},
			success:function(data){
				if(data.flag==0){
					$yt_baseElement.hideLoading(function(){
						console.log(data.data.rows[0].classroomStates);
						if(data.data.rows[0].classroomStates.length!=0){
							$yt_alert_Model.prompt('该教室已被占用，无法删除')
						}else{
							classInfo.delclassInfo();
						}
					})
				}
			},
			error:function(){
				
			}
		});
		
	},
	//初始化修改能数据
	updateClassRoom: function() {
		//初始化
		classInfo.clearAddAlertBox();
		var pkId = $('.yt-table-active .pkId').val();
		var classroomName = $('.yt-table-active .classroom-name').text();
		var typeId = $('.yt-table-active .type-id').val();
		var buildingNo = $('.yt-table-active .building-no').text()
		var classroomNum = $('.yt-table-active .classroom-num').text()
		var classroomPersonNum = $('.yt-table-active .classroom-person-num').text()
		var baseFacility = $('.yt-table-active .base-facility').text();

		//其他设备
		var baseFacilityOtherText;
		$('.add-classroom-name').val(classroomName);
		$('.add-type-name-select').setSelectVal(typeId);
		$('.add-building-no').setSelectVal(buildingNo);
		$('.add-classroom-num').val(classroomNum);
		$('.add-classroom-person-num').val(classroomPersonNum);
		//切割获取到的设备字符串
		var baseFacilityArr = baseFacility.split(',');
		for(var i in baseFacilityArr) {
			if(baseFacilityArr[i] == "白板") {
				$(".blank").setCheckBoxState("check");
			} else if(baseFacilityArr[i] == "投影") {
				$(".projector").setCheckBoxState("check");
			} else if(baseFacilityArr[i] == "扩音器") {
				$(".megaphone").setCheckBoxState("check");
			} else {
				if(baseFacilityArr[i] != "") {
					$(".baseFacilityOther").setCheckBoxState("check");
					baseFacilityOtherText = $('#baseFacilityOtherText').val(baseFacilityArr[i]);
				}

			}
		};
		var remarks = $('.yt-table-active .remarks').text()
		$('#remarks').val(remarks);
	},

	//删除班级功能
	delclassInfo: function() {
		var pkId = $('.yt-table-active .pkId').val();
		$yt_alert_Model.alertOne({
			haveCloseIcon: false, //是否带有关闭图标  
			closeIconUrl: "", //关闭图标路径  
			leftBtnName: "确定", //左侧按钮名称,默认确定  
			rightBtnName: "取消", //右侧按钮名称,默认取消  
			cancelFunction: "", //取消按钮操作方法*/  
			alertMsg: "数据删除将无法恢复，确认删除吗？", //提示信息  
			confirmFunction: function() { //点击确定按钮执行方法  
				$yt_baseElement.showLoading();
				$.ajax({
					type: "post",
					url: $yt_option.base_path + "classroom/deleteClassroom",
					data: {
						pkId: pkId
					},
					success: function(data) {
						if(data.flag == 0) {
							$yt_baseElement.hideLoading(function() {
								$yt_alert_Model.prompt("删除成功");
							});
							$('.page-info').pageInfo("refresh");
						} else {
							$yt_baseElement.hideLoading(function() {
								$yt_alert_Model.prompt("删除失败");
							});

						}
					}

				});

			}
		});
	},
	//标记有效无效
	effective:function(pkId,isEffective){
		$.ajax({
			type:"post",
			url:$yt_option.base_path+"classroom/updateClassroomEffective",
			async:false,
			data:{
				pkId:pkId,
				isEffective:isEffective
			},
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			success:function(data){
				if(data.flag==0){
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt('标记成功')
						$('.table-page').pageInfo('refresh');
					})
				}else{
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt('标记失败')
					})
				}
			},
			error:function(){
				$yt_baseElement.hideLoading(function(){
					$yt_alert_Model.prompt('网络异常，标记失败')
				})
			}
		});
	}

}
$(function() {
	//初始化方法
	classInfo.init();
});