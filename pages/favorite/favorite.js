Page({
    data: {
        swiper_current: 0,
        goods: {
            list: null,
            is_more: !0,
            is_loading: !1,
            page: 1
        },
        topic: {
            list: null,
            is_more: !0,
            is_loading: !1,
            page: 1
        }
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t), this.loadGoodsList({
            reload: !0,
            page: 1
        }), this.loadTopicList({
            reload: !0,
            page: 1
        });
    },
    tabSwitch: function(t) {
        var a = this, o = t.currentTarget.dataset.index;
        a.setData({
            swiper_current: o
        });
    },
    swiperChange: function(t) {
        this.setData({
            swiper_current: t.detail.current
        });
    },
    loadGoodsList: function(t) {
        var a = this;
        a.data.goods.is_loading || t.loadmore && !a.data.goods.is_more || (a.data.goods.is_loading = !0, 
        a.setData({
            goods: a.data.goods
        }), getApp().request({
            url: getApp().api.user.favorite_list,
            data: {
                page: t.page
            },
            success: function(o) {
                0 == o.code && (t.reload && (a.data.goods.list = o.data.list), t.loadmore && (a.data.goods.list = a.data.goods.list.concat(o.data.list)), 
                a.data.goods.page = t.page, a.data.goods.is_more = o.data.list.length > 0, a.setData({
                    goods: a.data.goods
                }));
            },
            complete: function() {
                a.data.goods.is_loading = !1, a.setData({
                    goods: a.data.goods
                });
            }
        }));
    },
    goodsScrollBottom: function() {
        var t = this;
        t.loadGoodsList({
            loadmore: !0,
            page: t.data.goods.page + 1
        });
    },
    loadTopicList: function(t) {
        var a = this;
        a.data.topic.is_loading || t.loadmore && !a.data.topic.is_more || (a.data.topic.is_loading = !0, 
        a.setData({
            topic: a.data.topic
        }), getApp().request({
            url: getApp().api.user.topic_favorite_list,
            data: {
                page: t.page
            },
            success: function(o) {
                0 == o.code && (t.reload && (a.data.topic.list = o.data.list), t.loadmore && (a.data.topic.list = a.data.topic.list.concat(o.data.list)), 
                a.data.topic.page = t.page, a.data.topic.is_more = o.data.list.length > 0, a.setData({
                    topic: a.data.topic
                }));
            },
            complete: function() {
                a.data.topic.is_loading = !1, a.setData({
                    topic: a.data.topic
                });
            }
        }));
    },
    topicScrollBottom: function() {
        var t = this;
        t.loadTopicList({
            loadmore: !0,
            page: t.data.topic.page + 1
        });
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
    onReachBottom: function(t) {
        getApp().page.onReachBottom(this), this.loadMoreGoodsList();
    }
});