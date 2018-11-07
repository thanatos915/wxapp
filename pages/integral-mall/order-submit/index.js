var t = "", e = "";

Page({
    data: {
        address: null,
        offline: 1,
        payment: -1,
        show_payment: !1
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        var e = this, a = t.goods_info, o = JSON.parse(a);
        o && e.setData({
            goods_info: o,
            offline: 1,
            id: o.goods_id
        });
    },
    onReady: function() {},
    onShow: function() {
        getApp().page.onShow(this), getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        });
        var t = this, e = getApp().core.getStorageSync(getApp().const.PICKER_ADDRESS);
        e && (t.setData({
            address: e,
            name: e.name,
            mobile: e.mobile
        }), getApp().core.removeStorageSync(getApp().const.PICKER_ADDRESS));
        a = "";
        if (t.data.address && t.data.address.id) var a = t.data.address.id;
        getApp().request({
            url: getApp().api.integral.submit_preview,
            data: {
                goods_info: JSON.stringify(t.data.goods_info),
                address_id: a
            },
            success: function(e) {
                if (getApp().core.hideLoading(), 0 == e.code) {
                    var a = e.data.shop_list, o = {};
                    a && 1 == a.length && (o = a[0]), e.data.is_shop && (o = e.data.is_shop);
                    var s = e.data.total_price;
                    if (e.data.express_price) i = e.data.express_price; else var i = 0;
                    var n = e.data.goods;
                    t.setData({
                        goods: n,
                        address: e.data.address,
                        express_price: i,
                        shop_list: e.data.shop_list,
                        shop: o,
                        name: e.data.address ? e.data.address.name : "",
                        mobile: e.data.address ? e.data.address.mobile : "",
                        total_price: parseFloat(s).toFixed(2),
                        send_type: e.data.send_type,
                        attr: n.attr,
                        attr_price: n.attr_price,
                        attr_integral: n.attr_integral
                    }), 1 == e.data.send_type && t.setData({
                        offline: 1
                    }), 2 == e.data.send_type && t.setData({
                        offline: 2
                    }), t.getTotalPrice();
                } else getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
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
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    getOffline: function(t) {
        var e = this, a = (e.data.express_price, e.data.total_price);
        1 == t.currentTarget.dataset.index ? e.setData({
            offline: 1,
            total_price: a
        }) : e.setData({
            offline: 2
        }), e.getTotalPrice();
    },
    showShop: function(t) {
        var e = this;
        e.dingwei(), e.data.shop_list && e.data.shop_list.length >= 1 && e.setData({
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
        var e = this, a = t.currentTarget.dataset.index;
        "-1" == a || -1 == a ? e.setData({
            shop: !1,
            show_shop: !1
        }) : e.setData({
            shop: e.data.shop_list[a],
            show_shop: !1
        });
    },
    bindkeyinput: function(t) {
        this.setData({
            content: t.detail.value
        });
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
    orderSubmit: function(t) {
        var e = this, a = e.data.offline, o = {};
        if (1 == a) {
            if (!e.data.address || !e.data.address.id) return void getApp().core.showToast({
                title: "请选择收货地址",
                image: "/images/icon-warning.png"
            });
            if (o.address_id = e.data.address.id, e.data.total_price) {
                if (e.data.total_price > 0) s = 2; else var s = 1;
                o.type = s;
            }
        } else {
            if (o.address_name = e.data.name, o.address_mobile = e.data.mobile, !e.data.shop.id) return void getApp().core.showModal({
                title: "警告",
                content: "请选择门店",
                showCancel: !1
            });
            if (o.shop_id = e.data.shop.id, !o.address_name || void 0 == o.address_name) return void e.showToast({
                title: "请填写收货人",
                image: "/images/icon-warning.png"
            });
            if (!o.address_mobile || void 0 == o.address_mobile) return void e.showToast({
                title: "请填写联系方式",
                image: "/images/icon-warning.png"
            });
        }
        if (o.offline = a, e.data.content && (o.content = e.data.content), e.data.goods_info) {
            var i = e.data.attr, n = [];
            for (var r in i) {
                var d = {
                    attr_id: i[r].attr_id,
                    attr_name: i[r].attr_name
                };
                n.push(d);
            }
            e.data.goods_info.attr = n, o.goods_info = JSON.stringify(e.data.goods_info);
        }
        e.data.express_price && (o.express_price = e.data.express_price), o.attr = JSON.stringify(i), 
        getApp().core.showLoading({
            title: "提交中",
            mask: !0
        }), o.formId = t.detail.formId, getApp().request({
            url: getApp().api.integral.submit,
            method: "post",
            data: o,
            success: function(t) {
                getApp().core.hideLoading(), 0 == t.code ? 1 == t.type ? getApp().core.redirectTo({
                    url: "/pages/integral-mall/order/order?status=1"
                }) : getApp().core.requestPayment({
                    _res: t,
                    timeStamp: t.data.timeStamp,
                    nonceStr: t.data.nonceStr,
                    package: t.data.package,
                    signType: t.data.signType,
                    paySign: t.data.paySign,
                    complete: function(t) {
                        "requestPayment:fail" != t.errMsg && "requestPayment:fail cancel" != t.errMsg ? "requestPayment:ok" == t.errMsg && getApp().core.redirectTo({
                            url: "/pages/integral-mall/order/order?status=1"
                        }) : getApp().core.showModal({
                            title: "提示",
                            content: "订单尚未支付",
                            showCancel: !1,
                            confirmText: "确认",
                            success: function(t) {
                                t.confirm && getApp().core.redirectTo({
                                    url: "/pages/integral-mall/order/order?status=0"
                                });
                            }
                        });
                    }
                }) : getApp().core.showToast({
                    title: t.msg,
                    image: "/images/icon-warning.png"
                });
            }
        });
    },
    getTotalPrice: function() {
        var t = this, e = parseFloat(t.data.total_price), a = t.data.offline, o = t.data.express_price, s = 0;
        s = 2 == a ? e : e + o, t.setData({
            new_total_price: parseFloat(s).toFixed(2)
        });
    }
});