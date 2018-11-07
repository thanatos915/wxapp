var t, e, a;

Page({
    data: {
        circleList: [],
        awardList: [],
        colorCircleFirst: "#F12416",
        colorCircleSecond: "#FFFFFF",
        colorAwardDefault: "#F5F0FC",
        colorAwardSelect: "#ffe400",
        indexSelect: 0,
        isRunning: !1,
        prize: !1,
        close: !1,
        lottert: 0,
        animationData: "",
        time: !1,
        title: ""
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        var e = this;
        getApp().request({
            url: getApp().api.pond.setting,
            success: function(t) {
                if (0 == t.code) {
                    var a = t.data.title;
                    a && (getApp().core.setNavigationBarTitle({
                        title: a
                    }), e.setData({
                        title: a
                    }));
                }
            }
        });
    },
    onShow: function() {
        getApp().page.onShow(this);
        var t = this;
        getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.pond.index,
            success: function(e) {
                t.setData(e.data);
                for (var a = e.data.list, o = 18, i = 18, n = 0; n < 8; n++) 0 == n ? (o = 18, i = 18) : n < 3 ? (o = o, 
                i = i + 196 + 8) : n < 5 ? (i = i, o = o + 158 + 8) : n < 7 ? (i = i - 196 - 8, 
                o = o) : n < 8 && (i = i, o = o - 158 - 8), a[n].topAward = o, a[n].leftAward = i;
                t.setData({
                    awardList: a
                });
            },
            complete: function(a) {
                getApp().core.hideLoading();
                for (var o = 4, i = 4, n = [], s = 0; s < 24; s++) {
                    if (0 == s) i = 8, o = 8; else if (s < 6) i = 4, o += 110; else if (6 == s) i = 8, 
                    o = 660; else if (s < 12) i += 92, o = 663; else if (12 == s) i = 545, o = 660; else if (s < 18) i = 550, 
                    o -= 110; else if (18 == s) i = 545, o = 10; else {
                        if (!(s < 24)) return;
                        i -= 92, o = 5;
                    }
                    n.push({
                        topCircle: i,
                        leftCircle: o
                    });
                }
                t.setData({
                    circleList: n
                }), e = setInterval(function() {
                    "#FFFFFF" == t.data.colorCircleFirst ? t.setData({
                        colorCircleFirst: "#F12416",
                        colorCircleSecond: "#FFFFFF"
                    }) : t.setData({
                        colorCircleFirst: "#FFFFFF",
                        colorCircleSecond: "#F12416"
                    });
                }, 900), t.pond_animation();
            }
        });
    },
    startGame: function() {
        var e = this;
        if (!e.data.isRunning) {
            var o = "";
            if (0 == e.data.oppty && (o = "抽奖机会不足"), e.data.integral || (o = "积分不足"), e.data.time || (o = "活动未开始或已经结束"), 
            o) getApp().core.showModal({
                title: "很抱歉",
                content: o,
                showCancel: !1,
                success: function(t) {
                    t.confirm && e.setData({
                        isRunning: !1
                    });
                }
            }); else {
                clearInterval(t), a.translate(0, 0).step(), e.setData({
                    animationData: a.export(),
                    isRunning: !0,
                    lottert: 0
                });
                var i = e.data.indexSelect, n = 0, s = e.data.awardList, r = setInterval(function() {
                    if (i++, i %= 8, n += 30, e.setData({
                        indexSelect: i
                    }), e.data.lottert > 0 && i + 1 == e.data.lottert) {
                        if (clearInterval(r), e.pond_animation(), 5 == s[i].type) t = 1; else var t = 2;
                        e.setData({
                            isRunning: !1,
                            name: s[i].name,
                            num: s[i].id,
                            prize: t
                        });
                    }
                }, 200 + n);
                getApp().request({
                    url: getApp().api.pond.lottery,
                    success: function(t) {
                        if (1 == t.code) return clearInterval(r), getApp().core.showModal({
                            title: "很抱歉",
                            content: t.msg ? t.msg : "网络错误",
                            showCancel: !1,
                            success: function(t) {
                                t.confirm && _this.setData({
                                    isRunning: !1
                                });
                            }
                        }), void e.pond_animation();
                        "积分不足" == t.msg && e.setData({
                            integral: !1
                        });
                        var a = t.data.id;
                        s.forEach(function(o, i, n) {
                            o.id == a && setTimeout(function() {
                                e.setData({
                                    lottert: i + 1,
                                    oppty: t.data.oppty
                                });
                            }, 2e3);
                        });
                    }
                });
            }
        }
    },
    pondClose: function() {
        this.setData({
            prize: !1
        });
    },
    pond_animation: function() {
        var e = this;
        a = getApp().core.createAnimation({
            duration: 500,
            timingFunction: "step-start",
            delay: 0,
            transformOrigin: "50% 50%"
        });
        var o = !0;
        t = setInterval(function() {
            o ? (a.translate(0, 0).step(), o = !1) : (a.translate(0, -3).step(), o = !0), e.setData({
                animationData: a.export()
            });
        }, 900);
    },
    onHide: function() {
        getApp().page.onHide(this), clearInterval(e), clearInterval(t);
    },
    onShareAppMessage: function() {
        return getApp().page.onShareAppMessage(this), {
            path: "/pond/pond/pond?user_id=" + getApp().getUser().id,
            title: this.data.title ? this.data.title : "九宫格抽奖"
        };
    },
    showShareModal: function() {
        this.setData({
            share_modal_active: "active"
        });
    },
    shareModalClose: function() {
        this.setData({
            share_modal_active: ""
        });
    },
    getGoodsQrcode: function() {
        var t = this;
        if (t.setData({
            qrcode_active: "active",
            share_modal_active: ""
        }), t.data.goods_qrcode) return !0;
        getApp().request({
            url: getApp().api.pond.qrcode,
            success: function(e) {
                0 == e.code && t.setData({
                    goods_qrcode: e.data.pic_url
                }), 1 == e.code && (t.goodsQrcodeClose(), getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm;
                    }
                }));
            }
        });
    },
    qrcodeClick: function(t) {
        var e = t.currentTarget.dataset.src;
        getApp().core.previewImage({
            urls: [ e ]
        });
    },
    qrcodeClose: function() {
        this.setData({
            qrcode_active: ""
        });
    },
    saveQrcode: function() {
        var t = this;
        getApp().core.saveImageToPhotosAlbum ? (getApp().core.showLoading({
            title: "正在保存图片",
            mask: !1
        }), getApp().core.downloadFile({
            url: t.data.goods_qrcode,
            success: function(t) {
                getApp().core.showLoading({
                    title: "正在保存图片",
                    mask: !1
                }), getApp().core.saveImageToPhotosAlbum({
                    filePath: t.tempFilePath,
                    success: function() {
                        getApp().core.showModal({
                            title: "提示",
                            content: "商品海报保存成功",
                            showCancel: !1
                        });
                    },
                    fail: function(t) {
                        getApp().core.showModal({
                            title: "图片保存失败",
                            content: t.errMsg,
                            showCancel: !1
                        });
                    },
                    complete: function(t) {
                        getApp().core.hideLoading();
                    }
                });
            },
            fail: function(e) {
                getApp().core.showModal({
                    title: "图片下载失败",
                    content: e.errMsg + ";" + t.data.goods_qrcode,
                    showCancel: !1
                });
            },
            complete: function(t) {
                getApp().core.hideLoading();
            }
        })) : getApp().core.showModal({
            title: "提示",
            content: "当前版本过低，无法使用该功能，请升级到最新版本后重试。",
            showCancel: !1
        });
    }
});