var groupTubeList = {
	//初始化方法
	init: function() {
		//加载下拉列表
		$('.province-select').niceSelect();
		$('.merge-province-select').niceSelect();
		$('.company-types-select').niceSelect();
		$('.classify-select').niceSelect();
		$('.group-type-select').niceSelect();
		$('.group-merge-type-select').niceSelect();
		$('.company-merge-types-select').niceSelect();
//		$('.belong-group-merge').niceSelect();
		$('.belong-org').niceSelect();
		var pkId = "";

		//点击合并按钮
		$('.merge-btn').on('click', function() {
			groupTubeList.getAllGroup();
			var checkLength = $("input[name='groupCheck']:checked").length;
			var classify = $("input[name='groupCheck']:checked").attr("rowType");
			//1为集团2为单位
			if(classify == 1) {
				$('.yt-edit-alert-title-msg').text("集团合并");
				$('.merge-name-text').text("集团名称：");
				$('.merge-form-img').attr('src','../../resources/images/classStudent/merge-tip.png')
				$('.company-merge-part').hide();
				$('.group-merge-part').show();
				groupTubeList.maxNumber(1);
			} else if(classify == 2) {
				$('.yt-edit-alert-title-msg').text("单位合并");
				$('.merge-form-img').attr('src','../../resources/images/classStudent/merge-tiporg.png')
				$('.merge-name-text').text("单位名称：");
				$('.company-merge-part').show();
				$('.group-merge-part').hide();
			}
			$('.merge-org-tr').hide();
			$('.merge-table tbody').empty()
			//初始化弹窗合并列表
			$.each($("input[name='groupCheck']:checked"), function(i,n) {
				$('.merge-table tbody').append('<tr><td>'+(i+1)+'</td><td>'+$(n).parents('span').text()+'</td></tr>');
			});
			//初始化弹窗
			groupTubeList.initForm();
			//加载选中的下拉列表
			groupTubeList.mergeFormListData();
			//加载省份下拉列表
			groupTubeList.provinceSelectData();
			//显示弹窗
			if(checkLength > 1) {
				groupTubeList.showAlert6();
			} else {
				$yt_alert_Model.prompt("合并请最少选中两行");
			}

		});
		//点击查询按钮
		$('.search-btn').on('click', function() {
			var groupName = $('#keyword').val();
			$('.table-page .num-text.change-btn.active').text(1);
			groupTubeList.getGroupList(10);
		});
		//点击新增
		$(".addList").on('click', function() {
			$('.yt-edit-alert-title-msg').text("新增集团");
			groupTubeList.initForm();
			$('.classify-select').setSelectVal('1');
			$('.company-part').hide();
			$('.group-part').show();
			$('.modifiable-name').text("集团名称：");
			$('.valid-hint').removeClass('valid-hint')
			groupTubeList.showAlert5();
			pkId='';
			$('div.classify-select').show();
			$('.classify-select').siblings('span').hide();
			groupTubeList.getAllGroup();
			groupTubeList.maxNumber();
		});
		//点击修改
		$(".updateList").on('click', function() {
			groupTubeList.getAllGroup();
			groupTubeList.initForm();
			$(".valid-font").text("");
			$('.valid-hint').removeClass('valid-hint');
			pkId = $("input[name='groupCheck']:checked").val();
			//选中的个数
			var checkLength = $("input[name='groupCheck']:checked").length;
			if(checkLength == 1) {
				groupTubeList.showAlert5();
				$('.classify-select').setSelectVal($("input[name='groupCheck']:checked").attr("rowType"));
				if($('.classify-select').siblings('span')[0]==undefined){
					$('.classify-select').parents('td').append('<span>'+$('.classify-select option:selected').text()+'</span>');
				}else{
					$('.classify-select').siblings('span').text($('.classify-select option:selected').text());
				}
				$('.classify-select').hide()
				groupTubeList.clickClassific();
				$('.province-select').setSelectVal($("input[name='groupCheck']:checked").attr("province"));
				$('.group-name').val($("input[name='groupCheck']:checked").attr("groupName"));
				$('.group-type-select').setSelectVal($("input[name='groupCheck']:checked").attr("groupType"));
				$('.company-types-select').setSelectVal($("input[name='groupCheck']:checked").attr("types"));
				$('.group-num').val($("input[name='groupCheck']:checked").attr("groupNum"));
				$('.remarks-textarea').val($("input[name='groupCheck']:checked").attr("remarks"));
				//三级单位
				if($("input[name='groupCheck']:checked").attr("types")=='3'){
						$('.belong-org-tr').show();
						$('.belong-group').val($("input[name='groupCheck']:checked").attr("groupurl").split(',')[1]);
						$('.belong-group-name').val($("input[name='groupCheck']:checked").attr("parentName"));
						groupTubeList.getBelongGroup($('.belong-group').val(),$('select.belong-org'));
						$('.belong-org').setSelectVal($("input[name='groupCheck']:checked").attr("parentId"));
				}else{
					$('.belong-group-name').val($("input[name='groupCheck']:checked").attr("parentName"));
					$('.belong-group').val($("input[name='groupCheck']:checked").attr("parentId"));
				}
				var classify = $("input[name='groupCheck']:checked").attr("rowType");
				if(classify==1){
					$('.yt-edit-alert-title-msg').eq(0).text("修改集团");
				}else if(classify==2){
					$('.yt-edit-alert-title-msg').eq(0).text("修改单位");
				}
			} else {
				$yt_alert_Model.prompt("请选中一行进行修改");
			}
		});
		//点击删除
		$('.delete-btn').click(function(){
			var pkId = [];
			if($('#tt').treegrid('getSelected')==null){
				$yt_alert_Model.prompt('请至少选中一行进行删除')
				return false;
			}else{
				$.each($("input[name='groupCheck']:checked"), function(j,k) {
					pkId.push($(k).val())
					$.each($('#tt').treegrid('getChildren',$(k).val()), function(i,n) {
					pkId.push(n.pkId)
				});
				});
				
			}
			pkId = pkId.join(',');
			$yt_alert_Model.alertOne({  
		        haveAlertIcon: true,  
		        alertMsg: "其下属单位也会被删除，是否删除该数据？",  
		        confirmFunction: function() {  
					groupTubeList.deleteGroup(pkId);
		        },  
		    });  
		})
		$('select.province-select,select.group-type-select,.belong-org').change(function(){
			if($(this).val()!=''){
				$(this).siblings(".valid-font").text("");
				$(this).parents('td').find('.valid-hint').removeClass('valid-hint');
			}
		})
//		$('.belong-group').change(function(){
//			if($(this).val()!=''){
//				$(this).siblings(".valid-font").text("");
//				$(this).parents('td').find('.valid-hint').removeClass('valid-hint');
//			}
//			groupTubeList.getBelongGroup($(this).val(),$('select.belong-org'));
//		})
		$('.company-types-select').change(function(){
			groupTubeList.maxNumber();
			if($(this).val()!=''){
				$(this).siblings(".valid-font").text("");
				$(this).parents('td').find('.valid-hint').removeClass('valid-hint');
			}
			if($(this).val()==3){
				$('.belong-org-tr').show();
				groupTubeList.getBelongGroup($('.belong-group').val(),$('select.belong-org'));
			}else{
				$('.belong-org-tr').hide();
			}
		})
//		$('.belong-group-merge').change(function(){
//			if($(this).val()!=''){
//				$(this).siblings(".valid-font").text("");
//				$(this).parents('td').find('.valid-hint').removeClass('valid-hint');
//			}
//			groupTubeList.getBelongGroup($(this).val(),$('select.merge-org'));
//		})
		//合并单位类型
		$('.company-merge-types-select').change(function(){
			if($(this).val()!=''){
				$(this).siblings(".valid-font").text("");
				$(this).parents('td').find('.valid-hint').removeClass('valid-hint');
			}
			if($(this).val()==3){
				$('.merge-org-tr').show();
				groupTubeList.getBelongGroup($('.belong-group-merge').val(),$('select.merge-org'));
			}else{
				$('.merge-org-tr').hide();
			}
			groupTubeList.maxNumber(2);
		})
		//点击弹窗的确定按钮
		$('.group-submit-btn').on('click', function() {
				var classify = $('.classify-select').val();
			if($yt_valid.validForm($(".valid-table tr:visible"))){
				//根据pkId如果为空则新增，否则修改
				if(pkId == "") {
					groupTubeList.addGroupData('');
				} else {
					
					var types = $("input[name='groupCheck']:checked").attr('types');
					//二级单位转换三级单位时如果有三级单位，则不可修改
					if(types==2&&$('.belong-org-tr').is(':visible')){
						if($('#tt').treegrid('getChildren',$("input[name='groupCheck']:checked").val()).length!=0){
							$yt_alert_Model.prompt('该单位有下属单位，无法修改')						
						}else{
							groupTubeList.addGroupData(pkId,$('num-text.change-btn.active').text());
						}
					}else{
						groupTubeList.addGroupData(pkId,$('num-text.change-btn.active').text());
					}
					
				}
			}
			

		});
		//点击合并弹窗的确定按钮
		$('.merge-submit-btn').on('click', function() {
			if($yt_valid.validForm($(".valid-table2 td:visible"))){
			//判断选中的类型，1为集团，2为单位
			var classify = $("input[name='groupCheck']:checked").attr("rowType");
			if(classify == 1) {
				//集团合并方法
				groupTubeList.groupMerge();
			} else {
				//单位合并方法
				var bool = true
				$.each($("input[name='groupCheck']:checked"), function(i,n) {
					if($('#tt').treegrid('getChildren',$(n).val()).length!=0){
						bool=false
					}
				});
				var types = $("input[name='groupCheck']:checked").attr('types');
				if(types==2&&$('.merge-org-tr').is(':visible')){
					if(bool){
						groupTubeList.companyMerge();
					}else{
						$yt_alert_Model.prompt('该单位有下属单位，无法合并')
					}
				}else{
					groupTubeList.companyMerge();
				}
			}
			}
		});
		//点击分类下拉切换
		
		$('.classify-select').change(function() {
			groupTubeList.clickClassific();
			if($(this).val()==1){
				groupTubeList.maxNumber();
			}
		});
		//查询列表
		groupTubeList.getGroupList(10);
		//获取所属集团
		//groupTubeList.getBelongGroup();
		//点击弹窗的分类显示不一样的内容
		groupTubeList.clickClassific();
	},
	
	/**
	 * 合并弹窗的查询列表
	 */
	mergeFormListData: function() {
		$('.list-table tbody tr').remove();
		var groupList = [];
		$("input[name='groupCheck']:checked").each(function() {
			groupList.push($(this).attr("groupName"));
		});
		for(var a = 0; a < groupList.length; a++) {
			var num = a + 1;
			$('.list-table tbody ').append('<tr><td>' + num + '</td><td>' + groupList[a] + '</td></tr>');
		}
	},
	/**
	 * 集团合并方法
	 */
	groupMerge: function() {
		//pkId
		var groupMergeId = "";
		$("input[name='groupCheck']:checked").each(function() {
			if(groupMergeId == "") {
				groupMergeId += $(this).val();
			} else {
				groupMergeId += ',' + $(this).val();
			}
		});
		var parentId = 0;
		var classify = 1;
		var groupName = $('.merge-name').val();
		var province = $('.merge-province-select').val();
		var groupType = $('.group-merge-type-select').val();
		var groupNum = $('.merge-group-num').val();
		var remarks = $('.merge-remarks').val();
		//显示loading
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "group/addGroupMerge",
			data: {
				groupMergeId: groupMergeId,
				classify: classify,
				groupName: groupName,
				parentId: parentId,
				province: province,
				groupType: groupType,
				groupNum: groupNum,
				remarks: remarks
			},
			async: true,
			success: function(data) {
				if(data.flag == 0) {
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt("合并成功");
					groupTubeList.getGroupList(10);
					$(".merge-form,#heard-nav-bak").hide();
					});
				} else {
					$yt_baseElement.hideLoading(function(){
					$yt_alert_Model.prompt("合并失败");
					});
				}
			}
		});
	},
	/**
	 * 单位合并方法
	 */
	companyMerge: function() {
		var groupMergeId = "";
		$("input[name='groupCheck']:checked").each(function() {
			if(groupMergeId == "") {
				groupMergeId += $(this).val();
			} else {
				groupMergeId += ',' + $(this).val();
			}

		});
		var parentId
		if($('.merge-org-tr').is(':visible')){
			parentId=$(".merge-org").val();
		}else{
			parentId=$(".belong-group-merge").val();
		}
		var classify = 2;
		var groupName = $('.merge-name').val();
		var province = $('.merge-province-select').val();
		var types = $('.company-merge-types-select').val();
		var groupNum = $('.merge-group-num').val();
		var remarks = $('.merge-remarks').val();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "group/addOrgMerge",
			data: {
				groupMergeId: groupMergeId,
				classify: classify,
				groupName: groupName,
				parentId: parentId,
				province: province,
				types: types,
				groupNum: groupNum,
				remarks: remarks
			},
			async: true,
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt("合并成功");
					groupTubeList.getGroupList(10);
					$(".merge-form,#heard-nav-bak").hide();
				} else {
					$yt_alert_Model.prompt("合并失败");
				}
			}
		});
	},
	/**
	 * 初始化弹窗
	 */
	initForm: function() {
		//新增弹窗初始化
		$(".valid-font").text("");
		$('.belongs-group').hide();
		$('.classify-select').setSelectVal("");
		$('.belong-group').val("");
		$('.belong-group-name').val("");
		$('.group-name').val("");
		$('.province-select').val("");
		$('.group-type-select').setSelectVal("");
		$('.company-types-select').setSelectVal("");
		$('.group-num').val("");
		$('.remarks-textarea').val("");
		//合并弹窗的初始化
		$('.merge-name').val("");
		$('.merge-province-select').setSelectVal("");
		$('.group-merge-type-select').setSelectVal("");
		$('.company-merge-types-select').setSelectVal("");
		$('.merge-group-num').val("");
		$('.merge-remarks').val("");
		$('select.belong-org').empty();		
		$('select.belong-org').append('<option value="">请选择</option>');
		$('select.belong-org').niceSelect();
	},
	/**
	 * 获取所属集团
	 */
	getBelongGroup: function(groupId,node) {
		if(groupId!=''){
		//		显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/group/getGroups",
			data: {
				isSelectGroup: 3,
				groupId:groupId
			},
			async: false,
			success: function(data) {
				if(data.flag == 0) {
					$(node).empty();		
					$(node).append('<option value="">请选择</option>');
					if(groupId!=''){
						var array = [] ;
						if($('.add-update-form .yt-edit-alert-title-msg').text()!='新增单位')
						$.each($("input[name='groupCheck']:checked"), function(i,n) {
							array.push(Number($(n).val()))
						});
						array = array.join(',')
						console.log(array)
						$.each(data.data, function(t, y) {
						if(y.types == '央企二级公司') {
							console.log(','+array+',',y.groupId,(','+array+',').indexOf(y.groupId)==-1)
							if((','+array+',').indexOf(y.groupId)==-1){
								$(node).append('<option value="' + y.groupId + '">' + y.groupName + '</option>');
							}
						}
						});
					}
					$(node).niceSelect({  
					        search: true,  
					        backFunction: function(text) {  
					            //回调方法,可以执行模糊查询,也可自行添加操作  
					            $(node).find('option').remove();  
					            if(text == "") {  
					                $(node).append('<option value="">请选择</option>');  
					            }  
					            //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
					            $.each(data.data, function(i, n) {  
					                if(n.groupName.indexOf(text) != -1) { 
										if(n.types == '央企二级公司'&&groupId!='') {
											if((','+array+',').indexOf(n.groupId)==-1){
						                    	$(node).append('<option value="' + n.groupId + '">' + n.groupName + '</option>');  
						                   	}
						           		 }    
									}
					            });  
					        }  
					    });
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading();
				}
			},
			error:function(){
				$yt_baseElement.hideLoading(function(){
					$yt_alert_Model.prompt('网络异常，查询失败')
				});
			}
		});	
		}
	},
	/**
	 * 点击新增分类显示不一样的内容
	 */
	clickClassific: function() {
		var classify = $('.classify-select').val();
		//集团公司
		if(classify == 1) {
			$('.modifiable-name').text("集团名称：");
			$('.yt-edit-alert-title-msg').text("新增集团");
			$('.company-part').hide();
			$('.group-part').show();
			$('.belong-group').val("");
			$('.belong-group-name').val("");
			$('.company-types-select').setSelectVal("");
		} else if(classify == 2) {
			//下属单位
			$('.group-type-select').setSelectVal("");
			$('.yt-edit-alert-title-msg').text("新增单位");
			$('.modifiable-name').text("单位名称：");
			$('.company-part').show();
			$('.belong-org-tr').hide();
			$('.group-part').hide();
		}
	},
	/**
	 * 新增数据
	 */
	addGroupData: function(pkId,num) {
		var parentId
		if($('.belong-org-tr').is(':visible')){
			parentId=$(".belong-org").val();
		}else{
			if($('.belong-group-name').is(':visible')){
				parentId=$(".belong-group").val();
			}else{
				parentId=0;
			}
		}
		var classify = $('.classify-select').val();
		var groupName = $('.group-name').val();
		var province = $('.province-select').val();
		var groupType = $('.group-type-select').val();
		var types = $('.company-types-select').val();
		var groupNum = $('.group-num').val();
		var remarks = $('.remarks-textarea').val();
		if(pkId!=''){
			var groupId = $("input[name='groupCheck']:checked").attr('groupId');
		}else{
			var groupId ='';
		}
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "group/addOrUpdate",
			data: {
				pkId: pkId,
				classify: classify,
				groupName: groupName,
				parentId: parentId,
				province: province,
				groupType: groupType,
				types: types,
				groupNum: groupNum,
				remarks: remarks,
				groupId:groupId
			},
			async: true,
			success: function(data) {
				typeof(data)=='string'?data=JSON.parse(data):'';
				if(data.flag == 0) {
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt("提交成功");
					$(".yt-edit-alert,#heard-nav-bak").hide();
					groupTubeList.getGroupList(10,num);
					});
				} else {
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt(data.message);
					});
				}
			},
			error:function(){
				$yt_baseElement.hideLoading(function(){
					$yt_alert_Model.prompt("网络异常，提交失败");
				});
			}
		});
	},
	/**
	 * 获取省份
	 */
	getProvince: function() {
		var provinceList = [];
		$.ajax({
			type: "get",
			url: $yt_option.base_path + "website/resources/js/modules/groupTube/province.json",
			async: false,
			success: function(data) {
				provinceList = data || [];
			}
		});
		return provinceList;
	},
	/**
	 * 省份下拉列表添加数据
	 */
	provinceSelectData: function() {
		var province = groupTubeList.getProvince();
		$('.province-select').empty();
		$('.merge-province-select').empty();
		$('.province-select').append(' <option value="">请选择</option>');
			$('.merge-province-select').append(' <option value="">请选择</option>');
		$.each(province, function(i, t) {
			$('.province-select').append(' <option value="' + t.text + '">' + t.text + '</option>');
			$('.merge-province-select').append(' <option value="' + t.text + '">' + t.text + '</option>');
		});
		//初始化下拉列表
		$('.province-select').niceSelect();
		$('.merge-province-select').niceSelect();
	},
	/**
	 * 新增、修改弹出框
	 */
	showAlert5: function() {
		var me = this;
//		$('select.belong-group').empty();
//		 $.each(me.groupList, function(i, n) {  
//				$("select.belong-group").append('<option value="' + n.pkId + '" types=3 >' + n.groupName + '</option>');
//      });
//		$('select.belong-group').niceSelect({
//			search: true,
//			backFunction: function(text) {  
//	            //回调方法,可以执行模糊查询,也可自行添加操作  
//	            $("select.belong-group option").remove();  
//	            if(text == "") {  
//	                $("select.belong-group").append('<option value="">请选择</option>');  
//	            }
//	         	//遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
//	            $.each(me.groupList, function(i, n) {  
//	                if(n.groupName.indexOf(text) != -1) {
//							$("select.belong-group").append('<option value="' + n.pkId + '" types=3 >' + n.groupName + '</option>');
//              	}
//	            });
//         	}
//		 });
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$(".add-update-form,#heard-nav-bak").show();
		//加载省份
		groupTubeList.provinceSelectData();
		/** 
		 * 调用算取div显示位置方法 
		 */
		$yt_alert_Model.getDivPosition($(".add-update-form"));
		/* 
		 * 调用支持拖拽的方法 
		 */
		$yt_model_drag.modelDragEvent($(".add-update-form .yt-edit-alert-title"));
		/** 
		 * 点击取消方法 
		 */
		$('.add-update-form .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
			//隐藏页面中自定义的表单内容  
			$(".add-update-form,#heard-nav-bak").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
	},
	/**
	 * 合并弹出框
	 */
	showAlert6: function() {
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$(".merge-form,#heard-nav-bak").show();
		/** 
		 * 调用算取div显示位置方法 
		 */
		$yt_alert_Model.getDivPosition($(".merge-form"));
		$yt_alert_Model.setFiexBoxHeight($(".merge-form .yt-edit-alert-main"));
		/* 
		 * 调用支持拖拽的方法 
		 */
		$yt_model_drag.modelDragEvent($(".merge-form .yt-edit-alert-title"));
		/** 
		 * 点击取消方法 
		 */
		$('.merge-form .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
			//隐藏页面中自定义的表单内容  
			$(".merge-form,#heard-nav-bak").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
	},
	/*
	 查询所有集团
	 * */
	getAllGroup:function(){
		$('.belong-group-name').off().click(function(){
			$('.receive-group-search').val('');
			$('.add-update-form').hide();
			groupTubeList.getGroupAlertList($(this),$(this).siblings('.belong-group'),sureBack,canelBack);
			function sureBack(){
				$('.add-update-form').show();
				if($('.belong-group-name').val()!=''){
					$('.belong-group-name').siblings(".valid-font").text("");
					$('.belong-group-name').parents('td').find('.valid-hint').removeClass('valid-hint');
				}
				groupTubeList.getBelongGroup($('.belong-group').val(),$('select.belong-org'));
			}
			function canelBack(){
				$('.add-update-form').show();
				$('#pop-modle-alert').show();
			}
		})
		$('.belong-group-merge-name').off().click(function(){
			$('.receive-group-search').val('');
			$('.merge-form').hide();
			groupTubeList.getGroupAlertList($(this),$(this).siblings('.belong-group-merge'),sureBack,canelBack);
			function sureBack(){
				$('.merge-form').show();
				groupTubeList.getBelongGroup($(this).val(),$('.belong-group-merge'));
			}
			function canelBack(){
				$('.merge-form').show();
				$('#pop-modle-alert').show();
			}
		})
		
		
		var me = this;
//		$.ajax({
//			type:"post",
//			url:$yt_option.base_path+"uniform/group/getGroups",
//			async:false,
//			data:{
//				isSelectGroup: 1
//			},
//			success:function(data){
//				if(data.flag==0){
//					$('.belong-group-merge option:gt(0)').remove();
//					$('.belong-group option:gt(0)').remove();
//	                $("select.belong-group").append('<option value="">请选择</option>');  
//	                $("select.belong-group-merge").append('<option value="">请选择</option>');  
//					$.each(data.data, function(t, y) {
//							$('select.belong-group').append('<option value="' + y.groupId + '" types=3>' + y.groupName + '</option>');
//							$('.belong-group-merge').append('<option value="' + y.groupId + '">' + y.groupName + '</option>');
//					});
//					me.groupList =data.data;
//					$('select.belong-group').niceSelect({
//						search: true,
//						backFunction: function(text) {  
//					            //回调方法,可以执行模糊查询,也可自行添加操作  
//					            $("select.belong-group option").remove();  
//					            if(text == "") {  
//					                $("select.belong-group").append('<option value="">请选择</option>');  
//					            }
//					          //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
//					            $.each(me.groupList, function(i, n) {  
//					                if(n.groupName.indexOf(text) != -1) {
//										$("select.belong-group").append('<option value="' + n.groupId + '" types=3 >' + n.groupName + '</option>');
//					                	}
//					            });
//					           }
//					 });
//					$('.belong-group-merge').niceSelect({
//						search: true,
//						backFunction: function(text) {  
//					            //回调方法,可以执行模糊查询,也可自行添加操作  
//					            $("select.belong-group-merge option").remove();  
//					            if(text == "") {  
//					                $("select.belong-group-merge").append('<option value="">请选择</option>');  
//					            }
//					          //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
//					            $.each(me.groupList, function(i, n) {  
//					                if(n.groupName.indexOf(text) != -1) {
//										$("select.belong-group-merge").append('<option value="' + n.groupId + '">' + n.groupName + '</option>');
//					                	}
//					            });
//					           }
//					 });
//				}
//			}
//		});
	},
	//获取最大排序
	maxNumber:function(merge){
		var classify,types;
		if(merge){
			if(merge==1){
				classify=1;
				types='';
			}else{
				classify=2;
				types=$('.company-merge-types-select').val();
			}
		}else{
			classify = $('.classify-select').val();
			types = $('.company-types-select').val();
			classify==1?types='':'';
		}
		$.ajax({
			type:"post",
			url:"group/getGroupNumMax",
			async:true,
			data:{
				classify:classify,
				types:types
			},
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			success:function(data){
				$yt_baseElement.hideLoading();
				if(data.flag==0){
					if(merge){
						$('.merge-group-num').val(data.data.groupNum);
					}else{
						$('.group-num').val(data.data.groupNum);
					}
				}
			}
		});
	},
	/*inputval：当前input
	 * inputId：存idinput
	 * faceBack：回调函数
	 */
	//获取集团列表
	getGroupAlertList:function(inputval,inputId,sureBack,canelBack){
		$('.receive-group-div-span').text("选择集团")
		function listData(){
			$('.receive-group-page').pageInfo({
			type:"post",
			url:$yt_option.base_path+"class/noticeReception/getGroups",
			async:true,
			pageIndexs: 1,
			pageNum: 15, //每页显示条数  
			before:function(){
				$yt_baseElement.showLoading();
			},
			data:{
				groupName:$('.receive-group-search').val(),
				types:1
			},
			success:function(data){
				$yt_baseElement.hideLoading();
				if(data.flag==0){
					var tr = '';
					$('.receive-group-tbody').empty();
					$.each(data.data.rows,function(i,n){
						tr = '<tr><td groupId="'+n.groupId+'">'+n.groupName+'</td></tr>';
						$('.receive-group-tbody').append(tr);
					})
					/** 
				 * 调用算取div显示位置方法 
				 */
				$(".receive-group-div").show();
				$yt_alert_Model.setFiexBoxHeight($(".receive-group-div .yt-edit-alert-main"));
				$yt_alert_Model.getDivPosition($(".receive-group-div"));
				$yt_model_drag.modelDragEvent($(".receive-group-div .yt-edit-alert-title"));
				}else{
					$yt_alert_Model.prompt('查询失败')
				}
			},
			error:function(){
				$yt_baseElement.hideLoading();
				$yt_alert_Model.prompt('查询失败')
			},
			isSelPageNum: false //是否显示选择条数列表默认false  
		});
		}
		listData();
		$('.receive-group-canel-btn').off().click(function(){
				$('.receive-group-div').hide();
				canelBack();
		})
		$('.receive-group-sure-btn').off().click(function(){
			if($('.receive-group-div .yt-table-active')[0]){
					$(inputId).val($('.receive-group-div .yt-table-active td').attr('groupId'));
					$(inputval).val($('.receive-group-div .yt-table-active td').text());	
					$('.receive-group-div').hide();
					//回调函数
					sureBack();
			}else{
				$yt_alert_Model.prompt('请选择集团单位');
			}

		})
		$('.receive-group-div .receive-group-btn-img').off().click(function(){
			listData()
		})
	},
	/**
	 * 查询列表
	 */
	groupList:[],
	getGroupList: function(pageNum,num) {
		var me = this ;
		var groupName = $('#keyword').val();
		if($('#keyword').val()!=''){
			$('.table-page .num-text.change-btn.active').text(1);
		}
		//显示整体框架loading的方法
		$yt_baseElement.showLoading();
		$('.table-page').pageInfo({
			pageIndexs: $('.table-page .num-text.change-btn.active').text()?$('.table-page .num-text.change-btn.active').text():1,
			pageNum: 10, //每页显示条数  
			pageSize: 10, //显示...的规律  
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + 'group/getGroups',
			data: {
				groupName: groupName
			},
			objName: 'data', //指获取数据的对象名称  
			async:true,
			before:function(){
				$yt_baseElement.showLoading();
			},
			success:function(data){
				if(data.flag == 0) {
					var treeObj = getTreeData(data.data.rows, 0);
					var treeData = data.data.rows;
					//只转换集团
					 function getTreeData(data,parentId){
						var me = this;
					    var result = [] , temp;
					    for(var i in data){
					    	if(parentId==0){
					    		 if(data[i].parentId==parentId){
						            result.push(data[i]);
						            temp = getTreeData(data,data[i].pkId);           
						            if(temp.length>0){
						                data[i].children=temp;
						            }           
					        	}  
					    	}else{
					    		if(data[i].parentId==parentId){
						            result.push(data[i]);
						            temp = getTreeData(data,data[i].pkId);           
						            if(temp.length>0){
						                data[i].children=temp;
						            }  
						            break;
					        	}  
					    	}
					    }
					    return result;
					}
					 //点击集团后，加载单位数据
					 function getChildTreeData(data,parentId,parentName){
					    var result = [] , temp;
    				    for(var i in data){
			    		 if(data[i].parentId==parentId){
			    		 	data[i].parentName=parentName
				            result.push(data[i]);
				            temp = getChildTreeData(data,data[i].pkId,parentName);  
				            if(temp.length>0){
				                data[i].children=temp;
				                data[i].state='closed'
				            }           
			        	}  
					    }
					    return result;
					}
					var checkArr = [];
					$('#tt').treegrid({
						data: treeObj,
						method: 'post',
						animate: false,
						cascadeCheck: false,
						checkOnSelect: true,
						selectOnCheck:true,
						fitColumns: true,
						idField: 'pkId',
						treeField: 'groupName',
						queryParams: {
							groupName: groupName
						},
						columns: [
							[{
									field: 'groupNum',
									title: '排序',
									width: '5%'
								},
								{
									field: 'groupName',
									title: '集团单位名称',
									width:'66.9%',
									formatter: function(value, row, index) {
										return '<label class="check-label yt-checkbox">' +
											'<input type="checkbox" name="groupCheck" value="' + row.pkId + '"  parentName="' + row.parentName + '" rowType="' + row.classify + '"' +
											'groupName="' + row.groupName + '"' + 'parentId="' + row.parentId + '"' + 'types="' + row.types + '"' +'groupId="' + row.groupId + '"' +
											'province="' + row.province + '"' + 'groupNum="' + row.groupNum + '"' + 'remarks="' + row.remarks + '"' +
											'groupType="' + row.groupType + '"' +' groupUrl="' + row.groupUrl + '"' +
											'/>' +
											'</label>  ' + value;
											
									}
								},
								{
									field: 'province',
									title: '省份',
									width: '10%'
								},
								{
									field: 'groupType',
									title: '集团性质',
									width: '10%',
									formatter: function(value, row, index) {
//										if(value == 1) {
//											value="国家行政企业";
//										} else if(value == 2) {
//											value="公私合作企业";
//										} else if(value == 3) {
//											value="中外合资企业";
//										} else if(value == 4) {
//											value="社会组织机构";
//										} else if(value == 5) {
//											value="国际组织机构";
//										} 
										if(value==1){
											value = '中央组织部'
										}else if(value==2){
											value = '国务院国资委'
										}else if(value==3){
											value = '其他部委'
										}else if(value==4){
											value = '中央企业'
										}else if(value==5){
											value = '中管金融企业'
										}else if(value==6){
											value = '地方组织部'
										}else if(value==7){
											value = '地方国资委'
										}else if(value==8){
											value = '地方企业'
										}else if(value==9){
											value = '其他'
										}
										return value;
									}
								},
								{
									field: 'types',
									title: '单位类型',
									width: '10%',
									formatter: function(value, row, index) {
										if(value == 1) {
											value="央企集团本部";
										} else if(value == 2) {
											value="央企二级公司";
										} else if(value == 3) {
											value="央企三级公司";
										} else if(value == 4) {
											value="省属企业";
										} else if(value == 5) {
											value="市属企业";
										} else if(value == 6) {
											value="其他";
										}
										return value;
									}
								}
							]
						],
						//展开之前触发
						onBeforeExpand:function(node) {
							$yt_baseElement.showLoading();
							if(node.classify==1){
								$.each($('#tt').treegrid('getChildren',node.pkId), function(a,b) {
									if(b.types!=3){
										$('#tt').treegrid('remove',b.pkId);
									}
								});
								$('#tt').treegrid('append',{
									parent: node.pkId, 
									data: getChildTreeData(data.data.rows,node.pkId,node.groupName)
								});
							}
							setTimeout(function(){$yt_baseElement.hideLoading()},500)
						},
						//加载完毕后
						onLoadSuccess: function() {
							$('#tt').treegrid('collapseAll');
//							$("input[name='groupCheck']").off('change').change(function() {
//								debugger
//								if($("input[name='groupCheck']:checked").length!=0){
//									if($(this).attr("groupurl").split(',').length == $("input[name='groupCheck']:checked").attr("groupurl").split(',').length) {
//										$(this).setCheckBoxState("check");
//										$(this).parents('tr.datagrid-row').addClass('yt-table-active');
//									}else{
//										$yt_alert_Model.prompt("只能选择同一级的单位");
//									}
//								}
//							});
						},
						//点击树网格每一行触发事件
						onClickRow:function(rowIndex,rowData){
							var check=$('label input[value="'+rowIndex.pkId+'"]')[0].checked;
							var thisInput=$('label input[value="'+rowIndex.pkId+'"]');
								if(check){
									thisInput.parents('tr.datagrid-row').removeClass('yt-table-active');	
									thisInput.setCheckBoxState('uncheck');
								}else{
									if($("input[name='groupCheck']:checked").length!=0){
										if(thisInput.attr("groupurl").split(',').length == $("input[name='groupCheck']:checked").attr("groupurl").split(',').length) {
											thisInput.parents('tr.datagrid-row').addClass('yt-table-active');
											thisInput.setCheckBoxState('check');
										}else{
											$yt_alert_Model.prompt("只能选择同一级的单位");
										}
									}else{
										thisInput.parents('tr.datagrid-row').addClass('yt-table-active');
										thisInput.setCheckBoxState('check');
									}
								}
								return false;
						}
					
				});
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading();
				}else{
					//隐藏整体框架loading的方法
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt("查询失败");
					});
				}
			
			},
			error:function(){
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt("网络异常，查询失败");
					});
			},
			isSelPageNum: true,
			selPageNumList: [{"pageNum":"10条/页","num":10},{"pageNum":"15条/页","num":15},{"pageNum":"20条/页","num":20},{"pageNum":"25条/页","num":25},{"pageNum":"30条/页","num":30}] //自定义页面筛选list
		})
	},
	//删除
	deleteGroup:function(pkId){
		var me = this ;
		$.ajax({
			type:"post",
			url:$yt_option.base_path+"group/deleteGroup",
			async:false,
			data:{
				pkIds:pkId
			},
			beforeSend:function(){
				$yt_baseElement.showLoading()
			},
			success:function(data){
				if(data.flag==0){
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt('删除成功')
						me.getGroupList(10);
					})
				}else{
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt('删除失败')
					})
				}
			},error:function(){
				$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt('网络异常，删除失败')
					})
			}
		});
	}
}
$(function() {
	//初始化方法
	groupTubeList.init();
});