var  sysCommon={
    riskData:"",//全局风险数据
    processState : [], //流程状态
	comRiskCodes:"",//全局的风险code值
	riskExcMark:"../../../../../resources-sasac/images/common/war-red.png",//风险感叹号图片
	riskWarImg:"../../../../../resources-sasac/images/common/risk-war.png",//风险未通过图片红灯
	riskViaImg:"../../../../../resources-sasac/images/common/risk-via.png",//风险通过图片绿灯
	isWorkFlowStateStr:'未通过,已完成,已撤销',//流程状态不显示图的状态字符串
	/**
	 * 公用的清除验证信息方法
	 * @param {Object} validObj
	 */
	clearValidInfo:function(validObj){
		$(validObj).find(".valid-font").text("");
		$(validObj).find("input,textarea,select").removeClass("valid-hint");
	},
	/**
	 * 字段验证设置滚动条滚动到验证错误信息位置
	 * @param {Object} validObj 指定区域下的验证提示信息  $("body .valid-font");
	 */
	pageToScroll:function(validObj){
		var  scrollTopVal =0;
		$(validObj).each(function(){
			if($(this).text() != ""){
				if($(window).scrollTop() && ($(this).eq(0).parent().offset().top < $(window).scrollTop() || $(this).eq(0).parent().offset().top > $(window).height())) {
					scrollTopVal = $(this).eq(0).parents().offset().top - 30 ;
                 $(window).scrollTop(scrollTopVal);
           	  	}
			  return false;
			}
		});
	},
	/**
	 * 查询所有的用户信息
	 * @param {Object} userIds  用户ID字符串多个用逗号串接
	 * @param {Object} userCodes 用户code多个用逗号串接
	 * @param {Object} userName  用户名模糊查询使用
	 */
	getUserAllInfo:function(userIds,userCodes,userName){
		var  usersData = "" ;
		userIds = (userIds == undefined ? "" : userIds);
		userCodes = (userCodes == undefined ? "" : userCodes);
		userName = (userName == undefined ? "" : userName);
		$.ajax({
				type: "post",
				url:'user/userInfo/getAllUserObjectsByParams',
				async: false,
				data:{
					userIds:userIds,
					userCodes:userCodes,
					userName:userName
				},
				success: function(data) {
					if(data.flag == 0){
						usersData = data.data;
					}
				}
			});
		return usersData;
	},
	/**
	 * 计算两个日期相差天数
	 * @param {Object} startDate 开始日期
	 * @param {Object} endDate   结束日期
	 */
	calculateDays:function(startDate,endDate){
		var days = 0;
		if(startDate !="" && endDate!=""){
			//获取开始日期
			var startDates  =  new Date(startDate.replace(/-/g,"/"));
			//后去结束日期
			var endDates = new Date(endDate.replace(/-/g,"/"));
			var time = endDates.getTime() - startDates.getTime();
			 days = parseInt(time/(1000 * 60 * 60 * 24)+1);
			if(startDates.getTime() == endDates.getTime()){
				days = 1;
			}
		}
	    return days;
	},
	/**
	 * 
	 * 获取当前日期
	 * 
	 */
	getNowDate:function(){
		var nowDate = new Date();
	    var year = nowDate.getFullYear();//获取当前年
	    var month = nowDate.getMonth()+1;//获取当前月
	    var day = nowDate.getDate();//获取当前日
	    if(month<10){
	    	month = "0"+month;
	    }
 		if(day<10){
	    	day = "0"+day;
	    }
 		var currentDate = year+"年"+month+"月"+day+"日";
 		return currentDate;
	},
	/**
	 * 获取风险提示信息数据
	 * @param {Object} modelFlag  模块标识
	 */
	getRiskData:function(modelFlag){
		//调用获取风险字段方法
		$.ajax({
				type: "post",
				url:'basicconfig/risk/getSystemRiskByParams',
				async: false,
				success: function(data) {
					if(data.flag == 0){
						var riskCode = "";
						$.each(data.data,function (i,n){
							//遍历页面中所有的风险code自定义属性获取风险code值
							$("[datariskcode]").each(function(i,v){
								riskCode = $(v).attr("datariskcode");
								if(n.pageFieldCode == riskCode){
									var obj = $(v).next(".risk-model");
									if(obj.length  == 0){
										obj =  $(v).parent().next(".risk-model");
									}
									//显示风险灯
									obj.show();
									//获取标签类型
									var lableType = $(v)[0].tagName;
									if(lableType == "SELECT" || lableType == "INPUT" || lableType == "TEXTAREA"){
										
									}
									//存储当前条数据
									$(v).data("riskData",n);
									var objs = null;
									$.each(n.ruleCheckFields, function(k,j) {
										objs = $('[datariskcode = "'+j.pageFieldCode+'"]');
										objs.on(j.funEvent,function(){
												var riskData = n;
												if(j.funExecuted != "" && j.funExecuted !=undefined){
													eval(j.funExecuted);
												}else{
													eval(n.ruleImplJsCode);
												}
										});
									});
								}
							});
						});
						sysCommon.riskData = data.data;
						//调用风险灯点击事件
						sysCommon.riskMsgClickEvent(modelFlag);
					}
				}
			});
	},
	/**
	 * 
	 * 风险灯点击事件
	 * 
	 */
    riskMsgClickEvent:function(modelFlag){
    	//风险灯点击事件
		$(modelFlag).find(".risk-model").off().on("click",function(){
			//调用根据风险code显示提示信息方法
			sysCommon.showRiskMsg($(this).find(".hid-risk-code").val());
			
		});
    },
	/**
	 * 
	 * 根据风险code显示提示信息
	 * @param {Object} riskCode 风险code
	 */
	showRiskMsg:function(riskCode){
		//获取隐藏的风险code值
		$.each(sysCommon.riskData, function(i,n) {
			if(riskCode == n.pageFieldCode){
				//判断选中的值是否是费用明细弹出框中的,交通工具,住宿费,费用类型
				if(n.pageFieldCode == "costDetailVehicle" || n.pageFieldCode == "costDetailHotelCost"){
					//隐藏费用明细弹出框
					$("#cost-apply-model").hide();
				}
				//拼接提示信息政策法规标题加上正文加上关键字
				var  riskMsg = '<div>'+n.lawsTitle + n.riskLawsContents + '<a class="yt-link risk-link">'+n.linkKeyWord+'</a></div>';
				riskMsg = $(riskMsg);
				riskMsg.find(".risk-link").data("riskLink",n.linkContents);
				$yt_alert_Model.alertOne({
					haveCloseIcon: true, //是否带有关闭图标  
					leftBtnName: "确定", //左侧按钮名称,默认确定  
					cancelFunction: "", //取消按钮操作方法*/  
					alertMsg:riskMsg, //提示信息  
					cancelFunction: function() {
						//判断选中的值是否是费用明细弹出框中的,交通工具,住宿费,费用类型
						if(n.pageFieldCode == "costDetailVehicle" || n.pageFieldCode == "costDetailHotelCost"){
							//显示费用明细弹出框
							$("#cost-apply-model").show();
							//显示顶部隐藏蒙层
							$("#heard-nav-bak,#pop-modle-alert").show();
							//调用显示全局蒙层的方法
				   			$yt_baseElement.showMongoliaLayer();
				   			//调用算取弹出框位置的方法
							$yt_alert_Model.getDivPosition($("#cost-apply-model"));
							//隐藏页面滚动条
							$("body").css("overflow","hidden");
						}
					},
				});
				
				
			}
		});
		//提示信息中的关键字点击事件
		$(".risk-link").on("click",function(){
			sysCommon.riskLinkModel($(this).data("riskLink"));
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
						   + '<td></td><td></td></tr>';
			$("#traffic-list-info tbody").append(totalRows);
		    }
		}
		//住宿费
	    if(tabObj == 1){
		  if($("#hotel-list-info tbody").find(".total-last-tr").length == 0){
			var totalRows = '<tr class="total-last-tr">'
         				  + '<td><span class="tab-font-blod">合计</span></td><td></td><td></td><td></td>'
          				  + '<td></td><td></td><td  class="font-right"><span class="tab-font-blod money-sum">0.00</span></td>'
          				  + '<td></td><td></td><td></td></tr>';
		 	$("#hotel-list-info tbody").append(totalRows);
		  } 
		}
	    //其他费用
	    if(tabObj == 2){
			 if($("#other-list-info tbody").find(".total-last-tr").length == 0){
				var totalRows = '<tr class="total-last-tr">'
	          				  + '<td><span class="tab-font-blod">合计</span></td>'
	          				  + '<td class="font-right"><span class="tab-font-blod money-sum">0.00</span></td>'
	          				  + '<td></td><td></td></tr>';
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
	          				  + '<td class="font-right tab-font-blod city-money-td"></td><td></td></tr>';
				$("#subsidy-list-info").append(totalRows);
			}
		}
	},
	/**
	 * 
	 * 
	 * 差旅报销明细填写Tab页切换事件
	 * 
	 * 
	 */
	costDetailModelTabEvent:function(){
		$("#costApplyAlert .cost-type-tab ul li").off().on("click",function(){
			//删除其他tab选中样式
			$(this).siblings().removeClass("tab-check");
			//给当前选中的tab添加选中样式
			$(this).addClass("tab-check");
			/**
			 * 判断选中的tab,显示对应的费用表单
			 */
			if($(this).hasClass("traffic-tab")){
				//显示交通费表单
				$(".traffic-form").show();
				$(".hotel-form,.other-form").hide();
				//清空验证信息
				$(".hotel-form,.other-form").find(".valid-font").text("");
				$(".hotel-form,.other-form").find(".valid-hint").removeClass("valid-hint");
			}else if($(this).hasClass("hotel-tab")){
				//显示住宿费表单
				$(".hotel-form").show();
				$(".traffic-form,.other-form").hide();
				//清空验证信息
				$(".traffic-form,.other-form").find(".valid-font").text("");
				$(".traffic-form,.other-form").find(".valid-hint").removeClass("valid-hint");
			}else{
				//显示住宿费表单
				$(".other-form").show();
				$(".traffic-form,.hotel-form").hide();
				//清空验证信息
				$(".traffic-form,.hotel-form").find(".valid-font").text("");
				$(".traffic-form,.hotel-form").find(".valid-hint").removeClass("valid-hint");
			}
		});
	},
	/**
	 * 
	 * 清空差旅报销明细弹出框中表单数据
	 * 
	 */
	clearFormData:function(){
		//获取弹出框对象
		var modelObj = $(".cost-detail-info-model");
		//清空输入框文本域内容
		$(".traffic-form input:not(.hid-risk-code),.hotel-form input:not(.hid-risk-code),.other-form input:not(.hid-risk-code)").val('');
		modelObj.find("textarea").val('');
		modelObj.find("select").each(function(i,n){
			$(n).find("option:eq(0)").attr("selected","selected");
		});
		//交通费二级菜单隐藏
		$("#vehicleTwoDiv").hide();
		//清空住宿费二级三级地点下拉列表
		modelObj.find("#hotelTwoAddres,#hotelChildAddres").html('').append('<option value="">请选择</option>');
		//初始化下拉列表
		modelObj.find("select").niceSelect();
		//入住天数默认值1
		modelObj.find(".yt-numberInput").val(1);
		//住宿费平均数
		modelObj.find("#peoDayMoney").text("0.00");
		//入住天数
		modelObj.find("#hotelDay").text("*");
		//tab标签初始
		$(".cost-type-tab ul li").removeClass("tab-check");
		$(".cost-type-tab ul li:eq(0)").addClass("tab-check");
		$(".traffic-form").show();
		$(".hotel-form,.other-form").hide();
		//显示加入列表按钮,隐藏确定按钮
		$("#model-add-list-btn").show();
		//显示确定按钮
		$("#model-sure-btn").hide();
		//将费用明细中的风险灯都改为红色
		modelObj.find(".risk-img").attr("src",sysCommon.riskExcMark);
		//清空验证信息
		modelObj.find(".valid-font").text("");
		modelObj.find(".valid-hint").removeClass("valid-hint");
	},
	/**
	 * 
	 * 获取出差申请,报销申请页面,差旅明细弹出框中出差人下拉列表
	 * 
	 */
	getBusiTripUsersSelData:function(){
		/**
		 * 
		 * 差旅费报销明细填写,城市交通费,住宿费中的出差人下拉列表
		 * 
		 */
		$.ajax({
				type: "post",
				url:"user/userInfo/getAllUserInfoByParams",
				async: false,
				success: function(data) {
					if(data.flag == 0){
						//option html
						var optionText = '<option value="">请选择</option>';
						if(data.data.length > 0){
							$.each(data.data, function(i,n) {
								optionText = '<option value="'+n.userItcode+'" data-level="'+n.jobLevelName+'">'+n.userName+'</option>';
								$("#model-trip-user").append(optionText);
								$("#hotel-trip-user").append(optionText);
							});
						  $("#model-trip-user,#hotel-trip-user").niceSelect();	
						}
						/**
						 * 
						 * 
						 * 差旅费报销明细填写城市交通费,出差人选择事件
						 * 
						 */
						$("#model-trip-user").on("change",function(){
						var userCode = $(this).val();
						if(userCode == ""){
							//改变风险灯红灯
							$(".vehicle-sel").parents("td").find(".risk-img").attr("src",sysCommon.riskWarImg);
						}else{
							//改变风险灯绿灯
							$(".vehicle-sel").parents("td").find(".risk-img").attr("src",sysCommon.riskViaImg);
							var userObj = sysCommon.getUserAllInfo("",userCode);
							var riskData = $(".vehicle-sel").parents("td").find(".hid-risk-code").data("riskData");
							//判断出差人
							if(userObj[userCode] !=undefined && userObj[userCode] !=""){
								var level =  userObj[userCode].jobLevelCode;
								var ruleFormImpl = eval("("+riskData.ruleFormImpl+")");
								if(ruleFormImpl[level]){
									//获取一级交通工具
									var vehicleOne = $(".vehicle-sel").val();
									var riskObj =  ruleFormImpl[level];
									//判断一级交通工具是否存在
									if(riskObj[vehicleOne] !=undefined){
										//获取二级交通工具
										var vehicleTwo = $(".vehicle-two-sel").val();
										//检索二级交通工具是否存在
										if($(".vehicle-two-sel option").length>0){
											if(riskObj[vehicleOne].indexOf(vehicleTwo) >-1 ){
												//绿灯
												$(".vehicle-sel").parents("td").find(".risk-img").attr("src",sysCommon.riskViaImg);
											}else{
												//红灯
												$(".vehicle-sel").parents("td").find(".risk-img").attr("src",sysCommon.riskWarImg);
											}
										}
									}else{
										$(".vehicle-sel").parents("td").find(".risk-img").attr("src",sysCommon.riskWarImg);
									}
								}else{
									//改变风险灯红灯
							  		$(".vehicle-sel").parents("td").find(".risk-img").attr("src",sysCommon.riskWarImg);
								}
							}
						}
					});
					}
				}
		});
	},
	/**
	 * 根据一级交通工具获取二级交通工具
	 * @param {Object} selVal 一级交通工具选中值
	 */
	vechicleChildData:function(selVal){
		$.ajax({
				type: "post",
				url:"basicconfig/dictInfo/getDictInfoByTypeCode",
				async: false,
				data:{
					dictTypeCode:selVal
				},
				success: function(data) {
					if(data.flag == 0){
						var veStr = "";
						$(".vehicle-two-sel").empty();
						veStr = '<option value="">请选择</option>';
						if(data.data.length > 0 ){
							//显示二级菜单
							$("#vehicleTwoDiv").show();
							$.each(data.data, function(i,n) {
								veStr = '<option value="'+n.value+'">'+n.disvalue+'</option>';
								$(".vehicle-two-sel").append(veStr);
							});
							$(".vehicle-two-sel").niceSelect();
							
						}else{
							//隐藏二级菜单
							$("#vehicleTwoDiv").hide();
							//判断一级交通工具是否为空
							if(selVal == ""){
							  //改变风险灯红灯
							  $(".vehicle-sel").parents("td").find(".risk-img").attr("src",sysCommon.riskWarImg);
							}else{
							  if($("#model-trip-user").val() !=""){
							  	//改变风险灯绿灯
							    $(".vehicle-sel").parents("td").find(".risk-img").attr("src",sysCommon.riskViaImg);
							  }
							}
						}
					}
				}
		});
	},
	/**
	 * 拼接暂无数据内容
	 * @param {Object} tdNum  列数
	 */
	noDataTrStr:function(tdNum){
		//暂无数据内容
		var noDataStr = '<tr style="border:0px;background-color:#fff !important;"><td  colspan="'+tdNum+'" align="center"style="border:0px;"><div class="no-data" style="width: 280px;margin: 0 auto;">' +
			'<img src="../../../../../resources-sasac/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
			'</div></td></tr>';
	    return noDataStr;
	},
	/**
	 * 
	 * 生成流程审批部门html代码方法
	 * @1.方法返回流程审批部分html字符串
	 * @2.调用时根据各自页面情况进行拼接
	 * 
	 */
	createFlowApproveMode:function(){
		var flowStr = '';
		    flowStr = '<div class="ordinar-div approve-div">'
		            + '<div class="label-title">'
		            + '<div class="title-model-sty">'
		            + '<img src="../../../../../resources-sasac/images/icons/flow-title-icon.png">'
		            + '<span class="title-text">流程审批</span>'
		            + '</div>'
		            + '<div class="title-line"><div></div></div>'
		            + '</div>';//流程审批标题部分结束
		            //字段部分开始
		            flowStr +='<div class="operation">'
		                    +'<div class="count-box" style="margin-left: 0px;padding-left: 0;padding-top: 0;">'
		                    +'<div class="form-label">'
		                    +'<label><span class="not-null">*</span>选择操作流程：</label>'
					        +'<select name="" id="operate-flow" risk-code-val="reimApplyOperFlow" class="oper-select" validform={isNull:true,msg:\'请选择操作流程\'} style="display: none;"><option value="">请选择</option></select>'
							+'<div class="valid-font" style="left: 105px;"></div>'
							+'</div>';//操作流程下拉列表结束
					
					flowStr +='<div class="form-label">'
							+'<label><span class="not-null">*</span>选择审批人：</label>'
							+'<select name="" risk-code-val="reimApplyApproveUsers" id="approve-users" class="oper-select" validform="{isNull:true,msg:\'请选择审批人\'}" style="display: none;"><option value="">请选择</option></select>'	
							+'<div class="valid-font" style="left: 92px;"></div>'
							+'</div>';//选择审批人下拉列表结束
					flowStr +='</div>';
					//操作意见	
					flowStr += '<div class="count-box" style="margin-left: 0px;padding-left: 0px;">'		
					        +'<div class="left">'
					        +'<span class="not-null opintion-msg-null" style="display: none;">*</span><span>操作意见：</span>'
							+'</div>'	
							+'<div class="right">'	
							+'<textarea id="opintion" risk-code-val="reimApplyFlowOperSug" class="yt-textarea" placeholder="请输入"style="resize: none;width: 98%;"></textarea>'
							+'<div class="valid-font"></div>'
							+'</div></div></div></div>';
		    return flowStr;
	},
	/**
	 * 获取操作流程和审批人数据
	 * @param {Object} businessCode    流程定义KEY
	 * @param {Object} processInstanceId 流程实例Id
	 * @param {Object} parameters 参数
	 */
	getApproveFlowData:function(businessCode,processInstanceId,parameters){
		/**
		 * 
		 * 操作流程下拉列表获取数据
		 * 
		 */
		 $.ajax({
				type: "post",
				url:"basicconfig/workFlow/getSubmitPageData",
				async: false,
				data:{
					processInstanceId:processInstanceId,
					parameters:parameters,
					businessCode:businessCode
				},
				success: function(data) {
					if(data.flag == 0){
						var optionText = '<option value="">请选择</option>';
						var dataList = [];
					    var dataObj = "";
						if(data.data.length > 0){
						  $.each(data.data, function(i,n) {
			 				for(var k in n){
			 					dataObj = eval("(" + k + ")");
			 					dataObj["approveUsers"] = n[k];
			 					dataList.push(dataObj);
						    }
						  });
						}
						//option html
						var optionText = '<option value="">请选择</option>';
						$("#operate-flow,#approve-users").empty();
						if(dataList.length > 0){
							$("#operate-flow,#approve-users").append(optionText);
							//遍历操作流程
							$.each(dataList, function(i,n) {
								optionText = '<option value="'+n.nextCode+'">'+n.nextName+'</option>';
								$("#operate-flow").append(optionText);
							});
						  $("#operate-flow,#approve-users").niceSelect();	
						  //操作流程选择事件
						  $("#operate-flow").on("change",function(){
						  	//判断如果是一下操作给操作意见字段加上必填验证
						  	//退回到指定节点	returnedTask
							//退回上一步审批人	returnedUp
							//退回提交人	returnedSubmit
							//拒绝审批	refusedToApproval
						  	if($(this).val() == "returnedSubmit" || $(this).val() == "returnedTask" || $(this).val() == "returnedUp" || $(this).val() == "refusedToApproval"){
						  		//显示必填标识
						  		$(".not-null.opintion-msg-null").show();
						  		$("#opintion").attr("validform","{isNull:true,blurFlag:true,msg:'请填写操作意见'}");
						  	}else{
						  		//隐藏必填标识
						  		$(".not-null.opintion-msg-null").hide();
						  		//清空验证标识
						  		$("#opintion").attr("validform","''").removeClass("valid-hint");
						  		$("#opintion").parent().find(".valid-font").text('');
						  	}
						  	 //调用根据选择的审批流程获取审批人方法
						  	 sysCommon.getApproveUsersByFlow(dataList,$(this).val());
						  });
						}else{
							$("#operate-flow,#approve-users").append(optionText);	
						}
					}
				}
		});
	},
	/**
	 * 根据选择的审批流程获取审批人
	 * @param {Object} flowData  审批流程数据
	 * @param {Object} nextOperCode 审批操作code
	 */
    getApproveUsersByFlow:function(flowData,nextOperCode){
    	var optionText = '<option value="">请选择</option>';
    	$("#approve-users").append(optionText);
    	$.each(flowData, function(i,n) {
    		if(n.nextCode == nextOperCode){
    			$("#approve-users").parents("td").prev().find("div").show();
				$("#approve-users").parent().show();
    			//获取审批人信息
				if(n.approveUsers.length > 0){
					$("#approve-users").empty();
					$("#approve-users").parents("td").prev().find("div").show();
					$("#approve-users").parent().show();
					$.each(n.approveUsers, function(i,v) {
					   optionText = '<option value="'+v.userCode+'">'+v.userName+'</option>';
					   $("#approve-users").append(optionText);
					});
					$("#approve-users").attr("validform","{isNull:true,msg:'请选择审批人'}");
				}else{
					$("#approve-users").append(optionText);
					$("#approve-users").niceSelect();
					$("#approve-users").parents("td").prev().find("div").hide();
					$("#approve-users").parent().hide();
					$("#approve-users").attr("validform","{isNull:false,msg:'请选择审批人'}");
				}
				return false;
    		}else{
    			$("#approve-users").append(optionText);
				$("#approve-users").niceSelect();
				$("#approve-users").parents("td").prev().find("div").hide();
				$("#approve-users").parent().hide();
				$("#approve-users").attr("validform","{isNull:false,msg:'请选择审批人'}");
    		}
    	});
    	$("#approve-users").niceSelect();
    },
	/**
	 * 
	 * 表格金额合计更新
	 * 
	 * @param {Object} thisTab费用表格标识0交通费1.住宿费2.其他费用3补助
	 * 
	 * 
	 */
	updateMoneySum:function(thisTab){
		//thisTab参数0交通费1.住宿费2.其他费用3补助
		var moenySum = 0.00;
		if(thisTab == 0){
			$("#traffic-list-info tbody .money-td").each(function(i,n){
				moenySum += parseFloat($yt_baseElement.rmoney($(n).text()));
			});
			moenySum = $yt_baseElement.fmMoney(moenySum);
			if(moenySum != undefined && $yt_baseElement.rmoney(moenySum) >0){
			 $("#traffic-list-info tbody .money-sum").text(moenySum);
			}else{
			 $("#traffic-list-info tbody .money-sum").text("0.00");
			}
		}
		if(thisTab == 1){
			$("#hotel-list-info tbody .money-td").each(function(i,n){
				moenySum += parseFloat($yt_baseElement.rmoney($(n).text()));
			});
			moenySum = $yt_baseElement.fmMoney(moenySum);
			if(moenySum != undefined && $yt_baseElement.rmoney(moenySum) >0){
			 $("#hotel-list-info tbody .money-sum").text(moenySum);
			}else{
			 $("#hotel-list-info tbody .money-sum").text("0.00");
			}
		}
		if(thisTab == 2){
			$("#other-list-info tbody .money-td").each(function(i,n){
				moenySum += parseFloat($yt_baseElement.rmoney($(n).text()));
			});
			moenySum = $yt_baseElement.fmMoney(moenySum);
			if(moenySum != undefined && $yt_baseElement.rmoney(moenySum) >0){
			 $("#other-list-info tbody .money-sum").text(moenySum);
			}else{
			$("#other-list-info tbody .money-sum").text("0.00");
			}
		}
		if(thisTab == 3){
			$("#subsidy-list-info tbody .food-money").each(function(i,n){
				moenySum += parseFloat($yt_baseElement.rmoney($(n).text()));
			});
			moenySum = $yt_baseElement.fmMoney(moenySum);
			if(moenySum != undefined && $yt_baseElement.rmoney(moenySum) >0){
			  $("#subsidy-list-info tbody .money-sum").text(moenySum);
			}else{
			  $("#subsidy-list-info tbody .money-sum").text("0.00");
			}
			var cityMoneySum = 0.00;
			$("#subsidy-list-info tbody .city-money").each(function(i,n){
				cityMoneySum += parseFloat($yt_baseElement.rmoney($(n).text()));
			});
			cityMoneySum = $yt_baseElement.fmMoney(cityMoneySum);
			if(cityMoneySum != undefined && $yt_baseElement.rmoney(cityMoneySum) >0){
			  $("#subsidy-list-info tbody .city-money-td").text(cityMoneySum);
			}else{
			  $("#subsidy-list-info tbody .city-money-td").text("0.00");
			}
		}
		//调用刷新申请总预算金额的方法
		sysCommon.updateApplyMeonySum();
	},
	/**
	 * 
	 * 刷新申请预算总金额方法
	 * 
	 */
	updateApplyMeonySum:function(){
		var  sumMoney = 0 ;
		$(".cost-list-model table .money-sum").each(function(i,n){
			sumMoney += $yt_baseElement.rmoney($(n).text());
		});
		$(".cost-list-model table .city-money-td").each(function(i,n){
			sumMoney += $yt_baseElement.rmoney($(n).text());
		});
		 sumMoney =  $yt_baseElement.fmMoney(sumMoney);
		$("#applySumMoney").text(sumMoney);
		//判断当前页面是否包含报销申请页面中,补领金额中的报销金额
		if($("body").find("#reimPrice")){
		    $("#reimPrice").text(sumMoney);
		    //计算补领金额
		    var loanPrice = $("#loanCost").text();
		    var replPrice = $yt_baseElement.rmoney(sumMoney) - parseFloat(loanPrice);
		    replPrice = $yt_baseElement.fmMoney(replPrice);
		    $("#givePrice").text(replPrice);
		}
		if(sumMoney !=null && sumMoney !=undefined && $yt_baseElement.rmoney(sumMoney) > 0){
			var sumMoneyLower = arabiaToChinese(sumMoney);
		    $("#applyMoneyLower").text(sumMoneyLower);
		}else{
			$("#applySumMoney").text("0.00");
		}
	},
	/**
	 * 
	 * 
	 * 获取登录用户信息
	 * 
	 */
	getLoginUserInfo:function(){
		$("#busiUsers").text($yt_common.user_info.userRealName);
		$("#deptName").text($yt_common.user_info.deptName);
		$("#jobName").text($yt_common.user_info.posiNaming==""?"--":$yt_common.user_info.positionName);
		$("#telPhone").text($yt_common.user_info.userPhone==""?"--":$yt_common.user_info.userPhone);
	},
	/**
	 *  关闭可编辑弹出框方法
	 * @param {Object} thisObj 当前弹出框对象
	 */
	closeModel:function(thisObj){
		//隐藏弹框
		thisObj.hide();
		//隐藏顶部隐藏蒙层
		$("#heard-nav-bak").hide();
		$('#pop-modle-alert').hide();
		//调用隐藏全局蒙层的方法
	    $yt_baseElement.hideMongoliaLayer();
	    //显示页面滚动条
		$("body").css("overflow","auto");
	},
	/**
	 * 
	 * 显示可编辑弹出框方法
	 * @param {Object} thisObj 当前弹出框对象
	 */
	showModel:function(thisObj){
		//显示顶部隐藏蒙层
		$("#heard-nav-bak,#pop-modle-alert").show();
		//调用显示全局蒙层的方法
		$yt_baseElement.showMongoliaLayer();
		//显示弹框
		thisObj.show();
		$(thisObj).find("tbody tr").removeClass("yt-table-active");
		//调用算取弹出框位置的方法
		$yt_alert_Model.getDivPosition(thisObj);
		//隐藏页面滚动条
		$("body").css("overflow","hidden");
	},
    /**
     * 
     * 
     * 风险提示信息中的关键字点击弹出框
     * 
     */
    riskLinkModel:function(linkCont){
    	var linkModel = '<div class="link-cont-model"><div>'+linkCont+'</div><div>'
    	              +'<div class="yt-alert-one-bottom"><input type="button" class="yt-model-bot-btn yt-model-sure-btn" id="linkCloseBtn" value="关闭"></div>';
    	              +'</div></div>';
    	$("body").append(linkModel);
        sysCommon.showModel($(".link-cont-model"));
        //点击关闭按钮
        $("#linkCloseBtn").off().on("click",function(){
        	$(".link-cont-model").remove();
        });
         //调用生成滚动条方法  
        $(".link-cont-model").mCustomScrollbar(); 
    },
    /**
     * 
     * 
     * 从json文件中获取地址信息
     * 返回地址集合
     */
    getAddressInfoList:function(){
    	var  dataList  = "";
    	$.ajax({
			type: "get",
			url:$yt_option.websit_path+'resources-sasac/js/system/expensesReim/module/reimApply/regionList.json',
			async: false,
			success: function(data) {
				dataList = data ;
			}
		});
		return dataList;
    },
    /**
     * 
     * 
     * 从json文件中获取热门城市信息
     * 
     */
    getHotCityList:function(){
    	var  dataList  = "";
    	$.ajax({
			type: "get",
			url:$yt_option.websit_path+'resources-sasac/js/system/expensesReim/module/reimApply/hotCityList.json',
			async: false,
			success: function(data) {
				dataList = data ;
			}
		});
		return dataList;
    },
    /**
	 * 加载区域的页面操作代码
	 * @param {Object} url      页面路径
	 */
	loadingWord: function(url) {
		//判断传输的url路径
		if(url.indexOf("http://") != 0) {
			url = $yt_option.websit_path + url;
		}
		$yt_common.request_params = new Object();
		//截取url路径
		if(url.indexOf("?") != -1) {
			var str = url.substr(url.indexOf("?") + 1);
			strs = str.split("&");
			for(var i = 0; i < strs.length; i++) {
				$yt_common.request_params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
			}
		} else {
			$yt_common.request_params = null;
		}
		$("#indexMainDiv").html("");
		//走ajax加载页面
		$.ajax({
			type: "get",
			url: url,
			async: false,
			success: function(data) {
				$("#indexMainDiv").html(data);
				//$(window).scrollTop(0);
			}
		});
	},
	/*流程日志提示信息方法
	 * logQtipObj:jquery 对象集合
	 * 注意 ：必须在table内，每行要有类名为  processInstanceId  的   input
	 * 调用方法：sysCommon.initQtip($('.log-mod'));
	 * */
	initQtip:function(logQtipObj){
		//注意：以下配置参数如无特别说明均为默认，使用时只需配置相关参数即可  
        logQtipObj.qtip({  
            // 默认为事件触发时加载，设置为true时，会在页面加载时加载提示 类型：boolean，true, false (默认: false)  
            // prerender: false,  
            // 为提示信息设置id，如设置为myTooltip就可以通过ui-tooltip-myTooltip访问这个提示信息  类型:"String", false (默认: false)  
            // id: false,  
            // 每次显示提示都删除上一次的提示  类型：boolean，true, false (默认: true)  
            // overwrite: true,  
            // 通过元素属性创建提示  如a[title]，把原有的title重命名为oldtitle  类型：boolean，true, false (默认: true)  
            // suppress: true,  
            // 内容相关的设置     
            content: {  
                // 提示信息的内容，如果只设置内容可以直接 content: "提示信息"，而不需要 content: { text: { "提示信息" } }    
                text: function(event,api) {  
                    //var txt = $(this).text();  
                    //return txt || '';  
                    var txt = '';
					var WorkFlowLogList = [];
					//获取当前行
					var td = $(this).parent("td").prevAll("td");
					//获取当前行的日志id
					var processInstanceId = td.find('.processInstanceId').val();
					//调用获取流程日志的接口
					$.ajax({
						type: "post",
						url: "basicconfig/workFlow/getWorkFlowLog",
						async: false,
						data: {
							processInstanceId: processInstanceId
						},
						success: function(data) {
							if(data.data != undefined && data.data != null) {
								WorkFlowLogList = data.data;
							}
							//判断数据是否为空
							if(WorkFlowLogList == null || WorkFlowLogList == undefined) {
								return;
							}
							shomd = "";
							shomd = '<div class="suspension" >';
							var WorkFlowLog;
							for(var i = 0; i < WorkFlowLogList.length; i++) {
								WorkFlowLog = WorkFlowLogList[i];
								/*数据的第一条分为审批中和其他的两种显示日志*/
								if(i == 0) {
									//显示的内容设置
									shomd += '<div class="log-msg-model">'
									      +'<div><div class="first-log-msg"><span class="log-num">'+(WorkFlowLogList.length-i)+'</span></div><span class="user-name">【'+ (WorkFlowLog.taskName == '' ? '' : WorkFlowLog.taskName) +'】'+(WorkFlowLog.userName == "" ? '无' : WorkFlowLog.userName) +'</span><div style="clear:both;"></div></div>'
									      +'<div class="log-line-div" style="'+(i == (WorkFlowLogList.length-1) ? "padding-bottom: 0px;":"padding-bottom: 10px;")+''+(WorkFlowLogList.length == 1?"border:0px;":"")+'"><div style="'+(WorkFlowLogList.length == 1?"border:0px;":"border-bottom: 1px solid #D6E6F3;")+'">'
									      +'<div class="oper-status-model"><label class="log-label-text">操作状态</label><span>：</span><span>'+(WorkFlowLog.operationState == "" ? "无" : WorkFlowLog.operationState)+'</span></div>'
									      +'<div class="oper-time-model"><label class="log-label-text">操作时间</label><span>：</span><span>'+(WorkFlowLog.commentTime == "" ? "无" : WorkFlowLog.commentTime)+'</span></div>';
									      /**
									       *判断操作意见是否为空,为空不显示
									       */
									      if(WorkFlowLog.comment != "" && WorkFlowLog.comment != null && WorkFlowLog.comment != " "){
									      	shomd +='<div class="log-comment-model"><label class="log-label-text">操作意见</label><span>：</span><span class="oper-comment-msg">'+(WorkFlowLog.comment == '' ? '' : WorkFlowLog.comment)+'</span></div>';
									      }
									     shomd +='</div></div>';

								} else {
									/*其他人的意见循环,一种格式*/
									shomd += '<div class="log-msg-model">'
									      +'<div><div class="log-msg-def-bak"><span class="log-num">'+(WorkFlowLogList.length-i)+'</span></div><span class="user-name" style="top:0px;">【'+ (WorkFlowLog.taskName == '' ? '' : WorkFlowLog.taskName) +'】'+(WorkFlowLog.userName == "" ? '无' : WorkFlowLog.userName) +'</span><div style="clear:both;"></div></div>'
									      +'<div class="log-line-div" style="'+(i == (WorkFlowLogList.length-1) ? "padding-bottom: 0px;":"padding-bottom: 10px;")+''+( i == (WorkFlowLogList.length-1) ? "border:0px;":"")+'"><div style="'+( i == (WorkFlowLogList.length-1) ? "border:0px;":"border-bottom: 1px solid #D6E6F3;")+'">'
									      +'<div class="oper-status-model"><label class="log-label-text">操作状态</label><span>：</span><span>'+(WorkFlowLog.operationState == "" ? "无" : WorkFlowLog.operationState)+'</span></div>'
									      +'<div class="oper-time-model"><label class="log-label-text">操作时间</label><span>：</span><span>'+(WorkFlowLog.commentTime == "" ? "无" : WorkFlowLog.commentTime)+'</span></div>';
									      /**
									       *判断操作意见是否为空,为空不显示
									       */
									      if(WorkFlowLog.comment != "" && WorkFlowLog.comment != null && WorkFlowLog.comment != " "){
									      	shomd +='<div class="log-comment-model"><label class="log-label-text">操作意见</label><span>：</span><span class="oper-comment-msg">'+(WorkFlowLog.comment == '' ? '' : WorkFlowLog.comment)+'</span></div>';
									      }
									      shomd+='</div></div>';
								}
								shomd += '</div>';
							}
						}
					});
					return(WorkFlowLogList.length < 1 ? '<span style="color:#999">暂无数据</span>' : shomd); /*设置显示内容*/
                }
            },  
            // 位置相关的设置    
            position: { 
            	// 提示信息的位置    
                // 如提示的目标元素的右下角(at属性)    
                // 对应 提示信息的左上角(my属性)    
                my: 'right top',//提示信息箭头位置
				at: 'left top',//提示信息相对于当前td的位置
				//提示的目标元素，默认为选择器  也可以设置为“mouse”或“event”（在目标的位置触发的工具提示），或一个数组包含一个绝对的X / Y的位置  
				//target: false,
				//提示信息默认添加到的容器   false (默认: document.body)  
				container: false,
				//使提示信息在指定目标内可见，不会超出边界 
				viewport: false,
				adjust: {
					// 提示信息位置偏移
					x: 8,
					y: 8,
					//是否在鼠标悬停时提示 true, false (默认: true)
					mouse: true,
					//是否可以调整提示信息的位置
					resize: true,
					method: 'flip flip'
				},
            },  
            // 隐藏提示的相关设置  参考show  
            hide: {  
                /*在提示框显示时可以进行交互*/
				fixed: true,
				//event:"click"
            },  
            // 样式相关    
            style: {  
                /*自定义提示框类样式 多个类样式以空格分割*/
				classes: 'showmod',
				/*tip插件，箭头相关设置*/
				tip: {
					corner: true,//是否显示箭头
					mimic: false,//定义箭头的角度 如 “right center”默认false 
					width: 10, //箭头的宽度 
					height: 10, //箭头的高度 
					border: true,//是否有边框  
					offset: 0, //确定尖端相对于其当前拐角位置的偏移量 Integer (默认: 0)
				}
            },  
            // 事件对象确定绑定到工具提示的初始事件处理程序  
            events: {  
            	//当工具提示显示由库本身或用户调用适当的切换或显示API方法时被触发 
                show:function (data){
					$(data.target).find(".qtip-content").css("max-height",$('#frame-right-model').height()-200);
				}
            }  
        }); 
	},
	/* *
	 * 详情页流程日志
	 * 参数：processInstanceId（日志id） 
	 * 返回值：流程日志的html
	 * */
	getCommentByProcessInstanceId:function(processInstanceId){
		var flowLogHtml='<div class="flow-div flow-log">';
		$.ajax({
			type: "post",
			url: "basicconfig/workFlow/getWorkFlowLog",
			async: false,
			data: {
				processInstanceId:processInstanceId
			},
			success: function(data) {
				var txt = '';
				if(!!data && data.flag == '0') {
					//数据列表
					var list = data.data || [];
					sysCommon.processState = list;
					var imgUrl = "";
					for(var i = 0, len = list.length; i < len; i++) {
						if(i == 0) {
							imgUrl = "../../../../../resources-sasac/images/common/log-border-color.png";
						} else {
							imgUrl = "../../../../../resources-sasac/images/common/log-info-border.png";
						}
						//首行
						txt += '<div class="log-info">' +
							(i == list.length - 1 ? '' : '<div class="log-icon-border"></div>') +
							'<div class="log-icon">' +
							'<img src="' + (list.length == 1 ? '../../../../../resources-sasac/images/common/num-icon-one.png' : (i == 0 ? '../../../../../resources-sasac/images/common/log-num-first.png' : '../../../../../resources-sasac/images/common/log-num.png')) + '" />' +
							'<div class="log-icon-num" ' + (i == 0 ? 'style="top: 7px;"' : '') + '>' + (list.length - i) + '<div></div></div>' +
							'</div>' +
							'<div class="log-details ' + (i == 0 ? "log-shadow-sty" : "") + '" ' + ((list[i].comment == undefined || list[i].comment == null || list[i].comment == "") ? 'style="padding-bottom: 30px;"' : '') + '>' +
							'<label class="log-task-name">【'+ list[i].taskName +'】</label>'+
							'<label class="log-name">' + list[i].userName + '</label>' +
							'<img style="' + (i == 0 ? "left: -9px;" : "left:-8px;") + '" src="' + imgUrl + '"/>' +
							'<div>' +
							'<p><label class="log-title">操作状态：</label><span class="log-state">' + list[i].operationState + '</span></p>' +
							((list[i].comment == undefined || list[i].comment == null || list[i].comment == "") ? '' : ('<p class="log-ideap"><label class="log-title">操作意见：</label><label class="log-idea">' + list[i].comment + '</label></p>')) +
							'</div>' +
							'</div>' +
							'<label class="log-time">' + list[i].commentTime + '</label>' +
							'</div>';
					}
					flowLogHtml += txt + '</div>';
				}
			}
		});
		return flowLogHtml;
	},
	/* *
	 * 
	 *获取流程图弹窗
	 *参数：processInstanceId （日志id）
	 *
	 * */
	processStatePop: function(processInstanceId) {
		//页面添加弹窗
		var popHtml='<div class="yt-pop-model yt-edit-alert process-state-pop">'+
			'<div class="model-title">'+
			'<span class="yt-edit-alert-icon"><img src="../../../../../resources-sasac/images/common/loop.png"></span>'+
			'<span class="yt-edit-alert-title-msg">当前状态</span>'+
			'</div>'+
			'<!--主体内容部分START-->'+
			'<div class="yt-edit-alert-main cont-edit-test">'+
			'<div class="imgBox">'+
			'</div>'+
			'<!--底部按钮操作区域START-->'+
			'<div class="model-bottom-btn">'+
			'<button class="yt-option-btn yt-cancel-btn canel-btn" id="" style="margin-left: 10px;">关闭</button>'+
			'</div>'+
			'</div>'+
			'</div>';
		$("body").append(popHtml);
		var thisPop=$(".yt-edit-alert.process-state-pop");
		//弹窗处理
		sysCommon.showModel(thisPop);//公共显示弹窗方法
		$yt_alert_Model.getDivPosition(thisPop);//调用算取div显示位置方法
		// 流程图查询
		$('.imgBox').html('<img src="' + $yt_option.workFlow + 'findPngByProcessInstanceId?processInstanceId=' + processInstanceId + '">');
		// 点击取消方法 
		thisPop.on("click",".canel-btn", function() {
			sysCommon.closeModel(thisPop);
			thisPop.remove();//移除流程弹窗方法
		});
	},
}
var EventUtil = {
 // 添加事件监听 
 add: function(element, type, callback){
  if(element.addEventListener){
   element.addEventListener(type, callback, false);
  } else if(element.attachEvent){
   element.attachEvent('on' + type, callback);
  } else {
   element['on' + type] = callback;
  }
 },
  
 // 移除事件监听
 remove: function(element, type, callback){
  if(element.removeEventListener){
   element.removeEventListener(type, callback, false);
  } else if(element.detachEvent){
   element.detachEvent('on' + type, callback);
  } else {
   element['on' + type] = null;
  }
  
 },
 // 跨浏览器获取 event 对象
 getEvent: function(event){
   
  return event ? event : window.event;
 },
  
 // 跨浏览器获取 target 属性
 getTarget: function(event){
    
  return event.target || event.srcElement;
 },
  
 // 阻止事件的默认行为
 preventDefault: function(event){
   
  if(event.preventDefault){
   event.preventDefault();
  } else {
   event.returnValue = false;
  }
 },
  
 // 阻止事件流或使用 cancelBubble
 stopPropagation: function(){
    
  if(event.stopPropagation){
   event.stopPropagation();
  } else {
   event.cancelBubble = true;
  }
 }
};
/**
 *金额转换成中文大写方法
 * @param {Object} Num 金额数字
 */
