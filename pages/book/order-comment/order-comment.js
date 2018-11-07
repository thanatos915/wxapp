Page({
    data: {
        goods_list: []
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        var e = this;
        e.setData({
            order_id: t.id
        }), getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.book.comment_preview,
            data: {
                order_id: t.id
            },
            success: function(t) {
                if (getApp().core.hideLoading(), 1 == t.code && getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && getApp().core.navigateBack();
                    }
                }), 0 == t.code) {
                    for (var o in t.data.goods_list) t.data.goods_list[o].score = 3, t.data.goods_list[o].content = "", 
                    t.data.goods_list[o].pic_list = [], t.data.goods_list[o].uploaded_pic_list = [];
                    e.setData({
                        goods_list: t.data.goods_list
                    });
                }
            }
        });
    },
    setScore: function(t) {
        var e = this, o = t.currentTarget.dataset.index, a = t.currentTarget.dataset.score, i = e.data.goods_list;
        i[o].score = a, e.setData({
            goods_list: i
        });
    },
    contentInput: function(t) {
        var e = this, o = t.currentTarget.dataset.index;
        e.data.goods_list[o].content = t.detail.value, e.setData({
            goods_list: e.data.goods_list
        });
    },
    chooseImage: function(t) {
        var e = this, o = t.currentTarget.dataset.index, a = e.data.goods_list, i = a[o].pic_list.length;
        getApp().core.chooseImage({
            count: 6 - i,
            success: function(t) {
                a[o].pic_list = a[o].pic_list.concat(t.tempFilePaths), e.setData({
                    goods_list: a
                });
            }
        });
    },
    deleteImage: function(t) {
        var e = this, o = t.currentTarget.dataset.index, a = t.currentTarget.dataset.picIndex, i = e.data.goods_list;
        i[o].pic_list.splice(a, 1), e.setData({
            goods_list: i
        });
    },
    commentSubmit: function(t) {
        function e(t) {
            if (t == i.length) return o();
            var a = 0;
            if (!i[t].pic_list.length || 0 == i[t].pic_list.length) return e(t + 1);
            for (var s in i[t].pic_list) !function(o) {
                getApp().core.uploadFile({
                    url: getApp().api.default.upload_image,
                    name: "image",
                    filePath: i[t].pic_list[o],
                    complete: function(s) {
                        if (s.data) {
                            var n = JSON.parse(s.data);
                            0 == n.code && (i[t].uploaded_pic_list[o] = n.data.url);
                        }
                        if (++a == i[t].pic_list.length) return e(t + 1);
                    }
                });
            }(s);
        }
        function o() {
            getApp().request({
                url: getApp().api.book.submit_comment,
                method: "post",
                data: {
                    order_id: a.data.order_id,
                    goods_list: JSON.stringify(i)
                },
                success: function(t) {
                    getApp().core.hideLoading(), 0 == t.code && getApp().core.showModal({
                        title: "提示",
                        content: t.msg,
                        showCancel: !1,
                        success: function(t) {
                            t.confirm && getApp().core.redirectTo({
                                url: "/pages/book/order/order?status=2"
                            });
                        }
                    }), 1 == t.code && getApp().core.showToast({
                        title: t.msg,
                        image: "/images/icon-warning.png"
                    });
                }
            });
        }
        var a = this;
        getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        });
        var i = a.data.goods_list;
        e(0);
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
    onReachBottom: function(t) {
        getApp().page.onReachBottom(this);
    }
});