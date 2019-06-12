/**
 * 办班动态相关数据
 */
var caList = {
	//初始化方法
	init: function() {
		var year = new Date().getFullYear();
		$("#start-time").val(year + '-01-01');
		$("#start-time").calendar({
			controlId: "startDate",
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $("#end-time"), //开始日期最大为结束日期  
			callback: function() { // 点击选择日期后的回调函数  
				caList.getPlanListInfo();
				$("#start-time").val().split('-')[0]!=$("#end-time").val().split('-')[0]?$("#end-time").val($("#start-time").val().split('-')[0]+'-12-31'):$("#end-time").val($("#end-time").val())
				time = $("#start-time").val().split('-')[0]+'-12-31'
				//不能跨一年搜索
				$("#end-time").calendar({
						controlId: "endDate",
						nowData: true, //默认选中当前时间,默认true  getClassDynamic
						lowerLimit: $("#start-time"), //结束日期最小为开始日期  
						upperLimit:time,
						callback: function() { // 点击选择日期后的回调函数  
							caList.getPlanListInfo();
						}
					});
			}
		});
//		var time  = $("#start-time").val().split('-')[0]+'-12-31'
		$("#end-time").calendar({
			controlId: "endDate",
			nowData: true, //默认选中当前时间,默认true  getClassDynamic
//			lowerLimit: $("#start-time"), //结束日期最小为开始日期  
//			upperLimit:time,
			callback: function() { // 点击选择日期后的回调函数  
				caList.getPlanListInfo();
				$("#start-time").val($("#end-time").val().split('-')[0] + '-01-01');
				$('.classListSpan').text($("#start-time").val().replace('-','年').replace('-','月')+'日'+"-"+$("#end-time").val().replace('-','年').replace('-','月')+'日');
				$('.classStatisticsSpan').text($("#end-time").val().split('-')[0]+'年');
			}
		});
		$('.classListSpan').text($("#start-time").val().replace('-','年').replace('-','月')+'日'+"-"+$("#end-time").val().replace('-','年').replace('-','月')+'日');
		$('.classStatisticsSpan').text($("#end-time").val().split('-')[0]+'年');
		//调用获取列表数据方法
		caList.getPlanListInfo();
		caList.getExportList();
		//多选框点击事件
		$('#checkBox1').click(function() {
			caList.getClassDynamicList();
		});
		$('#checkBox2').click(function() {
			caList.getClassDynamicList();
		});
		$('#checkBox3').click(function() {
			caList.getClassDynamicList();
		});
	},

	/**
	 * 班次统计和全年占比(柱形图)
	 */
	getPlanListInfo: function() {
		var statisticsStart = $('#start-time').val();
		var statisticsEnd = $('#end-time').val();
		var downUrl = $yt_option.base_path + "class/getClassDynamic";
		$yt_baseElement.showLoading();
		$.post(downUrl, {
			'statisticsStart': statisticsStart,
			'statisticsEnd': statisticsEnd
		}, function(data) {
			if(data.flag == 0) {
				var classStatisticsBarName = ['委托   0','选学   0','调训   0']; //柱状图
				var classStatisticsBarValue = [0,0,0]; //柱状图
				var barxAxis = data.data.classStatisticsBar.xAxis; //柱状图横坐标
				var barxNoFinished = data.data.classStatisticsBar.noFinished; //柱状图数据未完成
				var barxFinished = data.data.classStatisticsBar.finished; //柱状图数据已完成
				var noFinishedResValue = [0,0,0]; //返回的数据（未完成）
				var finishedResValue = [0,0,0]; //返回的数据（已完成）
				//柱状图数据 未完成
				$.each(barxNoFinished, function(k, v) {
					if(v.projectType == 2) {
						noFinishedResValue[0] = v.count;
					}
					if(v.projectType == 3) {
						noFinishedResValue[1] = v.count;
					}
					if(v.projectType == 4) {
						noFinishedResValue[2] += Number(v.count);
					}
					if(v.projectType == 5) {
						noFinishedResValue[2] += Number(v.count);
					}
				});
				//柱状图数据 已完成
				$.each(barxFinished, function(k, v) {
					if(v.projectType == 2) {
						finishedResValue[0] = v.count;
					}
					if(v.projectType == 3) {
						finishedResValue[1] = v.count;
					}
					if(v.projectType == 4) {
						finishedResValue[2] += Number(v.count);
					}
					if(v.projectType == 5) {
						finishedResValue[2] += Number(v.count);
					}
				});
				for(var i = 0; i < barxAxis.length; i++) {
					//柱状图横坐标
					var projectValue = barxAxis[i].count;
					if(projectValue == null) {
						projectValue = '0';
					}
					if(barxAxis[i].projectType == 2) {
						classStatisticsBarName[0] = '委托    '+ projectValue;
						classStatisticsBarValue[0]=projectValue;
					}
					if(barxAxis[i].projectType == 3) {
						classStatisticsBarName[1] = '选学    '+ projectValue;
						classStatisticsBarValue[1] = projectValue;
					}
					if(barxAxis[i].projectType == 4 || barxAxis[i].projectType == 5) {
						classStatisticsBarValue[2] += Number(projectValue);
						classStatisticsBarName[2] = '调训    '+ classStatisticsBarValue[2];
					}
				}
				var classStatisticsPie = data.data.classStatisticsPie; //饼图
				var myChart = echarts.init($('.drawing-1').get(0));//柱状图
				option = {
					title: {
						text: '班次统计',
						top: '22px',
						left: '15px',
						textStyle: {
							color: '#111111',
							fontSize: 18,
							fontWeight: 100
						}
					},
					tooltip: {
						trigger: 'axis',
						axisPointer: { // 坐标轴指示器，坐标轴触发有效
							type: 'shadow', // 默认为直线，可选为：'line' | 'shadow'
						}
					},
					toolbox: {
				        feature: {
				            magicType: {
				            },
				           	dataView: {
				            	readOnly:true,
				            	lang:['班次统计','关闭','刷新'],
				            	optionToContent: function(opt) {
								    var axisData = opt.xAxis[0].data;
								    var series = opt.series;
								    console.log(opt)
								    var table = '<table class="yt-table list-table dataViewTable" style="width:100%;margin-top:50px;text-align:center"><thead class="yt-thead list-thead"><tr><th></th>';
								    $.each(axisData, function(i,n) {
						                table += '<th style="color:#333333">'+n.split('    ')[0]+'</th>'//4个空格
								    	
								    });
						                table += '</tr></thead>'+
						                 '<tbody class="list-tbody yt-tbody">'+
						                 '<tr>';
								                
								    for (var i = 0, l = series.length; i < l; i++) {
								       		table += '<td>' + series[i].name + '</td>';
								       		$.each(series[i].data, function(j,k) {
								       			table += '<td>' + k + '</td>';
								       		});
								   			 table += '</tr>';
								    }
								   			 table += '</tbody></table>';
									
								    return table;
								}
				            }
				        },
				        top:25,
				        right:25
				    },
					legend: {
						show: true,
						orient: 'vertical',
						right: '10%',
						top: '30px',
						itemWidth: 10,
						itemHeight: 10,
					},
					grid: {
						top: '20%',
						right: '10%',
						containLabel: true,

					},
					yAxis: {
						type: 'value'
					},
					xAxis: {
						type: 'category',
						data: classStatisticsBarName
					},
//					color: ['#df94e0','#847ccf'],
					series: [{
								name: '已完成',
								type: 'bar',
								barMaxWidth: 25,
								stack: '总量',
								color:'#df94e0',
								label:{
									show:true,
									position:'insideTop',
									formatter: function(e){
									 	if(e.value==0){
									 		return e.value='' 
									 	}
									 	return Math.round(e.value/Number(e.name.split('    ')[1])*100)+'%';
									 }
								},
								data: finishedResValue //项目已立项已完成
							},{
								name: '未完成',
								type: 'bar',
								barMaxWidth: 25,
								stack: true,
								stack: '总量',
								color:'#847ccf',
								label:{
									show:true,
									position:'insideTop',
									formatter: function(e){
									 	if(e.value==0){
									 		return e.value='' 
									 	}
									 	return Math.round(e.value/Number(e.name.split('    ')[1])*100)+'%';
									 }
								},
								data: noFinishedResValue //未完成
							}
							]
				};
				// 使用刚指定的配置项和数据显示图表。
				myChart.setOption(option);
				caList.getPlanListInfo2(classStatisticsPie);
				caList.getClassDynamicList();
				caList.getNowYearClassStatistics(data.data);
				caList.getClassStatisticsList(data.data);
			}else{
				$yt_alert_Model.prompt('查询失败')
			}
		}).error(function() { $yt_alert_Model.prompt('网络异常')});
	},
	/**
	 * 班次统计和全年占比(饼图)
	 */
	getPlanListInfo2: function(classStatisticsPie) {
		var resultData = [];
		var drawing2all = 0;
		$.each(classStatisticsPie, function(k, v) {
			resultData.push({
				name: v.pieName,
				value: v.pieValue
			});
			drawing2all += v.pieValue;
		});
		$('.drawing2all').text(drawing2all);
		var myChart = echarts.init($('.drawing-2').get(0));
		option = {
			title: {
				text: '全年占比',
				top: '22px',
				left: '15px',
				textStyle: {
					color: '#111111',
					fontSize: 18,
					fontWeight: 100
				}
			},
			toolbox: {
		        feature: {
		            magicType: {
		            },
		            dataView: {
		            	readOnly:true,
		            	lang:['全年占比','关闭','刷新'],
		            	optionToContent: function(opt) {
						    var series = opt.series;
						    var table = '<table class="yt-table list-table dataViewTable" style="width:100%;margin-top:20px;text-align:center"><tbody class="list-tbody yt-tbody">';
						    for (var i = 0, l = series[0].data.length; i < l; i++) {
						       		table += '<tr><td>' + series[0].data[i].name + '</td>'+'<td>' + series[0].data[i].value + '</td>';
					   			 	table += '</tr>';
						    }
						   			 table += '</tbody></table>';
							
						    return table;
						}
	            	}
		        },
		        top:21
		    },
			color: ['#df94e0', '#847ccf'],
			legend: {
				show: true,
				orient: 'vertical',
				right: '10%',
				top: '50%',
				itemWidth: 10,
				itemHeight: 10,
				itemStyle: {

				},
			},
			tooltip: {
				trigger: 'item',
				formatter: "{a} <br/>{b}: {c} ({d}%)"
			},

			series: [{
				name: ' ',
				type: 'pie',
				selectedMode: 'single',
				radius: ['30%', '49%'],
				center: ['30%', '50%'],
				itemStyle: {
					borderColor: '#fff',
					borderType: 'solid',
					borderWidth: 2,
				},
				label: {
					show: true,
					position:'inside',
					formatter:'{b}:{c}'
				},
				labelLine: {
					normal: {
						show: false
					}
				},
				data: resultData
			}]
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	},
	/**
	 * 班次列表查询
	 */
	getClassDynamicList: function() {
		$('.list-box .class-tbody').empty();
		var classCacsi = caList.getChecks();
		var statisticsStart = $('#start-time').val();
		var statisticsEnd = $('#end-time').val();
		$('.page-info').pageInfo({
			async: true,
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "class/getClassDynamicList", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				classType: classCacsi,
				statisticsStart: statisticsStart,
				statisticsEnd: statisticsEnd
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			before: function() {
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.list-box .class-tbody');
					var htmlTr = '';
					htmlTbody.empty();
					if(data.data.rows.length > 0) {
						$('.page-info').show();
						$.each(data.data.rows, function(i, v) {
							if(v.projectStates == '未开始') {
								projectStates = '<td style="text-align:center;color:#333333;font-size:11px">' + v.projectStates + '</td>'
							}
							if(v.projectStates == '已结束') {
								projectStates = '<td style="text-align:center;color:#f59700;font-size:11px">' + v.projectStates + '</td>'
							}
							if(v.projectStates == '培训中') {
								projectStates = '<td style="text-align:center;color:#847ccf;font-size:11px">' + v.projectStates + '</td>'
							}
							htmlTr += '<tr>' +
								'<td style="font-size:11px">' + v.projectCode + '</td>' +
								'<td style="text-align:left">' + v.projectName + '</td>' +
								'<td style="text-align:center">' + v.projectType + '</td>' +
								'<td>' + v.groupName + '</td>' +
								'<td style="text-align:center">' + v.projectHead + '</td>' +
								'<td style="text-align:center;font-size:11px">' + v.startDate + '</td>' +
								'<td style="text-align:center;font-size:11px">' + v.endDate + '</td>' +
								'<td style="text-align:right;font-size:11px">' + v.trainDateCount + '</td>' +
								'<td style="text-align:right;font-size:11px">' + v.traineeCount + '</td>' + projectStates +
								'</tr>'
						});
						//$('.details-box').show();
					} else {
						$('.page-info').hide();
						//$('.list-page').hide();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="9" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>'
					}
					htmlTbody.html(htmlTr);
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
	/**
	 * 导出列表
	 */
	getExportList: function() {
		//点击导出
		$(".exportList").on("click", function() {
			/*if($("tr.yt-table-active").length == 0){
				$yt_alert_Model.prompt("请选择要操作的数据");
				return false;
			}*/
			var statisticsStart = $('#start-time').val();
			var statisticsEnd = $('#end-time').val();
			var classType = caList.getChecks();
			var downUrl = $yt_option.base_path + "class/exportClassDynamicList";
			$.ajaxDownloadFile({
				url: downUrl,
				data: {
					classType: classType,
					statisticsStart: statisticsStart,
					statisticsEnd: statisticsEnd
				}
			});
		});
	},
	/**
	 * 本年度班次统计
	 */
	getNowYearClassStatistics: function(data) {
		var myChart = echarts.init($('.drawing-4').get(0));
		var nowYearClassStatistics = data.nowYearClassStatistics;
		option = {
			backgroundColor: '#ffffff',
			title: {
				text: $("#start-time").val().split('-')[0]+'年度班次统计',
				top: '22px',
				left: '15px',
				textStyle: {
					color: '#111111',
					fontSize: 18,
					fontWeight: 100
				}
			},
			toolbox: {
		        feature: {
		            magicType: {
		            },
		            dataView: {
		            	readOnly:true,
				            	lang:['本年度班次统计','关闭','刷新'],
				            	optionToContent: function(opt) {
								    var axisData = opt.xAxis[0].data;
								    var series = opt.series;
								    console.log(opt)
								    var table = '<table class="yt-table list-table dataViewTable" style="width:100%;margin-top:20px;text-align:center"><thead class="yt-thead list-thead"><tr><th></th>';
								    $.each(axisData, function(i,n) {
						                table += '<th style="color:#333333">'+n.split('    ')[0]+'</th>'
								    	
								    });
						                table += '</tr></thead>'+
						                 '<tbody class="list-tbody yt-tbody">'+
						                 '<tr>';
								                
								    for (var i = 0, l = series.length; i < l; i++) {
								       		table += '<td>' + series[i].name + '</td>';
								       		$.each(series[i].data, function(j,k) {
								       			table += '<td>' + k + '</td>';
								       		});
								   			 table += '</tr>';
								    }
								   			 table += '</tbody></table>';
									
								    return table;
								}
		            }
		        },
		        top:25
		    },
			tooltip: {
				trigger: 'axis',
				axisPointer: { // 坐标轴指示器，坐标轴触发有效
					type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
				}
			},
			legend: {
				data: ['委托', '选学', '调训'],
				top: 20,
				itemWidth: 10,
				itemHeight: 10,
				right: 30,
				top: 30
			},
			grid: {
				left: '3%',
				right: '1%',
				bottom: '10%',
				top: '20%',
				containLabel: true
			},
			color: ['#847ccf', '#df94e0', '#b8b3e2'],
			xAxis: [{
				type: 'category',
				data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
			}],
			yAxis: [{
				type: 'value',
				axisLabel: {
					formatter: '{value}'
				}
			}],
			series: [{
				name: '委托',
				type: 'bar',
				barMaxWidth: 15,
				data: nowYearClassStatistics.entrustClassCount
			}, {
				name: '选学',
				type: 'bar',
				barMaxWidth: 15,
				data: nowYearClassStatistics.selectionCount
			}, {
				name: '调训',
				type: 'bar',
				barMaxWidth: 15,
				data: nowYearClassStatistics.bleakInCount
			}]
		};
		// 使用刚指定的配置项和数据显示图表。
		myChart.setOption(option);
	},

	/**
	 * 班次统计列表
	 */
	getClassStatisticsList: function(data) {
		$('.list-box2 .class-tbody').empty();
		var datas = data.classStatisticsList;
		if(datas.length > 0) {
			var htmlTbody = $('.list-box2 .class-tbody');
			htmlTbody.empty();
			var htmlTr = '';
			if(datas.length > 0) {
				var planClassAllCount = 0;
				var planClassAllDate = 0;
				var planClassAllUser = 0;
				var planClassAllUserDate = 0;
				var entrustClassAllCount = 0;
				var entrustClassAllDate = 0;
				var entrustClassAllUser = 0;
				var entrustClassAllUserDate = 0;
				var selectingplanClassAllCount = 0;
				var selectingClasAllsDate = 0;
				var selectingClassAllUser = 0;
				var selectingClassAllUserDate = 0;
				var bleakInClassAllCount = 0;
				var bleakInClassAllDate = 0;
				var bleakInClassAllUser = 0;
				var bleakInClassUserAllDate = 0;
				var subtotalplanClassAllCount = 0;
				var subtotalClassAllDate = 0;
				var subtotalClassAllUser = 0;
				var subtotalClassUserAllDate = 0;
				$.each(datas, function(i, v) {
					v.selectingplanClassCount ==undefined? v.selectingplanClassCount=0:v.selectingplanClassCount=v.selectingplanClassCount;
					v.selectingClassDate ==undefined? v.selectingClassDate=0:v.selectingClassDate=v.selectingClassDate;
					v.selectingClassUser ==undefined? v.selectingClassUser=0:v.selectingClassUser=v.selectingClassUser;
					v.selectingClassUserDate ==undefined? v.selectingClassUserDate=0:v.selectingClassUserDate=v.selectingClassUserDate;
					v.entrustClassCount ==undefined? v.entrustClassCount=0:v.entrustClassCount=v.entrustClassCount;
					v.entrustClassDate ==undefined? v.entrustClassDate=0:v.entrustClassDate=v.entrustClassDate;
					v.entrustClassUser ==undefined? v.entrustClassUser=0:v.entrustClassUser=v.entrustClassUser;
					v.entrustClassUserDate ==undefined? v.entrustClassUserDate=0:v.entrustClassUserDate=v.entrustClassUserDate;
					v.bleakInClassCount ==undefined? v.bleakInClassCount=0:v.bleakInClassCount=v.bleakInClassCount;
					v.bleakInClassDate ==undefined? v.bleakInClassDate=0:v.bleakInClassDate=v.bleakInClassDate;
					v.bleakInClassUser ==undefined? v.bleakInClassUser=0:v.bleakInClassUser=v.bleakInClassUser;
					v.bleakInClassUserDate ==undefined? v.bleakInClassUserDate=0:v.bleakInClassUserDate=v.bleakInClassUserDate;
					v.subtotalplanClassCount ==undefined? v.subtotalplanClassCount=0:v.subtotalplanClassCount=v.subtotalplanClassCount;
					v.subtotalClassDate ==undefined? v.subtotalClassDate=0:v.subtotalClassDate=v.subtotalClassDate;
					v.subtotalClassUser ==undefined? v.subtotalClassUser=0:v.subtotalClassUser=v.subtotalClassUser;
					v.subtotalClassUserDate ==undefined? v.subtotalClassUserDate=0:v.subtotalClassUserDate=v.subtotalClassUserDate;
					planClassAllCount += Number(v.planClassCount);
					planClassAllDate += Number(v.planClassDate);
					planClassAllUser += Number(v.planClassUser);
					planClassAllUserDate += Number(v.planClassUserDate);
					entrustClassAllCount += Number(v.entrustClassCount);
					entrustClassAllDate += Number(v.entrustClassDate);
					entrustClassAllUser += Number(v.entrustClassUser);
					entrustClassAllUserDate += Number(v.entrustClassUserDate);
					selectingplanClassAllCount += Number(v.selectingplanClassCount);
					selectingClasAllsDate += Number(v.selectingClassDate);
					selectingClassAllUser += Number(v.selectingClassUser);
					selectingClassAllUserDate += Number(v.selectingClassUserDate);
					bleakInClassAllCount += Number(v.bleakInClassCount);
					bleakInClassAllDate += Number(v.bleakInClassDate);
					bleakInClassAllUser += Number(v.bleakInClassUser);
					bleakInClassUserAllDate += Number(v.bleakInClassUserDate);
					subtotalplanClassAllCount += Number(v.subtotalplanClassCount);
					subtotalClassAllDate += Number(v.subtotalClassDate);
					subtotalClassAllUser += Number(v.subtotalClassUser);
					subtotalClassUserAllDate += Number(v.subtotalClassUserDate);
					htmlTr += '<tr>' +
						'<td>' + v.monthData + '</td>' +
//						'<td>' + v.planClassCount + '</td>' +
//						'<td>' + v.planClassDate + '</td>' +
//						'<td>' + v.planClassUser + '</td>' +
//						'<td>' + v.planClassUserDate + '</td>' +
						'<td>' + v.entrustClassCount + '</td>' +
						'<td>' + v.entrustClassDate + '</td>' +
						'<td>' + v.entrustClassUser + '</td>' +
						'<td>' + v.entrustClassUserDate + '</td>' +
						'<td>' + v.selectingplanClassCount + '</td>' +
						'<td>' + v.selectingClassDate + '</td>' +
						'<td>' + v.selectingClassUser + '</td>' +
						'<td>' + v.selectingClassUserDate + '</td>' +
						'<td>' + v.bleakInClassCount + '</td>' +
						'<td>' + v.bleakInClassDate + '</td>' +
						'<td>' + v.bleakInClassUser + '</td>' +
						'<td>' + v.bleakInClassUserDate + '</td>' +
						'<td>' + v.subtotalplanClassCount + '</td>' +
						'<td>' + v.subtotalClassDate + '</td>' +
						'<td>' + v.subtotalClassUser + '</td>' +
						'<td>' + v.subtotalClassUserDate + '</td>' +
						'</tr>';
				});
				htmlTr += '<tr>' +
					'<td>总计</td>' +
//					'<td>' + planClassAllCount + '</td>' +
//					'<td>' + planClassAllDate + '</td>' +
//					'<td>' + planClassAllUser + '</td>' +
//					'<td>' + planClassAllUserDate + '</td>' +
					'<td>' + entrustClassAllCount + '</td>' +
					'<td>' + entrustClassAllDate + '</td>' +
					'<td>' + entrustClassAllUser + '</td>' +
					'<td>' + entrustClassAllUserDate + '</td>' +
					'<td>' + selectingplanClassAllCount + '</td>' +
					'<td>' + selectingClasAllsDate + '</td>' +
					'<td>' + selectingClassAllUser + '</td>' +
					'<td>' + selectingClassAllUserDate + '</td>' +
					'<td>' + bleakInClassAllCount + '</td>' +
					'<td>' + bleakInClassAllDate + '</td>' +
					'<td>' + bleakInClassAllUser + '</td>' +
					'<td>' + bleakInClassUserAllDate + '</td>' +
					'<td>' + subtotalplanClassAllCount + '</td>' +
					'<td>' + subtotalClassAllDate + '</td>' +
					'<td>' + subtotalClassAllUser + '</td>' +
					'<td>' + subtotalClassUserAllDate + '</td>' +
					'</tr>';
			} else {
				//$('.list-page').hide();
				htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
					'<td colspan="9" align="center" style="border:0px;">' +
					'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
					'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
					'</div>' +
					'</td>' +
					'</tr>';
			}
			htmlTbody.html(htmlTr);
			$yt_baseElement.hideLoading();
		} else {
			$yt_baseElement.hideLoading(function() {
				$yt_alert_Model.prompt("查询失败");
			});
		}
	},
	/**
	 * 数组中是否包含某个字段
	 */
	getData: function(stringToSearch, arrayToSearch) {
		for(var s = 0; s < arrayToSearch.length; s++) {
			thisEntry = arrayToSearch[s].toString();
			if(thisEntry == stringToSearch) {
				return true;
			}
		}
		return false;
	},
	/**
	 * 多选框
	 */
	getChecks: function() {
		var classCacsi = '';
		var checks = $(".test");
		$.each(checks,function(i,n){
			if(n.checked){
				$(n).parent().parent().css({
						'background-color': '#7b74c7',
						'color': '#ffffff'
					});
				if(classCacsi == '') {
					classCacsi += n.value;
				} else {
					classCacsi += ',' + n.value;
				}
			}else{
				$(n).parent().parent().css({
					'background-color': '#F5F5F5',
					'color': '#333333'
				});
				console.log(n);
			}
		})
		return classCacsi;
	}
};
$(function() {
	//初始化方法
	caList.init();
})