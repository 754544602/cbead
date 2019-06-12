/**
 * 调查问卷模板管理
 */
var quList = {
	//初始化方法
	init: function() {
		//超链接跳转传参
		//调用获取列表数据方法
		quList.getPlanListInfo();
		//点击选学班次问卷
		$('.class-tbody').off('click').on('click', '.question1', function() {
			var pkId = $(this).parent().parent().find('.pk-id').val();
			location.href = "approvalDetails.html?pkId=" + pkId;
		});
		//点击非选学班次问卷
		$('.class-tbody ').on('click', '.question2', function() {
			var pkId = $(this).parent().parent().find('.pk-id').val();
			location.href = "nonSelection.html?pkId=" + pkId;
		});
	},

	/**
	 * 获取列表数据
	 */
	getPlanListInfo: function() {
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			url: $yt_option.base_path + "questionnaire/lookForAll", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.class-tbody');
					var htmlTr = '';
					if(data.data.length > 0) {
						$.each(data.data, function(i, v) {
							htmlTr += '<tr>' +
								'<input type="hidden" class="pk-id" value="' + v.pkId + '">' +
								'<td><a style="color:#3c4687;" class="yt-link question' + v.types + '">' + v.templateName + '</a></td>' +
								'<td>' + v.updateUserName + '</td>' +
								'<td>' + v.updateTime + '</td>' +
								'</tr>';
						});
					} else {
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="3" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
					}
					
					htmlTbody.html(htmlTr);
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading();
				} else {	
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt("查询失败");
					});
					
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},

}
$(function() {
	//初始化方法
	quList.init();

});