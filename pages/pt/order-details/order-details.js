Page({
    options: "",
    data: {
        hide: 1,
        qrcode: ""
    },
    onLoad: function(e) {
        getApp().page.onLoad(this, e), this.options = e;
    },
    onReady: function(e) {
        getApp().page.onReady(this);
    },
    onShow: function(e) {
        getApp().page.onShow(this), this.loadOrderDetails();
    },
    onHide: function(e) {
        getApp().page.onHide(this);
    },
    onUnload: function(e) {
        getApp().page.onUnload(this);
    },
    onPullDownRefresh: function(e) {
        getApp().page.onPullDownRefresh(this);
    },
    onReachBottom: function(e) {
        getApp().page.onReachBottom(this);
    },
    onShareAppMessage: function(e) {
        getApp().page.onShareAppMessage(this);
        var t = this, o = "/pages/pt/group/details?oid=" + t.data.order_info.order_id;
        return {
            title: t.data.order_info.goods_list[0].name,
            path: o,
            imageUrl: t.data.order_info.goods_list[0].goods_pic,
            success: function(e) {}
        };
    },
    loadOrderDetails: function() {
        var e = this;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.order.detail,
            data: {
                order_id: e.options.id
            },
            success: function(t) {
                0 == t.code ? (3 != t.data.status && e.countDownRun(t.data.limit_time_ms), e.setData({
                    order_info: t.data,
                    limit_time: t.data.limit_time
                })) : getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && getApp().core.redirectTo({
                            url: "/pages/pt/order/order"
                        });
                    }
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    copyText: function(e) {
        var t = e.currentTarget.dataset.text;
        getApp().core.setClipboardData({
            data: t,
            success: function() {
                getApp().core.showToast({
                    title: "已复制"
                });
            }
        });
    },
    countDownRun: function(e) {
        var t = this;
        setInterval(function() {
            var o = new Date(e[0], e[1] - 1, e[2], e[3], e[4], e[5]) - new Date(), i = parseInt(o / 1e3 / 60 / 60 % 24, 10), n = parseInt(o / 1e3 / 60 % 60, 10), r = parseInt(o / 1e3 % 60, 10);
            i = t.checkTime(i), n = t.checkTime(n), r = t.checkTime(r), t.setData({
                limit_time: {
                    hours: i > 0 ? i : 0,
                    mins: n > 0 ? n : 0,
                    secs: r > 0 ? r : 0
                }
            });
        }, 1e3);
    },
    checkTime: function(e) {
        return e < 10 && (e = "0" + e), e;
    },
    toConfirm: function(e) {
        var t = this;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.order.confirm,
            data: {
                order_id: t.data.order_info.order_id
            },
            success: function(e) {
                e.code, getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && getApp().core.redirectTo({
                            url: "/pages/pt/order-details/order-details?id=" + t.data.order_info.order_id
                        });
                    }
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    goToGroup: function(e) {
        getApp().core.redirectTo({
            url: "/pages/pt/group/details?oid=" + this.data.order_info.order_id,
            success: function(e) {},
            fail: function(e) {},
            complete: function(e) {}
        });
    },
    location: function() {
        var e = this.data.order_info.shop;
        getApp().core.openLocation({
            latitude: parseFloat(e.latitude),
            longitude: parseFloat(e.longitude),
            address: e.address,
            name: e.name
        });
    },
    getOfflineQrcode: function(e) {
        var t = this;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.order.get_qrcode,
            data: {
                order_no: e.currentTarget.dataset.id
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
    },
    orderRevoke: function() {
        var e = this;
        getApp().core.showModal({
            title: "提示",
            content: "是否取消该订单？",
            cancelText: "否",
            confirmtext: "是",
            success: function(t) {
                t.confirm && (getApp().core.showLoading({
                    title: "操作中"
                }), getApp().request({
                    url: getApp().api.group.order.revoke,
                    data: {
                        order_id: e.data.order_info.order_id
                    },
                    success: function(t) {
                        getApp().core.hideLoading(), getApp().core.showModal({
                            title: "提示",
                            content: t.msg,
                            showCancel: !1,
                            success: function(t) {
                                t.confirm && e.loadOrderDetails();
                            }
                        });
                    }
                }));
            }
        });
    }
});