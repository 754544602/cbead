var curriculumList = {
	//初始化方法
	init: function() {
		//加载下拉框控件
		$(".yt-select").niceSelect();
		//初始化日期控件
		$(".apply-time-start").calendar({
			controlId: "startDate",
			dateFmt:"yyyy-MM-dd HH:mm",
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $(".apply-time-end") //开始日期最大为结束日期  
		});
		$(".apply-time-end").calendar({
			controlId: "endDate",
			dateFmt:"yyyy-MM-dd HH:mm",
			nowData: false, //默认选中当前时间,默认true  
			lowerLimit: $(".apply-time-start") //结束日期最小为开始日期  
		});
		$(".start-time-start").calendar({
			controlId: "startDate",
			dateFmt:"yyyy-MM-dd",
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $(".start-time-end") //开始日期最大为结束日期  
		});
		$(".start-time-end").calendar({
			controlId: "endDate",
			dateFmt:"yyyy-MM-dd",
			nowData: false, //默认选中当前时间,默认true  
			lowerLimit: $(".start-time-start") //结束日期最小为开始日期  
		});
		$(".end-time-start").calendar({
			controlId: "startDate",
			dateFmt:"yyyy-MM-dd",
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $(".end-time-end") //开始日期最大为结束日期  
		});
		$(".end-time-end").calendar({
			controlId: "endDate",
			dateFmt:"yyyy-MM-dd",
			nowData: false, //默认选中当前时间,默认true  
			lowerLimit: $(".end-time-start") //结束日期最小为开始日期  
		});
		//高级搜索
		//更多按钮点击次数
		var clickTime=0;
		curriculumList.hideSearch(clickTime);
		//点击费用减免
		$('.cost-btn').click(function() {
			//初始化模糊查询输入框
			$('#keyword').val("");
			$('#keyword').attr("placeholder","项目编号,项目名称,项目主任");
			//显示减免列表
			$('.reduce-list').show();
			$(".list-title").text("费用减免列表")
			//隐藏发票列表
			$('.borrow-list').hide();
			//curriculumList.getPlanListInfo();
		});
		//点击发票借用
		$('.borrow-btn').click(function() {
			$('#keyword').attr("placeholder","发票开具单位名称");
			//初始化模糊查询输入框
			$('#keyword').val("");
			//显示发票列表
			$('.reduce-list').hide();
			//隐藏减免列表
			$('.borrow-list').show();
			$(".list-title").text("借用发票列表");
			//curriculumList.getBorrowListInfo();
		});
		//判断加载列表
		var first = $yt_common.GetQueryString("first");
		if(first == null) {
			$('#operate-type').val("减免");
			//显示减免列表
			$('.reduce-list').show();
			$(".list-title").text("费用减免列表");
			$('#keyword').attr("placeholder","项目编号,项目名称,项目主任");
			//隐藏发票列表
			$('.borrow-list').hide();
			curriculumList.getPlanListInfo();
		} else if(first == "cost") {
			$(".cost-btn").addClass("active").siblings().removeClass("active");
			$('#operate-type').val("减免");
			//显示发票列表
			$('.reduce-list').show();
			$('#keyword').attr("placeholder","发票开具单位名称");
			$(".list-title").text("费用减免列表");
			//隐藏减免列表
			$('.borrow-list').hide();
			curriculumList.getPlanListInfo();
		} else if(first == "borrow") {
			$(".borrow-btn").addClass("active").siblings().removeClass("active");
			$('#operate-type').val("发票");
			//隐藏减免列表
			$('.reduce-list').hide();
			//显示发票列表
			$('.borrow-list').show();
			$('#keyword').attr("placeholder","发票开具单位名称");
			$(".list-title").text("借用发票列表");
			curriculumList.getBorrowListInfo();
		};
		var operate;
		$(".tab-title-list button").click(function() {
			$(this).addClass("active").siblings().removeClass("active");
			//重置更多按钮
			clickTime=0;
			$(".search-box").hide();
			$(".search-box1").hide();
			$(".search-put").removeClass('flipy');
			operate = $(this).text();
			//curriculumList.getPlanListInfo();
			//operate为1查询免检列表，
			if(operate == "• 费用减免") {
				$('#operate-type').val("减免");
				//显示减免列表
				$('.reduce-list').show();
				$(".list-title").text("费用减免列表")
				//隐藏发票列表
				$('.borrow-list').hide();
				curriculumList.getPlanListInfo();
			};
			//operate为2查询发票列表，
			if(operate == "• 借用发票") {
				$('#operate-type').val("发票");
				//隐藏减免列表
				$('.reduce-list').hide();
				//显示发票列表
				$('.borrow-list').show();
				$(".list-title").text("借用发票列表")
				curriculumList.getBorrowListInfo();
			};

		});
		//点击删除 班级  
		$(".delete-couse-btn").on('click', function() {
			if($(".yt-table-active").length == 0) {
				$yt_alert_Model.prompt("请选择要删除的数据");
				return false;
			}
			if($(".yt-table-active").find("td.workFlawState").text() == "审批中") {
				$yt_alert_Model.prompt("该记录正在审批中，不可删除");
				return false;
			}
			operate = $('#operate-type').val();
			var path = "";
			var pkId = $('.yt-table-active .pkId').text();
			if(operate == "减免") {
				path = "finance/reduction/removeBeanById";
				curriculumList.delclassInfo(pkId, path);
				//显示减免列表
				$('.reduce-list').show();
				$(".list-title").text("费用减免列表")
				//隐藏发票列表
				$('.borrow-list').hide();
			}
			if(operate == "发票") {
				path = "finance/invoicing/removeBeanById";
				curriculumList.delclassInfo(pkId, path);
				$('.reduce-list').hide();
				//显示发票列表
				$('.borrow-list').show();
				$(".list-title").text("借用发票列表")
			}

		});
		//点击新增跳转
		$('.add-couse-btn').on('click', function() {
			operate = $('#operate-type').val();
			//判断
			if(operate == "减免") {
				window.location.href = "addCostList.html?pkId=" + "";
			} else if(operate == "发票") {
				window.location.href = "addBorrowList.html?pkId=" + "";
			}
		});
		//点击发票借用列表
		$('.borrow-list').on("click", ".invoice-org-href", function() {
			var pkId = $(this).parent().parent().find('td.pkId').text();
			var workFlawState = $(this).parent().parent().find("td.workFlawState").text();
			sessionStorage.setItem("searchParams", $('#keyword').val());
			sessionStorage.setItem("pageIndexs", $('.borrow-list .num-text.active').text());
			if(workFlawState == "草稿" || workFlawState == "未通过") {
				var num = 2;
				window.location.href = "addBorrowList.html?pkId=" + pkId;
				//window.location.href = "borrowInfoEditable.html?pkId=" + pkId;
			} else {
				var num = 1;
				window.location.href = "borrowInfo.html?pkId=" + pkId + "&" + "num=" + num;
			}

		})
		//点击费用减免列表项目名
		$('.reduce-list').on("click", ".project-code-href", function() {
			var pkId = $(this).parent().parent().find('td.pkId').text();
			var workFlawState = $(this).parent().parent().find("td.workFlawState").text();
			sessionStorage.setItem("searchParams", $('#keyword').val());
			sessionStorage.setItem("pageIndexs", $('.curriculum-page .num-text.active').text());
			if(workFlawState == "草稿" || workFlawState == "未通过") {
				window.location.href = "costInfoEditable.html?pkId=" + pkId;
			} else {
				var num = 1;
				window.location.href = "costInfo.html?pkId=" + pkId + "&" + "num=" + num;
			}

		})
		//点击修改
		$(".update-couse-btn").click(function() {
			if($(".yt-table-active").length == 0) {
				$yt_alert_Model.prompt("请选择要修改的数据");
				return false;
			}
			if($(".yt-table-active").find("td.workFlawState").text() == "审批中"||$(".yt-table-active").find("td.workFlawState").text() == "已完成") {
				$yt_alert_Model.prompt("该记录不可修改");
				return false;
			}
			operate = $('#operate-type').val();
			var pkId = $('.yt-table-active .pkId').text();
			//判断
			if(operate == "减免") {
				window.location.href = "costInfoEditable.html?pkId=" + pkId;
			} else if(operate == "发票") {
				//window.location.href = "borrowInfoEditable.html?pkId=" + pkId;
				window.location.href = "addBorrowList.html?pkId=" + pkId;
			}
		});
		//点击查询按钮
		$('.search-btn').click(function() {
			$(".search-box1 input").val('');
			$(".search-box1 #invoiceType").setSelectVal('');
			$(".search-box1 #workFlawStates").setSelectVal('');
			$(".search-box input").val('');
			$(".search-box #projectType").setSelectVal('');
			$(".search-box #workFlawState").setSelectVal('');
			var lableType = $('#operate-type').val();
			if(lableType == "减免") {
				curriculumList.getPlanListInfo();
			} else {
				curriculumList.getBorrowListInfo();
			}
		});
		
	},

	/**
	 * 减免列表
	 */
	getPlanListInfo: function() {
		sessionStorage.getItem("searchParams")?$('#keyword').val(sessionStorage.getItem("searchParams")):'';
		var keyword = $('#keyword').val();
		var projectCode=$(".search-box .project-code").val();
		var projectName=$(".search-box .project-name").val();
		var projectType=$(".search-box #projectType").val();
		var projectHead=$(".search-box .project-head").val();
		var startDateStart=$(".search-box .start-time-start").val();
		var startDateEnd=$(".search-box .start-time-end").val();
		var endDateStart=$(".search-box .end-time-start").val();
		var endDateEnd=$(".search-box .end-time-end").val();
		var createTimeStart=$(".search-box .apply-time-start").val();
		var createTimeEnd=$(".search-box .apply-time-end").val();
		var postRemissionMoneyStart=$(".search-box .expense-start").val();
		var postRemissionMoneyEnd=$(".search-box .expense-end").val();
		var workFlawState=$(".search-box #workFlawState").val();
		$('.curriculum-page').pageInfo({
			pageIndexs:sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "finance/reduction/lookForAll", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam: keyword,
				projectCode:projectCode,
				projectName:projectName,
				projectType:projectType,
				projectHead:projectHead,
				startDateStart:startDateStart,
				startDateEnd:startDateEnd,
				endDateStart:endDateStart,
				endDateEnd:endDateEnd,
				createTimeStart:createTimeStart,
				createTimeEnd:createTimeEnd,
				postRemissionMoneyStart:postRemissionMoneyStart,
				postRemissionMoneyEnd:postRemissionMoneyEnd,
				workFlawState:workFlawState
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			async:true,
			before: function() {
				//showLoading方法
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				sessionStorage.clear();
				if(data.flag == 0) {
					var htmlTbody = $('.reduce-list .yt-tbody');
					var htmlTr = '';
					var num = 1;
					var projectType ="";
					if(data.data.rows.length!= 0) {
						$(htmlTbody).empty();
						$('.curriculum-page').show();
						$.each(data.data.rows, function(i, v) {
							i = i + 1;
							if(v.projectType == 1) {
								projectType = "计划";
							};
							if(v.projectType == 2) {
								projectType = "委托";
							};

							if(v.projectType == 3) {
								projectType = "选学";
							};
							if(v.projectType == 4) {
								projectType = "中组部调训";
							};
							if(v.projectType == 5) {
								projectType = "国资委调训";
							};
							
							htmlTr = '<tr>' +
								'<td style="display:none;" class="pkId">' + v.pkId + '</td>' +
								'<td class="projectCode list-td">' + v.projectCode + '</td>' +
								'<td style="text-align:left;" class="projectName"><a style="color: #3c4687;" class="project-code-href">' + v.projectName + '</a></td>' +
								'<td class="projectType list-td">' + projectType + '</td>' +
								'<td class="projectHead list-td" style="text-align:right">' + v.projectHead + '</td>' +
								'<td class="startDate list-td">' + v.startDate + '</td>' +
								'<td class="endDate list-td">' + v.endDate + '</td>' +
								'<td class="createTimeString list-td">' + v.createTimeString + '</td>' +
								'<td class="postRemissionMoney" style="text-align:right">' + $yt_baseElement.fmMoney(v.postRemissionMoney) + '</td>' +
								'<td class="createUser list-td">' + v.createUser + '</td>' +
								'<td class="workFlawState list-td">' + v.workFlawState + '</td>' +
								'</tr>';
							htmlTbody.append($(htmlTr).data("legalData", v));
						});
					} else {
						htmlTbody.html("");
						$('.curriculum-page').hide();
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="10" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
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
	 * 发票列表
	 */
	getBorrowListInfo: function() {
		sessionStorage.getItem("searchParams")?$('#keyword').val(sessionStorage.getItem("searchParams")):'';
		var keyword = $('#keyword').val();
		var invoiceOrg=$(".search-box1 .invoice-org").val();
		var invoiceType=$(".search-box1 #invoiceType").val();
		var createTimeStart=$(".search-box1 .apply-time-start").val();
		var createTimeEnd=$(".search-box1 .apply-time-end").val();
		var applicationInvoiceStart=$(".search-box1 .expense-start").val();
		var applicationInvoiceEnd=$(".search-box1 .expense-end").val();
		var workFlawState=$(".search-box1 #workFlawStates").val();
		$('.page-info').pageInfo({
			pageIndexs: sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "finance/invoicing/lookForAll", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			async: true,
			data: {
				selectParam: keyword,
				invoiceOrg:invoiceOrg,
				invoiceType:invoiceType,
				createTimeStart:createTimeStart,
				createTimeEnd:createTimeEnd,
				applicationInvoiceStart:applicationInvoiceStart,
				applicationInvoiceEnd:applicationInvoiceEnd,
				workFlawState:workFlawState
			}, //ajax查询访问参数
			before: function() {
				$yt_baseElement.showLoading();
			},
			objName: 'data', //指获取数据的对象名称  
			async:true,
			success: function(data) {
				sessionStorage.clear();
				if(data.flag == 0) {
					var htmlTbody = $('.borrow-list .borrow-list-tod');
					var htmlTr = '';
					var num = 1;
					var invoiceType;
					if(data.data.rows.length != 0) {
						$('.page-info').show();
						$(htmlTbody).empty();
						$.each(data.data.rows, function(i, v) {
							i = i + 1;
							if(v.invoiceType == 1) {
								invoiceType = "普通发票";
							}else if(v.invoiceType == 2) {
								invoiceType = "增值税专用发票";
							}else{
								invoiceType = "";
							}
							//var createTimeString = v.createTimeString.split(" ")[0];
							htmlTr = '<tr>' +
								'<td>' + i + '</td>' +
								'<td style="display:none;" class="pkId">' + v.pkId + '</td>' +
								'<td style="text-align:left;" class="invoiceOrg"><a style="color: #3c4687;" class="invoice-org-href">' + v.invoiceOrg + '</a></td>' +
								'<td class="invoiceType">' + invoiceType + '</td>' +
								'<td class="createTimeString">' + v.createTimeString + '</td>' +
								'<td class="applicationInvoice" style="text-align:right">' + v.applicationInvoice + '</td>' +
								'<td class="createUser">' + v.createUser + '</td>' +
								'<td class="workFlawState">' + v.workFlawState + '</td>' +
								'</tr>';
							htmlTbody.append(htmlTr);
						});
					} else {
						$('.page-info').hide();
						htmlTbody.html("");
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="7" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
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
	//删除班级功能
	delclassInfo: function(pkId, path) {
		$yt_alert_Model.alertOne({
			haveCloseIcon: false, //是否带有关闭图标  
			closeIconUrl: "", //关闭图标路径  
			leftBtnName: "确定", //左侧按钮名称,默认确定  
			rightBtnName: "取消", //右侧按钮名称,默认取消  
			cancelFunction: "", //取消按钮操作方法*/  
			alertMsg: "数据删除将无法恢复，确认删除吗？", //提示信息  
			confirmFunction: function() { //点击确定按钮执行方法  
				$.ajax({
					type: "post",
					url: $yt_option.base_path + path,
					data: {
						pkId: pkId
					},
					before: function() {
						$yt_baseElement.showLoading();
					},
					success: function(data) {
						if(data.flag == 0) {
							$yt_baseElement.hideLoading();
							$('.page-info').pageInfo("refresh");
						} else {
							$yt_baseElement.hideLoading(function() {
								$yt_alert_Model.prompt("删除失败");
							});
						}

					}

				});

			}
		});

	},
	/**
	 * 高级搜索
	 */
	hideSearch:function(clickTime){
		//点击更多按钮
		$("button.senior-search-btn").click(function(e){
			var lableType = $('#operate-type').val();
			if(clickTime%2==0){
				if(lableType == "减免"){
					$(".search-box").show();
					$(".search-box1").hide();
				}else if(lableType == "发票"){
					$(".search-box").hide();
					$(".search-box1").show();
				}
				 $('#keyword').val('');
				$(".search-put").addClass('flipy');
			}else{
//				$(".search-box1 input").val('');
//				$(".search-box1 #invoiceType").setSelectVal('');
//				$(".search-box1 #workFlawStates").setSelectVal('');
//				$(".search-box input").val('');
//				$(".search-box #projectType").setSelectVal('');
//				$(".search-box #workFlawState").setSelectVal('');
				$(".search-box").hide();
				$(".search-box1").hide();
				$(".search-put").removeClass('flipy');
			}
			clickTime++;
			e.stopPropagation();
		});
		$(document).click(function(){
			clickTime=0;
			$(".search-box").hide();
			$(".search-box1").hide();
//			$(".search-box1 input").val('');
//			$(".search-box1 #invoiceType").setSelectVal('');
//			$(".search-box1 #workFlawStates").setSelectVal('');
//			$(".search-box input").val('');
//			$(".search-box #projectType").setSelectVal('');
//			$(".search-box #workFlawState").setSelectVal('');
			$(".search-put").removeClass('flipy');
		});
		//停止冒泡事件
		$(".search-box1").click(function(e){
				e.stopPropagation();
		});
		//费用减免高级搜索
		$(".search-box .yt-model-sure-btn").click(function(){
			curriculumList.getPlanListInfo();
		});
		//费用减免清空按钮
		$(".search-box .yt-model-reset-btn").click(function(){
			$(".search-box input").val('');
			$(".search-box #projectType").setSelectVal('');
			$(".search-box #workFlawState").setSelectVal('');
		});
		//借用发票高级搜索
		$(".search-box1 .yt-model-sure-btn").click(function(){
			curriculumList.getBorrowListInfo();
		});
		//借用发票清空按钮
		$(".search-box1 .yt-model-reset-btn").click(function(){
			$(".search-box1 input").val('');
			$(".search-box1 #invoiceType").setSelectVal('');
			$(".search-box1 #workFlawStates").setSelectVal('');
		});
	}

};

$(function() {
	//初始化方法
	curriculumList.init();

});