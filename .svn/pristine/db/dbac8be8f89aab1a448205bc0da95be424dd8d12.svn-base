var caList = {
	//初始化方法
	init: function() {
		//调用获取列表数据方法
		caList.lookForByBacklog();
		$('#operate-type').val(1);
		//审批列表
		$(".pending-btn").click(function(){//待审批
			$('#operate-type').val(1);
			$(".pending-btn").addClass("active").siblings().removeClass("active");
			$(".approve-title").text("新闻稿待审批");
			caList.lookForByBacklog();
		})
		$(".approved-btn").click(function(){//审批记录
			$('#operate-type').val(2);
			$(".approved-btn").addClass("active").siblings().removeClass("active");
			$(".approve-title").text("新闻稿审批记录");
			caList.lookForByApprove();
		})

		//点击新闻稿名跳转到审批详情页面
		$('.list-tbody').off().on('click','.title',function(){
			var btnTpye=$('#operate-type').val();
			var pkId = $(this).parent().parent().find('.pkId').val();
			var taskName = $(this).parent().parent().find('.taskName').val();
			sessionStorage.setItem("searchParams", $('#keyword').val());
			sessionStorage.setItem("pageIndexs", $('.num-text.active').text());
			//btnTpye为1，点击的是待审批列新闻稿名，跳转到审批流程页面
			if(btnTpye==1){
				//跳转到能修改新闻稿的页面
//				window.location.href = "addUpdatePage.html?pkId="+pkId+"&"+"pageNum="+2;
				window.location.href = "addOrUpdateBean.html?pkId="+pkId+"&"+"pageNum="+2;
			}
			//btnTpye为2点击的是审批记录的班级名，跳转到仅查看详情页面
			if(btnTpye==2){
				//跳转到审批详情
				window.location.href = "lookOneInfoApprove.html?pkId="+pkId+"&"+"pageNum="+2;
			}
			
		});
		$(".search-btn").click(function(){
			if ($('#operate-type').val() == "1") {
				caList.lookForByBacklog();
			}else{
				caList.lookForByApprove();
			}
		});
	},
	//判断当前流程该由谁来操作
//	getOneListInfo: function(pkId) {
//		$.ajax({
//			type: "post",
//			url: $yt_option.base_path + "class/news/getBeanById",
//			async: false,
//			data: {
//				pkId: pkId
//			},
//			objName: 'data',
//			success: function(data) {
//				if(data.flag == 0) {
//					//流程
//					var flowLog = data.data.flowLog;
//					console.log(flowLog.length)
//					if (flowLog.length != 0) {
//						var length=flowLog.length;
//						var tastKeyType= flowLog[0].tastKey;
//						var deleteReason= flowLog[0].deleteReason;
//						var taskName = flowLog[0].taskName;
//							//跳转到新高只可查看，流程审批状态的页面
//							window.location.href = "addOrUpdateBean.html?pkId="+pkId+"&"+"pageNum="+2;
//					}else{
//						
//					}
//				}
//			}
//		});
//	},
		
	/**
	 * 获取审批列表数据
	 */
	lookForByBacklog: function() {
		sessionStorage.getItem("searchParams")?$('#keyword').val(sessionStorage.getItem("searchParams")):'';
		var searchParameters=$('#keyword').val();
		$('.list-page').pageInfo({
			pageIndexs: sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "class/news/lookForByBacklog", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {searchParameters:searchParameters}, //ajax查询访问参数
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
					var sequenceNumber;
					htmlTbody.empty();
					if(data.data.rows.length > 0) {
						$('.list-page').show();
						$.each(data.data.rows, function(i, v) {
							//序号
							sequenceNumber=i+1;
							htmlTr += '<tr>' +
								'<input type="hidden" value="' + v.pkId + '" class="pkId">' +
								'<td style="display:none;">' + sequenceNumber + '</td>' +
								'<td>' + sequenceNumber + '</td>' +
								'<td><a style="color:#3c4687;" class="title yt-link">'+v.title+'</a></td>' +
								'<td>'+v.projectName+'</td>' +
								'<td style="text-align:center;">' + v.createTimeString + '</td>' +
								'<td style="text-align:center;" class="text-overflow">' + v.createUserName + '</td>' +
								'<td style="text-align:center;">' + v.dealingWithPeople + '</td>' +
								'</tr>';
						});
					} else {
						$('.list-page').hide();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="6" align="center" style="border:0px;">' +
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
	/**
	 * 获取审批记录列表数据
	 */
	lookForByApprove: function() {
		var searchParameters=$('#keyword').val();
		$('.list-page').pageInfo({
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "class/news/lookForByApprove", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {searchParameters:searchParameters}, //ajax查询访问参数
			async:true,
			before:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.class-tbody');
					var htmlTr = '';
					var sequenceNumber;
					htmlTbody.empty();
					if(data.data.rows.length > 0) {
						$('.list-page').show();
						$.each(data.data.rows, function(i, v) {
							//序号
							sequenceNumber=i+1;
							htmlTr += '<tr>' +
								'<input type="hidden" value="' + v.pkId + '" class="pkId">' +
								'<td style="text-align: center;">' + sequenceNumber + '</td>' +
								'<td><a style="color:#3c4687;" class="title yt-link">'+v.title+'</a></td>' +
								'<td>'+v.projectName+'</td>' +
								'<td>' + v.createTimeString + '</td>' +
								'<td class="text-overflow" style="text-align: center;">' + v.createUserName + '</td>' +
								'<td style="text-align: center;">' + v.dealingWithPeople + '</td>' +
								'</tr>';
						});
					} else {
						$('.list-page').hide();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="6" align="center" style="border:0px;">' +
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
	
}
$(function() {
	//初始化方法
	caList.init();
	
});