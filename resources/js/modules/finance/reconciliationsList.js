var reconciliationsInfo = {
	//初始化方法
	init: function() {
		var me = this;
		reconciliationsInfo.getPlaneListInfo();
		$(".plane-open-tbody").on('click', ".reconciliations-plane-href", function() {
			var pkId = $(this).parent().parent().find('.pkId').text();
			var totalAmount = $(this).parent().parent().find('.totalAmount').text();
			var createtimeString = $(this).parent().parent().find('.createtimeString').text();
			createtimeString = createtimeString.split(' ')
			var createUser = $(this).parent().parent().find('.createUser').text();
			createUser = encodeURI(encodeURI(createUser));
			sessionStorage.setItem("pageIndexs", $('.plane-open-page .num-text.active').text());
			window.location.href = "reconciliationsPlane.html?pkId=" + pkId + '&totalAmount=' + totalAmount + '&createtimeString=' + createtimeString + '&createUser=' + createUser;
		}); 
		$(".train-open-tbody").on('click', ".reconciliations-Train-href", function() {
			var pkId = $(this).parent().parent().find('.pkId').text();
			var totalAmount = $(this).parent().parent().find('.totalAmount').text();
			var createtimeString = $(this).parent().parent().find('.createtimeString').text();
			createtimeString = createtimeString.split(' ')
			var createUser = $(this).parent().parent().find('.createUser').text();
			createUser = encodeURI(encodeURI(createUser));
			sessionStorage.setItem("pageIndexs", $('.train-open-page .num-text.active').text());
			window.location.href = "reconciliationsTrain.html?pkId=" + pkId + '&totalAmount=' + totalAmount + '&createtimeString=' + createtimeString + '&createUser=' + createUser
		});
		//页签跳转
		$(".tab-title-list button").click(function() {
			$(this).addClass("active").siblings().removeClass("active");
			operate = $(this).text();
			if(operate == "• 机票") {
				$('.box-plane').show();
				$('.box-train').hide();
				$('.search-box').hide();
				$('.senior-search-btn').find('img').removeClass('flipy');
				$('.senior-search-btn').attr('clickstate',true);
				reconciliationsInfo.getPlaneListInfo();
			}
			//operate为2查询发票列表，
			if(operate == "• 火车票") {
				$('.box-plane').hide();
				$('.box-train').show();
				$('.search-box').hide();
				$('.senior-search-btn').find('img').removeClass('flipy');
				$('.senior-search-btn').attr('clickstate',true);
				reconciliationsInfo.getTrainListInfo();
			}
		});
		//高级搜索
		reconciliationsInfo.hideSearch();
		//点击上传附件
		$(".reconciliations-import-form").undelegate().delegate("input[type='file']", "change", function() {
			console.log($(this)[0].files[0].name);
			$('.reconciliations-import-form .import-file-name').val($(this)[0].files[0].name);
		});
		//点击导入
		$('.upFile').off('click').on('click', function() {
			var file = $('.reconciliations-import-form .import-file-name').val();
			var filelast = file.substring(file.lastIndexOf(".") + 1, file.length); //后缀名
			//			var filebefore = file.substring(0,file.lastIndexOf("."));
			if(filelast == '') {
				$yt_alert_Model.prompt("请选择文件上传");
			}
			if(filelast == 'xlsx' || filelast == 'xls' || filelast == 'xlsm' || filelast == 'xltx' || filelast == 'xltm' || filelast == 'xlsb' || filelast == 'xlam') {
				if($('.cost-btn').hasClass('active')) {
					me.upFile(file, 1);
					//隐藏页面中自定义的表单内容  
					$(".reconciliations-import-form").hide();
					//隐藏蒙层  
					$("#pop-modle-alert").hide();
				}
				if($('.borrow-btn').hasClass('active')) {
					me.upFile(file, 2);
					//隐藏页面中自定义的表单内容  
					$(".reconciliations-import-form").hide();
					//隐藏蒙层  
					$("#pop-modle-alert").hide();
				}
			} else {
				$yt_alert_Model.prompt("请选择正确的格式上传");
			}

		})
		//点击下载模板
		$('.download-template').off().on('click', function() {
			if($('.cost-btn').hasClass('active')) {
				me.downloadModel('机票', 1)
			}
			if($('.borrow-btn').hasClass('active')) {
				me.downloadModel('火车票', 2)
			}
		});
		//点击删除按钮
		$('.reconciliations-delete').off().on('click', function() {
			var pkId = $('.yt-table-active .pkId').text();
			if(pkId == '') {
				$yt_alert_Model.prompt("请选择需要删除的数据");
			} else {
				if($('.cost-btn').hasClass('active')){
					reconciliationsInfo.deleteInfo(pkId);
					reconciliationsInfo.getPlaneListInfo();
				}
				if($('.borrow-btn').hasClass('active')){
					reconciliationsInfo.deleteInfo(pkId);
					reconciliationsInfo.getTrainListInfo();
				}
			}
		});
		//点击导入按钮
		$('.reconciliations-import').off().on('click', function() {
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
		});
	},
	/**
	 * 时间控件初始化
	 */
	timeControl:function(){
		//初始化时间控件
		//出票开始日期----开始
		$(".start-time-start").calendar({  
		    speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
		    readonly: true, // 目标对象是否设为只读，默认：true     
		    nowData:false,//默认选中当前时间,默认true  
		    dateFmt:"yyyy-MM-dd",  
		    upperLimit:$(".start-time-end")
		}); 
		//出票开始日期----结束
		$(".start-time-end").calendar({  
		    speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
		    complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
		    readonly: true, // 目标对象是否设为只读，默认：true     
		    lowerLimit:$(".start-time-start"), // 日期下限，默认：NaN(不限制)     
		    nowData:false,//默认选中当前时间,默认true  
		    dateFmt:"yyyy-MM-dd"
		}); 
		//出票结束日期----开始
		$(".end-time-start").calendar({  
		    speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
		    complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
		    readonly: true, // 目标对象是否设为只读，默认：true     
		  	upperLimit:$(".end-time-end"),    
		    nowData:false,//默认选中当前时间,默认true  
		    dateFmt:"yyyy-MM-dd"  
		}); 
		//出票结束日期----结束
		$(".end-time-end").calendar({  
		    speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
		    complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
		    readonly: true, // 目标对象是否设为只读，默认：true     
		    lowerLimit:$(".end-time-start"), // 日期下限，默认：NaN(不限制)     
		    nowData:false,//默认选中当前时间,默认true  
		    dateFmt:"yyyy-MM-dd"
		}); 
		
		//导入时间----开始
		$(".expot-time-start").calendar({  
		    speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
		    complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
		    readonly: true, // 目标对象是否设为只读，默认：true     
		    nowData:false,//默认选中当前时间,默认true  
		    dateFmt:"yyyy-MM-dd HH:mm",  
		    upperLimit:$(".expot-time-end")
		}); 
		//导入时间----结束
		$(".expot-time-end").calendar({  
		    speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
		    complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
		    readonly: true, // 目标对象是否设为只读，默认：true     
		    lowerLimit:$(".expot-time-start"), // 日期下限，默认：NaN(不限制)     
		    nowData:false,//默认选中当前时间,默认true  
		    dateFmt:"yyyy-MM-dd HH:mm" 
		}); 
		
	},
	/**
	 * 高级搜索查询数据
	 */
	seniorData:function(){
		var senior=$(".tab-title-list button.active").attr('senior');
		var types;
		if(senior==0){
			types=1;
		}else{
			types=2;
		}
		var seniorData={
			types:types,
			startDateStart:$('.start-time-start').val(),
			startDateEnd:$('.start-time-end').val(),
			endDateStart:$('.end-time-start').val(),
			endDateEnd:$('.end-time-end').val(),
			effectiveDataStart:$('.eff-num-start').val(),
			effectiveDataEnd:$('.eff-num-end').val(),
			totalAmountStart:$('.eff-money-start').val(),
			totalAmountEnd:$('.eff-money-end').val(),
			createtimeStringStart:$('.expot-time-start').val(),
			createtimeStringEnd:$('.expot-time-end').val(),
			paymentStateStart:$('.norec-start').val(),
			paymentStateEnd:$('.norec-end').val(),
			createUser:$('.create-user').val()
		}
		console.log("seniorData",seniorData);
		return seniorData;
	},
	/* 飞机票 */
	getPlaneListInfo: function() {
		//var keyword = $('#keyword').val();
		var seniorData=reconciliationsInfo.seniorData();
		$('.plane-open-page').pageInfo({
			pageIndexs: sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "finance/teacherExpense/lookForAllByReimbursement", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data:seniorData,//ajax查询访问参数
			async: true,
			objName: 'data', //指获取数据的对象名称  
			before: function() {
				//showLoading方法
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				sessionStorage.clear();
				if(data.flag == 0) {
					var htmlTbody = $('.plane-open-tbody');
					var htmlTr = '';
					var projectType;
					htmlTbody.empty();
					if(data.data.rows!=null){
						$('.plane-open-page').show();
						if(data.data.rows.length > 0) {
							$.each(data.data.rows, function(i, v) {
								htmlTr += '<tr>' +
									'<td class="pkId" style="display:none">' + v.pkId + '</td>' +
									'<td class="startEndDate list-td"><a style="color: #3c4687;" class="reconciliations-plane-href">' + v.startEndDate + '</a></td>' +
									'<td class="effectiveData list-td" >' + v.effectiveData + '</td>' +
									'<td class="totalAmount list-td" style="text-align:right">' + $yt_baseElement.fmMoney(v.totalAmount,2) + '</td>' +
									'<td class="createtimeString">' + v.createtimeString + '</td>' +
									'<td class="createUser list-td" >' + v.createUser + '</td>' +
									'<td class="paymentState list-td">' + v.paymentState + '</td>' +
									'</tr>';
							});
							htmlTbody.append(htmlTr);
						}else{
							$('.plane-open-page').hide();
							htmlTr='<tr>'+
								'<td colspan="6" align="center" style="border:0px;">'+
									'<div class="no-data" style="width: 280px;margin: 0 auto;">'+
										'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">'+
									'</div>'+
								'</td>'+
							'</tr>';
							htmlTbody.append(htmlTr);
						}
					}else{
						$('.plane-open-page').hide();
							htmlTr='<tr>'+
								'<td colspan="6" align="center" style="border:0px;">'+
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
	/**
	 * 火车票
	 */
	getTrainListInfo: function() {
		//var keyword = $('#keyword').val();
		var seniorData=reconciliationsInfo.seniorData();
		$('.train-open-page').pageInfo({
			async: true,
			pageIndexs: sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1, //火车
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "finance/teacherExpense/lookForAllByReimbursement", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: seniorData, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			before: function() {
				//showLoading方法
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				sessionStorage.clear();
				if(data.flag == 0) {
					var htmlTbody = $('.train-open-tbody');
					var htmlTr = '';
					var projectType;
					htmlTbody.empty();
					if(data.data.rows != null){
						$('.train-open-page').show();
						if(data.data.rows.length > 0) {
							$.each(data.data.rows, function(i, v) {
								htmlTr = '<tr>' +
									'<td class="pkId" style="display:none">' + v.pkId + '</td>' +
									'<td class="startEndDate list-td"><a style="color: #3c4687;" class="reconciliations-Train-href">' + v.startEndDate + '</a></td>' +
									'<td class="effectiveData list-td" >' + v.effectiveData + '</td>' +
									'<td class="totalAmount list-td" style="text-align:right">' +  $yt_baseElement.fmMoney(v.totalAmount,2) + '</td>' +
									'<td class="createtimeString">' + v.createtimeString + '</td>' +
									'<td class="createUser list-td" >' + v.createUser + '</td>' +
									'<td class="paymentState list-td">' + v.paymentState + '</td>' +
									'</tr>';
								htmlTbody.append(htmlTr);
							});
						}else{
							$('.train-open-page').hide();
							htmlTr='<tr>'+
									'<td colspan="6" align="center" style="border:0px;">'+
										'<div class="no-data" style="width: 280px;margin: 0 auto;">'+
											'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">'+
										'</div>'+
									'</td>'+
								'</tr>';
							htmlTbody.append(htmlTr);
						}
					}else{
						$('.train-open-page').hide();
						htmlTr='<tr>'+
								'<td colspan="6" align="center" style="border:0px;">'+
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
	//删除
	deleteInfo: function(pkId) {
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/teacherExpense/removeBeanById",
			async: true,
			data: {
				pkId: pkId
			},
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt(data.message);
				} else{
					$yt_alert_Model.prompt(data.message);
				}
			}
		});
	},
	//下载模板
	downloadModel: function(fileName, types) {
		$.ajaxDownloadFile({
				url:$yt_option.base_path + "finance/teacherExpense/downloadTeacherExpense",
				data:{
					fileName:fileName,
					types: types
				}
			});
	},
	//导入
	upFile: function(file, types) {
		$yt_baseElement.showLoading();
		$.ajaxFileUpload({
			type: "post",
			url:$yt_option.base_path + "finance/teacherExpense/importTeacherBankFlow",
				data:{
					types: types,
					pkId: '',
					file:file
				},
			dataType: 'json',
			fileElementId: 'fileName',
			success: function(data) {
				if(data.flag == 0) {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("导入成功");
						if(types == 1){//飞机票导入
							reconciliationsInfo.getPlaneListInfo();
						}else{
							reconciliationsInfo.getTrainListInfo();
						}
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
	},
	/**
	 * 高级搜索
	 */
	hideSearch:function(){
		//点击更多按钮
		var clickTime=0;
		$('.senior-search-btn').click(function(e){
			if(clickTime%2==0){
				$(this).find('img').addClass('flipy');
				$('.search-box').show();
			}else{
				$(this).find('img').removeClass('flipy');
				$('.search-box').hide();
			}
			e.stopPropagation();
			clickTime++;
		});
		$(document).click(function(e){
			clickTime=0;
			$('.senior-search-btn').find('img').removeClass('flipy');
			$('.search-box').hide();
			e.stopPropagation();
		});
		//点击高级搜索里面的搜索按钮
		$('.search-box .yt-model-sure-btn').click(function(){
			var senior=$(".tab-title-list button.active").attr('senior');
			//判断是否为机票
			if(senior==0){
				reconciliationsInfo.getPlaneListInfo();
			}else{
				reconciliationsInfo.getTrainListInfo();
			}
		});
		//点击高级搜索里面的清除按钮
		$('.search-box .yt-model-reset-btn').click(function(){
			$('.start-time-start').val("");
			$('.start-time-end').val("");
			$('.end-time-start').val("");
			$('.end-time-end').val("");
			$('.eff-num-start').val("");
			$('.eff-num-end').val("");
			$('.eff-money-start').val("");
			$('.eff-money-end').val("");
			$('.expot-time-start').val("");
			$('.expot-time-end').val("");
			$('.norec-start').val("");
			$('.norec-end').val("");
			$('.create-user').val("");
		});
	}
};

$(function() {
	//初始化方法
	reconciliationsInfo.init();
	reconciliationsInfo.timeControl();
	reconciliationsInfo.seniorData();
});