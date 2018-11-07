var e = getApp();

e.api;

Page({
    data: {
        qrcode: ""
    },
    onLoad: function(t) {
        e.page.onLoad(this, t);
        var o = this;
        getApp().core.getStorageSync(getApp().const.SHARE_SETTING);
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.share.get_qrcode,
            success: function(e) {
                0 == e.code ? o.setData({
                    qrcode: e.data
                }) : getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    onShow: function() {
        getApp().page.onShow(this);
        var e = this, t = getApp().getUser();
        e.setData({
            user_info: t
        });
    },
    click: function() {
        var e = this;
        wx.previewImage({
            current: e.data.qrcode,
            urls: [ e.data.qrcode ]
        });
    }
});