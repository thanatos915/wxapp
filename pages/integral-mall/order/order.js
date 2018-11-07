Page({
    data: {
        hide: 1
    },
    onLoad: function(e) {
        getApp().page.onLoad(this, e), this.loadOrderList(e.status || 0);
    },
    loadOrderList: function(e) {
        var t = this;
        void 0 == e && (e = -1), getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.integral.list,
            data: {
                status: e
            },
            success: function(o) {
                0 == o.code && t.setData({
                    order_list: o.data.list,
                    status: e
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    orderSubmitPay: function(e) {
        var t = e.currentTarget.dataset;
        getApp().core.showLoading({
            title: "提交中",
            mask: !0
        }), getApp().request({
            url: getApp().api.integral.order_submit,
            data: {
                id: t.id
            },
            success: function(e) {
                0 == e.code ? (getApp().core.hideLoading(), getApp().core.requestPayment({
                    _res: e,
                    timeStamp: e.data.timeStamp,
                    nonceStr: e.data.nonceStr,
                    package: e.data.package,
                    signType: e.data.signType,
                    paySign: e.data.paySign,
                    complete: function(e) {
                        "requestPayment:fail" != e.errMsg && "requestPayment:fail cancel" != e.errMsg ? "requestPayment:ok" == e.errMsg && getApp().core.redirectTo({
                            url: "/pages/integral-mall/order/order?status=1"
                        }) : getApp().core.showModal({
                            title: "提示",
                            content: "订单尚未支付",
                            showCancel: !1,
                            confirmText: "确认"
                        });
                    }
                })) : (getApp().core.hideLoading(), getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    confirmText: "确认"
                }));
            }
        });
    },
    orderRevoke: function(e) {
        var t = this;
        getApp().core.showModal({
            title: "提示",
            content: "是否取消该订单？",
            cancelText: "否",
            confirmText: "是",
            success: function(o) {
                if (o.cancel) return !0;
                o.confirm && (getApp().core.showLoading({
                    title: "操作中"
                }), getApp().request({
                    url: getApp().api.integral.revoke,
                    data: {
                        order_id: e.currentTarget.dataset.id
                    },
                    success: function(e) {
                        getApp().core.hideLoading(), getApp().core.showModal({
                            title: "提示",
                            content: e.msg,
                            showCancel: !1,
                            success: function(e) {
                                e.confirm && t.loadOrderList(t.data.status);
                            }
                        });
                    }
                }));
            }
        });
    },
    orderConfirm: function(e) {
        var t = this;
        getApp().core.showModal({
            title: "提示",
            content: "是否确认已收到货？",
            cancelText: "否",
            confirmText: "是",
            success: function(o) {
                if (o.cancel) return !0;
                o.confirm && (getApp().core.showLoading({
                    title: "操作中"
                }), getApp().request({
                    url: getApp().api.integral.confirm,
                    data: {
                        order_id: e.currentTarget.dataset.id
                    },
                    success: function(e) {
                        getApp().core.hideLoading(), getApp().core.showToast({
                            title: e.msg
                        }), 0 == e.code && t.loadOrderList(3);
                    }
                }));
            }
        });
    },
    orderQrcode: function(e) {
        var t = this, o = t.data.order_list, a = e.target.dataset.index;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.integral.get_qrcode,
            data: {
                order_no: o[a].order_no
            },
            success: function(e) {
                0 == e.code ? t.setData({
                    hide: 0,
                    qrcode: e.data.url
                }) : getApp().core.showModal({
                    title: "提示",
                    content: e.msg
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    hide: function(e) {
        this.setData({
            hide: 1
        });
    }
});