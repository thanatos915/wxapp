Page({
    data: {},
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
    },
    onShow: function() {
        getApp().page.onShow(this);
        var t = this;
        getApp().core.showLoading({
            mask: !0
        }), getApp().request({
            url: getApp().api.default.coupon_list,
            success: function(e) {
                0 == e.code && t.setData({
                    coupon_list: e.data.list
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    receive: function(t) {
        var e = this, o = t.target.dataset.index;
        getApp().core.showLoading({
            mask: !0
        }), e.hideGetCoupon || (e.hideGetCoupon = function(t) {
            var o = t.currentTarget.dataset.url || !1;
            e.setData({
                get_coupon_list: null
            }), o && getApp().core.navigateTo({
                url: o
            });
        }), getApp().request({
            url: getApp().api.coupon.receive,
            data: {
                id: o
            },
            success: function(t) {
                0 == t.code && e.setData({
                    get_coupon_list: t.data.list,
                    coupon_list: t.data.coupon_list
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    closeCouponBox: function(t) {
        this.setData({
            get_coupon_list: ""
        });
    },
    goodsList: function(t) {
        var e = t.currentTarget.dataset.goods, o = [];
        for (var a in e) o.push(e[a].id);
        getApp().core.navigateTo({
            url: "/pages/list/list?goods_id=" + o
        });
    }
});