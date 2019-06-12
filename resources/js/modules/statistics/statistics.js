var statist={
	init:function(){
		var me = this ;
		$("#txtDate1").calendar({  
		    speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
		    complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
		    readonly: true, // 目标对象是否设为只读，默认：true     
		    lowerLimit: "2010/01/01", // 日期下限，默认：NaN(不限制)     
		    nowData:true,//默认选中当前时间,默认true  
		    dateFmt:"yyyy-MM",  
		    callback: function() { // 点击选择日期后的回调函数  
		    	me.setData();
		        me.statistDatas($('#txtDate1').val().split('-')[0],$('#txtDate1').val().split('-')[1]);
		    }  
		}); 
		
		me.statistDatas($('#txtDate1').val().split('-')[0],$('#txtDate1').val().split('-')[1]);
		me.setData();
		$('.txtDate-before').click(function(){
			var before = me.beforedate($('.txtDate-now').text());
			$('#txtDate1').val(before);
			me.setData();
			me.statistDatas($('#txtDate1').val().split('-')[0],$('#txtDate1').val().split('-')[1]);
		})
		$('.txtDate-after').click(function(){
			var after = me.afterdate($('.txtDate-now').text());
			$('#txtDate1').val(after);
			me.setData();
			me.statistDatas($('#txtDate1').val().split('-')[0],$('#txtDate1').val().split('-')[1]);
		})
	},
	statistDatas:function(yearData,monthData){
		var me  = this ;
		$.ajax({
			type:"post",
			url: $yt_option.base_path + "class/questionnaire/getStatisticalAnalysis",
			async:true,
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			data:{
				yearData:yearData,
				monthData:monthData
			},
			success:function(data){
				if(data.flag==0){
					//总体满意度均值
					var overallSatisfactionYesteryear = data.data.overallSatisfactionYesteryear;
//					去年均值
					overallSatisfactionYesteryear==null?overallSatisfactionYesteryear=0:overallSatisfactionYesteryear=overallSatisfactionYesteryear;
					var overallSatisfactionThisYear = data.data.overallSatisfactionThisYear;
					//本年均值
					overallSatisfactionThisYear==null?overallSatisfactionThisYear=0:overallSatisfactionThisYear=overallSatisfactionThisYear;
					if(data.data.overallSatisfaction!=''){
						var overallSatisfactionXArr = [];
						var overallSatisfactionDataArr = [];
						$.each(data.data.overallSatisfaction.overallSatisfactionX, function(i,n) {
							overallSatisfactionXArr.push(n);
						});
						$.each(data.data.overallSatisfaction.overallSatisfactionData, function(i,n) {
							overallSatisfactionDataArr.push(n);
						});
						me.part1(overallSatisfactionXArr,overallSatisfactionDataArr,overallSatisfactionYesteryear,overallSatisfactionThisYear);
					}
					//每月各维度均值比较
					var monthDataArr = [];
					var valueList=[];
					if(data.data.everyMonthMean.length>0){
						$.each(data.data.everyMonthMean,function(i,n){
							var typeList = {aa:[]};
							monthDataArr.push(n.monthData+'均值');
							typeList.aa.push(Number(n.teachingPlan).toFixed(2));
							typeList.aa.push(Number(n.teachersTeach).toFixed(2));
							typeList.aa.push(Number(n.teachingActivitiea).toFixed(2));
							typeList.aa.push(Number(n.teachingOrganization).toFixed(2));
							typeList.aa.push(Number(n.learningInteraction).toFixed(2));
							typeList.aa.push(Number(n.windSchoolWind).toFixed(2));
							typeList.aa.push(Number(n.headmasterAbility).toFixed(2));
							typeList.aa.push(Number(n.logisticalServices).toFixed(2));
							typeList.aa.push(Number(n.trainingLearningEffect).toFixed(2));
							typeList.aa.push(Number(n.overallSatisfaction).toFixed(2));
							valueList.push(typeList);
						})
					}
					me.part2(monthDataArr,valueList);
					//当月各维度均值同比
					monthDataArr=[];
					valueList=[];
					if(data.data.nowMonthMean.length>0){
						$.each(data.data.nowMonthMean, function(i,n) {
						monthDataArr.push(n.monthData);
						var typeList = {aa:[]};
						typeList.aa.push(Number(n.teachingPlan).toFixed(2));
						typeList.aa.push(Number(n.teachersTeach).toFixed(2));
						typeList.aa.push(Number(n.teachingActivitiea).toFixed(2));
						typeList.aa.push(Number(n.teachingOrganization).toFixed(2));
						typeList.aa.push(Number(n.learningInteraction).toFixed(2));
						typeList.aa.push(Number(n.windSchoolWind).toFixed(2));
						typeList.aa.push(Number(n.headmasterAbility).toFixed(2));
						typeList.aa.push(Number(n.logisticalServices).toFixed(2));
						typeList.aa.push(Number(n.trainingLearningEffect).toFixed(2));
						typeList.aa.push(Number(n.overallSatisfaction).toFixed(2));
						valueList.push(typeList);
						});
					}
					me.part3(monthDataArr,valueList);
					//总体满意度分类统计
					var hrmlBody = $('.four-tbody').empty();
					var htmlTr = '';
					if(data.data.overallSatisfactionType.length>0){
						var valueList = [];
						//线性图
						var dateList=[];
						var fiveList = [{
									name: '调训班次',
									type: 'line',
									stack: '总量1',
									data: []
								},
								{
									name: '委托班次',
									type: 'line',
									stack: '总量2',
									data: []
								},
								{
									name: '选学班次',
									type: 'line',
									stack: '总量3',
									data: []
								}]
						$.each(data.data.overallSatisfactionType, function(i,n) {
							var typeList = {aa:[]};
							/*
							 表格
							 * */
							htmlTr = '<tr>'+
							'<td>'+n.monthData+'</td>'+
							'<td>'+n.byreakInClass+'</td>'+
							'<td>'+n.entrustClass+'</td>'+
							'<td>'+n.selectionClass+'</td>'+
							'</tr>';
							hrmlBody.append(htmlTr);
							/*
							 柱状图
							 * */
							if(i==Number(data.data.overallSatisfactionType.length)-1){
								typeList.aa.push(n.byreakInClass);
								typeList.aa.push(n.entrustClass);
								typeList.aa.push(n.selectionClass);
								valueList.push(typeList);
							}
							if(i==Number(data.data.overallSatisfactionType.length)-2){
								typeList.aa.push(n.byreakInClass);
								typeList.aa.push(n.entrustClass);
								typeList.aa.push(n.selectionClass);
								valueList.push(typeList);
							}
							/*
							 线图
							 * 
							 * */
							if(i!=Number(data.data.overallSatisfactionType.length)-1){
								dateList.push(n.monthData);
								fiveList[0].data.push(n.byreakInClassCount);
								fiveList[1].data.push(n.entrustClassCount);
								fiveList[2].data.push(n.selectionClassCount);
							}
							
						});
						me.part4(valueList);
//						me.part5(dateList,fiveList);
					}else{
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="5" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 120px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="width: 120px;padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
							htmlBody.append(htmlTr);
					}
					$yt_baseElement.hideLoading();
				}else{
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt("查询失败");
					});
				}
				
				
				
			}
		});
	},
	setData:function(){
	var me = this ;
	$('.txtDate-now').text($("#txtDate1").val());
	$('.txtDate-before').text(me.beforedate($("#txtDate1").val()));
	$('.txtDate-after').text(me.afterdate($("#txtDate1").val()));
	},
	beforedate:function(val){
			var mouthArr =  val.split('-');
			if(mouthArr[1]=='01'){
				mouthArr[1] = '12';
				mouthArr[0] = Number(mouthArr[0])-1;
			}else{
				mouthArr[1] = Number(mouthArr[1])-1;
				if(mouthArr[1]<10){
					mouthArr[1] = '0'+mouthArr[1];
				}
			}
			mouthArr = mouthArr.join('-');
			return mouthArr;
		},
		afterdate:function(val){
			var mouthArr = val.split('-');
			if(mouthArr[1]=='12'){
				mouthArr[1] = '01';
				mouthArr[0] = Number(mouthArr[0])+1;
			}else{
				mouthArr[1] = Number(mouthArr[1])+1;
				if(mouthArr[1]<10){
					mouthArr[1] = '0'+mouthArr[1];
				}
			}
			mouthArr = mouthArr.join('-');
			return mouthArr;
		},
		part1: function(overallSatisfactionXArr,overallSatisfactionDataArr,overallSatisfactionYesteryear,overallSatisfactionThisYear) {
		$('.statistics-draw1').replaceWith('<div  class="statistics-draw1"></div>');
		var myChart = echarts.init($('.statistics-draw1').get(0));
		option = {
			title: {
				text: '一、总体满意度均值',
				textStyle: {
					color: '#111111',
					fontSize: 18,
					fontWeight: 100
				},
				top: 17
			},
			toolbox: {
		        feature: {
		            magicType: {
		            },
		            dataView: {
		            	readOnly:true,
		            	lang:['总体满意度均值','关闭','刷新'],
		            	optionToContent: function(opt) {
						    var axisData = opt.xAxis[0].data;
						    var series = opt.series;
						    var table = '<table class="yt-table list-table" style="width:100%;text-align:center"><thead class="yt-thead list-thead"><tr>';
						     for (var i = 0, l = series[0].data.length; i < l; i++) {
						                table += '<th style="color:#333333">'+(i+1)+'月</th>'
						    }
						                table += '</tr></thead>'+
						                 '<tbody class="list-tbody yt-tbody">'+
						                 '<tr>';
						                
						    for (var i = 0, l = series[0].data.length; i < l; i++) {
						        table += '<td>' + series[0].data[i] + '</td>'
						    }
						    table += '</tr></tbody></table>';
						    return table;
						}
		            }
		        },
		        top:15
		    },
			grid: {
				top: '20%',
				bottom: '5%',
				left:'2%',
				right:'2%',
				containLabel: true
			},
			xAxis: {
				type: 'category',
				data:overallSatisfactionXArr
			},
			yAxis: {
				type: 'value',
				max:100
			},
			color: ['#847ccf', '#df94e0', '#b8b3e2', '#f59700', '#6776ea', '#394b59', '#c554ff', '#30323d'],
			series: [{
				data:overallSatisfactionDataArr,
				type: 'bar',
				label: {
					show: true,
					position: 'top',
					color: '#000',
					formatter: function(e){
								 	if(e.value==0){
								 		return e.value='' 
								 	}else{
								 		return e.value = Number(e.value).toFixed(2); 
								 	}
			 			}
				},
				legend: {
					right: 21,
					itemWidth: 10,
					itemHeight: 10,
					top: 30,
					formatter:function(e){
						console.log(e)
					}
				},
				markLine: {
                data : [
                    {
                    	yAxis:Number(overallSatisfactionThisYear).toFixed(2),
                    	name:$('#txtDate1').val().split('-')[0]+'年01月-'+$('#txtDate1').val().split('-')[1]+'月总体满意度均值：',
                    	label:{
                    		position:'middle',
                    		formatter:function(el){
                    			return el.value
                    		}
                    	},
                    	emphasis:{
				        	label:{
			        		show:true,
                    		position:'middle',
                    		formatter:function(el){
                    			console.log(el.name+el.data.value)
                    			return el.name+el.data.value
                    		}
                    	}
				        },
                		lineStyle:{
                			color:'#f59700',
                			width:2
                		}
                    },
                    {
				        yAxis: Number(overallSatisfactionYesteryear).toFixed(2),
				        name:(Number($('#txtDate1').val().split('-')[0])-1)+'年总体满意度均值：',
				        label:{
                    		position:'middle',
                    		formatter:function(el){
                    			return el.value
                    		}
                    	},
				        emphasis:{
				        	label:{
				        	show:true,
                    		position:'middle',
                    		formatter:function(el){
                    			console.log(el.name+el.data.value)
                    			return el.name+el.data.value
                    		}
                    	}
				        },
				        lineStyle:{
                			color:'#de595a',
                			width:2
                		}
				    },
                	]
            	},
				barWidth: 15,
				barGap: "0%",
				barCategoryGap: "60px",
				itemStyle: {
					barBorderRadius: [2, 2, 0, 0]
				},
			}]
		};
		myChart.setOption(option);
	},part2: function(dateList,valueList) {
		$('.statistics-draw2').replaceWith('<div class="statistics-draw2"></div>');
		var myChart = echarts.init($('.statistics-draw2').get(0));
		var nameList = ['教学方案', '教师授课', '教学活动', '教学组织', '学员互动', '学风院风', '班主任履职能力', '后勤服务', '培训学习效果', '总体满意度'];
		var dateList = dateList;
		var valueList = valueList;
		var seriesList = [];
		$.each(dateList, function(k, v) {
			seriesList.push({
				name: v,
				type: 'bar',
				barMaxWidth: 40,
				itemStyle: {
					normal: {
						show: true,
					}
				},
				label: {
					show: false,
					position: 'top',
					color: '#000',
					formatter: function(e){
								 	if(e.value==0){
								 		return e.value='' 
								 	}else{
								 		return e.value = Number(e.value).toFixed(2); 
								 	}
					 			}
				},
				barWidth: 12,
				barGap: "0%",
				barCategoryGap: "130px",
				itemStyle: {
					barBorderRadius: [2, 2, 0, 0]
				},
				data: valueList[k].aa
			});
		});
		option = {
			title: {
				text: '二、每月各维度均值比较',
				textStyle: {
					color: '#111111',
					fontSize: 18,
					fontWeight: 100
				},
				top: 27
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			toolbox: {
		        feature: {
		            magicType: {
		            },
		            dataView: {
		            	readOnly:true,
		            	lang:['每月各维度均值比较','关闭','刷新'],
		            	optionToContent: function(opt) {
		            		console.log(opt,valueList)
						    var axisData = opt.xAxis[0].data;
						    var series = opt.series;
							var teachingPlan='<tr><td>' + axisData[0] + '</td>';
							var teachersTeach='<tr><td>' + axisData[1] + '</td>';
							var teachingActivitiea='<tr><td>' + axisData[2] + '</td>';
							var teachingOrganization='<tr><td>' + axisData[3] + '</td>';
							var learningInteraction='<tr><td>' + axisData[4] + '</td>';
							var windSchoolWind='<tr><td>' + axisData[5] + '</td>';
							var headmasterAbility='<tr><td>' + axisData[6] + '</td>';
							var logisticalServices='<tr><td>' + axisData[7] + '</td>';
							var trainingLearningEffect='<tr><td>' + axisData[8] + '</td>';
							var overallSatisfaction='<tr><td>' + axisData[9] + '</td>';
						    var table = '<div style="padding:10px;box-size:border-box;"><table class="yt-table list-table" style="width:100%;text-align:center;"><thead class="yt-thead list-thead"><tr><th></th>';
						    
						     for (var i = 0, l = series.length; i < l; i++) {
						                table += '<th style="color:#333333">'+series[i].name+'</th>'
						    }
						                table += '</tr></thead>'+
						                 '<tbody class="list-tbody yt-tbody">';
						        for (var i = 0, l = series.length; i < l; i++) {
						        	 teachingPlan+='<td>' + series[i].data[0] + '</td>';
									 teachersTeach+='<td>' + series[i].data[1] + '</td>';
									 teachingActivitiea+='<td>' + series[i].data[2] + '</td>';
									 teachingOrganization+='<td>' + series[i].data[3] + '</td>';
									 learningInteraction+='<td>' + series[i].data[4] + '</td>';
									 windSchoolWind+='<td>' + series[i].data[5] + '</td>';
									 headmasterAbility+='<td>' + series[i].data[6] + '</td>';
									 logisticalServices+='<td>' + series[i].data[7] + '</td>';
									 trainingLearningEffect+='<td>' + series[i].data[8] + '</td>';
									 overallSatisfaction+='<td>' + series[i].data[9] + '</td>';
						    	}
						  			 teachingPlan+='</tr>';
									 teachersTeach+='</tr>';
									 teachingActivitiea+='</tr>';
									 teachingOrganization+='</tr>';
									 learningInteraction+='</tr>';
									 windSchoolWind+='</tr>';
									 headmasterAbility+='</tr>';
									 logisticalServices+='</tr>';
									 trainingLearningEffect+='</tr>';
									 overallSatisfaction+='</tr>';
							table+=teachingPlan+teachersTeach+teachingActivitiea+teachingOrganization+learningInteraction+windSchoolWind+headmasterAbility+logisticalServices+trainingLearningEffect+overallSatisfaction;
						    table += '</tbody></table></div>';
						    return table;
						}
		            }
		        },
		        top:25
		    },
			legend: {
				data: dateList,
				right: 21,
				itemWidth: 10,
				itemHeight: 10,
				top: 30,
			},
			color: ['#de595a', '#5a12b3', '#2a1ca9','#847ccf', '#df94e0', '#b8b3e2', '#f59700', '#6776ea', '#394b59', '#c554ff', '#9e0ea7','#000e5a'],
			grid: {
				top: '20%',
				left: '2%',
				right: '2%',
				containLabel: true
			},
			yAxis: {
				type: 'value',
				boundaryGap: [0, 0.01],
				max:100
			},
			xAxis: {
				type: 'category',
				data: nameList
			},
			series: seriesList
		};
		myChart.setOption(option);
	},
	part3: function(dateList,valueList) {
		var myChart = echarts.init($('.statistics-draw3').get(0));
		var nameList = ['教学方案', '教师授课', '教学活动', '教学组织', '学员互动', '学风院风', '班主任履职能力', '后勤服务', '培训学习效果', '总体满意度'];
		var dateList =dateList;
		var valueList = valueList;
		var seriesList = [];
		$.each(dateList, function(k, v) {
			seriesList.push({
				name: v,
				type: 'bar',
				barMaxWidth: 40,
				itemStyle: {
					normal: {
						show: true,
					}
				},
				label: {
					show: true,
					position: 'top',
					color: '#000',
					formatter: function(e){
								 	if(e.value==0){
								 		return e.value='' 
								 	}else{
								 		return e.value = Number(e.value).toFixed(2); 
								 	}
					 			}
				},
				barWidth: 15,
				barGap: "0%",
				barCategoryGap: "130px",
				itemStyle: {
					barBorderRadius: [2, 2, 0, 0]
				},
				data: valueList[k].aa
			});
		});
		option = {
			title: {
				text: '三、当月各维度均值同比',
				textStyle: {
					color: '#111111',
					fontSize: 18,
					fontWeight: 100
				},
				top: 24
			},
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			toolbox: {
		        feature: {
		            magicType: {
		            },
		            dataView: {
		            	readOnly:true,
		            	lang:['当月各维度均值同比','关闭','刷新'],
		            	optionToContent: function(opt) {
						    var axisData = opt.xAxis[0].data;
						    var series = opt.series;
						    var table = '<table class="yt-table list-table" style="width:100%;text-align:center"><thead class="yt-thead list-thead"><tr><th></th>';
						     for (var i = 0, l = axisData.length; i < l; i++) {
					                table += '<th style="color:#333333">'+axisData[i]+'</th>'
						    }
					                table += '</tr></thead>'+
					                 '<tbody class="list-tbody yt-tbody">';
						    for (var i = 0, l = series.length; i < l; i++) {
						        table += '<tr><td>' + series[i].name + '</td>'
						        for (var j = 0; j < series[i].data.length; j++) {
							        table += '<td>' + series[i].data[j] + '</td>'
							    }
						         table += '</tr>'
						    }
						    table += '</tbody></table>';
						    return table;
						}
		            }
		        },
		        top:25
		    },
			legend: {
				data: dateList,
				right: 21,
				itemWidth: 10,
				itemHeight: 10,
				top: 30,
			},
			color: ['#847ccf', '#df94e0', '#b8b3e2', '#f59700', '#6776ea', '#394b59', '#c554ff', '#30323d'],
			grid: {
				top: '20%',
				left: '2%',
				right: '2%',
				containLabel: true
			},
			yAxis: {
				type: 'value',
				boundaryGap: [0, 0.01],
				max:100
			},
			xAxis: {
				type: 'category',
				data: nameList
			},
			series: seriesList
		};
		myChart.setOption(option);
	},
	
	part4: function(valueList) {
		var myChart = echarts.init($('.statistics-draw4').get(0));
		var nameList = ['调训', '委托', '选学'];
		var dateList = [ '总体满意度'+$('#txtDate1').val().split('-')[1]+'月均值','总体满意度'+(Number($('#txtDate1').val().split('-')[0])-1)+'年均值'];
		var valueList = valueList;
		var seriesList = [];
		$.each(dateList, function(k, v) {
			seriesList.push({
				name: v,
				type: 'bar',
				barMaxWidth: 40,
				itemStyle: {
					normal: {
						show: true,
					}
				},
				label: {
					show: true,
					position: 'top',
					color: '#000',
					formatter: function(e){
								 	if(e.value==0){
								 		return e.value='' 
								 	}else{
								 		return e.value = Number(e.value).toFixed(2); 
								 	}
								 	
					 			}
				},
				barWidth: 15,
				barGap: "0%",
				barCategoryGap: "130px",
				itemStyle: {
					barBorderRadius: [2, 2, 0, 0]
				},
				data: valueList[k].aa
			});
		});
		option = {
			tooltip: {
				trigger: 'axis',
				axisPointer: {
					type: 'shadow'
				}
			},
			legend: {
				data: dateList,
				right: 21,
				itemWidth: 10,
				itemHeight: 10,
				top: 4,
			},
			toolbox: {
		        feature: {
		            magicType: {
		            },
		            dataView: {
		            	readOnly:true,
		            	lang:['总体满意度','关闭','刷新'],
		            	optionToContent: function(opt) {
		            		console.log(opt)
						    var axisData = opt.xAxis[0].data;
						    var series = opt.series;
						    var table = '<table class="yt-table list-table" style="width:100%;text-align:center"><thead class="yt-thead list-thead"><tr><th></th>';
						     for (var i = 0, l = axisData.length; i < l; i++) {
					                table += '<th style="color:#333333">'+axisData[i]+'</th>'
						    }
					                table += '</tr></thead>'+
					                 '<tbody class="list-tbody yt-tbody">';
						    for (var i = 0, l = series.length; i < l; i++) {
						        table += '<tr><td>' + series[i].name + '</td>'
						        for (var j = 0; j < series[i].data.length; j++) {
							        table += '<td>' + series[i].data[j] + '</td>'
							    }
						         table += '</tr>'
						    }
						    table += '</tbody></table>';
						    return table;
						}
		            }
		        }
		    },
			color: ['#847ccf', '#df94e0', '#b8b3e2', '#f59700', '#6776ea', '#394b59', '#c554ff', '#30323d'],
			grid: {
				left: '4%',
				right: '5%',
				bottom: '0%',
				containLabel: true
			},
			yAxis: {
				type: 'value',
				boundaryGap: [0, 0.01],
				max:100
			},
			xAxis: {
				type: 'category',
				data: nameList
			},
			series: seriesList
		};
		myChart.setOption(option);
	}
	//折线图
//	part5: function(dataList,seriesData) {
//		console.log(seriesData)
//		var myChart = echarts.init($('.statistics-draw5').get(0));
//		option = {
//			tooltip: {
//				trigger: 'axis'
//			},
//			legend: {
//				data: ['调训班次','委托班次', '选学班次'],
//				right:25,
//				top:10
//			},
//			toolbox: {
//		        feature: {
//		            magicType: {
//		            },
//		            dataView: {
//		            	readOnly:true,
//		            	lang:[' ','关闭','刷新'],
//		            	optionToContent: function(opt) {
//		            		console.log(opt)
//						    var axisData = opt.xAxis[0].data;
//						    var series = opt.series;
//						    var table = '<table class="yt-table list-table" style="width:100%;text-align:center"><thead class="yt-thead list-thead"><tr><th></th>';
//						     for (var i = 0, l = axisData.length; i < l; i++) {
//					                table += '<th style="color:#333333">'+axisData[i]+'</th>'
//						    }
//					                table += '</tr></thead>'+
//					                 '<tbody class="list-tbody yt-tbody">';
//						    for (var i = 0, l = series.length; i < l; i++) {
//						        table += '<tr><td>' + series[i].name + '</td>'
//						        for (var j = 0; j < series[i].data.length; j++) {
//							        table += '<td>' + series[i].data[j] + '</td>'
//							    }
//						         table += '</tr>'
//						    }
//						    table += '</tbody></table>';
//						    return table;
//						}
//		            }
//		        },
//		        top:5
//		    },
//			grid: {
//				left: '2%',
//				right: '2%',
//				bottom: '3%',
//				containLabel: true
//			},
//			color: ['#847ccf', '#df94e0', '#b8b3e2', '#f59700', '#6776ea', '#394b59', '#c554ff', '#30323d'],
//			xAxis: {
//				type: 'category',
//				boundaryGap: false,
//				data: dataList
//			},
//			yAxis: {
//				type: 'value'
//			},
//			series: seriesData
//		};
//
//		myChart.setOption(option);
//}
}
$(document).ready(function() {
	statist.init();
})