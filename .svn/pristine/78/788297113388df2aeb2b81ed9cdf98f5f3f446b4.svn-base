var costSharingList = {
	//初始化方法
	init: function() {
		//获取手动预算核减明细列表
		costSharingList.getCostSharingList();
		//点击费用分摊,进行费用分摊操作
		$("#costSharingBtn button").click(function(){
			//判断是否有选中行
			if($("#accountingSubsidiary tr.yt-table-active").length == 0) {
				$yt_alert_Model.prompt("请选择要进行操作的数据");
				return false;
			}else if($("#saveOrChange").val() == "0"){
				costSharingList.changeProjectAlert();
				//显示项目分摊明细列表
				$(".project-allocation-details-table").show();
				if($(".yt-table-active .detail-state-td").text() == "有"){
					$(".budget-share-detailed-list-no").hide();
					$(".budget-share-detailed-list-yes").show();
					//查询项目分摊明细
					costSharingList.getProjectAllocationDetails();
				}else{
					$(".budget-share-detailed-list-no").show();
					$(".budget-share-detailed-list-yes").hide();
				}
			}else{
				$("#saveOrChange").val(0);
				//$("#accountingSubsidiary tr.yt-table-active").show().siblings().hide();
				$("#subInfoId").val($("tr.yt-table-active input").val());
				//$("#accountingSubsidiaryMoney").parent().show();
				$(".costSharingProName").text($("tr.yt-table-active .costSharingProNameList").text());
				$(".costSharingProMoney").text($("tr.yt-table-active .amount-td").text());
				//$("#accountingSubsidiary tr.yt-table-active").removeClass("yt-table-active");
			}
			//显示项目分摊明细列表
			$(".project-allocation-details-table").show();
			if($(".yt-table-active .detail-state-td").text() == "有"){
				$(".budget-share-detailed-list-no").hide();
				$(".budget-share-detailed-list-yes").show();
				//查询项目分摊明细
				costSharingList.getProjectAllocationDetails();
			}else{
				$(".budget-share-detailed-list-no").show();
				$(".budget-share-detailed-list-yes").hide();
			}
			$(".cost-sharing-project").hide();
			$("#costSharingProjectInf").show();
		});
		//点击分摊项目名称，显示分摊项目弹出框
		$(".project-allocation-details-table").on("click",".share-project-change",function(){
			var me = $(this);
			//查询分摊项目列表
			costSharingList.shareProjectAlertList();
			//显示弹出框
			costSharingList.shareProjectAlert();
			
			$("#shareProjectAlert .yt-model-sure-btn").off().on().click(function(){
				//判断是否有选中行
				if($("#shareProjectAlert tr.yt-table-active").length == 0) {
					$yt_alert_Model.prompt("请选择要进行操作的数据");
					return false;
				}
				me.val($(".yt-table-active .prj-name").text());
				me.parent().find(".data-span").text($(".yt-table-active .prj-name").text());
				me.parent().find(".project-id").val($(".yt-table-active .advance-app-id").val());
				me.parent().find(".data-span").hide();
				//隐藏页面中自定义的表单内容  
	            $(".yt-edit-alert,#heard-nav-bak").hide();  
	            //隐藏蒙层  
	            $("#pop-modle-alert").hide();
			});
		});
		//项目分摊明细添加行
		$(".add-row").click(function(){
			//判断是否有空行
			if($(this).parent().parent().prev().find(".share-project-change").val() == "" || $(this).parent().parent().prev().find(".shareAmount-td .data-input").val() == "" || $(this).parent().parent().parent().find(".budget-share-detailed-list-no").css("display") == "block"){
				$yt_alert_Model.prompt("请将未填写完的数据填写完整并保存");
				return false;
			}
			var addRowTr = '<tr class="list-tr">'+
							'<td style="text-align: left;padding-left:15px;text-align: center;">'+
								'<input type="hidden" class="project-id" value="" />' + 
								'<span class="data-span"></span>'+
								'<input  id="" class="yt-input data-input share-project-change" readonly="readonly" placeholder="请选择" style="cursor: pointer;" />'+
							'</td>'+
							'<td style="text-align: right;" class="shareAmount-td">'+
								'<span class="data-span"></span>'+
								'<input  id="" class="yt-input data-input input-money" placeholder="0.00" value="0.00" style="text-align: right;width: 80%;padding-right: 4px;" />'+
							'</td>'+
							'<td class="img-icon">'+
								'<div class="budget-share-detailed-list-yes" style="display:none;">'+
									'<span class="operate-update" style="margin-right: 20px;"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>'+
									'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>'+
								'</div>'+
								'<div class="budget-share-detailed-list-no">'+
									'<span class="operate-save" style="margin-right: 20px;"><img src="../../../../../resources-sasac/images/common/save-icon.png"></span>'+
									'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/canel-icon.png"></span>'+
								'</div>'+
							'</td>'+
						'</tr>';
			$(".last").before(addRowTr);
			//调用金额输入框操作事件方法
			$yt_baseElement.moneyInputInit($(addRowTr));
		});
		//点击项目分摊明细操作列
		$("#projectAllocationDetails").on('click','.operate-update',function(){
			$(this).parent().parent().find(".budget-share-detailed-list-yes").hide();
			$(this).parent().parent().find(".budget-share-detailed-list-no").show();
			$(this).parent().parent().parent().find(".data-input").show();
			$(this).parent().parent().parent().find(".data-span").hide();
		});
		$("#projectAllocationDetails").on('click','.operate-save',function(){
			//判断合计金额
			var allMoney = 0;
			$.each($(".project-allocation-details-table tr.list-tr"), function(i,n) {
				allMoney += parseFloat($yt_baseElement.rmoney($(n).find(".shareAmount-td input").val()));
			});
			$("#projectAllocationDetailsMoney").text($yt_baseElement.fmMoney(allMoney));
			//判断是否有空行
			if($(this).parent().parent().parent().find(".share-project-change").val() == "" || $(this).parent().parent().parent().find(".shareAmount-td .data-input").val() == ""){
				$yt_alert_Model.prompt("请将未填写完的数据填写完整");
				return false;
			}else if(allMoney > $yt_baseElement.rmoney($(".costSharingProMoney").text())){
				$yt_alert_Model.prompt("项目分摊金额不能大于当前分摊费用金额");
			}else{
				$(this).parent().parent().find(".budget-share-detailed-list-yes").show();
				$(this).parent().parent().find(".budget-share-detailed-list-no").hide();
				$(this).parent().parent().parent().find(".shareAmount-td .data-span").text($yt_baseElement.fmMoney($(this).parent().parent().parent().find(".shareAmount-td .data-input").val()));
				$(this).parent().parent().parent().find(".shareAmount-td .data-input").val($yt_baseElement.fmMoney($(this).parent().parent().parent().find(".shareAmount-td .data-input").val()));
				$(this).parent().parent().parent().find(".data-input").hide();
				$(this).parent().parent().parent().find(".data-span").show();
			}
		});
		$("#projectAllocationDetails").on('click','.operate-del',function(){
			$(this).parent().parent().parent().remove();
			//判断合计金额
			var allMoney = 0;
			$.each($(".project-allocation-details-table tr.list-tr"), function(i,n) {
				allMoney += parseFloat($yt_baseElement.rmoney($(n).find(".shareAmount-td input").val()));
			});
			$("#projectAllocationDetailsMoney").text($yt_baseElement.fmMoney(allMoney));
		});
		//点击保存按钮
		$("#saveBtn").click(function(){
			//判断是否有空行
			var nullTr = "";
			$.each($("#projectAllocationDetails table tr.list-tr"), function(i,n) {
				if($(n).find(".budget-share-detailed-list-no").css("display") == "block"){
					nullTr = 1;
				}
			});
			if($("#projectAllocationDetails table").css("display")=="none"){
				$yt_alert_Model.prompt("请选择一条数据进行费用分摊");
			}else if(nullTr == 1){
				$yt_alert_Model.prompt("请将未填写完的数据填写完整并保存");
			}else{
				costSharingList.saveCostSharingList();
			}
		});
		//点击关闭按钮
		$("#cancelBtn").click(function(){
			window.close();
		});
		//点击模糊查询
		$("#searchBtn").click(function(){
			costSharingList.shareProjectAlertList();
		});
		//点击重置按钮
		$("#resetBtn").click(function(){
			$(".key-word").val("");
			costSharingList.shareProjectAlertList();
		});
	},
	/**
	 * 获取手动预算核减明细列表
	 */
	getCostSharingList: function() {
		var expenditureAppId = $yt_common.GetQueryString('expenditureAppId');
		$.ajax({
			url: $yt_option.base_path + "sz/expenditureApp/getShareDetailedAppInfoByAppId", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				expenditureAppId:expenditureAppId
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('#accountingSubsidiary .yt-tbody');
					var htmlTr = '';
					var amountMoney = 0;
					if(data.data.data.currentBudgetSubList.length > 0) {
						$("#accountingSubsidiary .list-tr").remove();
						$.each(data.data.data.currentBudgetSubList, function(i, v) {
							htmlTr += '<tr class="list-tr">' +
										'<td class="costSharingProNameList"><input type="hidden" value="'+ v.pkId +'" />' + v.specialName + '</td>' +
										'<td style="text-align: right;" class="amount-td">' + $yt_baseElement.fmMoney(v.amount) + '</td>' +
										'<td class="detail-state-td">' + v.detailState + '</td>' +
									'</tr>';
							amountMoney += v.amount;
							$("#accountingSubsidiaryMoney").text($yt_baseElement.fmMoney(amountMoney));
						});
						$(".accounting-subsidiary-cut-total").before(htmlTr);
						//点击选中行,为该行添加公用类
						$('#accountingSubsidiary .yt-table .yt-tbody tr.list-tr').off("click").on("click",function(){
						    $(this).addClass('yt-table-active').siblings().removeClass('yt-table-active');
						});
					} else {
						
					}
				} else {
					$yt_alert_Model.prompt("查询失败");
				}

			}, 
		});
	},
	/**
	 * 获取项目分摊明细列表数据
	 */
	getProjectAllocationDetails: function() {
		var subInfoId = $("#accountingSubsidiary .yt-table-active .costSharingProNameList input").val();
		$.ajax({
			url: $yt_option.base_path + "sz/expenditureApp/getShareDetailedAppInfo", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				subInfoId:subInfoId
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('#projectAllocationDetails .yt-tbody');
					var htmlTr = '';
					var shareAmountMoney = 0;
					if(data.data.data.length > 0) {
						$("#projectAllocationDetails .list-tr").remove();
						$.each(data.data.data, function(i, v) {
							htmlTr += '<tr class="list-tr">' +
										'<td>'+
											'<input type="hidden" class="project-id" value='+ v.projectId +' />' + 
											'<span class="data-span">' + v.projectName + '</span>'+
											'<input type="text" class="data-input yt-input share-project-change" value='+ v.projectName +' style="cursor: pointer;" />' +
										'</td>' +
										'<td style="text-align: right;" class="shareAmount-td">'+ 
											'<span class="data-span">' + $yt_baseElement.fmMoney(v.shareAmount) + '</span>'+
											'<input type="text" class="data-input yt-input input-money" style="text-align: right;width: 80%;padding-right: 4px;" value='+ v.shareAmount +' />' +
										'</td>' +
										'<td class="img-icon">'+
											'<div class="budget-share-detailed-list-yes">'+
												'<span class="operate-update" style="margin-right: 20px;"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>'+
												'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>'+
											'</div>'+
											'<div class="budget-share-detailed-list-no" style="display:none;">'+
												'<span class="operate-save" style="margin-right: 20px;"><img src="../../../../../resources-sasac/images/common/save-icon.png"></span>'+
												'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/canel-icon.png"></span>'+
											'</div>'+
										'</td>'+
									'</tr>';
							shareAmountMoney += v.shareAmount;
							$("#projectAllocationDetailsMoney").text($yt_baseElement.fmMoney(shareAmountMoney));
						});
						$(".last").before(htmlTr);
						$(".default-tr").remove();
						$(".data-input").hide();
						$(".data-span").show();
					} else {
						
					}
				} else {
					$yt_alert_Model.prompt("查询失败");
				}

			}, 
		});
	},
	/**
	 * 分摊项目选择列表数据
	 */
	shareProjectAlertList: function() {
		var expenditureAppId = $yt_common.GetQueryString('expenditureAppId');
		var queryParams = $(".key-word").val();
		$('.page-info').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "sz/expenditureApp/getAdvanceAppListToPageByParams", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				costType:"TRAIN_APPLY",
				queryParams:queryParams,
				type:"FINAL_APP"
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('#shareProjectAlert .yt-tbody');
					var htmlTr = '';
					var shareAmountMoney = 0;
					if(data.data.rows.length > 0) {
						htmlTbody.empty();
						$.each(data.data.rows, function(i, v) {
							htmlTr += '<tr class="">' +
										'<td><input type="hidden" class="advance-app-id" value="'+ v.advanceAppId +'"/>' + v.advanceAppNum + '</td>' +
										'<td class="prj-name">' + v.prjName + '</td>' +
										'<td>' + v.applicantUserName + '</td>' +
										'<td>' + v.applicantUserDeptName + '</td>' +
										'<td>' + v.applicantTime + '</td>' +
									'</tr>';
						});
						htmlTbody.append(htmlTr);
						//点击选中行,为该行添加公用类
						$('#shareProjectAlert .yt-table .yt-tbody tr').off("click").on("click",function(){
						    $(this).addClass('yt-table-active').siblings().removeClass('yt-table-active');
						});
					} else {
						$(".page-info").hide();
					}
				} else {
					$yt_alert_Model.prompt("查询失败");
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	//分摊项目选择弹出框
	shareProjectAlert:function(){  
        /** 
         * 显示编辑弹出框和显示顶部隐藏蒙层 
         */  
        $(".yt-edit-alert,#heard-nav-bak").show();  
        /** 
         * 调用算取div显示位置方法 
         */  
        $yt_alert_Model.getDivPosition($(".yt-edit-alert"));  
        /* 
         * 调用支持拖拽的方法 
         */  
        //$yt_model_drag.modelDragEvent($(".yt-edit-alert .yt-edit-alert-title"));  
        /** 
         * 点击取消方法 
         */  
        $('.yt-edit-alert .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {  
            //隐藏页面中自定义的表单内容  
            $(".yt-edit-alert,#heard-nav-bak").hide();  
            //隐藏蒙层  
            $("#pop-modle-alert").hide();  
        });  
   },
   /**
	 * 保存费用分摊
	 */
	saveCostSharingList: function() {
		var expenditureAppId = $yt_common.GetQueryString('expenditureAppId');
		var subInfoId = $("#subInfoId").val();
		var shareDetailJson = '';
		
		var projectId="";
		var projectName="";
		var shareAmount="";
		var shareDetailJsonArr=[];
		$(".project-allocation-details-table .yt-tbody tr.list-tr").each(function (i,n){
			projectId=$(n).find(".project-id").val();
			projectName=$(n).find(".share-project-change").prev("span").text();
			shareAmount=$yt_baseElement.rmoney($(n).find(".shareAmount-td input").prev("span").text());
				
			var arrShareDetailJson={
				projectId:projectId,
				projectName:projectName,
				shareAmount:shareAmount
			}
			shareDetailJsonArr.push(arrShareDetailJson);
		});
		var shareDetailJson = JSON.stringify(shareDetailJsonArr);
		$.ajax({
			url: $yt_option.base_path + "sz/expenditureApp/saveShareDetailedAppInfo", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				expenditureAppId:expenditureAppId,
				subInfoId:subInfoId,
				shareDetailJson:shareDetailJson
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				if(data.flag == 0) {
					$("#saveOrChange").val(1);
					//获取手动预算核减明细列表
					costSharingList.getCostSharingList();
					$yt_alert_Model.prompt("保存成功");
				} else {
					$yt_alert_Model.prompt("保存失败");
				}

			}, 
		});
	},
	//带按钮,带有关闭图标的  
	changeProjectAlert: function() {  
	    $yt_alert_Model.alertOne({  
	        haveCloseIcon: true, //是否带有关闭图标  
	        //closeIconUrl: "../../resources-sasac/images/icons/x.png", //关闭图标路径  
	        leftBtnName: "确定", //左侧按钮名称,默认确定  
	        rightBtnName: "取消", //右侧按钮名称,默认取消  
	        cancelFunction: "", //取消按钮操作方法*/  
	        alertMsg: "数据尚未保存，更换分摊费用项将导致已填写信息丢失，确定要继续吗？", //提示信息  
	        confirmFunction: function() { //点击确定按钮执行方法  
	        	$("#saveOrChange").val(0);
	            //$("#accountingSubsidiary tr.yt-table-active").show().siblings().hide();
				$("#subInfoId").val($("tr.yt-table-active input").val());
				//$("#accountingSubsidiaryMoney").parent().show();
				$(".costSharingProName").text($("tr.yt-table-active .costSharingProNameList").text());
				$(".costSharingProMoney").text($("tr.yt-table-active .amount-td").text());
				//$("#accountingSubsidiary tr.yt-table-active").removeClass("yt-table-active");  
				if($(".yt-table-active .detail-state-td").text() == "有"){
					$(".budget-share-detailed-list-no").hide();
					$(".budget-share-detailed-list-yes").show();
					//查询项目分摊明细
					costSharingList.getProjectAllocationDetails();
				}else{
					var addRowTr = '<tr class="list-tr">'+
							'<td style="text-align: left;padding-left:15px;text-align: center;">'+
								'<input type="hidden" class="project-id" value="" />' + 
								'<span class="data-span"></span>'+
								'<input  id="" class="yt-input data-input share-project-change" readonly="readonly" placeholder="请选择" style="cursor: pointer;" />'+
							'</td>'+
							'<td style="text-align: right;" class="shareAmount-td">'+
								'<span class="data-span"></span>'+
								'<input  id="" class="yt-input data-input input-money" placeholder="0.00" value="0.00" style="text-align: right;width: 80%;padding-right: 4px;" />'+
							'</td>'+
							'<td class="img-icon">'+
								'<div class="budget-share-detailed-list-yes" style="display:none;">'+
									'<span class="operate-update" style="margin-right: 20px;"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>'+
									'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>'+
								'</div>'+
								'<div class="budget-share-detailed-list-no">'+
									'<span class="operate-save" style="margin-right: 20px;"><img src="../../../../../resources-sasac/images/common/save-icon.png"></span>'+
									'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/canel-icon.png"></span>'+
								'</div>'+
							'</td>'+
						'</tr>';
					$("#projectAllocationDetails .list-tr").remove();
					$(".last").before(addRowTr);
					//调用金额输入框操作事件方法
					$yt_baseElement.moneyInputInit($(addRowTr));
					$("#projectAllocationDetailsMoney").text($yt_baseElement.fmMoney(0));
				}
	        },  
	    });  
	}  
}
$(function() {
	//初始化方法
	costSharingList.init();
	
});