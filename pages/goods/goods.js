var t = require("../../wxParse/wxParse.js"), a = require("../../components/shopping_cart/shopping_cart.js"), e = require("../../components/specifications_model/specifications_model.js"), o = require("../../components/goods/specifications_model.js"), i = require("../../components/quick-navigation/quick-navigation.js"), s = require("../../components/goods/goods_banner.js"), r = 1, d = !1, n = !0, c = 0;

Page({
    data: {
        pageType: "STORE",
        id: null,
        goods: {},
        show_attr_picker: !1,
        form: {
            number: 1
        },
        tab_detail: "active",
        tab_comment: "",
        tab_history: "",
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
        page: 1,
        drop: !1,
        goodsModel: !1,
        goods_num: 0,
        temporaryGood: {
            price: 0,
            num: 0,
            use_attr: 1
        },
        goodNumCount: 0
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t), i.init(this);
        var a = this;
        c = 0, r = 1, d = !1, n = !0;
        var e = t.quick;
        if (e) {
            var o = getApp().core.getStorageSync(getApp().const.ITEM);
            if (o) var s = o.total, p = o.carGoods; else var s = {
                total_price: 0,
                total_num: 0
            }, p = [];
            a.setData({
                quick: e,
                quick_list: o.quick_list,
                total: s,
                carGoods: p,
                quick_hot_goods_lists: o.quick_hot_goods_lists
            });
        }
        if ("undefined" == typeof my) {
            var g = decodeURIComponent(t.scene);
            if (void 0 !== g) {
                var u = getApp().helper.scene_decode(g);
                u.uid && u.gid && (t.id = u.gid);
            }
        } else if (null !== getApp().query) {
            var l = app.query;
            getApp().query = null, t.id = l.gid;
        }
        a.setData({
            id: t.id
        }), a.getGoods(), a.getCommentList();
    },
    onReady: function() {
        getApp().page.onReady(this);
    },
    kfMessage: function() {
        getApp().core.getStorageSync(getApp().const.STORE).show_customer_service || getApp().core.showToast({
            title: "未启用客服功能"
        });
    },
    onShow: function() {
        getApp().page.onShow(this), a.init(this), e.init(this, a), o.init(this), s.init(this);
        var t = this, i = getApp().core.getStorageSync(getApp().const.ITEM);
        if (i) var r = i.total, d = i.carGoods, n = t.data.goods_num; else var r = {
            total_price: 0,
            total_num: 0
        }, d = [], n = 0;
        t.setData({
            total: r,
            carGoods: d,
            goods_num: n
        });
    },
    onHide: function() {
        getApp().page.onHide(this), a.saveItemData(this);
    },
    onUnload: function() {
        getApp().page.onUnload(this), a.saveItemData(this);
    },
    onPullDownRefresh: function() {
        getApp().page.onPullDownRefresh(this);
    },
    onReachBottom: function() {
        getApp().page.onReachBottom(this);
        var t = this;
        "active" == t.data.tab_detail && t.data.drop ? (t.data.drop = !1, t.goods_recommend({
            goods_id: t.data.goods.id,
            loadmore: !0
        })) : "active" == t.data.tab_comment && t.getCommentList(!0);
    },
    onShareAppMessage: function() {
        getApp().page.onShareAppMessage(this);
        var t = this, a = getApp().getUser();
        return {
            path: "/pages/goods/goods?id=" + this.data.id + "&user_id=" + a.id,
            success: function(a) {
                1 == ++c && t.shareSendCoupon(t);
            },
            title: t.data.goods.name,
            imageUrl: t.data.goods.pic_list[0].pic_url
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
            url: getApp().api.default.goods_qrcode,
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
    closeCouponBox: function(t) {
        this.setData({
            get_coupon_list: ""
        });
    },
    to_dial: function(t) {
        var a = this.data.store.contact_tel;
        getApp().core.makePhoneCall({
            phoneNumber: a
        });
    },
    goods_recommend: function(t) {
        var a = this;
        a.setData({
            is_loading: !0
        });
        var e = a.data.page || 2;
        getApp().request({
            url: getApp().api.default.goods_recommend,
            data: {
                goods_id: t.goods_id,
                page: e
            },
            success: function(o) {
                if (0 == o.code) {
                    if (t.reload) i = o.data.list;
                    if (t.loadmore) var i = a.data.goods_list.concat(o.data.list);
                    a.data.drop = !0, a.setData({
                        goods_list: i
                    }), a.setData({
                        page: e + 1
                    });
                }
            },
            complete: function() {
                a.setData({
                    is_loading: !1
                });
            }
        });
    },
    getGoods: function() {
        var a = this;
        if (a.data.quick) {
            var e = a.data.carGoods;
            if (e) {
                for (var o = e.length, i = 0, s = 0; s < o; s++) e[s].goods_id == a.data.id && (i += parseInt(e[s].num));
                a.setData({
                    goods_num: i
                });
            }
        }
        getApp().request({
            url: getApp().api.default.goods,
            data: {
                id: a.data.id
            },
            success: function(e) {
                if (0 == e.code) {
                    var o = e.data.detail;
                    t.wxParse("detail", "html", o, a);
                    var i = e.data;
                    i.attr_pic = e.data.attr_pic, i.cover_pic = e.data.pic_list[0].pic_url;
                    var s = i.pic_list, r = [];
                    for (var d in s) r.push(s[d].pic_url);
                    i.pic_list = r, a.setData({
                        goods: i,
                        attr_group_list: e.data.attr_group_list,
                        btn: !0
                    }), a.goods_recommend({
                        goods_id: e.data.id,
                        reload: !0
                    }), a.selectDefaultAttr();
                }
                1 == e.code && getApp().core.showModal({
                    title: "提示",
                    content: e.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && getApp().core.switchTab({
                            url: "/pages/index/index"
                        });
                    }
                });
            }
        });
    },
    callPhone: function(t) {
        getApp().core.makePhoneCall({
            phoneNumber: t.target.dataset.info
        });
    },
    close_box: function(t) {
        this.setData({
            showModal: !1
        });
    },
    hideModal: function() {
        this.setData({
            showModal: !1
        });
    },
    buynow: function(t) {
        var a = this, e = a.data.carGoods;
        a.data.goodsModel;
        a.setData({
            goodsModel: !1
        });
        for (var o = e.length, i = [], s = [], r = 0; r < o; r++) 0 != e[r].num && (s = {
            goods_id: e[r].goods_id,
            num: e[r].num,
            attr: e[r].attr
        }, i.push(s));
        var d = [];
        d.push({
            mch_id: 0,
            goods_list: i
        }), getApp().core.navigateTo({
            url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(d)
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
        t && "active" != a.data.tab_comment || d || n && (d = !0, getApp().request({
            url: getApp().api.default.comment_list,
            data: {
                goods_id: a.data.id,
                page: r
            },
            success: function(e) {
                0 == e.code && (d = !1, r++, a.setData({
                    comment_count: e.data.comment_count,
                    comment_list: t ? a.data.comment_list.concat(e.data.list) : e.data.list
                }), 0 == e.data.list.length && (n = !1));
            }
        }));
    },
    addCart: function() {
        this.data.btn && this.submit("ADD_CART");
    },
    buyNow: function() {
        this.data.btn && this.submit("BUY_NOW");
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
                goods_id: a.data.id,
                attr: JSON.stringify(o),
                num: a.data.form.number
            },
            success: function(t) {
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
                goods_id: a.data.id,
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
        console.log(t.currentTarget.dataset.tab)
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
    }
});