function e(e) {
    getApp().onShowData || (getApp().onShowData = {}), getApp().onShowData.scene = e;
}

Page({
    data: {
        list: ""
    },
    onLoad: function(e) {
        getApp().page.onLoad(this, e);
        var t = this;
        t.setData({
            my: "undefined" != typeof my
        }), getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.user.member,
            method: "POST",
            success: function(e) {
                getApp().core.hideLoading(), 0 == e.code && (t.setData(e.data), t.setData({
                    current_key: 0
                }), e.data.next_level && t.setData({
                    buy_price: e.data.next_level.price
                }));
            }
        });
    },
    showDialogBtn: function() {
        this.setData({
            showModal: !0
        });
    },
    preventTouchMove: function() {},
    hideModal: function() {
        this.setData({
            showModal: !1
        });
    },
    onCancel: function() {
        this.hideModal();
    },
    pay: function(t) {
        var a = t.currentTarget.dataset.key, n = this.data.list[a].id, o = t.currentTarget.dataset.payment;
        this.hideModal(), getApp().request({
            url: getApp().api.user.submit_member,
            data: {
                level_id: n,
                pay_type: o
            },
            method: "POST",
            success: function(t) {
                if (0 == t.code) {
                    if (setTimeout(function() {
                        getApp().core.hideLoading();
                    }, 1e3), "WECHAT_PAY" == o) return e("pay"), void getApp().core.requestPayment({
                        _res: t,
                        timeStamp: t.data.timeStamp,
                        nonceStr: t.data.nonceStr,
                        package: t.data.package,
                        signType: t.data.signType,
                        paySign: t.data.paySign,
                        complete: function(e) {
                            "requestPayment:fail" != e.errMsg && "requestPayment:fail cancel" != e.errMsg ? "requestPayment:ok" == e.errMsg && getApp().core.showModal({
                                title: "提示",
                                content: "充值成功",
                                showCancel: !1,
                                confirmText: "确认",
                                success: function(e) {
                                    getApp().core.navigateBack({
                                        delta: 1
                                    });
                                }
                            }) : getApp().core.showModal({
                                title: "提示",
                                content: "订单尚未支付",
                                showCancel: !1,
                                confirmText: "确认"
                            });
                        }
                    });
                    "BALANCE_PAY" == o && getApp().core.showModal({
                        title: "提示",
                        content: "充值成功",
                        showCancel: !1,
                        confirmText: "确认",
                        success: function(e) {
                            getApp().core.navigateBack({
                                delta: 1
                            });
                        }
                    });
                } else getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1
                }), getApp().core.hideLoading();
            }
        });
    },
    changeTabs: function(e) {
        if ("undefined" == typeof my) t = e.detail.currentItemId; else var t = this.data.list[e.detail.current].id;
        for (var a = e.detail.current, n = parseFloat(this.data.next_level.price), o = this.data.list, i = 0; i < a; i++) n += parseFloat(o[i + 1].price);
        this.setData({
            current_id: t,
            current_key: a,
            buy_price: parseFloat(n)
        });
    }
});