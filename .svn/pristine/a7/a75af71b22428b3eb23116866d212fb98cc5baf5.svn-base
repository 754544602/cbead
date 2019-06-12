var travelSpending = {
	selUsersName: "", //用户名
	selUsersCode: "", //用户code
	init: function() {
		var me = this;
		me.start();
		me.events();
	},
	start: function() {
		//数字文本框
		$yt_baseElement.numberInput($(".travel-div .yt-numberInput-box"));
		//下拉列表
		$('.travel-div select:not(.busi-addres-sel)').niceSelect();
		//行程计划表格编辑开始日期和结束日期
		$("#tdStartDate").calendar({
			controlId: "planStartDate",
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $("#tdEndDate"), //开始日期最大为结束日期 
			speed: 0,
			callback: function() {
				//调用公用的清除验证信息方法
				sysCommon.clearValidInfo($("#tdStartDate"));
			}
		});
		$("#tdEndDate").calendar({
			controlId: "planEndDate",
			nowData: false, //默认选中当前时间,默认true  
			lowerLimit: $("#tdStartDate"), //开始日期最大为结束日期  
			speed: 0,
			callback: function() {
				//调用公用的清除验证信息方法
				sysCommon.clearValidInfo($("#tdEndDate"));
			}
		});

		// 费用明细交通费,出发日期到达日期
		$("#traffic-start-time").calendar({
			controlId: "trafficStartTime",
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $("#traffic-end-time"), //开始日期最大为结束日期  
			speed: 0,
			callback: function() {
				//调用公用的清除验证信息方法
				sysCommon.clearValidInfo($("#traffic-start-time"));
			}
		});
		$("#traffic-end-time").calendar({
			controlId: "trafficEndTime",
			nowData: false, //默认选中当前时间,默认true  
			lowerLimit: $("#traffic-start-time"), //结束日期最小为开始日期  
			speed: 0,
			callback: function() {
				//调用公用的清除验证信息方法
				sysCommon.clearValidInfo($("#traffic-end-time"));
			}
		});

		//入住日期
		$("#hotelDate").calendar({
			controlId: "hotelTime",
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $("#leaveDate"), //开始日期最大为结束日期 
			speed: 0,
			callback: function() {
				//调用公用的清除验证信息方法
				sysCommon.clearValidInfo($("#hotelDate"));
				//入住日期
				var tdStartDate = $("#hotelDate").val();
				//结束日期
				var tdEndDate = $('#leaveDate').val();
				//1. 把开始时间和结束时间保存
				var dateFrom = new Date(tdStartDate);
				var dateTo = new Date(tdEndDate);
				if(tdStartDate != "" && tdEndDate != "") {
					//2. 计算时间差
					var diff = dateTo.valueOf() - dateFrom.valueOf();
					//3. 时间差转换为天数
					var diff_day = parseInt(diff / (1000 * 60 * 60 * 24));
					//计算入住天数
					$(".hotel-form .hotel-num").css("color", "#333333").text(diff_day);
					//获取住宿费
					var money = +$('.hotel-form .cost-detail-money').val();
					if(diff_day == 0) {
						$('#peoDayMoney').text(money);
					} else {
						$('#peoDayMoney').text($yt_baseElement.fmMoney(money / diff_day));
					}
				}
			}
		});
		//离开日期
		$("#leaveDate").calendar({
			controlId: "leaveTime",
			nowData: false, //默认选中当前时间,默认true  
			lowerLimit: $("#hotelDate"), //结束日期最小为开始日期  
			speed: 0,
			callback: function() {
				//调用公用的清除验证信息方法
				sysCommon.clearValidInfo($("#leaveDate"));
				//入住日期
				var tdStartDate = $("#hotelDate").val();
				//结束日期
				var tdEndDate = $('#leaveDate').val();
				//1. 把开始时间和结束时间保存
				var dateFrom = new Date(tdStartDate);
				var dateTo = new Date(tdEndDate);
				if(tdStartDate != "" && tdEndDate != "") {
					//2. 计算时间差
					var diff = dateTo.valueOf() - dateFrom.valueOf();
					//3. 时间差转换为天数
					var diff_day = parseInt(diff / (1000 * 60 * 60 * 24));
					//计算入住天数
					$(".hotel-form .hotel-num").css("color", "#333333").text(diff_day);
					//获取住宿费
					var money = +$('.hotel-form .cost-detail-money').val();
					if(diff_day == 0) {
						$('#peoDayMoney').text(money);
					} else {
						$('#peoDayMoney').text($yt_baseElement.fmMoney(money / diff_day));
					}
				}
			}
		});
	},
	events: function() {
		var me = this;

		//调用公用的差旅报销明细填写Tab页切换事件方法
		sysCommon.costDetailModelTabEvent();

		//金额文本框获取焦点事件 
		$('.travel-div .money-input').on('focus', function() {
			var ts = $(this);
			if(ts.val() != "") {
				//调用还原格式化的方法  
				ts.val($yt_baseElement.rmoney(ts.val()));
			}
		});
		//金额文本框失去焦点事件 
		$('.travel-div .money-input').on('blur', function() {
			var ts = $(this);
			if(ts.val() != '') {
				//调用格式化金额方法  
				ts.val($yt_baseElement.fmMoney(ts.val()));
			}
		});
		//金额文本框输入事件 
		$('.travel-div .money-input').on('keyup', function() {
			var ts = $(this);
			if(ts.val() != '') {
				//调用格式化金额方法  
				ts.val(ts.val().replace(/[^\d.]/g, ''));
			}
		});
		
		
		//出差类型切换
		$('#modelBusiType').on('change', function(){
			var code = $(this).val();
			if(code == 'TRAVEL_TYPE_2' || code == 'TRAVEL_TYPE_3'){
				$('.bear-expense').show();
			} else {
				$('.bear-expense').hide();
			}
		});

		//获取数据字典
		me.getDictInfoByTypeCode();
		//差旅费列表事件
		me.costApplyAlertEvent();
	},
	/**
	 * 差旅费列表相关事件
	 */
	costApplyAlertEvent: function() {
		var me = this;
		//点击出差人输入框操作
		$("#modelBusiUser").off().on("click", function() {
			//显示出差人列表
			$("#busiUserInfo").show();
			//判断出差人列表书否读取过数据
			if(!$("#busiUserInfo").hasClass("check")) {
				//调用获取出差人列表方法
				me.getBusiTripUsersList($("#userPram").val());
			}
			//调用弹出框中操作事件方法
			me.busiTripUserModelEvent($("#modelBusiUser"), $("#busiPlanEditModel .auto-font"), $(".model-user-num-show"), 1);
		});
		//行程明细新增
		$('#tripAddBtn').click(function() {
			//显示弹框
			me.showTripAlert();
			$('#planSaveBtn').off().on('click', function() {
				//添加页面
				me.appendTripList();
			});
		});
		//行程明细删除
		$('#tripList').on('click', '.operate-del', function() {
			var ithis = $(this);
			var tr = ithis.parents('tr');
			$yt_alert_Model.alertOne({
				alertMsg: "数据删除将无法恢复,确认删除吗?", //提示信息  
				confirmFunction: function() { //点击确定按钮执行方法  
					tr.remove();
					//获取行程列表的长度
					var trs = $('#tripList tbody tr');
					//行程列表没有数据
					if(trs.length <= 0) {
						//清空费用明细中所有列表
						$('#traffic-list-info tbody').empty();
						$('#hotel-list-info tbody').empty();
						$('#other-list-info tbody').empty();
						$('#subsidy-list-info tbody').empty();
					} else {
						//重新配置补助明细列表
						me.setSubsidyList();
						//重新设置出差人数据
						/*var trs = $('#tripList tbody tr');
						trs.each(function(i, n) {
							//获取到每行的出差人数据进行拆分
							var users = $(n).attr('usercode').split(',');
							for(var j = 0, len = users.length; j < len; j++) {
								
								
							}
						});*/

					}
				}
			});
		});
		//补助明细删除
		$('#subsidy-list-info').on('click', '.operate-del', function() {
			var ithis = $(this);
			var tr = ithis.parents('tr');
			$yt_alert_Model.alertOne({
				alertMsg: "数据删除将无法恢复,确认删除吗?", //提示信息  
				confirmFunction: function() { //点击确定按钮执行方法  
					tr.remove();
					//重新配置补助明细合计
					me.setSubsidyTotal();
					//计算总金额
					me.updateMoneySum();

				}
			});
		});

		//行程明细修改
		$('#tripList').on('click', '.operate-update', function() {
			var ithis = $(this);
			var tr = ithis.parents('tr');
			//数据回显
			me.setTripAlertData(tr);
			//显示弹框
			me.showTripAlert();
			//重置按钮
			$('#planSaveBtn').off().on('click', function() {
				me.appendTripList(tr);
			});
		});
		//行程明细取消
		$('#planCanelBtn').click(function() {
			me.hideTripAlert();
			$("#busiUserInfo ul li").removeClass("tr-check");
			$("#busiUserInfo").removeClass("check");
			$('#modelBusiAddres').html('<option value="">请输入</option>');
			//清空存储出差人的数据
			me.selUsersName = "";
			me.selUsersCode = "";
			me.clearAlert($('#busiPlanEditModel'));
		});

		//费用明细新增
		$('#addCostApplyBtn').click(function() {
			//显示弹框
			me.showCostApplyAlert();
			//绑定处理事件
			me.busiTripUserModelEvent();
			$('#modelSureBtn').off().on('click', function() {
				//获取当前选中的tab值0交通费,1住宿费2其他
				var tabFlag = $("#costApplyAlert .cost-type-tab li.tab-check .hid-tab").val();
				var validModel = "";
				if(tabFlag == 0) {
					validModel = $("#costApplyAlert .traffic-form");
				} else if(tabFlag == 1) {
					validModel = $("#costApplyAlert .hotel-form");
				} else if(tabFlag == 2) {
					validModel = $("#costApplyAlert .other-form");
				}
				//调用验证方法
				var validFlag = $yt_valid.validForm(validModel);
				if(validFlag) {
					//调用获取表单数据拼接方法
					me.appendCostApplyList(tabFlag);
				}
			});
		});

		/**
		 * 
		 * 出发地,到达地互换操作
		 * 
		 */
		$("#addres-icon").off().on("click", function() {
			var startCity = $("#fromcity option:selected");
			var endCity = $("#tocity option:selected");
			$("#tocity").html(startCity);
			$("#fromcity").html(endCity);
			me.getPlanBusiAddress($("#tocity"));
			me.getPlanBusiAddress($("#fromcity"));
		});

		/**
		 * 
		 * 城市金额输入框失去焦点获取焦点事件
		 * 
		 */
		$(".city-cost-input,.cost-detail-money").on("focus", function() {
			if($(this).val() != "" && $(this).val() != null) {
				$(this).val($yt_baseElement.rmoney($(this).val()));
				$(this).select();
			}
		});
		$(".city-cost-input,.cost-detail-money").on("blur", function() {
			var val = $yt_baseElement.rmoney($(this).val() || '0');
			//判断如果是住宿费失去焦点
			if($(this).hasClass("cost-detail-money")) {
				if($(this).val() != "") {
					//算出住宿费平均数
					var hotelDay = $(".hotel-form .hotel-num").text();
					//判断如果天数计算是0
					if(hotelDay == 0) {
						$("#peoDayMoney").html($yt_baseElement.fmMoney(val));
					} else {
						$("#peoDayMoney").html($yt_baseElement.fmMoney(val / hotelDay));
					}
				}
			}
		});

		//城市间交通费删除
		$('#traffic-list-info,#hotel-list-info,#other-list-info').on('click', '.operate-del', function() {
			var ithis = $(this);
			var tr = ithis.parents('tr');
			var table = ithis.parents('table');
			$yt_alert_Model.alertOne({
				alertMsg: "数据删除将无法恢复,确认删除吗?", //提示信息  
				confirmFunction: function() { //点击确定按钮执行方法  
					tr.remove();
					//判断是否都删除,给出暂无数据
					if(table.find('tbody tr:not(.total-last-tr)').length <= 0) {
						var cols = table.find('thead tr th').length;
						var noDataTr = '<tr class="not-date-tr">' +
							'<td colspan="' + cols + '">' +
							'<div class="no-data">' +
							'<img src="../../../../../resources-sasac/images/common/no-data.png" alt="">' +
							'</div>' +
							'</td>' +
							'</tr>';
						table.find('tbody').html('');
					}
					//调用合计方法
					me.updateMoneySum(0);
					me.updateMoneySum(1);
					me.updateMoneySum(2);
					//重新计算总金额
					me.updateApplyMeonySum();
				}
			});
		});
		//城市间交通费修改
		$('#traffic-list-info,#hotel-list-info,#other-list-info').on('click', '.operate-update', function() {
			var ithis = $(this);
			var tr = ithis.parents('tr');
			//显示弹框
			me.showCostApplyAlert();
			//数据回显
			me.setFormInfo(tr);
			//获取费用类型0.交通1.住宿2.其他
			var costType = tr.find(".hid-cost-type").val();
			//选中相对应的tab
			$("#costApplyAlert .cost-type-tab ul li").removeClass("tab-check");
			$('#costApplyAlert .cost-type-tab ul li input[value="' + costType + '"]').parent().addClass("tab-check");
			//显示相对应的表单
			if(costType == 0) {
				$(".traffic-form").show();
				//改变风险灯为绿灯
				//$(".traffic-form .risk-img").attr("src", me.riskViaImg);
			}
			if(costType == 1) {
				$(".hotel-form").show();
				$(".traffic-form").hide();
				//改变风险灯为绿灯
				//$(".hotel-form .risk-img").attr("src", me.riskViaImg);
			}
			if(costType == 2) {
				$(".other-form").show();
				$(".traffic-form").hide();
				//改变风险灯为绿灯
				//$(".other-form .risk-img").attr("src", me.riskViaImg);
			}
			//重置按钮
			$('#modelSureBtn').off().on('click', function() {
				me.appendCostApplyList(costType, tr);
			});
		});

		//费用明细关闭
		$('#modelCanelBtn').click(function() {
			//关闭弹框
			me.hideCostApplyAlert();
			//清空表单
			me.clearFormData();

		});
		//补助明细修改事件
		$('#subsidy-list-info').on('click', '.operate-update', function() {
			var ithis = $(this);
			var tr = ithis.parents('tr');
			//显示弹框
			me.showSubsidiesAlert();
			//数据回显
			//出差人
			$('#subsidyBusinUser').text(tr.find('.user').text());
			//级别
			$('#subsidyBusinLevel').text(tr.find('.lv').text());
			//补助天数
			$('#subsidiesDays').val(tr.find('.subsidy-num').text());
			//伙食补助费
			$('#subsidiesFood').val(tr.find('.food').text());
			//室内交通补助
			$('#subsidiesTraffic').val(tr.find('.traffic').text());
			//重置按钮
			$('#subsidiesCommon').off().on('click', function() {
				//修改补助明细
				me.appendSubdisyList(tr);
			}).text('确定');
		});
		//补助明细关闭
		$('#subsidiesCancel').click(function() {
			//关闭弹框
			me.hideSubsidiesAlert();
			//清空表单
			me.clearAlert($('#subdisyInfoAlert'));
		});

	},
	/**
	 * 显示补助明细弹框
	 */
	showSubsidiesAlert: function() {
		var me = this;
		//获取弹框对象
		var alert = $('#subdisyInfoAlert');
		//显示弹框及蒙层
		$yt_baseElement.showMongoliaLayer();
		$yt_alert_Model.getDivPosition(alert);
		$('#pop-modle-alert').show();
		alert.show();
	},
	/**
	 * 隐藏补助明细弹框
	 */
	hideSubsidiesAlert: function() {
		//隐藏弹框及蒙层
		$yt_baseElement.hideMongoliaLayer();
		$('#subdisyInfoAlert').hide();
		$('#pop-modle-alert').hide();
	},
	/**
	 * 显示行程明细新增弹框
	 */
	showTripAlert: function() {
		var me = this;
		//获取弹框对象
		var alert = $('#busiPlanEditModel');
		//调用行程表单出差地点事件
		//获取住宿地点
		me.setAddress();
		//显示弹框及蒙层
		$yt_baseElement.showMongoliaLayer();
		$yt_alert_Model.getDivPosition(alert);
		$('#pop-modle-alert').show();
		alert.show();
	},
	/**
	 * 隐藏行程明细新增弹框
	 */
	hideTripAlert: function() {
		//隐藏弹框及蒙层
		$yt_baseElement.hideMongoliaLayer();
		$('#busiPlanEditModel').hide();
		$('#pop-modle-alert').hide();
		$('#busiPlanEditModel .bear-expense').hide();
	},

	/**
	 * 显示新增差旅费用明细弹框
	 */
	showCostApplyAlert: function() {
		var me = this;
		//获取弹框对象
		var alert = $('#costApplyAlert');
		//获取出差人
		me.setModelUsers();
		//调用获取出差地点方法
		me.setAddress();
		me.getPlanBusiAddress($("#fromcity"));
		me.getPlanBusiAddress($("#tocity"));
		//显示弹框及蒙层
		$yt_baseElement.showMongoliaLayer();
		$yt_alert_Model.getDivPosition(alert);
		$('#pop-modle-alert').show();
		alert.show();

	},
	/**
	 * 隐藏新增差旅费用明细弹框
	 */
	hideCostApplyAlert: function() {
		//隐藏弹框及蒙层
		$yt_baseElement.hideMongoliaLayer();
		$('#costApplyAlert').hide();
		$('#pop-modle-alert').hide();
	},
	/**
	 * 添加修改行程明细表格
	 */
	appendTripList: function(tr) {
		var me = this;
		//显示出行程计划编辑框
		var planModel = $("#busiPlanEditModel");
		//出差类型
		var modelBusiType = $('#modelBusiType option:selected');
		//类型名称
		var name = modelBusiType.text();
		//类型code
		var code = modelBusiType.val();
		//开始日期
		var tdStartDate = $('#tdStartDate').val();
		//结束日期
		var tdEndDate = $('#tdEndDate').val();
		//1. 把开始时间和结束时间保存
		var dateFrom = new Date(tdStartDate);
		var dateTo = new Date(tdEndDate);
		//2. 计算时间差
		var diff = dateTo.valueOf() - dateFrom.valueOf();
		//3. 时间差转换为天数
		var diff_day = parseInt(diff / (1000 * 60 * 60 * 24));
		//出差天数
		var day = diff_day + 1;
		//出差地点
		var modelBusiAddres = $('#modelBusiAddres option:selected').val();
		var budiAddName = $('#modelBusiAddres').next().find('.search-current').val();
		//出差人
		var busiUsersName = $("#modelBusiUser").val(); //出差人名称
		var busiUsersCode = $("#modelUserCodes").val(); //出差人code
		//出差人数
		var busiNum = $(".model-user-num-show .users-num").text(); //出差人数
		//接待方承担费用
		var receptionMoney = ""; //名称
		var receptionMoneyCode = ""; //code
		if(planModel.find(".check-label.check").length > 0) {
			planModel.find(".check-label.check").each(function(i, n) {
				receptionMoney += $(n).find("span").text() + "、";
				receptionMoneyCode += $(n).find("input").val() + ",";
			});
			receptionMoney = receptionMoney.substring(0, receptionMoney.length - 1);
			receptionMoneyCode = receptionMoneyCode.substring(0, receptionMoneyCode.length - 1);
		} else {
			receptionMoney = "--";
		}
		var html = '<tr busicode="' + code + '" usercode="' + busiUsersCode + '" rececode="' + receptionMoneyCode + '" >' +
			'<td><input type="hidden" class="hid-user-code" value="' + busiUsersCode + '" /> <span class="name">' + name + '</span></td>' +
			'<td class="sdate">' + tdStartDate + '</td>' +
			'<td class="edate">' + tdEndDate + '</td>' +
			'<td class="day">' + day + '</td>' +
			'<td class="address" val="' + modelBusiAddres + '">' + budiAddName + '</td>' +
			'<td class="uname">' + busiUsersName + '</td>' +
			'<td class="numof">' + busiNum + '</td>' +
			'<td class="reception">' + receptionMoney + '</td>' +
			'<td>' +
			'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
			'<span class="operate-del" style=""><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
			'</td>' +
			'</tr>';

		//验证数据
		if($yt_valid.validForm($('#busiPlanEditModel'))) {
			if(tr) {
				//存在替换
				tr.replaceWith(html);
				//隐藏弹框
				me.hideTripAlert();
			} else {
				//不存在添加
				$('#tripList tbody').append(html);
				//提示添加成功
				$yt_alert_Model.prompt('填写的信息已成功加入到列表');
			}
			$("#busiUserInfo ul li").removeClass("tr-check");
			$("#busiUserInfo").removeClass("check");
			//清空存储出差人的数据
			me.selUsersName = "";
			me.selUsersCode = "";
			//显示自动计算文字
			$('.auto-font').show();
			//隐藏出差人数
			$('.model-user-num-show').hide();
			me.clearAlert($('#busiPlanEditModel'));
			$('#modelBusiAddres').html('<option value="">请输入</option>');
			//更新费用明细弹框中的出差人列表
			//me.getModelUsersInfo();
			//更新补助明细内容
			me.setSubsidyList();
			//获取住宿地点
			me.setAddress();
		}

	},
	/**
	 * 修改行程明细列表时重新设置弹出框数据
	 * @param {Object} tr
	 */
	setTripAlertData: function(tr) {
		//显示出行程计划编辑框
		var planModel = $("#busiPlanEditModel");
		//出差类型
		var modelBusiType = $('#modelBusiType option[value="' + tr.attr('busicode') + '"]').attr('selected', true);
		$('#modelBusiType').niceSelect();
		//开始日期
		var tdStartDate = $('#tdStartDate').val(tr.find('.sdate').text());
		//结束日期
		var tdEndDate = $('#tdEndDate').val(tr.find('.edate').text());
		//出差地点
		var modelBusiAddres = $('#modelBusiAddres').html('<option value="' + tr.find('.address').attr('val') + '">' + tr.find('.address').text() + '</option>');
		//出差人
		var busiUsersName = $("#modelBusiUser").val(tr.find('.uname').text()); //出差人名称
		var busiUsersCode = $("#modelUserCodes").val(tr.attr('usercode')); //出差人code
		//出差人数
		var busiNum = $("#busiPlanEditModel .auto-font").text(tr.find('.numof').text()); //出差人数
		//接待方承担费用
		var rececode = tr.attr('rececode');
		//拆分字符串
		var receList = rececode.split(',');
		if(receList.length > 1){
			//循环选择
			$.each(receList, function(i, n) {
				if(n) {
					planModel.find('.check-label input[value="' + n + '"]').setCheckBoxState('check');
				}
			});
			$('#busiPlanEditModel .bear-expense').show();
		}
		this.getPlanBusiAddress($("#modelBusiAddres"));

	},
	/**
	 * 新增差旅费用明细列表
	 * @param {Object} tr
	 */
	appendCostApplyList: function(tabFlag, tr) {
		var me = this;
		if(tabFlag == 0) {
			//调用获取获取拼接交通费数据方法
			me.getTrafficCostFormInfo(tr);
		}
		if(tabFlag == 1) {
			//调用获取获取拼接住宿费数据方法
			me.getHotelFormInfo(tr);
		}
		if(tabFlag == 2) {
			//调用获取获取拼接其他费数据方法
			me.getOtherCostFormInfo(tr);
		}
	},
	/**
	 * 获取拼接交通费数据方法
	 */
	getTrafficCostFormInfo: function(tr) {
		var me = this;
		//获取交通费模块对象
		var trabfficObj = $(".traffic-form");
		//调用公用的拼接合计行方法
		sysCommon.createSumTr(0);
		//出差人
		var tripUser = trabfficObj.find("#model-trip-user option:selected").text();
		var userCode = trabfficObj.find("#model-trip-user option:selected").val();
		//出差人级别
		var level = trabfficObj.find("#model-trip-user option:selected").attr("data-level");
		var levelCode = trabfficObj.find("#model-trip-user option:selected").attr("data-level-code");
		//出发日期
		var trafficStartTime = $('#traffic-start-time').val();
		//到达日期
		var trafficEndTime = $('#traffic-end-time').val();
		//出发地点
		var fromcityName = $('#fromcity').next().find('.search-current').val();
		var fromcity = $('#fromcity option:selected').val();
		//到达地点
		var tocityName = $('#tocity option:selected').text();
		var tocity = $('#tocity option:selected').val();
		//特殊说明
		var specialRemark = $('#special-remark').val();
		//获取交通工具文本信息
		var vehicle = "";
		var vehicleCode = "";
		vehicleCode = trabfficObj.find(".vehicle-sel").val();
		var vehicleChildCode = "";
		vehicleChildCode = (trabfficObj.find(".vehicle-two-sel").val() == null ? "" : trabfficObj.find(".vehicle-two-sel").val());
		//判断如果二级菜单没有选中
		if($(".vehicle-two-sel").val() != "" && $(".vehicle-two-sel").val() != null) {
			vehicle = trabfficObj.find(".vehicle-sel option:selected").text() + trabfficObj.find(".vehicle-two-sel option:selected").text();
		} else {
			vehicle = trabfficObj.find(".vehicle-sel option:selected").text();
		}

		//城市交通费
		var cityMoney = trabfficObj.find(".city-cost-input").val();
		//拼接交通费表格数据
		var trafficCostStr = '<tr>' +
			'<td><span>' + tripUser + '</span>' +
			'<input type="hidden" data-val="travelPersonnel" class="hid-traf-users" value="' + userCode + '" risk-code-val="trafficBusiUsers"/>' +
			'</td><td><span>' + level + '</span><input type="hidden" class="hid-level-code" value="' + levelCode + '" risk-code-val="trafficBusiUsersLevel"/></td>' +
			'<td data-text="goTime"><span risk-code-val="traExpStartDate">' + trafficStartTime + '</span></td>' +
			'<td><input data-val="goAddress" type="hidden" value="' + fromcity + '"><span data-text="goAddressName">' + fromcityName + '</span></td>' +
			'<td data-text="arrivalTime"><span  risk-code-val="traExpEndDate">' + trafficEndTime + '</span></td>' +
			'<td><input data-val="arrivalAddress" type="hidden" value="' + tocity + '"> <span data-text="arrivalAddressName">' + tocityName + '</span></td>' +
			'<td><span data-text="vehicle">' + vehicle + '</span>' +
			'<input type="hidden" class="hid-vehicle" value="' + vehicleCode + '" risk-code-val="vehicleParent"/>' +
			'<input type="hidden" class="hid-child-code" value="' + vehicleChildCode + '"  risk-code-val="vehicleChild"/></td>' +
			'<td class="font-right money-td" data-text="crafare" risk-code-val="cityTrafficCost">' + (cityMoney == '' ? "--" : $yt_baseElement.fmMoney(cityMoney)) + '</td>' +
			'<td class="text-overflow-sty" data-text="remarks" title="' + specialRemark + '">' + (specialRemark == "" ? "无" : specialRemark) + '</td>' +
			'<td>' +
			'<input type="hidden" class="hid-cost-type" value="0"/>' +
			'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>' +
			'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>' +
			'</td></tr>';

		//存在为替换
		if(tr) {
			tr.replaceWith(trafficCostStr);
			//隐藏弹出框
			me.hideCostApplyAlert();
		} else {
			//不存在新增
			$("#traffic-list-info tbody .total-last-tr").before(trafficCostStr);
			//提示保存至列表成功
			$yt_alert_Model.prompt('填写的信息已成功加入到列表');
		}

		//调用合计方法
		me.updateMoneySum(0);
		//清空弹框内数据
		//me.clearAlert($('#costApplyAlert .traffic-form'));
		//调用关闭可编辑弹出框方法
		me.clearFormData();
		//改变风险灯图标绿灯
		//$("#traffic-list-info").parent().find(".cost-list-title .risk-img").attr("src", busiTripApply.riskViaImg);

	},
	/***
	 * 设置交通费弹框数据
	 * @param {Object} tr
	 */
	setFormInfo: function(thisTr) {
		var me = this;
		//获取费用类型0.交通1.住宿2.其他
		var costType = $(thisTr).find(".hid-cost-type").val();
		//交通费
		if(costType == 0) {
			//获取出差人的code
			var busiUser = $(thisTr).find("td:eq(0) .hid-traf-users").val();
			//获取出发日期
			var startDate = $(thisTr).find("td:eq(2)").text();
			//获取出发地点
			var startAddre = $(thisTr).find("td:eq(3)").text();
			var startVal = $(thisTr).find("td:eq(3)").attr('val');
			//到达日期
			var endDate = $(thisTr).find("td:eq(4)").text();
			//获取到达地点
			var endAddre = $(thisTr).find("td:eq(5)").text();
			var endVal = $(thisTr).find("td:eq(5)").attr('val');
			//获取交通工具code
			var vehicles = 0;
			if($(thisTr).find("td:eq(6) input:eq(0)").val().indexOf(".") != -1) {
				vehicles = $(thisTr).find("td:eq(6) input:eq(0)").val().split(".");
			}
			var vehicle = "";
			//获取子级交通工具code
			var vehicleChildCode = "";
			if(vehicles.length > 0) {
				vehicle = vehicles[1];
				vehicleChildCode = vehicles[2];
			} else {
				vehicle = $(thisTr).find("td:eq(6) input:eq(0)").val();
				vehicleChildCode = $(thisTr).find("td:eq(6) .hid-child-code").val();
			}
			//获取城市交通费
			var cityMoney = $(thisTr).find("td:eq(7)").text();
			//获取特殊说明
			var cityMsg = $(thisTr).find("td:eq(8)").text();

			$('#model-trip-user option[value="' + busiUser + '"]').attr("selected", "selected");
			$("#traffic-start-time").val(startDate);
			$("#traffic-end-time").val(endDate);
			$("#fromcity").html('<option value="' + startVal + '">' + startAddre + '</option>');
			$("#tocity").html('<option value="' + endVal + '">' + endAddre + '</option>');
			$('.traffic-form .vehicle-sel option[value="' + vehicle + '"]').attr("selected", "selected");
			if(vehicleChildCode != "") {
				//显示出二级交通工具下拉
				$("#vehicleTwoDiv").css('display', 'inline-block');
				//调用公用方法根据一级交通工具获取二级交通工具
				sysCommon.vechicleChildData(vehicle);
				$('.traffic-form .vehicle-two-sel option[value="' + vehicleChildCode + '"]').attr("selected", "selected");
			}
			$(".traffic-form .city-cost-input").val(cityMoney);
			$("#special-remark").val((cityMsg == "无" ? "" : cityMsg));
			$('#model-trip-user,.traffic-form .vehicle-sel,.traffic-form .vehicle-two-sel').niceSelect();
			//调用获取出差地点方法
			me.getPlanBusiAddress($("#fromcity"));
			me.getPlanBusiAddress($("#tocity"));

			//改变风险灯
			if(vehicle != "" || vehicleChildCode != "") {
				$(".vehicle-sel").parents("td").find(".risk-img").attr("src", me.riskViaImg);
			}
		}
		//住宿费
		if(costType == 1) {
			//获取出差人的code
			var busiUser = $(thisTr).find("td:eq(0) input").val();
			//人均花销
			var dayMoney = $(thisTr).find("td:eq(2)").text();
			//住宿天数
			var hotelDay = $(thisTr).find("td:eq(5)").text();
			//住宿费
			var hotelMoney = $(thisTr).find("td:eq(6)").text();
			//住宿日期
			//var hotelDate = $(thisTr).find("td:eq(2)").text();
			//住宿地点
			var hotelAddress = $(thisTr).find("td:eq(7) input").val();
			//入住日期
			var sDate = $(thisTr).find('.sdate').text();
			$('.hotel-form #hotelDate').val(sDate);
			//离开日期
			var eDate = $(thisTr).find('.edate').text();
			$('.hotel-form #leaveDate').val(eDate);

			hotelAddress = hotelAddress.split("-");
			var hotelAddressName = $(thisTr).find('td:eq(7) span').text().split('-');
			///获取特殊说明
			var textareMsg = $(thisTr).find("td:eq(8)").text();
			$('#hotel-trip-user').val(busiUser);
			//$('#hotel-trip-user option[value="' + busiUser + '"]').attr("selected", "selected");
			$(".hotel-form .hotel-num").text(hotelDay);
			if(hotelAddress.length == 3) {
				$('#hotelParentAddress').html('<option value="' + hotelAddress[0] + '">' + hotelAddressName[0] + '</option>');
				$('#hotelTwoAddres').html('<option value="' + hotelAddress[1] + '">' + hotelAddressName[1] + '</option>');
				$('#hotelChildAddres').html('<option value="' + hotelAddress[2] + '">' + hotelAddressName[2] + '</option>');
				//me.hotelAddressChild(hotelAddress[0], "CITY");
				//me.hotelAddressArea(hotelAddress[1], "AREA");
			} else if(hotelAddress.length == 2) {
				$('#hotelChildAddres').html('<option value="' + hotelAddress[1] + '">' + hotelAddressName[1] + '</option>');
				//me.hotelAddressChild(hotelAddress[0], "CITY");
			}
			//住宿地点选中
			/*$.each(hotelAddress, function(i, n) {
				$('.hotel-addres-sel option[value="' + n + '"]').prop("selected", "selected");
			});*/
			$(".hotel-form .hotel-money").val(hotelMoney);
			$("#peoDayMoney").text(dayMoney);
			//$("#hotelDate").val(hotelDate);
			$(".hotel-form .hotel-msg").val((textareMsg == "无" ? "" : textareMsg));
			me.setAddress();
			$('#hotel-trip-user').niceSelect();
			//调用设置住宿费子级无数据设置禁用方法
			me.hotelChildDisa(hotelAddress[0], "CITY");
			//调用设置住宿费子级无数据设置禁用方法
			me.hotelChildDisa(hotelAddress[1], "AREA");
		}
		//其他费用
		if(costType == 2) {
			//获取费用类型的code
			var costType = $(thisTr).find("td:eq(0) input").val();
			//费用金额
			var costMoney = $(thisTr).find("td:eq(1)").text();
			///获取特殊说明
			var textareMsg = $(thisTr).find("td:eq(2)").text();
			$('#cost-type option[value="' + costType + '"]').attr("selected", "selected");
			$(".other-form .other-money").val(costMoney);
			$(".other-form .other-msg").val((textareMsg == "无" ? "" : textareMsg));
			$('#cost-type').niceSelect();
		}
	},
	/**
	 * 获取拼接住宿费数据方法
	 */
	getHotelFormInfo: function(tr) {
		var me = this;
		//获取交通费模块对象
		var hotelObj = $(".hotel-form");
		//调用公用的拼接合计行方法
		sysCommon.createSumTr(1);
		//出差人
		var tripUser = hotelObj.find("select.hotel-trip-user-sel option:selected").text();
		//出差人级别
		var level = hotelObj.find("select.hotel-trip-user-sel option:selected").attr("data-level");
		//出差人界别code
		var levelCode = hotelObj.find("select.hotel-trip-user-sel option:selected").attr("data-level-code");
		//住宿地址
		var hotelAddress = "";
		var hotelAdressCode = "";
		var hotelParentAdres = hotelObj.find("#hotelParentAddress").next().find('.search-current').val();
		var hotelTwoAdres = hotelObj.find("#hotelTwoAddres").next().find('.search-current').val();
		var hotelChildAdres = hotelObj.find("#hotelChildAddres").next().find('.search-current').val();
		if(hotelTwoAdres == "" || hotelTwoAdres == "请选择") {
			hotelAddress = hotelParentAdres;
			hotelAdressCode = hotelObj.find("#hotelParentAddress").val();
		} else {
			hotelAddress = hotelParentAdres + "-" + hotelTwoAdres + "-" + hotelChildAdres;
			hotelAdressCode = hotelObj.find("#hotelParentAddress").val() + "-" + hotelObj.find("#hotelTwoAddres").val() + "-" + hotelObj.find("#hotelChildAddres").val();
		}
		//入住日期
		var hotelCheckInDate = $("#hotelDate").val();
		//离开日期
		var leaveDate = $("#leaveDate").val();
		//拼接住宿费表格数据
		var hotelCostStr = '<tr>' +
			'<td><span>' + tripUser + '</span>' +
			'<input type="hidden" data-val="travelPersonnel" value="' + hotelObj.find("select.hotel-trip-user-sel").val() + '" risk-code-val="hotelBusiUsers"/>' +
			'</td><td><span>' + level + '</span><input type="hidden" value="' + levelCode + '" risk-code-val="hotelBusiUsersLevel"/></td>' +
			'<td class="font-right"  risk-code-val="costDetailHotelCost"><span>' + $("#peoDayMoney").html() + '</span></td>' +
			'<td  risk-code-val="hotelCheckInDate" class="check-in-date"><span data-text="hotelTime" class="sdate">' + hotelCheckInDate + '</span></td>' +
			'<td class="leave-date"><span data-text="leaveTime" class="edate">' + leaveDate + '</span></td>' +
			'<td data-text="hotelDays">' + hotelObj.find(".hotel-num").text() + '</td>' +
			'<td class="font-right money-td" data-text="hotelExpense"  risk-code-val="hotelCost"><span>' + $yt_baseElement.fmMoney(hotelObj.find(".cost-detail-money").val() || '0') + '</span></td>' +
			'<td><span data-text="hotelAddressName">' + hotelAddress + '</span>' +
			'<input type="hidden" data-val="hotelAddress" value="' + hotelAdressCode + '"/>' +
			'<input type="hidden" risk-code-val="hotelProvinceAddress" value="' + hotelObj.find("#hotelParentAddress").val() + '"/>' +
			'<input type="hidden" risk-code-val="hotelCityAddress" value="' + hotelObj.find("#hotelTwoAddres").val() + '"/>' +
			'<input type="hidden" risk-code-val="hotelHaidianAddress" value="' + hotelObj.find("#hotelChildAddres").val() + '"/>' +
			'</td>' +
			'<td class="text-overflow-sty" data-text="remarks" title="' + hotelObj.find(".hotel-msg").val() + '">' + (hotelObj.find(".hotel-msg").val() == "" ? "无" : hotelObj.find(".hotel-msg").val()) + '</td>' +
			'<td>' +
			'<input type="hidden" class="hid-set-met" data-val="setMethod"/>' +
			'<input type="hidden" class="hid-cost-type" value="1"/>' +
			'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>' +
			'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>' +
			'</td></tr>';

		//存在为替换
		if(tr) {
			tr.replaceWith(hotelCostStr);
			//隐藏弹出框
			me.hideCostApplyAlert();
		} else {
			//不存在新增
			$("#hotel-list-info tbody .total-last-tr").before(hotelCostStr);
			//提示保存至列表成功
			$yt_alert_Model.prompt('填写的信息已成功加入到列表');
		}

		//调用合计方法
		me.updateMoneySum(1);
		//调用公用的清空表单数据方法
		me.clearFormData();
		//改变风险灯图标绿灯
		//$("#hotel-list-info").parent().find(".cost-list-title .risk-img").attr("src", busiTripApply.riskViaImg);
	},
	/**
	 * 获取拼接其他费数据方法
	 */
	getOtherCostFormInfo: function(tr) {
		var me = this;
		//获取交通费模块对象
		var otherObj = $(".other-form");
		//调用公用的拼接合计行方法
		sysCommon.createSumTr(2);
		//费用类型
		var costType = otherObj.find("#cost-type option:selected").text();
		//拼接其他费用表格数据
		var otherCostStr = '<tr>' +
			'<td><span>' + costType + '</span>' +
			'<input type="hidden" data-val="costType" risk-code-val="otherCostType" value="' + otherObj.find("#cost-type").val() + '"/></td>' +
			'<td class="font-right money-td" data-text="reimAmount" risk-code-val="otherCostReimPrice">' + $yt_baseElement.fmMoney(otherObj.find(".other-money").val() || '0') + '</td>' +
			'<td class="text-overflow-sty" data-text="remarks" title="' + otherObj.find(".other-msg").val() + '">' + (otherObj.find(".other-msg").val() == "" ? "无" : otherObj.find(".other-msg").val()) + '</td>' +
			'<td>' +
			'<input type="hidden" class="hid-cost-type" value="2"/>' +
			'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>' +
			'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>' +
			'</td></tr>';

		//存在为替换
		if(tr) {
			tr.replaceWith(otherCostStr);
			//隐藏弹出框
			me.hideCostApplyAlert();
		} else {
			//不存在新增
			$("#other-list-info tbody .total-last-tr").before(otherCostStr);
			//提示保存至列表成功
			$yt_alert_Model.prompt('填写的信息已成功加入到列表');
		}

		//调用合计方法
		me.updateMoneySum(2);
		//调用公用清空表单数据方法
		me.clearFormData();
		//改变风险灯图标绿灯
		//$("#other-list-info").parent().find(".cost-list-title .risk-img").attr("src", me.riskViaImg);
	},
	/**
	 * 设置住宿地点内容
	 */
	setAddress: function() {
		var me = this;
		$.ajax({
			type: "get",
			url: $yt_option.websit_path + 'resources-sasac/js/system/expensesReim/module/reimApply/regionList.json',
			async: false,
			success: function(data) {
				//var dataList = data;
				me.addressList = data;
				me.setAddressSelect();
			}
		});
		//获取热门城市数据
		$.ajax({
			type: "get",
			url: $yt_option.websit_path + 'resources-sasac/js/system/expensesReim/module/reimApply/hotCityList.json',
			async: false,
			success: function(data) {
				me.hotCityList = data;
			}
		});
	},
	/**
	 * 设置住宿地点下拉模糊查询
	 */
	setAddressSelect: function() {
		var me = this;
		//遍历省份
		/*$.each(me.addressList, function(i, n) {
			//省
			if(n.regionLevel == "PROVINCE") {
				$("#hotelParentAddress").append('<option value="' + n.regionCode + '" data-level="' + n.regionLevel + '" >' + n.regionName + '</option>');
			}
		});*/
		$("#hotelParentAddress").niceSelect({
			search: true,
			backFunction: function(text) {
				//回调方法,可以执行模糊查询,也可自行添加操作  
				$("#hotelParentAddress option").remove();
				if(text == "") {
					$("#hotelParentAddress").append('<option value="">请选择</option>');
				}
				//遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
				$.each(me.addressList, function(i, n) {
					if(n.regionName.indexOf(text) != -1 && n.regionLevel == 'PROVINCE') {
						$("#hotelParentAddress").append('<option value="' + n.regionCode + '" data-level="' + n.regionLevel + '" >' + n.regionName + '</option>');
					}
				});
			}
		});
		/**
		 * 
		 * 省份选择操作事件
		 * 
		 */
		$("#hotelParentAddress").off("change").on("change", function() {
			var thisSel = $(this);
			$("#hotelTwoAddres,#hotelChildAddres").html('').append('<option value="">请选择</option>');
			//调用查询地区子级方法
			me.hotelAddressChild(thisSel.val(), "CITY");
		});
		/**
		 * 
		 * 市选择操作事件
		 * 
		 */
		$("#hotelTwoAddres").off("change").on("change", function() {
			var thisSel = $(this);
			$("#hotelChildAddres").html('').append('<option value="">请选择</option>');
			//调用查询地区子级方法
			me.hotelAddressArea(thisSel.val(), "AREA");
		});

		me.getPlanBusiAddress($("#modelBusiAddres"));
	},
	/**
	 * 设置住宿费子级无数据禁用
	 * @param {Object} addressLevel 地区级别
	 */
	hotelChildDisa: function(addressCode, addressLevel) {
		var me = this;
		if(addressLevel == "CITY") {
			//判断二级和三级是否有值,无则禁用
			var disaFlag = true;
			if($("#hotelTwoAddres option").length < 1) {
				$("#hotelTwoAddres,#hotelChildAddres").prop("disabled", "disabled");
				//删除验证的自定义属性
				$("#hotelTwoAddres,#hotelChildAddres").removeAttr("validform");
				//调用清除验证信息方法
				sysCommon.clearValidInfo($("div.hotel-child-addres,div.hotel-two-addres,#hotelTwoAddres,#hotelChildAddres"));
			} else {
				$("#hotelTwoAddres,#hotelChildAddres").prop("disabled", "");
				//添加验证的自定义属性
				$("#hotelTwoAddres").attr("validform", "{isNull:true,changeFlag:true,msg:'请选择市'}");
				$("#hotelChildAddres").attr("validform", "{isNull:true,changeFlag:true,msg:'请选择区'}");
				disaFlag = false;
			}
			me.hotelAddressChild(addressCode, addressLevel);
			me.hotelAddressArea(addressCode, addressLevel);
			if(disaFlag) {
				$("div.hotel-child-addres,div.hotel-two-addres").css("background-color", "#D0D0D0");
			}
		} else if(addressLevel == "AREA") {
			//判断二级和三级是否有值,无则禁用
			var disaFlag = true;
			if($("#hotelChildAddres option").length < 1) {
				$("#hotelChildAddres").prop("disabled", "disabled");
			} else {
				$("#hotelChildAddres").prop("disabled", "");
				disaFlag = false;
			}
			me.hotelAddressArea(addressCode, addressLevel);
			if(disaFlag) {
				$("div.hotel-child-addres").css("background-color", "#D0D0D0");
			}
		}
	},
	/**
	 * 
	 * 获取差旅明细弹出框中的出差人数据
	 * 
	 */
	getModelUsersInfo: function() {
		var me = this;
		//出差人集合
		if(me.usersInfoList != "" && me.usersInfoList != null) {
			me.usersInfoJson = "[" + me.usersInfoList + "]";
			me.usersInfoJson = me.usersInfoJson.substr(0, me.usersInfoJson.length - 2);
			me.usersInfoJson += "]";
		}
		//给差旅申请弹出框中添加出差人
		//option html
		var optionText = '<option value="">请选择</option>';
		$("#model-trip-user,#hotel-trip-user").empty().append(optionText);
		if(me.usersInfoJson != "" && me.usersInfoJson.length > 0) {
			var list = eval("(" + me.usersInfoJson + ")");
			$.each(list, function(i, n) {
				optionText = '<option value="' + n.userItcode + '" data-level="' + n.jobLevelName + '" data-level-code="' + n.jobLevelCode + '">' + n.userName + '</option>';
				$("#model-trip-user,#hotel-trip-user").append(optionText);
			});
		}
		$("#model-trip-user,#hotel-trip-user").niceSelect();
	},
	/**
	 * 设置出差人列表数据
	 */
	setModelUsers: function() {
		//获取行程明细列表中的所有出差人
		var userStr = '';
		var trs = $('#tripList tbody tr');
		trs.each(function(i, n) {
			//对每行的出差人拆分去重
			var ls = $(n).attr('usercode').split(',');
			$.each(ls, function(j, m) {
				if(userStr.indexOf(m) < 0) {
					//拼接出差人
					userStr += m + ',';
				}
			});
		});
		//删除最后一个逗号
		userStr = (userStr.substring(userStr.length - 1) == ',') ? userStr.substring(0, userStr.length - 1) : userStr;
		if(userStr) {
			//获取出差人详细信息
			var userList = sysCommon.getUserAllInfo('', userStr, '');
			//拼接出差人HTML
			var opts = '<option value="">请选择</option>';
			$.each(userList, function(i, n) {
				opts += '<option value="' + n.userItcode + '" data-level="' + n.jobLevelName + '"  data-level-code="' + n.jobLevelCode + '">' + n.userName + '</option>';
			});
			$("#model-trip-user,#hotel-trip-user").html(opts).niceSelect();
		}
	},
	/**
	 * 
	 * 刷新申请预算总金额方法
	 * 
	 */
	updateApplyMeonySum: function() {
		var sumMoney = 0;
		$(".cost-list-model table .money-sum").each(function(i, n) {
			sumMoney += $yt_baseElement.rmoney($(n).text());
		});
		$(".cost-list-model table .city-money-td").each(function(i, n) {
			sumMoney += $yt_baseElement.rmoney($(n).text());
		});
		//补助明细费用
		$('#subsidy-list-info tbody tr:not(.last)').each(function(i, n) {
			sumMoney += $yt_baseElement.rmoney($(n).find('.food').text());
			sumMoney += $yt_baseElement.rmoney($(n).find('.traffic').text());
		});
		//转换总金额格式
		var rMoney = $yt_baseElement.fmMoney(sumMoney);
		$("#applyTotalMoney,.count-val-num").text(rMoney).attr('num', sumMoney);
		//判断当前页面是否包含报销申请页面中,补领金额中的报销金额
		if($("body").find("#reimPrice")) {
			$("#reimPrice").text(rMoney);
			//计算补领金额
			var loanPrice = $("#loanCost").text();
			var replPrice = sumMoney - parseFloat(loanPrice);
			replPrice = $yt_baseElement.fmMoney(replPrice);
			$("#givePrice").text(replPrice);
		}
		if(sumMoney != null && sumMoney != undefined && sumMoney > 0) {
			var sumMoneyLower = arabiaToChinese(rMoney + '');
			$("#TotalMoneyUpper").text(sumMoneyLower);
		} else {
			$("#applyTotalMoney").text("0.00");
		}
		//赋值借款单中的报销总额
		$('#amountTotalMoney').text(rMoney).attr('num', sumMoney);
		//获取借款单可用余额
		var outstandingBalance = $yt_baseElement.rmoney($('#outstandingBalance').text());
		//冲销金额：只读信息，读取逻辑：如果报销金额小于借款单可用余额，则读取报销总额；如果报销金额大于等于借款单可用余额，则读取借款单可用余额
		var writeOffAmount = sumMoney >= outstandingBalance ? outstandingBalance : sumMoney;
		$('#writeOffAmount,#outWriteAmount').text($yt_baseElement.fmMoney(writeOffAmount));
		// 补领金额：计算项，计算逻辑：如果报销金额小于借款单可用余额，则为0.00；如果报销金额大于等于借款单可用余额，则报销金额-冲销金额的金额值
		var replaceMoney = sumMoney >= outstandingBalance ? sumMoney - writeOffAmount : '0';
		/*if(replaceMoney <= 0) {
			//补领金额是零的时候 ，补领方式 几个输入框禁用，默认值都是0.
			$('#officialCard,#cash,#cheque').val('0').attr('disabled', true);
			$('.amount-table .total').text('0');
		} else {
			$('#officialCard,#cash,#cheque').attr('disabled', false);
		}*/
		$('#replaceMoney').text($yt_baseElement.fmMoney(replaceMoney));
		//报销后借款单余额：计算项，计算逻辑：如果报销金额小于借款单可用余额，则借款单可用余额-报销金额；如果报销金额大于风雨借款单可用余额；则显示为0.00
		$('#balanceMoney').text($yt_baseElement.fmMoney(sumMoney < outstandingBalance ? outstandingBalance - sumMoney : '0'));

	},
	/**
	 * 
	 * 表格金额合计更新
	 * 
	 * @param {Object} thisTab费用表格标识0交通费1.住宿费2.其他费用3补助
	 * 
	 * 
	 */
	updateMoneySum: function(thisTab) {
		var me = this;
		//thisTab参数0交通费1.住宿费2.其他费用3补助
		var moenySum = 0.00;
		if(thisTab == 0) {
			$("#traffic-list-info tbody .money-td").each(function(i, n) {
				moenySum += parseFloat($yt_baseElement.rmoney($(n).text()));
			});
			moenySum = $yt_baseElement.fmMoney(moenySum);
			if(moenySum != undefined && $yt_baseElement.rmoney(moenySum) > 0) {
				$("#traffic-list-info tbody .money-sum").text(moenySum);
			} else {
				$("#traffic-list-info tbody .money-sum").text("0.00");
			}
		}
		if(thisTab == 1) {
			$("#hotel-list-info tbody .money-td").each(function(i, n) {
				moenySum += parseFloat($yt_baseElement.rmoney($(n).text()));
			});
			moenySum = $yt_baseElement.fmMoney(moenySum);
			if(moenySum != undefined && $yt_baseElement.rmoney(moenySum) > 0) {
				$("#hotel-list-info tbody .money-sum").text(moenySum);
			} else {
				$("#hotel-list-info tbody .money-sum").text("0.00");
			}
		}
		if(thisTab == 2) {
			$("#other-list-info tbody .money-td").each(function(i, n) {
				moenySum += parseFloat($yt_baseElement.rmoney($(n).text()));
			});
			moenySum = $yt_baseElement.fmMoney(moenySum);
			if(moenySum != undefined && $yt_baseElement.rmoney(moenySum) > 0) {
				$("#other-list-info tbody .money-sum").text(moenySum);
			} else {
				$("#other-list-info tbody .money-sum").text("0.00");
			}
		}
		if(thisTab == 3) {
			$("#subsidy-list-info tbody .food-money").each(function(i, n) {
				moenySum += parseFloat($yt_baseElement.rmoney($(n).text()));
			});
			moenySum = $yt_baseElement.fmMoney(moenySum);
			if(moenySum != undefined && $yt_baseElement.rmoney(moenySum) > 0) {
				$("#subsidy-list-info tbody .money-sum").text(moenySum);
			} else {
				$("#subsidy-list-info tbody .money-sum").text("0.00");
			}
			var cityMoneySum = 0.00;
			$("#subsidy-list-info tbody .city-money").each(function(i, n) {
				cityMoneySum += parseFloat($yt_baseElement.rmoney($(n).text()));
			});
			cityMoneySum = $yt_baseElement.fmMoney(cityMoneySum);
			if(cityMoneySum != undefined && $yt_baseElement.rmoney(cityMoneySum) > 0) {
				$("#subsidy-list-info tbody .city-money-td").text(cityMoneySum);
			} else {
				$("#subsidy-list-info tbody .city-money-td").text("0.00");
			}
		}
		//调用刷新申请总预算金额的方法
		me.updateApplyMeonySum();
	},
	/**
	 * 设置补助明细的列表信息
	 * 
	 */
	setSubsidyList: function() {
		var me = this;
		//获取行程明细列表中的所有出差人
		var userStr = '';
		var trs = $('#tripList tbody tr');
		trs.each(function(i, n) {
			//对每行的出差人拆分去重
			var ls = $(n).attr('usercode').split(',');
			$.each(ls, function(j, m) {
				if(userStr.indexOf(m) < 0) {
					//拼接出差人
					userStr += m + ',';
				}
			});
		});
		//删除最后一个逗号
		userStr = (userStr.substring(userStr.length - 1) == ',') ? userStr.substring(0, userStr.length - 1) : userStr;
		//获取出差人详细信息
		var userList = sysCommon.getUserAllInfo('', userStr, '');
		var html = '';
		$.each(userList, function(i, n) {
			html += '<tr class="' + n.userItcode + '" code="' + n.userItcode + '"><td><div class="user" code="' + n.userItcode + '">' + n.userName + '</div></td><td><div class="lv">' + n.jobLevelName + '</div></td><td><div class="subsidy-num">0</div></td><td><div style="text-align:right;" class="food">0.00</div></td><td><div  style="text-align:right;" class="traffic">0.00</div></td><td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td></tr>';
		});
		html += '<tr class="last"><td>合计</td><td></td><td></td><td class="total-food"  style="text-align:right;">0.00</td><td class="total-traffic"  style="text-align:right;">0.00</td><td></td></tr>';
		//转换为jquery对象进行操作
		var jqHtml = $(html);

		//对补助金额明细中的金额天数 进行复制计算
		var code = '',
			tr = [],
			jqTr = [],
			day = 0,
			totalFood = 0,
			totalTraffic = 0;
		$.each(trs, function(i, n) {
			//当前行
			tr = $(n);
			//当前行的出差人code
			codeList = tr.attr('usercode').length > 0 ? tr.attr('usercode').split(',') : [];
			//获得当前行的全员出差天数
			day = +tr.find('.day').text();
			//获得当前行的所有人员 
			$.each(codeList, function(j, m) {
				//获取当前人员所在补助列表的行
				jqTr = jqHtml.siblings('[code="' + m + '"]');
				if(jqTr.length > 0) {
					//当前人员的天数计算 存在则累加
					var d = +(jqTr.find('.subsidy-num').text()) + day;
					jqTr.find('.subsidy-num').text(d);
					//伙食补助费
					jqTr.find('.food').text($yt_baseElement.fmMoney(d * 100)).attr('num', d * 100);
					//城市内交通费
					jqTr.find('.traffic').text($yt_baseElement.fmMoney(d * 80)).attr('num', d * 80);
				}
			});
		});

		//赋值总金额
		jqHtml.find('.total-food').text($yt_baseElement.fmMoney(totalFood)).attr('num', totalFood);
		jqHtml.find('.total-traffic').text($yt_baseElement.fmMoney(totalTraffic)).attr('num', totalTraffic);

		//添加页面代码
		$('#subsidy-list-info tbody').html(jqHtml);
		//设置合计金额
		me.setSubsidyTotal();
		//计算总金额
		me.updateMoneySum();

	},
	appendSubdisyList: function(tr) {
		var me = this;
		//出差人
		var subsidyBusinUser = $('#subsidyBusinUser').text();
		//级别
		var subsidyBusinLevel = $('#subsidyBusinLevel').text();
		//补助天数
		var subsidiesDays = $('#subsidiesDays').val();
		//伙食补助费
		var subsidiesFood = $('#subsidiesFood').val();
		//室内交通补助
		var subsidiesTraffic = $('#subsidiesTraffic').val();
		tr.find('.subsidy-num').text(subsidiesDays);
		tr.find('.food').text(subsidiesFood);
		tr.find('.traffic').text(subsidiesTraffic);
		//设置合计金额
		me.setSubsidyTotal();
		//计算总金额
		me.updateMoneySum();
		me.hideSubsidiesAlert();
	},
	/**
	 * 设置补助列表的合计金额
	 */
	setSubsidyTotal: function() {
		var trs = $('#subsidy-list-info tbody tr:not(.last)');
		//伙食补助费合计
		var totalFood = 0,
			//交通补助费合计
			totalTraffic = 0,
			tr = [];
		$.each(trs, function(i, n) {
			tr = $(n);
			totalFood += +($yt_baseElement.rmoney(tr.find('.food').text()));
			totalTraffic += +($yt_baseElement.rmoney(tr.find('.traffic').text()));
		});
		$('#subsidy-list-info tbody .total-food').text($yt_baseElement.fmMoney(totalFood)).attr('num', totalFood);
		$('#subsidy-list-info tbody .total-traffic').text($yt_baseElement.fmMoney(totalTraffic)).attr('num', totalTraffic);
	},
	/**
	 * 
	 * 清空差旅报销明细弹出框中表单数据
	 * 
	 */
	clearFormData: function() {
		var me = this;
		//获取弹出框对象
		var modelObj = $("#costApplyAlert");
		//清空输入框文本域内容
		$(".traffic-form input:not(.hid-risk-code),.hotel-form input:not(.hid-risk-code),.other-form input:not(.hid-risk-code)").val('');
		modelObj.find("textarea").val('');
		modelObj.find("select").each(function(i, n) {
			$(n).find("option:eq(0)").attr("selected", "selected");
		});
		//交通费二级菜单隐藏
		$("#vehicleTwoDiv").hide();
		//清空住宿费二级三级地点下拉列表
		modelObj.find("#hotelParentAddress,#hotelTwoAddres,#hotelChildAddres,#fromcity,#tocity").html('<option value="">请选择</option>');
		modelObj.find("#fromcity,#tocity").html('<option value="">请输入</option>');
		//初始化下拉列表
		modelObj.find("select").niceSelect();
		//入住天数默认提示信息
		modelObj.find(".hotel-num").text("自动计算").css("color", "#999999");
		//住宿费平均数
		modelObj.find("#peoDayMoney").text("0.00");
		//入住天数
		modelObj.find("#hotelDay").text("*");
		//tab标签初始
		$("#costApplyAlert .cost-type-tab ul li").removeClass("tab-check");
		$("#costApplyAlert .cost-type-tab ul li:eq(0)").addClass("tab-check");
		$(".traffic-form").show();
		$(".hotel-form,.other-form").hide();
		//显示加入列表按钮,隐藏确定按钮
		$("#model-add-list-btn").show();
		//显示确定按钮
		$("#model-sure-btn").hide();
		//将费用明细中的风险灯都改为红色
		//modelObj.find(".risk-img").attr("src", sysCommon.riskExcMark);
		//清空验证信息
		modelObj.find(".valid-font").text("");
		modelObj.find(".valid-hint").removeClass("valid-hint");
		//调用获取出差地点方法
		me.setAddress();
		me.getPlanBusiAddress($("#fromcity"));
		me.getPlanBusiAddress($("#tocity"));
	},
	/**
	 *  行程表单出差地点事件
	 * @param {Object} labelObj 当前标签对象
	 */
	getPlanBusiAddress: function(labelObj) {
		var me = this;
		/**
		 * 
		 * 行程表单中出差地点
		 * 
		 */
		//4.初始化调用插件刷新方法  
		$(labelObj).niceSelect({
			search: true,
			backFunction: function(text) {
				//回调方法,可以执行模糊查询,也可自行添加操作  
				$(labelObj).find("option").remove();
				var opt = '';
				//遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
				//opt += '<option   disabled="disabled">支持模糊搜索省/市/区</option>';
				if(text == "") {
					opt += '<option value="" disabled="disabled">热门城市</option>';
					//先遍历所有的热门城市
					$.each(me.hotCityList, function(i, n) {
						//行程中的出差地点
						opt += '<option value="' + n.regionCode + '" data-level="' + n.regionLevel + '" data-name="' + n.regionName + '">' + n.regionName + '/' + n.regionMergerName + '</option>';
					});
				} else {
					//遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
					$.each(me.addressList, function(i, n) {
						//名称模糊查询
						if(n.regionName.indexOf(text) != -1) {
							opt += '<option value="' + n.regionCode + '" data-level="' + n.regionLevel + '" data-name="' + n.regionName + '">' + n.regionName + '/' + n.regionMergerName + '</option>';
						}
						//拼音模糊查询
						if(n.regionNamePinYin.indexOf(text) != -1) {
							opt += '<option value="' + n.regionCode + '" data-level="' + n.regionLevel + '" data-name="' + n.regionName + '">' + n.regionName + '/' + n.regionMergerName + '</option>';
						}
					});
				}
				$(labelObj).append(opt);
			}
		});
		//可搜索输入框失去焦点事件
		$(labelObj).next("div.nice-select").find(".search-current").blur(function(){
			if($(this).val() == ""){
				$(this).val("请输入");
			}
		});
	},
	/**
	 * 清空表单内数据
	 * @param {Object} obj
	 */
	clearAlert: function(obj) {
		//取得所有select
		var selects = obj.find('select');
		//循环重置
		$.each(selects, function(i, n) {
			$(n).find('option:eq(0)').attr('selected', true);
		});
		selects.niceSelect();
		//输入框
		var inputs = obj.find('input:not(input[type="radio"],input[type="checkbox"])');
		inputs.val('');
		//单选
		/*var radios = obj.find('input[type="radio"]');
		$.each(radios, function(i, n) {
			$(n).setRadioState('uncheck');
		});*/
		//复选
		var checks = obj.find('input[type="checkbox"]');
		$.each(checks, function(i, n) {
			$(n).setCheckBoxState('uncheck');
		});
		//文本域
		var textareas = obj.find('textarea');
		textareas.val('');
	},
	/**
	 * 出差人弹出框操作事件
	 * @param {Object} busiInputObj  出差人输入框
	 * @param {Object} autoFontObj   自动计算字样
	 * @param {Object} userNumObj    人数字段
	 * @param {Object} clickFlag     点击标识
	 */
	busiTripUserModelEvent: function(busiInputObj, autoFontObj, userNumObj, clickFlag) {
		var me = this;
		//获取弹出框对象
		var busiTripUserModel = $("#busiTripUserModel");
		/**
		 * 查询按钮点击事件
		 */
		$("#searchUser").off().on("click", function() {
			//调用获取出差人列表方法
			me.getBusiTripUsersList($("#userPram").val());
		});
		/**
		 * 
		 * 查询输入框方法
		 * 
		 */
		$("#userPram").on("keyup", function() {
			//调用获取出差人列表方法
			me.getBusiTripUsersList($(this).val());
		});
		/**
		 * 单选一行数据
		 */
		$("#busiUserInfo ul li").off("click").on("click", function() {
			//出差人对象数据
			var usersDatas = "";
			//判断是否选中过
			if($(this).hasClass("tr-check")) {
				$(this).removeClass("tr-check");
				me.selUsersName = "";
				me.selUsersCode = "";
				//清空存储出差人的数据
				//busiTripApply.usersInfoList = "";
				//busiTripApply.usersInfoJson = "";
				$("#busiUserInfo ul li.tr-check").each(function(i, n) {
					usersDatas = $(this).data("userData");
					me.selUsersName += usersDatas.userName + "、";
					me.selUsersCode += usersDatas.userItcode + ",";
				});
			} else {
				$(this).addClass("tr-check");
				usersDatas = $(this).data("userData");
				me.selUsersName += usersDatas.userName + "、";
				me.selUsersCode += usersDatas.userItcode + ",";
				//去重出差人操作
				var checkUsersCodes = "";
				//遍历表格中的数据,
				$("#tripList tbody .hid-user-code").each(function() {
					checkUsersCodes += $(this).val() + ",";
				});
				var selUsersCode = "," + usersDatas.userItcode + ",";
				if(checkUsersCodes != "" && checkUsersCodes != undefined) {
					checkUsersCodes = "," + checkUsersCodes;
				}
				if(checkUsersCodes.indexOf(selUsersCode) < 0) {
					//拼接出差人集合
					var userLevel = usersDatas.jobLevelName == "--" ? "" : usersDatas.jobLevelName;
					me.usersInfoList = me.usersInfoList + '{"userItcode":"' + usersDatas.userItcode + '","jobLevelName":"' + usersDatas.jobLevelName + '","userName":"' + usersDatas.userName + '"},';
				}

			}
			var selTr = $("#busiUserInfo ul li.tr-check");
			if(selTr != "" && selTr.length > 0) {
				var selUser = "";
				var userCode = "";
				//获取选中出差人和code值
				selUser = me.selUsersName.substring(0, me.selUsersName.length - 1);
				userCode = me.selUsersCode.substring(0, me.selUsersCode.length - 1);

				$(busiInputObj).val(selUser);
				$(busiInputObj).prev("input[type=hidden]").val(userCode);
				//隐藏自动计算文本
				$(autoFontObj).hide();
				//显示出差人
				$(userNumObj).show();
				var userNums = selUser.split("、");
				//出差人数赋值
				$(userNumObj).find(".users-num").text(userNums.length);
				//调用清除验证信息方法
				sysCommon.clearValidInfo(busiInputObj);
				//显示清空按钮
				$("#clearUser").show();
			} else {
				$(busiInputObj).val('');
				$(busiInputObj).prev("input[type=hidden]").val('');
				//显示自动计算文本
				$(autoFontObj).show();
				//隐藏出差人数
				$(userNumObj).hide();
				//出差人数赋值
				$(userNumObj).find(".users-num").text(0);
				//添加验证信息方法
				$(busiInputObj).next(".valid-font").text("请选择出差人");
				$(busiInputObj).addClass("valid-hint");
				//清空存储出差人的数据
				me.selUsersName = "";
				me.selUsersCode = "";
				me.usersInfoList = "";
				me.usersInfoJson = "";
				//初始化
				var optionText = '<option value="">请选择</option>';
				//$("#model-trip-user,#hotel-trip-user").empty().append(optionText);
				//$("#model-trip-user,#hotel-trip-user").niceSelect();
				//隐藏清空按钮
				$("#clearUser").hide();
			}
		});
		/**
		 * 
		 * 清空按钮点击事件
		 * 
		 */
		$("#clearUser").click(function() {
			$(busiInputObj).val('');
			$(busiInputObj).prev("input[type=hidden]").val('');
			//显示自动计算文本
			$(autoFontObj).show();
			//隐藏出差人数
			$(userNumObj).hide();
			//出差人数赋值
			$(userNumObj).find(".users-num").text(0);
			//添加验证信息方法
			$(busiInputObj).next(".valid-font").text("请选择出差人");
			$(busiInputObj).addClass("valid-hint");
			//清空存储出差人的数据
			me.selUsersName = "";
			me.selUsersCode = "";
			me.usersInfoList = "";
			me.usersInfoJson = "";
			//初始化
			var optionText = '<option value="">请选择</option>';
			//$("#model-trip-user,#hotel-trip-user").empty().append(optionText);
			//$("#model-trip-user,#hotel-trip-user").niceSelect();

			//清空出差人下拉选中的数据
			$("#busiUserInfo ul li").removeClass("tr-check");
		});
		//隐藏
		$("#busiUserInfo").mouseleave(function() {
			$(this).hide();
			$(this).addClass("check");
		});
	},
	/**
	 * 获取出差人信息
	 * @param {Object} keyword
	 */
	getBusiTripUsersList: function(keyword) {
		var me = this;
		$.ajax({
			type: "post",
			url: 'user/userInfo/getAllUserInfoToPage', //ajax访问路径  
			async: true,
			data: {
				params: keyword,
				pageIndex: 1,
				pageNum: 99999 //每页显示条数  
			},
			success: function(data) {
				if(data.flag == 0) {
					//先清空出差人下拉列表中的数据
					$("#busiUserInfo ul").empty();
					var liStr = "";
					var opts = '';
					if(data.data.rows.length > 0) {
						me.payeeUserList = data.data.rows;
						$.each(data.data.rows, function(i, n) {
							liStr = $('<li>' + n.userName + '/' + n.deptName + '</li>');
							opts += '<option value="' + n.userItcode + '">' + n.userName + '</option>';
							//存储当前出差人的数据
							liStr.data("userData", n);
							$("#busiUserInfo ul").append(liStr);
						});
						//判断出差人隐藏的code值是否有值
						if($("#modelUserCodes").val() != "") {
							var usersCodes = $("#modelUserCodes").val().split(",");
							$("#busiUserInfo ul li").each(function(i, t) {
								$.each(usersCodes, function(i, l) {
									if($(t).data("userData").userItcode == l) {
										$(t).addClass("tr-check");
									}
								});
							});
						}
						//调用弹出框中操作事件方法
						me.busiTripUserModelEvent($("#modelBusiUser"), $("#busiPlanEditModel .auto-font"), $(".model-user-num-show"), 1);
						//设置收款人下拉列表
						me.setPayeeNameSelect();
					} else {
						$("#busiUserInfo ul").append('<li style="text-align: center;">暂无数据</li>');
					}
				}
			}
		});
	},
	/**
	 * 获取数据字典
	 */
	getDictInfoByTypeCode: function() {
		$.ajax({
			type: "post",
			url: "basicconfig/dictInfo/getDictInfoByTypeCode",
			async: true,
			data: {
				dictTypeCode: 'ACTIVITY_PRO,SPECIFIC_COST_TYPE,TRAVEL_TYPE,VEHICIE_CODE,HOTEL_ADDRESS,COST_TYPE'
			},
			success: function(data) {
				//获取数据list
				var list = data.data || [];
				//初始化HTML文本
				var start = '<option value="">请选择</option>',
					optone = start,
					opttwo = start,
					travelType = start,
					vehicieCode = start,
					hotel = start,
					cost = start;
				//循环添加文本
				$.each(list, function(i, n) {
					if(n.dictTypeCode == 'ACTIVITY_PRO') {
						//公务活动项目
						optone += '<option value="' + n.value + '">' + n.disvalue + '</option>';
					} else if(n.dictTypeCode == 'SPECIFIC_COST_TYPE') {
						//具体费用
						opttwo += '<option value="' + n.value + '">' + n.disvalue + '</option>';
					} else if(n.dictTypeCode == 'TRAVEL_TYPE') {
						//出差类型
						travelType += '<option value="' + n.value + '">' + n.disvalue + '</option>';
					} else if(n.dictTypeCode == 'VEHICIE_CODE') {
						//交通工具
						vehicieCode += '<option value="' + n.value + '">' + n.disvalue + '</option>';
					} else if(n.dictTypeCode == 'HOTEL_ADDRESS') {
						//住宿地点
						hotel += '<option value="' + n.value + '">' + n.disvalue + '</option>';
					} else if(n.dictTypeCode == 'COST_TYPE') {
						//其他费用类型
						cost += '<option value="' + n.value + '">' + n.disvalue + '</option>';
					}
				});
				//替换页面代码
				$('#budgetProject').html(optone).niceSelect();
				$('#costBreakdown').html(opttwo).niceSelect();
				//出差类型
				$('#modelBusiType').html(travelType).niceSelect();
				//交通工具
				$('select.vehicle-sel').html(vehicieCode).on("change", function() {
					var selVal = $(this).val();
					//调用公用方法根据一级交通工具获取二级交通工具
					sysCommon.vechicleChildData(selVal);
				}).niceSelect();
				//住宿地点
				//$('#hotelParentAddress').html(travelType).niceSelect();
				//其他费用类型
				$('select.cost-type-sel').html(cost).niceSelect();
			}
		});
	},
	/**
	 * 收款弹框收款人姓名下拉
	 */
	setPayeeNameSelect: function() {
		//	        $.each(serveFunds.payeeUserList, function(i, n) {
		//				$("#payeeName").append('<option value="' + n.userItcode + '">' + n.userName + '</option>');
		//			});
		//			$("#payeeName").append('<option value="">外部人员</option>');
		//收款弹框收款人姓名下拉
		$('#payeeName').html('<option value="">请选择</option>').niceSelect({
			search: true,
			backFunction: function(text) {
				console.log(text);
				//回调方法,可以执行模糊查询,也可自行添加操作  
				$("#payeeName option").remove();
				if(text == "") {
					$("#payeeName").append('<option value="">请选择</option>');
				}
				//遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
				$.each(serveFunds.payeeUserList, function(i, n) {
					if(n.userName.indexOf(text) != -1) {
						$("#payeeName").append('<option jobLevelName="' + n.jobLevelName + '" deptName="' + n.deptName + '" value="' + n.userItcode + '">' + n.userName + '</option>');
					} else {}
				});
				$("#payeeName").append('<option value="external">外部人员</option>');
				if($("#payeeName option").length == 1 && $('payeeName option[value="external"]')) {
					$("#payeeName").append('<option value="noUser">没有找到匹配的单位内部人员</option>');
				}
				if($("#payeeName option").length == 2 && $('payeeName option[value="noUser"]')) {
					$(".display-rank").show();
					$(".pe-department").text("外部人员");
					$(".dis-r").hide();
					$(".where-company").show();
					$(".where-company").attr("validform", "{isNull:true,blurFlag:true,msg:'请输入收款人所在单位'}")
				}
			}
		});
	},
	/**
	 * 住宿费,住宿地点子级获取数据
	 * @param {Object} addressCode  地区code
	 * @param {Object} addressLevel 地区级别
	 */
	hotelAddressChild: function(addressCode, addressLevel) {
		var me = this;
		$("#hotelTwoAddres").niceSelect({
			search: true,
			backFunction: function(text) {
				//回调方法,可以执行模糊查询,也可自行添加操作  
				$("#hotelTwoAddres option").remove();
				if(text == "") {
					$("#hotelTwoAddres").append('<option value="">请选择</option>');
				}
				//遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
				$.each(me.addressList, function(i, n) {
					if(n.regionName.indexOf(text) != -1 && n.parentCode == addressCode && addressLevel == "CITY") {
						//区
						$("#hotelTwoAddres").append('<option value="' + n.regionCode + '">' + n.regionName + '</option>');
					}
				});
			}
		});
		//调用设置住宿费子级无数据禁用
		//me.hotelChildDisa(addressCode, addressLevel);
		//me.hotelAreaDisa(addressCode, addressLevel);
	},
	/**
	 * 住宿费 区数据初始化
	 * @param {Object} addressCode
	 * @param {Object} addressLevel
	 */
	hotelAddressArea: function(addressCode, addressLevel) {
		var me = this;
		$("#hotelChildAddres").niceSelect({
			search: true,
			backFunction: function(text) {
				//回调方法,可以执行模糊查询,也可自行添加操作  
				$("#hotelChildAddres option").remove();
				if(text == "") {
					$("#hotelChildAddres").append('<option value="">请选择</option>');
				}
				//遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
				$.each(me.addressList, function(i, n) {
					if(n.regionName.indexOf(text) != -1 && n.parentCode == addressCode && addressLevel == "AREA") {
						//区
						$("#hotelChildAddres").append('<option value="' + n.regionCode + '">' + n.regionName + '</option>');

					}
				});
			}
		});
		//调用设置住宿费子级无数据禁用
		//me.hotelChildDisa(addressCode, addressLevel);
	},
};

$(function() {
	travelSpending.init();
});