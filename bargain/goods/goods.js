var e = getApp(), t = getApp().api, i = getApp().helper, a = "", o = null, n = require("../../wxParse/wxParse.js"), s = null, r = null, d = !1;

Page({
    data: {
        hide: "hide",
        time_list: {
            day: 0,
            hour: "00",
            minute: "00",
            second: "00"
        },
        p: 1,
        user_index: 0,
        show_content: !1
    },
    onLoad: function(t) {
        if (getApp().page.onLoad(this, t), "undefined" == typeof my) {
            var a = decodeURIComponent(t.scene);
            if (void 0 !== a) {
                var o = i.scene_decode(a);
                o.gid && (t.goods_id = o.gid);
            }
        } else if (null !== e.query) {
            var n = e.query;
            e.query = null, t.goods_id = n.gid;
        }
        this.getGoods(t.goods_id);
    },
    getGoods: function(e) {
        var t = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.bargain.goods,
            data: {
                goods_id: e,
                page: 1
            },
            success: function(e) {
                if (0 == e.code) {
                    var i = e.data.goods.detail;
                    n.wxParse("detail", "html", i, t), t.setData(e.data), t.setData({
                        reset_time: t.data.goods.reset_time,
                        time_list: t.setTimeList(e.data.goods.reset_time),
                        p: 1,
                        foreshow_time: t.data.goods.foreshow_time,
                        foreshow_time_list: t.setTimeList(t.data.goods.foreshow_time)
                    }), t.setTimeOver(), e.data.bargain_info && t.getUserTime();
                } else getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function(e) {
                        e.confirm && getApp().core.navigateBack({
                            delta: -1
                        });
                    }
                });
            },
            complete: function(e) {
                getApp().core.hideLoading();
            }
        });
    },
    onReady: function() {
        e.page.onReady(this);
    },
    onShow: function() {
        e.page.onShow(this);
    },
    onHide: function() {
        e.page.onHide(this);
    },
    onUnload: function() {
        e.page.onUnload(this), clearInterval(o), o = null, clearInterval(s), s = null, clearInterval(r), 
        r = null;
    },
    play: function(e) {
        var t = e.target.dataset.url;
        this.setData({
            url: t,
            hide: "",
            show: !0
        }), (a = getApp().core.createVideoContext("video")).play();
    },
    close: function(e) {
        if ("video" == e.target.id) return !0;
        this.setData({
            hide: "hide",
            show: !1
        }), a.pause();
    },
    onGoodsImageClick: function(e) {
        var t = this, i = [], a = e.currentTarget.dataset.index;
        for (var o in t.data.goods.pic_list) i.push(t.data.goods.pic_list[o].pic_url);
        getApp().core.previewImage({
            urls: i,
            current: i[a]
        });
    },
    hide: function(e) {
        0 == e.detail.current ? this.setData({
            img_hide: ""
        }) : this.setData({
            img_hide: "hide"
        });
    },
    setTimeOver: function() {
        var e = this;
        o = setInterval(function() {
            e.data.resset_time <= 0 && clearInterval(o);
            var t = e.data.reset_time - 1, i = e.setTimeList(t), a = e.data.foreshow_time - 1, n = e.setTimeList(a);
            e.setData({
                reset_time: t,
                time_list: i,
                foreshow_time: a,
                foreshow_time_list: n
            });
        }, 1e3);
    },
    orderSubmit: function() {
        var e = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.bargain.bargain_submit,
            method: "POST",
            data: {
                goods_id: e.data.goods.id
            },
            success: function(t) {
                0 == t.code ? getApp().core.redirectTo({
                    url: "/bargain/activity/activity?order_id=" + t.data.order_id
                }) : e.showToast({
                    title: t.msg
                });
            },
            complete: function(e) {
                getApp().core.hideLoading();
            }
        });
    },
    buyNow: function() {
        var e = [], t = [], i = this.data.bargain_info;
        i && (t.push({
            bargain_order_id: i.order_id
        }), e.push({
            mch_id: 0,
            goods_list: t
        }), getApp().core.redirectTo({
            url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(e)
        }));
    },
    getUserTime: function() {
        var e = this;
        s = setInterval(function() {
            e.loadData();
        }, 1e3), r = setInterval(function() {
            var t = e.data.user_index;
            e.data.bargain_info.bargain_info.length - t > 3 ? t += 3 : t = 0, e.setData({
                user_index: t
            });
        }, 3e3);
    },
    loadData: function() {
        var i = this, a = i.data.p;
        d || (d = !0, e.request({
            url: t.bargain.goods_user,
            data: {
                page: a + 1,
                goods_id: i.data.goods.id
            },
            success: function(e) {
                if (0 == e.code) {
                    var t = i.data.bargain_info.bargain_info, o = e.data.bargain_info;
                    0 == o.bargain_info.length && (clearInterval(s), s = null), o.bargain_info = t.concat(o.bargain_info), 
                    i.setData({
                        bargain_info: o,
                        p: a + 1
                    });
                } else i.showToast({
                    title: e.msg
                });
            },
            complete: function() {
                d = !1;
            }
        }));
    },
    contentClose: function() {
        this.setData({
            show_content: !1
        });
    },
    contentOpen: function() {
        this.setData({
            show_content: !0
        });
    },
    onShareAppMessage: function() {
        var e = this;
        return {
            path: "/bargain/list/list?goods_id=" + e.data.goods.id + "&user_id=" + e.data.__user_info.id,
            success: function(e) {}
        };
    }
});