var printFormObj = {
	incomeTotal : 0,
	getDataList:[],
	init : function() {
		var appId = $yt_common.GetQueryString('finalAppId');
		$(".applicantUser").val($yt_common.user_info.userName);
		printFormObj.events();
		printFormObj.downloadFileAppId(appId);
			printFormObj.printFormBaseInfo(appId);
			printFormObj.getPrintTrainInfo(appId);
			$(".meet-detailed-table-one").hide();
			$(".meet-detailed-table-two").hide();
			$("#teachersCostList").show();
			$("#teachersCostListFrist").show();
			$(".reception-table").hide();
			$(".reception-table-two").hide();
			$(".travel-detailed-table").hide();
			$(".bot-signature-model").show();
		;
		$("input.code-inpu").startListen({
			letter : true,
			check : false,
			show : function(code) {
				if (code != "" && code && code != undefined && code != null) {
					var subStr = code.substring(0, 7);
					if (subStr == "http://") {
						window.open(code)
					} else {
						$yt_alert_Model.prompt("二维码识别不成功,请联系管理员!")
					}
				} else {
					$yt_alert_Model.prompt("二维码识别不成功,请联系管理员!")
				}
			}
		})
	},
	events : function() {
		$("#printBtn").off().on("click", function() {
			printFormObj.doPrint()
		});
		$("#closeBtn").off().on("click", function() {
			if (window != top) {
				parent.closeWindow()
			} else {
				window.close()
			}
		});
		if ($('.before-cause,.train-name').innerHeight() > 50) {
			$('.before-cause,.train-name').css('padding', '0px')
		}
		;
		if ($('.before-cause,.train-name').innerHeight() > 55) {
			$('.before-cause,.train-name').css('font-size', '12px')
		}
	},
	printFormBaseInfo : function(finalAppId) {
		$
				.ajax({
					type : "post",
					url : "sz/finalApp/printSpendingFormDetailsByFinalAppId",
					async : true,
					data : {
						finalAppId : finalAppId
					},
					success : function(data) {
						var datas = data.data;
						printFormObj.incomeTotal = datas.incomeTotal; 
						if (data.flag == 0) {
						}
					}
				})
	},
	getPrintTrainInfo : function(finalAppId) {
		$.ajax({
			type : "post",
			url : "sz/finalApp/printTrainFormDetailsByFinalAppId",
			async : true,
			data : {
				finalAppId : finalAppId
			},
			success : function(data) {
				var datas = data.data;
				if (data.flag == 0) {
					printFormObj.getDataList = datas;
					printFormObj.printInvoiceTrain(datas)
				}
			}
		})
	},
	downloadFileAppId : function(finalAppId) {
		var imgSrc = '';
		$.ajax({
			type : "post",
			url : "fileUpDownload/createQrCode",
			async : true,
			data : {
				context : $yt_option.websit_path
						+ 'barCode/finDetail.html?appId=' + finalAppId
			},
			success : function(data) {
				imgSrc = data.data;
				$('.qr-code').attr(
						'src',
						$yt_option.base_path
								+ 'fileUpDownload/downloadFile?storePath='
								+ imgSrc + '&isDownload=false')
			}
		})
	},
	printInvoiceTrain : function(data) {
		var me = this;
		$(".year").text(data.printYear);
		$(".month").text(data.printMonth);
		$(".day").text(data.printDay);
		$("#finalAppNum").text(data.finalAppNum);
		$(".before-cause").text(data.finalAppReason);
		$(".apply-users").text(data.applicantUserName);
		$(".users-job").text(data.applicantUserPositionName);
		$(".users-dept").text(data.applicantUserDeptName);
		$(".users-tel").text(data.applicantUserPhone);
		$(".cost-type").text(data.costTypeName);
		$(".apply-money").text($yt_baseElement.fmMoney(data.expenditureTotal));
		$(".apply-money-upper").text(arabiaToChinese(data.expenditureTotal));
		$(".by-budget-prj").text(
				data.specialName
						+ (data.prjName ? '-' + data.prjName : data.prjName));
		$(".dept-money").text(
				$yt_baseElement.fmMoney(data.deptBudgetBalanceAmount));
		$(".unit-money")
				.text($yt_baseElement.fmMoney(data.budgetBalanceAmount));
		$(".train-name").text(data.applicationMatters.regionDesignation);
		$(".train-addres").text(data.applicationMatters.regionName);
		$(".train-approva-num").text(data.applicationMatters.approvaNum);
		$(".train-charge-standard").text(data.applicationMatters.chargeStandard==""?"":$yt_baseElement.fmMoney(data.applicationMatters.chargeStandard));
		$(".train-start-time").text(data.applicationMatters.reportTime);
		$(".train-end-time").text(data.applicationMatters.endTime);
		$(".train-per-num").text(data.applicationMatters.trainOfNum);
		$(".train-work-num").text(data.applicationMatters.workerNum);
		$(".advance-amount").text($yt_baseElement.fmMoney(data.expenditureTotal));
		$(".teachers-amount").text(
				$yt_baseElement.fmMoney(data.applicationFee.teachersAmount));
		$(".train-other-amount").text(
				$yt_baseElement.fmMoney(data.applicationFee.trainOtherAmount));
		$(".train-sum-money").text($yt_baseElement.fmMoney(data.expenditureTotal));
		me.setPredictCostList(data.applicationFee.predictCostList);
		me.setTeachersCostList(data.applicationFee.teachersCostList);
		me.setTrainOtherList(data.applicationFee.trainOtherList);
		me.setRecordOfApprovalListList(data.recordOfApprovalList)
	},
	setPredictCostList : function(list) {
		var me = this;
		var predictHtml = '';
		var amount=0;
		 /*if(list.length==1){
			$.each(list,function(i, n) {
				predictHtml += '<td class="font-bold">收入情况</td>'
					+'<td>'+$yt_baseElement.fmMoney(n.predictStandardMoney)+'</td><td>'
					+n.predictPeopleNum+'</td><td></td><td style="text-align: right;" class="font-bold"><span>'
						+ $yt_baseElement.fmMoney(n.amount)
						+ '</span></td><td><div class="yt-table-br"></div></td>';
			});
		}else if(list.length==2){
			var remark="其中，";
			
			predictHtml += '<td class="font-bold">收入情况</td><td></td><td></td><td></td><td style="text-align: right;" class="font-bold"><span>';
			$.each(list,function(i, n) {
				amount+=n.amount;
				remark+= '培训费'+(i+1)+':标准'+$yt_baseElement.fmMoney(n.predictStandardMoney)+'元，人数'+n.predictPeopleNum+'，金额'+$yt_baseElement.fmMoney(n.amount)+';';
			});
			//其中，培训费一：标准4000元，人数168，金额652427.18；培训费二：标准2200元，人数12，金额25631.07。
			predictHtml += amount+'</span></td><td><div class="yt-table-br" >'+remark+'</div></td>';
		}else if(list.length>=3){
			predictHtml += '<td class="font-bold">收入情况</td>'
				+'<td></td><td></td><td></td><td style="text-align: right;" class="font-bold"><span>';
			$.each(list,function(i, n) {
				amount+=n.amount;
			});
			predictHtml+=$yt_baseElement.fmMoney(amount)+'</span></td><td><div class="yt-table-br"></div></td>';
		}*/
		$.each(list,function(i, n) {
      predictHtml += '<tr><td class="font-bold">'+n.predictName+'</td>'
        +'<td>'+$yt_baseElement.fmMoney(n.predictStandardMoney)+'</td><td>'
        +n.predictPeopleNum+'</td><td></td><td style="text-align: right;" class="font-bold"><span>'
          + $yt_baseElement.fmMoney(n.amount)
          + '</span></td><td><div class="yt-table-br">'+n.remark+'</div></td></tr>';
    });
		predictHtml += '<tr><td class="font-bold">收入合计</td>'
        +'<td></td><td></td><td></td><td style="text-align: right;" class="font-bold"><span>';
    $.each(list,function(i, n) {
      amount+=n.amount;
    });
    predictHtml+=$yt_baseElement.fmMoney(amount)+'</span></td><td><div class="yt-table-br"></div></td></tr>';
		$('#teachersCostList tbody .predict-tr').before(predictHtml)
	},
	setTeachersCostList : function(list) {
		var me = this;
		var receHtml = '';
		$.each(
			list,
			function(i, n) {
				var amount='';
				if(n.amount){
					amount=$yt_baseElement.fmMoney(n.amount);
				}
				receHtml += '<tr class="small-td"><td>'
						+ n.costTypeName
						+ '</td><td></td><td></td><td></td><td style="text-align: right;"><span>'
						+ amount
						+ '</span></td><td></td></tr>'
			});
		$('#teachersCostList tbody .train-other-tr').before(receHtml)
	},
	setOtherExpenses:function(list){
		var arr = list;
		var map = {},
		    dest = [];
		for(var i = 0; i < arr.length; i++){
		    var ai = arr[i];
		    //if(!map[ai.costTypeName]){
		        dest.push({
					amount: ai.amount,
					cmpid: ai.cmpid,
					costTypeName: ai.costTypeName,
					remark: ai.remark,
					sort: ai.sort,
					standard: ai.standard,
					trainDays: ai.trainDays,
					trainOfNum: ai.trainOfNum
		        });
		        map[ai.costTypeName] = ai;
		    //}else{
		    	/*if(ai.costTypeName == "其他费用"){
		    		dest.push(ai);
	            	break;
		        }else{
	            	for(var j = 0; j < dest.length; j++){
		            	var dj = dest[j];
		            	if(dj.costTypeName == ai.costTypeName){
			                dj.amount = dj.amount + ai.amount; 
			                dj.remark = dj.remark;
			                dj.standard = "0.00";
			                dj.trainDays = "0";
			                dj.trainOfNum = "0";
			                dj.costTypeName = dj.costTypeName;
			                break;
			            }
		            }
		        }*/
		    //}
		}
		var temp = [];
		for(var z = 0 ; z < dest.length; z++){
			var dz = dest[z];
			if(dz.costTypeName == "其他费用"){
				temp.push(dz);
				dest.splice(z,1);
			}
		};
		dest = dest.concat(temp);
		return dest;
	},
	setTrainOtherList : function(list) {
		var me = this;
		var receHtml = '';
		var dest = printFormObj.setOtherExpenses(list);
		$.each(dest, function(i, n) {
//			var standard="";
//			if(n.standard){
//				standard=$yt_baseElement.fmMoney(n.standard);
//			}
			var standard = (n.standard == '0.00' || n.standard == '') ? '': $yt_baseElement.fmMoney(n.standard);
			var trainOfNum = (n.trainOfNum == '0'|| n.trainOfNum == '') ? '': n.trainOfNum;
			var trainDays = (n.trainDays == '0' || n.trainDays == '') ? '':n.trainDays;
			receHtml += '<tr class="small-td"><td>' + n.costTypeName
					+ '</td><td style="text-align: right;"><span>'
					+ standard + '</span></td><td>'
					+ trainOfNum + '</td><td>' + trainDays
					+ '</td><td style="text-align: right;"><span>'
					+ $yt_baseElement.fmMoney(n.amount)
					+ '</span></td><td style="text-align: left;">' + n.remark
					+ '</td></tr>';
		});
		receHtml+= '<tr>'+
					'<td class="font-bold">'+ '应缴附加费' +'</td>'+
					'<td style="text-align: right;"><span>'+ '12%' +'</span></td>'+
					'<td>'+'</td>'+
					'<td>'+'</td>'+
					'<td style="text-align: right;" class="font-bold"><span class="surcharge">'+ $yt_baseElement.fmMoney(printFormObj.incomeTotal*0.03*0.12) +'</span></td>'+
					'<td style="text-align: left;"></td>'+
					'</tr>';
		var len = 0;
		if(printFormObj.getDataList.applicationFee.hasOwnProperty('predictCostList') && printFormObj.getDataList.applicationFee.predictCostList.length > 0){
			len = list.length + 13;
		}else{
			len = list.length + 12;
		}			
		$('.detail-tby').attr("rowspan", len+1);
		$('#teachersCostList tbody .added-tax-value').text($yt_baseElement.fmMoney(printFormObj.incomeTotal*0.03));
		$('#teachersCostList tbody .train-sum-tr').before(receHtml)
	},
	setRecordOfApprovalListList : function(list) {
		var html = '';
		var total = 0;
		var i = 0;
		$
				.each(
						list,
						function(i, n) {
							html += '<tr><td>'
									+ (i + 1)
									+ '</td><td style="text-align: left;"><span class="nodeName">【'
									+ n.nodeName
									+ '】</span>——<span class="nodeUserName">'
									+ n.nodeUserName
									+ '</span></td><td class="" style="text-align: left;padding-left: 15px;">';
							$
									.each(
											n.approvaInfoList,
											function(v, j) {
												html += '<div style="'
														+ (v == n.approvaInfoList.length - 1 ? 'font-weight: bold;'
																: '')
														+ '"><span class="approvaDate">'
														+ j.approvaDate
														+ '</span><span class="approvaState" style="padding-left: 10px;">'
														+ j.approvaState
														+ '</span>，意见：<span class="approvaRemarks">'
														+ (j.approvaRemarks || '')
														+ '</span></div>'
											});
							html += '</td></tr>'
						});
		var len = list.length + 1;
		$('.approval-record').attr("rowspan", len);
		$('.approval-record-table tbody').append(html)
	},
	doPrint : function() {
		bdhtml = window.document.body.innerHTML;
		startInvoicePasting = "<!--startInvoicePasting-->";
		endInvoicePasting = "<!--endInvoicePasting-->";
		prnhtml = bdhtml.substr(bdhtml.indexOf(startInvoicePasting));
		prnhtml = prnhtml.substring(0, prnhtml.indexOf(endInvoicePasting));
		window.document.body.innerHTML = prnhtml;
		window.focus();
		if (printFormObj.isIE()) {
			document.body.className += ' ext-ie';
			document.execCommand('print', false, null)
		} else {
			window.print()
		}
		window.document.body.innerHTML = bdhtml;
		window.location.reload()
	},
	isIE : function() {
		if (!!window.ActiveXObject || "ActiveXObject" in window) {
			return true
		} else {
			return false
		}
	}
};
$(function() {
	printFormObj.init()
});