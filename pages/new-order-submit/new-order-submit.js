getApp(), getApp().api;

var t = "", e = "", a = getApp().helper, i = !1;

Page({
    data: {
        total_price: 0,
        address: null,
        express_price: 0,
        express_price_1: 0,
        integral_radio: 1,
        new_total_price: 0,
        show_card: !1,
        payment: -1,
        show_payment: !1,
        show_more: !1,
        index: -1,
        mch_offline: !0
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        var e = this, o = a.formatData(new Date());
        getApp().core.removeStorageSync(getApp().const.INPUT_DATA), e.setData({
            options: t,
            time: o
        }), i = !1;
    },
    bindContentInput: function(t) {
        this.data.mch_list[t.currentTarget.dataset.index].content = t.detail.value, this.setData({
            mch_list: this.data.mch_list
        });
    },
    KeyName: function(t) {
        var e = this.data.mch_list;
        e[t.currentTarget.dataset.index].offline_name = t.detail.value, this.setData({
            mch_list: e
        });
    },
    KeyMobile: function(t) {
        var e = this.data.mch_list;
        e[t.currentTarget.dataset.index].offline_mobile = t.detail.value, this.setData({
            mch_list: e
        });
    },
    getOffline: function(t) {
        var e = this, a = t.currentTarget.dataset.offline, i = t.currentTarget.dataset.index, o = e.data.mch_list;
        o[i].offline = a, e.setData({
            mch_list: o
        }), 1 == o.length && 0 == o[0].mch_id && 1 == o[0].offline ? e.setData({
            mch_offline: !1
        }) : e.setData({
            mch_offline: !0
        }), e.getPrice();
    },
    dingwei: function() {
        var a = this;
        getApp().core.chooseLocation({
            success: function(i) {
                t = i.longitude, e = i.latitude, a.setData({
                    location: i.address
                }), a.getOrderData(a.data.options);
            },
            fail: function(t) {
                getApp().getauth({
                    content: "需要获取您的地理位置授权，请到小程序设置中打开授权",
                    success: function(t) {
                        t && (t.authSetting["scope.userLocation"] ? a.dingwei() : getApp().core.showToast({
                            title: "您取消了授权",
                            image: "/images/icon-warning.png"
                        }));
                    }
                });
            }
        });
    },
    orderSubmit: function(t) {
        var e = this, a = {}, i = e.data.mch_list;
        for (var o in i) {
            var s = i[o].form;
            if (s && 1 == s.is_form && 0 == i[o].mch_id) {
                var n = s.list;
                for (var r in n) if (1 == n[r].required) if ("radio" == n[r].type || "checkbox" == n[r].type) {
                    var c = !1;
                    for (var p in n[r].default_list) 1 == n[r].default_list[p].is_selected && (c = !0);
                    if (!c) return getApp().core.showModal({
                        title: "提示",
                        content: "请填写" + s.name + "，加‘*’为必填项",
                        showCancel: !1
                    }), !1;
                } else if (!n[r].default || void 0 == n[r].default) return getApp().core.showModal({
                    title: "提示",
                    content: "请填写" + s.name + "，加‘*’为必填项",
                    showCancel: !1
                }), !1;
            }
            if (1 == i.length && 0 == i[o].mch_id && 1 == i[o].offline) ; else {
                if (!e.data.address) return getApp().core.showModal({
                    title: "提示",
                    content: "请选择收货地址",
                    showCancel: !1
                }), !1;
                a.address_id = e.data.address.id;
            }
        }
        if (a.mch_list = JSON.stringify(i), e.data.pond_id > 0) {
            if (e.data.express_price > 0 && -1 == e.data.payment) return e.setData({
                show_payment: !0
            }), !1;
        } else if (-1 == e.data.payment) return e.setData({
            show_payment: !0
        }), !1;
        1 == e.data.integral_radio ? a.use_integral = 1 : a.use_integral = 2, a.payment = e.data.payment, 
        a.formId = t.detail.formId, e.order_submit(a, "s");
    },
    onReady: function() {},
    onShow: function(t) {
        if (!i) {
            i = !0, getApp().page.onShow(this);
            var e = this, a = getApp().core.getStorageSync(getApp().const.PICKER_ADDRESS);
            a && e.setData({
                address: a
            }), e.getOrderData(e.data.options);
        }
    },
    getOrderData: function(a) {
        var i = this, o = {}, s = "";
        i.data.address && i.data.address.id && (s = i.data.address.id), o.address_id = s, 
        o.longitude = t, o.latitude = e, getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), o.mch_list = a.mch_list, getApp().request({
            url: getApp().api.order.new_submit_preview,
            method: "POST",
            data: o,
            success: function(t) {
                if (getApp().core.hideLoading(), 0 == t.code) {
                    var e = getApp().core.getStorageSync(getApp().const.INPUT_DATA), a = t.data, o = -1, s = 1, n = a.mch_list, r = [];
                    e && (r = e.mch_list, o = e.payment, s = e.integral_radio), a.integral_radio = s;
                    for (var c in a.pay_type_list) {
                        if (o == a.pay_type_list[c].payment) {
                            a.payment = o;
                            break;
                        }
                        if (1 == a.pay_type_list.length) {
                            a.payment = a.pay_type_list[c].payment;
                            break;
                        }
                    }
                    for (var c in n) {
                        var p = {}, d = {};
                        if (n[c].show = !1, n[c].show_length = n[c].goods_list.length - 1, 0 != r.length) for (var l in r) n[c].mch_id == r[l].mch_id && (n[c].content = r[l].content, 
                        n[c].form = r[l].form, p = r[l].shop, d = r[l].picker_coupon, n[c].offline_name = r[l].offline_name, 
                        n[c].offline_mobile = r[l].offline_mobile);
                        for (var l in n[c].shop_list) {
                            if (p && p.id == n[c].shop_list[l].id) {
                                n[c].shop = p;
                                break;
                            }
                            if (1 == n[c].shop_list.length) {
                                n[c].shop = n[c].shop_list[l];
                                break;
                            }
                            if (1 == n[c].shop_list[l].is_default) {
                                n[c].shop = n[c].shop_list[l];
                                break;
                            }
                        }
                        if (d) for (var l in n[c].coupon_list) if (d.id == n[c].coupon_list[l].id) {
                            n[c].picker_coupon = d;
                            break;
                        }
                        n[c].send_type && 2 == n[c].send_type ? (n[c].offline = 1, i.setData({
                            mch_offline: !1
                        })) : n[c].offline = 0;
                    }
                    a.mch_list = n;
                    var _ = i.data.index;
                    -1 != _ && n[_].shop_list && n[_].shop_list.length > 0 && i.setData({
                        show_shop: !0,
                        shop_list: n[_].shop_list
                    }), i.setData(a), i.getPrice();
                }
                1 == t.code && getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    confirmText: "返回",
                    success: function(t) {
                        t.confirm && getApp().core.navigateBack({
                            delta: 1
                        });
                    }
                });
            }
        });
    },
    showCouponPicker: function(t) {
        var e = this, a = t.currentTarget.dataset.index, i = e.data.mch_list;
        e.getInputData(), i[a].coupon_list && i[a].coupon_list.length > 0 && e.setData({
            show_coupon_picker: !0,
            coupon_list: i[a].coupon_list,
            index: a
        });
    },
    pickCoupon: function(t) {
        var e = this, a = t.currentTarget.dataset.index, i = e.data.index, o = getApp().core.getStorageSync(getApp().const.INPUT_DATA);
        getApp().core.removeStorageSync(getApp().const.INPUT_DATA);
        var s = o.mch_list;
        "-1" == a || -1 == a ? (s[i].picker_coupon = !1, o.show_coupon_picker = !1) : (s[i].picker_coupon = e.data.coupon_list[a], 
        o.show_coupon_picker = !1), o.mch_list = s, o.index = -1, e.setData(o), e.getPrice();
    },
    showShop: function(t) {
        var e = this, a = t.currentTarget.dataset.index;
        e.getInputData(), e.setData({
            index: a
        }), e.dingwei();
    },
    pickShop: function(t) {
        var e = this, a = t.currentTarget.dataset.index, i = e.data.index, o = getApp().core.getStorageSync(getApp().const.INPUT_DATA), s = o.mch_list;
        "-1" == a || -1 == a ? (s[i].shop = !1, o.show_shop = !1) : (s[i].shop = e.data.shop_list[a], 
        o.show_shop = !1), o.mch_list = s, o.index = -1, e.setData(o), e.getPrice();
    },
    integralSwitchChange: function(t) {
        var e = this;
        0 != t.detail.value ? e.setData({
            integral_radio: 1
        }) : e.setData({
            integral_radio: 2
        }), e.getPrice();
    },
    integration: function(t) {
        var e = this.data.integral.integration;
        getApp().core.showModal({
            title: "积分使用规则",
            content: e,
            showCancel: !1,
            confirmText: "我知道了",
            confirmColor: "#ff4544",
            success: function(t) {
                t.confirm;
            }
        });
    },
    getPrice: function() {
        var t = this, e = t.data.mch_list, a = t.data.integral_radio, i = (t.data.integral, 
        0), o = 0, s = {};
        for (var n in e) {
            var r = e[n], c = (parseFloat(r.total_price), parseFloat(r.level_price));
            r.picker_coupon && r.picker_coupon.sub_price > 0 && (c -= r.picker_coupon.sub_price), 
            r.integral && r.integral.forehead > 0 && 1 == a && (c -= parseFloat(r.integral.forehead)), 
            0 == r.offline && (r.express_price && (c += r.express_price), r.offer_rule && 1 == r.offer_rule.is_allowed && (s = r.offer_rule), 
            1 == r.is_area && (o = 1)), i += parseFloat(c);
        }
        i = i >= 0 ? i : 0, t.setData({
            new_total_price: parseFloat(i.toFixed(2)),
            offer_rule: s,
            is_area: o
        });
    },
    cardDel: function() {
        this.setData({
            show_card: !1
        }), getApp().core.redirectTo({
            url: "/pages/order/order?status=1"
        });
    },
    cardTo: function() {
        this.setData({
            show_card: !1
        }), getApp().core.redirectTo({
            url: "/pages/card/card"
        });
    },
    formInput: function(t) {
        var e = this, a = t.currentTarget.dataset.index, i = t.currentTarget.dataset.formId, o = e.data.mch_list, s = o[a].form, n = s.list;
        n[i].default = t.detail.value, s.list = n, e.setData({
            mch_list: o
        });
    },
    selectForm: function(t) {
        var e = this, a = e.data.mch_list, i = t.currentTarget.dataset.index, o = t.currentTarget.dataset.formId, s = t.currentTarget.dataset.k, n = a[i].form, r = n.list, c = r[o].default_list;
        if ("radio" == r[o].type) {
            for (var p in c) p == s ? c[s].is_selected = 1 : c[p].is_selected = 0;
            r[o].default_list = c;
        }
        "checkbox" == r[o].type && (1 == c[s].is_selected ? c[s].is_selected = 0 : c[s].is_selected = 1, 
        r[o].default_list = c), n.list = r, a[i].form = n, e.setData({
            mch_list: a
        });
    },
    showPayment: function() {
        this.setData({
            show_payment: !0
        });
    },
    payPicker: function(t) {
        var e = t.currentTarget.dataset.index;
        this.setData({
            payment: e,
            show_payment: !1
        });
    },
    payClose: function() {
        this.setData({
            show_payment: !1
        });
    },
    getInputData: function() {
        var t = this, e = t.data.mch_list, a = {
            integral_radio: t.data.integral_radio,
            payment: t.data.payment,
            mch_list: e
        };
        getApp().core.setStorageSync(getApp().const.INPUT_DATA, a);
    },
    onHide: function() {
        getApp().page.onHide(this), this.getInputData();
    },
    onUnload: function() {
        getApp().page.onUnload(this), getApp().core.removeStorageSync(getApp().const.INPUT_DATA);
    },
    uploadImg: function(t) {
        var e = this, a = t.currentTarget.dataset.index, o = t.currentTarget.dataset.formId, s = e.data.mch_list, n = s[a].form;
        i = !0, getApp().uploader.upload({
            start: function() {
                getApp().core.showLoading({
                    title: "正在上传",
                    mask: !0
                });
            },
            success: function(t) {
                0 == t.code ? (n.list[o].default = t.data.url, e.setData({
                    mch_list: s
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
    },
    goToAddress: function() {
        i = !1, getApp().core.navigateTo({
            url: "/pages/address-picker/address-picker"
        });
    },
    showMore: function(t) {
        var e = this, a = e.data.mch_list, i = t.currentTarget.dataset.index;
        a[i].show = !a[i].show, e.setData({
            mch_list: a
        });
    }
});