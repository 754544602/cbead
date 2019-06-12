;
(function($, window) {
	//为Object原型添加长度计算方法
	/*Object.prototype.length = function() {
		var count = 0;
		for(var i in this) {
			count++;
		}
		return count;
	};*/

	var thisObj = this.thisObj = null,
		startTd = this.startTd = null,
		startIndex = this.startIndex = null,
		endTd = this.endTd = null,
		endIndex = this.endIndex = null,
		options = this.options = {},
		tTD; //用来存储当前更改宽度的Table Cell,避免快速移动鼠标的问题

	/**
	 * 获取js对象的长度
	 * @param {Object} o
	 */
	function objLen(o) {
		var count = 0;
		for(var i in o) {
			count++;
		}
		return count;
	};
	/**
	 * 初始化执行函数
	 * @param {Object} obj 执行对象
	 * @param {Object} opt 配置参数
	 */
	function init(obj, opt) {
		//设置表格
		setRuleTable(obj, opt);
		if(options.eventCheck) {
			//设置右键交互弹出框
			setInteractive();
			//设置事件
			events(obj, opt);
		}
		if(options.resize){
			resizeFun(obj, opt);
		}
	};
	/**
	 * 事件处理函数
	 * @param {Object} obj
	 */
	function events(obj, opt) {
		//移除默认选中效果
		obj.on('selectstart', function() {
			return false;
		});
		//移除默认右键菜单
		obj.on('contextmenu', function(e) {
			e.preventDefault();

			//return false;
		});
		//表头单元格点击选中
		obj.find('.yt-thead,.indicate-head').on('mousedown', 'th', function(e) {
			var btnNum = e.button;
			var me = $(this);
			if(btnNum == 2) {
				//选中的单元格
				var tds = thisObj.find('th.cell-check');
				if(me.hasClass('cell-check')) {
					//根据选中的单元格数量判断是否需要合并
					if(tds.length > 1) {
						//启用合并
						$('#rightButCon .merge').removeClass('dis').attr('disabled', false);
						//禁用拆分
						$('#rightButCon .split').addClass('dis').attr('disabled', true);
					} else {
						$('#rightButCon .merge').addClass('dis').attr('disabled', true);
						//判断是否已合并需要拆分
						var colspan = tds.attr('colspan');
						var rowspan = tds.attr('rowspan');
						if((colspan && +colspan > 1) || (rowspan && +rowspan > 1)) {
							//启用拆分
							$('#rightButCon .split').removeClass('dis').attr('disabled', false);
						} else {
							//禁用拆分
							$('#rightButCon .split').addClass('dis').attr('disabled', true);
						}
					}
				} else {
					$('#rightButCon .merge,#rightButCon .split').addClass('dis').attr('disabled', true);
				}

				//判断是否是选择列的标签
				if(me.hasClass('indicate') && me.hasClass('td-shadow')) {
					//启用只读项
					$('#rightButCon .readonly').removeClass('dis').attr('disabled', false);
					//判断是否已经设置只读
					if(me.hasClass('dis')) {
						//取消只读事件
						$('#rightButCon .readonly').text('取消只读').off().on('click', function() {
							me.removeClass('dis').text(me.text().split('[')[0]);
							thisObj.find('.yt-thead .td-shadow').removeClass('dis');
						});
					} else {
						//只读事件
						$('#rightButCon .readonly').text('只读').off().on('click', function() {
							me.addClass('dis').text(me.text() + '[只读]');
							thisObj.find('.yt-thead .td-shadow').addClass('dis');
						});
					}
				} else {
					//禁用只读项
					$('#rightButCon .readonly').addClass('dis').attr('disabled', true);
				}

				//右键显示选单
				rightButConPosition(e);
				$(document).one('click', function() {
					$('#rightButCon').hide();
				});
				//右键菜单事件
				setInterEvent(me, '.yt-thead', 'thead');

				console.log(startIndex, endIndex);
			} else if(btnNum == 0) {
				//点击后为所有的单元格添加鼠标经过事件
				startTd = $(this);
				var y = $(this).index();
				var x = $(this).parent().index();
				startIndex = {
					x: x,
					y: y
				};
				//清除选中行列的样式
				thisObj.find("td,th").removeClass('cell-check');
				thisObj.find('.yt-tbody tr').removeClass('tr-shadow');
				thisObj.find('td,th').removeClass('td-shadow');
				obj.find('.yt-thead').find('th:not(.indicate)').removeClass('cell-check').on('mouseover', function() {
					//$(this).addClass('cell-check');
					endTd = $(this);
					var y = $(this).index();
					var x = $(this).parent().index();
					endIndex = {
						x: x,
						y: y
					};
					selectTd(startIndex, endIndex, 'th:not(.indicate)', '.yt-thead');
				});
				$(this).addClass('cell-check');
			} else if(btnNum == 1) {
				//alert("您点击了鼠标中键！");
			}
		});

		//单元格点击选中
		obj.find('.yt-tbody').on('mousedown', 'td,th', function(e) {
			var btnNum = e.button;
			var me = $(this);
			//检测是否存在回调函数
			if(options.callBackTdClick) {
				options.callBackTdClick(me);
			}
			if(btnNum == 2) {
				//选中的单元格
				var tds = thisObj.find('td.cell-check');
				if($(this).hasClass('cell-check')) {
					//根据选中的单元格数量判断是否需要合并
					if(tds.length > 1) {
						//启用合并
						$('#rightButCon .merge').removeClass('dis').attr('disabled', false);
						//禁用拆分
						$('#rightButCon .split').addClass('dis').attr('disabled', true);
					} else {
						$('#rightButCon .merge').addClass('dis').attr('disabled', true);
						//判断是否已合并需要拆分
						var colspan = tds.attr('colspan');
						var rowspan = tds.attr('rowspan');
						if((colspan && +colspan > 1) || (rowspan && +rowspan > 1)) {
							//启用拆分
							$('#rightButCon .split').removeClass('dis').attr('disabled', false);
						} else {
							//禁用拆分
							$('#rightButCon .split').addClass('dis').attr('disabled', true);
						}
					}
				} else {
					$('#rightButCon .merge,#rightButCon .split').addClass('dis').attr('disabled', true);
				}

				//判断是否是选择列的标签
				if(me.hasClass('indicate') && me.parent().hasClass('tr-shadow')) {
					//启用只读项
					$('#rightButCon .readonly').removeClass('dis').attr('disabled', false);
					//判断是否已经设置只读
					if(me.hasClass('dis')) {
						//取消只读事件
						$('#rightButCon .readonly').text('取消只读').off().on('click', function() {
							me.removeClass('dis').text(me.text().split('[')[0]);
						});
					} else {
						//只读事件
						$('#rightButCon .readonly').text('只读').off().on('click', function() {
							me.addClass('dis').text(me.text() + '[只读]');
						});
					}
				} else {
					//禁用只读项
					$('#rightButCon .readonly').addClass('dis').attr('disabled', true);
				}

				//右键显示选单
				rightButConPosition(e);
				//右键菜单事件
				setInterEvent(me, '.yt-tbody', 'tbody');
				//点击关闭菜单
				$(document).one('click', function() {
					$('#rightButCon').hide();
				});
				console.log(startIndex, endIndex);
			} else if(btnNum == 0) {
				//点击后为所有的单元格添加鼠标经过事件
				startTd = $(this);
				var y = $(this).index() - 1;
				var x = $(this).parent().index();
				startIndex = {
					x: x,
					y: y
				};
				console.log(startIndex, endIndex);
				//清除选中行列的样式
				thisObj.find("td,th").removeClass('cell-check');
				thisObj.find('.yt-tbody tr').removeClass('tr-shadow');
				thisObj.find('td,th').removeClass('td-shadow');
				obj.find('.yt-tbody').find('td').removeClass('cell-check').on('mouseover', function() {
					//$(this).addClass('cell-check');
					endTd = $(this);
					var y = $(this).index() - 1;
					var x = $(this).parent().index();
					endIndex = {
						x: x,
						y: y
					};
					selectTd(startIndex, endIndex, 'td', '.yt-tbody');
				});
				$(this).addClass('cell-check');
			} else if(btnNum == 1) {
				//alert("您点击了鼠标中键！");
			}
		});
		//松开鼠标移除经过事件
		obj.on('mouseup', 'td,th', function() {
			obj.find('td,th').off('mouseover');
		});

		//选中一行
		obj.find('.yt-tbody').on('click', 'th.indicate', function() {
			var me = $(this);
			//移除已选中的单元格样式
			obj.find('.yt-tbody,.yt-thead').find('td,th:not(.indicate)').removeClass('cell-check');
			obj.find('.yt-tbody tr').removeClass('tr-shadow');
			obj.find('.yt-tbody td').removeClass('td-shadow');
			//获取行的下表
			me.parent().addClass('tr-shadow');
		});
		//选中一列
		obj.find('thead.indicate-head').on('click', 'th.indicate', function() {
			var me = $(this).addClass('td-shadow');
			//移除已选中的单元格样式
			obj.find('.yt-tbody,.yt-thead').find('td,th:not(.indicate)').removeClass('cell-check');
			obj.find('.yt-tbody tr').removeClass('cell-mark');
			obj.find('.yt-tbody td').removeClass('td-shadow');
			//获取当前选中的配置th的索引
			var index = $(this).index();
			obj.find("tbody td,.yt-thead th").each(function() {
				if($(this).index() == index) {
					$(this).addClass("td-shadow");
				}
			});
		});

		//双击编辑
		obj.on('dblclick', 'td,th:not(.indicate)', function() {
			var me = $(this);
			var txt = me.text();
			//获取标签位置
			var posi = me.position();
			//获取标签大小
			var width = me.outerWidth();
			var height = me.outerHeight();
			//转换文本为输入框的文本
			txt = getFormatCode(txt);
			//设置位置并显示
			$('#tableInputHolder').css({
				left: posi.left,
				top: posi.top
			}).show();
			$('#handtableInput').css({
				width: width,
				height: height
			}).val(txt).off().focus().on('blur', function() {
				var val = $(this).val();
				me.html(getFormatHtml(val));
				$('#tableInputHolder').hide();
				$(this).val('');
			});
		});

	};

	/**
	 * 拖拽改变行列
	 * @param {Object} obj
	 * @param {Object} opt
	 */
	function resizeFun(obj, opt) {
		//拖拽改变列宽
		obj.find('.indicate-head').on('mousedown', '.indicate', function() {
			//记录单元格
			tTD = this;
			if(event.offsetX > tTD.offsetWidth - 10) {
				tTD.mouseDown = true;
				tTD.oldX = event.x;
				tTD.oldWidth = tTD.offsetWidth;
			}
			//记录Table宽度
			//table = tTD; while (table.tagName != ‘TABLE') table = table.parentElement;
			//tTD.tableWidth = table.offsetWidth;
		});
		obj.find('.indicate-head').on('mouseup', '.indicate', function() {
			//结束宽度调整
			if(tTD == undefined) tTD = this;
			tTD.mouseDown = false;
			tTD.style.cursor = 'default';
		});
		obj.find('.indicate-head').on('mousemove', '.indicate', function() {
			//更改鼠标样式
			if(event.offsetX > this.offsetWidth - 10) {
				$(this).css('cursor', 'col-resize');
			} else {
				$(this).css('cursor', 'default');
			}
			//取出暂存的Table Cell
			if(tTD == undefined) tTD = this;
			//调整宽度
			if(tTD.mouseDown != null && tTD.mouseDown == true) {
				tTD.style.cursor = 'default';
				if(tTD.oldWidth + (event.x - tTD.oldX) > 0) {
					tTD.width = tTD.oldWidth + (event.x - tTD.oldX - 10);
				}
				//调整列宽
				$(tTD).css({
					'min-width': tTD.width + 'px',
					'cursor': 'col-resize'
				});
				//调整该列中的每个Cell
				$(tTD).parents('.rule-table').find('.yt-thead tr').each(function(i, n) {
					$(n).find('th').eq(tTD.cellIndex).css('min-width', tTD.width + 'px');
				});
			}
		});

		//调整行高
		obj.find('.yt-tbody').on('mousedown', '.indicate', function() {
			//记录单元格
			tTD = this;
			if(event.offsetY > tTD.offsetHeight - 10) {
				tTD.mouseDown = true;
				tTD.oldY = event.y;
				tTD.oldHeight = tTD.offsetHeight;
			}
		});
		obj.find('.yt-tbody').on('mouseup', '.indicate', function() {
			//结束高度调整
			if(tTD == undefined) tTD = this;
			tTD.mouseDown = false;
			tTD.style.cursor = 'default';
		});
		obj.find('.yt-tbody').on('mousemove', '.indicate', function() {
			//更改鼠标样式
			if(event.offsetY > this.offsetHeight - 10) {
				$(this).css('cursor', 'row-resize');
			} else {
				$(this).css('cursor', 'default');
			}
			//取出暂存的Table Cell
			if(tTD == undefined) tTD = this;
			//调整高度
			if(tTD.mouseDown != null && tTD.mouseDown == true) {
				tTD.style.cursor = 'default';
				if(tTD.oldHeight + (event.y - tTD.oldY) > 0) {
					tTD.height = tTD.oldHeight + (event.y - tTD.oldY - 20);
				}
				//调整行高
				$(tTD).css({
					'height': tTD.height + 'px',
					'cursor': 'row-resize'
				});
				//调整该行中的每个Cell
				$(tTD).nextAll().css('height', tTD.height + 'px');
			}
		});
	}

	/* 
	 * 根据Value格式化为带有换行、空格格式的HTML代码 
	 * @param strValue {String} 需要转换的值 
	 * @return  {String}转换后的HTML代码 
	 * @example   
	 * getFormatCode("测\r\n\s试")  =>  “测<br/> 试” 
	 */
	var getFormatCode = function(strValue) {
		return strValue.replace(/\r\n/g, '<br/>').replace(/\n/g, '<br/>').replace(/\s/g, ' ');
	}

	/**
	 * 将HTML代码转换为textarea内容
	 * @param {Object} str
	 */
	var getFormatHtml = function(str) {
		var newString = str.replace(/\n/g, '_@').replace(/\r/g, '_#');
		newString = newString.replace(/_#_@/g, '<br/>'); //IE7-8
		newString = newString.replace(/_@/g, '<br/>'); //IE9、FF、chrome
		newString = newString.replace(/\s/g, '&nbsp;'); //空格处理
		return newString;
	}

	/**
	 * 设置右键菜单的显示位置
	 * @param {Object} site
	 */
	function rightButConPosition(e) {
		var left = e.clientX;
		var top = e.clientY;
		console.log(e);
		//弹出框对象
		var rightButCon = $('#rightButCon');
		//宽度
		var width = rightButCon.width();
		//高度
		var height = rightButCon.height();
		//获取页面的宽高
		var w = $(window);
		var winWidth = w.width();
		var winHeight = w.height();
		//计算超出定位的显示方式
		left = width + left > 　winWidth ? left - width : left;
		top = height + top > winHeight ? top - height : top;
		rightButCon.show().css({
			left: left,
			top: top
		});
	}

	/**
	 * 根据数据创建表格
	 * @param {Object} obj 执行对象
	 * @param {Object} opt 配置参数
	 */
	function setRuleTable(obj, opt) {
		if((opt.theads && objLen(opt.theads) > 0) || (opt.tbodys && objLen(opt.tbodys) > 0)) {
			//数据存在根据数据生成表格
			createItemTable(obj, opt);
		} else if(opt.rowNum || opt.colNum) {
			//根据行和列的数量来快速生成表格
			createSimpleTable(obj, opt);
		} else {
			thisObj.html('');
		}
		//添加标识class
		obj.addClass('rule-table-div');
	};
	/**
	 * 根据行和列的数量来快速生成表格
	 * @param {Object} obj
	 * @param {Object} opt
	 */
	function createSimpleTable(obj, opt) {
		//行的数量 至少保留一行或一列
		var row = opt.rowNum ? opt.rowNum : 1;
		var headRow = opt.headRow ? opt.headRow : 1;
		//列的数量
		var col = opt.colNum ? opt.colNum : 1;
		//计算th宽度
		var width = 1200 / opt.colNum;
		width = width > 90 ? parseInt(width) : 90;
		//创建table
		var table = '<table class="yt-table rule-table">';
		//添加额外的指示标签
		table += '<thead class="indicate-head">';
		if(options.serialNumber) {
			table += '<th class="tab-indicate"></th>';
		}
		for(var s = 0; s < col; s++) {
			table += '<th class="indicate">C' + (s + 1) + '</th>';
		}
		table += '</thead>';

		//创建表头
		table += '<thead class="yt-thead">';
		for(var e = 0; e < headRow; e++) {
			table += '<tr>';
			if(options.serialNumber) {
				table += '<th class="tab-indicate"></th>';
			}
			for(var j = 0; j < col; j++) {
				table += '<th style="min-width:' + width + 'px;"></th>';
			}
			table += '</tr>';
		}
		table += '</thead>';

		//创建表格行
		table += '<tbody class="yt-tbody">';
		for(var i = 0; i < row; i++) {
			table += '<tr>';
			table += '<th class="indicate">R' + (i + 1) + '</th>';
			for(var j = 0; j < col; j++) {
				table += '<td></td>';
			}
			table += '</tr>';
		}
		table += '</tbody></table>';
		//添加表格内容
		if(obj.find('.rule-table').length > 0) {
			obj.find('.rule-table').replaceWith(table);
		} else {
			obj.append(table);
		}
	}

	/**
	 * 根据传入的数据创建表格
	 * @param {Object} obj
	 * @param {Object} opt
	 */
	function createItemTable(obj, opt) {
		//表头数据
		var theads = opt.theads;
		//表格数据
		var tbodys = opt.tbodys;
		//需要禁用的行和列长度
		var disSend = opt.disSend ? opt.disSend : {};
		var disX = disSend.x ? disSend.x : 0;
		var disY = disSend.y ? disSend.y : 0;

		//创建table
		var table = '<table class="yt-table rule-table">';

		if(options.serialNumber) {
			//添加额外的指示标签
			table += '<thead class="indicate-head">';
			if(options.serialNumber) {
				table += '<th class="tab-indicate"></th>';
			}
			for(var s = 0; s < objLen(tbodys['r1']); s++) {
				if(s < disY) {
					table += '<th class="dis"></th>';
				} else {
					table += '<th class="indicate">C' + (s + 1 - disY) + '</th>';
				}
			}
			table += '</thead>';
		}

		table += '<thead class="yt-thead">';
		for(var s = 1; s <= objLen(theads); s++) {
			table += '<tr>';
			if(options.serialNumber) {
				table += '<th class="tab-indicate"></th>';
			}
			var tr = theads['r' + s];
			for(var m = 1; m <= objLen(tr); m++) {
				table += getTrChild(tr['c' + m], 'th');
			}
			table += '</tr>';
		}
		table += '</thead>';

		table += '<tbody class="yt-tbody">';
		//创建表格行
		for(var i = 1; i <= objLen(tbodys); i++) {
			table += '<tr>';
			if(opt.serialNumber) {
				table += '<th class="indicate">R' + (i) + '</th>';
			}
			var tr = tbodys['r' + i];
			for(var j = 1; j <= objLen(tr); j++) {
				table += getTrChild(tr['c' + j], 'td');
			}
			table += '</tr>';
		}
		table += '</tbody></table>';
		//添加表格内容
		if(obj.find('.rule-table').length > 0) {
			obj.find('.rule-table').replaceWith(table);
		} else {
			obj.append(table);
		}
		//判断是否有只读的属性
		if(opt.propertyList && opt.propertyList.length > 0) {
			for(var i = 0, len = opt.propertyList.length; i < len; i++) {
				var proper = opt.propertyList[i];
				//拆分所属下标
				var index = proper.crNum.replace(proper.type, '');
				if(proper.type == 'c') {
					//获取对用表格
					var th = thisObj.find('.indicate-head .indicate').eq(index - 1);
					//替换文字并添加只读标识
					th.text(th.text() + '[只读]').addClass('dis');
					thisObj.find('.yt-thead tr').each(function(i, n){
					  $(n).find('th').eq(index - 1).addClass('dis');
					});
				} else if(proper.type == 'r') {
					var th = thisObj.find('.yt-tbody tr').eq(index - 1).find('.indicate');
					th.text(th.text() + '[只读]').addClass('dis');
				}
			}
		}

	}
	/**
	 * 单tr 子级内td或th的处理
	 * @param {Object} o 数据
	 * @param {Object} t 标签类型
	 */
	function getTrChild(o, t) {
		var html = '<' + t + ' ' + (o.rowspan ? ('rowspan="' + o.rowspan + '"') : '') + ' ' + (o.colspan ? ('colspan="' + o.colspan + '"') : '') + ' ' + (o.style ? ('style="' + o.style + '"') : '') + '>';
		//添加内容
		if(o.contents) {
			html += o.contents;
		}
		html += '</' + t + '>';
		return html;
	}

	/**
	 * 拖拽选中单元格
	 * @param {Object} startIndex
	 * @param {Object} endIndex
	 * @param {Object} Color
	 */
	function selectTd(startIndex, endIndex, dom, box) {
		var minX = null;
		var maxX = null;
		var minY = null;
		var maxY = null;
		if(startIndex.x < endIndex.x) {
			minX = startIndex.x;
			maxX = endIndex.x;
		} else {
			minX = endIndex.x;
			maxX = startIndex.x;
		};
		if(startIndex.y < endIndex.y) {
			minY = startIndex.y;
			maxY = endIndex.y;
		} else {
			minY = endIndex.y;
			maxY = startIndex.y;
		};
		startIndex = {
			x: minX,
			y: minY
		};
		endIndex = {
			x: maxX,
			y: maxY
		};
		console.log(startIndex, endIndex);
		thisObj.find("td,th").removeClass('cell-check');
		thisObj.find('.yt-tbody tr').removeClass('tr-shadow');
		thisObj.find('td,th').removeClass('td-shadow');
		for(var i = minX; i <= maxX; i++) {
			var selectTr = thisObj.find(box).find("tr").eq(i);
			for(var j = minY; j <= maxY; j++) {
				//console.log(selectTr.find(dom).eq(j));
				selectTr.find(dom).eq(j).addClass('cell-check');
			}
		}
	}
	/**
	 * 合并单元格
	 * @param {Object} StartIndex
	 * @param {Object} EndIndex
	 */
	function mergeCell(startIndex, endIndex, site) {
		var colspan = null;
		var rowspan = null;
		//需要合并的行数
		rowspan = endIndex.x - startIndex.x + 1;
		//合并的列数
		colspan = endIndex.y - startIndex.y + 1;
		var indexTr = thisObj.find(site).find("tr").eq(startIndex.x);
		$("td,th:not(.indicate,.dis)", indexTr).eq(startIndex.y).attr("colspan", colspan).attr("rowspan", rowspan);
		for(var i = startIndex.x; i <= endIndex.x; i++) {
			for(var j = startIndex.y; j <= endIndex.y; j++) {
				if(i == startIndex.x && j == startIndex.y) continue;
				var selectTr = thisObj.find(site).find("tr").eq(i);
				//隐藏并清空文本
				$("td,th:not(.indicate,.dis)", selectTr).eq(j).hide().text('').removeClass('cell-check');
			}
		}
	}
	/**
	 * 拆分单元格
	 * @param {Object} startIndex
	 * @param {Object} endIndex
	 */
	function splitCell(startIndex, endIndex, site, obj) {
		//合并列
		var colspan = +obj.attr("colspan") || 0;
		//合并行数
		var rowspan = +obj.attr("rowspan") || 0;
		obj.attr("colspan", '').attr("rowspan", '');

		var endX = startIndex.x + rowspan;
		var endY = startIndex.y + colspan;
		for(var i = startIndex.x; i <= endX; i++) {
			for(var j = startIndex.y; j <= endY; j++) {
				if(i == startIndex.x && j == startIndex.y) continue;
				var selectTr = thisObj.find(site).find("tr").eq(i);
				//隐藏并清空文本
				$("td,th:not(.indicate,.dis)", selectTr).eq(j).show();
			}
		}
	}

	/**
	 * 插入一行空数据
	 * @param {Object} e
	 * @param {Object} site
	 */
	function insertRowTr(e, type, site) {
		var html = '';
		if(type == 'thead') {
			//添加一行表头
			html += '<tr>';
			if(options.serialNumber) {
				html += '<th class="tab-indicate"></th>';
			}
			for(var i = 0, len = e.find('th:not(.tab-indicate)').length; i < len; i++) {
				html += '<th></th>';
			}
			html += '</tr>';
			e.before(html);
			//插入成功后重置序号
			//resetColItemKey();
		} else if(type == 'tbody') {
			//添加一行数据
			html += '<tr>';
			html += '<th class="indicate"></th>';
			for(var i = 0, len = e.find('td').length; i < len; i++) {
				html += '<td></td>';
			}
			html += '</tr>';
			e.before(html);
			//插入成功后重置序号
			resetRowItemKey();
		}

	}

	/**
	 * 删除一行数据
	 * @param {Object} e
	 * @param {Object} type
	 * @param {Object} site
	 */
	function delteRowTr(e, type, site) {
		var html = '';
		//移除对象
		e.remove(html);
		//插入成功后重置序号
		resetRowItemKey();
	}

	/**
	 * 重置当前列表的行的序号
	 */
	function resetRowItemKey() {
		var o = thisObj;
		var trs = thisObj.find('.rule-table tbody tr .indicate');
		trs.each(function(i) {
			if($(this).hasClass('dis')) {
				$(this).text('R' + (i + 1) + '[只读]');
			} else {
				$(this).text('R' + (i + 1));
			}
		});
	}

	/**
	 * 重置当前列表列的序号
	 */
	function resetColItemKey() {
		var o = thisObj;
		var tds = thisObj.find('.rule-table .indicate-head th.indicate');
		tds.each(function(i) {
			if($(this).hasClass('dis')) {
				$(this).text('C' + (i + 1) + '[只读]');
			} else {
				$(this).text('C' + (i + 1));
			}
		});
	}

	/**
	 * 插入一列空数据
	 * @param {Object} e
	 * @param {Object} site
	 */
	function insertCol(e, site) {
		var index = e.index();

		//列序号行添加
		var indicateTrs = thisObj.find('.indicate-head tr');
		indicateTrs.each(function(i, n) {
			$(this).find('th').eq(index).before('<th class="indicate"></th>');
		});

		//列表头行添加
		var headTrs = thisObj.find('.yt-thead tr');
		headTrs.each(function(i, n) {
			$(this).find('th').eq(index).before('<th></th>');
		});

		//列数据行添加
		var bodyTrs = thisObj.find('.yt-tbody tr');
		bodyTrs.each(function(i, n) {
			$(this).find('td').eq(index - 1).before('<td></td>');
		});
		//更新序号
		resetColItemKey();
	}

	/**
	 * 删除一列数据
	 * @param {Object} e
	 * @param {Object} site
	 */
	function delteCol(e, site) {
		var index = e.index();

		//列序号行
		var indicateTrs = thisObj.find('.indicate-head tr');
		indicateTrs.each(function(i, n) {
			$(this).find('th').eq(index).remove();
		});

		//列表头行
		var headTrs = thisObj.find('.yt-thead tr');
		headTrs.each(function(i, n) {
			$(this).find('th').eq(index).remove();
		});

		//列数据行
		var bodyTrs = thisObj.find('.yt-tbody tr');
		bodyTrs.each(function(i, n) {
			$(this).find('td').eq(index - 1).remove();
		});
		//更新序号
		resetColItemKey();
	}

	/**
	 * 只读一行
	 * @param {Object} e
	 * @param {Object} site
	 */
	function readOnlyRow(e, site) {
		//获取列表存在序号的行
		var ths = thisObj.find('.yt-tbody tr .indicate');
		//清除将要重置的序号的第一个的文本和样式
		ths.eq(0).text('').removeClass('indicate').addClass('dis');
		//之后的从1 开始重新赋值序号
		for(var i = 1; i < ths.length; i++) {
			ths.eq(i).text('C' + i);
		}
	}

	/**
	 * 只读一列
	 * @param {Object} e
	 * @param {Object} site
	 */
	function readOnlyCol(e, site) {
		//获取现有的序号
		var ths = thisObj.find('.indicate-head .indicate,.yt-thead .td-shadow');
		ths.eq(0).text('').removeClass('indicate');
		ths.addClass('dis');
		//之后的从1 开始重新赋值序号
		for(var i = 1; i < ths.length; i++) {
			ths.eq(i).text('C' + i);
		}
	}

	/**
	 * 添加右键交互弹出框
	 */
	function setInteractive() {
		var html = '<div id="rightButCon" class="right-button-context"><ul><li class="align-left">左对齐</li><li class="align-center">居中</li><li class="align-right">右对齐</li><li class="insert-row">插入一行</li><li class="insert-col">插入一列</li><li class="del-row">删除一行</li><li class="del-col">删除一列</li><li class="merge">合并单元格</li><li class="split dis">拆分单元格</li><li class="readonly">只读</li></ul></div>';
		html += '<div id="tableInputHolder" class="input-holder"><textarea id="handtableInput" class="hand-input"></textarea></div>';
		thisObj.append(html);
	}

	/**
	 * 右键菜单点击事件处理
	 * @param {Object} obj
	 */
	function setInterEvent(obj, site, type) {
		//点击合并单元格
		$('#rightButCon .merge:not(.dis)').off().on('click', function() {
			mergeCell(startIndex, endIndex, site);
			$('#rightButCon').hide();
		});
		//点击拆分单元格
		$('#rightButCon .split:not(.dis)').off().on('click', function() {
			splitCell(startIndex, endIndex, site, obj);
			$('#rightButCon').hide();
		});
		//点击左对齐
		$('#rightButCon .align-left:not(.dis)').off().on('click', function() {
			thisObj.find('.yt-thead .cell-check:not(.indicate),.yt-thead .td-shadow,.yt-tbody .tr-shadow td').css({
				'text-align': 'left'
			});
			thisObj.find('.yt-tbody .cell-check:not(.indicate),.yt-tbody .td-shadow,.yt-tbody .tr-shadow td').css({
				'text-align': 'left'
			});
			$('#rightButCon').hide();
		});
		//点击居中
		$('#rightButCon .align-center:not(.dis)').off().on('click', function() {
			thisObj.find('.cell-check:not(.indicate),.td-shadow,.tr-shadow td').css({
				'text-align': 'center'
			});
			$('#rightButCon').hide();
		});
		//点击右对齐
		$('#rightButCon .align-right:not(.dis)').off().on('click', function() {
			thisObj.find('.yt-thead .cell-check:not(.indicate),.yt-thead .td-shadow,.yt-tbody .tr-shadow td').css({
				'text-align': 'right'
			});
			thisObj.find('.yt-tbody .cell-check:not(.indicate),.yt-tbody .td-shadow,.yt-tbody .tr-shadow td').css({
				'text-align': 'right'
			});
			$('#rightButCon').hide();
		});
		//点击插入一行
		$('#rightButCon .insert-row:not(.dis)').off().on('click', function(e) {
			var tr = obj.parents('tr');
			insertRowTr(tr, type, 'before');
			callback();
		});
		//点击插入一列
		$('#rightButCon .insert-col:not(.dis)').off().on('click', function(e) {
			var tr = obj;
			insertCol(tr, type, 'before');
			callback();
		});
		//点击删除一行
		$('#rightButCon .del-row:not(.dis)').off().on('click', function(e) {
			var tr = obj.parents('tr');
			delteRowTr(tr, type, 'before');
			callback();
		});
		//点击插入一列
		$('#rightButCon .del-col:not(.dis)').off().on('click', function(e) {
			var tr = obj;
			delteCol(tr, type, 'before');
			callback();
		});
		//设置只读一行
		$('#rightButCon .readonly-row:not(.dis)').off().on('click', function(e) {
			var tr = obj;
			readOnlyRow(tr, type, 'before');
		});
		//设置只读一列
		$('#rightButCon .readonly-col:not(.dis)').off().on('click', function(e) {
			var tr = obj;
			readOnlyCol(tr, type, 'before');
		});
	}

	/**
	 * 右键操作的回调函数
	 */
	function callback() {
		//获取当前列表中的行列信息

		//总列数
		var budgetCols = thisObj.find('.yt-tbody tr').eq(0).find('td').length;
		//表头总行数
		var budgetRows = thisObj.find('.yt-thead tr').length;
		//表身总行数
		var budgetBodyCols = thisObj.find('.yt-tbody tr').length;
		if(options.callback) {
			options.callback({
				cols: budgetCols,
				rows: budgetBodyCols,
				headRows: budgetRows
			});
		}
	}

	/**
	 * 设置表格的默认宽度
	 */
	function setTableWidth() {

	}

	$.fn.extend({
		'newRuleTable': function(opt) {
			thisObj = this;
			//整合参数配置
			options = $.extend({
				rowNum: 0,
				colNum: 0,
				//绑定列表操作事件
				eventCheck: true,
				//添加列表序号
				serialNumber: true,
				//拖拽行列
				resize: true
			}, opt);
			this.newRuleTable = {};
			this.initNewTable = init;
			this.initNewTable(this, options);
			return this;
		}
	});
})(jQuery, window);

/**
 * 获取列表数据
 * @param {Object} obj
 */
function getRuleTableData(obj) {
	//表格
	var table = obj.find('.rule-table');
	//表头
	var theadTrs = table.find('.yt-thead tr');
	//内容
	var tbodyTrs = table.find('.yt-tbody tr');
	var theads = {},
		tbodys = {};
	$.each(theadTrs, function(i, n) {
		tbodys['r' + i] = {};
		$.each($(n).find('th:not(.tab-indicate)'), function(j, m) {
			theads['r' + i]['c' + j] = {
				colNum: i, //行编号
				rowNum: j, //列编号
				contents: $(m).text(), //单元格内容
				rowspan: $(m).attr('rowspan') || '', //合并行数量
				cellspan: $(m).attr('cellspan') || '', //合并列数据
				style: $(m).attr('style') || '' //单元格样式
			}
		});
	});
	$.each(tbodyTrs, function(i, n) {
		tbodys['r' + i] = {};
		$.each($(n).find('td'), function(j, m) {
			tbodys['r' + i]['c' + j] = {
				colNum: i, //行编号
				rowNum: j, //列编号
				contents: $(m).text(), //单元格内容
				rowspan: $(m).attr('rowspan') || '', //合并行数量
				cellspan: $(m).attr('cellspan') || '', //合并列数据
				style: $(m).attr('style') || '' //单元格样式
			}
		});
	});
	//列表中不需要定义序号的行
	var disX = obj.find('.yt-tbody .dis').length;
	//列表中不需要定义序号的列
	var disY = obj.find('.indicate-head .dis').length;
	return {
		theadCellsList: theads,
		tbodyCellsList: tbodys,
		propertyList: {
			x: disX,
			y: disY
		}
	};
};