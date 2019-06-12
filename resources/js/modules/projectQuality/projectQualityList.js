/**
 * 项目管理列表
 */
var caList = {
	//初始化方法
	thisUrs:'',
	init: function() {
		$("#startTime").calendar({
			controlId: "startDate",
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $("#endTime") //开始日期最大为结束日期  
		});
		$("#endTime").calendar({
			controlId: "endDate",
			nowData: false, //默认选中当前时间,默认true  
			lowerLimit: $("#startTime") //结束日期最小为开始日期  
		});
		$("#endDate-time").calendar({
			controlId: "endDateTime",
			nowData: false, //默认选中当前时间,默认true  
		});
		$(".search-startDate").calendar({
			controlId: "startDates",
			nowData: true, //默认选中当前时间,默认true  
			dateFmt:"yyyy-MM",
			callback:function(){
				if(new Date($(".search-endDate").val())<new Date($(".search-startDate").val())){
					$(".search-endDate").val($(".search-startDate").val());
				}
				caList.getPlanListInfo();
			}
		});
		$(".search-endDate").calendar({
			controlId: "endDates",
			nowData: true, //默认选中当前时间,默认true  
			dateFmt:"yyyy-MM",
			callback:function(){
				if(new Date($(".search-endDate").val())<new Date($(".search-startDate").val())){
					$(".search-startDate").val($(".search-endDate").val());
				}
				caList.getPlanListInfo();
			}
		});
		sessionStorage.getItem("startDate")?$('.search-startDate').val(sessionStorage.getItem("startDate")):'';
		sessionStorage.getItem("endDate")?$('.search-endDate').val(sessionStorage.getItem("endDate")):'';
		//调用获取列表数据方法
		caList.getPlanListInfo();
		caList.exportClass();
		caList.endDate();
		caList.setEndDate();
		caList.sendNotice();
		//跳转页面传参
		$('.list-table').on("click", ".projectName", function() {
			var projectCode = $(this).parents("tr").find('.projectCode').text(); //获取班级编号
			var projectType = $(".yt-table-active .projectType").val();
			var pkId=$(this).parents("tr").find('.pkId').val();
			var thisUrs='';
			sessionStorage.setItem("startDate", $(".search-startDate").val());
			sessionStorage.setItem("endDate", $(".search-endDate").val());
			sessionStorage.setItem("searchParams", $('#keyword').val());
			sessionStorage.setItem("pageIndexs", $('.num-text.active').text());	
			if($('.sendNotice')[0]){
				thisUrs = 300;
			}
			if(projectType == 1 || projectType == 2 || projectType == 4||projectType == 5) {
				console.log('thisUrs',caList.thisUrs);
				console.log('thisUrs1111',caList.thisUrs);
				window.location.href = "nonsatisfiedScore.html?projectCode=" + projectCode+"&pkId="+pkId+"&thisUrs="+thisUrs;
			}
			if(projectType == 3) {
				window.location.href = "nonsatisfiedScoreTrue.html?projectCode=" + projectCode+"&pkId="+pkId+"&thisUrs="+thisUrs;
			}

		});
		//条件搜索
		$('#search-button').click(function() {
			//调用获取列表数据方法查询
			caList.getPlanListInfo();
		});
		$('#sendNotice-search').click(function(){
			caList.sendNotice($('#sendNotice-text').val());
		});
		//右侧已选人员 选中，悬停状态
		$('.sendNotice-right ul').on('click', '.tree-node', function() {
			if($(this).hasClass('tree-node-selected')) {
				$(this).removeClass('tree-node-selected');
				//如果显示
				if(!$('.easyui-panel2').is(':hidden')){
					$('#rightTree .tree-node[userCode='+$(this).attr('userCode')+']').removeClass('tree-node-selected');
				}
			} else {
				$(this).addClass('tree-node-selected');
				//如果显示
				if(!$('.easyui-panel2').is(':hidden')){
					$('#rightTree .tree-node[userCode='+$(this).attr('userCode')+']').addClass('tree-node-selected');
				}
			}
			
		})
		$('.sendNotice-right ul').on('mouseenter', '.tree-node', function() {
			$(this).addClass('tree-node-hover');
		})
		$('.sendNotice-right ul').on('mouseout', '.tree-node', function() {

			$(this).removeClass('tree-node-hover');
		})
		$('.easyui-panel2').hide();
		$('#search-right-btn').off().click(function(){
			$('.easyui-panel2').show();
			$('#rightTree2').empty().show();
			var text = $('#search-right-text').val();
			if(text==''){
				$('.easyui-panel2').hide();
			}
			$.each($('#rightTree').find('.tree-node'), function(i,n) {
				var userCode = $(n).attr('userCode');
				var name = $(n).text();
				if($(n).text().indexOf(text)!=-1){
					$('#rightTree2').append('<li class="tree-node" userCode="' + userCode + '">' + name + '</li>')
				}
			});
			return false;
		})
		
	},

	/**
	 * 获取列表数据
	 */
	getPlanListInfo: function() {
		sessionStorage.getItem("searchParams")?$('#keyword').val(sessionStorage.getItem("searchParams")):'';
		var selectParam = $('#keyword').val();
		var endTimeStart = $('#start-time').val();
		var endTimeEnd = $('#end-time').val();
		$('.list-page').pageInfo({
			async: true,
			pageIndexs: sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "class/questionnaire/lookForAll", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam: selectParam,
				endTimeStart: endTimeStart,
				endTimeEnd: endTimeEnd,
				selectProjectStart:$('.search-startDate').val(),
				selectProjectEnd:$('.search-endDate').val()
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			before: function() {
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				sessionStorage.clear();
				if(data.flag == 0) {
					var htmlTbody = $('.class-tbody');
					var htmlTr = '';
					if(data.data.rows.length > 0) {
						$.each(data.data.rows, function(i, v) {
							var projectType = v.projectType;
							switch(projectType) {
								case '1':
									projectType = '计划';
									break;
								case '2':
									projectType = '委托';
									break;
								case '3':
									projectType = '选学';
									break;
								case '4':
									projectType = '中组部调训';
									break;
								case '5':
									projectType = '国资委调训';
									break;
								default:
									projectType = '';
									break;
							}
							var questionnaireStates = v.questionnaireStates;
							switch(questionnaireStates) {
								case '1':
									v.questionnaireStates = '未结束';
									break;
								case '2':
									v.questionnaireStates = '已结束';
									break;
								case '3':
									v.questionnaireStates = '已发送';
									break;
								default:
									v.questionnaireStates = '';
									break;
							}
							v.projectStartEndDate==undefined?v.projectStartEndDate='':v.projectStartEndDate=v.projectStartEndDate;
//							if(projectType != "委托") {
								htmlTr += '<tr>' +
									'<td class="projectCode" style="word-wrap : break-word ;">' + v.projectCode + '</td>' +
									'<input type="hidden" value="' + v.pkId + '" class="pkId">' +
									'<td style="text-align:left;"><a style="color: #3c4687;" class="projectName">' + v.projectName + '</a></td>' +
									'<input type="hidden" value="' + v.projectType + '" class="projectType">' +
									'<td>' + projectType + '</td>' +
									'<td class="text-overflow" style="text-align:left">' + v.projectHead + '</td>' +
									'<td class="text-overflow" style="text-align:left">' + v.projectStartEndDate + '</td>' +
									'<td class="endTime" deadlineDate="'+v.deadlineDate+'">' + v.deadlineDate + '</td>' +
									'<td style="text-align:right">' + v.checkCount + '</td>' +
									'<td style="text-align:right">' + v.questionnaireCount + '</td>' +
									'<td>' + questionnaireStates + '</td>' +
									'<td>' + v.populationQuestionnaire + '</td>' +
									'</tr>';
//							}

						});
						$('.list-page').show();
					} else {
						$('.list-page').hide();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="10" align="center" style="border:0px;">' +
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
			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	//导出
	exportClass: function() {
		//点击导出按钮
		$('.btn-all').off().on('click', '.exportList', function() {
			 $(".add-shuttle-box").show();  
	        /** 
	         * 调用算取div显示位置方法 
	         */  
	        $yt_alert_Model.getDivPosition($(".add-shuttle-box"));  
	        /* 
	         * 调用支持拖拽的方法 
	         */  
	        $yt_model_drag.modelDragEvent($(".add-shuttle-box .yt-edit-alert-title"));  
	        /** 
	         * 点击取消方法 
	         */  
	        $('.add-shuttle-box .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {  
	            //隐藏页面中自定义的表单内容  
	            $(".add-shuttle-box").hide();  
	        });  
		});
		//点击导出弹框里的其他按钮
		 $(".add-shuttle-box table tr.tr-height button").click(function(){
		 	//时间
			var startDate=$("#startTime").val();
			var endDate=$("#endTime").val();
			var thisIndex=$(this).index();
		 	console.log('startDate',startDate,'endDate',endDate,'thisIndex',thisIndex);
		 	if(startDate==''||endDate==''){
		 		$yt_alert_Model.prompt('请选择日期');
		 		return false;
		 	}else{
		 		if(thisIndex==0){
		 			thisIndex=1;
		 		}else if(thisIndex==1){
		 			thisIndex=2;
		 		}else{
		 			thisIndex=3;
		 		}
				var downUrl = $yt_option.base_path + "class/questionnaire/exportProjectScore";
				var selectParam = $('#keyword').val();
					$.ajaxDownloadFile({
						url: downUrl,
						data: {
							selectParam: selectParam,
							endTimeStart: startDate,
							endTimeEnd: endDate,
							exportType: thisIndex
						}
					});
		 	}
		 });
	},
	/**
	 * 获取当前登录人
	 */
//	getThisUser:function(){
//		$.ajax({
//			url:$yt_option.base_path + "uniform/user/getUsersDetails",
//			async:true,
//			type:"post",
//			success:function(data){
//				console.log('登录人',data);
//				var roleIds=data.data.roleIds;
//				//判断是否有300权限
//				console.log('登录人',roleIds.indexOf('300'));
//				if(roleIds.indexOf('300')!=-1){
//					caList.thisUrs='300';
//					$(".search-btn-slect .exportList").show();
//				}else{
//					$(".search-btn-slect .exportList").hide();
//					//项目质量中，发送通知和评分截止日期的按钮只有质量管理人员这个角色才有，其余人没有
//					$('.sendNotice').hide();
//					$('.endDate').hide();
//				}
//				console.log('thisUrs',caList.thisUrs);
//			}
//		});
//		
//	},
	/*
	 json转换树形式
	 * 
	 * */
	getTreeData: function(data, parentId) {
		var me = this;
		var result = [],
			temp;
		for(var i in data) {
			if(data[i].parentId == parentId) {
				result.push(data[i]);
				temp = me.getTreeData(data, data[i].id);
				if(temp.length > 0) {
					data[i].children = temp;
				}
			}
		}
		return result;
	},
	//推送
	sendNotice: function(userName) {
		var me = this;
		var treeList = [];
		$('.sendNotice').on('click', function() {
			if($('.yt-table-active').index() == '-1') {
				$yt_alert_Model.prompt('请先选择需要推送的项目')
			}else{
			caList.showAlert5(".class-room-tye-shuttle-box");
			}
		})
		//获得树形列表
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/user/getUsers",
			async: true,
			data: {
				userName:userName
			},
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag==0){
					$.each(data.data, function(i, n) {
					n.userCode = n.textName;
					})
					$("#tt").tree({
						data: me.getTreeData(data.data, "0"),
						formatter: function(node) {
							if(node.type == 3) {
								treeList.push(node)
							}
							return node.text
						},
						animate: true,
						checkbox: true,
						onCheck: function(node) {
							console.log( $('#tt').tree('getChecked'))
						}
					});
				}else{
					$yt_alert_Model.prompt('获取人员失败')
				}
				
				$yt_baseElement.hideLoading();
			},error:function(){
				$yt_baseElement.hideLoading(function(){
					$yt_alert_Model.prompt('网络异常，获取人员失败')
				});
			}
		});

		//获得右侧已选人员
		function ajax(selectParams, type, func) {
			$.ajax({
				type: "post",
				url: $yt_option.base_path + 'class/questionnaire/getDeadlineSendUser',
				async: true,
				beforeSend:function(){
					$yt_baseElement.showLoading();
				},
				data: {
					types: type,
					selectParam: selectParams
				},
				success: function(data) {
					func(data);
					$yt_baseElement.hideLoading();
				}
			});
		}

		function bb(data) {
			$yt_baseElement.hideLoading();
			$('#rightTree').empty();
			$.each(data.data, function(i, n) {
				$('#rightTree').append('<li class="tree-node" userCode="' + n.userCode + '">' + n.userName + '</li>')
			});
		}
		//右侧数据
		ajax('', 2, bb);
		//增加已选人员
		function addUser(nodes) {
			$.each(nodes, function(k, v) {
				var bool = true;
				$.each($('#rightTree .tree-node'), function(j, m) {
					if(v.userCode == $(m).attr('usercode')) {
						bool = false
					}
				});
				if(bool) {
					if(v.type == 3) {
						$('#rightTree').append('<li class="tree-node" userCode="' + v.userCode + '">' + v.text + '</li>')
					}
				}
			});
		}
		//点击左箭头
		$('#setleft').off().on('click', function() {

			$.each($('.sendNotice-right .tree-node'), function(i, n) {
				if($(n).hasClass('tree-node-selected')) {
					$(n).remove();
				}
			})
		})
		//点击右箭头
		$('#setright').off().on('click', function() {
			var nodes = $('#tt').tree('getChecked');
			addUser(nodes);
		})
		//点击all左箭头
		$('#allsetleft').off().on('click', function() {
			$('#rightTree').empty();
			//搜索框关闭
			$('#rightTree2').hide();
		})
		//点击all右箭头
		$('#allsetright').off().on('click', function() {
			var sele = $('#tt').tree('getChecked', ['checked', 'unchecked']);
			addUser(sele);
		})
		//保存默认名单
		$('#saveUser').off().click(function() {
			var a = [];
			$.each($('.sendNotice-right #rightTree .tree-node'), function(c, v) {
				a.push($(v).attr('userCode'));

			})
			a = a.join(',');
			if(a != '') {
				caList.saveUser(a);
			} else {
				$yt_alert_Model.prompt('请选择需要保存的人员')
			}

		});
		//获取默认名单
		$('#getUser').off().click(function() {
			$yt_baseElement.showLoading();
			ajax('', 1, bb);
		});
		//提交推送
		$('#sendNotice-submit').off().click(function() {
			var b = [];
			$.each($('.sendNotice-right #rightTree .tree-node'), function(c, v) {
				b.push($(v).attr('userCode'));

			})
			b = b.join(',');
			if(b != '') {
				caList.setUser(b);
			} else {
				$yt_alert_Model.prompt('请选择需要推送的人员');
			}
		})
	},
	//设置截止日期
	endDate: function() {
		$('.endDate').click(function() {
			if($('.yt-table-active').index() == '-1') {
				$yt_alert_Model.prompt('请先选择需要设置的项目')
			} else {
				$('.endDate-projectCode').text('');
				$('.endDate-projectName').text('');
				$('#endDate-time').val('');
				$('.endDate-projectCode').text($('.yt-table-active .projectCode').text());
				$('.endDate-projectName').text($('.yt-table-active .projectName').text());
				$('#endDate-time').val($('.yt-table-active .endTime').attr('deadlineDate'));
				caList.showAlert5(".endDate-shuttle-box");
			}

		})
	},
	showAlert5: function(clas) {
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$(clas).show();
		/** 
		 * 调用算取div显示位置方法 
		 */

		$yt_alert_Model.getDivPosition($(clas));
		/*
		 * 滚动条
		 * 
		 * */
		$yt_alert_Model.setFiexBoxHeight($(clas + " .yt-edit-alert-main"));
		/* 
		 * 调用支持拖拽的方法 
		 */
		$yt_model_drag.modelDragEvent($(clas + " .yt-edit-alert-title"));
		/** 
		 * 点击取消方法 
		 */
		$(clas + " .yt-model-canel-btn").off().on("click", function() {
			//隐藏页面中自定义的表单内容  
			$(clas + ",#heard-nav-bak").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
	},
	//设置截止日期
	setEndDate: function() {
		$('.endDate-btn').on('click', function() {
			console.log(1)
			if($('#endDate-time').val() == '') {
				$yt_alert_Model.prompt('请选择结束日期')
			} else {
				//隐藏页面中自定义的表单内容  
				$(".endDate-shuttle-box,#heard-nav-bak").hide();
				//隐藏蒙层  
				$("#pop-modle-alert").hide();
				$.ajax({
					type: "post",
					url: $yt_option.base_path + "class/questionnaire/updateDeadlineDate",
					async: true,
					data: {
						projectCode: $('.endDate-projectCode').text(),
						deadlineDate: $('#endDate-time').val(),
					},
					beforeSend:function(){
						$yt_baseElement.showLoading();
					},
					success: function(data) {
						if(data.flag == 0) {
							$yt_alert_Model.prompt("修改成功", 1000);
							caList.getPlanListInfo();
						}else{
							$yt_alert_Model.prompt("修改失败", 1000);
						}
					$yt_baseElement.hideLoading();
					}
				});
			}

		})
	},
	//保存默认名单
	saveUser: function(userCodes) {
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/questionnaire/saveDeadlineSendDefaultUser",
			async: true,
			data: {
				userCode: userCodes,
				types: 1,
			},
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt("保存成功", 1000);
				}else{
					$yt_alert_Model.prompt("保存失败", 1000);
				}
				$yt_baseElement.hideLoading();
			}
		});
	},
	//推送
	setUser: function(userCodes) {
		$yt_baseElement.showLoading();
		var projectCode = $('.yt-table-active').find('.projectCode').text();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/questionnaire/saveDeadlineSendDefaultUser",
			async: true,
			data: {
				userCode: userCodes,
				projectCode:projectCode,
				types: 2,
			},
			success: function(data) {
				if(data.flag == 0) {
					//隐藏页面中自定义的表单内容  
					$(".class-room-tye-shuttle-box,#heard-nav-bak").hide();
					//隐藏蒙层  
					$("#pop-modle-alert").hide();
					$yt_alert_Model.prompt("推送成功", 1000);
				}
				$yt_baseElement.hideLoading();
			}
		});
	}

};
$(function() {
	//初始化方法
	caList.init();
});