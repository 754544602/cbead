var item = {
	dtree: null,
	treeAllData: null,
	init: function() {
		//列表数据
		item.tablePage();
		//表格下拉
		item.flodShow();
	},
	//表格下拉
	flodShow: function() {
		//选择器为想要设置折叠框的表格行  
		$('.fold-tr').createTableFlod({
			text: function(obj) { //设置折叠框显示的内容 默认为'',可设置回调函数,匿名函数接收当前点击的对象    yt-table-active
				$(obj).addClass('yt-table-active'); //点击表格变色  
				return item.getBudgetSpecialInfoById();
			},
			speed: 200 //折叠框的显示速度 默认:200  
		});
		$("body").delegate("textarea.level-three", "click", function() {
			item.clickAlert();
			//弹窗关闭按钮事件绑定
			$(".relevance-pop").on("click", ".canel-btn", function() {
				$(".rela-dept-search").val('');
				$('.role-right-ul').find('li').remove(); //清空弹窗数据
				sysCommon.closeModel($(".relevance-pop")); //关闭弹窗
			});
			//弹窗添加到已选按钮事件绑定（单个）
			$(".set-role-button").on("click", ".right", function() {
				//获取所有选中的复选框
				var checkNode = $("#dataItemTree").tree('getChecked');
				//右边的ul
				var ulBody = $(".role-right-ul");
				//定义一个对象
				var checkDict = {};
				//获取所有右边的li
				var liAttr = $(".role-right-ul").find('li');
				//非空判断
				if(liAttr != undefined) {
					//将自定义属性循环添加进字符串
					//用来储存所有的tablecode
					var checkKey = "";
					//用来储存对象里的tablecode字段
					var checkValue = ",";
					//用来储存所有的id
					var getLiVal = "";
					$.each(liAttr, function(i, d) {
						//获取id并进行非空验证
						getLiVal = $(d).attr('liid') == undefined || $(d).attr('liid') == null ? "" : $(d).attr('liid');
						//获取code并进行非空验证
						checkKey = $(d).attr('tableDictCode') == undefined || $(d).attr('tableDictCode') == null ? "" : $(d).attr('tableDictCode');
						//指定对象中的checkKey字段
						checkValue = checkDict[checkKey];
						//如果为空赋值初始值 ，
						if(checkValue == undefined || checkValue == null) {
							checkValue = ",";
						}
						//二次赋值为所有的id
						checkValue = checkValue + (getLiVal == "" ? "" : getLiVal + ",");
						//将所有的id存到对象中的checkKey字段
						checkDict[checkKey] = checkValue;
					});
				}
				//初始化变量
				checkValue = "";
				//声明li字符串
				var liStr = "";
				//循环获取所有选中的复选框
				$.each(checkNode, function(i, n) {
					if(n.sortId) {
						//赋值为对象中的tableDictCode内的所有值也就是之前赋值的此tablecode下的所有所属id
						checkValue = checkDict[n.tableDictCode] == undefined || checkDict[n.tableDictCode] == null ? "" : checkDict[n.tableDictCode];
						//通过获取的所有的所属id进行判断，负一为非相同，正常添加，反之不添加     此比对为一次获取一个tablecode  和之下的所有id，进行tablecode内的比对
						if(checkValue.indexOf("," + n.id + ",") < 0) {
							liStr += '<li tableDictCode="' + n.tableDictCode + '" liid=' + n.id + '>' + n.text + '</li>';
						}
						//清空右边的选中
						//$('#dataItemTree').tree('uncheck', oneright[i].target);
					}
				});
				ulBody.append(liStr);
			});
			//弹窗添加到已选按钮事件绑定（多个）
			$(".set-role-button").on("click", ".d-right", function() {
				//获取所有未选中节点
				var uncheckNode = $('#dataItemTree').tree('getChecked', 'unchecked');
				//获取所有选中节点
				var checkNodes = $('#dataItemTree').tree('getChecked');
				//设置树形复选全部勾选
				$.each(uncheckNode, function(i, n) {
					//去除选中状态
					$("#dataItemTree").tree("check", n.target);
				});
				//设置树形复选全部勾选
				$.each(checkNodes, function(i, n) {
					$("#" + n.domId).find("span.tree-title").css("color", "rgb(65, 141, 204)");
				});
				//展开所有节点
				$("#dataItemTree").tree('expandAll', uncheckNode.target);
				var checkNode = $('#dataItemTree').tree('getChecked');
				//右边的ul
				var ulBody = $(".role-right-ul");
				//定义一个对象
				var checkDict = {};
				//获取所有右边的li
				var liAttr = $(".role-right-ul").find('li');
				//非空判断
				if(liAttr != undefined) {
					//将自定义属性循环添加进字符串
					//用来储存所有的tablecode
					var checkKey = "";
					//用来储存对象里的tablecode字段
					var checkValue = ",";
					//用来储存所有的id
					var getLiVal = "";
					$.each(liAttr, function(i, d) {
						//获取id并进行非空验证
						getLiVal = $(d).attr('liid') == undefined || $(d).attr('liid') == null ? "" : $(d).attr('liid');
						//获取code并进行非空验证
						checkKey = $(d).attr('tableDictCode') == undefined || $(d).attr('tableDictCode') == null ? "" : $(d).attr('tableDictCode');
						//指定对象中的checkKey字段
						checkValue = checkDict[checkKey];
						//如果为空赋值初始值 ，
						if(checkValue == undefined || checkValue == null) {
							checkValue = ",";
						}
						//二次赋值为所有的id
						checkValue = checkValue + (getLiVal == "" ? "" : getLiVal + ",");
						//将所有的id存到对象中的checkKey字段
						checkDict[checkKey] = checkValue;
					});
				}
				//初始化变量
				checkValue = "";
				//声明li字符串
				var liStr = "";
				//循环获取所有选中的复选框
				$.each(checkNode, function(i, n) {
					if(n.sortId) {
						//赋值为对象中的tableDictCode内的所有值也就是之前赋值的此tablecode下的所有所属id
						checkValue = checkDict[n.tableDictCode] == undefined || checkDict[n.tableDictCode] == null ? "" : checkDict[n.tableDictCode];
						//通过获取的所有的所属id进行判断，负一为非相同，正常添加，反之不添加     此比对为一次获取一个tablecode  和之下的所有id，进行tablecode内的比对
						if(checkValue.indexOf("," + n.id + ",") < 0) {
							liStr += '<li tableDictCode="' + n.tableDictCode + '" liid=' + n.id + '>' + n.text + '</li>';
						}
						//清空右边的选中
						//$('#dataItemTree').tree('uncheck', oneright[i].target);
					}
				});
				ulBody.append(liStr);
			});
			//弹窗移除到未选按钮事件绑定（单个）
			$(".set-role-button").on("click", ".left", function() {
				//获取根节点
				var rootNode = $('#dataItemTree').tree('getRoot');
				//获取子节点
				var childNode = $('#dataItemTree').tree('getChildren', rootNode.target);
				//获取父节点
				var parentNode = "";
				//父级的父级
				var parentsNode = "";
				var selDatas = [];
				$(".role-right-ul li.li-active").each(function(i, n) {
					selDatas.push($(n).attr('liid'));
				});
				$.each(childNode, function(i, n) {
					$.each(selDatas, function(i, s) {
						if(n.id == selDatas[i]) {
							//去除选中状态和样式
							$("#dataItemTree").tree("uncheck", n.target);
							$("#" + n.domId).find("span.tree-title").css("color", "#333");
						}
					});
				});
				$(".role-right-ul").find('.li-active').remove();
			});
			//弹窗移除到未选按钮事件绑定（多个）
			$(".set-role-button").on("click", ".d-left", function() {
				//获取所有选中的复选框
				var oneright = $("#dataItemTree").tree('getChecked');
				//获取根节点
				var rootNode = $('#dataItemTree').tree('getRoot');
				//折起所有的节点
				$("#dataItemTree").tree('collapseAll', rootNode.target);
				//循环获取所有选中的复选框
				$.each(oneright, function(i, n) {
					///清空左边的选中
					$('#dataItemTree').tree('uncheck', oneright[i].target);
				});
				//清空右边所有的li
				$(".role-right-ul").find('li').remove();
			});
			//li点击添加背景色类,再次点击去除	
			$(".role-right-ul").on('click', "li", function() {
				$(this).toggleClass('li-active');
			});
			//获取配置数据项启用中的主数据列表信息
			item.getAllBudgetSpecialInfoList();
		});
	},
	//4.18.2[数据项配置]：获取数据项详细信息
	getBudgetSpecialInfoById: function() {
		//当前列的二级code
		var tableData = $("#flod-table .yt-table-active").data("tableData");
		var reStr = "";
		$.ajax({
			type: "post",
			url: "budget/special/getBudgetSpecialInfoById", //ajax访问路径
			async: false,
			data: {
				specCode: tableData.secondSpecialCode
			},
			success: function(data) {
				if(data.flag == 0) {
					var datas = data.data;
					if(datas.includeAttr == "") {
						var inc = 0;
					} else {
						var inc = 1;
					}
					reStr += '<div style="height:200px;" class="bold-div">' +
						'<div class="item-div">' +
						'数据项信息' +
						'<label class="check-label yt-checkbox ' + (inc == 1 ? 'check' : '') + '"style="margin-left: 20px;">' +
						'<input id="itemInformation" type="checkbox" name="test" value="0" disabled="disabled"/>带文本输入框<span>（文本输入框的位置始终在最后）</span>' +
						'</label>' +
						'</div>' +
						'<div class="level-one-div">' +
						'一级：<span class="level-one">' + datas.firstSpecialName + '</span>' +
						'</div>' +
						'<div class="level-two-div">' +
						'二级：<span class="level-two">' + datas.secondSpecialName + '</span>' +
						'</div>' +
						'<div class="level-three-div">' +
						'<div style="float: left;line-height: 28px;">' +
						'三级：' +
						'</div>' +
						'<div style="float: left;width: 90%;">' +
						'<textarea style="cursor: pointer;" class="level-three yt-textarea"  readonly="readonly">' + datas.thirdSpecialName + '</textarea>' +
						'</div>' +
						'</div>' +
						'</div>';
					//reStr = $(reStr).data("reStr", n);
				}
			}
		});
		return reStr;
	},
	//4.18.3[数据项配置]：获取配置数据项启用中的主数据列表信息
	getAllBudgetSpecialInfoList: function() {
		//当前列的二级code
		var tableData = $("#flod-table .yt-table-active").data("tableData");
		$.ajax({
			type: "post",
			url: "budget/special/getAllBudgetSpecialInfoList", //ajax访问路径
			async: false,
			data: {
				specCode: tableData.secondSpecialCode
			},
			success: function(data) {
				var trStr = "";
				if(data.flag == 0) {
					//获取左边的值
					var dataL = data.data.tableKeyList;
					item.treeAllData = dataL;
					//获取右边的值
					var dataR = data.data.rightTableKeyList;
					//创建easyui树形结构
					$("#dataItemTree").tree({
						data: dataL,
						animate: true,
						checkbox: true,
						onClick: function(node) {
							if(node.checkState != undefined) {
								if(node.checkState == "checked") {
									$("#dataItemTree").tree("uncheck", $("#" + node.domId));
									$("#" + node.domId).find("span.tree-title").css("color", "#333");
								} else {
									$("#dataItemTree").tree("check", $("#" + node.domId));
									$("#" + node.domId).find("span.tree-title").css("color", "#418dcc");
								}
							}
						},
						onCheck: function(node, checked) {
							if(checked) {
								$("#" + node.domId).find("span.tree-title").css("color", "#418dcc");
								$("#" + node.domId).next().find("li span.tree-title").css("color", "#418dcc");
							} else {
								$("#" + node.domId).find("span.tree-title").css("color", "#333");
								$("#" + node.domId).next().find("li span.tree-title").css("color", "#333");
							}
						}
					});
					//去除easyUI左侧文件夹图标
					$(".tree-icon,.tree-file").removeClass("tree-icon tree-file");
					$(".tree-icon,.tree-folder").removeClass("tree-icon tree-folder tree-folder-open tree-folder-closed");
					var liStr = "";
					var htmlUl = $(".role-right-ul");
					//循环获取所有选中的复选框
					if(dataR.length > 0) {
						//清空右边所有的li
						$(".role-right-ul").find('li').remove();
						$.each(dataR, function(i, n) {
							liStr += '<li tableDictCode="' + n.tableDictCode + '" liId=' + n.subCode + '>' + n.subName + '</li>';
						});
						htmlUl.append(liStr);
					}
				}
			}
		});
	},
	//[数据项配置]：保存数据项配置信息
	saveBudgetSpecialInfo: function() {
		//当前列的二级code
		var tableData = $("#flod-table .yt-table-active").data("tableData");
		var keyLi = "";
		//li json
		var addJson = {};
		var addListJson = [];
		//获取id
		var alli = $(".role-right-ul").find('li');
		$.each(alli, function(i, d) {
			keyLi += $(d).attr('liid');
			addJson = {
				tableDictCode: $(d).attr('tableDictCode'),
				subCode: $(d).attr('liid')
			}
			addListJson.push(addJson);
		});
		var addListJsonStr = JSON.stringify(addListJson);
		$.ajax({
			type: "post",
			url: "budget/special/saveBudgetSpecialInfo", //ajax访问路径
			async: false,
			data: {
				specCode: tableData.secondSpecialCode,
				addJson: addListJsonStr
			},
			success: function(data) {
				//提示信息
				$yt_alert_Model.prompt(data.message);
				$(".rela-dept-search").val('');
				$('.role-right-ul').find('li').remove(); //清空弹窗数据
				sysCommon.closeModel($(".relevance-pop")); //关闭弹窗
				$("#flod-table  div.fold-div").html(item.getBudgetSpecialInfoById());
			}
		});
	},
	//弹框事件
	clickAlert: function() {
		//		//点击文本域      1.32关联接口弹框
		//		$yt_alert_Model.getDivPosition($("#relevancePop"));
		sysCommon.showModel($("#relevancePop"));
		//保存按钮
		$("#relevancePop").off().on("click", ".save-btn", function() {
			item.saveBudgetSpecialInfo();
		})
		//重置
		$(".input-search").on("click", "#resetBtn", function() {
			$(".rela-dept-search").val('');
			item.getAllBudgetSpecialInfoList();
		})
		//查询
		$(".input-search").on("click", "#queryBtn", function() {
			var searchText = $(".rela-dept-search").val();
			var searchData = [];
			var searchParentInfo = {};
			var searchChildData = [];
			var checkDict = {};
			var checkKey = "";
			var checkValue = ",";
			var getLiVal = "";
			var alli = $(".role-right-ul").find('li');
			$.each(alli, function(i, d) {
				checkKey = $(d).attr('tableDictCode');
				getLiVal = $(d).attr('liid');
				//指定对象中的checkKey字段
				checkValue = checkDict[checkKey];
				//如果为空赋值初始值 ，
				if(checkValue == undefined || checkValue == null) {
					checkValue = ",";
				}
				//二次赋值为所有的id
				checkValue = checkValue + (getLiVal == "" ? "" : getLiVal + ",");
				//将所有的id存到对象中的checkKey字段
				checkDict[checkKey] = checkValue;
			});
			checkValue = "";
			var leftData = [];
			leftData = JSON.parse(JSON.stringify(item.treeAllData));
			$.each(leftData, function(i, p) {
				searchParentInfo = {};
				searchChildData = [];
				$.each(p.children, function(j, c) {
					checkValue = checkDict[p.tableDictCode] == undefined || checkDict[p.tableDictCode] == null ? "" : checkDict[p.tableDictCode];
					//通过获取的所有的所属id进行判断，负一为非相同，正常添加，反之不添加     此比对为一次获取一个tablecode  和之下的所有id，进行tablecode内的比对
					c.checked = false;
					if(checkValue.indexOf("," + c.id + ",") > -1) {
						c.checked = true;
					}

					if(searchText != null && searchText != "") {
						if(c.text.indexOf(searchText) > -1) {
							searchChildData.push(c)
						}
					}
				});

				if(null != searchChildData && searchChildData.length > 0) {
					searchParentInfo = p;
					searchParentInfo["children"] = searchChildData;
					searchData.push(searchParentInfo);
				}
			});
			if(searchText == null || searchText == "") {
				searchData = leftData;
			}

			$('#dataItemTree').tree('loadData', searchData);
			$(".tree-icon,.tree-file").removeClass("tree-icon tree-file");
			$(".tree-icon,.tree-folder").removeClass("tree-icon tree-folder tree-folder-open tree-folder-closed");
		})
	},
	/**
	 * table不分页
	 * @param {Object} property
	 */
	tablePage: function() {
		$.ajax({
			type: "post",
			url: "budget/special/getBudgetSpecialInfoList", //ajax访问路径
			async: false,
			success: function(data) {
				var htmlTbody = $('#flod-table .yt-tbody');
				htmlTbody.empty();
				var trStr = "";
				if(data.flag == 0) {
					var datas = data.data;
					if(datas.length > 0) {
						$.each(datas, function(i, n) {
							trStr += '<tr class="fold-tr">' +
								'<td style="text-align: left;">' + n.firstSpecialName + '</td>' +
								'<td style="text-align: left;">' + n.secondSpecialName + '</td>' +
								'<td style="text-align: left;" class="text-overflow" title="' + (n.thirdSpecialName || '无') + '">' + (n.thirdSpecialName || '无') + '</td>' +
								'<td>' + (n.includeAttr == "TEXT" ? "是" : "否") + '</td>' +
								'<td style="' + (n.state = 1 ? 'color:green' : 'color:red') + '">' + (n.state = 1 ? '启用' : '停用') + '</td>' +
								'</tr>';
							trStr = $(trStr).data("tableData", n);
							htmlTbody.append(trStr);
						});
					} else {
						//拼接暂无数据效果
						htmlTbody.html(sysCommon.noDataTrStr(5));
					}
				} else {
					//拼接暂无数据效果
					htmlTbody.html(sysCommon.noDataTrStr(5));
					//提示信息	
					$yt_alert_Model.prompt(data.message);
				}
			}
		});
	},
}
/** 
 * 点击复选框触发事件 
 * @param {Object} checkNode 选中的对象list 
 */
function getMultiChecked(checkNode) {
	var check = '';
	$.each(checkNode, function(i, n) {
		check += n.id + ',' + n.name + ';';
	});
	console.log(check);
}
$(function() {
	item.init();
})