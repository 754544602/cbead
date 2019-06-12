var budgetAuditReduce = {
	saveData : {},
	advanceAppId : '',
	applicantUserCode:'',//申请人code
	inits: function() {
		budgetAuditReduce.advanceAppId = $yt_common.GetQueryString('advanceAppId');
		var costType = $yt_common.GetQueryString('costType');
		budgetAuditReduce.getExpenditureAppInfoByAppId(budgetAuditReduce.advanceAppId);
		budgetAuditReduce.getCostType(costType);
		//给当前页面设置最小高度
		$("#budgetAuditReduce").css("min-height", $(window).height() - 16);
		//初始化页面事件
		budgetAuditReduce.events();
		//调用计算手动预算核减总金额
		budgetAuditReduce.countBudgetMoney();
		//$(".budget-item-two,.budget-item-three").hide();
		//定位滚动条到当前预算核减明细表格区域
		var indexHeight  = $("#locationId").offset().top;
		$(window).scrollTop(indexHeight);
	},

	events: function() {
		//金额输入框事件  input-money
		$(".this-budget-table").on("keypress", ".input-money", function(even) {
			var event = event || window.event;
			var getValue = $(this).val();
			//控制第一个不能输入小数点"."  
			if(getValue.length == 0 && event.which == 46) {
				alert(1)
				event.preventDefault();
				return;
			}
			//控制只能输入一个小数点"."  
			if(getValue.indexOf('.') != -1 && event.which == 46) {
				event.preventDefault();
				return;
			}
			//控制只能输入的值  
			if(event.which && (event.which < 48 || event.which > 57) && event.which != 8 && event.which != 46) {
				event.preventDefault();
				return;
			}
		});
		//金额输入框失去焦点验证
		$('.this-budget-table').on('blur', '.budget-money', function(){
			//填写金额时对金额添加校验：填写金额不能大于申请支出总金额，失去焦点验证；如果校验失败，显示提示信息：“金额不能大于申请支出总金额”
			//申请支出总金额
			var total = $yt_baseElement.rmoney($('#totalAmount').text() || '0');
			//输入的金额
			var money = $yt_baseElement.rmoney($(this).val() || '0');
			if(money > total){
				$yt_alert_Model.prompt('金额不能大于申请支出总金额');
				$(this).focus();
			}
		});
		
		
		
		$(".this-budget-table").on("blur", ".input-money", function(event) {
			var value = $(this).val();
			var reg = '/^\d/g';
			$(this).val(value.replace(/[^\d.]/g, ""));
			$(this).val($(this).val() == '' ? '' : $yt_baseElement.fmMoney($(this).val()));
		});
		$(".this-budget-table").on("focus", ".input-money", function() {
			$(this).val($(this).val() == '' ? '' : $yt_baseElement.rmoney($(this).val()));
		});
		/*手动预算核减明细表相关事件*/
		//修改图标事件
		$(".this-budget-table").on("click", ".operate-update", function() {
			var thisBtn = $(this);
			var thisTr = thisBtn.parents("tr");
			var thisTrHtml = thisTr.html();

			/*取值*/
			//预算select
			//var budgetSelect=thisTr.find(".budget-info-td-one").text();
			//var budgetSelectTextArr = budgetSelect.split('-'); //specialName	所属预算项目名称
			var specialCode = thisTr.find(".special-code").val() == null ? ' , ' : thisTr.find(".special-code").val();
			var specialCodeArr = specialCode.split("-");

			//预算项目
			var budgetObject = thisTr.find(".budget-info-td-two").text();
			//预算金额
			var budgetMoney = thisTr.find(".budget-money-td span").text();
			/*赋值*/
			var selectHtml = '<select name="" class="yt-select budget-item-one">' +
				'<option value=""></option>' +
				'</select>' +
				'<select name="" class="yt-select budget-item-two">' +
				'<option value=""></option>' +
				'</select>' +
				'<select name="" class="yt-select budget-item-three">' +
				'<option value=""></option>' +
				'</select>' +
				'<input type="text" class="yt-input budget-object" value="' + budgetObject + '" placeholder="请输入项目名称" style="margin-left:10px;padding-left: 4px;width:130px;display: inline-block;"/>';
			var moneyHtml = '<input type="text" class="yt-input input-money budget-money" value="' + budgetMoney + '" placeholder="0.00" style="text-align: right;width: 95%;padding-right: 4px;" />';
			thisTr.find(".theif-budget-object").html(selectHtml);
			thisTr.find(".budget-money-td").html(moneyHtml);
			thisTr.find(".img-icon").html('<span class="operate-save"><img src="../../../../../resources-sasac/images/common/save-icon.png"></span><span class="operate-canel" style="margin-left: 15px;"><img src="../../../../../resources-sasac/images/common/canel-icon.png"></span>');
			//调用设置预算项目方法
			budgetAuditReduce.setBudgetItme(specialCodeArr, thisTr);
			thisTr.find(".budget-item-two,.budget-item-three").hide();
			//取消按钮绑定事件
			thisTr.find(".operate-canel").click(function() {
				thisTr.html(thisTrHtml);
				//调用计算手动预算核减总金额
				budgetAuditReduce.countBudgetMoney();
			});
			//调用计算手动预算核减总金额
			budgetAuditReduce.countBudgetMoney();
		});
		//删除按钮事件
		$(".this-budget-table").on("click", ".operate-del", function() {
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
					//调用计算手动预算核减总金额
					budgetAuditReduce.countBudgetMoney();
				},
			});
		});
		//保存按钮事件
		$(".this-budget-table").on("click", ".operate-save", function() {
			var thisBtn = $(this);
			var thisTr = thisBtn.parents("tr");
			var budgetObject = thisTr.find(".budget-object").val(); //预算项目
			var budgetMoney = thisTr.find(".budget-money").val(); //预算金额
			//申请支出总金额
			var total = $yt_baseElement.rmoney($('#totalAmount').text() || '0');
			//当前行填写的金额
			var money = $yt_baseElement.rmoney(thisTr.find('.budget-money').val() || '0');
			
			var isTrue = false;
			var codeId = thisTr.find('select.budget-item-one').find('option:selected').val();
			if(codeId) {
				if(codeId == "395") {
					if(budgetObject && budgetMoney) {
						isTrue = true;
						thisTr.find(".budget-money").removeClass("valid-hint");
						thisTr.find(".budget-object").removeClass("valid-hint");
					} else {
						if(!budgetMoney) {
							thisTr.find(".budget-money").addClass("valid-hint");
						} else {
							thisTr.find(".budget-money").removeClass("valid-hint");
						}
						if(!budgetObject) {
							thisTr.find(".budget-object").addClass("valid-hint");
						} else {
							thisTr.find(".budget-object").removeClass("valid-hint");
						}
					}
				} else {
					if(budgetMoney) {
						isTrue = true;
						thisTr.find(".budget-money").removeClass("valid-hint");
						thisTr.find(".budget-object").removeClass("valid-hint");
					} else {
						thisTr.find(".budget-money").addClass("valid-hint");
					}
				}
				thisTr.find('.budget-item-one').removeClass("valid-hint");
			} else {
				if(!budgetMoney) {
					thisTr.find(".budget-money").addClass("valid-hint");
				} else {
					thisTr.find(".budget-money").removeClass("valid-hint");
				}
				thisTr.find('.budget-item-one').addClass("valid-hint");
			}
			
			if(isTrue) {
				//验证部门预算与核减金额
				if(budgetAuditReduce.verifyBudgetExpendSum(thisTr)){
					if(money <= total){
						/*取值*/
						var budgetOneText = thisTr.find("select.budget-item-one option:selected").text();
						var budgetTwoText = thisTr.find("select.budget-item-two option:selected").text();
						var budgetThreeText = thisTr.find("select.budget-item-three option:selected").text();
						//预算项目val
						var specialCode = function() {
							var code = '';
							thisTr.find('select.budget-item-one,select.budget-item-two,select.budget-item-three').each(function(i, n) {
								var val = $(this).find('option:selected').val();
								if(val) {
									code += val + '-';
								}
							});
							code = (code.substring(code.length - 1) == '-') ? code.substring(0, code.length - 1) : code;
							return code;
						};
						
						var subText = (budgetOneText == '请选择' || '' ? '' : budgetOneText + '-' + (budgetTwoText == '' ? '' : budgetTwoText + '-' + (budgetThreeText == '' ? '' : budgetThreeText + '-')));
						if(codeId != '395') {
							subText = subText.substr(0, subText.length - 1);
						}
						/*赋值*/
						//var budgetText = (budgetOneText == '请选择' || '' ? '' : budgetOneText + '-' + (budgetTwoText == '' ? '' : budgetTwoText + '-' + (budgetThreeText == '' ? '' : budgetThreeText + '-'))) + budgetObject;
						var budgetText = '<input type="hidden" class="special-code" value="' + specialCode() + '"/><span class="budget-info-td-one">' + subText + ' </span> ' +
							'<span class="budget-info-td-two">' + budgetObject + '</span> ';
						thisTr.find(".theif-budget-object").html(budgetText);
						thisTr.find(".budget-money-td").html('<span>' + budgetMoney + '</span>');
						thisTr.find(".img-icon").html('<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>');
						//调用计算手动预算核减总金额
						budgetAuditReduce.countBudgetMoney();
					} else {
						$yt_alert_Model.prompt('金额不能大于申请支出总金额');
					}
				}
			} else {
				$yt_alert_Model.prompt("请输入完整数据");
			}
		});

		//添加行按钮事件	add-row
		$(".this-budget-table").on("click", ".add-row", function() {
			var thisBtn = $(this);
			var thisTr = thisBtn.parents("tr");
			var tr = $('<tr>' +
				'<td style="text-align: left;padding-left:15px">' +
				'<div style="float: left;" class="theif-budget-object">' +
				'<select name="" class="yt-select budget-item-one">' +
				'<option value=""></option>' +
				'</select>' +
				'<select name="" class="yt-select budget-item-two">' +
				'<option value=""></option>' +
				'</select>' +
				'<select name="" class="yt-select budget-item-three">' +
				'<option value=""></option>' +
				'</select>' +
				'<input type="text" class="yt-input budget-object" placeholder="请输入项目名称" style="margin-left:10px;padding-left: 4px;width:130px;display: inline-block;"/>' +
				'</div>' +
				'<div style="float: right;margin-right: 10px;">' +
				'<div style="padding-top: 5px;display: inline-block;">部门可用预算余额：<span class="text-money code-dept">--</span></div>' +
				'<div style="padding-top: 5px;display: inline-block;margin-left:20px;">单位可用预算余额：<span class="text-money code-mon">--</span></div>' +
				'</div>' +
				'</td>' +
				'<td class="budget-money-td" style="text-align: right;">' +
				'<input type="text" class="yt-input input-money budget-money" placeholder="0.00" style="text-align: right;width: 95%;padding-right: 4px;" />' +
				'</td>' +
				'<td class="img-icon">' +
				'<span class="operate-save"><img src="../../../../../resources-sasac/images/common/save-icon.png"></span>' +
				'<span class="operate-canel" style="margin-left: 15px;"><img src="../../../../../resources-sasac/images/common/canel-icon.png"></span>' +
				'</td>' +
				'</tr>');
			thisTr.before(tr);
			//调用所属预算项目数据绑定方法
			budgetAuditReduce.setBudgetItme([], tr);
			tr.find(".budget-item-two,.budget-item-three").hide();
			//取消按钮绑定事件
			tr.find(".operate-canel").click(function() {
				tr.remove();
			});
		});
		//关闭当前页面
		$("#closeBtn").click(function() {
			if(window.top == window.self){//不存在父页面
  				window.close();
			 }else{
			 	parent.closeWindow();
			}
		});
		//页面保存按钮事件
		$("#saveBtn").click(function() {
			var me = $(this);
			//			$yt_common.parentAction({
			//				url: $yt_option.parent_action_path, //父级中转地址,固定配置项,只有统一修改处理。
			//				funName: 'locationToMenu', //指定方法名，定位到菜单方法
			//				data: {
			//					url: 'view/system-sasac/expensesReim/module/approval/expenApplApprList.html' //要跳转的页面路径
			//				}
			//			});
			var list = [];
			var special = '';
			var lists;
			var advanceAppId = budgetAuditReduce.advanceAppId;
			//金额列合计
			var count = 0;
			$('.this-budget-table tbody tr:not(.last,.cut-total)').each(function(i) {// 遍历 tr
				var two = $(this).find('.budget-info-td-two').text();
				var	special = $(this).find('.budget-info-td-one').text();
				var amount = $yt_baseElement.rmoney($(this).find('.budget-money-td span').text() || '0');
				list.push({
					specialCode: $(this).find('.special-code').val(),
					specialName: special,
					amount : amount,
					prjName : two,
					prjCode : $(this).attr('prjCode')
				});
				count += amount;
				lists = JSON.stringify(list);
			});
			//申请支出总金额
			var total = $yt_baseElement.rmoney($('#totalAmount').text() || '0');
			//金额列合计必须等于申请支出总金额，保存时校验；如果校验结果失败，显示提示信息：“手动核减后金额必须等于申请支出总金额”，且校验失败时，不能保存
			if(count == total) {
				budgetAuditReduce.saveBudgetSubInfo(lists,advanceAppId);
			} else {
				$yt_alert_Model.prompt('手动核减后金额必须等于申请支出总金额');
			}
		});
	},
	verifyBudgetExpendSum: function(tr) {
		    
			//获取支出金额
			var expend = $yt_baseElement.rmoney(tr.find('.budget-money').val());
			//获取预算金额
			//var budget = $yt_baseElement.rmoney(tr.find('.code-mon').text().replace('万元', '')) * 1000;
			var budget = $yt_baseElement.rmoney(tr.find('.code-dept').text().replace('万元', '')) * 10000;
			//当部门可用预算余额小于支出事前申请金额或支出申请金额时，弹窗提示“部门可用预算余额小于当前申请的金额，请调整申请内容，或先保存页面信息，待部门预算调整后再重新提交申请。”
			if(budget < expend) {
				$yt_alert_Model.alertOne({
					haveCloseIcon: true, //是否带有关闭图标  
					leftBtnName: "确定", //左侧按钮名称,默认确定  
					cancelFunction: "", //取消按钮操作方法*/  
					alertMsg: "部门可用预算余额小于当前要核减的金额，请调整核减金额，或先调整部门预算再重新手动核减预算。", //提示信息  
					//alertMsg: "单位预算可用余额小于当前申请的金额，请调整申请内容，或先保存页面信息，待单位预算调整后再重新提交申请。", //提示信息  
					cancelFunction: function() {},
				});
				return false;
			}
			return true;
		},
	saveBudgetSubInfo: function(lists,advanceAppId) {
		$.ajax({
			type: "post",
			url: "sz/expenditureApp/saveBudgetSubInfo",
			async: true,
			data: {
				expenditureAppId : advanceAppId,
				budgetSubList : lists
			},
			success: function(data) {
				$yt_alert_Model.prompt(data.message);
				if(data.flag == 0) {
					//跳转列表页面
					/*$yt_common.parentAction({
						url: $yt_option.parent_action_path, //父级中转地址,固定配置项,只有统一修改处理。
						funName: 'locationToMenu', //指定方法名，定位到菜单方法
						data: {
							url: 'view/system-sasac/expensesReim/module/approval/expenApplApprList.html' //要跳转的页面路径
						}
					});*/
					setTimeout(function(){
						if(window.top == window.self){//不存在父页面
			  				window.close();
						 }else{
						 	parent.closeWindow();
						}
					},500);
				}
				//					thisBtn.attr('disabled', false).removeClass('btn-disabled');
			}
		});
	},
	fmMoney: function(str) {
		return $yt_baseElement.fmMoney(str || '0');
	},
	/**
	 * 重置表格序号
	 * @param {Object} obj
	 */
	resetNum: function(obj) {
		var trs = obj.find('tbody tr');
		$.each(trs, function(i, n) {
			$(n).find('.num').text(i + 1);
		});
	},
	/*计算手动预算核减总额*/
	countBudgetMoney: function() {
		//总金额 $(".budget-sum-money").text();
		var budgetMoneyArr = $(".this-budget-table .yt-tbody .budget-money-td span");
		var budgetSumMoney = 0;
		budgetMoneyArr.each(function(i, n) {
			budgetSumMoney += $yt_baseElement.rmoney($(n).text());
		})
		$(".this-budget-table .budget-sum-me-money").text($yt_baseElement.fmMoney(budgetSumMoney));
	},
	/**
	 * 设置所属预算项目
	 */
	setBudgetItme: function(arr, thisTr) {
		var me = this;
		//修改时重新绑定数据
		var codeArr = arr ? arr : [];
		//第一级下拉框
		var budgetOne = thisTr.find('.budget-item-one');
		//第二级下拉框
		var budgetTwo = thisTr.find('.budget-item-two');
		//第三级下拉框
		var budgetThree = thisTr.find('.budget-item-three');
		//获取选中的预算项目code
		var getBudgetCode = function() {
			thisTr.find('select.budget-item-one,select.budget-item-two,select.budget-item-three').each(function() {

			});
		};
		//先隐藏第二级第三级的下拉框
		thisTr.find('div.budget-item-two').hide();
		thisTr.find('div.budget-item-three').hide();
		//设置第一级数据
		me.getSpecialDictList(thisTr.find('select.budget-item-one'), '', function(list) {
			var code = thisTr.find('select.budget-item-one').find('option:selected').val();
			if(code) {
				if(code == "395") {
					thisTr.find(".budget-object").show();
				} else {
					thisTr.find(".budget-object").val("").hide();
				}

				//设置第二级数据
				me.getSpecialDictList(thisTr.find('select.budget-item-two'), code, function(list) {
					if(list.length > 0) {
						//第二级选中的code
						var twoCode = thisTr.find('select.budget-item-two').find('option:selected').val();
						//设置第三级数据
						me.getSpecialDictList(thisTr.find('select.budget-item-three'), twoCode, function(list) {
							if(list.length > 0) {
								//第三级存在获取第三级的余额
								var threeCode = thisTr.find('select.budget-item-three').find('option:selected').val();
								me.getBudgetBalanceAmount(threeCode, thisTr);
							} else {
								//先隐藏第三级的下拉框
								thisTr.find('div.budget-item-three').hide();
								//第三级不存在获取第二级的余额
								me.getBudgetBalanceAmount(twoCode, thisTr);
							}
						}, codeArr.length > 2 ? codeArr[2] : '');
					} else {
						//先隐藏第二级第三级的下拉框
						thisTr.find('div.budget-item-two').hide();
						thisTr.find('div.budget-item-three').hide();
					}
				}, codeArr.length > 1 ? codeArr[1] : '');
			} else {
				thisTr.find(".budget-object").val("").hide();
				thisTr.find('.code-mon').text('--');
				thisTr.find('div.budget-item-two').hide();
				thisTr.find('div.budget-item-three').hide();
			}
		}, codeArr.length > 0 ? codeArr[0] : '');
		//第一级更新获取第二级
		thisTr.find('select.budget-item-one').on('change', function() {
			//先隐藏第二级第三级的下拉框
			//$('div.budget-item-two').hide();
			//$('div.budget-item-three').hide();
			var code = $(this).find('option:selected').val();
			if(code) {
				if(code == "395") {
					thisTr.find(".budget-object").show();
				} else {
					thisTr.find(".budget-object").val("").hide();
				}
				//设置第二级数据
				me.getSpecialDictList(thisTr.find('select.budget-item-two'), code, function(list) {
					if(list.length > 0) {
						//第二级选中的code
						var twoCode = budgetTwo.find('option:selected').val();
						//设置第三级数据
						me.getSpecialDictList(thisTr.find('select.budget-item-three'), twoCode, function(list) {
							if(list.length > 0) {
								//第三级存在获取第三级的余额
								var threeCode = thisTr.find('select.budget-item-three').find('option:selected').val();
								me.getBudgetBalanceAmount(threeCode, thisTr);
							} else {
								//先隐藏第三级的下拉框
								thisTr.find('div.budget-item-three').hide();
								//第三级不存在获取第二级的余额
								me.getBudgetBalanceAmount(twoCode, thisTr);
							}
						});
					} else {
						//先隐藏第二级第三级的下拉框
						thisTr.find('div.budget-item-two').hide();
						thisTr.find('div.budget-item-three').hide();
					}
				});
			} else {
				thisTr.find(".budget-object").val("").hide();
				thisTr.find('.code-mon').text('--');
				thisTr.find('div.budget-item-two').hide();
				thisTr.find('div.budget-item-three').hide();
			}
			//选择为项目支出时显示项目名称
			if(code == '395') {
				$('.prj-name-tr').show();
			} else {
				$('.prj-name-tr').hide().val('');
			}
		});
		//第二级更新获取第三级
		thisTr.find('select.budget-item-two').on('change', function() {
			//先隐藏第三级的下拉框
			//$('div.budget-item-three').hide();
			var code = $(this).find('option:selected').val();
			//设置第三级数据
			me.getSpecialDictList(thisTr.find('select.budget-item-three'), code, function(list) {
				if(list.length > 0) {
					//第三级存在获取第三级的余额
					var threeCode = thisTr.find('select.budget-item-three').find('option:selected').val();
					me.getBudgetBalanceAmount(threeCode, thisTr);
				} else {
					//先隐藏第三级的下拉框
					thisTr.find('div.budget-item-three').hide();
					//第三级不存在获取第二级的余额
					me.getBudgetBalanceAmount(code, thisTr);
				}
			});
		});

		//第三级更新获取余额
		thisTr.find('select.budget-item-three').on('change', function() {
			//第三级存在获取第三级的余额
			var threeCode = thisTr.find('select.budget-item-three').find('option:selected').val();
			me.getBudgetBalanceAmount(threeCode, thisTr);
		});

	},
	/**
	 * select下拉获取数据(根据父级code获取子级数据)
	 * @param {Object} parentCode
	 */
	getSpecialDictList: function(obj, parentCode, fun, code) {
		obj.find('option').remove();
		$.ajax({
			type: "post",
			url: "budget/main/getSpecialDictList",
			async: true,
			data: {
				parentCode: parentCode
			},
			success: function(data) {
				var list = data.data || [];
				var opts = '';
				if(obj.hasClass('budget-item-one')) {
					opts += '<option value="">请选择</option>';
				}
				if(data.flag == 0 && list.length > 0) {
					$.each(list, function(i, n) {
						if(code && code == n.specialCode) {
							opts += '<option selected="selected" value="' + n.specialCode + '">' + n.specialName + '</option>';
						} else {
							opts += '<option value="' + n.specialCode + '">' + n.specialName + '</option>';
						}
					});
					//添加并初始化
					obj.html(opts).niceSelect();
				} else {
					//隐藏
				}
				if(fun) {
					//在选中第一级后，需要同时处理第二第三级的情况下，执行事件
					fun(list);
				}
			}
		});
	},
	/**
	 * 1.3.3.4	所属预算项目：获取预算剩余额度
	 * @param {Object} specialCodeSeq
	 */
	getBudgetBalanceAmount: function(specialCodeSeq, thisTr) {
		var applicantUser=budgetAuditReduce.applicantUserCode;
		$.ajax({
			type: "post",
			url: "budget/main/getBudgetOtherBalanceAmount",
			async: true,
			data: {
				specialCodeSeq: specialCodeSeq,
				applicantUser:applicantUser
			},
			success: function(data) {
				if(data.flag == 0) {
					//部门预算额度
					var deptBudgetBalanceAmount = data.data.deptBudgetBalanceAmount;
					thisTr.find('.code-dept').text(deptBudgetBalanceAmount ? $yt_baseElement.fmMoney(deptBudgetBalanceAmount) + '万元' : '--');
					//单位预算额度
					var budgetBalanceAmount = data.data.budgetBalanceAmount;
					thisTr.find('.code-mon').text(budgetBalanceAmount ? $yt_baseElement.fmMoney(budgetBalanceAmount) + '万元' : '--');
				}
				
			}
		});
	},
	/**
	 * 支出申请信息：获取支出申请详细信息
	 * @param {Object} specialCodeSeq
	 */
	getExpenditureAppInfoByAppId: function(advanceAppId) {
		var me = $(this);
		$.ajax({
			type: "post",
			url: "sz/expenditureApp/getExpenditureAppInfoByAppId",
			async: true,
			data: {
				expenditureAppId: advanceAppId
			},
			success: function(data) {
				var data = data.data;
				budgetAuditReduce.saveData = data;
				budgetAuditReduce.applicant(data);
			}
		});
	},
	/*
	 * 基本信息 子页面 赋值
	 */
	applicant: function(data) {
		var me = this;
		budgetAuditReduce.applicantUserCode=data.applicantUser;
		$("#applicantUser").text(data.applicantUserName);
		$("#applicantUserDeptName").text(data.applicantUserDeptName);
		$("#expenditureAppName").text(data.expenditureAppName);
		$("#totalAmount").text($yt_baseElement.fmMoney(data.totalAmount));
		$("#nodeNowState").text(data.nodeNowState);
		$("#formNum").text(data.expenditureAppNum);
		$("#fuData").text(data.applicantTime);
		me.showCostDetail(data.costData);
		me.showCurrentBudgetSubList(data.currentBudgetSubList);
		me.showCurrentBudgetSub(data.currentBudgetSubList);
	},
	/**
	 * 当前预算核减明细
	 * @param {Object} data
	 */
	showCurrentBudgetSubList: function(data) {
		var total = 0;
		var SubHtml = '';
		$.each(data, function(i, n) {
			SubHtml += '<tr class="" specialCode="' + n.specialCode + '" specialName="' + n.specialName + '" prjCode="' + n.prjCode + '" prjName="' + n.prjName + '" amount="' + n.amount + '" createTime="' + n.createTime + '">' +
				'<td><span class="specialName">' + n.specialName + '</span><span class="specialName">' + (n.prjName ? '-' + n.prjName : '') + '</span></td>' +
				'<td style="text-align: right;"><span class="amount">' + $yt_baseElement.fmMoney(n.amount) + '</span></td>' +
				'</tr>';
				if (n.createTime) {
					$(".last-modified-date").text(n.createTime);
				}
			total += n.amount;
		});
		//		//时间
		//		$('.last-modified-date').text(n.createTime);
		//计算合计
		$(".budget-sum-money").text($yt_baseElement.fmMoney(total))
		//替换代码
		$('.cut-after-examination tbody .last').before(SubHtml);
	},
	showCurrentBudgetSub: function(data) {
		var total = 0;
		var SubHtml = '';
		$.each(data, function(i, n) {
			SubHtml += '<tr prjCode = '+ n.prjCode +' prjName = '+ n.prjName +'><td style="text-align: left;padding-left:15px"><div style="float: left;" class="theif-budget-object"><input type="hidden" class="special-code" value="'+ n.specialCode +'"><span class="budget-info-td-one">'+ n.specialName +'</span>'+(n.prjName ? '-' : '')+'<span class="budget-info-td-two">'+ n.prjName +'</span> </div><div style="float: right;margin-right: 10px;"><div style="padding-top: 5px;display: inline-block;">部门可用预算余额：<span class="text-money code-dept">'+ (n.deptBudgetBalanceAmount ? $yt_baseElement.fmMoney(n.deptBudgetBalanceAmount) + '万元' : '--') +'</span></div><div style="padding-top: 5px;display: inline-block;margin-left: 20px;">单位可用预算余额：<span class="text-money code-mon">'+ (n.budgetBalanceAmount ? $yt_baseElement.fmMoney(n.budgetBalanceAmount) + '万元' : '--') +'</span></div></div></td><td class="budget-money-td" style="text-align: right;"><span>'+  $yt_baseElement.fmMoney(n.amount) +'</span></td><td class="img-icon"><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td></tr>';

			total += n.amount;
		});
		//计算合计
		$(".budget-sum-me-money").text($yt_baseElement.fmMoney(total));
		//替换代码
		$('.this-budget-table tbody .last').before(SubHtml);
	},
	showCostDetail: function(data) {
		var me = this;
		//接待对象信息集合
		var costReceptionistList = data.costReceptionistList;
		//费用明细信息集合
		var costDetailsList = data.costDetailsList;

		//接待对象信息集合HTML文本
		var receHtml = '';
		$.each(costReceptionistList, function(i, n) {
			receHtml += '<tr pkId="' + n.costReceptionistId + '" class="" nameVal="' + n.name + '" dutyVal="' + n.jobName + '" deptVal="' + n.unitName + '">' +
				'<td><span class="num">1</span></td>' +
				'<td><span class="name-text">' + n.name + '</span></td>' +
				'<td><span class="job-text">' + n.jobName + '</span></td>' +
				'<td><span class="unit-text">' + n.unitName + '</span></td>' +
				'</tr>';
		});
		//替换代码
		$('.msg-list tbody').append(receHtml);
		//定位滚动条到当前预算核减明细表格区域
		var indexHeight  = $("#locationId").offset().top;
		$(window).scrollTop(indexHeight);
		//重置序号
		me.resetNum($('.msg-list'));
		
		//行程明细
		var tripPlanList = data.travelRouteList;
		var tripHtml = '';
		var travelPersonnelsList = [];
		//获取出差人名称
		var getUserNames = function(list) {
			var str = '';
			$.each(list, function(i, n) {
				str += n.travelPersonnelName + (i < list.length - 1 ? '、' : '');
			});
			return str;
		};
		//获取借贷方类型
		var costItem = function(str) {
			switch(str) {
				case '1':
					return '住宿费';
					break;
				case '2':
					return '伙食费';
					break;
				case '3':
					return '市内交通费';
					break;
				default:
					return '';
					break;
			}
		};
		var getCostItemName = function(str) {
			var txt = '';
			if(str) {
				var list = str.split('-');
				$.each(list, function(i, n) {
					if(n) {
						txt += costItem(n) + (i < list.length - 1 ? '、' : '');
					}
				});
				return txt;
			}
			return '';
		};

		$.each(tripPlanList, function(i, n) {
			//1. 把开始时间和结束时间保存
			var dateFrom = new Date(n.startTime);
			var dateTo = new Date(n.endTime);
			//2. 计算时间差
			var diff = dateTo.valueOf() - dateFrom.valueOf();
			//3. 时间差转换为天数
			var diff_day = parseInt(diff / (1000 * 60 * 60 * 24));

			tripHtml += '<tr busicode="' + n.travelType + '" usercode="' + n.travelPersonnels + '" rececode="' + n.receptionCostItem + '" >' +
				'<td><input type="hidden" class="hid-user-code" value="' + n.travelPersonnels + '" /> <span class="name">' + n.travelTypeName + '</span></td>' +
				'<td class="sdate">' + n.startTime + '</td>' +
				'<td class="edate">' + n.endTime + '</td>' +
				'<td class="day">' + diff_day + '</td>' +
				'<td class="address" val="' + n.travelAddress + '">' + n.travelAddressName + '</td>' +
				'<td class="uname">' + getUserNames(n.travelPersonnelsList) + '</td>' +
				'<td class="numof">' + n.travelPersonnelsList.length + '</td>' +
				'<td class="reception">' + getCostItemName(n.receptionCostItem) + '</td>' +
				'</tr>';
		});
		$('#tripList tbody').html(tripHtml);

		if(data.costCarfareList.length == 0 && data.costHotelList.length == 0 && data.costOtherList.length == 0 && data.costSubsidyList.length == 0) {
			$(".cost-list-model").html('<table style="width:100%"><tr style="border:0px;background-color:#fff !important;"><td align="center"style="border:0px;"><div class="no-data" style="width: 280px;padding:0;margin: 0 auto;">' +
				'<img src="../../../../../resources-sasac/images/common/no-data.png" alt="" style="padding:10px 0;">' +
				'</div></td></tr></table>');

		} else {
			//城市间交通费
			me.setCostCarfareList(data);
			//住宿费
			me.setCostHotelList(data);
			//其他费用
			me.setCostOtherList(data);
			//补助明细
			me.setCostSubsidyList(data);
		}

		if(data.teacherApplyInfoList.length == 0 && data.costTrainApplyInfoList.length == 0 && data.costTeachersFoodApplyInfoList.length == 0 && data.costTeachersLectureApplyInfoList.length == 0 && data.costTeachersTravelApplyInfoList.length == 0 && data.costTeachersHotelApplyInfoList.length == 0 && data.costNormalList.length == 0) {
			$(".hide-div").html('<table style="width:100%"><tr style="border:0px;background-color:#fff !important;"><td align="center"style="border:0px;"><div class="no-data" style="width: 280px;padding:0;margin: 0 auto;">' +
				'<img src="../../../../../resources-sasac/images/common/no-data.png" alt="" style="padding:10px 0;">' +
				'</div></td></tr></table>');

		} else {
			//teacherApplyInfoList	师资-讲师信息json
			me.setTeacherApplyInfoList(data.teacherApplyInfoList);
			//costTrainApplyInfoList	师资-培训费json
			me.setCostTrainApplyInfoList(data.costTrainApplyInfoList);
			//costTeachersFoodApplyInfoList	师资-伙食费json
			me.setCostTeachersFoodApplyInfoList(data.costTeachersFoodApplyInfoList);
			//costTeachersLectureApplyInfoList	师资-讲课费json
			me.setCostTeachersLectureApplyInfoList(data.costTeachersLectureApplyInfoList);
			//costTeachersTravelApplyInfoList	师资-城市间交通费json
			me.setCostTeachersTravelApplyInfoList(data.costTeachersTravelApplyInfoList);
			//costTeachersHotelApplyInfoList	师资-住宿费 json
			me.setCostTeachersHotelApplyInfoList(data.costTeachersHotelApplyInfoList);
			//costNormalList	普通报销-费用明细/普通付款-付款明细 json
			me.setCostNormalList(data.costNormalList);
			
		}
		me.setMeetingList(data.meetingList);
		me.setMeetingCostList(data.meetingCostList);
		me.setTrainApplyInfoList(data.trainApplyInfoList);
		//定位滚动条到当前预算核减明细表格区域
		var indexHeight  = $("#locationId").offset().top;
		$(window).scrollTop(indexHeight);
	},
	setCostCarfareList: function(data) {
		//costCarfareList	城市间交通费
		var fMoney = $yt_baseElement.fmMoney;
		var costCarfareList = data.costCarfareList;
		var carHtml = '';
		//结算方式复选框
		var costCarfareClose = $('#traffic-list-info').next().find('.check-label input');
		if(costCarfareList != 0) {
			$.each(costCarfareList, function(i, n) {
				carHtml += '<tr>' +
					'<td><span>' + n.travelPersonnelName + '</span><input type="hidden" data-val="travelPersonnel" class="hid-traf-users" value="' + n.travelPersonnel + '"/>' +
					'</td><td>' + n.travelPersonnelsDept + '</td>' +
					'<td data-text="goTime">' + n.goTime + '</td><td><input data-val="goAddress" type="hidden" value="' + n.goAddress + '"><span data-text="goAddressName">' + n.goAddressName + '</span></td><td data-text="arrivalTime">' + n.arrivalTime + '</td>' +
					'<td><input data-val="arrivalAddress" type="hidden" value="' + n.arrivalAddress + '"> <span data-text="arrivalAddressName">' + n.arrivalAddressName + '</span></td>' +
					'<td><span data-text="vehicle">' + n.vehicleName + '</span><input type="hidden" class="hid-vehicle" value="' + n.vehicle + '"/><input type="hidden" class="hid-child-code" value=""/></td>' +
					'<td class="font-right money-td" data-text="crafare">' + (n.crafare == "" ? "--" : fMoney(n.crafare || '0')) + '</td>' +
					'<td class="text-overflow-sty" data-text="remarks" title="' + n.remarks + '">' + (n.remarks == "" ? "--" : n.remarks) + '</td>' +
					'<td style="display:none;">' +
					'<input type="hidden" class="hid-cost-type" value="0"/>' +
					'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>' +
					'</td></tr>';
				//结算方式复选框存在并且有选中的值时
				if(costCarfareClose.length > 0 && n.setMethod) {
					//设置选中
					costCarfareClose.setCheckBoxState('check');
				}
			});
			carHtml += '<tr class="total-last-tr">' +
				'<td><span class="tab-font-blod">合计</span></td><td></td><td></td><td></td><td></td><td></td>' +
				'<td></td>' +
				'<td class="font-right"><span class="tab-font-blod money-sum">0.00</span></td>' +
				'<td></td></tr>';
			$('#traffic-list-info tbody').html(carHtml);
			//调用合计方法
			sysCommon.updateMoneySum(0);
		} else {
			$('#traffic-list-info').hide();
			$('.traffic-title').hide();
		}

	},
	setCostHotelList: function(data) {
		//costHotelList	住宿费
		var fMoney = $yt_baseElement.fmMoney;
		var costHotelList = data.costHotelList;
		var hotelHtml = '';
		//结算方式复选框
		var costHotelClose = $('#hotel-list-info').next().find('.check-label input');

		if(costHotelList != 0) {
			$.each(costHotelList, function(i, n) {
				var avg = n.hotelDays > 0 ? fMoney((+n.hotelExpense / +n.hotelDays) || '0') : n.hotelExpense;
				hotelHtml += '<tr>' +
					'<td><span>' + n.travelPersonnelName + '</span><input type="hidden" data-val="travelPersonnel" value="' + n.travelpersonnel + '"/></td><td>' + n.travelPersonnelsJobLevelName + '</td>' +
					/*'<td data-text="hotelTime">' + $("#hotelDate").val() + '</td>' +*/
					'<td class="font-right">' + avg + '</td>' +
					'<td risk-code-val="hotelCheckInDate" class="check-in-date"><span class="sdate">' + n.hotelTime + '</span></td>' +
					'<td class="leave-date"><span class="edate">' + n.leaveTime + '</span></td>' +
					'<td data-text="hotelDays">' + n.hotelDays + '</td><td class="font-right money-td" data-text="hotelExpense">' + fMoney(n.hotelExpense || '0') + '</td>' +
					'<td><span data-text="hotelAddressName">' + n.hotelAddressName + '</span><input type="hidden" data-val="hotelAddress" value="' + n.hotelAddress + '"</td>' +
					'<td class="text-overflow-sty" data-text="remarks" title="' + n.remarks + '">' + (n.remarks == "" ? "--" : n.remarks) + '</td>' +
					'<td style="display:none;">' +
					'<input type="hidden" class="hid-set-met" data-val="setMethod"/>' +
					'<input type="hidden" class="hid-cost-type" value="1"/>' +
					'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>' +
					'</td></tr>';
				//结算方式复选框存在并且有选中的值时
				if(costHotelClose.length > 0 && n.setMethod) {
					//设置选中
					costHotelClose.setCheckBoxState('check');
				}
			});
			hotelHtml += '<tr class="total-last-tr">' +
				'<td><span class="tab-font-blod">合计</span></td><td></td><td></td><td></td><td></td><td></td>' +
				'<td class="font-right"><span class="tab-font-blod money-sum">0.00</span></td>' +
				'<td></td><td></td></tr>';
			$('#hotel-list-info tbody').html(hotelHtml);
			//调用合计方法
			sysCommon.updateMoneySum(1);
		} else {
			$('#hotel-list-info').hide();
			$('.accommodation-title').hide();
		}

	},
	setCostOtherList: function(data) {
		//costOtherList	其他费用
		var fMoney = $yt_baseElement.fmMoney;
		var costOtherList = data.costOtherList;
		var otherHtml = '';
		//结算方式复选框
		var costOtherClose = $('#other-list-info').next().find('.check-label input');

		if(costOtherList != 0) {
			$.each(costOtherList, function(i, n) {
				otherHtml += '<tr>' +
					'<td><span>' + n.costTypeName + '</span><input type="hidden" data-val="costType" value="' + n.costType + '"/></td>' +
					'<td class="font-right money-td" data-text="reimAmount">' + fMoney(n.reimAmount || '0') + '</td>' +
					'<td class="text-overflow-sty" data-text="remarks" title="' + n.remarks + '">' + (n.remarks == "" ? "--" : n.remarks) + '</td>' +
					'</tr>';
				//结算方式复选框存在并且有选中的值时
				if(costOtherClose.length > 0 && n.setMethod) {
					//设置选中
					costOtherClose.setCheckBoxState('check');
				}
			});
			otherHtml += '<tr class="total-last-tr">' +
				'<td><span class="tab-font-blod">合计</span></td>' +
				'<td class="font-right"><span class="tab-font-blod money-sum">0.00</span></td>' +
				'<td></td></tr>';
			$('#other-list-info tbody').html(otherHtml);
			//调用合计方法
			sysCommon.updateMoneySum(2);
		} else {
			$('#other-list-info').hide();
			$('.other-title-hide').hide();
		}

	},
	setCostSubsidyList: function(data) {
		//costSubsidyList	补助明细
		var fMoney = $yt_baseElement.fmMoney;
		var costSubsidyList = data.costSubsidyList;
		var subHtml = '';
		var totalFood = 0;
		var totalTraffic = 0;

		if(costSubsidyList != 0) {
			$.each(costSubsidyList, function(i, n) {
				subHtml += '<tr class="' + n.travelPersonnel + '" code="' + n.travelPersonnel + '"><td><div class="user" code="' + n.travelPersonnel + '">' + n.travelPersonnelName + '</div></td><td><div class="lv">' + n.travelPersonnelsDept + '</div></td><td><div class="subsidy-num">' + n.subsidyDays + '</div></td><td><div style="text-align:right;" class="food">' + fMoney(n.subsidyFoodAmount || '0') + '</div></td><td><div  style="text-align:right;" class="traffic">' + fMoney(n.carfare || '0') + '</div></td></tr>';
				totalFood += +n.subsidyFoodAmount;
				totalTraffic += +n.carfare;
			});
			subHtml += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + fMoney(totalFood || '0') + '</td><td class="total-traffic"  style="text-align:right;">' + fMoney(totalTraffic || '0') + '</td></tr>';
			$('#subsidy-list-info tbody').html(subHtml);
		} else {
			$('#subsidy-list-info').hide();
			$('.subsidy-title').hide();
		}

	},
	/**
	 * teacherApplyInfoList	师资-讲师信息json
	 * 设置 师资讲师信息列表数据
	 * @param {Object} list
	 */
	setTeacherApplyInfoList: function(list) {
		var html = '';
		$.each(list, function(i, n) {
			html += '<tr>' +
				'<td class="lecturerName"><input type="hidden" class="lectureId" value="' + n.lecturerId + '"><span>' + n.lecturerName + '</span></td>' +
				'<td class="professional">' + n.lecturerTitleName + '</td>' +
				'<td class="level">' + n.lecturerLevelName + '</td>' +
				'<td style="display:none"><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
				'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td></tr>';
		});
		//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + budgetAuditReduce.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + budgetAuditReduce.fmMoney(totalTraffic) + '</td></tr>';
		$('#lecturerTable tbody').html(html);
	},
	/**
	 * costTrainApplyInfoList	师资-培训费json
	 * 设置 师资培训费列表数据
	 * @param {Object} list
	 */
	setCostTrainApplyInfoList: function(list) {
		var html = '';
		var total = 0;
		if(list != 0) {
			$.each(list, function(i, n) {
				html += '<tr pid="' + n.trainAppId + '" trainType="' + n.trainType + '">' +
					'<td class="trainTypeName">' + n.trainTypeName + '</td>' +
					'<td style="text-align: right" class="standard">' + $yt_baseElement.fmMoney(n.standard) + '</td>' +
					'<td class="trainOfNum">' + n.trainOfNum + '</td>' +
					'<td class="trainDays">' + n.trainDays + '</td>' +
					'<td class="moneyText averageMoney">' + n.averageMoney + '</td>' +
					'<td style="text-align: left" class="trainingPerNumber">' + n.trainOfNum + '</td>' +
					'</tr>';
				total += +n.averageMoney;
			});
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + budgetAuditReduce.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + budgetAuditReduce.fmMoney(totalTraffic) + '</td></tr>';
			$('#trainingFeeTable tbody .last').before(html);
			$('#trainingFeeTable .costTotal').text(budgetAuditReduce.fmMoney(total));
		} else {
			$('#trainingFeeTable').hide();
			$('.other-title').hide();
		}
	},
	/**
	 * costTeachersFoodApplyInfoList	师资-伙食费json
	 * 设置 师资伙食费列表
	 * @param {Object} list
	 */
	setCostTeachersFoodApplyInfoList: function(list) {
		var html = '';
		var total = 0;
		if(list != 0) {
			$.each(list, function(i, n) {
				html += '<tr pid="' + n.foodId + '">' +
					'<td><input type="hidden" class="lectureId" value="' + n.lecturerId + '">' + n.lecturerName + '</td>' +
					'<td class="avg moneyText">' + budgetAuditReduce.fmMoney(n.averageMoney) + '</td>' +
					'<td class="day">' + n.foodOfDays + '</td>' +
					'<td class="moneyText sum-pay">' + budgetAuditReduce.fmMoney(n.foodAmount) + '</td>' +
					'<td style="text-align: left !important;" class="dec">' + n.remarks + '</td>' +
					'<td style="display:none"><input type="hidden" class="popM" value="4"/>' +
					'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td>' +
					'</tr>';
				total += +n.foodAmount;
			});
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + budgetAuditReduce.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + budgetAuditReduce.fmMoney(totalTraffic) + '</td></tr>';
			$('#dietFeeTable tbody .end-tr').before(html);
			$('#dietFeeTable tbody .costTotal').text(budgetAuditReduce.fmMoney(total));
		} else {
			$('#dietFeeTable').hide();
			$('.food-title').hide();
		}
	},
	/**
	 * //costTeachersLectureApplyInfoList	师资-讲课费json
	 * 设置 师资讲课费列表
	 * @param {Object} list
	 */
	setCostTeachersLectureApplyInfoList: function(list) {
		var html = '';
		var total = 0;
		if(list != 0) {
			$.each(list, function(i, n) {
				html += '<tr pid="' + n.teachersLectureId + '">' +
					'<td class="uname"><input type="hidden" class="lectureId" value="' + n.lecturerId + '">' + n.lecturerName + '</td>' +
					'<td class="holder">' + n.lecturerTitleName + '</td>' +
					'<td class="hour">' + n.teachingHours + '</td>' +
					'<td class="cname">' + n.courseName + '</td>' +
					'<td class="moneyText sum-pay">' + budgetAuditReduce.fmMoney(n.perTaxAmount) + '</td>' +
					'<td class="moneyText after">' + budgetAuditReduce.fmMoney(n.afterTaxAmount) + '</td>' +
					'<td class="moneyText avg">' + budgetAuditReduce.fmMoney(n.averageMoney) + '</td>' +
					'<td style="display:none"><input type="hidden" class="popM" value="1"/>' +
					'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
					'</td></tr>';
				total += +n.perTaxAmount;
			});
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + budgetAuditReduce.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + budgetAuditReduce.fmMoney(totalTraffic) + '</td></tr>';
			$('#lectureFeeTable tbody .end-tr').before(html);
			$('#lectureFeeTable tbody .costTotal').text(budgetAuditReduce.fmMoney(total));
		} else {
			$('#lectureFeeTable').hide();
			$('.lecture-title').hide();
		}
	},
	/**
	 * //costTeachersTravelApplyInfoList	师资-城市间交通费json
	 * 设置 师资城市间交通费列表
	 * @param {Object} list
	 */
	setCostTeachersTravelApplyInfoList: function(list) {
		var html = '';
		var total = 0;
		if(list != 0) {
			$.each(list, function(i, n) {
				html += '<tr pid="' + n.teachersTravelId + '">' +
					'<td class="uname"><input type="hidden" class="lectureId" value="' + n.lecturerId + '">' + n.lecturerName + '</td>' +
					'<td class="ulv">' + n.lecturerLevelName + '</td>' +
					'<td class="sdate">' + n.goTime + '</td>' +
					'<td class="edate">' + n.arrivalTime + '</td>' +
					'<td class="sadd"><input type="hidden" class="scode" value="' + n.goAddress + '">' + n.goAddressName + '</td>' +
					'<td class="eadd"><input type="hidden" class="ecode" value="' + n.arrivalAddress + '">' + n.arrivalAddressName + '</td>' +
					'<td class="tname"><input type="hidden" class="tool" value="' + n.vehicle + '">' + n.vehicleName + '</td>' +
					'<td class="moneyText sum-pay">' + budgetAuditReduce.fmMoney(n.carfare) + '</td>' +
					'<td style="text-align: left !important;" class="dec">' + n.remarks + '</td>' +
					'<td  style="display:none"><input type="hidden" class="popM" value="2"/>' +
					'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
					'</td></tr>';
				total += +n.carfare;
			});
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + budgetAuditReduce.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + budgetAuditReduce.fmMoney(totalTraffic) + '</td></tr>';
			$('#carFeeTable tbody .end-tr').before(html);
			$('#carFeeTable tbody .costTotal').text(budgetAuditReduce.fmMoney(total));
		} else {
			$('#carFeeTable').hide();
			$('.traffic-title').hide();
		}
	},
	/**
	 * //costTeachersHotelApplyInfoList	师资-住宿费 json
	 * 设置 师资住宿费列表
	 * @param {Object} list
	 */
	setCostTeachersHotelApplyInfoList: function(list) {
		var html = '';
		var total = 0;
		if(list != 0) {
			$.each(list, function(i, n) {
				html += '<tr pid="' + n.teachersHotelId + '">' +
					'<td class="name"><input type="hidden" class="lectureId" value="' + n.lecturerId + '">' + n.lecturerName + '</td>' +
					'<td class="sdate">' + n.startTime + '</td>' +
					'<td class="edate">' + n.endTime + '</td>' +
					'<td class="moneyText avg">' + budgetAuditReduce.fmMoney(n.averageMoney) + '</td>' +
					'<td class="day">' + n.hotelDays + '</td>' +
					'<td class="moneyText sum-pay">' + budgetAuditReduce.fmMoney(n.hotelExpense) + '</td>' +
					'<td style="text-align: left !important;" class="dec">' + n.remarks + '</td>' +
					'<td style="display:none"><input type="hidden" class="popM" value="3"/>' +
					'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
					'</td></tr>';
				total += +n.hotelExpense;
			});
			//html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">' + budgetAuditReduce.fmMoney(totalFood) + '</td><td class="total-traffic"  style="text-align:right;">' + budgetAuditReduce.fmMoney(totalTraffic) + '</td></tr>';
			$('#hotelFeeTable tbody .end-tr').before(html);
			$('#hotelFeeTable tbody .costTotal').text(budgetAuditReduce.fmMoney(total));
		} else {
			$('#hotelFeeTable').hide();
			$('.accommodation-title').hide();
		}
	},
	/**
	 * //costNormalList	普通报销-费用明细/普通付款-付款明细 json
	 * 设置普通报销列表数据
	 * @param {Object} list
	 */
	setCostNormalList: function(list) {
		var html = '';
		var total = 0;
		$.each(list, function(i, n) {
			html += '<tr>' +
				'<td style="text-align:left;" class="reimContent">' + n.normalName + '</td>' +
				'<td style="text-align: right;" class="reimAmount">' + ($yt_baseElement.fmMoney(n.normalAmount)) + '</td>' +
				'<td class="remarks">'+ (n.remarks || '无') +'</td>' +
				'</tr>';
			total += +n.normalAmount;
		});
		$('.ordinary-approval #costList tbody .last').before(html);
		$('.ordinary-approval #costList tbody #reimAmountlSum').text($yt_baseElement.fmMoney(total));
	},
