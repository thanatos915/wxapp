Page({
    data: {
        backgrop: [ "navbar-item-active" ],
        navbarArray: [],
        navbarShowIndexArray: 0,
        navigation: !1,
        windowWidth: 375,
        scrollNavbarLeft: 0,
        currentChannelIndex: 0,
        articlesHide: !1
    },
    onLoad: function(a) {
        getApp().page.onLoad(this, a);
        var t = this, e = a.type;
        void 0 !== e && e && t.setData({
            typeid: e
        }), t.loadTopicList({
            page: 1,
            reload: !0
        }), getApp().core.getSystemInfo({
            success: function(a) {
                t.setData({
                    windowWidth: a.windowWidth
                });
            }
        });
    },
    loadTopicList: function(a) {
        var t = this;
        t.data.is_loading || a.loadmore && !t.data.is_more || (t.setData({
            is_loading: !0
        }), getApp().request({
            url: getApp().api.default.topic_type,
            success: function(e) {
                0 == e.code && t.setData({
                    navbarArray: e.data.list,
                    navbarShowIndexArray: Array.from(Array(e.data.list.length).keys()),
                    navigation: "" != e.data.list
                }), getApp().request({
                    url: getApp().api.default.topic_list,
                    data: {
                        page: a.page
                    },
                    success: function(e) {
                        if (0 == e.code) if (void 0 !== t.data.typeid) {
                            for (var i = 0, r = 0; r < t.data.navbarArray.length && (i += 66, t.data.navbarArray[r].id != t.data.typeid); r++) ;
                            t.setData({
                                scrollNavbarLeft: i
                            }), t.switchChannel(parseInt(t.data.typeid)), t.sortTopic({
                                page: 1,
                                type: t.data.typeid,
                                reload: !0
                            });
                        } else a.reload && t.setData({
                            list: e.data.list,
                            page: a.page,
                            is_more: e.data.list.length > 0
                        }), a.loadmore && t.setData({
                            list: t.data.list.concat(e.data.list),
                            page: a.page,
                            is_more: e.data.list.length > 0
                        });
                    },
                    complete: function() {
                        t.setData({
                            is_loading: !1
                        });
                    }
                });
            }
        }));
    },
    onShow: function() {
        getApp().page.onShow(this);
    },
    onPullDownRefresh: function() {
        getApp().page.onPullDownRefresh(this);
        var a = this.data.currentChannelIndex;
        this.switchChannel(parseInt(a)), this.sortTopic({
            page: 1,
            type: parseInt(a),
            reload: !0
        }), getApp().core.stopPullDownRefresh();
    },
    onReachBottom: function() {
        getApp().page.onReachBottom(this);
        var a = this.data.currentChannelIndex;
        this.switchChannel(parseInt(a)), this.sortTopic({
            page: this.data.page + 1,
            type: parseInt(a),
            loadmore: !0
        });
    },
    onTapNavbar: function(a) {
        var t = this;
        if ("undefined" == typeof my) {
            var e = a.currentTarget.offsetLeft;
            t.setData({
                scrollNavbarLeft: e - 85
            });
        } else {
            var i = t.data.navbarArray, r = !0;
            i.forEach(function(e, n, o) {
                a.currentTarget.id == e.id && (r = !1, n >= 1 ? t.setData({
                    toView: i[n - 1].id
                }) : t.setData({
                    toView: -1
                }));
            }), r && t.setData({
                toView: "0"
            });
        }
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), t.switchChannel(parseInt(a.currentTarget.id)), t.sortTopic({
            page: 1,
            type: a.currentTarget.id,
            reload: !0
        });
    },
    sortTopic: function(a) {
        var t = this;
        getApp().request({
            url: getApp().api.default.topic_list,
            data: a,
            success: function(e) {
                0 == e.code && (a.reload && t.setData({
                    list: e.data.list,
                    page: a.page,
                    is_more: e.data.list.length > 0
                }), a.loadmore && t.setData({
                    list: t.data.list.concat(e.data.list),
                    page: a.page,
                    is_more: e.data.list.length > 0
                }), getApp().core.hideLoading());
            }
        });
    },
    switchChannel: function(a) {
        var t = this.data.navbarArray, e = new Array();
        -1 == a ? e[1] = "navbar-item-active" : 0 == a && (e[0] = "navbar-item-active"), 
        t.forEach(function(t, e, i) {
            t.type = "", t.id == a && (t.type = "navbar-item-active");
        }), this.setData({
            navbarArray: t,
            currentChannelIndex: a,
            backgrop: e
        });
    }
});