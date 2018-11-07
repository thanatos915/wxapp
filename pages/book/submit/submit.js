var t = require("../../../utils/helper.js");

Page({
    data: {
        now_date: new Date()
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t), this.getPreview(t);
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
    onShareAppMessage: function(t) {
        getApp().page.onShareAppMessage(this);
    },
    checkboxChange: function(t) {
        var e = this, a = t.target.dataset.pid, o = t.target.dataset.id, s = e.data.form_list, i = s[a].default[o].selected;
        s[a].default[o].selected = 1 != i, e.setData({
            form_list: s
        });
    },
    radioChange: function(t) {
        var e = this, a = t.target.dataset.pid, o = e.data.form_list;
        for (var s in o[a].default) t.target.dataset.id == s ? o[a].default[s].selected = !0 : o[a].default[s].selected = !1;
        e.setData({
            form_list: o
        });
    },
    inputChenge: function(t) {
        var e = this, a = t.target.dataset.id, o = e.data.form_list;
        o[a].default = t.detail.value, e.setData({
            form_list: o
        });
    },
    getPreview: function(e) {
        var a = this, o = JSON.parse(e.goods_info)[0];
        a.setData({
            attr: o.attr
        });
        var s = o.id;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        });
        var i = JSON.stringify(o.attr);
        getApp().request({
            url: getApp().api.book.submit_preview,
            method: "get",
            data: {
                gid: s,
                attr: i
            },
            success: function(e) {
                if (0 == e.code) {
                    for (var o in e.data.form_list) "date" == e.data.form_list[o].type && (e.data.form_list[o].default = e.data.form_list[o].default ? e.data.form_list[o].default : t.formatData(new Date())), 
                    "time" == e.data.form_list[o].type && (e.data.form_list[o].default = e.data.form_list[o].default ? e.data.form_list[o].default : "00:00");
                    var s = e.data.option;
                    s ? (1 == s.balance && (a.setData({
                        balance: !0,
                        pay_type: "BALANCE_PAY"
                    }), getApp().request({
                        url: getApp().api.user.index,
                        success: function(t) {
                            0 == t.code && getApp().core.setStorageSync(getApp().const.USER_INFO, t.data.user_info);
                        }
                    })), 1 == s.wechat && a.setData({
                        wechat: !0,
                        pay_type: "WECHAT_PAY"
                    })) : a.setData({
                        wechat: !0,
                        pay_type: "WECHAT_PAY"
                    }), a.setData({
                        goods: e.data.goods,
                        form_list: e.data.form_list
                    });
                } else getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && getApp().core.redirectTo({
                            url: "/pages/book/index/index"
                        });
                    }
                });
            },
            complete: function(t) {
                setTimeout(function() {
                    getApp().core.hideLoading();
                }, 1e3);
            }
        });
    },
    booksubmit: function(t) {
        var e = this, a = e.data.pay_type;
        if (0 != e.data.goods.price) {
            if ("BALANCE_PAY" == a) {
                var o = getApp().core.getStorageSync(getApp().const.USER_INFO);
                getApp().core.showModal({
                    title: "当前账户余额：" + o.money,
                    content: "是否使用余额",
                    success: function(a) {
                        a.confirm && e.submit(t);
                    }
                });
            }
            "WECHAT_PAY" == a && e.submit(t);
        } else e.submit(t);
    },
    submit: function(t) {
        var e = t.detail.formId, a = this, o = a.data.goods.id, s = JSON.stringify(a.data.attr), i = JSON.stringify(a.data.form_list), r = a.data.pay_type;
        getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        }), getApp().request({
            url: getApp().api.book.submit,
            method: "post",
            data: {
                gid: o,
                form_list: i,
                form_id: e,
                pay_type: r,
                attr: s
            },
            success: function(t) {
                if (0 == t.code) {
                    if (1 != t.type) return getApp().core.showLoading({
                        title: "正在提交",
                        mask: !0
                    }), void getApp().core.requestPayment({
                        _res: t,
                        timeStamp: t.data.timeStamp,
                        nonceStr: t.data.nonceStr,
                        package: t.data.package,
                        signType: t.data.signType,
                        paySign: t.data.paySign,
                        success: function(t) {
                            getApp().core.redirectTo({
                                url: "/pages/book/order/order?status=1"
                            });
                        },
                        fail: function(t) {},
                        complete: function(t) {
                            setTimeout(function() {
                                getApp().core.hideLoading();
                            }, 1e3), "requestPayment:fail" != t.errMsg && "requestPayment:fail cancel" != t.errMsg ? "requestPayment:ok" != t.errMsg && getApp().core.redirectTo({
                                url: "/pages/book/order/order?status=-1"
                            }) : getApp().core.showModal({
                                title: "提示",
                                content: "订单尚未支付",
                                showCancel: !1,
                                confirmText: "确认",
                                success: function(t) {
                                    t.confirm && getApp().core.redirectTo({
                                        url: "/pages/book/order/order?status=0"
                                    });
                                }
                            });
                        }
                    });
                    getApp().core.redirectTo({
                        url: "/pages/book/order/order?status=1"
                    });
                } else getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {}
                });
            },
            complete: function(t) {
                setTimeout(function() {
                    getApp().core.hideLoading();
                }, 1e3);
            }
        });
    },
    switch: function(t) {
        this.setData({
            pay_type: t.currentTarget.dataset.type
        });
    },
    uploadImg: function(t) {
        var e = this, a = t.currentTarget.dataset.id, o = e.data.form_list;
        getApp().uploader.upload({
            start: function() {
                getApp().core.showLoading({
                    title: "正在上传",
                    mask: !0
                });
            },
            success: function(t) {
                0 == t.code ? (o[a].default = t.data.url, e.setData({
                    form_list: o
                })) : e.showToast({
                    title: t.msg
                });
            },
            error: function(t) {
                e.showToast({
                    title: t
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    }
});