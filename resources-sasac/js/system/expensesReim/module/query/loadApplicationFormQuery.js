var pmPlanQueryObj = {
	orderDef:'../../../../../resources-sasac/images/module/order-def.png',//排序默认图标
	orderAsc:'../../../../../resources-sasac/images/module/order-acs.png',//正序图标
	orderDesc:'../../../../../resources-sasac/images/module/order-desc.png',//倒序图标
	userList:[],
	thisDate : "",
	//初始化申请人
	getUserList:function(){
		pmPlanQueryObj.userList=sysCommon.getUserAllInfo("","","");
	},
	//初始化方法
	init:function(){
		//初始化下拉列表
		$("select").niceSelect();
		//初始化所有经办部门方法		department
		pmPlanQueryObj.getDeptList();
		//初始化所有申请人列表方法
		pmPlanQueryObj.getUserList();
		/**
		 * 
		 * 
		 * 初始化日期控件
		 * 
		 */
		$("#startDate").calendar({
			controlId: "startTime",
			nowData: true, //默认选中当前时间,默认true  
			upperLimit: $("#endDate"), //开始日期最大为结束日期  
			speed:0,
			callback:function(){}
		});
		$("#endDate").calendar({
			controlId: "endTime",
			nowData: true, //默认选中当前时间,默认true  
			lowerLimit: $("#startDate"), //结束日期最小为开始日期  
			speed:0,
			callback:function(){}
		});
		pmPlanQueryObj.thisDate = $("#endDate").val();
		$("#startDate").val(pmPlanQueryObj.thisDate.substring(0,pmPlanQueryObj.thisDate.length - 2)+ "01");
		$(".plan-list-model").css("min-height",$(window).height()-52-$(".heard-query-model").height());
		$(window).resize(function(){
			$(".plan-list-model").css("min-height",$(window).height()-52-$(".heard-query-model").height());
		});
	},
	/**
	 * 重写金额转换方法
	 * @param {Object} str
	 */
	fmMoney: function(str) {
		return $yt_baseElement.fmMoney(str || '0');
	},
	/**
	 * 重写金额还原方法
	 */
	rmoney: function(str) {
		return $yt_baseElement.rmoney(str || '0');
	},
	/**
	 * 事件方法
	 */
	eventFun:function(){
		// 输入框输入文本后  显示出删除叉号
		$('#keyWord').on('keydown',function(){
			if($(this).val() != ''){
				$('.clearImg').show();
			}
		});
		// 点击叉号 清空输入框并隐藏叉号
		$('.clearImg').on('click',function(){
			$('#keyWord').val('');
			$(this).hide();
		});
		//重置按钮点击事件
		$("#resetBtn").on("click",function(){
			//清空关键字的输入框
			$(".keyword-input").val('');
			//初始化下拉列表
			$(".heard-query-model select").each(function(){
				$(this).find("option:eq(0)").prop("selected","selected");
			});
			$(".heard-query-model select").niceSelect();
			//隐藏叉号 清空输入框并隐藏叉号
			$('.clearImg').hide();
			$('#keyWord').val('');
			//重置日期
			//alert(pmPlanQueryObj.thisDate.substring(0,pmPlanQueryObj.thisDate.length - 2)+ "01");
			$("#startDate").val(pmPlanQueryObj.thisDate.substring(0,pmPlanQueryObj.thisDate.length - 2)+ "01");
			$("#endDate").val(pmPlanQueryObj.thisDate);
			//重新查询列表
			pmPlanQueryObj.getBeforehandList();
		});
		//审批状态多选框change事件
		$('.checkbox-state,.checkbox-quota,.checkbox-term').change(function() {
			
			pmPlanQueryObj.getBeforehandList();
		});
		//排序按钮触发事件
		$(".sort-btn-list button").click(function() {
			var property =  "";
			//调用分页查询方法
			property =  $(this).val();
			pmPlanQueryObj.getBeforehandList("DESC",property);
		});
		//跳转详情页面
		$('#loanApplyTable').on('click', '.to-detail', function(){
			var processInstanceId = $(this).parents('tr').find('.processInstanceId').val();
			var loanId=$(this).parents('tr').find('.appId').val();
			/*页面跳转打开新页面*/
			var pageUrl = "view/system-sasac/expensesReim/module/loanApply/loanApplyDetail.html?processInstanceId=" + processInstanceId+"&loanId="+loanId;//即将跳转的页面路径
			//window.open($yt_option.websit_path+"index.html?pageUrl="+encodeURIComponent(pageUrl)+'&goPageUrl='+goPageUrl);
			//调用公用的打开新页面方法传输参数不需要左侧菜单
			$yt_baseElement.openNewPage(2,pageUrl);
		});
	},
	
	
    
	//申请时间排序箭头变化
	switchtimeclick:function(){
			$(".sort-span").on("click", function() {
				//点击的图片
				var img = $(this).find('img');
				//点击对象的图片路径
				var src = img.attr("src");
				//点击类型code
				var code = $(this).attr('code');
				//重置所有的为默认
				$(".sort-span img").attr('src',pmPlanQueryObj.orderDef);
				//状态为正序
				if(src == pmPlanQueryObj.orderAsc) {
					//替换为倒序
					img.attr("src", pmPlanQueryObj.orderDesc);
					//查询数据
					pmPlanQueryObj.getBeforehandList('DESC',code);
				} else if(src == pmPlanQueryObj.orderDesc || src == pmPlanQueryObj.orderDef) {
					//状态为倒序或默认时 进入正序排列
					img.attr("src", pmPlanQueryObj.orderAsc);
					//查询数据
					pmPlanQueryObj.getBeforehandList('ASC',code);
				}
			});
			
		},
	//	借款金额箭头变化
	switchloanclick:function(){
		$(".loan-img").on("click",function(){
			var src = $(".loan-img").attr("src");
		if(src == "../../../../../resources-sasac/images/module/order-acs.png"){
			$(".loan-img").attr("src","../../../../../resources-sasac/images/module/order-desc.png");
		}else if(src == "../../../../../resources-sasac/images/module/order-desc.png"){
			$(".loan-img").attr("src","../../../../../resources-sasac/images/module/order-acs.png");
		}
		})
	},
	//	还款日期箭头变化
	switchrepaymentclick:function(){
		$(".repayment-img").on("click",function(){
			var src = $(".repayment-img").attr("src");
		if(src == "../../../../../resources-sasac/images/module/order-acs.png"){
			$(".repayment-img").attr("src","../../../../../resources-sasac/images/module/order-desc.png");
		}else if(src == "../../../../../resources-sasac/images/module/order-desc.png"){
			$(".repayment-img").attr("src","../../../../../resources-sasac/images/module/order-acs.png");
		}
		})
	},
	//	还款日期箭头变化
	switchnonrepaymentclick:function(){
		$(".nonrepayment-img").on("click",function(){
			var src = $(".nonrepayment-img").attr("src");
		if(src == "../../../../../resources-sasac/images/module/order-acs.png"){
			$(".nonrepayment-img").attr("src","../../../../../resources-sasac/images/module/order-desc.png");
		}else if(src == "../../../../../resources-sasac/images/module/order-desc.png"){
			$(".nonrepayment-img").attr("src","../../../../../resources-sasac/images/module/order-acs.png");
		}
		})
	},
		//	金额格式化
	moneyFormat: function() {
		/** 
		 * 金额文本框获取焦点事件 
		 */
		$(".top-money,.bottom-money").on("focus", function() {
			if($(this).val() != "") {
				//调用还原格式化的方法  
				$(this).val($yt_baseElement.rmoney($(this).val()));
			}
		});
		/** 
		 * 金额文本框失去焦点事件 
		 */
		$(".top-money,.bottom-money").on("blur", function() {
			if($(this).val() != "") {
				//调用格式化金额方法  
				$(this).val($yt_baseElement.fmMoney($(this).val()));
			}
		});
	},
	
	
	
	//遍历状态筛选多选框的状态
	multiSelection: function() {
		var str = '';
		$('.checkbox-state').each(function(i, n) {
			if(n.checked) {
				var s = $(n).val();
				str += s + ',';
			}
		});
		str=str.substring(0,str.length-1);
		return str;
	},
	//遍历还款状态多选框的状态
	quotaCheck: function() {
		var str = '';
		$('.checkbox-quota').each(function(i, n) {
			if(n.checked) {
				var s = $(n).val();
				str += s + ',';
			}
		});
		str=str.substring(0,str.length-1);
		return str;
	},
	//遍历还款期限多选框的状态
	termCheck: function() {
		var str = '';
		$('.checkbox-term').each(function(i, n) {
			if(n.checked) {
				var s = $(n).val();
				str += s + ',';
			}
		});
		str=str.substring(0,str.length-1);
		return str;
	},
	queryBeforehand: function() {
		$("#heardSearchBtn").on("click", function() {
			pmPlanQueryObj.getBeforehandList();
		})
	},
	/**
	 * 获取事前申请查询 列表
	 * @param {Object} 
	 */
	getBeforehandList: function(order,property) {
		//默认为日期倒序排列
		order = order || 'ASC';
		property = property || 'm.APPLICANT_TIME';
		//关键字
		var keyWord = $('.keyword-input').val();
		//申请日期1
		var applyDateTop = $('#startDate').val();
		//申请日期2
		var applyDateBottom = $('#endDate').val();
		$('.table-page').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url:'sz/loanApp/getTotalLoanAppQueryByParams', //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				queryParams:keyWord,	
				startDate:applyDateTop,
				endDate:applyDateBottom,
				property:property,
				direction:order
			}, 
			success: function(data) {
				var datas = data.data.rows;
				var htmlTbody = $('#loanApplyTable tbody');
				htmlTbody.empty();
				var trStr = "";
				if(data.flag == 0) {
					//获取loanAllAmount借款金额合计,unRefundAllAmount	未还款金额合计
					$(".loan-all-amount").text((data.data.loanAllAmount == "" ?"" : $yt_baseElement.fmMoney(data.data.loanAllAmount)));
					$(".unRefund-all-amount").text((data.data.unRefundAllAmount == "" ?"" : $yt_baseElement.fmMoney(data.data.unRefundAllAmount)));
					if(datas.length > 0) {
						$('.table-page').show();
						$.each(datas, function(i, n) {
							var refundAmount=n.totalAmount-n.unRefundAmount;
							trStr += '<tr><input class="processInstanceId" type="hidden" value="'+n.processInstanceId+'"/><input class="appId" type="hidden" value="'+n.appId+'"/>'+
								'<td><a class="yt-link to-detail">'+ n.appNum +'</a></td>'+
								'<td style="text-align: left;">'+ n.appName +'</td>'+
								'<td style="text-align: right;">'+ (n.totalAmount == "" ? "" : $yt_baseElement.fmMoney(n.totalAmount)) +'</td>'+
								'<td style="text-align: right;">'+ (refundAmount == "" ? "" : $yt_baseElement.fmMoney(refundAmount)) +'</td>'+
								'<td style="text-align: right;">'+ (n.unRefundAmount == "" ? "" : $yt_baseElement.fmMoney(n.unRefundAmount)) +'</td>'+
								'<td>'+ n.applicantUserName +'</td>'+
								'<td>'+ n.applicantUserDeptName +'</td>'+
								'<td>'+ n.applicateTime +'</td>'+
							'</tr>';
						});
						htmlTbody.append(trStr);
						//日志炫富效果
						pmPlanQueryObj.initQtip();
						//调用跳转到查看页面方法
						//								beforeApproList.goApprovePage();

						//								$(".tab-content .form-num").click(function() {
						//									window.location.href = $yt_option.websit_path + 'view/system-sasac/expensesReim/module/approval/paymentApprovalDetails.html';
						//								});
					} else {
						$('.table-page').hide();
						//拼接暂无数据效果
						htmlTbody.append(pmPlanQueryObj.noDataTrStr(8));
					}
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	/**
	 * 拼接暂无数据内容
	 * @param {Object} trNum  行数
	 */
	noDataTrStr: function(trNum) {
		//暂无数据内容
		var noDataStr = '<tr style="border:0px;background-color:#fff !important;"><td  colspan="' + trNum + '" align="center"style="border:0px;"><div class="no-data" style="width: 280px;margin: 0 auto;">' +
			'<img src="../../../../../resources-sasac/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
			'</div></td></tr>';
		return noDataStr;
	},
//	点击重置摁钮
	clearBtn :function(){
		$('.yt-reset-btn').on('click',function(){
			pmPlanQueryObj.clearAlert($(".loadApp"));
			//调用刷新列表方法
			pmPlanQueryObj.getBeforehandList();
		})
	},
	/**
	 * 清空表单内数据
	 * @param {Object} obj
	 */
	clearAlert: function(obj) {
				//取得所有select
				var selects = obj.find('select:not(.user-name-sel)');
				//循环重置
				$.each(selects, function(i, n) {
					$(n).find('option:eq(0)').attr('selected', true);
				});
				selects.niceSelect();
				//调用获取申请人信息方法
				pmPlanQueryObj.getUserList();
				//取得状态多选框
				var check1 = obj.find('.checkbox-state');
				//循环重置
				$.each(check1, function(i, n) {
					$(n).setCheckBoxState("uncheck");  
				});
				
				//取得资金额度多选框
				var check2 = obj.find('.checkbox-quota');
				//循环重置
				$.each(check2, function(i, n) {
					$(n).setCheckBoxState("uncheck");  
				});
				
				//取得借款期限多选框
				var check3 = obj.find('.checkbox-term');
				//循环重置
				$.each(check3, function(i, n) {
					$(n).setCheckBoxState("uncheck");  
				});
		//输入框
		var inputs = obj.find('input:not(input[type="checkbox"])');
		inputs.val('');
	},
	/**
	 * 1.2.3.4	获取所有部门		department
	 */
	getDeptList: function(code) {
		$.ajax({
			type: "post",
			url: "user/userInfo/getAllDeptsInfo",
			async: true,
			success: function(data) {
				//获取部门List
				var list = data.data || [];
				//初始化HTML文本
				var opts = '<option value="">请选择</option>';
				//循环添加文本
				$.each(list, function(i, n) {
					if(n.type==2){
						if(code && code == n.id) {
							opts += '<option selected="selected" value="' + n.id + '">' + n.text + '</option>';
						} else {
							opts += '<option value="' + n.id + '">' + n.text + '</option>';
						}
					}
				});
				//替换页面代码
				$('.department').html(opts).niceSelect();
			}
		});
	},
	//提示信息方法
	initQtip:function(){
		//注意：以下配置参数如无特别说明均为默认，使用时只需配置相关参数即可  
        $('.log-mod').qtip({  
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
                    //var txt = $(this).text();  
                    //return txt || '';  
                    var txt = '';
					var WorkFlowLogList = [];
					var thisTr = $(this).parents("tr");
					/*获取id*/
					var processInstanceId = thisTr.find('.processInstanceId').val();
					
					$.ajax({
						type: "post",
						url: "basicconfig/workFlow/getWorkFlowLog",
						async: false,
						data: {
							processInstanceId: processInstanceId
						},
						success: function(data) {
							if(data.data != undefined && data.data != null) {
								WorkFlowLogList = data.data;
							}
							if(WorkFlowLogList == null || WorkFlowLogList == undefined) {
								return;
							}
							shomd = "";
							shomd = '<div class="suspension" >';
							var WorkFlowLog;
							for(var i = 0; i < WorkFlowLogList.length; i++) {
								WorkFlowLog = WorkFlowLogList[i];
								/*数据的第一条分为审批中和其他的两种显示日志*/
								if(i == 0) {
									shomd += '<div class="log-msg-model">'
									      +'<div><div class="first-log-msg"><span class="log-num">'+(WorkFlowLogList.length-i)+'</span></div><span class="user-name">'+(WorkFlowLog.userName == "" ? '无' : WorkFlowLog.userName) +'</span><div style="clear:both;"></div></div>'
									      +'<div class="log-line-div" style="'+(i == (WorkFlowLogList.length-1) ? "padding-bottom: 0px;":"padding-bottom: 10px;")+''+(WorkFlowLogList.length == 1?"border:0px;":"")+'"><div style="'+(WorkFlowLogList.length == 1?"border:0px;":"border-bottom: 1px solid #D6E6F3;")+'">'
									      +'<div class="oper-status-model"><label class="log-label-text">操作状态</label><span>：</span><span>'+(WorkFlowLog.taskName == "" ? "无" : WorkFlowLog.taskName)+'</span></div>'
									      +'<div class="oper-time-model"><label class="log-label-text">操作时间</label><span>：</span><span>'+(WorkFlowLog.commentTime == "" ? "无" : WorkFlowLog.commentTime)+'</span></div>';
									      /**
									       *判断操作意见是否为空,为空不显示
									       */
									      if(WorkFlowLog.comment != "" && WorkFlowLog.comment != null && WorkFlowLog.comment != " "){
									      	shomd +='<div class="log-comment-model"><label class="log-label-text">操作意见</label><span>：</span><div class="oper-comment-msg">'+WorkFlowLog.comment+'</div></div>';
									      }
									     shomd +='</div></div>';

								} else {
									/*其他人的意见循环,一种格式*/
									shomd += '<div class="log-msg-model">'
									      +'<div><div class="log-msg-def-bak"><span class="log-num">'+(WorkFlowLogList.length-i)+'</span></div><span class="user-name" style="top:0px;">'+(WorkFlowLog.userName == "" ? '无' : WorkFlowLog.userName) +'</span><div style="clear:both;"></div></div>'
									      +'<div class="log-line-div" style="'+(i == (WorkFlowLogList.length-1) ? "padding-bottom: 0px;":"padding-bottom: 10px;")+''+( i == (WorkFlowLogList.length-1) ? "border:0px;":"")+'"><div style="'+( i == (WorkFlowLogList.length-1) ? "border:0px;":"border-bottom: 1px solid #D6E6F3;")+'">'
									      +'<div class="oper-status-model"><label class="log-label-text">操作状态</label><span>：</span><span>'+(WorkFlowLog.taskName == "" ? "无" : WorkFlowLog.taskName)+'</span></div>'
									      +'<div class="oper-time-model"><label class="log-label-text">操作时间</label><span>：</span><span>'+(WorkFlowLog.commentTime == "" ? "无" : WorkFlowLog.commentTime)+'</span></div>';
									      /**
									       *判断操作意见是否为空,为空不显示
									       */
									      if(WorkFlowLog.comment != "" && WorkFlowLog.comment != null && WorkFlowLog.comment != " "){
									      	shomd +='<div class="log-comment-model"><label class="log-label-text">操作意见</label><span>：</span><div class="oper-comment-msg">'+WorkFlowLog.comment+'</div></div>';
									      }
									      shomd+='</div></div>';
								}
								shomd += '</div>';
							}
						}
					});
					return(WorkFlowLogList.length < 1 ? '<span style="color:#999">暂无数据</span>' : shomd); /*设置显示内容*/
                }
            },  
            // 位置相关的设置    
            position: {  
                my: 'right top',
				at: 'left top',
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
}
$(function(){
	//初始化方法
	pmPlanQueryObj.init();
	//初始化操作事件方法
	pmPlanQueryObj.eventFun();
	//排序箭头变化调用
	//pmPlanQueryObj.switchtimeclick();
	pmPlanQueryObj.moneyFormat();
	pmPlanQueryObj.queryBeforehand();
	pmPlanQueryObj.getBeforehandList();
	pmPlanQueryObj.clearBtn();
});
