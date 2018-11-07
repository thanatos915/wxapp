getApp(), getApp().api;

Page({
    data: {
        show_edit_modal: !1,
        order_sub_price: "",
        order_sub_price_mode: !0,
        order_add_price: "",
        order_add_price_mode: !1,
        show_send_modal: !1,
        send_type: "express",
        order: null
    },
    onLoad: function(e) {
        getApp().page.onLoad(this, e);
        var t = this;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.mch.order.detail,
            data: {
                id: e.id
            },
            success: function(e) {
                0 == e.code ? t.setData({
                    order: e.data.order
                }) : getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && getApp().core.navigateBack();
                    }
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    onReady: function() {
        getApp().page.onReady(this);
    },
    onShow: function() {
        getApp().page.onShow(this);
    },
    onHide: function() {
        getApp().page.onHide(this);
    },
    onUnload: function() {
        getApp().page.onUnload(this);
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    copyUserAddress: function() {
        var e = this;
        getApp().core.setClipboardData({
            data: "收货人:" + e.data.order.username + ",联系电话:" + e.data.order.mobile + ",收货地址:" + e.data.order.address,
            success: function(t) {
                getApp().core.getClipboardData({
                    success: function(t) {
                        e.showToast({
                            title: "已复制收货信息"
                        });
                    }
                });
            }
        });
    },
    showEditModal: function(e) {
        this.setData({
            show_edit_modal: !0,
            order_sub_price: "",
            order_add_price: "",
            order_sub_price_mode: !0,
            order_add_price_mode: !1
        });
    },
    hideEditModal: function(e) {
        this.setData({
            show_edit_modal: !1
        });
    },
    tabSwitch: function(e) {
        var t = this, d = e.currentTarget.dataset.tab;
        "order_sub_price_mode" == d && t.setData({
            order_sub_price_mode: !0,
            order_add_price_mode: !1
        }), "order_add_price_mode" == d && t.setData({
            order_sub_price_mode: !1,
            order_add_price_mode: !0
        });
    },
    subPriceInput: function(e) {
        this.setData({
            order_sub_price: e.detail.value
        });
    },
    subPriceBlur: function(e) {
        var t = this, d = parseFloat(e.detail.value);
        d = isNaN(d) ? "" : d <= 0 ? "" : d.toFixed(2), t.setData({
            order_sub_price: d
        });
    },
    addPriceInput: function(e) {
        this.setData({
            order_add_price: e.detail.value
        });
    },
    addPriceBlur: function(e) {
        var t = this, d = parseFloat(e.detail.value);
        d = isNaN(d) ? "" : d <= 0 ? "" : d.toFixed(2), t.setData({
            order_add_price: d
        });
    },
    editPriceSubmit: function() {
        var e = this, t = e.data.order_sub_price_mode ? "sub" : "add";
        getApp().core.showLoading({
            mask: !0,
            title: "正在处理"
        }), getApp().request({
            url: getApp().api.mch.order.edit_price,
            method: "post",
            data: {
                order_id: e.data.order.id,
                type: t,
                price: "sub" == t ? e.data.order_sub_price : e.data.order_add_price
            },
            success: function(t) {
                getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(d) {
                        d.confirm && 0 == t.code && getApp().core.redirectTo({
                            url: "/mch/m/order-detail/order-detail?id=" + e.data.order.id
                        });
                    }
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    showSendModal: function() {
        this.setData({
            show_send_modal: !0,
            send_type: "express"
        });
    },
    hideSendModal: function() {
        this.setData({
            show_send_modal: !1
        });
    },
    switchSendType: function(e) {
        var t = this, d = e.currentTarget.dataset.type;
        t.setData({
            send_type: d
        });
    },
    sendSubmit: function() {
        var e = this;
        if ("express" == e.data.send_type) return e.hideSendModal(), void getApp().core.navigateTo({
            url: "/mch/m/order-send/order-send?id=" + e.data.order.id
        });
        getApp().core.showModal({
            title: "提示",
            content: "无需物流方式订单将直接标记成已发货，确认操作？",
            success: function(t) {
                t.confirm && (getApp().core.showLoading({
                    title: "正在提交",
                    mask: !0
                }), getApp().request({
                    url: getApp().api.mch.order.send,
                    method: "post",
                    data: {
                        send_type: "none",
                        order_id: e.data.order.id
                    },
                    success: function(t) {
                        getApp().core.showModal({
                            title: "提示",
                            content: t.msg,
                            success: function(d) {
                                d.confirm && 0 == t.code && getApp().core.redirectTo({
                                    url: "/mch/m/order-detail/order-detail?id=" + e.data.order.id
                                });
                            }
                        });
                    },
                    complete: function() {
                        getApp().core.hideLoading({
                            title: "正在提交",
                            mask: !0
                        });
                    }
                }));
            }
        });
    }
});