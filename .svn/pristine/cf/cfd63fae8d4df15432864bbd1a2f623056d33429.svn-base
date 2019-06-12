var loanApply={
	loanId:"",//全局的借款单Id
	riskExcMark:"../../../../../resources-sasac/images/common/war-red.png",//风险感叹号图片
	riskWarImg:"../../../../../resources-sasac/images/common/risk-war.png",//风险未通过图片红灯
	riskViaImg:"../../../../../resources-sasac/images/common/risk-via.png",//风险通过图片绿灯
	init:function(){
		//获取页面跳转传输的参数对象
		var requerParameter = $yt_common.GetRequest();
		//获取传输的项目ID
		loanApply.loanId = requerParameter.loanId;
		//获取当前登录用户信息
     	sysCommon.getLoginUserInfo();
		//初始化下拉列表
		$("#loanApply select").niceSelect();
		//调用初始化获取功能数据的方法
		loanApply.getInitFunDatas();
		//初始化日期控件
		$("#returnDate").calendar({  
		    speed: 0, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
		    complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
		    readonly: true, // 目标对象是否设为只读，默认：true     
		    lowerLimit:"2010/01/01", // 日期下限，默认：NaN(不限制)     
		    nowData:false,//默认选中当前时间,默认true 
		    speed:0,
		    dateFmt:"yyyy-MM-dd",  
		    callback: function() { // 点击选择日期后的回调函数  
		       $("#returnDate").parent().find(".risk-img").attr("src",loanApply.riskViaImg);
		       //清空验证提示信息
		       sysCommon.clearValidInfo($("#returnDate"));
		    }  
		});  
		//借款金额操作事件
		loanApply.loanMoneyEvent();
		//调用功能按钮操作事件方法
		loanApply.funOperationEvent(loanApply.eaa);
		//给当前页面设置最小高度
		$("#loanApply").css("min-height",$(window).height()-32);
		//金额input计算
		loanApply.events();
		//调用格式化金额方法
		loanApply.fmMonList();
		//判断借款ID是否为空
		if(loanApply.loanId !="" && loanApply.loanId !=null){
			//调用获取借款单详情方法
			loanApply.getLoanDetailById();
		};
		//调用获取当前登录人未结清账单
		loanApply.getCurrentUserIsSettleInfo();
	},
	//获取当前登录人未结清账单
	getCurrentUserIsSettleInfo:function(){
		$.ajax({
			type: "post",
			url: "sz/loanApp/getCurrentUserIsSettleInfo",
			async: false,
			data:{},
			success: function(data){
				if(data.flag == 0){
					//是否有未结清的借款单
					$("#noCloseOut").text(data.data.noCloseOut);
					//未结清借款单号
					$("#loanAppNumStr").text(data.data.loanAppNumStr || '--');
				}
			}
		});
	},
	//格式化金额方法
	fmMonList:function(){
		$(".refund-tab-inp").attr("placeholder","0.00");
		var moneyInpArray=$(".refund-tab-inp");
		for(j = 0; j < moneyInpArray.length; j++) {
   			if(moneyInpArray.eq(j).val()!=''){
				moneyInpArray.eq(j).val($yt_baseElement.fmMoney(moneyInpArray.eq(j).val()));
			}
		};
		var moneyTextArray=$(".moneyText");
		for(h = 0; h < moneyTextArray.length; h++) {
   			if(moneyTextArray.eq(h).text()!=''){
				moneyTextArray.eq(h).text($yt_baseElement.fmMoney(moneyTextArray.eq(h).text()));
			}else{
				moneyTextArray.eq(h).text($yt_baseElement.fmMoney(0));
			}
		}
	},
	/**
	 * 事件处理
	 */
	events: function() {
		var me = this;
		//金额文本框获取焦点事件 
		$('.refund-tab-inp').on('focus', function() {
			var ts = $(this);
			if(ts.val() != "") {
				//调用还原格式化的方法  
				ts.val($yt_baseElement.rmoney(ts.val()));
			}
		});
		//金额文本框失去焦点事件 
		$('.refund-tab-inp').on('blur', function() {
			var ts = $(this);
			if(ts.val() != '') {
				//调用格式化金额方法  
				ts.val($yt_baseElement.fmMoney(ts.val()));
			}
		});
		//金额文本框输入事件 
		$('.refund-tab-inp').on('keyup', function() {
			var ts = $(this);
			if(ts.val() != '') {
				//调用格式化金额方法  
				ts.val(ts.val().replace(/[^\d.]/g, ''));
			}
		});
		//调用表格行点击事件改变背景色方法
		$('.yt-table tbody').on('click', 'tr', function() {
			//当前对象
			var ts = $(this);
			//所有同级元素
			var trs = ts.siblings();
			//移除样式
			trs.removeClass('yt-table-active');
			//点击行追加样式
			ts.addClass('yt-table-active')
		});
		//页面取消按钮事件
		$("#cancelBtn").off().on('click',function(){
			window.history.back(-1);
		});
	},
	/**
	 * 
	 * 
	 * 根据借款单Id获取借款单详细信息
	 * 
	 * 
	 */
	getLoanDetailById:function(){
		$.ajax({
				type: "post",
				url:"sz/loanApp/getLoanAppInfoDetailByLoanAppId",
				async: false,
				data:{
					loanAppId:loanApply.loanId
				},
				success: function(data) {
					if(data.flag == 0){
						var  dataObj = data.data;
						if(dataObj && dataObj !="" && dataObj !=undefined){
							console.log(dataObj);
							//申请人
							$("#busiUsers").text(dataObj.applicantUserName);
							//部门
							$("#deptName").text(dataObj.applicantUserDeptName);
							//职务
							$("#jobName").text(dataObj.applicantUserPositionName == "" ? "--" : dataObj.applicantUserPositionName);
							//电话
							$("#telPhone").text(dataObj.applicantUserPhone == "" ? "--" : dataObj.applicantUserPhone);
							//给表单赋值
							$("#loanApply").setDatas(dataObj);
							//金额大写
							$("#moneyLower").text(arabiaToChinese(dataObj.loanAmount + ''));
							//借款期限
							$("#lifeOfLoan option").each(function(){
								if($(this).text() == dataObj.loanTerm){
									$(this).attr("selected",true);
								}
							});
							//初始化借款期限下拉列表
							$("#lifeOfLoan").niceSelect();
							//设置借款方式选中
							$('.pay-met input.radio-inpu[value="'+dataObj.paymentMethod+'"]').setRadioState("check");
							//判断是否有未清账账单
							if(dataObj.isSettleInfo){
								//显示未清账账单编号区域
								$("#loanAppNumStr").text(dataObj.isSettleInfo.loanAppNumStr || '--');
								$("#noCloseOut").text(dataObj.isSettleInfo.noCloseOut);
							}
						}
						/**
						 * 
						 * 调用获取审批流程数据方法
						 * 
						 */
						sysCommon.getApproveFlowData("SZ_LOAN_APP",dataObj.processInstanceId);
					}else{
						$yt_alert_Model.prompt(data.message,2000); 
					}
				}
			});
	},
	/**
	 * 
	 * 
	 * 获取初始下拉列表,弹出框表格数据
	 * 
	 */
	getInitFunDatas:function(){
		/**
		 * 
		 * 出差类型:TRAVEL_TYPE
		 * 交通工具:VEHICIE_CODE
		 * 住宿地点:HOTEL_ADDRESS
		 * 费用类型:COST_TYPE
		 * 资金性质:AMOUNT_NATURE
		 * 
		 */
		$.ajax({
			type: "post",
			url: "basicconfig/dictInfo/getDictInfoByTypeCode",
			async: false,
			data:{
				dictTypeCode:"AMOUNT_NATURE"
			},
			success: function(data) {
				if(data.flag == 0){
					var optionText = '<option value="">请选择</option>';
					if(data.data.length > 0){
						$.each(data.data, function(i,n) {
							/**
							 * 
							 * 资金性质获取数据
							 * 
							 */
							if(n.dictTypeCode == "AMOUNT_NATURE"){
								optionText = '<option value="'+n.value+'">'+n.disvalue+'</option>';
							    $("#moneyQuality").append(optionText);
								 $("#moneyQuality").niceSelect();	
								//资金性质选择事件
								$("#moneyQuality").on("change",function(){
							  	  //调用获取所属项目列表方法
								  loanApply.getProjectInfoList($("#prjKeyWord").val(),$(this).val());
								});
							}
						});
					   	$("#moneyQuality").niceSelect();	
					}
				}
			}
		});
		//调用获取审批流程数据方法
		sysCommon.getApproveFlowData("SZ_LOAN_APP");
	},
	/**
	 * 
	 * 功能按钮操作事件
	 * 
	 */
	funOperationEvent:function(){
		//取消按钮事件
		$('#approveCanelBtn').on("click",function(){
			//调用清空页面数据方法
			loanApply.clearPageData();
		});
		//提交保存按钮点击事件
		$("#approveSubBtn,#saveBtn").off().on("click",function(){
			var thisBtn = $(this);
			//禁用当前按钮
			$(this).attr('disabled',true).addClass('btn-disabled');
			var ajaxUrl = "";
			var validFlag = true;
			var fromUrl = '';
			//判断当前按钮是否包含提交类名
			console.log(thisBtn);
			if(thisBtn.hasClass("sub-btn")){
				ajaxUrl = "sz/loanApp/submitLoanAppInfo";
				//调用验证表单字段方法
				validFlag  = $yt_valid.validForm($("#loanApply"));
				//跳转路径审批页面
				fromUrl = 'view/system-sasac/expensesReim/module/approval/myApplyList.html';
			}
			//判断是否是保存按钮
			if(thisBtn.hasClass("save-btn")){
				ajaxUrl = "sz/loanApp/saveLoanAppInfoToDrafts";
				//跳转路径 草稿箱
				fromUrl = 'view/system-sasac/expensesReim/module/approval/draftsList.html';
			}
			//判断是否验证成功
			if(validFlag){
				//获取表单数据
				var formDatas = loanApply.getLoanFormData();
				//调用提交接口
				$.ajax({
					type: "post",
					url:ajaxUrl,
					async: false,
					data:formDatas,
					success: function(data) {
						$yt_alert_Model.prompt(data.message); 
						if(data.flag == 0){
					    	//操作成功跳转到借款审批列表页面
					    	$yt_common.parentAction({
								url:$yt_option.parent_action_path,//父级中转地址,固定配置项,只有统一修改处理。
								funName:'locationToMenu',//指定方法名，定位到菜单方法
								data:{
									url:fromUrl//要跳转的页面路径
								}
							});
						};
						//删除
						$(this).attr('disabled',false).removeClass('btn-disabled');
					}
				});
			}else{
				//调用滚动条显示在错误信息位置方法
				sysCommon.pageToScroll($("#loanApply .valid-font"));
				$(this).attr('disabled',false).removeClass('btn-disabled');
			}
		});
	},
	/**
	 * 
	 * 获取借款表单数据
	 * 
	 */
	getLoanFormData:function(){
		var  applicantUserCode = "";
		//判断隐藏的申请人code是否有值
		if($("#hidUserCode").val() !=""){
			applicantUserCode = $("#hidUserCode").val();
		}else{
			//否则赋值当前登录人
			applicantUserCode = $yt_common.user_info.userName;
		}
		//获取借款期限数据
		var loanTerm = $("#lifeOfLoan option:selected").text();
		loanTerm = (loanTerm == '请选择' ? '' : loanTerm);
		return {
			    loanAppId:loanApply.loanId,//借款申请表id
			    loanAppNum:$("#hidFormNum").val(),//借款单号
			    isSpecial:'',//是否属于专项
				loanAppName:$("#loanReason").val(),//借款事由
				loanAmount:$yt_baseElement.rmoney($("#loanMoney").val() || '0'),//借款金额
				paymentMethod:$(".pay-met .yt-radio.check input").val(),//付款方式
				loanTerm:loanTerm,//借款期限
				expectRepaymentTime:$("#returnDate").val(),//预计还款日期
				applicantUser:applicantUserCode,//申请人code
				parameters:"",//JSON格式字符串
				nextCode:$("#operate-flow").val(),//操作流程code
				dealingWithPeople:$("#approve-users").val(),//审批人code
				opintion:$("#operateMsg").val(),//审批意见
				processInstanceId:$("#processInstanceId").val()//流程实例ID
			}
	},
	/**
	 * 清空页面数据
	 */
	clearPageData:function(){
		//清空输入框,文本域
		$("#loanApply input:not(.radio-inpu,.hid-risk-code),#loanApply textarea").val('');
		$("#loanMoney").val('');
		$("#radio1").setRadioState("check");
		//人民币大写
		$("#moneyLower").text('--');
		//初始化下拉列表
		$("#approve-users,#operate-flow,#lifeOfLoan").each(function(i,n){
			$(this).find("option:eq(0)").attr("selected","selected");
		});
		$("#loanApply select").each(function(i,n){
			$(this).find("option:eq(0)").attr("selected","selected");
		});
		$("#loanApply select").niceSelect();
		//风险灯设置默认
		$("#loanApply .risk-img").attr("src",loanApply.riskExcMark);
	},
	/**
	 * 
	 * 借款金额操作事件
	 * 
	 */
	loanMoneyEvent:function(){
	    $("#loanMoney").on("focus",function(){
			if($(this).val()!="" && $(this).val() !=null){
				$(this).val($yt_baseElement.rmoney($(this).val()));
				$(this).select();
			}
		});
		$("#loanMoney").on("blur",function(){
			if($(this).val() !="" && $(this).val()!=null){
				var fmMoney = $yt_baseElement.fmMoney($(this).val());
				$(this).val(fmMoney);
				var lowerMoney =  arabiaToChinese($(this).val());
				$("#moneyLower").text(lowerMoney);
			}
		});
	}
}
$(function(){
	//调用初始化方法
	loanApply.init();
});
