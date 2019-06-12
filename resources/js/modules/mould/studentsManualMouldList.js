var mouldList = {

	//初始化方法
	init: function() {
		mouldList.getPlanListInfo();
		mouldList.getLognName();
		//点击查询
		$('.key-word').on('click', '.search-btn', function() {
			//调用获取列表数据方法查询
			mouldList.getPlanListInfo();
		});
		//点击编辑
		$('.mould-list').on('click', '.edit', function() {
			var tr = $(this).parent().parent();
			var types = tr.find('.hid-types').text();
			var templateId = $yt_common.GetQueryString("templateId");
			var modelCode = tr.find('.model-code').text();
			var pkId = tr.find('.pk-id').text();
			//跳转到学员模板
			window.location.href = "studentManualMouldEdit.html?types=" + types + "&" + "templateId=" + templateId + "&" + "opertateType=" + 1 + "&" + "modelCode=" + modelCode + "&" + "pkId=" + pkId;
		});
		//点击新增手动模板
		$('.add-mould').click(function() {
			var types = "";
			var templateId = $yt_common.GetQueryString("templateId");
			var modelCode = "";
			var modelName = "";
			window.location.href = "studentManualMouldEdit.html?types=" + types + "&" + "templateId=" + templateId + "&" + "opertateType=" + 2 + "&" + "modelCode=" + modelCode + "&" + "modelName=" + modelName;
		});

		//点击删除图标  删除一行
		$(".mould-list tbody").on('click', '.entry-del-icon', function() {
			var tr = $(this).parent().parent();
			var pkId = tr.find('.pk-id').text();
			var templateId = $yt_common.GetQueryString("templateId");
			$yt_alert_Model.alertOne({
				haveAlertIcon: false, //是否带有提示图标
				closeIconUrl: "", //关闭图标路径 
				leftBtnName: "确定", //左侧按钮名称,默认确定 
				rightBtnName: "取消", //右侧按钮名称,默认取消 
				alertMsg: "数据删除将无法恢复，确认删除吗？", //提示信息 
				confirmFunction: function() {
					$yt_baseElement.showLoading();
					$.ajax({
						type: "post",
						url: $yt_option.base_path + "class/traineeTemplate/deleteTemplae",
						data: {
							pkId: pkId,
							templateId: templateId
						},
						success: function(data) {
							if(data.flag == 0) {
								tr.remove();
								$yt_baseElement.hideLoading();
							} else {
								$yt_baseElement.hideLoading(function() {
									$yt_alert_Model.prompt("删除失败");
								});

							}
						}
					});
					$(".add-shuttle-box").show();
				},
				cancelFunction: function() {
					$(".add-shuttle-box").show();
				}

			});
		});

	},
	getLognName: function() {
		$.ajax({
			url: $yt_option.base_path + "uniform/user/getUsersDetails", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {

			}, //ajax查询访问参数  
			success: function(data) {

			}
		});
	},

	/**
	 * 获取列表数据
	 */
	getPlanListInfo: function() {
		$yt_baseElement.showLoading();
		var templateId = $yt_common.GetQueryString("templateId");
		$.ajax({
			url: $yt_option.base_path + "class/traineeTemplate/lookForAll", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				templateId: templateId,
				types: ""
			}, //ajax查询访问参数  
			success: function(data) {
				$yt_baseElement.showLoading();
				if(data.flag == 0) {
					var htmlTbody = $('.mould-list tbody');
					var htmlTr = '';
					var types = "";
					var operateHtml = "--";
					if(data.data.length > 0) {
						$.each(data.data, function(i, v) {
							i = i + 1;
							if(v.types == 1) {
								types = "自动";
								operateHtml = "--"
							};
							if(v.types == 2) {
								types = "模板";
								operateHtml = '<span class="edit"><img style="vertical-align: middle;" class="bulletin-update" src="../../resources/images/icons/amend.png"/></span>' +
									'<span style="color:#CCCCCC;margin: 0px 4px;">|</span>' +
									'<span class="delete entry-del-icon">' +
									'<img style="vertical-align: middle;" class="ioc-img" src="../../resources/images/open/delete.png" />' +
									'</span>';
							};
							if(v.types == 3) {
								types = "手动";
								if(v.modelName=='微信信息'||v.modelName=='委托单位工作人员'||v.modelName=='学院项目组成员'){
									operateHtml= ' ';
								}else{
								operateHtml = '<span class="edit"><img style="vertical-align: middle;" class="bulletin-update" src="../../resources/images/icons/amend.png"/></span>' +
									'<span style="color:#CCCCCC;margin: 0px 4px;">|</span>' +
									'<span class="delete entry-del-icon">' +
									'<img style="vertical-align: middle;" class="ioc-img" src="../../resources/images/open/delete.png" />' +
									'</span>';
								}
							};

							htmlTr += '<tr>' +
								'<td style="display:none;" class="pk-id">' + v.pkId + '</td>' +
								'<td style="display:none;" class="model-code">' + v.modelCode + '</td>' +
								'<td style="display:none;" class="model-order">' + v.modelOrder + '</td>' +
								'<td style="text-align:center;">' + i + '</td>' +
								'<td style="text-align: left;"><a class="template-name">' + v.modelName + '</a></td>' +
								'<td class="hid-types" style="display:none;">' + v.types + '</td>' +
								'<td class="types" style="text-align:center;">' + types + '</td>' +
								'<td class="operate-td" style="text-align:center;">' + operateHtml + '</td>' +
								'</tr>';
						});
					} else {
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="4" align="center" style="border:0px;">' +
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
	}
};
$(function() {
	//初始化方法
	mouldList.init();

});