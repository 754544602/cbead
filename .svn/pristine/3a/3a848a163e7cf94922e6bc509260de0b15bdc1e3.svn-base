var dataArchivingInfo = {

	//初始化方法
	init: function() {
		//初始化列表
		dataArchivingInfo.getPlanListInfo();
		//点击查询
		$('.key-word').off().on('click', '.search-btn', function() {
			//调用获取列表数据方法查询
			dataArchivingInfo.getPlanListInfo();
		});
		//返回按钮
		$('.page-return-btn').on('click', function() {
			window.location.href = "projectArchives.html";
		});
	},

	/**
	 * 项目档案管理-获取详细信息
	 */
	getPlanListInfo: function() {
		var me = this;
		var searchUrl =window.location.href;
        var hrefData =searchUrl.split("=");        //截取 url中的“=”,获得“=”后面的参数
        var  className =decodeURI((hrefData[1].split("&"))[0]); 
		var  pkId =decodeURI(hrefData[2]);
		$(".class-info-div").text(className);
		$yt_baseElement.showLoading();
		$.ajax({
			url: $yt_option.base_path + "project/getProjectArchives", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				projectId: pkId
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.list-table .yt-tbody');
					var htmlTr = '';
					var num = 1;
					htmlTbody.empty();
					if(data.data != null) {
						var projectType;
						var states;
						var projectStates;
						var files;
						var fileId="";
						var fileName="";
						var fileUrl="";
						$.each(data.data, function(i, v) {
							if(v.isMust == 0) {
								v.isMust = "否";
							} else if(v.isMust == 1) {
								v.isMust = "是";
							}
							if(v.states == 0) {
								v.states = "未归档";
								var download = "--"
							} else if(v.states == 1) {
								v.states = "已归档";
								var download = "查看"
							}
							if(v.acquisitionMode == 0) {
								v.acquisitionMode = "手动上传";
							} else if(v.acquisitionMode == 1) {
								v.acquisitionMode = "ERP系统自动获取";
							}
							htmlTr = '<tr>' +
								'<td class="" style="text-align: center;">' + (i+1) + '</td>' +
								'<td>' + v.materialName + '</td>' +
								'<td class="" style="text-align: center;">' + v.isMust + '</td>' +
								'<td class="" style="text-align: center;">' + v.states + '</td>' +
								'<td class="" style="text-align: center;">'+
								'<a class="upFileTr yt-link">上传</a>'+
								'<a class="downloadFile yt-link">' + download + '</a>'+
								'</td>' +
								'</tr>';
							htmlTr = $(htmlTr).data('data',v);
							htmlTbody.append(htmlTr);
						});
						
						$('.upFileTr').off('click').click(function(){
							$("#fileName").val("");
							$(".import-file-name").val("");
							/** 
							 * 显示编辑弹出框和显示顶部隐藏蒙层 
							 */
							$(".reconciliations-import-form").show();
							/** 
							 * 调用算取div显示位置方法 
							 */
							$yt_alert_Model.getDivPosition($(".reconciliations-import-form"));
							/* 
							 * 调用支持拖拽的方法 
							 */
							$yt_model_drag.modelDragEvent($(".reconciliations-import-form .yt-edit-alert-title"));
							/** 
							 * 点击取消方法 
							 */
							$('.reconciliations-import-form .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
								//隐藏页面中自定义的表单内容  
								$(".reconciliations-import-form").hide();
								//隐藏蒙层  
								$("#pop-modle-alert").hide();
							});
							var data = $(this).parents('tr').data('data');
							//点击上传附件
							$(".reconciliations-import-form").undelegate().delegate("input[type='file']", "change", function() {
								$yt_baseElement.showLoading();
								var me = this ;
								$.ajaxFileUpload({
									url:  $yt_option.acl_path + "api/tAscPortraitInfo/addMultipartFiles?modelCode=Acli",
									type: "post",
									dataType: 'json',
									fileElementId: "fileName",
									success: function(data, textStatus) {
										var resultData = $.parseJSON(data);
										if(resultData.success == 0) {
											$('.reconciliations-import-form .import-file-name').data('fileId',resultData.obj[0].pkId);
											$('.reconciliations-import-form .import-file-name').val($(me)[0].files[0].name);
											$yt_baseElement.hideLoading();
										} else {
											$yt_baseElement.hideLoading(function() {
												$yt_alert_Model.prompt("上传失败");
											});
										}
									},
									error: function( s, xhr, status, e ) { //服务器响应失败处理函数  
										$yt_baseElement.hideLoading(function() {
											$yt_alert_Model.prompt("网络异常，上传失败");
										});
									}
								})
							});
							//点击导入
							$('.upFile').off('click').on('click', function() {
								var files = $('.reconciliations-import-form .import-file-name').val();
								var filelast = files.substring(files.lastIndexOf(".") + 1, files.length); //后缀名
								if(filelast == '') {
									$yt_alert_Model.prompt("请选择文件上传");
									return false;
								}
								dataArchivingInfo.upFile(files,$('.reconciliations-import-form .import-file-name').data('fileId'),1,data.archivingBaseId,data.archivingId);
								//隐藏页面中自定义的表单内容  
								$(".reconciliations-import-form").hide();
								//隐藏蒙层  
								$("#pop-modle-alert").hide();
							})
						})
						$('.downloadFile').off().on('click',function(){
							if($(this).text()=='--'){
								return false;
							}
							/** 
							 * 显示编辑弹出框和显示顶部隐藏蒙层 
							 */
							$(".downFile-alert").show();
							/** 
							 * 调用算取div显示位置方法 
							 */
							$yt_alert_Model.getDivPosition($(".downFile-alert"));
							/* 
							 * 调用支持拖拽的方法 
							 */
							$yt_model_drag.modelDragEvent($(".downFile-alert .yt-edit-alert-title"));
							/** 
							 * 点击取消方法 
							 */
							$('.downFile-alert .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
								//隐藏页面中自定义的表单内容  
								$(".downFile-alert").hide();
								//隐藏蒙层  
								$("#pop-modle-alert").hide();
								dataArchivingInfo.getPlanListInfo();
							});
							var data = $(this).parents('tr').data('data');
							var files = JSON.parse(data.files);
							var htmlTbody = $('.downtable tbody').empty();
							var htmlTr = '';
							$.each(files,function(i,n){
								htmlTr = '<tr>'+
								'<td><a class="fileName" style="cursor:pointer">'+n.fileName+'</a></td>'+
								'<td><a class="deletefile" style="cursor:pointer">删除</a></td>'+
								'</tr>';
								htmlTr = $(htmlTr).data('data',n);
								htmlTbody.append(htmlTr);
							})
							$('.fileName').off().click(function(){
								console.log($(this).parents('tr').data('data').fileUrl)
								dataArchivingInfo.download($(this).parents('tr').data('data').fileUrl);
							});
							$('.deletefile').off().click(function(){
								dataArchivingInfo.upFile($(this).parents('tr').data('data').fileName,$(this).parents('tr').data('data').fileId,2,data.archivingBaseId,$(this).parents('tr').data('data').archivingId,$(this).parents('tr'));
							})
						});
						
					} else {
						htmlTbody.html("");
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="5" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
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
	//导入
	upFile: function(file,fileId,types,archivingBaseId,archivingId,that) {
		var filedata= '';
		$yt_baseElement.showLoading();
		var projectId = $yt_common.GetQueryString('pkId');
		if(types==1){
			$.ajaxFileUpload({
			type: "post",
			url:$yt_option.base_path + "project/addOrUpdateProjectArchives",
				data:{
					projectId:projectId,
					types:types,
					fileName:file,
					fileId:fileId,
					archivingBaseId:archivingBaseId,
					archivingId:archivingId
				},
			dataType: 'json',
			fileElementId: 'fileName',
			success: function(data) {
				if(data.flag == 0) {
					$yt_baseElement.hideLoading(function() {
							$yt_alert_Model.prompt("导入成功");
							dataArchivingInfo.getPlanListInfo();
					});
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt(data.message);
					});
				}
			},
			error:function(){
				$yt_baseElement.hideLoading(function() {
					$yt_alert_Model.prompt("网络异常");
				});
			}
			});
		}else{
			$.ajax({
			type:"post",
			url:$yt_option.base_path + "project/addOrUpdateProjectArchives",
			async:true,
			data:{
					projectId:projectId,
					types:types,
					fileName:file,
					fileId:fileId,
					archivingBaseId:archivingBaseId,
					archivingId:archivingId
			},
			success:function(data){
				$(that).remove();
				$yt_alert_Model.prompt('删除成功');
				$yt_baseElement.hideLoading();
			},error:function(){
				
			}
		});
		}
	},
	//下载
	download:function(fileURL){
		$.ajaxDownloadFile({
			url:fileURL
		});
	}

}
$(function() {
	//初始化方法
	dataArchivingInfo.init();
});