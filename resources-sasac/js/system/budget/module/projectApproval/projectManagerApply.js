var apply = {
	budgetPrjAppId: "", //预算立项申请Id
	processInstanceId: "", //流程实例Id
	midGoalId: "", //中期目标Id
	yearGoalId: "", //年度目标Id
	draCode: "", //草稿箱标识
	init: function() {
		//获取页面跳转传输的参数对象
		var requerParameter = $yt_common.GetRequest();
		//获取传输的项目ID
		apply.budgetPrjAppId = requerParameter.budgetPrjAppId;
		//获取草稿箱标识
		apply.draCode = requerParameter.draCode;
		if(apply.budgetPrjAppId != "" && apply.budgetPrjAppId != undefined && apply.budgetPrjAppId != null) {
			//获取预算立项申请数据
			apply.applicationApply();
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
		
		//初始化立项申请提交截止时间
		$("#submitDeadline").calendar({
			controlId: "startTime",
			speed: 0,
			nowData: false,
			callback: function() {}
		});
		//初始化事件
		apply.events();
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
			if(apply.draCode) {
				//跳转路径
				var pageUrl = 'view/system-sasac/budgetAdjust/module/projectApproval/budgetDraftsList.html'; //即将跳转的页面路径
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
		$("#approveSubBtn,#approveSaveBtn").on("click", function() {

			var thisBtn = $(this);
			//禁用当前按钮
			$(this).attr('disabled', true).addClass('btn-disabled');
			var ajaxUrl = "";
			var validFlag = true;
			var fromUrl = '';
			//判断当前按钮是否包含提交类名
			if(thisBtn.hasClass("sub-btn")) {
				ajaxUrl = "budget/prjFinancialApp/saveBudgetPrjFinancialAppInfo";
				//调用验证表单字段方法
				validFlag = $yt_valid.validForm($("#newProjectApply"));
				//跳转路径审批页面
				fromUrl = 'view/system-sasac/budget/module/projectApproval/budgetProjectList.html';
			};
			//判断是否是保存按钮
			if(thisBtn.hasClass("save-btn")) {
				ajaxUrl = "budget/prjFinancialApp/saveBudgetPrjFinancialAppInfo";
			};
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
							appId = data.data;
							//判断如果是保存按钮
							if(thisBtn.hasClass("save-btn")) {
								//操作什么跳转到草稿箱页面
								$yt_common.parentAction({
									url: $yt_option.parent_action_path, //父级中转地址,固定配置项,只有统一修改处理。  
									funName: 'locationToMenu', //指定方法名，定位到菜单方法  
									data: {
										url: 'view/system-sasac/budget/module/projectApproval/projectManagerList.html' //要跳转的页面路径  
									}
								});
							}
							//删除禁用
							$(thisBtn).attr('disabled', false).removeClass('btn-disabled');
						}
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
		});

		//修改图标事件
		$(".mid-apply-table,.all-apply-table").on("click", ".operate-edit", function() {
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
			var selectThirdData = apply.getSelectText(targetTwoCode); //取三级select值

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

			var selectHtml3 = '<div style="float: left;display:inline;width: 100%;">' +
				'<select  class="yt-select select-width target-item-three">' +
				'<option value="">请选择</option>';
			$.each(selectThirdData, function(index, data) {
				selectHtml3 += '<option value="' + data.prjTargetCode + '">' + data.prjTargetName + '</option>';
			});
			selectHtml3 += '</select>' + '</div>';

			thisTr.find(".target-td-one").html(selectHtml1);
			thisTr.find(".target-td-two").html(selectHtml2);
			thisTr.find(".target-td-three").html(selectHtml3);
			thisTr.find(".target-td-four").html('<input type="text" class="yt-input input-val" value="' + inputVal + '" placeholder="请输入" style="text-align: right;width: 95%;padding-right: 4px;" />');
			thisTr.find(".target-td-five").html(tdText);
			thisTr.find(".target-td-six").html('<span class="operate-save"><img src="../../../../../resources-sasac/images/common/save-icon.png"></span><span class="operate-canel" style="margin-left: 15px;"><img src="../../../../../resources-sasac/images/common/canel-icon.png"></span>');
			//初始化select标签
			$("tbody select").niceSelect();

			//给select标签选中值
			thisTr.find('select.target-item-one option[value="' + targetOneCode + '"]').attr("selected", true);
			thisTr.find('select.target-item-two option[value="' + targetTwoCode + '"]').attr("selected", true);
			thisTr.find('select.target-item-three option[value="' + targetThreeCode + '"]').attr("selected", true);
			//初始化select标签
			$("tbody select").niceSelect();
			//添加连动效果
			apply.setSelectOption();
			//取消按钮绑定事件
			thisTr.find(".operate-canel").click(function() {
				thisTr.html(thisTrHtml);
			});

		});
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
			var targetThreeText = thisTr.find("select.target-item-three option:selected").text();
			var targetThreeCode = thisTr.find("select.target-item-three option:selected").val();
			var inputVal = thisTr.find(".input-val").val();
			var tdText = thisTr.find(".target-td-five").text();
			if(targetOneText == "请选择" || targetTwoText == "请选择" || targetThreeText == "请选择" || inputVal == "") {
				$yt_alert_Model.prompt("请输入完整数据");
			} else {
				//赋值	
				var targetOneHtml = '<span class="firstCode" style="display:none;">' + targetOneCode + '</span>' + '<span>' + targetOneText + '</span>';
				var targetTwoHtml = '<span class="secondCode" style="display:none;">' + targetTwoCode + '</span>' + '<span>' + targetTwoText + '</span>';
				var targetThreeHtml = '<span class="threeCode" style="display:none;">' + targetThreeCode + '</span>' + '<span>' + targetThreeText + '</span>';
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
		$("#closeBtn").click(function() {
			 $yt_common.parentAction({  
				    url:$yt_option.parent_action_path,//父级中转地址,固定配置项,只有统一修改处理。  
				    funName:'locationToMenu',//指定方法名，定位到菜单方法  
				    data:{  
				        url:'view/system-sasac/budget/module/projectApproval/projectManagerList.html'//要跳转的页面路径  
				    }  
				});  
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
			'<div style="float: left;width: 100%;">' +
			'<select  class="yt-select select-width target-item-three">' +
			'<option value="">请选择</option>' +
			'</select>' +
			'</div>' +
			'</td>' +
			'<td class="target-td-four">' +
			'<input type="text" class="yt-input input-val" placeholder="请输入" style="text-align: right;width: 95%;padding-right: 4px;" />' +
			'</td>' +
			'<td class="target-td-five">' + '</td>' +
			'<td class="target-td-six">' +
			'<span class="operate-save"><img src="../../../../../resources-sasac/images/common/save-icon.png"></span>' +
			'<span class="operate-canel"><img src="../../../../../resources-sasac/images/common/canel-icon.png"></span>' +
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
			thisTr.find("select.target-item-three").html('<option value="">请选择</option>'); //清空第三个select内值
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
		$("#midPerformance .target-item-two,#yearPerformance .target-item-two").on("change", function() {
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

		});
		//第三个select列表变化时给单位赋值
		$("#midPerformance .target-item-three,#yearPerformance .target-item-three").on("change", function() {
			var thisSelect = $(this);
			var thisTr = thisSelect.parents("tr");
			var threeSelect = thisTr.find("select.target-item-three option:selected").val();
			var datas = apply.selectList; //获取第三select值
			for(var i = 0; i < datas.length; i++) {
				if(datas[i].prjTargetCode == threeSelect) {
					thisTr.find(".target-td-five").text(datas[i].units); //给绩效目标单位赋值
				}
			}
		});
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
			goalId: apply.midGoalId, //中期目标Id
			totalAmount: $yt_baseElement.rmoney($("#totalAmount").val() || '0'), //资金总额(万元)
			financeAmount: $yt_baseElement.rmoney($("#financeAmount").val() || '0'), //财政拨款(万元)
			otherAmount: $yt_baseElement.rmoney($("#otherAmount").val() || '0'), //其他资金(万元)
			goalContent: $("#goalContent").val(), //目标内容
			midKpiInfoList: apply.tableText("#midPerformance") //中期绩效指标集合
		}
		var midGoalInfoStr = JSON.stringify(midGoalInfo);
		//年度目标信息
		var yearGoalInfo = {
			goalId: apply.yearGoalId, //年度目标Id
			totalAmount: $yt_baseElement.rmoney($("#yearTotalAmount").val() || '0'), //资金总额(万元)
			financeAmount: $yt_baseElement.rmoney($("#yearFinanceAmount").val() || '0'), //财政拨款(万元)
			otherAmount: $yt_baseElement.rmoney($("#yearOtherAmount").val() || '0'), //其他资金(万元)
			goalContent: $("#yearGoalContent").val(), //目标内容
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
			//prjForShort: $("#prjForShort").val(), //项目名称
			prjUnitName: $("#prjUnitName").val(), //项目单位名称
			compUnitName: $("#compUnitName").val(), //主管单位及代码名称
			implUnitName: $("#implUnitName").val(), //实施单位
			prjClassifyName: $("#prjClassifyName").val(), //项目类别名称
			prjAttrName: $("#prjAttrName").val(), //项目属性
			prjStartYear: $("#prjStartYear").val(), //项目开始年份
			prjCycle: $("#prjCycle").val(), //项目周期
			prjBasisContent: $("#prjBasisContent").val(), //立项依据(主要内容)
			implPlanFeasContent: $("#implPlanFeasContent").val(), //实施方案及可行性(主要内容)
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
		var json = {}; //中间变量，按tr行保存数据
		for(var i = 0; i < len; i++) {
			for(var j = 0; j < 3; j++) {
				arrTemp.push($(id).children().eq(i).children().eq(j).children().eq(0).text()); //取td中值添加到arrTemp数组 中
			}
			arrTemp.push($(id).children().eq(i).children().eq(3).text());
			//判断绩效指标值是否是空
			if(arrTemp[0] == "" || arrTemp[1] == "" || arrTemp[2] == "" || arrTemp[3] == "") {
				arr = [];
			} else {
				json = {
					//给json赋值
					oneTargetCode: arrTemp[0],
					twoTargetCode: arrTemp[1],
					threeTargetCode: arrTemp[2],
					prjTargetValue: arrTemp[3]
				}
				arr.push(json); //添加到数组arr中
				arrTemp = []; //清空arrTemp
				json = {}; //清空json
			}
		}
		return arr; //将json格式的数组返回
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
						$("#prjBasisContent").val(data.prjBasisContent); //立项依据(主要内容)
						$("#implPlanFeasContent").val(data.implPlanFeasContent); //实施方案及可行性(主要内容)
						$("#implUnitName").val(data.implUnitName); //实施单位
						if(data.midGoalInfo != '' && data.midGoalInfo != undefined && data.midGoalInfo != null) {
							$("#totalAmount").val($yt_baseElement.fmMoney(data.midGoalInfo.totalAmount)); //资金总额(万元)
							$("#financeAmount").val($yt_baseElement.fmMoney(data.midGoalInfo.financeAmount)); //财政拨款(万元)
							$("#otherAmount").val($yt_baseElement.fmMoney(data.midGoalInfo.otherAmount)); //其他资金(万元)
							$("#goalContent").val(data.midGoalInfo.goalContent); //目标内容
							var targetHtml = '';
							if(data.midGoalInfo.midKpiInfoList && data.midGoalInfo.midKpiInfoList.length > 0) {
								$.each(data.midGoalInfo.midKpiInfoList, function(index, data) {
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
						};
						if(data.yearGoalInfo != '' && data.yearGoalInfo != undefined && data.yearGoalInfo != null) {
							$("#yearTotalAmount").val($yt_baseElement.fmMoney(data.yearGoalInfo.totalAmount)); //资金总额(万元)
							$("#yearFinanceAmount").val($yt_baseElement.fmMoney(data.yearGoalInfo.financeAmount)); //财政拨款(万元)
							$("#yearOtherAmount").val($yt_baseElement.fmMoney(data.yearGoalInfo.otherAmount)); //其他资金(万元)
							$("#yearGoalContent").val(data.yearGoalInfo.goalContent); //目标内容
							var targetYearHtml = '';
							if(data.yearGoalInfo.yearKpiInfoList != null && data.yearGoalInfo.yearKpiInfoList.length > 0) {
								$.each(data.yearGoalInfo.yearKpiInfoList, function(index, data) {
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
						}
					}
				}
			});
		}
	},
	/**
	 * 
	 * 获取部门信息
	 * 
	 */
	getDeptInfoListFun: function() {
		var allDeptInfoList = "";
		$.ajax({
			type: 'post',
			url: 'user/userInfo/getAllDeptsInfo',
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					//获取数据
					allDeptInfoList = data.data;
					$.each(data.data, function(i, n) {
						if(n.type == "2") {
							//							budgetReport.deptNum += 1;
						}
					});
				}
			}
		});
		return allDeptInfoList;
	}
}
$(function() {
	//调用初始化方法
	apply.init();
});