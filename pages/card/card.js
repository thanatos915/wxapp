var t = !1;

Page({
    data: {
        page: 1,
        show_qrcode: !1,
        status: 1
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t), t.status && this.setData({
            status: t.status
        }), this.loadData();
    },
    loadData: function() {
        var t = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.user.card,
            data: {
                page: 1,
                status: t.data.status
            },
            success: function(e) {
                0 == e.code && t.setData(e.data);
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    onReachBottom: function() {
        getApp().page.onReachBottom(this), this.data.page != this.data.page_count && this.loadMore();
    },
    loadMore: function() {
        var e = this;
        if (!t) {
            t = !0, getApp().core.showLoading({
                title: "加载中"
            });
            var a = e.data.page;
            getApp().request({
                url: getApp().api.user.card,
                data: {
                    page: a + 1,
                    status: e.data.status
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
                    t = !1, getApp().core.hideLoading();
                }
            });
        }
    },
    getQrcode: function(t) {
        var e = this, a = t.currentTarget.dataset.index, o = e.data.list[a];
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.user.card_qrcode,
            data: {
                user_card_id: o.id
            },
            success: function(t) {
                0 == t.code ? e.setData({
                    show_qrcode: !0,
                    qrcode: t.data.url
                }) : getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1
                });
            },
            complete: function() {
                getApp().core.hideLoading();
            }
        });
    },
    hide: function() {
        this.setData({
            show_qrcode: !1
        });
    },
    goto: function(t) {
        var e = t.currentTarget.dataset.status;
        getApp().core.redirectTo({
            url: "/pages/card/card?status=" + e
        });
    },
    save: function() {
        var t = this;
        getApp().core.saveImageToPhotosAlbum ? (getApp().core.showLoading({
            title: "正在保存图片",
            mask: !1
        }), getApp().core.downloadFile({
            url: t.data.qrcode,
            success: function(e) {
                getApp().core.showLoading({
                    title: "正在保存图片",
                    mask: !1
                }), t.saveImg(e);
            },
            fail: function(e) {
                getApp().core.showModal({
                    title: "下载失败",
                    content: e.errMsg + ";" + t.data.goods_qrcode,
                    showCancel: !1
                });
            },
            complete: function(t) {
                getApp().core.hideLoading();
            }
        })) : getApp().core.showModal({
            title: "提示",
            content: "当前版本过低，无法使用该功能，请升级到最新版本后重试。"
        });
    },
    saveImg: function(t) {
        var e = this;
        getApp().core.saveImageToPhotosAlbum({
            filePath: t.tempFilePath,
            success: function() {
                getApp().core.showModal({
                    title: "提示",
                    content: "保存成功",
                    showCancel: !1
                });
            },
            fail: function(t) {
                getApp().core.getSetting({
                    success: function(a) {
                        a.authSetting["scope.writePhotosAlbum"] || getApp().getauth({
                            content: "小程序需要授权保存到相册",
                            success: function(a) {
                                a && e.saveImg(t);
                            }
                        });
                    }
                });
            },
            complete: function(t) {
                getApp().core.hideLoading();
            }
        });
    }
});