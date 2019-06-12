var projectList = {
	//初始化方法
	init: function() {
		if($yt_common.GetQueryString("page")&&$yt_common.GetQueryString("page")==2){
			$(".tab-title-list button").eq(1).addClass("active").siblings().removeClass("active");
			$(".details-box .original-box").hide().eq(1).show();
			$('.yt-input.pending-approval-selectParam').val("");
			$(".search-box").attr('thisIndex',1);
			$(".list1").hide();
			$(".list2").show();
			projectList.getPlanListInfoSure(); //获取审批记录
			$('.title-h1').text('审批记录列表');
		}else{
			//调用获取列表数据方法
			projectList.getPlanListInfo();
			$(".list2").hide();
		}
		//初始化下拉控件
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
		//设置列表样式/切换页签
		$(".tab-title-list button").click(function() {
			$(this).addClass("active").siblings().removeClass("active");
			$(".details-box .original-box").hide().eq($(this).index()).show();
			$('.yt-input.pending-approval-selectParam').val("");
			if($(this).index() == 0) {
				$(".search-box").attr('thisIndex',0);
				$(".list1").show();
				$(".list2").hide();
				projectList.getPlanListInfo(); //获取待审批
				$('.title-h1').text('待审批列表');
			} else if($(this).index() == 1) {
				$(".search-box").attr('thisIndex',1);
				$(".list2").show();
				$(".list1").hide();
				projectList.getPlanListInfoSure(); //获取审批记录
				$('.title-h1').text('审批记录列表');
			}
		});
		//点击流水账号跳转页面
		$('.list-table').on("click", ".class-name1", function() {
			var pkId = $(this).parents("tr").find('.pkId').text(); //获取班级编号
			var expenseType = $(this).parents("tr").find('.expenseType').text(); //获取班级编号
			sessionStorage.setItem("searchParams", $('.keyword1').val());
			sessionStorage.setItem("pageIndexs", $('.n-page .num-text.active').text());
			//expenseType 1:教师课酬报销 2:教师差旅报销
			if(expenseType == 1) {
				window.location.href = "reimbursementDetails.html?pkId=" + pkId;
			}
			if(expenseType == 2) {
				window.location.href = "reimburseTravelDetails.html?pkId=" + pkId;
			}
		});
		//点击流水账号跳转页面
		$('.list-table').on("click", ".class-name2", function() {
			var pkId = $(this).parents("tr").find('.pkId').text(); //获取班级编号
			var expenseType = $(this).parents("tr").find('.expenseType').text(); //获取班级编号
			sessionStorage.setItem("searchParams", $('.keyword1').val());
			sessionStorage.setItem("pageIndexs", $('.n-page .num-text.active').text());
			//expenseType 1:教师课酬报销 2:教师差旅报销
			//page=2  审批记录
			if(expenseType == 1) {
				window.location.href = "reimbursementLook.html?pkId=" + pkId + '&type=reimburseExamination&page=2';
			}
			if(expenseType == 2) {
				window.location.href = "reimburseTravelDetailsLook.html?pkId=" + pkId + '&type=reimburseExamination&page=2';
			}
		});
		//模糊查询
		$('.yt-option-btn.search-btn').click(function() {
			$('.search-box #expenseType').setSelectVal("");
			$('.search-box input.yt-input').val("");
			$('.search-box input.calendar-input').val("");
			var clickTab=$(".tab-title-list button.active").index();
			var queryParams = $('.yt-input.pending-approval-selectParam').val();
			if(clickTab==0){
				projectList.getPlanListInfo(queryParams);
			}else if(clickTab==1){
				projectList.getPlanListInfoSure(queryParams);
			}
			console.log('clickTab',clickTab);
		});
//		$('.search-btn2').click(function() {
//			var queryParams = $('.keyword2').val();
//			projectList.getPlanListInfo(queryParams);
//		});
		//高级搜索
		projectList.hideSearch();
	},
	/** 
	 * 获取待审批列表数据
	 */
	getPlanListInfo: function(queryParams) {
		sessionStorage.getItem("searchParams")?$('.keyword1').val(sessionStorage.getItem("searchParams")):'';
		var flowNumber=$('.search-box .flow-number').val();
		var projectCode=$('.search-box .class-code').val();
		var projectName=$('.search-box .belong-class').val();
		var projectHead=$('.search-box .project-head').val();
		var createTimeStart=$('.search-box .end-time-start').val();
		var createTimeEnd=$('.search-box .end-time-end').val();
		var teacherCountStart=$('.search-box .teacher-start').val();
		var teacherCountEnd=$('.search-box .teacher-end').val();
		var expenseMoneyStart=$('.search-box .expense-start').val();
		var expenseMoneyEnd=$('.search-box .expense-end').val();
		var expenseType=$('.search-box #expenseType').val();
//		var userName=$('.search-box .user-name').val();
		//var workFlawState=$('.search-box .flow-number').val();
		$('.n-page').pageInfo({
			pageIndexs: sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "finance/teacherExpense/lookForAllByApproved", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam: queryParams,
				flowNumber:flowNumber,
				projectCode:projectCode,
				projectName:projectName,
				projectHead:projectHead,
				createTimeStart: createTimeStart,
				createTimeEnd: createTimeEnd,
				teacherCountStart:teacherCountStart,
				teacherCountEnd:teacherCountEnd,
				expenseMoneyStart: expenseMoneyStart,
				expenseMoneyEnd: expenseMoneyEnd,
				expenseType: expenseType,
				workFlawState: ""
//				userName:userName
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			async:true,
			before:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				sessionStorage.clear();
				if(data.flag == 0) {
					var htmlTbody = $('.n-tbody').empty();
					var htmlTr = '';
					if(data.data.rows.length > 0) {
						$('.n-page').show();
						$.each(data.data.rows, function(i, v) {
							var expenseType = Number(v.expenseType);
							//1:教师课酬报销 2:教师差旅报销
							if(expenseType == 1) {
								expenseType = '教师课酬报销';
							}
							if(expenseType == 2) {
								expenseType = '教师差旅报销';
							}
							 v.workFlawState =='已完成'? v.workFlawState ='已通过': v.workFlawState = v.workFlawState ;
							htmlTr = '<tr class="td-list">' +
								'<td class="pkId" style="display:none;">' + v.pkId + '</td>' +
								'<td><a class="class-name1"style="color: #3c4687;">' + v.flowNumber + '</a></td>' +
								'<td class="expenseType" style="display:none;">' + v.expenseType + '</td>' +
								'<td>' + expenseType + '</td>' +
								'<td>' + v.projectCode + '</td>' +
								'<td style="text-align:left;">' + v.projectName + '</td>' +
								'<td>' + v.projectHead + '</td>' +
								'<td>' + v.createTimeString + '</td>' +
								'<td>' + v.teacherCount + '</td>' +
								'<td>' + $yt_baseElement.fmMoney(v.expenseMoney)  + '</td>' +
								'<td class="work-flaw-state">' + v.dealingWithPeople + '</td>' +
								'</tr>';
							htmlTbody.append(htmlTr);
						});
					} else {
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="9" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						htmlTbody.append(htmlTr);
						$('.n-page').hide();
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
	/** 
	 * 获取已审批列表数据
	 */
	getPlanListInfoSure: function(queryParams) {
		var flowNumber=$('.search-box .flow-number').val();
		var projectCode=$('.search-box .class-code').val();
		var projectName=$('.search-box .belong-class').val();
		var projectHead=$('.search-box .project-head').val();
		var createTimeStart=$('.search-box .end-time-start').val();
		var createTimeEnd=$('.search-box .end-time-end').val();
		var teacherCountStart=$('.search-box .teacher-start').val();
		var teacherCountEnd=$('.search-box .teacher-end').val();
		var expenseMoneyStart=$('.search-box .expense-start').val();
		var expenseMoneyEnd=$('.search-box .expense-end').val();
		var expenseType=$('.search-box #expenseType').val();
//		var userName=$('.search-box .user-name').val();
		$('.y-page').pageInfo({
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "finance/teacherExpense/lookForAllByHi", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam: queryParams,
				flowNumber:flowNumber,
				projectCode:projectCode,
				projectName:projectName,
				projectHead:projectHead,
				createTimeStart: createTimeStart,
				createTimeEnd: createTimeEnd,
				teacherCountStart:teacherCountStart,
				teacherCountEnd:teacherCountEnd,
				expenseMoneyStart: expenseMoneyStart,
				expenseMoneyEnd: expenseMoneyEnd,
				expenseType: expenseType,
				workFlawState: ""
//				userName:userName
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			async:true,
			before:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.y-tbody').empty();
					var htmlTr = '';
					if(data.data.rows.length > 0) {
						$('.y-page').show();
						$.each(data.data.rows, function(i, v) {
							var expenseType = Number(v.expenseType);
							//1:教师课酬报销 2:教师差旅报销
							if(expenseType == 1) {
								expenseType = '教师课酬报销';
							}
							if(expenseType == 2) {
								expenseType = '教师差旅报销';
							}
							htmlTr = '<tr class="td-list">' +
								'<td class="pkId" style="display:none;">' + v.pkId + '</td>' +
								'<td><a class="class-name2"style="color: #3c4687;">' + v.flowNumber + '</a></td>' +
								'<td class="expenseType" style="display:none;">' + v.expenseType + '</td>' +
								'<td>' + expenseType + '</td>' +
								'<td>' + v.projectCode + '</td>' +
								'<td style="text-align:left;">' + v.projectName + '</td>' +
								'<td>' + v.projectHead + '</td>' +
								'<td>' + v.createTimeString + '</td>' +
								'<td style="text-align:right;">' + v.teacherCount + '</td>' +
								'<td style="text-align:right;">' + $yt_baseElement.fmMoney(v.expenseMoney) + '</td>' +
								'<td>' + v.dealingWithPeople + '</td>' +
								'</tr>';
							htmlTbody.append(htmlTr);
						});
					} else {
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="9" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						htmlTbody.append(htmlTr);
						$('.y-page').hide();
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
	/**
	 * 高级搜索
	 */
	hideSearch:function(){
		var clickTime=0;
		$("button.senior-search-btn").click(function(e){
			if(clickTime%2==0){
				$(".keyword1").val('');
				$(".search-box").show();
				$(".search-put").addClass('flipy');
			}else{
				$(".search-box").hide();
//				$('.search-box #expenseType').setSelectVal("");
//				$('.search-box input.yt-input').val("");
//				$('.search-box input.calendar-input').val("");
				$(".search-put").removeClass('flipy');
			}
			clickTime++;
			e.stopPropagation();
		});
		$(document).click(function(){
			clickTime=0;
			$(".search-box").hide();
//			$('.search-box #expenseType').setSelectVal("");
//			$('.search-box input.yt-input').val("");
//			$('.search-box input.calendar-input').val("");
			$(".search-put").removeClass('flipy');
		});
		//金额输入框失去焦点
		$(".expense-tr input").blur(function(){
			$(this).val($(this).val().replace(/[^\d.]/g,""));
			$(this).val(Number($(this).val()));
		});
		//点击弹框搜索按钮
		$(".search-box .yt-model-sure-btn").click(function(){
			if($(".search-box").attr('thisIndex')==0){
				projectList.getPlanListInfo('');//待审批列表
			}else{
				projectList.getPlanListInfoSure('');//审批记录列表
			}
		});
		//点击弹框清空按钮
		$(".search-box .yt-model-reset-btn").click(function(){
			$('.search-box #expenseType').setSelectVal("");
			$('.search-box input.yt-input').val("");
			$('.search-box input.calendar-input').val("");
		});
	}

};
$(function() {
	//初始化方法
	projectList.init();
});