var addBorrowList = {
	//初始化方法
	init: function() {
		//下拉列表刷新
		$("select").niceSelect();
		//获取下一步操作人
		var dealingWithPeople = addBorrowList.getListSelectDealingWithPeople();
		if(dealingWithPeople != null) {
			$.each(dealingWithPeople, function(i, n) {
				$("select.dealing-with-people").append('<option value="' + n.userCode + '">' + n.userName + '</option>');
			});
			$("select.dealing-with-people").niceSelect();
		};
		//点击保存
		$(".save-budget").click(function() {
			$(".bill-type").hide();
			$(".bill-num,.bill-name,.address-span,.telephone-span,.bank-span,.account-span").hide();
			$(".org-name,.tax-number,.address,.telephone,.registered-bank,.account").attr("validform","{isNull:false,blurFlag:true,msg:'不能为空！'}");
			var applicationInvoice = $(".application-invoice").val();
			var invoiceOrg = $(".invoice-org").val();
			var invoiceType = $(".invoice-type").val();
			$(".invoice-type-span").text("")
			if(applicationInvoice == ""){
				$yt_valid.validForm($(".valid-tab")); 
			}else if(invoiceOrg == ""){
				$yt_valid.validForm($(".valid-tab")); 
			}else if(invoiceOrg == "") {
				$yt_alert_Model.prompt("请填写单位名称");
			} else {
				//声明存储所属项目code的数组
				var projects = [];
				//声明参数
				var projectCode = "";
				//遍历列表得到code
				$('.project-tbody').find('td.projectCode').each(function() {
					projectCode = $(this).text();
					//存储code到数组内
					var projectsArr = {
						projectCode: projectCode
					};
					projects.push(projectsArr);
				});
				
				
				var dataStates = 1;
				var pkId = $yt_common.GetQueryString("pkId");
				addBorrowList.addBorrowListInfo(dataStates, projects,pkId);
			}
			$(".org-name,.tax-number,.address,.telephone,.registered-bank,.account").removeClass("valid-hint");
			$(".org-name,.tax-number,.address,.telephone,.registered-bank,.account").next().hide();
		});
		//发票切换类型
		$(".invoice-type").change(function(){
			$(".bill-type").show();
			if ($(".invoice-type").val() != "") {
				$(".check-radio").show();
				$("div.invoice-type").removeClass("valid-hint");
				$("div.invoice-type").next().hide();
				if($(".invoice-type").val() == 1){//普通发票
					$("#disagree").setRadioState("check");
					$(".check-radio").show();
					$(".bill-num").show();
					$(".bill-name").show();
					$(".address-span,.telephone-span,.bank-span,.account-span").hide();
					$(".org-name,.tax-number").attr("validform","{isNull:true,blurFlag:true,msg:'不能为空！'}");
					$(".address,.telephone,.registered-bank,.account").attr("validform","{isNull:false,blurFlag:true,msg:'不能为空！'}");
					$(".address,.telephone,.registered-bank,.account").removeClass("valid-hint");
					$(".address,.telephone,.registered-bank,.account").next().hide();
				}else{//增值税专用发票
					$(".check-radio").hide();
					$(".bill-name,.bill-num,.address-span,.telephone-span,.bank-span,.account-span").show();
					$(".org-name,.tax-number,.address,.telephone,.registered-bank,.account").attr("validform","{isNull:true,blurFlag:true,msg:'不能为空！'}");
					$(".address,.telephone,.registered-bank,.account").next().show();
				}
			}
		})
		//个人/事业单位
		$(".check-two").change(function(){//验证名称
			$(".bill-type").show();
			$(".bill-name").show();
			$(".bill-num").show();
			$(".bill-name").show();
			$(".bill-num").hide();
			$(".org-name").attr("validform","{isNull:true,blurFlag:true,msg:'不能为空！'}");
			$(".tax-number,.address,.telephone,.registered-bank,.account").attr("validform","{isNull:false,blurFlag:true,msg:'不能为空！'}");
		});
		//企业
		$(".check-three").change(function(){//验证名称和税号
			$(".bill-type").show();
			$(".bill-num").show();
			$(".address-span,.telephone-span,.bank-span,.account-span").hide();
			$(".org-name,.tax-number").attr("validform","{isNull:true,blurFlag:true,msg:'不能为空！'}");
			$(".address,.telephone,.registered-bank,.account").attr("validform","{isNull:false,blurFlag:true,msg:'不能为空！'}");
		});
		//点击提交
		$(".add-submit-budget").click(function() {
			$(".bill-type").show();
			$(".org-name,.tax-number,.address,.telephone,.registered-bank,.account").attr("validform","{isNull:true,blurFlag:true,msg:'不能为空！'}");
			var applicationInvoice = $(".application-invoice").val();
			var invoiceOrg = $(".invoice-org").val();
			var invoiceType = $(".invoice-type").val();
			var orgName = $(".org-name").val();
			var taxNumber = $(".tax-number").val();
			var address = $(".address").val();
			var telephone = $(".telephone").val();
			var registeredBank = $(".registered-bank").val();
			var account = $(".account").val();
			var bool = "false";
			$(".invoice-type-span").text("")
			if(invoiceType == 1 || invoiceType == ""){//普通发票要验证名称和税号
				$(".org-name,.tax-number").attr("validform","{isNull:true,blurFlag:true,msg:'不能为空！'}");
				$(".invoice-type-span").text("请选择发票类型");
				if(orgName == ""){
					$yt_valid.validForm($(".valid-tab")); 
				}else if(taxNumber == ""){
					$yt_valid.validForm($(".valid-tab")); 
				}else{
					bool = "true";
				}
			}
			if(invoiceType == 2){//名称、税号、地址、电话、开户行、账号
				$(".org-name,.tax-number,.address,.telephone,.registered-bank,.account").attr("validform","{isNull:true,blurFlag:true,msg:'不能为空！'}");
				if(applicationInvoice == ""){
					$yt_valid.validForm($(".valid-tab")); 
				}else if(invoiceOrg == ""){
					$yt_valid.validForm($(".valid-tab")); 
				}else if(orgName == ""){
					$yt_valid.validForm($(".valid-tab")); 
				}else if(taxNumber == ""){
					$yt_valid.validForm($(".valid-tab")); 
				}else if(address == ""){
					$yt_valid.validForm($(".valid-tab")); 
				}else if(telephone == ""){
					$yt_valid.validForm($(".valid-tab")); 
				}else if(registeredBank == ""){
					$yt_valid.validForm($(".valid-tab")); 
				}else if(account == ""){
					$yt_valid.validForm($(".valid-tab")); 
				}else if(applicationInvoice == ""){
					$yt_valid.validForm($(".valid-tab")); 
				}else{
					bool = "true";
				}
			}
			//显示验证提示框span
			$(".org-name,.tax-number,.address,.telephone,.registered-bank,.account").next().show();
			//下一步操作人
			var dealingWithPeople = $(".dealing-with-people").val();
			//发票类型
			var invoiceType = $('.invoiceType').val();
			//单位名称
			var invoiceOrg = $('.invoiceOrg').val();
			//判断
			if(dealingWithPeople == 0) {
				$yt_alert_Model.prompt("请选择下一步操作人");
			} else if(invoiceOrg == "") {
				$yt_alert_Model.prompt("请填写单位名称");
			} else if(invoiceType == 0) {
				$yt_alert_Model.prompt("请选择发票类型");
			} else {
				
			}
			if (bool =="true" && dealingWithPeople != 0 && $(".invoice-type").val() != "") {
				//声明存储所属项目code的数组
				var projects = [];
				//声明参数
				var projectCode = "";
				//遍历列表得到code
				$('.project-tbody').find('td.projectCode').each(function() {
					projectCode = $(this).text();
					//存储code到数组内
					var projectsArr = {
						projectCode: projectCode
					};
					projects.push(projectsArr);
				});
				var dataStates = 2;
				
				var pkId = $yt_common.GetQueryString("pkId");
				addBorrowList.addBorrowListInfo(dataStates, projects,pkId);
			}
			if($(".invoice-type").val() == 1){//普通发票
				$(".address,.telephone,.registered-bank,.account").removeClass("valid-hint");
				$(".address,.telephone,.registered-bank,.account").next().hide();
			}else{
				$(".address,.telephone,.registered-bank,.account").next().show();
			}
			
		});
		//取消按钮
		$(".btn-off").click(function(){
			var first = "borrow";
			window.location.href = "borrowList.html?first=" + first;
			//隐藏减免列表
			$('.reduce-list').hide();
			//显示发票列表
			$('.borrow-list').show();
			$yt_baseElement.showLoading();
		})
		//选择所属项目弹窗模糊查询
		$(".search-btn").on("click",function(){
			addBorrowList.getProjectInfo();
		})
		//点击返回
		$('.page-return-btn').on('click', function() {
			var first = "borrow";
			window.location.href = "borrowList.html?first=" + first;
			//隐藏减免列表
			$('.reduce-list').hide();
			//显示发票列表
			$('.borrow-list').show();
			$yt_baseElement.showLoading();
		});
		//复选框
		//全选  
		$(".check-all").change(function() {
			//判断自己是否被选中  
			if($(this).parent().hasClass("check")) {
				//设置反选  
				$(this).parents("table").find("tbody input[type='checkbox']").setCheckBoxState("uncheck");
				$(this).parents("table").find("tbody tr").removeClass('yt-table-active');
			} else {
				//调用设置选中方法,全选  
				$(this).parents("table").find("tbody input[type='checkbox']").setCheckBoxState("check");
				$(this).parents("table").find("tbody tr").addClass('yt-table-active');
			}

		});
		//修改全选按钮状态
		$(".select-teacher-table tbody,.addBorrow-tbody").on("change", "input[type='checkbox']", function() {
			if($(this).parents("table").find("tbody input[type='checkbox']").length != $(this).parents("table").find("tbody input[type='checkbox']:checked").length) {
				$(this).parents("table").find(".check-all").setCheckBoxState("uncheck");
			} else {
				$(this).parents("table").find(".check-all").setCheckBoxState("check");
			}
		});
		//点击弹窗选择所属项目
		$('.borrow-search-btn').click(function() {
			var me = this;
			addBorrowList.getProjectInfo();
			//显示选择所属项目弹出框
			$(".select-teacher-div").show();
			//查询选择所属项目列表
			//计算弹出框位置
			$yt_alert_Model.setFiexBoxHeight($(".select-teacher-div .yt-edit-alert-main"));
			$yt_alert_Model.getDivPosition($(".select-teacher-div"));
			$yt_model_drag.modelDragEvent($(".select-teacher-div .yt-edit-alert-title"));
			//模糊查询
			/*$('.teacher-search-img').click(function() {
				addBorrowList.getProjectInfo();
			});*/
			//选择所属项目渲染到列表
			$('.select-teacher-sure-btn').click(function() {
				//声明存储选中状态项目的数组
				var addBorrowListArr = [];
				//遍历选中状态行
				$('.addBorrow-tbody').find('label input[type="checkbox"]:checked').each(function() {
					//获取选中状态行的数据
					var addBorrowList = $(this).parent().parent().parent().data('list');
					//存储数据到外部数组
					addBorrowListArr.push(addBorrowList);
				});
				var htmlTbody = $('.project-tbody')
				var htmlTr = "";
				//遍历得到外部数组渲染到列表
				$.each(addBorrowListArr, function(i, v) {
					htmlTr += '<tr>' +
						'<td class="projectCode">' + v.projectCode + '</td>' +
						'<td style="text-align: left;">' + v.projectName + '</td>' +
						'<td class="project-type">' + (addBorrowList.projectTypeInfo(v.projectType)) + '</td>' +
						'<td>' + v.projectHead + '</td>' +
						'<td>' + v.startDate + '</td>' +
						'<td>' + v.endDate + '</td>' +
						'</tr>';
				});
				
				//影藏弹出窗
				$(".yt-edit-alert,#heard-nav-bak").hide();
				$("#pop-modle-alert").hide();
				htmlTbody.html(htmlTr);
				
			});
			//取消按钮
			$('.select-teacher-canel-btn').click(function() {
				$(".yt-edit-alert,#heard-nav-bak").hide();
				$("#pop-modle-alert").hide();
			});
		});
		
		//删除所属项目
		$(".delete-project-btn").off().click(function(){
			if($(".project-tbody").find(".yt-table-active").length == 0){
				$yt_alert_Model.prompt("请选择要删除的记录！");
			}else{
				$yt_alert_Model.alertOne({
					alertMsg: "数据删除将无法恢复，确认删除吗？", //提示信息  
					confirmFunction: function() { //点击确定按钮执行方法  
						$(".project-tbody").find(".yt-table-active").remove();
					},
				});
			}
		});
		
		$('.yt-table .project-tbody').off("click").on("click","tr",function(){
		    $(this).addClass('yt-table-active').siblings().removeClass('yt-table-active');
		});

	},
	//新增借用发票
	addBorrowListInfo: function(dataStates, projectArr,pkId) {
		var applicationInvoice = $('.application-invoice').val();
		var invoiceOrg = $('.invoice-org').val();
		var invoiceType = $('.invoice-type').val();
		var invoiceModel ="";
		if (invoiceType == 1) {
			invoiceModel = $('input[name="mould"]:checked').val();
		}
		var orgName = $('.org-name').val();
		var taxNumber = $('.tax-number').val();
		var address = $('.address').val();
		var telephone = $('.telephone').val();
		var registeredBank = $('.registered-bank').val();
		var account = $('.account').val();
		var invoiceReason = $('.invoice-reason').val();
		var dealingWithPeople = $(".dealing-with-people").val();
		var processInstanceId = $(".process-instance-id").val();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/invoicing/addOrUpdateBean", //ajax访问路径  
			async: false,
			data: {
				pkId: pkId,
				applicationInvoice: applicationInvoice,
				invoiceOrg: invoiceOrg,
				invoiceType: invoiceType,
				invoiceModel:invoiceModel,
				orgName: orgName,
				taxNumber: taxNumber,
				address: address,
				telephone: telephone,
				registeredBank: registeredBank,
				account: account,
				invoiceReason: invoiceReason,
				"projects": JSON.stringify(projectArr),
				dataStates: dataStates,
				businessCode: "invoicing",
				dealingWithPeople: dealingWithPeople,
				opintion: "",
				processInstanceId: processInstanceId,
				nextCode: "submited",
			},
			success: function(data) {
				if(data.flag == 0) {
					var first = "borrow";
					if(dataStates == 1) {
						$yt_alert_Model.prompt("新增成功");
						window.location.href = "borrowList.html?first=" + first;
					} else if(dataStates == 2) {
						$yt_alert_Model.prompt("提交成功");
						window.location.href = "borrowList.html?first=" + first;
					}
				} else {
					if(dataStates == 1) {
						$yt_alert_Model.prompt("新增失败");
					} else if(dataStates == 2) {
						$yt_alert_Model.prompt("提交失败");
					}
				}
			} //回调函数 匿名函数返回查询结果  

		})
	},
	//获取页面已有项目code
	projectCodeInfo: function() {
		$(".project-tbody").find('td.projectCode').each(function(i, v) {
			var lastProjectCode = $(this).text();
			$('.addBorrow-tbody').find('td.projectCode').each(function(i, v) {
				var firstProjectCode = $(this).text();
				if(firstProjectCode == lastProjectCode) {
					$(this).parents("tr").find("td input[type='checkbox']").setCheckBoxState("check");
				}
			});
		});

	},
	//项目类型设置
	projectTypeInfo: function(code) {
		if(code == 1) {
			return "计划";
		} else if(code == 2) {
			return "委托";
		} else if(code == 3) {
			return "选学";
		} else if(code == 4) {
			return"中组部调训";
		} else if(code == 5) {
			return"国资委调训";
		}else {
			return '';
		};
	},
	//获取所属项目列表
	getProjectInfo: function() {
		var me = this;
		var selectParam = $('.borrow-search-input').val();
		$('.borrow-page').pageInfo({
			async: false,
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "finance/invoicing/lookForAllProject", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam: selectParam,
				startDateStart:"",
				startDateEnd:"",
				endDateStart:"",
				endDateEnd:"",
				projectType:"",
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			before: function() {
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.addBorrow-tbody');
					var htmlTr = '';
					if(data.data.rows.length > 0) {
						htmlTbody.html("");
						$.each(data.data.rows, function(i, v) {
							htmlTr = '<tr>' +
								'<td style="text-align: center;">' + '<label class="check-label yt-checkbox select-teacher-checkbox"><input type="checkbox" name="test" class="select-teacher-pkId" value="' + v.projectCode + '"/></label>' + '</td>' +
								'<td style="text-align: center;" class="projectCode">' + v.projectCode + '</td>' +
								'<td style="text-align: left;">' + v.projectName + '</td>' +
								'<td style="text-align: center;" class="project-type">' + (me.projectTypeInfo(v.projectType)) + '</td>' +
								'<td style="text-align: left;">' + v.projectHead + '</td>' +
								'<td style="text-align: center;">' + v.startDate + '</td>' +
								'<td style="text-align: center;">' + v.endDate + '</td>' +
								'</tr>';
							htmlTr = $(htmlTr).data('list', v);
							htmlTbody.append(htmlTr);
						});
						addBorrowList.projectCodeInfo();

					} else {
						htmlTbody.html("");
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="7" align="center" style="border:0px;">' +
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
	//获取下一步操作人
	getListSelectDealingWithPeople: function() {
		var list = [];
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/workFlowOperate/getSubmitPageData",
			data: {
				businessCode: "invoicing",
				processInstanceId: "",
				parameters: "",
				versionNum: ""
			},
			async: false,
			success: function(data) {
				$.each(data.data, function(i, n) {
					for(var k in n) {
						list = n[k];
					}
				});
			}
		});
		return list;
	},
}
$(function() {
	//初始化方法
	addBorrowList.init();

});