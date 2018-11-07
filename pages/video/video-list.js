var t = getApp(), a = t.api, o = !1, i = !1;

Page({
    data: {
        page: 1,
        video_list: [],
        url: "",
        hide: "hide",
        show: !1,
        animationData: {}
    },
    onLoad: function(a) {
        t.page.onLoad(this, a), this.loadMoreGoodsList(), o = !1, i = !1;
    },
    onReady: function() {},
    onShow: function() {
        t.page.onShow(this);
    },
    onHide: function() {
        t.page.onHide(this);
    },
    onUnload: function() {
        t.page.onUnload(this);
    },
    onPullDownRefresh: function() {},
    loadMoreGoodsList: function() {
        var e = this;
        if (!o) {
            e.setData({
                show_loading_bar: !0
            }), o = !0;
            var n = e.data.page;
            t.request({
                url: a.default.video_list,
                data: {
                    page: n
                },
                success: function(t) {
                    0 == t.data.list.length && (i = !0);
                    var a = e.data.video_list.concat(t.data.list);
                    e.setData({
                        video_list: a,
                        page: n + 1
                    });
                },
                complete: function() {
                    o = !1, e.setData({
                        show_loading_bar: !1
                    });
                }
            });
        }
    },
    play: function(t) {
        var a = t.currentTarget.dataset.index;
        return getApp().core.createVideoContext("video_" + this.data.show_video).pause(), 
        void this.setData({
            show_video: a,
            show: !0
        });
    },
    onReachBottom: function() {
        var t = this;
        i || t.loadMoreGoodsList();
    },
    more: function(t) {
        var a = this, o = t.target.dataset.index, i = a.data.video_list, e = getApp().core.createAnimation({
            duration: 1e3,
            timingFunction: "ease"
        });
        this.animation = e, -1 != i[o].show ? (e.rotate(0).step(), i[o].show = -1, a.setData({
            video_list: i,
            animationData: this.animation.export()
        })) : (e.rotate(0).step(), i[o].show = 0, a.setData({
            video_list: i,
            animationData: this.animation.export()
        }));
    }
});