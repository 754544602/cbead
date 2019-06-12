var bankBillListInfo = {

	//初始化方法
	init: function() {
		//获取列表数据
		bankBillListInfo.getBillListInfo("2");
		bankBillListInfo.getBankStatementDetails();
		//获取所属项目下拉列表
		bankBillListInfo.getProjectInfo();
		//返回按钮
		$(".page-return-btn").on("click", function() {
			window.history.back();
		});
		//checkBox按钮事件
		$(".check-box-load").on("change", function() {
			if($('.check-sure input[type="checkbox"]').is(':checked')) {
				if($('.check-cancel input[type="checkbox"]').is(':checked')) {
					bankBillListInfo.getBillListInfo("2",$('.num-text.change-btn.active').text());
				} else {
					bankBillListInfo.getBillListInfo("1",$('.num-text.change-btn.active').text());
				}
			} else {
				if($('.check-cancel input[type="checkbox"]').is(':checked')) {
					bankBillListInfo.getBillListInfo("0",$('.num-text.change-btn.active').text());
				} else {
					$yt_baseElement.showLoading();
					htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
						'<td colspan="18" align="center" style="border:0px;">' +
						'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
						'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
						'</div>' +
						'</td>' +
						'</tr>';
					$(".project-tbody").html(htmlTr);
					$yt_baseElement.hideLoading();
				}
			}
		})
		var me = this;
		$(".bank-more-div").on("click", function() {
			$yt_baseElement.showLoading();
			if($(".bank-more-div").text() == "查看详情") {
				if($(".payment-list").hasClass("hide")) {

				}
				var width = parseInt($("#project-main").css("width"));
				var leftWidth = parseInt($(".bank-table-left").css('width'));
				$("#project-main").css("width", width + 1260 + "px");
				$(".bank-table-left").css("width", leftWidth + 1260 + 'px');
				$(".bank-th-hide").show();
				$(".bank-more-div").text("收起");
				var colspan = $(".bank-tbody-td").attr("colspan");
				$(".bank-tbody-td").attr("colspan", colspan + 11);
//				var sureArr = [];
//				$.each($('.surecheck input:checked'), function(i, v) {
//					sureArr.push($(v).val());
//				})
//				sureArr.join(',');
//				sureArr == '0,1' ? sureArr = 2 : sureArr = sureArr;
//				me.getBillListInfo(sureArr);
				$('.page1').pageInfo('refresh')
			} else {
				var width = parseInt($("#project-main").css("width"));
				var leftWidth = parseInt($(".bank-table-left").css('width'));
				$("#project-main").css("width", width - 1260 + "px");
				$(".bank-table-left").css("width", leftWidth - 1260 + 'px');
				$(".bank-th-hide").hide();
				$(".bank-more-div").text("查看详情");
				var colspan = $(".bank-tbody-td").attr("colspan");
				$(".bank-tbody-td").attr("colspan", colspan - 11);
//				var sureArr = [];
//				$.each($('.surecheck input:checked'), function(i, v) {
//					sureArr.push($(v).val());
//				})
				/*sureArr.join(',');
				sureArr == '0,1' ? sureArr = 2 : sureArr = sureArr;
				me.getBillListInfo(sureArr);*/
				$('.page1').pageInfo('refresh')
			}
		});
		//项目详情查看详情按钮
		$(".project-more-div").on("click", function() {
			$yt_baseElement.showLoading();
			if($(".project-more-div").text() == "查看详情") {
				var width = parseInt($("#project-main").css("width"));
				var rightWidth = parseInt($(".bank-table-right").css('width'));
				$("#project-main").css("width", width + 480 + "px");
				$(".bank-table-right").css("width", rightWidth + 480 + 'px');
				$(".project-th-righthide").show();
				$(".project-more-div").text("收起");
				var colspan = $(".bank-tbody-td").attr("colspan");
				$(".bank-tbody-td").attr("colspan", colspan + 3);
//				var sureArr = [];
//				$.each($('.surecheck input:checked'), function(i, v) {
//					sureArr.push($(v).val());
//				})
//				sureArr.join(',');
//				sureArr == '0,1' ? sureArr = 2 : sureArr = sureArr;
//				me.getBillListInfo(sureArr);
				$('.page1').pageInfo('refresh')
				
			} else {
				var width = parseInt($("#project-main").css("width"));
				var rightWidth = parseInt($(".bank-table-right").css('width'));
				$(".bank-table-right").css("width", rightWidth - 480 + 'px');
				$("#project-main").css("width", width - 480 + "px");
				$(".project-th-righthide").hide();
				$(".project-more-div").text("查看详情");
				var colspan = $(".bank-tbody-td").attr("colspan");
				$(".bank-tbody-td").attr("colspan", colspan - 3);
//				var sureArr = [];
//				$.each($('.surecheck input:checked'), function(i, v) {
//					sureArr.push($(v).val());
//				})
//				sureArr.join(',');
//				sureArr == '0,1' ? sureArr = 2 : sureArr = sureArr;
//				me.getBillListInfo(sureArr);
				$('.page1').pageInfo('refresh')
				
			}
		});
		//无效流水单查看详情按钮
		$(".invalid-more-div").on("click", function() {
			$(".invalid-hide").show();
			$(".invalid-more-div").hide();
		});
		//确认入账
		$(".account-entry-sure").off().on("click", function() {
			var bool = false;
			$.each($(".bank-table-left tbody input[type=checkbox]:checked"),function(i, v) {
				var classes = $(v).parents('tr').attr('class').split(' ')[0];
				$('.bank-table-right .'+classes).each(function(j,k){
					console.log($(k).find('.claimDate').text());
					if($(k).find('.claimDate').text()=='无'){
						bool = true;
					}
				})
				
			});
			if(bool){
				$yt_alert_Model.prompt('请选择已手动入账的账单');
			}else{
				bankBillListInfo.accountEntryInfo("1");
			}
		});
		//取消入账
		$(".account-entry-cancel").on("click", function() {
			bankBillListInfo.accountEntryInfo("0");
		});
		//标记无效
		$(".update-effective-true").on("click", function() {
			bankBillListInfo.updateEffectiveInfo(0);
		});
		//标记有效
		$(".update-effective-cancel").on("click", function() {
			bankBillListInfo.updateEffectiveInfo(1);
		});
		//公布认领
		$(".update-admission").on("click", function() {
			bankBillListInfo.updateAdmission("1");
		});
		//手动入账弹窗
		$(".admission-manual").on("click", function() {
			$yt_baseElement.showLoading()
			//判断复选框
			var checkLength = $(".bank-table-left").find('tbody label input[type="checkbox"]:checked').length;
			var no = false;
			$('.rightTable .yt-table-active').each(function(i,n){
				if($(n).data('data')!=undefined){
					if($(n).data('data').reconciliationState==1){
						$yt_alert_Model.prompt("已入账的账单无法进行手动入账");
						 no = true;
					}
				}
			})
			if(no){
				$yt_baseElement.hideLoading()
				return false;
			}
			if(checkLength == 0) {
				$yt_alert_Model.prompt("请选择一条信息进行入账");
				$yt_baseElement.hideLoading()
				return false;
			}
			//手动入账弹窗方法
			bankBillListInfo.classAlertFunc();
			$yt_baseElement.hideLoading()
		});
		//复选框
		//全选  
		$(".get-project-inf-one input.check-all").unbind().bind("change", function() {
			var checkLabel=$(this).attr('checked');
				//判断自己是否被选中  
				if(checkLabel) {
					//调用设置选中方法,全选  
					$(this).parents("table").find("tbody input[type='checkbox']").setCheckBoxState("check");
					$(this).parents(".bank-table-left").find("tbody input[type='checkbox']").setCheckBoxState("check");
					$(".bank-table-left tbody tr").addClass('yt-table-active');
					$(".bank-table-right tbody tr").addClass('yt-table-active');
				} else {
					//设置反选  
					$(this).parents("table").find("tbody input[type='checkbox']").setCheckBoxState("uncheck");
					$(this).parents(".bank-table-left").find("tbody input[type='checkbox']").setCheckBoxState("uncheck");
					$(".bank-table-left tbody tr").removeClass('yt-table-active');
					$(".bank-table-right tbody tr").removeClass('yt-table-active');
					
				}
		});
		$(".get-project-inf-two .check-all,.person-table .check-all,.company-table .check-all").on("change", function() {
			var checkLabel=$(this).attr('checked');
				//判断自己是否被选中  
				if(checkLabel) {
					//调用设置选中方法,全选  
					$(this).parents("table").find("tbody input[type='checkbox']").setCheckBoxState("check");
					$(this).parents(".bank-table-left").find("tbody input[type='checkbox']").setCheckBoxState("check");
					$('.get-project-inf-two .yt-table .yt-tbody tr').addClass('yt-table-active');
				} else {
					//设置反选  
					$(this).parents("table").find("tbody input[type='checkbox']").setCheckBoxState("uncheck");
					$(this).parents(".bank-table-left").find("tbody input[type='checkbox']").setCheckBoxState("uncheck");
					$('.get-project-inf-two .yt-table .yt-tbody tr').removeClass('yt-table-active');
				}
			
			
		});
		//修改全选按钮状态
		$(".project-tbody,.invalid-tbody").on("change", "input[type='checkbox']", function() {
			if($(this).parents('tbody').find("input[type='checkbox']").length != $(this).parents('tbody').find("input[type='checkbox']:checked").length) {
				$(this).parents("table").find(".check-all").setCheckBoxState("uncheck");
			} else {
				$(this).parents("table").find(".check-all").setCheckBoxState("check");
			}
			if($(this).parents(".bank-table-left").find("tbody input[type='checkbox']").length != $(this).parents(".bank-table-left").find("tbody input[type='checkbox']:checked").length) {
				$(this).parents(".bank-table-left").find(".check-all").setCheckBoxState("uncheck");
			} else {
				$(this).parents(".bank-table-left").find(".check-all").setCheckBoxState("check");
			}
			
		});
		//点击选中状态
		$('.get-project-inf-one').off('click').on('click','tbody tr',function(){
			var classes = $(this).attr('class').split(' ')[0];
			if((' ' +  $(this).attr('class') + ' ').indexOf(' yt-table-active ')!=-1){
				$('.'+classes).removeClass('yt-table-active');
				$('.'+classes).find('input:checkbox').setCheckBoxState("uncheck");
			}else{
				$('.'+classes).addClass('yt-table-active');
				$('.'+classes).find('input:checkbox').setCheckBoxState("check");
			}
			if($(".bank-table-left").find("tbody input[type='checkbox']").length != $(".bank-table-left").find("tbody input[type='checkbox']:checked").length) {
				$(".bank-table-left").find(".check-all").setCheckBoxState("uncheck");
			} else {
				$(".bank-table-left").find(".check-all").setCheckBoxState("check");
			}
			//阻止冒泡
			return false;
		})
		$('.get-project-inf-two .yt-table .yt-tbody').on("click",'tr',function(){
		    if($(this).hasClass('yt-table-active')){
		    	$(this).removeClass('yt-table-active');
		   		 $(this).find('input:checkbox').setCheckBoxState("uncheck");
		    }else{
		    	 $(this).addClass('yt-table-active');
		   		 $(this).find('input:checkbox').setCheckBoxState("check");
		    }
		    if($(".get-project-inf-two").find("tbody input[type='checkbox']").length != $(".get-project-inf-two").find("tbody input[type='checkbox']:checked").length) {
				$(".get-project-inf-two").find(".check-all").setCheckBoxState("uncheck");
			} else {
				$(".get-project-inf-two").find(".check-all").setCheckBoxState("check");
			}
			//阻止冒泡
			return false;
		});
	},
	//手动入账弹窗
	classAlertFunc: function() {
		//初始化数据
		$(".check-all").setCheckBoxState("uncheck")
		$(".project-name-select").setSelectVal("");
//		$(".project-name-select").niceSelect();
		//单位列表
		bankBillListInfo.getNoDetailedList("0");
//		//学员列表
		bankBillListInfo.getDetailedPersonalList("0", "");
		//下拉框change事件
		//标识
		var identifications = [];
		//银行流水Id
		var bankStatementDetailsIds = "";
		var bankarr = [];
		var money = 0 
		var htmlUl = $(".accountName");
		htmlUl.empty();
		var checkIdentifications="";
		$(".bank-table-left").find('label input[type=checkbox]:checked').each(function(i, v) {
			var htmlLi = '';
			//获取对方户名
			$.each($(this).parents("tbody").find("td.otherPartyName"), function(a, b) {
				htmlLi += '<li>' + $(b).text() + '</li>';
			});
			htmlUl.append(htmlLi);
			
			//获取银行流水ID
			$.each($(v).parents('.leftTable').find('tr'), function(a, b) {
				bankarr.push($(b).data('data').pkId);
			});
			//获取标识
			var identification = $(this).parents("tr").data('data').identification;
			if(identification!=''){
				identifications.push(identification)
			}else{
				money += Number($(this).parents("tr").data('data').income);
			}
			 
			if (i==0) {
				checkIdentifications = identification;
			}else{
				checkIdentifications += ','+identification;
			}
			
		})
		identifications = identifications.join(',');
		bankStatementDetailsIds = bankarr.join(',');
		//点击手动入账按钮获取剩余未对帐金额
		//bankBillListInfo.getNotReconciliations(checkIdentifications,money);
		//项目code
		var projectCode = "";
		$(".search-btn").click(function() {
			var keyword = $("#keyword").val();
			bankBillListInfo.getDetailedPersonalList(projectCode, keyword);
		})
		$("select.project-name-select").off().change(function() {
			if($(this).val() == "OTHER") {
				//其他班级弹窗样式设置
				$(".alert-table-div").hide();
				$(".alert-div-input").hide();
				$("#confiscate-amount").show();
				$("#user-name").css({
					float: "none",
					'margin': "8px 48px 8px 84px"
				});
				$("#last-amount").css({
					float: "none",
					'margin': "8px 0px 8px 42px"
				});
				$("#form-class").css({
					float: "none",
					'margin': "8px 48px 8px 84px"
				});
				$(".select-teacher-div").width("auto");
				$(".yt-edit-alert-main").height("auto");
				$('.association-sure-btn').off().on('click', function() {
					var uncollectedTotal = $("input.uncollectedTotal").val();
					bankBillListInfo.addNotReconciliations("OTHER", "", "", "", "",uncollectedTotal);
				});
				//计算弹出框位置
				$yt_alert_Model.setFiexBoxHeight($(".select-teacher-div .yt-edit-alert-main"));
				$yt_alert_Model.getDivPosition($(".select-teacher-div"));
				$yt_model_drag.modelDragEvent($(".select-teacher-div .yt-edit-alert-title"));
			} else {
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
				//计算弹出框位置
				$yt_alert_Model.setFiexBoxHeight($(".select-teacher-div .yt-edit-alert-main"));
				$yt_alert_Model.getDivPosition($(".select-teacher-div"));
				$yt_model_drag.modelDragEvent($(".select-teacher-div .yt-edit-alert-title"));
//				$("select").niceSelect();
				//获取code
				projectCode = $(this).val();
				bankBillListInfo.getNoDetailedList(projectCode);
				bankBillListInfo.getDetailedPersonalList(projectCode, "");
				
				//改变同时获取一次标识
				
					//标识
					var identifications = [];
					$(".bank-table-left").find('label input[type="checkbox"]:checked').each(function(i, v) {
						var identification = $(this).parents("tr").data('data').identification;
						if(identification!=''){
						identifications.push(identification)
						}
					})
					identifications = identifications.join(',')
					bankBillListInfo.getProjectStatementByProjectCode(projectCode, identifications);
				
//				if($(".payment-list").hasClass("hide") || $(".identifications-div").text() != "") {
//					var identifications = $(".identifications-div").text();
//					//获取选择项目之后的数据
//					bankBillListInfo.getProjectStatementByProjectCode(projectCode, identifications);
//				} else {
//					//标识
//					var identifications = "";
//					$(".bank-table-left").find('label input[type="checkbox"]:checked').each(function(i, v) {
//						var identification = $(this).parents("tr").data('data').identification;
//						if(i == 0) {
//							identifications = identification;
//						} else {
//							identifications += "," + identification
//						}
//					})
//					bankBillListInfo.getProjectStatementByProjectCode(projectCode, identifications);
//				}
			}
			//单位列表标识0有数据1没有
			var company=$('.company-tbody').parents('table').attr('isor');
			console.log('company',company);
			//学员列表标识	
			var student=$('.person-tbody').parents('table').attr('isor');
			console.log('student',student);
			if(company==0&&student==1){
				$('.company-tbody').parents('table').show();
				$('.person-tbody').parents('table').hide();
			}else if(company==1&&student==0){
				$('.person-tbody').parents('table').show();
				$('.company-tbody').parents('table').hide();
			}else if(company==1&&student==1){
				$('.person-tbody').parents('table').hide();
				$('.company-tbody').parents('table').show()
				$('.company-tbody').parents('table').find('thead').hide();
				$('.company-tbody').parents('table').find('tbody').show();
			}
		});

		//关联按钮
		$(".association-sure-btn").off().on("click", function() {
			$yt_baseElement.showLoading();
			//关联的单位和个人新增的数据
			var paymentListAdd = [];
			$(".company-tbody,.person-tbody").find('label input[type="checkbox"]:checked').each(function() {
				if($(this).hasClass("statement-check")) {

				} else {
					var paymentType = "";
					var paymentValue = $(this).val();
					if($(this).parents("tr").find("td").length > 6) {
						paymentType = Number($(this).parents("tr").data('data').traineeType)+1;
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
					paymentType = Number($(this).parents("tr").data('data').traineeType)+1;
//					paymentType = "2";
				} else {
					paymentType = "1";
				}
				var paymentListDeleteArr = {
					paymentType: paymentType,
					paymentValue: paymentValue
				}
				paymentListDelete.push(paymentListDeleteArr);
			});
			//判断是否有选中的checkBox
			//			var identifications = $(".identifications-div").text();
			var identifications = [];
			$(".bank-table-left").find('label input[type="checkbox"]:checked').each(function(i, v) {
				//获取标识
				var identification = $(this).parents("tr").data('data').identification;
				if(identification!=''){
					identifications.push(identification)
				}
			})
			identifications = identifications.join(',')
			var strpaymentListDelete;
			var strpaymentListAdd;
			JSON.stringify(paymentListDelete) =='[]'?strpaymentListDelete='':strpaymentListDelete=JSON.stringify(paymentListDelete);
			JSON.stringify(paymentListAdd) =='[]'?strpaymentListAdd='':strpaymentListAdd=JSON.stringify(paymentListAdd);
			bankBillListInfo.addNotReconciliations(projectCode, identifications, bankStatementDetailsIds, strpaymentListDelete,strpaymentListAdd, "")
		});
		//获取剩余未对帐金额
		bankBillListInfo.getNotReconciliations(identifications,money);
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
		//单位列表标识0有数据1没有
		var company=$('.company-tbody').parents('table').attr('isor');
		console.log('company',company);
		//学员列表标识
		var student=$('.person-tbody').parents('table').attr('isor');
		console.log('student',student);
		if(company==0&&student==1){
			$('.person-tbody').parents('table').hide();
		}else if(company==1&&student==0){
			$('.company-tbody').parents('table').hide();
		}else if(company==1&&student==1){
			$('.person-tbody').parents('table').hide();
			$('.company-tbody').parents('table').show();
			$('.company-tbody').parents('table').find('thead').hide();
		}
		//取消按钮
		$('.select-teacher-canel-btn').click(function() {
			$(".yt-edit-alert,#heard-nav-bak").hide();
			$("#pop-modle-alert").hide();
		});
	},
	//提交表单
	addNotReconciliations: function(projectCode, identifications, bankStatementDetailsIds, paymentListDelete, paymentListAdd, uncollectedTotal) {
		var me = this;
		$.ajax({
			url: $yt_option.base_path + "finance/projectStatement/addNotReconciliations", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				isUserClaim:'',
				projectCode: projectCode,
				bankStatementDetailsIds: bankStatementDetailsIds,
				identifications: identifications,
				paymentListDelete: paymentListDelete,
				paymentListAdd: paymentListAdd,
				uncollectedTotal: uncollectedTotal
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称 
			before: function() {
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag == 0) {
					$(".yt-edit-alert,#heard-nav-bak").hide();
					$("#pop-modle-alert").hide();
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("关联成功");
						$('.person-page').pageInfo("refresh");
						var sureArr = [];
						$.each($('.surecheck input:checked'), function(i, v) {
							sureArr.push($(v).val());
						})
						sureArr.join(',');
						sureArr == '0,1' ? sureArr = 2 : sureArr = sureArr;
						me.getBillListInfo(sureArr);
					});
//					$(".identifications-div").text(data.data);
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("关联失败");
					});
				}
			}
		})
	},
	//手动入账-选择所属项目之后获取数据
	getProjectStatementByProjectCode: function(projectCode, identifications) {
		$.ajax({
			url: $yt_option.base_path + "finance/projectStatement/getProjectStatementByProjectCode", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				projectCode: projectCode,
				identifications: identifications
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称 
			before: function() {
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag == 0) {
					if(data.data!=null){
						$.each(data.data, function(i, v) {
						$(".company-tbody,.person-tbody").find('input[type="checkbox"]').each(function(j, n) {
							if($(this).parents("tr").find("td").length < 6) {
								if($(this).val() == v.paymentValue && v.paymentType == "1") {
									$(this).setCheckBoxState("check");
									$(this).addClass("statement-check")
									$(this).parents('tr').addClass('yt-table-active');
								}
								if($(".company-tbody").find("input[type='checkbox']").length != $(".company-tbody").find("input[type='checkbox']:checked").length) {
									$(".company-table").find(".check-all").setCheckBoxState("uncheck");
								} else {
									$(".company-table").find(".check-all").setCheckBoxState("check");
								}
							} else {
								if($(this).val() == v.paymentValue && v.paymentType == (Number($(this).parents('tr').data('data').traineeType)+1)) {
									$(this).setCheckBoxState("check");
									$(this).addClass("statement-check")
									$(this).parents('tr').addClass('yt-table-active');
								}
								if($(".person-table tbody").find("input[type='checkbox']").length != $(".person-table tbody").find("input[type='checkbox']:checked").length) {
									$(".person-table").find(".check-all").setCheckBoxState("uncheck");
								} else {
									$(".person-table").find(".check-all").setCheckBoxState("check");
								}
							}
						})
					});
					}else{
						
					}
				} else {
					$yt_alert_Model.prompt("查询失败");
				}
				$yt_baseElement.hideLoading();
			}
		})
	},
	//对账单详情
	getBankStatementDetails: function() {
		var pkId = $yt_common.GetQueryString("pkId");
		$.ajax({
			url: $yt_option.base_path + "finance/bankStatement/getBankStatementDetails", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				pkId: pkId
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称 
			before: function() {
				$yt_baseElement.showLoading();
			},
			async:true,
			success: function(data) {
				if(data.flag == 0) {
					$(".bill-info-table").setDatas(data.data);
					/*无效流水单*/
					var htmlTr = "";
					var htmlTbody = $(".invalid-tbody");
					var noEffectiveList = JSON.parse(data.data.noEffectiveList);
					htmlTbody.empty();
					if(noEffectiveList.length>0){
						$.each(noEffectiveList, function(i, v) {
						htmlTr = '<tr>' +
							'<td width="30px" style="text-align: center;">' +
							'<label class="check-label yt-checkbox"><input type="checkbox" name="test"/></label>' + '</td>' +
							'<td>' + (i + 1) + '</td>' +
							'<td>' + v.exchangeHour + '</td>' +
							'<td class="invalid-hide" style="text-align:right;display:none">' + v.draw + '</td>' +
							'<td style="text-align:right;">' + v.income + '</td>' +
							'<td class="invalid-hide" style="text-align:right;display:none"">' + v.balance + '</td>' +
							'<td class="invalid-hide" style="display:none">' + v.currency + '</td>' +
							'<td>' + v.otherPartyName + '</td>' +
							'<td>' + v.otherPartyAccounts + '</td>' +
							'<td>' + v.otherPartyGroup + '</td>' +
							'<td class="invalid-hide" style="display:none">' + v.accountDate + '</td>' +
							'<td class="invalid-hide" style="display:none">' + v.bankTradeNumber + '</td>' +
							'<td class="invalid-hide" style="display:none">' + v.enterpriseTradeNumber + '</td>' +
							'<td class="invalid-hide" style="display:none">' + v.voucherType + '</td>' +
							'<td class="invalid-hide" style="display:none">' + v.voucherNo + '</td>' +
							'<td class="invalid-hide" style="display:none">' + v.associatedAccount + '</td>' +
							'<td class="invalid-hide" style="display:none">' + v.alias + '</td>' +
							'<td>' + v.abstractData + '</td>' +
							'<td style="text-align:left;">' + v.remarks + '</td>' +
							'</tr>';
							htmlTr= $(htmlTr).data('data',v);
							htmlTbody.append(htmlTr);
					});
					if($('.invalid-more-div').css('display')=='none'){
						$('.invalid-hide').show();
					}
					}else{
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
			}
		})
	},
	/**
	 * 对账单信息列表
	 */
	getBillListInfo: function(isAdmission,pageIndex) {
		var keyword = $('#keyword').val();
		var pkId = $yt_common.GetQueryString("pkId");
		if(!pageIndex){
			pageIndex=1
		}
		$('.page1').pageInfo({
			pageIndexs: pageIndex,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "finance/bankStatement/getBankStatementDetailsList", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam: keyword,
				pkId: pkId,
				isAdmission: isAdmission,
				isClaimUser: "2",
				isUserProject:''
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			before:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag == 0) {
					var htmlLeftBody = $('.bank-table-left');
					var htmlRightBody = $('.bank-table-right');
					var htmlLeftTr = '';
					var htmlRightTr = '';
					var repetitionArr = [];
					var ordernum = 0;
					htmlLeftBody.find('tbody').empty();
					htmlRightBody.find('tbody').empty();
					$.each($('table.leftTable'), function(x, y) {
						$(y).remove();
					});
					$.each($('table.rightTable'), function(x, y) {
						$(y).remove();
					});
					$('.num').text(data.data.total);
					if(data.data.rows.length > 0) {
						$.each(data.data.rows, function(i, n) {
							var bool = true;
							//之前出现的判断不让其出现
							for(let j = 0; j < repetitionArr.length; j++) {
								if(i == repetitionArr[j]) {
									bool = false;
								}
							}
							if(bool == false) {
								return true
							}
							ordernum += 1;
							var leftnum = 0;
							var rightnum = 0;
							var rightbool = true;
							htmlLeftBody.append('<table class="leftTable leftTable' + i + '" width="100%"><tbody class="yt-body project-tbody"></tbody></table>')
							htmlRightBody.append('<table class="rightTable rightTable' + i + '" width="100%"><tbody class="yt-body project-tbody"></tbody></table>');
							//右
							$.each(data.data.paymentList, function(k, v) {
								if(n.identification == v.identification) {
									rightbool = false;
									rightnum += 1;
									if(rightnum == 1) {
										htmlRightTr = '<tr class="' + i + '">' +
											//项目销售
											'<td width="190px" class="project-th-righthide payment-list merge-last" style="display: none;text-align:center">' + '<input class="identification-last" style="display:none;" value="' + v.identification + '">' + v.projectSell + '</td>' +
											//认领时间
											'<td width="90px" class="project-th-righthide payment-list claimDate merge-last" style="display: none;text-align:center">' + v.claimDate + '</td>' +
											//项目名称
											'<td width="137px" class="payment-list merge-last" style="text-align:left">' + v.projectName + '</td>' +
											//项目周期
											'<td width="200px" class="payment-list merge-last" style="text-align:center">' + v.projectDate + '</td>' +
											//学员姓名
											'<td width="200px" class="payment-list merge-last" style="text-align:left">' + v.traineeOrGroupName + '</td>' +
											//单位
											'<td width="200px" class="project-th-righthide payment-list merge-last" style="display: none;text-align:left">' + v.orgName + '</td>' +
											//未收金额
											'<td width="68px" class="payment-list merge-last uncollectedTotal" style="text-align:right;">' + v.uncollectedTotal + '</td>' +
											//对账金额
											'<td width="67px" class="payment-list merge-last reconciliationsTotal rightTd' + i + '" style="text-align:right;">' + v.reconciliationsTotal + '</td>' +
											//入账金额
											'<td width="70px" class="payment-list merge-last admissiontotal rightTd' + i + '" style="text-align:right;">' + v.admissiontotal + '</td>' +
											//差额
											'<td width="90px" class="payment-list merge-last differencetotal rightTd' + i + '" style="text-align:right;">' + v.differencetotal + '</td>' +
											//入账确认
											'<td width="60px" class="payment-list merge-last rightTd' + i + '" style="text-align:center;">' + (bankBillListInfo.confirmFunc(v.reconciliationState)) + '</td>' +
											//入账人
											'<td width="100px" class="payment-list merge-last rightTd' + i + '" style="text-align:center;">' + v.admissionConfirmUser + '</td>' +
											'</tr>';
											htmlRightTr = $(htmlRightTr).data('data',v);
										$('.rightTable' + i).find('tbody').append(htmlRightTr);
									} else {
										htmlRightTr = '<tr class="' + i + '">' +
											//项目销售
											'<td width="190px" class="project-th-righthide payment-list merge-last" style="display: none;text-align:center;">' + '<input class="identification-last" style="display:none;" value="' + v.identification + '">' + v.projectSell + '</td>' +
											//认领时间
											'<td width="90px" class="project-th-righthide payment-list claimDate merge-last" style="display: none;text-align:center;">' + v.claimDate + '</td>' +
											//项目名称
											'<td width="137px" class="payment-list merge-last" style="text-align:left;">' + v.projectName + '</td>' +
											//项目周期
											'<td width="200px" class="payment-list merge-last" style="text-align:center;">' + v.projectDate + '</td>' +
											//学员姓名
											'<td width="200px" class="payment-list merge-last" style="text-align:left;">' + v.traineeOrGroupName + '</td>' +
											//单位
											'<td width="200px" class="project-th-righthide payment-list merge-last" style="display: none;text-align:left;">' + v.orgName + '</td>' +
											//未收金额
											'<td width="68px" class="payment-list merge-last uncollectedTotal" style="text-align:right;">' + v.uncollectedTotal + '</td>' +
											'</tr>';
											htmlRightTr = $(htmlRightTr).data('data',v);
										$('.rightTable' + i).find('tbody').append(htmlRightTr);
									}
								}
							});
							//左
							$.each(data.data.rows, function(x, y) {
								if(n.identification == y.identification&&n.identification!='') {
									repetitionArr.push(x);
									leftnum += 1;
									if(leftnum == 1) {
										htmlLeftTr = '<tr class="' + i + '">' +
											'<td width="30px" style="text-align: center;" class="merge leftTd' + i + '">' +
											'<label class="check-label yt-checkbox select-teacher-checkbox"><input type="checkbox" name="test"/></label>' + '</td>' +
											'<td width="40px" class="merge leftTd' + i + '" style = "text-align:center">' + '<input class="identification-last" style="display:none;" value="' + y.identification + '">' + ordernum + '</td>' +
											//交易时间
											'<td width="90px" class="merge" style = "text-align:center">' + '<input type="text" name="test" style="display:none" class="pkId" value="' + y.pkId + '"/>' + y.exchangeHour + '</td>' +
											//借方发生额
											'<td width="98px" class="bank-th-hide merge" style="text-align:right;display:none">' + y.draw + '</td>' +
											//贷方发生额
											'<td width="98px" class="merge income" style="text-align:right">' + y.income + '</td>' +
											//余额
											'<td width="98px" class="bank-th-hide merge" style="text-align:right;display:none">' + y.balance + '</td>' +
											//币种
											'<td width="60px" class="bank-th-hide merge" style="display:none;text-align:center">' + y.currency + '</td>' +
											//对方户名
											'<td style="text-align: left;" width="131px" class="otherPartyName merge">' + y.otherPartyName + '</td>' +
											//对方账户
											'<td width="131px" class="bank-th-hide merge" style="display:none">' + '<input class="identification" style="display:none;" value="' + y.identification + '">' + y.otherPartyAccounts + '</td>' +
											//对方开户机构
											'<td width="131px" class="bank-th-hide merge" style="display:none;text-align: left;">' + y.otherPartyGroup + '</td>' +
											//记账日期
											'<td width="80px" class="bank-th-hide merge" style="display:none;text-align:center">' + y.accountDate + '</td>' +
											//摘要
											'<td width="116px" class="bank-th-hide merge" style="display:none; text-align: left;">' + y.abstractData + '</td>' +
											//备注
											'<td style="text-align: left;" width="116px" class="merge">' + y.remarks + '</td>' +
											//账户明细编号-交易流水号
											'<td width="160px" class="merge">' + y.bankTradeNumber + '</td>' +
											//企业流水号
											'<td width="131px" class="bank-th-hide merge" style="display:none">' + y.enterpriseTradeNumber + '</td>' +
											//凭证种类
											'<td width="116px" class="bank-th-hide merge" style="display:none">' + y.voucherType + '</td>' +
											//凭证号
											'<td width="77px" class="bank-th-hide merge" style="display:none;text-align:center">' + y.voucherNo + '</td>' +
											//关联账户
											'<td width="131px" class="bank-th-hide merge" style="display:none;text-align:center">' + y.associatedAccount + '</td>' +
											//别名
											'<td width="131px" class="bank-th-hide merge" style="display:none">' + y.alias + '</td>' +
											'</tr>';
											htmlLeftTr = $(htmlLeftTr).data('data',y);
										$('.leftTable' + i).find('tbody').append(htmlLeftTr);
									} else{
										htmlLeftTr = '<tr class="' + i + '">' +
											//交易时间
											'<td width="90px" class="merge" style = "text-align:center">' + '<input type="text" name="test" style="display:none" class="pkId" value="' + y.pkId + '"/>' + y.exchangeHour + '</td>' +
											//借方发生额
											'<td width="98px" class="bank-th-hide merge" style="text-align:right;display:none">' + y.draw + '</td>' +
											//贷方发生额
											'<td width="98px" class="merge income" style="text-align:right">' + y.income + '</td>' +
											//余额
											'<td width="98px" class="bank-th-hide merge" style="text-align:right;display:none">' + y.balance + '</td>' +
											//币种
											'<td width="60px" class="bank-th-hide merge" style="display:none;text-align:center">' + y.currency + '</td>' +
											//对方户名
											'<td width="131px" class="otherPartyName merge" style = "text-align:left">' + y.otherPartyName + '</td>' +
											//对方账户
											'<td width="131px" class="bank-th-hide merge" style="display:none">' + '<input class="identification" style="display:none;" value="' + y.identification + '">' + y.otherPartyAccounts + '</td>' +
											//对方开户机构
											'<td width="131px" class="bank-th-hide merge" style="display:none;text-align:left;">' + y.otherPartyGroup + '</td>' +
											//记账日期
											'<td width="80px" class="bank-th-hide merge" style="display:none;text-align:center">' + y.accountDate + '</td>' +
											//摘要
											'<td width="116px" class="bank-th-hide merge" style="display:none;text-align:left;">' + y.abstractData + '</td>' +
											//备注
											'<td style="text-align:left;" width="116px" class="merge">' + y.remarks + '</td>' +
											//账户明细编号-交易流水号
											'<td width="160px" class="merge">' + y.bankTradeNumber + '</td>' +
											//企业流水号
											'<td width="131px" class="bank-th-hide merge" style="display:none">' + y.enterpriseTradeNumber + '</td>' +
											//凭证种类
											'<td width="116px" class="bank-th-hide merge" style="display:none">' + y.voucherType + '</td>' +
											//凭证号
											'<td width="77px" class="bank-th-hide merge" style="display:none;text-align:center">' + y.voucherNo + '</td>' +
											//关联账户
											'<td width="131px" class="bank-th-hide merge" style="display:none;text-align:center">' + y.associatedAccount + '</td>' +
											//别名
											'<td width="131px" class="bank-th-hide merge" style="display:none">' + y.alias + '</td>' +
											'</tr>';
											htmlLeftTr = $(htmlLeftTr).data('data',y);
										$('.leftTable' + i).find('tbody').append(htmlLeftTr);
									}

								}
							});
							if(n.identification==''){
								leftnum=1;
								htmlLeftTr = '<tr class="' + i + '">' +
											'<td width="30px" style="text-align: center;" class="merge leftTd' + i + '">' +
											'<label class="check-label yt-checkbox select-teacher-checkbox"><input type="checkbox" name="test"/></label>' + '</td>' +
											'<td width="40px" class="merge leftTd' + i + '" style = "text-align:center">' + '<input class="identification-last" style="display:none;" value="' + n.identification + '">' + ordernum + '</td>' +
											//交易时间
											'<td width="90px" class="merge" style = "text-align:center">' + '<input type="text" name="test" style="display:none" class="pkId" value="' + n.pkId + '"/>' + n.exchangeHour + '</td>' +
											//借方发生额
											'<td width="98px" class="bank-th-hide merge" style="text-align:right;display:none">' + n.draw + '</td>' +
											//贷方发生额
											'<td width="98px" class="merge income" style="text-align:right">' + n.income + '</td>' +
											//余额
											'<td width="98px" class="bank-th-hide merge" style="text-align:right;display:none">' + n.balance + '</td>' +
											//币种
											'<td width="60px" class="bank-th-hide merge" style="display:none;text-align:center">' + n.currency + '</td>' +
											//对方户名
											'<td style="text-align:left;" width="131px" class="otherPartyName merge">' + n.otherPartyName + '</td>' +
											//对方账户
											'<td width="131px" class="bank-th-hide merge" style="display:none">' + '<input class="identification" style="display:none;" value="' + n.identification + '">' + n.otherPartyAccounts + '</td>' +
											//对方开户机构
											'<td width="131px" class="bank-th-hide merge" style="display:none;text-align:left;">' + n.otherPartyGroup + '</td>' +
											//记账日期
											'<td width="80px" class="bank-th-hide merge" style="display:none;text-align:center">' + n.accountDate + '</td>' +
											//摘要
											'<td width="116px" class="bank-th-hide merge" style="display:none;text-align:left;">' + n.abstractData + '</td>' +
											//备注
											'<td style="text-align:left;" width="116px" class="merge">' + n.remarks + '</td>' +
											//账户明细编号-交易流水号
											'<td width="160px" class="merge" style="text-align:left;">' + n.bankTradeNumber + '</td>' +
											//企业流水号
											'<td width="131px" class="bank-th-hide merge" style="display:none">' + n.enterpriseTradeNumber + '</td>' +
											//凭证种类
											'<td width="116px" class="bank-th-hide merge" style="display:none">' + n.voucherType + '</td>' +
											//凭证号
											'<td width="77px" class="bank-th-hide merge" style="display:none;text-align:center">' + n.voucherNo + '</td>' +
											//关联账户
											'<td width="131px" class="bank-th-hide merge" style="display:none;text-align:center">' + n.associatedAccount + '</td>' +
											//别名
											'<td width="131px" class="bank-th-hide merge" style="display:none">' + n.alias + '</td>' +
											'</tr>';
											htmlLeftTr = $(htmlLeftTr).data('data',n);
										$('.leftTable' + i).find('tbody').append(htmlLeftTr);
							}
							if(rightbool) {
							htmlRightTr = '<tr class="' + i + '">' +
										//项目销售
										'<td width="190px" class="project-th-righthide payment-list merge-last" style="display: none;text-align:center"><span style="opacity:0">无</span></td>' +
										//认领时间
										'<td width="90px" class="project-th-righthide payment-list claimDate merge-last" style="display: none;text-align:center"><span style="opacity:0">无</span></td>' +
										//项目名称
										'<td width="137px" class="payment-list merge-last" style="text-align:left"><span style="opacity:0">无</span></td>' +
										//项目周期
										'<td width="200px" class="payment-list merge-last" style="text-align:center"><span style="opacity:0">无</span></td>' +
										//学员姓名
										'<td width="200px" class="payment-list merge-last" style="text-align:left"><span style="opacity:0">无</span></td>' +
										//单位
										'<td width="200px" class="project-th-righthide payment-list merge-last" style="display: none;text-align:left"><span style="opacity:0">无</span></td>' +
										//未收金额
										'<td width="68px" class="payment-list merge-last" style="text-align:right;"><span style="opacity:0">无</span></td>' +
										//对账金额
										'<td width="67px" class="payment-list merge-last" style="text-align:right;"><span style="opacity:0">无</span></td>' +
										//入账金额
										'<td width="70px" class="payment-list merge-last" style="text-align:right;"><span style="opacity:0">无</span></td>' +
										//差额
										'<td width="90px" class="payment-list merge-last" style="text-align:right;"><span style="opacity:0">无</span></td>' +
										//入账确认
										'<td width="60px" class="payment-list merge-last" style="text-align:center;"><span style="opacity:0">无</span></td>' +
										//入账人
										'<td width="100px" class="payment-list merge-last" style="text-align:center;"><span style="opacity:0">无</span></td>' +
										'</tr>';
										$('.rightTable' + i).find('tbody').append(htmlRightTr);
									}
							$('.leftTd' + i).attr('rowspan', leftnum);
							$('.rightTd' + i).attr('rowspan', rightnum);
							if($(".bank-more-div").text() == '收起') {
								htmlLeftBody.find('.bank-th-hide').show();
							}
							if($(".project-more-div").text() == '收起') {
								htmlRightBody.find('.project-th-righthide').show();
							}
							var tableHeight = 0;
							$('.leftTable' + i).height() > $('.rightTable' + i).height() ? tableHeight = $('.leftTable' + i).height() : tableHeight = $('.rightTable' + i).height();
							$('.leftTable' + i).height() == $('.rightTable' + i).height() ? tableHeight = $('.leftTable' + i).height() : false;
							$('.leftTable' + i).css('height', tableHeight + 'px');
							$('.rightTable' + i).css('height', tableHeight + 'px');
							var uncollectedTotal=0;
							$.each($(".rightTable" + i).find('.uncollectedTotal'), function(i,n) {
								  uncollectedTotal+= Number($(n).text())
							});
							var income=0;
							$.each($(".leftTable" + i).find('.income'), function(i,n) {
								  income+= Number($(n).text())
							});
							$(".rightTable" + i).find('.reconciliationsTotal').text(uncollectedTotal);
							$(".rightTable" + i).find('.admissiontotal').text(income);
							$(".rightTable" + i).find('.differencetotal').text(income-uncollectedTotal);
//							if((income-uncollectedTotal)==0){
//								var pkIds = [];
//								$.each($(".leftTable" + i).find('tr'), function(i,n) {
//									pkIds.push($(n).data('data').pkId);
//								});
//								pkIds=pkIds.join(',')
//								bankBillListInfo.accountEntryInfo("1",pkIds,false);
//							}
						});
					}else{
						var htmlTr = '<table class="list-table"><tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="5" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr></table>';
							htmlLeftBody.append(htmlTr)
							htmlRightBody.append(htmlTr)
					}
						$yt_baseElement.hideLoading()
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}
			}, //回调函数 匿名函数返回查询结果  
			error:function(){
				$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("网络异常，查询失败");
					});
			},
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	//获取所属项目下拉列表
	getProjectInfo: function() {
		$yt_baseElement.showLoading();
		var selectParam = "";
		$.ajax({
			async: true,
			url: $yt_option.base_path + "finance/projectStatement/getProjects", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam: selectParam,
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				if(data.flag == 0) {
					if(data.data && data.data && data.data.length > 0) {
						//遍历给下拉框添加数据
						$("select.project-name-select").empty();
						$("select.project-name-select").append('<option value="">请选择</option>');
						$.each(data.data, function(i, v) {
							$("select.project-name-select").append($('<option value="' + v.projectCode + '">' + v.projectName + '</option>').data("classData", v));
						});
						$('select.project-name-select').niceSelect({
				        search: true,  
				        backFunction: function(text) {  
				            //回调方法,可以执行模糊查询,也可自行添加操作  
				           $('select.project-name-select option').remove();  
				           if(text==''){
							$("select.project-name-select").append('<option value="">请选择</option>');
				           }
				            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
				            $.each(data.data, function(i, v) {  
				                if(v.projectName.indexOf(text) != -1) { 
				                   $('select.project-name-select').append($('<option value="' + v.projectCode + '">' + v.projectName + '</option>').data("classData", v));  
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
	/**
	 * 弹窗单位信息列表
	 */
	getNoDetailedList: function(projectCode) {
		var url = 'finance/settlement/getNoDetailedList';
		if($('.project-name-select option:selected').data('classData')){
			if($('.project-name-select option:selected').data('classData').projectType==2||$('.project-name-select option:selected').data('classData').projectType==3)
			url = "finance/settlement/getDetailedList"
		}
		$yt_baseElement.showLoading();
		$.ajax({
			url: $yt_option.base_path + url, //ajax访问路径  
			async: true,
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				projectCode: projectCode
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.company-tbody');
					var htmlTr = '';
					var listData = url == "finance/settlement/getDetailedList"?data.data.settlementGroupDetails:data.data;
					htmlTbody.empty();
					if(listData != null && listData.length > 0) {
						htmlTbody.parents('table').show();
						htmlTbody.parents('table').find('thead').show();
						htmlTbody.parents('table').attr('isOr',0);
						$.each(listData, function(i, v) {
							htmlTr = '<tr>' +
								'<td style="text-align: center;">' +
								'<label class="check-label yt-checkbox unit-checkbox"><input type="checkbox" name="test" class="groupId" value="' +
								v.groupId + '"/></label>' + '</td>' +
								'<td style="text-align:left">' + v.groupName + '</td>' +
								'<td style="text-align:right">' + v.amountReceivable + '</td>' +
								'<td style="text-align:right">' + v.netReceipts + '</td>' +
								'<td style="text-align:right">' + v.uncollected + '</td>' +
								'</tr>';
							htmlTbody.append(htmlTr);
						});
						$(".company-tbody").off('click').on("click",'tr', function() {
							if($(this).find("input[type='checkbox']")[0].checked == true) {
								$(this).find("input[type='checkbox']").setCheckBoxState("uncheck");
								$(this).removeClass("yt-table-active");
							} else {
								$(this).find("input[type='checkbox']").setCheckBoxState("check");
								$(this).addClass("yt-table-active");
							}
							if($(".company-tbody").find("input[type='checkbox']").length != $(".company-tbody").find("input[type='checkbox']:checked").length) {
								$(".company-tbody").parents('table').find(".check-all").setCheckBoxState("uncheck");
							} else {
								$(".company-tbody").parents('table').find(".check-all").setCheckBoxState("check");
							}
						});
						//点击全选
						$('.company-tbody').parents('table').find('thead tr label input').change(function(){
							var chState=$(this)[0].checked;
							console.log('集团chState',chState);
							$.each($('.company-tbody tr'), function() {
								if(chState){
									$(this).addClass('yt-table-active');
									$(this).find("input[type='checkbox']").setCheckBoxState("check");
								}else{
									$(this).removeClass('yt-table-active');
									$(this).find("input[type='checkbox']").setCheckBoxState("uncheck");
								}
								
							});
						});
					} else {
						htmlTbody.parents('table').attr('isOr',1);
						htmlTbody.html("");
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="5" align="center" style="border:0px;">' +
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

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	/**
	 * 弹窗个人信息列表
	 */
	getDetailedPersonalList: function(projectCode, keyword) {

		$(".person-page").pageInfo({
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			async: false,
			url: $yt_option.base_path + "finance/settlement/getDetailedPersonalList", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
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
			before: function() {
				$yt_baseElement.showLoading();
			},
			after:function(){
				$(".select-teacher-div .person-table tbody tr").off('click').on("click", function() {
					if($(this).find("input[type='checkbox']")[0].checked == true) {
						$(this).find("input[type='checkbox']").setCheckBoxState("uncheck");
						$(this).removeClass("yt-table-active");
					} else {
						$(this).find("input[type='checkbox']").setCheckBoxState("check");
						$(this).addClass("yt-table-active");
					}
					if($(".person-table tbody").find("input[type='checkbox']").length != $(".person-table tbody").find("input[type='checkbox']:checked").length) {
						$(".person-table").find(".check-all").setCheckBoxState("uncheck");
					} else {
						$(".person-table").find(".check-all").setCheckBoxState("check");
					}
				});
				//点击全选
				$('.person-tbody').parents('table').find('thead tr label input').change(function(){
					var chState=$(this)[0].checked;
					$.each($('.person-tbody tr'), function() {
						if(chState){
							$(this).addClass('yt-table-active');
							$(this).find("input[type='checkbox']").setCheckBoxState("check");
						}else{
							$(this).removeClass('yt-table-active');
							$(this).find("input[type='checkbox']").setCheckBoxState("uncheck");
						}
						
					});
				});
			},
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.person-tbody');
					var htmlTr = '';
					htmlTbody.empty();
					if(data.data.rows.length > 0) {
						htmlTbody.parents('table').show();
						htmlTbody.parents('table').find('thead').show();
						htmlTbody.show();
						$(".person-page").show();
						htmlTbody.parents('table').attr('isOr',0);
						$.each(data.data.rows, function(i, v) {
							if(v.gender==1){
								v.gender="男";
							}else{
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
					} else {
						$(".person-page").hide();
						htmlTbody.parents('table').attr('isOr',1);
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

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	//获取剩余未对帐金额
	getNotReconciliations: function(identifications,money) {
		$.ajax({
			url: $yt_option.base_path + "finance/projectStatement/getNotReconciliations", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				identifications: identifications
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称 
			before: function() {
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag == 0) {
					if(data.data!=null){
						console.log(data.data.notReconciliations)
						if(data.data.notReconciliations==undefined){
							data.data={notReconciliations:0}
						}
						$(".not-reconciliations").text(Number(data.data.notReconciliations)+Number(money));
					}else{
						$(".not-reconciliations").text(Number(money));
					}
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("获取剩余未对帐金额失败!");
					});
				}
			}
		})
	},
	//确认入账&取消入账
	accountEntryInfo: function(isAdmission,differencetotal,no) {
		var pkIds = [];
		$(".bank-table-left tbody input[type=checkbox]:checked").each(function(i, v) {
			$.each($(v).parents('.leftTable').find('tr'), function(a, b) {
					pkIds.push($(b).data('data').pkId);
			});
		});
		pkIds = pkIds.join(',');
		differencetotal!=undefined?pkIds=differencetotal:pkIds=pkIds;
		if(pkIds == "") {
			$yt_alert_Model.prompt("请选中对账单进行操作");
		} else {
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "finance/bankStatement/updateAdmission",
				data: {
					pkIds: pkIds,
					isAdmission: isAdmission
				},
				beforeSend:function(){
					$yt_baseElement.showLoading()
				},
				success: function(data) {
					if(data.flag == 0) {
						$yt_baseElement.hideLoading(function() {
							if(isAdmission == 1) {
								$yt_alert_Model.prompt("确认入账成功");
							} else {
								$yt_alert_Model.prompt("取消入账成功");
							}
						});
						if(no!=false){
							$('.page-info').pageInfo("refresh");
						}
					} else {
						$yt_baseElement.hideLoading(function() {
							if(isAdmission == 1) {
								$yt_alert_Model.prompt("确认入账失败");
							} else {
								$yt_alert_Model.prompt("取消入账失败");
							}
						});
					}
					$(".bank-list-table").find(".check-all").setCheckBoxState("uncheck");
				}
			});
		}

	},
	//标记有效&标记无效
	updateEffectiveInfo: function(isEffective) {
		var pkIds = [];
		var prompt ='';
		//标记有效
		if(isEffective==1){
			$('.invalid-tbody input[type=checkbox]:checked').each(function(i, v) {
					pkIds.push($(v).parents('tr').data('data').pkId);
			});
			pkIds=pkIds.join(',');
			if(pkIds == ""){
				$yt_alert_Model.prompt("请选中无效对账单进行操作");
			}
			prompt='确认设置该数据为有效吗?';
		}else if(isEffective==0){
			$(".bank-table-left tbody input[type=checkbox]:checked").each(function(i, v) {
			//获取选中状态行的数据
			pkIds.push($(v).parents('.leftTable').find('tr').data('data').pkId);
			//存储数据到外部数组
			});
			pkIds=pkIds.join(',');
			if(pkIds == ""){
				$yt_alert_Model.prompt("请选中有效对账单进行操作");
			}
			prompt='确认设置该数据为无效吗?';
		}
		
		if(pkIds == "") {
		} else {
		 $yt_alert_Model.alertOne({  
	        alertMsg: prompt, //提示信息  
	        confirmFunction: function() {
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "finance/bankStatement/updateEffective",
				data: {
					pkIds: pkIds,
					isEffective: isEffective
				},
				beforeSend:function(){
					$yt_baseElement.showLoading()
				},
				success: function(data) {
					if(data.flag == 0) {
						$yt_baseElement.hideLoading(function() {
							if(isEffective == 1) {
								$yt_alert_Model.prompt("标记有效成功");
							} else {
								$yt_alert_Model.prompt("标记无效成功");
							}
							$('.page-info').pageInfo("refresh");
							bankBillListInfo.getBankStatementDetails();
						});
					} else {
						$yt_baseElement.hideLoading(function() {
							if(isEffective == 1) {
								$yt_alert_Model.prompt("标记有效失败");
							} else {
								$yt_alert_Model.prompt("标记无效失败");
							}
						});
					}
					$(".bank-list-table").find(".check-all").setCheckBoxState("uncheck");
					$(".invalid-tbody").parents('table').find(".check-all").setCheckBoxState("uncheck");
				},
				error: function(data) {
					$yt_alert_Model.prompt('网络异常，标记失败，请稍后重试');
				}
			});
		}
       })
	 }
	},
	//公布认领
	updateAdmission: function(isPublish) {
		var pkIds = [];
		$(".bank-table-left tbody input[type=checkbox]:checked").each(function(i, v) {
			//获取选中状态行的数据
			$.each($(v).parents('.leftTable').find('tr'), function(a, b) {
					pkIds.push($(b).data('data').pkId);
			});
			//存储数据到外部数组
		});
		pkIds=pkIds.join(',');
		if(pkIds == "") {
			$yt_alert_Model.prompt("请选中对账单进行操作");
		} else {
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "finance/bankStatement/updatePublish",
				data: {
					pkIds: pkIds,
					isPublish: isPublish
				},
				success: function(data) {
					if(data.flag == 0) {
						$yt_baseElement.hideLoading(function() {
							$yt_alert_Model.prompt("公布成功");
						});
					} else {
						$yt_baseElement.hideLoading(function() {
							$yt_alert_Model.prompt("公布失败");
						});
					}
					$(".bank-list-table").find(".check-all").setCheckBoxState("uncheck");
				},
				error: function(data) {
					$yt_alert_Model.prompt('网络异常，公布失败，请稍后重试');
				}

			});
		}

	},
	//入账确认
	confirmFunc: function(confirm) {
		if(confirm == 1) {
			return "已入账";
		} else if(confirm == 0) {
			return "未入账";
		}
	},
}
$(function() {
	//初始化方法
	bankBillListInfo.init();
});