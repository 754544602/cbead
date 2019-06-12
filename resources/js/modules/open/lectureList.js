var projectList = {
	//初始化方法
	init: function() {
	//调用查询列表函数
		projectList.getPlanListInfo();
	//点击班级名跳转到资料归档详情页面
		$('.list-tbody').on('click','.class-name',function(){
			var pkId = $(this).parent().parent().find('.pkId').text();
			var types = $(this).parent().parent().find('.types').text();
			sessionStorage.setItem("searchParams", $('#keyword').val());
			sessionStorage.setItem("pageIndexs", $('.num-text.active').text());
			//条状到资料归档页面
			window.location.href = "reviseOpenLecture.html?pkId="+pkId+"&"+"types="+types;
			
		});
		//查询按钮
		
		$('.search-btn').off().on("click", function() {
			projectList.getPlanListInfo();
		});
	},

	
	/** 
	 * 获取列表数据
	 * 
	 */
	getPlanListInfo: function() {
		sessionStorage.getItem("searchParams")?$('#keyword').val(sessionStorage.getItem("searchParams")):'';
		var queryParams = $('#keyword').val();
		$('.page-info').pageInfo({
			pageIndexs: sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "class/openHonors/lookForAllForFile", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {searchParameters: queryParams}, //ajax查询访问参数
			async:true,
			before: function() {
				$yt_baseElement.showLoading();
			}, 
			success: function(data) {
				sessionStorage.clear();
				if(data.flag == 0) {
					var htmlTbody = $('.open-class-tbody');
					var htmlTr = '';
					var num = 1;
					var xuhao=1;
					var states="";
					var type="";
					var isPhoto="";
					if(data.data.rows.length > 0) {
						$('.page-info').show();
						$.each(data.data.rows, function(i, v) {
							xuhao=i+1;
							if(v.types==1){
								type="开班式";
							}
							if(v.types==2){
								type="结业式";
							}
							if(v.isPhoto==0){
								isPhoto="未归档";
							}
							if(v.isPhoto==1){
								isPhoto="已归档";
							}
							
							htmlTr += '<tr class="td-list">' +
								'<td class="pkId" style="display:none;">' + v.pkId  + '</td>' +
								'<td class="types" style="display:none;">' + v.types+ '</td>' +
								'<td class="isPhoto-hiden" style="display:none;">' + v.isPhoto+ '</td>' +
								'<td style="text-align:center;">' + xuhao + '</td>' +
								'<td><a style="color:#3c4687;" class="class-name">'+ v.className + '</a></td>' +
								'<td style="text-align:center;">' + type + '</td>' +
								'<td class="userName" style="text-align:center;">' + v.userName + '</td>' +
								'<td style="text-align:center;">' +v.startTimeString + '</td>' +
								'<td style="text-align:center;">' +v.createUserName + '</td>' +
								'<td style="text-align:center;">' + v.createTimeString + '</td>' +
								'<td class="isPhoto"style="text-align:center;">' + isPhoto + '</td>' +
								'</tr>';
						});
					} else {
						$('.page-info').hide();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="8" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
							$('.page1').hide();
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
	},
	
	
};
$(function() {
	//初始化方法
	projectList.init();
});