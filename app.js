var e = null;

"undefined" != typeof wx && (e = "wx"), "undefined" != typeof my && (e = "my");

var t = [ {
    name: "helper",
    file: "./utils/helper.js"
}, {
    name: "const",
    file: "./core/const.js"
}, {
    name: "getConfig",
    file: "./core/config.js"
}, {
    name: "page",
    file: "./core/page.js"
}, {
    name: "request",
    file: "./core/request.js"
}, {
    name: "core",
    file: "./core/core.js"
}, {
    name: "api",
    file: "./core/api.js"
}, {
    name: "getUser",
    file: "./core/getUser.js"
}, {
    name: "setUser",
    file: "./core/setUser.js"
}, {
    name: "login",
    file: "./core/login.js"
}, {
    name: "trigger",
    file: "./core/trigger.js"
}, {
    name: "uploader",
    file: "./utils/uploader.js"
}, {
    name: "orderPay",
    file: "./core/order-pay.js"
} ], n = {
    _version: "2.8.9",
    platform: e,
    query: null,
    onLaunch: function() {
        this.getStoreData();
    },
    onShow: function(e) {
        e.scene && (this.onShowData = e), e && e.query && (this.query = e.query);
    },
    closeLogin: function() {
        console.log(11);
    },
    is_login: !1
};

for (var o in t) n[t[o].name] = require("" + t[o].file);

var a = n.api.index.substr(0, n.api.index.indexOf("/index.php"));

n.webRoot = a, n.getauth = function(e) {
    var t = this;
    t.core.showModal({
        title: "是否打开设置页面重新授权",
        content: e.content,
        confirmText: "去设置",
        success: function(n) {
            n.confirm ? t.core.openSetting({
                success: function(t) {
                    e.success && e.success(t);
                },
                fail: function(t) {
                    e.fail && e.fail(t);
                },
                complete: function(t) {
                    e.complete && e.complete(t);
                }
            }) : e.cancel && t.getauth(e);
        }
    });
}, n.getStoreData = function() {
    var e = this, t = this.api, n = this.core;
    e.request({
        url: t.default.store,
        success: function(t) {
            0 == t.code && (n.setStorageSync(e.const.STORE, t.data.store), n.setStorageSync(e.const.STORE_NAME, t.data.store_name),
            n.setStorageSync(e.const.SHOW_CUSTOMER_SERVICE, t.data.show_customer_service), n.setStorageSync(e.const.CONTACT_TEL, t.data.contact_tel),
            n.setStorageSync(e.const.SHARE_SETTING, t.data.share_setting), e.permission_list = t.data.permission_list,
            n.setStorageSync(e.const.WXAPP_IMG, t.data.wxapp_img), n.setStorageSync(e.const.WX_BAR_TITLE, t.data.wx_bar_title),
            n.setStorageSync(e.const.ALIPAY_MP_CONFIG, t.data.alipay_mp_config), n.setStorageSync(e.const.STORE_CONFIG, t.data),
            setTimeout(function(n) {
                e.config = t.data, e.configReadyCall && e.configReadyCall(t.data);
            }, 1e3));
        },
        complete: function() {}
    });
};

console.log(n)

App(n);
