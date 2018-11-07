var t;

Page({
    ctx: null,
    data: {
        isStart: !0,
        name: "",
        monitor: "",
        detect: !0,
        type: 5,
        error: "",
        oppty: 0,
        log: [],
        register: !0,
        award_name: !1
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
    },
    onShow: function() {
        getApp().page.onShow(this), getApp().core.showLoading({
            title: "加载中"
        });
        var e = this;
        getApp().request({
            url: getApp().api.scratch.setting,
            success: function(t) {
                var a = t.data.setting;
                a.title && getApp().core.setNavigationBarTitle({
                    title: a.title
                }), e.setData({
                    title: a.title,
                    deplete_register: a.deplete_register,
                    register: null == a.deplete_register || 0 == a.deplete_register
                }), getApp().request({
                    url: getApp().api.scratch.index,
                    success: function(t) {
                        if (0 == t.code) {
                            e.init();
                            var a = t.data.list, i = e.setName(a);
                            console.log("name=>" + i), e.setData({
                                name: i,
                                oppty: t.data.oppty,
                                id: a.id,
                                type: a.type
                            });
                        } else e.setData({
                            error: t.msg,
                            isStart: !0,
                            oppty: t.data.oppty
                        });
                    },
                    complete: function(t) {
                        getApp().core.hideLoading();
                    }
                });
            }
        }), e.prizeLog(), t = setInterval(function() {
            e.prizeLog();
        }, 1e4);
    },
    prizeLog: function() {
        var t = this;
        getApp().request({
            url: getApp().api.scratch.log,
            success: function(e) {
                0 == e.code && t.setData({
                    log: e.data
                });
            }
        });
    },
    register: function() {
        this.data.error ? getApp().core.showModal({
            title: "提示",
            content: this.data.error,
            showCancel: !1
        }) : (this.setData({
            register: !0
        }), this.init());
    },
    init: function() {
        var t = getApp().core.createSelectorQuery(), e = this;
        e.setData({
            award_name: !1
        }), t.select("#frame").boundingClientRect(), t.exec(function(t) {
            var a = t[0].width, i = t[0].height;
            e.setData({
                r: 16,
                lastX: "",
                lastY: "",
                minX: "",
                minY: "",
                maxX: "",
                maxY: "",
                canvasWidth: a,
                canvasHeight: i
            });
            var s = getApp().core.createCanvasContext("scratch");
            s.drawImage("/scratch/images/scratch_hide_2.png", 0, 0, a, i), e.ctx = s, "undefined" == typeof my ? (console.log(111), 
            s.draw(!1, function(t) {
                e.setData({
                    register: !0,
                    award_name: !0
                });
            })) : s.draw(!0), e.setData({
                isStart: !0,
                isScroll: !0
            });
        });
    },
    onReady: function() {
        "undefined" != typeof my && this.init();
    },
    onStart: function() {
        this.setData({
            register: null == this.data.deplete_register || 0 == this.data.deplete_register,
            name: this.data.monitor,
            isStart: !0,
            award: !1,
            award_name: !1
        }), this.init();
    },
    drawRect: function(t, e) {
        var a = this.data.r / 2, i = t - a > 0 ? t - a : 0, s = e - a > 0 ? e - a : 0;
        return "" !== this.data.minX ? this.setData({
            minX: this.data.minX > i ? i : this.data.minX,
            minY: this.data.minY > s ? s : this.data.minY,
            maxX: this.data.maxX > i ? this.data.maxX : i,
            maxY: this.data.maxY > s ? this.data.maxY : s
        }) : this.setData({
            minX: i,
            minY: s,
            maxX: i,
            maxY: s
        }), this.setData({
            lastX: i,
            lastY: s
        }), [ i, s, 2 * a ];
    },
    clearArc: function(t, e, a) {
        var i = this.data.r, s = this.ctx, o = i - a, r = Math.sqrt(i * i - o * o), c = t - o, n = e - r, d = 2 * o, p = 2 * r;
        a <= i && (s.clearRect(c, n, d, p), a += 1, this.clearArc(t, e, a));
    },
    touchStart: function(t) {
        if (this.setData({
            award_name: !0
        }), this.data.isStart) if (this.data.error) getApp().core.showModal({
            title: "提示",
            content: this.data.error,
            showCancel: !1
        }); else ;
    },
    touchMove: function(t) {
        if (this.data.isStart && !this.data.error) {
            this.drawRect(t.touches[0].x, t.touches[0].y), this.clearArc(t.touches[0].x, t.touches[0].y, 1), 
            this.ctx.draw(!0);
        }
    },
    touchEnd: function(t) {
        if (this.data.isStart && !this.data.error) {
            var e = this, a = this.data.canvasWidth, i = this.data.canvasHeight, s = this.data.minX, o = this.data.minY, r = this.data.maxX, c = this.data.maxY;
            r - s > .4 * a && c - o > .4 * i && this.data.detect && (e.setData({
                detect: !1
            }), getApp().request({
                url: getApp().api.scratch.receive,
                data: {
                    id: e.data.id
                },
                success: function(t) {
                    if (0 == t.code) {
                        e.setData({
                            award: 5 != e.data.type,
                            isStart: !1,
                            isScroll: !0
                        }), e.ctx.draw();
                        var a = t.data.list;
                        t.data.oppty <= 0 || "" == a ? e.setData({
                            monitor: "谢谢参与",
                            error: t.msg ? t.msg : "机会已用完",
                            detect: !0,
                            type: 5,
                            oppty: t.data.oppty
                        }) : e.setData({
                            monitor: e.setName(a),
                            id: a.id,
                            detect: !0,
                            type: a.type,
                            oppty: t.data.oppty
                        });
                    } else getApp().core.showModal({
                        title: "提示",
                        content: t.msg ? t.msg : "网络异常，请稍后重试",
                        showCancel: !1
                    }), e.setData({
                        monitor: "谢谢参与",
                        detect: !0
                    }), e.onStart();
                }
            }));
        }
    },
    setName: function(t) {
        var e = "";
        switch (t.type) {
          case 1:
            e = t.price + "元红包";
            break;

          case 2:
            e = t.coupon;
            break;

          case 3:
            e = t.num + "积分";
            break;

          case 4:
            e = t.gift;
            break;

          default:
            e = "谢谢参与";
        }
        return e;
    },
    onShareAppMessage: function() {
        return getApp().page.onShareAppMessage(this), {
            path: "/scratch/index/index?user_id=" + getApp().getUser().id,
            title: this.data.title ? this.data.title : "刮刮卡"
        };
    },
    onHide: function() {
        getApp().page.onHide(this), clearInterval(t);
    },
    onUnload: function() {
        getApp().page.onUnload(this), clearInterval(t);
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
            url: getApp().api.scratch.qrcode,
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
    },
    goodsQrcodeClose: function() {
        this.setData({
            goods_qrcode_active: "",
            no_scroll: !1
        });
    }
});