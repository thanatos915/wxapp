var t = !1, e = !1, o = 2;

Page({
    data: {
        status: 0,
        order_list: [],
        show_no_data_tip: !1,
        hide: 1,
        qrcode: ""
    },
    onLoad: function(a) {
        getApp().page.onLoad(this, a);
        var s = this;
        t = !1, e = !1, o = 2, s.loadOrderList(a.status || 0), getCurrentPages().length < 2 && s.setData({
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
        }), getApp().request({
            url: getApp().api.miaosha.order_list,
            data: {
                status: e.data.status
            },
            success: function(t) {
                0 == t.code && e.setData({
                    order_list: t.data.list
                }), e.setData({
                    show_no_data_tip: 0 == e.data.order_list.length
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    onReachBottom: function(a) {
        getApp().page.onReachBottom(this);
        var s = this;
        e || t || (e = !0, getApp().request({
            url: getApp().api.miaosha.order_list,
            data: {
                status: s.data.status,
                page: o
            },
            success: function(e) {
                if (0 == e.code) {
                    var a = s.data.order_list.concat(e.data.list);
                    s.setData({
                        order_list: a
                    }), 0 == e.data.list.length && (t = !0);
                }
                o++;
            },
            complete: function() {
                e = !1;
            }
        }));
    },
    orderRevoke: function(t) {
        var e = this;
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
                    url: getApp().api.miaosha.order_revoke,
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
            success: function(o) {
                if (o.cancel) return !0;
                o.confirm && (getApp().core.showLoading({
                    title: "操作中"
                }), getApp().request({
                    url: getApp().api.miaosha.confirm,
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
        var e = this, o = e.data.order_list, a = t.target.dataset.index;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), e.data.order_list[a].offline_qrcode ? (e.setData({
            hide: 0,
            qrcode: e.data.order_list[a].offline_qrcode
        }), getApp().core.hideLoading()) : getApp().request({
            url: getApp().api.order.get_qrcode,
            data: {
                order_no: o[a].order_no
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
    onShow: function(t) {
        getApp().page.onShow(this);
    }
});