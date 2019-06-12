//开班式资料归档
var projectList = {
	//初始化方法
	init: function() {
		
		//获取班级类型，1 开班式，2 结业式
		var types = $yt_common.GetQueryString("types");
		//改变页面标题
		if(types==1){
			$(".class-title").text("开班式");
			$(".class-order-title").text("开班式会序");
			$(".class-order-file").text("开班式讲稿");
			$(".depute-order-file").text("委托单位讲稿归档");
			$(".depute-img").text("开班式照片");
		};
		//该表页面标题
		if(types==2){
			$(".class-title").text("结业式");
			$(".class-order-title").text("结业式会序");
			$(".class-order-file").text("结业式讲稿讲稿");
			$(".depute-order-file").text("委托单位讲稿归档");
			$(".depute-img").text("结业式照片");
		};
		//获取一条详细信息
		projectList.getOneListInfo();
		//删除讲稿文件
		projectList.delFileTr();
		//删除照片
		projectList.delImgLi();
		
		//委托单位讲稿上传
		$("#up-file").undelegate().delegate("input","change",function (){
			$(".up-fileIds").next().text("");
		    var addFile =  $(this).attr("id");
		    //切割文件路径获取文件名
		    var fileName=$(this).val().split('\\');
		    //获取到上传的文件名
		    var fm=fileName[fileName.length-1];
		    var fileTypeLen = fm.split(".");
			var fileType = fileTypeLen[(fileTypeLen.length-1)];
			if (fileType == "docx" || fileType == "doc" || fileType == "xls" || fileType == "xlsx" || fileType == "pdf" || fileType == "xls" || fileType == "ppt" || fileType == "pptx") {//word文档类型，excel，pdf，ppt，
			  	var url = $yt_option.acl_path + "api/tAscPortraitInfo/addFile?modelCode=caFile";
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
						 	fileList=[fm,fileId]
						 	//调用新增一行函数
						 	projectList.addLineLecture(fm,fileId);
					    }else{
						 	$yt_alert_Model.prompt("附件上传失败");
					    }
					},
					error: function(data, status, e){ //服务器响应失败处理函数  
					    $yt_alert_Model.prompt("附件上传失败!!!!");
					}
				});
			}else{
				$yt_baseElement.hideLoading(function() {
					$yt_alert_Model.prompt("请上传doc,xls,pdf,ppt格式文件！");
				});
			}
		});
		
		
		
		//上传图片
		$(".operate-depute-img-box").undelegate().delegate("input","change",function (){
			$(".up-fileIds").next().text("");
		    var addImg =  $(this).attr("id");
		    //切割文件路径获取文件名
		    var fileName=$(this).val().split('\\');
		    //获取到上传的文件名
		    var imgName=fileName[fileName.length-1];
		   
			var fileTypeLen = imgName.split(".");
			var imgType = fileTypeLen[(fileTypeLen.length-1)];
		    if (imgType == "jpg" || imgType == "jpeg" || imgType == "png" || imgType == "tiff" || imgType == "gif") {
			   	var url = $yt_option.acl_path + "api/tAscPortraitInfo/addFile?modelCode=caFile";
			    $.ajaxFileUpload({
					url: url,
					type: "post",
					dataType: 'json',
					fileElementId:addImg,
					success: function(data, textStatus) {
					    var resultData = $.parseJSON(data);
					    var imgId = resultData.obj.pkId;
					    if(resultData.success == 0){
						 	$yt_alert_Model.prompt("附件上传成功");
						 	fileList=[imgName,imgId]
						 	//调用新增一行函数
						 	projectList.addOneImg(imgName,imgId);
						 	$(".operate-depute-img-box input").val("");
					    }
					},
					error: function(data, status, e){ //服务器响应失败处理函数  
					    $yt_alert_Model.prompt("附件上传失败!");
					}
				});
			 } else{
		    	$yt_alert_Model.prompt("请上传jpg格式图片!");
		    }
		});
		 
		
		
		
		//下载演讲稿
		$('.add-lecture-tb tbody').on('click',".down-file",function(){
			//获取文件的id
			var filePkId =$(this).parent().parent().find('.file-span-id').val();
			var fileURL =$(this).parent().parent().find('.fileURL').val();
			$.ajaxDownloadFile({
				url:fileURL
			});
		});
		
		//下载委托单位演讲稿
		$('.add-depute-lecture-tb tbody').on('click',".down-file",function(){
			//获取文件的id
			var filePkId =$(this).parent().parent().find('.file-span-id').val();
			var fileURL =$(this).parent().parent().find('.fileURL').val();
			$.ajaxDownloadFile({
				url:fileURL
			});
		});
		//取消按钮
		$('#last-cancel').click(function(){
			window.location.href = "lectureList.html";
		});
		//返回按钮
		$('.page-return-btn').click(function(){
			window.location.href = "lectureList.html";
		});
		
		//初始化图片样式
		projectList.imgStyleFn();
		//确定按钮
		$('#submit').click(function(){
			projectList.addImgInfo();
		});
		
	},
	//图片格式
	imgStyleFn:function(){
		$('.testjqthumb').jqthumb({  
		    width: 120,  
		    height: 130
		});
	},
	
	//修改资料页面
	addClassInfo:function(){
		$yt_baseElement.showLoading();
			var pkId = $yt_common.GetQueryString("pkId");
			var operateType = $yt_common.GetQueryString("types");
			//流程定义key
			var businessCode=$('#businessCode').val();
			var processInstanceId = $('#processInstanceId').val()
			//班级编号
			var projectCode=$('#projectCode').val();
			//开结业式时间
			var startTime = $('.startTime').val();
			
			//会序
			var orderListArr=[];
			//会序内容
			var details="";
			//会序时长
			var dateLength="";
			//会序调序
			var orderBy="";
			//遍历会序表格获取每一行会序参数
			$(".add-order-tb tbody tr").each(function (i,n){
				//会序序号
				orderBy=i+1;
				details=$(n).find('.details').val();
				dateLength=$(n).find('.dateLength').val();
				var orderList={
					details:details,
					dateLength:dateLength,
					orderBy:orderBy
				}
				orderListArr.push(orderList);
			});
			var orderListJson = JSON.stringify(orderListArr);
			//开班式讲稿
			var fileListArr=[];
			//附件id
			var fileId ="";
			//附件名
			var fileName="";
			//附件类型，1  图片，2  其他附件
			var types="";
			var fileListArr=[];
			//获取所有上传的讲稿
			$(".add-lecture-tb tbody tr").each(function (i,n){
				fileId = $(n).find('.file-span-id').val();
				fileName = $(n).find('.fileName').text();
				var fileList={
					fileId:fileId,
					fileName:fileName,
					types:2
				}
				fileListArr.push(fileList);
			});
			var fileListJson = JSON.stringify(fileListArr);
			
			var opintion="";
			//获取下一步操作人
			var dealingWithPeople=$('#nextPeople').val();
			//提交
			var nextCode="submited";
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "class/openHonors/addOrUpdateBean",
				data: {
					pkId:pkId,
					types: operateType,
					projectCode:projectCode,
					startTime:startTime,
					orderList: orderListJson,
					fileList: fileListJson,
					//保存或提交
					dataStates:dataStates,
					//开班式或结业式
					businessCode:businessCode,
					//操作流程代码   不能为空
					nextCode:nextCode
				},
				success: function(data) {
					if(data.flag == 0) {
							
						projectList.init();
						$yt_baseElement.hideLoading();
					} else {
						$yt_alert_Model.prompt("添加失败");
						$(".yt-edit-alert,#heard-nav-bak").hide();
						$yt_baseElement.hideLoading(function (){
							$yt_alert_Model.prompt("添加失败");
						});
					}
					projectList.getPlanListInfo();
				}
			});
		
	},
	
	
	//删除委托单位讲稿
	delFileTr:function(){
		//删除一行数据
		$(".add-depute-lecture-tb").on('click',".entry-del-icon",function() {
			var tr = $(this).parent().parent();
			$yt_alert_Model.alertOne({
				haveAlertIcon: false, //是否带有提示图标
				closeIconUrl: "", //关闭图标路径 
				leftBtnName: "确定", //左侧按钮名称,默认确定 
				rightBtnName: "取消", //右侧按钮名称,默认取消 
				cancelFunction: "", //取消按钮操作方法*/ 
				alertMsg: "数据删除将无法恢复，确认删除吗？", //提示信息 
				confirmFunction: function() {
					tr.remove();
				}
			});
		});
	},
	
	
	//委托单位新增一行
	
	addLineLecture:function(fileName,fileId){
		var num=$(".add-depute-lecture-tb tbody tr").length+1;
		var lineTrHtml='<tr>'+
							'<input type="hidden" class="fileURL" value="'+$yt_option.acl_path +'api/tAscPortraitInfo/download?isDownload=true&pkId='+fileId+'">'+
							'<td class="lecture-tds">【<span class="fileLineNum">'+num+'</span>】</td>'+
							'<td class="fileName"><input type="hidden" class="file-span-id" value="'+fileId+'" >'+fileName+'</td>'+
							'<td style="display:none;" class="lecture-tds"><img class="ioc-img" src="../../resources/images/open/yulan.png" /></td>'+
							'<td style="width: 40px; display:none;">预览</td>'+
							'<td class="lecture-tds" style="text-align:center;width:70px"><span style="cursor: pointer;" class="down-file"><img class="ioc-img" src="../../resources/images/open/xiazai2.png" />下载</span></td>'+
							'<td class="lecture-tds" style="text-align:center;width:170px"><span style="cursor: pointer;" class="entry-del-icon"><img class="ioc-img" src="../../resources/images/open/delete.png" />删除</span></td>'+
							
						'</tr>';
		$(".depute-lecture tbody").append(lineTrHtml);
		
	},
	
	
	
	//删除照片
	delImgLi:function(){
		//删除一行数据
		$(".content-div-box ").on('click',".dele-img",function() {
			var tr = $(this).parent().parent();
			$yt_alert_Model.alertOne({
				haveAlertIcon: false, //是否带有提示图标
				closeIconUrl: "", //关闭图标路径 
				leftBtnName: "确定", //左侧按钮名称,默认确定 
				rightBtnName: "取消", //右侧按钮名称,默认取消 
				cancelFunction: "", //取消按钮操作方法*/ 
				alertMsg: "数据删除将无法恢复，确认删除吗？", //提示信息 
				confirmFunction: function() {
					tr.remove();
				}
			});
		});
		
		
		
		//下载图片
		$('.content-div-box').on('click',".down-img",function(){
			//获取文件的id
			var filePkId =$(this).parent().parent().find('.imgId').val();
			var fileURL =$(this).parent().parent().find('.fileURL').val();
			
			$.ajaxDownloadFile({
				url:fileURL
			});
		});
		
	},
	//上传一张图片添加一个框
	addOneImg:function(imgName,imgId){
		var liHtml='<li class="img-li">'+
						'<div class="img-div-box">'+
							'<input type="hidden" class="imgId" value="'+imgId+'">'+
							'<input type="hidden" class="fileURL" value="'+$yt_option.acl_path +'api/tAscPortraitInfo/download?isDownload=true&pkId='+imgId+'">'+
							'<input type="hidden" class="imgName" value="'+imgName+'">'+
							'<img class="testjqthumb " src="'+$yt_option.acl_path +'api/tAscPortraitInfo/download?isDownload=true&pkId='+imgId+'" alt="'+imgName+'"> '+
						'</div>'+
						'<div class="operate-box">'+
							'<div class="down-img" style="cursor: pointer;">'+
								'<img class="ioc-img down-btn-img" src="../../resources/images/open/xiazai2.png" />'+'下载'+
							'</div>'+
							'<div class="dele-img" style="cursor: pointer;">'+
								'<img class="dele-btn-img ioc-img" src="../../resources/images/open/delete.png" />'+'删除'+
							'</div>'+
						'</div>'+
					'</li>';
		
		$('.ul-btn').append(liHtml);
		//初始化图片样式
		$('.ul-btn .testjqthumb').last().jqthumb({  
		    width: 120,  
		    height: 130
		});
		//删除照片
		projectList.delImgLi();
	},
	
	
	
	//导出开结业式会序
	getOutOpenHonors:function(){
		var alertNmae=""
		//当前一条详细信息的pkId
		var pkId = $('#pkId').val();
		//当前详细信息是开班式还是结业式
		var type=$('#types').val();
		$.ajaxDownloadFile({
			url:$yt_option.base_path+"class/openHonors/exportOrder",
			data: {
				pkId: pkId,
				types: type
			}
		});
	},

