Page({
    data: {
        showModel: !1
    },
    onLoad: function(t) {
        if (getApp().page.onLoad(this, t), t.coupon_id) {
            var e = t.coupon_id, n = this;
            getApp().request({
                url: getApp().api.integral.coupon_info,
                data: {
                    coupon_id: e
                },
                success: function(t) {
                    0 == t.code && n.setData({
                        coupon: t.data.coupon,
                        info: t.data.info
                    });
                }
            });
        }
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
    },
    exchangeCoupon: function(t) {
        var e = this, n = e.data.coupon, o = e.data.__user_info.integral;
        if (parseInt(n.integral) > parseInt(o)) e.setData({
            showModel: !0,
            content: "当前积分不足",
            status: 1
        }); else {
            if (parseFloat(n.price) > 0) a = "需要" + n.integral + "积分+￥" + parseFloat(n.price); else var a = "需要" + n.integral + "积分";
            if (parseInt(n.total_num) <= 0) return void e.setData({
                showModel: !0,
                content: "已领完,来晚一步",
                status: 1
            });
            if (parseInt(n.num) >= parseInt(n.user_num)) return n.type = 1, void e.setData({
                showModel: !0,
                content: "兑换次数已达上限",
                status: 1
            });
            getApp().core.showModal({
                title: "确认兑换",
                content: a,
                success: function(t) {
                    t.confirm && (parseFloat(n.price) > 0 ? (getApp().core.showLoading({
                        title: "提交中"
                    }), getApp().request({
                        url: getApp().api.integral.exchange_coupon,
                        data: {
                            id: n.id,
                            type: 2
                        },
                        success: function(t) {
                            0 == t.code ? getApp().core.requestPayment({
                                _res: t,
                                timeStamp: t.data.timeStamp,
                                nonceStr: t.data.nonceStr,
                                package: t.data.package,
                                signType: t.data.signType,
                                paySign: t.data.paySign,
                                complete: function(a) {
                                    "requestPayment:fail" != a.errMsg && "requestPayment:fail cancel" != a.errMsg ? "requestPayment:ok" == a.errMsg && (n.num = parseInt(n.num), 
                                    n.num += 1, n.total_num = parseInt(n.total_num), n.total_num -= 1, o = parseInt(o), 
                                    o -= parseInt(n.integral), e.setData({
                                        showModel: !0,
                                        status: 4,
                                        content: t.msg,
                                        coupon: n
                                    })) : getApp().core.showModal({
                                        title: "提示",
                                        content: "订单尚未支付",
                                        showCancel: !1,
                                        confirmText: "确认"
                                    });
                                }
                            }) : e.setData({
                                showModel: !0,
                                content: t.msg,
                                status: 1
                            });
                        },
                        complete: function() {
                            getApp().core.hideLoading();
                        }
                    })) : (getApp().core.showLoading({
                        title: "提交中"
                    }), getApp().request({
                        url: getApp().api.integral.exchange_coupon,
                        data: {
                            id: n.id,
                            type: 1
                        },
                        success: function(t) {
                            0 == t.code ? (n.num = parseInt(n.num), n.num += 1, n.total_num = parseInt(n.total_num), 
                            n.total_num -= 1, o = parseInt(o), o -= parseInt(n.integral), e.setData({
                                showModel: !0,
                                status: 4,
                                content: t.msg,
                                coupon: n
                            })) : e.setData({
                                showModel: !0,
                                content: t.msg,
                                status: 1
                            });
                        },
                        complete: function() {
                            getApp().core.hideLoading();
                        }
                    })));
                }
            });
        }
    },
    hideModal: function() {
        this.setData({
            showModel: !1
        });
    }
});