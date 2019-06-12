var masterData = {
	seldatas: '',
	init: function() {
		//初始化下拉框
		$('select').niceSelect();
		//左菜单点击
		masterData.leftLiClick();
		//点击出现弹出框方法
		$('.single-btn').click(function() {
			masterData.clickSingleButton();
		});
		//左侧菜单ul添加
		masterData.ulPage();
		//点击状态方法
		$('.disable-btn').off().on("click", function() {
			//获取选中的主数据
			var liCheck = $(".master-data-ul .master-check").data("ulData");
			var tableKey = liCheck.tableKey;
			var funAllUrl = liCheck.funAllUrl;
			var dictCode = liCheck.dictCode;
			masterData.setClassifyMenuToDisable(dictCode, liCheck.state);
		});
		//点击修改方法
		$('.a-update').off().on("click", function() {
			//隐藏span
			$(".master-data-name").hide();
			//隐藏修改按钮
			$(".a-update").hide();
			//显示输入框
			$(".master-data-name-input").show();
			//显示保存按钮
			$(".a-save").show();
			//显示取消按钮
			$(".a-clear").show();
			//给输入框赋值
			$(".master-data-name-input").val($(".master-data-name").text());
			//点击保存方法
			$('.a-save').off().on("click", function() {
				masterData.updateClassifyMenuName();
			});
			//点击取消方法
			$('.a-clear').off().on("click", function() {
				//显示span
				$(".master-data-name").show();
				//显示修改按钮
				$(".a-update").show();
				//隐藏输入框
				$(".master-data-name-input").hide();
				//隐藏保存按钮
				$(".a-save").hide();
				//隐藏取消按钮
				$(".a-clear").hide();
				//输入框值初始化
				$(".master-data-name-input").val('');
			});
		});

		//点击下载模板方法
		$("button.upload-btn").click(function() {
			window.location.href = $yt_option.base_path + 'budget/dictExcel/downloadExcelFile';
		});
	},
	leftLiClick: function() {
		//左菜单li点击事件
		$(".master-data-ul li").click(function() {
			//初始化背景色  字体颜色
			$(".master-data-ul li").removeClass('master-check');
			$(".master-data-ul li").addClass('master-noCheck');
			//变更背景色  字体颜色
			$(this).removeClass('master-noCheck');
			$(this).addClass('master-check');

			//获取选择的li的数据
			masterData.getUlCheck();
		});
	},
	/**
	 * 4.17.3[预算数据维护]：更新菜单(主数据)名称
	 * @param {Object} property
	 */
	updateClassifyMenuName: function() {
		//当前选择li的data
		var liCheck = $(".master-data-ul .master-check").data("ulData");
		//获取输入框的值
		var disvalue = $(".master-data-name-input").val();
		//点击删除方法
		$.ajax({
			type: "post",
			url: 'budget/dict/updateClassifyMenuName',
			async: false,
			data: {
				dictCode: liCheck.dictCode,
				disvalue: disvalue
			},
			success: function(data) {
				//提示信息
				$yt_alert_Model.prompt(data.message);
				//显示span
				$(".master-data-name").show();
				//显示修改按钮
				$(".a-update").show();
				//隐藏输入框
				$(".master-data-name-input").hide();
				//隐藏保存按钮
				$(".a-save").hide();
				//隐藏取消按钮
				$(".a-clear").hide();
				//输入框值初始化
				$(".master-data-name-input").val('');
				//重新获取数值
				masterData.ulPage();
			}
		});
	},
	/**
	 * 4.17.1[预算数据维护]：获取预算主数据左侧菜单
	 * @param {Object} property
	 */
	ulPage: function() {
		$.ajax({
			type: "post",
			url: "budget/dict/getClassifyMenuList",
			async: false,
			data: {},
			success: function(data) {
				var datas = data.data;
				//获取需要添加数据的ul
				var htmlUl = $('.master-data-ul');
				//清空
				htmlUl.empty();
				var dStr = "";
				if(data.flag == 0) {
					var datas = data.data;
					//循环遍历拼接数据
					$.each(datas, function(i, n) {
						dStr += '<li>' + n.disvalue + '</li>';
						//存储数据对象
						dStr = $(dStr).data("ulData", n);
						htmlUl.append(dStr);
					});
					//第一个默认选中
					$('.master-data-ul li').first().addClass('master-check');
					//左菜单点击
					masterData.leftLiClick();
					//获取选择的li的数据
					masterData.getUlCheck();
				}
			}
		});
	},
	//获取选择的li的数据
	getUlCheck: function() {
		var liCheck = $(".master-data-ul .master-check").data("ulData");
		var tableKey = liCheck.tableKey;
		var funAllUrl = liCheck.funAllUrl;
		var dictCode = liCheck.dictCode;
		//状态赋值
		$(".master-data-state").text(liCheck.state == 1 ? '启用' : '停用');
		//主数据名称赋值
		$(".master-data-name").text(liCheck.disvalue);
		//判断是否可变更状态
		if(liCheck.isChangeState == 1) {
			$(".disable-btn").show();
			//判断按钮文字
			if($(".master-data-state").text() == '启用') {
				$(".disable-btn img").attr('src', '../../../../../resources-sasac/images/common/block-up.png'); //停用图片
				$(".disable-btn img").attr('title', '停用'); //停用图片
			} else {
				$(".disable-btn img").attr('src', '../../../../../resources-sasac/images/common/using-icon.png'); //启用图片
				$(".disable-btn img").attr('title', '启用'); //启用图片
			}
		} else {
			$(".disable-btn").hide();
		}
		//获取指定预算主数据的所有数据
		masterData.getAllBudgetClassifyDataByParams(tableKey, funAllUrl);
		//获取(字典)上一级编码信息
		masterData.getBudgetYear(dictCode);
	},
	/**
	 * 4.17.8[预算数据维护]：菜单(主数据)-启用     4.17.9[预算数据维护]：菜单(主数据)-停用
	 * @param {Object} property
	 */
	setClassifyMenuToDisable: function(dictCode, state) {
		var dataUrl = '';
		if(state == 1) { //如等于1 为启用状态，可停用
			dataUrl = 'budget/dict/setClassifyMenuToDisable';
		} else { //如等于2 为停用状态，可启用
			dataUrl = 'budget/dict/setClassifyMenuToEnable';
		}
		$.ajax({
			type: "post",
			url: dataUrl,
			async: true,
			data: {
				dictCode: dictCode
			},
			success: function(data) {
				//提示信息
				$yt_alert_Model.prompt(data.message);
				//重新获取数值
				masterData.ulPage();
			}
		});
	},
	//4.17.7[预算数据维护]：获取(字典)上一级编码信息
	getBudgetYear: function(dictCode, subId) {
		subId = (subId == undefined ? "" : subId);
		$.ajax({
			type: "post",
			url: "budget/dict/getParentDataInfo",
			async: false,
			data: {
				dictCode: dictCode,
				subId: subId,
				queryParams: ''
			},
			success: function(data) {
				var datas = data.data;
				masterData.seldatas = data.data;
				if(data.flag == 0) {
					masterData.setBudgetYearSelect();
				}
			}
		});
	},
	setBudgetYearSelect: function(code) {
		var html = '';
		$.each(masterData.seldatas, function(i, n) {
			html += '<option ' + (code == n.subCode ? 'selected' : '') + ' value="' + n.subCode + '">' + (n.subNum == "" ? "" : '(' + n.subNum + ')') + '' + n.subName + '</option>';
		});
		//1.遍历数据,给select赋值 
		$("#parentSubCode").html(html).niceSelect({
			search: true,
			backFunction: function(text) {
				var opt = "";
				//回调方法,可以执行模糊查询,也可自行添加操作  
				$("#parentSubCode option").remove();
				if(text == "") {
					$("#parentSubCode").append('<option value="">请选择</option>');
				}
				var selNum = 0;
				//遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
				$.each(masterData.seldatas, function(i, n) {
					//名称模糊查询
					if(n.subName.indexOf(text) != -1) {
						selNum += 1;
						$("#parentSubCode").append('<option value="' + n.subCode + '">' + (n.subNum == "" ? "" : '(' + n.subNum + ')') + '' + n.subName + '</option>');
					} else if(n.subNum.indexOf(text) != -1) { //code模糊查询
						selNum += 1;
						$("#parentSubCode").append('<option value="' + n.subCode + '">' + (n.subNum == "" ? "" : '(' + n.subNum + ')') + '' + n.subName + '</option>');
					}
				});
				//如果没有查询到拼接暂无数据提示
				if(selNum == 0) {
					$("#parentSubCode").html('<option value="" disabled="disabled">无匹配数据</option>');
				}
			}
		});
	},
	/**
	 * 4.17.2[预算数据维护]：获取指定预算主数据的所有数据
	 * @param {Object} property
	 */
	getAllBudgetClassifyDataByParams: function(tableKey, funAllUrl) {
		$('.page1').pageInfo({
			pageIndex: 1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: funAllUrl, //ajax访问路径   
			type: 'post',
			data: {
				queryParams: ''
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			success: function(data) {
				var htmlTbody = $('.wait-table tbody');
				htmlTbody.empty();
				var dStr = "";
				if(data.flag == 0) {
					var datas = data.data.rows;
					if(datas.length > 0) {
						$('.page1').show();
						$.each(datas, function(i, n) {
							dStr += '<tr parentSubCode="' + n.parentSubCode + '" parentSubName="' + n.parentSubName + '">' +
								'<td class="text-overflow" style="text-align: left;" title="' + n.subNum + '">' + n.subNum + '</td>' +
								'<td class="text-overflow" style="text-align: left;" title="' + n.subName + '">' + n.subName + '</td>' +
								'<td>' + (n.source == 1 ? '标准' : '单位自定义') + '</td>' +
								'<td class="text-overflow" style="text-align: left;" title="' + n.describe + '">' + (n.describe || '无') + '</td>' +
								'<td style="text-align: left;">' + (n.parentSubNum == "" ? "" : '(' + n.parentSubNum + ')') + (n.parentSubName || '--') + '</td>' +
								'<td class="' + (n.state == 1 ? 'state-color-green' : 'state-color-red') + '">' + (n.state == 1 ? '启用' : '停用') + '</td>' +
								'<td>' +
								'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>'; //修改
							if(n.state == 1) {
								dStr += '<span class="operate-dis mar-left" title="停用"><img src="../../../../../resources-sasac/images/common/block-up.png" /></span>'; //停用
							} else {
								dStr += '<span class="operate-ena mar-left" title="启用"><img src="../../../../../resources-sasac/images/common/using-icon.png" /></span>'; //启用
							}
							dStr += '<span class="operate-del mar-left"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' + //删除
								'</td>' +
								'</tr>';
							//存储数据data
							dStr = $(dStr).data("waitData", n);
							htmlTbody.append(dStr);
						});
					} else {
						$('.page1').hide();
						//拼接暂无数据效果
						htmlTbody.append(sysCommon.noDataTrStr(7));
					}
					//调用删除方法
					masterData.deleteClassifyData();
					//调用修改方法
					masterData.updateClassifyDataInfo();
					//调用启用方法
					masterData.setClassifyDataToEnable();
					//调用停用方法
					masterData.setClassifyDataToDisable();
				} else {
					$('.page1').hide();
					//拼接暂无数据效果
					htmlTbody.append(sysCommon.noDataTrStr(7));
				}
			},
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	/**
	 * 4.17.12[预算数据维护]：列表(字典)数据-删除
	 * @param {Object} property
	 */
	deleteClassifyData: function() {
		//当前选择li的data
		var liCheck = $(".master-data-ul .master-check").data("ulData");
		//点击删除方法
		$('.operate-del').click(function() {
			//当前删除的行的data
			var waitData = $(this).parents('tr').data('waitData');
			$yt_alert_Model.alertOne({
				alertMsg: "数据删除将无法恢复,确认删除吗?", //提示信息  
				confirmFunction: function() { //点击确定按钮执行方法  
					$.ajax({
						type: "post",
						url: 'budget/dict/deleteClassifyData',
						async: true,
						data: {
							dictCode: liCheck.dictCode,
							subCode: waitData.subCode
						},
						success: function(data) {
							//提示信息
							$yt_alert_Model.prompt(data.message);
							//重新获取数值
							//masterData.ulPage();
							//获取选择的li的数据
							masterData.getUlCheck();
						}
					});
				},

			});
		});
	},
	/**
	 * 4.17.10[预算数据维护]：列表(字典)数据-启用
	 * @param {Object} property
	 */
	setClassifyDataToEnable: function() {
		//当前选择li的data
		var liCheck = $(".master-data-ul .master-check").data("ulData");
		//点击启用方法
		$('.operate-ena').click(function() {
			//当前删除的行的data
			var waitData = $(this).parents('tr').data('waitData');
			$.ajax({
				type: "post",
				url: 'budget/dict/setClassifyDataToEnable',
				async: true,
				data: {
					dictCode: liCheck.dictCode,
					subCode: waitData.subCode
				},
				success: function(data) {
					//提示信息
					$yt_alert_Model.prompt(data.message);
					//重新获取数值
					//masterData.ulPage();
					//获取选择的li的数据
					masterData.getUlCheck();
				}
			});
		});
	},
	/**
	 * 4.17.11[预算数据维护]：列表(字典)数据-停用
	 * @param {Object} property
	 */
	setClassifyDataToDisable: function() {
		//当前选择li的data
		var liCheck = $(".master-data-ul .master-check").data("ulData");
		//点击停用方法
		$('.operate-dis').click(function() {
			//当前停用的行的data
			var waitData = $(this).parents('tr').data('waitData');
			$.ajax({
				type: "post",
				url: 'budget/dict/setClassifyDataToDisable',
				async: true,
				data: {
					dictCode: liCheck.dictCode,
					subCode: waitData.subCode
				},
				success: function(data) {
					//提示信息
					$yt_alert_Model.prompt(data.message);
					//重新获取数值
					//masterData.ulPage();
					//获取选择的li的数据
					masterData.getUlCheck();
				}
			});
		});
	},
	/**
	 * 4.17.6[预算数据维护]：更新(字典)数据信息 
	 * @param {Object} property
	 */
	updateClassifyDataInfo: function(code) {
		if(code) {
			//修改按钮事件
			$(".table-box").off().on("click", ".operate-update", function() {
				var ithis = $(this);
				var tr = ithis.parents('tr');
				var table = ithis.parents('table');
				//当前点击的li
				var liCheck = $(".master-data-ul .master-check").data("ulData");
				var dictCode = liCheck.dictCode;
				//调用公用的显示弹出框方法
				sysCommon.showModel($("#classifyDataInfoAlert"));
				/** 
				 * 点击取消方法 
				 */
				$('#classifyDataInfoAlert .yt-model-canel-btn').off().on("click", function() {
					//初始化数据
					masterData.clearAlert($("#classifyDataInfoAlert"));
					//获取(字典)上一级编码信息
					//masterData.getBudgetYear(dictCode);
					//清空单位验证信息
					sysCommon.clearValidInfo($(".subCode"));
					sysCommon.clearValidInfo($(".subName"));
					//调用公用的关闭弹出框方法
					sysCommon.closeModel($("#classifyDataInfoAlert"));
				});
				//获取数据
				//弹出框标题赋值
				$('.master-name-alert').text(liCheck.disvalue);
				$('.add-or-update').text('零星编辑');
				//编码
				$('.subCode').val(tr.attr('subNum'));
				//科目标识
				$('.subCode').attr("sub-code", tr.attr('subCode'));
				//名称
				$('.subName').val(tr.attr('subName'));
				//上一级编码名称
				//$('select#parentSubCode').val(tr.attr('parentSubCode'));
				//获取(字典)上一级编码信息
				masterData.setBudgetYearSelect(tr.attr('parentSubCode'));
				//说明
				$('.describe').val(tr.attr('describe'));
				//定义依据
				var source = tr.attr('source');
				source = (source == "" ? "" : source);
				$('.source-div .check-label input[value="' + source + '"]').setRadioState('check');

				//点击确定
				$('#classifyDataInfoAlert .yt-model-sure-btn').off().on('click', function() {
					//获取上一级编码
					var parentSubCode = $(".parentSubCode option:selected").val();
					var parentSubName = $(".parentSubCode option:selected").text();
					parentSubName = (parentSubName == '请选择' ? '' : parentSubName);
					//编码
					var subCode = $('.subCode').attr("sub-code");
					//编码
					var subNum = $('.subCode').val();
					//名称
					var subName = $(".subName").val();
					//定义依据
					var source = $(".source-div .yt-radio.check input").val();
					//说明
					var describe = $(".describe").val();
					//拼接字符串
					var html = '<tr class="is-update" subCode="' + subCode + '" subNum="' + subNum + '" subName="' + subName + '" source="' + source + '" parentSubCode="' + parentSubCode + '" describe="' + describe + '">' +
						'<td class="font-l" title="' + subNum + '"><span class="sub-code" sub-code=' + subCode + '>' + subNum + '</span></td>' +
						'<td class="font-l"  title="' + subName + '"><span class="sub-name">' + subName + '</span></td>' +
						'<td><span source="' + source + '" class="td-source">' + (source == "1" ? "标准" : "单位自定义") + '</span></td>' +
						'<td class="font-l" title="' + parentSubName + '"><span parent-code="' + parentSubCode + '" class="parent-name">' + parentSubName + '</span></td>' +
						'<td class="font-l"  title="' + describe + '"><span class="describe">' + (describe == "" ? "无" : describe) + '</span></td>' +
						'<td>' +
						'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
						'<span class="operate-del mar-left"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
						'</td>' +
						'</tr>';
					//替换原本行
					tr.replaceWith(html);
					//调用公用的关闭弹出框方法
					sysCommon.closeModel($("#classifyDataInfoAlert"));
					//弹出框初始化
					masterData.clearAlert($("#classifyDataInfoAlert"));
					//清空验证信息
					sysCommon.clearValidInfo($(".subCode"));
					sysCommon.clearValidInfo($(".subName"));
				});
			});
		} else {
			//点击修改方法
			$(".wait-table").off().on("click", ".operate-update", function() {
				var ithis = $(this);
				var tr = ithis.parents('tr');
				//当前点击的li
				var liCheck = $(".master-data-ul .master-check").data("ulData");
				var dictCode = liCheck.dictCode;
				//调用公用的显示弹出框方法
				sysCommon.showModel($("#classifyDataInfoAlert"));
				//当前修改的行的data
				var waitData = $(this).parents('tr').data('waitData');
				//获取(字典)上一级编码信息
				masterData.setBudgetYearSelect(tr.attr('parentSubCode'));
				/** 
				 * 点击取消方法 
				 */
				$('#classifyDataInfoAlert .yt-model-canel-btn').off().on("click", function() {
					//初始化数据
					masterData.clearAlert($("#classifyDataInfoAlert"));
					//获取(字典)上一级编码信息
					//masterData.getBudgetYear(dictCode);
					//清空单位验证信息
					sysCommon.clearValidInfo($(".subCode"));
					sysCommon.clearValidInfo($(".subName"));
					//调用公用的关闭弹出框方法
					sysCommon.closeModel($("#classifyDataInfoAlert"));
				});
				//弹出框标题赋值
				$('.master-name-alert').text(liCheck.disvalue);
				$('.add-or-update').text('零星编辑');
				//获取上一级编码
				var parent = $(".parentSubCode option:selected").text();
				parent = (parent == '请选择' ? '' : parent);
				//科目标识
				$('.subCode').attr("sub-code", waitData.subCode);
				//编码
				$('.subCode').val(waitData.subNum);
				//名称
				$(".subName").val(waitData.subName);
				//定义依据
				$('.source-div input.sourceRadio[value="' + waitData.source + '"]').setRadioState('check');
				//说明
				$(".describe").val(waitData.describe);
				//上一级编码
				/*$('.parentSubCode option[value="' + waitData.parentSubCode + '"]').attr("selected", "selected");
				$("select.parentSubCode").niceSelect({
					search: true,
					backFunction: function(text) {
						var opt = "";
						//回调方法,可以执行模糊查询,也可自行添加操作  
						$("select#parentSubCode option").remove();
						if(text == "") {
							$("select#parentSubCode").append('<option value="">请选择</option>');
						}
						//遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
						$.each(masterData.seldatas, function(i, n) {
							//名称模糊查询
							if(n.subName.indexOf(text) != -1) {
								$("select#parentSubCode").append('<option value="' + n.subCode + '">' + (n.subNum == "" ? "" : '(' + n.subNum + ')') + '' + n.subName + '</option>');
							} else {
								$("select#parentSubCode").html('<option value="" disabled="disabled">无匹配数据</option>');
							}
							//code模糊查询
							if(n.subNum.indexOf(text) != -1) {
								$("select#parentSubCode").append('<option value="' + n.subCode + '">' + (n.subNum == "" ? "" : '(' + n.subNum + ')') + '' + n.subName + '</option>');
							} else {
								$("select#parentSubCode").html('<option value="" disabled="disabled">无匹配数据</option>');
							}
						});
					},
					optionCallBcak: function(opt) {
						console.log(opt);
					}
				});*/
				//点击确定
				$('#classifyDataInfoAlert .yt-model-sure-btn').off().on('click', function() {
					var valid = $yt_valid.validForm($("#classifyDataInfoAlert"));
					if(valid) {
						//获取上一级编码
						var parent = $(".parentSubCode option:selected").val();
						parent = (parent == '请选择' ? '' : parent);
						//标识
						var subCode = $('.subCode').attr("sub-code");
						//编码
						var subNum = $('.subCode').val();
						//名称
						var subName = $(".subName").val();
						//定义依据
						var source = $(".source-div .yt-radio.check input").val();
						//说明
						var describe = $(".describe").val();
						//上一级编码
						var parentSubCode = parent;
						$.ajax({
							type: "post",
							url: "budget/dict/updateClassifyDataInfo",
							async: true,
							data: {
								dictCode: liCheck.dictCode,
								subCode: subCode,
								subNum: subNum,
								subId: waitData.subId,
								subName: subName,
								source: source,
								state: waitData.state,
								parentSubCode: parentSubCode,
								describe: describe
							},
							success: function(data) {
								var datas = data.data;
								if(data.flag == 0) {
									//调用遍历方法
									masterData.getUlCheck();
								}
								//提示信息
								$yt_alert_Model.prompt(data.message);
								//调用公用的关闭弹出框方法
								sysCommon.closeModel($("#classifyDataInfoAlert"));
								//弹出框初始化
								masterData.clearAlert($("#classifyDataInfoAlert"));
								//清空验证信息
								sysCommon.clearValidInfo($(".subCode"));
								sysCommon.clearValidInfo($(".subName"));
							}
						});
					}
				});
			});
		}
	},
	//零星添加按钮
	clickSingleButton: function() {
		//当前点击的li
		var liCheck = $(".master-data-ul .master-check").data("ulData");
		var dictCode = liCheck.dictCode;
		//调用公用的显示弹出框方法
		sysCommon.showModel($("#classifyDataInfoAlert"));
		//获取(字典)上一级编码信息
		masterData.getBudgetYear(dictCode);
		/** 
		 * 点击取消方法 
		 */
		$('#classifyDataInfoAlert .yt-model-canel-btn').off().on("click", function() {
			//初始化数据
			masterData.clearAlert($("#classifyDataInfoAlert"));
			//清空单位验证信息
			//清空单位验证信息
			sysCommon.clearValidInfo($(".subCode"));
			sysCommon.clearValidInfo($(".subName"));
			//调用公用的关闭弹出框方法
			sysCommon.closeModel($("#classifyDataInfoAlert"));
		});
		//弹出框标题赋值
		$('.master-name-alert').text(liCheck.disvalue);
		$('.add-or-update').text('零星添加');
		//点击确定
		$('#classifyDataInfoAlert .yt-model-sure-btn').off().on('click', function() {
			var valid = $yt_valid.validForm($("#classifyDataInfoAlert"));
			if(valid) {
				//获取上一级编码
				var parent = $(".parentSubCode option:selected").val();
				parent = (parent == '请选择' ? '' : parent);
				//编码
				var subCode = $('.subCode').val();
				//名称
				var subName = $(".subName").val();
				//定义依据
				var source = $(".source-div .yt-radio.check input").val();
				//说明
				var describe = $(".describe").val();
				//上一级编码
				var parentSubCode = parent;
				$.ajax({
					type: "post",
					url: "budget/dict/addClassifyDataInfo",
					async: true,
					data: {
						dictCode: liCheck.dictCode,
						subNum: subCode,
						subName: subName,
						source: source,
						parentSubCode: parentSubCode,
						describe: describe
					},
					success: function(data) {
						var datas = data.data;
						if(data.flag == 0) {
							//调用遍历方法
							masterData.getUlCheck();
						}
						$yt_alert_Model.prompt(data.message);
						//弹出框初始化
						masterData.clearAlert($("#classifyDataInfoAlert"));
						//清空验证信息
						//清空单位验证信息
						sysCommon.clearValidInfo($(".subCode"));
						sysCommon.clearValidInfo($(".subName"));
					}
				});
			}
		});
	},
	/**
	 * 清空表单内数据
	 * @param {Object} obj
	 */
	clearAlert: function(obj) {
		//输入框
		var inputs = obj.find('input:not(input[type="radio"],input[type="checkbox"])');
		inputs.val('');
		//单选
		var radios = obj.find('input[type="radio"]:eq(0)').setRadioState("check");
		//文本域
		var textareas = obj.find('textarea');
		textareas.val('');
	},
}
/**
 * 
 * 
 * 导入附件业务逻辑代码
 * 
 * 
 */
var dataBox = {
	invalidNumFlag: 0, //无效数据统计
	init: function() {
		//初始化按钮方法
		dataBox.events();
	},
	events: function() {
		//批量导入按钮触发窗
		$("button.batch-btn").on("click", function() {
			sysCommon.showModel($("#fileDiv"));
		});
		//获取文件名称
		$("body").undelegate("#reimFile").delegate("#reimFile", "change", function(obj) {
			var arr = $("#reimFile").val().split('\\');
			//附件名称
			var filesName = arr[arr.length - 1];
			//附件类型
			var filesType = filesName.split('.');
			if(filesType[1] != "xls" && filesType[1] != "xlsx") {
				$(".file-msg").text("请选择Excel文件").css("color", "#999");
				$yt_alert_Model.prompt("请选择Excel文档");
				return false;
			} else {
				//获取附件名称
				$(".file-msg").text(filesName).css("color", "#333333");
				//导入提示信息
				$yt_alert_Model.prompt("正在导入...");
				//调用上传附件接口
				dataBox.importFiles($("#reimFile"));
				//关闭弹窗
				sysCommon.closeModel($("#fileDiv"));
				//打开dataUpBox弹窗
				$("#dataUpBox").css("display", "block");
			}
		});
		//取消按钮
		$(".canel-btn").on("click", function() {
			sysCommon.closeModel($("#fileDiv"));
			$(".file-msg").text("请选择Excel文件").css("color", "#999");
		});
		//关闭弹出框
		$(".close-btn").on("click", function() {
			sysCommon.closeModel($("#dataUpBox"));
			//删除暂无数据
			$(".table-box .listNoData").remove();
			//折叠无效
			$(".invalid-data .data-nav").removeClass("native").siblings().css("display", "none");
			//展开待更新
			$(".un-update .data-nav").addClass("native").siblings().css("display", "block");
			$('.table-box').find("tbody").html("");
		});
		//删除按钮事件
		$(".table-box").on("click", ".operate-del", function() {
			var thisBtn = $(this);
			var thisTr = thisBtn.parents("tr");
			$yt_alert_Model.alertOne({
				alertMsg: "数据删除将无法恢复,确认删除吗?", //提示信息  
				confirmFunction: function() { //点击确定按钮执行方法  
					thisTr.remove();
				},
			});
		});
		//修改按钮事件
		var code = "1";
		masterData.updateClassifyDataInfo(code);
		//列表切换
		$(".un-update,.invalid-data").on("click", ".data-nav", function() {
			var thisDiv = $(this);
			if(thisDiv.hasClass("native")) {
				thisDiv.removeClass("native").siblings().css("display", "none");
			} else {
				thisDiv.addClass("native").siblings().css("display", "block");
			}
		});
		//点击保存按钮操作事件
		$("#saveImportBtn").click(function() {
			var thisBtn = $(this);
			//解除按钮禁用
			$(thisBtn).attr("disabled", true);
			//调用获取数据方法
			var saveData = dataBox.getImportTableData();
			//判断是否存在无效数据
			if(dataBox.invalidNumFlag > 0) {
				//折叠待更新
				$(".un-update .data-nav").removeClass("native").siblings().css("display", "none");
				//展开无效数据
				$(".invalid-data .data-nav").addClass("native").siblings().css("display", "block");
				$yt_alert_Model.alertOne({
					alertMsg: "列表中存在无效的数据，请检查列表数据，确定要继续保存吗？", //提示信息  
					confirmFunction: function() { //点击确定按钮执行方法  
						//调用执行保存方法
						dataBox.doSaveData(thisBtn, saveData);
					},
					cancelFunction: function() { //点击确定按钮执行方法  
						//解除按钮禁用
						$(thisBtn).attr("disabled", false);
					}
				});
			} else {
				//调用执行保存方法
				dataBox.doSaveData(thisBtn, saveData);
			}
		});
	},
	/**
	 * 执行保存方法
	 * @param {Object} thisBtn 当前保存按钮
	 * @param {Object} saveData 数据集
	 */
	doSaveData: function(thisBtn, saveData) {
		//调用获取数据接口
		var saveData = dataBox.getImportTableData();
		//调用保存接口
		$.ajax({
			type: 'post',
			url: 'budget/dictExcel/improtSaveLotClassifyByExcel',
			async: false,
			data: saveData,
			success: function(data) {
				$yt_alert_Model.prompt(data.message);
				//解除按钮禁用
				$(thisBtn).attr("disabled", false);
				if(data.flag == 0) {
					$('.table-box').find("tbody").html("");
					//折叠无效
					$(".invalid-data .data-nav").removeClass("native").siblings().css("display", "none");
					//展开待更新
					$(".un-update .data-nav").addClass("native").siblings().css("display", "block");
					//删除暂无数据
					$(".table-box .listNoData").remove();
					//获取选择的li的数据属性数据列表
					masterData.getUlCheck();
					sysCommon.closeModel($("#dataUpBox"));
				} else {
					$yt_alert_Model.prompt(data.message);
				}
			},
			error: function(e) {
				//解除按钮禁用
				$(thisBtn).attr("disabled", false);
			}
		});
	},
	/**
	 * 
	 * 
	 * 导入文件
	 * 
	 * 
	 */
	importFiles: function(thisFile) {
		//获取选中的主数据
		var liCheck = $(".master-data-ul .master-check").data("ulData");
		//主数据code
		var dictCode = liCheck.dictCode;
		//接收当前的附件Id
		var thisFile = $(thisFile);
		//附件Id 
		var fileId = $("#reimFile").attr("id");
		//上传的接口路径
		var url = $yt_option.base_path + "budget/dictExcel/improtClassifyByExcel";
		var params = "?dictCode=" + dictCode;
		$.ajaxFileUpload({
			url: url + params,
			type: "post",
			dataType: 'JSON',
			fileElementId: fileId,
			success: function(data, textStatus) {
				if(data) {
					$yt_alert_Model.prompt(data.message);
					if(data.flag == 0) {
						//获取选择的li的数据属性数据列表
						masterData.getUlCheck();
						//初始化附件标签
						$(".file-msg").text("请选择Excel文件").css("color", "#999");
						$("#reimFile").val('');
						//关闭导入附件弹窗
						sysCommon.closeModel($("#fileDiv"));
						var datas = data.data;
						//赋值主数据名称
						$("#dataUpBox .data-name").text($(".master-data-name").text());
						//附件成功导入数据
						$(".data-num").text(datas.insertCount);
						//待更新数据个数
						$(".upd-num").text(datas.updateCount);
						//无效数据个数
						$(".invalid-num").text(datas.invalidCount);
						$('.table-box table').hide();
						$(".table-box").append('<div class="listNoData"></div>');
						//判断是否有成功导入的数据
						if(datas.updateCount > 0 || datas.invalidCount > 0) {
							//打开dataUpBox弹窗
							$("#dataUpBox").css("display", "block");
							//生成待更新数据
							dataBox.createTableData(datas.updateList, $(".un-update"));
							//生成无效数据
							dataBox.createTableData(datas.invalidList, $(".invalid-data"));
						}
					}
				}
			},
			error: function(data, status, e) //服务器响应失败处理函数  
			{
				console.log(data);
			}
		});
	},
	/**
	 * 
	 * 创建表格数据
	 * 
	 */
	createTableData: function(dataList, tableObj) {
		if(dataList.length > 0) {
			$(tableObj).find("tbody").html('');
			//显示表格,删除暂无数据
			$(tableObj).find("table").show();
			//删除暂无数据
			$(tableObj).find(".table-box .listNoData").remove();
			var trStr = "";
			$.each(dataList, function(i, v) {
				var parentName = "";
				//判断三种条件，所有条件都不为空的情况下，在进行拼接
				if(v.parentSubCode == 0 || v.parentSubCode == "") {
					parentName = "--";
				} else if(v.parentSubName == "" && v.parentSubCode != 0) {
					parentName = "--";
				} else if(v.parentSubName == "" && v.parentSubCode == 0) {
					parentName = "--";
				} else {
					parentName = "(" + v.parentSubNum + ")" + v.parentSubName;
				}
				trStr += '<tr subCode="' + v.subCode + '" subNum="' + v.subNum + '" subName="' + v.subName + '" source="' + v.source + '" parentSubCode="' + v.parentSubCode + '" describe="' + v.describe + '">' +
					'<td class="font-l" title="' + v.subNum + '"><span class="sub-code" sub-code=' + v.subCode + '>' + v.subNum + '</span></td>' +
					'<td class="font-l"  title="' + v.subName + '"><span class="sub-name">' + v.subName + '</span></td>' +
					'<td><span source="' + v.source + '" class="td-source">' + (v.source == "1" ? "标准" : v.source == "2" ? "单位自定义" : "") + '</span></td>' +
					'<td class="font-l" title="' + v.parentSubName + '"><span parent-code="' + v.parentSubCode + '" class="parent-name">' + parentName + '</span></td>' +
					'<td class="font-l"  title="' + v.describe + '"><span class="describe">' + (v.describe == "" ? "无" : v.describe) + '</span></td>' +
					'<td>' +
					'<span class="operate-update"><img src="../../../../../resources-sasac/images/common/edit-icon.png"></span>' +
					'<span class="operate-del mar-left"><img src="../../../../../resources-sasac/images/common/del-icon.png"></span>' +
					'</td>' +
					'</tr>';
			});
			$(tableObj).find("tbody").html(trStr);
		}
		/* else {
					//隐藏表格显示暂无数据
					$(tableObj).find("table").hide();
					$(tableObj).find(".table-box").remove(".listNoData");
					$(tableObj).find(".table-box").append('<div class="listNoData"></div>');
				}*/
	},
	/**
	 * 
	 * 
	 * 获取列表数据方法 
	 * 
	 */
	getImportTableData: function() {
		//创建待更新数据集合
		var updateList = [];
		//创建无效数据集合
		var invalidList = [];
		var updateListJson = "";
		var invalidListJson = "";
		//遍历待更新表格数据
		$(".un-update tbody tr").each(function() {
			updateList.push({
				subCode: $(this).find(".sub-code").attr("sub-code"), //标识
				subNum: $(this).find(".sub-code").text(), //编码
				subName: $(this).find(".sub-name").text(), //名称
				source: $(this).find(".td-source").attr("source"), //依据/来源
				parentSubCode: $(this).find(".parent-name").attr("parent-code"), //上一级编码
				parentSubName: $(this).find(".parent-name").text(), //上一级名称
				describe: $(this).find(".describe").text() //说明
			});
		});
		if(updateList.length > 0) {
			updateListJson = JSON.stringify(updateList);
		}
		var subCode = ""; //编码
		var subName = ""; //名称
		var source = ""; //依据
		var parentCode = ""; //上一级编码
		//遍历无效数据
		$(".invalid-data tbody tr").each(function() {
			subCode = $(this).find(".sub-code").text(); //编码
			subName = $(this).find(".sub-name").text(); //名称
			source = $(this).find(".td-source").text(); //依据
			parentCode = $(this).find(".parent-name").attr("parent-code"); //上一级编码
			//判断是否包含已经修改的类标识
			if(!$(this).hasClass("is-update")) {
				//给当前行设置红色边框
				$(this).css("border-color", "red");
				//累加无效数据个数
				dataBox.invalidNumFlag += 1;
			} else {
				invalidList.push({
					subCode: $(this).find(".sub-code").attr("sub-code"), //标识
					subNum: $(this).find(".sub-code").text(), //编码
					source: $(this).find(".td-source").attr("source"), //依据/来源
					parentSubCode: $(this).find(".parent-name").attr("parent-code"), //上一级编码
					parentSubName: $(this).find(".parent-name").text(), //上一级名称
					describe: $(this).find(".describe").text() //说明
				});
			}
		});
		if(invalidList.length > 0) {
			invalidListJson = JSON.stringify(invalidList);
		}
		//获取选中的主数据
		var liCheck = $(".master-data-ul .master-check").data("ulData");
		//主数据code
		var dictCode = liCheck.dictCode;
		return {
			dictCode: dictCode, //菜单code
			updateList: updateListJson, //待更新数据集合json字符串
			invalidList: invalidListJson //无效数据集合json字符串
		}
	}
}
$(function() {
	dataBox.init();
	masterData.init();
	$("#masterDiv,#dataUpBox").css("min-height", $(window).height() - 12);
})