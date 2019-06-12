var projectArchivesInfo = {

	//初始化方法
	init: function() {
		$(".search-startDate").calendar({
			controlId: "startDates",
			nowData: true, //默认选中当前时间,默认true  
			dateFmt:"yyyy-MM",
			callback:function(){
				if(new Date($(".search-endDate").val())<new Date($(".search-startDate").val())){
					$(".search-endDate").val($(".search-startDate").val());
				}
				projectArchivesInfo.getPlanListInfo();
			}
		});
		$(".search-endDate").calendar({
			controlId: "endDates",
			nowData: true, //默认选中当前时间,默认true  
			dateFmt:"yyyy-MM",
			callback:function(){
				if(new Date($(".search-endDate").val())<new Date($(".search-startDate").val())){
					$(".search-startDate").val($(".search-endDate").val());
				}
				projectArchivesInfo.getPlanListInfo();
			}
		});
		sessionStorage.getItem("startDate")?$('.search-startDate').val(sessionStorage.getItem("startDate")):'';
		sessionStorage.getItem("endDate")?$('.search-endDate').val(sessionStorage.getItem("endDate")):'';
		//初始化列表
		projectArchivesInfo.getPlanListInfo();
		//点击查询
		$('.key-word').off().on('click', '.search-btn', function() {
			//调用获取列表数据方法查询
			projectArchivesInfo.getPlanListInfo();
		});
		
		//跳转页面
		$('.list-table .yt-tbody').on("click","a.pk-id",function(){
			var pkId = $(this).parent().find("input.pk-id").val();
			var className = $(this).parent().find(".yt-link").text();
			sessionStorage.setItem("startDate", $(".search-startDate").val());
			sessionStorage.setItem("endDate", $(".search-endDate").val());
			sessionStorage.setItem("searchParams", $('#keyword').val());
			sessionStorage.setItem("pageIndexs", $('.list-page .num-text.active').text());
			var dataArchiving =encodeURI("dataArchiving.html?className="+className+"&"+"pkId="+pkId);   //使用encodeURI编码
       		window.location.href =dataArchiving;

		});
		//点击催办
		$(".urge-btn").click(function(){
			projectArchivesInfo.urgeFn();
		});

	},
	urgeFn:function(){
		var checkLen = $(".open-class-tbody").find(".yt-table-active").length;
		if (checkLen == 0) {
			$yt_alert_Model.prompt("请选中要催办的数据！");
		} else{
			var projectCode = $(".yt-table-active").find(".project-code").text();
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "project/toProjectFileUrge",
				data: {
					projectCode: projectCode
				},
				async: false,
				success: function(data) {
					if(data.flag == 0) {
						$yt_alert_Model.prompt("操作成功！");
					}
				}
			});
		}
	},

	/**
	 * 项目档案列表
	 */
	getPlanListInfo: function() {
		sessionStorage.getItem("searchParams")?$('#keyword').val(sessionStorage.getItem("searchParams")):'';
		var keyword = $('#keyword').val();
		$('.page-info').pageInfo({
			pageIndexs: sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "project/lookForAllByProjectArchives", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam: keyword,
				selectProjectStart:$('.search-startDate').val(),
				selectProjectEnd:$('.search-endDate').val()
			}, //ajax查询访问参数
			async:true,
			before:function(){
				$yt_baseElement.showLoading();
			},
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				sessionStorage.clear();
				if(data.flag == 0) {
					var htmlTbody = $('.list-table .yt-tbody');
					var htmlTr = '';
					var num = 1;
					htmlTbody.empty();
					if(data.data.rows.length > 0) {
						$('.page-info').show();
						var states;
						var projectStates;
						$.each(data.data.rows, function(i, v) {
							htmlTr = '<tr>' +
								'<td class="project-code">' + v.projectCode + '</td>' +
								'<td style="text-align:left"><a style="color:#3c4687;" class="pk-id yt-link" href="#">' + v.projectName + '</a><input style="display:none" class="pk-id" value="' + v.pkId + '"/></td>' +
								'<td class="project-type">' + (projectArchivesInfo.projectTypeInfo(v.projectType)) + '</td>' +
								'<td class="distribution-date">' + v.startDate + '</td>' +
								'<td class="distribution-date">' + v.endDate + '</td>' +
								'<td class="project-head">' + v.projectSell + '</td>' +
								'<td class="project-head">' + v.projectHead + '</td>' +
								'<td class="distribution-user">' + v.unarchivedItem + '</td>' +
								'</tr>';
							htmlTbody.append(htmlTr);
						});
					}else{
						$('.page-info').hide();
						htmlTr='<tr>'+
							'<td colspan="8" align="center" style="border:0px;">'+
								'<div class="no-data" style="width: 280px;margin: 0 auto;">'+
									'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">'+
								'</div>'+
							'</td>'+
						'</tr>';
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
		//项目类型设置
	projectTypeInfo: function(code) {
		if(code == 1) {
			return "计划";
		} else if(code == 2) {
			return "委托";
		} else if(code == 3) {
			return "选学";
		} else if(code == 4) {
			return"中组部调训";
		}else if(code == 5) {
			return"国资委调训";
		}else {
			return '';
		};
	},

}
$(function() {
	//初始化方法
	projectArchivesInfo.init();
});