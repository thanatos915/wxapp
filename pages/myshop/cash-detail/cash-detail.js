var t = getApp(), a = (getApp().api, !1), s = !1, e = 2;

Page({
    data: {
        status: -1,
        cash_list: [],
        show_no_data_tip: !1
    },
    onLoad: function(o) {
        t.page.onLoad(this, o), a = !1, s = !1, e = 2, this.LoadCashList(o.status || -1);
    },
    onReady: function() {},
    onShow: function() {
        getApp().page.onShow(this);
    },
    LoadCashList: function(t) {
        var a = this;
        a.setData({
            status: parseInt(t || -1)
        }), getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.share.cash_detail,
            data: {
                status: a.data.status
            },
            success: function(t) {
                0 == t.code && a.setData({
                    cash_list: t.data.list
                }), a.setData({
                    show_no_data_tip: 0 == a.data.cash_list.length
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    onHide: function() {
        getApp().page.onHide(this);
    },
    onUnload: function() {
        getApp().page.onUnload(this);
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        var t = this;
        s || a || (s = !0, getApp().request({
            url: getApp().api.share.cash_detail,
            data: {
                status: t.data.status,
                page: e
            },
            success: function(s) {
                if (0 == s.code) {
                    var o = t.data.cash_list.concat(s.data.list);
                    t.setData({
                        cash_list: o
                    }), 0 == s.data.list.length && (a = !0);
                }
                e++;
            },
            complete: function() {
                s = !1;
            }
        }));
    }
});