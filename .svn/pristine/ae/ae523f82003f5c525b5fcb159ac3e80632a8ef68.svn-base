var curriculumList = {
	//初始化方法
	init: function() {
		
		//默认加载待审批列表
		var path="finance/invoicing/lookForAllByApproved";
		curriculumList.getBorrowListInfo(path);
		//默认审批审批列表标识为1
		$('#operate-type').val("1");
		$(".tab-title-list button").click(function() {
			$(this).addClass("active").siblings().removeClass("active");
			operate = $(this).text();
			if (operate=="• 待审批") {
				$('#operate-type').val("1");
				var path="finance/invoicing/lookForAllByApproved"
				curriculumList.getBorrowListInfo(path);
			};
			
			if (operate=="• 审批记录") {
				$('#operate-type').val("2");
				var path="finance/invoicing/lookForAllByHi"
				curriculumList.getBorrowListInfo(path);
			};
			
		});
		//点击班级名跳转到审批详情页面
		$('.borrow-list').on('click','.invoice-org-href',function(){
			var pkId = $(this).parent().parent().find('.pk-id').text();
			var state = $(this).parent().parent().find('.work-flaw-state').text();
			var btnTpye = $('#operate-type').val();
			if(btnTpye==1){
				if(state=="草稿" || state=="未通过"){
					//跳转到修改发票借用详情的页面---完
					window.location.href = "reviseBorrowInfo.html?pkId="+pkId;
				}else{
					curriculumList.getOneListInfo(pkId);
				}
			};
			if(btnTpye==2){
				//跳转到发票借用情页面和审批都不可更改页面-----完
				window.location.href = "borrowInfo.html?pkId="+pkId;
			}
			
		});
		
		
		
	
	},
	
	
	//判断当前流程该由谁来操作
	getOneListInfo: function(pkId) {
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "finance/reduction/getBeanById",
			async: false,
			data: {
				pkId: pkId
			},
			success: function(data) {
				if(data.flag == 0) {
					//流程
					var flowLog = JSON.parse(data.data[0].flowLog);
					var length=flowLog.length;
					var tastKeyType= flowLog[0].tastKey;
					var deleteReason= flowLog[0].deleteReason;
					if(length==0){
						
					}else if(tastKeyType=="activitiStartTask"){
						//发票借用详情能修改，审批流程不能修改的
						//window.location.href = "reviseBorrow.html?pkId="+pkId;
						
					}else if(tastKeyType=="activitiEndTask" && deleteReason =="completed"){//审批流程结束
				
						//发票借用详情和审批流程都为只可查看状态-----完
						window.location.href = "borrowInfo.html?pkId="+pkId;
					}else{
						//发票借用详情不能修改，审批流程可以修改-----完
						window.location.href = "reviseBorrowInfo.html?pkId="+pkId;
					}
				
				}
			}
		});
	},

	
	
	
	/**
	 * 发票列表
	 */
	getBorrowListInfo: function(path) {
		var keyword = $('#keyword').val();
		$('.page-info').pageInfo({
			async:true,
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + path, //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam: keyword
			}, //ajax查询访问参数
			before:function (){
				$yt_baseElement.showLoading();
			},
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.borrow-list .borrow-list-tod');
					var htmlTr = '';
					var num = 1;
					var invoiceType;
					if(data.data.rows.length > 0) {
						$(htmlTbody).empty()
						$.each(data.data.rows, function(i, v) {
							i = i + 1;
							if(v.invoiceType == 1) {
								invoiceType = "普通发票";
							};
							if(v.invoiceType == 2) {
								invoiceType = "增值税发票";
							};
							htmlTr = '<tr>' +
								'<td>' + i + '</td>' +
								'<td style="display:none;" class="pk-id">' + v.pkId + '</td>' +
								'<td style="text-align: left !important;" class="invoice-org"><a style="color: #4169E1;float:left;" class="invoice-org-href">' + v.invoiceOrg + '</a></td>' +
								'<td class="invoice-type">' + invoiceType + '</td>' +
								'<td class="create-time-string">' + v.createTimeString + '</td>' +
								'<td class="application-invoice">' + v.applicationInvoice + '</td>' +
								'<td class="create-user">' + v.createUser + '</td>' +
								'<td class="work-flaw-state">' + v.dealingWithPeople + '</td>' +
								'</tr>';
							htmlTbody.append(htmlTr);
						});
					}else {
						$(htmlTbody).empty();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="7" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
							htmlTbody.append(htmlTr);
							$('.page1').hide();
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
};

$(function() {
	//初始化方法
	curriculumList.init();

});