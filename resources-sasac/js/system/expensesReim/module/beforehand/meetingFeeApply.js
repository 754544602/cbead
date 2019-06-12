var personnelFunds = {
	init:function (){
		
		//附件上传
		$('.cont-file').on('change',function(){
				var ithis = $(this);
				var val = ithis.val();
				var parent = ithis.parent();
				parent.prev().find('.file-msg').text(val).css('color','#333');
				$('.file-name-list').append('<label class="file-name">'+val+'</label>');
			});
		
		//弹出表单
		$("#addCostApplyBtn").click(function(){
			$("#model-add-list-btn").removeClass("update").addClass("save").text("加入到列表");
			//调用 显示费用明细弹出框方法
			sysCommon.showModel($("#cost-apply-model"));
		});
		//关闭弹出框表单
		$("#model-canel-btn").click(function(){
			//调用关闭可编辑弹出框方法
			sysCommon.closeModel($("#cost-apply-model"));
			//调用公共用的清空表单数据方法
			sysCommon.clearFormData();
		});
		//表单加入列表
		$("#model-add-list-btn").click(function (){
			if($(this).hasClass("save")){
				var trHtml = '<tr>'
			                   + '<td><span class="meet-fee">150</span></td><td>XXXXX</td>'
			                      + '<td><span>XXX</span></td><td>XXXXX</td>'
			 				   + '<td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>'
			 				   + '<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>'
							   + '</td></tr>';   
				trHtml = $(trHtml);
				//绑定点击删除事件
				trHtml.find(".operate-del").click(function (){
					var thisObj = $(this);
					$yt_alert_Model.alertOne({
						alertMsg: "确定要删除此条数据吗?", //提示信息  
						leftBtnName: "确定",
						confirmFunction: function() { //点击确定按钮执行方法  
							//判断表格中除去,合计行和公务卡行
						    if(thisObj.parents("tbody").find("tr:not(.total-last-tr)").length == 1){
								thisObj.parents("tbody").empty();
							}
						    
						    //删除当前行
						    thisObj.parents("tr").remove();
						    personnelFunds.updateTotalNum();
						}
					});
				});
				trHtml.find(".operate-update").click(function (){
					$("#model-add-list-btn").removeClass("save").addClass("update").text("保存");
					//调用 显示费用明细弹出框方法
					sysCommon.showModel($("#cost-apply-model"));
				});
				$("#traffic-list-info .yt-tbody").append(trHtml);
			}else{
				
			}
		
			personnelFunds.updateTotalNum();
			//调用关闭可编辑弹出框方法
			sysCommon.closeModel($("#cost-apply-model"));
			//调用公共用的清空表单数据方法
			sysCommon.clearFormData();
			
		});
		
		//初始化下拉列表
		$('.yt-select').niceSelect();
		//初始化事件控件
		$("#start-time").calendar({
			controlId: "startTime",
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $("#end-time"), //开始日期最大为结束日期  
			speed:0,
			callback:function(){
				//调用公用的清除验证信息方法
				sysCommon.clearValidInfo($("#start-time"));
			}
		});
		$("#end-time").calendar({
			controlId: "endTime",
			nowData: false, //默认选中当前时间,默认true  
			lowerLimit: $("#start-time"), //结束日期最小为开始日期
			speed:0,
			callback:function(){
				//调用公用的清除验证信息方法
				sysCommon.clearValidInfo($("#end-time"));
			}
		});
		
	},updateTotalNum:function (){
		var fundsTotalNum = 0;
		$(".meet-fee").each(function (){
			fundsTotalNum += $yt_baseElement.rmoney($(this).text());
		});
		$("#applySumMoney").text(fundsTotalNum);
		var sumMoneyLower = arabiaToChinese(fundsTotalNum+"");
		    $("#applyMoneyLower").text(sumMoneyLower);
	}
	 	
	
}


$(function (){
	personnelFunds.init();
})
