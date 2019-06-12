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
			//发票附件
			$('#invoiceFile').on('change', function() {
				var ithis = $(this);
				var val = ithis.val();
				ithis.parents('.file-up-div').find('.file-msg').text(val).css('color', '#333');
			});
			//付款相关附件
			$('#paymentFile').on('change', function() {
				var ithis = $(this);
				var val = ithis.val();
				ithis.parents('.file-up-div').find('.file-msg').text(val).css('color', '#333');
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
					$('.context-div').show();
					$('.ordinar-div').show();
				} else {
					$yt_alert_Model.prompt('请选择一条数据');

				}
			});
			//双击选中
			$('#ordinApplyList tbody').on('dblclick', 'tr', function() {
				var tr = $(this);
				if(tr) {
					//隐藏弹出框蒙层
					$yt_baseElement.hideMongoliaLayer();
					$('#pop-modle-alert').hide();
					$('#selectBox').hide();
					//隐藏提示
					$('.message-div').hide();
					//显示数据
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

			//新增付款明细
			$('#addProcuList').on('click', function() {
				var ithis = $(this);
				var tr = ithis.parents('tr');

				//显示弹框及蒙层
				$yt_baseElement.showMongoliaLayer();
				$yt_alert_Model.getDivPosition($('#createDetali'));
				$('#pop-modle-alert').show();
				$('#createDetali').show();
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
			$('#savePayment').on('click', function() {

				//隐藏弹出框
				$yt_baseElement.hideMongoliaLayer();
				$('#pop-modle-alert').hide();
				$('#createDetali').hide();

			});

			//取消编辑
			$('#paymentCanelBtn').on('click', function() {
				$yt_baseElement.hideMongoliaLayer();
				$('#pop-modle-alert').hide();
				$('#createDetali').hide();
			});
			//保存申请
			$('#saveAddBtn').on('click', function() {
				if($yt_valid.validForm($('.base-info-form-modle'))) {

				}
			});
			//提交申请
			$('#submitBut').on('click', function() {
				if($yt_valid.validForm($('.base-info-form-modle'))) {

				}
			});
			//生成申请单
			$('#getPayment').on('click', function() {
				if($yt_valid.validForm($('.base-info-form-modle'))) {

				}
			});

		},
		/**
		 * 空间初始化
		 */
		start: function() {
			$('select').niceSelect();
			$('#payDate').calendar({
				speed:0,
				nowData: false,
			});
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