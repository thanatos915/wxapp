var t = "", e = "";

Page({
    data: {
        address: null,
        offline: 1,
        payment: -1,
        show_payment: !1
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t), getApp().core.removeStorageSync(getApp().const.INPUT_DATA);
        var e, a = this, o = t.goods_info, s = JSON.parse(o);
        e = 3 == s.deliver_type || 1 == s.deliver_type ? 1 : 2, a.setData({
            options: t,
            type: s.type,
            offline: e,
            parent_id: s.parent_id ? s.parent_id : 0
        });
    },
    onReady: function(t) {
        getApp().page.onReady(this);
    },
    onShow: function(t) {
        getApp().page.onShow(this);
        var e = this, a = getApp().core.getStorageSync(getApp().const.PICKER_ADDRESS);
        a && (e.setData({
            address: a,
            name: a.name,
            mobile: a.mobile
        }), getApp().core.removeStorageSync(getApp().const.PICKER_ADDRESS), e.getInputData()), 
        e.getOrderData(e.data.options);
    },
    onHide: function(t) {
        getApp().page.onHide(this), this.getInputData();
    },
    onUnload: function(t) {
        getApp().page.onUnload(this), getApp().core.removeStorageSync(getApp().const.INPUT_DATA);
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
    getOrderData: function(a) {
        var o = this, s = "";
        o.data.address && o.data.address.id && (s = o.data.address.id), a.goods_info && (getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.submit_preview,
            data: {
                goods_info: a.goods_info,
                group_id: a.group_id,
                address_id: s,
                type: o.data.type,
                longitude: t,
                latitude: e
            },
            success: function(t) {
                if (getApp().core.hideLoading(), 0 == t.code) {
                    if (2 == o.data.offline) var e = parseFloat(t.data.total_price - t.data.colonel > 0 ? t.data.total_price - t.data.colonel : .01), a = 0; else var e = parseFloat(t.data.total_price - t.data.colonel > 0 ? t.data.total_price - t.data.colonel : .01) + t.data.express_price, a = parseFloat(t.data.express_price);
                    var s = getApp().core.getStorageSync(getApp().const.INPUT_DATA);
                    getApp().core.removeStorageSync(getApp().const.INPUT_DATA), console.log(s), s || (s = {
                        address: t.data.address,
                        name: t.data.address ? t.data.address.name : "",
                        mobile: t.data.address ? t.data.address.mobile : ""
                    }, t.data.pay_type_list.length > 0 && (s.payment = t.data.pay_type_list[0].payment, 
                    t.data.pay_type_list.length > 1 && (s.payment = -1)), t.data.shop && (s.shop = t.data.shop), 
                    t.data.shop_list && 1 == t.data.shop_list.length && (s.shop = t.data.shop_list[0])), 
                    s.total_price = t.data.total_price, s.goods_list = t.data.list, s.goods_info = t.data.goods_info, 
                    s.express_price = a, s.send_type = t.data.send_type, s.total_price_1 = e.toFixed(2), 
                    s.colonel = t.data.colonel, s.pay_type_list = t.data.pay_type_list, s.shop_list = t.data.shop_list, 
                    s.res = t.data, s.is_area = t.data.is_area, o.setData(s), o.getInputData();
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
        }));
    },
    bindkeyinput: function(t) {
        this.setData({
            content: t.detail.value
        });
    },
    orderSubmit: function(t) {
        var e = this, a = {}, o = e.data.offline;
        if (a.offline = o, 1 == o) {
            if (!e.data.address || !e.data.address.id) return void getApp().core.showToast({
                title: "请选择收货地址",
                image: "/images/icon-warning.png"
            });
            a.address_id = e.data.address.id;
        } else {
            if (a.address_name = e.data.name, a.address_mobile = e.data.mobile, !e.data.shop.id) return void getApp().core.showToast({
                title: "请选择核销门店",
                image: "/images/icon-warning.png"
            });
            if (a.shop_id = e.data.shop.id, !a.address_name || void 0 == a.address_name) return void getApp().core.showToast({
                title: "请填写收货人",
                image: "/images/icon-warning.png"
            });
            if (!a.address_mobile || void 0 == a.address_mobile) return void getApp().core.showToast({
                title: "请填写联系方式",
                image: "/images/icon-warning.png"
            });
            if (!/^\+?\d[\d -]{8,12}\d/.test(a.address_mobile)) return void getApp().core.showModal({
                title: "提示",
                content: "手机号格式不正确"
            });
        }
        if (-1 == e.data.payment) return e.setData({
            show_payment: !0
        }), !1;
        e.data.goods_info && (a.goods_info = JSON.stringify(e.data.goods_info)), e.data.picker_coupon && (a.user_coupon_id = e.data.picker_coupon.user_coupon_id), 
        e.data.content && (a.content = e.data.content), e.data.type && (a.type = e.data.type), 
        e.data.parent_id && (a.parent_id = e.data.parent_id), a.payment = e.data.payment, 
        a.formId = t.detail.formId, e.order_submit(a, "pt");
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
        var e = this, a = t.target.dataset.index, o = parseFloat(e.data.res.total_price - e.data.res.colonel > 0 ? e.data.res.total_price - e.data.res.colonel : .01) + e.data.res.express_price;
        if (1 == a) this.setData({
            offline: 1,
            express_price: e.data.res.express_price,
            total_price_1: o.toFixed(2)
        }); else {
            var s = (e.data.total_price_1 - e.data.express_price).toFixed(2);
            this.setData({
                offline: 2,
                express_price: 0,
                total_price_1: s
            });
        }
    },
    showShop: function(t) {
        var e = this;
        e.getInputData(), e.dingwei(), e.data.shop_list && e.data.shop_list.length >= 1 && e.setData({
            show_shop: !0
        });
    },
    dingwei: function() {
        var a = this;
        getApp().core.chooseLocation({
            success: function(o) {
                t = o.longitude, e = o.latitude, a.setData({
                    location: o.address
                });
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
    pickShop: function(t) {
        var e = this, a = getApp().core.getStorageSync(getApp().const.INPUT_DATA), o = t.currentTarget.dataset.index;
        a.show_shop = !1, a.shop = "-1" != o && -1 != o && e.data.shop_list[o], e.setData(a);
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
        var t = this, e = {
            address: t.data.address,
            name: t.data.name,
            mobile: t.data.mobile,
            payment: t.data.payment,
            content: t.data.content,
            shop: t.data.shop
        };
        getApp().core.setStorageSync(getApp().const.INPUT_DATA, e);
    }
});