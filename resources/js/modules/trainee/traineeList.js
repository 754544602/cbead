var carList = {
	//初始化方法
	init: function() {
		var back = $yt_common.GetQueryString("back");
		if (back == 1) {
			var searchUrl =window.location.href;
	        var hrefData =searchUrl.split("=");        //截取 url中的“=”,获得“=”后面的参数
			$('#keyword').val(decodeURI(hrefData[3]));
		}
		//调用获取列表数据方法
		carList.getPlanListInfo();
		//点击查询
		$('.key-word').off().on('click', '.search-btn', function() {
			//调用获取列表数据方法查询
			carList.getPlanListInfo();
		});
		//点击合并
		$(".merge").click(function (){
			var traineeId = "";
			if ($('.select-assets-alert-checkbox input[class="select-assets-trainee-id"]:checked').length > 2) {
				$yt_alert_Model.prompt("请选中两条记录进行操作", 3000);
				return false;
			}
			$('.select-assets-alert-checkbox input[class="select-assets-trainee-id"]:checked').each(function() {
				if(traineeId == "") {
					traineeId = $(this).val();
				} else {
					traineeId += "," + $(this).val();
				}
			});
			if(traineeId == "") {
				$yt_alert_Model.prompt("请选中两条记录进行操作", 3000);
			} else {
				$yt_alert_Model.alertOne({
					alertMsg: "合并后无法恢复，学员的基本信息将以最新的为准，是否合并？", //提示信息  
					confirmFunction: function() { //点击确定按钮执行方法  
						$.ajax({
							type: "post",
							url: $yt_option.base_path+"trainee/updateTraineMergeEvisitingRecords",
							data:{
								pkIds:traineeId
							},
							async: false,
							success: function(data) {
								$yt_alert_Model.prompt("合并成功！", 2000);
								//调用获取列表数据方法刷新数据
								carList.getPlanListInfo();
							}
						});
					},
				});
			}
		});
		//点击名字跳转到新详情页
		$('.list-table').on('click','.trainee-name',function(){
			var keyword = $('#keyword').val();
			var traineeId = $(this).parent().find(".trainee-id").text();
			var pageNum = $('.num-text.change-btn.active').text();
			sessionStorage.setItem("searchParams", $('#keyword').val());
			sessionStorage.setItem("pageIndexs", $('.num-text.active').text());
			window.location.href =encodeURI("traineeInfo.html?traineeId="+traineeId+"&pageNum="+pageNum+"&keyword="+keyword);   //使用encodeURI编码
		});
		//全选  
		$("input.check-all").change(function() {
			//判断自己是否被选中  
			if($(this).parent().hasClass("check")) {
				//设置反选  
				$(this).parents("table").find("tbody input[type='checkbox']").setCheckBoxState("uncheck");
				$(".class-tbody").find("td").removeClass("yt-table-active");
				$(".class-tbody").find("tr").removeClass("yt-table-active");
			} else {
				//调用设置选中方法,全选  
				$(this).parents("table").find("tbody input[type='checkbox']").setCheckBoxState("check");
				$(".class-tbody").find("td").addClass("yt-table-active");
			}
			
		});
		//修改全选按钮状态
		$(".check-all-tab tbody").on("change","input[type='checkbox']",function (){
			if($(this).parents("table").find("tbody tr").length != $(this).parents("table").find("tbody input[type='checkbox']:checked").length){
				$(this).parents("table").find("input.check-all").setCheckBoxState("uncheck");
			}else{
				$(this).parents("table").find("input.check-all").setCheckBoxState("check");
			}
		});
	},
	


	/**
	 * 获取车辆信息列表
	 */
	getPlanListInfo: function() {
		sessionStorage.getItem("searchParams")?$('#keyword').val(sessionStorage.getItem("searchParams")):'';
		var keyword = $('#keyword').val();
		$('.page-info').pageInfo({
			async: true,
			pageIndexs: sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "trainee/getTraineeList", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			after:function (){
				//点击当前行选中当前行并且复选框被勾选
				$(".class-tbody tr").unbind('click').bind("click", function() {
					if($(this).find("input[type='checkbox']")[0].checked == true) {
						$(this).find("input[type='checkbox']").setCheckBoxState("uncheck");
						$(this).find("td").removeClass("yt-table-active");
					} else {
						$(this).find("input[type='checkbox']").setCheckBoxState("check");
						$(this).find("td").addClass("yt-table-active");
					}
					if($(".class-tbody input:checkbox").not("input:checked").length > 0){
						$(".check-all").setCheckBoxState("uncheck");
					}else{
						$(".check-all").setCheckBoxState("check");
					}
				});
			},
			before:function(){
					$yt_baseElement.showLoading();
			},
			data: {
				selectParam: keyword
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				sessionStorage.clear();
				var carStates="";
				if(data.flag == 0) {
					var htmlTbody = $('.list-table .yt-tbody');
					var htmlTr = '';
					var num = 1;
					var gender;
					var pageNumber = (Number(this.pageDoc.pageInfo.pageIndexs)-1)*Number(this.pageDoc.pageInfo.pageNum);
					if(data.data.rows.length > 0) {
						$(htmlTbody).empty();
						$.each(data.data.rows, function(i, v) {
							i = i + 1;
							if (v.gender==1) {
								gender="男";
							};
							if (v.gender==2) {
								gender="女";
							}
							if (v.gender=="") {
								gender="";
							}
							htmlTr = '<tr>' +
								'<td style="width:33px;position:relative;">'+
									'<div style="position: absolute;top: 5px;z-index:100;width: 30px;height: 30px;opacity: 0;"></div>'+
									'<label class="check-label yt-checkbox select-assets-alert-checkbox" style="margin-left: 9px;">'+
										'<input type="checkbox" name="test" class="select-assets-trainee-id" value="' + v.traineeId + '"/>'+
									'</label>'+
								'</td>'+
								'<td class="th-center">' + (pageNumber+i) + '</td>' +
								'<td style="display:none;" class="trainee-id">' + v.traineeId + '</td>' +
								'<td class="td-left trainee-name" ><a style="color:#3c4687;" class="yt-link" style="text-decoration: none;">' + v.traineeName + '</a></td>' +
								'<td class="th-center">' + gender + '</td>' +
								'<td class="td-left">' + v.groupName + '</td>' +
								'<td class="td-left">' + v.orgName + '</td>' +
								'<td class="th-center">' + v.deptPosition + '</td>' +
								'<td class="th-center">' + v.firstDate + '</td>' +
								'<td class="th-center">' + v.endDate + '</td>' +
								'<td class="td-right" style="text-align:right;">' + v.timesNumber + '</td>' +
								'<td class="td-right" style="width:33px;text-align:right;">' + v.trainNumber + '</td>' +
								'</tr>';
							htmlTbody.append(htmlTr);
						});
						$('.page-info').show();
					}else {
						$(htmlTbody).empty();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="10" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						htmlTbody.append(htmlTr);
						$('.page-info').hide();
					}
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	//删除
	delCarList: function() {
		var pkId = $('.yt-table-active .pkId').val();
		$yt_alert_Model.alertOne({
			haveCloseIcon: false, //是否带有关闭图标  
			closeIconUrl: "", //关闭图标路径  
			leftBtnName: "确定", //左侧按钮名称,默认确定  
			rightBtnName: "取消", //右侧按钮名称,默认取消  
			cancelFunction: "", //取消按钮操作方法*/  
			alertMsg: "数据删除将无法恢复，确认删除吗？", //提示信息  
			confirmFunction: function() { //点击确定按钮执行方法  
				$.ajax({
					type: "post",
					url: $yt_option.base_path + "administrator/car/removeBeanById",
					data: {
						pkId: pkId
					},
					success: function(data) {
						if(data.flag == 0) {
							$yt_alert_Model.prompt("删除成功");
//							$yt_baseElement.hideLoading(function() {
//								$yt_alert_Model.prompt("删除成功");
//							});
							$('.page-info').pageInfo("refresh");
						} else {
							$yt_alert_Model.prompt("删除失败");
//							$yt_baseElement.hideLoading(function() {
//								$yt_alert_Model.prompt("删除失败");
//							});
							
						}
					}

				});

			}
		});
	}
}
$(function() {
	//初始化方法
	carList.init();
});