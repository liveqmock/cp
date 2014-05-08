/* LineSelector 北单行选择器*/
Class( 'LineSelector', {
	index : function(config) {

		this.vsLine       = config.tr;
		this.vsIndex      = config.vsIndex;
		this.vsOptions    = config.vsOptions;
		this.vsCheckAll   = config.vsCheckAll;
		this.spTag        = config.spTag;
		this.vsInfo       = config.vsInfo;
		this.allA		  = config.allA;

		this.disabled     = this.vsInfo.disabled === 'yes';
		this.index        = this.vsInfo.index;
		this.data         = [];  //本行的投注结果
		this.codeValIdx   = Class.config('codeValueIndex');

		this.bindEvent();
		if (this.disabled && !Class.config('stopSale')) {
			this.vsIndex.disabled = true;
		}
		this.vsIndex.checked = true;
		!this.disabled && this.initClearAll(); //初始时全不选中

		// 取消某一选项的选择
		this.onMsg('msg_touzhu_cancel', function(line_index, ck_value) {
			if (this.index == line_index) {
				var ck_index, ck;
				ck_index = this.getIndex(Class.config('codeValue'), ck_value);
				ck = this.vsOptions[ck_index].getElementsByTagName('input')[0];
				this.unCheck(ck);
				return false; //停止消息传递
			}
		});

	},

	// 绑定相关事件
	bindEvent : function() {
		var Y = this;

		// 鼠标经过每一行时改变样式
		this.get(this.vsLine).hover( function() {
			this.children[0].style.backgroundColor = '#fee6ad';
			this.children[2].style.backgroundColor = '#fee6ad';
			this.children[3].style.backgroundColor = '#fee6ad';
			this.children[4].style.backgroundColor = '#fee6ad';
			this.children[5].style.backgroundColor = '#fee6ad';
			this.children[6].style.backgroundColor = '#fee6ad';
			this.children[7].style.backgroundColor = '#fee6ad';
			this.children[8].style.backgroundColor = '#fee6ad';
			Y.get(this).find(".h_br").addClass("h_brx");
          	 Y.get(this).find(".label_cd").removeClass("h_brx");
		}, function() {
			this.children[0].style.backgroundColor = '';
			this.children[2].style.backgroundColor = '';
			this.children[3].style.backgroundColor = '';
			this.children[4].style.backgroundColor = '';
			this.children[5].style.backgroundColor = '';
			this.children[6].style.backgroundColor = '';
			this.children[7].style.backgroundColor = '';
			this.children[8].style.backgroundColor = '';
             Y.get(this).find(".h_br").removeClass("h_brx");
             Y.get(this).find(".label_cd").removeClass("h_brx");
		} );
		// Y.use('mask', function (){
    			// Y.get('#dshelp').setStyle('zIndex', 1).tip('data-help', 1, false, 360);// 帮助说明
    		// });
//        $('#vsTable  tr[value] .h_br').mouseout(function (e, Y){//鼠标滑入滑出效果
//            var tdCSS=$(this).find('.chbox').attr("checked")==true?"h_br label_cd":"h_br h_brx";
//            $(this).attr("class",tdCSS);
//        });

		// 点击隐藏某场比赛
		this.vsIndex.onclick = function() {
			Y.hideLine();
		}

		if (this.disabled) return;

		// 点击选项进行投注
		for (var i = 0, l = this.vsOptions.length; i < l; i++) {
			this.vsOptions[i].parentNode.onmousedown = function() {
				var ck = this.getElementsByTagName('input')[0];
				ck.checked ? Y.unCheck(ck) : Y.check(ck);
			}
		}

		// 全选/全不选
		this.vsCheckAll.parentNode.onmousedown = function() {
			var ck = this.getElementsByTagName('input')[0];
			ck.checked = !ck.checked;
			ck.checked ? Y.checkAll() : Y.clearAll();
		}
	},

	check : function(ck) {
		this.data[this.codeValIdx[ck.value]] = ck.value;
		ck.checked = true;
		//ck.parentNode.parentNode.style.backgroundColor = '#FFDAA4';
		Y.addClass(ck.parentNode.parentNode, 'label_cd');
		this.vsCheckAll.checked = this.getData().length == this.vsOptions.length;
		this.allA.innerHTML=this.getData().length == this.vsOptions.length?'清':'全';
		this.changed();
	},

	unCheck : function(ck) {
		this.data[this.codeValIdx[ck.value]] = undefined;
		ck.checked = false;
		//ck.parentNode.parentNode.style.backgroundColor = '';
		Y.removeClass(ck.parentNode.parentNode, 'label_cd');
		this.vsCheckAll.checked && (this.vsCheckAll.checked = false);
		this.allA.innerHTML='全';
		this.changed();
	},

	checkAll : function() {
		this.data = Class.config('codeValue').slice();
		this.vsCheckAll.checked = true;
		for (var i = 0, l = this.vsOptions.length; i < l; i++) {
			this.vsOptions[i].getElementsByTagName('input')[0].checked = true;
			this.allA.innerHTML='清';
			//this.vsOptions[i].parentNode.style.backgroundColor = '#FFDAA4';
			Y.removeClass(this.vsOptions[i].parentNode, "h_brx");
			Y.addClass(this.vsOptions[i].parentNode, 'label_cd');
		}
		this.changed();
	},

	clearAll : function() {
		this.data = [];
		this.vsCheckAll.checked = false;
		for (var i = 0, l = this.vsOptions.length; i < l; i++) {
			this.vsOptions[i].getElementsByTagName('input')[0].checked = false;
			this.allA.innerHTML='全';
			//this.vsOptions[i].parentNode.style.backgroundColor = '';
			Y.removeClass(this.vsOptions[i].parentNode, 'label_cd');
		}
		this.changed();
	},

	initClearAll : function() {
		var ck = this.vsLine.getElementsByTagName('input');
		for (var i = 1, l = ck.length; i < l; i++) {
			ck[i].checked = false;
		}
	},

	hideLine : function() {  //隐藏当前行
		if (this.vsLine.style.display != 'none') {
			this.vsLine.style.display = 'none';
			this.getData().length > 0 && this.clearAll();
			!this.vsIndex.disabled && this.postMsg('msg_one_match_hided');
			Y.C('autoHeight') && this.postMsg('msg_update_iframe_height');
		}
	},

	showLine : function() {  //显示当前行
		if (this.vsLine.style.display == 'none') {
			this.vsLine.style.display = '';
			this.vsIndex.checked = true;
			!this.vsIndex.disabled && this.postMsg('msg_one_match_showed');
			Y.C('autoHeight') && this.postMsg('msg_update_iframe_height');
		}
	},

	// 获取本行投注数据
	getData : function() {
		if (this.disabled) return [];
		return this.data.each( function(d) {
			d && this.push(d);
		}, [] );
	},

	// 选中某些特定的选项
	checkCertainVsOptions : function(ck_value) {
		var code_value = Class.config('codeValue').slice();
		ck_value.split(',').each( function(v) {
			var i = this.getIndex(code_value, v);
			this.check(this.vsOptions[i].getElementsByTagName('input')[0]);
		}, this );
	},

	// 更新SP值
	updateSP : function(sp_values) {
		if (this.spTag && !this.disabled) {
			this.spTag.each( function(item, index) {
				var sp_old, sp_new, arrow = '';
				sp_old = parseFloat(item.innerHTML);
				sp_new = parseFloat(sp_values[index]);
				this.get(item).removeClass('red').removeClass('green');
				if (sp_new > sp_old) {
					this.get(item).addClass('red');
					arrow = '↑';
				} else if (sp_new < sp_old) {
					this.get(item).addClass('green');
					arrow = '↓';
				}
				if (Class.config('playName') == 'jq' || Class.config('playName') == 'bq') {
					arrow = '';  //进球和半全不显示箭头
				}
				item.innerHTML = sp_new ? sp_new.toFixed(2) + arrow : '--';
			}, this );
		}
	},

	changed : function() {
		this.postMsg('msg_line_selector_changed');
	}

} );


