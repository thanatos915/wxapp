var t = require("../../../components/quick-navigation/quick-navigation.js");

Page({
    data: {
        cid: 0,
        scrollLeft: 600,
        scrollTop: 0,
        emptyGoods: 0,
        page: 1,
        pageCount: 0,
        cat_show: 1,
        cid_url: !1
    },
    onLoad: function(a) {
        getApp().page.onLoad(this, a);
        var e = this;
        if (t.init(this), e.systemInfo = getApp().core.getSystemInfoSync(), a.cid) {
            a.cid;
            return this.setData({
                cid_url: !1
            }), void this.switchNav({
                currentTarget: {
                    dataset: {
                        id: a.cid
                    }
                }
            });
        }
        this.setData({
            cid_url: !0
        }), this.loadIndexInfo(this);
    },
    onReady: function(t) {
        getApp().page.onReady(this);
    },
    onShow: function(t) {
        getApp().page.onShow(this);
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
    onShareAppMessage: function(t) {
        getApp().page.onShareAppMessage(this);
    },
    loadIndexInfo: function() {
        var t = this;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.book.index,
            method: "get",
            success: function(a) {
                0 == a.code && (getApp().core.hideLoading(), t.setData({
                    cat: a.data.cat,
                    goods: a.data.goods.list,
                    cat_show: a.data.cat_show,
                    page: a.data.goods.page,
                    pageCount: a.data.goods.page_count
                }), !a.data.goods.list.length > 0 && t.setData({
                    emptyGoods: 1
                }));
            }
        });
    },
    switchNav: function(t) {
        var a = this;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        });
        var e = 0;
        if (e != t.currentTarget.dataset.id || 0 == t.currentTarget.dataset.id) {
            if (e = t.currentTarget.dataset.id, "wx" == this.data.__platform) {
                var o = a.systemInfo.windowWidth, s = t.currentTarget.offsetLeft, i = a.data.scrollLeft;
                i = s > o / 2 ? s : 0, a.setData({
                    scrollLeft: i
                });
            }
            if ("my" == this.data.__platform) {
                for (var d = a.data.cat, n = !0, p = 0; p < d.length; ++p) if (d[p].id === t.currentTarget.id) {
                    n = !1, p >= 1 ? a.setData({
                        toView: d[p - 1].id
                    }) : a.setData({
                        toView: "0"
                    });
                    break;
                }
                n && a.setData({
                    toView: "0"
                });
            }
            a.setData({
                cid: e,
                page: 1,
                scrollTop: 0,
                emptyGoods: 0,
                goods: [],
                show_loading_bar: 1
            }), getApp().request({
                url: getApp().api.book.list,
                method: "get",
                data: {
                    cid: e
                },
                success: function(t) {
                    if (0 == t.code) {
                        getApp().core.hideLoading();
                        var e = t.data.list;
                        t.data.page_count >= t.data.page ? a.setData({
                            goods: e,
                            page: t.data.page,
                            pageCount: t.data.page_count,
                            show_loading_bar: 0
                        }) : a.setData({
                            emptyGoods: 1
                        });
                    }
                }
            });
        }
    },
    onReachBottom: function(t) {
        var a = this, e = a.data.page, o = a.data.pageCount, s = a.data.cid;
        a.setData({
            show_loading_bar: 1
        }), ++e > o ? a.setData({
            emptyGoods: 1,
            show_loading_bar: 0
        }) : getApp().request({
            url: getApp().api.book.list,
            method: "get",
            data: {
                page: e,
                cid: s
            },
            success: function(t) {
                if (0 == t.code) {
                    var e = a.data.goods;
                    Array.prototype.push.apply(e, t.data.list), a.setData({
                        show_loading_bar: 0,
                        goods: e,
                        page: t.data.page,
                        pageCount: t.data.page_count,
                        emptyGoods: 0
                    });
                }
            }
        });
    }
});