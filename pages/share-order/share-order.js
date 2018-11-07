getApp().api;

var t = !1, a = !1, e = 2;

Page({
    data: {
        status: -1,
        list: [],
        hidden: -1,
        is_no_more: !1,
        is_loading: !1
    },
    onLoad: function(s) {
        getApp().page.onLoad(this, s), t = !1, a = !1, e = 2, this.GetList(s.status || -1);
    },
    GetList: function(t) {
        var a = this;
        a.setData({
            status: parseInt(t || -1)
        }), getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.share.get_order,
            data: {
                status: a.data.status
            },
            success: function(t) {
                a.setData({
                    list: t.data
                }), 0 == t.data.length && a.setData({
                    is_no_more: !0
                });
            },
            complete: function() {
                getApp().core.hideLoading();
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
    },
    onPullDownRefresh: function() {},
    click: function(t) {
        var a = this, e = t.currentTarget.dataset.index;
        a.setData({
            hidden: a.data.hidden == e ? -1 : e
        });
    },
    onReachBottom: function() {
        var s = this;
        a || t || (a = !0, s.setData({
            is_loading: a
        }), getApp().request({
            url: getApp().api.share.get_order,
            data: {
                status: s.data.status,
                page: e
            },
            success: function(a) {
                if (0 == a.code) {
                    var n = s.data.list.concat(a.data);
                    s.setData({
                        list: n
                    }), 0 == a.data.length && (t = !0, s.setData({
                        is_no_more: t
                    }));
                }
                e++;
            },
            complete: function() {
                a = !1, s.setData({
                    is_loading: a
                });
            }
        }));
    }
});