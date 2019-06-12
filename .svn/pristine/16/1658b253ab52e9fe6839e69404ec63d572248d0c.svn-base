var search="";//标识学员费用清单是搜索查询
var projectDetails = {
	//初始化方法
	costOldMoney:'',
	init: function() {
		//获取页面跳转传过来的值
		var pkId = $yt_common.GetQueryString("pkId");
		var projectCode = $yt_common.GetQueryString("projectCode");
		var projectType = $yt_common.GetQueryString("projectType");
		if(projectType==3 || projectType==2 || projectType==1){
			$(".other-income-btn").hide();
		}
		//点击返回
		$('.page-return-btn').click(function(){
			window.location.href = "projectSettlementList.html?pageIndexs="+$yt_common.GetQueryString('pageIndexs');
		});
		//调用获取列表数据方法
		projectDetails.getStudetListInfo();
		$(".settlement-tbody").on("click",".project-name", function() {
			window.location.href = "projectSettlementList.html";
		});
		//导出项目收入
		$(".out-file").click(function(){
			projectDetails.getOutFile();
		});
		//初始化入住时间
			$(".in-Date-hh").calendar({  
				speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
				complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
				readonly: true, // 目标对象是否设为只读，默认：true     
				lowerLimit: "2010/01/01", // 日期下限，默认：NaN(不限制)     
				nowData:true,//默认选中当前时间,默认true  
				dateFmt:"yyyy-MM-dd HH:mm",  
				callback: function() { // 点击选择日期后的回调函数  
				    //alert("您选择的日期是：" + $("#txtDate").val());  
				}
			}); 
			//初始化离院时间
			$(".out-Date-hh").calendar({  
				speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
				complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
				readonly: true, // 目标对象是否设为只读，默认：true     
				lowerLimit: "2010/01/01", // 日期下限，默认：NaN(不限制)     
				nowData:true,//默认选中当前时间,默认true  
				dateFmt:"yyyy-MM-dd HH:mm",  
				callback: function() { // 点击选择日期后的回调函数  
				    //alert("您选择的日期是：" + $("#txtDate").val());  
				}
			}); 
		//点击修改费用清单按钮
		$('.amend-expense-list').click(function() {
			if($('.project-student-tbody .yt-table-active').length == 0) {
				$yt_alert_Model.prompt("请选择要修改的数据");
				return false;
			}
			$(".in-Date-hh").val($(".yt-table-active").data('data').arrivalTime);
			$(".out-Date-hh").val($(".yt-table-active").data('data').departureTime);
			$(".yt-table-active").data('data').roomNumber;
			/** 
			 * 显示编辑弹出框和显示顶部隐藏蒙层 
			 */
			$(".student-details-form").show();
			/** 
			 * 调用算取div显示位置方法 
			 */
			$yt_alert_Model.setFiexBoxHeight($(".student-details-form .yt-edit-alert-main"));
			$yt_alert_Model.getDivPosition($(".student-details-form"));
			/* 
			 * 调用支持拖拽的方法 
			 */
			$yt_model_drag.modelDragEvent($(".student-details-form .yt-edit-alert-title"));
			/**
			* 给弹出框赋值
			 * */
			$yt_baseElement.showLoading();
			var data = $(".yt-table-active").data('data');
			projectDetails.costOldMoney=data;
			var realName = $(".yt-table-active").data('data').realName;
			var groupNum =$(".yt-table-active").data('data').groupNum;
			var gender = $(".yt-table-active").data('data').gender;
			var phone = $(".yt-table-active").data('data').phone;
			var idNumber = $(".yt-table-active").data('data').idNumber;
			var groupName = $(".yt-table-active").data('data').groupName;
			var groupOrgName = $(".yt-table-active").data('data').groupOrgName;
			var deptPosition = $(".yt-table-active").data('data').deptPosition;
			var roomNumber = $(".yt-table-active").data('data').roomNumber;
			var trainingExpenseNegotiatedPrice = $(".yt-table-active").data('data').trainingExpenseNegotiatedPrice;
			var quarterageNegotiatedPrice = $(".yt-table-active").data('data').quarterageNegotiatedPrice;
			var mealFeeNegotiatedPrice = $(".yt-table-active").data('data').mealFeeNegotiatedPrice;
			var incidental = $(".yt-table-active").data('data').incidental;
			var traineeId = $(".yt-table-active").data('data').traineeId;
			var numberDinner = Number($(".yt-table-active").data('data').breakfastFor)+Number($(".yt-table-active").data('data').numberLunch)+Number($(".yt-table-active").data('data').numberDinner);
			var otherCost = $(".yt-table-active").data('data').otherCost;
			if(gender==1){
				gender="男";
			}else if(gender==2){
				gender="女";
			}
			 $(".student-details-form").setDatas($(".yt-table-active").data('data'));
			 //课程费隐藏数据
			 $(".course-price-hid-inp").val($(".yt-table-active").data('data').traineeNegotiatedPrice);
			 //课程费显示数据
			  $(".course-price").val($yt_baseElement.fmMoney($(".yt-table-active").data('data').traineeNegotiatedPrice));
			 //现金
			 $(".real-money-hid-inp").val($(".yt-table-active").data('data').cash);
			 $(".real-money").text($yt_baseElement.fmMoney($(".yt-table-active").data('data').cash));
			 //银联
			  $(".card-money").text($yt_baseElement.fmMoney($(".yt-table-active").data('data').creditCard));
			  $(".card-money-hid-inp").val($(".yt-table-active").data('data').creditCard);
			//课程费traineeNegotiatedPrice
			 $(".student-details-form .realName").text(realName);
			 $(".student-details-form .groupNum").text(groupNum);
			 $(".student-details-form .gender").text(gender);
			 $(".student-details-form .phone").text(phone);
			 $(".student-details-form .idNumber").text(idNumber);
			 $(".student-details-form .groupName").text(groupName);
			 $(".student-details-form .groupOrgName").text(groupOrgName);
			 $(".student-details-form .deptPosition").text(deptPosition);
			 $(".student-details-form .roomNumber").text(roomNumber);
			 $(".student-details-form .training-expense-negotiated-price-input").val($yt_baseElement.fmMoney(trainingExpenseNegotiatedPrice));
			 //课程费
			 $(".student-details-form .quarterage-negotiated-price-input").val($yt_baseElement.fmMoney(quarterageNegotiatedPrice));
			 $(".student-details-form .meal-fee-negotiated-price-input").val($yt_baseElement.fmMoney(mealFeeNegotiatedPrice));
			 $(".student-details-form .incidental-input").val($yt_baseElement.fmMoney(incidental));
			 $(".student-details-form .traineeId-hidden-input").val(traineeId);
			 $('.cost-table').setDatas(data);
			 $.each($('.cost-table input[type=text]'), function(i,n) {
			 	$(n).val($yt_baseElement.fmMoney($(n).val()));
			 	$(n).off('focus').on('focus',function(){
			 		$(this).val($yt_baseElement.rmoney($(this).val()));
			 	})
			 });
			$('.cost-table .cost-cash').off('blur').on('blur',function(){
				var allm = 0;
		 		$.each($('.cost-table .cost-cash'), function(j,k) {
		 			allm += $yt_baseElement.rmoney($(k).val())
 				});
 				allm = $yt_baseElement.fmMoney(allm);
		 		$('.real-money').text(allm);
			 	$(this).val($yt_baseElement.fmMoney($(this).val()));
		 	})
			$('.cost-table .cost-bank').off('blur').on('blur',function(){
				var allm = 0;
		 		$.each($('.cost-table .cost-bank'), function(j,k) {
		 			allm += $yt_baseElement.rmoney($(k).val())
 				});
 				allm = $yt_baseElement.fmMoney(allm);
		 		$('.card-money').text(allm);
			 	$(this).val($yt_baseElement.fmMoney($(this).val()));
		 	})
			 var projectType = $yt_common.GetQueryString("projectType");
				if(projectType==3 || projectType==2 ){//隐藏的数据
					//培训费
					$(".student-details-form .training-expense-negotiated-price-hidden-input").val(trainingExpenseNegotiatedPrice);
					//住宿费
					$(".student-details-form .quarterage-negotiated-price-hidden-input").val(quarterageNegotiatedPrice);
					//餐费
					$(".student-details-form .meal-fee-negotiated-price-hidden-input").val(mealFeeNegotiatedPrice);
					//杂费
					$(".student-details-form .incidental-hidden-input").val(incidental);
				}else if(projectType ==4||projectType ==5){  //显示的数据
					//餐费
					$(".student-details-form .meal-fee-negotiated-price-input").val($yt_baseElement.fmMoney(numberDinner));
					//杂费
					$(".student-details-form .incidental-input").val($yt_baseElement.fmMoney(otherCost));
				}
				$yt_baseElement.hideLoading();
			/** 
			 * 点击确定方法
			 */
			$('.update-student-sure-btn').off().click(function() {
				projectDetails.amendExpenseList();
			});
			/** 
			 * 点击取消方法 
			 */
			$('.update-student-canel-btn').click(function() {
				//隐藏页面中自定义的表单内容  
				$(".student-details-form").hide();
			});
			
			//费用明细输入框失去焦点事件
			$(".cost-of-listing tbody .money-tr").find("input").blur(function(){
				$(this).val($yt_baseElement.fmMoney($(this).val()));
			});
			
		});
			/**
			 * 项目收入点击学员姓名查看详情
			 */
			$('.project-income-div,.project-student-tbody').off('click','.real-name-inf').on('click','.real-name-inf', function() {
				//var studentList=$('.yt-table-active').data('studentList');
				var traineeId = $(this).parent().parent().find(".hid-trainId").val();
				//获取班级编号
				var projectCode = $yt_common.GetQueryString("projectCode");
				projectDetails.seeStudentDetails(traineeId,projectCode);
				/** 
				 * 显示编辑弹出框和显示顶部隐藏蒙层 
				 */
				$(".project-pay-student-details-form").show();
				/** 
				 * 调用算取div显示位置方法 
				 */
				$yt_alert_Model.setFiexBoxHeight($(".project-pay-student-details-form .yt-edit-alert-main"));
				$yt_alert_Model.getDivPosition($(".project-pay-student-details-form"));
				/* 
				 * 调用支持拖拽的方法 
				 */
				$yt_model_drag.modelDragEvent($(".project-pay-student-details-form .yt-edit-alert-title"));
				/** 
				 * 点击取消方法 
				 */
				$('.project-pay-student-details-form .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
					//隐藏页面中自定义的表单内容  
					$(".project-pay-student-details-form").hide();
				});
			});
			/**
			 * 费用清单点击学员姓名查看详情
			 */
			$('.project-student-tbody,.project-income-other-tbody').off('click','.real-name-inf').on('click','.real-name-inf', function() {
				//var studentList=$('.yt-table-active').data('studentList');
				var traineeId = $(this).parent().parent().find(".hid-trainId").val();
				//获取班级编号
				var projectCode = $yt_common.GetQueryString("projectCode");
				projectDetails.seeStudentDetails(traineeId,projectCode);
				/** 
				 * 显示编辑弹出框和显示顶部隐藏蒙层 
				 */
				$(".pay-student-details-form-money").show();
				/** 
				 * 调用算取div显示位置方法 
				 */
				$yt_alert_Model.setFiexBoxHeight($(".pay-student-details-form-money .yt-edit-alert-main"));
				$yt_alert_Model.getDivPosition($(".pay-student-details-form-money"));
				/* 
				 * 调用支持拖拽的方法 
				 */
				$yt_model_drag.modelDragEvent($(".pay-student-details-form-money .yt-edit-alert-title"));
				/** 
				 * 点击取消方法 
				 */
				$('.pay-student-details-form-money .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
					//隐藏页面中自定义的表单内容  
					$(".pay-student-details-form-money").hide();
				});
			});
		//点击取消按钮
		$('.expenditure-cancel-btn').click(function(){
			$('.expenditure-sure-btn').text("修改");
			$('.expenditure-sure-btn').attr('sure-state','true');
			$('.otherCost-tbody tr td input').hide();
			$('.otherCost-tbody tr td span').show();
			$(this).hide();
		});
		//项目支出确定按钮
		$('.expenditure-sure-btn').click(function() {
			var sureState=$(this).attr('sure-state');
			if(sureState=="true"){
				$(this).text("确定");
				$(this).attr('sure-state','false');
				$('.otherCost-tbody tr').each(function(){
					$(this).find('td').eq(3).find('input').css('width',"99%");
					$(this).find('td').eq(2).find('input').css('text-align','right');
				});
				$('.otherCost-tbody tr td input').show();
				$('.otherCost-tbody tr td span').hide();
				$(".expenditure-cancel-btn").show();
			}else{
				$(this).text("修改");
				$(this).attr('sure-state','true');
				$('.otherCost-tbody tr td input').hide();
				$('.otherCost-tbody tr td span').show();
				$(".expenditure-cancel-btn").hide();
				var costCode = "";
				var spendMoney = "";
				var details = "";
				var otherCostJsonArr = [];
				//遍历获取List<Map>对象
				$(".otherCost-tbody tr").each(function(i, n) {
					costCode = $(n).attr("costCode");
					spendMoney = $(n).find('td').eq(2).find('input').val();
					details = $(n).find('td').eq(3).find('input').val();
					if(costCode!=null){
						var otherCostArr = {
							costCode: costCode,
							spendMoney: $yt_baseElement.rmoney(spendMoney),
							details: details
						}
						otherCostJsonArr.push(otherCostArr);
					}
				});
				console.log(otherCostJsonArr);
				var otherCost = JSON.stringify(otherCostJsonArr);
				//获取班级编号
				var projectCode = $yt_common.GetQueryString("projectCode");
				$yt_baseElement.showLoading();
				//执行接口方法
				$.ajax({
					type: "post",
					url: $yt_option.base_path + "finance/settlement/addExpenditure",
					data: {
						projectCode:projectCode,
						otherCost: otherCost
					},
					async: false,
					success: function(data) {
						if(data.flag == 0) {
							$yt_baseElement.hideLoading(function() {
								$yt_alert_Model.prompt("添加成功");
								projectDetails.getExpenditureListInf();
							});
						} else {
							$yt_baseElement.hideLoading(function() {
								$yt_alert_Model.prompt("添加失败");
								projectDetails.getExpenditureListInf();
							});
						}
					}
				});
			}
		});
		
		/**
		 * 点击减免列表里面的修改图标
		 */
		$('.project-total-cost-tbody').on('click','span',function(){
			var repairAcc=$(this).parent().attr('repair-acc');
			if(repairAcc=="true"){
				$(this).parents('tr').find('td').eq(2).find('span').hide();
				$(this).parents('tr').find('td').eq(2).find('input').show();
				$(this).text("确定");
				$(this).parent().attr('repair-acc',false);
			}else{
				//修改并提交数据
				$(this).parents('tr').find('td').eq(2).find('span').show();
				$(this).parents('tr').find('td').eq(2).find('input').hide();
				//添加需要传到后台的数据
				var costData=[];
				var trList=$('.project-total-cost-tbody tr');
				$.each(trList, function(i,n) {
					var costType=$(n).find('td').eq(0).text();
					var costReduction=$(n).find('td').eq(2).find('input').val();
					var costMap={
						costType:costType,
						costReduction:$yt_baseElement.rmoney(costReduction)
					};
					costData.push(costMap);
				});
				costData=JSON.stringify(costData);
				projectDetails.repairAllAppe(costData);
			
				var img='<img style="margin-right: 2px;" src="../../resources/images/icons/amend.png">';
				$(this).text("");
				$(this).append(img);
				$(this).parent().attr('repair-acc',true);
			}
		});
		//页签切换
		$(".tab-title-list button").click(function() {
			//var divIndex; 
			$(this).addClass("active").siblings().removeClass("active");
			$(".box-list .content-box").hide().eq($(this).index()).show();
			//班级信息页签
			if($(this).index() == 0) {
				projectDetails.getStudetListInfo();
				$('#project-main').css("min-width","1120px");
			} else if($(this).index() == 1) {
				search = "";
				//获取当前登录人信息
				projectDetails.userInfo();
				$('#project-main').css("min-width","1420px");
				if(projectType == 2 || projectType == 3){//委托
					projectDetails.getStudentCostsList();
					//委托单位支付信息
					projectDetails.getCompanyList();
					projectDetails.getCheckList();
					//$('#project-main').css("min-width","1366px");
				}else{//调训
					search = "";
					$(".project-expenses-list").hide();
					$('button.amend-expense-list').hide();
					projectDetails.getStudentCostsList1();
					projectDetails.getCompanyList1();
					//$('#project-main').css("min-width","1200px");
				}
				$(".project-student-tbody").off('click','.cost-details').on("click", ".cost-details", function() {
					$(".addBorrow-tbody").empty();
					var htmTbo = $(".addBorrow-tbody");
					//获取班级编号
					var projectCode = $yt_common.GetQueryString("projectCode");
					var traineeId = $(this).prev().val();
					//显示整体框架loading的方法
					$yt_baseElement.showLoading();
					$.ajax({
						type:"post",
						url:$yt_option.base_path + "finance/settlement/getNoDetailedPersonalListDetails",
						data:{
						projectCode:projectCode,
						traineeId:traineeId
						},
						async:true,
						success:function(data){
							if(data.flag==0){
								if(data.data != null){
									$.each(data.data,function(i,v){
										var TrHtml = '<tr>'+
														'<td>'+(v.dateData?v.dateData:'')+'</td>'+
														'<td>'+v.breakfastFor+'</td>'+
														'<td>'+v.numberLunch+'</td>'+
														'<td>'+v.numberDinner+'</td>'+
													'</tr>';
										htmTbo.append(TrHtml);
									});
								}else{
									TrHtml = '<tr style="border:0px;background-color:#fff !important;" >' +
										'<td colspan="4" align="center" style="border:0px;">' +
										'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
										'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
										'</div>' +
										'</td>' +
										'</tr>';
									htmTbo.append(TrHtml);
								}
											//显示选择所属项目弹出框
								$(".select-teacher-div").show();
								//计算弹出框位置
								$yt_alert_Model.setFiexBoxHeight($(".select-teacher-div .yt-edit-alert-main"));
								$yt_alert_Model.getDivPosition($(".select-teacher-div"));
								
								$yt_model_drag.modelDragEvent($(".select-teacher-div .yt-edit-alert-title"));
								//取消按钮
								$('.select-teacher-canel-btn').click(function() {
									$(".yt-edit-alert,#heard-nav-bak").hide();
									$("#pop-modle-alert").hide();
								});
							}else{
								$yt_alert_Model.prompt("查询失败!");
							}
							projectDetails.getTotalList();
							//隐藏整体框架loading的方法
							$yt_baseElement.hideLoading();
						}
					});
					
					
				});
			} else if($(this).index() == 2) {
				$('#project-main').css("min-width","1500px");
				if(projectType == 2 || projectType == 3){
					$(".project-income-study").show();
					$(".project-revenue-training").hide();
					projectDetails.getIncomesList();
					projectDetails.getIncomeCostsList();
					projectDetails.getTotalList();
				}else{
					$(".project-income-study").hide();
					$(".project-revenue-training").show();
					projectDetails.projectRevenueTraining();
				}
			} else if($(this).index() == 3) {
				$('#project-main').css("min-width","1120px");
				projectDetails.getOtherIncomeList();
			} else if($(this).index() == 4) {
				$('#project-main').css("min-width","1120px");
				$('.expenditure-sure-btn').text("修改");
				$('.expenditure-sure-btn').attr('sure-state','true');
				$('.otherCost-tbody tr td input').hide();
				$('.otherCost-tbody tr td span').show();
				$('.expenditure-cancel-btn').hide();
				projectDetails.getExpenditureListInf();
			}
		});
		//项目收入检索
		$(".project-income-study .search-btn").click(function(){
			projectDetails.getIncomesList();
		});
		//学员费用详情列表检索
		$(".stu-info-list").off().on('click','.search-btn',function(){
			search = "search";
			if(projectType == 4||projectType == 5){
				projectDetails.getStudentCostsList1();
				projectDetails.getCompanyList1();
			}else{
				projectDetails.getStudentCostsList();
				projectDetails.getCompanyList();
			}
		});
		//项目收入（选学、委托）-第二个列表(费用减免情况)-提交减免后天数
		$('.incomeSubmit').off('click').on('click',function(){
			projectDetails.updateIncome();
		})
	},
	userInfo: function() {
		var me = this ; 
		var projectCode = $yt_common.GetQueryString("projectCode");
		//角色
		var roleIds;
		//获取的数据
		var getRemarks;
		//判断流程在哪个步骤
		var remarkslog='';
		//获取备注和意见
		$.ajax({
			async: true,
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "finance/settlement/getProjectRemarkAndCheck", //ajax访问路径  
			data: {
				projectCode:projectCode,
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0){
					 console.log($yt_common.user_info)
					 roleIds = $yt_common.user_info.roleIds;
					 userName = $yt_common.user_info.userName;
					if (data.data != null) {
//						getRemarks = data.data;
//						var projectDetailedRemarks = $(".projectDetailedRemarks").val(data.data.projectDetailedRemarks);
//						var projectHead = $(".projectHead").val(data.data.projectHead);
//						var projectSell = $(".projectSell").val(data.data.projectSell);
//						var deanAcademicAffairs = $(".deanAcademicAffairs").val(data.data.deanAcademicAffairs);
					//费用清单意见顺序
					/*
					  * 
					  1.备注（财务角色）
					  2.项目主任意见
					  3.项目销售意见
					  4.教务部负责人意见
					  */
						 function first(){
						 	$('.projectDetailedRemarksDiv').show();
							$('.projectDetailedRemarks').hide();
							$('.projectDetailedRemarks').siblings('p').show();
						 }
						 function seconed(){
						 	$('.projectHeadDiv').show();
						 	$('.projectHead').hide();
						 	$('.projectHead').siblings('p').show();
						 }
						 function three(){
						 	$('.projectSellDiv').show();
						 	$('.projectSell').hide();
						 	$('.projectSell').siblings('p').show();
						 }
						 function four(){
						 	$('.deanAcademicAffairsDiv').show();
						 	$('.deanAcademicAffairs').hide();
						 	$('.deanAcademicAffairs').siblings('p').show();
						 }
						data.data.projectHeadCreateUser == null? data.data.projectHeadCreateUser = '':data.data.projectHeadCreateUser=data.data.projectHeadCreateUser;
						data.data.projectSellCreateUser == null? data.data.projectSellCreateUser = '':data.data.projectSellCreateUser=data.data.projectSellCreateUser;
						data.data.deanAcademicAffairsCreateUser == null? data.data.deanAcademicAffairsCreateUser = '':data.data.deanAcademicAffairsCreateUser=data.data.deanAcademicAffairsCreateUser;
					 	$('.remark-box').setDatas(data.data);
						if(data.data.projectDetailedRemarksCreateTime==''){
							//第一步
							if((','+roleIds+',').indexOf(',128,')==-1){
								$('.projectDetailedRemarksDiv').hide();
								$('.remark-btn').hide();
							}else{
								$('.projectDetailedRemarksDiv').show();
								$('.remark-btn').show();
							}
							remarkslog = 'projectDetailedRemarks'
						}else if(data.data.projectHeadCreateTime==''){
							//第二步
							first();
							$('.remark-btn').show();
							//当前的登录人是否为项目主任
							if((','+me.studentListInfo.projectHead+',').indexOf(','+userName+',') ==-1){
								$('.projectHeadDiv').hide();
								$('.remark-btn').hide();
							}else{
								$('.projectHeadDiv').show();
								$('.remark-btn').show();
							}
							remarkslog = 'projectHead'
						}else if(data.data.projectSellCreateTime==''){
							//第三步
							first();
							seconed();
							if (me.studentListInfo.projectSell.indexOf(userName) ==-1) {//当前登录人不是项目销售
						   		$('.projectSellDiv').hide();
								$('.remark-btn').hide();
						   	}else{
						   		$('.projectSellDiv').show();
								$('.remark-btn').show();
						   	}
							remarkslog = 'projectSell'
						}else if(data.data.deanAcademicAffairsCreateTime==''){
							//第四部
							first();
							seconed();
							three();
							//当前登录人是否为教务负责人
							if((','+roleIds+',').indexOf(',129,')==-1){
								$('.deanAcademicAffairsDiv').hide();
								$('.remark-btn').hide();
							}else{
								$('.deanAcademicAffairsDiv').show();
								$('.remark-btn').show();
							}
							remarkslog = 'deanAcademicAffairs'
						}else{
							first();
							seconed();
							three();
							four();
							$('.remark-btn').hide();
						}
					}else{
//						getRemarks = {
//							projectDetailedRemarks:"",
//							projectDetailedRemarksCreateTime:"",
//							projectDetailedRemarksCreateUser:"",
//							projectHead:"",
//							projectHeadCreateTime:"",
//							projectHeadCreateUser:"",
//							projectSell:"",
//							projectSellCreateTime:"",
//							projectSellCreateUser:"",
//							deanAcademicAffairsCreateTime:"",
//							deanAcademicAffairsCreateUser:"",
//							deanAcademicAffairs:""
//						}
						/*
						 data.data为null 没写过备注
						 * */
						if((','+roleIds+',').indexOf(',128,')==-1){
							$('.projectDetailedRemarksDiv').hide();
							$('.remark-btn').hide();
						}else{
							$('.projectDetailedRemarksDiv').show();
							$('.remark-btn').show();
						}
						remarkslog = 'projectDetailedRemarks'
					}
				}
			}
		});
		//初始化只读备注和意见框
