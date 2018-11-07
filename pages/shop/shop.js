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
        t.user_id;
        getApp().core.getLocation({
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
    onShow: function() {
        getApp().page.onShow(this);
    },
    loadData: function() {
        var t = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.default.shop_list,
            method: "GET",
            data: {
                longitude: t.data.longitude,
                latitude: t.data.latitude
            },
            success: function(e) {
                0 == e.code && t.setData(e.data);
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    onPullDownRefresh: function() {
        var t = this;
        t.setData({
            keyword: "",
            page: 1
        }), getApp().core.getLocation({
            success: function(e) {
                t.setData({
                    longitude: e.longitude,
                    latitude: e.latitude
                });
            },
            complete: function() {
                t.loadData(), getApp().core.stopPullDownRefresh();
            }
        });
    },
    onReachBottom: function() {
        var t = this;
        t.data.page >= t.data.page_count || t.loadMoreData();
    },
    loadMoreData: function() {
        var e = this, a = e.data.page;
        t || (t = !0, getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.default.shop_list,
            method: "GET",
            data: {
                page: a,
                longitude: e.data.longitude,
                latitude: e.data.latitude
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
        "undefined" != typeof my ? e.location(t) : getApp().core.getSetting({
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
        var e = this.data.list, a = t.currentTarget.dataset.index;
        getApp().core.openLocation({
            latitude: parseFloat(e[a].latitude),
            longitude: parseFloat(e[a].longitude),
            name: e[a].name,
            address: e[a].address
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
            url: getApp().api.default.shop_list,
            method: "GET",
            data: {
                keyword: e.data.keyword,
                longitude: e.data.longitude,
                latitude: e.data.latitude
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
        var e = t.currentTarget.dataset.index, a = this.data.list;
        getApp().core.navigateTo({
            url: "/pages/shop-detail/shop-detail?shop_id=" + a[e].id
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
    onShareAppMessage: function(t) {
        return {
            path: "/pages/shop/shop?user_id=" + getApp().core.getStorageSync(getApp().const.USER_INFO).id
        };
    }
});