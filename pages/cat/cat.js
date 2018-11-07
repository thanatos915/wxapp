var t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
}, a = !1, e = !1;

Page({
    data: {
        cat_list: [],
        sub_cat_list_scroll_top: 0,
        scrollLeft: 0,
        page: 1,
        cat_style: 0,
        height: 0,
        catheight: 120
    },
    onLoad: function(t) {
        var a = this;
        getApp().page.onLoad(a, t);
        var e = getApp().core.getStorageSync(getApp().const.STORE), s = t.cat_id;
        void 0 !== s && s && (a.data.cat_style = e.cat_style = -1, getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), a.childrenCat(s)), a.setData({
            store: e
        });
    },
    onShow: function() {
        getApp().page.onShow(this), getApp().core.hideLoading(), -1 !== this.data.cat_style && this.loadData();
    },
    loadData: function(t) {
        var a = this, e = getApp().core.getStorageSync(getApp().const.STORE);
        if ("" == a.data.cat_list || 5 != e.cat_style && 4 != e.cat_style && 2 != e.cat_style) {
            var s = getApp().core.getStorageSync(getApp().const.CAT_LIST);
            s && a.setData({
                cat_list: s,
                current_cat: null
            }), getApp().request({
                url: getApp().api.default.cat_list,
                success: function(t) {
                    0 == t.code && (a.data.cat_list = t.data.list, 5 === e.cat_style && a.goodsAll({
                        currentTarget: {
                            dataset: {
                                index: 0
                            }
                        }
                    }), 4 !== e.cat_style && 2 !== e.cat_style || a.catItemClick({
                        currentTarget: {
                            dataset: {
                                index: 0
                            }
                        }
                    }), 1 !== e.cat_style && 3 !== e.cat_style || (a.setData({
                        cat_list: t.data.list,
                        current_cat: null
                    }), getApp().core.setStorageSync(getApp().const.CAT_LIST, t.data.list)));
                },
                complete: function() {
                    getApp().core.stopPullDownRefresh();
                }
            });
        } else a.setData({
            cat_list: a.data.cat_list,
            current_cat: a.data.current_cat
        });
    },
    childrenCat: function(t) {
        var e = this;
        a = !1;
        e.data.page;
        getApp().request({
            url: getApp().api.default.cat_list,
            success: function(a) {
                if (0 == a.code) {
                    var s = !0;
                    for (var c in a.data.list) {
                        a.data.list[c].id == t && (s = !1, e.data.current_cat = a.data.list[c], a.data.list[c].list.length > 0 ? (e.setData({
                            catheight: 100
                        }), e.firstcat({
                            currentTarget: {
                                dataset: {
                                    index: 0
                                }
                            }
                        })) : e.firstcat({
                            currentTarget: {
                                dataset: {
                                    index: 0
                                }
                            }
                        }, !1));
                        for (var i in a.data.list[c].list) a.data.list[c].list[i].id == t && (s = !1, e.data.current_cat = a.data.list[c], 
                        e.goodsItem({
                            currentTarget: {
                                dataset: {
                                    index: i
                                }
                            }
                        }, !1));
                    }
                    s && e.setData({
                        show_no_data_tip: !0
                    });
                }
            },
            complete: function() {
                getApp().core.stopPullDownRefresh(), getApp().core.createSelectorQuery().select("#cat").boundingClientRect().exec(function(t) {
                    e.setData({
                        height: t[0].height
                    });
                });
            }
        });
    },
    catItemClick: function(t) {
        var a = this, e = t.currentTarget.dataset.index, s = a.data.cat_list, c = null;
        for (var i in s) i == e ? (s[i].active = !0, !1, c = s[i]) : s[i].active = !1;
        a.setData({
            cat_list: s,
            sub_cat_list_scroll_top: 0,
            current_cat: c
        });
    },
    firstcat: function(t) {
        var a = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1], e = this, s = e.data.current_cat;
        e.setData({
            page: 1,
            goods_list: [],
            show_no_data_tip: !1,
            current_cat: a ? s : []
        }), e.list(s.id, 2);
    },
    goodsItem: function(t) {
        var a = !(arguments.length > 1 && void 0 !== arguments[1]) || arguments[1], e = this, s = t.currentTarget.dataset.index, c = e.data.current_cat, i = 0;
        for (var o in c.list) s == o ? (c.list[o].active = !0, i = c.list[o].id) : c.list[o].active = !1;
        e.setData({
            page: 1,
            goods_list: [],
            show_no_data_tip: !1,
            current_cat: a ? c : []
        }), e.list(i, 2);
    },
    goodsAll: function(a) {
        var e = this, s = a.currentTarget.dataset.index, c = e.data.cat_list, i = null;
        for (var o in c) o == s ? (c[o].active = !0, i = c[o]) : c[o].active = !1;
        if (e.setData({
            page: 1,
            goods_list: [],
            show_no_data_tip: !1,
            cat_list: c,
            current_cat: i
        }), void 0 === ("undefined" == typeof my ? "undefined" : t(my))) {
            var n = a.currentTarget.offsetLeft, r = e.data.scrollLeft;
            r = n - 80, e.setData({
                scrollLeft: r
            });
        } else c.forEach(function(t, s, i) {
            t.id == a.currentTarget.id && (s >= 1 ? e.setData({
                toView: c[s - 1].id
            }) : e.setData({
                toView: c[s].id
            }));
        });
        e.list(i.id, 1), getApp().core.createSelectorQuery().select("#catall").boundingClientRect().exec(function(t) {
            e.setData({
                height: t[0].height
            });
        });
    },
    list: function(t, e) {
        var s = this;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), a = !1;
        var c = s.data.page || 2;
        getApp().request({
            url: getApp().api.default.goods_list,
            data: {
                cat_id: t,
                page: c
            },
            success: function(e) {
                0 == e.code && (getApp().core.hideLoading(), 0 == e.data.list.length && (a = !0), 
                s.setData({
                    page: c + 1
                }), s.setData({
                    goods_list: e.data.list
                }), s.setData({
                    cat_id: t
                })), s.setData({
                    show_no_data_tip: 0 == s.data.goods_list.length
                });
            },
            complete: function() {
                1 == e && getApp().core.createSelectorQuery().select("#catall").boundingClientRect().exec(function(t) {
                    s.setData({
                        height: t[0].height
                    });
                });
            }
        });
    },
    onReachBottom: function() {
        getApp().page.onReachBottom(this);
        var t = this;
        a || 5 != getApp().core.getStorageSync(getApp().const.STORE).cat_style && -1 != t.data.cat_style || t.loadMoreGoodsList();
    },
    loadMoreGoodsList: function() {
        var t = this;
        if (!e) {
            t.setData({
                show_loading_bar: !0
            }), e = !0;
            var s = t.data.cat_id || "", c = t.data.page || 2;
            getApp().request({
                url: getApp().api.default.goods_list,
                data: {
                    page: c,
                    cat_id: s
                },
                success: function(e) {
                    0 == e.data.list.length && (a = !0);
                    var s = t.data.goods_list.concat(e.data.list);
                    t.setData({
                        goods_list: s,
                        page: c + 1
                    });
                },
                complete: function() {
                    e = !1, t.setData({
                        show_loading_bar: !1
                    });
                }
            });
        }
    }
});