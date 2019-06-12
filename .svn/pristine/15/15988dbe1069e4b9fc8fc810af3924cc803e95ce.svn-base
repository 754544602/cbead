var curriculumList = {
	//初始化方法
	init: function() {
		//默认加载待审批列表
		var path="finance/reduction/lookForAllByApproved";
		curriculumList.getPlanListInfo(path);
		//点击班级名跳转到审批详情页面
		$('.reduce-list').on('click','.project-code-href',function(){
			var pkId = $(this).parent().parent().find('.pk-id').text();
			var state = $(this).parent().parent().find('.work-flaw-state').text();
			var btnTpye = $('#operate-type').val();
			if(btnTpye==1){
				if(state=="草稿" || state=="未通过"){
					//跳转到修改费用减免详情的页面
					window.location.href = "costInfo.html?pkId="+pkId;
				}else{
					curriculumList.getOneListInfo(pkId);
				}
			};
			if(btnTpye==2){
				//跳转到费用减免详情页面和审批都不可更改页面-----完
				window.location.href = "costInfo.html?pkId="+pkId;
			}
			
		});
	},
//判断当前流程该由谁来操作
	getOneListInfo: function(pkId) {
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/reduction/getBeanById",
			async: false,
			data: {
				pkId: pkId
			},
			success: function(data) {
				if(data.flag == 0) {
					//流程
					var flowLog = JSON.parse(data.data[0].flowLog);
					var length=flowLog.length;
					var tastKeyType= flowLog[0].tastKey;
					var deleteReason= flowLog[0].deleteReason;
					if(length==0){
						
					}else if(tastKeyType=="activitiStartTask"){
						//费用减免详情能修改，审批流程不能修改的
						//window.location.href = "reviseOut.html?pkId="+pkId;
						
					}else if(tastKeyType=="activitiEndTask" && deleteReason =="completed"){//审批流程结束
				
						//费用减免详情和审批流程都为只可查看状态-----完
						window.location.href = "costInfo.html?pkId="+pkId;
					}else{
						//费用减免详情不能修改，审批流程可以修改-----完
						window.location.href = "reviseOutlayApprove.html?pkId="+pkId;
					}
				
				}
			}
		});
	},


	/**
	 * 减免列表
	 */
	getPlanListInfo: function(path) {
		var keyword = $('#keyword').val();
		$('.curriculum-page').pageInfo({
			async: true,
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + path, //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam: keyword
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			before:function(){
				//showLoading方法
				$yt_baseElement.showLoading();	
			},
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.reduce-list .yt-tbody');
					var htmlTr = '';
					var num = 1;
					var projectType;
					if(data.data.rows.length > 0) {
						$(htmlTbody).empty()
						$.each(data.data.rows, function(i, v) {
							i = i + 1;
							if(v.projectType == 1) {
								projectType = "计划";
							};
							if(v.projectType == 2) {
								projectType = "委托";
							};

							if(v.projectType == 3) {
								projectType = "选学";
							};
							if(v.projectType == 4) {
								projectType = "调训";
							};
							htmlTr = '<tr>' +
								'<td style="display:none;" class="pk-id">' + v.pkId + '</td>' +
								'<td class="project-code list-td">' + v.projectCode + '</td>' +
								'<td style="text-align: left !important;" class="project-name"><a class="project-code-href" style="float:left;">' + v.projectName + '</a></td>' +
								'<td class="project-type list-td">' + projectType + '</td>' +
								'<td class="project-head list-td">' + v.projectHead + '</td>' +
								'<td class="start-date list-td">' + v.startDate + '</td>' +
								'<td class="create-time-string list-td">' + v.createTimeString + '</td>' +
								'<td class="create-time-string list-td">' + v.createTimeString + '</td>' +
								'<td class="post-remission-money">' + v.postRemissionMoney + '</td>' +
								'<td class="create-user list-td">' + v.createUser + '</td>' +
								'<td class="work-flaw-state list-td">' + v.dealingWithPeople + '</td>' +
								'</tr>';
							htmlTbody.append($(htmlTr).data("legalData", v));
						});
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
							$('.page1').hide();
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
	}
};

$(function() {
	//初始化方法
	curriculumList.init();

});