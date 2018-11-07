var t = !1;

Page({
    data: {
        show: !1
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
    },
    getData: function() {
        var e = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.recharge.record,
            data: {
                date: e.data.date_1 || ""
            },
            success: function(a) {
                e.setData({
                    list: a.data.list
                }), getApp().core.hideLoading(), t = !1;
            }
        });
    },
    onReady: function() {
        getApp().page.onReady(this);
    },
    onShow: function() {
        getApp().page.onShow(this);
        var t = this;
        getApp().core.showLoading({
            title: "加载中"
        });
        var e = getApp().core.getStorageSync(getApp().const.USER_INFO);
        getApp().request({
            url: getApp().api.recharge.index,
            success: function(a) {
                e.money = a.data.money, getApp().core.setStorageSync(getApp().const.USER_INFO, e), 
                t.setData({
                    user_info: e,
                    list: a.data.list,
                    setting: a.data.setting,
                    date_1: a.data.date,
                    date: a.data.date.replace("-", "年") + "月"
                }), getApp().core.hideLoading();
            }
        });
    },
    dateChange: function(e) {
        if (!t) {
            t = !0;
            var a = e.detail.value, o = a.replace("-", "年") + "月";
            this.setData({
                date: o,
                date_1: a
            }), this.getData();
        }
    },
    dateUp: function() {
        var e = this;
        if (!t) {
            t = !0;
            var a = e.data.date_1, o = (e.data.date, new Date(a));
            o.setMonth(o.getMonth() + 1);
            var n = o.getMonth() + 1;
            n = (n = n.toString())[1] ? n : "0" + n, e.setData({
                date: o.getFullYear() + "年" + n + "月",
                date_1: o.getFullYear() + "-" + n
            }), e.getData();
        }
    },
    dateDown: function() {
        var e = this;
        if (!t) {
            t = !0;
            var a = e.data.date_1, o = (e.data.date, new Date(a));
            o.setMonth(o.getMonth() - 1);
            var n = o.getMonth() + 1;
            n = (n = n.toString())[1] ? n : "0" + n, e.setData({
                date: o.getFullYear() + "年" + n + "月",
                date_1: o.getFullYear() + "-" + n
            }), e.getData();
        }
    },
    click: function() {
        this.setData({
            show: !0
        });
    },
    close: function() {
        this.setData({
            show: !1
        });
    },
    GoToDetail: function(t) {
        var e = this, a = t.currentTarget.dataset.index, o = e.data.list[a];
        getApp().core.navigateTo({
            url: "/pages/balance/detail?order_type=" + o.order_type + "&id=" + o.id
        });
    }
});