var t = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(t) {
    return typeof t;
} : function(t) {
    return t && "function" == typeof Symbol && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
};

module.exports = {
    currentPage: null,
    init: function(t) {
        var e = this;
        e.currentPage = t, void 0 === t.switchTab && (t.switchTab = function(t) {
            e.switchTab(t);
        }), void 0 === t.descInput && (t.descInput = function(t) {
            e.descInput(t);
        }), void 0 === t.chooseImage && (t.chooseImage = function(t) {
            e.chooseImage(t);
        }), void 0 === t.deleteImage && (t.deleteImage = function(t) {
            e.deleteImage(t);
        }), void 0 === t.refundSubmit && (t.refundSubmit = function(t) {
            e.refundSubmit(t);
        });
    },
    switchTab: function(t) {
        var e = this.currentPage;
        1 == t.currentTarget.dataset.id ? e.setData({
            switch_tab_1: "active",
            switch_tab_2: ""
        }) : e.setData({
            switch_tab_1: "",
            switch_tab_2: "active"
        });
    },
    descInput: function(t) {
        var e = this.currentPage, a = t.currentTarget.dataset.type, i = t.detail.value;
        if (1 == a) {
            var o = e.data.refund_data_1;
            o.desc = i, e.setData({
                refund_data_1: o
            });
        }
        if (2 == a) {
            var c = e.data.refund_data_2;
            c.desc = i, e.setData({
                refund_data_2: c
            });
        }
    },
    chooseImage: function(t) {
        var e = this.currentPage, a = t.currentTarget.dataset.type;
        if (1 == a) {
            var i = e.data.refund_data_1, o = 0;
            i.pic_list && (o = i.pic_list.length || 0);
            n = 6 - o;
            getApp().core.chooseImage({
                count: n,
                success: function(t) {
                    i.pic_list || (i.pic_list = []), i.pic_list = i.pic_list.concat(t.tempFilePaths), 
                    e.setData({
                        refund_data_1: i
                    });
                }
            });
        }
        if (2 == a) {
            var c = e.data.refund_data_2, o = 0;
            c.pic_list && (o = c.pic_list.length || 0);
            var n = 6 - o;
            getApp().core.chooseImage({
                count: n,
                success: function(t) {
                    c.pic_list || (c.pic_list = []), c.pic_list = c.pic_list.concat(t.tempFilePaths), 
                    e.setData({
                        refund_data_2: c
                    });
                }
            });
        }
    },
    deleteImage: function(t) {
        var e = this.currentPage, a = t.currentTarget.dataset.type, i = t.currentTarget.dataset.index;
        if (1 == a) {
            var o = e.data.refund_data_1;
            o.pic_list.splice(i, 1), e.setData({
                refund_data_1: o
            });
        }
        if (2 == a) {
            var c = e.data.refund_data_2;
            c.pic_list.splice(i, 1), e.setData({
                refund_data_2: c
            });
        }
    },
    refundSubmit: function(e) {
        var a = this.currentPage, i = e.currentTarget.dataset.type, o = e.detail.formId;
        if (1 == i) {
            var c, n, d, r, s = function() {
                var t = function() {
                    getApp().core.showLoading({
                        title: "正在提交",
                        mask: !0
                    }), getApp().request({
                        url: n,
                        method: "post",
                        data: {
                            type: 1,
                            order_detail_id: a.data.goods.order_detail_id,
                            desc: u,
                            pic_list: JSON.stringify(p),
                            form_id: o,
                            orderType: r
                        },
                        success: function(t) {
                            getApp().core.hideLoading(), 0 == t.code && getApp().core.showModal({
                                title: "提示",
                                content: t.msg,
                                showCancel: !1,
                                success: function(t) {
                                    t.confirm && getApp().core.redirectTo({
                                        url: d
                                    });
                                }
                            }), 1 == t.code && getApp().core.showModal({
                                title: "提示",
                                content: t.msg,
                                showCancel: !1,
                                success: function(t) {
                                    t.confirm && getApp().core.navigateBack({
                                        delta: 2
                                    });
                                }
                            });
                        }
                    });
                };
                if (0 == (u = a.data.refund_data_1.desc || "").length) return getApp().core.showToast({
                    title: "请填写退款原因",
                    image: "/images/icon-warning.png"
                }), {
                    v: void 0
                };
                if (p = [], l = 0, c = a.data.pageType, n = getApp().api.order.refund, d = "", r = "", 
                "STORE" === c) d = "/pages/order/order?status=4", r = "STORE"; else if ("PINTUAN" === c) d = "/pages/pt/order/order?status=4", 
                r = "PINTUAN"; else {
                    if ("MIAOSHA" !== c) return getApp().core.showModal({
                        title: "提示",
                        content: "pageType变量未定义或变量值不是预期的"
                    }), {
                        v: void 0
                    };
                    d = "/pages/miaosha/order/order?status=4", r = "MIAOSHA";
                }
                if (a.data.refund_data_1.pic_list && a.data.refund_data_1.pic_list.length > 0) {
                    getApp().core.showLoading({
                        title: "正在上传图片",
                        mask: !0
                    });
                    for (f in a.data.refund_data_1.pic_list) !function(e) {
                        getApp().core.uploadFile({
                            url: getApp().api.default.upload_image,
                            filePath: a.data.refund_data_1.pic_list[e],
                            name: "image",
                            success: function(t) {},
                            complete: function(i) {
                                l++, 200 == i.statusCode && 0 == (i = JSON.parse(i.data)).code && (p[e] = i.data.url), 
                                l == a.data.refund_data_1.pic_list.length && (getApp().core.hideLoading(), t());
                            }
                        });
                    }(f);
                } else t();
            }();
            if ("object" === (void 0 === s ? "undefined" : t(s))) return s.v;
        }
        if (2 == i) {
            var u, p, l, f, g = function() {
                var t = function() {
                    getApp().core.showLoading({
                        title: "正在提交",
                        mask: !0
                    }), getApp().request({
                        url: n,
                        method: "post",
                        data: {
                            type: 2,
                            order_detail_id: a.data.goods.order_detail_id,
                            desc: u,
                            pic_list: JSON.stringify(p)
                        },
                        success: function(t) {
                            getApp().core.hideLoading(), 0 == t.code && getApp().core.showModal({
                                title: "提示",
                                content: t.msg,
                                showCancel: !1,
                                success: function(t) {
                                    t.confirm && getApp().core.redirectTo({
                                        url: d
                                    });
                                }
                            }), 1 == t.code && getApp().core.showModal({
                                title: "提示",
                                content: t.msg,
                                showCancel: !1,
                                success: function(t) {
                                    t.confirm && getApp().core.navigateBack({
                                        delta: 2
                                    });
                                }
                            });
                        }
                    });
                };
                if (0 == (u = a.data.refund_data_2.desc || "").length) return getApp().core.showToast({
                    title: "请填写换货说明",
                    image: "/images/icon-warning.png"
                }), {
                    v: void 0
                };
                if (p = [], l = 0, a.data.refund_data_2.pic_list && a.data.refund_data_2.pic_list.length > 0) {
                    getApp().core.showLoading({
                        title: "正在上传图片",
                        mask: !0
                    });
                    for (f in a.data.refund_data_2.pic_list) !function(e) {
                        getApp().core.uploadFile({
                            url: getApp().api.default.upload_image,
                            filePath: a.data.refund_data_2.pic_list[e],
                            name: "image",
                            success: function(t) {},
                            complete: function(i) {
                                l++, 200 == i.statusCode && 0 == (i = JSON.parse(i.data)).code && (p[e] = i.data.url), 
                                l == a.data.refund_data_2.pic_list.length && (getApp().core.hideLoading(), t());
                            }
                        });
                    }(f);
                } else t();
            }();
            if ("object" === (void 0 === g ? "undefined" : t(g))) return g.v;
        }
    }
};