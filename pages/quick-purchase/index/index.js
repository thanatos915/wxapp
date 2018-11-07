var t = require("../../../components/shopping_cart/shopping_cart.js"), o = require("../../../components/specifications_model/specifications_model.js");

Page({
    data: {
        quick_list: [],
        goods_list: [],
        carGoods: [],
        currentGood: {},
        checked_attr: [],
        checkedGood: [],
        attr_group_list: [],
        temporaryGood: {
            price: 0,
            num: 0,
            use_attr: 1
        },
        check_goods_price: 0,
        showModal: !1,
        checked: !1,
        cat_checked: !1,
        color: "",
        total: {
            total_price: 0,
            total_num: 0
        }
    },
    onLoad: function(t) {
        getApp().page.onLoad(this, t);
    },
    onShow: function() {
        getApp().page.onShow(this), t.init(this), o.init(this, t), this.loadData();
    },
    onHide: function() {
        getApp().page.onHide(this), t.saveItemData(this);
    },
    onUnload: function() {
        getApp().page.onUnload(this), t.saveItemData(this);
    },
    loadData: function(t) {
        var o = this, a = getApp().core.getStorageSync(getApp().const.ITEM), e = {
            total_num: 0,
            total_price: 0
        };
        o.setData({
            total: void 0 !== a.total ? a.total : e,
            carGoods: void 0 !== a.carGoods ? a.carGoods : []
        }), getApp().core.showLoading({
            title: "加载中"
        }), getApp().request({
            url: getApp().api.quick.quick,
            success: function(t) {
                if (getApp().core.hideLoading(), 0 == t.code) {
                    var e = t.data.list, s = [], i = [];
                    for (var c in e) if (e[c].goods.length > 0) {
                        i.push(e[c]);
                        for (var d in e[c].goods) {
                            var n = o.data.carGoods;
                            for (var r in n) a.carGoods[r].goods_id === parseInt(e[c].goods[d].id) && (e[c].goods[d].num = e[c].goods[d].num ? e[c].goods[d].num : 0, 
                            e[c].goods[d].num += a.carGoods[r].num);
                            parseInt(e[c].goods[d].hot_cakes) && s.push(e[c].goods[d]);
                        }
                    }
                    o.setData({
                        quick_hot_goods_lists: s,
                        quick_list: i
                    });
                }
            }
        });
    },
    get_goods_info: function(t) {
        var o = this, a = o.data.carGoods, e = o.data.total, s = o.data.quick_hot_goods_lists, i = o.data.quick_list, c = {
            carGoods: a,
            total: e,
            quick_hot_goods_lists: s,
            check_num: o.data.check_num,
            quick_list: i
        };
        getApp().core.setStorageSync(getApp().const.ITEM, c);
        var d = t.currentTarget.dataset.id;
        getApp().core.navigateTo({
            url: "/pages/goods/goods?id=" + d + "&quick=1"
        });
    },
    selectMenu: function(t) {
        var o = t.currentTarget.dataset, a = this.data.quick_list;
        if ("hot_cakes" == o.tag) for (var e = !0, s = a.length, i = 0; i < s; i++) a[i].cat_checked = !1; else {
            for (var c = o.index, s = a.length, i = 0; i < s; i++) a[i].cat_checked = !1, a[i].id == a[c].id && (a[i].cat_checked = !0);
            e = !1;
        }
        this.setData({
            toView: o.tag,
            quick_list: a,
            cat_checked: e
        });
    },
    onShareAppMessage: function(t) {
        getApp().page.onShareAppMessage(this);
        var o = this;
        return {
            path: "/pages/quick-purchase/index/index?user_id=" + getApp().core.getStorageSync(getApp().const.USER_INFO).id,
            success: function(t) {
                1 == ++share_count && o.shareSendCoupon(o);
            }
        };
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
    buynow: function(o) {
        var a = this, e = a.data.carGoods;
        a.data.goodsModel;
        a.setData({
            goodsModel: !1
        });
        for (var s = e.length, i = [], c = [], d = 0; d < s; d++) 0 != e[d].num && (c = {
            goods_id: e[d].goods_id,
            num: e[d].num,
            attr: e[d].attr
        }, i.push(c));
        var n = [];
        n.push({
            mch_id: 0,
            goods_list: i
        }), getApp().core.navigateTo({
            url: "/pages/new-order-submit/new-order-submit?mch_list=" + JSON.stringify(n)
        }), t.clearShoppingCart();
    }
});