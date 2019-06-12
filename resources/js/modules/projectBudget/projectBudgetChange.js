var projectBudgetChange = {
	//初始化方法
	init: function() {
		//获取跳转页面传过来的pkId
		var pkId = $yt_common.GetQueryString('pkId');
		//获取详细信息
		projectBudgetChange.getBudgetInf();
		
		//初始化日期控件
		$(".report-date").calendar({
		    speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
		    complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
		    readonly: true, // 目标对象是否设为只读，默认：true     
		    lowerLimit:"NaN", // 日期下限，默认：NaN(不限制)     
		    nowData:true,//默认选中当前时间,默认true  
		    dateFmt:"yyyy-MM-dd HH:mm:ss",  
		    callback: function() { // 点击选择日期后的回调函数  
		        //alert("您选择的日期是：" + $("#txtDate").val());  
		    }  
		});  
		$(".out-hospital-date").calendar({
		    speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
		    complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
		    readonly: true, // 目标对象是否设为只读，默认：true     
		    lowerLimit:"NaN", // 日期下限，默认：NaN(不限制)     
		    nowData:true,//默认选中当前时间,默认true  
		    dateFmt:"yyyy-MM-dd HH:mm:ss",  
		    callback: function() { // 点击选择日期后的回调函数  
		        //alert("您选择的日期是：" + $("#txtDate").val());  
		    }  
		});
		
		//获取下一步操作人
		var dealingWithPeople = projectBudgetChange.getListSelectDealingWithPeople();
		if (dealingWithPeople !=null){
			$.each(dealingWithPeople,function (i,n){
				$(".dealing-with-people").append('<option value="'+n.userCode+'">'+n.userName+'</option>');
			});
		}
		$(".dealing-with-people").niceSelect();
		
		//点击保存
		$(".save-budget").click(function(){
			var dataStates = 1;
			projectBudgetChange.projectBudgetChangeInf(dataStates);
			window.location.href="/cbead/website/view/projectBudget/budgetList.html";
		});
		//点击提交
		$(".submit-budget").click(function(){
			var dataStates = 2;
			projectBudgetChange.projectBudgetChangeInf(dataStates);
			window.location.href="/cbead/website/view/projectBudget/budgetList.html";
		});
		//点击取消
		$(".btn-off").click(function(){
			window.location.href="/cbead/website/view/projectBudget/budgetList.html";
		});
		$('.approval-change-after-last').on('blur','.budget-cost',function(){
			$(this).val($yt_baseElement.fmMoney($(this).val(),2));
projectBudgetChange.total($('.approval-change-after-last'))		})
		
		
		
	},
	/**
	 * 获取下一步操作人
	 */
	getListSelectDealingWithPeople:function(){
		var list =[];
		$.ajax({
			type: "post",
			url: $yt_option.base_path+"uniform/workFlowOperate/getSubmitPageData",
			data:{
				businessCode:"project",
				processInstanceId:"",
				parameters:"",
				versionNum:""
			},
			async: false,
			success: function(data) {
				$.each(data.data, function(i, n) {
						console.log(n);
						console.log(i);
						for(var k in n) {
							console.log('k', k);
							console.log("n[k]", n[k]);
							list = n[k];
						}
					});
			}
		});
		return list;
	},	
	/**
	 * 预算明细查询
	 */
	getBudgetSubsidiary:function(){
		var list =[];
		$.ajax({
			type: "post",
			url: $yt_option.base_path+"finance/projectBudget/getProjectBudgetCostBase",
			data:{
				
			},
			async: true,
			success: function(data) {
				list = data.data || [];
			}
		});
		return list;
	},
	//获取一条数据
	getBudgetInf: function() {
			var pkId = $yt_common.GetQueryString('pkId');
			var projectName = "";
			$.ajax({
				type: "post", //ajax访问方式 默认 "post"  
				url: $yt_option.base_path + "finance/projectBudget/getBeanById", //ajax访问路径  
				data: {
					pkId:pkId
				}, //ajax查询访问参数
				beforeSend:function(){
					$yt_baseElement.showLoading();
				},
				success: function(data) {
					if(data.flag == 0){
						
						projectName = data.data.projectName;
						if(data.data.projectType==2){
							data.data.projectTypeVel = '委托'
						}else if(data.data.projectType==3){
							data.data.projectTypeVel = '选学'
						}else if(data.data.projectType==4){
							data.data.projectTypeVel = '中组部调训'
						}else if(data.data.projectType==5){
							data.data.projectTypeVel = '国资委调训'
						}
						$(".budget-inf").setDatas(data.data);
						if(data.data.isOffSiteTraining == 1){
							$(".training-true").setRadioState("check");
						}else{
							$(".training-false").setRadioState("check")
						}
						if(data.data.isOffSiteTraining == 1){
							$(".cost-low").setRadioState("check");
						}else{
							$(".cost-height").setRadioState("check")
						}
						//从返回的值里给select赋值
						$(".project-code").setSelectVal(data.data.projectCode);
						$(".dealing-with-people").setSelectVal(data.data.dealingWithPeople);
						//通过projectCode获取其他信息
						if($(".project-code").val()!=""){
							var createUserName=$("select.project-code option:selected").attr("createUserName");
							var projectType=$("select.project-code option:selected").attr("projectType");
							var classTeacher=$("select.project-code option:selected").attr("classTeacher");
							var projectHead=$("select.project-code option:selected").attr("projectHead");
							var startDate=$("select.project-code option:selected").attr("startDate");
							var endDate=$("select.project-code option:selected").attr("endDate");
							var traineeTotal=$("select.project-code option:selected").attr("traineeTotal");
							$(".create-user-name").text(createUserName);
							if(projectType==2){
								$(".project-type").text("委托");
							}
							else if(projectType==3){
								$(".project-type").text("选学");
							}
							else if(projectType==4){
								$(".project-type").text("中组部调训");
							}
							else if(projectType==5){
								$(".project-type").text("国资委调训");
							}
							if(classTeacher=="null"){
								$(".class-teacher").text("");
							}else{
								$(".class-teacher").text(classTeacher);
							}
							if(projectHead=="null"){
								$(".project-head").text("");
							}else{
								$(".project-head").text(projectHead);
							}
							$(".start-date").text(startDate.split(" ")[0]);
							$(".end-date").text(endDate.split(" ")[0]);
							traineeTotal == 'null' ? $(".trainee-total").text(0):$(".trainee-total").text(traineeTotal);
						}
						//获取预算明细
						//获取变更次数
						var times = data.data.dataType;
						var workFlawState = data.data.workFlawState;
						if(workFlawState=='草稿'){
							times = times-1;
							$(".approval-change-after-last .edit-teach-related-expenses-table").empty();
							$(".approval-change-after-last  .edit-logistics-related-expenses-table").empty();
						}
						var htmlappend='';
						if(times != undefined){
							for(let j=0;j<times;j++){
								htmlappend='<div class="approval-change-after approval-change-after'+(j+1)+'">'+
												'<div class="class-info-div">预算明细(第'+(j+1)+'次变更)</div>'+
												'<div class="tab-content class-info">'+
													'<div class="class-info-centent budget-subsidiary-change">'+
														'<div class="teach-related-expenses">'+
															'<div class="teach-related-expenses-title">'+
																'<span>教学相关费用</span>'+
															'</div>'+
															'<table class="class-info-table teach-related-expenses-table">'+
															'</table>'+
														'</div>'+
														'<div class="logistics-related-expenses">'+
															'<div class="teach-related-expenses-title">'+
																'<span>后勤相关费用</span>'+
															'</div>'+
															'<table class="class-info-table logistics-related-expenses-table">'+
															'</table>'+
															'<table class="class-info-table" style="width: 806px;">'+
																'<tr><td width="100px" align="right">合计：</td><td class="total"></td></tr>'+
															'</table>'+
														'</div>'+
													'</div>'+
												'</div>'+
											'</div>';
											$('#approval-change-after').append(htmlappend);
							}
						}else{
							$("#approval-change-after").hide();
						}
						var projectBudgetDetailsArr = $.parseJSON(data.data.projectBudgetDetails);
						var projectBudget = '';
						if(projectBudgetDetailsArr!=null){
							$.each(projectBudgetDetailsArr, function(i,n) {
								n.budgetCost=$yt_baseElement.fmMoney(n.budgetCost,2);
								projectBudget = $('<tr><td align="right" width="100px"><input type="hidden" value="'+ n.costCode +'" class="cost-code"><span>'+ n.costName +'：</span></td><td><span></span><input type="text" class="yt-input budget-cost inp-span" data-val="budgetCost" placeholder="请输入"></td><td style="width: 50px;"><span>元</span></td><td class="content-td"><span></span><input type="text" class="yt-input according-instructions gist inp-span" data-val="accordingInstructions" placeholder="请输入依据说明"></td></tr>');
								projectBudget.setDatas(n);
								if(n.types==1){//1:预算申请 2:预算变更
									if(n.costType==1){//1:教学相关费用 2:后勤相关费用
									$(".approval-change-before .teach-related-expenses-table").append(projectBudget);
									}
									if(n.costType==2){
										$(".approval-change-before .logistics-related-expenses-table").append(projectBudget);
									}
								}else if(n.types==2){
									if(n.costType==1){
										$(".approval-change-after"+n.dataType+" .teach-related-expenses-table").append(projectBudget);
									}
									if(n.costType==2){
										$(".approval-change-after"+n.dataType+" .logistics-related-expenses-table").append(projectBudget);
									}
								}
								if(workFlawState=='草稿'){
									$('.project-span').data('dataType',data.data.dataType);
									if(n.dataType==data.data.dataType){
										if(n.types==2){
										if(n.costType==1){
											$(".approval-change-after-last .edit-teach-related-expenses-table").append(projectBudget);
										}
										if(n.costType==2){
											$(".approval-change-after-last  .edit-logistics-related-expenses-table").append(projectBudget);
										}
										}
									}
								}
							});
							//合计
							projectBudgetChange.total($('.approval-change-after-last'))						
							projectBudgetChange.total($('.approval-change-before'))							
							for(let j=0;j<times;j++){
								projectBudgetChange.total($(".approval-change-after"+(j+1)))							
							}
						}
						//变更详情
						$('.project-code').prev().text(projectName);
						$('.project-code').hide();
						$(".report-date").prev().text($(".report-date").val());
						$(".report-date").hide();
						$(".out-hospital-date").prev().text($(".out-hospital-date").val());
						$(".out-hospital-date").hide();
						$(".entrust-org-count").prev().text($(".entrust-org-count").val());
						$(".entrust-org-count").hide();
						$('.is-off-site-training').setRadioState("disabled");
						if ($('input[name="test"]:checked').val() == 1) {
							$(".training-span").text("是");
						}else{
							$(".training-span").text("否");
						}
						if ($('input[name="test"]:checked').val() == 1) {
							$(".cost-span").text("基本标准");
						}else{
							$(".cost-span").text("高成本标准");
						}
						$(".check-label").hide();
						$(".cost-standard").setRadioState("disabled");
						$(".offsite-training-requirement").prev().text($(".offsite-training-requirement").val());
						$(".offsite-training-requirement").hide();
						//教学相关费用
						$.each($(".teach-related-expenses-table tbody").find(".inp-span"), function(p,s) {
							$(s).prev().text($(s).val());
							$(s).hide();
							$(s).parent().parent().find(".content-td").css("width","600px");
						});
						$.each($(".logistics-related-expenses-table tbody").find(".inp-span"), function(r,g) {
							$(g).prev().text($(g).val());
							$(g).hide();
							$(g).parent().parent().find(".content-td").css("width","600px");
						});
						
					}else{
						$yt_alert_Model.prompt("获取失败");
					}
					$yt_baseElement.hideLoading();
				},error:function(){
					$yt_baseElement.hideLoading();
					$yt_alert_Model.prompt('网络异常，详情获取失败');
				}
			});
	},
		
	//新增预算变更
	projectBudgetChangeInf: function(dataStates) {
		var pkId = $yt_common.GetQueryString('pkId');
		var projectCode = $(".project-code").val();
		var reportDate = $(".report-date").val();
		var outHospitalDate = $(".out-hospital-date").val();
		var entrustOrgCount = $(".entrust-org-count").val();
		var isOffSiteTraining = $('input[name="test"]:checked').val();
		var offSiteTrainingRequirement = $(".offsite-training-requirement").val();
		var costStandard = $('input[name="costStandard"]:checked').val();
		var projectBudgetDetails = "";
		var dealingWithPeople = $(".dealing-with-people").val();
		if ($(".project-span").length>0) {
			projectCode = $(".hid-project").val();
			isOffSiteTraining = $(".hid-is-offSite-training").val();
			costStandard = $(".hid-cost-standard").val();
		}
		var projectBudgetDetailsArr=[];
		$(".edit-teach-related-expenses-table tr").each(function (i,n){
			costCode=$(n).find(".cost-code").val();
			budgetCost=$yt_baseElement.rmoney($(n).find(".budget-cost").val());
			accordingInstructions=$(n).find(".according-instructions").val();
			var arrProjectBudgetDetails={
				costCode:costCode,
				budgetCost:budgetCost,
				accordingInstructions:accordingInstructions
			}
			projectBudgetDetailsArr.push(arrProjectBudgetDetails);
		});
		$(".edit-logistics-related-expenses-table tr").each(function (i,n){
			costCode=$(n).find(".cost-code").val();
			budgetCost=$yt_baseElement.rmoney($(n).find(".budget-cost").val());
			accordingInstructions=$(n).find(".according-instructions").val();
			var arrProjectBudgetDetails={
				costCode:costCode,
				budgetCost:budgetCost,
				accordingInstructions:accordingInstructions
			}
			projectBudgetDetailsArr.push(arrProjectBudgetDetails);
		});
		var projectBudgetDetails = JSON.stringify(projectBudgetDetailsArr);
		
		$.ajax({//
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "finance/projectBudget/addOrUpdateBean", //ajax访问路径  
			data: {
				pkId:pkId,
				types:2,        
				projectCode:projectCode, 
				dataType:$('.project-span').data('dataType'),
				reportDate:reportDate,    
				outHospitalDate:outHospitalDate,    
				entrustOrgCount:entrustOrgCount,      
				isOffSiteTraining:isOffSiteTraining,  
				offSiteTrainingRequirement:offSiteTrainingRequirement,      
				costStandard:costStandard,      
				projectBudgetDetails:projectBudgetDetails,  
				dataStates:dataStates,    
				businessCode:"projectBudget",       
				dealingWithPeople:dealingWithPeople,  
				opintion:"",     
				budgetTraineeSum:$('.trainee-total').text(),
				processInstanceId:"",       
				nextCode:"submited"
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0){
				 	$yt_alert_Model.prompt("操作成功");
				}else{
					$yt_alert_Model.prompt("操作失败");
				}
			} 
		});
	},//合计      x合计的父级
	total:function(x){
		var num =0;
		$.each($(x).find('.budget-cost'),function(i,n){
			var val = $(n).val();
			val==''?val='0':val=val;
			num +=Number($yt_baseElement.rmoney(val));
		})
		$(x).find('.total').text($yt_baseElement.fmMoney(num,2)+'元');
		
	}
}
$(function() {
	//初始化方法
	projectBudgetChange.init();
	
});