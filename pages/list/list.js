var t = !1, a = !1;

Page({
    data: {
        cat_id: "",
        page: 1,
        cat_list: [],
        goods_list: [],
        sort: 0,
        sort_type: -1,
        quick_icon: !0
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t), this.loadData(t);
    },
    loadData: function(t) {
        var a = this, e = getApp().core.getStorageSync(getApp().const.CAT_LIST), i = "";
        if (t.cat_id) for (var s in e) {
            var o = !1;
            e[s].id == t.cat_id && (e[s].checked = !0, e[s].list.length > 0 && (i = "height-bar"));
            for (var d in e[s].list) e[s].list[d].id == t.cat_id && (e[s].list[d].checked = !0, 
            o = !0, i = "height-bar");
            o && (e[s].checked = !0);
        }
        if (t.goods_id) var r = t.goods_id;
        a.setData({
            cat_list: e,
            cat_id: t.cat_id || "",
            height_bar: i,
            goods_id: r || ""
        }), a.reloadGoodsList();
    },
    catClick: function(t) {
        var a = this, e = "", i = t.currentTarget.dataset.index, s = a.data.cat_list;
        for (var o in s) {
            for (var d in s[o].list) s[o].list[d].checked = !1;
            o == i ? (s[o].checked = !0, e = s[o].id) : s[o].checked = !1;
        }
        var r = "";
        s[i].list.length > 0 && (r = "height-bar"), a.setData({
            cat_list: s,
            cat_id: e,
            height_bar: r
        }), a.reloadGoodsList();
    },
    quickNavigation: function() {
        this.setData({
            quick_icon: !this.data.quick_icon
        });
        this.data.store;
        var t = getApp().core.createAnimation({
            duration: 300,
            timingFunction: "ease-out"
        });
        this.data.quick_icon ? t.opacity(0).step() : t.translateY(-55).opacity(1).step(), 
        this.setData({
            animationPlus: t.export()
        });
    },
    subCatClick: function(t) {
        var a = this, e = "", i = t.currentTarget.dataset.index, s = t.currentTarget.dataset.parentIndex, o = a.data.cat_list;
        for (var d in o) for (var r in o[d].list) d == s && r == i ? (o[d].list[r].checked = !0, 
        e = o[d].list[r].id) : o[d].list[r].checked = !1;
        a.setData({
            cat_list: o,
            cat_id: e
        }), a.reloadGoodsList();
    },
    allClick: function() {
        var t = this, a = t.data.cat_list;
        for (var e in a) {
            for (var i in a[e].list) a[e].list[i].checked = !1;
            a[e].checked = !1;
        }
        t.setData({
            cat_list: a,
            cat_id: "",
            height_bar: ""
        }), t.reloadGoodsList();
    },
    reloadGoodsList: function() {
        var t = this;
        a = !1, t.setData({
            page: 1,
            goods_list: [],
            show_no_data_tip: !1
        });
        var e = t.data.cat_id || "", i = t.data.page || 1;
        getApp().request({
            url: getApp().api.default.goods_list,
            data: {
                cat_id: e,
                page: i,
                sort: t.data.sort,
                sort_type: t.data.sort_type,
                goods_id: t.data.goods_id
            },
            success: function(e) {
                0 == e.code && (0 == e.data.list.length && (a = !0), t.setData({
                    page: i + 1
                }), t.setData({
                    goods_list: e.data.list
                })), t.setData({
                    show_no_data_tip: 0 == t.data.goods_list.length
                });
            },
            complete: function() {}
        });
    },
    loadMoreGoodsList: function() {
        var e = this;
        if (!t) {
            e.setData({
                show_loading_bar: !0
            }), t = !0;
            var i = e.data.cat_id || "", s = e.data.page || 2, o = e.data.goods_id;
            getApp().request({
                url: getApp().api.default.goods_list,
                data: {
                    page: s,
                    cat_id: i,
                    sort: e.data.sort,
                    sort_type: e.data.sort_type,
                    goods_id: o
                },
                success: function(t) {
                    0 == t.data.list.length && (a = !0);
                    var i = e.data.goods_list.concat(t.data.list);
                    e.setData({
                        goods_list: i,
                        page: s + 1
                    });
                },
                complete: function() {
                    t = !1, e.setData({
                        show_loading_bar: !1
                    });
                }
            });
        }
    },
    onReachBottom: function() {
        getApp().page.onReachBottom(this), a || this.loadMoreGoodsList();
    },
    onShow: function(t) {
        getApp().page.onShow(this);
        var a = this;
        if (getApp().core.getStorageSync(getApp().const.LIST_PAGE_RELOAD)) {
            var e = getApp().core.getStorageSync(getApp().const.LIST_PAGE_OPTIONS);
            getApp().core.removeStorageSync(getApp().const.LIST_PAGE_OPTIONS), getApp().core.removeStorageSync(getApp().const.LIST_PAGE_RELOAD);
            var i = e.cat_id || "";
            a.setData({
                cat_id: i
            });
            var s = a.data.cat_list;
            for (var o in s) {
                var d = !1;
                for (var r in s[o].list) s[o].list[r].id == i ? (s[o].list[r].checked = !0, d = !0) : s[o].list[r].checked = !1;
                d || i == s[o].id ? (s[o].checked = !0, s[o].list && s[o].list.length > 0 && a.setData({
                    height_bar: "height-bar"
                })) : s[o].checked = !1;
            }
            a.setData({
                cat_list: s
            }), a.reloadGoodsList();
        }
    },
    sortClick: function(t) {
        var a = this, e = t.currentTarget.dataset.sort, i = void 0 == t.currentTarget.dataset.default_sort_type ? -1 : t.currentTarget.dataset.default_sort_type, s = a.data.sort_type;
        if (a.data.sort == e) {
            if (-1 == i) return;
            s = -1 == a.data.sort_type ? i : 0 == s ? 1 : 0;
        } else s = i;
        a.setData({
            sort: e,
            sort_type: s
        }), a.reloadGoodsList();
    },
    onShareAppMessage: function(t) {
        return getApp().page.onShareAppMessage(this), {
            path: "/pages/list/list?user_id=" + getApp().getUser().id + "&cat_id=" + this.data.cat_id,
            success: function(t) {}
        };
    }
});