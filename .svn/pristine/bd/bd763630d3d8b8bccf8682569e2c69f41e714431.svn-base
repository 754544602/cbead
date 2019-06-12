(function($, window) {
	var executiveCondition = {
		/**
		 * 开始执行
		 */
		init: function() {
			var ts = this;
			ts.start();
			ts.getDataListe();

			ts.events();
		},
		/**
		 * 初始化组件
		 */
		start: function() {
			$('select').niceSelect();
			$('#startDate').calendar({
				speed:0,
				nowData: false
			});
			$('#endDate').calendar({
				speed:0,
				nowData: false
			});
		},
		/**
		 * 事件处理
		 */
		events: function() {

		},
		getDataListe:function(){}

	};

	$(function() {
		executiveCondition.init();
	});
})(jQuery, window);