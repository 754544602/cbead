var mal = {
	initDate: function() {
		//给当前页面设置最小高度
		$(".body-div").css("min-height",$(window).height()-16);
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
		//获取我的草稿列表
		mal.getDraftsList();
		//为页面按钮初始化事件
		mal.thisEvent();
	},
	/*事件绑定*/
	thisEvent: function() {
		//查询按钮事件
		$(".drafts-search-btn").click(function() {
			mal.getDraftsList();
		});
		//重置按钮事件
		$(".drafts-reset-btn").click(function() {
			$(".apply-reason").val('');
			//下拉列表
			$(".apply-type").html('<option value="">请选择</option>');
			mal.setAddselect();
			$(".apply-type").niceSelect();
			$(".save-begin-date").val('');
			$(".save-end-date").val('');
			$(".apply-begin-money").val('');
			$(".apply-end-money").val('');
			mal.getDraftsList();
		});
		//绑定修改事件
		$(".drafts-list").on('click','.operate-update',function() {
			var thisObj = $(this);
			var tr = thisObj.parents("tr");
			var type = tr.attr('formType');
			var id = tr.attr('pkId');
			mal.formTypeUpdata(type,id);
		});
		//绑定删除事件
		$(".drafts-list").on('click','.operate-del',function() {
			var thisObj = $(this);
			var tr = thisObj.parents("tr");
			var type = tr.attr('formType');
			var id = tr.attr('pkId');
			$yt_alert_Model.alertOne({
				alertMsg: "确定要删除此条数据吗?", //提示信息  
				leftBtnName: "确定",
				confirmFunction: function() { //点击确定按钮执行方法  
					mal.formTypeEvent(type,id);
				}
			});

		});

	},
	/**
	 * 设置申请类别下拉列表信息
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
					if(n.value!='LOAN_APP'&&n.value!='EXPENDITURE_APP'&&n.value!='ADVANCE_APP'){
					$('select.user-name-sel').append(
							'<option value="' + n.value + '">' + n.disvalue
									+ '</option>')
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
	 * 获取草稿箱列表数据方法
	 * 
	 */
	getDraftsList: function() {
		var me = this; //mal
		//从页面获取条件查询时数据
		//拟申请事由、apply-reason
		//申请类型、apply-type
		//保存日期、save-begin-date		save-end-date
		//拟申请金额、apply-begin-money		apply-end-money	
		var applyReason = $(".apply-reason").val();
		var applyType = $(".apply-type").val();
		var saveBgDate = $(".save-begin-date").val();
		var saveEndDate = $(".save-end-date").val();
		var applyBgMoney="";
		if($(".apply-begin-money").val()){
			applyBgMoney = $yt_baseElement.rmoney($(".apply-begin-money").val());
		}
		var applyEndMoney="";
		if($(".apply-end-money").val()){
			applyEndMoney =$yt_baseElement.rmoney($(".apply-end-money").val());
		}
		$('.page1').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: 'sz/applyApp/DraftsAppInfo', //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				startDate: saveBgDate,
				endDate: saveEndDate,
				queryParams: applyReason,
				formType: applyType,
				startAmount: applyBgMoney,
				endAmount : applyEndMoney,
				type:"project"
			},
			//ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				var htmlTbody = $('.plan-list-model .yt-tbody.drafts-list');
				htmlTbody.empty();
				var trStr = "";
				if(data.flag == 0) {
					var datas = data.data.rows;
					if(datas.length > 0) {
						$('.page1').show();
						$.each(datas, function(i, n) { //index
							trStr += '<tr pkId='+ n.pkId +' formType='+ n.formType +'>' +
								'<td>' + n.applicantTime + '</td>' +
								'<td style="text-align: left;">' + n.appName + '</td>' +
								'<td>' + n.formTypeName + '</td>' +
								'<td style="text-align: right;">' + $yt_baseElement.fmMoney(n.totalAmount) + '</td>' +
								'<td width: 150px;><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
								'</tr>';
						});
						htmlTbody.append(trStr);
					} else {
						$('.page1').hide();
						//拼接暂无数据效果
						htmlTbody.html(sysCommon.noDataTrStr(5));
					}
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	/**
	 * 根据申请类型执行方法
	 * @param {Object} type
	 * @param {Object} fun
	 */
	formTypeUpdata: function(type,id, fun) {
	
		switch(type) {
			case 'ADVANCE_APP':
				//事前申请 advanceId
				window.location.href = $yt_option.websit_path +'view/projectManagement-sasac/expensesReim/module/busiTripApply/serveApply.html?advanceId='+id;
				break;
			case 'LOAN_APP':
				//借款申请 loanId
				window.location.href = $yt_option.websit_path +'view/projectManagement-sasac/expensesReim/module/loanApply/loanApply.html?loanId='+id;
				break;
			case 'REIM_APP':
				//报销申请 reimId
				window.location.href = $yt_option.websit_path +'view/projectManagement-sasac/expensesReim/module/reimApply/serveFunds.html?reimId='+id;
				break;
			case 'PAYMENT_APP':
				//付款申请 payAppId
				window.location.href = $yt_option.websit_path +'view/projectManagement-sasac/expensesReim/module/payment/paymentApply.html?payAppId='+id;
				break;
			case 'EXPENDITURE_APP':
				//支出申请 appId
				window.location.href = $yt_option.websit_path +'view/projectManagement-sasac/expensesReim/module/reimApply/expenseAccount.html?appId='+id;
			break;
	 		case 'FINAL_APP':
				//决算申请 appId
			window.location.href = $yt_option.websit_path
					+ 'view/projectManagement-sasac/expensesReim/module/finalApply/finalAccount.html?appId='
					+ id;
				break;
			case 'CHANGE_APP':
				//事前申请变更 appId
			window.location.href = $yt_option.websit_path
					+ 'view/projectManagement-sasac/expensesReim/module/busiTripApply/projectServeApply.html?appId='
					+ id;
				break;
				
			default:
				break;
		}
	},
	/**
	 * 根据申请类型调用不同的删除方法
	 * @param {Object} type
	 * @param {Object} fun
	 */
	formTypeEvent: function(type,id, fun) {
		switch(type) {
			case 'ADVANCE_APP':
				//事前申请
				mal.deleteAdvanceInfoById(id);
				break;
			case 'LOAN_APP':
				//借款申请
				mal.deleteLoanInfoById(id);
				break;
			case 'REIM_APP':
				//报销申请
				mal.deleteReimInfoById(id);
				break;
			case 'PAYMENT_APP':
				//付款申请
				mal.deletePaymentInfoById(id);
				break;
			case 'EXPENDITURE_APP':
				//支出申请
				mal.deleteExpenditureInfoById(id);
			break;
			case 'FINAL_APP':
				//决算申请
			mal.deleteFinalInfoById(id);
				break;
			case 'CHANGE_APP':
				//事前申请变更
				mal.deleteAdvanceUpdateById(id);
			default:
				break;
		}
	},
	/**
	 * 1.1.4.6根据id删除事前申请信息
	 * @param {Object} id
	 */
	deleteAdvanceInfoById:function(id){
		$.ajax({
			type:"post",
			url:"sz/advanceApp/deleteAdvanceInfoById",
			async:true,
			data:{
				advanceId:id
			},
			success:function(data){
				if(data.flag == 0){
					//调用刷新列表方法
					mal.getDraftsList();
				}
				$yt_alert_Model.prompt(data.message);
			}
		});
	},
	/**
	 * 1.1.4.6根据id删除借款信息
	 * @param {Object} id
	 */
	deleteLoanInfoById:function(id){
		$.ajax({
			type:"post",
			url:"sz/loanApp/deleteLoanInfoById",
			async:true,
			data:{
				loanId:id
			},
			success:function(data){
				if(data.flag == 0){
					mal.getDraftsList();
				}
				$yt_alert_Model.prompt(data.message);
			}
		});
	},
	/**
	 * 1.1.4.6根据id删除报销信息
	 * @param {Object} id
	 */
	deleteReimInfoById:function(id){
		$.ajax({
			type:"post",
			url:"sz/reimApp/deleteReimInfoById",
			async:true,
			data:{
				reimId:id
			},
			success:function(data){
				if(data.flag == 0){
					mal.getDraftsList();
				}
				$yt_alert_Model.prompt(data.message);
			}
		});
	},
	/**
	 * 1.1.4.6根据id删除付款信息
	 * @param {Object} id
	 */
	deletePaymentInfoById:function(id){
		$.ajax({
			type:"post",
			url:"sz/payApp/deletePaymentInfoById",
			async:true,
			data:{
				paymentId:id
			},
			success:function(data){
				if(data.flag == 0){
					mal.getDraftsList();
				}
				$yt_alert_Model.prompt(data.message);
			}
		});
	},
	/**
	 * 2.1.9.13根据id删除支出申请信息
	 * @param {Object} id
	 */
	deleteExpenditureInfoById :function(id){
		$.ajax({
			type:"post",
			url:"sz/expenditureApp/deleteExpenditureInfoById",
			async:true,
			data:{
				appId:id
			},
			success:function(data){
				if(data.flag == 0){
					mal.getDraftsList();
				}
				$yt_alert_Model.prompt(data.message);
			}
		});
	},
	/**
	 * 根据id删除决算申请信息
	 * @param {Object} id
	 */
	deleteFinalInfoById : function(id) {
		$.ajax({
			type : "post",
			url : "sz/finalApp/deleteFinalInfoById",
			async : true,
			data : {
				appId : id
			},
			success : function(data) {
				if (data.flag == 0) {
					mal.getDraftsList()
				}
				$yt_alert_Model.prompt(data.message)
			}
		})
	},
	/**
	 * 1.1.11根据id删除事前申请变更申请信息
	 * @param {Object} id
	 */
	deleteAdvanceUpdateById :function(id){
		$.ajax({
			type:"post",
			url:"sz/advanceAppUpdate/deleteAdvanceUpdateById",
			async:true,
			data:{
				appId:id
			},
			success:function(data){
				if(data.flag == 0){
					mal.getDraftsList();
				}
				$yt_alert_Model.prompt(data.message);
			}
		});
	},
}
$(function() {
	mal.initDate();
})