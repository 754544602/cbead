(function($, window) {
	var ordinaryApply = {
		/**
		 * 开始执行
		 */
		init: function() {
			var ts = this;
			ts.start();

			ts.events();

		},
		/**
		 * 初始化组件
		 */
		start: function() {
			$('select').niceSelect();

		},
		/**
		 * 事件处理
		 */
		events: function() {
			//附件名称显示
			/*$('.file-input').on('change', function() {
				var ithis = $(this);
				var val = ithis.val();
				ithis.parent().find('.file-title').text(val);
			});*/
			//付款相关附件
			$('.cont-file').on('change',function(){
				var ithis = $(this);
				var val = ithis.val();
				var parent = ithis.parents('.file-up-div');
				parent.find('.file-msg').text(val).css('color','#333');
				var html = '<div class="file-li"><span class="file-name">'+val+'</span><span class="del-file">x</span></div>';
				$('.file-name-list').append(html);
			});
			//附件删除
			$('.file-name-list').on('click','.del-file',function(){
				
				var ithis = $(this);
				ithis.parent().remove();
			});
			
			//是否专项切换
			$('.special-type').on('click',function(){
				var ithis = $(this);
				if(ithis.val() == '0'){
					//显示编号金额
					$('#prjNumBox,#prjMoneyBox').css('display','inline-block');
				}else{
					//隐藏编号金额
					$('#prjNumBox,#prjMoneyBox').hide();
				}
			});
			
			//新增明细
			$('#addProcuList').on('click',function(){
				
				//显示弹框及蒙层
				$yt_baseElement.showMongoliaLayer();
				$yt_alert_Model.getDivPosition($('#createDetali'));
				$('#pop-modle-alert').show();
				$('#createDetali').show();
			});
			
			
			//添加到付款明細列表
			$("#paymentAddBtn").on('click',function(){
				
				//所属预算项目
				var budgetProject = $('#budgetProject option:selected').text();
				//金额
				var budgetMoney = $('#budgetMoney').val();
				//专项项目编号
				var specialNum = $('#specialNum').text();
				//付款相关附件
				var paymentFileName = $('#paymentFileName').text();
				
				var html = '<tr> <td>'+budgetProject+'</td> <td style="text-align: right;">'+budgetMoney+'</td> <td>'+specialNum+'</td><td><span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span><span class="operate-del"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span></td> </tr>'; $('#paymentList tbody').append(html);
				
				//关闭弹框及蒙层
				$yt_baseElement.hideMongoliaLayer();
				$('#createDetali').hide();
				$('#pop-modle-alert').hide();
			});
			

			//删除
			$('#paymentList').on('click', '.operate-del', function() {
				var ithis = $(this);
				var tr = ithis.parents('tr');
				$yt_alert_Model.alertOne({
					alertMsg: "数据删除将无法恢复,确认删除吗?", //提示信息  
					confirmFunction: function() { //点击确定按钮执行方法  
						tr.remove();
					}
				});
			});

			//编辑
			$('#paymentList').on('click', '.operate-update', function() {
				var ithis = $(this);
				var tr = ithis.parents('tr');
				
				//显示弹框及蒙层
				$yt_baseElement.showMongoliaLayer();
				$yt_alert_Model.getDivPosition($('#createDetali'));
				$('#pop-modle-alert').show();
				$('#createDetali').show();

			});
			//修改关闭
			$('#paymentCanelBtn').on('click', function() {
				//关闭弹框及蒙层
				$yt_baseElement.hideMongoliaLayer();
				$('#createDetali').hide();
				$('#pop-modle-alert').hide();
			});
			
			//保存事前申请
			$('#savePayment').on('click',function(){
				if($yt_valid.validForm($('.base-info-model'))){
					
				}
			});
			//生成事前申请
			$('#getPayment').on('click',function(){
				if($yt_valid.validForm($('.base-info-model'))){
					
				}
			});

		}

	};

	$(function() {
		ordinaryApply.init();
	});
})(jQuery, window);