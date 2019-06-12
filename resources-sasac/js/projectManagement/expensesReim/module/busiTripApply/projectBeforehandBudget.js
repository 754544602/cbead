var probudget = {
	beforeCostList: [], //事前审批数据
	specialName: "",
	prjName: "",
	init: function() {
		probudget.even();
		probudget.priorApprovalEvent();
		probudget.approvalTotal();
		probudget.adjustmentTotal();
		probudget.adjustmentAfterTotal();
		sysCommon.getLoginUserInfo();
		//调用获取审批流程数据方法
		sysCommon.getApproveFlowData("SZ_ADVANCE_APP");
	},
	//执行方法
	even :function(){
		/** 
         * 金额文本框获取焦点事件 
         */  
        $(".aft-money").on("focus",function(){  
            if($(this).val()!=""){  
                //调用还原格式化的方法  
               $(this).val($yt_baseElement.rmoney($(this).val()));  
            }  
        });  
        /** 
         * 金额文本框失去焦点事件 
         */  
        $(".aft-money").on("blur",function(){  
            if($(this).val()!=""){  
                //调用格式化金额方法  
                $(this).val($yt_baseElement.fmMoney($(this).val()));  
            }  
            probudget.adjustmentTotal();
        });  
	},
	fmMoney: function(str) {
		return $yt_baseElement.fmMoney(str || '0');
	},
	/**
	 * 获取事前审批单列表
	 */
	getPriorApprovalList: function() {
		//表格区域
		var tbody = $('.prior-approval-list tbody');
		var queryParams = $('.prior-approval-val').val();
		//分页区域
		var pageDiv = $('.prior-page');
		$('.prior-page').pageInfo({
			pageIndex: 1,
			pageNum: 5, //每页显示条数  
			pageSize: 3, //显示...的规律  
			url: "sz/advanceApp/getAdvanceAppListToPageByParams", //ajax访问路径  
			objName: 'data',
			data: {
				queryParams: queryParams,
			},
			success: function(data) {
				tbody.empty();
				if(data.flag == 0) {
					var trStr = "";
					if(data.data.rows.length > 0) {
						//显示分页
						pageDiv.show();
						$.each(data.data.rows, function(i, n) {
							trStr += '<tr specialName="' + n.specialName + '" advanceAppName="' + n.advanceAppName + '" pid="' + n.advanceAppId + '" code="' + n.advanceAppNum + '">' +
								'<td>' + n.advanceAppNum + '<input type="hidden" class="balance" value="' + n.advanceAppBalance + '" /></td>' +
								'<td>' + n.applicantUserName + '</td>' +
								'<td>' + n.applicantUserDeptName + '</td>' +
								'<td>' + n.advanceAppName + '</td>' +
								'<td>' + n.advanceCostTypeName + '</td>' +
								'<td>' + n.applicantTime + '</td>' +
								/*'<td class="sname">XX专项</td>' +*/
								'</tr>';
						});
						tbody.append(trStr);
					} else {
						//隐藏分页
						pageDiv.hide();
						var noTr = '<tr class="model-no-data-tr"><td colspan="7"><div class="no-data"><img src="../../../../../resources-sasac/images/common/no-data.png" alt=""></div></td></tr>';
						tbody.append(noTr);
					}
				}
			} //回调函数 匿名函数返回查询结果  
		});
	},
	/**
	 * 1.1.4.5	根据事前申请Id获取报销申请详细信息   
	 * 导入事前审批单用
	 * @param {Object} id
	 */
	getAdvanceAppInfoDetailByAdvanceAppId: function(id, upDate) {
		$.ajax({
			type: "post",
			url: "sz/advanceApp/getAdvanceAppInfoDetailByAdvanceAppId",
			async: true,
			data: {
				advanceAppId: id
			},
			success: function(data) {
				//保存查询成功的事前数据
				if(data.flag == 0) {
					probudget.beforeCostList = data.data;
					probudget.specialName = probudget.beforeCostList.specialName;
					probudget.prjName = probudget.beforeCostList.prjName;
				}
			}
		});

	},
	/**
	 * 选择事前审批单相关事件
	 */
	priorApprovalEvent: function() {
		var me = this;

		//弹出框显示
		$('.prior-approval').click(function() {
			//获取数据
			me.getPriorApprovalList();
			//显示弹框及蒙层
			$yt_baseElement.showMongoliaLayer();
			$yt_alert_Model.getDivPosition($('.prior-alert'));
			$('#pop-modle-alert').show();
			$('.prior-alert').show();
		});
		//确定事件
		$('.prior-common').click(function() {
			//选中行的对象
			var tr = $('.prior-approval-list .yt-table-active');
			//选中行的code
			var code = tr.attr('code');
			//专项名称
			var name = tr.find('.sname').text();
			//事前申请id
			var id = tr.attr('pid');
			//可用余额
			var balance = tr.find('.balance').val();
			//事前申请事由
			var advanceAppName = tr.attr('advanceAppName');
			if(code) {
				//获取事前申请数据
				me.getAdvanceAppInfoDetailByAdvanceAppId(id);
				//事前申请单号
				$('.prior-approval').val(code);
				//事前申请事由
				$('#advanceAppName').css("color", "#333").text(advanceAppName);
				//项目名称
				if(probudget.prjName) {
					$('#specialName').css("color", "#333").text(probudget.prjName);
				} else {
					$('#specialName').css("color", "#333").text('--');
				}
				//所属预算项目
				if(probudget.specialName) {
					$('.budget-item-one').css("color", "#333").text(probudget.specialName);
				} else {
					$('.budget-item-one').css("color", "#333").text('--');
				}
				//可用余额
				$('#advanceAppBalance').css("color", "#333").text(balance ? probudget.fmMoney(balance) + '元' : '--');
				//赋值id
				$('#advanceAppId').val(id);
				//隐藏弹框及蒙层
				$yt_baseElement.hideMongoliaLayer();
				$('.prior-alert').hide();
				$('#pop-modle-alert').hide();
			} else {
				$yt_alert_Model.prompt('请选择一条数据');
			}
			$("#costList").show();
			$(".cost-hide").hide();
		});

		//取消事件
		$('.prior-cancel').click(function() {
			//隐藏弹框及蒙层
			$yt_baseElement.hideMongoliaLayer();
			$('.prior-alert').hide();
			$('#pop-modle-alert').hide();
			//清空
			$('.prior-approval-val').val('');
			//获取数据
			me.getPriorApprovalList();
		});

		//查询按钮
		$('.prior-approval-search').click(function() {
			//获取数据
			me.getPriorApprovalList();
		});

		//重置按钮
		$('.prior-approval-reset').click(function() {
			$('.prior-approval-val').val('');
			//获取数据
			me.getPriorApprovalList();
		});

	},
	//已审批预算金额合计
	approvalTotal: function() {
		//获取所有的金额
		var tds = $('#costList tbody .app-money');
		var total = 0;
		//计算合计金额
		$.each(tds, function(i, n) {
			total += $yt_baseElement.rmoney($(n).text());
		});
		var fmTotal = $yt_baseElement.fmMoney(total);
		//赋值合计金额
		$yt_baseElement.fmMoney($('#costList tbody .approved-money').text(fmTotal));
	},
	//调整后预算金额合计
	adjustmentTotal: function() {
		//获取所有的金额
		var tds = $('#costList tbody .aft-money');
		var total = 0;
		//计算合计金额
		$.each(tds, function(i, n) {
			total += $yt_baseElement.rmoney($(n).val() || '0');
		});
		var fmTotal = $yt_baseElement.fmMoney(total);
		//赋值合计金额
			$yt_baseElement.fmMoney($('#costList tbody .after-money').text(fmTotal));
	},
	//调整金额合计
	adjustmentAfterTotal: function() {
		//获取所有的金额
		var tds = $('#costList tbody .adj-money');
		var total = 0;
		//计算合计金额
		$.each(tds, function(i, n) {
			total += $yt_baseElement.rmoney($(n).text());
		});
		var fmTotal = $yt_baseElement.fmMoney(total);
		//赋值合计金额
		$yt_baseElement.fmMoney($('#costList tbody .adjustment-money').text(fmTotal));
	},
	
}
$(function() {
	//下拉框初始化
	$("select").niceSelect();
	probudget.init();
})