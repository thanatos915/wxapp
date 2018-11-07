Page({
    data: {
        second: 60
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        var e = this;
        getApp().request({
            url: getApp().api.user.sms_setting,
            method: "get",
            data: {
                page: 1
            },
            success: function(t) {
                e.setData({
                    status: 0 == t.code
                });
            }
        });
    },
    gainPhone: function() {
        this.setData({
            gainPhone: !0,
            handPhone: !1
        });
    },
    handPhone: function() {
        this.setData({
            gainPhone: !1,
            handPhone: !0
        });
    },
    nextStep: function() {
        var t = this, e = this.data.handphone;
        e && 11 == e.length ? getApp().request({
            url: getApp().api.user.user_hand_binding,
            method: "POST",
            data: {
                content: e
            },
            success: function(e) {
                0 == e.code ? (t.timer(), t.setData({
                    content: e.msg,
                    timer: !0
                })) : (e.code, getApp().core.showToast({
                    title: e.msg
                }));
            }
        }) : getApp().core.showToast({
            title: "手机号码错误"
        });
    },
    timer: function() {
        var t = this;
        new Promise(function(e, n) {
            var a = setInterval(function() {
                t.setData({
                    second: t.data.second - 1
                }), t.data.second <= 0 && (t.setData({
                    timer: !1
                }), e(a));
            }, 1e3);
        }).then(function(t) {
            clearInterval(t);
        });
    },
    HandPhoneInput: function(t) {
        this.setData({
            handphone: t.detail.value
        });
    },
    CodeInput: function(t) {
        this.setData({
            code: t.detail.value
        });
    },
    PhoneInput: function(t) {
        this.setData({
            phoneNum: t.detail.value
        });
    },
    onSubmit: function() {
        var t = this, e = t.data.gainPhone, n = t.data.handPhone, a = e ? 1 : n ? 2 : 0;
        if (e) {
            var o = t.data.phoneNum;
            if (o) {
                if (11 != o.length) return void getApp().core.showToast({
                    title: "手机号码错误"
                });
                i = o;
            } else if (!(i = t.data.PhoneNumber)) return void getApp().core.showToast({
                title: "手机号码错误"
            });
        } else {
            var i = t.data.handphone;
            if (!/^\+?\d[\d -]{8,12}\d/.test(i)) return void getApp().core.showToast({
                title: "手机号码错误"
            });
            var s = t.data.code;
            if (!s) return void getApp().core.showToast({
                title: "请输入验证码"
            });
        }
        getApp().request({
            url: getApp().api.user.user_empower,
            method: "POST",
            data: {
                phone: i,
                phone_code: s,
                bind_type: a
            },
            success: function(e) {
                0 == e.code ? t.setData({
                    binding: !0,
                    binding_num: i
                }) : 1 == e.code && getApp().core.showToast({
                    title: e.msg
                });
            }
        });
    },
    renewal: function() {
        this.setData({
            binding: !1,
            gainPhone: !0,
            handPhone: !1
        });
    },
    onShow: function() {
        getApp().page.onShow(this);
        var t = this, e = t.data.__user_info;
        e && e.binding ? t.setData({
            binding_num: e.binding,
            binding: !0
        }) : t.setData({
            gainPhone: !0,
            handPhone: !1
        });
    }
});