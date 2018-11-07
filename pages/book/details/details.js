function t(t, e, o) {
    return e in t ? Object.defineProperty(t, e, {
        value: o,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = o, t;
}

var e, o = require("../../../utils/helper.js"), a = require("../../../wxParse/wxParse.js"), i = require("../../../components/goods/specifications_model.js"), s = require("../../../components/goods/goods_banner.js"), r = 1, n = !1, c = !0;

Page((e = {
    data: {
        pageType: "BOOK",
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
        }
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        var e = t.user_id, a = decodeURIComponent(t.scene);
        if (void 0 !== e) e; else if (void 0 !== a) {
            var i = o.scene_decode(a);
            i.uid && i.gid ? (i.uid, t.id = i.gid) : a;
        } else if (null !== getApp().query) {
            var s = getApp().query;
            getApp().query = null, t.id = s.gid, s.uid;
        }
        this.setData({
            id: t.id
        }), r = 1, this.getGoodsInfo(t), this.getCommentList(!1);
    },
    onReady: function(t) {
        getApp().page.onReady(this);
    },
    onShow: function(t) {
        getApp().page.onShow(this), i.init(this), s.init(this);
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
        var e = this, o = getApp().core.getStorageSync(getApp().const.USER_INFO);
        return {
            title: e.data.goods.name,
            path: "/pages/book/details/details?id=" + e.data.goods.id + "&user_id=" + o.id,
            imageUrl: e.data.goods.cover_pic,
            success: function(t) {}
        };
    },
    getGoodsInfo: function(t) {
        var e = t.id, o = this;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.book.details,
            method: "get",
            data: {
                gid: e
            },
            success: function(t) {
                if (0 == t.code) {
                    var e = t.data.info.detail;
                    a.wxParse("detail", "html", e, o);
                    var i = parseInt(t.data.info.virtual_sales) + parseInt(t.data.info.sales);
                    t.data.attr_group_list.length <= 0 && (t.data.attr_group_list = [ {
                        attr_group_name: "规格",
                        attr_list: [ {
                            attr_id: 0,
                            attr_name: "默认",
                            checked: !0
                        } ]
                    } ]), t.data.info.num = t.data.info.stock, o.setData({
                        goods: t.data.info,
                        shop: t.data.shopList,
                        sales: i,
                        attr_group_list: t.data.attr_group_list
                    }), o.selectDefaultAttr();
                } else getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && getApp().core.redirectTo({
                            url: "/pages/book/index/index"
                        });
                    }
                });
            },
            complete: function(t) {
                getApp().core.hideLoading();
            }
        });
    },
    onGoodsImageClick: function(t) {
        var e = this, o = [], a = t.currentTarget.dataset.index;
        for (var i in e.data.goods.pic_list) o.push(e.data.goods.pic_list[i]);
        getApp().core.previewImage({
            urls: o,
            current: o[a]
        });
    },
    selectDefaultAttr: function() {
        var t = this;
        if (t.data.goods && 0 == t.data.goods.use_attr) {
            for (var e in t.data.attr_group_list) for (var o in t.data.attr_group_list[e].attr_list) 0 == e && 0 == o && (t.data.attr_group_list[e].attr_list[o].checked = !0);
            t.setData({
                attr_group_list: t.data.attr_group_list
            });
        }
    },
    tabSwitch: function(t) {
        var e = this;
        "detail" == t.currentTarget.dataset.tab ? e.setData({
            tab_detail: "active",
            tab_comment: ""
        }) : e.setData({
            tab_detail: "",
            tab_comment: "active"
        });
    },
    commentPicView: function(t) {
        var e = this, o = t.currentTarget.dataset.index, a = t.currentTarget.dataset.picIndex;
        getApp().core.previewImage({
            current: e.data.comment_list[o].pic_list[a],
            urls: e.data.comment_list[o].pic_list
        });
    },
    bespeakNow: function(t) {
        var e = this;
        if (!e.data.show_attr_picker) return e.setData({
            show_attr_picker: !0
        }), !0;
        for (var o = [], a = !0, i = e.data.attr_group_list, s = 0; s < i.length; s++) {
            var r = i[s].attr_list;
            a = !0;
            for (var n = 0; n < r.length; n++) r[n].checked && (o.push({
                attr_group_id: i[s].attr_group_id,
                attr_id: r[n].attr_id,
                attr_group_name: i[s].attr_group_name,
                attr_name: r[n].attr_name
            }), a = !1);
            if (a) return void getApp().core.showModal({
                title: "提示",
                content: "请选择" + i[s].attr_group_name,
                showCancel: !1
            });
        }
        var c = [ {
            id: e.data.goods.id,
            attr: o
        } ];
        getApp().core.redirectTo({
            url: "/pages/book/submit/submit?goods_info=" + JSON.stringify(c)
        });
    },
    hideAttrPicker: function() {
        this.setData({
            show_attr_picker: !1
        });
    },
    attrGoodsClick: function(t) {
        var e = this, o = t.target.dataset.groupId, a = t.target.dataset.id, i = e.data.attr_group_list;
        for (var s in i) if (i[s].attr_group_id == o) for (var r in i[s].attr_list) i[s].attr_list[r].checked = i[s].attr_list[r].attr_id == a;
        e.setData({
            attr_group_list: i
        });
        for (var n = [], c = 0, s = 0; s < i.length; s++) {
            var d = i[s].attr_list;
            c = 0;
            for (r = 0; r < d.length; r++) d[r].checked && (c = d[r].attr_id);
            if (!c) return;
            n.push(c);
        }
        var p = e.data.goods;
        p.attr.forEach(function(t, o, a) {
            var i = [];
            t.attr_list.forEach(function(t, e, o) {
                i.push(t.attr_id);
            }), n.sort().toString() == i.sort().toString() && (p.attr_pic = t.pic, p.stock = t.num, 
            p.price = t.price, e.setData({
                goods: p
            }));
        });
    },
    goToShopList: function(t) {
        getApp().core.navigateTo({
            url: "/pages/book/shop/shop?ids=" + this.data.goods.shop_id,
            success: function(t) {},
            fail: function(t) {},
            complete: function(t) {}
        });
    },
    getCommentList: function(t) {
        var e = this;
        t && "active" != e.data.tab_comment || n || c && (n = !0, getApp().request({
            url: getApp().api.book.goods_comment,
            data: {
                goods_id: e.data.id,
                page: r
            },
            success: function(o) {
                0 == o.code && (n = !1, r++, e.setData({
                    comment_count: o.data.comment_count,
                    comment_list: t ? e.data.comment_list.concat(o.data.list) : o.data.list
                }), 0 == o.data.list.length && (c = !1));
            }
        }));
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
            url: getApp().api.book.goods_qrcode,
            data: {
                goods_id: t.data.id
            },
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
    goodsQrcodeClose: function() {
        this.setData({
            goods_qrcode_active: "",
            no_scroll: !1
        });
    }
}, t(e, "goodsQrcodeClose", function() {
    this.setData({
        goods_qrcode_active: "",
        no_scroll: !1
    });
}), t(e, "saveGoodsQrcode", function() {
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
}), t(e, "goodsQrcodeClick", function(t) {
    var e = t.currentTarget.dataset.src;
    getApp().core.previewImage({
        urls: [ e ]
    });
}), t(e, "goHome", function(t) {
    getApp().core.redirectTo({
        url: "/pages/book/index/index",
        success: function(t) {},
        fail: function(t) {},
        complete: function(t) {}
    });
}), e));