/*对阵列表选择*/
Class( 'TableSelector', {

	vsInfo : [],
	hiddenMatchesNum : 0,
	codes  : [],

	index : function(config) {
		var Y = this;

		this.vsTable = this.need(config.vsTable);
		if (Class.config('playName') == 'rqspf') {
			this.ckRangqiu   = this.need(config.ckRangqiu);
			this.ckNoRangqiu = this.need(config.ckNoRangqiu);
		}
		this.ckOutOfDate = this.need(config.ckOutOfDate);
		this.hiddenMatchesNumTag = this.need(config.hiddenMatchesNumTag);
		this.matchShowTag = this.need(config.matchShowTag);
		this.matchFilter  = this.need(config.matchFilter);
		this.leagueShowTag  = this.need(config.leagueShowTag);
		this.leagueSelector = this.need(config.leagueSelector);
		this.selectAllLeague      = this.need(config.selectAllLeague);
		this.selectOppositeLeague = this.need(config.selectOppositeLeague);
		this.removeAllLeague =this.need(config.removeAllLeague);
		this.wdls =this.need(config.wdls);

		this.stopSale = Class.config('stopSale');
		this.allEnd = this.get('#out_of_date_matches').val() == this.get('#all_matches').val(); //全部截止

		this.initVsTrs(config.vsLines);  //建立好各个单行对象

		this.onMsg('msg_line_selector_changed', this.changed);

		this.onMsg('msg_touzhu_line_cancel', function(index) {
			if(index.length>1){
				for(var i=0;i<index.length;i++){
					this.vsTrs[index[i] - 1].clearAll();
				}
			}else{
				this.vsTrs[index - 1].clearAll();
			}
		} );

		this.onMsg('msg_get_touzhu_codes', function() {
			return this.codes;
		} );

		this.onMsg('msg_get_codes_4_submit', function() {
			return this.getCodes4Submit();
		} );
		
		// 为显示奖金预测提供相关数据
		this.onMsg('msg_get_data_4_prize_predict', function() {
			return this.getData4PrizePredict();
		} );

		// 返回修改时重现之前选择的比赛
		this.onMsg('msg_restore_codes', function(codes) {
			this.restoreCodes(codes);
		} );
		this.initMatchFilter();  //赛事过滤
	},

	initVsTrs : function(vs_lines) {
		var Y = this, input_length = 0;
		this.vsTrs = this.need(vs_lines).each( function(tr, i) {
			var vs_info = Y.dejson(tr.getAttribute('value'));
			var tr2 = document.getElementById('sp_lines_' + vs_info.index);
			input_length == 0 && (input_length = tr.getElementsByTagName('input').length);
			this[i] = Y.lib.LineSelector( {
				tr           : tr,
				vsIndex      : tr.getElementsByTagName('input')[0],
				vsOptions    : tr.getElementsByTagName('label'),
				vsCheckAll   : tr.getElementsByTagName('input')[input_length - 1],
				spTag        : Y.get('span[mark=sp]', tr2),
				tr2			 : tr2,
				vsInfo       : vs_info,
				allA		 : tr.getElementsByTagName('a')[0]
			} );
			Y.vsInfo[vs_info.index] = vs_info;  //存储所有比赛的相关数据
		}, [] );
	},

	// 获取所有行的投注数据
	getCodes : function() {
		this.codes = this.vsTrs.each( function (item) {
			if (item.disabled) return;
			var _data = item.getData();
			if (_data.length > 0) {
				this.push( {
					'index' : item.index,
					'arr'   : _data,
					'dan'   : false,
					'vsInfo': item.vsInfo
				} );
			}
		}, [] );
		return this.codes;
	},

	// 获取投注数据
	getCodes4Submit : function() {
		var codes, danma, arr_danma;
		codes = new Array();
		danma = new Array();
		arr_danma = this.postMsg('msg_get_danma').data;
		this.vsTrs.each( function(item) {
			var i, v;
			v = item.getData();
			i = item.index;
			if (v.length > 0) {
				var tmp_code = '';
				tmp_code = i + ':[';
				tmp_code += v.each( function(v2) {
					this.push( v2 );
				}, [] ).join(',');
				tmp_code += ']';
				codes.push(tmp_code);
				arr_danma[i] == true && danma.push(tmp_code);
			}
		} );
		return { 'codes':codes.join('/'), 'danma':danma.join('/') }; 
	},

	// 为显示奖金预测提供相关数据
	getData4PrizePredict : function() {
		var Y = this;
		return this.vsTrs.each( function(item, i) {
			var sp = [], vs_info;
			if (item.spTag) {
				sp = item.spTag.each( function(item2) {
					this.push( parseFloat(item2.innerHTML) || 0 );
				}, [] );
			}
			vs_info = Y.vsInfo[item.index];
			this.push( {
				'serialNumber' : item.index,
				'lg'    : vs_info.leagueName,
				'main'  : vs_info.homeTeam,
				'guest' : vs_info.guestTeam,
				'rq'    : vs_info.rangqiuNum,
				'sp'    : sp
			} );
		}, [] );
	},

	changed : function() {
		this.postMsg('msg_table_selector_changed', this.getCodes());
	},

	initMatchFilter : function() {
		var Y = this;

		// 几个复选框的初始状态
		if (Class.config('playName') == 'rqspf') {
			this.ckRangqiu.prop('checked', true);
			this.get('#rangqiu_tag').html(this.get('#rangqiu_matches').val());
			this.ckNoRangqiu.prop('checked', true);
			this.get('#no_rangqiu_tag').html(this.get('#no_rangqiu_matches').val());
		}
		this.ckOutOfDate.prop('checked', false);
		this.get('#out_of_date_tag').html(this.get('#out_of_date_matches').val() + '场');

		this.initVsDisplay(); //初始化对阵的显示情况

		this.onMsg('msg_update_hidden_matches_num', function() {
			Y.hiddenMatchesNumTag.html(Y.hiddenMatchesNum);
		} );

		// 设定消息，以改变隐藏比赛数量的显示
		this.onMsg('msg_one_match_showed', function() {
			Y.hiddenMatchesNum--;
			Y.postMsg('msg_update_hidden_matches_num');
		} );
		this.onMsg('msg_one_match_hided', function() {
			Y.hiddenMatchesNum++;
			Y.postMsg('msg_update_hidden_matches_num');
		} );

		this.onMsg('msg_show_certain_league', function(league_name) {
			Y.showCertainLeague(league_name);
		} );

		// 成块地显示或隐藏某归属日期下的所有赛事
		this.onMsg('msg_show_or_hide_matches', function(id, obj) {
			if (Y.get(obj).html().indexOf('隐藏') != -1) {
				Y.need('#'+id).hide();
				Y.get(obj).html('显示');
			} else {
				Y.need('#'+id).show();
				Y.get(obj).html('隐藏');
			}
			Y.C('autoHeight') && this.postMsg('msg_update_iframe_height');
		} );

		// 显示或隐藏有让球的场次
		if (Class.config('playName') == 'rqspf') {
			this.ckRangqiu.click( function() {
				var be_controlled = Y.stopSale || Y.ckOutOfDate.prop('checked');
				Y.vsTrs.each( function(item) {
					if (Y.vsInfo[item.index].rangqiuNum != 0 && (!item.disabled || be_controlled)) {
						this.checked ? item.showLine() : item.hideLine();
					}
				}, this );
			} );
			// 显示或隐藏非让球的场次
			this.ckNoRangqiu.click( function() {
				var be_controlled = Y.stopSale || Y.ckOutOfDate.prop('checked');
				Y.vsTrs.each( function(item) {
					if (Y.vsInfo[item.index].rangqiuNum == 0 && (!item.disabled || be_controlled)) {
						this.checked ? item.showLine() : item.hideLine();
					}
				}, this );
			} );
		}

		// 显示或隐藏已截止的场次
		this.ckOutOfDate.click( function() {
			var be_controlled = true;
			Y.vsTrs.each( function(item) {
				if (Class.config('playName') == 'rqspf') {
					be_controlled = (Y.vsInfo[item.index].rangqiuNum != 0 && Y.ckRangqiu.prop('checked')) || 
										(Y.vsInfo[item.index].rangqiuNum == 0 && Y.ckNoRangqiu.prop('checked'));
				}
				if (item.disabled && be_controlled) {
					this.checked ? item.showLine() : item.hideLine();
				}
			}, this );
			//this.checked ? Y.showAllTBody() : Y.hideSpareTBody();
			this.checked && Y.showAllTBody();
		} );

		// 点击已隐藏比赛的数量则显示所有的比赛
		this.hiddenMatchesNumTag.click( function() {
			if (this.innerHTML != '0') {
				Y.showAllMatches();
			}
		} );

		// 显示或隐藏联赛选择区域
		var timeout_id;
		this.leagueShowTag.mouseover( function() {
			if (Y.get("#lglist").innerHTML == '') {
				Y.createLeagueList();  //生成联赛选择列表
			}
			clearTimeout(timeout_id);
			Y.leagueSelector.show();
			Y.leagueShowTag.find("div.matchxz").addClass('matchxzc');
		} );
		this.leagueShowTag.mouseout( function() {
			timeout_id = setTimeout( function() {
				Y.leagueSelector.hide();
				Y.leagueShowTag.find("div.matchxz").removeClass('matchxzc');
			}, 100);
		} );
		this.leagueSelector.mouseover( function() {
			clearTimeout(timeout_id);
			Y.leagueSelector.show();
		} );
		

		// 选择或隐藏某个指定的联赛
		this.leagueSelector.live('#lglist input', 'click', function(e, ns) {
			Y.vsTrs.each( function(item) {
				if (Y.vsInfo[item.index].leagueName == this.value && 
				        (!item.disabled || Y.stopSale || Y.ckOutOfDate.prop('checked'))) {
					this.checked ? item.showLine() : item.hideLine();
				}
			}, this );
		} );
		//显示五大联赛
		this.wdls.click(function(){
			if($(this).attr("checked")){
				 Y.get("#lglist input").prop('checked', false);
     		   $("input[value='西甲']").attr("checked",true);
	            	$("input[value='德甲']").attr("checked",true);
	            	$("input[value='法甲']").attr("checked",true);
	            	$("input[value='意甲']").attr("checked",true);
	            	$("input[value='英超']").attr("checked",true);
     	   }else if(!$(this).attr("checked")){
     		   Y.get("#lglist input").prop('checked', true);
     	   }
			Y.vsTrs.each( function(item) {
				if ((Y.vsInfo[item.index].leagueName !="西甲"&&Y.vsInfo[item.index].leagueName !="德甲"&&Y.vsInfo[item.index].leagueName !="法甲"&&Y.vsInfo[item.index].leagueName !="意甲"&&Y.vsInfo[item.index].leagueName !="英超") && (!item.disabled )) {
					this.checked ?item.hideLine() : Y.showAllMatches();
				}else{
//					item.showLine()
				}
			}, this );
		
		});
		// 全选所有联赛
		this.selectAllLeague.click( function() {
			Y.showAllMatches();
		} );
		this.removeAllLeague.click(function(){
			Y.removeAllMatches();
		})
		// 反选所有联赛
		this.selectOppositeLeague.click( function() {
			Y.leagueSelector.find('ul input').each( function(item) {
				item.click();
			} );
		} );

		// 显示或隐藏赛事筛选区域
		this.matchShowTag.drop( this.matchFilter, { 
			y : this.ie ? 7 : -1,
			x : this.ie ? 0 : -1,
			focusCss : 'dc_all_s dc_all_on',
			onshow : function() {
				this.matchShowTag.find('s').swapClass('c_down', 'c_up');
			},
			onhide : function() {
				this.matchShowTag.find('s').swapClass('c_up', 'c_down');
			}
		} );
	},

	// 返回修改时重现之前选择的比赛
	restoreCodes : function(codes) {
		codes.each( function(obj) {
			this.vsTrs[obj.index - 1].checkCertainVsOptions(obj.arr);
		}, this );
	},

	// 更新SP值
	updateSP : function() {
		this.ajax( {
		url :	'/static/info/bjdc/sp/just_' + Class.config('expect') + '_' + Class.config('playId') + '.xml',
		end :	function(data) {
					var Y = this;
					if (data.xml) {
						this.qXml('/w/*', data.xml, function(obj, i) {
							var sp_values = new Array();
							for (var j = 1, l = Class.config('codeValue').length * 2; j <= l; j += 2) {
								sp_values.push(obj.items['c' + j]);
							}
							this.vsTrs[i].updateSP(sp_values);
						} );
						setTimeout( function() { Y.updateSP() }, 5*60*1000 );  //每隔一段时间再取一次
					} else {
						setTimeout( function() { Y.updateSP() }, 5000 );  //失败后短时间内再次请求
					}
				}
		} );
	},

	// 显示所有赛事
	showAllMatches : function() {
		this.vsTrs.each( function(item) {
			if (!item.disabled || this.stopSale || this.ckOutOfDate.prop('checked')) {
				item.showLine();
			}
		}, this );
		this.leagueSelector.find('ul input').each( function(item) {
			!item.checked && (item.checked = true);
		},this );
		this.matchShowTag.html('全部比赛' + this.matchShowTag.html().substr(4));
		if (Class.config('playName') == 'rqspf') {
			this.ckRangqiu.prop('checked', true);
			this.ckNoRangqiu.prop('checked', true);
		}
	},
	removeAllMatches:function(){
		this.vsTrs.each( function(item) {
			if (!item.disabled || this.stopSale || this.ckOutOfDate.prop('checked')) {
				item.hideLine();
			}
		}, this );
		this.leagueSelector.find('ul input').each( function(item) {
			item.checked && (item.checked = false);
		},this );
		this.matchShowTag.html('全部比赛' + this.matchShowTag.html().substr(4));
		if (Class.config('playName') == 'rqspf') {
			this.ckRangqiu.prop('checked', false);
			this.ckNoRangqiu.prop('checked', false);
		}
	},
	// 只显示某个特定的联赛(用于资讯区的跳转)
	showCertainLeague : function(league_name) {
		this.vsTrs.each( function(item) {
			if (item.vsInfo.leagueName == league_name && (!item.disabled || this.stopSale || this.allEnd)) {
				item.showLine();
			} else {
				item.hideLine();
			}
		}, this );
		this.createLeagueList();
		this.leagueSelector.find('ul input').each( function(item) {
			item.checked = item.value == league_name;
		},this );
	},

	// 初始化对阵的显示情况
	initVsDisplay : function() {
		var Y = this;
		var arr_tbody = this.vsTable.find('tbody').filter( function(tBody) {
			return tBody.id && /^\d+-\d+-\d+$/.test(tBody.id)
		} );
		if (this.stopSale || this.allEnd) {
			Class.config('disableBtn', true); //此时禁用代购或合买按钮
		}
		if (this.stopSale == true) {
			this.ckOutOfDate.prop('checked', true);
			this.ckOutOfDate.prop('disabled', true);
		} else if (this.allEnd) {
			this.ckOutOfDate.prop('checked', true);
			this.ckOutOfDate.prop('disabled', true);
			this.showAllMatches();
		}else {
			arr_tbody.nodes.each( function(item, index) {
				if (this.get(item).getSize().offsetHeight == 0) {
					document.getElementById('switch_for_' + item.id).getElementsByTagName('a')[0].style.visibility = 'hidden';
				//	this.get('#switch_for_' + item.id).parent('tbody').hide(); //其他归属日期下所有的比赛均截止时，该tbody同样要隐藏
				}
			}, this );
		}
	},

	// 显示所有的tbody
	showAllTBody : function() {
		this.get('tbody', this.vsTable).show();
	},

	// 显示特定的一些比赛
	showCertainMatches : function(arr_matches) {
		this.vsTrs.each( function(item) {
			this.getIndex(arr_matches, item.index) !== -1 ? item.showLine() : item.hideLine();
		}, this );
	},

	// 生成联赛选择列表
	createLeagueList : function() {
		var Y = this;
		var arr_league = [];
		var league_list_html = '';
		var match_num_of_league = {};
		Y.vsTrs.each( function(item) {
			var league_name = Y.vsInfo[item.index].leagueName;
			if ( !item.disabled || Y.stopSale || Y.allEnd ) {
				if ( arr_league.join('|').indexOf(league_name) == -1 ) {
					arr_league.push(league_name);
					league_list_html += '<li><label><input type="checkbox" class="chbox" checked="checked" value="' + league_name + '" />' + league_name + '</label></li>';
				}
				if (typeof match_num_of_league[league_name] == 'undefined') {
					match_num_of_league[league_name] = 1;
				} else {
					match_num_of_league[league_name]++;
				}
			}
		} );
		Y.get(league_list_html).insert(Y.leagueSelector.find('ul'));
	}
});


/* TouzhuInfo 北单投注信息(一行)
------------------------------------------------------------------------------*/
Class( 'TouzhuInfoLine', {

	index : function(config) {
		this.index     = config.index;
		this.homeTeam  = config.homeTeam;
		this.guestTeam = config.guestTeam;
		this.endTime   = config.endTime;

		// 接收消息，生成某条特定的投注信息
		this.onMsg('msg_get_tr_html', function(oTr) {
			if (oTr.index == this.index) {
				return this.createTrHtml(oTr);
			}
		} );

		// 接收消息，返回单场比赛的截止时间
		this.onMsg('msg_get_endtime', function(line_index) {
			if (line_index == this.index) {
				return this.endTime;
			}
		} );
	},

	// 生成一行投注信息的html
	createTrHtml : function(oTr) {
		var tr_html, td_html, play_name, danma;
		td_html = '';
		play_name = Class.config('playName');
		oTr.arr.each( function(v) {
			td_html += '<span class="' + (play_name == 'jq' ? 'x_sz' : 'x_s yl') + '" value="' + this.index + '|' + v + '">' + v + '</span>';
		}, this );
		danma = this.postMsg('msg_get_danma').data;
		if (play_name == 'rqspf') {
			tr_html = '<tr>' + 
						  '<td>' + 
							  '<input type="checkbox" class="chbox" checked="checked" onclick="Yobj.postMsg(\'msg_touzhu_line_cancel\', ' + this.index + ')" />' + 
							  '<span class="chnum">' + this.index + '</span>' + 
						  '</td>' +
						  '<td class="t1" title="' + this.homeTeam + ' (' + oTr.vsInfo.rangqiuNum + ') ' + this.guestTeam + '">' + this.homeTeam + '</td>' +
						  '<td class="t1">' + td_html + '</td>' +
						  '<td><input type="checkbox" class="dan" value="' + this.index + '"' + (danma[this.index] ? ' checked="checked"' : '') + ' />' +
					  '</tr>';
		} else {
			tr_html = '<tr>' + 
						  '<td>' + 
							  '<input type="checkbox" class="chbox" checked="checked" onclick="Yobj.postMsg(\'msg_touzhu_line_cancel\', ' + this.index + ')" />' + 
							  '<span class="chnum">' + this.index + '</span>' + 
						  '</td>' +
						  '<td>' + this.homeTeam + '<span class="sp_vs">VS</span>' + this.guestTeam + '</td>' +
						  '<td><input type="checkbox" class="dan" value="' + this.index + '"' + (danma[this.index] ? ' checked="checked"' : '') + ' />' +
					  '</tr>' +
					  '<tr>' +
						  '<td colspan="3" style="padding-left:2px;">' + td_html + '</td>' +
					  '</tr>';
		}
		return tr_html;
	}
	
} );


