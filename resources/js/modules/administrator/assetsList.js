var assetsList = {
	
	//初始化方法
	init: function() {
		$("select").niceSelect(); //下拉框刷新  
		//初始化创建时间
		$("#txtDate").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			lowerLimit: "2010/01/01", // 日期下限，默认：NaN(不限制)     
			nowData: true, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd",
			callback: function() {} // 点击选择日期后的回调函数  
		});
		var numBool = true;
		//点击资产编码
		$(".click-num").click(function(){
				$('.sort-icon').show();
				numBool = false;
				dateBool = true;
				$('.sort-icon-date').hide()
			if ($(".click-num-inp").val() == "ASC") {
				$('.sort-icon').css('transform','rotate(0)')
				$(".click-num-inp").val("DESC");
			} else{
				$('.sort-icon').css('transform','rotate(180deg)')
				$(".click-num-inp").val("ASC");
			}
			$(".ass-order-type").val("assets_code");
			assetsList.getPlanListInfo();
		});
		$(".click-num").hover(function(){
			if(numBool){
				$('.sort-icon').show();
			}
		},function(){
			if(numBool){
				$('.sort-icon').hide();
			}

		})
		var dateBool = true;
		$(".click-date").hover(function(){
			if(dateBool){
				$('.sort-icon-date').show()
			}
		},function(){
			if(dateBool){
				$('.sort-icon-date').hide()
			}
		})
		$(".click-date").click(function(){
			dateBool = false;
			numBool = true;
			$('.sort-icon').hide()
			if ($(".click-date-inp").val() == "ASC") {
				$('.sort-icon-date').css('transform','rotate(0)')
				$(".click-date-inp").val("DESC");
			} else{
				$('.sort-icon-date').css('transform','rotate(180deg)')
				$(".click-date-inp").val("ASC");
			}
			$(".ass-order-type").val("obtain_date");
			assetsList.getPlanListInfo();
		});
		/** 
         * 金额文本框获取焦点事件 
         */  
        $(".assetsWorth").on("focus",function(){  
            if($(this).val()!=""){  
                //调用还原格式化的方法  
               $(this).val($yt_baseElement.rmoney($(this).val()));  
            }  
        });  
        /** 
         * 金额文本框失去焦点事件 
         */  
        $(".assetsWorth").on("blur",function(){  
            if($(this).val()!=""){ 
            	$(".hid-input-assets-worth").val($(this).val());
                //调用格式化金额方法  
                $(this).val($yt_baseElement.fmMoney($(this).val()));  
            }  
        });  
		//全选  
		$("input.check-all").change(function() {
			//判断自己是否被选中  
			if($(this).parent().hasClass("check")) {
				//设置反选  
				$(this).parents("table").find("tbody input[type='checkbox']").setCheckBoxState("uncheck");
				$(".check-all-tab tbody").find("tr").removeClass("yt-table-active");
			} else {
				//调用设置选中方法,全选  
				$(this).parents("table").find("tbody input[type='checkbox']").setCheckBoxState("check");
				$(".check-all-tab tbody").find("tr").addClass("yt-table-active");
			}
			
		});
		//修改全选按钮状态
		$(".check-all-tab tbody").on("change","input[type='checkbox']",function (){
			
			if($(this).parents("table").find("tbody tr").length != $(this).parents("table").find("tbody input[type='checkbox']:checked").length){
				$(this).parents("table").find(".check-all").setCheckBoxState("uncheck");
			}else{
				$(this).parents("table").find(".check-all").setCheckBoxState("check");
			}
		});
		
		//点击新增
		$(".addList").click(function (){
			$(".btn-type").val(1);
			$("select").niceSelect();
			//该表弹窗标题
			$('.ticket-title-span').text("新增资产");
			//初始化弹窗
			assetsList.clearAddBox();
			//获取自动生成编号
			assetsList.getAssetsCode();
			//调用弹窗
			assetsList.showAlert();
			
		});
		//新增确定按钮
		$(".select-teacher-btn-div").off().on('click','.select-ticket-sure-btn',function (){
			var aCode=assetsList.getAssetsCodeIsHave();
			if ($yt_valid.validForm($(".add-table"))) {
				if(aCode==1){
					$yt_alert_Model.prompt("资产编号已存在！");
				}else{
					//调用新增功能
					assetsList.addOrUpdateRoom();
					 //隐藏页面中自定义的表单内容  
		            $(".yt-edit-alert,#heard-nav-bak").hide();  
		            //隐藏蒙层  
		            $("#pop-modle-alert").hide();  
				}
			}
		});
		var pkId = "";
		//点击修改
		$(".updateList").click(function (){
			$(".btn-type").val(2);
			var len = $('.select-assets-alert-checkbox input[class="select-assets-pkId"]:checked').length;
			if (len==1) {
				pkId = $('.select-assets-alert-checkbox input[class="select-assets-pkId"]:checked').val();
				$('.hid-pk-id').val(pkId);
				
				//该表弹窗标题
				$('.ticket-title-span').text("修改资产");
				//初始化弹窗
				assetsList.clearAddBox();
				//调用弹窗
				assetsList.showAlert();
				//调用获取详细信息
				assetsList.getUpdate();
			}else{
				$yt_alert_Model.prompt("请选中一行数据进行操作", 3000);
			}
		});
		
		//点击导出  
		$(".disableList").click(function (){
			assetsList.getExportAssets();
		});
		
		//点击编号名查看详情  
		$(".class-tbody").on('click','.real-name-inf',function (){
			//初始化弹窗页面
			$(".only-look-shuttle-box").width("800px");
			//显示详情弹窗
			$('.ticket-title-div').show();
			$('.info-copy-btn').show();
			$('.cont-info-hide').show();
			//关闭复制弹窗
			$('.copy-alert-title-div').hide();
			$('.cont-copy-hide').hide();
			var pkId = $(this).prev().val();
			$('.hid-pk-id').val(pkId);
			assetsList.clearAddBox();
			assetsList.onlyLookAlert();
			assetsList.lookOneInfor(pkId);
			$('.select-ticket-canel-btn').val("关闭")
			//$('.select-ticket-sure-btn').hide();
		});
		
		//调用获取列表数据方法
		assetsList.getPlanListInfo();
		//点击查询
		$('.key-word').off().on('click','.search-btn', function() {
			//调用获取列表数据方法查询
			assetsList.getPlanListInfo();
		});
		
