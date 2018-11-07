Page({
    data: {},
    onLoad: function(e) {
        getApp().page.onLoad(this, e);
    },
    getUserInfo: function(e) {
        var t = this;
        "getUserInfo:ok" == e.detail.errMsg && getApp().core.login({
            success: function(o) {
                var n = o.code;
                t.unionLogin({
                    code: n,
                    user_info: e.detail.rawData,
                    encrypted_data: e.detail.encryptedData,
                    iv: e.detail.iv,
                    signature: e.detail.signature
                });
            },
            fail: function(e) {}
        });
    },
    myLogin: function() {
        var e = this;
        "my" === getApp().platform && my.getAuthCode({
            scopes: "auth_user",
            success: function(t) {
                e.unionLogin({
                    code: t.authCode
                });
            }
        });
    },
    unionLogin: function(e) {
        getApp().core.showLoading({
            title: "正在登录",
            mask: !0
        }), getApp().request({
            url: getApp().api.passport.login,
            method: "POST",
            data: e,
            success: function(e) {
                if (0 == e.code) {
                    getApp().setUser(e.data), getApp().core.setStorageSync(getApp().const.ACCESS_TOKEN, e.data.access_token), 
                    getApp().trigger.run(getApp().trigger.events.login);
                    var t = getApp().core.getStorageSync(getApp().const.LOGIN_PRE_PAGE);
                    t && t.route ? getApp().core.redirectTo({
                        url: "/" + t.route + "?" + getApp().helper.objectToUrlParams(t.options)
                    }) : getApp().core.redirectTo({
                        url: "/pages/index/index"
                    });
                } else getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    }
});