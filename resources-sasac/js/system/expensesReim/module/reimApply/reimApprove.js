var reimApprove = {
	riskData:"",//风险数据
	reimId:"",
    reimDatas:"",//报销单数据
	/**
	 * 
	 * 初始化方法
	 * 
	 */
	init: function() {
		//调用获取用户信息方法
		sysCommon.getLoginUserInfo();
		//初始化下拉列表
		$("#reimApply select").niceSelect();
		//调用初始获取数据方法
		reimApprove.getInitFunDatas();
		//获取列表传输的报销单ID
		//获取页面跳转传输的参数对象
		var requerParameter = $yt_common.GetRequest();
		// 获取传输的项目ID
		reimApprove.reimId = requerParameter.reimId;
		//调用获取报销单信息方法
		reimApprove.getReimInfoByReimId(reimApprove.reimId);
     	//调用底部功能按钮操作事件
     	reimApprove.bottomFunBtnEvent();
     	//调用获取风险数据方法
     	sysCommon.getRiskData();
	},
	/**
	 * 
	 * 
	 * 初始获取数据
	 * 
	 */
	getInitFunDatas:function(){
		
	},
	/**
	 * 获取报销单信息
	 * @param {Object} reimId 报销单ID
	 */
    getReimInfoByReimId:function(reimId){
		$.ajax({
			type: "post",
			url:"sz/reimApp/getReimAppInfoDetailByReimAppId",
			async: false,
			data:{
				reimAppId:reimId
			},
			success: function(data) {
				var costDatas = data.data;
				if(data.flag == 0){
					if(data.data){
						reimApprove.reimDatas = data.data;
						$(".base-info-model").setDatas(data.data);
						//报销金额
						$("#reimMoney").text(data.data.reimTotalAmount == "" ? "0.00": $yt_baseElement.fmMoney(data.data.reimTotalAmount));
						$("#writeOffMoney").text(data.data.loanAmount == "" ?"0.00" : $yt_baseElement.fmMoney(data.data.loanAmount));
						var replMoney = "0.00";
						if(data.data.loanAmount != ""){
							replMoney = data.data.reimTotalAmount - data.data.loanAmount;
						}else{
							replMoney = data.data.reimTotalAmount;
						} 
						replMoney = $yt_baseElement.fmMoney(replMoney);
						$("#replMoney").text(replMoney);
						//发票张数,借款单编号,借款金额
						$("#invoiceNum").text(data.data.invoiceNum == "" ? "0" :data.data.invoiceNum);
						$("#loanAppNum").text(data.data.loanAppNum == "" ? "--" : data.data.loanAppNum);
						$("#loanPrice").text(data.data.loanAmount == "" ? "" : $yt_baseElement.fmMoney(data.data.loanAmount));
						//接待方提供
						var recepStr = "";
						var receptionCostItem = data.data.receptionCostItem.split(",");
						$.each(receptionCostItem, function(i,n) {
							if(n == 1){
								recepStr += "住宿费"+ "、";
							}
							if(n == 2){
								recepStr += "伙食费"+ "、";
							}
							if(n == 3){
								recepStr += "市内交通费"+ "、";
							}
						});
						recepStr = recepStr.substring(0,recepStr.length-1);
						$("#receptionCostItem").text(recepStr);
						/**
						 * 
						 * 补领方式中的金额数据
						 * 
						 */
						$("#officialCard").text(data.data.officialCard == "" ?"0.00":$yt_baseElement.fmMoney(data.data.officialCard));
						$("#cash").text(data.data.cash == "" ? "0.00" : $yt_baseElement.fmMoney(data.data.cash));
						$("#check").text(data.data.cheque == "" ? "0.00" : $yt_baseElement.fmMoney(data.data.cheque));
			            $("#carryOver").text(data.data.transfer == "" ? "0.00" : $yt_baseElement.fmMoney(data.data.transfer));
			            var payWaySum;
			            if(data.data.officialCard != ""){
			            	payWaySum += data.data.officialCard;
			            }else if(data.data.cash != ""){
			            	payWaySum += data.data.cash;
			            }else if(data.data.cheque != ""){
			            	payWaySum += data.data.cheque;
			            }else if(data.data.transfer != ""){
			            	payWaySum += data.data.transfer;
			            }else{
			            	payWaySum = "0.00";
			            }
			            payWaySum = $yt_baseElement.fmMoney(payWaySum);
			            $("#payWaySum").text(payWaySum);
						/**
					 * 交通费数据
					 */
					if(costDatas.costCarfareList.length > 0){
						//调用拼接合计行方法
						reimApprove.createSumTr(0);
						var trafficCostStr = "";
						var  vehicleName = "";
						$.each(costDatas.costCarfareList, function(i,n) {
							//拼接交通费表格数据
						 trafficCostStr = '<tr>'
						                   + '<td><span>'+n.travelPersonnelName+'</span><input type="hidden" data-val="travelPersonnel" class="hid-traf-users" value="'+n.travelPersonnel+'"/></td><td>'+n.jobLevelName+'</td>'
						                   + '<td data-text="goTime">'+n.goTime+'</td><td data-text="goAddress">'+n.goAddress+'</td><td data-text="arrivalTime">'+n.arrivalTime+'</td>'
						 				   + '<td data-text="arrivalAddress">'+n.arrivalAddress+'</td>';
						 				 trafficCostStr  += '<td><span>'+n.vehicleName+'</span><input type="hidden" data-val="vehicle" class="hid-vehicle" value="'+n.vehicle+'"/>'
						 				   +'<input class="hid-child-code" type="hidden" value=""/></td>'
						 				   + '<td class="font-right money-td" data-text="crafare">'+(n.crafare == "" ? "0.00" : $yt_baseElement.fmMoney(n.crafare))+'</td>'
						 				   + '<td class="text-overflow-sty" title="'+n.remarks+'" data-text="remarks">'+(n.remarks == "" ? "--" : n.remarks)+''
						 				   + '<input type="hidden" class="hid-set-met" data-val="setMethod" value="'+n.setMethod+'"/>'
						 				   + '</td></tr>';
						   $("#traffic-list-info tbody .total-last-tr").before(trafficCostStr);	
						});
						//调用合计方法
						sysCommon.updateMoneySum(0);
						//改变风险灯图标绿灯
						$("#traffic-list-info").parent().find(".cost-list-title .risk-img").attr("src",reimApprove.riskViaImg);
					}
					/**
					 * 住宿费
					 */
					if(costDatas.costHotelList.length>0){
						//调用生成合计行方法
						reimApprove.createSumTr(1);
						var  hotelCostStr ="";
						var  avgHotelMoney=0.00;
						$.each(costDatas.costHotelList, function(i,n) {
							avgHotelMoney = n.hotelExpense/n.hotelDays;
							hotelCostStr = '<tr>'
	         				  + '<td><span>'+n.travelPersonnelName+'</span><input type="hidden" data-val="travelPersonnel" value="'+n.travelPersonnel+'"/></td><td>'+n.jobLevelName+'</td>'
	         				  + '<td>'+n.hotelTime+'</td>'
	         				  + '<td class="font-right">'+($yt_baseElement.fmMoney(avgHotelMoney))+'</td>'
	         				  + '<td data-text="hotelDays">'+n.hotelDays+'</td><td class="font-right money-td" data-text="hotelExpense">'+(n.hotelExpense == "" ? "0.00" :$yt_baseElement.fmMoney(n.hotelExpense))+'</td>'
	         				  + '<td><span>'+n.hotelAddressName+'</span><input type="hidden" data-val="hotelAddress" value="'+n.hotelAddress+'"</td>'
	         				  + '<td class="text-overflow-sty" title="'+n.remarks+'" data-text="remarks">'+(n.remarks == "" ? "--" : n.remarks)+''
	         				  + '<input type="hidden" class="hid-set-met" data-val="setMethod" value="'+n.setMethod+'"/>'
	         				  + '</td></tr>';
							$("#hotel-list-info tbody .total-last-tr").before(hotelCostStr);
						});
						//调用合计方法
						sysCommon.updateMoneySum(1);
						//改变风险灯图标绿灯
						$("#hotel-list-info").parent().find(".cost-list-title .risk-img").attr("src",reimApprove.riskViaImg);
					}
					/**
					 * 其他费用
					 */
					if(costDatas.costOtherList.length>0){
						//调用生成合计行方法
						reimApprove.createSumTr(2);
						var otherCostStr ="";
						$.each(costDatas.costOtherList, function(i,n) {
							otherCostStr = '<tr>'
							             + '<td><span>'+n.costTypeName+'</span>'
							             + '<input type="hidden" data-val="costType" value="'+n.costType+'"></td>'
							             + '<td class="font-right money-td" data-text="reimAmount">'+(n.reimAmount == "" ? "0.00" :$yt_baseElement.fmMoney(n.reimAmount))+'</td>'
							             + '<td class="text-overflow-sty" data-text="remarks" title="'+n.remarks+'">'+n.remarks+''
							             + '<input type="hidden" class="hid-set-met" data-val="setMethod" value="'+n.setMethod+'"/>'
							             + '</td></tr>';
							$("#other-list-info tbody .total-last-tr").before(otherCostStr);
						});
						//调用合计方法
						sysCommon.updateMoneySum(2);
						//改变风险灯图标绿灯
						$("#other-list-info").parent().find(".cost-list-title .risk-img").attr("src",reimApprove.riskViaImg);
					}
					/**
					 * 
					 * 补助明细
					 * 
					 */
					if(costDatas.costSubsidyList.length>0){
						//调用生成合计行方法
						reimApprove.createSumTr(3);
						var subsidyStr = "";
						$.each(costDatas.costSubsidyList, function(i,n) {
							subsidyStr = '<tr><td><span>'+n.travelPersonnelName+'</span><inpu type="hidden" data-val="travelPersonnel" value="'+n.travelPersonnel+'"/></td>'
							           + '<td><span>'+n.jobLevelName+'</span></td>'
							           + '<td><span data-text="subsidyDays">'+n.subsidyDays+'</span></td>'
							           + '<td class="font-right"><span class="food-money" data-text="subsidyFoodAmount">'+(n.subsidyFoodAmount == "" ? "0.00" :$yt_baseElement.fmMoney(n.subsidyFoodAmount))+'</span></td>'
							           + '<td class="font-right"><span class="city-money" data-text="carfare">'+(n.carfare == "" ? "0.00" : $yt_baseElement.fmMoney(n.carfare))+'</span>'
							           + '<input type="hidden" class="hid-set-met" data-val="setMethod" value="'+n.setMethod+'"/>'
									   + '</td>'
							           + '</tr>';
							$("#subsidy-list-info tbody .total-last-tr").before(subsidyStr);
						});
						//调用合计方法
						sysCommon.updateMoneySum(3);
						//改变风险灯图标绿灯
						$("#subsidy-list-info").parent().find(".cost-list-title .risk-img").attr("src",reimApprove.riskViaImg);
					}
					
					
					//调用获取流程数据方法
					sysCommon.getApproveFlowData("SZ_REIM_APP",data.data.processInstanceId,"");
					}
				}
			}
		});
    },
    /**
	 * 
	 * 
	 * 拼接交通费合计行方法
	 * @param {Object} tabObj 表格对象0交通费,1住宿费2其他3补助明细
	 * 
	 */
	createSumTr:function(tabObj){
		//城市交通
		if(tabObj == 0){
		   if($("#traffic-list-info tbody").find(".total-last-tr").length == 0){
			var totalRows = '<tr class="total-last-tr">'
						   + '<td><span class="tab-font-blod">合计</span></td><td></td><td></td><td></td><td></td><td></td>'
						   + '<td></td>'
						   + '<td class="font-right"><span class="tab-font-blod money-sum">0.00</span></td>'
						   + '<td></td></tr>';
			$("#traffic-list-info tbody").append(totalRows);
		    }
		}
		//住宿费
	    if(tabObj == 1){
		  if($("#hotel-list-info tbody").find(".total-last-tr").length == 0){
			var totalRows = '<tr class="total-last-tr">'
         				  + '<td><span class="tab-font-blod">合计</span></td><td></td><td></td><td></td><td></td>'
          				  + '<td class="font-right"><span class="tab-font-blod money-sum">0.00</span></td>'
          				  + '<td></td><td></td></tr>';
		 	$("#hotel-list-info tbody").append(totalRows);
		  } 
		}
	    //其他费用
	    if(tabObj == 2){
			 if($("#other-list-info tbody").find(".total-last-tr").length == 0){
				var totalRows = '<tr class="total-last-tr">'
	          				  + '<td><span class="tab-font-blod">合计</span></td>'
	          				  + '<td class="font-right"><span class="tab-font-blod money-sum">0.00</span></td>'
	          				  + '<td></td></tr>';
				$("#other-list-info").append(totalRows);
			}
		}
	    //补助明细
	    if(tabObj == 3){
			 if($("#subsidy-list-info tbody").find(".total-last-tr").length == 0){
				var totalRows = '<tr class="total-last-tr">'
	          				  + '< <td class="tab-font-blod">合计</td>'
	          				  + '<td></td><td></td>'
	          				  + '<td class="font-right"><span class="tab-font-blod money-sum">0.00</span></td>'
	          				  + '<td class="font-right tab-font-blod city-money-td"></td></tr>';
				$("#subsidy-list-info").append(totalRows);
			}
		}
	},
	/**
	 * 
	 * 获取风险提示信息数据
	 * 
	 */
	getRiskData:function(){
		$.ajax({
				type: "get",
				url:$yt_option.websit_path+"resources-sasac/js/testJsonData/reimRiskMsg.json",
				async: false,
				success: function(data) {
					reimApprove.riskData = data.data.rows;
				}
			});
		//调用风险灯点击事件
		reimApprove.riskClickEvent();
	},
	/**
	 * 
	 * 
	 * 风险灯点击事件
	 * 
	 */
	riskClickEvent:function(){
		$("#reimApply .risk-model").off().on("click",function(){
			//调用根据风险code显示提示信息方法
			reimApprove.showRiskMsg($(this).find(".hid-risk-code").val());
			
		});
	},
	/**
	 * 
	 * 根据风险code显示提示信息
	 * @param {Object} riskCode 风险code
	 */
	showRiskMsg:function(riskCode){
		$.each(reimApprove.riskData, function(i,n) {
			if(riskCode == n.riskCode){
				$yt_alert_Model.alertOne({
					haveCloseIcon: true, //是否带有关闭图标  
					leftBtnName: "确定", //左侧按钮名称,默认确定  
					cancelFunction: "", //取消按钮操作方法*/  
					alertMsg: n.riskMsg, //提示信息  
					cancelFunction: function() {
					},
				});
			}
		});
	},
	/**
	 * 
	 * 页面底部功能按钮操作事件
	 * 
	 */
	bottomFunBtnEvent:function(){
		//点击提交按钮
		$("#subCreateFormBtn").off().on("click",function(){
			var thisBtn = $(this);
			var validFlag = $yt_valid.validForm($("#reimApply"));
			if(validFlag){
				//获取页面数据
				var reimDatas = reimApprove.getSubSaveData();
					$.ajax({
						type: "post",
						url: "sz/reimApp/submitReimAppInfo",
						async: false,
						data:reimDatas,
						success: function(data) {
							if(data.flag == 0){
								//操作成功禁用按钮
								thisBtn.attr("disabled",true);
								var pageUrl = 'view/system-sasac/expensesReim/module/reimApply/reimApproveList.html';
							    window.location.href= $yt_option.websit_path+pageUrl;
							}else{
								//解除禁用按钮
								thisBtn.attr("disabled",false);
							}
							$yt_alert_Model.prompt(data.message,2000);  
						}
					});
			}
		});
		//取消
		$("#apprCanelBtn").off().on("click",function(){
			window.location.href= $yt_option.websit_path+pageUrl;
		});
	},
	/**
	 * 
	 * 
	 * 获取页面数据
	 * 
	 */
	getSubSaveData:function(){
		var costCarfareJson = "";//城市间交通费json
		var costHotelJson = "";//住宿费json
		var costOtherJson = "";//其他费用json
		var costSubsidyJson = "";
		if(reimApprove.reimDatas.costCarfareList.length>0){
		    costSubsidyJson = JSON.stringify(reimApprove.reimDatas.costCarfareList);
		}
		if(reimApprove.reimDatas.costHotelList.length>0){
			costSubsidyJson = JSON.stringify(reimApprove.reimDatas.costHotelList);
		}
		if(reimApprove.reimDatas.costOtherList.length>0){
			costSubsidyJson = JSON.stringify(reimApprove.reimDatas.costOtherList);
		}
		if(reimApprove.reimDatas.costSubsidyList.length>0){
			costSubsidyJson = JSON.stringify(reimApprove.reimDatas.costSubsidyList);
		}
    	return{
    		travelAppId:reimApprove.reimDatas.travelAppId,//出差申请表id
    		loanAppId:reimApprove.reimDatas.loanAppId,	//借款申请表id
    		reimAppId:reimApprove.reimId,//报销申请表id
    		reimAppNum:reimApprove.reimDatas.reimAppNum,//报销单号
    		reimAppName:reimApprove.reimDatas.reimAppName,//报销事由
    		invoiceNum:reimApprove.reimDatas.invoiceNum,//发票张数
    		officialCard:reimApprove.reimDatas.officialCard,//公务卡金额
    		cash:reimApprove.reimDatas.cash,//现金金额
    		cheque:reimApprove.reimDatas.cheque,//支票金额
    		transfer:reimApprove.reimDatas.transfer,//转账金额
			applicantUser:reimApprove.reimDatas.applicantUser,//申请人code
			parameters:"",//JSON格式字符串
			dealingWithPeople:$("#approve-users").val(),//下一步操作人code
			opintion:$("#operate-msg").val(),//审批意见
			processInstanceId:reimApprove.reimDatas.processInstanceId,//流程实例ID, 
			totalAmount:reimApprove.reimDatas.reimTotalAmount,//合计金额
			nextCode:$("#operate-flow").val(),//操作流程code
			costCarfareJson:costCarfareJson,//城市间交通费json
			costHotelJson:costHotelJson,//住宿费json
			costOtherJson:costOtherJson,//其他费用json
			costSubsidyJson:costSubsidyJson//补助明细json
    	}
	}
}
$(function() {
	reimApprove.init();
});