//		//资产类别下拉列表
		var typeList = assetsList.getTypeList();
		if(typeList != null) {
			$("#typeList").empty()
			$.each(typeList.data, function(i, n) {
				if(n!=null){
					$("#typeList").append($('<option value="' + n.typeId + '">' + n.typeName + '</option>').data("classData", n));
				}
			});
		};
		$("select.typeId").niceSelect({  
	        search: true,  
	        backFunction: function(text) {  
	            //回调方法,可以执行模糊查询,也可自行添加操作  
	            $("select.typeId option").remove();  
	            if(text == "") {  
	                $("select.typeId").append('<option value="">请选择</option>');  
	            }  
	            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
	            $.each(typeList.data, function(i, n) {  
	                if(n.typeName.indexOf(text) != -1) {  
	                    $("select.typeId").append($('<option value="' + n.typeId + '">' + n.typeName + '</option>').data("classData", n));  
	                }  
	            });  
	        }  
	    });  
		//点击类别下拉框,获取资产分类代码和资产分类名称
		$('#typeList').on('change', function() {
			typeId = $(".hid-type-id").val("0");
			classifyName = $(".hid-type-name").val("");
			if ($('#typeList').val() != "") {
				$('.typeId').removeClass("valid-hint");
				$('div.typeId').next().text("");
			}
			assetsList.getclassifyCode();
		});
		//选择资产分类代码,资产分类名称下拉框显示对应明层
		$('#assetsCodeList').on('change', function() {
			if ($('#assetsCodeList').val() != "") {
				$('.classify-code-select').removeClass("valid-hint");
				$('div.classify-code-select').next().text("");
			}
			//选择的分类代码
			var assetsCode = $('#assetsCodeList option:selected').val();
			//分类名称框，显示对应分类名称
			$('#classifyName').val(assetsCode);
			//$("select").niceSelect();
		});
		//选择资产分类代码,资产分类名称下拉框显示对应明层
		$('#classifyName').on('change', function() {
			//选择分类名称
			var classifyName = $('#classifyName option:selected').val();
			//分类代码框，显示对应的分类代码
			$('#assetsCodeList').val(classifyName);
			//$("select").niceSelect();
		});
		
		
		//选择使用人后，管理人下拉框默认为使用人
		$('#userName').on('change', function() {
			//选择分类名称
			var userName = $('#userName option:selected').val();
			//分类代码框，显示对应的分类代码
			$('#administratorCode').val(userName);
			//$("select").niceSelect();
		});
		
		//点击获取部门
		var deptList = assetsList.getDeptList();
		
		if(deptList != null) {
			$.each(deptList.data, function(i, n) {
				//部门下拉列表
				if(n.type==2){
					$("#deptList").append($('<option value="' + n.id + '">' + n.text + '</option>').data("classData", n));
				}
				//使用人下拉列表
				if(n.type==3){
					$("#userName").append($('<option value="' + n.textName + '">' + n.text + '</option>').data("classData", n));
				}
				//管理人下拉列表
				if(n.type==3){
					$("#administratorCode").append($('<option value="' + n.textName + '">' + n.text + '</option>').data("classData", n));
				}
				
			});
			//部门下拉列表
			$("select.deptId").niceSelect({  
		        search: true,  
		        backFunction: function(text) {  
		            //回调方法,可以执行模糊查询,也可自行添加操作  
		            $("select.deptId option").remove();  
		            if(text == "") {  
		                $("select.deptId").append('<option value="">请选择</option>');  
		            }  
		            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
		            $.each(deptList.data, function(i, n) {  
		            	if(n.type==2){
			                if(n.text.indexOf(text) != -1) {  
			                   $("#deptList").append($('<option value="' + n.id + '">' + n.text + '</option>').data("classData", n));
			                } 
		                }
		            });  
		        }  
		    });  
		    //使用人下拉列表
		    $("select.userName").niceSelect({  
		        search: true,  
		        backFunction: function(text) {  
		            //回调方法,可以执行模糊查询,也可自行添加操作  
		            $("select.userName option").remove();  
		            if(text == "") {  
		                $("select.userName").append('<option value="">请选择</option>');  
		            }  
		            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
		            $.each(deptList.data, function(i, n) { 
		            	if(n.type==3){
			                if(n.text.indexOf(text) != -1) {  
			                   $("#userName").append($('<option value="' + n.textName + '">' + n.text + '</option>').data("classData", n));
			                }  
		                }
		            });  
		        }  
		    });  
		    //管理人下拉列表
		    $("select.administratorCode").niceSelect({  
		        search: true,  
		        backFunction: function(text) {  
		            //回调方法,可以执行模糊查询,也可自行添加操作  
		            $("select.administratorCode option").remove();  
		            if(text == "") {  
		                $("select.administratorCode").append('<option value="">请选择</option>');  
		            }  
		            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
		            $.each(deptList.data, function(i, n) {  
		            	if(n.type==3){
			                if(n.text.indexOf(text) != -1) {  
			                   $("#administratorCode").append($('<option value="' + n.textName + '">' + n.text + '</option>').data("classData", n));
			                } 
		                }
		            });  
		        }  
		    });  
		};
		//点击删除
		$(".deleteList").click(function (){	
			var pkId = "";
			$('.select-assets-alert-checkbox input[class="select-assets-pkId"]:checked').each(function() {
				if(pkId == "") {
					pkId = $(this).val();
				} else {
					pkId += "," + $(this).val();
				}
			});
			if(pkId == "") {
				$yt_alert_Model.prompt("请选中一行数据进行操作", 3000);
			} else {
				$yt_alert_Model.alertOne({
					alertMsg: "数据删除将无法恢复，确认删除吗？", //提示信息  
					confirmFunction: function() { //点击确定按钮执行方法  
						assetsList.removeBeanById(pkId);
					},
				});
			}
		});
		//批量导入
		$(".leading-in").undelegate().delegate("input","change",function (){
			var me = $(this);
		    var addFile =  $(this).attr("id");
		    //切割文件路径获取文件名
		    var fileName=$(this).val().split('\\');
		    //获取到上传的文件名
		    var fm=fileName[fileName.length-1];
		});
		//获取资产编号
		assetsList.getAssetsCode();
		//资产编号输入框失去焦点，获取资产编号验证资产编号
		$("#assetsCode").blur(function(){
			var acc=assetsList.getAssetsCodeIsHave();
			if(acc==1){
				$yt_alert_Model.prompt("资产编号已存在！");
			}
		});
		
		//点击导入按钮
		$('.student-import-btn').on('click',function(){
			/** 
	         * 显示编辑弹出框和显示顶部隐藏蒙层 
	         */  
	        $(".batch-import-form").show();  
	        /** 
	         * 调用算取div显示位置方法 
	         */  
	        $yt_alert_Model.getDivPosition($(".batch-import-form"));  
	        /* 
	         * 调用支持拖拽的方法 
	         */  
	        $yt_model_drag.modelDragEvent($(".batch-import-form .yt-edit-alert-title"));  
	        /** 
	         * 点击取消方法 
	         */  
	        $('.batch-import-form .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {  
	            //隐藏页面中自定义的表单内容  
	            $(".batch-import-form").hide();  
	            //隐藏蒙层  
	            $("#pop-modle-alert").hide();  
	        });  
	        
		});
		//点击下载模板
		$('.batch-import-form .download-template').click(function(){
			var fileName="资产列表模板";
			$.ajaxDownloadFile({
				url:$yt_option.base_path+"administrator/assets/downloadAssts",
				data:{
					fileName:fileName
				}
			});
		});
		//选择要导入的文件
		$(".leading-in").undelegate().delegate("input","change",function (){
			var me = $(this);
		    var addFile =  $(this).attr("id");
		    //切割文件路径获取文件名
		    var fileName=$(this).val().split('\\');
		    //获取到上传的文件名
		    var fm=fileName[fileName.length-1];
		    $('.batch-import-form .import-file-name').val(fm);
		});
		//点击导入弹出框的导入按钮
		$('.batch-import-form .yt-model-sure-btn').off().on('click',function(){
			var addFile = 'fileName';//是input标签类型为file的id名，通过
			var fm=$('.batch-import-form .import-file-name').val();
			var url = $yt_option.base_path + "administrator/assets/importAssets";
			if(fm == ""){
				$yt_alert_Model.prompt("请选择导入文件！");
			}else{
			    $.ajaxFileUpload({
					url: url,
					type: "post",
					dataType: 'json',
					fileElementId:addFile,
					data:{
					},
					success: function(data, textStatus) {
				       if(data.flag == 0){
					       	$("#"+addFile).val("");
						    $yt_alert_Model.prompt(data.message);
						    $(".import-file-name").val("");
						    assetsList.getPlanListInfo();
				       }else{
				       	$(".erro-list-div tbody").empty();
				       	var erroTbo = $(".erro-list-div tbody");
				       		if (data.data == null){
			       				$("#"+addFile).val("");
							    $yt_alert_Model.prompt(data.message);
							    $(".import-file-name").val("");
				       		}else{
				       			//隐藏导入自定义弹窗
				       			$(".batch-import-form").hide();
				       			$("#pop-modle-alert").hide(); 
				       			//显示错误信息列表弹窗
						        $(".erro-list-div").show();  
						        $yt_alert_Model.getDivPosition($(".erro-list-div"));  
						        $yt_model_drag.modelDragEvent($(".erro-list-div .yt-edit-alert-title"));  
						        $('.erro-list-div .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {  
						            //隐藏页面中自定义的表单内容  
						            $(".erro-list-div").hide();  
						            //隐藏蒙层  
						            $("#pop-modle-alert").hide();  
						            //显示导入弹窗
						            $(".batch-import-form").hide();
						            $("#"+addFile).val("");
								    $(".import-file-name").val("");
						        });  
				       			$.each(data.data, function(i,j) {
				       				var erroTr = '<tr>'+
													'<td>'+j.excelNum+'</td>'+
													'<td style="text-align:left;">'+j.errorMessage+'</td>'+
												'</tr>';
											erroTbo.append(erroTr);
				       			});
				       		}
				       }
					},
					error: function(data, status, e){ //服务器响应失败处理函数  
					    $yt_alert_Model.prompt("附件导入失败!");
					    $("#"+addFile).val("");
					    $(".import-file-name").val("");
					}
				});
			}
		});
		//点击复制按钮
		$('.copy-btn').click(function(){
			//初始化复制弹窗
			$(".only-look-shuttle-box").width("600px");
			$('#count').val("");
			$('.start-num').val("");
			$('.end-num').text("");
			
			//隐藏详情弹窗
			$('.ticket-title-div').hide();
			$('.info-copy-btn').hide();
			$('.cont-info-hide').hide();
			//显示复制弹窗
			$('.copy-alert-title-div').show();
			$('.cont-copy-hide').show();
			/* 
	         * 调用支持拖拽的方法 
	         */  
	         $yt_model_drag.modelDragEvent($(".only-look-shuttle-box .copy-alert-title-div"));  
		});
		//复制框取消按钮
		$('.cop-canel-btn').click(function(){
			//显示详情弹窗
			$(".only-look-shuttle-box").width("800px");
			$('.ticket-title-div').show();
			$('.info-copy-btn').show();
			$('.cont-info-hide').show();
			/* 
	         * 调用支持拖拽的方法 
	         */  
	         $yt_model_drag.modelDragEvent($(".only-look-shuttle-box .ticket-title-div"));  
			//隐藏复制弹窗
			$('.copy-alert-title-div').hide();
			$('.cont-copy-hide').hide();
		});
		//复制弹框填写数量失去焦点事件
		$('#count').blur(function(){
			var vail = $yt_valid.validForm($(".copy-table"));
			if(vail){
				var intStarNum;
						$.ajax({
							type:"post",
							url:$yt_option.base_path + "administrator/assets/getAssetsCode",
							async:false,
							data:{
							},
							success:function(data){
								$('.start-num').val(data.data);
								intStarNum = data.data;
							},
							error:function(data){
								
							}
						});
				//获取数量,转换成int类型
				var count =parseInt($(this).val());
				//获取起始编码转换成int类型
				var intStarNum =parseInt($(".start-num").val());
				//再把编码转换成字符串
				var strNum = '000000000'+intStarNum.toString();
				//获取字符串的后9位
				strNum = strNum.substring(strNum.length-9,strNum.length);
				$('.start-num').val(strNum);
				//结束编码
				var strEndNum = '000000000'+(intStarNum+count-1).toString();
					strEndNum = strEndNum.substring(strEndNum.length-9,strEndNum.length);
				$('.end-num').text(strEndNum);
				
			}
				
		});
		//起始编码失去焦点事件
		$('.start-num').blur(function(){
			//获取数量,转换成int类型
				var count =parseInt($('#count').val());
				//获取起始编码转换成int类型
				var intStarNum =parseInt($(".start-num").val());
				//再把编码转换成字符串
				var strNum = '000000000'+intStarNum.toString();
				//获取字符串的后9位
				strNum = strNum.substring(strNum.length-9,strNum.length);
				$('.start-num').val(strNum);
				//结束编码
				var strEndNum = '000000000'+(intStarNum+count-1).toString();
					strEndNum = strEndNum.substring(strEndNum.length-9,strEndNum.length);
				$('.end-num').text(strEndNum);
		});
		
		//复制功能弹窗确定按钮
		$('.only-look-shuttle-box .yt-eidt-model-bottom .cop-sur-btn').off().on("click", function() {
            var pkId = $('.hid-pk-id').val();
			var count = $('#count').val();
			var assetsCode = $('.start-num').val();
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "administrator/assets/copyAssets",
				data: {
					pkId:pkId,
					copyCount:count,
					assetsCode:assetsCode
				},
				async: true,
				success: function(data) {
					if(data.flag == 0){
						$yt_alert_Model.prompt("复制成功", 2000);
						assetsList.getPlanListInfo();
						//隐藏复制弹窗
						$('.cont-copy-hide').hide();
					}else if(data.flag == 5){
						$yt_alert_Model.alertOne({  
		        			haveCloseIcon: false, //是否带有关闭图标  
		        			leftBtnName: "确定", //左侧按钮名称,默认确定  
		        			cancelFunction: "", //取消按钮操作方法*/  
		        			alertMsg: "资产编码范围与已有资产编码重复，无法进行复制。请调整编码范围", //提示信息  
		       			 	cancelFunction: function() { //点击确定按钮执行方法  
		       			 		//显示详情弹窗
								$('.only-look-shuttle-box').show();
								//初始化弹窗页面
								//$(".only-look-shuttle-box").width("800px");
								//显示详情弹窗
//								$('.ticket-title-div').show();
//								$('.info-copy-btn').show();
//								$('.cont-info-hide').show();
						    }
						});
					}else{
						$yt_alert_Model.prompt(data.message, 2000);
					}
					
				}
			});
			//隐藏页面中自定义的表单内容  
            $(".yt-edit-alert,#heard-nav-bak").hide();  
            //隐藏蒙层  
            $("#pop-modle-alert").hide();  
			
        }); 
		
},
	//获取资产分类代码
	getclassifyCode:function(){
		$("#assetsCodeList  option:gt(0)").remove();
		var typeId = $(".hid-type-id").val();
		var classifyName = $(".hid-type-name").val();
		if (typeId == "0" && classifyName =="") {//不是修改调用
			typeId = $('#typeList option:selected').val();
			classifyName = $('#typeList option:selected').data("classData").typeName;
		}
		var classify = assetsList.getClassify(typeId,classifyName);
		if(classify != null) {
			$("#assetsCodeList").empty();
			$.each(classify.data, function(i, n) {
				$("#assetsCodeList").append($('<option value="' + n.classifyCode + '">' + n.classifyCode +n.classifyName +'</option>').data("classData", n));
			});
		};
		$("select.classify-code-select").niceSelect({  
			
	        search: true,  
	        backFunction: function(text) { 
	            //回调方法,可以执行模糊查询,也可自行添加操作  
	            $("select.classify-code-select option").remove();  
	            if(text == "") {  
	                $("select.classify-code-select").append('<option value="">请选择</option>');  
	            }  
	            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
	            $.each(classify.data, function(i, n) {
	            	var allCode=n.classifyCode +n.classifyName;
	                if(allCode.indexOf(text) != -1) {  
	                    $("#assetsCodeList").append($('<option value="' + n.classifyCode + '">' + n.classifyCode +n.classifyName +'</option>').data("classData", n)); 
	                }  
	            });  
	        }  
	    });  
	},
	showAlert:function(){
		 /** 
	         * 显示编辑弹出框和显示顶部隐藏蒙层 
	         */  
	        $(".shuttle-box").show();  
	        /** 
	         * 调用算取div显示位置方法 
	         */  
	        $yt_alert_Model.getDivPosition($(".shuttle-box"));  
	        $yt_alert_Model.setFiexBoxHeight($(".shuttle-box .yt-edit-alert-main"));
	        /* 
	         * 调用支持拖拽的方法 
	         */  
	        $yt_model_drag.modelDragEvent($(".shuttle-box .yt-edit-alert-title"));  
	        /** 
	         * 点击取消方法 
	         */  
	        $('.shuttle-box .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {  
	            //隐藏页面中自定义的表单内容  
	            $(".yt-edit-alert,#heard-nav-bak").hide();  
	            //隐藏蒙层  
	            $("#pop-modle-alert").hide();  
	        });  
	        
	},
	
	//资产详情弹窗
	onlyLookAlert:function(){
		 /** 
         * 显示编辑弹出框和显示顶部隐藏蒙层 
         */  
        $(".only-look-shuttle-box").show();  
        /** 
         * 调用算取div显示位置方法 
         */  
        $yt_alert_Model.getDivPosition($(".only-look-shuttle-box"));  
        /* 
         * 调用支持拖拽的方法 
         */  
         $yt_model_drag.modelDragEvent($(".only-look-shuttle-box .yt-edit-alert-title"));  
        /** 
         * 点击取消方法 
         */  
        $('.only-look-shuttle-box .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {  
            //隐藏页面中自定义的表单内容  
            $(".yt-edit-alert,#heard-nav-bak").hide();  
            //隐藏蒙层  
            $("#pop-modle-alert").hide();  
        });  
         
	},

