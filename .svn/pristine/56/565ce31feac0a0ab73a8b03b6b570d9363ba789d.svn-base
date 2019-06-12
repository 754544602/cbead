var  createForm={
	reimId:"",
	init:function(){
		//调用顶部功能按钮操作事件
		createForm.heardFunBtnEvent();
		//获取页面跳转传输的参数对象
		var requerParameter = $yt_common.GetRequest();
		// 获取传输的项目ID
		createForm.reimId = requerParameter.reimId;
		//获取当前日期
		$("#createFormDate").text(sysCommon.getNowDate());
		$("#reimFrom").css("min-height",$(window).height()-32+"px");
		//调用获取报销单信息方法
		createForm.getReimInfo();
	},
	/**
	 * 
	 * 获取报销单数据
	 * 
	 */
	getReimInfo:function(){
		var qrCodeContextUrl =  $yt_option.websit_path + 'view/system-sasac/expensesReim/module/reimApply/reimApprove.html?reimId='+createForm.reimId;
		 $.ajax({
		 	type:"post",
		 	url:"sz/reimApp/getReimPreviewDetailByReimAppId",
		 	async:false,
		 	data:{
		 		reimAppId:createForm.reimId,
				previewFalg:false,
				qrCodeContext:qrCodeContextUrl
		 	},
		 	success:function(data){
		 		if(data.flag == 0){
		 			if(data.data){
		 				$("#reimFormTab").setDatas(data.data);
		 				//出差申请单
		 				$("#travelAppNum").attr("title",data.data.travelAppNum);
		 				//借款金额单独处理,需要做格式化
						var loanPrice = data.data.loanAmount;
						$("#loanPrice").text((loanPrice == "" ? "" : $yt_baseElement.fmMoney(data.data.loanAmount)));
						//出差天数
						$("#busiTripDays").text(sysCommon.calculateDays(data.data.planGoTime,data.data.planReturnTime));
						//处理接待方承担项数据
						var receptionCostItem = data.data.receptionCostItem.split(",");
						$.each(receptionCostItem, function(i,n) {
							$('.recep-box[value="'+n+'"]').parent().addClass("check");
						});
						//报销总金额
						$(".money-span").text(data.data.reimTotalAmount == "" ? "" : $yt_baseElement.fmMoney(data.data.reimTotalAmount));
						$("#reimMoneySum").text(arabiaToChinese(data.data.reimTotalAmount));
						//处理付款方式数据
						var payWayPriceSum = 0;
						//现金
						$("#cash").text(data.data.cash == "0.00" ? "" : $yt_baseElement.fmMoney(data.data.cash));
						if(data.data.cash != "0.00"){
							//复选框选中
							$("#cash").parent().prev().addClass("check");
							payWayPriceSum += data.data.cash;
						}
						//归还公务卡
						$("#officialCard").text(data.data.officialCard == "0.00" ? "" : $yt_baseElement.fmMoney(data.data.officialCard));
						if(data.data.officialCard != "0.00"){
							//复选框选中
							$("#officialCard").parent().prev().addClass("check");
							payWayPriceSum += data.data.officialCard;
						}
						//计算核销借款
						var chargeOffPrice = 0;
						if(data.data.loanAmount != "0.00" && data.data.reimTotalAmount != ""){
							chargeOffPrice = (data.data.reimTotalAmount - data.data.loanAmount);
						}else{
							chargeOffPrice = (data.data.reimTotalAmount == "" ? "" : data.data.reimTotalAmount);
						}
						if(chargeOffPrice != 0 && chargeOffPrice != ""){
							//复选框选中
							$("#chargeOff").parent().prev().addClass("check");
							payWayPriceSum = parseFloat((payWayPriceSum == 0 ? "" : $yt_baseElement.rmoney(payWayPriceSum))+chargeOffPrice);
							chargeOffPrice = (chargeOffPrice == "" ? "" : $yt_baseElement.fmMoney(chargeOffPrice));
						}
						$("#chargeOff").text(chargeOffPrice);
						//支票
						$("#cheque").text();
						//电汇
						$("#ableTransfer").text();
						//合计
						payWayPriceSum = (payWayPriceSum == 0 ? "" : $yt_baseElement.fmMoney(payWayPriceSum));
						$("#payWayPriceSum").text(payWayPriceSum);
						//付款方式选中
						if($(".pay-type-ul .yt-checkbox.check").length > 0){
							$("input.pay-way-box").parent().addClass("check");
						}
						/**
						 * 
						 * 处理报销明细数据
						 * 
						 */
						var maxRowsNum = "";
						if(data.data.costCarfareList.length > data.data.costOtherList.length){
							maxRowsNum = 4+data.data.costCarfareList.length;
						}else{
							maxRowsNum = 4+data.data.costOtherList.length;
						}
						//没有交通费用和其他费用信息
						if(data.data.costCarfareList.length == 0 && data.data.costOtherList.length == 0){
							maxRowsNum = 4;
						}
						$("#reimDetailTd").attr("rowspan",maxRowsNum);
						var detailStr = "";
						maxRowsNum = maxRowsNum - 4;
						//交通费,其他合计金额
						var crafareSum = 0;
						var otherPriceSum = 0;
						if(maxRowsNum > 0){
							for (var i =0;i< maxRowsNum;i++) {
								detailStr += '<tr>';
								if(data.data.costCarfareList !=null && data.data.costCarfareList.length > 0 && data.data.costCarfareList.length >= (i+1)){
									var n = data.data.costCarfareList[i];
										detailStr += '<td><span>'+n.goTime+'</span></td>'
									       		  + '<td><span>'+n.goAddress+'</span></td>'
									       		  + '<td><span>'+n.arrivalTime+'</span></td>'
									       		  + '<td><span>'+n.arrivalAddress+'</span></td>'
									       		  + '<td><span>'+n.vehicleName+'</span></td>'
									       		  + '<td><span class="crafare">'+(n.crafare == undefined ? "" : $yt_baseElement.fmMoney(n.crafare))+'</span></td>'
									       		  + '<td><span class="hotel-price"></span></td>';
									    crafareSum += n.crafare;
								}else{
								    detailStr +='<td><span></span></td>'
									       		  + '<td><span></span></td>'
									       		  + '<td><span></span></td>'
									       		  + '<td><span></span></td>'
									       		  + '<td><span></span></td>'
									       		  + '<td><span class="other-price"></span></td>'
									       		  + '<td><span></span></td>';
								}
								//其他费用
								if(data.data.costOtherList !=null && data.data.costOtherList.length > 0 && data.data.costOtherList.length >= (i+1)){
									var v = data.data.costOtherList[i];
										detailStr += '<td><span title="'+v.costTypeName+'">'+v.costTypeName+'</span></td>'
								    	          + '<td><span>'+(v.reimAmount == undefined ? "" : $yt_baseElement.fmMoney(v.reimAmount))+'</span></td>'
								    	          + '<td><span class="remark" title="'+v.costTypeName+'">'+(v.remarks == "" ? "--" : v.remarks)+'</span></td>';
								    	         otherPriceSum += (v.reimAmount == undefined ? 0 : v.reimAmount);
								}else{
								    detailStr += '<td><span></span></td>'
								    	          + '<td><span></span></td>'
								    	          + '<td><span class="remark">--</span></td>';
								}
								detailStr +='</tr>';
						}
							$(".reim-detail-tr").after(detailStr);
							//住宿费用
							var hotelPrice = data.data.hotelExpense == "" ? "" : $yt_baseElement.fmMoney(data.data.hotelExpense);
							$(".reim-detail-tr").next("tr:eq(0)").find("td:eq(6) span").text(hotelPrice);
		 			        //报销明细合计字段给值
		 			        $("#trafficPriceSum").text(crafareSum == 0 ? "" : $yt_baseElement.fmMoney(crafareSum));
		 			        $("#hotelPriceSum").text(hotelPrice);
		 			        $("#otherPriceSum").text(otherPriceSum == 0 ? "" : $yt_baseElement.fmMoney(otherPriceSum));
						}
						
						//获取二维码数据
						$("#twoBarCode img").attr("src",$yt_option.base_path+data.data.lookQrCode);
		 		}
		 	}
		 }
	});
},
	/**
	 * 
	 * 顶部功能按钮操作事件
	 * 
	 */
	heardFunBtnEvent:function(){
		/**
		 * 
		 * 
		 * 打印按钮操作事件
		 * 
		 */
		$("#printBtn").off().on("click", function() {
			//调用执行打印的方法
            createForm.doPrint();
		});
		/**
		 * 关闭按钮
		 */
		$("#closeBtn").off().on("click",function(){
			/**
			 * 
			 * 跳转到报销列表页面
			 * 
			 */
			 $yt_common.parentAction({
				url:$yt_option.parent_action_path,//父级中转地址,固定配置项,只有统一修改处理。
				funName:'locationToMenu',//指定方法名，定位到菜单方法
				data:{
					url:'view/system-sasac/expensesReim/module/reimApply/reimApproveList.html'//要跳转的页面路径
				}
			});
		});
	},
	/**
	 * 
	 * 执行打印操作
	 * 
	 */
	doPrint: function() {
		bdhtml = window.document.body.innerHTML; //获取当前页的html代码  
		sprnstr = "<!--startprint-->"; //设置打印开始区域   
		eprnstr = "<!--endprint-->"; //设置打印结束区域   
		prnhtml = bdhtml.substr(bdhtml.indexOf(sprnstr) + 17); //从开始代码向后取html   
		prnhtml = prnhtml.substring(0, prnhtml.indexOf(eprnstr)); //从结束代码向前取html   
		window.document.body.innerHTML = prnhtml;
		window.print();
		window.document.body.innerHTML = bdhtml; //还原页面  
		window.location.reload();
	}
}
$(function(){
	//调用初始化方法
	createForm.init();
});
function printit()　　 {　　 
	if(confirm('确定打印吗？')) {　　
	wb.execwb(6, 6)　　
	}　　
}