//		$(".remark-box").find("p").text("");
		var userData;
		//获取当前登录人信息
//		$.ajax({
//			async: false,
//			type: "post", //ajax访问方式 默认 "post"  
//			url: $yt_option.base_path + "uniform/user/getUsersDetails", //ajax访问路径  
//			data: {}, //ajax查询访问参数
//			success: function(data) {
//				//当前登录人的角色判断
//				roleIds = ','+data.data.roleIds+',';
//				userData = data.data;
//			    if (roleIds.indexOf(',128,') == -1) {//当前登录人不是财务的人
//			   		$(".projectDetailedRemarks").hide();//隐藏输入框
//			   		if ($(".projectDetailedRemarks").val() != "") {
//			   			$(".projectDetailedRemarks").next().text($(".projectDetailedRemarks").val());//显示只读文本框
//			   		}else{
//			   			$(".projectDetailedRemarks").parent().hide();
//			   		}
//			   	};
//			   	if ((','+me.studentListInfo.projectHead+',').indexOf(','+data.data.userName+',') ==-1) {//当前登录人不是项目主任
//			   		$(".projectHead").hide();
//			   		if ($(".projectHead").val() !="") {
//			   			$(".projectHead").next().text($(".projectHead").val());
//			   		}else{
//			   			$(".projectHead").parent().hide();
//			   		}
//			   	};
//			   	if (me.studentListInfo.projectSell.indexOf(data.data.userName) ==-1) {//当前登录人不是项目销售
//			   		$(".projectSell").hide();
//			   		if($(".projectSell").val() !=""){
//			   			$(".projectSell").next().text($(".projectSell").val());
//			   		}else{
//			   			$(".projectSell").parent().hide();
//			   		}
//			   	};
//			   	if (roleIds.indexOf(',129,') == -1) {//当前登录人不是负责人
//			   		$(".deanAcademicAffairs").hide();
//			   		if ($(".deanAcademicAffairs").val() != "") {
//			   			$(".deanAcademicAffairs").next().text($(".deanAcademicAffairs").val());
//			   		}else{
//			   			$(".deanAcademicAffairs").parent().hide();
//			   		}
//			   		
//			   	};
//			   	if(roleIds.indexOf(',128,') != -1 || me.studentListInfo.projectSell.indexOf(data.data.userName) || (','+me.studentListInfo.projectHead+',').indexOf(','+data.data.userName+',') || roleIds.indexOf(',129,') != -1){
//			   		$(".remark-btn").show();
//			   	}else{//当前登录人不是以上角色，隐藏提交按钮。
//			   		$(".remark-btn").hide();
//			   	}
//			}
//		});
		//项目结算备注和意见提交
