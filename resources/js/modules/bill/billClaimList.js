var billListInfo = {
	//初始化方法
	init: function() {
		//对账单信息列表
		billListInfo.getBillListInfo();
		//获取所有下拉框项目数据
		$(".bank-more-div").off('click').on("click", function() {
			
			if($(".bank-more-div").text() == "查看更多") {
				$("#project-main").css("width","2350px");
				$('.bank-more-div').text("收起");//
				$(".bank-th-hide").show();
				$(".bank-tbody-td").attr("colspan", "18");
			} else {
				$("#project-main").css("width","100%");
				$('.bank-more-div').text("查看更多");
				$(".bank-th-hide").hide();
				$(".bank-tbody-td").attr("colspan", "7");
			}
		});
		//认领记录
		$(".claim-record").click(function() {
//			if($(".yt-table-active").length != 0) {
//				var pkId = $(".yt-table-active").find(".pkId").val();
//				window.location.href = "claimRecord.html?pkId=" + pkId;
//			} else {
//				$yt_alert_Model.prompt("请选择一行数据！");
//			}
			var pkIds =[];
			$.each($('.project-tbody tr'),function(i,n){
				pkIds.push($(n).find('.pkId').val());
			})
			pkIds = pkIds.join(',');
			window.location.href = "claimRecord.html?pkId=" + pkIds;
		});
		//模糊查询
		$(".search-btn").click(function() {
			billListInfo.getBillListInfo();
		});
		//认领弹窗
		$(".admission-manual").click(function() {
			//判断复选框

			if($(".yt-table-active").length == 0||$(".yt-table-active").hasClass('noData')) {
				$yt_alert_Model.prompt("请选择一条信息进行认领");
				return false;
			}
			//手动入账弹窗方法
			billListInfo.classAlertFunc();
//			if($(".yt-table-active").length != 0) {
//				//其他班级弹窗样式设置
//				$(".alert-table-div").show();
//				$(".alert-div-input").show();
//				$("#confiscate-amount").hide();
//				$("#user-name").css({
//					float: "left",
//					'margin': "0px 0px 0px 20px"
//				});
//				$("#last-amount").css({
//					float: "left",
//					'margin': "0px 0px 0px 100px"
//				});
//				$(".select-teacher-div").width("1100px");
//				$(".yt-edit-alert-main").height("736px");
//
//				//显示选择所属项目弹出框
//				$(".select-teacher-div").show();
//				//查询选择所属项目列表
//				//计算弹出框位置
//				$yt_alert_Model.setFiexBoxHeight($(".select-teacher-div .yt-edit-alert-main"));
//				$yt_alert_Model.getDivPosition($(".select-teacher-div"));
//				$yt_model_drag.modelDragEvent($(".select-teacher-div .yt-edit-alert-title"));
//				$("select").niceSelect();
//				//取消按钮
//				$('.select-teacher-canel-btn').click(function() {
//					$(".yt-edit-alert,#heard-nav-bak").hide();
//					$("#pop-modle-alert").hide();
//				});
//			} else {
//				$yt_alert_Model.prompt("请选择一行数据！");
//			}
		});
		//班级项目下拉框点击事件
		//		$('.class-select').change(function() {
		//			var classData = $(this).find("option:selected").data("classData");
		//
		//			//在页面隐藏项目类型用于模糊查询判断
		//			$('.hid-project-type').val(classData.projectType);
		//			//调用单位列表查询
		//			billListInfo.getPlanListInfo();
		//			//调用个人信息列表
		//			billListInfo.groupOrPerson();
		//			//
		//			billListInfo.getProjectStatementByProjectCode();
		//		});
		//单位列表复选框点击事件
		//		$(".company-table").on('click', '.select-checkbox', function() { //当前行的隐藏input只要值不为空当前行都是被选中的
		//			var states = $(this).parent().find(".states").val();
		//			//隐藏的input的值为0，是被删除的，值为1是已经认领的，值为2是新增的
		//			if(states == 1) { //已经认领
		//				$(this).parent().find(".states").val(0); //已经被认领的取消选中，该条信息被标识为删除0
		//			} else if(states == 0) { //院被删除的在标识为1，原来被删除的有重新被勾选
		//				$(this).parent().find(".states").val(1);
		//			} else if(states == 2) { //值为2当前行信息是将要认领的数据
		//				$(this).parent().find(".states").val("");
		//			} else { //当前行input值为空，没被勾选
		//				$(this).parent().find(".states").val(2);
		//			}
		//		});
		//		//个人信息列表复选框点击事件
		//		$(".person-table").on('click', '.select-checkbox', function() {
		//			var states = $(this).parent().find(".states").val();
		//			//隐藏的input的值为0，是被删除的，值为1是已经认领的，值为2是新增的
		//			if(states == 1) { //已经认领
		//				$(this).parent().find(".states").val(0); //已经被认领的取消选中，该条信息被标识为删除0
		//			} else if(states == 0) { //院被删除的在标识为1，原来被删除的有重新被勾选
		//				$(this).parent().find(".states").val(1);
		//			} else if(states == 2) { //值为2当前行信息是将要认领的数据
		//				$(this).parent().find(".states").val("");
		//			} else { //当前行input值为空，没被勾选
		//				$(this).parent().find(".states").val(2);
		//			}
		//		});
		//全选  
		$(".check-all").on("click", function() {
			//判断自己是否被选中  
			if($(this).parent().hasClass("check")) {
				//设置反选  
				$(this).parents("table").find("tbody input[type='checkbox']").setCheckBoxState("uncheck");
			} else {
				//调用设置选中方法,全选  
				$(this).parents("table").find("tbody input[type='checkbox']").setCheckBoxState("check");
			}
		});
		//修改全选按钮状态
		$(".person-tbody,.company-tbody").on("change", "input[type='checkbox']", function() {
			if($(this).parents("table").find("tbody input[type='checkbox']").length != $(this).parents("table").find("tbody input[type='checkbox']:checked").length) {
				$(this).parents("table").find(".check-all").setCheckBoxState("uncheck");
			} else {
				$(this).parents("table").find(".check-all").setCheckBoxState("check");
			}
		});
	},
	//手动入账弹窗
	classAlertFunc: function() {
		//获取所属项目下拉列表
		billListInfo.getProjectInfo();
		//初始化数据
		$(".check-all").setCheckBoxState("uncheck")
		$(".class-select").setSelectVal("");
		billListInfo.getNoDetailedList();
		billListInfo.getDetailedPersonalList("0", "");
		//两个列表都没有数据的情况
		var company=$(".company-table").attr('ishave');
		var parsion=$(".person-table").attr('ishave');
		if(company==0&&parsion==0){//两个列表都没有数据
			$(".company-table").show();
			$(".company-table thead").hide();
			$(".company-table tbody").show();
		}
		//下拉框change事件
		//标识
		var identifications = $(".yt-table-active").find("input.identifications").val();
		//银行流水Id
		var bankStatementDetailsIds = $(".yt-table-active").find("input.pkId").val();
		//项目code
		var projectCode = "";
		$("select.class-select").off('change').change(function() {
			//弹窗样式设置
			$(".alert-table-div").show();
			$(".alert-div-input").show();
			$("#confiscate-amount").hide();
			$("#user-name").css({
				float: "left",
				'margin': "0px 0px 0px 20px"
			});
			$("#last-amount").css({
				float: "left",
				'margin': "0px 0px 0px 100px"
			});
			$("#form-class").css({
				float: "left",
				'margin': "0px 0px 0px 70px"
			});
			//初始化
			$(".select-teacher-div").width("1100px");
			$(".yt-edit-alert-main").height("736px");
			//获取code
			projectCode = $(this).val();
			billListInfo.getNoDetailedList();
			billListInfo.getDetailedPersonalList(projectCode, "");
			//计算弹出框位置
			$yt_alert_Model.getDivPosition($(".select-teacher-div"));
			$yt_model_drag.modelDragEvent($(".select-teacher-div .yt-edit-alert-title"));
//			$("select").niceSelect();
			$(".search-btn").click(function() {
				var keyword = $("#keyword").val();
				billListInfo.getDetailedPersonalList(projectCode, keyword);
			})
			//改变同时获取一次标识
			if($(".identifications-div").text() != "") {
				var identifications = $(".identifications-div").text();
				//获取选择项目之后的数据
				billListInfo.getProjectStatementByProjectCode(projectCode, identifications);
			} else {
				//标识
				var identifications = $(".yt-table-active").find(".identifications").val();
				billListInfo.getProjectStatementByProjectCode(projectCode, identifications);
			}
			//两个列表都没有数据的情况
			var company=$(".company-table").attr('ishave');
			var parsion=$(".person-table").attr('ishave');
			if(company==0&&parsion==0){//两个列表都没有数据
				$(".company-table").show();
				$(".company-table thead").hide();
				$(".company-table tbody").show();
			}
			$yt_alert_Model.setFiexBoxHeight($(".select-teacher-div .yt-edit-alert-main"));
		});

		//点击认领提交方法
		$(".select-teacher-sure-btn").off('click').on("click", function() {
			//关联的单位和个人新增的数据
			var paymentListAdd = [];
			$(".company-tbody,.person-tbody").find('label input[type="checkbox"]:checked').each(function() {
				if($(this).hasClass("statement-check")) {

				} else {
					var paymentType = "";
					var paymentValue = $(this).val();
					if($(this).parents("tr").find("td").length > 6) {
						paymentType = (Number($(this).parents('tr').data('data').traineeType)+1);
					} else {
						paymentType = "1";
					}
					var paymentListAddArr = {
						paymentType: paymentType,
						paymentValue: paymentValue
					}
					paymentListAdd.push(paymentListAddArr);
				}
			});
			//关联的单位和个人删除的数据
			var paymentListDelete = [];
			$(".company-tbody,.person-tbody").find('input.statement-check').not("input:checked").each(function() {
				var paymentType = "";
				var paymentValue = $(this).val();
				if($(this).parents("tr").find("td").length > 6) {
					paymentType = (Number($(this).parents('tr').data('data').traineeType)+1);
				} else {
					paymentType = "1";
				}
				var paymentListDeleteArr = {
					paymentType: paymentType,
					paymentValue: paymentValue
				}
				paymentListDelete.push(paymentListDeleteArr);
			});
			var identifications = $(".yt-table-active").find(".identifications").val();;
			billListInfo.addNotReconciliations(projectCode, identifications, bankStatementDetailsIds, JSON.stringify(paymentListDelete), JSON.stringify(paymentListAdd), "")
		});
		//其他班级弹窗样式设置
		$(".alert-table-div").show();
		$(".alert-div-input").show();
		$("#confiscate-amount").hide();
		$("#user-name").css({
			float: "left",
			'margin': "0px 0px 0px 20px"
		});
		$("#last-amount").css({
			float: "left",
			'margin': "0px 0px 0px 100px"
		});
		$("#form-class").css({
			float: "left",
			'margin': "0px 0px 0px 70px"
		});
		//初始化
		$(".select-teacher-div").width("1100px");
		$(".yt-edit-alert-main").height("736px");
		//显示选择所属项目弹出框
		$(".select-teacher-div").show();
		//查询选择所属项目列表
		//计算弹出框位置
		$yt_alert_Model.setFiexBoxHeight($(".select-teacher-div .yt-edit-alert-main"));
		$yt_alert_Model.getDivPosition($(".select-teacher-div"));
		$yt_model_drag.modelDragEvent($(".select-teacher-div .yt-edit-alert-title"));
//		$("select").niceSelect();
		//取消按钮
		$('.select-teacher-canel-btn').click(function() {
			$(".yt-edit-alert,#heard-nav-bak").hide();
			$("#pop-modle-alert").hide();
		});
	},
	//提交表单
	addNotReconciliations: function(projectCode, identifications, bankStatementDetailsIds, paymentListDelete, paymentListAdd, uncollectedTotal) {
		$.ajax({
			url: $yt_option.base_path + "finance/projectStatement/addNotReconciliations", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				isUserClaim:'1',
				projectCode: projectCode,
				bankStatementDetailsIds: bankStatementDetailsIds,
				identifications: identifications,
				paymentListDelete: paymentListDelete,
				paymentListAdd: paymentListAdd,
				uncollectedTotal: uncollectedTotal
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("认领成功");
						$(".yt-edit-alert,#heard-nav-bak").hide();
						$("#pop-modle-alert").hide();
//						$('.person-page').pageInfo("refresh");
						$('.page1').pageInfo("refresh");
					});
					$(".identifications-div").text(data.data);
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("认领失败");
					});
				}
			}
		})
	},
	/**
	 * 对账单信息列表
	 */
	getBillListInfo: function() {
		var keyword = $('.selectParam').val();
		$('.page1').pageInfo({
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "project/getBankStatementList", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam: keyword
			}, //ajax查询访问参数
			async:true,
			before:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag == 0) {
					$(".num").text(data.data.total);
					var htmlTbody = $('.project-tbody');
					var htmlTr = '';
					htmlTbody.empty();
					if(data.data.rows.length > 0) {
						$('.page1').show();
						$.each(data.data.rows, function(i, v) {
	//序号1  交易时间1   借方发生额/元(支取)  贷方发生额度/元 1   对方户名1    备注1  对方账号1   余额   币种   记账日期  摘要    账户明细编号-交易流水号   企业流水号  凭证种类  凭证号   关联账户   别名   对方开户机构
							htmlTr += '<tr>' +
								'<td style=""><input type="hidden" value="' + v.pkId + '" class="pkId">' + (i + 1) + '</td>' +
								'<td style=""><input type="hidden" class="identifications" value="' + v.identification + '"/>' + v.exchangeHour + '</td>' +
								'<td class="bank-th-hide" style="display:none;tex-align:right;">' + v.draw + '</td>' +
								'<td style="text-align:right;">' + v.income + '</td>' +
								'<td style="text-align:left;">' + v.otherPartyName + '</td>' +
								'<td style="text-align:left;">' + v.remarks + '</td>' +
								'<td style="">' + v.otherPartyAccounts + '</td>' +
								'<td class="bank-th-hide" style="display:none;">' + v.balance + '</td>' +
								'<td class="bank-th-hide" style="display:none;">' + v.currency + '</td>' +
								'<td class="bank-th-hide" style="display:none;">' + v.accountDate + '</td>' +
								'<td class="bank-th-hide" style="display:none;">' + v.abstractData + '</td>' +
								'<td class="bank-th-hide" style="display:none;">' + v.bankTradeNumber + '</td>' +
								'<td class="bank-th-hide enterpriseTradeNumber" style="display:none;">' + v.enterpriseTradeNumber + '</td>' +
								'<td class="bank-th-hide" style="display:none;">' + v.voucherType + '</td>' +
								'<td class="bank-th-hide" style="display:none;">' + v.voucherNo + '</td>' +
								'<td class="bank-th-hide" style="display:none;text-align:left;">' + v.associatedAccount + '</td>' +
								'<td class="bank-th-hide" style="display:none;text-align:left;">' + v.alias + '</td>' +
								'<td style="text-align:left;">' + v.otherPartyGroup + '</td>' +
								'</tr>';
						});
					} else {
						$('.page1').hide();
						htmlTbody.empty();
						htmlTr = '<tr class="noData" style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="7" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
					}
					htmlTbody.append(htmlTr);
					if($('.bank-more-div').text()=='收起'){
							$('.bank-th-hide').show();
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
	//认领弹弹窗单位列表
	getNoDetailedList: function() {
		var projectCode = $('.class-select').val();
		var url = 'finance/settlement/getNoDetailedList';
		if($('.class-select option:selected').data('classData')){
			if($('.class-select option:selected').data('classData').projectType==2||$('.class-select option:selected').data('classData').projectType==3)
			url = "finance/settlement/getDetailedList"
		}
		$.ajax({
			url: $yt_option.base_path + url, //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				projectCode: projectCode
			}, //ajax查询访问参数
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			async:true,
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.company-tbody');
					var htmlTr = '';
					var num = 1;
					var listData = url == "finance/settlement/getDetailedList"?data.data.settlementGroupDetails:data.data;
					htmlTbody.empty();
					if(listData.length > 0) {
						$(".company-table").show();
						$(".company-table thead").show();
						$(".company-table").attr('isHave',1);
						console.log('company-table',$(".company-table").attr('isHave'));
						var states;
						var projectStates;
						$.each(listData, function(i, v) {
							htmlTr = '<tr>' +
								'<td style="text-align: center;">' +
								'<input type="hidden" class="states"/>' +
								'<label class="check-label yt-checkbox select-checkbox">' +
								'<input type="checkbox" name="test" class="group-id" value="' + v.groupId + '"/></label>' +
								'</td>' +
								'<td style="text-align:left">' + v.groupName + '</td>' +
								'<td style="text-align:right">' + v.amountReceivable + '</td>' +
								'<td style="text-align:right">' + v.netReceipts + '</td>' +
								'<td style="text-align:right">' + v.uncollected + '</td>' +
								'</tr>';
							htmlTbody.append(htmlTr);
						});
						//点击当前行选中当前行并且复选框被勾选
						$(".company-tbody tr").unbind().bind("click", function() {
							if($(this).find("input[type='checkbox']")[0].checked == true) {
								$(this).find("input[type='checkbox']").setCheckBoxState("uncheck");
								$(this).removeClass("yt-table-active");
							} else {
								$(this).find("input[type='checkbox']").setCheckBoxState("check");
								$(this).addClass("yt-table-active");
							}
							if($(this).parents("table").find("tbody input[type='checkbox']").length != $(this).parents("table").find("tbody input[type='checkbox']:checked").length) {
								$(this).parents("table").find(".check-all").setCheckBoxState("uncheck");
							} else {
								$(this).parents("table").find(".check-all").setCheckBoxState("check");
							}
						});
						//点击表头选中所有
						$(".company-table thead tr label input").off().click(function(){
							var thisCheck=$(this)[0].checked;
							console.log('thisCheck',thisCheck);
							if(thisCheck){
								$.each($('.company-tbody tr'), function() {
									$(this).addClass("yt-table-active");
									$(this).find("input[type='checkbox']").setCheckBoxState("check");
								});
							}else{
								$.each($('.company-tbody tr'), function() {
									$(this).find("input[type='checkbox']").setCheckBoxState("uncheck");
									$(this).removeClass("yt-table-active");
								});
							}
						});
					} else {
						$(".company-table").hide();
						$(".company-table").attr('isHave',0);
						htmlTbody.empty();
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="5" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						$('.person-page').hide();
						htmlTbody.append(htmlTr);
					}
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}

			}
		});
	},
	/**
	 * 认领弹窗选学和委托个人信息列表
	 */
	getDetailedPersonalList: function(projectCode, keyword) {
		$.ajax({
			url: $yt_option.base_path + "finance/settlement/getDetailedPersonalList", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				pageNum: 1000000000, //每页显示条数  
				pageSize: 10, //显示...的规律  
				projectCode: projectCode,
				selectParam: keyword,
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
				uncollectedEnd: "",
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			async: true,
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.person-tbody');
					var htmlTr = '';
					htmlTbody.empty();
					if(data.data.rows.length > 0) {
						$(".person-table").show();
						$(".person-table").attr('isHave',1);
						$.each(data.data.rows, function(i, v) {
							if(v.gender==1){
								v.gender="男";
							}else if(v.gender==2){
								v.gender="女";
							}
							htmlTr = '<tr>' +
								'<td style="text-align: center;">' +
								'<label class="check-label yt-checkbox personal-checkbox"><input type="checkbox" value="' +
								v.traineeId + '"/></label>' + '</td>' +
								'<td>' + v.groupNum + '</td>' +
								'<td>' + v.realName + '</td>' +
								'<td>' + v.gender + '</td>' +
								'<td style="text-align:left">' + v.groupName + '</td>' +
								'<td style="text-align:left">' + v.groupOrgName + '</td>' +
								'<td style="text-align:right">' + v.smallPlan + '</td>' +
								'<td style="text-align:right">' + v.moneyTotal + '</td>' +
								'<td style="text-align:right">' + v.uncollected + '</td>' +
								'</tr>';
							htmlTr = $(htmlTr).data('data',v);
							htmlTbody.append(htmlTr);
						});
						//点击当前行选中当前行并且复选框被勾选
						$(".person-table tbody tr").unbind().bind("click", function() {
							if($(this).find("input[type='checkbox']")[0].checked == true) {
								$(this).find("input[type='checkbox']").setCheckBoxState("uncheck");
								$(this).removeClass("yt-table-active");
							} else {
								$(this).find("input[type='checkbox']").setCheckBoxState("check");
								$(this).addClass("yt-table-active");
							}
							if($(this).parents("table").find("tbody input[type='checkbox']").length != $(this).parents("table").find("tbody input[type='checkbox']:checked").length) {
								$(this).parents("table").find(".check-all").setCheckBoxState("uncheck");
							} else {
								$(this).parents("table").find(".check-all").setCheckBoxState("check");
							}
						});
						//点击表头选中所有
						$(".person-table thead tr label input").off().click(function(){
							var thisCheck=$(this)[0].checked;
							console.log('thisCheck',thisCheck);
							if(thisCheck){
								$.each($('.person-tbody tr'), function() {
									$(this).addClass("yt-table-active");
									$(this).find("input[type='checkbox']").setCheckBoxState("check");
								});
							}else{
								$.each($('.person-tbody tr'), function() {
									$(this).find("input[type='checkbox']").setCheckBoxState("uncheck");
									$(this).removeClass("yt-table-active");
								});
							}
						});
					} else {
						$(".person-table").hide();
						$(".person-table").attr('isHave',0);
						htmlTbody.html("");
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="9" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						htmlTbody.append(htmlTr);
					}
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}

			} //回调函数 匿名函数返回查询结果  
		});
	},
	//计划和调训个人信息列表
	getAlertListInfoPlan: function() {
		//获取项目code
		var projectCode = $(".class-select").val();
		var keyword = $('#keyword').val();
		$('.page-info').pageInfo({
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "finance/settlement/getNoDetailedPersonalList", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				projectCode: projectCode,
				selectParam: keyword
			}, //ajax查询访问参数
			async:true,
			before:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.person-tbody');
					var htmlTr = '';
					htmlTbody.empty();
					if(data.data.rows.length > 0) {
						var states;
						var projectStates;
						$.each(data.data.rows, function(i, v) {
							htmlTr += '<tr>' +
								'<td style="text-align: center;">' +
								'<input type="hidden" class="states"/>' +
								'<label class="check-label yt-checkbox select-teacher-checkbox">' +
								'	<input type="checkbox" name="test" class="select-trainee-pkId" value="' + v.traineeId + '"/></label>' +
								'</td>' +
								'<td style="text-align:left">' + v.realName + '</td>' +
								'<td style="text-align:right">' + v.gender + '</td>' +
								'<td style="text-align:right">' + v.groupName + '</td>' +
								'<td style="text-align:right">' + v.groupOrgName + '</td>' +
								'<td style="text-align:right">' + v.trainingExpenseNegotiatedPrice + '</td>' +
								'<td style="text-align:right">' + v.otherCost + '</td>' +
								'<td style="text-align:right">' + v.netReceipts + '</td>' +
								'<td style="text-align:right">0.00</td>' +
								'</tr>';
						});
					} else {
						htmlTbody.empty();
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="9" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
					}
					htmlTbody.append(htmlTr);
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
	//项目类型设置
	projectTypeInfo: function(code) {
		if(code == 1) {
			return "计划";
		} else if(code == 2) {
			return "委托";
		} else if(code == 3) {
			return "选学";
		} else if(code == 4) {
			return "中组部调训";
		}  else if(code == 5) {
			return "国资委调训";
		} else {
			return '';
		};
	},
	//获取所属项目下拉列表
	getProjectInfo: function() {
		var selectParam = "";
		$.ajax({
			async: true,
			url: $yt_option.base_path + "finance/projectStatement/getProjects", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam: selectParam,
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			beforeSend: function() {
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag == 0) {
					if(data.data && data.data && data.data.length > 0) {
						$("select.class-select").empty();
						//遍历给下拉框添加数据
						$.each(data.data, function(i, v) {
							$("select.class-select").append($('<option value="' + v.projectCode + '">' + v.projectName + '</option>').data("classData", v));
						});
						$('select.class-select').niceSelect({
				        search: true,  
				        backFunction: function(text) {  
				            //回调方法,可以执行模糊查询,也可自行添加操作  
				           $('select.class-select option').remove();  
				            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
				            $.each(data.data, function(i, v) {  
				                if(v.projectName.indexOf(text) != -1) { 
				                   $('select.class-select').append($('<option value="' + v.projectCode + '">' + v.projectName + '</option>').data("classData", v));  
								}
				            });  
				        }  
					});
					}
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
						$yt_baseElement.hideLoading();
					});
				}

			}, //回调函数 匿名函数返回查询结果  
		});
	},
	getProjectStatementByProjectCode: function(projectCode, identifications) {
		$.ajax({
			url: $yt_option.base_path + "finance/projectStatement/getProjectStatementByProjectCode", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				projectCode: projectCode,
				identifications: identifications
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称 
			beforeSend: function() {
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag == 0) {
					$.each(data.data, function(i, v) {
						$(".company-tbody,.person-tbody").find('input[type="checkbox"]').each(function(j, n) {
							if($(this).parents("tr").find("td").length < 6) {
								if($(this).val() == v.paymentValue && v.paymentType == "1") {
									$(this).setCheckBoxState("check");
									$(this).parents('tr').addClass('yt-table-active');
									$(this).addClass("statement-check")
								}
							} else {
								if($(this).val() == v.paymentValue && v.paymentType == (Number($(this).parents('tr').data('data').traineeType)+1)) {
									$(this).setCheckBoxState("check");
									$(this).parents('tr').addClass('yt-table-active');
									$(this).addClass("statement-check")
								}
							}
						})
					});
				} else {
					$yt_alert_Model.alertOne("查询失败");
				}
				$yt_baseElement.hideLoading();
			}
		})
	},
	//	//获取所有班级