//获取资产类别
	getTypeList:function(){
		var list = [];
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "administrator/assets/getType",
			data: {
				typeName:""
			},
			async: false,
			success: function(data) {
				list = data || [];
			}
		});
		return list;
	},



//获取资产分类 代码
	getClassify:function(typeId,classifyName){
		var list = [];
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "administrator/assets/getClassify",
			data: {
				typeId: typeId,
				classifyName:""
			},
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			async: false,
			success: function(data) {
				$yt_baseElement.hideLoading();
				list = data || [];
			}
		});
		return list;
	},
	
	//获取部门列表
	getDeptList:function(){
		var list = [];
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/user/getUsers",
			data: {
				typeName:""
			},
			async: false,
			success: function(data) {
				list = data || [];
			}
		});
		return list;
	},

	
	/**
	 * 获取资产列表数据
	 */
	getPlanListInfo: function() {
		var orderType = ""
		var sort = $(".ass-order-type").val();
		if(sort == "assets_code"){//资产编码
			orderType = $(".click-num-inp").val();
		}else if(sort == "obtain_date"){//取得日期排序
			orderType = $(".click-date-inp").val();
		}else{
		}
		var keyword = $('#keyword').val();
		$('.page-info').pageInfo({
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "administrator/assets/lookForAll", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam:keyword,
				sort:sort,
				orderType:orderType
			}, //ajax查询访问参数
			before:function(){
				$yt_baseElement.showLoading();
			},
			after:function(){
				$(".check-all-tab tbody tr").unbind().bind("click", function() {
					if($(this).find("input[type='checkbox']")[0].checked == true) {
						$(this).find("input[type='checkbox']").setCheckBoxState("uncheck");
						$(this).removeClass("yt-table-active");
					} else {
						$(this).find("input[type='checkbox']").setCheckBoxState("check");
						$(this).addClass("yt-table-active");
					}
					if($(".check-all-tab tbody input:checkbox").not("input:checked").length > 0){
						$(".check-all").setCheckBoxState("uncheck");
					}else{
						$(".check-all").setCheckBoxState("check");
					}
				});
			},
			objName: 'data', //指获取数据的对象名称 
			async:true,
			success: function(data) { 
				var directionUse;
				var useStatus;
				if(data.flag == 0) {
					var htmlTbody = $('.list-table .yt-tbody');
					var htmlTr = '';
					var num = 1;
					if(data.data.rows.length > 0) {
						$('.page-info').show();//显示分页
						$(htmlTbody).empty();
						$.each(data.data.rows, function(i, v) {
							if (v.useStatus==4) {
								useStatus="其他";
							};
							if (v.directionUse==1) {
								directionUse="自用";
							}else if (v.directionUse==2) {
								directionUse="出借";
							}else if (v.directionUse == 3){
								directionUse = "出租";
							}else if (v.directionUse == 4){
								directionUse = "其他";
							}else{
								directionUse = "";
							};
							
							if (v.useStatus==1) {
								useStatus="在用";
							}else if (v.useStatus==2) {
								useStatus="不能用";
							}else if (v.useStatus==3) {
								useStatus="闲置";
							}else if (v.useStatus==4) {
								useStatus="其他";
							}else{
								useStatus = "";
							};
							htmlTr = '<tr>' +
								'<td style="text-align:center;position: relative;"><p style="width: 30px;height: 30px;position: absolute;top: 10px;z-index:100;opacity:0;"></p>' + '<label class="check-label yt-checkbox select-assets-alert-checkbox"><input type="checkbox" name="test" class="select-assets-pkId" value="' + v.pkId + '"/></label></td>' +
								'<td style="text-align:center;"><input type="hidden" value="' + v.pkId + '" class="pkId"><a style="color:#3c4687;" href="#" class="real-name-inf assetsCode">'+ v.assetsCode+'</a></td>' +
								'<td >'+ v.assetsName+ '</td>' +
								'<td style="text-align:center;">' + v.typeName + '</td>' +
								'<td>' + v.assetsBrand + '</td>' +
								'<td style="text-align:center;">' + v.obtainDate + '</td>' +
								'<td style="text-align:center;">' + directionUse + '</td>' +
								'<td style="text-align:center;">' + useStatus + '</td>' +
								'<td style="text-align:center;">' + v.userName + '</td>' +
								'<td style="text-align:center;">' + v.administratorName + '</td>' +
								'<td>' + v.placeStorage + '</td>' +
								'</tr>';
							htmlTbody.append($(htmlTr).data("legalData",v));
						});
					} else {
						$(htmlTbody).empty();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="11" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						$('.page-info').hide();
						htmlTbody.html(htmlTr);
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
	
	//初始化新增弹窗
	clearAddBox:function(){//setSelectVal
		$('.typeId').setSelectVal("");	
		$('.classifyCode').setSelectVal("");
		$('.obtainDate').val("");
		$('.assetsName').val("");
		$('.sourceFunds').setSelectVal("");
		$('.assetsCode').val("");
		$('.directionUse').setSelectVal("");
		$('.assetsName').val("");
		$('.useStatus').setSelectVal("");
		$('.assetsBrand').val("");
		$('.deptId').setSelectVal("");
		$('.assetsModel').val("");
		$('.userName').setSelectVal("");
		$('.serialNumber').val("");
		$('.administratorCode').setSelectVal("");
		$('.assetsCount').val("");
		$('.placeStorage').val("");
		$('.assetsWorth').val("");
		$('.otherCode').val("");
		$('.remarks').val("");
	},
	
	
	
	//资产详情
	look:function(){
		//资产类别
		var typeId = $('#typeList').text();	
		//资产分类代码
		var classifyCode = $('#assetsCodeList').text();
		//取得日期
		var obtainDate = $('#txtDate').text();
		//资产分类名称
		var classifyName = $('.classifyName').text();
		//资金来源
		var sourceFunds = $('.sourceFunds').text();
		//资产编号
		var assetsCode = $('#assetsCode').text();
		//使用方向
		var directionUse = $('.directionUse').text();
		//资产名称
		var assetsName = $('.assetsName').text();
		//使用状况
		var useStatus = $('.useStatus').text();
		//资产品牌
		var assetsBrand = $('.assetsBrand').text();
		//使用部门
		var deptId = $('.deptId').text();
		//规格型号
		var assetsModel = $('.assetsModel').text();
		//使用人
		var userCode = $('.userName').text();
		//序列号
		var serialNumber = $('.serialNumber').text();
		//管理人
		var administratorCode = $('.administratorCode').text();
		//资产数量
		var assetsCount = $('.assetsCount').text();
		//存放地点
		var placeStorage = $('.placeStorage').text();
		//资产价值
		var assetsWorth = $('.assetsWorth').text();
		//备注
		var remarks = $('.remarks').text();
	},
	 
	//获取资产编号
	getAssetsCode:function(){
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "administrator/assets/getAssetsCode",
			data: {
				
			},
			async: false,
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag==0){
					$('.add-table').find('#assetsCode').val(data.data);
				}else if(data.flag==2){
					$yt_alert_Model.prompt(data.message);
				}
				$yt_baseElement.hideLoading();
			},error:function(){
				$yt_baseElement.hideLoading();
			}
		});
	},
	
	//验证资产编号
	getAssetsCodeIsHave:function(){
		var numCode=0;
		var pkId = $('.hid-pk-id').val();
		var assetsCode = $('#assetsCode').val();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "administrator/assets/getAssetsCodeIsHave",
			data: {
				pkId:pkId,
				assetsCode:assetsCode
			},
			async: false,
			success: function(data) {
				if(data.flag==0){
					if(data.data==1){
						numCode=data.data;
					}
				}
				
			}
		});
		return numCode;
	},
	//新增功能
	addOrUpdateRoom:function(){
		var pkId = $('.hid-pk-id').val();
		//资产类别
		var typeId = $('#typeList').val();	
		//资产分类代码
		var classifyCode = $('#assetsCodeList').val();
		//取得日期
		var obtainDate = $('#txtDate').val();
		//资产分类名称
		var classifyName = $('.classifyName').val();
		//资金来源
		var sourceFunds = $('.sourceFunds').val();
		
		//资产编号
		var assetsCode = $('#assetsCode').val();
		//使用方向
		var directionUse = $('.directionUse').val();
		//资产名称
		var assetsName = $('.assetsName').val();
		//使用状况
		var useStatus = $('.useStatus').val();
		//资产品牌
		var assetsBrand = $('.assetsBrand').val();
		//使用部门
		var deptId = $('.deptId').val();
		//规格型号
		var assetsModel = $('.assetsModel').val();
		//使用人
		var userCode = $('.userName').val();
		//序列号
		var serialNumber = $('.serialNumber').val();
		//管理人
		var administratorCode = $('#administratorCode').val();
		//资产数量
		var assetsCount = $('.assetsCount').val();
		//存放地点
		var placeStorage = $('.placeStorage').val();
		//资产价值
		var assetsWorth = $(".hid-input-assets-worth").val();
		//其他编号
		var otherCode = $('.otherCode').val();
		//备注
		var remarks = $('#remarks').val();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "administrator/assets/addOrUpdateRoom",
			data: {
				pkId:pkId,
				typeId:typeId,
				classifyCode:classifyCode,
				obtainDate:obtainDate,
				assetsCode:assetsCode,
				assetsName:assetsName,
				assetsBrand:assetsBrand,
				sourceFunds:sourceFunds,
				directionUse:directionUse,
				useStatus:useStatus,
				deptId:deptId,
				assetsModel:assetsModel,
				userCode:userCode,
				serialNumber:serialNumber,
				administratorCode:administratorCode,
				assetsCount:assetsCount,
				placeStorage:placeStorage,
				assetsWorth:assetsWorth,
				otherCode:otherCode,
				remarks:remarks
			},
			async: false,
			before:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag == 0) {
					var btnType = $(".btn-type").val();
					if(btnType == 1){
						$yt_alert_Model.prompt("新增数据成功！");
					}else{
						$yt_alert_Model.prompt("修改数据成功！");
					}
					$yt_baseElement.hideLoading()
					assetsList.getPlanListInfo();
				} else {
					$yt_baseElement.hideLoading(function(){
						if(btnType == 1){
							$yt_alert_Model.prompt("新增数据失败！");
						}else{
							$yt_alert_Model.prompt("修改数据失败！");
						}
					})
					assetsList.getPlanListInfo();
				}
			}
		});
		
	},
	
	//修改功能     
	getUpdate:function(){
		var pkId = $('.hid-pk-id').val();
		//根据获取到的pkId获取一条详细信息，并放到弹出框
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "administrator/assets/getBeanById",
			data: {
				pkId:pkId
			},
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			async: true,
			success: function(data) {
				if(data.flag == 0) {
							//$('.shuttle-box').setData(data.data);
							$(".hid-type-id").val("");
							$(".hid-type-name").val("");
							$(".hid-type-id").val(data.data.typeId);
							$(".hid-type-name").val(data.data.classifyName);
							if ($(".hid-type-id").val() != 0 && $(".hid-type-name").val() !="")  {
								//资产分类代码
								assetsList.getclassifyCode();
							}
							//资产类别
							$('#typeList').setSelectVal(data.data.typeId);	
							$('#assetsCodeList').setSelectVal(data.data.classifyCode);
							//取得日期
							$('#txtDate').val(data.data.obtainDate);
							//资产分类名称
							$('#classifyName').setSelectVal(data.data.classifyCode);
							//资金来源
							$('#sourceFunds').setSelectVal(data.data.sourceFunds);
							//资产编号
							$('#assetsCode').val(data.data.assetsCode);
							//使用方向
							$('#directionUse').setSelectVal(data.data.directionUse);
							//资产名称
							$('.assetsName').val(data.data.assetsName);
							//使用状况
							$('#useStatus').setSelectVal(data.data.useStatus);
							//资产品牌
							$('#assetsBrand').val(data.data.assetsBrand);
							//使用部门
							$('#deptList').setSelectVal(data.data.deptId);
							//规格型号
							$('#assetsModel').val(data.data.assetsModel);
							//使用人
							$('#userName').setSelectVal(data.data.userCode);
							//序列号
							$('#serialNumber').val(data.data.serialNumber);
							//管理人
							$('#administratorCode').setSelectVal(data.data.administratorCode);
							//资产数量
							$('#assetsCount').val(data.data.assetsCount);
							//存放地点
							$('#placeStorage').val(data.data.placeStorage);
							//资产价值
							 $('#assetsWorth').val(data.data.assetsWorth);
							//其他编号
							$('#otherCode').val(data.data.otherCode);
							//备注
							$('#remarks').val(data.data.remarks);
						
					
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function (){
						$yt_alert_Model.prompt("获取数据失败");
					});
					
				}
			}
		});
		
	},
	
	
	//删除资产
	removeBeanById: function(pkId) {
		 $yt_baseElement.showLoading();
		 
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "administrator/assets/removeBeanById", //ajax访问路径  
			async: false,
			data: {
				pkIds: pkId,
			},
			success: function(data) {
				if(data.flag == 0) {
					$yt_baseElement.hideLoading();
			   		assetsList.getPlanListInfo();
				} else {
					$yt_baseElement.hideLoading(function (){
			   			$yt_alert_Model.prompt("删除资产失败");
			   		});
					
				}
			} //回调函数 匿名函数返回查询结果  
		});
	},
	
	
	//点击查看详情
	lookOneInfor:function(pkId){
	$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "administrator/assets/getBeanById",
			data: {
				pkId:pkId
			},
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					//var classifyCode=data.data.classifyCode+data.data.classifyName
						var directionUse ="";
						var useStatus = "";
						var sourceFunds = "";
						
						if (data.data.sourceFunds==1) {
							sourceFunds="财政";
						};
						if (data.data.sourceFunds==2) {
							sourceFunds="自有";
						};
						if (data.data.sourceFunds==3) {
							sourceFunds="财政&自有";
						};
						
						
						if (data.data.directionUse==1) {
								directionUse="自用";
						};
						if (data.data.directionUse==2) {
							directionUse="出借";
						};
						if (data.data.directionUse==3) {
							directionUse="出租";
						}
						if (data.data.directionUse==4) {
							directionUse="其它";
						}
						
						if (data.data.useStatus==1) {
							useStatus="在用";
						};
						if (data.data.useStatus==2) {
							useStatus="不能用";
						};
						if (data.data.useStatus==3) {
							useStatus="闲置";
						};
						if (data.data.useStatus==4) {
							useStatus="其他";
						};
						//资产类别
						$('#typeName-look').text(data.data.typeName);	
						//资产分类代码
						$('#classifyCode-look').text(data.data.classifyCode);
						//取得日期
						$('#txtDate-look').text(data.data.obtainDate);
						//资产分类名称
						$('#classifyName-look').text(data.data.classifyName);
						//资金来源
						$('#sourceFunds-look').text(sourceFunds);
						//资产编号
						$('#assetsCode-look').text(data.data.assetsCode);
						//使用方向
						$('#directionUse-look').text(directionUse);
						//资产名称
						$('#assetsName-look').text(data.data.assetsName);
						//使用状况
						$('#useStatus-look').text(useStatus);
						//资产品牌
						$('#assetsBrand-look').text(data.data.assetsBrand);
						//使用部门
						$('#deptName-look').text(data.data.deptName);
						//规格型号
						$('#assetsModel-look').text(data.data.assetsModel);
						//使用人
						$('#userName-look').text(data.data.userName);
						//序列号
						$('#serialNumber-look').text(data.data.serialNumber);
						//管理人
						$('#administratorName-look').text(data.data.administratorName);
						//资产数量
						$('#assetsCount-look').text(data.data.assetsCount);
						//存放地点
						$('#placeStorage-look').text(data.data.placeStorage);
						//资产价值
						 $('#assetsWorth-look').text(data.data.assetsWorth);
						
						//备注
						$('#remarks-look').text(data.data.remarks);
						$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function (){
						$yt_alert_Model.prompt("获取数据失败");
					});
				}
			}
		});
	},

	//批量导入   
