var t = require("../../../utils/helper.js"), a = require("../../../components/quick-navigation/quick-navigation.js"),
    e = require("../../../components/goods/goods_banner.js"),
    o = require("../../../components/goods/specifications_model.js"), i = require("../../../wxParse/wxParse.js"), s = 1,
    r = !1, n = !0, d = 0;
let ctx = null;
Page({
    data: {
        pageType: "dingshi",
        order: -1,
        id: null,
        goods: {},
        show_attr_picker: !1,
        form: {
            number: 1
        },
        tab_detail: "active",
        tab_comment: "",
        comment_list: [],
        comment_count: {
            score_all: 0,
            score_3: 0,
            score_2: 0,
            score_1: 0
        },
        autoplay: !1,
        hide: "hide",
        show: !1,
        x: getApp().core.getSystemInfoSync().windowWidth,
        y: getApp().core.getSystemInfoSync().windowHeight - 20,
        dingshi_end_time_over: {
            h: "--",
            m: "--",
            s: "--",
            type: 0
        },
        NEW_WIDTH: 375,
        NEW_HEIGHT: 574,
        WIDTH: 375,
        HEIGHT: 574,
        windowWidth: 0,
        windowHeight: 0,
        loaded: false,
        productDetail: {
            imageUrl: 'http://zs.qdvmai.com/web/uploads/image/store_1/10de99cc795c988828ecb3f7a7ab46c622c3d0a7.jpg'
        },
        cardCreateImgUrl: ''
    },
    onLoad: function (e) {
        getApp().page.onLoad(this, e), d = 0, s = 1, r = !1, n = !0, a.init(this);
        // 处理分享大小
        // console.log((this.data.x * 0.8).toString() + 'rpx');
        this.setData({
            shareY: (this.data.x * 0.8 - 54).toString() + 'px'
        });
        var o = e.user_id, i = decodeURIComponent(e.scene), c = 0;
        if (void 0 !== o) o; else if ("undefined" == typeof my) {
            if (void 0 !== e.scene) {
                c = 1;
                var i = decodeURIComponent(e.scene), p = t.scene_decode(i);
                p.uid && p.gid ? (p.uid, e.id = p.gid) : i;
            }
        } else if (null !== getApp().query) {
            c = 1;
            var g = getApp().query;
            getApp().query = null, e.id = g.gid;
        }
        var u = this;
        u.setData({
            // id: e.id,
            scene_type: c,
            goods_id: e.goods_id
        }), u.getGoods(), u.getRecordList();
    },
    draw() {
        var a = this;
        // wx.showLoading({
        //     title: '图片加载中...',
        // });
        var {
            WIDTH,
            HEIGHT,
            productDetail
        } = this.data;
        productDetail.imageUrl = a.data.goods.pic_list[0];
        var ctx = wx.createCanvasContext('myCanvas');

        // 为了显示canvas的边框阴影 宽高都加了40px 然后进行移动位置 20 20
        // ctx.translate(20, 20);

        // 画白色背景
        ctx.save();
        ctx.setFillStyle('#fff');
        ctx.setShadow(0, 0, 15, 'rgba(4, 0, 0, 0.3)');
        ctx.fillRect(0, 0, WIDTH, HEIGHT + 60);
        ctx.restore();

        var base64 = '';
        // 获取图片信息
        wxp.getImageInfo({
            src: productDetail.imageUrl,
            // complete(res) {
            //     console.log(res);
            // },
            complete(res) {
                const scale1 = res.width / res.height;
                const scale2 = WIDTH / res.width;
                let drawW = 0,
                    drawH = 0,
                    drawH_total = 0,
                    mt = 0,
                    ml = 0;

                drawW = WIDTH;
                drawH = res.height * scale2;
                drawH_total = drawH +60;


                ctx.save();
                ctx.beginPath();
                ctx.strokeStyle = "rgba(0,0,0,0)";
                ctx.rect(0, 0, drawW, drawH_total);
                ctx.closePath();
                ctx.stroke();
                ctx.clip();
                ctx.drawImage(res.path, 0, 0, drawW, drawH);
                ctx.restore();

                // 画渐变
                let gradient = ctx.createLinearGradient(0, 0, 633, 0);
                gradient.addColorStop(0, "#ff4544");
                gradient.addColorStop(1, "#ffd88d");
                ctx.fillStyle = gradient;         //设置fillStyle为当前的渐变对象
                ctx.fillRect(0, drawH, drawW, 60);      //绘制渐变图形
                ctx.stroke();

                // 画日期前面的圆
                // ctx.save();
                // ctx.beginPath();
                // ctx.arc(WIDTH - 210, 991 + 14, 10, 0, 2 * Math.PI);
                // ctx.closePath();
                // ctx.setFillStyle('#FFDC00');
                // ctx.fill();
                // ctx.restore();

                ctx.save();
                ctx.font = 'normal 25px arial';
                ctx.fillStyle = '#1D1D1D';
                ctx.textBaseline = 'top';
                ctx.textAlign = 'right';
                ctx.fillText('团购价:￥' + a.data.goods.price, 180, drawH_total - 40);
                ctx.restore();

                ctx.save();
                ctx.font = 'normal 25px arial';
                ctx.fillStyle = '#1D1D1D';
                ctx.textBaseline = 'top';
                ctx.textAlign = 'right';
                ctx.textDecoration = 'line-through';
                ctx.fillText('市场价:￥' + a.data.goods.original_price, 320, drawH_total - 40);
                ctx.restore();

                ctx.draw(false, () => {
                    wx.canvasGetImageData({
                        canvasId: 'myCanvas',
                        x: 0,
                        y: 0,
                        width: drawW,
                        height: drawH_total,
                        success(res) {
                            // 3. png编码
                            let pngData = upng.encode([res.data.buffer], res.width, res.height);
                            // 4. base64编码
                            base64 = wx.arrayBufferToBase64(pngData);
                            console.log(base64);
                            // 保存临时图片
                            getApp().request({
                                url: getApp().api.dingshi.share,
                                method: 'POST',
                                data: {goods_id: a.data.goods_id, img: base64},
                                success(res) {
                                    getApp().core.hideLoading();
                                    if (res.code == 0) {
                                        a.setData({
                                            cardCreateImgUrl: res.data.path
                                        });
                                    }
                                }
                            });
                            // a.setData({
                            //     base64Img: base64
                            // });
                        }
                    })

                    // 生成图片
                    // wxp.canvasToTempFilePath({
                    //     canvasId: 'myCanvas',
                    //     complete(res) {
                    //         console.log(res);
                    //         a.setData({
                    //             cardCreateImgUrl: res.tempFilePath
                    //         });
                    //     }
                    // });
                });
            }
        });
    },
    bindload() {
        this.setData({loaded: true});
        wx.hideLoading();
    },

    saveImgBefore() {
        // 查看用户是否有保存相册的权限
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.writePhotosAlbum'] === false) {
                    this.openConfirm();
                } else {
                    this.saveImg();
                }
            }
        });
    },
    openConfirm() {
        wx.showModal({
            content: '检测到您没打开保存相册权限，是否去设置打开？',
            success: res => {
                if (res.confirm) {
                    wx.openSetting({
                        success: res => {
                            if (res.authSetting['scope.writePhotosAlbum']) {
                                this.saveImg();
                            }
                        }
                    });
                }
            }
        });
    },
    saveImg() {
        const {
            cardCreateImgUrl,
        } = this.data;

        // 画上logo 会有裁剪的现象
        wx.showLoading({
            title: '保存中...',
            mask: true
        });
        wx.saveImageToPhotosAlbum({
            filePath: cardCreateImgUrl,
            success() {
                wx.showToast({
                    title: '保存成功！',
                    icon: 'success'
                });
            },
            fail(err) {
                wx.hideLoading();
            }
        });
    },
    /**
     * @desc 获取当前日期
     */
    getToday() {
        const date = new Date();
        const zeroize = n => n < 10 ? `0${n}` : n;
        return `${date.getFullYear()}-${zeroize(date.getMonth() + 1)}-${zeroize(date.getDate())}`;
    },
    /**
     * @desc 获取裁剪后的字符串
     */
    getSub(str = '', max = 1) {
        return str.length > max ? `${str.substr(0, max)}...` : str;
    },
    getGoods: function () {
        var t = this, a = {};
        t.data.goods_id && (a.goods_id = t.data.goods_id),
            a.scene_type = t.data.scene_type, getApp().request({
            url: getApp().api.dingshi.details,
            data: a,
            success: function (a) {
                if (0 == a.code) {
                    var e = a.data.detail;
                    i.wxParse("detail", "html", e, t);
                    var o = a.data, s = [];
                    for (var r in o.pic_list) s.push(o.pic_list[r].pic_url);
                    o.pic_list = s, t.setData({
                        goods: o,
                        attr_group_list: a.data.attr_group_list,
                        dingshi_data: a.data.dingshi.dingshi_data
                    }), 1 == t.data.scene_type && t.setData({
                        id: a.data.dingshi.dingshi_goods_id
                    }), t.data.goods.dingshi && t.setdingshiTimeOver(), t.selectDefaultAttr();
                }
                1 == a.code && getApp().core.showModal({
                    title: "提示",
                    content: a.msg,
                    showCancel: !1,
                    success: function (t) {
                        t.confirm && getApp().core.redirectTo({
                            url: "/pages/index/index"
                        });
                    }
                });
            }
        });
    },
    selectDefaultAttr: function () {
        var t = this;
        if (t.data.goods && 0 === t.data.goods.use_attr) {
            for (var a in t.data.attr_group_list) for (var e in t.data.attr_group_list[a].attr_list) 0 == a && 0 == e && (t.data.attr_group_list[a].attr_list[e].checked = !0);
            t.setData({
                attr_group_list: t.data.attr_group_list
            });
        }
    },
    // getCommentList: function(t) {
    //     var a = this;
    //     t && "active" != a.data.tab_comment || r || n && (r = !0, getApp().request({
    //         url: getApp().api.dingshi.comment_list,
    //         data: {
    //             goods_id: a.data.id,
    //             page: s
    //         },
    //         success: function(e) {
    //             0 == e.code && (r = !1, s++, a.setData({
    //                 comment_count: e.data.cgoods_omment_count,
    //                 comment_list: t ? a.data.comment_list.concat(e.data.list) : e.data.list
    //             }), 0 == e.data.list.length && (n = !1));
    //         }
    //     }));
    // },
    getRecordList: function (t) {
        var a = this;
        t || r || n && (r = !0, getApp().request({
            url: getApp().api.dingshi.record_list,
            data: {
                goods_id: a.data.goods_id,
                page: s
            },
            success: function (e) {
                0 == e.code && (r = !1, s++, a.setData({
                    record_count: e.data.row_count,
                    record_list: t ? a.data.record_list.concat(e.data.list) : e.data.list
                }), 0 == e.data.list.length && (n = !1));
            }
        }));
    },
    numberSub: function () {
        var t = this, a = t.data.form.number;
        if (a <= 1) return !0;
        a--, t.setData({
            form: {
                number: a
            }
        });
    },
    numberAdd: function () {
        var t = this, a = t.data.form.number;
        if (++a > t.data.goods.dingshi.buy_max && 0 != t.data.goods.dingshi.buy_max) return getApp().core.showToast({
            title: "一单限购" + t.data.goods.dingshi.buy_max,
            image: "/images/icon-warning.png"
        }), !0;
        t.setData({
            form: {
                number: a
            }
        });
    },
    numberBlur: function (t) {
        var a = this, e = t.detail.value;
        e = parseInt(e), isNaN(e) && (e = 1), e <= 0 && (e = 1), e > a.data.goods.dingshi.buy_max && 0 != a.data.goods.dingshi.buy_max && (getApp().core.showToast({
            title: "一单限购" + a.data.goods.dingshi.buy_max + "件",
            image: "/images/icon-warning.png"
        }), e = a.data.goods.dingshi.buy_max), a.setData({
            form: {
                number: e
            }
        });
    },
    addCart: function () {
        this.submit("ADD_CART");
    },
    buyNow: function () {
        this.data.goods.dingshi ? this.submit("BUY_NOW") : getApp().core.showModal({
            title: "提示",
            content: "秒杀商品当前时间暂无活动",
            showCancel: !1,
            success: function (t) {
            }
        });
    },
    submit: function (t) {
        var a = this;
        if (!a.data.show_attr_picker) return a.setData({
            show_attr_picker: !0
        }), !0;
        if (a.data.dingshi_data && a.data.dingshi_data.rest_num > 0 && a.data.form.number > a.data.dingshi_data.rest_num) return getApp().core.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        if (1e3 * this.data.goods.dingshi.begin_time > Date.parse(new Date())) return getApp().core.showToast({
            title: "活动未开始",
            image: "/images/icon-warning.png"
        }), !0;
        if (a.data.form.number > a.data.goods.num) return getApp().core.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        var e = a.data.attr_group_list, o = [];
        for (var i in e) {
            var s = !1;
            for (var r in e[i].attr_list) if (e[i].attr_list[r].checked) {
                s = {
                    attr_id: e[i].attr_list[r].attr_id,
                    attr_name: e[i].attr_list[r].attr_name
                };
                break;
            }
            if (!s) return getApp().core.showToast({
                title: "请选择" + e[i].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            o.push({
                attr_group_id: e[i].attr_group_id,
                attr_group_name: e[i].attr_group_name,
                attr_id: s.attr_id,
                attr_name: s.attr_name
            });
        }
        if ("ADD_CART" == t && (getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        }), getApp().request({
            url: getApp().api.cart.add_cart,
            method: "POST",
            data: {
                goods_id: a.data.goods_id,
                attr: JSON.stringify(o),
                num: a.data.form.number
            },
            success: function (t) {
                //增加购物车数量
                var cart_count = parseInt(a.data.cart_count) + parseInt(a.data.form.number);
                wx.setStorage({
                    key: "cart_count",
                    data: cart_count,
                });
                a.setData({
                    cart_count: cart_count
                })
                getApp().core.hideLoading(), getApp().core.showToast({
                    title: t.msg,
                    duration: 1500
                }), a.setData({
                    show_attr_picker: !1
                });
            }
        })), "BUY_NOW" == t) {
            a.setData({
                show_attr_picker: !1
            });
            var d = [];
            d.push({
                goods_id: a.data.goods_id,
                num: a.data.form.number,
                attr: o
            });
            var n = a.data.goods, c = 0;
            null != n.mch && (c = n.mch.id);
            var p = [];
            p.push({
                mch_id: c,
                goods_list: d
            }), getApp().core.redirectTo({
                url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(p)
            });
        }
    },
    hideAttrPicker: function () {
        this.setData({
            show_attr_picker: !1
        });
    },
    showAttrPicker: function () {
        this.setData({
            show_attr_picker: !0
        });
    },
    favoriteAdd: function () {
        var t = this;
        getApp().request({
            url: getApp().api.user.favorite_add,
            method: "post",
            data: {
                goods_id: t.data.goods_id
            },
            success: function (a) {
                if (0 == a.code) {
                    var e = t.data.goods;
                    e.is_favorite = 1, t.setData({
                        goods: e
                    });
                }
            }
        });
    },
    favoriteRemove: function () {
        var t = this;
        getApp().request({
            url: getApp().api.user.favorite_remove,
            method: "post",
            data: {
                goods_id: t.data.goods_id
            },
            success: function (a) {
                if (0 == a.code) {
                    var e = t.data.goods;
                    e.is_favorite = 0, t.setData({
                        goods: e
                    });
                }
            }
        });
    },
    tabSwitch: function (t) {
        var a = this;
        "detail" == t.currentTarget.dataset.tab ? a.setData({
            tab_detail: "active",
            tab_comment: ""
        }) : a.setData({
            tab_detail: "",
            tab_comment: "active"
        });
    },
    commentPicView: function (t) {
        var a = this, e = t.currentTarget.dataset.index, o = t.currentTarget.dataset.picIndex;
        getApp().core.previewImage({
            current: a.data.comment_list[e].pic_list[o],
            urls: a.data.comment_list[e].pic_list
        });
    },
    onReady: function (t) {
        getApp().page.onReady(this);
    },
    onShow: function (t) {
        getApp().page.onShow(this), e.init(this), o.init(this);
    },
    onHide: function (t) {
        getApp().page.onHide(this);
    },
    onUnload: function (t) {
        getApp().page.onUnload(this);
    },
    onPullDownRefresh: function (t) {
        getApp().page.onPullDownRefresh(this);
    },
    onReachBottom: function (t) {
        getApp().page.onReachBottom(this), this.getRecordList(!0);
    },
    getBase64() {
        var a = this;
        var base64 = a.data.base64Img;
        while (base64 === undefined || base64.length === 0) {
            setTimeout(function () {
                base64 = this.getBase64();
            }, 2000);
        }
        return base64;
    },
    onShareAppMessage: function (t) {
        getApp().page.onShareAppMessage(this);
        var a = this, e = getApp().getUser();
        return {
            path: "/pages/dingshi/details/details?goods_id=" + this.data.goods_id + "&user_id=" + e.id,
            success: function (t) {
                1 == ++d && getApp().shareSendCoupon(a);
            },
            title: a.data.goods.name,
            // imageUrl: a.data.goods.pic_list[0]
            // imageUrl: a.data.cardCreateImgUrl
        };
    },
    play: function (t) {
        var a = t.target.dataset.url;
        this.setData({
            url: a,
            hide: "",
            show: !0
        }), getApp().core.createVideoContext("video").play();
    },
    close: function (t) {
        if ("video" == t.target.id) return !0;
        this.setData({
            hide: "hide",
            show: !1
        }), getApp().core.createVideoContext("video").pause();
    },
    hide: function (t) {
        0 == t.detail.current ? this.setData({
            img_hide: ""
        }) : this.setData({
            img_hide: "hide"
        });
    },
    showShareModal: function () {
        // getApp().core.showLoading({
        //     title: "正在生成",
        //     mask: !0
        // });
        // this.draw();
        this.setData({
            share_modal_active: "active",
            no_scroll: !0
        });
    },
    shareModalClose: function () {
        this.setData({
            share_modal_active: "",
            no_scroll: !1
        });
    },
    getGoodsQrcode: function () {
        var t = this;
        if (t.setData({
            goods_qrcode_active: "active",
            share_modal_active: ""
        }), t.data.goods_qrcode) return !0;
        getApp().request({
            url: getApp().api.default.goods_qrcode,
            data: {
                goods_id: t.data.goods_id
            },
            success: function (a) {
                0 == a.code && t.setData({
                    goods_qrcode: a.data.pic_url
                }), 1 == a.code && (t.goodsQrcodeClose(), getApp().core.showModal({
                    title: "提示",
                    content: a.msg,
                    showCancel: !1,
                    success: function (t) {
                        t.confirm;
                    }
                }));
            }
        });
    },
    goodsQrcodeClose: function () {
        this.setData({
            goods_qrcode_active: "",
            no_scroll: !1
        });
    },
    saveGoodsQrcode: function () {
        var t = this;
        getApp().core.saveImageToPhotosAlbum ? (getApp().core.showLoading({
            title: "正在保存图片",
            mask: !1
        }), getApp().core.downloadFile({
            url: t.data.goods_qrcode,
            success: function (t) {
                getApp().core.showLoading({
                    title: "正在保存图片",
                    mask: !1
                }), getApp().core.saveImageToPhotosAlbum({
                    filePath: t.tempFilePath,
                    success: function () {
                        getApp().core.showModal({
                            title: "提示",
                            content: "商品海报保存成功",
                            showCancel: !1
                        });
                    },
                    fail: function (t) {
                        getApp().core.showModal({
                            title: "图片保存失败",
                            content: t.errMsg,
                            showCancel: !1
                        });
                    },
                    complete: function (t) {
                        getApp().core.hideLoading();
                    }
                });
            },
            fail: function (a) {
                getApp().core.showModal({
                    title: "图片下载失败",
                    content: a.errMsg + ";" + t.data.goods_qrcode,
                    showCancel: !1
                });
            },
            complete: function (t) {
                getApp().core.hideLoading();
            }
        })) : getApp().core.showModal({
            title: "提示",
            content: "当前版本过低，无法使用该功能，请升级到最新版本后重试。",
            showCancel: !1
        });
    },
    goodsQrcodeClick: function (t) {
        var a = t.currentTarget.dataset.src;
        getApp().core.previewImage({
            urls: [a]
        });
    },
    closeCouponBox: function (t) {
        this.setData({
            get_coupon_list: ""
        });
    },
    setdingshiTimeOver: function () {
        function t() {
            var t = e.data.goods.dingshi.end_time - e.data.goods.dingshi.now_time;
            t = t < 0 ? 0 : t, e.data.goods.dingshi.now_time++, e.setData({
                goods: e.data.goods,
                dingshi_end_time_over: a(t)
            });
        }

        function a(t) {
            var a = parseInt(t / 3600), e = parseInt(t % 3600 / 60), o = t % 60, i = 0;
            return a >= 1, {
                h: a < 10 ? "0" + a : "" + a,
                m: e < 10 ? "0" + e : "" + e,
                s: o < 10 ? "0" + o : "" + o,
                type: i
            };
        }

        var e = this;
        t(), setInterval(function () {
            t();
        }, 1e3);
    },
    to_dial: function (t) {
        var a = this.data.store.contact_tel;
        getApp().core.makePhoneCall({
            phoneNumber: a
        });
    }
});