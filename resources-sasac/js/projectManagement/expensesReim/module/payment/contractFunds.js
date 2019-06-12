$(function() {

	//附件上传
	$('.cont-file').on('change', function() {
		var ithis = $(this);
		var val = ithis.val();
		var parent = ithis.parent();
		parent.prev().find('.file-msg').text(val).css('color', '#333');
		$('.file-box').append('<div class="li-div"><span>' + val + '</span><span class="del-file">x</span></div>');
	});
	
	$('.file-box').on('click','.del-file',function(){
		var ithis = $(this);
		var parent = ithis.parent();
		$yt_alert_Model.alertOne({
			alertMsg: "数据删除将无法恢复,确认删除吗?",
			confirmFunction: function() {
                parent.remove();
            },
		});
	});

	//点击合同编号展开合同列表

	$(".contract-num").click(function() {
		//1.显示出差审批单弹出框
		sysCommon.showModel($("#busiAproFormModel"));
	});
	//关闭合同列表
	$("#aproCanelBtn").click(function() {
		sysCommon.closeModel($("#busiAproFormModel"));
	});
	//合同列表点击样式
	$('#busiTripTab tbody tr,.loan-list-model tbody tr').click(function() {
		$(this).addClass("yt-table-active").siblings().removeClass("yt-table-active");
	});
	//选择合同方法
	$("#aproSureBtn").click(function() {
		var contractNum = $('#busiTripTab tbody .yt-table-active td:eq(0)').text();
		$(".contract-num").val(contractNum);
		sysCommon.closeModel($("#busiAproFormModel"));
		$(".war-model").hide();
		$(".cost-apply-model,.flow-approve-model").show();
	});

	//弹出表单
	$("#addCostApplyBtn").click(function() {
		$("#model-add-list-btn").removeClass("update").addClass("save").text("加入到列表");
		//调用 显示费用明细弹出框方法
		sysCommon.showModel($("#cost-apply-model"));
	});
	//关闭弹出框表单
	$("#model-canel-btn").click(function() {
		//调用关闭可编辑弹出框方法
		sysCommon.closeModel($("#cost-apply-model"));
		//调用公共用的清空表单数据方法
		sysCommon.clearFormData();
	});
	//表单加入列表
	$("#model-add-list-btn").click(function() {
		if($(this).hasClass("save")) {
			//合同编号
			var num = $(".contract-num").text();
			//阶段
			var stageStr = $(".stage option:selected").text();
			//金额
			var amount = $(".amount").val();
			//比例
			var proportion = $(".proportion").text();
			//付款依据
			var fileStr = "";
			$(".file-list li").each(function(i, n) {
				if(i > 0) {
					fileStr + ",";
				}
				fileStr += $(n).text();
			});

			var trHtml = '<tr>' +
				'<td>' + num + '</td><td>' + stageStr + '</td>' +
				'<td><span class="meet-fee">' + amount + '</span></td><td>' + proportion + '</td>' +
				'<td><span></span></td><td>' + fileStr + '</td>' +
				'<td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>' +
				'<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>' +
				'</td></tr>';
			trHtml = $(trHtml);
			//绑定点击删除事件
			trHtml.find(".operate-del").click(function() {
				var thisObj = $(this);
				$yt_alert_Model.alertOne({
					alertMsg: "确定要删除此条数据吗?", //提示信息  
					leftBtnName: "确定",
					confirmFunction: function() { //点击确定按钮执行方法  
						//判断表格中除去,合计行和公务卡行
						if(thisObj.parents("tbody").find("tr:not(.total-last-tr)").length == 1) {
							thisObj.parents("tbody").empty();
						}

						//删除当前行
						thisObj.parents("tr").remove();
						personnelFunds.updateTotalNum();
					}
				});
			});
			trHtml.find(".operate-update").click(function() {
				$("#model-add-list-btn").removeClass("save").addClass("update").text("保存");
				//调用 显示费用明细弹出框方法
				sysCommon.showModel($("#cost-apply-model"));
			});
			$("#traffic-list-info .yt-tbody").append(trHtml);
		} else {

		}

		personnelFunds.updateTotalNum();
		//调用关闭可编辑弹出框方法
		sysCommon.closeModel($("#cost-apply-model"));
		//调用公共用的清空表单数据方法
		sysCommon.clearFormData();

	});

	//初始化下拉列表
	$('.yt-select').niceSelect();
	
	$('#payDate').calendar({
		speed:0,
		nowData: false
	});

	$(".file-btn-div").click(function() {
		sysCommon.showModel($("#loanFormModel"));
		$("#pop-modle-alert").css("z-index", "10002");
	});

	$("#loanCanelBtn,#loanSureBtn").click(function() {
		$("#loanFormModel").hide();
		$("#pop-modle-alert").css("z-index", "100");
	});
	//选择付款依据
	$("#loanFormModel .model-sure-btn").click(function() {
		var textNum = $("#loanFormModel .loan-list-model tr.yt-table-active td:eq(0)").text();
		$(".file-list").append('<li><a href="void(0)" target="_blank">' + textNum + '</a><img src="../../../../../resources-sasac/images/icons/x.png" alt=""></li>');

		///绑定删除方法
		$(".file-list li").last().find("img").click(function() {
			$(this).parent().remove();
		});

	});
});
var personnelFunds = {
	updateTotalNum: function() {
		var fundsTotalNum = 0;
		$(".meet-fee").each(function() {
			fundsTotalNum += $yt_baseElement.rmoney($(this).text());
		});
		$("#applySumMoney").text(fundsTotalNum);
		var sumMoneyLower = arabiaToChinese(fundsTotalNum + "");
		$("#applyMoneyLower").text(sumMoneyLower);
	}
}