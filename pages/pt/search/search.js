var t = 1;

Page({
    data: {
        history_show: !1,
        search_val: "",
        list: [],
        history_info: [],
        show_loading_bar: !1,
        emptyGoods: !1,
        newSearch: !0
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
    },
    onReady: function(t) {
        getApp().page.onReady(this);
    },
    onShow: function(t) {
        getApp().page.onShow(this);
        var e = this;
        getApp().core.getStorage({
            key: "history_info",
            success: function(t) {
                t.data.length > 0 && e.setData({
                    history_info: t.data,
                    history_show: !0
                });
            }
        });
    },
    onHide: function(t) {
        getApp().page.onHide(this);
    },
    onUnload: function(t) {
        getApp().page.onUnload(this);
    },
    onPullDownRefresh: function(t) {
        getApp().page.onPullDownRefresh(this);
    },
    onReachBottom: function(e) {
        getApp().page.onReachBottom(this);
        var o = this;
        o.data.emptyGoods || (o.data.page_count <= t && o.setData({
            emptyGoods: !0
        }), t++, o.getSearchGoods());
    },
    onShareAppMessage: function(t) {
        getApp().page.onShareAppMessage(this);
    },
    toSearch: function(t) {
        var e = t.detail.value, o = this;
        if (e) {
            var a = o.data.history_info;
            a.unshift(e);
            for (var s in a) {
                if (a.length <= 20) break;
                a.splice(s, 1);
            }
            getApp().core.setStorageSync(getApp().const.HISTORY_INFO, a), o.setData({
                history_info: a,
                history_show: !1,
                keyword: e,
                list: []
            }), o.getSearchGoods();
        }
    },
    cancelSearchValue: function(t) {
        getApp().core.navigateBack({
            delta: 1
        });
    },
    newSearch: function(e) {
        var o = this, a = !1;
        o.data.history_info.length > 0 && (a = !0), t = 1, o.setData({
            history_show: a,
            list: [],
            newSearch: [],
            emptyGoods: !1
        });
    },
    clearHistoryInfo: function(t) {
        var e = this, o = [];
        getApp().core.setStorageSync(getApp().const.HISTORY_INFO, o), e.setData({
            history_info: o,
            history_show: !1
        });
    },
    getSearchGoods: function() {
        var e = this, o = e.data.keyword;
        o && (e.setData({
            show_loading_bar: !0
        }), getApp().request({
            url: getApp().api.group.search,
            data: {
                keyword: o,
                page: t
            },
            success: function(o) {
                if (0 == o.code) {
                    if (e.data.newSearch) a = o.data.list; else var a = e.data.list.concat(o.data.list);
                    e.setData({
                        list: a,
                        page_count: o.data.page_count,
                        emptyGoods: !0,
                        show_loading_bar: !1
                    }), o.data.page_count > t && e.setData({
                        newSearch: !1,
                        emptyGoods: !1
                    });
                }
            },
            complete: function() {}
        }));
    },
    historyItem: function(t) {
        var e = t.currentTarget.dataset.keyword, o = this;
        o.setData({
            keyword: e,
            history_show: !1
        }), o.getSearchGoods();
    }
});