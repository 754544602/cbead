var project = {
	//当前日期
	thisDate: "",
	//初始化页面
	init: function() {
		//给当前页面设置最小高度
		$("#paymentRequest").css("min-height", $(window).height() - 12);
		//调用事件绑定方法
		project.events();
		/**
		 * 初始化日期控件
		 */
		$("#startDate").calendar({
			controlId: "startTime",
			upperLimit: $("#endDate"), //开始日期最大为结束日期  
			speed: 0,
			nowData: false,
			callback: function() {}
		});
		$("#endDate").calendar({
			controlId: "endTime",
			lowerLimit: $("#startDate"), //结束日期最小为开始日期  
			speed: 0,
			nowData: false,
			callback: function() {}
		});
		//调用分页查询方法
		project.tablePage();
	},
	//事件绑定
	events: function() {
		//查询按钮事件绑定
		$("#heardSearchBtn").click(function() {
			project.tablePage();
		});
		//重置按钮事件
		$("#resetBtn").click(function() {
			//重置关键字
			$(".query-text").val("");
			//重置日期
			$("#startDate").val(project.thisDate);
			$("#endDate").val(project.thisDate);
			//重置排序按钮
			$(".date-sort-btn,.money-sort-btn,.clip-sort-btn,.bank-sort-btn").removeClass("sort-btn-style");
			//调用查询方法
			project.tablePage();
		});
		/**
		 * 
		 * 点击修改按钮
		 * 
		 */
	},
	/*table分页*/
	tablePage: function() {
		//获取查询条件值
		var queryParams = $(".query-text").val();
		var startDate = $("#startDate").val();
		var endDate = $("#endDate").val();
		//分页查询列表
		$('.payment-table-page').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 5, //显示...的规律  
			url: 'budget/prjApp/getBudgetPrjAppInfoToDraftsPageByParams', //'$yt_option.websit_path+'resources-sasac/js/testJsonData/project.json'',//ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			async: false, //ajax 访问类型 默认 true 异步,false同步  
			data: {
				queryParams: queryParams,
				startTime: startDate,
				endTime: endDate,
			}, //ajax查询访问参数  
			/** 
			 * ajax回调函数  
			 * @param {Object} data 列表数据 
			 * @param {Object} pageObj 分页参数对象 
			 */
			success: function(data, pageObj) {
				var htmlTbody = $('.payment-table .yt-tbody');
				htmlTbody.empty();
				var trStr = "";
				if(data.flag == 0) {
					var datas = data.data.rows;
					if(datas.length > 0) {
						$('.payment-table-page').show();
						$.each(datas, function(i, n) {
							trStr += '<tr>' +
								'<td>' + n.applicantTime + '</td>' +
								'<td style="text-align: left;" class="text-overflow" title="' + n.prjName + '">' + n.prjName + '</td>' +
								'<td style="text-align: left;" class="text-overflow" title="' + n.prjUnitName + '">' + n.prjUnitName + '</td>' +
								'<td>' + n.prjClassifyName + '</td>' +
								'<td style="width: 150px;">' +
								'<span class="operate-update" style="margin-right: 23px;"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
								'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
								'</td>' +
								'</tr>';
							trStr = $(trStr).data("draData", n);
							htmlTbody.append(trStr);
						});
					} else {
						$('.payment-table-page').hide();
						//拼接暂无数据效果
						htmlTbody.append(sysCommon.noDataTrStr(5));
					}
				}
				//点击修改
				project.clickUpdate();
				//点击删除
				project.deleteBudgetPrjAppInfoById();
			},
			isSelPageNum: true //是否显示选择条数列表默认false,  
		});
	},
	/**
	 * 
	 * 点击修改按钮
	 * 
	 */
	clickUpdate: function() {
		$(".operate-update").off().click(function() {
			//当前修改的行的data
			var draData = $(this).parents('tr').data('draData');
			//草稿箱标识
			var draCode = "1";
			//跳转路径
			var pageUrl = 'view/system-sasac/budget/module/projectApproval/projectApplyApproval.html?budgetPrjAppId=' + draData.budgetPrjAppId + '&processInstanceId=' + draData.processInstanceId + "&draCode=" + draCode; //即将跳转的页面路径
			/**
			 * 调用显示loading方法
			 */
			parent.parent.$yt_baseElement.showLoading();
			window.location.href = $yt_option.websit_path + pageUrl;
		});
	},
	/**
	 * [预算项目立项]：列表数据-删除
	 * @param {Object} property
	 */
	deleteBudgetPrjAppInfoById: function() {
		//点击删除方法
		$('.operate-del').click(function() {
			//当前删除的行的data
			var draData = $(this).parents('tr').data('draData');
			$yt_alert_Model.alertOne({
				alertMsg: "数据删除将无法恢复,确认删除吗?", //提示信息  
				confirmFunction: function() { //点击确定按钮执行方法  
					$.ajax({
						type: "post",
						url: 'budget/prjApp/deleteBudgetPrjAppInfoById',
						async: true,
						data: {
							budgetPrjAppId: draData.budgetPrjAppId
						},
						success: function(data) {
							//提示信息
							$yt_alert_Model.prompt(data.message);
							//重新获取数值
							project.tablePage();
						}
					});
				},

			});
		});
	},
}

$(function() {
	//调用初始化页面方法
	project.init();
});