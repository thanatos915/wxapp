var t = require("../../wxParse/wxParse.js");

Page({
    data: {
        score: [ 1, 2, 3, 4, 5 ]
    },
    onLoad: function(e) {
        getApp().page.onLoad(this, e);
        var o = this;
        o.setData({
            shop_id: e.shop_id
        }), getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.default.shop_detail,
            method: "GET",
            data: {
                shop_id: e.shop_id
            },
            success: function(e) {
                if (0 == e.code) {
                    o.setData(e.data);
                    var a = e.data.shop.content ? e.data.shop.content : "<span>暂无信息</span>";
                    t.wxParse("detail", "html", a, o);
                } else getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && getApp().core.redirectTo({
                            url: "/pages/shop/shop"
                        });
                    }
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    onShow: function() {
        getApp().page.onShow(this);
    },
    mobile: function() {
        var t = this;
        getApp().core.makePhoneCall({
            phoneNumber: t.data.shop.mobile
        });
    },
    goto: function() {
        var t = this;
        "undefined" != typeof my ? t.location() : getApp().core.getSetting({
            success: function(e) {
                e.authSetting["scope.userLocation"] ? t.location() : getApp().getauth({
                    content: "需要获取您的地理位置授权，请到小程序设置中打开授权！",
                    cancel: !1,
                    success: function(e) {
                        e.authSetting["scope.userLocation"] && t.location();
                    }
                });
            }
        });
    },
    location: function() {
        var t = this.data.shop;
        getApp().core.openLocation({
            latitude: parseFloat(t.latitude),
            longitude: parseFloat(t.longitude),
            name: t.name,
            address: t.address
        });
    },
    onShareAppMessage: function(t) {
        var e = getApp().core.getStorageSync(getApp().const.USER_INFO);
        return {
            path: "/pages/shop-detail/shop-detail?shop_id=" + this.data.shop_id + "&user_id=" + e.id
        };
    }
});