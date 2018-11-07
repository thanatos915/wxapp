function e(e) {
    t.onShowData || (t.onShowData = {}), t.onShowData.scene = e;
}

var t = getApp(), o = {
    init: function(o, a) {
        var r = this, p = getApp().api;
        r.page = o, t = a, r.page.orderPay = function(o) {
            function a(o, a, r) {
                o.pay_type = "WECHAT_PAY", t.request({
                    url: a,
                    data: o,
                    complete: function() {
                        getApp().core.hideLoading();
                    },
                    success: function(t) {
                        0 == t.code && (e("pay"), getApp().core.requestPayment({
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
                                }), getApp().core.redirectTo({
                                    url: "/" + r + "?status=1"
                                })) : getApp().core.showModal({
                                    title: "提示",
                                    content: "订单尚未支付",
                                    showCancel: !1,
                                    confirmText: "确认",
                                    success: function(e) {
                                        e.confirm && getApp().core.redirectTo({
                                            url: "/" + r + "?status=0"
                                        });
                                    }
                                });
                            }
                        })), 1 == t.code && getApp().core.showToast({
                            title: t.msg,
                            image: "/images/icon-warning.png"
                        });
                    }
                });
            }
            function i(e, o, a) {
                e.pay_type = "BALANCE_PAY";
                var r = getApp().getUser();
                getApp().core.showModal({
                    title: "当前账户余额：" + r.money,
                    content: "是否使用余额",
                    success: function(r) {
                        r.confirm && (getApp().core.showLoading({
                            title: "正在提交",
                            mask: !0
                        }), t.request({
                            url: o,
                            data: e,
                            complete: function() {
                                getApp().core.hideLoading();
                            },
                            success: function(e) {
                                0 == e.code && (getApp().page.bindParent({
                                    parent_id: getApp().core.getStorageSync(getApp().const.PARENT_ID),
                                    condition: 2
                                }), getApp().core.redirectTo({
                                    url: "/" + a + "?status=1"
                                })), 1 == e.code && getApp().core.showModal({
                                    title: "提示",
                                    content: e.msg,
                                    showCancel: !1
                                });
                            }
                        }));
                    }
                });
            }
            var n = o.currentTarget.dataset.index, s = r.page.data.order_list[n], c = new Array();
            if (void 0 !== r.page.data.pay_type_list) c = r.page.data.pay_type_list; else if (void 0 !== s.pay_type_list) c = s.pay_type_list; else if (void 0 !== s.goods_list[0].pay_type_list) c = s.goods_list[0].pay_type_list; else {
                var g = {};
                g.payment = 0, c.push(g);
            }
            var d = getCurrentPages(), u = d[d.length - 1].route, l = {};
            if (-1 != u.indexOf("pt")) _ = p.group.pay_data, l.order_id = s.order_id; else if (-1 != u.indexOf("miaosha")) _ = p.miaosha.pay_data, 
            l.order_id = s.order_id; else if (-1 != u.indexOf("book")) _ = p.book.order_pay, 
            l.id = s.id; else {
                var _ = p.order.pay_data;
                l.order_id = s.order_id;
            }
            1 == c.length ? (getApp().core.showLoading({
                title: "正在提交",
                mask: !0
            }), 0 == c[0].payment && a(l, _, u), 3 == c[0].payment && i(l, _, u)) : getApp().core.showModal({
                title: "提示",
                content: "选择支付方式",
                cancelText: "余额支付",
                confirmText: "线上支付",
                success: function(e) {
                    e.confirm ? (getApp().core.showLoading({
                        title: "正在提交",
                        mask: !0
                    }), a(l, _, u)) : e.cancel && i(l, _, u);
                }
            });
        }, r.page.order_submit = function(a, i) {
            function n() {
                getApp().core.showLoading({
                    title: "正在提交",
                    mask: !0
                }), t.request({
                    url: s,
                    method: "post",
                    data: a,
                    success: function(p) {
                        if (0 == p.code) {
                            var n = function() {
                                t.request({
                                    url: c,
                                    data: {
                                        order_id: s,
                                        order_id_list: d,
                                        pay_type: u,
                                        form_id: a.formId
                                    },
                                    success: function(e) {
                                        if (0 != e.code) return getApp().core.hideLoading(), void getApp().core.showModal({
                                            title: "提示",
                                            content: e.msg,
                                            showCancel: !1,
                                            confirmText: "确认",
                                            success: function(e) {
                                                e.confirm && getApp().core.redirectTo({
                                                    url: g + "?status=0"
                                                });
                                            }
                                        });
                                        setTimeout(function() {
                                            getApp().core.hideLoading();
                                        }, 1e3), "pt" == i ? "ONLY_BUY" == r.page.data.type ? getApp().core.redirectTo({
                                            url: g + "?status=2"
                                        }) : getApp().core.redirectTo({
                                            url: "/pages/pt/group/details?oid=" + s
                                        }) : void 0 !== r.page.data.goods_card_list && r.page.data.goods_card_list.length > 0 && 2 != a.payment ? r.page.setData({
                                            show_card: !0
                                        }) : getApp().core.redirectTo({
                                            url: g + "?status=-1"
                                        });
                                    }
                                });
                            };
                            if (getApp().page.bindParent({
                                parent_id: getApp().core.getStorageSync(getApp().const.PARENT_ID),
                                condition: 1
                            }), void 0 != p.data.p_price && 0 === p.data.p_price) return o.showToast({
                                title: "提交成功"
                            }), void setTimeout(function() {
                                getApp().core.navigateBack();
                            }, 2e3);
                            setTimeout(function() {
                                r.page.setData({
                                    options: {}
                                });
                            }, 1);
                            var s = p.data.order_id || "", d = p.data.order_id_list ? JSON.stringify(p.data.order_id_list) : "", u = "";
                            0 == a.payment ? t.request({
                                url: c,
                                data: {
                                    order_id: s,
                                    order_id_list: d,
                                    pay_type: "WECHAT_PAY"
                                },
                                success: function(t) {
                                    if (0 != t.code) {
                                        if (1 == t.code) return getApp().core.hideLoading(), void r.page.showToast({
                                            title: t.msg,
                                            image: "/images/icon-warning.png"
                                        });
                                    } else {
                                        setTimeout(function() {
                                            getApp().core.hideLoading();
                                        }, 1e3), e("pay"), t.data && 0 == t.data.price ? void 0 !== r.page.data.goods_card_list && r.page.data.goods_card_list.length > 0 ? r.page.setData({
                                            show_card: !0
                                        }) : getApp().core.redirectTo({
                                            url: g + "?status=1"
                                        }) : getApp().core.requestPayment({
                                            _res: t,
                                            timeStamp: t.data.timeStamp,
                                            nonceStr: t.data.nonceStr,
                                            package: t.data.package,
                                            signType: t.data.signType,
                                            paySign: t.data.paySign,
                                            success: function(e) {},
                                            fail: function(e) {},
                                            complete: function(e) {
                                                if ("requestPayment:fail" != e.errMsg && "requestPayment:fail cancel" != e.errMsg) return "requestPayment:ok" == e.errMsg ? (getApp().page.bindParent({
                                                    parent_id: getApp().core.getStorageSync(getApp().const.PARENT_ID),
                                                    condition: 2
                                                }), void (void 0 !== r.page.data.goods_card_list && r.page.data.goods_card_list.length > 0 ? r.page.setData({
                                                    show_card: !0
                                                }) : "pt" == i ? "ONLY_BUY" == r.page.data.type ? getApp().core.redirectTo({
                                                    url: g + "?status=2"
                                                }) : getApp().core.redirectTo({
                                                    url: "/pages/pt/group/details?oid=" + s
                                                }) : getApp().core.redirectTo({
                                                    url: g + "?status=1"
                                                }))) : void 0;
                                                getApp().core.showModal({
                                                    title: "提示",
                                                    content: "订单尚未支付",
                                                    showCancel: !1,
                                                    confirmText: "确认",
                                                    success: function(e) {
                                                        e.confirm && getApp().core.redirectTo({
                                                            url: g + "?status=0"
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                        var a = getApp().core.getStorageSync(getApp().const.QUICK_LIST);
                                        if (a) {
                                            for (var p = a.length, n = 0; n < p; n++) for (var c = a[n].goods, d = c.length, u = 0; u < d; u++) c[u].num = 0;
                                            getApp().core.setStorageSync(getApp().const.QUICK_LISTS, a);
                                            for (var l = getApp().core.getStorageSync(getApp().const.CARGOODS), p = l.length, n = 0; n < p; n++) l[n].num = 0, 
                                            l[n].goods_price = 0, o.setData({
                                                carGoods: l
                                            });
                                            getApp().core.setStorageSync(getApp().const.CARGOODS, l);
                                            var _ = getApp().core.getStorageSync(getApp().const.TOTAL);
                                            _ && (_.total_num = 0, _.total_price = 0, getApp().core.setStorageSync(getApp().const.TOTAL, _));
                                            getApp().core.getStorageSync(getApp().const.CHECK_NUM);
                                            0, getApp().core.setStorageSync(getApp().const.CHECK_NUM, 0);
                                            for (var A = getApp().core.getStorageSync(getApp().const.QUICK_HOT_GOODS_LISTS), p = A.length, n = 0; n < p; n++) A[n].num = 0, 
                                            o.setData({
                                                quick_hot_goods_lists: A
                                            });
                                            getApp().core.setStorageSync(getApp().const.QUICK_HOT_GOODS_LISTS, A);
                                        }
                                    }
                                }
                            }) : 2 == a.payment ? (u = "HUODAO_PAY", n()) : 3 == a.payment && (u = "BALANCE_PAY", 
                            n());
                        }
                        if (1 == p.code) return getApp().core.hideLoading(), void r.page.showToast({
                            title: p.msg,
                            image: "/images/icon-warning.png"
                        });
                    }
                });
            }
            var s = p.order.submit, c = p.order.pay_data, g = "/pages/order/order";
            if ("pt" == i ? (s = p.group.submit, c = p.group.pay_data, g = "/pages/pt/order/order") : "ms" == i ? (s = p.miaosha.submit, 
            c = p.miaosha.pay_data, g = "/pages/miaosha/order/order") : "pond" == i ? (s = p.pond.submit, 
            c = p.order.pay_data, g = "/pages/order/order") : "scratch" == i ? (s = p.scratch.submit, 
            c = p.order.pay_data, g = "/pages/order/order") : "s" == i && (s = p.order.new_submit, 
            c = p.order.pay_data, g = "/pages/order/order"), 3 == a.payment) {
                var d = getApp().getUser();
                getApp().core.showModal({
                    title: "当前账户余额：" + d.money,
                    content: "是否确定使用余额支付",
                    success: function(e) {
                        e.confirm && n();
                    }
                });
            } else n();
        };
    }
};

module.exports = o;