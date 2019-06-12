var caList = {
	ue:null,
	//初始化方法
	init: function() {
		//初始化富文本编辑器
	 	caList.ue = UE.getEditor('container', {
			toolbars: [
				[ 'undo', 'redo', '|',
					'bold', 'italic', 'underline', 'forecolor', '|',
					'justifyleft', 'justifycenter', 'justifyright', 'justifyjustify','|','simpleupload','attachment'
				]
			],
			autoHeightEnabled: true,
			elementPathEnabled:false,
            enableAutoSave :false,
            saveInterval:0
		});
		//初始化新增页面
		caList.clearAlertBox();
		//初始化下拉列表
		$('select').niceSelect();
		
		//初始化创建时间
		$("#issueDayeString").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			lowerLimit: "2010/01/01", // 日期下限，默认：NaN(不限制)     
			nowData: true, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd HH:mm",
			callback: function() {} // 点击选择日期后的回调函数  
		});
		//班级列表下拉框
		var classList = caList.getClassLis();
		var userName = caList.userInfo();//登录人
		if(classList != null) {
			var projectUserCode;
			var projectHeadmasterCode;
			var projectSell;
			var projectAid;
			$.each(classList.data, function(i, n) {
				//项目主任code
				projectUserCode = n.projectUserCode;
				//班主任code
				projectHeadmasterCode = n.projectHeadmasterCode;
				//项目销售code
				projectSell = n.projectSell;
				//项目助理code
				projectAid = n.projectAid;
				//判断当前登录人是否为项目主任或班主任
				if(projectUserCode.indexOf(userName) != -1 || projectHeadmasterCode.indexOf(userName) != -1 || projectSell.indexOf(userName) != -1 || projectAid.indexOf(userName) != -1) {
					$("#projectCode").append($('<option value="' + n.projectCode + '">' + n.className + '</option>').data("classData", n));
				}
			});
			//初始化班级下拉框
		$("#projectCode").niceSelect({  
	        search: true,  
	        backFunction: function(text) {  
	            //回调方法,可以执行模糊查询,也可自行添加操作  
	            $("#projectCode option").remove();  
	            if(text == "") {  
	                $("#projectCode").append('<option value="">请选择</option>');  
	            }  
	            $.each(classList.data, function(i, n) {
				//项目主任code
				projectUserCode = n.projectUserCode;
				//班主任code
				projectHeadmasterCode = n.projectHeadmasterCode;
				//项目销售code
				projectSell = n.projectSell;
				//项目助理code
				projectAid = n.projectAid;
				//判断当前登录人是否为项目主任或班主任
				if(projectUserCode.indexOf(userName) != -1 || projectHeadmasterCode.indexOf(userName) != -1 || projectSell.indexOf(userName) != -1 || projectAid.indexOf(userName) != -1) {
					if(n.className.indexOf(text) != -1) {
						$("#projectCode").append($('<option value="' + n.projectCode + '">' + n.className + '</option>').data("classData", n));
	                }  
				}
			});
	        }  
	    });
		};
		//选择班级获取项目主任名
		$('#projectCode').on('change', function() {
			var className = $('#projectCode option:selected').val();
			if(className != "请选择班级"){
				var projectUserName = $('#projectCode option:selected').data("classData").projectUserName;
				$('#projectUserName').text(projectUserName);
			}
		});
		//下一步操作人
		var nextPersonList = caList.getNextOperatePerson();
		if(nextPersonList != null) {
			$.each(nextPersonList, function(i, n) {
				$("#dealingWithPeople").append($('<option value="' + n.userCode + '">' + n.userName + '</option>').data("classData", n));
			});
		};
		
		//初始化下一步操作人下拉框
		$("#dealingWithPeople").niceSelect();
		
		//点击返回
		$('.page-return-btn').off().on("click", function() {
			//调用返回指定页面函数
			caList.backNewsListPage();
		});
		
		//点击取消
		$('#cancel').off().on("click", function() {
			//调用返回指定页面函数
			caList.backNewsListPage();
		});
		
		
		//点击保存
		$('#save').off().on('click', function() {
			//调用判空函数
			caList.isNoNull(1);
		});
		//点击提交
		$('#submit').off().on('click', function() {
			//调用判空函数
			caList.isNoNull(2);	
		});
		
		
	},
	//返回新闻稿列表
	backNewsListPage:function(){
		var pageNum = $yt_common.GetQueryString("pageNum");
		if(pageNum == 2){//跳转到待审批列表页面
			window.location.href = "lookForByBacklogList.html";
		}else{
			window.location.href = "newList.html";
		}
	},
	
	
	/**
	 * 获取所有班级
	 */
	getClassLis: function() {
		var className = $("#projectCode").val();
		className = "";
		var list = [];
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/getClasslist",
			data: {
				searchParameters:"",
				types:"4",
				sort:"start_date",
				orderType:"",
				dataStates:"1"
			},
			async: false,
			success: function(data) {
				list = data || [];
			}
		});
		return list;
	},
	//点击保存，提交判断页面中数据是否为空
	isNoNull:function(dataStates){
		var title = $('#title').val();
		var details = caList.ue.getContent();
		var issueDayeString = $('#issueDayeString').val();
		$yt_valid.validForm($("#valid-tab"));
		if(title=="" || details=="" || issueDayeString==""){
			//框架判空函数
			$yt_valid.validForm($(".valid-tab"));
		}else{
			//调用提交，保存函数
			caList.addnewsInfo(dataStates);
		}
		
	},
	//点击保存，提交判断页面中数据是否为空