/* TouzhuInfo 北单投注信息
------------------------------------------------------------------------------*/
Class( 'TouzhuInfo', {

	matchNum : 0,
	danma : {},
	danmaNum : 0,

	index : function(config) {
		var Y = this;

		this.endtime = this.get(config.endtime);	
		this.touzhuTable = this.need(config.touzhuTable);
		this.checkboxclear = this.need(config.checkboxclear);
		this.touzhuTrs = this.need(config.vsLines).each( function(tr, i) {
			var vs_info = Y.dejson(tr.getAttribute('value'));
			this[i] = Y.lib.TouzhuInfoLine( vs_info );
		}, []);

		// 接收消息，更新投注信息
		this.onMsg('msg_table_selector_changed', function(data) {
			this.updateTouzhuInfoArea(data);
			this.storeDanma();
			if (this.danmaNum == this.matchNum) { //更新后当胆码数与场次数相等时，清空胆码
				this.disableOrEnableDanma(-1);
				this.storeDanma();
			}
			this.changed();
		} );

		this.onMsg('msg_get_danma', function() {
			return this.danma;
		} );

		// 禁用或恢复胆码复选框
		this.onMsg('msg_disable_or_enable_danma', function(gg_match_num) {
			this.disableOrEnableDanma(gg_match_num);
		} );

		this.spanCss = Class.config('playName') == 'jq' ? 'x_sz' : 'x_s';
		
		// 鼠标经过时显示一横线
		this.touzhuTable.live('span.' + Y.spanCss, 'mouseover', function(e, _y) {
			_y.get(this).addClass(config.mouseoverClass);
		} ).live('span.' + Y.spanCss, 'mouseout', function(e, _y) {
			_y.get(this).removeClass(config.mouseoverClass);
		} );

		// 点击取消选择
		this.touzhuTable.live('span.' + Y.spanCss, 'click', function(e, _y) {
			var a = _y.get(this).attr('value').split('|');
			_y.postMsg('msg_touzhu_cancel', a[0], a[1])
		} );
		// 点击清空
		this.checkboxclear.live('.jcq_kcur','click', function() {
			var boxnum=$("#touzhu_table .chnum").length;
			var myArray=new Array(boxnum);
			
			for(var i=0;i<boxnum;i++){
				myArray[i]=$("#touzhu_table .chnum").eq(i).html();
			}
				Yobj.postMsg('msg_touzhu_line_cancel',myArray);
			
		} );
		// 点击胆码时
		this.touzhuTable.live('input.dan', 'click', function() {
			Y.storeDanma();
			Y.postMsg('msg_disable_or_enable_ggck', Y.danmaNum);
		} );

		// 返回修改时重现之前选择的胆码
		this.onMsg('msg_restore_danma', function(danma) {
			this.touzhuTable.find('input.dan').each( function(item) {
				if (this.getIndex(danma, item.value) !== -1) {
					this.get(item).prop('checked', true);
				}
			}, this );
			this.storeDanma();
			this.postMsg('msg_disable_or_enable_ggck', this.danmaNum);
		} );

	},

	// 更新投注信息区域, 返回所选比赛的数量
	updateTouzhuInfoArea : function(data) {
		var Y, earliest_endtime, match_num;
		Y = this;
		earliest_endtime = '2099-12-30 00:00';
		match_num = 0;
		this.endtime.html('');
		this.touzhuTable.empty();
		data.each( function(item) {
			var endtime = Y.postMsg('msg_get_endtime', item.index).data;
			endtime < earliest_endtime && (earliest_endtime = endtime); //取得最早截止时间

			var tr = Y.postMsg('msg_get_tr_html', item).data; // 发送消息，获取生成行的html
			Y.get(tr).insert(Y.touzhuTable);
			match_num++;
		} );
		earliest_endtime != '2099-12-30 00:00' && Y.endtime.html(this.getDate(earliest_endtime).format('MM-DD hh:mm'));
		this.matchNum = match_num;
	},

	// 获取胆码
	storeDanma : function() {
		this.danma = {};
		this.danmaNum = 0;
		this.touzhuTable.find('input.dan').each( function(item) {
			this.danma[item.value] = item.checked;
			this.danma[item.value] && this.danmaNum++;
		}, this );
	},

	disableOrEnableDanma : function(gg_match_num) {
		this.touzhuTable.find('input.dan').each( function(item) {
			if (gg_match_num == -1) { //清除胆码选择
				item.disabled = false;
				this.get(item).prop('checked', false);
			} else if (gg_match_num == -2) { //禁用所有胆码
				item.disabled = true;
				this.get(item).prop('checked', false);
			} else if (gg_match_num == 0 || this.danmaNum < gg_match_num - 1) { //恢复胆码
				if (!item.checked && !item.disabled) {
					return;
				}
				item.disabled = false;
			} else { //禁用未选中的胆码
				!item.checked && (item.disabled = true);
			}
			this.storeDanma();
		}, this );
	},

	changed : function() {
		this.postMsg('msg_touzhu_info_changed', this.matchNum, this.danmaNum);
	}

} );

/* TableSelector_BF 北单对阵列表选择器(比分玩法)
------------------------------------------------------------------------------*/
Class( 'TableSelector > TableSelector_BF', {

	initVsTrs : function(vs_lines) {
		var Y = this;
		this.vsTrs = Y.need(vs_lines).each( function(tr, i) {
			var vs_info = Y.dejson(tr.getAttribute('value'));
			var tr2 = document.getElementById('sp_lines_' + vs_info.index);
			var cks = tr2.getElementsByTagName('input');
			this[i] = Y.lib.LineSelector_BF( {
				tr        : tr,
				vsIndex   : tr.getElementsByTagName('input')[0],
				expandSp  : Y.need('a.expand_sp', tr).one(),
				vsInfo    : vs_info,
				tr2       : tr2,
				spTag     : Y.get('span[mark=sp]', tr2),
				vsOptions : tr2.getElementsByTagName('label'),
				vsCheckAllWin  : cks[10],
				vsCheckAllDraw : cks[16],
				vsCheckAllLose : cks[27]
			} );
			Y.vsInfo[vs_info.index] = vs_info;  //存储所有比赛的相关数据
		}, [] );
	},

	// 返回修改时重现之前选择的比赛
	restoreCodes : function(codes) {
		codes.each( function(obj) {
			this.vsTrs[obj.index - 1].checkCertainVsOptions(obj.arr);
		}, this );
	}
});

/* LineSelector_BF 北单行选择器(比分玩法)
------------------------------------------------------------------------------*/
Class( 'LineSelector_BF', {

	index : function(config) {

		this.vsLine     = config.tr;
		this.vsIndex    = config.vsIndex;
		this.spLine     = config.tr2;
		this.expandSp   = config.expandSp;
		this.spTag      = config.spTag;
		this.vsOptions  = { 'win':[], 'draw':[], 'lose':[] }
		for (i = 0, l = config.vsOptions.length; i< l; i++) {
			if (i < 10) {
				this.vsOptions.win.push(config.vsOptions[i]);
			} else if (i < 15) {
				this.vsOptions.draw.push(config.vsOptions[i]);
			} else {
				this.vsOptions.lose.push(config.vsOptions[i]);
			}
		}
		this.vsCheckAll   = {
			'win'  : config.vsCheckAllWin,
			'draw' : config.vsCheckAllDraw,
			'lose' : config.vsCheckAllLose
		}
		this.vsInfo = config.vsInfo;

		this.disabled = this.vsInfo.disabled === 'yes';
		this.index = this.vsInfo.index;
		this.data       = [];  //本行的投注结果
		this.data[24]   = undefined;
		this.codeValIdx = Class.config('codeValueIndex');

		this.bindEvent();
		if (this.disabled && !Class.config('stopSale')) {
			this.vsIndex.disabled = true;
		}
		this.vsIndex.checked = true;
		!this.disabled && this.initClearAll();  //初始全不选中

		// 接收消息，取消某一选项的选择
		this.onMsg('msg_touzhu_cancel', function(line_index, ck_value) {
			if (this.index == line_index) {
				var ck_index, flag, ck;
				ck_index = this.getIndex(Class.config('codeValue'), ck_value);
				if (ck_index >= 15) {
					ck_index -= 15;
					flag = 'lose';
				} else if (ck_index >= 10) {
					ck_index -= 10;
					flag = 'draw';
				} else {
					flag = 'win';
				}
				ck = this.vsOptions[flag][ck_index].getElementsByTagName('input')[0];
				this.unCheck(ck);
				return false; //停止消息传递
			}
		});

	},

	// 绑定相关事件
	bindEvent : function() {
		var Y = this;

		// 鼠标经过每一行时改变样式
		this.get(this.vsLine).hover( function() {
			this.children[0].style.backgroundColor = '#fee6ad';
			this.children[2].style.backgroundColor = '#fee6ad';
			this.children[3].style.backgroundColor = '#fee6ad';
			this.children[4].style.backgroundColor = '#fee6ad';
			this.children[5].style.backgroundColor = '#fee6ad';
			this.children[6].style.backgroundColor = '#fee6ad';
			this.children[7].style.backgroundColor = '#fee6ad';
			this.children[8].style.backgroundColor = '#fee6ad';
		}, function() {
			this.children[0].style.backgroundColor = '';
			this.children[2].style.backgroundColor = '';
			this.children[3].style.backgroundColor = '';
			this.children[4].style.backgroundColor = '';
			this.children[5].style.backgroundColor = '';
			this.children[6].style.backgroundColor = '';
			this.children[7].style.backgroundColor = '';
			this.children[8].style.backgroundColor = '';
		} );
//		this.get(this.vsLine).hover( function() {
//			this.style.backgroundColor = '#fdb03e';
//			Y.get(this).find(".h_br").addClass("h_brx");
//          	 Y.get(this).find(".label_cd").removeClass("h_brx");
//		}, function() {
//			this.style.backgroundColor = '';
//			 this.style.backgroundColor = '';
//             Y.get(this).find(".h_br").removeClass("h_brx");
//             Y.get(this).find(".label_cd").removeClass("h_brx");
//		} );
//		
//		 $('#hide_table  tr[value] .h_br')
//        $('#vsTable  tr[value] .h_br').mouseout(function (e, Y){//鼠标滑入滑出效果
//            var tdCSS=$(this).find('.chbox').attr("checked")==true?"h_br label_cd":"h_br h_brx";
//            $(this).attr("class",tdCSS);
//        });
		// 展开隐藏SP值
		this.expandSp.onclick = function() {
			if (Y.spLine.style.display == 'none') {
				Y.expandSpArea();
			} else {
				Y.shrinkSpArea();
			}
			Y.C('autoHeight') && Y.postMsg('msg_update_iframe_height');
		}

		// 点击隐藏某场比赛
		this.vsIndex.onclick = function() {
			Y.hideLine();
		}

		if (this.disabled) return;

		// 点击选项进行投注
		for (var item in this.vsOptions) {
			this.vsOptions[item].each( function(the_label) {
				the_label.parentNode.onmousedown = function() {
					var ck = this.getElementsByTagName('input')[0];
					ck.checked ? Y.unCheck(ck) : Y.check(ck);
				}
			} );
		}

		// 全选/全不选
		for (var item in this.vsCheckAll) {
			(function(item) {
				Y.vsCheckAll[item].parentNode.onmousedown = function() {
					var ck = this.getElementsByTagName('input')[0];
					ck.checked = !ck.checked;
					ck.checked ? Y.checkAll(item) : Y.clearAll(item);
				}
			})(item)
		}
	},

	check : function(ck) {
		this.data[this.codeValIdx[ck.value]] = ck.value;
		ck.checked = true;
		Y.addClass(ck.parentNode.parentNode, 'label_cd');
		this.allCheckedOrNot();
		this.changed();
	},

	unCheck : function(ck) {
		this.data[this.codeValIdx[ck.value]] = undefined;
		ck.checked = false;
		Y.removeClass(ck.parentNode.parentNode, 'label_cd');
		this.allCheckedOrNot();
		this.changed();
	},

	checkAll : function(i) {
		var code_value = Class.config('codeValue');
		switch (i) {
			case 'win'  : this.data.splice(0, 10, '胜其他', '1:0', '2:0', '2:1', '3:0', '3:1', '3:2', '4:0', '4:1', '4:2'); break;
			case 'draw' : this.data.splice(10, 5, '平其他', '0:0', '1:1', '2:2', '3:3'); break;
			case 'lose' : this.data.splice(15, 10, '负其他', '0:1', '0:2', '1:2', '0:3', '1:3', '2:3', '0:4', '1:4', '2:4');
		}
		this.vsCheckAll[i].checked = true;
		this.vsCheckAll[i].nextSibling.innerHTML='清';
		this.vsOptions[i].each( function(the_label, _i) {
			the_label.getElementsByTagName('input')[0].checked = true;
			Y.addClass(the_label.parentNode, 'label_cd');
		}, this );
//		this.allA.innerHTML='清';
		this.changed();
	},

	clearAll : function() {
		if (arguments[0]) {
			var i = arguments[0];
			switch (i) {
				case 'win'  : this.data.splice(0, 10, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined); break;
				case 'draw' : this.data.splice(10, 5, undefined, undefined, undefined, undefined, undefined); break;
				case 'lose' : this.data.splice(15, 10, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined);
			}
			this.vsCheckAll[i].checked = false;
			this.vsCheckAll[i].nextSibling.innerHTML='全';
			this.vsOptions[i].each( function(the_label) {
				the_label.getElementsByTagName('input')[0].checked = false;
				//the_label.parentNode.style.backgroundColor = '';
				Y.removeClass(the_label.parentNode, 'label_cd');
			}, this );
		} else {
			this.data = [];
			this.data[24] = undefined;
			for (var item in this.vsCheckAll) {
				this.vsCheckAll[item].checked = false;
				this.vsCheckAll[item].nextSibling.innerHTML='全';
				this.vsOptions[item].each( function(the_label) {
					the_label.getElementsByTagName('input')[0].checked = false;
					//the_label.parentNode.style.backgroundColor = '';
					Y.removeClass(the_label.parentNode, 'label_cd');
				}, this );
			}
		}
//		this.allA.innerHTML='全';
		this.changed();
	},

	initClearAll : function() {
		var ck = this.spLine.getElementsByTagName('input');
		for (var i = 0, l = ck.length; i < l; i++) {
			ck[i].checked = false;
		}
	},

	hideLine : function() {  //隐藏当前行
		if (this.vsLine.style.display != 'none') {
			this.getData().length > 0 && this.clearAll();
			this.spLine.style.display = 'none';
			this.vsLine.style.display = 'none';
			this.shrinkSpArea();
			!this.vsIndex.disabled && this.postMsg('msg_one_match_hided');
			Y.C('autoHeight') && Y.postMsg('msg_update_iframe_height');
		}
	},

	showLine : function() {  //显示当前行
		if (this.vsLine.style.display == 'none') {
			this.vsLine.style.display = '';
			this.vsIndex.checked = true;
			!this.vsIndex.disabled && this.postMsg('msg_one_match_showed');
			Y.C('autoHeight') && Y.postMsg('msg_update_iframe_height');
		}
	},

	expandSpArea : function() {
		this.spLine.style.display = '';
		this.expandSp.className = 'bf_btn expand_sp public_Dora';
		this.expandSp.innerHTML = '<b>隐藏SP值<s class="c_up"></s></b>';
	},

	shrinkSpArea : function() {
		this.spLine.style.display = 'none';
		this.expandSp.className = 'bf_btn expand_sp public_Lblue';
		this.expandSp.innerHTML = '<b>展开SP值<s class="c_down"></s></b>';
	},

	// 获取本行投注数据
	getData : function() {
		if (this.disabled) return [];
		return this.data.each( function(d) {
			d && this.push(d);
		}, [] );
	},

	// 检测当前全选框的状态
	allCheckedOrNot : function() {
		var len = { 'win':0, 'draw':0, 'lose':0 };
		for (var item in this.vsOptions) {
			this.vsOptions[item].each( function (the_label) {
				var ck = the_label.getElementsByTagName('input')[0];
				ck.checked && len[item]++;
			}, this );
		}
		this.vsCheckAll.win.checked  = (len.win === 10);
		this.vsCheckAll.win.nextSibling.innerHTML=(len.win === 10?'清':'全');
		this.vsCheckAll.draw.checked = (len.draw === 5);
		this.vsCheckAll.draw.nextSibling.innerHTML=(len.draw === 5?'清':'全');
		this.vsCheckAll.lose.checked = (len.lose === 10);
		this.vsCheckAll.lose.nextSibling.innerHTML=(len.lose === 10?'清':'全');
	},

	// 选中某些特定的选项
	checkCertainVsOptions : function(ck_value) {
		var code_value = Class.config('codeValue');
		ck_value.split(',').each( function(v) {
			var i, flag;
			i = this.getIndex(code_value, v);
			flag = 'win';
			if (i >= 15) {
				i -= 15;
				flag = 'lose';
			} else if (i >= 10) {
				i -= 10;
				flag = 'draw';
			}
			this.check(this.vsOptions[flag][i].getElementsByTagName('input')[0]);
		}, this );
		this.expandSpArea();
	},

	// 更新SP值
	updateSP : function(sp_values) {
		if (this.spTag && !this.disabled) {
			this.spTag.each( function(item, index) {
				var sp_old, sp_new;
				sp_old = parseFloat(item.innerHTML);
				sp_new = parseFloat(sp_values[index]);
				this.get(item).removeClass('red').removeClass('green');
				if (sp_new > sp_old) {
					this.get(item).addClass('red');
				} else if (sp_new < sp_old) {
					this.get(item).addClass('green');
				}
				item.innerHTML = sp_new ? sp_new.toFixed(2) : '--';
			}, this );
		}
	},

	changed : function() {
		this.postMsg('msg_line_selector_changed');
	}

});

