var claimRecord = {

	//初始化方法
	init: function() {
		claimRecord.getBillListInfo("2");
		
		//模糊查询
		$(".search-btn").click(function() {
			claimRecord.getBillListInfo("2");
		});
		//单击checkbox查询
		$(".check-box-load").on("change", function() {
			var isAdmission = [];
			if($('.check-sure input[type="checkbox"]').is(':checked')) {
				isAdmission.push(1);
			}
			if($('.check-cancel input[type="checkbox"]').is(':checked')) {
				isAdmission.push(0);
			}
			if(isAdmission.length==2){
				isAdmission = '2';
			}else{
				isAdmission = isAdmission.join(',');
			}
			claimRecord.getBillListInfo(isAdmission);
		})
		//流水单查看更多
		$(".bank-more-div").on("click", function() {
			$yt_baseElement.showLoading();
			if($(".bank-more-div").text() == "查看更多") {
				if($(".payment-list").hasClass("hide")) {

				}
				var width = parseInt($("#project-main").css("width"));
				var leftWidth = parseInt($(".bank-table-left").css('width'));
				$("#project-main").css("width", width + 1260 + "px");
				$(".bank-table-left").css("width", leftWidth + 1260 + 'px');
				$(".bank-th-hide").show();
				$(".bank-more-div").text("收起");
				var colspan = $(".bank-tbody-td").attr("colspan");
				$(".bank-tbody-td").attr("colspan", colspan + 11);
			} else {
				var width = parseInt($("#project-main").css("width"));
				var leftWidth = parseInt($(".bank-table-left").css('width'));
				$("#project-main").css("width", width - 1260 + "px");
				$(".bank-table-left").css("width", leftWidth - 1260 + 'px');
				$(".bank-th-hide").hide();
				$(".bank-more-div").text("查看更多");
				var colspan = $(".bank-tbody-td").attr("colspan");
				$(".bank-tbody-td").attr("colspan", colspan - 11);
			}
			$('.page-info').pageInfo('refresh');
			$yt_baseElement.hideLoading();
		});
		//项目详情查看更多按钮
		$(".project-more-div").on("click", function() {
			$yt_baseElement.showLoading();
			if($(".project-more-div").text() == "查看更多") {
				var width = parseInt($("#project-main").css("width"));
				var rightWidth = parseInt($(".bank-table-right").css('width'));
				$("#project-main").css("width", width + 360 + "px");
				$(".bank-table-right").css("width", rightWidth + 360 + 'px');
				$(".project-th-hide").show();
				$(".project-th-righthide").show();
				$(".project-more-div").text("收起");
				var colspan = $(".bank-tbody-td").attr("colspan");
				$(".bank-tbody-td").attr("colspan", colspan + 3);
			} else {
				var width = parseInt($("#project-main").css("width"));
				var rightWidth = parseInt($(".bank-table-right").css('width'));
				$(".bank-table-right").css("width", rightWidth - 360 + 'px');
				$("#project-main").css("width", width - 360 + "px");
				$(".project-th-hide").hide();
				$(".project-th-righthide").hide();
				$(".project-more-div").text("查看更多");
				var colspan = $(".bank-tbody-td").attr("colspan");
				$(".bank-tbody-td").attr("colspan", colspan - 3);
			}
			$('.page-info').pageInfo('refresh');
			$yt_baseElement.hideLoading();
		});
		//确认和未确认复选框
		//复选框
		//全选  
		$(".check-all").change(function() {
			//判断自己是否被选中  
			if($(this).parent().hasClass("check")) {
				//设置反选  
				$(this).parents(".bank-table-left").find("tbody input[type='checkbox']").setCheckBoxState("uncheck");
			} else {
				//调用设置选中方法,全选  
				$(this).parents(".bank-table-left").find("tbody input[type='checkbox']").setCheckBoxState("check");
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
		//认领记录导出
		$(".admission-manual").click(function(){
			var pkId = $yt_common.GetQueryString("pkId");
			var selectParam = $('.selectParam').val();
			var isAdmission = "2";
			if ($('.surecheck input[type=checkbox]:checked').length == 2) {
				isAdmission = "2";
			}else if ($('.surecheck input[type=checkbox]:checked').length == 1) {
				isAdmission = $('.surecheck input[type=checkbox]:checked').val();
			}else{
				isAdmission = "";
			}
			$.ajaxDownloadFile({
				url:$yt_option.base_path+"finance/bankStatement/exportClaimRecordList",
				data:{
					isClaimUser:"1",
					pkId:pkId,
					isAdmission:isAdmission,
					isUserProject:"2",
					selectParam: selectParam
				},
				success: function(data) {
					$yt_alert_Model.prompt(data.message);
				}
			});
		});
	},
	/**
	 * 对账单信息列表
	 */
	getBillListInfo: function(isAdmission) {
		var me = this;
		//		$yt_baseElement.showLoading();
		var selectParam = $('.selectParam').val();
		var pkId = $yt_common.GetQueryString("pkId");
		$('.page-info').pageInfo({
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "finance/bankStatement/getBankStatementDetailsList", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				pkId: pkId,
				selectParam: selectParam,
				isAdmission: isAdmission,
				isClaimUser: "1",
				isUserProject: "2"
			}, //ajax查询访问参数
			before:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				setTimeout($yt_baseElement.hideLoading(), 500);
				if(data.flag == 0) {
					var htmlLeftBody = $('.bank-table-left');
					var htmlRightBody = $('.bank-table-right');
					var htmlLeftTr = '';
					var htmlRightTr = '';
					var repetitionArr = [];
					var ordernum = 0;
					htmlLeftBody.find('tbody').empty();
					htmlRightBody.find('tbody').empty();
					$.each($('table.leftTable'), function(x, y) {
						$(y).remove();
					});
					$.each($('table.rightTable'), function(x, y) {
						$(y).remove();
					});
					$('.num').text(data.data.rows.length);
					if(data.data.rows.length > 0) {
						$.each(data.data.rows, function(i, n) {
							var bool = true;
							//之前出现的判断不让其出现
							for(let j = 0; j < repetitionArr.length; j++) {
								if(i == repetitionArr[j]) {
									bool = false;
								}
							}
							if(bool == false) {
								return true
							}
							ordernum += 1;
							var leftnum = 0;
							var rightnum = 0;
							var rightbool = true;
							htmlLeftBody.append('<table class="leftTable leftTable' + i + '" width="100%"><tbody class="yt-body project-tbody"></tbody></table>')
							htmlRightBody.append('<table class="rightTable rightTable' + i + '" width="100%"><tbody class="yt-body project-tbody"></tbody></table>');
							//右
							$.each(data.data.paymentList, function(k, v) {
								if(n.identification == v.identification) {
									rightbool = false;
									rightnum += 1;
									if(rightnum == 1) {
										htmlRightTr = '<tr class="' + i + '">' +
											//项目销售
											'<td width="190px" class="project-th-righthide payment-list merge-last" style="display: none;text-align:center;">' + '<input class="identification-last" style="display:none;" value="' + v.identification + '">' + v.projectSell + '</td>' +
											//认领时间
											'<td width="90px" class="project-th-righthide payment-list claimDate merge-last" style="display: none;text-align:">' + v.claimDate + '</td>' +
											//项目名称
											'<td width="137px" class="payment-list merge-last" style="text-align:left">' + v.projectName + '</td>' +
											//项目周期
											'<td width="200px" class="payment-list merge-last" style="text-align:center">' + v.projectDate + '</td>' +
											//学员姓名
											'<td width="200px" class="payment-list merge-last" style="text-align:left">' + v.traineeOrGroupName + '</td>' +
											//单位
											'<td width="200px" class="project-th-righthide payment-list merge-last" style="display: none;text-align:left;">' + v.orgName + '</td>' +
											//未收金额
											'<td width="68px" class="payment-list merge-last uncollectedTotal" style="text-align:right;">' + v.uncollectedTotal + '</td>' +
											//对账金额
											'<td width="67px" class="payment-list merge-last reconciliationsTotal rightTd' + i + '" style="text-align:right;">' + v.reconciliationsTotal + '</td>' +
											//入账金额
											'<td width="70px" class="payment-list merge-last admissiontotal rightTd' + i + '" style="text-align:right;">' + v.admissiontotal + '</td>' +
											//差额
											'<td width="90px" class="payment-list merge-last differencetotal rightTd' + i + '" style="text-align:right;">' + v.differencetotal + '</td>' +
											//入账确认
											'<td width="60px" class="payment-list merge-last rightTd' + i + '" style="text-align:center;">' + (claimRecord.confirmFunc(v.reconciliationState)) + '</td>' +
											//入账人
											'<td width="100px" class="payment-list merge-last rightTd' + i + '" style="text-align:center;">' + v.admissionConfirmUser + '</td>' +
											'</tr>';
										$('.rightTable' + i).find('tbody').append(htmlRightTr);
									} else {
										htmlRightTr = '<tr class="' + i + '">' +
											//项目销售
											'<td width="190px" class="project-th-righthide payment-list merge-last" style="display: none;text-align:center;">' + '<input class="identification-last" style="display:none;" value="' + v.identification + '">' + v.projectSell + '</td>' +
											//认领时间
											'<td width="90px" class="project-th-righthide payment-list claimDate merge-last" style="display: none;text-align:center;">' + v.claimDate + '</td>' +
											//项目名称
											'<td width="137px" class="payment-list merge-last" style="text-align:left;">' + v.projectName + '</td>' +
											//项目周期
											'<td width="200px" class="payment-list merge-last" style="text-align:center;">' + v.projectDate + '</td>' +
											//学员姓名
											'<td width="200px" class="payment-list merge-last" style="text-align:left;">' + v.traineeOrGroupName + '</td>' +
											//单位
											'<td width="200px" class="project-th-righthide payment-list merge-last" style="display: none;text-align:left;">' + v.orgName + '</td>' +
											//未收金额
											'<td width="68px" class="payment-list merge-last uncollectedTotal" style="text-align:right;">' + v.uncollectedTotal + '</td>' +
											'</tr>';
										$('.rightTable' + i).find('tbody').append(htmlRightTr);
									}
								}
							});
							//左
							$.each(data.data.rows, function(x, y) {
								if(n.identification == y.identification&&n.identification!='') {
									repetitionArr.push(x);
									leftnum += 1;
									if(leftnum == 1) {
										htmlLeftTr = '<tr class="' + i + '">' +
											'<td width="30px" style="text-align: center;display:none" class="merge leftTd' + i + '">' +
											'<label class="check-label yt-checkbox select-teacher-checkbox"><input type="checkbox" name="test"/></label>' + '</td>' +
											'<td width="41px" class="merge leftTd' + i + '" style = "text-align:center;">' + '<input class="identification-last" style="display:none;" value="' + y.identification + '">' + ordernum + '</td>' +
											//交易时间
											'<td width="90px" class="merge" style = "text-align:center;">' + '<input type="text" name="test" style="display:none" class="pkId" value="' + y.pkId + '"/>' + y.exchangeHour + '</td>' +
											//借方发生额
											'<td width="98px" class="bank-th-hide merge" style="text-align:right;display:none">' + y.draw + '</td>' +
											//贷方发生额
											'<td width="98px" class="merge income" style="text-align:right;">' + y.income + '</td>' +
											//余额
											'<td width="98px" class="bank-th-hide merge" style="text-align:right;display:none">' + y.balance + '</td>' +
											//币种
											'<td width="60px" class="bank-th-hide merge" style="display:none;text-align:center">' + y.currency + '</td>' +
											//对方户名
											'<td style="text-align: left;" width="131px" class="otherPartyName merge">' + y.otherPartyName + '</td>' +
											//对方账户
											'<td width="131px" class="bank-th-hide merge" style="display:none">' + '<input class="identification" style="display:none;" value="' + y.identification + '">' + y.otherPartyAccounts + '</td>' +
											//对方开户机构
											'<td width="131px" class="bank-th-hide merge" style="display:none;text-align: left;">' + y.otherPartyGroup + '</td>' +
											//记账日期
											'<td width="80px" class="bank-th-hide merge" style="display:none;text-align:center">' + y.accountDate + '</td>' +
											//摘要
											'<td width="116px" class="bank-th-hide merge" style="display:none; text-align: left;">' + y.abstractData + '</td>' +
											//备注
											'<td style="text-align: left;" width="116px" class="merge">' + y.remarks + '</td>' +
											//账户明细编号-交易流水号
											'<td width="131px" class="merge" style="">' + y.enterpriseTradeNumber + '</td>' +
											//企业流水号
											'<td width="116px" class="bank-th-hide merge" style="display:none">' + y.voucherType + '</td>' +
											//凭证种类
											'<td width="77px" class="bank-th-hide merge" style="display:none;text-align:center">' + y.voucherNo + '</td>' +
											//凭证号
											'<td width="131px" class="bank-th-hide merge" style="display:none;text-align:center">' + y.associatedAccount + '</td>' +
											//关联账户
											'<td width="131px" class="bank-th-hide merge" style="display:none">' + y.alias + '</td>' +
											//别名
											'<td width="240px" class="bank-th-hide merge" style="display:none">' + y.bankTradeNumber + '</td>' +
											'</tr>';
											htmlLeftTr = $(htmlLeftTr).data('data',y);
										$('.leftTable' + i).find('tbody').append(htmlLeftTr);
									} else{
										htmlLeftTr = '<tr class="' + i + '">' +
											//交易时间
											'<td width="90px" class="merge" style = "text-align:center;">' + '<input type="text" name="test" style="display:none" class="pkId" value="' + y.pkId + '"/>' + y.exchangeHour + '</td>' +
											//借方发生额
											'<td width="98px" class="bank-th-hide merge" style="text-align:right;display:none">' + y.draw + '</td>' +
											//贷方发生额
											'<td width="98px" class="merge income" style="text-align:right;">' + y.income + '</td>' +
											//余额
											'<td width="98px" class="bank-th-hide merge" style="text-align:right;display:none">' + y.balance + '</td>' +
											//币种
											'<td width="60px" class="bank-th-hide merge" style="display:none;text-align:center">' + y.currency + '</td>' +
											//对方户名
											'<td width="131px" class="otherPartyName merge" style = "text-align:left;">' + y.otherPartyName + '</td>' +
											//对方账户
											'<td width="131px" class="bank-th-hide merge" style="display:none">' + '<input class="identification" style="display:none;" value="' + y.identification + '">' + y.otherPartyAccounts + '</td>' +
											//对方开户机构
											'<td width="131px" class="bank-th-hide merge" style="display:none;text-align:left;">' + y.otherPartyGroup + '</td>' +
											//记账日期
											'<td width="80px" class="bank-th-hide merge" style="display:none;text-align:center">' + y.accountDate + '</td>' +
											//摘要
											'<td width="116px" class="bank-th-hide merge" style="display:none;text-align:left;">' + y.abstractData + '</td>' +
											//备注
											'<td style="text-align:left;" width="116px" class="merge">' + y.remarks + '</td>' +
											//账户明细编号-交易流水号
											'<td width="131px" class="merge" style="">' + y.enterpriseTradeNumber + '</td>' +
											//企业流水号
											'<td width="116px" class="bank-th-hide merge" style="display:none">' + y.voucherType + '</td>' +
											//凭证种类
											'<td width="77px" class="bank-th-hide merge" style="display:none;text-align:center">' + y.voucherNo + '</td>' +
											//凭证号
											'<td width="131px" class="bank-th-hide merge" style="display:none;text-align:center">' + y.associatedAccount + '</td>' +
											//关联账户
											'<td width="131px" class="bank-th-hide merge" style="display:none">' + y.alias + '</td>' +
											//别名
											'<td width="240px" class="bank-th-hide merge" style="display:none">' + y.bankTradeNumber + '</td>' +
											'</tr>';
											htmlLeftTr = $(htmlLeftTr).data('data',y);
										$('.leftTable' + i).find('tbody').append(htmlLeftTr);
									}

								}
							});
							if(n.identification==''){
								leftnum=1;
								htmlLeftTr = '<tr class="' + i + '">' +
											'<td width="30px" style="text-align: center;display:none" class="merge leftTd' + i + '">' +
											'<label class="check-label yt-checkbox select-teacher-checkbox"><input type="checkbox" name="test"/></label>' + '</td>' +
											'<td width="41px" class="merge leftTd' + i + '" style = "text-align:center">' + '<input class="identification-last" style="display:none;" value="' + n.identification + '">' + ordernum + '</td>' +
											//交易时间
											'<td width="90px" class="merge" style = "text-align:center">' + '<input type="text" name="test" style="display:none" class="pkId" value="' + n.pkId + '"/>' + n.exchangeHour + '</td>' +
											//借方发生额
											'<td width="98px" class="bank-th-hide merge" style="text-align:right;display:none">' + n.draw + '</td>' +
											//贷方发生额
											'<td width="98px" class="merge income" style="text-align:right">' + n.income + '</td>' +
											//余额
											'<td width="98px" class="bank-th-hide merge" style="text-align:right;display:none">' + n.balance + '</td>' +
											//币种
											'<td width="60px" class="bank-th-hide merge" style="display:none;text-align:center">' + n.currency + '</td>' +
											//对方户名
											'<td style="text-align:left;" width="131px" class="otherPartyName merge">' + n.otherPartyName + '</td>' +
											//对方账户
											'<td width="131px" class="bank-th-hide merge" style="display:none">' + '<input class="identification" style="display:none;" value="' + n.identification + '">' + n.otherPartyAccounts + '</td>' +
											//对方开户机构
											'<td width="131px" class="bank-th-hide merge" style="display:none;text-align:left;">' + n.otherPartyGroup + '</td>' +
											//记账日期
											'<td width="80px" class="bank-th-hide merge" style="display:none;text-align:center">' + n.accountDate + '</td>' +
											//摘要
											'<td width="116px" class="bank-th-hide merge" style="display:none;text-align:left;">' + n.abstractData + '</td>' +
											//备注
											'<td style="text-align:left;" width="116px" class="merge">' + n.remarks + '</td>' +
											//账户明细编号-交易流水号
											'<td width="131px" class="merge">' + n.enterpriseTradeNumber + '</td>' +
											//企业流水号
											'<td width="116px" class="bank-th-hide merge" style="display:none">' + n.voucherType + '</td>' +
											//凭证种类
											'<td width="77px" class="bank-th-hide merge" style="display:none;text-align:center">' + n.voucherNo + '</td>' +
											//凭证号
											'<td width="131px" class="bank-th-hide merge" style="display:none;text-align:center">' + n.associatedAccount + '</td>' +
											//关联账户
											'<td width="131px" class="bank-th-hide merge" style="display:none">' + n.alias + '</td>' +
											//别名
											'<td width="240px" class="bank-th-hide merge" style="display:none;text-align:left;">' + n.bankTradeNumber + '</td>' +
											'</tr>';
											htmlLeftTr = $(htmlLeftTr).data('data',n);
										$('.leftTable' + i).find('tbody').append(htmlLeftTr);
							}
							if(rightbool) {
							htmlRightTr = '<tr class="' + i + '">' +
										//项目销售
										'<td width="190px" class="project-th-righthide payment-list merge-last" style="display: none;text-align:center"><span style="opacity:0">无</span></td>' +
										//认领时间
										'<td width="90px" class="project-th-righthide payment-list claimDate merge-last" style="display: none;text-align:center"><span style="opacity:0">无</span></td>' +
										//项目名称
										'<td width="137px" class="payment-list merge-last" style="text-align:left"><span style="opacity:0">无</span></td>' +
										//项目周期
										'<td width="200px" class="payment-list merge-last" style="text-align:center"><span style="opacity:0">无</span></td>' +
										//学员姓名
										'<td width="200px" class="payment-list merge-last" style="text-align:left"><span style="opacity:0">无</span></td>' +
										//单位
										'<td width="200px" class="project-th-righthide payment-list merge-last" style="display: none;text-align:left"><span style="opacity:0">无</span></td>' +
										//未收金额
										'<td width="68px" class="payment-list merge-last" style="text-align:right;"><span style="opacity:0">无</span></td>' +
										//对账金额
										'<td width="67px" class="payment-list merge-last" style="text-align:right;"><span style="opacity:0">无</span></td>' +
										//入账金额
										'<td width="70px" class="payment-list merge-last" style="text-align:right;"><span style="opacity:0">无</span></td>' +
										//差额
										'<td width="90px" class="payment-list merge-last" style="text-align:right;"><span style="opacity:0">无</span></td>' +
										//入账确认
										'<td width="60px" class="payment-list merge-last" style="text-align:center;"><span style="opacity:0">无</span></td>' +
										//入账人
										'<td width="100px" class="payment-list merge-last" style="text-align:center;"><span style="opacity:0">无</span></td>' +
										'</tr>';
										$('.rightTable' + i).find('tbody').append(htmlRightTr);
									}
							$('.leftTd' + i).attr('rowspan', leftnum);
							$('.rightTd' + i).attr('rowspan', rightnum);
							if($(".bank-more-div").text() == '收起') {
								htmlLeftBody.find('.bank-th-hide').show();
							}
							if($(".project-more-div").text() == '收起') {
								htmlRightBody.find('.project-th-righthide').show();
							}
							var tableHeight = 0;
							$('.leftTable' + i).height() > $('.rightTable' + i).height() ? tableHeight = $('.leftTable' + i).height() : tableHeight = $('.rightTable' + i).height();
							$('.leftTable' + i).height() == $('.rightTable' + i).height() ? tableHeight = $('.leftTable' + i).height() : false;
							$('.leftTable' + i).css('height', tableHeight + 'px');
							$('.rightTable' + i).css('height', tableHeight + 'px');
							var uncollectedTotal=0;
							$.each($(".rightTable" + i).find('.uncollectedTotal'), function(i,n) {
								  uncollectedTotal+= Number($(n).text())
							});
							var income=0;
							$.each($(".leftTable" + i).find('.income'), function(i,n) {
								  income+= Number($(n).text())
							});
							$(".rightTable" + i).find('.reconciliationsTotal').text(uncollectedTotal);
							$(".rightTable" + i).find('.admissiontotal').text(income);
							$(".rightTable" + i).find('.differencetotal').text(income-uncollectedTotal);
						});
					}
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	//入账确认
	confirmFunc: function(confirm) {
		if(confirm == 1) {
			return "已入账";
		} else if(confirm == 0) {
			return "未入账";
		}
	},
	//项目类型设置
	projectTypeInfo: function(code) {
		if(code == 1) {
			return "计划";
		} else if(code == 2) {
			return "委托";
		} else if(code == 3) {
			return "选学";
		} else if(code == 4) {
			return "中组部调训";
		}  else if(code == 5) {
			return "国资委调训";
		}else {
			return '';
		};
	},

}
$(function() {
	//初始化方法
	claimRecord.init();
});