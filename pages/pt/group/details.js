function t(t, e, o) {
    return e in t ? Object.defineProperty(t, e, {
        value: o,
        enumerable: !0,
        configurable: !0,
        writable: !0
    }) : t[e] = o, t;
}

var e, o = require("../../../utils/helper.js");

Page((e = {
    data: {
        groupFail: 0,
        show_attr_picker: !1,
        form: {
            number: 1
        }
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
        var e = t.user_id, a = decodeURIComponent(t.scene);
        if (void 0 !== e) e; else if (void 0 !== a) {
            var i = o.scene_decode(a);
            i.uid && i.oid ? (i.uid, t.oid = i.oid) : a;
        } else if ("undefined" != typeof my && null !== getApp().query) {
            var r = getApp().query;
            getApp().query = null, t.oid = r.oid, r.uid;
        }
        this.setData({
            oid: t.oid
        }), this.getInfo(t);
    },
    onReady: function() {},
    onShow: function() {},
    onHide: function() {},
    onUnload: function() {},
    onPullDownRefresh: function() {},
    onReachBottom: function() {},
    onShareAppMessage: function(t) {
        var e = this, o = getApp().core.getStorageSync(getApp().const.USER_INFO), a = "/pages/pt/group/details?oid=" + e.data.oid + "&user_id=" + o.id;
        return {
            title: "快来" + e.data.goods.price + "元拼  " + e.data.goods.name,
            path: a,
            success: function(t) {}
        };
    },
    getInfo: function(t) {
        var e = t.oid, o = this;
        getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.group_info,
            method: "get",
            data: {
                oid: e
            },
            success: function(t) {
                if (0 == t.code) {
                    0 == t.data.groupFail && o.countDownRun(t.data.limit_time_ms);
                    var e = (t.data.goods.original_price - t.data.goods.price).toFixed(2);
                    o.setData({
                        goods: t.data.goods,
                        groupList: t.data.groupList,
                        surplus: t.data.surplus,
                        limit_time_ms: t.data.limit_time_ms,
                        goods_list: t.data.goodsList,
                        group_fail: t.data.groupFail,
                        oid: t.data.oid,
                        in_group: t.data.inGroup,
                        attr_group_list: t.data.attr_group_list,
                        group_rule_id: t.data.groupRuleId,
                        reduce_price: e < 0 ? 0 : e,
                        group_id: t.data.goods.class_group
                    }), 0 != t.data.groupFail && t.data.inGroup && o.setData({
                        oid: !1,
                        group_id: !1
                    }), o.selectDefaultAttr();
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
                setTimeout(function() {
                    getApp().core.hideLoading();
                }, 1e3);
            }
        });
    },
    selectDefaultAttr: function() {
        var t = this;
        if (!t.data.goods || 0 === t.data.goods.use_attr) for (var e in t.data.attr_group_list) for (var o in t.data.attr_group_list[e].attr_list) 0 == e && 0 == o && (t.data.attr_group_list[e].attr_list[o].checked = !0);
        t.setData({
            attr_group_list: t.data.attr_group_list
        });
    },
    countDownRun: function(t) {
        var e = this;
        setInterval(function() {
            var o = new Date(t[0], t[1] - 1, t[2], t[3], t[4], t[5]) - new Date(), a = parseInt(o / 1e3 / 60 / 60 / 24, 10), i = parseInt(o / 1e3 / 60 / 60 % 24, 10), r = parseInt(o / 1e3 / 60 % 60, 10), s = parseInt(o / 1e3 % 60, 10);
            a = e.checkTime(a), i = e.checkTime(i), r = e.checkTime(r), s = e.checkTime(s), 
            e.setData({
                limit_time: {
                    days: a,
                    hours: i,
                    mins: r,
                    secs: s
                }
            });
        }, 1e3);
    },
    checkTime: function(t) {
        return (t = t > 0 ? t : 0) < 10 && (t = "0" + t), t;
    },
    goToHome: function() {
        getApp().core.redirectTo({
            url: "/pages/pt/index/index"
        });
    },
    goToGoodsDetails: function(t) {
        var e = this;
        getApp().core.redirectTo({
            url: "/pages/pt/details/details?gid=" + e.data.goods.id
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
    attrClick: function(t) {
        var e = this, o = t.target.dataset.groupId, a = t.target.dataset.id, i = e.data.attr_group_list;
        for (var r in i) if (i[r].attr_group_id == o) for (var s in i[r].attr_list) i[r].attr_list[s].attr_id == a ? i[r].attr_list[s].checked = !0 : i[r].attr_list[s].checked = !1;
        e.setData({
            attr_group_list: i
        });
        var d = [], n = !0;
        for (var r in i) {
            var c = !1;
            for (var s in i[r].attr_list) if (i[r].attr_list[s].checked) {
                d.push(i[r].attr_list[s].attr_id), c = !0;
                break;
            }
            if (!c) {
                n = !1;
                break;
            }
        }
        n && (getApp().core.showLoading({
            title: "正在加载",
            mask: !0
        }), getApp().request({
            url: getApp().api.group.goods_attr_info,
            data: {
                goods_id: e.data.goods.id,
                group_id: e.data.goods.class_group,
                attr_list: JSON.stringify(d)
            },
            success: function(t) {
                if (getApp().core.hideLoading(), 0 == t.code) {
                    var o = e.data.goods;
                    o.price = t.data.price, o.num = t.data.num, o.attr_pic = t.data.pic, e.setData({
                        goods: o
                    });
                }
            }
        }));
    },
    buyNow: function() {
        this.submit("GROUP_BUY_C");
    },
    submit: function(t) {
        var e = this;
        if (!e.data.show_attr_picker) return e.setData({
            show_attr_picker: !0
        }), !0;
        if (e.data.form.number > e.data.goods.num) return getApp().core.showToast({
            title: "商品库存不足，请选择其它规格或数量",
            image: "/images/icon-warning.png"
        }), !0;
        var o = e.data.attr_group_list, a = [];
        for (var i in o) {
            var r = !1;
            for (var s in o[i].attr_list) if (o[i].attr_list[s].checked) {
                r = {
                    attr_id: o[i].attr_list[s].attr_id,
                    attr_name: o[i].attr_list[s].attr_name
                };
                break;
            }
            if (!r) return getApp().core.showToast({
                title: "请选择" + o[i].attr_group_name,
                image: "/images/icon-warning.png"
            }), !0;
            a.push({
                attr_group_id: o[i].attr_group_id,
                attr_group_name: o[i].attr_group_name,
                attr_id: r.attr_id,
                attr_name: r.attr_name
            });
        }
        e.setData({
            show_attr_picker: !1
        }), getApp().core.redirectTo({
            url: "/pages/pt/order-submit/order-submit?goods_info=" + JSON.stringify({
                goods_id: e.data.goods.id,
                attr: a,
                num: e.data.form.number,
                type: t,
                parent_id: e.data.oid,
                deliver_type: e.data.goods.type,
                group_id: e.data.goods.class_group
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
            content: "最多只允许购买" + t.data.goods.one_buy_limit,
            showCancel: !1
        }) : t.setData({
            form: {
                number: e
            }
        });
    },
    numberBlur: function(t) {
        var e = this, o = t.detail.value;
        if (o = parseInt(o), isNaN(o) && (o = 1), o <= 0 && (o = 1), o > e.data.goods.one_buy_limit && 0 != e.data.goods.one_buy_limit) return getApp().core.showModal({
            title: "提示",
            content: "最多只允许购买" + e.data.goods.one_buy_limit + "件",
            showCancel: !1
        }), void e.setData({
            form: {
                number: o
            }
        });
        e.setData({
            form: {
                number: o
            }
        });
    },
    goArticle: function(t) {
        this.data.group_rule_id && getApp().core.navigateTo({
            url: "/pages/article-detail/article-detail?id=" + this.data.group_rule_id
        });
    },
    showShareModal: function(t) {
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
            url: getApp().api.group.order.goods_qrcode,
            data: {
                order_id: t.data.oid
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
}), e));