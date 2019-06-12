var printingList = {
	//初始化方法
	init: function() {
		
		//调用获取列表数据方法
		printingList.getprintingListInfo();
		$('.search-select-states').niceSelect();
		$('.search-select-states').change(function(){
			printingList.getprintingListInfo($(this).val());
		})
		//条件搜索
		$('.search-btn').click(function() {
			//调用获取列表数据方法查询
			printingList.getprintingListInfo();
		});
		//点击作废
		$(".btn-invalid").click(function(){
			if($("tr.yt-table-active").length == 0){
				$yt_alert_Model.prompt("请选择要操作的数据");
				return false;
			}
			if($(".yt-table-active .states-input").val()!=4&&$(".yt-table-active .states-input").val()!=2){
				var states = 4;
				printingList.amendPrintingStates(states);
			 	$yt_alert_Model.prompt("已作废");
			}else{
				$yt_alert_Model.prompt("请选择等待打印的文件进行作废");
			}
			if($(".yt-table-active .states-input").val()!=4&&$(".yt-table-active .states-input").val()==2){
				$yt_alert_Model.prompt("该文件已经打印,无法作废");
			}
		});
		//点击恢复
		$(".btn-restore").click(function(){
			if($("tr.yt-table-active").length == 0){
				$yt_alert_Model.prompt("请选择要操作的数据");
				return false;
			}
			if($(".yt-table-active .states-input").val()==4){
				var states = 3;
				printingList.amendPrintingStates(states);
				$yt_alert_Model.prompt("已恢复");
			}else{
				$yt_alert_Model.prompt("请选择作废文件进行恢复");
			}
		});
		//点击文件名称
		$(".printing-tbody").on('click','.file-name',function(){
			sessionStorage.setItem("searchParams", $('#keyword').val());
			sessionStorage.setItem("pageIndexs", $('.num-text.active').text());
			window.location.href="printingDetails.html?pkId=" + $('.yt-table-active .pkId').val();
		});
	},
		
	/**
	 * 获取列表数据
	 */
	getprintingListInfo: function(printingStates) {
		sessionStorage.getItem("searchParams")?$('#keyword').val(sessionStorage.getItem("searchParams")):'';
		var searchParameters=$('#keyword').val(); 
		$('.printing-page').pageInfo({
			pageIndexs: sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "class/printing/lookForAll", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				searchParameters:searchParameters,
				printingStates:printingStates,
				startTime:"",
				endTime:"",
				createTimeStart:"",
				createTimeEnd:""
			}, //ajax查询访问参数
			async:true,
			before:function(){
				$yt_baseElement.showLoading();
			},
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				sessionStorage.clear();
				if(data.flag == 0) {
					var htmlTbody = $('.printing-tbody');
					var htmlTr = '';
					var num = 1;
					if(data.data.rows.length > 0) {
						$.each(data.data.rows, function(i, v) {
							if(v.fileName==null){
								v.fileName="";
							}
							if(v.projectCode==null){
								v.projectCode="";
							}
							if(v.projectName==null){
								v.projectName="";
							}
							if(v.projectUserName=="null"){
								v.projectUserName="";
							}
							if(v.startDate==null){
								v.startDate="";
							}
							if(v.endDate==null){
								v.endDate="";
							}
//							v.createTimeString = v.createTimeString.substring(v.createTimeString.length-3,v.createTimeString);
							v.startDate = v.startDate.split(" ")[0];
							v.endDate = v.endDate.split(" ")[0];
							htmlTr += '<tr>' +
								'<td><input type="hidden" value="' + v.pkId + '" class="pkId">' + num++ + '</td>' +
								'<td style="text-align: left;color:#3c4687 !important;"><a style="color:#3c4687;" class="file-name">'+v.fileName+'</a></td>' +
								'<td >' + v.createUserName + '</td>' +
								'<td>' + v.createTimeString + '</td>' +
								'<td class="text-overflow"">' + v.projectCode + '</td>' +
								'<td class="text-overflow" style="text-align: left;">' + v.projectName + '</td>' +
								'<td style="text-align: left;">' + v.projectUserName + '</td>' +
								'<td>' + v.startDate + '</td>' +
								'<td>' + v.endDate + '</td>' +
								'<td><input type="hidden" value="' + v.states + '" class="states-input">' + (v.states==1?"打印中":(v.states==2?"已完成":(v.states==3?"等待打印":"已作废"))) + '</td>' +
								'</tr>';
								$(".printing-page").show();
						});
					} else {
						$(".printing-page").hide();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="10" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
					}
					htmlTbody.html(htmlTr);
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function (){
						$yt_alert_Model.prompt("查询失败");
					});
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	//文印管理状态修改
	amendPrintingStates:function(states){
		var pkId = $(".yt-table-active .pkId").val();
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "class/printing/updatePrinting", //ajax访问路径  
			data: {
				pkId:pkId,  
				states:states
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0){
				 	$('.printing-page').pageInfo("refresh");
				}else{
					$yt_alert_Model.prompt("操作失败");
				}
			} 
		});
	}
	
}
$(function() {
	//初始化方法
	printingList.init();
	
});