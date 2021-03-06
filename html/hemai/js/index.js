$(document).ready(function(){
	Y.use('mask',function(){
		Y.loading = Y.lib.MaskLay();
		Y.loading.noMask = true;
		var dlg_buy_end = Y.lib.MaskLay('#dlg_buysuc', '#dlg_buysuc_content');
		dlg_buy_end.addClose('#dlg_buysuc_back','#dlg_buysuc_close','#dlg_buysuc_close2');
		Y.extend('popBuyOk', function(user,lotid,projid){
			$('#dlg_buysuc_view').die().live('click', function(){
				window.location= $_sys.getlotdir(lotid)+$_sys.url.viewpath+'?lotid='+lotid+'&projid='+projid;
			});
			dlg_buy_end.pop('您好，'+user+'，恭喜您购买成功!');
		});
	});
	Y.use('mask', function(){
		var addMoneyDlg =  this.lib.MaskLay('#addMoneyLay');
		addMoneyDlg.addClose('#addMoneyClose','#addMoneyYes');
		Y.get('#addMoneyLay div.tantop').drag('#addMoneyLay');
		Y.extend('addMoney', function(){
			addMoneyDlg.pop('', function(e, btn){
				if(btn.id === 'addMoneyYes'){
					window.open($_user.daohang.addmoney);
				}			
			});
		});
	}); 
	
	
	
	searchUser = function(){
		if($("#findstr").val()==null || $("#findstr").val()==""){
			Y.alert("请输入用户名");
		}else{
		selectProject($("#findstr").val());
		}
	},
	
	
	
	viewHotUser = function(htmlid){
		$("#" + htmlid).html();
		var _lotid="00";
		if(Class.C('lotid')==30){
			_lotid=85;
		}else if(Class.C('lotid')==31){
			_lotid=70;
		}else if(Class.C('lotid')==32){
			_lotid=95;
		}else{
			_lotid=Class.C('lotid');
		}
		var _url = '/cpdata/phot/hotuser.json';
		if(Class.C('lotid') != '00'){_url = '/cpdata/phot/' + _lotid + '/hotuser.json';}
		Y.ajax({
			url : _url + "?rnd=" + Math.random(),
			type : "GET",
			dataType : "json",
			data:{},
			end : function(d) {
				var obj = eval("(" + d.text + ")");
				var r = undefined;
				if(!!obj.u){
					r = obj.u;
				} else if(!!obj.Resp.u){
					r = obj.Resp.u;
				}
				if(r != undefined){
					var hh = new Array();
					if(!this.isArray(r)){r=new Array(r);}
					r.each(function(rt,o){
						var cls = "";
						var clss = "";
						if(rt.id != ""){
						if(rt.f == 0){ cls = "title='该用户暂时没有方案'"; }else if(rt.f == 1){ cls = "title='该用户方案已满员'"; } else if(rt.f == 2){  cls = "title='该用户有方案在合买'"; }
						if(rt.f == 0 ){ clss ='<li><s class="white"></s>'}else if(rt.f == 1){ clss ='<li><s class="red"></s>' } else if(rt.f == 2){ clss ='<li><s class="blue"></s>' } 
						
						}
						var _tmp =clss+ '<a href="javascript:void(0)"'+cls+' onclick="selectProject(\'' + rt.id + '\')">' + rt.id + '</a></li>';
						
						hh.push(_tmp);
					});
					$("#" + htmlid).html(hh.join(""));
				}
			},
			error : function() {
				this.alert("网络故障!");
				return false;
			}
		});
	};
	selectProject = function(cnickid){
		if(!!$("#findstr")){$("#findstr").val(cnickid);}
		Class.C("findstr",cnickid);
		if(Class.C("lotid") == '00'){
			loadHotProj("select");
		}else{
			loadGameProj("select");
		}
	};
	loadPeriod = function(){
			Y.ajax({				
				url : "/cpdata/game/aopencode.json?rnd=" + Math.random(),
				type : "get",
				cache:false,
				dataType : "json",
				end : function(data) {
					var obj = eval("(" + data.text + ")");
					var r = obj.rows.rownow;
					var d = Y.getDate(data.date).format('YY-MM-DD');
					r.each(function(rt,o) {
						var nd = Y.getDate(rt.nowendtime).format('YY-MM-DD');
						if(nd==d){
							$('.nhmleft a[id='+rt.gid+']').append("<img src='/images/159/jrkj.png' />");
						}
						if(Class.C('lotid') == rt.gid){
							Class.C('nowpid', rt.nowpid);
						}
					});
				},
				error : function() {
					this.alert("网络故障!");
					return false;
				}
			});
	};
	page = function(pn){
		Class.C("pn",pn);
		if(Class.C("lotid") == '00'){
			
			loadHotProj();
		}else{
			loadGameProj();
		}
	};
	rengou = function(lotid,projid,id,lnum){
		Y.postMsg('msg_login', function (){
			var buynum = $("#" + id).val();
			if(buynum == ''){
				Y.alert('您好，认购份数不能为空！');
				return false;
			}
			if(buynum <= 0 || Y.getInt(buynum) != buynum){
				Y.alert('您好，认购份数必须为大于等于1的整数！');
				return false;
			}
			
			if(Y.getInt(buynum) > lnum){
				Y.alert('您好，认购份数不能大于剩余份数！');
				return false;
			}
			
			dobuy = function(){
				Y.alert('您好， 正在提交您的请求，请稍等...', false, true);
		    	Y.postMsg('msg_login', function (){	
			        Y.ajax(
			        {
						 url: $_trade.url.pjoin,
						 type:'POST',
						 data:{
							gid:lotid,
							hid:projid,
							bnum:buynum
						 },
			            end:function(d)
			            {
			            	var obj = eval("(" + d.text + ")");
		  					var code = obj.Resp.code;
		  					var desc = obj.Resp.desc; 
		        			Y.alert.close();
		        			if (code == "0") {        				
		        				Y.popBuyOk(Y.C('userName'),lotid,projid);
		        				page(Class.C("pn"));
		        				this.postMsg('msg_update_userMoney');//刷新余额，如果跳转，可能被浏览器取消                            
		        			} else {
		        				if (code=="6"){
		        					Y.addMoney();
		        				}else{
		        					Y.alert('对不起，认购失败,请重新认购！'+desc);
		        				}
		        				
		        			}
			            },
		        		error : function() {
		        			Y.alert("网络故障, 请检查您的帐户再重新投注!");
		        			return false;
		        		}
			        });   
		    	});
			};
			Y.confirm("您好，本次认购金额为"+buynum+"元，请确认！",dobuy,''); 
		});
	};
	gopage = function(){
		page($("#govalue").val());
	};
	loadGameProj = function(select){
		var data="";
		if(select){
			data={gid:Class.C('lotid'), pid:Class.C("expect"), state:Class.C("state"), find:Class.C("findstr"), fsort:Class.C("fsort"), dsort:Class.C("dsort"), ps:15, pn:Class.C("pn")};
		}else{
			data={gid:Class.C('lotid'), pid:Class.C("expect"), state:Class.C("state"), find:Class.C("findstr"), fsort:Class.C("fsort"), dsort:Class.C("dsort"), ps:Class.C("ps"), pn:Class.C("pn")};
		}
		
		$("#table_project_list tr[id]").remove();
		$(".paginachange").html("");
		Y.ajax({
			url : $_trade.url.plist,
			type : "POST",
			dataType : "json",
			data : data,
			end : function(d) {
				var obj = eval("(" + d.text + ")");
				var code = obj.Resp.code;
				var rb = !!obj.Resp.xml;
				if(rb){
					rb = !!obj.Resp.xml.row;
				}
				if(code == 0){
					if(rb){
						r = obj.Resp.xml.row;
						var _pagei = obj.Resp.xml.recordcount;
						if(!this.isArray(r)){r=new Array(r);}
						r.each(function(rt,o){
							var gameid =rt.cprojid.substr(2,2);
							
							var cl=o%2==0?"":"odd";
							var html = '<tr id='+rt.nid+' class = '+cl+'  >';
							html += '<td>';
							if(rt.iorder > 0  && rt.jindu != 100 && rt.nid < 15){
								html += '<img src="/images/index_93.gif" />';
							}else{
								html +=  parseInt(rt.nid)+1;
							}
							html += '</td>';
//							html += '<th>' + $_sys.showzhanjiname(gameid,rt.cnickid,'award') + '</th>';
							if(rt.cnickid=='******'){
								html += '<th><a >******</a></th>';
							}else{
								html += '<th>' + $_sys.showzhanjiname(gameid,rt.cnickid,'award') + '</th>';
							}
							html += '<th class="tdmark">' + (($_sys.showzhanji(rt.aunum ,rt.agnum)==''?'':$_sys.showzhanjii(gameid,rt.cnickid,rt.aunum,rt.agnum))) + '</th>';
							
							html += '<td>' + $_sys.getlotname(gameid).split("-")[0] + '</td>';
							if(rt.cnickid=='******'){
								html += '<td>******</td>';
							}else{
								html += '<td>' + parseFloat(rt.money).rmb(true) + '</td>';
							}
							html += '<td><p>' + rt.jindu + '%';
							if(rt.pnum > 0){
								html += '<font>(保' + Math.ceil(rt.pnum*100/rt.nums) + '%)</font>';
							}
							html += '</p> <p class="x_jdt"><em style="width: ' + rt.jindu + '%"></em></p></td>';
							html += '<td><font>' + rt.lnum + '</font></td>';
							if(rt.lnum == 0 || rt.istate != 1){
								if(rt.istate > 2){
									html += '<td>已撤单</td>';
								}else if(rt.istate == 2){
									html += '<td>已满员</td>';
								}else {
									html += '<td></td>';
								}
							}else{
								html += '<td><div><input type="text" value="1" id="rengou_' + rt.nid + '" /><a href="javascript:void(0);"><img src="/images/index_110.gif" class="gm" onclick="rengou(\''+gameid+'\',\''+rt.cprojid+'\',\'rengou_' + rt.nid +'\',\''+rt.lnum+'\')"/></a></div></td>';//lotid,projid,id,lnum
							}
							if(rt.cnickid=='******'){
								html += '<td>--</td>';
							}else{
								html += '<td><a href="' + $_sys.getlotdir(gameid)+$_sys.url.viewpath+'?lotid='+gameid+'&projid='+rt.cprojid + '" target="_blank">详情</a></td>';
							}html += '</tr>';
							$(html).appendTo($("#table_project_list"));
						});
//						for(var i = 1; i <= _pagei.pagesize-r.length;i++){
//							$("#table_project_list").append("<tr id='"+(r.length + i)+"'><td colspan='9' align='center' >&nbsp;</td></tr>");
//						}
						if(select){
							
						}else{
							var maxshow=5;
							
							var pagehtml='<ul><li style="line-height:27px;color:#444;padding-right:10px">共'+_pagei.records+'条</li><li class="disabled PagedList-skipToFirst"  ><a onclick="page(1)"  href="javascript:void(0)" >首页</a></li>';
							pagehtml += '<li class="PagedList-skipToNext"><a class="PagedList-skipToNext" title="上一页 " onclick="page('+(Class.C("pn")-1>0?(Class.C("pn")-1):1)+');" href="javascript:void(0)">上一页</a></li>';
							
							/*var pagehtml='<a class="disabled PagedList-skipToFirst" style="margin-right:5px" onclick="page(1)"  href="javascript:void(0)"">首页</A>';
							pagehtml += '<a class="PagedList-skipToNext" style="margin-right:5px" title="上一页 " onclick="page('+(Class.C("pn")-1>0?(Class.C("pn")-1):1)+');" href="javascript:void(0)">上一页</A>';*/
							var min=0;
							var max=0;
							var pn=Class.C("pn")*1;
							if ( _pagei.tp > maxshow){
							var pageTemp=parseInt(pn*1/maxshow);
							max = pageTemp*maxshow+maxshow;
							min = pageTemp*maxshow;
							
							if(max> _pagei.tp){
							max= _pagei.tp;
							}
							if(pn>min){
								min=min+1;
							}

							}else{
							min = 1;
							max = _pagei.tp;
							}
							var showpage=pn-maxshow>=0?((pn-maxshow)==0?1:(pn-maxshow)):maxshow
							/*for (var i=min;i<max*1+1;i++){
							if(min==pn && i==pn &&pageTemp>0){
								pagehtml+='<a href="javascript:void(0);" id="tp'+i+'" class="a4" onclick="page('+showpage+');">' + i + '</a>';
							}else if (i==pn){
								pagehtml+='<a href="javascript:void(0);" id="tp'+i+'" class="a4" onclick="page('+i+');">' + i + '</a>';
							} else{
								pagehtml+='<a href="javascript:void(0);" id="tp'+i+'" class="a3" onclick="page('+i+');">' + i + '</a>';
							}
							}*/
									
									for (var i=min;i<max*1+1;i++){
										if(min==pn && i==pn &&pageTemp>0){
											pagehtml+='<li class="active"><a href="javascript:void(0);" id="tp'+i+'" class="a4" onclick="page('+showpage+');">' + i + '</a></li>';
										}else if (i==pn){
											pagehtml+='<li class="active"><a href="javascript:void(0);" id="tp'+i+'" class="a4" onclick="page('+i+');">' + i + '</a></li>';

											
				/*							pagehtml+='<a href="javascript:void(0);" id="tp'+i+'" class="a4" onclick="page('+i+');">' + i + '</a>';
				*/						} else{
											pagehtml+='<li><a href="javascript:void(0);" id="tp'+i+'" class="a3" onclick="page('+i+');">' + i + '</a></li>';

											
				/*							pagehtml+='<a href="javascript:void(0);" id="tp'+i+'" class="a3" onclick="page('+i+');">' + i + '</a>';
				*/						}
										}
							pagehtml+='<li class="PagedList-skipToNext"><a onclick="page('+(pn+1>_pagei.tp?_pagei.tp:(pn+1))+');"  href="javascript:void(0)">下一页</a></li>';
							pagehtml+='<li class="disabled PagedList-skipToNext"><a onclick="page('+_pagei.tp+');" href="javascript:void(0)"> 尾页</a></li></ul>';
							
	/*						pagehtml+='<span class="gy">共'+_pagei.records+'条</span><a class="PagedList-skipToNext" style="margin-left:10px" onclick="page('+(pn+1>_pagei.tp?_pagei.tp:(pn+1))+');"  href="javascript:void(0)">下一页</a><a class="disabled PagedList-skipToFirst" style="margin-left:5px" onclick="page('+_pagei.tp+');" href="javascript:void(0)">尾页</a>';
	*/					    $('.paginachange').html(pagehtml);
							
						  
						    $("#govalue").val(pn);
						}
						
					    
					}else{
						$("div.rig_hm_main").css('padding-bottom','0');
						$("div.paginachange").hide();
						
//						$("#table_project_list").append("<tr id='err'><td colspan='9' align='center' >抱歉！没有找到符合条件的结果！</td></tr>");
						$("#table_project_list").append("<tr id='err' ><td colspan='9' align='center' style='line-height:218px'>当前暂无合买方案</td></tr>");
					}
				}else{
					Y.ajax({
						url : $_trade.url.hlist,
						type : "POST",
						dataType : "json",
						data : {
							find : Class.C("findstr"),
							pn : Class.C("pn"),
							ps : Class.C("ps")
						},
						end : function(d) {
							var obj = eval("(" + d.text + ")");
							var rb = !!obj.Resp.row;
							if(rb){
								r = obj.Resp.row;
								var _pagei = obj.Resp.recordcount;
								if(!this.isArray(r)){r=new Array(r);}
								r.each(function(rt,o){
									var gameid = rt.gid;
									var idx = (o+1) + (Class.C("pn")-1)*Class.C("ps");
									
									var cl=o%2==0?"":"odd";
									var html = '<tr id='+idx+' class = '+cl+'>';
									html += '<td>';
									if(rt.iorder > 0 && rt.jindu != 100 && idx <= 15){
										html += '<img src="/images/index_93.gif" />';
									}else{
										html += idx;
									}
									html += '</td>';
									html += '<th>' + $_sys.showzhanjiname(gameid,rt.nickid,'award') + '</th>';
									html += '<th class="tdmark">' + (($_sys.showzhanji(rt.aunum,rt.agnum)==''?'':$_sys.showzhanjii(gameid,rt.nickid,rt.aunum,rt.agnum))) + '</th>';
									
									html += '<td>' + $_sys.getlotname(gameid).split("-")[0] + '</td>';
									if(rt.nickid=='******'){
										html += '<td>******</td>';
									}else{
										html += '<td>' + parseFloat(rt.money).rmb(true) + '</td>';
									}
									html += '<td><p>' + rt.jindu + '%';
									if(rt.pnum > 0){
										html += '<font>(保' + Math.ceil(rt.pnum*100/rt.nums) + '%)</font>';
									}
									html += '</p> <p class="x_jdt"><em style="width: ' + rt.jindu + '%"></em></p></td>';
									html += '<td><font>' + rt.lnum + '</font></td>';
									if(rt.lnum == 0 || rt.state != 1){
										if(rt.state > 2){
											html += '<td>已撤单</td>';
										}else if(rt.state == 2){
											html += '<td>已满员</td>';
										}else {
											html += '<td></td>';
										}
									}else{
										html += '<td><div><input type="text" value="1" id="rengou_' + idx + '" /><a href="javascript:void(0);"><img src="/images/index_110.gif" class="gm" onclick="rengou(\''+gameid+'\',\''+rt.hid+'\',\'rengou_' + idx +'\',\''+rt.lnum+'\')"/></a></div></td>';//lotid,projid,id,lnum
									}
									if(rt.nickid=='******'){
										html += '<td>--</td>';
									}else{
										html += '<td><a href="' + $_sys.getlotdir(gameid)+$_sys.url.viewpath+'?lotid='+gameid+'&projid='+rt.hid + '" target="_blank">详情</a></td>';
									}html += '</tr>';
									$(html).appendTo($("#table_project_list"));
								});
								
								var maxshow=5;
								
								var pagehtml='<ul><li style="line-height:27px;color:#444;padding-right:10px">共'+_pagei.records+'条</li><li class="disabled PagedList-skipToFirst"  ><a onclick="page(1)"  href="javascript:void(0)" >首页</a></li>';
								pagehtml += '<li class="PagedList-skipToNext"><a class="PagedList-skipToNext" title="上一页 " onclick="page('+(Class.C("pn")-1>0?(Class.C("pn")-1):1)+');" href="javascript:void(0)">上一页</a></li>';
								
								/*var pagehtml='<a class="disabled PagedList-skipToFirst" style="margin-right:5px" onclick="page(1)"  href="javascript:void(0)"">首页</A>';
								pagehtml += '<a class="PagedList-skipToNext" style="margin-right:5px" title="上一页 " onclick="page('+(Class.C("pn")-1>0?(Class.C("pn")-1):1)+');" href="javascript:void(0)">上一页</A>';*/
								var min=0;
								var max=0;
								var pn=Class.C("pn")*1;
								if ( _pagei.tp > maxshow){
								var pageTemp=parseInt(pn*1/maxshow);
								max = pageTemp*maxshow+maxshow;
								min = pageTemp*maxshow;
								
								if(max> _pagei.tp){
								max= _pagei.tp;
								}
								if(pn>min){
									min=min+1;
								}

								}else{
								min = 1;
								max = _pagei.tp;
								}
								var showpage=pn-maxshow>=0?((pn-maxshow)==0?1:(pn-maxshow)):maxshow
								for (var i=min;i<max*1+1;i++){
								if(min==pn && i==pn &&pageTemp>0){
									pagehtml+='<li class="active"><a href="javascript:void(0);" id="tp'+i+'" class="a4" onclick="page('+showpage+');">' + i + '</a></li>';
								}else if (i==pn){
									pagehtml+='<li class="active"><a href="javascript:void(0);" id="tp'+i+'" class="a4" onclick="page('+i+');">' + i + '</a></li>';

									
		/*							pagehtml+='<a href="javascript:void(0);" id="tp'+i+'" class="a4" onclick="page('+i+');">' + i + '</a>';
		*/						} else{
									pagehtml+='<li><a href="javascript:void(0);" id="tp'+i+'" class="a3" onclick="page('+i+');">' + i + '</a></li>';

									
		/*							pagehtml+='<a href="javascript:void(0);" id="tp'+i+'" class="a3" onclick="page('+i+');">' + i + '</a>';
		*/						}
								}
								pagehtml+='<li class="PagedList-skipToNext"><a onclick="page('+(pn+1>_pagei.tp?_pagei.tp:(pn+1))+');"  href="javascript:void(0)">下一页</a></li>';
								pagehtml+='<li class="disabled PagedList-skipToNext"><a onclick="page('+_pagei.tp+');" href="javascript:void(0)"> 尾页</a></li></ul>';
								
								
		/*						pagehtml+='<span class="gy">共'+_pagei.records+'条</span><a class="PagedList-skipToNext" style="margin-left:10px" onclick="page('+(pn+1>_pagei.tp?_pagei.tp:(pn+1))+');"  href="javascript:void(0)">下一页</a><a class="disabled PagedList-skipToFirst" style="margin-left:5px" onclick="page('+_pagei.tp+');" href="javascript:void(0)">尾页</a>';
		*/					   
								$('.paginachange').html(pagehtml);
								
							    $("#govalue").val(pn);
							}else{
								$("div.rig_hm_main").css('padding-bottom','0');
								$("div.paginachange").hide();
								
//								$("#table_project_list").append("<tr id='err'><td colspan='9' align='center' >抱歉！没有找到符合条件的结果！</td></tr>");
								$("#table_project_list").append("<tr id='err' ><td colspan='9' align='center' style='line-height:218px'>当前暂无合买方案</td></tr>");
							}
						},
						error : function() {
							this.alert("网络故障!");
							return false;
						}
					});
				}
			},
			error : function() {
				this.alert("网络故障!");
				return false;
			}
		});
	};
	loadHotProj = function(select){
		$("#table_project_list tr[id]").remove();
		$("#table_project_list span").remove();
		$("#table_project_list thead a").each(function(){
			$(this).parent().html($(this).text());
		});
		$(".hm_left_t2").addClass("hm_left_tcur");
		$(".paginachange").html("");
		if(!!Class.C("findstr")){
			Y.ajax({
				url : $_trade.url.hlist,
				type : "POST",
				dataType : "json",
				data : {
					find : Class.C("findstr"),
					pn : Class.C("pn"),
					ps : select?15:Class.C("ps")
				},
				
				end : function(d) {
					var obj = eval("(" + d.text + ")");
					var rb = !!obj.Resp.row;
					if(rb){
						r = obj.Resp.row;
						var _pagei = obj.Resp.recordcount;
						if(!this.isArray(r)){r=new Array(r);}
						r.each(function(rt,o){
							if(select){
								if(o<15){
									var gameid = rt.gid;
									//var nickid = rt.nickid;
									var idx = (o+1) + (Class.C("pn")-1)*Class.C("ps");
									
									var cl=o%2==0?"":"odd";
									var html = '<tr id='+idx+' class = '+cl+'>';
									html += '<td>';
									if(rt.iorder > 0 && rt.jindu != 100 && idx <= 15){
										html += '<img src="/images/index_93.gif" />';
									}else{
										html += idx;
									}
									html += '</td>';
									if(rt.nickid=='******'){
										html += '<th>******</th>';
									}else{
										html += '<th>' + $_sys.showzhanjiname(gameid,rt.nickid,'award') + '</th>';
									}
									
									html += '<th class="tdmark">' + (($_sys.showzhanji(rt.aunum,rt.agnum)==''?'':$_sys.showzhanjii(gameid,rt.nickid,rt.aunum,rt.agnum))) + '</th>';
									
									html += '<td>' + $_sys.getlotname(gameid).split("-")[0] + '</td>';
									if(rt.nickid=='******'){
										html += '<td>******</td>';
									}else{
										html += '<td>' + parseFloat(rt.money).rmb(true) + '</td>';
									}
									html += '<td><p>' + rt.jindu + '%';
									if(rt.pnum > 0){
										html += '<font>(保' + Math.ceil(rt.pnum*100/rt.nums) + '%)</font>';
									}
									html += '</p> <p class="x_jdt"><em style="width: ' + rt.jindu + '%"></em></p></td>';
									html += '<td><font>' + rt.lnum + '</font></td>';
									if(rt.lnum == 0 || rt.state != 1){
										if(rt.state > 2){
											html += '<td>已撤单</td>';
										}else if(rt.state == 2){
											html += '<td>已满员</td>';
										}else {
											html += '<td></td>';
										}
									}else{
										html += '<td><div><input type="text" value="1" id="rengou_' + idx + '" /><a href="javascript:void(0);"><img src="/images/index_110.gif" class="gm" onclick="rengou(\''+gameid+'\',\''+rt.hid+'\',\'rengou_' + idx +'\',\''+rt.lnum+'\')"/></a></div></td>';//lotid,projid,id,lnum
									}
									if(rt.nickid=='******'){
										html += '<td>--</td>';
									}else{
										html += '<td><a href="' + $_sys.getlotdir(gameid)+$_sys.url.viewpath+'?lotid='+gameid+'&projid='+rt.hid + '" target="_blank">详情</a></td>';
									}html += '</tr>';
									$(html).appendTo($("#table_project_list"));
								}
							}else{
								var gameid = rt.gid;
								//var nickid = rt.nickid;
								var idx = (o+1) + (Class.C("pn")-1)*Class.C("ps");
								
								var cl=o%2==0?"":"odd";
								var html = '<tr id='+idx+' class = '+cl+'>';
								html += '<td>';
								if(rt.iorder > 0 && rt.jindu != 100 && idx <= 15){
									html += '<img src="/images/index_93.gif" />';
								}else{
									html += idx;
								}
								html += '</td>';
								if(rt.nickid=='******'){
									html += '<th>******</th>';
								}else{
									html += '<th>' + $_sys.showzhanjiname(gameid,rt.nickid,'award') + '</th>';
								}
								
								html += '<th class="tdmark">' + (($_sys.showzhanji(rt.aunum,rt.agnum)==''?'':$_sys.showzhanjii(gameid,rt.nickid,rt.aunum,rt.agnum))) + '</th>';
								
								html += '<td>' + $_sys.getlotname(gameid).split("-")[0] + '</td>';
								if(rt.nickid=='******'){
									html += '<td>******</td>';
								}else{
									html += '<td>' + parseFloat(rt.money).rmb(true) + '</td>';
								}
								html += '<td><p>' + rt.jindu + '%';
								if(rt.pnum > 0){
									html += '<font>(保' + Math.ceil(rt.pnum*100/rt.nums) + '%)</font>';
								}
								html += '</p> <p class="x_jdt"><em style="width: ' + rt.jindu + '%"></em></p></td>';
								html += '<td><font>' + rt.lnum + '</font></td>';
								if(rt.lnum == 0 || rt.state != 1){
									if(rt.state > 2){
										html += '<td>已撤单</td>';
									}else if(rt.state == 2){
										html += '<td>已满员</td>';
									}else {
										html += '<td></td>';
									}
								}else{
									html += '<td><div><input type="text" value="1" id="rengou_' + idx + '" /><a href="javascript:void(0);"><img src="/images/index_110.gif" class="gm" onclick="rengou(\''+gameid+'\',\''+rt.hid+'\',\'rengou_' + idx +'\',\''+rt.lnum+'\')"/></a></div></td>';//lotid,projid,id,lnum
								}
								if(rt.nickid=='******'){
									html += '<td>--</td>';
								}else{
									html += '<td><a href="' + $_sys.getlotdir(gameid)+$_sys.url.viewpath+'?lotid='+gameid+'&projid='+rt.hid + '" target="_blank">详情</a></td>';
								}html += '</tr>';
								$(html).appendTo($("#table_project_list"));
							}
							
						});
						
						var maxshow=5;
						
						var pagehtml='<ul><li style="line-height:27px;color:#444;padding-right:10px">共'+_pagei.records+'条</li><li class="disabled PagedList-skipToFirst"  ><a onclick="page(1)"  href="javascript:void(0)" >首页</a></li>';
						pagehtml += '<li class="PagedList-skipToNext"><a class="PagedList-skipToNext" title="上一页 " onclick="page('+(Class.C("pn")-1>0?(Class.C("pn")-1):1)+');" href="javascript:void(0)">上一页</a></li>';
						
						/*var pagehtml='<a class="disabled PagedList-skipToFirst" style="margin-right:5px" onclick="page(1)"  href="javascript:void(0)"">首页</A>';
						pagehtml += '<a class="PagedList-skipToNext" style="margin-right:5px" title="上一页 " onclick="page('+(Class.C("pn")-1>0?(Class.C("pn")-1):1)+');" href="javascript:void(0)">上一页</A>';*/
						var min=0;
						var max=0;
						var pn=Class.C("pn")*1;
						if ( _pagei.tp > maxshow){
						var pageTemp=parseInt(pn*1/maxshow);
						max = pageTemp*maxshow+maxshow;
						min = pageTemp*maxshow;
						
						if(max> _pagei.tp){
						max= _pagei.tp;
						}
						if(pn>min){
							min=min+1;
						}

						}else{
						min = 1;
						max = _pagei.tp;
						}
						var showpage=pn-maxshow>=0?((pn-maxshow)==0?1:(pn-maxshow)):maxshow
						for (var i=min;i<max*1+1;i++){
						if(min==pn && i==pn &&pageTemp>0){
							pagehtml+='<li class="active"><a href="javascript:void(0);" id="tp'+i+'" class="a4" onclick="page('+showpage+');">' + i + '</a></li>';
						}else if (i==pn){
							pagehtml+='<li class="active"><a href="javascript:void(0);" id="tp'+i+'" class="a4" onclick="page('+i+');">' + i + '</a></li>';

							
/*							pagehtml+='<a href="javascript:void(0);" id="tp'+i+'" class="a4" onclick="page('+i+');">' + i + '</a>';
*/						} else{
							pagehtml+='<li><a href="javascript:void(0);" id="tp'+i+'" class="a3" onclick="page('+i+');">' + i + '</a></li>';

							
/*							pagehtml+='<a href="javascript:void(0);" id="tp'+i+'" class="a3" onclick="page('+i+');">' + i + '</a>';
*/						}
						}
						pagehtml+='<li class="PagedList-skipToNext"><a onclick="page('+(pn+1>_pagei.tp?_pagei.tp:(pn+1))+');"  href="javascript:void(0)">下一页</a></li>';
						pagehtml+='<li class="disabled PagedList-skipToNext"><a onclick="page('+_pagei.tp+');" href="javascript:void(0)"> 尾页</a></li></ul>';
						
						
/*						pagehtml+='<span class="gy">共'+_pagei.records+'条</span><a class="PagedList-skipToNext" style="margin-left:10px" onclick="page('+(pn+1>_pagei.tp?_pagei.tp:(pn+1))+');"  href="javascript:void(0)">下一页</a><a class="disabled PagedList-skipToFirst" style="margin-left:5px" onclick="page('+_pagei.tp+');" href="javascript:void(0)">尾页</a>';
*/					   
						$('.paginachange').html(pagehtml);
						
					    $("#govalue").val(pn);
					}else{
						$("div.rig_hm_main").css('padding-bottom','0');
						$("div.paginachange").hide();
						
//						$("#table_project_list").append("<tr id='err'><td colspan='9' align='center' >抱歉！没有找到符合条件的结果！</td></tr>");
						$("#table_project_list").append("<tr id='err' ><td colspan='9' align='center' style='line-height:218px'>当前暂无合买方案</td></tr>");
					}
				},
				error : function() {
					this.alert("网络故障!");
					return false;
				}
			});
		}else{
			Y.ajax({
				url : '/cpdata/phot/' + Class.C("pn") + '.json?r=' + Math.random(),
				type : "GET",
				dataType : "json",
				data : {},
				end : function(d) {
					var obj = eval("(" + d.text + ")");
					var rb = !!obj.Resp.row;
					if(rb){
						r = obj.Resp.row;
						var _pagei = obj.Resp.recordcount;
						if(!this.isArray(r)){r=new Array(r);}
						r.each(function(rt,o){
							var gameid = rt.gid;
							var idx = (o+1) + (Class.C("pn")-1)*Class.C("ps");
							
							var cl=o%2==0?"":"odd";
							var html = '<tr id = '+idx+' class='+cl+'>';
							html += '<td>';
							if(rt.iorder > 0 && rt.jindu != 100 && idx <= 15){
								html += '<img src="/images/index_93.gif" />';
							}else{
								html += idx;
							}
							html += '</td>';
							html += '<th>' + $_sys.showzhanjiname(gameid,rt.nickid,'award') + '</th>';
							html += '<th class="tdmark">' + (($_sys.showzhanji(rt.aunum,rt.agnum)==''?'':$_sys.showzhanjii(gameid,rt.nickid,rt.aunum,rt.agnum))) + '</th>';
							
							html += '<td>' + $_sys.getlotname(gameid).split("-")[0] + '</td>';
							html += '<td>' + parseFloat(rt.money).rmb(true) + '</td>';
							html += '<td><p>' + rt.jindu + '%';
							if(rt.pnum > 0){
								html += '<font>(保' + Math.ceil(rt.pnum*100/rt.nums) + '%)</font>';
							}
							html += '</p> <p class="x_jdt"><em style="width: ' + rt.jindu + '%"></em></p></td>';
							html += '<td><font>' + rt.lnum + '</font></td>';
							if(rt.lnum == 0 || rt.state != 1){
								if(rt.state > 2){
									html += '<td>已撤单</td>';
								}else if(rt.state == 2){
									html += '<td>已满员</td>';
								}else {
									html += '<td></td>';
								}
							}else{
								html += '<td><div><input type="text" value="1" onkeyup="if(this.value>'+rt.lnum+')this.value='+rt.lnum+';" id="rengou_' + idx + '" /><a href="javascript:void(0);"><img src="/images/index_110.gif" class="gm" onclick="rengou(\''+gameid+'\',\''+rt.hid+'\',\'rengou_' + idx +'\',\''+rt.lnum+'\')"/></a></div></td>';//lotid,projid,id,lnum
							}
							if(rt.cnickid=='******'){
								html += '<td>--</td>';
							}else{
								html += '<td><a href="' + $_sys.getlotdir(gameid)+$_sys.url.viewpath+'?lotid='+gameid+'&projid='+rt.hid + '" target="_blank">详情</a></td>';
							}html += '</tr>';
							$(html).appendTo($("#table_project_list"));
//						$("th.tdmark").hover(function(){
//							$(this).find("b.lv_boxs").show();
//						},function(){
//							$(this).find("b.lv_boxs").hide();
//						})
						});
						
						var maxshow=5;
						var pagehtml='<ul><li style="line-height:27px;color:#444;padding-right:10px">共'+_pagei.records+'条</li><li class="disabled PagedList-skipToFirst"  ><a onclick="page(1)"  href="javascript:void(0)" >首页</a></li>';
						pagehtml += '<li class="PagedList-skipToNext"><a class="PagedList-skipToNext" title="上一页 " onclick="page('+(Class.C("pn")-1>0?(Class.C("pn")-1):1)+');" href="javascript:void(0)">上一页</a></li>';
						
/*						var pagehtml='<a class="disabled PagedList-skipToFirst" style="margin-right:5px" onclick="page(1)"  href="javascript:void(0)"">首页</A>';
						pagehtml += '<a class="PagedList-skipToNext" style="margin-right:5px" title="上一页 " onclick="page('+(Class.C("pn")-1>0?(Class.C("pn")-1):1)+');" href="javascript:void(0)">上一页</A>';*/
						var min=0;
						var max=0;
						var pn=Class.C("pn")*1;
						if ( _pagei.tp > maxshow){
						var pageTemp=parseInt(pn*1/maxshow);
						max = pageTemp*maxshow+maxshow;
						min = pageTemp*maxshow;
						
						if(max> _pagei.tp){
						max= _pagei.tp;
						}
						if(pn>min){
							min=min+1;
						}

						}else{
						min = 1;
						max = _pagei.tp;
						}
						var showpage=pn-maxshow>=0?((pn-maxshow)==0?1:(pn-maxshow)):maxshow
								for (var i=min;i<max*1+1;i++){
									if(min==pn && i==pn &&pageTemp>0){
										pagehtml+='<li class="active"><a href="javascript:void(0);" id="tp'+i+'" class="a4" onclick="page('+showpage+');">' + i + '</a></li>';
									}else if (i==pn){
										pagehtml+='<li class="active"><a href="javascript:void(0);" id="tp'+i+'" class="a4" onclick="page('+i+');">' + i + '</a></li>';

										
			/*							pagehtml+='<a href="javascript:void(0);" id="tp'+i+'" class="a4" onclick="page('+i+');">' + i + '</a>';
			*/						} else{
										pagehtml+='<li><a href="javascript:void(0);" id="tp'+i+'" class="a3" onclick="page('+i+');">' + i + '</a></li>';

										
			/*							pagehtml+='<a href="javascript:void(0);" id="tp'+i+'" class="a3" onclick="page('+i+');">' + i + '</a>';
			*/						}
									}
						/*for (var i=min;i<max*1+1;i++){
						if(min==pn && i==pn &&pageTemp>0){
							pagehtml+='<a href="javascript:void(0);" id="tp'+i+'" class="a4" onclick="page('+showpage+');">' + i + '</a>';
						}else if (i==pn){
							pagehtml+='<a href="javascript:void(0);" id="tp'+i+'" class="a4" onclick="page('+i+');">' + i + '</a>';
						} else{
							pagehtml+='<a href="javascript:void(0);" id="tp'+i+'" class="a3" onclick="page('+i+');">' + i + '</a>';
						}
						}*/
						
						pagehtml+='<li class="PagedList-skipToNext"><a onclick="page('+(pn+1>_pagei.tp?_pagei.tp:(pn+1))+');"  href="javascript:void(0)">下一页</a></li>';
						pagehtml+='<li class="disabled PagedList-skipToNext"><a onclick="page('+_pagei.tp+');" href="javascript:void(0)"> 尾页</a></li></ul>';
						
/*						pagehtml+='<span class="gy">共'+_pagei.records+'条</span><a class="PagedList-skipToNext" style="margin-left:10px" onclick="page('+(pn+1>_pagei.tp?_pagei.tp:(pn+1))+');"  href="javascript:void(0)">下一页</a><a class="disabled PagedList-skipToFirst" style="margin-left:5px" onclick="page('+_pagei.tp+');" href="javascript:void(0)">尾页</a>';
*/					    $('.paginachange').html(pagehtml);
						
					    $("#govalue").val(pn);
					}else{
						$("div.rig_hm_main").css('padding-bottom','0');
						$("div.paginachange").hide();
						
//						$("#table_project_list").append("<tr id='err'><td colspan='9' align='center' >抱歉！没有找到符合条件的结果！</td></tr>");
						$("#table_project_list").append("<tr id='err' ><td colspan='9' align='center' style='line-height:218px'>当前暂无合买方案</td></tr>");
					}
				},
				error : function() {
					this.alert("网络故障!");
					return false;
				}
			});
		}
	};
	cachePeriod = function(){
		var lotid = Class.C('lotid');
		if(lotid == 30) lotid = 85;
		$(".hm_left_t2").removeClass("hm_left_tcur");
		Y.ajax({
			url : '/cpdata/game/'+lotid+'/c.json',
			type : "GET",
			dataType : "json",
			data : {},
			end : function(d) {
				var obj = eval("(" + d.text + ")");
				if(obj.period.code == 0){
					var r = obj.period.row;
					if(!this.isArray(r)){r=new Array(r);}
					var slt = $("#expectlist");
					var index = 0;
					r.each(function(rt,o){
						if(rt.flag==1){
							//index=o;Class.C("expect",rt.pid);
							if((parseInt(Class.C('lotid'))<85) ||  (parseInt(Class.C('lotid'))>=85 && o==0)){
								index=o;Class.C("expect",rt.pid);
							}
						}
					});
					r.each(function(rt,o){
						if(o<10){
							var op = $("<option></option>");
							op.attr("value",rt.pid+'|' + rt.et+'|'+rt.fet);
							op.html(rt.pid + (rt.flag==1 && o==index?'当前期':(parseInt(Class.C('lotid'))>=85?'历史期':(rt.flag==1?'预售期':'历史期'))));
							op.appendTo(slt);
						}
					});
					Class.C("expectlist", r);
					$("#expectlist option:eq("+index+")").attr("selected", true);
					$("#expectlist").change(function(){
						expectInfo($("#expectlist").val());
					});
					expectInfo($("#expectlist").val());
				}else{
					this.alert("加载期次失败!");
				}
			},
			error : function() {
				this.alert("网络故障!");
				return false;
			}
		});
		
	};
	psort = function(obj,fsort){
		Class.C("fsort",fsort);
		$("span[id^='sort_']").each(function(o,r){
		
			if($(r).attr("id") == obj){
				var cls = $(r).attr("class");
				if(cls == "hm_sx1" || cls == "hm_sx3"){
					
					$(r).removeClass().addClass("hm_sx2");
					Class.C("dsort","");
				} else if(cls == 'hm_sx2'){
					$(r).removeClass().addClass("hm_sx3");
					Class.C("dsort","descending");
				}
			}else{
				$(r).removeClass().addClass("hm_sx1");
			}
		});
		loadGameProj();
	};
	expectInfo = function(obj){
		var arr = obj.split("|");
		if(arr.length >= 3){
			var title = $_sys.getlotname(Class.C("lotid"));
			if(Class.C("lotid")==30) title = "北单";
			$(".p_h_ts em").html(title+"合买方案");
			$(".p_h_ts i").html("第"+arr[0]+"期");
			$(".p_h_ts #etinfo").html("截止时间："+Y.getDate(arr[1]).format('MM-DD hh:mm')+"（单式："+Y.getDate(arr[2]).format('hh:mm')+"）");
			Class.C("expect",arr[0]);
			loadGameProj();
		}else{
			log(obj);
		}
	};
	initHM = function (glist){
		glist.each(function(o,gr){
			if($(gr).attr("id") == Class.C('lotid')){ $(gr).addClass("cur"); }else{ $(gr).removeClass("cur"); }
			$(gr).find("img").remove();
			$(gr).unbind("click").click(function(){
				if($(gr).attr("id") == '00'){
					location.href="/hemai/index.html";
				}else{
					location.href="/hemai/index.html?lotid=" + $(gr).attr("id");
				}
			});
		});
	};
	initPage = function(){
		var lotid = location.search.getParam('lotid');
		if(!!lotid){
			Class.C('lotid', lotid);
		}else{
			Class.C('lotid', "00");
		}
		Class.C("findstr","");
		Class.C("fsort","jindu");
		Class.C("dsort","descending");
		Class.C("state","0");
		Class.C("expect","");
		Class.C("pn","1");
		Class.C("ps","30");
		loadPeriod();
		if(Class.C('lotid') == 30||Class.C('lotid') == 31||Class.C('lotid') == 32||Class.C('lotid') ==50||Class.C('lotid')== 1||Class.C('lotid')== 80||Class.C('lotid')== 81||Class.C("lotid") == '00'){
		viewHotUser('list_hotuser');
		}
		var glist = $(".nhmleft a[id]");
		var ghlist = $(".hm_left_t2 p a[id]");
		initHM(glist);
		initHM(ghlist);
		$("#nicksearch").click(function(){
			selectProject($("#findstr").val());
		})
		
		if(Class.C("lotid") == '00'){
			$(".nhmrtop").remove();
			$(".top-caiz").remove();
			$(".hm_right_t").show();
			$(".annotation").hide();
			$(".annotations,#expectem").hide();
			
			loadHotProj();
			$("#start_hms").click(function(){
					location.href=$_sys.getlotdir(Class.C('lotid'));
			});
		}
		else if(Class.C('lotid') == 03||Class.C('lotid') == 53||Class.C('lotid') == 30||Class.C('lotid')== 81||Class.C('lotid')== 82||Class.C('lotid')== 83){
			$(".top-caiz").show();
			$(".hemai").hide();
			$(".annotation").hide();
			$(".hm_right_t,#expectem,.annotations").show();
			cachePeriod();
			$("#start_hm").click(function(){
				if(Class.C('lotid') == 30){
					location.href=$_sys.getlotdir(85);
				}else{
					location.href=$_sys.getlotdir(Class.C('lotid'));
				}
				
			});
			$("#start_hmss").click(function(){
				if(Class.C('lotid') == 30){
					location.href=$_sys.getlotdir(85);
				}else{
					location.href=$_sys.getlotdir(Class.C('lotid'));
				}
				
			});
			
		
		}else if(Class.C('lotid') ==50||Class.C('lotid')== 1||Class.C('lotid')== 80){

			$(".top-caiz").show();
			$(".hemai").hide();
			$(".annotation,#expectem").show();
			if(Class.C('lotid') ==50||Class.C('lotid')== 1){
				$(".annotation").html("注：单个方案合买成功盈利超过10000元（含10000元），则获得一个钻石，当期方案个数不限。")
			}
			$(".annotations").hide();
			$(".hm_right_t").show();
			cachePeriod();
			$("#start_hm").click(function(){
				if(Class.C('lotid') == 30){
					location.href=$_sys.getlotdir(85);
				}else{
					location.href=$_sys.getlotdir(Class.C('lotid'));
				}
				
			});
			$("#start_hmss").click(function(){
				if(Class.C('lotid') == 30){
					location.href=$_sys.getlotdir(85);
				}else{
					location.href=$_sys.getlotdir(Class.C('lotid'));
				}
				
			});
			
		
		
		}
		else if(parseInt(Class.C('lotid'))<90 && Class.C('lotid') != 70 && Class.C('lotid') != 71 && Class.C('lotid') != 72 && Class.C('lotid') != 31 && Class.C('lotid') != 32 && Class.C('lotid') != 30){
			$(".hm_right_t").remove();
			$(".top-caiz").show();
			$(".hemai").hide();
			
			cachePeriod();
			$("#start_hm").click(function(){
				location.href=$_sys.getlotdir(Class.C('lotid'));
			});
			$("#start_hmss").click(function(){
				location.href=$_sys.getlotdir(Class.C('lotid'));
			});
			
		
		}
		else{
			$(".annotation,#expectem").hide();
			$(".annotations").show();
			$(".nhmrtop").remove();
			
			$(".hm_right_t").show();
			if(Class.C('lotid') == 31||Class.C('lotid') == 32||(Class.C('lotid')<98&&Class.C('lotid')>89 )||Class.C('lotid') == 70||Class.C('lotid') == 71||Class.C('lotid') == 72){
				$(".top-caiz").remove();
				
				$("#start_hms").click(function(){
				if(Class.C('lotid') == 31){	
					location.href=$_sys.getlotdir(70);}
				if(Class.C('lotid') == 32){
					location.href=$_sys.getlotdir(71);}
				});
			}else{
				
			}
			
			loadGameProj();
			
			
		}
	};
//	 goTotop=function (){
//	        var isIE=!!window.ActiveXObject;
//	        var isIE6 = isIE&&!window.XMLHttpRequest;
//	        var btn = $("#goTotop");
//	        var left = 0;
//	        var top = $(window).height()-247;
//	        var ietop = $(window).height()-247+$(window).scrollTop();
//	        var flag = true;
//	        $(window).resize(function(){
//	            btn.css({"position":"fixed",top:top,left:left});
//	            if(isIE6)btn.css({"position":"absolute",top:ietop,left:left});
//	        })
//	        btn.css({"position":"fixed",top:top,left:left});
//	        var areaTop = Y.get("div.hm_right").getXY().y;
//	        $(window).scroll(function(){
//	        	 if ($(this).scrollTop() > areaTop){//跟踪对齐当滚动条超过右侧区域则开始滚动
//		            	var V = $('div.hm_right');
//		        		if (V[0]) {
//		        			var T = $(document),
//		        			H = $("div.hm_left").eq(0),
//		        			M = H.offset().top + H.outerHeight(),
//		        			F = V.innerWidth(),
//		        			B = V.offset().top,
//		        			L = V.outerHeight(), 
//		        			u = T.scrollTop();
//		        			Z = Math.min(0, M - (L + u));
//		        			
//
//		        			if(H.outerHeight()>V.eq(0).outerHeight()){
////		        				 Y.get("#right_area").setStyle('z-index: 1; top:'+Z+'px;  left: auto;position: static;');
//		        				 Y.get("div.hm_right").setStyle('z-index: 1; top:0;  right: auto;position: static;');
//		        			}else{
//			        				if (B == Z) {
//		  	        				V.css({right: "auto", top: "auto",width: F, position: "static"});
//		  	        			} else {
//		  	        				if(isIE6){
//		  	        					V.css({right: '10px;',top: Z+$(window).scrollTop(), width: F,position: "absolute"});
//		  	        				}else{
//		  	        					V.css({right: '464px',top: Z, width: F, position: "fixed"});
//		  	        				};
//		  	        			}
//		        				Y.get("div.hm_right").setStyle('z-index: 1;');
//		        			}
//		        		}
//		            	
//		             }else{//停止浮动对齐
//	            	 Y.get("div.hm_right").setStyle('z-index: 1; top:0;  right: auto;position: static;');
//	            }
//	        	
//	            if(flag)
//	            {
//	                btn.show();
//	                flag = false;
//	            }
//	            if($(this).scrollTop() == 0)
//	            {
//	                btn.hide();
//	                flag = true;
//	            }
//	            btn.css({"position":"fixed",top:top,left:left});
//	            ietop = $(window).height()-247+$(window).scrollTop();
//	            if(isIE6)btn.css({"position":"absolute",top:ietop,left:left});
//	        })
//	    };
	initPage();
//	goTotop();
});