//	isNoNull:function(dataStates){
//		var title = $('#title').val();
//		var details = caList.ue.getContent();
//		$yt_valid.validForm($("#valid-tab"));
//		if(title=="" || details==""){
//			$yt_valid.validForm($(".valid-tab"));
//		}else{
//			caList.addnewsInfo(dataStates);
//		}
//		
//	},
	/**
	 * 获下一步操作人
	 */
	getNextOperatePerson: function() {
		var list = [];
		var dataObj;
		var user = null;
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/workFlowOperate/getSubmitPageData",
			data: {
				businessCode: "news",
				processInstanceId:""
			},
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					$.each(data.data, function(i, n) {
						for(var k in n) {
							user= n[k];
						}
					});

				}
			}
		});
		return user;
	},
	//获取登录人信息
	userInfo: function() {
		var userName = "";
		$.ajax({
			async: false,
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "uniform/user/getUsersDetails", //ajax访问路径  
			data: {}, //ajax查询访问参数
			success: function(data) {
				userName = data.data.userName;
			}
		});
		return userName;
	},
	//点击新增清空弹窗内容
	clearAlertBox:function(){
		$('#projectCode').val("");
		$('#projectUserName').val("");
		$('#title').val("");
		$('#issueDayeString').val("");
		$('#dealingWithPeople').val("");
		$('select').niceSelect();
	},
	
	//点击保存或提交
	addnewsInfo:function(dataStates){
		$yt_baseElement.showLoading();
		var pkId = $yt_common.GetQueryString("pkId");
		var projectCode = $('#projectCode').val();
		var title = $('#title').val();
		var details = caList.ue.getContent();
		var issueDayeString = $('#issueDayeString').val();
		var dealingWithPeople = $('#dealingWithPeople').val();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/news/addOrUpdateBean",
			data: {
				//新增可以为空，修改不能为空
				pkId:pkId,
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
				if(data.flag == 0) {
					$yt_alert_Model.prompt("添加成功");
					$(".yt-edit-alert,#heard-nav-bak").hide();
					
				} else {
					$yt_baseElement.hideLoading(function (){
						$yt_alert_Model.prompt("提交失败");
					});
				}
				caList.backNewsListPage();
			}
		});
	},
};
$(function() {
	//初始化方法
	caList.init();
	
});