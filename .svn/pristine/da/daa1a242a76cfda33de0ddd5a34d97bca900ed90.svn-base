var demand = {
	budgetObj: "", //全局的数据存储
	init: function() {
		//流程审批
		$(".flow-approve-model").html(sysCommon.createFlowApproveMode());
		//给当前页面设置最小高度
		$("#demandApply").css("min-height", $(window).height() - 32);
		//初始化下拉框
		$("select").niceSelect();
		//获取当前登录用户信息
		sysCommon.getLoginUserInfo();
		//接受传输的参数
		var budgetPrjAppId = $yt_common.GetQueryString('budgetPrjAppId');
		//4.16.4[预算项目立项]：获取预算立项申请信息
		demand.getBudgetPrjAppInfoByAppId(budgetPrjAppId);
		//调用父级关闭当前窗体方法
		$("#clearBtn").click(function() {
			//提交成功跳转到申请页面
			$yt_common.parentAction({
				url: $yt_option.parent_action_path, //父级中转地址,固定配置项,只有统一修改处理。  
				funName: 'locationToMenu', //指定方法名，定位到菜单方法  
				data: {
					url: 'view/system-sasac/budget/module/projectApproval/budgetProjectList.html' //要跳转的页面路径  
				}
			});
		});
		//提交
		$('#submitPayment').on('click', function() {
			var thisBtn = $(this);
			thisBtn.attr('disabled', true).addClass('btn-disabled');
			if($yt_valid.validForm($('.flow-approve-model'))) {
				//获取提交数据
				var d = demand.budgetObj;
				demand.submitWorkFlow(d, thisBtn);
			} else {
				thisBtn.attr('disabled', false).removeClass('btn-disabled');
			}
		});
	},
	/**
	 * 4.16.3[预算项目立项]：提交流程审批 
	 * @param {Object} data
	 */
	submitWorkFlow: function(subData, thisBtn) {
		$.ajax({
			type: "post",
			url: "budget/prjApp/submitWorkFlow",
			async: true,
			data: {
				appId: subData.budgetPrjAppId, //表单申请id
				dealingWithPeople: $("#approve-users").val(), //审批人
				opintion: $("#opintion").val(), //操作意
				processInstanceId: subData.processInstanceId, //流程实例ID
				nextCode: $("#operate-flow").val() //下一步操作流程见
			},
			success: function(data) {
				if(data.flag == 0) {
					$yt_common.parentAction({
						url: $yt_option.parent_action_path, //父级中转地址,固定配置项,只有统一修改处理。
						funName: 'locationToMenu', //指定方法名，定位到菜单方法
						data: {
							url: 'view/system-sasac/budget/module/projectApproval/budgetProjectList.html' //要跳转的页面路径
						}
					});
				} else {
					thisBtn.attr('disabled', false).removeClass('btn-disabled');
				}
				//提示信息	
				$yt_alert_Model.prompt(data.message);
			}
		});
	},
	/*
	 * 
	 * 4.16.4[预算项目立项]：获取预算立项申请信息
	 * 
	 * */
	getBudgetPrjAppInfoByAppId: function(budgetPrjAppId) {
		$.ajax({
			type: "post",
			url: "budget/prjApp/getBudgetPrjAppInfoByAppId", //$yt_option.websit_path + "resources-sasac/js/testJsonData/budgetApprovalDetails.json"
			async: false,
			data: {
				budgetPrjAppId: budgetPrjAppId
			},
			success: function(data) {
				if(data.flag == 0) {
					var datas = data.data;
					//全局储存变量赋值
					demand.budgetObj = datas;
					//赋值全局变量获取的全部数据
					demand.budgetApprovalDetails = datas;
					if(datas && datas != "" && datas != undefined) {
						//单据编号
						$("#formNum").text(datas.budgetPrjAppNum);
						//申请时间
						$("#applyDate").text(datas.applicantTime);
						//申请人
						$("#busiUsers").text(datas.applicantUserName);
						//部门
						$("#deptName").text(datas.applicantUserDeptName);
						//职务
						$("#jobName").text(datas.applicantUserJobName == "" ? "--" : datas.applicantUserJobName);
						//电话
						$("#telPhone").text(datas.applicantUserPhone == "" ? "--" : datas.applicantUserPhone);
						//项目名称
						$(".project-name").text(datas.prjName);
						//项目单位
						$(".project-company").text(datas.prjUnitName);
						//主管单位及代码
						$(".company-code").text((datas.compUnitName || '无'));
						//项目类别
						$(".project-type").text(datas.prjClassifyName);
						//项目开始年份
						$(".project-year").text(datas.prjStartYear);
						//项目周期
						$(".project-cycle").text(datas.prjCycle);
						//实施单位
						$(".implementation-company").text(datas.implUnitName);
						//项目属性
						$(".project-attribute").text((datas.prjAttrName || "无" ));
						//立项依据
						$(".project-basis").html((datas.prjBasisContent || '无'));
						//实施方案及可行性
						$(".implementation-feasibility").html((datas.implPlanFeasContent || '无'));
						//中期目标赋值
						demand.midGoalInfo(datas.midGoalInfo);
						//年度目标赋值
						demand.yearGoalInfo(datas.yearGoalInfo);
						//附件集合显示
						demand.showFileList(datas.attrList);
					}
					/**
					 * 
					 * 调用获取审批流程数据方法
					 * 
					 */
					sysCommon.getApproveFlowData("BUDGET_PRJ_APP", datas.processInstanceId);
				} else {

				}
			}
		})
	},
	/*
	 * 
	 * 中期目标赋值
	 * 
	 * */
	midGoalInfo: function(datas) {
		if(datas && datas != '' && datas != undefined) {
			//中期资金总额
			$(".metaphase-total").text($yt_baseElement.fmMoney(datas.totalAmount) + "万元" || '--');
			//其中：财政拨款
			$(".among-finance").text($yt_baseElement.fmMoney(datas.financeAmount) + "万元" || '--');
			//其他资金
			$(".other-capital").text($yt_baseElement.fmMoney(datas.otherAmount) + "万元" || '--');
			//中期目标
			$(".metaphase-target").html(datas.goalContent || "无");
			//中期绩效指标
			var midKpiInfoList = datas.midKpiInfoList;
			var trStr = "";
			var htmlTbody = $('.metaphase-table .yt-tbody');
			if(midKpiInfoList && midKpiInfoList != '' && midKpiInfoList != undefined) {
				htmlTbody.empty();
				$.each(midKpiInfoList, function(i, n) {
					trStr += '<tr>' +
						'<td oneTargetCode=' + n.oneTargetCode + '>' + n.oneTargetName + '</td>' +
						'<td twoTargetCode=' + n.twoTargetCode + '>' + n.twoTargetName + '</td>' +
						'<td threeTargetCode=' + n.threeTargetCode + '>' + n.threeTargetName + '</td>' +
						'<td style="">' + n.prjTargetValue + '</td>' +
						'<td>' + (n.units || "--") + '</td>' +
						'</tr>';
				});
				htmlTbody.append(trStr);
			} else {
				//拼接暂无数据效果
				htmlTbody.html(sysCommon.noDataTrStr(5));
			}
		} else {
			//提示信息	
			$yt_alert_Model.prompt('无中期目标');
		}
	},
	/*
	 * 
	 * 年度目标赋值
	 * 
	 * */
	yearGoalInfo: function(datas) {
		if(datas && datas != '' && datas != undefined) {
			//年度资金总额
			$(".year-total").text($yt_baseElement.fmMoney(datas.totalAmount) + "万元" || '--');
			//其中：财政拨款
			$(".year-finance").text($yt_baseElement.fmMoney(datas.financeAmount) + "万元" || '--');
			//其他资金
			$(".year-other").text($yt_baseElement.fmMoney(datas.otherAmount) + "万元" || '--');
			//年度目标
			$(".year-target").html(datas.goalContent || "无");
			//年度绩效指标
			var yearKpiInfoList = datas.yearKpiInfoList;
			var trStr = "";
			var htmlTbody = $('.year-table .yt-tbody');
			if(yearKpiInfoList && yearKpiInfoList != '' && yearKpiInfoList != undefined) {
				htmlTbody.empty();
				$.each(datas.yearKpiInfoList, function(i, n) {
					trStr += '<tr>' +
						'<td oneTargetCode=' + n.oneTargetCode + '>' + n.oneTargetName + '</td>' +
						'<td twoTargetCode=' + n.twoTargetCode + '>' + n.twoTargetName + '</td>' +
						'<td threeTargetCode=' + n.threeTargetCode + '>' + n.threeTargetName + '</td>' +
						'<td style="">' + n.prjTargetValue + '</td>' +
						'<td>' + (n.units || "--") + '</td>' +
						'</tr>';
				});
				htmlTbody.append(trStr);
			} else {
				//拼接暂无数据效果
				htmlTbody.html(sysCommon.noDataTrStr(5));
			}
		} else {
			//提示信息	
			$yt_alert_Model.prompt('无年度目标');
		}
	},
	/**
	 * 附件集合显示
	 * @param {Object} list
	 */
	showFileList: function(list) {
		if(list.length > 0) {
			//图片显示拼接字符串
			var ls = '';
			//图片显示路径
			var src = '';
			$.each(list, function(i, n) {
				//获取图片格式
				var imgType = n.attName.split('.');
				if(imgType.length > 1 && (imgType[1] == 'png' || imgType[1] == 'jpeg' || imgType[1] == 'bmp' || imgType[1] == 'jpg')) {
					//拼接图片路径
					src = $yt_option.base_path + 'fileUpDownload/download?pkId=' + n.attId + '&isDownload=false';
					ls += '<div fid="' + n.attId + '" class="li-div"><span class="file-name" >' + n.attName + '</span><label class="file-dw">下载</label><label class="file-pv">预览<img src="' + src + '" ></label></div>';
				} else {
					ls += '<div fid="' + n.attId + '" class="li-div"><span class="file-name" >' + n.attName + '</span><label class="file-dw">下载</label><label class="file-pvno">预览</label></div>';
				}
			});
			$('#attIdStr').html(ls);
			//图片下载
			$('#attIdStr .file-dw').on('click', function() {
				var id = $(this).parent().attr('fid');
				window.location.href = $yt_option.base_path + 'fileUpDownload/download?pkId=' + id + '&isDownload=true';
			});
			//图片预览
			$('#attIdStr .file-pv img').showImg();
		} else {
			$("#attIdStr").html("暂无附件");
		}
	},
}
$(function() {
	//调用初始化方法
	demand.init();
});