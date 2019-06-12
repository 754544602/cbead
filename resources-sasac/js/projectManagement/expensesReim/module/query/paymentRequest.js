var paymentRequest = {
	//当前日期
	thisDate: "",
	//初始化页面
	init: function() {
		//给当前页面设置最小高度
		$("#paymentRequest").css("min-height",$(window).height()-12);
		//调用事件绑定方法
		paymentRequest.events();
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
		paymentRequest.thisDate = $("#endDate").val();
		//$("#startDate").val(paymentRequest.thisDate.substring(0, paymentRequest.thisDate.length - 2) + "01");
		//调用分页查询方法
		paymentRequest.tablePage();
	},
	//事件绑定
	events: function() {
		//按照时间排序按钮//按照支出金额排序按钮//按照公务卡支出金额排序按钮//按银行转账支出金额排序按钮
		$(".sort-btn-list").on("click", ".date-sort-btn,.money-sort-btn,.clip-sort-btn,.bank-sort-btn", function() {
			var thisBtn = $(this);
			if(!thisBtn.hasClass("sort-btn-style")){
				$(".date-sort-btn,.money-sort-btn,.clip-sort-btn,.bank-sort-btn").removeClass("sort-btn-style");
				thisBtn.addClass("sort-btn-style");
			}
			//调用查询方法
			paymentRequest.tablePage();
		});
		//导出列表数据
		$('.export-excel').on('click',function(){
			//获取查询条件值
			var queryParams = $(".query-text").val();
			queryParams = encodeURI(encodeURI(queryParams));
			var startDate = $("#startDate").val();
			var endDate = $("#endDate").val();
			//获取排序按钮状态
			var sortBtn = $(".sort-btn-style").text();
			var property = "cash";
			if(sortBtn == "按支出日期倒序排列"){
				 property = "paymentDate";
			}else if(sortBtn == "按公务卡支出金额倒序排列"){
				 property = "officialCard";
			}else if(sortBtn == "按银行转账支出金额倒序排列"){
				 property = "transfer";
			}else if(sortBtn == "按现金支出金额倒序排列"){
				 property = "cash";
			}
			var urlStr = $yt_option.base_path + 'sz/expenditureApp/exportExpenditureInfoListToPageByParams?queryParams=' + queryParams + '&startDate=' + startDate + '&endDate=' + endDate + '&property=' + property + '&direction=DESC';
			if(typeof(downloadIframe) == "undefined") {
				var iframe = document.createElement("iframe");
				downloadIframe = iframe;
				document.body.appendChild(downloadIframe);
			}
			downloadIframe.src = urlStr;
			downloadIframe.style.display = "none";
		});
		
		//查询按钮事件绑定
		$("#heardSearchBtn").click(function(){
			paymentRequest.tablePage();
		});
		//重置按钮事件
		$("#resetBtn").click(function() {
			//重置关键字
			$(".query-text").val("");
			//重置日期
			$("#startDate").val(paymentRequest.thisDate);
			$("#endDate").val(paymentRequest.thisDate);
			//重置排序按钮
			$(".date-sort-btn,.money-sort-btn,.clip-sort-btn,.bank-sort-btn").removeClass("sort-btn-style");
			//调用查询方法
			paymentRequest.tablePage();
		});
		//跳转详情页面
		$('.payment-table').on('click', '.to-detail', function(){
			var thisTr=$(this).parents("tr");
			var advanceAppId = thisTr.find('.appid-td').val();
			//详情页面
			var pageUrl = "view/system-sasac/expensesReim/module/reimApply/expenseDetail.html?appId="+ advanceAppId;//即将跳转的页面路径
			//调用公用的打开新页面方法传输参数不需要左侧菜单
			$yt_baseElement.openNewPage(2,pageUrl);
		});
	},
	/*table分页*/
	tablePage: function() {
		//获取查询条件值
		var queryParams=$(".query-text").val();
		var startDate=$("#startDate").val();
		var endDate=$("#endDate").val();
		//获取排序按钮状态
		var sortBtn=$(".sort-btn-style").text();
		var property="cash";
		if(sortBtn=="按支出日期倒序排列"){
			 property="paymentDate";
		}else if(sortBtn=="按公务卡支出金额倒序排列"){
			 property="officialCard";
		}else if(sortBtn=="按银行转账支出金额倒序排列"){
			 property="transfer";
		}else if(sortBtn=="按现金支出金额倒序排列"){
			 property="cash";
		}
		//分页查询列表
		$('.payment-table-page').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 5, //显示...的规律  
			url:'sz/expenditureApp/getExpenditureInfoListToPageByParams', //'$yt_option.websit_path+'resources-sasac/js/testJsonData/paymentRequest.json'',//ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			async: false, //ajax 访问类型 默认 true 异步,false同步  
			data: {
				queryParams:queryParams,
				startDate:startDate,
				endDate:endDate,
				property:property,
				direction:'DESC'
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
					$("#cashAmount").text($yt_baseElement.fmMoney(data.data.cashTotalAmount));//现金金额合计
					$("#businessCardAmount").text($yt_baseElement.fmMoney(data.data.officialCardTotalAmount));//公务卡金额合计
					$("#bankTransferAmount").text($yt_baseElement.fmMoney(data.data.transferTotalAmount));//银行转账金额合计
					var datas = data.data.rows;
					if(datas.length > 0) {
						$('.payment-table-page').show();
						$.each(datas, function(i, n) {
							trStr += '<tr>' +
								'<td><a class="yt-link to-detail"><input type="hidden" value="'+n.expenditureAppId+'" class="appid-td"/>' + n.expenditureAppNum + '</a></td>' +
								'<td style="text-align: right;">'+ $yt_baseElement.fmMoney(n.cash) +'</td>' +
								'<td style="text-align: right;">'+ $yt_baseElement.fmMoney(n.officialCard) +'</td>' +
								'<td style="text-align: right;">'+ $yt_baseElement.fmMoney(n.transfer) +'</td>' +
								'<td style="text-align: right;">'+ $yt_baseElement.fmMoney(n.paymentAmount) +'</td>' +
								'<td style="text-align: left;">'+ n.expenditureAppName +'</td>' +
								'<td>'+ n.applicantUserName +'</td>' +
								'<td>'+ n.paymentDate +'</td>' +
								'</tr>';
						});
						htmlTbody.append(trStr);
					} else {
						$('.payment-table-page').hide();
						//拼接暂无数据效果
						htmlTbody.append(sysCommon.noDataTrStr(8));
					}
				}

			},
			isSelPageNum: true //是否显示选择条数列表默认false,  
		});
	}
}

$(function() {
	//调用初始化页面方法
	paymentRequest.init();
});