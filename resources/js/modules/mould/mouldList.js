var mouldList = {

	//初始化方法
	init: function() {
		mouldList.getPlanListInfo();
		//点击查询
		$('.key-word').on('click', '.search-btn', function() {
			//调用获取列表数据方法查询
			mouldList.getPlanListInfo();
		});
		//点击模板名
		$('.mould-list').on('click','.template-name',function(){
			var templateId = $(this).parent().parent().find('.pk-id').text();
			if(templateId == 1){
				//跳转到学员模板
				window.location.href = "studentsManualMouldList.html?templateId="+1;
			}else if(templateId == 2){
				//跳转到教学设计模板页面
				window.location.href = "teachlMould.html?templateId="+2;
			}
			
		});
	},
	
	/**
	 * 获取列表数据
	 */
	getPlanListInfo: function() {
		var searchParameters=$('#keyword').val();
		$('.list-page').pageInfo({
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "template/lookForAll", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {selectParam:searchParameters}, //ajax查询访问参数
			async:true,
			before: function() {
	            $yt_baseElement.showLoading();
	        }, 
			success: function(data) {
				$yt_baseElement.showLoading();
				if(data.flag == 0) {
					var htmlTbody = $('.mould-list tbody');
					var htmlTr = '';
					if(data.data.rows.length > 0) {
						$('.list-page').show();
						$.each(data.data.rows, function(i, v) {
							i=i+1;
							htmlTr += '<tr>' +
								'<td style="display:none;" class="pk-id">' + v.pkId + '</td>' +
								'<td style="text-align:center;">' + i + '</td>' +
								'<td style="text-align: left;"><a style="color:#3c4687;" class="template-name">'+v.templateName+'</a></td>' +
								'<td class="update-user" style="text-align:center;">' + v.updateUser + '</td>' +
								'<td class="update-time-string" style="text-align:center;">' + v.updateTimeString + '</td>' +
								'</tr>';
						});
					} else {
						$('.list-page').hide();
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