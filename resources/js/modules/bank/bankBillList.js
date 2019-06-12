/**
 * 我的项目预算
 */
var bankBillList = {
	//初始化方法
	init: function() {
		$("select").niceSelect(); //下拉框刷新  
		//点击删除
		$(".deleteList").on('click',function(){
			if($(".yt-table-active").length == 0) {
				$yt_alert_Model.prompt("请选择要删除的数据");
				return false;
			}
			bankBillList.delTeacherList();
		});
		//跳转详情
		$('.list-table .list-tbody').on("click",".real-name-inf",function(){
			sessionStorage.setItem("pageIndexs", $('.num-text.active').text());
			window.location.href = "bankBillListInfo.html?pkId=" + $(".yt-table-active .pkId").val();
		})
		//头像附件上传
//		$(".btn-file").undelegate().delegate("input","change",function (){
//		$(".btn-file").next().text("");
//	    
//	    var addFile =  $(this).attr("id");
//	    $yt_baseElement.showLoading();
//	    var url = $yt_option.acl_path + "api/tAscPortraitInfo/addFile?modelCode=caFile";
//	    
//	    $.ajaxFileUpload({
//			url: url,
//			type: "post",
//			dataType: 'json',
//			fileElementId:addFile,
//			success: function(data, textStatus) {
//			    var resultData = $.parseJSON(data);
//			    if(resultData.success == 0){
//				 $yt_alert_Model.prompt("附件上传成功");
//				$(".file-id").append('<li>'+
//						'<span class="file-name" style="margin-right: 50px;color:blue;cursor: pointer"><input type="hidden" class="file-span-id" value="'+resultData.obj.pkId+'" >'+resultData.obj.naming+'</span><span class="cancal" style="cursor: pointer;">x</span>'+
//						'</li>');
//				
//				    }else{
//					 $yt_alert_Model.prompt("附件上传失败");
//				    }
//				     $yt_baseElement.hideLoading();
//				},
//				error: function(data, status, e){ //服务器响应失败处理函数  
//				     $yt_alert_Model.prompt("附件上传失败");
//				    $yt_baseElement.hideLoading();
//					}
//		    });
//		});
		//调用获取列表数据方法
		bankBillList.getPlanListInfo();
	},
		
	/**
	 * 获取列表数据
	 */
	getPlanListInfo: function() {
		$('.page-info').pageInfo({
			pageIndexs: sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "finance/bankStatement/lookForAll", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			before: function() {
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				sessionStorage.clear();
				if(data.flag == 0) {
					var htmlTbody = $('.list-table .list-tbody');
					var htmlTr = '';
					var num = 1;
					if(data.data.rows.length > 0) {
						$('.page-info').show();
						$(htmlTbody).empty();
						$.each(data.data.rows, function(i, v) {
							htmlTr = '<tr>' +
								'<td><input type="hidden" value="' + v.pkId + '" class="pkId">' + num++ + '</td>' +
								'<td><a style="color:#3c4687;" href="#" class="real-name-inf" style=" color:blue">'+v.startEndDate+'</a></td>' +
								'<td style="text-align: left;">' + v.registeredBank + '</td>' +
								'<td style="text-align: left;">' + v.accounts + '</td>' +
								'<td style="text-align:left;">' + v.accountTitle + '</td>' +
								'<td style="text-align:right;">' + v.effectiveCount + '</td>' +
								'<td style="text-align: right;">' + Number(v.effectiveTotal).toFixed(2) + '</td>' +
								'<td>' + v.createTimeString + '</td>' +
								'<td>' +v.createUser + '</td>' +
								'<td>' +v.noAdmissionCount + '</td>' +
								'</tr>';
								htmlTbody.append(htmlTr);
						});
					}else{
						$('.page-info').hide();
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
	
	//删除
    delTeacherList:function() {
		var pkId = $('.yt-table-active .pkId').val();
		$yt_alert_Model.alertOne({
			haveCloseIcon: false, //是否带有关闭图标  
			closeIconUrl: "", //关闭图标路径  
			leftBtnName: "确定", //左侧按钮名称,默认确定  
			rightBtnName: "取消", //右侧按钮名称,默认取消  
			cancelFunction: "", //取消按钮操作方法*/  
			alertMsg: "数据删除将无法恢复，确认删除吗？", //提示信息  
			confirmFunction: function() { //点击确定按钮执行方法  
				$.ajax({
					type: "post",
					url: $yt_option.base_path + "finance/bankStatement/removeBeanById",
					data: {
						pkId: pkId
					},
					before: function() {
						$yt_baseElement.showLoading();
					},
					success: function(data) {
						if(data.flag == 0) {
							$yt_baseElement.hideLoading();
							$yt_alert_Model.prompt("删除成功");
				 			$('.page-info').pageInfo("refresh");
						} else {
							$yt_baseElement.hideLoading(function() {
								$yt_alert_Model.prompt("删除失败！");
							});
							
						}

					}

				});

			}
		});
	},
}
$(function() {
	//初始化方法
	bankBillList.init();
	
});