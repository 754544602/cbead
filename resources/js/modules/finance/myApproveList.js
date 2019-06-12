var approveList = {
	//初始化方法
	init: function() {
			//初始默认值为1显示费用减免
			$('.operate-type').val(1);
			//初始默认值为1显示待审批列表
			$('.borrow-outlay-operate-type').val(1);
			//费用减免待审批接口
			var reductioPpath = "finance/reduction/lookForAllByApproved";
			//发票借用待审批列表接口
			var invoicingPath = "finance/invoicing/lookForAllByApproved"
			var apprOrInf = $yt_common.GetQueryString("apprOrInf");
			if(apprOrInf ==21){//显示发票借用的待审批
				//发票页签
				$('.operate-type').val(2);
				//标识当前列表为发票待审批列表
				$('.borrow-outlay-operate-type').val(1);
				//隐藏费用减免页签样式
				$(".class-info-btn").removeClass("active");
				//显示发票借用页签样式
				$(".teacher-info-btn").addClass("active");
				//显示发票待审批列表
				$('.borrow-list-box').show();
				//隐藏费用减免列表
				$('.outlay-list-box').hide();
				//调用借用发票待审批列表
				var path = "finance/invoicing/lookForAllByApproved"
				approveList.getBorrowListInfo(path);
			}else if (apprOrInf ==22) {
				$('.operate-type').val(2);
				//标识当前列表为费用减免待审批列表
				$('.borrow-outlay-operate-type').val(2);
				//隐藏费用减免页签样式
				$(".class-info-btn").removeClass("active");
				//显示发票借用页签样式
				$(".teacher-info-btn").addClass("active");
				//隐藏费用减免的待审批页签样式
				$(".fist-p").removeClass("appro-btn");
				//显示发票借用审批记录页签样式
				$(".seconed-p").addClass("appro-btn");
				//显示审批记录列表
				$('.borrow-list-box').show();
				//隐藏费用减免列表
				$('.outlay-list-box').hide();
				var path = "finance/invoicing/lookForAllByHi"
				approveList.getBorrowListInfo(path);
			}else if (apprOrInf ==12){
				$('.operate-type').val(1);
				//标识当前列表为费用减免待审批列表
				$('.borrow-outlay-operate-type').val(2);
				//隐藏费用减免的待审批页签样式
				$(".fist-p").removeClass("appro-btn");
				//显示费用减免的待审批记录页签样式
				$(".seconed-p").addClass("appro-btn");
				//隐藏审批记录列表
				$('.borrow-list-box').hide();
				//显示费用减免列表
				$('.outlay-list-box').show();
				var rePath = "finance/reduction/lookForAllByHi"
				approveList.getReductionListInfo(rePath);
				
			}else{
				$(".class-info-btn").addClass("active")
				//隐藏发票借用待审批记录页签样式
				$(".teacher-info-btn").removeClass("active");
				//隐藏费用减免的待审批记录页签样式
				$(".seconed-p").removeClass("appro-btn");
				//初始页面
				
				//隐藏发票借用列表
				$('.borrow-list-box').hide();
				//显示费用减免列表
				$('.outlay-list-box').show();
				//调用查询费用减免列表方法
				approveList.getReductionListInfo(reductioPpath);
				var first = $yt_common.GetQueryString("first");
				if(first == null) {
					//初始化输入框
					$('#keyword').val("");
					$('.seconed-p').removeClass("appro-btn");
					$('.fist-p').addClass("appro-btn");
					$('.operate-type').val(1);
					//隐藏发票借用列表
					$('.borrow-list-box').hide();
					//显示费用减免列表
					$('.outlay-list-box').show();
					//调用查询费用减免列表方法
					approveList.getReductionListInfo(reductioPpath);
				} else if(first == "cost") {
					//初始化输入框
					$('#keyword').val("");
					$('.seconed-p').removeClass("appro-btn");
					$('.fist-p').addClass("appro-btn");
					$('.operate-type').val(1);
					//隐藏发票借用列表
					$('.borrow-list-box').hide();
					//显示费用减免列表
					$('.outlay-list-box').show();
					//调用查询费用减免列表方法
					approveList.getReductionListInfo(reductioPpath);
				} else if(first == "borrow") {
					//初始化输入框
					$('#keyword').val("");
					$('.seconed-p').removeClass("appro-btn");
					$('.fist-p').addClass("appro-btn");
					$('.operate-type').val(2);
					//显示发票借用列表
					$('.borrow-list-box').show();
					//显示费用减免列表
					$('.outlay-list-box').hide();
					//调用查询发票审批列表方法
					approveList.getBorrowListInfo(invoicingPath);
				};
			}
			//费用减免和发票借用页签
			$(".tab-title-list button").click(function() {
				//初始化输入框
				$('#keyword').val("");
				$(this).addClass("active").siblings().removeClass("active");
				var btnText = $(this).text();
				if(btnText == "• 费用减免") {
					$('#keyword').attr('placeholder','项目编号/项目名称/项目主任');
					//初始化输入框
					$('#keyword').val("");
					$('.seconed-p').removeClass("appro-btn");
					$('.fist-p').addClass("appro-btn");
					$('.operate-type').val(1);
					//标识当前列表为费用减免待审批列表
					$('.borrow-outlay-operate-type').val(1);
					//隐藏发票借用列表
					$('.borrow-list-box').hide();
					//显示费用减免列表
					$('.outlay-list-box').show();
					//调用查询费用减免列表方法
					approveList.getReductionListInfo(reductioPpath);
				} else {
					//初始化输入框
					$('#keyword').attr('placeholder','请输入发票开具单位名称	');
					$('#keyword').val("");
					$('.seconed-p').removeClass("appro-btn");
					$('.fist-p').addClass("appro-btn");
					$('.operate-type').val(2);
					//标识当前列表为发票待审批列表
					$('.borrow-outlay-operate-type').val(1);
					//显示发票借用列表
					$('.borrow-list-box').show();
					//显示费用减免列表
					$('.outlay-list-box').hide();
					//调用查询发票审批列表方法
					approveList.getBorrowListInfo(invoicingPath);
				}
			});
			
			var approText;
			var operateVal;
			var backType;//费用减免待审批和审批记录页,发票借用待审批和审批记录页标识
			//点击审批列表页签
			$(".appro-type p").click(function() {
				$(this).addClass("appro-btn").siblings().removeClass("appro-btn");
				//获取审批页签名
				approText = $(this).text();
				//获取主页签标识
				operateVal = $('.operate-type').val();
				if(operateVal == 1) { //费用减免
					//初始化输入框
					$('#keyword').val("");
					if(approText == "待审批") { //待审批列表
						$(".back-type").val("j1");//减免待审批页签
						//初始化输入框
						$('#keyword').val("");
						//标识当前列表为费用减免待审批列表
						$('.borrow-outlay-operate-type').val(1);
						//调用费用减免待审批列表查询
						approveList.getReductionListInfo(reductioPpath);
					} else { //审批记录
						$(".back-type").val("j2");//减免审批记录页签
						//初始化输入框
						$('#keyword').val("");
						//标识当前为费用减免待审批记录列表
						$('.borrow-outlay-operate-type').val(2);
						//调用费用减免审批记录查询列表
						var rePath = "finance/reduction/lookForAllByHi"
						approveList.getReductionListInfo(rePath);
					}
	
				} else { //发票借用
					//初始化输入框
					$('#keyword').val("");
					if(approText == "待审批") { //待审批列表
						$(".back-type").val("f1");//发票借用待审批页签
						//初始化输入框
						$('#keyword').val("");
						//标识当前列表为发票借用待审批列表
						$('.borrow-outlay-operate-type').val(1);
						//调用发票借用待审批列表
						approveList.getBorrowListInfo(invoicingPath);
					} else { //审批记录
						$(".back-type").val("f2");//发票借用待批记录页签
						//初始化输入框
						$('#keyword').val("");
						//标识当前列表为发票借用审批记录列表
						$('.borrow-outlay-operate-type').val(2);
						//调用发票借用审批记录列表
						var inPath = "finance/invoicing/lookForAllByHi"
						approveList.getBorrowListInfo(inPath);
					}
				}
			});
	
			//点击搜索
			$('.search-btn').click(function() {
				//获取主页签标识
				var operateType = $('.operate-type').val();
				//获取当前审批页签标识
				var boOperateType = $('.borrow-outlay-operate-type').val();
				if(operateType == 1) { //当前主页签为费用减免
					if(boOperateType == 1) { //当前页签为费用减免待审批页签
						//调用待审批列表
						approveList.getReductionListInfo(reductioPpath);
					} else { //当前页签为费用减免审批记录页签
						//调用审批记录列表
						var rePath = "finance/reduction/lookForAllByHi"
						approveList.getReductionListInfo(rePath);
					}
	
				} else { //当前主页签为发票借用页签
					if(boOperateType == 1) { //当前页签为发票借用待审批页签
						//调用待审批列表
						approveList.getBorrowListInfo(invoicingPath);
					} else { //当前页签为发票借用审批记录页签
						//调用审批记录列表
						var inPath = "finance/invoicing/lookForAllByHi"
						approveList.getBorrowListInfo(inPath);
					}
				}
			});
			//点击费用减免项目名
			$('.reduce-list').on('click', '.project-code-href', function() {
				var pkId = $(this).parent().parent().find('.pk-id').text();
				var boOperateType = $('.borrow-outlay-operate-type').val();
				sessionStorage.setItem("searchParams", $('#keyword').val());
				sessionStorage.setItem("pageIndexs", $('。curriculum-page .num-text.active').text());
				if(boOperateType == 1) { //待审批
					//费用减免详情不能修改，审批流程可以修改-----完
						window.location.href = "reviseOutlayApprove.html?pkId=" + pkId+"&"+"backType="+"j1";
				};
				if(boOperateType == 2) { //审批记录
					//跳转到费用减免详情页面和审批都不可更改页面-----完
					window.location.href = "costInfo.html?pkId=" + pkId + "&" + "num=" + 2+"&"+"backType="+"j2";
				}
			});
	
			//点击发票借用列表项目名
			$('.borrow-list').on('click', '.invoice-org-href', function() {
				var pkId = $(this).parent().parent().find('.pk-id').text();
				var boOperateType = $('.borrow-outlay-operate-type').val();
				sessionStorage.setItem("searchParams", $('#keyword').val());
				sessionStorage.setItem("pageIndexs", $('.invoice-page .num-text.active').text());
				if(boOperateType == 1) { //待审批
					window.location.href = "reviseborrowApprove.html?pkId=" + pkId+"&"+"backType="+"f1";
				};
				if(boOperateType == 2) { //审批记录
					//跳转到发票借用情页面和审批都不可更改页面-----完
					window.location.href = "borrowInfo.html?pkId=" + pkId + "&" + "num=" + 2+"&"+"backType="+"f2";
				}
	
			});
			//var backType = $yt_common.GetQueryString("backType");
		if(backType == "f1"){//该页面跳转之前是发票借用待审批列表页签
			//发票借用待审批列表接口
			var invoicingPath = "finance/invoicing/lookForAllByApproved"
			$('.borrow-btn').addClass("active").siblings().removeClass("active");
			//初始化输入框
			$('#keyword').val("");
			$('.seconed-p').removeClass("appro-btn");
			$('.fist-p').addClass("appro-btn");
			$('.operate-type').val(2);
			//显示发票借用列表
			$('.borrow-list-box').show();
			//显示费用减免列表
			$('.outlay-list-box').hide();
			//调用查询发票审批列表方法
			approveList.getBorrowListInfo(invoicingPath);
		}else if(backType == "f2"){//该页面跳转之前是发票借用审批记录页签
			//发票借用待审批列表接口
			var invoicingPath = "finance/invoicing/lookForAllByApproved"
			$('.borrow-btn').addClass("active").siblings().removeClass("active");
			//初始化输入框
			$('#keyword').val("");
			$('.seconed-p').removeClass("appro-btn");
			$('.fist-p').addClass("appro-btn");
			$('.operate-type').val(2);
			//显示发票借用列表
			$('.borrow-list-box').show();
			//显示费用减免列表
			$('.outlay-list-box').hide();
			//调用查询发票审批列表方法
			approveList.getBorrowListInfo(invoicingPath);
		}
	},

	//获取发票借用详情流程最后节点类型
	getBorrowInfo: function(pkId) {
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/invoicing/getBeanById",
			async: false,
			data: {
				pkId: pkId
			},
			success: function(data) {
				if(data.flag == 0) {
					//流程
					var flowLog = data.data.flowLog;
					var length = flowLog.length;
					var tastKeyType = flowLog[0].tastKey;
					var deleteReason = flowLog[0].deleteReason;
					if(length == 0) {

					} else if(tastKeyType == "activitiEndTask" && deleteReason == "completed") { //审批流程结束

						//发票借用详情和审批流程都为只可查看状态-----完
						window.location.href = "borrowInfo.html?pkId=" + pkId + "&" + "num=" + 2+"&"+"backType="+"f1";
					} else {
						//发票借用详情不能修改，审批流程可以修改-----完
						window.location.href = "reviseborrowApprove.html?pkId=" + pkId+"&"+"backType="+"f1";
					}
				}
			}
		});
	},

	//获取费用减免详情判断最后一个流程类型
	getReductionInfo: function(pkId) {
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/reduction/getBeanById",
			async: false,
			data: {
				pkId: pkId
			},
			success: function(data) {
				if(data.flag == 0) {
					//流程
					if (data.data.flowLog != "") {
						var flowLog = JSON.parse(data.data.flowLog);
						var length = flowLog.length;
						var tastKeyType = flowLog[0].tastKey;
						var deleteReason = flowLog[0].deleteReason;
						if(length == 0) {
	
						} else if(tastKeyType == "activitiEndTask" && deleteReason == "completed") { //审批流程结束
	
							//费用减免详情和审批流程都为只可查看状态-----完
							window.location.href = "costInfo.html?pkId=" + pkId + "&" + "num=" + 2+"&"+"backType="+"j1";
						} else {
							
						}
					}
				}
			}
		});
	},

	/**
	 * 减免列表
	 */
	getReductionListInfo: function(path) {
		sessionStorage.getItem("searchParams")?$('#keyword').val(sessionStorage.getItem("searchParams")):'';
		var keyword = $('#keyword').val();
		$('.curriculum-page').eq(1).pageInfo({
			async: true,
			pageIndexs: sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + path, //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam: keyword
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
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
					var projectType = "";
					if(data.data.rows.length > 0) {
						htmlTbody.empty()
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
								'<td style="display:none;" class="pk-id">' + v.pkId + '</td>' +
								'<td class="project-code list-td">' + v.projectCode + '</td>' +
								'<td style="text-align:left;" class="project-name"><a style="color: #3c4687;" class="project-code-href">' + v.projectName + '</a></td>' +
								'<td class="project-type list-td">' + projectType + '</td>' +
								'<td class="project-head list-td">' + v.projectHead + '</td>' +
								'<td class="start-date list-td">' + v.startDate + '</td>' +
								'<td class="create-time-string list-td">' + v.endDate + '</td>' +
								'<td class="create-time-string list-td">' + v.createTimeString + '</td>' +
								'<td style="text-align:right;" class="post-remission-money">' + v.postRemissionMoney + '</td>' +
								'<td class="create-user list-td">' + v.createUser + '</td>' +
								'<td class="work-flaw-state list-td">' + v.dealingWithPeople + '</td>' +
								'</tr>';
							htmlTbody.append($(htmlTr).data("legalData", v));
						});
					} else {
						htmlTbody.empty();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="10" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						htmlTbody.append(htmlTr);
						$('.page-info').hide();
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
	getBorrowListInfo: function(path) {
		sessionStorage.getItem("searchParams")?$('#keyword').val(sessionStorage.getItem("searchParams")):'';
		var keyword = $('#keyword').val();
		$('.invoice-page').pageInfo({
			async: true,
			pageIndexs: sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + path, //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam: keyword
			}, //ajax查询访问参数
			before: function() {
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				sessionStorage.clear();
				if(data.flag == 0) {
					var htmlTbody = $('.borrow-list .borrow-list-tod');
					var htmlTr = '';
					var num = 1;
					var invoiceType;
					if(data.data.rows.length > 0) {
						htmlTbody.empty()
						$.each(data.data.rows, function(i, v) {
							i = i + 1;
							if(v.invoiceType == 1) {
								invoiceType = "普通发票";
							};
							if(v.invoiceType == 2) {
								invoiceType = "增值税专用发票";
							};
							htmlTr = '<tr>' +
								'<td>' + i + '</td>' +
								'<td style="display:none;" class="pk-id">' + v.pkId + '</td>' +
								'<td style="text-align:left;" class="invoice-org"><a style="color: #3c4687;" class="invoice-org-href">' + v.invoiceOrg + '</a></td>' +
								'<td  class="invoice-type">' + invoiceType + '</td>' +
								'<td class="create-time-string">' + v.createTimeString + '</td>' +
								'<td style="text-align:right;" class="application-invoice">' + v.applicationInvoice + '</td>' +
								'<td class="create-user">' + v.createUser + '</td>' +
								'<td class="work-flaw-state">' + v.dealingWithPeople + '</td>' +
								'</tr>';
							htmlTbody.append(htmlTr);
						});
					} else {
						htmlTbody.empty();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="7" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						htmlTbody.append(htmlTr);
						$('.page-info').hide();
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
	}
};

$(function() {
	//初始化方法
	approveList.init();

});