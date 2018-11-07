var t = require("../../wxParse/wxParse.js");

Page({
    data: {},
    onLoad: function(e) {
        getApp().page.onLoad(this, e);
        var a = this;
        getApp().request({
            url: getApp().api.default.article_detail,
            data: {
                id: e.id
            },
            success: function(e) {
                0 == e.code && (getApp().core.setNavigationBarTitle({
                    title: e.data.title
                }), t.wxParse("content", "html", e.data.content, a)), 1 == e.code && getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    confirm: function(t) {
                        t.confirm && getApp().core.navigateBack();
                    }
                });
            }
        });
    }
});