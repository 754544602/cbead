/**
 * 满意度评分汇总（选学）
 */
var quList = {
	//初始化方法
	init: function() {
		quList.getClassDetails();
		quList.demoSatisfaction();
		quList.getDetailsExportList(); //学员满意度评分导出
		quList.getOriginalExportList(); //原始评分导出
//		quList.look();
		quList.addContentText();
		//设置列表样式
		$(".tab-title-list button").click(function() {
			$(this).addClass("active").siblings().removeClass("active");
			$(".details-box .original-box").hide().eq($(this).index()).show();
			if($(this).index() == 0) {
				$("div.pro-info-title,div.pro-info-content").show();
				$(".summary-box").show();
				$(".details-box").hide();
				$(".original-box").hide();
				quList.addContentText();
				quList.demoSatisfaction();
			} else if($(this).index() == 1) {
				$("div.pro-info-title,div.pro-info-content").hide();
				$(".details-box").show();
				$(".summary-box").hide();
				$(".original-box").hide();
				$("input[type=checkbox][name='test']").setCheckBoxState("check");
				quList.getDetailsList(); //满意度评分列表
			} else if($(this).index() == 2) {
				$("div.pro-info-title,div.pro-info-content").hide();
				$(".original-box").show();
				$(".summary-box").hide();
				$(".details-box").hide();
				$("input[type=checkbox][name='test2']").setCheckBoxState("check");
				quList.getOriginalList(); //原始评分列表
			}
		});
		//返回班级管理页面
		$('.page-return-btn').off().on('click', function() {
			window.location.href = "projectQualityList.html";
		});

		///tab标签切换
		$(".more-tab-btn-end").click(function() {
			var leftVal = parseInt($(".tab-title-box").css("margin-left")) - 120;
			if($(".tab-title-box").parent().width() > ($(".tab-title-box button").last().position().left - 120)) {
				$(".more-tab-btn-end").hide();
				leftVal = (120 * $(".tab-title-box button").length - $(".tab-title-box").parent().width() + 32) * -1;
			}
			$(".tab-title-box").css("padding-left", "32px").stop(true, true).animate({
				"margin-left": leftVal
			}, 100);
			$(".more-tab-btn-start").show();
		});
		$(".more-tab-btn-start").click(function() {
			var leftVal = parseInt($(".tab-title-box").css("margin-left")) + 120;

			if(leftVal >= -120) {
				$(this).hide();
				leftVal = 0;
				$(".tab-title-box").css("padding-left", "0");
			}
			console.log(leftVal);
			$(".tab-title-box").stop(true, true).animate({
				"margin-left": leftVal
			}, 100);
			$(".more-tab-btn-end").show();
		});
		$("#searchList").click(function() {
			quList.getDetailsList();
		});
		$("#searchList2").click(function() {
			quList.getOriginalList();
		});
		//无效按钮
		$(".effective").click(function() {
			var bool=quList.updateEffective($('.effective').val());
			if(bool) {
				quList.refreshEffective();
			}

		});
		//有效按钮
		$(".invalid").click(function() {
			var bool=quList.updateEffective($('.invalid').val());
			if(bool) {
				quList.refreshEffective();
			}
		});
		//评分详情未评价、已评价
		$('.details-box .search-btn-slect input[type=checkbox]').change(function(){
			quList.getDetailsList();
		})
		//原始评分详情未评价、已评价
		$('.original-box .search-btn-slect input[type=checkbox]').change(function(){
			quList.getOriginalList();
		});
		//点击列表选中
		$('.class-tbody2').off('click').on('click','tr',function(){
			
			var exName=$(this).attr('exname');
			$(".ex[exname="+exName+"]").addClass('yt-table-active').siblings(".ex[exname!="+exName+"]").removeClass('yt-table-active');
			console.log('thisClass',exName);
		});
	},
	/**
	 * 获取班级信息详情
	 */
	getClassDetails:function(){
		//班级信息的id
		var pkId=$yt_common.GetQueryString("pkId");
		$.ajax({
			type:"post",
			url:$yt_option.base_path + "project/getBeanById",
			data:{
			pkId:pkId
			},
			async:true,
			success:function(data){
				if(data.flag==0){
					if(data.data.projectType==1){
						data.data.projectType="计划";
					}else if(data.data.projectType==2){
						data.data.projectType="委托";
					}else if(data.data.projectType==3){
						data.data.projectType="选学";
					}else{
						data.data.projectType="调训";
					}
					$(".proje-details-div").setDatas(data.data);
				$('.project-name').text(data.data.projectName);
				}else{
					
				}
			}
		});
	},
	/*
	 获取班级名称
	 * 
	 * */
//	look:function(){
//		var projectCode = $yt_common.GetQueryString("projectCode");
//		$.ajax({
//			type:"post",
//			url:$yt_option.base_path + "class/questionnaire/lookForAll",
//			async:true,
//			beforeSend:function(){
//				$yt_baseElement.showLoading();
//			},
//			data:{
//				selectParam:projectCode,
//				pageIndexs:1,
//				pageNum:15
//			},
//			success:function(data){
//				$('.project-name').text(data.data.rows[0].projectName);
//				$yt_baseElement.hideLoading();
//				
//			},
//			error:function(data){
//				$yt_baseElement.hideLoading();
//				$yt_alert_Model.prompt('网络异常')
//			}
//		});
//	},
	/**
	 * 总体满意度dom图
	 */
	demoSatisfaction: function() {
		var xAxisList = new Array();
		var seriesList = new Array();
		var projectCode = $yt_common.GetQueryString("projectCode");
		var downUrl = $yt_option.base_path + "class/questionnaire/getChartBySelection";
		$yt_baseElement.showLoading();
		$.post(downUrl, {
			'projectCode': projectCode
		}, function(data) {
			if(data.flag == 0) {
				//参评率
				if(data.data.evaluation)$('.rateDiv').setDatas(data.data.evaluation);
				var wholeSatisfaction=0;
				var wholeSatisfactionLength=0;
				if(data.data.radarChart.columnCode.length==0){
					data.data.radarChart.columnCode = ['培训设计与实施','授课效果','教学活动','教学组织、学风院风、后勤服务','培训学习效果'];
					data.data.radarChart.columnFraction = [0,0,0,0,0]
				}
				$.each(data.data.radarChart.columnCode, function(k, v) {
					xAxisList.push({
						name: v,
						max: 100
					});
					if(data.data.radarChart.columnFraction[k]!=''){
							wholeSatisfaction += Number(data.data.radarChart.columnFraction[k]);
							wholeSatisfactionLength++;
					}
				});
				wholeSatisfaction = (wholeSatisfaction/Number(wholeSatisfactionLength)).toFixed(2);
				wholeSatisfaction=='NaN'?wholeSatisfaction=0:'';
				seriesList = $.map(data.data.radarChart.columnFraction, function(n, i){ return Number(n).toFixed(2)});
				// 基于准备好的dom，初始化echarts实例
				$('.drawing-1').replaceWith('<div class="drawing-1" style="width: 100%;height:100%;"></div>');
				var myChart = echarts.init($('.drawing-1').get(0));
				// 指定图表的配置项和数据
//				$('#wholeSatisfaction').html(wholeSatisfaction);
				var option = {
					backgroundColor: '#ffffff',
					title: {
						text: '总体满意度',
						textStyle: {
							color: '#111111',
							fontSize: 18,
							fontWeight: 100
						}
					},
					tooltip: {
						formatter:function(v){
							var h = v.seriesName +'<br/>'
							$.each(xAxisList, function(i,n) {
								h+=n.name+':'+v.value[i]+'<br/>'
							});
							return h
						}
					},
					legend: {
						x: 'center',
						top: '10%',
						textStyle: {
							color: '#5B5B5B',
						},
					},
					radar: {
						// shape: 'circle',
						name: {
							textStyle: {
								color: '#333333',
								fontSize: 14
							}
						},
						indicator: xAxisList
					},
					series: [{
						name: '满意度统计',
						type: 'radar',
						itemStyle: {
							color: '#847ccf',
							borderColor: '#847ccf'

						},
						lineStyle: {
							color: '#847ccf',

						},
						areaStyle: {
							color: '#847ccf',
							opacity: 0.5
						},
						data: [{
							value: seriesList.map(function(x){
								return Number(x).toFixed(2);
							})
						}]
					}]
				};

				// 使用刚指定的配置项和数据显示图表。
				quList.datas = jQuery.extend(true, {}, data.data);
				myChart.setOption(option);
				quList.demoTrain(data.data);
				quList.demoTrain2(data.data);
				quList.demoTrain3(data.data,projectCode);
				quList.demoTrain4(data.data);
				quList.demoTrain5(data.data);
				quList.demoTrain6(data.data);
				quList.demoTrain7(data.data);
				quList.demoTrain8(data.data);
				window.onresize=function(){
					$('.drawing-1').replaceWith('<div class="drawing-1" style="width: 100%;height:100%"></div>');
					var myChart = echarts.init($('.drawing-1').get(0));
					myChart.setOption(option);
					var datas = jQuery.extend(true, {}, quList.datas);
					quList.demoTrain(datas);
					quList.demoTrain2(datas);
					quList.demoTrain3(datas,projectCode);
					quList.demoTrain4(datas);
					quList.demoTrain5(datas);
					quList.demoTrain6(datas);
					quList.demoTrain7(datas);
					quList.demoTrain8(datas);
				}
			}
			$yt_baseElement.hideLoading()
		});
		
	},
	datas:{},
	numberchina:['一','二','三','四','五','六','七','八','九','十'],
	/**
	 *1、企业类型人数统计dom图
	 */
	demoTrain: function(data) {
		var dataList = data.pieChart;
		var nameList = [];
		$.each(dataList, function(k, v) {
			nameList.push(v.name);
		});
	
		// 基于准备好的dom，初始化echarts实例
		var Height = $('.drawing-2').height();
		$('.drawing-2').replaceWith('<div class="drawing-2" style="width: 100%;height:'+Height+'px"></div>');
		var myChart = echarts.init($('.drawing-2').get(0));
		// 指定图表的配置项和数据
		option = {
			backgroundColor: '#ffffff',
			title: {
				text: '企业类型人数统计',
				textStyle: {
					color: '#111111',
					fontSize: 18,
					fontWeight: 100
				}
			},
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b} : {c} ({d}%)"
			},
			color: ['#847ccf',  '#df94e0', '#b8b3e2','#2a1ca9'],
			legend: {
				orient: 'vertical',
				itemWidth: 10,
				itemHeight: 10,
				top: 140,
				right: 50,
				data: nameList
			},
			series: [{
				name: '企业类型人数统计',
				type: 'pie',
				radius: ['50%', '70%'],
				data: dataList,
				itemStyle: {
					emphasis: {
						shadowBlur: 10,
						shadowOffsetX: 0,
						shadowColor: 'rgba(0, 0, 0, 0.5)'
					}
				},
				itemStyle: {
					normal: {
						label: {
							show: true,
							formatter: '{b} : {c} ({d}%)'
						}
					},
					labelLine: {
						show: true
					}
				}
			}]
		};

		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	},
	/**
	 * 2、培训设计与实施dom图
	 */
	demoTrain2: function(data) {
		var list1 = data.designImplementation.enterpriseData; //各个企业类型人数和平均分数
		var list2 = data.designImplementation.designImplementationData; //柱状图
		if(list1.length==1){
			$('.drawing-3').parents('.every-part').remove();
			return false;
		}
		var enterpriseType = [];
		var allStudent={
			average: 0,
			enterpriseType: "全体学员",
			userCount: 0
		}
		var allStudentData=[];
		$.each(list1, function(k, v) {
			allStudent.average+=Number(v.average)*Number(v.userCount);
			allStudent.userCount+=Number(v.userCount);
			enterpriseType.push(v.enterpriseType);
			v.average = Number(v.average).toFixed(2);
		});
//		enterpriseType.push(allStudent.enterpriseType)
		allStudentData.length = list2.designImplementationYAxis.length;
		allStudentData = $.map(allStudentData, function(n,i) {
			return n=0;
		});
//		$.each(allStudentData, function(x,y) {
//			$.each(list2.designImplementationXAxis,function(i,n){
//				allStudentData[x]+=Number(n.enterpriseAverage[x])*Number(list1[i].userCount);
//			});
//				allStudentData[x] = (allStudentData[x]/allStudent.userCount).toFixed(2);
//		})
//		list2.designImplementationXAxis.push({
//			enterpriseAverage:allStudentData,
//			enterpriseType:'全体学员'
//		})
//		if(list1.length>0){
//			allStudent.average = (allStudent.average/allStudent.userCount).toFixed(2);
//		}
//		list1.push(allStudent);
		var chartsType = list2.designImplementationYAxis;
		var chartsData = list2.designImplementationXAxis;
		var resultData = [];
		var colorList = ['#847ccf', '#df94e0', '#b8b3e2','#f59700'];
		$('.drawing-3').siblings('.average').empty()
		$.each(list1, function(j, m) {
			if(m.enterpriseType!='其他'){
				$('.drawing-3').siblings('.average').append('<span class="userCount">' + m.enterpriseType + '平均满意度：<label class="userCount-label">' + m.average + '</label>分</span>')
			}
		})
		$.each(chartsData, function(k, v) {
			var color = undefined;
			if(v.enterpriseType=='全体学员'){
				color = '#f59700';
			}
			if(v.enterpriseType!='其他'){
				resultData.push({
					name: v.enterpriseType,
					type: 'bar',
					barMaxWidth: 17,
					itemStyle: {
						normal: {
							show: true,
							color: colorList[k],
						}
					},
					label: {
						show: true,
						position: 'right',
						color: '#000'
					},
					barWidth: 17,
					barGap: "0%",
					barCategoryGap: "60px",
					itemStyle: {
						barBorderRadius: [0, 8, 8, 0]
					},
					color:color,
					data: v.enterpriseAverage=$.map(v.enterpriseAverage,function(n,i){return Number(n).toFixed(2)})
				});
			}
		});
		// 基于准备好的dom，初始化echarts实例
		var Height = $('.drawing-3').height();
		$('.drawing-3').replaceWith('<div class="drawing-3" style="height:'+Height+'px"></div>');
		var myChart = echarts.init($('.drawing-3').get(0));
		// 指定图表的配置项和数据
		option = {
			backgroundColor: '#ffffff',
			title: {
				text: quList.numberchina[$('.drawing-3').parents('.every-part').index()]+'、学员对培训设计与实施的平均满意度',
				textStyle: {
					color: '#111111',
					fontSize: 18,
					fontWeight: 100
				},
				top: 10,
				left: 'left'
			},
			legend: {
//				orient: 'vertical',
				y: 'bottom',
				right: 40,
				itemWidth: 10,
				itemHeight: 10,
				textStyle: {
					fontSize: 14,
					color: '#555555',
				},
				data: enterpriseType,
				formatter:function(v){
					var s = '';
					$.each(list1, function(i,n) {
						if(n.enterpriseType==v){
							s= v + n.userCount+'名学员'
						}
					});
					return s
				}
			},
			color: ['#847ccf', '#df94e0', '#b8b3e2','#f59700'],
			grid: {
				left: '3%',
				right: '4%',
				top:'15%',
				containLabel: true
			},
			tooltip: {
				show: "true",
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			xAxis: {
				type: 'value',
				axisTick: {
					show: true
				},
				axisLine: {
					show: true,
					lineStyle: {
						color: '#000',
					}
				},
				max:100,
				axisLabel : {
				formatter :  function(value){
						return value.toFixed(0)
					}
				},
				interval:20
			},
			splitLine: {
				show: true
			},
			yAxis: [{
					type: 'category',
					axisTick: {
						show: false
					},
					inverse:true,
					axisLine: {
						show: true,
						lineStyle: {
							color: '#000000',
						}
					},
					data: chartsType,
					axisLabel:{
						show:true,
						formatter : function(params){
				             return quList.formatter(params,10)
			            }
					}
				},
				{
					type: 'category',
					axisLine: {
						show: false
					},
					axisTick: {
						show: false
					},
					axisLabel: {
						show: false
					},
					splitArea: {
						show: false
					},
					splitLine: {
						show: false
					},
					data: chartsType
				}

			],
			series: resultData
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	},
	/**
	 * 3、教师授课dom图
	 */
	demoTrain3: function(data,projectCode) {
		var list1 = data.teachingEffect.enterpriseData; //各个企业类型人数和平均分数
		var list2 = data.teachingEffect.teachingEffectData; //柱状图
		if(list1.length==1){
			$('.drawing-4').parents('.every-part').remove();
			return false;
		}
		var enterpriseName = [];
		var enterpriseCharts = [];
		var enterpriseType = [];
		var allStudent={
			average: 0,
			enterpriseType: "全体学员",
			userCount: 0
		}
		var allStudentData=[];
		$.each(list1, function(k, v) {
			allStudent.average+=Number(v.average)*Number(v.userCount);
			allStudent.userCount+=Number(v.userCount);
			enterpriseType.push(v.enterpriseType);
			v.average = Number(v.average).toFixed(2);
		});
//		enterpriseType.push(allStudent.enterpriseType);
		allStudentData.length = list2.teachingEffectYAxis.length;
		allStudentData = $.map(allStudentData, function(n,i) {
			return n=0;
		});
//		$.each(allStudentData, function(x,y) {
//			$.each(list2.teachingEffectXAxis,function(i,n){
//				allStudentData[x]+=Number(n.enterpriseAverage[x])*Number(list1[i].userCount);
//			});
//		})
//		$.each(allStudentData, function(x,y) {
//				allStudentData[x] = (allStudentData[x]/allStudent.userCount).toFixed(2);
//				if(x==3&&projectCode=='19X022'){
//					allStudentData[x] = '98.51'
//				}
//		});
//		list2.teachingEffectXAxis.push({
//			enterpriseAverage:allStudentData,
//			enterpriseType:'全体学员'
//		})
//		if(list1.length>0){
//			allStudent.average = (allStudent.average/allStudent.userCount).toFixed(2);
//		}
//		list1.push(allStudent);
		var chartsType = list2.teachingEffectYAxis;
		var chartsData = list2.teachingEffectXAxis;
		var resultData = [];
		var colorList = ['#847ccf', '#df94e0', '#b8b3e2','#f59700'];
		$('.drawing-4').siblings('.average').empty()
		$.each(list1, function(j, m) {
			if(m.enterpriseType!='其他'){
				$('.drawing-4').siblings('.average').append('<span class="userCount">' + m.enterpriseType + '平均满意度：<label class="userCount-label">' + m.average + '</label>分</span>')
			}
		});
		$.each(chartsData, function(k, v) {
			var color = undefined;
			if(v.enterpriseType=='全体学员'){
				color = '#f59700';
			}
			if(v.enterpriseType!='其他'){
				resultData.push({
					name: v.enterpriseType,
					type: 'bar',
					barMaxWidth: 40,
					itemStyle: {
						normal: {
							show: true,
							color: colorList[k],
						}
					},
					label: {
						show: true,
						position: 'right',
						color: '#000'
					},
					barWidth: 17,
					barGap: "0%",
					barCategoryGap: "60px",
					itemStyle: {
						barBorderRadius: [0, 8, 8, 0]
					},
					color:color,
					data: v.enterpriseAverage.map(function(x){
								return Number(x).toFixed(2);
							})
				});
			}
		});
		// 基于准备好的dom，初始化echarts实例
		if(list2.teachingEffectYAxis.length>3){
			$('.drawing-4').replaceWith('<div  class="drawing-4" style="width: 100%;"></div>');
			$('.drawing-4').css('height',400 + ((list2.teachingEffectYAxis.length-3)*120)+'px');
		}else{
			$('.drawing-4').replaceWith('<div  class="drawing-4" style="width: 100%;"></div>');
			$('.drawing-4').css('height','400px');
		}
		var myChart = echarts.init($('.drawing-4').get(0));
		// 指定图表的配置项和数据
		option = {
			backgroundColor: '#ffffff',
			title: {
				text: quList.numberchina[$('.drawing-4').parents('.every-part').index()]+'、学员对教师授课效果的平均满意度',
				textStyle: {
					color: '#111111',
					fontSize: 18,
					fontWeight: 100
				},
				left: 'left',
				top: 10
			},
			color: ['#847ccf', '#df94e0', '#b8b3e2','#f59700'],
			legend: {
				y: 'bottom',
				right: 40,
				itemWidth: 10,
				itemHeight: 10,
				textStyle: {
					fontSize: 14,
					color: '#555555',
				},
				data: enterpriseType,
				formatter:function(v){
					var s = '';
					$.each(list1, function(i,n) {
						if(n.enterpriseType==v){
							s= v + n.userCount+'名学员'
						}
					});
					return s
				}
			},
			grid: {
				left: '3%',
				right: '4%',
				top:'15%',
				bottom:'10%',
				containLabel: true
			},

			tooltip: {
				show: "true",
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			xAxis: {
				type: 'value',
				axisTick: {
					show: true
				},
				axisLine: {
					show: true,
					lineStyle: {
						color: '#000',
					}
				},
				splitLine: {
					show: true
				},
				max:100,
				axisLabel : {
				formatter :  function(value){
						return value.toFixed(0)
					}
				},
				interval:20
			},
			yAxis: [{
					type: 'category',
					axisTick: {
						show: false
					},
					inverse:true,
					axisLine: {
						show: true,
						lineStyle: {
							color: '#000000',
						}
					},
					 axisLabel:{
						show:true,
						formatter : function(params){
				             return quList.formatter(params,10)
			            }
					},
					data: chartsType

				},
				{
					type: 'category',
					axisLine: {
						show: false
					},
					axisTick: {
						show: false
					},
					axisLabel: {
						show: false
					},
					splitArea: {
						show: false
					},
					splitLine: {
						show: false
					},
					data: chartsType
				}

			],
			series: resultData
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	},
	/**
	 *4、教学活动的dom图
	 */
	demoTrain4: function(data) {
		var list1 = data.teachingActivites.enterpriseData; //各个企业类型人数和平均分数
		var list2 = data.teachingActivites.teachingActivitesData; //柱状图
		if(list1.length==1){
			$('.drawing-5').parents('.every-part').remove();
			return false;
		}
		var enterpriseName = [];
		var enterpriseCharts = [];
		var enterpriseType = [];
		var allStudent={
			average: 0,
			enterpriseType: "全体学员",
			userCount: 0
		}
		var allStudentData=[];
		$.each(list1, function(k, v) {
			allStudent.average+=Number(v.average)*Number(v.userCount);
			allStudent.userCount+=Number(v.userCount);
			enterpriseType.push(v.enterpriseType);
			v.average = Number(v.average).toFixed(2);
		});
//		enterpriseType.push(allStudent.enterpriseType);
		allStudentData.length = list2.courseName.length;
		allStudentData = $.map(allStudentData, function(n,i) {
			return n=0;
		});
//		$.each(allStudentData, function(x,y) {
//			$.each(list2.teachingActivitesXAxis,function(i,n){
//				allStudentData[x]+=Number(n.enterpriseAverage[x])*Number(list1[i].userCount);
//			});
//		})
//		$.each(allStudentData, function(x,y) {
//				allStudentData[x] = (allStudentData[x]/allStudent.userCount).toFixed(2);
//		});
//		list2.teachingActivitesXAxis.push({
//			enterpriseAverage:allStudentData,
//			enterpriseType:'全体学员'
//		})
//		if(list1.length>0){
//			allStudent.average = (allStudent.average/allStudent.userCount).toFixed(2);
//		}
//		list1.push(allStudent);
		var chartsType = list2.courseName;
		var chartsData = list2.teachingActivitesXAxis;
		var resultData = [];
		var colorList = ['#847ccf', '#df94e0', '#b8b3e2','#f59700'];
		$('.drawing-5').siblings('.average').empty()
		$.each(list1, function(j, m) {
			if(m.enterpriseType!='其他'){
				$('.drawing-5').siblings('.average').append('<span class="userCount">' + m.enterpriseType + '平均满意度：<label class="userCount-label">' + m.average + '</label>分</span>')
			}
		});
		$.each(chartsData, function(k, v) {
			var color = undefined;
			if(v.enterpriseType=='全体学员'){
				color = '#f59700';
			}
			if(v.enterpriseType!='其他'){
			resultData.push({
				name: v.enterpriseType,
				type: 'bar',
				barMaxWidth: 40,
				itemStyle: {
					normal: {
						show: true,
						color: colorList[k],
					}
				},
				label: {
					show: true,
					position: 'right',
					color: '#000'
				},
				barWidth: 17,
				barGap: "0%",
				barCategoryGap: "60px",
				itemStyle: {
					barBorderRadius: [0, 8, 8, 0]
				},
				color:color,
				data: v.enterpriseAverage.map(function(x){
								return Number(x).toFixed(2);
							})
			});
			}
		});
		// 基于准备好的dom，初始化echarts实例
		if(list2.courseName.length>3){
			$('.drawing-5').replaceWith('<div  class="drawing-5" style="width: 100%;"></div>');
			$('.drawing-5').css('height',400 + ((list2.courseName.length-3)*120)+'px');
		}else{
			$('.drawing-5').replaceWith('<div  class="drawing-5" style="width: 100%;"></div>');
			$('.drawing-5').css('height','400px');
		}
		var myChart = echarts.init($('.drawing-5').get(0));
		// 指定图表的配置项和数据
		option = {
			backgroundColor: '#ffffff',
			title: {
				text: quList.numberchina[$('.drawing-5').parents('.every-part').index()]+'、学员对教学活动的平均满意度',
				textStyle: {
					color: '#111111',
					fontSize: 18,
					fontWeight: 100
				},
				top: 10,
				left: 'left'
			},
			legend: {
				y: 'bottom',
				right: 40,
				itemWidth: 10,
				itemHeight: 10,
				textStyle: {
					fontSize: 14,
					color: '#555555',
				},
				data: enterpriseType,
				formatter:function(v){
					var s = '';
					$.each(list1, function(i,n) {
						if(n.enterpriseType==v){
							s= v + n.userCount+'名学员'
						}
					});
					return s
				}
			},
			color: ['#847ccf', '#df94e0', '#b8b3e2','#f59700'],
			grid: {
				left: '3%',
				right: '4%',
				top:'20%',
				bottom:'10%',
				containLabel: true
			},

			tooltip: {
				show: "true",
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			xAxis: {
				type: 'value',
				axisTick: {
					show: true
				},
				axisLine: {
					show: true,
					lineStyle: {
						color: '#000',
					}
				},
				splitLine: {
					show: true
				},
				max:100,
				axisLabel : {
				formatter :  function(value){
						return value.toFixed(0)
					}
				},
				interval:20
			},
			yAxis: [{
					type: 'category',
					axisTick: {
						show: false
					},
					inverse:true,
					axisLine: {
						show: true,
						lineStyle: {
							color: '#000000',
						}
					},
					 axisLabel:{
						show:true,
						formatter : function(params){
				             return quList.formatter(params,10)
			            }
					},
					data: chartsType

				},
				{
					type: 'category',
					axisLine: {
						show: false
					},
					axisTick: {
						show: false
					},
					axisLabel: {
						show: false
					},
					splitArea: {
						show: false
					},
					splitLine: {
						show: false
					},
					data: chartsType
				}

			],
			series: resultData
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	},
	/**
	 * 5、学员对教学组织、学风院风、后勤服务的dom图
	 * @param data
	 */
	demoTrain5: function(data) {
		var list1 = data.towsls.enterpriseData; //各个企业类型人数和平均分数
		var list2 = data.towsls.towslsData; //柱状图
		if(list1.length==1){
			$('.drawing-6').parents('.every-part').remove();
			return false;
		}
		var enterpriseName = [];
		var enterpriseCharts = [];
		var enterpriseType = [];
		var allStudent={
			average: 0,
			enterpriseType: "全体学员",
			userCount: 0
		}
		var allStudentData=[];
		$.each(list1, function(k, v) {
			allStudent.average+=Number(v.average)*Number(v.userCount);
			allStudent.userCount+=Number(v.userCount);
			enterpriseType.push(v.enterpriseType);
			v.average = Number(v.average).toFixed(2);
		});
//		enterpriseType.push(allStudent.enterpriseType);
		allStudentData.length = list2.towslsYAxis.length;
		allStudentData = $.map(allStudentData, function(n,i) {
			return n=0;
		});
//		$.each(allStudentData, function(x,y) {
//			$.each(list2.towslsXAxis,function(i,n){
//				if(n.enterpriseAverage[x]==undefined){
//					n.enterpriseAverage[x] = 0;
//				}
//				allStudentData[x]+=Number(n.enterpriseAverage[x])*Number(list1[i].userCount);
//			});
//		})
//		$.each(allStudentData, function(x,y) {
//				allStudentData[x] = (allStudentData[x]/allStudent.userCount).toFixed(2);
//		});
//		list2.towslsXAxis.push({
//			enterpriseAverage:allStudentData,
//			enterpriseType:'全体学员'
//		})
//		if(list1.length>0){
//			allStudent.average = (allStudent.average/allStudent.userCount).toFixed(2);
//		}
//		list1.push(allStudent);
		var chartsType = list2.towslsYAxis;
		var chartsData = list2.towslsXAxis;
		var resultData = [];
		var colorList = ['#847ccf', '#df94e0', '#b8b3e2','#f59700'];
		$('.drawing-6').siblings('.average').empty()
		$.each(list1, function(j, m) {
			if(m.enterpriseType!='其他'){
				$('.drawing-6').siblings('.average').append('<span class="userCount">' + m.enterpriseType + '平均满意度：<label class="userCount-label">' + m.average + '</label>分</span>')
			}
		});
		$.each(chartsData, function(k, v) {
			var color = undefined;
			if(v.enterpriseType=='全体学员'){
				color = '#f59700';
			}
			if(v.enterpriseType!='其他'){
			resultData.push({
				name: v.enterpriseType,
				type: 'bar',
				barMaxWidth: 40,
				itemStyle: {
					normal: {
						show: true,
						color: colorList[k],
					}
				},
				label: {
					show: true,
					position: 'right',
					color: '#000'
				},
				barWidth: 17,
				barGap: "0%",
				barCategoryGap: "60px",
				itemStyle: {
					barBorderRadius: [0, 8, 8, 0]
				},
				color:color,
				data: v.enterpriseAverage=$.map(v.enterpriseAverage,function(n,i){return Number(n).toFixed(2)})
			});
			}
		});
		// 基于准备好的dom，初始化echarts实例
		var Height = $('.drawing-6').height();
		$('.drawing-6').replaceWith('<div class="drawing-6" style="width: 100%;height:'+Height+'px"></div>');
		var myChart = echarts.init($('.drawing-6').get(0));
		// 指定图表的配置项和数据
		option = {
			backgroundColor: '#ffffff',
			title: {
				text: quList.numberchina[$('.drawing-6').parents('.every-part').index()]+'、学员对教学组织、学风院风、后勤服务的平均满意度',
				textStyle: {
					color: '#111111',
					fontSize: 18,
					fontWeight: 100
				},
				top: 10,
				left: 'left'
			},
			legend: {
				y: 'bottom',
				right: 40,
				itemWidth: 10,
				itemHeight: 10,
				textStyle: {
					fontSize: 14,
					color: '#555555',
				},
				data: enterpriseType,
				formatter:function(v){
					var s = '';
					$.each(list1, function(i,n) {
						if(n.enterpriseType==v){
							s= v + n.userCount+'名学员'
						}
					});
					return s
				}
			},
			grid: {
				left: '3%',
				right: '4%',
				top:'15%',
				bottom:'10%',
				containLabel: true
			},
			color: ['#847ccf', '#df94e0', '#b8b3e2','#f59700'],
			tooltip: {
				show: "true",
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			xAxis: {
				type: 'value',
				axisTick: {
					show: true
				},
				axisLine: {
					show: true,
					lineStyle: {
						color: '#000',
					}
				},
				splitLine: {
					show: true
				},
				max:100,
				axisLabel : {
				formatter :  function(value){
						return value.toFixed(0)
					}
				},
				interval:20
			},
			yAxis: [{
					type: 'category',
					axisTick: {
						show: false
					},
					inverse:true,
					axisLine: {
						show: true,
						lineStyle: {
							color: '#000000',
						}
					},
					 axisLabel:{
						show:true,
						formatter : function(params){
				             return quList.formatter(params,10)
			            }
					},
					data: chartsType

				},
				{
					type: 'category',
					axisLine: {
						show: false
					},
					axisTick: {
						show: false
					},
					axisLabel: {
						show: false
					},
					splitArea: {
						show: false
					},
					splitLine: {
						show: false
					},
					data: chartsType
				}

			],
			series: resultData
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	},
	/**
	 * 6、学员对培训学习效果的dom图
	 */
	demoTrain6: function(data) {
		var list1 = data.learningeffect.enterpriseData; //各个企业类型人数和平均分数
		var list2 = data.learningeffect.learningeffectData; //柱状图
		if(list1.length==1){
			$('.drawing-7').parents('.every-part').remove();
			return false;
		}
		var enterpriseName = [];
		var enterpriseCharts = [];
		var enterpriseType = [];
		var allStudent={
			average: 0,
			enterpriseType: "全体学员",
			userCount: 0
		}
		var allStudentData=[];
		$.each(list1, function(k, v) {
			allStudent.average+=Number(v.average)*Number(v.userCount);
			allStudent.userCount+=Number(v.userCount);
			enterpriseType.push(v.enterpriseType);
			v.average = Number(v.average).toFixed(2);
		});
//		enterpriseType.push(allStudent.enterpriseType);
		allStudentData.length = list2.learningeffectYAxis.length;
		allStudentData = $.map(allStudentData, function(n,i) {
			return n=0;
		});
//		$.each(allStudentData, function(x,y) {
//			$.each(list2.learningeffectXAxis,function(i,n){
//				if(n.enterpriseAverage[x]==undefined){
//					n.enterpriseAverage[x] = 0;
//				}
//				allStudentData[x]+=Number(n.enterpriseAverage[x])*Number(list1[i].userCount);
//			});
//		})
//		$.each(allStudentData, function(x,y) {
//				allStudentData[x] = (allStudentData[x]/allStudent.userCount).toFixed(2);
//		});
//		list2.learningeffectXAxis.push({
//			enterpriseAverage:allStudentData,
//			enterpriseType:'全体学员'
//		})
//		if(list1.length>0){
//			allStudent.average = (allStudent.average/allStudent.userCount).toFixed(2);
//		}
//		list1.push(allStudent);
		var chartsType = list2.learningeffectYAxis;
		var chartsData = list2.learningeffectXAxis;
		var resultData = [];
		var colorList = ['#847ccf', '#df94e0', '#b8b3e2','#f59700'];
		$('.drawing-7').siblings('.average').empty()
		$.each(list1, function(j, m) {
			if(m.enterpriseType!='其他'){
			$('.drawing-7').siblings('.average').append('<span class="userCount">' + m.enterpriseType + '平均满意度：<label class="userCount-label">' + m.average + '</label>分</span>')
			}
		});
		$.each(chartsData, function(k, v) {
			var color = undefined;
			if(v.enterpriseType=='全体学员'){
				color = '#f59700';
			}
			if(v.enterpriseType!='其他'){
			resultData.push({
				name: v.enterpriseType,
				type: 'bar',
				barMaxWidth: 40,
				itemStyle: {
					normal: {
						show: true,
						color: colorList[k],
					}
				},
				label: {
					show: true,
					position: 'right',
					color: '#000'
				},
				barWidth: 17,
				barGap: "0%",
				barCategoryGap: "60px",
				itemStyle: {
					barBorderRadius: [0, 8, 8, 0]
				},
				color:color,
				data: v.enterpriseAverage=$.map(v.enterpriseAverage,function(n,i){return Number(n).toFixed(2)})
			});
			}
		});
		// 基于准备好的dom，初始化echarts实例
		var Height = $('.drawing-7').height();
		$('.drawing-7').replaceWith('<div class="drawing-7" style="width: 100%;height:'+Height+'px"></div>');
		var myChart = echarts.init($('.drawing-7').get(0));
		// 指定图表的配置项和数据
		option = {
			backgroundColor: '#ffffff',
			title: {
				text: quList.numberchina[$('.drawing-7').parents('.every-part').index()]+'、学员对培训学习效果的平均满意度',
				textStyle: {
					color: '#111111',
					fontSize: 18,
					fontWeight: 100
				},
				top: 10,
				left: 'left'
			},
			legend: {
				y: 'bottom',
				right: 40,
				itemWidth: 10,
				itemHeight: 10,
				textStyle: {
					fontSize: 14,
					color: '#555555',
				},
				data: enterpriseType,
				formatter:function(v){
					var s = '';
					$.each(list1, function(i,n) {
						if(n.enterpriseType==v){
							s= v + n.userCount+'名学员'
						}
					});
					return s
				}
			},
			grid: {
				left: '3%',
				right: '4%',
				top:'20%',
				bottom:'10%',
				containLabel: true
			},
			color: ['#847ccf', '#df94e0', '#b8b3e2','#f59700'],
			tooltip: {
				show: "true",
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			xAxis: {
				type: 'value',
				axisTick: {
					show: true
				},
				axisLine: {
					show: true,
					lineStyle: {
						color: '#000',
					}
				},
				splitLine: {
					show: true
				},
				max:100,
				axisLabel : {
				formatter :  function(value){
						return value.toFixed(0)
					}
				},
				interval:20
			},
			yAxis: [{
					type: 'category',
					axisTick: {
						show: false
					},
					inverse:true,
					axisLine: {
						show: true,
						lineStyle: {
							color: '#000000',
						}
					},
					 axisLabel:{
						show:true,
						formatter : function(params){
				             return quList.formatter(params,10)
			            }
					},
					data: chartsType

				},
				{
					type: 'category',
					axisLine: {
						show: false
					},
					axisTick: {
						show: false
					},
					axisLabel: {
						show: false
					},
					splitArea: {
						show: false
					},
					splitLine: {
						show: false
					},
					data: chartsType
				}

			],
			series: resultData
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	},
	/**
	 * 7、满意度的dom图
	 * @param data
	 */
	demoTrain7: function(data) {
		//总体满意度
		var list1 = data.satisfaction.wholeSatisfaction; //各个企业类型人数和平均分数
		var list2 = data.satisfaction.averageSatisfaction; //平均满意度
		if(list1.length==1){
			$('.drawing-8').parents('.every-part').remove();
			return false;
		}
		/*手动计算平均满意度*/
//		list2 = [
//		{
//			enterpriseAverage:0,
//			enterpriseType:'中央企业',
//			enterpriseLength:0
//		},{
//			enterpriseAverage:0,
//			enterpriseType:'省属企业',
//			enterpriseLength:0
//		},{
//			enterpriseAverage:0,
//			enterpriseType:'市属企业',
//			enterpriseLength:0
//		},{
//			enterpriseAverage:0,
//			enterpriseType:'其他',
//			enterpriseLength:0
//		}]
//		for (var i in data){
//			if(data[i].enterpriseData){
//				$.each(data[i].enterpriseData, function(x,y) {
//					$.each(list2, function(a,b) {
//						if(b.enterpriseType==y.enterpriseType){
//							b.enterpriseAverage+=Number(y.average);
//							b.enterpriseLength++;
//						}
//					});
//				})
//			}
//		}
//		$.each(list2, function(a,b) {
//			b.enterpriseAverage = b.enterpriseAverage/b.enterpriseLength;
//		});
//		console.log(list1,list2)
		/*
		 计算全体学员满意度
		 * */
		//平均满意度
		var allStudentList2={
			enterpriseAverage: 0,
			enterpriseType: "全体学员"
		}
		//总体满意度
		var allStudentList1={
			enterpriseAverage: 0,
			enterpriseType: "全体学员"
		} 
		//全体学员人数
		var allStudentUser={
			enterpriseCount: 0,
			enterpriseType: "全体学员"
		} 
		var allStudentData=[];
//		$.each(list1, function(k, v) {
//			allStudentList1.enterpriseAverage+=Number(v.enterpriseAverage)*Number(data.satisfaction.singleElectionUser[k].enterpriseCount);
//			v.enterpriseAverage = v.enterpriseAverage.toFixed(2);
//		});
		var list2Length=0;
//		$.each(list2, function(k, v) {
//			if(v.enterpriseAverage){
//				$.each(data.satisfaction.singleElectionUser, function(i,n) {
//					if(v.enterpriseType==n.enterpriseType){
//						allStudentList2.enterpriseAverage+=Number(v.enterpriseAverage)*Number(n.enterpriseCount);
//						list2Length++;
//					}
//				});
//			}
//			isNaN(v.enterpriseAverage)?'':v.enterpriseAverage = v.enterpriseAverage.toFixed(2);
//		});
//		$.each(data.satisfaction.singleElectionUser, function(k, v) {
//			allStudentUser.enterpriseCount+=Number(v.enterpriseCount);
//		});
//		if(list1.length>0){
//			allStudentList1.enterpriseAverage = (allStudentList1.enterpriseAverage/allStudentUser.enterpriseCount).toFixed(2);
//		}
//		if(list2Length>0){
//			allStudentList2.enterpriseAverage = (allStudentList2.enterpriseAverage/allStudentUser.enterpriseCount).toFixed(2);
//			var columnFractionLen=0,columnFraction=0;
//			$.each(data.radarChart.columnFraction, function(i,n) {
//				if(Math.ceil(n)!=0){
//					columnFraction+=Number(n);
//					columnFractionLen++;
//				}
//			});
//			allStudentList2.enterpriseAverage = (columnFraction/columnFractionLen).toFixed(2);
//		}
		//总体满意度
//		allStudentList1.enterpriseAverage?$('#wholeSatisfaction').html(allStudentList1.enterpriseAverage):$('#wholeSatisfaction').html(0);
//		list1.push(allStudentList1);
//		list2.push(allStudentList2);
//		data.satisfaction.singleElectionUser.push(allStudentUser);
		var chartsType1 = ['总体满意度','平均满意度'];
		var chartsData1 = list1;
		var resultData1 = [];
		var colorList1 = ['#847ccf', '#df94e0', '#b8b3e2','#f59700'];
		$('.drawing-8').siblings('.average').empty()
		$.each(data.satisfaction.averageSatisfaction, function(j, m) {
			if(m.enterpriseType!='其他'){
				$('.drawing-8').siblings('.average').append('<span class="userCount">' + m.enterpriseType + '平均满意度：<label class="userCount-label">' + m.enterpriseAverage + '</label>分</span>')
			}
		});
		$.each(chartsData1, function(k, v) {
			var enterpriseAverage ;
			$.each(list2, function(x, y) {
				if(v.enterpriseType==y.enterpriseType&&v.enterpriseType!='其他'){
					enterpriseAverage = y.enterpriseAverage.toFixed(2);
				}
			});
			var color = undefined;
			if(v.enterpriseType=='全体学员'){
				color = '#f59700';
				v.enterpriseAverage?$('#wholeSatisfaction').html(v.enterpriseAverage.toFixed(2)):$('#wholeSatisfaction').html('0.00');
			}
			if(v.enterpriseType!='其他'){
				resultData1.push({
					name: v.enterpriseType,
					type: 'bar',
					barMaxWidth: 40,
					itemStyle: {
						normal: {
							show: true,
							color: colorList1[k],
						}
					},
					label: {
						show: true,
						position: 'right',
						color: '#000'
					},
					barWidth: 17,
					barGap: "0%",
					barCategoryGap: "60px",
					itemStyle: {
						barBorderRadius: [0, 8, 8, 0]
					},
					color:color,
//					data: [v.enterpriseAverage,enterpriseAverage]
					data: [v.enterpriseAverage.toFixed(2),enterpriseAverage]
				});
			}
		});
		// 基于准备好的dom，初始化echarts实例
		var Height = $('.drawing-8').height();
		$('.drawing-8').replaceWith('<div class="drawing-8" style="width: 100%;height:'+Height+'px"></div>');
		var myChart1 = echarts.init($('.drawing-8').get(0));
		// 指定图表的配置项和数据
		option1 = {
			backgroundColor: '#ffffff',
			title: {
				text: quList.numberchina[$('.drawing-8').parents('.every-part').index()]+'、满意度 ',
				textStyle: {
					color: '#111111',
					fontSize: 18,
					fontWeight: 100
				},
				top: 10,
				left: 'left'
			},
			legend: {
				y: 'bottom',
				right: 40,
				itemWidth: 10,
				itemHeight: 10,
				textStyle: {
					fontSize: 14,
					color: '#555555',
				},
				formatter:function(v){
					var s = '';
					$.each(data.satisfaction.singleElectionUser, function(i,n) {
						if(n.enterpriseType==v){
							s= v + n.enterpriseCount+'名学员'
						}
					});
					return s
				}
			},
			grid: {
				left: '3%',
				right: '4%',
				top:'20%',
				bottom:'10%',
				containLabel: true
			},
			color: ['#847ccf', '#df94e0', '#b8b3e2','#f59700'],
			tooltip: {
				show: "true",
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			xAxis: {
				type: 'value',
				axisTick: {
					show: true
				},
				axisLine: {
					show: true,
					lineStyle: {
						color: '#000',
					}
				},
				splitLine: {
					show: true
				},
				max:100,
				axisLabel : {
				formatter :  function(value){
						return value.toFixed(0)
					}
				},
				interval:20
			},
			yAxis: [{
					type: 'category',
					axisTick: {
						show: false
					},
					inverse:true,
					axisLine: {
						show: true,
						lineStyle: {
							color: '#000000',
						}
					},
				  	axisLabel:{
						show:true,
						formatter : function(params){
				             return quList.formatter(params,10)
			            }
					},
					data: chartsType1

				}
			],
			series: resultData1
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart1.setOption(option1);
//		//平均满意度
//		var list2 = data.satisfaction.averageSatisfaction; //平均满意度
//		var enterpriseType2 = [];
//		$.each(list2, function(k, v) {
//			enterpriseType2.push(v.enterpriseType);
//		});
//		var chartsType2 = ['平均满意度'];
//		var resultData2 = [];
//		var colorList2 = ['#847ccf', '#df94e0', '#b8b3e2','#f59700'];
//		$.each(list2, function(k, v) {
//			resultData2.push({
//				name: v.enterpriseType,
//				type: 'bar',
//				barMaxWidth: 40,
//				itemStyle: {
//					normal: {
//						show: true,
//						color: colorList2[k],
//					}
//				},
//				label: {
//					show: true,
//					position: 'right',
//					color: '#000'
//				},
//				barWidth: 17,
//				barGap: "0%",
//				barCategoryGap: "60px",
//				itemStyle: {
//					barBorderRadius: [0, 8, 8, 0]
//				},
//				data: [v.enterpriseAverage]
//			});
//		});
//		// 基于准备好的dom，初始化echarts实例
//		var myChart2 = echarts.init($('.drawing-11').get(0));
//		// 指定图表的配置项和数据
//		option2 = {
//			backgroundColor: '#ffffff',
//			title: {
//
//			},
//			legend: {
//				y: 'bottom',
//				right: 40,
//				itemWidth: 10,
//				itemHeight: 10,
//				textStyle: {
//					fontSize: 14,
//					color: '#555555',
//				},
//			},
//			grid: {
//				left: '3%',
//				right: '4%',
//				containLabel: true
//			},
//			color: ['#847ccf', '#df94e0', '#b8b3e2','#f59700'],
//			tooltip: {
//				show: "true",
//				trigger: 'axis',
//				axisPointer: { // 坐标轴指示器，坐标轴触发有效
//					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
//				}
//			},
//			xAxis: {
//				type: 'value',
//				axisTick: {
//					show: true
//				},
//				axisLine: {
//					show: true,
//					lineStyle: {
//						color: '#000',
//					}
//				},
//				splitLine: {
//					show: true
//				},
//			},
//			yAxis: [{
//					type: 'category',
//					axisTick: {
//						show: false
//					},
//					axisLine: {
//						show: true,
//						lineStyle: {
//							color: '#000000',
//						}
//					},
//					 
//					data: chartsType2
//
//				},
//				{
//					type: 'category',
//					axisLine: {
//						show: false
//					},
//					axisTick: {
//						show: false
//					},
//					axisLabel: {
//						show: false
//					},
//					splitArea: {
//						show: false
//					},
//					splitLine: {
//						show: false
//					},
//					data: chartsType2
//				}
//
//			],
//			series: resultData2
//		};
//		// 使用刚指定的配置项和数据显示图表。
//		myChart2.setOption(option2);
	},
	/**
	 * 8、办学特色dom图
	 */
	demoTrain8: function(data) {

		var list1 = data.schoolCharacteristic.singleElection;
		var list2 = data.schoolCharacteristic.singleElectionXAxis; //y坐标
		if(list1.length==1){
			$('.drawing-9').parents('.every-part').remove();
			return false;
		}
		var enterpriseType = [];
		var allStudent={
			enterpriseAverage:[0],
			enterpriseType:'全体学员',
			enterpriseCount:0
		};
//		$.each(list1, function(k, m) {
//			allStudent.enterpriseAverage[0] += Number(m.enterpriseAverage[0])*Number(data.schoolCharacteristic.singleElectionUser[k].enterpriseCount);
//		});
//		list1.push(allStudent);
//		$.each(data.schoolCharacteristic.singleElectionUser, function(i,n) {
//						allStudent.enterpriseCount += Number(n.enterpriseCount)
//		});
//		if(list1.length>0){
//			allStudent.enterpriseAverage[0] = (allStudent.enterpriseAverage[0]/allStudent.enterpriseCount).toFixed(2);
//		}
//		data.schoolCharacteristic.singleElectionUser.push(allStudent);
		var resultData = [];
		var colorList = ['#847ccf', '#df94e0', '#b8b3e2','#f59700'];
		$('.drawing-9').siblings('.average').eq(0).empty();
		$.each(list1, function(k, v) {
			var color = undefined;
			if(v.enterpriseType=='全体学员'){
				color = '#f59700';
			}
			if(v.enterpriseType!='其他'){
				enterpriseType.push(v.enterpriseType)
				$('.drawing-9').siblings('.average').eq(0).append('<span class="userCount">' + v.enterpriseType + '平均满意度：<label class="userCount-label">' + Number(v.enterpriseAverage[0]).toFixed(2) + '</label>分</span>')
				resultData.push({
					name: v.enterpriseType,
					type: 'bar',
					barMaxWidth: 40,
					itemStyle: {
						normal: {
							show: true,
							color: colorList[k],
						}
					},
					label: {
						show: true,
						position: 'right',
						color: '#000'
					},
					barWidth: 17,
					barGap: "0%",
					barCategoryGap: "60px",
					itemStyle: {
						barBorderRadius: [0, 8, 8, 0]
					},
					color:color,
					data: v.enterpriseAverage.map(function(x){
								return Number(x).toFixed(2);
							})
				});
			}
		});
		// 基于准备好的dom，初始化echarts实例
		var Height = $('.drawing-9').height();
		$('.drawing-9').replaceWith('<div class="drawing-9" style="width: 100%;height:'+Height+'px"></div>');
		var myChart1 = echarts.init($('.drawing-9').get(0));
		// 指定图表的配置项和数据
		var option1 = {
			backgroundColor: '#ffffff',
			title: {
				text: quList.numberchina[$('.drawing-9').parents('.every-part').index()]+'、办学特色',
				textStyle: {
					color: '#111111',
					fontSize: 18,
					fontWeight: 100
				},
				left: 'left'
			},
			legend: {
				y: 'bottom',
				right: 40,
				itemWidth: 10,
				itemHeight: 10,
				textStyle: {
					fontSize: 14,
					color: '#555555',
				},
				data: enterpriseType,
				formatter:function(v){
					var s = '';
					$.each(data.schoolCharacteristic.singleElectionUser, function(i,n) {
						if(n.enterpriseType==v){
							s= v + n.enterpriseCount+'名学员'
						}
					});
					return s
				}
			},
			grid: {
				left: '3%',
				right: '4%',
				top:"20%",
				containLabel: true
			},
			color: ['#847ccf', '#df94e0', '#b8b3e2','#f59700'],
			tooltip: {
				show: "true",
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			xAxis: {
				type: 'value',
				axisTick: {
					show: true
				},
				axisLine: {
					show: true,
					lineStyle: {
						color: '#000',
					}
				},
				splitLine: {
					show: true
				},
				max:100,
				axisLabel : {
				formatter :  function(value){
						return value.toFixed(0)
					}
				},
				interval:20
			},
			yAxis: [{
					type: 'category',
					axisTick: {
						show: false
					},
					inverse:true,
					axisLine: {
						show: true,
						lineStyle: {
							color: '#000000',
						}
					},
					 axisLabel:{
						show:true,
						formatter : function(params){
				             return quList.formatter(params,10)
			            }
					},
					data: list2

				},
				{
					type: 'category',
					axisLine: {
						show: false
					},
					axisTick: {
						show: false
					},
					axisLabel: {
						show: false
					},
					splitArea: {
						show: false
					},
					splitLine: {
						show: false
					},
					data: list2
				}
			],
			series: resultData
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart1.setOption(option1);
		var Height = $('.drawing-10').height();
		$('.drawing-10').replaceWith('<div class="drawing-10" style="width: 100%;height:'+Height+'px"></div>');
		var myChart2 = echarts.init($('.drawing-10').get(0));
		var multiSelection = data.schoolCharacteristic.multiSelection;
		$('.drawing-10').siblings('.average').eq(1).empty();
		if(multiSelection.length==0){
			$('.drawing-10').hide()
		}
		$.each(multiSelection, function(k, v) {
			var nameList2 = [];
			var dataList2 = [];
			nameList2 = v.multiIName;
			dataList2 = v.multiPercentage;
			var option2 = {
				backgroundColor: '#ffffff',
				title: {
					text: '          ' + v.multiITitle + ': ',
					textStyle: {
						color: '#111111',
						fontSize: 18,
						fontWeight: 100
					}
				},
				legend: {
				y: 'bottom',
				right: 40,
				itemWidth: 10,
				itemHeight: 10,
				textStyle: {
					fontSize: 14,
					color: '#555555',
				},
				data: '全部'
			},
				tooltip: {
					trigger: 'axis',
					axisPointer: { // 坐标轴指示器，坐标轴触发有效
						type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
					},
					formatter : function(value){
				             return value[0].name+'：'+value[0].value+'%'
			            }
				},
				grid: {
					left: '3%',
					right: '4%',
					bottom: '3%',
					containLabel: true
				},
				color: ['#847ccf', '#df94e0', '#b8b3e2','#f59700'],
				xAxis: {
					type: 'value',
					lineStyle: {
						color: '#000000'
					},
					axisLabel:{
						show:true,
						formatter : function(params){
				             return params+'%'
			            }
					},
					max:100,
					axisLabel : {
					formatter :  function(value){
							return value.toFixed(0)
						}
					},
					interval:20
				},
				yAxis: {
					type: 'category',
					inverse:true,
					data: nameList2,
					 axisLabel:{
						show:true,
						formatter : function(params){
				             return quList.formatter(params,10)
			            }
					}
				},
				series: [{
					type: 'bar',
					label: {
						show: true,
						position: 'right',
						color: '#000',
						formatter : function(value){
				             return value.value+'%'
			            }
					},
					name:"全部",
					barWidth: 17,
					barGap: "0%",
					barCategoryGap: "60px",
					itemStyle: {
						barBorderRadius: [0, 8, 8, 0]
					},
					color:'#f59700',
					data: dataList2=$.map(dataList2,function(n,i){return Number(n).toFixed(2)})
				}]
			};
			// 使用刚指定的配置项和数据显示图表。
			myChart2.setOption(option2);
		});
	},
	formatter : function(params,num){
        var newParamsName = "";
        var paramsNameNumber = params.length;
        var provideNumber = num;
        var rowNumber = Math.ceil(paramsNameNumber / provideNumber);
        if (paramsNameNumber > provideNumber) {
            for (var p = 0; p < rowNumber; p++) {
                var tempStr = "";
                var start = p * provideNumber;
                var end = start + provideNumber;
                if (p == rowNumber - 1) {
                    tempStr = params.substring(start, paramsNameNumber);
                } else {
                    tempStr = params.substring(start, end) + "\n";
                        }
                        newParamsName += tempStr;
                    }
 
                }else if(paramsNameNumber < provideNumber) {
                	for(var j=0 ; j<provideNumber-paramsNameNumber;j++){
                		params = '   '+params
                	}
                	newParamsName = params
                }
                else {
                    newParamsName = params;
                }
                return newParamsName
    },
	detailsList: [],
	/**
	 * 评分详情
	 */
	getDetailsList: function() {
		var me = this;
		$('.class-tbody').empty();
		var projectCode = $yt_common.GetQueryString("projectCode");
		var traineeName = $('#keyword1').val();
		var classCacsi = quList.getChecks();
		var isEffective = '0';
		$('.page1').pageInfo({
			async: true,
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "class/questionnaire/getClassTraineeList", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				projectCode: projectCode,
				traineeName: traineeName,
//				classCacsi: classCacsi,
				classCacsi: '1',
				isEffective: isEffective
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			before: function() {
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				me.detailsList = data.data;
				if(data.flag == 0) {
					var htmlTbody = $('.class-tbody');
					htmlTbody.empty();
					var htmlTr = '';
					if(data.data.rows.length > 0) {
						$('.page1').show();
						var num = 1;
						$.each(data.data.rows, function(i, v) {
							var type = '';
							var classCacsi = '';
							if(v.classCacsi == 0) {
								classCacsi = '未评价';
								type = '--';
//								if(v.designImplementation=="0"){
//									v.designImplementation='--';
//								}
//								if(v.teachingEffect=="0"){
//									v.teachingEffect='--';
//								}
//								if(v.towsls=="0"){
//									v.towsls='--';
//								}
//								if(v.learningEffect=="0"){
//									v.learningEffect='--';
//								}
//								if(v.characteristic=="0"){
//									v.characteristic='--';
//								}
							}
							if(v.learningEffect == "0") {
								v.learningEffect = "--";
							}
							if(v.towsls == "0") {
								v.towsls = "--";
							}
							if(v.teachingActivites == "0") {
								v.teachingActivites = "--";
							}
							if(v.designImplementation == "0") {
								v.designImplementation = "--";
							}
							if(v.teachingEffect == "0") {
								v.teachingEffect = "--";
							}
							if(v.criticismSuggestion == "") {
									v.criticismSuggestion = "--";
							}
							if(v.characteristic=="0"){
									v.characteristic='--';
							}
							if(v.classCacsi == 1) {
								classCacsi = '已评价';
								type = '<a class="yt-link lookDetails" id=' + v.traineeId + '>查看</a>';
							}
							if(v.criticismSuggestion ==""||v.criticismSuggestion==null){
								v.criticismSuggestion ="--";
							}
							v.teacherRecommendation=JSON.parse(v.teacherRecommendation);
							if(v.teacherRecommendation.length!=0){
								$.each(v.teacherRecommendation, function(a,b) {
									if(b.teacherName==""){
										b.teacherName="--";
									}
									if(b.contactWay==""){
										b.contactWay="--";
									}
									if(b.classTitle==""){
										b.classTitle="--";
									}
									if(b.orgName==""){
										b.orgName="--";
									}
									if(b.understandTeacher==""){
										b.understandTeacher="--";
									}
									if(a==0){
										htmlTr='<tr>'+
												'<td rowspan="'+v.teacherRecommendation.length+'">' + num++ + '</td>' +
												'<input type="hidden" class="traid" value="' + v.traineeId + '">' +
												'<td rowspan="'+v.teacherRecommendation.length+'">' + v.traineeName + '</td>' +
												'<td rowspan="'+v.teacherRecommendation.length+'" class="text-overflow">' + v.designImplementation + '</td>' +
												'<td rowspan="'+v.teacherRecommendation.length+'" class="text-overflow">' + v.teachingEffect + '</td>' +
												'<td rowspan="'+v.teacherRecommendation.length+'" class="text-overflow">' + v.teachingActivites + '</td>' +
												'<td rowspan="'+v.teacherRecommendation.length+'">' + v.towsls + '</td>' +
												'<td rowspan="'+v.teacherRecommendation.length+'">' + v.learningEffect + '</td>' +
												'<td rowspan="'+v.teacherRecommendation.length+'">' + v.characteristic + '</td>' +
												'<td rowspan="'+v.teacherRecommendation.length+'">' + v.criticismSuggestion + '</td>' +
												'<td>'+b.teacherName+'</td>' +
												'<td>'+b.contactWay+'</td>'+
												'<td>'+b.classTitle+'</td>'+
												'<td>'+b.orgName+'</td>'+
												'<td>'+b.understandTeacher+'</td>'+
												'<td rowspan="'+v.teacherRecommendation.length+'">' + classCacsi + '</td>' +
												'<td rowspan="'+v.teacherRecommendation.length+'">' + type + '</td>' +
												'</tr>';
									}else{
										htmlTr+='<tr>'+
												'<td>'+b.teacherName+'</td>' +
												'<td>'+b.contactWay+'</td>'+
												'<td>'+b.classTitle+'</td>'+
												'<td>'+b.orgName+'</td>'+
												'<td>'+b.understandTeacher+'</td>'+
												'</tr>';
									}
								});
							}else{
								htmlTr = '<tr>' +
										'<td>' + num++ + '</td>' +
										'<input type="hidden" class="traid" value="' + v.traineeId + '">' +
										'<td>' + v.traineeName + '</td>' +
										'<td class="text-overflow">' + v.designImplementation + '</td>' +
										'<td class="text-overflow">' + v.teachingEffect + '</td>' +
										'<td class="text-overflow">' + v.teachingActivites + '</td>' +
										'<td>' + v.towsls + '</td>' +
										'<td>' + v.learningEffect + '</td>' +
										'<td>' + v.characteristic + '</td>' +
										'<td>' + v.criticismSuggestion + '</td>' +
										'<td>--</td>' +
										'<td>--</td>'+
										'<td>--</td>'+
										'<td>--</td>'+
										'<td>--</td>'+
										'<td>' + classCacsi + '</td>' +
										'<td>' + type + '</td>' +
										'</tr>';
							}
							htmlTbody.append(htmlTr);
						});
						//$('.details-box').show();
					} else {
						$('.page1').hide();
						//$('.list-page').hide();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="15" align="center" style="border:0px;">' +
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
		quList.lookDetails();
	},
	/**
	 * 详情评分的导出
	 */
	getDetailsExportList: function() {
		//点击导出
		$(".exportList").on("click", function() {
			/*if($("tr.yt-table-active").length == 0){
				$yt_alert_Model.prompt("请选择要操作的数据");
				return false;
			}*/
			var projectCode = $yt_common.GetQueryString("projectCode");
			var traineeName = $('#keyword1').val();
			var classCacsi = quList.getChecks();
			var isEffective = '1';
			var fileName="评分详情";
			var downUrl = $yt_option.base_path + "class/questionnaire/exportQuestionnaire";
			$.ajaxDownloadFile({
				url: downUrl,
				data: {
					projectCode: projectCode,
					traineeName: traineeName,
					classCacsi: '1',
//					classCacsi: classCacsi,
					fileName:fileName,
					isEffective: isEffective,
					selectionType:2,
					isDownload: true,
					istraineeName:1 //是否有名字1为质量模块
				}
			});
		});
	},
	getChecks: function() {
		var classCacsi = '';
		var checks = $('input[name=test]:checked');
		$.each(checks, function(k,n) {
			if(classCacsi == '') {
					classCacsi += checks[k].value;
				} else {
					classCacsi += ',' + checks[k].value;
				}
		});
		return classCacsi;
	},
	lookDetails: function(classCacsi) {
		var me = this;
		$('.details-box').off().on('click', '.lookDetails', function() {
			quList.showAlert5();
			var j = $(this).parent().parent().find('.traid').val();
			quList.getScoreDetail(j, success);
			$yt_baseElement.showLoading();
			function success(data) {
				$yt_baseElement.hideLoading();
				console.log(data.data);
				$('#details-form').empty();
				//初始化序号
				var num=1;
				$.each(data.data, function(i, n) {
//					if(i != 0 ) {
//						$('#details-form').append('<table style="margin-top: 5px"><tr><th><b>' + n.itemName + '</b></th></tr></table>');
//					} else {
//						$('#details-form').append('<table></table>')
//					}
					$('#details-form').append('<table style="margin-top: 5px"><tr><th><b style="font-weight: bolder;font-size: 16px;">' + n.itemName + '</b></th></tr></table>');
					$.each(n.itemsDetailsJson, function(x, y) {
						if(y.types!=6&&y.types!=5){
							$('#details-form table:nth-child(' + (i + 1) + ')').append('<tr id="title"><td colspan="2" style="padding:2px 10px">'+num+'、' + y.title + '</td></tr>');
						}
						//星级评分
						if(y.types == 1) {
							var lastNum=5-y.titleVakue;
							$('#details-form table:nth-child(' + (i + 1) + ')').append('<tr><td id="star" style="padding:2px 40px"></td></tr>')
							for(let q = 0; q < y.titleVakue; q++) {
								$('#details-form table:nth-child(' + (i + 1) + ') #star:eq('+x+')').append('<img src="../../resources/images/starImg/star-on.png"/>');
							}
							for (var a=0;a<lastNum;a++) {
								$('#details-form table:nth-child(' + (i + 1) + ') #star:eq('+x+')').append('<img src="../../resources/images/starImg/star-off.png"/>');
							}
						}
						if(y.types == 2){
							$.each(y.itemDetailsSpecific,function(c,s){
									$('#details-form table:nth-child(' + (i + 1) + ')').append('<tr><td style="padding:2px 40px">'+ s.specificValue +'</td></tr>')
							})
						}
						if(y.types == 3){
								$.each(y.itemDetailsSpecific, function(p,u) {
										$('#details-form table:nth-child(' + (i + 1) + ')').append('<tr><td style="padding:2px 40px">'+ u.specificValue +'</td></tr>')
								});
						}
						if(y.types == 5){
							if(y.itemCode=="rollHead"){
								$('#details-form table:nth-child(' + (i + 1) + ')').append('<tr id="title"><td colspan="2" style="padding:2px 10px">' + y.title + '</td></tr>');
								num=0;
							}else{
								$('#details-form table:nth-child(' + (i + 1) + ')').append('<tr id="title"><td colspan="2" style="padding:2px 10px">'+num+'、' + y.title + '</td></tr>');
							}
							$.each(y.itemDetailsSpecific, function(a,b) {
								$('#details-form table:nth-child(' + (i + 1) + ')').append('<tr><td colspan="2" style="padding:2px 40px">'+ b.specificValue +'</td></tr>')
							});
						}
						if(y.types == 6){
							$.each(y.teacherRecommend, function(c,s) {
								$('#details-form table:nth-child(' + (i + 1) + ')').append('<tr><td style="width: 200px;padding: 2px 0px 2px 10px;">'+ s.identificationName +'</td><td>'+ s.identificationValue +'</td></tr>')
							});
							num--
						}
						if(y.types == 4){
							$('#details-form table:nth-child(' + (i + 1) + ')').append('<tr><td colspan="2" style="padding:2px 40px">'+ y.titleVakue +'</td></tr>')
						}
						num++;
					});
				});
				//滚动条
				$yt_alert_Model.setFiexBoxHeight($(".details-alert .yt-edit-alert-main"));
			}
		});
	},originalList:[],
	/**
	 * 原始评分
	 */
	getOriginalList: function() {
		var me = this;
		$('.class-tbody2').empty();
		var projectCode = $yt_common.GetQueryString("projectCode");
		var traineeName2 = $('#keyword2').val();
		var classCacsi2 = quList.getChecks2();
		var isEffective2 = '1';
		//已经提交过
		if(me.criticismSuggestionStates==2){
			$('.invalid,.effective').attr('disabled','disabled').css('background-color','#b5b5b5');
		}
		$('.page2').pageInfo({
			async: true,
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "class/questionnaire/getClassTraineeList", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				projectCode: projectCode,
				traineeName: traineeName2,
				classCacsi: classCacsi2,
				isEffective: isEffective2
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			before: function() {
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				me.originalList = data.data;
				if(data.flag == 0) {
					var htmlTbody = $('.class-tbody2');
					var htmlTr = '';
					htmlTbody.empty();
					if(data.data.rows.length > 0) {
						$('.page2').show();
						var num = 1;
						$.each(data.data.rows, function(i, v) {
							var type = '';
							var classCacsi = '';
							if(v.classCacsi == 0) {
								classCacsi = '未评价';
								type = '--';
							}
							if(v.learningEffect == "0") {
								v.learningEffect = "--";
							}
							if(v.towsls == "0") {
								v.towsls = "--";
							}
							if(v.teachingActivites == "0") {
								v.teachingActivites = "--";
							}
							if(v.designImplementation == "0") {
								v.designImplementation = "--";
							}
							if(v.teachingEffect == "0") {
								v.teachingEffect = "--";
							}
							if(v.criticismSuggestion == "") {
									v.criticismSuggestion = "--";
							}
							if(v.characteristic=="0"){
									v.characteristic='--';
							}
							if(v.classCacsi == 1) {
								classCacsi = '已评价';
								type = '<a class="yt-link lookDetails" id=' + v.traineeId + '>查看</a>';
							}
							if(v.classCacsi == 2) {
								classCacsi = '<span style="color:red;">无效</span>';
								type = '<a class="yt-link lookNoDetails lookDetails" id=' + v.traineeId + '>查看</a>';
							}
							if(v.criticismSuggestion ==""||v.criticismSuggestion==null){
								v.criticismSuggestion ="--";
							}
							v.teacherRecommendation=JSON.parse(v.teacherRecommendation);
							if(v.teacherRecommendation.length!=0){
								$.each(v.teacherRecommendation, function(a,b) {
									if(b.teacherName==""){
										b.teacherName="--";
									}
									if(b.contactWay==""){
										b.contactWay="--";
									}
									if(b.classTitle==""){
										b.classTitle="--";
									}
									if(b.orgName==""){
										b.orgName="--";
									}
									if(b.understandTeacher==""){
										b.understandTeacher="--";
									}
									if(a==0){
										htmlTr = '<tr class="ex" exName="'+v.traineeId+'">' +
												'<td rowspan="'+v.teacherRecommendation.length+'">' + num++ + '</td>' +
												'<input type="hidden" class="traineeId" value="' + v.traineeId + '">' +
												'<td rowspan="'+v.teacherRecommendation.length+'">' + v.traineeName + '</td>' +
												'<td rowspan="'+v.teacherRecommendation.length+'" class="text-overflow">' + v.designImplementation + '</td>' +
												'<td rowspan="'+v.teacherRecommendation.length+'" class="text-overflow">' + v.teachingEffect + '</td>' +
												'<td rowspan="'+v.teacherRecommendation.length+'" class="text-overflow">' + v.teachingActivites + '</td>' +
												'<td rowspan="'+v.teacherRecommendation.length+'">' + v.towsls + '</td>' +
												'<td rowspan="'+v.teacherRecommendation.length+'">' + v.learningEffect + '</td>' +
												'<td rowspan="'+v.teacherRecommendation.length+'">' + v.characteristic + '</td>' +
												'<td rowspan="'+v.teacherRecommendation.length+'">' + v.criticismSuggestion + '</td>' +
												'<td>'+b.teacherName+'</td>' +
												'<td>'+b.contactWay+'</td>'+
												'<td>'+b.classTitle+'</td>'+
												'<td>'+b.orgName+'</td>'+
												'<td>'+b.understandTeacher+'</td>'+
												'<td rowspan="'+v.teacherRecommendation.length+'">' + classCacsi + '</td>' +
												'<td rowspan="'+v.teacherRecommendation.length+'">' + type + '</td>' +
												'</tr>';
									}else{
										htmlTr+='<tr class="ex" exName="'+v.traineeId+'">'+
												'<td>'+b.teacherName+'</td>' +
												'<td>'+b.contactWay+'</td>'+
												'<td>'+b.classTitle+'</td>'+
												'<td>'+b.orgName+'</td>'+
												'<td>'+b.understandTeacher+'</td>'+
												'</tr>';
									}
								});
							}else{
								htmlTr = '<tr class="ex" exName="'+v.traineeId+'">' +
									'<td>' + num++ + '</td>' +
									'<input type="hidden" class="traineeId" value="' + v.traineeId + '">' +
									'<td>' + v.traineeName + '</td>' +
									'<td class="text-overflow">' + v.designImplementation + '</td>' +
									'<td class="text-overflow">' + v.teachingEffect + '</td>' +
									'<td class="text-overflow">' + v.teachingActivites + '</td>' +
									'<td>' + v.towsls + '</td>' +
									'<td>' + v.learningEffect + '</td>' +
									'<td>' + v.characteristic + '</td>' +
									'<td>' + v.criticismSuggestion + '</td>' +
									'<td>--</td>' +
									'<td>--</td>' +
									'<td>--</td>' +
									'<td>--</td>' +
									'<td>--</td>' +
									'<td>' + classCacsi + '</td>' +
									'<td>' + type + '</td>' +
									'</tr>';
							}
							htmlTbody.append(htmlTr);
						});
						//$('.details-box').show();
					} else {
						$('.page2').hide();
						//$('.list-page').hide();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="15" align="center" style="border:0px;">' +
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
		quList.lookDetails2();
	},
	/**
	 * 原始评分导出
	 */
	getOriginalExportList: function() {
		//点击导出
		$(".originalExportList").on("click", function() {
			/*if($("tr.yt-table-active").length == 0){
				$yt_alert_Model.prompt("请选择要操作的数据");
				return false;
			}*/
			var projectCode = $yt_common.GetQueryString("projectCode");
			var traineeName = $('#keyword2').val();
			var classCacsi = quList.getChecks2();
			var isEffective = '0,1';
			var fileName="原始评分";
			var downUrl = $yt_option.base_path + "class/questionnaire/exportQuestionnaire";
			$.ajaxDownloadFile({
				url: downUrl,
				data: {
					projectCode: projectCode,
					traineeName: traineeName,
					classCacsi: classCacsi,
					fileName:fileName,
					isEffective: isEffective,
					selectionType:2,
					isDownload: true,
					istraineeName:1 //是否有名字1为质量模块
				}
			});
		});
	},
	//获得评分详情
	getScoreDetail: function(traineeIds, success) {
		var projectCode = $yt_common.GetQueryString("projectCode");
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/questionnaire/getTraineeQuestionnaire",
			async: true,
			data: {
				projectCode: projectCode,
				traineeId: traineeIds,
			},
			success: function(data) {
				success(data);
			}
		});
	},
	showAlert5: function() {
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$(".details-alert").show();
		/** 
		 * 调用算取div显示位置方法 
		 */
		/*
		 * 滚动条
		 * 
		 * */
		$yt_alert_Model.setFiexBoxHeight($(".details-alert .yt-edit-alert-main"));
		/* 
		 * 调用支持拖拽的方法 
		 */
		$yt_model_drag.modelDragEvent($(".yt-edit-alert .yt-edit-alert-title"));
		/** 
		 * 点击取消方法 
		 */
		$('.yt-edit-alert .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
			//隐藏页面中自定义的表单内容  
			$(".yt-edit-alert,#heard-nav-bak").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
	},
	/**
	 * 查询原始评分的多选框
	 */
	getChecks2: function() {
		var classCacsi = '';
		var checks = $('input[name=test2]:checked');
		$.each(checks, function(k,n) {
			if(classCacsi == '') {
					classCacsi += checks[k].value;
				} else {
					classCacsi += ',' + checks[k].value;
				}
		});
		return classCacsi;
	},
	/**
	 * 原始评分的详情
	 */
	lookDetails2: function(classCacsi) {
		var me = this;
		$('.original-box').off().on('click', '.lookDetails', function() {
			quList.showAlert5();
			var j = $(this).parent().parent().find('.traineeId').val();
			quList.getScoreDetail(j, success);
			$yt_baseElement.showLoading();
			function success(data) {
				$yt_baseElement.hideLoading();
				console.log(data.data);
				$('#details-form').empty();
				//初始化序号
				var num=1;
				$.each(data.data, function(i, n) {
//					if(i != 0 ) {
//						$('#details-form').append('<table style="margin-top: 5px"><tr><th><b>' + n.itemName + '</b></th></tr></table>');
//					} else {
//						$('#details-form').append('<table></table>')
//					}
					$('#details-form').append('<table style="margin-top: 5px"><tr><th><b style="font-weight: bolder;font-size: 16px;">' + n.itemName + '</b></th></tr></table>');
					$.each(n.itemsDetailsJson, function(x, y) {
						if(y.types!=6&&y.types!=5){
							$('#details-form table:nth-child(' + (i + 1) + ')').append('<tr id="title"><td colspan="2" style="padding:2px 10px">'+num+'、' + y.title + '</td></tr>');
						}
						//星级评分
						if(y.types == 1) {
							var lastNum=5-y.titleVakue;
							$('#details-form table:nth-child(' + (i + 1) + ')').append('<tr><td id="star" style="padding:2px 40px"></td></tr>')
							for(let q = 0; q < y.titleVakue; q++) {
								$('#details-form table:nth-child(' + (i + 1) + ') #star:eq('+x+')').append('<img src="../../resources/images/starImg/star-on.png"/>');
							}
							//未得分显示
							for (var a=0;a<lastNum;a++) {
								$('#details-form table:nth-child(' + (i + 1) + ') #star:eq('+x+')').append('<img src="../../resources/images/starImg/star-off.png"/>');
							}
						}
						if(y.types == 2){
							$.each(y.itemDetailsSpecific,function(c,s){
									$('#details-form table:nth-child(' + (i + 1) + ')').append('<tr><td style="padding:2px 40px">'+ s.specificValue +'</td></tr>')
							})
						}
						if(y.types == 3){
								$.each(y.itemDetailsSpecific, function(p,u) {
										$('#details-form table:nth-child(' + (i + 1) + ')').append('<tr><td style="padding:2px 40px">'+ u.specificValue +'</td></tr>')
								});
						}
						if(y.types == 5){
							if(y.itemCode=="rollHead"){
								$('#details-form table:nth-child(' + (i + 1) + ')').append('<tr id="title"><td colspan="2" style="padding:2px 10px">' + y.title + '</td></tr>');
								num=0;
							}else{
								$('#details-form table:nth-child(' + (i + 1) + ')').append('<tr id="title"><td colspan="2" style="padding:2px 10px">'+num+'、' + y.title + '</td></tr>');
							}
							$.each(y.itemDetailsSpecific, function(a,b) {
								$('#details-form table:nth-child(' + (i + 1) + ')').append('<tr><td colspan="2" style="padding:2px 40px">'+ b.specificValue +'</td></tr>')
							});
						}
						if(y.types == 6){
							$.each(y.teacherRecommend, function(c,s) {
								$('#details-form table:nth-child(' + (i + 1) + ')').append('<tr><td style="width: 200px;padding: 2px 0px 2px 10px;">'+ s.identificationName +'</td><td>'+ s.identificationValue +'</td></tr>')
							});
							num--;
						}
						if(y.types == 4){
							$('#details-form table:nth-child(' + (i + 1) + ')').append('<tr><td colspan="2" style="padding:2px 40px">'+ y.titleVakue +'</td></tr>')
						}
						num++;
					});
				});
				//滚动条
				$yt_alert_Model.setFiexBoxHeight($(".details-alert .yt-edit-alert-main"));
			}
		});
	},
	/**
	 * 原始评分的有效操作
	 */
	updateEffective: function(isEffective) {
		var bool = true;
//		if($("tr.yt-table-active").length == 0) {
//			$yt_alert_Model.prompt("请选择要操作的数据");
//			bool = false;
//		}
		var projectCode = $yt_common.GetQueryString("projectCode");
		var traineeId = $(".yt-table-active .traineeId").val();
		var downUrl = $yt_option.base_path + "class/questionnaire/updateEffective";
		if($("tr.yt-table-active").length!=0){
			$.ajax({
				url: downUrl,
				async:false,
				type:'post',
				data: {
					projectCode: projectCode,
					traineeId: traineeId,
					isEffective: isEffective
				},
				success:function(data){
					if(data.flag==0){
						$yt_alert_Model.prompt("标记成功");
					}else{
						$yt_alert_Model.prompt("标记失败");
					}
				}
			});
		}else{
			$yt_alert_Model.prompt("请选择要操作的数据");
			bool = false;
		}
		return bool;
	},
	/**
	 * 原始评分的页面刷新
	 */
	refreshEffective: function(isEffective) {
		$('.page2').pageInfo("refresh");
	},
	/**
	 * 获取意见建议、师资推荐
	 */
	criticismSugg:function(){
		var me = this;
		var projectCode=$yt_common.GetQueryString('projectCode');
		$yt_baseElement.showLoading();
		$.ajax({
			type:"post",
			url:$yt_option.base_path + "class/questionnaire/getProjectTeacherRecommend",
			async:false,
			data:{
				projectCode:projectCode
			},
			success:function(data){
				if(data.flag==0){
					var htmlTr='';
					//意见建议
					var criticismSuggestion=data.data.criticismSuggestion;
					if(criticismSuggestion!=""){
						$(".cri-and-sug textarea").val(criticismSuggestion);
					}else{
						$(".cri-and-sug textarea").val("");
					}
					//师资推荐
					var teacherRecommend=data.data.teacherRecommend;
					$(".teacher-recommend table tbody").empty();
					if(teacherRecommend.length!=0){
						$(".teacher-recommend table").attr('teaTr',1);
						$.each(teacherRecommend, function(i,n) {
							if(n.teacherName==undefined){
								n.teacherName='';
							}
							if(n.contactWay==undefined){
								n.contactWay='';
							}
							if(n.classTitle==undefined){
								n.classTitle='';
							}
							if(n.orgName==undefined){
								n.orgName='';
							}
							if(n.understandTeacher==undefined){
								n.understandTeacher='';
							}
							htmlTr='<tr>'+
									'<td style="text-align:center;"><span style="display:none">'+n.teacherName+'</span><input type="text" class="yt-input input-td tea-name" value="'+n.teacherName+'"/></td>'+
									'<td style="text-align:center;"><span style="display:none">'+n.contactWay+'</span><input type="text" class="yt-input input-td contact-way" value="'+n.contactWay+'"/></td>'+
									'<td style="text-align:center;"><span style="display:none">'+n.classTitle+'</span><input type="text" class="yt-input input-td cla-title" value="'+n.classTitle+'"/></td>'+
									'<td><span style="display:none">'+n.orgName+'</span><input type="text" class="yt-input input-td org-name" value="'+n.orgName+'"/></td>'+
									'<td><span style="display:none">'+n.understandTeacher+'</span><input type="text" class="yt-input input-td understand-teacher" value="'+n.understandTeacher+'"/></td>'+
									'<td class="ope-td" style="text-align:center">'+
									'<img class="del-icon" src="../../resources/images/icons/cost-level.png"/>'+
//									'<img class="repair-icon" style="margin-left: 5px;" src="../../resources/images/icons/amend.png"/>'+
									'</td>'+
									'</tr>';
							$(".teacher-recommend table tbody").append(htmlTr);
						});
					}else{
						$(".teacher-recommend table").attr('teaTr',0);
//						htmlTr='<tr class="add-tr">'+
//								'<td><input type="text" class="input-td yt-input tea-name"/><span class="span-td" style="display:none;"></span></td>'+
//								'<td><input type="text" class="input-td yt-input contact-way"/><span class="span-td" style="display:none;"></span></td>'+
//								'<td><input type="text" class="input-td yt-input cla-title"/><span class="span-td" style="display:none;"></span></td>'+
//								'<td><input type="text" class="input-td yt-input org-name"/><span class="span-td" style="display:none;"></span></td>'+
//								'<td><input type="text" class="input-td yt-input understand-teacher"/><span class="span-td" style="display:none;"></span></td>'+
//								'<td style="text-align:center">'+
//									'<img class="del-icon" src="../../resources/images/icons/cost-level.png"/>'+
////									'<img class="repair-icon" style="margin-left: 5px;" src="../../resources/images/icons/amend.png"/>'+
//								'</td>'+
//							'</tr>';
//							$(".teacher-recommend table tbody").append(htmlTr);
					}
					//输入框输入事件
					$(".teacher-recommend table tbody tr").find('input.input-td').off().on('input',function(){
						$(this).siblings('span').text($(this).val());
					});
					//判断是否提交过
					if(data.data.criticismSuggestionStates==2){
						me.criticismSuggestionStates=2;
						//表头操作列
						$(".teacher-recommend table th.teach-th").hide();
						//列表操作
						$(".teacher-recommend table tbody td.ope-td").hide();
						$(".teacher-recommend table tbody .add-tr").hide();
						$(".teacher-recommend table tbody td .input-td").hide().siblings('span').show();
						//新增列
						$(".teacher-recommend div.ope-tr").hide();
						//底部按钮
						$(".teacher-recommend div.bootom-btn").hide();
						$(".cri-and-sug textarea").attr('readonly','readonly');
						$(".cri-and-sug textarea").css('border','none');
					}
						$(".cri-and-sug textarea").autoHeight();
				}else{
					
				}
				$yt_baseElement.hideLoading();
			}
		});
	},
	criticismSuggestionStates:1,
	/**
	 * 判断内容（意见建议、师资推荐）
	 */
	addContentText:function(){
		quList.criticismSugg();
		var thisUser=$yt_common.GetQueryString('thisUrs');
		//师资推荐
		var teaTr=$(".teacher-recommend table").attr('teaTr');
		//意见建议
		var criSug=$(".cri-and-sug textarea").val();
		console.log('thisUser',thisUser);
		//判断权限是否为300
		if(thisUser!="300"){//权限不是300
			$('.yt-option-btn.original-info-btn').hide();
			$('.yt-option-btn.details-info-btn').hide();
			//判断师资推荐数据是否为空
			if(teaTr!=1){//师资没有数据
				$(".teacher-recommend").hide();
			}else{
				$(".teacher-recommend").show();
				//表头操作列
				$(".teacher-recommend table th.teach-th").hide();
				//列表操作
				$(".teacher-recommend table tbody td.ope-td").hide();
				//新增列
				$(".teacher-recommend div.ope-tr").hide();
				//底部按钮
				$(".teacher-recommend div.bootom-btn").hide();
			}
			//判断意见建议数据是否为空
			if(criSug==""){
				$(".cri-and-sug").hide();
			}else{
				$(".cri-and-sug").show();
				$(".cri-and-sug textarea").attr('readonly','readonly');
				$(".cri-and-sug textarea").css('border','none');
				$(".cri-and-sug textarea").autoHeight();
			}
		}
		//点击提交按钮
		$(".teacher-recommend .bootom-btn .updateTeacherRecommend").off('click').click(function(){
			 $yt_alert_Model.alertOne({  
		        leftBtnName: "确定", //左侧按钮名称,默认确定  
		        rightBtnName: "取消", //右侧按钮名称,默认取消  
		        cancelFunction: "", //取消按钮操作方法*/  
		        alertMsg: "数据提交后将无法修改，确认提交吗？", //提示信息  
		        confirmFunction: function() { //点击确定按钮执行方法  
		           quList.addTeacherRecommend(2);
		        },  
		    });  
		});
		//保存
		$(".teacher-recommend .bootom-btn .saveTeacherRecommend").off('click').click(function(){
	           quList.addTeacherRecommend(1);
		});
		//点击修改、删除图标
//		var we="";
//		var ae=0;
		$(".teacher-recommend table tbody").off().on('click','img.del-icon',function(e){
//			console.log('this',$(this).parents('tr').index(),'we',we);
//			if($(this)[0].className=='del-icon'){
				$(this).parents('tr').remove();
//			}else{
//				if(we==$(this).parents('tr').index()){//同一行中点击修改按钮
//					if(ae%2==0){
//						$(".teacher-recommend table tbody").find('span.span-td').show();
//						$(".teacher-recommend table tbody").find('input.input-td').hide();
//						$(this).parents('tr').find('span.span-td').hide();
//						$(this).parents('tr').find('input.input-td').show();
//						$(this).attr('src','../../resources/images/icons/gou.png');
//					}else{//点击对勾图标
//						var teaName=$(this).parents('tr').find('.tea-name').val();
//						if(teaName!=""){
//							$(this).parents('tr').find('span.span-td').show();
//							$(this).parents('tr').find('input.input-td').hide();
//							console.log(111);
//							$(this).attr('src','../../resources/images/icons/amend.png');
//						}
//						quList.addTeacherRecommend(1);
//					}
//					ae++;
//				}else{//不同行中点击修改按钮
//					ae=1;
//					$(".teacher-recommend table tbody").find('span.span-td').show();
//					$(".teacher-recommend table tbody").find('input.input-td').hide();
//					$(this).parents('tr').find('span.span-td').hide();
//					$(this).parents('tr').find('input.input-td').show();
//					$(this).attr('src','../../resources/images/icons/gou.png');
//					$(this).parents('tbody').find('tr').eq(we).find('img.repair-icon').attr('src','../../resources/images/icons/amend.png');
//				}
//				we=$(this).parents('tr').index();
//			}
//			//输入框输入事件
//			$(this).parents('tr').find('input.input-td').off().on('input',function(){
//				$(this).parents('td').find('span.span-td').text($(this).val());
//			});
		});
		
		//点击新增按钮
		$(".teacher-recommend div.ope-tr span.add-new-tr").off('click').click(function(){
			
			var htmlTr='<tr class="add-tr">'+
					'<td><input type="text" class="yt-input tea-name"/></td>'+
					'<td><input type="text" class="yt-input contact-way"/></td>'+
					'<td><input type="text" class="yt-input cla-title"/></td>'+
					'<td><input type="text" class="yt-input org-name"/></td>'+
					'<td><input type="text" class="yt-input understand-teacher"/></td>'+
					'<td style="text-align:center">'+
						'<img class="del-icon" src="../../resources/images/icons/cost-level.png"/>'+
//						'<img class="repair-icon" style="margin-left: 5px;" src="../../resources/images/icons/amend.png"/>'+
					'</td>'+
				'</tr>';
			$(".teacher-recommend table tbody").append(htmlTr);
		});
	},
	/**
	 * 新增意见建议、师资推荐
	 */
	addTeacherRecommend:function(criticismSuggestionStates){
		var teaName=true;
		var projectCode=$yt_common.GetQueryString('projectCode');
		var criticismSuggestion=$(".cri-and-sug textarea").val();
		var addTr=$(".teacher-recommend table tbody tr");
		console.log('addTr',addTr.length);
		var teacherRecommend=[];
		if(addTr.length!=0){
			$.each(addTr, function(i,v) {
				var teacherName=$(v).find('.tea-name').val();
				var contactWay=$(v).find('.contact-way').val();
				var classTitle=$(v).find('.cla-title').val();
				var orgName=$(v).find('.org-name').val();
				var understandTeacher=$(v).find('.understand-teacher').val();
				if(teacherName==""){
					teaName=false;
					$yt_alert_Model.prompt("请填写教师姓名");
					return false;
				}
				var teacherRe={
					teacherName:teacherName,
					contactWay:contactWay,
					classTitle:classTitle,
					orgName:orgName,
					understandTeacher:understandTeacher
				};
				teacherRecommend.push(teacherRe);
			});
			teacherRecommend=JSON.stringify(teacherRecommend);
		}else{
			teacherRecommend="";
		}
		console.log('teacherRecommend',teacherRecommend);
		if(teaName){
			$yt_baseElement.showLoading();
			$.ajax({
				type:"post",
				url:$yt_option.base_path + "class/questionnaire/addProjectTeacherRecommend",
				async:false,
				data:{
					projectCode:projectCode,
					criticismSuggestionStates:criticismSuggestionStates,
					criticismSuggestion:criticismSuggestion,
					teacherRecommend:teacherRecommend
				},
				success:function(data){
					if(data.flag==0){
						$yt_baseElement.hideLoading(function(){
							if(criticismSuggestionStates==1){
								$yt_alert_Model.prompt('保存成功');
							}else{
								$yt_alert_Model.prompt('提交成功');
							}
							
						});
						quList.criticismSugg();
					}else{
						$yt_baseElement.hideLoading(function(){
							if(criticismSuggestionStates==1){
								$yt_alert_Model.prompt('保存失败');
							}else{
								$yt_alert_Model.prompt('提交失败');
							}
						});
					}
				}
			});
		}
	}
	

};
$(function() {
	$yt_baseElement.showLoading();
	//初始化方法
	quList.init();
});