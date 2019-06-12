var addBudgetList = {
	//初始化方法
	init: function() {
		var me = this ;
		me.userInfo();
		//获取跳转页面传过来的pkId
		var pkId = $yt_common.GetQueryString('pkId');
		//判断是否为修改状态
		if(pkId) {
			//修改时获取一条详细信息
			addBudgetList.getBudgetInf();
		} else {
			//获取预算明细
			var budgetSubsidiary = addBudgetList.getBudgetSubsidiary();
			if(budgetSubsidiary != null) {
				$.each(budgetSubsidiary, function(i, n) {
					if(n.costType == 1) {
						$(".teach-related-expenses-table").append('<tr>' +
							'<td align="right"><input type="hidden" value="' + n.costCode + '" class="cost-code">' +
							'<span>' + n.costName + '：</span>' +
							'</td>' +
							'<td>' +
							'<input type="text" class="yt-input budget-cost" data-val="budgetCost" placeholder="请输入"/>' +
							'</td>' +
							'<td style="width: 50px;">' +
							'<span>元</span>' +
							'</td>' +
							'<td>' +
							'<input type="text" class="yt-input according-instructions gist" data-val="accordingInstructions" placeholder="请输入依据说明"/>' +
							'</td>' +
							'</tr>');
					}
					if(n.costType == 2) {
						$(".logistics-related-expenses-table").append('<tr>' +
							'<td align="right"><input type="hidden" value="' + n.costCode + '" class="cost-code">' +
							'<span>' + n.costName + '：</span>' +
							'</td>' +
							'<td>' +
							'<input type="text" class="yt-input budget-cost" data-val="budgetCost" placeholder="请输入"/>' +
							'</td>' +
							'<td style="width: 50px;">' +
							'<span>元</span>' +
							'</td>' +
							'<td>' +
							'<input type="text" class="yt-input according-instructions gist" data-val="accordingInstructions" placeholder="请输入依据说明"/>' +
							'</td>' +
							'</tr>');
					}
				});
			}
		}

		//初始化日期控件
		$(".report-date").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			lowerLimit: "NaN", // 日期下限，默认：NaN(不限制)     
			nowData: true, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd HH:mm",
			callback: function() { // 点击选择日期后的回调函数  
				//alert("您选择的日期是：" + $("#txtDate").val());  
			}
		});
		$(".out-hospital-date").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			lowerLimit: "NaN", // 日期下限，默认：NaN(不限制)     
			nowData: true, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd HH:mm",
			callback: function() { // 点击选择日期后的回调函数  
				//alert("您选择的日期是：" + $("#txtDate").val());  
			}
		});

		//通过projectCode获取其他信息
		$("select.project-code").change(function() {
			var createUserName = $("select.project-code option:selected").attr("createUserName");
			var projectType = $("select.project-code option:selected").attr("projectType");
			var classTeacher = $("select.project-code option:selected").attr("classTeacher");
			var projectHead = $("select.project-code option:selected").attr("projectHead");
			var startDate = $("select.project-code option:selected").attr("startDate");
			var endDate = $("select.project-code option:selected").attr("endDate");
			var traineeTotal = $("select.project-code option:selected").attr("traineeTotal");
			startDate = startDate.split(' ')[0];
			endDate = endDate.split(' ')[0];
			//报道日期为开班日期前一天
			var reportDay = new Date(startDate);
			reportDay.setTime(reportDay.getTime()-24*60*60*1000);
			$('.report-date').val(me.dateFormat('yyyy-MM-dd',reportDay)+' 8:30');
			//离院时间为当天下午五点
			$('.out-hospital-date').val(endDate+' 17:00');
			if(projectType == 2) {
				$(".project-type").text("委托");
			}
			else if(projectType == 3) {
				$(".project-type").text("选学");
			}
			else if(projectType == 4) {
				$(".project-type").text("中组部调训");
			}
			else if(projectType == 5) {
				$(".project-type").text("国资委调训");
			}
			if(classTeacher == "null") {
				$(".class-teacher").text("");
			} else {
				$(".class-teacher").text(classTeacher);
			}
			if(projectHead == "null") {
				$(".project-head").text("");
			} else {
				$(".project-head").text(projectHead);
			}
			traineeTotal == "null"?$(".trainee-total").val(0):$(".trainee-total").val(traineeTotal);
			$(".start-date").text(startDate.split(" ")[0]);
			$(".end-date").text(endDate.split(" ")[0]);
		});

		//获取下一步操作人
		var dealingWithPeople = addBudgetList.getListSelectDealingWithPeople();
		if(dealingWithPeople != null) {
			$.each(dealingWithPeople, function(i, n) {
				$(".dealing-with-people").append('<option value="' + n.userCode + '">' + n.userName + '</option>');
			});
		}
		$(".dealing-with-people").niceSelect();

		//点击保存
		$(".save-budget").click(function() {
			var dataStates = 1;
			addBudgetList.addBudgetListInf(dataStates);
		});
		//点击提交
		$(".submit-budget").click(function() {
			if($('.dealing-with-people').val()==''){
				$yt_alert_Model.prompt('请选择下一步操作人');
			}else{
				var dataStates = 2;
				addBudgetList.addBudgetListInf(dataStates);
			}
		});
		//点击取消
		$(".btn-off").click(function() {
			window.location.href = "/cbead/website/view/projectBudget/budgetList.html";
		});
		//点击返回返回预算列表
		$(".btn-return").click(function() {
			window.location.href = "/cbead/website/view/projectBudget/budgetList.html";
		});
		//格式化金额
		$('.budget-subsidiary').on('blur','.budget-cost',function(){
			$(this).val($yt_baseElement.fmMoney($(this).val(),2));
			addBudgetList.total()
		})
		$('.trainee-total').blur(function(){
			$(this).val($(this).val().replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g, ''));
		})
	},
	//时间转换
	dateFormat:function(fmt, d) { //author: meizz
			var o = {
				"M+": d.getMonth() + 1, //月份 
				"d+": d.getDate(), //日 
				"H+": d.getHours(), //小时 
				"m+": d.getMinutes(), //分 
				"s+": d.getSeconds(), //秒 
				"q+": Math.floor((d.getMonth() + 3) / 3), //季度 
				"S": d.getMilliseconds() //毫秒 
			};
			if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
			for(var k in o)
				if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			return fmt;
		},
	/**
	 * 获取下一步操作人
	 */
	getListSelectDealingWithPeople: function() {
		var list = [];
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/workFlowOperate/getSubmitPageData",
			data: {
				businessCode: "project",
				processInstanceId: "",
				parameters: "",
				versionNum: ""
			},
			async: false,
			success: function(data) {
				$.each(data.data, function(i, n) {
					console.log(n);
					console.log(i);
					for(var k in n) {
						console.log('k', k);
						console.log("n[k]", n[k]);
						list = n[k];
					}
				});
			}
		});
		return list;
	},
	/**
	 * 项目下拉框查询
	 */
	getAddBudgetSelect: function() {
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/reduction/lookForAllProjectBugder",
			data: {
//				searchParameters: "",
				budget:"budget"
			},
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			async: false,
			success: function(data) {
			if(data.flag==0){
				//获取项目下拉框
				var projectSelect = data.data;
				if(projectSelect != null) {
					var userName = $('.hid-user-real-name').text();
					var projectHeadCode;
					var classTeacherCode;
					var projectSellCode;
					var projectAidCode;
					$.each(projectSelect, function(i, n) {
						//项目主任code
						projectHeadCode = n.projectHeadCode;
						//班主任code
						classTeacherCode = n.classTeacherCode;
						//项目销售code
						projectSellCode = n.projectSellCode;
						//项目助理code
						projectAidCode = n.projectAidCode;
						if(projectHeadCode.indexOf(userName) != -1 || classTeacherCode.indexOf(userName) != -1 || projectSellCode.indexOf(userName) != -1 || projectAidCode.indexOf(userName) != -1){
							$(".project-code").append('<option value="' + n.projectCode + '" createUserName="' + n.createUserName + '" projectType="' + n.projectType + '" classTeacher="' + n.classTeacher + '" projectHead="' + n.projectHead + '" startDate="' + n.startDate + '" endDate="' + n.endDate + '" traineeTotal="' + n.budgetTraineeSum + '">' + n.projectName + '</option>');
						}
					});
					$("select.project-code").niceSelect({  
				        search: true,  
				        backFunction: function(text) {  
				            //回调方法,可以执行模糊查询,也可自行添加操作  
				            $("select.project-code option").remove();  
				            if(text == "") {  
				                $("select.project-code").append('<option value="">请选择</option>');  
				            }  
				            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
				            $.each(projectSelect, function(i, n) {  
				                if(n.projectName.indexOf(text) != -1) {  
				                    //项目主任code
									projectHeadCode = n.projectHeadCode;
									//班主任code
									classTeacherCode = n.classTeacherCode;
									//项目销售code
									projectSellCode = n.projectSellCode;
									//项目助理code
									projectAidCode = n.projectAidCode;
										if(projectHeadCode.indexOf(userName) != -1 || classTeacherCode.indexOf(userName) != -1 || projectSellCode.indexOf(userName) != -1 || projectAidCode.indexOf(userName) != -1){
											$("select.project-code").append('<option value="' + n.projectCode + '" createUserName="' + n.createUserName + '" projectType="' + n.projectType + '" classTeacher="' + n.classTeacher + '" projectHead="' + n.projectHead + '" startDate="' + n.startDate + '" endDate="' + n.endDate + '" traineeTotal="' + n.budgetTraineeSum + '">' + n.projectName + '</option>');
										}
				                }
				            });  
				        }  
				    });  
				}	
			}else{
				$yt_baseElement.hideLoading(function (){
							$yt_alert_Model.prompt("项目列表获取失败");
				});
			}
			},
			error:function(data){
				$yt_baseElement.hideLoading(function (){
					$yt_alert_Model.prompt("网络出现问题,请稍后重试");
				});
			}
		});
	},
	/**
	 * 预算明细查询
	 */
	getBudgetSubsidiary: function() {
		$yt_baseElement.showLoading();
		var list = [];
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/projectBudget/getProjectBudgetCostBase",
			data: {

			},
			async: false,
			success: function(data) {
				list = data.data || [];
				$yt_baseElement.hideLoading();
			}
		});
		return list;
	},
	//获取一条数据
	getBudgetInf: function() {
		$yt_baseElement.showLoading();
		var pkId = $yt_common.GetQueryString('pkId');
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "finance/projectBudget/getBeanById", //ajax访问路径  
			data: {
				pkId: pkId
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					$(".budget-inf").setDatas(data.data);
					//从返回的值里给select赋值
					$(".dealing-with-people").setSelectVal(data.data.dealingWithPeople);
					//是否异地培训
					var isOffSiteTraining = data.data.isOffSiteTraining;
					$(".isOffSiteTraining input[value="+isOffSiteTraining+"]").setRadioState("check");
					//适用成本标准
					var costStandard = data.data.costStandard;
					$(".costStandard input[value="+costStandard+"]").setRadioState("check");
					$('.projectName').data('projectCode',data.data.projectCode);
					$('.project-code').parents('td').text(data.data.projectName);
					$('.create-user-name').text(data.data.createUser);
					//通过projectCode获取其他信息
						var createUserName = data.data.createUser;
						var projectType = data.data.projectType;
						var classTeacher = data.data.classTeacherName;
						var projectHead = data.data.projectHeadName;
						var startDate = data.data.startDate;
						var endDate = data.data.endDate;
						var traineeTotal = data.data.traineeTotal;
						startDate = startDate.split(' ')[0];
						endDate = endDate.split(' ')[0];
						if(projectType == 2) {
							$(".project-type").text("委托");
						}
						else if(projectType == 3) {
							$(".project-type").text("选学");
						}
						else if(projectType == 4) {
							$(".project-type").text("中组部调训");
						}else if(projectType == 5) {
							$(".project-type").text("国资委调训");
						}
						if(classTeacher == "null") {
							$(".class-teacher").text("");
						} else {
							$(".class-teacher").text(classTeacher);
						}
						if(projectHead == "null") {
							$(".project-head").text("");
						} else {
							$(".project-head").text(projectHead);
						}
						traineeTotal == "null"?$(".trainee-total").text(0):$(".trainee-total").text(traineeTotal);
						$(".start-date").text(startDate);
						$(".end-date").text(endDate);
					//获取预算明细
					var projectBudgetDetailsArr = $.parseJSON(data.data.projectBudgetDetails);
					var projectBudget = '';
					if(projectBudgetDetailsArr != null) {
						$.each(projectBudgetDetailsArr, function(i, n) {
							n.budgetCost=$yt_baseElement.fmMoney(n.budgetCost,2);
							projectBudget = $('<tr><td align="right"><input type="hidden" value="'+n.costCode+'" class="cost-code"><span>' + n.costName + '：</span></td><td><input type="text" class="yt-input budget-cost" data-val="budgetCost" placeholder="请输入"></td><td style="width: 50px;"><span>元</span></td><td><input type="text" class="yt-input according-instructions gist" data-val="accordingInstructions" placeholder="请输入依据说明"></td></tr>');
							console.log(n);
							projectBudget.setDatas(n);
							if(n.costType == 1) {
								$(".teach-related-expenses-table").append(projectBudget);
							}
							if(n.costType == 2) {
								$(".logistics-related-expenses-table").append(projectBudget);
							}
						});
						addBudgetList.total();
					}
					setTimeout($yt_baseElement.hideLoading(),500);
				} else {
					$yt_alert_Model.prompt("获取失败");
					$yt_baseElement.hideLoading();
				}
			}
		});
	},

	//新增
	addBudgetListInf: function(dataStates) {
		var pkId = $(".pk-id").val();
		var projectCode
		$('.projectName').data('projectCode')==undefined?projectCode=$('.project-code').val():projectCode=$('.projectName').data('projectCode');
		var reportDate = $(".report-date").val();
		var outHospitalDate = $(".out-hospital-date").val();
		var entrustOrgCount = $(".entrust-org-count").val();
		var isOffSiteTraining = $("input.is-off-site-training[type='radio']:checked").val();
		var offSiteTrainingRequirement = $(".offsite-training-requirement").val();
		var costStandard = $("input.cost-standard[type='radio']:checked").val();
		var projectBudgetDetails = "";
		var dealingWithPeople = $(".dealing-with-people").val();

		var projectBudgetDetailsArr = [];
		$(".budget-subsidiary tbody tr").each(function(i, n) {
			costCode =  $(n).find(".cost-code").val();
			budgetCost =  $yt_baseElement.rmoney($(n).find(".budget-cost").val());
			accordingInstructions = $(n).find(".according-instructions").val();

			var arrProjectBudgetDetails = {
				costCode: costCode,
				budgetCost: budgetCost,
				accordingInstructions: accordingInstructions
			}
			projectBudgetDetailsArr.push(arrProjectBudgetDetails);
		});
		var projectBudgetDetails = JSON.stringify(projectBudgetDetailsArr);
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "finance/projectBudget/addOrUpdateBean", //ajax访问路径  
			data: {
				pkId: pkId,
				types: 1,
				projectCode: projectCode,
				reportDate: reportDate,
				outHospitalDate: outHospitalDate,
				entrustOrgCount: entrustOrgCount,
				isOffSiteTraining: isOffSiteTraining,
				offSiteTrainingRequirement: offSiteTrainingRequirement,
				costStandard: costStandard,
				projectBudgetDetails: projectBudgetDetails,
				dataStates: dataStates,
				businessCode: "projectBudget",
				dealingWithPeople: dealingWithPeople,
				opintion: "",
				budgetTraineeSum:$('.trainee-total').val(),
				processInstanceId: "",
				nextCode: "submited"
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt("操作成功");
					window.location.href = "/cbead/website/view/projectBudget/budgetList.html";
				} else {
					$yt_alert_Model.prompt("操作失败");
				}
			}
		});
	},
		//获取登录人信息
	userInfo: function() {
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "uniform/user/getUsersDetails", //ajax访问路径  
			data: {}, //ajax查询访问参数
			async: false,
			success: function(data) {
				$('.hid-user-real-name').text(data.data.userName);
				$('.create-user-name').text(data.data.userRealName);
				addBudgetList.getAddBudgetSelect();
				$yt_baseElement.hideLoading();
			}
		});
	},
	//合计
	total:function(){
		var num =0;
		$.each($('.budget-cost'),function(i,n){
			var val = $(n).val();
			val==''?val='0':val=val;
			num +=Number($yt_baseElement.rmoney(val));
		})
		$('.total').text($yt_baseElement.fmMoney(num,2));
	}
}
$(function() {
	//初始化方法
	addBudgetList.init();

});