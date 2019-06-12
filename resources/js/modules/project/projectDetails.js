/**
 * 教务模块我的项目详情
 */
var projectDetailsList = {
	//初始化方法
	init: function() {
		console.log('教务模块我的项目详情');
		var tp = "";
		var tp = $yt_common.GetQueryString('tp');
		if(tp == 1) {
			$('.hid-title').hide();
			$('.hid-approva-box').hide();
			$('.project-appro-btn-box').hide();
		}
		projectDetailsList.getTreeAllPersonnel();
		//初始化下拉列表
		$(".yt-select").niceSelect();
		//初始化日期控件
		$(".time-receipt").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			lowerLimit: "NaN", // 日期下限，默认：NaN(不限制)  
			upperLimit:$(".feedback-time"),
			nowData: false, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd",
			callback: function() { // 点击选择日期后的回调函数  
				//alert("您选择的日期是：" + $("#txtDate").val());  
			}
		});
		$(".feedback-time").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			lowerLimit: $(".time-receipt"), // 日期下限，默认：NaN(不限制)     
			nowData: false, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd",
			callback: function() { // 点击选择日期后的回调函数  
				//alert("您选择的日期是：" + $("#txtDate").val());  
			}
		});
		$(".date-birth").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			lowerLimit: "NaN", // 日期下限，默认：NaN(不限制)     
			nowData: false, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd",
			callback: function() { // 点击选择日期后的回调函数  
				//alert("您选择的日期是：" + $("#txtDate").val());  
			}
		});
		$(".party-date").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			lowerLimit: "NaN", // 日期下限，默认：NaN(不限制)     
			nowData: false, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd",
			callback: function() { // 点击选择日期后的回调函数  
				//alert("您选择的日期是：" + $("#txtDate").val());  
			}
		});
		$(".work-time").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			lowerLimit: "NaN", // 日期下限，默认：NaN(不限制)     
			nowData: false, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd",
			callback: function() { // 点击选择日期后的回调函数  
				//alert("您选择的日期是：" + $("#txtDate").val());  
			}
		});
		$(".discuss-date").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			lowerLimit: "NaN", // 日期下限，默认：NaN(不限制)     
			nowData: false, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd",
			callback: function() { // 点击选择日期后的回调函数  
				//alert("您选择的日期是：" + $("#txtDate").val());  
			}
		});
		$(".contract-startDate").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			lowerLimit: "NaN", // 日期下限，默认：NaN(不限制)     
			nowData: false, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd",
			callback: function() {
				var atartDate = $("input.contract-startDate").val();
				if(atartDate != ""){
					$("input.contract-startDate").removeClass("valid-hint");
					$("input.contract-startDate").next().text("");
				}
				if($(".contract-startDate").val()!=''&&$(".contract-endDate").val()!=''){
					var endDate = new Date($(".contract-endDate").val());
					var startDate = new Date($(".contract-startDate").val());
					var date =  endDate.getTime()-startDate;
					$('.contract-cycle').val((date/ 1000 / 60 / 60 / 24)+1)
				}
			}
		});
		$(".contract-endDate").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			lowerLimit: "NaN", // 日期下限，默认：NaN(不限制)     
			nowData: false, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd",
			callback: function() {
				var endDate = $("input.contract-endDate").val();
				if( endDate != ""){
					$("input.contract-endDate").removeClass("valid-hint");
					$("input.contract-endDate").next().text("");
				}
				if($("input.contract-startDate").val()!=''&&$("input.contract-endDate").val()!=''){
					var endDate = new Date($("input.contract-endDate").val());
					var startDate = new Date($("input.contract-startDate").val());
					var date =  endDate.getTime()-startDate;
					$('.contract-cycle').val((date/ 1000 / 60 / 60 / 24)+1);
				}
			}
		});
		//获取跳转页面传过来的pkId,projectCode
		var pkId = $yt_common.GetQueryString('pkId');
		var projectCode = $yt_common.GetQueryString('projectCode');
		var projectCodeList = $yt_common.GetQueryString('projectCodeList');
		var projectType = $yt_common.GetQueryString('projectType');
		$(".project-code").text(projectCodeList);
		//获取项目信息
		if (projectType == 2) {//项目类型为委托
			projectDetailsList.getProjectInf();
			projectDetailsList.getApproveInf();
		}else{//项目类型为选学和调训
			$(".hid-approva-box").hide();//隐藏审流
			$(".hid-title").hide();//隐藏审批流标题
			projectDetailsList.getProjectInf();
		}
		//隐藏input输入框
		$(".class-info-table input").attr("disabled", "disabled");

		//点击按钮
		$(".tab-title-list button").click(function() {
			$(this).addClass("active").siblings().removeClass("active");
			$(".box-list .content-box").eq($(this).index()).show().siblings().hide();
			if($(this).index()!=4){
				$('.list-table ').eq(5).addClass('work-table');
				$('.list-table ').eq(5).parent().addClass('work-table');
				$('.tab-title-list').removeClass('work-div');
				$('.project-title-div').removeClass('work-div-parent');
			}else{
				$('.list-table ').eq(5).addClass('work-table');
				$('.list-table ').eq(5).parent().addClass('work-table');
				if(document.body.clientWidth<1355){
					$('.tab-title-list').addClass('work-div');
					$('.project-title-div').addClass('work-div-parent');
				}else{
					$('.work-table').css({'width':'100%','box-sizing': 'border-box'});
				}
			}
		});
		//点击洽谈记录
		$(".discuss-records").click(function() {
			projectDetailsList.getDiscussInf();
		});
		//点击洽谈记录新增
		$(".btn-add").click(function() {
			$(".edit-discuss-alert-title").text("新增");
			//初始化日期
			$(".discuss-date").calendar();
			projectDetailsList.discussAdd();
			projectDetailsList.addDiscussData = {
				 discussDate:$('.discuss-index:last-child').find('p.discussDate').text(),
				 linkman:$('.discuss-index:last-child').find('p.linkman').text(),
				 phone:$('.discuss-index:last-child').find('p.phone').text(),
				 trainCost:$('.discuss-index:last-child').find('.train-cost').text(),
				 courseCost:$('.discuss-index:last-child').find('.course-cost').text(),
				 stayCost:$('.discuss-index:last-child').find('.stay-cost').text(),
				 mealCost:$('.discuss-index:last-child').find('.meal-cost').text(),
				 otherCost:$('.discuss-index:last-child').find('.other-cost').text(),
			}
			$('.alert-add-discuss').setDatas(projectDetailsList.addDiscussData)
			$(".add-discuss-alert .discuss-states").setSelectVal("");
			//洽谈记录内容要清空
			$(".add-discuss-alert .discussDetails").val("");
//			$(".add-discuss-alert .discuss-data").val("");
//			$(".add-discuss-alert .linkman").val(addDiscussData.linkman);
//			$(".add-discuss-alert .phone").val(addDiscussData.phone);
//			$(".add-discuss-alert .discussDetails").val(addDiscussData.discussDetails);
//			$(".add-discuss-alert .train-cost").val(addDiscussData.trainCost);
//			$(".add-discuss-alert .course-cost").val(addDiscussData.courseCost);
//			$(".add-discuss-alert .stay-cost").val(addDiscussData.stayCost);
//			$(".add-discuss-alert .meal-cost").val(addDiscussData.mealCost);
//			$(".add-discuss-alert .other-cost").val(addDiscussData.otherCost);
			$(".discuss-btn-sure .yt-model-sure-btn").off().on().click(function() {
				var discussId = "";
				if ($yt_valid.validForm($(".alert-add-discuss"))) {
					projectDetailsList.addDiscussList(discussId);
				}
			});
			$('.lawyer-opinion-box .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
					var linkman = $(".alert-add-discuss .linkman").val();
					var phone = $(".alert-add-discuss .phone").val();
					var discussDetails = $(".alert-add-discuss .discussDetails").val();
					var trainCost = $(".alert-add-discuss .train-cost").val();
					var courseCost = $(".alert-add-discuss .course-cost").val();
					var stayCost = $(".alert-add-discuss .stay-cost").val();
					var mealCost = $(".alert-add-discuss .meal-cost").val();
					var otherCost = $(".alert-add-discuss .other-cost").val();
					projectDetailsList.addDiscussData = {
						 linkman:linkman,
						 phone:phone,
						 discussDetails:discussDetails,
						 trainCost:trainCost,
						 courseCost:courseCost,
						 stayCost:stayCost,
						 mealCost:mealCost,
						 otherCost:otherCost,
					}
					//隐藏页面中自定义的表单内容  
					$(".lawyer-opinion-box").hide();
					//隐藏蒙层  
					$("#pop-modle-alert").hide();
			});
		});
		//点击洽谈记录编辑
		$(".discuss-box").on('click', '.discuss-editor', function() {
			//初始化日期
			$(".discuss-date").calendar();
			$(".edit-discuss-alert-title").text("编辑");
			projectDetailsList.discussAdd();
			var discussStates = $(this).parent().parent().parent().parent().parent().data("discussData").discussStates;
			var discussDate = $(this).parent().parent().parent().parent().parent().data("discussData").discussDate;
			var linkman = $(this).parent().parent().parent().parent().parent().data("discussData").linkman;
			var phone = $(this).parent().parent().parent().parent().parent().data("discussData").phone;
			var discussDetails = $(this).parent().parent().parent().parent().parent().data("discussData").discussDetails;
			var trainCost = $(this).parent().parent().parent().parent().parent().data("discussData").trainCost;
			var courseCost = $(this).parent().parent().parent().parent().parent().data("discussData").courseCost;
			var stayCost = $(this).parent().parent().parent().parent().parent().data("discussData").stayCost;
			var mealCost = $(this).parent().parent().parent().parent().parent().data("discussData").mealCost;
			var otherCost = $(this).parent().parent().parent().parent().parent().data("discussData").otherCost;
			var discussId = $(this).parent().parent().parent().parent().parent().data("discussData").discussId;
			$(".add-discuss-alert .discuss-states").setSelectVal(discussStates);
			$(".add-discuss-alert .discuss-date").val(discussDate)
			//$(".add-discuss-alert .discuss-data").val(discussDate);
			$(".add-discuss-alert .linkman").val(linkman);
			$(".add-discuss-alert .phone").val(phone);
			$(".add-discuss-alert .discussDetails").val(discussDetails);
			$(".add-discuss-alert .train-cost").val(trainCost);
			$(".add-discuss-alert .course-cost").val(courseCost);
			$(".add-discuss-alert .stay-cost").val(stayCost);
			$(".add-discuss-alert .meal-cost").val(mealCost);
			$(".add-discuss-alert .other-cost").val(otherCost);
			$(".add-discuss-alert .yt-model-sure-btn").off().on().click(function() {
				if ($yt_valid.validForm($(".alert-add-discuss"))) {
					projectDetailsList.addDiscussList(discussId);
				}
			});
		});
		//点击洽谈记录删除
		$(".discuss-box").on('click', '.discuss-del', function() {
			var discussId = $(this).find("input.discussId").val();
			$('.hid-discuss-id').val(discussId);
			projectDetailsList.delDiscussList(discussId);
		});
		//洽谈记录审核意见提交
		$('.discuss-box').on('click', '.talk-over-with-submit', function() {
			//确认取消按钮签对象
			var btn = $(this);
			//文本框对象
			var textareaNoe = $(this).parent().prev().find('.apprro-view');
			var discussId = $(this).parent().find('.hid-discuss-id').val();
			var details = $(this).parent().prev().find('.apprro-view').val();
			var pkId = $yt_common.GetQueryString('pkId');
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "project/addOrUpdateDiscussIdea",
				data: {
					pkId: pkId,
					discussId: discussId,
					ideaType: "2",
					details: details
				},
				async: false,
				beforeSend:function(){
					$yt_baseElement.showLoading();
				},
				success: function(data) {
					if(data.flag == 0) {
						$yt_baseElement.hideLoading();
						//提交成功，隐藏取消提交按钮
						$yt_alert_Model.prompt('提交成功')
						btn.parent().hide();
						projectDetailsList.getDiscussInf();
						
					}else{
						$yt_baseElement.hideLoading();
						$yt_alert_Model.prompt('提交失败')
					}
				},
				error:function(data){
					$yt_alert_Model.prompt('网络异常，请稍后重试')
				}
				
			});
		});
		
		//收费标准，单位名称select
		$('.charge-tbody1').on('change','select.group-select',function(){
			var me = this;
			var val = $(this).val();
			var index = $(this).parents('tr').index();
			$.each($('select.group-select'), function(i,n) {
				if(index!=$(n).parents('tr').index()&&$(n).val()==val){
					$(me).setSelectVal('');
					$yt_baseElement.showLoading();
					//获取集团名称
					var groupList = projectDetailsList.getListSelectGroup();
					$(me).niceSelect({  
					        search: true,  
					        backFunction: function(text) {  
					            //回调方法,可以执行模糊查询,也可自行添加操作  
					          $(me).find("option").remove();  
					            if(text == "") {  
					                $(me).append('<option value="">请选择</option>');  
					            }  
					            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
					            $.each(groupList, function(x, y) {  
					                if(y.groupName.indexOf(text) != -1) {  
											$(me).append('<option value="' + y.groupId + '">' + y.groupName + '</option>');
					                }  
					            });  
					        }  
					});
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt('此单位已有收费标准');
					});
				}
			});
		})
		//点击学员管理
		$(".student-admin").click(function() {
			//登录人名
			var userRealName = $('.hid-user-real-name').val();
			//项目销售人名
			var projectSellName = $('.hid-project-sell-name').val();
			//项目主任名
			var projectHead = $('.hid-project-head-name').val();
			projectHead = projectHead.split(',');
			if(userRealName==projectSellName||projectHead.indexOf(projectHead)!=-1){
			}else{
				$('.head-div').hide();
			}
			$(".check-all").setCheckBoxState("uncheck");
			projectDetailsList.getStudentAdminList();
			projectDetailsList.companyData();
			$(".student-admin-tbody").off('click').on("click", 'tr',function() {
				if($(this).find("input[type='checkbox']")[0].checked == true) {
					$(this).find("input[type='checkbox']").setCheckBoxState("uncheck");
					$(this).find("td").removeClass("yt-table-active");
					$(this).removeClass("yt-table-active");
				} else {
					$(this).find("input[type='checkbox']").setCheckBoxState("check");
					$(this).find("td").addClass("yt-table-active");
					$(this).addClass("yt-table-active");
				}
				if($(".student-admin-tbody input:checkbox").not("input:checked").length > 0){
					$(".check-all").setCheckBoxState("uncheck");
				}else{
					$(".check-all").setCheckBoxState("check");
				}
			});
		});
		/**
		 * 点击工作人员页签
		 */
		$(".work-peo-btn ").click(function(){
			
			projectDetailsList.workPeo();
		});
		/**
		 * 点击工作人员页签列表中的删除图标
		 */
		$(".work-peo-div").on('click','.del-work-peo',function(){
			var thisImg=$(this);
			thisImg.parents('tr').remove();
	         $.each($(".work-peo-tbody tr"), function(i,n) {
	          	$(n).find('td').eq(0).text(i+1);
	         });
//			 $yt_alert_Model.alertOne({  
//		        alertMsg: "数据删除将无法恢复,确认删除吗?", //提示信息  
//		        confirmFunction: function() { //点击确定按钮执行方法 
//		          thisImg.parents('tr').remove();
//		          $.each($(".work-peo-tbody tr"), function(i,n) {
//		          	$(n).find('td').eq(0).text(i+1);
//		          });
//		        },  
//		  
//		    });  
		});
		/**
		 * 点击工作人员新增按钮
		 */
		$(".work-peo-add").click(function(){
			var num=$(".work-peo-tbody tr:last").find('td').eq(0).text();
			if(num!=""){
				num=Number(num);
			}else{
				num=0;
			}
			var addHtml='<tr>'+
						'<td class="add-td-num">'+ (num+1) +'</td>'+
						'<td>'+
						'<select class="yt-select work-shen-select" style="width:100px">'+
						'<option value="1">驻班员</option>'+
						'<option value="2">委托方领导</option>'+
						'</select>'+
						'</td>'+
						'<td><input class="yt-input work-name" validform="{isNull:true,blurFlag:true}" type="text"/><span class="valid-font"></span></td>'+
						'<td><input class="yt-input work-room" type="text"/></td>'+
						'<td>'+
//							'<select class="yt-select comp-select" style="width:170px">'+
//							'<option value="">请选择</option>'+
//							'</select>'+
							'<input type="hidden" class="comp-select"/>'+
	  	    	      		'<input type="text" class="yt-input comp-group-name" style="cursor: default;" placeholder="请选择" readonly/>'+
						'</td>'+
						'<td><input class="yt-input work-dept" type="text" /></td>'+
						'<td><input class="yt-input work-postion" type="text" /></td>'+
						'<td><input class="yt-input standard-live money-rate" type="text" /></td>'+
						'<td><input class="yt-input standard-meal money-rate" type="text" /></td>'+
						'<td><input class="yt-input agreement-live money-rate" type="text" /></td>'+
						'<td><input class="yt-input  agreement-meal money-rate" type="text" /></td>'+
						'<td class="form-cont" data-in="" data-org="" data-tax="" data-address="" data-telephone="" data-reg="" data-account="">'+
						'<a href="#" class="edit-a">编辑</a></td>'+
						'<td>'+
							'<textarea class="yt-textarea" placeholder="请输入" style="resize: none;width: 98%; height: 33px;margin-top: 4px;"></textarea>'+  
						'</td>'+
						'<td align="center">'+
						'<span style="">'+
						'<img src="../../resources/images/icons/cost-level.png" style="cursor: pointer;" class="del-work-peo" alt="" />'+
						'</span>'+
						'</td>'+
						'</tr>';
					$(".work-peo-tbody").append(addHtml);
//					var compList=projectDetailsList.getListSelectGroup();
//					if(compList!=""){
//						$(".work-peo-tbody tr").eq(num).find(".comp-select").empty();
//						$(".work-peo-tbody tr").eq(num).find(".comp-select").append('<option value="">请选择</option>');
//						$.each(compList, function(i,n) {
//							$(".work-peo-tbody tr").eq(num).find(".comp-select").append('<option value="'+n.groupId+'">'+n.groupName+'</option>');
//						});
//						//$(".comp-select").niceSelect();
//					}
					$(".work-shen-select").niceSelect();
						
						
		});
		//点击工作人员列表选择集团
		$(".work-peo-div").on('mouseup','.comp-group-name',function(){
			projectDetailsList.getGroupAlertList($(this),$(this).siblings('.comp-select'),a,b,2);
			function a(){
				
			}
			function b(){
				
			}
		})
		//点击工作人员列表里的编辑
		$(".work-peo-div").on('click','.edit-a',function(){
				if ($(this).parent().parent().find(".comp-select").val() == "") {
					$yt_alert_Model.prompt("请选择单位名!");
					return false;
				}else{
					$(".hid-comp-select").val($(this).parent().parent().find(".comp-select").val());
				}
				$(".work-peo-invoice-form").find(".yt-input").removeClass("valid-hint");
				$(".work-peo-invoice-form").find(".valid-font").text("");
				var mo=$(this).parent();
				//弹窗初始化
				$(".work-invoice-type").val("");
				$(".work-org-name").val("");
				$(".work-tax-number").val("");
				$(".work-address").val("");
				$(".work-telephone").val("");
				$(".work-registered-bank").val("");
				$(".work-account").val("");
//				$(".work-comp-name").text("");
				//弹窗渲染数据
				var projectCode = $yt_common.GetQueryString('projectCode');
				var traineeOrGroupId = $(this).parents('tr').find(".comp-select").val();
				//弹窗
				$('.close-inp').show();
				$(".work-comp-name").text(mo.parent().find('.comp-select').siblings('.comp-group-name').val());
				var invoiceType="";
				if($(this).text()=='查看'){
					$('.spanDetail').show();
					$(".spanInput").hide();
					$('.or-star').hide();
					$('.work-peo-invoice-form .sub-invoice').hide();
				}else{
					$('.spanDetail').hide();
					$(".spanInput").show();
					$("select.spanInput").hide();
					$('.or-star').show();
					$('.work-peo-invoice-form .sub-invoice').show();
				}
				$.ajax({
					type: "post",
					url: $yt_option.base_path + "finance/projectInvoice/getInvoice",
					async: false,
					beforeSend:function(){
						$yt_baseElement.showLoading();
					},
					data: {
						projectCode: projectCode,
						types:"1",
						traineeOrGroupId:traineeOrGroupId
					},
					success: function(data) {
						if(data.flag == 0) {
							if (data.data != null) {
								if(data.data.invoiceType==1){
									data.data.invoiceTypeVal="普通发票";
								}else if(data.data.invoiceType==2){
									data.data.invoiceTypeVal="增值税发票";
								}
								if(data.data.invoiceModel==1){
									data.data.invoiceModelVal="个人/事业单位";
								}else if(data.data.invoiceModel==2){
									data.data.invoiceModelVal="单位";
								}
								$('.work-person-invoice').setDatas(data.data);
								$('.billing-inf-alert').setDatas(data.data);
								$(".work-peo-invoice-form .is-not-radio label input[value='"+data.data.invoiceModel+"']").setRadioState('check');
								$(".work-invoice-type").setSelectVal(data.data.invoiceType);
								$(".work-org-name").val(data.data.orgName);
								$(".work-tax-number").val(data.data.taxNumber);
								$(".work-address").val(data.data.address);
								$(".work-telephone").val(data.data.telephone);
								$(".work-registered-bank").val(data.data.registeredBank);
								$(".work-account").val(data.data.account);
							}
						} else {
							$yt_alert_Model.prompt("查询失败");
						}
						$yt_baseElement.hideLoading();
					}
				});
				/** 
				 * 显示编辑弹出框和显示顶部隐藏蒙层 
				 */
				projectDetailsList.judgeOrChoose(1);
				$(".work-peo-invoice-form").show();
				var selectVal=$(".work-peo-invoice-form .work-invoice-type").val();
				var radioVal=$(".work-peo-invoice-form label input:checked").val();
				$(".work-peo-invoice-form .is-not-radio").show();
				if(selectVal==1&&radioVal==1){
					projectDetailsList.judgeOrChoose(1);
				}else if(selectVal==1&&radioVal==2){
					projectDetailsList.judgeOrChoose(2);
				}else if(selectVal==2){
					$(".work-peo-invoice-form .is-not-radio").hide();
					projectDetailsList.judgeOrChoose(3);
				}
				/** 
				 * 调用算取div显示位置方法 
				 */
				$yt_alert_Model.setFiexBoxHeight($(".work-peo-invoice-form .yt-edit-alert-main"));
				$yt_alert_Model.getDivPosition($(".work-peo-invoice-form"));
				/* 
				 * 调用支持拖拽的方法 
				 */
				$yt_model_drag.modelDragEvent($(".work-peo-invoice-form .yt-edit-alert-title"));
				/**
				 * 点击确定按钮
				 */
				$('.work-peo-invoice-form .yt-model-sure-btn').on('click', function() {
					mo.attr('data-invModel',$('.work-peo-invoice-form .is-not-radio input:checked').val());
					mo.attr('data-in',$(".work-invoice-type").val());
					mo.attr('data-org',$(".work-org-name").val());
					mo.attr('data-tax',$(".work-tax-number").val());
					mo.attr('data-address',$(".work-address").val());
					mo.attr('data-telephone',$(".work-telephone").val());
					mo.attr('data-reg',$(".work-registered-bank").val());
					mo.attr('data-account',$(".work-account").val());
					if ($yt_valid.validForm($(".work-bill-tob"))) {
						projectDetailsList.savebillingInf(2);//传参2标识是工作人员提交发票信息
						$(".work-peo-invoice-form").hide();
					}
				});
				/** 
				 * 点击取消方法 
				 */
				$('.work-peo-invoice-form .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
					//隐藏页面中自定义的表单内容  
					$(".work-peo-invoice-form").hide();
				});
		});
		//点击发票类型下拉框
		$(".work-peo-invoice-form select.work-invoice-type").change(function(){
			$(".work-bill-tob").find(".yt-input").attr("validform","{isNull:false,blurFlag:true,msg:'不能为空!'}");
			$(".work-bill-tob").find(".yt-input").removeClass("valid-hint");
			$(".work-bill-tob").find(".valid-font").text("");
			var selectVal=$(this).val();
			var radioVal=$(".work-peo-invoice-form label input:checked").val();
			$(".work-peo-invoice-form .is-not-radio").show();
			if(selectVal==1&&radioVal==1){//普通发票类型的个人发/事业单位发票，只校验发票名
				projectDetailsList.judgeOrChoose(1);
				$(".work-org-name").attr("validform","{isNull:true,blurFlag:true,msg:'不能为空!'}");
				$(".work-tax-number").attr("validform","{isNull:false,blurFlag:true,msg:'不能为空!'}");
			}else if(selectVal==1&&radioVal==2){//普通发票的的的单位发票，只校验发票名和发票号
				projectDetailsList.judgeOrChoose(2);
				$(".work-org-name").attr("validform","{isNull:true,blurFlag:true,msg:'不能为空!'}");
				$(".work-tax-number").attr("validform","{isNull:true,blurFlag:true,msg:'不能为空!'}");
			}else{//专用发票
				$(".work-peo-invoice-form .is-not-radio").hide();
				projectDetailsList.judgeOrChoose(3);
				$(".work-bill-tob").find(".yt-input").attr("validform","{isNull:true,blurFlag:true,msg:'不能为空!'}");
			}
		});
		//点击单选按钮
		$(".work-peo-invoice-form label").click(function(){
			$(".work-bill-tob").find(".yt-input").attr("validform","{isNull:false,blurFlag:true,msg:'不能为空!'}");
			$(".work-bill-tob").find(".yt-input").removeClass("valid-hint");
			$(".work-bill-tob").find(".valid-font").text("");
			var radioVal=$(this).find('input').val();
			var selectVal=$(".work-peo-invoice-form select.work-invoice-type").val();
			if(radioVal==1&&selectVal==1){//普通发票的个人
				projectDetailsList.judgeOrChoose(1);
			}else if(radioVal==2&&selectVal==1){//专用发票
				projectDetailsList.judgeOrChoose(2);
			}
			if(selectVal == 1){//普通发票
				$(".work-org-name").attr("validform","{isNull:true,blurFlag:true,msg:'不能为空!'}");
				if(radioVal == 2){//单位，只验证名称和发票号 
					$(".work-tax-number").attr("validform","{isNull:true,blurFlag:true,msg:'不能为空!'}");
				}else{
					$(".work-tax-number").attr("validform","{isNull:false,blurFlag:true,msg:'不能为空!'}");
				}
			}else{//专用发票全部验证不能为空
				$(".work-bill-tob").find(".yt-input").attr("validform","{isNull:true,blurFlag:true,msg:'不能为空!'}");
			}
		});
		/**
		 * 点击工作人员页签里的确定按钮
		 */
		$(".table-bottom-div .yt-model-sure-btn").click(function(){
			var addTr=$(".work-peo-tbody tr");
			var personnelsList=[];
			var pkId=$yt_common.GetQueryString('pkId');
			$.each(addTr, function(i,n) {
				var groupId=$(n).find('.comp-select').val();
				groupId==''?groupId=null:groupId=groupId;
				var types=$(n).find('.work-shen-select').val();
				var personnelName=$(n).find('.work-name').val();
				var roomNumber=$(n).find('.work-room').val();
				var deptName=$(n).find('.work-dept').val();
				var positionname=$(n).find('.work-postion').val();
				var quarterageRackRate=$yt_baseElement.rmoney($(n).find('.standard-live').val());
				quarterageRackRate==''?quarterageRackRate=null:quarterageRackRate=quarterageRackRate;
				var mealFeeRackRate=$yt_baseElement.rmoney($(n).find('.standard-meal').val());
				mealFeeRackRate==''?mealFeeRackRate=null:mealFeeRackRate=mealFeeRackRate;
				var quarterageNegotiatedPrice=$yt_baseElement.rmoney($(n).find('.agreement-live').val());
				quarterageNegotiatedPrice==''?quarterageNegotiatedPrice=null:quarterageNegotiatedPrice=quarterageNegotiatedPrice;
				var mealFeeNegotiatedPrice=$yt_baseElement.rmoney($(n).find('.agreement-meal').val());
				mealFeeNegotiatedPrice==''?mealFeeNegotiatedPrice=null:mealFeeNegotiatedPrice=mealFeeNegotiatedPrice;
				var remarks=$(n).find('.yt-textarea').val();
//				mo.attr('data-in',$(".work-invoice-type").val());
//				mo.attr('data-org',$(".work-org-name").val());
//				mo.attr('data-tax',$(".work-tax-number").val());
//				mo.attr('data-address',$(".work-address").val());
//				mo.attr('data-telephone',$(".work-telephone").val());
//				mo.attr('data-reg',$(".work-registered-bank").val());
//				mo.attr('data-account',$(".work-account").val());
				var invoiceModel=$(n).find('.form-cont').attr('data-invModel');
				invoiceModel==undefined?invoiceModel='':invoiceModel=invoiceModel;
				var invoiceType=$(n).find('.form-cont').attr('data-in');
				var orgName=$(n).find('.form-cont').attr('data-org');
				var taxNumber=$(n).find('.form-cont').attr('data-tax');
				var address=$(n).find('.form-cont').attr('data-address');	
				var telephone=$(n).find('.form-cont').attr('data-telephone');
				var registeredBank=$(n).find('.form-cont').attr('data-reg');
				var account=$(n).find('.form-cont').attr('data-account');
				var workList={
					groupId:groupId,
					types:types,
					personnelName:personnelName,
					roomNumber:roomNumber,
					deptName:deptName,
					positionname:positionname,
					quarterageRackRate:quarterageRackRate,
					mealFeeRackRate:mealFeeRackRate,
					quarterageNegotiatedPrice:quarterageNegotiatedPrice,
					mealFeeNegotiatedPrice:mealFeeNegotiatedPrice,
					remarks:remarks,
					invoiceModel:invoiceModel,
					invoiceType:invoiceType,
					orgName:orgName,
					taxNumber:taxNumber,
					address:address,
					telephone:telephone,
					registeredBank:registeredBank,
					account:account
				};
				personnelsList.push(workList);
			});
			personnelsList=JSON.stringify(personnelsList);
			var isOrName=$yt_valid.validForm($(".work-peo-tbody"));
			if(!isOrName){
				
			}else{
				//显示整体框架loading的方法
				$yt_baseElement.showLoading();
				$.ajax({
					type:"post",
					url:$yt_option.base_path + "project/addPersonnelsList",
					data:{
						projectId:pkId,
						personnelsList:personnelsList
					},
					async:true,
					success:function(data){
						if(data.flag==0){
							$yt_alert_Model.prompt("保存成功！");
						}else{
							$yt_alert_Model.prompt("保存失败！");
						}
						projectDetailsList.workPeo();
						//隐藏整体框架loading的方法
						$yt_baseElement.hideLoading();
					}
				});
			}
			
		});
		//复选框
		//全选  
		$(".check-all").change(function() {
			//判断自己是否被选中  
			if($(this).parent().hasClass("check")) {
				//设置反选  
				$(this).parents("table").find("tbody input[type='checkbox']").setCheckBoxState("uncheck");
				$(".student-admin-tbody").find("td").removeClass("yt-table-active");
				$(".student-admin-tbody").find("tr").removeClass("yt-table-active");
			} else {
				//调用设置选中方法,全选  
				$(this).parents("table").find("tbody input[type='checkbox']").setCheckBoxState("check");
				$(".student-admin-tbody").find("td").addClass("yt-table-active");
				$(".student-admin-tbody").find("tr").addClass("yt-table-active");
			}
		});
		var btnType;//标识新增还是修改
		//点击学员管理新增
		$(".student-add").click(function() {
			projectDetailsList.companyData();
			projectDetailsList.clearFormData();
			projectDetailsList.studentAdd();
			//设置标题内容
			$(".yt-edit-alert-title-msg").text("新增学员");
			//点击新增
			$(".add-student .yt-model-sure-btn").off().click(function() {
				if($yt_valid.validForm($('.add-valid'))) {
					
					projectDetailsList.addStudentList();
				}else{
					
				}
			});
		});
		//点击集团排序
		$(".click-group-name").click(function(){
			$(".click-type").val("1");
			if ($(".group-order-type").val() == "ASC") {
				$(".group-order-type").val("DESC");
			}else{
				$(".group-order-type").val("ASC");
			}
			projectDetailsList.getStudentAdminList();
		});
		//点击单位排序
		$(".click-org-name").click(function(){
			$(".click-type").val("2");
			if ($(".org-order-type").val() == "ASC") {
				$(".org-order-type").val("DESC");
			}else{
				$(".org-order-type").val("ASC");
			}
			projectDetailsList.getStudentAdminList();
		});
		//点击学员管理修改
		$(".student-amend").click(function() {
			//判断是否有选中行
			if($('.student-admin-tbody input[name="test"]:checked').length != 1){
				$yt_alert_Model.prompt("请选择一条记录!");
				return false;
			}
			projectDetailsList.clearFormData();
			var traineeId = $('.student-admin-tbody input[name="test"]:checked').parent().parent().parent().find(".trainee-id").val();
			//获取被选中行的详细信息
			projectDetailsList.getStudentInf(traineeId);
			//设置标题内容
			$(".yt-edit-alert-title-msg").text("修改学员");
			projectDetailsList.studentAdd();
			//点击修改确定按钮
			$(".add-student .yt-model-sure-btn").off().click(function() {
				projectDetailsList.amendStudentList();
			});
		});
		//点击设为重要学员按钮
		$(".set-import-student").click(function(){
			if($('.student-admin-tbody label.yt-checkbox input:checked').length < 1){
				$yt_alert_Model.prompt("请勾选学员!");
				return false;
			}
				projectDetailsList.setImportStudentAppend();
				/** 
				 * 显示编辑弹出框和显示顶部隐藏蒙层 
				 */
				$(".set-inport-student-div").show();
				$(".set-inport-student-div .list-tbody span[class!='can-tr-btn']").hide();
				$(".set-inport-student-div .list-tbody textarea").show();
				$('.set-inport-student-div .yt-model-sure-btn').attr('repair-btn','false');
				$('.set-inport-student-div .yt-model-sure-btn').val("确定");
				/** 
				 * 调用算取div显示位置方法 
				 */
				//$yt_alert_Model.setFiexBoxHeight($(".set-inport-student-div .yt-edit-alert-main"));
				$yt_alert_Model.getDivPosition($(".set-inport-student-div"));
				/* 
				 * 调用支持拖拽的方法 
				 */
				$yt_model_drag.modelDragEvent($(".set-inport-student-div .yt-edit-alert-title"));
				/**
				 * 点击确定按钮
				 */
				$('.set-inport-student-div .yt-model-sure-btn').off('click').on('click', function() {
					var repairBtn=$(this).attr('repair-btn');
					if(repairBtn=="true"){
						$(this).val("确定");
						$(".set-inport-student-div .list-tbody span").hide();
						$(".set-inport-student-div .list-tbody textarea").show();
						$(this).attr('repair-btn','flase');
					}else{
						$(this).val("修改");
						$(".set-inport-student-div .list-tbody span").show();
						$(".set-inport-student-div .list-tbody textarea").hide();
						$(this).attr('repair-btn','true');
						var projectCode = $yt_common.GetQueryString("projectCode");
						var traineeImportantList=[];
						var impStu=$(".set-inport-student-div .list-tbody tr");
						$.each(impStu, function() {
							var isImportant=1;
							var importantDetails=$(this).find('textarea').val();
							var traineeId=$(this).find('textarea').attr('data-trainee');
							var list={
								isImportant:isImportant,
								importantDetails:importantDetails,
								traineeId:traineeId
							};
							traineeImportantList.push(list);
						});
						traineeImportantList=JSON.stringify(traineeImportantList);
						console.log("traineeImportantList",traineeImportantList);
						$.ajax({
							type:"post",
							url:$yt_option.base_path + "class/trainee/updateTraineeImportant",
							data:{
								projectCode:projectCode,
								traineeImportantList:traineeImportantList
							},
							async:true,
							success:function(data){
								if(data.flag==0){
									$yt_alert_Model.prompt("重要学员设置成功");
									projectDetailsList.getStudentAdminList();
									projectDetailsList.setImportStudentAppend();
									//$(".set-inport-student-div").hide();
								}else{
									$yt_alert_Model.prompt("重要学员设置失败");
								}
							}
						});
					}
					
				});
				/** 
				 * 点击取消方法 
				 */
				$('.set-inport-student-div .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
					//隐藏页面中自定义的表单内容  
					$(".set-inport-student-div").hide();
				});
		});
		//设为重要学员弹窗里列表的取消按钮
		$(".set-inport-student-div .list-tbody").off('click').on('click','.can-tr-btn',function(){
			var thisTd=$(this);
			var projectCode = $yt_common.GetQueryString("projectCode");
			var traineeImportantList={
				isImportant:0,
				traineeId:$(this).parents('tr').find('textarea').attr('data-trainee')
			};
			traineeImportantList=JSON.stringify(traineeImportantList);
				$.ajax({
					type:"post",
					url:$yt_option.base_path + "class/trainee/updateTraineeImportant",
					data:{
					projectCode:projectCode,
					traineeImportantList:traineeImportantList
					},
					async:true,
					success:function(data){
						if(data.flag==0){
							$yt_alert_Model.prompt("取消成功");
							projectDetailsList.getStudentAdminList();
							thisTd.parents('tr').remove();
						}else{
							$yt_alert_Model.prompt("取消失败");
						}
					}
				});
			
		});
		//点击删除
		$(".student-del").on('click', function() {
			//判断是否有选中行
			if($('.student-admin-tbody input:checked').length == 0) {
				$yt_alert_Model.prompt("请选择要删除的数据");
				return false;
			}
			//调用删除方法  删除被选中的数据
			projectDetailsList.delStudentList();
		});
		//点击日志
		$(".log-list").off().click(function() {
			if($('.student-admin-tbody input:checked').length < 2) {
				projectDetailsList.studentLog();
			} else {
				$yt_alert_Model.prompt("请选中一条记录!");
			}
		});
		$('.money-log-list').off().click(function(){
			projectDetailsList.moneyLog()
		})
		$(".log-search-btn").click(function(){
			projectDetailsList.getStuLogList();
			return false;
		});
		//点击推送
		$('.exportList2').off().click(function() {
			if($('.student-admin-tbody input:checked').length == 0) {
				$yt_alert_Model.prompt("请选择需要推送的学员");
			} else {
				projectDetailsList.exportList();
			}
		})
		//点击批量导入学员显示弹窗
		$(".student-lead").click(function() {
			projectDetailsList.studentLead();
			$(".lead-student .yt-model-sure-btn").off().click(function() {
				projectDetailsList.batchStudentLead();
			});
		});
		//导入文件选择按钮
		$(".lead-student").undelegate().delegate("input[type='file']", "change", function() {
			$('.lead-student .import-file-name').val($(this)[0].files[0].name);
		});
		//下载附件
		$(".download-template").off().click(function() {
			var fileName = $(".import-file-name").val();
			var downUrl = $yt_option.base_path + "class/trainee/downloadTraineeByClass";
			$.ajaxDownloadFile({
				url: downUrl,
				data: {
					fileName: fileName,
					isDownload: true
				}
			});
		});
		//点击导出
		$(".export-student-list").on("click", function() {
			
			//判断是否有选中行
//			if($("tr.yt-table-active").length == 0) {
//				$yt_alert_Model.prompt("请选择要操作的数据");
//				return false;
//			}
			//项目名
			var projectName = $(".project-title-center").text();
			//系统时间
			var myDate = new Date();
			//获取当前年
			var year=myDate.getFullYear();
			//获取当前月
			var month=myDate.getMonth()+1;
			//获取当前日
			var todayDate=myDate.getDate(); 
			var outFileDate = year+'-'+month+'-'+todayDate;
			//获取被选中行的数据
			var projectCode = $yt_common.GetQueryString('projectCode');
			var exportName = projectName+'学员名单'+outFileDate+'.xls';
			var selectParam = $(".teacher-info-btn-list").find(".selectParam").val();
//			var gender = $('.yt-table-active').data("legalData").gender;
//			var phone = $('.yt-table-active').data("legalData").phone;
//			var groupId = $('.yt-table-active').data("legalData").groupId;
//			var orgId = $('.yt-table-active').data("legalData").orgId;
//			var deptPosition = $('.yt-table-active').data("legalData").deptPosition;
//			var isFirstTraining = $('.yt-table-active').data("legalData").isFirstTraining;
//			var classCommitteeId = $('.yt-table-active').data("legalData").classCommitteeId;
//			var signUpState = $('.yt-table-active').data("legalData").signUpState;
			var downUrl = $yt_option.base_path + "class/trainee/exportTraineeByClass";
			$.ajaxDownloadFile({
				url: downUrl,
				data: {
					projectCode: projectCode,
					exportName: exportName,
					selectParam: selectParam,
					gender: "",
					phone: "",
					groupId: "",
					orgId: "",
					deptPosition: "",
					isFirstTraining: "",
					classCommitteeId: "",
					signUpState: "",
					isDownload: true
				}
			});
		});
		//点击返回
		$(".btn-return").click(function() {
			var indexNum = $yt_common.GetQueryString('indexNum');
			if(indexNum == "1" || indexNum == "2"){
				window.location.href="/cbead/website/view/projectApproval/projectApprovalList.html?indexNum="+indexNum;
			}else{
				window.history.back();
			}
			
		});
		$('.charge-tbody1').on('click','.comp-group-name',function(){
			projectDetailsList.getGroupAlertList($(this),$(this).siblings('.group-select'),a,b,2);
			function a(){
				
			}
			function b(){
				
			}
		})
		//2.点击新增
		$(".add-charge").click(function() {
			var num = $(".charge-tbody1 tr:last").find('.addchargenum').text();
			num = Number(num);
			$(".charge-tbody1").append('<tr>' +
				'<td style="text-align:center"><span class="addchargenum" style="margin-left:10px">' + (num + 1) + '</span></td>' +
				'<td class="groupId">' +
				'<span class="groupName"></span>'+
//				'<select class="yt-select group-select" style="width:200px">' +
//				'<option value="">请选择</option>' +
//				'</select>' +
				'<input type="hidden" class="group-select"/>'+
	      		'<input type="text" class="yt-input comp-group-name" style="cursor: default;" placeholder="请选择" readonly/>'+
				'</td>' +
				'<td><span></span><input class="yt-input trainingExpenseRackRate money-rate" type="text"/></td>' +
				'<td><span></span><input class="yt-input traineeRackRate money-rate" type="text"/></td>' +
				'<td><span></span><input class="yt-input quarterageRackRate money-rate" type="text" /></td>' +
				'<td><span></span><input class="yt-input mealFeeRackRate money-rate" type="text" /></td>' +
				'<td><span></span><input class="yt-input trainingExpenseNegotiatedPrice money-rate" type="text" /></td>' +
				'<td><span></span><input class="yt-input traineeNegotiatedPrice money-rate" type="text" /></td>' +
				'<td><span></span><input class="yt-input quarterageNegotiatedPrice money-rate" type="text" /></td>' +
				'<td><span></span><input class="yt-input mealFeeNegotiatedPrice money-rate" type="text" /></td>' +
				'<td align="center" invoicetype=" " invoicemodel=" " orgname=" " taxnumber=" " address=" " telephone=" " registeredbank=" " account=" "><a class="editor-charge">编辑</a></td>' +
				'<td align="center">' +
				'<span style="">' +
				'<img src="../../resources/images/icons/cost-level.png" class="del-charge" alt="" />' +
				'</span>' +
				'</td>' +
				'</tr>');
//			//获取集团名称
//			var groupList = projectDetailsList.getListSelectGroup();
//			if(groupList != null) {
//				$(".charge-tbody1 tr:last").find("select.group-select").empty();
//				$(".charge-tbody1 tr:last").find("select.group-select").append('<option value="">请选择</option>');
//				$.each(groupList, function(i, n) {
//					$(".charge-tbody1 tr:last").find("select.group-select").append('<option value="' + n.groupId + '">' + n.groupName + '</option>');
//				});
//			}
//			  $(".charge-tbody1 tr:last").find("select.group-select").niceSelect({  
//			        search: true,  
//			        backFunction: function(text) {  
//			            //回调方法,可以执行模糊查询,也可自行添加操作  
//			          $(".charge-tbody1 tr:last").find("select.group-select option").remove();  
//			            if(text == "") {  
//			                $(".charge-tbody1 tr:last").find("select.group-select").append('<option value="">请选择</option>');  
//			            }  
//			            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
//			            $.each(groupList, function(x, y) {  
//			                if(y.groupName.indexOf(text) != -1) {  
//									$(".charge-tbody1 tr:last").find("select.group-select").append('<option value="' + y.groupId + '">' + y.groupName + '</option>');
//			                }  
//			            });  
//			        }  
//			});
		});
		//点击编辑按钮  显示开票信息弹出框
		var thisEdito;
		$(".charge-tbody1").on('click', '.editor-charge', function() {
			$(".invoice-inf .class-info-centent").find(".yt-input").removeClass("valid-hint");
			$(".invoice-inf .class-info-centent").find(".valid-font").text("");
			$(".invoice-inf .orgName").attr("validform","{isNull:true,blurFlag:true,msg:'不能为空!'}");
			thisEdito=$(this).parent();
			var projectCode = $yt_common.GetQueryString('projectCode');
			var traineeOrGroupId = $(this).parent().parent().find(".group-select").val();
			if(traineeOrGroupId != ""){
				//弹窗
				projectDetailsList.billingInf();
				$('.close-inp').show();
				var invoiceType="";
				$.ajax({
					type: "post",
					url: $yt_option.base_path + "finance/projectInvoice/getInvoice",
					async: false,
					beforeSend:function(){
						$yt_baseElement.showLoading();
					},
					data: {
						projectCode: projectCode,
						types:"1",
						traineeOrGroupId:traineeOrGroupId
					},
					success: function(data) {
						if(data.flag == 0) {
							if (data.data != null) {
								if(data.data.invoiceType==1){
									invoiceType="普通发票";
								}else if(data.data.invoiceType==2){
									invoiceType="增值税发票";
								}
								$("select.invoiceType").setSelectVal(data.data.invoiceType);
								$(".billing-inf-alert tbody .is-not-comp label input[value='"+data.data.invoiceModel+"']").setRadioState('check');
								$('.billing-inf-alert').setDatas(data.data);
								$('.billing-inf-alert tbody span.tick-type').text(invoiceType);
							}
						} else {
							$yt_alert_Model.prompt("查询失败");
						}
						$yt_baseElement.hideLoading();
					}
				});
				$(".group-id-hid").val($(this).parent().parent().find(".group-select").val());
				//收费标准点击弹窗确定按钮
				$(".invoice-inf .sub-invoice").click(function() {
					thisEdito.attr('invoiceType',$('.invoice-inf .invoiceType').val());
					thisEdito.attr('invoiceModel',$('.invoice-inf .is-not-comp label input:checked').val());
					thisEdito.attr('orgName',$('.invoice-inf .orgName').val());
					thisEdito.attr('taxNumber',$('.invoice-inf .taxNumber').val());
					thisEdito.attr('address',$('.invoice-inf .address').val());
					thisEdito.attr('telephone',$('.invoice-inf .telephone').val());
					thisEdito.attr('registeredBank',$('.invoice-inf .registeredBank').val());
					thisEdito.attr('account',$('.invoice-inf .account').val());
					if ($yt_valid.validForm($(".take-money-bill"))) {
						projectDetailsList.savebillingInf(1);//传参1标识是收费标准提交发票信息
						$(".billing-inf-alert").hide();
					}
				});
				//点击下拉框切换
				$(".billing-inf-alert tbody .invoiceType").change(function(){
					projectDetailsList.clearOpenTicket();
					$(".invoice-inf .class-info-centent").find(".yt-input").attr("validform","{isNull:false,blurFlag:true,msg:'不能为空!'}");
					$(".invoice-inf .class-info-centent").find(".yt-input").removeClass("valid-hint");
					$(".invoice-inf .class-info-centent").find(".valid-font").text("");
					$(".invoice-inf .orgName").attr("validform","{isNull:true,blurFlag:true,msg:'不能为空!'}");
					var selecltVal=$(this).val();
					var labVal=$(".billing-inf-alert tbody .is-not-comp label input:checked").val();
					if(selecltVal==1){//普通发票
						$(".billing-inf-alert tbody .is-not-comp").show();
						if(labVal==1){//个人/事业单位
							$(".billing-inf-alert table span.per-span").text("*");
						}else if(labVal==2){//单位发票，验证名称和发票号
							$(".invoice-inf .taxNumber").attr("validform","{isNull:true,blurFlag:true,msg:'不能为空!'}");
							$(".billing-inf-alert table span.per-span").text("*");
							$(".billing-inf-alert table span.comp-span").text("*");
						}
					}else{//专用发票验证所有数据
						$(".invoice-inf .class-info-centent").find(".yt-input").attr("validform","{isNull:true,blurFlag:true,msg:'不能为空!'}");
						$(".billing-inf-alert tbody .is-not-comp").hide();
						$(".billing-inf-alert table span.per-span").text("*");
						$(".billing-inf-alert table span.comp-span").text("*");
						$(".billing-inf-alert table span.comp-label-span").text("*");
					}
				});
				//单选框单击事件
				$(".billing-inf-alert tbody .is-not-comp label").click(function(){
					projectDetailsList.clearOpenTicket();
					var labVal=$(this).find('input').val();
					if(labVal==1){
						$(".invoice-inf .taxNumber").attr("validform","{isNull:false,blurFlag:true,msg:'不能为空!'}");
						$(".invoice-inf .taxNumber").removeClass("valid-hint");
						$(".invoice-inf .taxNumber").parent().find(".valid-font").text("");
						$(".billing-inf-alert table span.per-span").text("*");
					}else if(labVal==2){
						$(".invoice-inf .taxNumber").attr("validform","{isNull:true,blurFlag:true,msg:'不能为空!'}");
						$(".billing-inf-alert table span.per-span").text("*");
						$(".billing-inf-alert table span.comp-span").text("*");
					}
				});
				if($(this).text()=="查看"){//开票弹窗隐藏输入框
					projectDetailsList.clearOpenTicket();
					$(".sub-invoice").hide();
					$(".billing-inf-alert tbody .is-not-comp").hide();
					$(".billing-inf-alert tbody .invoiceType").hide();
					$(".billing-inf-alert tbody span.inv-span").show();
					$(".billing-inf-alert tbody input.yt-input").hide();
				}else{
					$(".billing-inf-alert tbody .invoiceType").show();
					$(".billing-inf-alert tbody .is-not-comp").show();
					$(".invoiceType").niceSelect();
					$(".sub-invoice").show();
					$(".billing-inf-alert tbody span.inv-span").hide();
					$(".billing-inf-alert tbody input.yt-input").show();
					projectDetailsList.addStar();
				}
			}else{
				$yt_alert_Model.prompt("请选择单位！");
			}
			
		});
		//点击收费标准
		$(".charge-standard").click(function() {
			//登录人名
			var userRealName = $('.hid-user-real-name').val();
			//项目销售人名
			var projectSellName = $('.hid-project-sell-name').val();
			if(userRealName != projectSellName){
					$(".shell-or-true").val("1");
						//刷新学员费用详情
						$(".btn-sub-charge").text('编辑');
						$.each($('.charge-standard-index  input'),function(i,n){
							$(n).hide();
							$(n).siblings('span').text($(n).val());
							$(n).siblings('span').show();
						})
						$.each($('.personal-standard input'),function(i,n){
							$(n).hide();
							$(n).siblings('span').text($(n).val());
							$(n).siblings('span').show();
						})
						$('.unit-tfoot').hide();
						$('div.group-select').hide();
						$.each($('select.group-select'),function(i,n){
							$(n).siblings('.groupName').text($(n).find('option:selected').text());
							$(n).siblings('.groupName').show();
						})
						$(".btn-sub-charge").remove();
						//显示弹窗确定按钮
						$("sub-invoice").show();
						//显示弹窗取消按钮
						$("close-inp").show();
						//隐藏学员详情下的确定按钮
						$(".update-trainee-details").hide();
			}else{
				$(".update-trainee-details").show();
			}
			//获取学员费用详情
			projectDetailsList.getStudentCostInf('begin');
			//获取单位标准
			projectDetailsList.getUnitCostInf();
			//点击隐藏
			$(".stop-charging").click(function() {
				$(this).attr('src','../../resources/images/icons/close-suo-hong.png');
				$(this).parent().find(".enable-the-charge").attr('src','../../resources/images/icons/open-suo-hui.png');
				$(this).parent().parent().parent().find("table.list-table").hide();
			});
			//点击显示
			$(".enable-the-charge").click(function() {
				$(this).attr('src','../../resources/images/icons/open-suo-red.png');
				$(this).parent().find(".stop-charging").attr('src','../../resources/images/icons/close-suo-hui.png');
				$(this).parent().parent().parent().find("table.list-table").show();
			});
			//点击确定提交数据
			$('.btn-charge').off().on('click','.btn-sub-charge',function(){
				var bool = true;
				$.each($('.charge-tbody1 .group-select'), function(i, n) { 
					if($(n).val() == '') {
						bool = false;
					}
				});
				if(bool){
					if($yt_valid.validForm($('.charge-tbody'))&&$yt_valid.validForm($('.personal-standard'))){
						projectDetailsList.saveChargeStandard();
						$(this).text('确定');
						$.each($(".charge-tbody1 tr"),function(b,k){
							$(k).find(".editor-charge").text("查看");
							$(k).find(".del-charge").hide();
						});
						//刷新学员费用详情
						$(".btn-sub-charge").text('编辑');
						$.each($('.charge-tbody1 input'),function(i,n){
							$(n).hide();
							$(n).siblings('span').text($(n).val());
							$(n).siblings('span').show();
						})
						$.each($('.personal-standard input'),function(i,n){
							$(n).hide();
							$(n).siblings('span').text($(n).val());
							$(n).siblings('span').show();
						})
						$('.unit-tfoot').hide();
						$('div.group-select').hide();
						$.each($('select.group-select'),function(i,n){
							$(n).siblings('.groupName').text($(n).find('option:selected').text());
							$(n).siblings('.groupName').show();
						})
						$(".btn-sub-charge").attr('class','yt-option-btn btn-move-charge');
					}else{	
					$yt_alert_Model.prompt("请将信息填写完整");
				}
			} else {
					$yt_alert_Model.prompt("请选择增加的集团名称");
			}
			});
			$('.btn-charge').on('click','.btn-move-charge',function(){//可编辑
					$(this).text('确定');
					$.each($(".charge-tbody1 tr"),function(b,k){
						$(k).find(".editor-charge").text("编辑");
						$(k).find(".del-charge").show();
					});
					$('.charge-tbody1 input').show();
					$('.charge-tbody1 input').siblings('span').hide();
					$('.personal-standard input').show();
					$('.personal-standard input').siblings('span').hide();
					$('.unit-tfoot').show();
					$('.comp-group-name').show().siblings('.list-span').hide();
					$('select.group-select').prevAll('span').hide();
					$(this).attr('class','yt-option-btn btn-sub-charge');
			});
			//点击学员费用详情确定提交数据
			$(".update-trainee-details").off().click(function() {
				if($(".update-trainee-details").text() == "确定"){
					$(".update-trainee-details").text("编辑");
					projectDetailsList.updateTraineeDetails();
					$.each($(".student-cost-tbody").find(".yt-input"), function(i,p) {
						$(p).hide();
						$(p).prev().show();
					});
				}else{
					$(".update-trainee-details").text("确定");
					$.each($(".student-cost-tbody").find(".yt-input"), function(i,p) {
						$(p).show();
						$(p).prev().hide();
						
					});
				}
				
			});
			//单位标准输入框金额初始化
			$('.charge-table1,.personal-standard,work-peo-tbody').off('blur').on('blur','.money-rate',function(){
				if($(this).val()!=""){ 
	                //调用格式化金额方法  
	               // $(this).attr('old',$(this).val());
	                $(this).val($yt_baseElement.fmMoney($(this).val()));
	            }  
			});
			$(".student-cost-tbody").on('blur','.yt-input',function(){
				$(this).val($yt_baseElement.fmMoney($(this).val()));
			});
		});
		//点击教学方案
		$(".teaching-plan").click(function() {
			projectDetailsList.getTeachPlanDesignRequirements();
		});
		//教学方案设计需求提交
		//点击提交
		$(".btn-teach-plan-submit").click(function() {
			if($yt_valid.validForm($(".teach-plan-table-input"))){
				var dataStates = 1;
				projectDetailsList.teachPlanDesignRequirements(dataStates);
			}
			
		});
		//点击保存
		$(".btn-teach-plan-save").click(function() {
			if($yt_valid.validForm($(".teach-plan-table-input"))){
				var dataStates = 0;
				projectDetailsList.teachPlanDesignRequirements(dataStates);
			}
			
		});
		//获取民族
		var nationsList = projectDetailsList.getListSelectNations();
		if(nationsList != null) {
			$.each(nationsList, function(i, n) {
				$("select.nation-id").append('<option value="' + n.nationId + '">' + n.nationName + '</option>');
			});
		}
		$("select.nation-id").niceSelect();
		//学员管理条件搜索
		$('.search-btn').click(function() {
			//调用获取列表数据方法查询
			projectDetailsList.getStudentAdminList();
		});
		//点击姓名查看选学学员详情
		$(".student-admin-table").off().on('click', '.real-name-alert-details', function() {
//			$('.nice-select.nation-id').remove();
//			$('span.nation-id').show();
			var traineeId = $(this).parent().parent().find(".trainee-id").val();
			//获取被选中行的详细信息
			projectDetailsList.getStudentInf(traineeId);
			projectDetailsList.elementaryStudentDetailsAlert();
			$('.student-details-tecket').css('height','auto');
			$(".shut-down").click(function() {
				$(".elementary-student-details").hide();
			});
		});

		//教学方案初稿附件上传  
		$("#filediv").undelegate().delegate("#addFile", "change", function() {
			var addFile = $(this).attr("id");
			$yt_baseElement.showLoading();
			var url = $yt_option.acl_path + "api/tAscPortraitInfo/addFile";
			$.ajaxFileUpload({
				url: url,
				type: "post",
				data: {
					modelCode: "teachPlan"
				},
				dataType: 'json',
				fileElementId: addFile,
				success: function(data, textStatus) {
					var resultData = $.parseJSON(data);
					if(resultData.success == 0) {
						$yt_alert_Model.prompt("附件上传成功");
						$(".file-id").empty();
						$(".file-id").append('<p style="width:870px;height:40px;border:1px dashed #e6e6e6;line-height:40px;">' +
							'<input type="hidden" class="down-file-url" value="'+$yt_option.acl_path +'api/tAscPortraitInfo/download?isDownload=true&pkId=' + resultData.obj.pkId + '">' +
							'<span class="file-name" style="margin-right: 50px;color:blue;cursor: pointer"><input type="hidden" class="file-span-id" value="' + resultData.obj.pkId + '" >' + resultData.obj.naming + '</span>' +
							'<span class="del-file-p" style="float:right;cursor: pointer;"><img src="../../resources/images/icons/teach-plan-del.png" alt="" />删除</span>' +
							'<span class="down-load-file-index" style="float:right;cursor: pointer;"><img src="../../resources/images/icons/down-load-teach-plan.png" alt="" />下载</span>' +
							'<span style="float:right; display:none;"><img src="../../resources/images/icons/preview.png" alt="" />预览</span>' +
							'</p>');

					} else {
						$yt_alert_Model.prompt("附件上传失败");
					}
					$yt_baseElement.hideLoading();
				},
				error: function(data, status, e) { //服务器响应失败处理函数  
					$yt_alert_Model.prompt("附件上传失败");
					$yt_baseElement.hideLoading();
				}
			});
		});
		//初稿下载附件
		$(".first-draft-inf").off().on("click", ".down-load-file-index", function() {
			var downUrl = $(this).parent().find('.down-file-url').val();
			$.ajaxDownloadFile({
				url: downUrl
			});
		});
		//初稿模板下载
		$(".first-down-load-template").click(function(){
			projectDetailsList.downExpial();
		});
		//终稿模板下载
		$(".down-load-template").click(function(){
			projectDetailsList.downExpial();
		});
		
		//初稿删除附件
		$(".file-id").on("click", ".del-file-p", function() {
			$(this).parent().remove();
		});
		//初稿点击取消
		$('.btn-teach-plan-star-cancel').click(function() {
			$(".file-id").empty();
		});
		//终稿下载
		$(".last-draft-inf").on('click','.last-down-load-file-index',function() {
			var downUrl = $(this).parent().find(".last-down-file-url").val();
			$.ajaxDownloadFile({
				url: downUrl
			});
		});
		//终稿删除
		$(".last-file-id").on('click','.del-file-p',function() {
			$(".last-file-id").empty();
		});
		//终稿点击取消
		$('.btn-teach-plan-end-cancel').click(function() {
			$(".last-file-id").empty();
		});
		//教学方案终稿附件上传
		$(".last-draft-btn").undelegate().delegate("#lastFile", "change", function() {
			var addFile = $(this).attr("id");
			$yt_baseElement.showLoading();
			var url = $yt_option.acl_path + "api/tAscPortraitInfo/addFile";
			$.ajaxFileUpload({
				url: url,
				type: "post",
				data: {
					modelCode: "teachPlan"
				},
				dataType: 'json',
				fileElementId: addFile,
				success: function(data, textStatus) {
					var resultData = $.parseJSON(data);
					if(resultData.success == 0) {
						$yt_alert_Model.prompt("附件上传成功");
						$(".last-file-id").empty();
						$(".last-file-id").append('<p style="width:870px;height:40px;border:1px dashed #e6e6e6;line-height:40px;">' +
							'<input type="hidden" class="last-down-file-url" value="'+$yt_option.acl_path +'api/tAscPortraitInfo/download?isDownload=true&pkId=' + resultData.obj.pkId + '">' +
							'<span class="file-name" style="margin-right: 50px;color:blue;cursor: pointer"><input type="hidden" class="file-span-id" value="' + resultData.obj.pkId + '" >' + resultData.obj.naming + '</span>' +
							'<span class="del-file-p" style="float:right;cursor: pointer;"><img style="margin-right:5px;" src="../../resources/images/icons/teach-plan-del.png" alt="" />删除</span>' +
							'<span class="last-down-load-file-index" style="float:right;cursor: pointer;margin-right:30px"><img style="margin-right:5px;" src="../../resources/images/icons/down-load-teach-plan.png" alt="" />下载</span>' +
							'<span style="float:right; display:none;"><img src="../../resources/images/icons/preview.png" alt="" />预览</span>' +
							'</p>');

					} else {
						$yt_alert_Model.prompt("附件上传失败");
					}
					$yt_baseElement.hideLoading();
				},
				error: function(data, status, e) { //服务器响应失败处理函数  
					$yt_alert_Model.prompt("附件上传失败");
					$yt_baseElement.hideLoading();
				}
			});
		});

		//项目主任首次操作点击提交
		$(".btn-teach-plan-star-submit").click(function() {
			if($(".file-id").children().length == 0){
				$yt_alert_Model.prompt("请上传初稿!");
			}else{
				projectDetailsList.firstDraftByProjectDirector(1);
			}
		});
		//项目主任终稿提交
		$(".btn-teach-plan-end-submit").click(function() {
			projectDetailsList.firstDraftByProjectDirector(2);
		});
		// 教学方案初稿审批流程单选按钮
		$(".check-label input[type='radio']").change(function() {
			var rad = $(this).val();
			//单选当前值为1同意显示下一步操作人下拉框
			if(rad == "completed") { //同意显示下一步操作人
				if($('.hid-tast-key').val() != "activitiEndTask") {
					$('.hid-input').show();
				} else {
					$('.hid-input').hide();
				}
			} else { //拒绝隐藏下一步操作人
				$('#nextPeople').val("");
				$('.hid-input').hide();
			}
		});
		// 项目审批流程单选按钮
		$(".project-radio input[type='radio']").off().change(function() {
			var rad = $(this).val();
			//单选当前值为1同意显示下一步操作人下拉框
			if(rad == "completed") {
				if($('.hid-tast-key').val() == "activitiEndTask") {
						$('.hid-input').hide();
			} else {
					$('.hid-input').show();
				}	
			};
			//单选当前值为0拒绝隐藏下一步操作人下拉框
			if(rad == "returnedSubmit") {
				$('#nextPeople').val(" ");
				$('.hid-input').hide();
			}
		});

		//点击返回
		$('.back-btn').click(function() {
			window.history.back();
		});

		//教学方案审批-------------------------------------------------------------STAR

		$('.appro-submit-teach').click(function() {
			//流程实例id
			var processInstanceId = $('.hid-process-instance-id').val();
			var projectId = $yt_common.GetQueryString('pkId');

			//下一步操作人
			var dealingWithPeople = $('.next-people-teach').val();
			var tastKey = $('.tast-key-teach').val();
			//如果满足该条件，是没结束流程的最后一步，不需要传下一步操作人
			if(tastKey == "activitiEndTask") {
				dealingWithPeople = "";
			}
			//审批意见
			var opintion = $('.opintion-teach').val();
			//判断同意和不同意
			var nextCode = $('input[name="radioTeacher"]:checked ').val();
			//拒绝下一步操作人传空
			if(nextCode == "returnedSubmit") {
				dealingWithPeople = "";
			}
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "project/updateTeachingSchemeApply",
				data: {
					projectId: projectId,
					businessCode: "teachingsSchemeLevel",
					dealingWithPeople: dealingWithPeople,
					opintion: opintion,
					processInstanceId: processInstanceId,
					nextCode: nextCode
				},
				success: function(data) {
					if(data.flag == 0) {
						window.location.href = "teachingDesignApproveList.html";
					};
				}
			});
		});
		//审批取消
		$('.appro-cancel-teach').click(function() {
			//跳转到教学方案审批列表页面
			window.location.href = "../projectApproval/teachingDesignApproveList.html";
		});
		//教学方案审批-------------------------------------------------------------END	

		//项目信息审批意见提交
		$('.appro-submit').click(function() {
			if($('#nextPeople').val() == 'no' && $('.next-operate-person-tr').css('display') != 'none') {
				$yt_alert_Model.prompt("请选择下一步操作人");
			} else {
				//流程实例id
				var processInstanceId = $('.hid-process-instance-id').val();
				var pkId = $yt_common.GetQueryString('pkId');
				var projectCode = $yt_common.GetQueryString('projectCode');

				//下一步操作人
				var dealingWithPeople = $('#nextPeople').val();
				var tastKey = $('.hid-tast-key').val();
				//如果满足该条件，是没结束流程的最后一步，不需要传下一步操作人
				if(tastKey == "activitiEndTask") {
					dealingWithPeople = "";
				}
				//审批意见
				var opintion = $('#opintion').val();
				//判断同意和不同意
				var nextCode = $('input[name="radioType"]:checked ').val();
				//拒绝
				if(nextCode == "returnedSubmit") {
					dealingWithPeople = "";
				}
				$('.appro-submit').attr('disabled',true);
				if(nextCode=="completed"&&tastKey == "activitiEndTask"){
					projectDetailsList.classteacher();
					return false
				}
				projectDetailsList.submitApprove(pkId,projectCode,dealingWithPeople,opintion,processInstanceId,nextCode);
			}
		});
		//审批取消
		$('.appro-cancel').click(function() {
			//跳转到审批列表页面
			var indexNum = $yt_common.GetQueryString('indexNum');
			if(indexNum!=undefined){
				window.location.href="/cbead/website/view/projectApproval/projectApprovalList.html?indexNum="+indexNum;
			}
		});

	},
	/**
	 * 初始化弹框
	 */
	initForm:function(){
		$(".billing-inf-alert tbody .invoiceType").setSelectVal(1);
		$(".billing-inf-alert tbody input.yt-input").val("");
	},
	/**
	 * 判断下拉框与是否选择个人还是单位
	 */
	judgeOrChoose:function(type){
		$(".work-peo-invoice-form tbody span.is-or-name").text("");
		$(".work-peo-invoice-form tbody span.is-or-comp").text("");
		$(".work-peo-invoice-form tbody span.is-or-all").text("");
		if(type==1){
			$(".work-peo-invoice-form tbody span.is-or-name").text("*");
		}else if(type==2){
			$(".work-peo-invoice-form tbody span.is-or-name").text("*");
			$(".work-peo-invoice-form tbody span.is-or-comp").text("*");
		}else if(type==3){
			$(".work-peo-invoice-form tbody span.is-or-name").text("*");
			$(".work-peo-invoice-form tbody span.is-or-comp").text("*");
			$(".work-peo-invoice-form tbody span.is-or-all").text("*");
		}
	},
	/**
	 * 添加*号方法
	 */
	addStar:function(){
		projectDetailsList.clearOpenTicket();
		var selectVal=$(".billing-inf-alert tbody .invoiceType").val();
		var labVal=$(".billing-inf-alert tbody .is-not-comp label input:checked").val();
			if(selectVal==1){
					$(".billing-inf-alert tbody .is-not-comp").show();
				if(labVal==1){
					$(".billing-inf-alert table span.per-span").text("*");
				}else if(labVal==2){
					$(".billing-inf-alert table span.per-span").text("*");
					$(".billing-inf-alert table span.comp-span").text("*");
				}
			}else{
				$(".billing-inf-alert tbody .is-not-comp").hide();
				$(".billing-inf-alert table span.per-span").text("*");
				$(".billing-inf-alert table span.comp-span").text("*");
				$(".billing-inf-alert table span.comp-label-span").text("*");
			}
	},
	/**
	 * 清空弹框*号
	 */
	clearOpenTicket:function(){
		$(".billing-inf-alert table span.per-span").text("");
		$(".billing-inf-alert table span.comp-span").text("");
		$(".billing-inf-alert table span.comp-label-span").text("");
	},
	/**
	 * 下载模板
	 */
	downExpial:function(){
		var htmlUrl='';
		$.ajax({
			url:$yt_option.base_path + "project/downloadTeachingScheme",
			data:{
//				fileName:"教学方案模板"
			},
			async:false,
			success:function(data){
				if(data.flag==0){
					htmlUrl=data.message;
				}
			}
		});
		$.ajaxDownloadFile({
			url:htmlUrl,
			data:{
				fileName:"教学方案模板"
			}
		});
	},
	/**
	 * 工作人员页签查询数据
	 */
	workPeo:function(){
			var pkId=$yt_common.GetQueryString('pkId');
			//显示整体框架loading的方法
			$yt_baseElement.showLoading();
			//列表添加数据
			$.ajax({
				type:"post",
				url: $yt_option.base_path + "project/getPersonnelsList",
				data:{
					projectId:pkId
				},
				async:true,
				success:function(data){
					$(".work-peo-tbody").empty();
					if(data.flag==0){
						var htmlTr='';
						if(data.data.length!=0){
							$.each(data.data, function(i,v) {
								v.quarterageRackRate==undefined?v.quarterageRackRate='':v.quarterageRackRate=v.quarterageRackRate;
								v.mealFeeRackRate==undefined?v.mealFeeRackRate='':v.mealFeeRackRate=v.mealFeeRackRate;
								v.quarterageNegotiatedPrice==undefined?v.quarterageNegotiatedPrice='':v.quarterageNegotiatedPrice=v.quarterageNegotiatedPrice;
								v.mealFeeNegotiatedPrice==undefined?v.mealFeeNegotiatedPrice='':v.mealFeeNegotiatedPrice=v.mealFeeNegotiatedPrice;
								htmlTr='<tr>'+
									'<td style="">'+ (i+1) +'</td>'+
									'<td>'+
										'<span class="hid-span next-select"></span>'+
										'<select class="yt-select work-shen-select" style="width:100px">'+
											'<option value="1">驻班员</option>'+
											'<option value="2">委托方领导</option>'+
										'</select>'+
									'</td>'+
									'<td><span class="hid-span"></span><input class="yt-input work-name" type="text" validform="{isNull:true,blurFlag:true}" value="'+v.personnelName+'"/><span class="valid-font"></span></td>'+
									'<td><span class="hid-span"></span><input class="yt-input work-room" type="text"   value="'+v.roomNumber+'"/></td>'+
									'<td>'+
										'<span class="hid-span"></span>'+
//										'<select class="yt-select comp-select" style="width:170px">'+
//										'<option value="">请选择</option>'+
//										'</select>'+
  	    	      						'<input type="text" class="yt-input comp-group-name" style="cursor: default;" placeholder="请选择" value="'+(v.groupName?v.groupName:"")+'" readonly/>'+
										'<input type="hidden" class="comp-select" value="'+v.groupId+'"/>'+
									'</td>'+
									'<td><span class="hid-span"></span><input class="yt-input work-dept" type="text" value="'+v.deptName+'" /></td>'+
									'<td><span class="hid-span"></span><input class="yt-input work-postion" type="text" value="'+v.positionname+'" /></td>'+
									'<td><span class="hid-span"></span><input class="yt-input standard-live money-rate" type="text" value="'+$yt_baseElement.fmMoney(v.quarterageRackRate)+'" /></td>'+
									'<td><span class="hid-span"></span><input class="yt-input standard-meal money-rate" type="text" value="'+$yt_baseElement.fmMoney(v.mealFeeRackRate)+'" /></td>'+
									'<td><span class="hid-span"></span><input class="yt-input agreement-live money-rate" type="text"  value="'+$yt_baseElement.fmMoney(v.quarterageNegotiatedPrice)+'"/></td>'+
									'<td><span class="hid-span"></span><input class="yt-input  agreement-meal money-rate" type="text"  value="'+$yt_baseElement.fmMoney(v.mealFeeNegotiatedPrice)+'"/></td>'+
									'<td class="form-cont" data-invModel="'+v.invoiceModel+'" data-in="'+v.invoiceType+'" data-org="'+v.orgName+'" data-tax="'+v.taxNumber+'" data-address="'+v.address+'" data-telephone="'+v.telephone+'" data-reg="'+v.registeredBank+'" data-account="'+v.account+'">'+
									'<a href="#" class="edit-a">编辑</a></td>'+
									'<td>'+
										'<span class="hid-span next-textarea" style="text-align:left;display: block;"></span>'+
										'<textarea class="yt-textarea" placeholder="请输入" style="resize: none;width: 98%; height: 33px;margin-top: 4px;">'+v.remarks+'</textarea>'+  
									'</td>'+
									'<td align="center">'+
									'<span style="">'+
									'<img src="../../resources/images/icons/cost-level.png" style="cursor: pointer;" class="del-work-peo" alt="" />'+
									'</span>'+
									'</td>'+
									'</tr>';
									$(".work-peo-tbody").append(htmlTr);
//									var compList=projectDetailsList.getListSelectGroup();
//									if(compList!=""){
//										$(".work-peo-tbody tr").eq(i).find(".comp-select").empty();
//										$(".work-peo-tbody tr").eq(i).find(".comp-select").append('<option value="">请选择</option>');
//										$.each(compList, function(a,n) {
//											$(".work-peo-tbody tr").eq(i).find(".comp-select").append('<option value="'+n.groupId+'">'+n.groupName+'</option>');
//										});
//										//$(".comp-select").niceSelect();
										$(".work-shen-select").niceSelect();
//									}
									$(".work-peo-tbody tr").eq(i).find(".work-shen-select").setSelectVal(v.types);
//									$(".work-peo-tbody tr").eq(i).find(".comp-select").setSelectVal(v.groupId);
							});
							
						}else{
							//项目审批页面跳转显示暂无数据
							if($yt_common.GetQueryString('approveWorkPerson') == "awp" || $yt_common.GetQueryString('approveWorkPerson') == "message"){
								htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
								'<td colspan="14" align="center" style="border:0px;">' +
								'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
								'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
								'</div>' +
								'</td>' +
								'</tr>';
							}
							$(".work-peo-tbody").append(htmlTr);
						}
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading();
					}else{
						//隐藏整体框架loading的方法
						$yt_baseElement.hideLoading();
						$yt_alert_Model.prompt("查询失败");
					}
					//单位标准输入框金额初始化
					$('.work-peo-tabe').on('blur','.money-rate',function(){
						if($(this).val()!=""){ 
			                //调用格式化金额方法  
			                //$(this).attr('old',$(this).val());
			                $(this).val($yt_baseElement.fmMoney($(this).val()));
			            }  
					});
					//项目审批列表跳转过来的不能添加修改工作人员  approve
					if($yt_common.GetQueryString('approveWorkPerson') == "awp" ||$yt_common.GetQueryString('approveWorkPerson') == "message"){
						$(".work-peo-tbody").find(".edit-a").text('查看');
						$(".work-peo-tbody").find(".del-work-peo").hide();
						$(".work-peo-add").hide();
						$(".table-bottom-div").hide();
						$.each($(".work-peo-tbody").find(".hid-span"),function(s,p){
							if ($(p).hasClass("next-select") || $(p).hasClass("next-textarea")) {//0和3是下拉框，10是文本输入框
								if ($(p).hasClass("next-textarea")) {
									$(p).text($(p).next().val());
									$(p).next().hide();
								}else{
									if ($(p).next().val() != "") {
										$(p).text($(p).next().find("option:selected").text());
									}
									$(p).parent().find(".yt-select").hide();
								}
							}else{
								$(p).text($(p).next().val());
								$(p).next().hide();
							}
						});
					}
				}
			});
	},
	/**
	 * 设为重要学员弹框添加数据
	 */
	setImportStudentAppend:function(){
		var setImpot=[];
		var appHtml="";
		//已勾选的行
		var checkedTr=$('.student-admin-tbody label.yt-checkbox input:checked').parents('tr');
		//var allTr=$('.student-admin-tbody tr');
		//未勾选的行
		var noCheckedTr=$('.student-admin-tbody label.yt-checkbox input[checked!=checked]').parents('tr');
		if(checkedTr.length==0){
			$.each(noCheckedTr, function(i,n) {
				$(this).data('legalData').checkedName='0';
				var getImportant=$(this).attr('isImportant');
				if(getImportant==1){
					setImpot.push($(this).data('legalData'));
				}
			});
		}else{
			$.each(checkedTr, function(i,n) {
				$(this).data('legalData').checkedName='1';
				var getImportant=$(this).attr('isImportant');
//				if(getImportant!=1){
					setImpot.push($(this).data('legalData'));
//				}
			});
			$.each(noCheckedTr, function(i,n) {
				$(this).data('legalData').checkedName='0';
				var getImportant=$(this).attr('isImportant');
				if(getImportant==1){
					setImpot.push($(this).data('legalData'));
				}
			});
			//setImpot=setImpot.reverse();//给数组排序
		}
		$(".set-inport-student-div .list-tbody").empty();
		if(setImpot.length!=0){
			$.each(setImpot, function(i,b) {
				if(b.deptPosition=="/"){
					b.deptPosition="";
				}
				if(b.checkedName==1){
					appHtml +='<tr class="yt-table-active">';
				}else{
					appHtml +='<tr>';
				}
				appHtml+='<td>'+b.realName+'</td>'+
						'<td>'+b.gender+'</td>'+
						'<td>'+b.phone+'</td>'+
						'<td>'+b.groupOrgName+'</td>'+
						'<td>'+b.deptPosition+'</td>'+
						'<td style="padding:5px;"><span>'+b.importantDetails+'</span><textarea data-trainee="'+b.traineeId+'"  class="yt-textarea" style="resize: none;width:98%;height:40px;display:none;">'+b.importantDetails+'</textarea></td>';
				if(b.isImportant==1){
					//$(".set-inport-student-div thead th.opera-th").show();
					appHtml+='<td><a class="can-tr-btn yt-link">取消</a></td>';
				}else{
					appHtml+='<td></td>';
					//$(".set-inport-student-div thead th.opera-th").hide();
				}
				appHtml+='</tr>';
				
			});
			$(".set-inport-student-div .list-tbody").append(appHtml);
			$(".set-inport-student-div .list-tbody textarea").attr('placeholder','请输入学员原因');
		}else{
			appHtml='<tr class="class-tr">'+
						'<td colspan="7" align="ce+ter" style="border:0px;">'+
							'<div class="no-data" style="width: 280px;margin: 0 auto;">'+
								'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">'+
							'</div>'+
						'</td>'+
					'</tr>';
			$(".set-inport-student-div .list-tbody").append(appHtml);
		}
		/** 
		 * 调用算取div显示位置方法 
		 */
		$yt_alert_Model.setFiexBoxHeight($(".set-inport-student-div .yt-edit-alert-main"));
		$yt_alert_Model.getDivPosition($(".set-inport-student-div"));
	},
	//项目进度状态
	projectStateStepFn:function(dataArr){
//		var createTimeString = dataArr[0].createTimeString;//项目创建时间
//		var approvalTimeString = dataArr[1].approvalTimeString;//立项时间
//		var feedbackTime = dataArr[2].feedbackTime;//讲学方案反馈时间
//		var applyTime = dataArr[3].applyTime;//初稿提交时间
//		var startDate = dataArr[4].startDate;//培训日期
//		var endDate = dataArr[5].endDate;//结项时间
		//详情页的项目状态图
		var projectStates = this.getBeanById.projectStates;
//	    var days = daysBetween('2016-11-01',currentdate);
		//1:未立项
		//2:审批中
		//3:未通过
		//4:已立项
		//5:培训中
		//6:未结项
		//7:已结项
		$('.project-first-step p').text(dataArr[0].createTimeString);
		function secondStep(){
			//立项
			$('.seconed-step-blue').show();
			$('.seconed-step-grey').hide();
			//只要年月日
			if(dataArr[0].approvalTimeString =='' || dataArr[0].approvalTimeString ==null){
				
			}else{
				dataArr[0].approvalTimeString = dataArr[0].approvalTimeString.split(' ')[0]
				$('.project-second-step p').text(dataArr[0].approvalTimeString);
			}
		}
		function fourthStep(){
			//培训
			$('.fourth-step-blue').show();
			$('.fourth-step-grey').hide();
			$('.project-fourth-step p').text(dataArr[0].startDate);
		}
		function fifthStep(){
			//结项
			$('.fifth-step-blue').show();
			$('.fifth-step-grey').hide();
			$('.project-fifth-step p').text(dataArr[0].endDate);
		}
		function thirdStep(){
			//教学方案
			$('.third-step-blue').show();
			$('.third-step-grey').hide();
			$('.project-third-step p').text(dataArr[0].applyTime);
			var applyTime = new Date(dataArr[0].applyTime);
			var feedbackTime = new Date(dataArr[0].feedbackTime);
			if(applyTime.getTime()>feedbackTime.getTime()){
				var date1=feedbackTime;  //开始时间
				var date2=applyTime;    //结束时间
				var date3=date2.getTime()-date1.getTime()  //时间差的毫秒数
				
				//计算出相差天数
				var days=Math.floor(date3/(24*3600*1000))
				 
				//计算出小时数
				var leave1=date3%(24*3600*1000)    //计算天数后剩余的毫秒数
				var hours=Math.floor(leave1/(3600*1000))
				//计算相差分钟数
				var leave2=leave1%(3600*1000)        //计算小时数后剩余的毫秒数
				var minutes=Math.floor(leave2/(60*1000))
				 
				//计算相差秒数
				var leave3=leave2%(60*1000)      //计算分钟数后剩余的毫秒数
				var seconds=Math.round(leave3/1000)
				var loadTime = " 相差 "+days+"天 "+hours+"小时 "+minutes+" 分钟"+seconds+" 秒";
				$('.project-third-step span').text('已停滞'+loadTime);
			}
		}
		//1:未立项
		//2:审批中
		//3:未通过
		//4:已立项
		//5:培训中
		//6:未结项
		//7:已结项
		if(projectStates==4){
			secondStep();
		}
		if(projectStates==5){
			secondStep();
			fourthStep();
		}
		if(projectStates==6){
			secondStep();
			fourthStep();
		}
		if(projectStates==7){
			secondStep();
			fourthStep();
			fifthStep();
		}
		if(dataArr[0].applyTime!=''){
			thirdStep();
		}
		var classProjectStates = $yt_common.GetQueryString('classProjectStates');
//		1:未开始
//		2:培训中
//		3:未结项
//		4:已结项
		if(classProjectStates==1){
			secondStep();
		}
		if(classProjectStates==2||classProjectStates==3){
			secondStep();
			fourthStep();
		}
		if(classProjectStates==4){
			secondStep();
			fourthStep();
			fifthStep();
		}
	},
	//获取登录人信息
	userInfo: function() {
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "uniform/user/getUsersDetails", //ajax访问路径  
			data: {}, //ajax查询访问参数
			async:false,
			success: function(data) {
				$('.hid-user-real-name').val(data.data.userName);
			}

		});
	},
	//-------------------------------审批功能END
	/**
	 * 收费标准获取所有集团,单位
	 */
	getListSelectGroup: function() {
		var list = [];
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/group/getGroups",
			data: {
				isSelectGroup: '3',
				groupId: ""
			},
			async: false,
			success: function(data) {
				list = data.data || [];
			}
		});
		return list;
	},
	//获取集团列表
	getGroupAlertList:function(inputval,inputId,sureBack,canelBack,types){
		$('.receive-group-search').val('');
		function listData(){
			$('.receive-group-page').pageInfo({
			type:"post",
			url:$yt_option.base_path+"class/noticeReception/getGroups",
			async:true,
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			before:function(){
				$yt_baseElement.showLoading();
			},
			data:{
				groupName:$('.receive-group-search').val(),
				types:types?types:1
			},
			success:function(data){
				$yt_baseElement.hideLoading();
				if(data.flag==0){
					var tr = '';
					$('.receive-group-tbody').empty();
					$.each(data.data.rows,function(i,n){
						tr = '<tr><td groupId="'+n.groupId+'">'+n.groupName+'</td></tr>';
						$('.receive-group-tbody').append(tr);
					})
					/** 
				 * 调用算取div显示位置方法 
				 */
				$(".receive-group-div").show();
				$yt_alert_Model.setFiexBoxHeight($(".receive-group-div .yt-edit-alert-main"));
				$yt_alert_Model.getDivPosition($(".receive-group-div"));
				$yt_model_drag.modelDragEvent($(".receive-group-div .yt-edit-alert-title"));
				}else{
					$yt_alert_Model.prompt('查询失败')
				}
			},
			error:function(){
				$yt_baseElement.hideLoading();
				$yt_alert_Model.prompt('查询失败')
			},
			isSelPageNum: false //是否显示选择条数列表默认false  
		});
		}
		listData();
		$('.receive-group-canel-btn').off().click(function(){
				$('.receive-group-div').hide();
				canelBack()
			})
		$('.receive-group-sure-btn').off().click(function(){
			if($('.receive-group-div .yt-table-active')[0]){
				var bool = true;
				if($(inputId).hasClass('group-select')){
					$.each($('.charge-tbody1 .group-select'),function(i,n){
						$(n).val()==$('.receive-group-div .yt-table-active td').attr('groupId')?bool=false:"";
					})
				}
				if(bool){
					$(inputId).val($('.receive-group-div .yt-table-active td').attr('groupId'));
					$(inputval).val($('.receive-group-div .yt-table-active td').text());	
					$('.receive-group-div').hide();
					sureBack()
				}else{
					$yt_alert_Model.prompt('该集团已存在')
				}
			}else{
				$yt_alert_Model.prompt('请选择集团单位');
			}

		})
		$('.receive-group-div .receive-group-btn-img').off().click(function(){
			listData()
		})
	},
	/**
	 * 获取所有集团,单位
	 */
	getListSelectGroup1: function(isSelectGroup,groupId) {
		var list = [];
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/group/getGroups",
			data: {
				isSelectGroup: isSelectGroup,
				groupId: groupId
			},
			async: false,
			success: function(data) {
				list = data.data || [];
			}
		});
		return list;
	},
	/**
	 * 获取民族
	 */
	getListSelectNations: function() {
		var list = [];
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/getNations",
			data: {
				searchParameters: ""
			},
			async: false,
			success: function(data) {
				list = data.data || [];
			}
		});
		return list;
	},
		treeAllPersonal:[],
		/**
			 * 获取树形结构所有人员
			 */
		getTreeAllPersonnel: function() {
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "uniform/user/getUsers",
				beforeSend:function(){
					$yt_baseElement.showLoading();
				},
				data: {
				},
				async: true,
				success: function(data) {
					projectDetailsList.treeAllPersonal = data.data || [];
					$yt_baseElement.hideLoading();
				}
			});
		},
		getBeanById:'',
	//我的项目查询一条详细信息
	getProjectInf: function() {
		var me = this;
		$yt_baseElement.showLoading();
		//获取当前登录人
		projectDetailsList.userInfo();
		var projectType = $yt_common.GetQueryString('projectType');
		var pkId = $yt_common.GetQueryString('pkId');
		//存放项目状态图需要的时间
		var dataArr = [];
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "project/getBeanById", //ajax访问路径  
			data: {
				pkId: pkId
			}, //ajax查询访问参数
			async:false,
			success: function(data) {
				if(data.flag == 0) {
					me.getBeanById = data.data;
					var dataArrJson = {
						//创建项目时间
						createTimeString:data.data.createTimeString,
						//已立项目时间
						approvalTimeString:data.data.approvalTimeString,
						//教学方案反馈时间
						feedbackTime:data.data.feedbackTime,
						//初稿提交时间
						applyTime:data.data.applyTime,
						//培训开始时间
						startDate:data.data.startDate,
						//结项时间
						endDate:data.data.endDate
					}
					dataArr.push(dataArrJson);
					//调用项目状态显示图
					projectDetailsList.projectStateStepFn(dataArr);
					//获取销售人名和项目主任名
					$('.hid-project-sell-name').val(data.data.projectSell);
					$('.hid-project-head-name').val(data.data.projectHead);
					$(".project-title-center").text(data.data.projectName);
					$(".get-project-inf").setDatas(data.data);
					$('.project-sell-name').val(data.data.projectSellName);
					$('.project-head').val(data.data.projectHead);
					if(projectType == 2&&('1,2,3').indexOf(data.data.projectStates)!=-1){//项目类型是委托的，不显示项目编号
						$(".approve-over-project-code").text("");
					}else{//项目类型为选学或调训
						$(".approve-over-project-code").text(data.data.projectCode);
					}
					
					var flowLog;
					if(data.data.flowLog == '') {
						//如果没有立项，无法提交教学方案审批
						/*$('.btn-teach-plan-submit').off();
						$('.btn-teach-plan-submit').css('background-color', '#797979');
						$('.project-appro-btn-box').hide();*/
					} else {
						flowLog = JSON.parse(data.data.flowLog);
					}
					if(flowLog != null && flowLog.length > 0) {
						if(flowLog[0].tastKey == "activitiEndTask" && flowLog[0].deleteReason != "") {
							$(".approve-over-project-code").text(data.data.projectCode);
						} else {
							$(".approve-over-project-code").text("");
						}
					}
					if(data.data.projectType == 1) {
						$(".project-type").text("计划");
						$('.documentCodeTd').hide();
					} else if(data.data.projectType == 2) {
						$(".project-type").text("委托");
						$('.documentCodeTd').hide();
					} else if(data.data.projectType == 3) {
						$(".project-type").text("选学");
						$('.project-appro-btn-box').hide()
						$(".applicant-info-hide,.discuss-records").hide();
						$('.documentCodeTd').show();
					} else if(data.data.projectType == 4) {
						$(".project-type").text("中组部调训");
						$('.documentCodeTd').hide();
					} else if(data.data.projectType == 5) {
						$(".project-type").text("国资委调训");
						$('.documentCodeTd').hide();
					}
					$yt_baseElement.hideLoading();

				} else {
					$yt_alert_Model.prompt("获取失败");
					$yt_baseElement.hideLoading();
				}
			}
		});
	},
	//设置负责人
	setHeadAlert: function(locations) {
		var me = this;
		//流程实例id
		var processInstanceId = $('.hid-process-instance-id').val();
		var pkId = $yt_common.GetQueryString('pkId');
		var projectCode = $yt_common.GetQueryString('projectCode');
		//下一步操作人
		var dealingWithPeople = $('#nextPeople').val();
		var tastKey = $('.hid-tast-key').val();
		//如果满足该条件，是没结束流程的最后一步，不需要传下一步操作人
		if(tastKey == "activitiEndTask") {
			dealingWithPeople = "";
		}
		//审批意见
		var opintion = $('#opintion').val();
		//判断同意和不同意
		var nextCode = $('input[name="radioType"]:checked ').val();
		//拒绝
		if(nextCode == 'returnedSubmit') {
			dealingWithPeople = "";
		}
		//隐藏页面中自定义的表单内容  
		$(".set-principal-alert").hide();
		//隐藏蒙层  
		$("#pop-modle-alert").hide();
		me.submitApprove(pkId,projectCode,dealingWithPeople,opintion,processInstanceId,nextCode,locations);
		
	},
	//设置负责人弹出框
	setPrincipal: function() {
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$(".set-principal-alert").show();
		/** 
		 * 调用算取div显示位置方法 
		 */
		$yt_alert_Model.getDivPosition($(".set-principal-alert"));
		/* 
		 * 调用支持拖拽的方法 
		 */
		$yt_model_drag.modelDragEvent($(".set-principal-alert .yt-edit-alert-title"));
		/** 
		 * 点击取消方法 
		 */
	},
	//项目审批提交
	submitApprove:function(pkId,projectCode,dealingWithPeople,opintion,processInstanceId,nextCode,locations){
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "project/updateApply",
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			async:false,
			data: {
				pkId: pkId,
				projectCode: projectCode,
				businessCode: "project",
				dealingWithPeople: dealingWithPeople,
				opintion: opintion,
				processInstanceId: processInstanceId,
				nextCode: nextCode
			},
			success: function(data) {
				if(data.flag == 0) {
					$yt_baseElement.hideLoading();
					if(locations!='nolocation'){
						if($yt_common.GetQueryString('approveWorkPerson') == "message"){
							window.close();
						}else{
							window.history.back();
						}
					}else{
						//提交设置负责人
						var userList = "";
						var userListArr = [];
						var array = [];
						$(".set-principal-alert .set-principal-alert-select").each(function(i, n) {
							types = $(n).find("select.types option:selected").attr("types");
							if(types==undefined){
								types =  $(n).find("select.types option:selected").next().attr("types")
							}
							typesData = $(n).find("select.types option:selected").val();
							var arrUserList = {
								types: types,
								typesData: typesData,
							}
							userListArr.push(arrUserList);
						});
						var userList = JSON.stringify(userListArr);
						$.ajax({
							type: "post", //ajax访问方式 默认 "post"  
							url: $yt_option.base_path + "project/updateProjectPrincipal", //ajax访问路径  
							data: {
								projectCode: data.data,
								userList: userList
							}, //ajax查询访问参数
							beforeSend:function(){
								$yt_baseElement.showLoading();
							},
							async:false,
							success: function(data) {
								if(data.flag == 0) {
									$yt_baseElement.hideLoading();
									$(".set-principal-alert").hide();
									if($yt_common.GetQueryString('approveWorkPerson') == "message"){
										window.close();
									}else{
										window.history.back();
									}
								} else {
									$yt_baseElement.hideLoading();
									$yt_alert_Model.prompt("操作失败");
									$(".set-principal-alert").hide();
								}
							}
						});
					
					}
				}else{
					$yt_baseElement.hideLoading();
					$yt_alert_Model.prompt('审批失败')
				}
			},error:function(){
					$yt_baseElement.hideLoading();
					$yt_alert_Model.prompt('网络异常，审批失败')
			}
		});
	},
	//项目审批流程
	getApproveInf: function() {
		var me = this;
		$yt_baseElement.showLoading();
		var pkId = $yt_common.GetQueryString('pkId');
		var approve = $yt_common.GetQueryString('approve');
		var data = {
			data:''
		}
		data.data = me.getBeanById;
		if(data.data != null) {
			if(data.data.projectType == 2&&data.data.dataSrc==1) { 
				//项目类型为委托
				$('.hid-process-instance-id').val(data.data.processInstanceId);
				if(data.data.flowLog == "" || data.data.flowLog == null) {} else {
					$('.hid-title').show();
					$('.hid-approva-box').show();
						var flowLog = JSON.parse(data.data.flowLog);
						var middleStepHtml;
						var length = flowLog.length;
						$.each(flowLog, function(i, v) {
							//如果i等于0是最后一步流程数据
							if(i == 0) {
//										if(flowLog.length > 2 && flowLog[1].deleteReason == "returnedSubmit") { //该申请被退回，不显示审批步骤
//											//隐藏页面审批步骤
//											$('.last-step-project-div').hide();
//											//隐藏审批流程的确定取消按钮
//											$('.project-appro-btn-box').hide();
//										}
								if(v.tastKey == "activitiEndTask" && v.deleteReason != "") {//满足条件，审批流程已经结束
									//隐藏审批的确定取消按钮
									$('.project-appro-btn-box').hide();
								}
								if(v.userCode != $('.hid-user-real-name').val()) {
									$('.last-step-project-div').hide();
									$('.project-appro-btn-box').hide();
								}else{
									$('.last-step-project-div').show();
									$('.project-appro-btn-box').show();
								}
								if(approve == 1) { //如果值为1标识是从审批记录或项目列表跳转过来的,只显示审批流程记录不显示审批步骤
									$('.project-appro-btn-box').hide();
									//隐藏审批步骤
									$('.last-step-project-div').hide();
									var order = length - i;
									middleStepHtml = '<div>' +
										'<div style="height: 150; ">' +
										'<div class="number-name-box">' +
										'<span class="number-box-span middle-step-order middle-a-index" >' + order + '</span>' +
										'<span class="name-box-span middle-step-userName middle-a-index" >' + v.userName + '</span>' +
										'<img src="../../resources/images/open/openFlow.png" class="order-img" />' +
										'</div>' +
										'</div>' +
										'<div class="middle-step-box-div">' +
										'<ul class="middle-step-box-ul">' +
										'<li style="height: 30px;">' +
										'<span  class="middle-step-taskName view-taskName-span"  style="float: left;">' + v.operationState + '</span>' +
										'</li>' +
										'<li class="view-time-li middle-step-commentTime" >' + v.commentTime + '</li>' +
										'<li class="operate-view-box-li">' +
										'<div class="operate-view-title-li">操作意见：</div>' +
										'<div class="operate-view-text-li middle-step-comment" style="padding-left:10px;">' + v.comment + '</div>' +
										'</li>' +
										'</ul>' +
										'</div>' +
										'</div>';
									$('.last-step-add-project').append(middleStepHtml);
								} else { //否则是从审批列表跳转过来的
									
									if((v.tastKey == "activitiEndTask" && v.deleteReason == "")) { //到最后一步审批
										//隐藏下一步操作人下拉框
										$('.next-operate-person-tr').hide();
										$('.hid-tast-key').val(v.tastKey);
										//流程编号
										$('.last-step-order').text(length);
										//操作人名
										$('.last-step-operate-person-userName').text(v.userName);
										//操作状态
										$('.last-step-operationState').text(v.operationState);
										//停滞时间							
										$('.last-step-commentTime').text(v.commentTime);
									} else {
										$('.hid-tast-key').val(v.tastKey);
										//流程编号
										$('.last-step-order').text(length);
										//操作人名
										$('.last-step-operate-person-userName').text(v.userName);
										//操作状态
										$('.last-step-operationState').text(v.operationState);
										//停滞时间							
										$('.last-step-commentTime').text(v.commentTime);
									};
									
									
									if(v.tastKey == "activitiEndTask" && v.deleteReason != "") { //标志审批结束
										//隐藏审批步骤
										$('.last-step-project-div').hide();
										//流程序号
										var order = length - i;
										middleStepHtml = '<div>' +
											'<div style="height: 150; ">' +
											'<div class="number-name-box">' +
											'<span class="number-box-span middle-step-order middle-a-index" >' + order + '</span>' +
											'<span class="name-box-span middle-step-userName middle-a-index" >' + v.userName + '</span>' +
											'<img src="../../resources/images/open/openFlow.png" class="order-img" />' +
											'</div>' +
											'</div>' +
											'<div class="middle-step-box-div">' +
											'<ul class="middle-step-box-ul">' +
											'<li style="height: 30px;">' +
											'<span  class="middle-step-taskName view-taskName-span"  style="float: left;">' + v.operationState + '</span>' +
											'</li>' +
											'<li class="view-time-li middle-step-commentTime" >' + v.commentTime + '</li>' +
											'<li class="operate-view-box-li">' +
											'<div class="operate-view-title-li">操作意见：</div>' +
											'<div class="operate-view-text-li middle-step-comment" style="padding-left:10px;">' + v.comment + '</div>' +
											'</li>' +
											'</ul>' +
											'</div>' +
											'</div>';
										$('.last-step-add-project').append(middleStepHtml);
									}
								}
							};
							//如果i等于length-1是流程的第一步
							if(i == length - 1) {
								//流程编号
								$('.first-step-order').text(1);
								//操作人名
								$('.first-step-operate-person-userName').text(v.userName);
								//当前审批节点名字
								$('.first-step-taskName').text(v.operationState);
								//时间
								$('.first-step-commentTime').text(v.commentTime);
								$('.first-step-comment').text(v.comment);
							};

							//如果i不等于且不等于length-1，是流程的中间步骤
							if(i != 0 && i < length - 1) {
								//流程序号
								var order = length - i;
								middleStepHtml = '<div>' +
									'<div style="height: 150; ">' +
									'<div class="number-name-box">' +
									'<span class="number-box-span middle-step-order middle-a-index" >' + order + '</span>' +
									'<span class="name-box-span middle-step-userName middle-a-index" >' + v.userName + '</span>' +
									'<img src="../../resources/images/open/openFlow.png" class="order-img" />' +
									'</div>' +
									'</div>' +
									'<div class="middle-step-box-div">' +
									'<ul class="middle-step-box-ul">' +
									'<li style="height: 30px;">' +
									'<span  class="middle-step-taskName view-taskName-span"  style="float: left;">' + v.operationState + '</span>' +
									'</li>' +
									'<li class="view-time-li middle-step-commentTime" >' + v.commentTime + '</li>' +
									'<li class="operate-view-box-li">' +
									'<div class="operate-view-title-li">操作意见：</div>' +
									'<div class="operate-view-text-li middle-step-comment" style="padding-left:10px;">' + v.comment + '</div>' +
									'</li>' +
									'</ul>' +
									'</div>' +
									'</div>';
								$('.last-step-add-project').append(middleStepHtml);
							}
						});
						$yt_baseElement.hideLoading();
				}
			} else { //项目类型不是委托的没有审批流程
				//隐藏审批
				$('.hid-title').hide();
				$('.hid-approva-box').hide();
				$('.project-appro-btn-box').hide();
			}
		}
		//项目审批下一步操作人
		var nextPersonList = projectDetailsList.getworkFlowOperateTeach('project');
		if(nextPersonList != null) {
			$("#nextPeople").empty();
			$.each(nextPersonList, function(i, n) {
				$("#nextPeople").append('<option value="' + n.userCode + '">' + n.userName + '</option>');
			});
		};
		$("#nextPeople").niceSelect();
	},
	//查询洽谈记录详细信息
	getDiscussInf: function() {
		$yt_baseElement.showLoading();
		var pkId = $yt_common.GetQueryString('pkId');
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "project/getDiscuss", //ajax访问路径  
			data: {
				pkId: pkId
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					var htmlDiscuss = $(".discuss-box");
					var htmlIndex = "";
					var num = 1;
					$(htmlDiscuss).empty();
					if(data.data.length > 0) {
						$.each(data.data, function(i, v) {
							var createUsername = "";
							var details = "";
							var discuinfo='';
							//编辑删除按钮
							var deleEdit = "";
							var ideaJsonArr = JSON.parse(v.ideaJson);
							if(i == data.data.length - 1) { //是最后一条，显示编辑和删除按钮
								deleEdit = 
								'<p class="discuss-editor" style="font-size:15px;color:#4d4d4d;display: inline-block;cursor: pointer;">'+
									'<img style="vertical-align: middle;margin-right:5px;" class="bulletin-update" src="../../resources/images/icons/amend.png">编辑'+
								'</p>'+
								'<p class="discuss-del" style="font-size:15px;color:#4d4d4d;display: inline-block;margin-left: 15px;cursor: pointer;">'+
									'<img style="vertical-align: middle;margin-right:5px;" class="ioc-img" src="../../resources/images/open/delete.png">'+
									'<input type="hidden" value="' + v.discussId + '" class="discussId">删除'+
								'</p>';
//								'<button class="yt-option-btn discuss-editor">编辑</button>' +
//								'<button class="yt-option-btn discuss-del"><input type="hidden" value="' + v.discussId + '" class="discussId">删除</button>';
							}
							if(ideaJsonArr.length > 0) { //有审核意见，显示审核意见详情框，
								$.each(ideaJsonArr, function(x,y) {
									//洽谈审核意见详情
								discuinfo += '<table style="width:100%;box-shadow: 0px 2px 1px #DDD;margin-bottom:10px;">' +
									'<tr>' +
									'<td colspan="2" style="height:30px;padding-bottom: 15px;">' +
									'<p style="width:82px;height:30px;line-height:30px;text-align:center; background: #5B66AB url(../../resources/images/icons/left-top.png) no-repeat;color:#FFF;color:#FFF;">审核意见</p>' +
									'</td>' +
									'</tr>' +
									'<tr>' +
									'<td style="height:35px;width:100px;text-align:right;line-heigth:35px;">审核人：</td>' +
									'<td class="create-username" style="text-align:left;">' + y.createUsername + '<span style="margin-left:100px ;">' + y.createTimeString + '</span></td>' +
									'</tr>' +
									'<tr>' +
									'<td valign="top" style="width:100px;text-align:right;">审核意见：</td>' +
									'<td >' +
									'<p class="details-p" style="min-height:50px;">' + y.details + '</p>' +
									'</td>' +
									'</tr>' +
									'</table>';
								});
							}; 
							var myhistory = $yt_common.GetQueryString("history");
							var roleIds = ','+$yt_common.user_info.roleIds+',';
							var userRealName = $yt_common.user_info.userRealName;
							var bool = true;
							//130部门领导  131科室领导   作废
							//只有部门领导和科室领导 作废  能填写审批意见---且只有从已立项项目列表跳转与未立项项目列表跳转
							/*
							 * 315 计划科负责人 311 教务部负责人   302 院领导
							 */
							if(myhistory=="trainingProgramsList"||myhistory=="noSetProjectList"){
								if(roleIds.indexOf(',315,')!=-1||roleIds.indexOf(',311,')!=-1||roleIds.indexOf(',302,')!=-1){
									$.each(ideaJsonArr, function(x,y) {
										userRealName==y.createUsername?bool=false:bool=bool;
									})
									if(bool){
										discuinfo += '<table style="width:100%;">' +
										'<tr>' +
										'<td colspan="2" style="height:30px;padding-bottom: 15px;">' +
										'<p style="width:82px;height:30px;line-height:30px;text-align:center; background: #5B66AB url(../../resources/images/icons/left-top.png) no-repeat;color:#FFF;color:#FFF;">审核意见</p>' +
										'</td>' +
										'</tr>' +
										'<tr>' +
										'<td valign="top" style="width:85px;text-align:right;">审核意见：</td>' +
										'<td >' +
										'<textarea class="apprro-view" style="min-height: 50px; width: 860px;resize:none;"></textarea>' +
										'</td>' +
										'</tr>' +
										'</table>' +
										'<div class="yt-eidt-model-bottom" style="text-align: center;margin: 10px 0px;">' +
										'<input class="hid-discuss-id" type="hidden" value="' + v.discussId + '" />' +
										'<input class="yt-model-bot-btn yt-model-sure-btn talk-over-with-submit" type="button" value="提交" />' +
										'<input class="yt-model-bot-btn yt-model-canel-btn talk-over-with-cancel" type="button" value="取消" style="margin-left: 20px;" />' +
										'</div>';
									}
								}
							}
							var discussStates = "";
							if(v.discussStates == 1) {
								discussStates = "咨询";
							} else if(v.discussStates == 2) {
								discussStates = "在谈";
							} else if(v.discussStates == 3) {
								discussStates = "意向";
							} else if(v.discussStates == 4) {
								discussStates = "方案";
							} else if(v.discussStates == 5) {
								discussStates = "调整";
							} else if(v.discussStates == 6) {
								discussStates = "签约";
							} else if(v.discussStates == 7) {
								discussStates = "咨询";
							} else {
								discussStates = "取消";
							}
							htmlIndex = '<div class="class-info-centent discuss-index" style="margin:0px 0px 0px 5px;">' +
									'<div class="class-info-title" style="margin-bottom: 15px;">' +
										'<div class="discuss-info-div">' +
											'<p class="steps-num"><span style="color:#de595a;">' + num++ + '</span></p>' +
											'<div class="class-info-name" style="color:#de595a;border:none;">' +
												'<img class="discuss-steps" src="../../resources/images/icons/discuss-steps-red.png">' +
												'<span style="display: inline-block;margin-bottom: 0px;">洽谈详情</span>'+
												'<div class="discuss-btn">' + deleEdit + '</div>' +
											'</div>' +
										'</div>' +
									'</div>' +
								'<div style="background:#FFF;padding:1px 0px 10px 0px;margin-bottom:10px;">' +
									'<table class="class-info-table" style="margin:20px auto;">' +
										'<tr>' +
										'<td>' +
										'<span>洽谈状态：</span>' +
										'</td>' +
										'<td >' +
										'<p class="discuss-states" data-val="discussStates" style="width: 120px;">' + discussStates + '</p>' +
										'</td>' +
										'<td >' +
										'<span>洽谈日期：</span>' +
										'</td>' +
										'<td >' +
										//日期p标签去掉了discuss-date类名
										'<p class="discussDate" data-val="discussDate" style="width: 120px;">' + v.discussDate + '</p>' +
										'</td>' +
										'<td >' +
										'<span>联系人：</span>' +
										'</td>' +
										'<td>' +
										'<p class="linkman" data-val="linkman" style="width: 120px;">' + v.linkman + '</p>' +
										'</td>' +
										'<td >' +
										'<span>联系电话：</span>' +
										'</td>' +
										'<td >' +
										'<p class="phone" data-val="phone" style="width: 120px;">' + v.phone + '</p>' +
										'</td>' +
										'</tr>' +
										'<tr>' +
										'<td >' +
										'<span>洽谈内容：</span>' +
										'</td>' +
										'<td colspan="7" >' +
										'<p class="discussDetails" data-val="discussDetails" style="width:720px;height: auto;word-break: break-all;word-wrap: break-word">' + v.discussDetails + '</p>' +
										'</td>' +
										'</tr>' +
									'</table>' +
									'<div style="border:1px solid #DDD;margin: 10px 70px;box-shadow: 0px 1px 1px #DDD;">'+
										'<p style="width:82px;height:30px;line-height:30px;text-align:center; background: #5B66AB url(../../resources/images/icons/left-top.png) no-repeat;color:#FFF;">报价情况</p>'+
										'<table style="width: 100%;margin: 15px;">'+
											'<tbody>'+
												'<tr>'+
													'<td style="text-align:right;width:70px;">培训费：</td>'+
													'<td class="train-cost" data-val="trainCost">' + v.trainCost + '</td>'+
													'<td style="text-align:right;">课程费：</td>'+
													'<td class="course-cost" data-val="courseCost">' + v.courseCost + '</td>'+
													'<td style="text-align:right;">住宿费：</td>'+
													'<td class="stay-cost" data-val="stayCost">' + v.stayCost + '</td>'+
													'<td style="text-align:right;">餐费：</td>'+
													'<td class="meal-cost" data-val="mealCost">' + v.mealCost + '</td>'+
													'<td style="text-align:right;">其他费用：</td>'+
													'<td class="other-cost" data-val="otherCost" style="width: 190px;">' + v.otherCost + '</td>'+
												'</tr>'+
											'</tbody>'+
										'</table>'+
									'</div>'+
								'<div class="discuss-bottom" style="margin:10px 70px;border:1px solid #ECECEC;">' + discuinfo + '</div>' +
								'</div>';
								'</div>';
							htmlDiscuss.append($(htmlIndex).data("discussData", v));
						});
					}
					$yt_baseElement.hideLoading();
				} else {
					$yt_alert_Model.prompt("获取失败");
					$yt_baseElement.hideLoading();
				}
				//洽谈记录，只有项目销售和项目主任，在“我的项目”菜单中进入后才能新增和编辑操作。
				var myhistory = $yt_common.GetQueryString("history");
				//登录人名
				var userRealName = $('.hid-user-real-name').val();
				//项目销售人名
				var projectSellName = $('.hid-project-sell-name').val();
				//项目主任名
				var projectHead = $('.hid-project-head-name').val();
				projectHead = projectHead.split(',');
				//只有项目主任、项目销售能操作洽谈记录
				if(myhistory=="myProjectList"&&userRealName==projectSellName||myhistory=="myProjectList"&&projectHead.indexOf(userRealName)!=-1){
				}else{
					$('.discuss-btn').hide();
					$('.add-discuss').hide();
				}
			}
		});
	},
	//新增洽谈项目
	addDiscussList: function(discussId) {

		var projectId = $yt_common.GetQueryString('pkId');
		var discussStates = $(".alert-add-discuss .discuss-states").val();
		var discussDate = $(".alert-add-discuss .discuss-date").val();
		var linkman = $(".alert-add-discuss .linkman").val();
		var phone = $(".alert-add-discuss .phone").val();
		var discussDetails = $(".alert-add-discuss .discussDetails").val();
		var trainCost = $(".alert-add-discuss .train-cost").val();
		var courseCost = $(".alert-add-discuss .course-cost").val();
		var stayCost = $(".alert-add-discuss .stay-cost").val();
		var mealCost = $(".alert-add-discuss .meal-cost").val();
		var otherCost = $(".alert-add-discuss .other-cost").val();
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "project/addOrUpdateDiscuss", //ajax访问路径  
			data: {
				projectId: projectId,
				discussId: discussId,
				discussStates: discussStates,
				discussDate: discussDate,
				linkman: linkman,
				phone: phone,
				discussDetails: discussDetails,
				trainCost: trainCost,
				courseCost: courseCost,
				stayCost: stayCost,
				mealCost: mealCost,
				otherCost: otherCost

			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					if(discussId == "") {
						$yt_alert_Model.prompt("新增成功");
						projectDetailsList.getDiscussInf();
					} else {
						$yt_alert_Model.prompt("修改成功");
						projectDetailsList.getDiscussInf();
					}

					$(".yt-edit-alert").hide();
				} else {
					if(discussId == "") {
						$yt_alert_Model.prompt("新增失败");
						projectDetailsList.getDiscussInf();
					} else {
						$yt_alert_Model.prompt("修改失败");
						projectDetailsList.getDiscussInf();
					}
				}
			}
		});
	},

	//删除洽谈记录
	delDiscussList: function(discussId) {
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
					url: $yt_option.base_path + "project/deleteDiscuss",
					data: {
						discussId: discussId
					},
					success: function(data) {
						if(data.flag == 0) {
							//洽谈记录编辑删除父标签
							var deleEditDiv = $('.discuss-box').children("div:last-child").find('.discuss-btn');
							//编辑删除按钮
							deleEdit = '<button class="yt-option-btn discuss-editor">编辑</button>' +
								'<button class="yt-option-btn discuss-del"><input type="hidden" value="' + discussId + '" class="discussId">删除</button>';
							//把编辑删除按钮添加到最后一条洽谈记录；
							deleEditDiv.append(deleEdit);
							$yt_alert_Model.prompt("删除成功");
							projectDetailsList.getDiscussInf();
						} else {
							$yt_alert_Model.prompt("不能删除");
						}

					}

				});

			}
		});
	},
	//洽谈记录弹出框  
	discussAdd: function() {
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$(".lawyer-opinion-box").show();
		/** 
		 * 调用算取div显示位置方法 
		 */
		$yt_alert_Model.getDivPosition($(".lawyer-opinion-box"));
		$yt_alert_Model.setFiexBoxHeight($(".alert-add-discuss form"));
		/* 
		 * 调用支持拖拽的方法 
		 */
		$yt_model_drag.modelDragEvent($(".lawyer-opinion-box .yt-edit-alert-title"));
		/** 
		 * 点击取消方法 
		 */
		$('.lawyer-opinion-box .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
			//隐藏页面中自定义的表单内容  
			$(".lawyer-opinion-box").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
	},
	//学员管理列表
	getStudentAdminList: function() {
		var selectParam = $(".selectParam").val();
		var projectCode = $yt_common.GetQueryString('projectCode');
		var sort = "";
		var orderType = "";
		if ($(".click-type").val() == "1") {//集团排序
			sort = "groupName";
			orderType = $(".group-order-type").val();
		}else if($(".click-type").val() == "2"){
			sort = "orgName";
			orderType = $(".org-order-type").val();
		}else{
		}
		$yt_baseElement.showLoading();
		$('.student-admin-page').pageInfo({
			async: false,
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "class/trainee/getClassTraineeManager", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post" 
			data: {
				projectCode: projectCode,
				selectParam: selectParam,
				gender: "",
				nationId: "",
				sort: sort,
				orderType: orderType
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.student-admin-tbody');
					var htmlTr = '';
					var num = 1;
					$(htmlTbody).empty();
					if(data.data.rows.length > 0) {
						$.each(data.data.rows, function(i, v) {
							if(v.gender == 1) {
								v.gender = "男"
							} else if(v.gender == 2) {
								v.gender = "女"
							}
							if(v.checkInState == 0) {
								v.checkInState = "未报到"
							} else if(v.checkInState == 1) {
								v.checkInState = "已报到"
							}
							if(v.reconciliationState == 0) {
								v.reconciliationState = "未入账"
							} else if(v.reconciliationState == 1) {
								v.reconciliationState = "已入账"
							}
							if(v.invoiceState == 0) {
								v.invoiceState = "未开票"
							} else if(v.invoiceState == 1) {
								v.invoiceState = "已开票"
							}
							if(v.deptPosition=="/"){
								v.deptPosition="";
							}
							if(v.isImportant==1){
								htmlTr = '<tr class="is-important" isImportant="'+v.isImportant+'">';
							}else{
								htmlTr = '<tr isImportant="">';
							}
							if(v.deptPosition==null){
								 v.deptPosition="";
							}
							htmlTr +='<td style="position: relative;"><p style="width: 30px;height: 30px;position: absolute;top: 10px;z-index:100;opacity:0;"></p>' + '<label class="check-label yt-checkbox select-elementary-checkbox" style="margin-left:8px;"><input type="checkbox" name="test" class="student-admin-pkId" value="' + v.pkId + '"/></label>' + '</td>' +
									'<td style="text-align:center;"><input type="hidden" class="trainee-id" value="' + v.traineeId + '"/>' + num++ + '</td>' +
									'<td><input type="hidden" class="project-code" value="' + v.projectCode + '"/><a style="color: #3c4687;" href="#" class="real-name-alert-details">' + v.realName + '</a></td>' +
									'<td style="text-align:center;">' + v.gender + '</td>' +
									'<td style="text-align:center;">' + v.nationName + '</td>' +
									'<td style="text-align:center;">' + v.phone + '</td>' +
									'<td>' + v.groupName + '</td>' +
									'<td>' + v.groupOrgName + '</td>' +
									'<td>' + v.deptPosition + '</td>' +
									'<td>' + v.invoiceType + '</td>' +
									'<td style="text-align:center;">' + v.checkInState + '</td>' +
									'<td style="text-align:center;">' + v.reconciliationState + '</td>' +
									'<td style="text-align:center;">' + v.invoiceState + '</td>' +
									'</tr>';
							$(".student-admin-page").show();
							htmlTbody.append($(htmlTr).data("legalData", v));
						});
					} else {
						$(".student-admin-page").hide();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="13" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						htmlTbody.html(htmlTr);
					}
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}

			}
		});
	},
	//学员管理新增
	addStudentList: function() {
		$yt_baseElement.showLoading();
		var projectCode = $yt_common.GetQueryString('projectCode');
		var realName = $(".add-student .real-name").val();
		var gender = $(".add-student").find('input[type="radio"]:checked').val();
		var nationId = $(".add-student .nation-id").val();
		var phone = $(".add-student .phone").val();
		var idType = $(".add-student .id-type").val();
		var idNumber = $(".add-student .id-number").val();
		var dateBirth = $(".add-student .date-birth").val();
		var groupId = $(".add-student .group-id-elementary").val();
		var orgId = $(".add-student .org-id").val();
		var orgType = $(".add-student .org-type").val();
		var deptName = $(".add-student .dept-name").val();
		var positionName = $(".add-student .position-name").val();
		var mailingAddress = $(".add-student .mailing-address").val();
		var postalCode = $(".add-student .postal-code").val();
		var telephone = $(".add-student .telephone").val();
		var fax = $(".add-student .fax").val();
		var email = $(".add-student .email").val();
		var partyDate = $(".add-student .party-date").val();
		var workTime = $(".add-student .work-time").val();
		var educationTime = $(".add-student .education-time").val();
		var educationTimeClass = $(".add-student .education-time-class").val();
		var serviceTime = $(".add-student .service-time").val();
		var serviceTimeClass = $(".add-student .service-time-class").val();
		var linkman = $(".add-student .linkman").val();
		var linkmanPhone = $(".add-student .linkman-phone").val();
		var linkmanTelephone = $(".add-student .linkman-telephone").val();
		var linkmanFax = $(".add-student .linkman-fax").val();
		var linkmanEmail = $(".add-student .linkman-email").val();
		var linkmanAddressEmail = $(".add-student .linkman-address-email").val();
		
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "class/trainee/addOrUpdateTrainee", //ajax访问路径  
			data: {
				traineeId: "",
				projectCode: projectCode,
				realName: realName,
				gender: gender,
				nationId: nationId,
				phone: phone,
				idType: idType,
				idNumber: idNumber,
				dateBirth: dateBirth,
				groupId: groupId,
				orgId: orgId,
				orgType: orgType,
				deptName: deptName,
				mailingAddress: mailingAddress,
				postalCode: postalCode,
				telephone: telephone,
				fax: fax,
				email: email,
				partyDate: partyDate,
				workTime: workTime,
				educationTime: educationTime,
				educationTimeClass: educationTimeClass,
				serviceTime: serviceTime,
				serviceTimeClass: serviceTimeClass,
				linkman: linkman,
				linkmanPhone: linkmanPhone,
				linkmanTelephone: linkmanTelephone,
				linkmanFax: linkmanFax,
				linkmanEmail: linkmanEmail,
				linkmanAddressEmail: linkmanAddressEmail,
				traineeId: "",
				groupNum: "",
				positionName: positionName,
				invoiceType: "",
				taxNumber: "",
				address: "",
				registeredBank: "",
				account: "",
				telephoneProject: "",
				orgName: "",
				traineeRemarks:''

			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt("新增成功");
					$('.student-admin-page').pageInfo("refresh");
					$(".yt-edit-alert").hide();
					$yt_baseElement.hideLoading();
				}else if(data.flag==5||data.flag==4){
					$yt_alert_Model.prompt(data.message);
					$(".yt-edit-alert").hide();
				}
				else {
					$yt_alert_Model.prompt("新增失败");
					$yt_baseElement.hideLoading();
				}
			}
		});
	},
	//获取一条数据
	oldStudentData:{},
	/**
	 * 集团、单位下拉框初始化数据
	 */
	companyData:function(){
			//获取集团名称
			$('.group-id-elementary-name').off('click').click(function(){
				$('.add-student').hide();
				projectDetailsList.getGroupAlertList($(this),$(this).siblings('.group-id-elementary'),sureBack,canelBcak);
				function sureBack(){
					$('.add-student').show();
					if($('.group-id-elementary-name').val() != '') {
						$('.group-id-elementary-name').removeClass('valid-hint');
						$('.group-id-elementary-name').siblings('.valid-font').text('');
					}
					var groupList = projectDetailsList.getListSelectGroup1("3", $('.group-id-elementary').val());
					if(groupList != null) {
						$("select.org-id").empty();
						$("select.org-id").append('<option value="">请选择</option>')
						$.each(groupList, function(i, n) {
							$("select.org-id").append('<option value="' + n.groupId + '">' + n.groupName + '</option>').data('types', n.types)
							//$('.orgType').text('');
						});
						$("select.org-id").niceSelect({  
					        search: true,  
					        backFunction: function(text) {  
					            //回调方法,可以执行模糊查询,也可自行添加操作  
					            $("select.org-id option").remove();  
					            if(text == "") {  
					                $("select.org-id").append('<option value="">请选择</option>');  
					            }  
					            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
					            $.each(groupList, function(i, n) {  
					                if(n.groupName.indexOf(text) != -1) {  
					                    $("select.org-id").append('<option value="' + n.groupId + '">' + n.groupName + '</option>').data('types', n.types);  
					                }  
					            });  
					        }  
					    });
					    $("select.org-id").off().change(function() {
							if($(this).val() != '') {
								$("div.org-id").removeClass('valid-hint');
								$(this).siblings('.valid-font').text('');
							}
							$('.orgType').text($(this).data('types'));
						});
					}
				
				}
				function canelBcak(){
					$('.add-student').show();
				}
			})
//			var groupOnlyList = projectDetailsList.getListSelectGroup1("1");
//			if(groupOnlyList != null) {
//				$("select.group-id-elementary").empty();
//				$("select.group-id-elementary").append('<option value="">请选择</option>');
//			$.each(groupOnlyList, function(i, n) {
//				$("select.group-id-elementary").append('<option value="' + n.groupId + '">' + n.groupName + '</option>');
//			});
//		}
//			$("select.group-id-elementary").niceSelect({  
//	        search: true,  
//	        backFunction: function(text) {  
//	            //回调方法,可以执行模糊查询,也可自行添加操作  
//	            $("select.group-id-elementary option").remove();  
//	            if(text == "") {  
//	                $("select.group-id-elementary").append('<option value="">请选择</option>');  
//	            }  
//	            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
//	            $.each(groupOnlyList, function(i, n) {  
//	                if(n.groupName.indexOf(text) != -1) {  
//	                    $("select.group-id-elementary").append('<option value="' + n.groupId + '">' + n.groupName + '</option>');  
//	                }  
//	            });  
//	        }  
//	    });
	},
	/**
	 * 清除楚弹框数据
	 */
	clearFormData:function(){
		$(".add-student .real-name").val("");
		$(".add-student label input[value='1']").setRadioState("check");
		$(".add-student .nation-id").setSelectVal("59");
		$(".add-student .id-type").setSelectVal("");
		$(".add-student .group-id-elementary").val("");
		$(".add-student .group-id-elementary-name").val("");
		$(".add-student .org-id").empty();
		$(".add-student .org-id").append('<option value="">请选择</option>');
		$(".add-student .org-id").niceSelect();
		$(".add-student .phone").val("");
		$(".add-student .id-number").val("");
		$(".add-student .date-birth").val("");
		$(".add-student .orgType").text("");
		$(".add-student .dept-name").val("");
		$(".add-student .position-name").val("");
		$(".add-student .mailing-address").val("");
		$(".add-student .postal-code").val("");
		$(".add-student .telephone").val("");
		$(".add-student .fax").val("");
		$(".add-student .email").val("");
		$(".add-student .party-date").val("");
		$(".add-student .work-time").val("");
		$(".add-student .education-time").val("");
		$(".add-student .education-time-class").val("");
		$(".add-student .service-time").val("");
		$(".add-student .service-time-class").val("");
		$(".add-student .linkman").val("");
		$(".add-student .linkman-phone").val("");
		$(".add-student .linkman-telephone").val("");
		$(".add-student .linkman-fax").val("");
		$(".add-student .linkman-email").val("");
		$(".add-student .linkman-address-email").val("");
	},
	getStudentInf: function(traineeId) {
//		/显示整体框架loading的方法
		$yt_baseElement.showLoading();
		var me = this ;
		
		var projectId = $yt_common.GetQueryString('pkId');
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "class/trainee/getTraineeDetails", //ajax访问路径  
			data: {
				traineeId: traineeId,
				projectId: projectId
			}, //ajax查询访问参数
			success: function(data) {
				//初始化单位下拉列表
				if(data.data.groupId!=''||data.data.groupId!=null){
					var groupList = projectDetailsList.getListSelectGroup1("3", data.data.groupId);
				}else{
					var groupList = [];
				}

				if(groupList != null) {
					$("select.org-id").empty();
					$("select.org-id").append('<option value="">请选择</option>')
					$.each(groupList, function(i, n) {
						$("select.org-id").append('<option value="' + n.groupId + '">' + n.groupName + '</option>').data('types', n.types)
						//$('.orgType').text('');
					});
					$("select.org-id").niceSelect({  
				        search: true,  
				        backFunction: function(text) {  
				            //回调方法,可以执行模糊查询,也可自行添加操作  
				            $("select.org-id option").remove();  
				            if(text == "") {  
				                $("select.org-id").append('<option value="">请选择</option>');  
				            }  
				            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
				            $.each(groupList, function(i, n) {  
				                if(n.groupName.indexOf(text) != -1) {  
				                    $("select.org-id").append('<option value="' + n.groupId + '">' + n.groupName + '</option>').data('types', n.types);  
				                }  
				            });  
				        }  
				    });
				    $("select.org-id").off().change(function() {
						if($(this).val() != '') {
							$("div.org-id").removeClass('valid-hint');
							$(this).siblings('.valid-font').text('');
						}
						$('.orgType').text($(this).data('types'));
					});
				}
				//修改弹出窗设置值
				$("select.project-code").setSelectVal(data.data.projectCode);
				$("select.nation-id").setSelectVal(data.data.nationId);
				$("select.id-type").setSelectVal(data.data.idType);
				$(".group-id-elementary").val(data.data.groupId);
				$(".group-id-elementary-name").val(data.data.groupName);
				$("select.org-id").setSelectVal(String(data.data.groupOrgId));
				$("select.org-type").setSelectVal(data.data.orgType);
				$('.orgType').text($("select.org-id").data('types'));
				if(data.data.gender == "1") {
					$(".add-student label input[value='"+data.data.gender+"']").setRadioState("check");
				} else if(data.data.gender == "2") {
					$(".add-student label input[value='"+data.data.gender+"']").setRadioState("check");
				};
				$(".add-student").setDatas(data.data);
				if(data.flag == 0) {
					if(data.data.workTime=="0000-00-00"){
						data.data.workTime="";
						$(".add-student .work-time").val("");
					}
					//详情
					$(".elementary-student-details").setDatas(data.data);
					if(groupList.length>0){
						$('.org-type').text(groupList[0].types);
					}
					//0:未报到  1:已报到
					if(data.data.checkInState == 0){
						data.data.checkInState = "未报到";
					}else{
						data.data.checkInState = "已报到";
					}
					$(".check-in-state").text(data.data.checkInState);
					//0:未缴费 1:已缴费
					if (data.data.paymentState == 0) {
						data.data.paymentState = "未对账";
					} else{
						data.data.paymentState = "已对账 	";
					}
					$(".payment-state").text(data.data.paymentState);
					//1:已开票 0:未开票
					if (data.data.isOrderNum == 0) {
						data.data.isOrderNum = "未开票";
					} else{
						data.data.isOrderNum = "已开票";
					};
					$(".is-order-num").text(data.data.isOrderNum);
					$(".order-num").text(data.data.orderNum);
					me.oldStudentData = data.data; 
					me.oldStudentData.gender == 1?me.oldStudentData.genderVal='男':me.oldStudentData.genderVal='女';
					me.oldStudentData.nationName = $('select.nation-id option:selected').text();
					me.oldStudentData.idTypeName = $('select#project-states option:selected').text();
					me.oldStudentData.groupName = $(".group-id-elementary-name").val();
					me.oldStudentData.orgTypeVal = $('.orgType').text();
					if($("span.gender").text() == "1") {
						$("span.gender").text("男");
					} else if($("span.gender").text() == "2") {
						$("span.gender").text("女");
					};
					//获取民族
					var nationsList = projectDetailsList.getListSelectNations();
					if(nationsList != null) {
						$.each(nationsList, function(i, n) {
							if($("span.nation-id").text() == n.nationId) {
								$("span.nation-id").text(n.nationName);
							}
						});
					};
					if($("span.id-type").text() == 1) {
						$("span.id-type").text("身份证");
					} else if($("span.id-type").text() == 2) {
						$("span.id-type").text("护照");
					} else if($("span.id-type").text() == 3) {
						$("span.id-type").text("军官证");
					} else if($("span.id-type").text() == 4) {
						$("span.id-type").text("其他")
					};
					//开票信息
					var recordList = data.data.orderList;
					var recordBody = $('.order-list-tbody').empty();
					var recordHtml = '';
					if(recordList!=""){
						$.each(recordList, function(i,v) {
							v.isOrderNum==1?v.isOrderNum='已开票':v.isOrderNum='未开票';
							recordHtml='<tr>'+
							'<td style="text-align: right;" width="80px">开票状态：</td>'+
							'<td style="text-align: left;" width="150px">'+v.isOrderNum+'</td>'+
							'<td class="order-num" style="text-align: right;" width="80px">发票号：</td>'+
							'<td style="text-align: left;" width="120px">'+v.orderNum+'</td>'+
							'<td class="order-money" style="text-align: right;" width="80px">开票金额：</td>'+
							'<td style="text-align: left;" width="120px">'+v.tuition+'</td>'+
							'<td width="80px"><div class="addorder addorder'+i+'" style="display:none;padding: 5px 10px;border: 1px dashed #E6E6E6;cursor: pointer;">合并开票</div></td>'
							'</tr>';
							recordBody.append(recordHtml);
							var trainees = "";
							if(v.trainees != undefined){
								trainees = v.trainees.split(',');
							}
							if(trainees.length>1){
								$('.addorder'+i).show().data('trainees',trainees.join('  '));
							}
							$('.addorder').tooltip({
							position: 'bottom',
							content: function() {
								var showBox = '<table class="tip-table">' +
									'<tr><td style="text-align:left">合并开票者：</td></tr><tr><td>' + $(this).data('trainees') + '</td></tr>' +
									'</table>';
								return showBox;
							},
							onShow: function() {
								$(this).tooltip('tip').css({
									backgroundColor: '#666',
									borderColor: '#666',
									color: '#fff'
								});
							}
						});
						});
					}else{
						recordHtml='<tr style="border:0px;background-color:#fff !important;" >' +
									'<td width="77px" align="right" style="border:0px;">开票状态：</td>' +
									'<td align="left" style="border:0px;">未开票</td>' +
									'</tr>';
						recordBody.append(recordHtml);
					}
					
					var trainList = data.data.trainList;
					var htmlTbody = $(".train-list-tbody");
					var htmlTr = "";
					$.each(trainList, function(i, v) {
						if(v.dataStates == 4 || v.dataStates == 6){
							v.projectCode = v.projectCode;
						}else{
							v.projectCode = "";
						}
						htmlTr += '<tr>' +
							'<td class="project-code" style="text-align:center"><span class="file-name" style="color:#3c4687;">' + v.projectCode + '</span></td>' +
							'<td style="padding:0px 5px;">' + v.projectName + '</td>' +
							'<td class="project-head" style="text-align:center">' + v.startDate + '</td>' +
							'<td class="certificate-no" style="text-align:center">' + v.projectHead + '</td>' +
							'<td class="start-date" style="text-align:center">' + v.certificateNo + '</td>' +
							'</tr>';
					})
					htmlTbody.html(htmlTr);
				} else {
					$yt_alert_Model.prompt("获取失败");
				}
				//隐藏整体框架loading的方法
				$yt_baseElement.hideLoading();
			}
		});
	},
	//选学学员查看详情弹出框
	elementaryStudentDetailsAlert: function() {
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$(".elementary-student-details").show();
		/** 
		 * 调用算取div显示位置方法 
		 */
		$yt_alert_Model.getDivPosition($(".elementary-student-details"));
		$yt_alert_Model.setFiexBoxHeight($(".elementary-student-details .alert-form"));
		/* 
		 * 调用支持拖拽的方法 
		 */
		$yt_model_drag.modelDragEvent($(".elementary-student-details .yt-edit-alert-title"));
		/** 
		 * 点击取消方法 
		 */
		$('.elementary-student-details .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
			//隐藏页面中自定义的表单内容  
			$(".elementary-student-details").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
	},
	//学员管理修改
	amendStudentList: function() {
		//console.log("新增");
		var me = this ;
		var afterJson = {
			 projectCode : $yt_common.GetQueryString('projectCode'),
			 traineeId : $(".yt-table-active .trainee-id").val(),
			 realName : $(".add-student .real-name").val(),
			 groupName:$('.group-id-elementary-name').val(),
			 groupOrgName:$('select.org-id option:selected').text(),
			 nationName:$('select.nation-id option:selected').text(),
			 idTypeName : $('select#project-states option:selected').text(),
			 gender : $(".add-student input[type='radio']:checked").val(),
			 nationId : $(".add-student .nation-id").val(),
			 phone : $(".add-student .phone").val(),
			 idType : $(".add-student .id-type").val(),
			 idNumber : $(".add-student .id-number").val(),
			 dateBirth : $(".add-student .date-birth").val(),
			 groupId : $(".add-student .group-id-elementary").val(),
			 orgId : $(".add-student .org-id").val(),
			 orgType : $(".add-student .org-type").val(),
			 orgTypeVal : $(".add-student .orgType").text(),
			 deptName : $(".add-student .dept-name").val(),
			 positionName : $(".add-student .position-name").val(),
			 mailingAddress : $(".add-student .mailing-address").val(),
			 postalCode : $(".add-student .postal-code").val(),
			 telephone : $(".add-student .telephone").val(),
			 fax : $(".add-student .fax").val(),
			 email : $(".add-student .email").val(),
			 partyDate : $(".add-student .party-date").val(),
			 workTime : $(".add-student .work-time").val(),
			 educationTime : $(".add-student .education-time").val(),
			 educationTimeClass : $(".add-student .education-time-class").val(),
			 serviceTime : $(".add-student .service-time").val(),
			 serviceTimeClass : $(".add-student .service-time-class").val(),
			 linkman : $(".add-student .linkman").val(),
			 linkmanPhone : $(".add-student .linkman-phone").val(),
			 linkmanTelephone : $(".add-student .linkman-telephone").val(),
			 linkmanFax : $(".add-student .linkman-fax").val(),
			 linkmanEmail : $(".add-student .linkman-email").val(),
			 linkmanAddressEmail : $(".add-student .linkman-address-email").val()
		}
		//名称
		var jsonName={
				projectName:"班级",
				realName:"姓名",
				groupNum:"组号",
				genderVal:"性别",
				phone:"手机号",
				nationName:"民族",
				idNumber:"证件号码",
				groupName:"集团",
				groupOrgName:"单位",
				deptName:"部门",
				positionName:"职务",
				invoiceType:"开发票类型",
				invoiceModel:"发票类型",
				orgName:"名称",
				taxNumber:"纳税人识别号",
				address:"地址",
				telephoneProject:"电话",
				registeredBank:"开户行",
				account:"账号",
				idTypeName:"证件类型",
				dateBirth:"出生年月",
				orgTypeVal:"单位类型",
				mailingAddress:"通信地址",
				postalCode:"邮政编码",
				fax:"传真",
				partyDate:"入党时间",
				educationTime:"全职教育",
				educationTimeClass:"全职教育-毕业院校及专业",
				serviceTime:"在职教育",
				serviceTimeClass:"在职教育-毕业院校及专业",
				linkman:"联系人-姓名",
				linkmanPhone:"联系人-手机号",
				linkmanTelephone:"联系人-电话",
				linkmanFax:"联系人-传真",
				linkmanEmail:"联系人-邮箱",
				linkmanAddressEmail:"联系人-单位地址(邮编)",
				telephone:"电话",
				email:"电子邮箱",
				workTime:"参加工作时间",
				traineeRemarks:'备注'
			}
			afterJson.gender == 1?afterJson.genderVal='男':afterJson.genderVal='女';
			operationContent = '修改操作：【'+me.oldStudentData.realName+'】，'+me.getLogInfo(jsonName,me.oldStudentData,afterJson);
			me.getLogInfo(jsonName,me.oldStudentData,afterJson)=='；'?operationContent='':operationContent=operationContent;
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "class/trainee/addOrUpdateTrainee", //ajax访问路径  
			data: {
				traineeId: afterJson.traineeId,
				projectCode: afterJson.projectCode,
				realName: afterJson.realName,
				gender: afterJson.gender,
				nationId: afterJson.nationId,
				phone: afterJson.phone,
				idType: afterJson.idType,
				idNumber: afterJson.idNumber,
				dateBirth: afterJson.dateBirth,
				groupId: afterJson.groupId,
				orgId: afterJson.orgId,
				orgType: afterJson.orgType,
				deptName: afterJson.deptName,
				positionName: afterJson.positionName,
				mailingAddress: afterJson.mailingAddress,
				postalCode: afterJson.postalCode,
				telephone: afterJson.telephone,
				fax: afterJson.fax,
				email: afterJson.email,
				partyDate: afterJson.partyDate,
				workTime: afterJson.workTime,
				educationTime: afterJson.educationTime,
				educationTimeClass: afterJson.educationTimeClass,
				serviceTime: afterJson.serviceTime,
				serviceTimeClass: afterJson.serviceTimeClass,
				linkman: afterJson.linkman,
				linkmanPhone: afterJson.linkmanPhone,
				linkmanTelephone: afterJson.linkmanTelephone,
				linkmanFax: afterJson.linkmanFax,
				linkmanEmail: afterJson.linkmanEmail,
				linkmanAddressEmail: afterJson.linkmanAddressEmail,
				groupNum: me.oldStudentData.groupNum,
				invoiceType: me.oldStudentData.invoiceType,
				taxNumber: me.oldStudentData.taxNumber,
				address: me.oldStudentData.address,
				registeredBank: me.oldStudentData.registeredBank,
				account: me.oldStudentData.account,
				telephoneProject: me.oldStudentData.telephoneProject,
				orgName: me.oldStudentData.orgName,
				operationContent:operationContent,
				traineeRemarks:me.oldStudentData.traineeRemarks
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt("修改成功");
					$('.student-admin-page').pageInfo("refresh");
					$(".yt-edit-alert").hide();
				}else if(data.flag == 5||data.flag == 4){
					$yt_alert_Model.prompt(data.message);
					$(".yt-edit-alert").hide();
				}
				else {
					$yt_alert_Model.prompt("修改失败");
				}
			}
		});
	},
	//学员管理新增学员弹出框
	studentAdd: function() {
		$(".add-student .valid-hint").removeClass('valid-hint');
		$(".add-student .valid-font").text('');
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$(".add-student").show();
		/** 
		 * 调用算取div显示位置方法 
		 */
		$yt_alert_Model.setFiexBoxHeight($(".add-student .alert-form"));
		$yt_alert_Model.getDivPosition($(".add-student"));
		/* 
		 * 调用支持拖拽的方法 
		 */
		$yt_model_drag.modelDragEvent($(".add-student .yt-edit-alert-title"));
		/** 
		 * 点击取消方法 
		 */
		$('.add-student .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
			//隐藏页面中自定义的表单内容  
			$(".add-student").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
	},
	//删除学员
	delStudentList: function() {
		var checkTr = $('.student-admin-tbody input[name="test"]:checked').parent().parent().parent();
		var projectCode = checkTr.find(".project-code").val();
		var traineeIds = "";
		$.each(checkTr.find(".trainee-id"), function(s,t) {
			if (s == 0) {
				traineeIds = $(t).val();
			}else{
				traineeIds += ','+$(t).val();
			}
		});
		var projectId = $yt_common.GetQueryString('pkId');
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
					url: $yt_option.base_path + "class/trainee/deleteTrainee",
					data: {
						projectCode: projectCode,
						traineeIds: traineeIds
					},
					success: function(data) {
						if(data.flag == 0) {
							$yt_alert_Model.prompt("删除成功");
							$('.student-admin-page').pageInfo("refresh");
						} else {
							$yt_alert_Model.prompt("不能删除");
						}

					}

				});

			}
		});
	},
	//管理学员日志
	studentLog: function() {
		projectDetailsList.getStuLogList();
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$(".student-log").show();
		/** 
		 * 调用算取div显示位置方法 
		 */
		$yt_alert_Model.setFiexBoxHeight($(".student-log .alert-form"));
		$yt_alert_Model.getDivPosition($(".student-log"));
		/* 
		 * 调用支持拖拽的方法 
		 */
		$yt_model_drag.modelDragEvent($(".student-log .yt-edit-alert-title"));
		/** 
		 * 点击取消方法 
		 */
		$('.student-log .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
			//隐藏页面中自定义的表单内容  
			$(".student-log").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
			$("#logKeyword").val("");
		});
		
	},
	getStuLogList:function(){
		//学员日志
		var projectId = $yt_common.GetQueryString('pkId');
		var checkTr = $('.student-admin-tbody input[name="test"]:checked').parent().parent().parent();
		var traineeIds = "";
		$.each(checkTr.find(".trainee-id"), function(s,t) {
			if (s == 0) {
				traineeIds = $(t).val();
			}else{
				traineeIds += ','+$(t).val();
			}
		});
		$yt_baseElement.showLoading();
		var selectParam = $("#logKeyword").val();
		$.ajax({
			url: $yt_option.base_path + "class/trainee/getTraineeLogs", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			async:false,
			data: {
				pageIndexs: 1,
				pageNum: 1000, //每页显示条数 
				projectId:projectId,
				traineeId:traineeIds,
				selectParam:selectParam
			}, //ajax查询访问参数
			success: function(data) {
				
				$(".log-list-tbody").empty();
				var logList = $(".log-list-tbody");
				var logtr;
				if(data.flag == 0){
					if(data.data.rows.length>0){
						$.each(data.data.rows,function(i,v){
							logtr =  '<tr>' +
										'<td style="padding:5px;height:40px">' + v.operationTime + '</td>' +
										'<td style="padding:5px;height:40px">' + v.operationUser + '</td>' +
										'<td style="padding:5px;height:40px">' + v.operationContent + '</td>' +
									'</tr>';
									logList.append(logtr);
						});
					}else{
						logtr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="3" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
							logList.append(logtr);
					}
					$yt_baseElement.hideLoading();
				}else{
					$yt_baseElement.hideLoading(function (){
						$yt_alert_Model.prompt("查询失败");
					});
				}
			}
		});
	},
	//批量导入学员
	batchStudentLead: function() {
		var projectCode = $yt_common.GetQueryString('projectCode');
//		var fileName = $(".template-file").val();
//		var file = getFileName(fileName);
		var file = $('.lead-student .import-file-name').val();
		var addFile = 'fileName';
		function getFileName(o) {
			var pos = o.lastIndexOf("\\");
			return o.substring(pos + 1);
		}
		$.ajaxFileUpload({
			url: $yt_option.base_path + "class/trainee/leadingTraineeByClass", //ajax访问路径  
			type: "post",
			dataType: 'json',
			fileElementId:addFile,
			data: {
				projectCode: projectCode,
				file: file

			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt("导入成功");
					$('.student-admin-page').pageInfo("refresh");
					$(".yt-edit-alert").hide();
					projectDetailsList.getStudentAdminList();
					projectDetailsList.companyData();
				} else {
					$yt_alert_Model.prompt(data.message);
				}
			}
		});
	},
	
	//批量导入学员弹出框
	studentLead: function() {
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$(".lead-student").show();
		/** 
		 * 调用算取div显示位置方法
		 */
		$yt_alert_Model.setFiexBoxHeight($(".lead-student .alert-form"));
		$yt_alert_Model.getDivPosition($(".lead-student"));
		/* 
		 * 调用支持拖拽的方法 
		 */
		$yt_model_drag.modelDragEvent($(".lead-student .yt-edit-alert-title"));
		/** 
		 * 点击取消方法 
		 */
		$('.lead-student .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
			//隐藏页面中自定义的表单内容  
			$(".lead-student").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
	},
	//获取单位标准以及个人标准
	getUnitCostInf: function() {
		var me = this;
		$yt_baseElement.showLoading();
		var projectId = $yt_common.GetQueryString('pkId');
		//var pageType = $yt_common.GetQueryString('pageType');//标识该页面是由项目审批页面跳转过来的，收费标准页面不可修改
		$.ajax({
			url: $yt_option.base_path + "project/getProjectRates", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				projectId: projectId
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.charge-tbody1');
					$('.charge-tbody1').empty();
					var htmlTr = '';
					var num = 1;
					//单位标准
					var groupRatesArr = '';
					if(data.data.groupRates!=''){
						groupRatesArr = $.parseJSON(data.data.groupRates);
					}
					var traineeRates = '';
					if(data.data.traineeRates!=''){
						traineeRates =$.parseJSON(data.data.traineeRates);
					}
					var contractRates='';
					if(data.data.contractRates!=''){
						contractRates = $.parseJSON(data.data.contractRates);
					}
					me.traineeRatesOldData= traineeRates;
					if(traineeRates==''){
						traineeRates={
							"mealFeeNegotiatedPrice":'',
							"mealFeeRackRate":'',
							"projectId":'',
							"quarterageNegotiatedPrice":'',
							"quarterageRackRate":'',
							"traineeNegotiatedPrice":'',
							"traineeRackRate":'',
							"trainingExpenseNegotiatedPrice":'',
							"trainingExpenseRackRate":''
						}
					}
					$('.personal-standard').setDatas(traineeRates);
					$.each($('.personal-standard input'), function(j,k) {
						$(k).val($yt_baseElement.fmMoney($(k).val()))
					});
					if(groupRatesArr.length > 0) {
						$(".btn-charge-person button").attr('class','yt-option-btn btn-move-charge');
						$(".btn-charge-person button").text('编辑');
						$.each(groupRatesArr, function(i, v) {
							$('.yt-tab-active .group-select').setSelectVal(v.groupId);
							$('.invoice-inf .invoiceModel').val(v.invoiceModel);
							$('.invoice-inf .orgName').val(v.orgName);
							$('.invoice-inf .taxNumber').val(v.taxNumber);
							$('.invoice-inf .address').val(v.address);
							$('.invoice-inf .telephone').val(v.telephone);
							$('.invoice-inf .registeredBank').val(v.registeredBank);
							$('.invoice-inf .account').val(v.account);
							if(v.invoiceModel==1){
								v.invoiceModelVal = '个人或事业单位'
							}else if(v.invoiceModel==2){
								v.invoiceModelVal = '单位'
							}else{
								v.invoiceModelVal = ''
							}
							if(v.invoiceType==1){
								v.invoiceTypeVal = '普通发票'
							}else if(v.invoiceType==2){
								v.invoiceTypeVal = '增值税发票'
							}else if(v.invoiceType==0){
								v.invoiceTypeVal = '暂不开票'
							}else{
								v.invoiceTypeVal = ''
							}
							htmlTr = '<tr>' +
									'<td><span style="margin-left:10px" class="addchargenum">' + (i + 1) + '</span></td>' +
									'<td class="groupId">' +
										'<label class="groupName list-span" style="display:none;">' + v.groupName + '</label>'+
//										'<select class="yt-select group-select" style="width:200px">' +
//										'</select>' +
										'<input type="hidden" class="group-select" value="'+v.groupId+'"/>'+
	      								'<input type="text" class="yt-input comp-group-name" style="cursor: default;" placeholder="请选择" value="'+v.groupName+'" readonly/>'+
									'</td>' +
									'<td><span class="list-span" style="display:none;">'+ v.trainingExpenseRackRate +'</span><input class="yt-input trainingExpenseRackRate money-rate" value="' + $yt_baseElement.fmMoney(v.trainingExpenseRackRate) + '"  type="text"/></td>' +
									'<td><span class="list-span" style="display:none;">' + v.traineeRackRate + '</span><input class="yt-input traineeRackRate money-rate" value="' + $yt_baseElement.fmMoney(v.traineeRackRate) + '"  type="text"/></td>' +
									'<td><span class="list-span" style="display:none;">' + v.quarterageRackRate + '</span><input class="yt-input quarterageRackRate money-rate" value="' + $yt_baseElement.fmMoney(v.quarterageRackRate) + '"  type="text"/></td>' +
									'<td><span class="list-span" style="display:none;">' + v.mealFeeRackRate + '</span><input class="yt-input mealFeeRackRate money-rate" value="' + $yt_baseElement.fmMoney(v.mealFeeRackRate) + '"  type="text"/></td>' +
									'<td><span class="list-span" style="display:none;">' + v.trainingExpenseNegotiatedPrice + '</span><input class="yt-input trainingExpenseNegotiatedPrice money-rate" value="' + $yt_baseElement.fmMoney(v.trainingExpenseNegotiatedPrice) + '"  type="text"/></td>' +
									'<td><span class="list-span" style="display:none;">' + v.traineeNegotiatedPrice + '</span><input class="yt-input traineeNegotiatedPrice money-rate" value="' + $yt_baseElement.fmMoney(v.traineeNegotiatedPrice) + '"  type="text"/></td>' +
									'<td><span class="list-span" style="display:none;">' + v.quarterageNegotiatedPrice + '</span><input class="yt-input quarterageNegotiatedPrice money-rate" value="' + $yt_baseElement.fmMoney(v.quarterageNegotiatedPrice) + '"  type="text"/></td>' +
									'<td><span class="list-span" style="display:none;">' + v.mealFeeNegotiatedPrice + '</span><input class="yt-input mealFeeNegotiatedPrice money-rate" value="' + $yt_baseElement.fmMoney(v.mealFeeNegotiatedPrice) + '"  type="text"/></td>' +
									'<td align="center" invoicetype="'+v.invoiceType+'" invoicemodel="'+v.invoiceModel+'" orgname="'+v.orgName+'" taxnumber="'+v.taxNumber+'" address="'+v.address+'" telephone="'+v.telephone+'" registeredbank="'+v.registeredBank+'" account="'+v.account+'"><a class="editor-charge">编辑</a></td>' +
									'<td align="center">' +
										'<span style="text-align:center;">' +
											'<img src="../../resources/images/icons/cost-level.png" class="del-charge" alt="" />' +
										'</span>' +
									'</td>' +
									'</tr>';
								htmlTr = $(htmlTr).data('data',v);
								htmlTbody.append(htmlTr);
//								//获取集团名称
//								var groupList = projectDetailsList.getListSelectGroup();
//								if(groupList != null) {
//										$('.charge-tbody1 tr').eq(i).find("select.group-select").empty()
//										$('.charge-tbody1 tr').eq(i).find("select.group-select").append('<option value="">请选择</option>');
//									$.each(groupList, function(x, y) {
//										$('.charge-tbody1 tr').eq(i).find("select.group-select").append('<option value="' + y.groupId + '">' + y.groupName + '</option>');
//									});
//								}
//								//初始化单位名称下拉列表
//								$('.charge-tbody1 tr').eq(i).find("select.group-select").niceSelect({  
//							        search: true,  
//							        backFunction: function(text) {  
//							            //回调方法,可以执行模糊查询,也可自行添加操作  
//							           $('.charge-tbody1 tr').eq(i).find("select.group-select option").remove();  
//							            if(text == "") {  
//							                $('.charge-tbody1 tr').eq(i).find("select.group-select").append('<option value="">请选择</option>');  
//							            }  
//							            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
//							            $.each(groupList, function(x, y) {  
//							                if(y.groupName.indexOf(text) != -1) {  
//													$('.charge-tbody1 tr').eq(i).find("select.group-select").append('<option value="' + y.groupId + '">' + y.groupName + '</option>');
//							                }  
//							            });  
//							        }  
//								});
//								$('.charge-tbody1 tr').eq(i).find(".group-select").setSelectVal(v.groupId)
						});
						me.groupRatesOldData=groupRatesArr;
					}else{
//						$(".btn-charge-person button").attr('class','yt-option-btn btn-sub-charge');
//						$(".btn-charge-person button").text('确定');
					}
					if($(".btn-charge-person").children().length != 0){//有编辑确定按钮可编辑
						if ($.trim($(".btn-charge-person button").text()) == "编辑") {//有按钮但按钮时编辑，列表还是隐藏输入框，按钮为确定时才可编辑
							$.each($(".charge-tbody1 tr"),function(b,k){
							$(k).find(".editor-charge").text("查看");
							$(k).find(".del-charge").hide();
							});
							$('.unit-tfoot').hide();
							//文本输入框转文本
//							$.each($('.charge-standard-index input'),function(i,n){
//								$(n).hide();
//								$(n).siblings('span').text($(n).val());
//								$(n).siblings('span').show();
//							})
						$.each($('.charge-tbody1 input'),function(i,n){
							$(n).hide();
							$(n).siblings('span').text($(n).val());
							$(n).siblings('.list-span').show();
						})
						$.each($('.personal-standard input'),function(i,n){
							$(n).hide();
							$(n).siblings('span').text($(n).val());
							$(n).siblings('span').show();
						})
							//下拉框转文本
							$('div.group-select').hide();
							$.each($('select.group-select'),function(i,n){
								$(n).siblings('.groupName').text($(n).find('option:selected').text());
								$(n).siblings('.groupName').show();
							})
						}else{//编辑按钮为确定按钮，页面可编辑
							//个人标准
							$(".personal-standard span").hide();
							var traineeRatesArr = $.parseJSON(data.data.traineeRates);
							if(traineeRatesArr != null) {
								$(".personal-standard").setDatas(traineeRatesArr);
								$(".training-expense-rack-rate").val($yt_baseElement.fmMoney(traineeRatesArr.trainingExpenseRackRate));
								$(".trainee-rack-rate").val($yt_baseElement.fmMoney(traineeRatesArr.traineeRackRate));
								$(".quarterage-rack-rate").val($yt_baseElement.fmMoney(traineeRatesArr.quarterageRackRate));
								$(".meal-fee-rack-rate").val($yt_baseElement.fmMoney(traineeRatesArr.mealFeeRackRate));
								$(".training-expense-negotiated-price").val($yt_baseElement.fmMoney(traineeRatesArr.trainingExpenseNegotiatedPrice));
								$(".trainee-negotiated-price").val($yt_baseElement.fmMoney(traineeRatesArr.traineeNegotiatedPrice));
								$(".quarterage-negotiated-price").val($yt_baseElement.fmMoney(traineeRatesArr.quarterageNegotiatedPrice));
								$(".meal-fee-negotiated-price").val($yt_baseElement.fmMoney(traineeRatesArr.mealFeeNegotiatedPrice));
								
								$(".training-expense-rack-rate-span").text($yt_baseElement.fmMoney(traineeRatesArr.trainingExpenseRackRate));
								$(".trainee-rack-rate-span").text($yt_baseElement.fmMoney(traineeRatesArr.traineeRackRate));
								$(".quarterage-rack-rate-span").text($yt_baseElement.fmMoney(traineeRatesArr.quarterageRackRate));
								$(".meal-fee-rack-rate-span").text($yt_baseElement.fmMoney(traineeRatesArr.mealFeeRackRate));
								$(".training-expense-negotiated-price-span").text($yt_baseElement.fmMoney(traineeRatesArr.trainingExpenseNegotiatedPrice));
								$(".trainee-negotiated-price-span").text($yt_baseElement.fmMoney(traineeRatesArr.traineeNegotiatedPrice));
								$(".quarterage-negotiated-price-span").text($yt_baseElement.fmMoney(traineeRatesArr.quarterageNegotiatedPrice));
								$(".meal-fee-negotiated-price-span").text($yt_baseElement.fmMoney(traineeRatesArr.mealFeeNegotiatedPrice));
							} else {
							}
						}
					}else{//个人标准不可编辑
						//个人标准
						var traineeRatesArr = $.parseJSON(data.data.traineeRates);
						if(traineeRatesArr != null) {
							$(".personal-standard").setDatas(traineeRatesArr);
								$(".training-expense-rack-rate").val($yt_baseElement.fmMoney(traineeRatesArr.trainingExpenseRackRate));
								$(".trainee-rack-rate").val($yt_baseElement.fmMoney(traineeRatesArr.traineeRackRate));
								$(".quarterage-rack-rate").val($yt_baseElement.fmMoney(traineeRatesArr.quarterageRackRate));
								$(".meal-fee-rack-rate").val($yt_baseElement.fmMoney(traineeRatesArr.mealFeeRackRate));
								$(".training-expense-negotiated-price").val($yt_baseElement.fmMoney(traineeRatesArr.trainingExpenseNegotiatedPrice));
								$(".trainee-negotiated-price").val($yt_baseElement.fmMoney(traineeRatesArr.traineeNegotiatedPrice));
								$(".quarterage-negotiated-price").val($yt_baseElement.fmMoney(traineeRatesArr.quarterageNegotiatedPrice));
								$(".meal-fee-negotiated-price").val($yt_baseElement.fmMoney(traineeRatesArr.mealFeeNegotiatedPrice));
								
								$(".training-expense-rack-rate-span").text($yt_baseElement.fmMoney(traineeRatesArr.trainingExpenseRackRate));
								$(".trainee-rack-rate-span").text($yt_baseElement.fmMoney(traineeRatesArr.traineeRackRate));
								$(".quarterage-rack-rate-span").text($yt_baseElement.fmMoney(traineeRatesArr.quarterageRackRate));
								$(".meal-fee-rack-rate-span").text($yt_baseElement.fmMoney(traineeRatesArr.mealFeeRackRate));
								$(".training-expense-negotiated-price-span").text($yt_baseElement.fmMoney(traineeRatesArr.trainingExpenseNegotiatedPrice));
								$(".trainee-negotiated-price-span").text($yt_baseElement.fmMoney(traineeRatesArr.traineeNegotiatedPrice));
								$(".quarterage-negotiated-price-span").text($yt_baseElement.fmMoney(traineeRatesArr.quarterageNegotiatedPrice));
								$(".meal-fee-negotiated-price-span").text($yt_baseElement.fmMoney(traineeRatesArr.mealFeeNegotiatedPrice));
						} else {
						}
						//文本输入框转文本
						$.each($('.charge-standard-index input'),function(i,n){
							$(n).hide();
							if ($(n).attr("display") == "block") {
								$(n).siblings('span').text($(n).val());
							}
							$(n).siblings('span').text($yt_baseElement.fmMoney($(n).siblings('span').text()));
							$(n).siblings('span').show();
							$(n).siblings('.groupName').show();
						})
						//下拉框转文本
						$('div.group-select').hide();
						$.each($('select.group-select'),function(i,n){
							$(n).siblings('.groupName').text($(n).find('option:selected').text());
							$(n).siblings('.groupName').show();
						});
					}
					if ($(".shell-or-true").val() == "1") {
						$.each($(".charge-tbody1 tr"), function(t,b) {
							$(b).find(".editor-charge").text("查看");
							$(b).find(".del-charge").hide();
						});
					}
					/*
					 合同
					 * */
					if(contractRates==''){
						//为空，从未提交过合同
						contractRates={
							traineeHierarchy:'',
							traineeSum:'',
							startTime:'',
							endTime:'',
							trainDate:'',
							contractFiles:''
						}
						if($yt_common.GetQueryString("history")!='myProjectList'){
							$('.contract-info,.contract-title').hide();
						}
					}
					projectDetailsList.saveOrEditor('input');
					$(".contract-file-con").empty();
					$('.contract-table').setDatas(contractRates);
					$('.contract-trainee').setSelectVal(contractRates.traineeHierarchy);
					if(contractRates.endTime==''||contractRates.startTime==''){
						$('.contract-startDate').val(me.getBeanById.startDate);
						$('.contract-endDate').val(me.getBeanById.endDate);
						var endDate = new Date($('.contract-endDate').val());
						var startDate = new Date($('.contract-startDate').val());
						var date =  endDate.getTime()-startDate;
						$('.contract-cycle').val((date/ 1000 / 60 / 60 / 24)+1);
					}
					$(".contract-file-con").empty();
					if(contractRates.contractFiles!=undefined){
						$.each(contractRates.contractFiles, function(i,n) {
						var h = '<p class="contract-file-p" style="width:870px;height:40px;border:1px dashed #e6e6e6;line-height:40px;margin: auto;padding: 0 30px;box-sizing: border-box;">' +
											'<span class="file-name" style="margin-right: 50px;color:blue;cursor: pointer"><input type="hidden" class="file-span-id" value="' + n.fileId + '" >' + n.fileName + '</span>' +
											'<span class="contract-del-file" style="float:right;cursor: pointer;"><img src="../../resources/images/icons/teach-plan-del.png" alt="" />删除</span>' +
											'<a href="'+n.fileUrl+ '" class="down-load-file-index" style="float:right;cursor: pointer;margin-right:10px"><img src="../../resources/images/icons/down-load-teach-plan.png" alt="" />下载</a>' +
											'</p>';
							n.pkId = n.fileId;
							n.naming = n.fileName;
							h = $(h).data('data',n);
						$(".contract-file-con").append(h);
					});
					}
					$('.contract-file').undelegate().delegate('#contractAddFile','change',function(){
							if($(this).val()==''){
								return false;
							}
							$.ajaxFileUpload({
								url: $yt_option.acl_path + "api/tAscPortraitInfo/addFile",
								type: "post",
								data: {
									modelCode: "contractAddFile"
								},
								dataType: 'json',
								fileElementId: 'contractAddFile',
								success: function(data, textStatus) {
									var resultData = $.parseJSON(data);
									if(resultData.success == 0) {
										$yt_alert_Model.prompt("附件上传成功");
										var h = '<p class="contract-file-p" style="width:870px;height:40px;border:1px dashed #e6e6e6;line-height:40px;margin: auto;padding: 0 30px;box-sizing: border-box;">' +
											'<span class="file-name" style="margin-right: 50px;color:blue;cursor: pointer"><input type="hidden" class="file-span-id" value="' + resultData.obj.pkId + '" >' + resultData.obj.naming + '</span>' +
											'<span class="contract-del-file" style="float:right;cursor: pointer;"><img src="../../resources/images/icons/teach-plan-del.png" alt="" />删除</span>' +
											'<a href="'+$yt_option.acl_path +'api/tAscPortraitInfo/download?isDownload=true&pkId=' + resultData.obj.pkId + '" class="down-load-file-index" style="float:right;cursor: pointer;margin-right:10px"><img src="../../resources/images/icons/down-load-teach-plan.png" alt="" />下载</a>' +
											'</p>';
											h = $(h).data('data',resultData.obj);
										$(".contract-file-con").append(h);
									} else {
										$yt_alert_Model.prompt("附件上传失败");
										$('#contractAddFile').val('')
									}
									$yt_baseElement.hideLoading();
								},
								error: function(data, status, e) { //服务器响应失败处理函数  
									$yt_alert_Model.prompt("网络异常，附件上传失败");
									$yt_baseElement.hideLoading();
									$('#contractAddFile').val('');
								}
							});
					})
					$('.contract-file').on('click','.contract-del-file',function(){
							$(this).parents('p').remove();
					})
					$('.btn-sub-contract').off().click(function(){
						if($(this).text()=='编辑'){
							projectDetailsList.saveOrEditor('input');
						}else{
							projectDetailsList.updateContract(contractRates.pkId);
						}
					})
					//登录人名
					var userRealName = $('.hid-user-real-name').val();
					//项目销售人名
					var projectSellName = $('.hid-project-sell-name').val();
					if(userRealName!=projectSellName){
						projectDetailsList.saveOrEditor('detail');
						$('.btn-sub-contract').hide();
					}
					if($('.btn-sub-contract').text()=='编辑'){
						projectDetailsList.saveOrEditor('detail');
					}
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}
				//显示弹窗确定按钮
				$("sub-invoice").show();
				//显示弹窗取消按钮
				$("close-inp").show();
				
			}//回调函数 匿名函数返回查询结果  
		});
		//单位标准列表 点击删除按钮  删除当前行数据
		$(".charge-standard-index .charge-tbody").on('click', '.del-charge', function() {
			$(this).parent().parent().parent().remove();
			$.each($('.charge-tbody tr'), function(i, n) {
				var num = $(n).index() + 1;
				$(n).find('.addchargenum').text(num);
			});
		});
	},
	/**
	 * 保存合同管理
	 */
	updateContract:function(pkId){
		var contractFiles = [];
		$.each($('.contract-file-p'), function(i,n) {
			var json = {
				fileId:$(n).data('data').pkId,
				fileName:$(n).data('data').naming
			}
			contractFiles.push(json);
		});
		contractFiles = JSON.stringify(contractFiles);
		var contractRates ={
			traineeHierarchy:$('.contract-trainee').val(),
			traineeSum:$('.traineeSum').val(),
			startTime:$('.contract-startDate').val(),
			endTime:$('.contract-endDate').val(),
			trainDate:$('.contract-cycle').val(),
			pkId:pkId,
			contractFiles:contractFiles
		}
		contractRates = JSON.stringify(contractRates);
		$.ajax({
			type:"post",
			url:$yt_option.base_path+"project/updateProjectContract",
			async:true,
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			data:{
				projectId:$yt_common.GetQueryString('pkId'),
				contractRates:contractRates
			},
			success:function(data){
				if(data.flag==0){
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt('保存成功');
					})	
					projectDetailsList.saveOrEditor('detail');
				}else{
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt('保存失败');
					})
				}
				
			},error:function(){
				$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt('网络异常，保存失败');
					})
			}
		});
	},
	//合同的编辑与保存
	saveOrEditor:function(a){
		if(a=='input'){
			$('.btn-sub-contract').text('确定');
			$('.contract-table input').siblings('span').text('');
			$('.contract-table .contract-trainee').siblings('span').text('');
			$('.contract-table input').show();
			$('.contract-table div.contract-trainee').show();
			$('.contract-info .file-upload-div').show();
			$('.contract-info .contract-del-file').show();
		}
		if(a=='detail'){
			$('.btn-sub-contract').text('编辑');
			$.each($('.contract-table input'), function(i,n) {
				$(n).siblings('span').text($(n).val());
			});
			$('.contract-table .contract-trainee').siblings('span').text($('.contract-table select option:checked').text());
			$('.contract-table input').hide();
			$('.contract-table .contract-trainee').hide();
			$('.contract-info .file-upload-div').hide();
			$('.contract-info .contract-del-file').hide();
		}
		
	},
	//开票信息保存
	savebillingInf: function(bilType) {
		$yt_baseElement.showLoading();
		var projectId = $yt_common.GetQueryString('pkId');
		var invoiceModel = "";
		var groupId = "";
		var invoiceType = "";
		var orgName = "";
		var taxNumber = "";
		var address = "";
		var telephone = "";
		var registeredBank = "";
		var account = "";
		if(bilType == 1){//收费标准提交发票
			if($(".billing-inf-alert tbody .invoiceType").val()==1){
				invoiceModel=$(".billing-inf-alert tbody .is-not-comp label input:checked").val();
			}else{
				invoiceModel="";
			}
			groupId = $(".group-id-hid").val();
			invoiceType = $('.invoice-inf .invoiceType').val();
			orgName = $('.invoice-inf .orgName').val();
			taxNumber = $('.invoice-inf .taxNumber').val();
			address = $('.invoice-inf .address').val();
			telephone = $('.invoice-inf .telephone').val();
			registeredBank = $('.invoice-inf .registeredBank').val();
			account = $('.invoice-inf .account').val();
		}else{//工作人员提交发票
			if($(".work-bill-tob .work-invoice-type").val() == 1){//普通发票
				invoiceModel=$(".work-bill-tob label input:checked").val();
			}else{//专用发票
				invoiceModel="";
			}
			groupId = $(".hid-comp-select").val();
			invoiceType = $('.work-bill-tob .work-invoice-type').val();
			orgName = $('.work-bill-tob .work-org-name').val();
			taxNumber = $('.work-bill-tob .work-tax-number').val();
			address = $('.work-bill-tob .work-address').val();
			telephone = $('.work-bill-tob .work-telephone').val();
			registeredBank = $('.work-bill-tob .work-registered-bank').val();
			account = $('.work-bill-tob .work-account').val();
		}
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "project/updateProjectOrgInvoice", //ajax访问路径  
			data: {
				projectId: projectId,
				groupId: groupId,
				invoiceModel:invoiceModel,
				orgName: orgName,
				taxNumber: taxNumber,
				address: address,
				telephone: telephone,
				registeredBank: registeredBank,
				account: account,
				deliveryAddress: "",
				recipients: "",
				recipientsPhone: "",
				invoiceType: invoiceType
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt("保存成功");
					$yt_baseElement.hideLoading();

				} else {
					$yt_alert_Model.prompt("保存失败");
					$yt_baseElement.hideLoading();
				}
			}
		});
	},
	//开票信息弹出框
	billingInf: function() {
		projectDetailsList.initForm();
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$(".billing-inf-alert").show();
		/** 
		 * 调用算取div显示位置方法
		 */
		$yt_alert_Model.setFiexBoxHeight($(".billing-inf-alert .alert-form"));
		$yt_alert_Model.getDivPosition($(".billing-inf-alert"));
		/* 
		 * 调用支持拖拽的方法 
		 */
		$yt_model_drag.modelDragEvent($(".billing-inf-alert .yt-edit-alert-title"));
		/** 
		 * 点击取消方法 
		 */
		$('.billing-inf-alert .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
			//隐藏页面中自定义的表单内容  
			$(".billing-inf-alert").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
	},
	//收费标准保存
	saveChargeStandard: function() {
		var me = this;
		$yt_baseElement.showLoading();
		var projectId = $yt_common.GetQueryString('pkId');
		var groupRates = "";
		var traineeRates = "";
		var groupRatesArr = [];
		var groupRatesNew =[]
		$(".charge-tbody1 tr").each(function(i, n) {
			var projectId = $yt_common.GetQueryString('pkId');
			groupId = $(n).find(".groupId .group-select").val();
			trainingExpenseRackRate = $yt_baseElement.rmoney($(n).find(".trainingExpenseRackRate").val());
			traineeRackRate = $yt_baseElement.rmoney($(n).find(".traineeRackRate").val());
			quarterageRackRate = $yt_baseElement.rmoney($(n).find(".quarterageRackRate").val());
			mealFeeRackRate = $yt_baseElement.rmoney($(n).find(".mealFeeRackRate").val());
			trainingExpenseNegotiatedPrice = $yt_baseElement.rmoney($(n).find(".trainingExpenseNegotiatedPrice").val());
			traineeNegotiatedPrice = $yt_baseElement.rmoney($(n).find(".traineeNegotiatedPrice").val());
			quarterageNegotiatedPrice = $yt_baseElement.rmoney($(n).find(".quarterageNegotiatedPrice").val());
			mealFeeNegotiatedPrice = $yt_baseElement.rmoney($(n).find(".mealFeeNegotiatedPrice").val());
			invoiceType=$(n).find('.editor-charge').parent().attr('invoiceType');
			invoiceModel=$(n).find('.editor-charge').parent().attr('invoiceModel');
			orgName=$(n).find('.editor-charge').parent().attr('orgName');
			taxNumber=$(n).find('.editor-charge').parent().attr('taxNumber');
			address=$(n).find('.editor-charge').parent().attr('address');
			telephone=$(n).find('.editor-charge').parent().attr('telephone');
			registeredBank=$(n).find('.editor-charge').parent().attr('registeredBank');
			account=$(n).find('.editor-charge').parent().attr('account');
			var invoiceModelVal;
			var invoiceTypeVal;
			if(invoiceModel==1){
				invoiceModelVal = '个人或事业单位'
			}else if(invoiceModel==2){
				invoiceModelVal = '单位'
			}else{
				invoiceModelVal=''
			}
			if(invoiceType==1){
				invoiceTypeVal = '普通发票'
			}else if(invoiceType==2){
				invoiceTypeVal = '增值税发票'
			}else if(invoiceType==0){
				invoiceTypeVal = '暂不开票'
			}else{
				invoiceTypeVal=''
			}
			var groupRatesList = {
				projectId: projectId,
				groupName:$(n).find(".groupId .group-select option:checked").text(),
				groupId: groupId,
				trainingExpenseRackRate: trainingExpenseRackRate,
				traineeRackRate: traineeRackRate,
				quarterageRackRate: quarterageRackRate,
				mealFeeRackRate: mealFeeRackRate,
				trainingExpenseNegotiatedPrice: trainingExpenseNegotiatedPrice,
				traineeNegotiatedPrice: traineeNegotiatedPrice,
				quarterageNegotiatedPrice: quarterageNegotiatedPrice,
				mealFeeNegotiatedPrice: mealFeeNegotiatedPrice,
				invoiceType:invoiceType,
				invoiceModel:invoiceModel,
				invoiceTypeVal:invoiceTypeVal,
				invoiceModelVal:invoiceModelVal,
				orgName:orgName,
				taxNumber:taxNumber,
				address:address,
				telephone:telephone,
				registeredBank:registeredBank,
				account:account,
				deliveryAddress:'',
				recipients:'',
				recipientsPhone:''
			}
			groupRatesArr.push(groupRatesList);
		});
		var groupRatesLogs = [];
		$.each(groupRatesArr, function(i,n) {
			var bool = true;
			$.each(me.groupRatesOldData, function(j,k) {
				if(n.groupId==k.groupId){
					if(me.getMoneyLogInfo(me.groupRatesName,k,n)!=''){
						var json ={
						traineeGroupId:n.groupId,
						traineeGroupType:2,
						logsType:1,
						logsDetails:'修改'+k.groupName+'单位的收费标准,'+me.getMoneyLogInfo(me.groupRatesName,k,n)
						}
						groupRatesLogs.push(json);
					}
					bool=false;
				}
			});
			if(bool){
				console.log(n);
				var json ={
						traineeGroupId:n.groupId,
						traineeGroupType:2,
						logsType:1,
						logsDetails:'新增'+n.groupName+'单位的收费标准,'+me.getMoneyLogInfo(me.groupRatesName,null,n)
					}
					groupRatesLogs.push(json);
			}
		});
		//删除
		$.each(me.groupRatesOldData, function(j,k) {
			var bool =true;
			$.each(groupRatesArr, function(i,n) {
				if(n.groupId==k.groupId){
					bool=false;
				}
			})
			if(bool){
				var json ={
						traineeGroupId:k.groupId,
						traineeGroupType:2,
						logsType:1,
						logsDetails:'删除'+k.groupName+'单位的单位标准'
					}
					groupRatesLogs.push(json);
			}
		});
			groupRatesLogs = JSON.stringify(groupRatesLogs);
			groupRatesLogs=='[]'?groupRatesLogs='':groupRatesLogs=groupRatesLogs;
			if(groupRatesArr.length>0){
				groupRates = JSON.stringify(groupRatesArr);
			}
		var projectId = $yt_common.GetQueryString('pkId');
		var trainingExpenseRackRate = $yt_baseElement.rmoney($(".personal-standard .training-expense-rack-rate").val());
		var traineeRackRate = $yt_baseElement.rmoney($(".personal-standard .trainee-rack-rate").val());
		var quarterageRackRate = $yt_baseElement.rmoney($(".personal-standard .quarterage-rack-rate").val());
		var mealFeeRackRate = $yt_baseElement.rmoney($(".personal-standard .meal-fee-rack-rate").val());
		var trainingExpenseNegotiatedPrice = $yt_baseElement.rmoney($(".personal-standard .training-expense-negotiated-price").val());
		var traineeNegotiatedPrice = $yt_baseElement.rmoney($(".personal-standard .trainee-negotiated-price").val());
		var quarterageNegotiatedPrice = $yt_baseElement.rmoney($(".personal-standard .quarterage-negotiated-price").val());
		var mealFeeNegotiatedPrice = $yt_baseElement.rmoney($(".personal-standard .meal-fee-negotiated-price").val());
		var traineeRatesList = {
			projectId: projectId,
			trainingExpenseRackRate: trainingExpenseRackRate,
			traineeRackRate: traineeRackRate,
			quarterageRackRate: quarterageRackRate,
			mealFeeRackRate: mealFeeRackRate,
			trainingExpenseNegotiatedPrice: trainingExpenseNegotiatedPrice,
			traineeNegotiatedPrice: traineeNegotiatedPrice,
			quarterageNegotiatedPrice: quarterageNegotiatedPrice,
			mealFeeNegotiatedPrice: mealFeeNegotiatedPrice
		}
		if(me.getMoneyLogInfo(me.traineeRatesName,me.traineeRatesOldData,traineeRatesList)==''){
			traineeRatesLogs=""
		}else{
			var logsDetails ;
			var a = 0;
			for(i in me.traineeRatesOldData){
				if(i!=projectId){
					me.traineeRatesOldData[i]!=''?a=1:a=a;
				}
			}
			if(a==1){
				logsDetails ='修改个人收费标准,'+me.getMoneyLogInfo(me.traineeRatesName,me.traineeRatesOldData,traineeRatesList)
			}else if(a==0){
				logsDetails ='新增个人收费标准,'+me.getMoneyLogInfo(me.traineeRatesName,null,traineeRatesList)
			}
			traineeRatesLogs={
				traineeGroupType:'',
				logsType:2,
				logsDetails:logsDetails
			}
		}
		if(traineeRatesLogs!=''){
			traineeRatesLogs = JSON.stringify(traineeRatesLogs);
		}
		var traineeRates = JSON.stringify(traineeRatesList);
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "project/updateProjectRates", //ajax访问路径  
			data: {
				projectId: projectId,
				groupRates: groupRates,
				traineeRates: traineeRates,
				groupRatesLogs:groupRatesLogs,
				traineeRatesLogs:traineeRatesLogs
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt("保存成功");
					projectDetailsList.getStudentCostInf();
					projectDetailsList.getUnitCostInf();
					$yt_baseElement.hideLoading();
				} else {
					$yt_alert_Model.prompt("保存失败");
					projectDetailsList.getUnitCostInf();
					$yt_baseElement.hideLoading();
				}
			}
		});
	},
	//获取学员费用详情
	getStudentCostInf: function(aa) {
		var projectId = $yt_common.GetQueryString('pkId');
		//标识该页面是由项目审批列表跳转过来的
		var pageType = $yt_common.GetQueryString('pageType');
		var selectParam = "";
		$yt_baseElement.showLoading();
		$.ajax({
			url: $yt_option.base_path + "project/getProjectRatesDetails", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				projectId: projectId,
				selectParam: selectParam
			}, //ajax查询访问参数
			async:false,
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.student-cost-tbody').empty();
					var htmlTr = '';
					var num = 1;
					if(data.data.length > 0) {
						$.each(data.data, function(i, v) {
							htmlTr = '<tr>' +
									'<td style="text-align: center;">' + num++ + '</td>' +
									'<td><span class=" traineeName" value="">' + v.traineeName + '</span></td>' +
									'<td><span class=" groupName" value=""><input type="hidden" value="' + v.groupId + '" class="groupId"/>' + v.groupName + '</span></td>' +
									'<td><input type="hidden" value="' + v.types + '" class="types"/><span></span><input class="yt-input trainingExpenseRackRate" value="' + $yt_baseElement.fmMoney(v.trainingExpenseRackRate) + '"  type="text"/></td>' +
									'<td><span></span><input class="yt-input traineeRackRate" value="' + $yt_baseElement.fmMoney(v.traineeRackRate) + '"  type="text"/></td>' +
									'<td><span></span><input class="yt-input quarterageRackRate" value="' + $yt_baseElement.fmMoney(v.quarterageRackRate) + '"  type="text"/></td>' +
									'<td><span></span><input class="yt-input mealFeeRackRate" value="' + $yt_baseElement.fmMoney(v.mealFeeRackRate) + '"  type="text"/></td>' +
									'<td><span></span><input class="yt-input trainingExpenseNegotiatedPrice" value="' + $yt_baseElement.fmMoney(v.trainingExpenseNegotiatedPrice) + '"  type="text"/></td>' +
									'<td><span></span><input class="yt-input traineeNegotiatedPrice" value="' + $yt_baseElement.fmMoney(v.traineeNegotiatedPrice) + '"  type="text"/></td>' +
									'<td><span></span><input class="yt-input quarterageNegotiatedPrice" value="' + $yt_baseElement.fmMoney(v.quarterageNegotiatedPrice) + '"  type="text"/></td>' +
									'<td><span></span><input class="yt-input mealFeeNegotiatedPrice" value="' + $yt_baseElement.fmMoney(v.mealFeeNegotiatedPrice) + '"  type="text"/></td>' +
									'</tr>';
							htmlTr = $(htmlTr).data('data',v);
							htmlTbody.append(htmlTr);
						});
					} else {
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="10" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
							htmlTbody.append(htmlTr);
					}
					$yt_baseElement.hideLoading();
					if(aa=='begin'){
						$(".update-trainee-details").text("编辑")
					}
					//按钮是编辑就变成详情页
					if($(".update-trainee-details").text() == "编辑"){
						//学员费用
						var trHtml = $(".student-cost-tbody tr");
						$.each(trHtml, function(t,r) {
							$.each($(r).find("td"), function(g,d) {
								if (g==3) {
									$(d).find("span").text($(d).find(".trainingExpenseRackRate").val());
									$(d).find(".trainingExpenseRackRate").hide();
								} 
								if(g>3){
									$(d).find("input").prev().text($(d).find("input").val())
									$(d).find("input").hide();
								}
							});
						});
					}
					if($(".shell-or-true").val() == "1"){//当前登录人不是项目项目销售，收费标准不能修改
						//学员费用
						var trHtml = $(".student-cost-tbody tr");
						$.each(trHtml, function(t,r) {
							$.each($(r).find("td"), function(g,d) {
								if (g==3) {
									$(d).find("span").text($(d).find(".trainingExpenseRackRate").val());
									$(d).find(".trainingExpenseRackRate").hide();
								} 
								if(g>3){
									$(d).find("input").prev().text($(d).find("input").val())
									$(d).find("input").hide();
								}
							});
						});
					}
					
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}
			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	//学员费用详情保存
	updateTraineeDetails: function() {
		var me = this ;
		$yt_baseElement.showLoading();
		var updateData = "";
		var updateDataArr = [];
		$(".student-cost-tbody tr").each(function(i, n) {
			var projectId = $yt_common.GetQueryString('pkId');
			var traineeId = $(n).data('data').traineeId;
			var groupId = $(n).find(".groupId").val();
			var types = $(n).find(".types").val();
			var trainingExpenseRackRate = $(n).find(".trainingExpenseRackRate").val();
			var traineeRackRate = $(n).find(".traineeRackRate").val();
			var quarterageRackRate = $(n).find(".quarterageRackRate").val();
			var mealFeeRackRate = $(n).find(".mealFeeRackRate").val();
			var trainingExpenseNegotiatedPrice = $(n).find(".trainingExpenseNegotiatedPrice").val();
			var traineeNegotiatedPrice = $(n).find(".traineeNegotiatedPrice").val();
			var quarterageNegotiatedPrice = $(n).find(".quarterageNegotiatedPrice").val();
			var mealFeeNegotiatedPrice = $(n).find(".mealFeeNegotiatedPrice").val();
			var groupRatesList = {
				projectId: projectId,
				types: types,
				groupId: groupId,
				traineeId: traineeId,
				trainingExpenseRackRate: $yt_baseElement.rmoney(trainingExpenseRackRate),
				traineeRackRate: $yt_baseElement.rmoney(traineeRackRate),
				quarterageRackRate: $yt_baseElement.rmoney(quarterageRackRate),
				mealFeeRackRate: $yt_baseElement.rmoney(mealFeeRackRate),
				trainingExpenseNegotiatedPrice: $yt_baseElement.rmoney(trainingExpenseNegotiatedPrice),
				traineeNegotiatedPrice: $yt_baseElement.rmoney(traineeNegotiatedPrice),
				quarterageNegotiatedPrice: $yt_baseElement.rmoney(quarterageNegotiatedPrice),
				mealFeeNegotiatedPrice: $yt_baseElement.rmoney(mealFeeNegotiatedPrice)
			}
			var json = $(n).data('data');
			var bool =true;
			//判断数据是否被修改
			for (var j in json){
				if(json[j]!=groupRatesList[j]){
					if(json[j]!=undefined&&groupRatesList[j]!=undefined){
						bool =false;
					}
				}
			}
			if(bool==false){
				var traineeGroupId ;
				var traineeGroupType;
				var name ;
				if(types==1){
					traineeGroupId=groupId;
					traineeGroupType=2;
					name = json.groupName;
				}else{
					traineeGroupId=traineeId;
					traineeGroupType=1;
					name = json.traineeName;
				}
				groupRatesList.traineeLogs={
					traineeGroupId:traineeGroupId,
					traineeGroupType:traineeGroupType,
					logsType:3,
					logsDetails:'修改'+name+'费用详情，'+me.getMoneyLogInfo(me.traineeRatesName,json,groupRatesList)
				}
				updateDataArr.push(groupRatesList);
			}
		});
		var updateData = JSON.stringify(updateDataArr);

		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "project/updateTraineeDetails", //ajax访问路径  
			data: {
				updateData: updateData
			}, //ajax查询访问参数
			async:false,
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt("保存成功");
					$yt_baseElement.hideLoading();
					$(".update-trainee-details").text("编辑")
					//学员费用
					var trHtml = $(".student-cost-tbody tr");
//					$.each(trHtml, function(t,r) {
//						$.each($(r).find("td"), function(g,d) {
//							if (g==3) {
//								$(d).find("span").text($(d).find(".trainingExpenseRackRate").val());
//								$(d).find(".trainingExpenseRackRate").hide();
//							} 
//							if(g>3){
//								$(d).find("input").prev().text($(d).find("input").val())
//								$(d).find("input").hide();
//							}
//						});
//					});
				me.getStudentCostInf();
				} else {
					$yt_alert_Model.prompt("保存失败");
					$yt_baseElement.hideLoading();
				}
			}
		});
	},
	//教学方案设计需求查询
	getTeachPlanDesignRequirements: function() {
		var me = this;
		$yt_baseElement.showLoading();
		//登录人名
		var userRealName = $('.hid-user-real-name').val();
		//项目销售人名
		var projectSellName = $('.hid-project-sell-name').val();
		//项目主任名
		var projectHead = $('.hid-project-head-name').val();
		projectHead = projectHead.split(',');
		var projectId = $yt_common.GetQueryString('pkId');
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "project/getTeachingScheme", //ajax访问路径  
			data: {
				projectId: projectId
			}, //ajax查询访问参数
			success: function(data) {
				//清空id走教学方案审批新流程
				$('.hid-process-instance-id').val(' ')
				//判断当前登录人是否为项目销售
				var myhistory = $yt_common.GetQueryString("history")
				if(userRealName == projectSellName) {
					if(myhistory=="myProjectList"){
						$('.teach-plan-table').show();
						$('.demand-btn').show();
					}else{
						$('.teach-plan-table').hide();
						$('.demand-btn').hide();	
					}
				} else {
					$('.teach-plan-table').hide();
					$('.demand-btn').hide();
				}
				if(data.flag == 0 && data.data != null) { //教学方案需求设计存在
					//获取pkId
					$(".teach-plan-table .pk-id").val(data.data.pkId);
					//判断查询的数据是保存还是提交的
					if(data.data.dataStates == 1) {
						//隐藏教学方案需求设计提交按钮
						$('.demand-btn').hide();
						//隐藏教学方案需求填写框
						$('.teach-plan-table').hide();
						//显示教学方案需求设计详情
						$('.teach-plan-table-info').show();

						data.data.traineeLevel = data.data.traineeLevel.replace('1', '一级经理');
						data.data.traineeLevel = data.data.traineeLevel.replace('2', '二级经理');
						data.data.traineeLevel = data.data.traineeLevel.replace('3', '三级经理');
						data.data.traineeLevel = data.data.traineeLevel.replace('4', '其他');
						data.data.schemeRequirement = data.data.schemeRequirement.replace('1', '方案设计思路');
						data.data.schemeRequirement = data.data.schemeRequirement.replace('2', '教学日程');
						data.data.schemeRequirement = data.data.schemeRequirement.replace('3', '师资简介');
						if(data.data.estimatedTransactionPrice = 1) {
							data.data.estimatedTransactionPrice = "较高"
						} else if(data.data.estimatedTransactionPrice = 2) {
							data.data.estimatedTransactionPrice = "一般"
						} else if(data.data.estimatedTransactionPrice = 3) {
							data.data.estimatedTransactionPrice = "较低"
						}
						//设计方案需求数据详情数据
						$('.trainee-level-info').text(data.data.traineeLevel);
						$('.estimated-transaction-price-info').text(data.data.estimatedTransactionPrice);
						$('.time-receipt-info').text(data.data.timeReceipt);
						$('.feedback-time-info').text(data.data.feedbackTime);
						$('.scheme-requirement-info').text(data.data.schemeRequirement);
						$('.linkman-info').text(data.data.linkman);
						$('.phone-info').text(data.data.phone);
						$('.ad-details-info').text(data.data.adDetails);
						var teachingsSchemeLevel = data.data.teachingsSchemeLevel;
						var tsl = "";
						if(teachingsSchemeLevel == "teachingSchemeDept") {
							tsl = "部门级别";
						} else if(teachingsSchemeLevel == "teachingSchemeExpert") {
							tsl = "专家组";
						} else {
							tsl = "院领导";
						}
						$('.teachings-scheme-level-info').text(tsl);
					} else {
						$('.teach-plan-table').setDatas(data.data);
						$('.trainee-level').each(function(i,n){
							if(data.data.traineeLevel.indexOf($(n).find('input').val())!=-1){
								$(n).find('input').setCheckBoxState('check')
							}
						})
						$('.scheme-requirement').each(function(j,k){
							if(data.data.schemeRequirement.indexOf($(k).find('input').val())!=-1){
								$(k).find('input').setCheckBoxState('check')
							}
						})
						$('.estimated-transaction-price').setSelectVal(data.data.estimatedTransactionPrice);
						$('.teachings-scheme-level').setSelectVal(data.data.teachingsSchemeLevel);
					}

					//获取初稿
					var firstDraft;
					//获取终稿
					var teachingSchemeFile = JSON.parse(data.data.teachingSchemeFile);
					//--------------------------------------------------------------------------------------------------
					//判断当前登录人是否为当前项目的项目主任
					if(projectHead.indexOf(userRealName) != -1) { //是该项目的项目主任
						//调用教学方案终稿下一步操作人
						if($('.teachings-scheme-level-info').text() == '部门级别') {
							var getAllNextPeople = projectDetailsList.getworkFlowOperateTeach('teachingSchemeDept');
						} else if($('.teachings-scheme-level-info').text() == '专家组') {
							var getAllNextPeople = projectDetailsList.getworkFlowOperateTeach('teachingSchemeExpert');
						} else if($('.teachings-scheme-level-info').text() == '院领导') {
							var getAllNextPeople = projectDetailsList.getworkFlowOperateTeach('teachingSchemeLeader');
						}
						if(getAllNextPeople != null) {
							$.each(getAllNextPeople, function(i, n) {
								$(".first-file-next-person").append('<option value="' + n.userCode + '">' + n.userName + '</option>');
								if(i == 0) {
									//初稿提交下一步操作人
									$('.star-dealingWithPeople').val(n.userCode);
								}
							});
							$(".first-file-next-person").niceSelect();
						};
						//判断初终稿是否存在
						if(teachingSchemeFile.length > 0) { //初终存在
							//判断是否有初稿
							if(teachingSchemeFile[0].fileType == 1) { //有初稿
								//显示初稿文件
								$('.first-draft').show();
								//隐藏初稿的上传下载按钮
								$('.first-draft-btn').hide();
								//隐藏初稿提交按钮
								$('.plan-btn-flirst').hide();
								//显示初稿
								var teacherUl = $(".file-id");
								var teacherLi = "";
								var fileIdsArr = $.parseJSON(data.data.teachingSchemeFile);
								if(fileIdsArr.length > 0) {
									$('.first-draft-inf').css('width', '875px');
									$('.first-upload-time-title').show();
									$.each(fileIdsArr, function(i, v) {
										if(v.fileType == 1) {
											//上传时间
											$('.first-upload-time').text(v.createTimeString);

											teacherLi = '<p style="width:870px;height:40px;border:1px dashed #e6e6e6;line-height:40px;">' +
												'<input type="hidden" class="down-file-url" value="'+$yt_option.acl_path +'api/tAscPortraitInfo/download?isDownload=true&pkId=' + v.fileId + '">' +
												'<span class="file-name" style="margin-right: 50px;color:blue;cursor: pointer"><input type="hidden" class="file-span-id" value="' + v.pkId + '" >' + v.fileName + '</span>' +
												'<span class="del-file-p" style="float:right;cursor: pointer;display:none;"><img src="../../resources/images/icons/teach-plan-del.png" alt="" />删除</span>' +
												'<span class="down-load-file-index" style="float:right;cursor: pointer;"><img src="../../resources/images/icons/down-load-teach-plan.png" alt="" />下载</span>' +
												'<span style="float:right; display:none;"><img src="../../resources/images/icons/preview.png" alt="" />预览</span>' +
												'</p>';
											teacherUl.html(teacherLi);
										}
									});

								}

							} else { //没有初稿
								//显示初稿功能框
								$('.first-draft').show();
								$(".first-file-next-person-div").show();
							}
						} else { //初终不存在
							//显示初稿功能框
							$('.first-draft').show();
							$(".first-file-next-person-div").show();
						}
						//获取审批流程
						var flowLogArr = $.parseJSON(data.data.flowLog);
						if(flowLogArr != null) {
							//判断是否有流程
							if(flowLogArr.length > 0) { //流程存在
								if(flowLogArr[0].tastKey == "activitiEndTask" && flowLogArr[0].deleteReason != "") {
									//判断有没有终稿
									var bool = true;
									$.each(teachingSchemeFile, function(i, n) {
										if(n.fileType == 2) {
											bool = false;
										}
									});
									if(bool) {
										//显示终稿上传功能
										$('.last-draft').show();
									} else {
										//显示终稿
										$('.last-draft').show();
										//隐藏终稿上传按钮
										$('.last-draft-btn').hide();
										//隐藏终稿提交按钮
										$('.plan-btn-last').hide();
										if(fileIdsArr.length > 0) {
											$('.last-draft-inf').css('width', '875px');
											$('.last-upload-time-title').show();
											$.each(fileIdsArr, function(i, v) {
												$('.last-upload-time').text(v.createTimeString);
												if(v.fileType == 2) {
													teacherLi = '<p style="width:870px;height:40px;border:1px dashed #e6e6e6;line-height:40px;padding:0px 20px">' +
														'<input type="hidden" class="last-down-file-url" value="'+$yt_option.acl_path +'api/tAscPortraitInfo/download?isDownload=true&pkId=' + v.fileId + '">' +
														'<span class="file-name" style="margin-right: 50px;color:blue;cursor: pointer"><input type="hidden" class="file-span-id" value="' + v.pkId + '" >' + v.fileName + '</span>' +
														'<span class="del-file-p" style="float:right;cursor: pointer;display:none;"><img src="../../resources/images/icons/teach-plan-del.png" alt="" />删除</span>' +
														'<span class="last-down-load-file-index" style="float:right;cursor: pointer;"><img src="../../resources/images/icons/down-load-teach-plan.png" alt="" />下载</span>' +
														'<span style="float:right; display:none;"><img src="../../resources/images/icons/preview.png" alt="" />预览</span>' +
														'</p>';
													$('.last-file-id').html(teacherLi);
												}
											});
										}

									}

								}
							}
						}
					} else { //当前登录人不是该项目的项目主任---------------------------------------------------
						$('.last-step-div-teach').hide();
						$('.appro-btn-div').hide();
						//判断初终稿是否存在
						if(teachingSchemeFile.length > 0) { //初终存在
							//判断是否有初稿
							if(teachingSchemeFile[0].fileType == 1) { //有初稿
								//显示初稿文件
								$('.first-draft').show();
								//隐藏初稿的上传下载按钮
								$('.first-draft-btn').hide();
								//隐藏初稿提交按钮
								$('.plan-btn-flirst').hide();
								//显示初稿
								var teacherUl = $(".file-id");
								var teacherLi = "";
								var fileIdsArr = $.parseJSON(data.data.teachingSchemeFile);
								if(fileIdsArr.length > 0) {
									$('.first-draft-inf').css('width', '875px');
									$('.first-upload-time-title').show();
									$.each(fileIdsArr, function(i, v) {
										if(v.fileType == 1) {
											//上传时间
											$('.first-upload-time').text(v.createTimeString);
											teacherLi = '<p style="width:870px;height:40px;border:1px dashed #e6e6e6;line-height:40px;">' +
												'<input type="hidden" class="down-file-url" value="'+$yt_option.acl_path +'api/tAscPortraitInfo/download?isDownload=true&pkId=' + v.fileId + '">' +
												'<span class="file-name" style="margin-right: 50px;color:blue;cursor: pointer"><input type="hidden" class="file-span-id" value="' + v.pkId + '" >' + v.fileName + '</span>' +
												'<span class="del-file-p" style="float:right;cursor: pointer;display:none;"><img src="../../resources/images/icons/teach-plan-del.png" alt="" />删除</span>' +
												'<span class="down-load-file-index" style="float:right;cursor: pointer;"><img src="../../resources/images/icons/down-load-teach-plan.png" alt="" />下载</span>' +
												'<span style="float:right; display:none;"><img src="../../resources/images/icons/preview.png" alt="" />预览</span>' +
												'</p>';
											teacherUl.html(teacherLi);
										}
									});

								}
							}
						}
						var flowLogArr = $.parseJSON(data.data.flowLog);
						if(flowLogArr != null) {
							//判断是否有流程
							if(flowLogArr.length > 0) { //流程存在
								if(flowLogArr[0].tastKey == "activitiEndTask" && flowLogArr[0].deleteReason != "") {
									//判断有没有终稿
									var bool = true;
									$.each(teachingSchemeFile, function(i, n) {
										if(n.fileType == 2) {
											bool = false;
										}
									});
									if(bool == false) {
										//显示终稿
										$('.last-draft').show();
										//隐藏终稿上传按钮
										$('.last-draft-btn').hide();
										//隐藏终稿提交按钮
										$('.plan-btn-last').hide();
										if(fileIdsArr.length > 0) {
											$('.last-draft-inf').css('width', '875px');
											$('.last-upload-time-title').show();
											$.each(fileIdsArr, function(i, v) {
												$('.last-upload-time').text(v.createTimeString);
												if(v.fileType == 2) {
													teacherLi = '<p style="width:870px;height:40px;border:1px dashed #e6e6e6;line-height:40px;padding:0px 20px">' +
														'<input type="hidden" class="last-down-file-url" value="'+$yt_option.acl_path +'api/tAscPortraitInfo/download?isDownload=true&pkId=' + v.fileId + '">' +
														'<span class="file-name" style="margin-right: 50px;color:blue;cursor: pointer"><input type="hidden" class="file-span-id" value="' + v.pkId + '" >' + v.fileName + '</span>' +
														'<span class="del-file-p" style="float:right;cursor: pointer;display:none;"><img src="../../resources/images/icons/teach-plan-del.png" alt="" />删除</span>' +
														'<span class="last-down-load-file-index" style="float:right;cursor: pointer;"><img src="../../resources/images/icons/down-load-teach-plan.png" alt="" />下载</span>' +
														'<span style="float:right; display:none;"><img src="../../resources/images/icons/preview.png" alt="" />预览</span>' +
														'</p>';
													$('.last-file-id').html(teacherLi);
												}
											});
										}

									}
								}
							}
						}
					}
					//获取流程实例id
					$('.hid-process-instance-id').val(data.data.processInstanceId);
					//获取审批流程
					var flowLogArr = $.parseJSON(data.data.flowLog);
					var myhistory = $yt_common.GetQueryString("history");//history=teacherApprove  从教学方案审批界面跳转才能审批
					var noeMyhistory = "";
					if(flowLogArr != null) {
						//判断是否有流程
						if(flowLogArr.length > 0) {
							//流程存在
							$('.last-step-add-teach').empty();
							//---------------------------------------------------------------------------------------------------------------------------									
							//显示审批流程
							$('.approval-process-module').show();
							$.each(flowLogArr, function(i, n) {
								$('.tast-key-teach').val(flowLogArr[0].tastKey);
								//判断当前登录人是否为当前审批人
								if(userRealName == flowLogArr[0].userCode) { //是当前登录人
									//如果i等于0是最后一步流程数据
									if(i == 0) {
										//满足条件隐藏下一步操作人下拉框
										if(n.tastKey == "activitiEndTask") { //判断是否为审批最后一步
											//隐藏下一步操作人下拉框
											$('.next-operate-person-teach-tr').hide();
											if(n.deleteReason != "") { //审批结束
												noeMyhistory ="noe";
												//隐藏审批功能
												$('.last-step-div-teach').hide();
												//隐藏审批提交按钮功能
												$('.appro-btn-div').hide();
												middleStepHtml = '<div>' +
													'<div style="height: 150; ">' +
													'<div class="number-name-box">' +
													'<span class="number-box-span middle-step-order middle-a-index" >' + flowLogArr.length + '</span>' +
													'<span class="name-box-span middle-step-userName middle-a-index" >' + flowLogArr[0].userName + '</span>' +
													'<img src="../../resources/images/open/openFlow.png" class="order-img" />' +
													'</div>' +
													'</div>' +
													'<div class="middle-step-box-div">' +
													'<ul class="middle-step-box-ul">' +
													'<li style="height: 30px;">' +
													'<span  class="middle-step-taskName view-taskName-span"  style="float: left;">' + flowLogArr[0].operationState + '</span>' +
													'</li>' +
													'<li class="view-time-li middle-step-commentTime" >' + flowLogArr[0].commentTime + '</li>' +
													'<li class="operate-view-box-li">' +
													'<div class="operate-view-title-li">操作意见：</div>' +
													'<div class="operate-view-text-li middle-step-comment">' + flowLogArr[0].comment + '</div>' +
													'</li>' +
													'</ul>' +
													'</div>' +
													'</div>';
												$('.last-step-add-teach').append(middleStepHtml);
											} else { //审批没结束
												$('.last-step-div-teach').show();
												$('.appro-btn-div').show();
												$('.hid-tast-key').val(n.tastKey);
												//渲染审批步骤的数据
												//流程编号
												$('.last-step-order-teach').text(flowLogArr.length);
												//操作人名
												$('.last-step-operate-person-userName-teach').text(n.userName);
												//操作状态
												$('.last-step-operationState-teach').text(n.operationState);
												//停滞时间							
												$('.last-step-commentTime-teach').text(n.commentTime);
											}
										}else if(n.tastKey == "activitiStartTask"){
											//判断是否被退回，且从我的项目列表进入的
												if(noeMyhistory == ""){
													if(myhistory=='myProjectList'){
														$('.file-id').find('.del-file-p').show();
														$('.first-file-next-person-div').show();
														//隐藏初稿的上传下载按钮
														$('.first-draft-btn').show();
														//隐藏初稿提交按钮
														$('.plan-btn-flirst').show();
													}else{
														$('.last-step-div-teach').hide();
														if(i == 0) {
															noeMyhistory ="noe";
															middleStepHtml = '<div>' +
																'<div style="height: 150; ">' +
																'<div class="number-name-box">' +
																'<span class="number-box-span middle-step-order middle-a-index" >' + flowLogArr.length + '</span>' +
																'<span class="name-box-span middle-step-userName middle-a-index" >' + flowLogArr[0].userName + '</span>' +
																'<img src="../../resources/images/open/openFlow.png" class="order-img" />' +
																'</div>' +
																'</div>' +
																'<div class="middle-step-box-div">' +
																'<ul class="middle-step-box-ul">' +
																'<li style="height: 30px;">' +
																'<span  class="middle-step-taskName view-taskName-span"  style="float: left;">' + flowLogArr[0].operationState + '</span>' +
																'</li>' +
																'<li class="view-time-li middle-step-commentTime" >' + flowLogArr[0].commentTime + '</li>' +
																'<li class="operate-view-box-li">' +
																'<div class="operate-view-title-li">操作意见：</div>' +
																'<div class="operate-view-text-li middle-step-comment">' + flowLogArr[0].comment + '</div>' +
																'</li>' +
																'</ul>' +
																'</div>' +
																'</div>';
															$('.last-step-add-teach').append(middleStepHtml);
														}
													}
												}
										}else {
											$('.last-step-div-teach').show();
											$('.appro-btn-div').show();
											//渲染审批步骤的数据
											$('.last-step-order-teach').text(flowLogArr.length);
											//操作人名
											$('.last-step-operate-person-userName-teach').text(n.userName);
											//操作状态
											$('.last-step-operationState-teach').text(n.operationState);
											//停滞时间							
											$('.last-step-commentTime-teach').text(n.commentTime);
										}
									};
								} else { //不是当前登录人
									$('.last-step-div-teach').hide();
									$('.appro-btn-div').hide();
									if(i == 0) {
										noeMyhistory ="noe";
										middleStepHtml = '<div>' +
											'<div style="height: 150; ">' +
											'<div class="number-name-box">' +
											'<span class="number-box-span middle-step-order middle-a-index" >' + flowLogArr.length + '</span>' +
											'<span class="name-box-span middle-step-userName middle-a-index" >' + flowLogArr[0].userName + '</span>' +
											'<img src="../../resources/images/open/openFlow.png" class="order-img" />' +
											'</div>' +
											'</div>' +
											'<div class="middle-step-box-div">' +
											'<ul class="middle-step-box-ul">' +
											'<li style="height: 30px;">' +
											'<span  class="middle-step-taskName view-taskName-span"  style="float: left;">' + flowLogArr[0].operationState + '</span>' +
											'</li>' +
											'<li class="view-time-li middle-step-commentTime" >' + flowLogArr[0].commentTime + '</li>' +
											'<li class="operate-view-box-li">' +
											'<div class="operate-view-title-li">操作意见：</div>' +
											'<div class="operate-view-text-li middle-step-comment">' + flowLogArr[0].comment + '</div>' +
											'</li>' +
											'</ul>' +
											'</div>' +
											'</div>';
										$('.last-step-add-teach').append(middleStepHtml);
									}
								}
								//立项审批，教学方案审批  只能在“项目审批”菜单中进入详情进行审批操作。
								if(noeMyhistory == ""){
									if(myhistory!='teacherApprove'){
										$('.last-step-div-teach').hide();
										$('.appro-btn-div').hide();
										if(i == 0) {
											middleStepHtml = '<div>' +
												'<div style="height: 150; ">' +
												'<div class="number-name-box">' +
												'<span class="number-box-span middle-step-order middle-a-index" >' + flowLogArr.length + '</span>' +
												'<span class="name-box-span middle-step-userName middle-a-index" >' + flowLogArr[0].userName + '</span>' +
												'<img src="../../resources/images/open/openFlow.png" class="order-img" />' +
												'</div>' +
												'</div>' +
												'<div class="middle-step-box-div">' +
												'<ul class="middle-step-box-ul">' +
												'<li style="height: 30px;">' +
												'<span  class="middle-step-taskName view-taskName-span"  style="float: left;">' + flowLogArr[0].operationState + '</span>' +
												'</li>' +
												'<li class="view-time-li middle-step-commentTime" >' + flowLogArr[0].commentTime + '</li>' +
												'<li class="operate-view-box-li">' +
												'<div class="operate-view-title-li">操作意见：</div>' +
												'<div class="operate-view-text-li middle-step-comment">' + flowLogArr[0].comment + '</div>' +
												'</li>' +
												'</ul>' +
												'</div>' +
												'</div>';
											$('.last-step-add-teach').append(middleStepHtml);
										}
									}
								};
								
								//如果i等于length-1是流程的第一步
								if(i == flowLogArr.length - 1) {
									//流程编号
									$('.first-step-order-teach').text(1);
									//操作人名
									$('.first-step-operate-person-username-teach').text(n.userName);
									//当前审批节点名字
									$('.first-step-taskName-teach').text(n.operationState);
									//时间
									$('.first-step-commentTime-teach').text(n.commentTime);
								};
								//如果i不等于且不等于length-1，是流程的中间步骤
								if(i != 0 && i < flowLogArr.length - 1) {
									//流程序号
									var order = flowLogArr.length - i;
									middleStepHtml = '<div>' +
										'<div style="height: 150; ">' +
										'<div class="number-name-box">' +
										'<span class="number-box-span middle-step-order middle-a-index" >' + order + '</span>' +
										'<span class="name-box-span middle-step-userName middle-a-index" >' + n.userName + '</span>' +
										'<img src="../../resources/images/open/openFlow.png" class="order-img" />' +
										'</div>' +
										'</div>' +
										'<div class="middle-step-box-div">' +
										'<ul class="middle-step-box-ul">' +
										'<li style="height: 30px;">' +
										'<span  class="middle-step-taskName view-taskName-span"  style="float: left;">' + n.operationState + '</span>' +
										'</li>' +
										'<li class="view-time-li middle-step-commentTime" >' + n.commentTime + '</li>' +
										'<li class="operate-view-box-li">' +
										'<div class="operate-view-title-li">操作意见：</div>' +
										'<div class="operate-view-text-li middle-step-comment">' + n.comment + '</div>' +
										'</li>' +
										'</ul>' +
										'</div>' +
										'</div>';
									$('.last-step-add-teach').append(middleStepHtml);
								};
							});
							//----------------------------------------------------------------------------------------------------------------------------
							//判断流程是否结束
							if(flowLogArr[0].tastKey == "activitiEndTask" && flowLogArr[0].deleteReason != "") { //流程结束
								if(teachingSchemeFile.length > 1) { //存在终稿
									//显示终稿
									$('.last-draft').show();
									//隐藏终稿上传按钮
									$('.last-draft-btn').hide();
									//隐藏终稿提交按钮
									$('.plan-btn-last').hide();
									if(fileIdsArr.length > 0) {
										$.each(fileIdsArr, function(i, v) {
											$('.last-upload-time').text(v.createTimeString);
											if(v.fileType == 2) {
												teacherLi = '<p style="width:870px;height:40px;border:1px dashed #e6e6e6;line-height:40px;padding:0px 20px">' +
													'<input type="hidden" class="last-down-file-url" value="'+$yt_option.acl_path +'api/tAscPortraitInfo/download?isDownload=true&pkId=' + v.fileId + '">' +
													'<span class="file-name" style="margin-right: 50px;color:blue;cursor: pointer"><input type="hidden" class="file-span-id" value="' + v.pkId + '" >' + v.fileName + '</span>' +
													'<span class="del-file-p" style="float:right;cursor: pointer;display:none;"><img src="../../resources/images/icons/teach-plan-del.png" alt="" />删除</span>' +
													'<span class="last-down-load-file-index" style="float:right;cursor: pointer;"><img src="../../resources/images/icons/down-load-teach-plan.png" alt="" />下载</span>' +
													'<span style="float:right; display:none;"><img src="../../resources/images/icons/preview.png" alt="" />预览</span>' +
													'</p>';
												$('.last-file-id').html(teacherLi);
											}
										});
									}
								}
							} //判断六尺是否结束时流程已经判断完，不需要再判断流程没结束情况
						} //已经判断初终稿存在，不会出现流程不存在情况
					}
					$yt_baseElement.hideLoading();
				} else { //教学方案设计需求不存在
					//登录人是否为当前项目销售人
//					if(userRealName == projectSellName) { //是当前销售人
//						//显示教学方案需求填写表单
//						$('.teach-plan-table').show()
//					}
					$yt_baseElement.hideLoading();
				}
				//教学方案下一步操作人
				projectDetailsList.getNextOperatePersonTeach();
				$(".next-people-teach").niceSelect();
			}
		});

	},
	//收费标准日志
	moneyLog: function() {
		//收费标准日志
		var projectCode = $yt_common.GetQueryString('projectCode');
		$yt_baseElement.showLoading();
		$('.money-log-list-page').pageInfo({
			async: false,
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "project/getTraineeDetailsLogs", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post" 
			data: {
				projectCode:projectCode
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				$(".money-log-list-tbody").empty();
				var logList = $(".money-log-list-tbody");
				var logtr;
				if(data.flag == 0){
					if(data.data.rows.length>0){
						$.each(data.data.rows,function(i,v){
							logtr =  '<tr>' +
										'<td style="padding:5px;">' + v.createTime + '</td>' +
										'<td style="padding:5px;">' + v.createUser + '</td>' +
										'<td style="padding:5px;">' + v.traineeGroupName + '</td>' +
										'<td style="padding:5px;">' + v.logsDetails + '</td>' +
									'</tr>';
									logList.append(logtr);
						});
						$('.money-log-list-page').show();
					}else{
						logtr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="4" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
							logList.append(logtr);
							$('.money-log-list-page').hide();
					}
					/** 
					 * 显示编辑弹出框和显示顶部隐藏蒙层 
					 */
					$(".money-log").show();
					/** 
					 * 调用算取div显示位置方法 
					 */
					$yt_alert_Model.setFiexBoxHeight($(".money-log .alert-form"));
					$yt_alert_Model.getDivPosition($(".money-log"));
					/* 
					 * 调用支持拖拽的方法 
					 */
					$yt_model_drag.modelDragEvent($(".money-log .yt-edit-alert-title"));
					/** 
					 * 点击取消方法 
					 */
					$('.money-log .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
						//隐藏页面中自定义的表单内容  
						$(".money-log").hide();
						//隐藏蒙层  
						$("#pop-modle-alert").hide();
					});
					$yt_baseElement.hideLoading();
				}else{
					$yt_baseElement.hideLoading(function (){
						$yt_alert_Model.prompt("查询失败");
					});
				}
			}
		
		})
	
	},
	//教学方案审批下一步操作人
	getNextOperatePersonTeach: function() {
		if($('.teachings-scheme-level-info').text() == '部门级别') {
			var nextPersonList = projectDetailsList.getworkFlowOperateTeach('teachingSchemeDept');
		} else if($('.teachings-scheme-level-info').text() == '专家组') {
			var nextPersonList = projectDetailsList.getworkFlowOperateTeach('teachingSchemeExpert');
		} else if($('.teachings-scheme-level-info').text() == '院领导') {
			var nextPersonList = projectDetailsList.getworkFlowOperateTeach('teachingSchemeLeader');
		}
		if(nextPersonList != null) {
			$.each(nextPersonList, function(i, n) {
				$(".next-people-teach").append('<option value="' + n.userCode + '">' + n.userName + '</option>');
			});
		};
		$(".next-people-teach").niceSelect();
	},

	//教学方案设计需求保存&提交
	teachPlanDesignRequirements: function(dataStates) {
		var projectId = $yt_common.GetQueryString('pkId');
		var pkId = $(".teach-plan-table .pk-id").val();
		var traineeLevel = [];
		var estimatedTransactionPrice = $(".teach-plan-table .estimated-transaction-price").val();
		var timeReceipt = $(".teach-plan-table .time-receipt").val();
		var feedbackTime = $(".teach-plan-table .feedback-time").val();
		var schemeRequirement = [];
		var linkman = $(".teach-plan-table .linkman").val();
		var phone = $(".teach-plan-table .phone").val();
		var adDetails = $(".teach-plan-table .ad-details").val();
		var teachingsSchemeLevel = $(".teach-plan-table .teachings-scheme-level").val();
		$.each($(".trainee-level>input:checkbox:checked"), function(i, n) {
			traineeLevel.push($(n).val());
		})
		$.each($('.scheme-requirement>input:checkbox:checked'), function(i, n) {
			schemeRequirement.push($(n).val());
		})
		traineeLevel = traineeLevel.join(',');
		schemeRequirement = schemeRequirement.join(',');
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "project/addOrUpdateTeachingScheme", //ajax访问路径  
			data: {
				projectId: projectId,
				pkId: pkId,
				traineeLevel: traineeLevel,
				estimatedTransactionPrice: estimatedTransactionPrice,
				timeReceipt: timeReceipt,
				feedbackTime: feedbackTime,
				schemeRequirement: schemeRequirement,
				linkman: linkman,
				phone: phone,
				adDetails: adDetails,
				teachingsSchemeLevel: teachingsSchemeLevel,
				dataStates: dataStates

			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					if(dataStates == 0) {
						$yt_alert_Model.prompt("保存成功");
						projectDetailsList.getTeachPlanDesignRequirements();
					} else {
						$yt_alert_Model.prompt("提交成功");
						projectDetailsList.getTeachPlanDesignRequirements();
					}
				} else {
					if(dataStates == 0) {
						$yt_alert_Model.prompt("保存失败");
					} else {
						$yt_alert_Model.prompt("提交失败");
					}
				}
			}
		});
	},
	//项目主任首次操作时
	firstDraftByProjectDirector: function(fileType) {
		var projectId = $yt_common.GetQueryString('pkId');
		if($('.teachings-scheme-level-info').text() == '部门级别') {
			var businessCode = 'teachingSchemeDept';
		} else if($('.teachings-scheme-level-info').text() == '专家组') {
			var businessCode = 'teachingSchemeExpert';
		} else if($('.teachings-scheme-level-info').text() == '院领导') {
			var businessCode = 'teachingSchemeLeader';
		}
		var dealingWithPeople = $('.star-dealingWithPeople').val();
		var files = "";
		var filesArr = [];
		if(fileType == 1) { //初稿提交
			$(".file-id p").each(function(i, n) {
				fileName = $(n).find(".file-name").text();
				fileId = $(n).find(".file-name .file-span-id").val();
				var arrFile = {
					fileName: fileName,
					fileId: fileId
				}
				filesArr.push(arrFile);
			});
			dealingWithPeople = $(".first-file-next-person").val();
		} else {
			$(".last-file-id p").each(function(i, n) {
				fileName = $(n).find(".file-name").text();
				fileId = $(n).find(".file-name .file-span-id").val();
				var arrFile = {
					fileName: fileName,
					fileId: fileId
				}
				filesArr.push(arrFile);
			});
		}

		var files = JSON.stringify(filesArr);
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "project/addOrUpdateTeachingSchemeFile", //ajax访问路径  
			data: {
				projectId: projectId,
				fileType: fileType,
				files: files,
				businessCode: businessCode,
				dealingWithPeople: dealingWithPeople,
				opintion: "",
				processInstanceId:$('.hid-process-instance-id').val(),
				nextCode: "submited"

			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt("操作成功");
					window.location.href = "projectList.html";
					$(".first-file-next-person-div").hide();
				} else {
					$yt_alert_Model.prompt("操作失败");
				}
			}
		});
	},
	//获取下一步操作人
	getworkFlowOperateTeach: function(businessCode) {
		//获取页面隐藏的流程实例id
		var processInstanceId = $('.hid-process-instance-id').val();
		var list = [];
		var user;
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/workFlowOperate/getSubmitPageData",
			data: {
				businessCode: businessCode,
				processInstanceId: processInstanceId
			},
			async: false,
			success: function(data) {
				if (data.data != null) {
					$.each(data.data, function(i, n) {
						for(var k in n) {
							user = n[k];
						}
					});
				}
			}
		});
		return user;
	},
	//推送通知
	exportList: function() {
		var projectCode = $yt_common.GetQueryString("projectCode");
		var traineeIds = [];
		$.each($('.student-admin-tbody input:checked'), function(i, n) {
			traineeIds.push($(n).parents('tr').find('.trainee-id').val());
		});
		traineeIds = traineeIds.join(',');
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/trainee/addTraineeNation",
			async: true,
			data: {
				projectCode: projectCode,
				traineeIds: traineeIds
			},
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt("推送成功");
				} else {
					$yt_alert_Model.prompt("推送失败");
				}
			},
			error: function(data) {
				console.log(data.status);
			}
		});
	},	//流程日志转换格式
	getLogInfo: function(objName,obj1,obj2){
	var logTestArr = [];
	if(obj1!=null){
		for (var keyName in objName) {
			if(obj1[keyName]!=undefined && obj2[keyName]!=undefined && obj1[keyName]!=obj2[keyName]&&obj2[keyName]!='请选择'){
				logTestArr.push(objName[keyName]+"：“"+obj1[keyName]+"”修改为“"+obj2[keyName]+"”");
			}
		}
	}else{
		for (var keyName in objName) {
			logTestArr.push(objName[keyName]+"：“"+obj2[keyName]+"”");
		}
	}
	console.log(logTestArr.join('；')+('；'));
	return logTestArr.join('；')+('；')
	},
	//设置负责人
	classteacher:function(){
			$yt_baseElement.showLoading();
			treeAllPersonal = projectDetailsList.treeAllPersonal;
			//获取项目主任,班主任,项目助理下拉列表
			if(projectDetailsList.treeAllPersonal != null) {
				$.each(projectDetailsList.treeAllPersonal, function(i, n) {
					if(n.type == 3) {
						$(".project-director").append('<option value="' + n.textName + '" types="2" realName="' + n.text + '">' + n.text + '</option>');
						$(".teacher-head").append('<option value="' + n.textName + '" types="3" >' + n.text + '</option>');
						$(".project-assistant").append('<option value="' + n.textName + '" types="4" >' + n.text + '</option>');
					}
				});
			}
			$("select.project-director").niceSelect({
				search: true,
				backFunction: function(text) {  
			            //回调方法,可以执行模糊查询,也可自行添加操作  
			            $("select.project-director option").remove();  
			            if(text == "") {  
			                $("select.project-director").append('<option value="" types="2">请选择</option>');  
			            }
			          //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
			            $.each(projectDetailsList.treeAllPersonal, function(i, n) {  
			                if(n.text.indexOf(text) != -1) {
			                	if(n.type == 3) {
								$("select.project-director").append('<option value="' + n.textName + '" types="2" >' + n.text + '</option>');
							}
			                }  
			            });
			           }
				 });
				 $("select.teacher-head").niceSelect({
					search: true,
					backFunction: function(text) {  
				            //回调方法,可以执行模糊查询,也可自行添加操作  
				            $("select.teacher-head option").remove();  
				            if(text == "") {  
				                $("select.teacher-head").append('<option value="" types="3" >请选择</option>');  
				            }
				          //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
				            $.each(treeAllPersonal, function(i, n) {  
				                if(n.text.indexOf(text) != -1) {
				                	if(n.type == 3) {
									$("select.teacher-head").append('<option value="' + n.textName + '" types="3" >' + n.text + '</option>');
								}
				                }  
				            });
				           }
					 });
				  $("select.project-assistant").niceSelect({
						search: true,
						backFunction: function(text) {  
					            //回调方法,可以执行模糊查询,也可自行添加操作  
					            $("select.project-assistant option").remove();  
					            if(text == "") {  
					                $("select.project-assistant").append('<option value="" types="4" >请选择</option>');  
					            }
					          //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
					            $.each(treeAllPersonal, function(i, n) {  
					                if(n.text.indexOf(text) != -1) {
					                	if(n.type == 3) {
										$("select.project-assistant").append('<option value="' + n.textName + '" types="4" >' + n.text + '</option>');
									}
					                }  
					            });
					           }
						 });
				var num = Number($('tr.none-tr').index())
				//清空项目主任
				if($('select.project-director').length>1){
					var length = $('select.project-director').length;
					$.each($('select.project-director'), function(x,y) {
						if(x!=length-1){
							if($(y).parents('tr').find('.project-head')[0] == undefined) {
								$(y).parents('tr').remove();
							} else {
								$(y).parents('tr').next().find('td').eq(0).text($(this).parents('tr').find('.project-head').text());
								$(y).parents('tr').next().find('td').eq(0).addClass('project-head')
								$(y).parents('tr').remove();
							}
						}
					});
				}
				//清空班主任
				if($('select.teacher-head').length>1){
					var length = $('select.teacher-head').length;
					$.each($('select.teacher-head'), function(x,y) {
						if(x!=length-1){
							if($(y).parents('tr').find('.projectHeadmaster')[0] == undefined) {
								$(y).parents('tr').remove();
							} else {
								$(y).parents('tr').next().find('td').eq(0).text($(this).parents('tr').find('.projectHeadmaster').text());
								$(y).parents('tr').next().find('td').eq(0).addClass('projectHeadmaster')
								$(y).parents('tr').remove();
							}
						}
					});
				};
				//
				$('.none-tr').parents('tbody').find('tr').eq(2).find('select').val('');
				var name = projectDetailsList.getBeanById.projectName;
				var projectType = projectDetailsList.getBeanById.projectType;
				if(projectType==2){
					projectType = '委托'
				}else if(projectType==3){
					projectType = '选学'
				}else if(projectType==4){
					projectType = '调训'
				}
				var principalInf = projectDetailsList.getBeanById.projectHead;
				var principalArr = principalInf.split(",");
				var teacherHead = projectDetailsList.getBeanById.projectHeadmaster;
				var teacherHeadArr = teacherHead.split(",");
				$('.project-name').text(name);
				$('.project-type').text(projectType);
				var selectVal = "";
				$('.project-assistant').setSelectVal( projectDetailsList.getBeanById.projectAid);
				
				projectDetailsList.setPrincipal();
				$(".set-principal-alert").off().on('click', '.add-project-director', function() {
					$yt_baseElement.showLoading();
					addProjectHead();
					//获取项目主任,班主任,项目助理下拉列表
					if(projectDetailsList.treeAllPersonal != null) {
						$.each(projectDetailsList.treeAllPersonal, function(i, n) {
							if(n.type == 3) {
								$(".project-director").append('<option value="' + n.textName + '" types="2" realName="' + n.text + '" >' + n.text + '</option>');
							}
						});
					}
					$("select.project-director").niceSelect({
							search: true,
							backFunction: function(text) {  
						            //回调方法,可以执行模糊查询,也可自行添加操作  
						          $("select.project-director option").remove();  
						            if(text == "") {  
						               $("select.project-director").append('<option value="" types="2">请选择</option>');  
						            }
						          //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
						            $.each(treeAllPersonal, function(i, n) {  
						                if(n.text.indexOf(text) != -1) {
						                	if(n.type == 3) {
											$("select.project-director").append('<option value="' + n.textName + '" types="2" >' + n.text + '</option>');
										}
						                }  
						            });
						           }
							 });
							 $yt_baseElement.hideLoading()
				});
				//项目主任新增
				function addProjectHead(){
					$(".none-tr").before('<tr>' +
						'<td align="right"></td>' +
						'<td>' +
						'<div class="set-principal-alert-select">' +
						'<select class="yt-select project-director types" data-val="" style="width: 201px;" >' +
						'<option value="" types="2">请选择</option>' +
						'</select>' +
						'</div>' +
						'</td>' +
						'<td width="100px" style="padding-left: 10px;color: lightskyblue;cursor: pointer;">' +
						'<span class="add-project-director">新增</span>' +
						'</td>' +
						'</tr>');
					$(".none-tr").prev().prev().find('.add-project-director').text('删除');
					$(".none-tr").prev().prev().find('.add-project-director').attr('class', 'delete-project-director');
					$('.delete-project-director').off().click(function() {
						if($(this).parents('tr').find('.project-head')[0] == undefined) {
							$(this).parents('tr').remove();
						} else {
							$(this).parents('tr').next().find('td').eq(0).text($(this).parents('tr').find('.project-head').text());
							$(this).parents('tr').next().find('td').eq(0).addClass('project-head')
							$(this).parents('tr').remove();
						}
					})
				}
				$(".set-principal-alert").on('click', '.add-teacher-head', function() {
					$yt_baseElement.showLoading();
					$(this).text("");
					addTeacherHead();
					//获取项目主任,班主任,项目助理下拉列表
					if(projectDetailsList.treeAllPersonal != null) {
						$.each(projectDetailsList.treeAllPersonal, function(i, n) {
							if(n.type == 3) {
								$(".teacher-head").append('<option value="' + n.textName + '" types=3 >' + n.text + '</option>');
							}
						});
					}
					$("select.teacher-head").niceSelect({
						search: true,
						backFunction: function(text) {  
					            //回调方法,可以执行模糊查询,也可自行添加操作  
					            $("select.teacher-head option").remove();  
					            if(text == "") {  
					                $("select.teacher-head").append('<option value="" types=3>请选择</option>');  
					            }
					          //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
					            $.each(treeAllPersonal, function(i, n) {  
					                if(n.text.indexOf(text) != -1) {
					                	if(n.type == 3) {
										$("select.teacher-head").append('<option value="' + n.textName + '" types=3 >' + n.text + '</option>');
									}
					                }  
					            });
					           }
						 });
						 $yt_baseElement.hideLoading()
				});
				//班主任新增
				function addTeacherHead(){
					$(".project-assistant").parent().parent().parent().before('<tr>' +
						'<td align="right"></td>' +
						'<td>' +
						'<div class="set-principal-alert-select">' +
						'<select class="yt-select teacher-head types" data-val="" style="width: 201px;" >' +
						'<option value="" types=3>请选择</option>' +
						'</select>' +
						'</div>' +
						'</td>' +
						'<td width="100px" style="padding-left: 10px;color: lightskyblue;cursor: pointer;">' +
						'<span class="add-teacher-head">新增</span>' +
						'</td>' +
						'</tr>');
					$(".project-assistant").parent().parent().parent().prev().prev().find('.add-teacher-head').text('删除');
					$(".project-assistant").parent().parent().parent().prev().prev().find('.add-teacher-head').attr('class', 'delete-teacher-director');
					$('.delete-teacher-director').off().click(function() {
						if($(this).parents('tr').find('.projectHeadmaster')[0] == undefined) {
							$(this).parents('tr').remove();
						} else {
							$(this).parents('tr').next().find('td').eq(0).text($(this).parents('tr').find('.projectHeadmaster').text());
							$(this).parents('tr').next().find('td').eq(0).addClass('projectHeadmaster')
							$(this).parents('tr').remove();
						}
					})
				}
				$(".set-principal-alert .yt-model-sure-btn").off().on('click', function() {
					$(".set-principal-alert .yt-model-sure-btn").attr('disabled',true);
					$(".set-principal-alert .yt-model-canel-btn").attr('disabled',true);
					$yt_baseElement.showLoading()					
					projectDetailsList.setHeadAlert('nolocation');
				});
				$(".set-principal-alert .yt-model-canel-btn").off().on('click', function() {
					$(".set-principal-alert .yt-model-sure-btn").attr('disabled',true);
					$(".set-principal-alert .yt-model-canel-btn").attr('disabled',true);
					$yt_baseElement.showLoading()	
					projectDetailsList.setHeadAlert();
				});
				$yt_baseElement.hideLoading();
},
groupRatesName:{
	trainingExpenseRackRate:'培训费标准价',
	quarterageRackRate:'住宿费(/晚)',
	traineeRackRate:'课程费标准价',
	mealFeeRackRate:'餐费(/天)',
	trainingExpenseNegotiatedPrice:'培训费协议价',
	quarterageNegotiatedPrice:'住宿费(/晚)协议价',
	traineeNegotiatedPrice:'课程费协议价',
	mealFeeNegotiatedPrice:'餐费(/天)协议价',
	invoiceTypeVal:'发票类型',
	invoiceModelVal:'发票类型',
	orgName:'名称',
	taxNumber:'纳税人识别号',
	address:'地址',
	telephone:'电话',
	registeredBank:'开户行',
	account:'帐号',
},
traineeRatesName:{
	trainingExpenseRackRate:'培训费标准价',
	quarterageRackRate:'住宿费(/晚)标准价',
	traineeRackRate:'课程费标准价',
	mealFeeRackRate:'餐费(/天)标准价',
	trainingExpenseNegotiatedPrice:'培训费协议价',
	quarterageNegotiatedPrice:'住宿费(/晚)协议价',
	traineeNegotiatedPrice:'课程费协议价',
	mealFeeNegotiatedPrice:'餐费(/天)协议价'
},
traineeOldData:{},
traineeRatesOldData:{},
//单位收费标准原始数据
groupRatesOldData:[],
//收费标准日志格式
//obj1:old
//obj2:new
//objName:name
getMoneyLogInfo: function(objName,obj1,obj2){
	var logTestArr = [];
	if(obj1!=null){
		//修改
		for (var keyName in objName) {
			if(obj1[keyName]!=undefined && obj2[keyName]!=undefined && obj1[keyName]!=obj2[keyName]){
				if(keyName=='trainingExpenseRackRate'||keyName=='quarterageRackRate'||keyName=='traineeRackRate'||keyName=='mealFeeRackRate'||keyName=='trainingExpenseNegotiatedPrice'||keyName=='quarterageNegotiatedPrice'||keyName=='traineeNegotiatedPrice'||keyName=='mealFeeNegotiatedPrice'){
					var obj1money= $yt_baseElement.fmMoney(obj1[keyName],2)+'元';
					var obj2money = $yt_baseElement.fmMoney(obj2[keyName],2)+'元';
					logTestArr.push(objName[keyName]+"："+obj1money+"修改为"+obj2money);
				}else{
					logTestArr.push(objName[keyName]+"："+obj1[keyName]+"修改为"+obj2[keyName]);
				}
				
			}
		}
	}else{
		//新增
		for (var keyName in objName) {
			if(keyName=='trainingExpenseRackRate'||keyName=='quarterageRackRate'||keyName=='traineeRackRate'||keyName=='mealFeeRackRate'||keyName=='trainingExpenseNegotiatedPrice'||keyName=='quarterageNegotiatedPrice'||keyName=='traineeNegotiatedPrice'||keyName=='mealFeeNegotiatedPrice'){
					var obj2money = $yt_baseElement.fmMoney(obj2[keyName],2)+'元';
					logTestArr.push(objName[keyName]+"："+obj2money);
			}else{
				logTestArr.push(objName[keyName]+"："+obj2[keyName]);
			}
			
		}
	}
	console.log(logTestArr.join('；')+('；')=='；'?'':logTestArr.join('；')+('；'));
	return logTestArr.join('；')+('；')=='；'?'':logTestArr.join('；')+('；')
	}

}
$(function() {
	//初始化方法
	projectDetailsList.init();
});