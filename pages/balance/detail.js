Page({
    data: {},
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        var e = this;
        e.setData(t), getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.recharge.detail,
            method: "GET",
            data: {
                order_type: t.order_type,
                id: t.id
            },
            success: function(t) {
                getApp().core.hideLoading(), 0 == t.code ? e.setData({
                    list: t.data
                }) : getApp().core.showModal({
                    title: "提示",
                    content: t.msg
                });
            }
        });
    },
    onReady: function() {
        getApp().page.onReady(this);
    },
    onShow: function() {
        getApp().page.onShow(this);
    },
    onHide: function() {
        getApp().page.onHide(this);
    },
    onUnload: function() {
        getApp().page.onUnload(this);
    }
});