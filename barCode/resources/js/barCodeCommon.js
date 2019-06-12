var barCodeObj={
	request_params:'',
	/**
		 * 获取流程日志
		 * @param {Object} 
		 */
		getCommentByProcessInstanceId: function(processInstanceId) {
			$.ajax({
				type: "post",
				url: $yt_option.base_path+"basicconfig/workFlow/getWorkFlowLog",
				async: false,
				data: {
					processInstanceId: processInstanceId,
					"CASPARAMS":"OFF_INDEX"
				},
				success: function(data) {
					var txt = '';
					var data = eval('('+data+')');
					if(!!data && data.flag == '0') {
						//数据列表
						var list = data.data || [];
						var imgUrl = "";
						for(var i = 0, len = list.length; i < len; i++) {
							if(i == 0) {
								imgUrl = "../resources/images/common/log-border-color.png";
							} else {
								imgUrl = "../resources/images/common/log-info-border.png";
							}
							//首行
							txt += '<div class="log-info">' +
								(i == list.length - 1 ? '' : '<div class="log-icon-border"></div>') +
								'<div class="log-icon">' +
								'<img src="' + (list.length == 1 ? '../resources/images/common/num-icon-one.png' : (i == 0 ? '../resources/images/common/log-num-first.png' : '../resources/images/common/log-num.png')) + '" />' +
								'<div class="log-icon-num" ' + (i == 0 ? 'style="top: 7px;"' : '') + '>' + (list.length - i) + '<div></div></div>' +
								'</div>' +
								'<div class="log-details ' + (i == 0 ? "log-shadow-sty" : "") + '" ' + ((list[i].comment == undefined || list[i].comment == null || list[i].comment == "") ? 'style="padding-bottom: 30px;"' : '') + '>' +
								'<label class="log-task-name">【'+list[i].taskName+'】</label>'+
								'<label class="log-name">' + list[i].userName + '</label>' +
								'<img style="' + (i == 0 ? "left: -9px;" : "left:-8px;") + '" src="' + imgUrl + '"/>' +
								'<div>' +
								'<p><label class="log-title">操作状态：</label><span class="log-state">' + list[i].operationState + '</span></p>' +
								((list[i].comment == undefined || list[i].comment == null || list[i].comment == "") ? '' : ('<p class="log-ideap"><label class="log-title">操作意见：</label><label class="log-idea">' + list[i].comment + '</label></p>')) +
								'</div>' +
								'</div>' +
								'<label class="log-time">' + list[i].commentTime + '</label>' +
								'</div>';
						}
						$('.flow-div').html(txt);
					} else {
						$(".appr-flow-log").hide();
					}
				}
			});
		},
	/**
	 * 加载区域的页面操作代码
	 * @param {Object} url      页面路径
	 */
	loadingWord: function(url) {
		//判断传输的url路径
		if(url.indexOf("http://") != 0) {
			url = $yt_option.websit_path + url;
		}
		barCodeObj.request_params = new Object();
		//截取url路径
		if(url.indexOf("?") != -1) {
			var str = url.substr(url.indexOf("?") + 1);
			strs = str.split("&");
			for(var i = 0; i < strs.length; i++) {
				barCodeObj.request_params[strs[i].split("=")[0]] = unescape(strs[i].split("=")[1]);
			}
		} else {
			barCodeObj.request_params = null;
		}
		$("#indexMainDiv").html("");
		//走ajax加载页面
		$.ajax({
			type: "get",
			url: url,
			async: false,
			data:{
				"CASPARAMS":"OFF_INDEX"
			},
			success: function(data) {
				$("#indexMainDiv").html(data);
				//替换页面图片地址问题
				$("body img").each(function(){
					$(this).attr("src",$(this).attr("src").replace("../../../../../","../"));
				});
				//替换资源文件路径
				$("body link").each(function(){
					$(this).attr("href",$(this).attr("href").replace("../../../../../","../"));
				});
				$("body script").each(function(){
					$(this).attr("src",$(this).attr("src").replace("../../../../../","../"));
				});
			}
		});
	},
	GetQueryString:function(name){
	     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
	     var r = window.location.search.substr(1).match(reg);
	     if(r!=null)return  unescape(r[2]); return null;
	}
}
/**
 *金额转换成中文大写方法
 * @param {Object} Num 金额数字
 */
