var addCostList = {
	//初始化方法
	init: function() {
		$(".process-instance-id").val("");
		//加载项目列表projectName
		addCostList.getProjectInfo();
		//下拉列表刷新
		//$("select").niceSelect();
		//点击下拉框选择项目名称获取数据
		$("select.project-name-select").change(function() {
			if($(this).val() != 0) {
				var costData = $(this).find("option:selected").data("costData");
				if(costData.projectCode != null) {
					$('.project-code').text(costData.projectCode);
				} else {
					$('.project-code').text("");
				}
				if(costData.projectType != null) {
					$('.project-type').text(addCostList.projectTypeInfo(costData.projectType));
				} else {
					$('.project-type').text("");
				}
				if(costData.projectHead != null) {
					$('.project-head').text(costData.projectHead);
				} else {
					$('.project-head').text("");
				}
				if(costData.classTeacher != null) {
					$('.class-teacher').text(costData.classTeacher);
				} else {
					$('.class-teacher').text("");
				}
				if(costData.startDate != null) {
					$('.start-date').text(costData.startDate.split(" ")[0]);
				} else {
					$('.start-date').text("");
				}
				if(costData.endDate != null) {
					$('.end-date').text(costData.endDate.split(" ")[0]);
				} else {
					$('.end-date').text("");
				}

			}
		});
		//获取下一步操作人
		var dealingWithPeople = addCostList.getListSelectDealingWithPeople();
		if(dealingWithPeople != null) {
			$.each(dealingWithPeople, function(i, n) {
				$("select.dealing-with-people").append('<option value="' + n.userCode + '">' + n.userName + '</option>');
			});
			$("select.dealing-with-people").niceSelect();
		};
		
		//点击保存
		$(".save-budget").click(function() {
			
			var projectName = $('.project-name-select').val()
			if(projectName == 0) {
				$yt_alert_Model.prompt("请选择项目");
			} else {
				//声明存储数据的数组
				var reductionDetails = [];
				//声明参数
				var types = "";
				var reductionExemption = "";
				var preReliefStandard = "";
				var postRemissionStandard = "";
				var postRemissionMoney = "";
				var remarks = "";
				//遍历列表得到数据
				if($('.project-tbody').find('tr').hasClass("null")){
				}else{
					$('.project-tbody').find('tr').each(function(i,v) {
						types =$(this).data('types');
						reductionExemption = $(this).find("td.reduction-exemption-td").text();
						preReliefStandard = $(this).find("td.pre-relief-standard-td").text();
						postRemissionStandard = $(this).find("td.post-remission-standard-td").text();
						postRemissionMoney = $(this).find("td.post-remission-money-td").text();
						remarks = $(this).find("td.remarks-td").text();
						//存储数据到数组内
						var reductionDetailsArr = {
							types: types,
							reductionExemption: reductionExemption,
							preReliefStandard: preReliefStandard,
							postRemissionStandard: postRemissionStandard,
							postRemissionMoney: postRemissionMoney,
							remarks: remarks,
						};
						reductionDetails.push(reductionDetailsArr);
					});
				
				}
				var dataStates = 1;
				var pkId = $yt_common.GetQueryString("pkId");
				addCostList.addCostListInfo(dataStates, reductionDetails, pkId);
			}
		});
		//点击提交
		$(".submit-budget").click(function() {
			
			var dealingWithPeople = $(".dealing-with-people").val();
			var projectName = $('.project-name-select').val()
			if(projectName == 0) {
				$yt_alert_Model.prompt("请选择项目");
			} else if(dealingWithPeople == 0) {
				$yt_alert_Model.prompt("请选择下一步操作人");
			} else {
				//声明存储数据的数组
				var reductionDetails = [];
				//声明参数
				var types = "";
				var reductionExemption = "";
				var preReliefStandard = "";
				var postRemissionStandard = "";
				var postRemissionMoney = "";
				var remarks = "";
				//遍历列表得到数据
				if($('.project-tbody').find('tr').hasClass("null")){
				}else{
					$('.project-tbody').find('tr').each(function() {
					types = $(this).data('types');
					reductionExemption = $(this).find("td.reduction-exemption-td").text();
					preReliefStandard = $(this).find("td.pre-relief-standard-td").text();
					postRemissionStandard = $(this).find("td.post-remission-standard-td").text();
					postRemissionMoney = $(this).find("td.post-remission-money-td").text();
					remarks = $(this).find("td.remarks-td").text();
					//存储数据到数组内
					var reductionDetailsArr = {
						types: types,
						reductionExemption: reductionExemption,
						preReliefStandard: $yt_baseElement.rmoney(preReliefStandard),
						postRemissionStandard: $yt_baseElement.rmoney(postRemissionStandard),
						postRemissionMoney: $yt_baseElement.rmoney(postRemissionMoney),
						remarks: remarks,
					};
					reductionDetails.push(reductionDetailsArr);
				});
				
				}
				var dataStates = 2;
				var pkId = $yt_common.GetQueryString("pkId");
				addCostList.addCostListInfo(dataStates, reductionDetails, pkId);
			}
		});
		$(".btn-off").click(function() {
			window.location.href = "borrowList.html";
			$yt_baseElement.showLoading();
		})
		//点击返回
		$('.page-return-btn').on('click', function() {
			window.location.href = "borrowList.html";
			$yt_baseElement.showLoading();
		});
		//点击费用减免新增
		$('.cost-add-btn').click(function() {
			
			//初始化输入框
			$("select.types").setSelectVal("0");
			$('select.types').niceSelect();
			$('input.pre-relief-standard').val("");
			$('input.post-remission-standard').val("");
			$('input.reduction-exemption').val("");
			$('span.post-remission-money').text("");
			$('input.remarks').val("");
			var i = $(".cost-info-tbody").find("tr").length - 1;
			var j = 0;
			addCostList.costInfoAlert(i, j);
			$(".select-teacher-table tbody").find(".total-blur").blur(function(){
				$(this).val($yt_baseElement.fmMoney($(this).val()));
			});
		});
		//点击费用减免修改
		$(".cost-update-btn").click(function() {
			$("select.types").setSelectVal("0");
			if($(".cost-info-tbody").find("tr.yt-table-active").length != 1) {
				$yt_alert_Model.prompt("请选择一条数据进行修改");
				return false;
			}
			var costTr = $(".cost-info-tbody").find("tr.yt-table-active");
			var types = costTr.data('types');
			var reductionExemption = costTr.find("td.reduction-exemption-td").text();
			var preReliefStandard = costTr.find("td.pre-relief-standard-td").text();
			var postRemissionStandard = costTr.find("td.post-remission-standard-td").text();
			var postRemissionMoney = costTr.find(".post-remission-money-td").text();
			var remarks = costTr.find("td.remarks-td").text();
			$("select.types").setSelectVal(types);
			$('select.types').niceSelect();
			$('input.pre-relief-standard').val($yt_baseElement.fmMoney(preReliefStandard));
			$('input.post-remission-standard').val($yt_baseElement.fmMoney(postRemissionStandard));
			$('input.reduction-exemption').val(reductionExemption);
			$('span.post-remission-money').text($yt_baseElement.fmMoney(postRemissionMoney));
			$(".dealing-with-people").setSelectVal();
			$('input.remarks').val(remarks);
			var j = 1;
			addCostList.costInfoAlert(i, j);
		});
		//点击费用减免删除
		$(".cost-delete-btn").click(function() {
			if($(".cost-info-tbody").find("tr.yt-table-active").length != 1) {
				$yt_alert_Model.prompt("请选择一条数据进行删除");
				return false;
			}
			$yt_alert_Model.alertOne({
				haveCloseIcon: false, //是否带有关闭图标  
				closeIconUrl: "", //关闭图标路径  
				leftBtnName: "确定", //左侧按钮名称,默认确定  
				rightBtnName: "取消", //右侧按钮名称,默认取消  
				cancelFunction: "", //取消按钮操作方法*/  
				alertMsg: "数据删除将无法恢复，确认删除吗？", //提示信息  
				confirmFunction: function() { //点击确定按钮执行方法  
					$(".cost-info-tbody").find("tr.yt-table-active").remove();
					if($(".cost-info-tbody").children().length = 0){
						var htmlTbody = $('.project-tbody')
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
					//计算减免总金额
					var allMoneyTrTd =  $(".project-tbody").find(".post-remission-money-td");
					var aggregateAmount=0.0;
					var money;
					$.each(allMoneyTrTd,function(j,m){
						money = $(m).text();
						aggregateAmount += $yt_baseElement.rmoney(money);
					});
					$(".aggregate-amount").text($yt_baseElement.fmMoney(aggregateAmount));
				}
			});
		});
	},
	//减免明细弹窗
	costInfoAlert: function(i, j) {
		//显示减免详情弹出框
		$(".select-teacher-div").show();
		//计算弹出框位置
		$yt_alert_Model.setFiexBoxHeight($(".select-teacher-div .yt-edit-alert-main"));
		$yt_alert_Model.getDivPosition($(".select-teacher-div"));
		$yt_model_drag.modelDragEvent($(".select-teacher-div .yt-edit-alert-title"));
		//总计
		$('input.total').keyup(function() {
			var num = 0;
			var preReliefStandard = $yt_baseElement.rmoney($('.pre-relief-standard').val());
			var postRemissionStandard = $yt_baseElement.rmoney($('.post-remission-standard').val());
			var reductionExemption = $('.reduction-exemption').val();
			num = (preReliefStandard - postRemissionStandard) * reductionExemption;
			$('span.post-remission-money').text($yt_baseElement.fmMoney(num));
		});
		var htmlTr = "";
		var htmlTbody = $('.project-tbody')
		//确定按钮事件
		$('.sreduction-details-sure-btn').off().on('click',function() {
			
			//得到值
			var types = $("select.types").val();
			var preReliefStandard = $('input.pre-relief-standard').val();
			var postRemissionStandard = $('input.post-remission-standard').val();
			var reductionExemption = $('input.reduction-exemption').val();
			var postRemissionMoney = $('span.post-remission-money').text();
			var remarks = $('input.remarks').val();
			//字段验证
			$("span.dealing-with-people-span").text("");
			if(types == 0) {
				$("span.dealing-with-people-span").text("请选择费用类型");
			} else if(preReliefStandard == "") {
				$yt_valid.validForm($(".valid-tab"));  
			} else if(postRemissionStandard == "") {
				$yt_valid.validForm($(".valid-tab"));  
			} else if(reductionExemption == "") {
				$yt_valid.validForm($(".valid-tab")); 
			} else if(j == 1) {
				//点击修改传值
				$yt_baseElement.showLoading();
				var costTr = $(".cost-info-tbody").find("tr.yt-table-active");
				costTr.find("td.types-td").text((addCostList.costTypeInfo(types)));
				costTr.data('types',types);
				costTr.find("td.reduction-exemption-td").text(reductionExemption);
				costTr.find("td.pre-relief-standard-td").text($yt_baseElement.fmMoney(preReliefStandard));
				costTr.find("td.post-remission-standard-td").text($yt_baseElement.fmMoney(postRemissionStandard));
				costTr.find("td.post-remission-money-td").text($yt_baseElement.fmMoney(postRemissionMoney));
				costTr.find(".remarks-td").text(remarks);
				//计算减免总金额
				var allMoneyTrTd =  $(".project-tbody").find(".post-remission-money-td");
				var aggregateAmount=0.0;
				var money;
				$.each(allMoneyTrTd,function(j,m){
					money = $(m).text();
					aggregateAmount += $yt_baseElement.rmoney(money);
				});
				$(".aggregate-amount").text($yt_baseElement.fmMoney(aggregateAmount));
				
				$(".yt-edit-alert,#heard-nav-bak").hide();
				$("#pop-modle-alert").hide();
				$yt_baseElement.hideLoading();
			} else {
				if(parseInt(postRemissionMoney)>=0){
					if(i == 0 && $(".cost-info-tbody").find("tr").hasClass("null")) {
						htmlTbody.html("");
					}
					htmlTr = '<tr>' +
						'<td style="text-align:center;" class="types-td"><input class="types-input" style="display: none;text-align:center;" value="' + types + '"/>' + addCostList.costTypeInfo(types) + '</td>' +
						'<td style="text-align:right;" class="reduction-exemption-td">' + reductionExemption + '</td>' +
						'<td style="text-align:right;" class="pre-relief-standard-td">' + $yt_baseElement.fmMoney(preReliefStandard) + '</td>' +
						'<td style="text-align:right;" class="post-remission-standard-td">' + $yt_baseElement.fmMoney(postRemissionStandard) + '</td>' +
						'<td style="text-align:right;" class="post-remission-money-td">' + $yt_baseElement.fmMoney(postRemissionMoney) + '</td>' +
						'<td style="text-align:left;" class="remarks-td">' + remarks + '</td>' +
						'</tr>';
					htmlTr = $(htmlTr).data('types',types);
					htmlTbody.append(htmlTr);
					//计算减免总金额
					var allMoneyTrTd =  $(".project-tbody").find(".post-remission-money-td");
					var aggregateAmount=0.0;
					var money;
					$.each(allMoneyTrTd,function(j,m){
						money = $(m).text();
						aggregateAmount += $yt_baseElement.rmoney(money);
					});
					$(".aggregate-amount").text($yt_baseElement.fmMoney(aggregateAmount));
					
					$(".yt-edit-alert,#heard-nav-bak").hide();
					$("#pop-modle-alert").hide();
				}else{
					$yt_alert_Model.prompt("减免后总金额不能为负!");
				}
			}
			//表格单击事件
			$(".cost-info-tbody").find("tr").on("click", function() {
				$(this).attr("class", "yt-table-active");
				$(this).siblings().attr("class", "");
			});
			$(".cost-info-tbody").find("tr").on("hover", function() {
				$(this).css("backgroud-color", "#FAFAFA");
			});
		});
		//取消按钮
		$('.sreduction-details-canel-btn').off().on("click", function() {
			//隐藏页面中自定义的表单内容  
			$(".yt-edit-alert,#heard-nav-bak").hide();
			$("#pop-modle-alert").hide();
		});

	},
	//新增费用减免
	addCostListInfo: function(dataStates, reductionDetails, pkId) {
		var processInstanceId = $(".process-instance-id").val();
		if (processInstanceId == undefined) {
			processInstanceId = "";
		}
		var projectCode = $('.project-code').text();
		var remissionCause = $('.remission-cause').val();
		var postRemissionMoney = $yt_baseElement.rmoney($('.aggregate-amount').text());
		var dealingWithPeople = $(".dealing-with-people").val();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/reduction/addOrUpdateBean", //ajax访问路径  
			async: false,
			data: {
				pkId: pkId,
				projectCode: projectCode,
				remissionCause: remissionCause,
				"reductionDetails": JSON.stringify(reductionDetails),
				postRemissionMoney: postRemissionMoney,
				dataStates: dataStates,
				businessCode: "reduction",
				dealingWithPeople: dealingWithPeople,
				opintion: "",
				processInstanceId: processInstanceId,
				nextCode: "submited",
			},
			success: function(data) {
				
				if(data.flag == 0) {
					if(dataStates == 1) {//保存
						$yt_alert_Model.prompt("保存成功");
						window.location.href = "borrowList.html";
					} else if(dataStates == 2) {
						$yt_alert_Model.prompt("提交成功");
						window.location.href = "borrowList.html";
					}
				} else {//提交
					if(dataStates == 1) {
						$yt_alert_Model.prompt("保存失败");
					} else if(dataStates == 2) {
						$yt_alert_Model.prompt("提交失败");
					}
				}
			} //回调函数 匿名函数返回查询结果  

		})
	},
	//获取项目下拉列表
	getProjectInfo: function() {
		$yt_baseElement.showLoading();
		var selectParam = "";
		$.ajax({
			async: true,
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "finance/reduction/lookForAllProject", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam: selectParam,
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			before: function() {
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag == 0) {
					if(data.data && data.data && data.data.length > 0) {
						//当前登录人的code
						var userName = addCostList.userInfo();
						var projectHeadCode;
						var classTeacherCode;
						var projectSellCode;
						var projectAidCode;
						//遍历给下拉框添加数据
						$.each(data.data, function(i, v) {
							//项目主任code
							projectHeadCode = v.projectHeadCode;
							//班主任code
							classTeacherCode = v.classTeacherCode;
							//项目销售code
							projectSellCode = v.projectSellCode;
							//项目助理code
							projectAidCode = v.projectAidCode;
							if(projectHeadCode.indexOf(userName) != -1 || classTeacherCode.indexOf(userName) != -1 || projectSellCode.indexOf(userName) != -1 || projectHeadCode.indexOf(userName) != -1 || projectAidCode.indexOf(userName) != -1){
								$("select.project-name-select").append($('<option value="' + (i + 1) + '">' + v.projectName + '</option>').data("costData", v));
							}
						});
						$("select.project-name-select").niceSelect({  
					        search: true,  
					        backFunction: function(text) {  
					            //回调方法,可以执行模糊查询,也可自行添加操作  
					            $("select.project-name-select option").remove();  
					            if(text == "") {  
					                $("select.project-name-select").append('<option value="">请选择</option>');  
					            }  
					            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
					            $.each(data.data, function(i, v) {  
					                if(v.projectName.indexOf(text) != -1) {  
					                   //项目主任code
										projectHeadCode = v.projectHeadCode;
										//班主任code
										classTeacherCode = v.classTeacherCode;
										//项目销售code
										projectSellCode = v.projectSellCode;
										//项目助理code
										projectAidCode = v.projectAidCode;
										if(projectHeadCode.indexOf(userName) != -1 || classTeacherCode.indexOf(userName) != -1 || projectSellCode.indexOf(userName) != -1 || projectHeadCode.indexOf(userName) != -1 || projectAidCode.indexOf(userName) != -1){
											$("select.project-name-select").append($('<option value="' + (i + 1) + '">' + v.projectName + '</option>').data("costData", v));
										}
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
			}
		});
		return userName;
	},
	//费用类型设置
	costTypeInfo: function(code) {
		if(code == 1) {
			return "培训费";
		} else if(code == 2) {
			return "课程费";
		} else if(code == 3) {
			return "住宿费";
		} else if(code == 4) {
			return "餐费";
		} else if(code == 5) {
			return "杂费";
		} else if(code == 6) {
			return "场地使用费";
		} else if(code == 7) {
			return "会务费";
		} else if(code == 8) {
			return "其他";
		} else {
			return '';
		};
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
		} else if(code == 5) {
			return "国资委调训";
		}  else {
			return '';
		};
	},
	//获取下一步操作人
	getListSelectDealingWithPeople: function() {
		var list = [];
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/workFlowOperate/getSubmitPageData",
			data: {
				businessCode: "reduction",
				processInstanceId: "",
				parameters: "",
				versionNum: ""
			},
			async: false,
			success: function(data) {
				$.each(data.data, function(i, n) {
					for(var k in n) {
						list = n[k];
					}
				});
			}
		});
		return list;
	},
	//审批记录跳转页面获取一条信息
	getcostInfoEditable: function() {
		var pkId = $yt_common.GetQueryString("pkId");
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/reduction/getBeanById",
			async: true,
			data: {
				pkId: pkId
			},
			success: function(data) {
				//hide
				$yt_baseElement.hideLoading();
				if(data.flag == 0) {
					var v = data.data;
					var projectName = v.projectName;
					$('.create-user').text(v.createUser);
					$('.dept-name').text(v.deptName);
					$('.create-time-string').text(v.createTimeString);
					$('.project-code').text(v.projectCode);
					$('.remission-cause').text(v.remissionCause);
					$('.project-type').text((costInfo.projectTypeInfo(v.projectType)));
					$('.project-head').text(v.projectHead);
					$('.class-teacher').text(v.classTeacher);
					$('.start-date').text(v.startDate);
					$('.end-date').text(v.endDate);
					$('.work-flaw-state').text(v.workFlawState);
					$(".dealing-with-people").setSelectVal(v.dealingWithPeople);
					var reductionDetailsJSON = $.parseJSON(v.reductionDetails)
					var htmlTr = "";
					var htmlTbody = $(".project-tbody");
					htmlTbody.html("");
					//遍历所属项目
					$.each(reductionDetailsJSON, function(i, n) {
						htmlTr = '<tr>' +
							'<td class="types" style="text-align: center;">' + costInfo.costTypeInfo(n.types) + '</td>' +
							'<td style="text-align: center;">' + n.reductionExemption + '</td>' +
							'<td style="text-align: center;">' + n.preReliefStandard + '</td>' +
							'<td style="text-align: center;">' + n.postRemissionStandard + '</td>' +
							'<td style="text-align: center;">' + n.postRemissionMoney + '</td>' +
							'</tr>';
						htmlTr = $(htmlTr).data('types',n.types);
						console.log($(htmlTr).data('types'))
						htmlTbody.append(htmlTr);
					});
					//计算减免总金额
					var allMoneyTrTd =  $(".project-tbody").find(".post-remission-money-td");
					var aggregateAmount=0.0;
					var money;
					$.each(allMoneyTrTd,function(j,m){
						money = $(m).text();
						aggregateAmount += $yt_controlElement.rmoney(money);
					});
					$(".aggregate-amount").text($yt_baseElement.fmMoney(aggregateAmount));
					//给下拉框赋值
					$("select.project-name-select").setSelectVal(v.projectCode);
					//$("select").niceSelect();
					//遍历审批流程信息 
					if(data.data.flowLog != "") {
						//流程
						var flowLog = JSON.parse(data.data.flowLog);
						if(flowLog.length != 0) {
							$(".approve-info-title").show();
							$(".approve-info").show();
							var middleStepHtml;
							var length = flowLog.length;
							$.each(flowLog, function(i, v) {
								if(i > 0) {
									$('.middle-step-box-div').css("border-left", "8px solid #B5C2D4");
								}
								var order = length - i;
								var optionLiHtml;
								if(i == 0) {
									optionLiHtml = "";
								} else {
									optionLiHtml = '<li class="operate-view-box-li">' +
										'<div class="operate-view-title-li">操作意见：</div>' +
										'<div class="operate-view-text-li middle-step-comment">' + v.comment + '</div>' +
										'</li>';
								}
								middleStepHtml = '<div>' +
									'<div>' +
									'<div class="number-name-box">' +
									'<span class="number-box-span middle-step-order middle-a-index" >' + order + '</span>' +
									'<span class="name-box-span middle-step-userName middle-a-index" >' + v.userName + '</span>' +
									'<img src="../../resources/images/open/openFlow.png" class="order-img" />' +
									'</div>' +
									'</div>' +
									'<div class="middle-step-box-div" style="border: none;">' +
									'<ul class="middle-step-box-ul">' +
									'<li style="height: 30px;">' +
									'<span  class="middle-step-taskName view-taskName-span operation-state"  style="float: left;">' + v.operationState + '</span>' +
									'</li>' +
									'<li class="view-time-li middle-step-commentTime"style="width: 360px;text-align:right;white-space:nowrap;"  >' + v.commentTime + '</li>' + optionLiHtml +

									'</ul>' +
									'</div>' +
									'</div>';
								$('.first-step').before(middleStepHtml);
							});
						}
					}
					$yt_baseElement.hideLoading();

				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}
				var operationState = $('.operation-state').text();
				if(operationState == "") {
					$('.operationState').text("操作状态");
				};
				var remissionCause = $('.remission-cause').text();
				if(remissionCause == "") {
					$('.remission-cause-div').css("float", "none");
				};
			}
		});
	}
}
$(function() {
	//初始化方法
	addCostList.init();

});