$(function(){
	//获取表格信息
	getConfigData.getTableData();
	//给列加编号的td加样式
	$(".datagrid-htable .datagrid-header-row:eq(0) td").addClass("td-num-sty");
	//添加layout的高度
	$(".easyui-layout:not(.fun-btn-model)").css("height",$(window).height()+"px");
    $(".easyui-layout:not(.fun-btn-model)").layout("resize", {
        width: "100%",
        height: ($(window).height()-10) + "px"
    });
});
var getConfigData = {
	/**
	 * 
	 * 获取预算表信息
	 * 
	 */
	getTableData :function (){
		$.post("budget/table/getTableDetailListByParams",function(data){
			if(data.flag==0){
				var trDoc  = '';
				//拼接预算表数据
				$.each(data.data,function (i,n){
					trDoc = '<tr>'+
				 	    		'<td>'+n.tableCode+'</td>'+
				 	    		'<td>'+n.budgetTypeName+'</td>'+
				 	    		'<td style="text-align: left;">'+n.tableName+'</td>'+
				 	    		'<td>'+n.lastOperatorUserName+'</td>'+
				 	    		'<td>'+n.lastOperatorDateTime+'</td>'+
				 	    	'</tr>';
					$("#table-list tbody").append(trDoc);
					//绑定列表点击事件
					$("#table-list tbody tr").last().data("tableData",n).click(function (){
						//切换选择样式
						$(this).addClass("yt-table-active").siblings().removeClass("yt-table-active");
						//切换表格显示
						$(".table-config .no-select-table").hide();
						//比对表格code显示对应的表格
						$('.table-config table[table-code="'+n.tableCode+'"]').show().addClass("select-table").siblings().removeClass("select-table").hide();
						//$(".table-config table").eq($(this).index()).show().addClass("select-table").siblings().removeClass("select-table").hide();
						//切换到表格配置区域
						$(".tab-content:eq(1)").show().siblings().hide();
						//显示表名称
						$(".table-title-model").show();
						//设置表名
						$(".tab-name").text(n.tableName);
					});
				});
			}
		});
	}
}
