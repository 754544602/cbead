jQuery.fn.extend({
	createTableFlod: function(obj) {
		/*插入的内容*/
		var html = obj.text || '';
		/*折叠层显示的速度*/
		var speed = obj.speed || 200;
		var tr = $(this); /*获取要设置的所有选择器对象*/
		/*点击添加表格的追加行*/
		tr.off('click').on('click', function() {
			/*点击的对象*/
			var trthis = $(this);
			//删除表格中所有的选中行样式
			$(".yt-table tr").removeClass("yt-table-active");
			/*获取要合并的行数*/
			var tds = $(this).find('td');
			var trtext = '';
			/*判断内容类型*/
			if(typeof html == 'function') {
				trtext = html($(trthis));
			} else {
				trtext = html;
			}
			/*创建追加代码*/
			var trdiv = $('<tr class="fold-unfold"><td colspan="' +
				tds.length + '" style="padding:0;"><div class="fold-div">' +
				trtext + '</div></td></tr>');
			/*判断是追加还是移除*/
			if(!$(this).next().hasClass('fold-unfold')) {
				$('.fold-unfold').remove();
				/*追加的div默认设置为隐藏*/
				$(trdiv).find('.fold-div').css('display', 'none');
				/*将追加的div进行展开*/
				$(trdiv).find('.fold-div').slideDown(speed,function(){
					if(trtext!=""){
						trthis.after(trdiv);
					}
				});
			} else {
				/*先收回div，再进行移除*/
				$(trdiv).find('.fold-div').slideUp(speed, function() {
					$(trthis).next('.fold-unfold').remove();
					//删除选中行样式
					$(trthis).removeClass("yt-table-active");
				});
			}
		});
	}
});