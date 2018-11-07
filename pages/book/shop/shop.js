require("../../../utils/helper.js");

var t = !1;

Page({
    data: {
        page: 1,
        page_count: 1,
        longitude: "",
        latitude: "",
        score: [ 1, 2, 3, 4, 5 ],
        keyword: ""
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        var e = this;
        e.setData({
            ids: t.ids
        }), getApp().core.getLocation({
            success: function(t) {
                e.setData({
                    longitude: t.longitude,
                    latitude: t.latitude
                });
            },
            complete: function() {
                e.loadData();
            }
        });
    },
    onReady: function(t) {
        getApp().page.onReady(this);
    },
    onShow: function(t) {
        getApp().page.onShow(this);
    },
    loadData: function() {
        var t = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.book.shop_list,
            method: "GET",
            data: {
                longitude: t.data.longitude,
                latitude: t.data.latitude,
                ids: t.data.ids
            },
            success: function(e) {
                0 == e.code && t.setData(e.data);
            },
            fail: function(t) {},
            complete: function() {
                getApp().core.hideLoading();
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
        var e = this;
        e.setData({
            keyword: "",
            page: 1
        }), getApp().core.getLocation({
            success: function(t) {
                e.setData({
                    longitude: t.longitude,
                    latitude: t.latitude
                });
            },
            complete: function() {
                e.loadData(), getApp().core.stopPullDownRefresh();
            }
        });
    },
    onReachBottom: function(t) {
        getApp().page.onReachBottom(this);
        var e = this;
        e.data.page >= e.data.page_count || e.loadMoreData();
    },
    loadMoreData: function() {
        var e = this, a = e.data.page;
        t || (t = !0, getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.book.shop_list,
            method: "GET",
            data: {
                page: a,
                longitude: e.data.longitude,
                latitude: e.data.latitude,
                ids: e.data.ids
            },
            success: function(t) {
                if (0 == t.code) {
                    var o = e.data.list.concat(t.data.list);
                    e.setData({
                        list: o,
                        page_count: t.data.page_count,
                        row_count: t.data.row_count,
                        page: a + 1
                    });
                }
            },
            complete: function() {
                getApp().core.hideLoading(), t = !1;
            }
        }));
    },
    goto: function(t) {
        var e = this;
        getApp().core.getSetting({
            success: function(a) {
                a.authSetting["scope.userLocation"] ? e.location(t) : getApp().getauth({
                    content: "需要获取您的地理位置授权，请到小程序设置中打开授权！",
                    cancel: !1,
                    success: function(a) {
                        a.authSetting["scope.userLocation"] && e.location(t);
                    }
                });
            }
        });
    },
    location: function(t) {
        var e = this, a = t.currentTarget.dataset.index, o = e.data.list;
        getApp().core.openLocation({
            latitude: parseFloat(o[a].latitude),
            longitude: parseFloat(o[a].longitude),
            name: o[a].name,
            address: o[a].address
        });
    },
    inputFocus: function(t) {
        this.setData({
            show: !0
        });
    },
    inputBlur: function(t) {
        this.setData({
            show: !1
        });
    },
    inputConfirm: function(t) {
        this.search();
    },
    input: function(t) {
        this.setData({
            keyword: t.detail.value
        });
    },
    search: function(t) {
        var e = this;
        getApp().core.showLoading({
            title: "搜索中"
        }), getApp().request({
            url: getApp().api.book.shop_list,
            method: "GET",
            data: {
                keyword: e.data.keyword,
                longitude: e.data.longitude,
                latitude: e.data.latitude,
                ids: e.data.ids
            },
            success: function(t) {
                0 == t.code && e.setData(t.data);
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    go: function(t) {
        var e = this, a = t.currentTarget.dataset.index, o = e.data.list;
        getApp().core.navigateTo({
            url: "/pages/shop-detail/shop-detail?shop_id=" + o[a].id
        });
    },
    navigatorClick: function(t) {
        var e = t.currentTarget.dataset.open_type, a = t.currentTarget.dataset.url;
        return "wxapp" != e || (a = function(t) {
            var e = /([^&=]+)=([\w\W]*?)(&|$|#)/g, a = /^[^\?]+\?([\w\W]+)$/.exec(t), o = {};
            if (a && a[1]) for (var n, i = a[1]; null != (n = e.exec(i)); ) o[n[1]] = n[2];
            return o;
        }(a), a.path = a.path ? decodeURIComponent(a.path) : "", getApp().core.navigateToMiniProgram({
            appId: a.appId,
            path: a.path,
            complete: function(t) {}
        }), !1);
    },
    onShareAppMessage: function(t) {}
});