function t(t, e, a) {
    return e in t ? Object.defineProperty(t, e, {
        value: a,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = a, t;
}

var e, a = require("../../../utils/helper.js"), o = require("../../../wxParse/wxParse.js"), i = require("../../../components/goods/specifications_model.js"), r = require("../../../components/goods/goods_banner.js"), s = require("../../../components/quick-navigation/quick-navigation.js");

Page((e = {
    data: {
        pageType: "PINTUAN",
        form: {
            number: 1,
            pt_detail: !1
        }
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t), s.init(this);
        var e = t.user_id, o = decodeURIComponent(t.scene);
        if (void 0 !== e) e; else if (void 0 !== o) {
            var i = a.scene_decode(o);
            i.uid && i.gid ? (i.uid, t.gid = i.gid) : o;
        } else if ("undefined" != typeof my && null !== getApp().query) {
            var r = getApp().query;
            getApp().query = null, t.id = r.gid;
        }
        this.setData({
            id: t.gid,
            oid: t.oid ? t.oid : 0,
            group_checked: t.group_id ? t.group_id : 0
        }), this.getGoodsInfo(t);
        var n = getApp().core.getStorageSync(getApp().const.STORE);
        this.setData({
            store: n
        });
    },
    onReady: function() {
        getApp().page.onReady(this);
    },
    onShow: function() {
        getApp().page.onShow(this), i.init(this), r.init(this);
    },
    onHide: function() {
        getApp().page.onHide(this);
    },
    onUnload: function() {
        getApp().page.onUnload(this), getApp().core.removeStorageSync(getApp().const.PT_GROUP_DETAIL);
    },
    onPullDownRefresh: function() {
        getApp().page.onPullDownRefresh(this);
    },
    onReachBottom: function() {
        getApp().page.onReachBottom(this);
    },
    onShareAppMessage: function() {
        getApp().page.onShareAppMessage(this);
        var t = this, e = getApp().core.getStorageSync(getApp().const.USER_INFO), a = "/pages/pt/details/details?gid=" + t.data.goods.id + "&user_id=" + e.id;
        return {
            title: t.data.goods.name,
            path: a,
            imageUrl: t.data.goods.cover_pic,
            success: function(t) {}
        };
    },
    getGoodsInfo: function(t) {
        var e = t.gid, a = this;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().core.showNavigationBarLoading(), getApp().request({
            url: getApp().api.group.details,
            method: "get",
            data: {
                gid: e
            },
            success: function(t) {
                if (0 == t.code) {
                    a.countDownRun(t.data.info.limit_time_ms);
                    var e = t.data.info.detail;
                    o.wxParse("detail", "html", e, a), getApp().core.setNavigationBarTitle({
                        title: t.data.info.name
                    }), getApp().core.hideNavigationBarLoading();
                    var i = (t.data.info.original_price - t.data.info.price).toFixed(2);
                    a.setData({
                        group_checked: a.data.group_checked ? a.data.group_checked : 0,
                        goods: t.data.info,
                        attr_group_list: t.data.attr_group_list,
                        attr_group_num: t.data.attr_group_num,
                        limit_time: t.data.limit_time_res,
                        group_list: t.data.groupList,
                        group_num: t.data.groupList.length,
                        group_rule_id: t.data.groupRuleId,
                        comment: t.data.comment,
                        comment_num: t.data.commentNum,
                        reduce_price: i < 0 ? 0 : i
                    }), a.countDown(), a.selectDefaultAttr();
                } else getApp().core.showModal({
                    title: "提示",
                    content: t.msg,
                    showCancel: !1,
                    success: function(t) {
                        t.confirm && getApp().core.redirectTo({
                            url: "/pages/pt/index/index"
                        });
                    }
                });
            },
            complete: function(t) {
                getApp().core.hideLoading();
            }
        });
    },
    more: function() {
        this.setData({
            pt_detail: !0
        });
    },
    end_more: function() {
        this.setData({
            pt_detail: !1
        });
    },
    previewImage: function(t) {
        var e = t.currentTarget.dataset.url;
        getApp().core.previewImage({
            urls: [ e ]
        });
    },
    selectDefaultAttr: function() {
        var t = this;
        if (!t.data.goods || "0" === t.data.goods.use_attr) for (var e in t.data.attr_group_list) for (var a in t.data.attr_group_list[e].attr_list) 0 == e && 0 == a && (t.data.attr_group_list[e].attr_list[a].checked = !0);
        t.setData({
            attr_group_list: t.data.attr_group_list
        });
    },
    countDownRun: function(t) {
        var e = this;
        setInterval(function() {
            var a = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]) - new Date(), o = parseInt(a / 1e3 / 60 / 60 / 24, 10), i = parseInt(a / 1e3 / 60 / 60 % 24, 10), r = parseInt(a / 1e3 / 60 % 60, 10), s = parseInt(a / 1e3 % 60, 10);
            o = e.checkTime(o), i = e.checkTime(i), r = e.checkTime(r), s = e.checkTime(s), 
            e.setData({
                limit_time: {
                    days: o < 0 ? "00" : o,
                    hours: i < 0 ? "00" : i,
                    mins: r < 0 ? "00" : r,
                    secs: s < 0 ? "00" : s
                }
            });
        }, 1e3);
    },
    checkTime: function(t) {
        return t < 0 ? "00" : (t < 10 && (t = "0" + t), t);
    },
    goHome: function(t) {
        getApp().core.redirectTo({
            url: "/pages/pt/index/index"
        });
    },
    goToGroup: function(t) {
        getApp().core.navigateTo({
            url: "/pages/pt/group/details?oid=" + t.target.dataset.id
        });
    },
    goToComment: function(t) {
        getApp().core.navigateTo({
            url: "/pages/pt/comment/comment?id=" + this.data.goods.id
        });
    },
    goArticle: function(t) {
        this.data.group_rule_id && getApp().core.navigateTo({
            url: "/pages/article-detail/article-detail?id=" + this.data.group_rule_id
        });
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
    groupCheck: function() {
        var t = this, e = t.data.attr_group_num, a = t.data.attr_group_num.attr_list;
        for (var o in a) a[o].checked = !1;
        e.attr_list = a;
        t.data.goods;
        t.setData({
            group_checked: 0,
            attr_group_num: e
        });
        var i = t.data.attr_group_list, r = [], s = !0;
        for (var o in i) {
            var n = !1;
            for (var d in i[o].attr_list) if (i[o].attr_list[d].checked) {
                r.push(i[o].attr_list[d].attr_id), n = !0;
                break;
            }
            if (!n) {
                s = !1;
                break;
            }
        }
        s && (getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.goods_attr_info,
            data: {
                goods_id: t.data.goods.id,
                group_id: t.data.group_checked,
                attr_list: JSON.stringify(r)
            },
            success: function(e) {
                if (getApp().core.hideLoading(), 0 == e.code) {
                    var a = t.data.goods;
                    a.price = e.data.price, a.num = e.data.num, a.attr_pic = e.data.pic, a.original_price = e.data.single, 
                    t.setData({
                        goods: a
                    });
                }
            }
        }));
    },
    attrNumClick: function(t) {
        var e = this, a = t.target.dataset.id, o = e.data.attr_group_num, i = o.attr_list;
        for (var r in i) i[r].id == a ? i[r].checked = !0 : i[r].checked = !1;
        o.attr_list = i, e.setData({
            attr_group_num: o,
            group_checked: a
        });
        var s = e.data.attr_group_list, n = [], d = !0;
        for (var r in s) {
            var c = !1;
            for (var p in s[r].attr_list) if (s[r].attr_list[p].checked) {
                n.push(s[r].attr_list[p].attr_id), c = !0;
                break;
            }
            if (!c) {
                d = !1;
                break;
            }
        }
        d && (getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.goods_attr_info,
            data: {
                goods_id: e.data.goods.id,
                group_id: e.data.group_checked,
                attr_list: JSON.stringify(n)
            },
            success: function(t) {
                if (getApp().core.hideLoading(), 0 == t.code) {
                    var a = e.data.goods;
                    a.price = t.data.price, a.num = t.data.num, a.attr_pic = t.data.pic, a.original_price = t.data.single, 
                    e.setData({
                        goods: a
                    });
                }
            }
        }));
    },
    attrClick: function(t) {
        var e = this, a = t.target.dataset.groupId, o = t.target.dataset.id, i = e.data.attr_group_list;
        for (var r in i) if (i[r].attr_group_id == a) for (var s in i[r].attr_list) i[r].attr_list[s].attr_id == o ? i[r].attr_list[s].checked = !0 : i[r].attr_list[s].checked = !1;
        e.setData({
            attr_group_list: i
        });
        var n = [], d = !0;
        for (var r in i) {
            var c = !1;
            for (var s in i[r].attr_list) if (i[r].attr_list[s].checked) {
                n.push(i[r].attr_list[s].attr_id), c = !0;
                break;
            }
            if (!c) {
                d = !1;
                break;
            }
        }
        d && (getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.goods_attr_info,
            data: {
                goods_id: e.data.goods.id,
                group_id: e.data.group_checked,
                attr_list: JSON.stringify(n)
            },
            success: function(t) {
                if (getApp().core.hideLoading(), 0 == t.code) {
                    var a = e.data.goods;
                    a.price = t.data.price, a.num = t.data.num, a.attr_pic = t.data.pic, a.original_price = t.data.single, 
                    e.setData({
                        goods: a
                    });
                }
            }
        }));
    },
    buyNow: function() {
        this.submit("GROUP_BUY", this.data.group_checked);
    },
    onlyBuy: function() {
        this.submit("ONLY_BUY", 0);
    },
    submit: function(t, e) {
        var a = this, o = "GROUP_BUY" == t;
        if (!a.data.show_attr_picker || o != a.data.groupNum) return a.setData({
            show_attr_picker: !0,
            groupNum: o
        }), !0;
        if (a.data.form.number > a.data.goods.num) return getApp().core.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        var i = a.data.attr_group_list, r = [];
        for (var s in i) {
            var n = !1;
            for (var d in i[s].attr_list) if (i[s].attr_list[d].checked) {
                n = {
                    attr_id: i[s].attr_list[d].attr_id,
                    attr_name: i[s].attr_list[d].attr_name
                };
                break;
            }
            if (!n) return getApp().core.showToast({
                title: "请选择" + i[s].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            r.push({
                attr_group_id: i[s].attr_group_id,
                attr_group_name: i[s].attr_group_name,
                attr_id: n.attr_id,
                attr_name: n.attr_name
            });
        }
        a.setData({
            show_attr_picker: !1
        });
        var c = 0;
        a.data.oid && (t = "GROUP_BUY_C", c = a.data.oid), getApp().core.redirectTo({
            url: "/pages/pt/order-submit/order-submit?goods_info=" + JSON.stringify({
                goods_id: a.data.goods.id,
                attr: r,
                num: a.data.form.number,
                type: t,
                deliver_type: a.data.goods.type,
                group_id: e,
                parent_id: c
            })
        });
    },
    numberSub: function() {
        var t = this, e = t.data.form.number;
        if (e <= 1) return !0;
        e--, t.setData({
            form: {
                number: e
            }
        });
    },
    numberAdd: function() {
        var t = this, e = t.data.form.number;
        ++e > t.data.goods.one_buy_limit && 0 != t.data.goods.one_buy_limit ? getApp().core.showModal({
            title: "提示",
            content: "数量超过最大限购数",
            showCancel: !1,
            success: function(t) {}
        }) : t.setData({
            form: {
                number: e
            }
        });
    },
    numberBlur: function(t) {
        var e = this, a = t.detail.value;
        a = parseInt(a), isNaN(a) && (a = 1), a <= 0 && (a = 1), a > e.data.goods.one_buy_limit && 0 != e.data.goods.one_buy_limit && (getApp().core.showModal({
            title: "提示",
            content: "数量超过最大限购数",
            showCancel: !1,
            success: function(t) {}
        }), a = e.data.goods.one_buy_limit), e.setData({
            form: {
                number: a
            }
        });
    },
    countDown: function() {
        var t = this;
        setInterval(function() {
            var e = t.data.group_list;
            for (var a in e) {
                var o = new Date(e[a].limit_time_ms[0], e[a].limit_time_ms[1] - 1, e[a].limit_time_ms[2], e[a].limit_time_ms[3], e[a].limit_time_ms[4], e[a].limit_time_ms[5]) - new Date(), i = parseInt(o / 1e3 / 60 / 60 / 24, 10), r = parseInt(o / 1e3 / 60 / 60 % 24, 10), s = parseInt(o / 1e3 / 60 % 60, 10), n = parseInt(o / 1e3 % 60, 10);
                i = t.checkTime(i), r = t.checkTime(r), s = t.checkTime(s), n = t.checkTime(n), 
                e[a].limit_time = {
                    days: i,
                    hours: r > 0 ? r : "00",
                    mins: s > 0 ? s : "00",
                    secs: n > 0 ? n : "00"
                }, t.setData({
                    group_list: e
                });
            }
        }, 1e3);
    },
    bigToImage: function(t) {
        var e = this.data.comment[t.target.dataset.index].pic_list;
        getApp().core.previewImage({
            current: t.target.dataset.url,
            urls: e
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
            url: getApp().api.group.goods_qrcode,
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
}), t(e, "to_dial", function() {
    var t = this.data.store.contact_tel;
    getApp().core.makePhoneCall({
        phoneNumber: t
    });
}), e));