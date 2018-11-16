getApp(), getApp().api;

Page({
    data: {
        list: [],
        current_page: 0,
        loading: !1,
        no_more: !1
    },
    getList: function() {
        var t = this;
        if (!t.data.loading && !t.data.no_more) {
            t.setData({
                loading: !0
            });
            var a = t.data.current_page + 1;
            getApp().request({
                url: getApp().api.shop.account_log,
                data: {
                    self: a,
                    year: "",
                    month: ""
                },
                success: function(e) {
                    0 == e.code && (e.data.list && e.data.list.length ? (t.data.list = t.data.list.concat(e.data.list), 
                    t.setData({
                        list: t.data.list,
                        current_page: a
                    })) : t.setData({
                        no_more: !0
                    })), 1 == e.code && getApp().core.showModal({
                        title: "提示",
                        content: e.msg,
                        showCancel: !1
                    });
                },
                complete: function(a) {
                    t.setData({
                        loading: !1
                    });
                }
            });
        }
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        this.getList();
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
    },
    onPullDownRefresh: function() {},
    onReachBottom: function() {
        this.getList();
    }
});