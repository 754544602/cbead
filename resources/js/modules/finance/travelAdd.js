var caList = {
	ue: null,
	//初始化方法
	init: function() {
		var me = this;
		//初始化新增页面
		caList.clearAlertBox();
		//初始化下拉列表
		$('#types').niceSelect();
		$('#where').niceSelect();
		caList.deleteInfo();
		if($("#types").val() == 1) {
			$('#reimbursementTitle').text('新增教师课酬报销')
		} else if($("#types").val() == 2) {
			$('#reimbursementTitle').text('新增教师差旅报销')
		}
		$("#types").change(function() {
			if($("#types").val() == 1) {
				$('#reimbursementTitle').text('新增教师课酬报销');
				$yt_baseElement.showLoading();
				setTimeout(window.location.href = 'reimbursementAdd.html', 500);
				setTimeout($yt_baseElement.hideLoading(), 500);

			} else if($("#types").val() == 2) {
				$('#reimbursementTitle').text('新增教师差旅报销');
				$yt_baseElement.showLoading();
				setTimeout(window.location.href = 'travelAdd.html', 500);
				setTimeout($yt_baseElement.hideLoading(), 500);
			}
		})
		//查询剩余预算
		//		caList.lookFor();
		caList.relevance();
		//初始化创建时间
		$("#issueDayeString").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			lowerLimit: "2010/01/01", // 日期下限，默认：NaN(不限制)     
			nowData: true, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd HH:mm",
			callback: function() {} // 点击选择日期后的回调函数  
		});
		//班级列表下拉框
		caList.getClassLis();
		//下一步操作人
		var nextPersonList = caList.getNextOperatePerson();
		if(nextPersonList != null) {
			$.each(nextPersonList, function(i, n) {
				$("#dealingWithPeople").append($('<option value="' + n.userCode + '">' + n.userName + '</option>').data("classData", n));
			});
		};
		//修改页面
		var pkId = $yt_common.GetQueryString("pkId");
		if(pkId!=null){
			caList.getListUpdate(pkId);
		}
		//初始化下一步操作人下拉框
		$("#dealingWithPeople").niceSelect();

		//点击返回
		$('.page-return-btn').off().on("click", function() {
			//调用返回指定页面函数
			caList.backNewsListPage();
		});

		//点击取消
		$('#cancel').off().on("click", function() {
			//调用返回指定页面函数
			caList.backNewsListPage();
		});

		//点击保存
		$('#save').off('click').on('click', function() {
			if($('#projectCode').val()!=""){
//				if(Number($yt_baseElement.rmoney($('#projectUsermoney').text()))<Number($yt_baseElement.rmoney($('#expenseMoneySum').text()))){
//					$yt_alert_Model.prompt('项目剩余预算不足，请申请预算变更');
//					return false;
//				}
				//调用判空函数
				caList.isNoNull(1);
			}else{
				$yt_alert_Model.prompt("请选择班级");
			}
		});
		//点击提交
		$('#submit').off('click').on('click', function() {
			
			if($('#projectCode').val()!=""){
				if(Number($yt_baseElement.rmoney($('#projectUsermoney').text()))<Number($yt_baseElement.rmoney($('#expenseMoneySum').text()))){
					$yt_alert_Model.prompt('项目剩余预算不足，请申请预算变更');
					return false;
				}
				var bool = true;
				$.each($('.twoTr'), function(i,n) {
				var data = $(n).data('data');
				if(data.papersNumber==''||data.registeredBank==''||data.account==''||data.papersType==''){
						    $yt_alert_Model.alertOne({  
						        haveCloseIcon: true, //是否带有关闭图标  
						        leftBtnName: "确定", //左侧按钮名称,默认确定  
						        cancelFunction: "", //取消按钮操作方法*/  
						        alertMsg: "选择电汇支付的教师，证件类型、证件号、开户行、账号不能为空，请将信息补全后再次提交", //提示信息  
						    });  
						    bool =false;
						    return false;
					}
			});
				if(bool){
					//调用判空函数
					caList.isNoNull(2);
				}
			}else{
				$yt_alert_Model.prompt("请选择班级");
			}
		});
		//关联页签跳转
		$(".tab-title-list button").click(function() {
			$(this).addClass("active").siblings().removeClass("active");
			operate = $(this).text();
			if(operate == "• 机票") {
				$('#planTable').show();
				$('#trainTable').hide();
				me.linkList(1);
			}
			//operate为2查询发票列表，
			if(operate == "• 火车票") {
				$('#planTable').hide();
				$('#trainTable').show();
				me.linkList(2);
			}
		});
		//选择关联数据
		$('#planTable').on('change', '.select-plan-checkbox input:checked', function() {
			//获取当前行数据
			var planData = $(this).parent().parent().parent().data('planData');
			//出票日期更改格式
			planData.dateExit = planData.dateExit.replace('-', '');
			planData.dateExit = planData.dateExit.replace('-', '');
			var linkLi = '';
			linkLi = '<li class="link-li link-li' + planData.pkId + '" teacherStatementDetailsIds="' + planData.pkId + '">' + planData.dateExit + '-' + planData.passenger + '-' + planData.trainNumber + '<span class="delete-link" style="color: red;cursor: pointer;">×</span></li>';
			$('.link-ul').append(linkLi);
			//给一个pkId数据
			$('.link-li' + planData.pkId).data('pkId', planData.pkId);
		})
		$('#planTable').on('change', '.select-plan-checkbox input:not(:checked)', function() {
			var planData = $(this).parent().parent().parent().data('planData');
			$('.link-li' + planData.pkId).remove();
		})
		//火车票
		$('#trainTable').on('change', '.select-train-checkbox input:checked', function() {
			//获取当前行数据
			var trainData = $(this).parent().parent().parent().data('trainData');
			//出票日期更改格式
			trainData.dateExit = trainData.dateExit.replace('-', '');
			trainData.dateExit = trainData.dateExit.replace('-', '');
			var linkLi = '';
			linkLi = '<li class="link-li link-li' + trainData.pkId + '" teacherStatementDetailsIds="' + trainData.pkId + '">' + trainData.dateExit + '-' + trainData.passenger + '-' + trainData.trainNumber + '<span class="delete-link" style="color: red;cursor: pointer;">×</span></li>';
			$('.link-ul').append(linkLi);
			//给一个pkId数据
			$('.link-li' + trainData.pkId).data('pkId', trainData.pkId);
		})
		$('#trainTable').on('change', '.select-train-checkbox input:not(:checked)', function() {
			var trainData = $(this).parent().parent().parent().data('trainData');
			$('.link-li' + trainData.pkId).remove();
		})
		//全选 关联数据
		$("#planTable .check-all").change(function() {
			//判断自己是否被选中  
			if($(this).parent().hasClass("check")) {
				//设置反选  
				$(this).parents("table").find("tbody input[type='checkbox']").setCheckBoxState("uncheck");
				$.each($(this).parents("table").find(".select-plan-checkbox input:not(:checked)"), function(a, b) {
					var planData = $(b).parent().parent().parent().data('planData');
					$('.link-li' + planData.pkId).remove();
				})
			} else {
				//调用设置选中方法,全选  
				$(this).parents("table").find("tbody input[type='checkbox']").setCheckBoxState("check");
				$.each($(this).parents("table").find(".select-plan-checkbox input:checked"), function(a, b) {
					//获取当前行数据
					var planData = $(b).parent().parent().parent().data('planData');
					if($('.link-li').hasClass('link-li' + planData.pkId) == false) {
						//出票日期更改格式
						planData.dateExit = planData.dateExit.replace('-', '');
						planData.dateExit = planData.dateExit.replace('-', '');
						var linkLi = '';
						linkLi = '<li class="link-li link-li' + planData.pkId + '" teacherStatementDetailsIds="' + planData.pkId + '">' + planData.dateExit + '-' + planData.passenger + '-' + planData.trainNumber + '<span class="delete-link" style="color: red;cursor: pointer;">×</span></li>';
						$('.link-ul').append(linkLi);
						//给一个pkId数据
						$('.link-li' + planData.pkId).data('pkId', planData.pkId);
					}
				});
			}
		});
		//火车票
		$("#trainTable .check-all").change(function() {
			//判断自己是否被选中  
			if($(this).parent().hasClass("check")) {
				//设置反选  
				$(this).parents("table").find("tbody input[type='checkbox']").setCheckBoxState("uncheck");
				$.each($(this).parents("table").find(".select-train-checkbox input:not(:checked)"), function(a, b) {
					var trainData = $(b).parent().parent().parent().data('trainData');
					$('.link-li' + trainData.pkId).remove();
				})
			} else {
				//调用设置选中方法,全选  
				$(this).parents("table").find("tbody input[type='checkbox']").setCheckBoxState("check");
				$.each($(this).parents("table").find(".select-train-checkbox input:checked"), function(a, b) {
					//获取当前行数据
					var trainData = $(b).parent().parent().parent().data('trainData');
					if($('.link-li').hasClass('link-li' + trainData.pkId) == false) {
						//出票日期更改格式
						trainData.dateExit = trainData.dateExit.replace('-', '');
						trainData.dateExit = trainData.dateExit.replace('-', '');
						var linkLi = '';
						linkLi = '<li class="link-li link-li' + trainData.pkId + '" teacherStatementDetailsIds="' + trainData.pkId + '">' + trainData.dateExit + '-' + trainData.passenger + '-' + trainData.trainNumber + '<span class="delete-link" style="color: red;cursor: pointer;">×</span></li>';
						$('.link-ul').append(linkLi);
						//给一个pkId数据
						$('.link-li' + trainData.pkId).data('pkId', trainData.pkId);
					}
				});
			}
		});
		//删除关联数据
		$('.travel-top').on('click', '.delete-link', function() {
			var pkId = $(this).parent().data('pkId');
			//找到对应行的数据取消check
			$('.planTr' + pkId).find('.select-plan-checkbox input:checked').setCheckBoxState("uncheck");
			$('.trainTr' + pkId).find('.select-plan-checkbox input:checked').setCheckBoxState("uncheck");
			$(this).parent().remove();
		});

		//关联提交
		$('.linkData').click(function() {
			//隐藏页面中自定义的表单内容  
			$(".travel-import-form").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
			var trClass = $(".travel-import-form").attr('trClass');
			var trClass = trClass.substring(trClass.lastIndexOf(" ") + 1, trClass.length);
			$('.' + trClass).find('.bookingRecord').empty();
			$.each($('.link-li'), function(k, c) {
				var ctext = $(c).text().replace('×', '');
				var divList = '<div teacherStatementDetailsId="' + $(c).attr('teacherstatementdetailsids') + '">' + ctext + '</div>';
				$('.' + trClass).find('.bookingRecord').append(divList);
			})
		})
		//模糊查询
		$(".search-btn").click(function(){
			var type = "";
			if($(".cost-btn").hasClass("active")){
				type = "1";
			}else{
				type = "2";
			}
			me.linkList(type);
		});
	},
	//返回新闻稿列表
	backNewsListPage: function() {
		window.location.href = 'reimbursementList.html';
	},
	
	/**
	 * 获取所有班级
	 */
	getClassLis: function() {
		var projectCode = $yt_common.GetQueryString("projectCode");
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/reduction/lookForAllProject",
			data: {
				projectCode:projectCode
			},
			async: false,
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag==0){
					var userName = caList.userInfo();
					var projectHeadCode;
					var classTeacherCode;
					var projectSellCode;
					var projectAidCode;
					$.each(data.data, function(i, n) {
						//项目主任code
						projectHeadCode = n.projectHeadCode;
						//班主任code
						classTeacherCode = n.classTeacherCode;
						//项目销售code
						projectSellCode = n.projectSellCode;
						//项目助理code
						projectAidCode = n.projectAidCode;
						if(projectHeadCode.indexOf(userName) != -1 || classTeacherCode.indexOf(userName) != -1 || projectSellCode.indexOf(userName) != -1 || projectHeadCode.indexOf(userName) != -1 || projectAidCode.indexOf(userName) != -1){
							$("#projectCode").append($('<option value="' + n.projectCode + '">' + n.projectName + '</option>').data("classData", n));
						}
					});
					if(projectCode!=null){
				    	if(projectCode!=''){
							$("#projectUsermoney").text(data.data[0].projectSurplusBudget);
							$('#endDate').text(data.data[0].endDate);
							$('#startDate').text(data.data[0].startDate);
				    	}
				    }
					$("select.user-name-sel").niceSelect({  
				        search: true,  
				        backFunction: function(text) {  
				            //回调方法,可以执行模糊查询,也可自行添加操作  
				            $("select.user-name-sel option").remove();  
				            if(text == "") {  
				                $("select.user-name-sel").append('<option value="">请选择</option>');  
				            }  
				            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
				            $.each(data.data, function(i, n) {  
				            	//项目主任code
								projectHeadCode = n.projectHeadCode;
								//班主任code
								classTeacherCode = n.classTeacherCode;
								//项目销售code
								projectSellCode = n.projectSellCode;
								//项目助理code
								projectAidCode = n.projectAidCode;
								if(n.projectName.indexOf(text) != -1) {  
									if(projectHeadCode.indexOf(userName) != -1 || classTeacherCode.indexOf(userName) != -1 || projectSellCode.indexOf(userName) != -1 || projectHeadCode.indexOf(userName) != -1 || projectAidCode.indexOf(userName) != -1){
										$("#projectCode").append($('<option value="' + n.projectCode + '">' + n.projectName + '</option>').data("classData", n));
									}
								}
				            });  
				        }  
				    });  
					//选择班级获取项目主任名
					$('#projectCode').off().on('change', function() {
						var createUserName = $('#projectCode option:selected').data("classData").createUserName;
						createUserName==null?createUserName='':createUserName=createUserName;
						var projectHead = $('#projectCode option:selected').data("classData").projectHead;
						projectHead==null?projectHead='':projectHead=projectHead;
//						$('#createUserName').text(createUserName);
						$('#projectHead').text(projectHead);
						//预算
						$("#projectUsermoney").text($('#projectCode option:selected').data('classData').projectSurplusBudget);
						var projectCode = $('#projectCode option:selected').data("classData").projectCode;
						$('#endDate').text($('#projectCode option:selected').data('classData').endDate);
						$('#startDate').text($('#projectCode option:selected').data('classData').startDate);
						caList.getListAdd(projectCode);
						$('#two-table').empty();
						$('#two-table').parents('table').hide();
					})
				}else{
					$yt_alert_Model.prompt("查询失败");
				}
				$yt_baseElement.hideLoading();
			},
			error:function(){
				$yt_baseElement.hideLoading();
				$yt_alert_Model.prompt("网络异常，请稍后重试");
			}
		});
	},
	//获取登录人信息
	userInfo: function() {
		var userName = "";
		$.ajax({
			async: false,
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "uniform/user/getUsersDetails", //ajax访问路径  
			data: {}, //ajax查询访问参数
			success: function(data) {
				userName = data.data.userName;
				$('#createUserName').text(data.data.userRealName);
			}
		});
		return userName;
	},
	//点击保存，提交判断页面中数据是否为空
	isNoNull: function(dataStates) {
		var testSelect = $("#types").val();
		var className = $('#projectCode option:selected').val();
		var dealingWithPeople = $('#dealingWithPeople').val();
		$yt_valid.validForm($("#valid-tab"));
		if(testSelect == '' || className == '' || dealingWithPeople == '') {
			//框架判空函数
			$yt_valid.validForm($(".valid-tab"));
		} else {
			//调用提交，保存函数
			caList.addnewsInfo(dataStates);
		}

	},
	//点击保存，提交判断页面中数据是否为空
	/*isNoNull:function(dataStates){
		$yt_valid.validForm($("#valid-tab"));
		if(title=="" || details==""){
			$yt_valid.validForm($(".valid-tab"));
		}else{
			caList.addnewsInfo(dataStates);
		}
		
	},*/
	/**
	 * 获下一步操作人
	 */
	getNextOperatePerson: function() {
		var user = null;
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/workFlowOperate/getSubmitPageData",
			data: {
				businessCode: "travelExpense",
				types: '1'
			},
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					$.each(data.data, function(i, n) {
						for(var k in n) {
							user = n[k];
						}
					});

				}
			}
		});
		return user;
	},
	//点击新增清空弹窗内容
	clearAlertBox: function() {
		$('#projectCode').val("");
		$('#projectUserName').val("");
		$('#types').val("");
		$('#dealingWithPeople').val("");
		//$('select').niceSelect();
	},

	getList: [],
	//修改
	getListUpdate: function(pkId) {
		me = this;
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/teacherExpense/getBeanByIdTravel",
			async: false,
			data: {
				pkId: pkId
			},
			success: function(data) {
				if(data.flag == 0) {
					caList.ue = data.data;
					$("select.type-select").setSelectVal(data.data.expenseType);
					$("select.user-name-sel").setSelectVal(data.data.projectCode);
					var projectHead = data.data.projectHead;
					var projectSurplusBudget =$('#projectCode option:selected').data("classData").projectSurplusBudget;			
					$('#projectHead').text(projectHead);
					if(pkId != '') {

					}
					$('#projectUsermoney').text(projectSurplusBudget);
					$('.details').text(data.data.remarks);
					$('.remarks').val(data.data.remarks);
					var projectCode = $('#projectCode option:selected').data("classData").projectCode;
					me.getListAdd(projectCode);
					$('#reimbursementTitle').text('修改教师差旅报销')
			}}
		})
	},
	//列表
	getListAdd: function(projectCode) {
		var me = this;
		var pkId = $yt_common.GetQueryString("pkId");
		pkId == null ? pkId='':pkId=pkId;
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/teacherExpense/getTeacherTrainDetails",
			async: true,
			data: {
				projectCode: projectCode,
				pkId:pkId
			},
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag == 0) {
					me.getList = data.data;
					var htmlTbody = $('.class-tbody');
					var twoBody = $('#two-table');
					var twoTr = '';
					var htmlTr = '';
					htmlTbody.empty();
					if(data.data.length > 0) {
						var num = 0;
						var allTravelmoney = 0;
						//保险总和
						var insuranceSum = 0;
						//票价总和
						var salesPriceSum = 0;
						//退票改签费总和
						var refundSigningFeeSum = 0;
						//总报销费
						var expenseMoneySum = 0;
						//支票总计
						var checksalesPriceSum = 0;
						var checkinsuranceSum = 0;
						var checkrefundSigningFeeSum = 0;
						var checkexpenseMoneySum = 0;
						$.each(data.data, function(i, v) {
							allTravelmoney = Number(v.salesPrice) + Number(v.insurance) + Number(v.refundSigningFee);
							salesPriceSum += Number(v.salesPrice);
							insuranceSum += Number(v.insurance);
							refundSigningFeeSum += Number(v.refundSigningFee);
							expenseMoneySum += allTravelmoney;
							if(v.papersType == '1') {
								v.papersTypeVel = '身份证';
							}
							else if(v.papersType == '2') {
								v.papersTypeVel = '护照';
							}
							else if(v.papersType == '3') {
								v.papersTypeVel = '港澳通行证';
							} else if(v.papersType == '4') {
								v.papersTypeVel = '军官证';
							} else if(v.papersType == '5') {
								v.papersTypeVel = '其他';
							} else {
								v.papersTypeVel = ' ';
							}
							if(v.paymentMethod == 1) {
								v.paymentMethodVel = '支票';
								checksalesPriceSum += Number(v.salesPrice);
								checkrefundSigningFeeSum += Number(v.refundSigningFee);
								checkexpenseMoneySum += allTravelmoney;
								checkinsuranceSum += Number(v.insurance);
							}
							else if(v.paymentMethod == 2) {
								v.paymentMethodVel = '电汇'
							}
							else if(v.paymentMethod == 3) {
								v.paymentMethodVel = '归还公务卡'
							}
							else if(v.paymentMethod == 4) {
								v.paymentMethodVel = '现金'
							}
							else if(v.paymentMethod == 5) {
								v.paymentMethodVel = '核销借款'
							}else{
								v.paymentMethodVel = ''
							}
							if(v.flighttrainNumber == undefined) {
								if(v.flightTrainNumber!=undefined){
									v.flighttrainNumber = v.flightTrainNumber;
								}else{
									v.flighttrainNumber=''
								}
							}
							num = i + 1;
							var bookingRecord = '';
							if(v.bookingRecord!=undefined){
								$.each(v.bookingRecord, function(x, y) {
								bookingRecord += '<div teacherStatementDetailsId="' + y.teacherStatementDetailsId + '">' + y.teacherStatementDetails + '</div>'
								});
							}
							if(v.warehousePositionDetails==undefined){
								v.warehousePositionDetails='';
							}
							htmlTr = '<tr  class="rows tr' + i + ' row' + i + '" teacherId="' + v.teacherId + '">' +
								/*序号*/
								'<td style="text-align:center" class="num">' + num + '</td>' +
								/*教师*/
								'<td style="text-align:center"><a class="teacherName" target="teacherName" style="color:#2080bf">' + v.teacherName + '</a></td>' +
								/*航班车次*/
								'<td style="text-align:center">' + v.flighttrainNumber + '</td>' +
								/*出发地*/
								'<td>' + v.placeDeparture + '</td>' +
								/*目的地*/
								'<td>' + v.bourn + '</td>' +
								/*仓位*/
								'<td><select class="yt-select warehousePosition" style="width: 100%;">' + '<option value="">请选择</option>'+
								'<option value="1">头等舱</option>'+
								'<option value="2">商务舱</option>'+
								'<option value="3">经济舱</option>'+
								'<option value="4">商务座</option>'+
								'<option value="5">一等座</option>'+
								'<option value="6">二等座</option>'+
								'<option value="7">软卧</option>'+
								'<option value="8">硬卧</option>'+
								'<option value="9">软座</option>'+
								'<option value="10">硬座</option>'+
								'</select></td>' +
								/*仓位说明*/
								'<td><textarea class="yt-textarea warehousePositionDetails" placeholder="请输入" style="height:28px;line-height:28px;width:150px">'+v.warehousePositionDetails+'</textarea></td>' +
								/*起止时间*/
								'<td>' + v.startEndTime + '</td>' +
								/*票价*/
								'<td class="salesPriceTd"><input type="text" class="salesPrice yt-input" value="' + $yt_baseElement.fmMoney(v.salesPrice,2) + '" readonly="readonly" style="font-size:12px;border:none;background:none;text-align:right"/></td>' +
								/*保险*/
								'<td style="text-align:right"><input type="text" class="insurance yt-input" value="' + $yt_baseElement.fmMoney(v.insurance,2) + '" readonly="readonly" style="font-size:12px;border:none;background:none;text-align:right"/></td>' +
								/*退改签费*/
								'<td class="refundSigningFeeTd"><input type="text" class="refundSigningFee yt-input" value="' + $yt_baseElement.fmMoney(v.refundSigningFee,2) + '" readonly="readonly" style="font-size:12px;border:none;background:none;text-align:right"/></td>' +
								/*报销总金额*/
								'<td class="allTravelmoney" style="text-align:right">' + $yt_baseElement.fmMoney(allTravelmoney,2) + '</td>' +
								/*付款方式*/
								'<td style="text-align:center"><select class="yt-select select-hide" style="width: 100%;display:none;">' + '<option value="">请选择</option><option value="1">支票</option><option value="2">电汇</option><option value = "3" >归还公务卡 </option><option value="4">现金 </option><option value="5">核销借款</option></select>' + '</td > ' +
								/*关联订票记录*/
								'<td style="text-align:center" class="bookingRecord">' + bookingRecord + '</td>' +
								/*操作*/
								'<td style="text-align:center"><a class="relevance-tb">关联</a><span> </span><a class="delete-tb" style="color:red;">删除</a><span> </span><a class="update-tb">编辑</a></td>' +
								'</tr>';
								htmlTbody.append(htmlTr);
								$('.tr' + i).find('.select-hide').niceSelect();
								$('.tr' + i).find('.warehousePosition').niceSelect();
								$('.tr' + i).find('.select-hide').setSelectVal(v.paymentMethod);
								$('.tr' + i).find('.warehousePosition').setSelectVal(v.warehousePosition);
								v.num = i;
								$('.tr' + i).data('trData', v);
							if($('.tr' + i).data('trData').paymentMethod == 2) {
								/*
								 * me.addTwoInfo(数据，报销总额)
								 */
								var data = $('.tr' + i).data('trData');
								var all = $yt_baseElement.rmoney($('.tr' + i).find('.allTravelmoney').text());
								me.addTwoInfo(data,all);
							}
						});
						$('.warehousePositionDetails').autoHeight();
						$('.teacherName').off('click').on('click',function(){
							window.frames["teacherName"].location.href = '../teacher/teacherInf.html?pkId='+$(this).parents('tr').data('trData').teacherId;
							$('#teacherName').show();
							var iframesTop = $('#teacherName').offset().top;
							$(document).scrollTop(iframesTop);
							$('body').css('overflow','hidden');
						})
						var numb = num + 1;
						htmlTr = '<tr><td class="numb" style="display:none;">' + numb + '</td><td colspan="8" style="text-align:center">合计：</td>' +
							'<td class="salesPriceSum"  style="text-align:right;font-weight:bold">' + $yt_baseElement.fmMoney(salesPriceSum,2) + '</td>' +
							'<td id="insuranceSum" style="text-align:right;font-weight:bold">'+$yt_baseElement.fmMoney(insuranceSum)+'</td>' +
							'<td id="refundSigningFeeSum" style="text-align:right;font-weight:bold">' + $yt_baseElement.fmMoney(refundSigningFeeSum,2) + '</td>' +
							'<td id="expenseMoneySum" style="text-align:right;font-weight:bold">' + $yt_baseElement.fmMoney(expenseMoneySum,2) + '</td><td></td>' +
							'<td></td>' +
							'<td></td>' +
							'</tr>' +
							'<tr><td class="numbs" style="display:none;">' + numb + '</td><td colspan="8" style="text-align:center">支票合计：</td>' +
							'<td class="checksalesPriceSum"  style="text-align:right;font-weight:bold">' + $yt_baseElement.fmMoney(checksalesPriceSum,2) + '</td>' +
							'<td id="checkinsuranceSum" style="text-align:right;font-weight:bold">'+$yt_baseElement.fmMoney(checkinsuranceSum)+'</td>' +
							'<td id="checkrefundSigningFeeSum" style="text-align:right;font-weight:bold">' + $yt_baseElement.fmMoney(checkrefundSigningFeeSum,2) + '</td>' +
							'<td id="checkexpenseMoneySum" style="text-align:right;font-weight:bold">' + $yt_baseElement.fmMoney(checkexpenseMoneySum,2) + '</td><td></td>' +
							'<td></td>' +
							'<td></td>' +
							'</tr>';
						htmlTbody.append(htmlTr);
					} else {
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="15" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						htmlTbody.html(htmlTr);
					}
					$('.select-hide').niceSelect();
					//选择电汇
					$(".select-hide").off('change').change(function() {
						var all = $yt_baseElement.rmoney($(this).parent().siblings('.allTravelmoney').text());
						if($(this).val() == 2) {
							/*
							 * me.addTwoInfo(数据，报销总额)
							 */
							var data = $(this).parent().parent().data('trData');
							me.addTwoInfo(data, all);
							caList.addAll();
						} else {
							var num = $(this).parent().parent().data('trData').num;
							var teacherId = $(this).parent().parent().data('trData').teacherId;
							var length = 0;
							//修改后还有几个电汇
							$.each($('.rows[teacherid='+teacherId+']'), function(i,n) {
								$(n).find('select.select-hide').val()==2?length++:length=length;
							});
							if(length==0){
									$('.teacher' + teacherId).remove();
							}else if(length==1){
								if($('.teacher' + teacherId).data('data').twomoney!=undefined){
									$('.teacher' + teacherId).find('.twotablemoney').text($yt_baseElement.fmMoney($yt_baseElement.rmoney($('.teacher' + teacherId).find('.twotablemoney').text())-all,2));
									$('.teacher' + teacherId).data('data').twomoney=undefined
								}
							}
							if($('.twoTr').length == 0) {
								var tr = '<tr style="border:0px;background-color:#fff !important;" >' +
									'<td colspan="11" align="center" style="border:0px;">' +
									'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
									'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
									'</div>' +
									'</td>' +
									'</tr>';
								$('#two-table').append(tr);
								$('#two-table').parents('table').hide();
							}
							caList.addAll();
						}
					});
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
	//生成关联列表
	linkList: function(types) {
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/teacherExpense/getTeacherRelationDetails",
			async: true,
			data: {
				types: types
			},
			success: function(data) {
				var htmlTr = '';
				if(data.flag==0){
				if(types == 1) {
					if(data.data.length > 0) {
						$('#planTableList').empty();
						$('.checklabel-all').removeClass('check');
						$.each(data.data, function(i, n) {
							n.pkId == undefined ? n.pkId = 0 : n.pkId = n.pkId;
							htmlTr = '<tr class="planTr' + n.pkId + '">' +
								'<td style="text-align: center;">' +
								'<label class="check-label yt-checkbox select-plan-checkbox"><input type="checkbox" name="test" class="select-teacher-pkId" value="' + n.pkId + '"/></label>' + '</td>' +
								'<td style="text-align:center">' + (i + 1) + '</td>' +
								//出票时间
								'<td style="text-align:center">' + n.dateExit + '</td>' +
								//起飞时间
								'<td style="text-align:center">' + n.dateDeparture + '</td>' +
								//票号
								'<td>' + n.ticketNumber + '</td>' +
								//乘机人
								'<td style="text-align:center">' + n.passenger + '</td>' +
								//航程
								'<td style="text-align:center">' + n.trip + '</td>' +
								//航班号
								'<td style="text-align:center">' + n.trainNumber + '</td>' +
								//销售价
								'<td style="text-align:right">' + n.salesPrice + '</td>' +
								//机建
								'<td style="text-align:right">' + n.construction + '</td>' +
								//税费
								'<td style="text-align:right">' + n.taxation + '</td>' +
								//保险
								'<td style="text-align:right">' + n.insurance + '</td>' +
								//总金额
								'<td style="text-align:right">' + n.totalAmount + '</td>' +
								//订票人
								'<td style="text-align:center">' + n.reservations + '</td>' +
								'</tr>'
							$('#planTableList').append(htmlTr);
							$('.planTr' + n.pkId).data('planData', n);
						});
					} else {
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="11" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						$('#planTableList').html(htmlTr);
					}
				}
				if(types == 2) {
					if(data.data.length > 0) {
						$('#trainTableList').empty();
						$('.checklabel-all').removeClass('check');
						$.each(data.data, function(i, n) {
							htmlTr = '<tr class="trainTr' + n.pkId + '">' +
								'<td style="text-align: center;">' +
								'<label class="check-label yt-checkbox select-train-checkbox"><input type="checkbox" name="test" class="select-teacher-pkId" value="' + n.pkId + '"/></label>' + '</td>' +
								'<td>' + (i + 1) + '</td>' +
								//出票时间
								'<td style="text-align:center">' + n.dateExit + '</td>' +
								//出发时间
								'<td style="text-align:center">' + n.dateDeparture + '</td>' +
								//乘客
								'<td style="text-align:center">' + n.passenger + '</td>' +
								//行程
								'<td style="text-align:center">' + n.trip + '</td>' +
								//车次
								'<td style="text-align:center">' + n.trainNumber + '</td>' +
								//销售价
								'<td style="text-align:right">' + n.salesPrice + '</td>' +
								//工本费
								'<td style="text-align:right">' + n.costWork + '</td>' +
								//总金额
								'<td style="text-align:right">' + n.totalAmount + '</td>' +
								//订票人
								'<td style="text-align:center">' + n.reservations + '</td>' +
								'</tr>'
							$('#trainTableList').append(htmlTr);
							$('.trainTr' + n.pkId).data('trainData', n);
						});
					} else {
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="11" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						$('#planTableList').append(htmlTr);
					}
				}
				//对勾
				$.each($('.link-li'), function(x, y) {
					var pkId = $(y).attr('teacherstatementdetailsids');
					$('.trainTr' + pkId).find('input[type="checkbox"]').setCheckBoxState("check");
					$('.planTr' + pkId).find('input[type="checkbox"]').setCheckBoxState("check");
				})
				$yt_baseElement.hideLoading();
			}else{
				$yt_baseElement.hideLoading(function(){
					$yt_alert_Model.prompt('查询失败')
				});
			}
			/** 
			 * 调用算取div显示位置方法 
			 */
			$yt_alert_Model.getDivPosition($(".travel-import-form"));
			$yt_alert_Model.setFiexBoxHeight($(".travel-import-form .cont-edit-test"));		
			},
			error:function(){
				$yt_baseElement.hideLoading(function(){
					$yt_alert_Model.prompt('网络异常')
				});
			}
		});
	},
	//点击保存或提交
	addnewsInfo: function(dataStates) {
		var me = this;
		$yt_baseElement.showLoading();
		var pkId = $yt_common.GetQueryString("pkId")
		//项目Code
		var projectCode = $('#projectCode').val();
		//部门预算来源
		var deptBudget = $('.where').val();
		//出差任务
		var remarks = $('.remarks').val();
		var teacherCountArr = [];
		$.each($('.rows'), function(x,y) {
			var bool =true;
			$.each(teacherCountArr, function(i,n) {
				if(n==$(y).data('trData').teacherName){
					bool=false;
				}
			});
			if(bool){
				teacherCountArr.push($(y).data('trData').teacherName);
			}
		});
		//教师数量
		var teacherCount = teacherCountArr.length;
		//报销金额
		var expenseMoney = $yt_baseElement.rmoney($('#expenseMoneySum').text());
		//报销数据
		var expenseDetails = [];
		//下一步操作人
		var dealingWithPeople = $('#dealingWithPeople').val();
		//审批意见
		opintion =/* $('.details').val();*/$('.remarks').val();
		var processInstanceId = "";
		$.each($('.rows'), function(a, b) {
			var expenseDetailsjson = {
			teacherId: '',
			routeType: '',
			papersType:'',
			papersNumber:'',
			registeredBank:'',
			account:'',
			salesPrice: '',
			insurance: '',
			refundSigningFee: '',
			expenseMoney: '',
			flightTrainNumber:'',
			placeDeparture:'',
			goOff:'',
			bourn:'',
			arrivalTime:'',
			paymentMethod: '',
			teacherStatementDetailsIds: ''
		};
			var idarray = [];
			expenseDetailsjson.teacherId = $(b).attr('teacherid');
			expenseDetailsjson.routeType = $(b).data('trData').routeType;
			expenseDetailsjson.papersType = $(b).data('trData').papersType;
			expenseDetailsjson.papersNumber = $(b).data('trData').papersNumber;
			expenseDetailsjson.registeredBank = $(b).data('trData').registeredBank;
			expenseDetailsjson.account = $(b).data('trData').account;
			expenseDetailsjson.salesPrice = $yt_baseElement.rmoney($(b).find('.salesPrice').val());
			expenseDetailsjson.insurance = $yt_baseElement.rmoney($(b).find('.insurance').val());
			expenseDetailsjson.refundSigningFee = $yt_baseElement.rmoney($(b).find('.refundSigningFee').val());
			expenseDetailsjson.expenseMoney =$yt_baseElement.rmoney($(b).find('.allTravelmoney').text()) ;
			expenseDetailsjson.flightTrainNumber = $(b).data('trData').flighttrainNumber;
			expenseDetailsjson.placeDeparture = $(b).data('trData').placeDeparture;
			expenseDetailsjson.goOff = $(b).data('trData').startEndTime.split('至')[0];
			expenseDetailsjson.bourn = $(b).data('trData').bourn;
			expenseDetailsjson.arrivalTime = $(b).data('trData').startEndTime.split('至')[1];
			expenseDetailsjson.paymentMethod = $(b).find('.select-hide').val();
			expenseDetailsjson.warehousePosition = $(b).find('.warehousePosition').val();
			expenseDetailsjson.warehousePositionDetails = $(b).find('.warehousePositionDetails').val();
			$.each($(b).find('.bookingRecord').find('div'), function(c, d) {
				idarray.push($(d).attr('teacherstatementdetailsid'));
			});
			idarray = idarray.join(',');
			expenseDetailsjson.teacherStatementDetailsIds = idarray;
			expenseDetails.push(expenseDetailsjson);
				
		});
	
		expenseDetails = JSON.stringify(expenseDetails);
		console.log('expenseDetails',expenseDetails);
		if(pkId!=null){
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "finance/teacherExpense/getBeanByIdTravel",
				async: true,
				data: {
					pkId: pkId
				},
				success: function(data) {
					if(data.flag == 0) {
							processInstanceId = data.data.processInstanceId;
					}
				}
			});
		}
		
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/teacherExpense/addOrUpdateBeanTravel",
			data: {
				pkId: pkId,
				//报销类型
				expenseType: 2,
				//项目Code
				projectCode: projectCode,
				//部门预算来源
				deptBudget: 1,
				//出差任务
				remarks: remarks,
				//教师数量
				teacherCount: teacherCount,
				//报销金额
				expenseMoney: expenseMoney,
				//报销数据
				expenseDetails: expenseDetails,
				//保存还是提交
				dataStates: dataStates,
				//流程定义Key
				businessCode: 'travelExpense',
				//下一步操作人
				dealingWithPeople: dealingWithPeople,
				//审批意见
				opintion: opintion,
				//流程实例Id
				processInstanceId: processInstanceId,
				//操作流程代码   不能为空
				nextCode: "submited"
			},
			success: function(data) {
				debugger
				if(data.flag == 0) {
					$yt_alert_Model.prompt("添加成功");
					$(".yt-edit-alert,#heard-nav-bak").hide();

				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("提交失败");
					},3000);
				}
				 	caList.backNewsListPage();
			}
		});
	},
	deleteData: [],
	//编辑与删除
	deleteInfo: function() {
		var me = this;
		//删除
		$('.list-box').on('click', '.delete-tb', function() {
			var that = this;
			 $yt_alert_Model.alertOne({  
		        alertMsg: "确认删除该数据吗？", //提示信息  
		        confirmFunction: function() {
		        	var teacherId = $(that).parents('tr').data('trData').teacherId;
					var length = 0 ;
					$.each($('.rows[teacherid='+teacherId+']'), function(i,n) {
							$(n).find('select.select-hide').val()==2?length++:length=length;
						});
					if(length==1){
						$('#two-table').find('.teacher'+teacherId).remove();
					}else if(length==2){
						var all = $yt_baseElement.rmoney($(that).parents('tr').find('.allTravelmoney').text());
						$('.teacher' + teacherId).find('.twotablemoney').text($yt_baseElement.rmoney($yt_baseElement.fmMoney($('.teacher' + teacherId).find('.twotablemoney').text())-all,2));
						$('.teacher' + teacherId).data('data').twomoney=undefined
					}
					$(that).parent().parent().remove();
					$('.class-tbody tr').each(function(i,n){
						$(n).find('.num').text(($(that).index()+1));
					})
					$('#two-table tr').each(function(i,n){
						$(n).find('td').eq(0).text(($(that).index()+1));
					})
					if($('#two-table').find('tr').length==0){
						var tr = '<tr style="border:0px;background-color:#fff !important;" >' +
								'<td colspan="11" align="center" style="border:0px;">' +
								'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
								'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
								'</div>' +
								'</td>' +
								'</tr>';
							$('#two-table').append(tr);
							$('#two-table').parents('table').hide();
					}
					$('.numb').text($('.rows').length+1);
					$('.numbs').text($('.rows').length+1);
					me.allmoney();
					/*
					 删除
					 * 
					 * 
					 * */
		        },
		  
		    }); 
			
		});
		//编辑
		$('.list-box').on('click', '.update-tb', function() {
			$(this).parents('tr').find('input').removeAttr('readonly');
			$(this).parents('tr').find('input').css('border', '1px solid #e6e6e6');
			$(this).parents('tr').find('div.select-hide').show();
			$(this).attr('class','yes');
			$(this).text('确定');
			me.allmoney();
		})
		$('.list-box').on('click', '.yes', function() {
			$(this).parents('tr').find('input').attr('readonly', 'readonly');
			$(this).parents('tr').find('input').css('border', 'none');
			$(this).parents('tr').find('.yes').text('编辑');
			$(this).attr('class','update-tb');
			me.allmoney();
		})
	},
	allmoney: function() {
		var me = this;
		$('.list-box').on('focus', '.salesPrice', function() {
			$(this).val($yt_baseElement.rmoney($(this).val()));
		})
		//修改票价键盘抬起
		$('.list-box').on('keyup', '.salesPrice', function() {
			if($(this).val() == '') {
				$(this).val(0);
			}
			$(this).val($(this).val().replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g, ''));
			//票价
			var salesPrice = $yt_baseElement.rmoney($(this).val());
			//退改签费
			var refundSigningFee = $yt_baseElement.rmoney($(this).parents('tr').find('.refundSigningFee').val());
			//保险
			var insurance = $yt_baseElement.rmoney($(this).parents('tr').find('.insurance').val());
			//总金额
			var all = $yt_baseElement.rmoney(salesPrice) + $yt_baseElement.rmoney(refundSigningFee) + $yt_baseElement.rmoney(insurance);
			//合计
			$(this).parent().siblings('.allTravelmoney').text($yt_baseElement.fmMoney(all,2));
			var num = $(this).parents('tr').data('trData').num;
			var teacherId =  $(this).parents('tr').data('trData').teacherId;
			var length = 0 ;
			$.each($('.rows[teacherid='+teacherId+']'), function(i,n) {
					$(n).find('select.select-hide').val()==2?length++:length=length;
				});
				if(length==1){
					if(num==$('.teacher' + teacherId).data('data').num){
						$('.teacher' + teacherId).find('.twotablemoney').text($yt_baseElement.fmMoney(all,2));
					}
				}else if(length==2){
					var twoall = 0;
					$.each($(".rows[teacherid="+ teacherId +"]"), function(i,n) {
						twoall+=$yt_baseElement.rmoney($(n).find('.allTravelmoney').text());
					});
					$('.teacher' + teacherId).find('.twotablemoney').text($yt_baseElement.fmMoney(twoall,2));
				}
			caList.addAll();
		})
		//修改票价
		$('.list-box').off('blur').on('blur', '.salesPrice', function() {
			if($(this).val() == '') {
				$(this).val(0);
			}
			$(this).val($yt_baseElement.fmMoney($(this).val(),2));
			$(this).val($(this).val().replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g, ''));
			//票价
			var salesPrice = $(this).val();
			//退改签费
			var refundSigningFee = $(this).parents('tr').find('.refundSigningFee').val();
			//保险
			var insurance = $(this).parents('tr').find('.insurance').val();

			//总金额
			var all = $yt_baseElement.rmoney(salesPrice) + $yt_baseElement.rmoney(refundSigningFee) + $yt_baseElement.rmoney(insurance);
			$(this).parent().siblings('.allTravelmoney').text($yt_baseElement.fmMoney(all,2));
			var num = $(this).parent().parent().data('trData').num;
			var teacherId =  $(this).parents('tr').data('trData').teacherId;
			var length = 0 ;
			$.each($('.rows[teacherid='+teacherId+']'), function(i,n) {
					$(n).find('select.select-hide').val()==2?length++:length=length;
				});
				if(length==1){
					if(num==$('.teacher' + teacherId).data('data').num){
						$('.teacher' + teacherId).find('.twotablemoney').text($yt_baseElement.fmMoney(all,2));
					}
				}else if(length==2){
					var twoall = 0;
					$.each($(".rows[teacherid="+ teacherId +"]"), function(i,n) {
						twoall+=$yt_baseElement.rmoney($(n).find('.allTravelmoney').text());
					});
					$('.teacher' + teacherId).find('.twotablemoney').text($yt_baseElement.fmMoney(twoall,2));
				}
			caList.addAll();
		})
		//保险费
		$('.list-box').on('focus', '.insurance', function() {
			$(this).val($yt_baseElement.rmoney($(this).val()));
		});
		$('.list-box').on('keyup', '.insurance', function() {
			if($(this).val() == '') {
				$(this).val(0);
			}
			$(this).val($(this).val().replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g, ''));
			var refundSigningFee = $(this).parents('tr').find('.refundSigningFee').val();
			var salesPrice = $(this).parent().siblings('.salesPriceTd').children('.salesPrice').val();
			var insurance = $(this).val();
			var all = $yt_baseElement.rmoney(salesPrice) + $yt_baseElement.rmoney(refundSigningFee) + $yt_baseElement.rmoney(insurance);
			$(this).parent().siblings('.allTravelmoney').text($yt_baseElement.fmMoney(all,2));
			var num = $(this).parent().parent().data('trData').num;
			var teacherId =  $(this).parents('tr').data('trData').teacherId;
			var length = 0 ;
			$.each($('.rows[teacherid='+teacherId+']'), function(i,n) {
					$(n).find('select.select-hide').val()==2?length++:length=length;
				});
				if(length==1){
					if(num==$('.teacher' + teacherId).data('data').num){
						$('.teacher' + teacherId).find('.twotablemoney').text($yt_baseElement.fmMoney(all,2));
					}
				}else if(length==2){
					var twoall = 0;
					$.each($(".rows[teacherid="+ teacherId +"]"), function(i,n) {
						twoall+=$yt_baseElement.rmoney($(n).find('.allTravelmoney').text());
					});
					$('.teacher' + teacherId).find('.twotablemoney').text($yt_baseElement.fmMoney(twoall,2));
				}
			caList.addAll();
		});
		$('.list-box').on('blur', '.insurance', function() {
			if($(this).val() == '') {
				$(this).val(0);
			}
			$(this).val($yt_baseElement.fmMoney($(this).val(),2));
			$(this).val($(this).val().replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g, ''));
			var refundSigningFee = $(this).parents('tr').find('.refundSigningFee').val();
			var salesPrice = $(this).parent().siblings('.salesPriceTd').children('.salesPrice').val();
			var insurance = $(this).val();
			var all = $yt_baseElement.rmoney(salesPrice) + $yt_baseElement.rmoney(refundSigningFee) + $yt_baseElement.rmoney(insurance);
			$(this).parent().siblings('.allTravelmoney').text($yt_baseElement.fmMoney(all,2));
			var num = $(this).parent().parent().data('trData').num;
			var teacherId =  $(this).parents('tr').data('trData').teacherId;
			var length = 0 ;
			$.each($('.rows[teacherid='+teacherId+']'), function(i,n) {
					$(n).find('select.select-hide').val()==2?length++:length=length;
				});
				if(length==1){
					if(num==$('.teacher' + teacherId).data('data').num){
						$('.teacher' + teacherId).find('.twotablemoney').text($yt_baseElement.fmMoney(all,2));
					}
				}else if(length==2){
					var twoall = 0;
					$.each($(".rows[teacherid="+ teacherId +"]"), function(i,n) {
						twoall+=$yt_baseElement.rmoney($(n).find('.allTravelmoney').text());
					});
					$('.teacher' + teacherId).find('.twotablemoney').text($yt_baseElement.fmMoney(twoall,2));
				}
			caList.addAll();
		});
		$('.list-box').on('focus', '.refundSigningFee', function() {
			$(this).val($yt_baseElement.rmoney($(this).val()));
		})
		//修改退改签费
		$('.list-box').on('keyup blur', '.refundSigningFee', function() {
			if($(this).val() == '') {
				$(this).val(0);
			}
			$(this).val($(this).val().replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g, ''));
			var refundSigningFee = $(this).val();
			var salesPrice = $(this).parent().siblings('.salesPriceTd').children('.salesPrice').val();
			var insurance = $(this).parents('tr').find('.insurance').val();
			var all = $yt_baseElement.rmoney(salesPrice) + $yt_baseElement.rmoney(refundSigningFee) + $yt_baseElement.rmoney(insurance);
			$(this).parent().siblings('.allTravelmoney').text($yt_baseElement.fmMoney(all,2));
			var num = $(this).parent().parent().data('trData').num;
			var teacherId =  $(this).parents('tr').data('trData').teacherId;
			var length = 0 ;
			$.each($('.rows[teacherid='+teacherId+']'), function(i,n) {
					$(n).find('select.select-hide').val()==2?length++:length=length;
				});
				if(length==1){
					if(num==$('.teacher' + teacherId).data('data').num){
						$('.teacher' + teacherId).find('.twotablemoney').text($yt_baseElement.fmMoney(all,2));
					}
				}else if(length==2){
					var twoall = 0;
					$.each($(".rows[teacherid="+ teacherId +"]"), function(i,n) {
						twoall+=$yt_baseElement.rmoney($(n).find('.allTravelmoney').text());
					});
					$('.teacher' + teacherId).find('.twotablemoney').text($yt_baseElement.fmMoney(twoall,2));
				}
			caList.addAll();
		});
		$('.list-box').off('blur').on('blur', '.refundSigningFee', function() {
			if($(this).val() == '') {
				$(this).val(0);
			}
			$(this).val($yt_baseElement.fmMoney($(this).val(),2));
			$(this).val($(this).val().replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g, ''));
			var refundSigningFee = $(this).val();
			var salesPrice = $(this).parent().siblings('.salesPriceTd').children('.salesPrice').val();
			var insurance = $(this).parents('tr').find('.insurance').val();
			var all = $yt_baseElement.rmoney(salesPrice) + $yt_baseElement.rmoney(refundSigningFee) + $yt_baseElement.rmoney(insurance);
			$(this).parent().siblings('.allTravelmoney').text($yt_baseElement.fmMoney(all,2));
			var num = $(this).parent().parent().data('trData').num;
			var teacherId =  $(this).parents('tr').data('trData').teacherId;
			var length = 0 ;
			$.each($('.rows[teacherid='+teacherId+']'), function(i,n) {
					$(n).find('select.select-hide').val()==2?length++:length=length;
				});
				if(length==1){
					if(num==$('.teacher' + teacherId).data('data').num){
						$('.teacher' + teacherId).find('.twotablemoney').text($yt_baseElement.fmMoney(all,2));
					}
				}else if(length==2){
					var twoall = 0;
					$.each($(".rows[teacherid="+ teacherId +"]"), function(i,n) {
						twoall+=$yt_baseElement.rmoney($(n).find('.allTravelmoney').text());
					});
					$('.teacher' + teacherId).find('.twotablemoney').text($yt_baseElement.fmMoney(twoall,2));
				}
			caList.addAll();
		});
		caList.addAll();
	},
	addAll:function(){
		
			var allTravelmoney = 0;
			var salesPriceSum = 0;
			var insuranceSum = 0;
			var refundSigningFeeSum = 0;
			var checksalesPriceSum = 0;
			var checkrefundSigningFeeSum = 0;
			var checkexpenseMoneySum = 0;
			var checkinsuranceSum = 0;
			$.each($('.select-hide'), function(index, model) {
				if($(model).val() == 1) {
					checksalesPriceSum += $yt_baseElement.rmoney($(model).parent().siblings('.salesPriceTd').children('.salesPrice').val());
					checkrefundSigningFeeSum += $yt_baseElement.rmoney($(model).parent().siblings('.refundSigningFeeTd').children('.refundSigningFee').val());
					checkexpenseMoneySum += $yt_baseElement.rmoney($(model).parent().siblings('.allTravelmoney').text());
					checkinsuranceSum+=	$yt_baseElement.rmoney($(model).parents('tr').find('.insurance').val());
				}
			})
			$.each($('.salesPrice'), function(i, n) {
//				if($(n).val() != '0') {
//					$(n).val($(n).val().replace(/\b(0+)/gi, ""));
//				}
				salesPriceSum += $yt_baseElement.rmoney($(n).val());
			});
			$.each($('.refundSigningFee'), function(i, n) {
//				if($(n).val() != '0') {
//					$(n).val($(n).val().replace(/\b(0+)/gi, ""));
//				}
				refundSigningFeeSum += $yt_baseElement.rmoney($(n).val());
			});
			$.each($('.insurance'), function(i, n) {
				insuranceSum += $yt_baseElement.rmoney($(n).val());
			});
			$.each($('.allTravelmoney'), function(i, n) {
				allTravelmoney += $yt_baseElement.rmoney($(n).text());
			});
			//票价总额
			$('.salesPriceSum').text($yt_baseElement.fmMoney(salesPriceSum,2));
			//保险总额
			$('#insuranceSum').text($yt_baseElement.fmMoney(insuranceSum,2))
			//改签费总额
			$('#refundSigningFeeSum').text($yt_baseElement.fmMoney(refundSigningFeeSum,2));
			//报销总金额总额
			$('#expenseMoneySum').text($yt_baseElement.fmMoney(allTravelmoney,2));
			//报销保险总额
			$('#checkinsuranceSum').text($yt_baseElement.fmMoney(checkinsuranceSum,2));
			//支票---票价合计
			$('.checksalesPriceSum').text($yt_baseElement.fmMoney(checksalesPriceSum,2));
			//支票---改签费总额
			$('#checkrefundSigningFeeSum').text($yt_baseElement.fmMoney(checkrefundSigningFeeSum,2));
			//支票---报销总金额
			$('#checkexpenseMoneySum').text($yt_baseElement.fmMoney(checkexpenseMoneySum,2));
		
	},
	//点击关联
	relevance: function() {
		var me = this;
		$('.class-tbody').on('click', '.relevance-tb', function() {
			me.linkList(1);
			$('.link-ul').empty();
			//关联订票记录值传入弹窗
			$.each($(this).parent().siblings('.bookingRecord').find('div'), function(j, v) {
				var teacherStatementDetailsId = $(v).attr('teacherStatementDetailsId');
				var teacherStatementDetails = $(v).text();
				var linkLi = '<li class="link-li link-li' + teacherStatementDetailsId + '" teacherStatementDetailsIds="' + teacherStatementDetailsId + '">' + teacherStatementDetails + '<span class="delete-link" style="color: red;cursor: pointer;">×</span></li>';
				linkLi = $(linkLi).data('pkId',teacherStatementDetailsId);
				$('.link-ul').append(linkLi);
			})

			$(".travel-import-form").attr('trClass', $(this).parent().parent().attr('class'));
			/** 
			 * 显示编辑弹出框和显示顶部隐藏蒙层 
			 */
			$(".travel-import-form").show();
			/* 
			 * 调用支持拖拽的方法 
			 */
			$yt_model_drag.modelDragEvent($(".travel-import-form .yt-edit-alert-title"));
			/** 
			 * 点击取消方法 
			 */
			$('.travel-import-form .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
				//隐藏页面中自定义的表单内容  
				$(".travel-import-form").hide();
				//隐藏蒙层  
				$("#pop-modle-alert").hide();
			});
		})
	},
	//教师支付信息附表
	addTwoInfo: function(data, all) {
		var htmlBody = $('#two-table');
		var htmlTr = '';
		var bool =true;
		if($('#two-table').find('.twoTr').length==0){
			$('#two-table').empty();
			$('#two-table').parents('table').hide();
		}
		$.each($('#two-table').find('.twoTr'), function(i,n) {
			if($(n).data('data').teacherId==data.teacherId){
				if($(n).data('data').twomoney==undefined&&$(n).data('data').num!=data.num){
					$(n).data('data').twomoney = all;
					$(n).find('.twotablemoney').text($yt_baseElement.fmMoney($yt_baseElement.rmoney($(n).data('data').twomoney)+$yt_baseElement.rmoney($(n).find('.twotablemoney').text()),2));
				}
				bool =false;
			}
		});
		data.papersNumber == undefined ? data.papersNumber = '' : data.papersNumber = data.papersNumber;
		if(bool){
			data.onemoney = all;
			htmlTr = '<tr class="twoTr twoTr' + data.num + ' teacher'+data.teacherId+'">' +
			'<td style="text-align:center">' + ($('#two-table .twoTr').length + 1) + '</td>' +
			'<td style="text-align:center"><a class="teacherName"  style="color:#2080bf">' + data.teacherName + '</a></td>' +
			'<td style="text-align:center">' + data.papersTypeVel + '</td>' +
			'<td>' + data.papersNumber + '</td>' +
			'<td>' + data.registeredBank + '</td>' +
			'<td>' + data.account + '</td>' +
			'<td style="text-align:center">电汇</td>' +
			'<td style="text-align:right" class="twotablemoney" >' + $yt_baseElement.fmMoney(all,2) + '</td>' +
			'</tr>';
			htmlTr = $(htmlTr).data('data',data);
			htmlBody.append(htmlTr);
			$('.teacherName').off('click').on('click',function(){
				window.location.href = '../teacher/teacherInf.html?pkId='+$(this).parents('tr').data('data').teacherId;
			})
			if($('#two-table').find('.twoTr').length>0){
				$('#two-table').parents('table').show();
			}
		}
	}
};
$(function() {
	//初始化方法
	caList.init();

});jQuery.fn.extend({
    autoHeight: function(){
        return this.each(function(){

            var $this = jQuery(this);

            if( !$this.attr('_initAdjustHeight') ){

                $this.attr('_initAdjustHeight', $this.outerHeight());

            }

            _adjustH(this).on('input', function(){

                _adjustH(this);

            });

        });

        /**

         * 重置高度 

         * @param {Object} elem

         */

        function _adjustH(elem){

            var $obj = jQuery(elem);

            return $obj.css({height: $obj.attr('_initAdjustHeight'), 'overflow-y': 'hidden'})

                    .height( elem.scrollHeight );
        }
    }
});