/* GuoGuan 北单过关信息
------------------------------------------------------------------------------*/
Class( 'GuoGuan', {
	ggType : '自由过关',
	ggTypeMap  : { '自由过关' : 3, '多串过关' : 2 },
	ggTypeMap2 : { 3 : '自由过关', 2 : '多串过关' },

	ggGroup : [	[], ['单关'], ['2串1', '2串3'], ['3串1', '3串4', '3串7'], ['4串1', '4串5', '4串11', '4串15'], ['5串1', '5串6', '5串16', '5串26', '5串31'], ['6串1', '6串7', '6串22', '6串42', '6串57', '6串63'], ['7串1'], ['8串1'], ['9串1'], ['10串1'], ['11串1'], ['12串1'], ['13串1'], ['14串1'], ['15串1']	],
	ggGroupMap  : {'单关':27,'2串1':1,'2串3':2,'3串1':3,'3串4':5,'3串7':6,'4串1':7,'4串5':9,'4串11':12,'4串15':13,'5串1':14,'5串6':28,'5串16':29,'5串26':18,'5串31':19,'6串1':20,'6串7':30,'6串22':31,'6串42':32,'6串57':25,'6串63':26,'7串1':35,'8串1':36,'9串1':37,'10串1':38,'11串1':39,'12串1':40,'13串1':41,'14串1':42,'15串1':43},

	matchNum : 0,
	danmaNum : 0,
	
	index : function(config) {
		var Y = this;
		
		this.switchTag = this.need(config.switchTag);
		this.ggTable   = this.need(config.ggTable);

		// 切换过关类型
		this.switchTag.each( function(item) {
			Y.get(item).click( function() { 
				Y.ggTagSwitched(this);
			} )
		} ),

		// 当投注信息改变时
		this.onMsg('msg_touzhu_info_changed', function(match_num, danma_num) {
			this.matchNum = match_num;
			this.danmaNum = danma_num;
			this.updateGgInfo();
			this.matchNum == (parseInt(this.getGgInfo()[0]) || 1) && (this.danmaNum = 0);
			this.changed();
			this.disableOrEnableGgCk();
		} );

		// 返回过关方式
		this.onMsg('msg_get_guoguan_info', function() {
			return this.getGgInfo();
		} );

		// 选择过关方式时更新
		this.ggTable.live('input', 'click', function() {
			Y.changed();
		} );

		// 返回过关方式
		this.onMsg('msg_get_gg_info_more', function() {
			return this.getGgInfoMore();
		} );

		// 禁用或恢复过关方式选择框
		this.onMsg('msg_disable_or_enable_ggck', function(danma_num) {
			this.danmaNum = danma_num;
			this.disableOrEnableGgCk();
			this.changed();
		} );

		// 返回修改时重现之前选的过关类型
		this.onMsg('msg_restore_gggroup', function(gggroup) {
			this.switchTag.each( function(item) {
				if (this.get(item).attr('value') == this.ggTypeMap2[gggroup]) {
					this.ggTagSwitched(item);
				}
			}, this );
		} );

		// 返回修改时重现之前选的过关方式
		this.onMsg('msg_restore_sgtype', function(sgtype) {
			this.ggTable.find('input').each( function(item) {
				this.getIndex(sgtype, this.ggGroupMap[item.value]) !== -1 && this.get(item).prop('checked', true);
			}, this );
		} );
	},

	// 切换过关类型标签
	ggTagSwitched : function(obj) {
		this.switchTag.removeClass('an_cur');
		this.get(obj).addClass('an_cur');
		this.ggType = this.get(obj).attr('value');
		this.postMsg('msg_disable_or_enable_danma', -1); //清除胆码
		this.danmaNum = 0;
		this.updateGgInfo();
		this.changed();
	},

	// 更新过关信息
	updateGgInfo : function() {
		if (this.matchNum == 0) {
			this.ggTable.empty();
			return;
		}
		
		// 根据不同玩法对最大串数做限制
		var max_limit = this.matchNum;
		switch (Class.config('playName')) {
			case 'rqspf' :
				this.matchNum > 15 && (max_limit = 15);
				break;
			case 'bf' :
				this.matchNum > 3 && (max_limit = 3);
				break;
			case 'jq' :
			case 'ds' :
			case 'bq' :
				this.matchNum > 6 && (max_limit = 6);
		}

		var gg_html, checked_gg_type, checked_html;
		gg_html = checked_html = '';
		checked_gg_type = this.getGgInfo();

		if (this.ggType == '自由过关') {
			for (var i = 1, j = 1; i <= max_limit; i++) {
				if (j % 3 == 1) {
					if (parseInt(j / 3) % 2 == 1) {
						gg_html += '<tr class="even">';
					} else {
						gg_html += '<tr>';
					}
				}
				checked_gg_type.each( function(item) {
					item == this.ggGroup[i][0] && (checked_html = ' checked="checked" ');
				}, this );
				gg_html += '<td class="tl" style="text-align:left;"><label class="mar_l10">' + 
							   '<input type="checkbox" class="chbox" name="gg_group"' + checked_html + ' value="' + this.ggGroup[i][0] + '" />' + this.ggGroup[i][0] +
						   '</label></td>';
				if (j++ % 3 == 0) {
					gg_html += '</tr>';
				}
				checked_html = '';
			}
		} else if (this.ggType == '多串过关') {
			for (var i = 1, j = 1; i <= max_limit; i++) { //tr的输出有bug
				if (this.ggGroup[i].length < 2) {
					continue;
				}
				if (j % 3 == 1) {
					if (parseInt(j / 3) % 2 == 1) {
						gg_html += '<tr class="even">';
					} else {
						gg_html += '<tr>';
					}
				}
				for (var _i = 1, _l = this.ggGroup[i].length; _i < _l; _i++) {
					checked_gg_type.each( function(item) {
						item == this.ggGroup[i][_i] && (checked_html = ' checked="checked" ');
					}, this );
					gg_html += '<td class="tl"><label class="mar_l10">' + 
								   '<input type="radio" class="chbox" name="gg_group"' + checked_html + ' value="' + this.ggGroup[i][_i] + '" />' + this.ggGroup[i][_i] +
							   '</label></td>';
					if (j++ % 3 == 0) {
						gg_html += '</tr>';
					}
					if (j % 3 == 1) {
						if (parseInt(j / 3) % 2 == 1) {
							gg_html += '<tr class="even">';
						} else {
							gg_html += '<tr>';
						}
					}
					checked_html = '';
				}
			}
		}
		/* @todo 这里需要补齐缺少的单元格td */
		this.ggTable.empty();
		this.get(gg_html).insert(this.ggTable);
	},

	// 获取所选的过关方式
	getGgInfo : function() {
		var gg_info = new Array();
		this.ggTable.find('input').each( function(item) {
			item.checked && gg_info.push(item.value);
		}, this );
		return gg_info;
	},
	
	// 获取更为完整的过关信息
	getGgInfoMore : function() {
		var Y, gg_info;
		Y = this;
		gg_info = {};
		gg_info.gggroup = Y.ggTypeMap[Y.ggType];
		gg_info.sgtypename = Y.getGgInfo().join(',');
		gg_info.sgtype = Y.getGgInfo().each( function(item) {
			this.push(Y.ggGroupMap[item]);
		}, [] ).join(',');
		return gg_info;
	},

	disableOrEnableGgCk : function() {
		this.ggTable.find('input').each( function(item) {
			var gg_match_num = parseInt(item.value) || 1;
			if (gg_match_num <= this.danmaNum) {
				item.disabled = true;
			} else {
				if (!item.disabled) {
					return;
				}
				item.disabled = false;
			}
		}, this );
	},

	updateGgCk : function() {
		var gg_match_num_real, gg_match_num;
		if (this.danmaNum == this.matchNum - 1) {
			gg_match_num = 1;
		} else if (this.getGgInfo().length == 0) {
			gg_match_num = 0;
		} else {
			gg_match_num_real = parseInt(this.getGgInfo()[0]) || 1;
			if (this.ggType == '自由过关' && gg_match_num_real == this.matchNum) {
				gg_match_num  = -2;
				this.danmaNum = 0;
				this.disableOrEnableGgCk();
			} else {
				gg_match_num = gg_match_num_real;
			}
		}
		this.postMsg('msg_disable_or_enable_danma', gg_match_num);
	},

	changed : function() {
		this.updateGgCk();
		this.postMsg('msg_guoguan_info_changed');
	}

} );