function arabiaToChinese(Num) {
	Num = Num+"";
	for(i = Num.length - 1; i >= 0; i--) {
		Num = Num.replace(",", "") //替换tomoney()中的“,”
		Num = Num.replace(" ", "") //替换tomoney()中的空格
	}
	Num = Num.replace("￥", "") //替换掉可能出现的￥字符
	if(isNaN(Num)) { //验证输入的字符是否为数字
		$yt_alert_Model.prompt("请检查小写金额是否正确", 2000);  
		return;
	}
	//---字符处理完毕，开始转换，转换采用前后两部分分别转换---//
	part = String(Num).split(".");
	newchar = "";
	//小数点前进行转化
	for(i = part[0].length - 1; i >= 0; i--) {
		if(part[0].length > 10) { $yt_alert_Model.prompt("位数过大，无法计算", 2000); return ""; } //若数量超过拾亿单位，提示
		tmpnewchar = ""
		perchar = part[0].charAt(i);
		switch(perchar) {
			case "0":
				tmpnewchar = "零" + tmpnewchar;
				break;
			case "1":
				tmpnewchar = "壹" + tmpnewchar;
				break;
			case "2":
				tmpnewchar = "贰" + tmpnewchar;
				break;
			case "3":
				tmpnewchar = "叁" + tmpnewchar;
				break;
			case "4":
				tmpnewchar = "肆" + tmpnewchar;
				break;
			case "5":
				tmpnewchar = "伍" + tmpnewchar;
				break;
			case "6":
				tmpnewchar = "陆" + tmpnewchar;
				break;
			case "7":
				tmpnewchar = "柒" + tmpnewchar;
				break;
			case "8":
				tmpnewchar = "捌" + tmpnewchar;
				break;
			case "9":
				tmpnewchar = "玖" + tmpnewchar;
				break;
		}
		switch(part[0].length - i - 1) {
			case 0:
				tmpnewchar = tmpnewchar + "元";
				break;
			case 1:
				if(perchar != 0) tmpnewchar = tmpnewchar + "拾";
				break;
			case 2:
				if(perchar != 0) tmpnewchar = tmpnewchar + "佰";
				break;
			case 3:
				if(perchar != 0) tmpnewchar = tmpnewchar + "仟";
				break;
			case 4:
				tmpnewchar = tmpnewchar + "万";
				break;
			case 5:
				if(perchar != 0) tmpnewchar = tmpnewchar + "拾";
				break;
			case 6:
				if(perchar != 0) tmpnewchar = tmpnewchar + "佰";
				break;
			case 7:
				if(perchar != 0) tmpnewchar = tmpnewchar + "仟";
				break;
			case 8:
				tmpnewchar = tmpnewchar + "亿";
				break;
			case 9:
				tmpnewchar = tmpnewchar + "拾";
				break;
		}
		newchar = tmpnewchar + newchar;
	}
	//小数点之后进行转化
	if(Num.indexOf(".") != -1) {
		if(part[1].length > 2) {
//			$yt_alert_Model.prompt("小数点之后只能保留两位,系统将自动截段", 2000);  
			part[1] = part[1].substr(0, 2)
		}
		for(i = 0; i < part[1].length; i++) {
			tmpnewchar = ""
			perchar = part[1].charAt(i)
			switch(perchar) {
				case "0":
					tmpnewchar = "零" + tmpnewchar;
					break;
				case "1":
					tmpnewchar = "壹" + tmpnewchar;
					break;
				case "2":
					tmpnewchar = "贰" + tmpnewchar;
					break;
				case "3":
					tmpnewchar = "叁" + tmpnewchar;
					break;
				case "4":
					tmpnewchar = "肆" + tmpnewchar;
					break;
				case "5":
					tmpnewchar = "伍" + tmpnewchar;
					break;
				case "6":
					tmpnewchar = "陆" + tmpnewchar;
					break;
				case "7":
					tmpnewchar = "柒" + tmpnewchar;
					break;
				case "8":
					tmpnewchar = "捌" + tmpnewchar;
					break;
				case "9":
					tmpnewchar = "玖" + tmpnewchar;
					break;
			}
			if(i == 0) tmpnewchar = tmpnewchar + "角";
			if(i == 1) tmpnewchar = tmpnewchar + "分";
			newchar = newchar + tmpnewchar;
		}
	}
	//替换所有无用汉字
	while(newchar.search("零零") != -1)
		newchar = newchar.replace("零零", "零");
	newchar = newchar.replace("零亿", "亿");
	newchar = newchar.replace("亿万", "亿");
	newchar = newchar.replace("零万", "万");
	newchar = newchar.replace("零元", "元");
	newchar = newchar.replace("零角", "");
	newchar = newchar.replace("零分", "");
	if(newchar.charAt(newchar.length - 1) == "元" || newchar.charAt(newchar.length - 1) == "角")
		newchar = newchar + "整";
		//处理如果是无内容的给出--
		if(newchar == "元整"){
			newchar = "--";
		}
	//  document.write(newchar);
	return newchar;
};

