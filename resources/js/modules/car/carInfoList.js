var carList = {
	//初始化方法
	init: function() {
		//初始化创建时间
		$(".calendar-input").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			lowerLimit: "2010/01/01", // 日期下限，默认：NaN(不限制)     
			nowData: true, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd",
			callback: function() {} // 点击选择日期后的回调函数  
		});
		
		//点击新增
		$(".addList").click(function() {
			//显示减弹出框
			$(".select-teacher-div").show();
			//计算弹出框位置
			$yt_alert_Model.setFiexBoxHeight($(".select-teacher-div .yt-edit-alert-main"));
			$yt_alert_Model.getDivPosition($(".select-teacher-div"));
			$yt_model_drag.modelDragEvent($(".select-teacher-div .yt-edit-alert-title"));
			carList.clearAlertBox();
			var carTypeList = carList.getcarTypeLis();
			if(carTypeList != null) {
				$("#carType").empty();
				$("#carType").append('<option value="">请选择</option>');
				$.each(carTypeList.data, function(i, n) {
					$("#carType").append($('<option value="' + n.pkId + '">' + n.typeName + '</option>').data("classData", n));
				});
			};
			$("select").niceSelect();
			//新增修改确定按钮
			$('.add-edita-btn-div').off().on('click','.sreduction-details-sure-btn',function() {
				carList.isOrNll('');
			});
			//取消按钮
			$('.sreduction-details-canel-btn').off().on("click", function() {
				//隐藏页面中自定义的表单内容  
				$(".yt-edit-alert,#heard-nav-bak").hide();
				$("#pop-modle-alert").hide();
			});
		});

		//点击修改
		$(".updateList").click(function() {
			carList.clearAlertBox();
			var pkId = $('.yt-table-active .pkId').val();
			$(".select-teacher-title-span").text("修改车辆信息");
			if(pkId == "" || pkId == undefined) {
				$yt_alert_Model.prompt("请选择要修改的数据");
			} else {
				//显示减弹出框
				$(".select-teacher-div").show();
				//计算弹出框位置
				$yt_alert_Model.setFiexBoxHeight($(".select-teacher-div .yt-edit-alert-main"));
				$yt_alert_Model.getDivPosition($(".select-teacher-div"));
				$yt_model_drag.modelDragEvent($(".select-teacher-div .yt-edit-alert-title"));
				var carTypeList = carList.getcarTypeLis();
				if(carTypeList != null) {
					$("#carType").empty();
					$("#carType").append('<option value="">请选择</option>');
					$.each(carTypeList.data, function(i, n) {
						$("#carType").append($('<option value="' + n.pkId + '">' + n.typeName + '</option>').data("classData", n));
					});
				};
				$("select").niceSelect();
				//调用设置获取值方法
				carList.UpdateCarInfo(pkId);
				$('.add-edita-btn-div').off().on('click','.sreduction-details-sure-btn',function() {
				var pkId = $('.yt-table-active .pkId').val();
				carList.isOrNll(pkId);
				});	
				//取消按钮
				$('.sreduction-details-canel-btn').off().on("click", function() {
					//隐藏页面中自定义的表单内容  
					$(".yt-edit-alert,#heard-nav-bak").hide();
					$("#pop-modle-alert").hide();
				});

			}
		});
		
		//点击删除   
		$(".deleteList").on('click', function() {
			if($("tr.yt-table-active").length == 0) {
				$yt_alert_Model.prompt("请选择要删除的数据");
				return false;
			}
			carList.delCarList();
		});

		//定义变量，标识是报修还是维修功能
		var type;
		//点击维修
		$(".repair-work").on('click', function() {
			$('#details').val("");
			var pkId = $('.yt-table-active .pkId').val();
			$('.alert-title-span').text("维修");
			if(pkId == "" || pkId == undefined) {
				$yt_alert_Model.prompt("请选择要维修车辆");
			} else {
				$('.recordDate').text("维修日期：");
				$('.details').text("维修内容：");
				carList.showAlert();
				type = 1;
			}

		});
		//点击报废
		$(".repair-report").on('click', function() {
			$('#details').val("");
			var pkId = $('.yt-table-active .pkId').val();
			$('.alert-title-span').text("报废");
			if(pkId == "" || pkId == undefined) {
				$yt_alert_Model.prompt("请选择要报废车辆");
			} else {
				$('.recordDate').text("报废日期：");
				$('.details').text("报废原因：");
				carList.showAlert();
				type = 2
			}
		});
		//车辆报修维修确定按钮
		$('.yt-model-sure-btn').on('click', function() {
			var details = $('#details').val();
			if(details == "") {
				$yt_valid.validForm($(".repair-tab"));
			} else {
				carList.reparWorkReport(type);
			}

		});

		//查看详情
		$(".list-tbody").on('click', '.real-name-inf', function() {
			window.location.href = "lookInfo.html?pkId=" + $(this).prev().val();
		});

		//调用获取列表数据方法
		carList.getPlanListInfo();
		//点击查询
		$('.key-word').off().on('click', '.search-btn', function() {
			//调用获取列表数据方法查询
			carList.getPlanListInfo();
		});

		$('input').blur(function(){
			$yt_valid.validForm($(".add-edit-table"));
		});

	},
	showAlert: function() {
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$(".shuttle-box").show();
		/** 
		 * 调用算取div显示位置方法 
		 */
		$yt_alert_Model.getDivPosition($(".shuttle-box"));
		/* 
		 * 调用支持拖拽的方法 
		 */
		$yt_model_drag.modelDragEvent($(".shuttle-box .yt-edit-alert-title"));
		/** 
		 * 点击取消方法 
		 */
		$('.shuttle-box .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
			//隐藏页面中自定义的表单内容  
			$(".yt-edit-alert,#heard-nav-bak").hide();
			$("#pop-modle-alert").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
	},
	//新增、修改车辆
	addCarInfo: function(pkId) {
		$yt_baseElement.showLoading();
		var carNum = $('#carNum').val();
		var carType = $('#carType').val();
		var carBrand = $('#carBrand').val();
		var carModel = $('#carModel').val();
		var carColor = $('#carColor').val();
		var carSource = $('#carSource').val();
		var engineNumber = $('#engineNumber').val();
		var carBuyString = $('#carBuyString').val();
		var remarks = $('#remarks').val();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "administrator/car/addOrUpdateCar",
			data: {
				pkId: pkId,
				carNum: carNum,
				carType: carType,
				carBrand: carBrand,
				carModel: carModel,
				carColor: carColor,
				carSource: carSource,
				engineNumber: engineNumber,
				carBuyString: carBuyString,
				remarks: remarks,
			},
			success: function(data) {
				if(data.flag == 0) {
					if(pkId == '') {
						$yt_alert_Model.prompt("添加成功");
						$yt_baseElement.hideLoading();
						$(".yt-edit-alert,#heard-nav-bak").hide();
						$("#pop-modle-alert").hide();
						carList.getPlanListInfo();
					} else {
						$yt_alert_Model.prompt("修改成功");
						$yt_baseElement.hideLoading();
						$(".yt-edit-alert,#heard-nav-bak").hide();
						$("#pop-modle-alert").hide();
						carList.getPlanListInfo();
					}
				} else {
					if(pkId == '') {
						$yt_baseElement.hideLoading(function() {
							$yt_alert_Model.prompt("添加失败");
						});
					} else {
						$yt_baseElement.hideLoading(function() {
							$yt_alert_Model.prompt("修改失败");
						});
					}
				}
			}
		});
	},
	//判空
	isOrNll: function(pkId) {
		var reg='^[京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[警京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼]{0,1}[A-Z0-9]{4}[A-Z0-9挂学警港澳]{1}$';
		var carNum = $('#carNum').val();
		var carDate=$("#carBuyString").val();
//		var carBrand = $('#carBrand').val();
//		var carModel = $('#carModel').val();
//		var carColor = $('#carColor').val();
//		var carSource = $('#carSource').val();
//		var engineNumber = $('#engineNumber').val();
		//$yt_valid.validForm($("#add-car-tab"));
		//console.log($yt_valid.validForm($("#carNum")));
		debugger
		if(carDate==""){
			$("#carBuyString").addClass('valid-hint');
			$("#carBuyString").parent().find('.valid-font').text("请选择购买日期");
		}else{
			$("#carBuyString").removeClass('valid-hint');
			$("#carBuyString").parent().find('.valid-font').text("");
		}
		if(carNum == "" || carDate == "") {
			$yt_alert_Model.prompt("车牌号与购车日期为必填项");
		} else {
			if(carNum.search(reg)!=-1){
				carList.addCarInfo(pkId);
			}
		}
	},
	//获取车辆类型
	getcarTypeLis: function() {
		var list = [];
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "administrator/car/getType",
			data: {
				types: '1'
			},
			async: false,
			success: function(data) {
				list = data || [];
			}
		});
		return list;
	},
	//清空输入框
	clearAlertBox: function() {
		$('#carNum').val("");
		$('#carType').setSelectVal("0");
		$('#carNum,#carBuyString').removeClass('valid-hint');
		$('#carBrand').val("");
		$('#carModel').val("");
		$('#carColor').val("");
		$('#carSource').val("");
		$('#engineNumber').val("");
		$('.valid-font').text(""); 	
		$('#carBuyString').val("");
		$('#remarks').val('');
		$('select').niceSelect();
	},
	//车辆维修报废
	reparWorkReport: function(type) {
		//$yt_baseElement.showLoading();
		var pkId = $('.yt-table-active .pkId').val();
		var recordDate = $('#recordDate').val();
		var details = $('#details').val();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "administrator/car/updateCarStates",
			data: {
				pkId: pkId,
				types: type,
				recordDate: recordDate,
				details: details
			},
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt("填报成功");
					$(".yt-edit-alert,#heard-nav-bak").hide();
					$("#pop-modle-alert").hide();
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("填报失败");
					});
				}
			}

		});
		carList.init();
	},

	/**
	 * 获取车辆信息列表
	 */
	getPlanListInfo: function() {
		var keyword = $('#keyword').val();
		$('.page-info').pageInfo({
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "administrator/car/lookForAll", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam: keyword
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			async:true,
			before:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				var carStates = "";
				if(data.flag == 0) {
					var htmlTbody = $('.list-table .yt-tbody');
					var htmlTr = '';
					var num = 1;
					if(data.data.rows.length > 0) {
						$(htmlTbody).empty();
						$.each(data.data.rows, function(i, v) {
							if(v.carStates == "1") {
								carStates = "使用中";
							}else {
								carStates = "已报废";
							}
							i = i + 1;
							htmlTr = '<tr>' +
								'<td style="text-align:center !important;">' + i + '</td>' +
								'<td style="text-align:center !important;"><input type="hidden" value="' + v.pkId + '" class="pkId"><a href="#" class="real-name-inf yt-link" style="color:#3c4687;">' + v.carNum + '</a></td>' +
								'<td style="text-align:left !important;">' + v.carBrandModel + '</td>' +
								'<td style="text-align:center !important;">' + v.carTypeName + '</td>' +
								'<td style="text-align:center !important;">' + v.carBuyString + '</td>' +
								'<td style="text-align:center !important;">' + carStates + '</td>' +
								'</tr>';
							htmlTbody.append($(htmlTr).data("legalData", v));
						});
					}
					else {
						$(htmlTbody).empty();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="6" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						$('.page1').hide();
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
	},
	//删除
	delCarList: function() {
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
					url: $yt_option.base_path + "administrator/car/removeBeanById",
					data: {
						pkId: pkId
					},
					success: function(data) {
						if(data.flag == 0) {
							$yt_baseElement.hideLoading();
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
	//获取车辆详细信息
	UpdateCarInfo: function(pkId) {
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "administrator/car/getBeanById",
			data: {
				pkId: pkId
			},
			success: function(data) {
				$yt_baseElement.showLoading();
				if(data.flag == 0) {
					$('#carNum').val(data.data.carNum);
					$('#carType').setSelectVal(data.data.carType);
					$('#carBrand').val(data.data.carBrand);
					$('#carModel').val(data.data.carModel);
					$('#carColor').val(data.data.carColor);
					$('#carSource').val(data.data.carSource);
					$('#engineNumber').val(data.data.engineNumber);
					$('#carBuyString').val(data.data.carBuyString);
					$('#remarks').val(data.data.remarks);
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}
			}
		});
	}
}
$(function() {
	//初始化方法
	carList.init();
});