var caList = {
	ue: null,
	//初始化方法
	init: function() {
		//初始化新增页面
		caList.clearAlertBox();
		//班级列表
		caList.getClassLis();
		//初始化下拉列表
		$('#types').niceSelect();
		$('#where').niceSelect();
		caList.deleteInfo();
		if($("#types").val() == 1) {
			$('#reimbursementTitle').text('新增教师课酬报销')
		} else if($("#types").val() == 2) {
			$('#reimbursementTitle').text('新增教师差旅报销')
		}
		//选择新增类型跳转
		$("#types").change(function() {
			if($("#types").val() == 1) {
				$('#reimbursementTitle').text('新增教师课酬报销');

				$yt_baseElement.showLoading();
				setTimeout(window.location.href = 'reimbursementAdd.html', 500);
				setTimeout($yt_baseElement.hideLoading(), 500);

			} else if($("#types").val() == 2) {
				$('#reimbursementTitle').text('新增教师差旅报销');

				$yt_baseElement.showLoading();
				setTimeout(window.location.href = 'travelAdd.html', 500);
				setTimeout($yt_baseElement.hideLoading(), 500);
			}
		})
		//初始化创建时间
		$("#issueDayeString").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			lowerLimit: "2010/01/01", // 日期下限，默认：NaN(不限制)     
			nowData: true, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd HH:mm",
			callback: function() {} // 点击选择日期后的回调函数  
		});
		//下一步操作人
		var nextPersonList = caList.getNextOperatePerson();
		if(nextPersonList != null) {
			$.each(nextPersonList, function(i, n) {
				$("#dealingWithPeople").append($('<option value="' + n.userCode + '">' + n.userName + '</option>').data("classData", n));
			});
		};
		//修改页面
		
		var pkId = $yt_common.GetQueryString("pkId");
		if(pkId!=null){
			caList.getListUpdate(pkId);
		}
		//初始化下一步操作人下拉框
		$("#dealingWithPeople").niceSelect();

		//点击返回
		$('.page-return-btn').off().on("click", function() {
			//调用返回指定页面函数
			caList.backNewsListPage();
		});

		//点击取消
		$('#cancel').off().on("click", function() {
			//调用返回指定页面函数
			caList.backNewsListPage();
		});

		//点击保存
		$('#save').off('click').on('click', function() {
			if($('#projectCode').val()!=""){
//				if(Number($yt_baseElement.rmoney($('#projectUsermoney').text()))<Number($yt_baseElement.rmoney($('#expenseMoneySum').text()))){
//					$yt_alert_Model.prompt('项目剩余预算不足，请申请预算变更');
//					return false;
//				}
				//调用判空函数
				caList.isNoNull(1);
			}else{
				$yt_alert_Model.prompt("请选择班级");
			}
		});
		//点击提交
		$('#submit').off('click').on('click', function() {
			if($('#projectCode').val()!=""){
				if(Number($yt_baseElement.rmoney($('#projectUsermoney').text()))<Number($yt_baseElement.rmoney($('#expenseMoneySum').text()))){
					$yt_alert_Model.prompt('项目剩余预算不足，请申请预算变更');
					return false;
				}
				var bool = true;
				$.each($('.rows'), function(i,n) {
					var data = $(n).data('data')
					if(data.papersNumber==''||data.registeredBank==''||data.account==''||data.papersType==''){
						    $yt_alert_Model.alertOne({  
						        haveCloseIcon: true, //是否带有关闭图标  
						        leftBtnName: "确定", //左侧按钮名称,默认确定  
						        cancelFunction: "", //取消按钮操作方法*/  
						        alertMsg: "证件类型、证件号、开户行、账号不能为空，请将信息补全后再次提交", //提示信息  
						    });  
						    bool =false;
						    return false;
					}
				});
				if(bool){
					var teacherIds=[]
					$.each($('.rows'), function(j,k) {
						teacherIds.push($(k).data('data').teacherId);
					});
					teacherIds = teacherIds.join(',');
					var bb  = true;
					if(teacherIds!=''){
						bb = caList.remuneration(teacherIds);
					}
					//课酬审批全部完成才能提交
					if(bb){
						//调用判空函数
						caList.isNoNull(2);
					}
					
				}
			}else{
				$yt_alert_Model.prompt("请选择班级");
			}
		});

	},
	//返回新闻稿列表
	backNewsListPage: function() {
		window.location.href = "reimbursementList.html";
	},

	/**
	 * 获取所有班级
	 */
	getClassLis: function() {
		var projectCode = $yt_common.GetQueryString("projectCode");
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/reduction/lookForAllProject",
			data: {
				projectCode:projectCode,
				selectParam:''
			},
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			async: true,
			success: function(data) {
				$('#createUser').text($yt_common.user_info.userRealName);
				if(data.flag==0){
					var userName = caList.userInfo();
					var projectHeadCode;
					var classTeacherCode;
					var projectSellCode;
					var projectAidCode;
					//班级列表下拉框
					$.each(data.data, function(i, n) {
						//项目主任code
						projectHeadCode = n.projectHeadCode;
						//班主任code
						classTeacherCode = n.classTeacherCode;
						//项目销售code
						projectSellCode = n.projectSellCode;
						//项目助理code
						projectAidCode = n.projectAidCode;
						if(projectHeadCode.indexOf(userName) != -1 || classTeacherCode.indexOf(userName) != -1 || projectSellCode.indexOf(userName) != -1 || projectHeadCode.indexOf(userName) != -1 || projectAidCode.indexOf(userName) != -1){
							$("#projectCode").append($('<option value="' + n.projectCode + '">' + n.projectName + '</option>').data("classData", n));
						}
					});
					$("select.user-name-sel").niceSelect({  
				        search: true,  
				        backFunction: function(text) {  
				            //回调方法,可以执行模糊查询,也可自行添加操作  
				            $("select.user-name-sel option").remove();  
				            if(text == "") {  
				                $("select.user-name-sel").append('<option value="">请选择</option>');  
				            }  
				            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
				            $.each(data.data, function(i, n) {  
				            	//项目主任code
								projectHeadCode = n.projectHeadCode;
								//班主任code
								classTeacherCode = n.classTeacherCode;
								//项目销售code
								projectSellCode = n.projectSellCode;
								//项目助理code
								projectAidCode = n.projectAidCode;
								if(n.projectName.indexOf(text) != -1) {  
									if(projectHeadCode.indexOf(userName) != -1 || classTeacherCode.indexOf(userName) != -1 || projectSellCode.indexOf(userName) != -1 || projectHeadCode.indexOf(userName) != -1 || projectAidCode.indexOf(userName) != -1){
										$("#projectCode").append($('<option value="' + n.projectCode + '">' + n.projectName + '</option>').data("classData", n));
									}
								}
				            });  
				        }  
				    });  
				    if(projectCode!=null){
				    	if(projectCode!=''){
							$("#projectUsermoney").text(data.data[0].projectSurplusBudget);
							$('#endDate').text(data.data[0].endDate);
							$('#startDate').text(data.data[0].startDate);
				    	}
				    }
					//选择班级获取项目主任名
					$('#projectCode').off('click').on('change', function() {
						var projectUserName = $('#projectCode option:selected').data("classData").projectHead;
						projectUserName==null?projectUserName='':projectUserName=projectUserName;
						$("#projectUsermoney").text($('#projectCode option:selected').data('classData').projectSurplusBudget);
						$('#projectUserName').text(projectUserName);
						$('#startDate').text($('#projectCode option:selected').data('classData').startDate);
						$('#endDate').text($('#projectCode option:selected').data('classData').endDate);
						var projectCode = $('#projectCode option:selected').data("classData").projectCode;
						caList.getListAdd(projectCode);
					});	
				}else{
					$yt_alert_Model.prompt("查询失败");
				}
				$yt_baseElement.hideLoading();
			},
			error:function(){
				$yt_baseElement.hideLoading();
				$yt_alert_Model.prompt("网络异常，请稍后重试");
			}
		});
	},
	//获取登录人信息
	userInfo: function() {
		var userName = "";
		$.ajax({
			async: false,
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "uniform/user/getUsersDetails", //ajax访问路径  
			data: {}, //ajax查询访问参数
			success: function(data) {
				userName = data.data.userName;
			}
		});
		return userName;
	},
	
	//点击保存，提交判断页面中数据是否为空
	isNoNull: function(dataStates) {
		var testSelect = $("#types").val();
		var className = $('#projectCode option:selected').val();
		var dealingWithPeople = $('#dealingWithPeople').val();
		$yt_valid.validForm($("#valid-tab"));
		if(testSelect == '' || className == '' || dealingWithPeople == '') {
			//框架判空函数
			$yt_valid.validForm($(".valid-tab"));
		} else {
			//调用提交，保存函数
			caList.addnewsInfo(dataStates);
		}

	},
	//点击保存，提交判断页面中数据是否为空
	/*isNoNull:function(dataStates){
		$yt_valid.validForm($("#valid-tab"));
		if(title=="" || details==""){
			$yt_valid.validForm($(".valid-tab"));
		}else{
			caList.addnewsInfo(dataStates);
		}
		
	},*/
	/**
	 * 获下一步操作人
	 */
	getNextOperatePerson: function() {
		var user = null;
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/workFlowOperate/getSubmitPageData",
			data: {
				businessCode: "classExpense",
				types: '1'
			},
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					$.each(data.data, function(i, n) {
						for(var k in n) {
							user = n[k];
						}
					});

				}
			}
		});
		return user;
	},
	//点击新增清空弹窗内容
	clearAlertBox: function() {
		$('#projectCode').val("");
		$('#projectUserName').val("");
		$('#types').val("");
		$('#dealingWithPeople').val("");
	},

	getList: [],
	//修改
	getListUpdate: function(pkId) {
		me = this;
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/teacherExpense/getBeanByIdClassExpense",
			async: true,
			data: {
				pkId: pkId
			},
			success: function(data) {
				if(data.flag == 0) {
					$("select.type-select").setSelectVal(data.data.expenseType);
					$("select.user-name-sel").setSelectVal(data.data.projectCode);
					//var projectUserName = $('#projectCode option:selected').data("classData").projectUserName;
					//var createUser = $('#projectCode option:selected').data("classData").createUser;
					$('#projectUserName').text(data.data.projectHead);
					$('#createUser').text(data.data.createUser);
					$('.details').text(data.data.remarks);
					//var projectCode = $('#projectCode option:selected').data("classData").projectCode;
					//console.log(projectCode);
					me.getListAdd(data.data.projectCode);
					$('#reimbursementTitle').text('修改教师课酬报销')
			}}
		})
	},
	//列表
	getListAdd: function(projectCode) {
		var me = this;
		var pkId = $yt_common.GetQueryString("pkId");
		pkId == null ? pkId='':pkId=pkId;
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/teacherExpense/getTeacherClassExpenseDetails",
			async: true,
			data: {
				projectCode: projectCode,
				pkId:pkId
			},
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag == 0) {
					me.getList = data.data;
					var htmlTbody = $('.class-tbody');
					var twoTbody = $('#two-table').empty();
					var htmlTr = '';
					var twoTr = '';
					htmlTbody.empty();
					if(data.data.length > 0) {
						var afterTaxSum = 0;
						var surrenderPersonalSum = 0;
						var expenseMoneySum = 0;
						var num = 0;
						$.each(data.data, function(i, v) {
							//证件类型 1:身份证 2:护照 3:军官证 4:其他
							var papersType = v.papersType;
							if(papersType == 1) {
								papersType = '身份证';
							}
							else if(papersType == 2) {
								papersType = '护照';
							}
							else if(papersType == 3) {
								papersType = '港澳通行证';
							}
							else if(papersType == 4) {
								papersType = '军官证';
							}else if(papersType == 5){
								papersType = '其他';
							}else{
								papersType='';
							}
							var courseDateJson = v.courseDateJson;
							var lengthJson = courseDateJson.length;
							num = i + 1;
							var jsonTd = '';
							afterTaxSum += v.afterTax;
							surrenderPersonalSum += v.surrenderPersonal;
							expenseMoneySum += v.expenseMoney;
							$.each(courseDateJson, function(index, value) {
								if(index == 0) {
									htmlTr = '<tr  class="rows tr' + i + index + ' row' + i + '">' +
										'<td rowspan="' + lengthJson + '"  class="teacherId" style="display:none;">' + v.teacherId + '</td>' +
										'<td rowspan="' + lengthJson + '" style="text-align:center" class="num">' + num + '</td>' +
										'<td rowspan="' + lengthJson + '" style="text-align:center"><a class="teacherName" style="color:#2080bf">' + v.teacherName + '</a></td>' +
										'<td rowspan="' + lengthJson + '" style="text-align:center">' + papersType + '</td>' +
										'<td rowspan="' + lengthJson + '">' + v.papersNumber + '</td>' +
										'<td rowspan="' + lengthJson + '">' + v.registeredBank + '</td>' +
										'<td rowspan="' + lengthJson + '">' + v.account + '</td>' + '<td style="text-align:center" class="courseDate">' + value.courseDate + '</td>' +
										'<td rowspan="' + lengthJson + '" style="text-align:right" class="expenseMoney">' + $yt_baseElement.fmMoney(v.expenseMoney,2) + '</td>' +
										'<td rowspan="' + lengthJson + '" style="text-align:right" class="surrenderPersonal">' + $yt_baseElement.fmMoney(v.surrenderPersonal,2) + '</td>' +
										'<td rowspan="' + lengthJson + '" class="afterTax"><input type="text" class="moneyInput yt-input" value="' + $yt_baseElement.fmMoney(v.afterTax,2) + '" readonly="readonly" style="font-size:12px;width:100%;border:none;background:none;text-align:right"/></td>' +
										'<td style="text-align:center"><a class="delete-tb" style="color:red;">删除</a><span> </span><a class="update-tb">编辑</a></td>' +
										'</tr>';
										v.num = i;
										htmlTr = $(htmlTr).data('data',v);
										htmlTbody.append(htmlTr);
								} else {
									htmlTr = '<tr class="tr' + i + index + ' row' + i + '"><td style="text-align:center" class="courseDate">' + value.courseDate + '</td>' +
										'<td style="text-align:center"><a class="delete-tb" style="color:red;">删除</a><span> </span><a class="update-tb">编辑</a></td>' +
										'</tr>';
										htmlTbody.append(htmlTr);
								}
								$(".tr" + i + index).find('.courseDate').data('courseDateJson', value);
							});
						$('.teacherName').off('click').on('click',function(){
							window.frames["teacherName"].location.href = '../teacherCourse/teacherApprovalInf.html?pkId='+$(this).parents('tr').find('.courseDate').data('courseDateJson').teacherId;
							$('#teacherName').show();
							var iframesTop = $('#teacherName').offset().top;
							$(document).scrollTop(iframesTop);
							$('body').css('overflow','hidden');
						})
						});
						var numb = num + 1;
						htmlTr = '<tr><td class="numb" style="display:none;">' + numb + '</td><td colspan="7" style="text-align:center">合计</td>' +
							'<td id="expenseMoneySum" style="text-align:right;font-weight:bold">' + $yt_baseElement.fmMoney(expenseMoneySum,2) + '</td>' +
							'<td id="surrenderPersonalSum" style="text-align:right;font-weight:bold">' + $yt_baseElement.fmMoney(surrenderPersonalSum,2) + '</td>' +
							'<td class="afterTaxSumNum"  style="text-align:right;font-weight:bold">' + $yt_baseElement.fmMoney(afterTaxSum,2) + '</td><td></td>' +
							'</tr>';
						htmlTbody.append(htmlTr);
					} else {
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="11" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						htmlTbody.html(htmlTr);
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
	},
	//点击保存或提交
	addnewsInfo: function(dataStates) {
		var me = this;
		$yt_baseElement.showLoading();
		var pkId = $yt_common.GetQueryString("pkId");
		var processInstanceId = "";
		if(pkId!=null){
			$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/teacherExpense/getBeanByIdClassExpense",
			async: false,
			data: {
				pkId: pkId
			},
			success: function(data) {
				if(data.flag == 0) {
						processInstanceId = data.data.processInstanceId;
				}
			}
		});
		}
		var teacherDetails = [];
		$.each($('.rows'), function(x, y) {
			var json = {
				teacherId: $(y).children('.teacherId').text(),
				afterTax: $yt_baseElement.rmoney($(y).children('.afterTax').children('.moneyInput').val()),
				papersType:$(y).data('data').papersType,
				papersNumber:$(y).data('data').papersNumber,
				registeredBank:$(y).data('data').registeredBank,
				account:$(y).data('data').account
			}
			teacherDetails.push(json);
		});
		teacherDetails = JSON.stringify(teacherDetails);
		var expenseClassDetails = [];
		$.each($('.courseDate'), function(a, b) {
			expenseClassDetails.push($(b).data('courseDateJson'));
		});
		if(me.deleteData != '') {
			expenseClassDetails = expenseClassDetails.concat(me.deleteData);
		}
		expenseClassDetails = JSON.stringify(expenseClassDetails)
		
		var projectCode = $('#projectCode').val();
		var expenseType = $("#types").val();
		var dealingWithPeople = $('#dealingWithPeople').val();
		var details = $('.details').val();
		var teacherCount = $('.num').length;
		var expenseMoney = $yt_baseElement.rmoney($('.class-tbody').find('.afterTaxSumNum').text());
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/teacherExpense/addOrUpdateBeanClassExpense",
			data: {
				//报销的详细数据
				expenseClassDetails: expenseClassDetails,
				//教师税后金额
				teacherDetails: teacherDetails,
				//新增可以为空，修改不能为空
				pkId: pkId,
				//班级编号
				projectCode: projectCode,
				//报销类型
				expenseType: expenseType,
				//教师数量
				teacherCount: teacherCount,
				//报销金额(税后金额)
				expenseMoney: expenseMoney,
				//流程定义
				businessCode: "classExpense",
				//下一步操作人
				dealingWithPeople: dealingWithPeople,
				//提交，或保存
				dataStates: dataStates,
				//流程id
				processInstanceId:processInstanceId,
				//备注
				remarks: details,
				//操作流程代码   不能为空
				nextCode: "submited",
				deptBudget:1
			},
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt("添加成功");
					$(".yt-edit-alert,#heard-nav-bak").hide();

				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("提交失败");
					});
				}
				caList.backNewsListPage();
			}
		});
	},
	deleteData: [],
	//编辑与删除
	deleteInfo: function() {
		var me = this;
		//删除
		$('.list-box').on('click', '.delete-tb', function() {
			var that = this;
			 $yt_alert_Model.alertOne({  
		        alertMsg: "确认该数据删除吗？", //提示信息  
		        confirmFunction: function() {
		        	var course = $(that).parent().siblings(".courseDate").data("courseDateJson");
					course.isEffective = '0';
					me.deleteData.push(course);
					if($(that).parents('tr').children('td').attr('rowspan') == undefined) {
						var trclass = $(that).parent().parent()[0].className.split(' ')[1];
		
						for(let j = 0; j < $("." + trclass + '.rows').find('td').length; j++) {
							if($("." + trclass + '.rows').find('td').eq(j).attr('rowspan') != undefined) {
								var rowspan = $("." + trclass + '.rows').find('td').eq(j).attr('rowspan');
								$("." + trclass + '.rows').find('td').eq(j).attr('rowspan', rowspan - 1);
							}
						}
						$(that).parent().parent().remove();
					} else {
						if($(that).parent().parent().children('td').attr('rowspan') == 1) {
							//附表删除
							if($(that).parents('tr').data('data')!=undefined){
							//附表删除
								$('#two-table').find('.twoTr'+$(that).parents('tr').data('data').num).remove();
							}
							$(that).parent().parent().remove();
							$.each($('.num'), function(i,n) {
								$(n).text(i+1);
								$('.twonum').eq(i).text(i+1);
							});
							me.allmoney();
						} else {
		
							for(let k = 0; k < $(that).parent().parent().find('td').length; k++) {
								if($(that).parent().parent().find('td').eq(k).attr('rowspan') != undefined) {
									var rowspan = $(that).parent().parent().find('td').eq(k).attr('rowspan');
									$(that).parent().parent().find('td').eq(k).attr('rowspan', rowspan - 1);
								}
							}
							$(that).parent().parent().children('.courseDate').text($(that).parent().parent().next().children('.courseDate').text());
							$(that).parent().parent().children('.courseDate').data("courseDateJson", $(that).parent().parent().next().children('.courseDate').data("courseDateJson"));
							$(that).parent().parent().next().remove();
						}
					}
					//主表数据为空时
					if($('.class-tbody').find('tr').length==1){
						var tr = '<tr style="border:0px;background-color:#fff !important;" >' +
									'<td colspan="11" align="center" style="border:0px;">' +
									'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
									'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
									'</div>' +
									'</td>' +
									'</tr>';
								$('.class-tbody').html(tr);
					}
					//附表数据为空时
					if($('#two-table').find('tr').length==0){
						var tr = '<tr style="border:0px;background-color:#fff !important;" >' +
								'<td colspan="11" align="center" style="border:0px;">' +
								'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
								'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
								'</div>' +
								'</td>' +
								'</tr>';
							$('#two-table').append(tr);
					}
		        },
		  
		    }); 
			
		});
		//编辑
		$('.list-box').on('click', '.update-tb', function() {
			$('.list-box input').removeAttr('readonly');
			$('.list-box input').css('border', '1px solid #e6e6e6');
			$(this).addClass('yes');
			$(this).text('确定');
		})
		$('.list-box').on('click', '.yes', function() {
			$('.list-box input').attr('readonly', 'readonly');
			$('.list-box input').css('border', 'none');
			$('.yes').text('编辑');
			$('.yes').removeClass('yes');
			me.allmoney();
		})
	},
	allmoney: function() {
		var allmoney = 0;
		var surrenderPersonalSum = 0;
		var expenseMoneySum = 0;
		$.each($('.moneyInput'), function(i, n) {
//			if($(n).val() != '0') {
//				$(n).val($(n).val().replace(/\b(0+)/gi, ""));
//			}
//			$(n).val()=='.'?$(n).val(0):$(n).val($(n).val())
			$(n).val($yt_baseElement.fmMoney($(n).val(),2))
			allmoney += $yt_baseElement.rmoney($(n).val());
		});
		$.each($('.surrenderPersonal'), function(i, n) {
			surrenderPersonalSum += $yt_baseElement.rmoney($(n).text());
		});
		$.each($('.expenseMoney'), function(i, n) {
			expenseMoneySum += $yt_baseElement.rmoney($(n).text());
		});
		//税后总金额
		$('.afterTaxSumNum').text($yt_baseElement.fmMoney(allmoney,2));
		//代缴个税总额
		$('#surrenderPersonalSum').text($yt_baseElement.fmMoney(surrenderPersonalSum,2));
		//报销金额
		$('#expenseMoneySum').text($yt_baseElement.fmMoney(expenseMoneySum,2));
	},
	//计算个税
	getSurrender:function(afterTax,where){
		$.ajax({
			type:"post",
			url:$yt_option.base_path + "finance/teacherExpense/getSurrenderPersonal",
			async:false,
			data:{
				afterTax:afterTax	
			},
			success:function(data){
				$(where).text($yt_baseElement.fmMoney(data.data,2))
			},
			error:function(data){
				$yt_alert_Model.prompt('网络异常,计算失败');
			}
		});
	},
	//查询课酬是否完成审批
	remuneration:function(teacherIds){
		var bool 
		$.ajax({
			type:"post",
			url:$yt_option.base_path+"finance/teacherExpense/getTeacherRemunerationFinished",
			async:false,
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			data:{
				teacherIds:teacherIds
			},
			success:function(data){
				$yt_baseElement.hideLoading();
				if(data.flag==0){
					bool = true;
				}else if(data.flag==2){
					bool = false;
					 $yt_alert_Model.alertOne({  
						        haveCloseIcon: true, //是否带有关闭图标  
						        leftBtnName: "确定", //左侧按钮名称,默认确定  
						        cancelFunction: "", //取消按钮操作方法*/  
						        alertMsg: data.data+'等教师课酬正在审批不允许提交', //提示信息  
						    });  
				}
			},
			error:function(){
				$yt_baseElement.hideLoading();
			}
		});
		return bool;
	}
};
$(function() {
	//初始化方法
	caList.init();
	$('.list-box').on('focus', '.moneyInput',function(){
		$(this).val($yt_baseElement.rmoney($(this).val()))
	})
	//修改税后金额格式，只能输入数字
	$('.list-box').on('keyup', '.moneyInput', function() {
		if($(this).val() == '') {
			$(this).val('0');
		}
		$(this).val($(this).val().replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g, ''));
	})
		$('.list-box').on('blur', '.moneyInput', function() {
		if($(this).val() == '') {
			$(this).val('0');
		}
		//计算个税
		caList.getSurrender($yt_baseElement.rmoney($(this).val()),$(this).parent().siblings('.surrenderPersonal'));
		var surrenderPersonal = $(this).parent().siblings('.surrenderPersonal').text();
		var num = $yt_baseElement.rmoney($(this).val())+$yt_baseElement.rmoney(surrenderPersonal)
		$(this).parent().siblings('.expenseMoney').text($yt_baseElement.fmMoney(num,2));
		//附表
		$(this).val($(this).val().replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g, ''));
		caList.allmoney();
	})
});