$.fn.extend({
	showImg: function(obj) {
		var imgId = 'show-img-box' + (parseInt(Math.random() * 1000000000));
		var imgs = $(this);
		imgs.addClass(imgId);
		imgs.off().on("click", function() {
			var ulMl = $("#" + imgId).find("li").width() * imgs.index($(this)) * -1;
			if($("#" + imgId).length > 0) {
				$("#" + imgId).find("ul").css("margin-left", ulMl + "px");
				$("#" + imgId).show();
				$('#pop-modle-alert').show();
			} else {
				var wHeigth = $(window).height();
				var wWidth = $(window).width();
				if(wWidth / wHeigth > 20 / 13) {
					wWidth = Math.floor(wHeigth * 20 / 13 - 200);
				} else {
					wWidth = wWidth - 100;
				}
				var bannerWidth = Math.floor(wWidth * 0.8);
				var hannerHeight = Math.floor(bannerWidth * 13 / 20);

				var imgsElement = $('<div id="' + imgId + '" class="show-img-box"><a class="prev"></a><a class="next"></a></div>');

				$("body").append(imgsElement);

				var closeElement = $('<a class="close-btn" src="img/icons/atta-x.png"></a>');
				var imgBox = $('<div class="imgs-list"></div>');
				imgBox.css({
					width: bannerWidth,
					height: hannerHeight
				});
				closeElement.click(function() {
					$("#" + imgId).hide();
					$('#pop-modle-alert').hide();
				});
				imgsElement.append(closeElement).append(imgBox);
				var imgListEle = $('<ul style="width: ' + ($("." + imgId).length * bannerWidth) + 'px;"></ul>');
				imgListEle.css("margin-left", ulMl + "px");
				$("." + imgId).each(function() {
					var img = new Image();
					var imgLi = $('<li></li>').append(img);
					imgLi.css({
						width: bannerWidth,
						height: hannerHeight
					});
					//img.style='width:'+bannerWidth+'px;';
					img.draggable = false;
					img.src = $(this).attr('src');
					img.name = 'viewImg';
					var meImg = imgLi.find("img");
					img.onload = function() {
						if(img.width / img.height > 20 / 13) {
							$(meImg).css("width", "100%");
						} else {
							$(meImg).css("height", "100%");
						}
					};
					imgListEle.append(imgLi);
				});
				imgBox.append(imgListEle);
				ulMl = imgsElement.find("li").width() * imgs.index($(this)) * -1;
				imgsElement.find("ul").css("margin-left", ulMl + "px");
				imgsElement.find(".next").click(function() {
					$(this).siblings(".imgs-list").find("ul").stop(true, true);
					var bannerWidth = $(this).siblings(".imgs-list").find("li").width();
					var bannerUlWidth = $(this).siblings(".imgs-list").find("ul").width();
					var ulLeft = $(this).siblings(".imgs-list").find("ul").css("margin-left");
					var nextUlLeft = parseInt(ulLeft.replace("px", "").replace("PX", "")) - bannerWidth;

					if(nextUlLeft > bannerUlWidth * -1) {
						$(this).siblings(".imgs-list").find("ul").animate({
							marginLeft: nextUlLeft
						}, 500, function() {/*
							$("#" + imgId).find("li img").css({
								'width': 'auto',
								'height': 'auto',
								'left': 0,
								'right': 0,
								'top': 0,
								'bottom': 0
							});

						*/});
						/*	$(".banner-main .tb-btn a.active").next().addClass("active");
							$(".banner-main .tb-btn a.active:eq(0)").removeClass("active");*/
					}

				});
				imgsElement.find(".prev").click(function() {
					$(this).siblings(".imgs-list").find("ul").stop(true, true);
					var bannerWidth = $(this).siblings(".imgs-list").find("li").width();
					var ulLeft = $(this).siblings(".imgs-list").find("ul").css("margin-left");

					var nextUlLeft = parseInt(ulLeft.replace("px", "").replace("PX", "")) + bannerWidth;
					console.log(nextUlLeft);
					if(nextUlLeft <= 10) {
						$(this).siblings(".imgs-list").find("ul").animate({
							marginLeft: nextUlLeft
						}, 500, function() {/*
							$("#" + imgId).find("li img").css({
								'width': 'auto',
								'height': 'auto',
								'left': 0,
								'right': 0,
								'top': 0,
								'bottom': 0
							});

						*/});
						/*$(".banner-main .tb-btn a.active").prev().addClass("active");
						$(".banner-main .tb-btn a.active:eq(1)").removeClass("active");*/
					}
				});
				imgsElement.show();
				$('#pop-modle-alert').show();
			}
			//$("#" + imgId).find("li img").zoomMarker();
		});
	}
});
