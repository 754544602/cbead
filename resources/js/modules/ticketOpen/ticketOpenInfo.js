var ticketOpenInfo = {
	//初始化方法
	init: function() {
		ticketOpenInfo.getClassInfo();
		var projectType = $yt_common.GetQueryString("projectType");
		if (projectType == 3) {//项目 类型为选学不显示委托单位信息
			//隐藏委托单位信息标题
			$(".entrust-info-title").hide();
			//隐藏委托单位信息内容
			$(".entrust-info").hide();
		}else{
			$(".entrust-info-title").show();
			$(".entrust-info").show();
		}
		//页签跳转
		$(".tab-title-list button").click(function() {
			$(this).addClass("active").siblings().removeClass("active");
			operate = $(this).text();
			if(operate == "• 项目开票") {
				$(".programme").show();
				//显示项目开票
				$('.bill-div').show();
				//隐藏班级信息
				$('.class-div').hide();
				ticketOpenInfo.getPlanListInfo();
				ticketOpenInfo.getPersonListInfo();
			};
			if(operate == "• 班级信息") {
				$(".programme").hide();
				//显示班级信息
				$('.class-div').show();
				//隐藏项目开票
				$('.bill-div').hide();
				ticketOpenInfo.getClassInfo();
			};

		});
		//返回按钮
		$('.page-return-btn').on('click', function() {
			window.history.back();
		});
		//发票类型下拉框切换事件
		$(".billing-inf-alert #project-states").change(function(){
			if($(this).val()==1){
				ticketOpenInfo.clearOpenTicket();
				//切换至普通发票
				$(".billing-inf-alert table span.per-span").text("*");
//				$(".billing-inf-alert table span.comp-span").text("");
//				$(".billing-inf-alert table span.comp-label-span").text("");
				$(".billing-inf-alert .is-not-comp label input[value='1']").setRadioState("check");
				$(".billing-inf-alert .is-not-comp").show();
			}else{
				ticketOpenInfo.clearOpenTicket();
				//切换至增值税发票
				$(".billing-inf-alert table span.per-span").text("*");
				$(".billing-inf-alert table span.comp-span").text("*");
				$(".billing-inf-alert table span.comp-label-span").text("*");
				$(".billing-inf-alert .is-not-comp").hide();
				
			}
			//console.log($(this).val());
		});
		//修改开票信息单选按钮
		$(".billing-inf-alert .is-not-comp label").click(function(){
			var thisVal=$(this).find('input:checked').val();
			if(thisVal==1){
				ticketOpenInfo.clearOpenTicket();
				//选中个人/事业单位
				$(".billing-inf-alert table span.per-span").text("*");
				//$(".billing-inf-alert table span.comp-span").text("");
			}else if(thisVal==2){
				ticketOpenInfo.clearOpenTicket();
				//选中单位
				$(".billing-inf-alert table span.per-span").text("*");
				$(".billing-inf-alert table span.comp-span").text("*");
			}
		});
		//班级信息模糊查询
		$(".search-btn").click(function(){
			ticketOpenInfo.getPersonListInfo();
		});
		$('#checkBox1').change(function(){
			var searchBtn = "search";
			ticketOpenInfo.getPersonListInfo(searchBtn);
		});
		$('#checkBox2').change(function(){
			var searchBtn = "search";
			ticketOpenInfo.getPersonListInfo(searchBtn);
		});
		//点击修改开票信息
		$('.edit-bill-info').click(function(){
			var projectCode = $yt_common.GetQueryString("projectCode");
			//初始化开票弹窗
			ticketOpenInfo.clearOpenTicket();
			ticketOpenInfo.clearBillInfoAlert();
			//ticketOpenInfo.trainOrcompanyIsCheck();
			$(".billing-inf-alert table span.per-span").text("*");
			$('#project-states').niceSelect();
			//获取标识是否有选中行的标识数据----隐藏数据
				var allCheck = $('.company-list tbody').find('.check');
//				}else{//操作的是个人信息列表
				var	stuCheck = $('.trainee-bill-table tbody').find('.check');
				var allChekData=allCheck.parents('tr').data('data');
				var stuData=stuCheck.parents('tr').data('data');
//				}
				if(allCheck.length+stuCheck.length == 1){
					if(allCheck.length!=0){
						//把值放到隐藏标签里
						$('.hid-project-code').val(projectCode);
						$('.hid-types').val(allChekData.type);
						$('.hid-order-num').val(allChekData.orderNum);
						$('.hid-trainee-or-group-id').val(allChekData.groupId);
					}else if(stuCheck.length!=0){
						//把值放到隐藏标签里
						$('.hid-project-code').val(projectCode);
						$('.hid-types').val(stuData.type);
						$('.hid-order-num').val(stuData.orderNum);
						$('.hid-trainee-or-group-id').val(stuData.traineeId);
					}
					//调用查询单位/个人开票信息方法
					ticketOpenInfo.getCompanyInfo(projectCode,$('.hid-types').val(),$('.hid-trainee-or-group-id').val());
					//调用弹窗
					ticketOpenInfo.billingInfoAlert();
				}else{//选中的是多行数据进行操作的
					$yt_alert_Model.prompt("请选中一行数据进行操作", 2000);
				}
//			}else{//没有被选中行的表格
//				$yt_alert_Model.prompt("请选中一行数据进行操作", 2000);
//			}
		});
		//开具发票弹窗发票类型切换
		$(".bill-invoice-type").change(function(){
			if ($(".bill-invoice-type").val() == "1") {//普通发票
				$(".bill-check").show();
				$(".telephone-span,.address-span,.bank-span,.account-span").hide();
				
				$(".duty-telephone").attr("validform","{isNull:false,blurFlag:false,msg:'请输入电话'}");
				$(".duty-address").attr("validform","{isNull:false,blurFlag:false,msg:'请输入地址'}");
				$(".duty-registered-bank").attr("validform","{isNull:false,blurFlag:false,msg:'请输入开户行'}");
				$(".duty-account").attr("validform","{isNull:false,blurFlag:false,msg:'请输入账号'}");
				$(".duty-tax-number,.duty-telephone,.duty-address,.duty-registered-bank,.duty-account").removeClass("valid-hint");
				$(".duty-tax-number,.duty-telephone,.duty-address,.duty-registered-bank,.duty-account").next().text("");
			}else{//专用发票
				$(".bill-check").hide();
				$(".tax-number-span,.telephone-span,.address-span,.bank-span,.account-span").show();
				
				$(".duty-tax-number").attr("validform","{isNull:true,blurFlag:true,msg:'请输入税号'}");
				$(".duty-telephone").attr("validform","{isNull:true,blurFlag:true,msg:'请输入电话'}");
				$(".duty-address").attr("validform","{isNull:true,blurFlag:true,msg:'请输入地址'}");
				$(".duty-registered-bank").attr("validform","{isNull:true,blurFlag:true,msg:'请输入开户行'}");
				$(".duty-account").attr("validform","{isNull:true,blurFlag:true,msg:'请输入账号'}");
			}
		});
		$(".group-check").change(function(){//企业单选
			$(".org-name-span,tax-number-span").show();
			$(".tax-number-span").show();
			$(".duty-telephone").attr("validform","{isNull:false,blurFlag:false,msg:'请输入电话'}");
			$(".duty-address").attr("validform","{isNull:false,blurFlag:false,msg:'请输入地址'}");
			$(".duty-registered-bank").attr("validform","{isNull:false,blurFlag:false,msg:'请输入开户行'}");
			$(".duty-account").attr("validform","{isNull:false,blurFlag:false,msg:'请输入正确格式电话号！'}");
		});
		$(".person-check").change(function(){//个人/事业单位单选
			$(".tax-number-span,.telephone-span,.address-span,.bank-span,.account-span").hide();
			$(".duty-tax-number").attr("validform","{isNull:false,blurFlag:false,msg:'请输入税号'}");
			$(".duty-telephone").attr("validform","{isNull:false,blurFlag:false,msg:'请输入电话'}");
			$(".duty-address").attr("validform","{isNull:false,blurFlag:false,msg:'请输入地址'}");
			$(".duty-registered-bank").attr("validform","{isNull:false,blurFlag:false,msg:'请输入开户行'}");
			$(".duty-account").attr("validform","{isNull:false,blurFlag:false,msg:'请输入账号'}");
			$(".duty-tax-number").removeClass("valid-hint");
			$(".duty-tax-number").next().text("");
		});
		//开具发票点击按钮
		$('.write-bill-btn').click(function(){
			var projectCode = $yt_common.GetQueryString("projectCode");
//			/ticketOpenInfo.trainOrcompanyIsCheck();
			//调用初始化开具发票弹窗
			ticketOpenInfo.clearWriteBillAlert();
			//初始化下拉框
			$('.duty-invoiceOrder-type').niceSelect();
					var allCheck = $('.company-list tbody').find('.check');
					var stuCheck = $('.trainee-bill-table tbody').find('.check');
					var allChekData=allCheck.parents('tr').data('data');
					var stuData=stuCheck.parents('tr').data('data');
				if(allCheck.length+stuCheck.length == 1){
					if(allCheck.length!=0){
						//把值放到隐藏标签里
						$('.hid-project-code').val(projectCode);
						$('.hid-types').val(allChekData.type);
						$('.hid-order-num').val(allChekData.orderNum);
						$('.hid-trainee-or-group-id').val(allChekData.groupId);
					}else if(stuCheck.length!=0){
						//把值放到隐藏标签里
						$('.hid-project-code').val(projectCode);
						$('.hid-types').val(stuData.type);
						$('.hid-order-num').val(stuData.orderNum);
						$('.hid-trainee-or-group-id').val(stuData.traineeId);
					}
					ticketOpenInfo.allfrc($('.write-billing-alert'));
					ticketOpenInfo.getOpnTicketMsg(projectCode,$('.hid-types').val(),$('.hid-trainee-or-group-id').val());
					//调用弹窗
					ticketOpenInfo.writeBillingAlert();
					$('#project-states').niceSelect();
				}else{//是多行数据进行操作的
					$yt_alert_Model.prompt("请选中一行数据进行操作", 2000);
				}
//			}else{//没有被选中行的表格
//				$yt_alert_Model.prompt("请选中一行数据进行操作", 2000);
//			}
		});
		//保存默认税控机
		$('.write-billing-alert .save-fcr-btn').off().click(function(){
			ticketOpenInfo.savefrc($('.write-billing-alert'));
			return false;
		})
		$('.mergeInvoiceAlert .save-fcr-btn').off().click(function(){
			ticketOpenInfo.savefrc($('.mergeInvoiceAlert'));
			return false;
		})
		//开具发票确定按钮
		$('.duty-sure-btn-table .duty-sure-btn').click(function(){
			if($('.write-billing-alert').find('.frcUl input[type=radio]:checked').val()==undefined){
				$yt_alert_Model.prompt('请选择税控机');
				return false;
			}
			var projectCode = $('.hid-project-code').val();
			var types = $('.hid-types').val();
			var traineeOrGroupId = $('.hid-trainee-or-group-id').val();
			var orderNum = $('.hid-order-num').val();
			var invoiceModel = "";
			//数量
			var count = $('.iduty-invoice-number').val();
			//单价
			var price = $('.iduty-invoice-unit-price').val();
			//总金额
			var tuition = $('.iduty-tuition').val();
			if(!isNaN(parseInt(count)) && !isNaN(parseInt(price)) && !isNaN(parseInt(tuition)) && tuition !=""){//满足数量，单价，总金额都为数字且总金额不为空
				ticketOpenInfo.addDutyInfo(projectCode,types,traineeOrGroupId,orderNum);
					//隐藏页面中自定义的表单内容  
				$(".write-billing-alert").hide();
				//隐藏蒙层  
				$("#pop-modle-alert").hide();
			}else{
				if(isNaN(parseInt(count))){
					$yt_alert_Model.prompt("数量只能为数字！");
				}else if(isNaN(parseInt(price))){
					$yt_alert_Model.prompt("单价只能为数字！");
				}else if(isNaN(parseInt(tuition))){
					$yt_alert_Model.prompt("总金额只能为数字！");
				}else{
					$yt_alert_Model.prompt("总金额不能能空！");
				}
			}
		});
		
		//数量输入框失去焦点事件
		$('.iduty-invoice-number').blur(function(){
			//数量
			var count = $('.iduty-invoice-number').val();
			if(count == ""){
				count = 0;
			}
			//单价
			var price = $('.iduty-invoice-unit-price').val();
			if(price == ""){
				price = 0;
			}
			count = parseInt(count);
			price = parseInt(price);
			if (!isNaN(count)) {//是数字
				if(count != "" && price != ""){//数量和单价都不为0才会调用计算税额的方法
					$('.iduty-tuition').val(count*price);
					ticketOpenInfo.getTaxRate();
				}
			} else{//不是数字
				$yt_alert_Model.prompt("数量只能为数字！");
			}
			
		});
		//价格输入框失去焦点事件
		$('.iduty-invoice-unit-price').blur(function(){
			//数量
			var count = $('.iduty-invoice-number').val();
			if(count == ""){
				count = 0;
			}
			//单价
			var price = $('.iduty-invoice-unit-price').val();
			if(price == ""){
				price = 0;
			}
			count = parseInt(count);
			price = parseInt(price);
			if (!isNaN(count)) {//是数字
				if(count != "" && price != ""){//数量和单价都不为0才会调用计算税额的方法
					$('.iduty-tuition').val(count*price);
					ticketOpenInfo.getTaxRate();
				}
			}else{
				$yt_alert_Model.prompt("单价只能为数字！");
			}
		});
		//总金额输入框失去焦点
		$('.iduty-tuition').blur(function(){
			//总金额
			var tuition = $('.iduty-tuition').val();
			tuition = parseInt(tuition);
			if(tuition == ""){
				tuition = 0;
			}
			if (!isNaN(tuition)) {//是数字
				if(tuition != ""){//总金额输入框不为空才调用计算总税额方法
					ticketOpenInfo.getTaxRate();
				}
			}else{
				$yt_alert_Model.prompt("金额只能为数字！");
			}
		});
		//选择开具发票选择服务类型
		$('.duty-invoiceOrder-type').change(function(){
			ticketOpenInfo.getTaxRate();
		});
		//点击手动开具发票
		$('.manual-bill-btn').click(function(){
			if($('.bill-div tbody input[type=checkbox]:checked').length==0){
				$yt_alert_Model.prompt('请选中一行数据进行操作')
			}else if($('.bill-div tbody input[type=checkbox]:checked').length!=1){
				$yt_alert_Model.prompt('只可选中一行数据进行操作')
			}else{
				alertDiv();
				var data = $('.yt-table-active').data('data');
				$('.manual-sure-btn').off().click(function(){
					if($yt_valid.validForm($('.manual-invoice-table'))){
						if(data.type==1){
							ticketOpenInfo.manualInvoice(data.type,data.groupId,data.orderNum)
						}else if(data.type==2){
							ticketOpenInfo.manualInvoice(data.type,data.traineeId,data.orderNum)
						}
						
					}
				})
			}
			$('.manual-invoice-dollar').off().blur(function(){
				$(this).val($yt_baseElement.fmMoney($(this).val(),2));
			})
			function alertDiv(){
				/** 
				 * 显示编辑弹出框和显示顶部隐藏蒙层 
				 */
				$(".manual-invoice-alert").show();
				/* 
				 * 调用支持拖拽的方法 
				 */
				$yt_model_drag.modelDragEvent($(".manual-invoice-alert .yt-edit-alert-title"));
				/** 
				 * 点击取消方法 
				 */
				/**
				 * 计算弹窗位置
				 */
			  	$yt_alert_Model.setFiexBoxHeight($(".manual-invoice-alert .yt-edit-alert-main"));
		        $yt_alert_Model.getDivPosition($(".manual-invoice-alert"));
				$('.manual-invoice-alert .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
					//隐藏页面中自定义的表单内容  
					$(".manual-invoice-alert").hide();
					//隐藏蒙层  
					$("#pop-modle-alert").hide();
				});
			}
		})
		//点击合并开票
		$('.merge-bill-btn').click(function(){
			//判断
			if($('.check-all-tab tbody input[type=checkbox]:checked').length==0&&$('.trainee-bill-table tbody input[type=checkbox]:checked').length==0){
				$yt_alert_Model.prompt('请选择数据');
				return false;
			}
			ticketOpenInfo.allfrc($('.mergeInvoiceAlert'));
			//初始化
			$('.invoice-model-td input').setRadioState('uncheck');
			$('.mergeInvoiceTable input[type=text]').val('');
			$('.mergeInvoiceAlert .duty-table input[type=text]').val('');
			$('.taxt-rate').text('');
			$('.taxt-rate-money').text('');
			$('.invoicePeople').empty();
			var traineeOrGroupIds = [];
			var types = [];
			$.each($('.trainee-bill-table tbody input[type=checkbox]:checked'), function(i,n) {
				var datas = $(n).parents('tr').data('data');
				var htmlTr = '<li class="yt-list-li" style="float:left;border:none;width:135px">'+
							'<label class="check-label yt-radio">'+
							'<input type="radio" name="text"/>'+
							'<span>'+datas.realName+'</span>'+
							'<img src="../../resources/images/icons/eyes.png" class="eyes" style="margin-left:5px;"/>'+
							'</label>'+
							'</li>';
							htmlTr = $(htmlTr).data('data',datas);
							$('.invoicePeople').append(htmlTr);
							traineeOrGroupIds.push($(n).parents('tr').data('data').traineeId);
							types.push(2);
				});
				$.each($('.check-all-tab tbody input[type=checkbox]:checked'), function(i,n) {
				var datas = $(n).parents('tr').data('data');
				var htmlTr = '<li class="yt-list-li" style="float:left;border:none;">'+
							'<label class="check-label yt-radio">'+
							'<input type="radio" name="text"/>'+
							'<span>'+datas.groupName+'</span>'+
							'<img src="../../resources/images/icons/eyes.png" class="eyes" style="margin-left:5px;"/>'+
							'</label>'+
							'</li>';
							htmlTr = $(htmlTr).data('data',datas);
							$('.invoicePeople').append(htmlTr);
							traineeOrGroupIds.push($(n).parents('tr').data('data').groupId);
							types.push(1);
				});
				traineeOrGroupIds = traineeOrGroupIds.join(',');
				types = types.join(',');
			$('.eyes').hover(function(){
				$(this).attr('src','../../resources/images/icons/eyes-hover.png')
			},function(){
				$(this).attr('src','../../resources/images/icons/eyes.png')
			})
			//鼠标悬停小眼睛，弹出发票信息
			$('.eyes').tooltip({
				content:function(){
					var lis= $(this).parents('li');
					var projectCode = $yt_common.GetQueryString("projectCode");
					var htmls;
					htmls = getInvoice(projectCode,lis,htmls);
					return htmls;
				},
				onShow: function() {
					$(this).tooltip('tip').css({
						backgroundColor: '#666',
						borderColor: '#666',
						color:'#fff'
					});
				}
			});
			//获取开票信息
			function getInvoice(projectCode,lis,htmls){
						var pkId = lis.data('data').traineeId;
						if(pkId==undefined){
							pkId = lis.data('data').groupId;
						}
						$.ajax({
							type:"post",
							url:$yt_option.base_path + "finance/projectInvoice/getInvoice",
							async:false,
							data:{
								projectCode:projectCode,
								types:lis.data('data').type,
								traineeOrGroupId:pkId
							},
							beforeSend:function(){
//								$yt_baseElement.showLoading();
							},
							success:function(data){
								if(data.flag==0){
									if(data.data==null){
										data.data={
											invoiceModel:'',
											orgName:'',
											invoiceType:'',
											taxNumber:'',
											telephone:'',
											address:'',
											registeredBank:'',
											account:''
										}
									}
									if(data.data.invoiceModel==1){
										data.data.invoiceModelVel='个人或事业单位'
									}else if(data.data.invoiceModel==2){
										data.data.invoiceModelVel='单位'
									}else{
										data.data.invoiceModelVel=''
									}
									if(data.data.invoiceType=='0'){
										data.data.invoiceTypeVel='暂不开票'
									}else if(data.data.invoiceType==1){
										data.data.invoiceTypeVel='普通发票'
									}else if(data.data.invoiceType==2){
										data.data.invoiceTypeVel='增值税发票'
									}else{
										data.data.invoiceTypeVel='';
									}
									lis.data('invoice',data.data);
									htmls='<table>'+
									'<tr style="height:30px">'+
										'<td align="right">发票类型：</td>'+
										'<td style="width:100px">'+data.data.invoiceModelVel+'</td>'+
										'<td align="right">发票类型：</td>'+
										'<td style="width:100px">'+data.data.invoiceTypeVel+'</td>'+
									'</tr>'+
									'<tr style="height:30px">'+
										'<td align="right">名称：</td>'+
										'<td>'+data.data.orgName+'</td>'+
										'<td align="right">税号：</td>'+
										'<td>'+data.data.taxNumber+'</td>'+
									'</tr>'+
									'<tr style="height:30px">'+
										'<td align="right">电话：</td>'+
										'<td>'+data.data.telephone+'</td>'+
										'<td align="right">地址：</td>'+
										'<td>'+data.data.address+'</td>'+
									'</tr>'+
									'<tr style="height:30px">'+
										'<td align="right">开户行：</td>'+
										'<td>'+data.data.registeredBank+'</td>'+
										'<td align="right">账号：</td>'+
										'<td>'+data.data.account+'</td>'+
									'</tr>'+
								'</table>';
								}else{
									$yt_alert_Model.prompt('查询失败')
								}
								$yt_baseElement.hideLoading();
							},error:function(){
								$yt_baseElement.hideLoading();
								$yt_alert_Model.prompt('网络异常，请稍后重试')
							}
						});
						return htmls;
			}
			$('.invoicePeople input[type=radio]').change(function(){
				$yt_baseElement.showLoading()
					if($(this).parents('li').data('invoice')==undefined){
						var lis= $(this).parents('li');
						var projectCode = $yt_common.GetQueryString("projectCode");
						getInvoice(projectCode,lis);
					}
					$('.mergeInvoiceTable').setDatas($(this).parents('li').data('invoice'));
					$('.mergeInvoiceTable input[type=radio][name=radioType1][value='+$(this).parents('li').data('invoice').invoiceModel+']').setRadioState('check');
					$('.mergeInvoiceTable input[type=radio][name=radioType][value='+$(this).parents('li').data('invoice').invoiceType+']').setRadioState('check');
					if($('.mergeInvoiceTable input[type=radio][name=radioType1]:checked').val()==2){
						$('.mergeInvoiceTable .invoice-model-td label').hide();
						$('.invoiceModelTitle').hide();
					}else{
						$('.mergeInvoiceTable .invoice-model-td label').show();
						$('.invoiceModelTitle').show();
					}
					$yt_baseElement.hideLoading()
			})
			$('.mergeInvoiceTable .invoice-type').change(function(){
				if($(this).val()==2){
					$('.mergeInvoiceTable .invoice-model-td label').hide();
					$('.invoiceModelTitle').hide();
				}else{
					$('.mergeInvoiceTable .invoice-model-td label').show();
					$('.invoiceModelTitle').show();
				}
			})
			$('.mergeInvoiceAlert .invoice-invoiceOrder-type,.mergeInvoiceTable .invoice-type').niceSelect();
			if($('.mergeInvoiceTable .invoice-type').val()==2){
				$('.mergeInvoiceTable .invoice-model-td label').hide();
				$('.invoiceModelTitle').hide();
			}else{
				$('.mergeInvoiceTable .invoice-model-td label').show();
				$('.invoiceModelTitle').show();
			}
			$('.invoice-invoice-unit-price').blur(function(){
				$(this).val($(this).val().replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g, ''));
				if($(this).val()!=''&&$('.invoice-invoice-number').val()!=''){
					$('.invoice-tuition').val($(this).val()*$('.invoice-invoice-number').val());
					rate()
				}
			});
			$('.invoice-invoice-number').blur(function(){
				$(this).val($(this).val().replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g, ''));
				if($(this).val()!=''&&$('.invoice-invoice-unit-price').val()!=''){
					$('.invoice-tuition').val($(this).val()*$('.invoice-invoice-unit-price').val());
					rate()
				}
			});
			$('.invoice-tuition').blur(function(){
				$(this).val($(this).val().replace(/[^\d{1,}\.\d{1,}|\d{1,}]/g, ''));
				rate()
			});
			$('.mergeInvoiceAlert .invoice-invoiceOrder-type').change(function(){
				rate()
			})
			function rate(){
				var tuition = Number($('.invoice-tuition').val());
				var invoiceOrderType = $('.mergeInvoiceAlert .invoice-invoiceOrder-type').val();
				
				if(invoiceOrderType == 1||invoiceOrderType == 4||invoiceOrderType == 5){//培训费
					//税率
					$('.taxt-rate').text("3%");
					//税额
					$('.taxt-rate-money').text((tuition-(tuition/(1.03))).toFixed(2));
				}else if(invoiceOrderType == 2||invoiceOrderType == 3||invoiceOrderType == 6){//住宿费
					//税率
					$('.taxt-rate').text("6%");
					//税额
					$('.taxt-rate-money').text((tuition-(tuition/(1.06))).toFixed(2));
				}
			}
			/** 
	         * 显示编辑弹出框和显示顶部隐藏蒙层 
	         */  
	        $(".mergeInvoiceAlert").show();  
	        /** 
	         * 调用算取div显示位置方法 
	         */  
	        $yt_alert_Model.setFiexBoxHeight($(".mergeInvoiceAlert .yt-edit-alert-main"));
	        $yt_alert_Model.getDivPosition($(".mergeInvoiceAlert"));  
	        /* 
	         * 调用支持拖拽的方法 
	         */  
	        $yt_model_drag.modelDragEvent($(".mergeInvoiceAlert .yt-edit-alert-title"));  
	        /** 
	         * 点击取消方法 
	         */  
	        $('.mergeInvoiceAlert .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {  
	            //隐藏页面中自定义的表单内容  
	            $(".mergeInvoiceAlert").hide();  
	        });  
	        
	        $('.mergeInvoiceAlert .yt-eidt-model-bottom .yt-model-sure-btn').off().on('click',function(){
	        	var invoiceModel =  $('.mergeInvoiceTable .invoice-type').val();
	        	var invoiceType =  $('.mergeInvoiceTable input[type=radio][name=radioType]:checked').val();
	        	if($('.mergeInvoiceAlert').find('.frcUl input[type=radio]:checked').val()==undefined){
					$yt_alert_Model.prompt('请选择税控机');
					return false;
				}
	        	if(invoiceType==undefined){
	        		$yt_alert_Model.prompt('请选择发票抬头');
	        		return false;
	        	}
	        	//专制税发票
	        	if(invoiceModel==2){
	        		if($yt_valid.validForm($(".mergeInvoiceTable"))){
	        			ticketOpenInfo.mergeBillFn(types,traineeOrGroupIds,1);
	        			$(".mergeInvoiceAlert").hide();
	        		}
	        	}
	        	//普票+个人
	        	if(invoiceModel==1&&invoiceType==1){
	        		if($yt_valid.validForm($("#invoice-org-name"))){
	        			ticketOpenInfo.mergeBillFn(types,traineeOrGroupIds,1);
	        			
	        			$(".mergeInvoiceAlert").hide();
	        		}
	        	}
	        	//普票+单位
	        	if(invoiceModel==1&&invoiceType==2){
	        		if($yt_valid.validForm($("#invoice-tax"))){
	        			ticketOpenInfo.mergeBillFn(types,traineeOrGroupIds,1);
	        			$(".mergeInvoiceAlert").hide();
	        		}
	        	}
	        });
		});
		//点击取消开票
		$('.separate-bill-btn').click(function(){
			//取消标识
			var traineeOrGroupIds = [];
			var types = [];
			$.each($('.trainee-bill-table tbody input[type=checkbox]:checked'), function(i,n) {
							traineeOrGroupIds.push($(n).parents('tr').data('data').traineeId);
							types.push(2);
				});
				$.each($('.check-all-tab tbody input[type=checkbox]:checked'), function(i,n) {
							traineeOrGroupIds.push($(n).parents('tr').data('data').groupId);
							types.push(1);
				});
				traineeOrGroupIds = traineeOrGroupIds.join(',');
				types = types.join(',');
			ticketOpenInfo.mergeBillFn(types,traineeOrGroupIds,2);
		});
		//点击修改备注
		$('.edit-remark-btn').click(function(){
			ticketOpenInfo.trainOrcompanyIsCheck();
			var types = $('.hid-types').val();
			var allCheck;
			if(types == 1){//操作的是单位列表
				allCheck = $('.company-list tbody input[type=checkbox]:checked');
			}else{//操作的是个人信息列表
				allCheck = $('.trainee-bill-table tbody input[type=checkbox]:checked');
				
			};
			if(allCheck.length == 1){
				var remark = allCheck.parent().parent().parent().find('.invoice-remarks');
				$('.edit-remark .remark-text').val(remark.text());
				//调用弹窗
				ticketOpenInfo.editRemarkAlert();
			}else{//是多行数据进行操作的
				$yt_alert_Model.prompt("请选中一行数据进行操作", 2000);
			}
			
		});
		//点击搜索个人信息
		$(".bill-btn-div").on('click','.search-person-btn',function(){
			var searchBtn = "search";
			ticketOpenInfo.getPersonListInfo(searchBtn);
		});
		//修改备注确定按钮
		$('.remark-sure-btn').on('click',function(){
			//隐藏页面中自定义的表单内容  
			$(".edit-remark-alert").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
			ticketOpenInfo.invoiceRemarksFn();
		});
		//查看单位开票信息详情
		$('.company-list tbody').on('click','.look-info',function(){
			var projectCode = $yt_common.GetQueryString("projectCode");
			var types = $(this).parent().parent().find('.types').val();
			var traineeOrGroupId = $(this).parent().parent().find('.trainee-or-group-id').val();
			ticketOpenInfo.lookBiilInfo(projectCode,types,traineeOrGroupId);
			ticketOpenInfo.lookBillingInfoAlert();
		});
		//查看个人开票信息详情
		$('.class-tbody').off().on('click','.look-info',function(){
			var projectCode = $yt_common.GetQueryString("projectCode");
			var types = $(this).parent().parent().find('.types').val();
			var traineeOrGroupId = $(this).parent().parent().find('.trainee-or-group-id').val();
			ticketOpenInfo.lookBiilInfo(projectCode,types,traineeOrGroupId);
			ticketOpenInfo.lookBillingInfoAlert();
		});
		//点击导出  
		$(".invoice-export").on("click", function() {
			//获取被选中行的数据
			var projectCode =$yt_common.GetQueryString("projectCode");
			var selectParam = $('#keyword').val();
			var downUrl = $yt_option.base_path + "finance/projectInvoice/downloadProjectInvoice";
			$.ajaxDownloadFile({
				url: downUrl,
				data: {
					projectCode: projectCode,
					selectParam: selectParam,
					checkInState: "",
					isAdmission: "",
					invoiceStates: "",
					isDownload: true
				}
			});
		});
		//全选  
		$("input.check-all").change(function() {
			//判断自己是否被选中  
			if($(this).parent().hasClass("check")) {
				//设置反选  
				$(this).parents("table").find("tbody input[type='checkbox']").setCheckBoxState("uncheck");
				$(this).parents("table").find('tbody tr').removeClass('yt-table-active');
			} else {
				//调用设置选中方法,全选  
				$(this).parents("table").find("tbody input[type='checkbox']").setCheckBoxState("check");
				$(this).parents("table").find('tbody tr').addClass('yt-table-active');
			}
			
		});
		//修改全选按钮状态
		$(".bill-div tbody").on("change","input[type='checkbox']",function (){
			if($(this).parents("table").find("tbody tr").length != $(this).parents("table").find("tbody input[type='checkbox']:checked").length){
				$(this).parents("table").find(".check-all").setCheckBoxState("uncheck");
			}else{
				$(this).parents("table").find(".check-all").setCheckBoxState("check");
			}
			if($(this).is(':checked')){
				$(this).addClass('yt-table-active');
			}else{
				$(this).removeClass('yt-table-active');
			}
		});
		$(".ticket-open-tbody,.trainee-bill-table tbody").on('click','tr',function(){
			if($(this).hasClass('yt-table-active')){
				$(this).removeClass('yt-table-active');
				$(this).find('input[type=checkbox]').setCheckBoxState('uncheck')
			}else{
				$(this).addClass('yt-table-active');
				$(this).find('input[type=checkbox]').setCheckBoxState('check')
			}
			if($(this).parents("table").find("tbody tr").length != $(this).parents("table").find("tbody input[type='checkbox']:checked").length){
				$(this).parents("table").find(".check-all").setCheckBoxState("uncheck");
			}else{
				$(this).parents("table").find(".check-all").setCheckBoxState("check");
			}
			return false;
		})
		$('.person-list-div tbody,.company-list tbody').on('click','.invoice-states',function(){
			/** 
			 * 显示编辑弹出框和显示顶部隐藏蒙层 
			 */
			$(".invoiceHistory").show();
			/* 
			 * 调用支持拖拽的方法 
			 */
			$yt_model_drag.modelDragEvent($(".invoiceHistory .yt-edit-alert-title"));
			/** 
			 * 点击取消方法 
			 */
			$('.invoiceHistory .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
				//隐藏页面中自定义的表单内容  
				$(".invoiceHistory").hide();
				//隐藏蒙层  
				$("#pop-modle-alert").hide();
			});
			var traineeOrGroupId="";
			//判断是否是公司还是个人
				var types = $(this).parents('tr').data('data').type;
				//当前tr的下标
				var thisIndex=$(this).parents('tr').index();
				//当前td所合并的行
				var thisTd=$(this).attr('rowspan');
				if(thisTd==null){
					if(types==1){
						traineeOrGroupId=$(this).parents('tr').data('data').groupId;
	      			}else if(types==2){
						traineeOrGroupId=$(this).parents('tr').data('data').traineeId;
					}
				}else{
					thisTd=thisTd-1;
					for (var i=0;i<=thisTd;i++) {
						if(types==1){
							if(traineeOrGroupId==""){
								traineeOrGroupId=$(this).parents('tbody').find('tr').eq(thisIndex+i).data('data').groupId;
							}else{
								traineeOrGroupId+=","+$(this).parents('tbody').find('tr').eq(thisIndex+i).data('data').groupId;
							}
						}else if(types==2){
							if(traineeOrGroupId==""){
								traineeOrGroupId=$(this).parents('tbody').find('tr').eq(thisIndex+i).data('data').traineeId;
							}else{
								traineeOrGroupId+=","+$(this).parents('tbody').find('tr').eq(thisIndex+i).data('data').traineeId;
							}
						}
					}
				}
					
					console.log(traineeOrGroupId);
				var projectCode = $yt_common.GetQueryString("projectCode")
				var tbHtml ;
				$.ajax({
						type: "post", //ajax访问方式 默认 "post"  
						url: $yt_option.base_path + "finance/projectInvoice/getInvoiceHistory", //ajax访问路径  
						data: {
							projectCode:projectCode,
							types:types,
							traineeOrGroupIds:traineeOrGroupId
						}, //ajax查询访问参数
						async:true,
						beforeSend:function(){
							$yt_baseElement.showLoading();
						},
						success: function(data) {
							var htmlTr ="";
							var num=".0";
							if (data.flag == 0) {
								$.each(data.data, function(i,t) {
									t.updateTimeString=t.updateTimeString.substring(0,t.updateTimeString.indexOf(num));
									if(t.dataTypes==1){
										t.dataTypesVel = '税控机开票'
									}else if(t.dataTypes==2){
										t.dataTypesVel = '手动开票'
									}
									htmlTr += '<tr>'+
//													'<td>'+t.orderNum+'</td>'+
													'<td>'+t.ticketHolder+'</td>'+
													'<td>'+t.updateTimeString+'</td>'+
													'<td style="text-align:right;">'+$yt_baseElement.fmMoney(t.tuition,2)+'</td>'+
													'<td>'+t.invoiceNum+'</td>'+
													'<td>'+t.dataTypesVel+'</td>'+
												'</tr>';
									
								});
								tbHtml = '<table style="width:100%">'+
									'<thead class="list-thead">'+
										'<tr>'+
											'<th style="width: 185px;display:none;">订单号</th>'+
											'<th style="width: 300px;">开票人</th>'+
											'<th style="width: 120px;">日期</th>'+
											'<th style="width: 80px;">开票金额</th>'+
											'<th style="">发票号</th>'+
											'<th style="">数据类型</th>'+
										'</tr>'+
									'</thead>'+
									'<tbody class="yt-tbody list-tbody">'+htmlTr+'</tbody>'+
								'</table>';
								$('.invoiceHistory .yt-edit-alert-main').empty().append(tbHtml);
								$yt_alert_Model.setFiexBoxHeight($(".invoiceHistory .alert-form"));
								/** 
								 * 调用算取div显示位置方法
								 */
								$yt_alert_Model.getDivPosition($(".invoiceHistory"));
							}
							/**
							 * 计算弹窗位置
							 */
						  	$yt_alert_Model.setFiexBoxHeight($(".invoiceHistory .yt-edit-alert-main"));
					        $yt_alert_Model.getDivPosition($(".invoiceHistory"));
							$yt_baseElement.hideLoading();
						},
						error:function(){
							$yt_baseElement.hideLoading();
							$yt_alert_Model.prompt('网络异常，请稍后重试')
						}
					});	
										
				});
		//点击学员姓名查看详情
		$('.trainee-bill-table tbody').on('click','.invoice-org-href',function(){
			var traineeId=$(this).parent().parent().find('.trainee-or-group-id').val();
			var headImg=new Image();
			//获取班级编号
			 var projectCode = $yt_common.GetQueryString("projectCode");
			 //显示整体框架loading的方法
			 $yt_baseElement.showLoading();
			 $.ajax({
			 	type:"post",
			 	url:$yt_option.base_path + "finance/projectInvoice/getTraineeDetails",
			 	data:{
			 		traineeId:traineeId,
			 		projectId:projectCode
			 	},
			 	async:true,
			 	success:function(data){
			 		
			 		var htmlBody=$('.student-details-form .student-details-train-record tbody');
		 			var htmlTrs='';
		 			htmlBody.empty();
			 		if(data.flag==0){
			 			detailsMsg=data.data;
			 			detailsMsg.checkInDate=detailsMsg.checkInDate.split(" ")[0];
			 			//性别
			 			if(detailsMsg.gender==1){
			 				detailsMsg.gender="男";
			 			}else{
			 				detailsMsg.gender="女";
			 			}
			 			//发票类型
			 			if(detailsMsg.invoiceType==0){
			 				detailsMsg.invoiceType="";
			 			}else if(detailsMsg.invoiceType==1){
			 				detailsMsg.invoiceType="普通发票";
			 			}else{
			 				detailsMsg.invoiceType="增值税发票";
			 			}
			 			//报到状态
			 			if(detailsMsg.checkInState==0){
			 				detailsMsg.checkInState="未报到";
			 			}else{
			 				detailsMsg.checkInState="已报到";
			 			}
			 			//缴费状态
			 			if(detailsMsg.paymentState==0){
			 				detailsMsg.paymentState="未对账";
			 			}else{
			 				detailsMsg.paymentState="已对账";
			 			}
			 			//开票信息
			 			var recordBody = $('.order-record-table .order-list-tbody').empty();
			 			var recordHtml = '';
		 				if(data.data.orderList!=undefined){
		 					var recordList = data.data.orderList;
							if(recordList!=""){
								$.each(recordList, function(i,v) {
									v.isOrderNum==1?v.isOrderNum='已开票':v.isOrderNum='未开票';
									recordHtml='<tr>'+
									'<td style="text-align: right;" width="80px">开票状态：</td>'+
									'<td style="text-align: left;" width="150px">'+v.isOrderNum+'</td>'+
									'<td class="order-num" style="text-align: right;" width="80px">发票号：</td>'+
									'<td style="text-align: left;" width="120px">'+v.orderNum+'</td>'+
									'<td class="order-money" style="text-align: right;" width="80px">开票金额：</td>'+
									'<td style="text-align: left;" width="120px">'+v.tuition+'</td>'+
									'<td width="80px"><div class="addorder addorder'+i+'" style="display:none;padding: 5px 10px;border: 1px dashed #E6E6E6;cursor: pointer;">合并开票</div></td>'
									'</tr>';
									recordBody.append(recordHtml);
									var trainees
									if(v.trainees==undefined){
										trainees = []
										v.trainees='';
									}else{
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
								recordHtml='<tr style="border:0px;background-color:#fff !important;" >' +
											'<td width="77px" align="right" style="border:0px;">开票状态：</td>' +
											'<td align="left" style="border:0px;">未开票</td>' +
											'</tr>';
									recordBody.append(recordHtml);
							}
		 				}else{
		 					recordHtml='<tr style="border:0px;background-color:#fff !important;" >' +
											'<td width="77px" align="right" style="border:0px;">开票状态：</td>' +
											'<td align="left" style="border:0px;">未开票</td>' +
											'</tr>';
									recordBody.append(recordHtml);
		 				}
			 			$('.student-details-form .cont-edit-test').setDatas(detailsMsg);
			 			if(detailsMsg.headPortrait!=""){
			 				headImg.src=detailsMsg.headPortraitUrl;
				 			headImg.onload=function(){
				 					$('.student-details-img').attr('src',headImg.src);
								$('.student-details-img').jqthumb({  
								    width: 89,  
								    height: 130
								});
							};
			 			}else{
			 				$('.student-details-img').attr('src','../../resources/images/classStudent/student-picture.png');
			 				$('.student-details-img').jqthumb({  
								    width: 89,  
								    height: 130
								});
			 			}
			 			//隐藏整体框架loading的方法
			 			$yt_baseElement.hideLoading();
			 		}
			 		//隐藏整体框架loading的方法
			 			$yt_baseElement.hideLoading();
			 	}
			 });
			/** 
	         * 显示编辑弹出框和显示顶部隐藏蒙层 
	         */  
	        $(".student-details-form").show();  
	        /** 
	         * 调用算取div显示位置方法 
	         */  
	        $yt_alert_Model.setFiexBoxHeight($(".student-details-form .yt-edit-alert-main"));
	        $yt_alert_Model.getDivPosition($(".student-details-form"));  
	        /* 
	         * 调用支持拖拽的方法 
	         */  
	        $yt_model_drag.modelDragEvent($(".student-details-form .yt-edit-alert-title"));  
	        /** 
	         * 点击取消方法 
	         */  
	        $('.student-details-form .yt-eidt-model-bottom .yt-model-sure-btn').off('click').on("click", function() {  
	            //隐藏页面中自定义的表单内容  
	            $(".student-details-form").hide();  
	        });  
		});
		//修改开票信息确定按钮
		$(".yt-eidt-model-bottom").off('click').on('click','.sreduction-details-sure-btn',function(){
			var selecVal=$(".billing-inf-alert #project-states").val();
			var labVal=$(".billing-inf-alert .is-not-comp label input:checked").val();
			var perState=$yt_valid.validForm($(".billing-inf-alert td").eq(4));
			//console.log(perState,compState,allState);
			//判断是什么发票类型和单选选中的什么类型
			if(selecVal==1&&labVal==1){	
				$(".billing-inf-alert table input").eq(2).removeClass('ticket-form-input');
				if(perState){
					ticketOpenInfo.savebillingInf();
				}
			}else if(selecVal==1&&labVal==2){
				$(".billing-inf-alert table input").eq(2).removeClass('ticket-form-input');
				$(".billing-inf-alert table input").eq(3).removeClass('ticket-form-input');
				var compState=$yt_valid.validForm($(".billing-inf-alert td").eq(6));
				if(perState&&compState){
					ticketOpenInfo.savebillingInf();
				}
			}else if(selecVal==2){
				$(".billing-inf-alert table input").removeClass('ticket-form-input');
				var allState=$yt_valid.validForm($(".billing-inf-alert table"));
				if(allState){
					ticketOpenInfo.savebillingInf();
				}
			}
		});
		//键盘按下事件
		ticketOpenInfo.keyDown();
	},
	/**
	 * 获取开具发票按钮的发票信息
	 */
	getOpnTicketMsg:function(projectCode,types,traineeOrGroupId){
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "finance/projectInvoice/getInvoice", //ajax访问路径  
			data: {
				projectCode:projectCode,
				types:types,
				traineeOrGroupId:traineeOrGroupId
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag==0){
					$(".write-billing-alert table").setDatas(data.data);
				}
				//显示整体框架loading的方法
				$yt_baseElement.hideLoading();
			}
		});
	},
	/**
	 * 清空开票信息弹窗
	 */
	clearOpenTicket:function(){
		$(".billing-inf-alert table input").addClass('ticket-form-input');
		$(".billing-inf-alert table span.per-span").text("");
		$(".billing-inf-alert table span.comp-span").text("");
		$(".billing-inf-alert table span.comp-label-span").text("");
		$(".billing-inf-alert table span.valid-font").text("");
	},
	//获取单位开票信息详情
	lookBiilInfo:function(projectCode,types,traineeOrGroupId){
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "finance/projectInvoice/getInvoice", //ajax访问路径  
			data: {
				projectCode:projectCode,
				types:types,
				traineeOrGroupId:traineeOrGroupId
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					if(data.data != null){
						if(data.data.invoiceType==1){
							data.data.invoiceType="普通发票";
						}else if(data.data.invoiceType==2){
							data.data.invoiceType="增值税专用发票";
						}
						$('.look-bill-info-table .invoice-model-info').text("");
						$('.look-bill-info-table .org-name-info').text("");
						$('.look-bill-info-table .tax-number-info').text("");
						$('.look-bill-info-table .address-info').text("");
						$('.look-bill-info-table .telephone-info').text("");
						$('.look-bill-info-table .registered-bank-info').text("");
						$('.look-bill-info-table .account-info').text("");
						$('.look-bill-info-table .invoice-model-info').text(data.data.invoiceType);
						$('.look-bill-info-table .org-name-info').text(data.data.orgName);
						$('.look-bill-info-table .tax-number-info').text(data.data.taxNumber);
						$('.look-bill-info-table .address-info').text(data.data.address);
						$('.look-bill-info-table .telephone-info').text(data.data.telephone);
						$('.look-bill-info-table .registered-bank-info').text(data.data.registeredBank);
						$('.look-bill-info-table .account-info').text(data.data.account);
					}
				} 
				$yt_baseElement.hideLoading();
			}
		});
	},
	//修改备注
	invoiceRemarksFn:function(){
		var projectCode = $yt_common.GetQueryString("projectCode");
		var types = $('.hid-types').val();
		var traineeOrGroupIds = $('.hid-trainee-or-group-id').val();
		var invoiceRemarks = $('.edit-remark .remark-text').val();
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "finance/projectInvoice/updateInvoiceRemarks", //ajax访问路径  
			data: {
				projectCode:projectCode,
				types:types,
				traineeOrGroupId:traineeOrGroupIds,
				invoiceRemarks:invoiceRemarks
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					$yt_baseElement.hideLoading();
					//刷新列表
						ticketOpenInfo.getPlanListInfo();
						ticketOpenInfo.getPersonListInfo();
				} else {
					$yt_baseElement.hideLoading();
				}
			}
		});
	},
	
	
	//合并开票
	mergeBillFn:function(types,traineeOrGroupIds,btnType){
			var projectCode = $yt_common.GetQueryString("projectCode");
			$yt_baseElement.showLoading();
			$.ajax({
				type: "post", //ajax访问方式 默认 "post"  
				url: $yt_option.base_path + "finance/projectInvoice/updateInvoiceOrderNum", //ajax访问路径  
				data: {
					projectCode:projectCode,
					types:types,
					traineeOrGroupIds:traineeOrGroupIds,
					orderNumType:btnType
				}, //ajax查询访问参数
				async:false,
				success: function(data) {
					if(data.flag == 0) {
						$yt_baseElement.hideLoading(function(){
							if(btnType==1){
								ticketOpenInfo.addinvoiceInfo(types,traineeOrGroupIds,data.data);
							}
							//刷新列表
							ticketOpenInfo.getPlanListInfo();
							ticketOpenInfo.getPersonListInfo();
							$('.check-all').setCheckBoxState('uncheck');
						});
					} else {
						$yt_baseElement.hideLoading(function(){
							$yt_alert_Model.prompt(data.message);	
						});
					}
				}
			});
	},
	//初始化开票弹窗信息
	clearBillInfoAlert:function(){
		$('#project-states').setSelectVal(1);
		if($('#project-states').val()==1){
			$(".billing-inf-alert .is-not-comp").show();
		}else{
			$(".billing-inf-alert .is-not-comp").hide();
		}
		$('.orgName').val("");
		$('.taxNumber').val("");
		$('.address').val("");
		$('.telephone').val("");
		$('.registeredBank').val("");
		$('.account').val("");
	},
	
	//初始化开具发票
	clearWriteBillAlert:function(){
		$('.duty-org-name').val("");
		$('.duty-tax-number').val("");
		$('.duty-telephone').val("");
		$('.duty-address').val("");
		$('.duty-registered-bank').val("");
		$('.duty-account').val("");
		$('.iduty-specification-model').val("无");
		$('.iduty-invoice-group').val("期");
		$('.iduty-invoice-number').val("");
		$('.iduty-invoice-unit-price').val("");
		$('.iduty-tuition').val("");
		$('.taxt-rat').text("");
		$('.taxt-rat-money').text("");
	},
	
	//计算费用
	getTaxRate:function(){
		//类型
		var invoiceOrderType = $('.duty-invoiceOrder-type').val();
		//数量
		var count = $('.iduty-invoice-number').val();
		//单价
		var price = $('.iduty-invoice-unit-price').val();
		//总金额
		var tuition = $('.iduty-tuition').val();
		
		
		if((count != "" && price != "") || tuition !=""){//价格和单价部位空或者总金额不为空
			if(tuition == ""){//总金额不为空，计算总金额
				$('.iduty-tuition').val(count*price);
				tuition = $('.iduty-tuition').val()
			}
			//总税额
			var ratMoney = $('.taxt-rat-money');
			if(invoiceOrderType == 1){//培训费
				//税率
				$('.taxt-rat').text("3%");
				//税额
				$('.taxt-rat-money').text((tuition-(tuition/(1.03))).toFixed(2));
			}else if(invoiceOrderType == 2){//住宿费
				//税率
				$('.taxt-rat').text("6%");
				//税额
				$('.taxt-rat-money').text((tuition-(tuition/(1.06))).toFixed(2));
			}else if(invoiceOrderType == 3){//餐费
				//税率
				$('.taxt-rat').text("6%");
				//税额
				$('.taxt-rat-money').text((tuition-(tuition/(1.06))).toFixed(2));
			}else if(invoiceOrderType == 4){//咨询服务费
				//税率
				$('.taxt-rat').text("3%");
				//税额
				$('.taxt-rat-money').text((tuition-(tuition/(1.03))).toFixed(2));
			}else if(invoiceOrderType == 5){//培训服务费
				//税率
				$('.taxt-rat').text("3%");
				//税额
				$('.taxt-rat-money').text((tuition-(tuition/(1.03))).toFixed(2));
			}else{//会议费
				//税率
				$('.taxt-rat').text("6%");
				//税额
				$('.taxt-rat-money').text((tuition-(tuition/(1.06))).toFixed(2));
			}
		
		}
		
	},
	//点击操作按钮时判断当前选中行是哪个表
	trainOrcompanyIsCheck:function(){
		//标识是否有选中行
		var checkTrueOrFalse = "";
		//返回值
		var isOrNot=true;
		//接收被选中行对象
		var check;
		//单位列表选中行
		var company = $('.company-list tbody tr').find('.check');
		//学员类表选中行
		var trainee = $('.trainee-bill-table tbody tr').find('.check');
		var companyLen = company.length;
		var traineeLen = trainee.length;
		if(companyLen > 0){//当前选中行是单位列表
			checkTrueOrFalse = 1;
			check = company;
		}else if(traineeLen > 0){//当前选中行是学员列表
			checkTrueOrFalse = 1;
			check = trainee;
		}else if(companyLen > 0||traineeLen > 0){//单位列表和学员列表都有被选中行
			$yt_alert_Model.prompt("请选中一行数据进行操作", 3000);
			isOrNot=false;
		}else{//都没单位列表和学员列表都没有选中行
			$yt_alert_Model.prompt("请选中一行数据进行操作", 3000);
			isOrNot=false;
		}
		if (check != undefined) {
			//项目code
			var projectCode = $yt_common.GetQueryString("projectCode");
			var types = check.parent().find('.types').val();
			var orderNum = check.parent().find('.order-num').val();
			//学员/单位id
			var traineeOrGroupId ="";
			$.each(check,function(i,v){
				if(traineeOrGroupId == ""){
					traineeOrGroupId = $(v).parent().find('.trainee-or-group-id').val();
				}else{
					traineeOrGroupId += ','+$(v).parent().find('.trainee-or-group-id').val();
				}
			});
			//把值放到隐藏标签里
			$('.hid-project-code').val(projectCode);
			$('.hid-types').val(types);
			$('.hid-order-num').val(orderNum);
			$('.hid-trainee-or-group-id').val(traineeOrGroupId);
			$('.hid-check-true-or-false').val(checkTrueOrFalse);
		}
		return isOrNot;
	},
	//开具发票
	addDutyInfo:function(projectCode,types,traineeOrGroupId,orderNum){
		var me = this ;
		var invoiceType = $('.write-bill-table .invoice-type-td select.invoice-type').val();
		var invoiceModel = $('.write-bill-table .invoice-model-td').find('.check').children().val();
		var orgName = $('.duty-org-name').val();
		var taxNumber = $('.duty-tax-number').val();
		var telephone = $('.duty-telephone').val();
		var address = $('.duty-address').val();
		var registeredBank = $('.duty-registered-bank').val();
		var account = $('.duty-account').val();
		var invoiceOrderType = 	$('.write-billing-alert .duty-invoiceOrder-type').val();
		var invoiceSpecificationModel = $('.write-billing-alert .iduty-specification-model').val();
		var invoiceGroup = 	$('.write-billing-alert .iduty-invoice-group').val();
		var invoiceNumber = $('.write-billing-alert .iduty-invoice-number').val();
		var invoiceUnitPrice = $('.write-billing-alert .iduty-invoice-unit-price').val();
		var tuition = $('.write-billing-alert .iduty-tuition').val();
		var orderReamrks = "";
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "finance/projectInvoice/addInvoice", //ajax访问路径  
			data: {
				projectCode:projectCode,
				types:types,
				traineeOrGroupIds:traineeOrGroupId,
				orderNum:orderNum,
				invoiceModel:invoiceModel,
				invoiceType:invoiceType,
				orgName:orgName,
				taxNumber:taxNumber,
				telephone:telephone,
				address:address,
				registeredBank:registeredBank,
				account:account,
				invoiceOrderType:invoiceOrderType,
				invoiceSpecificationModel:invoiceSpecificationModel,
				invoiceGroup:invoiceGroup,
				invoiceNumber:invoiceNumber,
				invoiceUnitPrice:invoiceUnitPrice,
				tuition:tuition,
				orderReamrks:orderReamrks,
				fcrBaseId:$('.write-billing-alert').find('.frcUl input[type=radio]:checked').val()
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					$yt_baseElement.hideLoading();
					$yt_alert_Model.prompt(data.message);	
					me.getPlanListInfo();
					$('.class-page').pageInfo('refresh');
				} else {
					$yt_alert_Model.prompt(data.message);
					$yt_baseElement.hideLoading();
				}
			},error:function(){
					$yt_alert_Model.prompt('网络异常，开具发票失败');
					$yt_baseElement.hideLoading();
			}
		});
		
	},
	//合并开票
	addinvoiceInfo:function(types,traineeOrGroupId,orderNum){
		var me = this ;
		var projectCode = $yt_common.GetQueryString("projectCode");
		var invoiceType = $('.mergeInvoiceAlert .invoice-type-td select.invoice-type').val();
		var invoiceModel = $('.mergeInvoiceAlert .invoice-model-td').find('.check').children().val();
		var orgName = $('.invoice-org-name').val();
		var taxNumber = $('.invoice-tax-number').val();
		var telephone = $('.invoice-telephone').val();
		var address = $('.invoice-address').val();
		var registeredBank = $('.invoice-registered-bank').val();
		var account = $('.invoice-account').val();
		var invoiceOrderType = 	$('.mergeInvoiceAlert .invoice-invoiceOrder-type').val();
		var invoiceSpecificationModel = $('.mergeInvoiceAlert .invoice-specification-model').val();
		var invoiceGroup = 	$('.mergeInvoiceAlert .invoice-invoice-group').val();
		var invoiceNumber = $('.mergeInvoiceAlert .invoice-invoice-number').val();
		var invoiceUnitPrice = $('.mergeInvoiceAlert .invoice-invoice-unit-price').val();
		var tuition = $('.mergeInvoiceAlert .invoice-tuition').val();
		var orderReamrks = "";
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "finance/projectInvoice/addInvoice", //ajax访问路径  
			data: {
				projectCode:projectCode,
				types:types,
				traineeOrGroupIds:traineeOrGroupId,
				orderNum:orderNum,
				invoiceModel:invoiceModel,
				invoiceType:invoiceType,
				orgName:orgName,
				taxNumber:taxNumber,
				telephone:telephone,
				address:address,
				registeredBank:registeredBank,
				account:account,
				invoiceOrderType:invoiceOrderType,
				invoiceSpecificationModel:invoiceSpecificationModel,
				invoiceGroup:invoiceGroup,
				invoiceNumber:invoiceNumber,
				invoiceUnitPrice:invoiceUnitPrice,
				tuition:tuition,
				orderReamrks:orderReamrks,
				fcrBaseId:$('.mergeInvoiceAlert').find('.frcUl input[type=radio]:checked').val()
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					me.getPlanListInfo();
					$('.class-page').pageInfo('refresh');
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt(data.message)
					});
				} else {
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt(data.message)
					});
				}
			}
		});
		
	},
	//开具发票弹出框
	writeBillingAlert: function() {
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$(".write-billing-alert").show();
		$(".write-billing-alert table .invoice-type").niceSelect();
		/** 
		 * 调用算取div显示位置方法
		 */
		$yt_alert_Model.setFiexBoxHeight($(".write-billing-alert .alert-form"));
		$yt_alert_Model.getDivPosition($(".write-billing-alert"));
		/* 
		 * 调用支持拖拽的方法 
		 */
		$yt_model_drag.modelDragEvent($(".write-billing-alert .yt-edit-alert-title"));
		/** 
		 * 点击取消方法 
		 */
		$('.write-billing-alert .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
			//隐藏页面中自定义的表单内容  
			$(".write-billing-alert").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
	},
	
	//获取单位开票信息
	getCompanyInfo:function(projectCode,types,traineeOrGroupId){
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "finance/projectInvoice/getInvoice", //ajax访问路径  
			data: {
				projectCode:projectCode,
				types:types,
				traineeOrGroupId:traineeOrGroupId
			}, //ajax查询访问参数
			async:false,
			success: function(data) {
				if(data.flag == 0) {
					if(data.data != null){
						if(data.data.invoiceType==1){
							$('.write-bill-info-table .is-not-comp').show();
							if(data.data.invoiceModel==1){
								$(".billing-inf-alert table span.per-span").text("*");
							}else if(data.data.invoiceModel==2){
								$(".billing-inf-alert table span.per-span").text("*");
								$(".billing-inf-alert table span.comp-span").text("*");
							}
						}else if(data.data.invoiceType==2){
							$('.write-bill-info-table .is-not-comp').hide();
							$(".billing-inf-alert table span.per-span").text("*");
							$(".billing-inf-alert table span.comp-span").text("*");
							$(".billing-inf-alert table span.comp-label-span").text("*");
						}
						data.data.invoiceId==undefined?data.data.invoiceId='':data.data.invoiceId=data.data.invoiceId;
						$('.write-bill-info-table .invoiceModel').setSelectVal(data.data.invoiceType);
						$('.write-bill-info-table .is-not-comp label input[value='+data.data.invoiceModel+']').setRadioState("check");
						$('.write-bill-info-table .orgName').val(data.data.orgName);
						$('.write-bill-info-table .taxNumber').val(data.data.taxNumber);
						$('.write-bill-info-table .address').val(data.data.address);
						$('.write-bill-info-table .telephone').val(data.data.telephone);
						$('.write-bill-info-table .registeredBank').val(data.data.registeredBank);
						$('.write-bill-info-table .account').val(data.data.account);
						$('.edit-bill-div .hid-invoice-id').val(data.data.invoiceId);
					}
				}
				//隐藏整体框架loading的方法
				$yt_baseElement.hideLoading();
			}
		});
	},
	//开票信息保存
	savebillingInf: function() {
			var me = this;
			var types = $('.hid-types').val();
			var projectCode = $yt_common.GetQueryString("projectCode");
			var invoiceModel = $('.write-bill-info-table .is-not-comp input:checked').val();
			var orgName = $('.write-bill-info-table .orgName').val();
			var taxNumber = $('.write-bill-info-table .taxNumber').val();
			var address = $('.write-bill-info-table .address').val();
			var telephone = $('.write-bill-info-table .telephone').val();
			var registeredBank = $('.write-bill-info-table .registeredBank').val();
			var account = $('.write-bill-info-table .account').val();
			var traineeOrGroupId = $('.hid-trainee-or-group-id').val();
			var invoiceId = $('.hid-invoice-id').val();
			var invoiceType=$("#project-states").val();
			$yt_baseElement.showLoading();
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "finance/projectInvoice/updateInvoice", //ajax访问路径  
			data: {
				projectCode: projectCode,
				types: types,
				traineeOrGroupId: traineeOrGroupId,
				invoiceId:invoiceId,
				invoiceModel:invoiceModel,
				invoiceType:invoiceType,
				orgName:orgName,
				taxNumber:taxNumber,
				address:address,
				telephone:telephone,
				registeredBank:registeredBank,
				account:account,
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt("保存成功");
					me.getPlanListInfo();
					$('.class-page').pageInfo('refresh');
					$yt_baseElement.hideLoading();
					//隐藏页面中自定义的表单内容  
					$(".billing-inf-alert").hide();
					//隐藏蒙层  
					$("#pop-modle-alert").hide();
					
				} else {
					$yt_alert_Model.prompt("保存失败");
					$yt_baseElement.hideLoading();
				}
			}
		});
	},
	
	//修改备注弹窗
	editRemarkAlert: function() {
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$(".edit-remark-alert").show();
		/** 
		 * 调用算取div显示位置方法
		 */
		$yt_alert_Model.setFiexBoxHeight($(".edit-remark-alert .alert-form"));
		$yt_alert_Model.getDivPosition($(".edit-remark-alert"));
		/* 
		 * 调用支持拖拽的方法 
		 */
		$yt_model_drag.modelDragEvent($(".edit-remark-alert .yt-edit-alert-title"));
		/** 
		 * 点击取消方法 
		 */
		$('.edit-remark-alert .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
			//隐藏页面中自定义的表单内容  
			$(".edit-remark-alert").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
	},
	//开票信息详情弹出框
	lookBillingInfoAlert: function() {
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$(".look-billing-inf-alert").show();
		/** 
		 * 调用算取div显示位置方法
		 */
		$yt_alert_Model.setFiexBoxHeight($(".look-billing-inf-alert .alert-form"));
		$yt_alert_Model.getDivPosition($(".look-billing-inf-alert"));
		/* 
		 * 调用支持拖拽的方法 
		 */
		$yt_model_drag.modelDragEvent($(".look-billing-inf-alert .yt-edit-alert-title"));
		/** 
		 * 点击取消方法 
		 */
		$('.look-billing-inf-alert .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
			//隐藏页面中自定义的表单内容  
			$(".look-billing-inf-alert").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
		/** 
		 * 点击取消方法 
		 */
		$('.look-billing-inf-alert .yt-eidt-model-bottom .yt-model-sure-btn').off().on("click", function() {
			//隐藏页面中自定义的表单内容  
			$(".look-billing-inf-alert").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
	},
	//开票信息弹出框
	billingInfoAlert: function() {
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$(".billing-inf-alert").show();
		/** 
		 * 调用算取div显示位置方法
		 */
		$yt_alert_Model.setFiexBoxHeight($(".billing-inf-alert .alert-form"));
		$yt_alert_Model.getDivPosition($(".billing-inf-alert"));
		/* 
		 * 调用支持拖拽的方法 
		 */
		$yt_model_drag.modelDragEvent($(".billing-inf-alert .yt-edit-alert-title"));
		/** 
		 * 点击取消方法 
		 */
		$('.billing-inf-alert .yt-eidt-model-bottom .yt-model-canel-btn').off('click').on("click", function() {
			//隐藏页面中自定义的表单内容  
			$(".billing-inf-alert").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
	},
	
	//项目开票，单位列表
	getPlanListInfo: function() {
		
		var projectCode = $yt_common.GetQueryString("projectCode");
		$yt_baseElement.showLoading();
		$.ajax({
			async: false,
			url: $yt_option.base_path + "finance/projectInvoice/getInvoiceToGroup", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				projectCode: projectCode
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				$('.ticket-open-tbody').empty();
				if(data.flag == 0) {
					$(".trainee-bill-table tbody").empty();
					var htmlTbody = $('.ticket-open-tbody');
					var htmlTr = '';
					var projectType;
					var orderNum = "0";
					var rowSpanNum = 1; 
					var lastTr;
					var trainIds = "";
					var hidTrainIds = "";
					if(data.data != "") {
						$(htmlTbody).empty();
						$.each(data.data, function(i, v) {
							if (v.invoiceStates == 1) {
								v.invoiceStates = "未开票";
							}else{
								v.invoiceStates = "已开票";
							}
							if (v.isAdmission == 0) {
								v.isAdmission = "未确认"
							} else{
								v.isAdmission = "已确认";
							}
							htmlTr = '<tr>' +
								'<td>'+
									'<input type="hidden" class="types" value="1"/>' + 
									'<input type="hidden" class="order-num" value="'+v.orderNum+'"/>' + 
									'<input type="hidden" class="trainee-or-group-id" value="'+v.groupId+'"/>' + 
									'<label class="check-label yt-checkbox label-list">'+
										'<input type="checkbox" name="test" class=""/>'+
									'</label>' + 
								'</td>' +
								'<td class="groupName" style="text-align:left"><span class="project-code-href">' + v.groupName + '</span></td>' +
								'<td class="trainingExpenseNegotiatedPrice list-td" style="text-align:right;">' + v.trainingExpenseNegotiatedPrice + '</td>' +
								'<td class="list-td"><a style="color: #3c4687;" class="look-info look-stu-info look">查看</a></td>'+
								'<td class="isAdmission">' + v.isAdmission + '</td>';
								if(v.orderNum != "" || rowSpanNum > 1){
									if(orderNum != v.orderNum) {
										if(rowSpanNum == 1){
											trainIds = v.traineeId;
										}else{
											$('.ticket-open-tbody tr').eq(lastTr).find("td").eq(5).attr("rowSpan", rowSpanNum);
											trainIds = v.traineeId;
											$('.ticket-open-tbody tr').eq(lastTr).find("td").eq(5).children().val(hidTrainIds);
											rowSpanNum = 1;
										}
										hidTrainIds = "";
										lastTr = i;
										orderNum = v.orderNum;
										htmlTr += '<td class="invoiceStates invoice-states list-td"><input type="hidden" class="train-ids" value="' + trainIds + '"/><a>' + v.invoiceStates + '</a></td>' ;
													rowSpanNum = 1;
									} else {
										trainIds += ','+v.traineeId;
										hidTrainIds = trainIds;
										rowSpanNum++;
									}	
								}else{
									trainIds = v.traineeId;
									htmlTr += '<td class="invoiceStates invoice-states list-td"><input type="hidden" class="train-ids" value="' + trainIds + '"/><a>' + v.invoiceStates + '</a></td>' ;
									rowSpanNum = 1;
								}
								htmlTr +='<td class="orderReamrks list-td" style="width: 118px;overflow: hidden;text-align: left;">' + v.orderReamrks + '</td>' +
									'</tr>';
									v.type = 1;
									htmlTr = $(htmlTr).data('data',v);
									htmlTbody.append(htmlTr);
							
						});
						$('.ticket-open-tbody tr').eq(lastTr).find("td").eq(5).attr("rowSpan", rowSpanNum);
					}else {
						$(".programme").hide();
						//隐藏单位开票列表
						$(".box-ticket-list").hide();
					}
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}

			}, //回调函数 匿名函数返回查询结果  
			//isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	/**
	 * 项目开票详情页面获取个人信息
	 */
	getPersonListInfo: function(searchBtn) {
		var invoiceStates = [];
		var checkBtn = $('.bill-btn-div .check-search input[type=checkbox]:checked');
		$.each(checkBtn, function(i,n) {
			invoiceStates.push($(n).val());
		});
		invoiceStates = invoiceStates.join(',');
		checkBtn.length>1?invoiceStates='':invoiceStates=invoiceStates;
		var projectCode = $yt_common.GetQueryString("projectCode");
		var selectParam = $("#keyword").val();
		$('.class-page').pageInfo({
			async: false,
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			url: $yt_option.base_path + "finance/projectInvoice/getInvoiceToTrainee", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				projectCode: projectCode,
				selectParam:selectParam,
				invoiceStates:invoiceStates
			}, //ajax查询访问参数
			before: function() {
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				
				if(data.flag == 0) {
					var htmlTbody = $('.class-tbody');
					var htmlTr = '';
					var invoiceType;
					var orderNum = "0";
					var rowSpanNum = 1; 
					var lastTr;
					var trainIds = "";
					var hidTrainIds = "";
					if(data.data.rows.length > 0) {
						$(".programme").show();
						$(htmlTbody).empty();
						$.each(data.data.rows, function(i, v) {
							if(v.checkInState == 0){
								v.checkInState = "未报到"
							}else if(v.checkInState == 1){
								v.checkInState = "已报到"
							}else{
								v.checkInState = ""
							}
							if(v.invoiceStates == 1){
								v.invoiceStates = "未开票"
							}else if(v.invoiceStates == 2){
								v.invoiceStates = "已开票"
							}else{
								v.invoiceStates = ""
							}
							if(v.isAdmission == 0){
								v.isAdmission = "未对账"
							}else if(v.isAdmission == 1){
								v.isAdmission = "已对账"
							}else{
								v.isAdmission = ""
							}
							htmlTr = '<tr style="position: relative;">'+
										'<td>'+
										'<input type="hidden" class="types" value="2"/>' +
										'<input type="hidden" class="trainee-or-group-id" value="' + v.traineeId + '"/>' +
										'<input type="hidden" class="order-num" value="' + v.orderNum + '"/>' +
										'<input type="hidden" class="project-code" value="' + v.projectCode + '"/>' +
										'<label class="check-label yt-checkbox label-list" style="margin-left:7px">'+
											'<input type="checkbox" name="test"/>'+
										'</label>'+
									'</td>' +
									'<td class = "group-num"><input type="hidden" class="types" value="2"/>' + v.groupNum + '</td>' +
									'<td style="text-align:center;" class="real-name"><a style="color: #3c4687;" class="invoice-org-href">' + v.realName + '</a></td>' +
									'<td class="room-number">' + v.roomNumber + '</td>' +
									'<td class="phone" >' + v.phone + '</td>' +
									'<td class="group-name" style="text-align:left">' + v.groupName + '</td>' +
									'<td class="group-org-name" style="text-align:left">' + v.groupOrgName + '</td>' +
									'<td><a style="color: #3c4687;" class="look-info">查看</a></td>'+
									'<td class="checkIn-state">' + v.checkInState + '</td>' +
									'<td class="is-admission">' + v.isAdmission + '</td>';
									if(v.orderNum != "" || rowSpanNum > 1){
										if(orderNum != v.orderNum) {
											if(rowSpanNum == 1){
												trainIds = v.traineeId;
											}else{
												$('.class-tbody tr').eq(lastTr).find("td").eq(10).children().val(hidTrainIds);
												trainIds = v.traineeId;
												$('.class-tbody tr').eq(lastTr).find("td").eq(10).attr("rowSpan", rowSpanNum);
												rowSpanNum = 1;
											}
											hidTrainIds = "";
											
											lastTr = i;
											orderNum = v.orderNum;
											htmlTr += '<td class="invoice-states rowspan-td"><input type="hidden" class="train-ids" value="' + trainIds + '"/><a>' + v.invoiceStates + '</a></td>';
														rowSpanNum = 1;
										} else {
											trainIds += ','+v.traineeId;
											hidTrainIds = trainIds;
											rowSpanNum++;
										}
									}else{
										trainIds = v.traineeId;
										htmlTr += '<td class="invoice-states rowspan-td"><input type="hidden" class="train-ids" value="' + trainIds + '"/><a>' + v.invoiceStates + '</a></td>';
										rowSpanNum = 1;
									}
									htmlTr += '<td class="invoice-remarks" style="width: 118px;overflow: hidden;text-align: left;">'+ v.invoiceRemarks + '</td>' +
											'</tr>';
									v.type=2;
									htmlTr = $(htmlTr).data("data", v)	
									htmlTbody.append(htmlTr);
							
						});
						$('.class-tbody tr').eq(lastTr).find("td").eq(10).attr("rowSpan", rowSpanNum);
					}else {
						$(htmlTbody).empty()
						//学员开票
//						$(".trainee-bill-table .list-thead").hide();
//						$(".bill-btn-div").hide();
						htmlTr = '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="12" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
							if($(".box-ticket-list").css("display") == "none"){//单位列表没有数据
								htmlTbody.append(htmlTr);
							}else{//单位开票列表有数据
								if(searchBtn = "search"){//搜索查询
									htmlTbody.append(htmlTr);
									$(".bill-btn-div").show();
								}else{
									//学员开票类表区域隐藏
									$(".box-class-list").hide();
								}
								//单位开票区域显示
								$(".box-ticket-list").show();
							}
							$('.class-page').hide();
					}
						//鼠标悬浮开票状态显示开票信息
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
	//手动开具发票
	manualInvoice:function(types,traineeOrGroupIds,orderNum){
		$.ajax({
			type:"post",
			url:$yt_option.base_path+"finance/projectInvoice/addInvoiceManual",
			async:true,
			data:{
				projectCode:$yt_common.GetQueryString("projectCode"),
				types:types,
				traineeOrGroupIds:traineeOrGroupIds,
				orderNum:orderNum,
				tuition:$yt_baseElement.rmoney($('.manual-invoice-dollar').val()),
				invoiceNum:$('.manual-invoice-number').val(),
				orderReamrks:$('.manual-invoice-remark').val()
			},
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			success:function(data){
				if(data.flag==0){
					$yt_alert_Model.prompt('手动开票成功');
					ticketOpenInfo.getPlanListInfo();
					$('.class-page').pageInfo('refresh');
				}else{
					$yt_alert_Model.prompt('手动开票失败')
				}
				$(".manual-invoice-alert").hide();
				$yt_baseElement.hideLoading();
			},
			error:function(){
				$yt_alert_Model.prompt('网络异常，手动开票失败');
				$yt_baseElement.hideLoading();
			}
		});
	},
	//获取所有税控机
	allfrc:function(parent){
		$.ajax({
			type:"post",
			url:$yt_option.base_path+"finance/projectInvoice/getFcrAcll",
			async:true,
			data:{
				
			},
			success:function(data){
				if(data.flag==0){
					var li =''
					var ht = $(parent).find('.frcUl').empty();
					$.each(data.data, function(i,n) {
						if(n.isCheck==0){
							li = '<li class="yt-list-li" style="float:left;border:none;width:135px"><label class="check-label yt-radio"><input type="radio" value="'+n.fcrBaseId+'" name="frc"/><span>'+n.fcrBaseName+'</span><img src="../../resources/images/icons/eyes.png" class="frceyes" style="margin:0 0 0 5px;"/></label></li>';
							li = $(li).data('data',n);
							ht.append(li)
						}else{
							li='<li class="yt-list-li" style="float:left;border:none;width:135px"><label class="check-label yt-radio check"><input type="radio" value="'+n.fcrBaseId+'" name="frc" checked/><span>'+n.fcrBaseName+'</span><img src="../../resources/images/icons/eyes.png" class="frceyes" style="margin:0 0 0 5px;"/></label></li>'
							li = $(li).data('data',n);
							ht.append(li)
						}
					});
					$('.frceyes').hover(function(){
						$(this).attr('src','../../resources/images/icons/eyes-hover.png')
					},function(){
						$(this).attr('src','../../resources/images/icons/eyes.png')
					})
					//鼠标悬停小眼睛，弹出发票信息
					$('.frceyes').tooltip({
						content:function(){
							var lis= $(this).parents('li');
							var data = lis.data('data');
							var htmls;
							htmls = '<table>'+
									'<tr style="height:30px">'+
										'<td align="right">开票方公司名称：</td>'+
										'<td style="width:150px">'+data.company+'</td>'+
										'<td align="right">开票方税号：</td>'+
										'<td style="width:150px">'+data.invoice+'</td>'+
									'</tr>'+
									'<tr style="height:30px">'+
										'<td align="right">开票机号：</td>'+
										'<td>'+data.kpjh+'</td>'+
										'<td align="right">公司地址：</td>'+
										'<td>'+data.address+'</td>'+
									'</tr>'+
									'<tr style="height:30px">'+
										'<td align="right">联系电话：</td>'+
										'<td>'+data.tel+'</td>'+
										'<td align="right">联系人：</td>'+
										'<td>'+data.contact+'</td>'+
									'</tr>'+
									'<tr style="height:30px">'+
										'<td align="right">发票机用途：</td>'+
										'<td colspan="3"><p>'+data.fcrType+'</p></td>'+
									'</tr>'+
								'</table>';
							return htmls;
						},
						onShow: function() {
							$(this).tooltip('tip').css({
								backgroundColor: '#666',
								borderColor: '#666',
								color:'#fff'
							});
						}
					});
				}else{
					$yt_alert_Model.prompt('获取税控机失败')
				}
			},error:function(){
				$yt_alert_Model.prompt('网络异常，获取税控机失败')
			}
		});
	},
	//保存默认税控机
	savefrc:function(parent){
		$.ajax({
			type:"post",
			url:$yt_option.base_path+"finance/projectInvoice/saveOrUpdateFcr",
			async:true,
			data:{
				fcrBaseId:$(parent).find('.frcUl input[type=radio]:checked').val()
			},
			success:function(data){
				if(data.flag==0){
					$yt_alert_Model.prompt('保存成功')
				}else{
					$yt_alert_Model.prompt('保存失败')
				}
			},error:function(){
				$yt_alert_Model.prompt('网络异常，保存失败')
			}
		});
	},
//班级信息-------------------------------------------------------------------	
	/**
	 * 获取班级信息
	 */      
	getClassInfo:function() {
		var projectCode = $yt_common.GetQueryString("projectCode");
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "class/getBeanByProjectCode",
			async: true,
			data: {
				projectCode: projectCode
			},
			objName: 'data',
			success: function(data) {
				if(data.flag == 0) {
					
					if(data.data.projectType==1){
						data.data.projectType="计划";
					}else if(data.data.projectType==2){
						data.data.projectType="委托";
					}else if(data.data.projectType==3){
						data.data.projectType="选学";
					}else if(data.data.projectType==4){
						data.data.projectType="中组部调训";
					}else if(data.data.projectType==5){
						data.data.projectType="国资委调训";
					}
					$('.project-code').text(data.data.projectCode);
					$('.project-name').text(data.data.projectName);
					$('.project-type').text(data.data.projectType);
					$('.project-sell').text(data.data.projectSell);
					$('.start-date').text(data.data.startDate);
					$('.end-date').text(data.data.endDate);
					$('.train-date').text(data.data.trainDate);
					$('.details').text(data.data.details);
					$('.customer-unit').text(data.data.customerUnit);
					$('.customer-dept').text(data.data.customerDept);
					$('.customer-linkman').text(data.data.customerLinkman);
					$('.customer-linkman-position').text(data.data.customerLinkmanPosition);
					$('.customer-linkman-phone').text(data.data.customerLinkmanPhone);
					$('.customer-linkman-cellphone').text(data.data.customerLinkmanCellphone);
					$('.customer-linkman-fax').text(data.data.customerLinkmanFax);
					$('.customer-linkman-email').text(data.data.customerLinkmanEmail);
					$('.customer-trainee-position').text(data.data.customerTraineePosition);
					$('.customer-trainee-sum').text(data.data.customerTraineeSum);
					$('.customer-trainee-age-structure').text(data.data.customerTraineeAgeStructure);
					$('.customer-target-demand').text(data.data.customerTargetDemand);
					$('.project-head').text(data.data.projectHead);
					$('.class-teacher').text(data.data.classTeacher);
					$('.project-aid').text(data.data.projectAid);
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function() {
						$yt_alert_Model.prompt("查询失败");
					});
				}
			}
		});
	},
	/**
	 * 键盘点击事件
	 */
	keyDown:function(){
		$("#keyword").focus(function(e){
			$(this).keydown(function(e){
				if(e.keyCode==13){
					$(".search-person-btn").click();
				}
			});
		});
		
	}
	
};

$(function() {
	//初始化方法
	ticketOpenInfo.init();

});