/**
 * 费用支付反馈列表查询
 */
var projectList = {
	//初始化方法
	init: function() {
		//初始化下拉控件
		$(".yt-select").niceSelect();
		//点击申请人输入框
		var time=0;
		var time1=0;
		var time2=0;
		//初始化日期控件
		$(".apply-time-start").calendar({
			controlId: "startDate",
			dateFmt:"yyyy-MM-dd HH:mm",
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $(".apply-time-end") //开始日期最大为结束日期  
		
		});
		$(".apply-time-end").calendar({
			controlId: "endDate",
			dateFmt:"yyyy-MM-dd HH:mm",
			nowData: false, //默认选中当前时间,默认true  
			lowerLimit: $(".apply-time-start") //结束日期最小为开始日期  
			
		});
		$(".start-time-start").calendar({
			controlId: "startDate",
			dateFmt:"yyyy-MM-dd",
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $(".start-time-end") //开始日期最大为结束日期  
		});
		$(".start-time-end").calendar({
			controlId: "endDate",
			dateFmt:"yyyy-MM-dd",
			nowData: false, //默认选中当前时间,默认true  
			lowerLimit: $(".start-time-start") //结束日期最小为开始日期  
		});
		$(".end-time-start").calendar({
			controlId: "startDate",
			dateFmt:"yyyy-MM-dd",
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $(".end-time-end") //开始日期最大为结束日期  
		});
		$(".end-time-end").calendar({
			controlId: "endDate",
			dateFmt:"yyyy-MM-dd",
			nowData: false, //默认选中当前时间,默认true  
			lowerLimit: $(".end-time-start") //结束日期最小为开始日期  
		});
		//调用获取列表数据方法
		projectList.getPlanListInfo();
		//点击流水账号跳转页面
		$('.list-table').on("click", ".class-name", function() {
			var pkId = $(this).parents("tr").find('.pkId').text(); //获取班级编号
			var expenseType = $(this).parents("tr").find('.expenseType').text(); //获取班级编号
			var workFlawState =  $(this).parents("tr").find('.workFlawState').text();
			sessionStorage.setItem("searchParams", $('#keyword').val());
			sessionStorage.setItem("pageIndexs", $('.num-text.active').text());
			//expenseType 1:教师课酬报销 2:教师差旅报销
			if(expenseType == 1) {
				if(workFlawState=='已开票'){
					window.location.href = "reimbursementLook.html?pkId=" + pkId +'&type=reimbursementPayment';
				}else{
					window.location.href = "reimburDetailPayment.html?pkId=" + pkId +'&type=reimbursementPayment';
				}
			}
			if(expenseType == 2) {
				if(workFlawState=='已开票'){
					window.location.href = "reimburseTravelDetailsLook.html?pkId=" + pkId+'&type=reimbursementPayment';
				}else{
					window.location.href = "reimburseTravelDetailsPayment.html?pkId=" + pkId;
				}
				
			}
		});
		$('.back-btn').click(function(){
			window.history.back();
		})
		//点击搜索按钮
		$('.search-btn').click(function() {
			$(".search-box table.search-table input").val("");
			$("#expenseType").setSelectVal('');
			$("#workFlawState").setSelectVal('');
			projectList.getPlanListInfo();
		});
		//高级搜索
		projectList.hideSearch();
		//自定义查询页签	点击搜索条件部分收起树形列表
		$(".search-form").click(function(){
			time=0;
			time1=0;
			time2=0;
			$("#treeDiv").hide();
			$("#treeDiv1").hide();
			$("#treeDiv2").hide();
		});
		//页签切换
		$(".tab-title-box button").click(function(){
			$(this).addClass('active').siblings().removeClass('active');
			var thisIndex=$(this).index();
			$(".content-div").eq(thisIndex).show().siblings('.content-div').hide();
			if(thisIndex==0){
				$(".page-main").css('min-width','1005px');
				//列表查询列表
				projectList.getPlanListInfo();
			}else{
				$("div.search-form table label input[name='test'][value='2']").setRadioState("check");
				$("div.travel-div").hide();
				$("div.class-rem-div").hide();
				time=0;
				time1=0;
				time2=0;
				$("#treeDiv").hide();
				$("#treeDiv1").hide();
				$("#treeDiv2").hide();
				$("div.travel-div tbody,div.class-rem-div tbody").off().on('click','tr',function(){
					$(this).removeClass('yt-table-active');
				});
				//班级可搜索下拉
				projectList.getBlongClass();
				//重置
				projectList.resertSearch();
				//教师可搜索下拉
				projectList.getTeacher();
			}
		});
		//点击申请人
		$("div.apply-man").click(function(e){
			if(time%2==0){
				$("#treeDiv").show();
				$("#treeDiv1").hide();
				$("#treeDiv2").hide();
				 time1=0;
				 time2=0;
			}else{
				$("#treeDiv").hide();
			}
			time++;
			e.stopPropagation();
		});
		//点击项目主任
		$("div.project-dir").click(function(e){
			if(time1%2==0){
				$("#treeDiv1").show();
				$("#treeDiv2").hide();
				$("#treeDiv").hide();
				 time=0;
				 time2=0;
			}else{
				$("#treeDiv1").hide();
			}
			time1++;
			e.stopPropagation();
		});
		//点击班主任
		$("div.project-class-dir").click(function(e){
			if(time2%2==0){
				$("#treeDiv2").show();
				$("#treeDiv").hide();
				$("#treeDiv1").hide();
				time=0;
		 		time1=0;
			}else{
				$("#treeDiv2").hide();
			}
			time2++;
			e.stopPropagation();
		});
		//查询按钮
		$("button.senior-query-btn").click(function(){
			time=0;
			time1=0;
			time2=0;
			$("#treeDiv").hide();
			$("#treeDiv1").hide();
			$("#treeDiv2").hide();
			var ty=$("div.search-form table label input[name='test']:checked").val();
			console.log('ty',ty);
			if(ty==1){//差旅
				projectList.getTeacherTrval();
				$("div.travel-div").show();
				$("div.class-rem-div").hide();
				$(".page-main").css('min-width','2000px');
			}else if(ty==2){//课酬
				projectList.getTeacherClass();
				$("div.class-rem-div").show();
				$("div.travel-div").hide();
				$(".page-main").css('min-width','2000px');
			}else{
				$yt_alert_Model.prompt("请先选择报销类型");
			}
		});
		//导出按钮
		$("button.export-excel-btn").click(function(){
			var ty=$("div.search-form table label input[name='test']:checked").val();
			if(ty==1){//差旅
				$yt_baseElement.showLoading();
				projectList.trvalExport();
				$yt_baseElement.hideLoading();
			}else if(ty==2){//课酬
				$yt_baseElement.showLoading();
				projectList.classExport();
				$yt_baseElement.hideLoading();
			}else{
				$yt_alert_Model.prompt("请先选择报销类型");
			}
			
		});
		//重置按钮
		$("button.resert-btn").click(function(){
			var ty=$("div.search-form table label input[name='test']:checked").val();
			projectList.resertSearch();
			if(ty==1){//差旅
				projectList.getTeacherTrval();
				
			}else if(ty==2){//课酬
				projectList.getTeacherClass();
				
			}
		});
		//切换单选触发
//		$("div.search-form label input[name='test']").click(function(){
//			projectList.resertSearch();
//		});
	},
	/** 
	 * 获取列表数据
	 */
	getPlanListInfo: function() {
		sessionStorage.getItem("searchParams")?$('#keyword').val(sessionStorage.getItem("searchParams")):'';
		var queryParams = $('#keyword').val();
		var createTimeStart=$(".search-box .apply-time-start").val();
		var createTimeEnd =$(".search-box .apply-time-end").val();
		var teacherCountStart =$(".search-box .teacher-start").val();
		var teacherCountEnd =$(".search-box .teacher-end").val();
		var expenseMoneyStart =$(".search-box .expense-start").val();
		var expenseMoneyEnd =$(".search-box .expense-end").val();
		var expenseType =$(".search-box #expenseType").val();
//		var workFlawState =$(".search-box #workFlawState").val();
		var flowNumber=$(".search-box .project-code").val();
		var projectCode=$(".search-box .project-head").val();
		var projectName=$(".search-box .project-class").val();
		var projectHead=$(".search-box .project-header").val();
		$('.list-page').pageInfo({
			pageIndexs: sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "finance/teacherExpense/lookForAllByAdopt", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				projectCode:projectCode,
				selectParam: queryParams,
				createTimeStart: createTimeStart,
				createTimeEnd: createTimeEnd,
				teacherCountStart: teacherCountStart,
				teacherCountEnd: teacherCountEnd,
				expenseMoneyStart: expenseMoneyStart,
				expenseMoneyEnd: expenseMoneyEnd,
				expenseType: expenseType,
				workFlawState: '',
				flowNumber:flowNumber,
				projectName:projectName,
				projectHead:projectHead
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			async:true,
			before:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				sessionStorage.clear();
				if(data.flag == 0) {
					var htmlTbody = $('.open-class-tbody').empty();
					var htmlTr = '';
					var num = 0;
					if(data.data.rows.length > 0) {
						$('.list-page').show();
						$.each(data.data.rows, function(i, v) {
								num += 1;
								var expenseType = Number(v.expenseType);
								//1:教师课酬报销 2:教师差旅报销
								if(expenseType == 1) {
									expenseType = '教师课酬报销';
								}
								if(expenseType == 2) {
									expenseType = '教师差旅报销';
								}
								v.workFlawState=='已完成'?v.workFlawState='已通过':v.workFlawState=v.workFlawState;
								htmlTr = '<tr class="td-list">' +
									'<td class="pkId" style="display:none;">' + v.pkId + '</td>' +
									'<td class="paymentState" style="display:none;">' + v.paymentState + '</td>' +
									'<td><a class="class-name"style="color: #3c4687;">' + v.flowNumber + '</a></td>' +
									'<td class="expenseType" style="display:none;">' + v.expenseType + '</td>' +
									'<td>' + expenseType + '</td>' +
									'<td>' + v.projectCode + '</td>' +
									'<td>' + v.projectName + '</td>' +
									'<td>' + v.projectHead + '</td>' +
									'<td>' + v.createTime + '</td>' +
									'<td>' + v.teacherCount + '</td>' +
									'<td>' + $yt_baseElement.fmMoney(v.expenseMoney,2)  + '</td>' +
									'<td class="workFlawState">' + v.workFlawState + '</td>' +
									'</tr>';
									htmlTbody.append(htmlTr);
						});
					}
					if(num == 0) {
						$('.list-page').hide();
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="9" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
							htmlTbody.append(htmlTr);
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
	 * 重置搜索条件
	 */
	resertSearch:function(){
		$("div.search-form input.calendar-input").val("");
		$(".belong-class-select").setSelectVal("");
		$(".class-teacher-name").setSelectVal("");
		$('div.yt-input').text("");
		$('div.yt-input').attr('textname',''); 
		projectList.treeList();
	},
	/**
	 * 自定义列表获取参数
	 * 
	 */
	teacher:function(){
		var teacher={
			startDateStart:$(".start-time-start").val(),
			startDateEnd:$(".start-time-end").val(),
			endDateStart:$(".end-time-start").val(),
			endDateEnd:$(".end-time-end").val(),
			projectCode:$(".belong-class-select").val(),
			teacherName:$(".class-teacher-name").val(),
			createUser:$("div.apply-man").attr('textName'),
			projectHead:$("div.project-dir").attr('textName'),
			classTeacher:$("div.project-class-dir").attr('textName')
		}
		return teacher;
	},
	/**
	 * 教师差旅导出
	 */
	trvalExport:function(){
		var teacher=projectList.teacher();
		$.ajaxDownloadFile({
			url:$yt_option.base_path + "finance/teacherExpense/downloadTeacherTravelBusiness",
			data:teacher
		});
	},
	/**
	 * 教师课酬导出
	 */
	classExport:function(){
		var teacher=projectList.teacher();
		$.ajaxDownloadFile({
			url:$yt_option.base_path + "finance/teacherExpense/downloadTeacherClassRemuneration",
			data:teacher
		});
	},
	/**
	 * 获取教师差旅列表
	 */
	getTeacherTrval:function(){
		var teacher=projectList.teacher();
		$('.travel-page').pageInfo({
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			url: $yt_option.base_path + "finance/teacherExpense/lookForAllByTeacherTravelBusiness", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data:teacher , //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			async:true,
			before:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				var htmlTr='';
				if(data.flag == 0) {
					$(".travel-div tbody.list-tbody").empty();
					if(data.data.rows.length!=0){
						$('.travel-page').show();
						$.each(data.data.rows, function(i,n) {
							var allMoey=Number(n.salesPrice)+Number(n.insurance)+Number(n.refundSigningFee);
							var bookingRecord=[];
							if(n.bookingRecord.length!=0){
								$.each(n.bookingRecord, function(a,b) {
									bookingRecord.push(b.teacherStatementDetails);
								});
								bookingRecord=bookingRecord.join(",");
							}
							if(n.paymentMethod==1){
								n.paymentMethod="支票";
							}else if(n.paymentMethod==2){
								n.paymentMethod="电汇";
							}else if(n.paymentMethod==3){
								n.paymentMethod="归还公务卡";
							}else if(n.paymentMethod==4){
								n.paymentMethod="现金";
							}else if(n.paymentMethod==5){
								n.paymentMethod="核销借款";
							}
							switch (n.warehousePosition){
								case 1:
									n.warehousePosition="头等舱";
								break;
								case 2:
								    n.warehousePosition="商务舱";
								break;
								case 3:
									n.warehousePosition="经济舱";
								break;
								case 4:
									n.warehousePosition="商务座";
								break;
								case 5:
									n.warehousePosition="一等座";
								break;
								case 6:
									n.warehousePosition="二等座";
								break;
								case 7:
									n.warehousePosition="软卧 ";
								break;
								case 8:
									n.warehousePosition="硬卧";
								break;
								case 9:
									n.warehousePosition="软座";
								break;
								case 10:
									n.warehousePosition="硬座";
								break;
							}
							htmlTr='<tr>'+
								'<td>'+(i+1)+'</td>'+
								'<td>'+n.teacherName+'</td>'+
								'<td>'+n.papersType+'</td>'+
								'<td style="word-wrap: break-word;">'+n.papersNumber+'</td>'+
								'<td>'+n.registeredBank+'</td>'+
								'<td style="word-wrap: break-word;">'+n.account+'</td>'+
								'<td>'+n.flighttrainNumber+'</td>'+
								'<td>'+n.placeDeparture+'</td>'+
								'<td>'+n.bourn+'</td>'+
								'<td>'+n.warehousePosition+'</td>'+
								'<td>'+n.warehousePositionDetails+'</td>'+
								'<td>'+n.startEndTime+'</td>'+
								'<td>'+n.salesPrice+'</td>'+
								'<td>'+n.insurance+'</td>'+
								'<td>'+n.refundSigningFee+'</td>'+
								'<td>'+ $yt_baseElement.fmMoney(allMoey,2) +'</td>'+////////
								'<td>'+n.paymentMethod+'</td>'+
								'<td style="word-wrap: break-word;">'+bookingRecord+'</td>'+
								'<td>'+n.projectCode+'</td>'+
								'<td>'+n.projectName+'</td>'+
								'<td>'+n.projectHead+'</td>'+
								'<td>'+n.classTeacher+'</td>'+
								'<td>'+n.createUser+'</td>'+
								'<td>'+n.createTime+'</td>'+
								'</tr>';
								$(".travel-div tbody.list-tbody").append(htmlTr);
						});
					}else{
						$('.travel-page').hide();
						htmlTr='<tr>'+
								'<td colspan="24" align="center" style="border:0px;">'+
									'<div class="no-data" style="width: 280px;margin: 0 auto;">'+
										'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">'+
									'</div>'+
								'</td>'+
							'</tr>';
						$(".travel-div tbody.list-tbody	").append(htmlTr);
					}
					console.log('差旅');
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
	 * 获取教师课酬列表
	 */
	getTeacherClass:function(){
		var teacher=projectList.teacher();
		$('.class-page').pageInfo({
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			url: $yt_option.base_path + "finance/teacherExpense/lookForAllByTeacherClassRemuneration", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data:teacher, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			async:true,
			before:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				var htmlTr='';
				if(data.flag == 0) {
					$(".class-rem-div tbody.list-tbody").empty();
					if(data.data.rows.length!=0){
						$('.class-page').show();
						$.each(data.data.rows, function(i,n) {
							var courseDate=n.courseJson.length;
							//判断是否有授课日期
							if(courseDate!=0){
								$.each(n.courseJson, function(a,b) {
									
									if(b.courseDate==undefined){
										b.courseDate="";
									}
									if(a==0){
										
										htmlTr='<tr>'+
											'<td rowspan="'+courseDate+'">'+(i+1)+'</td>'+
											'<td rowspan="'+courseDate+'">'+n.teacherName+'</td>'+
											'<td rowspan="'+courseDate+'">'+n.papersType+'</td>'+
											'<td rowspan="'+courseDate+'" style="word-wrap: break-word;">'+n.papersNumber+'</td>'+
											'<td rowspan="'+courseDate+'">'+n.registeredBank+'</td>'+
											'<td rowspan="'+courseDate+'" style="word-wrap: break-word;">'+n.account+'</td>'+
											'<td rowspan="">'+b.courseDate+'</td>'+
											'<td rowspan="'+courseDate+'">'+ $yt_baseElement.fmMoney(n.expenseMoney,2) +'</td>'+
											'<td rowspan="'+courseDate+'">'+ $yt_baseElement.fmMoney(n.surrenderPersonal,2) +'</td>'+
											'<td rowspan="'+courseDate+'">'+ $yt_baseElement.fmMoney(n.afterTax,2) +'</td>'+
											'<td rowspan="'+courseDate+'">'+n.projectCode+'</td>'+
											'<td rowspan="'+courseDate+'">'+n.projectName+'</td>'+
											'<td rowspan="'+courseDate+'">'+n.projectHead+'</td>'+
											'<td rowspan="'+courseDate+'">'+n.classTeacher+'</td>'+
											'<td rowspan="'+courseDate+'">'+n.createUser+'</td>'+
											'<td rowspan="'+courseDate+'">'+n.createTimeStr+'</td>'+
											'</tr>';
											$(".class-rem-div tbody.list-tbody").append(htmlTr);
									}else{
										htmlTr='<tr><td>'+b.courseDate+'</td></tr>';
										$(".class-rem-div tbody.list-tbody").append(htmlTr);
									}
									
								});
							}else{
								htmlTr='<tr>'+
									'<td>'+(i+1)+'</td>'+
									'<td>'+n.teacherName+'</td>'+
									'<td>'+n.papersType+'</td>'+
									'<td  style="word-wrap: break-word;">'+n.papersNumber+'</td>'+
									'<td>'+n.registeredBank+'</td>'+
									'<td  style="word-wrap: break-word;">'+n.account+'</td>'+
									'<td></td>'+
									'<td>'+ $yt_baseElement.fmMoney(n.expenseMoney,2) +'</td>'+
									'<td>'+ $yt_baseElement.fmMoney(n.surrenderPersonal,2) +'</td>'+
									'<td>'+ $yt_baseElement.fmMoney(n.afterTax,2) +'</td>'+
									'<td>'+n.projectCode+'</td>'+
									'<td>'+n.projectName+'</td>'+
									'<td>'+n.projectHead+'</td>'+
									'<td>'+n.classTeacher+'</td>'+
									'<td>'+n.createUser+'</td>'+
									'<td>'+n.createTimeStr+'</td>'+
									'</tr>';
								$(".class-rem-div tbody.list-tbody").append(htmlTr);
							}
						});
					}else{
						$('.class-page').hide();
							htmlTr='<tr>'+
								'<td colspan="16" align="center" style="border:0px;">'+
									'<div class="no-data" style="width: 280px;margin: 0 auto;">'+
										'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">'+
								    '</div>'+
								'</td>'+
							'</tr>';
						$(".class-rem-div tbody.list-tbody").append(htmlTr);
					}
					console.log('课酬');
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
	 * 获取所属班级数据
	 */
	getBlongClass:function(){
		var classList;
		$.ajax({
			type:"post",
			url:$yt_option.base_path + "finance/reduction/lookForAllProject",
			data:{
				selectParam:"",
				projectCode:""
			},
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			async:true,
			success:function(data){
				if(data.flag==0){
					classList=data.data;
					$("select.belong-class-select").niceSelect({
						 search: true,  
				         backFunction: function(text) { 
				            //回调方法,可以执行模糊查询,也可自行添加操作  
				            $("select.belong-class-select").empty();  
				            if(text == "") {  
				                $("select.belong-class-select").append('<option value="">请选择</option>');  
				            }  
				            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
				            $.each(classList, function(i, n) {  
				                if(n.projectName.indexOf(text) != -1) {  
				                    $("select.belong-class-select").append('<option value="' + n.projectCode + '">' + n.projectName + '</option>');  
				                }  
				            });  
				         }  
					});
				}
				$yt_baseElement.hideLoading();
			}
		});
	},
	/**
	 * 获取教师数据
	 */
	getTeacher:function(){
		var teacherList;
			$.ajax({
			type:"post",
			url:$yt_option.base_path + "class/course/getTeacherAll",
			data:{
				teacherName:""
			},
			async:true,
			success:function(data){
				if(data.flag==0){
					teacherList=data.data;

				}
			}
		});
		$("select.class-teacher-name").niceSelect({
			 search: true,  
	         backFunction: function(text) { 
	            //回调方法,可以执行模糊查询,也可自行添加操作  
	            $("select.class-teacher-name").empty();  
	            if(text == "") {  
	                $("select.class-teacher-name").append('<option value="">请选择</option>');  
	            }  
	            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
	            $.each(teacherList, function(i, n) {  
	                if(n.teacherName.indexOf(text) != -1) {  
	                    $("select.class-teacher-name").append('<option value="' + n.teacherName + '">' + n.teacherName + '</option>');  
	                }  
	            });  
	         }  
		});
	},
	/**
	 * 获取人员列表
	 */
	getUsers:function(){
		var usersList;
		$.ajax({
			type:"post",
			url:$yt_option.base_path + "uniform/user/getUsers",
			data:{
				compId:"",
				userName:""
			},
			async:false,
			success:function(data){
				if(data.flag==0){
					usersList=data.data;
				}
			}
		});
		return usersList;
	},
	/*
	 json转换树形式
	 * 
	 * */
	getTreeData: function(data, parentId) {
		var me = this;
		var result = [],
			temp;
		for(var i in data) {
			if(data[i].parentId == parentId) {
				result.push(data[i]);
				temp = projectList.getTreeData(data, data[i].id);
				if(temp.length > 0) {
					data[i].children = temp;
				}
			}
		}
		return result;
	},
	/**
	 * 树形图添加
	 */
	treeList:function(){
		var usersList=projectList.getUsers();
		$('#tt').tree({
			data:projectList.getTreeData(usersList,"0"),
			checkbox:true,
			animate:true,
			onCheck:function(node,checked){
				console.log(projectList.treeGetData());
				var check='';
				var textCode='';
				var nodes=projectList.treeGetData().nodes;
				$.each(nodes, function(i,n) {
					if(n.type==3){
						if(check==''){
							check+=n.text;
						}else{
							check+=","+n.text;
						}
						if(textCode==''){
							textCode+=n.textName;
						}else{
							textCode+=","+n.textName;
						}
					}
				});
				//$("div.apply-man").attr('title',check);
				$("div.apply-man").text(check);
				$("div.apply-man").attr('textName',textCode);
			}
			
		});
		$('#aa').tree({
			data:projectList.getTreeData(usersList,"0"),
			checkbox:true,
			animate:true,
			onCheck:function(node,checked){
				console.log(projectList.treeGetData());
				var check='';
				var textCode='';
				var node1=projectList.treeGetData().node1;
				$.each(node1, function(i,n) {
					if(n.type==3){
						if(check==''){
							check+=n.text;
						}else{
							check+=","+n.text;
						}
						if(textCode==''){
							textCode+=n.textName;
						}else{
							textCode+=","+n.textName;
						}
					}
				});
				//$("div.project-dir").attr('title',check);
				$("div.project-dir").text(check);
				$("div.project-dir").attr('textName',textCode);
			}
		});
			$('#cc').tree({
			data:projectList.getTreeData(usersList,"0"),
			checkbox:true,
			animate:true,
			onCheck:function(node,checked){
				console.log(projectList.treeGetData());
				var check='';
				var textCode='';
				var node2=projectList.treeGetData().node2;
				$.each(node2, function(i,n) {
					if(n.type==3){
						if(check==''){
							check+=n.text;
						}else{
							check+=","+n.text;
						}
						if(textCode==''){
							textCode+=n.textName;
						}else{
							textCode+=","+n.textName;
						}
					}
				});
				//$("div.project-class-dir").attr('title',check);
				$("div.project-class-dir").text(check);
				$("div.project-class-dir").attr('textName',textCode);
			}
		});
},
/**
 * 树形图获取数据
 */
	treeGetData:function(){
		var nodes = $('#tt').tree('getChecked');
		var node1=$('#aa').tree('getChecked');
		var node2=$('#cc').tree('getChecked');
		return {
			nodes:nodes,
			node1:node1,
			node2:node2
		};
	},
	/**
	 * 高级搜索
	 */
	hideSearch:function(){
		var clickTime=0;
		$("button.senior-search-btn").click(function(e){
			if(clickTime%2==0){
				$('#keyword').val("");
				$(".search-box").show();
				$(".search-put").addClass('flipy');
			}else{
				$(".search-box").hide();
				$(".search-put").removeClass('flipy');
//				$(".search-box table.search-table input").val("");
//				$("#expenseType").setSelectVal('');
//				$("#workFlawState").setSelectVal('');
			}
			clickTime++;
			e.stopPropagation();
		});
		$(document).click(function(){
				clickTime=0;
				$(".search-box").hide();
				$(".search-put").removeClass('flipy');
//				$(".search-box table.search-table input").val("");
//				$("#expenseType").setSelectVal('');
//				$("#workFlawState").setSelectVal('');
			
		});
		//金额输入框失去焦点
		$(".expense-tr input").blur(function(){
			$(this).val($(this).val().replace(/[^\d.]/g,""));
			$(this).val(Number($(this).val()));
		});
		//搜索按钮
		$(".search-box .yt-model-sure-btn").click(function(){
			//调用获取列表数据方法
			projectList.getPlanListInfo();
		});
		//重置按钮
		$(".search-box .yt-model-reset-btn").click(function(){
			$(".search-box table.search-table input").val("");
			$("#expenseType").setSelectVal('');
			$("#workFlawState").setSelectVal('');
		});
	}
};
$(function() {
	//初始化方法
	projectList.init();
});