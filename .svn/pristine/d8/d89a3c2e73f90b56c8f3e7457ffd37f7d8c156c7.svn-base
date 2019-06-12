var beforeApproList = {
	/**
	 * 
	 * 关键字输入框事件
	 * 
	 */
	init:function(){
		//初始化日期控件
		$("#paymDate").calendar({  
		    speed: 0, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
		    complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
		    readonly: true, // 目标对象是否设为只读，默认：true     
		    lowerLimit:"2010/01/01", // 日期下限，默认：NaN(不限制)     
		    nowData:false,//默认选中当前时间,默认true 
		    speed:0,
		    dateFmt:"yyyy-MM-dd",  
		    callback: function() { // 点击选择日期后的回调函数  
		        //alert("您选择的日期是：" + $("#txtDate").val());  
		       //$(".paym-date").parent().find(".risk-img").attr("src",loanApply.riskViaImg);
		       //清空验证提示信息
		       sysCommon.clearValidInfo($(".paym-date"));
		    }  
		}); 
		//金额input失去焦点格式化
		$(".money-input").blur(function(){
			if($(this).val()){
				$(this).val($yt_baseElement.fmMoney($(this).val()));
			}
		});
		//金额input获取焦点格式化
		$(".money-input").focus(function(){
			if($(this).val()){
				$(this).val($yt_baseElement.rmoney($(this).val()));
			}
		});
	},
	/**
	 * 
	 * 搜索框操作事件
	 * 
	 */
	searchInput:function(){
		// 输入框输入文本后  显示出删除叉号
		$('.search').on('keydown',function(){
			if($(this).val() != ''){
				$('.clearImg').show();
			}
		});
		// 点击叉号 清空输入框并隐藏叉号
		$('.clearImg').on('click',function(){
			$('.search').val('');
			$(this).hide();
			//调用获取选中的Tab状态
			beforeApproList.searchList();
		});
		//点击重置按钮
		$("#resetBtn").off().on("click",function(){
			$('.search').val('');
			$('.clearImg').hide();
			//调用获取选中的Tab状态
			beforeApproList.searchList();
		});
		/**
		 * 
		 * 点击关键字查询按钮
		 * 
		 */
		$("#heardSearchBtn").off().on("click",function(){
			//调用获取选中的Tab状态
			beforeApproList.searchList();
		});
		//点击还款按钮
		$("#retuMoneyBtn").click(function(){
			//获取已完结列表中选中行数据个数
			var selTrLen = $(".handle-and-end tbody tr.yt-table-active").length;
			var thisTr = $(".handle-and-end tbody tr.yt-table-active");
			if(selTrLen == 0){
				$yt_alert_Model.prompt("请选择一行数据进行操作");
			}else{
				//获取借款单ID
				var loanId = $(".handle-and-end tbody tr.yt-table-active").find("input.hid-loan-id").val();
				//调用显示还款登记弹出框方法
				beforeApproList.showPaymRegisterPop(loanId);
			}
			
		});
	},
	//点击事件绑定
	eventList:function(){
		//状态右侧图片按钮点击事件
		$('.handle-and-end').on("click","img.account",function(){
			var thisObj = $(this);
			//获取当前行
			var thisTr = thisObj.parents('tr');
			//获取借款单ID
			var loanId = thisTr.find("input.hid-loan-id").val();
			//调用显示还款记录弹出框方法
			beforeApproList.showPaymRecordPop(loanId);
		});
		//流程状态链接事件绑定
		$(".handle-and-end,.pending").on('click','.process-state',function() {
			//获取流程实例ID
			var processInstanceId=$(this).parents("tr").find(".processInstanceId").val();
			//调用公用显示流程图方法
			sysCommon.processStatePop(processInstanceId);
		});
	},
    /**
     * 显示还款记录弹窗
     * @param {Object} loanId 借款单ID
     */
	showPaymRecordPop:function(loanId){
       /** 
        * 显示编辑弹出框和显示顶部隐藏蒙层 
        */  
       $(".yt-edit-alert.paym-record-pop,#heard-nav-bak").show();  
       /*初始化数据*/
       $.ajax({
				type: "post",
				url:"sz/loanApp/getRefundDetailInfoByLoanAppId",
				async: false,
				data:{
					loanAppId:loanId
				},
				success: function(data) {
					if(data.flag == 0){
						var  dataObj = data.data;
						//loanApply.loanDataObj = dataObj;
						if(dataObj && dataObj !="" && dataObj !=undefined){
							//loanAmount	借款金额
							//refundTotalAmount	还款金额
							//inApprovalRefundAmount	处理中的还款金额
							//arrearsAmount	欠款金额
							//refundRecordList	还款记录列表list
							$("#lonMon").text($yt_baseElement.fmMoney(dataObj.loanAmount?dataObj.loanAmount:0));
							$("#paymMon").text($yt_baseElement.fmMoney(dataObj.refundTotalAmount?dataObj.refundTotalAmount:0));
							$("#debtMon").text($yt_baseElement.fmMoney(dataObj.arrearsAmount?dataObj.arrearsAmount:0));
							$("#inHandPaymMon").text($yt_baseElement.fmMoney(dataObj.inApprovalRefundAmount?dataObj.inApprovalRefundAmount:0));
							//还款记录金额列表
							$(".paymentHistory tbody").empty();
							//判断还款记录列表集合是否有值
							if(dataObj.refundRecordList && dataObj.refundRecordList.length>0){
								var trStr  = "";
								$.each(dataObj.refundRecordList, function(i,n) {
									var refundWay='';
									if(n.refundWay==1){
										refundWay="现金";
									}else if(n.refundWay==2){
										refundWay="支票";
									}else if(n.refundWay==3){
										refundWay="转账";
									}else if(n.refundWay==4){
										refundWay="报销单冲销";
									}
									trStr = $('<tr>'
								   		  + '<td>'+n.refundNum+'</td>'
								   		  + '<td style="text-align: right;padding-right: 5px;">'
								   		  + (n.refundAmount == "" ? "0.00" : ($yt_baseElement.fmMoney(n.refundAmount)))
								   		  + '</td>'
								   		  + '<td>'+n.refundTime+'</td>'
								   		  + '<td>'+ refundWay +'</td>'
								   		  + '</tr>');
								    //存储data值
								   	trStr.data("refundInfo",n);
									$(".paymentHistory tbody").append(trStr);
								});
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
		/** 
        * 调用算取div显示位置方法 
        */  
       $yt_alert_Model.getDivPosition($(".yt-edit-alert.paym-record-pop")); 
       /** 
        * 点击关闭方法 
        */  
       $('.yt-edit-alert.paym-record-pop .yt-eidt-model-bottom .close-btn').off().on("click", function() {  
           //隐藏页面中自定义的表单内容  
           $(".yt-edit-alert.paym-record-pop,#heard-nav-bak").hide();  
           //隐藏蒙层  
           $("#pop-modle-alert").hide();  
       });  
	},
	/**
	 * 
	 * 显示还款登记弹窗
	 * @param {Object} loanId 借款单Id
	 */
	showPaymRegisterPop:function(loanId){
       /** 
        * 显示编辑弹出框和显示顶部隐藏蒙层 
        */  
       $(".yt-edit-alert.paym-register-pop,#heard-nav-bak").show();  
       /*初始化弹窗*/
       $.ajax({
				type: "post",
				url:" sz/loanApp/getRefundInfoByLoanAppId",
				async: false,
				data:{
					loanAppId:loanId
				},
				success: function(data) {
					if(data.flag == 0){
						var  dataObj = data.data;
						if(dataObj && dataObj !="" && dataObj !=undefined){
							//loanAmount	借款金额
							//refundTotalAmount	还款金额
							//inApprovalRefundAmount	处理中的还款金额
							$("#debtMoney").text($yt_baseElement.fmMoney(dataObj.arrearsAmount?dataObj.arrearsAmount:0));
						}
					}else{
						$yt_alert_Model.prompt(data.message,2000); 
					}
				}
			});
		/** 
        * 调用算取div显示位置方法 
        */  
       $yt_alert_Model.getDivPosition($(".yt-edit-alert.paym-register-pop"));
       /** 
        * 点击保存方法 
        */  
       $('.yt-edit-alert.paym-register-pop .yt-eidt-model-bottom .save-btn').off().on("click", function() {  
       		//判断还款金额是否大于欠款金额
       		var isTrue = true;
       		//获取还款金额
       		var refundAmount = $yt_baseElement.rmoney($("#refundAmount").val());
       		//获取欠款金额
       		var debtMoney = $yt_baseElement.rmoney($("#debtMoney").text());
       		if(refundAmount > debtMoney){
       			isTrue=false;
       		}
       		if(isTrue){
       			//借款申请表id	 	loanAppId	
       			//还款日期	refundTime
       			//还款金额	refundAmount
       			//还款方式	refundWay
       			var loanAppId=loanId;
       			var refundTime=$("#paymDate").val();
       			var refundWay=$(".refund-way .check input").val();
       			$.ajax({
					type: "post",
					url:"sz/loanApp/saveRefund",
					async: false,
					data:{
						loanAppId:loanAppId,
						refundTime:refundTime,
						refundAmount:refundAmount,
						refundWay:refundWay,
					},
					success: function(data) {
						$yt_alert_Model.prompt(data.message); 
				 	}
				});
				//隐藏页面中自定义的表单内容  
		        $(".yt-edit-alert.paym-register-pop,#heard-nav-bak").hide();  
		        //隐藏蒙层  
		        $("#pop-modle-alert").hide(); 
		        //初始化数据
		        $(".money-input").val('');
		        $("#paymDate").val('');
		        //初始化已完结tab
		        beforeApproList.getProcessingAndFinishList('WF_COMPLETED_QUERY_SQL_PARAMS');
			}else{
				$yt_alert_Model.prompt("还款金额不能大于借款单可用余额");
			}
       });
       /** 
        * 点击取消方法 
        */  
       $('.yt-edit-alert.paym-register-pop .yt-eidt-model-bottom .yt-cancel-btn').off().on("click", function() {  
          //初始化数据
          $(".money-input").val('');
           $("#paymDate").val('');
           //隐藏页面中自定义的表单内容
           $(".yt-edit-alert.paym-register-pop,#heard-nav-bak").hide();  
           //隐藏蒙层  
           $("#pop-modle-alert").hide();  
           
       });  
	},
	/**
	 * 
	 * 查询列表方法
	 * 
	 */
	searchList: function() {
		var status = $('.active-li input').val();
		if(status == 'WF_SUSPENDING_QUERY_SQL_PARAMS') { // 待处理
			beforeApproList.getPendingList(status);
			//显示还款按钮
		    $("#retuMoneyBtn").hide();
		} else if(status == 'WF_SOLVED_QUERY_SQL_PARAMS') { // 已处理
			beforeApproList.getProcessingAndFinishList(status);
			//显示还款按钮
			$("#retuMoneyBtn").hide();
		} else if(status == 'WF_COMPLETED_QUERY_SQL_PARAMS') { // 已完结
			beforeApproList.getProcessingAndFinishList(status);
		} else if(status == 'WF_DRAFTS_QUERY_SQL_PARAMS') { // 草稿箱
		}
	},
	/**
	 * 
	 * Tab标签切换事件
	 * 
	 */
	switcher: function() {
		$('.tab-li').off().on('click', function() {
			var index = $(this).index();
			$(this).addClass('active-li').siblings('.tab-li').removeClass('active-li');
			if(index == 1 || index == 2){
				$('.tab-content').eq(1).css("display", 'block').siblings('.tab-content').hide();
			}else{
				$('.tab-content').eq(index).css("display", 'block').siblings('.tab-content').hide();
			}
			//调用获取选中的Tab状态
			beforeApproList.searchList();
		});
	},
	/**
	 * 获取待处理 列表
	 * @param {Object} stateCode 状态code值
	 */
	getPendingList: function(stateCode) {
		//获取查询数据框的值
		var keyWord = $('.search').val();
		$('.page1').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url:"sz/loanApp/getUserLoanAppInfoWFListToPageByParams", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				queryStateParams:stateCode,
				queryParams:keyWord
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				var htmlTbody = $('.pending .yt-tbody');
				htmlTbody.empty();
				var trStr  = "";
				if(data.flag == 0){
					var datas = data.data.rows;
					if(datas.length > 0){
						$('.page1').show();
						$.each(datas,function(i,n) {
							trStr += '<tr>'
						          + '<td><a class="yt-link to-detail">'+n.loanAppNum+'</a><input type="hidden" class="hid-loan-id" value="'+n.loanAppId+'"/><input type="hidden" class="processInstanceId" value="'+n.processInstanceId+'"/></td>'
						          + '<td class="tl"><div style="white-space: normal;word-break: break-all;word-wrap: break-word;">'+(n.loanAppName == "" ? "" : n.loanAppName)+'</div></td>'
						          + '<td>'+n.applicantUserName+'</td>'
						          + '<td>'+(n.applicantUserDeptName == "" ? "" : n.applicantUserDeptName)+'</td>'
						          + '<td style="text-align: right;">'+(n.loanAmount == "" ? "" : ($yt_baseElement.fmMoney(n.loanAmount)))+'</td>'
						          + '<td>'+(n.loanTerm == "" ? "" : n.loanTerm)+'</td>'
						          + '<td>'+n.stagnationTime+'</td>' //停滞时间
								//+ '<td class="tl"><a class="yt-link process-state">'+n.nodeNowState+'</a></td>'
						          + '<td>';
						          //判断当前流程,待申请人再次提交,改为处理可修改
						          if(n.taskKey == "activitiStartTask"){
						          	 trStr +='<a class="yt-link handle-btn">处理</a><span class="center-line">|</span><a class="yt-link log-mod">日志</a>';
						          }else{
						          	 trStr +='<a class="yt-link apprv-btn">审批</a><span class="center-line">|</span><a class="yt-link log-mod">日志</a>';
						          }
						          trStr +='</td></tr>';
						});
						htmlTbody.append(trStr);
						//调用跳转到审批页面方法
						beforeApproList.goApprovePage();
						//调用提示窗口
						sysCommon.initQtip($('.log-mod'));
						//绑定详情页事件
						beforeApproList.toDetails();
					}else{
						//隐藏分页
						$('.page1').hide();
						//拼接暂无数据效果
						htmlTbody.append(sysCommon.noDataTrStr(9));
					}
				}
			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	/**
	 * 
	 * 获取已处理已完成列表数据
	 * @param {Object} stateCode
	 */
	getProcessingAndFinishList:function(stateCode){
		//获取输入框的值
		var keyWord = $('.search').val();
		$('.page2').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url:"sz/loanApp/getUserLoanAppInfoWFListToPageByParams", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				queryStateParams:stateCode,
				queryParams:keyWord
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				var datas = data.data.rows;
				var htmlTbody = $('.handle-and-end .yt-tbody');
				htmlTbody.empty();
				var trStr  = "";
				if(data.flag == 0){
					//判断是否是已完结
					if(stateCode == "WF_COMPLETED_QUERY_SQL_PARAMS"){
						//已完结列表吧流程状态字段名变为状态
						$("#processState").text("欠款金额（元）");
					}else{
						$("#processState").text("当前状态");
					}
					if(datas.length > 0){
						if(stateCode == "WF_COMPLETED_QUERY_SQL_PARAMS"){
							//显示还款按钮
							$("#retuMoneyBtn").show();
						}
						$('.page2').show();
						 $.each(datas,function(i,n) {
							trStr += '<tr>'
						          + '<td><a class="yt-link to-detail">'+n.loanAppNum+'</a><input type="hidden" class="hid-loan-id" value="'+n.loanAppId+'"/><input type="hidden" class="processInstanceId" value="'+n.processInstanceId+'"/></td>'
						          + '<td class="tl">'+(n.loanAppName == "" ? "" : n.loanAppName)+'</td>'
						          + '<td>'+n.applicantUserName+'</td>'
						          + '<td>'+(n.applicantUserDeptName == "" ? "" : n.applicantUserDeptName)+'</td>'
						          + '<td style="text-align: right;">'+(n.loanAmount == "" ? "" : ($yt_baseElement.fmMoney(n.loanAmount)))+'</td>'
						          + '<td>'+(n.loanTerm == "" ? "" : n.loanTerm)+'</td>'
						          + '<td>'+n.applicantTime+'</td>';
						          //判断状态类型
						          if(stateCode == "WF_COMPLETED_QUERY_SQL_PARAMS"){
//						          	n.isSettle = (n.isSettle == "" ? 2 : n.isSettle);
//						          	trStr += '<td>'+(n.isSettle == 1 ? "已清账" : "未清账")+'<input type="hidden" class="hid-isSettle" value="'+n.isSettle+'"/></td>';
									trStr += '<td style="text-align: right;">'+$yt_baseElement.fmMoney(n.arrearsAmount)+'<img src="../../../../../resources-sasac/images/system/expensesReim/common/account.png" class="account"/>'+'</td>'
						          }else{
						          	trStr += '<td class="tl"><a class="yt-link process-state">'+n.nodeNowState+'</a></td>';
						          }
						          trStr +='<td><a class="yt-link log-mod">日志</a></td></tr>';
						});
						htmlTbody.append(trStr);
						//调用跳转到审批页面方法
						beforeApproList.goApprovePage();
						//调用提示窗口
						sysCommon.initQtip($(".log-mod"));
						//绑定跳转详情页事件
						beforeApproList.toDetails();
					}else{
						$('.page2').hide();
						//拼接暂无数据效果
						htmlTbody.append(sysCommon.noDataTrStr(8));
					}
				}
				
			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	/*点击编号  查看详情*/
	toDetails: function() {
		$('.yt-link.to-detail').off("click").on('click', function() {
			/*调用阻止冒泡方法*/
			$yt_baseElement.eventStopPageaction();
			/*获取id*/
			var processInstanceId = $(this).parents('tr').find('.processInstanceId').val();
			var loanId=$(this).parents('tr').find('.hid-loan-id').val();
			/*页面跳转打开新页面*/
			var pageUrl = "view/system-sasac/expensesReim/module/loanApply/loanApplyDetail.html?processInstanceId=" + processInstanceId+"&loanId="+loanId;//即将跳转的页面路径
			//window.open($yt_option.websit_path+"index.html?pageUrl="+encodeURIComponent(pageUrl)+'&goPageUrl='+goPageUrl);
			//调用公用的打开新页面方法传输参数不需要左侧菜单
			$yt_baseElement.openNewPage(2,pageUrl);
		})
	},
	/**
	 * 
	 * 
	 * 跳转到报销单审批页面
	 * 
	 */
	goApprovePage:function(){
		/**
		 * 
		 * 点击操作中的审批按钮
		 * 
		 */
		$(".apprv-btn").off().click(function(){
			var loanId = $(this).parents("tr").find(".hid-loan-id").val();
			var pageUrl= 'view/system-sasac/expensesReim/module/approval/loanApproval.html?loanId='+loanId;
			/**
			* 调用显示loading方法
			*/
			parent.parent.$yt_baseElement.showLoading();
			window.location.href = $yt_option.websit_path+pageUrl;
		});
		/**
		 * 
		 * 点击处理按钮
		 * 
		 */
		$(".handle-btn").off().on("click",function(){
			var loanId = $(this).parents("tr").find(".hid-loan-id").val();
			var pageUrl= 'view/system-sasac/expensesReim/module/loanApply/loanApply.html?loanId='+loanId;
			/**
			* 调用显示loading方法
			*/
			parent.parent.$yt_baseElement.showLoading();
			window.location.href = $yt_option.websit_path+pageUrl;
		});
		
	},
}
$(function() {
	//初始化方法
	beforeApproList.init();
	//还款记录图片点击事件
	beforeApproList.eventList();
	//调用关键字输入框事件
	beforeApproList.searchInput();
	// tab切换
	beforeApproList.switcher();
	//获取参数 审批页面提交定位至已处理tab页
	var state = $yt_common.GetRequest().state;
	if(state){
		$('.tab-header .tab-li').removeClass('active-li');
		$('.tab-header .tab-li').eq(1).addClass('active-li');
		$('.tab-content').eq(1).css("display", 'block').siblings('.tab-content').hide();
	}
	
	//调用获取选中的Tab状态
	beforeApproList.searchList();
	$("#reimApproList").css("min-height",$(window).height()-12);
	
})