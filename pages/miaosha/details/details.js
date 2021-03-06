var t = require("../../../utils/helper.js"), a = require("../../../components/quick-navigation/quick-navigation.js"), e = require("../../../components/goods/goods_banner.js"), o = require("../../../components/goods/specifications_model.js"), i = require("../../../wxParse/wxParse.js"), s = 1, r = !1, n = !0, d = 0;

Page({
    data: {
        pageType: "MIAOSHA",
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
        miaosha_end_time_over: {
            h: "--",
            m: "--",
            s: "--",
            type: 0
        }
    },
    onLoad: function(e) {
        getApp().page.onLoad(this, e), d = 0, s = 1, r = !1, n = !0, a.init(this);
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
            id: e.id,
            scene_type: c,
            goods_id: e.goods_id
        }), u.getGoods(), u.getCommentList();
    },
    getGoods: function() {
        var t = this, a = {};
        t.data.id && (a.id = t.data.id), t.data.goods_id && (a.goods_id = t.datat.goods_id), 
        a.scene_type = t.data.scene_type, getApp().request({
            url: getApp().api.miaosha.details,
            data: a,
            success: function(a) {
                if (0 == a.code) {
                    var e = a.data.detail;
                    i.wxParse("detail", "html", e, t);
                    var o = a.data, s = [];
                    for (var r in o.pic_list) s.push(o.pic_list[r].pic_url);
                    o.pic_list = s, t.setData({
                        goods: o,
                        attr_group_list: a.data.attr_group_list,
                        miaosha_data: a.data.miaosha.miaosha_data
                    }), 1 == t.data.scene_type && t.setData({
                        id: a.data.miaosha.miaosha_goods_id
                    }), t.data.goods.miaosha && t.setMiaoshaTimeOver(), t.selectDefaultAttr();
                }
                1 == a.code && getApp().core.showModal({
                    title: "提示",
                    content: a.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && getApp().core.redirectTo({
                            url: "/pages/index/index"
                        });
                    }
                });
            }
        });
    },
    selectDefaultAttr: function() {
        var t = this;
        if (t.data.goods && 0 === t.data.goods.use_attr) {
            for (var a in t.data.attr_group_list) for (var e in t.data.attr_group_list[a].attr_list) 0 == a && 0 == e && (t.data.attr_group_list[a].attr_list[e].checked = !0);
            t.setData({
                attr_group_list: t.data.attr_group_list
            });
        }
    },
    getCommentList: function(t) {
        var a = this;
        t && "active" != a.data.tab_comment || r || n && (r = !0, getApp().request({
            url: getApp().api.miaosha.comment_list,
            data: {
                goods_id: a.data.id,
                page: s
            },
            success: function(e) {
                0 == e.code && (r = !1, s++, a.setData({
                    comment_count: e.data.comment_count,
                    comment_list: t ? a.data.comment_list.concat(e.data.list) : e.data.list
                }), 0 == e.data.list.length && (n = !1));
            }
        }));
    },
    numberSub: function() {
        var t = this, a = t.data.form.number;
        if (a <= 1) return !0;
        a--, t.setData({
            form: {
                number: a
            }
        });
    },
    numberAdd: function() {
        var t = this, a = t.data.form.number;
        if (++a > t.data.goods.miaosha.buy_max && 0 != t.data.goods.miaosha.buy_max) return getApp().core.showToast({
            title: "一单限购" + t.data.goods.miaosha.buy_max,
            image: "/images/icon-warning.png"
        }), !0;
        t.setData({
            form: {
                number: a
            }
        });
    },
    numberBlur: function(t) {
        var a = this, e = t.detail.value;
        e = parseInt(e), isNaN(e) && (e = 1), e <= 0 && (e = 1), e > a.data.goods.miaosha.buy_max && 0 != a.data.goods.miaosha.buy_max && (getApp().core.showToast({
            title: "一单限购" + a.data.goods.miaosha.buy_max + "件",
            image: "/images/icon-warning.png"
        }), e = a.data.goods.miaosha.buy_max), a.setData({
            form: {
                number: e
            }
        });
    },
    addCart: function() {
        this.submit("ADD_CART");
    },
    buyNow: function() {
        this.data.goods.miaosha ? this.submit("BUY_NOW") : getApp().core.showModal({
            title: "提示",
            content: "秒杀商品当前时间暂无活动",
            showCancel: !1,
            success: function(t) {}
        });
    },
    submit: function(t) {
        var a = this;
        if (!a.data.show_attr_picker) return a.setData({
            show_attr_picker: !0
        }), !0;
        if (a.data.miaosha_data && a.data.miaosha_data.rest_num > 0 && a.data.form.number > a.data.miaosha_data.rest_num) return getApp().core.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        if (1e3 * this.data.goods.miaosha.begin_time > Date.parse(new Date())) return getApp().core.showToast({
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
        "ADD_CART" == t && (getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        }), getApp().request({
            url: getApp().api.cart.add_cart,
            method: "POST",
            data: {
                goods_id: a.data.id,
                attr: JSON.stringify(o),
                num: a.data.form.number,
            },
            success: function(t) {
                getApp().core.showToast({
                    title: t.msg,
                    duration: 1500
                }), getApp().core.hideLoading(), a.setData({
                    show_attr_picker: !1
                });
            }
        })), "BUY_NOW" == t && (a.setData({
            show_attr_picker: !1
        }), getApp().core.redirectTo({
            url: "/pages/miaosha/order-submit/order-submit?goods_info=" + JSON.stringify({
                goods_id: a.data.id,
                attr: o,
                num: a.data.form.number
            })
        }));
    },
    hideAttrPicker: function() {
        this.setData({
            show_attr_picker: !1
        });
    },
    showAttrPicker: function() {
        this.setData({
            show_attr_picker: !0
        });
    },
    favoriteAdd: function() {
        var t = this;
        getApp().request({
            url: getApp().api.user.favorite_add,
            method: "post",
            data: {
                goods_id: t.data.goods.id
            },
            success: function(a) {
                if (0 == a.code) {
                    var e = t.data.goods;
                    e.is_favorite = 1, t.setData({
                        goods: e
                    });
                }
            }
        });
    },
    favoriteRemove: function() {
        var t = this;
        getApp().request({
            url: getApp().api.user.favorite_remove,
            method: "post",
            data: {
                goods_id: t.data.goods.id
            },
            success: function(a) {
                if (0 == a.code) {
                    var e = t.data.goods;
                    e.is_favorite = 0, t.setData({
                        goods: e
                    });
                }
            }
        });
    },
    tabSwitch: function(t) {
        var a = this;
        "detail" == t.currentTarget.dataset.tab ? a.setData({
            tab_detail: "active",
            tab_comment: ""
        }) : a.setData({
            tab_detail: "",
            tab_comment: "active"
        });
    },
    commentPicView: function(t) {
        var a = this, e = t.currentTarget.dataset.index, o = t.currentTarget.dataset.picIndex;
        getApp().core.previewImage({
            current: a.data.comment_list[e].pic_list[o],
            urls: a.data.comment_list[e].pic_list
        });
    },
    onReady: function(t) {
        getApp().page.onReady(this);
    },
    onShow: function(t) {
        getApp().page.onShow(this), e.init(this), o.init(this);
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
        getApp().page.onReachBottom(this), this.getCommentList(!0);
    },
    onShareAppMessage: function(t) {
        getApp().page.onShareAppMessage(this);
        var a = this, e = getApp().getUser();
        return {
            path: "/pages/miaosha/details/details?id=" + this.data.id + "&user_id=" + e.id,
            success: function(t) {
                1 == ++d && getApp().shareSendCoupon(a);
            },
            title: a.data.goods.name,
            imageUrl: a.data.goods.pic_list[0].pic_url
        };
    },
    play: function(t) {
        var a = t.target.dataset.url;
        this.setData({
            url: a,
            hide: "",
            show: !0
        }), getApp().core.createVideoContext("video").play();
    },
    close: function(t) {
        if ("video" == t.target.id) return !0;
        this.setData({
            hide: "hide",
            show: !1
        }), getApp().core.createVideoContext("video").pause();
    },
    hide: function(t) {
        0 == t.detail.current ? this.setData({
            img_hide: ""
        }) : this.setData({
            img_hide: "hide"
        });
    },
    showShareModal: function() {
        this.setData({
            share_modal_active: "active",
            no_scroll: !0
        });
    },
    shareModalClose: function() {
        this.setData({
            share_modal_active: "",
            no_scroll: !1
        });
    },
    getGoodsQrcode: function() {
        var t = this;
        if (t.setData({
            goods_qrcode_active: "active",
            share_modal_active: ""
        }), t.data.goods_qrcode) return !0;
        getApp().request({
            url: getApp().api.miaosha.goods_qrcode,
            data: {
                goods_id: t.data.id
            },
            success: function(a) {
                0 == a.code && t.setData({
                    goods_qrcode: a.data.pic_url
                }), 1 == a.code && (t.goodsQrcodeClose(), getApp().core.showModal({
                    title: "提示",
                    content: a.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm;
                    }
                }));
            }
        });
    },
    goodsQrcodeClose: function() {
        this.setData({
            goods_qrcode_active: "",
            no_scroll: !1
        });
    },
    saveGoodsQrcode: function() {
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
            fail: function(a) {
                getApp().core.showModal({
                    title: "图片下载失败",
                    content: a.errMsg + ";" + t.data.goods_qrcode,
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
    goodsQrcodeClick: function(t) {
        var a = t.currentTarget.dataset.src;
        getApp().core.previewImage({
            urls: [ a ]
        });
    },
    closeCouponBox: function(t) {
        this.setData({
            get_coupon_list: ""
        });
    },
    setMiaoshaTimeOver: function() {
        function t() {
            var t = e.data.goods.miaosha.end_time - e.data.goods.miaosha.now_time;
            t = t < 0 ? 0 : t, e.data.goods.miaosha.now_time++, e.setData({
                goods: e.data.goods,
                miaosha_end_time_over: a(t)
            });
        }
        function a(t) {
            var a = parseInt(t / 3600), e = parseInt(t % 3600 / 60), o = t % 60, i = 0;
            return a >= 1 && (a -= 1, i = 1), {
                h: a < 10 ? "0" + a : "" + a,
                m: e < 10 ? "0" + e : "" + e,
                s: o < 10 ? "0" + o : "" + o,
                type: i
            };
        }
        var e = this;
        t(), setInterval(function() {
            t();
        }, 1e3);
    },
    to_dial: function(t) {
        var a = this.data.store.contact_tel;
        getApp().core.makePhoneCall({
            phoneNumber: a
        });
    }
});