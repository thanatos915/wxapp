getApp(), getApp().api;

var t = "", a = "", e = getApp().helper, i = !1;

Page({
    data: {
        total_price: 0,
        address: null,
        express_price: 0,
        content: "",
        offline: 0,
        express_price_1: 0,
        name: "",
        mobile: "",
        integral_radio: 1,
        new_total_price: 0,
        show_card: !1,
        payment: -1,
        show_payment: !1,
        pond_id: !1,
        scratch_id: !1
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        var a = this, i = e.formatData(new Date());
        getApp().core.removeStorageSync(getApp().const.INPUT_DATA), t.pond_id && a.setData({
            pond_id: t.pond_id
        }), t.scratch_id && a.setData({
            scratch_id: t.scratch_id
        }), a.setData({
            options: t,
            time: i
        });
    },
    bindkeyinput: function(t) {
        var a = t.currentTarget.dataset.mchIndex;
        -1 == a ? this.setData({
            content: t.detail.value
        }) : (this.data.mch_list[a] && (this.data.mch_list[a].content = t.detail.value), 
        this.setData({
            mch_list: this.data.mch_list
        }));
    },
    KeyName: function(t) {
        this.setData({
            name: t.detail.value
        });
    },
    KeyMobile: function(t) {
        this.setData({
            mobile: t.detail.value
        });
    },
    getOffline: function(t) {
        var a = this, e = this.data.express_price, i = this.data.express_price_1;
        1 == t.currentTarget.dataset.index ? this.setData({
            offline: 1,
            express_price: 0,
            express_price_1: e,
            is_area: 0
        }) : this.setData({
            offline: 0,
            express_price: i
        }), a.getPrice();
    },
    dingwei: function() {
        var e = this;
        getApp().core.chooseLocation({
            success: function(i) {
                t = i.longitude, a = i.latitude, e.setData({
                    location: i.address
                });
            },
            fail: function(t) {
                getApp().getauth({
                    content: "需要获取您的地理位置授权，请到小程序设置中打开授权",
                    success: function(t) {
                        t && (t.authSetting["scope.userLocation"] ? e.dingwei() : getApp().core.showToast({
                            title: "您取消了授权",
                            image: "/images/icon-warning.png"
                        }));
                    }
                });
            }
        });
    },
    orderSubmit: function(t) {
        var a = this, e = a.data.offline, i = {};
        if (0 == e) {
            if (1 == a.data.is_area) return void getApp().core.showToast({
                title: "所选地区无货",
                image: "/images/icon-warning.png"
            });
            if (!a.data.address || !a.data.address.id) return void getApp().core.showToast({
                title: "请选择收货地址",
                image: "/images/icon-warning.png"
            });
            i.address_id = a.data.address.id;
        } else {
            if (i.address_name = a.data.name, i.address_mobile = a.data.mobile, !a.data.shop.id) return void getApp().core.showModal({
                title: "警告",
                content: "请选择门店",
                showCancel: !1
            });
            if (i.shop_id = a.data.shop.id, !i.address_name || void 0 == i.address_name) return void a.showToast({
                title: "请填写联系人",
                image: "/images/icon-warning.png"
            });
            if (!i.address_mobile || void 0 == i.address_mobile) return void a.showToast({
                title: "请填写联系方式",
                image: "/images/icon-warning.png"
            });
            if (!/^\+?\d[\d -]{8,12}\d/.test(i.address_mobile)) return void getApp().core.showModal({
                title: "提示",
                content: "手机号格式不正确",
                showCancel: !1
            });
        }
        i.offline = e;
        var s = a.data.form;
        if (1 == s.is_form && a.data.goods_list && a.data.goods_list.length) {
            var o = s.list;
            for (var n in o) if ("date" == o[n].type && (o[n].default = o[n].default ? o[n].default : a.data.time), 
            "time" == o[n].type && (o[n].default = o[n].default ? o[n].default : "00:00"), 1 == o[n].required) if ("radio" == o[n].type || "checkboxc" == o[n].type) {
                var r = !1;
                for (var d in o[n].default_list) 1 == o[n].default_list[d].is_selected && (r = !0);
                if (!r) return getApp().core.showModal({
                    title: "提示",
                    content: "请填写" + s.name + "，加‘*’为必填项",
                    showCancel: !1
                }), !1;
            } else if (!o[n].default || void 0 == o[n].default) return getApp().core.showModal({
                title: "提示",
                content: "请填写" + s.name + "，加‘*’为必填项",
                showCancel: !1
            }), !1;
        }
        if (a.data.pond_id > 0) {
            if (a.data.express_price > 0 && -1 == a.data.payment) return a.setData({
                show_payment: !0
            }), !1;
        } else if (a.data.scratch_id > 0) {
            if (a.data.express_price > 0 && -1 == a.data.payment) return a.setData({
                show_payment: !0
            }), !1;
        } else if (-1 == a.data.payment) return a.setData({
            show_payment: !0
        }), !1;
        if (i.form = JSON.stringify(s), a.data.cart_id_list && (i.cart_id_list = JSON.stringify(a.data.cart_id_list)), 
        a.data.mch_list && a.data.mch_list.length) {
            var c = [];
            for (var n in a.data.mch_list) if (a.data.mch_list[n].cart_id_list) {
                var p = {
                    id: a.data.mch_list[n].id,
                    cart_id_list: a.data.mch_list[n].cart_id_list
                };
                a.data.mch_list[n].content && (p.content = a.data.mch_list[n].content), c.push(p);
            }
            c.length ? i.mch_list = JSON.stringify(c) : i.mch_list = "";
        }
        a.data.goods_info && (i.goods_info = JSON.stringify(a.data.goods_info)), a.data.picker_coupon && (i.user_coupon_id = a.data.picker_coupon.user_coupon_id), 
        a.data.content && (i.content = a.data.content), a.data.cart_list && (i.cart_list = JSON.stringify(a.data.cart_list)), 
        1 == a.data.integral_radio ? i.use_integral = 1 : i.use_integral = 2, a.data.goods_list && a.data.goods_list.length || !a.data.mch_list || 1 != a.data.mch_list.length || (i.content = a.data.mch_list[0].content ? a.data.mch_list[0].content : ""), 
        i.payment = a.data.payment, i.formId = t.detail.formId, i.pond_id = a.data.pond_id, 
        i.scratch_id = a.data.scratch_id, i.pond_id ? a.order_submit(i, "pond") : i.scratch_id ? a.order_submit(i, "scratch") : a.order_submit(i, "s");
    },
    onReady: function() {},
    onShow: function(t) {
        if (!getApp().onShowData || !getApp().onShowData.scene || 1034 != getApp().onShowData.scene && "pay" != getApp().onShowData.scene) if (i) i = !1; else {
            getCurrentPages();
            getApp().page.onShow(this);
            var a = this, e = getApp().core.getStorageSync(getApp().const.PICKER_ADDRESS);
            if (e) {
                // a.data.is_area_city_id;
                var s = {};
                s.address = e, s.name = e.name, s.mobile = e.mobile, getApp().core.removeStorageSync(getApp().const.PICKER_ADDRESS), 
                a.setData(s), a.getInputData();
            }
            a.getOrderData(a.data.options);
        }
    },
    getOrderData: function(e) {
        var i = this, s = {}, o = "";
        if (i.data.address && i.data.address.id && (o = i.data.address.id), s.address_id = o, 
        s.longitude = t, s.latitude = a, getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), e.cart_list) {
            JSON.parse(e.cart_list);
            s.cart_list = e.cart_list;
        }
        if (e.cart_id_list) {
            var n = JSON.parse(e.cart_id_list);
            s.cart_id_list = n;
        }
        if (e.mch_list) {
            var r = JSON.parse(e.mch_list);
            s.mch_list = r;
        }
        e.goods_info && (s.goods_info = e.goods_info), e.bargain_order_id && (s.bargain_order_id = e.bargain_order_id), 
        getApp().request({
            url: getApp().api.order.submit_preview,
            data: s,
            success: function(t) {
                if (getApp().core.hideLoading(), 0 == t.code) {
                    var a = getApp().core.getStorageSync(getApp().const.INPUT_DATA);
                    getApp().core.removeStorageSync(getApp().const.INPUT_DATA);
                    var e = [], s = t.data.coupon_list;
                    for (var o in s) null != s[o] && e.push(s[o]);
                    var n = t.data.shop_list, r = {};
                    n && 1 == n.length && (r = n[0]), t.data.is_shop && (r = t.data.is_shop), a || ((a = {
                        shop: r,
                        address: t.data.address || null,
                        name: t.data.address ? t.data.address.name : "",
                        mobile: t.data.address ? t.data.address.mobile : "",
                        pay_type_list: t.data.pay_type_list,
                        form: t.data.form
                    }).pay_type_list.length > 1 ? a.payment = -1 : a.payment = a.pay_type_list[0].payment), 
                    a.total_price = t.data.total_price || 0, a.goods_list = t.data.list || null, a.express_price = parseFloat(t.data.express_price), 
                    a.coupon_list = s, a.shop_list = n, a.send_type = t.data.send_type, a.level = t.data.level, 
                    a.new_total_price = t.data.total_price || 0, a.integral = t.data.integral, a.goods_card_list = t.data.goods_card_list || [], 
                    a.is_payment = t.data.is_payment, a.mch_list = t.data.mch_list || null,
                    a.pay_type_list = t.data.pay_type_list, a.offer_rule = t.data.offer_rule, a.is_area = t.data.is_area, 
                    i.setData(a), i.getInputData(), t.data.goods_info && i.setData({
                        goods_info: t.data.goods_info
                    }), t.data.cart_id_list && i.setData({
                        cart_id_list: t.data.cart_id_list
                    }), t.data.cart_list && i.setData({
                        cart_list: t.data.cart_list
                    }), 1 == t.data.send_type && i.setData({
                        offline: 0
                    }), 2 == t.data.send_type && i.setData({
                        offline: 1
                    }), i.getPrice();
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
    copyText: function(t) {
        var a = t.currentTarget.dataset.text;
        a && getApp().core.setClipboardData({
            data: a,
            success: function() {
                self.showToast({
                    title: "已复制内容"
                });
            },
            fail: function() {
                self.showToast({
                    title: "复制失败",
                    image: "/images/icon-warning.png"
                });
            }
        });
    },
    showCouponPicker: function() {
        var t = this;
        t.getInputData(), t.data.coupon_list && t.data.coupon_list.length > 0 && t.setData({
            show_coupon_picker: !0
        });
    },
    pickCoupon: function(t) {
        var a = this, e = t.currentTarget.dataset.index, i = getApp().core.getStorageSync(getApp().const.INPUT_DATA);
        getApp().core.removeStorageSync(getApp().const.INPUT_DATA), "-1" == e || -1 == e ? (i.picker_coupon = !1, 
        i.show_coupon_picker = !1) : (i.picker_coupon = a.data.coupon_list[e], i.show_coupon_picker = !1), 
        a.setData(i), a.getPrice();
    },
    numSub: function(t, a, e) {
        return 100;
    },
    showShop: function(t) {
        var a = this;
        a.getInputData(), a.dingwei(), a.data.shop_list && a.data.shop_list.length >= 1 && a.setData({
            show_shop: !0
        });
    },
    pickShop: function(t) {
        var a = this, e = t.currentTarget.dataset.index, i = getApp().core.getStorageSync(getApp().const.INPUT_DATA);
        getApp().core.removeStorageSync(getApp().const.INPUT_DATA), "-1" == e || -1 == e ? (i.shop = !1, 
        i.show_shop = !1) : (i.shop = a.data.shop_list[e], i.show_shop = !1), a.setData(i), 
        a.getPrice();
    },
    integralSwitchChange: function(t) {
        var a = this;
        0 != t.detail.value ? a.setData({
            integral_radio: 1
        }) : a.setData({
            integral_radio: 2
        }), a.getPrice();
    },
    integration: function(t) {
        var a = this.data.integral.integration;
        getApp().core.showModal({
            title: "积分使用规则",
            content: a,
            showCancel: !1,
            confirmText: "我知道了",
            confirmColor: "#ff4544",
            success: function(t) {
                t.confirm;
            }
        });
    },
    getPrice: function() {
        var t = this, a = t.data.total_price, e = t.data.express_price, i = t.data.picker_coupon, s = t.data.integral, o = t.data.integral_radio, n = t.data.level, r = t.data.offline;
        if (t.data.goods_list && t.data.goods_list.length > 0 && (i && (a -= i.sub_price), 
        s && 1 == o && (a -= parseFloat(s.forehead)), n && (a = a * n.discount / 10), a <= .01 && (a = .01), 
        0 == r && (a += e)), t.data.mch_list && t.data.mch_list.length) for (var d in t.data.mch_list) a += t.data.mch_list[d].total_price + t.data.mch_list[d].express_price;
        t.setData({
            new_total_price: parseFloat(a.toFixed(2))
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
        var a = this, e = t.currentTarget.dataset.index, i = a.data.form, s = i.list;
        s[e].default = t.detail.value, i.list = s, a.setData({
            form: i
        });
    },
    selectForm: function(t) {
        var a = this, e = t.currentTarget.dataset.index, i = t.currentTarget.dataset.k, s = a.data.form, o = s.list;
        if ("radio" == o[e].type) {
            var n = o[e].default_list;
            for (var r in n) r == i ? n[i].is_selected = 1 : n[r].is_selected = 0;
            o[e].default_list = n;
        }
        "checkbox" == o[e].type && (1 == (n = o[e].default_list)[i].is_selected ? n[i].is_selected = 0 : n[i].is_selected = 1, 
        o[e].default_list = n), s.list = o, a.setData({
            form: s
        });
    },
    showPayment: function() {
        this.setData({
            show_payment: !0
        });
    },
    payPicker: function(t) {
        var a = t.currentTarget.dataset.index;
        this.setData({
            payment: a,
            show_payment: !1
        });
    },
    payClose: function() {
        this.setData({
            show_payment: !1
        });
    },
    getInputData: function() {
        var t = this, a = {
            address: t.data.address,
            content: t.data.content,
            name: t.data.name,
            mobile: t.data.mobile,
            integral_radio: t.data.integral_radio,
            payment: t.data.payment,
            shop: t.data.shop,
            form: t.data.form,
            picker_coupon: t.data.picker_coupon
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
        var a = this, e = t.currentTarget.dataset.index, s = a.data.form;
        i = !0, getApp().uploader.upload({
            start: function() {
                getApp().core.showLoading({
                    title: "正在上传",
                    mask: !0
                });
            },
            success: function(t) {
                0 == t.code ? (s.list[e].default = t.data.url, a.setData({
                    form: s
                })) : a.showToast({
                    title: t.msg
                });
            },
            error: function(t) {
                a.showToast({
                    title: t
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    }
});