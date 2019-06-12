var costDetail = {
	//初始化方法
	init: function() {
		//初始化表格金额总数
		costDetail.paymentTotal();
		costDetail.socialTotal(); //社保合计

		costDetail.showOrHide();
		costDetail.showPayeeDeduct();
		//初始化金额
		/*var reimAmount = $(".reimAmount").text();
		if(reimAmount != '') {
			$(".reimAmount").text($yt_baseElement.fmMoney(reimAmount));
		} else {
			$(".reimAmount").text('0.00');
		};*/

		var reimAmountlSum = $("#reimAmountlSum").text();
		if(reimAmountlSum != '') {
			$("#reimAmountlSum").text($yt_baseElement.fmMoney(reimAmountlSum));
		} else {
			$("#reimAmountlSum").text('0.00');
		};

		/** 
		 * 金额文本框获取焦点事件 
		 */
		$("#reimAmount,#specialAmount,#deductBudgetAmount").on("focus", function() {
			if($(this).val() != "") {
				//调用还原格式化的方法  
				$(this).val($yt_baseElement.rmoney($(this).val()));
			}
		});
		/** 
		 * 金额文本框失去焦点事件 
		 */
		$("#reimAmount,#specialAmount,#deductBudgetAmount").on("blur", function() {
			if($(this).val() != "") {
				//调用格式化金额方法  
				$(this).val($yt_baseElement.fmMoney($(this).val()));
			}
		});
		costDetail.event();

	},

	//点击事件绑定
	event: function() {
		//为修改图片绑定事件
		$("#costList").on("click", ".operate-update", function() {
			var thisObj = $(this);
			var reimContent = thisObj.parents('tr').find('.reimContent').text();
			var reimAmount = thisObj.parents('tr').find('.reimAmount').text();
			var reimInstructions = thisObj.parents('tr').find('.reimInstructions').text();
			costDetail.showAlert(thisObj);
			$("#reimContent").val(reimContent);
			$("#reimAmount").val(reimAmount);
			$("#instructions").val(reimInstructions == '' ? '' : reimInstructions);
		});
		//为删除图片绑定事件
		$("#costList,#specialCostList").on("click", ".operate-del", function() {
			var thisObj = $(this);
			//带按钮,不带有图标的提示框 
			$yt_alert_Model.alertOne({
				/*haveAlertIcon:false,//是否带有提示图标 
				haveCloseIcon:false,//是否带有关闭图标 
				iconUrl:"",//提示图标路径 
				closeIconUrl:"",//关闭图标路径 
				leftBtnName:"确定",//左侧按钮名称,默认确定 
				rightBtnName:"取消",//右侧按钮名称,默认取消 
				cancelFunction:"",//取消按钮操作方法*/
				alertMsg: "数据删除将无法恢复,确认删除吗?", //提示信息  
				confirmFunction: function() { //点击确定按钮执行方法 
					thisObj.parents("tr").remove();
					costDetail.paymentTotal();
					costDetail.socialTotal();
				}
			});
		});
		//为社保修改图片绑定事件
		$("#specialCostList").on("click", ".operate-update", function() {
			//设置弹窗标题
			//costDetail.titleContext();
			var thisObj = $(this);
			var code = $('.docu-style:checked').val();
			if(code == 'SOCIAL_SECURITY_FEE') {
				costDetail.showSpecialExpenditureAlert(thisObj);
				costDetail.titleContext();
				var specialCode = thisObj.parents('tr').find('.specialContent').attr('code');
				var specialContent = thisObj.parents('tr').find('.specialContent').text();
				var specialAmount = thisObj.parents('tr').find('.specialAmount').text();
				var specialinstructions = thisObj.parents('tr').find('.specialinstructions').text().replace(/^\s+|\s+$/g, "");
				var deductBudgetAmount = thisObj.parents('tr').find('.deductBudgetAmount').text();
				$('.special-valid-tab .cost-name option[value ="' + specialCode + '"]').attr("selected", "selected");
				//赋值选中的用户姓名
				$('.special-valid-tab .cost-name').next().find(".current").text(specialContent);
				$("#specialAmount").val(specialAmount);
				$("#deductBudgetAmount").val(deductBudgetAmount);
				$("#specialinstructions").val(specialinstructions == '' ? '' : specialinstructions);
			} else if(code == 'MEDICAL_EXPENSES' || code == 'LABOUR_UNION_FUNDS' || code == 'PARTY_BUILDING_FUNDS' || code == 'CURRENT_ACCOUNT') {
				var specialContent = thisObj.parents('tr').find('.specialContent').text();
				var specialAmount = thisObj.parents('tr').find('.specialAmount').text();
				var specialinstructions = thisObj.parents('tr').find('.specialinstructions').text().replace(/^\s+|\s+$/g, "");
				costDetail.showSpecialExpenditureAlert(thisObj);
				$('.special-content-input .special-content').val(specialContent);
				$("#specialAmount").val(specialAmount);
				$("#specialinstructions").val(specialinstructions == '' ? '' : specialinstructions);
			} else if(code == 'ACCRUED_TAX' || code == 'SPECIAL_DEDUCTION') {
				costDetail.showSpecialExpenditureAlert(thisObj);
				costDetail.titleContext();
				var specialCode = thisObj.parents('tr').find('.specialContent').attr('code');
				var specialContent = thisObj.parents('tr').find('.specialContent').text();
				var specialAmount = thisObj.parents('tr').find('.specialAmount').text();
				var deductBudgetAmount = thisObj.parents('tr').find('.deductBudgetAmount').text();
				var specialinstructions = thisObj.parents('tr').find('.specialinstructions').text();
				$('.special-valid-tab .cost-name option[value ="' + specialCode + '"]').attr("selected", "selected");
				//赋值选中的用户姓名
				$('.special-valid-tab .cost-name').next().find(".current").text(specialContent);
				$("#specialAmount").val(specialAmount);
				$("#deductBudgetAmount").val(deductBudgetAmount);
				$("#specialinstructions").val(specialinstructions == '' ? '' : specialinstructions);
			}
		});
		//社保费用和扣除预算金额关系
		$("#specialAmount").on("blur", function() {
			var value = $yt_baseElement.rmoney($(this).val());
			if($(this).val() != "") {
				var code = $('.docu-style:checked').val();
				/*if(code == 'SPECIAL_DEDUCTION'){
					if($(".special-valid-tab .cost-name option:selected").val() == 'SPECIAL_DEDUCTION1'){
						//扣除预算金额
						$("#deductBudgetAmount").val($yt_baseElement.fmMoney(value/2));
					}else if($(".special-valid-tab .cost-name option:selected").val() == 'SPECIAL_DEDUCTION2'){
						//扣除预算金额
						$("#deductBudgetAmount").val($yt_baseElement.fmMoney(value*2/3));
					}else{
						//扣除预算金额
						$("#deductBudgetAmount").val($yt_baseElement.fmMoney(value));
					}
				}else */
				if(code == 'ACCRUED_TAX') {
					if($(".special-valid-tab .cost-name option:selected").val() == 'ACCRUED_TAX1' || $(".special-valid-tab .cost-name option:selected").val() == 'ACCRUED_TAX5') {
						$("#deductBudgetAmount").val($yt_baseElement.fmMoney(value));
					} else {
						$("#deductBudgetAmount").val($yt_baseElement.fmMoney(0));
					}
				} else if(code == 'SOCIAL_SECURITY_FEE') {
					if($(".special-valid-tab .cost-name option:selected").val() == 'SOCIAL_SECURITY_FEE2') {
						$("#deductBudgetAmount").val($yt_baseElement.fmMoney(0));
					} else {
						$("#deductBudgetAmount").val($yt_baseElement.fmMoney($yt_baseElement.rmoney($("#specialAmount").val()) / 2));
					}
				} else {
					if(code != 'SPECIAL_DEDUCTION') {
						//扣除预算金额
						$("#deductBudgetAmount").val($yt_baseElement.fmMoney(value));
					}
				}
			}
		})
	},
	//行修改方法
	//	operateUpdate:function(thisObj){
	//		var a=thisObj.parents('tr').find('td').eq(0).text();
	//		var b=thisObj.parents('tr').find('td').eq(1).text();
	//	},
	//扣除预算费和收款方是否显示
	showPayeeDeduct: function() {
		//根据单据样式code修改弹窗标题
		var code = $('#costTypeName').attr('val');
		if(code == 'SOCIAL_SECURITY_FEE' || code == 'LABOUR_UNION_FUNDS' || code == 'PARTY_BUILDING_FUNDS' || code == 'CURRENT_ACCOUNT') {
			$(".deductBudgetAmountTr").hide();
			$("#deductBudgetAmountSum").hide();
			$("#doAdvanceBox").hide();
			$("#deductBudgetDiv").hide();
		} else if(code == 'ACCRUED_TAX' || code == 'SPECIAL_DEDUCTION') {
			$(".deductBudgetAmountTr").show();
			$("#deductBudgetAmountSum").show();
			$("#doAdvanceBox").hide();
			$("#deductBudgetDiv").show();
		}
		if(code == 'SOCIAL_SECURITY_FEE' || code == 'SPECIAL_DEDUCTION') {
			$("#payeeInformation").hide();
			//$("#printExpendDetail").hide();
		} else if(code == 'MEDICAL_EXPENSES' || code == 'LABOUR_UNION_FUNDS' || code == 'PARTY_BUILDING_FUNDS' || code == 'ACCRUED_TAX') {
			$("#payeeInformation").show();
			//$("#printExpendDetail").show();
		}
		if(code == 'MEDICAL_EXPENSES') {
			$("#specialCostList .deductBudgetAmountTr,.cost-popm .deductBudgetAmountTr,#deductBudgetDiv").hide();
		}
		if(code == 'CURRENT_ACCOUNT') {
			$("#payeeInformation").show();
			//$("#printExpendDetail").hide();
		}
		//判断是公积金费用,显示扣除预算总金额区域和所属预算项目
		if(code == 'SOCIAL_SECURITY_FEE') {
			$(".deductBudgetAmountTr,#deductBudgetDiv").show();
		}
	},
	//带有顶部标题栏的弹出框	
	showAlert: function(thisObj) {
		if(thisObj != null) {
			$(".save-btn").show();
			$(".sure-btn").hide();
		} else {
			$(".save-btn").hide();
			$(".sure-btn").show();
		}
		costDetail.clearCPMInfo();
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
		//点击加入列表方法
		$(".sure-btn").off().on("click", function() {
			/*调用验证方法 */
			var isTrue = $yt_valid.validForm($(".valid-tab"));
			if(isTrue) {
				//				//隐藏页面中自定义的表单内容  
				//				$(".yt-edit-alert,#heard-nav-bak").hide();
				//				//隐藏蒙层  
				//				$("#pop-modle-alert").hide();
				$yt_alert_Model.prompt("填写的信息已成功加入到列表");

				//报销内容
				var reimContent = $("#reimContent").val();
				//报销金额
				var reimAmount = $("#reimAmount").val();
				//特殊说明
				var instructions = $("#instructions").val();
				instructions = instructions || '';
				//追加一行数据
				var trHtml = ' <tr class="yt-tab-row">' +
					' <td style="text-align:center;" class="reimContent">' + reimContent + '</td>' +
					' <td style="text-align:right;" class="reimAmount">' + reimAmount + '</td>' +
					' <td class="reimInstructions">' + instructions + '</td>' +
					' <td class="operation">' +
					' <span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					' <span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
					' </td>' +
					' </tr>';
				$("#costList tbody .last").before(trHtml);
				costDetail.paymentTotal();
				costDetail.clearCPMInfo();
			};
		});

		//点击保存方法
		$(".save-btn").off().on("click", function() {
			debugger
			/*调用验证方法 */
			var isTrue = $yt_valid.validForm($(".valid-tab"));
			if(isTrue) {
				//隐藏页面中自定义的表单内容  
				$(".yt-edit-alert,#heard-nav-bak").hide();
				//隐藏蒙层  
				$("#pop-modle-alert").hide();
				//报销内容
				var reimContent = $("#reimContent").val();
				//报销金额
				var reimAmount = $("#reimAmount").val();
				//特殊说明
				var instructions = $("#instructions").val();
				thisObj.parents('tr').find('td').eq(0).text(reimContent);
				thisObj.parents('tr').find('td').eq(1).text(reimAmount);
				thisObj.parents('tr').find('td').eq(2).text(instructions || '');
				costDetail.paymentTotal();
				costDetail.clearCPMInfo();
			}
		});
		/** 
		 * 点击取消方法 
		 */
		$('.yt-edit-alert .yt-eidt-model-bottom .yt-cancel-btn,.yt-edit-alert .closed-span').off().on("click", function() {
			costDetail.clearCPMInfo();
			//隐藏页面中自定义的表单内容  
			$(".yt-edit-alert,#heard-nav-bak").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();

		});
	},
	titleContext: function() {
		//根据单据样式code修改弹窗标题
		var code = $('.docu-style-box .check .docu-style').val();
		var flowCode = "";
		if(code == 'SOCIAL_SECURITY_FEE') {
			$(".yt-edit-alert-title-msg").text("公积金明细");
			flowCode = "SZ_SBJF_APP";
			//初始化select选项
			costDetail.getDictTypeByTypeCode(code);
		} else if(code == 'ACCRUED_TAX') {
			$(".yt-edit-alert-title-msg").text("薪酬税费明细");
			flowCode = "SZ_YJSF_APP";
			//初始化select选项
			costDetail.getDictTypeByTypeCode(code);
		} else if(code == 'MEDICAL_EXPENSES') {
			$(".yt-edit-alert-title-msg").text("医疗费明细");
			flowCode = "SZ_YYF_APP";
		} else if(code == 'LABOUR_UNION_FUNDS') {
			$(".yt-edit-alert-title-msg").text("工会明细");
			flowCode = "SZ_GHJF_APP";
		} else if(code == 'PARTY_BUILDING_FUNDS') {
			$(".yt-edit-alert-title-msg").text("党建明细");
			flowCode = "SZ_DJJF_APP";
		} else if(code == 'CURRENT_ACCOUNT') {
			$(".yt-edit-alert-title-msg").text("往来款项明细");
			flowCode = "SZ_WLKX_APP";
		} else if(code == 'SPECIAL_DEDUCTION') {
			$(".yt-edit-alert-title-msg").text("专项扣除明细");
			flowCode = "SPECIAL_DEDUCTION";
			//初始化select选项
			costDetail.getDictTypeByTypeCode(code);
		}
		//		sysCommon.getApproveFlowData(flowCode);
	},
	//扣除预算费是否显示
	showOrHide: function() {
		//根据单据样式code修改弹窗标题
		var code = $('.docu-style:checked').val();
		if(code == 'SOCIAL_SECURITY_FEE' || code == 'LABOUR_UNION_FUNDS' || code == 'PARTY_BUILDING_FUNDS' || code == 'CURRENT_ACCOUNT') {
			$(".deductBudgetAmountTr").hide();
			$("#deductBudgetAmountSum").hide();
		} else if(code == 'ACCRUED_TAX' || code == 'SPECIAL_DEDUCTION') {
			$(".deductBudgetAmountTr").show();
			$("#deductBudgetAmountSum").show();
		}
		if(code == 'MEDICAL_EXPENSES') {
			$("#specialCostList .deductBudgetAmountTr,.cost-popm .deductBudgetAmountTr").hide();
		}
		if(code == 'SOCIAL_SECURITY_FEE') {
			$(".deductBudgetAmountTr").show();
		}
	},
	//专项费用
	showSpecialExpenditureAlert: function(thisObj) {
		//设置弹窗标题
		costDetail.titleContext();

		if(thisObj != null) {
			$(".save-btn").show();
			$(".sure-btn").hide();
		} else {
			$(".save-btn").hide();
			$(".sure-btn").show();
		}
		costDetail.clearSpecialCPMInfo();
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$(".yt-edit-alert,#heard-nav-bak").show();

		/** 
		 * 调用算取div显示位置方法 
		 */
		$yt_alert_Model.getDivPosition($(".yt-edit-alert"));
		//设置弹框位置
		$(".yt-edit-alert").css({
			"position": "fixed",
			"left": "460px",
			"top": "164px"
		});

		var code = $('.docu-style:checked').val();
		if(code == 'MEDICAL_EXPENSES' || code == 'LABOUR_UNION_FUNDS' || code == 'PARTY_BUILDING_FUNDS' || code == 'CURRENT_ACCOUNT') {
			$(".special-content-select").hide();
			$(".special-content-input").show();
			$(".special-content-input .special-content").attr("validform", "{isNull:true,blurFlag:true,msg:'请输入收款人所在单位'}");
			$('#deductBudgetAmount').removeAttr("validform");
			if($("#reimAppName").val()) {
				$(".special-content-input .special-content").val($("#reimAppName").val());
			}
		} else if(code == 'SOCIAL_SECURITY_FEE' || code == 'ACCRUED_TAX' || code == 'SPECIAL_DEDUCTION') {
			$(".special-content-select").show();
			$(".special-content-input").hide();
			$(".special-content-input .special-content").removeAttr("validform");
			$('#deductBudgetAmount').attr("validform", "{isNull:true,blurFlag:true,msg:'请输入扣除预算金额'}");
		}
		/* 
		 * 调用支持拖拽的方法 
		 */
		//点击加入列表方法
		$(".sure-btn").off().on("click", function() {
			/*调用验证方法 */
			var isTrue = $yt_valid.validForm($(".special-valid-tab"));
			if(isTrue) {
				//				//隐藏页面中自定义的表单内容  
				//				$(".yt-edit-alert,#heard-nav-bak").hide();
				//				//隐藏蒙层  
				//				$("#pop-modle-alert").hide();
				$yt_alert_Model.prompt("填写的信息已成功加入到列表");

				//费用名称
				var specialContent = '';
				//费用的code
				var specialCode = '';
				var code = $('.docu-style:checked').val();
				if(code == 'MEDICAL_EXPENSES' || code == 'LABOUR_UNION_FUNDS' || code == 'PARTY_BUILDING_FUNDS' || code == 'CURRENT_ACCOUNT') {
					specialContent = $(".special-valid-tab .special-content").val();
				} else if(code == 'SOCIAL_SECURITY_FEE' || code == 'ACCRUED_TAX' || code == 'SPECIAL_DEDUCTION') {
					//费用名称
					specialContent = $(".special-valid-tab .cost-name option:selected").text();
					//费用的code
					specialCode = $(".special-valid-tab .cost-name option:selected").val();
				}
				//费用金额
				var specialAmount = $("#specialAmount").val();
				//扣除预算金额
				var deductBudgetAmount = $("#deductBudgetAmount").val();
				//特殊说明
				var specialinstructions = $("#specialinstructions").val();
				specialinstructions = specialinstructions || '';

				var trHtml = '';
				var code = $('.docu-style:checked').val();
				if(code == 'SOCIAL_SECURITY_FEE') {
					trHtml += '<tr class="yt-tab-row">' +
						' <td class="specialContent" code = "' + specialCode + '" >' + specialContent + '</td>' +
						' <td style="text-align: right;" class="specialAmount">' + $yt_baseElement.fmMoney(specialAmount) + '</td>' +
						' <td style="text-align: right;" class="deductBudgetAmount">' + $yt_baseElement.fmMoney(deductBudgetAmount || 0) + '</td>' +
						' <td class="specialinstructions">' + specialinstructions + '</td>' +
						' <td class="operation">' +
						' <span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
						' <span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
						' </td>' +
						' </tr>';
				} else if(code == 'MEDICAL_EXPENSES' || code == 'LABOUR_UNION_FUNDS' || code == 'PARTY_BUILDING_FUNDS' || code == 'CURRENT_ACCOUNT') {
					trHtml += '<tr class="yt-tab-row">' +
						' <td class="specialContent" >' + specialContent + '</td>' +
						' <td style="text-align: right;" class="specialAmount">' + $yt_baseElement.fmMoney(specialAmount) + '</td>' +
						' <td class="specialinstructions">' + specialinstructions + '</td>' +
						' <td class="operation">' +
						' <span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
						' <span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
						' </td>' +
						' </tr>';
				} else if(code == 'ACCRUED_TAX' || code == 'SPECIAL_DEDUCTION') {
					//追加一行数据  带扣除预算费用
					trHtml += ' <tr class="yt-tab-row">' +
						' <td class="specialContent" code = "' + specialCode + '" >' + specialContent + '</td>' +
						' <td style="text-align: right;" class="specialAmount">' + $yt_baseElement.fmMoney(specialAmount) + '</td>' +
						' <td style="text-align: right;" class="deductBudgetAmount">' + $yt_baseElement.fmMoney(deductBudgetAmount) + '</td>' +
						' <td class="specialinstructions">' + specialinstructions + '</td>' +
						' <td class="operation">' +
						' <span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
						' <span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
						' </td>' +
						' </tr>';
				}
				$("#specialCostList tbody .last").before(trHtml);
				costDetail.socialTotal();
				costDetail.clearSpecialCPMInfo();
			};
		});

		//点击保存方法
		$(".save-btn").off().on("click", function() {
			/*调用验证方法 */
			var isTrue = $yt_valid.validForm($(".special-valid-tab"));
			if(isTrue) {
				//隐藏页面中自定义的表单内容  
				$(".yt-edit-alert,#heard-nav-bak").hide();
				//隐藏蒙层  
				$("#pop-modle-alert").hide();
				//费用名称
				var specialContent = '';
				//费用的code
				var specialCode = '';
				var code = $('.docu-style:checked').val();
				if(code == 'MEDICAL_EXPENSES' || code == 'LABOUR_UNION_FUNDS' || code == 'PARTY_BUILDING_FUNDS' || code == 'CURRENT_ACCOUNT') {
					specialContent = $(".special-valid-tab .special-content").val();
				} else if(code == 'SOCIAL_SECURITY_FEE' || code == 'ACCRUED_TAX' || code == 'SPECIAL_DEDUCTION') {
					//费用名称
					specialContent = $(".special-valid-tab .cost-name option:selected").text();
					//费用的code
					specialCode = $(".special-valid-tab .cost-name option:selected").val();
				}
				var specialAmount = $("#specialAmount").val();
				//扣除预算金额
				var deductBudgetAmount = $("#deductBudgetAmount").val();
				//特殊说明
				var specialinstructions = $("#specialinstructions").val();
				//根据单据样式code修改表格
				var code = $('.docu-style:checked').val();
				if(code == 'SOCIAL_SECURITY_FEE') {
					thisObj.parents('tr').find('td').eq(0).text(specialContent);
					thisObj.parents('tr').find('td').eq(0).attr("code", specialCode);
					thisObj.parents('tr').find('td').eq(1).text(specialAmount);
					thisObj.parents('tr').find('td').eq(2).text(deductBudgetAmount || "0.00");
					thisObj.parents('tr').find('td').eq(3).text(specialinstructions || '');
				} else if(code == 'MEDICAL_EXPENSES' || code == 'LABOUR_UNION_FUNDS' || code == 'PARTY_BUILDING_FUNDS' || code == 'CURRENT_ACCOUNT') {
					thisObj.parents('tr').find('td').eq(0).text(specialContent);
					thisObj.parents('tr').find('td').eq(1).text(specialAmount);
					thisObj.parents('tr').find('td').eq(2).text(specialinstructions || '');
				} else if(code == 'ACCRUED_TAX' || code == 'SPECIAL_DEDUCTION') {
					thisObj.parents('tr').find('td').eq(0).text(specialContent);
					thisObj.parents('tr').find('td').eq(0).attr("code", specialCode);
					thisObj.parents('tr').find('td').eq(1).text(specialAmount);
					thisObj.parents('tr').find('td').eq(2).text(deductBudgetAmount);
					thisObj.parents('tr').find('td').eq(3).text(specialinstructions || '');
				}
				costDetail.socialTotal();
				costDetail.clearSpecialCPMInfo();
			}
		});
		/** 
		 * 点击取消方法 
		 */
		$('.yt-edit-alert .yt-eidt-model-bottom .yt-cancel-btn,.yt-edit-alert .closed-span').off().on("click", function() {
			costDetail.clearCPMInfo();
			//隐藏页面中自定义的表单内容  
			$(".yt-edit-alert,#heard-nav-bak").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();

		});
	},
	//清空弹窗方法
	clearCPMInfo: function() {
		$("#specialContent").val('').removeClass("valid-hint");
		$("#reimContent").val('').removeClass("valid-hint");
		$("#reimAmount").val('').removeClass("valid-hint");
		$(".cost-popm .valid-font").text('');
		$("#instructions").val('');
	},
	//清空弹窗方法
	clearSpecialCPMInfo: function() {
		$('.special-valid-tab .cost-name option[value = "1"]').attr("selected", "selected");
		//赋值选中的用户姓名
		$('.special-valid-tab .cost-name').next().find(".current").text("请选择");
		$(".special-content").val('');
		$("#specialAmount").val('');
		$("#deductBudgetAmount").val('');
		$("#specialinstructions").val('');
	},
	//	//计算总额方法
	//	smountCalculate:function(){
	//		var smount=$(".reimAmount");
	//		var sum=0;
	//		for (var i = 0; i < smount.length; i++){
	//			sum += parseInt($yt_baseElement.rmoney(smount.eq(i).text()));
	//		};
	//		$("#reimAmountlSum").text(sum);
	//		var reimAmountlSum = $("#reimAmountlSum").text();
	//		if(reimAmountlSum != '') {
	//			$("#reimAmountlSum").text($yt_baseElement.fmMoney(reimAmountlSum));
	//		} else {
	//			$("#reimAmountlSum").text('0.00');
	//		};
	//	},
	dataAttrList: function() {
		var list = [];
		var tr = null;
		var trs = $('#costList tbody tr:not(.last)');;
		$.each(trs, function(i, n) {
			//单个tr
			tr = $(n);
			list.push({
				normalId: tr.find('').text(),
				normalName: tr.find('.reimContent').text(),
				normalInstructions: tr.find('.reimInstructions').text(),
				normalAmount: $yt_baseElement.rmoney(tr.find(".reimAmount").text()),
			});
		});
		return list;
	},
	textbtn: function() {
		$(".text").off().on("click", function() {
			costDetail.dataAttrList();
		});
	},
	//选择不同的费用类型获取不同的费用内容
	getDictTypeByTypeCode: function(dictTypeCode) {
		$.ajax({
			type: "post",
			url: "basicconfig/dictInfo/getDictTypeByTypeCode",
			async: false,
			data: {
				dictTypeCode: dictTypeCode
			},
			success: function(data) {
				var list = data.data || [];
				var start = '<option value="1">请选择</option>';
				$.each(list, function(i, n) {
					start += '<option value="' + n.value + '">' + n.disvalue +
						'</option>';
				});
				$('select.cost-name').html(start).niceSelect()
			}
		})
	},
	//社保费合计
	socialTotal: function() {
		//获取所有的金额
		var tdsS = $('#specialCostList tbody .specialAmount,#specialDeduction tbody .specialAmount,#costSpending tbody .reimAmount'); //社保费总金额
		var tdsD = $('#specialCostList tbody .deductBudgetAmount,#specialDeduction tbody .deductBudgetAmount'); //社保费扣除预算金额
		var totalS = 0; //社保费合计
		var totalD = 0; //扣除预算金额合计
		//计算社保费合计金额
		$.each(tdsS, function(i, n) {
			totalS += $yt_baseElement.rmoney($(n).text());
		});
		//计算社保费合计金额
		$.each(tdsD, function(i, n) {
			totalD += $yt_baseElement.rmoney($(n).text());
		});
		var fmTotalS = $yt_baseElement.fmMoney(totalS);
		var fmTotalD = $yt_baseElement.fmMoney(totalD);
		//申请付款总额
		$('#applyTotalMoney,.count-val-num,#specialAmountSum').text(fmTotalS);
		$('#deductBudgetTotalMoney,#deductBudgetAmountSum').text(fmTotalD);
		//大写转换
		$('#TotalMoneyUpper,.total-money-up').text(arabiaToChinese(totalS + ''));
	},
	//付款明细合计
	paymentTotal: function() {
		//获取所有的金额
		var tds = $('#costList tbody .reimAmount');
		var total = 0;
		//计算合计金额
		$.each(tds, function(i, n) {
			total += $yt_baseElement.rmoney($(n).text());
		});
		var fmTotal = $yt_baseElement.fmMoney(total);
		//申请付款总额
		$('#applyTotalMoney,.count-val-num,#amountTotalMoney').text(fmTotal);
		//大写转换
		$('#TotalMoneyUpper,.total-money-up').text(arabiaToChinese(total + ''));
		//赋值合计金额
		$('#costList tbody #reimAmountlSum').text(fmTotal);
		//借款金额
		var loanAmount = $('#loanAmount').text();
		loanAmount = loanAmount == '--' ? 0 : $yt_baseElement.rmoney(loanAmount);
		//获取借款单可用余额
		var outstandingBalance = $yt_baseElement.rmoney($('#outstandingBalance').text());
		//冲销金额：只读信息，读取逻辑：如果报销金额小于借款单可用余额，则读取报销总额；如果报销金额大于等于借款单可用余额，则读取借款单可用余额
		var writeOffAmount = total >= outstandingBalance ? outstandingBalance : total;
		$('#writeOffAmount,#outWriteAmount').text($yt_baseElement.fmMoney(writeOffAmount));
		// 补领金额：计算项，计算逻辑：如果报销金额小于借款单可用余额，则为0.00；如果报销金额大于等于借款单可用余额，则报销金额-冲销金额的金额值
		var replaceMoney = total >= outstandingBalance ? total - writeOffAmount : '0';
		/*if(replaceMoney <= 0) {
			//补领金额是零的时候 ，补领方式 几个输入框禁用，默认值都是0.
			$('#officialCard,#cash,#cheque').val('0').attr('disabled', true);
			$('.amount-table .total').text('0');
		} else {
			$('#officialCard,#cash,#cheque').attr('disabled', false);
		}*/
		$('#replaceMoney').text($yt_baseElement.fmMoney(replaceMoney));
		//报销后借款单余额：计算项，计算逻辑：如果报销金额小于借款单可用余额，则借款单可用余额-报销金额；如果报销金额大于风雨借款单可用余额；则显示为0.00
		$('#balanceMoney').text($yt_baseElement.fmMoney(total < outstandingBalance ? outstandingBalance - total : '0'));

	},
}

$(function() {
	//调用初始化方法
	costDetail.init();
	costDetail.textbtn();
});