var tabEdit={
	selTestData:[//下拉列表测试数据
	{"name":"String"},
	{"name":"Long"},
	{"name":"Boolean"}
	],
    tableDatas:[],//表格内容数据集
    tableDatasJson:"",//全局的表格内容json数据集
	 /**
	  * 
	  * 编辑表格上方操作按钮事件
	  * 
	  */
	 tabHeardHandleEvent:function(){
	 	/**
		 * 左侧按钮点击事件
		 */
		$(".heard-handel-model .left-handle").off("click").on("click",function(){
			//1.获取左侧按钮隐藏的操作标识(1.修改2.保存)
			var handelHidFlag = $(this).find(".hid-flag").val();
			//2.获取当前tbody对象,获取当前tbody中的最后一行
			var thisTbody = $(this).parent().next().find("tbody");
			var lastTr = thisTbody.find("tr").eq(thisTbody.find("tr").length-1);
			//3.判断当前左侧按钮点击是修改or保存(1.修改2.保存)
			if(handelHidFlag == 1){
			    //3.1改变文本信息,改变图标,改变操作标识为2
				$(this).find(".left-handle-font").text("保存");
				$(this).find(".edit-title-icon").attr("src","./resources/images/icons/look-save.png");
				$(this).find(".hid-flag").val(2);
				//3.2显示右侧取消按钮
				$(this).next().css("display","inline-block");
				//3.3判断是否存在提示暂无参数一行,存在删除
				if(thisTbody.find("tr").hasClass("no-data-tr")){
					thisTbody.find(".no-data-tr").remove();
				}
				//3.4判断当前tbody是否保存"添加一行"的标识,不包含,新增一行
				//先删除表格之前存在的添加行
				thisTbody.find(".last-tr-add").remove();
				if(!thisTbody.hasClass("last-tr-add")){
					//获取当前表格下的th数量,作为新增一行跨列用
					var thNum = thisTbody.prev().find("th").length;
					var addStr = $('<tr class="last-tr-add"><td align="center" colspan="'+thNum+'"><img class="tr-add-icon" src="./resources/images/icons/tab-add.png"/></td></tr>');
					thisTbody.append(addStr);
					//点击新增行添加一行操作
					addStr.off().on("click",function(){
						//验证标识
						var addFlag=true;
						//获取最后一行添加一行的上一行
						var lastPrevTr = $(".last-tr-add").prev();
						//判断当前tbody下的tr是否不止一行
						if(thisTbody.find("tr").length>1){
							
							thisTbody.find("tr:not(.last-tr-add)").each(function(i,n){
								
							  if($(n).find("input").val() == "" && $(n).find("select").val() == "" && $(n).find(".textarea-div").text() ==""){
							  	$yt_alert_Model.prompt("存在空行未编辑,请检查...");
							 	addFlag=false;
							 	return;
							  }
							  if($(n).find("input").val() == "" || $(n).find("select").val() == "" || $(n).find(".textarea-div").text() ==""){
							  	$yt_alert_Model.prompt("请填写完整信息");
							 	addFlag=false;
							 	return;
							  }
							});
						}
						if(addFlag){
							tabEdit.addTabRow(thisTbody);
						}
					});
				}
				//3.7隐藏当前tbody下显示数据的标签,显示可编辑的标签
				thisTbody.find("tr").find(".td-text").hide();
				thisTbody.find("tr").find(".td-val").css("display","inline-block");
				//3.8显示操作列
				thisTbody.parent().find(".handle-td").css("display","table-cell");
			}
			//4.标识等于2,保存操作
			if(handelHidFlag == 2){
				//4.1判断当前tbody中最后一行数据是否为空
				if(thisTbody.find("tr").length == 1){
				  if(lastTr.find("input:not([type='checkbox'])").val() == "" && lastTr.find("select").val() == "" && lastTr.find(".textarea-div").text() == ""){
				  	$yt_alert_Model.prompt("请填写完整信息");
					return false;
				  }
				}
				//验证变量
				var trFlag = true;
				//4.2遍历当前tobdy下的tr其中不包含空行和,添加行中的数据
				$.each(thisTbody.find("tr:not(.last-tr-null,.last-tr-add)"), function(i,n) {
					//
					if($(n).find("td:eq(0) input").val() == "" && $(n).find("td:eq(1) select").val() =="" && $(n).find("td:eq(3) input").val() == "" && $(n).find("td:eq(4) .textarea-div").text() ==""){
			    		$(n).remove();
			    		return;
			    	}
					//4.3判断当前行中的input,select,div标签是否为空
			    	if($(n).find("td:eq(0) input").val() == "" || $(n).find("td:eq(1) select").val() =="" || $(n).find("td:eq(3) input").val() == "" || $(n).find("td:eq(4) .textarea-div").text() ==""){
						$yt_alert_Model.prompt("请填写完整信息");
						trFlag=false;
						return;
					}
				});
				//4.4如果验证标识为true
				if(trFlag){
			    	
			    	//4.7当前tbody下的tr中的input,select,div标签内容是否为空,都不为空,执行保存操作
			    	if(thisTbody.find("tr td:eq(0) input").val() !="" &&  thisTbody.find("tr td:eq(0) select").val() !=""  &&  thisTbody.find("tr td:eq(3) input").val() != "" &&  thisTbody.find("tr td:eq(4) .textarea-div").text() !=""){
						//4.7.1改变文本信息,改变图标,改变操作标识为1
						$(this).find(".left-handle-font").text("修改");
						$(this).find(".edit-title-icon").attr("src","./resources/images/icons/blue-edit.png");
						$(this).find(".hid-flag").val(1);
						//4.7.2删除最后一行添加行
						thisTbody.find(".last-tr-add").remove();
						//4.7.3隐藏右侧取消按钮
						$(this).next().hide();
						
						//4.7.5显示当前tbody下tr中的文本内容显示
						thisTbody.find("tr").find(".td-text").css("display","inline-block");
						//4.7.6隐藏当前tbody下tr中的标签
						thisTbody.find("tr").find(".td-val").hide();
						//4.7.7给最后一行替换操作标识为删除标签
						lastTr.find("td").eq(lastTr.find("td").length-1).html('<span class="entry-del-icon"><img src="./resources/images/icons/t-del.png" class="table-add"></span>');
						//4.7.8调用设置值方法,传输当前tobdy对象
						tabEdit.setSpanVal(thisTbody);
					}else{
						if(thisTbody.find("tr").length !=1 && !thisTbody.find("tr").hasClass("last-tr-add")){
							$yt_alert_Model.prompt("请填写完整信息");
							return false;
						}else{
							thisTbody.find(".last-tr-add td").attr("colspan",5);
							//改变操作文本和图标
							$(this).find(".left-handle-font").text("修改");
							$(this).find(".edit-title-icon").attr("src","./resources/images/icons/blue-edit.png");
							$(this).find(".hid-flag").val(1);
							//隐藏右侧取消按钮
							$(this).next().hide();
						}
					}
					//4.8判断如果点击保存只有一行空数据,给表格添加一行无参数
					if(thisTbody.find("tr").length == 0){
						var noTr = '<tr class="no-data-tr"><td colspan="5" align="center">暂无参数</td></tr>';
						thisTbody.append(noTr);
					}
					
					//4.10隐藏当前表格thead中的操作列
					thisTbody.parent().find(".handle-td").hide();
			    }
			}
			//调用点击取消,编辑方法
			tabEdit.canelEdit();
		});
	 },
	 /**
	  * 
	  * 
	  * 取消编辑方法
	  * 
	  * 
	  */
	 canelEdit:function(){
	 		/**
			 * 
			 * 
			 * 右侧取消按钮点击事件
			 * 
			 * 
			 **/
			$(".heard-handel-model .right-handle").off("click").on("click",function(){
				//1.修改左侧操作按钮为修改
				$(this).prev().find(".left-handle-font").text("修改");
				$(this).prev().find(".edit-title-icon").attr("src","./resources/images/icons/blue-edit.png");
				$(this).prev().find(".hid-flag").val(1);
				//2.将自己隐藏
				$(this).hide();
				//3.获取当前tbody,获取当前tbody下的最后一行
				var thisTbody = $(this).parent().next().find("tbody");
				var lastTr = thisTbody.find("tr").eq(thisTbody.find("tr").length-1);
				//4.删除最后一行添加行
				thisTbody.find(".last-tr-add").remove();
				//5.遍历当前tbody下的tr
				thisTbody.find("tr").each(function(i,n){
					//判断如果当前tr下的文本显示数据为空,则删除当前行
					if($(n).find(".td-text").text() == ""){
						$(n).remove();
					}
				});
				//6.隐藏编辑框,显示文本
				thisTbody.find("tr").find(".td-text").css("display","inline-block");
				thisTbody.find("tr").find(".td-val").hide();
			    //7.判断如果点击保存只有一行空数据,给表格添加一行无参数
				if(thisTbody.find("tr").length == 0){
					var noTr = '<tr class="no-data-tr"><td colspan="5" align="center">暂无参数</td></tr>';
					thisTbody.append(noTr);
				}
			    //8.隐藏操作列
				thisTbody.parent().find(".handle-td").hide();
				
				//10.调用拼接数据方法
				tabEdit.setInputParamsOutParamsVal(thisTbody,tabEdit.tableDatas);
			});
	 },
	 /**
	  * 
	 * 设置值方法,标签中的值赋值给文本显示
	 * @param {Object} thisTbody  当前表格的tbody
	 * 
	 */
	setSpanVal:function(thisTbody){
		tabEdit.tableDatas=[];
		var isCanBeNull="";
		//1.遍历表格获取列表中的数据
		thisTbody.find("tr:not(.last-tr-add)").each(function(i,n){
				datas = $(this).find("span.td-val").getDatas();
				if($(n).find("label.yt-checkbox input").is(':checked')){
					isCanBeNull = "YES";
				}else{
					isCanBeNull = "NO";
				}
				datas.isCanBeNull=isCanBeNull;
				tabEdit.tableDatas.push(datas);
		});
		if(tabEdit.tableDatas!="" && tabEdit.tableDatas !=undefined && tabEdit.tableDatas.length>0){
			tabEdit.tableDatasJson = JSON.stringify(tabEdit.tableDatas);
		}
		/**
		 * 调用拼接数据方法
		 */
		tabEdit.setInputParamsOutParamsVal(thisTbody,tabEdit.tableDatas);
	},
	 /**
	  * 
	  * 添加一行数据
	  * @param {Object} obj 当前tbody对象
	  * 
	  */
	 addTabRow:function(obj){
	 	//标识,因为有两个地方点击添加新的一样,所以做区分
	 	var flag=0;
	 	//1.判断参数obj是否有值,没有代表初始调用,需要添加点击事件
	 	if(obj==undefined || obj==""){
	 		$('.edit-tab tbody').on('click', '.add-icon', function() {
	 			//1代表点击的是行内的加号
	 			flag=1;
	 			//2.调用添加一行数据的方法,将当前tbody传输
	 			tabEdit.addRow($(this).parent().parent().parent(),flag);
	 		});
	 	}else{
	 		//3.参数obj有值,直接调用添加一行数据的方法
	 		tabEdit.addRow(obj,flag);
	 	}
	 	
	},
	/**
	 * 拼接一行数据的方法
	 * @param {Object} obj  当前tbody
	 * @param {Object} flag 标识
	 */
	addRow:function(obj,flag){
		//1.定义变量拼接存储下拉列表数据
		var opts = '<option value="">请选择</option>';
		//2.遍历下拉列表中的数据
		$.each(tabEdit.selTestData, function(i,n) {
			opts += '<option value="'+n.name+'">'+n.name+'</option>';
		});
		//3.拼接tr字符串
		var trStr = '<tr>'
		          +'<td align="center"><span class="td-text name-text" data-text="parameterName"></span>'
		          +'<span class="td-val"><input type="text" class="yt-input name-val" name="parameterName" data-val="parameterName" placeholder="" style="width:220px;" validform="{isNull:true,size:10,blurFlag:true,validType:\'hoverBorder\',msg:\'<font color=red>*</font>名称不能为空,最多10个字\'}" /></span>'
		          +'</td>'
		          +'<td align="center"><span class="td-text type-text" data-text="parameterType"></span>'
		          +'<span class="td-val"><select class="yt-select type-val" name="parameterType" data-val="parameterType" validform="{isNull:true,validType:\'hoverBorder\',msg:\'<font color=red>*</font>类型不能为空,请选择\'}">' +
		opts +
		'</select></span>'
		+'</td>'
		+'<td align="center">'
		+'<span class="td-text is-null-text" data-text="isCanBeNull"></span>'
		+'<span class="td-val"><label class="check-label yt-checkbox"><input class="checkbox-inpu" type="checkbox" name="isCanBeNull" data-val="isCanBeNull" value=""/></label>'
		+'</span>'
		+'</td>'
		+'<td align="center">'
		+'<span class="td-text len-text" data-text="parameterLength"></span>'
		+'<span class="td-val">'
		+'<input type="text" class="yt-input len-val" name="parameterLength" data-val="parameterLength" style="width: 66px;" validform="{isNull:true,blurFlag:true,validType:\'hoverBorder\',type:\'^[0-9]+$\',msg:\'<font color=red>*</font>字段长度不能为空,只能输入数字\'}" />'
		+'</span>'
		+'</td>'
		+'<td align="center"><span class="td-text desc-text" style="text-align: left;" data-text="parameterDesc"></span>'
		+'<span class="td-val"><div class="textarea-div desc-val" contenteditable="true" name="parameterDesc" data-val="parameterDesc" validform="{isNull:true,size:20,blurFlag:true,validType:\'hoverBorder\',msg:\'<font color=red>*</font>最多20字\'}"><br /></div></span>'
		+'</td>';
		//判断标识,1代表行内点击加号操作,拼接的操作图标是加号图标
		if(flag==1){
			trStr+='<td align="center" class="handle-td">' +
			'<span class="add-icon"><img src="./resources/images/icons/t-add.png" class="table-add"></span>' +
			'</td>';
		}else{
			//反之,点击整体行中的加号,拼接的操作图标是删除图标
			trStr+='<td align="center" class="handle-td">' +
			'<span class="entry-del-icon"><img src="./resources/images/icons/t-del.png" class="table-add"></span>' +
			'</td>';
		}
		trStr+='</tr>';
		//4.将拼接的字符串装换jquery对象并赋值给变量
		var addElement = $(trStr);
		//5.新增一行中的加号点击事件
		addElement.find(".add-icon").on("click", function() {
			if(addElement.find("input").val()!="" && addElement.find("select").val() !=""){
				//调用添加一行方法
				tabEdit.addRow(addElement.parent(),1);
			}else{
				$yt_alert_Model.prompt("请填写完整信息");
				return false;
			}
		});
		//6.初始化调用下拉列表生成插件方法
		addElement.find("select").niceSelect();
		//7.获取当前tbody下的最后一行
		var lastStr = $(obj).find("tr").eq($(obj).find("tr").length-1);
		//8.判断传输参数obj是否存在或有值
		if(flag == 1){
			//参数flag是1说明点击的是,行内操作列中的加号进行添加,则要追加在这一行的后面
			lastStr.after(addElement);
			//找到当前行的上一行下面的操作td中的操作图标
	    	addElement.prev().find(".handle-td").html('<span class="entry-del-icon"><img src="./resources/images/icons/t-del.png" class="table-add"></span>');
		}else{
			//说明点击的是,最后带有加号行的,所以要追加在这一行的前面
			lastStr.before(addElement);
		}
		//9.调用删除一行数据方法
	    tabEdit.delTabRwo();
	    /**
		 * 10.表格行中,长度字段触发事件,验证输入内容是否是数字
		 */
		$(".len-val").off().on("keyup",function(){
			$(this).val($(this).val().replace(/[^\d]/g,''));
		});
		/**
		 * 11.设置默认选中是否允许为空
		 */
		addElement.find(".checkbox-inpu").setRadioState(true);
	},
    /**
	 *
	 * 删除一行数据方法
	 * 
	 */
	delTabRwo:function(){
		//删除一行数据
			$(".edit-tab tbody").find(".entry-del-icon").click(function() {
				var tr = $(this).parent().parent();
				$yt_alert_Model.alertOne({
					haveAlertIcon: false, //是否带有提示图标
					closeIconUrl: "", //关闭图标路径 
					leftBtnName: "确定", //左侧按钮名称,默认确定 
					rightBtnName: "取消", //右侧按钮名称,默认取消 
					cancelFunction: "", //取消按钮操作方法*/ 
					alertMsg: "数据删除将无法恢复,确认删除吗?", //提示信息 
					confirmFunction: function() {
						tr.remove();
					}
				});
			});
	},
	/**
	 * 
	 * 
	 * 获取表格数据
	 * 
	 */
	getEditTabData:function(){
		//定义测试数据
		var dataList=[
		{"parameterName":"PKId",
		 "parameterType":"Long",
		 "isCanBeNull":"YES",
		 "parameterLength":"10",
		 "parameterDesc":"主键Id"
		},
		{"parameterName":"userName",
		 "parameterType":"String",
		 "isCanBeNull":"NO",
		 "parameterLength":"30",
		 "parameterDesc":"用户姓名"
		},
		{"parameterName":"userCode",
		 "parameterType":"String",
		 "isCanBeNull":"YES",
		 "parameterLength":"10",
		 "parameterDesc":"用户code值"
		}
		];
		//1.判断数据集是否有数据
		if(dataList.length>0){
			tabEdit.tableDatas=dataList;
			//2.调用拼接表格数据的方法,传输当前tbody,和数据集
			tabEdit.setInputParamsOutParamsVal($(".update-tab tbody"),dataList);
		}else{
			//3.先清空tobdy中的数据
			$(".update-tab tbody").empty();
			//4.拼接一行无数据提示行
			var noTr = '<tr class="no-data-tr"><td colspan="5" align="center">暂无参数</td></tr>';
			//5.追加提示无数据行
			$(".update-tab tbody").append(noTr);
			//6.判断如果无数据,影藏操作列
			if($(".update-tab tbody").find(".no-data-tr")){
				$(".update-tab .handle-td").hide();
			}
		}
		//7.设置当前表格上的操作按钮,文本信息,图标,隐藏的标识值
		$(".update-tab").prev().find(".left-handle-font").text("修改");
		$(".update-tab").prev().find(".edit-title-icon").attr("src","./resources/images/icons/blue-edit.png");
		$(".update-tab").prev().find(".hid-flag").val(1);
	},
	/**
	 * 动态赋值输入参数集合,输出参数集合
	 * @param {Object} tbodyFlag  当前表格tbody标识
	 * @param {Object} paramsList      数据集
	 */
	setInputParamsOutParamsVal:function(tbodyFlag,dataList){
		//1.清空传入参数当前tobdy中内容
		$(tbodyFlag).empty();
		//2.显示当前表格上一个操作模块
		$(tbodyFlag).parent().prev().show();
		//3.定义空的字符串存储拼接内容
		var tabTr="";
		//4.遍历数据集,循环获取数据
		$.each(dataList, function(i,n) {
			tabTr='<tr>'
		          +'<td align="center">'
		          +'<span class="td-text name-text" data-text="parameterName">'+n.parameterName+'</span>'
		          +'<span class="td-val">'
		          +'<input type="text" class="yt-input name-val" data-val="parameterName" value="'+n.parameterName+'" placeholder="" style="width:220px;" />'
                  +'</span>'
                  +'</td>'
                  +'<td align="center">'
                  +'<span class="td-text type-text" data-text="parameterType">'+n.parameterType+'</span>'
	              +'<span class="td-val">'
	              +'<select name="" class="yt-select type-val" data-val="parameterType">';
	              tabTr+='<option value="">请选择</option>';
	              $.each(tabEdit.selTestData, function(v,t) {
	              	if(t.name == n.parameterType){
	              		tabTr+='<option value="'+t.name+'" selected="selected">'+t.name+'</option>';
	              	}else{
	              		tabTr+='<option value="'+t.name+'">'+t.name+'</option>';
	              	}
	              });
			      tabTr+='</select>'
		          +'</span>'
	              +'</td>'
	              +'<td align="center">'
	              +'<span class="td-text is-null-text" data-text="isCanBeNull">'+(n.isCanBeNull == "YES"?"允许":"不允许")+'</span>'
				  +'<span class="td-val">'		 
				  +'<label class="check-label yt-checkbox '+(n.isCanBeNull == "YES"?"check":"")+'">'			 
				  +'<input class="checkbox-inpu" type="checkbox" name="test" data-val="isCanBeNull" value="" checked="'+(n.isCanBeNull == "YES"?"checked":"")+'"/>'		 	  
                  +'</label>'				   
              	  +'</span></td>'		
              	  +'<td align="center">'
              	  +'<span class="td-text len-text" data-text="parameterLength">'+n.parameterLength+'</span>'
              	  +'<span class="td-val">'
              	  +'<input type="text" class="yt-input len-val" data-val="parameterLength" value="'+n.parameterLength+'" style="width: 66px;" />'
				  +'</span>'		
				  +'</td>'		
	              +'<td align="center">'
	              +'<span class="td-text desc-text" style="text-align: left;" data-text="parameterDesc">'+n.parameterDesc+'</span>'
                  +'<span class="td-val">'
                  +'<div class="textarea-div desc-val" contenteditable="true" data-val="parameterDesc">'+n.parameterDesc+'</div>'
	              +'</span>'
	              +'</td>';
		    tabTr+='<td  align="center" class="handle-td">'
		              +'<span class="entry-del-icon"><img src="./resources/images/icons/t-del.png" class="t-del.png"></span>'
	                  +'</td></tr>';
	    tbodyFlag.append(tabTr);
		});
		//5.显示当前tbody下的文本信息
		tbodyFlag.find("tr:not(.last-tr-null)").find(".td-text").css("display","inline-block");
		//6.隐藏显示当前tbody下的输入框
		tbodyFlag.find("tr:not(.last-tr-null)").find(".td-val").hide();
		//7.初始化调用下拉列表生成插件方法
		tbodyFlag.find("select.type-val").niceSelect();
		//8.隐藏表头的操作列
		tbodyFlag.parent().find(".handle-td").hide();
		//9.调用删除一行数据的方法
	    tabEdit.delTabRwo();
	    /**
		 * 10.参数表中,长度字段触发事件
		 */
		$(".len-val").off().on("keyup",function(){
			$(this).val($(this).val().replace(/[^\d]/g,''));
		});
		
	},
	 /**
	 * 
	 * 
	 * 初始遍历编辑表格中的下拉列表数据
	 * 
	 */
	getParamsType:function(){
		$(".edit-tab tbody select.type-val");
		$(".edit-tab tbody select.type-val").replaceWith('<select name="parameterType" data-val="parameterType" class="yt-select type-val"><option value="">请选择</option></select>');
		if(tabEdit.selTestData!="" && tabEdit.selTestData!=null){
			$.each(tabEdit.selTestData, function(i,n) {
			$(".edit-tab tbody select.type-val").append('<option value="'+n.name+'">'+n.name+'</option>');
			});
		}
		//重新初始化下拉列表插件
		$(".edit-tab tbody select.type-val").niceSelect();
	},
	/**
	 * 调用点击一行进行添加方法
	 */
    clickTrAdd:function(){
    	$(".last-tr-add").off().on("click",function(){
    		//验证标识
			var addFlag=true;
			//获取最后一行添加一行的上一行
			var lastPrevTr = $(this).prev();
			//判断当前tbody下的tr是否不止一行
			if($(this).parent().find("tr").length>1){
				$(this).parent().find("tr:not(.last-tr-add)").each(function(i,n){
					 if($(n).find("input").val() == "" && $(n).find("select").val() == "" && $(n).find(".textarea-div").text() ==""){
					  	$yt_alert_Model.prompt("存在空行未编辑,请检查...");
					 	addFlag=false;
					 	return false;
					  }
					  if($(n).find("input").val() == "" || $(n).find("select").val() == "" || $(n).find(".textarea-div").text() ==""){
					  	$yt_alert_Model.prompt("请填写完整信息");
					 	addFlag=false;
					 	return false;
					  }
				});
			}
			if(addFlag){
				tabEdit.addTabRow($(this).parent());
			}
    	});
    }
}
 $(function(){
	//初始化下拉列表插件
 	$(".edit-tab select").niceSelect();
 	//设置默认选中是否允许为空
	$(".edit-tab .checkbox-inpu").setRadioState(true);
	$(".edit-tab .checkbox-inpu").setRadioState(true);
 	//初始调用获取编辑表格中的下拉列表数据
 	tabEdit.getParamsType();
 	//调用添加编辑表格中操作列点击添加一行方法
 	tabEdit.addTabRow();
 	//调用编辑顶部操作按钮方法
 	tabEdit.tabHeardHandleEvent();
 	//调用获取数据方法
 	tabEdit.getEditTabData();
 	//调用点击一行进行添加方法
 	tabEdit.clickTrAdd();
 	//调用点击取消,编辑方法
	tabEdit.canelEdit();
 });