getApp(), getApp().api;

var t = !1, e = !1, a = 2;

Page({
    data: {
        status: -1,
        order_list: [],
        show_no_data_tip: !1,
        hide: 1,
        qrcode: "",
        date: '',
    },
    listenerDatePickerSelected:function(e) {
        if (e.detail.value !== this.data.date) {
            this.setData({
                date: e.detail.value
            });
            this.loadOrderList(this.data.status), getCurrentPages().length < 2 && this.setData({
                show_index: !0
            })
        }
    },
    onLoad: function(o) {
        getApp().page.onLoad(this, o);
        var r = this;
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var strDate = date.getDate();
        var date = year + '-' + month + '-' + strDate;
        r.setData({
            date: date
        });
        t = !1, e = !1, a = 2, r.setData({
            options: o
        }), r.loadOrderList(o.status || -1), getCurrentPages().length < 2 && r.setData({
            show_index: !0
        });
    },
    loadOrderList: function(t) {
        void 0 == t && (t = -1);
        var e = this;
        e.setData({
            status: t
        }), getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        });
        var a = {
            status: e.data.status,
            date: e.data.date
        };
        e.data.options;
        void 0 !== e.data.options.order_id && (a.order_id = e.data.options.order_id), getApp().request({
            url: getApp().api.shop.order_list,
            data: a,
            success: function(t) {
                0 == t.code && (e.setData({
                    order_list: t.data.list,
                    pay_type_list: t.data.pay_type_list
                }), getApp().core.getStorageSync(getApp().const.ITEM) && getApp().core.removeStorageSync(getApp().const.ITEM)), 
                e.setData({
                    show_no_data_tip: 0 == e.data.order_list.length
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    onReachBottom: function() {
        var o = this;
        e || t || (e = !0, getApp().request({
            url: getApp().api.order.list,
            data: {
                status: o.data.status,
                self: a
            },
            success: function(e) {
                if (0 == e.code) {
                    var r = o.data.order_list.concat(e.data.list);
                    o.setData({
                        order_list: r,
                        pay_type_list: e.data.pay_type_list
                    }), 0 == e.data.list.length && (t = !0);
                }
                a++;
            },
            complete: function() {
                e = !1;
            }
        }));
    },
    orderPay_1: function(t) {
        var e = this, a = e.data.pay_type_list;
        1 == a.length ? (getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        }), 0 == a[0].payment && e.WechatPay(t), 3 == a[0].payment && e.BalancePay(t)) : getApp().core.showModal({
            title: "提示",
            content: "选择支付方式",
            cancelText: "余额支付",
            confirmText: "线上支付",
            success: function(a) {
                getApp().core.showLoading({
                    title: "正在提交",
                    mask: !0
                }), a.confirm ? e.WechatPay(t) : a.cancel && e.BalancePay(t);
            }
        });
    },
    WechatPay: function(t) {
        getApp().request({
            url: getApp().api.order.pay_data,
            data: {
                order_id: t.currentTarget.dataset.id,
                pay_type: "WECHAT_PAY"
            },
            complete: function() {
                getApp().core.hideLoading();
            },
            success: function(t) {
                0 == t.code && getApp().core.requestPayment({
                    _res: t,
                    timeStamp: t.data.timeStamp,
                    nonceStr: t.data.nonceStr,
                    package: t.data.package,
                    signType: t.data.signType,
                    paySign: t.data.paySign,
                    success: function(t) {},
                    fail: function(t) {},
                    complete: function(t) {
                        "requestPayment:fail" != t.errMsg && "requestPayment:fail cancel" != t.errMsg ? getApp().core.redirectTo({
                            url: "/pages/order/order?status=1"
                        }) : getApp().core.showModal({
                            title: "提示",
                            content: "订单尚未支付",
                            showCancel: !1,
                            confirmText: "确认",
                            success: function(t) {
                                t.confirm && getApp().core.redirectTo({
                                    url: "/pages/order/order?status=0"
                                });
                            }
                        });
                    }
                }), 1 == t.code && getApp().core.showToast({
                    title: t.msg,
                    image: "/images/icon-warning.png"
                });
            }
        });
    },
    BalancePay: function(t) {
        getApp().request({
            url: getApp().api.order.pay_data,
            data: {
                order_id: t.currentTarget.dataset.id,
                pay_type: "BALANCE_PAY"
            },
            complete: function() {
                getApp().core.hideLoading();
            },
            success: function(t) {
                0 == t.code && getApp().core.redirectTo({
                    url: "/pages/order/order?status=1"
                }), 1 == t.code && getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1
                });
            }
        });
    },
    orderRevoke: function(t) {
        var e = this;
        getApp().core.showModal({
            title: "提示",
            content: "是否取消该订单？",
            cancelText: "否",
            confirmText: "是",
            success: function(a) {
                if (a.cancel) return !0;
                a.confirm && (getApp().core.showLoading({
                    title: "操作中"
                }), getApp().request({
                    url: getApp().api.order.revoke,
                    data: {
                        order_id: t.currentTarget.dataset.id
                    },
                    success: function(t) {
                        getApp().core.hideLoading(), getApp().core.showModal({
                            title: "提示",
                            content: t.msg,
                            showCancel: !1,
                            success: function(t) {
                                t.confirm && e.loadOrderList(e.data.status);
                            }
                        });
                    }
                }));
            }
        });
    },
    orderConfirm: function(t) {
        var e = this;
        getApp().core.showModal({
            title: "提示",
            content: "是否确认已收到货？",
            cancelText: "否",
            confirmText: "是",
            success: function(a) {
                if (a.cancel) return !0;
                a.confirm && (getApp().core.showLoading({
                    title: "操作中"
                }), getApp().request({
                    url: getApp().api.order.confirm,
                    data: {
                        order_id: t.currentTarget.dataset.id
                    },
                    success: function(t) {
                        getApp().core.hideLoading(), getApp().core.showToast({
                            title: t.msg
                        }), 0 == t.code && e.loadOrderList(3);
                    }
                }));
            }
        });
    },
    orderQrcode: function(t) {
        var e = this, a = e.data.order_list, o = t.target.dataset.index;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), e.data.order_list[o].offline_qrcode ? (e.setData({
            hide: 0,
            qrcode: e.data.order_list[o].offline_qrcode
        }), getApp().core.hideLoading()) : getApp().request({
            url: getApp().api.order.get_qrcode,
            data: {
                order_no: a[o].order_no
            },
            success: function(t) {
                0 == t.code ? e.setData({
                    hide: 0,
                    qrcode: t.data.url
                }) : getApp().core.showModal({
                    title: "提示",
                    content: t.msg
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    hide: function(t) {
        this.setData({
            hide: 1
        });
    },
    onShow: function() {
        getApp().page.onShow(this);
    }
});