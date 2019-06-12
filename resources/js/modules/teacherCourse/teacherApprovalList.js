var teacher = {
	//初始化方法
	init: function() {
		teacher.getPlanListInfo();
		$(".search-btn").click(function(){
			teacher.getPlanListInfo();
		});
		//点击教师名跳转教师信息页
		$('.teacher-tbody').on('click','.teacher-name',function(){
			var pkId = $(this).parent().parent().find('.teacherId').val();
			var processInstanceId = $(this).parent().parent().find('.process-instance-id').val();
			sessionStorage.setItem("searchParams", $('#keyword').val());
			sessionStorage.setItem("pageIndexs", $('.num-text.active').text());
			window.location.href = "teacherApprovalInf.html?processInstanceId=" + processInstanceId+"&pkId="+pkId+"&backPage="+3;
		});
	},
	
	/**
	 * 获取列表数据
	 */
	getPlanListInfo: function() {
		sessionStorage.getItem("searchParams")?$('#keyword').val(sessionStorage.getItem("searchParams")):'';
		var selectParam=$('#keyword').val();
		$('.list-page').pageInfo({
			pageIndexs: sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "teacher/lookForAllByApprovalFinished", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam:selectParam
			}, //ajax查询访问参数
			before:function(){
				$yt_baseElement.showLoading();
			},
			async:true,
			success: function(data) {
				sessionStorage.clear();
				$('.teacher-tbody').empty();
				if(data.flag == 0) {
					var htmlTbody = $('.teacher-tbody');
					var htmlTr = '';
					var sequenceNumber;
					if(data.data.rows.length > 0) {
						$('.list-page').show();
						$.each(data.data.rows, function(i, v) {
							sequenceNumber=i+1;
							if(v.createTime==null){
								v.createTime=""; 
							}
							htmlTr += '<tr>' +
								'<td>'+(i+1)+'</td><input type="hidden" value="' + v.teacherId + '" class="teacherId">' +
								'<td style="text-align:left;"><input type="hidden" value="' + v.processInstanceId + '" class="process-instance-id"><a style="color:#3c4687;" class="teacher-name">' + v.teacherName + '</a></td>' +
								'<td>'+v.org+'</td>' +
								'<td>' + v.title + '</td>' +
								'<td style="text-align:left;">' + v.researchArea + '</td>' +
								'<td style="text-align:left;">' + $yt_baseElement.fmMoney(v.dollarsStandardHalf)+'元/半天</br>'+$yt_baseElement.fmMoney(v.dollarsStandardOne)+ '元/天</td>' +
								'<td>' + v.createUser + '</td>' +
								'<td>' + v.createTime + '</td>' +
								'<td style="text-align:center;"><input type="hidden" value="' + v.dataStates + '" class="dataStates">' + v.workFlawState + '</td>' +
								'</tr>';
						});
					} else {
						$('.list-page').hide();
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="9" align="center" style="border:0px;">' +
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
	},
};
$(function() {
	//初始化方法
	teacher.init();
	
});