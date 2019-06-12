var mal = {
	initDate: function() {
		//给当前页面设置最小高度
		$(".body-div").css("min-height",$(window).height()-16);
		/**
		 * 
		 * 
		 * 初始化日期控件
		 * 
		 */
		$("#startDate").calendar({
			controlId: "startTime",
			nowData: false, //默认选中当前时间,默认true  
			upperLimit: $("#endDate"), //开始日期最大为结束日期  
			speed: 0,
			callback: function() {}
		});
		$("#endDate").calendar({
			controlId: "endTime",
			nowData: false, //默认选中当前时间,默认true  
			lowerLimit: $("#startDate"), //结束日期最小为开始日期  
			speed: 0,
			callback: function() {}
		});
		//初始化下拉框数据
		mal.setAddselect();
		//获取列表
		mal.getDraftsList();
		//为页面按钮初始化事件
		mal.thisEvent();
	},
	/*事件绑定*/
	thisEvent: function() {
		//查询按钮事件
		$(".drafts-search-btn").click(function() {
			mal.getDraftsList();
		});
		//重置按钮事件
		$(".drafts-reset-btn").click(function() {
			$(".apply-reason").val('');
			//下拉列表
			$(".apply-type").val('');
			mal.setAddselect();
			$(".apply-type").niceSelect();
			$(".save-begin-date").val('');
			$(".save-end-date").val('');
			mal.getDraftsList();
		});
	},
	/**
	 * 设置下拉列表信息
	 */
	setAddselect: function() {
		$("select.user-name-sel").niceSelect();
	},
	/**
	 * 
	 * 获取表数据方法
	 * 
	 */
	getDraftsList: function() {
		$('.table-page').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.websit_path+'resources-sasac/js/testJsonData/beforehandApproveList.json', //ajax访问路径
			data:{
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},	
}
$(function() {
	mal.initDate();
})