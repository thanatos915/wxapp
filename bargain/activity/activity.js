var t = require("../commons/time.js"), a = (getApp(), getApp().api, null), i = !1, e = !0;

Page({
    data: {
        show_more: !0,
        p: 1,
        show_modal: !1,
        show: !1,
        show_more_btn: !0,
        animationData: null,
        show_modal_a: !1
    },
    onLoad: function(a) {
        getApp().page.onLoad(this, a);
        var i = this;
        i.setData({
            order_id: a.order_id
        }), i.joinBargain(), t.init(i);
    },
    joinBargain: function() {
        var t = this;
        getApp().request({
            url: getApp().api.bargain.bargain,
            data: {
                order_id: t.data.order_id
            },
            success: function(a) {
                0 == a.code ? (t.getOrderInfo(), t.setData(a.data)) : (t.showToast({
                    title: a.msg
                }), getApp().core.hideLoading());
            }
        });
    },
    getOrderInfo: function() {
        var t = this;
        getApp().request({
            url: getApp().api.bargain.activity,
            data: {
                order_id: t.data.order_id,
                page: 1
            },
            success: function(a) {
                0 == a.code ? (t.setData(a.data), t.setData({
                    time_list: t.setTimeList(a.data.reset_time),
                    show: !0
                }), t.data.bargain_status && t.setData({
                    show_modal: !0
                }), t.setTimeOver(), e = !1, t.animationCr()) : t.showToast({
                    title: a.msg
                });
            },
            complete: function(t) {
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
        getApp().page.onUnload(this), clearInterval(a), a = null;
    },
    onShareAppMessage: function() {
        var t = this;
        return {
            path: "/bargain/activity/activity?order_id=" + t.data.order_id + "&user_id=" + t.data.__user_info.id,
            success: function(t) {}
        };
    },
    loadData: function() {
        var t = this;
        if (getApp().core.showLoading({
            title: "加载中"
        }), !i) {
            i = !0, getApp().core.showNavigationBarLoading();
            var a = t.data.p + 1;
            getApp().request({
                url: getApp().api.bargain.activity,
                data: {
                    order_id: t.data.order_id,
                    page: a
                },
                success: function(i) {
                    if (0 == i.code) {
                        var o = t.data.bargain_info;
                        o = o.concat(i.data.bargain_info), t.setData(i.data), t.setData({
                            bargain_info: o,
                            p: a
                        }), 0 == i.data.bargain_info.length && (e = !0, t.setData({
                            show_more_btn: !1,
                            show_more: !0
                        }));
                    } else t.showToast({
                        title: i.msg
                    });
                },
                complete: function(t) {
                    getApp().core.hideLoading(), getApp().core.hideNavigationBarLoading(), i = !1;
                }
            });
        }
    },
    showMore: function(t) {
        var a = this;
        a.data.show_more_btn && (e = !1), e || a.loadData();
    },
    hideMore: function() {
        this.setData({
            show_more_btn: !0,
            show_more: !1
        });
    },
    orderSubmit: function() {
        var t = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().core.redirectTo({
            url: "/bargain/goods/goods?goods_id=" + t.data.goods_id
        });
    },
    close: function() {
        this.setData({
            show_modal: !1
        });
    },
    buyNow: function() {
        var t = this, a = [], i = [];
        i.push({
            bargain_order_id: t.data.order_id
        }), a.push({
            mch_id: 0,
            goods_list: i
        }), getApp().core.showModal({
            title: "提示",
            content: "是否确认购买？",
            success: function(t) {
                t.confirm && getApp().core.redirectTo({
                    url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(a)
                });
            }
        });
    },
    goToList: function() {
        getApp().core.redirectTo({
            url: "/bargain/list/list"
        });
    },
    animationCr: function() {
        var t = this;
        t.animationT(), setTimeout(function() {
            t.setData({
                show_modal_a: !0
            }), t.animationBig(), t.animationS();
        }, 800);
    },
    animationBig: function() {
        var t = getApp().core.createAnimation({
            duration: 500,
            transformOrigin: "50% 50%"
        }), a = this, i = 0;
        setInterval(function() {
            i % 2 == 0 ? t.scale(.9).step() : t.scale(1).step(), a.setData({
                animationData: t.export()
            }), 500 == ++i && (i = 0);
        }, 500);
    },
    animationS: function() {
        var t = getApp().core.createAnimation({
            duration: 500
        }), a = this;
        t.width("512rpx").height("264rpx").step(), t.rotate(-2).step(), t.rotate(4).step(), 
        t.rotate(-2).step(), t.rotate(0).step(), a.setData({
            animationDataHead: t.export()
        });
    },
    animationT: function() {
        var t = getApp().core.createAnimation({
            duration: 200
        }), a = this;
        t.width("500rpx").height("500rpx").step(), a.setData({
            animationDataT: t.export()
        });
    }
});