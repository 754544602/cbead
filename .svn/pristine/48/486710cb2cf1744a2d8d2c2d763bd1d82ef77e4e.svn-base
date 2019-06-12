var demand = {
	budgetFinancialDetails: "", //储存获取的所有数据
	init: function() {
		//给当前页面设置最小高度
		$("#demandApply").css("min-height", $(window).height() - 32);
		//获取当前登录用户信息
		sysCommon.getLoginUserInfo();
		//接受传输的参数
		var budgetPrjFinancialAppId = $yt_common.GetQueryString('budgetPrjFinancialAppId');
		// 获取传输的项目ID
		//var processInstanceId = $yt_common.GetQueryString('processInstanceId');
		//调用获取流程日志方法
		//var flowLogHtml = sysCommon.getCommentByProcessInstanceId(processInstanceId);
		//$(".flow-log-div").html(flowLogHtml);
		//[预算财政项目]：获取预算财政项目信息
		demand.getBudgetPrjFinancialAppInfoByAppId(budgetPrjFinancialAppId);
		//调用父级关闭当前窗体方法
		$("#closeBtn").click(function() {
			if(window.top == window.self) { //不存在父页面
				window.close();
			} else {
				parent.closeWindow();
			}
		});
	},
	/*
	 * 
	 * [预算财政项目]：获取预算财政项目信息
	 * 
	 * */
	getBudgetPrjFinancialAppInfoByAppId: function(budgetPrjFinancialAppId) {
		$.ajax({
			type: "post",
			url: "budget/prjFinancialApp/getBudgetPrjFinancialAppInfoByAppId", //$yt_option.websit_path + "resources-sasac/js/testJsonData/budgetFinancialDetails.json"
			async: false,
			data: {
				budgetPrjFinancialAppId: budgetPrjFinancialAppId
			},
			success: function(data) {
				if(data.flag == 0) {
					var datas = data.data;
					//赋值全局变量获取的全部数据
					demand.budgetFinancialDetails = datas;
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
						$("#jobName").text(datas.posiNaming == "" ? "--" : datas.posiNaming);
						//电话
						$("#telPhone").text(datas.applicantUserPhone == "" ? "--" : datas.applicantUserPhone);
						//项目名称
						$(".project-name").text(datas.prjName);
						//项目名称
						$(".project-for-short").text(datas.prjForShort);
						//项目单位
						$(".project-company").text(datas.prjUnitName);
						//主管单位及代码
						$(".company-code").text((datas.compUnitName || "无"));
						//项目类别
						$(".project-type").text(datas.prjClassifyName);
						//项目开始年份
						$(".project-year").text(datas.prjStartYear);
						//项目周期
						$(".project-cycle").text(datas.prjCycle);
						//实施单位
						$(".implementation-company").text(datas.implUnitName);
						//项目属性
						$(".project-attribute").text((datas.prjAttrName || ""));
						//项目预算年份
						$(".prj-budget-year").text((datas.prjBudgetYear || ''));
						//立项申请提交截止时间
						$(".submit-deadline").text((datas.submitDeadline || ''));
						//立项申请提交部门
					}
				} else {

				}
			}
		})
	},
}
$(function() {
	//调用初始化方法
	demand.init();
});