//	/**
//	 * //costNormalList	普通报销-费用明细/普通付款-付款明细 json
//	 * 设置普通报销列表数据
//	 * @param {Object} list
//	 */
//	setCostNormalList: function(list) {
//		var html = '';
//		var total = 0;
//		$.each(list, function(i, n) {
//			html += '<tr>' +
//				'<td style="text-align:left;" class="reimContent">' + n.normalName + '</td>' +
//				'<td style="text-align: right;" class="reimAmount">' + ($yt_baseElement.fmMoney(n.normalAmount)) + '</td>' +
//				'<td></td>' +
//				'</tr>';
//			total += +n.normalAmount;
//		});
//		$('.ordinary-approval #costList tbody .last').before(html);
//		$('.ordinary-approval #costList tbody #reimAmountlSum').text($yt_baseElement.fmMoney(total));
//	},
	setTrainApplyInfoList: function(list) {
		if(list.length > 0) {
			//培训类型
			$("#trainType").text(list[0].trainTypeName);
			//培训名称
			$("#regionDesignation").text(list[0].regionDesignation);
			//培训地点中文
			$("#regionName").text(list[0].regionName);
			//报到时间
			$("#reportTime").text(list[0].reportTime);
			//结束时间	
			$("#endTime").text(list[0].endTime);
			//培训天数
			$("#trainDays").text(list[0].trainDays);
			//培训人数
			$("#trainOfNum").text(list[0].trainOfNum);
			//工作人员数量
			$("#workerNum").text(list[0].workerNum);
		}

	},
	setMeetingList: function(list) {
		if(list.length > 0) {
			//会议分类
			$("#meetTypeName").text(list[0].meetTypeName);
			//会议名称
			$("#meetName").text(list[0].meetName);
			//会议地点中文
			$("#meetAddress").text(list[0].meetAddress);
			//会议开始时间
			$("#meetStartTime").text(list[0].meetStartTime);
			//会议结束时间	
			$("#meetEndTime").text(list[0].meetEndTime);
			//会期
			$("#meetDays").text(list[0].meetDays);
			//参会人数
			$("#meetOfNum").text(list[0].meetOfNum);
			//工作人员数量
			$("#meetWorkerNum").text(list[0].meetWorkerNum);
		}
	},
	setMeetingCostList: function(list) {
		if(list.length > 0) {
			//住宿费
			$("#meetHotel").text(list[0].meetHotel || '--');
			//伙食费
			$("#meetFood").text(list[0].meetFood || '--');
			//其他费用
			$("#meetOther").text(list[0].meetOther || '--');
			//费用合计	
			$("#meetAmount").text(list[0].meetAmount || '--');
			//人均日均费用金额
			$("#meetAverage").text(list[0].meetAverage || '--');
		} else {
			//住宿费
			$("#meetHotel").text('--');
			//伙食费
			$("#meetFood").text('--');
			//其他费用
			$("#meetOther").text('--');
			//费用合计
			$("#meetAmount").text('--');
			//人均日均费用金额
			$("#meetAverage").text('--');
		}

	},
	//判断显示子页面
	getCostType: function(costType) {
		if(costType == 'NORMAL_APPLY') {
			//普通
			sysCommon.loadingWord('view/system-sasac/expensesReim/module/reimApply/costDetailApproval.html');
		} else if(costType == 'TRAIN_APPLY') {
			//培训
			sysCommon.loadingWord('view/system-sasac/expensesReim/module/busiTripApply/trainApproval.html');
		} else if(costType == 'MEETING_APPLY') {
			//会议
			sysCommon.loadingWord('view/system-sasac/expensesReim/module/beforehand/meetingCostApplyDetails.html');
		} else if(costType == 'BH_APPLY') {
			//公务接待
			sysCommon.loadingWord('view/system-sasac/expensesReim/module/reimApply/hospitalitySpendingDetail.html');
		} else if(costType == 'TRAVEL_APPLY') {
			//差旅
			sysCommon.loadingWord('view/system-sasac/expensesReim/module/reimApply/travelSpendingDetails.html');
		}

	},

};

$(function() {
	budgetAuditReduce.inits();//初始化页面
	//定位滚动条到当前预算核减明细表格区域
	var indexHeight  = $("#locationId").offset().top;
	$(window).scrollTop(indexHeight);
});