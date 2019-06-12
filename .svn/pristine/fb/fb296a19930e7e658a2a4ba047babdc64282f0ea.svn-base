var apply = {
	budgetPrjAppId: "", //预算立项申请Id
	selectList: [], //设置全局select变量
	formData: "", //表单数据全局变量
	arr: [], //中期、年终各项指标值
	processInstanceId: "", //流程实例Id
	midGoalId: "", //中期目标Id
	yearGoalId: "", //年度目标Id
	draCode: "", //草稿箱标识
	init: function() {
		//生成审批流程页面
		$("#approvalDiv").append(sysCommon.createFlowApproveMode());
		//获取页面跳转传输的参数对象
		var requerParameter = $yt_common.GetRequest();
		//获取传输的项目ID
		apply.budgetPrjAppId = requerParameter.budgetPrjAppId;
		//获取页面跳转标识  1：草稿  2.项目汇总 3.数据完善
		apply.draCode = requerParameter.draCode;
		if(apply.budgetPrjAppId) {
			if (apply.draCode == '1' || apply.draCode == '3') {
				//获取预算立项申请数据
				apply.applicationApply();
				if (apply.draCode == '3') {
          $('#approveSaveBtn').remove();
        }
			} else if (apply.draCode == '2') {
				//获取预算汇总的数据
				apply.getBudgetPrjSummaryAppInfo();
				//移除提交按钮 和 流程审批模块
				$('#approvalDiv,#approveSubBtn').remove();
				//显示保存并导出按钮
				$("#exportApproveSaveBtn").show();
			}
		} else {
			//获取当前登录用户信息
			sysCommon.getLoginUserInfo();
			//初始化绩效目标select列表
			apply.getSelectListData("#midPerformance");
			apply.getSelectListData("#yearPerformance");
		}
		//获取审批流程下拉菜单
		sysCommon.getApproveFlowData("BUDGET_PRJ_APP", apply.processInstanceId);
		//给当前页面设置最小高度
		$("#demandApply").css("min-height", $(window).height() - 32);

		//初始化下拉框
		$("select").niceSelect();
		//金额格式化事件绑定
		apply.moneyFormat();
		//初始化事件
		apply.events();
		//附件上传
		apply.uploadFile();
		//附件显示
		//		apply.showFileList();
		//验证绩效金额信息
		apply.validate();
	},
	//金额格式化
	moneyFormat: function() {
		/** 
		 * 金额文本框获取焦点事件 
		 */
		$(".top-money,.bottom-money").on("focus", function(e) {
			//调用还原格式化的方法  
			$(this).val($yt_baseElement.rmoney($(this).val()));
			$(this).select();
		});
		/** 
		 * 金额文本框失去焦点事件 
		 */
		$(".top-money,.bottom-money").on("blur", function() {
			if($(this).val() != "") {
				//调用格式化金额方法  
				$(this).val($yt_baseElement.fmMoney($(this).val()));
			}
		});
	},
	//事件
	events: function() {
		//附件删除事件
		$('.file-box').on('click', '.del-file', function() {
			var ithis = $(this);
			var parent = ithis.parent();
			$yt_alert_Model.alertOne({
				alertMsg: "数据删除将无法恢复,确认删除吗?",
				confirmFunction: function() {
					parent.remove();
				},
			});
		});
		//取消按钮事件
		$('#approveCanelBtn').on("click", function() {
			if(apply.draCode == '1') {
				//跳转路径
				var pageUrl = 'view/system-sasac/budget/module/projectApproval/budgetDraftsList.html'; //即将跳转的页面路径
				/**
				 * 调用显示loading方法
				 */
				parent.parent.$yt_baseElement.showLoading();
				window.location.href = $yt_option.websit_path + pageUrl;
			} else {
				//调用清空页面数据方法
				apply.clearPageData();
			}
		});
		
		//提交保存按钮点击事件
		var btnCount = 1;
		$("#approveSubBtn,#approveSaveBtn,#exportApproveSaveBtn").on("click", function() {
			var thisBtn = $(this);
			//禁用当前按钮
			if($(this).hasClass("sub-btn")){
				$("#approveSaveBtn").attr('disabled', true).addClass('btn-disabled');
			}
			var ajaxUrl = "";
			var validFlag = true;
			var fromUrl = '';
			
			//判断当前按钮是否包含提交类名
			if(thisBtn.hasClass("sub-btn")) {
				if (apply.draCode != '3') {
					$(".sub-btn").text("提交"+ (btnCount++) +"次");
				}
				ajaxUrl = "budget/prjApp/submitBudgetPrjAppInfo";
				//调用验证表单字段方法
				validFlag = $yt_valid.validForm($("#newProjectApply"));
				//验证中期目标金额
				var totalAmount = $yt_baseElement.rmoney($("#totalAmount").val()); //资金总额的值
				var financeAmount = $("#financeAmount").val(); //财政拨款的值
				var otherAmount = $("#otherAmount").val(); //其他资金的值
				if(totalAmount != ($yt_baseElement.rmoney(financeAmount) + $yt_baseElement.rmoney(otherAmount))) {
					$yt_alert_Model.prompt("中期资金总额应等于财政拨款和其他资金总和");
					//删除禁用
					$(thisBtn).attr('disabled', false).removeClass('btn-disabled');
					return false;
				}
				//验证年度目标金额
				var yearTotalAmount = $yt_baseElement.rmoney($("#yearTotalAmount").val()); //资金总额的值
				var yearFinanceAmount = $("#yearFinanceAmount").val(); //财政拨款的值
				var yearOtherAmount = $("#yearOtherAmount").val(); //其他资金的值
				if(yearTotalAmount != ($yt_baseElement.rmoney(yearFinanceAmount) + $yt_baseElement.rmoney(yearOtherAmount))) {
					$yt_alert_Model.prompt("年度资金总额应等于财政拨款和其他资金总和");
					//删除禁用
					$(thisBtn).attr('disabled', false).removeClass('btn-disabled');
					return false;
				}
				//跳转路径审批页面
				fromUrl = 'view/system-sasac/budget/module/projectApproval/budgetProjectList.html';
			};
			//判断是否是保存按钮
			if(thisBtn.hasClass("save-btn")) {
				//判断保存类型
				if (apply.draCode == '2' || apply.draCode == '3') {
					ajaxUrl = "budget/prjSummaryApp/saveBudgetPrjSummaryAppInfo";
				} else {
				  //草稿保存
          ajaxUrl = "budget/prjApp/saveBudgetPrjAppInfoToDrafts";
				}
			};
			//判断是否为导出并保存按钮
			if($(this).hasClass("save-export-btn")){
				ajaxUrl = "budget/prjSummaryApp/saveBudgetPrjSummaryAppInfo";
			}
			//判断是否验证成功
			if(validFlag) {
				//获取表单数据
				var formDatas = apply.getFormData();
				//调用提交接口
				$.ajax({
					type: "post",
					url: ajaxUrl,
					async: false,
					data: formDatas,
					success: function(data) {
						$yt_alert_Model.prompt(data.message);
						if(data.flag == 0) {
							var appId = '';
							appId = data.data;
							//判断如果是保存按钮
							if(thisBtn.hasClass("save-btn")) {
								var dataUrl = '';
								//判断保存类型
								if (apply.draCode == '2' || apply.draCode == '3') {
									dataUrl = "view/system-sasac/budget/module/projectApproval/budgetProjectList.html";
								} else {
								  //草稿保存
                  dataUrl = "view/system-sasac/budget/module/projectApproval/budgetDraftsList.html";
								}
								//操作什么跳转到草稿箱页面
								$yt_common.parentAction({
									url: $yt_option.parent_action_path, //父级中转地址,固定配置项,只有统一修改处理。  
									funName: 'locationToMenu', //指定方法名，定位到菜单方法  
									data: {
										url: dataUrl //要跳转的页面路径  
									}
								});
							}
							//判断返回值是否为空或者undefined null
							if(appId != '' && appId != undefined && appId != null) {
								//判断当前按钮是否包含提交类名
								if(thisBtn.hasClass("sub-btn")) {
									//审批流程接口
									$.ajax({
										type: "post",
										url: 'budget/prjApp/submitWorkFlow',
										async: false,
										data: {
											appId: appId, //表单申请id
											parameters: '', //JSON格式字符串, 
											dealingWithPeople: $("#approve-users").val(), //下一步操作人code
											opintion: $("#opintion").val(), //审批意见
											processInstanceId: apply.processInstanceId, //流程实例ID, 
											nextCode: $("#operate-flow").val(), //操作流程代码
										},
										success: function(data) {
											$yt_alert_Model.prompt(data.message);
											if(data.flag == 0) {
												if (apply.draCode == '3') {
													$yt_common.parentAction({
														url: $yt_option.parent_action_path, //父级中转地址,固定配置项,只有统一修改处理。  
														funName: 'locationToMenu', //指定方法名，定位到菜单方法  
														data: {
															url: fromUrl //要跳转的页面路径  
														}
													});
												}
											}
										}
									});
								}
								//判断当前按钮是否是保存并导出按钮
								if($(thisBtn).hasClass("save-export-btn")){
									var yitianSSODynamicKey  = $yt_baseElement.getToken();
									window.location.href = $yt_option.base_path + 'budget/prjApp/exportBudgetPrjInfoListToPageByParams?budgetPrjSummaryAppId=' +appId+"&yitianSSODynamicKey="+yitianSSODynamicKey+"&ajax=1";
								}

							}
						}
						//删除禁用
						$(thisBtn).attr('disabled', false).removeClass('btn-disabled');
					},
					error: function(e) {
						//删除禁用
						$(thisBtn).attr('disabled', false).removeClass('btn-disabled');
					}
				});
			} else {
				//调用滚动条显示在错误信息位置方法
				sysCommon.pageToScroll($("#newProjectApply .valid-font"));
				$(thisBtn).attr('disabled', false).removeClass('btn-disabled');
			}
			$(thisBtn).attr('disabled', false).removeClass('btn-disabled');
		});

		//修改图标事件
		/*$(".mid-apply-table,.all-apply-table").on("click", ".operate-edit", function() {
			var thisBtn = $(this);
			var thisTr = thisBtn.parents("tr");
			var thisTrHtml = thisTr.html();
			//取值
			var targetOneCode = thisTr.find(".target-td-one").find(".firstCode").text();
			var targetTwoCode = thisTr.find(".target-td-two").find(".secondCode").text();
			var targetThreeCode = thisTr.find(".target-td-three").find(".threeCode").text();
			//根据select的code值取三个select内的值
			var selectFirstData = apply.getSelectText("0"); //取一级select值
			var selectSecondData = apply.getSelectText(targetOneCode); //取二级select值
			//var selectThirdData = apply.getSelectText(targetTwoCode); //取三级select值

			var inputVal = thisTr.find(".target-td-four").text();
			var tdText = thisTr.find(".target-td-five").text();
			//生成列表页
			var selectHtml1 = '<div style="float: left;display:inline;width: 100%;">' +
				'<select  class="yt-select select-width target-item-one">' +
				'<option value="">请选择</option>';
			$.each(selectFirstData, function(index, data) {
				selectHtml1 += '<option value="' + data.prjTargetCode + '">' + data.prjTargetName + '</option>';
			});
			selectHtml1 += '</select>' + '</div>';

			var selectHtml2 = '<div style="float: left;display:inline;width: 100%;">' +
				'<select  class="yt-select select-width target-item-two">' +
				'<option value="">请选择</option>';
			$.each(selectSecondData, function(index, data) {
				selectHtml2 += '<option value="' + data.prjTargetCode + '">' + data.prjTargetName + '</option>';
			});
			selectHtml2 += '</select>' + '</div>';
			var selectHtml3 = '<input type="text" value="' + targetThreeCode + '" class="yt-input target-item-three" placeholder="请输入" style="width: 95%;padding-right: 4px;">';

			thisTr.find(".target-td-one").html(selectHtml1);
			thisTr.find(".target-td-two").html(selectHtml2);
			thisTr.find(".target-td-three").html(selectHtml3);
			thisTr.find(".target-td-four").html('<input type="text" class="yt-input input-val" value="' + inputVal + '" placeholder="请输入" style="text-align: right;width: 95%;padding-right: 4px;" />');
			thisTr.find(".target-td-five").html('<input type="text" class="yt-input target-item-five" placeholder="请输入" value=' + tdText + ' style="width: 95%;padding-right: 4px;" />');
			thisTr.find(".target-td-six").html('<span class="operate-save"><img src="../../../../../resources-sasac/images/common/save-icon.png"></span><span class="operate-canel" style="margin-left: 15px;"><img src="../../../../../resources-sasac/images/common/canel-icon.png"></span>');
			//初始化select标签
			$("tbody select").niceSelect();

			//给select标签选中值
			thisTr.find('select.target-item-one option[value="' + targetOneCode + '"]').attr("selected", true);
			thisTr.find('select.target-item-two option[value="' + targetTwoCode + '"]').attr("selected", true);
			//thisTr.find('select.target-item-three option[value="' + targetThreeCode + '"]').attr("selected", true);
			//初始化select标签
			$("tbody select").niceSelect();
			//添加连动效果
			apply.setSelectOption();
			//取消按钮绑定事件
			thisTr.find(".operate-canel").click(function() {
				thisTr.html(thisTrHtml);
			});

		});*/
		//删除按钮事件
		$(".mid-apply-table,.all-apply-table").on("click", ".operate-del", function() {
			var thisBtn = $(this);
			var thisTr = thisBtn.parents("tr");
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
					thisTr.remove();
				},
			});
		});
		//绩效保存按钮事件
		$(".mid-apply-table,.all-apply-table").on("click", ".operate-save", function() {
			var thisBtn = $(this);
			var thisTr = thisBtn.parents("tr");
			//取值
			var targetOneText = thisTr.find("select.target-item-one option:selected").text();
			var targetOneCode = thisTr.find("select.target-item-one option:selected").val();
			var targetTwoText = thisTr.find("select.target-item-two option:selected").text();
			var targetTwoCode = thisTr.find("select.target-item-two option:selected").val();
			//var targetThreeText = thisTr.find("select.target-item-three option:selected").text();
			var targetThreeCode = thisTr.find(".target-item-three").val();
			var inputVal = thisTr.find(".input-val").val();
			var tdText = thisTr.find(".target-item-five").val();
			if(!targetOneCode || !targetTwoCode || !targetThreeCode || !inputVal || !tdText) {
				$yt_alert_Model.prompt("请输入完整数据");
			} else {
				//赋值	
				var targetOneHtml = '<span class="firstCode" style="display:none;">' + targetOneCode + '</span>' + '<span>' + targetOneText + '</span>';
				var targetTwoHtml = '<span class="secondCode" style="display:none;">' + targetTwoCode + '</span>' + '<span>' + targetTwoText + '</span>';
				var targetThreeHtml = '<span class="threeCode" style="display:none;">' + targetThreeCode + '</span>' + '<span>' + targetThreeCode + '</span>';
				thisTr.find(".target-td-one").html(targetOneHtml);
				thisTr.find(".target-td-two").html(targetTwoHtml);
				thisTr.find(".target-td-three").html(targetThreeHtml);
				thisTr.find(".target-td-four").html(inputVal);
				thisTr.find(".target-td-five").html(tdText);
				thisTr.find(".target-td-six").html('<span class="operate-edit"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>');
			}
		});
		//绩效取消保存按钮事件
		$(".mid-apply-table,.all-apply-table").on("click", ".operate-canel", function() {
			var thisBtn = $(this);
			var thisTr = thisBtn.parents("tr");
			thisTr.remove();
		});
		//年中按钮添加行 
		$("#newMidTr").on("click", function() {
			apply.getSelectListData("#midPerformance");
		});
		//年度按钮添加行
		$("#newYearTr").on("click", function() {
			apply.getSelectListData("#yearPerformance");
		});
	},
	//绩效资金验证
	validate: function() {
		//判断中期资金总额和财政拨款、其他资金关系
		$("#midMoney").find("input.totalMoney,input.financeMoney,input.otherMoney").blur(function() {
			var totalAmount = $yt_baseElement.rmoney($("#totalAmount").val()); //资金总额的值
			var financeAmount = $("#financeAmount").val(); //财政拨款的值
			var otherAmount = $("#otherAmount").val(); //其他资金的值
			if($("#financeAmount").val() != '' || $("#otherAmount").val() != '') {
				financeAmount = (financeAmount == '' ? 0 : $yt_baseElement.rmoney(financeAmount));
				otherAmount = (otherAmount == '' ? 0 : $yt_baseElement.rmoney(otherAmount));
				//当财政拨款的值和其他资金的值都大于0时在做验证
				if(financeAmount == 0 && otherAmount == 0) {
					$yt_alert_Model.prompt("中期资金总额应等于财政拨款和其他资金总和");
					return false;
				} else if(financeAmount > 0 || otherAmount > 0) {
					//财政拨款+其他资金不等于资金总额时提示
					if(totalAmount != financeAmount + otherAmount) {
						$yt_alert_Model.prompt("中期资金总额应等于财政拨款和其他资金总和");
						return false;
					}
				}

			}
		});
		//判断年度资金总额和财政拨款、其他资金关系
		$("#yearMoney").find("input.totalMoney,input.financeMoney,input.otherMoney").blur(function() {
			var totalAmount = $yt_baseElement.rmoney($("#yearTotalAmount").val()); //资金总额的值
			var financeAmount = $("#yearFinanceAmount").val(); //财政拨款的值
			var otherAmount = $("#yearOtherAmount").val(); //其他资金的值
			if($("#yearFinanceAmount").val() != '' || $("#yearOtherAmount").val() != '') {
				financeAmount = (financeAmount == '' ? 0 : $yt_baseElement.rmoney(financeAmount));
				otherAmount = (otherAmount == '' ? 0 : $yt_baseElement.rmoney(otherAmount));
				//当财政拨款的值和其他资金的值都大于0时在做验证
				if(financeAmount == 0 && otherAmount == 0) {
					$yt_alert_Model.prompt("年度资金总额应等于财政拨款和其他资金总和");
					return false;
				} else if(financeAmount > 0 && otherAmount > 0) {
					if(totalAmount != financeAmount + otherAmount) { //财政拨款+其他资金不等于资金总额时提示
						$yt_alert_Model.prompt("年度资金总额应等于财政拨款和其他资金总和");
						return false;
					}
				}
			}
		});
	},
	//获取立项申请年中目标三级列表信息
	getSelectListData: function(id) {
		//获取第一个select的值
		var datas = apply.getSelectText("0");
		var str = '';
		str += '<tr>' +
			'<td class="target-td-one">' +
			'<div style="float: left;width: 100%;">' +
			'<select  class="yt-select select-width target-item-one">' +
			'<option value="">请选择</option>';
		//为select赋值
		$.each(datas, function(index, data) {
			str += '<option value="' + data.prjTargetCode + '">' + data.prjTargetName + '</option>';
		});
		str += '</select>' +
			'</div>' +
			'</td>' +
			'<td class="target-td-two">' +
			'<div style="float: left;width: 100%;">' +
			'<select  class="yt-select select-width target-item-two">' +
			'<option value="">请选择</option>' +
			'</select>' +
			'</div>' +
			'</td>' +
			'<td class="target-td-three">' +
			'<input type="text" class="yt-input target-item-three" placeholder="请输入" style="width: 95%;padding-right: 4px;">' +
			'</td>' +
			'<td class="target-td-four">' +
			'<input type="text" class="yt-input input-val" placeholder="请输入" style="text-align: right;width: 95%;padding-right: 4px;" />' +
			'</td>' +
			'<td class="target-td-five"><input type="text" class="yt-input target-item-five" placeholder="请输入" style="width: 95%;padding-right: 4px;" />' + '</td>' +
			'<td class="target-td-six">' +
			'<span class="operate-canel"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
			'</td>' +
			'</tr>';
		$(id).append(str); //年中绩效列表
		apply.setSelectOption();
		//初始化下拉框
		$("select").niceSelect();
	},
	//设置三级连动数据
	setSelectOption: function() {
		//第二个select列表值
		$("#midPerformance .target-item-one,#yearPerformance .target-item-one").on("change", function() {
			var thisSelect = $(this);
			var thisTr = thisSelect.parents("tr");
			thisTr.find("select.target-item-two").html('<option value="">请选择</option>'); //清空第二个select内值
			//thisTr.find("select.target-item-three").html('<option value="">请选择</option>'); //清空第三个select内值
			var prjTargetCode = $(this).children("option:selected").val();
			//获取二级select值
			var datas = apply.getSelectText(prjTargetCode);
			var optionStr = '';
			$.each(datas, function(index, data) {
				optionStr += '<option value="' + data.prjTargetCode + '">' + data.prjTargetName + '</option>';
			});

			thisTr.find("select.target-item-two").append(optionStr);
			//初始化下拉框
			$("select.target-item-two").niceSelect();
		});
		//第三个select列表值
		/*$("#midPerformance .target-item-two,#yearPerformance .target-item-two").on("change", function() {
			var thisSelect = $(this);
			var thisTr = thisSelect.parents("tr");
			thisTr.find("select.target-item-three").html('<option value="">请选择</option>'); //清空select内值
			var prjTargetCode = $(this).children("option:selected").val();
			//获取第三个select值
			var datas = apply.getSelectText(prjTargetCode);
			var optionStr = '';
			$.each(datas, function(index, data) {
				optionStr += '<option value="' + data.prjTargetCode + '">' + data.prjTargetName + '</option>';
			});
			thisTr.find("select.target-item-three").append(optionStr);
			//初始化下拉框
			$("select.target-item-three").niceSelect();
		});*/
		//第三个select列表变化时给单位赋值
		/*$("#midPerformance .target-item-three,#yearPerformance .target-item-three").on("change", function() {
			var thisSelect = $(this);
			var thisTr = thisSelect.parents("tr");
			var threeSelect = thisTr.find("select.target-item-three option:selected").val();
			var datas = apply.selectList; //获取第三select值
			for(var i = 0; i < datas.length; i++) {
				if(datas[i].prjTargetCode == threeSelect) {
					thisTr.find(".target-td-five").text(datas[i].units); //给绩效目标单位赋值
				}
			}
		});*/
	},
	//通过code传值获取三级连动select值
	getSelectText: function(code) {
		$.ajax({
			type: "post",
			url: "budget/prjApp/getPrjTargetListByParentCode",
			async: false,
			data: {
				parentCode: code
			},
			success: function(respond) {
				if(respond.flag == 0) {
					apply.selectList = respond.data; //给select列表赋值
				}
			}
		});
		return apply.selectList;
	},
	/**
	 * 
	 * 获取项目立项申请的数据保存接口
	 * 
	 */
	getFormData: function() {
		//中期目标信息
		var midGoalInfo = {
			goalId: apply.midGoalId || '', //中期目标Id
			totalAmount: $yt_baseElement.rmoney($("#totalAmount").val() || '0'), //资金总额(万元)
			financeAmount: $yt_baseElement.rmoney($("#financeAmount").val() || '0'), //财政拨款(万元)
			otherAmount: $yt_baseElement.rmoney($("#otherAmount").val() || '0'), //其他资金(万元)
			goalContent: Utils.encodeTextAreaString($("#goalContent").val()), //目标内容
			midKpiInfoList: apply.tableText("#midPerformance") //中期绩效指标集合
		}
		var midGoalInfoStr = JSON.stringify(midGoalInfo);
		//年度目标信息
		var yearGoalInfo = {
			goalId: apply.yearGoalId || '', //年度目标Id
			totalAmount: $yt_baseElement.rmoney($("#yearTotalAmount").val() || '0'), //资金总额(万元)
			financeAmount: $yt_baseElement.rmoney($("#yearFinanceAmount").val() || '0'), //财政拨款(万元)
			otherAmount: $yt_baseElement.rmoney($("#yearOtherAmount").val() || '0'), //其他资金(万元)
			goalContent: Utils.encodeTextAreaString($("#yearGoalContent").val()), //目标内容
			yearKpiInfoList: apply.tableText("#yearPerformance") //年度绩效指标集合
		}
		var yearGoalInfoStr = JSON.stringify(yearGoalInfo);
		//附件
		var attrIdStr = '';
		if($("#attIdStr .li-div").length > 0) {
			$("#attIdStr .li-div").each(function() {
				attrIdStr += $(this).attr("fid") + ",";
			});
		}
		return {
			processInstanceId: apply.processInstanceId, //流程实例Id
			budgetPrjAppId: apply.budgetPrjAppId, //预算立项申请Id
			prjName: $("#prjName").val(), //项目名称
			prjUnitName: $("#prjUnitName").val(), //项目单位名称
			compUnitName: $("#compUnitName").val(), //主管单位及代码名称
			implUnitName: $("#implUnitName").val(), //实施单位
			prjClassifyName: $("#prjClassifyName").val(), //项目类别名称
			prjAttrName: $("#prjAttrName").val(), //项目属性
			prjStartYear: $("#prjStartYear").val(), //项目开始年份
			prjCycle: $("#prjCycle").val(), //项目周期
			prjBasisContent: Utils.encodeTextAreaString($("#prjBasisContent").val()), //立项依据(主要内容)
			implPlanFeasContent: Utils.encodeTextAreaString($("#implPlanFeasContent").val()), //实施方案及可行性(主要内容)
			attrIdStr: attrIdStr, //附件Id字符串
			midGoalInfo: midGoalInfoStr, //中期目标信息
			yearGoalInfo: yearGoalInfoStr, //年度目标信息
		}
	},
	/**
	 * 清空页面数据
	 */
	clearPageData: function() {
		//清空输入框,文本域
		$("#newProjectApply input,#newProjectApply textarea").val('');
		//初始化下拉列表
		$("#newProjectApply select").each(function(i, n) {
			$(this).find("option:eq(0)").attr("selected", "selected");
		});
		$("#newProjectApply select").niceSelect();
	},
	//获取中期目标table的值
	tableText: function(id) {
		arr = []; //清空数组里的值
		var len = $(id).children().length; //获取tbody子元素数量
		var arrTemp = []; //中间变量储存td里的值
		var tr = {}; //中间变量，按tr行保存数据
		for(var i = 0; i < len; i++) {
		  var tr = $(id).children().eq(i);
      arr.push({
        oneTargetCode: tr.find('select.target-item-one option:selected').val(),
        twoTargetCode: tr.find('select.target-item-two option:selected').val(),
        threeTargetName: tr.find('.target-item-three').val(),
        prjTargetValue: tr.find('.input-val').val(),
        units: tr.find('.target-item-five').val()
      }); //添加到数组arr中
		}
		return arr; //将json格式的数组返回
	},
	/*
	 *
	 * 上传附件
	 * 
	 * */
	uploadFile: function() {
		//上传附件
		$(".file-up-div").off().on('change', '.cont-file', function(obj) {
			var fileElementId = this.id;
			var ithisParent = $('#attIdStr');
			var url = $yt_option.base_path + "/fileUpDownload/upload?ajax=1&modelCode=REIM_APP";
			var imgUlr = '';
			$.ajaxFileUpload({
				url: url,
				type: "post",
				dataType: 'json',
				fileElementId: fileElementId,
				success: function(data, textStatus) {
					if(data.flag == 0) {
						var attaElement = $('<div fId="' + data.data.pkId + '" class="li-div"><span>' + data.data.naming + '</span><span class="del-file">x</span></div>');
						ithisParent.append(attaElement);
					} else {
						$yt_alert_Model.prompt(data.message);
					}
					//图片预览
					$('#attIdStr .file-pv img').showImg();
				},
				error: function(data, status, e) {
					$yt_alert_Model.prompt(data.message);
				}
			});

		});
	},
	/**
	 * 附件集合显示
	 * @param {Object} list
	 */
	showFileList: function(list) {
		if(list.length > 0) {
			var ls = '';
			$.each(list, function(i, n) {
				ls += '<div fid="' + n.attId + '" class="li-div"><span>' + n.attName + '</span><span class="del-file">x</span></div>';
			});
			$('#attIdStr').html(ls);
		}
	},
	//获取预算立项申请信息 
	applicationApply: function() {
		if(apply.budgetPrjAppId != "" && apply.budgetPrjAppId != undefined && apply.budgetPrjAppId != null) {
			//获取预算立项申请信息 
			$.ajax({
				type: "post",
				url: 'budget/prjApp/getBudgetPrjAppInfoByAppId',
				async: false,
				data: {
					budgetPrjAppId: apply.budgetPrjAppId
				},
				success: function(respond) {
					var data = respond.data;
					if(respond.flag == 0) {
						apply.formData = respond.data;
						apply.processInstanceId = data.processInstanceId;
						apply.midGoalId = data.midGoalInfo.goalId;
						apply.yearGoalId = data.yearGoalInfo.goalId;
						//调用拼接附件方法
						apply.showFileList(data.attrList);
						$("#formNum").text(data.budgetPrjAppNum == "" ? "提交自动生成" : data.budgetPrjAppNum); //预算立项申请单号
						$("#applyDate").text(data.applicantTime == "" ? "--" : data.applicantTime); //申请时间
						$("#busiUsers").text(data.applicantUserName); //申请人姓名
						$("#deptName").text(data.applicantUserDeptName); //申请人-部门名称
						$("#jobName").text(data.applicantUserPositionName); //申请人-岗位名称
						$("#telPhone").text(data.applicantUserPhone); //申请人-手机号
						$("#prjName").val(data.prjName); //项目名称
						$("#prjUnitName").val(data.prjUnitName); //项目单位名称
						$("#compUnitName").val(data.compUnitName); //主管单位及代码名称
						$("#prjClassifyName").val(data.prjClassifyName); //项目类别名称
						$("#prjStartYear").val(data.prjStartYear); //项目开始年份
						$("#prjCycle").val(data.prjCycle); //项目周期
						$("#implUnitName").val(data.implUnitName); //实施单位
						$("#prjAttrName").val(data.prjAttrName); //项目属性
						$("#prjBasisContent").val(Utils.decodeTextAreaString(data.prjBasisContent)); //立项依据(主要内容)
						$("#implPlanFeasContent").val(Utils.decodeTextAreaString(data.implPlanFeasContent)); //实施方案及可行性(主要内容)
						$("#implUnitName").val(data.implUnitName); //实施单位
						if(data.midGoalInfo != '' && data.midGoalInfo != undefined && data.midGoalInfo != null) {
							$("#totalAmount").val($yt_baseElement.fmMoney(data.midGoalInfo.totalAmount)); //资金总额(万元)
							$("#financeAmount").val($yt_baseElement.fmMoney(data.midGoalInfo.financeAmount)); //财政拨款(万元)
							$("#otherAmount").val($yt_baseElement.fmMoney(data.midGoalInfo.otherAmount)); //其他资金(万元)
							$("#goalContent").val(Utils.decodeTextAreaString(data.midGoalInfo.goalContent)); //目标内容
							var targetHtml = '';
							if(data.midGoalInfo.midKpiInfoList && data.midGoalInfo.midKpiInfoList.length > 0) {
								$.each(data.midGoalInfo.midKpiInfoList, function(index, data) {
								  var datas = apply.getSelectText("0"); //一级select数据
								  var selectSecondData = apply.getSelectText(data.oneTargetCode); //取二级select值
									targetHtml += '<tr>' +
									  '<td class="target-td-one">' +
									  '<div style="float: left;width: 100%;">' +
									  '<select  class="yt-select select-width target-item-one">' +
									  '<option value="">请选择</option>';
									//为select赋值
									$.each(datas, function(index, n) {
									  targetHtml += '<option '+ (data.oneTargetCode == n.prjTargetCode ? 'selected' : '') +' value="' + n.prjTargetCode + '">' + n.prjTargetName + '</option>';
									});
									targetHtml += '</select>' +
									  '</div>' +
									  '</td>' +
									  '<td class="target-td-two">' +
									  '<div style="float: left;width: 100%;">' +
									  '<select  class="yt-select select-width target-item-two">' +
									  '<option value="">请选择</option>';
								  $.each(selectSecondData, function(index, n) {
                    targetHtml += '<option '+ (data.twoTargetCode == n.prjTargetCode ? 'selected' : '') +' value="' + n.prjTargetCode + '">' + n.prjTargetName + '</option>';
                  });
								  targetHtml += '</select>' +
									  '</div>' +
									  '</td>' +
									  '<td class="target-td-three">' +
									  '<input type="text" class="yt-input target-item-three" placeholder="请输入" style="width: 95%;padding-right: 4px;" value="'+data.threeTargetName+'">' +
									  '</td>' +
									  '<td class="target-td-four">' +
									  '<input type="text" class="yt-input input-val" placeholder="请输入" style="text-align: right;width: 95%;padding-right: 4px;"  value="'+data.prjTargetValue+'" />' +
									  '</td>' +
									  '<td class="target-td-five"><input type="text" class="yt-input target-item-five" placeholder="请输入" style="width: 95%;padding-right: 4px;"  value="'+data.units+'"/>' + '</td>' +
									  '<td class="target-td-six">' +
									  '<span class="operate-canel"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
									  '</td>' +
									  '</tr>';
								});
								$("#midPerformance").html(targetHtml);
							} else {
								apply.getSelectListData("#midPerformance");
							}
						};
						if(data.yearGoalInfo != '' && data.yearGoalInfo != undefined && data.yearGoalInfo != null) {
							$("#yearTotalAmount").val($yt_baseElement.fmMoney(data.yearGoalInfo.totalAmount)); //资金总额(万元)
							$("#yearFinanceAmount").val($yt_baseElement.fmMoney(data.yearGoalInfo.financeAmount)); //财政拨款(万元)
							$("#yearOtherAmount").val($yt_baseElement.fmMoney(data.yearGoalInfo.otherAmount)); //其他资金(万元)
							$("#yearGoalContent").val(Utils.decodeTextAreaString(data.yearGoalInfo.goalContent)); //目标内容
							var targetYearHtml = '';
							if(data.yearGoalInfo.yearKpiInfoList && data.yearGoalInfo.yearKpiInfoList.length > 0) {
								$.each(data.yearGoalInfo.yearKpiInfoList, function(index, data) {
								  var datas = apply.getSelectText("0"); //一级select数据
                  var selectSecondData = apply.getSelectText(data.oneTargetCode); //取二级select值
                  targetYearHtml += '<tr>' +
                    '<td class="target-td-one">' +
                    '<div style="float: left;width: 100%;">' +
                    '<select  class="yt-select select-width target-item-one">' +
                    '<option value="">请选择</option>';
                  //为select赋值
                  $.each(datas, function(index, n) {
                    targetYearHtml += '<option '+ (data.oneTargetCode == n.prjTargetCode ? 'selected' : '') +' value="' + n.prjTargetCode + '">' + n.prjTargetName + '</option>';
                  });
                  targetYearHtml += '</select>' +
                    '</div>' +
                    '</td>' +
                    '<td class="target-td-two">' +
                    '<div style="float: left;width: 100%;">' +
                    '<select  class="yt-select select-width target-item-two">' +
                    '<option value="">请选择</option>';
                  $.each(selectSecondData, function(index, n) {
                    targetYearHtml += '<option '+ (data.twoTargetCode == n.prjTargetCode ? 'selected' : '') +' value="' + n.prjTargetCode + '">' + n.prjTargetName + '</option>';
                  });
                  targetYearHtml += '</select>' +
                    '</div>' +
                    '</td>' +
                    '<td class="target-td-three">' +
                    '<input type="text" class="yt-input target-item-three" placeholder="请输入" style="width: 95%;padding-right: 4px;" value="'+data.threeTargetName+'">' +
                    '</td>' +
                    '<td class="target-td-four">' +
                    '<input type="text" class="yt-input input-val" placeholder="请输入" style="text-align: right;width: 95%;padding-right: 4px;"  value="'+data.prjTargetValue+'" />' +
                    '</td>' +
                    '<td class="target-td-five"><input type="text" class="yt-input target-item-five" placeholder="请输入" style="width: 95%;padding-right: 4px;"  value="'+data.units+'"/>' + '</td>' +
                    '<td class="target-td-six">' +
                    '<span class="operate-canel"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
                    '</td>' +
                    '</tr>';
                });
								$("#yearPerformance").html(targetYearHtml);
							} else {
								apply.getSelectListData("#yearPerformance");
							}
						}
					}
				}
			});
		}
	},
	//获取 项目汇总信息
	getBudgetPrjSummaryAppInfo: function() {
		//获取预算立项申请信息 
		$.ajax({
			type: "post",
			url: 'budget/prjSummaryApp/getBudgetPrjSummaryAppInfo',
			data: {
				ids: apply.budgetPrjAppId
			},
			success: function(respond) {
				var data = respond.data;
				if(respond.flag == 0) {
					apply.formData = respond.data;
					apply.processInstanceId = data.processInstanceId;
					//apply.midGoalId = data.midGoalInfo.goalId;
					//apply.yearGoalId = data.yearGoalInfo.goalId;
					$("#formNum").text(data.budgetPrjAppNum == "" ? "提交自动生成" : data.budgetPrjAppNum); //预算立项申请单号
					$("#applyDate").text(data.applicantTime == "" ? "--" : data.applicantTime); //申请时间
					$("#busiUsers").text(data.applicantUserName); //申请人姓名
					$("#deptName").text(data.applicantUserDeptName); //申请人-部门名称
					$("#jobName").text(data.applicantUserPositionName); //申请人-岗位名称
					$("#telPhone").text(data.applicantUserPhone); //申请人-手机号
					$("#prjName").val(data.prjName); //项目名称
					$("#prjUnitName").val(data.prjUnitName); //项目单位名称
					$("#compUnitName").val(data.compUnitName); //主管单位及代码名称
					$("#prjClassifyName").val(data.prjClassifyName); //项目类别名称
					$("#prjStartYear").val(data.prjStartYear); //项目开始年份
					$("#prjCycle").val(data.prjCycle); //项目周期
					$("#implUnitName").val(data.implUnitName); //实施单位
					$("#prjAttrName").val(data.prjAttrName); //项目属性
					$("#prjBasisContent").val(Utils.decodeTextAreaString(data.budgetPrjSummaryAppForm.prjBasisContent)); //立项依据(主要内容)
					$("#implPlanFeasContent").val(Utils.decodeTextAreaString(data.budgetPrjSummaryAppForm.implPlanFeasContent)); //实施方案及可行性(主要内容)
					$("#implUnitName").val(data.implUnitName); //实施单位
					var budgetPrjMainSum = data.budgetPrjMainSum;
					if(budgetPrjMainSum) {
						//调用拼接附件方法
						apply.showFileList(budgetPrjMainSum.attrListSum);
						//中期目标数据
						var midKpiInfoSum = budgetPrjMainSum.midKpiInfoSum;
						$("#totalAmount").val($yt_baseElement.fmMoney(midKpiInfoSum.totalAmount)); //资金总额(万元)
						$("#financeAmount").val($yt_baseElement.fmMoney(midKpiInfoSum.financeAmount)); //财政拨款(万元)
						$("#otherAmount").val($yt_baseElement.fmMoney(midKpiInfoSum.otherAmount)); //其他资金(万元)
						$("#goalContent").val(Utils.decodeTextAreaString(midKpiInfoSum.goalContent)); //目标内容
						var targetHtml = '';
						if(budgetPrjMainSum.midKpiInfoListSum && budgetPrjMainSum.midKpiInfoListSum.length > 0) {
							$.each(budgetPrjMainSum.midKpiInfoListSum, function(index, data) {
								targetHtml += '<tr>' +
									'<td class="target-td-one">' + '<span class="firstCode" style="display:none;">' + data.oneTargetCode + '</span>' + '<span>' + data.oneTargetName + '</span>' + '</td>' +
									'<td class="target-td-two">' + '<span class="secondCode" style="display:none;">' + data.twoTargetCode + '</span>' + '<span>' + data.twoTargetName + '</span>' + '</td>' +
									'<td class="target-td-three">' + '<span class="threeCode" style="display:none;">' + data.threeTargetCode + '</span>' + '<span>' + data.threeTargetName + '</span>' + '</td>' +
									'<td class="target-td-four">' + data.prjTargetValue + '</td>' +
									'<td class="target-td-five">' + data.units + '</td>' +
									'<td class="target-td-six">' + '<span class="operate-edit">' + '<img src="../../../../../resources-sasac/images/common/edit-icon.png">' + '</span>' + '<span class="operate-del">' + '<img src="../../../../../resources-sasac/images/common/del-icon.png">' + '</span>' + '</td>' +
									'</tr>';
							});
							$("#midPerformance").html(targetHtml);
						} else {
							apply.getSelectListData("#midPerformance");
						}
						//年度目标数据
						$("#yearTotalAmount").val($yt_baseElement.fmMoney(budgetPrjMainSum.yearKpiInfoSum.totalAmount)); //资金总额(万元)
						$("#yearFinanceAmount").val($yt_baseElement.fmMoney(budgetPrjMainSum.yearKpiInfoSum.financeAmount)); //财政拨款(万元)
						$("#yearOtherAmount").val($yt_baseElement.fmMoney(budgetPrjMainSum.yearKpiInfoSum.otherAmount)); //其他资金(万元)
						$("#yearGoalContent").val(Utils.decodeTextAreaString(budgetPrjMainSum.yearKpiInfoSum.goalContent)); //目标内容
						var targetYearHtml = '';
						if(budgetPrjMainSum.yearKpiInfoListSum && budgetPrjMainSum.yearKpiInfoListSum.length > 0) {
							$.each(budgetPrjMainSum.yearKpiInfoListSum, function(index, data) {
								targetYearHtml += '<tr>' +
									'<td class="target-td-one">' + '<span class="firstCode" style="display:none;">' + data.oneTargetCode + '</span>' + '<span>' + data.oneTargetName + '</span>' + '</td>' +
									'<td class="target-td-two">' + '<span class="secondCode" style="display:none;">' + data.twoTargetCode + '</span>' + '<span>' + data.twoTargetName + '</span>' + '</td>' +
									'<td class="target-td-three">' + '<span class="threeCode" style="display:none;">' + data.threeTargetCode + '</span>' + '<span>' + data.threeTargetName + '</span>' + '</td>' +
									'<td class="target-td-four">' + data.prjTargetValue + '</td>' +
									'<td class="target-td-five">' + data.units + '</td>' +
									'<td class="target-td-six">' + '<span class="operate-edit">' + '<img src="../../../../../resources-sasac/images/common/edit-icon.png">' + '</span>' + '<span class="operate-del">' + '<img src="../../../../../resources-sasac/images/common/del-icon.png">' + '</span>' + '</td>' +
									'</tr>';
							});
							$("#yearPerformance").html(targetYearHtml);
						} else {
							apply.getSelectListData("#yearPerformance");
						}
					};
				}
			}
		});
	}
}

var Utils = {};

/**
 * textArea换行符转  <br/>
 * @param {Object} str
 */
Utils.encodeTextAreaString = function(str) {
  var reg = new RegExp("\n", "g");
  str = str.replace(reg, "<br/>");
  return str;
}
/**
 * <br/> 转 textArea换行符
 * @param {Object} str
 */
Utils.decodeTextAreaString = function(str) {
  //判断前5位是否为换行符
  if (str && str.substr(0, 5) == '<br/>') {
    //是换行符则去掉第一个换行符
    str = str.substr(5, str.length);
  }
  var reg = new RegExp("<br/>", "g");
  str = str.replace(reg, "\n");
  return str;
}
$(function() {
	//调用初始化方法
	apply.init();
});