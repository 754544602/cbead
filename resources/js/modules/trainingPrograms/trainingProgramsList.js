var trainingProgramsList = {
	//初始化方法
	init: function() {
		trainingProgramsList.getTreeAllPersonnel()
		$(".yt-select").niceSelect(); //下拉框刷新  
		//日期控件
//		$(".chose-year").calendar({
//			speed: 200, //日期列表展开显示速度, 参数"slow","normal","fast"，或毫秒数值，默认：200     
//			complement: true, // 是否显示日期或年空白处的前后月的补充,默认：true     
//			readonly: true, // 目标对象是否设为只读，默认：true     
//			lowerLimit: "NaN", // 日期下限，默认：NaN(不限制)     
//			nowData: true, //默认选中当前时间,默认true  
//			dateFmt: "yyyy",
//			callback: function() { // 点击选择日期后的回调函数  
//				trainingProgramsList.getTrainingProgramsList();
//				trainingProgramsList.getAnnualTarget();
//			}
//		});
		$(".search-startDate").calendar({
			controlId: "startDates",
			nowData: true, //默认选中当前时间,默认true  
			dateFmt:"yyyy-MM",
			callback:function(){
				if(new Date($(".search-endDate").val())<new Date($(".search-startDate").val())){
					$(".search-endDate").val($(".search-startDate").val());
				}
				trainingProgramsList.getTrainingProgramsList();
				trainingProgramsList.getAnnualTarget();
			}
		});
		$(".search-endDate").calendar({
			controlId: "endDates",
			nowData: true, //默认选中当前时间,默认true  
			dateFmt:"yyyy-MM",
			callback:function(){
				if(new Date($(".search-endDate").val())<new Date($(".search-startDate").val())){
					$(".search-startDate").val($(".search-endDate").val());
				}
				trainingProgramsList.getTrainingProgramsList();
				trainingProgramsList.getAnnualTarget();
			}
		});
		sessionStorage.getItem("startDate")?$('.search-startDate').val(sessionStorage.getItem("startDate")):'';
		sessionStorage.getItem("endDate")?$('.search-endDate').val(sessionStorage.getItem("endDate")):'';
		//计划科负责人.教师.管理员才能设置负责人
//		var isOperation = false;
//		(','+$yt_common.user_info.roleIds+',').indexOf(',315,') != -1?isOperation=true:'';
//		(','+$yt_common.user_info.roleIds+',').indexOf(',312,') != -1?isOperation=true:'';
//		(','+$yt_common.user_info.roleIds+',').indexOf(',322,') != -1?isOperation=true:'';
//		(','+$yt_common.user_info.roleIds+',').indexOf(',309,') != -1?isOperation=true:'';
//		(','+$yt_common.user_info.roleIds+',').indexOf(',310,') != -1?isOperation=true:'';
//		(','+$yt_common.user_info.roleIds+',').indexOf(',324,') != -1?isOperation=true:'';
//		if (isOperation == false) {
//			$(".set-principal-btn").remove()
//		}
		// (','+$yt_common.user_info.roleIds+',').indexOf(',315,')==-1||(','+$yt_common.user_info.roleIds+',').indexOf(',312,')==-1||(','+$yt_common.user_info.roleIds+',').indexOf(',322,')==-1?:''
		var judgeList = 2;
		//点击新增
		$(".addList").on('click', function() {
			window.location.href = $yt_option.base_path + "website/view/project/addProjectList.html?judgeList=2";
		});
		//点击修改
		$(".updateList").on('click', function() {
			if($("tr.yt-table-active").length == 0) {
				$yt_alert_Model.prompt("请选择要修改的数据");
				return false;
			}
			var projectType = $("tr.yt-table-active").find(".hid-project-type").val();
			window.location.href = $yt_option.base_path + "website/view/project/addProjectList.html?pkId=" + $('.yt-table-active .pkId').val() + "&judgeList=2"+"&"+"projectType="+projectType;
		});
		//点击项目名称  查看详情
		$(".train-tbody").on('click', ".real-name-inf", function() {
			var projectType = $("tr.yt-table-active").find(".hid-project-type").val();
			var projectState = $(this).parents('tr').find(".project-state-step").val();
			sessionStorage.setItem("searchParams", $('.selectParam').val());
			sessionStorage.setItem("pageIndexs", $('.num-text.active').text());
			sessionStorage.setItem("startDate", $(".search-startDate").val());
			sessionStorage.setItem("endDate", $(".search-endDate").val());
			window.location.href = $yt_option.base_path + "website/view/project/projectDetails.html?pkId=" + $('.yt-table-active .pkId').val() + "&history=trainingProgramsList&projectCode=" + $('.yt-table-active .project-code-list').text() + "&judgeList=2&projectState="+projectState+"&"+"projectType="+projectType;
		});
		//点击设置负责人
		$(".set-principal-btn").off().on('click', function() {
			if($("tr.yt-table-active").length == 0) {
				$yt_alert_Model.prompt("请选择要操作的数据");
				return false;
			}
			var num = Number($('tr.none-tr').index())
			//清空项目主任
			if($('select.project-director').length>1){
				var length = $('select.project-director').length;
				$.each($('select.project-director'), function(x,y) {
					if(x!=length-1){
						if($(y).parents('tr').find('.project-head')[0] == undefined) {
							$(y).parents('tr').remove();
						} else {
							$(y).parents('tr').next().find('td').eq(0).text($(this).parents('tr').find('.project-head').text());
							$(y).parents('tr').next().find('td').eq(0).addClass('project-head')
							$(y).parents('tr').remove();
						}
					}
				});
				$('select.project-director').attr('class','yt-select project-director project-director1 types');
				$('div.project-director').attr('class','nice-select yt-select project-director project-director1 types');
				 $.each(trainingProgramsList.allPersonnel, function(j, m) {  
							if(m.type == 3) {
								$("select.project-director1").append('<option value="' + m.textName + '" types="2" realName="' + m.text + '" >' + m.text + '</option>');
							}
		                
		            });
				 $("select.project-director option:eq(0)").prop("selected","selected");  
			}
			//清空班主任
			if($('select.teacher-head').length>1){
				var length = $('select.teacher-head').length;
				$.each($('select.teacher-head'), function(x,y) {
					if(x!=length-1){
						if($(y).parents('tr').find('.projectHeadmaster')[0] == undefined) {
							$(y).parents('tr').remove();
						} else {
							$(y).parents('tr').next().find('td').eq(0).text($(this).parents('tr').find('.projectHeadmaster').text());
							$(y).parents('tr').next().find('td').eq(0).addClass('projectHeadmaster')
							$(y).parents('tr').remove();
						}
					}
				});
				$('select.teacher-head').attr('class','yt-select teacher-head teacher-head1 types');
				$('div.teacher-head').attr('class','nice-select yt-select teacher-head teacher-head1 types');
				$.each(trainingProgramsList.allPersonnel, function(j, m) {  
							if(m.type == 3) {
								$(".projectAidTr").prev().find("select.teacher-head"+length).append('<option value="' + m.textName + '" types="3" realName="' + m.text + '" >' + m.text + '</option>');
							}
			            });
				 $("select.teacher-head option:eq(0)").prop("selected","selected");  
			};
				//获取项目主任,班主任,项目助理下拉列表
			var treeAllPersonal = trainingProgramsList.allPersonnel;
			if(treeAllPersonal != null) {
				$.each(treeAllPersonal, function(i, n) {
					if(n.type == 3) {
						$("select.project-director").append('<option value="' + n.textName + '" types=2 realName="' + n.text + '">' + n.text + '</option>');
						$("select.teacher-head").append('<option value="' + n.textName + '" types=3 >' + n.text + '</option>');
					}
				});
			}
			$(".project-director1").niceSelect({  
		        search: true,  
		        backFunction: function(text) {  
		            //回调方法,可以执行模糊查询,也可自行添加操作  
		            $("select.project-director1 option").remove();  
		            if(text == "") {  
		                $("select.project-director1").append('<option value="">请选择</option>');  
		            }
		          //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
		            $.each(treeAllPersonal, function(i, n) {  
		                if(n.text.indexOf(text) != -1) {
		                	if(n.type == 3) {
							$("select.project-director1").append('<option value="' + n.textName + '" types=2 realName="' + n.text + '">' + n.text + '</option>');
						}
		                }  
		            });
		           }
				});
				$(".teacher-head1").niceSelect({  
		        search: true,  
		        backFunction: function(text) {  
		            //回调方法,可以执行模糊查询,也可自行添加操作  
		            $("select.teacher-head1 option").remove();  
		            if(text == "") {  
		                $("select.teacher-head1").append('<option value="">请选择</option>');  
		            }
		          //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
		            $.each(treeAllPersonal, function(i, n) {  
		                if(n.text.indexOf(text) != -1) {
		                	if(n.type == 3) {
							$("select.teacher-head1").append('<option value="' + n.textName + '" types=3 >' + n.text + '</option>');
						}
		                }  
		            });
		           }
				});
			//
			$('.none-tr').parents('tbody').find('tr').eq(2).find('select').val('');
			var name = $(".yt-table-active").find('.real-name-inf').text();
			var projectType = $(".yt-table-active").find('.projectType').text();
			var principalInf = $(".yt-table-active").data('legalData').projectHeadCode;
			var principalArr = principalInf.split(",");
			var teacherHead = $(".yt-table-active").data('legalData').projectHeadmasterCode;
			var teacherHeadArr = teacherHead.split(",");
			$('.project-name').text(name);
			$('.project-type').text(projectType);
			var selectVal = "";
			$('.project-assistant').setSelectVal( $(".yt-table-active").data('legalData').projectAidCode);
			//项目主任赋值
			$.each(principalArr, function(i, n) {
				if(i == 0) {
					$('select.project-director:eq(0)').setSelectVal(n);
					$(".set-principal-alert").find("select.project-director").eq(0).hide();
				} else {
					var length = $('select.project-director').length+1;
					addProjectHead('add',n);
					//遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
		            $.each(trainingProgramsList.allPersonnel, function(j, m) {  
							if(m.type == 3) {
								$(".none-tr").prev().find("select.project-director"+length).append('<option value="' + m.textName + '" types="2" realName="' + m.text + '" >' + m.text + '</option>');
							}
		                
		            });
		            $(".none-tr").prev().find("select.project-director"+length).setSelectVal(n)
					}
			});
			//班主任赋值
			$.each(teacherHeadArr, function(i, n) {
				if(i == 0) {
					$('select.teacher-head:eq(0)').setSelectVal(n);
					$(".set-principal-alert").find("select.teacher-head").eq(0).hide();
				} else {
					var length = $('select.teacher-head').length+1;
					addTeacherHead('add',n);
					 $.each(trainingProgramsList.allPersonnel, function(j, m) {  
							if(m.type == 3) {
								$(".projectAidTr").prev().find("select.teacher-head"+length).append('<option value="' + m.textName + '" types="3" realName="' + m.text + '" >' + m.text + '</option>');
							}
			            });
					$(".projectAidTr").prev().find(".teacher-head"+length).setSelectVal(n);
				}
			});
			
			trainingProgramsList.setPrincipal();
			$(".set-principal-alert").off().on('click', '.add-project-director', function() {
				addProjectHead();
			});
			//项目主任新增
			function addProjectHead(a,b){
				var length = $('select.project-director').length+1;
				$(".none-tr").before('<tr>' +
					'<td align="right"></td>' +
					'<td>' +
					'<div class="set-principal-alert-select">' +
					'<select class="yt-select project-director project-director'+length+' types" data-val="" style="width: 201px;" >' +
					'<option value="">请选择</option>' +
					'</select>' +
					'</div>' +
					'</td>' +
					'<td width="100px" style="padding-left: 10px;color: lightskyblue;cursor: pointer;">' +
					'<span class="add-project-director">新增</span>' +
					'</td>' +
					'</tr>');
				$(".none-tr").prev().prev().find('.add-project-director').text('删除');
				$(".none-tr").prev().prev().find('.add-project-director').attr('class', 'delete-project-director');
				$('.delete-project-director').off().click(function() {
					if($(this).parents('tr').find('.project-head')[0] == undefined) {
						$(this).parents('tr').remove();
					} else {
						$(this).parents('tr').next().find('td').eq(0).text($(this).parents('tr').find('.project-head').text());
						$(this).parents('tr').next().find('td').eq(0).addClass('project-head')
						$(this).parents('tr').remove();
					}
				})
				if(a=='add'){
					$(".none-tr").prev().find("select.project-director"+length).niceSelect({
							search: true,
							backFunction: function(text) {  
						            //回调方法,可以执行模糊查询,也可自行添加操作  
						           $(".none-tr").prev().find("select.project-director"+length+" option").remove();  
						            if(text == "") {  
						                 $(".none-tr").prev().find("select.project-director"+length).append('<option value="">请选择</option>');  
						            }
						          //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
						            $.each(trainingProgramsList.allPersonnel, function(j, m) {  
						                if(m.text.indexOf(text) != -1) {
											if(m.type == 3) {
												$(".none-tr").prev().find("select.project-director"+length).append('<option value="' + m.textName + '" types="2" realName="' + m.text + '" >' + m.text + '</option>');
											}
						                }  
						                
						            });
						           }
							 });
							  
				}else{
					//获取项目主任下拉列表
				var treeAllPersonal = trainingProgramsList.allPersonnel;
				$("select.project-director"+length).niceSelect({
					search: true,
					backFunction: function(text) {  
				            //回调方法,可以执行模糊查询,也可自行添加操作  
				            $("select.project-director"+length+" option").remove();  
				            if(text == "") {  
				                $("select.project-director"+length).append('<option value="">请选择</option>');  
				            }
				          //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
				            $.each(treeAllPersonal, function(i, n) {  
				                if(n.text.indexOf(text) != -1) {
				                	if(n.type == 3) {
									$("select.project-director"+length).append('<option value="' + n.textName + '" types=2 >' + n.text + '</option>');
								}
				                }  
				            });
				           }
					 });
				}
				
			}
			$(".set-principal-alert").on('click', '.add-teacher-head', function() {
				$(this).text("");
				addTeacherHead();
			});
			//班主任新增
			function addTeacherHead(a,b){
				var length  = $('select.teacher-head').length+1;
				$(".project-assistant").parent().parent().parent().before('<tr>' +
					'<td align="right"></td>' +
					'<td>' +
					'<div class="set-principal-alert-select">' +
					'<select class="yt-select teacher-head teacher-head'+length+' types" data-val="" style="width: 201px;" >' +
					'<option value="">请选择</option>' +
					'</select>' +
					'</div>' +
					'</td>' +
					'<td width="100px" style="padding-left: 10px;color: lightskyblue;cursor: pointer;">' +
					'<span class="add-teacher-head">新增</span>' +
					'</td>' +
					'</tr>');
				$(".project-assistant").parent().parent().parent().prev().prev().find('.add-teacher-head').text('删除');
				$(".project-assistant").parent().parent().parent().prev().prev().find('.add-teacher-head').attr('class', 'delete-teacher-director');
				$('.delete-teacher-director').off().click(function() {
					if($(this).parents('tr').find('.projectHeadmaster')[0] == undefined) {
						$(this).parents('tr').remove();
					} else {
						$(this).parents('tr').next().find('td').eq(0).text($(this).parents('tr').find('.projectHeadmaster').text());
						$(this).parents('tr').next().find('td').eq(0).addClass('projectHeadmaster')
						$(this).parents('tr').remove();
					}
				})
				if(a=='add'){
					$(".projectAidTr").prev().find("select.teacher-head"+length).niceSelect({
						search: true,
						backFunction: function(text) {  
					            //回调方法,可以执行模糊查询,也可自行添加操作  
					            $(".projectAidTr").prev().find("select.teacher-head"+length+" option").remove();  
					            if(text == "") {  
					               $(".projectAidTr").prev().find("select.teacher-head"+length).append('<option value="">请选择</option>');  
					            }
					          //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
					            $.each(trainingProgramsList.allPersonnel, function(j, m) {  
					                if(m.text.indexOf(text) != -1) {
										if(m.type == 3) {
											$(".projectAidTr").prev().find("select.teacher-head"+length).append('<option value="' + m.textName + '" types="3" realName="' + m.text + '" >' + m.text + '</option>');
										}
					                }  
					            });
					           }
					 });
				}else{
					//获取班主任下拉列表
				var treeAllPersonal = trainingProgramsList.allPersonnel;
				if(treeAllPersonal != null) {
					$.each(treeAllPersonal, function(i, n) {
						if(n.type == 3) {
							$("select.teacher-head").append('<option value="' + n.textName + '" types=3 >' + n.text + '</option>');
						}
					});
				}
				$(".teacher-head"+length).niceSelect({
				search: true,
				backFunction: function(text) {  
			            //回调方法,可以执行模糊查询,也可自行添加操作  
			            $("select.teacher-head"+length+" option").remove();  
			            if(text == "") {  
			                $("select.teacher-head"+length).append('<option value="">请选择</option>');  
			            }
			          //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
			            $.each(treeAllPersonal, function(i, n) {  
			                if(n.text.indexOf(text) != -1) {
			                	if(n.type == 3) {
								$("select.teacher-head"+length).append('<option value="' + n.textName + '" types=3 >' + n.text + '</option>');
							}
			                }  
			            });
			           }
				 });
				}
			}
			$(".set-principal-alert .yt-model-sure-btn").off().on('click', function() {
				trainingProgramsList.setHeadAlert();
			});
		});

		//调用获取列表数据方法
		trainingProgramsList.getTrainingProgramsList();
		//获取年度班次目标
		trainingProgramsList.getAnnualTarget();
		//点击修改本年度班次目标
		$(".amend-annual-target").click(function() {
			$(this).hide();
			$(".annual-target-span").hide();
			$(".annual-target-inf").show();
			$(".save-annual-target").show();
			//点击保存,保存本年度班次目标
			$(".save-annual-target").off().click(function() {
				trainingProgramsList.saveAnnualTarget();
				$(this).hide();
				$(".amend-annual-target").show();
				$(".annual-target-span").show();
				$(".annual-target-inf").hide();
				trainingProgramsList.getAnnualTarget();
			});
		});
		//搜索关键字
		$('.search-btn').click(function() {
			//调用获取列表数据方法查询
			$(".search-box .project-types").setSelectVal('');
			trainingProgramsList.getTrainingProgramsList();
		});
		//高级搜索
		trainingProgramsList.hideSearch();
		//获取项目主任,班主任,项目助理下拉列表
		var treeAllPersonal = trainingProgramsList.allPersonnel;
		if(treeAllPersonal != null) {
			$.each(treeAllPersonal, function(i, n) {
				if(n.type == 3) {
					$(".project-director").append('<option value="' + n.textName + '" types=2 realName="' + n.text + '">' + n.text + '</option>');
					$(".teacher-head").append('<option value="' + n.textName + '" types=3 >' + n.text + '</option>');
					$(".project-assistant").append('<option value="' + n.textName + '" types=4 >' + n.text + '</option>');
				}
			});
		}
		$(".project-director1").niceSelect({  
        search: true,  
        backFunction: function(text) {  
            //回调方法,可以执行模糊查询,也可自行添加操作  
            $("select.project-director1 option").remove();  
            if(text == "") {  
                $("select.project-director1").append('<option value="">请选择</option>');  
            }
          //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
            $.each(treeAllPersonal, function(i, n) {  
                if(n.text.indexOf(text) != -1) {
                	if(n.type == 3) {
					$("select.project-director1").append('<option value="' + n.textName + '" types=2 realName="' + n.text + '">' + n.text + '</option>');
				}
                }  
            });
           }
		});
		$(".teacher-head1").niceSelect({  
        search: true,  
        backFunction: function(text) {  
            //回调方法,可以执行模糊查询,也可自行添加操作  
            $("select.teacher-head1 option").remove();  
            if(text == "") {  
                $("select.teacher-head1").append('<option value="">请选择</option>');  
            }
          //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
            $.each(treeAllPersonal, function(i, n) {  
                if(n.text.indexOf(text) != -1) {
                	if(n.type == 3) {
					$("select.teacher-head1").append('<option value="' + n.textName + '" types=3 >' + n.text + '</option>');
				}
                }  
            });
           }
		});
		$(".project-assistant").niceSelect({
        search: true,  
        backFunction: function(text) {  
            //回调方法,可以执行模糊查询,也可自行添加操作  
            $("select.project-assistant option").remove();  
            if(text == "") {  
                $("select.project-assistant").append('<option value="">请选择</option>');  
            }
          //遍历存储的全局用户名遍历,匹配数据,进行模糊查询操作  
            $.each(treeAllPersonal, function(i, n) {  
                if(n.text.indexOf(text) != -1) {
                	if(n.type == 3) {
					$("select.project-assistant").append('<option value="' + n.textName + '" types=4 >' + n.text + '</option>');
				}
                }  
            });
           }
		});
	},
	allPersonnel:'',
	/**
	 * 获取树形结构所有人员
	 */
	getTreeAllPersonnel: function() {
		var list = [];
		$.ajax({
			type: "post",
			url: $yt_option.base_path + "uniform/user/getUsers",
			beforeSend:function(){
				$yt_baseElement.showLoading();
			},
			data: {

			},
			async: false,
			success: function(data) {
				list = data.data || [];
				trainingProgramsList.allPersonnel = data.data;
				$yt_baseElement.hideLoading();
			}
		});
		return list;
	},
	/**
	 * 获取列表数据
	 */
	getTrainingProgramsList: function() {
		var projectType=$(".search-box .project-types").val();
		sessionStorage.getItem("searchParams")?$('.selectParam').val(sessionStorage.getItem("searchParams")):'';
		var selectParam = $(".selectParam").val();
		$('.train-page').pageInfo({
			pageIndexs: sessionStorage.getItem("pageIndexs")?sessionStorage.getItem("pageIndexs"):1,
			pageNum: 15, //每页显示条数  
			pageSize: 10, //显示...的规律  
			url: $yt_option.base_path + "project/lookForAllByTrainClass", //ajax访问路径  
			type: "post", //ajax访问方式 默认 "post"  
			data: {
				selectParam: selectParam,
				years: $('.search-startDate').val().split('-')[0],
				projectType:projectType,
				selectProjectStart:$('.search-startDate').val(),
				selectProjectEnd:$('.search-endDate').val()
			}, //ajax查询访问参数
			objName: 'data', //指获取数据的对象名称  
			async:true,
			before:function(){
				$yt_baseElement.showLoading();
			},
			success: function(data) {
				sessionStorage.clear();
				if(data.flag == 0) {
					var htmlTbody = $('.list-table .train-tbody');
					var htmlTr = '';
					var projectType = "";
					if(data.data.rows.length > 0) {
						$(htmlTbody).empty()
						$.each(data.data.rows, function(i, v) {
							if(v.projectType == 1) {
								projectType = "计划"
							} else if(v.projectType == 2) {
								projectType = "委托"
							} else if(v.projectType == 3) {
								projectType = "选学"
							} else if(v.projectType == 4) {
								projectType = "中组部调训"
							}else if(v.projectType == 5) {
								projectType = "国资委调训"
							}
							htmlTr = '<tr>' +
								'<td class="project-code-list"><input type="hidden" value="' + v.pkId + '" class="pkId">' + v.projectCode + '</td>' +
								'<td style="text-align: left;"><a href="#" class="real-name-inf" style=" color:#3c4687">' + v.projectName + '</a></td>' +
								'<td class="projectType"><input type="hidden" value="' + v.projectType + '" class="hid-project-type">' + projectType + '</td>' +
								'<td>' + v.startDate + '</td>' +
								'<td style="text-align: right;">' + v.trainDateCount + '</td>' +
								'<td style="text-align: left;">' + v.projectSell + '</td>' +
								'<td style="text-align: left;" class="project-head-text">' + v.projectHead + '</td>' +
								'<td style="text-align: right;">' + v.traineeCount + '</td>' +
								'<td><input type="hidden" value="' + v.projectStates + '" class="project-state-step">' + (v.projectStates == 4 ? "意向" : (v.projectStates == 5 ? "已运行" : (v.projectStates == 6 ? "未结项" : (v.projectStates == 7 ? "已结项":"确定意向")))) + '</td>' +
								'</tr>';
							$(".train-page").show();
							htmlTbody.append($(htmlTr).data("legalData", v));
						});
					} else {
						$(".train-page").hide();
						htmlTr += '<tr style="border:0px;background-color:#fff !important;" >' +
							'<td colspan="9" align="center" style="border:0px;">' +
							'<div class="no-data" style="width: 280px;margin: 0 auto;">' +
							'<img src="../../resources/images/common/no-data.png" alt="" style="padding: 35px 0 20px;">' +
							'</div>' +
							'</td>' +
							'</tr>';
						htmlTbody.html(htmlTr);
					}
					$yt_baseElement.hideLoading();

				} else {
					$yt_baseElement.hideLoading();
					$yt_alert_Model.prompt("查询失败");
				}

			}, //回调函数 匿名函数返回查询结果  
			isSelPageNum: true //是否显示选择条数列表默认false  
		});
	},
	//设置负责人
	setHeadAlert: function() {
		$yt_baseElement.showLoading();
		var projectCode = $('.yt-table-active').data("legalData").projectCode;
		var userList = "";
		var userListArr = [];
		var array = [];
		$(".set-principal-alert .set-principal-alert-select").each(function(i, n) {
			types = $(n).find("select.types option:selected").attr("types");
			typesData = $(n).find("select.types option:selected").val();
			var arrUserList = {
				types: types,
				typesData: typesData,
			}
			userListArr.push(arrUserList);
		});
		var userList = JSON.stringify(userListArr);
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "project/updateProjectPrincipal", //ajax访问路径  
			data: {
				projectCode: projectCode,
				userList: userList
			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					$yt_baseElement.hideLoading(function(){
						$yt_alert_Model.prompt("操作成功");
//						window.location.reload();
						$('.train-page').pageInfo('refresh');
					});
					$(".set-principal-alert").hide();
				} else {
					$yt_baseElement.hideLoading();
					$yt_alert_Model.prompt("操作失败");
					$('.train-page').pageInfo("refresh");
					$(".set-principal-alert").hide();
				}
			}
		});
	},
	//设置负责人弹出框
	setPrincipal: function() {
		/** 
		 * 显示编辑弹出框和显示顶部隐藏蒙层 
		 */
		$(".set-principal-alert").show();
		/** 
		 * 调用算取div显示位置方法 
		 */
		$yt_alert_Model.getDivPosition($(".set-principal-alert"));
		$yt_alert_Model.setFiexBoxHeight($(".cont-edit-test"));
		/* 
		 * 调用支持拖拽的方法 
		 */
		$yt_model_drag.modelDragEvent($(".set-principal-alert .yt-edit-alert-title"));
		/** 
		 * 点击取消方法 
		 */
		$('.set-principal-alert .yt-eidt-model-bottom .yt-model-canel-btn').off().on("click", function() {
			//隐藏页面中自定义的表单内容  
			$(".set-principal-alert").hide();
			//隐藏蒙层  
			$("#pop-modle-alert").hide();
		});
	},
	//获取本年度班次目标
	getAnnualTarget: function() {

		var yearData = $(".search-startDate").val().split('-')[0];
		$('.yearSpan').text(yearData);
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			url: $yt_option.base_path + "class/trainee/getTrainPlanByTear", //ajax访问路径  
			data: {
				yearData: yearData

			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					data.data == null? data.data={setprojectCount:0,trainCount:0}:data.data = data.data 
					$(".annual-target").setDatas(data.data);
				} else {
					$yt_alert_Model.prompt("本年度班次目标操作失败");
				}
			}
		});
	},
	//保存本年度班次目标
	saveAnnualTarget: function() {
		var yearData = $(".search-startDate").val().split('-')[0];
		var trainCount = $(".annual-target-inf").val();
		$.ajax({
			type: "post", //ajax访问方式 默认 "post"  
			async: false,
			url: $yt_option.base_path + "class/trainee/updateTrainPlanByTear", //ajax访问路径  
			data: {
				yearData: yearData,
				trainCount: trainCount

			}, //ajax查询访问参数
			success: function(data) {
				if(data.flag == 0) {
					$yt_alert_Model.prompt("本年度班次目标保存成功");
				} else {
					$yt_alert_Model.prompt("本年度班次目标保存失败");
				}
			}
		});
	},
	/**
	 * 高级搜索
	 */
	hideSearch:function(){
		$(".project-types").niceSelect();
		var clickTime=0;
		$(".senior-search-btn").click(function(e){
			if(clickTime%2==0){
				$(".search-box").show();
				$("img.search-put").addClass('flipy');
			}else{
				$(".search-box").hide();
				$("img.search-put").removeClass('flipy');
			}
			clickTime++;
			e.stopPropagation();
		});
		//点击其他地方收起
		$(document).click(function(e){
			clickTime=0;
			$(".search-box").hide();
			$("img.search-put").removeClass('flipy');
			e.stopPropagation();
		});
		//点击查询按钮
		$(".search-box .yt-model-sure-btn").click(function(){
			trainingProgramsList.getTrainingProgramsList();
		});
		//点击重置按钮
		$(".search-box .yt-model-reset-btn").click(function(){
			$(".search-box .project-types").setSelectVal('');
		});
	}

}
$(function() {
	//初始化方法
	trainingProgramsList.init();

});
 
//  $(".list").mCustomScrollbar({autoHideScrollbar:true,theme:"square"});  
    /** 
     *  
     *  
     * 调用下拉列表改变选中数据时获取内容方法 
     *  
     */  
//  changeEntrySelVal();  
//  function changeEntrySelVal(){  
//  $("select.user-name-sel").change(function(){  
//      //获取下拉列表选中的value值  
//     var selVal  = $(this).val();  
//     $(".user-name-span").text(selVal);     
//     //获取下拉列表选中的文本值  
//     var selText =  $(this).find("option:selected").text();  
//     $(".sel-text-span").text(selText);  
//  });  
//}  
