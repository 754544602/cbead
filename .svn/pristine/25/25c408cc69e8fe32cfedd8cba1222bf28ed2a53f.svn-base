var beforeApprListQuery = {
	//当前日期
	thisDate: "",
	//初始化页面
	init: function() {
		//给当前页面设置最小高度
		$("#beforeApprListQuery").css("min-height",$(window).height()-16);
		//调用事件绑定方法
		beforeApprListQuery.events();
		/**
		 * 初始化日期控件
		 */
		$("#startDate").calendar({
			controlId: "startTime",
			nowData: true, //默认选中当前时间,默认true  
			upperLimit: $("#endDate"), //开始日期最大为结束日期  
			speed: 0,
			callback: function() {}
		});
		$("#endDate").calendar({
			controlId: "endTime",
			nowData: true, //默认选中当前时间,默认true  
			lowerLimit: $("#startDate"), //结束日期最小为开始日期  
			speed: 0,
			callback: function() {}
		});
		//获取当前日
		beforeApprListQuery.thisDate = $("#endDate").val();
		$("#startDate").val(beforeApprListQuery.thisDate.substring(0, beforeApprListQuery.thisDate.length - 2) + "01");
		//调用分页查询方法
		beforeApprListQuery.tablePage();
		//调用跳转详情方法
		beforeApprListQuery.goDetails();
	},
	//事件绑定
	events: function() {
		//按照时间排序按钮
		$(".sort-btn-list").on("click", ".date-sort-btn", function() {
			var thisBtn = $(this);
			$(".sort-btn-list button").removeClass("sort-btn-style");
			thisBtn.toggleClass("sort-btn-style");
			//调用分页查询方法
//			beforeApprListQuery.tablePage();
		});
		//按照申请金额排序按钮
		$(".sort-btn-list").on("click", ".applymoney-sort-btn", function() {
			var thisBtn = $(this);
			$(".sort-btn-list button").removeClass("sort-btn-style")
			thisBtn.toggleClass("sort-btn-style");
			//调用分页查询方法
//			beforeApprListQuery.tablePage();
		});
		//按照调整额度金额排序按钮
		$(".sort-btn-list").on("click", ".adjustmoney-sort-btn", function() {
			var thisBtn = $(this);
			$(".sort-btn-list button").removeClass("sort-btn-style")
			thisBtn.toggleClass("sort-btn-style");
			//调用分页查询方法
//			beforeApprListQuery.tablePage();
		});
		//单选按钮触发事件
		$(".radio-input-list .yt-radio input").change(function() {
			//调用分页查询方法
			beforeApprListQuery.tablePage();
		});
		//排序按钮触发事件
		$(".sort-btn-list button").click(function() {
			var property =  "";
			//调用分页查询方法
			property =  $(this).val();
			beforeApprListQuery.tablePage(property);
		});
		//点击查询按钮
		$("#heardSearchBtn").click(function(){
			beforeApprListQuery.tablePage();
		});
		//重置按钮事件
		$("#resetBtn").click(function() {
			//重置关键字
			$(".query-text").val("");
			//重置日期
			$("#startDate").val(beforeApprListQuery.thisDate.substring(0, beforeApprListQuery.thisDate.length - 2) + "01");
			$("#endDate").val(beforeApprListQuery.thisDate);
			//重置排序按钮
			$(".date-sort-btn,.applymoney-sort-btn,.adjustmoney-sort-btn").removeClass("sort-btn-style");
			//重置筛选条件单选按钮
			$(".radio-input-list input").parent("label").removeClass("check");
			$(".radio-input-list .yt-radio input:checked").val('');
			//调用查询方法
			beforeApprListQuery.tablePage();
		});
	},
	/**
	 * table分页
	 * @param {Object} property
	 */
	tablePage: function(property) {
		//获取单选按钮数据
		var inputCheck = $(".radio-input-list .yt-radio input:checked").val();
		var queryStateParams = $(".radio-input-list .yt-radio input:checked").val();
		var startDate = $("#startDate").val();
		var endDate = $("#endDate").val();
		var queryParams = $(".query-text").val();
		$('.before-table-page').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 5, //显示...的规律  
			url:"sz/advanceAppUpdate/getTotalAdvanceAppQueryByParams",//ajax访问路径
			type: "post", //ajax访问方式 默认 "post"  
			async: false, //ajax 访问类型 默认 true 异步,false同步  
			data: {
					queryStateParams : queryStateParams,
					queryParams : queryParams,
					startDate : startDate,
					endDate : endDate,
					property : property,
					direction : "DESC",
					costType:"TRAIN_APPLY"
			}, //ajax查询访问参数  
			/** 
			 * ajax回调函数  
			 * @param {Object} data 列表数据 
			 * @param {Object} pageObj 分页参数对象 
			 */
			success: function(data) {
				//"costNumber": "AD2018418001", 
		        //"cause": "招待人工智能科学宣讲团教授",  
		        //"costType": "公务接待费",
		        //"money1": "1000",
		        //"money2": "1000",
		        //"money3": "1000",
		        //"count": "1", 
		        //"applicant": "魏业科",  
		        //"applyTime": "2018-4-18" 
		        var htmlTbody = $('.before-apply-table .yt-tbody');
//				htmlTbody.empty();
				var trStr  = "";
				if(data.flag == 0){
					var datas = data.data.rows;
					if(datas.length > 0){
						$('.before-table-page').show();
						$("#allAmount").text($yt_baseElement.fmMoney(data.data.allAmount));
						$.each(datas,function(i,n) {
							trStr += '<tr>'+
								'<td><a class="yt-link go-details">'+ n.appNum +'</a><input type="hidden" class="hid-advance-id" value="'+n.appId +'"></td>'+
								'<td style="text-align: left;">'+ n.appName +'</td>'+
								'<td>'+ n.costTypeName +'</td>'+
								'<td style="text-align: right;">'+ $yt_baseElement.fmMoney(n.totalAmount) +'</td>'+
								'<td>'+ n.applicantUserName +'</td>'+
								'<td>'+ n.applicantDept +'</td>'+
								'<td>'+ n.applicateTime +'</td>'+
								'</tr>';
						});
						htmlTbody.html(trStr);
					}else{
						$('.before-table-page').hide();
						//拼接暂无数据效果
						htmlTbody.html(sysCommon.noDataTrStr(9));
					}
				}
			},
			isSelPageNum: true //是否显示选择条数列表默认false,  
		});
	},
	/**
	 * 
	 * 
	 * 跳转详情方法
	 * 
	 */
	goDetails : function(){
		$(".before-apply-table").off("click").on('click','.go-details',function() {
			//阻止冒泡
			$yt_baseElement.eventStopPageaction();
			var advanceId = $(this).parents('tr').find('.hid-advance-id').val();
			/*页面跳转打开新页面*/
			var pageUrl = "view/system-sasac/expensesReim/module/beforehand/beforeApplyDetail.html?advanceId="+advanceId;//即将跳转的页面路径
			//调用公用的打开新页面方法传输参数不需要左侧菜单
			$yt_baseElement.openNewPage(2,pageUrl);
		})
	}
}

$(function() {
	//调用初始化页面方法
	beforeApprListQuery.init();
});