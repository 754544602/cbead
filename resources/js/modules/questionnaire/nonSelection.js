/**
 * 非选学班次问卷
 */
var quList = {
	//初始化方法
	init: function() {
		//选中大项code能去选其下边的所有问题
		$('.title-content').on('click','.tab-content .check-all',function(){
			var check=$(this).attr('checked');
			if(check==null){
				$(this).parents(".tab-content").find(' .topic-div label input').setCheckBoxState('uncheck');
			}else{
				$(this).parents(".tab-content").find(' .topic-div label input').setCheckBoxState('check');
			}
			
		});
		//调用获取列表数据方法
		quList.getPlanListInfo();
		var num = "";
		var thisType;
		var width;
		//加载下拉列表
		$('.approval-select').niceSelect();
		//点击问题修改按钮
		$('.title-content').on('click', '.content-update-name', function() {
			width=$('.title-nam-approval.approval-end-text .que-title').width();
			thisType=$(this).parent().parent().find('.quest-type').val();
			console.log('thisType',thisType);
			//给选中的问题修改添加类名
			$('.update-choose').removeClass('update-choose');
			$(this).parent().addClass("update-choose");
			$(this).parent().parent().addClass("update-choose");
			num = 1;
			quList.formClear();
			quList.updateQuewtion();
			quList.showAlert5();
			$('.yt-edit-alert .yt-edit-alert-title .yt-edit-alert-title-msg').text('修改问卷项');
			
		});
		//点击标题修改按钮
		$('.title-content').on('click', '.title-update-name', function() {
			
			var disabled=$(this).parent().find('.title-name-input').attr('disabled');
			if(disabled!=null){
				$(this).find('.modify-big-title').text("保存");
				$(this).parent().find('.title-name-input').addClass('title-input-repair');
				$(this).parent().find('.title-name-input').removeAttr('disabled');
				//$(this).parent().find('.title-name-input').blur(function(){
//					$(this).find('.modify-big-title').text("修改");
//				$(this).parent().find('.title-name-input').removeClass('title-input-repair');
//				$(this).parent().find('.title-name-input').attr('disabled','disabled');
//				});
			}else{
				$(this).find('.modify-big-title').text("修改");
				$(this).parent().find('.title-name-input').removeClass('title-input-repair');
				$(this).parent().find('.title-name-input').attr('disabled','disabled');
			}
		});
		//点击新增问卷
		$('.title-content').on('click', '.approval-add-div', function() {
			num = "";
			$('.select-choose').removeClass('select-choose');
			$(this).addClass("select-choose");
			quList.formClear();
			quList.showAlert5();
			$('.yt-edit-alert .yt-edit-alert-title .yt-edit-alert-title-msg').text('新增问卷项');
		});
		//点击新增选项
		$('.form-bottom-btn').on('click', function() {
			var html = '<div style="margin-left:65px;width: 615px;padding:10px 0px;position: relative;">' +
				'<input class="yt-input delete-icon-input choose-content-input" style="float: none;width:356px;border: 1px solid #DFE6F3 !important;"  placeholder="请输入" validform="{isNull:true,blurFlag:true,msg:\'请输入选项\'}" />' +
				'<span class="valid-font"></span>'+ 
				'<input type="hidden" class="option-id" value="">'+
				'<img style="margin-left: 5px;cursor: pointer;" src="../../resources/images/icons/t-del.png"/>' +
				'</div>';
			$('.form-bottom-btn').before(html);
			//选项失去焦点
			$(this).find('.choose-content-input').blur(function(){
					/** 
			        * 调用验证方法 
			        */  
	      			 $yt_valid.validForm($(".valid-tab")); 
			});
		});
		//		//生成滚动条
		//		$('.form-bottom-content').mCustomSrollbar({
		//			 autoHideScrollbar:true,  
		//          theme:"square"
		//		});
		//点击删除图标
		$('.form-bottom-content').on('click', 'img', function() {

			$(this).parent().remove();
		});
		//点击页面返回按钮
		$('.page-return-btn').on('click', function() {
			location.href = "questionMsg.html";
		});
		//点击页面取消按钮
		$('.approval-canel-bottom').on('click', function() {
			location.href = "questionMsg.html";
		});
		//点击页面底部确定按钮
		$('.approval-submit').on('click', function() {
			quList.submitBtn();
		});
		//点击弹窗里的确定按钮
		$('.form-sure-btn').on('click', function() {
			if(thisType!=5){
				if(num == "") {
					quList.spellHtml(num);
				} else {
					quList.spellHtml(num);
				}
			}else{
				$('.title-nam-approval.approval-end-text.update-choose .que-title').text($('.title-content-input').val());
				width=Number(width);
				$('.title-nam-approval.approval-end-text.update-choose .que-title').css('width','auto');
				var titleWidth=$('.title-nam-approval.approval-end-text.update-choose .que-title').width();
				titleWidth=Number(titleWidth);
				if(titleWidth>width){
					$('.title-nam-approval.approval-end-text.update-choose .que-title').css('top','0px');
				}else{
					$('.title-nam-approval.approval-end-text.update-choose .que-title').css('position','relative');
					$('.title-nam-approval.approval-end-text.update-choose .que-title').css('top','-53px');
				}
				$('.title-nam-approval.approval-end-text.update-choose .que-title').css('width','98px');
				//隐藏弹框
				$(".yt-edit-alert,#heard-nav-bak").hide();
			}
		});
		//点击下拉切换
		$('.approval-select').on('change', function() {
			quList.selectSwitch();
		});
	},
	/**
	 * 点击页面的确定按钮的方法
	 */
	submitBtn: function() {
		var templateData = [];
		var itemsDetailsJson = [];
		var itemDetailsSpecific = [];
		var remarks = "";
		var pkId = $yt_common.GetQueryString("pkId");
		//循环每个大项
		$('.tab-content').each(function(q, e) {
			itemsDetailsJson=[];
			var questionnaireTemplateId = $(e).find('.item-question-id').val(); //主键表ID
			var itemCode = $(e).find('.item-code').val();
			var itemName = $(e).find('.title-name-input').val();
			var itemOrder = $(e).find('.item-order').val();
			var states = $(e).find('div:eq(0)').find('.yt-checkbox.check input').val();
			if(states==null){
				if(itemCode=="rollHead"||itemCode=="other"){
					states=1;
				}else{
					states=0;
				}
			}
			//循环每个大项的问题
			$(e).find('.topic-div').each(function(w, r) {
			itemDetailsSpecific=[];
				var types = $(r).find('.quest-type').val();
				var queStates = $(r).find('.yt-checkbox.check input').val();
				if(queStates==null){
					if(types==5){
						if(itemCode=="other"){
							queStates=0;
						}else{
							queStates=1;
						}
					}else{
						queStates=0;
					}
				}
				var pkId = $(r).find('.quest-pk-id').val();
				if(pkId == null) {
					pkId = "";
				}
				var title = $(r).find('.que-title').text();
				var itemId = $(r).parent().parent().find('.item-pk-id').val();
				//判断类型是否为单选或多选
//				if(types==1||types==4){
//					//itemDetailsSpecific=[];
//					var contentList3={};
//					itemDetailsSpecific.push(contentList3);
//				}
				//循环每个大项的问题的问题选项
				$(r).find('.que-choose').each(function(a, b) {
					var type=$(b).parent().parent().find('.quest-type').val();
					var chooseStates=$(b).parent().parent().find('.yt-checkbox.check input').val();
					if(chooseStates==null){
						if(type==5){
							chooseStates=1;
						}else{
							chooseStates=0;
						}
					}
					
					if(type==5){//类型为固定值的
						var pkId = $(b).parent().find('.option-pk-id').val();
						if(pkId == null) {
							pkId = "";
						}
						var itemDetailsId = $(b).parent().find('.option-item-details-id').val();
						if(itemDetailsId == null) {
							itemDetailsId = "";
						}
						var specificValue = $(b).val();
						if(specificValue == null) {
							specificValue = "";
						}
						var identification ="";
						
					}else if(type==null){//类型为特殊值的
						chooseStates=$(b).parent().find('.yt-checkbox.check input').val();
						if(chooseStates==null){
							chooseStates=0;
						}
						var pkId = $(b).parent().find('.option-pk-id').val();
						if(pkId == null) {
							pkId = "";
						}
						var itemDetailsId = $(b).parent().parent().find('.option-item-details-id').val();
						if(itemDetailsId == null) {
							itemDetailsId = "";
						}
						var specificValue =$(b).val();
						
						var identification = $(b).parent().find('.option-identification').val();
						if(identification == null) {
							identification = "";
						}
						
					}else{//其他类型的
						var pkId = $(b).find('.option-pk-id').val();
						if(pkId == null) {
							pkId = "";
						}
						var itemDetailsId = $(b).parent().parent().find('.quest-pk-id').val();
						if(itemDetailsId == null) {
							itemDetailsId = "";
						}
						var specificValue = $(b).text();
						if(specificValue == null) {
							specificValue = "";
						}
						var identification ="";
					}
					
					//问题的选项的值的map
					var contentList3 = {
						pkId: pkId,
						itemDetailsId: itemDetailsId,
						specificValue: specificValue,
						states: chooseStates,
						identification: identification
					};
					itemDetailsSpecific.push(contentList3);
				});
				
				//问题的map
				var contentList2 = {
					pkId: pkId,
					itemId: itemId,
					types: types,
					title: title,
					states: queStates,
					itemDetailsSpecific: itemDetailsSpecific
				};
				itemsDetailsJson.push(contentList2);
				itemDetailsSpecific = JSON.stringify(itemDetailsSpecific);//问题对应的问题选项的值的List<map>
			});
			itemsDetailsJson = JSON.stringify(itemsDetailsJson);//问题的值的List<map>
			//大项的code的map
			var contentList = {
				questionnaireTemplateId: questionnaireTemplateId,
				itemCode: itemCode,
				itemName: itemName,
				states: states,
				itemOrder: itemOrder,
				remarks: remarks,
				itemsDetailsJson: itemsDetailsJson
			};
			templateData.push(contentList);//最后传给后台的List<map>
		});

		templateData = JSON.stringify(templateData);
		console.log("itemDetailsSpecific",itemDetailsSpecific);
		console.log("itemsDetailsJson",itemsDetailsJson);
		console.log("templateData",templateData);
		//显示页面的loading
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "questionnaire/updateBeanById",
			data: {
				templateData: templateData
			},
			async: true,
			success: function(data) {
				if(data.flag == 0) {
					//隐藏loading
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt("操作成功");
					setTimeout("location.href = 'questionMsg.html';", 1000);
					});
				} else {
					$yt_baseElement.hideLoading(function(){
					$yt_alert_Model.prompt("操作失败");
					});
				}
			}
		});
	},
	/**
	 * 修改问题的方法
	 */
	updateQuewtion: function() {
		$(".yt-edit-alert-main.cont-edit-test.valid-tab tbody tr").eq(0).show();
		var queType = $('.radio-title-approval.update-choose').find('.que-type').text();
		var queTitle = $('.radio-title-approval.update-choose').find('.que-title').text();
		var queChoose = [];
		var chooseId = [];
		$('.radio-title-approval.update-choose').next().find('.que-choose').each(function() {
			var listId = $(this).find('.option-pk-id').val();
			var list = $(this).text();
			queChoose.push(list);
			chooseId.push(listId);
		});
		//类型为单选
		if(queType == "【单选】") {
			$('.choose-tr').show();
			$('.form-bottom-content').show();
			queType = 2;
			$('.approval-select').setSelectVal(queType);
			$('.choose-content-input').val(queChoose[0]);
			$('.option-id').val(chooseId[0]);
			if(queChoose.length >= 2) {
				$('.radio-title-approval.update-choose').next().find('.que-choose').each(function(i, n) {
					if(i > 0) {
						var formHtml = '<div style="margin-left:65px;width: 615px;padding:10px 0px">' +
							'<input class="yt-input delete-icon-input choose-content-input" style="float: none;width:356px"  value="' + $(n).text() + '"/>' +
							'<input type="hidden" class="option-id" value="' + ($(n).find("input").val()) + '">'+
							'<img style="margin-left: 5px;cursor: pointer;" src="../../resources/images/icons/t-del.png"/>' +
							'</div>';
						$('.form-bottom-btn').before(formHtml);
					}
				});

			}
			//类型为评分
		} else if(queType == "【评分】") {
			$('.choose-tr').hide();
			$('.form-bottom-content').hide();
			queType = 1;
			$('.approval-select').setSelectVal(queType);
			//类型为多选
		} else if(queType == "【多选】") {
			$('.choose-tr').show();
			$('.form-bottom-content').show();
			queType = 3;
			$('.approval-select').setSelectVal(queType);
			$('.choose-content-input').val(queChoose[0]);
			if(queChoose.length >= 2) {
				$('.radio-title-approval.update-choose').next().find('.que-choose').each(function(i, n) {
					if(i > 0) {
						var formHtml = '<div style="margin-left:65px;width: 615px;padding:10px 0px">' +
							'<input class="yt-input delete-icon-input choose-content-input" style="float: none;width:356px;"  value="' + $(n).text() + '" />' +
							'<input type="hidden" class="option-id" value="' + ($(n).find("input").val()) + '"><img style="margin-left: 5px;cursor: pointer;" src="../../resources/images/icons/t-del.png"/>' +
							'</div>';
						$('.form-bottom-btn').before(formHtml);
					}else{
						$('.choose-tr .option-id').val($(n).find("input").val())
					}

					
				});
			}
			//类型为开放
		} else if(queType == "【开放】") {
			$('.choose-tr').hide();
			$('.form-bottom-content').hide();
			queType = 4;
			$('.approval-select').setSelectVal(queType);
		}else{
			$(".yt-edit-alert-main.cont-edit-test.valid-tab tbody tr").eq(0).hide();
			queTitle=$('.title-nam-approval.approval-end-text.update-choose .que-title').text();
		}
		$('.title-content-input').val(queTitle);
	},
	/**
	 * 新增弹窗初始化
	 */
	formClear: function() {
		$('.choose-tr').hide();
		$('.form-bottom-content').hide();
		$('.approval-select').setSelectVal(1);
		$('.title-content-input').val("");
		$('.choose-content-input').val("");
		$('.form-bottom-content').find('img').parent().remove();
		$(".valid-font").text("");
	},
	/**
	 * 动态拼写标签
	 */
	spellHtml: function(num) {
		//问题的第一个选项
		var quesOption=$('.valid-tab table .choose-content-input').val();
		//问题的新增选项
		var quesAddOption=$('.valid-tab div .choose-content-input').val();
		var typeName = $('.approval-select').val();
		//下拉列表获取的值
		var titleName = $('.title-content-input').val();
		var chooseName = [];
		var optionId = [];
		//弹窗中的选项的值
		$('.choose-content-input').each(function() {
			var chooseNames = $(this).val();
			if(chooseNames!=""){
				chooseName.push(chooseNames);
			}
			
		});
		$('.options-pk-id').each(function() {
			optionId.push($(this).val());
		});
		var chooseList = $('.delete-icon-input').val();
		var approvalHtml = '';
		var addInfo = $('.add-info.select-choose');
		var updateInfo = $('.topic-div.update-choose');
		//下拉列表获取的值
		if(typeName == 1) {
			typeName = "评分";
			if(num == "") {
				approvalHtml = '<div class="topic-div"><input type="hidden" class="quest-type" value="1"/>' +
					'<label class="check-label yt-checkbox check">' +
					'<input  type="checkbox" name="test" value="1"/>' +
					'</label>' +
					'<div class="radio-title-approval" style="height: 20px;">' +
					'<div  style="display: inline-block;">' +
					'<span class="que-type" style="color: #6495BC;">【' + typeName + '】</span>' +
					'<span class="que-title">' + titleName + '</span>' +
					'</div>' +
					'<span class="content-update-name">' +
					'<img style="margin-right: 2px;"src="../../resources/images/classStudent/wenjuan-modify.png" />修改</span>' +
					'</div>' +
					'</div></div>';
			} else {
				approvalHtml = '<input type="hidden" class="quest-type" value="1"/>' +
					'<label class="check-label yt-checkbox check">' +
					'<input  type="checkbox" name="test" value="1"/>' +
					'</label>' +
					'<div class="radio-title-approval" style="height: 20px;">' +
					'<div  style="display: inline-block;">' +
					'<span class="que-type" style="color: #6495BC;">【' + typeName + '】</span>' +
					'<span class="que-title">' + titleName + '</span>' +
					'</div>' +
					'<span class="content-update-name">' +
					'<img style="margin-right: 2px;"src="../../resources/images/classStudent/wenjuan-modify.png" />修改</span>' +
					'</div>' +
					'</div>';
			}
		} else if(typeName == 2) {
			typeName = "单选";
			if(num == "") {
				approvalHtml = '<div class="topic-div"><input type="hidden" class="quest-type" value="2"/>' +
					'<label class="check-label yt-checkbox check">' +
					'<input  type="checkbox" name="test" value="1"/>' +
					'</label>' +
					'<div class="radio-title-approval" style="height: 20px;">' +
					'<div style="display: inline-block;">' +
					'<span class="que-type" style="color: #6495BC;">【' + typeName + '】</span>' +
					'<span class="que-title">' + titleName + '</span>' +
					'</div>' +
					'<span class="content-update-name">' +
					'<img style="margin-right: 2px;"src="../../resources/images/classStudent/wenjuan-modify.png" />修改</span>' +
					'</div>' +
					'<div class="radio-approval" style="margin-left:85px">';
				//循环问题的问题选项
				$('.choose-content-input').each(function(j, m) {
					approvalHtml += '<p class="que-choose" style="width:fit-content;"><input type="hidden" class="option-pk-id"  value="' + ($(m).parent().find('.option-id').val()) + '"/>' + ($(m).val()) + '</p>';
				});
				
				approvalHtml += '</div></div></div>';
			} else {
				approvalHtml = '<input type="hidden" class="quest-type" value="2"/>' +
					'<label class="check-label yt-checkbox check">' +
					'<input type="checkbox" name="test" value="1"/>' +
					'</label>' +
					'<div class="radio-title-approval" style="height: 20px;">' +
					'<div style="display: inline-block;">' +
					'<span class="que-type" style="color: #6495BC;">【' + typeName + '】</span>' +
					'<span class="que-title">' + titleName + '</span>' +
					'</div>' +
					'<span class="content-update-name">' +
					'<img style="margin-right: 2px;"src="../../resources/images/classStudent/wenjuan-modify.png" />修改</span>' +
					'</div>' +
					'<div class="radio-approval" style="margin-left:85px">';
				//循环问题的问题选项
				$('.choose-content-input').each(function(j, m) {
					approvalHtml += '<p class="que-choose" style="width:fit-content;"><input type="hidden" class="option-pk-id"  value="' + ($(m).parent().find('.option-id').val()) + '"/>' + ($(m).val()) + '</p>';
				});
				
				approvalHtml += '</div></div>';
			}

		} else if(typeName == 3) {
			typeName = "多选";
			if(num == "") {
				approvalHtml = '<div class="topic-div"><input type="hidden" class="quest-type" value="3"/>' +
					'<label class="check-label yt-checkbox check">' +
					'<input  type="checkbox" name="test" value="1"/>' +
					'</label>' +
					'<div class="radio-title-approval" style="height: 20px;">' +
					'<div style="display: inline-block;">' +
					'<span class="que-type" style="color: #6495BC;">【' + typeName + '】</span>' +
					'<span class="que-title">' + titleName + '</span>' +
					'</div>' +
					'<span class="content-update-name">' +
					'<img style="margin-right: 2px;"src="../../resources/images/classStudent/wenjuan-modify.png" />修改</span>' +
					'</div>' +
					'<div class="radio-approval" style="margin-left:85px">';
				//循环问题的问题选项
				$('.choose-content-input').each(function(j, m) {
					approvalHtml += '<p class="que-choose" style="width:fit-content;"><input type="hidden" class="option-pk-id"  value="' + ($(m).parent().find('.option-id').val()) + '"/>' + ($(m).val()) + '</p>';
				});
				approvalHtml += '</div></div></div>';
			} else {
				approvalHtml = '<input type="hidden" class="quest-type" value="3"/>' +
					'<label class="check-label yt-checkbox check">' +
					'<input  type="checkbox" name="test" value="1"/>' +
					'</label>' +
					'<div class="radio-title-approval" style="height: 20px;">' +
					'<div style="display: inline-block;">' +
					'<span class="que-type" style="color: #6495BC;">【' + typeName + '】</span>' +
					'<span class="que-title">' + titleName + '</span>' +
					'</div>' +
					'<span class="content-update-name">' +
					'<img style="margin-right: 2px;"src="../../resources/images/classStudent/wenjuan-modify.png" />修改</span>' +
					'</div>' +
					'<div class="radio-approval" style="margin-left:85px">';
				//循环问题的问题选项
				$('.choose-content-input').each(function(j, m) {
					approvalHtml += '<p class="que-choose" style="width:fit-content;"><input type="hidden" class="option-pk-id"  value="' + ($(m).parent().find('.option-id').val()) + '"/>' + ($(m).val()) + '</p>';
				});
				approvalHtml += '</div></div>';
			}

		} else if(typeName == 4) {
			typeName = "开放";
			if(num == "") {
				approvalHtml = '<div class="topic-div"><input type="hidden" class="quest-type" value="4"/>' +
					'<label class="check-label yt-checkbox check">' +
					'<input type="checkbox" name="test" value="1"/>' +
					'</label>' +
					'<div class="radio-title-approval" style="height: 20px;">' +
					'<div style="display: inline-block;">' +
					'<span class="que-type" style="color: #6495BC;">【' + typeName + '】</span>' +
					'<span class="que-title">' + titleName + '</span>' +
					'</div>' +
					'<span class="content-update-name">' +
					'<img style="margin-right: 2px;"src="../../resources/images/classStudent/wenjuan-modify.png" />修改</span>' +
					'</div>' +
					'</div></div>';
			} else {
				approvalHtml = '<input type="hidden" class="quest-type" value="4"/>' +
					'<label class="check-label yt-checkbox check">' +
					'<input  type="checkbox" name="test" value="1"/>' +
					'</label>' +
					'<div class="radio-title-approval" style="height: 20px;">' +
					'<div style="display: inline-block;">' +
					'<span class="que-type" style="color: #6495BC;">【' + typeName + '】</span>' +
					'<span class="que-title">' + titleName + '</span>' +
					'</div>' +
					'<span class="content-update-name">' +
					'<img style="margin-right: 2px;"src="../../resources/images/classStudent/wenjuan-modify.png" />修改</span>' +
					'</div>' +
					'</div>';
			}

		}
		//判断num是否有值，有则修改，没有则新增
		if(num == "") {
			//判断问题类型是否为单选或多选
			if(typeName=="单选"||typeName=="多选"){
				//判断此类型是否有第一个选项
				if(quesOption!=""){
					//判断此类型是否有两个以上的选项
					if(quesAddOption!=null){
						//判断此选项是否为空
						  if(quesAddOption!=""){
						  	addInfo.before(approvalHtml);
							$(".yt-edit-alert,#heard-nav-bak").hide();
						  }
					}else{
						addInfo.before(approvalHtml);
						$(".yt-edit-alert,#heard-nav-bak").hide();
					}
						
				}else{
					  /** 
				        * 调用验证方法 
				        */  
			         $yt_valid.validForm($(".valid-tab")); 
				}
			}else{
				if(titleName!=""){
					addInfo.before(approvalHtml);
					$(".yt-edit-alert,#heard-nav-bak").hide();
				}else{
					  /** 
				        * 调用验证方法 
				        */  
				       $yt_valid.validForm($(".valid-tab")); 
				}
			}
		} else {
			var questPkId = updateInfo.find('.quest-pk-id').length;
			if(questPkId != 0) {
				updateInfo.find('.quest-pk-id').nextAll().remove();
			} else {
				updateInfo.empty();
			}
			updateInfo.append(approvalHtml);
			$(".yt-edit-alert,#heard-nav-bak").hide();
		}

	},
	/**
	 * 点击下拉切换
	 */
	selectSwitch: function() {
		//判断下拉列表所选的值
		var selectVal = $('.approval-select').val();
		if(selectVal == 1 || selectVal == 4) {
			
			$('.choose-tr').hide();
			$('.form-bottom-content').hide();
		} else {
			$(".valid-font").text("");
			$('.choose-tr').show();
			$('.form-bottom-content').show();
		}
	},
	/**
	 * 弹出框
	 */
	showAlert5: function() {
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$(".yt-edit-alert,#heard-nav-bak").show();
		/** 
		 * 调用算取div显示位置方法 
		 */
		//$yt_alert_Model.setFiexBoxHeight($(".yt-edit-alert .yt-edit-alert-main"));
		$yt_alert_Model.getDivPosition($(".yt-edit-alert"));
		/* 
		 * 调用支持拖拽的方法 
		 */
		$yt_model_drag.modelDragEvent($(".yt-edit-alert .yt-edit-alert-title"));
		/** 
		 * 点击取消方法 
		 */
		$('.yt-edit-alert .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
			//隐藏页面中自定义的表单内容  
			$(".yt-edit-alert,#heard-nav-bak").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
	},
	/**
	 * 获取列表数据详细信息
	 */
	getPlanListInfo: function() {
		var pkId = $yt_common.GetQueryString("pkId");
		var itemVal = "";
		//var inputVal = "";
		//调用显示页面loading方法  
	$yt_baseElement.showLoading();
		$.ajax({
			url: $yt_option.base_path + "questionnaire/getBeanById", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				pkId: pkId
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			async:true,
			success: function(data) {
				if(data.flag == 0) {
					var htmlTbody = $('.title-content');
					var htmlTr = '';
					var formList = [];
					if(data.data.length > 0) {
						//循环大项的名字
						$.each(data.data, function(i, v) {
							//formList = $.parseJSON(v.itemsDetailsJson);
							htmlTr += '<div class="tab-content">' +
								'<input type="hidden" class="item-order" value="' + v.itemOrder + '"/>' +
								'<input type="hidden" class="item-pk-id" value="' + v.pkId + '"/>' +
								'<input type="hidden" class="item-question-id" value="' + v.questionnaireTemplateId + '"/>' +
								'<div style="background:#edebec">'+
								'<div style="height: 40px;position: relative;width:370px;margin-left:50px;">' +
								'<input type="hidden" class="item-code" value="' + v.itemCode + '"/>' +
								'<span style="position: absolute;top:7px;left:-45px;width: 6px;height: 26px;background-color: #de595a;border-radius: 2px;"></span>'+
								'<input style="color:#de595a;position: absolute;top: 5px;left:-35px;background:#edebec;" class="yt-input title-name-input" disabled="disabled" value="' + v.itemName + '"></input>';
								if(v.itemCode!="rollHead"&&v.itemCode!="other"){
									//判断状态是否启用
									if(v.states==0){
										htmlTr+='<label class="check-label yt-checkbox " style="margin-top:10px;">' +
												'<input type="checkbox" name="test" class="check-all" value="1"/>' +
												'</label>';
									}else{
										htmlTr+='<label class="check-label yt-checkbox check" style="margin-top:10px;">' +
												'<input type="checkbox" name="test"  class="check-all" value="1" checked="checked"/>' +
												'</label>';
									}
								htmlTr+='<span class="title-update-name" style="display: inline-block;position: relative;">' +
											'<img style="margin-right: 2px;position: absolute;top: 2px;left: -20px;"src="../../resources/images/icons/amend.png" /><span class="modify-big-title">修改</span>' +
											'</span>';
								}
								//判断是否为授课效果或者是教学活动
								if(v.itemCode!="teachingEffect"&&v.itemCode!="teachingActivites"){
									htmlTr+='</div>' +
											'</div>'+
											'<div class="q-info" style="width: 775px;margin: 0px auto;">' +
											'<div class="tr-add-icon add-info approval-add-div">' +
											'<span style="position: relative;"><img style="position: absolute;top: 2px;left: -17px;" src="../../resources/images/classStudent/wejuan-add.png" /></span><span style="font-size: 14px;">新增问卷项</span>' +
											'</div>' +
											'</div>' +
											'</div>';
								}else{
									htmlTr+='</div>' +
											'</div>'+
											'<div class="q-info" style="width: 775px;margin: 0px auto;height:40px;text-align:center;line-height:40px">根据班级的课程日程自动生成问卷项' +
											'</div>';
								}
							htmlTr = $(htmlTr);
							//授课效果与教学活动内容
							if(v.remarks != "") {
								itemVal = '<div class="radio-title-approval" style="height:30px" >' +
									'<span>' + v.remarks + '</span>' +
									'</div>';
								htmlTr.find(".q-info .add-info").before(itemVal);
							}
							if(v.itemsDetailsJson.length!=0) {//所有问题的JSON
								//循环每一个大项里面的问题
								$.each($.parseJSON(v.itemsDetailsJson), function(j, n) {
									//console.log(n);
									if(n.types == 5) {//类型为固定值
										//给卷尾文本域添加类名
										if(v.itemCode == "other") {
											itemVal = '<div class="topic-div"><div class="title-nam-approval" style="width: 860px;clear: both;margin-left:100px	">' +
											'<input type="hidden" class="quest-pk-id" value="' + n.pkId + '"/>' +
											'<input type="hidden" class="quest-type" value="5"/>' +
											'<input type="hidden" class="quest-item-id" value="' + n.itemId + '"/>';
											var tit=n.title.replace(/\s*/g,"");
											if(tit.length>7){
												console.log('n.title.length',n.title.length);
													itemVal+='<span class="que-title" style="display: inline-block;word-break: break-word;width: 98px;">' + n.title + '</span>' +
															'</div>' +
															'</div>';
												}else{
													itemVal+='<span class="que-title" style="position: relative;top: -53px;display: inline-block;word-break: break-word;width: 98px;">' + n.title + '</span>' +
															'</div>' +
															'</div>';
												}
											htmlTr.find(".q-info .topic-div").eq(0).after(itemVal);//给卷尾添加固定值
											htmlTr.find('.title-nam-approval').addClass('approval-end-text');
											htmlTr.find('.approval-add-div').remove();
											itemVal = $('<div class="radio-approval" style="margin:0px;display:inline-block;"></div>');
											//问题选项JSON
											if(n.itemDetailsSpecific.length!=0) {
												$.each($.parseJSON(n.itemDetailsSpecific), function(a, b) {
													itemVal.append('<input type="hidden" class="option-identification"  value="' + b.identification + '"/><input type="hidden" class="option-pk-id"  value="' + b.pkId + '"/><input type="hidden" class="option-item-details-id"  value="' + b.itemDetailsId + '"/>');
													itemVal.append('<textarea class="yt-textarea approval-textarea que-choose" style="width:522px">' + b.specificValue + '</textarea>');
													//优秀师资推荐添加修改功能
													if(n.states=="0"){
														var re='<label class="check-label yt-checkbox " style="margin-top:13px;">' +
															'<input type="checkbox" name="test" value="1"/>' +
															'</label><span class="content-update-name" style="margin-left: 32px;margin-top: 13px;">' +
															'<img style="margin-right: 2px;"src="../../resources/images/classStudent/wenjuan-modify.png" />修改</span>';
													}else{
														var re='<label class="check-label yt-checkbox check" style="margin-top:13px;">' +
															'<input type="checkbox" name="test" value="1" checked="checked"/>' +
															'</label><span class="content-update-name" style="margin-left: 32px;margin-top: 13px;">' +
															'<img style="margin-right: 2px;"src="../../resources/images/classStudent/wenjuan-modify.png" />修改</span>';
													}
													itemVal.append(re);
												});
											}
											htmlTr.find('.title-nam-approval .que-title').after(itemVal);
										}else{
											itemVal = '<div class="topic-div"><div class="title-nam-approval" style="width: 860px;clear: both;	">' +
												'<input type="hidden" class="quest-pk-id" value="' + n.pkId + '"/>' +
												'<input type="hidden" class="quest-type" value="5"/>' +
												'<input type="hidden" class="quest-item-id" value="' + n.itemId + '"/>' +
												'<span class="que-title" style="position: relative;top: -53px;">' + n.title + '</span>' +
												'</div>' +
												'</div>';
											htmlTr.find(".q-info .add-info").before(itemVal);//给卷首添加固定值

//											console.log('-----------')
//											console.log(htmlTr.find(".q-info .topic-div").length);
											itemVal = $('<div class="radio-approval" style="margin:0px;display:inline-block;"></div>');
											//问题选项JSON
											if(n.itemDetailsSpecific.length!=0) {
												$.each($.parseJSON(n.itemDetailsSpecific), function(a, b) {
													itemVal.append('<input type="hidden" class="option-identification"  value="' + b.identification + '"/><input type="hidden" class="option-pk-id"  value="' + b.pkId + '"/><input type="hidden" class="option-item-details-id"  value="' + b.itemDetailsId + '"/>');
													itemVal.append('<textarea class="yt-textarea approval-textarea que-choose" >' + b.specificValue + '</textarea>');
												});
											}
											htmlTr.find('.title-nam-approval .que-title').after(itemVal);
										}
										
										
										
									} else if(n.types == 2) {//类型是单选
										itemVal = '<div class="topic-div">' +
											'<input type="hidden" class="quest-pk-id" value="' + n.pkId + '"/>' +
											'<input type="hidden" class="quest-type" value="2"/>' +
											'<input type="hidden" class="quest-item-id" value="' + n.itemId + '"/>';
											if(n.states=="0"){
												itemVal+='<label class="check-label yt-checkbox ">' +
													'<input type="checkbox" name="test" value="1"/>' +
													'</label>';
											}else{
												itemVal+='<label class="check-label yt-checkbox check">' +
													'<input type="checkbox" name="test" value="1" checked="checked"/>' +
													'</label>';
											}
										itemVal+='<div class="radio-title-approval" style="height: 20px;">' +
											'<div style="display: inline-block;float: left;">' +
											'<span class="que-type" style="color: #6495BC;">【单选】</span>' +
											'<span class="que-title">' + n.title + '</span>' +
											'</div>' +
											'<span class="content-update-name">' +
											'<img style="margin-right: 2px;"src="../../resources/images/classStudent/wenjuan-modify.png" />修改</span>' +
											'</div>' +
											'</div>';
										htmlTr.find(".q-info .add-info").before(itemVal);
										
										itemVal = $('<div class="radio-approval" style="margin-left:85px"></div>');
										if(n.itemDetailsSpecific.lengh != 0) {
											$.each($.parseJSON(n.itemDetailsSpecific), function(k, m) {
												itemVal.append('<input type="hidden" class="option-identification"  value="' + m.identification + '"/><input type="hidden" class="option-item-details-id"  value="' + m.itemDetailsId + '"/>');
												itemVal.append('<p class="que-choose" style="width:fit-content;"><input type="hidden" class="option-pk-id"  value="' + m.pkId + '"/>' + m.specificValue + '</p>')
												//htmlTr.find('.quest-pk-id').before('<input type="hidden" class="option-pk-id"  value="' + m.pkId + '"/>');
											});
										}
										htmlTr.find(".q-info .add-info").prev().append(itemVal);
										
									} else if(n.types == 1) {//类型为评分
										itemVal = '<div class="topic-div">' +
												'<input type="hidden" class="quest-pk-id" value="' + n.pkId + '"/>' +
												'<input type="hidden" class="quest-type" value="1"/>' +
												'<input type="hidden" class="quest-item-id" value="' + n.itemId + '"/>';
												if(n.states=="0"){
													itemVal+='<label class="check-label yt-checkbox ">' +
														'<input type="checkbox" name="test" value="1"/>' +
														'</label>';
												}else{
													itemVal+='<label class="check-label yt-checkbox check">' +
														'<input type="checkbox" name="test" value="1" checked="checked"/>' +
														'</label>';
												}
										itemVal+='<div class="radio-title-approval" style="height: 20px;">' +
												'<div style="display: inline-block;float: left;">' +
												'<span class="que-type" style="color: #6495BC;">【评分】</span>' +
												'<span class="que-title">' + n.title + '</span>' +
												'</div>' +
												'<span class="content-update-name">' +
												'<img style="margin-right: 2px;"src="../../resources/images/classStudent/wenjuan-modify.png" />修改</span>' +
												'</div>' +
												'</div>';
										htmlTr.find(".q-info .add-info").before(itemVal);
										
									} else if(n.types == 4) {//类型为开放
										itemVal = '<div class="topic-div">' +
											'<input type="hidden" class="quest-pk-id" value="' + n.pkId + '"/>' +
											'<input type="hidden" class="quest-type" value="4"/>' +
											'<input type="hidden" class="quest-item-id" value="' + n.itemId + '"/>';
											if(n.states=="0"){
												itemVal+='<label class="check-label yt-checkbox ">' +
													'<input type="checkbox" name="test" value="1"/>' +
													'</label>';
											}else{
												itemVal+='<label class="check-label yt-checkbox check">' +
													'<input type="checkbox" name="test" value="1" checked="checked"/>' +
													'</label>';
											}
									itemVal+='<div class="radio-title-approval" style="height: 20px;">' +
											'<div style="display: inline-block;float: left;">' +
											'<span class="que-type" style="color: #6495BC;">【开放】</span>' +
											'<span class="que-title">' + n.title + '</span>' +
											'</div>' +
											'<span class="content-update-name">' +
											'<img style="margin-right: 2px;"src="../../resources/images/classStudent/wenjuan-modify.png" />修改</span>' +
											'</div>' +
											'</div>';
										htmlTr.find(".q-info .add-info").before(itemVal);
										
									}else if(n.types == 6) {//类型为特殊处理
										itemVal= '<div class="topic-div">'+
													'<div style="margin-top: 0px;margin-left: 45px;" class="radio-title-approval">' +
													'<input type="hidden" class="quest-pk-id" value="' + n.pkId + '"/>' +
													'<input type="hidden" class="quest-type" value="6"/>' +
													'<input type="hidden" class="quest-item-id" value="' + n.itemId + '"/>' +
													'<div style="display: inline-block;" class="special-key">' +
													'<span class="que-title" style="position: relative;top: 10px;">' + n.title + '</span>' +
													'</div>' +
													 '</div>' +
												 '</div>';
										htmlTr.find(".q-info").append(itemVal);
										itemVal = $('<div class="radio-approval"></div>');
										if(n.itemDetailsSpecific.length!=0) {
											$.each($.parseJSON(n.itemDetailsSpecific), function(k, m) {
												var special='<div style="margin:5px 0px">'+
															'<input type="hidden" class="option-identification"  value="' + m.identification + '"/>'+
															'<input type="hidden" class="option-item-details-id"  value="' + m.itemDetailsId + '"/>';
															if(m.states==0){
															special+='<label style="position: relative;left:-240px;top:6px;" class="check-label yt-checkbox">'+
																	'<input type="checkbox" name="test" value="1"/>'+
																		'</label>';
															}else{
																special+='<label style="position: relative;left:-240px;top:6px;" class="check-label yt-checkbox check">'+
																		'<input type="checkbox" name="test" value="1" checked="checked"/>'+
																		'</label>';
															}
														special+='<input class="yt-input que-choose" style="width:195px;" value="' + m.specificValue + '"/>'+
															'<input type="hidden" class="option-pk-id"  value="' + m.pkId + '"/>'+
															'</div>';
												itemVal.append(special);
											});
										}
										console.log("itemVal",itemVal);
										
										htmlTr.find(".q-info .topic-div .special-key").append(itemVal);
										//itemVal="";
								} else if(n.types == 3) {//类型为多选
										
										itemVal = '<div class="topic-div">' +
											'<input type="hidden" class="quest-pk-id" value="' + n.pkId + '"/>' +
											'<input type="hidden" class="quest-type" value="3"/>' +
											'<input type="hidden" class="quest-item-id" value="' + n.itemId + '"/>';
											if(n.states=="0"){
												itemVal+='<label class="check-label yt-checkbox ">' +
													'<input type="checkbox" name="test" value="1"/>' +
													'</label>';
											}else{
												itemVal+='<label class="check-label yt-checkbox check">' +
													'<input type="checkbox" name="test" value="1" checked="checked"/>' +
													'</label>';
											}
									itemVal+='<div class="radio-title-approval" style="height: 20px;">' +
											'<div style="display: inline-block;float: left;">' +
											'<span class="que-type" style="color: #6495BC;">【多选】</span>' +
											'<span class="que-title">' + n.title + '</span>' +
											'</div>' +
											'<span class="content-update-name">' +
											'<img style="margin-right: 2px;"src="../../resources/images/classStudent/wenjuan-modify.png" />修改</span>' +
											'</div>' +
											'</div>';
										htmlTr.find(".q-info .add-info").before(itemVal);
										itemVal = $('<div class="radio-approval" style="margin-left:85px"></div>');
										//inputVal=$('<input type="hidden" class="quest-pk-id" value="' + n.pkId + '"/>');
										if(n.itemDetailsSpecific != null) {
											$.each($.parseJSON(n.itemDetailsSpecific), function(k, m) {
												itemVal.append('<input type="hidden" class="option-pk-id"  value="' + m.pkId + '"/><input type="hidden" class="option-item-details-id"  value="' + m.itemDetailsId + '"/>');
												itemVal.append('<p class="que-choose" style="width:fit-content;"><input type="hidden" class="option-pk-id"  value="' + m.pkId + '"/>' + m.specificValue + '</p>')
												//htmlTr.find('.quest-pk-id').before('<input type="hidden" class="option-pk-id"  value="' + m.pkId + '"/>');
											});
										}
										htmlTr.find(".q-info .add-info").prev().append(itemVal);

									}
								});
							}

							htmlTbody.append(htmlTr);
						});
					} else {
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="3" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						htmlTbody.append(htmlTr);
					}
					//console.log(formList);
					//隐藏loading
					$yt_baseElement.hideLoading();
				} else {
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt("查询失败");
					});
					
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},

}
$(function() {
	//初始化方法
	quList.init();

});