/* TouzhuResult 北单投注结果
------------------------------------------------------------------------------*/
Class( 'TouzhuResult', {

	beishu   : 0,
	matchNum : 0,
	zhushu   : 0,
	totalSum : 0,

	index : function(config) {
		var Y = this;
		
		this.beishuInput = this.need(config.beishuInput);
		this.matchNumTag = this.need(config.matchNum);
		this.zhushuTag   = this.need(config.zhushu);
		this.totalSumTag = this.need(config.totalSum);

		this.zhushuCalculator = this.lib.ZhushuCalculator();

		// 改变倍数时
		this.beishuInput.keyup( function() {
			Y.updateTouzhuResult();
		} ).blur( function() {
			if (this.value == '') {
				this.value = 1;
				Y.updateTouzhuResult();
			}
		} );
		
		this.onMsg('msg_guoguan_info_changed', function() {
			this.updateTouzhuResult();
		} );

		// 返回投注结果，用于表单提交
		this.onMsg('msg_get_touzhu_result_4_submit', function() {
			return this.getTouzhuResult4Submit();
		} );

		// 返回修改时重现位数
		this.onMsg('msg_restore_beishu', function(beishu) {
			this.beishuInput.val(beishu);
			this.updateTouzhuResult();
		} );
	},

	// 更新投注结果
	updateTouzhuResult : function() {
		if (!parseInt(this.beishuInput.val())) {
			this.beishu = '';
		} else {
			this.beishu = parseInt(this.beishuInput.val());
		}
		this.zhushu = this.countZhushu();
		this.totalSum = this.zhushu * this.beishu * 2;
		this.updateHtml();
	},

	updateHtml : function() {
		this.beishuInput.val(this.beishu);  //更新倍数
		this.matchNumTag.html(this.matchNum);  //更新所选场次数
		this.zhushuTag.html(this.zhushu);  //更新注数
		if(this.matchNum >0){
			Y.get("#checkbox_clear").addClass("jcq_kcur");
		}else{
			Y.get("#checkbox_clear").removeClass("jcq_kcur");
		}
		this.totalSumTag.html(this.totalSum.rmb(true, 0)); //更新投注金额
//		log('选号耗时：' + (new Date - Class.config('d')))
	},

	getTouzhuResult4Submit : function() {
		return {
			zhushu : this.zhushu,
			beishu : this.beishu,
			totalmoney : this.totalSum
		}
	},

	countZhushu : function() {  //计算注数
		var codes, danma, ggtype, ggmlist;
		codes = this.postMsg('msg_get_touzhu_codes').data;
		this.matchNum = codes.length;  //保存场次数
		ggmlist = this.postMsg('msg_get_guoguan_info').data;
		if (this.matchNum == 0 || ggmlist.length == 0) {
			return 0;
		}
		ggtype = this.postMsg('msg_get_gg_info_more').data.gggroup;
		danma = this.postMsg('msg_get_danma').data;
		codes.each( function(item) {
			item.dan = danma[item.index];
		} );
		return this.postMsg('msg_get_zhushu', codes, ggtype, ggmlist).data;
	}

});

/*当前时间*/
Class( 'Clock', {
	index : function(clock_id) {
		this.clockTag = this.get(clock_id);
		Class.config('servertimediff', 0); 
		this.runClock();
		
	},
	runClock : function() {
		var Y = this;		
		Y.ajax({
			url : "/cpdata/time.json",
			end : function(data) {
				var servernow = Y.getDate(data.date);			
				var diff=Date.parse(servernow) - Date.parse(new Date()) ;	
				Class.config('servertimediff',(diff));
				
				setInterval( function() {
					var now = new Date();
					var d = new Date(Date.parse(now) + Class.config('servertimediff'));
					var h_time='<span></span><span class="jc_tms" style="padding-right:10px">'+Y.addZero(d.getFullYear())+'-'+Y.addZero((d.getMonth() + 1))+'-'+Y.addZero(d.getDate())+'</span><span class="jc_tmv jc_tms">' + Y.addZero(d.getHours()) + ':' + Y.addZero(d.getMinutes()) + ':' + Y.addZero(d.getSeconds())+'</span>';
					Y.clockTag.html(h_time);
				}, 1000 );
				
				setInterval( function() {
					Y.ajax({
						url : "/cpdata/time.json",
						end : function(data) {
							var servernow = Y.getDate(data.date);			
							var diff=Date.parse(servernow) - Date.parse(new Date()) ;	
							Class.config('servertimediff',(diff));						
						}
					});	
				}, 30000);
				
			}
		});	
	},
	addZero : function(n) {
		return parseInt(n) < 10 ? '0' + n : n;
	}
} );


