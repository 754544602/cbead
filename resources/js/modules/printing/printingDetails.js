var printingDetailsList = {
	//初始化方法
	init: function() {
		
		//调用获取列表数据方法
		printingDetailsList.getPrintingDetails();
		//禁用input
		$(".printing-details .yt-input").attr("disabled","disabled");
		//获取跳转页面传过来的pkId,statesHref
		var pkId = $yt_common.GetQueryString('pkId');
		
		//点击打印完成并通知提交人
		$(".btn-sub").click(function(){
			if($(".current-state-text").text()!="已作废"){
				printingDetailsList.printCompleteNotice();
			}else{
				$yt_alert_Model.prompt("改文件已作废,无法打印");
			}
		});
		//点击取消返回文印管理列表
		$(".btn-off").click(function(){
			window.location.href="printingList.html";
		});
		//点击返回返回文印管理列表
		$(".btn-return").click(function(){
			window.location.href="printingList.html";
		});
	},
	//项目查询一条详细信息
	getPrintingDetails: function() {
			var pkId = $yt_common.GetQueryString('pkId');
			$.ajax({
				type: "post", //ajax访问方式 默认 "post"  
				url: $yt_option.base_path + "class/printing/getBeanById", //ajax访问路径  
				data: {
					pkId:pkId
				}, //ajax查询访问参数
				success: function(data) {
					$(".file-name").text(data.data.fileName);
					$('.file-name').attr('href',data.data.fileUrl);
					if(data.data.states==2){
						$(".current-state-text").text("已完成");
					}
					if(data.data.states==3){
						$(".current-state-text").text("等待打印");
					}
					if(data.data.states==4){
						$(".current-state-text").text("已作废");
						$('.btn-sub').hide();
					}
					if(data.data.fileType==1){
						$(".file-type").text("课件");
					}
					if(data.data.fileType==2){
						$(".file-type").text("通讯录");
					}
					if(data.data.fileType==3){
						$(".file-type").text("学员手册");
					}
					if(data.flag == 0){
						$(".get-project-inf").setDatas(data.data);
						//从返回的值里给select赋值
						$(".project-type").setSelectVal(data.data.projectType);
						if(data.data.states==2){
							$('.btn-all').css('visibility','hidden');
						}
					}else{
						$yt_alert_Model.prompt("获取失败");
					}
				}
			});
	},
	//打印完成并通知提交人
	printCompleteNotice: function() {
			var pkId = $yt_common.GetQueryString('pkId');
			$.ajax({
				type: "post", //ajax访问方式 默认 "post"  
				url: $yt_option.base_path + "class/printing/updatePrintingFinished", //ajax访问路径  
				data: {
					pkId:pkId,
					states:2
				}, //ajax查询访问参数
				success: function(data) {
					if(data.flag == 0){
						$yt_alert_Model.prompt("操作成功");
						window.location.href="printingList.html";
					}else{
						$yt_alert_Model.prompt("操作失败");
					}
				}
			});
	}
	
}
$(function() {
	//初始化方法
	printingDetailsList.init();
	
});