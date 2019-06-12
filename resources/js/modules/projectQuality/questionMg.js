/**
 * 满意度评分汇总（非选学）
 */
var quList = {
	//初始化方法
	init: function() {
		quList.getClassDetails();
		quList.demoSatisfaction();
		quList.getDetailsExportList(); //学员满意度评分导出
		quList.getOriginalExportList(); //原始评分导出
		quList.look();
		quList.addContentText();
		//设置列表样式
		$(".tab-title-list button").click(function() {
			$(this).addClass("active").siblings().removeClass("active");
			$(".details-box .original-box").hide().eq($(this).index()).show();
			//初始化原型评分和兴奋详情页模糊查询输入框
			$('#keyword1').val("");
			$('#keyword2').val("");
			if($(this).index() == 0) {
				$(".summary-box").show();
				$(".details-box").hide();
				$(".original-box").hide();
				quList.addContentText();
				quList.demoSatisfaction();
			} else if($(this).index() == 1) {
				$(".details-box").show();
				$(".summary-box").hide();
				$(".original-box").hide();

				$("input[type=checkbox][name='test']").setCheckBoxState("check");
				quList.getDetailsList(); //满意度评分列表
			} else if($(this).index() == 2) {
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
		//点击有效
		$(".effective").click(function() {
			quList.updateEffective($('.effective').val());
			if(quList.updateEffective($('.effective').val())) {
				quList.refreshEffective();
			}

		});
		//点击无效
		$(".invalid").click(function() {
			quList.updateEffective($('.invalid').val());
			if(quList.updateEffective($('.invalid').val())) {
				quList.refreshEffective();
			}
		});
		//评分详情查看original
		$('.score-info').on('click', '.lookDetails', function() {
			//调用原始评分查看
			quList.lookDetails();
		});
		//原始评分详情查看
		$('.original-score-info').on('click', '.lookDetails', function() {
			quList.originalLookDetails();
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
					}else if(data.data.projectType==4){
						data.data.projectType="中组部调训";
					}else{
						data.data.projectType="国资委调训";
					}
					$(".proje-details-div").setDatas(data.data);
				}else{
					
				}
			}
		});
	},
	/*
	 获取班级名称
	 * 
	 * */
	look:function(){
		var projectCode = $yt_common.GetQueryString("projectCode");
		$.ajax({
			type:"post",
			url:$yt_option.base_path + "class/questionnaire/lookForAll",
			async:true,
			data:{
				selectParam:projectCode,
				pageIndexs:1,
				pageNum:15
			},
			success:function(data){
				$('.project-name').text(data.data.rows[0].projectName);
				
			},
			error:function(data){
				console.log(data.status);
			}
		});
	},
	//平均满意度
	averageSatisfaction:0,
	/**
	 * 总体满意度dom图
	 */
	demoSatisfaction: function() {
		var xAxisList = new Array();
		var seriesList = new Array();
		var projectCode = $yt_common.GetQueryString("projectCode");
		var downUrl = $yt_option.base_path + "class/questionnaire/getChartByNoSelection";
		$.post(downUrl, {
			'projectCode': projectCode
		}, function(data) {
			if(data.flag == 0) {
				var averageSatisfaction = 0;
				var averageSatisfactionLength=0;
				//参评率
				if(data.data.evaluation)$('.rateDiv').setDatas(data.data.evaluation);
				if(data.data.radarChart.columnCode.length==0){
					data.data.radarChart.columnCode = ['培训设计与实施','授课效果','教学活动','教学组织、学风院风、后勤服务','培训学习效果'];
					data.data.radarChart.columnFraction = [0,0,0,0,0]
				}
				$('.every-part-1 .lab ul').empty();
				$.each(data.data.radarChart.columnCode, function(k, v) {
					xAxisList.push({
						name: v,
						max: 100
					});
					if(data.data.radarChart.columnFraction[k]!=''){
						averageSatisfaction += Number(data.data.radarChart.columnFraction[k]);
						averageSatisfactionLength++;
					}
					$('.every-part-1 .lab ul').append('<li>' + v + '：<span>' + Number(data.data.radarChart.columnFraction[k]).toFixed(2) + '</span></li>')
				});
				quList.averageSatisfaction = (averageSatisfaction/averageSatisfactionLength).toFixed(2);
				quList.averageSatisfaction=='NaN'?quList.averageSatisfaction=0:'';
				seriesList = data.data.radarChart.columnFraction;
				var wholeSatisfaction =data.data.satisfaction.wholeSatisfaction.wholeSatisfactionFraction[0]?Number(data.data.satisfaction.wholeSatisfaction.wholeSatisfactionFraction[0]).toFixed(2):0;
				// 基于准备好的dom，初始化echarts实例
				var myChart = echarts.init($('.drawing-1').get(0));
				// 指定图表的配置项和数据
				var option = {
					title: {
						text: '总体满意度:'+wholeSatisfaction,
						textStyle: {
							color: '#111111',
							fontSize: 18,
							fontWeight: 100
						},
						x: 'left',
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
						// areaStyle: {normal: {}},
						data: [{
							value: seriesList.map(function(x){
								return Number(x).toFixed(2);
							})
						}]
					}]
				};
				// 使用刚指定的配置项和数据显示图表。
				myChart.setOption(option);
				quList.demoTrain(data.data);
				quList.demoTrain2(data.data);
				quList.demoTrain3(data.data);
				quList.demoTrain4(data.data);
				quList.demoTrain5(data.data);
				quList.demoTrain6(data.data);
				quList.demoTrain7(data.data);
				window.onresize=function(){
					myChart.setOption(option);
					quList.demoTrain(data.data);
					quList.demoTrain2(data.data);
					quList.demoTrain3(data.data);
					quList.demoTrain4(data.data);
					quList.demoTrain5(data.data);
					quList.demoTrain6(data.data);
					quList.demoTrain7(data.data);
				}
				setTimeout($yt_baseElement.hideLoading(), 500);
			}
		});

	},
	numberchina:['一','二','三','四','五','六','七','八','九','十'],
	/**
	 * 1培训设计与实施dom图
	 */
	demoTrain: function(data) {
		var designScore = data.radarChart.columnFraction[0]; //培训设计与实施平均满意度
		var nameList = data.designImplementation.designImplementationName;
		var dataList = data.designImplementation.designImplementationFraction;
		var average = 0;
		if(dataList.length==0){
			$('.drawing-2').parents('.drawing').remove();
			return false;
		}
		$.each(dataList,function(i,n){
			average += Number(n);
			
		})
		if(average!=0){
			average = (Number(average)/Number(dataList.length)).toFixed(2);
		}
		var wid = $('.drawing-2').height();
		$('.drawing-2').replaceWith('<div  class="drawing-2" style="height:'+wid+'px"></div>');
		$('.drawing-2').siblings('.average').empty().append('<span class="userCount">平均满意度：<label class="userCount-label">' + average + '</label>分</span>')
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init($('.drawing-2').get(0));
		// 指定图表的配置项和数据
		var option = {
			color: ['#2F4F4F'],
			title: {
				text: quList.numberchina[$('.drawing-2').parents('.drawing').index()]+'、学员对培训设计与实施的满意度评分',
				textStyle: {
					color: '#111111',
					fontSize: 18,
					fontWeight: 100
				},
				top: 10,
			},
			legend: {
				orient: 'vertical',
				y: 'bottom',
				right: 40,
				itemWidth: 10,
				itemHeight: 10,
				textStyle: {
					fontSize: 14,
					color: '#555555',
				},
				data: nameList,
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			grid: {
				left: '3%',
				right: '5%',
				containLabel: true
			},
			color: ['#847ccf', '#b8b3e2', '#df94e0', '#f59700'],
			xAxis: {
				type: 'value',
				lineStyle: {
					color: '#000000',
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
				data: nameList,
				inverse:true,
				axisLabel:{
						show:true,
						formatter : function(params){
				             return quList.formatter(params,10)
			            }
					}
			},
			series: [{
				type: 'bar',
				stack: '总量',
				barMaxWidth: 40, //最大宽度,
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
				data: dataList.map(function(x){
					return Number(x).toFixed(2)
				})
			}]
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	},

	/**
	 * 2教师授课效果dom图
	 */
	demoTrain2: function(data) {
		var designScore = data.radarChart.columnFraction[1]; //平均满意度
		var nameList = data.teachingEffect.teacherName;
		var dataList = data.teachingEffect.teacherFraction;
		var average = 0;
		if(dataList.length==0){
			$('.drawing-3').parents('.drawing').remove();
		}else{
		$.each(dataList,function(i,n){
			average += Number(n)
			
		})
		if(average!=0){
			average = (Number(average)/Number(dataList.length)).toFixed(2);
		}
		$('.drawing-3').siblings('.average').empty().append('<span class="userCount">平均满意度：<label class="userCount-label">' + average + '</label>分</span>')
		// 基于准备好的dom，初始化echarts实例

		if(nameList.length>7){
			$('.drawing-3').replaceWith('<div  class="drawing-3" style="width: 100%;"></div>');
			$('.drawing-3').css('height',400 + ((nameList.length-7)*40)+'px');
		}else{
			$('.drawing-3').replaceWith('<div  class="drawing-3" style="width: 100%;"></div>');
			$('.drawing-3').css('height','400px');
		}
		var myChart = echarts.init($('.drawing-3').get(0));
		// 指定图表的配置项和数据
		var option = {
			color: ['#2F4F4F'],
			title: {
				text: quList.numberchina[$('.drawing-3').parents('.drawing').index()]+'、学员对教师授课效果的满意度评分',
				textStyle: {
					color: '#111111',
					fontSize: 18,
					fontWeight: 100
				},
				top: 10,
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
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
				data: data.teachingEffect.teacherName,
			},
			grid: {
				left: '3%',
				right: '5%',
				containLabel: true
			},
			color: ['#847ccf', '#b8b3e2', '#df94e0', '#f59700'],
			xAxis: {
				type: 'value',
				lineStyle: {
					color: '#000000',
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
				data: nameList,
				inverse:true,
 				axisLabel:{
						show:true,
						formatter : function(params){
				             return quList.formatter(params,10)
			            }
					}
			},
			series: [{
				type: 'bar',
				stack: '总量',
				barMaxWidth: 40, //最大宽度,
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
				data: dataList.map(function(x){
					return Number(x).toFixed(2)
				})
			}]
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
		}
		
	},
	/**
	 * 3教学活动dom图
	 */
	demoTrain3: function(data) {
		var designScore = data.radarChart.columnFraction[2]; //平均满意度
		var nameList = data.teachingActivites.courseName;
		var dataList = data.teachingActivites.courseFraction;
		if(dataList.length==0){
			$('.drawing-4').parents('.drawing').remove();
		}else{
			var average = 0;
		$.each(dataList,function(i,n){
			average += Number(n)
			
		})
		if(average!=0){
			average = (Number(average)/Number(dataList.length)).toFixed(2);
		}
		$('.drawing-4').siblings('.average').empty().append('<span class="userCount">平均满意度：<label class="userCount-label">' + average + '</label>分</span>')
		// 基于准备好的dom，初始化echarts实例
		if(nameList.length>4){
			$('.drawing-4').replaceWith('<div  class="drawing-4" style="width: 100%;"></div>');
			$('.drawing-4').css('height',400 + ((nameList.length-4)*100)+'px');
		}else{
			$('.drawing-4').replaceWith('<div  class="drawing-4" style="width: 100%;"></div>');
			$('.drawing-4').css('height','400px');
		}
		var myChart = echarts.init($('.drawing-4').get(0));
		// 指定图表的配置项和数据
		var option = {
			color: ['#2F4F4F'],
			title: {
				text: quList.numberchina[$('.drawing-4').parents('.drawing').index()]+'、学员对教学活动的满意度评分',
				textStyle: {
					color: '#111111',
					fontSize: 18,
					fontWeight: 100
				},
				top: 10,
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			legend: {
				orient: 'vertical',
				y: 'bottom',
				right: 40,
				itemWidth: 10,
				itemHeight: 10,
				textStyle: {
					fontSize: 14,
					color: '#555555',
				},
				data: nameList,
			},
			grid: {
				left: '3%',
				right: '5%',
				containLabel: true
			},
			color: ['#847ccf', '#b8b3e2', '#df94e0', '#f59700'],
			xAxis: {
				type: 'value',
				lineStyle: {
					color: '#000000',
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
				data: nameList,
				inverse:true,
 				axisLabel:{
						show:true,
						formatter : function(params){
				             return quList.formatter(params,10)
			            }
					}
			},
			series: [{
				type: 'bar',
				barMaxWidth: 40, //最大宽度,
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
				data: dataList.map(function(x){
					return Number(x).toFixed(2)
				})
			}]
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
		}
	},
	/**
	 * 4教学组织、学院院风、后勤服务dom图
	 */
	demoTrain4: function(data) {
		var designScore = data.radarChart.columnFraction[3]; //平均满意度
		var nameList = data.towsls.towslsName;
		var dataList = data.towsls.towslsFraction;
		if(dataList.length==0){
			$('.drawing-5').parents('.drawing').remove();
			return false;
		}
		var average = 0;
		$.each(dataList,function(i,n){
			average += Number(n)
			
		})
		if(average!=0){
			average = (Number(average)/Number(dataList.length)).toFixed(2);
		}
		var wid = $('.drawing-5').height();
		$('.drawing-5').replaceWith('<div  class="drawing-5" style="height:'+wid+'px"></div>');
		$('.drawing-5').siblings('.average').empty().append('<span class="userCount">平均满意度：<label class="userCount-label">' + average + '</label>分</span>')
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init($('.drawing-5').get(0));
		// 指定图表的配置项和数据
		var option = {
			color: ['#2F4F4F'],
			title: {
				text: quList.numberchina[$('.drawing-5').parents('.drawing').index()]+'、学员对教学组织、学院院风、后勤服务的满意度评分',
				textStyle: {
					color: '#111111',
					fontSize: 18,
					fontWeight: 100
				},
				top: 10,
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			grid: {
				left: '3%',
				right: '5%',
				bottom: '3%',
				containLabel: true
			},
			color: ['#847ccf', '#b8b3e2', '#df94e0', '#f59700'],
			xAxis: {
				type: 'value',
				lineStyle: {
					color: '#000000',
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
				data: nameList,
				inverse:true,
 				axisLabel:{
						show:true,
						formatter : function(params){
				             return quList.formatter(params,10)
			            }
					}
			},
			series: [{
				type: 'bar',
				barMaxWidth: 40, //最大宽度,
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
				data: dataList.map(function(x){
					return Number(x).toFixed(2)
				})
			}]
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	},
	/**
	 * 5学员对培训学习效果的dom图
	 */
	demoTrain5: function(data) {
		var designScore = data.radarChart.columnFraction[4]; //平均满意度
		var nameList = data.learningeffect.learningeffectName;
		var dataList = data.learningeffect.learningeffectFraction;
		if(dataList.length==0){
			$('.drawing-6').parents('.drawing').remove();
			return false;
		}
		var average = 0;
		$.each(dataList,function(i,n){
			average += Number(n)
			
		})
		if(average!=0){
			average = (Number(average)/Number(dataList.length)).toFixed(2);
		}
		var wid = $('.drawing-6').height();
		$('.drawing-6').replaceWith('<div  class="drawing-6" style="height:'+wid+'px"></div>');
		$('.drawing-6').siblings('.average').empty().append('<span class="userCount">平均满意度：<label class="userCount-label">' + average + '</label>分</span>')
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init($('.drawing-6').get(0));
		// 指定图表的配置项和数据
		var option = {
			color: ['#2F4F4F'],
			title: {
				text: quList.numberchina[$('.drawing-6').parents('.drawing').index()]+'、学员对培训学习效果的满意度评分',
				textStyle: {
					color: '#111111',
					fontSize: 18,
					fontWeight: 100
				},
				top: 10,
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			grid: {
				left: '3%',
				right: '5%',
				bottom: '3%',
				containLabel: true
			},
			color: ['#847ccf', '#b8b3e2', '#df94e0', '#f59700'],
			xAxis: {
				type: 'value',
				lineStyle: {
					color: '#000000',
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
				data: nameList,
				inverse:true,
 				axisLabel:{
						show:true,
						formatter : function(params){
				             return quList.formatter(params,10)
			            }
					}
			},
			series: [{
				type: 'bar',
				barMaxWidth: 40, //最大宽度,
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
				data: dataList.map(function(x){
					return Number(x).toFixed(2)
				})
			}]
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	},
	/**
	 * 6满意度dom图
	 */
	demoTrain6: function(data) {
		var dataList2 = [];
		var nameList = data.satisfaction.wholeSatisfaction.wholeSatisfactionName;
		var dataList = data.satisfaction.wholeSatisfaction.wholeSatisfactionFraction;
		if(dataList.length==0){
			$('.drawing-7').parents('.drawing').remove();
			return false;
		}
		var nameList2 = [data.satisfaction.wholeSatisfaction.wholeSatisfactionName,'本期培训班平均满意度'];
//		var num1 = data.radarChart.columnFraction[0];
//		var num2 = data.radarChart.columnFraction[1];
//		var num3 = data.radarChart.columnFraction[2];
//		var num4 = data.radarChart.columnFraction[3];
//		var num5 = data.radarChart.columnFraction[4];
//
//		var resultNum = (Number(num1) + Number(num2) + Number(num3) + Number(num4) + Number(num5)) / 5;
//		if(resultNum != 0) {
//			resultNum = resultNum.toFixed(2);
//		}
		data.satisfaction.wholeSatisfaction.wholeSatisfactionFraction.push(quList.averageSatisfaction)
//		dataList2.push(resultNum);
		dataList2 = data.satisfaction.wholeSatisfaction.wholeSatisfactionFraction
		dataList2 = dataList2.map(function(x){
			return Number(x).toFixed(2)
		})
		var wid = $('.drawing-7').height();
		$('.drawing-7').replaceWith('<div  class="drawing-7" style="height:'+wid+'px"></div>');
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init($('.drawing-7').get(0));
		// 指定图表的配置项和数据

		var waterMarkText = '';

		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		canvas.width = canvas.height = 100;
		ctx.textAlign = 'center';
		ctx.textBaseline = 'middle';
		ctx.globalAlpha = 0.08;
		ctx.font = '20px Microsoft Yahei';
		ctx.translate(50, 50);
		ctx.rotate(-Math.PI / 4);
		ctx.fillText(waterMarkText, 0, 0);

		option = {
			color: ['#2F4F4F'],
			backgroundColor: {
				type: 'pattern',
				image: canvas,
				repeat: 'repeat',
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			title: {
				text: quList.numberchina[$('.drawing-7').parents('.drawing').index()]+'、满意度',
				textStyle: {
					color: '#111111',
					fontSize: 18,
					fontWeight: 100
				},
				top: 10,
			},
			grid: {
				top: 50,
				bottom: '5%	',
				left: '3%',
				right:'5%',
				containLabel: true
			},
			color: ['#847ccf', '#b8b3e2', '#df94e0', '#f59700'],
			xAxis: {
				type: 'value',
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
			yAxis: {
				type: 'category',
				inverse:true,
				data: nameList2,
				splitLine: {
					show: false
				},
 				axisLabel:{
						show:true,
						formatter : function(params){
				             return quList.formatter(params,10)
			            }
					}
			},
			series: {
				type: 'bar',
				barMaxWidth: 40, //最大宽度
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
				data: dataList2
			},
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	},
	/**
	 * 7办学特色dom图
	 */
	demoTrain7: function(data) {
		var nameList = data.schoolCharacteristic.singleElection.singleName;
		var dataList = data.schoolCharacteristic.singleElection.singleFraction;
		if(dataList.length==0){
			$('.drawing-8').parents('.drawing').remove();
			return false;
		}
		dataList = dataList.map(function(x){
			return Number(x).toFixed(2)
		})
		var wid = $('.drawing-8').height();
		$('.drawing-8').replaceWith('<div  class="drawing-8" style="height:'+wid+'px"></div>');
		// 基于准备好的dom，初始化echarts实例
		var myChart = echarts.init($('.drawing-8').get(0));
		// 指定图表的配置项和数据
		var option1 = {
			color: ['#2F4F4F'],
			title: {
				text: quList.numberchina[$('.drawing-8').parents('.drawing').index()]+'、办学特色',
				textStyle: {
					color: '#111111',
					fontSize: 18,
					fontWeight: 100
				},
				top: 10,
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			grid: {
				left: '3%',
				right: '5%',
				bottom: '3%',
				containLabel: true
			},
			color: ['#847ccf', '#b8b3e2', '#df94e0', '#f59700'],
			xAxis: {
				type: 'value',
				lineStyle: {
					color: '#000000',
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
				data: nameList,
				inverse:true,
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
					color: '#000'
				},
				barWidth: 17,
				barGap: "0%",
				barCategoryGap: "60px",
				itemStyle: {
					barBorderRadius: [0, 8, 8, 0]
				},
				data: dataList
			}]
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option1);
		$.each(data.schoolCharacteristic.multiSelection, function(k, v) {
			var nameList2 = [];
			var dataList2 = [];
			var titleList2 = v.multiITitle;

			nameList2 = v.multiIName;
			dataList2 = v.multiPercentage;
			var option2 = {
				color: ['#2F4F4F'],
				title: {
					text: '          ' + titleList2 + ": ",
					textStyle: {
						color: '#111111',
						fontSize: 18,
						fontWeight: 100
					}
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
					right: '5%',
					bottom: '3%',
					containLabel: true
				},
				color: ['#847ccf', '#b8b3e2', '#df94e0', '#f59700'],
				xAxis: {
					type: 'value',
					lineStyle: {
						color: '#000000'
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
					data: nameList2,
					inverse:true,
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
					barWidth: 17,
					barGap: "0%",
					barCategoryGap: "60px",
					itemStyle: {
						barBorderRadius: [0, 8, 8, 0]
					},
					data: dataList2.map(function(x){
					return Number(x).toFixed(2)
				})
				}]
			};
			// 使用刚指定的配置项和数据显示图表。
			if(dataList2.length>4){
				$('.drawing-9').replaceWith('<div  class="drawing-9" style="width: 100%;"></div>');
				$('.drawing-9').css('height',400 + ((dataList2.length-4)*100)+'px');
			}else{
				$('.drawing-9').replaceWith('<div  class="drawing-9" style="width: 100%;"></div>');
				$('.drawing-9').css('height','400px');
			}
			myChart = echarts.init($('.drawing-9').get(0));
			myChart.setOption(option2);
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
					var htmlTr = '';
					htmlTbody.empty();
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
//					if(i != 0) {
//						$('#details-form').append('<table style="margin-top: 5px"><tr><th><b>' + n.itemName + '</b></th></tr></table>')
//					} else {
//						$('#details-form').append('<table></table>')
//					}
					$('#details-form').append('<table style="margin-top: 5px"><tr><th><b style="font-weight: bolder;font-size: 16px;">' + n.itemName + '</b></th></tr></table>');
					$.each(n.itemsDetailsJson, function(x, y) {
						if(y.types!=6&&y.types!=5){
							$('#details-form table:nth-child(' + (i + 1) + ')').append('<tr id="title"><td colspan="2" style="padding:2px 10px">'+num+'、' + y.title + '</td></tr>')
						}
						//星级评分
						if(y.types == 1) {
							var lastNum=5-y.titleVakue;
							$('#details-form table:nth-child(' + (i + 1) + ')').append('<tr><td id="star" style="padding:2px 40px"></td></tr>')
							for(let q = 0; q < y.titleVakue; q++) {
								$('#details-form table:nth-child(' + (i + 1) + ') #star:eq(' + x + ')').append('<img src="../../resources/images/starImg/star-on.png"/>');
							}
							//未得分显示
							for (var a=0;a<lastNum;a++) {
								$('#details-form table:nth-child(' + (i + 1) + ') #star:eq(' + x + ')').append('<img src="../../resources/images/starImg/star-off.png"/>');
							}
						}
						if(y.types == 2) {
							$.each(y.itemDetailsSpecific, function(c, s) {
									$('#details-form table:nth-child(' + (i + 1) + ')').append('<tr><td style="padding:2px 40px">' + s.specificValue + '</td></tr>')
							})
						}
						if(y.types == 3) {
								$.each(y.itemDetailsSpecific, function(p, u) {
									$('#details-form table:nth-child(' + (i + 1) + ')').append('<tr><td colspan="2" style="padding:2px 40px">' + u.specificValue + '</td></tr>')
								});
						}
						if(y.types == 5) {
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
						if(y.types == 6) {
							$.each(y.teacherRecommend, function(c, s) {
								$('#details-form table:nth-child(' + (i + 1) + ')').append('<tr><td style="width: 200px;padding: 2px 0px 2px 10px;">' + s.identificationName + '</td><td>' + s.identificationValue + '</td></tr>')
							});
							num--;
						}
						if(y.types == 4) {
							$('#details-form table:nth-child(' + (i + 1) + ')').append('<tr><td colspan="2" style="padding:2px 40px">' + y.titleVakue + '</td></tr>')
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
//
//		$yt_alert_Model.getDivPosition($(".details-alert"));
		/*
		 * 滚动条
		 * 
		 * */
		$yt_alert_Model.setFiexBoxHeight($(".yt-edit-alert-main"));
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
	//原始评分详情查看
	originalLookDetails: function(classCacsi) {

	},
	originalList: [],
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
//					if(i != 0) {
//						$('#details-form').append('<table style="margin-top: 5px"><tr><th><b>' + n.itemName + '</b></th></tr></table>')
//					} else {
//						$('#details-form').append('<table></table>')
//					}
					$('#details-form').append('<table style="margin-top: 5px"><tr><th><b style="font-weight: bolder;font-size: 16px;">' + n.itemName + '</b></th></tr></table>')
					$.each(n.itemsDetailsJson, function(x, y) {
						console.log('num'+num);
						if(y.types!=6&&y.types!=5){
							$('#details-form table:nth-child(' + (i + 1) + ')').append('<tr id="title"><td colspan="2" style="padding:2px 10px">'+num+'、' + y.title + '</td></tr>')
						}
						//星级评分
						if(y.types == 1) {
							var lastNum=5-y.titleVakue;
							$('#details-form table:nth-child(' + (i + 1) + ')').append('<tr><td id="star" style="padding:2px 40px"></td></tr>')
							for(let q = 0; q < y.titleVakue; q++) {
								$('#details-form table:nth-child(' + (i + 1) + ') #star:eq(' + x + ')').append('<img src="../../resources/images/starImg/star-on.png"/>');
							}
							for (var a=0;a<lastNum;a++) {
								$('#details-form table:nth-child(' + (i + 1) + ') #star:eq(' + x + ')').append('<img src="../../resources/images/starImg/star-off.png"/>');
							}
						}
						if(y.types == 2) {
							$.each(y.itemDetailsSpecific, function(c, s) {
									$('#details-form table:nth-child(' + (i + 1) + ')').append('<tr><td style="padding:2px 40px">' + s.specificValue + '</td></tr>')
							});
						}
						if(y.types == 3) {
								$.each(y.itemDetailsSpecific, function(p, u) {
										$('#details-form table:nth-child(' + (i + 1) + ')').append('<tr><td colspan="2" style="padding:2px 40px">' + u.specificValue + '</td></tr>')
								});
						}
						if(y.types == 5) {
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
						if(y.types == 6) {
							$.each(y.teacherRecommend, function(c, s) {
								$('#details-form table:nth-child(' + (i + 1) + ')').append('<tr><td style="width: 200px;padding: 2px 0px 2px 10px;">' + s.identificationName + '</td><td>' + s.identificationValue + '</td></tr>')
							});
							num--;
						}
						if(y.types == 4) {
							$('#details-form table:nth-child(' + (i + 1) + ')').append('<tr><td colspan="2" style="padding:2px 40px">' + y.titleVakue + '</td></tr>')
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
		var projectCode = $yt_common.GetQueryString("projectCode");
		var traineeId = $(".yt-table-active .traineeId").val();
		var downUrl = $yt_option.base_path + "class/questionnaire/updateEffective";
		if($("tr.yt-table-active").length != 0) {
			$.ajax({
				url: downUrl,
				async:false,
				type:'post',
				data: {
					projectCode: projectCode,
					traineeId: traineeId,
					isEffective: isEffective,
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
	refreshEffective: function() {
		$('.page2').pageInfo("refresh");
	},
	/**
	 * 获取意见建议、师资推荐
	 */
	criticismSugg:function(){
		var me = this;
		var projectCode=$yt_common.GetQueryString('projectCode');
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
						me.criticismSuggestionStates = 2;
						//表头操作列
						$(".teacher-recommend table th.teach-th").hide();
						//列表操作
						$(".teacher-recommend table tbody td.ope-td").hide();
						$(".teacher-recommend table tbody td .input-td").hide().siblings('span').show();
						//新增列
						$(".teacher-recommend div.ope-tr").hide();
						$(".teacher-recommend table tbody .add-tr").hide();
						//底部按钮
						$(".teacher-recommend div.bootom-btn").hide();
						$(".cri-and-sug textarea").attr('readonly','readonly');
						$(".cri-and-sug textarea").css('border','none');
					}
						$(".cri-and-sug textarea").autoHeight();
				}else{
					
				}
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
			$('.yt-option-btn.details-info-btn').hide();
			$('.yt-option-btn.original-info-btn').hide();
			//判断师资推荐数据是否为空
			if(teaTr!="1"){//师资没有数据
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
//		$(".teacher-recommend table tbody").off().on('click','img.repair-icon,img.del-icon',function(e){
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
//							console.log('教师姓名：',teaName);
//							$(this).parents('tr').find('span.span-td').show();
//							$(this).parents('tr').find('input.input-td').hide();
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
			//输入框输入事件
//			$(this).parents('tr').find('input.input-td').off().on('input',function(){
//				$(this).parents('td').find('span.span-td').text($(this).val());
//			});
		});
		//点击新增按钮
		$(".teacher-recommend div.ope-tr.add-new-tr").click(function(){
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
		var addTr=$(".teacher-recommend table tbody tr[class!='ope-tr']");
		console.log('addTr',addTr);
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
		if(teaName){
			$.ajax({
				type:"post",
				url:$yt_option.base_path + "class/questionnaire/addProjectTeacherRecommend",
				async:true,
				beforeSend:function(){
				  $yt_baseElement.showLoading();
				},
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