function arabiaToChinese(Num) {
	Num = Num+"";
	for(i = Num.length - 1; i >= 0; i--) {
		Num = Num.replace(",", "") //替换tomoney()中的“,”
		Num = Num.replace(" ", "") //替换tomoney()中的空格
	}
	Num = Num.replace("￥", "") //替换掉可能出现的￥字符
	if(isNaN(Num)) { //验证输入的字符是否为数字
		$yt_alert_Model.prompt("请检查小写金额是否正确", 2000);  
		return;
	}
	//---字符处理完毕，开始转换，转换采用前后两部分分别转换---//
	part = String(Num).split(".");
	newchar = "";
	//小数点前进行转化
	for(i = part[0].length - 1; i >= 0; i--) {
		if(part[0].length > 10) { $yt_alert_Model.prompt("位数过大，无法计算", 2000); return ""; } //若数量超过拾亿单位，提示
		tmpnewchar = ""
		perchar = part[0].charAt(i);
		switch(perchar) {
			case "0":
				tmpnewchar = "零" + tmpnewchar;
				break;
			case "1":
				tmpnewchar = "壹" + tmpnewchar;
				break;
			case "2":
				tmpnewchar = "贰" + tmpnewchar;
				break;
			case "3":
				tmpnewchar = "叁" + tmpnewchar;
				break;
			case "4":
				tmpnewchar = "肆" + tmpnewchar;
				break;
			case "5":
				tmpnewchar = "伍" + tmpnewchar;
				break;
			case "6":
				tmpnewchar = "陆" + tmpnewchar;
				break;
			case "7":
				tmpnewchar = "柒" + tmpnewchar;
				break;
			case "8":
				tmpnewchar = "捌" + tmpnewchar;
				break;
			case "9":
				tmpnewchar = "玖" + tmpnewchar;
				break;
		}
		switch(part[0].length - i - 1) {
			case 0:
				tmpnewchar = tmpnewchar + "元";
				break;
			case 1:
				if(perchar != 0) tmpnewchar = tmpnewchar + "拾";
				break;
			case 2:
				if(perchar != 0) tmpnewchar = tmpnewchar + "佰";
				break;
			case 3:
				if(perchar != 0) tmpnewchar = tmpnewchar + "仟";
				break;
			case 4:
				tmpnewchar = tmpnewchar + "万";
				break;
			case 5:
				if(perchar != 0) tmpnewchar = tmpnewchar + "拾";
				break;
			case 6:
				if(perchar != 0) tmpnewchar = tmpnewchar + "佰";
				break;
			case 7:
				if(perchar != 0) tmpnewchar = tmpnewchar + "仟";
				break;
			case 8:
				tmpnewchar = tmpnewchar + "亿";
				break;
			case 9:
				tmpnewchar = tmpnewchar + "拾";
				break;
		}
		newchar = tmpnewchar + newchar;
	}
	//小数点之后进行转化
	if(Num.indexOf(".") != -1) {
		if(part[1].length > 2) {
			$yt_alert_Model.prompt("小数点之后只能保留两位,系统将自动截段", 2000);  
			part[1] = part[1].substr(0, 2)
		}
		for(i = 0; i < part[1].length; i++) {
			tmpnewchar = ""
			perchar = part[1].charAt(i)
			switch(perchar) {
				case "0":
					tmpnewchar = "零" + tmpnewchar;
					break;
				case "1":
					tmpnewchar = "壹" + tmpnewchar;
					break;
				case "2":
					tmpnewchar = "贰" + tmpnewchar;
					break;
				case "3":
					tmpnewchar = "叁" + tmpnewchar;
					break;
				case "4":
					tmpnewchar = "肆" + tmpnewchar;
					break;
				case "5":
					tmpnewchar = "伍" + tmpnewchar;
					break;
				case "6":
					tmpnewchar = "陆" + tmpnewchar;
					break;
				case "7":
					tmpnewchar = "柒" + tmpnewchar;
					break;
				case "8":
					tmpnewchar = "捌" + tmpnewchar;
					break;
				case "9":
					tmpnewchar = "玖" + tmpnewchar;
					break;
			}
			if(i == 0) tmpnewchar = tmpnewchar + "角";
			if(i == 1) tmpnewchar = tmpnewchar + "分";
			newchar = newchar + tmpnewchar;
		}
	}
	//替换所有无用汉字
	while(newchar.search("零零") != -1)
		newchar = newchar.replace("零零", "零");
	newchar = newchar.replace("零亿", "亿");
	newchar = newchar.replace("亿万", "亿");
	newchar = newchar.replace("零万", "万");
	newchar = newchar.replace("零元", "元");
	newchar = newchar.replace("零角", "");
	newchar = newchar.replace("零分", "");
	if(newchar.charAt(newchar.length - 1) == "元" || newchar.charAt(newchar.length - 1) == "角")
		newchar = newchar + "整";
		//处理如果是无内容的给出--
		if(newchar == "元整"){
			newchar = "--";
		}
	//  document.write(newchar);
	return newchar;
};
$.fn.extend({
	showImg: function(obj) {
		var imgId = 'show-img-box' + (parseInt(Math.random() * 1000000000));
		var imgs = $(this);
		imgs.addClass(imgId);
		imgs.off().on("click", function() {
			var ulMl = $("#" + imgId).find("li").width() * imgs.index($(this)) * -1;
			if($("#" + imgId).length > 0) {
				$("#" + imgId).find("ul").css("margin-left", ulMl + "px");
				$("#" + imgId).show();
				$('#pop-modle-alert').show();
			} else {
				var wHeigth = $(window).height();
				var wWidth = $(window).width();
				if(wWidth / wHeigth > 20 / 13) {
					wWidth = Math.floor(wHeigth * 20 / 13 - 200);
				} else {
					wWidth = wWidth - 100;
				}
				var bannerWidth = Math.floor(wWidth * 0.8);
				var hannerHeight = Math.floor(bannerWidth * 13 / 20);

				var imgsElement = $('<div id="' + imgId + '" class="show-img-box"><a class="prev"></a><a class="next"></a></div>');

				$("body").append(imgsElement);

				var closeElement = $('<a class="close-btn" src="img/icons/atta-x.png"></a>');
				var imgBox = $('<div class="imgs-list"></div>');
				imgBox.css({
					width: bannerWidth,
					height: hannerHeight
				});
				closeElement.click(function() {
					$("#" + imgId).hide();
					$('#pop-modle-alert').hide();
				});
				imgsElement.append(closeElement).append(imgBox);
				var imgListEle = $('<ul style="width: ' + ($("." + imgId).length * bannerWidth) + 'px;"></ul>');
				imgListEle.css("margin-left", ulMl + "px");
				$("." + imgId).each(function() {
					var img = new Image();
					var imgLi = $('<li></li>').append(img);
					imgLi.css({
						width: bannerWidth,
						height: hannerHeight
					});
					//img.style='width:'+bannerWidth+'px;';
					img.draggable = false;
					img.src = $(this).attr('src');
					img.name = 'viewImg';
					var meImg = imgLi.find("img");
					img.onload = function() {
						if(img.width / img.height > 20 / 13) {
							$(meImg).css("width", "100%");
						} else {
							$(meImg).css("height", "100%");
						}
					};
					imgListEle.append(imgLi);
				});
				imgBox.append(imgListEle);
				ulMl = imgsElement.find("li").width() * imgs.index($(this)) * -1;
				imgsElement.find("ul").css("margin-left", ulMl + "px");
				imgsElement.find(".next").click(function() {
					$(this).siblings(".imgs-list").find("ul").stop(true, true);
					var bannerWidth = $(this).siblings(".imgs-list").find("li").width();
					var bannerUlWidth = $(this).siblings(".imgs-list").find("ul").width();
					var ulLeft = $(this).siblings(".imgs-list").find("ul").css("margin-left");
					var nextUlLeft = parseInt(ulLeft.replace("px", "").replace("PX", "")) - bannerWidth;

					if(nextUlLeft > bannerUlWidth * -1) {
						$(this).siblings(".imgs-list").find("ul").animate({
							marginLeft: nextUlLeft
						}, 500, function() {/*
							$("#" + imgId).find("li img").css({
								'width': 'auto',
								'height': 'auto',
								'left': 0,
								'right': 0,
								'top': 0,
								'bottom': 0
							});

						*/});
						/*	$(".banner-main .tb-btn a.active").next().addClass("active");
							$(".banner-main .tb-btn a.active:eq(0)").removeClass("active");*/
					}

				});
				imgsElement.find(".prev").click(function() {
					$(this).siblings(".imgs-list").find("ul").stop(true, true);
					var bannerWidth = $(this).siblings(".imgs-list").find("li").width();
					var ulLeft = $(this).siblings(".imgs-list").find("ul").css("margin-left");

					var nextUlLeft = parseInt(ulLeft.replace("px", "").replace("PX", "")) + bannerWidth;
					console.log(nextUlLeft);
					if(nextUlLeft <= 10) {
						$(this).siblings(".imgs-list").find("ul").animate({
							marginLeft: nextUlLeft
						}, 500, function() {/*
							$("#" + imgId).find("li img").css({
								'width': 'auto',
								'height': 'auto',
								'left': 0,
								'right': 0,
								'top': 0,
								'bottom': 0
							});

						*/});
						/*$(".banner-main .tb-btn a.active").prev().addClass("active");
						$(".banner-main .tb-btn a.active:eq(1)").removeClass("active");*/
					}
				});
				imgsElement.show();
				$('#pop-modle-alert').show();
			}
			//$("#" + imgId).find("li img").zoomMarker();
		});
	}
});