//	getImportAssets:function(){
//		var addFile =  $('.upload-file-btn').attr("id");
//	    $yt_baseElement.showLoading();
//	    //var url = $yt_option.acl_path + "api/tAscPortraitInfo/addFile?modelCode=couseFile";
//	    var url = $yt_option.base_path + "administrator/assets/importAssets";;
//	    $.ajaxFileUpload({
//			url: url,
//			type: "post",
//			dataType: 'json',
//			fileElementId:addFile,
//			success: function(data, textStatus) {
//			    var resultData = $.parseJSON(data);
//			    if(resultData.success == 0){
//			    	$yt_baseElement.hideLoading(function (){
//			    		$("#"+addFile).prev().val(resultData.obj.naming).data("fileInfo",resultData.obj);
//			    		$yt_alert_Model.prompt("附件上传成功");
//			    	});
//				
//			    }else{
//			    	$yt_baseElement.hideLoading(function (){
//			    		$yt_alert_Model.prompt("附件上传失败");
//			    	});
//			    }
//			     
//			},
//			error: function(data, status, e){ //服务器响应失败处理函数  
//			   	$yt_baseElement.hideLoading(function (){
//			   		$yt_alert_Model.prompt("附件上传失败");	
//			   	});
//			}
//	    });
//	},

	
	//导出功能
	getExportAssets:function(){
		var selectParam = $('#keyword').val();
		var aText;
		var assetsCodes = "";
		$('.select-assets-alert-checkbox input[class="select-assets-pkId"]:checked').each(function(i,n) {
			aText = $(n).parent().parent().parent().eq(0).find('.assetsCode');
			if(assetsCodes == "") {
				assetsCodes = aText.text();
			} else {
				assetsCodes += "," + aText.text();
			}
		});
		alertNmae=$('.types').val();
		$.ajaxDownloadFile({
			url:$yt_option.base_path+"administrator/assets/exportAssets",
			data:{
				selectParam:selectParam,
				obtainDateStart:"",
				obtainDateEnd:"",
				typeId:"",
				directionUse:"",
				useStatus:"",
				assetsCodes:assetsCodes,
				fileName:"资产导出数据"
			}
		});
	}
}
$(function() {
	//初始化方法
	assetsList.init();
});