//----------------------------------------资料归档部分--------------------------------------------------------	
	//一条详细信息
	getOneListInfo: function() {
		$yt_baseElement.showLoading();
		var pkId = $yt_common.GetQueryString("pkId");
		var types = $yt_common.GetQueryString("types");
		
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/openHonors/getBeanById",
			async: false,
			data: {
				pkId: pkId,
				types:types
			},
			objName: 'data',
			success: function(data) {
				
				if(data.flag == 0) {
					//班级名
					$('#projectCode').text(data.data.projectName);
					//项目主任
					$('#projectUserName').text(data.data.projectUserName);
					//召开时间
					$('#startTime').text(data.data.startTime);
					//学员数量
					$('#traineeCount').text(data.data.traineeCount);
					//提交时间
					$('#createTimeString').text(data.data.createTimeString);
					//提交人
					$('#createUser').text(data.data.createUserName);
					//班级类型
					$('#types').val(data.data.types);
					//班级类型
					$('#pkId').val(data.data.pkId);
					
					
					//会序
					var orderList=data.data.orderList;
					var orderListObj=$.parseJSON(orderList);
					$.each(orderListObj, function(i,v) {
						
						var num = $(".add-order-tb tbody tr").length + 1;
						var lineTrHtml = '<tr class="add-textList tr-border-style">' +
											'<td style="text-align:center;" class="order-by"> <input type="hidden" class="orderBy" value="'+v.orderBy+'"/>' + num + '</td>' +
											'<td class="td-input details">'+v.details+'</td>' +
											'<td class="dateLength" style="padding-right:10px; text-align:right;"><span style="margin-right:5px">'+v.dateLength+'</span>'+"分钟"+'</td>' +
										'</tr>';
							$(".add-order-tb tbody").append(lineTrHtml);
						
					});
					//讲稿
					var fileList=data.data.fileList;
					var fileListObj=$.parseJSON(fileList)
					var fileType;
					$.each(fileListObj, function(i,v) {
						
						fileType=v.fileType;
						if(fileType==1){//开班式讲稿
							var i = i+ 1;
							var lineTrHtml='<tr class="file-tr-border-style">'+
											'<input type="hidden" class="fileURL" value="'+$yt_option.acl_path +'api/tAscPortraitInfo/download?isDownload=true&pkId='+v.fileId+'">'+
											'<td class="lecture-tds">【<span class="fileLineNum">'+i+'</span>】</td>'+
											'<td class="fileName"><input type="hidden" class="file-span-id" value="' + v.fileId + '" >' + v.fileName + '</td>' +
											'<td style="display:none;" class="lecture-tds"><img class="ioc-img" src="../../resources/images/open/yulan.png" /></td>'+
											'<td style="width: 40px; display:none;">预览</td>'+
											'<td class="lecture-tds" style="text-align:center;width:70px"><span style="cursor: pointer;" class="down-file"><img class="ioc-img" src="../../resources/images/open/xiazai2.png" />下载</span></td>'+
										'</tr>';
							$(".content-div-box").eq(2).find('tbody').append(lineTrHtml);
						}else if(fileType==2){//委托单位讲稿
							var num = $(".depute-lecture tbody tr").length + 1;
							var lineTrHtml='<tr class="file-tr-border-style">'+
													'<input type="hidden" class="fileURL" value="'+$yt_option.acl_path +'api/tAscPortraitInfo/download?isDownload=true&pkId='+v.fileId+'">'+
													'<td class="lecture-tds">【<span class="fileLineNum">'+num+'</span>】</td>'+
													'<td class="fileName"><input type="hidden" class="file-span-id" value="'+v.fileId+'" >'+v.fileName+'</td>'+
													'<td style="display:none;" class="lecture-tds"><img class="ioc-img" src="../../resources/images/open/yulan.png" /></td>'+
													'<td style="width: 40px; display:none;">预览</td>'+
													'<td class="lecture-tds" style="text-align:center;width:70px"><span style="cursor: pointer;" class="down-file"><img class="ioc-img" src="../../resources/images/open/xiazai2.png" />下载</span></td>'+
													'<td class="lecture-tds" style="text-align:center;width:170px"><span style="cursor: pointer;" class="entry-del-icon"><img class="ioc-img" src="../../resources/images/open/delete.png" />删除</span></td>'+
											'</tr>';
							$(".depute-lecture").append(lineTrHtml);
							
						}else if(fileType==4){//图片
							var len = $('.ul-btn').children().length;
							var liHtml='<li class="img-li">'+
										'<div class="img-div-box">'+
											'<input type="hidden" class="imgId" value="'+v.fileId+'">'+
											'<input type="hidden" class="imgName" value="'+v.fileName+'">'+
											'<input type="hidden" class="fileURL" value="'+$yt_option.acl_path +'api/tAscPortraitInfo/download?isDownload=true&pkId='+v.fileId+'">'+
											'<img class="testjqthumb " src="'+$yt_option.acl_path +'api/tAscPortraitInfo/download?isDownload=true&pkId='+v.fileId+'" alt="'+v.fileName+'"> '+
										'</div>'+
										'<div class="operate-box">'+
											'<div class="down-img" style="cursor: pointer;">'+
												'<img class="ioc-img down-btn-img" src="../../resources/images/open/xiazai2.png" />'+'下载'+
											'</div>'+
											'<div class="dele-img" style="cursor: pointer;">'+
												'<img class="dele-btn-img ioc-img" src="../../resources/images/open/delete.png" />'+'删除'+
											'</div>'+
										'</div>'+
									'</li>';
		
							$('.ul-btn').append(liHtml);
							
						}
					});
					
				//委托单位讲稿
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function (){
						$yt_alert_Model.prompt("查询失败");
					});
				}
			}
		});
	},
	//资料归档提交
	addImgInfo:function(){
		$yt_baseElement.showLoading();
			//委托单位讲稿
			//附件id
			var fileId ="";
			//附件名
			var fileName="";
			var fileLists=[];
			//获取所有上传的讲稿
			$(".add-depute-lecture-tb tbody tr").each(function (i,n){
				//委托单位讲稿
				fileId = $(n).find('.file-span-id').val();
				fileName = $(n).find('.fileName').text();
				var fileList={
					fileId:fileId,
					fileName:fileName,
					types:2,
					fileType:2
				}
				fileLists.push(fileList);
			});
			
			var pkId=$('#pkId').val();
			//附件id
			var imgId ="";
			//附件名
			var imgName="";
			//获取所有照片
			$(".content-div-box .ul-btn li").each(function (i,n){
				//委托单位讲稿
				imgId = $(n).find('.imgId').val();
				imgName = $(n).find('.imgName').val();
				var imgList={
					fileId:imgId,
					fileName:imgName,
					types:1,
					fileType:4
				}
				fileLists.push(imgList);
			});
			
			var fileListJson= JSON.stringify(fileLists);
			$.ajax({//
				type: "post",
				url: $yt_option.base_path + "class/openHonors/addHonorsLecture",
				data: {
					pkId:pkId,
					fileList: fileListJson,
					
				},
				success: function(data) {
					if(data.flag == 0) {
						$yt_baseElement.hideLoading(function (){
							$(".yt-edit-alert,#heard-nav-bak").hide();
						});
					} else {
						$yt_baseElement.hideLoading(function (){
							$yt_alert_Model.prompt("归档失败");
							$(".yt-edit-alert,#heard-nav-bak").hide();
						});
					}
					window.location.href = "lectureList.html";
				}
			});
		
	}

};
$(function() {
	//初始化方法
	projectList.init();
});