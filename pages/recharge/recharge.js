function e(e) {
    getApp().onShowData || (getApp().onShowData = {}), getApp().onShowData.scene = e;
}

Page({
    data: {
        selected: -1
    },
    onLoad: function(e) {
        getApp().page.onLoad(this, e);
        var t = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.recharge.list,
            success: function(e) {
                var a = e.data;
                a.balance && 0 != a.balance.status || getApp().core.showModal({
                    title: "提示",
                    content: "充值功能未开启，请联系管理员！",
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && getApp().core.navigateBack({
                            delta: 1
                        });
                    }
                }), t.setData(e.data);
            },
            complete: function(e) {
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
    click: function(e) {
        this.setData({
            selected: e.currentTarget.dataset.index
        });
    },
    pay: function(t) {
        var a = this, n = {}, o = a.data.selected;
        if (-1 == o) {
            var p = a.data.money;
            if (p < .01) return void getApp().core.showModal({
                title: "提示",
                content: "充值金额不能小于0.01",
                showCancel: !1
            });
            n.pay_price = p, n.send_price = 0;
        } else {
            var c = a.data.list;
            n.pay_price = c[o].pay_price, n.send_price = c[o].send_price;
        }
        n.pay_price ? (n.pay_type = "WECHAT_PAY", getApp().core.showLoading({
            title: "提交中"
        }), getApp().request({
            url: getApp().api.recharge.submit,
            data: n,
            method: "POST",
            success: function(t) {
                if (getApp().page.bindParent({
                    parent_id: getApp().core.getStorageSync(getApp().const.PARENT_ID),
                    condition: 1
                }), 0 == t.code) return setTimeout(function() {
                    getApp().core.hideLoading();
                }, 1e3), e("pay"), void getApp().core.requestPayment({
                    _res: t,
                    timeStamp: t.data.timeStamp,
                    nonceStr: t.data.nonceStr,
                    package: t.data.package,
                    signType: t.data.signType,
                    paySign: t.data.paySign,
                    success: function(e) {},
                    fail: function(e) {},
                    complete: function(e) {
                        "requestPayment:fail" != e.errMsg && "requestPayment:fail cancel" != e.errMsg ? (getApp().page.bindParent({
                            parent_id: getApp().core.getStorageSync(getApp().const.PARENT_ID),
                            condition: 2
                        }), getApp().core.showModal({
                            title: "提示",
                            content: "充值成功",
                            showCancel: !1,
                            confirmText: "确认",
                            success: function(e) {
                                e.confirm && getApp().core.navigateBack({
                                    delta: 1
                                });
                            }
                        })) : getApp().core.showModal({
                            title: "提示",
                            content: "订单尚未支付",
                            showCancel: !1,
                            confirmText: "确认"
                        });
                    }
                });
                getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1
                }), getApp().core.hideLoading();
            }
        })) : getApp().core.showModal({
            title: "提示",
            content: "请选择充值金额",
            showCancel: !1
        });
    },
    input: function(e) {
        this.setData({
            money: e.detail.value
        });
    }
});