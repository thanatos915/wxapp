Page({
    data: {
        total_price: 0,
        cart_check_all: !1,
        cart_list: [],
        mch_list: [],
        loading: !0,
        check_all_self: !1
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
    },
    onReady: function() {},
    onShow: function() {
        getApp().page.onShow(this);
        var t = this;
        t.setData({
            cart_check_all: !1,
            show_cart_edit: !1,
            check_all_self: !1
        }), t.getCartList();
    },
    getCartList: function() {
        var t = this;
        getApp().core.showNavigationBarLoading(), t.setData({
            show_no_data_tip: !1,
            loading: !0
        }), getApp().request({
            url: getApp().api.cart.list,
            success: function(a) {
                0 == a.code && t.setData({
                    cart_list: a.data.list,
                    mch_list: a.data.mch_list,
                    total_price: 0,
                    cart_check_all: !1,
                    show_cart_edit: !1
                }), t.setData({
                    show_no_data_tip: 0 == t.data.cart_list.length
                });
            },
            complete: function() {
                getApp().core.hideNavigationBarLoading(), t.setData({
                    loading: !1
                });
            }
        });
    },
    cartLess: function(t) {
        var a = this;
        if (t.currentTarget.dataset.type && "mch" == t.currentTarget.dataset.type) {
            var i = t.currentTarget.dataset.mchIndex, c = t.currentTarget.dataset.index;
            a.data.mch_list[i].list[c].num = a.data.mch_list[i].list[c].num - 1, a.data.mch_list[i].list[c].price = a.data.mch_list[i].list[c].num * a.data.mch_list[i].list[c].unitPrice, 
            a.setData({
                mch_list: a.data.mch_list
            });
        } else {
            var e = a.data.cart_list;
            for (var s in e) t.currentTarget.id == e[s].cart_id && (e[s].num = a.data.cart_list[s].num - 1, 
            e[s].price = a.data.cart_list[s].unitPrice * e[s].num, a.setData({
                cart_list: e
            }));
        }
        a.updateTotalPrice();
    },
    cartAdd: function(t) {
        var a = this;
        if (t.currentTarget.dataset.type && "mch" == t.currentTarget.dataset.type) {
            var i = t.currentTarget.dataset.mchIndex, c = t.currentTarget.dataset.index;
            a.data.mch_list[i].list[c].num = a.data.mch_list[i].list[c].num + 1, a.data.mch_list[i].list[c].price = a.data.mch_list[i].list[c].num * a.data.mch_list[i].list[c].unitPrice, 
            a.setData({
                mch_list: a.data.mch_list
            });
        } else {
            var e = a.data.cart_list;
            for (var s in e) t.currentTarget.id == e[s].cart_id && (e[s].num = a.data.cart_list[s].num + 1, 
            e[s].price = a.data.cart_list[s].unitPrice * e[s].num, a.setData({
                cart_list: e
            }));
        }
        a.updateTotalPrice();
    },
    cartCheck: function(t) {
        var a = this, i = t.currentTarget.dataset.index, c = t.currentTarget.dataset.type, e = t.currentTarget.dataset.mchIndex;
        "self" == c && (a.data.cart_list[i].checked = !a.data.cart_list[i].checked, a.setData({
            cart_list: a.data.cart_list
        })), "mch" == c && (a.data.mch_list[e].list[i].checked = !a.data.mch_list[e].list[i].checked, 
        a.setData({
            mch_list: a.data.mch_list
        })), a.updateTotalPrice();
    },
    cartCheckAll: function() {
        var t = this, a = t.data.cart_list, i = !1;
        i = !t.data.cart_check_all;
        for (var c in a) a[c].disabled && !t.data.show_cart_edit || (a[c].checked = i);
        if (t.data.mch_list && t.data.mch_list.length) for (var c in t.data.mch_list) for (var e in t.data.mch_list[c].list) t.data.mch_list[c].list[e].checked = i;
        t.setData({
            cart_check_all: i,
            cart_list: a,
            mch_list: t.data.mch_list
        }), t.updateTotalPrice();
    },
    updateTotalPrice: function() {
        var t = this, a = 0, i = t.data.cart_list;
        for (var c in i) i[c].checked && (a += i[c].price);
        for (var c in t.data.mch_list) for (var e in t.data.mch_list[c].list) t.data.mch_list[c].list[e].checked && (a += t.data.mch_list[c].list[e].price);
        t.setData({
            total_price: a.toFixed(2)
        });
    },
    cartSubmit: function() {
        var t = this, a = t.data.cart_list, i = t.data.mch_list, c = [], e = [], s = [], r = [];
        for (var l in a) a[l].checked && (c.push(a[l].cart_id), r.push({
            cart_id: a[l].cart_id
        }));
        c.length > 0 && s.push({
            mch_id: 0,
            goods_list: r
        });
        for (var l in i) {
            var d = [], n = [];
            if (i[l].list && i[l].list.length) for (var h in i[l].list) i[l].list[h].checked && (d.push(i[l].list[h].cart_id), 
            n.push({
                cart_id: i[l].list[h].cart_id
            }));
            d.length && (e.push({
                id: i[l].id,
                cart_id_list: d
            }), s.push({
                mch_id: i[l].id,
                goods_list: n
            }));
        }
        if (0 == c.length && 0 == e.length) return !0;
        getApp().core.showLoading({
            title: "正在提交",
            mask: !0
        }), t.saveCart(function() {
            getApp().core.navigateTo({
                url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(s)
            });
        }), getApp().core.hideLoading();
    },
    cartEdit: function() {
        var t = this, a = t.data.cart_list;
        for (var i in a) a[i].checked = !1;
        t.setData({
            cart_list: a,
            show_cart_edit: !0,
            cart_check_all: !1
        }), t.updateTotalPrice();
    },
    cartDone: function() {
        var t = this, a = t.data.cart_list;
        for (var i in a) a[i].checked = !1;
        t.setData({
            cart_list: a,
            show_cart_edit: !1,
            cart_check_all: !1
        }), t.updateTotalPrice();
    },
    cartDelete: function() {
        var t = this, a = t.data.cart_list, i = [];
        for (var c in a) a[c].checked && i.push(a[c].cart_id);
        if (t.data.mch_list && t.data.mch_list.length) for (var c in t.data.mch_list) for (var e in t.data.mch_list[c].list) t.data.mch_list[c].list[e].checked && i.push(t.data.mch_list[c].list[e].cart_id);
        if (0 == i.length) return !0;
        getApp().core.showModal({
            title: "提示",
            content: "确认删除" + i.length + "项内容？",
            success: function(a) {
                if (a.cancel) return !0;
                getApp().core.showLoading({
                    title: "正在删除",
                    mask: !0
                }), getApp().request({
                    url: getApp().api.cart.delete,
                    data: {
                        cart_id_list: JSON.stringify(i)
                    },
                    success: function(a) {
                        getApp().core.hideLoading(), getApp().core.showToast({
                            title: a.msg
                        }), 0 == a.code && t.getCartList(), a.code;
                    }
                });
            }
        });
    },
    onHide: function() {
        this.saveCart();
    },
    onUnload: function() {
        this.saveCart();
    },
    saveCart: function(t) {
        var a = this, i = JSON.stringify(a.data.cart_list);
        getApp().request({
            url: getApp().api.cart.cart_edit,
            method: "post",
            data: {
                list: i,
                mch_list: JSON.stringify(a.data.mch_list)
            },
            success: function(t) {
                t.code;
            },
            complete: function() {
                "function" == typeof t && t();
            }
        });
    },
    checkGroup: function(t) {
        var a = this, i = t.currentTarget.dataset.type, c = t.currentTarget.dataset.index;
        if ("self" == i) {
            for (var e in a.data.cart_list) a.data.cart_list[e].checked = !a.data.check_all_self;
            a.setData({
                check_all_self: !a.data.check_all_self,
                cart_list: a.data.cart_list
            });
        }
        if ("mch" == i) {
            for (var e in a.data.mch_list[c].list) a.data.mch_list[c].list[e].checked = !a.data.mch_list[c].checked_all;
            a.data.mch_list[c].checked_all = !a.data.mch_list[c].checked_all, a.setData({
                mch_list: a.data.mch_list
            });
        }
        a.updateTotalPrice();
    }
});