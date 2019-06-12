var mouldList = {

	//初始化方法
	init: function() {
		//获取详情
		mouldList.getTeachMouldInfo();
		//上传文件
		$(".operate-file-box").undelegate().delegate("input","change",function (){
		    var addFile =  $(this).attr("id");
		    //切割文件路径获取文件名
		    var fileName=$(this).val().split('\\');
		    //获取到上传的文件名
		    var fm=fileName[fileName.length-1];
			var fileTypeLen = fm.split(".");
			var fileType = fileTypeLen[(fileTypeLen.length-1)];
		    var url = $yt_option.acl_path + "api/tAscPortraitInfo/addFile?modelCode=caFile";
		    if (fileType == "docx" || fileType == "doc" || fileType == "xls" || fileType == "xlsx" || fileType == "pdf" || fileType == "xls" || fileType == "ppt" || fileType == "pptx") {		   
			    $.ajaxFileUpload({
					url: url,
					type: "post",
					dataType: 'json',
					fileElementId:addFile,
					success: function(data, textStatus) {
					    var resultData = $.parseJSON(data);
					    var fileId = resultData.obj.pkId;
					    if(resultData.success == 0){
						 	$yt_alert_Model.prompt("附件上传成功");
						 	fileList=[resultData.obj.naming,fileId]
						 	$(".add-lecture-tb tbody").empty();
							var lineTrHtml = '<tr class="file-tr-border-style">' +
												'<input type="hidden" class="fileURL" value="'+$yt_option.acl_path +'api/tAscPortraitInfo/download?isDownload=true&pkId='+fileId+'">'+
												'<td style="padding-left:10px;" class="fileName"><input type="hidden" class="file-span-id" value="' + fileId + '" ><input type="hidden" class="file-name" value="' + resultData.obj.naming + '" >' + resultData.obj.naming + '</td>' +
												'<td style="display:none;" class="lecture-tds"><img class="ioc-img" src="../../resources/images/open/yulan.png" /></td>' +
												'<td style="width: 40px;display:none;">预览</td>' +
												'<td class="lecture-tds" style="text-align:center;width:70px"><span style="cursor: pointer;" class="dele-file"><img style="vertical-align: middle;margin-right:5px;" class="orderBy-dele-img img-size" src="../../resources/images/open/delete.png">删除</span></td>'+
												'<td class="lecture-tds" style="text-align:center;width:70px"><span style="cursor: pointer;" class="down-file"><img class="ioc-img" src="../../resources/images/open/xiazai2.png" />下载</span></td>'+
											'</tr>';
											$(".add-lecture-tb tbody").append(lineTrHtml);
						 	
					    }else{
						 	$yt_alert_Model.prompt("附件上传失败");
					    }
				      $("#"+addFile).val("");
					},
					error: function(data, status, e){ //服务器响应失败处理函数  
					    $yt_alert_Model.prompt("附件上传失败!");
					     $("#"+addFile).val("");
					}
				});
			}else{
				$yt_alert_Model.prompt("请上传word类型的文档", 3000);
			}
			
		});
		//下载演讲稿
		$('.down-files tbody').on('click',".down-file",function(){
			var filePkId =$(this).parent().parent().find('.file-span-id').val();
			var fileURL =$(this).parent().parent().find('.fileURL').val();
			$.ajaxDownloadFile({
				url:fileURL
			});
			
		});
		//点击附件的删除按钮
		$(".add-lecture-tb tbody").on('click','.delete-files',function(){
			$(this).parent().remove();
		});
		//点击确定按钮
		$(".add-edit-btn").click(function(){
			if ($(".add-lecture-tb tbody tr").length != 0) {
				mouldList.addFile();
			}else{
				$yt_alert_Model.prompt("请上传模板文件！");
			}
			
		});
		//点击返回
		$(".page-return-btn").click(function(){
			window.location.href = "mouldList.html";
		});
		//点击取消
		$(".yt-model-canel-btn").click(function(){
			window.location.href = "mouldList.html";
		});
		//点击删除
		$(".add-lecture-tb").off().on("click",".dele-file",function(){
			$(this).parent().parent().remove();
		});
	},
	//教学方案模板新增
	addFile:function(){
		
		var trHtml = $(".add-lecture-tb tbody tr");
		var teachingPlantemplatId = $('.teaching-plantemplat-id').val();
		var templateId = $yt_common.GetQueryString("templateId");
		var fileId = trHtml.find('.file-span-id').val();
		var fileName = trHtml.find('.file-name').val()
		var fileUrl = trHtml.find('.fileURL').val();
		var filesJson = {
			teachingPlantemplatId:teachingPlantemplatId,
			fileId:fileId,
			fileName:fileName,
			fileUrl:fileUrl
		}
		var files = JSON.stringify(filesJson);
		var remark = $('.remark').val();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/teachingTemplate/addOrUpdateTemplate",
			data: {
				files:files,
				remarks:remark,
				templateId:templateId
			},
			success: function(data) {
				if(data.flag == 0) {
					$yt_baseElement.hideLoading();
					$yt_alert_Model.prompt("保存成功");
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("操作失败");
					});

				}
			}
		});
	},
	
	//获取教学方案模板
	getTeachMouldInfo: function() {
		$yt_baseElement.showLoading();
		var templateId = $yt_common.GetQueryString("templateId");
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/teachingTemplate/getTemplate",
			data: {
				templateId:templateId
			},
			success: function(data) {
				if(data.flag == 0) {
					if (data.data.length > 0) {
						$.each(data.data, function(i,f) {
							var files=JSON.parse(f.files)[0];
						$(".add-lecture-tb tbody").empty();
							var lineTrHtml = '<tr class="file-tr-border-style">' +
												'<input type="hidden" class="fileURL" value="'+files.fileUrl+'">'+
												'<td style="padding-left:10px;" class="fileName"><input type="hidden" class="file-span-id" value="' + files.fileId + '" ><input type="hidden" class="file-name" value="' + files.fileName + '" >' + files.fileName + '</td>' +
												'<td style="display:none;" class="lecture-tds"><img class="ioc-img" src="../../resources/images/open/yulan.png" /></td>' +
												'<td style="width: 40px;display:none;">预览</td>' +
												'<td class="lecture-tds" style="text-align:center;width:70px"><span style="cursor: pointer;" class="dele-file"><img style="vertical-align: middle;margin-right:5px;" class="orderBy-dele-img img-size" src="../../resources/images/open/delete.png">删除</span></td>'+
												'<td class="lecture-tds" style="text-align:center;width:70px"><span style="cursor: pointer;" class="down-file"><img class="ioc-img" src="../../resources/images/open/xiazai2.png" />下载</span></td>'+
											'</tr>';
											$(".add-lecture-tb tbody").append(lineTrHtml);
						
							$('.remark').val(f.remarks);
							$('.teaching-plantemplat-id').val(files.teachingPlantemplatId);
						});
					}
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});

				}
			}
		});
	}
};
$(function() {
	//初始化方法
	mouldList.init();
	
});