var classBoardList = {
	//初始化方法
	init: function() {
		var nowDate = new Date().toLocaleDateString().replace('年','/').replace('月','/').replace('日','').replace(/-/g,'/').split('/');
		nowDate[2] = Number(nowDate[2])+1;
		nowDate = nowDate.join('/');
		$("#txtDate1").calendar({  
		    speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
		    complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
		    readonly: true, // 目标对象是否设为只读，默认：true     
		    nowData:true,//默认选中当前时间,默认true  
		    lowerLimit:nowDate,
		    dateFmt:"yyyy-MM-dd",  
		    callback: function() { // 点击选择日期后的回调函数  
		        classBoardList.classBoardListInfo();
		    }  
		});  
		$("#txtDate2").calendar({  
		    speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
		    complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
		    readonly: true, // 目标对象是否设为只读，默认：true     
		    nowData:false,//默认选中当前时间,默认true  
		    lowerLimit:$("#txtDate1"),
		    dateFmt:"yyyy-MM-dd",  
		    callback: function() { // 点击选择日期后的回调函数  
		       classBoardList.classBoardListInfo();
		    }  
		});  
		$("#txtDate2").val(classBoardList.halfData($("#txtDate1").val(),'next'));
		//调用获取列表数据方法
		var getYears = new Date().getFullYear();
		var getMouth = new Date().getMonth()+1<10?'0'+(new Date().getMonth()+1):new Date().getMonth()+1;
		var getDay = new Date().getDay()<10?'0'+(new Date().getDay()):new Date().getDay();
		var dates = getYears+'-'+getMouth+'-'+getDay;
		classBoardList.classBoardListInfo();
		$('.halfmonth').off().click(function(){
			$("#txtDate1").val(dates);
			$("#txtDate2").val(classBoardList.halfData(dates,'next'));
			classBoardList.classBoardListInfo();
		})
		$('.thismonth').off().click(function(){
			$("#txtDate1").val(dates);
			$("#txtDate2").val(classBoardList.halfData(dates,'onemonth'));
			classBoardList.classBoardListInfo();
		})
	},
	/**
	 * 获取列表数据
	 */
	classBoardListInfo: function() {
		$('.settlement-page').pageInfo({
			pageIndexs: sessionStorage.getItem("pageIndex")?sessionStorage.getItem("pageIndex"):1,
			pageNum: 10, //每页显示条数  
			pageSize: 15, //显示...的规律  
			url: $yt_option.base_path + "class/getClassKanBan", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				startTime:$("#txtDate1").val(),
				endTime:$("#txtDate2").val(),
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			async:true,
			before:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				sessionStorage.clear();
				if(data.flag == 0) {
					$('.num').text(data.data.total);
					var htmlTbody = $('.list-tbody').empty();
					var htmlTr = '';
					if(data.data.rows.length > 0) {
						$('.settlement-page').show();
						$.each(data.data.rows, function(i, v) {
							if(v.projectHead == "null"){
								v.projectHead = "";
							}
							if(v.projectSell == "null"){
								v.projectSell = "";
							}
							if(v.projectType == 1){
								projectTypeName = "计划";
							}
							if(v.projectType == 2){
								projectTypeName = "委托";
							}
							if(v.projectType == 3){
								projectTypeName = "选学";
							}
							if(v.projectType == 4){
								projectTypeName = "中组部调训";
							}
							if(v.projectType == 5){
								projectTypeName = "国资委调训";
							}
							var activeHtml = '<ul>';
							var receptionActivities = v.receptionActivities.split(';');
							$.each(receptionActivities,function(i,n){
								activeHtml +='<li><a class="active">'+n+'</a></li>';
							});
							activeHtml+='</ul>';
							htmlTr = '<tr>' +
								'<td>'+v.startDate+'</td>' +
								'<td style="text-align: left;"><a style="color: #3c4687;" class="projectName">' + v.projectName + '</a></td>' +
								'<td>' + projectTypeName + '</td>' +
								'<td style="text-align: left;">' + activeHtml + '</td>' +
								'<td style="text-align: left;"><a class="personnelNamesTwo">' + v.personnelNamesTwo + '</a></td>' +
								'<td style="text-align: left;"><a class="personnelNamesOne">' + v.personnelNamesOne + '</a></td>' +
								'<td style="text-align: left;"><a class="importantTrainee">' + v.importantTrainee + '</a></td>' +
								'</tr>';
								htmlTr = $(htmlTr).data('data',v);
								htmlTbody.append(htmlTr);
						});
						$('.projectName').off().click(function(){
							sessionStorage.setItem("pageIndex", $('.num-text.active').text());
							window.location.href = 'calssBoardInfo.html?projectCode='+$(this).parents('tr').data('data').projectCode;
						})
						$('.active').off().click(function(){
							sessionStorage.setItem("pageIndex", $('.num-text.active').text());
							window.location.href = 'calssBoardInfo.html?scrollTop=receptionActivities&projectCode='+$(this).parents('tr').data('data').projectCode;
						})
						$('.personnelNamesTwo,.personnelNamesOne').off().click(function(){
							sessionStorage.setItem("pageIndex", $('.num-text.active').text());
							window.location.href = 'calssBoardInfo.html?scrollTop=personnelNames&projectCode='+$(this).parents('tr').data('data').projectCode;
						})
						$('.importantTrainee').off().click(function(){
							sessionStorage.setItem("pageIndex", $('.num-text.active').text());
							window.location.href = 'calssBoardInfo.html?scrollTop=importantTrainee&projectCode='+$(this).parents('tr').data('data').projectCode;
						})
					} else {
						$('.settlement-page').hide();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="7" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
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
	//计算半月
	halfData:function(dates,to){
		dates = dates.replace(/-/g,'/');
		var date = new Date(dates);
		if(to=='next'){
			date.setTime(date.getTime()+15*24*60*60*1000);
			date = dateFormat('yyyy-MM-dd',date);
		}else if(to=='before'){
			date.setTime(date.getTime()-15*24*60*60*1000);
			date = dateFormat('yyyy-MM-dd',date);
		}else if(to=='onemonth'){
			date.setTime(date.getTime()+30*24*60*60*1000);
			date = dateFormat('yyyy-MM-dd',date);
		}
		return date;
		function dateFormat(fmt, d) { //author: meizz
			var o = {
				"M+": d.getMonth() + 1, //月份 
				"d+": d.getDate(), //日 
				"H+": d.getHours(), //小时 
				"m+": d.getMinutes(), //分 
				"s+": d.getSeconds(), //秒 
				"q+": Math.floor((d.getMonth() + 3) / 3), //季度 
				"S": d.getMilliseconds() //毫秒 
			};
			if(/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
			for(var k in o)
				if(new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
			return fmt;
		}
	}
}
$(function() {
	//初始化方法
	classBoardList.init();
	
});