Class('LoadExpect',{
	index:function(){
		this.init();  
		this.bindMsg();		
	},
	bindMsg: function(){
		this.onMsg('msg_get_expect_suc', function (expect){
			return this.LoadDuiZhen(expect);
        });
		this.onMsg('msg_get_odds_suc', function (expect){
			//return this.sethref(expect);
        });    		
	},	

    init: function (){//处理URL参数
    	    
    	if (location.search.getParam('expect') != "") {//期号
    		this.get("#expect").val(location.search.getParam('expect'));
		}    	
    	
    	this.ajax({
			url : "/cpdata/game/85/c.json?_=" + Math.random(),
			type : "get",
			dataType : "json",
			end  : function (d){
				var obj = eval("(" + d.text + ")");
				var r = obj.period.row;
				var expectlist = [];
				r.each(function(rt,o) {
					var pid = rt.pid;
					var et = rt.et;
					var fet = rt.fet;
					var flag = rt.flag;
					expectlist[expectlist.length] = [ pid, et, fet, flag ];
				});
					
					var html='';
					var find = false;
					var nowexpect='';
					if (expectlist.length>0){
						for ( var i = 0; i < expectlist.length; i++) {
							if (i==0){
								nowexpect=expectlist[i][0];
								Class.config('nowexpect', nowexpect);  //当前期号	
								html+='<option value="'+expectlist[i][0]+'|'+expectlist[i][1]+'|2"  style="color:red">'+expectlist[i][0]+'当前期</option>';
							}else{
								if(this.get("#expect").val()==expectlist[i][0]){
									html+='<option value="'+expectlist[i][0]+'|'+expectlist[i][1]+'|1"  style="color:#888888" selected="selected">'+expectlist[i][0]+'</option>';
								}else{
								html+='<option value="'+expectlist[i][0]+'|'+expectlist[i][1]+'|1"  style="color:#888888">'+expectlist[i][0]+'</option>';
								}
							}
							if (this.get("#expect").val()==expectlist[i][0]){
								find=true;
							}
						}		
					}
					this.get("#expect_select_div").html('<select style="color:#F00" id="expect_select">'+html+'</select>');	
					
					if (this.get("#expect").val()==''){
						this.get("#expect").attr("value",nowexpect);
						this.get("#expect_select").get(0).selectedIndex=0;
						find=true;
					}else{
						this.get("#expect_select option[text="+this.get("#expect").val()+"]").attr("selected", true);
												
					}						
									
					if (!find) {
						alert('对不起，该期暂未开售或者已经截止!');
						if (history.length == 0) {
							window.opener = '';
							window.close();
							return ;
						} else {
							history.go(-1);
							return ;
						}
					}
					this.postMsg('msg_get_expect_suc',this.get("#expect").val());
			},
			error : function() {
				this.alert("网络故障!");
				return false;
			}
		});
    },
    
	LoadDuiZhen : function(expect) {	
		if (expect == "") {
			this.alert("期号加载失败,请稍后重试!");
			return false;
		}
		if (this.get("#dcvsTable").size()==0){
			return false;
		}		
		Class.config('playId', parseInt(this.need('#playid').val()) );  //玩法id		
		
		var url="/cpdata/match/beid/"+expect+"/spf.json";
		if(Class.config('nowexpect')!=expect){
			url="/cpdata/match/beid/"+expect+"/"+expect+".json";
		}else{
			url="/cpdata/match/beid/"+expect+"/cbf.json";
		}
		
		this.ajax({
					type : "get",
					dataType : "json",
					url: url+ "?rnd=" + Math.random(),
					cache:false,
					end : function(data) {
						var obj = eval("(" + data.text + ")");
						var code = obj.match.code;
						var desc = obj.match.desc;
						if (code == "0") {
							this.cbf(data);				
						} else {
							this.alert(desc);
						}
					},
					error : function() {
						this.alert("网络故障!");
						return false;
					}
				});
	},	
	cbf:function(data){
		 var html = [];
		 var tableTpl=['<colgroup>'+
	       '<col width="45" />'+
	       '<col width="64" />'+
	       '<col width="64" />'+
	       '<col width="120" />'+
	       '<col width="4" />'+
	       '<col width="120" />'+
	       '<col width="108" />'+
	       '<col width="168" />'+
	       '<col/>'+
	       '</colgroup>',//0
	       '<tbody>'+
	       '<tr id="switch_for_{$enddate}">'+
	       '<td colspan="9" class="dc_hs dc_hstd" style="text-align:left; padding-left:10px;line-height:16px;height:16px">'+
	       '<strong>{$enddate} {$weekday} (10：00--次日10：00)</strong>&nbsp;'+
	       '<a href="javascript:void(0)" onclick="Yobj.postMsg(\'msg_show_or_hide_matches\', \'{$enddate}\', this)">隐藏</a>'+
	       '</td>'+
	       '</tr>'+
	       '</tbody><tbody id="{$enddate}" onselectstart="return false">',//1
	       '<tr class="{$classname}" {$displaystyle} value="{index:\'{$mid}\',leagueName:\'{$mname}\',homeTeam:\'{$hn}\',guestTeam:\'{$gn}\',rangqiuNum:\'{$close}\',endTime:\'{$et}\',scheduleDate:\'{$enddate}\',disabled:\'{$yesorno}\',homeTeamRank:0,guestTeamRank:0,bgColor:\'{$bgColor}\'}">'+
	       '<td>'+
	       '<input type="checkbox" checked="checked" class="chbox" style="cursor:default" /><span class="chnum">{$mid}</span>'+
	       '</td>'+
	       '<td style="background:{$bgColor};color:#fff;" class="league">'+
	       '<a  href="" target="_blank" id="match{$mid}" style="color:#fff;">{$mname}</a>'+
	       '</td>'+
	       '<td><span class="eng end_time" title="截止时间：{$et}">{$short_et}</span><span style="display: none" class="eng match_time" title="开赛时间：{$bt}">{$short_bt}</span></td>'+
	       '<td style="text-align: right; ">'+
	       '<a title="{$hn}"  href="" target="_blank" id="hn{$mid}"><em id="htid{$mid}" class="ew_e ew_eright">{$hn}</em></a>'+	      
	       '</td>'+
	       '<td style="text-align: center;">VS</td>'+
	       '<td style="text-align: left; ">'+
	       '<a title="{$gn}"  href="" target="_blank" id="gn{$mid}"><em id="gtid{$mid}" class="ew_e">{$gn}</em></a>'+	       
	       '</td>'+
	       '<td value="{\'index\':{$mid},\'disabled\':{$disabledint}}">'+
	       '<span class="sp_w35 eng pjoz" id="oh{$mid}">{$b3}</span><span class="sp_w35 eng pjoz" id="od{$mid}">{$b1}</span><span class="sp_w35 eng pjoz" id="oa{$mid}">{$b0}</span>'+
	       '</td>'+
	       '<td>'+
	       '{$updownstr}'+
	       '</td>'+
	       '<td>'+
	       '{$shuju}'+
	       '</td>'+
	       '</tr>',//2 tr 	       
	       '</tbody>',
	       '<tr class="hide_b" id="sp_lines_{$mid}" {$displaystyle2}>'+
	       '<td colspan="9">'+
	       '<table width="100%" cellspacing="0" cellpadding="0" border="0" class="hide_table">'+
	       '<colgroup>'+
	       '<col width="70" />'+
	       '<col width="70" />'+
	       '<col width="70" />'+
	       '<col width="70" />'+
	       '<col width="70" />'+
	       '<col width="70" />'+
	       '<col width="70" />'+
	       '<col width="70" />'+
	       '<col width="70" />'+
	       '<col width="70" />'+
	       '<col width="" />'+
	       '</colgroup>'+
	       '<tbody>'+
	       '<tr>'+
	       '<td class="{$tdclass}">'+
	       '<label class="eng">'+
	       '<input type="checkbox" class="chbox" value="胜其他" onclick="return false"  {$disabled} style="display:none"/><span class="f_bf">胜其他</span><br/>'+
	       '{$sp90str}'+
	       '</label>'+
	       '</td>'+
	       '<td class="{$tdclass}" style="CURSOR: pointer">'+
	       '<label class="eng">'+
	       '<input type="checkbox" class="chbox" value="1:0" onclick="return false"  {$disabled} style="display:none"/><span class="f_bf">1:0</span><br/>'+
	       '{$sp10str}'+
	       '</label>'+
	       '</td>'+
	       '<td class="{$tdclass}" style="CURSOR: pointer">'+
	       '<label class="eng">'+
	       '<input type="checkbox" class="chbox" value="2:0" onclick="return false"  {$disabled} style="display:none"/><span class="f_bf">2:0</span><br/>'+
	       '{$sp20str}'+
	       '</label>'+
	       '</td>'+
	       '<td class="{$tdclass}" style="CURSOR: pointer">'+
	       '<label class="eng">'+
	       '<input type="checkbox" class="chbox" value="2:1" onclick="return false"  {$disabled} style="display:none"/><span class="f_bf">2:1</span><br/>'+
	       '{$sp21str}'+
	       '</label>'+
	       '</td>'+
	       '<td class="{$tdclass}" style="CURSOR: pointer">'+
	       '<label class="eng">'+
	       '<input type="checkbox" class="chbox" value="3:0" onclick="return false"  {$disabled} style="display:none"/><span class="f_bf">3:0</span><br/>'+
	       '{$sp30str}'+
	       '</label>'+
	       '</td>'+
	       '<td class="{$tdclass}" style="CURSOR: pointer">'+
	       '<label class="eng">'+
	       '<input type="checkbox" class="chbox" value="3:1" onclick="return false"  {$disabled} style="display:none"/><span class="f_bf">3:1</span><br/>'+
	       '{$sp31str}'+
	       '</label>'+
	       '</td>'+
	       '<td class="{$tdclass}" style="CURSOR: pointer">'+
	       '<label class="eng">'+
	       '<input type="checkbox" class="chbox" value="3:2" onclick="return false"  {$disabled} style="display:none"/><span class="f_bf">3:2</span><br/>'+
	       '{$sp32str}'+
	       '</label>'+
	       '</td>'+
	       '<td class="{$tdclass}" style="CURSOR: pointer">'+
	       '<label class="eng">'+
	       '<input type="checkbox" class="chbox" value="4:0" onclick="return false"  {$disabled} style="display:none"/><span class="f_bf">4:0</span><br/>'+
	       '{$sp40str}'+
	       '</label>'+
	       '</td>'+
	       '<td class="{$tdclass}" style="CURSOR: pointer">'+
	       '<label class="eng">'+
	       '<input type="checkbox" class="chbox" value="4:1" onclick="return false"  {$disabled} style="display:none"/><span class="f_bf">4:1</span><br/>'+
	       '{$sp41str}'+
	       '</label>'+
	       '</td>'+
	       '<td class="{$tdclass}" style="CURSOR: pointer">'+
	       '<label class="eng">'+
	       '<input type="checkbox" class="chbox" value="4:2" onclick="return false"  {$disabled} style="display:none"/><span class="f_bf">4:2</span><br/>'+
	       '{$sp42str}'+
	       '</label>'+
	       '</td>'+
	       '<td class="last_td" style="cursor:pointer"><input type="checkbox" style="display:none" class="chbox vs_check_all_win" onclick="return false"  {$disabled} /><a href="javascript:void(0);" class="jcq_q">全</a></td>'+
	       '</tr>'+
	       '<tr>'+
	       '<td class="{$tdclass}" style="CURSOR: pointer">'+
	       '<label class="eng">'+
	       '<input type="checkbox" class="chbox" value="平其他" onclick="return false"  {$disabled} style="display:none"/><span class="f_bf">平其他</span><br/>'+
	       '{$sp99str}'+
	       '</label>'+
	       '</td>'+
	       '<td class="{$tdclass}" style="CURSOR: pointer">'+
	       '<label class="eng">'+
	       '<input type="checkbox" class="chbox" value="0:0" onclick="return false"  {$disabled} style="display:none"/><span class="f_bf">0:0</span><br/>'+
	       '{$sp00str}'+
	       '</label>'+
	       '</td>'+
	       '<td class="{$tdclass}" style="CURSOR: pointer">'+
	       '<label class="eng">'+
	       '<input type="checkbox" class="chbox" value="1:1" onclick="return false"  {$disabled} style="display:none"/><span class="f_bf">1:1</span><br/>'+
	       '{$sp11str}'+
	       '</label>'+
	       '</td>'+
	       '<td class="{$tdclass}" style="CURSOR: pointer">'+
	       '<label class="eng">'+
	       '<input type="checkbox" class="chbox" value="2:2" onclick="return false"  {$disabled} style="display:none"/><span class="f_bf">2:2</span><br/>'+
	       '{$sp22str}'+
	       '</label>'+
	       '</td>'+
	       '<td class="{$tdclass}" style="CURSOR: pointer">'+
	       '<label class="eng">'+
	       '<input type="checkbox" class="chbox" value="3:3" onclick="return false"  {$disabled} style="display:none"/><span class="f_bf">3:3</span><br/>'+
	       '{$sp33str}'+
	       '</label>'+
	       '</td>'+
	       '<td colspan="5">&nbsp;</td>'+
	       '<td class="last_td" style="cursor:pointer"><input type="checkbox" style="display:none" class="chbox vs_check_all_draw" onclick="return false"  {$disabled} /><a href="javascript:void(0);" class="jcq_q">全</a></td>'+
	       '</tr>'+
	       '<tr>'+
	       '<td class="{$tdclass}" style="CURSOR: pointer">'+
	       '<label class="eng">'+
	       '<input type="checkbox" class="chbox" value="负其他" onclick="return false"  {$disabled} style="display:none"/><span class="f_bf">负其他</span><br/>'+
	       '{$sp09str}'+
	       '</label>'+
	       '</td>'+
	       '<td class="{$tdclass}" style="CURSOR: pointer">'+
	       '<label class="eng">'+
	       '<input type="checkbox" class="chbox" value="0:1" onclick="return false"  {$disabled} style="display:none"/><span class="f_bf">0:1</span><br/>'+
	       '{$sp01str}'+
	       '</label>'+
	       '</td>'+
	       '<td class="{$tdclass}" style="CURSOR: pointer">'+
	       '<label class="eng">'+
	       '<input type="checkbox" class="chbox" value="0:2" onclick="return false"  {$disabled} style="display:none"/><span class="f_bf">0:2</span><br/>'+
	       '{$sp02str}'+
	       '</label>'+
	       '</td>'+
	       '<td class="{$tdclass}" style="CURSOR: pointer">'+
	       '<label class="eng">'+
	       '<input type="checkbox" class="chbox" value="1:2" onclick="return false"  {$disabled} style="display:none"/><span class="f_bf">1:2</span><br/>'+
	       '{$sp12str}'+
	       '</label>'+
	       '</td>'+
	       '<td class="{$tdclass}" style="CURSOR: pointer">'+
	       '<label class="eng">'+
	       '<input type="checkbox" class="chbox" value="0:3" onclick="return false"  {$disabled} style="display:none"/><span class="f_bf">0:3</span><br/>'+
	       '{$sp03str}'+
	       '</label>'+
	       '</td>'+
	       '<td class="{$tdclass}" style="CURSOR: pointer">'+
	       '<label class="eng">'+
	       '<input type="checkbox" class="chbox" value="1:3" onclick="return false"  {$disabled} style="display:none"/><span class="f_bf">1:3</span><br/>'+
	       '{$sp13str}'+
	       '</label>'+
	       '</td>'+
	       '<td class="{$tdclass}" style="CURSOR: pointer">'+
	       '<label class="eng">'+
	       '<input type="checkbox" class="chbox" value="2:3" onclick="return false"  {$disabled} style="display:none"/><span class="f_bf">2:3</span><br/>'+
	       '{$sp23str}'+
	       '</label>'+
	       '</td>'+
	       '<td class="{$tdclass}" style="CURSOR: pointer">'+
	       '<label class="eng">'+
	       '<input type="checkbox" class="chbox" value="0:4" onclick="return false"  {$disabled} style="display:none"/><span class="f_bf">0:4</span><br/>'+
	       '{$sp04str}'+
	       '</label>'+
	       '</td>'+
	       '<td class="{$tdclass}" style="CURSOR: pointer">'+
	       '<label class="eng">'+
	       '<input type="checkbox" class="chbox" value="1:4" onclick="return false"  {$disabled} style="display:none"/><span class="f_bf">1:4</span><br/>'+
	       '{$sp14str}'+
	       '</label>'+
	       '</td>'+
	       '<td class="{$tdclass}" style="CURSOR: pointer">'+
	       '<label class="eng">'+
	       '<input type="checkbox" class="chbox" value="2:4" onclick="return false"  {$disabled} style="display:none"/><span class="f_bf">2:4</span><br/>'+
	       '{$sp24str}'+
	       '</label>'+
	       '</td>'+
	       '<td class="last_td" style="cursor:pointer"><input type="checkbox" style="display:none" class="chbox vs_check_all_lose" onclick="return false"  {$disabled} /><a href="javascript:void(0);" class="jcq_q">全</a></td>'+
	       '</tr>'+
	       '</tbody>'+
	       '</table>'+
	       '</td>'+
	       '</tr>'//4
		];
	
		var mathdate=[];
		var wk=["日","一","二","三","四","五","六"];
	
		var stop_sale="no";
		var all_matches=0;
		var out_of_date_matches=0;
	
		var odds_issuc=false;
		var nowfirst=0;
		var lgname=[];
		var obj = eval("(" + data.text + ")");
		var code = obj.match.code;
		var desc = obj.match.desc;
		var r = obj.match.row;
		r.each(function(row,i){
			row.enddate=(((Y.getDate(row.bt).getHours()<10) || (Y.getDate(row.bt).getHours()==10 && Y.getDate(row.bt).getMinutes()==0))?(Y.getDate(Date.parse(Y.getDate(row.bt))-1000*60*60*24).format('YY-MM-DD')):Y.getDate(row.bt).format('YY-MM-DD'));
			row.classname=i%2==0?"vs_lines odd":"vs_lines";
			if (mathdate.indexOf(row.enddate)<0){
				mathdate[mathdate.length]=row.enddate;
				row.weekday='周'+wk[Y.getDate(row.enddate).getDay()];
				html[html.length] = mathdate.length>1?(tableTpl[3]+tableTpl[1].tpl(row)):tableTpl[1].tpl(row);   
			};
			row.index=row.mid;
			row.b3=row.b3!=''?parseFloat(row.b3).rmb(false,2):'--';
			row.b1=row.b1!=''?parseFloat(row.b1).rmb(false,2):'--';
			row.b0=row.b0!=''?parseFloat(row.b0).rmb(false,2):'--';		
			row.short_bt=Y.getDate(row.bt).format('hh:mm');
			row.short_et=Y.getDate(row.et).format('hh:mm');
			row.bgColor=row.cl!=''?row.cl:'#009900';
			row.sp90=$_sys.getsp(row.cbf,"90")?parseFloat($_sys.getsp(row.cbf,"90")).rmb(false,2):'--';
			row.sp10=$_sys.getsp(row.cbf,"10")?parseFloat($_sys.getsp(row.cbf,"10")).rmb(false,2):'--';
			row.sp20=$_sys.getsp(row.cbf,"20")?parseFloat($_sys.getsp(row.cbf,"20")).rmb(false,2):'--';
			row.sp21=$_sys.getsp(row.cbf,"21")?parseFloat($_sys.getsp(row.cbf,"21")).rmb(false,2):'--';
			row.sp30=$_sys.getsp(row.cbf,"30")?parseFloat($_sys.getsp(row.cbf,"30")).rmb(false,2):'--';
			row.sp31=$_sys.getsp(row.cbf,"31")?parseFloat($_sys.getsp(row.cbf,"31")).rmb(false,2):'--';
			row.sp32=$_sys.getsp(row.cbf,"32")?parseFloat($_sys.getsp(row.cbf,"32")).rmb(false,2):'--';
			row.sp40=$_sys.getsp(row.cbf,"40")?parseFloat($_sys.getsp(row.cbf,"40")).rmb(false,2):'--';
			row.sp41=$_sys.getsp(row.cbf,"41")?parseFloat($_sys.getsp(row.cbf,"41")).rmb(false,2):'--';
			row.sp42=$_sys.getsp(row.cbf,"42")?parseFloat($_sys.getsp(row.cbf,"42")).rmb(false,2):'--';

			row.sp99=$_sys.getsp(row.cbf,"99")?parseFloat($_sys.getsp(row.cbf,"99")).rmb(false,2):'--';
			row.sp00=$_sys.getsp(row.cbf,"00")?parseFloat($_sys.getsp(row.cbf,"00")).rmb(false,2):'--';
			row.sp11=$_sys.getsp(row.cbf,"11")?parseFloat($_sys.getsp(row.cbf,"11")).rmb(false,2):'--';
			row.sp22=$_sys.getsp(row.cbf,"22")?parseFloat($_sys.getsp(row.cbf,"22")).rmb(false,2):'--';
			row.sp33=$_sys.getsp(row.cbf,"33")?parseFloat($_sys.getsp(row.cbf,"33")).rmb(false,2):'--';

			row.sp09=$_sys.getsp(row.cbf,"09")?parseFloat($_sys.getsp(row.cbf,"09")).rmb(false,2):'--';
			row.sp01=$_sys.getsp(row.cbf,"01")?parseFloat($_sys.getsp(row.cbf,"01")).rmb(false,2):'--';
			row.sp02=$_sys.getsp(row.cbf,"02")?parseFloat($_sys.getsp(row.cbf,"02")).rmb(false,2):'--';
			row.sp12=$_sys.getsp(row.cbf,"12")?parseFloat($_sys.getsp(row.cbf,"12")).rmb(false,2):'--';
			row.sp03=$_sys.getsp(row.cbf,"03")?parseFloat($_sys.getsp(row.cbf,"03")).rmb(false,2):'--';
			row.sp13=$_sys.getsp(row.cbf,"13")?parseFloat($_sys.getsp(row.cbf,"13")).rmb(false,2):'--';
			row.sp23=$_sys.getsp(row.cbf,"23")?parseFloat($_sys.getsp(row.cbf,"23")).rmb(false,2):'--';
			row.sp04=$_sys.getsp(row.cbf,"04")?parseFloat($_sys.getsp(row.cbf,"04")).rmb(false,2):'--';
			row.sp14=$_sys.getsp(row.cbf,"14")?parseFloat($_sys.getsp(row.cbf,"14")).rmb(false,2):'--';
			row.sp24=$_sys.getsp(row.cbf,"24")?parseFloat($_sys.getsp(row.cbf,"24")).rmb(false,2):'--';
		
			
			row.rz=$_sys.getrz(row.rs,1);//this.getsp(row.cbf,"rz");
			row.rs=$_sys.getrs(row.rs,1)?parseFloat($_sys.getrs(row.rs,1)).rmb(false,2):'&nbsp';//this.getsp(row.cbf,"rs")?parseFloat(this.getsp(row.cbf,"rs")).rmb(false,2):'&nbsp';
			row.bf=(new String(row.ms)!=''&&new String(row.ss)!=''?(row.ms+':'+row.ss):(''));
			all_matches++;		
			
			row.yesorno="no";// yes
			row.disabled='';//disabled="disabled"
			row.displaystyle="";//style="display:none"
			row.displaystyle2="";//style="display:none"
			row.updownstr='';
			row.tdclass=" h_br";
			var out_of_date=false;
			if (Y.getDate(data.date)>Y.getDate(row.et) || row.icancel=="1"){//已经过期的场次
				out_of_date_matches++;
				out_of_date=true;
				row.yesorno="yes";
				row.disabled='disabled="disabled"';
				row.displaystyle='style="display:none"'; //style="display:none"
				row.displaystyle2='style="display:none"';//style="display:none"
				row.tdclass="h_br tdhui";
				row.updownstr='<a class="public_Lblue bf_btn expand_sp" href="javascript:void(0)"><b>展开SP值<s class="c_down"></s></b></a>';
			}else{	
				if (nowfirst==0){
					nowfirst=row.mid;
					row.displaystyle2='';
					row.updownstr='<a class="public_Dora bf_btn expand_sp" href="javascript:void(0)"><b>隐藏SP值<s class="c_up"></s></b></a>';				
				}else{
					row.displaystyle2='style="display:none"';
					row.updownstr='<a class="public_Lblue bf_btn expand_sp" href="javascript:void(0)"><b>展开SP值<s class="c_down"></s></b></a>';
				}
			}
			
			if (out_of_date&&row.bf!=''){//抓到比分
				if(row.bf=="-1:-1"){row.bf="延";}
				row.shuju='<span class="red eng">'+row.bf+'</span>';
			}else{
				row.shuju='<a href="" target="_blank" id="ox'+row.mid+'">析</a> <a href="" target="_blank" id="oz'+row.mid+'">欧</a>';
			}			
			
			if (out_of_date&&row.rz!=''){//已经开出赛果的
				row.sp90str=(row.rz=='90'?('<span class="red">'+row.rs+'</span>'):'--');
				row.sp10str=(row.rz=='10'?('<span class="red">'+row.rs+'</span>'):'--');
				row.sp20str=(row.rz=='20'?('<span class="red">'+row.rs+'</span>'):'--');
				row.sp21str=(row.rz=='21'?('<span class="red">'+row.rs+'</span>'):'--');
				row.sp31str=(row.rz=='31'?('<span class="red">'+row.rs+'</span>'):'--');
				row.sp32str=(row.rz=='32'?('<span class="red">'+row.rs+'</span>'):'--');
				row.sp40str=(row.rz=='40'?('<span class="red">'+row.rs+'</span>'):'--');
				row.sp41str=(row.rz=='41'?('<span class="red">'+row.rs+'</span>'):'--');
				row.sp42str=(row.rz=='42'?('<span class="red">'+row.rs+'</span>'):'--');

				row.sp99str=(row.rz=='99'?('<span class="red">'+row.rs+'</span>'):'--');
				row.sp00str=(row.rz=='00'?('<span class="red">'+row.rs+'</span>'):'--');
				row.sp11str=(row.rz=='11'?('<span class="red">'+row.rs+'</span>'):'--');
				row.sp22str=(row.rz=='22'?('<span class="red">'+row.rs+'</span>'):'--');
				row.sp33str=(row.rz=='33'?('<span class="red">'+row.rs+'</span>'):'--');
				
				row.sp09str=(row.rz=='09'?('<span class="red">'+row.rs+'</span>'):'--');
				row.sp01str=(row.rz=='01'?('<span class="red">'+row.rs+'</span>'):'--');
				row.sp02str=(row.rz=='02'?('<span class="red">'+row.rs+'</span>'):'--');
				row.sp12str=(row.rz=='12'?('<span class="red">'+row.rs+'</span>'):'--');
				row.sp03str=(row.rz=='03'?('<span class="red">'+row.rs+'</span>'):'--');
				row.sp13str=(row.rz=='13'?('<span class="red">'+row.rs+'</span>'):'--');
				row.sp23str=(row.rz=='23'?('<span class="red">'+row.rs+'</span>'):'--');
				row.sp04str=(row.rz=='04'?('<span class="red">'+row.rs+'</span>'):'--');
				row.sp14str=(row.rz=='14'?('<span class="red">'+row.rs+'</span>'):'--');
				row.sp24str=(row.rz=='24'?('<span class="red">'+row.rs+'</span>'):'--');

				
				
			}else{//未出结果
				row.sp90str='<span mark="sp" class="'+(out_of_date?'red':'')+'">'+row.sp90+'</span>';
				row.sp10str='<span mark="sp" class="'+(out_of_date?'red':'')+'">'+row.sp10+'</span>';
				row.sp20str='<span mark="sp" class="'+(out_of_date?'red':'')+'">'+row.sp20+'</span>';
				row.sp21str='<span mark="sp" class="'+(out_of_date?'red':'')+'">'+row.sp21+'</span>';
				row.sp30str='<span mark="sp" class="'+(out_of_date?'red':'')+'">'+row.sp30+'</span>';
				row.sp31str='<span mark="sp" class="'+(out_of_date?'red':'')+'">'+row.sp31+'</span>';
				row.sp32str='<span mark="sp" class="'+(out_of_date?'red':'')+'">'+row.sp32+'</span>';
				row.sp40str='<span mark="sp" class="'+(out_of_date?'red':'')+'">'+row.sp40+'</span>';
				row.sp41str='<span mark="sp" class="'+(out_of_date?'red':'')+'">'+row.sp41+'</span>';
				row.sp42str='<span mark="sp" class="'+(out_of_date?'red':'')+'">'+row.sp42+'</span>';

				row.sp99str='<span mark="sp" class="'+(out_of_date?'red':'')+'">'+row.sp99+'</span>';
				row.sp00str='<span mark="sp" class="'+(out_of_date?'red':'')+'">'+row.sp00+'</span>';
				row.sp11str='<span mark="sp" class="'+(out_of_date?'red':'')+'">'+row.sp11+'</span>';
				row.sp22str='<span mark="sp" class="'+(out_of_date?'red':'')+'">'+row.sp22+'</span>';
				row.sp33str='<span mark="sp" class="'+(out_of_date?'red':'')+'">'+row.sp33+'</span>';
				
				row.sp09str='<span mark="sp" class="'+(out_of_date?'red':'')+'">'+row.sp09+'</span>';
				row.sp01str='<span mark="sp" class="'+(out_of_date?'red':'')+'">'+row.sp01+'</span>';
				row.sp02str='<span mark="sp" class="'+(out_of_date?'red':'')+'">'+row.sp02+'</span>';
				row.sp12str='<span mark="sp" class="'+(out_of_date?'red':'')+'">'+row.sp12+'</span>';
				row.sp03str='<span mark="sp" class="'+(out_of_date?'red':'')+'">'+row.sp03+'</span>';
				row.sp13str='<span mark="sp" class="'+(out_of_date?'red':'')+'">'+row.sp13+'</span>';
				row.sp23str='<span mark="sp" class="'+(out_of_date?'red':'')+'">'+row.sp23+'</span>';
				row.sp04str='<span mark="sp" class="'+(out_of_date?'red':'')+'">'+row.sp04+'</span>';
				row.sp14str='<span mark="sp" class="'+(out_of_date?'red':'')+'">'+row.sp14+'</span>';
				row.sp24str='<span mark="sp" class="'+(out_of_date?'red':'')+'">'+row.sp24+'</span>';
			}
			html[html.length] = tableTpl[2].tpl(row)+tableTpl[4].tpl(row);
			lgname.push(row.mname);
		}); 
		if (out_of_date_matches==all_matches){
			stop_sale="yes";
		}
		$("#stop_sale").val(stop_sale);
		$("#all_matches").val(all_matches);
		$("#out_of_date_matches").val(out_of_date_matches);	
		
		$("#vsTable").html(tableTpl[0]+html.join('')+ tableTpl[3]);
		if (stop_sale=="yes"){			
			$(".vs_lines").show();
		}
		$("#vsTable").show();	
		//生成联赛列表
   		var arr_league = [];
   		var league_list_html = '';
   		var match_num_of_league = {};
   		lgname.each( function(item) {
   			var league_name = item;
   				if ($_sys.getSub(arr_league,league_name) == -1 ) {
   					arr_league.push(league_name);
   					league_list_html += '<li><label for="' + league_name + '"><input name="lg" type="checkbox" value="' + league_name + '" checked="checked"/><span>' + league_name + '</span>[<i>'+league_name +'_num</i>]</label></li>';
  				}
   				if (typeof match_num_of_league[league_name] == 'undefined') {
   					match_num_of_league[league_name] = 1;
   				} else {
   					match_num_of_league[league_name]++;
   				}
   				
   		} );
   		for (var league_name in match_num_of_league) {
   			league_list_html = league_list_html.replace(league_name + '_num', match_num_of_league[league_name]);
   		}
   		$("#lglist").html(league_list_html);
		this.postMsg('load_duizhen_succ');			
	}
});

