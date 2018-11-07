module.exports = {
    currentPage: null,
    init: function(t) {
        var a = this;
        a.currentPage = t, void 0 === t.previewImage && (t.previewImage = function(t) {
            a.previewImage(t);
        }), void 0 === t.showAttrPicker && (t.showAttrPicker = function(t) {
            a.showAttrPicker(t);
        }), void 0 === t.hideAttrPicker && (t.hideAttrPicker = function(t) {
            a.hideAttrPicker(t);
        }), void 0 === t.storeAttrClick && (t.storeAttrClick = function(t) {
            a.storeAttrClick(t);
        }), void 0 === t.numberAdd && (t.numberAdd = function(t) {
            a.numberAdd(t);
        }), void 0 === t.numberSub && (t.numberSub = function(t) {
            a.numberSub(t);
        }), void 0 === t.numberBlur && (t.numberBlur = function(t) {
            a.numberBlur(t);
        });
    },
    previewImage: function(t) {
        var a = t.currentTarget.dataset.url;
        getApp().core.previewImage({
            urls: [ a ]
        });
    },
    hideAttrPicker: function() {
        this.currentPage.setData({
            show_attr_picker: !1
        });
    },
    showAttrPicker: function() {
        this.currentPage.setData({
            show_attr_picker: !0
        });
    },
    groupCheck: function() {
        var t = this, a = t.data.attr_group_num, r = t.data.attr_group_num.attr_list;
        for (var i in r) r[i].checked = !1;
        a.attr_list = r;
        t.data.goods;
        t.setData({
            group_checked: 0,
            attr_group_num: a
        });
        var e = t.data.attr_group_list, o = [], d = !0;
        for (var i in e) {
            var s = !1;
            for (var n in e[i].attr_list) if (e[i].attr_list[n].checked) {
                o.push(e[i].attr_list[n].attr_id), s = !0;
                break;
            }
            if (!s) {
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
                goods_id: t.data.goods.id,
                group_id: t.data.group_checked,
                attr_list: JSON.stringify(o)
            },
            success: function(a) {
                if (getApp().core.hideLoading(), 0 == a.code) {
                    var r = t.data.goods;
                    r.price = a.data.price, r.num = a.data.num, r.attr_pic = a.data.pic, r.original_price = a.data.single, 
                    t.setData({
                        goods: r
                    });
                }
            }
        }));
    },
    attrNumClick: function(t) {
        var a = this.currentPage, r = t.target.dataset.id, i = a.data.attr_group_num, e = i.attr_list;
        for (var o in e) e[o].id == r ? e[o].checked = !0 : e[o].checked = !1;
        i.attr_list = e, a.setData({
            attr_group_num: i,
            group_checked: r
        });
        var d = a.data.attr_group_list, s = [], n = !0;
        for (var o in d) {
            var c = !1;
            for (var u in d[o].attr_list) if (d[o].attr_list[u].checked) {
                s.push(d[o].attr_list[u].attr_id), c = !0;
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
                goods_id: a.data.goods.id,
                group_id: a.data.group_checked,
                attr_list: JSON.stringify(s)
            },
            success: function(t) {
                if (getApp().core.hideLoading(), 0 == t.code) {
                    var r = a.data.goods;
                    r.price = t.data.price, r.num = t.data.num, r.attr_pic = t.data.pic, r.original_price = t.data.single, 
                    a.setData({
                        goods: r
                    });
                }
            }
        }));
    },
    storeAttrClick: function(t) {
        var a = this.currentPage, r = this, i = t.target.dataset.groupId, e = parseInt(t.target.dataset.id), o = a.data.attr_group_list;
        "string" == typeof (A = a.data.goods.attr) && (A = JSON.parse(A));
        for (var d in o) if (o[d].attr_group_id == i) for (var s in o[d].attr_list) {
            var n = o[d].attr_list[s];
            if (parseInt(n.attr_id) === e && n.checked ? n.checked = !1 : n.checked = parseInt(n.attr_id) === e, 
            n.attr_id === e && n.attr_num_0) return void (n.checked = !1);
        }
        var c = [];
        for (var d in A) if (0 === A[d].num) {
            var u = [];
            for (var p in A[d].attr_list) u.push(A[d].attr_list[p].attr_id);
            c.push(u);
        }
        var g = [];
        for (var d in o) for (var s in o[d].attr_list) o[d].attr_list[s].checked && g.push(o[d].attr_list[s].attr_id);
        var _ = [];
        for (var d in g) for (var s in c) if (getApp().helper.inArray(g[d], c[s])) for (var l in c[s]) c[s][l] !== g[d] && _.push(c[s][l]);
        for (var d in o) for (var s in o[d].attr_list) {
            var f = o[d].attr_list[s];
            f.attr_num_0 = getApp().helper.inArray(f.attr_id, _);
        }
        a.setData({
            attr_group_list: o
        });
        var h = [], v = !0;
        for (var d in o) {
            var m = !1;
            for (var s in o[d].attr_list) if (o[d].attr_list[s].checked) {
                if ("INTEGRAL" !== a.data.pageType) {
                    h.push(o[d].attr_list[s].attr_id), m = !0;
                    break;
                }
                var A = {
                    attr_id: o[d].attr_list[s].attr_id,
                    attr_name: o[d].attr_list[s].attr_name
                };
                h.push(A);
            }
            if ("INTEGRAL" !== a.data.pageType && !m) {
                v = !1;
                break;
            }
        }
        if ("INTEGRAL" === a.data.pageType || v) {
            getApp().core.showLoading({
                title: "正在加载",
                mask: !0
            });
            var k = a.data.pageType;
            if ("STORE" === k) b = getApp().api.default.goods_attr_info; else if ("PINTUAN" === k) b = getApp().api.group.goods_attr_info; else {
                if ("INTEGRAL" === k) return getApp().core.hideLoading(), void r.integralMallAttrClick(h);
                if ("BOOK" === k) return getApp().core.hideLoading(), void r.bookAttrGoodsClick(h);
                if ("MIAOSHA" !== k) return getApp().core.showModal({
                    title: "提示",
                    content: "pageType变量未定义或变量值不是预期的"
                }), void getApp().core.hideLoading();
                var b = getApp().api.default.goods_attr_info;
            }
            getApp().request({
                url: b,
                data: {
                    goods_id: "MIAOSHA" === k ? a.data.id : a.data.goods.id,
                    group_id: a.data.group_checked,
                    attr_list: JSON.stringify(h),
                    type: "MIAOSHA" === k ? "ms" : ""
                },
                success: function(t) {
                    if (getApp().core.hideLoading(), 0 == t.code) {
                        var r = a.data.goods;
                        if (r.price = t.data.price, r.num = t.data.num, r.attr_pic = t.data.pic, r.original_price = t.data.single, 
                        "MIAOSHA" === k) {
                            var i = t.data.miaosha;
                            r.price = i.miaosha_price, a.setData({
                                miaosha_data: i
                            });
                        }
                        a.setData({
                            goods: r
                        });
                    }
                }
            });
        }
    },
    attrClick: function(t) {
        var a = this, r = t.target.dataset.groupId, i = t.target.dataset.id, e = a.data.attr_group_list;
        for (var o in e) if (e[o].attr_group_id == r) for (var d in e[o].attr_list) e[o].attr_list[d].attr_id == i ? e[o].attr_list[d].checked = !0 : e[o].attr_list[d].checked = !1;
        a.setData({
            attr_group_list: e
        });
        var s = [], n = !0;
        for (var o in e) {
            var c = !1;
            for (var d in e[o].attr_list) if (e[o].attr_list[d].checked) {
                s.push(e[o].attr_list[d].attr_id), c = !0;
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
            url: getApp().api.default.goods_attr_info,
            data: {
                goods_id: a.data.id,
                attr_list: JSON.stringify(s),
                type: "ms"
            },
            success: function(t) {
                if (getApp().core.hideLoading(), 0 == t.code) {
                    var r = a.data.goods;
                    r.price = t.data.price, r.num = t.data.num, r.attr_pic = t.data.pic, a.setData({
                        goods: r,
                        miaosha_data: t.data.miaosha
                    });
                }
            }
        }));
    },
    bookAttrGoodsClick: function(t) {
        var a = this.currentPage, r = a.data.goods;
        r.attr.forEach(function(i, e, o) {
            var d = [];
            i.attr_list.forEach(function(t, a, r) {
                d.push(t.attr_id);
            }), t.sort().toString() == d.sort().toString() && (r.attr_pic = i.pic, r.num = i.num, 
            r.price = i.price, a.setData({
                goods: r
            }));
        });
    },
    integralMallAttrClick: function(t) {
        var a = this.currentPage, r = a.data.goods, i = r.attr, e = 0, o = 0;
        for (var d in i) JSON.stringify(i[d].attr_list) == JSON.stringify(t) && (e = parseFloat(i[d].price) > 0 ? i[d].price : r.price, 
        o = parseInt(i[d].integral) > 0 ? i[d].integral : r.integral, r.num = i[d].num, 
        a.setData({
            attr_integral: o,
            attr_num: i[d].num,
            attr_price: e,
            status: "attr",
            goods: r
        }));
    },
    numberSub: function() {
        var t = this.currentPage, a = t.data.form.number;
        if (a <= 1) return !0;
        a--, t.setData({
            form: {
                number: a
            }
        });
    },
    numberAdd: function() {
        var t = this.currentPage, a = t.data.form.number;
        ++a > t.data.goods.one_buy_limit && 0 != t.data.goods.one_buy_limit ? getApp().core.showModal({
            title: "提示",
            content: "数量超过最大限购数",
            showCancel: !1,
            success: function(t) {}
        }) : t.setData({
            form: {
                number: a
            }
        });
    },
    numberBlur: function(t) {
        var a = this.currentPage, r = t.detail.value;
        r = parseInt(r), isNaN(r) && (r = 1), r <= 0 && (r = 1), r > a.data.goods.one_buy_limit && 0 != a.data.goods.one_buy_limit && (getApp().core.showModal({
            title: "提示",
            content: "数量超过最大限购数",
            showCancel: !1,
            success: function(t) {}
        }), r = a.data.goods.one_buy_limit), a.setData({
            form: {
                number: r
            }
        });
    }
};