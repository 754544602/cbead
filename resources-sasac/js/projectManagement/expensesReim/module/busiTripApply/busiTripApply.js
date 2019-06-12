var busiTripApply = {
	trObject:"",
	addressList:"",//全局的地区数据
	selUsersName:"",//用户名
	selUsersCode:"",//用户code
	usersInfoList:"",//出差人集合
	usersInfoJson:"",//出差人json
	riskExcMark:"../../../../../resources-sasac/images/common/war-red.png",//风险感叹号图片
	riskWarImg:"../../../../../resources-sasac/images/common/risk-war.png",//风险未通过图片红灯
	riskViaImg:"../../../../../resources-sasac/images/common/risk-via.png",//风险通过图片绿灯
	/**
	 * 
	 * 初始化方法
	 * 
	 */
	init: function() {
		//获取当前登录用户信息
     	sysCommon.getLoginUserInfo();
		//所有下拉列表调用初始化生成方法
		$("#busiTripApply select:not(.busi-addres-sel,.place)").niceSelect();
		//调用初始获取数据方法
		busiTripApply.getFunDatas();
		//调用初始化日期控件方法
		busiTripApply.bodyDateInit();
		//初始化数字输入框
     	$yt_baseElement.numberInput($(".yt-numberInput-box"));  
     	//调用页面功能按钮操作事件
     	busiTripApply.funBtnOperateEvent();
     	//调用获取上传附件名称方法
     	busiTripApply.getFileUploadName($("#trip-file"),$(".travel-plan-form-model .file-div .file-msg"));
     	//调用显示所属项目弹出框和出差人弹出框方法
     	busiTripApply.showFormListModelEvent();
     	//初始调用公用获取风险提示信息数据
     	sysCommon.getRiskData("busiTripApply");
     	//调用行程列表中的操作事件方法
		busiTripApply.tripListOperateEvent();
	},
	/**
	 * 
	 * 
	 * 初始获取数据方法
	 * 
	 */
	getFunDatas:function(){
		/**
		 * 
		 * 
		 * 出差类型:TRAVEL_TYPE
		 * 交通工具:VEHICIE_CODE
		 * 住宿地点:HOTEL_ADDRESS
		 * 费用类型:COST_TYPE
		 * 资金性质:AMOUNT_NATURE
		 * 
		 */
		$.ajax({
				type: "post",
				url:"basicconfig/dictInfo/getDictInfoByTypeCode",
				async: false,
				data:{
					dictTypeCode:"TRAVEL_TYPE,VEHICIE_CODE,HOTEL_ADDRESS,COST_TYPE,AMOUNT_NATURE"
				},
				success: function(data) {
					if(data.flag == 0){
						var optionText = '<option value="">请选择</option>';
						if(data.data.length > 0){
							$.each(data.data, function(i,n) {
							/**
							 * 获取出差类型数据
							 */
							if(n.dictTypeCode == "TRAVEL_TYPE"){
								optionText = '<option value="'+n.value+'">'+n.disvalue+'</option>';
								$("#busi-trip-type").append(optionText);
								$("#modelBusiType").append(optionText);
								$("#busi-trip-type,#modelBusiType").niceSelect();	
							  //出差类型选择事件
							  $("#busi-trip-type").on("change",function(){
							  	  //判断如果类型选中会议,显示出差文件中的风险灯
									if($(this).find("option:selected").text() == "培训"){
										$(".file-btn-div .risk-model").show();
									}else{
										//判断是否选择文件
										if($(".file-msg").text()!=""){
										   $(".file-btn-div .risk-model .risk-img").attr("src",busiTripApply.riskViaImg);
										}else{
										   $(".file-btn-div .risk-model .risk-img").attr("src",busiTripApply.riskExcMark);
										}
										//隐藏风险灯
										$(".file-btn-div .risk-model").hide();
									}
							  });
							}
							/**
							 * 
							 * 获取交通工具数据
							 * 
							 */
							if(n.dictTypeCode == "VEHICIE_CODE"){
								optionText = '<option value="'+n.value+'">'+n.disvalue+'</option>';
								$(".vehicle-sel").append(optionText);
								$(".vehicle-sel").niceSelect();
								 /**
							      * 
							      * 费用明细弹出框交通费,交通工具选中事件
							      * 
							      */
							    $(".vehicle-sel").on("change",function(){
									var selVal = $(this).val();
									//调用公用方法根据一级交通工具获取二级交通工具
									sysCommon.vechicleChildData(selVal);
								});
							}
							
							/**
							 * 
							 * 获取费用类型数据
							 * 
							 */
							if(n.dictTypeCode == "COST_TYPE"){
								optionText = '<option value="'+n.value+'">'+n.disvalue+'</option>';
								$("#cost-type").append(optionText);
								$("#cost-type").niceSelect();
								//费用类型切换事件
								$("#cost-type").on("change",function(){
						    		if($(this).val() != ""){
						    			$(this).parent().find(".risk-img").attr("src",busiTripApply.riskViaImg);
						    		}else{
						    			$(this).parent().find(".risk-img").attr("src",busiTripApply.riskWarImg);
						    		}
						    	});
							}
							/**
							 * 
							 * 资金性质获取数据
							 * 
							 */
							if(n.dictTypeCode == "AMOUNT_NATURE"){
								optionText = '<option value="'+n.value+'">'+n.disvalue+'</option>';
							    $("#moneyQuality").append(optionText);
								 $("#moneyQuality").niceSelect();	
								//资金性质选择事件
								$("#moneyQuality").on("change",function(){
								  	  //调用获取所属项目列表方法
									  busiTripApply.getProjectList($("#keywordInpu").val(),$(this).val());
								});
							}
							});
						}
					}
				}
			});
		/**
		 * 
		 * 调用公用方法,获取差旅费报销明细填写,城市交通费,住宿费中的出差人下拉列表
		 * 
		 */
		//sysCommon.getBusiTripUsersSelData();
		/**
		 * 调用获取流程审批数据方法
		 */
		sysCommon.getApproveFlowData("SZ_TRAVEL_APP");
		/**
		 * 
		 * 
		 * 获取差旅费住宿费住宿地点数据
		 * 
		 */
		$.ajax({
			type: "get",
			url:$yt_option.websit_path+'resources-sasac/js/system/expensesReim/module/reimApply/regionList.json',
			async: false,
			success: function(data) {
				var  dataList = data;
				busiTripApply.addressList = data ;
			}
		});
		//调用遍历地区数据方法
		busiTripApply.getAddressList();
	},
	/**
	 * 
	 * 
	 * 获取住宿费地区
	 * 
	 */
	getAddressList:function(){
		//遍历省份
        $.each(busiTripApply.addressList, function(i, n) {
        	//省
        	if(n.regionLevel == "PROVINCE"){
        		$("#hotelParentAddress").append('<option value="' + n.regionCode + '" data-level="'+n.regionLevel+'" >' + n.regionName + '</option>');  
        	}
        }); 
        $("#hotelParentAddress").niceSelect();
		/**
		 * 
		 * 省份选择操作事件
		 * 
		 */
		$("#hotelParentAddress").on("change",function(){
			var thisSel = $(this);
			$("#hotelTwoAddres,#hotelChildAddres").html('').append('<option value="">请选择</option>');
			//调用查询地区子级方法
			busiTripApply.hotelAddressChild(thisSel.val(),"CITY");
		});
		/**
		 * 
		 * 市选择操作事件
		 * 
		 */
		$("#hotelTwoAddres").on("change",function(){
			var thisSel = $(this);
			$("#hotelChildAddres").html('').append('<option value="">请选择</option>');
			//调用查询地区子级方法
			busiTripApply.hotelAddressChild(thisSel.val(),"AREA");
		});
		
		//调用行程表单出差地点事件
		busiTripApply.getPlanBusiAddress($("#modelBusiAddres"));
	},
	/**
	 * 行程表单出差地点事件
	 */
	getPlanBusiAddress:function(labelObj){
		/**
		 * 
		 * 行程表单中出差地点
		 * 
		 */
		 //4.初始化调用插件刷新方法  
	    $(labelObj).niceSelect({  
	        search: true,  
	        backFunction: function(text) {  
	            //回调方法,可以执行模糊查询,也可自行添加操作  
	            $(labelObj).find("option").remove();  
	             var opt = '';
                //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
                opt+='<option   disabled="disabled">支持模糊搜索省/市/区</option>';
	            if(text == "") {  
		            $.each(busiTripApply.addressList, function(i, n) {  
			        	 //省
			        	if(n.regionLevel == "PROVINCE"){
			        		//行程中的出差地点
			        		opt += '<option value="' + n.regionCode + '" data-level="'+n.regionLevel+'" data-name="'+n.regionName+'">' + n.regionName + '</option>';
			        	}
		            });  
	            }else{
	            	 //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
		            $.each(busiTripApply.addressList, function(i, n) {  
		            	//名称模糊查询
		                if(n.regionName.indexOf(text) != -1) {  
		                	n.regionMergerName=n.regionMergerName.substr(3);
		                	opt += '<option value="' + n.regionCode + '" data-level="'+n.regionLevel+'" data-name="'+n.regionName+'">' + n.regionName + '/'+n.regionMergerName+'</option>';
		                } 
		                //拼音模糊查询
		                if(n.regionNamePinYin.indexOf(text) != -1) {  
		                	n.regionMergerName=n.regionMergerName.substr(3);
		                	opt += '<option value="' + n.regionCode + '" data-level="'+n.regionLevel+'" data-name="'+n.regionName+'">' + n.regionName + '/'+n.regionMergerName+'</option>';
		                }  
		            });  
	            }
	            $(labelObj).append(opt);
	        }  
	    }); 
	    
	},
	/**
	 * 住宿费,住宿地点子级获取数据
	 * @param {Object} addressCode  地区code
	 * @param {Object} addressLevel 地区级别
	 */
	hotelAddressChild:function(addressCode,addressLevel){
		$.each(busiTripApply.addressList, function(i, n) {
        	if(n.parentCode == addressCode){
        		//市
				if(addressLevel == "CITY"){
					$("#hotelTwoAddres").append('<option value="' + n.regionCode + '">' + n.regionName + '</option>');
				}
				//区
				if(addressLevel == "AREA"){
					 $("#hotelChildAddres").append('<option value="' + n.regionCode + '">' + n.regionName + '</option>');
				}
        	}
        }); 
        $("#hotelTwoAddres,#hotelChildAddres").niceSelect();
        //调用设置住宿费子级无数据禁用
        busiTripApply.hotelChildDisa(addressLevel);
	},
	/**
	 * 设置住宿费子级无数据禁用
	 * @param {Object} addressLevel 地区级别
	 */
	hotelChildDisa:function(addressLevel){
		if(addressLevel == "CITY"){
        	//判断二级和三级是否有值,无则禁用
            var disaFlag = true;
            if($("#hotelTwoAddres option").length == 1){
            	$("#hotelTwoAddres,#hotelChildAddres").prop("disabled","disabled");
            	//删除验证的自定义属性
            	$("#hotelTwoAddres,#hotelChildAddres").removeAttr("validform");
            	//调用清除验证信息方法
            	sysCommon.clearValidInfo($("div.hotel-child-addres,div.hotel-two-addres,#hotelTwoAddres,#hotelChildAddres"));
            }else{
            	$("#hotelTwoAddres,#hotelChildAddres").prop("disabled","");
            	//添加验证的自定义属性
            	$("#hotelTwoAddres").attr("validform","{isNull:true,changeFlag:true,msg:'请选择市'}");
            	$("#hotelChildAddres").attr("validform","{isNull:true,changeFlag:true,msg:'请选择区'}");
            	disaFlag = false;
            }
            $(".hotel-two-addres,.hotel-child-addres").niceSelect();
            if(disaFlag){
            	$("div.hotel-child-addres,div.hotel-two-addres").css("background-color","#D0D0D0");
            }
        }else if(addressLevel == "AREA"){
        	//判断二级和三级是否有值,无则禁用
            var disaFlag = true;
            if($("#hotelChildAddres option").length == 1){
            	$("#hotelChildAddres").prop("disabled","disabled");
            }else{
            	$("#hotelChildAddres").prop("disabled","");
            	disaFlag = false;
            }
            $("#hotelChildAddres").niceSelect();
            if(disaFlag){
            	$("div.hotel-child-addres").css("background-color","#D0D0D0");
            }
        }
	},
	/**
	 * 获取所属项目信息列表
	 * @param {Object} keyword  关键字
	 * @param {Object} moneyQuality 资金性质
	 */
	getProjectList:function(keyword,moneyQuality){
		//所属预算项目弹出框列表数据
		var fromPrjTbody = $("#fromPrjModel .appro-list-model tbody");
		$('.prj-page').pageInfo({
			pageIndex: 1,
			pageNum: 10, //每页显示条数  
			pageSize: 2, //显示...的规律  
			url: $yt_option.websit_path+"resources-sasac/js/testJsonData/projectData.json", //ajax访问路径  
			type: "get", //ajax访问方式 默认 "post"
			async: false, //ajax 访问类型 默认 true 异步,false同步 
			data:{
				keyword:keyword,
				moneyQuality:moneyQuality
			},
			objName: 'data',
			success: function(data) {
				fromPrjTbody.empty();
				if(data.flag == 0){
					var prjStr = "";
					if(data.data.rows.length > 0){
						//显示分页
					  	$('.prj-page').show();
						$.each(data.data.rows,function(i,n){
							prjStr = '<tr>'
						       + '<td>'+n.prjNum+'<input type="hidden" class="hid-prj-id" value="'+n.prjId+'"/>'
						       + '<input type="hidden" class="hid-dept" value="'+n.deptSource+'"/>'
						       +'</td>'
						       + '<td>'+n.prjName+'</td>'
						       + '<td style="text-align: right;">'+(n.budgetPrice == "" ? "--" :$yt_baseElement.fmMoney(n.budgetPrice))+'</td>'
						       + '<td style="text-align: right;">'+(n.availablePrice == "" ? "--" :$yt_baseElement.fmMoney(n.availablePrice))+'</td>'
						       + '</tr>';
						    fromPrjTbody.append(prjStr);
						});
					}else{
					  //隐藏分页
					  $('.prj-page').hide();
					  var noTr = '<tr class="model-no-data-tr"><td colspan="4"><div class="no-data"><img src="../../../../../resources-sasac/images/common/no-data.png" alt=""></div></td></tr>';
					  fromPrjTbody.append(noTr);
					}
				}
			} //回调函数 匿名函数返回查询结果  
		});
	},
	/**
	 * 获取出差人信息
	 * @param {Object} keyword
	 */
	getBusiTripUsersList:function(keyword){
		$.ajax({
			type:"post",
			url: 'user/userInfo/getAllUserInfoToPage', //ajax访问路径  
			async:true,
			data:{
				params:keyword,
				pageIndex: 1,
				pageNum: 99999//每页显示条数  
			},
			success:function(data){
				if(data.flag == 0){
					//先清空出差人下拉列表中的数据
					$("#busiUserInfo ul").empty();
					var liStr = "";
					if(data.data.rows.length > 0){
						$.each(data.data.rows, function(i,n) {
							liStr = $('<li>'+n.userName+'/'+n.deptName+'</li>');
							//存储当前出差人的数据
							liStr.data("userData",n);
							$("#busiUserInfo ul").append(liStr);
						});
						//判断出差人隐藏的code值是否有值
						if($("#modelUserCodes").val() !=""){
							var usersCodes = $("#modelUserCodes").val().split(",");
							$("#busiUserInfo ul li").each(function(i,t){
								$.each(usersCodes, function(i,l) {
									if($(t).data("userData").userItcode == l){
										$(t).addClass("tr-check");
									}
								});
							});
						}
						//调用弹出框中操作事件方法
						busiTripApply.busiTripUserModelEvent($("#modelBusiUser"),$("#busiPlanEditModel .auto-font"),$(".model-user-num-show"),1);
					}else{
						$("#busiUserInfo ul").append('<li style="text-align: center;">暂无数据</li>');
					}
				}
			}
		});
		
		//获取出差人tbody对象
		/*var userTbody = $("#busiTripUserModel .user-list table tbody");
		$('.user-list-page').pageInfo({
			pageIndex: 1,
			pageNum: 5, //每页显示条数  
			pageSize: 2, //显示...的规律  
			url: 'user/userInfo/getAllUserInfoToPage', //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"
			async: false, //ajax 访问类型 默认 true 异步,false同步 
			data:{
				params:keyword
			},
			objName: 'data',
			success: function(data) {
				userTbody.empty();
				if(data.flag == 0){
					var usersStr = "";
					if(data.data.rows.length > 0){
						//显示分页
					  	$('.user-list-page').show();
						$.each(data.data.rows,function(i,n){
							usersStr = '<tr>'
						       + '<td>'+n.userName+'<input type="hidden" class="hid-user-code" value="'+n.userItcode+'"/>'
						       +'</td>'
						       + '<td>'+(n.deptName == "" ? "--" : n.deptName )+'</td>'
						       + '<td>'+(n.jobName == "" ?"--":n.jobName)+'</td>'
						       + '<td>'+(n.jobLevelName == "" ? "--" :n.jobLevelName)+'</td>'
						       + '</tr>';
						    userTbody.append(usersStr);
						});
					}else{
					  //隐藏分页
					  $('.user-list-page').hide();
					  var noTr = '<tr class="model-no-data-tr"><td colspan="4"><div class="no-data"><img src="../../../../../resources-sasac/images/common/no-data.png" alt=""></div></td></tr>';
					  userTbody.append(noTr);
					}
				}
			} //回调函数 匿名函数返回查询结果  
		});*/
	},
	/**
	 * 
	 * 
	 * 页面功能按钮操作事件
	 * 
	 * 
	 */
    funBtnOperateEvent:function(){
		/**
		 * 
		 * 点击费用申请新增按钮操作事件
		 * 
		 */
		$("#add-cost-apply-btn").off().on("click",function(){
			//调用给差旅明细弹出框中出差人赋值的方法
			busiTripApply.getModelUsersInfo();
			//调用显示费用申请弹出框方法
			busiTripApply.showCostDetailModel();
			//调用获取出差地点方法
			busiTripApply.getPlanBusiAddress($("#fromcity"));
			busiTripApply.getPlanBusiAddress($("#tocity"));
		});
		/**
		 * 
		 * 点击底部提交保存按钮
		 * 
		 */
		$("#approve-submit-btn,#apply-save-btn").off().on("click",function(){
			var thisBtnObj = $(this);
			//按钮标识0提交1保存
			var btnFlag;
			//接口访问路径
			var ajaxUrl = ""
			if($(this).hasClass("busi-sub-btn")){
				btnFlag = 0;
				ajaxUrl = "sz/travelApp/submitTravelAppInfo";
			}
			if($(this).hasClass("busi-save-btn")){
				btnFlag = 1;
				ajaxUrl = "sz/travelApp/saveTraveAppInfoToDrafts";
			}
			//调用验证方法,验证行程计划表单
			var validFlag = $yt_valid.validForm($(".base-info-form-modle"));
			var validFlowFlag = $yt_valid.validForm($(".flow-approve-model"));
			if(validFlag && validFlowFlag){
				//调用提交方法提交表单数据
		        var busiTripDatas = busiTripApply.getSubmitSaveDatas();	
		        $.ajax({
					type: "post",
					url: ajaxUrl,
					async: false,
					data:busiTripDatas,
					success: function(data) {
						if(data.flag == 0){
							//操作成功按钮加禁用效果
							//$(thisBtnObj).attr('disabled',true);
							//操作成功,调用清空页面数据方法
							busiTripApply.clearPageData();
						}else{
							//操作失败解除禁用效果
							//$(thisBtnObj).attr('disabled',false);
						}
						$yt_alert_Model.prompt(data.message,2000);  
					}
				});
			}else{
				//调用设置滚动条显示位置方法
				sysCommon.pageToScroll($(".base-info-form-modle .valid-font"));
			}
		});
    },
    /**
     * 
     * 
     * 获取提交保存的数据
     * 
     * 
     */
    getSubmitSaveDatas:function(){
    	//获取行程计划数据
    	var busiTripPlanList = [];
		var travelAppTripPlanJson = "";
		if($(".travel-list-tab-model table tbody tr:not(.not-date-tr)").length > 0){
			$(".travel-list-tab-model table tbody tr").each(function (i,n){
				busiTripPlanList.push($(this).getDatas());
			});
			if(busiTripPlanList.length>0){
				travelAppTripPlanJson = JSON.stringify(busiTripPlanList);
			}
		}
    	//获取城市间交通费列表数据
    	var costCarfareList = [];
		var costCarfareJson = "";
		var cityDatas;
		if($("#traffic-list-info tbody tr:not(.total-last-tr)").length > 0){
			$("#traffic-list-info tbody tr:not(.total-last-tr)").each(function (i,n){
				cityDatas = $(this).getDatas();
				//费用格式化
				cityDatas.crafare = $yt_baseElement.rmoney(cityDatas.crafare);
				//交通工具做处理,判断子级交通工具是否有值
				if($(this).find(".hid-child-code").val() == "null" || $(this).find(".hid-child-code").val() == ""){
					cityDatas.vehicle = "."+$(this).find(".hid-vehicle").val()+".";
				}else{
					cityDatas.vehicle = "."+$(this).find(".hid-vehicle").val()+"."+$(this).find(".hid-child-code").val()+".";
				}
				costCarfareList.push(cityDatas);
			});
			if(costCarfareList.length>0){
				costCarfareJson = JSON.stringify(costCarfareList);
			}
		}
		//获取住宿费列表数据
    	var costHotelList = [];
		var costHotelJson = "";
		var hotelDatas;
		if($("#hotel-list-info tbody tr:not(.total-last-tr)").length > 0){
			$("#hotel-list-info tbody tr:not(.total-last-tr)").each(function (i,n){
				hotelDatas = $(this).getDatas();
				hotelDatas.hotelExpense = $yt_baseElement.rmoney(hotelDatas.hotelExpense);
				costHotelList.push(hotelDatas);
			});
			if(costHotelList.length>0){
				costHotelJson = JSON.stringify(costHotelList);
			}
		}
		//获取其他列表数据
    	var costOtherList = [];
		var costOtherJson = "";
		var otherDatas;
		if($("#other-list-info tbody tr:not(.total-last-tr)").length > 0){
			$("#other-list-info tbody tr:not(.total-last-tr)").each(function (i,n){
				otherDatas = $(this).getDatas();
				otherDatas.reimAmount = $yt_baseElement.rmoney(otherDatas.reimAmount);
				costOtherList.push(otherDatas);
			});
			if(costOtherList.length>0){
				costOtherJson = JSON.stringify(costOtherList);
			}
		}
		//获取补助列表数据
    	var costSubsidyList = [];
		var costSubsidyJson = "";
		if($("#subsidy-list-info tbody tr:not(.total-last-tr)").length > 0){
			$("#subsidy-list-info tbody tr:not(.total-last-tr)").each(function (i,n){
				costSubsidyList.push($(this).getDatas());
			});
			if(costSubsidyList.length>0){
				costSubsidyJson = JSON.stringify(costSubsidyList);
			}
		}
    	//获取基础信息
    	return{
    		travelAppId:'',//出差申请表id
    		travelAppNum:'',//单号
    		travelAppName:$("#out-reason").val(),//出差事由
    		planGoTime:$("#start-time").val(),//计划出发日期
    		planReturnTime:$("#end-time").val(),//计划返回日期
    		busiTripDays:$("#out-day-num").text(),//出差天数
    		prjId:$("#prjId").val(),//所属项目ID
			applicantUser:$yt_common.user_info.userName,//申请人code
			parameters:"",//JSON格式字符串
			dealingWithPeople:$("#approve-users").val(),//下一步操作人code
			opintion:$("#operate-msg").val(),//审批意见
			processInstanceId:"",//流程实例ID, 
			nextCode:$("#operate-flow").val(),//操作流程code
			totalAmount:($("#applySumMoney").text() == "0.00" ? "" : $yt_baseElement.rmoney($("#applySumMoney").text())),//合计金额
			travelAppTripPlanJson:travelAppTripPlanJson,//出差申请行程计划json 
			costCarfareJson:costCarfareJson,//城市间交通费json
			costHotelJson:costHotelJson,//住宿费json
			costOtherJson:costOtherJson,//其他费用json
			costSubsidyJson:costSubsidyJson//补助明细json
    	}
    	
    },
    /**
     * 
     * 
     * 提交保存成功后清空页面数据
     * 
     */
    clearPageData:function(){
    	/**
    	 * 清空基础信息，和行程计划表单数据
    	 */
    	$("#busiTripFormModel input:not(.checkbox-inpu,.hid-risk-code)").val('');
    	//显示自动计算字样
    	$(".auto-font").show();
    	$(".auto-font").next().hide();
    	//清空出差天数,出差人数
    	$("#out-day-num,.users-num").text("0");
    	$("#busiTripFormModel select option:eq(0)").attr("selected","selected");
    	$("#busiTripFormModel select").niceSelect();
    	//文件名称
    	$(".file-msg").text("");
    	//部门来源
    	$("#dept-pps-from").text("--");
    	//清空复选框选中
    	$("#busiTripFormModel label.check-label").removeClass("check");
    	//改变风险灯为默认感叹号
    	$("#busiTripFormModel .risk-img").attr("src",busiTripApply.riskExcMark);
    	//隐藏文件风险灯
    	$("#fileId").next(".risk-model").hide();
    	/**
    	 * 清空行程列表
    	 */
    	$(".travel-list-tab-model table tbody").empty();
		 var noDataTr = '<tr class="not-date-tr">'
	   	   			  + '<td colspan="9">'
	   	   			  + '<div class="no-data">'
	   	   			  + '<img src="../../../../../resources-sasac/images/common/no-data.png" alt="">'
	   	   			  + '</div>'
	   	   			  + '</td>'
				  	  + '</tr>';	    		
	   	 $(".travel-list-tab-model table tbody").append(noDataTr);
	   	 //隐藏费用申请区域和流程审批区域
	   	 $(".cost-apply-model,.flow-approve-model").hide();
    	//清空费用申请中表格数据
    	$(".traffic-cost-model table tbody,.hotel-list-model table tbody,.other-cost-model table tbody,.subsidy-model table tbody").empty();
    	//改变费用申请区域中风险灯
    	$(".cost-apply-model .risk-img").attr("src",busiTripApply.riskExcMark);
    	//调用计算申请总金额方法
    	sysCommon.updateApplyMeonySum();
    	//人民币大写
    	$("#applyMoneyLower").text("--");
    	/**
    	 * 清空流程审批区域
    	 */
    	$(".flow-approve-model input,.flow-approve-model textarea").val('');
    	$(".flow-approve-model select").each(function(i,n){
    		$(n).find("option:eq(0)").attr("selected","selected");
    	});
    	$(".flow-approve-model select").niceSelect();
    },
	
	/**
	 * 
	 * 
	 * 显示所属项目弹出框和出差人弹出框事件
	 * 
	 * 
	 */
	showFormListModelEvent:function(){
		/**
		 * 点击所属项目输入框
		 */
		$("#fromPrjInpu").off().on("click",function(){
	    	//获取弹出框对象
			var fromPrjModel = $("#fromPrjModel");
			//调用获取所属项目列表方法
			busiTripApply.getProjectList($("#keywordInpu").val(),$("#moneyQuality").val());
			//调用显示弹出框方法
			sysCommon.showModel(fromPrjModel);
			//调用弹出框中操作事件方法
			busiTripApply.projectListModelEvent();
		});
	},
	/**
	 * 
	 * 所属项目弹出框操作事件
	 * 
	 */
	projectListModelEvent:function(){
		//获取弹出框对象
		var fromPrjModel = $("#fromPrjModel");
		/**
		 * 查询按钮点击事件
		 */
		$("#aproSearchBtn").off().on("click",function(){
			//调用获取所属项目列表方法
			busiTripApply.getProjectList($("#keywordInpu").val(),$("#moneyQuality").val());
		});
		/**
		 * 重置按钮点击事件
		 */
		$("#aproRestBtn").off().on("click",function(){
			//调用关闭清空项目弹出框方法
			busiTripApply.closeProjectModel();
			//调用获取所属项目列表方法
			busiTripApply.getProjectList($("#keywordInpu").val(),$("#moneyQuality").val());
		});
		/**
		 * 单选一行数据
		 */
		$("#fromPrjModel tbody").on('click', 'tr', function() {
			$('#busiTripTab tbody tr').removeClass("yt-table-active");
			$(this).addClass("yt-table-active");
		});
		//列表数据双击
		$("#fromPrjModel tbody:not(.page-info table tbody)").on('dblclick', 'tr', function() {
			$("#fromPrjInpu").val($(this).find("td:eq(1)").text());
			//赋值项目ID
			$("#prjId").val($(this).find(".hid-prj-id").val());
			//部门来源
			$("#dept-pps-from").text($(this).find(".hid-dept").val() == "" ? "--":$(this).find(".hid-dept").val());
			//改变风险灯为绿灯
			$("#fromPrjInpu").parent().find(".risk-img").attr("src",busiTripApply.riskViaImg);
			//调用关闭清空项目弹出框方法
			busiTripApply.closeProjectModel();
			//调用清空验证信息的方法
			sysCommon.clearValidInfo($("#fromPrjInpu"));
		});
		/**
		 * 确定按钮点击事件
		 */
		$("#aproSureBtn").off().on("click",function(){
			var selTr = $("#fromPrjModel tbody tr.yt-table-active");
			if(selTr != "" && selTr.length>0){
				$("#fromPrjInpu").val(selTr.find("td:eq(1)").text());
				//赋值项目ID
				$("#prjId").val(selTr.find(".hid-prj-id").val());
				//部门来源
				$("#dept-pps-from").text(selTr.find(".hid-dept").val() == "" ? "--":selTr.find(".hid-dept").val());
				//改变风险灯为绿灯
			   $("#fromPrjInpu").parent().find(".risk-img").attr("src",busiTripApply.riskViaImg);
			   //调用清空验证信息的方法
			   sysCommon.clearValidInfo($("#fromPrjInpu"));
			}else{
				$("#fromPrjInpu").val('');
				$("#prjId").val('');
				//部门来源
				$("#dept-pps-from").text('--');
				//改变风险灯为红灯
			    $("#fromPrjInpu").parent().find(".risk-img").attr("src",busiTripApply.riskWarImg);
			    //加上验证提示
			    $("#fromPrjInpu").next(".valid-font").text("请选择所属预算项目");
			    $("#fromPrjInpu").addClass("valid-hint");
			}
			//调用关闭清空项目弹出框方法
			busiTripApply.closeProjectModel();
		});
		/**
		 * 取消按钮点击事件
		 */
		$("#aproCanelBtn").off().on("click",function(){
			//调用关闭清空项目弹出框方法
			 busiTripApply.closeProjectModel();
		});
	},
	/**
	 * 
	 * 关闭清空所属项目弹出框方法
	 * 
	 */
	closeProjectModel:function(){
		//获取弹出框对象
		var fromPrjModel = $("#fromPrjModel");
		//获取弹出框对象
		var fromPrjModel = $("#fromPrjModel");
		//清空输入框
		$("#keywordInpu").val('');
		//初始化下拉列表
		$("#moneyQuality option:eq(0)").attr("selected","selected");
		$("#moneyQuality").niceSelect();
		//调用关闭可编辑弹出框方法
		sysCommon.closeModel(fromPrjModel);
	},
	/**
	 * 出差人弹出框操作事件
	 * @param {Object} busiInputObj  出差人输入框
	 * @param {Object} autoFontObj   自动计算字样
	 * @param {Object} userNumObj    人数字段
	 * @param {Object} clickFlag     点击标识
	 */
	busiTripUserModelEvent:function(busiInputObj,autoFontObj,userNumObj,clickFlag){
		//获取弹出框对象
		var busiTripUserModel = $("#busiTripUserModel");
		/**
		 * 查询按钮点击事件
		 */
		$("#searchUser").off().on("click",function(){
			//调用获取出差人列表方法
			busiTripApply.getBusiTripUsersList($("#userPram").val());
		});
		/**
		 * 
		 * 查询输入框方法
		 * 
		 */
		$("#userPram").on("keyup",function(){
			//调用获取出差人列表方法
			busiTripApply.getBusiTripUsersList($(this).val());
		});
		/**
		 * 单选一行数据
		 */
		$("#busiUserInfo ul li").off("click").on("click",function(){
			//出差人对象数据
			var  usersDatas = "";
			//判断是否选中过
			if($(this).hasClass("tr-check")){
				$(this).removeClass("tr-check");
				busiTripApply.selUsersName = "";
			    busiTripApply.selUsersCode = "";
			    //清空存储出差人的数据
				//busiTripApply.usersInfoList = "";
				//busiTripApply.usersInfoJson = "";
				$("#busiUserInfo ul li.tr-check").each(function(i,n){
					usersDatas = $(this).data("userData");
					busiTripApply.selUsersName += usersDatas.userName+"、";
					busiTripApply.selUsersCode += usersDatas.userItcode+",";
				});
			}else{
				$(this).addClass("tr-check");
				usersDatas = $(this).data("userData");
				busiTripApply.selUsersName += usersDatas.userName+"、";
				busiTripApply.selUsersCode += usersDatas.userItcode+",";
				//去重出差人操作
				var  checkUsersCodes = "";
				//遍历表格中的数据,
				$(".travel-list-tab-model tbody .hid-user-code").each(function(){
					checkUsersCodes+= $(this).val()+",";
				});
				var  selUsersCode = "," + usersDatas.userItcode +",";
				if(checkUsersCodes !="" && checkUsersCodes !=undefined){
					checkUsersCodes = ","+checkUsersCodes;
				}
				if(checkUsersCodes.indexOf(selUsersCode) < 0){
					//拼接出差人集合
		            var userLevel = usersDatas.jobLevelName == "--" ? "" : usersDatas.jobLevelName;
		            busiTripApply.usersInfoList = busiTripApply.usersInfoList + '{"userItcode":"'+usersDatas.userItcode+'","jobLevelName":"'+usersDatas.jobLevelName+'","userName":"'+usersDatas.userName+'"},';
				}
				
			}
			var selTr  = $("#busiUserInfo ul li.tr-check");
			if(selTr != "" && selTr.length>0){
				var selUser ="";
				var userCode = "";
				//获取选中出差人和code值
				selUser = busiTripApply.selUsersName.substring(0,busiTripApply.selUsersName.length-1);
				userCode = busiTripApply.selUsersCode.substring(0,busiTripApply.selUsersCode.length-1);
				
				$(busiInputObj).val(selUser);
				$(busiInputObj).prev("input[type=hidden]").val(userCode);
				//隐藏自动计算文本
				$(autoFontObj).hide();
				//显示出差人
				$(userNumObj).show();
				var userNums = selUser.split("、");
				//出差人数赋值
				$(userNumObj).find(".users-num").text(userNums.length);
				//调用清除验证信息方法
				sysCommon.clearValidInfo(busiInputObj);
				//显示清空按钮
				$("#clearUser").show();
			}else{
				$(busiInputObj).val('');
				$(busiInputObj).prev("input[type=hidden]").val('');
				//显示自动计算文本
				$(autoFontObj).show();
				//隐藏出差人数
				$(userNumObj).hide();
				//出差人数赋值
				$(userNumObj).find(".users-num").text(0);
				//添加验证信息方法
				$(busiInputObj).next(".valid-font").text("请选择出差人");
				$(busiInputObj).addClass("valid-hint");
				//清空存储出差人的数据
				busiTripApply.selUsersName = "";
				busiTripApply.selUsersCode = "";
				busiTripApply.usersInfoList = "";
				busiTripApply.usersInfoJson = "";
				//初始化
				var optionText = '<option value="">请选择</option>';
				$("#model-trip-user,#hotel-trip-user").empty().append(optionText);
				$("#model-trip-user,#hotel-trip-user").niceSelect();
				//隐藏清空按钮
				$("#clearUser").hide();
			}
		});
		/**
		 * 
		 * 清空按钮点击事件
		 * 
		 */
		$("#clearUser").click(function(){
			$(busiInputObj).val('');
			$(busiInputObj).prev("input[type=hidden]").val('');
			//显示自动计算文本
			$(autoFontObj).show();
			//隐藏出差人数
			$(userNumObj).hide();
			//出差人数赋值
			$(userNumObj).find(".users-num").text(0);
			//添加验证信息方法
			$(busiInputObj).next(".valid-font").text("请选择出差人");
			$(busiInputObj).addClass("valid-hint");
			//清空存储出差人的数据
			busiTripApply.selUsersName = "";
			busiTripApply.selUsersCode = "";
			busiTripApply.usersInfoList = "";
			busiTripApply.usersInfoJson = "";
			//初始化
			var optionText = '<option value="">请选择</option>';
			$("#model-trip-user,#hotel-trip-user").empty().append(optionText);
			$("#model-trip-user,#hotel-trip-user").niceSelect();
			
			//清空出差人下拉选中的数据
			$("#busiUserInfo ul li").removeClass("tr-check");
		});
		//隐藏
		$("#busiUserInfo").mouseleave(function(){
			$(this).hide();
			$(this).addClass("check");
		});
		/*
		$("#busiTripUserModel .users-table tbody").off("click").on('click', 'tr', function(){
			if($(this).hasClass("tr-check") && $(this).hasClass("yt-table-active")){
				$(this).removeClass("tr-check");
				$(this).removeClass("yt-table-active");
				busiTripApply.selUsersName = "";
			    busiTripApply.selUsersCode = "";
			    //清空存储出差人的数据
				busiTripApply.usersInfoList = "";
				busiTripApply.usersInfoJson = "";
				$("#busiTripUserModel .users-table tbody tr.tr-check").each(function(i,n){
					busiTripApply.selUsersName += $(this).find("td:eq(0)").text()+"、";
		            busiTripApply.selUsersCode += $(this).find(".hid-user-code").val()+",";
		            //拼接出差人集合
		            var userLevel = $(this).find("td:eq(4)").text() == "--" ? "" : $(this).find("td:eq(4)").text();
		            busiTripApply.usersInfoList = busiTripApply.usersInfoList + '{"userItcode":"'+$(this).find(".hid-user-code").val()+'","jobLevelName":"'+userLevel+'","userName":"'+$(this).find("td:eq(0)").text()+'"},';
				});
			}else{
				$(this).addClass("tr-check");
				busiTripApply.selUsersName += $(this).find("td:eq(0)").text()+"、";
		        busiTripApply.selUsersCode += $(this).find(".hid-user-code").val()+",";
		        //出差人集合
		        var userLevel = $(this).find("td:eq(4)").text() == "--" ? "" : $(this).find("td:eq(4)").text();
		        busiTripApply.usersInfoList = busiTripApply.usersInfoList + '{"userItcode":"'+$(this).find(".hid-user-code").val()+'","jobLevelName":"'+userLevel+'","userName":"'+$(this).find("td:eq(0)").text()+'"},';
			}
		});*/
		
		/**
		 * 确定按钮点击事件
		 */
		$("#busiSureBtn").off().on("click",function(){
			var selTr  = $("#busiTripUserModel .users-table tbody tr.tr-check");
			if(selTr != "" && selTr.length>0){
				var selUser ="";
				var userCode = "";
				//获取选中出差人和code值
				selUser = busiTripApply.selUsersName.substring(0,busiTripApply.selUsersName.length-1);
				userCode = busiTripApply.selUsersCode.substring(0,busiTripApply.selUsersCode.length-1);
				//调用给差旅明细弹出框中出差人赋值的方法
				busiTripApply.getModelUsersInfo();
				
				$(busiInputObj).val(selUser);
				$(busiInputObj).prev("input[type=hidden]").val(userCode);
				//隐藏自动计算文本
				$(autoFontObj).hide();
				//显示出差人
				$(userNumObj).show();
				var userNums = selUser.split("、");
				//出差人数赋值
				$(userNumObj).find(".users-num").text(userNums.length);
				//调用清除验证信息方法
				sysCommon.clearValidInfo(busiInputObj);
			}else{
				$(busiInputObj).val('');
				$(busiInputObj).prev("input[type=hidden]").val('');
				//显示自动计算文本
				$(autoFontObj).show();
				//隐藏出差人数
				$(userNumObj).hide();
				//出差人数赋值
				$(userNumObj).find(".users-num").text(0);
				//添加验证信息方法
				$(busiInputObj).next(".valid-font").text("请选择出差人");
				$(busiInputObj).addClass("valid-hint");
				
				//清空存储出差人的数据
				busiTripApply.selUsersName = "";
				busiTripApply.selUsersCode = "";
				busiTripApply.usersInfoList = "";
				busiTripApply.usersInfoJson = "";
				//初始化
				var optionText = '<option value="">请选择</option>';
				$("#model-trip-user,#hotel-trip-user").empty().append(optionText);
				$("#model-trip-user,#hotel-trip-user").niceSelect();
			}
			//清空输入框
			$("#busiUserKeyWord").val('');
			//调用关闭可编辑弹出框方法
			sysCommon.closeModel(busiTripUserModel);
			busiTripUserModel.find("tr").removeClass("tr-check");
			//判断点击标识点击的是主页面出差人还是行程计划编辑框中的出差人输入框
			if(clickFlag != undefined){
				//显示出行程计划编辑弹出框
				sysCommon.showModel($("#busiPlanEditModel"));
			}
		});
		/**
		 * 取消按钮点击事件
		 */
		$("#busiCanelBtn").off().on("click",function(){
			//清空输入框
			$("#busiUserKeyWord").val('');
			//调用关闭可编辑弹出框方法
			sysCommon.closeModel(busiTripUserModel);
			busiTripUserModel.find("tr").removeClass("tr-check");
			//判断点击标识点击的是主页面出差人还是行程计划编辑框中的出差人输入框
			if(clickFlag != undefined){
				//显示出行程计划编辑弹出框
				sysCommon.showModel($("#busiPlanEditModel"));
			}
			
		});
	},
	/**
	 * 
	 * 获取差旅明细弹出框中的出差人数据
	 * 
	 */
	getModelUsersInfo:function(){
		//出差人集合
	   	if(busiTripApply.usersInfoList != "" &&  busiTripApply.usersInfoList !=null)
		{
			busiTripApply.usersInfoJson = "["+busiTripApply.usersInfoList+"]";
			busiTripApply.usersInfoJson = busiTripApply.usersInfoJson.substr(0, busiTripApply.usersInfoJson.length - 2);
			busiTripApply.usersInfoJson +="]";
		}
		//给差旅申请弹出框中添加出差人
		//option html
		var optionText = '<option value="">请选择</option>';
		$("#model-trip-user,#hotel-trip-user").empty().append(optionText);
		if(busiTripApply.usersInfoJson !="" && busiTripApply.usersInfoJson.length > 0){
			busiTripApply.usersInfoJson = eval("(" + busiTripApply.usersInfoJson + ")");
			$.each(busiTripApply.usersInfoJson, function(i,n) {
				optionText = '<option value="'+n.userItcode+'" data-level="'+n.jobLevelName+'">'+n.userName+'</option>';
				$("#model-trip-user,#hotel-trip-user").append(optionText);
			});
		}
		$("#model-trip-user,#hotel-trip-user").niceSelect();
	},
	/**
	 * 
	 * 
	 *获取行程计划表单数据,追加到行程列表中
	 * 
	 * 
	 */
	doAddBusiInfo:function(){
		//获取行程表单对象
		var  tarvelBody =  $(".travel-list-tab-model table tbody");
		//获取行程计划弹出框表单数据
		var  planBusiData = busiTripApply.getPlanBusiFormInfoData();
		/**
		 * 判断是否存在暂无数据
		 */
		if(tarvelBody.find("tr.not-date-tr")){
			tarvelBody.find("tr.not-date-tr").remove();
		}
		var busiTripStr = "";
		busiTripStr = '<tr>'
		 			+ '<td><span>'+(planBusiData.modelBusiType == "请选择" ? "--" : planBusiData.modelBusiType)+'</span>'
		 			+ '<input type="hidden" data-val="travelType" class="hid-type-code" value="'+planBusiData.modelBusiCode+'"/></td>'
		 			+ '<td data-text="startTime">'+planBusiData.planStartDate+'</td>'
		 			+ '<td data-text="endTime">'+planBusiData.planEndDate+'</td>'
		 			+ '<td data-text="travelAddress"><span>'+planBusiData.busiAddress+'</span><input type="hidden" class="hid-addres-val" value="'+planBusiData.busiAddressCode+'"/></td>'
		 			+ '<td><div class="text-overflow-sty" title='+planBusiData.busiUsersName+'>'+planBusiData.busiUsersName+'</div>'
		 			+ '<input type="hidden" data-val="travelPersonnels" class="hid-user-code" value="'+planBusiData.busiUsersCode+'"/>'
		 			+ '</td>'
		 			+ '<td data-text="busiTripUserNum">'+planBusiData.busiNum+'</td>'
		 			+ '<td><div class="text-overflow-sty" title='+planBusiData.receptionMoney+'>'+planBusiData.receptionMoney+'</div>'
		 			+ '<input type="hidden" data-val="receptionCostItem" class="hid-reception-code" value="'+planBusiData.receptionMoneyCode+'"/></td>'
		 			+ '<td>'
		 			+ '<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>'
		 			+ '<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>'
					+ '</td>'
					+ '</tr>';
		$(".travel-list-tab-model table tbody").append(busiTripStr);
	
		/**
		 * 判断如果形成列表存在数据,显示费用申请区域和流程审批区域
		 */
		if(tarvelBody.find("tr:not(.not-date-tr)").length>0){
			//显示费用申请区域和流程审批区域
		    $(".cost-apply-model,.flow-approve-model").show();
		}
		//调用行程列表中的操作事件方法
		busiTripApply.tripListOperateEvent();
	},
	/**
	 * 
	 * 行程列表中的操作事件
	 * 
	 */
	tripListOperateEvent:function(){
		/**
		 * 
		 * 点击新增和修改操作事件
		 * 
		 */
		$(".travel-list-tab-model table tr td .operate-update,#travelAddBtn").off().on("click",function(){
			//显示出行程计划编辑框
			var  planModel = $("#busiPlanEditModel");
			sysCommon.showModel(planModel);
			/**
			 * 
			 * 行程计划表格编辑开始日期和结束日期
			 * 
			 */
			$("#tdStartDate").calendar({
				controlId: "planStartDate",
				nowData: false, //默认选中当前时间,默认true  
				upperLimit: $("#tdEndDate"),//开始日期最大为结束日期 
				speed:0,
				callback:function(){
					//调用公用的清除验证信息方法
					sysCommon.clearValidInfo($("#tdStartDate"));
				}
			});
			$("#tdEndDate").calendar({
				controlId: "planEndDate",
				nowData: false, //默认选中当前时间,默认true  
				lowerLimit: $("#tdStartDate"),//开始日期最大为结束日期  
				speed:0,
				callback:function(){
					//调用公用的清除验证信息方法
					sysCommon.clearValidInfo($("#tdEndDate"));
				}
			});
			//判断是否是编辑按钮点击
			if($(this).hasClass("operate-update")){
				//调用行程计划编辑框功能操作事件
				busiTripApply.planBusiEditModelEvent(planModel,$(this).parents("tr"));
				//调用获取行程计划信息方法
				busiTripApply.getBusiPlanInfoData($(this).parents("tr"));
				//修改左侧按钮名称
				planModel.find("#planSaveBtn span").text("确定");
				planModel.find("#planSaveBtn #hidBtnFlag").val(2);
			}else{
				//调用行程计划编辑框功能操作事件
				busiTripApply.planBusiEditModelEvent(planModel);
				planModel.find("#planSaveBtn span").text("加入到列表");
				planModel.find("#planSaveBtn #hidBtnFlag").val(1);
			}
		});
		/*
		 * 
		 * 点击删除操作事件
		 * 
		 */
		$(".travel-list-tab-model table tr td .operate-del").off().on("click",function(){
			var thisObj = $(this);
			$yt_alert_Model.alertOne({
				alertMsg: "确定要删除此条数据吗?", //提示信息  
				leftBtnName: "确定",
				confirmFunction: function() { //点击确定按钮执行方法  
					//删除当前行
				   thisObj.parents("tr").remove();
				   //判断是否都删除,给出暂无数据
				   if($(".travel-list-tab-model table tbody tr").length == 0){
				   	 var noDataTr = '<tr class="not-date-tr">'
				   	   			  + '<td colspan="9">'
				   	   			  + '<div class="no-data">'
				   	   			  + '<img src="../../../../../resources-sasac/images/common/no-data.png" alt="">'
				   	   			  + '</div>'
				   	   			  + '</td>'
							  	  + '</tr>';	    		
				   	 $(".travel-list-tab-model table tbody").append(noDataTr);
				   	 //隐藏费用申请区域和流程审批区域
				   	 $(".cost-apply-model,.flow-approve-model").hide();
				   	 //清空费用申请区域中的表格数据
				   }
				}
			});
		});
	},
	/**
	 * 
	 * 获取当前行选中的行程计划数据
	 * @param {Object} thisTr 当前行
	 */
    getBusiPlanInfoData:function(thisTr){
    	//获取当前行对象
    	var trObj = $(thisTr);
    	//获取出差类型
    	$('#modelBusiType option[value="'+trObj.find("td:eq(0) .hid-type-code").val()+'"]').attr("selected","selected");
    	//判断如果选中的是培训
    	if(trObj.find("td:eq(0) .hid-type-code").val() == 3){
    		//显示文件风险灯
			$("#modelFileBtn").next(".risk-model").show();
			$("#modelFileBtn").css("float","left");
			$("#busiPlanEditModel .file-div").css("width","270px");
    	}else{
    		//隐藏文件风险灯
			$("#modelFileBtn").next(".risk-model").hide();
			$("#busiPlanEditModel .file-div").css("width","295px");
			$("#modelFileBtn").css("float","right");
    	}
    	$("#modelBusiType").niceSelect();
    	//开始日期结束日期
    	$("#tdStartDate").val(trObj.find("td:eq(1)").text());
    	$("#tdEndDate").val(trObj.find("td:eq(2)").text());
    	//出差地点
    	$("#modelBusiAddres").html('<option value="'+trObj.find("td:eq(3) .hid-addres-val").val()+'">'+trObj.find("td:eq(3) span").text()+'</option>')
    	//调用查询行程出差人方法
    	busiTripApply.getPlanBusiAddress($("#modelBusiAddres"));
    	
    	//出差人
    	$("#modelBusiUser").val(trObj.find("td:eq(4) div").text());
    	//出差人的code
    	$("#modelUserCodes").val(trObj.find("td:eq(4) .hid-user-code").val());
    	//出差人数
    	$("#busiPlanEditModel .auto-font").hide();
    	$(".model-user-num-show").show();
    	$(".model-user-num-show .users-num").text(trObj.find("td:eq(5)").text());
    	//接待方承担费用
    	var receptionCode = trObj.find("td:eq(6) .hid-reception-code").val();
    	if(receptionCode != ""){
    		receptionCode = receptionCode.split(",");
	        $.each(receptionCode, function(i,n) {
	        	$('#busiPlanEditModel .yt-checkbox input[value="'+n+'"]').parent().addClass("check");
	        });
    	}
    },
	/**
	 *  行程计划编辑框功能操作事件
	 * @param {Object} planModel  编辑框对象
	 * @param {Object} trObj      当前行
	 */
	planBusiEditModelEvent:function(planModel,trObj){
		//点击出差人输入框操作
		$("#modelBusiUser").off().on("click",function(){
			//显示出差人列表
			$("#busiUserInfo").show();
			//判断出差人列表书否读取过数据
			if(!$("#busiUserInfo").hasClass("check")){
				//调用获取出差人列表方法
				busiTripApply.getBusiTripUsersList($("#userPram").val());
			}
			//调用弹出框中操作事件方法
			busiTripApply.busiTripUserModelEvent($("#modelBusiUser"),$("#busiPlanEditModel .auto-font"),$(".model-user-num-show"),1);
		});
		//点击保存按钮操作
		$("#planSaveBtn").off().on("click",function(){
			//调用验证方法
			var validFlag = $yt_valid.validForm($("#busiPlanEditModel"));
			if(validFlag){
				//判断是新增还是修改1新增2修改
				if($(this).find("#hidBtnFlag").val() == 1){
					//调用添加数据方法
					busiTripApply.doAddBusiInfo();
				}else{
					//调用保存修改信息方法
					busiTripApply.saveUpdatePlanBusiInfo(planModel,trObj);
				}
				//调用关闭编辑框弹出框方法
				sysCommon.closeModel($("#busiPlanEditModel"));
				//调用 清空行程计划编辑框数据
				busiTripApply.clearPlanBusiEditData(planModel);
			}
		});
		//点击取消按钮操作
		$("#planCanelBtn").off().on("click",function(){
			//调用 清空行程计划编辑框数据
			busiTripApply.clearPlanBusiEditData(planModel);
		});
	},
	//获取行程计划弹出框中的表单数据
	getPlanBusiFormInfoData:function(){
		//显示出行程计划编辑框
		var  planModel = $("#busiPlanEditModel");
		//接待方承担项
		//获取接待放承担费用项
		var receptionMoney = "";
		var receptionMoneyCode = "";
		if(planModel.find(".check-label.check").length>0){
			planModel.find(".check-label.check").each(function(i,n){
				receptionMoney += $(n).find("span").text()+"、";
				receptionMoneyCode += $(n).find("input").val()+",";
			});
			receptionMoney = receptionMoney.substring(0,receptionMoney.length-1);
			receptionMoneyCode = receptionMoneyCode.substring(0,receptionMoneyCode.length-1);
		}else{
			receptionMoney = "--";
		}
		var  planFormData ={
			  modelBusiType:$("#modelBusiType option:selected").text() == "请选择" ?"--" : $("#modelBusiType option:selected").text(),//出差类型
			  modelBusiCode:$("#modelBusiType").val(),//出差类型code
			  planStartDate:$("#tdStartDate").val(),//开始时间
			  planEndDate:$("#tdEndDate").val(),//结束时间
			  busiAddress:$("#modelBusiAddres option:selected").attr("data-name"),//出差地点
			  busiAddressCode:$("#modelBusiAddres").val(),//出差地点code
			  busiUsersName:$("#modelBusiUser").val(),//出差人名称
			  busiUsersCode:$("#modelUserCodes").val(),//出差人code
			  busiNum:$(".model-user-num-show .users-num").text(),//出差人数
			  receptionMoney:receptionMoney,//接待接待方承担项名称
			  receptionMoneyCode:receptionMoneyCode//接待方承担项名称
		}
		return planFormData;
	},
	/**
	 * 保存修改的行程信息方法
	 * @param {Object} trObj 当前行
	 * @param {Object} planModel  编辑框对象
	 */
	saveUpdatePlanBusiInfo:function(planModel,trObj){
		//调用获取行程计划弹出框表单数据
		var  planFormData = busiTripApply.getPlanBusiFormInfoData();
		var thisTr = $(trObj);
		if(planFormData){
			//出差人字段
			thisTr.find("td:eq(0) span").text(planFormData.modelBusiType);
			thisTr.find("td:eq(0) .hid-type-code").val(planFormData.modelBusiCode);
			//开始结束日期
			thisTr.find("td:eq(1)").text(planFormData.planStartDate);
			thisTr.find("td:eq(2)").text(planFormData.planEndDate);
			//出差地点
			thisTr.find("td:eq(3)").text(planFormData.busiAddress);
			//出差人
			thisTr.find("td:eq(4) div").text(planFormData.busiUsersName);
			thisTr.find("td:eq(4) .hid-user-code").val(planFormData.busiUsersCode);
			//出差人数
			thisTr.find("td:eq(5)").text(planFormData.busiNum);
			thisTr.find("td:eq(6) div").text(planFormData.receptionMoney);
			thisTr.find("td:eq(6) .hid-reception-code").val(planFormData.receptionMoneyCode);
		}
	},
	/**
	 * 清空行程计划编辑框数据
	 * @param {Object} planModel 当前弹出框对象
	 */
	clearPlanBusiEditData:function(planModel){
		//清空输入框数据
		$("#busiPlanEditModel input:not(.check-label input,.hid-risk-code)").val("");
		//清空复选框选中
		$("#busiPlanEditModel .yt-checkbox").removeClass("check");
		//初始化下拉列表
		$(planModel).find("select option:eq(0)").attr("selected","selected");
		$(planModel).find("select").niceSelect();
		//清空人数
		$(planModel).find(".auto-font").show();
		$(".model-user-num-show").hide();
		$(".model-user-num-show .users-num").text('');
		//清空上传文件信息
		$("#busiPlanEditModel .file-msg").html('');
		//调用关闭弹出框方法
		sysCommon.closeModel(planModel);
		//处理出差人下拉列表初始化
		//隐藏清空按钮
		$("#clearUser").hide();
		$("#busiUserInfo ul li").removeClass("tr-check");
		$("#busiUserInfo").removeClass("check");
		//清空存储出差人的数据
		busiTripApply.selUsersName = "";
		busiTripApply.selUsersCode = "";
		//初始化行程列表中出差人下拉列表
	    $("#modelBusiAddres option").remove(); 
	    //调用初始化行程出差人数据
	    busiTripApply.getPlanBusiAddress($("#modelBusiAddres"));
	},
	/**
	 *  获取上传的传附件名称
	 * @param {Object} fileBtn 上传文件input
	 * @param {Object} fileTextObj 显示文件名称标签
	 * @param {Object} fileId     上传成功文件ID
	 */
	getFileUploadName: function(fileBtn,fileTextObj,fileId) { 
		/*获取选择文件的名字*/
		$(fileBtn).change("click", function() {
			if($(fileBtn).val() !="" ){
				var arr = $(fileBtn).val().split('\\');
				/*取得图片名称*/
				var my = arr[arr.length - 1];
				$(fileTextObj).text(my);
				$(fileTextObj).css("color", "#333333");
				$(fileBtn).next().val(fileId);
				//改变风险图片为绿灯
				$(this).parents("td").find(".risk-img").attr("src",busiTripApply.riskViaImg);
			}else{
				$(fileBtn).next().val("");
				//改变风险图片为红灯
				$(this).parents("td").find(".risk-img").attr("src",busiTripApply.riskWarImg);
			}
		});
	},
	/**
	 * 
	 * 获取费用明细弹出框中的表单数据
	 * 
	 * @param {Object} tabFlag  选中tab标签标识0交通费,1住宿费2其他
	 */
	getCostDetailData:function(tabFlag){
		if(tabFlag == 0){
			//调用获取获取拼接交通费数据方法
			busiTripApply.getTrafficCostFormInfo();
		}
		if(tabFlag == 1){
			//调用获取获取拼接住宿费数据方法
			busiTripApply.getHotelFormInfo();
		}
		if(tabFlag == 2){
			//调用获取获取拼接其他费数据方法
			busiTripApply.getOtherCostFormInfo();
		}
	},
	/**
	 * 
	 * 获取费用明细弹框中交通费表单信息
	 * 
	 */
	getTrafficCostFormInfo:function(){
		//先进行表单验证是否成功
		//获取交通费模块对象
		var  trabfficObj = $(".traffic-form");
		//调用公用的拼接合计行方法
		sysCommon.createSumTr(0);
		//出差人
		var tripUser = trabfficObj.find("#model-trip-user option:selected").text();
		var level = trabfficObj.find("#model-trip-user option:selected").attr("data-level");
		//获取交通工具文本信息
		var vehicle = "";
		var vehicleCode  = "";
		vehicleCode  = trabfficObj.find(".vehicle-sel").val();
		var vehicleChildCode = "";
		vehicleChildCode  = trabfficObj.find(".vehicle-two-sel").val();
		//判断如果二级菜单没有选中
		if($(".vehicle-two-sel").val() != "" && $(".vehicle-two-sel").val()!=null){
			vehicle = trabfficObj.find(".vehicle-two-sel option:selected").text();
		}else{
			vehicle = trabfficObj.find(".vehicle-sel option:selected").text();
		}
		
		//城市交通费
		var cityMoney = trabfficObj.find(".city-cost-input").val();
		//拼接交通费表格数据
		var trafficCostStr = '<tr>'
		                   + '<td><span>'+tripUser+'</span><input type="hidden" data-val="travelPersonnel" class="hid-traf-users" value="'+trabfficObj.find("#model-trip-user").val()+'"/>'
		                   + '</td><td>'+level+'</td>'
		                   + '<td data-text="goTime">'+$("#traffic-start-time").val()+'</td><td data-text="goAddress"><span>'+$("#fromcity option:selected").attr("data-name")+'</span><input type="hidden" value="'+$("#fromcity").val()+'"/></td>'
		                   +'<td data-text="arrivalTime">'+$("#traffic-end-time").val()+'</td>'
		 				   + '<td data-text="arrivalAddress">'+$("#tocity option:selected").attr("data-name")+'<input type="hidden" value="'+$("#tocity").val()+'"/></td>'
		 				   + '<td><span data-text="vehicle">'+vehicle+'</span><input type="hidden" class="hid-vehicle" value="'+vehicleCode+'"/><input type="hidden" class="hid-child-code" value="'+vehicleChildCode+'"/></td>'
		 				   + '<td class="font-right money-td" data-text="crafare">'+(cityMoney == "" ? "--" :cityMoney)+'</td>'
		 				   + '<td class="text-overflow-sty" data-text="remarks" title="'+$("#special-remark").val()+'">'+($("#special-remark").val() == "" ? "--" : $("#special-remark").val())+'</td>'
		 				   + '<td>'
		 				   + '<input type="hidden" class="hid-cost-type" value="0"/>'
		 				   + '<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>'
		 				   + '<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>'
						   + '</td></tr>';   
		$("#traffic-list-info tbody .total-last-tr").before(trafficCostStr);	
		//调用合计方法
		sysCommon.updateMoneySum(0);
		//调用操作列事件方法
		busiTripApply.costApplyTabOperateEvent();
		//调用公用的清空表单数据方法
		sysCommon.clearFormData();
		//改变风险灯图标绿灯
		$("#traffic-list-info").parent().find(".cost-list-title .risk-img").attr("src",busiTripApply.riskViaImg);
	},
	/**
	 * 
	 * 
	 * 获取住宿费方法
	 * 
	 */
	getHotelFormInfo:function(){
		//先进行表单验证是否成功
		//获取交通费模块对象
		var  hotelObj = $(".hotel-form");
		//调用公用的拼接合计行方法
		sysCommon.createSumTr(1);
		//出差人
		var tripUser = hotelObj.find("select.hotel-trip-user-sel option:selected").text();
		var level = hotelObj.find("select.hotel-trip-user-sel option:selected").attr("data-level");
		//住宿地址
		var hotelAddress = "";
		var hotelAdressCode ="";
		var hotelParentAdres = hotelObj.find("#hotelParentAddress option:selected").text();
		var hotelTwoAdres = hotelObj.find("#hotelTwoAddres option:selected").text();
		var hotelChildAdres = hotelObj.find("#hotelChildAddres option:selected").text();
		if(hotelTwoAdres =="" || hotelTwoAdres == "请选择"){
			hotelAddress = hotelParentAdres;
			hotelAdressCode = hotelObj.find("#hotelParentAddress").val();
		}else{
			hotelAddress = hotelParentAdres +"-"+hotelTwoAdres+"-"+hotelChildAdres;
			hotelAdressCode = hotelObj.find("#hotelParentAddress").val()+"-"+hotelObj.find("#hotelTwoAddres").val()+"-"+hotelObj.find("#hotelChildAddres").val();
		}
        //拼接住宿费表格数据
       var  hotelCostStr = '<tr>'
         				  + '<td><span>'+tripUser+'</span><input type="hidden" data-val="travelPersonnel" value="'+ hotelObj.find("select.hotel-trip-user-sel").val()+'"/></td><td>'+level+'</td>'
         				  + '<td data-text="hotelTime">'+$("#hotelDate").val()+'</td>'
         				  + '<td class="font-right">'+$("#peoDayMoney").html()+'</td>'
         				  + '<td data-text="hotelDays">'+hotelObj.find(".yt-numberInput").val()+'</td><td class="font-right money-td" data-text="hotelExpense">'+hotelObj.find(".cost-detail-money").val()+'</td>'
         				  + '<td><span data-text="hotelAddressName">'+hotelAddress+'</span><input type="hidden" data-val="hotelAddress" value="'+ hotelAdressCode +'"</td>'
         				  + '<td class="text-overflow-sty" data-text="remarks" title="'+hotelObj.find(".hotel-msg").val()+'">'+(hotelObj.find(".hotel-msg").val() == "" ? "--" : hotelObj.find(".hotel-msg").val())+'</td>'
         				  + '<td>'
         				  + '<input type="hidden" class="hid-set-met" data-val="setMethod"/>'
         				  + '<input type="hidden" class="hid-cost-type" value="1"/>'
         				  + '<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>'
		 				  + '<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>'
         				  + '</td></tr>';
		$("#hotel-list-info tbody .total-last-tr").before(hotelCostStr);	
		//调用合计方法
		sysCommon.updateMoneySum(1);
		//调用操作列事件方法
		busiTripApply.costApplyTabOperateEvent();
		//调用公用的清空表单数据方法
		sysCommon.clearFormData();
		//改变风险灯图标绿灯
		$("#hotel-list-info").parent().find(".cost-list-title .risk-img").attr("src",busiTripApply.riskViaImg);
	},
	/**
	 * 
	 * 
	 * 获取其他费用表单数据
	 * 
	 */
	getOtherCostFormInfo:function(){
		//先进行表单验证是否成功
		//获取交通费模块对象
		var  otherObj = $(".other-form");
		//调用公用的拼接合计行方法
		sysCommon.createSumTr(2);
		//费用类型
		var costType = otherObj.find("#cost-type option:selected").text();
        //拼接其他费用表格数据
        var  otherCostStr = '<tr>'
                          + '<td><span>'+costType+'</span><input type="hidden" data-val="costType" value="'+otherObj.find("#cost-type").val()+'"/></td>'
                          + '<td class="font-right money-td" data-text="reimAmount">'+otherObj.find(".other-money").val()+'</td>'
                          + '<td class="text-overflow-sty" data-text="remarks" title="'+otherObj.find(".other-msg").val()+'">'+(otherObj.find(".other-msg").val() == "" ? "--" : otherObj.find(".other-msg").val())+'</td>'
                          + '<td>'
                          + '<input type="hidden" class="hid-cost-type" value="2"/>'
                          + '<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>'
		 				  + '<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>'
                          + '</td></tr>';
		$("#other-list-info tbody .total-last-tr").before(otherCostStr);	
		//调用合计方法
		sysCommon.updateMoneySum(2);
		//调用操作列事件方法
		busiTripApply.costApplyTabOperateEvent();
		//调用公用清空表单数据方法
		sysCommon.clearFormData();
		//改变风险灯图标绿灯
		$("#other-list-info").parent().find(".cost-list-title .risk-img").attr("src",busiTripApply.riskViaImg);
	},
	/**
	 * 
	 * 费用明细弹出框操作事件
	 * 
	 */
	costDetailModelEvent:function(){
		//获取弹出框对象
		var costApplyModel = $("#cost-apply-model");
		/**
		 * 
		 * 
		 * 加入列表按钮操作事件
		 * 
		 */
		costApplyModel.find("#model-add-list-btn").off().on("click",function(){
			//获取当前选中的tab值0交通费,1住宿费2其他
			var tabFlag = $(".cost-type-tab li.tab-check .hid-tab").val();
			var validModel ="";
			if(tabFlag == 0){
				validModel = $(".traffic-form");
			}else if(tabFlag == 1){
				validModel = $(".hotel-form");
			}else if(tabFlag == 2){
				validModel = $(".other-form");
			}
			//调用验证方法
			var  validFlag = $yt_valid.validForm(validModel);
			if(validFlag){
				//调用获取表单数据拼接方法
				busiTripApply.getCostDetailData(tabFlag);
				//调用关闭可编辑弹出框方法
				sysCommon.closeModel(costApplyModel);
			}
		});
		/**
		 * 
		 * 确定按钮修改数据操作事件
		 * 
		 */
		costApplyModel.find("#model-sure-btn").off().on("click",function(){
			//获取费用类型0.交通1.住宿2.其他
			var costType = busiTripApply.trObject.find(".hid-cost-type").val();
			var  validModel = "";
			if(costType == 0){
				validModel = $(".traffic-form");
			}else if(costType == 1){
				validModel = $(".hotel-form");
			}else if(costType == 2){
				validModel = $(".other-form");
			}
			//调用验证方法
			var validFlag = $yt_valid.validForm(validModel);
			//判断验证是否通过
			if(validFlag){
				//交通费
				if(costType == 0){
					var trabfficObj = $(".traffic-form");
					//出差人
					var tripUser = trabfficObj.find("#model-trip-user option:selected").text();
					var level = trabfficObj.find("#model-trip-user option:selected").attr("data-level");
					//交通工具
					var vehicle ="";
					if($(".vehicle-two-sel").val() !="" && $(".vehicle-two-sel").val() !=null){
						 vehicle = trabfficObj.find(".vehicle-two-sel option:selected").text();
					}else{
						vehicle = trabfficObj.find(".vehicle-sel option:selected").text();
					}
					
					//城市交通费
					var cityMoney = trabfficObj.find(".city-cost-input").val();
					busiTripApply.trObject.find("td:eq(0) span").text(tripUser);
					busiTripApply.trObject.find("td:eq(1)").text(level);
					busiTripApply.trObject.find("td:eq(0) input").val(trabfficObj.find("#model-trip-user").val());
					//出发日期
					busiTripApply.trObject.find("td:eq(2)").text($("#traffic-start-time").val());
					//出发地点
					busiTripApply.trObject.find("td:eq(3)").text($("#fromcity").val());
					//到达日期
					busiTripApply.trObject.find("td:eq(4)").text($("#traffic-end-time").val());
					//到达地点
					busiTripApply.trObject.find("td:eq(5)").text($("#tocity").val());
					//交通工具
					busiTripApply.trObject.find("td:eq(6) span").text(vehicle);
					busiTripApply.trObject.find("td:eq(6) input:eq(0)").val(trabfficObj.find(".vehicle-sel").val());
					busiTripApply.trObject.find("td:eq(6) .hid-child-code").val($(".vehicle-two-sel").val());
					//城市交通费
					busiTripApply.trObject.find("td:eq(7)").text(cityMoney);
					//特殊说明
					busiTripApply.trObject.find("td:eq(8)").text(($("#special-remark").val()==""?"--":$("#special-remark").val()));
					//调用合计方法
					sysCommon.updateMoneySum(0);
				}
				//住宿费
				if(costType == 1){
					var hotelObj = $(".hotel-form");
					//出差人
					var tripUser = hotelObj.find("select.hotel-trip-user-sel option:selected").text();
					var level = hotelObj.find("select.hotel-trip-user-sel option:selected").attr("data-level");
					//住宿地址
					var hotelAddress = "";
					var hotelAdressCode ="";
					var hotelParentAdres = hotelObj.find("#hotelParentAddress option:selected").text();
					var hotelTwoAdres = hotelObj.find("#hotelTwoAddres option:selected").text();
					var hotelChildAdres = hotelObj.find("#hotelChildAddres option:selected").text();
					if(hotelTwoAdres == "" || hotelTwoAdres == "请选择"){
						hotelAddress = hotelParentAdres;
						hotelAdressCode = hotelObj.find("#hotelParentAddress").val();
					}else{
						hotelAddress = hotelParentAdres +"-"+hotelTwoAdres+"-"+hotelChildAdres;
						hotelAdressCode = hotelObj.find("#hotelParentAddress").val()+"-"+hotelObj.find("#hotelTwoAddres").val()+"-"+hotelObj.find("#hotelChildAddres").val();
					}			
					//出差人
					busiTripApply.trObject.find("td:eq(0) span").text(tripUser);
					busiTripApply.trObject.find("td:eq(1)").text(level);
					//住宿日期
					busiTripApply.trObject.find("td:eq(2)").text($("#hotelDate").val());
					busiTripApply.trObject.find("td:eq(0) input").val(hotelObj.find("select.hotel-trip-user-sel").val());
					//人均花销
					busiTripApply.trObject.find("td:eq(3)").text($("#peoDayMoney").text());
					//住宿天数
					busiTripApply.trObject.find("td:eq(4)").text(hotelObj.find(".yt-numberInput").val());
					//住宿费
					busiTripApply.trObject.find("td:eq(5)").text(hotelObj.find(".hotel-money").val());
					//住宿地点
					busiTripApply.trObject.find("td:eq(6) span").text(hotelAddress);
					busiTripApply.trObject.find("td:eq(6) input").val(hotelAdressCode);
					///获取特殊说明
					busiTripApply.trObject.find("td:eq(7)").text((hotelObj.find(".hotel-msg").val()==""?"--":hotelObj.find(".hotel-msg").val()));
					//调用合计方法
					sysCommon.updateMoneySum(1);
				}
				//其他费用
				if(costType == 2){
					var otherObj  = $(".other-form");
					//费用类型
					var costType = otherObj.find("#cost-type option:selected").text();
					//费用类型
					busiTripApply.trObject.find("td:eq(0) span").text(costType);
					busiTripApply.trObject.find("td:eq(0) input").val(otherObj.find("#cost-type").val());
					//费用金额
					busiTripApply.trObject.find("td:eq(1)").text(otherObj.find(".other-money").val());
					///获取特殊说明
					busiTripApply.trObject.find("td:eq(2)").text((otherObj.find(".other-msg").val()==""?"--":otherObj.find(".other-msg").val()));
					//调用合计方法
					sysCommon.updateMoneySum(2);
				}
				//调用关闭可编辑弹出框方法
				sysCommon.closeModel(costApplyModel);
				//调用公用的清空表单数据方法
				sysCommon.clearFormData();
			}
			
		});
		/**
		 * 
		 * 取消按钮操作事件
		 * 
		 */
		costApplyModel.find("#model-canel-btn").off().on("click",function(){
			//调用关闭可编辑弹出框方法
			sysCommon.closeModel(costApplyModel);
			//调用公共用的清空表单数据方法
			sysCommon.clearFormData();
		});
		/**
		 * 
		 * 出发地,到达地互换操作
		 * 
		 */
		$("#addres-icon").off().on("click",function(){
			var startCity = $("#fromcity").val();
			var endCity = $("#tocity").val();
			$("#tocity").val(startCity);
			$("#fromcity").val(endCity);
		});
		/**
		 * 
		 * 入住天数上下相加
		 * 
		 */
		$(".yt-spin").click(function(){
			//获取住宿天数
			var hotelDay = $(".hotel-form .yt-numberInput").val();
			if(hotelDay < 1){
			  hotelDay = $(".hotel-form .yt-numberInput").val(1);
			}
			//获取 住宿金额
     		var hotelMoney =  $(".cost-detail-money").val();
     		if(hotelDay>0 && hotelMoney !=""){
			//算出住宿费平均数
			$("#peoDayMoney").html($yt_baseElement.fmMoney(($yt_baseElement.rmoney(hotelMoney))/hotelDay));
     		}
     	});
        /**
         * 
         * 入住天数文本框失去焦点事件
         * 
         */
        $(".yt-numberInput").on("blur",function(){
        	//获取 住宿金额
     		var hotelMoney =  $(".cost-detail-money").val();
        	if($(this).val() > 0 && hotelMoney!=""){
        		//算出住宿费平均数
				$("#peoDayMoney").html($yt_baseElement.fmMoney(hotelMoney/$(this).val()));
        	}
        });
		/**
		 * 
		 * 城市金额输入框失去焦点获取焦点事件
		 * 
		 */
	    $(".city-cost-input,.cost-detail-money").on("focus",function(){
			if($(this).val()!="" && $(this).val() !=null){
				$(this).val($yt_baseElement.rmoney($(this).val()));
				$(this).select();
			}
		});
		$(".city-cost-input,.cost-detail-money").off("blur").on("blur",function(){
			//判断如果是住宿费失去焦点
			if($(this).hasClass("cost-detail-money")){
				//算出住宿费平均数
				var hotelDay = $(".hotel-form .yt-numberInput").val();
				$("#peoDayMoney").html($yt_baseElement.fmMoney($(this).val()/hotelDay));
			}
			busiTripApply.formartMoney($(this));
		});
	},
	/**
	 * 
	 * 
	 * 费用申请表格操作列事件
	 * 
	 * 
	 */
	costApplyTabOperateEvent:function(){
		/**
		 * 
		 * 点击修改操作事件
		 * 
		 */
		$(".operate-update").off().on("click",function(){
			//获取当前对象的行
			var thisTr = $(this).parents("tr");
			busiTripApply.trObject = thisTr;
			//调用 显示费用明细弹出框方法
			busiTripApply.showCostDetailModel();
			//隐藏弹出框中"加入列表按钮"
			$("#model-add-list-btn").hide();
			//显示确定按钮
			$("#model-sure-btn").show();
			//获取费用类型0.交通1.住宿2.其他
			var costType = thisTr.find(".hid-cost-type").val();
			//选中相对应的tab
			$(".cost-type-tab ul li").removeClass("tab-check");
			$('.cost-type-tab ul li input[value="'+costType+'"]').parent().addClass("tab-check");
			//显示相对应的表单
			if(costType == 0){
				$(".traffic-form").show();
				//改变风险灯为绿灯
				$(".traffic-form .risk-img").attr("src",busiTripApply.riskViaImg);
			}
			if(costType == 1){
				$(".hotel-form").show();
				$(".traffic-form").hide();
				//改变风险灯为绿灯
				$(".hotel-form .risk-img").attr("src",busiTripApply.riskViaImg);
			}
			if(costType == 2){
				$(".other-form").show();
				$(".traffic-form").hide();
				//改变风险灯为绿灯
				$(".other-form .risk-img").attr("src",busiTripApply.riskViaImg);
			}
			//调用获取选中当前行的方法
			busiTripApply.getTrCostInfoToForm(thisTr);
		});
		/**
		 * 
		 * 点击删除操作事件
		 * 
		 */
		$(".operate-del").off().on("click",function(){
			var thisObj = $(this);
			var tableModel = thisObj.parents("table").prev();
			//获取当前操作数据费用类型0交通1.住宿2.其他
			var costType = thisObj.parent().find(".hid-cost-type").val();
			$yt_alert_Model.alertOne({
				alertMsg: "确定要删除此条数据吗?", //提示信息  
				leftBtnName: "确定",
				confirmFunction: function() { //点击确定按钮执行方法  
					//判断表格中除去,合计行和公务卡行
				    if(thisObj.parents("tbody").find("tr:not(.total-last-tr)").length == 1){
						thisObj.parents("tbody").empty();
						//改变风险灯
						tableModel.find(".risk-img").attr("src",busiTripApply.riskExcMark);
					}
				    //删除当前行
				    thisObj.parents("tr").remove();
				    //更新当前表格的合计金额
				    sysCommon.updateMoneySum(costType,thisObj.parents("tr").find(".money-td").text());
				}
			});
		});
	},
	/**
	 * 
	 * 获取费用申请点击修改当前行的数据
	 * @param {Object} thisTr 当前行
	 */
	getTrCostInfoToForm:function(thisTr){
		//获取费用类型0.交通1.住宿2.其他
		var costType = $(thisTr).find(".hid-cost-type").val();
		//交通费
		if(costType == 0){
			//获取出差人的code
			var busiUser = $(thisTr).find("td:eq(0) .hid-traf-users").val();
			//获取出发日期
			var startDate = $(thisTr).find("td:eq(2)").text();
			//获取出发地点
			var startAddre = $(thisTr).find("td:eq(3) span").text();
			//到达日期
			var endDate = $(thisTr).find("td:eq(4)").text();
			//获取到达地点
			var endAddre = $(thisTr).find("td:eq(5)").text();
			//获取交通工具code
			var vehicles = 0;
			if($(thisTr).find("td:eq(6) input:eq(0)").val().indexOf(".") !=-1){
				vehicles = $(thisTr).find("td:eq(6) input:eq(0)").val().split(".");
			}
			var vehicle = "";
			//获取子级交通工具code
			var vehicleChildCode = "";
			if(vehicles.length > 0){
				vehicle = vehicles[1];
				vehicleChildCode = vehicles[2];
			}else{
				vehicle = $(thisTr).find("td:eq(6) input:eq(0)").val();
				vehicleChildCode = $(thisTr).find("td:eq(6) .hid-child-code").val();
			}
			//获取城市交通费
			var cityMoney =  $(thisTr).find("td:eq(7)").text();
			//获取特殊说明
			var cityMsg =  $(thisTr).find("td:eq(8)").text();
			
			$('#model-trip-user option[value="'+busiUser+'"]').attr("selected","selected");
			$("#traffic-start-time").val(startDate);
			$("#traffic-end-time").val(endDate);
			
			//出发地
			$("#fromcity").html('<option value='+$(thisTr).find("td:eq(3) input").val()+'>'+startAddre+'</option>');
			//调用获取出差地址方法
			busiTripApply.getPlanBusiAddress($("#fromcity"));
			//到达地
			$("#tocity").html('<option value='+$(thisTr).find("td:eq(5) input").val()+'>'+endAddre+'</option>');
			//调用获取出差地址方法
			busiTripApply.getPlanBusiAddress($("#tocity"));
			
			
			$('.traffic-form .vehicle-sel option[value="'+vehicle+'"]').attr("selected","selected");
			if(vehicleChildCode !=""){
				//显示出二级交通工具下拉
				$("#vehicleTwoDiv").show();
				//调用公用方法根据一级交通工具获取二级交通工具
				sysCommon.vechicleChildData(vehicle);
				$('.traffic-form .vehicle-two-sel option[value="'+vehicleChildCode+'"]').attr("selected","selected");
			}
			$(".traffic-form .city-cost-input").val(cityMoney);
			$("#special-remark").val((cityMsg == "--" ? "" : cityMsg));
			$('#model-trip-user,.traffic-form .vehicle-sel,.traffic-form .vehicle-two-sel').niceSelect();
			
			//改变风险灯
			if(vehicle !="" || vehicleChildCode !=""){
				$(".vehicle-sel").parents("td").find(".risk-img").attr("src",busiTripApply.riskViaImg);
			}
		}
		//住宿费
		if(costType == 1){
			//获取出差人的code
			var busiUser = $(thisTr).find("td:eq(0) input").val();
			//人均花销
			var dayMoney = $(thisTr).find("td:eq(3)").text();
			//住宿天数
			var hotelDay = $(thisTr).find("td:eq(4)").text();
			//住宿费
			var hotelMoney = $(thisTr).find("td:eq(5)").text();
			//住宿日期
			var hotelDate = $(thisTr).find("td:eq(2)").text();
			//住宿地点
			var hotelAddress = $(thisTr).find("td:eq(6) input").val();
			hotelAddress = hotelAddress.split("-");
			///获取特殊说明
			var textareMsg =  $(thisTr).find("td:eq(7)").text();
			$('#hotel-trip-user option[value="'+busiUser+'"]').attr("selected","selected");
			$(".hotel-form .yt-numberInput").val(hotelDay);
			if(hotelAddress.length == 3){
				busiTripApply.hotelAddressChild(hotelAddress[0],"CITY");
				busiTripApply.hotelAddressChild(hotelAddress[1],"AREA");
			}else if(hotelAddress.length == 2){
				busiTripApply.hotelAddressChild(hotelAddress[0],"CITY");
			}
			//住宿地点选中
			$.each(hotelAddress, function(i,n) {
				$('.hotel-addres-sel option[value="'+n+'"]').prop("selected","selected");
			});
			$(".hotel-form .hotel-money").val(hotelMoney);
			$("#peoDayMoney").text(dayMoney);
			$("#hotelDate").val(hotelDate);
			$(".hotel-form .hotel-msg").val((textareMsg == "--" ? "" : textareMsg));
			$('#hotel-trip-user,.hotel-addres-sel').niceSelect();
			//调用设置住宿费子级无数据设置禁用方法
			busiTripApply.hotelChildDisa("CITY");
			//调用设置住宿费子级无数据设置禁用方法
			busiTripApply.hotelChildDisa("AREA");
		}
		//其他费用
		if(costType == 2){
			//获取费用类型的code
			var costType = $(thisTr).find("td:eq(0) input").val();
			//费用金额
			var costMoney = $(thisTr).find("td:eq(1)").text();
			///获取特殊说明
			var textareMsg =  $(thisTr).find("td:eq(2)").text();
			$('#cost-type option[value="'+costType+'"]').attr("selected","selected");
			$(".other-form .other-money").val(costMoney);
			$(".other-form .other-msg").val((textareMsg == "--" ? "" : textareMsg));
			$('#cost-type').niceSelect();
		}
	},
	/**
	 * 
	 * 显示费用明细弹出框方法
	 * 
	 */
	showCostDetailModel:function(){
		//获取弹出框对象
		var costApplyModel = $("#cost-apply-model");
		//调用显示弹出框方法
		sysCommon.showModel(costApplyModel);
	    //调用费用明细弹出框操作事件方法
	    busiTripApply.costDetailModelEvent();
	    //调用公用的差旅报销明细填写Tab页切换事件方法
	    sysCommon.costDetailModelTabEvent();
	},
	/**
	 * 
	 * 
	 * 日期初始化
	 * 
	 */
	bodyDateInit:function(){
		/**
		 * 
		 * 费用明细交通费,出发日期到达日期
		 * 
		 */
		$("#traffic-start-time").calendar({
		controlId: "trafficStartTime",
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $("#traffic-end-time"), //开始日期最大为结束日期  
			speed:0,
			callback:function(){
				//调用公用的清除验证信息方法
				sysCommon.clearValidInfo($("#traffic-start-time"));
			}
		});
		$("#traffic-end-time").calendar({
			controlId: "trafficEndTime",
			nowData: false, //默认选中当前时间,默认true  
			lowerLimit: $("#traffic-start-time"), //结束日期最小为开始日期  
			speed:0,
			callback:function(){
				//调用公用的清除验证信息方法
				sysCommon.clearValidInfo($("#traffic-end-time"));
			}
		});
		/**
		 * 
		 * 
		 * 计划出发日期,计划返回日期
		 * 
		 * 
		 */
		$("#start-time").calendar({
			controlId: "startTime",
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $("#end-time"),//开始日期最大为结束日期  
			speed:0,
			callback:function(){
				//调用算天数方法
				var days = sysCommon.calculateDays($("#start-time").val(),$("#end-time").val());
				//隐藏自动计算文本
				$(".date-td .auto-font").hide();
				//显示计算天数
				$(".busi-day-show").show();
				$("#out-day-num").html(days);
				//调用公用的清除验证信息方法
				sysCommon.clearValidInfo($("#start-time"));
			}
		});
		$("#end-time").calendar({
			controlId: "endTime",
			nowData: false, //默认选中当前时间,默认true  
			lowerLimit: $("#start-time"),//开始日期最大为结束日期  
			speed:0,
			callback:function(){
				//调用算天数方法
				var days = sysCommon.calculateDays($("#start-time").val(),$("#end-time").val());
				//隐藏自动计算文本
				$(".date-td .auto-font").hide();
				//显示计算天数
				$(".busi-day-show").show();
				$("#out-day-num").html(days);
				//调用公用的清除验证信息方法
				sysCommon.clearValidInfo($("#end-time"));
			}
		});
		
		
		//住宿日期
		/*$("#hotelDate").calendar({
			controlId: "hotelTime",
			nowData: false, //默认选中当前时间,默认true  
			speed:0,
			callback:function(){
				//调用公用的清除验证信息方法
				sysCommon.clearValidInfo($("#hotelDate"));
			}
		});*/
	},
	/**
	 * 
	 * 格式化金额
	 * 
	 */
	formartMoney:function(thisObj){
		/*获取备用金，为空给出0*/
		if($(thisObj).val()  != "" && $(thisObj).val() != null ){
		  $(thisObj).val($yt_baseElement.fmMoney($(thisObj).val()));
		}
	},
	/**
		 * 显示业务员招待费
		 */
		showBusinessFun: function() {
			//其他区域隐藏
			$('.mod-div').hide();

			$('.business-div').show();

			//业务员招待费
			//showBusinessFun
			//一般费用
			//showGeneralFun
			//差旅
			//showTravelFun
			//培训
			//showTrainFun
			//会议
			//showMettingFun
		},
		/**
		 * 一般费用
		 */
		showGeneralFun: function() {
			//其他区域隐藏
			$('.mod-div').hide();
			//相关区域显示
			$('.general-div').show();

			//业务员招待费
			//showBusinessFun
			//一般费用
			//showGeneralFun
			//差旅
			//showTravelFun
			//培训
			//showTrainFun
			//会议
			//showMettingFun
		},
		/**
		 * 差旅
		 */
		showTravelFun: function() {
			//其他区域隐藏
			$('.mod-div').hide();
			//相关区域显示
			$('.travel-div').show();
		},
		/**
		 * 培训
		 */
		showTrainFun: function() {},
		/**
		 * 会议
		 */
		showMettingFun: function() {},

}
/**
 * 
 * 
 * 上传出差文件
 * 
 */
$(".travel-plan-form-model").undelegate().delegate(".cont-file", "change", function(obj) {
	var thisFile = $(this);
	var fileId = $(".file-btn-div input[type='file']").attr("id");
	var url = $yt_option.base_path + "fileUpDownload/upload?modelCode=SZ_TRAVEL_APP";
	$.ajaxFileUpload({
		url: url,
		type: "post",
		dataType: 'json',
		fileElementId: fileId,
		success: function(data, textStatus) {
			console.log(data);
			//获取ID
			$("#trip-file").val(data.pkId);
			/*调用获取附件名的方法*/
			busiTripApply.getFileUploadName(fileId,$(thisFile).parent().prev().find(".file-msg"));
		},
		error: function(data, status, e) //服务器响应失败处理函数  
		{
			$yt_alert_Model.prompt(data.msg, 2000);  
		}
	});
});
$(function() {
	busiTripApply.init();
});
