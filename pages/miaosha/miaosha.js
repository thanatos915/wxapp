function t(t) {
    if (t < 60) return "00:00:" + ((e = t) < 10 ? "0" + e : e);
    if (t < 3600) {
        e = t % 60;
        return "00:" + ((i = parseInt(t / 60)) < 10 ? "0" + i : i) + ":" + (e < 10 ? "0" + e : e);
    }
    if (t >= 3600) {
        var a = parseInt(t / 3600), i = parseInt(t % 3600 / 60), e = t % 60;
        return (a < 10 ? "0" + a : a) + ":" + (i < 10 ? "0" + i : i) + ":" + (e < 10 ? "0" + e : e);
    }
}

var a = require("./../../components/quick-navigation/quick-navigation.js");

Page({
    data: {
        time_list: null,
        goods_list: null,
        page: 1,
        loading_more: !1,
        status: !0
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t), a.init(this), this.loadData(t);
    },
    quickNavigation: function() {
        this.setData({
            quick_icon: !this.data.quick_icon
        });
        this.data.store;
        var t = getApp().core.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        });
        this.data.quick_icon ? t.opacity(0).step() : t.translateY(-55).opacity(1).step(), 
        this.setData({
            animationPlus: t.export()
        });
    },
    loadData: function(t) {
        var a = this;
        getApp().request({
            url: getApp().api.miaosha.list,
            success: function(t) {
                if (0 == t.code) if (0 == t.data.list.length) {
                    if (0 == t.data.next_list.length) return void getApp().core.showModal({
                        content: "暂无秒杀活动",
                        showCancel: !1,
                        confirmText: "返回首页",
                        success: function(t) {
                            t.confirm && getApp().core.navigateBack({
                                url: "/pages/index/index"
                            });
                        }
                    });
                    a.setData({
                        goods_list: t.data.next_list.list,
                        ms_active: !0,
                        time_list: t.data.list,
                        next_list: t.data.next_list.list,
                        next_time: t.data.next_list.time
                    });
                } else a.setData({
                    time_list: t.data.list,
                    next_list: "" == t.data.next_list ? [] : t.data.next_list.list,
                    next_time: "" == t.data.next_list ? [] : t.data.next_list.time,
                    ms_active: !1
                }), a.topBarScrollCenter(), a.setTimeOver(), a.loadGoodsList(!1);
                1 == t.code && getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    success: function() {
                        getApp().core.navigateBack({
                            url: "/pages/index/index"
                        });
                    },
                    showCancel: !1
                });
            }
        });
    },
    setTimeOver: function() {
        function a() {
            for (var a in i.data.time_list) {
                var e = i.data.time_list[a].begin_time - i.data.time_list[a].now_time, s = i.data.time_list[a].end_time - i.data.time_list[a].now_time;
                e = e > 0 ? e : 0, s = s > 0 ? s : 0, i.data.time_list[a].begin_time_over = t(e), 
                i.data.time_list[a].end_time_over = t(s), i.data.time_list[a].now_time = i.data.time_list[a].now_time + 1;
            }
            i.setData({
                time_list: i.data.time_list
            });
        }
        var i = this;
        a(), setInterval(function() {
            a();
        }, 1e3);
    },
    miaosha_next: function() {
        var t = this, a = t.data.time_list;
        a.forEach(function(t, i, e) {
            a[i].active = !1;
        }), t.setData({
            goods_list: null,
            ms_active: !0,
            time_list: a
        }), setTimeout(function() {
            t.setData({
                goods_list: t.data.next_list
            });
        }, 500);
    },
    topBarScrollCenter: function() {
        var t = this, a = 0;
        for (var i in t.data.time_list) if (t.data.time_list[i].active) {
            a = i;
            break;
        }
        t.setData({
            top_bar_scroll: 64 * (a - 2)
        });
    },
    topBarItemClick: function(t) {
        var a = this, i = t.currentTarget.dataset.index;
        for (var e in a.data.time_list) a.data.time_list[e].active = i == e;
        a.setData({
            time_list: a.data.time_list,
            loading_more: !1,
            page: 1,
            ms_active: !1
        }), a.topBarScrollCenter(), a.loadGoodsList(!1);
    },
    loadGoodsList: function(t) {
        var a = this, i = !1;
        for (var e in a.data.time_list) {
            if (a.data.time_list[e].active) {
                i = a.data.time_list[e].start_time;
                break;
            }
            a.data.time_list.length == parseInt(e) + 1 && 0 == i && (i = a.data.time_list[0].start_time, 
            a.data.time_list[0].active = !0);
        }
        t ? a.setData({
            loading_more: !0
        }) : a.setData({
            goods_list: null
        }), getApp().request({
            url: getApp().api.miaosha.goods_list,
            data: {
                time: i,
                page: a.data.page
            },
            success: function(i) {
                0 == i.code && (a.data.goods_list = t ? a.data.goods_list.concat(i.data.list) : i.data.list, 
                a.setData({
                    loading_more: !1,
                    goods_list: a.data.goods_list,
                    page: i.data.list && 0 != i.data.list.length ? a.data.page + 1 : -1
                }));
            }
        });
    },
    onReady: function(t) {
        getApp().page.onReady(this);
    },
    onShow: function(t) {
        getApp().page.onShow(this);
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
        var a = this;
        -1 != a.data.page && a.loadGoodsList(!0);
    },
    onShareAppMessage: function(t) {
        getApp().page.onShareAppMessage(this);
    }
});