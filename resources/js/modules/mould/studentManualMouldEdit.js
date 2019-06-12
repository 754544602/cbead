var mouldList = {

	//初始化方法
	init: function() {
		//opertateType
		//模板操作类型的标识符
		var opertateType = $yt_common.GetQueryString("opertateType");
		if(opertateType == 1){//模板编辑
			$('.title-text-p').text("学员手册模板编辑");
			//初始化富文本编辑器
		}else{//新增手动模板
			$('.title-text-p').text("新增手动模板");
			//初始化富文本编辑器
		 	mouldList.ue = UE.getEditor('container', {
				toolbars: [
					[ 'undo', 'redo', '|',
						'bold', 'italic', 'underline', 'forecolor', '|',
						'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify','|','simpleupload','attachment'
					]
				],
				enableContextMenu:false,
				autoHeightEnabled: true,
				elementPathEnabled:false,
	            enableAutoSave :false,
	            saveInterval:0
			});
		};
		//如果type为空，就不执行查询一条详细信息
		var types = $yt_common.GetQueryString("types");
		if (types !="") {
			mouldList.getPlanListInfo();
		}
		var templateId = $yt_common.GetQueryString("templateId");
		//点击返回
		$('.page-return-btn').click(function(){
			window.location.href = "studentsManualMouldList.html?templateId="+templateId;
		});
		//点击取消
		$('.yt-model-canel-btn').click(function(){
			window.location.href = "studentsManualMouldList.html?templateId="+templateId;
		});
		//模板编辑确定按钮
		$('.add-edit-btn').click(function(){
			mouldList.isNoNull();
		});
	},
	//点击确定按钮判断标题和内容是否为空
	isNoNull:function(){
		var title = $('#title').val();
		var details = mouldList.ue.getContent();
		var types=$('input[name="mould"]:checked').val();
		if(title=="" || details==""||types==""){
			$(".types-model").show();
			$yt_valid.validForm($(".valid-tab"));
			$yt_alert_Model.prompt("信息请填写完整");
		}else{
			$(".types-model").hide();
			//调用新增修改方法
			mouldList.editMould();
		}
		
	},
	//点击新增修改模板
	editMould:function(){
		//var operateType=$('.title-text-p').text();
		var templateId = $yt_common.GetQueryString("templateId");
		var modelCode = $yt_common.GetQueryString("modelCode");
		var modelName = $('.model-name').val();
		var modelValue = mouldList.ue.getContent();
		var types = $('input[name="mould"]:checked').val();
//		if (operateType == 2) {
//			types = 3;
//		}
		$.ajax({//
			url: $yt_option.base_path + "class/traineeTemplate/addOrUpdateTemplate", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				templateId:templateId,
				modelCode:modelCode,
				modelName:modelName,
				types:types,
				modelValue:modelValue
			}, //ajax查询访问参数
			success: function(data) {
				$yt_baseElement.showLoading();
				if(data.flag == 0) {
					$yt_baseElement.hideLoading();
					window.location.href = "studentsManualMouldList.html?templateId="+templateId;
				} else {
					$yt_baseElement.hideLoading(function (){
						$yt_alert_Model.prompt("操作失败！");
					});
				}

			}, //回调函数 匿名函数返回查询结果  
		});
		
	},
		/**
	 * 获取一条详细信息
	 */
	getPlanListInfo: function() {
		var templateId = $yt_common.GetQueryString("templateId");
		var pkId = $yt_common.GetQueryString("pkId");
		var modelCode = $yt_common.GetQueryString("modelCode");
		var modelType = $yt_common.GetQueryString("types");//模板类型
		$(".check-two input[value='"+modelType+"']").setRadioState('check');
		$.ajax({
			url: $yt_option.base_path + "class/traineeTemplate/getTemplate", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				templateId:templateId,
				modelCode:modelCode
			}, //ajax查询访问参数
			success: function(data) {
				$yt_baseElement.showLoading();
				if(data.flag == 0) {
					$('.model-name').val(data.data.modelName);
					//新闻稿内容
					mouldList.ue = UE.getEditor('container', {
						toolbars: [
							[ 'undo', 'redo', '|',
								'bold', 'italic', 'underline', 'forecolor', '|',
								'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify','|','simpleupload','attachment'
							]
						],
						enableContextMenu:false,
						autoHeightEnabled: true,
						autoFloatEnabled: false,
						elementPathEnabled:false,
			            wordCount:false,
			            enableAutoSave :false,
			            enableAutoSave:false
					});
					mouldList.ue.ready(function() {
					    mouldList.ue.setContent(data.data.modelValue);
					});
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function (){
						$yt_alert_Model.prompt("查询失败");
					});
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	}
};
$(function() {
	//初始化方法
	mouldList.init();
	
});