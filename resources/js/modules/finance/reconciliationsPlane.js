/**
 * 飞机票
 */
var planeListInfo = {

	//初始化方法
	init: function() {
		var me = this;
		//初始化列表
		//查询已开票或未开票状态
		planeListInfo.getBillListInfo();
		planeListInfo.getinvalidListInfo();
		//对账单详情
		var totalAmount = $yt_common.GetQueryString("totalAmount");
		var createtimeString = $yt_common.GetQueryString("createtimeString");
		createtimeString = createtimeString.replace(',', ' ')
		var createUser = $yt_common.GetQueryString("createUser");
		createUser = decodeURI(decodeURI(createUser));
		$('#totalAmount').text(totalAmount);
		$('#createtimeString').text(createtimeString);
		$('#createUser').text(createUser);
		//点击未开票与已开票
		$('#checkBox1').change(function() {
			planeListInfo.getBillListInfo();
		});
		$('#checkBox2').change(function() {
			planeListInfo.getBillListInfo();
		});
		//查看更多
		$(".plane-list-table").on('click', ".plane-more-div.more", function() {
			$(".plane-th-hide").show();
			var planeWidth = parseInt($(".plane-list-table").css("width"));
			var projectMainWidth = parseInt($("#project-main").css("min-width"));
			$(".plane-list-table").css("width", planeWidth + 819 + 'px');
			$("#project-main").css("min-width", projectMainWidth + 826 + 'px');
			$(".plane-tbody-td").attr("colspan", "23");
			$(this).addClass('nomore');
			$(this).removeClass('more');
			$(this).text('关闭查看详情');
		})
		//查看更多
		$(".plane-list-table").on('click', ".project-more-div.more", function() {
			$(".project-th-hide").show();
			var planeWidth = parseInt($(".plane-list-table").css("width"));
			var projectMainWidth = parseInt($("#project-main").css("min-width"));
			$(".plane-tbody-td").attr("colspan", "21");
			$(".plane-list-table").css("width", planeWidth + 345 + 'px');
			$("#project-main").css("min-width", projectMainWidth + 352 + 'px');
			$(this).addClass('nomore');
			$(this).removeClass('more');
			$(this).text('关闭查看详情');
		})
		//关闭查看更多
		$(".plane-list-table").on('click', '.plane-more-div.nomore', function() {
			$(".plane-th-hide").hide();
			var planeWidth = parseInt($(".plane-list-table").css("width"));
			var projectMainWidth = parseInt($("#project-main").css("min-width"));
			$(".plane-list-table").css("width", planeWidth - 819 + 'px');
			$("#project-main").css("min-width", projectMainWidth - 826 + 'px');
			$(this).removeClass('nomore');
			$(this).addClass('more');
			$(this).text('查看详情');
		})
		//关闭查看更多
		$(".plane-list-table").on('click', '.project-more-div.nomore', function() {
			$(".project-th-hide").hide();
			var planeWidth = parseInt($(".plane-list-table").css("width"));
			var projectMainWidth = parseInt($("#project-main").css("min-width"));
			$(".plane-list-table").css("width", planeWidth - 345 + 'px');
			$("#project-main").css("min-width", projectMainWidth - 352 + 'px');
			$(this).removeClass('nomore');
			$(this).addClass('more');
			$(this).text('查看详情');
		})
		//返回
		$(".page-return-btn").click(function() {
			window.location.href = "reconciliationsList.html";
		});
		//标记有效
		$('.valid').click(function() {
			var pkId = "";
			var invData=$('.invalid-tbody tr.yt-table-active');
			pkId=invData.attr('pkId');
			if(pkId == '') {
				$yt_alert_Model.prompt("请选择需要标记的信息");
			} else {
				me.effective(pkId, 1);
			}
		})
		//标记无效
		$('.novalid').click(function() {
			var pkId = [];
			console.log("pkId",pkId);
			$.each($('.select-teacher-checkbox.check'), function() {
				pkId.push($(this).parent().siblings('.pkId').text());
			})
			var pkId = pkId.join(',');
			if(pkId == '') {
				$yt_alert_Model.prompt("请选择需要标记的信息");
			} else {
				me.effective(pkId, 0);
			}
		})
		//删除
		$('.deletedata').click(function() {
			//window.location.href = "reconciliationsList.html";
			var pkId = [];
			var bol = true;
			var falseNum = 0;
			$.each($('.select-teacher-checkbox.check'), function(c, z) {
				if($(z).parent().parent().parent().find(".blank-td").next().text() != ""){//该行的的项目名称列不为空，表示该条数据已经被关联
					falseNum++;
					bol = false;
				}
				pkId.push($(z).parent().siblings('.pkId').text());
			})
			var pkIds = pkId.join(',');
			if(pkIds == '') {
				$yt_alert_Model.prompt("请选择需要删除的信息");
			} else {
				var alertMsgText="";
				if(falseNum < 2){
					alertMsgText = "该数据已被关联不可删除!";
				}else{
					alertMsgText = "所选数据中包含已被关联的数据，已被关联数据不可删除!";
				}
				if (bol == false) {//所选中数据有包有关联数据不能删除
					 $yt_alert_Model.alertOne({  
				        haveCloseIcon: true, //是否带有关闭图标  
				        leftBtnName: "关闭", //左侧按钮名称,默认确定  
				        cancelFunction: "", //取消按钮操作方法*/  
				        alertMsg: alertMsgText, //提示信息  
				        cancelFunction: function() { //点击确定按钮执行方法  
				        } 
				    });  
				}else{
					$yt_alert_Model.alertOne({ 
				        leftBtnName: "确定", //左侧按钮名称,默认确定  
				        rightBtnName: "取消", //右侧按钮名称,默认取消  
				        cancelFunction: "", //取消按钮操作方法*/  
				        alertMsg: "数据删除将无法恢复，确认删除吗？", //提示信息  
				        confirmFunction: function() { //点击确定按钮执行方法  
				          me.deleteData(pkIds);
				        },  
    				});  
				}
			}
		})
		//复选框
		//全选  
		$(".check-all").change(function() {
			//判断自己是否被选中  
			if($(this).parent().hasClass("check")) {
				//设置反选  
				$(this).parents("table").find("tbody input[type='checkbox']").setCheckBoxState("uncheck");
			} else {
				//调用设置选中方法,全选  
				$(this).parents("table").find("tbody input[type='checkbox']").setCheckBoxState("check");
			}
		});
		//修改全选按钮状态
		$(".project-tbody,.person-tbody,.company-tbody").on("change", "input[type='checkbox']", function() {
			if($(this).parents("table").find("tbody input[type='checkbox']").length != $(this).parents("table").find("tbody input[type='checkbox']:checked").length) {
				$(this).parents("table").find(".check-all").setCheckBoxState("uncheck");
			} else {
				$(this).parents("table").find(".check-all").setCheckBoxState("check");
			}
		});
		//点击追加导入
		//点击导入按钮
		$('.updata').on('click', function() {

			$(".import-file-name").val("");
			/** 
			 * 显示编辑弹出框和显示顶部隐藏蒙层 
			 */
			$(".reconciliations-import-form").show();
			/** 
			 * 调用算取div显示位置方法 
			 */
			$yt_alert_Model.getDivPosition($(".reconciliations-import-form"));
			/* 
			 * 调用支持拖拽的方法 
			 */
			$yt_model_drag.modelDragEvent($(".reconciliations-import-form .yt-edit-alert-title"));
			/** 
			 * 点击取消方法 
			 */
			$('.reconciliations-import-form .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
				//隐藏页面中自定义的表单内容  
				$(".reconciliations-import-form").hide();
				//隐藏蒙层  
				$("#pop-modle-alert").hide();
			});
		});
		//点击上传附件
		$(".reconciliations-import-form").undelegate().delegate("input[type='file']", "change", function() {
			$('.reconciliations-import-form .import-file-name').val($(this)[0].files[0].name);
		});
		//点击下载模板
		$('.download-template').off().on('click', function() {
				me.downloadModel('机票', 1);
		});
		//点击导入
		$('.upFile').on('click', function() {
			var pkId = $yt_common.GetQueryString("pkId");
			var file = $('.reconciliations-import-form .import-file-name').val();
			var filelast = file.substring(file.lastIndexOf(".") + 1, file.length); //后缀名
			if(filelast == '') {
				$yt_alert_Model.prompt("请选择文件上传");
			}
			if(filelast == 'xlsx' || filelast == 'xls' || filelast == 'xlsm' || filelast == 'xltx' || filelast == 'xltm' || filelast == 'xlsb' || filelast == 'xlam') {
				me.upFile(file, pkId);
				//隐藏页面中自定义的表单内容  
				$(".reconciliations-import-form").hide();
				//隐藏蒙层  
				$("#pop-modle-alert").hide();
			} else {
				$yt_alert_Model.prompt("请选择正确的格式上传");
			}

		});
		//点击导出
		$('.downloadData').on('click', function() {
			if(me.getChecks() == '') {
				$yt_alert_Model.prompt("请选择是否开票");
			} else {
				me.downloadData();
			}

		})
	},
	/**
	 * 多选框
	 */
	getChecks: function() {
		var invoiceStates = [];
		$.each($('.orInvoice').find('.test'), function(i, n) {
			if(n.checked) {
				invoiceStates.push($(n).val());
			}
		});
		if(invoiceStates.length==2) {
			invoiceStates = 2;
		}else{
			invoiceStates = invoiceStates.join(',');
		}
		return invoiceStates;
	},
	/**
	 * 对账单信息列表
	 */
	getBillListInfo: function() {
		var me = this;
		var invoiceStates = me.getChecks();
		var pkId = $yt_common.GetQueryString("pkId");
		$yt_baseElement.showLoading();
		var keyword = $('#keyword').val();
		if(invoiceStates == '') {
			$('.project-tbody').empty();
			$('.project-tbody').append('<tr>' + '<td class="plane-tbody-td" colspan="17" align="center" style="border:0px;">' + '<div class="no-data" style="width: 280px;margin: 0 auto;">' + '<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;"></div></td></tr>');
			$yt_baseElement.hideLoading();
		} else {
			$('.page-info').pageInfo({
				pageIndexs: 1,
				pageNum: 15, //每页显示条数  
				pageSize: 10, //显示...的规律  
				url: $yt_option.base_path + "finance/teacherExpense/getTeacherStatementDetails", //ajax访问路径  
				type: "post", //ajax访问方式 默认 "post"  
				data: {
					pkId: pkId,
					invoiceStates: invoiceStates
				}, //ajax查询访问参数
				objName: 'data', //指获取数据的对象名称  
				before:function(){
					$yt_baseElement.showLoading();
				},
//				after:function(){
//					$(".project-tbody tr").unbind().bind("click", function() {
//						if($(this).find("input[type='checkbox']")[0].checked == true) {
//							$(this).find("input[type='checkbox']").setCheckBoxState("uncheck");
//							$(this).removeClass("yt-table-active");
//						} else {
//							$(this).find("input[type='checkbox']").setCheckBoxState("check");
//							$(this).addClass("yt-table-active");
//						}
//					});
//				},
				success: function(data) {
					if(data.flag == 0) {
						$('.data-info-div').text(data.data.total);
						var htmlTbody = $('.project-tbody');
						var htmlTr = '';
						var htmlRightTr = '';
						var num1 = 0;
						htmlTbody.empty();
						$(".plane-th-hide").hide();
						if(data.data.rows.length > 0) {
							//遍历右侧数据
							$.each(data.data.paymentList, function(j, n) {
								var numb = 0;
								if(n.paymentMethod == 1) {
									n.paymentMethodVal = '支票'
								}else if(n.paymentMethod == 2) {
									n.paymentMethodVal = '电汇'
								}
								else if(n.paymentMethod == 3) {
									n.paymentMethodVal = '归还公务卡'
								}
								else if(n.paymentMethod == 4) {
									n.paymentMethodVal = '现金'
								}
								else if(n.paymentMethod == 5) {
									n.paymentMethodVal = '核销借款'
								} else {
									n.paymentMethodVal = ' '
								}
								if(n.chequeNumber == 0) {
									n.chequeNumberVel = '未开票';
								}
								if(n.chequeNumber == 1) {
									n.chequeNumberVel = '已开票';
								} else {
									n.chequeNumberVel = '';
								}
								n.differencetotal = Number(n.salesPrice) + Number(n.insurance) + Number(n.refundSigningFee);
								//遍历左侧数据
								$.each(data.data.rows, function(i, v) {
									if(v.identification == n.identification) {
										n.differencetotal = (Number(n.differencetotal)-Number(v.totalAmount)).toFixed(2);
										numb += 1;
										if(numb == 1) {
											num1 += 1;
											htmlTr = '<tr>' +
												'<td style="text-align: center;">' +
												'<label class="check-label yt-checkbox select-teacher-checkbox"><input type="checkbox" name="test" class="select-teacher-pkId" value="' + v.pkId + '"/></label>' + '</td>' +
												'<td class="pkId" style="display:none">' + v.pkId + '</td>' +
												'<td>' + num1 + '</td>' +
												'<td>' + v.dateExit + '</td>' +
												'<td class="plane-th-hide " style="display:none">' + v.dateDeparture + '</td>' +
												'<td >' + v.ticketNumber + '</td>' +
												'<td >' + v.passenger + '</td>' +
												'<td >' + v.trip + '</td>' +
												'<td >' + v.trainNumber + '</td>' +
												'<td class="plane-th-hide " style="text-align:right;display:none">' + v.salesPrice + '</td>' +
												'<td class="plane-th-hide " style="text-align:right;display:none">' + v.construction + '</td>' +
												'<td class="plane-th-hide " style="text-align:right;display:none">' + v.taxation + '</td>' +
												'<td class="plane-th-hide " style="text-align:right;display:none">' + v.insurance + '</td>' +
												'<td style="text-align:right;">' + v.totalAmount + '</td>' +
												'<td class="plane-th-hide" style="display:none">' + v.reservations + '</td>' +
												'<td style="border-bottom: 1px #fff solid;border-top: none;background: #FFFFFF;width: 10px;"  class="rows' + j + ' blank-td"></td>' +
												'<td class="rows' + j + '">' + n.projectName + '</td>' +
												'<td class="rows' + j + '">' + n.teacherName + '</td>' +
												'<td class="rows' + j + '">' + n.flighttrainNumber + '</td>' +
												'<td class="project-th-hide rows' + j + '" style="display:none">' + n.placeDeparture + '</td>' +
												'<td class="project-th-hide rows' + j + '" style="display:none">' + n.bourn + '</td>' +
												'<td class="project-th-hide rows' + j + '" style="display:none">' + n.startEndTime + '</td>' +
												'<td class="project-th-hide rows' + j + '" style="display:none;text-align:right;">' + n.salesPrice + '</td>' +
												'<td class="project-th-hide rows' + j + '" style="display:none">' + n.insurance + '</td>' +
												'<td class="project-th-hide rows' + j + '" style="display:none;text-align:right;">' + n.refundSigningFee + '</td>' +
												'<td class="rows' + j + '" style="text-align:right">' + n.paymentMethodVal + '</td>' +
												'<td class="rows' + j + ' differencetotal">' + n.differencetotal + '</td>' +
												'<td class="rows' + j + '">' + n.chequeNumberVel + '</td>' +
												'<td class="rows' + j + '" style="text-align:right">' + n.chequeNumberMoney + '</td>' +
												'</tr>';
											htmlTbody.append(htmlTr);
										} else {
											num1 += 1;
											htmlTr = '<tr>' +
												'<td style="text-align: center;">' +
												'<label class="check-label yt-checkbox select-teacher-checkbox"><input type="checkbox" name="test" class="select-teacher-pkId" value="' + v.pkId + '"/></label>' + '</td>' +
												'<td class="pkId" style="display:none">' + v.pkId + '</td>' +
												'<td>' + num1 + '</td>' +
												'<td>' + v.dateExit + '</td>' +
												'<td class="plane-th-hide " style="display:none">' + v.dateDeparture + '</td>' +
												'<td >' + v.ticketNumber + '</td>' +
												'<td >' + v.passenger + '</td>' +
												'<td >' + v.trip + '</td>' +
												'<td >' + v.trainNumber + '</td>' +
												'<td class="plane-th-hide " style="text-align:right;display:none">' + v.salesPrice + '</td>' +
												'<td class="plane-th-hide " style="text-align:right;display:none">' + v.construction + '</td>' +
												'<td class="plane-th-hide " style="text-align:right;display:none">' + v.taxation + '</td>' +
												'<td class="plane-th-hide " style="text-align:right;display:none">' + v.insurance + '</td>' +
												'<td style="text-align:right;">' + v.totalAmount + '</td>' +
												'<td class="plane-th-hide" style="display:none">' + v.reservations + '</td>' +
												'</tr>';
											htmlTbody.append(htmlTr);
											$('.rows' + j + '.differencetotal').text(n.differencetotal);
										}
									}
								})
								$('.rows' + j).attr('rowspan', numb);
							});
							//遍历左侧数据
							$.each(data.data.rows, function(x, y) {
								var bool = true;
								htmlTr = '';
								$.each(data.data.paymentList, function(a, b) {
									//判断左右侧数据表示是否相同
									if(y.identification == b.identification) {
										bool = false;
									}
								})
								if(bool) {
									num1 += 1
									htmlTr = '<tr>' +
										'<td style="text-align: center;">' +
										'<label class="check-label yt-checkbox select-teacher-checkbox"><input type="checkbox" name="test" class="select-teacher-pkId" value="' + y.pkId + '"/></label>' + '</td>' +
										'<td class="pkId" style="display:none">' + y.pkId + '</td>' +
										'<td>' + num1 + '</td>' +
										'<td>' + y.dateExit + '</td>' +
										'<td class="plane-th-hide " style="display:none">' + y.dateDeparture + '</td>' +
										'<td >' + y.ticketNumber + '</td>' +
										'<td >' + y.passenger + '</td>' +
										'<td >' + y.trip + '</td>' +
										'<td >' + y.trainNumber + '</td>' +
										'<td class="plane-th-hide " style="text-align:right;display:none">' + y.salesPrice + '</td>' +
										'<td class="plane-th-hide " style="text-align:right;display:none">' + y.construction + '</td>' +
										'<td class="plane-th-hide " style="text-align:right;display:none">' + y.taxation + '</td>' +
										'<td class="plane-th-hide " style="text-align:right;display:none">' + y.insurance + '</td>' +
										'<td style="text-align:right;">' + y.totalAmount + '</td>' +
										'<td class="plane-th-hide" style="display:none">' + y.reservations + '</td>' +
										'<td class="blank-td" style="border-bottom: 1px #fff solid;border-top: none;background: #FFFFFF;width: 10px;"></td>' +
										'<td></td>' +
										'<td></td>' +
										'<td></td>' +
										'<td class="project-th-hide" style="display:none"></td>' +
										'<td class="project-th-hide" style="display:none"></td>' +
										'<td class="project-th-hide" style="display:none"></td>' +
										'<td class="project-th-hide" style="display:none;text-align:right;"></td>' +
										'<td class="project-th-hide" style="display:none"></td>' +
										'<td class="project-th-hide" style="display:none;text-align:right;"></td>' +
										'<td  style="text-align:right"></td>' +
										'<td></td>' +
										'<td></td>' +
										'<td style="text-align:right"></td>' +
										'</tr>';
								}
								htmlTbody.append(htmlTr);
							})
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
		}
	},
	/**
	 * 无效流水单信息列表
	 */
	getinvalidListInfo: function() {
		$yt_baseElement.showLoading();
		var pkId = $yt_common.GetQueryString("pkId");
		var keyword = $('#keyword').val();
		$.ajax({
			url: $yt_option.base_path + "finance/teacherExpense/getTeacherNoStatementDetails", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				pkId: pkId,
				types: 1,
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.invalid-tbody');
					var htmlTr = '';
					htmlTbody.empty();
					if(data.data != '') {
						if(data.data.length > 0) {
							$.each(data.data, function(i, v) {
								htmlTr = '<tr pkId="'+v.pkId+'">' +
									'<td>' + v.dateExit + '</td>' +
									'<td>' + v.dateDeparture + '</td>' +
									'<td>' + v.ticketNumber + '</td>' +
									'<td>' + v.passenger + '</td>' +
									'<td>' + v.trip + '</td>' +
									'<td>' + v.trainNumber + '</td>' +
									'<td style="text-align:right">' + v.salesPrice + '</td>' +
									'<td style="text-align:right">' + v.construction + '</td>' +
									'<td style="text-align:right">' + v.taxation + '</td>' +
									'<td style="text-align:right">' + v.insurance + '</td>' +
									'<td style="text-align:right">' + v.totalAmount + '</td>' +
									'<td>' + v.reservations + '</td>' +
									'</tr>';
								htmlTbody.append(htmlTr);
							});
							 $('.invalid-tbody tr').unbind().bind('click',function(){
							 	$(this).addClass('yt-table-active').siblings().removeClass('yt-table-active');
							 });
						}
					}else{
						htmlTr='<tr>'+
								'<td colspan="12" align="center" style="border:0px;">'+
									'<div class="no-data" style="width: 280px;margin: 0 auto;">'+
										'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">'+
									'</div>'+
								'</td>'+
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
	},
	effective: function(pkId, isEffective) {
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/teacherExpense/updateEffective",
			async: true,
			data: {
				pkIds: pkId,
				isEffective: isEffective
			},
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt("标记成功");
					planeListInfo.getBillListInfo();
					planeListInfo.getinvalidListInfo();
				}else{
					$yt_alert_Model.prompt("标记失败");
				}
			}
		});
	},
	//下载模板
	downloadModel: function(fileName, types) {
		$.ajaxDownloadFile({
				url:$yt_option.base_path + "finance/teacherExpense/downloadTeacherExpense",
				data:{
					fileName:fileName,
					types: types
				}
			});
	},
	//导入
	upFile: function(file, pkId) {
		$yt_baseElement.showLoading();
		$.ajaxFileUpload({
			type: "post",
			url:$yt_option.base_path + "finance/teacherExpense/importTeacherBankFlow",
				data:{
					types: 1,
					pkId: pkId,
					file:file
				},
			dataType: 'json',
			fileElementId: 'fileName',
			success: function(data) {
				if(data.flag == 0) {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("导入成功");
						me.getBillListInfo();
					});
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt(data.message);
					});
				}
			},
			error:function(){
				$yt_baseElement.hideLoading(function() {
					$yt_alert_Model.prompt("网络异常");
				});
			}
		});
	},
	//删除
	deleteData: function(pkId) {//
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/teacherExpense/removeBeanByDetailsId",
			async: true,
			data: {
				pkIds: pkId,
			},
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt("删除成功");
					planeListInfo.getBillListInfo();
				} else {
					$yt_alert_Model.prompt("删除失败");
				}
			}
		});
	},
	downloadData: function() {
		var me = this;
		var invoiceStates = me.getChecks();
		var pkId = $yt_common.GetQueryString("pkId");
		$.ajaxDownloadFile({
			url:$yt_option.base_path+"finance/teacherExpense/downloadTeacherStatementDetails",
			data:{
				pkId: pkId,
				invoiceStates: invoiceStates
			},
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt(data.message);
				} else {
					$yt_alert_Model.prompt(data.message);
				}
			}
		});
	}
}
$(function() {
	//初始化方法
	planeListInfo.init();
});