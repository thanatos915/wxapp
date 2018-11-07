module.exports = function(a) {
    a.data || (a.data = {});
    var t = this.core, e = this.core.getStorageSync(this.const.ACCESS_TOKEN);
    e && (a.data.access_token = e), a.data._version = this._version, a.data._platform = this.platform, 
    !this.is_login && this.page.currentPage && (this.is_login = !0, this.login({}));
    var s = this;
    t.request({
        url: a.url,
        header: a.header || {
            "content-type": "application/x-www-form-urlencoded"
        },
        data: a.data || {},
        method: a.method || "GET",
        dataType: a.dataType || "json",
        success: function(e) {
            -1 == e.data.code ? (s.page.setUserInfoShow(), s.is_login = !1) : -2 == e.data.code ? t.redirectTo({
                url: "/pages/store-disabled/store-disabled"
            }) : a.success && a.success(e.data);
        },
        fail: function(e) {
            console.warn("--- request fail >>>"), console.warn("--- " + a.url + " ---"), console.warn(e), 
            console.warn("<<< request fail ---");
            var s = getApp();
            s.is_on_launch ? (s.is_on_launch = !1, t.showModal({
                title: "网络请求出错",
                content: e.errMsg || "",
                showCancel: !1,
                success: function(t) {
                    t.confirm && a.fail && a.fail(t);
                }
            })) : (t.showToast({
                title: e.errMsg,
                image: "/images/icon-warning.png"
            }), a.fail && a.fail(e));
        },
        complete: function(e) {
            if (200 != e.statusCode && e.data.code && 500 == e.data.code) {
                var s = e.data.data.message;
                t.showModal({
                    title: "系统错误",
                    content: s + ";\r\n请将错误内容复制发送给我们，以便进行问题追踪。",
                    cancelText: "关闭",
                    confirmText: "复制",
                    success: function(s) {
                        s.confirm && t.setClipboardData({
                            data: JSON.stringify({
                                data: e.data.data,
                                object: a
                            })
                        });
                    }
                });
            }
            a.complete && a.complete(e);
        }
    });
};