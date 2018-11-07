Page({
    data: {
        user: {},
        is_bind: "",
        app: {}
    },
    onLoad: function(e) {
        getApp().page.onLoad(this, e), this.checkBind();
        var t = getApp().core.getStorageSync(getApp().const.USER_INFO);
        this.setData({
            user: t
        });
    },
    checkBind: function() {
        var e = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.user.check_bind,
            success: function(t) {
                getApp().core.hideLoading(), 0 === t.code && e.setData({
                    is_bind: t.data.is_bind,
                    app: t.data.app
                });
            }
        });
    },
    getUserInfo: function(e) {
        getApp().core.showLoading({
            title: "加载中"
        });
        var t = this;
        getApp().core.login({
            success: function(o) {
                var n = o.code;
                getApp().request({
                    url: getApp().api.passport.login,
                    method: "POST",
                    data: {
                        code: n,
                        user_info: e.detail.rawData,
                        encrypted_data: e.detail.encryptedData,
                        iv: e.detail.iv,
                        signature: e.detail.signature
                    },
                    success: function(e) {
                        getApp().core.hideLoading(), 0 === e.code ? (getApp().core.showToast({
                            title: "登录成功,请稍等...",
                            icon: "none"
                        }), t.bind()) : getApp().core.showToast({
                            title: "服务器出错，请再次点击绑定",
                            icon: "none"
                        });
                    }
                });
            }
        });
    },
    bind: function() {
        getApp().request({
            url: getApp().api.user.authorization_bind,
            data: {},
            success: function(e) {
                if (0 === e.code) {
                    var t = encodeURIComponent(e.data.bind_url);
                    getApp().core.redirectTo({
                        url: "/pages/web/web?url=" + t
                    });
                } else getApp().core.showToast({
                    title: e.msg,
                    icon: "none"
                });
            }
        });
    },
    onReady: function(e) {
        getApp().page.onReady(this);
    },
    onShow: function(e) {
        getApp().page.onShow(this);
    },
    onHide: function(e) {
        getApp().page.onHide(this);
    },
    onUnload: function(e) {
        getApp().page.onUnload(this);
    },
    onPullDownRefresh: function(e) {
        getApp().page.onPullDownRefresh(this);
    },
    onReachBottom: function(e) {
        getApp().page.onReachBottom(this);
    },
    onShareAppMessage: function(e) {
        getApp().page.onShareAppMessage(this);
    }
});