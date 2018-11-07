Page({
    data: {
        load_more_count: 0,
        last_load_more_time: 0,
        is_loading: !1,
        loading_class: "",
        cat_id: !1,
        keyword: !1,
        page: 1,
        limit: 20,
        goods_list: [],
        show_history: !0,
        show_result: !1,
        history_list: [],
        is_search: !0,
        is_show: !1,
        cats: [],
        default_cat: []
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t), this.cats();
    },
    onReady: function(t) {
        getApp().page.onReady(this);
    },
    onShow: function(t) {
        getApp().page.onShow(this);
        var a = this;
        a.setData({
            history_list: a.getHistoryList(!0)
        });
    },
    onReachBottom: function(t) {
        getApp().page.onReachBottom(this), this.getMoreGoodsList();
    },
    cats: function() {
        var t = this;
        getApp().request({
            url: getApp().api.default.cats,
            success: function(a) {
                0 == a.code && t.setData({
                    cats: a.data.list,
                    default_cat: a.data.default_cat
                });
            }
        });
    },
    change_cat: function(t) {
        var a = this, e = a.data.cats, s = t.currentTarget.dataset.id;
        for (var i in e) if (s === e[i].id) var o = {
            id: e[i].id,
            name: e[i].name,
            key: e[i].key,
            url: e[i].url
        };
        a.setData({
            default_cat: o
        });
    },
    pullDown: function() {
        var t = this, a = t.data.cats, e = t.data.default_cat;
        for (var s in a) a[s].id === e.id ? a[s].is_active = !0 : a[s].is_active = !1;
        t.setData({
            is_show: !t.data.is_show,
            cats: a
        });
    },
    inputFocus: function() {
        this.setData({
            show_history: !0,
            show_result: !1
        });
    },
    inputBlur: function() {
        var t = this;
        t.data.goods_list.length > 0 && setTimeout(function() {
            t.setData({
                show_history: !1,
                show_result: !0
            });
        }, 300);
    },
    inputConfirm: function(t) {
        var a = this, e = t.detail.value;
        0 != e.length && (a.setData({
            page: 1,
            keyword: e
        }), a.setHistory(e), a.getGoodsList());
    },
    searchCancel: function() {
        getApp().core.navigateBack({
            delta: 1
        });
    },
    historyClick: function(t) {
        var a = this, e = t.currentTarget.dataset.value;
        0 != e.length && (a.setData({
            page: 1,
            keyword: e
        }), a.getGoodsList());
    },
    getGoodsList: function() {
        var t = this;
        t.setData({
            show_history: !1,
            show_result: !0,
            is_search: !0
        }), t.setData({
            page: 1,
            scroll_top: 0
        }), t.setData({
            goods_list: []
        });
        var a = {};
        t.data.cat_id && (a.cat_id = t.data.cat_id, t.setActiveCat(a.cat_id)), t.data.keyword && (a.keyword = t.data.keyword), 
        a.defaultCat = JSON.stringify(t.data.default_cat), t.showLoadingBar(), t.is_loading = !0, 
        getApp().request({
            url: getApp().api.default.search,
            data: a,
            success: function(a) {
                0 == a.code && (t.setData({
                    goods_list: a.data.list
                }), 0 == a.data.list.length ? t.setData({
                    is_search: !1
                }) : t.setData({
                    is_search: !0
                })), a.code;
            },
            complete: function() {
                t.hideLoadingBar(), t.is_loading = !1;
            }
        });
    },
    getHistoryList: function(t) {
        t = t || !1;
        var a = getApp().core.getStorageSync(getApp().const.SEARCH_HISTORY_LIST);
        if (!a) return [];
        if (!t) return a;
        for (var e = [], s = a.length - 1; s >= 0; s--) e.push(a[s]);
        return e;
    },
    setHistory: function(t) {
        var a = this.getHistoryList();
        a.push({
            keyword: t
        });
        for (var e in a) {
            if (a.length <= 20) break;
            a.splice(e, 1);
        }
        getApp().core.setStorageSync(getApp().const.SEARCH_HISTORY_LIST, a);
    },
    getMoreGoodsList: function() {
        var t = this, a = {};
        t.data.cat_id && (a.cat_id = t.data.cat_id, t.setActiveCat(a.cat_id)), t.data.keyword && (a.keyword = t.data.keyword), 
        a.page = t.data.page || 1, t.showLoadingMoreBar(), t.setData({
            is_loading: !0
        }), t.setData({
            load_more_count: t.data.load_more_count + 1
        }), a.page = t.data.page + 1, a.defaultCat = t.data.default_cat, t.setData({
            page: a.page
        }), a.defaultCat = JSON.stringify(t.data.default_cat), getApp().request({
            url: getApp().api.default.search,
            data: a,
            success: function(e) {
                if (0 == e.code) {
                    var s = t.data.goods_list;
                    if (e.data.list.length > 0) {
                        for (var i in e.data.list) s.push(e.data.list[i]);
                        t.setData({
                            goods_list: s
                        });
                    } else t.setData({
                        page: a.page - 1
                    });
                }
                e.code;
            },
            complete: function() {
                t.setData({
                    is_loading: !1
                }), t.hideLoadingMoreBar();
            }
        });
    },
    showLoadingBar: function() {
        this.setData({
            loading_class: "active"
        });
    },
    hideLoadingBar: function() {
        this.setData({
            loading_class: ""
        });
    },
    showLoadingMoreBar: function() {
        this.setData({
            loading_more_active: "active"
        });
    },
    hideLoadingMoreBar: function() {
        this.setData({
            loading_more_active: ""
        });
    },
    deleteSearchHistory: function() {
        this.setData({
            history_list: null
        }), getApp().core.removeStorageSync(getApp().const.SEARCH_HISTORY_LIST);
    }
});