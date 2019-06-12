var addProjectList = {
	//初始化方法
	init: function() {
		//项目类型
		var projectType = $yt_common.GetQueryString('projectType');
		var pkId = $yt_common.GetQueryString('pkId');
		$('.add-title').text('新增项目');
		$('.documentCodeTd').hide();
		var judgeList = $yt_common.GetQueryString('judgeList');
		if(judgeList == 1) {//我的项目列表跳转过来的
			if(pkId == null){//新增功能跳转，下拉框项目类型只有委托
				$("option[value='3']").remove();
				$("option[value='4']").remove();
				$("option[value='5']").remove();
				$("option[value='']").remove();
			}else{//修改跳转
				if(projectType == 2){//修改跳转过来的，且该项目类型为委托类型
					$("option[value='3']").remove();
					$("option[value='4']").remove();
					$("option[value='5']").remove();
					$("option[value='']").remove();
				}else{//选学或调训类型修改
					$("option[value='2']").remove();
					if(projectType == 3){//选学类型没有委托信息
						$(".add-project-entrust-hidden").hide();//隐藏委托信息
						$('.documentCodeTd').show();
					}
				}
			}
			
		}
		if(judgeList == 2) {//从培训项目列表跳转过来的
			if(pkId == null){//新增项目跳转
				$("option[value='2']").remove();//项目类型下拉框没有委托类型
				if(projectType == 3){//修改项目类型为选学类型，没有委托单位信息
					$(".add-project-entrust-hidden").hide();
					$('.documentCodeTd').show();
				}
			}else{//修改跳转
				if(projectType == 2){//被修改的项目类型委托类型
					$("option[value='3']").remove();
					$("option[value='4']").remove();
					$("option[value='5']").remove();
					$("option[value='']").remove();
				}else{//修改类型为选学或调训
					$("option[value='2']").remove();//移除项目类型下拉框中委托类型选项
					if(projectType == 3){//修改类型选学
						$(".add-project-entrust-hidden").hide();//隐藏委托单位信息
						$('.documentCodeTd').show();
					}
				}
			}
			
		}
		//初始化下拉列表
		$(".yt-select").niceSelect();
		//学员人数只能输入数字
		$('.customer-trainee-sum').blur(function(){
			this.value=this.value.replace(/\D/g,'');
		})
		//初始化日期控件
		$(".start-date").calendar({
			controlId: "startDate",
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $(".end-date"), //开始日期最大为结束日期  
			callback:function(){
				var atartDate = $("input.start-date").val();
				if(atartDate != ""){
					$("input.start-date").removeClass("valid-hint");
					$("input.start-date").next().text("");
				}
				if($(".start-date").val()!=''&&$(".end-date").val()!=''){
					var endDate = new Date($(".end-date").val());
					var startDate = new Date($(".start-date").val());
					var date =  endDate.getTime()-startDate;
					$('.train-date').val((date/ 1000 / 60 / 60 / 24)+1)
				}
			}
		});
		$(".end-date").calendar({
			controlId: "endDate",
			nowData: false, //默认选中当前时间,默认true  
			lowerLimit: $(".start-date"), //结束日期最小为开始日期  
			callback:function(){
				var endDate = $("input.end-date").val();
				if( endDate != ""){
					$("input.end-date").removeClass("valid-hint");
					$("input.end-date").next().text("");
				}
				if($(".start-date").val()!=''&&$(".end-date").val()!=''){
					var endDate = new Date($(".end-date").val());
					var startDate = new Date($(".start-date").val());
					var date =  endDate.getTime()-startDate;
					$('.train-date').val((date/ 1000 / 60 / 60 / 24)+1);
				}
			}
		});
		//项目类型为调训  显示委托单位信息
		$(".project-type").change(function() {//只有选学没有委托单位信息
			if($(".project-type").val() == 4 || $(".project-type").val() == 2 || $(".project-type").val() == 5) {//调训
				$(".add-project-entrust-hidden").show();
				$('.documentCodeTd').hide();
			}else{
				$('.documentCodeTd').show();
				$(".add-project-entrust-hidden").hide();
			}
		});
		//选择项目销售后提示框隐藏
		$(".project-sell").change(function(){
			$(".project-sell").removeClass("valid-hint");
			$("div.project-sell").next().text("");
		});
		addProjectList.getUserDataByDynamicKey();
		//判断当前页面是新增还是修改
		if(pkId != null) { //修改
			//修改页面获取数据
			addProjectList.getProjectInf();
			//点击修改页面确定按钮
			$(".btn-sub").on('click', function() {
				if(projectType == 3){//选学
					if($yt_valid.validForm($('.project-table'))){//字段验证只验证项目信息
						addProjectList.amendProjectListInf();
					}
				}else{
					if($yt_valid.validForm($('.class-info-table td:visible'))){
						addProjectList.amendProjectListInf();
					}else{
						$(document).scrollTop($('.valid-hint').eq(0).offset().top-100)
					}
				}
			});
			//点击修改页面取消按钮
			$(".btn-off").on('click', function() {
				$yt_alert_Model.alertOne({
					haveCloseIcon: false, //是否带有关闭图标  
					closeIconUrl: "", //关闭图标路径  
					leftBtnName: "确定", //左侧按钮名称,默认确定  
					rightBtnName: "取消", //右侧按钮名称,默认取消  
					cancelFunction: "", //取消按钮操作方法*/  
					alertMsg: "是否取消保存已修改的信息！", //提示信息  
					confirmFunction: function() { //点击确定按钮执行方法  
						window.history.back();
					}
				});
			});
		} else { //新增
			//点击新增页面确定按钮
			$('.btn-sub').off().click(function() {
				var inp=$('.box-list input');
				$.each(inp, function(i,n) {
					if($(this).val()==""){
						$(this).addClass('null-input');
					}else{
						$(this).removeClass('null-input');
					}
				});
				var addType = $(".project-type").val();
				var projectName = $(".project-name").val();
				var projectType = $(".project-type").val();
				var startDate = $(".start-date").val();
				var endDate = $(".end-date").val();
				var trainDate = $(".train-date").val();
				var details = $(".details").val();
				//if(projectName != "" && projectType != "" && sxtartDate != "" && endDate != "" && trainDate != "" && details != ""){
				if (addType == 3) {//选学
					if($yt_valid.validForm($('.project-table'))){//选学只验证项目信息
						addProjectList.addProjectListInf();
					}else{
						$(document).scrollTop(200);
					}
				}else{//验证项目信息和委托单位
					if($yt_valid.validForm($('.class-info-table td:visible'))){
						addProjectList.addProjectListInf();
					}else{
						$(document).scrollTop($(".null-input").eq(0).offset().top);
					}	
				}
				
				
//				if($yt_valid.validForm($('.valid-tab'))) {
//					addProjectList.addProjectListInf();
//				} else {
//					addProjectList.pageToScroll($('body .valid-font'));
//				}
			});
			//点击新增页面取消按钮
			$(".btn-off").on('click', function() {
				$yt_alert_Model.alertOne({
					haveCloseIcon: false, //是否带有关闭图标  
					closeIconUrl: "", //关闭图标路径  
					leftBtnName: "确定", //左侧按钮名称,默认确定  
					rightBtnName: "取消", //右侧按钮名称,默认取消  
					cancelFunction: "", //取消按钮操作方法*/  
					alertMsg: "是否取消保存已修改的信息！", //提示信息  
					confirmFunction: function() { //点击确定按钮执行方法  
						window.history.back();
					}
				});
			});
		}
		//获取集团名称
		$('.group-td').click(function(){
			$('.receive-group-search').val('');
			$('.receive-group-div').show();
			addProjectList.getListSelectGroup();
		})
		$('.receive-group-canel-btn').off().click(function(){
				$('.receive-group-div').hide();
			})
		$('.receive-group-sure-btn').off().click(function(){
			if($('.receive-group-div .yt-table-active')[0]){
				$('.group-id').val($('.receive-group-div .yt-table-active td').attr('groupId'));
				$('.group-name').val($('.receive-group-div .yt-table-active td').text());
				$('.receive-group-div').hide();
				if($('.group-name').val()!=''){
					$('.group-name').removeClass('valid-hint');
					$('.group-name').siblings('.valid-font').text('');
				}
			}else{
				$yt_alert_Model.prompt('请选择集团单位');
			}

		})
		$('.receive-group-div .receive-group-btn-img').off().click(function(){
			addProjectList.getListSelectGroup();
		})
//		if(groupList != null) {
//			$.each(groupList, function(i, n) {
//				$(".group-id").append('<option value="' + n.groupId + '">' + n.groupName + '</option>');
//			});
//		}
//		$(".group-id").niceSelect({  
//	        search: true,  
//	        backFunction: function(text) {  
//	            //回调方法,可以执行模糊查询,也可自行添加操作  
//	            $("select.group-id option").remove();  
//	            if(text == "") {  
//	                $("select.group-id").append('<option value="">请选择</option>');  
//	            }  
//	            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
//	            $.each(groupList, function(i, n) {  
//	                if(n.groupName.indexOf(text) != -1) {  
//	                    $("select.group-id").append('<option value="' + n.groupId + '">' + n.groupName + '</option>');  
//	                }  
//	            });  
//	        }  
//	    });
		//获取项目销售下拉列表
		var treeAllPersonal = addProjectList.getTreeAllPersonnel();
		if(treeAllPersonal != null) {
			$.each(treeAllPersonal, function(i, n) {
				if(n.type == 3) {
					$(".project-sell").append('<option value="' + n.textName + '">' + n.text + '</option>');
				}
			});
		}
		$("select.project-sell").niceSelect({  
        search: true,  
        backFunction: function(text) {  
	            //回调方法,可以执行模糊查询,也可自行添加操作  
	            $("select.project-sell option").remove();  
	            if(text == "") {  
	                $("select.project-sell").append('<option value="">请选择</option>');  
	            }  
	            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
	            $.each(treeAllPersonal, function(i, n) {  
	                if(n.text.indexOf(text) != -1) {  
	                	if(n.type == 3) {
	                    $("select.project-sell").append('<option value="' + n.textName + '">' + n.text + '</option>');  
	                   }
	                }  
	            });  
	        }  
    	});
	},
	getUserDataByDynamicKey: function() {
			var userInfo = {};
			var token = $yt_common.getToken();
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "uniform/user/getUsersDetails",
				async: true,
				success: function(data) {
					//默认为当前登录人
					$(".project-sell").setSelectVal($yt_common.user_info.userName);
				}
			});
		},
	/**
	 * 获取所有集团,单位
	 */
	getListSelectGroup: function() {
//		var list = [];
//		$.ajax({
//			type: "post",
//			url: $yt_option.base_path + "uniform/group/getGroups",
//			data: {
//				isSelectGroup: '3',
//				groupId: ""
//			},
//			async: false,
//			success: function(data) {
//				list = data.data || [];
//			}
//		});
//		return list;
		$('.receive-group-page').pageInfo({
			type:"post",
			url:$yt_option.base_path+"class/noticeReception/getGroups",
			async:true,
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			before:function(){
				$yt_baseElement.showLoading();
			},
			data:{
				groupName:$('.receive-group-search').val(),
				types:2
			},
			success:function(data){
				$yt_baseElement.hideLoading();
				if(data.flag==0){
					var tr = '';
					$('.receive-group-tbody').empty();
					$.each(data.data.rows,function(i,n){
						tr = '<tr><td groupId="'+n.groupId+'">'+n.groupName+'</td></tr>';
						$('.receive-group-tbody').append(tr);
					})
					/** 
				 * 调用算取div显示位置方法 
				 */
				$yt_alert_Model.setFiexBoxHeight($(".receive-group-div .yt-edit-alert-main"));
				$yt_alert_Model.getDivPosition($(".receive-group-div"));
				$yt_model_drag.modelDragEvent($(".receive-group-div .yt-edit-alert-title"));
				}else{
					$yt_alert_Model.prompt('查询失败')
				}
			},
			error:function(){
				$yt_baseElement.hideLoading();
				$yt_alert_Model.prompt('查询失败')
			},
			isSelPageNum: false //是否显示选择条数列表默认false  
			
		});
	},
	/**
	 * 获取树形结构所有人员
	 */
	getTreeAllPersonnel: function() {
		var list = [];
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/user/getUsers",
			data: {

			},
			async: false,
			success: function(data) {
				list = data.data || [];
			}
		});
		return list;
	},
	//新增
	addProjectListInf: function() {
		$yt_baseElement.showLoading();
		var projectName = $(".project-name").val();
		var projectType = $(".project-type").val();
		var projectSell = $(".project-sell").val();
		var startDate = $(".start-date").val();
		var endDate = $(".end-date").val();
		var trainDate = $(".train-date").val();
		var details = $(".details").val();
		var groupId = $(".group-id").val();
		var customerDept = $(".customer-dept").val();
		var customerLinkman = $(".customer-linkman").val();
		var customerLinkmanPosition = $(".customer-linkman-position").val();
		var customerLinkmanPhone = $(".customer-linkman-phone").val();
		var customerLinkmanCellphone = $(".customer-linkman-cellphone").val();
		var customerLinkmanFax = $(".customer-linkman-fax").val();
		var customerLinkmanEmail = $(".customer-linkman-email").val();
		var customerTraineePosition = $(".customer-trainee-position").val();
		var customerTraineeSum = $(".customer-trainee-sum").val();
		var customerTraineeAgeStructure = $(".customer-trainee-age").val();
		var customerTargetDemand = $(".customer-target-demand").val();
		var documentCode = $('.documentCode').val();
		projectType==3?documentCode=documentCode:documentCode='';
		$.ajax({
			async: true,
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "project/addOrUpdateBean", //ajax访问路径  
			beforeSend: function() {
				$yt_baseElement.showLoading();
			},
			data: {
				projectName: projectName,
				projectType: projectType,
				projectSell: projectSell,
				startDate: startDate,
				endDate: endDate,
				trainDate: trainDate,
				details: details,
				groupId: groupId,
				customerDept: customerDept,
				customerLinkman: customerLinkman,
				customerLinkmanPosition: customerLinkmanPosition,
				customerLinkmanPhone: customerLinkmanPhone,
				customerLinkmanCellphone: customerLinkmanCellphone,
				customerLinkmanFax: customerLinkmanFax,
				customerLinkmanEmail: customerLinkmanEmail,
				customerTraineePosition: customerTraineePosition,
				customerTraineeSum: customerTraineeSum,
				customerTraineeAgeStructure: customerTraineeAgeStructure,
				customerTargetDemand: customerTargetDemand,
				documentCode:documentCode
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt("新增成功");
					$(".btn-all").hide();
					$yt_baseElement.hideLoading();
					window.history.back();
				} else {
					$yt_alert_Model.prompt("新增失败");
					$yt_baseElement.hideLoading();
				}
			}
		});
	},
	//项目查询一条详细信息
	getProjectInf: function() {
		var pkId = $yt_common.GetQueryString('pkId');
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "project/getBeanById", //ajax访问路径  
			data: {
				pkId: pkId
			}, //ajax查询访问参数
			beforeSend: function() {
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag == 0) {
					$('.add-title').text('修改项目');
					$(".get-project-inf").setDatas(data.data);
					//从返回的值里给select赋值
					$(".project-type").setSelectVal(data.data.projectType);
					$(".project-sell").setSelectVal(data.data.projectSell);
					$(".group-id").val(data.data.groupId);
					if($(".project-type").val() == 4) {
						$(".add-project-entrust-hidden").show();
					}
					//修改项目-不能修改类型
					if(pkId!=null){
						$('.projectTypeVel').text($('select.project-type option:selected').text());
						$('.project-type').hide();
					}
					$yt_baseElement.hideLoading();
				} else {
					$yt_alert_Model.prompt("获取失败");
					$yt_baseElement.hideLoading();
				}
			}
		});
	},
	//修改
	amendProjectListInf: function() {
		var pkId = $yt_common.GetQueryString('pkId');
		var projectName = $(".get-project-inf .project-name").val();
		var projectType = $(".get-project-inf .project-type").val();
		var projectSell = $(".get-project-inf .project-sell").val();
		var startDate = $(".get-project-inf .start-date").val();
		var endDate = $(".get-project-inf .end-date").val();
		var trainDate = $(".get-project-inf .train-date").val();
		var details = $(".get-project-inf .details").val();
		var groupId = $(".get-project-inf .group-id").val();
		var groupName = $(".group-id option:selected").text();
		var customerDept = $(".get-project-inf .customer-dept").val();
		var customerLinkman = $(".get-project-inf .customer-linkman").val();
		var customerLinkmanPosition = $(".get-project-inf .customer-linkman-position").val();
		var customerLinkmanPhone = $(".get-project-inf .customer-linkman-phone").val();
		var customerLinkmanCellphone = $(".get-project-inf .customer-linkman-cellphone").val();
		var customerLinkmanFax = $(".get-project-inf .customer-linkman-fax").val();
		var customerLinkmanEmail = $(".get-project-inf .customer-linkman-email").val();
		var customerTraineePosition = $(".get-project-inf .customer-trainee-position").val();
		var customerTraineeSum = $(".get-project-inf .customer-trainee-sum").val();
		var customerTraineeAgeStructure = $(".get-project-inf .customer-trainee-age").val();
		var customerTargetDemand = $(".get-project-inf .customer-target-demand").val();
		var documentCode = $('.documentCode').val();
		projectType==3?documentCode=documentCode:documentCode=undefined;
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "project/addOrUpdateBean", //ajax访问路径  
			beforeSend: function() {
				$yt_baseElement.showLoading();
			},
			data: {
				pkId: pkId,
				projectName: projectName,
				projectType: projectType,
				projectSell: projectSell,
				startDate: startDate,
				endDate: endDate,
				trainDate: trainDate,
				details: details,
				groupId: groupId,
				groupName:groupName,
				customerDept: customerDept,
				customerLinkman: customerLinkman,
				customerLinkmanPosition: customerLinkmanPosition,
				customerLinkmanPhone: customerLinkmanPhone,
				customerLinkmanCellphone: customerLinkmanCellphone,
				customerLinkmanFax: customerLinkmanFax,
				customerLinkmanEmail: customerLinkmanEmail,
				customerTraineePosition: customerTraineePosition,
				customerTraineeSum: customerTraineeSum,
				customerTraineeAgeStructure: customerTraineeAgeStructure,
				customerTargetDemand: customerTargetDemand,
				documentCode:documentCode
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt("修改成功");
					window.history.back();
					$yt_baseElement.hideLoading();
				} else {
					$yt_alert_Model.prompt("修改失败");
					$yt_baseElement.hideLoading();
				}
			}
		});
	},
	pageToScroll: function(validObj) {
		var scrollTopVal = 0;
		$(validObj).each(function() {
			if($(this).text() != "") {
				if($(window).scrollTop() && ($(this).eq(0).parent().offset().top < $(window).scrollTop() || $(this).eq(0).parent().offset().top > $(window).height())) {
					scrollTopVal = $(this).eq(0).parents().offset().top - 30;
					$(window).scrollTop(scrollTopVal);
				}
				return false;
			}
		});
	}

}
$(function() {
	//初始化方法
	addProjectList.init();
});