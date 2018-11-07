Page({
    data: {},
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        var e = this, o = t.user_coupon_id ? t.user_coupon_id : 0, a = t.coupon_id ? t.coupon_id : 0;
        (o || a) && (getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.coupon.coupon_detail,
            data: {
                user_conpon_id: o,
                coupon_id: a
            },
            success: function(t) {
                0 == t.code && e.setData({
                    list: t.data.list
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        }));
    },
    goodsList: function(t) {
        var e = this, o = t.currentTarget.dataset.goods_id, a = t.currentTarget.dataset.id, i = e.data.list;
        parseInt(i.id) !== parseInt(a) || 2 == i.appoint_type && i.goods.length > 0 && getApp().core.navigateTo({
            url: "/pages/list/list?goods_id=" + o
        });
    },
    receive: function(t) {
        var e = this, o = t.target.dataset.index;
        getApp().core.showLoading({
            mask: !0
        }), e.hideGetCoupon || (e.hideGetCoupon = function(t) {
            var o = t.currentTarget.dataset.url || !1;
            e.setData({
                get_coupon_list: []
            }), o && getApp().core.navigateTo({
                url: o
            });
        }), getApp().request({
            url: getApp().api.coupon.receive,
            data: {
                id: o
            },
            success: function(t) {
                if (0 == t.code) {
                    var o = e.data.list;
                    o.is_receive = 1, e.setData({
                        list: o,
                        get_coupon_list: t.data.list
                    });
                }
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
    onShareAppMessage: function() {}
});