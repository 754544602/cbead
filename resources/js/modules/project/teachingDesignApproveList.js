var projectList = {
	//初始化方法
	init: function() {
		projectList.getProjectListInfo();
		//点击项目名称
		$(".project-tbody").on('click',".file-name",function(){
			sessionStorage.setItem("searchParams", $('#keyword').val());
			sessionStorage.setItem("pageIndexs", $('.num-text.active').text());
			window.location.href="projectDetails.html?pkId=" + $('.yt-table-active .pkId').val()+"&"+"tp="+1+"&"+"projectCode="+$('.yt-table-active .project-code-list').text()+"&history=teacherApprove";
		});
		$('.search-btn').click(function(){
			projectList.getProjectListInfo();
		});
	},
	
	/**
	 * 获取列表数据
	 */
	getProjectListInfo: function() {
		sessionStorage.getItem("searchParams")?$('#keyword').val(sessionStorage.getItem("searchParams")):'';
		var selectParam = $('#keyword').val();
		$('.project-page').pageInfo({
			pageIndexs: sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "project/lookForAllByTeachingScheme", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam:selectParam
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			async:true,
			before:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				sessionStorage.clear();
				if(data.flag == 0) {
					var htmlTbody = $('.project-tbody');
					var htmlTr = '';
					
					if(data.data != null) {
						if(data.data.rows.length!=0){
							$(".project-page").show();
							$.each(data.data.rows, function(i, v) {
								if(v.trainDateCount==null){
									v.trainDateCount="";
								}
								if(v.projectType==1){
									v.projectType="计划";
								}else if(v.projectType==2){
									v.projectType="委托";
								}else if(v.projectType==3){
									v.projectType="选学";
								}else if(v.projectType==4){
									v.projectType="中组部调训";
								}else if(v.projectType==5){
									v.projectType="国资委调训";
								}
								if(v.projectCode.length>10){
									v.projectCode='';
								}
								if(v.projectSell == null){
									v.projectSell = "";
								}
								htmlTr += '<tr>' +
									'<td class="project-code-list"><input type="hidden" value="' + v.pkId + '" class="pkId">' + v.projectCode + '</td>' +
									'<td class="project-name" style="text-align: left;"><a style="color:#3c4687;" class="file-name">'+v.projectName+'</a></td>' +
									'<td>' + v.projectType + '</td>' +
									'<td>' + v.startDate + '</td>' +
									'<td style="text-align: right;">' + v.trainDateCount + '</td>' +
									'<td style="text-align: left;">' + v.projectSell + '</td>' +
									'<td style="text-align: right;">' + v.traineeCount + '</td>' +
									'</tr>';
							});
						}else{
							$(".project-page").hide();
							htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="7" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
							htmlTbody.html(htmlTr);
						}
					} else {
						$(".project-page").hide();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="7" align="center" style="border:0px;">' +
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
	projectList.init();
	
});