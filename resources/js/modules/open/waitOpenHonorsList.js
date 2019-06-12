var projectList = {
	//初始化方法
	init: function() {
		$(".plan-list-model").css("min-height", $(window).height() - 52 - $(".heard-query-model").height());
		$(window).resize(function() {
			$(".plan-list-model").css("min-height", $(window).height() - 52 - $(".heard-query-model").height());
		});
		//调用获取列表数据方法
		
		if($yt_common.GetQueryString("page")==2){
			$(".tab-title-list button").eq(1).addClass("active").siblings().removeClass("active");
			$('#btn-type').val("2");
			var path="class/openHonors/lookForByApprove"
			projectList.getPlanListInfo(path);
		}else{
			//默认审批审批列表标识为1
			$('#btn-type').val("1");
			var path="class/openHonors/lookForByBacklog";
			projectList.getPlanListInfo(path);
		}
		$(".tab-title-list button").click(function() {
			$(this).addClass("active").siblings().removeClass("active");
			operate = $(this).text();
			if (operate=="• 待审批") {
				$('#btn-type').val("1");
				var path="class/openHonors/lookForByBacklog"
				projectList.getPlanListInfo(path);
			};
			
			if (operate=="• 审批记录") {
				$('#btn-type').val("2");
				var path="class/openHonors/lookForByApprove"
				projectList.getPlanListInfo(path);
			};
			
		});
		
		
		//点击班级名跳转到审批详情页面
		$('.list-tbody').on('click','.class-name',function(){
			var num = 1;
			var pkId = $(this).parent().parent().find('.pkId').val();
			var types = $(this).parent().parent().find('.types').val();
			var taskName = $(this).parent().parent().find('.taskName').val();
			var btnTpye = $('#btn-type').val();
			sessionStorage.setItem("searchParams", $('#keyword').val());
			sessionStorage.setItem("pageIndexs", $('.num-text.active').text());
			//btnTpye为1，点击的是待审批列表班级名，跳转到审批流程页面
			if(btnTpye==1){
				//班级详情不能修改，审批流程可以修改
				window.location.href = "lookOneInfoApprove.html?pkId="+pkId+"&"+"types="+types+"&"+"num="+num;
			}
			//btnTpye为2点击的是审批记录的班级名，跳转到仅查看详情页面
			if(btnTpye==2){
				//跳转到审批详情
				window.location.href = "onlyLookApprove.html?pkId="+pkId+"&"+"types="+types+"&"+"num="+num+"&page=2";
			}
			
		});
		
		$('.key-word').on('click','.search-btn',function(){
			var btnType = $('#btn-type').val();
			if(btnType == 1){
				var path="class/openHonors/lookForByBacklog"
				projectList.getPlanListInfo(path);
			}else{
				var path="class/openHonors/lookForByApprove"
				projectList.getPlanListInfo(path);
			}
		});
		
	},
	
	//判断当前流程该由谁来操作
	getOneListInfo: function(pkId,types,taskName) {
		var num = 1;
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/openHonors/getBeanById",
			async: false,
			data: {
				pkId: pkId,
				types:types
			},
			success: function(data) {
				if(data.flag == 0) {
					//流程
					var flowLog = data.data.flowLog;
					var length=flowLog.length;
					var tastKeyType= flowLog[0].tastKey;
					var deleteReason= flowLog[0].deleteReason;
					if(length==0){
						
					}else if(tastKeyType=="activitiStartTask"){
						//班级详情能修改，审批流程不能修改的
						window.location.href = "amendApprove.html?pkId="+pkId+"&"+"types="+types+"&"+"num="+num;
						
					}else {
						
					}
				
				}
			}
		});
		
		
	},
	
	/** 
	 * 获取待审批列表和审批记录列表数据
	 * 
	 */
	getPlanListInfo: function(path) {
		sessionStorage.getItem("searchParams")?$('#keyword').val(sessionStorage.getItem("searchParams")):'';
		var queryParams = $('#keyword').val();
//		$('.page-info').show();
		$('.page-info').pageInfo({
			pageIndexs: sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + path, //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {searchParameters: queryParams}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			async:true,
			before:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				sessionStorage.clear();
				if(data.flag == 0) {
					var htmlTbody = $('.class-tbody');
					var htmlTr = '';
					var type=""; 
					var xuhao=1;
					var states="";
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
							htmlTr += '<tr class="td-list">' +
								'<td style="display:none;"><input class="pkId" type="hidden" value="' + v.pkId + '"></td>' +
								'<td style="display:none;"><input class="taskName" type="hidden" value="' + v.taskName + '"></td>' +
								'<td style="text-align:center;" >' + xuhao + '</td>' +
								'<td style="text-align:left;"><a style="color:#3c4687;" class="fsize yt-link class-name">' + v.className + '</a></td>' +
								'<td style="text-align:center;"><input type="hidden" value="' + v.types + '" class="types">' + type + '</td>' +
								'<td class="userName">' + v.userName + '</td>' +
								'<td style="text-align:center;">' +v.startTimeString + '</td>' +
								'<td style="text-align:center;" class="createUserName">' + v.createUserName + '</td>' +
								'<td style="text-align:center;">' + v.createTimeString + '</td>' +
								'<td style="text-align:center;" class="dealingWithPeople">' + v.dealingWithPeople + '</td>' +
								'</tr>';
						});
					} else {
						$('.list-page').hide();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="8" align="center" style="border:0px;">' +
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
	projectList.init();
});