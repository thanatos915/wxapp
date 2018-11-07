var t = !1, a = !1;

Page({
    data: {
        gain: !0,
        p: 1,
        status: 1
    },
    onLoad: function(e) {
        getApp().page.onLoad(this, e), t = !1, a = !1;
        var n = this;
        e.status && n.setData({
            status: e.status
        });
    },
    onReady: function(t) {
        getApp().page.onReady(this);
    },
    onShow: function(t) {
        getApp().page.onShow(this), this.loadData();
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
    onReachBottom: function(a) {
        getApp().page.onReachBottom(this);
        var e = this;
        t || e.loadData();
    },
    income: function() {
        getApp().core.redirectTo({
            url: "/pages/integral-mall/detail/index?status=1"
        });
    },
    expenditure: function() {
        getApp().core.redirectTo({
            url: "/pages/integral-mall/detail/index?status=2"
        });
    },
    loadData: function() {
        var e = this;
        if (!a) {
            a = !0, getApp().core.showLoading({
                title: "加载中"
            });
            var n = e.data.p;
            getApp().request({
                url: getApp().api.integral.integral_detail,
                data: {
                    page: n,
                    status: e.data.status
                },
                success: function(a) {
                    if (0 == a.code) {
                        var o = e.data.list;
                        o = o ? o.concat(a.data.list) : a.data.list, a.data.list.length <= 0 && (t = !0), 
                        e.setData({
                            list: o,
                            is_no_more: t,
                            p: n + 1
                        });
                    }
                },
                complete: function(t) {
                    a = !1, getApp().core.hideLoading();
                }
            });
        }
    }
});