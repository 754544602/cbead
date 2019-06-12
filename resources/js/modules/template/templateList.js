var templateList = {
	//初始化方法
	init: function() {
		
		//调用获取列表数据方法
		templateList.gettemplateListInfo();
		
		
		
		//条件搜索
		$('.seach-btn').click(function() {
			//调用获取列表数据方法查询
			templateList.gettemplateListInfo();
		});
	},
		
	/**
	 * 获取列表数据
	 */
	gettemplateListInfo: function() {
		$yt_baseElement.showLoading();
		searchParameters=$('#keyword').val(); 
		$('.template-page').pageInfo({
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "class/printing/lookForAll", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				searchParameters:searchParameters,
				printingStates:"",
				startTime:"",
				endTime:"",
				createTimeStart:"",
				createTimeEnd:""
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				$yt_baseElement.showLoading();
				if(data.flag == 0) {
					var htmlTbody = $('.template-tbody');
					var htmlTr = '';
					var num = 1;
					if(data.data.rows.length > 0) {
						$.each(data.data.rows, function(i, v) {
							htmlTr += '<tr>' +
								'<td><input type="hidden" value="' + v.pkId + '" class="pkId">' + num++ + '</td>' +
								'<td><a class="file-name">'+v.fileName+'</a></td>' +
								'<td>' + v.createUserName + '</td>' +
								'<td>' + v.createTimeString + '</td>' +
								'</tr>';
						});
					} else {
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="10" align="center" style="border:0px;">' +
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
	
}
$(function() {
	//初始化方法
	templateList.init();
	
});