CP.Sx5 = function() {
    var lotteryType = $("#content_home").children().eq(0).attr("id").replace("buy_", "");
    var hasTouch = "ontouchstart" in window;
    var start_ev = hasTouch ? "touchstart": "mousedown";
    var end_ev = hasTouch ? "touchend": "mouseup";
    var s = {
        "11x5": {
            lot_id: "54",
            name: "11选5"
        },
        "11ydj": {
            lot_id: "56",
            name: "十一运夺金"
        }
    };
    var g = {
        cur: 0,
        curtab: 0,
        fps: 1e3,
        gid: s[lotteryType].lot_id,
        zhushu: 0,
        money: 0,
        totalMoney: 0,
        count_zs: 0,
        beishu: 1,
        qishu: 1,
        buyType: 1,
        codes: "",
        qihao_id: "",
        jiang: {
            0 : '<p>至少选1个号码</p><p>猜中第1个开奖号码奖金<em class="red">13元</em></p>',
            1 : '<p>至少选2个号码</p><p>猜中2个开奖号码奖金<em class="red">6元</em></p>',
            2 : '<p>至少选3个号码</p><p>猜中3个开奖号码奖金<em class="red">19元</em></p>',
            3 : '<p>至少选4个号码</p><p>猜中4个开奖号码奖金<em class="red">78元</em></p>',
            4 : '<p>至少选5个号码</p><p>猜中5个开奖号码奖金<em class="red">540元</em></p>',
            5 : '<p>至少选6个号码</p><p>猜中全部5个开奖号码奖金<em class="red">90元</em></p>',
            6 : '<p>至少选7个号码</p><p>猜中全部5个开奖号码奖金<em class="red">26元</em></p>',
            7 : '<p>至少选8个号码</p><p>猜中全部5个开奖号码奖金<em class="red">9元</em></p>',
            8 : '<p>至少选2个号码</p><p>按顺序猜中前2位号码奖金<em class="red">130元</em></p>',
            9 : '<p>至少选3个号码</p><p>按顺序猜中前3位号码奖金<em class="red">1170元</em></p>',
            10 : '<p>至少选2个号码</p><p>猜中前2位开奖号码奖金<em class="red">65元</em></p>',
            11 : '<p>至少选3个号码</p><p>猜中前3位开奖号码奖金<em class="red">195元</em></p>'
        },
        s: {
            0 : "1",
            1 : "2",
            2 : "3",
            3 : "4",
            4 : "5",
            5 : "6",
            6 : "7",
            7 : "8",
            10 : "2",
            11 : "3"
        },
        wf: {
            0 : "前一直选",
            1 : "任选二",
            2 : "任选三",
            3 : "任选四",
            4 : "任选五",
            5 : "任选六",
            6 : "任选七",
            7 : "任选八",
            8 : "前二直选",
            9 : "前三直选",
            10 : "前二组选",
            11 : "前三组选"
        }
    };
    var omit = {};
    var o = {
        pageGo: {
            goBack: function() {
                TopAnch.init({
                    title: s[lotteryType].name,
                    prevShow: true,
                    prevFun: function() {
                        window.location.href = "#type=index"
                    },
                    menu: [{
                        name: "投注选号",
                        url: "javascript:;",
                        cur: true
                    },
                    {
                        name: "开奖结果",
                        url: "#type=url&p=kj/result.html?in_=" + s[lotteryType].lot_id,
                        cur: false
                    },
                    {
                        name: "玩法帮助",
                        url: "#type=url&p=wf/" + lotteryType + ".html",
                        cur: false
                    }]
                })
            }
        },
        slide: function(_obj) {
            var menu = $(_obj.menu);
            var con = $(_obj.con);
            var cur = _obj.cur || g.cur;
            var Q = $(window).width();
            var Q1 = {
                0 : "0",
                1 : "0",
                2 : "0",
                3 : "0",
                4 : "0",
                5 : "0",
                6 : "0",
                7 : "0 ",
                8 : "1",
                9 : "2",
                10 : "0",
                11 : "0"
            };
            $("#bonus_ .jxssctitle").html(g.jiang[cur]);
            con.each(function(i) {
                $(this).show();
                $(this).css({
                    left: i < cur ? -Q: i > cur ? Q: ""
                });
                i == cur ? $(this).css({
                    left: 0
                }) : ""
            });
            menu.click(function() {
                var index = $(this).index();
                var Q2 = Q1[index];
                var conW = con.width();
                $(this).addClass("cur").siblings().removeClass("cur");
                con.each(function(i) {
                    if (g.curtab == i) {
                        $(this).stop(true, false).animate({
                            left: i < Q2 ? -conW: i > Q2 ? conW: ""
                        },
                        _obj.conSpeed || 300, _obj.effect || "")
                    } else if (i != Q2) {
                        $(this).css({
                            left: i < Q2 ? -conW: i > Q2 ? conW: ""
                        })
                    } else {
                        $(this).stop(true, false).animate({
                            left: 0
                        },
                        _obj.conSpeed || 300, _obj.effect || "")
                    }
                });
                g.cur = index;
                g.curtab = Q2;
                o.change(index, $(this))
            })
        },
        change: function(index, el) {
            var Q = el.prev().length ? el.prev().last()[0] : el[0];
            navScroll.scrollToElement(Q, 300);
            $("#bonus_ .jxssctitle").html(g.jiang[index]);
            o.clear($("#rx .ssqBall cite, #qe .ssqBall cite, #qs .ssqBall cite"));
            var Q1 = g.cur > 9 && "rx" || g.cur > 8 && "qs" || g.cur > 7 && "qe" || "rx";
            if ($("#yl").hasClass("red")) {
                o.omit_();
                $("#" + Q1).find(".omitnum").show()
            } else {
                $("#" + Q1).find(".omitnum").hide()
            }
        },
        clickBall: function(_this, on) {
            if ($(_this).is("." + on)) {
                $(_this).removeClass(on)
            } else {
                if (g.cur == "8" || g.cur == "9") {
                    var Q = $(_this).index();
                    if (g.cur == "9") {
                        $("#qs .ssqBall").each(function() {
                            $(this).find("cite").eq(Q).removeClass(on)
                        })
                    } else {
                        $("#qe .ssqBall").each(function() {
                            $(this).find("cite").eq(Q).removeClass(on)
                        })
                    }
                }
                $(_this).addClass(on)
            }
            o.countTotal()
        },
        countTotal: function() {
            if (g.cur == "8") {
                g.zhushu = $("#qe .ssqBall").eq(0).find(".cur").length * $("#qe .ssqBall").eq(1).find(".cur").length
            } else if (g.cur == "9") {
                g.zhushu = $("#qs .ssqBall").eq(0).find(".cur").length * $("#qs .ssqBall").eq(1).find(".cur").length * $("#qs .ssqBall").eq(2).find(".cur").length
            } else {
                g.zhushu = CP.math.C($("#rx .ssqBall").find(".cur").length, g.s[g.cur])
            }
            g.money = 2 * g.zhushu;
            $("#Notes").html(g.zhushu);
            $("#Money").html(g.money);
            if (g.zhushu) {
                $("#Notes").addClass("red");
                $("#Money").addClass("red")
            } else {
                $("#Notes").removeClass("red");
                $("#Money").removeClass("red")
            }
        },
        highLight: function(_arr, dom) {
            o.clear($(dom + " cite"));
            for (var j = 0,
            l1 = _arr.length; j < l1; j++) {
                $(dom + " cite").eq(parseInt(_arr[j], 10) - 1).addClass("cur")
            }
        },
        clear: function(dom) {
            dom.each(function() {
                $(this).removeClass()
            });
            o.countTotal()
        },
        jxNum: function(n, type) {
            if (type) {
                for (var i = 1; i <= n; i++) {
                    var _code = "";
                    if (g.cur == "8") {
                        _code = CP.Util.padArray(CP.math.random(1, 11, 2, false));
                        _code = _code[0] + "|" + _code[1]
                    } else if (g.cur == "9") {
                        _code = CP.Util.padArray(CP.math.random(1, 11, 3, false));
                        _code = _code[0] + "|" + _code[1] + "|" + _code[2]
                    } else {
                        _code = CP.Util.padArray(CP.math.random(1, 11, g.s[g.cur], false)).sort(function(a, b) {
                            return a - b
                        }) + ""
                    }
                    o.addToList([_code, 1]);
                    o.countAll()
                }
                window.scrollTo(0, 1);
                o.setLocal()
            } else {
                var Q, Q1;
                if (g.cur == "8") {
                    Q1 = CP.math.random(1, 11, 2, false);
                    o.clear($("#qe .ssqBall cite"));
                    for (var j = 0,
                    l1 = Q1.length; j < l1; j++) {
                        $("#qe .ssqBall").eq(j).find("cite").eq(parseInt(Q1[j], 10) - 1).addClass("cur")
                    }
                } else if (g.cur == "9") {
                    Q1 = CP.math.random(1, 11, 3, false);
                    o.clear($("#qs .ssqBall cite"));
                    for (var j = 0,
                    l1 = Q1.length; j < l1; j++) {
                        $("#qs .ssqBall").eq(j).find("cite").eq(parseInt(Q1[j], 10) - 1).addClass("cur")
                    }
                } else {
                    Q = CP.Util.padArray(CP.math.random(1, 11, g.s[g.cur], false)).sort(function(a, b) {
                        return a - b
                    });
                    o.highLight(Q, "#rx .ssqBall")
                }
                o.countTotal()
            }
        },
        countAll: function() {
            var zhushu = 0;
            g.beishu = $("#tbox_beishu").val();
            g.qishu = $("#tbox_qishu").val();
            var codes = [];
            $("#bet_list .bet-num").each(function(e) {
                zhushu += parseInt($(this).val());
                codes.push($(this).next().val())
            });
            g.codes = codes.join(";");
            $("#countNotes").html(g.count_zs = zhushu);
            $("#countMoney").html(g.totalMoney = g.count_zs * 2 * g.beishu * g.qishu)
        },
        getCode: function(dom) {
            var _arr = [];
            for (var i = 0; i < dom.find(".cur").length; i++) {
                _arr[i] = dom.find(".cur").eq(i).text()
            }
            return _arr
        },
        addList: function() {
            if (!g.qihao_id) {
                alert("期号获取失败!请刷新页面");
                return false
            } else if (g.zhushu == "0") {
                alert("至少选择一注");
                return false
            } else {
                var _code = "",
                _arrRed = [];
                if (g.cur == "8") {
                    var Q = o.getCode($("#qe .ssqBall").eq(0));
                    var Q1 = o.getCode($("#qe .ssqBall").eq(1));
                    _code = CP.Util.padArray(Q) + "|" + CP.Util.padArray(Q1)
                } else if (g.cur == "9") {
                    var Q = o.getCode($("#qs .ssqBall").eq(0));
                    var Q1 = o.getCode($("#qs .ssqBall").eq(1));
                    var Q2 = o.getCode($("#qs .ssqBall").eq(2));
                    _code = CP.Util.padArray(Q) + "|" + CP.Util.padArray(Q1) + "|" + CP.Util.padArray(Q2)
                } else {
                    _arrRed = o.getCode($("#rx .ssqBall"));
                    _code = CP.Util.padArray(_arrRed) + ""
                }
                o.addToList([_code, g.zhushu]);
                window.location.href = "#type=fun&fun=CP.Sx5.openList";
                o.setLocal()
            }
        },
        addToList: function(arr, wf, cur) {
            var _html = "";
            _html = '<div class="ssqtzNum">';
            _html += '<cite class="errorBg"><em class="error2"></em></cite>';
            _html += "<span><em>" + arr[0].replace(/,/g, " ") + "</em>";
            _html += "</span><p>" + (wf || g.wf[g.cur]) + "&nbsp;&nbsp;&nbsp;" + arr[1] + "注" + 2 * arr[1] + "元</p>";
            _html += '<input type="hidden" value="' + arr[1] + '" name="bet_num" class="bet-num">';
            _html += '<input type="hidden" value="' + (cur || g.cur) + "_" + arr[0] + '" name="bet" class="bet">';
            _html += "</div>"; ! wf && $("#bet_list").prepend(_html) || $("#bet_list").append(_html);
            o.clear($("#rx cite, #qs cite, #qe cite"));
            $("#Notes").html(0);
            $("#Money").html(g.zhushu = 0)
        },
        omit_: function() {
            var Q = g.cur;
            if (Q == "10") {
                var m2 = omit.m2.split(",");
                $("#rx").find(".omitnum cite").each(function(aa) {
                    $(this).html(m2[aa])
                })
            } else if (Q == "11") {
                var m3 = omit.m3.split(",");
                $("#rx").find(".omitnum cite").each(function(aa) {
                    $(this).html(m3[aa])
                })
            } else if (Q == "8") {
                var m1 = omit.m1.split(",");
                var m4 = omit.m4.split(",");
                $("#qe").find(".omitnum:eq(0) cite").each(function(aa) {
                    $(this).html(m1[aa])
                });
                $("#qe").find(".omitnum:eq(1) cite").each(function(aa) {
                    $(this).html(m4[aa])
                })
            } else if (Q == "9") {
                var m1 = omit.m1.split(",");
                var m4 = omit.m4.split(",");
                var m5 = omit.m5.split(",");
                $("#qs").find(".omitnum:eq(0) cite").each(function(aa) {
                    $(this).html(m1[aa])
                });
                $("#qs").find(".omitnum:eq(1) cite").each(function(aa) {
                    $(this).html(m4[aa])
                });
                $("#qs").find(".omitnum:eq(2) cite").each(function(aa) {
                    $(this).html(m5[aa])
                })
            } else {
                var m = Q == "0" && omit.m1.split(",") || omit.m0.split(",");
                $("#rx").find(".omitnum cite").each(function(aa) {
                    $(this).html(m[aa])
                })
            }
        },
        info: function() {
            function main() {
                $.ajax({
//                	http://yws.159cai.com/cpdata/omi/54/yilou/miss.xml?rnd=0.06939394772436991&_=1429000238089
                	url: CP.Data.apps + "/cpdata/omi/"+g.gid+"/yilou/miss.xml",
                    type: "POST",
                    dataType: "xml",
                    success: function(xml) {
                        var R = $(xml).find("R");
                        var p = R.attr("p");
                        var at = R.attr("t");
                        g.qihao_id = p;
                        $(".k3kjnum").html("<p>距" + p.substr(8) + "期截止</p><strong></strong>");
                        var n_ = new Date(arguments[2].getResponseHeader("Date"));
                        expect_change(n_, at);
                        var rp = $(xml).find("rowp");
                        var m0 = rp.attr("m0");
                        var m1 = rp.attr("m1");
                        var m2 = rp.attr("m2");
                        var m3 = rp.attr("m3");
                        var m4 = rp.attr("m4");
                        var m5 = rp.attr("m5");
                        omit = {
                            m0: m0,
                            m1: m1,
                            m2: m2,
                            m3: m3,
                            m4: m4,
                            m5: m5
                        };
                        var r = $(xml).find("row");
                        var html = "";
                        r.each(function(aa) {
                            var tn = $(this).attr("tn");
                            var p = $(this).attr("p");
                            p = p.substr(8);
                            var cc = $(this).attr("c");
                            code = cc.split(",");
                            if (aa == 0) {
                                var h = "";
                                if (cc != "") {
                                    h += '<p class="center">' + p + "期开奖</p>";
                                    h += '<div class="kjdice pdTop03 clearfix"><b>' + code[0] + "</b><b>" + code[1] + "</b><b>" + code[2] + "</b><b>" + code[3] + "</b><b>" + code[4] + '</b><em class="kjup kjdown"></em></div>'
                                } else {
                                    h += '<p class="pdLeft06">' + p + "期开奖中…</p>";
                                    h += '<div class="pdTop03 k3waitkj clearfix"><cite class="k3time"></cite><span class="left">等待开奖</span><em class="kjup kjdown"></em></div>'
                                }
                                $(".k3kjtext").html(h)
                            } else {
                                html += '<ul><li class="first">' + p + '期</li><li><span class="red">' + cc.replace(/,/g, " ") + '</span></li><li class="last">';
                                if (tn == 10) {
                                    html += '<span class="zjbtn"><cite></cite>中奖</span>'
                                } else if (tn == 9) {
                                    html += '<span class="wzjbtn"><cite></cite>未中</span>'
                                }
                                html += "</li></ul>"
                            }
                        });
                        $("#kj_code").html(html)
                    },
                    error: function() {
                        alert("期号获取失败");
                        return false
                    }
                })
            }
            function diffToString(num, iscn) {
                var unit = [864e5, 36e5, 6e4, 1e3, 1],
                date = [],
                cnDate = [];
                var cn = "天,时,分,秒,毫秒".split(",");
                for (var i = 0,
                l = unit.length; i < l; i++) {
                    date[i] = parseInt(num / unit[i]);
                    cnDate[i] = date[i] + cn[i];
                    num %= unit[i]
                }
                return iscn ? cnDate: date
            }
            function eachClock() {
                this.now += g.fps;
                var diff = this.endtime_ - this.now;
                var msg = "";
                if (diff >= 0) {
                    timeout = diffToString(diff, false);
                    msg = timeout[1] + "" + timeout[2] + ":" + CP.Util.pad(timeout[3], 2);
                    $("#11x5>strong").html(msg)
                } else {
                    msg = "已截止";
                    $("#11x5>strong").html(msg);
                    clearInterval(this.timer);
                    setTimeout(function() {
                        o.info()
                    },
                    2e3)
                }
            }
            function expect_change(now, endtime) {
                this.now = now.getTime();
                this.endtime_ = new Date(endtime.replace(/-/g, "/"));
                clearInterval(this.timer);
                this.timer = setInterval(function() {
                    eachClock()
                },
                g.fps);
                eachClock()
            }
            main()
        },
        init: function() {
            o.info()
        },
        openList: function() {
            $("#betball").hide();
            $("#betlist").show();
            $("#lot_footer").removeClass("fo_basket").addClass("fo_buy");
            TopAnch.init({
                title: "投注列表",
                prevShow: true,
                prevFun: function() {
                    window.location.href = "#type=url&p=list/" + lotteryType + ".html"
                },
                isBack: true,
                nextShow: false
            });
            o.countAll();
            window.scrollTo(0, 1)
        },
        setLocal: function() {
            var codes = [];
            $("#bet_list .bet:input").each(function() {
                codes.push($(this).val())
            });
            g.codes = codes.join(";");
            CP.Storage.set(lotteryType, g.codes, true)
        },
        fromLocal: function() {
            var _json = CP.Storage.get(lotteryType, true);
            if (_json) {
                try {
                    g.codes = _json;
                    var codes = _json.split(";");
                    for (var i = 0,
                    l = codes.length; i < l; i++) {
                        var Q = codes[i].split("_");
                        var Q1 = "";
                        if (Q[0] == "8") {
                            var Q2 = Q[1].split("|");
                            Q1 = Q2[0].split(",").length * Q2[1].split(",").length
                        } else if (Q[0] == "9") {
                            var Q2 = Q[1].split("|");
                            Q1 = Q2[0].split(",").length * Q2[1].split(",").length * Q2[2].split(",").length
                        } else {
                            Q1 = CP.math.C(Q[1].split(",").length, g.s[Q[0]])
                        }
                        o.addToList([Q[1], Q1], g.wf[Q[0]], Q[0])
                    }
                    o.countAll()
                } catch(e) {
                    sessionStorage.removeItem(lotteryType)
                }
            }
        },
        getArgument: function(t) {
            var buy = {};
            var code = CP.Util.joinString(s[lotteryType].lot_id, g.codes);
            switch (t) {
            case 1:
                buy = {
                    payUrl: "/trade/pcast.go",
                    gid: s[lotteryType].lot_id,
                    pid: g.qihao_id,
                    codes: code,
                    muli: g.beishu,
                    countMoney: g.totalMoney,
                    orderType: "dg"
                };
                break;
            case 3:
                var muli = "",
                pid = g.qihao_id;
                for (var i = 0; i < g.qishu; i++) {
                    muli += g.beishu + ",";
                    pid += ","
                }
                pid = pid.substring(0, pid.length - 1);
                muli = muli.substring(0, muli.length - 1);
                buy = {
                    payUrl: "/trade/zcast.go",
                    gid: s[lotteryType].lot_id,
                    pid: pid,
                    codes: code,
                    muli: muli,
                    countMoney: g.totalMoney,
                    zflag: $(".zjStop em").hasClass("nocheck") ? "0": "1",
                    orderType: "zh"
                };
                break
            }
            return buy
        },
        dopay: function() {
            g.qishu = parseInt($("#tbox_qishu").val());
            g.qishu > 1 ? g.buyType = 3 : g.buyType = 1;
            var _obj = o.getArgument(g.buyType);
            var cMoney = g.totalMoney;
            var data = {
                gid: s[lotteryType].lot_id,
                cMoney: cMoney,
                payPara: _obj
            };
            alert("提交中，请稍后！", "loading");
            CP.User.info(function(options) {
                remove_alert();
                if (options) {
                    jQuery.extend(data, options)
                }
                CP.Popup.buybox(data)
            });
            sessionStorage.removeItem(lotteryType)
        },
        dobuy: function() {
            var info = "";
            if (g.count_zs < 1) {
                info = "请至少选择一注彩票"
            } else if (!g.qishu) {
                info = "请输入期数"
            } else if (!g.beishu) {
                info = "请输入倍数"
            }
            if (info != "") {
                alert(info);
                return
            }
            o.dopay()
        }
    };
    var bind = function() {
        $("#content_kp").find(".ssqBall cite").Touch({
            fun: function(el) {
                o.clickBall(el, "cur")
            }
        });
        $("#deleted").bind(start_ev,
        function() {
            o.clear($("#rx .ssqBall cite, #qe .ssqBall cite, #qs .ssqBall cite"))
        });
        $("#shake").bind(start_ev,
        function() {
            o.jxNum(1, 0)
        });
        $("#jxbtn").bind(start_ev,
        function() {
            o.jxNum(1, 1)
        });
        $("#addlist").bind("click",
        function() {
            o.addList()
        });
        $("#hand").bind(start_ev,
        function() {
            location.href = "#type=url&p=list/" + lotteryType + ".html"
        });
        $("#dobuy").bind(start_ev,
        function() {
            o.dobuy()
        });
        $("#clearAll").bind(start_ev,
        function() {
            $("#bet_list").html("");
            $("#tbox_qishu").val("1");
            $("#tbox_beishu").val("1");
            CP.Storage.remove(lotteryType, true);
            o.countAll();
            if (g.qishu > 1) {
                $("#dohm").addClass("fqhmGray");
                $(".zjStop").show()
            } else {
                $("#dohm").removeClass("fqhmGray");
                $(".zjStop").hide()
            }
        });
        $("#bet_list").delegate(".errorBg", end_ev,
        function() {
            $(this).parent().remove();
            o.countAll();
            o.setLocal()
        });
        var buyTimes = 1;
        var zuiqishuNum = 1;
        $("#tbox_beishu").KeyBoard({
            val: buyTimes,
            max: 2e3,
            min: 1,
            num: 1,
            tag: "倍",
            fn: function() {
                g.beishu = $(this.ts).val();
                o.countAll()
            }
        });
        $("#tbox_qishu").KeyBoard({
            val: zuiqishuNum,
            max: 155,
            min: 1,
            num: 1,
            tag: "期",
            fn: function() {
                g.qishu = $(this.ts).val();
                g.qishu > 1 ? $(".zjStop").show() : $(".zjStop").hide();
                o.countAll()
            }
        });
        $(".zjStop").bind(start_ev,
        function() {
            $(this).find("em").toggleClass("nocheck check")
        });
        $(".k3kj").bind(start_ev,
        function() {
            $(this).find(".kjup").toggleClass("kjdown");
            $("#kj_code").toggle()
        });
        $("#kj_code").bind(start_ev,
        function() {
            $(this).toggle();
            $(".k3kj").find(".kjup").toggleClass("kjdown")
        });
        $("#yl").bind(start_ev,
        function() {
            var Q = g.cur > 9 && "rx" || g.cur > 8 && "qs" || g.cur > 7 && "qe" || "rx";
            if ($(this).hasClass("gray")) {
                $(this).removeClass("gray").addClass("red");
                $(".omitico").addClass("omitico2");
                $("#" + Q).find(".omitnum").show()
            } else {
                $(this).addClass("gray").removeClass("red");
                $(".omitico").removeClass("omitico2");
                $("#" + Q).find(".omitnum").hide()
            }
            o.omit_()
        });
        Shake.run(function() {
            o.jxNum(1, 0)
        })
    };
    var init = function() {
        o.fromLocal();
        o.pageGo.goBack();
        o.slide({
            effect: "swing",
            menuSpeed: 200,
            conSpeed: 350,
            menu: "#play_tabs li",
            con: "#content_kp article"
        });
        setTimeout(function() {
            navScroll = new iScroll("secNav", {
                snap: "li",
                hScrollbar: false,
                hScroll: true,
                vScroll: false
            })
        },
        100);
        o.init();
        bind()
    };
    return {
        init: init,
        openList: o.openList,
        pageGo: o.pageGo
    }
} ();
CP.Sx5.init();
function resetPage() {
    CP.Sx5.pageGo.goBack();
    $("#betball").show();
    $("#betlist").hide();
    $("#lot_footer").removeClass("fo_buy").addClass("fo_basket")
}