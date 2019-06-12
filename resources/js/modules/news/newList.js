var caList = {

	//初始化方法
	init: function() {
		
		//调用获取列表数据方法
		caList.getPlanListInfo();
		//点击新增
		$('.add-btn').off().on("click", function() {
			//跳转到新增页面
			window.location.href = "addPage.html";
		});
		//初始化时间
		$("#issueDayeString").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			lowerLimit: "2010/01/01", // 日期下限，默认：NaN(不限制)     
			nowData: true, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd HH:mm",
			callback: function() {} // 点击选择日期后的回调函数  
		});
		
		//点击发布
		$('.publish-btn').off().on("click", function() {
			//获取发布时间
			var issueDayeString = $('.yt-table-active .issueDayeString').text();
			//获取新闻稿标题
			var title =  $('.yt-table-active .td-title').find('.title').text();
			//获取审批状态
			var states = $('.yt-table-active .states').text();
			//发布弹出框添加发布时间
			$('#issueDayeString').val(issueDayeString);
			//发布弹出框添加标题名
			$('#title').val(title);
			if(issueDayeString==""||title=="" ){
				$yt_alert_Model.prompt("请选择要发布的新闻稿");
			}else if(states!="已通过"){
				$yt_alert_Model.prompt("该新闻稿审批未通过，不能发布");
			}else{
				caList.legalAdd();
			}
		});
		$('.suer-publish-btn').off().on("click", function() {
			//点击确定按钮调用发布方法
			caList.publish();
		});
		//查询按钮
		$('.search-btn').off('click').on("click", function() {
			caList.getPlanListInfo();
		});
		//点击新闻稿跳转到addUpdatePage.html页面，查看，编辑,
		$('.class-tbody').off().on("click",'.title', function(){
			var $tr=$(this).parent().parent();
			//获取当前新闻稿的状态，
			var states = $tr.find('.states').text();
			//获取当前行的pkId
			var pkId = $tr.find('.pkId').val();
			var processInstanceId= $tr.find(".process-instance-id").val();
			sessionStorage.setItem("searchParams", $('#keyword').val());
			sessionStorage.setItem("pageIndexs", $('.num-text.active').text());
			if(states=="草稿" || states=="未通过"){
				//跳转到可编辑页面
				window.location.href = "addUpdatePage.html?pkId="+pkId+"&"+"processInstanceId="+processInstanceId;
			}else{
				//调转到不可编辑页面
				window.location.href = "lookInfoPage.html?pkId="+pkId;
			}
		});
	},
	publish:function(){
		var pkId = $('.yt-table-active .pkId').val();
		//发布时间
		var issueDayeString = $('.yt-table-active .issueDayeString').text();
		
		//调用弹窗
		caList.legalAdd();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/news/updateIssueDaye",
			data: {
				pkId: pkId,
				issueDayeString:issueDayeString
			},
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt("发布成功");
					$(".yt-edit-alert,#heard-nav-bak").hide();
					caList.init();
				} else {
					$yt_alert_Model.prompt("发布失败");
					$(".yt-edit-alert,#heard-nav-bak").hide();
					caList.init();
				}
			}
		});
	},
	//带有顶部标题栏的弹出框  
	    legalAdd:function() {  
	        /** 
	         * 显示编辑弹出框和显示顶部隐藏蒙层 
	         */  
	        $(".alert-index").show();  
	        /** 
	         * 调用算取div显示位置方法 
	         */  
	        $yt_alert_Model.getDivPosition($(".alert-index"));  
	        /* 
	         * 调用支持拖拽的方法 
	         */  
	        $yt_model_drag.modelDragEvent($(".lawyer-opinion-box .yt-edit-alert-title"));  
	        /** 
	         * 点击取消方法 
	         */  
	        $('.alert-index .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {  
	            //隐藏页面中自定义的表单内容  
	            $(".alert-index").hide();  
	            //隐藏蒙层  
	            $("#pop-modle-alert").hide();  
	        });  
	    },
	
	/**
	 * 获取列表数据
	 */
	getPlanListInfo: function() {
		sessionStorage.getItem("searchParams")?$('#keyword').val(sessionStorage.getItem("searchParams")):'';
		var searchParameters=$('#keyword').val();
		$('.list-page').pageInfo({
			pageIndexs: sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "class/news/lookForAll", //ajax访问路径  
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
							sequenceNumber=i+1;
							htmlTr += '<tr>' +
								'<input type="hidden" value="' + v.pkId + '" class="pkId">' +
								'<td style="text-align:center;"><input type="hidden" value="' + v.processInstanceId + '" class="process-instance-id">' + sequenceNumber + '</td>' +
								'<td class="text-overflow td-title"><a style="color:#3c4687;" class="title">'+v.title+'</a></td>' +
								'<td class="projectName">' + v.projectName + '</td>' +
								'<td style="text-align:center;" class="createTimeString">' + v.createTimeString + '</td>' +
								'<td style="text-align:center;" class="text-overflow">' + v.createUserName + '</td>' +
								'<td style="text-align:center;" class="text-overflow issueDayeString">' + v.issueDayeString + '</td>' +
								'<td style="text-align:center;" class="states">' + v.states + '</td>' +
								'</tr>';
						});
					} else {
						$('.list-page').hide();
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
	},
	
	//点击保存或提交
	addnewsInfo:function(dataStates){
		$yt_baseElement.showLoading();
		var projectCode = $('#projectCode').val();
		var title = $('#title').val();
		var details = $('#details').val();
		var issueDayeString = $('#issueDayeString').val();
		var dealingWithPeople = $('#dealingWithPeople').val();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/news/addOrUpdateBean",
			data: {
				//新增可以为空，修改不能为空
				pkId:"",
				//班级编号
				projectCode: projectCode,
				//标题
				title:title,
				//内容
				details:details,
				//发布时间
				issueDayeString: issueDayeString,
				//流程定义
				businessCode: "news",
				//下一步操作人
				dealingWithPeople:dealingWithPeople,
				//提交，或保存
				dataStates:dataStates,
				//操作流程代码   不能为空
				nextCode:"submited"
			},
			success: function(data) {
				$yt_baseElement.showLoading();
				if(data.flag == 0) {
					$yt_baseElement.hideLoading(function (){
						$yt_alert_Model.prompt("添加成功");
						$(".yt-edit-alert,#heard-nav-bak").hide();
					});
				} else {
					$yt_baseElement.hideLoading(function (){
						$yt_alert_Model.prompt("添加失败");
						$(".yt-edit-alert,#heard-nav-bak").hide();
						
					});
				}
				caList.init();
			}
		});
	},
};
$(function() {
	//初始化方法
	caList.init();
	
});