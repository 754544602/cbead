var caList = {
	
	//初始化方法
	init: function() {
		//初始化新增页面
		caList.clearAlertBox();
		//获取班级详情
		var pkId=$yt_common.GetQueryString("pkId");
		if(pkId!=""){
			caList.UpdateCarInfo(pkId);
		};
		//初始化下拉列表
		$('select').niceSelect();
		
		//初始化创建时间
		$("#carBuyString").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
		    complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
		    readonly: true, // 目标对象是否设为只读，默认：true     
		    lowerLimit:"2010/01/01", // 日期下限，默认：NaN(不限制)     
		    nowData:true,//默认选中当前时间,默认true  
		    dateFmt:"yyyy-MM-dd", 
			callback: function() {} // 点击选择日期后的回调函数  
		});
		//车辆类型
		var carTypeList = caList.getcarTypeLis();
		if(carTypeList != null) {
			$.each(carTypeList.data, function(i, n) {
				$("#carType").append($('<option value="' + n.pkId + '">' + n.typeName + '</option>').data("classData", n));
			});
		};
		//初始化车辆类型
		$("#carType").niceSelect();
		//点击返回
		$('.btn-back').off().on("click", function() {
			caList.backCarInfoListPage();
		});
		//点击取消
		$('.yt-model-canel-btn').off().on("click", function() {
			caList.backCarInfoListPage();
		});
		
		//点击保存
		$('.sreduction-details-sure-btn').click( function() {
			caList.isOrNll();
		});
		
	},
	//返回新闻稿列表
	backCarInfoListPage:function(){
		window.location.href = "carInfoList.html";
	},
	//判空
	isOrNll:function(){
		var carNum=$('#carNum').val();
		var carBrand=$('#carBrand').val();
		var carModel=$('#carModel').val();
		var carColor=$('#carColor').val();
		var carSource=$('#carSource').val();
		var engineNumber=$('#engineNumber').val();
		if (carNum==""&&carBrand==""&&carModel==""&&carColor==""&&carSource==""&&engineNumber=="") {
			$yt_valid.validForm($("#add-car-tab"));
		}else{
			caList.addCarInfo();
		}
	},
	
	/**
	 * 获取所有车辆类型
	 */
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
	//点击新增清空弹窗内容
	clearAlertBox:function(){
		$('#carNum').val("");
		$('#carBrand').val("");
		$('#carModel').val("");
		$('#carColor').val("");
		$('#carSource').val("");
		$('#engineNumber').val("");
		$('#carBuyString').val("");
		$('select').niceSelect();
	},
	
	
	//新增、修改车辆
	addCarInfo:function(){
		$yt_baseElement.showLoading();
		var pkId=$yt_common.GetQueryString("pkId");
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
				pkId:pkId,
				carNum:carNum,
				carType:carType,
				carBrand:carBrand,
				carModel:carModel,
				carColor:carColor,
				carSource:carSource,
				engineNumber:engineNumber,
				carBuyString:carBuyString,
				remarks:remarks,
			},
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt("添加成功");
					$(".yt-edit-alert,#heard-nav-bak").hide();
					
				} else {
					$yt_baseElement.hideLoading(function (){
						$yt_alert_Model.prompt("添加失败");
					});
				}
				caList.backCarInfoListPage();
			}
		});
	},
	//获取车辆详细信息
	UpdateCarInfo:function(pkId){
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "administrator/car/getBeanById",
			data: {
				pkId:pkId
			},
			success: function(data) {
				$yt_baseElement.showLoading();
				if(data.flag == 0) {
					$('#carNum').val(data.data.carNum);
					$('#carType').val(data.data.carType);
					$('#carBrand').val(data.data.carBrand);
					$('#carModel').val(data.data.carModel);
					$('#carColor').val(data.data.carColor);
					$('#carSource').val(data.data.carSource);
					$('#engineNumber').val(data.data.engineNumber);
					$('#carBuyString').val(data.data.carBuyString);
					$('#remarks').val(data.data.remarks);
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function (){
						$yt_alert_Model.prompt("查询失败");
					});
				}
			}
		});
	}
	
	
	
	
};
$(function() {
	//初始化方法
	caList.init();
	
});