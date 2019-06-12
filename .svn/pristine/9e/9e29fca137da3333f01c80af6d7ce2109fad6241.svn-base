(function($, window) {
	var ordinaryPayment = {
		/**
		 * 开始执行
		 */
		init: function() {
			var ts = this;

			
			//设置控件
			ts.start();
			//事件处理
			ts.events();
		},
		/**
		 * 事件处理
		 */
		events: function() {
			var ts = this;
			
			//表格点击变色
			$yt_baseElement.tableRowActive();
			//附件上传显示名称
			$('.file-input').on('change',function(){
				var ithis = $(this);
				var val = ithis.val();
				ithis.parent().find('.file-title').text(val);
				
			});
			//选择事前审批单
			$('#selectNum').on('click', function() {
				//获取数据
				//ts.getOrdinaryList();

				//弹出蒙层及提示框
				$yt_baseElement.showMongoliaLayer();
				$yt_alert_Model.getDivPosition($('#selectBox'));
				$('#pop-modle-alert').show();
				$('#selectBox').show();

			});
			//选择事前审批确定
			$('#selectAddBtn').on('click', function() {
				var tr = $('#ordinApplyList tbody .yt-table-active');
				if(tr) {
					
					//隐藏弹出框蒙层
					$yt_baseElement.hideMongoliaLayer();
					$('#pop-modle-alert').hide();
					$('#selectBox').hide();
					//隐藏提示
					$('.message-div').hide();
					//显示数据
					$('.ordinary-div').css('min-height','300px');
					$('.context-div').show();
					$('.ordinar-div').show();
				} else {
					$yt_alert_Model.prompt('请选择一条数据');

				}
			});
			//取消选择
			$('#selectCanelBtn').on('click', function() {
				//关闭蒙层及弹框
				$yt_baseElement.hideMongoliaLayer();
				$('#pop-modle-alert').hide();
				$('#selectBox').hide();
			});
			
			
			//新增数据验证
			$('#addProcuList').on('click',function(){
				if($yt_valid.validForm($('.base-info-form-modle'))){
					
					
					
				}
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
			
			//确定编辑
			$('#createDetali').on('click',function(){
				$yt_baseElement.hideMongoliaLayer();
				$('#pop-modle-alert').hide();
				$('#createDetali').hide();
				
			});
			
			//取消编辑
			$('#paymentCanelBtn').on('click',function(){
				$yt_baseElement.hideMongoliaLayer();
				$('#pop-modle-alert').hide();
				$('#createDetali').hide();
			});
		},
		/**
		 * 空间初始化
		 */
		start:function(){
			$('select').niceSelect();
			
		},
		
		/**
		 * 获取事前审批单
		 */
		getOrdinaryList: function() {
			var approveFormTbody = $('#ordinApplyList tbody');

			$('.page-info').pageInfo({
				pageIndex: 1,
				pageNum: 5, //每页显示条数  
				pageSize: 3, //显示...的规律  
				url: "website/js/testJsonData/ordinaryPayment", //ajax访问路径  
				type: "get", //ajax访问方式 默认 "post"
				async: false, //ajax 访问类型 默认 true 异步,false同步 
				objName: 'data',
				data: {},
				success: function(data) {
					approveFormTbody.empty();
					if(data.flag == 0) {
						var list = data.data.rows || [];
						var trStr = "";
						if(list.length > 0) {
							//显示分页
							$('.table-page').show();
							$.each(list, function(i, n) {
								trStr = '<tr>';
							});
							approveFormTbody.append(trStr);
						} else {
							//隐藏分页
							$('.table-page').hide();
							var noTr = '<tr class="model-no-data-tr"><td colspan="2"><div class="no-data"><img src="../../../../../resources-sasac/images/common/no-data.png" alt=""></div></td></tr>';
							approveFormTbody.append(noTr);
						}
					}
				} //回调函数 匿名函数返回查询结果  
			});
		}

	};

	$(function() {
		ordinaryPayment.init();
	});

})(jQuery, window);