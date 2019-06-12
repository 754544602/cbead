var reimApply = {
	addressList:"",//全局的地区数据
	trObject:"",
	riskExcMark:"../../../../../resources-sasac/images/common/war-red.png",//风险感叹号图片
	riskWarImg:"../../../../../resources-sasac/images/common/risk-war.png",//风险未通过图片红灯
	riskViaImg:"../../../../../resources-sasac/images/common/risk-via.png",//风险通过图片绿灯
	/**
	 * 
	 * 初始化方法
	 * 
	 */
	init:function() {
		//获取当前登录用户信息
     	sysCommon.getLoginUserInfo();
		//所有下拉列表调用初始化生成方法
		$("#reimApply select:not(.testsel)").niceSelect();
		//调用初始化获取数据方法
		reimApply.getInitFunDatas();
		//调用初始化日期控件方法
		reimApply.bodyDateInit();
		//调用页面局部按钮点击事件(基本信息中的,费用申请中的)
		reimApply.localityFunBtnEvent();
		//初始化数字输入框
     	$yt_baseElement.numberInput($(".yt-numberInput-box"));  
     	//调用底部功能按钮操作事件
     	reimApply.bottomFunBtnEvent();
     	//初始获取风险提示信息数据
     	sysCommon.getRiskData("#reimApply");
     	$("#reimApply").css("min-height",($(window).height()-32)+"px");
     	
     	
     	reimApply.hotelRiskEvent();
	},
	/**
	 * 
	 * 住宿费中风险字段操作事件方法
	 * 
	 */
	hotelRiskEvent:function(){
		//获取当前触发风险点code
		var riskData = $("#peoDayMoney").data("riskData");
		/**
		 * 出差人操作事件
		 */
		$("#hotel-trip-user").on("change",function(){
			//调用验证相关联字段是否为空验证
			reimApply.hotelRiskComValid(riskData);
		});
		$("#hotelDate").on("blur",function(){
			if($(this).val() != ""){
				//调用验证相关联字段公用验证
				reimApply.hotelRiskComValid(riskData);
			}
		});
		/**
		 * 住宿日期操作事件
		 */
		$("#hotelDate").calendar({
			controlId: "hotelTime",
			nowData: false, //默认选中当前时间,默认true  
			speed:0,
			callback:function(){
				//调用验证相关联字段公用验证
			    reimApply.hotelRiskComValid(riskData);
				//调用公用的清除验证信息方法
				sysCommon.clearValidInfo($("#hotelDate"));
			}
		});
		/**
		 * 住宿天数操作事件
		 */
		//上下箭头点击事件
		$(".yt-spin").click(function(){
			//调用算取住宿费平均数方法
			reimApply.detalHotelHotelAvgPrice();
			//调用验证相关联字段公用验证
			reimApply.hotelRiskComValid(riskData);
		});
		//天数输入框失去焦点事件
		$(".yt-numberInput").on("blur",function(){
			//调用算取住宿费平均数方法
			reimApply.detalHotelHotelAvgPrice();
			//调用验证相关联字段公用验证
			reimApply.hotelRiskComValid(riskData);
		});
		/**
		 *住宿地点操作事件
		 */
		$("#hotelParentAddress,#hotelTwoAddres,#hotelChildAddres").on("change",function(){
			$("select.hotel-addres-sel").removeClass("check");
			$(this).addClass("check");
			//调用验证相关联字段公用验证
			reimApply.hotelRiskComValid(riskData);
		});
		/**
		 * 住宿费失去焦点事件
		 */
		$(".cost-detail-money").on("blur",function(){
			//调用算取住宿费平均数方法
			reimApply.detalHotelHotelAvgPrice();
           //调用验证相关联字段公用验证
			reimApply.hotelRiskComValid(riskData);
		});
	},
	/**
	 * 
	 * 获取相关字段信息,验证非空
	 * 
	 * @param {Object} riskData 风险数据
	 */
	hotelRiskComValid:function(riskData){
		var  validFlag = true;
		//获取相关字段信息
		//出差人
		var hotelTripUser = $("#hotel-trip-user").val();
		//住宿日期
		var hotelDates = $("#hotelDate").val();
		//住宿天数
		var hotelDay = $(".yt-numberInput").val();
		//省级
		var  parentAddresVal = $("#hotelParentAddress").val();
		//市级
		var  twoAddersVal = $("#hotelTwoAddres").val();
		//区级
		var  childAddresVal = $("#hotelChildAddres").val();
		//住宿费输入框
		var hotelPrice = $(".cost-detail-money").val();
		/**
		 * 
		 * 先判断非空
		 * 
		 */
		if(hotelTripUser !="" && hotelDates !="" && hotelDay !="" && parentAddresVal !="" && hotelPrice !="" && hotelPrice != "0.00"){
		  validFlag = true;
		  //改变风险灯为绿灯
		  //$('.hid-risk-code[value="'+riskData.pageFieldCode+'"]').next(".risk-img").attr("src",sysCommon.riskViaImg);
		}else{
			validFlag = false;
		   //改变风险灯为红灯
		  //$('.hid-risk-code[value="'+riskData.pageFieldCode+'"]').next(".risk-img").attr("src",sysCommon.riskWarImg);
		}
		/**
		 * 如果非空验证通过在验证其他字段
		 */
		if(validFlag){
		var addressArr = eval("("+riskData.ruleFormImpl+")");
		//获取住宿日期月份
		var months = new Date(hotelDates.replace(/-/g,"/"));
		months  = ","+parseInt(months.getMonth()+1)+",";
		//获取用户对象
		var userObj = sysCommon.getUserAllInfo("",$("#hotel-trip-user").val());
		//获取用户级别
		var level =  userObj[$("#hotel-trip-user").val()].jobLevelCode;
		var price = "";
		//获取平均数
		var avgHotelPrice = $("#peoDayMoney").text();
		avgHotelPrice = $yt_baseElement.rmoney(avgHotelPrice);
		//获取地区标识province省,city市,area区
		var  addressFlag = "";
		//市级
		if($(".hotel-form select.hotel-addres-sel.check").hasClass("hotel-parent-addres")){
			addressFlag = "province";
		}
		if($(".hotel-form select.hotel-addres-sel.check").hasClass("hotel-two-addres")){
			addressFlag = "city";
		}
		if($(".hotel-form select.hotel-addres-sel.check").hasClass("hotel-child-addres")){
			addressFlag = "area";
		}
		var  addressParentCode = "";
		if(addressFlag == "city"){
			addressParentCode = parentAddresVal;
		}else if(addressFlag == "area"){
			addressParentCode = twoAddersVal;
		}else{
			addressParentCode = parentAddresVal;
		}
		//获取当前选择的地区code
		var  thisAddressCode = $(".hotel-form select.hotel-addres-sel.check").val();
		if(thisAddressCode !="" && thisAddressCode !=undefined){
			thisAddressCode = "-" + thisAddressCode + "-";
		}
		var dataObj;
		if(addressArr !="" && addressArr !=null){
			//先获取数据对象
			if(parentAddresVal != ""){
				//得到对应省的对象
		    	dataObj = addressArr[parentAddresVal];
		    	if(dataObj !=undefined && dataObj !=null && dataObj !=""){
		    		//调用遍历淡季旺季公用方法 
				    var isExist =  getSeasonData(dataObj,thisAddressCode);
				    if(!isExist){
				    	//获取其他地区的数据
				    	if(dataObj.otherArea != null && dataObj.otherArea != undefined && dataObj.otherArea !=""){
				    		//选择市和区的时候
				    		if(addressFlag !=undefined && addressFlag !="" && addressFlag !="province"){
				    			//调用遍历淡季旺季公用方法 
					   			getSeasonData(dataObj.otherArea,addressParentCode);
				    		}
				    	}
				    }
		    	}else{
		    		//改变风险灯为红灯
				 	$('.hid-risk-code[value="'+riskData.pageFieldCode+'"]').next(".risk-img").attr("src",sysCommon.riskWarImg);
		    	}
			}
		}
		/**
		 * 遍历淡季旺季公用方法
		 * @param {Object} dataObj  数据对象
		 * @param {Object} addresCodes 地址code
		 */
		function getSeasonData(dataObj,addresCodes){
			var   existFlag = false;
			//先判断数据对象是否有值
			if(dataObj != undefined && dataObj !=null && dataObj !=""){
				//遍历淡季的值
			    if(dataObj.lowSeason !="" && dataObj.lowSeason.length>0 && dataObj.lowSeason !=null && dataObj.lowSeason !=undefined){
			    	$.each(dataObj.lowSeason, function(i,n) {
			    		n.city = "-"+ n.city +"-";
			    		//检索是否包含改地区
			    		if(addresCodes !="" && n.city.indexOf(addresCodes) > -1){
			    			//判断标准费用
			    			if(n.amount != null && n.amount != undefined){
			    				//得到当前级别的住宿费用标准
								price = n.amount[level];
								if(avgHotelPrice != "" && avgHotelPrice != "0.00"){
									//判断是否超标
									if(avgHotelPrice > price){
										//改变风险灯为红灯
				 						$('.hid-risk-code[value="'+riskData.pageFieldCode+'"]').next(".risk-img").attr("src",sysCommon.riskWarImg);
									}else{
										//改变风险灯为绿灯
				  						$('.hid-risk-code[value="'+riskData.pageFieldCode+'"]').next(".risk-img").attr("src",sysCommon.riskViaImg);
									}
								}
			    			}
			    			existFlag = true;
			    			return false;
			    		}else{
			    			//如果当前选择的不是区,且检索不到,则给红灯
			    			if(addressFlag !=undefined && addressFlag !="" && addressFlag != "area"){
			    				$('.hid-risk-code[value="'+riskData.pageFieldCode+'"]').next(".risk-img").attr("src",sysCommon.riskWarImg);
			    			}
			    		}
			    	});
			    }
			    price = "" ;
		    	//遍历旺季的值
			    if(dataObj.highSeason != undefined && dataObj.highSeason != "" && dataObj.highSeason.length>0 && dataObj.highSeason != null){
			    	$.each(dataObj.highSeason, function(i,n) {
			    		n.city = "-"+ n.city +"-";
			    		//先检索地区是否存在
			    		if(addresCodes !="" && n.city.indexOf(addresCodes) > -1){
			    			//检索月份是否存在
			    			if(n.month != undefined && n.month !=null && n.month !=""){
			    				n.month = "," + n.month + ",";
			    				if(n.month.indexOf(months) > -1){
			    					//判断标准费用
					    			if(n.amount != null && n.amount != undefined){
					    				//得到当前级别的住宿费用标准
										price = n.amount[level];
										if(avgHotelPrice != "" && avgHotelPrice != "0.00"){
											//判断是否超标
											if(avgHotelPrice > price){
												//改变风险灯为红灯
						 						$('.hid-risk-code[value="'+riskData.pageFieldCode+'"]').next(".risk-img").attr("src",sysCommon.riskWarImg);
											}else{
												//改变风险灯为绿灯
						  						$('.hid-risk-code[value="'+riskData.pageFieldCode+'"]').next(".risk-img").attr("src",sysCommon.riskViaImg);
											}
										}
					    			}
			    				}else{
			    					return false;
			    				}
			    			}
			    			existFlag = true;
			    			return false;
			    		}
			    	});
			    }
			}else{
				//改变风险灯为红灯
				$('.hid-risk-code[value="'+riskData.pageFieldCode+'"]').next(".risk-img").attr("src",sysCommon.riskWarImg);
			}
			return existFlag;
		}
		}
	},
	/**
	 * 
	 * 
	 * 初始化获取功能数据
	 * 
	 */
	getInitFunDatas:function(){
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
					dictTypeCode:"VEHICIE_CODE,HOTEL_ADDRESS,COST_TYPE"
				},
				success: function(data) {
					if(data.flag == 0){
						var optionText = '<option value="">请选择</option>';
						$.each(data.data, function(i,n) {
							/**
							 * 
							 * 获取交通工具数据
							 * 
							 */
							if(n.dictTypeCode == "VEHICIE_CODE"){
								optionText = '<option value="'+n.value+'">'+n.disvalue+'</option>';
								$(".vehicle-sel").append(optionText);
								$(".vehicle-sel").niceSelect();
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
						    			$(this).parent().find(".risk-img").attr("src",reimApply.riskViaImg);
						    		}else{
						    			$(this).parent().find(".risk-img").attr("src",reimApply.riskWarImg);
						    		}
						    	});
							}
						});
						 /**
					      * 
					      * 费用明细弹出框交通费,交通工具选中事件
					      * 
					      */
					    $(".vehicle-sel").on("change",function(){
					    	var selVal = $("select.vehicle-sel").val();
							//调用公用根据一级交通工具获取二级交通工具
							sysCommon.vechicleChildData(selVal);
							
						});
					}
				}
			});
		/**
		 * 
		 * 调用获取审批流程数据方法
		 * 
		 */
		sysCommon.getApproveFlowData("SZ_REIM_APP");
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
				reimApply.addressList = data ;
			}
		});
		//调用遍历地区数据方法
		reimApply.getAddressList();
	},
	/**
	 * 
	 * 
	 * 获取住宿费地区
	 * 
	 */
	getAddressList:function(){
		//遍历省份
        $.each(reimApply.addressList, function(i, n) {
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
			reimApply.hotelAddressChild(thisSel.val(),"CITY");
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
			reimApply.hotelAddressChild(thisSel.val(),"AREA");
		});
	},
	/**
	 * 住宿费,住宿地点子级获取数据
	 * @param {Object} addressCode  地区code
	 * @param {Object} addressLevel 地区级别
	 */
	hotelAddressChild:function(addressCode,addressLevel){
		$.each(reimApply.addressList, function(i, n) {
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
        //调用设置住宿费子级无数据禁用
        reimApply.hotelChildDisa(addressLevel);
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
	 * 
	 * 获取风险提示信息数据
	 * 
	 */
	getRiskData:function(){
		//调用获取风险字段方法
		$.ajax({
				type: "post",
				url:'basicconfig/risk/getSystemRiskByParams',
				async: false,
				success: function(data) {
					if(data.flag == 0){
						var resultData = ",";
						$.each(data.data,function (i,n){
							resultData += n.pageFieldCode+',';
						});
						reimApply.comRiskCodes = resultData;
						reimApply.riskData = data.data;
						//遍历页面中的风险字段
						var riskCodes = "";
						$(".hid-risk-code").each(function(i,n){
							riskCodes = ","+$(n).val()+",";
							//判断与获取数据比对code是否相同存在,有则显示风险标识,并且不是出差文件的
							if(reimApply.comRiskCodes.indexOf(riskCodes) >= 0){
								$(n).parent().show();
							}
						});
						//调用风险灯点击事件
						reimApply.riskClickEvent();
					}
				}
			});
	},
	/**
	 * 
	 * 
	 * 风险灯点击事件
	 * 
	 */
	riskClickEvent:function(){
		$("#reimApply .risk-model").off().on("click",function(){
			//调用根据风险code显示提示信息方法
			reimApply.showRiskMsg($(this).find(".hid-risk-code").val());
			
		});
	},
	/**
	 * 
	 * 根据风险code显示提示信息
	 * @param {Object} riskCode 风险code
	 */
	showRiskMsg:function(riskCode){
		$.each(reimApply.riskData, function(i,n) {
			if(riskCode == n.pageFieldCode){
				//判断选中的值是否是费用明细弹出框中的,交通工具,住宿费,费用类型
				if(n.pageFieldCode == "costDetailVehicle" || n.pageFieldCode == "costDetailHotelCost"){
					//隐藏费用明细弹出框
					$("#cost-apply-model").hide();
				}
				//拼接提示信息政策法规标题加上正文加上关键字
				var  riskMsg = '<div>'+n.lawsTitle + n.riskLawsContents + '<a class="yt-link risk-link">'+n.linkKeyWord+'</a></div>';
				riskMsg = $(riskMsg);
				riskMsg.find(".risk-link").data("riskLink",n.linkContents);
				$yt_alert_Model.alertOne({
					haveCloseIcon: true, //是否带有关闭图标  
					leftBtnName: "确定", //左侧按钮名称,默认确定  
					cancelFunction: "", //取消按钮操作方法*/  
					alertMsg:riskMsg, //提示信息  
					cancelFunction: function() {
						//判断选中的值是否是费用明细弹出框中的,交通工具,住宿费,费用类型
						if(n.pageFieldCode == "costDetailVehicle" || n.pageFieldCode == "costDetailHotelCost"){
							//显示费用明细弹出框
							$("#cost-apply-model").show();
							//显示顶部隐藏蒙层
							$("#heard-nav-bak,#pop-modle-alert").show();
							//调用显示全局蒙层的方法
				   			$yt_baseElement.showMongoliaLayer();
				   			//调用算取弹出框位置的方法
							$yt_alert_Model.getDivPosition($("#cost-apply-model"));
							//隐藏页面滚动条
							$("body").css("overflow","hidden");
						}
					},
				});
				
				
			}
		});
		//提示信息中的关键字点击事件
		$(".risk-link").on("click",function(){
			sysCommon.riskLinkModel($(this).data("riskLink"));
		});
	},
	/**
	 * 
	 * 
	 * 页面局部按钮点击事件(基本信息中,费用申请中)
	 * 
	 */
	localityFunBtnEvent:function(){
		/**
		 * 
		 * 
		 * 点击费用申请新增按钮
		 * 
		 */
		$("#addCostApplyBtn").off("click").on("click",function(){
			//调用 显示费用明细弹出框方法
			reimApply.showCostDetailModel();
		});
	    /**
	     * 
	     * 点击出差审批单输入框
	     * 
	     */
	    $("#busiApproForm").off().on("click",function(){
	    	/**
	    	 * 
	    	 * 1.显示出差审批单弹出框
	    	 * 
	    	 */
	    	var busiAproFormModel = $("#busiAproFormModel");
	    	//调用获取出差审批单列表方法
			reimApply.getBusiTripApproveList($("#keywordInpu").val());
	    	//调用显示弹出框方法
			sysCommon.showModel(busiAproFormModel);
			//调用弹出框中操作事件方法
			reimApply.busiApproFormModelEvent();
	    });
	    /**
	     * 
	     * 点击借款单输入框
	     * 
	     */
	    $("#loanFrom").off().on("click",function(){
	    	//获取弹出框对象
	    	var loanFormModel = $("#loanFormModel");
			//调用获取借款单列表方法
			reimApply.getLoanFormList($("#loanKeyWord").val());
			//调用显示弹出框方法
			sysCommon.showModel(loanFormModel);
			//调用弹出框中操作事件方法
			reimApply.loanFormModelEvent(loanFormModel);
	    });
	    /**
	     * 
	     * 点击从出差审批单导入数据按钮
	     * 
	     */
	    $("#importDataBtn").off().on("click",function(){
	    	//调用获取出差审批单数据方法
	    	reimApply.getBusiTripFormData();
	    });
	    
	    /**
		 * 
		 * 补助金额表格中金额输入框事件
		 * 
		 */
		$("#replacementTab input").on("focus",function(){
			if($(this).val()!="" && $(this).val() !=null){
				$(this).val($yt_baseElement.rmoney($(this).val()));
				$(this).select();
			}
		});
		$("#replacementTab input").on("blur",function(){
			reimApply.formartMoney($(this));
		});
		$("#replacementTab input").keyup(function(i,n){
			//补领金额合计
			var sum = 0.00;
			$(".repl-way-inpu").each(function(i,n){
				sum += $yt_baseElement.rmoney($(n).val());
			});
			sum = $yt_baseElement.fmMoney(sum);
            //补助金额合计
            $("#replPriceSum").text(sum);
		});
	},
	/**
	 * 获取出差审批单列表
	 * @param {Object} keyWord 关键字
	 */
	getBusiTripApproveList:function(keyWord){
		//获取tbody对象
		var approveFormTbody = $("#busiAproFormModel .appro-list-model table tbody");
		$('.approve-page').pageInfo({
			pageIndex: 1,
			pageNum: 5, //每页显示条数  
			pageSize: 2, //显示...的规律  
			url: "sz/travelApp/getUserTravelAppListByParams", //ajax访问路径  
			type: "get", //ajax访问方式 默认 "post"
			async: false, //ajax 访问类型 默认 true 异步,false同步 
			objName: 'data',
			data:{
				queryParams:keyWord
			},
			success: function(data) {
				approveFormTbody.empty();
				if(data.flag == 0){
					var trStr = "";
					if(data.data.rows.length > 0){
						//显示分页
					  	$('.approve-page').show();
						$.each(data.data.rows,function(i,n){
							trStr = '<tr>'
						       + '<td>'+n.travelAppNum+'<input type="hidden" class="form-id" value="'+n.travelAppId+'"/><input type="hidden" class="hid-user-codes" value="'+n.travelPersonnels+'"/>'
						       +'</td>'
						       + '<td>'+n.travelAppName+''
						       + '<input type="hidden" class="hid-users-num" value="'+(n.travelPersonnelNum == "" ? "--" : n.travelPersonnelNum)+'"/>'
						       + '<input type="hidden" class="hid-rec-give" value="'+(n.receptionCostItem == "" ? "--" : n.receptionCostItem)+'"/>'
						       + '<input type="hidden" class="hid-prj" value="'+(n.prjName == "" ? "--" : n.prjName)+'"/>'
						       + '<input type="hidden" class="hid-dept" value="'+(n.prjDeptName == "" ? "--" : n.prjDeptName)+'"/>'
						       + '</td>'
						       + '</tr>';
						    approveFormTbody.append(trStr);
						});
					}else{
					  //隐藏分页
					  $('.approve-page').hide();
					  var noTr = '<tr class="model-no-data-tr"><td colspan="2"><div class="no-data"><img src="../../../../../resources-sasac/images/common/no-data.png" alt=""></div></td></tr>';
					  approveFormTbody.append(noTr);
					}
				}
			} //回调函数 匿名函数返回查询结果  
		});
	},
	/**
	 * 获取借款单列表数据
	 * @param {Object} keyWord 关键字
	 */
	getLoanFormList:function(keyWord){
		//获取tbody对象
		var loanTbody = $("#loanFormModel .loan-list-model table tbody");
		$('.loan-page').pageInfo({
			pageIndex: 1,
			pageNum: 5, //每页显示条数  
			pageSize: 2, //显示...的规律  
			url: "sz/loanApp/getUserLoanAppInfoListToPageByParams", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"
			async: false, //ajax 访问类型 默认 true 异步,false同步 
			objName: 'data',
			data:{
				queryParams:keyWord
			},
			success: function(data) {
				
				loanTbody.empty();
				if(data.flag == 0){
					var trStr = "";
					if(data.data.rows.length > 0){
						//显示分页
					  	$('.loan-page').show();
						$.each(data.data.rows,function(i,n){
							trStr = '<tr>'
						       + '<td>'+n.loanAppNum+'<input type="hidden" class="loan-id" value="'+n.loanAppId+'"/>'
						       + '</td>'
						       + '<td style="text-align: right;">'+(n.loanAmount == "" ? "--" : $yt_baseElement.fmMoney(n.loanAmount))+'</td>'
						       + '</tr>';
						    loanTbody.append(trStr);
						});
					}else{
					  //隐藏分页
					  $('.loan-page').hide();
					  var noTr = '<tr class="model-no-data-tr"><td colspan="2"><div class="no-data"><img src="../../../../../resources-sasac/images/common/no-data.png" alt=""></div></td></tr>';
					  loanTbody.append(noTr);
					}
				}
			} //回调函数 匿名函数返回查询结果  
		});
	},
	/**
	 *  借款单弹出框操作事件
	 * @param {Object} modelObj 弹出框对象
	 */
	loanFormModelEvent:function(modelObj){
	    /**
		 * 查询按钮点击事件
		 */
		$("#loanSearchBtn").off().on("click",function(){
			//调用获取借款单列表方法
			reimApply.getLoanFormList($("#loanKeyWord").val());
		});
		/**
		 * 重置按钮点击事件
		 */
		$("#loanResetBtn").off().on("click",function(){
			//清空输入框
			$("#loanKeyWord").val('');
			//调用获取借款单列表方法
			reimApply.getLoanFormList($("#loanKeyWord").val());
		});
		
		/**
		 * 单选一行数据
		 */
		$('#loanFormModel tbody').on('click', 'tr', function() {
			$('#loanFormModel tbody tr').removeClass("yt-table-active");
			$(this).addClass("yt-table-active");
		});
		//列表数据双击
		$('#loanFormModel tbody:not(.page-info table tbody)').on('dblclick', 'tr', function() {
		    $("#loanFrom").val($(this).find("td:eq(0)").text());
		    //借款金额和冲销金额
			$("#loanPrice,#loanCost").text($(this).find("td:eq(1)").text());
			$("#hidLoanFormId").val($(this).find(".loan-id").val());
			//计算补领金额
			var replPrice = 0;
		    var loanPrice = $("#loanCost").text();
		    if($("#reimPrice").text() != "" && $("#reimPrice").text() !="0.00"){
		    	replPrice = $yt_baseElement.rmoney($("#reimPrice").text()) - $yt_baseElement.rmoney($(this).find("td:eq(1)").text());
		    }
		    replPrice = $yt_baseElement.fmMoney(replPrice);
		    $("#givePrice").text(replPrice);
			//清空输入框
			$("#loanKeyWord").val('');
			//调用关闭可编辑弹出框方法
			sysCommon.closeModel(modelObj);
		});
		//点击确定按钮
		$("#loanSureBtn").off().on("click",function(){
			//获取选中行数据
			var  thisSelTr = $('#loanFormModel tbody tr.yt-table-active');
			if(thisSelTr != "" && thisSelTr.length>0){
				$("#loanFrom").val(thisSelTr.find("td:eq(0)").text());
				//借款金额和冲销金额
				$("#loanPrice,#loanCost").text(thisSelTr.find("td:eq(1)").text());
				$("#hidLoanFormId").val(thisSelTr.find(".loan-id").val());
				//计算补领金额
			    var loanPrice = $("#loanCost").text();
			    var replPrice = $yt_baseElement.rmoney($("#reimPrice").text()) - $yt_baseElement.rmoney(thisSelTr.find("td:eq(1)").text());
			    replPrice = $yt_baseElement.fmMoney(replPrice);
			}else{
				$("#loanFrom,#hidLoanFormId").val('');
				$("#loanPrice,#loanCost").text("0.00");
			}
			//清空输入框
			$("#loanKeyWord").val('');
			//调用关闭可编辑弹出框方法
			sysCommon.closeModel(modelObj);
		});
		/**
		 * 取消按钮点击事件
		 */
		$("#loanCanelBtn").off().on("click",function(){
			$("#loanKeyWord").val('');
			//调用关闭可编辑弹出框方法
			sysCommon.closeModel(modelObj);
		});
	},
	/**
	 * 
	 * 出差审批单弹出框中操作事件
	 * 
	 */
	busiApproFormModelEvent:function(){
		//获取弹出框对象
		var busiApproFormModel = $("#busiAproFormModel");
		/**
		 * 查询按钮点击事件
		 */
		$("#aproSearchBtn").off().on("click",function(){
			//调用获取出差审批单列表方法
			reimApply.getBusiTripApproveList($("#keywordInpu").val());
		});
		/**
		 * 重置按钮点击事件
		 */
		$("#aproRestBtn").off().on("click",function(){
			//清空输入框
			$("#keywordInpu").val('');
			//调用获取出差审批单列表方法
			reimApply.getBusiTripApproveList($("#keywordInpu").val());
		});
		
		/**
		 * 单选一行数据
		 */
		$('#busiTripTab tbody').on('click', 'tr', function() {
			$('#busiTripTab tbody tr').removeClass("yt-table-active");
			$(this).addClass("yt-table-active");
		});
		//列表数据双击
		$('#busiTripTab tbody:not(.page-info table tbody)').on('dblclick', 'tr', function() {
			//调用获取出差审批单弹出框选中行数据
		    reimApply.getBusiAppSelTrData($(this));
		    //隐藏报销明细标题
		    $(".reim-detail-model").hide();
		    //显示出报销列表区域和流程审批区域
		    $(".cost-apply-model,.flow-approve-model").show();
		    //调用获取差旅费明细弹出框中的出差人数据
		    reimApply.getTravelBusiUsersInfo($(this).find(".hid-user-codes").val());
		});
		/**
		 * 确定按钮点击事件
		 */
		$("#aproSureBtn").off().on("click",function(){
			//获取选中行数据
			var  thisSelTr = $('#busiTripTab tbody tr.yt-table-active');
			if(thisSelTr != "" && thisSelTr.length>0){
				//调用获取出差审批单弹出框选中行数据
				reimApply.getBusiAppSelTrData(thisSelTr);
				//替换风险灯图标未通过绿灯
				$("#busiApproForm").parent().find(".risk-img").attr("src",reimApply.riskViaImg);
				//隐藏报销明细标题
			    $(".reim-detail-model").hide();
			    //显示出报销列表区域和流程审批区域
			    $(".cost-apply-model,.flow-approve-model").show();
			    //调用获取差旅费明细弹出框中的出差人数据
		   		reimApply.getTravelBusiUsersInfo(thisSelTr.find(".hid-user-codes").val());
			}else{
				//单号,单号ID
				$("#busiApproForm,#approId").val('');
				//清空事由,人数,接待方提供
				$("#busiBecause,#busiUserNum,#receptionGive").text('');
				//清空所属项目,部门
				$("#byPpsPrj,#deptBy").text("--");
				//显示验证提示
				$(".base-info-form-modle .war-model").show();
				//替换风险灯图标为红灯
				$("#busiApproForm").parent().find(".risk-img").attr("src",reimApply.riskWarImg);
				//显示报销明细标题
			    $(".reim-detail-model").show();
			    //隐藏出报销列表区域和流程审批区域
			    $(".cost-apply-model,.flow-approve-model").hide();
			    //清空差旅报销明细弹出框中,出差人下拉列表数据
			    $("#model-trip-user,#hotel-trip-user").empty().append('<option value="">请选择</option>');
			     $("#model-trip-user,#hotel-trip-user").niceSelect();	
			}
			//清空输入框
			$("#keywordInpu").val('');
			//调用关闭可编辑弹出框方法
			sysCommon.closeModel(busiApproFormModel);
		});
		/**
		 * 取消按钮点击事件
		 */
		$("#aproCanelBtn").off().on("click",function(){
			$("#keywordInpu").val('');
			//调用关闭可编辑弹出框方法
			sysCommon.closeModel(busiApproFormModel);
		});
	},
	/**
	 * 
	 * 获取差旅明细弹出框中的出差人信息
	 * @param {Object} userCodes
	 */
	getTravelBusiUsersInfo:function(userCodes){
		$.ajax({
			type: "post",
			url:'user/userInfo/getAllUserObjectsByParams',
			async: false,
			data:{
				userIds:"",
				userCodes:userCodes,
				userName:""
			},
			success: function(data) {
				if(data.flag == 0){
					//option html
					var optionText = '<option value="">请选择</option>';
					$("#model-trip-user,#hotel-trip-user").empty().append(optionText);
					var usersCodesList = userCodes.split(",");
					if(usersCodesList.length > 0){
						$.each(usersCodesList, function(i,n) {
							optionText = '<option value="'+data.data[n].userItcode+'" data-level="'+data.data[n].jobLevelCode+'">'+data.data[n].userName+'</option>';
						    $("#model-trip-user,#hotel-trip-user").append(optionText);
						});
					}else{
						 $("#model-trip-user,#hotel-trip-user").append(optionText);
					}
					$("#model-trip-user,#hotel-trip-user").niceSelect();
					
				}
			}
		});
	},
	/**
	 * 
	 * 获取出差审批单弹出框选中行数据
	 * 
	 * @param {Object} thisTr 当前选中行
	 */
	getBusiAppSelTrData:function(thisTr){
		//获取弹出框对象
		var busiApproFormModel = $("#busiAproFormModel");
		//单子ID
		$("#approId").val($(thisTr).find(".form-id").val());
		//单号
		$("#busiApproForm").val($(thisTr).find("td:eq(0)").text());
		//事由
		$("#busiBecause").text($(thisTr).find("td:eq(1)").text());
		/**
		 * 
		 * 注意:人数,接待方提供,所属项目,部门字段,表格内未显示,后期后台返回再动态添加,现给默认
		 * 
		 */
		//人数
		$("#busiUserNum").text($(thisTr).find(".hid-users-num").val());
		
		var  reception = ($(thisTr).find(".hid-rec-give").val()).split(",");
		var receps ="";
		$.each(reception, function(i,n) {
			if(n == 1){
			   receps += "住宿费"+"、";
			}
			else if(n == 2){
			   receps += "伙食费"+"、";
			}
			else if(n == 3){
			   receps += "市内交通费"+"、";
			}else{
			   receps = "--、";
			}
		});
		receps = receps.substring(0,receps.length-1);
		//接待方提供
		$("#receptionGive").text(receps);
		//所属项目
		$("#byPpsPrj").text($(thisTr).find(".hid-prj").val());
		//部门
		$("#deptBy").text($(thisTr).find(".hid-dept").val());
		//隐藏验证提示
		$(".base-info-form-modle .war-model").hide();
		//清空输入框
		$("#keywordInpu").val('');
		//调用关闭可编辑弹出框方法
		sysCommon.closeModel(busiApproFormModel);
		//替换风险灯图标
		$("#busiApproForm").parent().find(".risk-img").attr("src","../../../../../resources-sasac/images/common/risk-via.png");
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
		    reimApply.costDetailModelEvent();
		    //调用公用的差旅报销明细填写Tab页切换事件方法
		    sysCommon.costDetailModelTabEvent();
		    //调用风险灯点击事件
		    sysCommon.riskMsgClickEvent($("#reimApply"));
	},
	/**
	 * 
	 * 
	 * 获取出差审批单中的数据
	 * 
	 */
	getBusiTripFormData:function(){
		$.ajax({
			type:"post",
			url:"sz/travelApp/getTravelAppCostAppListByTravelAppId",
			async: false,
			data:{
				travelAppId:$("#approId").val()
			},
			success: function(data) {
				var costDatas = data.data;
				if(data.flag  == 0){
					//清空报销单列表中的表格数据
	    			$("#traffic-list-info tbody,#hotel-list-info tbody,#other-list-info tbody,#subsidy-list-info tbody").empty();
	    			//改变风险灯为默认
	    			$(".cost-list-model .cost-list-title .risk-img").attr("src",reimApply.riskExcMark);
					/**
					 * 交通费数据
					 */
					if(costDatas.costCarfareList.length > 0){
						//调用生成合计行方法
						reimApply.createSumTr(0);
						var trafficCostStr = "";
						var  vehicleName = "";
						$.each(costDatas.costCarfareList, function(i,n) {
							//拼接交通费表格数据
						    trafficCostStr = '<tr>'
						                   + '<td><span>'+n.travelPersonnelName+'</span><input type="hidden" data-val="travelPersonnel" class="hid-traf-users" value="'+n.travelPersonnel+'"/></td><td>'+n.jobLevelName+'</td>'
						                   + '<td data-text="goTime">'+n.goTime+'</td><td data-text="goAddress">'+n.goAddress+'</td><td data-text="arrivalTime">'+n.arrivalTime+'</td>'
						 				   + '<td data-text="arrivalAddress">'+n.arrivalAddress+'</td>';
						 				 trafficCostStr  += '<td><span>'+n.vehicleName+'</span><input type="hidden" data-val="vehicle" class="hid-vehicle" value="'+n.vehicle+'"/>'
						 				   +'<input class="hid-child-code" type="hidden" value=""/></td>'
						 				   + '<td class="font-right money-td" data-text="crafare">'+(n.crafare == "" ? "0.00" : $yt_baseElement.fmMoney(n.crafare))+'</td>'
						 				   + '<td class="text-overflow-sty" title="'+n.remarks+'" data-text="remarks">'+(n.remarks == "" ? "--" : n.remarks)+'</td>'
						 				   + '<td>'
						 				   + '<input type="hidden" class="hid-set-met" data-val="setMethod"/>'
						 				   + '<input type="hidden" class="hid-cost-type" value="0"/>'
						 				   + '<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>'
						 				   + '<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>'
										   + '</td></tr>';   
						   $("#traffic-list-info tbody .total-last-tr").before(trafficCostStr);	
						});
						//调用合计方法
						sysCommon.updateMoneySum(0);
						//调用操作列事件方法
						reimApply.costApplyTabOperateEvent();
						//改变风险灯图标绿灯
						$("#traffic-list-info").parent().find(".cost-list-title .risk-img").attr("src",reimApply.riskViaImg);
						//调用风险灯点击事件
						reimApply.riskClickEvent();
					}
					/**
					 * 住宿费
					 */
					if(costDatas.costHotelList.length>0){
						//调用生成合计行方法
						reimApply.createSumTr(1);
						var  hotelCostStr ="";
						var  avgHotelMoney = 0.00;
						$.each(costDatas.costHotelList, function(i,n) {
							if(n.hotelExpense != ""){
								avgHotelMoney = n.hotelExpense/n.hotelDays;
							}
							hotelCostStr = '<tr>'
	         				  + '<td><span>'+n.travelPersonnelName+'</span><input type="hidden" data-val="travelPersonnel" value="'+n.travelPersonnel+'"/></td><td>'+n.jobLevelName+'</td>'
	         				  + '<td data-text="hotelTime">'+n.hotelTime+'</td>'
	         				  + '<td class="font-right">'+($yt_baseElement.fmMoney(avgHotelMoney))+'</td>'
	         				  + '<td data-text="hotelDays">'+n.hotelDays+'</td><td class="font-right money-td" data-text="hotelExpense">'+(n.hotelExpense == "" ? "0.00" :$yt_baseElement.fmMoney(n.hotelExpense))+'</td>'
	         				  + '<td><span data-text="hotelAddressName">'+n.hotelAddressName+'</span><input type="hidden" data-val="hotelAddress" value="'+n.hotelAddress+'"</td>'
	         				  + '<td class="text-overflow-sty" title="'+n.remarks+'" data-text="remarks">'+(n.remarks == "" ? "--" : n.remarks)+'</td>'
	         				  + '<td>'
	         				  + '<input type="hidden" class="hid-set-met" data-val="setMethod"/>'
	         				  + '<input type="hidden" class="hid-cost-type" value="1"/>'
	         				  + '<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>'
			 				  + '<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>'
	         				  + '</td></tr>';
							$("#hotel-list-info tbody .total-last-tr").before(hotelCostStr);
						});
						//调用合计方法
						sysCommon.updateMoneySum(1);
						//调用操作列事件方法
						reimApply.costApplyTabOperateEvent();
						//改变风险灯图标绿灯
						$("#hotel-list-info").parent().find(".cost-list-title .risk-img").attr("src",reimApply.riskViaImg);
						//调用风险灯点击事件
						reimApply.riskClickEvent();
					}
					/**
					 * 其他费用
					 */
					if(costDatas.costOtherList.length>0){
						//调用生成合计行方法
						reimApply.createSumTr(2);
						var otherCostStr ="";
						$.each(costDatas.costOtherList, function(i,n) {
							otherCostStr = '<tr>'
							             + '<td><span>'+n.costTypeName+'</span>'
							             + '<input type="hidden" data-val="costType" value="'+n.costType+'"></td>'
							             + '<td class="font-right money-td" data-text="reimAmount">'+(n.reimAmount == "" ? "0.00" :$yt_baseElement.fmMoney(n.reimAmount))+'</td>'
							             + '<td class="text-overflow-sty" data-text="remarks" title="'+n.remarks+'">'+n.remarks+'</td>'
							             + '<td>'
							             + '<input type="hidden" class="hid-set-met" data-val="setMethod"/>'
							             + '<input type="hidden" class="hid-cost-type" value="2">'
							             + '<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>'
							             + '<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>'
							             + '</td></tr>';
							$("#other-list-info tbody .total-last-tr").before(otherCostStr);
						});
						//调用合计方法
						sysCommon.updateMoneySum(2);
						//调用操作列事件方法
						reimApply.costApplyTabOperateEvent();
						//改变风险灯图标绿灯
						$("#other-list-info").parent().find(".cost-list-title .risk-img").attr("src",reimApply.riskViaImg);
						//调用风险灯点击事件
						reimApply.riskClickEvent();
					}
					/**
					 * 
					 * 补助明细
					 * 
					 */
					if(costDatas.costSubsidyList.length>0){
						//调用生成合计行方法
						reimApply.createSumTr(3);
						var subsidyStr = "";
						$.each(costDatas.costSubsidyList, function(i,n) {
							subsidyStr = '<tr><td><span>'+n.travelPersonnelName+'</span><inpu type="hidden" data-val="travelPersonnel" value="'+n.travelPersonnel+'"/></td>'
							           + '<td><span>'+n.jobLevelName+'</span></td>'
							           + '<td><span data-text="subsidyDays">'+n.subsidyDays+'</span></td>'
							           + '<td class="font-right"><span class="food-money" data-text="subsidyFoodAmount">'+(n.subsidyFoodAmount == "" ? "0.00" :$yt_baseElement.fmMoney(n.subsidyFoodAmount))+'</span></td>'
							           + '<td class="font-right"><span class="city-money" data-text="carfare">'+(n.carfare == "" ? "0.00" :$yt_baseElement.fmMoney(n.carfare))+'</span></td>'
							           + '<td>'
							           + '<input type="hidden" class="hid-set-met" data-val="setMethod"/>'
					 				   + '<input type="hidden" class="hid-cost-type" value="3"/>'
					 				   + '<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>'
									   + '</td>'
							           + '</tr>';
							$("#subsidy-list-info tbody .total-last-tr").before(subsidyStr);
						});
						//调用合计方法
						sysCommon.updateMoneySum(3);
						//调用操作列事件方法
						reimApply.costApplyTabOperateEvent();
						//改变风险灯图标绿灯
						$("#subsidy-list-info").parent().find(".cost-list-title .risk-img").attr("src",reimApply.riskViaImg);
						//调用风险灯点击事件
						reimApply.riskClickEvent();
					}
				}
			}
		});
	}
	,
	/**
	 * 
	 * 页面底部功能按钮操作事件
	 * 
	 */
	bottomFunBtnEvent:function(){
		/**
		 * 
		 * 
		 * 提交生成报销单点击事件
		 * 
		 * 
		 */
		$("#subCreateFormBtn,#applySaveBtn,#lookReimBtn").off().on("click",function(){
			//按钮标识0提交1保存
			var btnFlag;
			var thisBtn = $(this);
			//接口访问路径
			var ajaxUrl = "";
			//提交
			if(thisBtn.hasClass("sub-btn")){
				btnFlag = 0;
				ajaxUrl = "sz/reimApp/submitReimAppInfo";
			}
			//保存
			if(thisBtn.hasClass("save-btn")){
				btnFlag = 1;
				ajaxUrl = "sz/reimApp/saveReimAppInfoToDrafts";
			}
			if(thisBtn.hasClass("preview-btn")){
				btnFlag = 2;
				ajaxUrl = "sz/reimApp/saveReimAppInfoToDrafts";
			}
			//获取页面数据
			var reimDatas = reimApply.getSubSaveData();
			//调用验证方法 
			var validFlag = $yt_valid.validForm($(".base-info-model"));
			var validFlowFlag = $yt_valid.validForm($(".flow-approve-model"));
			if(validFlag && validFlowFlag){
				$.ajax({
					type: "post",
					url: ajaxUrl,
					async: false,
					data:reimDatas,
					success: function(data) {
						if(data.flag == 0){
							//存储报销单ID
							$("#hidReimId").val(data.data);
							//判断是提交还是保存,执行不同的成功操作
							if(btnFlag == 0){
								//操作成功禁用按钮
								thisBtn.attr("disabled",true);
								var pageUrl = "view/system-sasac/expensesReim/module/reimApply/createReimForm.html?reimId="+$("#hidReimId").val();//即将跳转的页面路径
								window.location.href= $yt_option.websit_path+pageUrl;
							}else if(btnFlag == 2){//点击预览按钮
								var pageUrl = "view/system-sasac/expensesReim/module/reimApply/reimFormPreview.html?reimId="+$("#hidReimId").val();//即将跳转的页面路径
								var goPageUrl = "view/system-sasac/expensesReim/module/reimApply/reimApply.html";//左侧菜单指定选中的页面路径
								window.open($yt_option.websit_path+"index.html?pageUrl="+encodeURIComponent(pageUrl)+'&goPageUrl='+goPageUrl);
							}else{
								//操作成功禁用按钮
								thisBtn.attr("disabled",true);
								$yt_common.parentAction({
									url:$yt_option.parent_action_path,//父级中转地址,固定配置项,只有统一修改处理。
									funName:'locationToMenu',//指定方法名，定位到菜单方法
									data:{
										url:'view/system-sasac/expensesReim/module/reimApply/reimApproveList.html'//要跳转的页面路径
									}
								});
							}
						}else{
							//解除禁用按钮
							thisBtn.attr("disabled",false);
						}
						$yt_alert_Model.prompt(data.message,2000);  
					}
				});
			}else{
				//解除禁用按钮
				thisBtn.attr("disabled",false);
				//调用设置滚动条显示位置方法
				sysCommon.pageToScroll($(".base-info-model .valid-font"));
			}
		});
	},
	/**
	 * 
	 * 
	 * 获取页面数据
	 * 
	 */
	getSubSaveData:function(){
		//获取城市间交通费列表数据
		var trafficObjTbodyTr = $("#traffic-list-info tbody tr:not(.total-last-tr,.detail-last-tr)");
    	var costCarfareList = [];
		var costCarfareJson = "";
		var cityDatas;
		//获取付款方式
		var replaWay = $("#traffic-list-info tbody .detail-last-tr .check-label.check input").val();
		replaWay = (replaWay == undefined ? "" : replaWay);
		if(trafficObjTbodyTr.length > 0){
			trafficObjTbodyTr.each(function (i,n){
				cityDatas = $(this).getDatas();
				//费用格式化
				cityDatas.crafare = $yt_baseElement.rmoney(cityDatas.crafare);
				//交通工具做处理,判断子级交通工具是否有值
				if($(this).find(".hid-child-code").val() == "null" || $(this).find(".hid-child-code").val() == ""){
					if($(this).find(".hid-vehicle").val().indexOf(".") != -1){
						cityDatas.vehicle = $(this).find(".hid-vehicle").val();
					}else{
						cityDatas.vehicle = "."+$(this).find(".hid-vehicle").val()+".";
					}
				}else{
					if($(this).find(".hid-vehicle").val().indexOf(".") != -1){
						cityDatas.vehicle = $(this).find(".hid-vehicle").val();
					}else{
						cityDatas.vehicle = "."+$(this).find(".hid-vehicle").val()+"."+$(this).find(".hid-child-code").val()+".";
					}
				}
				//结算方式
				cityDatas.setMethod = replaWay;
				costCarfareList.push(cityDatas);
			});
			if(costCarfareList.length>0){
				costCarfareJson = JSON.stringify(costCarfareList);
			}
		}
		//获取住宿费列表数据
		var hotelObjTbodyTr = $("#hotel-list-info tbody tr:not(.total-last-tr,.detail-last-tr)");
    	var costHotelList = [];
		var costHotelJson = "";
		var hotelDatas;
		//获取付款方式
		var replaWay = $("#hotel-list-info tbody .detail-last-tr .check-label.check input").val();
		replaWay = (replaWay == undefined ? "" : replaWay);
		if(hotelObjTbodyTr.length > 0){
			hotelObjTbodyTr.each(function (i,n){
				hotelDatas = $(this).getDatas();
				hotelDatas.hotelExpense = $yt_baseElement.rmoney(hotelDatas.hotelExpense);
				//结算方式
				hotelDatas.setMethod = replaWay;
				costHotelList.push(hotelDatas);
			});
			if(costHotelList.length>0){
				costHotelJson = JSON.stringify(costHotelList);
			}
		}
		//获取其他列表数据
		var otherObjTbodyTr = $("#other-list-info tbody tr:not(.total-last-tr,.detail-last-tr)");
    	var costOtherList = [];
		var costOtherJson = "";
		var otherDatas;
		//获取付款方式
		var replaWay = $("#other-list-info tbody .detail-last-tr .check-label.check input").val();
		replaWay = (replaWay == undefined ? "" : replaWay);
		if(otherObjTbodyTr.length > 0){
			otherObjTbodyTr.each(function (i,n){
				otherDatas = $(this).getDatas();
				//金额格式化
				otherDatas.reimAmount = $yt_baseElement.rmoney(otherDatas.reimAmount);
				//结算方式
				otherDatas.setMethod = replaWay;
				costOtherList.push(otherDatas);
			});
			if(costOtherList.length>0){
				costOtherJson = JSON.stringify(costOtherList);
			}
		}
		//获取补助列表数据
		var subsidyObjTbodyTr = $("#subsidy-list-info tbody tr:not(.total-last-tr,.detail-last-tr)");
    	var costSubsidyList = [];
		var costSubsidyJson = "";
		if(subsidyObjTbodyTr.length > 0){
			subsidyObjTbodyTr.each(function (i,n){
				costSubsidyList.push($(this).getDatas());
			});
			if(costSubsidyList.length>0){
				costSubsidyJson = JSON.stringify(costSubsidyList);
			}
		}
		//公务卡金额
		var officialCard = $("#officialCard").val();
		officialCard = (officialCard == "" ? "" : $yt_baseElement.rmoney(officialCard));
		//现金金额
		var cashPrice = $("#cash").val();
		cashPrice = (cashPrice == "" ? "" : $yt_baseElement.rmoney(cashPrice));
		//支票
		var cheque = $("#check").val();
		cheque = (cheque == "" ? "" : $yt_baseElement.rmoney(cheque));
		//转账金额
		var carryOver = $("#carryOver").val();
		carryOver = (carryOver == "" ?"" : $yt_baseElement.rmoney(carryOver));
    	//获取基础信息
    	return{
    		travelAppId:$("#approId").val(),//出差申请表id
    		loanAppId:$("#hidLoanFormId").val(),	//借款申请表id
    		reimAppId:$("#hidReimId").val(),//报销申请表id
    		reimAppNum:"",//报销单号
    		reimAppName:$("#reimReason").val(),//报销事由
    		invoiceNum:$("#invoiceNum").val(),//发票张数
    		officialCard:officialCard,//公务卡金额
    		cash:cashPrice,//现金金额
    		cheque:cheque,//支票金额
    		transfer:carryOver,//转账金额
			applicantUser:$yt_common.user_info.userName,//申请人code
			parameters:"",//JSON格式字符串
			dealingWithPeople:$("#approve-users").val(),//下一步操作人code
			opintion:$("#operate-msg").val(),//审批意见
			processInstanceId:"",//流程实例ID, 
			totalAmount:($("#applySumMoney").text() == "0.00" ? "" : $yt_baseElement.rmoney($("#applySumMoney").text())),//合计金额
			nextCode:$("#operate-flow").val(),//操作流程code
			costCarfareJson:costCarfareJson,//城市间交通费json
			costHotelJson:costHotelJson,//住宿费json
			costOtherJson:costOtherJson,//其他费用json
			costSubsidyJson:costSubsidyJson//补助明细json
    	}
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
			reimApply.getTrafficCostFormInfo();
		}
		if(tabFlag == 1){
			//调用获取获取拼接住宿费数据方法
			reimApply.getHotelFormInfo();
		}
		if(tabFlag == 2){
			//调用获取获取拼接其他费数据方法
			reimApply.getOtherCostFormInfo();
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
		//先判断是否存在合计行
		reimApply.createSumTr(0);
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
		                   + '<td data-text="goTime">'+$("#traffic-start-time").val()+'</td><td data-text="goAddress">'+$("#fromcity").val()+'</td><td data-text="arrivalTime">'+$("#traffic-end-time").val()+'</td>'
		 				   + '<td data-text="arrivalAddress">'+$("#tocity").val()+'</td>'
		 				   + '<td><span data-text="vehicle">'+vehicle+'</span><input type="hidden" class="hid-vehicle" value="'+vehicleCode+'"/><input type="hidden" class="hid-child-code" value="'+vehicleChildCode+'"/></td>'
		 				   + '<td class="font-right money-td" data-text="crafare">'+(cityMoney == "" ? "--" :cityMoney)+'</td>'
		 				   + '<td class="text-overflow-sty" data-text="remarks" title="'+$("#special-remark").val()+'">'+($("#special-remark").val() == "" ? "--" : $("#special-remark").val())+'</td>'
		 				   + '<td>'
		 				   + '<input type="hidden" class="hid-set-met" data-val="setMethod"/>'
		 				   + '<input type="hidden" class="hid-cost-type" value="0"/>'
		 				   + '<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>'
		 				   + '<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>'
						   + '</td></tr>';   
		$("#traffic-list-info tbody .total-last-tr").before(trafficCostStr);	
		//调用合计方法
		sysCommon.updateMoneySum(0);
		//调用操作列事件方法
		reimApply.costApplyTabOperateEvent();
		//调用公用的清空表单数据方法
		sysCommon.clearFormData();
		//改变风险灯图标绿灯
		$("#traffic-list-info").parent().find(".cost-list-title .risk-img").attr("src",reimApply.riskViaImg);
		//调用风险灯点击事件
		reimApply.riskClickEvent();
	},
	/**
	 * 
	 * 
	 * 拼接交通费合计行方法
	 * @param {Object} tabObj 表格对象0交通费,1住宿费2其他3补助明细
	 * 
	 */
	createSumTr:function(tabObj){
		//城市交通
		if(tabObj == 0){
		   if($("#traffic-list-info tbody").find(".total-last-tr").length == 0){
			var totalRows = '<tr class="total-last-tr">'
						   + '<td><span class="tab-font-blod">合计</span></td><td></td><td></td><td></td><td></td><td></td>'
						   + '<td></td>'
						   + '<td class="font-right"><span class="tab-font-blod money-sum">0.00</span></td>'
						   + '<td></td><td></td></tr>'
						   + '<tr  class="detail-last-tr" style="border: 0px;">'
						   + '<td colspan="10">'
						   + '<label class="check-label yt-checkbox" style="padding-left: 20px !important;">'
						   + '<input class="official-card" type="checkbox" name="test" value="OFFICIALCARD"/>公务卡结算</label>'
						   + '<span class="risk-model"><input type="hidden" value="officialCard" class="hid-risk-code"/><img src="../../../../../resources-sasac/images/common/war-red.png" class="risk-img card-risk-img"/></span>'
						   + '</td></tr>';
			$("#traffic-list-info tbody").append(totalRows);
		    }
		}
		//住宿费
	    if(tabObj == 1){
		  if($("#hotel-list-info tbody").find(".total-last-tr").length == 0){
			var totalRows = '<tr class="total-last-tr">'
         				  + '<td><span class="tab-font-blod">合计</span></td><td></td><td></td><td></td><td></td>'
          				  + '<td class="font-right"><span class="tab-font-blod money-sum">0</span></td>'
          				  + '<td></td><td></td><td></td></tr>'
          				  + '<tr style="border: 0px;" class="detail-last-tr">'
          				  + '<td colspan="9">'
          				  + '<label class="check-label yt-checkbox" style="padding-left: 20px !important;">'
          				  + '<input class="official-card" type="checkbox" name="test" value="OFFICIALCARD"/>公务卡结算</label>'
          				  + '<span class="risk-model"><input type="hidden" value="officialCard" class="hid-risk-code"/><img src="../../../../../resources-sasac/images/common/war-red.png" class="risk-img card-risk-img"/></span>'
          				  + '</td></tr>';
		 	$("#hotel-list-info tbody").append(totalRows);
		  } 
		}
	    //其他费用
	    if(tabObj == 2){
			 if($("#other-list-info tbody").find(".total-last-tr").length == 0){
				var totalRows = '<tr class="total-last-tr">'
	          				  + '<td><span class="tab-font-blod">合计</span></td>'
	          				  + '<td class="font-right"><span class="tab-font-blod money-sum">0</span></td>'
	          				  + '<td></td><td></td></tr>'
	          				  + '<tr class="detail-last-tr" style="border: 0px;">'
	          				  + '<td colspan="4">'
	          				  + '<label class="check-label yt-checkbox" style="padding-left: 20px !important;">'
	          				  + '<input class="official-card" type="checkbox" name="test" value="OFFICIALCARD"/>公务卡结算</label>'
	          				  + '<span class="risk-model"><input type="hidden" value="officialCard" class="hid-risk-code"/><img src="../../../../../resources-sasac/images/common/war-red.png" class="risk-img card-risk-img"/></span>'
	          				  + '</td></tr>';
				$("#other-list-info").append(totalRows);
			}
		}
	    //补助明细
	    if(tabObj == 3){
			 if($("#subsidy-list-info tbody").find(".total-last-tr").length == 0){
				var totalRows = '<tr class="total-last-tr">'
	          				  + '< <td class="tab-font-blod">合计</td>'
	          				  + '<td></td><td></td>'
	          				  + '<td class="font-right"><span class="tab-font-blod money-sum">0</span></td>'
	          				  + '<td class="font-right tab-font-blod city-money-td"></td><td></td></tr>';
				$("#subsidy-list-info").append(totalRows);
			}
		}
	    //调用获取风险灯方法
	    reimApply.getRiskData();
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
		//调用创建合计行的方法
		reimApply.createSumTr(1);
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
		reimApply.costApplyTabOperateEvent();
		//调用公用的清空表单数据方法
		sysCommon.clearFormData();
		//改变风险灯图标绿灯
		$("#hotel-list-info").parent().find(".cost-list-title .risk-img").attr("src",reimApply.riskViaImg);
		//调用风险灯点击事件
		reimApply.riskClickEvent();
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
		//调用创建合计行的方法
		reimApply.createSumTr(2);
		//费用类型
		var costType = otherObj.find("#cost-type option:selected").text();
        //拼接其他费用表格数据
        var  otherCostStr = '<tr>'
                          + '<td><span>'+costType+'</span><input type="hidden" data-val="costType" value="'+otherObj.find("#cost-type").val()+'"/></td>'
                          + '<td class="font-right money-td" data-text="reimAmount">'+otherObj.find(".other-money").val()+'</td>'
                          + '<td class="text-overflow-sty" data-text="remarks" title="'+otherObj.find(".other-msg").val()+'">'+(otherObj.find(".other-msg").val() == "" ? "--" : otherObj.find(".other-msg").val())+'</td>'
                          + '<td>'
                          + '<input type="hidden" class="hid-set-met" data-val="setMethod"/>'
                          + '<input type="hidden" class="hid-cost-type" value="2"/>'
                          + '<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"/></span>'
		 				  + '<span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"/></span>'
                          + '</td></tr>';
		$("#other-list-info tbody .total-last-tr").before(otherCostStr);	
		//调用合计方法
		sysCommon.updateMoneySum(2);
		//调用操作列事件方法
		reimApply.costApplyTabOperateEvent();
		//调用公用的清空表单数据方法
		sysCommon.clearFormData();
		//改变风险灯图标绿灯
		$("#other-list-info").parent().find(".cost-list-title .risk-img").attr("src",reimApply.riskViaImg);
		//调用风险灯点击事件
		reimApply.riskClickEvent();
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
			reimApply.trObject = thisTr;
			//调用 显示费用明细弹出框方法
			reimApply.showCostDetailModel();
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
				$(".traffic-form .risk-img").attr("src",reimApply.riskViaImg);
			}
			if(costType == 1){
				$(".hotel-form").show();
				$(".traffic-form").hide();
				//改变风险灯为绿灯
				$(".hotel-form .risk-img").attr("src",reimApply.riskViaImg);
			}
			if(costType == 2){
				$(".other-form").show();
				$(".traffic-form").hide();
				//改变风险灯为绿灯
				$(".other-form .risk-img").attr("src",reimApply.riskViaImg);
			}
			//调用获取选中当前行的方法
			reimApply.getTrCostInfoToForm(thisTr);
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
				    if(thisObj.parents("tbody").find("tr:not(.total-last-tr,.detail-last-tr)").length == 1){
						thisObj.parents("tbody").empty();
						//改变风险灯
						tableModel.find(".risk-img").attr("src",reimApply.riskExcMark);
					}
				    //删除当前行
				    thisObj.parents("tr").remove();
				    //更新当前表格的合计金额
				    sysCommon.updateMoneySum(costType,thisObj.parents("tr").find(".money-td").text());
				}
			});
		});
		/**
		 * 
		 * 公务卡复选框事件
		 * 
		 */
		$(".cost-list-model .yt-checkbox").off("change").on("change",function(){
			var officialCardSum = 0.00;
			//判断是否被选中
			if($(this).hasClass("check")){
			  $(this).parent().find(".risk-img").attr("src",reimApply.riskWarImg);
			  //给行中的付款方式添加数据
			  $(this).parents("tr").parent().find(".hid-set-met").val('');
			  //补领方式中的公积金
			  officialCardSum = $yt_baseElement.rmoney($("#officialCard").val()) - $yt_baseElement.rmoney($(this).parents("tr").parent().find(".money-sum").text());
			}else{
			  $(this).parent().find(".risk-img").attr("src",reimApply.riskViaImg);
			  //给行中的付款方式添加数据
			  $(this).parents("tr").parent().find(".hid-set-met").val($(this).find(".official-card").val());
			  //补领方式中的公积金
			  officialCardSum = $yt_baseElement.rmoney($(this).parents("tr").parent().find(".money-sum").text());
			  $(".detail-last-tr label.check").parents("tr").parent().find(".money-sum").each(function(i,n){
			  	   officialCardSum = officialCardSum + $yt_baseElement.rmoney($(this).text());
			  });
			}
			//补领金额合计
			var cash = $yt_baseElement.rmoney($("#cash").val());
			var check = $yt_baseElement.rmoney($("#check").val());
			var carryOver = $yt_baseElement.rmoney($("#carryOver").val());
			$("#replPriceSum").text($yt_baseElement.fmMoney(officialCardSum + cash + check + carryOver));
		   //公务卡金额合计
		   officialCardSum = $yt_baseElement.fmMoney(officialCardSum);
		    $("#officialCard").val(officialCardSum);
		   
		});
	},
	/**
	 * 
	 * 获取点击修改当前行的数据
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
			var startAddre = $(thisTr).find("td:eq(3)").text();
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
			$("#fromcity").val(startAddre);
			$("#tocity").val(endAddre);
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
				$(".vehicle-sel").parents("td").find(".risk-img").attr("src",reimApply.riskViaImg);
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
				reimApply.hotelAddressChild(hotelAddress[0],"CITY");
				reimApply.hotelAddressChild(hotelAddress[1],"AREA");
			}else if(hotelAddress.length == 2){
				reimApply.hotelAddressChild(hotelAddress[0],"CITY");
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
			reimApply.hotelChildDisa("CITY");
			//调用设置住宿费子级无数据设置禁用方法
			reimApply.hotelChildDisa("AREA");
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
				reimApply.getCostDetailData(tabFlag);
				//调用关闭可编辑弹出框方法
				sysCommon.closeModel(costApplyModel);
				//调用获取风险灯方法
     			reimApply.getRiskData();
			}
		});
		/**
		 * 
		 * 确定按钮修改数据操作事件
		 * 
		 */
		costApplyModel.find("#model-sure-btn").off().on("click",function(){
			//获取费用类型0.交通1.住宿2.其他
			var costType = reimApply.trObject.find(".hid-cost-type").val();
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
					reimApply.trObject.find("td:eq(0) span").text(tripUser);
					reimApply.trObject.find("td:eq(1)").text(level);
					reimApply.trObject.find("td:eq(0) input").val(trabfficObj.find("#model-trip-user").val());
					//出发日期
					reimApply.trObject.find("td:eq(2)").text($("#traffic-start-time").val());
					//出发地点
					reimApply.trObject.find("td:eq(3)").text($("#fromcity").val());
					//到达日期
					reimApply.trObject.find("td:eq(4)").text($("#traffic-end-time").val());
					//到达地点
					reimApply.trObject.find("td:eq(5)").text($("#tocity").val());
					//交通工具
					reimApply.trObject.find("td:eq(6) span").text(vehicle);
					reimApply.trObject.find("td:eq(6) input:eq(0)").val(trabfficObj.find(".vehicle-sel").val());
					reimApply.trObject.find("td:eq(6) .hid-child-code").val($(".vehicle-two-sel").val());
					//城市交通费
					reimApply.trObject.find("td:eq(7)").text(cityMoney);
					//特殊说明
					reimApply.trObject.find("td:eq(8)").text(($("#special-remark").val()==""?"--":$("#special-remark").val()));
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
					reimApply.trObject.find("td:eq(0) span").text(tripUser);
					reimApply.trObject.find("td:eq(1)").text(level);
					//住宿日期
					reimApply.trObject.find("td:eq(2)").text($("#hotelDate").val());
					reimApply.trObject.find("td:eq(0) input").val(hotelObj.find("select.hotel-trip-user-sel").val());
					//人均花销
					reimApply.trObject.find("td:eq(3)").text($("#peoDayMoney").text());
					//住宿天数
					reimApply.trObject.find("td:eq(4)").text(hotelObj.find(".yt-numberInput").val());
					//住宿费
					reimApply.trObject.find("td:eq(5)").text(hotelObj.find(".hotel-money").val());
					//住宿地点
					reimApply.trObject.find("td:eq(6) span").text(hotelAddress);
					reimApply.trObject.find("td:eq(6) input").val(hotelAdressCode);
					///获取特殊说明
					reimApply.trObject.find("td:eq(7)").text((hotelObj.find(".hotel-msg").val()==""?"--":hotelObj.find(".hotel-msg").val()));
					//调用合计方法
					sysCommon.updateMoneySum(1);
				}
				//其他费用
				if(costType == 2){
					var otherObj  = $(".other-form");
					//费用类型
					var costType = otherObj.find("#cost-type option:selected").text();
					//费用类型
					reimApply.trObject.find("td:eq(0) span").text(costType);
					reimApply.trObject.find("td:eq(0) input").val(otherObj.find("#cost-type").val());
					//费用金额
					reimApply.trObject.find("td:eq(1)").text(otherObj.find(".other-money").val());
					///获取特殊说明
					reimApply.trObject.find("td:eq(2)").text((otherObj.find(".other-msg").val()==""?"--":otherObj.find(".other-msg").val()));
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
			if(hotelDay <= 0){
			  hotelDay = $(".hotel-form .yt-numberInput").val(1);
			}
			//调用差旅明细住宿费用算取平均数
			reimApply.detalHotelHotelAvgPrice();
     	});
        /**
         * 
         * 入住天数文本框失去焦点事件
         * 
         */
        $(".yt-numberInput").on("blur",function(){
        	//获取 住宿金额
     		var hotelMoney =  $(".cost-detail-money").val();
        	if($(this).val() == 0){
        		$(this).val(1);
        	}
        	//调用差旅明细住宿费用算取平均数
			reimApply.detalHotelHotelAvgPrice();
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
		/**
		 * 
		 *  城市金额输入框失去焦点失去焦点事件
		 * 
		 */
		$(".city-cost-input,.cost-detail-money").on("blur",function(){
			//判断如果是住宿费失去焦点
			if($(this).hasClass("cost-detail-money")){
				//调用差旅明细住宿费用算取平均数
				reimApply.detalHotelHotelAvgPrice();
			}
			reimApply.formartMoney($(this));
		});
		
	},
	/**
	 * 
	 * 
	 * 差旅明细住宿费用算取平均数
	 * 
	 */
	detalHotelHotelAvgPrice:function(){
		//算出住宿费平均数
		var hotelPrice = $(".cost-detail-money").val();
		var hotelDay = $(".hotel-form .yt-numberInput").val();
		$("#peoDayMoney").html($yt_baseElement.fmMoney(hotelPrice/hotelDay));
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
		//住宿日期
		$("#hotelDate").calendar({
			controlId: "hotelTime",
			nowData: false, //默认选中当前时间,默认true  
			speed:0,
			callback:function(){
				//调用公用的清除验证信息方法
				sysCommon.clearValidInfo($("#hotelDate"));
			}
		});
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
	}

}
$(function() {
	reimApply.init();
});