/* 主程序*/
Class( {	
	use   : 'mask',
	ready : true,	
	index : function(){		
		this.lib.LoadExpect();
		this.goTotop();
		Class.C('odds_t','bjdc/');
		Class.C('lot_id', 85);
    	this.oneodds=true;
		this.onMsg('load_duizhen_succ', function () {
			this.sethref();
			this._index();
			this.get('#select_time').change(function (){
	            Y.postMsg('msg_change_time', this.value);
	        });
			this.onMsg('msg_change_time', function (index){
	            this._getPvs();
	            this.endTimeList.show(index == '0');
	            this.matchTimeList.show(index == '1');
	        });
			$('div[mark=endtime]').mouseover(function(){
				$("div[mark=showend]").show();
				$(this).find(".matchxz").addClass("matchxzc");
			});
			$('div[mark=endtime]').mouseout(function(){
				$("div[mark=showend]").hide();
				$(this).find(".matchxz").removeClass("matchxzc");
			});
			$("div[mark=showend] a").click(function(){
				var endvalue=$(this).attr("value");
				$("#select_time").html($(this).text());
				$("div[mark=showend]").hide();
				$('div[mark=endtime]').find(".matchxz").removeClass("matchxzc");
				 Y.postMsg('msg_change_time', endvalue);
			});
		});		
		
	},
	_getPvs: function (){//
        this.endTimeList = this.get('#dcvsTable span.end_time');
        this.matchTimeList = this.get('#dcvsTable span.match_time');  
   },
	sethref:function() {
		var ex=this.get("#expect").val();
		if (ex == "") {
			return false;
		}
		var lottype=parseInt(this.need('#playid').val());
		this.ajax({
				url:"/cpdata/omi/bjdc/"+ex+"/"+ex+"_odds.xml",
        		end:function(data,i){
                     this.qXml('//row', data.xml, function (u, i){
                    	 $("#match"+u.items.xid).html(u.items.ln);	
                    	 $("#match"+u.items.xid).attr("href","http://info.159cai.com/league/index/"+u.items.lid);
                    	 $("#hn"+u.items.xid).attr("href","http://info.159cai.com/team/index/"+u.items.htid);
                       	 $("#gn"+u.items.xid).attr("href","http://info.159cai.com/team/index/"+u.items.gtid);
             			
        				$("#ox"+u.items.xid).attr("href","http://odds.159cai.com/match/analysis/"+u.items.oddsmid+"?lotyid=5");
         				$("#oz"+u.items.xid).attr("href","http://odds.159cai.com/match/odds/"+u.items.oddsmid+"?lotyid=5");
         				$("#oy"+u.items.xid).attr("href","http://odds.159cai.com/match/asia/"+u.items.oddsmid+"?lotyid=5");
                    	 $("#htid"+u.items.xid+" ").attr("data",u.items.htid);
        				 $("#gtid"+u.items.xid+" ").attr("data",u.items.gtid);	
            				if(lottype==34 || lottype==42){//添加赔率信息
            					if(Y.get("#oh"+u.items.xid).html()=="0.00" || Y.get("#oh"+u.items.xid).html()=="--"){Y.get("#oh"+u.items.xid).html(u.items.oh);}
            					if(Y.get("#od"+u.items.xid).html()=="0.00" || Y.get("#od"+u.items.xid).html()=="--"){Y.get("#od"+u.items.xid).html(u.items.od);}
            					if(Y.get("#oa"+u.items.xid).html()=="0.00" || Y.get("#oa"+u.items.xid).html()=="--"){Y.get("#oa"+u.items.xid).html(u.items.oa);}
            				}
                     });  
                     if(this.oneodds){
                         var xhhistory = "";
                 		 if(Class.config('playId')=="42"){
                 			 xhhistory="tr td a em";
                    	     historyMatchOdds({
       	                         items: xhhistory,
       	                         tipid: 'odds_tip',
       	                         tip: '#odds_tip',
       	                         fleft: 260
       	                     }); 
    	                     $("#oddstype").odds_select_name();
    	                     // load_odds_sp();
    	                     ozOdds({
       	                         items: '.pjpl',
       	                         tipid: 'odds_tip',
       	                         tip: '#odds_tip',
       	                         path: '/data/static/odds/jczq/oz'
       	                     });    			 
                 			 
                 		 }

	                     this.oneodds = false;
                     }
        		}
				});
	},
	goTotop:function (){
        var isIE=!!window.ActiveXObject;
        var isIE6 = isIE&&!window.XMLHttpRequest;
        var btn = $("#goTotop");
        var right = 0;
        var top = $(window).height()-247;
        var ietop = $(window).height()-247+$(window).scrollTop();
        var flag = true;
        $(window).resize(function(){
            btn.css({"position":"fixed",top:top,right:right});
            if(isIE6)btn.css({"position":"absolute",top:ietop,right:right});
        })
        btn.css({"position":"fixed",top:top,right:right});
        var areaTop = Y.get("#right_area").getXY().y;
        
        $(window).scroll(function(){
        	 if ($(this).scrollTop() > areaTop){//跟踪对齐当滚动条超过右侧区域则开始滚动
	            	var V = $('#titleTable_r');
	        		if (V[0]) {
	        			var T = $(document),
	        			H = $("#main").eq(0),
	        			M = H.offset().top + H.outerHeight(),
	        			F = V.innerWidth(),
	        			B = V.offset().top,
	        			L = V.outerHeight(), 
	        			u = T.scrollTop();
	        			Z = Math.min(0, M - (L + u));
	        			
	        			if (B == Z) {
	        				V.css({left: "auto", top: "auto",width: F, position: "static"});
	        			} else {
	        				if(isIE6){
	        					V.css({left: "auto",top: Z+$(window).scrollTop(), width: F,position: "absolute"});
	        				}else{
	        					V.css({left: "auto",top: Z-9, width: F, position: "fixed"});
	        				}
	        			}
	        			Y.get("#titleTable_r").setStyle('z-index: 1;');
	        		}
	            	
	             }else{//停止浮动对齐
            	 Y.get("#titleTable_r").setStyle('z-index: 1; top:0;  left: auto;position: static;');
            }
        	
            if(flag)
            {
                btn.show();
                flag = false;
            }
            if($(this).scrollTop() == 0)
            {
                btn.hide();
                flag = true;
            }
            btn.css({"position":"fixed",top:top,right:right});
            ietop = $(window).height()-247+$(window).scrollTop();
            if(isIE6)btn.css({"position":"absolute",top:ietop,right:right});
        })
    },
	_index : function () {
		var Y = this, d = new Date();
		
		// 切换期号
		this.get('#expect_select').change( function() {
			var url = location.href.replace(/#.*/, '');
			if (url.indexOf('expect') != -1) {
				url = url.replace(/expect=.+?(?=&|$)/ig, 'expect=' + this.value.split('|')[0]);
			} else if (url.indexOf('?') != -1 && url.indexOf('=') != -1) {
				url += '&expect=' + this.value.split('|')[0];
			} else {
				url += '?expect=' + this.value.split('|')[0];
			}
			location.replace(url);
		} );

		if (this.get('tr.vs_lines').nodes.length == 0) {
			return;  //没取到对阵的话则以下js代码不执行
		}

		Class.extend( 'getIndex', function(arr, v) {
			for (var i = 0, l = arr.length; i < l; i++) {
				if (arr[i] == v) return i;	
			}
			return -1;
		} );

		Class.config('playId', parseInt(this.need('#playid').val()) );  //玩法id
		Class.config('expect', this.need('#expect').val() );  //期号
		switch (Class.config('playId')) {
			case 34 :    //让球胜平负
				Class.config('playName', 'rqspf');
				Class.config('codeValue', ['胜', '平', '负']);
				Class.config('playName_1', 'SPF');
				Class.config('codeValue_1', ['3', '1', '0']);
				break;
			case 40 :    //总进球数
				Class.config('playName', 'jq');
				Class.config('codeValue', ['0', '1', '2', '3', '4', '5', '6', '7+']);
				Class.config('playName_1', 'JQS');
				Class.config('codeValue_1', ['0', '1', '2', '3', '4', '5', '6', '7']);
				break;
			case 41 :    //上下单双
				Class.config('playName', 'ds');
				Class.config('codeValue', ['上+单', '上+双', '下+单', '下+双']);
				Class.config('playName_1', 'SXP');
				Class.config('codeValue_1', ['1-1', '1-0', '0-1', '0-0']);
				break;
			case 42 :    //比分
				Class.config('playName', 'bf');
				Class.config('codeValue', [ '胜其他', '1:0', '2:0', '2:1', '3:0', '3:1', '3:2', '4:0', '4:1', '4:2', 
				                            '平其他', '0:0', '1:1', '2:2', '3:3', 
				                            '负其他', '0:1', '0:2', '1:2', '0:3', '1:3', '2:3', '0:4', '1:4', '2:4' ]);
				Class.config('playName_1', 'CBF');
				Class.config('codeValue_1', [ '9:0', '1:0', '2:0', '2:1', '3:0', '3:1', '3:2', '4:0', '4:1', '4:2', 
				                            '9:9', '0:0', '1:1', '2:2', '3:3', 
				                            '0:9', '0:1', '0:2', '1:2', '0:3', '1:3', '2:3', '0:4', '1:4', '2:4' ]);
				break;
			case 51 :    //半全场
				Class.config('playName', 'bq');
				Class.config('codeValue', ['胜-胜', '胜-平', '胜-负', '平-胜', '平-平', '平-负', '负-胜', '负-平', '负-负']);
				Class.config('playName_1', 'BQC');
				Class.config('codeValue_1', ['3-3', '3-1', '3-0', '1-3', '1-1', '1-0', '0-3', '0-1', '0-0']);
				break;
			default :
		}
		var code_value_index = {};
		Class.config('codeValue').each( function(v, i) {
			code_value_index[v] = i;
		} )
		Class.config('codeValueIndex', code_value_index);
		Class.config('stopSale', this.need('#stop_sale').val() == 'yes');

		var tableSelectorClass = this.lib.TableSelector_BF || this.lib.TableSelector;
		tableSelectorClass( {
			vsTable : '#vsTable',
			vsLines : 'tr.vs_lines',
			spLines : 'tr.sp_lines',

			ckRangqiu   : '#ck_rangqiu',
			ckNoRangqiu : '#ck_no_rangqiu',
			ckOutOfDate : '#ck_out_of_date',
			hiddenMatchesNumTag : '#hidden_matches_num',
			matchShowTag : '#match_show',
			matchFilter  : '#match_filter',
			leagueShowTag  : '#league_show',
			leagueSelector : '#leagueSelector',
			selectAllLeague      : '#selectAllBtn',
			removeAllLeague :'#unAllBtn',
			wdls : '#wdls',
			selectOppositeLeague : '#selectOppBtn'
				
		} );

		this.lib.TouzhuInfo( {
			endtime : '#endtime',
			vsLines : 'tr.vs_lines',
			checkboxclear : '#checkbox_clear',
			touzhuTable : '#touzhu_table',
			mouseoverClass : 'nx_s'
		} );

		this.lib.GuoGuan( {
			switchTag : '#gg_type li',
			ggTable   : '#gg_table tbody'
		} );

		this.lib.TouzhuResult( {
			beishuInput : '#beishu_input',
			matchNum    : '#match_num',
			zhushu      : '#zhushu',
			totalSum    : '#total_sum'
		} );
		
		this.lib.ConfirmForm();
		this.lib.Clock('#running_clock');
		this.lib.PrizePredict();

		if (Class.config('disableBtn')) { //禁用代购和合买按钮
			Y.get('#dg_btn').swapClass('jc_mtz', 'jc_odtz').html('<b>确认代购</b>').attr('id', '');
			Y.get('#hm_btn').swapClass('jc_mhm', 'jc_odhm').html('<b>发起合买</b>').attr('id', '');
		}

		// 发起代购
		Y.get('#dg_btn').click( function() {
			Y.postMsg('msg_do_dg');
		} );

		// 发起合买
		Y.get('#hm_btn').click( function() {
			Y.postMsg('msg_do_hm');
		} );

		//创建一个公共弹窗, 使用msg_show_dlg进行调用
		this.infoLay = this.lib.MaskLay('#defLay', '#defConent');
		this.infoLay.addClose('#defCloseBtn', '#defTopClose');
		this.get('#defLay div.tantop').drag(this.get('#defLay'));
		this.infoLay.noMask = self != top;

		// 提供弹窗服务
		this.onMsg('msg_show_dlg', function (msg, fn, forbid_close) {
			this.infoLay.pop(msg, fn, forbid_close);
			if (Y.C('autoHeight')) {
				this.infoLay.panel.nodes[0].style.top = Y.C('clientY') - 80 + 'px';
			}
		} );

		this.goTop = this.one('a.back_top');
		this.rightArea = this.get('#right_area');
		this.mainArea = this.get('#main');
		if (this.ie && this.ie == 6) {
			this.goTop.style.position = 'absolute';
			this.goTop.style.left = '750px';
		} else {
			setTimeout( function() {
				Y.goTop.style.left = Y.rightArea.getXY().x + 'px';
			}, 500 );
		}
//		this.get(window).scroll( function () {
//			clearTimeout(Class.C('scrollTimer'));
//			if (Y.ie && Y.ie == 6) {
//				Class.C('scrollTimer', setTimeout(Y.scrollStillIE6.proxy(Y), 100));
//			} else {
//				Class.C('scrollTimer', setTimeout(Y.scrollStill.proxy(Y), 100));
//			}
//		} );

		//设置表头浮动
		 Y.get('<div id="title_folats" style="z-index:9;"></div>').insert().setFixed({
	            area: '#dcvsTable',
	            offset:0,
	            init: function(){
	                var This = this,
	                    title = this.area.parent().find('#tabletop').one(0),
	                    floatTitle = title.cloneNode(true);
	                this.get(floatTitle).insert(this);
	                this.floatTitle = floatTitle;
	                this.title = title;
	                this.hide();
	                Y.get(window).resize(function(){
	                    This.setStyle('left:'+(This.area.getXY().x)+'px;width:'+(This.area.prop('offsetWidth'))+'px')
	                });
	                Yobj.get('div.jcslt').remove();
	            },
	            onin: function (){
	                this.show();
	                this.title.swapNode(this.floatTitle);
	                var offset = this.ns.ie == 6 ? 2 : 0;
	                this.setStyle('left:'+(this.area.getXY().x+offset)+'px;width:'+this.area.prop('offsetWidth')+'px')
	            },
	            onout: function (){
	                this.hide();
	                this.title.swapNode(this.floatTitle);
	            }
	        });
	},

//	scrollStill : function() {
//		var window_size = Y.getSize();
//		Y.goTop = Y.get('a.back_top');
//		Y.mainArea = Y.get('#main');
//		Y.leftArea = Y.get('#main div.dc_l');
//		Y.rightArea = Y.get('#main div.dc_r');
//		var right_xy = Y.rightArea.getXY();
//		var right_size = Y.rightArea.getSize();
//		if (window_size.scrollTop + window_size.offsetHeight > Y.mainArea.getXY().y + Y.mainArea.getSize().offsetHeight + 10) {
//			Y.goTop.setStyle('position', 'absolute').setStyle('bottom', 0).setStyle('left', '750px');
//		} else {
//			Y.goTop.setStyle('position', 'fixed').setStyle('bottom', '10px').setStyle('left', right_xy.x-10 + 'px');
//		}
//		if (window_size.scrollTop <= right_xy.y || 
//				right_xy.y + right_size.offsetHeight + 90 > window_size.scrollTop + window_size.offsetHeight ||
//				Y.leftArea.getSize().offsetHeight - 90 < right_size.offsetHeight) {
//			Y.goTop.hide();
//		} else {
//			Y.goTop.show();
//		}
//	},

//	scrollStillIE6 : function() {
//		var window_size = Y.getSize();
//		Y.goTop = Y.get('a.back_top');
//		Y.mainArea = Y.get('#main');
//		Y.leftArea = Y.get('#main div.dc_l');
//		Y.rightArea = Y.get('#main div.dc_r');
//		var right_xy = Y.rightArea.getXY();
//		var right_size = Y.rightArea.getSize();
//		if (window_size.scrollTop + window_size.offsetHeight > Y.mainArea.getXY().y + Y.mainArea.getSize().offsetHeight + 10) {
//			Y.goTop.setStyle('top', '').setStyle('bottom', 0);
//		} else {
//			Y.goTop.setStyle('top', window_size.scrollTop + window_size.offsetHeight - 310 + 'px');
//		}
//		if (window_size.scrollTop <= right_xy.y || 
//				right_xy.y + right_size.offsetHeight + 90 > window_size.scrollTop + window_size.offsetHeight || 
//				Y.leftArea.getSize().offsetHeight - 90 < right_size.offsetHeight) {
//			Y.goTop.hide();
//		} else {
//			Y.goTop.show();
//		}
//	}

});
//设置某个标签在某个区域内是静止的
Class.fn.setFixed = function (opt){
    var Y = this.ns, Yn = this, ini = this.ns.mix({
        onin: Y.getNoop(),//移入
        onout: Y.getNoop(),//移出区域
        area: document.body,//默认区域为body
        offset: 0//偏移
    }, opt), areaTop, clearCache, isout = true;
    this.area = this.get(ini.area);
    if (Y.ie == 6 && !Y.C('-html-bg-fixed')) {//修正ie6闪烁
        Y.C('-html-bg-fixed', true);
        var ds = document.documentElement.style;
        ds.backgroundImage = 'url(about:blank)';
        ds.backgroundAttachment = 'fixed';   
    }
    if(window.Node){//添加IE独有方法 replaceNode, swapNode
        Node.prototype.replaceNode=function($target){
            return this.parentNode.replaceChild($target,this);
        }
        Node.prototype.swapNode=function($target){
            var $targetParent=$target.parentNode;
            var $targetNextSibling=$target.nextSibling;
            var $thisNode=this.parentNode.replaceChild($target,this);
            $targetNextSibling?$targetParent.insertBefore($thisNode,$targetNextSibling):$targetParent.appendChild($thisNode);
            return this;
        }
    }
    if(opt.init){
    	opt.init.call(this)
    }
    this.get(window).scroll(handle);
    function handle(){
        clearTimeout(clearCache);
        if (!areaTop) {//优化滚动时每次计算区域位置
            clearCache = setTimeout(function() {
                areaTop = false
            },50);
            areaTop = Y.get(ini.area).getXY().y;
        }
        var sTop = Math.max(document.body.scrollTop || document.documentElement.scrollTop);
        if (sTop > areaTop) {//跟踪对齐
            if (isout) {
                isout = false;
                ini.onin.call(Yn, ini.area);
                Yn.each(function (el){//存储top值
                    Y.get(el).data('-fixed-before-top', el.style.top);
                })
            }
            if (Y.ie == 6) {
                Yn.each(function (el){
                    el.style.position = 'absolute';
                    el.style.setExpression('top', 'eval((document.documentElement||document.body).scrollTop+' + ini.offset + ') + "px"')
                })                 
            }else{
                Yn.setStyle('position:fixed;top:'+ini.offset+'px');
            }
        }else{//停止浮动对齐
            if (!isout) {
                isout = true;
                ini.onout.call(Yn, ini.area);                
            }
            if (Y.ie == 6) {
                Yn.each(function (el){
                    el.style.removeExpression('top');
                    el.style.top = Y.get(el).data('-fixed-before-top') || '';
                })
            }else{
                Yn.each(function (el){
                    el.style.position = '';
                    el.style.top = Y.get(el).data('-fixed-before-top') || '';
                })
            }            
        } 
   } 
   return this
};