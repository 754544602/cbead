var mal = {
	initDate :function(){
		//给当前页面设置最小高度
		$(".body-div").css("min-height",$(window).height()-12);
		/**
		 * 
		 * 
		 * 初始化日期控件
		 * 
		 */
		$("#startDate").calendar({
			controlId: "startTime",
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $("#endDate"), //开始日期最大为结束日期  
			speed: 0,
			callback: function() {}
		});
		$("#endDate").calendar({
			controlId: "endTime",
			nowData: false, //默认选中当前时间,默认true  
			lowerLimit: $("#startDate"), //结束日期最小为开始日期  
			speed: 0,
			callback: function() {}
		});
		//初始化下拉框数据
		mal.setAddselect();
		//金额格式化事件绑定
		mal.moneyFormat();
		//获取我的申请列表
		mal.getMyApplyList();
		
	},
	/*事件绑定*/
	thisEvent:function(){
		//查询按钮事件
		$(".apply-search-btn").click(function(){
			//获取我的申请列表
			mal.getMyApplyList();
		});
		//重置按钮事件
		$(".apply-reset-btn").click(function(){
			$(".apply-begin-date").val('');
			$(".apply-end-date").val('');
			$(".apply-reason-or-Id").val('');
			//下拉列表
			$(".apply-type").html('<option value="">请选择</option>');
			//初始化下拉框数据
			mal.setAddselect();
			$(".apply-type").niceSelect();
			$(".apply-begin-money").val('');
			$(".apply-end-money").val('');
			//获取我的申请列表
			mal.getMyApplyList();
		});
		//绑定去详情页面事件方法
		mal.toDetails();
		//流程状态链接事件绑定
		$(".plan-list-model").on('click','.process-state',function() {
			//获取当前数据的流程实例ID
			var processInstanceId = $(this).parents("tr").find(".processInstanceId").val();
			//调用获取流程图方法
			sysCommon.processStatePop(processInstanceId);
		});
	},
	/**
	 * 设置申请类别数据
	 */
	setAddselect: function(thisData) {
		var me = this;
		$.ajax({
			type: "post",
			data: {
				dictTypeCode:'APPLY_TYPE'
			},
			url: 'basicconfig/dictInfo/getDictInfoByTypeCode',
			success: function(data) {
				var datas = data.data;
				//1.遍历数据,给select赋值 
				$.each(datas, function(i, n) {
					if(n.value!='LOAN_APP'&&n.value!='EXPENDITURE_APP'&& n.value!='ADVANCE_APP'){
						$('select.user-name-sel').append('<option value="' + n.value + '">' + n.disvalue + '</option>');
					}
				});
				$("select.user-name-sel").niceSelect();
			}
		});

	},
	//金额格式化
	moneyFormat: function() {
		/** 
		 * 金额文本框获取焦点事件 
		 */
		$(".top-money,.bottom-money").on("focus", function() {
			if($(this).val() != "") {
				//调用还原格式化的方法  
				$(this).val($yt_baseElement.rmoney($(this).val()));
			}
		});
		/** 
		 * 金额文本框失去焦点事件 
		 */
		$(".top-money,.bottom-money").on("blur", function() {
			if($(this).val() != "") {
				//调用格式化金额方法  
				$(this).val($yt_baseElement.fmMoney($(this).val()));
			}
		});
	},
	/**
	 * 
	 * 获取我的申请列表数据
	 * 
	 */
	getMyApplyList: function() {
		var me = this;	//mal
		//从页面获取条件查询时数据
		//		申请日期、apply-begin-date		apply-end-date
		//		单据编号、
		//		申请事由、apply-reason-or-Id
		//		申请类别、apply-type
		//		申请金额(元)、apply-begin-money		apply-end-money	
		//		流程状态
		//开始日期
		var applyBgDate = $(".apply-begin-date").val();
		//结束日期
		var applyEndDate = $(".apply-end-date").val();
		//查询条件
		var applyReasonOrId = $(".apply-reason-or-Id").val();
		//申请类型
		var applyType = $(".apply-type").val();
		//起始金额
		var applyBgMoney="";
		if($(".apply-begin-money").val()){
			applyBgMoney=$yt_baseElement.rmoney($(".apply-begin-money").val());
		}
		//结束金额
		var applyEndMoney="";
		if($(".apply-end-money").val()){
			applyEndMoney=$yt_baseElement.rmoney($(".apply-end-money").val());
		}
		$('.page1').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url:"sz/applyApp/myApplicationAppInfo", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data:{
				startDate:applyBgDate,
				endDate:applyEndDate,
				queryParams:applyReasonOrId,
				formType:applyType,
				startAmount:applyBgMoney,
				endAmount:applyEndMoney,
				type:"project"
			},// {	},//条件查询数据
			//ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				var htmlTbody = $('.plan-list-model .yt-tbody.my-apply-list');
				htmlTbody.empty();
				var trStr  = "";
				if(data.flag == 0){
					var datas = data.data.rows;
					if(datas.length > 0){
						$('.page1').show();
						//获取公用的不显示流程图的状态字符串
						sysCommon.isWorkFlowStateStr = ','+sysCommon.isWorkFlowStateStr+',';
						$.each(datas,function(i,n) {//index  formType
							trStr += '<tr>'+
								'<td>'+ n.applicantTime +'</td>'+
								'<td><a class="yt-link to-detail">'+ n.appNum +'</a><input type="hidden" class="hid-obj-id" value="' + n.pkId + '"/><input type="hidden" class="processInstanceId" value="'+n.processInstanceId+'"/><input type="hidden" class="hid-obj-type" value="' + n.formType + '"/></td>'+
								'<td style="text-align: left;">'+ n.appName +'</td>'+
								'<td>'+ n.formTypeName +'</td>'+
								'<td style="text-align: right;">'+ $yt_baseElement.fmMoney(n.totalAmount) +'</td>';
								//检索不能显示流程图的状态字符串
								if(sysCommon.isWorkFlowStateStr.indexOf(','+n.workFlowState+',') == -1){
									trStr += '<td style="text-align: left;">'+'<span class="yt-link process-state">'+ n.nodeNowState +'</span>'+'</td>';
								}else{
									trStr += '<td style="text-align: left;">'+n.nodeNowState+'</td>';
								}
								trStr += '</tr>';
						});
						htmlTbody.append(trStr);
					}else{
						$('.page1').hide();
						//拼接暂无数据效果
						htmlTbody.html('<tr style="border:0px;background-color:#fff !important;"><td  colspan="6" align="center"style="border:0px;"><div class="no-data" style="width: 280px;margin: 0 auto;">' +
						'<img src="../../../../../resources-sasac/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
						'</div></td></tr>');
					}
				}
				
			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});

	},
	/**
	 * 
	 * 点击编号  查看详情
	 * 
	 */
	toDetails: function() {
		$('.plan-list-model .yt-tbody.my-apply-list').off("click").on('click','.yt-link.to-detail', function() {
			/*调用阻止冒泡方法*/
			$yt_baseElement.eventStopPageaction();
			/*获取流程实例id*/
			var processInstanceId = $(this).parents('tr').find('.processInstanceId').val();
			//获取当前对象ID
			var objId = $(this).parents('tr').find('.hid-obj-id').val();
			//获取当前数据类型
			var objType = $(this).parents('tr').find('.hid-obj-type').val();
			var pageUrl = '';
			var goPageUrl = '';
			/*
			 * 根据类型跳转不同页面
			 * 事前申请: ADVANCE_APP
			报销申请: REIM_APP
			付款申请: PAYMENT_APP
			借款申请: LOAN_APP
			支出：EXPENDITURE_APP
			事前变更：CHANGE_APP*/
			if(objType=='ADVANCE_APP'){
				/*页面跳转打开新页面*/
				pageUrl = "view/projectManagement-sasac/expensesReim/module/beforehand/beforeApplyDetail.html?advanceId="+objId;//即将跳转的页面路径
				goPageUrl = "view/projectManagement-sasac/expensesReim/module/approval/beforehandApproveList.html";//左侧菜单指定选中的页面路径
			}else if(objType=='REIM_APP'){
				/*页面跳转打开新页面*/
				pageUrl = "view/projectManagement-sasac/expensesReim/module/reimApply/reimApplyDetail.html?processInstanceId=" + processInstanceId+"&reimId="+objId;//即将跳转的页面路径
				goPageUrl = "view/projectManagement-sasac/expensesReim/module/reimApply/reimApproveList.html";//左侧菜单指定选中的页面路径
			}else if(objType=='PAYMENT_APP'){
				/*页面跳转打开新页面*/
				pageUrl = "view/projectManagement-sasac/expensesReim/module/payment/paymentApplyDetail.html?processInstanceId=" + processInstanceId+"&payAppId="+objId;//即将跳转的页面路径
				goPageUrl = "view/projectManagement-sasac/expensesReim/module/approval/paymentApprovalList.html";//左侧菜单指定选中的页面路径
			}else if(objType=='LOAN_APP'){
				/*页面跳转打开新页面*/
				pageUrl = "view/projectManagement-sasac/expensesReim/module/loanApply/loanApplyDetail.html?processInstanceId=" + processInstanceId+"&loanId="+objId;//即将跳转的页面路径
				goPageUrl = "view/projectManagement-sasac/expensesReim/module/approval/loanApprovalList.html";//左侧菜单指定选中的页面路径
			}else if(objType == 'EXPENDITURE_APP'){
				//支出
				pageUrl = "view/projectManagement-sasac/expensesReim/module/reimApply/expenseDetail.html?appId="+objId;//即将跳转的页面路径
				goPageUrl = "view/projectManagement-sasac/expensesReim/module/approval/expenApplApprList.html";//左侧菜单指定选中的页面路径
			}else if(objType == 'CHANGE_APP'){
				//事前变更
				pageUrl = "view/projectManagement-sasac/expensesReim/module/busiTripApply/projectServeDetails.html?advanceAppId="+objId;//即将跳转的页面路径
				goPageUrl = "view/projectManagement-sasac/expensesReim/module/approval/projectBefList.html";//左侧菜单指定选中的页面路径
			}else if (objType == 'FINAL_APP') {
				pageUrl = "view/projectManagement-sasac/expensesReim/module/reimApply/finalDetail.html?appId="+ objId;
				goPageUrl = "view/projectManagement-sasac/expensesReim/module/approval/projectBefList.html";
			}else if (objType == 'PROJECT_BUDGET') {
			  //项目预算
				pageUrl = "view/projectManagement-sasac/expensesReim/module/beforehand/beforeApplyDetail.html?advanceId="+ objId + '&processInstanceId=' + processInstanceId;
				goPageUrl = "view/projectManagement-sasac/expensesReim/module/approval/projectBefList.html";
			}else if (objType == 'FINAL_APP') {
			  //项目决算
				pageUrl = "view/projectManagement-sasac/expensesReim/module/reimApply/finalDetail.html?appId="+ objId;
				goPageUrl = "view/projectManagement-sasac/expensesReim/module/approval/projectBefList.html";
			}
			$yt_baseElement.openNewPage(2,pageUrl);
		})
	}
}
$(function(){
	//初始方法
	mal.initDate();
	//为页面按钮初始化事件
	mal.thisEvent();
})
