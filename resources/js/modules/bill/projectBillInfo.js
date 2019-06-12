var projectBillList = {
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
				projectBillList.getprojectBillListInf();
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
				projectBillList.getprojectBillListInf();
			}
		});
		sessionStorage.getItem("startDate")?$('.search-startDate').val(sessionStorage.getItem("startDate")):'';
		sessionStorage.getItem("endDate")?$('.search-endDate').val(sessionStorage.getItem("endDate")):'';
		//调用获取列表数据方法
		projectBillList.getprojectBillListInf();
		$(".project-bill-tbody").on("click",".project-name",function(){
			var projectCode = $(this).parent().parent().find(".project-code").text();
			var projectType = $(this).parents("tr").find(".project-type-input").val();
			var projectName = $(this).text();
			//window.location.href = "projectListInfo.html?projectCode="+projectCode+"&"+"projectType="+projectType;
			var projectName = encodeURI(encodeURI($(this).parents("tr").find("td.project-name-td").text()));
			sessionStorage.setItem("startDate", $(".search-startDate").val());
			sessionStorage.setItem("endDate", $(".search-endDate").val());
			sessionStorage.setItem("searchParams", $('.selectParam').val());
			sessionStorage.setItem("pageIndexs", $('.project-bill-page .num-text.active').text());
			if(projectType == 2 || projectType == 3){
				var url = "../bank/projectSelection.html?projectCode=" + projectCode + "&" + "projectName=" + projectName+"&"+'backIndex='+1+"&wtType="+"wtType";;
				window.location.href = encodeURI(url);
			}else{
				var url = "../bank/projectBreak.html?projectCode=" + projectCode + "&" + "projectName=" + projectName+"&"+'backIndex='+1;
				window.location.href = encodeURI(url);
			}
		});
		$(".search-btn").click(function(){
			projectBillList.getprojectBillListInf();
		});
	},

	/**
	 * 获取列表数据
	 */
	getprojectBillListInf: function() {
		sessionStorage.getItem("searchParams")?$('.selectParam').val(sessionStorage.getItem("searchParams")):'';
		var selectParam = $(".selectParam").val();
		$('.project-bill-page').pageInfo({
			async: true,
			pageIndexs: sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "finance/projectStatement/lookForAll", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam: selectParam,
				isUserProject: 2,
				selectProjectStart:$('.search-startDate').val(),
				selectProjectEnd:$('.search-endDate').val()
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			before: function() {
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				sessionStorage.clear();
				if(data.flag == 0) {
					var htmlTbody = $('.project-bill-tbody');
					var htmlTr = '';
					if(data.data.rows.length > 0) {
						$('.project-bill-page').show();
						htmlTbody.empty();
						$.each(data.data.rows, function(i, v) {
							if (v.projectHead == null) {
								v.projectHead = "";
							}
							v.startDate = v.startDate.split(" ")[0];
							v.endDate = v.endDate.split(" ")[0];
							htmlTr += '<tr>' +
								'<td class="project-code">' + v.projectCode + '</td>' +
								'<td style="text-align:left;" class="user-name project-name-td"><a style="color: #3c4687;" class="project-name">' + v.projectName + '</td>' +
								'<td class="project-type"><input type="hidden" class="project-type-input" value="'+v.projectType+'" />' + (projectBillList.projectTypeInfo(v.projectType)) + '</a></td>' +
								'<td class="user-email">' + v.projectSell + '</td>' +
								'<td class="user-email">' + v.projectHead + '</td>' +
								'<td class="startDate list-td">' + v.startDate + '</td>' +
								'<td class="startDate list-td">' + v.endDate + '</td>' +
								'<td class="user-email">' + v.checkInCount + '</td>' +
								'<td class="user-phone">' + v.notReconciliationCount + '</td>' +
								'</tr>';
						});
					} else {
						$('.project-bill-page').hide();
						htmlTbody.empty();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
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
		} else if(code == 5) {
			return"国资委调训";
		}else {
			return '';
		};
	},
}
$(function() {
	//初始化方法
	projectBillList.init();

});