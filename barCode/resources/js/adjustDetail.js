(function($, window) {
	var serveExamine = {
		processInstanceId:'',//流程日志id
		appId:'',//申请变革id
		advanceCostType:'',//costType类型
		/**
		 * 开始执行
		 */
		init: function() {
			var ts = this;
			//加载区域页面
			barCodeObj.loadingWord('view/system/expensesReim/module/busiTripApply/serveTrainApproval.html');
			serveExamine.appId = barCodeObj.GetQueryString('appId');
			ts.getAdvanceUpdateAppInfoDetailByAdvanceAppId();
			ts.events();
		},
		/**
		 * 事件处理
		 */
		events: function() {
			var me = this;
			//关闭按钮事件
			$("#clearBtn").off().on("click", function() {
				window.close();
			});
			//打印按钮操作事件
			$("#printAdjust").click(function(){
				var pageUrl = "view/system/expensesReim/module/print/bugetAdjustApplyForm.html?expenditureAppId="+serveExamine.appId+ '&costType='+serveExamine.advanceCostType;//即将跳转的页面路径
				//调用公用的打开新页面方法传输参数不需要左侧菜单
				$yt_baseElement.openNewPage(2,pageUrl);
			});
			//审批
			$("#adjustEdit").click(function(){
				var pageUrl = "view/system/expensesReim/module/busiTripApply/projectServeExamine.html?appId=" + serveExamine.appId; //即将跳转的页面路径
				window.location.href = $yt_option.websit_path + pageUrl;
			});
			//补领/返还方式 合计金额
			$('.amount-table .money-input').blur(function() {
				var body = $('.payment-detail .amount-table');
				//公务卡
				var official = Number($yt_baseElement.rmoney(body.find('.official').val() || '0'));
				//现金
				var cash = Number($yt_baseElement.rmoney(body.find('.cash').val() || '0'));
				//支票
				var cheque = Number($yt_baseElement.rmoney(body.find('.cheque').val() || '0'));
				//转账
				var transfer = Number($yt_baseElement.rmoney(body.find('.transfer').val() || '0'));
				//计算合计金额
				var total = official + cash + cheque + transfer;
				//赋值合计金额
				body.find('.total').text($yt_baseElement.fmMoney(total));

				//支付明细显示时判断支付明细的数据
				if($('.payroll-working').is(':visible')) {
					body = $('.payroll-working .amount-table');
					//支付公务卡
					var cmOfficialCard = $yt_baseElement.rmoney($('#cmOfficialCard').val() || '0');
					//支付现金
					var cmCash = $yt_baseElement.rmoney($('#cmCash').val() || '0');
					//支付支票
					var cmCheque = $yt_baseElement.rmoney($('#cmCheque').val() || '0');
					//支付明细合计补领金额
					var cmTotal = cmOfficialCard + cmCash + cmCheque;
					//补领金额大于0 的时候，补领方式合计金额不能超过补领金额。
					var replaceMoney = $yt_baseElement.rmoney($('#cmReplaceMoney').text() || '0');
					if(replaceMoney > 0 && total > replaceMoney) {
						$(this).focus();
						$yt_alert_Model.prompt('金额不能大于补领金额金额');
					} else {
						//格式转换
						var rtotal = me.fmMoney(cmTotal);
						//赋值合计金额
						body.find('.total').text(rtotal).attr('num', cmTotal);
					}
				}
			});
		},
		/**
		 * 日期格式转换
		 * @param {Object} str
		 */
		fmMoney: function(str) {
			return $yt_baseElement.fmMoney(str || '0');
		},
		/**
		 * 日期格式还原
		 * @param {Object} str
		 */
		rmoney: function(str) {
			return $yt_baseElement.rmoney(str || '0');
		},
		/**
		 * 记账凭证信息列表
		 */
		appendMsgList: function(tr) {
			var me = this;
			//验证数据
			if($yt_valid.validForm($('.tally-alert'))) {
				//借贷方类型
				var loanType = $('#loanType option:selected').text();
				var loanCode = $('#loanType option:selected').val();
				//摘要
				var abstract = $('#abstract').val();
				//总账科目
				var totalSubject = $('#totalSubject').val();
				//明细科目
				var detailSubject = $('#detailSubject').val();
				//金额
				var tallyMoney = $('#tallyMoney').val();
				//金额转换
				//var numMoney = $yt_baseElement.rmoney(tallyMoney);
				//借方文本
				var totalText = '';
				//贷方文本
				var detailText = '';
				//判断借贷方类型赋值
				if(loanType == 'DEBIT_ENTRY') {
					//借方类型
					totalText = tallyMoney;
				} else {
					//贷方类型
					detailText = tallyMoney;
				}
				var html = '<tr pid="" class="" loanCode="' + loanCode + '" loanType="' + loanType + '" abstract="' + abstract + '" totalSubject="' + totalSubject + '" detailSubject="' + detailSubject + '" tallyMoney="' + tallyMoney + '">' +
					'<td>' + abstract + '</td>' +
					'<td>' + totalSubject + '</td>' +
					'<td>' + detailSubject + '</td>' +
					'<td>' + totalText + '</td>' +
					'<td>' + detailText + '</td>' +
					'<td><span class="operate-update"><img src="../resources/images/common/edit-icon.png"></span><span class="operate-del"><img src="../resources/images/common/del-icon.png"></span></td>' +
					'</tr>';

				//判断是修改还是新增
				if(tr) {
					//替换
					tr.replaceWith(html);
				} else {
					$('.tally-list').append(html);
				}
				//隐藏
				me.hideMsgAlert();
				//清空
				me.clearAlert($('.tally-alert'));
			} else {

			}
		},
		/**
		 * 1.1.3.4	根据报销申请Id获取报销申请详细信息
		 * @param {Object} reimAppId
		 */
		getAdvanceUpdateAppInfoDetailByAdvanceAppId: function() {
			var me = this;
			$.ajax({
				type: "post",
				url: "sz/advanceAppUpdate/getAdvanceUpdateAppInfoDetailByAdvanceAppId",
				async: true,
				data: {
					advanceAppId:serveExamine.appId,
					"CASPARAMS":"OFF_INDEX"
				},
				success: function(data) {
					var d = eval('('+data+')');
					serveExamine.advanceCostType = d.data.advanceCostType;
					me.saveData = d.data;
					//数据回显
					me.showDetail(d.data);
					//禁用公务卡结算选项
					$('.check-label').off('click');
					$('.check-label input').attr('disabled', true).off('click');
				}
			});
		},
		/**
		 * 1.1.3.5	根据条件获取费用申请详细信息
		 * @param {Object} appId
		 * @param {Object} costType
		 */
		getCostAppInfoDetailByParams: function(appId, costType) {
			var me = this;
			$.ajax({
				type: "post",
				url: "sz/reimApp/getCostAppInfoDetailByParams",
				async: true,
				data: {
					appId: appId,
					costType: costType
				},
				success: function(data) {
					//数据回显
					me.showCostDetail(data.data);
				}
			});
		},
		/**
		 * 空值转换为默认
		 * @param {Object} str
		 */
		non: function(str) {
			return(str ? str : '--');
		},
		/**
		 * 
		 * 报销申请数据回显
		 * @param {Object} data
		 *
		 */
		showDetail: function(d) {
			var me = this;
			//advanceAppId	事前申请Id
			serveExamine.processInstanceId = d.processInstanceId;
			//获取流程日志
			barCodeObj.getCommentByProcessInstanceId(serveExamine.processInstanceId);
			$('#advanceAppNum').text(me.non(d.advanceAppNum)); //advanceAppNum	事前申请单号
			$("#formNum").text(me.non(d.newAdvanceAppNum));//变更申请单号
			$('#advanceAppName').text(me.non(d.advanceAppName)); //advanceAppName	事前申请事由
			//isSpecial	是否为专项
			//specialCode 所属预算项目code
			$('#specialName').text(me.non(d.specialName)); //specialName	所属预算项目名称
			var specialValArr = d.specialCode.split('-');
			if(specialValArr[0]=='395'){//所属预算项目为项目支出
				$('.prj-name-tr').show(); //显示所属项目
				$('#prjName').text(me.non(d.prjName)); //prjName	项目名称
			}else{
				$('.prj-name-tr').hide();//隐藏所属项目
			}
			$(".adj-before").text(d.taxChangeData.changeBeforeAmount || '0.00');
			$(".adj-after").text(d.taxChangeData.changeAfterAmount || '0.00');
			$(".remuneration-tax-total").text(d.taxChangeData.changeAmount || '0.00');
			$('#deptBudgetBalanceAmount').text(d.deptBudgetBalanceAmount ? me.fmMoney(d.deptBudgetBalanceAmount) + '万元' : '--'); //budgetBalanceAmount	预算剩余额度
			$('#budgetBalanceAmount').text(d.budgetBalanceAmount ? (me.fmMoney(d.budgetBalanceAmount) + '万元') : '--'); //budgetBalanceAmount	预算剩余额度
			//advanceCostType	费用类型
			$('#advanceCostType').text(me.non(d.advanceCostTypeName)); //advanceCostTypeName	费用类型名称
			$('#totalAmount').text(me.fmMoney(d.advanceAmount)); //advanceAmount	预算总金额
			$('#totalMoneyUpper').text(arabiaToChinese(d.advanceAmount || '0')); //大写金额
			$('#doAdvanceAmount').text(me.fmMoney(d.doAdvanceAmount)); //doAdvanceAmount	可用支出金额
			$('#taxAmount').text(me.fmMoney(d.taxAmount)); //taxAmount	相关课酬税金
			//applicantUser	申请人
			$('#busiUsers').text(me.non(d.applicantUserName)); //applicantUserName	申请人姓名
			$('#deptName').text(me.non(d.applicantUserDeptName)); //applicantUserDeptName	申请人所在部门
			//applicantUserJobName	申请人职务
			$('#jobName').text(me.non(d.applicantUserJobName)); //applicantUserJobName	
			$('#telPhone').text(me.non(d.applicantUserPhone)); //applicantUserPhone 电话号码
			$('#applicantTime').text(me.non(d.applicantTime)); //applicantTime	申请时间
			//historyAssignee	历史责任人
			me.showCostDetail(d.costData); //costData	费用申请信息
			me.showFileList(d.attList); //attList	附件信息集合
			$('#changeNum').text(d.changeNum || '0'); //changeNum	调整次数
			//changeCount	调整合计
			me.setChangeList(d.changeList); //changeList	调整情况list
		},
		/**
		 * 调整情况列表显示
		 * @param {Object} list
		 */
		setChangeList: function(list) {
			var me = this,
				html = '',
				total = 0;
			$.each(list, function(i, n) {
				html += '<tr> <td>' + n.changeProject + '</td> <td style="text-align: right;">' + me.fmMoney(n.changeBeforeAmount) + '</td> <td style="text-align: right;">' + me.fmMoney(n.changeAfterAmount) + '</td> <td style="text-align: right;">' + me.fmMoney(n.changeAmount) + '</td> <td style="text-align: left;">' + me.non(n.changeReason) + '</td> </tr>';
				total += +n.changeAmount;
			});
			$('#changeList tbody .last').before(html).find('.amount-total').text(me.fmMoney(total));
		},
		/**
		 * 费用信息数据回显
		 * @param {Object} data
		 */
		showCostDetail: function(data) {
			var me = this;
			//转换金额格式的方法
			var fMoney = $yt_baseElement.fmMoney;
			if(data.costTrainApplyInfoList.length == 0 && data.costTeachersFoodApplyInfoList.length == 0 && data.costTeachersLectureApplyInfoList.length == 0 && data.costTeachersTravelApplyInfoList.length == 0 && data.costTeachersHotelApplyInfoList.length == 0) {
				$(".hide-div").html('<table style="width:100%"><tr style="border:0px;background-color:#fff !important;"><td align="center"style="border:0px;"><div class="no-data" style="width: 280px;padding:0;margin: 0 auto;">' +
					'<img src="../resources/images/common/no-data.png" alt="" style="padding:10px 0;">' +
					'</div></td></tr></table>');

			} else {
				//costTrainApplyInfoList	师资-培训费json
				me.setCostTrainApplyInfoList(data.costTrainApplyInfoList);
				//costTeachersFoodApplyInfoList	师资-伙食费json
				me.setCostTeachersFoodApplyInfoList(data.costTeachersFoodApplyInfoList);
				//costTeachersLectureApplyInfoList	师资-讲课费json
				me.setCostTeachersLectureApplyInfoList(data.costTeachersLectureApplyInfoList);
				//costTeachersTravelApplyInfoList	师资-城市间交通费json
				me.setCostTeachersTravelApplyInfoList(data.costTeachersTravelApplyInfoList);
				//costTeachersHotelApplyInfoList	师资-住宿费 json
				me.setCostTeachersHotelApplyInfoList(data.costTeachersHotelApplyInfoList);
				me.setCostPredictInfoList(data.costPredictInfoList);
			}
			//师资-培训信息json
			me.setTrainApplyInfoList(data.trainApplyInfoList);
			//teacherApplyInfoList	师资-讲师信息json
			me.setTeacherApplyInfoList(data.teacherApplyInfoList);

		},
		/**
		 * trainApplyInfoList	师资-培训信息json
		 * 设置 师资培训信息列表数据
		 * @param {Object} list
		 */
		setTrainApplyInfoList: function(list) {
			var me = this;
			if(list.length > 0) {
				//培训类型
				$(".train-type").text(me.non(list[0].trainTypeName));
				//培训名称
				$(".region-designation").text(me.non(list[0].regionDesignation));
				//培训地点中文
				$(".region-name").text(list[0].regionName);
				//报到时间
				$(".report-time").text(list[0].reportTime);
				//结束时间	
				$(".end-time").text(list[0].endTime);
				//培训天数
				$(".train-days").text(list[0].trainDays);
				//培训人数
				$(".train-of-num").text(list[0].trainOfNum);
				//工作人员数量
				$(".worker-num").text(list[0].workerNum);
				//批准文号
				$('.approva-num').text(list[0].approvaNum);
				//收费标准
				$('.charge-standard').text(list[0].chargeStandard);
				if(list[0].reason){
					$("#trainApplyReason").text(list[0].reason);
				}else{
					$(".trainApply-reason-hide").hide();
				}
				
			}
		},
		setCostPredictInfoList: function(list) {
      var html = '';
      var costTotal = 0;
      var costTotalAfter=0;
      $.each(list, function(i, n) {
        html += '<tr  pid=""><td class="cost-name">' + n.predictName + '</td><td class="moneyText predict-standard-money">' + ($yt_baseElement.fmMoney(n.predictStandardMoney)) + '</td><td class="predict-people-num">' + n.predictPeopleNum + '</td><td class="moneyText predict-smallplan-money">' + ($yt_baseElement.fmMoney(n.averageMoney)) + '</td><td class="special-instruct">' + n.remark + '</td></tr>';
        costTotal += n.predictStandardMoney*n.predictPeopleNum;
        costTotalAfter+=n.averageMoney;
        if (n.reason) {
          $('#predictCostReason').text(n.reason)
        } else {
          $(".predictCost-reason").hide()
        }
      });
      html += '<tr class="last"><td>合计</td><td></td><td></td><td class="moneyText costTotal">' + $yt_baseElement.fmMoney(costTotalAfter) + '</td><td></td></tr>';
      $('#predictCostTable tbody').html(html);
      $("#preTaxAllMoney").text($yt_baseElement.fmMoney(costTotal));
      $("#afterTaxAllMoney").text($yt_baseElement.fmMoney(costTotalAfter));
    },
		/**
		 * teacherApplyInfoList	师资-讲师信息json
		 * 设置 师资讲师信息列表数据
		 * @param {Object} list
		 */
		setTeacherApplyInfoList: function(list) {
			var html = '';
			$.each(list, function(i, n) {
				html += '<tr>' +
					'<td class="lecturerName"><input type="hidden" class="lectureId" value="' + n.lecturerId + '"><span>' + n.lecturerName + '</span></td>' +
					'<td class="professional">' + (n.lecturerTitleName || '--') + '</td>' +
					'<td class="level">' + (n.lecturerLevelName || '--') + '</td>' +
					'<td style="display:none"><span class="operate-update"><img src="../resources/images/common/edit-icon.png"></span>' +
					'<span class="operate-del"><img src="../resources/images/common/del-icon.png"></span></td></tr>';
				if(n.reason){
					$("#teacherReason").text(n.reason);
				}else{
					$(".teacher-reason").hide();
				}
			});
			if(!list && list.length <= 0){
				$(".teacher-reason").hide();
			}
			$('#lecturerTable tbody').html(html);
			
		},
		/**
		 * costTrainApplyInfoList	师资-培训费json
		 * 设置 师资培训费列表数据
		 * @param {Object} list
		 */
		setCostTrainApplyInfoList: function(list) {
			var html = '';
			var total = 0;
			if(list.length != 0) {
				$.each(list, function(i, n) {
					html += '<tr pid="' + n.trainAppId + '" trainType="' + n.trainType + '">' +
						'<td class="trainTypeName">' + n.trainTypeName + '</td>' +  //培训类型
						'<td class="standard">' + serveExamine.fmMoney(n.standard) + '</td>' +  //标准
						'<td class="trainOfNum">' + n.trainOfNum + '</td>' +  //报道人数
						'<td class="trainDays">' + n.trainDays + '</td>' +  //培训天数
						'<td class="moneyText averageMoney">' + serveExamine.fmMoney(n.averageMoney) + '</td>' +  
						'<td class="trainingPerNumber">' + (n.remarks || "无") + '</td>' +
						'</tr>';
					total += +n.averageMoney;
					if(n.reason) {
						$('#trainingReason').text(n.reason);
					}else{
						$(".other-reason").hide();
					}
				});
				$('#trainingFeeTable tbody .last').before(html);
				$('#trainingFeeTable .costTotal').text(serveExamine.fmMoney(total));
			} else {
				$(".other-title,.trainingFeeTable,.other-reason").hide();
			}
		},
		/**
		 * costTeachersFoodApplyInfoList	师资-伙食费json
		 * 设置 师资伙食费列表
		 * @param {Object} list
		 */
		setCostTeachersFoodApplyInfoList: function(list) {
			var html = '';
			var total = 0;
			if(list.length != 0) {
				$.each(list, function(i, n) {
					html += '<tr pid="' + n.foodId + '">' +
						'<td><input type="hidden" class="lectureId" value="' + n.lecturerId + '">' + n.lecturerName + '</td>' +
						'<td class="avg moneyText">' + serveExamine.fmMoney(n.averageMoney) + '</td>' +
						'<td class="day">' + n.foodOfDays + '</td>' +
						'<td class="moneyText sum-pay">' + serveExamine.fmMoney(n.foodAmount) + '</td>' +
						'<td class="dec">' + (n.remarks || "无") + '</td>' +
						'<td style="display:none"><input type="hidden" class="popM" value="4"/>' +
						'<span class="operate-update"><img src="../resources/images/common/edit-icon.png"></span>' +
						'<span class="operate-del"><img src="../resources/images/common/del-icon.png"></span></td>' +
						'</tr>';
					total += +n.foodAmount;
					if(n.reason) {
						$('#dietApplyReason').text(n.reason);
					}else{
						$(".food-reason").hide();
					}
				});
				$('#dietFeeTable tbody .end-tr').before(html);
				$('#dietFeeTable tbody .costTotal').text(serveExamine.fmMoney(total));
			} else {
				$(".food-title,.dietFeeTable,.food-reason").hide();
			}
		},
		/**
		 * //costTeachersLectureApplyInfoList	师资-讲课费json
		 * 设置 师资讲课费列表
		 * @param {Object} list
		 */
		setCostTeachersLectureApplyInfoList: function(list) {
			var html = '';
			var total = 0;
			if(list.length != 0) {
				$.each(list, function(i, n) {
					html += '<tr pid="' + n.teachersLectureId + '">' +
						'<td class="uname"><input type="hidden" class="lectureId" value="' + n.lecturerId + '">' + n.lecturerName + '</td>' +
						'<td class="holder">' + (n.lecturerTitleName || '--') + '</td>' +
						'<td class="hour">' + n.teachingHours + '</td>' +
						'<td class="cname">' + n.courseName + '</td>' +
						'<td class="moneyText sum-pay">' + serveExamine.fmMoney(n.perTaxAmount) + '</td>' +
						'<td class="moneyText after">' + serveExamine.fmMoney(n.afterTaxAmount) + '</td>' +
						'<td class="moneyText avg">' + serveExamine.fmMoney(n.averageMoney) + '</td>' +
						'<td style="display:none"><input type="hidden" class="popM" value="1"/>' +
						'<span class="operate-update"><img src="../resources/images/common/edit-icon.png"></span>' +
						'<span class="operate-del"><img src="../resources/images/common/del-icon.png"></span>' +
						'</td></tr>';
					total += +n.perTaxAmount;
					if(n.reason) {
						$('#costTrainApplyReason').text(n.reason);
					}else{
						$(".lecture-reason").hide();
					}
				});
				$('#lectureFeeTable tbody .end-tr').before(html);
				$('#lectureFeeTable tbody .costTotal').text(serveExamine.fmMoney(total));
			} else {
				$(".lecture-title,.lectureFeeTable,.lecture-reason").hide();
			}
		},
		/**
		 * //costTeachersTravelApplyInfoList	师资-城市间交通费json
		 * 设置 师资城市间交通费列表
		 * @param {Object} list
		 */
		setCostTeachersTravelApplyInfoList: function(list) {
			var html = '';
			var total = 0;
			if(list.length != 0) {
				$.each(list, function(i, n) {
					html += '<tr pid="' + n.teachersTravelId + '">' +
						'<td class="uname"><input type="hidden" class="lectureId" value="' + n.lecturerId + '">' + n.lecturerName + '</td>' +
						'<td class="ulv">' + (n.lecturerLevelName || '--') + '</td>' +
						'<td class="sdate">' + n.goTime + '</td>' +
						'<td class="edate">' + n.arrivalTime + '</td>' +
						'<td class="sadd"><input type="hidden" class="scode" value="' + n.goAddress + '">' + n.goAddressName + '</td>' +
						'<td class="eadd"><input type="hidden" class="ecode" value="' + n.arrivalAddress + '">' + n.arrivalAddressName + '</td>' +
						'<td class="tname"><input type="hidden" class="tool" value="' + n.vehicle + '">' + n.vehicleName + '</td>' +
						'<td class="moneyText sum-pay">' + serveExamine.fmMoney(n.carfare) + '</td>' +
						'<td class="dec">' + (n.remarks || "无") + '</td>' +
						'<td  style="display:none"><input type="hidden" class="popM" value="2"/>' +
						'<span class="operate-update"><img src="../resources/images/common/edit-icon.png"></span>' +
						'<span class="operate-del"><img src="../resources/images/common/del-icon.png"></span>' +
						'</td></tr>';
					total += +n.carfare;
					if(n.reason) {
						$('#carApplyReason').text(n.reason);
					}else{
						$(".traffic-reason").hide();
					}
				});
				$('#carFeeTable tbody .end-tr').before(html);
				$('#carFeeTable tbody .costTotal').text(serveExamine.fmMoney(total));
			} else {
				$(".traffic-title,.carFeeTable,.traffic-reason").hide();
			}
		},
		/**
		 * //costTeachersHotelApplyInfoList	师资-住宿费 json
		 * 设置 师资住宿费列表
		 * @param {Object} list
		 */
		setCostTeachersHotelApplyInfoList: function(list) {
			var html = '';
			var total = 0;
			if(list.length != 0) {
				$.each(list, function(i, n) {
					html += '<tr pid="' + n.teachersHotelId + '">' +
						'<td class="name"><input type="hidden" class="lectureId" value="' + n.lecturerId + '">' + n.lecturerName + '</td>' +
						'<td class="sdate">' + n.startTime + '</td>' +
						'<td class="edate">' + n.endTime + '</td>' +
						'<td class="moneyText avg">' + serveExamine.fmMoney(n.averageMoney) + '</td>' +
						'<td class="day">' + n.hotelDays + '</td>' +
						'<td class="moneyText sum-pay">' + serveExamine.fmMoney(n.hotelExpense) + '</td>' +
						'<td class="dec">' + (n.remarks || "无") + '</td>' +
						'<td style="display:none"><input type="hidden" class="popM" value="3"/>' +
						'<span class="operate-update"><img src="../resources/images/common/edit-icon.png"></span>' +
						'<span class="operate-del"><img src="../resources/images/common/del-icon.png"></span>' +
						'</td></tr>';
					total += +n.hotelExpense;
					if(n.reason) {
						$('#hotelApplyReason').text(n.reason);
					}else{
						$(".accommodation-reason").hide();
					}
				});
				$('#hotelFeeTable tbody .end-tr').before(html);
				$('#hotelFeeTable tbody .costTotal').text(serveExamine.fmMoney(total));
			} else {
				$(".accommodation-title,.hotelFeeTable,.accommodation-reason").hide();
			}
		},
		/**
		 * 附件集合显示
		 * @param {Object} list
		 */
		showFileList: function(list) {
			if(list.length>0){
				//图片显示拼接字符串
				var ls = '';
				//图片显示路径
				var src = '';
				$.each(list, function(i, n) {
					//获取图片格式
					var imgType = n.attName.split('.');
					if(imgType.length > 1 && (imgType[1] == 'png' || imgType[1] == 'jpeg' || imgType[1] == 'bmp' || imgType[1] == 'jpg')) {
						//拼接图片路径
						src = $yt_option.base_path + 'fileUpDownload/download?pkId=' + n.attId + '&isDownload=false';
						ls += '<div fid="' + n.attId + '" class="li-div"><span class="file-name" >' + n.attName + '</span><label class="file-dw">下载</label><label class="file-pv">预览<img src="' + src + '" ></label></div>';
					} else {
						ls += '<div fid="' + n.attId + '" class="li-div"><span class="file-name" >' + n.attName + '</span><label class="file-dw">下载</label><label class="file-pvno">预览</label></div>';
					}
				});
				$('#attIdStr').html(ls);
				//图片下载
				$('#attIdStr .file-dw').on('click', function() {
					var id = $(this).parent().attr('fid');
					window.location.href = $yt_option.base_path + 'fileUpDownload/download?pkId=' + id + '&isDownload=true';
				});
				//图片预览
				$('#attIdStr .file-pv img').showImg();
			}else{
				$('#attIdStr').html("暂无附件");
			}
		},
		/**
		 * 记账凭证列表显示
		 * @param {Object} list
		 */
		showBillingVoucherList: function(list) {
			//借方文本
			var totalText = '';
			//贷方文本
			var detailText = '';
			var html = '';

			$.each(function(i, n) {
				//判断借贷方类型赋值
				if(n.toLoanType == 'DEBIT_ENTRY') {
					//借方类型
					totalText = n.amount;
				} else {
					//贷方类型
					detailText = n.amount;
				}
				html += '<tr pid="' + n.billingVoucherId + '" class="" loanCode="' + n.toLoanType + '" loanType="' + n.toLoanTypeName + '" abstract="' + n.abstracts + '" totalSubject="' + n.ledger + '" detailSubject="' + n.detailed + '" tallyMoney="' + n.amount + '">' +
					'<td>' + n.abstracts + '</td>' +
					'<td>' + n.ledger + '</td>' +
					'<td>' + n.detailed + '</td>' +
					'<td>' + totalText + '</td>' +
					'<td>' + detailText + '</td>' +
					'</tr>';
			});
			$('.tally-list').append(html);
		},
		/**
		 * 重置表格序号
		 * @param {Object} obj
		 */
		resetNum: function(obj) {
			var trs = obj.find('tbody tr');
			$.each(trs, function(i, n) {
				$(n).find('.num').text(i + 1);
			});
		},
		/**
		 * 计算总金额
		 */
		getTotleMoney: function() { //获取所有的金额
			var tds = $('#paymentList tbody .money');
			var total = 0;
			//计算合计金额
			$.each(tds, function(i, n) {
				total += +$(n).attr('money');
			});
			var fmTotal = $yt_baseElement.fmMoney(total || '0');
			//赋值合计金额
			$('#paymentList tbody .total-money').text(fmTotal);
			//报销总金额
			$('#applyTotalMoney').text(fmTotal).attr('num', total);
			//报销总额
			$('#amountTotalMoney').text(fmTotal).attr('num', total);
			//大写转换
			$('#TotalMoneyUpper').text(arabiaToChinese(fmTotal + ''));
			//冲销总额
			var writeOffAmount = +($('#writeOffAmount').attr('num'));
			//计算补领金额 报销后借款单余额
			var num = total - writeOffAmount;
			if(num >= 0) {
				//赋值补领金额
				$('#replaceMoney').text($yt_baseElement.fmMoney(num));
			} else {
				//报销后借款单余额
				$('#balanceMoney').text($yt_baseElement.fmMoney(num));
			}
		},
		/**
		 * 获取保存的数据 并 重置 为操作后的数据
		 */
		getSaveData: function() {
			var me = this;
			var data = me.saveData;
			data.paymentDate = $('#paymentDate').val(); //paymentDate	支付日期
			data.paymentAmount = $yt_baseElement.rmoney($('#paymentAmount').val() || '0'); //paymentAmount	支付金额
			data.cmTotalAmount = $('#cmTotalAmount').attr('num'); //cmTotalAmount	支付明细_报销总金额
			data.cmWriteOffAmount = $('#cmWriteOffAmount').attr('num'); //cmWriteOffAmount	支付明细_冲销金额
			data.cmOfficialCard = $yt_baseElement.rmoney($('#cmOfficialCard').val() || '0'); //cmOfficialCard	支付明细_公务卡金额
			data.cmCash = $yt_baseElement.rmoney($('#cmCash').val() || '0'); //cmCash	支付明细_现金金额
			data.cmCheque = $yt_baseElement.rmoney($('#cmCheque').val() || '0'); //cmCheque	支付明细_支票金额
			data.costData = JSON.stringify(data.costData); //cmTransfer	支付明细_转账金额
			data.nextCode = $('#operate-flow option:selected').val(); //nextCode 操作流程代码
			data.dealingWithPeople = $('#approve-users option:selected').val(); //dealingWithPeople	下一步操作人code
			data.attIdStr = me.getFileList();

			return data;
		},
		getFileList: function() {
			var str = '';
			//获取所有的文件列表
			var list = $('#attIdStr .li-div');
			$.each(list, function(i, n) {
				str += $(n).attr('fid') + (i < list.length ? ',' : '');
			});
			return str;
		},
		/**
		 * 显示业务员招待费
		 */
		showBusinessFun: function() {
			$('.index-main-div').html('');
			//提示文字隐藏
			$('.qtip-text-div').hide();
			//其他区域隐藏
			$('.mod-div').hide();
			//其他信息显示
			$('.dottom-div,.approve-div').show();
			$('.grod-div').show();
			$('.business-div').show();
		},
		/**
		 * 一般费用
		 */
		showGeneralFun: function() {
			//清空原有代码
			$('.index-main-div').html('');
			//提示文字隐藏
			$('.qtip-text-div').hide();
			//其他区域隐藏
			$('.mod-div').hide();
			//其他信息显示
			$('.dottom-div,.approve-div').show();
			$('.grod-div').show();
			//相关区域显示
			$('.index-main-div').show();
			//加载区域页面
			barCodeObj.loadingWord('view/system/expensesReim/module/reimApply/costDetailApproval.html');
		},
		/**
		 * 差旅
		 */
		showTravelFun: function() {
			$('.index-main-div').html('');
			//提示文字隐藏
			$('.qtip-text-div').hide();
			//其他区域隐藏
			$('.mod-div').hide();
			//其他信息显示
			$('.dottom-div,.approve-div').show();
			$('.grod-div').show();
			//相关区域显示
			$('.travel-div').show();
		},
		/**
		 * 培训
		 */
		showTrainFun: function() {
			//清空原有代码
			$('.index-main-div').html('');
			//提示文字隐藏
			$('.qtip-text-div').hide();
			//其他区域隐藏
			$('.mod-div').hide();
			//其他信息显示
			$('.dottom-div,.approve-div').show();
			$('.grod-div').show();
			//相关区域显示
			$('.index-main-div').show();
			//加载区域页面
			barCodeObj.loadingWord('view/system/expensesReim/module/busiTripApply/trainApproval.html');
		},
		/**
		 * 会议
		 */
		showMettingFun: function() {
			//提示文字隐藏
			$('.qtip-text-div').hide();
			//其他区域隐藏
			$('.mod-div').hide();
			//其他信息显示
			$('.dottom-div,.approve-div').show();
			$('.grod-div').show();
			//加载区域页面
			barCodeObj.loadingWord('view/system/expensesReim/module/beforehand/meetingCostApplyDetails.html');

		},
		/**
		 * 显示财务支付明细的弹框
		 */
		showCrateDetaliAlert: function() {
			//显示对象信息弹框及蒙层
			$yt_baseElement.showMongoliaLayer();
			$yt_alert_Model.getDivPosition($('#createDetali'));
			$('#pop-modle-alert').show();
			$('#createDetali').show();
		},
		/**
		 * 隐藏财务支付明细弹窗
		 */
		hideCrateDetaliAlert: function() {
			$yt_baseElement.hideMongoliaLayer();
			$('#createDetali').hide();
			$('#pop-modle-alert').hide();
		},
		/*支付明细数据添加到列表（数据库）方法*/
		appendDetaliList: function(tr) {
			var me = this;
			//收款方类型
			var type = $('#firstSelect option:selected').text();
			var typeVal = $('#firstSelect option:selected').val();
			//收款方
			var budgetProject = $('#budgetProject option:selected').text();
			//收款方id
			var budgetProjectCode = $('#budgetProject option:selected').val();
			//付款日期
			var payDate = $('#payDate').val();
			//现金
			var cash = $('#cash').val();
			//公务卡
			var officialCard = $('#officialCard').val();
			//转账
			var transfer = $('#transfer').val();
			//金额
			var createDetaTotalMoney = $('#createDetaTotalMoney').val();
			$.ajax({
				type: "post",
				url: "sz/payDetailBillingVoucher/savePaymentDetailInfo",
				async: true,
				data: {
					appId: serveExamine.saveData.payAppId, //表单申请Id
					appType: 'PAYMENT_APP', //表单申请类型		 报销申请- REIM_APP		付款申请 - PAYMENT_APP
					receivablesId: budgetProjectCode, //收款方id
					receivablesType: typeVal, //收款方类型		收款方单位 - GATHERING_UNIT	   收款方个人 - GATHERING_PERSON   收款方其他 - GATHERING_OTHER
					//payDetailId:'',//支付明细Id
					paymentDate: payDate, //付款日期
					paymentAmount: serveExamine.rmoney(createDetaTotalMoney), //付款金额
				},
				success: function(data) {
					if(data.flag == 0) {
						var d = data.data;
						//添加成功
						var html = '<tr pid="" type="' + typeVal + '" payee="' + budgetProjectCode + '" payment="' + payDate + '" paymentmoney="' + Unit + '">' +
							' <td class="payee" style="width: 100px;">' + budgetProject + '</td>' +
							' <td class="payment" style="width: 100px;">' + payDate + '</td>' +
							' <td class="paymentmoney" style="text-align: right;">' + Unit + '</td></tr>';
						//隐藏
						me.hideMsgAlert();
						//清空
						me.clearAlert($('#createDetali'));
						//获取列表
						me.getPaymentAmountInfoList(d.appId);
					}
					//添加失败
					$yt_alert_Model.prompt(data.message);

				}
			});

		},
		/**
		 * 1.1.8.5	支付明细列表
		 * @param {Object} appId
		 */
		getPaymentAmountInfoList: function(appId) {
			$.ajax({
				type: "post",
				url: "sz/payDetailBillingVoucher/getPaymentAmountInfoList",
				async: true,
				data: {
					appId: appId
				},
				success: function(data) {
					if(data.flag == 0) {
						var d = data.data;
						$('#mustMoney').text(pay.fmMoney(d.totalAmount)); //totalAmount	应付款金额
						var paymentAmount = d.paymentAmount; //paymentAmount 已付款金额
						$('#alreadyMoney').text(pay.fmMoney(paymentAmount));
						var paymentBalanceAmount = d.paymentBalanceAmount; //paymentBalanceAmount 未付款金额
						$('#notMoney').text(pay.fmMoney(paymentBalanceAmount));
						var payDetailList = d.payDetailList || []; //payDetailList 支付明细列表
						serveExamine.setPayDetailList(payDetailList);
					}

				}
			});
		},
		/**
		 * 显示支付明细数据
		 * @param {Object} list
		 */
		setPayDetailList: function(list) {
			var html = '';
			var total = 0;
			$('.pay-detail-tabel tbody tr:not(.pay-detail-tabel-total)').remove();
			$.each(list, function(i, n) {
				html += '<tr pid="' + n.receivablesId + '" type="' + n.receivablesType + '" payee="' + n.receivablesId + '" payment="' + n.paymentDate + '" paymentmoney="' + n.paymentAmount + '">' +
					' <td class="payee" style="width: 100px;">' + n.receivablesName + '</td>' +
					' <td class="payment" style="width: 100px;">' + n.paymentDate + '</td>' +
					' <td class=""></td>' +
					' <td class=""></td>' +
					' <td class=""></td>' +
					' <td class="paymentmoney" style="text-align: right;">' + pay.fmMoney(n.paymentAmount) + '</td></tr>';
				total += +n.paymentAmount;
			});
			$('.pay-detail-tabel .pay-detail-tabel-total').before(html);
			$('.pay-detail-tabel .payee-other-total-money').text(pay.fmMoney(total));
		},
	};

	$(function() {
		serveExamine.init();
	});
})(jQuery, window);