//		$(".remark-btn").off().click(function(){
//			var projectDetailedRemarks = $(".projectDetailedRemarks").val();
//			var projectHead = $(".projectHead").val();
//			var projectSell = $(".projectSell").val();
//			var deanAcademicAffairs = $(".deanAcademicAffairs").val();
//			var isEditArr = [];
//			if (roleIds.indexOf(',128,') != -1) {//财务的人
//				if (getRemarks.projectDetailedRemarks != projectDetailedRemarks) {//备注被修改
//					isEditArr.push('projectDetailedRemarks');
//				}
//			};
//			if ((','+userData.userName+',').indexOf(','+me.studentListInfo.projectHead+',') !=-1) {//项目主任
//				if (getRemarks.projectHead != projectHead) {//项目主任意见被修改
//					isEditArr.push('projectHead');
//				}
//			};
//			if (userData.userName.indexOf(me.studentListInfo.projectSell) !=-1) {//项目销售
//				if (getRemarks.projectSell != projectSell) {//项目销售意见被修改
//					isEditArr.push('projectSell');
//				}
//			};
//			if (roleIds.indexOf(',129,') != -1) {//负责人
//				if (getRemarks.deanAcademicAffairs != deanAcademicAffairs) {//教务负责人意见被修改
//					isEditArr.push('deanAcademicAffairs');
//				}
//			};
//			isEditArr = isEditArr.join(',');
//			$.ajax({
//				async: false,
//				type: "post", //ajax访问方式 默认 "post"  
//				url: $yt_option.base_path + "finance/settlement/updateProjectRemarkAndCheck", //ajax访问路径  
//				data: {
//					projectCode:projectCode,
//					projectDetailedRemarks:projectDetailedRemarks,
//					projectDetailedRemarksCreateTime:getRemarks.projectDetailedRemarksCreateTime,
//					projectDetailedRemarksCreateUser:getRemarks.projectDetailedRemarksCreateUser,
//					projectHead:projectHead,
//					projectHeadCreateTime:getRemarks.projectHeadCreateTime,
//					projectHeadCreateUser:getRemarks.projectHeadCreateUser,
//					projectSell:projectSell,
//					projectSellCreateTime:getRemarks.projectSellCreateTime,
//					projectSellCreateUser:getRemarks.projectSellCreateUser,
//					deanAcademicAffairs:deanAcademicAffairs,
//					deanAcademicAffairsCreateTime:getRemarks.deanAcademicAffairsCreateTime,
//					deanAcademicAffairsCreateUser:getRemarks.deanAcademicAffairsCreateUser,
//					isEdit:isEditArr
//				}, //ajax查询访问参数
//				success: function(data) {
//					if (data.flag == 0) {
//						projectDetails.userInfo();
//						$yt_alert_Model.prompt("操作成功!");
//					}
//				}
//			});
//		});
		$(".remark-btn").off().click(function(){
			var projectDetailedRemarks = undefined;
			var projectHead = undefined;
			var projectSell = undefined;
			var deanAcademicAffairs = undefined;
			if(remarkslog=='projectDetailedRemarks'){
				projectDetailedRemarks = $('.projectDetailedRemarks').val();
			}else if(remarkslog=='projectHead'){
				projectHead = $('.projectHead').val();
			}else if(remarkslog=='projectSell'){
				projectSell = $('.projectSell').val();
			}else if(remarkslog=='deanAcademicAffairs'){
				deanAcademicAffairs = $('.deanAcademicAffairs').val();	
			}
			$.ajax({
				async: false,
				type: "post", //ajax访问方式 默认 "post"  
				url: $yt_option.base_path + "finance/settlement/updateProjectRemarkAndCheck", //ajax访问路径  
				data: {
					projectCode:projectCode,
					projectDetailedRemarks:projectDetailedRemarks,
					projectHead:projectHead,
					projectSell:projectSell,
					deanAcademicAffairs:deanAcademicAffairs,
					isEdit:remarkslog
				}, //ajax查询访问参数
				success: function(data) {
					if (data.flag == 0) {
						projectDetails.userInfo();
						$yt_alert_Model.prompt("操作成功!");
					}
				}
			});
		})
	},
	/**
	 * 修改总减免费用
	 */
	repairAllAppe:function(costData){
		//获取班级编号
		var projectCode = $yt_common.GetQueryString("projectCode");
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type:"post",
			url:$yt_option.base_path + "finance/settlement/updateDetailedReduction",
			data:{
			projectCode:projectCode,
			costData:costData
			},
			async:true,
			success:function(data){
				if(data.flag==0){
					$yt_alert_Model.prompt("修改成功");
				}else{
					$yt_alert_Model.prompt("修改失败");
				}
				projectDetails.getTotalList();
				//隐藏整体框架loading的方法
				$yt_baseElement.hideLoading();
			}
		});
		
	},
	/**
	 * 查看学员详情信息
	 */
	seeStudentDetails:function(traineeId,projectId){
		var headImg = new Image();
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/trainee/getTraineeDetails",
			data: {
				traineeId: traineeId,
				projectId: projectId
			},
			async: true,
			success: function(data) {
				var htmlBody = $('.pay-student-details-form .student-details-train-record tbody');
				var htmlTrs = '';
				htmlBody.empty();
				if(data.flag == 0) {
					data.data.workTime=="0000-00-00"?data.data.workTime='':data.data.workTime=data.data.workTime;
					detailsMsg = data.data;
					//证件类型   1:身份证 2:护照 3:军官证 4:其他
					if(data.data.idType == 1){
						$(".pay-id-type").text("身份证");
					}else if(data.data.idType == 2){
						$(".pay-id-type").text("护照");
					}else if(data.data.idType == 3){
						$(".pay-id-type").text("军官证");
					}else if(data.data.idType == 4){
						$(".pay-id-type").text("其他");
					}
					detailsMsg.checkInDate = detailsMsg.checkInDate.split(" ")[0];
					//性别
					if(detailsMsg.gender == 1) {
						detailsMsg.gender = "男";
					} else {
						detailsMsg.gender = "女";
					}
					//发票类型
					if(detailsMsg.invoiceType == 0) {
						detailsMsg.invoiceType = "暂不开票";
					} else if(detailsMsg.invoiceType == 1) {
						detailsMsg.invoiceType = "普通发票";
					} else {
						detailsMsg.invoiceType = "增值税发票";
					}
					//报到状态
					if(detailsMsg.checkInState == 0) {
						detailsMsg.checkInState = "未报到";
					} else {
						detailsMsg.checkInState = "已报到";
					}
					//缴费（对账）状态
					if(detailsMsg.paymentState == 0) {
						detailsMsg.paymentState = "未对账";
					} else {
						detailsMsg.paymentState = "已对账";
					}
					//开票状态
					if(detailsMsg.isOrderNum == 0) {
						detailsMsg.isOrderNum = "未开票";
					} else {
						detailsMsg.isOrderNum = "已开票";
					}
					$('.pay-student-details-form .cont-edit-test').setDatas(detailsMsg);
					console.log("学员头像", detailsMsg.headPortraitUrl);
					if(detailsMsg.headPortrait != "") {
						headImg.src = detailsMsg.headPortraitUrl;
						headImg.onload = function() {
							$('.student-details-img').attr('src', headImg.src);
							$('.student-details-img').jqthumb({
								width: 89,
								height: 130
							});
						};
					} else {
						$('.student-details-img').attr('src', '../../resources/images/classStudent/student-picture.png');
						$('.student-details-img').jqthumb({
							width: 89,
							height: 130
						});
					}
					//开票信息
				var recordList = data.data.orderList;
				var recordBody = $('.pay-student-details-form .student-details-tecket .order-list-tbody').empty();
				var recordHtml = '';
				if (recordList.length != 0) {
					$.each(recordList, function(i,v) {
						v.isOrderNum==1?v.isOrderNum='已开票':v.isOrderNum='未开票';
						recordHtml='<tr>'+
						'<td style="text-align: right;" width="80px">开票状态：</td>'+
						'<td style="text-align: left;" width="150px">'+v.isOrderNum+'</td>';
						if (v.isOrderNum == "未开票") {
							recordHtml += '<td class="order-num" style="text-align: right;" width="80px">发票号：</td>'+
							'<td style="text-align: left;" width="120px">'+v.orderNum+'</td>'+
							'<td class="order-money" style="text-align: right;" width="80px">开票金额：</td>'+
							'<td style="text-align: left;" width="120px">'+v.tuition+'</td>';
						}
						recordHtml +='<td width="80px"><div class="addorder addorder'+i+'" style="display:none;padding: 5px 10px;border: 1px dashed #E6E6E6;cursor: pointer;">合并开票</div></td>'
						'</tr>';
						recordBody.append(recordHtml);
						if(v.trainees){
							var trainees = v.trainees.length!=0?v.trainees.split(','):[];
						}else{
							var trainees = [];
						}
						if(trainees.length>1){
							$('.addorder'+i).show().data('trainees',trainees.join('  '));
						}
						$('.addorder').tooltip({
						position: 'bottom',
						content: function() {
							var showBox = '<table class="tip-table">' +
								'<tr><td style="text-align:left">合并开票者：</td></tr><tr><td>' + $(this).data('trainees') + '</td></tr>' +
								'</table>';
							return showBox;
						},
						onShow: function() {
							$(this).tooltip('tip').css({
								backgroundColor: '#666',
								borderColor: '#666',
								color: '#fff'
							});
						}
					});
					});
				}else{
					recordHtml = '<tr style="border:0px;background-color:#fff !important;" >' +
						'<td width="77px" align="right" style="border:0px;">开票状态：</td>' +
						'<td align="left" style="border:0px;">未开票</td>' +
						'</tr>';
						recordBody.append(recordHtml);
				}
					//添加培训记录
//					$.each(detailsMsg.trainList, function(i, b) {
//						if (b.datatates == 6 || b.datatates == 4) {//datatates值为6或4显示项目（班级code）
//							b.projectCode = b.projectCode
//						}else{//datatates值不为6或4的项目（班级）code是乱码，不显示code
//							b.projectCode = "";
//						}
//						htmlTrs = '<tr>' +
//							'<td style="text-align: center;">' + b.projectCode + '</td>' +
//							'<td style="text-align: left;">' + b.projectName + '</td>' +
//							'<td style="text-align: center;">' + b.startDate + '</td>' +
//							'<td>' + b.projectHead + '</td>' +
//							'<td>' + b.certificateNo + '</td>' +
//							'</tr>';
//						htmlBody.append(htmlTrs);
//					});
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading();
				}
			}
		});
	},
	/**
	 * 获取班级信息
	 */
	studentListInfo :'',
	getStudetListInfo: function() {
		var me = this ;
		$(".initProjectShell").val("");
		$(".initProjectHead").val("");
		var pkId = $yt_common.GetQueryString("pkId");
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "project/getBeanById",
			async: true,
			data: {
				pkId:pkId
			},
			objName: 'data',
			success: function(data) {
				if(data.flag == 0) {
					if(data.data.projectType == 1) {
						data.data.projectType = "计划";
					} else if(data.data.projectType == 2) {
						data.data.projectType = "委托";
					} else if(data.data.projectType == 3) {
						data.data.projectType = "选学";
						$(".projectType-2").hide();
					} else if(data.data.projectType == 4) {
						data.data.projectType = "中组部调训";
					} else if(data.data.projectType == 5) {
						data.data.projectType = "国资委调训";
					}
					$('.project-code').text(data.data.projectCode);
					$('.project-name').text(data.data.projectName);
					$('.project-type').text(data.data.projectType);
					$('.project-sell').text(data.data.projectSell);
					$('.start-date').text(data.data.startDate);
					$('.end-date').text(data.data.endDate);
					$('.details').text(data.data.details);
					$('.train-date').text(data.data.trainDate);
					$('.customer-unit').text(data.data.groupName);
					$('.customer-dept').text(data.data.customerDept);
					$('.customer-linkman').text(data.data.customerLinkman);
					$('.customer-linkman-position').text(data.data.customerLinkmanPosition);
					$('.customer-linkman-phone').text(data.data.customerLinkmanPhone);
					$('.customer-linkman-cellphone').text(data.data.customerLinkmanCellphone);
					$('.customer-linkman-fax').text(data.data.customerLinkmanFax);
					$('.customer-linkman-email').text(data.data.customerLinkmanEmail);
					$('.customer-trainee-position').text(data.data.customerTraineePosition);
					$('.customer-trainee-sum').text(data.data.customerTraineeSum);
					$('.customer-trainee-age-structure').text(data.data.customerTraineeAgeStructure);
					$('.customer-target-demand').text(data.data.customerTargetDemand);
					$('.project-sell').text(data.data.projectSellName);
					$(".initProjectShell").val(data.data.projectSell);
					$('.project-head').text(data.data.projectHeadName);
					$(".initProjectHead").val(data.data.projectHead);
					$('.class-teacher').text(data.data.projectHeadmasterName);
					$('.project-aid').text(data.data.projectAidName);
					$yt_baseElement.hideLoading();
					me.studentListInfo  =data.data ;
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}
			}
		});
	},
	/**
	 * 委托项目结算清单
	 */
	getCheckList: function() {
		$yt_baseElement.showLoading();
		var projectCode = $yt_common.GetQueryString("projectCode");
		var htmlTbody = $('.project-check-List-tbody');
		var htmlTr = '';
		htmlTbody.empty();
		$.each(projectDetails.getDetailedList.settlementDetailedList, function(i, v) {
			htmlTr += '<tr>' +
				'<td>' + (i + 1) + '</td>' +
				'<td style="text-align:left;">' + v.name + '</td>' +
				'<td style="text-align:right;word-wrap:break-word;">' + $yt_baseElement.fmMoney(v.amountReceivableTotal) + '</td>' +
				'<td style="text-align:right;word-wrap:break-word;">' + $yt_baseElement.fmMoney(v.amountReceivableNoTax) + '</td>' +
				'<td style="text-align:right;word-wrap:break-word;">' + $yt_baseElement.fmMoney(v.amountReceivableTax) + '</td>' +
				'<td style="text-align:right;word-wrap:break-word;">' + $yt_baseElement.fmMoney(v.netReceiptsTotal) + '</td>' +
				'<td style="text-align:right;word-wrap:break-word;">' + $yt_baseElement.fmMoney(v.netReceiptsNoTax) + '</td>' +
				'<td style="text-align:right;word-wrap:break-word;">' + $yt_baseElement.fmMoney(v.netReceiptsTax) + '</td>' +
				'<td style="text-align:right;word-wrap:break-word;">' + $yt_baseElement.fmMoney(v.uncollectedTotal) + '</td>' +
//								'<td style="text-align:right;word-wrap:break-word;">' + $yt_baseElement.fmMoney(v.uncollectedNoTax) + '</td>' +
//								'<td style="text-align:right;word-wrap:break-word;">' + $yt_baseElement.fmMoney(v.uncollectedTax) + '</td>' +
				'</tr>';
		});
		htmlTbody.html(htmlTr);
		$yt_baseElement.hideLoading();
				
//		$.ajax({
//			async: true,
//			url: $yt_option.base_path + "finance/settlement/getDetailedList", //ajax访问路径  
//			type: "post", //ajax访问方式 默认 "post"  
//			data: {
//				projectCode: projectCode
//			}, //ajax查询访问参数
//			objName: 'data', //指获取数据的对象名称  
//			success: function(data) {
//				if(data.flag == 0) {} else {
//					$yt_baseElement.hideLoading(function() {
//						$yt_alert_Model.prompt("查询失败");
//					});
//				}
//			}, //回调函数 匿名函数返回查询结果  
//			isSelPageNum: true //是否显示选择条数列表默认false  
//
//		});
	},
	getDetailedList:'',
	/**
	 * 委托单位支付信息
	 */
	getCompanyList: function() {
		$yt_baseElement.showLoading();
		var projectCode = $yt_common.GetQueryString("projectCode");
		var groupLisstLen;
		$.ajax({
			async: false,
			url: $yt_option.base_path + "finance/settlement/getDetailedList", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				projectCode: projectCode
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					projectDetails.getDetailedList=data.data;
					//切换表头
					$('.nodiaoxun').show();
					$('.diaoxun').hide();
					var htmlTbody = $('.project-company-tbody');
					var htmlTr = '';
					var htmlPlan = '';
					var trainingExpenseNegotiatedPriceSum = 0;
					var traineeNegotiatedPriceSum = 0;
					var quarterageNegotiatedPriceSum = 0;
					var mealFeeNegotiatedPriceSum = 0;
					var incidentalSum = 0;
					var amountReceivableSum = 0;
					var netReceiptsSum = 0;
					var uncollectedSum = 0;
					$(htmlTbody).empty();
					groupLisstLen = data.data.settlementGroupDetails.length;
					if(data.data.settlementGroupDetails.length != 0){
						$.each(data.data.settlementGroupDetails, function(i, v) {
							var amountReceivable = Number(v.trainingExpenseNegotiatedPrice)+Number(v.traineeNegotiatedPrice)+Number(v.quarterageNegotiatedPrice)+Number(v.mealFeeNegotiatedPrice)+Number(v.incidental);
							htmlTr += '<tr>' +
								'<td style="text-align:left;">' + v.groupName + '</td>' +
								'<td style="text-align:right;word-wrap:break-word;">' + $yt_baseElement.fmMoney(v.trainingExpenseNegotiatedPrice) + '</td>' +
								'<td style="text-align:right;word-wrap:break-word;">' + $yt_baseElement.fmMoney(v.traineeNegotiatedPrice) + '</td>' +
								'<td style="text-align:right;word-wrap:break-word;">' + $yt_baseElement.fmMoney(v.quarterageNegotiatedPrice) + '</td>' +
								'<td style="text-align:right;word-wrap:break-word;">' + $yt_baseElement.fmMoney(v.mealFeeNegotiatedPrice) + '</td>' +
								'<td style="text-align:right;word-wrap:break-word;">' + $yt_baseElement.fmMoney(v.incidental) + '</td>' +
								'<td style="text-align:right;word-wrap:break-word;">' + $yt_baseElement.fmMoney(amountReceivable) + '</td>' +
								'<td class="already" style="text-align:right;word-wrap:break-word;">' + $yt_baseElement.fmMoney(v.netReceipts) + '</td>' +
								'<td class="account" style="text-align:right;word-wrap:break-word;">' + $yt_baseElement.fmMoney(v.uncollected) + '</td>' +
								'</tr>';
							trainingExpenseNegotiatedPriceSum+=v.trainingExpenseNegotiatedPrice;
							traineeNegotiatedPriceSum+=v.traineeNegotiatedPrice;
							quarterageNegotiatedPriceSum+=v.quarterageNegotiatedPrice;
							mealFeeNegotiatedPriceSum+=v.mealFeeNegotiatedPrice;
							incidentalSum+=v.incidental;
							amountReceivableSum += amountReceivable;
							netReceiptsSum += v.netReceipts;
							uncollectedSum += v.uncollected;
						});
						htmlTbody.html(htmlTr);
						htmlPlan += '<tr>' +
							'<td style="font-weight: bold;">' + "小计" + '</td>' +
							'<td style="text-align:right;font-weight: bold;">' + $yt_baseElement.fmMoney(trainingExpenseNegotiatedPriceSum) + '</td>' +
							'<td style="text-align:right;font-weight: bold;">' + $yt_baseElement.fmMoney(traineeNegotiatedPriceSum) + '</td>' +
							'<td style="text-align:right;font-weight: bold;">' + $yt_baseElement.fmMoney(quarterageNegotiatedPriceSum) + '</td>' +
							'<td style="text-align:right;font-weight: bold;">' + $yt_baseElement.fmMoney(mealFeeNegotiatedPriceSum) + '</td>' +
							'<td style="text-align:right;font-weight: bold;">' + $yt_baseElement.fmMoney(incidentalSum) + '</td>' +
							'<td style="text-align:right;font-weight: bold;">' + $yt_baseElement.fmMoney(amountReceivableSum) + '</td>' +
							'<td style="text-align:right;font-weight: bold;">'+$yt_baseElement.fmMoney(netReceiptsSum)+'</td>' +
							'<td style="text-align:right;font-weight: bold;">' + $yt_baseElement.fmMoney(uncollectedSum) + '</td>' +
							'</tr>';
						htmlTbody.append(htmlPlan);
					}else{
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="6" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						htmlTbody.html(htmlTr);
						$(".group-list-title").hide();
					}
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				};
				//单位列表和学员费用详情列表共用一个暂无数据提示
				if (groupLisstLen == 0) {//单位支付列表无数据
					if ($(".stu-list").css("display") == "none") {//学员费用详情无数据
						$(".group-list-box .list-thead").hide();//隐藏单位表头
						$(".stu-list").hide();//隐藏学员费用详情
					}else{//学员费用详情有数据
						$(".group-list-box").hide();//隐藏单位表
					};
				};
				if(search == "search"){//搜索查询
					$(".stu-list").show();//显示学员费用详情
				};
				search = "";
			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	/**
	 * 费用清单：费用详情列表委托
	 */
	getStudentCostsList: function() {
		var selectParam = $('.selectParam').val();
		var projectCode = $yt_common.GetQueryString("projectCode");
		$('.project-student-page').pageInfo({
			async: true,
			pageIndexs: 1,
			pageNum: 10000, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "finance/settlement/getDetailedPersonalList", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				projectCode: projectCode,
				selectParam: selectParam,
				trainingExpenseStart: "",
				trainingExpenseEnd: "",
				traineeNegotiatedPriceStart: "",
				traineeNegotiatedPriceEnd: "",
				quarterageStart: "",
				quarterageEnd: "",
				mealFeeStart: "",
				mealFeeEnd: "",
				otherChargesStart: "",
				otherChargesEnd: "",
				uncollectedStart: "",
				uncollectedEnd: ""
			}, //ajax查询访问参数
			before: function() {
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag == 0) {
					$('.project-student-tbody').empty();
					var htmlTbody = $('.project-student-tbody');
					var htmlTrSelection = '';
					var htmlTrBreak = '';
					if(data.data.rows.length > 0) {
						$(".amend-expense-list").show();
						$('.project-student-page').show();
						var arrivalTime = [];
						var departureTime = [];
						$(htmlTbody).empty();
						$.each(data.data.rows, function(i, v) {
							if (v.arrivalTime != "") {
								arrivalTime = v.arrivalTime.split(":"); 
								v.arrivalTime = arrivalTime[0]+':'+arrivalTime[1];
							};
							if (v.departureTime != "") {
								departureTime = v.departureTime.split(":");
								v.departureTime = departureTime[0]+':'+departureTime[1]
							};
							htmlTrSelection += '<tr>' +
								'<td class="groupNum">'+
									'<input type="hidden" value="' + v.headPortraitUrl + '" class="headPortraitUrl">' + (i+1) + '</td>' +
								'<td class="realName"><span class="stu-realname-look-info">'+
									'<input type="hidden" value="' + v.gender + '" class="gender">' + v.realName + '</span></td>' +
								'<td class="groupOrgName" style="text-align:left">'+
									'<input type="hidden" value="' + v.phone + '" class="phone">' + v.groupOrgName + '</td>' +
								'<td class="roomNumber">'+
									'<input type="hidden" value="' + v.idNumber + '" class="idNumber">' + v.roomNumber + '</td>' +
								'<td class="arrivalTime">'+v.arrivalTime + '</td>' +
								'<td class="departureTime">'+v.departureTime + '</td>' +
								'<td style="text-align:right" class="trainingExpenseNegotiatedPrice">'+
									'<input type="hidden" value="' + v.idNumber + '" class="idNumber">' + $yt_baseElement.fmMoney(v.trainingExpenseNegotiatedPrice) + '</td>' +
								'<td style="text-align:right">'+
								'<input type="hidden" value="' + v.deptPosition + '" class="deptPosition">' + $yt_baseElement.fmMoney(v.traineeNegotiatedPrice) + '</td>' +
								'<td style="text-align:right" class="quarterageNegotiatedPrice">'+
								'<input type="hidden" value="' + v.traineeId + '" class="traineeId hid-trainId">' + $yt_baseElement.fmMoney(v.quarterageNegotiatedPrice) + '</td>' +
								'<td style="text-align:right" class="mealFeeNegotiatedPrice">' + $yt_baseElement.fmMoney(v.mealFeeNegotiatedPrice) + '</td>' +
								'<td style="text-align:right" class="incidental">' + $yt_baseElement.fmMoney(v.incidental) + '</td>' +
								'<td style="text-align:right">' + $yt_baseElement.fmMoney(v.smallPlan) + '</td>' +
								'<td style="text-align:right">' + $yt_baseElement.fmMoney(v.cash) + '</td>' +
								'<td style="text-align:right">' + $yt_baseElement.fmMoney(v.creditCard) + '</td>' +
								'<td style="text-align:right">' + $yt_baseElement.fmMoney(v.wireTransfer) + '</td>' +
								'<td style="text-align:right">' + $yt_baseElement.fmMoney(v.moneyTotal) + '</td>' +
								'<td style="text-align:right">' + $yt_baseElement.fmMoney(v.uncollected) + '</td>' +
								'</tr>';
								htmlTrSelection = $(htmlTrSelection).data("data",v);
								htmlTbody.append(htmlTrSelection);
						});
							$(".detailed-hide-break").hide();
							$(".detailed-hide-selection").show();
					}else{
						htmlTrSelection = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="15" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
							htmlTbody.append(htmlTrSelection);
						if(search != "search"){//不是搜索查询
							$(".stu-list").hide();//隐藏学员费用详情
						};
						$('.project-student-page').hide();
						$(".amend-expense-list").hide();
					}
					$yt_baseElement.hideLoading();
					$(".page-stu").hide();
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
	 * 项目结算清单
	 */
	/**
	 * 单位支付信息
	 */
	getCompanyList1: function() {
		$yt_baseElement.showLoading();
		var projectCode = $yt_common.GetQueryString("projectCode");
		var groupLisstLen;
		$.ajax({
			async: false,
			url: $yt_option.base_path + "finance/settlement/getNoDetailedList", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				projectCode: projectCode
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				$('.project-company-tbody').empty();
				if(data.flag == 0) {
					//切换表头
					$('.diaoxun').show().siblings().hide();
					var htmlTbody = $('.project-company-tbody');
					var htmlTr = '';
					var htmlPlan = '';
					var amountReceivableSum = 0;
					var netReceiptsSum = 0;
					var uncollectedSum = 0;
					$(htmlTbody).empty();
					groupLisstLen = data.data.length;
					if (data.data.length != "") {
						$.each(data.data, function(i, v) {
							htmlTr += '<tr>' +
								'<td style="text-align:left;">' + v.groupName + '</td>' +
								'<td class="should" style="text-align:right;word-wrap:break-word;">' + $yt_baseElement.fmMoney(v.amountReceivable) + '</td>' +
								'<td class="already" style="text-align:right;word-wrap:break-word;">' + $yt_baseElement.fmMoney(v.netReceipts) + '</td>' +
								'<td class="account" style="text-align:right;word-wrap:break-word;">' + $yt_baseElement.fmMoney(v.uncollected) + '</td>' +
								'</tr>';
							amountReceivableSum += v.amountReceivable;
							netReceiptsSum += v.netReceipts;
							uncollectedSum += v.uncollected;
						});
						htmlTbody.html(htmlTr);
						htmlPlan += '<tr>' +
							'<td style="font-weight: bold;">' + "小计" + '</td>' +
							'<td style="text-align:right;font-weight: bold;">' + $yt_baseElement.fmMoney(amountReceivableSum) + '</td>' +
							'<td style="text-align:right;font-weight: bold;">' + $yt_baseElement.fmMoney(netReceiptsSum) + '</td>' +
							'<td style="text-align:right;font-weight: bold;">' + $yt_baseElement.fmMoney(uncollectedSum) + '</td>' +
							'</tr>';
						htmlTbody.append(htmlPlan);
					}else{
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="6" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
							htmlTbody.append(htmlTr);
							$(".group-list-title").hide();
					}
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}
				//调训单位列表和学员费用详情列表共用一个暂无数据提示
				if (groupLisstLen == 0) {//单位支付列表无数据
					if ($(".stu-list").css("display") == "none") {//学员费用详情无数据
						$(".group-list-box .list-thead").hide();//隐藏单位表头
						$(".stu-list").hide();//隐藏学员费用详情
					}else{//学员费用详情有数据
						$(".group-list-box").hide();//隐藏单位表
					}
				}
				if(search == "search"){//搜索查询
					$(".stu-list").show();//显示学员费用详情
				}
				search ="";
			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  

		});
	},
	/**
	 * 费用清单：学员费用详情调训
	 */
	getStudentCostsList1: function() {
		//初始化显示
		$(".group-list-title").show();
		$(".stu-list").show();
		$(".group-list-box").show();
		$(".group-list-box .list-thead").show();
		
//		$(".th-arrival-time").hide();
//		$(".th-departure-time").hide();
		var selectParam = $('.selectParam').val();
		var projectCode = $yt_common.GetQueryString("projectCode");
		$('.stu-list .project-student-page').pageInfo({
			async: false,
			pageIndexs: 1,
			pageNum: 10000, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "finance/settlement/getNoDetailedPersonalList", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam: selectParam,
				projectCode:projectCode,
				breakfastForStart:"",
				breakfastForEnd:"",
				numberLunchStart:"",
				numberLunchEnd:"",
				numberDinnerStart:"",
				numberDinnerEnd:"",
				otherChargesStart:"",
				otherChargesEnd:""
			}, //ajax查询访问参数
			before: function() {
				$yt_baseElement.showLoading();
			},
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				if(data.flag == 0) {
					$('.project-student-tbody').empty();
					var htmlTbody = $('.project-student-tbody');
					var htmlTrSelection = '';
					var htmlTrBreak = '';
				
					if(data.data.rows.length > 0) {
						$('.project-student-page').show();
						$(htmlTbody).empty();
						var breakfastForNum = 0;
						var numberLunchNum = 0;
						var numberDinnerNum = 0;
						var otherCostNum = 0;
						$.each(data.data.rows, function(i, v) {
							htmlTrBreak = '<tr>' +
								'<td>' + (i+1) + '</td>' +
								'<td><a style="color: #3c4687;" class="real-name-inf">' + v.realName + '</a></td>' +
								'<td style="text-align:left">' + v.groupOrgName + '</td>' +
								'<td>' + v.roomNumber + '</td>' + 
								'<td>' + v.arrivalTime + '</td>' + 
								'<td>' + v.departureTime + '</td>' + 
								'<td>' + v.checkInDate + '</td>' + 
								'<td style="text-align:right">' + v.breakfastFor + '</td>' +
								'<td style="text-align:right">' + v.numberLunch + '</td>' +
								'<td style="text-align:right">' + v.numberDinner + '</td>' +
								'<td style="text-align:right">' + $yt_baseElement.fmMoney(v.otherCost) + '</td>' +
								'<td><input type="hidden" class="hid-trainId train-id-info" name="" value="'+v.traineeId+'" /><a style="color: #3c4687;" class="cost-details" href="#">' + "详情" + '</a></td>' +
								'</tr>';
								breakfastForNum+=Number(v.breakfastFor);
								numberLunchNum+=Number(v.numberLunch);
								numberDinnerNum+=Number(v.numberDinner);
								otherCostNum+=Number(v.otherCost)
								htmlTrBreak = $(htmlTrBreak).data('data',v);
								htmlTbody.append(htmlTrBreak);
						});
							$('.detailed-hide-break').setDatas({
								breakfastForNum:breakfastForNum,
								numberLunchNum:numberLunchNum,
								numberDinnerNum:numberDinnerNum,
								otherCostNum:otherCostNum
							})
							$(".detailed-hide-selection").hide();
							$(".detailed-hide-break").show();
							
					}else{
						htmlTrBreak = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="9" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
							htmlTbody.append(htmlTrBreak);
						$('.project-student-page').hide();
						if(search != "search"){//不是搜索查询
							$(".stu-list").hide();//隐藏学员费用详情
						};
					}
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}
				$(".page-stu").hide();
			}, //回调函数 匿名函数返回查询结果  
			
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
		
	},
	//修改费用清单
	amendExpenseList:function(){
		//显示整体框架loading的方法
//		$yt_baseElement.showLoading();
		var me = this;
		var projectCode = $yt_common.GetQueryString("projectCode");
		var traineeId = $(".student-details-form .traineeId-hidden-input").val();
		var data = $(".yt-table-active").data('data');
		var costData = "";
		var costDataArr = [];
		var costjson = {
			trainingExpenseNegotiatedPrice:$yt_baseElement.rmoney($('.training-expense-negotiated-price-input').val()),
			traineeNegotiatedPrice:$yt_baseElement.rmoney($('.course-price').val()),
			quarterageNegotiatedPrice:$yt_baseElement.rmoney($('.quarterage-negotiated-price-input').val()),
			mealFeeNegotiatedPrice:$yt_baseElement.rmoney($('.meal-fee-negotiated-price-input').val()),
			incidental:$yt_baseElement.rmoney($('.incidental-input').val()),
			cash:$yt_baseElement.rmoney($('.real-money').text()),
			creditCard:$yt_baseElement.rmoney($('.card-money').text())
		}
		var costjsons={
			trainingExpenseNegotiatedPrice:'1',
			traineeNegotiatedPrice:'2',
			quarterageNegotiatedPrice:'3',
			mealFeeNegotiatedPrice:'4',
			incidental:'5',
			cash:'6',
			creditCard:'7'
		}
		for(i in costjson){
			if(costjson[i]!=data[i]){
				var arrCouncil={
					costType:costjsons[i],
					costOld:data[i],
					costNew:costjson[i]
				}
				costDataArr.push(arrCouncil);
			}
		}
//		$(".cost-of-listing tr.money-tr td").each(function (i,n){
//			var costType = "";
//			var costOld = "";
//			var costNew = "";
//			costType = $(n).find("span>input").val();
//			costOld = $(n).find("input.hidden-input").val();
//			if(i==5||i==6){
//				costNew = $yt_baseElement.rmoney($(n).find(".money").text());
//			}else{
//				costNew = $yt_baseElement.rmoney($(n).find("input.yt-input").val());
//			}
//			if(costNew==""){
//				costNew=0;
//			}
//			var arrCouncil={
//				costType:costType,
//				costOld:costOld,
//				costNew:costNew
//			}
//			costDataArr.push(arrCouncil);
//		});
		costDataArr = JSON.stringify(costDataArr);
		var json = {
			traineeNegotiatedPriceCash:$yt_baseElement.rmoney($('.traineeNegotiatedPriceCash').val()),
			traineeNegotiatedPriceCreditcard:$yt_baseElement.rmoney($('.traineeNegotiatedPriceCreditcard').val()),
			trainingExpenseCash:$yt_baseElement.rmoney($('.trainingExpenseCash').val()),
			trainingExpenseCreditcard:$yt_baseElement.rmoney($('.trainingExpenseCreditcard').val()),
			quarterageCash:$yt_baseElement.rmoney($('.quarterageCash').val()),
			quarterageCreditcard:$yt_baseElement.rmoney($('.quarterageCreditcard').val()),
			mealFeeCash:$yt_baseElement.rmoney($('.mealFeeCash').val()),
			mealFeeCreditcard:$yt_baseElement.rmoney($('.mealFeeCreditcard').val()),
			otherchargesCash:$yt_baseElement.rmoney($('.otherchargesCash').val()),
			otherchargesCreditcard:$yt_baseElement.rmoney($('.otherchargesCreditcard').val())
		}
		var json2 = {
			traineeNegotiatedPriceCash:'2,1',
			traineeNegotiatedPriceCreditcard:'2,2',
			trainingExpenseCash:'1,1',
			trainingExpenseCreditcard:'1,2',
			quarterageCash:'3,1',
			quarterageCreditcard:'3,2',
			mealFeeCash:'4,1',
			mealFeeCreditcard:'4,2',
			otherchargesCash:'5,1',
			otherchargesCreditcard:'5,2'
		}
		var netData=[];
		var netDataJson='';
		for(k in json){
			me.costOldMoney[k]==undefined?me.costOldMoney[k]='':me.costOldMoney[k]=me.costOldMoney[k];
			if(json[k]!=me.costOldMoney[k]){
				netDataJson = {
					costType:json2[k].split(',')[0],
					costDataType:json2[k].split(',')[1],
					costOld:me.costOldMoney[k],
					costNew:json[k]
				}
				netData.push(netDataJson);
			}
		}
		if(netData.length>0){
			netData = JSON.stringify(netData);
		}else{
			netData = '';
		}
			//入住时间和离开时间
		var roomNumber = data.roomNumber;
		var projectCode = $yt_common.GetQueryString("projectCode");
		var projectType = $yt_common.GetQueryString("projectType");
		var arrivalTime = $(".in-Date-hh").val();
		var departureTime = $(".out-Date-hh").val();
		var traineeName = data.realName;
		$.ajax({
			url: $yt_option.base_path + "finance/settlement/updateTraineeHotelDate", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			async: false,
			data: {
				roomNumber:roomNumber,
				projectCode:projectCode,
				projectType:projectType,
				arrivalTime:arrivalTime,
				departureTime:departureTime,
				traineeName:traineeName
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt(data.message);
					});
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt(data.message);
						$(".student-details-form").hide();
					});
				}
//				setTimeout(function(){
//					projectDetails.moneyData(projectCode,traineeId,costDataArr,netData);
//				},1000);
				if(data.message.indexOf('成功')!=-1){
					projectDetails.moneyData(projectCode,traineeId,costDataArr,netData);
				}
			}, //回调函数 匿名函数返回查询结果  
		});
	},
	/**
	 * 费用明细修改
	 */
	moneyData:function(projectCode,traineeId,costDataArr,netData){
		$.ajax({
			url: $yt_option.base_path + "finance/settlement/addTraineeCost", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			async: false,
			data: {
				projectCode: projectCode,
				traineeId: traineeId,
				traineeType:$('.project-student-tbody .yt-table-active').data('data').traineeType,
				costData: costDataArr,
				netData:netData
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt(data.message);
						$(".student-details-form").hide();
						projectDetails.getStudentCostsList();
						projectDetails.getCompanyList();
					});
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt(data.message);
						$(".student-details-form").hide();
					});
				}

			}, //回调函数 匿名函数返回查询结果
			error:function(){
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt('网络异常');
						$(".student-details-form").hide();
					});
			}
		});
	},
	/**
	 * 项目收入
	 */
	getIncomesList: function() {
		var selectParam = $('.project-income-study .selectParam').val();
		var projectCode = $yt_common.GetQueryString("projectCode");
		$('.project-in .project-student-page').pageInfo({
			async: true,
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "finance/settlement/getIncomeList", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam: selectParam,
				projectCode:projectCode
			}, //ajax查询访问参数
			before: function() {
				$yt_baseElement.showLoading();
			},
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				if(data.flag == 0) {
					$(".actual").text($yt_baseElement.fmMoney(data.data.amountReceivabletotal));
					$(".must").text($yt_baseElement.fmMoney(data.data.netReceiptsTotal));
					$('.project-income-student-tbody').empty();
					var htmlTbody = $('.project-income-student-tbody');
					var htmlTr = '';
					$(htmlTbody).empty();
					if(data.data.rows.length > 0) {
						$('.project-student-page').show();
						$.each(data.data.rows, function(i, v) {
//							v.moneyTotal=='0'?v.moneyTotal = Number(v.wireTransfer)+Number(v.creditCard)+Number(v.cash):v.moneyTotal=v.moneyTotal;
							var invoiceNums='';
							var tuitions='';
							if(v.invoiceOrderList!=undefined){
								$.each(v.invoiceOrderList,function(j,k){
									if (j != v.invoiceOrderList.length-1) {
										invoiceNums += '<p style="border-bottom:1px solid #EDEBEC;height:16px;" class="invoiceNums">'+k.invoiceNum+'</p>';
										tuitions +='<p style="border-bottom:1px solid #EDEBEC;height:16px;" class="tuitions">'+$yt_baseElement.fmMoney(k.tuition)+'</p>';
									}else{
										invoiceNums += '<p class="invoiceNums">'+k.invoiceNum+'</p>';
										tuitions +='<p class="tuitions">'+$yt_baseElement.fmMoney(k.tuition)+'</p>';
									}
								
								})
							}
							htmlTr += '<tr>' +
										'<td>' + (i+1) + '</td>' +
										'<td data-train="'+v.traineeId+'"><input type="hidden" class="hid-trainId" value="'+v.traineeId+'" /><a style="color: #3c4687;" class="real-name-inf">' + v.realName + '</a></td>' +
										'<td style="text-align:left">' + v.groupOrgName + '</td>' +
										'<td style="text-align:right">' + $yt_baseElement.fmMoney(v.trainingExpenseNegotiatedPrice) + '</td>' +
										'<td style="text-align:right">' + $yt_baseElement.fmMoney(v.traineeNegotiatedPrice) + '</td>' +
										'<td style="text-align:right">' + $yt_baseElement.fmMoney(v.quarterageNegotiatedPrice) + '</td>' +
										'<td style="text-align:right">' + $yt_baseElement.fmMoney(v.mealFeeNegotiatedPrice) + '</td>' +
										'<td style="text-align:right">' + $yt_baseElement.fmMoney(v.incidental) + '</td>' +
										'<td style="text-align:right">' + $yt_baseElement.fmMoney(v.smallPlan) + '</td>' +
										'<td style="text-align:right">' + $yt_baseElement.fmMoney(v.cash) + '</td>' +
										'<td style="text-align:right">' + $yt_baseElement.fmMoney(v.creditCard) + '</td>' +
										'<td style="text-align:right">' + $yt_baseElement.fmMoney(v.wireTransfer) + '</td>' +
										'<td style="text-align:right">' + $yt_baseElement.fmMoney(v.moneyTotal) + '</td>' +
										'<td style="padding:0px">' + invoiceNums + '</td>' +
										'<td style="padding:0px">' + tuitions + '</td>' +
										'</tr>';
						});
							htmlTbody.html(htmlTr);
							$('.invoiceNums').css('min-height',$('.tuitions').height()+'px');
							var lastNum=0;
							var allNum=0;
							$.each($('tbody.project-income-student-tbody tr'),function(i,n){
								if(lastNum==parseInt($(this).find('td').eq(8).text())){
									allNum=allNum+lastNum;
								}else{
									allNum=parseInt($(this).find('td').eq(8).text())+lastNum+allNum;
									lastNum=parseInt($(this).find('td').eq(8).text());
								}
								 
							});
					}else{
						$('.project-student-page').hide();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="13" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
							htmlTbody.html(htmlTr);
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
	 * 项目收入：费用减免情况
	 */
	getIncomeCostsList: function() {
		var selectParam = $('.selectParam').val();
		var projectCode = $yt_common.GetQueryString("projectCode");
		$('.project-income-page').pageInfo({
			async: true,
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "finance/settlement/getIncomeDetailsList", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam: selectParam,
				projectCode:projectCode
			}, //ajax查询访问参数
			before: function() {
				$yt_baseElement.showLoading();
			},
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.project-income-cost-tbody');
					var htmlTr = '';
					$(htmlTbody).empty();
					if(data.data!=null){
					if(data.data.rows.length > 0) {
						$(".checkInDateCount").text(data.data.checkInDateCount);
						$(".reductionAfterCount").text(data.data.reductionAfterCount);
						$(".reliefDaysCount").text(data.data.reliefDaysCount);
						$(".reliefMoneyCount").text(data.data.reliefMoneyCount);
						$('.project-income-page').show();
						$.each(data.data.rows, function(i, v) {
							if(v.groupNum==null){
								v.groupNum = ""
							}
							if(v.userType==1){
								v.userTypeVal='工作人员'
							}else if(v.userType==2){
								v.userTypeVal='学员'
							}else{
								v.userTypeVal=''
							}
							if(v.reductionAfter==undefined||v.reductionAfter==''){
								v.reductionAfter=0
							}
							var reductionAfterDate = Number(v.checkInDate)-Number(v.reductionAfter);
							var reductionAfterMoney = (Number(v.rackRate)*Number(v.checkInDate))-(Number(v.negotiatedPrice)*Number(v.reductionAfter));
							htmlTr = '<tr>' +
								'<td>' + (i+1) + '</td>' +
								'<td data-train="'+v.traineeId+'"><input type="hidden" class="hid-trainId" value="'+v.traineeId+'" /><a style="color: #3c4687;" class="real-name-inf">' + v.realName + '</a></td>' +
								'<td style="text-align:left">' + v.groupOrgName + '</td>' +
								'<td style="text-align:right">' + $yt_baseElement.fmMoney(v.rackRate) + '</td>' +
								'<td style="text-align:right">' + $yt_baseElement.fmMoney(v.negotiatedPrice) + '</td>' +
//								'<td style="text-align:right">' + $yt_baseElement.fmMoney(v.checkInDate) + '</td>' +
//								'<td style="text-align:right">' + $yt_baseElement.fmMoney(v.postRemissionMoney) + '</td>' +
								'<td>'+v.checkInDate+'</td>' +
								'<td><input type="text" class="yt-input reductionAfter" style="width:70px" value="'+v.reductionAfter+'"/></td>' +
								'<td class="reductionAfterDate">'+reductionAfterDate+'</td>' +
								'<td class="reductionAfterMoney">'+$yt_baseElement.fmMoney(reductionAfterMoney)+'</td>' +
								'</tr>';
								htmlTr = $(htmlTr).data('data',v);
								htmlTbody.append(htmlTr);
						});
						$('.reductionAfter').off('blur').on('blur',function(){
							$(this).val($(this).val().replace(/[^\d]/g,''));
							var v = $(this).parents('tr').data('data');
							var value = $(this).val();
							var reductionAfterDate = Number(v.checkInDate)-Number(value);
							var reductionAfterMoney = $yt_baseElement.fmMoney((Number(v.rackRate)*Number(v.checkInDate))-(Number(v.negotiatedPrice)*Number(value)));
							$(this).parents('tr').find('.reductionAfterDate').text(reductionAfterDate);
							$(this).parents('tr').find('.reductionAfterMoney').text(reductionAfterMoney);
						});
					}else{
						$('.project-income-page').hide();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="10" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
							htmlTbody.html(htmlTr);
					};
					}else{
						$('.project-income-page').hide();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="10" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
							htmlTbody.html(htmlTr);
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
	 * 总计各项减免
	 */
	getTotalList: function() {
		$yt_baseElement.showLoading();
		var projectCode = $yt_common.GetQueryString("projectCode");
		$.ajax({
			async: false,
			url: $yt_option.base_path + "finance/settlement/getDetailedReduction", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				projectCode: projectCode
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.project-total-cost-tbody');
					var htmlTr = '';
					if(data.data!=null){
					//if(data.data.length>0){
						htmlTbody.empty();
						htmlTr = '<tr>' +
							'<td>1</td>'+
							'<td>培训费减免</td>' +
							'<td style="text-align:right;"><input class="yt-input" style="text-align:right;display:none;" value="' + $yt_baseElement.fmMoney(data.data.trainingExpenseReduction) + '"/><span>' + $yt_baseElement.fmMoney(data.data.trainingExpenseReduction) + '</span></td>' +
							'<td repair-acc="true">' +'<span><img style="margin-right: 2px;" src="../../resources/images/icons/amend.png"></span>'+ '</td>' +
							'</tr>'+
							'<tr>' +
							'<td>2</td>'+
							'<td>课程费减免</td>' +
							'<td style="text-align:right;"><input class="yt-input" style="text-align:right;display:none;" value="' + $yt_baseElement.fmMoney(data.data.traineeNegotiatedPriceReduction) + '"/><span>' + $yt_baseElement.fmMoney(data.data.traineeNegotiatedPriceReduction) + '</span></td>' +
							'<td repair-acc="true">' +'<span><img style="margin-right: 2px;" src="../../resources/images/icons/amend.png"></span>'+ '</td>' +
							'</tr>'+
							'<tr>' +
							'<td>3</td>'+
							'<td>住宿费减免</td>' +
							'<td style="text-align:right;"><input class="yt-input" style="text-align:right;display:none;" value="' + $yt_baseElement.fmMoney(data.data.quarterageReduction) + '"/><span>' + $yt_baseElement.fmMoney(data.data.quarterageReduction) + '</span></td>' +
							'<td repair-acc="true">' +'<span><img style="margin-right: 2px;" src="../../resources/images/icons/amend.png"></span>'+ '</td>' +
							'</tr>'+
							'<tr>' +
							'<td>4</td>'+
							'<td>餐费减免</td>' +
							'<td style="text-align:right;"><input class="yt-input" style="text-align:right;display:none;" value="' + $yt_baseElement.fmMoney(data.data.mealFeeReduction) + '"/><span>' + $yt_baseElement.fmMoney(data.data.mealFeeReduction) + '</span></td>' +
							'<td repair-acc="true">' +'<span><img style="margin-right: 2px;" src="../../resources/images/icons/amend.png"></span>'+ '</td>' +
							'</tr>'+
							'<tr>' +
							'<td>5</td>'+
							'<td>杂费减免</td>' +
							'<td style="text-align:right;"><input class="yt-input" style="text-align:right;display:none;" value="' + $yt_baseElement.fmMoney(data.data.otherChargesReduction) + '"/><span>' + $yt_baseElement.fmMoney(data.data.otherChargesReduction) + '</span></td>' +
							'<td repair-acc="true">' +'<span><img style="margin-right: 2px;" src="../../resources/images/icons/amend.png"></span>'+ '</td>' +
							'</tr>';
						htmlTbody.html(htmlTr);
						var totalMoney = data.data.trainingExpenseReduction+data.data.traineeNegotiatedPriceReduction+data.data.quarterageReduction+data.data.otherChargesReduction+data.data.mealFeeReduction;
						$(".total-money").text($yt_baseElement.fmMoney(totalMoney,2));
					//}else{
//						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
//							'<td colspan="7" align="center" style="border:0px;">' +
//							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
//							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
//							'</div>' +
//							'</td>' +
//							'</tr>';
//							htmlTbody.html(htmlTr);
					//}
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
	//项目收入调巡
	projectRevenueTraining: function() {
		$yt_baseElement.showLoading();
		var projectCode = $yt_common.GetQueryString("projectCode");
		$.ajax({
			async: true,
			url: $yt_option.base_path + "finance/settlement/getNoDetailedList", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				projectCode: projectCode
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.project-revenue-training-tbody');
					var htmlTr = '';
					$(htmlTbody).empty();
					if(data.data.length>0){
						$.each(data.data, function(i, v) {
							htmlTr += '<tr>' +
								'<td style="text-align:center;">' + (i+1) + '</td>' +
								'<td class="should" style="text-align:left;word-wrap:break-word;">' + v.groupName + '</td>' +
								'<td class="already" style="text-align:right;word-wrap:break-word;">' + v.amountReceivable + '</td>' +
								'<td class="account" style="text-align:right;word-wrap:break-word;">' + v.netReceipts + '</td>' +
								'</tr>';
						});
						htmlTbody.html(htmlTr);
					}else{
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="4" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
							htmlTbody.html(htmlTr);
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
	 * 其他收入
	 */
	getOtherIncomeList: function() {
		//初始化显示
		$(".group-list-title").show();
		$(".stu-list").show();
		$(".group-list-box").show();
		$(".group-list-box .list-thead").show();
		var projectCode = $yt_common.GetQueryString("projectCode");
		var selectParam = $('#keyword').val();
		$('.project-income-other-page').pageInfo({
			async: true,
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "finance/settlement/getNoDetailedPersonalList", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam: selectParam,
				projectCode:projectCode,
				breakfastForStart:"",
				breakfastForEnd:"",
				numberLunchStart:"",
				numberLunchEnd:"",
				numberDinnerStart:"",
				numberDinnerEnd:"",
				otherChargesStart:"",
				otherChargesEnd:""
			}, //ajax查询访问参数
			before: function() {
				$yt_baseElement.showLoading();
			},
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				if(data.flag == 0) {
					if(data.data.otherCostTotal == null){
						data.data.otherCostTotal = 0;
					};
					if (data.data.netReceiptsTotal == null) {
						data.data.netReceiptsTotal = 0;
					};
					$(".other-receivables").text(data.data.otherCostTotal.toFixed(2));
					$(".other-paid-in").text(data.data.netReceiptsTotal.toFixed(2));
					$('.project-income-other-tbody').empty();
					var htmlTbody = $('.project-income-other-tbody');
					var htmlTrSelection = '';
					$(htmlTbody).empty()
					if(data.data.rows.length > 0) {
						$('.project-income-other-page').show();
						$.each(data.data.rows, function(i, v) {
							htmlTrSelection += '<tr>' +
								'<td>' + (i+1) + '</td>' +
								'<td><a style="color: #3c4687;" class="real-name-inf"><input type="hidden" class="hid-trainId" value="'+v.traineeId+'"/>' + v.realName + '</a></td>' +
								'<td style="text-align:left">' + v.groupOrgName + '</td>' +
								'<td style="text-align:right;">' + (v.otherCost||v.otherCost==0?v.otherCost.toFixed(2):'') + '</td>' +
								'<td style="text-align:right;">' + (v.netReceipts||v.otherCost==0?v.netReceipts.toFixed(2):'') + '</td>' +
								'</tr>';
						});
						if(true) {
							$(".income-hide").show();
							htmlTbody.html(htmlTrSelection);
						} else {
							$(".income-hide").hide();
						}
					}else{
						$('.project-income-other-page').hide();
						htmlTrSelection = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="5" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
							htmlTbody.append(htmlTrSelection);
					}
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}
				
				$(".income-search-btn").click(function(){
					projectDetails.getOtherIncomeList();
				});
				$('#keyword').val("");
			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	/**
	 * 获取项目支出列表数据
	 */
	getExpenditureListInf: function() {
		var projectCode = $yt_common.GetQueryString("projectCode");
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/settlement/getExpenditure",
			async: true,
			data: {
				projectCode:projectCode
			},
			objName: 'data',
			success: function(data) {
				if(data.flag == 0) {
					var expenseDetails = data.data.expenseDetails;
					var expenseClassDetails = data.data.expenseClassDetails;
					var otherCost = data.data.otherCost;
					var expenseDetailsTbody = $('.expenseDetails-tbody');
					var expenseDetailsTr = '';
					var expenseClassDetailsTbody = $('.expenseClassDetails-tbody');
					var expenseClassDetailsTr = '';
					var otherCostTbody = $('.otherCost-tbody');
					var otherCostTr = '';
					var faresNum = 0;
					var changeFeeRefundNum = 0;
					var expenseMoneyNum = 0;
					expenseDetailsTbody.empty();
					if(expenseDetails != ""){
						$.each(expenseDetails, function(i, v) {
							expenseDetailsTr += '<tr>' +
								'<td teacherId="'+ v.teacherId +'">' + (i+1) + '</td>' +
								'<td>' + v.teacherName + '</td>' +
								'<td>' + v.flighttrainNumber + '</td>' +
								'<td>' + v.placeDeparture + '</td>' +
								'<td>' + v.bourn + '</td>' +
								'<td>' + v.startEndTime + '</td>' +
								'<td style="text-align:right;">' + $yt_baseElement.fmMoney(v.fares) + '</td>' +
								'<td style="text-align:left;">' + v.changeFeeRefundDetails + '</td>' +
								'<td style="text-align:right;">' + $yt_baseElement.fmMoney(v.changeFeeRefund) + '</td>' +
								'<td style="text-align:right;">' + $yt_baseElement.fmMoney(v.expenseMoney) + '</td>' +
								'</tr>';
							faresNum += v.fares;
							changeFeeRefundNum += v.changeFeeRefund;
							expenseMoneyNum += v.expenseMoney;
						});
						expenseDetailsTr += '<tr>' +
						'<td>合计</td>' +
						'<td></td>' +
						'<td></td>' +
						'<td></td>' +
						'<td></td>' +
						'<td></td>' +
						'<td style="text-align:right;">' + $yt_baseElement.fmMoney(faresNum) + '</td>' +
						'<td></td>' +
						'<td style="text-align:right;">' + $yt_baseElement.fmMoney(changeFeeRefundNum) + '</td>' +
						'<td style="text-align:right;"><input class="expense-money-num" type="hidden" value="' + expenseMoneyNum + '" class="teacherId">' +$yt_baseElement.fmMoney(expenseMoneyNum) + '</td>' +
						'</tr>';

					}else{
						expenseDetailsTbody.empty();
						expenseDetailsTr += '<tr style="border:0px;background-color:#fff !important;" >' +
								'<td colspan="10" align="center" style="border:0px;">' +
								'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
								'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
								'</div>' +
								'</td>' +
							'</tr>';
					};
					expenseDetailsTbody.append(expenseDetailsTr);
					var afterTaxNum = 0;
					var surrenderPersonalNum = 0;
					var expenseMoneyNum = 0;
					if (expenseClassDetails != "") {
						expenseClassDetailsTbody.empty();
						$.each(expenseClassDetails, function(i, v) {
							i +=1;
							if( v.papersType ==1){
								 v.papersType ="身份证";
							}else if( v.papersType ==2){
								 v.papersType ="护照";
							}else if( v.papersType ==3){
								 v.papersType ="军官证";
							}else{
								 v.papersType ="其他";
							}
							expenseClassDetailsTr += '<tr>' +
								'<td><input type="hidden" value="' + v.teacherId + '" class="teacherId">' + i + '</td>' +
								'<td>' + v.teacherName + '</td>' +
								//1:身份证 2:护照 3:军官证 4:其他
								'<td>' + v.papersType + '</td>' +
								'<td>' + v.papersNumber + '</td>' +
								'<td>' + v.registeredBank + '</td>' +
								'<td>' + v.account + '</td>' +
								'<td>' + v.courseDate + '</td>' +
								'<td style="text-align:right;">' + $yt_baseElement.fmMoney(v.afterTax) + '</td>' +
								'<td style="text-align:right;">' + $yt_baseElement.fmMoney(v.surrenderPersonal) + '</td>' +
								'<td style="text-align:right;">' + $yt_baseElement.fmMoney(v.expenseMoney) + '</td>' +
								'</tr>';
							afterTaxNum += v.afterTax;
							surrenderPersonalNum += v.surrenderPersonal;
							expenseMoneyNum += v.expenseMoney;
							expenseClassDetailsTr += '<tr>' +
								'<td>合计</td>' +
								'<td></td>' +
								'<td></td>' +
								'<td></td>' +
								'<td></td>' +
								'<td></td>' +
								'<td></td>' +
								'<td style="text-align:right;">' + $yt_baseElement.fmMoney(afterTaxNum) + '</td>' +
								'<td style="text-align:right;">' + $yt_baseElement.fmMoney(surrenderPersonalNum) + '</td>' +
								'<td style="text-align:right;"><input class="out-expense-money-num" type="hidden" value="' + expenseMoneyNum + '" class="teacherId">' +$yt_baseElement.fmMoney(expenseMoneyNum) + '</td>' +
								'</tr>';
						});
					}else{
						expenseClassDetailsTbody.empty();
						expenseClassDetailsTr += '<tr style="border:0px;background-color:#fff !important;" >' +
								'<td colspan="10" align="center" style="border:0px;">' +
								'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
								'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
								'</div>' +
								'</td>' +
							'</tr>';
					};
					expenseClassDetailsTbody.html(expenseClassDetailsTr);
					var spendMoneyNum = 0;
					$('.otherCost-tbody tr td input').addClass('yt-input input-tr-repair');
					if(otherCost.length!=0){
						$.each(otherCost, function(i, v) {
	//						fieldTeachingFee	现场教学费
	//						trainingMaterialsFee	培训资料费
	//						trafficFee	交通费
	//						accommodationFee	住宿费
	//						foodFee	伙食费
	//						teacherFee	师资费
	//						otherFee	其他费
							if(v.costCode=="fieldTeachingFee"){
								$('.otherCost-tbody tr').eq(0).attr('costCode',v.costCode);
								$('.otherCost-tbody tr').eq(0).find('td').eq(2).find('span').text($yt_baseElement.fmMoney(v.spendMoney));
								$('.otherCost-tbody tr').eq(0).find('td').eq(3).find('span').text(v.details);
								$('.otherCost-tbody tr').eq(0).find('td').eq(2).find('input').val($yt_baseElement.fmMoney(v.spendMoney));
								$('.otherCost-tbody tr').eq(0).find('td').eq(3).find('input').val(v.details);
							}else if(v.costCode=="trainingMaterialsFee"){
								$('.otherCost-tbody tr').eq(1).attr('costCode',v.costCode);
								$('.otherCost-tbody tr').eq(1).find('td').eq(2).find('span').text($yt_baseElement.fmMoney(v.spendMoney));
								$('.otherCost-tbody tr').eq(1).find('td').eq(3).find('span').text(v.details);
								$('.otherCost-tbody tr').eq(1).find('td').eq(2).find('input').val($yt_baseElement.fmMoney(v.spendMoney));
								$('.otherCost-tbody tr').eq(1).find('td').eq(3).find('input').val(v.details);
							}
							else if(v.costCode=="trafficFee"){
								$('.otherCost-tbody tr').eq(2).attr('costCode',v.costCode);
								$('.otherCost-tbody tr').eq(2).find('td').eq(2).find('span').text($yt_baseElement.fmMoney(v.spendMoney));
								$('.otherCost-tbody tr').eq(2).find('td').eq(3).find('span').text(v.details);
								$('.otherCost-tbody tr').eq(2).find('td').eq(2).find('input').val($yt_baseElement.fmMoney(v.spendMoney));
								$('.otherCost-tbody tr').eq(2).find('td').eq(3).find('input').val(v.details);
							}
							else if(v.costCode=="accommodationFee"){
								$('.otherCost-tbody tr').eq(3).attr('costCode',v.costCode);
								$('.otherCost-tbody tr').eq(3).find('td').eq(2).find('span').text($yt_baseElement.fmMoney(v.spendMoney));
								$('.otherCost-tbody tr').eq(3).find('td').eq(3).find('span').text(v.details);
								$('.otherCost-tbody tr').eq(3).find('td').eq(2).find('input').val($yt_baseElement.fmMoney(v.spendMoney));
								$('.otherCost-tbody tr').eq(3).find('td').eq(3).find('input').val($yt_baseElement.fmMoney(v.details));
							}
							else if(v.costCode=="foodFee"){
								$('.otherCost-tbody tr').eq(4).attr('costCode',v.costCode);
								$('.otherCost-tbody tr').eq(4).find('td').eq(2).find('span').text($yt_baseElement.fmMoney(v.spendMoney));
								$('.otherCost-tbody tr').eq(4).find('td').eq(3).find('span').text(v.details);
								$('.otherCost-tbody tr').eq(4).find('td').eq(2).find('input').val($yt_baseElement.fmMoney(v.spendMoney));
								$('.otherCost-tbody tr').eq(4).find('td').eq(3).find('input').val(v.details);
							}
							else {
								$('.otherCost-tbody tr').eq(5).attr('costCode',v.costCode);
								$('.otherCost-tbody tr').eq(5).find('td').eq(2).find('span').text($yt_baseElement.fmMoney(v.spendMoney));
								$('.otherCost-tbody tr').eq(5).find('td').eq(3).find('span').text(v.details);
								$('.otherCost-tbody tr').eq(5).find('td').eq(2).find('input').val($yt_baseElement.fmMoney(v.spendMoney));
								$('.otherCost-tbody tr').eq(5).find('td').eq(3).find('input').val(v.details);
							}
	//						otherCostTr += '<tr>' +
	//							'<td class="costCode">' + (i+1) + '</td>' +
	//							'<td>' + v.costName + '</td>' +
	//							'<td style="padding: 0px;"><input type="number" class="spendMoney" style="width: 99%;height: 30px;border-radius: 2px;border:1px solid #dfe6f3;" value="' + v.spendMoney + '" /></td>' +
	//							'<td style="padding: 0px;"><input class="details" style="width: 99%;height: 30px;border-radius: 2px;border:1px solid #dfe6f3;" value="' + v.details + '" /></td>' +
	//							'</tr>';
							spendMoneyNum += v.spendMoney;
							$('.otherCost-tbody tr').eq(6).find('td').eq(1).text($yt_baseElement.fmMoney(spendMoneyNum));
						});
					}
//					otherCostTr ='';
//					otherCostTbody.append(otherCostTr);
					//其他费用总计
					$("input.spendMoney").blur(function() {
						var firstSpendMoney = 0;
						$("input.spendMoney").each(function(i, n) {
							firstSpendMoney = firstSpendMoney + parseFloat($(n).val());
						});
						$(".all-spend-money-total").val(firstSpendMoney);
						$('.spendMoneyTotal').text($yt_baseElement.fmMoney(firstSpendMoney));
					});
					$yt_baseElement.hideLoading();
					$(".teach-total-money").text($yt_baseElement.fmMoney($yt_baseElement.rmoney($(".expense-money-num").val())+$yt_baseElement.rmoney($(".out-expense-money-num").val())+$yt_baseElement.rmoney($(".spendMoneyTotal").text())));
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				};
				$(".otherCost-tbody").find(".money-pay").blur(function(){
					var totalMoney = 0;
					$.each($(".otherCost-tbody").find(".money-pay"), function(m,n) {
						totalMoney +=$yt_baseElement.rmoney($(n).val());
					});
					$('.spendMoneyTotal').text($yt_baseElement.fmMoney(totalMoney));
					$(".teach-total-money").text($yt_baseElement.fmMoney($yt_baseElement.rmoney($(".expense-money-num").val())+$yt_baseElement.rmoney($(".out-expense-money-num").val())+$yt_baseElement.rmoney(totalMoney)));
					$(this).val($yt_baseElement.fmMoney($(this).val()));
				});
			}
		});
	},
	getOutFile: function() {
		var projectCode = $yt_common.GetQueryString("projectCode");
		var projectName = $(".page-title .project-name").text();
		var selectParam = $(".project-income-div .selectParam").text();
		$.ajaxDownloadFile({
			url: $yt_option.base_path + "finance/settlement/exportIncomeList",
			data: {
				projectCode: projectCode,
				projectName: projectName,
				selectParam:selectParam
			}
		});
	},
	//项目收入（选学、委托）-第二个列表(费用减免情况)-提交减免后天数
	updateIncome:function(){
		var traineeJson = [];
		$.each($('.project-income-cost-tbody').find('tr'), function(i,n) {
			var data = $(n).data('data');
			var json = {
				userType:data.userType,
				traineeId:data.traineeId,
				reductionAfter:$(n).find('.reductionAfter').val()
			}
			traineeJson.push(json);
		});
		traineeJson = JSON.stringify(traineeJson);
		$.ajax({
			type:"post",
			url:$yt_option.base_path+"finance/settlement/updateIncomeDetailsList",
			async:false,
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			data:{
				projectCode:$yt_common.GetQueryString("projectCode"),
				traineeJson:traineeJson
			},
			success:function(data){
				if(data.flag==0){
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt('提交成功');
					})
				}else{
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt('提交失败');
					})
				}
			},
			error:function(){
				$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt('网络异常，提交失败');
				})
			}
		});
		projectDetails.getIncomeCostsList();
	}
}
$(function() {
	//初始化方法
	projectDetails.init();

});