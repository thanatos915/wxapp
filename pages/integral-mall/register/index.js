Page({
    data: {
        currentDate: "",
        dayList: "",
        currentDayList: "",
        currentObj: "",
        currentDay: "",
        selectCSS: "bk-color-day",
        weeks: [ {
            day: "日"
        }, {
            day: "一"
        }, {
            day: "二"
        }, {
            day: "三"
        }, {
            day: "四"
        }, {
            day: "五"
        }, {
            day: "六"
        } ]
    },
    doDay: function(t) {
        var e = this, a = e.data.currentObj, r = a.getFullYear(), n = a.getMonth() + 1, i = a.getDate(), o = "";
        o = "left" == t.currentTarget.dataset.key ? (n -= 1) <= 0 ? r - 1 + "/12/" + i : r + "/" + n + "/" + i : (n += 1) <= 12 ? r + "/" + n + "/" + i : r + 1 + "/1/" + i, 
        a = new Date(o), this.setData({
            currentDate: a.getFullYear() + "年" + (a.getMonth() + 1) + "月",
            currentObj: a,
            currentYear: a.getFullYear(),
            currentMonth: a.getMonth() + 1
        });
        var s = a.getFullYear() + "/" + (a.getMonth() + 1) + "/";
        this.setSchedule(a);
        var g = getApp().core.getStorageSync(getApp().const.CURRENT_DAY_LIST);
        for (var u in g) ;
        var c = [], d = e.data.registerTime;
        for (var u in g) g[u] && c.push(s + g[u]);
        var h = function(t, e) {
            for (var a = 0, r = 0, n = new Array(); a < t.length && r < e.length; ) {
                var i = new Date(t[a]).getTime(), o = new Date(e[r]).getTime();
                i < o ? a++ : i > o ? r++ : (n.push(e[r]), a++, r++);
            }
            return n;
        }(c, d), p = [];
        for (var u in g) g[u] && (g[u] = {
            date: g[u],
            is_re: 0
        });
        for (var u in h) {
            p = h[u].split("/");
            for (var u in g) g[u] && g[u].date == p[2] && (g[u].is_re = 1);
        }
        e.setData({
            currentDayList: g
        });
    },
    setSchedule: function(t) {
        for (var e = t.getMonth() + 1, a = t.getFullYear(), r = t.getDate(), n = (t.getDate(), 
        new Date(a, e, 0).getDate()), i = t.getUTCDay() + 1 - (r % 7 - 1), o = i <= 0 ? 7 + i : i, s = [], g = 0, u = 0; u < 42; u++) {
            u < o ? s[u] = "" : g < n ? (s[u] = g + 1, g = s[u]) : g >= n && (s[u] = "");
        }
        getApp().core.setStorageSync(getApp().const.CURRENT_DAY_LIST, s);
    },
    selectDay: function(t) {
        var e = this;
        e.setData({
            currentDay: t.target.dataset.day,
            currentDa: t.target.dataset.day,
            currentDate: e.data.currentYear + "年" + e.data.currentMonth + "月",
            checkDay: e.data.currentYear + "" + e.data.currentMonth + t.target.dataset.day
        });
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        var e = this.getCurrentDayString();
        this.setData({
            currentDate: e.getFullYear() + "年" + (e.getMonth() + 1) + "月",
            today: e.getFullYear() + "/" + (e.getMonth() + 1) + "/" + e.getDate(),
            yearmonth: e.getFullYear() + "/" + (e.getMonth() + 1) + "/",
            today_time: e.getFullYear() + "" + (e.getMonth() + 1) + e.getDate(),
            currentDay: e.getDate(),
            currentObj: e,
            currentYear: e.getFullYear(),
            currentMonth: e.getMonth() + 1
        }), this.setSchedule(e);
    },
    getCurrentDayString: function() {
        var t = this.data.currentObj;
        if ("" != t) return t;
        var e = new Date(), a = e.getFullYear() + "/" + (e.getMonth() + 1) + "/" + e.getDate();
        return new Date(a);
    },
    onReady: function(t) {
        getApp().page.onReady(this);
    },
    onShow: function(t) {
        getApp().page.onShow(this);
        var e = this;
        getApp().request({
            url: getApp().api.integral.explain,
            data: {
                today: e.data.today
            },
            success: function(t) {
                if (0 == t.code) {
                    if (t.data.register) a = t.data.register.continuation; else var a = 0;
                    e.setData({
                        register: t.data.setting,
                        continuation: a,
                        registerTime: t.data.registerTime
                    }), t.data.today && e.setData({
                        status: 1
                    });
                    var r = getApp().core.getStorageSync(getApp().const.CURRENT_DAY_LIST), n = [];
                    for (var i in r) n.push(e.data.yearmonth + r[i]);
                    var o = function(t, e) {
                        for (var a = 0, r = 0, n = new Array(); a < t.length && r < e.length; ) {
                            var i = new Date(t[a]).getTime(), o = new Date(e[r]).getTime();
                            i < o ? a++ : i > o ? r++ : (n.push(e[r]), a++, r++);
                        }
                        return n;
                    }(n, t.data.registerTime), s = [];
                    for (var i in r) r[i] && (r[i] = {
                        date: r[i],
                        is_re: 0
                    });
                    for (var i in o) {
                        s = o[i].split("/");
                        for (var i in r) r[i] && r[i].date == s[2] && (r[i].is_re = 1);
                    }
                    e.setData({
                        currentDayList: r
                    });
                }
            }
        });
    },
    onHide: function(t) {
        getApp().page.onHide(this);
    },
    onUnload: function(t) {
        getApp().page.onUnload(this);
    },
    onPullDownRefresh: function(t) {
        getApp().page.onPullDownRefresh(this);
    },
    onReachBottom: function(t) {
        getApp().page.onReachBottom(this);
    },
    register_rule: function() {
        this.setData({
            register_rule: !0,
            status_show: 2
        });
    },
    hideModal: function() {
        this.setData({
            register_rule: !1
        });
    },
    calendarSign: function() {
        var t = this, e = t.data.today_time, a = t.data.today, r = t.data.currentDay, n = t.data.checkDay;
        if (n && parseInt(e) != parseInt(n)) getApp().core.showToast({
            title: "日期不对哦",
            image: "/images/icon-warning.png"
        }); else {
            var i = t.data.currentDayList;
            getApp().request({
                url: getApp().api.integral.register,
                data: {
                    today: a
                },
                success: function(e) {
                    if (0 == e.code) {
                        t.data.registerTime.push(a);
                        var n = e.data.continuation;
                        for (var o in i) i[o] && i[o].date == r && (i[o].is_re = 1);
                        t.setData({
                            register_rule: !0,
                            status_show: 1,
                            continuation: n,
                            status: 1,
                            currentDayList: i,
                            registerTime: t.data.registerTime
                        }), parseInt(n) >= parseInt(t.data.register.register_continuation) && t.setData({
                            jiangli: 1
                        });
                    } else getApp().core.showToast({
                        title: e.msg,
                        image: "/images/icon-warning.png"
                    });
                }
            });
        }
    }
});