//	groupOrPerson: function() {
//		//获取项目类型， 1:计划 2:委托 3:选学 4:调训
//		var projectType = $('.hid-project-type').val();
//		//判断项目类型调用对应项个人详情列表
//		if(projectType == 3 || projectType == 4) {
//			//调用选学和委托方法
//			billListInfo.getAlertListInfoDepute();
//		} else {
//			//调用计划和调训方法
//			billListInfo.getAlertListInfoPlan();
//		}
//	},
//	//选择所属项目之后获取已经对账的数据
//	getProjectStatementByProjectCode: function() {
//		//获取所有单位行
//		var companyTr = $('.company-table tbody').children();
//		//获取所有个人信息行
//		var personTr = $('.person-table tbody').children();
//		var projectCode = $('.class-select').val();
//		var identifications = $(".yt-table-active").find(".identifications").val();
//		$.ajax({
//			async: true,
//			url: $yt_option.base_path + "finance/projectStatement/getProjectStatementByProjectCode", //ajax访问路径  
//			type: "post", //ajax访问方式 默认 "post"  
//			data: {
//				projectCode: projectCode,
//				identifications: identifications
//			}, //ajax查询访问参数
//			before: function() {
//				$yt_baseElement.showLoading();
//			},
//			success: function(data) {
//				if(data.flag == 0) {
//					if(data.data != null) {
//						$.each(data.data, function(i, v) {
//							if(data.data.paymentType == 1) { //单位
//								$.each(companyTr, function(j, c) {
//									if($(c).find(".group-id").val() == v.paymentValue) {
//										$(c).find(".check-label").addClass("check");
//										$(c).find(".states").val(1); //隐藏input值为1标识为是原本已经存在的对账
//									}
//								});
//							} else { //人员
//								$.each(personTr, function(k, p) {
//									if($(p).find(".select-trainee-pkId").val() == v.paymentValue) {
//										$(p).find(".check-label").addClass("check");
//										$(p).find(".states").val(1); //隐藏input值为1标识为是原本已经存在的对账
//									}
//								});
//							}
//						});
//					}
//
//				}
//
//			}, //回调函数 匿名函数返回查询结果  
//		});
//	},
	//认领提交
	//	getAllClaimFn: function() {
	//		var companyTr = $('.company-table tbody').children();
	//		var personTr = $('.person-table tbody').children();
	//		var projectCode = $('.class-select').val();
	//		var paymentListDeleteArr = [];
	//		var paymentListAddArr = [];
	//		var uncollectedTotal = [];
	//		var paymentValue = "";
	//		//遍历单位列表
	//		$.each(companyTr, function(i, c) {
	//			if($(c).find(".states").val() == 0) { //删除的
	//				paymentValue = $(c).find(".group-id").val();
	//				var paymentListDeleteJson = {
	//					paymentType: "1",
	//					paymentValue: paymentValue
	//				};
	//				paymentListDeleteArr.push(paymentListDeleteJson);
	//			};
	//			if($(c).find(".states").val() == 2) { //新增的
	//				paymentValue = $(c).find(".group-id").val();
	//				var paymentListAddArrJson = {
	//					paymentType: "1",
	//					paymentValue: paymentValue
	//				}
	//				paymentListAddArr.push(paymentListAddArrJson);
	//			};
	//
	//		});
	//		//遍历个人详情列表
	//		$.each(personTr, function(j, k) {
	//			if($(k).find(".states").val() == 0) {
	//				paymentValue = $(j).find(".select-trainee-pkId").val();
	//				paymentListDeleteJson = {
	//					paymentType: "2",
	//					paymentValue: paymentValue
	//				};
	//				paymentListDeleteArr.push(paymentListDeleteJson);
	//			};
	//			if($(k).find(".states").val() == 2) { //新增的
	//				paymentValue = $(k).find(".select-trainee-pkId").val();
	//				var paymentListAddArrJson = {
	//					paymentType: "2",
	//					paymentValue: paymentValue
	//				}
	//				paymentListAddArr.push(paymentListAddArrJson);
	//			};
	//
	//		});
	//		var paymentListDeleteArrJson = JSON.stringify(paymentListDeleteArr);
	//		var paymentListAddArrJson = JSON.stringify(paymentListAddArr);
	//		var uncollectedTotal = "";
	//		var projectCode = $('.class-select').val();
	//		var identifications = $(".yt-table-active").find(".identifications");
	//		var bankStatementDetailsIds = $(".yt-table-active").find(".pkId");
	//		$.ajax({
	//			async: true,
	//			url: $yt_option.base_path + "finance/projectStatement/addNotReconciliations", //ajax访问路径  
	//			type: "post", //ajax访问方式 默认 "post"  
	//			data: {
	//				projectCode: projectCode,
	//				bankStatementDetailsIds: bankStatementDetailsIds,
	//				identifications: identifications,
	//				paymentListDelete: paymentListDeleteArrJson,
	//				paymentListAdd: paymentListAddArrJson,
	//				uncollectedTotal: ""
	//			}, //ajax查询访问参数
	//			before: function() {
	//				$yt_baseElement.showLoading();
	//			},
	//			success: function(data) {
	//				if(data.flag == 0) {
	//					$yt_baseElement.hideLoading();
	//				} else {
	//					$yt_baseElement.hideLoading(function() {
	//						$yt_alert_Model.prompt("认领失败");
	//					});
	//				}
	//			},
	//		});
	//	}
}
$(function() {
	//初始化方法
	billListInfo.init();
});