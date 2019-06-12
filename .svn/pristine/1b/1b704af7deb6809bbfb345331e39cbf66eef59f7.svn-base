var versionMgr={
	init:function(){
		//绑定页面事件
		versionMgr.events();
		//给当前页面设置最小高度
		$("#versionMgr").css("min-height",$(window).height()-32);
		//初始化日期
		//开始日期
		$("#beginDate").calendar({
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $("#endDate"), //开始日期最大为结束日期  
			speed: 0,
			callback: function() {
			}
		});
		//终止日期
		$("#endDate").calendar({
//			controlId: "endDate",
			nowData: false, //默认选中当前时间,默认true  
			lowerLimit: $("#beginDate"), //结束日期最小为开始日期  
			speed: 0,
			callback: function() {
			}
		});
	},
	events:function(){
		//重置按钮事件
		$("#resetBtn").click(function(){
			$("#beginDate,#endDate,#versionId").val("");
			versionMgr.getVersionList();
		});
		//查询按钮事件
		$("#heardSearchBtn").click(function(){
			versionMgr.getVersionList();
		});
		//新增按钮事件
		$("#addBtn").click(function(){
			versionMgr.showAlert();
		});
		//编辑按钮事件
		$("#upBtn").click(function(){
			var selTrLen = $("#tableList tbody tr.yt-table-active").length;
			if(selTrLen == 0){
				$yt_alert_Model.prompt("请选择一行数据进行操作");
			}else{
				var thisTr=$("#tableList tbody tr.yt-table-active");
				var versionId=thisTr.find(".version-id").val();
				$(".yt-edit-alert .hid-version-id").val(thisTr.find(".version-id").val());
 	    		$(".yt-edit-alert .version-num").val(thisTr.find(".version-num").text());
 	    		$(".yt-edit-alert .version-description").val(thisTr.find(".version-description").text());
				versionMgr.showAlert();
			}
		});
	},
	/*获取预算类别方法*/
	getVersionList:function(numPage){
		//queryParams	关键字查询
		//startDate	开始时间
		//endDate	结束时间
		//pageIndex	分页页数
		//pageNum	分页条数
		var queryParams=$("#versionId").val();
		var startDate=$("#beginDate").val();
		var endDate=$("#endDate").val();
		$('.version-table-page').pageInfo({
			pageIndex: numPage == undefined ? "1" : numPage,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url:"basicconfig/version/getVersionlistByParams", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				queryParams:queryParams,
				startDate:startDate,
				endDate:endDate
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				var htmlTbody = $('#tableList .yt-tbody');
				htmlTbody.empty();
				var trStr  = "";
				if(data.flag==0){
					var datas = data.data.rows;
					if(datas.length > 0){
						//显示分页
						$(".version-table-page").show();
						var trDoc  = '';
						//拼接预算表数据
						$.each(datas,function (i,n){
							trDoc = '<tr>'+
						 	    		'<td><input class="version-id" value="'+n.versionId+'" type="hidden"><span class="version-num">'+n.versionNum+'</span></td>'+
						 	    		'<td style="text-align: left;" class="version-description">'+n.versionDescription+'</td>'+
						 	    		'<td>'+n.versionTime+'</td>'+
						 	    	'</tr>';
							$("#tableList tbody").append(trDoc);
						});
					}else{
						//没有数据是显示数据
						htmlTbody.append(versionMgr.noDataTrStr(3));
						//隐藏分页
						$(".version-table-page").hide();
					}
				}
				
			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	//带有顶部标题栏的弹出框  
    showAlert:function() {  
        /** 
         * 显示编辑弹出框和显示顶部隐藏蒙层 
         */  
        $(".yt-edit-alert,#heard-nav-bak").show();  
        /** 
         * 调用算取div显示位置方法 
         */  
        $yt_alert_Model.getDivPosition($(".yt-edit-alert"));  
        //弹窗保存按钮事件
        $(".yt-edit-alert").off().on("click",".version-save-btn",function(){
        	//获取数据
        	if($("input[name='versionNum']").val() == null || $.trim($("input[name='versionNum']").val()).length == 0){
				$yt_alert_Model.prompt("版本号不能为空!");
				return;
			}
        	var versionId=$(".yt-edit-alert .hid-version-id").val();
    		var versionNum=$(".yt-edit-alert .version-num").val();
    		var versionDescription=$(".yt-edit-alert .version-description").val();
        	if(!versionId){
	        	$.ajax({
					type:"post",
					url:"basicconfig/version/saveVersionInfo",
					data:{
						versionNum:versionNum,
						versionDescription:versionDescription
					},
					success:function(data){
						if(data.flag == 0){
							$yt_alert_Model.prompt("提交成功");
							//清空表中数据
							$("input[name='versionNum']").val("");
							$(".yt-edit-alert .hid-version-id").val("");
							$("textarea[name='versionDescription']").val("");
							//隐藏页面中自定义的表单内容  
				            $(".yt-edit-alert,#heard-nav-bak").hide();  
				            //隐藏蒙层  
				            $("#pop-modle-alert").hide(); 
				            //获取当前页数
				            var thisPage=$(".version-table-page .active").text();
				            //获取预算类别方法
							versionMgr.getVersionList(thisPage);
						}else{
							$yt_alert_Model.prompt("提交失败");
						}
					},
				});
        	}else{
	        	$.ajax({
					type:"post",
					url:"basicconfig/version/updateVersionInfo",
					data:{
						versionId:versionId,
						versionNum:versionNum,
						versionDescription:versionDescription
					},
					success:function(data){
						if(data.flag == 0){
							$yt_alert_Model.prompt("编辑成功");
							//清空表中数据
							$("input[name='versionNum']").val("");
							$("textarea[name='versionDescription']").val("");
							$(".yt-edit-alert .hid-version-id").val("");
							//隐藏页面中自定义的表单内容  
				            $(".yt-edit-alert,#heard-nav-bak").hide();  
				            //隐藏蒙层  
				            $("#pop-modle-alert").hide();  
				            //获取当前页数
				            var thisPage=$(".version-table-page .active").text();
				            //获取预算类别方法
							versionMgr.getVersionList(thisPage);
						}else{
							$yt_alert_Model.prompt("编辑失败");
						}
					},
				});
        	}
        });
        
        /** 
         * 点击取消方法 
         */  
        $('.yt-edit-alert .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {  
            //清空表中数据
            $(".yt-edit-alert .hid-version-id").val("");
            $("input[name='versionNum']").val("");
			$("textarea[name='versionDescription']").val("");
            //隐藏页面中自定义的表单内容
            $(".yt-edit-alert,#heard-nav-bak").hide();  
            //隐藏蒙层  
            $("#pop-modle-alert").hide();  
        });  
    },
	/**
	 * 拼接暂无数据内容
	 * @param {Object} trNum  行数
	 */
	noDataTrStr:function(trNum){
		//暂无数据内容
		var noDataStr = '<tr style="border:0px;background-color:#fff !important;"><td  colspan="'+trNum+'" align="center"style="border:0px;"><div class="no-data" style="width: 280px;margin: 0 auto;">' +
			'<img src="resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
			'</div></td></tr>';
	    return noDataStr;
	},
	
};

$(function(){
	//初始化页面
	versionMgr.init();
	//获取预算类别方法
	versionMgr.getVersionList();
});