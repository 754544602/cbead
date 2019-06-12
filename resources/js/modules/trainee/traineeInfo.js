var carList = {
	//初始化方法
	init: function() {
		//获取一条详细信息
		carList.getPlanListInfo();
		var searchUrl =window.location.href;
        var hrefData =searchUrl.split("=");        //截取 url中的“=”,获得“=”后面的参数
        var keyword =decodeURI(hrefData[3]); 
		//点击返回
		$('.page-return-btn').click(function() {
			var pageNum = $yt_common.GetQueryString("pageNum");
			window.location.href =encodeURI("traineeList.html?back="+1+"&pageNum="+pageNum+"&keyword="+keyword);   //使用encodeURI编码
			//window.location.href = "";
		});
		//事由下拉框
		$("select.add-cause").niceSelect();
		//接待形式下拉框
		$("select.add-reception-form").niceSelect();
		//接待安排下拉框
		$("select.add-reception-arrangement").niceSelect();
		//点击新增
		$('.add-btn').click(function() {
			//调用初始化弹窗
			carList.clearAddAlert();
			//调用新增弹窗
			carList.addShowAlert();
		});
		var pkId = "";
		//点击其他来往记录编辑 
		$('.records-list').on('click', '.records-edit', function() {
			//调用初始化弹窗
			carList.clearAddAlert();
			//调用新增弹窗
			carList.addShowAlert();
			var tbTr = $(this).parents('tbody');
			pkId = tbTr.find('.pk-id').text();
			var visitDate = tbTr.find('.visit-date').text();
			var cause = tbTr.find('.cause').text();
			var chargePerson = tbTr.find('.charge-person').text();
			var receptionForm = tbTr.find('.reception-form').text();
			var receptionArrangement = tbTr.find('.reception-arrangement').text();
			var diningArrangements = tbTr.find('.dining-arrangements').text();
			var attendees = tbTr.find('.attendees').text();
			var giftGive = tbTr.find('.gift-give').text();
			var courtyardReturn = tbTr.find('.courtyard-return').text();
			var remarks = tbTr.find('.remarks').text();
			$('#visit-date').val(visitDate);
			$('.add-cause').setSelectVal(cause);
			$('.add-charge-person').setSelectVal(chargePerson);
			$('.add-reception-form').setSelectVal(receptionForm);
			$('.add-reception-arrangement').setSelectVal(receptionArrangement);
			$('.add-dining-arrangements').val(diningArrangements);
			$('.add-attendees').val(attendees);
			$('.add-gift-give').val(giftGive);
			$('.add-courtyard-return').val(courtyardReturn);
			$('.add-remarks').val(remarks);
			$('.add-shuttle-box select').niceSelect();
		});
		//点击删除其他来往记录 
		$('.records-list').on('click', '.records-delete', function() {
			//tbTr 为 tr
			var tbTr = $(this).parent().parent().parent();
			//tabHtml 为table
			var tabHtml = tbTr.parent().parent();
			pkId = $(tbTr).find('.pk-id').text();
			$yt_alert_Model.alertOne({
				alertMsg: "数据删除将无法恢复，确认删除吗？", //提示信息  
				confirmFunction: function() { //点击确定按钮执行方法  
					$.ajax({
						type: "post",
						url: $yt_option.base_path + "trainee/deleteTraineEvisitingRecords",
						data: {
							pkId: pkId
						},
						async: false,
						success: function(data) {
							if(data.flag == 0) {
								tabHtml.remove();
							}
						}
					});
				}
			});
		});
		//获取负责人
		carList.getworkFlowPerson();
		/**
		 * 初始化日期控件
		 */
		$("#visit-date").calendar({
			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
			readonly: true, // 目标对象是否设为只读，默认：true     
			lowerLimit: "2010/01/01", // 日期下限，默认：NaN(不限制)     
			nowData: true, //默认选中当前时间,默认true  
			dateFmt: "yyyy-MM-dd",
			callback: function() {} // 点击选择日期后的回调函数  
		});
		//新增修改确定按钮
		$('.select-teacher-btn-div').on('click', '#submit', function() {
			//调用新增功能方法
			carList.addInfo(pkId);
		});

		//培训记录查看按钮
		$('.train-list').off().on('click', '.lookInfo', function() {
			var traineeId =$(this).parents('tr').attr('data-traineeId');
			var projectId =$(this).parents('tr').attr('data-projectCode');
			var headImg = new Image();
			var gender = "";
			$.ajax({
				type: "post",
				url: $yt_option.base_path + "class/trainee/getTraineeDetails",
				data: {
					traineeId: traineeId,
					projectId: projectId
				},
				async: false,
				success: function(data) {
					if(data.flag == 0) {
						if(data.data != null){
								headImg.src = data.data.headPortraitUrl;
								if(data.data.headPortraitUrl!=""){
									headImg.onload = function() {
										$('.look-student-details-img').attr('src', headImg.src);
										$('.look-student-details-img').jqthumb({
											width: 85,
											height: 122
										});
									}
								}else{
									headImg.onload = function() {
										$('.look-student-details-img').attr('src', '../../resources/images/classStudent/student-picture.png');
										$('.look-student-details-img').jqthumb({
											width: 85,
											height: 122
										});
									}
								}
								
							if(data.data.gender == 1) {
								gender = "男";
							} else {
								gender = "女";
							}
							if(data.data.workTime=="0000-00-00"){
								data.data.workTime="";
							}
							//1:身份证 2:护照 3:军官证 4:其他
							if(data.data.idType == 1){
								data.data.idType = "身份证";
							}else if(data.data.idType == 2){
								data.data.idType = "护照";
							}else if(data.data.idType == 3){
								data.data.idType = "军官证";
							}else{
								data.data.idType = "其他";
							}
							$('#look-real-name').text(data.data.realName);
							$('#look-group-num').text(data.data.groupNum);
							$('#look-gender').text(gender);
							$('#look-nation-name').text(data.data.nationName);
							$('#look-id-type').text(data.data.idType);
							$('#look-id-number').text(data.data.idNumber);
							$('#look-phone').text(data.data.phone);
							$('#look-date-birth').text(data.data.dateBirth);
							$('#look-group-name').text(data.data.groupName);
							$('#look-group-org-name').text(data.data.groupOrgName);
//							$('#look-org-type').text(carList.getOrgType(data.data.types));
							$('#look-org-type').text(data.data.types);
							$('#look-position-name').text(data.data.deptName+data.data.positionName);
							$('#look-mailing-address').text(data.data.mailingAddress);
							$('#look-postal-code').text(data.data.postalCode);
							$('#look-telephone').text(data.data.telephone);
							$('#look-fax').text(data.data.fax);
							$('#look-email').text(data.data.email);
							$('#look-party-date').text(data.data.partyDate);
							$('#look-work-time').text(data.data.workTime);
							$('#look-education-time').text(data.data.educationTime);
							$('#look-education-time-class').text(data.data.educationTimeClass);
							$('#look-service-time').text(data.data.serviceTime);
							$("#look-service-time-class").text(data.data.serviceTimeClass);
							 $(".linkman-tab").setDatas(data.data);
							//发票部分
							if (data.data.invoiceType == 1) {
								data.data.invoiceType = "普通发票";
							}else if (data.data.invoiceType == 2) {
								data.data.invoiceType = "增值税专用发票";
							}else{
								data.data.invoiceType = "";
							}
							//开票信息
					var recordList = data.data.orderList;
					var recordBody = $('.order-list-tbody').empty();
					var recordHtml = '';
					if(recordList.length!=0){
						$.each(recordList, function(i,v) {
							v.isOrderNum==1?v.isOrderNum='已开票':v.isOrderNum='未开票';
							recordHtml='<tr style="height:40px">'+
								'<td style="text-align: right;" width="80px">开票状态：</td>'+
								'<td style="text-align: left;" width="150px">'+v.isOrderNum+'</td>'+
								'<td class="order-num" style="text-align: right;" width="80px">发票号：</td>'+
								'<td style="text-align: left;" width="120px">'+v.orderNum+'</td>'+
								'<td class="order-money" style="text-align: right;" width="80px">开票金额：</td>'+
								'<td style="text-align: left;" width="120px">'+v.tuition+'</td>'+
								'<td width="80px"><div class="addorder addorder'+i+'" style="display:none;padding: 5px 10px;border: 1px dashed #E6E6E6;cursor: pointer;">合并开票</div></td>'
								'</tr>';
							recordBody.append(recordHtml);
							var trainees = "";
							if(v.trainees != undefined){
								trainees = v.trainees.split(',');
							}
							if(trainees.length>1){
								$('.addorder'+i).show().data('trainees',trainees.join('  '));
							}
								$('.addorder').tooltip({
									position: 'bottom',
									content: function() {
										var showBox = '<table class="tip-table">' +
											'<tr><td style="text-align:left">合并开票者：</td></tr><tr><td>' + $(this).data('trainees') + '</td></tr>' +
											'</table>';
										return showBox;
									},
									onShow: function() {
										$(this).tooltip('tip').css({
											backgroundColor: '#666',
											borderColor: '#666',
											color: '#fff'
										});
									}
								});
								});
							}else{
								recordHtml='<tr style="border:0px;background-color:#fff !important;height:40px" >' +
									'<td width="77px" align="right" style="border:0px;">开票状态：</td>' +
									'<td align="left" style="border:0px;">未开票</td>' +
									'</tr>';
								recordBody.append(recordHtml);
							}
							$('.look-invoice-type').text(data.data.invoiceType);
							$(".look-invoice-info").data("data","data.data");
	
						}else{
							//调用产看学员详情弹窗
							carList.lookInfoAlert();
							$('.look-student-details-img').attr('src', '../../resources/images/classStudent/student-picture.png');
							$('.look-student-details-img').jqthumb({
								width: 85,
								height: 122
							});
						}
					}
				}
			});
			//调用产看学员详情弹窗
			carList.lookInfoAlert();
		});
	},
	//获取接待负责人
	getworkFlowPerson: function() {
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/user/getUsers",
			data: {
				compId: ""
			},
			async: false,
			success: function(data) {
				if(data.data.length > 0) {
					var globalUserList = data.data;
					$.each(data.data, function(i, p) {
							if(p.type == 3) {
								$(".add-charge-person").append('<option value="' + p.textName + '">' + p.text + '</option>');
							}
						}),
						$(".add-charge-person").niceSelect({
							search: true,
							backFunction: function(text) {
								//回调方法,可以执行模糊查询,也可自行添加操作  
								$("select.add-charge-person option").remove();
								if(text == "") {
									$("select.add-charge-person").append('<option value="">请选择</option>');
								}
								//遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
								$.each(globalUserList, function(i, n) {
									console.log(text)
									if(n.text.indexOf(text) != -1) {
										if(n.type == 3) {
											$("select.add-charge-person").append('<option value="' + n.textName + '">' + n.text + '</option>');
										}
									}
								});
							}
						})
				};
			}
		});
	},

	//初始化图片格式
	hedImg: function() {
		$('#head-portrait-url').jqthumb({
			width: 115,
			height: 130,
			after: function(imgObj) {}
		});
	},

	/**
	 * 获取用户一条详情
	 */
	getPlanListInfo: function() {
		var traineeId = $yt_common.GetQueryString("traineeId");
		var headImg = new Image();
		var gender = "";
		$.ajax({
			url: $yt_option.base_path + "trainee/getTraineeDetails", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				traineeId: traineeId
			}, //ajax查询访问参数
			beforeSend: function() {
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if(data.flag == 0) {
					var datas = data.data
					if(datas.headPortraitUrl != "") {
						headImg.src = datas.headPortraitUrl;
						headImg.onload = function() {
							$('.student-details-img').attr('src', headImg.src);
							$('.student-details-img').jqthumb({
								width: 85,
								height: 122
							});
						};
					} else {
						$('.student-details-img').attr('src', '../../resources/images/classStudent/student-picture.png');
						$('.student-details-img').jqthumb({
							width: 85,
							height: 122
						});
					};
					if(datas.gender == 1) {
						gender = "男";
					} else {
						gender = "女";
					}
					//1:身份证 2:护照 3:军官证 4:其他
					if(datas.idType == 1){
						datas.idType = "身份证";
					}else if(datas.idType == 2){
						datas.idType = "护照";
					}else if(datas.idType == 3){
						datas.idType = "军官证";
					}else{
						datas.idType = "其他";
					}
					$('#real-name span').text(datas.realName);
					$('#gender').text(gender);
					$('#nation-name').text(datas.nationName);
					$('#id-type').text(datas.idType);
					$('#id-number').text(datas.idNumber);
					$('#phone').text(datas.phone);
					$('#date-birth').text(datas.dateBirth);
					$('#group-name').text(datas.groupName);
					$('#group-org-name').text(datas.groupOrgName);
					$('#org-type').text(carList.getOrgType(datas.orgType));
					var deptNameAndpositionName = datas.deptName+datas.positionName;
					$('#position-name').text(deptNameAndpositionName);
					$('#mailing-address').text(datas.mailingAddress);
					$('#postal-code').text(datas.postalCode);
					$('#telephone').text(datas.telephone);
					$('#fax').text(datas.fax);
					$('#email').text(datas.email);
					$('#party-date').text(datas.partyDate);
					$('#work-time').text(datas.workTime);
					$('#education-time').text(datas.educationTime);
					$('#education-time-class').text(datas.educationTimeClass);
					$('#service-time').text(datas.serviceTime);
					$('#service-time-class').text(datas.serviceTimeClass);

					//发票抬头列表
					var invoiceHmlTbody = $('.invoice-list .yt-tbody');
					var invoiceHtmlTr = '';
					if(datas.invoiceList.length > 0 && datas.invoiceList[0] != null) {
						$(invoiceHmlTbody).empty();
						//遍历现场教学（外出教学）
						$.each(datas.invoiceList, function(i, v) {
							i = i + 1;
							if(v.orgName == undefined){
								v.orgName = "";
							}
							if(v.taxNumber == undefined){
								v.taxNumber = "";
							};
							if(v.address == undefined){
								v.address = "";
							};
							if(v.telephoneProject == undefined){
								v.telephoneProject = "";
							};
							if(v.registeredBank == undefined){
								v.registeredBank = "";
							};
							if(v.account == undefined){
								v.account = "";
							};
							invoiceHtmlTr = '<tr>' +
								'<td style="text-align:center;">' + i + '</td>' +
								'<td class="org-name">' + v.orgName + '</td>' +
								'<td class="tax-number" style="text-align:center;">' + v.taxNumber + '</td>' +
								'<td class="address">' + v.address + '</td>' +
								'<td class="telephone-project" style="text-align:center;">' + v.telephoneProject + '</td>' +
								'<td class="registered-bank" style="text-align:center;">' + v.registeredBank + '</td>' +
								'<td class="account" style="text-align:center;">' + v.account + '</td>' +
								'</tr>';
							invoiceHmlTbody.append(invoiceHtmlTr);
						});

					} else {
						$(invoiceHmlTbody).empty();
						invoiceHtmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="7" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						invoiceHmlTbody.append(invoiceHtmlTr);
					}
			
					//来往记录
					var trainListHmlTbody = $('.train-list .yt-tbody');
					var trainHtmlTr = '';
					var traineeScore = ""
					console.log(datas.trainList)
					if(datas.trainList.length > 0) {
						$(trainListHmlTbody).empty();
						//遍历现场教学（外出教学）
						var checkInState;
						$.each(datas.trainList, function(i, v) {
							i = i + 1;
							if(v.checkInState == 0) {
								checkInState = "未报到";
							};
							if(v.checkInState == 1) {
								checkInState = "已报到";
							};
							if(v.traineeScore == "") {
								traineeScore = "";
							} else if(v.traineeScore == undefined) {
								traineeScore = "";
							} else {
								traineeScore = Number(v.traineeScore).toFixed(2);
							};
							if(v.groupPositionType==1){
								v.groupPositionData='组长'
							}else if(v.groupPositionType==2){
								v.groupPositionData='副组长'
								
							}else if($.trim(v.groupPositionData)=='普通学员'){
								v.groupPositionData=''
							}
							var committeePosition = [];
							v.groupPositionData!=''?committeePosition.push(v.groupPositionData):'';
							v.traineeCommittee!=''?committeePosition.push(v.traineeCommittee):'';
							committeePosition = committeePosition.join('/')
							trainHtmlTr += '<tr data-projectCode="'+ v.projectCode +'" data-traineeId="'+v.traineeId+'">' +
								'<td class="pkid" style="text-align:center;">' + i + '</td>' +
								'<td class="project-date" style="text-align:center;">' + v.projectDate + '</td>';
								if(v.dataStates==4||v.dataStates==6){
//									$('.train-list .list-thead th.projc-id').hide();
									trainHtmlTr+='<td class="project-code" style="text-align:center;">' + v.projectCode + '</td>';
								}else{
//									$('.train-list .list-thead th.projc-id').show();
									trainHtmlTr+='<td class="project-code" style="text-align:center;"></td>';
								}
								
							trainHtmlTr+='<td class="project-name">' + v.projectName + '</td>' +
									'<td class="project-head" style="text-align:left;">' + v.projectHead + '</td>' +
									'<td class="org-name" style="text-align:center;">' + v.orgName + '</td>' +
									'<td class="dept-position-name" style="text-align:center;">' + v.deptName + v.positionName + '</td>' +
									'<td class="check-in-state" style="text-align:center;">' + checkInState + '</td>' +
									'<td class="trainee-committee" style="text-align:center;">' + committeePosition + '</td>' +
									'<td class="trainee-score" style="text-align:right;">' + traineeScore + '</td>' +
									'<td class="lookInfo" style="color:#3c4687; text-align:center;cursor: pointer;">查看</td>' +
									'</tr>';
							});
						trainListHmlTbody.append(trainHtmlTr);
					} else {
						$(trainListHmlTbody).empty();
						trainHtmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="10" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						trainListHmlTbody.append(trainHtmlTr);
					}

					//其他来往记录
					var recordsDiv = $('.records-list');
					var recordsTab = '';
					if(datas.traineeVisitingRecordsList.length > 0) {
						$(recordsDiv).empty();
						var cause;
						var receptionForm;
						var receptionArrangement;
						$.each(datas.traineeVisitingRecordsList, function(i, v) {
							i = i + 1;
							if(v.cause == 1) {
								cause = "来访";
							}
							if(v.cause == 2) {
								cause = "电话联络";
							}
							if(v.cause == 3) {
								cause = "走访";
							}
							if(v.receptionForm == 1) {
								receptionForm = "公务接待";
							}
							if(v.receptionForm == 2) {
								receptionForm = "对方付费";
							}
							if(v.receptionArrangement == 1) {
								receptionArrangement = "用餐";
							}
							if(v.receptionArrangement == 2) {
								receptionArrangement = "市内参观";
							}
							if(v.receptionArrangement == 3) {
								receptionArrangement = "旅顺参观";
							}
							if(v.receptionArrangement == 4) {
								receptionArrangement = "其他";
							}

							recordsTab = '<table class="yt-table records-tab-list" style="margin:10px auto;">' +
								'<tbody class="tbody-records">' +
								'<tr>' +
								'<td class="pk-id" style="display:none;">' + v.pkId + '</td>' +
								'<td colspan="7" style="height:35px;position: relative;">' +
								'<span style="position: absolute;text-align:center;line-height:33px; width:33px;height:33px;">' + i + '</span>' +
								'<img src="../../resources/images/open/traineeRecords.png" style="float:left; width:33px;height:33px;" >' +
								'<div style="border-bottom:1px solid #DE595A;height:32px;width:200px;margin-left:16px;">' +
								'<p class="records-edit" style="cursor: pointer;float:left;margin:6px 35px;">编辑<p>' +
								'<p class="records-delete" style="cursor: pointer;float:left;margin-top:6px">删除<p>' +
								'</div>' +
								'</td>' +
								'</tr>' +
								'<tr>' +
								'<td rowspan="6" style="width: 60px;text-align: center;">' +
								'</td>' +
								'<td class="td-rights" style="width: 90px;">洽谈日期：</td>' +
								'<td class="visit-date">' + v.visitDate + '</td>' +
								'<td class="td-rights" style="width: 70px;">事由：</td>' +
								'<td style="display:none" class="cause">' + v.cause + '</td>' +
								'<td>' + cause + '</td>' +
								'<td class="td-rights" style="width: 120px;">对接负责人：</td>' +
								'<td style="display:none" class="charge-person">' + v.chargePerson + '</td>' +
								'<td>' + v.chargePersonName + '</td>' +
								'</tr>' +
								'<tr>' +
								'<td class="td-rights">接待形式：</td>' +
								'<td style="display:none" class="reception-form">' + v.receptionForm + '</td>' +
								'<td>' + receptionForm + '</td>' +
								'<td class="td-rights" style="width: 70px;">接待安排：</td>' +
								'<td style="display:none" class="reception-arrangement">' + v.receptionArrangement + '</td>' +
								'<td>' + receptionArrangement + '</td>' +
								'<td class="td-rights">用餐安排：</td>' +
								'<td class="dining-arrangements">' + v.diningArrangements + '</td>' +
								'</tr>' +
								'<tr>' +
								'<td class="td-rights">出席人员：</td>' +
								'<td class="attendees" colspan="5">' + v.attendees + '</td>' +
								'</tr>' +
								'<tr>' +
								'<td class="td-rights">对方反馈：</td>' +
								'<td class="gift-give" colspan="5">' + v.giftGive + '</td>' +
								'</tr>' +
								'<tr>' +
								'<td class="td-rights">我院反馈：</td>' +
								'<td class="courtyard-return" colspan="5">' + v.courtyardReturn + '</td>' +
								'</tr>' +
								'<tr>' +
								'<td class="td-rights">备注：</td>' +
								'<td class="remarks" colspan="5" style="width:960px;">' + v.remarks + '</td>' +
								'</tr>' +
								'</tbody>' +
								'</table>';
							recordsDiv.append(recordsTab);
						});

					}
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}

			},
		});

	},
	getOrgType:function(orgType){
		//1:央企集团本部 2:央企二级公司 3:央企三级公司 4:省属企业 5:市属企业 6:其他
		var orgTypes;
		if (orgType == "1") {
			orgTypes = "央企集团本部";
		}else if(orgType == "2"){
			orgTypes = "央企集团本部";
		}else if(orgType == "3"){
			orgTypes = "央企三级公司";
		}else if(orgType == "4"){
			orgTypes = "省属企业";
		}else if(orgType == "5"){
			orgTypes = "市属企业";
		}else if(orgType == "6"){
			orgTypes = "其他";
		}else{
			orgTypes ="";
		}
		return orgTypes;
	},
	//初始化修改功能弹窗
	clearAddAlert: function() {
		$('#visit-date').val("");
		$('.add-cause').setSelectVal("");
		$('.add-charge-person').setSelectVal("");
		$('.add-reception-form').setSelectVal("");
		$('.add-reception-arrangement').setSelectVal("");
		$('.add-dining-arrangements').val("");
		$('.add-attendees').val("");
		$('.add-gift-give').val("");
		$('.add-courtyard-return').val("");
		$('.add-remarks').val("");
	},

	//新增修改
	addInfo: function(pkId) {
		var traineeId = $yt_common.GetQueryString("traineeId");
		var visitDate = $('#visit-date').val();
		var cause = $('.add-cause').val();
		var chargePerson = $('.add-charge-person').val();
		var receptionForm = $('.add-reception-form').val();
		var receptionArrangement = $('.add-reception-arrangement').val();
		var diningArrangements = $('.add-dining-arrangements').val();
		var attendees = $('.add-attendees').val();
		var giftGive = $('.add-gift-give').val();
		var courtyardReturn = $('.add-courtyard-return').val();
		var remarks = $('.add-remarks').val();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "trainee/addOrupdateTraineEvisitingRecords",
			data: {
				pkId: pkId,
				traineeId: traineeId,
				visitDate: visitDate,
				cause: cause,
				chargePerson: chargePerson,
				receptionForm: receptionForm,
				receptionArrangement: receptionArrangement,
				diningArrangements: diningArrangements,
				attendees: attendees,
				giftGive: giftGive,
				courtyardReturn: courtyardReturn,
				remarks: remarks
			},
			async: false,
			beforeSend: function() {
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				if (data.flag == 0) {
					$yt_baseElement.hideLoading();
					carList.getPlanListInfo();
				} else{
					$yt_baseElement.hideLoading();
					$yt_alert_Model.prompt("操作失败！");
				}
			}
		});
	},

	//新增修改记录弹窗
	addShowAlert: function() {
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
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
			$(".yt-edit-alert,#heard-nav-bak").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
		/** 
		 * 确定
		 */
		$('.add-shuttle-box .yt-eidt-model-bottom .yt-model-sure-btn').off().on("click", function() {
			//隐藏页面中自定义的表单内容  
			$(".yt-edit-alert,#heard-nav-bak").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
	},

	//查看培训记录弹窗
	lookInfoAlert: function() {
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$(".look-info").show();
		/** 
		 * 调用算取div显示位置方法 
		 */
		$yt_alert_Model.getDivPosition($(".look-info"));
		/* 
		 * 调用支持拖拽的方法 
		 */
		$yt_model_drag.modelDragEvent($(".look-info .yt-edit-alert-title"));
		/** 
		 * 点击取消方法 
		 */
		$('.look-info .yt-eidt-model-bottom .yt-model-sure-btn').off().on("click", function() {
			//隐藏页面中自定义的表单内容  
			$(".yt-edit-alert,#heard-nav-bak").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
	}
};
$(function() {
	//初始化方法
	carList.init();
});