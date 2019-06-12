var budgetList = {
	inits: function() {
		//给当前页面设置最小高度
		$("#budgetList").css("min-height", $(window).height() - 13);
		//初始化页面事件
		budgetList.events();
		budgetList.getPlanList();
	},
	events: function() {
		//yt-table-active
		$(".plan-list").on("click",".plan-list-item",function(){
			var thisObj=$(this);
			//移除列表的选中状态
			$(".plan-list .plan-list-item").removeClass("plan-item-active");
			thisObj.addClass("plan-item-active");
		})
		//添加按钮事件
		$(".operation-btn-list").on("click", ".add-plan-item", function() {
			//提示信息   $yt_alert_Model.prompt("添加按钮事件");
			//调用添加弹出窗
			budgetList.showAlert();
		});
		//修改按钮事件
		$(".operation-btn-list").on("click",".update-plan-item",function(){
			//获取已完结列表中选中行数据个数
			var selTrLen = $(".plan-list .plan-list-item.plan-item-active").length;
			if(selTrLen == 0){
				$yt_alert_Model.prompt("请选择一项数据进行操作");
			}else{
				var thisObj=$(".plan-list .plan-list-item.plan-item-active");
				//移除列表的选中状态
				$(".plan-list .plan-list-item").removeClass("plan-item-active");
				//调用添加弹出窗
				budgetList.showAlert(thisObj);
			}
		});
		//页面跳转事件绑定   to-list-link
		$(".plan-list").on("click",".to-list-link",function(){
			var thisObj=$(this);
			var thisTr=thisObj.parents("tr");
			var thisDiv=thisTr.parents("div.plan-list-item");
			//取值
			//账套id		当前code
			var booksId=thisDiv.find(".books-id").val();
			var budgetStage=thisTr.find(".budget-stage").val();
			//页面跳转
			window.location.href=$yt_option.websit_path+"view/system-sasac/budget/module/expenditure/budgetTableStyle.html?booksId=" + booksId + "&budgetStage=" + budgetStage;//即将跳转的页面路径
//			var pageUrl = "view/system-sasac/budget/module/expenditure/budgetTableStyle.html?booksId=" + booksId + "&budgetStage=" + budgetStage;//即将跳转的页面路径
//			var goPageUrl = "view/system-sasac/budget/module/expenditure/budgetTableStyle.html";//左侧菜单指定选中的页面路径
//			window.open($yt_option.websit_path+"index.html?pageUrl="+encodeURIComponent(pageUrl)+'&goPageUrl='+goPageUrl);
		});
		//重置按钮事件绑定
		$("#resetBtn").click(function(){
			$(".query-text").val("");
			budgetList.getPlanList();
		});
		//查询按钮事件绑定
		$("#heardSearchBtn").click(function(){
			budgetList.getPlanList();
		});
	},
	//添加弹出框  
	showAlert:function(thisObj) {
		//按钮切换
		$(".add-data-pop .add-plan-btn").show();
		$(".add-data-pop .save-plan-btn").hide();
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$(".yt-edit-alert.add-data-pop,#heard-nav-bak").show();
		/** 
		 * 调用算取div显示位置方法 
		 */
		$yt_alert_Model.getDivPosition($(".yt-edit-alert.add-data-pop"));
		//初始化数据
		$("#planInput,#yearInput,#describeTextarea").val("").removeClass("valid-hint");
		$(".add-data-pop .valid-font").text("");
		//初始化单位名称列表
		budgetList.getUtilName();
		if(thisObj){
			//按钮切换
			$(".add-data-pop .add-plan-btn").hide();
			$(".add-data-pop .save-plan-btn").show();
			//取值  and 赋值         
			//账套id   账套名称   所属年度   单位code   描述
			$("#booksId").val(thisObj.find(".list-item-title .books-id").val());
			$("#planInput").val(thisObj.find(".list-item-title .books-name").text());
			$("#yearInput").val(thisObj.find(".list-item-title .books-year").text());
			$("#unitCode").val(thisObj.find(".list-item-title .unit-num").text()); //下拉列表 
			$("#unitCode").niceSelect();
			$("#describeTextarea").val(thisObj.find(".list-item-title .books-describe input").val());
		}
		//保存按钮事件绑定
		$(".add-data-pop").on("click",".save-plan-btn",function(){
			//验证非空字段
			var isTrue= $yt_valid.validForm($(".yt-edit-alert.add-data-pop"));  
			if(isTrue){
				//取值
				var booksId=$("#booksId").val();
				var planInput=$("#planInput").val();
				var yearInput=$("#yearInput").val();
				var unitCode=$("#unitCode").val();
				var describeTextarea=$("#describeTextarea").val();
				//执行保存事件
				$.ajax({
					type: "post",
					url: 'budget/books/updateBooksInfo', //ajax访问路径  
					async: false,
					data: {
						booksId:booksId,
						booksName:planInput,
						booksYear:yearInput,
						unitNum:unitCode,
						booksDescribe:describeTextarea,
					},
					success: function(data) {
						if(data.flag==0){
							//隐藏页面中自定义的表单内容  
							$(".yt-edit-alert,#heard-nav-bak").hide();
							//隐藏蒙层  
							$("#pop-modle-alert").hide();
							budgetList.getPlanList();
						}else{
							//提示信息
							$yt_alert_Model.prompt(data.message);
						}
					}
				});
				
			}
			
		});
		//添加按钮事件绑定
		$(".add-data-pop").on("click",".add-plan-btn",function(){
			//验证非空字段
			var isTrue= $yt_valid.validForm($(".yt-edit-alert.add-data-pop"));  
			if(isTrue){
				//取值
				var planInput=$("#planInput").val();
				var yearInput=$("#yearInput").val();
				var unitCode=$("#unitCode").val();
				var describeTextarea=$("#describeTextarea").val();
				//执行添加事件
				$.ajax({
					type: "post",
					url: 'budget/books/saveBooksInfo', //ajax访问路径  
					async: false,
					data: {
						booksName:planInput,
						booksYear:yearInput,
						unitNum:unitCode,
						booksDescribe:describeTextarea,
					},
					success: function(data) {
						if(data.flag==0){
							//隐藏页面中自定义的表单内容  
							$(".yt-edit-alert,#heard-nav-bak").hide();
							//隐藏蒙层  
							$("#pop-modle-alert").hide();
							budgetList.getPlanList();
						}
						//提示信息
						$yt_alert_Model.prompt(data.message);
					}
				});
			}
			
		});
		
		/** 
		 * 点击取消方法 
		 */
		$('.yt-edit-alert.add-data-pop .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
			//隐藏页面中自定义的表单内容  
			$(".yt-edit-alert,#heard-nav-bak").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
			//初始化数据
			$("#planInput,#yearInput,#describeTextarea").val("").removeClass("valid-hint");
			$(".add-data-pop .valid-font").text("");
			//初始化单位名称列表
			budgetList.getUtilName();
		});
	},
	
	//初始化单位名称
	getUtilName:function(){
		$.ajax({
			type: "post",
			url: $yt_option.base_path + 'budget/table/getBudgetClassifyDataByParams?tableKey=coso_classify_unit_main', //ajax访问路径  
			async: false,
			data: {},
			success: function(data) {
				var datas = data.data.rows;
				if(data.flag == 0) {
					var numOptions = '<option value="">请选择</option>';
					//判断返回的数据
					$('#unitCode').empty();
					if(datas.length > 0 && datas != undefined && datas != null) {
						$.each(datas, function(i, n) {
							numOptions += '<option value="' + n.code + '" sel-val="' + n.name + '">' + n.name + '</option>'
						});
						$('#unitCode').append(numOptions);
					}
					$('#unitCode').niceSelect();
				}
			}
		});
	},
	//账套列表数据
	getPlanList:function(){
		//queryParams	名称,年度关键字查询, 
		var queryParams = $(".query-text").val();
		$.ajax({
			type: "post",
			url: "budget/books/getAllBooksInfoListByParams",
			async: false,
			data: {
				queryParams: queryParams
			},
			success: function(data) {
				if(data.flag == 0) {
					$(".plan-list").html("");
					var thisData=data.data; 
					if(thisData.length > 0) {
						var plalListHtml="";
						$.each(thisData, function(i, n) {
							plalListHtml += '<div class="plan-list-item">' + 
							'<div class="list-item-title">' + 
							'<label><span style="letter-spacing:5px;">账套名</span>称：<span class="books-name"><input type="hidden" class="books-id" value="'+n.booksId+'"/>'+n.booksName+'</span></label>' +
							'<label><span style="letter-spacing:5px;">所属年</span>度：<span class="books-year">'+n.booksYear+'</span></label>' + 
							'<label class="qtip-lable"><span style="letter-spacing:5px;">单位编</span>码：<span class="unit-num"><input type="hidden" value="'+n.unitNum+'"/>'+(n.unitNum == '' ? '--' :n.unitNum)+'</span></label>' + 
							'<label class="qtip-lable"><span style="letter-spacing:5px;">单位名</span>称：<span><input type="hidden" value="'+n.unitName+'"/>'+(n.unitName == '' ? '--' : (n.unitName.length > 12 ? n.unitName.substring(0,12) + '...' : n.unitName))+'</span></label>' + 
							'<label class="qtip-lable"><span style="letter-spacing:43px;">描</span>述：<span class="books-describe"><input type="hidden" value="'+n.booksDescribe+'"/>'+(n.booksDescribe == '' ? '--' : (n.booksDescribe.length > 12 ? n.booksDescribe.substring(0,12) + '...' : n.booksDescribe))+'</span></label>' + 
							'</div><div class="list-item-table">' +
							'<table class="yt-table" style=""><thead class="yt-thead">' + 
							'<tr><th>阶段</th><th>状态</th></tr></thead><tbody class="yt-tbody">';
							
							if(n.budgetStageList.length>0){
								$.each(n.budgetStageList , function(index,nl) {
									plalListHtml += '<tr><td><a class="yt-link to-list-link"><input type="hidden" class="budget-stage" value="'+nl.budgetStage+'"/>'+ nl.budgetStageName +'('+nl.tableNum+')</a></td>';
									
									if(nl.stageState==0){
										plalListHtml += '<td>未创建</td>';
									}else if(nl.stageState==1){
										plalListHtml += '<td>已创建</td>';
									}else if(nl.stageState==2){
										plalListHtml += '<td>已发布</td>';
									}else if(nl.stageState==3){
										plalListHtml += '<td>已生效</td>';
									}else if(nl.stageState==4){
										plalListHtml += '<td>已完成</td>';
									}else{
										plalListHtml += '<td>已执行</td>';
									};
									plalListHtml += '</tr></tr>';
								});
							};
							
							plalListHtml += '</tbody></table></div></div>';
							/*plalListHtml += '<div class="plan-list-item">' + 
							'<div class="list-item-title"><label>账套名称：</label></div>' + 
							'<table class="yt-table" style=""><tbody class="yt-tbody">' + 
							'<tr><td>阶段</td><td>状态</td></tr>' + 
							'<tr><td><a class="yt-link">一上(<span>1</span>)</a></td><td></td></tr>' + 
							'<tr><td><a class="yt-link">一下(<span>1</span>)</a></td><td></td></tr>' + 
							'<tr><td><a class="yt-link">二上(<span>1</span>)</a></td><td></td></tr>' + 
							'<tr><td><a class="yt-link">二下(<span>1</span>)</a></td><td></td>' + 
							'</tr></tbody></table></div>';*/
						});
						$(".plan-list").html(plalListHtml);
						budgetList.initQtip();
					}else{
						var noDataStr = '<table style="width:100%;"><tr style="border:0px;background-color:#fff !important;"><td  colspan="' + 1 + '" align="center"style="border:0px;"><div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../../../../resources-sasac/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div></td></tr></table>';
						$(".plan-list").html(noDataStr);
					}
				}else{
					 $yt_alert_Model.prompt(data.messager);
				}
			}
		});
	},
	//提示信息方法
	initQtip:function(){
		//注意：以下配置参数如无特别说明均为默认，使用时只需配置相关参数即可  
        $('.qtip-lable').qtip({  
            // 默认为事件触发时加载，设置为true时，会在页面加载时加载提示 类型：boolean，true, false (默认: false)  
            // prerender: false,  
            // 为提示信息设置id，如设置为myTooltip就可以通过ui-tooltip-myTooltip访问这个提示信息  类型:"String", false (默认: false)  
            // id: false,  
            // 每次显示提示都删除上一次的提示  类型：boolean，true, false (默认: true)  
            // overwrite: true,  
            // 通过元素属性创建提示  如a[title]，把原有的title重命名为oldtitle  类型：boolean，true, false (默认: true)  
            // suppress: true,  
            // 内容相关的设置     
            content: {  
                // 提示信息的内容，如果只设置内容可以直接 content: "提示信息"，而不需要 content: { text: { "提示信息" } }    
                text: function(event,api) {
					var thisObj = $(this);
					var showText= '<div style="max-width:220px;padding:3px 5px">'+(thisObj.find("input").val()=='' ? '暂无数据' : thisObj.find("input").val())+'</div>';
					return showText;
                },
            },
            // 位置相关的设置    
            position: {  
                my: 'top center',
				at: 'bottom center',
				container: false,
				viewport: $('body'),
				adjust: {
					x: 0,
					y: 0,
					//是否在鼠标悬停时提示 true, false (默认: true)
					mouse: true,
					//是否可以调整提示信息的位置
					resize: true,
					method: 'flip flip'
				},
            },  
            // 隐藏提示的相关设置  参考show  
            hide: {  
                /*在提示框显示时可以进行交互*/
				fixed: true,
//				event:"click"
            },  
            // 样式相关    
            style: {  
                /*自定义的类样式*/
				classes: 'showmod',
				/*tip插件，箭头相关设置*/
				tip: {
					corner: true,
					mimic: false,
					width: 10,
					height: 10,
					border: true,
					offset: 0
				}
            },  
            // 事件对象确定绑定到工具提示的初始事件处理程序  
            events: {  
                show:function (data){
					$(data.target).find(".qtip-content").css("max-height",$('#frame-right-model').height()-200);
				}
            }  
        }); 
	},
};
$(function() {
	budgetList.inits();
});