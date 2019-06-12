var proCostUsageQuery = {
	//当前日期
	thisDate: "",
	//初始化页面
	init: function() {
		//给当前页面设置最小高度
		$("#proCostUsageQuery").css("min-height",$(window).height()-13);
		//获取页面跳转传输的参数对象
		var requerParameter = $yt_common.GetRequest();
		// 获取传输的项目ID
		var advanceAppId=requerParameter.advanceAppId;
		var appName=requerParameter.appName;
		var appNum=requerParameter.appNum;
		$(".query-text").val(appNum);
		$(".query-pid").val(advanceAppId);
		if($(".query-text").val() != '') {
			$('.clearImg').show();
		}
		
		//调用事件绑定方法
		proCostUsageQuery.events();
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
		proCostUsageQuery.thisDate = $("#endDate").val();
		$("#startDate").val(proCostUsageQuery.thisDate.substring(0, proCostUsageQuery.thisDate.length - 5) + "01-01");
		//调用分页查询方法
		proCostUsageQuery.tablePage();
		proCostUsageQuery.verifyTable();
		proCostUsageQuery.popTablePage();
	},
	//验证表格字段
	verifyTable: function() {
		var leTdList = $(".le-td");
		var gtTdList = $(".gt-td");

		leTdList.each(function(index) {
			if($yt_baseElement.rmoney(leTdList.eq(index).text()) > 0) {
				leTdList.eq(index).addClass("red-color");
			} else {
				leTdList.eq(index).removeClass("red-color");
			}
		});
		gtTdList.each(function(index) {
			if(gtTdList.eq(index).text().substring(0, gtTdList.eq(index).text().length - 1) / 100 > 1) {
				gtTdList.eq(index).addClass("red-color");
			} else {
				gtTdList.eq(index).removeClass("red-color");
			}
		});
	},
	//事件绑定
	events: function() {
		
		// 点击叉号 清空输入框并隐藏叉号
		$('.clearImg').on('click', function() {
			$('.query-text').val('');
			$(".query-pid").val('');
			$(this).hide();
			//调用分页查询方法
			proCostUsageQuery.tablePage();
			//调用获取选中的Tab状态
//			beforeApproList.searchList();
		});
		//重置按钮事件
		$("#resetBtn").click(function() {
			//重置项目名称
			$(".query-text").val('');
			$(".query-pid").val('');
			//重置日期
			$("#startDate").val(proCostUsageQuery.thisDate.substring(0, proCostUsageQuery.thisDate.length - 5) + "01-01");
			$("#endDate").val(proCostUsageQuery.thisDate);
			//重置筛选条件单选按钮
			$(".radio-input-list input").parent("label").removeClass("check");
			$(".radio-input-list .yt-radio input:checked").val('');
			$('.clearImg').hide();
			//调用分页查询方法
			proCostUsageQuery.tablePage();
		});
		//查询按钮事件
		$("#heardSearchBtn").click(function() {
			//调用查询方法
			proCostUsageQuery.tablePage();
		});
		//单选按钮触发事件
		$(".radio-input-list .yt-radio").change(function() {
			//调用分页查询方法
			proCostUsageQuery.tablePage();
		});
		//项目名称绑定弹出窗事件		query-text
		$('.query-text').click(function() {
			//调用弹出窗方法
			proCostUsageQuery.showAlert();
		});
		//弹窗查询按钮事件
		$(".yt-edit-alert").on("click",".pop-search",function() {
			//调用查询方法
			proCostUsageQuery.popTablePage();
		});
		//弹窗重置按钮事件
		$(".yt-edit-alert").on("click",".pop-reset",function() {
			//重置关键字
			$(".pop-text").val("");
			//调用查询方法
			proCostUsageQuery.popTablePage();
		});
		//弹窗确定按钮事件
		$(".pop-sure-btn").click(function() {
			var selTrLen = $(".pro-pop-table tbody tr.yt-table-active").length;
			var thisTr = $(".pro-pop-table tbody tr.yt-table-active");
			var thisBtn=$(this);
			var Id = thisTr.find("input.tableId").val();
			if(selTrLen == 0){
				$yt_alert_Model.prompt("请选择一行数据进行操作");
			}else{
				$(".query-text").val(thisTr.find("td").eq(0).text());
				var pid = thisTr.attr("pid");
				$(".query-pid").val(pid);
				// 输入框输入文本后  显示出删除叉号
				if($(".query-text").val() != '') {
					$('.clearImg').show();
				}
				//隐藏页面中自定义的表单内容  
				$(".yt-edit-alert,#heard-nav-bak").hide();
				//隐藏蒙层  
				$("#pop-modle-alert").hide();
				//调用分页查询方法
				proCostUsageQuery.tablePage();
			}
		});
		//导出列表数据
		$('.export-excel').on('click',function(){
			//事前申请单
			var pid=$(".query-pid").val();
			//获取单选按钮数据
			var inputCheck = $(".radio-input-list input:checked").val() || '';
			//获取查询数据
			var startDate = $("#startDate").val();
			var endDate = $("#endDate").val();
			var advanceAppNum = $('.query-text').val();
			var urlStr = $yt_option.base_path + 'sz/advanceAppUpdate/exportTotalProjectAdvanceAppQueryByParams?projectId=' + pid + '&startDate=' + startDate + '&endDate=' + endDate + '&differentAmount=' + inputCheck + '&advanceAppNum=' + advanceAppNum;
			if(typeof(downloadIframe) == "undefined") {
				var iframe = document.createElement("iframe");
				downloadIframe = iframe;
				document.body.appendChild(downloadIframe);
			}
			downloadIframe.src = urlStr;
			downloadIframe.style.display = "none";
		});
		//点击关闭按钮
		$(".button-box .yt-cancel-btn").click(function(){
	        if(window.top == window.self){//不存在父页面
  				window.close();
			 }else{
			 	parent.closeWindow();
			}
		});
	},
	/*table分页*/
	tablePage: function() {
		var pid=$(".query-pid").val();
		//获取单选按钮数据
		var inputCheck = $(".radio-input-list input:checked").val();
		//获取查询数据
		var startDate = $("#startDate").val();
		var endDate = $("#endDate").val();
		$.ajax({
			type: "post",
			url: "sz/advanceAppUpdate/getTotalProjectAdvanceAppQueryByParams",
			async: true,
			data: {
				projectId:pid,//项目id
				startDate:startDate,	//支出日期 开始
				endDate:endDate,	//支出日期 结束
				differentAmount:inputCheck,//筛选条件
			},
			success: function(data) {
				var htmlTbody = $('.pro-cost-table .yt-tbody.tbody-content').empty();
				htmlTbody.empty();
				var trStr = "";
//				var htmlTbodyTop = $('.pro-cost-table-top .yt-tbody');
//				htmlTbodyTop.empty();
				var trStrTop = "";
				if(data.flag == 0) {
					var advanceAmount = 0;
					var datas = data.data.rows;
					if(data.data.amountParams){
						var rowsLength = data.data.rows.length-1;
						$("#advanceAllAmount").text($yt_baseElement.fmMoney(data.data.amountParams.advanceAllAmount + data.data.rows[rowsLength].advanceAmount));//事前申请金额合计
						$("#expendAllAmount").text($yt_baseElement.fmMoney(data.data.amountParams.expendAllAmount + data.data.rows[rowsLength].expendAmount));//支出金额(元)合计
						$("#differentAllAmount").text($yt_baseElement.fmMoney(data.data.amountParams.differentAllAmount + data.data.rows[rowsLength].differentAmount));//差异金额(元)合计
						$("#advanceScaleAllAmount").text((data.data.amountParams.advanceScaleAllAmount * 100)+'%');//执行事前申请比例合计
					}else{
						$(".amount-params").hide();//隐藏合计行
					}
					if(data.data.finalInfo != null) {
						var costType = '';
						var costTypeColspan = 1;
						$.each(data.data.finalInfo, function(i, n) {
							trStrTop = '<tr>';
							if(costType!=n.costType){
								var costTypeVal;
								costType = n.costType;
								costType == '1'?costTypeVal='教学相关费用':costTypeVal='后勤相关费用';
								$('.costType:last-child').attr('colspan',costTypeColspan);
								trStrTop += '<td class="costType">'+costTypeVal+'</td>'+;
							}
							$.each(n.projectExpendList, function(index,item) {
								if(index==0){
									trStrTop += '<td colspan="'+n.projectExpendList.length+'">'+n.costName+'</td>'+
									'<td>'+item.costNameExpend+'</td>'+
									'<td colspan="'+n.projectExpendList.length+'">'+n.advanceAmount+'</td>'+
									'<td>'+item.expendAmount+'</td>'+
									'<td colspan="'+n.projectExpendList.length+'">'+n.differentAmount+'</td>'+
									'<td colspan="'+n.projectExpendList.length+'">'+n.advanceScale+'</td>';
								}else{
									trStrTop += '<td>'+item.costNameExpend+'</td>'+
									'<td>'+item.expendAmount+'</td>'+
								}
								trStrTop+='</tr>'
								htmlTbodyTop.append(trStrTop);
							});
						});

//						proCostUsageQuery.verifyTable();
//						$("#advanceAllAmount").text($yt_baseElement.fmMoney(advanceAmount));
					}
					var costType = '';
					var rowSpan = 0;
					if(datas.length > 0) {
						$(".amount-params").show();//隐藏合计
						$('.payment-table-page').show();
						$.each(datas, function(i, n) {
							$.each(n.projectExpendList, function(x,y) {
								trStr = '<tr>';
								if(n.costType!=costType){
									if(n.costType==1){
										n.costTypeName = '教学相关费用'
									}else if(n.costType==2){
										n.costTypeName = '后勤保障相关费用'
									}
									$('.costTypeName:last-child').attr('rowspan',rowSpan);
									trStr+='<td class="costTypeName">'+n.costTypeName+'</td>';
									costType = n.costType;
									rowSpan=0;
								}
								if(i==datas.length-1){
									$('.costTypeName:last-child').attr('rowspan',rowSpan);
								}
								rowSpan +=1;
								if(y==0){
									trStr+='<td rowspan="'n.projectExpendList.length'">'+n.costName+'</td>'+
											'<td>'+y.costNameExpend+'</td>'+
											'<td rowspan="'n.projectExpendList.length'">'+$yt_baseElement.fmMoney(n.advanceAmount)+'</td>'+
											'<td>'+$yt_baseElement.fmMoney(y.expendAmount)+'</td>'+
											'<td rowspan="'n.projectExpendList.length'">'+$yt_baseElement.fmMoney(n.differentAmount)+'</td>'+
											'<td rowspan="'n.projectExpendList.length'">'+ (n.advanceScale * 100).toFixed(2) +'%</td>'+
											'</tr>'
								}else{
									trStr+='<td>'+y.costNameExpend+'</td>'+
											'<td>'+$yt_baseElement.fmMoney(y.expendAmount)+'</td>'+
											'</tr>'
								}
								htmlTbody.append(trStr);
							});
								advanceAmount += n.advanceAmount;
						});
						proCostUsageQuery.verifyTable();
						$("#advanceAllAmount").text($yt_baseElement.fmMoney(advanceAmount));
					} else {
						$(".amount-params").hide();//隐藏合计
						$('.payment-table-page').hide();
						//拼接暂无数据效果
						htmlTbody.html(proCostUsageQuery.noDataTrStr(5));
					}
				}
			}
		});
		
	},
	/*弹出窗table分页方法*/
	popTablePage: function() {
		var queryParams=$(".pop-text").val();
		$('.prior-page').pageInfo({
			pageIndex: 1,
			pageNum: 5, //每页显示条数  
			pageSize: 5, //显示...的规律  
			url: 'sz/advanceApp/getAdvanceProjectByParams', //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			async: false, //ajax 访问类型 默认 true 异步,false同步  
			data: {
				queryParams: queryParams,
			}, //ajax查询访问参数
			/** 
			 * ajax回调函数  
			 * @param {Object} data 列表数据 
			 * @param {Object} pageObj 分页参数对象 
			 */
			success: function(data) {
				var htmlTbody = $('.pro-pop-table .yt-tbody');
				htmlTbody.empty();
				var trStr = "";
				if(data.flag == 0) {
					var datas = data.data.rows;
					if(datas.length > 0) {
						$('.prior-page').show();
						$.each(datas, function(i, n) {
							trStr += '<tr pid="' + n.advanceAppId + '" code="' + n.advanceAppNum + '">' +
									'<td>' + n.advanceAppNum + '<input type="hidden" class="balance" value="' + n.advanceAppBalance + '" /></td>' +
									'<td>' + n.applicantUserName + '</td>' +
									'<td>' + n.applicantUserDeptName + '</td>' +
									'<td style="text-align:left;">' + n.advanceAppName + '</td>' +
									'<td>' + n.advanceCostTypeName + '</td>' +
									'<td>' + n.applicantTime + '</td>' +
									'</tr>';
						});
						htmlTbody.html(trStr);
					} else {
						//拼接暂无数据效果
						htmlTbody.html('<tr style="border:0px;background-color:#fff !important;"><td  colspan="6" align="center"style="border:0px;"><div class="no-data" style="width: 280px;margin: 0 auto;padding:10px">' +
							'<img src="../../../../../resources-sasac/images/common/no-data.png" alt="" style="width: 180px;padding: 10px 0 20px;">' +
							'</div></td></tr>');
						$('.prior-page').hide();
					}
				}else{
					//拼接暂无数据效果
					htmlTbody.html('<tr style="border:0px;background-color:#fff !important;"><td  colspan="6" align="center"style="border:0px;"><div class="no-data" style="width: 280px;margin: 0 auto;padding:10px">' +
						'<img src="../../../../../resources-sasac/images/common/no-data.png" alt="" style="width: 180px;padding: 10px 0 20px;">' +
						'</div></td></tr>');
					$('.prior-page').hide();
				}
			},
			isSelPageNum: false //是否显示选择条数列表默认false,  
		});
	},
	/**
	 * 拼接暂无数据内容
	 * @param {Object} trNum  行数
	 */
	noDataTrStr: function(trNum) {
		//暂无数据内容
		var noDataStr = '<tr style="border:0px;background-color:#fff !important;"><td  colspan="' + trNum + '" align="center"style="border:0px;"><div class="no-data" style="width: 280px;margin: 0 auto;">' +
			'<img src="../../../../../resources-sasac/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
			'</div></td></tr>';
		return noDataStr;
	},
	/*弹出框*/
	//带有顶部标题栏的弹出框  
	showAlert: function() {
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$(".yt-edit-alert,#heard-nav-bak").show();
		proCostUsageQuery.popTablePage();
		/** 
		 * 调用算取div显示位置方法 
		 */
		$yt_alert_Model.getDivPosition($(".yt-edit-alert"));
		/** 
		 * 点击取消方法 
		 */
		$('.yt-edit-alert .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
			//隐藏页面中自定义的表单内容  
			$(".yt-edit-alert,#heard-nav-bak").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
			$(".yt-edit-alert .pop-text").val("");
		});
	}
}

$(function() {
	//调用初始化页面方法
	proCostUsageQuery.init();
});