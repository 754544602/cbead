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
		//打印借款单
		$("#printingLoanBtn").click(function(){
			//获取已完结列表中选中行数据个数
			var selTrLen = $(".tab-content tbody tr.yt-table-active").length;
			if(selTrLen == 0){
				$yt_alert_Model.prompt("请选择一行数据进行操作");
			}else{
				//获取借款单ID
				var loanId = $(".tab-content tbody tr.yt-table-active").find("input.hid-loan-id").val();
				var pageUrl = "view/system-sasac/expensesReim/module/print/printLoanApply.html?loanId=" + loanId;
				//调用公用的打开新页面方法传输参数不需要左侧菜单
				$yt_baseElement.openNewPage(2,pageUrl);
			}
			
		});
		//打印借款单明细
		$("#printingLoanBtnDetails").click(function(){
			//获取已完结列表中选中行数据个数
			var selTrLen = $(".tab-content tbody tr.yt-table-active").length;
			if(selTrLen == 0){
				$yt_alert_Model.prompt("请选择一行数据进行操作");
			}else{
				//获取借款单ID
				var loanId = $(".tab-content tbody tr.yt-table-active").find("input.hid-loan-id").val();
				var pageUrl = "view/system-sasac/expensesReim/module/print/printLoanApplyDetails.html?loanId=" + loanId;
				//调用公用的打开新页面方法传输参数不需要左侧菜单
				$yt_baseElement.openNewPage(2,pageUrl);
			}
			
		});
		/*切换复选框查询*/
		$('.screen input').change(function() {
			var stateCode = "WF_PASS_QUERY_SQL_PARAMS";
			var signState = function() {
				var states = $('.screen .check');
				if($(states).length >= 2 || $(states).length <= 0) {
					return '2';
				} else if($(states).length < 2) {
					return $(states).find('input').val();
				}
				return '';
			}
			var sta = '';
			if($(this).parent().hasClass('check')) {
				/*取消选中*/
				$(this).setCheckBoxState("uncheck");
				sta = signState();
			} else {
				/*选中*/
				$(this).setCheckBoxState("check");
				sta = signState();
			}
			beforeApproList.getProcessingAndFinishList(stateCode,sta);
		});
		/*全选 反选*/
		var check = true;
		$('.all-checked').click(function() {
			if(check) {
				$('.handle-and-end tbody').setCheckBoxState("checkAll");
				$('.handle-and-end tbody tr').addClass('yt-table-active');
			} else {
				$('.handle-and-end tbody').setCheckBoxState("unCheckAll");
				$('.handle-and-end tbody tr').removeClass('yt-table-active');
			}
			check = !check;
		});
		/*打印*/
		$('.already-printed').click(function() {
			var ids = '';
			$('.handle-and-end tbody .check').each(function(i, n) {
				ids += $(n).find('input').val() + (i < $('.handle-and-end tbody .check').length - 1 ? ',' : '');
			});
			if(ids) {
				beforeApproList.updateLoanIsPrintStateYes(ids);
				check = true;
			} else {
				$yt_alert_Model.prompt('请选择数据进行操作');
			}
		})
		/*未打印*/
		$('.non-printing').click(function() {
			var ids = '';
			$('.handle-and-end tbody .check').each(function(i, n) {
				ids += $(n).find('input').val() + (i < $('.handle-and-end tbody .check').length - 1 ? ',' : '');
			});
			if(ids) {
				beforeApproList.updateLoanIsPrintStateNo(ids);
				check = true;
			} else {
				$yt_alert_Model.prompt('请选择数据进行操作');
			}
		});
		$(".handle-and-end .yt-tbody").on('change','input[type=checkbox]',function(){
			if($(this)[0].checked){
				$(this).parents('tr').addClass('yt-table-active');
			}else{
				$(this).parents('tr').removeClass('yt-table-active');
			}
			return false;
		});
		$(".handle-and-end .yt-tbody").on('click','tr',function(){
			if($(this).hasClass('yt-table-active')){
				$(this).removeClass('yt-table-active');
				$(this).find('input[type=checkbox]').setCheckBoxState('uncheck');
			}else{
				$(this).addClass('yt-table-active');
				$(this).find('input[type=checkbox]').setCheckBoxState('check');
			}
		})
	},
	/**
	 * 打印
	 * @param {Object} ids
	 */
	updateLoanIsPrintStateYes: function(ids) {
		$.ajax({
			type: "post",
			url: "sz/loanApp/updateLoanIsPrintStateYes",
			async: false,
			data: {
				ids: ids
			},
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt(data.message);
					//刷新列表
					beforeApproList.searchList();
				} else {
					$yt_alert_Model.prompt(data.message);
				}
			}
		});
	},
	/**
	 * 未打印
	 * @param {Object} ids
	 */
	updateLoanIsPrintStateNo: function(ids) {
		$.ajax({
			type: "post",
			url: "sz/loanApp/updateLoanIsPrintStateNo",
			async: false,
			data: {
				ids: ids
			},
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt(data.message);
					//刷新列表
					beforeApproList.searchList();
				} else {
					$yt_alert_Model.prompt(data.message);
				}
			}
		});
	},
	//弹窗悬浮提示还款记录
	loanQtip:function(logQtipObj){
		logQtipObj.qtip({  
            content: {  
                text: function() {  
                    var txt = '<div style="margin-top:-5px;">点击查看还款记录</div>';
					return txt;
                }
            },  
            position: { 
                my: 'right top',
				at: 'left top',
				container: false,
				viewport: $('body'),
				adjust: {
					x: 8,
					y: 8,
					mouse: true,
					resize: true,
					method: 'flip flip'
				},
            },  
            hide: {  
				fixed: true,
            },  
            style: {  
				classes: 'showmod',
				tip: {
					corner: true,
					mimic: false,
					width: 10,  
					height: 10, 
					border: true,
					offset: 0, 
				}
            } 
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
       		//必填验证
       		var tableVerigfy = $yt_valid.validForm($('#registration'));
       		if(isTrue && tableVerigfy){
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
		        beforeApproList.getProcessingAndFinishList('WF_PASS_QUERY_SQL_PARAMS','2');
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
		 // 已完结
		beforeApproList.getProcessingAndFinishList('WF_PASS_QUERY_SQL_PARAMS','2');
	},
	
	/**
	 * 
	 * 获取已处理已完成列表数据
	 * @param {Object} stateCode
	 */
	getProcessingAndFinishList:function(stateCode,printState){
		//获取输入框的值
		var keyWord = $('.search').val();
		$('.page2').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url:"sz/loanApp/getUserLoanAppInfoBusinessListToPageByParams", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				queryStateParams:stateCode,
				queryParams:keyWord,
				printState:printState 
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				var datas = data.data.rows;
				var htmlTbody = $('.handle-and-end .yt-tbody');
				htmlTbody.empty();
				var trStr  = "";
				if(data.flag == 0){
					//判断是否是已完结
					if(stateCode == "WF_PASS_QUERY_SQL_PARAMS"){
						//已完结列表吧流程状态字段名变为状态
						$("#processState").text("欠款金额（元）");
					}else{
						$("#processState").text("当前状态");
					}
					if(datas.length > 0){
						if(stateCode == "WF_PASS_QUERY_SQL_PARAMS"){
							//显示还款按钮
							$("#retuMoneyBtn").show();
						}
						$('.page2').show();
						 $.each(datas,function(i,n) {
							trStr += '<tr>'
									+'<td><label style="position: relative;z-index: 100;" class="check-label yt-checkbox"><input type="checkbox" name="test" value="' + n.loanAppId + '"/></label>' + '</td>'
						          + '<td><a class="yt-link to-detail">'+n.loanAppNum+'</a><input type="hidden" class="hid-loan-id" value="'+n.loanAppId+'"/><input type="hidden" class="processInstanceId" value="'+n.processInstanceId+'"/></td>'
						          + '<td class="tl">'+(n.loanAppName == "" ? "" : n.loanAppName)+'</td>'
						          + '<td>'+n.applicantUserName+'</td>'
						          + '<td>'+(n.applicantUserDeptName == "" ? "" : n.applicantUserDeptName)+'</td>'
						          + '<td style="text-align: right;">'+(n.loanAmount == "" ? "" : ($yt_baseElement.fmMoney(n.loanAmount)))+'</td>'
						          + '<td>'+(n.loanTerm == "" ? "" : n.loanTerm)+'</td>'
						          + '<td>'+n.applicantTime+'</td>';
						          //判断状态类型
						          if(stateCode == "WF_PASS_QUERY_SQL_PARAMS"){
//						          	n.isSettle = (n.isSettle == "" ? 2 : n.isSettle);
//						          	trStr += '<td>'+(n.isSettle == 1 ? "已清账" : "未清账")+'<input type="hidden" class="hid-isSettle" value="'+n.isSettle+'"/></td>';
									trStr += '<td style="text-align: right;">'+$yt_baseElement.fmMoney(n.arrearsAmount)+'<img src="../../../../../resources-sasac/images/common/loanIcon.png" class="account log-loan" style="width: 18px;height: 18px;position: relative;z-index: 100;" />'+'</td>'
						          }else{
						          	trStr += '<td class="tl"><a class="yt-link process-state">'+n.nodeNowState+'</a></td>';
						          }
						          trStr +='<td class="print-state" style="color: ' + (n.isPrint == 0 ? '#333333' : '#417095') + ';">'+ (n.isPrint == 0 ? '未打印' : '已打印') + '</td>'+
						          			'<td><a class="yt-link log-mod">日志</a></td></tr>';
						});
						htmlTbody.append(trStr);
						//调用跳转到审批页面方法
						beforeApproList.goApprovePage();
						//调用提示窗口
						sysCommon.initQtip($(".log-mod"));
						//调用提示还款记录
						beforeApproList.loanQtip($(".log-loan"));
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
	
	//调用获取选中的Tab状态
	beforeApproList.searchList();
	$("#reimApproList").css("min-height",$(window).height()-12);
	
})