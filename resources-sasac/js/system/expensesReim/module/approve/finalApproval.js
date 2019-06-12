var expenApplApprList = {
	thisPopData:'',//弹出窗当前日期存储
	advanceId:'',//当前选中行的id
	/*数据初始化*/
	inits: function() {
//		$yt_common.user_info
		
		//给当前页面设置最小高度
		$("#expenApplApprList").css("min-height", $(window).height() - 12);
		
		//后期删除
		$(".dis").show();
		//调用事件绑定方法
		expenApplApprList.events();
		//调用tab切换
		expenApplApprList.switcher();
		//调用获取选中的Tab状态
		expenApplApprList.searchList();
		
		//保存弹窗当前日期值
		expenApplApprList.thisPopData=$("#startDate").val();
		
	},
	/*事件绑定*/
	events: function() {
		// 输入框输入文本后  显示出删除叉号
		$('.search').on('keydown', function() {
			if($('.search').val() != '' || $('.search').val() != null) {
				$('.clearImg').show();
			}
		});
		// 点击叉号 清空输入框并隐藏叉号
		$('.clearImg').on('click', function() {
			$('.search').val('');
			$(this).hide();
			//调用获取选中的Tab状态
			expenApplApprList.searchList();
		});
		// 点击重置按钮
		$("#resetBtn").off().on("click", function() {
			$('.search').val('');
			$('.clearImg').hide();
			//调用获取选中的Tab状态
			expenApplApprList.searchList();
		});
		// 点击查询按钮
		$("#searchBtn").off().on("click", function() {
			//调用获取选中的Tab状态
			expenApplApprList.searchList();
		});
		
		//单选按钮触发事件
		//$(".radio-input-list .yt-radio input").click(function() {
			//调用分页查询方法
			//proCostUsageQuery.tablePage();
			//重置筛选条件单选按钮
			//$(".radio-input-list input").parent("label").removeClass("check");
		//});
		//打印按钮点击事件
		$(".tab-header button.print-btn").on("click",function(){
			//判断是否选择表格数据
			var selTrLen = $(".tab-div .tab-content:visible tbody tr.yt-table-active").length;
			//获取当前选中行数据
			var  thisTrData = $(".tab-div .tab-content:visible tbody tr.yt-table-active").data("dataStr");
			if(selTrLen == 0){
				$yt_alert_Model.prompt("请选择一行数据进行操作");
			}else{
				var pageUrl = "";//即将跳转的页面路径
				var goPageUrl = "view/system-sasac/expensesReim/module/approval/expenApplApprList.html";//左侧菜单指定选中的页面路径
				//打印粘贴单
				if($(this).val() == "printBills"){
					pageUrl = "view/system-sasac/expensesReim/module/print/InvoicePasting.html?appId=" + thisTrData.expenditureAppId;
				}
				//打印支出凭单
				if($(this).val() == "printExpend"){
					pageUrl = "view/system-sasac/expensesReim/module/print/finalStatement.html?expenditureAppId="+thisTrData.expenditureAppId;
				}
				//打印支出凭单明细
				if($(this).val() == "printExpendDetail"){
					pageUrl = "view/system-sasac/expensesReim/module/print/expenditureVoucherDetailed.html?expenditureAppId=" + thisTrData.expenditureAppId + '&costType='+thisTrData.costType;
				}
				//调用公用的打开新页面方法传输参数不需要左侧菜单
				$yt_baseElement.openNewPage(2,pageUrl);
			}
		});
		
		// 补登票据弹窗按钮
//		$(".add-bill").off().on("click", function() {
//			var selTrLen = $(".tab-div .pending2 tbody tr.yt-table-active").length;
//			var thisTr = $(".pending2 .yt-tbody tr.yt-table-active");
//			var thisBtn=$(this);
//			expenApplApprList.advanceId = thisTr.find(".hid-advance-id").val();
//			if(selTrLen == 0){
//				$yt_alert_Model.prompt("请选择一行数据进行操作");
//			}else{
//				//调用弹出窗方法
//				expenApplApprList.showAddBillPop();
//			}
//		});
		//记录按钮
//		$(".pending2").off().on("click",".jilu-btn",function(){
//			var thisBtn=$(this);
//			var thisTr=thisBtn.parents("tr");
//			expenApplApprList.advanceId = thisTr.find(".hid-advance-id").val();
//			var thisState=thisTr.find(".actualizar-state-td").text();
//			if(thisState=='已补登'){
//				expenApplApprList.showBillRecordPop();
//			}else{
//				$yt_alert_Model.prompt("暂无补登数据");
//			}
//			
//		});
		//补票票据弹窗的删除按钮
//		$(".pop-add-bill-table").off().on("click",".del-icon",function(){
//			var thisBtn=$(this);
//			 $yt_alert_Model.alertOne({  
//	            alertMsg: "数据删除将无法恢复,确认删除吗?", //提示信息  
//	            confirmFunction: function() { //点击确定按钮执行方法  
//	            	$(".yt-edit-alert.pop-add-bill").show();
//					var thisTr=thisBtn.parents("tr");
//					thisTr.remove();
//					expenApplApprList.count();
//	            },  
//	       });     
//		});
		//金额input失去焦点出发
		$(".pop-add-bill .face-money").blur(function(){
			$(this).val($(this).val() == '' ? '' : $yt_baseElement.fmMoney($(this).val()));
		});
		//金额input获取焦点出发
		$(".pop-add-bill .face-money").focus(function(){
			$(this).val($(this).val() == '' ? '' : $yt_baseElement.rmoney($(this).val()));
		});
		//去手动预算核减页面事件绑定
		$(".to-budget-dia").click(function(){
			var selTrLen = $(".tab-div .pending2 tbody tr.yt-table-active").length;
			var thisTr = $(".pending2 .yt-tbody tr.yt-table-active");
			var advanceAppId = $('.yt-table-active').find('.hid-advance-id').val();
			var costType = $('.yt-table-active').find('.costType').val();
			var thisBtn=$(this);
//			var loanId = thisTr.find("input.tableId").val();
			if(selTrLen == 0){
				$yt_alert_Model.prompt("请选择一行数据进行操作");
			}else{
				var prjId = $(this).parent('td').parent('tr').find('.prjId').val();
				var pageUrl = "view/system-sasac/expensesReim/module/payment/budgetAuditReduce.html?advanceAppId="+ advanceAppId +"&costType=" + costType;;//即将跳转的页面路径
				//调用公用的打开新页面方法传输参数不需要左侧菜单
				$yt_baseElement.openNewPage(2,pageUrl);
			}
//			window.location.href=$yt_option.websit_path+'view/system-sasac/expensesReim/module/payment/budgetAuditReduce.html';
		});
		
		//审批处理点击事件
		$('.pending1,.pending2').on('click', '.apprv-btn', function(){
			var fun = $(this).attr('fun');
			var advanceAppId = $(this).parents('tr').find('.hid-advance-id').val();
			//获取流程节点
			var taskKey =  $(this).attr('taskKey');
			//判断流程节点状态
			if(taskKey == 'activitiStartTask'){
				//修改
				var pageUrl = "view/system-sasac/expensesReim/module/reimApply/expenseAccount.html?appId="+ advanceAppId +"&fun=" + fun;//即将跳转的页面路径
				window.location.href = $yt_option.websit_path + pageUrl;
			} else {
				//审批
				var pageUrl = "view/system-sasac/expensesReim/module/reimApply/finalExamine.html?appId="+ advanceAppId +"&fun=" + fun; //即将跳转的页面路径
				window.location.href = $yt_option.websit_path + pageUrl;
			}
			
		});
		//跳转详情页面
		$('.pending1,.pending2').on('click', '.to-detail', function(){
			var fun = $(this).attr('fun');
			var thisTr=$(this).parents("tr");
			var advanceAppId = thisTr.find('.hid-advance-id').val();
			var processInstanceId= thisTr.find(".processInstanceId").val();
			//详情页面
			var pageUrl = "view/system-sasac/expensesReim/module/reimApply/finalDetail.html?appId="+ advanceAppId;//即将跳转的页面路径
			//调用公用的打开新页面方法传输参数不需要左侧菜单
			$yt_baseElement.openNewPage(2,pageUrl);
		});
		$(".pending2 .yt-tbody").on("click",'tr',function(){
			var thisTr = $(this);
			var thisState=thisTr.find(".actualizar-state-td").text();
			if(thisState=="未补登"){
				$(".add-bill").attr("disabled",false).removeClass("yt-btn-disabled");
			}else{
				$(".add-bill").attr("disabled",true).addClass("yt-btn-disabled");
			}
		});
		//流程状态链接事件绑定
		$(".pending2").on('click','.process-state',function() {
			var processInstanceId=$(this).parents("tr").find(".processInstanceId").val();
			sysCommon.processStatePop(processInstanceId);
		});
	},
	/*Tab标签切换事件*/
	switcher: function() {
		$('.tab-li').off().on('click', function() {
			var index = $(this).index();
			$(this).addClass('active-li').siblings('.tab-li').removeClass('active-li');
			//切换tab时判断当前状态
			if(index == 1 || index == 2) {
				$('.tab-content').eq(1).css("display", 'block').addClass("check").siblings('.tab-content').hide().removeClass("check");
			} else {
				$('.tab-content').eq(index).css("display", 'block').addClass("check").siblings('.tab-content').hide().removeClass("check");
			}
			if(index == 2) {//已完成状态执行
//				$('.add-bill').show();
//				$('.to-budget-dia').show();
//				$('.bill-record').show();
				$(".tab-header .print-btn").show();
			} else {
				$(".tab-header .print-btn").hide();
//				$('.add-bill').hide();
//				$('.to-budget-dia').hide();
//				$('.bill-record').hide();
			}
			if(index==1){//已处理状态执行
				$('.node-now-state').show();
			}else{
				$('.node-now-state').hide();
			}
			if(index==0){//待处理状态执行
				$(".dis").show();
			}else{
				$(".dis").hide();
			}
			//调用获取选中的Tab状态
			expenApplApprList.searchList();
		});
	},
	/*查询列表方法*/
	searchList: function() {
		var status = $('.active-li input').val();
		if(status == 'WF_SUSPENDING_QUERY_SQL_PARAMS') { // 待处理
			expenApplApprList.getListByPage(status);
		} else if(status == 'WF_SOLVED_QUERY_SQL_PARAMS') { // 已处理
			expenApplApprList.getProcessingAndFinishList(status);
		} else if(status == 'WF_COMPLETED_QUERY_SQL_PARAMS') { // 已完结
		  expenApplApprList.getProcessingAndFinishList(status);
		} else if(status == 'WF_DRAFTS_QUERY_SQL_PARAMS') { // 草稿箱
		}
	},
	/*已处理、已完结    分页查询获取列表(根据当前状态stateCode)*/
	getProcessingAndFinishList: function(stateCode) {
		//获取关键字值
		var queryParams = $('#keywordInput').val();
		$('.page2').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: 'sz/finalApp/getUserFinalAppInfoWFListToPageByParams', //ajax访问路径  
			data: {
				queryStateParams: stateCode,
				queryParams: queryParams
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				var datas = data.data.rows;
				var htmlTbody = $('.pending2 .yt-tbody');
				htmlTbody.empty();
				var trStr = "";
				if(data.flag == 0) {
					if(datas.length > 0) {
						$('.page2').show();
						var actualizarState = '';
						$.each(datas, function(i, n) {
							if (n.actualizarState==0) {
								actualizarState='--';
							};
							if(n.actualizarState==1){
								actualizarState='未补登';
							}
							if(n.actualizarState==2){
								actualizarState='已补登';
							}
							trStr += '<tr>' +
								'<td><a class="yt-link to-detail">' + n.finalAppNum + '</a><input type="hidden" class="hid-advance-id" value="' + n.finalAppId + '"/><input type="hidden" class="processInstanceId" value="' + n.processInstanceId + '"/><input type="hidden" class="costType" value="' + n.costType + '"/></td>' +
								'<td class="tl" style="text-align:left;">' + (n.finalAppReason == "" ? "--" : n.finalAppReason) + '</td>' +
								'<td style="text-align: right;">' + (n.expenditureTotal == "" ? "--" : $yt_baseElement.fmMoney(n.expenditureTotal)) + '</td>'+
								'<td style="text-align: right;">' + (n.incomeTotal == "" ? "--" : $yt_baseElement.fmMoney(n.incomeTotal)) + '</td>';
							
								 
							if(stateCode == 'WF_COMPLETED_QUERY_SQL_PARAMS') {
								if(actualizarState != '已补登'){
									trStr += '<td><span class="actualizar-state-td">' + actualizarState + '</span></td>'
										+'<td>'+ (n.budgetSubState == 1 ? '自动核减' : '手动核减') +'</td>';
								}else{
									trStr += '<td style="position:relative;"><span class="actualizar-state-td">' + actualizarState + '</span><a class="jilu-btn" style="position:absolute;right:5px;"><img src="../../../../../resources-sasac/images/common/jilu.png" style="width: 18px;color: #fff;"/></a></td>'
									+'<td>'+ (n.budgetSubState == 1 ? '自动核减' : '手动核减') +'</td>';
								};
							}
							trStr +='<td>' + n.applicantUserName + '</td>' +  //申请人
								'<td><span>' + n.applicantDeptName + '</span></td>'; //申请部门
							if(stateCode == 'WF_COMPLETED_QUERY_SQL_PARAMS'){
								trStr +='<td>' + n.applicantTime + '</td>';
							}
							if(stateCode == 'WF_SOLVED_QUERY_SQL_PARAMS'){
								trStr +='<td style="text-align:left;"><span class="yt-link process-state">' + n.nodeNowState + '</span></td>';  //流程状态
							}
							trStr +='<td>' + (stateCode != 'WF_SUSPENDING_QUERY_SQL_PARAMS' ? '' : '<a class="yt-link apprv-btn" taskKey="' + n.taskKey + '">' + (n.taskKey == 'activitiStartTask' ? '处理' : '审批') + '</a><span class="center-line">|</span>') + '<a class="yt-link log-mod">日志</a></td></tr>';
					        trStr = $(trStr).data("dataStr",n);	
					        htmlTbody.append(trStr);
						});
						//调用跳转到审批页面方法
						//expenApplApprList.goApprovePage();
						//调用提示窗口
						sysCommon.initQtip($(".log-mod"));
						//绑定去详情页面
						//expenApplApprList.toDetails();
					} else {
						htmlTbody.html("");
						$('.page2').hide();
						//拼接暂无数据效果
						htmlTbody.append(expenApplApprList.noDataTrStr(7));
					}
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	/*待处理    分页查询获取列表(根据当前状态stateCode)*/
	getListByPage: function(stateCode) {
		//获取关键字值
		var queryParams = $('#keywordInput').val();
		$('.page1').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: 'sz/finalApp/getUserFinalAppInfoWFListToPageByParams', //ajax访问路径  
			data: {
				queryStateParams: stateCode,
				queryParams: queryParams
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				var datas = data.data.rows;
				var htmlTbody = $('.pending1 .yt-tbody');
				htmlTbody.empty();
				var trStr = "";
				if(data.flag == 0) {
					if(datas.length > 0) {
						$('.page1').show();
						$.each(datas, function(i, n) {
							trStr += '<tr>' +
								'<td><a class="yt-link to-detail">' + n.finalAppNum + '</a><input type="hidden" class="hid-advance-id" value="' + n.finalAppId + '"/><input type="hidden" class="processInstanceId" value="' + n.processInstanceId + '"/></td>' +
								'<td class="tl" style="text-align:left;">' + (n.finalAppReason == "" ? "--" : n.finalAppReason) + '</td>' +
								'<td style="text-align: right;">' + (n.expenditureTotal == "" ? "--" : $yt_baseElement.fmMoney(n.expenditureTotal)) + '</td>'+
								'<td style="text-align: right;">' + (n.incomeTotal == "" ? "--" : $yt_baseElement.fmMoney(n.incomeTotal)) + '</td>'+
								//'<td><span>' + n.advanceCostTypeName + '</span></td>' +
								'<td>' + n.applicantUserName + '</td>' +
								'<td><span>' + n.applicantDeptName + '</span></td>' +
								'<td>' + n.stagnationTime + '</td>';
							trStr += '<td>' + (stateCode != 'WF_SUSPENDING_QUERY_SQL_PARAMS' ? '' : '<a class="yt-link apprv-btn" taskKey="' + n.taskKey + '">' + (n.taskKey == 'activitiStartTask' ? '处理' : '审批') + '</a><span class="center-line">|</span>') + '<a class="yt-link log-mod">日志</a></td>' +
								'</tr>';
							trStr = $(trStr).data("dataStr",n);	
							htmlTbody.append(trStr);
						});
						//调用跳转到审批页面方法
						//expenApplApprList.goApprovePage();
						//调用提示窗口
						sysCommon.initQtip($(".log-mod"));
						//绑定去详情页面
						//expenApplApprList.toDetails();
					} else {
						htmlTbody.html("");
						$('.page1').hide();
						//拼接暂无数据效果
						htmlTbody.append(expenApplApprList.noDataTrStr(7));
					}
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	/**
	 * 拼接暂无数据内容
	 * @param {Object} trNum  行数
	 * 分页查询没有数据时提示拼接数据
	 */
	noDataTrStr: function(trNum) {
		//暂无数据内容
		var noDataStr = '<tr style="border:0px;background-color:#fff !important;"><td  colspan="' + trNum + '" align="center"style="border:0px;"><div class="no-data" style="width: 280px;margin: 0 auto;">' +
			'<img src="../../../../../resources-sasac/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
			'</div></td></tr>';
		return noDataStr;
	},
	/*计算*/
	count:function(){
		var sumNum=0;
		var sumMoney=0;
		$(".bill-num").each(function(i,n){
			sumNum += +$(n).text();
		});
		$(".bill-money").each(function(i,n){
			sumMoney += +$yt_baseElement.rmoney($(n).text());
		});
		$(".sum-td").text(sumNum);
		$(".sum-money").text($yt_baseElement.fmMoney(sumMoney));
	},
	/*补登票据弹窗*/
	showAddBillPop: function() {
		$("#startDate").val(expenApplApprList.thisPopData);
		expenApplApprList.count();
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$(".yt-edit-alert.pop-add-bill").show();
		/**
		 * 调用算取div显示位置方法 
		 */
		$yt_alert_Model.getDivPosition($(".yt-edit-alert.pop-add-bill"));
		//初始化弹窗数据
		$.ajax({
			type: "post",
			url: "sz/expenditureApp/findActualizarInfoByExpenditureAppId",
			async: true,
			data: {
				expenditureAppId:expenApplApprList.advanceId,	//支出申请表id
			},
			success: function(data) {
				if(data.flag==0){
					var datas=data.data;
					if(datas){
						var expenditureAppNum=datas.expenditureAppNum	;//支出单号
						var actualizarAmount=datas.actualizarAmount	;//（冲销）欠票金额
						$(".pop-add-bill .expenditure-app-num").text(expenditureAppNum);
						$(".pop-add-bill .actualizar-amount").text($yt_baseElement.fmMoney(actualizarAmount));
					}
				}else{
					$yt_alert_Model.prompt(data.message);
				}
			},
		});
		//加入列表按钮
		$(".pop-add-bill").off().on("click",".add-to-list",function(){
			var isTrue=$yt_valid.validForm($(".pop-add-bill")); 
			if(isTrue){
				//票据类型
				var billTypeVue=$(".pop-add-bill .radio-input-list input:checked").val();
				var billType='';
				if(billTypeVue=='INVOICE'){
					billType='发票';
				}else if(billTypeVue=='RECEIPT'){
					billType='收据';
				}else{
					billType='其他';
				}
				//票面金额
				var billMoney=$(".pop-add-bill .face-money").val();
				//备注
				var billComment=$(".pop-add-bill .comment").val();
				//添加到表格
				$(".pop-add-bill .pop-add-bill-table tbody tr").eq(-1).before('<tr class="bill-detail">'+
						'<td><input type="hidden" class="bill-type" value="'+billTypeVue+'"/>'+billType+'</td>'+
						'<td><span class="bill-num">1</span></td>'+
						'<td style="text-align: right;"><span class="bill-money">'+$yt_baseElement.fmMoney(billMoney)+'</span></td>'+
						'<td style="text-align: left;"><span class="bill-comment">'+(billComment || '--')+'</span></td>'+
						'<td><a class="del-icon"><img src="../../../../../resources-sasac/images/common/del-icon.png"></a></td>'+
						'</tr>');
				$(".pop-add-bill .radio-input-list input").eq(0).setRadioState("check");
				$(".pop-add-bill .face-money").val("");
				$(".pop-add-bill .comment").val("");
				expenApplApprList.count();
			}
		});
		/*点击确定按钮方法*/
		$('.yt-edit-alert .yt-eidt-model-bottom .yt-model-sure-btn').off().on("click", function(advanceId) {
			//获取参数
			var expenditureAppId=expenApplApprList.advanceId;
			var actualizarTime=$("#startDate").val();
			var billDetailList=$(".pop-add-bill .pop-add-bill-table .bill-detail");
			var actualizarInfoList=[];
			$(billDetailList).each(function(i,n){
				var billNum = $(n).find(".bill-num").text();//票据张数
				var billType = $(n).find(".bill-type").val();//票据类型
				var billMoney = $yt_baseElement.rmoney($(n).find(".bill-money").text());//票面金额
				var billComment = $(n).find(".bill-comment").text();//备注
				actualizarInfoList.push({"billNum":billNum,"billType":billType,"billAmount":billMoney,"remarks":billComment});
			});
			var actualizarAmount=$yt_baseElement.rmoney($(".pop-add-bill .actualizar-amount").text());
			var sumMoney=$yt_baseElement.rmoney($(".pop-add-bill .sum-money").text());
			if(actualizarAmount<=sumMoney){
				$.ajax({
					type: "post",
					url: "sz/expenditureApp/saveActualizarInfo",
					async: true,
					data: {
						expenditureAppId:expenditureAppId,	//支出申请表id
						actualizarTime:actualizarTime,	//补登日期
						actualizarInfoList:JSON.stringify(actualizarInfoList)	//补登票据集合json
					},
					success: function(data) {
						if(data.flag==0){
							$yt_alert_Model.prompt(data.message);
							$(".pop-add-bill .radio-input-list input").eq(0).setRadioState("check");
							$(".pop-add-bill .face-money").val("").removeClass("valid-hint");
							$(".pop-add-bill .comment").val("");
							$(".pop-add-bill .valid-font").text("");
							$(".pop-add-bill .pop-add-bill-table .yt-tbody").html('<tr><td>合计</td><td class="sum-td">0</td>'+
								'<td class="sum-money" style="text-align: right;">'+ $yt_baseElement.fmMoney(0) +'</td><td></td><td></td></tr>');
							//隐藏页面中自定义的表单内容
							$(".yt-edit-alert,#heard-nav-bak").hide();
							//隐藏蒙层  
							$("#pop-modle-alert").hide();
							expenApplApprList.getProcessingAndFinishList('WF_COMPLETED_QUERY_SQL_PARAMS');
						}else{
							$yt_alert_Model.prompt(data.message);
						}
					},
				});
			}else{
				$yt_alert_Model.prompt("欠票金额未完全冲销，请核对后提交");
			}
			
			
			
		});
		/** 
		 * 点击取消方法 
		 */
		$('.yt-edit-alert .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
			$(".pop-add-bill .radio-input-list input").eq(0).setRadioState("check");
			$(".pop-add-bill .face-money").val("").removeClass("valid-hint");
			$(".pop-add-bill .comment").val("");
			$(".pop-add-bill .valid-font").text("");
			$(".pop-add-bill .pop-add-bill-table .yt-tbody").html('<tr><td>合计</td><td class="sum-td">0</td>'+
								'<td class="sum-money" style="text-align: right;">'+ $yt_baseElement.fmMoney(0) +'</td><td></td><td></td></tr>');
			//隐藏页面中自定义的表单内容
			$(".yt-edit-alert,#heard-nav-bak").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
			
		});
	},
	
	/*补登票据记录弹窗*/
	showBillRecordPop: function() {
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$(".yt-edit-alert.pop-bill-record").show();
		/** 
		 * 调用算取div显示位置方法 
		 */
		$yt_alert_Model.getDivPosition($(".yt-edit-alert.pop-bill-record"));
		//初始化弹窗数据
		$.ajax({
			type: "post",
			url: "sz/expenditureApp/findActualizarInfoByExpenditureAppId",
			async: true,
			data: {
				expenditureAppId:expenApplApprList.advanceId,	//支出申请表id
			},
			success: function(data) {
				if(data.flag==0){
					var datas=data.data;
					if(datas){
						var expenditureAppId=datas.expenditureAppId	;//支出申请表id
						var expenditureAppName=datas.expenditureAppName	;//支出事由
						var expenditureAppNum=datas.expenditureAppNum	;//支出单号
						var actualizarNum=datas.actualizarNum	;//补登流水号
						var actualizarTime=datas.actualizarTime	;//补登日期
						var actualizarAmount=datas.actualizarAmount	;//（冲销）欠票金额
						var actualizarInfoList=datas.actualizarInfoList	;//补登票据集合
						$(".pop-bill-record .actualizar-num").text((actualizarNum == '' ? '--' : actualizarNum));
						$(".pop-bill-record .actualizar-time").text((actualizarTime == '' ? '--' : actualizarTime));
						var actualizarInfoHtml='';
						var billAmountTotle=0;
						var billNumTotle=0;
						$(actualizarInfoList).each(function(i,n){
							var billType='';
							if(n.billType=='INVOICE'){
								billType='发票';
							}else if(n.billType=='RECEIPT'){
								billType='收据';
							}else{
								billType='其他';
							}
							actualizarInfoHtml += '<tr>'+
								'<td>'+ billType+'</td>'+
								'<td>'+ n.billNum +'</td>'+
								'<td style="text-align: right;">'+ $yt_baseElement.fmMoney((n.billAmount == '' ? 0 : n.billAmount)) +'</td>'+
								'<td style="text-align: left;">'+ (n.remarks == '' ? '--' : n.remarks) +'</td></tr>';
								billAmountTotle += (n.billAmount == '' ? 0 : n.billAmount);
								billNumTotle += n.billNum;
						});
						actualizarInfoHtml += '<tr>'+
								'<td>合计</td>'+
								'<td>'+ billNumTotle +'</td>'+
								'<td style="text-align: right;">'+ $yt_baseElement.fmMoney(billAmountTotle) +'</td>'+
								'<td></td></tr>';
						$(".pop-bill-record .actualizar-info-table .yt-tbody").html(actualizarInfoHtml);
					}
				}else{
					$yt_alert_Model.prompt(data.message);
				}
			},
		});
		/** 
		 * 点击确定方法 
		 */
		$('.yt-edit-alert .yt-eidt-model-bottom .yt-model-sure-btn').off().on("click", function() {
			//隐藏页面中自定义的表单内容  
			$(".yt-edit-alert,#heard-nav-bak").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
	},
	
}

$(function() {
	// 调用初始化方法
	expenApplApprList.inits();
});