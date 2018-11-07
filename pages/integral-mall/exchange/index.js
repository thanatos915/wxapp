var t = !1, e = !1;

Page({
    data: {
        p: 1
    },
    onLoad: function(o) {
        getApp().page.onLoad(this, o), t = !1, e = !1;
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
    onReachBottom: function(t) {
        getApp().page.onReachBottom(this);
    },
    loadData: function() {
        var o = this, a = o.data.p;
        if (!e) {
            e = !0, getApp().core.showLoading({
                title: "加载中"
            });
            var n = Math.round(new Date().getTime() / 1e3).toString();
            getApp().request({
                url: getApp().api.integral.exchange,
                data: {
                    page: a
                },
                success: function(e) {
                    if (0 == e.code) {
                        var i = e.data.list[0].userCoupon;
                        if (i) for (var p in i) parseInt(i[p].end_time) < parseInt(n) ? i[p].status = 2 : i[p].status = "", 
                        1 == i[p].is_use && (i[p].status = 1);
                        o.setData({
                            goods: e.data.list[0].goodsDetail,
                            coupon: i,
                            page: a + 1,
                            is_no_more: t
                        });
                    }
                },
                complete: function(t) {
                    e = !1, getApp().core.hideLoading();
                }
            });
        }
    }
});