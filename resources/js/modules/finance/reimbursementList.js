var projectList = {
	//初始化方法
	init: function() {
		$(".yt-select").niceSelect();
		//初始化日期控件
		$(".end-time-start").calendar({
			controlId: "startDate",
			dateFmt:"yyyy-MM-dd HH:mm",
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $(".end-time-end") //开始日期最大为结束日期  
		});
		$(".end-time-end").calendar({
			controlId: "endDate",
			dateFmt:"yyyy-MM-dd HH:mm",
			nowData: false, //默认选中当前时间,默认true  
			lowerLimit: $(".end-time-start") //结束日期最小为开始日期  
		});
		//调用获取列表数据方法
		projectList.getPlanListInfo();
		//点击流水账号跳转页面
		$('.list-table').on("click", ".class-name", function() {
			var pkId = $(this).parents("tr").find('.pkId').text(); //获取班级编号
			var expenseType = $(this).parents("tr").find('.expenseType').text(); //获取班级编号
			sessionStorage.setItem("searchParams", $('#keyword').val());
			sessionStorage.setItem("pageIndexs", $('.num-text.active').text());
			//expenseType 1:教师课酬报销 2:教师差旅报销
			if(expenseType == 1) {
				window.location.href = "reimbursementLook.html?pkId=" + pkId +'&type=reimbursementList';
			}
			if(expenseType == 2) {
				window.location.href = "reimburseTravelDetailsLook.html?pkId=" + pkId + '&type=reimbursementList';
			}
		});

		//点击删除按钮
		$('.delete-class').click(function() {
			var workFlawState = $("tr.yt-table-active").find(".work-flaw-state").text();
			if (workFlawState != "审批中") {
				if($("tr.yt-table-active").length == 0){
					$yt_alert_Model.prompt("请选择要操作的数据");
				}else{
					 $yt_alert_Model.alertOne({  
				        alertMsg: "数据删除将无法恢复，确认删除吗？", //提示信息  
				        confirmFunction: function() {
				        	projectList.deleteReimbursement();
				        },
				  
				    });  
				}
				
			}else{
				$yt_alert_Model.prompt("无法删除审批中的数据!");
			}
		});
		//点击新增按钮
		$('.add-class').click(function() {
			window.location.href = "reimbursementAdd.html?projectCode="+"";
		});
		//点击修改按钮
		$('.update-class').click(function() {
			var workFlawState = $("tr.yt-table-active").find(".work-flaw-state").text();
			if($("tr.yt-table-active").length != 0) {
				if (workFlawState == "草稿" || workFlawState == "未通过") {
					var pkId = $(".yt-table-active .pkId").text(); //获取参数pkId
					var expenseType = $(".yt-table-active .expenseType").text(); //获取类型
					var projectCode = $(".yt-table-active .projectCode").text();
					if(expenseType == 1) {
						window.location.href = "reimbursementAdd.html?pkId=" + pkId+"&"+"projectCode="+projectCode;
					}
					if(expenseType == 2) {
						window.location.href = "travelAdd.html?pkId=" + pkId+"&"+"projectCode="+projectCode;
					}
				}else{
					$yt_alert_Model.prompt(workFlawState+"的数据不可修改!");
				}
			}else{
				$yt_alert_Model.prompt("请选择要操作的数据");
			}
		});
		
		//点击开票
		$('.ticketOpen-class').on('click', function() {
			var pkId = $('.yt-table-active .pkId').text();
			var workFlawState = $('.yt-table-active .work-flaw-state').text();
			if(pkId == '') {
				$yt_alert_Model.prompt("请选择需要开票的数据");
			} else {
				if (workFlawState == "已通过"||workFlawState == "已支付") {
					//格式化金额输入框的金额数字
					$(".amount-money").blur(function(){
						var money=$(this).val().replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
						console.log('money',money);
						$(this).val($yt_baseElement.fmMoney(money));
					});
					$(".amount-money").focus(function(){
						$(this).val($yt_baseElement.rmoney($(this).val()));
					});
					//点击开票详情弹窗弹窗
					$(".shuttle-box").show();
					//调用算取div显示位置方法 
					$yt_alert_Model.getDivPosition($(".shuttle-box"));
					//调用支持拖拽的方法 
					$yt_model_drag.modelDragEvent($(".shuttle-box .yt-edit-alert-title"));
					//点击取消方法 
					$('.shuttle-box .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
						//隐藏页面中自定义的表单内容  
						$(".yt-edit-alert,#heard-nav-bak").hide();
						$("#pop-modle-alert").hide();
						//隐藏蒙层  
						$("#pop-modle-alert").hide();
					});
					$('.shuttle-box .yt-eidt-model-bottom .yt-model-sure-btn').off().on("click", function() {
						//隐藏页面中自定义的表单内容  
						$(".yt-edit-alert,#heard-nav-bak").hide();
						$("#pop-modle-alert").hide();
						//隐藏蒙层  
						$("#pop-modle-alert").hide();
						projectList.cheques(pkId);
					});
					
				}else if(workFlawState == "已开票"){
					$yt_alert_Model.prompt("此数据已开票");
				}
				else{
					$yt_alert_Model.prompt("请选择已完成报销数据进行开票！");
				}
				
			}
		})
		//点击搜索按钮
		$('.search-btn').click(function() {
			$(".search-box input").val("");
			$("#expenseType").setSelectVal("");
			$("#workFlawState").setSelectVal("");
			projectList.getPlanListInfo();
		});
		//高级搜索
		projectList.hideSearch();
	},
	/** 
	 * 获取列表数据
	 */
	getPlanListInfo: function() {
		sessionStorage.getItem("searchParams")?$('#keyword').val(sessionStorage.getItem("searchParams")):'';
		var queryParams = $('#keyword').val();
		$('.page-info').pageInfo({
			pageIndexs: sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "finance/teacherExpense/lookForAll", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam: queryParams,
				createTimeStart: $(".search-box .end-time-start").val(),
				createTimeEnd: $(".search-box .end-time-end").val(),
				teacherCountStart: $(".search-box .teacher-start").val(),
				teacherCountEnd: $(".search-box .teacher-end").val(),
				expenseMoneyStart: $(".search-box .expense-start").val(),
				expenseMoneyEnd: $(".search-box .expense-end").val(),
				expenseType: $(".search-box #expenseType").val(),
				workFlawState:$(".search-box #workFlawState").val(),
				flowNumber:$(".search-box .flow-number").val(),
				projectCode:$(".search-box .project-code").val(),
				projectName:$(".search-box .project-name").val(),
				projectHead:$(".search-box .project-head").val()
			}, //ajax查询访问参数
			before:function(){
				$yt_baseElement.showLoading();
			},
			async:true,
			success: function(data) {
				sessionStorage.clear();
				if(data.flag == 0) {
					$('.open-class-tbody').empty();
					var htmlTbody = $('.open-class-tbody');
					var htmlTr = '';
					if(data.data.rows.length != 0) {
						$('.page-info').show();
						$.each(data.data.rows, function(i, v) {
							var expenseType = Number(v.expenseType);
							//1:教师课酬报销 2:教师差旅报销
							if(expenseType == 1) {
								expenseType = '教师课酬报销';
							}
							if(expenseType == 2) {
								expenseType = '教师差旅报销';
							}
							v.workFlawState=='已完成'?v.workFlawState='已通过':v.workFlawState=v.workFlawState;
							v.createTime==null?v.createTime='':v.createTime=v.createTime;
							htmlTr += '<tr class="td-list">' +
								'<td class="pkId" style="display:none;"><input type="hidden" class="project-code" value="' + v.projectCode + '" />' + v.pkId + '</td>' +
								'<td style="text-align:center;"><a class="class-name"style="color: #3c4687;">' + v.flowNumber + '</a></td>' +
								'<td class="expenseType" style="display:none;"><input type="hidden" class="cheque-number-hid" value="' + v.chequeNumber + '" />' + v.expenseType + '</td>' +
								'<td><input type="hidden" class="cheque-money-hid" value="' + v.chequeNumberMoney + '" />' + expenseType + '</td>' +
								'<td class="projectCode">' + v.projectCode + '</td>' +
								'<td style="text-align:left !important;">' + v.projectName + '</td>' +
								'<td>' + v.projectHead + '</td>' +
								'<td>' + v.createTime + '</td>' +
								'<td style="text-align:right !important;">' + v.teacherCount + '</td>' +
								'<td>' + $yt_baseElement.fmMoney(v.expenseMoney) + '</td>' +
								'<td class="work-flaw-state">' + v.workFlawState + '</td>' +
								'</tr>';
						});
					} else {
						$('.page-info').hide();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="8" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
					}
					htmlTbody.append(htmlTr);
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
	/**
	 * 删除数据
	 */
	deleteReimbursement: function() {
		if($("tr.yt-table-active").length == 0) {
			$yt_alert_Model.prompt("请选择要操作的数据");
			return false;
		}
		var pkId = $(".yt-table-active .pkId").text(); //获取参数pkId
		var downUrl = $yt_option.base_path + "finance/teacherExpense/removeBeanByIdTravel";
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: downUrl,
			async: true,
			data: {
				pkId: pkId,
				isDownload: true,
			},
			success: function(data) {
				if(data.flag == 0) {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("删除成功");
					});
					projectList.refreshEffective();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("删除失败");
					});
				}
			}
		});
	},
	/**
	 * 刷新列表 
	 */
	refreshEffective: function() {
		$('.page-info').pageInfo("refresh");
	},
	//开票
	cheques: function(pkId) {
		var chequeNumber = $(".cheque-number").val();
		var chequeNumberMoney = ($('.amount-money').val()).split(',').join('');
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/teacherExpense/updateOpenedCheques",
			async: true,
			data: {
				chequeNumber:chequeNumber,
				chequeNumberMoney:chequeNumberMoney,
				pkId: pkId
			},
			success: function(data) {
				if(data.flag == 0) {
					//初始化页面列表
					projectList.getPlanListInfo();
					$yt_alert_Model.prompt("开票成功");
				} else {
					$yt_alert_Model.prompt("开票失败");
				}
			}
		});
	},
	/**
	 * 高级搜索
	 */
	hideSearch:function(){
		var clickTime=0;
		$("button.senior-search-btn").click(function(e){
			if(clickTime%2==0){
				$('#keyword').val('');
				$(".search-box").show();
				$(".search-put").addClass('flipy');
			}else{
				$(".search-box").hide();
//				$(".search-box input").val("");
//				$("#expenseType").setSelectVal("");
//				$("#workFlawState").setSelectVal("");
				$(".search-put").removeClass('flipy');
			}
			clickTime++;
			e.stopPropagation();
		});
		$(document).click(function(e){
			clickTime=0;
			$(".search-box").hide();
//			$(".search-box input").val("");
//			$("#expenseType").setSelectVal("");
//			$("#workFlawState").setSelectVal("");
			$(".search-put").removeClass('flipy');
			e.stopPropagation();
		});
		//点击高级搜索里面的确定按钮
		$(".search-box .yt-model-sure-btn").click(function(){
			projectList.getPlanListInfo();
		});
		//点击高级搜索里面的重置按钮
		$(".search-box .yt-model-reset-btn").click(function(){
			$(".search-box input").val("");
			$("#expenseType").setSelectVal("");
			$("#workFlawState").setSelectVal("");
		});
	}
};
$(function() {
	//初始化方法
	projectList.init();
});