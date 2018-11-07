var t = !1, e = !1, a = 2;

Page({
    data: {
        hide: 1,
        qrcode: "",
        scrollLeft: 0,
        scrollTop: 0
    },
    onLoad: function(o) {
        getApp().page.onLoad(this, o), this.systemInfo = getApp().core.getSystemInfoSync();
        var r = getApp().core.getStorageSync(getApp().const.STORE);
        this.setData({
            store: r
        });
        var i = this;
        t = !1, e = !1, a = 2, i.loadOrderList(o.status || -1);
        var s = 0;
        s = o.status >= 2 ? 600 : 0, i.setData({
            scrollLeft: s
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
    onShareAppMessage: function(t) {
        var e = this, a = t.target.dataset.index, o = "/pages/pt/group/details?oid=" + t.target.dataset.id;
        return {
            title: e.data.order_list[a].goods_list[0].goods_name,
            path: o,
            imageUrl: e.data.order_list[a].goods_list[0].goods_pic,
            success: function(t) {}
        };
    },
    loadOrderList: function(t) {
        void 0 == t && (t = -1);
        var e = this;
        e.setData({
            status: t
        }), getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.order.list,
            data: {
                status: e.data.status
            },
            success: function(a) {
                0 == a.code && e.setData({
                    order_list: a.data.list
                }), e.setData({
                    show_no_data_tip: 0 == a.data.list.length
                }), 4 != t && e.countDown();
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    countDown: function() {
        var t = this;
        setInterval(function() {
            var e = t.data.order_list;
            for (var a in e) {
                var o = new Date(e[a].limit_time_ms[0], e[a].limit_time_ms[1] - 1, e[a].limit_time_ms[2], e[a].limit_time_ms[3], e[a].limit_time_ms[4], e[a].limit_time_ms[5]) - new Date(), r = parseInt(o / 1e3 / 60 / 60 / 24, 10), i = parseInt(o / 1e3 / 60 / 60 % 24, 10), s = parseInt(o / 1e3 / 60 % 60, 10), n = parseInt(o / 1e3 % 60, 10);
                r = t.checkTime(r), i = t.checkTime(i), s = t.checkTime(s), n = t.checkTime(n), 
                e[a].limit_time = {
                    days: r,
                    hours: i > 0 ? i : "00",
                    mins: s > 0 ? s : "00",
                    secs: n > 0 ? n : "00"
                }, t.setData({
                    order_list: e
                });
            }
        }, 1e3);
    },
    checkTime: function(t) {
        return (t = t > 0 ? t : 0) < 10 && (t = "0" + t), t;
    },
    onReachBottom: function(o) {
        getApp().page.onReachBottom(this);
        var r = this;
        e || t || (e = !0, getApp().request({
            url: getApp().api.group.order.list,
            data: {
                status: r.data.status,
                page: a
            },
            success: function(e) {
                if (0 == e.code) {
                    var o = r.data.order_list.concat(e.data.list);
                    r.setData({
                        order_list: o
                    }), 0 == e.data.list.length && (t = !0);
                }
                a++;
            },
            complete: function() {
                e = !1;
            }
        }));
    },
    goHome: function(t) {
        getApp().core.redirectTo({
            url: "/pages/pt/index/index"
        });
    },
    orderPay_1: function(t) {
        getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.pay_data,
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
                            url: "/pages/pt/order/order?status=1"
                        }) : getApp().core.showModal({
                            title: "提示",
                            content: "订单尚未支付",
                            showCancel: !1,
                            confirmText: "确认",
                            success: function(t) {
                                t.confirm && getApp().core.redirectTo({
                                    url: "/pages/pt/order/order?status=0"
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
    goToGroup: function(t) {
        getApp().core.navigateTo({
            url: "/pages/pt/group/details?oid=" + t.target.dataset.id
        });
    },
    getOfflineQrcode: function(t) {
        var e = this;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.order.get_qrcode,
            data: {
                order_no: t.currentTarget.dataset.id
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
    goToCancel: function(t) {
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
                    url: getApp().api.group.order.revoke,
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
    switchNav: function(t) {
        var e = t.currentTarget.dataset.status;
        getApp().core.redirectTo({
            url: "/pages/pt/order/order?status=" + e
        });
    },
    goToRefundDetail: function(t) {
        var e = t.currentTarget.dataset.refund_id;
        getApp().core.navigateTo({
            url: "/pages/pt/order-refund-detail/order-refund-detail?id=" + e
        });
    }
});