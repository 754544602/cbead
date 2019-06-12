var projectApprovalList = {
	//初始化方法
	init: function() {
		var indexNum = "1";//显示页签标识
		var backIndexNum = $yt_common.GetQueryString('indexNum');
		if (backIndexNum == "1") {
			indexNum = "1";
			$(".pending-btn").addClass("active").siblings().removeClass("active");
			var path = "project/lookForAllByApprove";
			projectApprovalList.getProjectApprovalList(path);
		} else if(backIndexNum == "2"){
			indexNum = "2";
			$(".approved-btn").addClass("active").siblings().removeClass("active");
			var path = "project/lookForAllByHaveBeenApprove";
			projectApprovalList.getProjectApprovalList(path);
		}else{
			//调用获取列表数据方法
			projectApprovalList.getProjectApprovalList("project/lookForAllByApprove");
		}
		//搜索关键字
		$('.search-btn').click(function() {
			//判断值进行模糊查询			
			if($(".pending-btn").hasClass("active")){
				//调用获取列表数据方法查询
				var path = "project/lookForAllByApprove";
				projectApprovalList.getProjectApprovalList(path);
			}else{
				var path = "project/lookForAllByHaveBeenApprove";
				projectApprovalList.getProjectApprovalList(path);
			}
		});
		//点击项目名称
		$(".project-approval-tbody").on('click',".project-name",function(){
			var approve = "";
			var pageType = 2;//标识项目详情页是由项目审批列表跳转过去的
			var pkId = $(this).parent().parent().find('.pkId').val();
			var projectState = $(this).parents('tr').find(".project-state-step").val();
			if ($('.approved-btn').hasClass('active')) {
				//当前显示的审批记录列表
				approve = 1;
			}
//			var projectCode2 = $(this).parents("tr").find("td.project-code").text();
			var pass = "Approval";
			var projectType = 2;
			sessionStorage.setItem("searchParams", $('.selectParam').val());
			sessionStorage.setItem("pageIndexs", $('.project-approval-page .num-text.active').text());
			window.location.href="/cbead/website/view/project/projectDetails.html?pkId=" + pkId + "&" + "projectCode=" +  $(".yt-table-active .projectCode").val() + "&" + "pass=" + pass+"&"+"approve="+approve+"&projectState="+projectState+"&projectType="+projectType+"&pageType="+2+"&approveWorkPerson="+"awp"+"&indexNum="+indexNum;
		});
		$(".pending-btn").click(function(){//待审批
			indexNum = "1";
			$(".pending-btn").addClass("active").siblings().removeClass("active");
			var path = "project/lookForAllByApprove";
			projectApprovalList.getProjectApprovalList(path);
		})
		$(".approved-btn").click(function(){//审批记录
			indexNum = "2";
			$(".approved-btn").addClass("active").siblings().removeClass("active");
			var path = "project/lookForAllByHaveBeenApprove";
			projectApprovalList.getProjectApprovalList(path);
		})
	},
		
	/**
	 * 获取列表数据
	 */
	getProjectApprovalList: function(path) {
		sessionStorage.getItem("searchParams")?$(".selectParam").val(sessionStorage.getItem("searchParams")):'';
		selectParam=$(".selectParam").val();             
		$('.project-approval-page').pageInfo({
			pageIndexs:sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + path, //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			async:false,
			before:function(){
				$yt_baseElement.showLoading();
			},
			data: {
				selectParam:selectParam
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				sessionStorage.clear();
				$yt_baseElement.showLoading();
				if(data.flag == 0) {
					var htmlTbody = $('.project-approval-tbody').empty();
					var htmlTr = '';
					if(data.data.rows != null){
						if(data.data.rows.length > 0) {
							var num = 0 ;
							$.each(data.data.rows, function(i, v) {
	//							if(v.projectType==1){
	//								v.projectType="计划"
	//							}else if(v.projectType==2){
	//								v.projectType="委托"
	//							}else if(v.projectType==3){
	//								v.projectType="选学"
	//							}else if(v.projectType==4){
	//								v.projectType="调训"
	//							}
								if(v.projectStates==1){
									v.projectStatesVel="分配负责人"
								}else if(v.projectStates==2){
									v.projectStatesVel="审批中"
								}
								if(v.projectType==2){
									v.projectTypeVal="委托";
									num +=1 ;
									if(path=="project/lookForAllByApprove"){
										$(".projeect-code-approval").text("序号");
										$(".projeect-code-approval").width('50px');
										htmlTr = '<tr>' +
											'<td class="project"><input type="hidden" value="' + v.pkId + '" class="pkId"><input type="hidden" value="' + v.projectCode + '" class="projectCode">' + num + '</td>' +
											'<td style="text-align:left"><a style="color:#3c4687;" class="project-name">' + v.projectName + '</a></td>' +
											'<td>' + v.projectTypeVal + '</td>' +
											'<td>' + v.startDate + '</td>' +
											'<td style="text-align:right">' + v.trainDateCount + '</td>' +
											'<td style="text-align:left">' + v.projectSell + '</td>' +
											'<td style="text-align:right">' + v.traineeCount + '</td>' +
											'<td><input type="hidden" value="' + v.projectStates + '" class="project-state-step">' + v.projectStatesVel + '</td>' +
											'</tr>';
											$(".project-approval-page").show();
											htmlTr=$(htmlTr).data('data',v);
											htmlTbody.append(htmlTr);
									}else{
										v.projectType="委托";
										$(".projeect-code-approval").text("项目编号");
										$(".projeect-code-approval").width('100px');
										if(v.dataStates==1){
											v.dataStatesVel = '未立项'
										}
										else if(v.dataStates==2){
											v.dataStatesVel = '审批中'
										}
										else if(v.dataStates==3){
											v.dataStatesVel = '未通过'
										}
										else if(v.dataStates==4){
											v.dataStatesVel = '已完成'
										}
										else if(v.dataStates==5){
											v.dataStatesVel = '已取消'
										}
										else if(v.dataStates==6){
											v.dataStatesVel = '分配责任人'
										}else{
											v.dataStatesVel = ''
										}
										htmlTr = '<tr>' +
											'<td class="project-code"><input type="hidden" value="' + v.pkId + '" class="pkId"><span class="projectCodeTd">' + v.projectCode + '</span></td>' +
											'<td style="text-align:left"><a style="color: #3c4687;" class="project-name">' + v.projectName + '</a></td>' +
											'<td><input type="hidden" value="' + v.projectCode + '" class="projectCode">' + v.projectType + '</td>' +
											'<td>' + v.startDate + '</td>' +
											'<td style="text-align:right">' + v.trainDateCount + '</td>' +
											'<td style="text-align:left">' + v.projectSell + '</td>' +
											'<td style="text-align:right">' + v.traineeCount + '</td>' +
											'<td ><input type="hidden" value="' + v.dataStates + '" class="project-state-step">' + v.dataStatesVel + '</td>' +
											'</tr>';
											$(".project-approval-page").show();
											htmlTr=$(htmlTr).data('data',v);
											htmlTbody.append(htmlTr);
									}
								}
								
							});
							$('.projectCodeTd').each(function(j,k){
								$(k).text().length>8?$(k).hide():$(k).show();
							})
						} else {
							$(".project-approval-page").hide();
							htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
								'<td colspan="8" align="center" style="border:0px;">' +
								'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
								'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
								'</div>' +
								'</td>' +
								'</tr>';
								htmlTbody.append(htmlTr);
						}
					}
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
	
}
$(function() {
	//初始化方法
	projectApprovalList.init();
	
});